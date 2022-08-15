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

#include "WGPUCommandBuffer.h"
#include <webgpu/webgpu.h>
#include <limits>
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
#include "WGPUSwapchain.h"
#include "WGPUTexture.h"
#include "WGPUUtils.h"
#include "base/std/container/vector.h"
namespace cc {
namespace gfx {

namespace {
uint32_t dynamicOffsetBuffer[256];
}

CCWGPUCommandBuffer::CCWGPUCommandBuffer() : wrapper<CommandBuffer>(val::object()) {
}

void CCWGPUCommandBuffer::doInit(const CommandBufferInfo &info) {
    _gpuCommandBufferObj = ccnew CCWGPUCommandBufferObject;
    _gpuCommandBufferObj->type = info.type;
    _gpuCommandBufferObj->queue = static_cast<CCWGPUQueue *>(info.queue);
}

void CCWGPUCommandBuffer::doDestroy() {
    if (_gpuCommandBufferObj) {
        if (!_gpuCommandBufferObj->redundantVertexBufferMap.empty()) {
            for (auto &pair : _gpuCommandBufferObj->redundantVertexBufferMap) {
                pair.second->destroy();
                delete pair.second;
            }
        }
        CC_SAFE_DELETE(_gpuCommandBufferObj);
    }
}

void CCWGPUCommandBuffer::begin(RenderPass * /*renderPass*/, uint32_t /*subpass*/, Framebuffer * /*frameBuffer*/) {
    //TODO_Zeqiang: subpass support
    //   printf("begin\n");
    _gpuCommandBufferObj->wgpuCommandEncoder = wgpuDeviceCreateCommandEncoder(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, nullptr);
}

void CCWGPUCommandBuffer::end() {
    //  printf("end\n");
    auto *pipelineState = _gpuCommandBufferObj->stateCache.pipelineState;
    if (pipelineState) {
        if (pipelineState->getBindPoint() == PipelineBindPoint::GRAPHICS) {
            auto *queue = _gpuCommandBufferObj->queue;
            auto wgpuCommandBuffer = wgpuCommandEncoderFinish(_gpuCommandBufferObj->wgpuCommandEncoder, nullptr);
            wgpuQueueSubmit(queue->gpuQueueObject()->wgpuQueue, 1, &wgpuCommandBuffer);
            wgpuCommandEncoderRelease(_gpuCommandBufferObj->wgpuCommandEncoder);
            _gpuCommandBufferObj->wgpuCommandEncoder = wgpuDefaultHandle;
        } else {
            wgpuComputePassEncoderEndPass(_gpuCommandBufferObj->wgpuComputeEncoder);
            wgpuComputePassEncoderRelease(_gpuCommandBufferObj->wgpuComputeEncoder);
            auto wgpuCommandBuffer = wgpuCommandEncoderFinish(_gpuCommandBufferObj->wgpuCommandEncoder, nullptr);
            wgpuQueueSubmit(static_cast<CCWGPUQueue *>(_queue)->gpuQueueObject()->wgpuQueue, 1, &wgpuCommandBuffer);
            wgpuCommandEncoderRelease(_gpuCommandBufferObj->wgpuCommandEncoder);
            _gpuCommandBufferObj->wgpuComputeEncoder = wgpuDefaultHandle;
            _gpuCommandBufferObj->wgpuCommandEncoder = wgpuDefaultHandle;
        }
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

    WGPURenderPassDescriptor &renderPassDesc = _gpuCommandBufferObj->renderPassDescriptor;
    ccstd::vector<WGPURenderPassColorAttachment> colorAttachments;
    if (colorConfigs.empty()) {
        renderPassDesc.nextInChain = nullptr;
        renderPassDesc.label = "swapchain";
        WGPURenderPassColorAttachment color = {
            .view = swapchain->gpuSwapchainObject()->swapchainColor->gpuTextureObject()->selfView,
            .resolveTarget = nullptr,       //TODO_Zeqiang: wgpu offscr msaa
            .loadOp = WGPULoadOp_Clear,     //toWGPULoadOp(colorConfigs[0].loadOp),
            .storeOp = WGPUStoreOp_Discard, //toWGPUStoreOp(colorConfigs[0].storeOp),
            .clearColor = WGPUColor{0.2, 0.2, 0.2, 1.0},
        };
        colorAttachments.emplace_back(color);
    } else {
        renderPassDesc.nextInChain = nullptr;
        renderPassDesc.label = "attachments";

        for (size_t i = 0; i < colorConfigs.size(); i++) {
            WGPURenderPassColorAttachment *colorAttchments = ccnew WGPURenderPassColorAttachment[colorConfigs.size()];
            WGPURenderPassColorAttachment color = {
                .view = static_cast<CCWGPUTexture *>(textures[i])->gpuTextureObject()->selfView,
                .resolveTarget = nullptr, //TODO_Zeqiang: wgpu offscr msaa
                .loadOp = toWGPULoadOp(colorConfigs[i].loadOp),
                .storeOp = toWGPUStoreOp(colorConfigs[i].storeOp),
                .clearColor = toWGPUColor(colors[i]),
            };
            colorAttachments.emplace_back(color);
        }
    }

    ccstd::vector<WGPURenderPassDepthStencilAttachment> depthStencils;
    if (dsTexture) {
        WGPURenderPassDepthStencilAttachment depthStencil = {
            .view = static_cast<CCWGPUTexture *>(dsTexture)->gpuTextureObject()->selfView,
            .depthLoadOp = WGPULoadOp_Clear, //toWGPULoadOp(depthStencilConfig.depthLoadOp),
            .depthStoreOp = toWGPUStoreOp(depthStencilConfig.depthStoreOp),
            .clearDepth = depth,
            .depthReadOnly = false,
            .stencilLoadOp = toWGPULoadOp(depthStencilConfig.stencilLoadOp),
            .stencilStoreOp = toWGPUStoreOp(depthStencilConfig.stencilStoreOp),
            .clearStencil = stencil,
            .stencilReadOnly = false,
        };
        depthStencils.emplace_back(depthStencil);
    } else {
        if (depthStencilConfig.format == Format::UNKNOWN) {
            renderPassDesc.depthStencilAttachment = nullptr;
        } else {
            WGPURenderPassDepthStencilAttachment depthStencil = {
                .view = swapchain->gpuSwapchainObject()->swapchainDepthStencil->gpuTextureObject()->selfView,
                .depthLoadOp = WGPULoadOp_Clear, //toWGPULoadOp(depthStencilConfig.depthLoadOp),
                .depthStoreOp = toWGPUStoreOp(depthStencilConfig.depthStoreOp),
                .clearDepth = depth,
                .depthReadOnly = false,
                .stencilLoadOp = toWGPULoadOp(depthStencilConfig.stencilLoadOp),
                .stencilStoreOp = toWGPUStoreOp(depthStencilConfig.stencilStoreOp),
                .clearStencil = stencil,
                .stencilReadOnly = false,
            };
            depthStencils.emplace_back(depthStencil);
        }
    }

    setViewport({renderArea.x, renderArea.y, renderArea.width, renderArea.height, 0.0F, 1.0F});
    setScissor(renderArea);

    _gpuCommandBufferObj->renderPassBegan = true;

    renderPassDesc.colorAttachments = colorAttachments.data();
    renderPassDesc.colorAttachmentCount = colorAttachments.size();
    renderPassDesc.depthStencilAttachment = depthStencils.empty() ? nullptr : depthStencils.data();
    _gpuCommandBufferObj->wgpuRenderPassEncoder = wgpuCommandEncoderBeginRenderPass(_gpuCommandBufferObj->wgpuCommandEncoder, &renderPassDesc);
} // namespace gfx

void CCWGPUCommandBuffer::endRenderPass() {
    //  printf("endr\n");
    wgpuRenderPassEncoderEndPass(_gpuCommandBufferObj->wgpuRenderPassEncoder);
    wgpuRenderPassEncoderRelease(_gpuCommandBufferObj->wgpuRenderPassEncoder);
    _gpuCommandBufferObj->wgpuRenderPassEncoder = wgpuDefaultHandle;

    _gpuCommandBufferObj->stateCache.descriptorSets.clear();
    _gpuCommandBufferObj->renderPassBegan = false;
}

void CCWGPUCommandBuffer::bindPipelineState(PipelineState *pso) {
    _gpuCommandBufferObj->stateCache.pipelineState = static_cast<CCWGPUPipelineState *>(pso);
}

void CCWGPUCommandBuffer::bindDescriptorSet(uint32_t set, DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) {
    uint32_t dynOffsetCount = dynamicOffsetCount;
    const uint32_t *dynOffsets = dynamicOffsets;
    auto &descriptorSets = _gpuCommandBufferObj->stateCache.descriptorSets;
    auto iter = std::find_if(descriptorSets.begin(), descriptorSets.end(), [set](const CCWGPUDescriptorSetObject &descriptorSet) {
        return descriptorSet.index == set;
    });

    auto *ccDescriptorSet = static_cast<CCWGPUDescriptorSet *>(descriptorSet);
    if (ccDescriptorSet->dynamicOffsetCount() == 0) {
        dynOffsetCount = 0;
        dynOffsets = nullptr;
    }

    CCWGPUDescriptorSetObject dsObj = {
        .index = set,
        .descriptorSet = ccDescriptorSet,
        .dynamicOffsetCount = dynOffsetCount, //dynamicOffsetCount,
        .dynamicOffsets = dynOffsets,         //dynamicOffsets,
    };

    if (iter != descriptorSets.end()) {
        (*iter) = dsObj;
    } else {
        descriptorSets.push_back(dsObj);
    }
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
    for (const auto &descriptorSet : _gpuCommandBufferObj->stateCache.descriptorSets) {
        setInUse.insert(descriptorSet.index);
    }

    // printf("ppl binding %p\n", pipelineState);

    // ccstd::vector<void*> wgpuLayouts;

    if (pipelineState->getBindPoint() == PipelineBindPoint::GRAPHICS) {
        //bindgroup & descriptorset
        const auto &descriptorSets = _gpuCommandBufferObj->stateCache.descriptorSets;
        for (size_t i = 0; i < descriptorSets.size(); i++) {
            descriptorSets[i].descriptorSet->prepare();

            if (descriptorSets[i].descriptorSet->dynamicOffsetCount() != descriptorSets[i].dynamicOffsetCount) {
                uint32_t *dynOffsets = dynamicOffsetBuffer;
                const Pairs &dynamicOffsets = descriptorSets[i].descriptorSet->dynamicOffsets();
                uint32_t givenOffsetIndex = 0;
                for (size_t j = 0; j < descriptorSets[i].descriptorSet->dynamicOffsetCount(); ++j) {
                    if (j >= descriptorSets[i].dynamicOffsetCount || dynamicOffsets[j].second == 0) {
                        dynOffsets[j] = 0;
                    } else {
                        dynOffsets[j] = descriptorSets[i].dynamicOffsets[givenOffsetIndex++];
                    }
                }
                // printf("set %d %p %p\n", descriptorSets[i].index, descriptorSets[i].descriptorSet->gpuBindGroupObject()->bindgroup,
                //     descriptorSets[i].descriptorSet->bgl());
                // wgpuLayouts.push_back(descriptorSets[i].descriptorSet->bgl());
                wgpuRenderPassEncoderSetBindGroup(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                  descriptorSets[i].index,
                                                  descriptorSets[i].descriptorSet->gpuBindGroupObject()->bindgroup,
                                                  descriptorSets[i].descriptorSet->dynamicOffsetCount(),
                                                  dynOffsets);

            } else {
                wgpuRenderPassEncoderSetBindGroup(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                  descriptorSets[i].index,
                                                  descriptorSets[i].descriptorSet->gpuBindGroupObject()->bindgroup,
                                                  descriptorSets[i].dynamicOffsetCount,
                                                  descriptorSets[i].dynamicOffsets);
                //   printf("set %d %p %p\n", i, descriptorSets[i].descriptorSet->gpuBindGroupObject()->bindgroup,
                //   descriptorSets[i].descriptorSet->bgl());
                //   wgpuLayouts.push_back(descriptorSets[i].descriptorSet->bgl());
            }
        }

        // missing
        if (setInUse.size() != pipelineState->getPipelineLayout()->getSetLayouts().size()) {
            const auto &setLayouts = pipelineState->getPipelineLayout()->getSetLayouts();
            for (size_t i = 0; i < setLayouts.size(); i++) {
                if (setInUse.find(i) == setInUse.end()) {
                    wgpuRenderPassEncoderSetBindGroup(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                      i,
                                                      static_cast<WGPUBindGroup>(CCWGPUDescriptorSet::defaultBindGroup()),
                                                      0,
                                                      nullptr);
                    //   printf("default %d %p\n", i, CCWGPUDescriptorSetLayout::defaultBindGroupLayout());
                    //   wgpuLayouts.push_back(CCWGPUDescriptorSetLayout::defaultBindGroupLayout());
                }
            }
        }
        pipelineState->check(_renderPass);
        pipelineState->prepare(setInUse);

        // printf("ppshn: %s\n", static_cast<CCWGPUShader*>(pipelineState->getShader())->gpuShaderObject()->name.c_str());

        const auto &pplLayout = static_cast<const CCWGPUPipelineLayout *>(pipelineState->ppl());
        // for(size_t i = 0; i < pplLayout->layouts().size(); ++i) {
        //     // printf("bgl in ppl: %p\n", pplLayout->layouts()[i]);
        //     if(pplLayout->layouts()[i] != wgpuLayouts[i]) {
        //         printf("oooooooooooops %d %p %p\n", i, pplLayout->layouts()[i], wgpuLayouts[i]);
        //         static_cast<CCWGPUDescriptorSetLayout*>(descriptorSets[i].descriptorSet->getLayout())->print();
        //         static_cast<CCWGPUDescriptorSetLayout*>(pplLayout->getSetLayouts()[i])->print();
        //     }
        // }
        // if(pipelineState->ppl() != pipelineState->getPipelineLayout()){
        //     printf("oooooooooooooooooooooooooooooooops\n");
        // }
        //pipeline state
        wgpuRenderPassEncoderSetPipeline(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                         pipelineState->gpuPipelineStateObject()->wgpuRenderPipeline);

        //input assembler
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

        {
            //redundantVertexBufferMap
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
                }
                wgpuRenderPassEncoderSetVertexBuffer(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                     vertexBufferList.size(),
                                                     buffer->gpuBufferObject()->wgpuBuffer,
                                                     0,
                                                     maxAttrLen);
            }
        }

        const auto *indexBuffer = static_cast<CCWGPUBuffer *>(ia->getIndexBuffer());
        if (indexBuffer) {
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
            // printf("w, h %d %d\n", textures[i]->getWidth(), textures[i]->getHeight());
        }

        // printf("minrt %u, %u\n", rtWidth, rtHeight);

        const Viewport &vp = _gpuCommandBufferObj->stateCache.viewport;
        uint32_t left = vp.left > 0 ? vp.left : 0;
        uint32_t top = vp.top > 0 ? vp.top : 0;

        uint32_t width = vp.left > 0 ? vp.width : vp.width + vp.left;
        width = left + width > rtWidth ? rtWidth - left : width;

        uint32_t height = vp.top > 0 ? vp.height : vp.height + vp.top;
        height = top + height > rtHeight ? rtHeight - top : height;
        // printf("vp %u, %u, %u, %u\n", left, top, width, height);
        wgpuRenderPassEncoderSetViewport(_gpuCommandBufferObj->wgpuRenderPassEncoder, left, top, width, height, vp.minDepth, vp.maxDepth);

        const Rect &rect = _gpuCommandBufferObj->stateCache.rect;
        left = rect.x > 0 ? rect.x : 0;
        top = rect.y > 0 ? rect.y : 0;
        width = rect.x > 0 ? rect.width : rect.width + rect.x;
        width = left + width > rtWidth ? rtWidth - left : width;
        height = rect.y > 0 ? rect.height : rect.height + rect.y;
        height = top + height > rtHeight ? rtHeight - top : height;
        // printf("sc %u, %u, %u, %u\n", left, top, width, height);
        wgpuRenderPassEncoderSetScissorRect(_gpuCommandBufferObj->wgpuRenderPassEncoder, left, top, width, height);

        wgpuRenderPassEncoderSetStencilReference(_gpuCommandBufferObj->wgpuRenderPassEncoder, pipelineState->getDepthStencilState().stencilRefFront);
    } else if (pipelineState->getBindPoint() == PipelineBindPoint::COMPUTE) {
        auto *pipelineState = _gpuCommandBufferObj->stateCache.pipelineState;

        //bindgroup & descriptorset
        const auto &descriptorSets = _gpuCommandBufferObj->stateCache.descriptorSets;
        for (size_t i = 0; i < descriptorSets.size(); i++) {
            if (descriptorSets[i].descriptorSet->gpuBindGroupObject()->bindgroup) {
                wgpuComputePassEncoderSetBindGroup(_gpuCommandBufferObj->wgpuComputeEncoder,
                                                   descriptorSets[i].index,
                                                   descriptorSets[i].descriptorSet->gpuBindGroupObject()->bindgroup,
                                                   descriptorSets[i].dynamicOffsetCount,
                                                   descriptorSets[i].dynamicOffsets);
            }
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
                //indexedIndirect not supported, emsdk 2.0.26
                uint32_t drawInfoCount = indirectBuffer->getCount();
                // for (size_t i = 0; i < drawInfoCount; i++) {
                //     wgpuRenderPassEncoderDrawIndexedIndirect(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                //                                              indirectBuffer->gpuBufferObject()->wgpuBuffer,
                //                                              indirectBuffer->getOffset() + i * sizeof(CCWGPUDrawIndexedIndirectObject));
                // }

                wgpuRenderPassEncoderDrawIndexed(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                                 info.indexCount,
                                                 info.instanceCount > 1 ? info.instanceCount : 1,
                                                 info.firstIndex,
                                                 info.vertexOffset,
                                                 info.firstInstance);
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

        if (drawIndexed) {
            wgpuRenderPassEncoderDrawIndexed(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                             info.indexCount,
                                             info.instanceCount > 1 ? info.instanceCount : 1,
                                             info.firstIndex,
                                             info.vertexOffset,
                                             info.firstInstance);
        } else {
            wgpuRenderPassEncoderDraw(_gpuCommandBufferObj->wgpuRenderPassEncoder,
                                      info.vertexCount,
                                      info.instanceCount > 1 ? info.instanceCount : 1,
                                      info.firstVertex,
                                      info.firstInstance);
        }
    }
}

void CCWGPUCommandBuffer::updateBuffer(Buffer *buff, const void *data, uint32_t size) {
    uint32_t alignedSize = ceil(size / 4.0) * 4;
    size_t buffSize = alignedSize;

    WGPUBufferDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = nullptr,
        .usage = WGPUBufferUsage_MapWrite | WGPUBufferUsage_CopySrc,
        .size = alignedSize,
        .mappedAtCreation = true,
    };
    WGPUBuffer stagingBuffer = wgpuDeviceCreateBuffer(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
    auto *mappedBuffer = wgpuBufferGetMappedRange(stagingBuffer, 0, alignedSize);
    memcpy(mappedBuffer, data, size);

    wgpuBufferUnmap(static_cast<WGPUBuffer>(stagingBuffer));

    auto *ccBuffer = static_cast<CCWGPUBuffer *>(buff);
    size_t offset = ccBuffer->getOffset();

    CCWGPUBufferObject *bufferObj = ccBuffer->gpuBufferObject();

    if (_gpuCommandBufferObj->wgpuCommandEncoder) {
        wgpuCommandEncoderCopyBufferToBuffer(_gpuCommandBufferObj->wgpuCommandEncoder, stagingBuffer, 0, bufferObj->wgpuBuffer, offset, alignedSize);
    } else {
        WGPUCommandEncoder cmdEncoder = wgpuDeviceCreateCommandEncoder(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, nullptr);
        wgpuCommandEncoderCopyBufferToBuffer(cmdEncoder, stagingBuffer, 0, bufferObj->wgpuBuffer, offset, alignedSize);
        WGPUCommandBuffer commandBuffer = wgpuCommandEncoderFinish(cmdEncoder, nullptr);
        wgpuQueueSubmit(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, &commandBuffer);
        wgpuBufferRelease(stagingBuffer);
        wgpuCommandEncoderRelease(cmdEncoder);
        wgpuCommandBufferRelease(commandBuffer);
    }
}

void CCWGPUCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint32_t count) {
    for (size_t i = 0; i < count; i++) {
        WGPUOrigin3D origin = {
            .x = static_cast<uint32_t>(regions[i].texOffset.x),
            .y = static_cast<uint32_t>(regions[i].texOffset.y),
            .z = static_cast<uint32_t>(regions[i].texOffset.z),
        };

        WGPUImageCopyTexture imageCopyTexture = {
            .texture = static_cast<CCWGPUTexture *>(texture)->gpuTextureObject()->wgpuTexture,
            .mipLevel = 0,
            .origin = origin,
            .aspect = WGPUTextureAspect_All,
        };

        auto *ccTex = static_cast<CCWGPUTexture *>(texture);
        uint32_t width = regions[i].texExtent.width;
        uint32_t height = regions[i].texExtent.height;
        uint32_t depth = regions[i].texExtent.depth;
        uint32_t bytesPerRow = GFX_FORMAT_INFOS[static_cast<uint32_t>(ccTex->getFormat())].size * width;
        uint32_t dataSize = bytesPerRow * height * depth;

        WGPUTextureDataLayout texLayout = {
            .offset = 0,
            .bytesPerRow = bytesPerRow,
            .rowsPerImage = height,
        };

        WGPUExtent3D extent = {
            .width = width,
            .height = height,
            .depthOrArrayLayers = depth,
        };

        wgpuQueueWriteTexture(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, &imageCopyTexture, buffers[i], dataSize, &texLayout, &extent);
    }
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
    printf(".....");
}

void CCWGPUCommandBuffer::dispatch(const DispatchInfo &info) {
    WGPUComputePassDescriptor cmoputeDesc = {};
    if (!_gpuCommandBufferObj->wgpuComputeEncoder) {
        _gpuCommandBufferObj->wgpuComputeEncoder = wgpuCommandEncoderBeginComputePass(_gpuCommandBufferObj->wgpuCommandEncoder, &cmoputeDesc);
    }

    if (info.indirectBuffer) {
        auto *indirectBuffer = static_cast<CCWGPUBuffer *>(info.indirectBuffer);
        wgpuComputePassEncoderDispatchIndirect(_gpuCommandBufferObj->wgpuComputeEncoder,
                                               indirectBuffer->gpuBufferObject()->wgpuBuffer,
                                               info.indirectOffset);

    } else {
        wgpuComputePassEncoderDispatch(_gpuCommandBufferObj->wgpuComputeEncoder,
                                       info.groupCountX,
                                       info.groupCountY,
                                       info.groupCountZ);
    }
}

void CCWGPUCommandBuffer::pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint32_t textureBarrierCount) {
}

void CCWGPUCommandBuffer::updateIndirectBuffer(Buffer *buffer, const DrawInfoList &list) {
    buffer->update(list.data(), 0); // indirectBuffer calc size inside.
}

} // namespace gfx
} // namespace cc
