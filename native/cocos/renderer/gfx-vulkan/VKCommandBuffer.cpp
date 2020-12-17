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
    ((CCVKDevice *)_device)->gpuCommandBufferPool()->request(_gpuCommandBuffer);

    uint setCount = ((CCVKDevice *)_device)->bindingMappingInfo().bufferOffsets.size();
    _curGPUDescriptorSets.resize(setCount);
    _curDynamicOffsets.resize(setCount);

    return true;
}

void CCVKCommandBuffer::destroy() {
    if (_gpuCommandBuffer) {
        ((CCVKDevice *)_device)->gpuCommandBufferPool()->yield(_gpuCommandBuffer);
        CC_DELETE(_gpuCommandBuffer);
        _gpuCommandBuffer = nullptr;
    }
}

void CCVKCommandBuffer::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    if (_gpuCommandBuffer->began) return;

    _curGPUPipelineState = nullptr;
    _curGPUInputAssember = nullptr;
    _curGPUDescriptorSets.assign(_curGPUDescriptorSets.size(), nullptr);
    for (size_t i = 0u; i < _curDynamicOffsets.size(); i++) {
        _curDynamicOffsets[i].clear();
    }
    _firstDirtyDescriptorSet = UINT_MAX;

    _numDrawCalls = 0;
    _numInstances = 0;
    _numTriangles = 0;

    VkCommandBufferBeginInfo beginInfo{VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO};
    beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;

    if (_type == CommandBufferType::SECONDARY) {
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

    _gpuCommandBuffer->began = true;
}

void CCVKCommandBuffer::end() {
    if (!_gpuCommandBuffer->began) return;

    _curGPUFBO = nullptr;
    VK_CHECK(vkEndCommandBuffer(_gpuCommandBuffer->vkCommandBuffer));
    _gpuCommandBuffer->began = false;
}

void CCVKCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea,
                                        const Color *colors, float depth, int stencil) {
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
            clearValues[i].color = {colors[i].x, colors[i].y, colors[i].z, colors[i].w};
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
    vkCmdBeginRenderPass(_gpuCommandBuffer->vkCommandBuffer, &passBeginInfo, VK_SUBPASS_CONTENTS_INLINE);

    VkViewport viewport{(float)renderArea.x, (float)renderArea.y, (float)renderArea.width, (float)renderArea.height, 0.f, 1.f};
    vkCmdSetViewport(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &viewport);
    vkCmdSetScissor(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &passBeginInfo.renderArea);
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
        vkCmdBindPipeline(_gpuCommandBuffer->vkCommandBuffer, VK_PIPELINE_BIND_POINT_GRAPHICS, gpuPipelineState->vkPipeline);
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
        _curDynamicOffsets[set].assign(dynamicOffsets, dynamicOffsets + dynamicOffsetCount);
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
        bindDescriptorSets();
    }

    CCVKGPUInputAssembler *gpuInputAssembler = ((CCVKInputAssembler *)ia)->gpuInputAssembler();
    DrawInfo drawInfo;

    if (gpuInputAssembler->gpuIndirectBuffer) {
        uint drawInfoCount = gpuInputAssembler->gpuIndirectBuffer->count;
        if (static_cast<CCVKDevice *>(_device)->gpuDevice()->useMultiDrawIndirect) {
            if (gpuInputAssembler->gpuIndirectBuffer->isDrawIndirectByIndex) {
                vkCmdDrawIndexedIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                         gpuInputAssembler->gpuIndirectBuffer->vkBuffer,
                                         0,
                                         drawInfoCount,
                                         sizeof(VkDrawIndexedIndirectCommand));
            } else {
                vkCmdDrawIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                  gpuInputAssembler->gpuIndirectBuffer->vkBuffer,
                                  0,
                                  drawInfoCount,
                                  sizeof(VkDrawIndirectCommand));
            }
        } else {
            // If multi draw is not available, we must issue separate draw commands
            if (gpuInputAssembler->gpuIndirectBuffer->isDrawIndirectByIndex) {
                for (uint j = 0u; j < drawInfoCount; j++) {
                    vkCmdDrawIndexedIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                             gpuInputAssembler->gpuIndirectBuffer->vkBuffer,
                                             j * sizeof(VkDrawIndexedIndirectCommand),
                                             1,
                                             sizeof(VkDrawIndexedIndirectCommand));
                }
            } else {
                for (uint j = 0u; j < drawInfoCount; j++) {
                    vkCmdDrawIndirect(_gpuCommandBuffer->vkCommandBuffer,
                                      gpuInputAssembler->gpuIndirectBuffer->vkBuffer,
                                      j * sizeof(VkDrawIndirectCommand),
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

void CCVKCommandBuffer::execute(const CommandBuffer *const *cmdBuffs, uint count) {
    if (!count) return;

    vector<VkCommandBuffer> vkCmdBuffs(count);

    for (uint i = 0u; i < count; ++i) {
        CCVKCommandBuffer *cmdBuff = (CCVKCommandBuffer *)cmdBuffs[i];
        vkCmdBuffs[i] = cmdBuff->_gpuCommandBuffer->vkCommandBuffer;

        _numDrawCalls += cmdBuff->getNumDrawCalls();
        _numInstances += cmdBuff->getNumInstances();
        _numTriangles += cmdBuff->getNumTris();
    }

    vkCmdExecuteCommands(_gpuCommandBuffer->vkCommandBuffer, count, vkCmdBuffs.data());
}

void CCVKCommandBuffer::updateBuffer(Buffer *buffer, const void *data, uint size, uint offset) {
    CCVKCmdFuncUpdateBuffer((CCVKDevice *)_device, ((CCVKBuffer *)buffer)->gpuBuffer(), data, offset, size, _gpuCommandBuffer);
}

void CCVKCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    CCVKCmdFuncCopyBuffersToTexture((CCVKDevice *)_device, buffers, ((CCVKTexture *)texture)->gpuTexture(), regions, count, _gpuCommandBuffer);
}

void CCVKCommandBuffer::bindDescriptorSets() {

    CCVKDevice *device = (CCVKDevice *)_device;
    CCVKGPUDevice *gpuDevice = device->gpuDevice();
    VkCommandBuffer cmdBuff = _gpuCommandBuffer->vkCommandBuffer;
    CCVKGPUPipelineLayout *pipelineLayout = _curGPUPipelineState->gpuPipelineLayout;
    uint dirtyDescriptorSetCount = _curGPUDescriptorSets.size() - _firstDirtyDescriptorSet;
    uint dynamicOffsetStartIndex = pipelineLayout->dynamicOffsetOffsets[_firstDirtyDescriptorSet];
    uint dynamicOffsetCount = pipelineLayout->dynamicOffsetCount - dynamicOffsetStartIndex;
    uint *dynamicOffsets = pipelineLayout->dynamicOffsets.data() + dynamicOffsetStartIndex;

    const vector<VkDescriptorSetLayout> &layouts = _curGPUPipelineState->gpuPipelineLayout->descriptorSetLayouts;
    vector<VkDescriptorSet> &sets = _curGPUPipelineState->gpuPipelineLayout->descriptorSets;
    device->gpuDescriptorSetPool()->alloc(layouts.data() + _firstDirtyDescriptorSet,
                                          sets.data() + _firstDirtyDescriptorSet,
                                          dirtyDescriptorSetCount);

    for (uint i = 0u, offsetAcc = 0u; i < dirtyDescriptorSetCount; i++) {
        uint set = _firstDirtyDescriptorSet + i;
        CCVKGPUDescriptorSet *gpuDescriptorSet = _curGPUDescriptorSets[set];
        if (!gpuDescriptorSet || !gpuDescriptorSet->gpuDescriptors.size()) continue;

        if (gpuDevice->useDescriptorUpdateTemplate) {
            const vector<CCVKDescriptorInfo> &descriptorInfos = gpuDescriptorSet->descriptorInfos;
            const vector<VkDescriptorUpdateTemplate> &templates = pipelineLayout->vkDescriptorUpdateTemplates;
            vkUpdateDescriptorSetWithTemplateKHR(device->gpuDevice()->vkDevice, sets[set], templates[set], descriptorInfos.data());
        } else {
            vector<VkWriteDescriptorSet> &entries = gpuDescriptorSet->descriptorUpdateEntries;

            for (uint j = 0u; j < entries.size(); j++) {
                entries[j].dstSet = sets[set];
            }
            vkUpdateDescriptorSets(device->gpuDevice()->vkDevice, entries.size(), entries.data(), 0, nullptr);
        }

        uint offsetCount = pipelineLayout->dynamicOffsetOffsets[set + 1] - dynamicOffsetStartIndex;
        if (_curDynamicOffsets[set].size() && offsetCount > 0) {
            memcpy(dynamicOffsets + offsetAcc, _curDynamicOffsets[set].data(), offsetCount * sizeof(uint));
            offsetAcc += offsetCount;
        }
    }

    vkCmdBindDescriptorSets(cmdBuff, VK_PIPELINE_BIND_POINT_GRAPHICS, pipelineLayout->vkPipelineLayout,
                            _firstDirtyDescriptorSet, dirtyDescriptorSetCount, sets.data() + _firstDirtyDescriptorSet,
                            dynamicOffsetCount, dynamicOffsets);

    _firstDirtyDescriptorSet = UINT_MAX;
}

} // namespace gfx
} // namespace cc
