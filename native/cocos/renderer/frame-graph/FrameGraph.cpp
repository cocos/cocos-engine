/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "FrameGraph.h"

#include "PassNodeBuilder.h"
#include "Resource.h"
#include <algorithm>
#include <fstream>
#include <set>

namespace cc {
namespace framegraph {

namespace {
StringPool stringPool;
}

FrameGraph::~FrameGraph() {
    gc(0);
}

StringHandle FrameGraph::stringToHandle(const char *const name) {
    return stringPool.stringToHandle(name);
}

const char *FrameGraph::handleToString(const StringHandle &handle) noexcept {
    return stringPool.handleToString(handle);
}

void FrameGraph::present(const Handle &input) {
    struct PassDataPresent {};
    static const StringHandle S_NAME_PRESENT = FrameGraph::stringToHandle("Present");
    const ResourceNode &      resourceNode = getResourceNode(input);
    CC_ASSERT(resourceNode.writer);

    addPass<PassDataPresent>(
        resourceNode.writer->_insertPoint, S_NAME_PRESENT,
        [&](PassNodeBuilder &builder, PassDataPresent & /*data*/) {
            builder.read(input);
            builder.sideEffect();
        },
        [](const PassDataPresent &data, const DevicePassResourceTable &table) {
        });
}

void FrameGraph::presentLastVersion(const VirtualResource *const virtualResource) {
    const auto it = std::find_if(_resourceNodes.rbegin(), _resourceNodes.rend(), [&virtualResource](const ResourceNode &node) {
        return node.virtualResource == virtualResource;
    });

    CC_ASSERT(it != _resourceNodes.rend());
    present(Handle(static_cast<Handle::IndexType>(it.base() - _resourceNodes.begin() - 1)));
}

void FrameGraph::presentFromBlackboard(const StringHandle &inputName) {
    present(Handle(_blackboard.get(inputName)));
}

void FrameGraph::compile() {
    sort();
    cull();
    computeResourceLifetime();

    if (_merge) {
        mergePassNodes();
    }

    computeStoreActionAndMemoryless();
    generateDevicePasses();
}

void FrameGraph::execute() noexcept {
    for (auto &pass : _devicePasses) {
        pass->execute();
    }
}

void FrameGraph::reset() noexcept {
    _passNodes.clear();
    _resourceNodes.clear();
    _virtualResources.clear();
    _devicePasses.clear();
    _blackboard.clear();
}

void FrameGraph::gc(uint32_t const unusedFrameCount) noexcept {
    Buffer::Allocator::getInstance().gc(unusedFrameCount);
    Framebuffer::Allocator::getInstance().gc(unusedFrameCount);
    RenderPass::Allocator::getInstance().gc(unusedFrameCount);
    Texture::Allocator::getInstance().gc(unusedFrameCount);
}

void FrameGraph::move(const TextureHandle from, const TextureHandle to, uint8_t mipmapLevel, uint8_t faceId, uint8_t arrayPosition) noexcept {
    const ResourceNode &fromResourceNode = getResourceNode(from);
    const ResourceNode &toResourceNode   = getResourceNode(to);

    CC_ASSERT(!fromResourceNode.virtualResource->isImported());
    CC_ASSERT(fromResourceNode.writer);
    CC_ASSERT(!toResourceNode.writer);

    const gfx::TextureInfo &toTextureDesc   = static_cast<ResourceEntry<Texture> *>(toResourceNode.virtualResource)->get().getDesc();
    uint const              toTextureWidth  = toTextureDesc.width >> mipmapLevel;
    uint const              toTextureHeight = toTextureDesc.height >> mipmapLevel;
    uint const              toTextureDepth  = toTextureDesc.depth >> mipmapLevel;

    CC_ASSERT(toTextureWidth && toTextureHeight && toTextureDepth);
    CC_ASSERT(toTextureDesc.levelCount > mipmapLevel && toTextureDesc.layerCount > arrayPosition);
    CC_ASSERT(toTextureDesc.type == gfx::TextureType::CUBE && faceId < 6 || faceId == 0);

    for (ResourceNode &resourceNode : _resourceNodes) {
        if (resourceNode.virtualResource == fromResourceNode.virtualResource) {
            resourceNode.virtualResource = toResourceNode.virtualResource;
        }
    }

    for (const auto &passNode : _passNodes) {
        for (auto &attachment : passNode->_attachments) {
            const ResourceNode &attachmentResourceNode = getResourceNode(attachment.textureHandle);

            if (attachmentResourceNode.virtualResource == toResourceNode.virtualResource) {
                const gfx::TextureInfo &attachmentTextureDesc = static_cast<ResourceEntry<Texture> *>(attachmentResourceNode.virtualResource)->get().getDesc();
                CC_ASSERT(attachmentTextureDesc.width >> attachment.level == toTextureWidth &&
                          attachmentTextureDesc.height >> attachment.level == toTextureHeight &&
                          attachmentTextureDesc.depth >> attachment.level == toTextureDepth);
                attachment.level = mipmapLevel;
                attachment.layer = faceId;
                attachment.index = arrayPosition;
            }
        }
    }
}

Handle FrameGraph::create(VirtualResource *const virtualResource) {
    _virtualResources.emplace_back(virtualResource);
    return createResourceNode(virtualResource);
}

PassNode &FrameGraph::createPassNode(const PassInsertPoint insertPoint, const StringHandle &name, Executable *const pass) {
    _passNodes.emplace_back(new PassNode(insertPoint, name, static_cast<ID>(_passNodes.size()), pass));
    return *_passNodes.back();
}

Handle FrameGraph::createResourceNode(VirtualResource *const virtualResource) {
    const size_t index = _resourceNodes.size();
    ResourceNode resourceNode;
    resourceNode.virtualResource = virtualResource;
    resourceNode.version         = virtualResource->_version;
    _resourceNodes.emplace_back(resourceNode);
    return Handle{static_cast<Handle::IndexType>(index)};
}

void FrameGraph::sort() noexcept {
    std::stable_sort(_passNodes.begin(), _passNodes.end(), [](const auto &x, const auto &y) {
        return x->_insertPoint < y->_insertPoint;
    });
}

void FrameGraph::cull() {
    for (const auto &passNode : _passNodes) {
        passNode->_refCount = static_cast<uint32_t>(passNode->_writes.size()) + passNode->_sideEffect;

        for (const Handle handle : passNode->_reads) {
            CC_ASSERT(handle.isValid());
            ++_resourceNodes[handle].readerCount;
        }
    }

    static std::vector<const ResourceNode *> stack;
    stack.clear();
    stack.reserve(_resourceNodes.size());

    for (ResourceNode &resourceNode : _resourceNodes) {
        if (resourceNode.readerCount == 0 && resourceNode.writer) {
            stack.push_back(&resourceNode);
        }
    }

    while (!stack.empty()) {
        PassNode *const writerPassNode = stack.back()->writer;
        stack.pop_back();

        if (writerPassNode) {
            CC_ASSERT(writerPassNode->_refCount);

            if (--writerPassNode->_refCount == 0) {
                CC_ASSERT(!writerPassNode->_sideEffect);

                for (const Handle handle : writerPassNode->_reads) {
                    ResourceNode &resourceNode = _resourceNodes[handle];

                    if (--resourceNode.readerCount == 0) {
                        stack.push_back(&resourceNode);
                    }
                }
            }
        }
    }

    for (const ResourceNode &resourceNode : _resourceNodes) {
        resourceNode.virtualResource->_refCount += resourceNode.readerCount;
    }
}

void FrameGraph::computeResourceLifetime() {
    for (const auto &passNode : _passNodes) {
        if (passNode->_refCount == 0) {
            continue;
        }

        for (const Handle handle : passNode->_reads) {
            _resourceNodes[handle].virtualResource->updateLifetime(passNode.get());
        }

        for (const Handle handle : passNode->_writes) {
            _resourceNodes[handle].virtualResource->updateLifetime(passNode.get());
            ++_resourceNodes[handle].virtualResource->_writerCount;
        }

        std::sort(passNode->_attachments.begin(), passNode->_attachments.end(), RenderTargetAttachment::Sorter());
    }

    for (const auto &resource : _virtualResources) {
        CC_ASSERT(!resource->_firstUsePass == !resource->_lastUsePass);

        if (!resource->_firstUsePass || !resource->_lastUsePass) {
            continue;
        }

        if (resource->_refCount == 0 && !resource->_lastUsePass->getRenderTargetAttachment(*this, resource.get())) {
            continue;
        }

        resource->_firstUsePass->_resourceRequestArray.push_back(resource.get());
        resource->_lastUsePass->_resourceReleaseArray.push_back(resource.get());
    }
}

void FrameGraph::mergePassNodes() noexcept {
    const size_t count         = _passNodes.size();
    size_t       currentPassId = 0;
    size_t       lastPassId    = 0;

    while (currentPassId < count) {
        const auto &currentPassNode = _passNodes[currentPassId];

        if (currentPassNode->_refCount) {
            break;
        }

        ++currentPassId;
    }

    lastPassId = currentPassId;

    while (++currentPassId < count) {
        const auto &currentPassNode = _passNodes[currentPassId];

        if (currentPassNode->_refCount == 0) {
            continue;
        }

        const auto &lastPassNode = _passNodes[lastPassId];

        if (lastPassNode->canMerge(*this, *currentPassNode)) {
            auto *prevPassNode = lastPassNode.get();

            uint16_t distance = 1;

            while (prevPassNode->_next) {
                prevPassNode = prevPassNode->_next;
                ++distance;
            }

            prevPassNode->_next              = currentPassNode.get();
            currentPassNode->_head           = lastPassNode.get();
            currentPassNode->_distanceToHead = distance;
            currentPassNode->_refCount       = 0;

            const size_t attachmentCount = lastPassNode->_attachments.size();

            for (size_t i = 0; i < attachmentCount; ++i) {
                const RenderTargetAttachment &attachmentInLastPassNode    = lastPassNode->_attachments[i];
                const RenderTargetAttachment &attachmentInCurrentPassNode = currentPassNode->_attachments[i];

                ResourceNode &resourceNode = _resourceNodes[attachmentInLastPassNode.textureHandle];
                uint16_t &    writeCount   = resourceNode.virtualResource->_writerCount;
                CC_ASSERT(writeCount > 1);
                --writeCount;

                resourceNode.readerCount += _resourceNodes[attachmentInCurrentPassNode.textureHandle].readerCount;
                resourceNode.readerCount -= attachmentInCurrentPassNode.desc.loadOp == gfx::LoadOp::LOAD;
            }
        } else {
            lastPassId = currentPassId;
        }
    }
}

void FrameGraph::computeStoreActionAndMemoryless() {
    ID   passId                = 0;
    bool lastPassSubPassEnable = false;

    for (const auto &passNode : _passNodes) {
        if (passNode->_refCount == 0) {
            continue;
        }

        ID const oldPassId = passId;
        passId += !passNode->_subpass || lastPassSubPassEnable != passNode->_subpass;
        passId += oldPassId == passId ? passNode->_hasClearedAttachment * !passNode->_clearActionIgnoreable : 0;
        passNode->setDevicePassId(passId);
        lastPassSubPassEnable = passNode->_subpass && !passNode->_subpassEnd;
    }

    const PassNode *                   lastPassNode = nullptr;
    static std::set<VirtualResource *> renderTargets;
    renderTargets.clear();

    for (const auto &passNode : _passNodes) {
        if (passNode->_refCount == 0) {
            continue;
        }

        for (RenderTargetAttachment &attachment : passNode->_attachments) {
            CC_ASSERT(attachment.textureHandle.isValid());
            ResourceNode &resourceNode = getResourceNode(attachment.textureHandle);

            if (resourceNode.virtualResource->isImported() || resourceNode.readerCount) {
                if (passNode->_subpass) {
                    if (passNode->_devicePassId != resourceNode.virtualResource->_lastUsePass->_devicePassId) {
                        attachment.storeOp = gfx::StoreOp::STORE;
                    }
                } else {
                    if (attachment.desc.writeMask) {
                        attachment.storeOp = gfx::StoreOp::STORE;
                    }
                }
            }

            if (passNode->_subpass && attachment.desc.loadOp == gfx::LoadOp::LOAD && resourceNode.version > 1) {
                ResourceNode *const resourceNodePrevVersion = getResourceNode(resourceNode.virtualResource, resourceNode.version - 1);
                CC_ASSERT(resourceNodePrevVersion);

                if (resourceNodePrevVersion->writer->_devicePassId == passNode->_devicePassId) {
                    attachment.desc.loadOp                                                                                               = gfx::LoadOp::DISCARD;
                    resourceNodePrevVersion->writer->getRenderTargetAttachment(*this, resourceNodePrevVersion->virtualResource)->storeOp = gfx::StoreOp::DISCARD;
                }
            }

            if (attachment.desc.loadOp == gfx::LoadOp::LOAD) {
                resourceNode.virtualResource->_neverLoaded = false;
            }

            if (attachment.storeOp == gfx::StoreOp::STORE) {
                resourceNode.virtualResource->_neverStored = false;
            }

            renderTargets.emplace(resourceNode.virtualResource);
        }
    }

    for (VirtualResource *const renderTarget : renderTargets) {
        const gfx::TextureInfo &textureDesc = static_cast<ResourceEntry<Texture> *>(renderTarget)->get().getDesc();

        renderTarget->_memoryless     = renderTarget->_neverLoaded && renderTarget->_neverStored;
        renderTarget->_memorylessMSAA = textureDesc.samples != gfx::SampleCount::X1 && renderTarget->_writerCount < 2;
        // TODO(minggo): memoryless gfx::Texture
    }
}

void FrameGraph::generateDevicePasses() {
    Buffer::Allocator::getInstance().tick();
    Framebuffer::Allocator::getInstance().tick();
    RenderPass::Allocator::getInstance().tick();
    Texture::Allocator::getInstance().tick();

    ID passId = 1;

    static std::vector<PassNode *> subPassNodes;
    subPassNodes.clear();

    for (const auto &passNode : _passNodes) {
        if (passNode->_refCount == 0) {
            continue;
        }

        if (passId != passNode->_devicePassId) {
            _devicePasses.emplace_back(new DevicePass(*this, subPassNodes));

            for (PassNode *const p : subPassNodes) {
                p->releaseTransientResources();
            }

            subPassNodes.clear();
            passId = passNode->_devicePassId;
        }

        passNode->requestTransientResources();
        subPassNodes.emplace_back(passNode.get());
    }

    CC_ASSERT(subPassNodes.size() == 1);
    static const StringHandle S_NAME_PRESENT = FrameGraph::stringToHandle("Present");

    if (subPassNodes.back()->_name != S_NAME_PRESENT) {
        _devicePasses.emplace_back(new DevicePass(*this, subPassNodes));

        for (PassNode *const p : subPassNodes) {
            p->releaseTransientResources();
        }
    }
}

// https://dreampuf.github.io/GraphvizOnline/
void FrameGraph::exportGraphViz(const std::string &path) {
    std::ofstream out(path, std::ios::out | std::ios::binary);
    //out.imbue(std::locale("chs", std::locale::ctype));

    if (out.fail()) {
        return;
    }

    out << "digraph framegraph {\n";
    out << "rankdir = LR\n";
    out << "bgcolor = black\n";
    out << "node [shape=rectangle, fontname=\"helvetica\", fontsize=10]\n\n";

    for (const auto &node : _passNodes) {
        if (node->_head) {
            continue;
        }

        out << "\"P" << node->_id << "\" [label=\"" << node->_name.str();

        const PassNode *currPassNode = node.get();

        if (currPassNode->_head) {
            out << "\\n(merged by pass " << currPassNode->_head->_name.str() << ")";
        } else {
            while (currPassNode->_next) {
                currPassNode = currPassNode->_next;
                out << " & " << currPassNode->_name.str();
            }
        }

        out << "\\nrefs: " << node->_refCount
            << "\\nseq: " << node->_id
            << "\\ndevice pass id: " << node->_devicePassId
            << "\", style=filled, fillcolor="
            << (node->_refCount ? "darkorange" : "darkorange4") << "]\n";
    }

    out << "\n";

    for (const ResourceNode &node : _resourceNodes) {
        if (node.writer && node.writer->_head) {
            continue;
        }

        out << "\"R" << node.virtualResource->_id << "_" << +node.version << "\""
                                                                             "[label=\""
            << node.virtualResource->_name.str() << "\\n(version: " << +node.version << ")"
            << "\\nrefs:" << node.virtualResource->_refCount;

        if (node.virtualResource->_memoryless) {
            out << "\\nMemoryless";
        }

        if (node.virtualResource->_memorylessMSAA) {
            out << "\\nMemorylessMSAA";
        }

        PassNode *const writer = (node.writer && node.writer->_head) ? node.writer->_head : node.writer;

        if (writer) {
            out << "\\n";
            const RenderTargetAttachment *const attachment = writer->getRenderTargetAttachment(*this, node.virtualResource);

            if (attachment) {
                switch (attachment->desc.loadOp) {
                    case gfx::LoadOp::DISCARD:
                        out << "Discard";
                        break;
                    case gfx::LoadOp::CLEAR:
                        out << "Clear";
                        break;
                    default:
                        out << "Load";
                        break;
                }
                out << ", ";
                out << (attachment->storeOp == gfx::StoreOp::DISCARD ? "DontCare" : "Store");
                out << "\\nWriteMask: 0x" << std::hex << static_cast<uint32_t>(attachment->desc.writeMask) << std::dec;
            } else {
                out << "Transfer";
            }
        }

        out << "\", style=filled, fillcolor="
            << ((node.virtualResource->isImported()) ? (node.virtualResource->_refCount ? "palegreen" : "palegreen4") : node.version == 0 ? "pink" : (node.virtualResource->_refCount ? "skyblue" : "skyblue4"))
            << "]\n";
    }

    out << "\n";

    for (const auto &node : _passNodes) {
        if (node->_head) {
            continue;
        }

        out << "P" << node->_id << " -> { ";

        for (const Handle writer : node->_writes) {
            out << "R" << _resourceNodes[writer].virtualResource->_id << "_" << +_resourceNodes[writer].version << " ";
        }

        out << "} [color=red]\n";
    }

    out << "\n";

    for (const ResourceNode &node : _resourceNodes) {
        if (node.writer && node.writer->_head) {
            continue;
        }

        out << "R" << node.virtualResource->_id << "_" << +node.version << " -> { ";

        for (const auto &passNode : _passNodes) {
            if (passNode->_head) {
                continue;
            }

            for (Handle read : passNode->_reads) {
                const ResourceNode *readResourceNode = &_resourceNodes[read];

                if (readResourceNode->writer && readResourceNode->writer->_head) {
                    const Handle resourceNodeHandlePrevVersion = readResourceNode->writer->_head->getWriteResourceNodeHandle(*this, readResourceNode->virtualResource);
                    CC_ASSERT(resourceNodeHandlePrevVersion.isValid());
                    readResourceNode = &getResourceNode(resourceNodeHandlePrevVersion);
                }

                if (readResourceNode->virtualResource->_id == node.virtualResource->_id &&
                    readResourceNode->version == node.version) {
                    out << "P" << passNode->_id << " ";
                }
            }
        }

        out << "} [color=green]\n";
    }

    for (const ResourceNode &node : _resourceNodes) {
        if (node.writer && node.writer->_head) {
            continue;
        }

        out << "R" << node.virtualResource->_id << "_" << +node.version << " -> { ";

        for (const auto &passNode : _passNodes) {
            if (passNode->_head) {
                continue;
            }

            for (const RenderTargetAttachment &attachment : passNode->_attachments) {
                const ResourceNode *readResourceNode = &_resourceNodes[attachment.textureHandle];
                uint16_t const      distanceToHead   = readResourceNode->writer->_distanceToHead;

                if (readResourceNode->writer && readResourceNode->writer->_head) {
                    const Handle resourceNodeHandleHead = readResourceNode->writer->_head->getWriteResourceNodeHandle(*this, readResourceNode->virtualResource);
                    CC_ASSERT(resourceNodeHandleHead.isValid());
                    readResourceNode = &getResourceNode(resourceNodeHandleHead);
                }

                if (readResourceNode->virtualResource == node.virtualResource &&
                    readResourceNode->version == node.version + 1 - distanceToHead) {
                    out << "P" << passNode->_id << " ";
                }
            }
        }

        out << "} [color=red4]\n";
    }

    out << "}" << std::endl;
    out.close();
}

ResourceNode *FrameGraph::getResourceNode(const VirtualResource *const virtualResource, uint8_t version) noexcept {
    const auto it = std::find_if(_resourceNodes.begin(), _resourceNodes.end(), [&](const ResourceNode &node) {
        return node.version == version && node.virtualResource == virtualResource;
    });

    return it == _resourceNodes.end() ? nullptr : &(*it);
}

} // namespace framegraph
} // namespace cc
