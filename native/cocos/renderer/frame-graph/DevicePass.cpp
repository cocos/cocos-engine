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

#include "DevicePass.h"
#include <algorithm>
#include "CallbackPass.h"
#include "DevicePassResourceTable.h"
#include "FrameGraph.h"
#include "PassNode.h"
#include "ResourceNode.h"
#include "gfx-base/GFXCommandBuffer.h"

namespace cc {
namespace framegraph {

DevicePass::DevicePass(const FrameGraph &graph, std::vector<PassNode *> const &subpassNodes) {
    std::vector<RenderTargetAttachment> attachments;

    for (const PassNode *passNode : subpassNodes) {
        append(graph, passNode, &attachments);
    }

    std::sort(attachments.begin(), attachments.end(), RenderTargetAttachment::Sorter());
    std::vector<const gfx::Texture *> renderTargets;

    for (auto &attachment : attachments) {
        const ResourceNode &resourceNode = graph.getResourceNode(attachment.textureHandle);
        CC_ASSERT(resourceNode.virtualResource);

        gfx::Texture *resource = static_cast<ResourceEntry<Texture> *>(resourceNode.virtualResource)->getDeviceResource();
        CC_ASSERT(resource);

        _attachments.emplace_back();
        _attachments.back().attachment   = std::move(attachment);
        _attachments.back().renderTarget = resource;
        renderTargets.emplace_back(resource);
    }

    for (PassNode *const passNode : subpassNodes) {
        _resourceTable.extract(graph, passNode, renderTargets);
    }
}

void DevicePass::execute() {
    auto *cmdBuff = gfx::Device::getInstance()->getCommandBuffer();

    begin(cmdBuff);

    for (size_t i = 0; i < _subpasses.size(); ++i) {
        Subpass &subpass = _subpasses[i];
        for (LogicPass &pass : subpass.logicPasses) {
            gfx::Viewport &viewport = pass.customViewport ? pass.viewport : _viewport;
            gfx::Rect &    scissor  = pass.customViewport ? pass.scissor : _scissor;

            if (viewport != _curViewport) {
                cmdBuff->setViewport(viewport);
                _curViewport = viewport;
            }
            if (scissor != _curScissor) {
                cmdBuff->setScissor(scissor);
                _curScissor = scissor;
            }

            pass.pass->execute(_resourceTable);
        }

        if (i < _subpasses.size() - 1) next(cmdBuff);
    }

    end(cmdBuff);
}

void DevicePass::append(const FrameGraph &graph, const PassNode *passNode, std::vector<RenderTargetAttachment> *attachments) {
    Subpass &subpass = _subpasses.emplace_back();

    do {
        subpass.logicPasses.emplace_back();
        LogicPass &logicPass     = subpass.logicPasses.back();
        logicPass.pass           = passNode->_pass.get();
        logicPass.customViewport = passNode->_customViewport;
        logicPass.viewport       = passNode->_viewport;
        logicPass.scissor        = passNode->_scissor;

        for (const auto &attachment : passNode->_attachments) {
            append(graph, attachment, attachments, &subpass.desc, passNode->_reads);
        }

        for (const auto &handle : passNode->_reads) {
            const auto it = std::find_if(attachments->begin(), attachments->end(), [&handle](const RenderTargetAttachment &attachment) {
                return attachment.textureHandle == handle;
            });
            if (it != attachments->end()) {
                uint input = utils::toUint(it - attachments->begin());
                if (std::find(subpass.desc.inputs.begin(), subpass.desc.inputs.end(), input) == subpass.desc.inputs.end()) {
                    subpass.desc.inputs.push_back(input);
                }
            }
        }

        passNode = passNode->_next;
    } while (passNode);
}

void DevicePass::append(const FrameGraph &graph, const RenderTargetAttachment &attachment,
                        std::vector<RenderTargetAttachment> *attachments, gfx::SubpassInfo *subpass, const std::vector<Handle> &reads) {
    auto it = std::find_if(attachments->begin(), attachments->end(), [&attachment](const RenderTargetAttachment &x) {
        return attachment.desc.usage == x.desc.usage && attachment.desc.slot == x.desc.slot;
    });

    RenderTargetAttachment *output{nullptr};

    if (it == attachments->end()) {
        output = &attachments->emplace_back(attachment);
        _usedRenderTargetSlotMask |= 1 << attachment.desc.slot;
    } else {
        const ResourceNode &resourceNodeA = graph.getResourceNode(it->textureHandle);
        const ResourceNode &resourceNodeB = graph.getResourceNode(attachment.textureHandle);

        if (resourceNodeA.virtualResource == resourceNodeB.virtualResource) {
            output = &*it;
            if (attachment.storeOp != gfx::StoreOp::DISCARD) {
                output->storeOp          = attachment.storeOp;
                output->desc.endAccesses = attachment.desc.endAccesses;
            }
            if (std::find(reads.begin(), reads.end(), output->textureHandle) != reads.end()) {
                output->isGeneralLayout = true; // it's an 'inout' attachment
            }
        } else {
            CC_ASSERT(attachment.desc.usage == RenderTargetAttachment::Usage::COLOR);
            output = &attachments->emplace_back(attachment);

            for (uint8_t i = 0; i < RenderTargetAttachment::DEPTH_STENCIL_SLOT_START; ++i) {
                if ((_usedRenderTargetSlotMask & (1 << i)) == 0) {
                    attachments->back().desc.slot = i;
                    break;
                }
            }
        }
    }

    if (attachment.desc.usage == RenderTargetAttachment::Usage::COLOR) {
        if (std::find(subpass->colors.begin(), subpass->colors.end(), output->desc.slot) == subpass->colors.end()) {
            subpass->colors.push_back(output->desc.slot);
        }
    } else {
        subpass->depthStencil = output->desc.slot;
    }
}

void DevicePass::begin(gfx::CommandBuffer *cmdBuff) {
    if (_attachments.empty()) return;

    gfx::RenderPassInfo            rpInfo;
    gfx::FramebufferInfo           fboInfo;
    float                          clearDepth   = 1.F;
    uint                           clearStencil = 0;
    static std::vector<gfx::Color> clearColors;
    clearColors.clear();
    _viewport = gfx::Viewport();
    _scissor  = gfx::Rect();

    for (const auto &attachElem : _attachments) {
        gfx::Texture *attachment = attachElem.renderTarget;
        if (attachElem.attachment.desc.usage == RenderTargetAttachment::Usage::COLOR) {
            auto &attachmentInfo           = rpInfo.colorAttachments.emplace_back();
            attachmentInfo.format          = attachment->getFormat();
            attachmentInfo.loadOp          = attachElem.attachment.desc.loadOp;
            attachmentInfo.storeOp         = attachElem.attachment.storeOp;
            attachmentInfo.beginAccesses   = attachElem.attachment.desc.beginAccesses;
            attachmentInfo.endAccesses     = attachElem.attachment.desc.endAccesses;
            attachmentInfo.isGeneralLayout = attachElem.attachment.isGeneralLayout;
            fboInfo.colorTextures.push_back(attachElem.renderTarget);
            _viewport.width = _scissor.width = attachment->getWidth();
            _viewport.height = _scissor.height = attachment->getHeight();
            clearColors.emplace_back(attachElem.attachment.desc.clearColor);
        } else {
            auto &attachmentInfo           = rpInfo.depthStencilAttachment;
            attachmentInfo.format          = attachment->getFormat();
            attachmentInfo.depthLoadOp     = attachElem.attachment.desc.loadOp;
            attachmentInfo.stencilLoadOp   = attachElem.attachment.desc.loadOp;
            attachmentInfo.depthStoreOp    = attachElem.attachment.storeOp;
            attachmentInfo.stencilStoreOp  = attachElem.attachment.storeOp;
            attachmentInfo.beginAccesses   = attachElem.attachment.desc.beginAccesses;
            attachmentInfo.endAccesses     = attachElem.attachment.desc.endAccesses;
            attachmentInfo.isGeneralLayout = attachElem.attachment.isGeneralLayout;
            fboInfo.depthStencilTexture    = attachElem.renderTarget;
            _viewport.width = _scissor.width = attachment->getWidth();
            _viewport.height = _scissor.height = attachment->getHeight();
            clearDepth                         = attachElem.attachment.desc.clearDepth;
            clearStencil                       = attachElem.attachment.desc.clearStencil;
        }
    }

    for (auto &subpass : _subpasses) {
        rpInfo.subpasses.emplace_back(subpass.desc);
    }

    _renderPass = RenderPass(rpInfo);
    _renderPass.createTransient();
    _resourceTable._renderPass = _renderPass.get();

    fboInfo.renderPass = _renderPass.get();
    _fbo               = Framebuffer(fboInfo);
    _fbo.createTransient();

    cmdBuff->beginRenderPass(_renderPass.get(), _fbo.get(), _scissor, clearColors.data(), clearDepth, clearStencil);
    _curViewport = _viewport;
    _curScissor  = _scissor;
}

void DevicePass::next(gfx::CommandBuffer *cmdBuff) noexcept {
    if (!_renderPass.get() || !_fbo.get()) return;

    cmdBuff->nextSubpass();
}

void DevicePass::end(gfx::CommandBuffer *cmdBuff) {
    if (!_renderPass.get() || !_fbo.get()) return;

    cmdBuff->endRenderPass();

    _renderPass.destroyTransient();
    _fbo.destroyTransient();
}

} // namespace framegraph
} // namespace cc
