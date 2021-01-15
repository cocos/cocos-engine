/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

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
#include "VKInputAssembler.h"
#include "VKPipelineState.h"
#include "VKQueue.h"
#include "VKRenderPass.h"
#include "VKTexture.h"

namespace cc {
namespace gfx {

CCVKCommandBuffer::CCVKCommandBuffer(Device *device)
: CommandBuffer(device) {
}

CCVKCommandBuffer::~CCVKCommandBuffer() {
}

bool CCVKCommandBuffer::initialize(const CommandBufferInfo &info) {
    _type = info.type;
    _queue = info.queue;

    _gpuCommandBuffer = CC_NEW(CCVKGPUCommandBuffer);
    _gpuCommandBuffer->level = MapVkCommandBufferLevel(_type);
    _gpuCommandBuffer->queueFamilyIndex = ((CCVKQueue *)_queue)->gpuQueue()->queueFamilyIndex;

    size_t setCount = ((CCVKDevice *)_device)->bindingMappingInfo().bufferOffsets.size();
    _curGPUDescriptorSets.resize(setCount);
    _curVkDescriptorSets.resize(setCount);
    _curDynamicOffsetPtrs.resize(setCount);
    _curDynamicOffsetCounts.resize(setCount);

    return true;
}

void CCVKCommandBuffer::destroy() {
    if (_gpuCommandBuffer) {
        CC_DELETE(_gpuCommandBuffer);
        _gpuCommandBuffer = nullptr;
    }
}

void CCVKCommandBuffer::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    if (_gpuCommandBuffer->began) return;

    ((CCVKDevice *)_device)->gpuDevice()->getCommandBufferPool(std::this_thread::get_id())->request(_gpuCommandBuffer);

    _curGPUPipelineState = nullptr;
    _curGPUInputAssember = nullptr;
    _curGPUDescriptorSets.assign(_curGPUDescriptorSets.size(), nullptr);
    _curDynamicOffsetCounts.assign(_curDynamicOffsetCounts.size(), 0u);
    _firstDirtyDescriptorSet = UINT_MAX;

    _numDrawCalls = 0;
    _numInstances = 0;
    _numTriangles = 0;

    VkCommandBufferBeginInfo beginInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO};
    beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;
    VkCommandBufferInheritanceInfo inheritanceInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_INHERITANCE_INFO};

    if (_type == CommandBufferType::SECONDARY) {
        if (!renderPass) {
            CC_LOG_ERROR("RenderPass has to be specified when beginning secondary command buffers.");
            return;
        }
        inheritanceInfo.renderPass = ((CCVKRenderPass *)renderPass)->gpuRenderPass()->vkRenderPass;
        inheritanceInfo.subpass = subpass;
        if (frameBuffer) {
            CCVKGPUFramebuffer *gpuFBO = ((CCVKFramebuffer *)frameBuffer)->gpuFBO();
            if (gpuFBO->isOffscreen)
                inheritanceInfo.framebuffer = gpuFBO->vkFramebuffer;
            else
                inheritanceInfo.framebuffer = gpuFBO->swapchain->vkSwapchainFramebufferListMap[gpuFBO][gpuFBO->swapchain->curImageIndex];
        }
        beginInfo.pInheritanceInfo = &inheritanceInfo;
        beginInfo.flags |= VK_COMMAND_BUFFER_USAGE_RENDER_PASS_CONTINUE_BIT;
    }

    VK_CHECK(vkBeginCommandBuffer(_gpuCommandBuffer->vkCommandBuffer, &beginInfo));

    _gpuCommandBuffer->began = true;
}

void CCVKCommandBuffer::end() {
    if (!_gpuCommandBuffer->began) return;

    _curGPUFBO = nullptr;
    _curGPUInputAssember = nullptr;
    _curViewport.width = _curViewport.height = _curScissor.width = _curScissor.height = 0u;
    VK_CHECK(vkEndCommandBuffer(_gpuCommandBuffer->vkCommandBuffer));
    _gpuCommandBuffer->began = false;

    _pendingQueue.push(_gpuCommandBuffer->vkCommandBuffer);
    ((CCVKDevice *)_device)->gpuDevice()->getCommandBufferPool(std::this_thread::get_id())->yield(_gpuCommandBuffer);
}

void CCVKCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, CommandBuffer *const *secondaryCBs, uint32_t secondaryCBCount) {
    _curGPUFBO = ((CCVKFramebuffer *)fbo)->gpuFBO();
    CCVKGPURenderPass *gpuRenderPass = ((CCVKRenderPass *)renderPass)->gpuRenderPass();
    VkFramebuffer framebuffer = _curGPUFBO->vkFramebuffer;
    if (!_curGPUFBO->isOffscreen) {
        framebuffer = _curGPUFBO->swapchain->vkSwapchainFramebufferListMap[_curGPUFBO][_curGPUFBO->swapchain->curImageIndex];
    }

    vector<VkClearValue> &clearValues = gpuRenderPass->clearValues;
    size_t attachmentCount = clearValues.size();

    if (attachmentCount) {
        for (size_t i = 0u; i < attachmentCount - 1; i++) {
            clearValues[i].color = {{colors[i].x, colors[i].y, colors[i].z, colors[i].w}};
        }
        clearValues[attachmentCount - 1].depthStencil = {depth, (uint)stencil};
    }

    // make previous framebuffer visible for load op
    if (gpuRenderPass->colorAttachments.size() && gpuRenderPass->colorAttachments[0].loadOp == LoadOp::LOAD) {
        VkMemoryBarrier barrier{VK_STRUCTURE_TYPE_MEMORY_BARRIER};
        barrier.srcAccessMask = VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT;
        barrier.dstAccessMask = VK_ACCESS_COLOR_ATTACHMENT_READ_BIT;
        vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer,
                             VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
                             VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT,
                             0, 1, &barrier, 0, nullptr, 0, nullptr);
    }

    if (gpuRenderPass->depthStencilAttachment.depthLoadOp == LoadOp::LOAD) {
        VkMemoryBarrier barrier{VK_STRUCTURE_TYPE_MEMORY_BARRIER};
        barrier.srcAccessMask = VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_WRITE_BIT;
        barrier.dstAccessMask = VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_READ_BIT;
        vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer,
                             VK_PIPELINE_STAGE_LATE_FRAGMENT_TESTS_BIT,
                             VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT | VK_PIPELINE_STAGE_LATE_FRAGMENT_TESTS_BIT,
                             0, 1, &barrier, 0, nullptr, 0, nullptr);
    }

    VkRenderPassBeginInfo passBeginInfo{VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO};
    passBeginInfo.renderPass = gpuRenderPass->vkRenderPass;
    passBeginInfo.framebuffer = framebuffer;
    passBeginInfo.clearValueCount = clearValues.size();
    passBeginInfo.pClearValues = clearValues.data();
    passBeginInfo.renderArea = {{(int)renderArea.x, (int)renderArea.y}, {renderArea.width, renderArea.height}};
    vkCmdBeginRenderPass(_gpuCommandBuffer->vkCommandBuffer, &passBeginInfo,
                         secondaryCBCount ? VK_SUBPASS_CONTENTS_SECONDARY_COMMAND_BUFFERS : VK_SUBPASS_CONTENTS_INLINE);

    if (!secondaryCBCount) {
        VkViewport viewport{(float)renderArea.x, (float)renderArea.y, (float)renderArea.width, (float)renderArea.height, 0.f, 1.f};
        vkCmdSetViewport(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &viewport);
        vkCmdSetScissor(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &passBeginInfo.renderArea);
    }
}

void CCVKCommandBuffer::endRenderPass() {
    vkCmdEndRenderPass(_gpuCommandBuffer->vkCommandBuffer);

    // guard against WAR hazard
    vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer, VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT, VK_PIPELINE_STAGE_TRANSFER_BIT, 0, 0, nullptr, 0, nullptr, 0, nullptr);

    _curGPUFBO = nullptr;
}

void CCVKCommandBuffer::bindPipelineState(PipelineState *pso) {
    CCVKGPUPipelineState *gpuPipelineState = ((CCVKPipelineState *)pso)->gpuPipelineState();

    if (_curGPUPipelineState != gpuPipelineState) {
        vkCmdBindPipeline(_gpuCommandBuffer->vkCommandBuffer, VK_PIPELINE_BIND_POINTS[(uint)gpuPipelineState->bindPoint], gpuPipelineState->vkPipeline);
        _curGPUPipelineState = gpuPipelineState;
    }
}

void CCVKCommandBuffer::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    CCASSERT(_curGPUDescriptorSets.size() > set, "Invalid set index");

    CCVKGPUDescriptorSet *gpuDescriptorSet = ((CCVKDescriptorSet *)descriptorSet)->gpuDescriptorSet();

    if (_curGPUDescriptorSets[set] != gpuDescriptorSet) {
        _curGPUDescriptorSets[set] = gpuDescriptorSet;
        if (set < _firstDirtyDescriptorSet) _firstDirtyDescriptorSet = set;
    }
    if (dynamicOffsetCount) {
        _curDynamicOffsetPtrs[set] = dynamicOffsets;
        _curDynamicOffsetCounts[set] = dynamicOffsetCount;
        if (set < _firstDirtyDescriptorSet) _firstDirtyDescriptorSet = set;
    }
}

void CCVKCommandBuffer::bindInputAssembler(InputAssembler *ia) {
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
                                 gpuInputAssembler->gpuIndexBuffer->stride == 4 ? VK_INDEX_TYPE_UINT32 : VK_INDEX_TYPE_UINT16);
        }
        _curGPUInputAssember = gpuInputAssembler;
    }
}

void CCVKCommandBuffer::setViewport(const Viewport &vp) {
    if (_curViewport != vp) {
        _curViewport = vp;

        VkViewport viewport{(float)vp.left, (float)vp.top, (float)vp.width, (float)vp.height, vp.minDepth, vp.maxDepth};
        vkCmdSetViewport(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &viewport);
    }
}

void CCVKCommandBuffer::setScissor(const Rect &rect) {
    if (_curScissor != rect) {
        _curScissor = rect;

        VkRect2D scissor = {{(int)rect.x, (int)rect.y}, {rect.width, rect.height}};
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

void CCVKCommandBuffer::setBlendConstants(const Color &constants) {
    if (math::IsNotEqualF(_curBlendConstants.x, constants.x) ||
        math::IsNotEqualF(_curBlendConstants.y, constants.y) ||
        math::IsNotEqualF(_curBlendConstants.z, constants.z) ||
        math::IsNotEqualF(_curBlendConstants.w, constants.w)) {
        _curBlendConstants.x = constants.x;
        _curBlendConstants.y = constants.y;
        _curBlendConstants.z = constants.z;
        _curBlendConstants.w = constants.w;
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

void CCVKCommandBuffer::setStencilWriteMask(StencilFace face, uint mask) {
    if ((_curStencilWriteMask.face != face) ||
        (_curStencilWriteMask.write_mask != mask)) {
        _curStencilWriteMask.face = face;
        _curStencilWriteMask.write_mask = mask;
        vkCmdSetStencilWriteMask(_gpuCommandBuffer->vkCommandBuffer,
                                 face == StencilFace::FRONT ? VK_STENCIL_FACE_FRONT_BIT : VK_STENCIL_FACE_BACK_BIT, mask);
    }
}

void CCVKCommandBuffer::setStencilCompareMask(StencilFace face, int reference, uint mask) {
    if ((_curStencilCompareMask.face != face) ||
        (_curStencilCompareMask.reference != reference) ||
        (_curStencilCompareMask.compareMask != mask)) {
        _curStencilCompareMask.face = face;
        _curStencilCompareMask.reference = reference;
        _curStencilCompareMask.compareMask = mask;

        VkStencilFaceFlagBits vkFace = (face == StencilFace::FRONT ? VK_STENCIL_FACE_FRONT_BIT : VK_STENCIL_FACE_BACK_BIT);
        vkCmdSetStencilReference(_gpuCommandBuffer->vkCommandBuffer, vkFace, reference);
        vkCmdSetStencilCompareMask(_gpuCommandBuffer->vkCommandBuffer, vkFace, mask);
    }
}

void CCVKCommandBuffer::draw(InputAssembler *ia) {
    if (_firstDirtyDescriptorSet < _curGPUDescriptorSets.size()) {
        bindDescriptorSets(VK_PIPELINE_BIND_POINT_GRAPHICS);
    }

    CCVKGPUInputAssembler *gpuInputAssembler = ((CCVKInputAssembler *)ia)->gpuInputAssembler();
    CCVKGPUBuffer *gpuIndirectBuffer = gpuInputAssembler->gpuIndirectBuffer;

    DrawInfo drawInfo;

    if (gpuIndirectBuffer) {
        uint drawInfoCount = gpuIndirectBuffer->count;
        CCVKGPUDevice *gpuDevice = static_cast<CCVKDevice *>(_device)->gpuDevice();
        VkDeviceSize offset = gpuIndirectBuffer->startOffset + gpuDevice->curBackBufferIndex * gpuIndirectBuffer->instanceSize;
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
            // If multi draw is not available, we must issue separate draw commands
            if (gpuIndirectBuffer->isDrawIndirectByIndex) {
                for (VkDeviceSize j = 0u; j < drawInfoCount; j++) {
                    vkCmdDrawIndexedIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                             gpuIndirectBuffer->vkBuffer,
                                             offset + j * sizeof(VkDrawIndexedIndirectCommand),
                                             1,
                                             sizeof(VkDrawIndexedIndirectCommand));
                }
            } else {
                for (VkDeviceSize j = 0u; j < drawInfoCount; j++) {
                    vkCmdDrawIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                      gpuIndirectBuffer->vkBuffer,
                                      offset + j * sizeof(VkDrawIndirectCommand),
                                      1,
                                      sizeof(VkDrawIndirectCommand));
                }
            }
        }
    } else {
        ((CCVKInputAssembler *)ia)->extractDrawInfo(drawInfo);
        uint instanceCount = std::max(drawInfo.instanceCount, 1u);
        bool hasIndexBuffer = gpuInputAssembler->gpuIndexBuffer && drawInfo.indexCount > 0;

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

    uint validCount = 0u;
    for (uint i = 0u; i < count; ++i) {
        CCVKCommandBuffer *cmdBuff = (CCVKCommandBuffer *)cmdBuffs[i];
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
    CCVKCmdFuncUpdateBuffer((CCVKDevice *)_device, ((CCVKBuffer *)buffer)->gpuBuffer(), data, size, _gpuCommandBuffer);
}

void CCVKCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    CCVKCmdFuncCopyBuffersToTexture((CCVKDevice *)_device, buffers, ((CCVKTexture *)texture)->gpuTexture(), regions, count, _gpuCommandBuffer);
}

void CCVKCommandBuffer::bindDescriptorSets(VkPipelineBindPoint bindPoint) {
    CCVKDevice *device = (CCVKDevice *)_device;
    CCVKGPUDevice *gpuDevice = device->gpuDevice();
    CCVKGPUPipelineLayout *pipelineLayout = _curGPUPipelineState->gpuPipelineLayout;
    vector<uint> &dynamicOffsetOffsets = pipelineLayout->dynamicOffsetOffsets;
    uint descriptorSetCount = pipelineLayout->setLayouts.size();
    _curDynamicOffsets.resize(pipelineLayout->dynamicOffsetCount);

    uint dirtyDescriptorSetCount = descriptorSetCount - _firstDirtyDescriptorSet;
    for (uint i = _firstDirtyDescriptorSet; i < descriptorSetCount; ++i) {
        if (_curGPUDescriptorSets[i]) {
            _curVkDescriptorSets[i] = _curGPUDescriptorSets[i]->instances[gpuDevice->curBackBufferIndex].vkDescriptorSet;
        } else {
            _curVkDescriptorSets[i] = pipelineLayout->setLayouts[i]->defaultDescriptorSet;
        }
        uint count = dynamicOffsetOffsets[i + 1] - dynamicOffsetOffsets[i];
        //CCASSERT(_curDynamicOffsetCounts[i] >= count, "missing dynamic offsets?");
        count = std::min(count, _curDynamicOffsetCounts[i]);
        if (count > 0) memcpy(&_curDynamicOffsets[dynamicOffsetOffsets[i]], _curDynamicOffsetPtrs[i], count * sizeof(uint));
    }

    uint dynamicOffsetStartIndex = dynamicOffsetOffsets[_firstDirtyDescriptorSet];
    uint dynamicOffsetEndIndex = dynamicOffsetOffsets[_firstDirtyDescriptorSet + dirtyDescriptorSetCount];
    uint dynamicOffsetCount = dynamicOffsetEndIndex - dynamicOffsetStartIndex;
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
        CCVKBuffer *indirectBuffer = (CCVKBuffer *)info.indirectBuffer;
        vkCmdDispatchIndirect(_gpuCommandBuffer->vkCommandBuffer, indirectBuffer->gpuBuffer()->vkBuffer,
                              indirectBuffer->gpuBuffer()->startOffset + indirectBuffer->gpuBufferView()->offset + info.indirectOffset);
    } else {
        vkCmdDispatch(_gpuCommandBuffer->vkCommandBuffer, info.groupCountX, info.groupCountY, info.groupCountZ);
    }
}

void CCVKCommandBuffer::pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *textureBarriers, uint textureBarrierCount) {
    uint count = 0u;
    if (barrier) count += barrier->prevAccessCount + barrier->nextAccessCount;
    for (uint b = 0u; b < textureBarrierCount; ++b) {
        count += textureBarriers[b].prevAccessCount + textureBarriers[b].nextAccessCount;
    }
    _accessTypes.resize(count);

    ThsvsGlobalBarrier vkBarrier;
    _textureBarriers.resize(textureBarrierCount);
    uint index = 0u;

    if (barrier) {
        vkBarrier.prevAccessCount = barrier->prevAccessCount;
        vkBarrier.pPrevAccesses = _accessTypes.data() + index;
        for (uint i = 0u; i < barrier->prevAccessCount; ++i, ++index) {
            _accessTypes[index] = THSVS_ACCESS_TYPES[(uint)barrier->prevAccesses[i]];
        }

        vkBarrier.nextAccessCount = barrier->nextAccessCount;
        vkBarrier.pNextAccesses = _accessTypes.data() + index;
        for (uint i = 0u; i < barrier->nextAccessCount; ++i, ++index) {
            _accessTypes[index] = THSVS_ACCESS_TYPES[(uint)barrier->nextAccesses[i]];
        }
    }

    for (uint b = 0u; b < textureBarrierCount; ++b) {
        const TextureBarrier &textureBarrier = textureBarriers[b];

        _textureBarriers[b].prevAccessCount = textureBarrier.prevAccessCount;
        _textureBarriers[b].pPrevAccesses = _accessTypes.data() + index;
        for (uint i = 0u; i < textureBarrier.prevAccessCount; ++i, ++index) {
            _accessTypes[index] = THSVS_ACCESS_TYPES[(uint)textureBarrier.prevAccesses[i]];
        }

        _textureBarriers[b].nextAccessCount = textureBarrier.nextAccessCount;
        _textureBarriers[b].pNextAccesses = _accessTypes.data() + index;
        for (uint i = 0u; i < textureBarrier.nextAccessCount; ++i, ++index) {
            _accessTypes[index] = THSVS_ACCESS_TYPES[(uint)textureBarrier.nextAccesses[i]];
        }

        _textureBarriers[b].prevLayout = textureBarrier.isPrevLayoutOptimal ? THSVS_IMAGE_LAYOUT_OPTIMAL : THSVS_IMAGE_LAYOUT_GENERAL;
        _textureBarriers[b].nextLayout = textureBarrier.isNextLayoutOptimal ? THSVS_IMAGE_LAYOUT_OPTIMAL : THSVS_IMAGE_LAYOUT_GENERAL;
        _textureBarriers[b].discardContents = textureBarrier.discardContents;
        _textureBarriers[b].srcQueueFamilyIndex = textureBarrier.srcQueue ? ((CCVKQueue *)textureBarrier.srcQueue)->gpuQueue()->queueFamilyIndex : VK_QUEUE_FAMILY_IGNORED;
        _textureBarriers[b].dstQueueFamilyIndex = textureBarrier.dstQueue ? ((CCVKQueue *)textureBarrier.dstQueue)->gpuQueue()->queueFamilyIndex : VK_QUEUE_FAMILY_IGNORED;

        const CCVKGPUTexture *gpuTexture = ((CCVKTexture *)textureBarrier.texture)->gpuTexture();
        _textureBarriers[b].image = gpuTexture->vkImage;
        _textureBarriers[b].subresourceRange.aspectMask = gpuTexture->aspectMask;
        _textureBarriers[b].subresourceRange.baseMipLevel = textureBarrier.subresRange.baseMipLevel;
        _textureBarriers[b].subresourceRange.levelCount = textureBarrier.subresRange.levelCount;
        _textureBarriers[b].subresourceRange.baseArrayLayer = textureBarrier.subresRange.baseArrayLayer;
        _textureBarriers[b].subresourceRange.layerCount = textureBarrier.subresRange.layerCount;
    }

    thsvsCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer, barrier ? &vkBarrier : nullptr, 0, nullptr, textureBarrierCount, _textureBarriers.data());
}

} // namespace gfx
} // namespace cc
