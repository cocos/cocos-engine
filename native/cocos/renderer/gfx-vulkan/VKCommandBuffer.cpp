/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "VKCommandBuffer.h"
#include "VKBuffer.h"
#include "VKCommands.h"
#include "VKDescriptorSet.h"
#include "VKDevice.h"
#include "VKFramebuffer.h"
#include "VKInputAssembler.h"
#include "VKPipelineState.h"
#include "VKQueryPool.h"
#include "VKQueue.h"
#include "VKRenderPass.h"
#include "VKTexture.h"
#include "states/VKGeneralBarrier.h"
#include "states/VKTextureBarrier.h"

namespace cc {
namespace gfx {

CCVKCommandBuffer::CCVKCommandBuffer() {
    _typedID = generateObjectID<decltype(this)>();
}

CCVKCommandBuffer::~CCVKCommandBuffer() {
    destroy();
}

void CCVKCommandBuffer::doInit(const CommandBufferInfo & /*info*/) {
    _gpuCommandBuffer                   = CC_NEW(CCVKGPUCommandBuffer);
    _gpuCommandBuffer->level            = mapVkCommandBufferLevel(_type);
    _gpuCommandBuffer->queueFamilyIndex = static_cast<CCVKQueue *>(_queue)->gpuQueue()->queueFamilyIndex;

    size_t setCount = CCVKDevice::getInstance()->bindingMappingInfo().setIndices.size();
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

void CCVKCommandBuffer::begin(RenderPass *renderPass, uint32_t subpass, Framebuffer *frameBuffer) {
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

    _curGPUFBO           = nullptr;
    _curGPUInputAssember = nullptr;

    _curDynamicStates.viewports.resize(0);

    VK_CHECK(vkEndCommandBuffer(_gpuCommandBuffer->vkCommandBuffer));
    _gpuCommandBuffer->began = false;

    _pendingQueue.push(_gpuCommandBuffer->vkCommandBuffer);
    CCVKDevice::getInstance()->gpuDevice()->getCommandBufferPool()->yield(_gpuCommandBuffer);
}

void CCVKCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors,
                                        float depth, uint32_t stencil, CommandBuffer *const * /*secondaryCBs*/, uint32_t secondaryCBCount) {
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

    _curGPUFBO        = static_cast<CCVKFramebuffer *>(fbo)->gpuFBO();
    _curGPURenderPass = static_cast<CCVKRenderPass *>(renderPass)->gpuRenderPass();
    VkFramebuffer framebuffer{_curGPUFBO->vkFramebuffer};
    if (!_curGPUFBO->isOffscreen) {
        framebuffer = _curGPUFBO->swapchain->vkSwapchainFramebufferListMap[_curGPUFBO][_curGPUFBO->swapchain->curImageIndex];
    }

    vector<VkClearValue> &clearValues     = _curGPURenderPass->clearValues;
    bool                  depthEnabled    = _curGPURenderPass->depthStencilAttachment.format != Format::UNKNOWN;
    size_t                attachmentCount = depthEnabled ? clearValues.size() - 1 : clearValues.size();

    for (size_t i = 0U; i < attachmentCount; ++i) {
        clearValues[i].color = {{colors[i].x, colors[i].y, colors[i].z, colors[i].w}};
    }
    if (depthEnabled) {
        clearValues[attachmentCount].depthStencil = {depth, stencil};
    }

    Rect safeArea{
        std::min(renderArea.x, static_cast<int32_t>(_curGPUFBO->width)),
        std::min(renderArea.y, static_cast<int32_t>(_curGPUFBO->height)),
        std::min(renderArea.width, _curGPUFBO->width),
        std::min(renderArea.height, _curGPUFBO->height),
    };

    VkRenderPassBeginInfo passBeginInfo{VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO};
    passBeginInfo.renderPass        = _curGPURenderPass->vkRenderPass;
    passBeginInfo.framebuffer       = framebuffer;
    passBeginInfo.clearValueCount   = utils::toUint(clearValues.size());
    passBeginInfo.pClearValues      = clearValues.data();
    passBeginInfo.renderArea.offset = {safeArea.x, safeArea.y};
    passBeginInfo.renderArea.extent = {safeArea.width, safeArea.height};

    vkCmdBeginRenderPass(_gpuCommandBuffer->vkCommandBuffer, &passBeginInfo,
                         secondaryCBCount ? VK_SUBPASS_CONTENTS_SECONDARY_COMMAND_BUFFERS : VK_SUBPASS_CONTENTS_INLINE);

    _secondaryRP = secondaryCBCount;

    if (!secondaryCBCount) {
        VkViewport viewport{static_cast<float>(safeArea.x), static_cast<float>(safeArea.y),
                            static_cast<float>(safeArea.width), static_cast<float>(safeArea.height), 0.F, 1.F};
        _curDynamicStates.viewports.push_back({safeArea.x, safeArea.y, safeArea.width, safeArea.height});

        vkCmdSetViewport(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &viewport);
        vkCmdSetScissor(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &passBeginInfo.renderArea);
    }
}

void CCVKCommandBuffer::endRenderPass() {
    vkCmdEndRenderPass(_gpuCommandBuffer->vkCommandBuffer);

    CCVKGPUDevice *gpuDevice            = CCVKDevice::getInstance()->gpuDevice();
    size_t         colorAttachmentCount = _curGPURenderPass->colorAttachments.size();
    for (size_t i = 0U; i < colorAttachmentCount; ++i) {
        _curGPUFBO->gpuColorViews[i]->gpuTexture->currentAccessTypes = _curGPURenderPass->getBarrier(i, gpuDevice)->nextAccesses;
    }

    if (_curGPURenderPass->depthStencilAttachment.format != Format::UNKNOWN) {
        _curGPUFBO->gpuDepthStencilView->gpuTexture->currentAccessTypes = _curGPURenderPass->getBarrier(colorAttachmentCount, gpuDevice)->nextAccesses;
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

void CCVKCommandBuffer::bindDescriptorSet(uint32_t set, DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) {
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
        uint32_t vbCount = utils::toUint(gpuInputAssembler->gpuVertexBuffers.size());
        if (gpuInputAssembler->vertexBuffers.size() < vbCount) {
            gpuInputAssembler->vertexBuffers.resize(vbCount);
            gpuInputAssembler->vertexBufferOffsets.resize(vbCount);
        }

        CCVKGPUDevice *gpuDevice = CCVKDevice::getInstance()->gpuDevice();
        for (uint32_t i = 0U; i < vbCount; ++i) {
            gpuInputAssembler->vertexBuffers[i]       = gpuInputAssembler->gpuVertexBuffers[i]->gpuBuffer->vkBuffer;
            gpuInputAssembler->vertexBufferOffsets[i] = gpuInputAssembler->gpuVertexBuffers[i]->getStartOffset(gpuDevice->curBackBufferIndex);
        }

        vkCmdBindVertexBuffers(_gpuCommandBuffer->vkCommandBuffer, 0, vbCount,
                               gpuInputAssembler->vertexBuffers.data(), gpuInputAssembler->vertexBufferOffsets.data());

        if (gpuInputAssembler->gpuIndexBuffer) {
            vkCmdBindIndexBuffer(_gpuCommandBuffer->vkCommandBuffer, gpuInputAssembler->gpuIndexBuffer->gpuBuffer->vkBuffer,
                                 gpuInputAssembler->gpuIndexBuffer->gpuBuffer->getStartOffset(gpuDevice->curBackBufferIndex),
                                 gpuInputAssembler->gpuIndexBuffer->gpuBuffer->stride == 4 ? VK_INDEX_TYPE_UINT32 : VK_INDEX_TYPE_UINT16);
        }
        _curGPUInputAssember = gpuInputAssembler;
    }
}

void CCVKCommandBuffer::setViewports(const Rect *vp, uint32_t count) {
    int start = -1;

    static vector<VkViewport> vkViewports;
    static vector<VkRect2D>   vkScissors;
    vkViewports.resize(count);
    vkScissors.resize(count);

    ViewportList &viewports = _curDynamicStates.viewports;

    viewports.resize(count);

    for (int i = 0; i < count; i++) {
        if (viewports[i] != vp[i]) {
            start = i;
            copy(&vp[i], &vp[count - 1], viewports.begin() + i);
            break;
        }
    }

    if (start != -1) {
        transform(viewports.cbegin() + start, viewports.cend(), vkViewports.begin() + start,
                  [](const Rect &v) { return VkViewport{static_cast<float>(v.x), static_cast<float>(v.y), static_cast<float>(v.width), static_cast<float>(v.height), 0.f, 1.f}; });
        transform(viewports.cbegin() + start, viewports.cend(), vkScissors.begin() + start,
                  [](const Rect &v) { return VkRect2D{{v.x, v.y}, {v.width, v.height}}; });

        vkCmdSetViewport(_gpuCommandBuffer->vkCommandBuffer, start, count - start, vkViewports.data() + start);
        vkCmdSetScissor(_gpuCommandBuffer->vkCommandBuffer, start, count - start, vkScissors.data() + start);
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

void CCVKCommandBuffer::setStencilWriteMask(StencilFace face, uint32_t mask) {
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

void CCVKCommandBuffer::setStencilCompareMask(StencilFace face, uint32_t reference, uint32_t mask) {
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

    const auto *gpuIndirectBuffer = _curGPUInputAssember->gpuIndirectBuffer;

    if (gpuIndirectBuffer) {
        uint32_t       drawInfoCount = gpuIndirectBuffer->range / gpuIndirectBuffer->gpuBuffer->stride;
        CCVKGPUDevice *gpuDevice     = CCVKDevice::getInstance()->gpuDevice();
        VkDeviceSize   offset        = gpuIndirectBuffer->getStartOffset(gpuDevice->curBackBufferIndex);
        if (gpuDevice->useMultiDrawIndirect) {
            if (gpuIndirectBuffer->gpuBuffer->isDrawIndirectByIndex) {
                vkCmdDrawIndexedIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                         gpuIndirectBuffer->gpuBuffer->vkBuffer,
                                         offset,
                                         drawInfoCount,
                                         sizeof(VkDrawIndexedIndirectCommand));
            } else {
                vkCmdDrawIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                  gpuIndirectBuffer->gpuBuffer->vkBuffer,
                                  offset,
                                  drawInfoCount,
                                  sizeof(VkDrawIndirectCommand));
            }
        } else {
            if (gpuIndirectBuffer->gpuBuffer->isDrawIndirectByIndex) {
                for (VkDeviceSize j = 0U; j < drawInfoCount; ++j) {
                    vkCmdDrawIndexedIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                             gpuIndirectBuffer->gpuBuffer->vkBuffer,
                                             offset + j * sizeof(VkDrawIndexedIndirectCommand),
                                             1,
                                             sizeof(VkDrawIndexedIndirectCommand));
                }
            } else {
                for (VkDeviceSize j = 0U; j < drawInfoCount; ++j) {
                    vkCmdDrawIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                      gpuIndirectBuffer->gpuBuffer->vkBuffer,
                                      offset + j * sizeof(VkDrawIndirectCommand),
                                      1,
                                      sizeof(VkDrawIndirectCommand));
                }
            }
        }
    } else {
        uint32_t instanceCount  = std::max(info.instanceCount, 1U);
        bool     hasIndexBuffer = _curGPUInputAssember->gpuIndexBuffer && info.indexCount > 0;

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
            uint32_t indexCount = hasIndexBuffer ? info.indexCount : info.vertexCount;
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

void CCVKCommandBuffer::execute(CommandBuffer *const *cmdBuffs, uint32_t count) {
    if (!count) return;
    _vkCommandBuffers.resize(count);

    uint32_t validCount = 0U;
    for (uint32_t i = 0U; i < count; ++i) {
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

void CCVKCommandBuffer::updateBuffer(Buffer *buffer, const void *data, uint32_t size) {
    CCVKGPUBuffer *gpuBuffer = static_cast<CCVKBuffer *>(buffer)->gpuBuffer();
    cmdFuncCCVKUpdateBuffer(CCVKDevice::getInstance(), gpuBuffer, data, size, _gpuCommandBuffer);
}

void CCVKCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint32_t count) {
    cmdFuncCCVKCopyBuffersToTexture(CCVKDevice::getInstance(), buffers, static_cast<CCVKTexture *>(texture)->gpuTexture(), regions, count, _gpuCommandBuffer);
}

void CCVKCommandBuffer::blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint32_t count, Filter filter) {
    VkImageAspectFlags srcAspectMask  = VK_IMAGE_ASPECT_COLOR_BIT;
    VkImageAspectFlags dstAspectMask  = VK_IMAGE_ASPECT_COLOR_BIT;
    VkImage            srcImage       = VK_NULL_HANDLE;
    VkImage            dstImage       = VK_NULL_HANDLE;
    VkImageLayout      srcImageLayout = VK_IMAGE_LAYOUT_TRANSFER_SRC_OPTIMAL;
    VkImageLayout      dstImageLayout = VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL;

    CCVKGPUTexture *gpuTextureSrc = static_cast<CCVKTexture *>(srcTexture)->gpuTexture();
    srcAspectMask                 = gpuTextureSrc->aspectMask;
    if (gpuTextureSrc->swapchain) {
        srcImage = gpuTextureSrc->swapchainVkImages[gpuTextureSrc->swapchain->curImageIndex];
    } else {
        srcImage = gpuTextureSrc->vkImage;
    }

    CCVKGPUTexture *gpuTextureDst = static_cast<CCVKTexture *>(dstTexture)->gpuTexture();
    dstAspectMask                 = gpuTextureDst->aspectMask;
    if (gpuTextureDst->swapchain) {
        dstImage = gpuTextureDst->swapchainVkImages[gpuTextureDst->swapchain->curImageIndex];

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
    } else {
        dstImage = gpuTextureDst->vkImage;
    }

    _blitRegions.resize(count);
    for (uint32_t i = 0U; i < count; ++i) {
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

    if (gpuTextureDst->swapchain) {
        VkImageMemoryBarrier barrier{VK_STRUCTURE_TYPE_IMAGE_MEMORY_BARRIER};
        barrier.srcAccessMask       = VK_ACCESS_TRANSFER_WRITE_BIT;
        barrier.oldLayout           = VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL;
        barrier.dstAccessMask       = VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT;
        barrier.newLayout           = VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL;
        barrier.srcQueueFamilyIndex = barrier.dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;

        barrier.image                       = dstImage;
        barrier.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        barrier.subresourceRange.levelCount = barrier.subresourceRange.layerCount = 1;

        vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer,
                             VK_PIPELINE_STAGE_TRANSFER_BIT, VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT, VK_DEPENDENCY_BY_REGION_BIT,
                             0, nullptr, 0, nullptr, 1, &barrier);
    }
}

void CCVKCommandBuffer::bindDescriptorSets(VkPipelineBindPoint bindPoint) {
    CCVKDevice *           device               = CCVKDevice::getInstance();
    CCVKGPUDevice *        gpuDevice            = device->gpuDevice();
    CCVKGPUPipelineLayout *pipelineLayout       = _curGPUPipelineState->gpuPipelineLayout;
    vector<uint32_t> &     dynamicOffsetOffsets = pipelineLayout->dynamicOffsetOffsets;
    uint32_t               descriptorSetCount   = utils::toUint(pipelineLayout->setLayouts.size());
    _curDynamicOffsets.resize(pipelineLayout->dynamicOffsetCount);

    uint32_t dirtyDescriptorSetCount = descriptorSetCount - _firstDirtyDescriptorSet;
    for (uint32_t i = _firstDirtyDescriptorSet; i < descriptorSetCount; ++i) {
        if (_curGPUDescriptorSets[i]) {
            const CCVKGPUDescriptorSet::Instance &instance = _curGPUDescriptorSets[i]->instances[gpuDevice->curBackBufferIndex];
            _curVkDescriptorSets[i]                        = instance.vkDescriptorSet;
        } else {
            _curVkDescriptorSets[i] = pipelineLayout->setLayouts[i]->defaultDescriptorSet;
        }
        uint32_t count = dynamicOffsetOffsets[i + 1] - dynamicOffsetOffsets[i];
        //CCASSERT(_curDynamicOffsetCounts[i] >= count, "missing dynamic offsets?");
        count = std::min(count, utils::toUint(_curDynamicOffsetsArray[i].size()));
        if (count > 0) memcpy(&_curDynamicOffsets[dynamicOffsetOffsets[i]], _curDynamicOffsetsArray[i].data(), count * sizeof(uint32_t));
    }

    uint32_t dynamicOffsetStartIndex = dynamicOffsetOffsets[_firstDirtyDescriptorSet];
    uint32_t dynamicOffsetEndIndex   = dynamicOffsetOffsets[_firstDirtyDescriptorSet + dirtyDescriptorSetCount];
    uint32_t dynamicOffsetCount      = dynamicOffsetEndIndex - dynamicOffsetStartIndex;
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
        CCVKGPUDevice *gpuDevice      = CCVKDevice::getInstance()->gpuDevice();
        auto *         indirectBuffer = static_cast<CCVKBuffer *>(info.indirectBuffer);
        vkCmdDispatchIndirect(_gpuCommandBuffer->vkCommandBuffer, indirectBuffer->gpuBuffer()->vkBuffer,
                              indirectBuffer->gpuBufferView()->getStartOffset(gpuDevice->curBackBufferIndex) + info.indirectOffset);
    } else {
        vkCmdDispatch(_gpuCommandBuffer->vkCommandBuffer, info.groupCountX, info.groupCountY, info.groupCountZ);
    }
}

void CCVKCommandBuffer::pipelineBarrier(const GeneralBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint32_t textureBarrierCount) {
    VkPipelineStageFlags        srcStageMask         = VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT;
    VkPipelineStageFlags        dstStageMask         = VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT;
    VkMemoryBarrier const *     pMemoryBarrier       = nullptr;
    uint32_t                    memoryBarrierCount   = 0U;
    VkImageMemoryBarrier const *pImageMemoryBarriers = nullptr;

    if (barrier) {
        const auto *gpuBarrier = static_cast<const CCVKGeneralBarrier *>(barrier)->gpuBarrier();
        srcStageMask |= gpuBarrier->srcStageMask;
        dstStageMask |= gpuBarrier->dstStageMask;
        pMemoryBarrier     = &gpuBarrier->vkBarrier;
        memoryBarrierCount = 1U;
    }

    if (textureBarrierCount > 0) {
        _imageMemoryBarriers.resize(textureBarrierCount);
        pImageMemoryBarriers = _imageMemoryBarriers.data();

        for (uint32_t i = 0U; i < textureBarrierCount; ++i) {
            const auto *gpuBarrier = static_cast<const CCVKTextureBarrier *const>(textureBarriers[i])->gpuBarrier();
            auto *      gpuTexture = static_cast<const CCVKTexture *const>(textures[i])->gpuTexture();

            _imageMemoryBarriers[i]                             = gpuBarrier->vkBarrier;
            _imageMemoryBarriers[i].subresourceRange.aspectMask = gpuTexture->aspectMask;
            if (gpuTexture->swapchain) {
                _imageMemoryBarriers[i].image = gpuTexture->swapchainVkImages[gpuTexture->swapchain->curImageIndex];
            } else {
                _imageMemoryBarriers[i].image = gpuTexture->vkImage;
            }

            srcStageMask |= gpuBarrier->srcStageMask;
            dstStageMask |= gpuBarrier->dstStageMask;

            gpuTexture->currentAccessTypes.assign(gpuBarrier->barrier.pNextAccesses, gpuBarrier->barrier.pNextAccesses + gpuBarrier->barrier.nextAccessCount);
        }
    }

    vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer, srcStageMask, dstStageMask, 0, memoryBarrierCount, pMemoryBarrier,
                         0, nullptr, textureBarrierCount, pImageMemoryBarriers);
}

void CCVKCommandBuffer::beginQuery(QueryPool *queryPool, uint32_t /*id*/) {
    auto *            vkQueryPool  = static_cast<CCVKQueryPool *>(queryPool);
    CCVKGPUQueryPool *gpuQueryPool = vkQueryPool->gpuQueryPool();
    auto              queryId      = static_cast<uint32_t>(vkQueryPool->_ids.size());

    if (queryId < queryPool->getMaxQueryObjects()) {
        vkCmdBeginQuery(_gpuCommandBuffer->vkCommandBuffer, gpuQueryPool->vkPool, queryId, 0);
    }
}

void CCVKCommandBuffer::endQuery(QueryPool *queryPool, uint32_t id) {
    auto *            vkQueryPool  = static_cast<CCVKQueryPool *>(queryPool);
    CCVKGPUQueryPool *gpuQueryPool = vkQueryPool->gpuQueryPool();
    auto              queryId      = static_cast<uint32_t>(vkQueryPool->_ids.size());

    if (queryId < queryPool->getMaxQueryObjects()) {
        vkCmdEndQuery(_gpuCommandBuffer->vkCommandBuffer, gpuQueryPool->vkPool, queryId);
        vkQueryPool->_ids.push_back(id);
    }
}

void CCVKCommandBuffer::resetQueryPool(QueryPool *queryPool) {
    auto *            vkQueryPool  = static_cast<CCVKQueryPool *>(queryPool);
    CCVKGPUQueryPool *gpuQueryPool = vkQueryPool->gpuQueryPool();

    vkCmdResetQueryPool(_gpuCommandBuffer->vkCommandBuffer, gpuQueryPool->vkPool, 0, queryPool->getMaxQueryObjects());
    vkQueryPool->_ids.clear();
}

} // namespace gfx
} // namespace cc
