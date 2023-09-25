/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "WGPUCommandBuffer.h"
#include <webgpu/webgpu.h>
#include <limits>
#include <string>
#include "WGPUBuffer.h"
#include "WGPUDescriptorSet.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUFrameBuffer.h"
#include "WGPUInputAssembler.h"
#include "WGPUObject.h"
#include "WGPUPipelineLayout.h"
#include "WGPUPipelineState.h"
#include "WGPUQueue.h"
#include "WGPUShader.h"
#include "WGPUSwapchain.h"
#include "WGPUTexture.h"
#include "WGPUUtils.h"
#include "base/std/container/vector.h"
namespace cc {
namespace gfx {

namespace {
uint32_t dynamicOffsetBuffer[256];
uint32_t dynBufferStartIndex = 0;
} // namespace

CCWGPUCommandBuffer::CCWGPUCommandBuffer() : CommandBuffer() {
}

CCWGPUCommandBuffer::~CCWGPUCommandBuffer() {
    doDestroy();
}
void CCWGPUCommandBuffer::doInit(const CommandBufferInfo &info) {
    _gpuCommandBufferObj = ccnew CCWGPUCommandBufferObject{};
    _gpuCommandBufferObj->type = info.type;
    _gpuCommandBufferObj->queue = static_cast<CCWGPUQueue *>(info.queue);
    _gpuCommandBufferObj->stateCache.descriptorSets.resize(4); //(info.queue->getDevice()->getMaxDescriptorSetLayoutBindings());
    memset(dynamicOffsetBuffer, 0, sizeof(dynamicOffsetBuffer));
    dynBufferStartIndex = 0;
}

void CCWGPUCommandBuffer::doDestroy() {
    if (_gpuCommandBufferObj) {
        if (!_gpuCommandBufferObj->redundantVertexBufferMap.empty()) {
            for (auto &pair : _gpuCommandBufferObj->redundantVertexBufferMap) {
                pair.second->destroy();
                delete pair.second;
            }
        }
        delete _gpuCommandBufferObj;
        _gpuCommandBufferObj = nullptr;
    }
}

void CCWGPUCommandBuffer::begin(RenderPass * /*renderPass*/, uint32_t /*subpass*/, Framebuffer * /*frameBuffer*/) {
    reset();

    _numTriangles = 0;
    _numDrawCalls = 0;
    _numInstances = 0;

    _gpuCommandBufferObj->wgpuCommandEncoder = wgpuDeviceCreateCommandEncoder(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, nullptr);

    _attachmentSet.clear();
}

void CCWGPUCommandBuffer::end() {
    auto *pipelineState = _gpuCommandBufferObj->stateCache.pipelineState;
    if (pipelineState) {
        _gpuCommandBufferObj->wgpuCommandBuffer = wgpuCommandEncoderFinish(_gpuCommandBufferObj->wgpuCommandEncoder, nullptr);
    }
}

void CCWGPUCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, uint32_t stencil, CommandBuffer *const * /*secondaryCBs*/, uint32_t /*secondaryCBCount*/) {
    _renderPass = renderPass;
    _frameBuffer = fbo;

    CCWGPUFramebuffer *ccFrameBuffer = static_cast<CCWGPUFramebuffer *>(fbo);
    const ColorAttachmentList &colorConfigs = renderPass->getColorAttachments();
    const DepthStencilAttachment &depthStencilConfig = renderPass->getDepthStencilAttachment();
    const TextureList &textures = ccFrameBuffer->getColorTextures();
    Texture *dsTexture = ccFrameBuffer->getDepthStencilTexture();
    CCWGPUSwapchain *swapchain = ccFrameBuffer->swapchain();

    bool renderingFullScreen = true;
    bool needPartialClear = false;
    for (size_t i = 0; i < textures.size(); ++i) {
        if (renderArea.x != 0 || renderArea.y != 0 || renderArea.width != textures[i]->getWidth() || renderArea.height != textures[i]->getHeight()) {
            renderingFullScreen = false;
            break;
        }
    }

    WGPURenderPassDescriptor &renderPassDesc = _gpuCommandBufferObj->renderPassDescriptor;
    ccstd::vector<WGPURenderPassColorAttachment> colorAttachments;
    if (colorConfigs.empty()) {
        renderPassDesc.nextInChain = nullptr;
        renderPassDesc.label = "swapchain";
        auto *targetTex = swapchain->gpuSwapchainObject()->swapchainColor;
        auto loadOp = WGPULoadOp_Clear;
        loadOp = _attachmentSet.find(targetTex) == _attachmentSet.end() ? loadOp : WGPULoadOp_Load;
        needPartialClear = !renderingFullScreen;
        WGPURenderPassColorAttachment color = {
            .view = swapchain->gpuSwapchainObject()->swapchainColor->gpuTextureObject()->selfView,
            .resolveTarget = nullptr, // TODO_Zeqiang: wgpu offscr msaa
            .loadOp = loadOp,
            .storeOp = toWGPUStoreOp(colorConfigs[0].storeOp),
            .clearValue = WGPUColor{0.2, 0.2, 0.2, 1.0},
        };
        colorAttachments.emplace_back(color);
    } else {
        renderPassDesc.nextInChain = nullptr;
        renderPassDesc.label = "attachments";

        for (size_t i = 0; i < colorConfigs.size(); i++) {
            WGPURenderPassColorAttachment *colorAttchments = ccnew WGPURenderPassColorAttachment[colorConfigs.size()];
            auto loadOp = toWGPULoadOp(colorConfigs[i].loadOp);
            if (!renderingFullScreen) {
                needPartialClear = loadOp == WGPULoadOp_Clear;
                loadOp = _attachmentSet.find(textures[i]) == _attachmentSet.end() ? loadOp : WGPULoadOp_Load;
            }
            WGPURenderPassColorAttachment color = {
                .view = static_cast<CCWGPUTexture *>(textures[i])->gpuTextureObject()->selfView,
                .resolveTarget = nullptr, // TODO_Zeqiang: wgpu offscr msaa
                .loadOp = loadOp,
                .storeOp = toWGPUStoreOp(colorConfigs[i].storeOp),
                .clearValue = toWGPUColor(colors[i]),
            };
            colorAttachments.emplace_back(color);
            _attachmentSet.insert(textures[i]);
        }
    }

    ccstd::vector<WGPURenderPassDepthStencilAttachment> depthStencils;
    if(renderPass->getDepthStencilAttachment().format == Format::UNKNOWN) {
        renderPassDesc.depthStencilAttachment = nullptr;
    } else if(dsTexture) {
        WGPURenderPassDepthStencilAttachment depthStencil = {
            .view = static_cast<CCWGPUTexture *>(dsTexture)->gpuTextureObject()->selfView,
            .depthLoadOp = toWGPULoadOp(depthStencilConfig.depthLoadOp),
            .depthStoreOp = toWGPUStoreOp(depthStencilConfig.depthStoreOp),
            .depthClearValue = depth,
            .depthReadOnly = false,
            .stencilLoadOp = toWGPULoadOp(depthStencilConfig.stencilLoadOp),
            .stencilStoreOp = toWGPUStoreOp(depthStencilConfig.stencilStoreOp),
            .stencilClearValue = stencil,
            .stencilReadOnly = false,
        };
        depthStencils.emplace_back(depthStencil);
    } else {
        WGPURenderPassDepthStencilAttachment depthStencil = {
                .view = swapchain->gpuSwapchainObject()->swapchainDepthStencil->gpuTextureObject()->selfView,
                .depthLoadOp = toWGPULoadOp(depthStencilConfig.depthLoadOp),
                .depthStoreOp = toWGPUStoreOp(depthStencilConfig.depthStoreOp),
                .depthClearValue = depth,
                .depthReadOnly = false,
                .stencilLoadOp = toWGPULoadOp(depthStencilConfig.stencilLoadOp),
                .stencilStoreOp = toWGPUStoreOp(depthStencilConfig.stencilStoreOp),
                .stencilClearValue = stencil,
                .stencilReadOnly = false,
            };
            depthStencils.emplace_back(depthStencil);
    }

    setViewport({renderArea.x, renderArea.y, renderArea.width, renderArea.height, 0.0F, 1.0F});
    setScissor(renderArea);

    if (!renderingFullScreen && needPartialClear) {
        if (textures.size()) {
            for (size_t i = 0; i < textures.size(); ++i) {
                clearRect(this, textures[i], renderArea, colors[i]);
            }
        } else {
            auto *swapchainTex = swapchain->gpuSwapchainObject()->swapchainColor;
            clearRect(this, swapchainTex, renderArea, colors[0]);
        }
    }

    _gpuCommandBufferObj->renderPassBegan = true;

    renderPassDesc.colorAttachments = colorAttachments.data();
    renderPassDesc.colorAttachmentCount = colorAttachments.size();
    renderPassDesc.depthStencilAttachment = depthStencils.empty() ? nullptr : depthStencils.data();
    _gpuCommandBufferObj->wgpuRenderPassEncoder = wgpuCommandEncoderBeginRenderPass(_gpuCommandBufferObj->wgpuCommandEncoder, &renderPassDesc);
} // namespace gfx

void CCWGPUCommandBuffer::endRenderPass() {
    wgpuRenderPassEncoderEnd(_gpuCommandBufferObj->wgpuRenderPassEncoder);
    wgpuRenderPassEncoderRelease(_gpuCommandBufferObj->wgpuRenderPassEncoder);
    _gpuCommandBufferObj->wgpuRenderPassEncoder = wgpuDefaultHandle;

    for (auto &descObj : _gpuCommandBufferObj->stateCache.descriptorSets) {
        descObj.descriptorSet = nullptr;
        descObj.dynamicOffsetCount = 0;
        descObj.dynamicOffsets = nullptr;
        dynBufferStartIndex = 0;
    }
    _gpuCommandBufferObj->renderPassBegan = false;
}

void CCWGPUCommandBuffer::insertMarker(const MarkerInfo &marker) {
    std::ignore = marker;
}

void CCWGPUCommandBuffer::beginMarker(const MarkerInfo &marker) {
    std::ignore = marker;
}

void CCWGPUCommandBuffer::endMarker() {
}

void CCWGPUCommandBuffer::bindPipelineState(PipelineState *pso) {
    _gpuCommandBufferObj->stateCache.pipelineState = static_cast<CCWGPUPipelineState *>(pso);
}

void CCWGPUCommandBuffer::bindDescriptorSet(uint32_t set, DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) {
    uint32_t dynOffsetCount = dynamicOffsetCount;
    const uint32_t *dynOffsets = dynamicOffsets;
    auto &descriptorSets = _gpuCommandBufferObj->stateCache.descriptorSets;

    auto *ccDescriptorSet = static_cast<CCWGPUDescriptorSet *>(descriptorSet);
    if (ccDescriptorSet->dynamicOffsetCount() == 0) {
        dynOffsets = nullptr;
    } else {
        memcpy(dynamicOffsetBuffer + dynBufferStartIndex, dynamicOffsets, sizeof(uint32_t) * dynamicOffsetCount);
        dynOffsets = dynamicOffsetBuffer + dynBufferStartIndex;
        dynBufferStartIndex += dynamicOffsetCount;
    }

    CCWGPUDescriptorSetObject dsObj = {
        .descriptorSet = ccDescriptorSet,
        .dynamicOffsetCount = dynOffsetCount, // dynamicOffsetCount,
        .dynamicOffsets = dynOffsets,         // dynamicOffsets,
    };

    descriptorSets[set] = dsObj;
}

void CCWGPUCommandBuffer::bindInputAssembler(InputAssembler *ia) {
    _gpuCommandBufferObj->stateCache.inputAssembler = static_cast<CCWGPUInputAssembler *>(ia);
}

void CCWGPUCommandBuffer::setViewport(const Viewport &vp) {
    _gpuCommandBufferObj->stateCache.viewport = {vp.left, vp.top, vp.width, vp.height, vp.minDepth, vp.maxDepth};
}

void CCWGPUCommandBuffer::setScissor(const Rect &rect) {
    _gpuCommandBufferObj->stateCache.rect = rect;
}

void CCWGPUCommandBuffer::setLineWidth(float /*width*/) {
    printf("linewith not support in webGPU, ignored.");
}

void CCWGPUCommandBuffer::setDepthBias(float constant, float clamp, float slope) {
    _gpuCommandBufferObj->stateCache.depthBiasConstant = constant;
    _gpuCommandBufferObj->stateCache.depthBiasClamp = clamp;
    _gpuCommandBufferObj->stateCache.depthBiasSlope = slope;
}

void CCWGPUCommandBuffer::setBlendConstants(const Color &constants) {
    _gpuCommandBufferObj->stateCache.blendConstants = constants;
}

void CCWGPUCommandBuffer::setDepthBound(float minBounds, float maxBounds) {
    _gpuCommandBufferObj->stateCache.depthMinBound = minBounds;
    _gpuCommandBufferObj->stateCache.depthMaxBound = maxBounds;
}

void CCWGPUCommandBuffer::setStencilWriteMask(StencilFace face, uint32_t mask) {
    _gpuCommandBufferObj->stateCache.stencilMasks[face].writeMask = mask;
}

void CCWGPUCommandBuffer::setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask) {
    _gpuCommandBufferObj->stateCache.stencilMasks[face].compareRef = ref;
    _gpuCommandBufferObj->stateCache.stencilMasks[face].compareMask = mask;
}

void CCWGPUCommandBuffer::bindStates() {
    auto *pipelineState = static_cast<CCWGPUPipelineState *>(_gpuCommandBufferObj->stateCache.pipelineState);
    if (!pipelineState) {
        return;
    }
    ccstd::set<uint8_t> setInUse;

    auto *pipelineLayout = static_cast<CCWGPUPipelineLayout *>(pipelineState->layout());
    const auto &setLayouts = pipelineLayout->getSetLayouts();
    bool pipelineLayoutChanged = false;

    if (pipelineState->getBindPoint() == PipelineBindPoint::GRAPHICS) {
        // bindgroup & descriptorset
        const auto &descriptorSets = _gpuCommandBufferObj->stateCache.descriptorSets;
        for (size_t i = 0; i < setLayouts.size(); i++) {
            if (descriptorSets[i].descriptorSet) {
                // optional: prune descriptor set for redundant resources
                {
                    auto *ccShader = static_cast<CCWGPUShader *>(pipelineState->getShader());
                    const auto &bindingInshader = ccShader->gpuShaderObject()->bindings;
                    if (bindingInshader.size() > i) {
                        descriptorSets[i].descriptorSet->prune(bindingInshader[i]);
                    } else {
                        descriptorSets[i].descriptorSet->prune({});
                    }
                    descriptorSets[i].descriptorSet->forceUpdate();
                }

                descriptorSets[i].descriptorSet->prepare();

                if (descriptorSets[i].descriptorSet->dynamicOffsetCount() != descriptorSets[i].dynamicOffsetCount) {
                    std::string str = "force " + std::to_string(i);
                    wgpuRenderPassEncoderSetLabel(_gpuCommandBufferObj->wgpuRenderPassEncoder, str.c_str());
                    uint32_t *dynOffsets = dynamicOffsetBuffer;
                    const auto &dynamicOffsets = descriptorSets[i].descriptorSet->dynamicOffsets();
                    uint32_t givenOffsetIndex = 0;
                    for (size_t j = 0; j < descriptorSets[i].descriptorSet->dynamicOffsetCount(); ++j) {
                        if (j >= descriptorSets[i].dynamicOffsetCount) {
                            dynOffsets[j] = 0;
                        } else {
                            dynOffsets[j] = descriptorSets[i].dynamicOffsets[givenOffsetIndex++];
                        }
                    }
                    wgpuRenderPassEncoderSetBindGroup(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                      i,
                                                      descriptorSets[i].descriptorSet->gpuBindGroupObject()->bindgroup,
                                                      descriptorSets[i].descriptorSet->dynamicOffsetCount(),
                                                      dynOffsets);
                } else {
                    std::string str = "same " + std::to_string(i);
                    wgpuRenderPassEncoderSetLabel(_gpuCommandBufferObj->wgpuRenderPassEncoder, str.c_str());
                    wgpuRenderPassEncoderSetBindGroup(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                      i,
                                                      descriptorSets[i].descriptorSet->gpuBindGroupObject()->bindgroup,
                                                      descriptorSets[i].dynamicOffsetCount,
                                                      descriptorSets[i].dynamicOffsets);
                }
                setInUse.insert(i);
                pipelineLayoutChanged |= (setLayouts[i] != descriptorSets[i].descriptorSet->getLayout());
            } else {
                // missing
                std::string str = "missing " + std::to_string(i);
                wgpuRenderPassEncoderSetLabel(_gpuCommandBufferObj->wgpuRenderPassEncoder, str.c_str());
                wgpuRenderPassEncoderSetBindGroup(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                  i,
                                                  static_cast<WGPUBindGroup>(CCWGPUDescriptorSet::defaultBindGroup()),
                                                  0,
                                                  nullptr);
                pipelineLayoutChanged = true;
            }
        }

        if (pipelineLayoutChanged && setLayouts.size()) {
            ccstd::vector<DescriptorSet *> dsSets;
            for (size_t i = 0; i < setLayouts.size(); i++) {
                dsSets.push_back(descriptorSets[i].descriptorSet);
            }
            createPipelineLayoutFallback(dsSets, pipelineLayout, false);
        } else {
            pipelineLayout->prepare(setInUse);
        }

        pipelineState->check(_renderPass, 1);
        pipelineState->prepare(setInUse);

        const auto &pplLayout = static_cast<const CCWGPUPipelineLayout *>(pipelineState->ppl());

        // pipeline state
        wgpuRenderPassEncoderSetPipeline(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                         pipelineState->gpuPipelineStateObject()->wgpuRenderPipeline);

        // input assembler
        const auto *ia = _gpuCommandBufferObj->stateCache.inputAssembler;
        const auto &vertexBufferList = ia->getVertexBuffers();
        for (size_t i = 0; i < vertexBufferList.size(); i++) {
            const auto *vertexBuffer = static_cast<CCWGPUBuffer *>(vertexBufferList[i]);
            wgpuRenderPassEncoderSetVertexBuffer(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                 i,
                                                 vertexBuffer->gpuBufferObject()->wgpuBuffer,
                                                 vertexBuffer->getOffset(),
                                                 vertexBuffer->getSize());
        }
#if 1
        {
            // redundantVertexBufferMap
            const uint32_t maxAttrLen = pipelineState->gpuPipelineStateObject()->maxAttrLength;
            if (maxAttrLen != 0) {
                CCWGPUBuffer *buffer = nullptr;
                if (_gpuCommandBufferObj->redundantVertexBufferMap.find(maxAttrLen) != _gpuCommandBufferObj->redundantVertexBufferMap.end()) {
                    buffer = _gpuCommandBufferObj->redundantVertexBufferMap[maxAttrLen];
                } else {
                    BufferInfo info = {
                        .usage = BufferUsageBit::VERTEX,
                        .memUsage = MemoryUsageBit::DEVICE,
                        .size = maxAttrLen,
                        .flags = BufferFlagBit::NONE,
                    };
                    buffer = ccnew CCWGPUBuffer;
                    buffer->initialize(info);
                    _gpuCommandBufferObj->redundantVertexBufferMap.insert({maxAttrLen, buffer});
                    printf("new vert buffer\n");
                }
                wgpuRenderPassEncoderSetVertexBuffer(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                     vertexBufferList.size(),
                                                     buffer->gpuBufferObject()->wgpuBuffer,
                                                     0,
                                                     maxAttrLen);
            }
        }
#endif
        const auto *indexBuffer = static_cast<CCWGPUBuffer *>(ia->getIndexBuffer());
        if (indexBuffer) {
            CC_ASSERT(indexBuffer->getStride() >= 2);
            wgpuRenderPassEncoderSetIndexBuffer(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                indexBuffer->gpuBufferObject()->wgpuBuffer,
                                                indexBuffer->getStride() == 2 ? WGPUIndexFormat::WGPUIndexFormat_Uint16 : WGPUIndexFormat_Uint32,
                                                indexBuffer->getOffset(),
                                                indexBuffer->getSize());
        }

        WGPUColor blendColor = toWGPUColor(_gpuCommandBufferObj->stateCache.blendConstants);
        wgpuRenderPassEncoderSetBlendConstant(_gpuCommandBufferObj->wgpuRenderPassEncoder, &blendColor);

        CCWGPUFramebuffer *ccFrameBuffer = static_cast<CCWGPUFramebuffer *>(_frameBuffer);
        const TextureList &textures = ccFrameBuffer->getColorTextures();
        // minimum rendertarget w/h
        uint32_t rtWidth = std::numeric_limits<uint32_t>::max();
        uint32_t rtHeight = std::numeric_limits<uint32_t>::max();
        for (size_t i = 0; i < textures.size(); i++) {
            rtWidth = rtWidth > textures[i]->getWidth() ? textures[i]->getWidth() : rtWidth;
            rtHeight = rtHeight > textures[i]->getHeight() ? textures[i]->getHeight() : rtHeight;
        }

        const Viewport &vp = _gpuCommandBufferObj->stateCache.viewport;
        uint32_t left = vp.left > 0 ? vp.left : 0;
        uint32_t top = vp.top > 0 ? vp.top : 0;

        uint32_t width = vp.left > 0 ? vp.width : vp.width + vp.left;
        width = left + width > rtWidth ? rtWidth - left : width;

        uint32_t height = vp.top > 0 ? vp.height : vp.height + vp.top;
        height = top + height > rtHeight ? rtHeight - top : height;
        wgpuRenderPassEncoderSetViewport(_gpuCommandBufferObj->wgpuRenderPassEncoder, left, top, width, height, vp.minDepth, vp.maxDepth);

        const Rect &rect = _gpuCommandBufferObj->stateCache.rect;
        left = rect.x > 0 ? rect.x : 0;
        top = rect.y > 0 ? rect.y : 0;
        width = rect.x > 0 ? rect.width : rect.width + rect.x;
        width = left + width > rtWidth ? rtWidth - left : width;
        height = rect.y > 0 ? rect.height : rect.height + rect.y;
        height = top + height > rtHeight ? rtHeight - top : height;
        wgpuRenderPassEncoderSetScissorRect(_gpuCommandBufferObj->wgpuRenderPassEncoder, left, top, width, height);

        wgpuRenderPassEncoderSetStencilReference(_gpuCommandBufferObj->wgpuRenderPassEncoder, pipelineState->getDepthStencilState().stencilRefFront);
    } else if (pipelineState->getBindPoint() == PipelineBindPoint::COMPUTE) {
        auto *pipelineState = _gpuCommandBufferObj->stateCache.pipelineState;
        const auto &setLayouts = pipelineLayout->getSetLayouts();
        // bindgroup & descriptorset
        const auto &descriptorSets = _gpuCommandBufferObj->stateCache.descriptorSets;
        bool pipelineLayoutChanged = false;
        for (size_t i = 0; i < descriptorSets.size(); i++) {
            if (descriptorSets[i].descriptorSet) {
                // optional: prune descriptor set for redundant resources
                {
                    auto *ccShader = static_cast<CCWGPUShader *>(pipelineState->getShader());
                    const auto &bindingInshader = ccShader->gpuShaderObject()->bindings;
                    if (bindingInshader.size() > i) {
                        descriptorSets[i].descriptorSet->prune(bindingInshader[i]);
                    } else {
                        descriptorSets[i].descriptorSet->prune({});
                    }
                    descriptorSets[i].descriptorSet->forceUpdate();
                }

                descriptorSets[i].descriptorSet->prepare();
                wgpuComputePassEncoderSetBindGroup(_gpuCommandBufferObj->wgpuComputeEncoder,
                                                   i,
                                                   descriptorSets[i].descriptorSet->gpuBindGroupObject()->bindgroup,
                                                   descriptorSets[i].dynamicOffsetCount,
                                                   descriptorSets[i].dynamicOffsets);
                pipelineLayoutChanged |= (setLayouts[i] != descriptorSets[i].descriptorSet->getLayout());
                setInUse.insert(i);
            } else {
                pipelineLayoutChanged = true;
            }
        }

        if (pipelineLayoutChanged && setLayouts.size()) {
            ccstd::vector<DescriptorSet *> dsSets;
            for (size_t i = 0; i < setLayouts.size(); i++) {
                dsSets.push_back(descriptorSets[i].descriptorSet);
            }
            createPipelineLayoutFallback(dsSets, pipelineLayout, true);
        } else {
            pipelineLayout->prepare(setInUse);
        }

        pipelineState->prepare(setInUse);
        wgpuComputePassEncoderSetPipeline(_gpuCommandBufferObj->wgpuComputeEncoder,
                                          pipelineState->gpuPipelineStateObject()->wgpuComputePipeline);

    } else {
        printf("wrong pipeline state bind point.");
    }
}

void CCWGPUCommandBuffer::nextSubpass() {
    printf("@hana-alice to implement.");
}

void CCWGPUCommandBuffer::draw(const DrawInfo &info) {
    bindStates();

    auto *ia = static_cast<CCWGPUInputAssembler *>(_gpuCommandBufferObj->stateCache.inputAssembler);
    if (ia->getIndirectBuffer()) {
        auto *indirectBuffer = static_cast<CCWGPUBuffer *>(ia->getIndirectBuffer());
        bool multiDrawIndirectSupport = false;

        // indirectSupport not support, emscripten webgpu ver < 2021
        // https://github.com/gpuweb/gpuweb/issues/1354
        if (multiDrawIndirectSupport) {
            // todo
        } else {
            if (info.indexCount) {
                // indexedIndirect not supported, emsdk 2.0.26
                uint32_t drawInfoCount = indirectBuffer->getCount();
                for (size_t i = 0; i < drawInfoCount; i++) {
                    wgpuRenderPassEncoderDrawIndexedIndirect(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                             indirectBuffer->gpuBufferObject()->wgpuBuffer,
                                                             indirectBuffer->getOffset() + i * sizeof(CCWGPUDrawIndexedIndirectObject));
                }
            } else {
                uint32_t drawInfoCount = indirectBuffer->getCount();
                for (size_t i = 0; i < drawInfoCount; i++) {
                    wgpuRenderPassEncoderDrawIndirect(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                      indirectBuffer->gpuBufferObject()->wgpuBuffer,
                                                      indirectBuffer->getOffset() + i * sizeof(CCWGPUDrawIndirectObject));
                }
            }
        }
    } else {
        auto *indexBuffer = static_cast<CCWGPUBuffer *>(ia->getIndexBuffer());
        bool drawIndexed = indexBuffer && info.indexCount;
        uint32_t instanceCount = std::max(info.instanceCount, 1U);

        if (drawIndexed) {
            wgpuRenderPassEncoderDrawIndexed(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                             info.indexCount,
                                             instanceCount,
                                             info.firstIndex,
                                             info.vertexOffset,
                                             info.firstInstance);
        } else {
            wgpuRenderPassEncoderDraw(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                      info.vertexCount,
                                      instanceCount,
                                      info.firstVertex,
                                      info.firstInstance);
        }

        ++_numDrawCalls;
        _numInstances += info.instanceCount;
        if (_gpuCommandBufferObj->stateCache.pipelineState) {
            uint32_t indexCount = drawIndexed ? info.indexCount : info.vertexCount;
            switch (_gpuCommandBufferObj->stateCache.pipelineState->getPrimitive()) {
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

namespace {
void updatBuffer(CCWGPUCommandBuffer *cmdBuffer, CCWGPUBuffer *buffer, const void *data, uint32_t buffSize) {
    WGPUBufferDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = nullptr,
        .usage = WGPUBufferUsage_MapWrite | WGPUBufferUsage_CopySrc,
        .size = buffSize,
        .mappedAtCreation = true,
    };

    WGPUBuffer stagingBuffer = wgpuDeviceCreateBuffer(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
    auto *mappedBuffer = wgpuBufferGetMappedRange(stagingBuffer, 0, buffSize);
    memcpy(mappedBuffer, data, buffSize);
    wgpuBufferUnmap(static_cast<WGPUBuffer>(stagingBuffer));

    auto *bufferObj = buffer->gpuBufferObject();
    auto *commandBufferObj = cmdBuffer->gpuCommandBufferObject();
    size_t offset = buffer->isBufferView() ? buffer->getOffset() : 0;

    if (commandBufferObj->wgpuCommandEncoder) {
        wgpuCommandEncoderCopyBufferToBuffer(commandBufferObj->wgpuCommandEncoder, stagingBuffer, 0, bufferObj->wgpuBuffer, offset, buffSize);
    } else {
        WGPUCommandEncoder cmdEncoder = wgpuDeviceCreateCommandEncoder(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, nullptr);
        wgpuCommandEncoderCopyBufferToBuffer(cmdEncoder, stagingBuffer, 0, bufferObj->wgpuBuffer, offset, buffSize);
        WGPUCommandBuffer commandBuffer = wgpuCommandEncoderFinish(cmdEncoder, nullptr);
        wgpuQueueSubmit(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, &commandBuffer);
        wgpuCommandEncoderRelease(cmdEncoder);
        wgpuCommandBufferRelease(commandBuffer);
    }
    CCWGPUDevice::getInstance()->moveToTrash(stagingBuffer);
}
} // namespace

void CCWGPUCommandBuffer::updateIndirectBuffer(Buffer *buff, const DrawInfoList &drawInfos) {
    auto *ccBuffer = static_cast<CCWGPUBuffer *>(buff);
    size_t drawInfoCount = drawInfos.size();

    if (drawInfoCount > 0) {
        auto *ccBuffer = static_cast<CCWGPUBuffer *>(buff);
        void *data = nullptr;
        uint32_t buffSize = 0;
        if (drawInfos[0].indexCount) {
            auto &indexedIndirectObjs = ccBuffer->gpuBufferObject()->indexedIndirectObjs;
            for (size_t i = 0; i < drawInfoCount; i++) {
                indexedIndirectObjs[i].indexCount = drawInfos[i].indexCount;
                indexedIndirectObjs[i].instanceCount = drawInfos[i].instanceCount ? drawInfos[i].instanceCount : 1;
                indexedIndirectObjs[i].firstIndex = drawInfos[i].firstIndex;
                indexedIndirectObjs[i].baseVertex = drawInfos[i].vertexOffset;
                indexedIndirectObjs[i].firstInstance = 0; // check definition of indexedIndirectObj;
            }
            data = indexedIndirectObjs.data();
            buffSize = indexedIndirectObjs.size() * sizeof(CCWGPUDrawIndexedIndirectObject);
        } else {
            auto &indirectObjs = ccBuffer->gpuBufferObject()->indirectObjs;
            for (size_t i = 0; i < drawInfoCount; i++) {
                indirectObjs[i].vertexCount = drawInfos[i].vertexCount;
                indirectObjs[i].instanceCount = drawInfos[i].instanceCount ? drawInfos[i].instanceCount : 1;
                indirectObjs[i].firstIndex = drawInfos[i].firstIndex;
                indirectObjs[i].firstInstance = 0; // check definition of indirectObj;
            }
            data = indirectObjs.data();
            buffSize = indirectObjs.size() * sizeof(CCWGPUDrawIndirectObject);
        }
        updatBuffer(this, ccBuffer, data, buffSize);
    }
}

void CCWGPUCommandBuffer::updateBuffer(Buffer *buff, const void *data, uint32_t size) {
    uint32_t alignedSize = ceil(size / 4.0) * 4;
    size_t buffSize = alignedSize;
    auto *ccBuffer = static_cast<CCWGPUBuffer *>(buff);
    updatBuffer(this, ccBuffer, data, buffSize);
}
// WGPU_EXPORT void wgpuCommandEncoderCopyBufferToTexture(WGPUCommandEncoder commandEncoder, WGPUImageCopyBuffer const * source, WGPUImageCopyTexture const * destination, WGPUExtent3D const * copySize);
void CCWGPUCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint32_t count) {
    auto encoder = _gpuCommandBufferObj->wgpuCommandEncoder;
    if (!encoder) {
        WGPUCommandEncoder cmdEncoder = wgpuDeviceCreateCommandEncoder(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, nullptr);
    }

    Format dstFormat = texture->getFormat();
    auto wgpuDevice = CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice;
    auto *ccTexture = static_cast<CCWGPUTexture *>(texture);
    auto blockSize = formatAlignment(dstFormat);

    if (ccTexture->isTextureView()) {
        ccTexture = static_cast<CCWGPUTexture *>(ccTexture->getViewInfo().texture);
    }

    for (size_t i = 0; i < count; i++) {
        const auto &region = regions[i];
        auto bufferPixelWidth = region.buffStride > 0 ? region.buffStride : region.texExtent.width;
        auto bufferPixelHeight = region.buffTexHeight > 0 ? region.buffTexHeight : region.texExtent.height;
        auto bytesPerRow = formatSize(dstFormat, region.texExtent.width, 1, 1);
        auto bufferBytesPerRow = formatSize(dstFormat, bufferPixelWidth, 1, 1);
        auto bufferBytesPerImageSlice = formatSize(dstFormat, bufferPixelWidth, bufferPixelHeight, 1);
        auto bufferBytesPerImageLayer = formatSize(dstFormat, bufferPixelWidth, bufferPixelHeight, region.texExtent.depth);
        auto targetWidth = region.texExtent.width == 0 ? 0 : utils::alignTo(region.texExtent.width, blockSize.first);
        auto targetHeight = region.texExtent.height == 0 ? 0 : utils::alignTo(region.texExtent.height, blockSize.second);

        // it's buffer data layout
        WGPUTextureDataLayout texDataLayout = {
            .offset = 0, // we always create a non-offset staging buffer or give interface a non-offset buffer address
            .bytesPerRow = bufferBytesPerRow,
            .rowsPerImage = bufferPixelHeight,
        };

        bool compactInWidth = bufferPixelWidth == region.texExtent.width;
        for (size_t l = region.texSubres.baseArrayLayer; l < region.texSubres.layerCount + region.texSubres.baseArrayLayer; ++l) {
            for (size_t d = region.texOffset.z; d < region.texExtent.depth + region.texOffset.z; ++d) {
                if (compactInWidth) {
                    auto *srcData = buffers[i] + region.buffOffset + (l - region.texSubres.baseArrayLayer) * bufferBytesPerImageLayer + (d - region.texOffset.z) * bufferBytesPerImageSlice;
                    WGPUImageCopyTexture imageCopyTexture = {
                        .texture = ccTexture->gpuTextureObject()->wgpuTexture,
                        .mipLevel = region.texSubres.mipLevel,
                        .origin = WGPUOrigin3D{
                            static_cast<uint32_t>(region.texOffset.x),
                            static_cast<uint32_t>(region.texOffset.y),
                            static_cast<uint32_t>(d)},
                        .aspect = WGPUTextureAspect_All,
                    };

                    WGPUExtent3D extent = {
                        .width = targetWidth,
                        .height = targetHeight,
                        .depthOrArrayLayers = 1,
                    };

                    WGPUBufferDescriptor bufferDesc = {
                        .usage = WGPUBufferUsage_CopySrc,
                        .size = bufferBytesPerImageSlice,
                        .mappedAtCreation = true,
                    };

                    auto stagingBuffer = wgpuDeviceCreateBuffer(wgpuDevice, &bufferDesc);
                    auto *mappedBuffer = wgpuBufferGetMappedRange(stagingBuffer, 0, bufferBytesPerImageSlice);
                    memcpy(mappedBuffer, buffers[i], bufferBytesPerImageSlice);
                    wgpuBufferUnmap(static_cast<WGPUBuffer>(stagingBuffer));

                    WGPUImageCopyBuffer imageCopyBuffer = {
                        .layout = texDataLayout,
                        .buffer = stagingBuffer,
                    };
                    wgpuCommandEncoderCopyBufferToTexture(encoder, &imageCopyBuffer, &imageCopyTexture, &extent);
                    CCWGPUDevice::getInstance()->moveToTrash(stagingBuffer);
                } else {
                    for (size_t h = region.texOffset.y; h < region.texExtent.height + region.texOffset.y; h += blockSize.second) {
                        auto *srcData = buffers[i] + region.buffOffset + (l - region.texSubres.baseArrayLayer) * bufferBytesPerImageLayer + (d - region.texOffset.z) * bufferBytesPerImageSlice +
                                        (h - region.texOffset.y) / blockSize.second * bufferBytesPerRow;
                        WGPUImageCopyTexture imageCopyTexture = {
                            .texture = ccTexture->gpuTextureObject()->wgpuTexture,
                            .mipLevel = region.texSubres.mipLevel,
                            .origin = WGPUOrigin3D{
                                static_cast<uint32_t>(region.texOffset.x),
                                static_cast<uint32_t>(h),
                                static_cast<uint32_t>(d)},
                            .aspect = WGPUTextureAspect_All,
                        };

                        WGPUExtent3D extent = {
                            .width = targetWidth,
                            .height = blockSize.second,
                            .depthOrArrayLayers = 1,
                        };

                        WGPUBufferDescriptor bufferDesc = {
                            .usage = WGPUBufferUsage_CopySrc,
                            .size = bytesPerRow,
                            .mappedAtCreation = true,
                        };

                        auto stagingBuffer = wgpuDeviceCreateBuffer(wgpuDevice, &bufferDesc);
                        auto *mappedBuffer = wgpuBufferGetMappedRange(stagingBuffer, 0, bytesPerRow);
                        memcpy(mappedBuffer, buffers[i], bytesPerRow);
                        wgpuBufferUnmap(static_cast<WGPUBuffer>(stagingBuffer));

                        WGPUImageCopyBuffer imageCopyBuffer = {
                            .layout = texDataLayout,
                            .buffer = stagingBuffer,
                        };
                        wgpuCommandEncoderCopyBufferToTexture(encoder, &imageCopyBuffer, &imageCopyTexture, &extent);
                        CCWGPUDevice::getInstance()->moveToTrash(stagingBuffer);
                    }
                }
            }
        }
    }

    if (!_gpuCommandBufferObj->wgpuCommandEncoder) {
        WGPUCommandBuffer commandBuffer = wgpuCommandEncoderFinish(encoder, nullptr);
        wgpuQueueSubmit(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, &commandBuffer);
        wgpuCommandEncoderRelease(encoder);
        wgpuCommandBufferRelease(commandBuffer);
    }
}

void CCWGPUCommandBuffer::copyTexture(Texture *srcTexture, Texture *dstTexture, const TextureCopy *regions, uint32_t count) {
    // blitTexture(srcTexture, dstTexture, regions, count, Filter::POINT);
}

void CCWGPUCommandBuffer::blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint32_t count, Filter filter) {
    for (size_t i = 0; i < count; i++) {
        auto *srcTex = static_cast<CCWGPUTexture *>(srcTexture);
        auto *dstTex = static_cast<CCWGPUTexture *>(dstTexture);

        WGPUOrigin3D srcOrigin = {
            .x = static_cast<uint32_t>(regions[i].srcOffset.x),
            .y = static_cast<uint32_t>(regions[i].srcOffset.y),
            .z = static_cast<uint32_t>(regions[i].srcSubres.baseArrayLayer),
        };

        WGPUImageCopyTexture imageCopyTextureSrc = {
            .texture = srcTex->gpuTextureObject()->wgpuTexture,
            .mipLevel = regions[i].srcSubres.mipLevel,
            .origin = srcOrigin,
            .aspect = WGPUTextureAspect_All,
        };

        WGPUOrigin3D dstOrigin = {
            .x = static_cast<uint32_t>(regions[i].dstOffset.x),
            .y = static_cast<uint32_t>(regions[i].dstOffset.y),
            .z = static_cast<uint32_t>(regions[i].dstSubres.baseArrayLayer),
        };

        WGPUImageCopyTexture imageCopyTextureDst = {
            .texture = dstTex->gpuTextureObject()->wgpuTexture,
            .mipLevel = regions[i].dstSubres.mipLevel,
            .origin = dstOrigin,
            .aspect = WGPUTextureAspect_All,
        };

        WGPUExtent3D extent = {
            .width = regions[i].dstExtent.width,
            .height = regions[i].dstExtent.height,
            .depthOrArrayLayers = regions[i].dstExtent.depth,
        };

        wgpuCommandEncoderCopyTextureToTexture(_gpuCommandBufferObj->wgpuCommandEncoder, &imageCopyTextureSrc, &imageCopyTextureDst, &extent);
    }
}

void CCWGPUCommandBuffer::execute(CommandBuffer *const * /*cmdBuffs*/, uint32_t /*count*/) {
    printf(".....\n");
}

void CCWGPUCommandBuffer::dispatch(const DispatchInfo &info) {
    WGPUComputePassDescriptor cmoputeDesc = {};
    // if (!_gpuCommandBufferObj->wgpuComputeEncoder) {
    _gpuCommandBufferObj->wgpuComputeEncoder = wgpuCommandEncoderBeginComputePass(_gpuCommandBufferObj->wgpuCommandEncoder, &cmoputeDesc);
    // }

    bindStates();

    if (info.indirectBuffer) {
        auto *indirectBuffer = static_cast<CCWGPUBuffer *>(info.indirectBuffer);
        wgpuComputePassEncoderDispatchWorkgroupsIndirect(_gpuCommandBufferObj->wgpuComputeEncoder,
                                                         indirectBuffer->gpuBufferObject()->wgpuBuffer,
                                                         info.indirectOffset);

    } else {
        wgpuComputePassEncoderDispatchWorkgroups(_gpuCommandBufferObj->wgpuComputeEncoder,
                                                 info.groupCountX,
                                                 info.groupCountY,
                                                 info.groupCountZ);
    }
    wgpuComputePassEncoderEnd(_gpuCommandBufferObj->wgpuComputeEncoder);
    wgpuComputePassEncoderRelease(_gpuCommandBufferObj->wgpuComputeEncoder);
}

void CCWGPUCommandBuffer::pipelineBarrier(const GeneralBarrier *barrier, const BufferBarrier *const *bufferBarriers, const Buffer *const *buffers, uint32_t bufferBarrierCount, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint32_t textureBarrierCount) {
}

void CCWGPUCommandBuffer::reset() {
    _gpuCommandBufferObj->wgpuCommandBuffer = wgpuDefaultHandle;
    _gpuCommandBufferObj->wgpuCommandEncoder = wgpuDefaultHandle;
    _gpuCommandBufferObj->wgpuRenderPassEncoder = wgpuDefaultHandle;
    _gpuCommandBufferObj->wgpuComputeEncoder = wgpuDefaultHandle;
    _gpuCommandBufferObj->computeCmdBuffs.clear();

    CCWGPUStateCache stateCache = {};
}

} // namespace gfx
} // namespace cc
