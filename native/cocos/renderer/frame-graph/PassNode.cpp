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

#include "PassNode.h"
#include <algorithm>
#include "FrameGraph.h"
#include "ResourceNode.h"

namespace cc {
namespace framegraph {

PassNode::PassNode(const PassInsertPoint inserPoint, const StringHandle name, const ID &id, Executable *pass)
: _pass(pass),
  _name(name),
  _id(id),
  _insertPoint(inserPoint) {
    CC_ASSERT(_name.isValid());
}

Handle PassNode::read(FrameGraph & /*graph*/, const Handle &input) {
    const auto it = std::find_if(_reads.begin(), _reads.end(), [input](const Handle handle) {
        return input == handle;
    });

    if (it == _reads.end()) {
        _reads.push_back(input);
    }

    return input;
}

Handle PassNode::write(FrameGraph &graph, const Handle &output) {
    CC_ASSERT(std::find_if(_writes.begin(), _writes.end(), [output](const Handle handle) {
                  return output == handle;
              }) == _writes.end());

    const ResourceNode &nodeOldVersion = graph.getResourceNode(output);
    nodeOldVersion.virtualResource->newVersion();
    _sideEffect                  = _sideEffect || nodeOldVersion.virtualResource->isImported();
    const Handle  handle         = graph.createResourceNode(nodeOldVersion.virtualResource);
    ResourceNode &nodeNewVersion = graph.getResourceNode(handle);
    nodeNewVersion.writer        = this;
    _writes.push_back(handle);
    return handle;
}

void PassNode::createRenderTargetAttachment(RenderTargetAttachment &&attachment) {
    if (attachment.desc.usage == RenderTargetAttachment::Usage::COLOR) {
        if (attachment.desc.slot == 0xff) {
            for (uint8_t i = 0; i < RenderTargetAttachment::DEPTH_STENCIL_SLOT_START; ++i) {
                if ((_usedRenderTargetSlotMask & (1 << i)) == 0) {
                    attachment.desc.slot = i;
                    break;
                }
            }
        } else {
            CC_ASSERT(attachment.desc.slot < RenderTargetAttachment::DEPTH_STENCIL_SLOT_START);
        }
    } else {
        attachment.desc.slot = RenderTargetAttachment::DEPTH_STENCIL_SLOT_START + static_cast<uint8_t>(attachment.desc.usage) - 1;

        if (attachment.desc.usage == RenderTargetAttachment::Usage::DEPTH_STENCIL) {
            CC_ASSERT((_usedRenderTargetSlotMask & (1 << (RenderTargetAttachment::DEPTH_STENCIL_SLOT_START + static_cast<uint8_t>(RenderTargetAttachment::Usage::DEPTH) - 1))) == 0);
            CC_ASSERT((_usedRenderTargetSlotMask & (1 << (RenderTargetAttachment::DEPTH_STENCIL_SLOT_START + static_cast<uint8_t>(RenderTargetAttachment::Usage::STENCIL) - 1))) == 0);
        } else {
            CC_ASSERT((_usedRenderTargetSlotMask & (1 << (RenderTargetAttachment::DEPTH_STENCIL_SLOT_START + static_cast<uint8_t>(attachment.desc.usage) - 1))) == 0);
        }
    }

    CC_ASSERT((_usedRenderTargetSlotMask & (1 << attachment.desc.slot)) == 0);
    _usedRenderTargetSlotMask |= (1 << attachment.desc.slot);

    _attachments.emplace_back(attachment);
    _hasClearedAttachment = _hasClearedAttachment || (attachment.desc.loadOp == gfx::LoadOp::CLEAR);
}

bool PassNode::canMerge(const FrameGraph &graph, const PassNode &passNode) const {
    const size_t attachmentCount = _attachments.size();

    if (passNode._hasClearedAttachment || attachmentCount != passNode._attachments.size()) {
        return false;
    }

    for (size_t i = 0; i < attachmentCount; ++i) {
        const RenderTargetAttachment &attachmentInPassNodeA = _attachments[i];
        const RenderTargetAttachment &attachmentInPassNodeB = passNode._attachments[i];

        if (attachmentInPassNodeA.desc.usage != attachmentInPassNodeB.desc.usage ||
            attachmentInPassNodeA.desc.slot != attachmentInPassNodeB.desc.slot ||
            attachmentInPassNodeA.desc.writeMask != attachmentInPassNodeB.desc.writeMask ||
            attachmentInPassNodeA.level != attachmentInPassNodeB.level ||
            attachmentInPassNodeA.layer != attachmentInPassNodeB.layer ||
            attachmentInPassNodeA.index != attachmentInPassNodeB.index ||
            graph.getResourceNode(attachmentInPassNodeA.textureHandle).virtualResource != graph.getResourceNode(attachmentInPassNodeB.textureHandle).virtualResource) {
            return false;
        }
    }

    return true;
}

RenderTargetAttachment *PassNode::getRenderTargetAttachment(const Handle &handle) {
    const auto it = std::find_if(_attachments.begin(), _attachments.end(), [&handle](const RenderTargetAttachment &attachment) {
        return attachment.textureHandle == handle;
    });

    return it == _attachments.end() ? nullptr : &(*it);
}

RenderTargetAttachment *PassNode::getRenderTargetAttachment(const FrameGraph &graph, const VirtualResource *const resource) {
    const auto it = std::find_if(_attachments.begin(), _attachments.end(), [&](const RenderTargetAttachment &attachment) {
        return graph.getResourceNode(attachment.textureHandle).virtualResource == resource;
    });

    return it == _attachments.end() ? nullptr : &(*it);
}

void PassNode::requestTransientResources() {
    PassNode *it = this;

    do {
        std::for_each(it->_resourceRequestArray.begin(), it->_resourceRequestArray.end(), [](VirtualResource *const resource) {
            if (!resource->isImported()) {
                resource->request();
            }
        });

        it = it->_next;
    } while (it);
}

void PassNode::releaseTransientResources() {
    PassNode *it = this;

    do {
        // resources should be release in the reverse order to stabilize usages between frames
        std::for_each(it->_resourceReleaseArray.rbegin(), it->_resourceReleaseArray.rend(), [](VirtualResource *const resource) {
            if (!resource->isImported()) {
                resource->release();
            }
        });

        it = it->_next;
    } while (it);
}

void PassNode::setDevicePassId(ID const id) {
    PassNode *it = this;

    do {
        it->_devicePassId = id;

        it = it->_next;
    } while (it);
}

Handle PassNode::getWriteResourceNodeHandle(const FrameGraph &graph, const VirtualResource *const resource) const {
    const auto it = std::find_if(_writes.begin(), _writes.end(), [&](const Handle handle) {
        return graph.getResourceNode(handle).virtualResource == resource;
    });

    return it == _writes.end() ? Handle{} : *it;
}

} // namespace framegraph
} // namespace cc
