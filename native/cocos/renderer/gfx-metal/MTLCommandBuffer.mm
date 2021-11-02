/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#import "MTLStd.h"

#import <MetalPerformanceShaders/MetalPerformanceShaders.h>
#import <QuartzCore/CAMetalLayer.h>
#import "MTLBuffer.h"
#import "MTLCommandBuffer.h"
#import "MTLDescriptorSet.h"
#import "MTLDevice.h"
#import "MTLFramebuffer.h"
#import "MTLInputAssembler.h"
#import "MTLPipelineState.h"
#import "MTLQueryPool.h"
#import "MTLQueue.h"
#import "MTLRenderPass.h"
#import "MTLSampler.h"
#import "MTLSemaphore.h"
#import "MTLSwapchain.h"
#import "MTLTexture.h"
#import "TargetConditionals.h"

namespace cc {
namespace gfx {
CCMTLCommandBuffer::CCMTLCommandBuffer()
: CommandBuffer(),
  _mtlDevice(CCMTLDevice::getInstance()) {
    _typedID               = generateObjectID<decltype(this)>();
    _mtlCommandQueue       = id<MTLCommandQueue>(_mtlDevice->getMTLCommandQueue());
    _indirectDrawSuppotred = _mtlDevice->isIndirectDrawSupported();

    const auto setCount = _mtlDevice->bindingMappingInfo().bufferOffsets.size();
    _GPUDescriptorSets.resize(setCount);
    _dynamicOffsets.resize(setCount);
    _indirectDrawSuppotred = _mtlDevice->isIndirectDrawSupported();
}

CCMTLCommandBuffer::~CCMTLCommandBuffer() {
    destroy();
}

void CCMTLCommandBuffer::doInit(const CommandBufferInfo &info) {
    _gpuCommandBufferObj = CC_NEW(CCMTLGPUCommandBufferObject);
}

void CCMTLCommandBuffer::doDestroy() {
    if(_texCopySemaphore) {
        CC_DELETE(_texCopySemaphore);
        _texCopySemaphore = nullptr;
    }
    
    _GPUDescriptorSets.clear();
    _dynamicOffsets.clear();
    _firstDirtyDescriptorSet = UINT_MAX;
    _indirectDrawSuppotred   = false;
    _commandBufferBegan      = false;
    _mtlDevice               = nullptr;
    _mtlCommandQueue         = nil;
    _parallelEncoder         = nil;

    CC_SAFE_DELETE(_gpuCommandBufferObj);
}

bool CCMTLCommandBuffer::isRenderingEntireDrawable(const Rect &rect, const CCMTLRenderPass *renderPass) {
    const int num = renderPass->getColorRenderTargetNums();
    if (num == 0) {
        return true;
    }
    const auto &renderTargetSize = renderPass->getRenderTargetSizes()[0];
    return rect.x == 0 && rect.y == 0 && rect.width == renderTargetSize.x && rect.height == renderTargetSize.y;
}

void CCMTLCommandBuffer::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    if (_commandBufferBegan) {
        return;
    }

    if (!_gpuCommandBufferObj->isSecondary) {
        auto *mtlQueue = static_cast<CCMTLQueue *>(_queue)->gpuQueueObj()->mtlCommandQueue;
        // Only primary command buffer should request command buffer explicitly
        _gpuCommandBufferObj->mtlCommandBuffer = [[mtlQueue commandBuffer] retain];
    }

    _numTriangles = 0;
    _numDrawCalls = 0;
    _numInstances = 0;

    _GPUDescriptorSets.assign(_GPUDescriptorSets.size(), nullptr);
    for (auto &dynamicOffset : _dynamicOffsets) {
        dynamicOffset.clear();
    }
    _firstDirtyDescriptorSet = UINT_MAX;
    _commandBufferBegan      = true;
}

void CCMTLCommandBuffer::end() {
    if (!_commandBufferBegan) {
        return;
    }

    _commandBufferBegan = false;

    if (_gpuCommandBufferObj->isSecondary) {
        // Secondary command buffer should end encoding here
        _renderEncoder.endEncoding();
    }
    
    [_gpuCommandBufferObj->mtlCommandBuffer enqueue];
}

void CCMTLCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, uint stencil, CommandBuffer *const *secondaryCBs, uint secondaryCBCount) {
    // Sub CommandBuffer shouldn't call begin render pass
    if (_gpuCommandBufferObj->isSecondary) {
        return;
    }
    _gpuCommandBufferObj->renderPass = static_cast<CCMTLRenderPass *>(renderPass);
    _gpuCommandBufferObj->fbo        = static_cast<CCMTLFramebuffer *>(fbo);

    auto *                     ccMtlRenderPass  = static_cast<CCMTLRenderPass *>(renderPass);
    auto                       isOffscreen      = _gpuCommandBufferObj->fbo->isOffscreen();
    const SubpassInfoList &    subpasses        = renderPass->getSubpasses();
    const ColorAttachmentList &colorAttachments = renderPass->getColorAttachments();

    MTLRenderPassDescriptor *mtlRenderPassDescriptor = static_cast<CCMTLRenderPass *>(renderPass)->getMTLRenderPassDescriptor();
    const TextureList &      colorTextures           = fbo->getColorTextures();
    Texture *                dsTexture               = fbo->getDepthStencilTexture();
    auto *                   swapchain               = static_cast<CCMTLSwapchain *>(_gpuCommandBufferObj->fbo->swapChain());

    if (subpasses.empty()) {
        if (dsTexture) {
            auto *ccMtlTexture = static_cast<CCMTLTexture *>(dsTexture);
            ccMtlRenderPass->setDepthStencilAttachment(ccMtlTexture, 0);
        } else {
            const DepthStencilAttachment &dsa = renderPass->getDepthStencilAttachment();
            if (dsa.format != Format::UNKNOWN) {
                ccMtlRenderPass->setDepthStencilAttachment(swapchain->depthStencilTexture(), 0);
            }
        }

        if (colorAttachments.empty()) {
            ccMtlRenderPass->setColorAttachment(0, swapchain->colorTexture(), 0);
        } else {
            for (size_t i = 0; i < colorAttachments.size(); ++i) {
                auto *ccMtlTexture = static_cast<CCMTLTexture *>(colorTextures[i]);
                ccMtlRenderPass->setColorAttachment(i, ccMtlTexture, 0);
                mtlRenderPassDescriptor.colorAttachments[i].clearColor  = mu::toMTLClearColor(colors[i]);
                mtlRenderPassDescriptor.colorAttachments[i].loadAction  = mu::toMTLLoadAction(colorAttachments[i].loadOp);
                mtlRenderPassDescriptor.colorAttachments[i].storeAction = mu::isFramebufferFetchSupported() ? mu::toMTLStoreAction(colorAttachments[i].storeOp) : MTLStoreActionStore;
            }
        }
    } else {
        // TODO: cache state.
        vector<bool> visited(colorAttachments.size(), false);
        for (size_t i = 0; i < subpasses.size(); ++i) {
            for (size_t j = 0; j < subpasses[i].inputs.size(); ++j) {
                uint32_t input = subpasses[i].inputs[j];
                if (visited[input])
                    continue;
                auto *ccMtlTexture = static_cast<CCMTLTexture *>(colorTextures[input]);
                ccMtlRenderPass->setColorAttachment(input, ccMtlTexture, 0);
                mtlRenderPassDescriptor.colorAttachments[input].clearColor  = mu::toMTLClearColor(colors[input]);
                mtlRenderPassDescriptor.colorAttachments[input].loadAction  = mu::toMTLLoadAction(colorAttachments[input].loadOp);
                mtlRenderPassDescriptor.colorAttachments[input].storeAction = mu::isFramebufferFetchSupported() ? mu::toMTLStoreAction(colorAttachments[input].storeOp) : MTLStoreActionStore;
                visited[input]                                              = true;
            }
            for (size_t j = 0; j < subpasses[i].colors.size(); ++j) {
                uint32_t color = subpasses[i].colors[j];
                if (visited[color])
                    continue;
                auto *ccMtlTexture = static_cast<CCMTLTexture *>(colorTextures[color]);
                ccMtlRenderPass->setColorAttachment(color, ccMtlTexture, 0);
                mtlRenderPassDescriptor.colorAttachments[color].clearColor  = mu::toMTLClearColor(colors[color]);
                mtlRenderPassDescriptor.colorAttachments[color].loadAction  = mu::toMTLLoadAction(colorAttachments[color].loadOp);
                mtlRenderPassDescriptor.colorAttachments[color].storeAction = mu::isFramebufferFetchSupported() ? mu::toMTLStoreAction(colorAttachments[color].storeOp) : MTLStoreActionStore;
                visited[color]                                              = true;
                if (subpasses[i].resolves.size() > j) {
                    uint32_t resolve    = subpasses[i].resolves[j];
                    auto *   resolveTex = static_cast<CCMTLTexture *>(colorTextures[resolve]);
                    if (resolveTex->textureInfo().samples == SampleCount::ONE)
                        continue;
                    mtlRenderPassDescriptor.colorAttachments[color].resolveTexture    = resolveTex->getMTLTexture();
                    mtlRenderPassDescriptor.colorAttachments[color].resolveLevel      = 0;
                    mtlRenderPassDescriptor.colorAttachments[color].resolveSlice      = 0;
                    mtlRenderPassDescriptor.colorAttachments[color].resolveDepthPlane = 0;
                    mtlRenderPassDescriptor.colorAttachments[color].storeAction       = MTLStoreActionMultisampleResolve;
                }
            }
            for (size_t j = 0; j < subpasses[i].preserves.size(); ++j) {
                uint32_t preserves                                              = subpasses[i].preserves[j];
                mtlRenderPassDescriptor.colorAttachments[preserves].storeAction = MTLStoreActionStoreAndMultisampleResolve;
            }
        }
        updateDepthStencilState(ccMtlRenderPass->getCurrentSubpassIndex(), mtlRenderPassDescriptor);
    }

    mtlRenderPassDescriptor.depthAttachment.clearDepth     = depth;
    mtlRenderPassDescriptor.stencilAttachment.clearStencil = stencil;

    auto *queryPool                                = static_cast<CCMTLQueryPool *>(_mtlDevice->getQueryPool());
    mtlRenderPassDescriptor.visibilityResultBuffer = _mtlDevice->getCapabilities().supportQuery ? queryPool->gpuQueryPool()->visibilityResultBuffer : nil;

    id<MTLCommandBuffer> mtlCommandBuffer = _gpuCommandBufferObj->mtlCommandBuffer;
    if (!isRenderingEntireDrawable(renderArea, static_cast<CCMTLRenderPass *>(renderPass))) {
        //Metal doesn't apply the viewports and scissors to renderpass load-action clearing.
        mu::clearRenderArea(_mtlDevice, mtlCommandBuffer, renderPass, renderArea, colors, depth, stencil);
    }

    if (secondaryCBCount > 0) {
        _parallelEncoder = [[mtlCommandBuffer parallelRenderCommandEncoderWithDescriptor:mtlRenderPassDescriptor] retain];
        // Create command encoders from parallel encoder and assign to command buffers
        for (uint i = 0u; i < secondaryCBCount; ++i) {
            CCMTLCommandBuffer *cmdBuff = (CCMTLCommandBuffer *)secondaryCBs[i];
            cmdBuff->_renderEncoder.initialize(_parallelEncoder);
            cmdBuff->_gpuCommandBufferObj->mtlCommandBuffer = mtlCommandBuffer;
            cmdBuff->_gpuCommandBufferObj->isSecondary      = true;
        }
    } else {
        _renderEncoder.initialize(mtlCommandBuffer, mtlRenderPassDescriptor);
        //[_renderEncoder.getMTLEncoder() memoryBarrierWithScope:MTLBarrierScopeTextures afterStages:MTLRenderStageFragment beforeStages:MTLRenderStageFragment];
    }

    Rect scissorArea = renderArea;
#if defined(CC_DEBUG) && (CC_DEBUG > 0)
    const Vec2 renderTargetSize = ccMtlRenderPass->getRenderTargetSizes()[0];
    scissorArea.width           = MIN(scissorArea.width, renderTargetSize.x - scissorArea.x);
    scissorArea.height          = MIN(scissorArea.height, renderTargetSize.y - scissorArea.y);
#endif
    _renderEncoder.setViewport(scissorArea);
    _renderEncoder.setScissor(scissorArea);
}

void CCMTLCommandBuffer::endRenderPass() {
    if (_parallelEncoder) {
        [_parallelEncoder endEncoding];
        [_parallelEncoder release];
        _parallelEncoder = nil;
    } else {
        _renderEncoder.endEncoding();
    }
    _gpuCommandBufferObj->renderPass->reset();
}

void CCMTLCommandBuffer::reset() {
    _gpuCommandBufferObj->renderPass       = nullptr;
    _gpuCommandBufferObj->fbo              = nullptr;
    _gpuCommandBufferObj->inputAssembler   = nullptr;
    _gpuCommandBufferObj->pipelineState    = nullptr;
    _gpuCommandBufferObj->mtlCommandBuffer = nil;
}

void CCMTLCommandBuffer::updateDepthStencilState(uint32_t index, MTLRenderPassDescriptor *descriptor) {
    CCMTLRenderPass *      curRenderPass = _gpuCommandBufferObj->renderPass;
    CCMTLFramebuffer *     curFBO        = _gpuCommandBufferObj->fbo;
    const SubpassInfoList &subpasses     = curRenderPass->getSubpasses();
    const SubpassInfo      subpass       = subpasses[index];
    if (subpass.depthStencil != INVALID_BINDING) {
        const TextureList &colorTextures = curFBO->getColorTextures();
        if (subpass.depthStencil >= colorTextures.size()) {
            auto *ccMTLTexture                 = static_cast<CCMTLTexture *>(curFBO->getDepthStencilTexture());
            descriptor.depthAttachment.texture = ccMTLTexture->getMTLTexture();
            if (ccMTLTexture->getFormat() == Format::DEPTH_STENCIL)
                descriptor.stencilAttachment.texture = ccMTLTexture->getMTLTexture();
        } else {
            auto *ccMTLTexture                 = static_cast<CCMTLTexture *>(colorTextures[subpass.depthStencil]);
            descriptor.depthAttachment.texture = ccMTLTexture->getMTLTexture();
            if (ccMTLTexture->getFormat() == Format::DEPTH_STENCIL)
                descriptor.stencilAttachment.texture = ccMTLTexture->getMTLTexture();
        }
        if (subpass.depthStencilResolve != INVALID_BINDING) {
            const CCMTLTexture *dsResolveTex = nullptr;
            if (subpass.depthStencilResolve >= colorTextures.size()) {
                dsResolveTex = static_cast<CCMTLTexture *>(curFBO->getDepthStencilTexture());
            } else {
                dsResolveTex = static_cast<CCMTLTexture *>(colorTextures[subpass.depthStencilResolve]);
            }
            descriptor.depthAttachment.resolveTexture    = dsResolveTex->getMTLTexture();
            descriptor.depthAttachment.resolveLevel      = 0;
            descriptor.depthAttachment.resolveSlice      = 0;
            descriptor.depthAttachment.resolveDepthPlane = 0;
            descriptor.depthAttachment.storeAction       = subpass.depthResolveMode == ResolveMode::NONE ? MTLStoreActionMultisampleResolve : MTLStoreActionStoreAndMultisampleResolve;

            descriptor.stencilAttachment.resolveTexture    = dsResolveTex->getMTLTexture();
            descriptor.stencilAttachment.resolveLevel      = 0;
            descriptor.stencilAttachment.resolveSlice      = 0;
            descriptor.stencilAttachment.resolveDepthPlane = 0;
            descriptor.stencilAttachment.storeAction       = subpass.stencilResolveMode == ResolveMode::NONE ? MTLStoreActionMultisampleResolve : MTLStoreActionStoreAndMultisampleResolve;

            descriptor.depthAttachment.depthResolveFilter = mu::toMTLDepthResolveMode(subpass.depthResolveMode);
            if (@available(iOS 12.0, *)) {
                descriptor.stencilAttachment.stencilResolveFilter = mu::toMTLStencilResolveMode(subpass.stencilResolveMode);
            }
        }
    }
}

void CCMTLCommandBuffer::bindPipelineState(PipelineState *pso) {
    PipelineBindPoint      bindPoint  = pso->getBindPoint();
    CCMTLGPUPipelineState *pplState   = nullptr;
    auto *                 ccPipeline = static_cast<CCMTLPipelineState *>(pso);
    if (bindPoint == PipelineBindPoint::GRAPHICS) {
        ccPipeline->check(_gpuCommandBufferObj->renderPass);
        pplState          = ccPipeline->getGPUPipelineState();
        _mtlPrimitiveType = pplState->primitiveType;

        _renderEncoder.setCullMode(pplState->cullMode);
        _renderEncoder.setFrontFacingWinding(pplState->winding);
        _renderEncoder.setDepthClipMode(pplState->depthClipMode);
        _renderEncoder.setTriangleFillMode(pplState->fillMode);
        _renderEncoder.setRenderPipelineState(pplState->mtlRenderPipelineState);

        if (pplState->mtlDepthStencilState) {
            _renderEncoder.setStencilFrontBackReferenceValue(pplState->stencilRefFront, pplState->stencilRefBack);
            _renderEncoder.setDepthStencilState(pplState->mtlDepthStencilState);
        }

    } else if (bindPoint == PipelineBindPoint::COMPUTE) {
        if (!_computeEncoder.isInitialized()) {
            _computeEncoder.initialize(_gpuCommandBufferObj->mtlCommandBuffer);
        }
        pplState = ccPipeline->getGPUPipelineState();
        _computeEncoder.setComputePipelineState(pplState->mtlComputePipelineState);
    }
    _gpuCommandBufferObj->pipelineState = ccPipeline;
}

void CCMTLCommandBuffer::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    CCASSERT(set < _GPUDescriptorSets.size(), "Invalid set index");
    if (dynamicOffsetCount) {
        _dynamicOffsets[set].assign(dynamicOffsets, dynamicOffsets + dynamicOffsetCount);
        if (set < _firstDirtyDescriptorSet) {
            _firstDirtyDescriptorSet = set;
        }
    }

    auto *gpuDescriptorSet = static_cast<CCMTLDescriptorSet *>(descriptorSet)->gpuDescriptorSet();
    if (_GPUDescriptorSets[set] != gpuDescriptorSet) {
        _GPUDescriptorSets[set] = gpuDescriptorSet;
        if (set < _firstDirtyDescriptorSet) {
            _firstDirtyDescriptorSet = set;
        }
    }
}

void CCMTLCommandBuffer::bindInputAssembler(InputAssembler *ia) {
    if (ia) {
        _gpuCommandBufferObj->inputAssembler = static_cast<CCMTLInputAssembler *>(ia);
    }
}

void CCMTLCommandBuffer::setViewport(const Viewport &vp) {
    _renderEncoder.setViewport(vp);
}

void CCMTLCommandBuffer::setScissor(const Rect &rect) {
    _renderEncoder.setScissor(rect);
}

void CCMTLCommandBuffer::setLineWidth(float /*width*/) {
    CC_LOG_WARNING("Metal doesn't support setting line width.");
}

void CCMTLCommandBuffer::setDepthBias(float constant, float clamp, float slope) {
    _renderEncoder.setDepthBias(constant, clamp, slope);
}

void CCMTLCommandBuffer::setBlendConstants(const Color &constants) {
    _renderEncoder.setBlendColor(constants);
}

void CCMTLCommandBuffer::setDepthBound(float /*minBounds*/, float /*maxBounds*/) {
    CC_LOG_ERROR("Metal doesn't support setting depth bound.");
}

void CCMTLCommandBuffer::setStencilWriteMask(StencilFace /*face*/, uint /*mask*/) {
    CC_LOG_ERROR("Don't support change stencil write mask here.");
}

void CCMTLCommandBuffer::setStencilCompareMask(StencilFace /*face*/, uint /*ref*/, uint /*mask*/) {
    CC_LOG_ERROR("Don't support change stencil compare mask here.");
}

void CCMTLCommandBuffer::nextSubpass() {
    CCMTLRenderPass *curRenderPass = _gpuCommandBufferObj->renderPass;
    if (curRenderPass) {
        auto *ccRenderpass = static_cast<CCMTLRenderPass *>(curRenderPass);

        ccRenderpass->nextSubpass();
        // with framebuffer fetch enabled we can get texture as attachments by color[n] (except mac before m1),
        // otherwise setFragmentTexture manually.
        bool setTexNeeded = !mu::isFramebufferFetchSupported();
        if (setTexNeeded) {
            _renderEncoder.endEncoding();
            uint        curSubpassIndex         = ccRenderpass->getCurrentSubpassIndex();
            auto *      mtlRenderPassDescriptor = ccRenderpass->getMTLRenderPassDescriptor();
            const auto &colorAttachments        = curRenderPass->getColorAttachments();
            const auto  colorAttachmentCount    = colorAttachments.size();
            for (size_t slot = 0U; slot < colorAttachmentCount; slot++) {
                mtlRenderPassDescriptor.colorAttachments[slot].loadAction  = MTLLoadActionLoad; // mu::toMTLLoadAction(colorAttachments[slot].loadOp);
                mtlRenderPassDescriptor.colorAttachments[slot].storeAction = mu::toMTLStoreAction(colorAttachments[slot].storeOp);
            }
            updateDepthStencilState(curSubpassIndex, mtlRenderPassDescriptor);
            _renderEncoder.initialize(_gpuCommandBufferObj->mtlCommandBuffer, ccRenderpass->getMTLRenderPassDescriptor());
            const TextureList &    colorTextures = _gpuCommandBufferObj->fbo->getColorTextures();
            const SubpassInfoList &subpasses     = curRenderPass->getSubpasses();
            if (!subpasses.empty()) {
                const auto &inputs = subpasses[curSubpassIndex].inputs;
                for (size_t i = 0; i < inputs.size(); i++) {
                    const uint input        = inputs[i];
                    auto *     ccMtlTexture = static_cast<CCMTLTexture *>(colorTextures[input]);
                    _renderEncoder.setFragmentTexture(ccMtlTexture->getMTLTexture(), input);
                }
            }
        }
    }
}

void CCMTLCommandBuffer::draw(const DrawInfo &info) {
    if (_firstDirtyDescriptorSet < _GPUDescriptorSets.size()) {
        bindDescriptorSets();
    }
    CCMTLInputAssembler *inputAssembler = _gpuCommandBufferObj->inputAssembler;
    const auto *         indirectBuffer = static_cast<CCMTLBuffer *>(inputAssembler->getIndirectBuffer());
    const auto *         indexBuffer    = static_cast<CCMTLBuffer *>(inputAssembler->getIndexBuffer());
    auto                 mtlEncoder     = _renderEncoder.getMTLEncoder();

    if (indirectBuffer) {
        const auto indirectMTLBuffer = indirectBuffer->getMTLBuffer();

        if (_indirectDrawSuppotred) {
            ++_numDrawCalls;
            if (indirectBuffer->isDrawIndirectByIndex()) {
                [mtlEncoder drawIndexedPrimitives:_mtlPrimitiveType
                                        indexType:indexBuffer->getIndexType()
                                      indexBuffer:indexBuffer->getMTLBuffer()
                                indexBufferOffset:0
                                   indirectBuffer:indirectMTLBuffer
                             indirectBufferOffset:0];
            } else {
                [mtlEncoder drawPrimitives:_mtlPrimitiveType
                            indirectBuffer:indirectMTLBuffer
                      indirectBufferOffset:0];
            }
        } else {
            uint        stride        = indirectBuffer->getStride();
            uint        offset        = 0;
            uint        drawInfoCount = indirectBuffer->getCount();
            const auto &drawInfos     = indirectBuffer->getDrawInfos();
            _numDrawCalls += drawInfoCount;

            for (uint i = 0; i < drawInfoCount; ++i) {
                const auto &drawInfo = drawInfos[i];
                offset += drawInfo.firstIndex * stride;
                if (indirectBuffer->isDrawIndirectByIndex()) {
                    if (drawInfo.instanceCount == 0) {
                        [mtlEncoder drawIndexedPrimitives:_mtlPrimitiveType
                                               indexCount:drawInfo.indexCount
                                                indexType:indexBuffer->getIndexType()
                                              indexBuffer:indexBuffer->getMTLBuffer()
                                        indexBufferOffset:offset];
                    } else {
                        [mtlEncoder drawIndexedPrimitives:_mtlPrimitiveType
                                               indexCount:drawInfo.indexCount
                                                indexType:indexBuffer->getIndexType()
                                              indexBuffer:indexBuffer->getMTLBuffer()
                                        indexBufferOffset:offset
                                            instanceCount:drawInfo.instanceCount];
                    }
                } else {
                    if (drawInfo.instanceCount == 0) {
                        [mtlEncoder drawPrimitives:_mtlPrimitiveType
                                       vertexStart:drawInfo.firstIndex
                                       vertexCount:drawInfo.vertexCount];
                    } else {
                        [mtlEncoder drawPrimitives:_mtlPrimitiveType
                                       vertexStart:drawInfo.firstIndex
                                       vertexCount:drawInfo.vertexCount
                                     instanceCount:drawInfo.instanceCount];
                    }
                }
            }
        }
    } else {
        if (info.indexCount > 0) {
            uint offset = 0;
            offset += info.firstIndex * indexBuffer->getStride();
            if (info.instanceCount == 0) {
                [mtlEncoder drawIndexedPrimitives:_mtlPrimitiveType
                                       indexCount:info.indexCount
                                        indexType:indexBuffer->getIndexType()
                                      indexBuffer:indexBuffer->getMTLBuffer()
                                indexBufferOffset:offset];
            } else {
                [mtlEncoder drawIndexedPrimitives:_mtlPrimitiveType
                                       indexCount:info.indexCount
                                        indexType:indexBuffer->getIndexType()
                                      indexBuffer:indexBuffer->getMTLBuffer()
                                indexBufferOffset:offset
                                    instanceCount:info.instanceCount];
            }
        } else if (info.vertexCount) {
            if (info.instanceCount == 0) {
                [mtlEncoder drawPrimitives:_mtlPrimitiveType
                               vertexStart:info.firstIndex
                               vertexCount:info.vertexCount];
            } else {
                [mtlEncoder drawPrimitives:_mtlPrimitiveType
                               vertexStart:info.firstIndex
                               vertexCount:info.vertexCount
                             instanceCount:info.instanceCount];
            }
        }

        _numInstances += info.instanceCount;
        _numDrawCalls++;
        if (_gpuCommandBufferObj->pipelineState) {
            uint indexCount = info.indexCount ? info.indexCount : info.vertexCount;
            switch (_mtlPrimitiveType) {
                case MTLPrimitiveTypeTriangle:
                    _numTriangles += indexCount / 3 * std::max(info.instanceCount, 1U);
                    break;
                case MTLPrimitiveTypeTriangleStrip:
                    _numTriangles += (indexCount - 2) * std::max(info.instanceCount, 1U);
                    break;
                default: break;
            }
        }
    }
}

void CCMTLCommandBuffer::updateBuffer(Buffer *buff, const void *data, uint size) {
    if (!buff) {
        CC_LOG_ERROR("CCMTLCommandBuffer::updateBuffer: buffer is nullptr.");
        return;
    }

    CCMTLGPUBuffer stagingBuffer;
    stagingBuffer.size = size;
    _mtlDevice->gpuStagingBufferPool()->alloc(&stagingBuffer);
    memcpy(stagingBuffer.mappedData, data, size);
    id<MTLBlitCommandEncoder> encoder = [_gpuCommandBufferObj->mtlCommandBuffer blitCommandEncoder];
    [encoder copyFromBuffer:stagingBuffer.mtlBuffer
               sourceOffset:stagingBuffer.startOffset
                   toBuffer:static_cast<CCMTLBuffer *>(buff)->getMTLBuffer()
          destinationOffset:0
                       size:size];
    [encoder endEncoding];
}

void CCMTLCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    if (!texture) {
        CC_LOG_ERROR("CCMTLCommandBuffer::copyBufferToTexture: texture is nullptr");
        return;
    }

    uint                            totalSize = 0;
    vector<uint>                    bufferSize(count);
    vector<CCMTLGPUBufferImageCopy> stagingRegions(count);
    auto                            format          = texture->getFormat();
    auto *                          mtlTexture      = static_cast<CCMTLTexture *>(texture);
    auto                            convertedFormat = mtlTexture->getConvertedFormat();
    for (size_t i = 0; i < count; i++) {
        const auto &region                = regions[i];
        auto &      stagingRegion         = stagingRegions[i];
        auto        w                     = region.buffStride > 0 ? region.buffStride : region.texExtent.width;
        auto        h                     = region.buffTexHeight > 0 ? region.buffTexHeight : region.texExtent.height;
        bufferSize[i]                     = w * h;
        stagingRegion.sourceBytesPerRow   = mu::getBytesPerRow(convertedFormat, w);
        stagingRegion.sourceBytesPerImage = formatSize(convertedFormat, w, h, region.texExtent.depth);
        stagingRegion.sourceSize          = {w, h, region.texExtent.depth};
        stagingRegion.destinationSlice    = region.texSubres.baseArrayLayer;
        stagingRegion.destinationLevel    = region.texSubres.mipLevel;
        stagingRegion.destinationOrigin   = {
            static_cast<uint>(region.texOffset.x),
            static_cast<uint>(region.texOffset.y),
            static_cast<uint>(region.texOffset.z)};
        totalSize += stagingRegion.sourceBytesPerImage;
    }

    size_t                    offset         = 0;
    id<MTLBlitCommandEncoder> encoder        = [_gpuCommandBufferObj->mtlCommandBuffer blitCommandEncoder];
    id<MTLTexture>            dstTexture     = mtlTexture->getMTLTexture();
    const bool                isArrayTexture = mtlTexture->isArray();
    for (size_t i = 0; i < count; i++) {
        const auto &stagingRegion       = stagingRegions[i];
        const auto *convertedData       = mu::convertData(buffers[i], bufferSize[i], format);
        const auto  sourceBytesPerImage = isArrayTexture ? stagingRegion.sourceBytesPerImage : 0;
        MTLRegion   region              = {stagingRegion.destinationOrigin, stagingRegion.sourceSize};
        auto        bytesPerRow         = mtlTexture->isPVRTC() ? 0 : stagingRegion.sourceBytesPerRow;
        auto        bytesPerImage       = mtlTexture->isPVRTC() ? 0 : sourceBytesPerImage;
        [dstTexture replaceRegion:region
                      mipmapLevel:stagingRegion.destinationLevel
                            slice:stagingRegion.destinationSlice
                        withBytes:convertedData
                      bytesPerRow:bytesPerRow
                    bytesPerImage:bytesPerImage];

        offset += stagingRegion.sourceBytesPerImage;
        if (convertedData != buffers[i]) {
            CC_FREE(convertedData);
        }
    }
    if (hasFlag(static_cast<CCMTLTexture *>(texture)->textureInfo().flags, TextureFlags::GEN_MIPMAP) && mu::pixelFormatIsColorRenderable(convertedFormat)) {
        [encoder generateMipmapsForTexture:dstTexture];
    }
    [encoder endEncoding];
}

void CCMTLCommandBuffer::execute(CommandBuffer *const *commandBuffs, uint32_t count) {
    for (uint i = 0; i < count; ++i) {
        const auto *commandBuffer = static_cast<const CCMTLCommandBuffer *>(commandBuffs[i]);
        _numDrawCalls += commandBuffer->_numDrawCalls;
        _numInstances += commandBuffer->_numInstances;
        _numTriangles += commandBuffer->_numTriangles;
    }
}

void CCMTLCommandBuffer::bindDescriptorSets() {
    CCMTLInputAssembler *  inputAssembler   = _gpuCommandBufferObj->inputAssembler;
    CCMTLGPUPipelineState *pipelineStateObj = _gpuCommandBufferObj->pipelineState->getGPUPipelineState();
    const auto &           vertexBuffers    = inputAssembler->getVertexBuffers();
    for (const auto &bindingInfo : pipelineStateObj->vertexBufferBindingInfo) {
        auto index  = std::get<0>(bindingInfo);
        auto stream = std::get<1>(bindingInfo);
        static_cast<CCMTLBuffer *>(vertexBuffers[stream])->encodeBuffer(_renderEncoder, 0, index, ShaderStageFlagBit::VERTEX);
    }

    const auto &dynamicOffsetIndices = pipelineStateObj->gpuPipelineLayout->dynamicOffsetIndices;
    const auto &blocks               = pipelineStateObj->gpuShader->blocks;
    for (const auto &iter : blocks) {
        const auto &block = iter.second;

        const auto *gpuDescriptorSet = _GPUDescriptorSets[block.set];
        const auto  descriptorIndex  = gpuDescriptorSet->descriptorIndices->at(block.binding);
        const auto &gpuDescriptor    = gpuDescriptorSet->gpuDescriptors[descriptorIndex];
        if (!gpuDescriptor.buffer) {
            CC_LOG_ERROR("Buffer binding %s at set %d binding %d is not bounded.", block.name.c_str(), block.set, block.binding);
            continue;
        }

        const auto &dynamicOffset      = dynamicOffsetIndices[block.set];
        auto        dynamicOffsetIndex = (block.binding < dynamicOffset.size()) ? dynamicOffset[block.binding] : -1;
        if (gpuDescriptor.buffer) {
            uint offset = (dynamicOffsetIndex >= 0) ? _dynamicOffsets[block.set][dynamicOffsetIndex] : 0;
            // compute pipeline and render pipeline mutually exlusive
            if (pipelineStateObj->mtlComputePipelineState) {
                gpuDescriptor.buffer->encodeBuffer(_computeEncoder,
                                                   offset,
                                                   block.mappedBinding,
                                                   block.stages);
            } else {
                gpuDescriptor.buffer->encodeBuffer(_renderEncoder,
                                                   offset,
                                                   block.mappedBinding,
                                                   block.stages);
            }
        }
    }

    const auto &samplers = pipelineStateObj->gpuShader->samplers;
    for (const auto &iter : samplers) {
        const auto &sampler = iter.second;

        const auto *gpuDescriptorSet = _GPUDescriptorSets[sampler.set];
        const auto  descriptorIndex  = gpuDescriptorSet->descriptorIndices->at(sampler.binding);
        const auto &gpuDescriptor    = gpuDescriptorSet->gpuDescriptors[descriptorIndex];

        if (!gpuDescriptor.texture || !gpuDescriptor.sampler) {
            CC_LOG_ERROR("Sampler binding %s at set %d binding %d is not bounded.", sampler.name.c_str(), sampler.set, sampler.binding);
            continue;
        }

        if (hasFlag(sampler.stages, ShaderStageFlagBit::VERTEX)) {
            _renderEncoder.setVertexTexture(gpuDescriptor.texture->getMTLTexture(), sampler.textureBinding);
            _renderEncoder.setVertexSampler(gpuDescriptor.sampler->getMTLSamplerState(), sampler.samplerBinding);
        }

        if (hasFlag(sampler.stages, ShaderStageFlagBit::FRAGMENT)) {
            _renderEncoder.setFragmentTexture(gpuDescriptor.texture->getMTLTexture(), sampler.textureBinding);
            _renderEncoder.setFragmentSampler(gpuDescriptor.sampler->getMTLSamplerState(), sampler.samplerBinding);
        }

        if (hasFlag(sampler.stages, ShaderStageFlagBit::COMPUTE)) {
            _computeEncoder.setTexture(gpuDescriptor.texture->getMTLTexture(), sampler.textureBinding);
        }
    }
}

void CCMTLCommandBuffer::blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint count, Filter filter) {
    if (srcTexture && dstTexture && regions) {
        bool                 cmdActivated = _gpuCommandBufferObj->mtlCommandBuffer;
        id<MTLCommandBuffer> mtlCmdBuffer = nil;
        if (cmdActivated) {
            mtlCmdBuffer = _gpuCommandBufferObj->mtlCommandBuffer;
        } else {
            mtlCmdBuffer = [static_cast<CCMTLQueue *>(_queue)->gpuQueueObj()->mtlCommandQueue commandBufferWithUnretainedReferences];
            [mtlCmdBuffer enqueue];
        }
        auto *ccSrcTex = static_cast<CCMTLTexture *>(srcTexture);
        auto *ccDstTex = static_cast<CCMTLTexture *>(dstTexture);

        id<MTLTexture> src = nil;
        if (ccSrcTex->swapChain()) {
            src = ccSrcTex->swapChain()->currentDrawable().texture;
        } else {
            src = ccSrcTex->getMTLTexture();
        }

        id<MTLTexture> dst = nil;
        if (ccDstTex->swapChain()) {
            dst = ccDstTex->swapChain()->currentDrawable().texture;
        } else {
            dst = ccDstTex->getMTLTexture();
        }

        id<MTLDevice> mtlDevice = static_cast<id<MTLDevice>>(_mtlDevice->getMTLDevice());

        //format conversion
        MTLTextureDescriptor *descriptor = [[MTLTextureDescriptor alloc] init];
        descriptor.width                 = src.width;
        descriptor.height                = src.height;
        descriptor.depth                 = src.depth;
        descriptor.pixelFormat           = dst.pixelFormat;
        descriptor.textureType           = src.textureType;
        descriptor.usage                 = MTLTextureUsageShaderWrite | MTLTextureUsageShaderRead;
        descriptor.storageMode           = MTLStorageModePrivate;

        // 1. format conversion
        id<MTLTexture>      formatTex  = [mtlDevice newTextureWithDescriptor:descriptor];
        MPSImageConversion *conversion = [[MPSImageConversion alloc] initWithDevice:mtlDevice srcAlpha:MPSAlphaTypeNonPremultiplied destAlpha:MPSAlphaTypeNonPremultiplied backgroundColor:nil conversionInfo:nil];
        [conversion encodeToCommandBuffer:mtlCmdBuffer sourceTexture:src destinationTexture:formatTex];
        [conversion release];

        double scaleFactorW = [dst width] / (double)[src width];
        double scaleFactorH = [dst height] / (double)[src height];
        double scaleFactorD = [dst depth] / (double)[src depth];

        double uniformScale = scaleFactorW > scaleFactorH ? scaleFactorW : scaleFactorH;

        id<MTLTexture> sizeTex = formatTex;
        if ([dst width] > [src width] || [dst height] > [src height]) {
            // 2. size conversion
            descriptor.width       = dst.width;
            descriptor.height      = dst.height;
            descriptor.depth       = dst.depth;
            descriptor.pixelFormat = dst.pixelFormat;
            descriptor.textureType = dst.textureType;
            descriptor.usage       = MTLTextureUsageShaderWrite;

            sizeTex = [mtlDevice newTextureWithDescriptor:descriptor];

            MPSImageLanczosScale *imgScale = [[MPSImageLanczosScale alloc] initWithDevice:mtlDevice];

            MPSScaleTransform scale{uniformScale, uniformScale, 0, 0};
            [imgScale setScaleTransform:&scale];
            [imgScale encodeToCommandBuffer:mtlCmdBuffer sourceTexture:formatTex destinationTexture:sizeTex];
            [imgScale release];
            [formatTex release];
        }

        //blit
        id<MTLBlitCommandEncoder> encoder = [mtlCmdBuffer blitCommandEncoder];
        for (uint i = 0; i < count; ++i) {
            // source region scale
            uint32_t width  = (uint32_t)(regions[i].srcExtent.width * scaleFactorW);
            uint32_t height = (uint32_t)(regions[i].srcExtent.height * scaleFactorH);
            uint32_t depth  = (uint32_t)(regions[i].srcExtent.depth * scaleFactorD);
            uint32_t x      = (uint32_t)(regions[i].srcOffset.x * scaleFactorW);
            uint32_t y      = (uint32_t)(regions[i].srcOffset.y * scaleFactorH);
            uint32_t z      = (uint32_t)(regions[i].srcOffset.z * scaleFactorD);
            [encoder copyFromTexture:sizeTex
                         sourceSlice:regions[i].srcSubres.baseArrayLayer
                         sourceLevel:regions[i].srcSubres.mipLevel
                        sourceOrigin:MTLOriginMake(x, y, z)
                          sourceSize:MTLSizeMake(width, height, depth)
                           toTexture:dst
                    destinationSlice:regions[i].dstSubres.baseArrayLayer
                    destinationLevel:regions[i].srcSubres.mipLevel
                   destinationOrigin:MTLOriginMake(regions[i].dstOffset.x, regions[i].dstOffset.y, regions[i].dstOffset.z)];
        }
        [encoder endEncoding];

        [sizeTex release];

        [descriptor release];

        if (!cmdActivated) {
            [mtlCmdBuffer commit];
        }
    }
}

void CCMTLCommandBuffer::dispatch(const DispatchInfo &info) {
    if (_firstDirtyDescriptorSet < _GPUDescriptorSets.size()) {
        bindDescriptorSets();
    }
    MTLSize groupsPerGrid = MTLSizeMake(info.groupCountX, info.groupCountY, info.groupCountZ);
    if (info.indirectBuffer) {
        _computeEncoder.dispatch(((CCMTLBuffer *)info.indirectBuffer)->getMTLBuffer(), info.indirectOffset, groupsPerGrid);
    } else {
        _computeEncoder.dispatch(groupsPerGrid);
    }
    _computeEncoder.endEncoding();
}

void CCMTLCommandBuffer::pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint textureBarrierCount) {
    // Metal tracks non-heap resources automatically, which means no need to add a barrier same encoder.
}

void CCMTLCommandBuffer::copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *regions, uint count) {
    auto *         ccMTLTexture    = static_cast<CCMTLTexture *>(src);
    Format         convertedFormat = ccMTLTexture->getConvertedFormat();
    id<MTLTexture> mtlTexture      = ccMTLTexture->getMTLTexture();
    
    if([mtlTexture storageMode] == MTLStorageModeShared) {
        for (size_t i = 0; i < count; ++i) {
            uint32_t      width         = regions[i].texExtent.width;
            uint32_t      height        = regions[i].texExtent.height;
            uint32_t      depth         = regions[i].texExtent.depth;
            uint32_t      bytesPerRow   = mu::getBytesPerRow(convertedFormat, width);
            uint32_t      bytesPerImage = formatSize(convertedFormat, width, height, depth);
            const Offset &origin        = regions[i].texOffset;
            const Extent &extent        = regions[i].texExtent;

            [mtlTexture getBytes:buffers[i]
                     bytesPerRow:bytesPerRow
                   bytesPerImage:bytesPerImage
                      fromRegion:{MTLOriginMake(origin.x, origin.y, origin.z), MTLSizeMake(extent.width, extent.height, extent.depth)}
                     mipmapLevel:regions[i].texSubres.mipLevel
                           slice:regions[i].texSubres.baseArrayLayer];
        }
    } else {
        // TODO_Zeqiang: metal commandbuffer ownership
        auto *mtlQueue = static_cast<CCMTLQueue *>(_queue)->gpuQueueObj()->mtlCommandQueue;
        id<MTLCommandBuffer> cmdBuff = [mtlQueue commandBufferWithUnretainedReferences];
        [cmdBuff enqueue];
        std::vector<std::pair<uint8_t*, uint32_t>> stagingAddrs(count);
        for (size_t i = 0; i < count; ++i) {
            uint32_t      width         = regions[i].texExtent.width;
            uint32_t      height        = regions[i].texExtent.height;
            uint32_t      depth         = regions[i].texExtent.depth;
            uint32_t      bytesPerRow   = mu::getBytesPerRow(convertedFormat, width);
            uint32_t      bytesPerImage = formatSize(convertedFormat, width, height, depth);
            const Offset &origin        = regions[i].texOffset;
            const Extent &extent        = regions[i].texExtent;
            
            id<MTLBlitCommandEncoder> encoder = [cmdBuff blitCommandEncoder];
            CCMTLGPUBuffer stagingBuffer;
            stagingBuffer.size = bytesPerImage;
            _mtlDevice->gpuStagingBufferPool()->alloc(&stagingBuffer);
            [encoder copyFromTexture:mtlTexture
                         sourceSlice:regions[i].texSubres.baseArrayLayer
                         sourceLevel:regions[i].texSubres.mipLevel
                        sourceOrigin:MTLOriginMake(origin.x, origin.y, origin.z)
                          sourceSize:MTLSizeMake(extent.width, extent.height, extent.depth)
                            toBuffer:stagingBuffer.mtlBuffer
                   destinationOffset:0
              destinationBytesPerRow:bytesPerRow
            destinationBytesPerImage:bytesPerImage];
            [encoder endEncoding];
            stagingAddrs[i] = {stagingBuffer.mappedData, bytesPerImage};
        }
        if(!_texCopySemaphore)
            _texCopySemaphore = CC_NEW(CCMTLSemaphore(1));
        _texCopySemaphore->wait();
        [cmdBuff addCompletedHandler:^(id<MTLCommandBuffer> commandBuffer) {
            for(size_t i = 0; i < count; ++i) {
                memcpy(buffers[i], stagingAddrs[i].first, stagingAddrs[i].second);
            }
            _texCopySemaphore->signal();
        }];
        [cmdBuff commit];
        // wait this cmdbuff done;
        _texCopySemaphore->wait();
        _texCopySemaphore->signal();
        
    }
}

void CCMTLCommandBuffer::beginQuery(QueryPool *queryPool, uint32_t id) {
    auto *mtlQueryPool = static_cast<CCMTLQueryPool *>(queryPool);
    auto  queryId      = static_cast<uint32_t>(mtlQueryPool->_ids.size());

    if (queryId < queryPool->getMaxQueryObjects()) {
        auto *mtlEncoder = _renderEncoder.getMTLEncoder();
        [mtlEncoder setVisibilityResultMode:MTLVisibilityResultModeBoolean offset:queryId * sizeof(uint64_t)];
    }
}

void CCMTLCommandBuffer::endQuery(QueryPool *queryPool, uint32_t id) {
    auto *mtlQueryPool = static_cast<CCMTLQueryPool *>(queryPool);
    auto  queryId      = static_cast<uint32_t>(mtlQueryPool->_ids.size());

    if (queryId < queryPool->getMaxQueryObjects()) {
        auto *mtlEncoder = _renderEncoder.getMTLEncoder();
        [mtlEncoder setVisibilityResultMode:MTLVisibilityResultModeDisabled offset:queryId * sizeof(uint64_t)];
        mtlQueryPool->_ids.push_back(id);
    }
}

void CCMTLCommandBuffer::resetQueryPool(QueryPool *queryPool) {
    auto *mtlQueryPool = static_cast<CCMTLQueryPool *>(queryPool);

    mtlQueryPool->_ids.clear();
}

void CCMTLCommandBuffer::completeQueryPool(QueryPool *queryPool) {
    auto *             mtlQueryPool = static_cast<CCMTLQueryPool *>(queryPool);
    CCMTLGPUQueryPool *gpuQueryPool = mtlQueryPool->gpuQueryPool();

    [_gpuCommandBufferObj->mtlCommandBuffer addCompletedHandler:^(id<MTLCommandBuffer> commandBuffer) {
        gpuQueryPool->semaphore->signal();
    }];
}

} // namespace gfx
} // namespace cc
