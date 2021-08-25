/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "VKStd.h"

#include "VKBuffer.h"
#include "VKCommandBuffer.h"
#include "VKCommands.h"
#include "VKContext.h"
#include "VKDescriptorSet.h"
#include "VKDevice.h"
#include "VKFramebuffer.h"
#include "VKGlobalBarrier.h"
#include "VKInputAssembler.h"
#include "VKPipelineState.h"
#include "VKQueue.h"
#include "VKRenderPass.h"
#include "VKTexture.h"
#include "VKTextureBarrier.h"
#include "gfx-base/GFXDef-common.h"
#include "vulkan/vulkan_core.h"

namespace cc {
namespace gfx {

CCVKCommandBuffer::~CCVKCommandBuffer() {
    destroy();
}

void CCVKCommandBuffer::doInit(const CommandBufferInfo & /*info*/) {
    _gpuCommandBuffer                   = CC_NEW(CCVKGPUCommandBuffer);
    _gpuCommandBuffer->level            = mapVkCommandBufferLevel(_type);
    _gpuCommandBuffer->queueFamilyIndex = static_cast<CCVKQueue *>(_queue)->gpuQueue()->queueFamilyIndex;

    size_t setCount = CCVKDevice::getInstance()->bindingMappingInfo().bufferOffsets.size();
    _curGPUDescriptorSets.resize(setCount);
    _curVkDescriptorSets.resize(setCount);
    _curDynamicOffsetsArray.resize(setCount);
}

void CCVKCommandBuffer::doDestroy() {
    if (_gpuCommandBuffer) {
        CC_DELETE(_gpuCommandBuffer);
        _gpuCommandBuffer = nullptr;
    }
}

void CCVKCommandBuffer::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    if (_gpuCommandBuffer->began) return;

    CCVKDevice::getInstance()->gpuDevice()->getCommandBufferPool()->request(_gpuCommandBuffer);

    _curGPUPipelineState = nullptr;
    _curGPUInputAssember = nullptr;
    _curGPUDescriptorSets.assign(_curGPUDescriptorSets.size(), nullptr);
    _curDynamicOffsetsArray.assign(_curDynamicOffsetsArray.size(), {});
    _firstDirtyDescriptorSet = UINT_MAX;

    _numDrawCalls = 0;
    _numInstances = 0;
    _numTriangles = 0;

    VkCommandBufferBeginInfo beginInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO};
    beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;
    VkCommandBufferInheritanceInfo inheritanceInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_INHERITANCE_INFO};

    if (renderPass) {
        inheritanceInfo.renderPass = static_cast<CCVKRenderPass *>(renderPass)->gpuRenderPass()->vkRenderPass;
        inheritanceInfo.subpass    = subpass;
        if (frameBuffer) {
            CCVKGPUFramebuffer *gpuFBO = static_cast<CCVKFramebuffer *>(frameBuffer)->gpuFBO();
            if (gpuFBO->isOffscreen) {
                inheritanceInfo.framebuffer = gpuFBO->vkFramebuffer;
            } else {
                inheritanceInfo.framebuffer = gpuFBO->swapchain->vkSwapchainFramebufferListMap[gpuFBO][gpuFBO->swapchain->curImageIndex];
            }
        }
        beginInfo.pInheritanceInfo = &inheritanceInfo;
        beginInfo.flags |= VK_COMMAND_BUFFER_USAGE_RENDER_PASS_CONTINUE_BIT;
    }

    VK_CHECK(vkBeginCommandBuffer(_gpuCommandBuffer->vkCommandBuffer, &beginInfo));

    _gpuCommandBuffer->began = true;
    _gpuCommandBuffer->recordedBuffers.clear();
}

void CCVKCommandBuffer::end() {
    if (!_gpuCommandBuffer->began) return;

    _curGPUFBO                       = nullptr;
    _curGPUInputAssember             = nullptr;
    _curDynamicStates.viewport.width = _curDynamicStates.viewport.height = _curDynamicStates.scissor.width = _curDynamicStates.scissor.height = 0U;
    VK_CHECK(vkEndCommandBuffer(_gpuCommandBuffer->vkCommandBuffer));
    _gpuCommandBuffer->began = false;

    _pendingQueue.push(_gpuCommandBuffer->vkCommandBuffer);
    CCVKDevice::getInstance()->gpuDevice()->getCommandBufferPool()->yield(_gpuCommandBuffer);
}

void CCVKCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors,
                                        float depth, uint stencil, CommandBuffer *const * /*secondaryCBs*/, uint secondaryCBCount) {
#if BARRIER_DEDUCTION_LEVEL >= BARRIER_DEDUCTION_LEVEL_BASIC
    // guard against RAW hazard
    VkMemoryBarrier vkBarrier{VK_STRUCTURE_TYPE_MEMORY_BARRIER};
    vkBarrier.srcAccessMask = VK_ACCESS_TRANSFER_WRITE_BIT;
    vkBarrier.dstAccessMask = VK_ACCESS_UNIFORM_READ_BIT | VK_ACCESS_VERTEX_ATTRIBUTE_READ_BIT;
    vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer,
                         VK_PIPELINE_STAGE_TRANSFER_BIT,
                         VK_PIPELINE_STAGE_VERTEX_INPUT_BIT | VK_PIPELINE_STAGE_VERTEX_SHADER_BIT | VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT,
                         0, 1, &vkBarrier, 0, nullptr, 0, nullptr);
#endif

    _curGPUFBO                       = static_cast<CCVKFramebuffer *>(fbo)->gpuFBO();
    CCVKGPURenderPass *gpuRenderPass = static_cast<CCVKRenderPass *>(renderPass)->gpuRenderPass();
    VkFramebuffer      framebuffer   = _curGPUFBO->vkFramebuffer;
    if (!_curGPUFBO->isOffscreen) {
        framebuffer = _curGPUFBO->swapchain->vkSwapchainFramebufferListMap[_curGPUFBO][_curGPUFBO->swapchain->curImageIndex];
    }

    vector<VkClearValue> &clearValues     = gpuRenderPass->clearValues;
    size_t                attachmentCount = clearValues.size();

    if (attachmentCount) {
        for (size_t i = 0U; i < attachmentCount - 1; ++i) {
            clearValues[i].color = {{colors[i].x, colors[i].y, colors[i].z, colors[i].w}};
        }
        clearValues[attachmentCount - 1].depthStencil = {depth, stencil};
    }
    auto *                device = CCVKDevice::getInstance();
    VkRenderPassBeginInfo passBeginInfo{VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO};
    passBeginInfo.renderPass      = gpuRenderPass->vkRenderPass;
    passBeginInfo.framebuffer     = framebuffer;
    passBeginInfo.clearValueCount = utils::toUint(clearValues.size());
    passBeginInfo.pClearValues    = clearValues.data();
    passBeginInfo.renderArea      = {{renderArea.x, renderArea.y}, {renderArea.width, renderArea.height}};
    vkCmdBeginRenderPass(_gpuCommandBuffer->vkCommandBuffer, &passBeginInfo,
                         secondaryCBCount ? VK_SUBPASS_CONTENTS_SECONDARY_COMMAND_BUFFERS : VK_SUBPASS_CONTENTS_INLINE);

    _secondaryRP = secondaryCBCount;

    if (!secondaryCBCount) {
        VkViewport viewport{static_cast<float>(renderArea.x), static_cast<float>(renderArea.y), static_cast<float>(renderArea.width), static_cast<float>(renderArea.height), 0.F, 1.F};
        vkCmdSetViewport(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &viewport);
        vkCmdSetScissor(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &passBeginInfo.renderArea);
    }
}

void CCVKCommandBuffer::endRenderPass() {
    vkCmdEndRenderPass(_gpuCommandBuffer->vkCommandBuffer);

    size_t colorAttachmentCount = _curGPUFBO->gpuRenderPass->colorAttachments.size();
    for (size_t i = 0U; i < colorAttachmentCount; ++i) {
        if (_curGPUFBO->gpuColorViews[i]) {
            _curGPUFBO->gpuColorViews[i]->gpuTexture->currentAccessTypes = _curGPUFBO->gpuRenderPass->endAccesses[i];
        } else {
            _curGPUFBO->swapchain->swapchainImageAccessTypes[_curGPUFBO->swapchain->curImageIndex] = _curGPUFBO->gpuRenderPass->endAccesses[i];
        }
    }

    if (_curGPUFBO->gpuRenderPass->depthStencilAttachment.format != Format::UNKNOWN) {
        if (_curGPUFBO->gpuDepthStencilView) {
            _curGPUFBO->gpuDepthStencilView->gpuTexture->currentAccessTypes = _curGPUFBO->gpuRenderPass->endAccesses[colorAttachmentCount];
        } else {
            _curGPUFBO->swapchain->depthStencilImageAccessTypes[_curGPUFBO->swapchain->curImageIndex] = _curGPUFBO->gpuRenderPass->endAccesses[colorAttachmentCount];
        }
    }

    _curGPUFBO = nullptr;

#if BARRIER_DEDUCTION_LEVEL >= BARRIER_DEDUCTION_LEVEL_BASIC
    // guard against WAR hazard
    vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer,
                         VK_PIPELINE_STAGE_VERTEX_SHADER_BIT | VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT,
                         VK_PIPELINE_STAGE_TRANSFER_BIT, 0, 0, nullptr, 0, nullptr, 0, nullptr);
#endif
}

void CCVKCommandBuffer::bindPipelineState(PipelineState *pso) {
    CCVKGPUPipelineState *gpuPipelineState = static_cast<CCVKPipelineState *>(pso)->gpuPipelineState();

    if (_curGPUPipelineState != gpuPipelineState) {
        vkCmdBindPipeline(_gpuCommandBuffer->vkCommandBuffer, VK_PIPELINE_BIND_POINTS[toNumber(gpuPipelineState->bindPoint)], gpuPipelineState->vkPipeline);
        _curGPUPipelineState = gpuPipelineState;
    }
}

void CCVKCommandBuffer::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    CCASSERT(_curGPUDescriptorSets.size() > set, "Invalid set index");

    CCVKGPUDescriptorSet *gpuDescriptorSet = static_cast<CCVKDescriptorSet *>(descriptorSet)->gpuDescriptorSet();

    if (_curGPUDescriptorSets[set] != gpuDescriptorSet) {
        _curGPUDescriptorSets[set] = gpuDescriptorSet;
        if (set < _firstDirtyDescriptorSet) _firstDirtyDescriptorSet = set;
    }
    if (dynamicOffsetCount) {
        _curDynamicOffsetsArray[set].assign(dynamicOffsets, dynamicOffsets + dynamicOffsetCount);
        if (set < _firstDirtyDescriptorSet) _firstDirtyDescriptorSet = set;
    } else if (!_curDynamicOffsetsArray[set].empty()) {
        _curDynamicOffsetsArray[set].assign(_curDynamicOffsetsArray[set].size(), 0);
    }
}

void CCVKCommandBuffer::bindInputAssembler(InputAssembler *ia) {
    CCVKGPUInputAssembler *gpuInputAssembler = static_cast<CCVKInputAssembler *>(ia)->gpuInputAssembler();

    if (_curGPUInputAssember != gpuInputAssembler) {
        // buffers may be rebuilt(e.g. resize event) without IA's acknowledge
        uint vbCount = utils::toUint(gpuInputAssembler->gpuVertexBuffers.size());
        if (gpuInputAssembler->vertexBuffers.size() < vbCount) {
            gpuInputAssembler->vertexBuffers.resize(vbCount);
            gpuInputAssembler->vertexBufferOffsets.resize(vbCount);
        }

        for (uint i = 0U; i < vbCount; ++i) {
            gpuInputAssembler->vertexBuffers[i]       = gpuInputAssembler->gpuVertexBuffers[i]->vkBuffer;
            gpuInputAssembler->vertexBufferOffsets[i] = gpuInputAssembler->gpuVertexBuffers[i]->startOffset;
        }

        vkCmdBindVertexBuffers(_gpuCommandBuffer->vkCommandBuffer, 0, vbCount,
                               gpuInputAssembler->vertexBuffers.data(), gpuInputAssembler->vertexBufferOffsets.data());

        if (gpuInputAssembler->gpuIndexBuffer) {
            vkCmdBindIndexBuffer(_gpuCommandBuffer->vkCommandBuffer, gpuInputAssembler->gpuIndexBuffer->vkBuffer, 0,
                                 gpuInputAssembler->gpuIndexBuffer->stride == 4 ? VK_INDEX_TYPE_UINT32 : VK_INDEX_TYPE_UINT16);
        }
        _curGPUInputAssember = gpuInputAssembler;
    }
}

void CCVKCommandBuffer::setViewport(const Viewport &vp) {
    if (_curDynamicStates.viewport != vp) {
        _curDynamicStates.viewport = vp;

        VkViewport viewport{static_cast<float>(vp.left), static_cast<float>(vp.top), static_cast<float>(vp.width), static_cast<float>(vp.height), vp.minDepth, vp.maxDepth};
        vkCmdSetViewport(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &viewport);
    }
}

void CCVKCommandBuffer::setScissor(const Rect &rect) {
    if (_curDynamicStates.scissor != rect) {
        _curDynamicStates.scissor = rect;

        VkRect2D scissor = {{rect.x, rect.y}, {rect.width, rect.height}};
        vkCmdSetScissor(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &scissor);
    }
}

void CCVKCommandBuffer::setLineWidth(float width) {
    if (math::IsNotEqualF(_curDynamicStates.lineWidth, width)) {
        _curDynamicStates.lineWidth = width;
        vkCmdSetLineWidth(_gpuCommandBuffer->vkCommandBuffer, width);
    }
}

void CCVKCommandBuffer::setDepthBias(float constant, float clamp, float slope) {
    if (math::IsNotEqualF(_curDynamicStates.depthBiasConstant, constant) ||
        math::IsNotEqualF(_curDynamicStates.depthBiasClamp, clamp) ||
        math::IsNotEqualF(_curDynamicStates.depthBiasSlope, slope)) {
        _curDynamicStates.depthBiasConstant = constant;
        _curDynamicStates.depthBiasClamp    = clamp;
        _curDynamicStates.depthBiasSlope    = slope;
        vkCmdSetDepthBias(_gpuCommandBuffer->vkCommandBuffer, constant, clamp, slope);
    }
}

void CCVKCommandBuffer::setBlendConstants(const Color &constants) {
    if (math::IsNotEqualF(_curDynamicStates.blendConstant.x, constants.x) ||
        math::IsNotEqualF(_curDynamicStates.blendConstant.y, constants.y) ||
        math::IsNotEqualF(_curDynamicStates.blendConstant.z, constants.z) ||
        math::IsNotEqualF(_curDynamicStates.blendConstant.w, constants.w)) {
        _curDynamicStates.blendConstant.x = constants.x;
        _curDynamicStates.blendConstant.y = constants.y;
        _curDynamicStates.blendConstant.z = constants.z;
        _curDynamicStates.blendConstant.w = constants.w;
        vkCmdSetBlendConstants(_gpuCommandBuffer->vkCommandBuffer, reinterpret_cast<const float *>(&constants));
    }
}

void CCVKCommandBuffer::setDepthBound(float minBounds, float maxBounds) {
    if (math::IsNotEqualF(_curDynamicStates.depthMinBounds, minBounds) ||
        math::IsNotEqualF(_curDynamicStates.depthMaxBounds, maxBounds)) {
        _curDynamicStates.depthMinBounds = minBounds;
        _curDynamicStates.depthMaxBounds = maxBounds;
        vkCmdSetDepthBounds(_gpuCommandBuffer->vkCommandBuffer, minBounds, maxBounds);
    }
}

void CCVKCommandBuffer::setStencilWriteMask(StencilFace face, uint mask) {
    DynamicStencilStates &front = _curDynamicStates.stencilStatesFront;
    DynamicStencilStates &back  = _curDynamicStates.stencilStatesBack;
    if (face == StencilFace::ALL) {
        if (front.writeMask == mask && back.writeMask == mask) return;
        front.writeMask = back.writeMask = mask;
        vkCmdSetStencilWriteMask(_gpuCommandBuffer->vkCommandBuffer, VK_STENCIL_FACE_FRONT_AND_BACK, mask);
    } else if (face == StencilFace::FRONT) {
        if (front.writeMask == mask) return;
        front.writeMask = mask;
        vkCmdSetStencilWriteMask(_gpuCommandBuffer->vkCommandBuffer, VK_STENCIL_FACE_FRONT_BIT, mask);
    } else if (face == StencilFace::BACK) {
        if (back.writeMask == mask) return;
        back.writeMask = mask;
        vkCmdSetStencilWriteMask(_gpuCommandBuffer->vkCommandBuffer, VK_STENCIL_FACE_BACK_BIT, mask);
    }
}

void CCVKCommandBuffer::setStencilCompareMask(StencilFace face, uint reference, uint mask) {
    DynamicStencilStates &front = _curDynamicStates.stencilStatesFront;
    DynamicStencilStates &back  = _curDynamicStates.stencilStatesBack;
    if (face == StencilFace::ALL) {
        if (front.reference == reference && back.reference == reference &&
            front.compareMask == mask && back.compareMask == mask) return;
        front.reference = back.reference = reference;
        front.compareMask = back.compareMask = mask;
        vkCmdSetStencilReference(_gpuCommandBuffer->vkCommandBuffer, VK_STENCIL_FACE_FRONT_AND_BACK, reference);
        vkCmdSetStencilCompareMask(_gpuCommandBuffer->vkCommandBuffer, VK_STENCIL_FACE_FRONT_AND_BACK, mask);
    } else if (face == StencilFace::FRONT) {
        if (front.writeMask == mask && front.reference == reference) return;
        front.writeMask = mask;
        front.reference = reference;
        vkCmdSetStencilReference(_gpuCommandBuffer->vkCommandBuffer, VK_STENCIL_FACE_FRONT_BIT, reference);
        vkCmdSetStencilCompareMask(_gpuCommandBuffer->vkCommandBuffer, VK_STENCIL_FACE_FRONT_BIT, mask);
    } else if (face == StencilFace::BACK) {
        if (back.writeMask == mask && back.reference == reference) return;
        back.writeMask = mask;
        back.reference = reference;
        vkCmdSetStencilReference(_gpuCommandBuffer->vkCommandBuffer, VK_STENCIL_FACE_BACK_BIT, reference);
        vkCmdSetStencilCompareMask(_gpuCommandBuffer->vkCommandBuffer, VK_STENCIL_FACE_BACK_BIT, mask);
    }
}

void CCVKCommandBuffer::nextSubpass() {
    vkCmdNextSubpass(_gpuCommandBuffer->vkCommandBuffer, _secondaryRP ? VK_SUBPASS_CONTENTS_SECONDARY_COMMAND_BUFFERS : VK_SUBPASS_CONTENTS_INLINE);
}

void CCVKCommandBuffer::draw(const DrawInfo &info) {
    if (_firstDirtyDescriptorSet < _curGPUDescriptorSets.size()) {
        bindDescriptorSets(VK_PIPELINE_BIND_POINT_GRAPHICS);
    }

    CCVKGPUBuffer *gpuIndirectBuffer = _curGPUInputAssember->gpuIndirectBuffer;

    if (gpuIndirectBuffer) {
        uint           drawInfoCount = gpuIndirectBuffer->count;
        CCVKGPUDevice *gpuDevice     = CCVKDevice::getInstance()->gpuDevice();
        VkDeviceSize   offset        = gpuIndirectBuffer->startOffset + gpuDevice->curBackBufferIndex * gpuIndirectBuffer->instanceSize;
        if (gpuDevice->useMultiDrawIndirect) {
            if (gpuIndirectBuffer->isDrawIndirectByIndex) {
                vkCmdDrawIndexedIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                         gpuIndirectBuffer->vkBuffer,
                                         offset,
                                         drawInfoCount,
                                         sizeof(VkDrawIndexedIndirectCommand));
            } else {
                vkCmdDrawIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                  gpuIndirectBuffer->vkBuffer,
                                  offset,
                                  drawInfoCount,
                                  sizeof(VkDrawIndirectCommand));
            }
        } else {
            if (gpuIndirectBuffer->isDrawIndirectByIndex) {
                for (VkDeviceSize j = 0U; j < drawInfoCount; ++j) {
                    vkCmdDrawIndexedIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                             gpuIndirectBuffer->vkBuffer,
                                             offset + j * sizeof(VkDrawIndexedIndirectCommand),
                                             1,
                                             sizeof(VkDrawIndexedIndirectCommand));
                }
            } else {
                for (VkDeviceSize j = 0U; j < drawInfoCount; ++j) {
                    vkCmdDrawIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                      gpuIndirectBuffer->vkBuffer,
                                      offset + j * sizeof(VkDrawIndirectCommand),
                                      1,
                                      sizeof(VkDrawIndirectCommand));
                }
            }
        }
    } else {
        uint instanceCount  = std::max(info.instanceCount, 1U);
        bool hasIndexBuffer = _curGPUInputAssember->gpuIndexBuffer && info.indexCount > 0;

        if (hasIndexBuffer) {
            vkCmdDrawIndexed(_gpuCommandBuffer->vkCommandBuffer, info.indexCount, instanceCount,
                             info.firstIndex, info.vertexOffset, info.firstInstance);
        } else {
            vkCmdDraw(_gpuCommandBuffer->vkCommandBuffer, info.vertexCount, instanceCount,
                      info.firstVertex, info.firstInstance);
        }

        ++_numDrawCalls;
        _numInstances += info.instanceCount;
        if (_curGPUPipelineState) {
            uint indexCount = hasIndexBuffer ? info.indexCount : info.vertexCount;
            switch (_curGPUPipelineState->primitive) {
                case PrimitiveMode::TRIANGLE_LIST:
                    _numTriangles += indexCount / 3 * instanceCount;
                    break;
                case PrimitiveMode::TRIANGLE_STRIP:
                case PrimitiveMode::TRIANGLE_FAN:
                    _numTriangles += (indexCount - 2) * instanceCount;
                    break;
                default: break;
            }
        }
    }
}

void CCVKCommandBuffer::execute(CommandBuffer *const *cmdBuffs, uint count) {
    if (!count) return;
    _vkCommandBuffers.resize(count);

    uint validCount = 0U;
    for (uint i = 0U; i < count; ++i) {
        auto *cmdBuff = static_cast<CCVKCommandBuffer *>(cmdBuffs[i]);
        if (!cmdBuff->_pendingQueue.empty()) {
            _vkCommandBuffers[validCount++] = cmdBuff->_pendingQueue.front();
            cmdBuff->_pendingQueue.pop();

            _numDrawCalls += cmdBuff->_numDrawCalls;
            _numInstances += cmdBuff->_numInstances;
            _numTriangles += cmdBuff->_numTriangles;
        }
    }
    if (validCount) {
        vkCmdExecuteCommands(_gpuCommandBuffer->vkCommandBuffer, validCount,
                             _vkCommandBuffers.data());
    }
}

void CCVKCommandBuffer::updateBuffer(Buffer *buffer, const void *data, uint size) {
    CCVKGPUBuffer *gpuBuffer = static_cast<CCVKBuffer *>(buffer)->gpuBuffer();
    cmdFuncCCVKUpdateBuffer(CCVKDevice::getInstance(), gpuBuffer, data, size, _gpuCommandBuffer);
}

void CCVKCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    cmdFuncCCVKCopyBuffersToTexture(CCVKDevice::getInstance(), buffers, static_cast<CCVKTexture *>(texture)->gpuTexture(), regions, count, _gpuCommandBuffer);
}

void CCVKCommandBuffer::blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint count, Filter filter) {
    VkImageAspectFlags srcAspectMask  = VK_IMAGE_ASPECT_COLOR_BIT;
    VkImageAspectFlags dstAspectMask  = VK_IMAGE_ASPECT_COLOR_BIT;
    VkImage            srcImage       = VK_NULL_HANDLE;
    VkImage            dstImage       = VK_NULL_HANDLE;
    VkImageLayout      srcImageLayout = VK_IMAGE_LAYOUT_TRANSFER_SRC_OPTIMAL;
    VkImageLayout      dstImageLayout = VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL;
    CCVKGPUSwapchain * swapchain      = CCVKDevice::getInstance()->gpuSwapchain();

    if (srcTexture) {
        CCVKGPUTexture *gpuTextureSrc = static_cast<CCVKTexture *>(srcTexture)->gpuTexture();
        srcAspectMask                 = gpuTextureSrc->aspectMask;
        srcImage                      = gpuTextureSrc->vkImage;
    } else {
        srcAspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        srcImage      = swapchain->swapchainImages[swapchain->curImageIndex];
    }

    if (dstTexture) {
        CCVKGPUTexture *gpuTextureDst = static_cast<CCVKTexture *>(dstTexture)->gpuTexture();
        dstAspectMask                 = gpuTextureDst->aspectMask;
        dstImage                      = gpuTextureDst->vkImage;
    } else {
        dstAspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        dstImage      = swapchain->swapchainImages[swapchain->curImageIndex];

        VkImageMemoryBarrier barrier{VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER};
        barrier.dstAccessMask       = VK_ACCESS_TRANSFER_WRITE_BIT;
        barrier.newLayout           = VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL;
        barrier.srcQueueFamilyIndex = barrier.dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;

        barrier.image                       = dstImage;
        barrier.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        barrier.subresourceRange.levelCount = barrier.subresourceRange.layerCount = 1;

        vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer,
                             VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT, VK_PIPELINE_STAGE_TRANSFER_BIT, VK_DEPENDENCY_BY_REGION_BIT,
                             0, nullptr, 0, nullptr, 1, &barrier);
    }

    _blitRegions.resize(count);
    for (uint i = 0U; i < count; ++i) {
        const TextureBlit &region                     = regions[i];
        _blitRegions[i].srcSubresource.aspectMask     = srcAspectMask;
        _blitRegions[i].srcSubresource.mipLevel       = region.srcSubres.mipLevel;
        _blitRegions[i].srcSubresource.baseArrayLayer = region.srcSubres.baseArrayLayer;
        _blitRegions[i].srcSubresource.layerCount     = region.srcSubres.layerCount;
        _blitRegions[i].srcOffsets[0].x               = region.srcOffset.x;
        _blitRegions[i].srcOffsets[0].y               = region.srcOffset.y;
        _blitRegions[i].srcOffsets[0].z               = region.srcOffset.z;
        _blitRegions[i].srcOffsets[1].x               = static_cast<int32_t>(region.srcOffset.x + region.srcExtent.width);
        _blitRegions[i].srcOffsets[1].y               = static_cast<int32_t>(region.srcOffset.y + region.srcExtent.height);
        _blitRegions[i].srcOffsets[1].z               = static_cast<int32_t>(region.srcOffset.z + region.srcExtent.depth);

        _blitRegions[i].dstSubresource.aspectMask     = dstAspectMask;
        _blitRegions[i].dstSubresource.mipLevel       = region.dstSubres.mipLevel;
        _blitRegions[i].dstSubresource.baseArrayLayer = region.dstSubres.baseArrayLayer;
        _blitRegions[i].dstSubresource.layerCount     = region.dstSubres.layerCount;
        _blitRegions[i].dstOffsets[0].x               = region.dstOffset.x;
        _blitRegions[i].dstOffsets[0].y               = region.dstOffset.y;
        _blitRegions[i].dstOffsets[0].z               = region.dstOffset.z;
        _blitRegions[i].dstOffsets[1].x               = static_cast<int32_t>(region.dstOffset.x + region.dstExtent.width);
        _blitRegions[i].dstOffsets[1].y               = static_cast<int32_t>(region.dstOffset.y + region.dstExtent.height);
        _blitRegions[i].dstOffsets[1].z               = static_cast<int32_t>(region.dstOffset.z + region.dstExtent.depth);
    }

    vkCmdBlitImage(_gpuCommandBuffer->vkCommandBuffer,
                   srcImage, srcImageLayout,
                   dstImage, dstImageLayout,
                   count, _blitRegions.data(), VK_FILTERS[toNumber(filter)]);

    if (!dstTexture) {
        VkImageMemoryBarrier barrier{VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER};
        barrier.srcAccessMask       = VK_ACCESS_TRANSFER_WRITE_BIT;
        barrier.dstAccessMask       = 0;
        barrier.oldLayout           = VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL;
        barrier.newLayout           = VK_IMAGE_LAYOUT_PRESENT_SRC_KHR;
        barrier.srcQueueFamilyIndex = barrier.dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;

        barrier.image                       = dstImage;
        barrier.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        barrier.subresourceRange.levelCount = barrier.subresourceRange.layerCount = 1;

        vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer,
                             VK_PIPELINE_STAGE_TRANSFER_BIT, VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT, VK_DEPENDENCY_BY_REGION_BIT,
                             0, nullptr, 0, nullptr, 1, &barrier);
    }
}

void CCVKCommandBuffer::bindDescriptorSets(VkPipelineBindPoint bindPoint) {
    CCVKDevice *           device               = CCVKDevice::getInstance();
    CCVKGPUDevice *        gpuDevice            = device->gpuDevice();
    CCVKGPUPipelineLayout *pipelineLayout       = _curGPUPipelineState->gpuPipelineLayout;
    vector<uint> &         dynamicOffsetOffsets = pipelineLayout->dynamicOffsetOffsets;
    uint                   descriptorSetCount   = utils::toUint(pipelineLayout->setLayouts.size());
    _curDynamicOffsets.resize(pipelineLayout->dynamicOffsetCount);

    uint dirtyDescriptorSetCount = descriptorSetCount - _firstDirtyDescriptorSet;
    for (uint i = _firstDirtyDescriptorSet; i < descriptorSetCount; ++i) {
        if (_curGPUDescriptorSets[i]) {
            const CCVKGPUDescriptorSet::Instance &instance = _curGPUDescriptorSets[i]->instances[gpuDevice->curBackBufferIndex];
            _curVkDescriptorSets[i]                        = instance.vkDescriptorSet;
        } else {
            _curVkDescriptorSets[i] = pipelineLayout->setLayouts[i]->defaultDescriptorSet;
        }
        uint count = dynamicOffsetOffsets[i + 1] - dynamicOffsetOffsets[i];
        //CCASSERT(_curDynamicOffsetCounts[i] >= count, "missing dynamic offsets?");
        count = std::min(count, utils::toUint(_curDynamicOffsetsArray[i].size()));
        if (count > 0) memcpy(&_curDynamicOffsets[dynamicOffsetOffsets[i]], _curDynamicOffsetsArray[i].data(), count * sizeof(uint));
    }

    uint dynamicOffsetStartIndex = dynamicOffsetOffsets[_firstDirtyDescriptorSet];
    uint dynamicOffsetEndIndex   = dynamicOffsetOffsets[_firstDirtyDescriptorSet + dirtyDescriptorSetCount];
    uint dynamicOffsetCount      = dynamicOffsetEndIndex - dynamicOffsetStartIndex;
    vkCmdBindDescriptorSets(_gpuCommandBuffer->vkCommandBuffer,
                            bindPoint, pipelineLayout->vkPipelineLayout,
                            _firstDirtyDescriptorSet, dirtyDescriptorSetCount,
                            &_curVkDescriptorSets[_firstDirtyDescriptorSet],
                            dynamicOffsetCount, _curDynamicOffsets.data() + dynamicOffsetStartIndex);

    _firstDirtyDescriptorSet = UINT_MAX;
}

void CCVKCommandBuffer::dispatch(const DispatchInfo &info) {
    if (_firstDirtyDescriptorSet < _curGPUDescriptorSets.size()) {
        bindDescriptorSets(VK_PIPELINE_BIND_POINT_COMPUTE);
    }

    if (info.indirectBuffer) {
        auto *indirectBuffer = static_cast<CCVKBuffer *>(info.indirectBuffer);
        vkCmdDispatchIndirect(_gpuCommandBuffer->vkCommandBuffer, indirectBuffer->gpuBuffer()->vkBuffer,
                              indirectBuffer->gpuBuffer()->startOffset + indirectBuffer->gpuBufferView()->offset + info.indirectOffset);
    } else {
        vkCmdDispatch(_gpuCommandBuffer->vkCommandBuffer, info.groupCountX, info.groupCountY, info.groupCountZ);
    }
}

void CCVKCommandBuffer::pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint textureBarrierCount) {
    VkPipelineStageFlags        srcStageMask         = VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT;
    VkPipelineStageFlags        dstStageMask         = VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT;
    VkMemoryBarrier const *     pMemoryBarrier       = nullptr;
    uint                        memoryBarrierCount   = 0U;
    VkImageMemoryBarrier const *pImageMemoryBarriers = nullptr;

    if (barrier) {
        const auto *gpuBarrier = static_cast<const CCVKGlobalBarrier *>(barrier)->gpuBarrier();
        srcStageMask |= gpuBarrier->srcStageMask;
        dstStageMask |= gpuBarrier->dstStageMask;
        pMemoryBarrier     = &gpuBarrier->vkBarrier;
        memoryBarrierCount = 1U;
    }

    if (textureBarrierCount > 0) {
        _imageMemoryBarriers.resize(textureBarrierCount);
        pImageMemoryBarriers = _imageMemoryBarriers.data();

        for (uint i = 0U; i < textureBarrierCount; ++i) {
            const auto *gpuBarrier  = static_cast<const CCVKTextureBarrier *const>(textureBarriers[i])->gpuBarrier();
            _imageMemoryBarriers[i] = gpuBarrier->vkBarrier;

            if (textures[i]) {
                auto *gpuTexture                                    = static_cast<const CCVKTexture *const>(textures[i])->gpuTexture();
                _imageMemoryBarriers[i].image                       = gpuTexture->vkImage;
                _imageMemoryBarriers[i].subresourceRange.aspectMask = gpuTexture->aspectMask;
                gpuTexture->currentAccessTypes.assign(gpuBarrier->barrier.pNextAccesses, gpuBarrier->barrier.pNextAccesses + gpuBarrier->barrier.nextAccessCount);
            } else {
                CCVKGPUSwapchain *swapchain                         = CCVKDevice::getInstance()->gpuSwapchain();
                _imageMemoryBarriers[i].image                       = swapchain->swapchainImages[swapchain->curImageIndex];
                _imageMemoryBarriers[i].subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
                swapchain->swapchainImageAccessTypes[swapchain->curImageIndex].assign(gpuBarrier->barrier.pNextAccesses, gpuBarrier->barrier.pNextAccesses + gpuBarrier->barrier.nextAccessCount);
            }

            srcStageMask |= gpuBarrier->srcStageMask;
            dstStageMask |= gpuBarrier->dstStageMask;
        }
    }

    vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer, srcStageMask, dstStageMask, 0, memoryBarrierCount, pMemoryBarrier,
                         0, nullptr, textureBarrierCount, pImageMemoryBarriers);
}

} // namespace gfx
} // namespace cc
