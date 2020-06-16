#include "VKStd.h"

#include "VKBindingLayout.h"
#include "VKBuffer.h"
#include "VKCommandAllocator.h"
#include "VKCommandBuffer.h"
#include "VKCommands.h"
#include "VKFramebuffer.h"
#include "VKInputAssembler.h"
#include "VKPipelineState.h"
#include "VKRenderPass.h"
#include "VKTexture.h"

namespace cc {

CCVKCommandBuffer::CCVKCommandBuffer(GFXDevice *device)
: GFXCommandBuffer(device) {
}

CCVKCommandBuffer::~CCVKCommandBuffer() {
}

bool CCVKCommandBuffer::initialize(const GFXCommandBufferInfo &info) {
    if (!info.allocator) {
        return false;
    }

    _allocator = info.allocator;
    _type = info.type;

    _gpuCommandBuffer = CC_NEW(CCVKGPUCommandBuffer);
    _gpuCommandBuffer->type = _type;
    _gpuCommandBuffer->commandPool = ((CCVKCommandAllocator *)_allocator)->gpuCommandPool();
    CCVKCmdFuncAllocateCommandBuffer((CCVKDevice *)_device, _gpuCommandBuffer);

    _status = GFXStatus::SUCCESS;
    return true;
}

void CCVKCommandBuffer::destroy() {
    if (_gpuCommandBuffer) {
        CCVKCmdFuncFreeCommandBuffer((CCVKDevice *)_device, _gpuCommandBuffer);
        CC_DELETE(_gpuCommandBuffer);
        _gpuCommandBuffer = nullptr;
    }

    _allocator = nullptr;
    _status = GFXStatus::UNREADY;
}

void CCVKCommandBuffer::begin(GFXRenderPass *renderPass, uint subpass, GFXFramebuffer *frameBuffer) {
    _curGPUPipelineState = nullptr;
    _curGPUBindingLayout = nullptr;
    _curGPUInputAssember = nullptr;
    _numDrawCalls = 0;
    _numInstances = 0;
    _numTriangles = 0;

    VkCommandBufferBeginInfo beginInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO};
    beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;

    if (_type == GFXCommandBufferType::SECONDARY) {
        if (!renderPass) {
            CC_LOG_ERROR("RenderPass has to be specified when beginning secondary command buffers.");
            return;
        }
        VkCommandBufferInheritanceInfo inheritanceInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_INHERITANCE_INFO};
        inheritanceInfo.renderPass = ((CCVKRenderPass *)renderPass)->gpuRenderPass()->vkRenderPass;
        inheritanceInfo.subpass = subpass;
        if (frameBuffer) inheritanceInfo.framebuffer = ((CCVKFramebuffer *)frameBuffer)->gpuFBO()->vkFramebuffer;
        beginInfo.pInheritanceInfo = &inheritanceInfo;
    }
    VK_CHECK(vkBeginCommandBuffer(_gpuCommandBuffer->vkCommandBuffer, &beginInfo));
}

void CCVKCommandBuffer::end() {
    _curGPUFBO = nullptr;
    VK_CHECK(vkEndCommandBuffer(_gpuCommandBuffer->vkCommandBuffer));
}

void CCVKCommandBuffer::beginRenderPass(GFXFramebuffer *fbo, const GFXRect &renderArea,
                                        GFXClearFlags clearFlags, const std::vector<GFXColor> &colors, float depth, int stencil) {
    _curGPUFBO = ((CCVKFramebuffer *)fbo)->gpuFBO();
    CCVKGPURenderPass *renderPass = _curGPUFBO->gpuRenderPass;
    VkFramebuffer framebuffer = _curGPUFBO->vkFramebuffer;
    if (!_curGPUFBO->isOffscreen) {
        framebuffer = _curGPUFBO->swapchain->vkSwapchainFramebufferListMap[_curGPUFBO][_curGPUFBO->swapchain->curImageIndex];
    }

    vector<VkClearValue>::type &clearValues = renderPass->clearValues;
    size_t attachmentCount = clearValues.size();

    if (attachmentCount) {
        for (size_t i = 0u; i < attachmentCount - 1; i++) {
            clearValues[i].color = {colors[i].r, colors[i].g, colors[i].b, colors[i].a};
        }
        clearValues[attachmentCount - 1].depthStencil = {depth, (uint)stencil};
    }

    VkRenderPassBeginInfo passBeginInfo{VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO};
    passBeginInfo.renderPass = renderPass->vkRenderPass;
    passBeginInfo.framebuffer = framebuffer;
    passBeginInfo.renderArea.offset.x = renderArea.x;
    passBeginInfo.renderArea.offset.y = renderArea.y;
    passBeginInfo.renderArea.extent.width = renderArea.width;
    passBeginInfo.renderArea.extent.height = renderArea.height;
    passBeginInfo.clearValueCount = clearValues.size();
    passBeginInfo.pClearValues = clearValues.data();

    vkCmdBeginRenderPass(_gpuCommandBuffer->vkCommandBuffer, &passBeginInfo, VK_SUBPASS_CONTENTS_INLINE);

    VkViewport viewport{(float)renderArea.x, (float)renderArea.y, (float)renderArea.width, (float)renderArea.height, 0, 1};
    vkCmdSetViewport(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &viewport);

    VkRect2D scissor{{renderArea.x, renderArea.y}, {renderArea.width, renderArea.height}};
    vkCmdSetScissor(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &scissor);
}

void CCVKCommandBuffer::endRenderPass() {
    vkCmdEndRenderPass(_gpuCommandBuffer->vkCommandBuffer);
    _curGPUFBO = nullptr;
}

void CCVKCommandBuffer::bindPipelineState(GFXPipelineState *pso) {
    CCVKGPUPipelineState *gpuPipelineState = ((CCVKPipelineState *)pso)->gpuPipelineState();

    if (_curGPUPipelineState != gpuPipelineState) {
        vkCmdBindPipeline(_gpuCommandBuffer->vkCommandBuffer, VK_PIPELINE_BIND_POINT_GRAPHICS, gpuPipelineState->vkPipeline);
        _curGPUPipelineState = gpuPipelineState;
    }
}

void CCVKCommandBuffer::bindBindingLayout(GFXBindingLayout *layout) {
    if (!_curGPUPipelineState) {
        CC_LOG_ERROR("Command 'bindBindingLayout' must be recorded after 'bindPipelineState'.");
        return;
    }

    CCVKGPUBindingLayout *gpuBindingLayout = ((CCVKBindingLayout *)layout)->gpuBindingLayout();

    if (_curGPUBindingLayout != gpuBindingLayout) {
        vkCmdBindDescriptorSets(_gpuCommandBuffer->vkCommandBuffer, VK_PIPELINE_BIND_POINT_GRAPHICS,
                                _curGPUPipelineState->gpuLayout->vkPipelineLayout, 0, 1, &gpuBindingLayout->vkDescriptorSet, 0, nullptr);
        _curGPUBindingLayout = gpuBindingLayout;
    }
}

void CCVKCommandBuffer::bindInputAssembler(GFXInputAssembler *ia) {
    CCVKGPUInputAssembler *gpuInputAssembler = ((CCVKInputAssembler *)ia)->gpuInputAssembler();

    if (_curGPUInputAssember != gpuInputAssembler) {
        // buffers may be rebuilt(e.g. resize event) without IA's acknowledge
        size_t vbCount = gpuInputAssembler->gpuVertexBuffers.size();
        if (gpuInputAssembler->vertexBuffers.size() < vbCount) {
            gpuInputAssembler->vertexBuffers.resize(vbCount);
            gpuInputAssembler->vertexBufferOffsets.resize(vbCount);
        }

        for (size_t i = 0u; i < vbCount; i++) {
            gpuInputAssembler->vertexBuffers[i] = gpuInputAssembler->gpuVertexBuffers[i]->vkBuffer;
            gpuInputAssembler->vertexBufferOffsets[i] = gpuInputAssembler->gpuVertexBuffers[i]->startOffset;
        }

        vkCmdBindVertexBuffers(_gpuCommandBuffer->vkCommandBuffer, 0, vbCount,
                               gpuInputAssembler->vertexBuffers.data(), gpuInputAssembler->vertexBufferOffsets.data());

        if (gpuInputAssembler->gpuIndexBuffer) {
            vkCmdBindIndexBuffer(_gpuCommandBuffer->vkCommandBuffer, gpuInputAssembler->gpuIndexBuffer->vkBuffer, 0,
                                 gpuInputAssembler->gpuIndexBuffer->stride == 32 ? VK_INDEX_TYPE_UINT32 : VK_INDEX_TYPE_UINT16);
        }
        _curGPUInputAssember = gpuInputAssembler;
    }
}

void CCVKCommandBuffer::setViewport(const GFXViewport &vp) {
    if (_curViewport != vp) {
        _curViewport = vp;
        VkViewport viewport{(float)vp.left, (float)vp.top, (float)vp.width, (float)vp.height, vp.minDepth, vp.maxDepth};
        vkCmdSetViewport(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &viewport);
    }
}

void CCVKCommandBuffer::setScissor(const GFXRect &rect) {
    if (_curScissor != rect) {
        _curScissor = rect;
        VkRect2D scissor{{rect.x, rect.y}, {rect.width, rect.height}};
        vkCmdSetScissor(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &scissor);
    }
}

void CCVKCommandBuffer::setLineWidth(const float width) {
    if (math::IsNotEqualF(_curLineWidth, width)) {
        _curLineWidth = width;
        vkCmdSetLineWidth(_gpuCommandBuffer->vkCommandBuffer, width);
    }
}

void CCVKCommandBuffer::setDepthBias(float constant, float clamp, float slope) {
    if (math::IsNotEqualF(_curDepthBias.constant, constant) ||
        math::IsNotEqualF(_curDepthBias.clamp, clamp) ||
        math::IsNotEqualF(_curDepthBias.slope, slope)) {
        _curDepthBias.constant = constant;
        _curDepthBias.clamp = clamp;
        _curDepthBias.slope = slope;
        vkCmdSetDepthBias(_gpuCommandBuffer->vkCommandBuffer, constant, clamp, slope);
    }
}

void CCVKCommandBuffer::setBlendConstants(const GFXColor &constants) {
    if (math::IsNotEqualF(_curBlendConstants.r, constants.r) ||
        math::IsNotEqualF(_curBlendConstants.g, constants.g) ||
        math::IsNotEqualF(_curBlendConstants.b, constants.b) ||
        math::IsNotEqualF(_curBlendConstants.a, constants.a)) {
        _curBlendConstants.r = constants.r;
        _curBlendConstants.g = constants.g;
        _curBlendConstants.b = constants.b;
        _curBlendConstants.a = constants.a;
        vkCmdSetBlendConstants(_gpuCommandBuffer->vkCommandBuffer, reinterpret_cast<const float *>(&constants));
    }
}

void CCVKCommandBuffer::setDepthBound(float minBounds, float maxBounds) {
    if (math::IsNotEqualF(_curDepthBounds.minBounds, minBounds) ||
        math::IsNotEqualF(_curDepthBounds.maxBounds, maxBounds)) {
        _curDepthBounds.minBounds = minBounds;
        _curDepthBounds.maxBounds = maxBounds;
        vkCmdSetDepthBounds(_gpuCommandBuffer->vkCommandBuffer, minBounds, maxBounds);
    }
}

void CCVKCommandBuffer::setStencilWriteMask(GFXStencilFace face, uint mask) {
    if ((_curStencilWriteMask.face != face) ||
        (_curStencilWriteMask.write_mask != mask)) {
        _curStencilWriteMask.face = face;
        _curStencilWriteMask.write_mask = mask;
        vkCmdSetStencilWriteMask(_gpuCommandBuffer->vkCommandBuffer,
                                 face == GFXStencilFace::FRONT ? VK_STENCIL_FACE_FRONT_BIT : VK_STENCIL_FACE_BACK_BIT, mask);
    }
}

void CCVKCommandBuffer::setStencilCompareMask(GFXStencilFace face, int reference, uint mask) {
    if ((_curStencilCompareMask.face != face) ||
        (_curStencilCompareMask.reference != reference) ||
        (_curStencilCompareMask.compareMask != mask)) {
        _curStencilCompareMask.face = face;
        _curStencilCompareMask.reference = reference;
        _curStencilCompareMask.compareMask = mask;

        VkStencilFaceFlagBits vkFace = (face == GFXStencilFace::FRONT ? VK_STENCIL_FACE_FRONT_BIT : VK_STENCIL_FACE_BACK_BIT);
        vkCmdSetStencilReference(_gpuCommandBuffer->vkCommandBuffer, vkFace, reference);
        vkCmdSetStencilCompareMask(_gpuCommandBuffer->vkCommandBuffer, vkFace, mask);
    }
}

void CCVKCommandBuffer::draw(GFXInputAssembler *ia) {
    if ((_type == GFXCommandBufferType::PRIMARY && _curGPUFBO) ||
        (_type == GFXCommandBufferType::SECONDARY)) {
        CCVKGPUInputAssembler *gpuInputAssembler = ((CCVKInputAssembler *)ia)->gpuInputAssembler();
        GFXDrawInfo drawInfo;

        if (gpuInputAssembler->gpuIndirectBuffer) {
            // TODO
        } else {
            ((CCVKInputAssembler *)ia)->extractDrawInfo(drawInfo);
            uint instanceCount = std::max(drawInfo.instanceCount, 1u);
            bool hasIndexBuffer = gpuInputAssembler->gpuIndexBuffer && drawInfo.indexCount >= 0;

            if (hasIndexBuffer) {
                vkCmdDrawIndexed(_gpuCommandBuffer->vkCommandBuffer, drawInfo.indexCount, instanceCount,
                                 drawInfo.firstIndex, drawInfo.vertexOffset, drawInfo.firstInstance);
            } else {
                vkCmdDraw(_gpuCommandBuffer->vkCommandBuffer, drawInfo.vertexCount, instanceCount,
                          drawInfo.firstVertex, drawInfo.firstInstance);
            }

            ++_numDrawCalls;
            _numInstances += drawInfo.instanceCount;
            if (_curGPUPipelineState) {
                uint indexCount = hasIndexBuffer ? drawInfo.indexCount : drawInfo.vertexCount;
                switch (_curGPUPipelineState->primitive) {
                    case GFXPrimitiveMode::TRIANGLE_LIST:
                        _numTriangles += indexCount / 3 * instanceCount;
                        break;
                    case GFXPrimitiveMode::TRIANGLE_STRIP:
                    case GFXPrimitiveMode::TRIANGLE_FAN:
                        _numTriangles += (indexCount - 2) * instanceCount;
                        break;
                }
            }
        }
    } else {
        CC_LOG_ERROR("Command 'draw' must be recorded inside a render pass.");
    }
}

void CCVKCommandBuffer::execute(const std::vector<GFXCommandBuffer *> &cmdBuffs, uint count) {
    if (!count) {
        return;
    }

    vector<VkCommandBuffer>::type vkCmdBuffs(count);

    for (uint i = 0u; i < count; ++i) {
        CCVKCommandBuffer *cmdBuff = (CCVKCommandBuffer *)cmdBuffs[i];
        vkCmdBuffs[i] = cmdBuff->_gpuCommandBuffer->vkCommandBuffer;

        _numDrawCalls += cmdBuff->getNumDrawCalls();
        _numInstances += cmdBuff->getNumInstances();
        _numTriangles += cmdBuff->getNumTris();
    }

    vkCmdExecuteCommands(_gpuCommandBuffer->vkCommandBuffer, count, vkCmdBuffs.data());
}

void CCVKCommandBuffer::updateBuffer(GFXBuffer *buff, void *data, uint size, uint offset) {
    if ((_type == GFXCommandBufferType::PRIMARY && !_curGPUFBO) ||
        (_type == GFXCommandBufferType::SECONDARY)) {
        CCVKCmdFuncUpdateBuffer((CCVKDevice *)_device, ((CCVKBuffer *)buff)->gpuBuffer(), data, offset, size);
    } else {
        CC_LOG_ERROR("Command 'updateBuffer' must be recorded outside a render pass.");
    }
}

void CCVKCommandBuffer::copyBufferToTexture(GFXBuffer *src, GFXTexture *dst, GFXTextureLayout layout, const GFXBufferTextureCopyList &regions) {
    if ((_type == GFXCommandBufferType::PRIMARY && !_curGPUFBO) ||
        (_type == GFXCommandBufferType::SECONDARY)) {
        //const CCVKGPUBuffer* gpuBuffer = ((CCVKBuffer*)src)->gpuBuffer();
        //const CCVKGPUTexture* gpuTexture = ((CCVKTexture*)dst)->gpuTexture();
        //vkCmdCopyBufferToImage(_gpuCommandBuffer->vkCommandBuffer, gpuBuffer->vkBuffer, gpuTexture->vkImage, MapVkImageLayout(layout),
        //    regions.size(), regions.data());
    } else {
        CC_LOG_ERROR("Command 'copyBufferToTexture' must be recorded outside a render pass.");
    }
}

}
