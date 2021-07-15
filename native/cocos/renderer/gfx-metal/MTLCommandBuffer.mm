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

#include "MTLStd.h"

#include <QuartzCore/CAMetalLayer.h>
#include "MTLBuffer.h"
#include "MTLCommandBuffer.h"
#include "MTLDescriptorSet.h"
#include "MTLDevice.h"
#include "MTLFramebuffer.h"
#include "MTLInputAssembler.h"
#include "MTLPipelineState.h"
#include "MTLRenderPass.h"
#include "MTLSampler.h"
#include "MTLTexture.h"
#include "TargetConditionals.h"
#import <MetalPerformanceShaders/MetalPerformanceShaders.h>

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

void CCMTLCommandBuffer::doInit(const CommandBufferInfo &info) {
}

void CCMTLCommandBuffer::doDestroy() {
    _gpuPipelineState = nullptr;
    _GPUDescriptorSets.clear();
    _dynamicOffsets.clear();
    _firstDirtyDescriptorSet = UINT_MAX;
    _indirectDrawSuppotred = false;
    _commandBufferBegan = false;
    _isSecondary = false;
    _mtlDevice = nullptr;
    _mtlCommandQueue = nil;
    _mtlCommandBuffer = nil;
    _parallelEncoder = nil;
    _inputAssembler = nullptr;
    
    //state cache
    _curRenderPass = nullptr;
    _curFBO = nullptr;
    _curSubpassIndex = 0;
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

    _isSecondary = renderPass != nullptr && _mtlCommandBuffer;
    if (!_isSecondary) {
        // Only primary command buffer should request command buffer explicitly
        _mtlCommandBuffer = [[_mtlCommandQueue commandBuffer] retain];
        [_mtlCommandBuffer enqueue];
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

    if (_isSecondary) {
        // Secondary command buffer should end encoding here
        _renderEncoder.endEncoding();
    }
}

void CCMTLCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, uint stencil, CommandBuffer *const *secondaryCBs, uint secondaryCBCount) {
    // Sub CommandBuffer shouldn't call begin render pass
    if (_isSecondary) {
        return;
    }
    _curRenderPass = renderPass;
    _curFBO = fbo;
    _curSubpassIndex = 0;

    auto *ccMtlRenderPass = static_cast<CCMTLRenderPass *>(renderPass);
    auto  isOffscreen     = static_cast<CCMTLFramebuffer *>(fbo)->isOffscreen();
    
    MTLRenderPassDescriptor *mtlRenderPassDescriptor = static_cast<CCMTLRenderPass *>(renderPass)->getMTLRenderPassDescriptor();
    if (!isOffscreen) {
        id<CAMetalDrawable> drawable = (id<CAMetalDrawable>)_mtlDevice->getCurrentDrawable();
        id<MTLTexture>      dssTex   = (id<MTLTexture>)_mtlDevice->getDSSTexture();
        ccMtlRenderPass->setColorAttachment(0, drawable.texture, 0);
        ccMtlRenderPass->setDepthStencilAttachment(dssTex, 0);
    } else {
        const TextureList &colorTextures = fbo->getColorTextures();
        for (size_t i = 0; i < colorTextures.size(); i++) {
            id<MTLTexture> tex = nil;
            auto *ccMtlTexture = static_cast<CCMTLTexture *>(colorTextures[i]);
            if(!ccMtlTexture) {
                id<CAMetalDrawable> drawable = (id<CAMetalDrawable>)_mtlDevice->getCurrentDrawable();
                tex = drawable.texture;
            } else {
                tex = ccMtlTexture->getMTLTexture();
            }
            ccMtlRenderPass->setColorAttachment(i, tex, 0);
        }

        Texture *dsTexture = fbo->getDepthStencilTexture();
        if (dsTexture) {
            auto *ccMtlTexture = static_cast<CCMTLTexture *>(dsTexture);
            ccMtlRenderPass->setDepthStencilAttachment(ccMtlTexture->getMTLTexture(), 0);
        } else {
            const DepthStencilAttachment& dsa = renderPass->getDepthStencilAttachment();
            if(dsa.format != Format::UNKNOWN) {
                id<MTLTexture>      dssTex   = (id<MTLTexture>)_mtlDevice->getDSSTexture();
                ccMtlRenderPass->setDepthStencilAttachment(dssTex, 0);
            }
        }
    }
    if (!isRenderingEntireDrawable(renderArea, static_cast<CCMTLRenderPass *>(renderPass))) {
        //Metal doesn't apply the viewports and scissors to renderpass load-action clearing.
        mu::clearRenderArea(_mtlDevice, _mtlCommandBuffer, renderPass, renderArea, colors, depth, stencil);
    } else {
        const auto &colorAttachments     = renderPass->getColorAttachments();
        const auto  colorAttachmentCount = colorAttachments.size();
        for (size_t slot = 0U; slot < colorAttachmentCount; slot++) {
            mtlRenderPassDescriptor.colorAttachments[slot].clearColor = mu::toMTLClearColor(colors[slot]);
            mtlRenderPassDescriptor.colorAttachments[slot].loadAction = mu::toMTLLoadAction(colorAttachments[slot].loadOp);
            mtlRenderPassDescriptor.colorAttachments[slot].storeAction = mu::isFramebufferFetchSupported() ?
                                                                         mu::toMTLStoreAction(colorAttachments[slot].storeOp) : MTLStoreActionStore;
        }
        
        mtlRenderPassDescriptor.depthAttachment.clearDepth     = depth;
        mtlRenderPassDescriptor.stencilAttachment.clearStencil = stencil;
    }

    if (secondaryCBCount > 0) {
        _parallelEncoder = [[_mtlCommandBuffer parallelRenderCommandEncoderWithDescriptor:mtlRenderPassDescriptor] retain];
        // Create command encoders from parallel encoder and assign to command buffers
        for (uint i = 0u; i < secondaryCBCount; ++i) {
            CCMTLCommandBuffer *cmdBuff = (CCMTLCommandBuffer *)secondaryCBs[i];
            cmdBuff->_renderEncoder.initialize(_parallelEncoder);
            cmdBuff->_mtlCommandBuffer = _mtlCommandBuffer;
        }
    } else {
        _renderEncoder.initialize(_mtlCommandBuffer, mtlRenderPassDescriptor);
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
    static_cast<CCMTLRenderPass*>(_curRenderPass)->reset();
    _curRenderPass = nullptr;
    _curFBO = nullptr;
}

void CCMTLCommandBuffer::bindPipelineState(PipelineState *pso) {
    PipelineBindPoint bindPoint = pso->getBindPoint();
    if (bindPoint == PipelineBindPoint::GRAPHICS) {
        auto ccPipeline = static_cast<CCMTLPipelineState *>(pso);
        ccPipeline->check();
        _gpuPipelineState = ccPipeline->getGPUPipelineState();
        _mtlPrimitiveType = _gpuPipelineState->primitiveType;

        _renderEncoder.setCullMode(_gpuPipelineState->cullMode);
        _renderEncoder.setFrontFacingWinding(_gpuPipelineState->winding);
        _renderEncoder.setDepthClipMode(_gpuPipelineState->depthClipMode);
        _renderEncoder.setTriangleFillMode(_gpuPipelineState->fillMode);
        _renderEncoder.setRenderPipelineState(_gpuPipelineState->mtlRenderPipelineState);

        if (_gpuPipelineState->mtlDepthStencilState) {
            _renderEncoder.setStencilFrontBackReferenceValue(_gpuPipelineState->stencilRefFront, _gpuPipelineState->stencilRefBack);
            _renderEncoder.setDepthStencilState(_gpuPipelineState->mtlDepthStencilState);
        }
    } else if (bindPoint == PipelineBindPoint::COMPUTE) {
        if (!_computeEncoder.isInitialized()) {
            _computeEncoder.initialize(_mtlCommandBuffer);
        }
        _gpuPipelineState = static_cast<CCMTLPipelineState *>(pso)->getGPUPipelineState();
        _computeEncoder.setComputePipelineState(_gpuPipelineState->mtlComputePipelineState);
    }
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
        _inputAssembler = static_cast<CCMTLInputAssembler *>(ia);
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
    if(_curRenderPass) {
        auto *ccRenderpass = static_cast<CCMTLRenderPass*>(_curRenderPass);

        ccRenderpass->nextSubpass();
        // with framebuffer fetch enabled we can get texture as attachments by color[n] (except mac before m1),
        // otherwise setFragmentTexture manually.
        bool setTexNeeded = !mu::isFramebufferFetchSupported();
        if(setTexNeeded) {
            auto *mtlRenderPassDescriptor = ccRenderpass->getMTLRenderPassDescriptor();
            const auto &colorAttachments     = _curRenderPass->getColorAttachments();
            const auto  colorAttachmentCount = colorAttachments.size();
            for (size_t slot = 0U; slot < colorAttachmentCount; slot++) {
                mtlRenderPassDescriptor.colorAttachments[slot].loadAction = MTLLoadActionLoad;// mu::toMTLLoadAction(colorAttachments[slot].loadOp);
                mtlRenderPassDescriptor.colorAttachments[slot].storeAction = mu::toMTLStoreAction(colorAttachments[slot].storeOp);
            }
            _renderEncoder.endEncoding();
            _renderEncoder.initialize(_mtlCommandBuffer, ccRenderpass->getMTLRenderPassDescriptor());
            uint curSubpassIndex = ccRenderpass->getCurrentSubpassIndex();
            const TextureList &colorTextures = _curFBO->getColorTextures();
            const SubpassInfoList& subpasses = _curRenderPass->getSubpasses();
            if(!subpasses.empty()) {
                const auto& inputs = subpasses[curSubpassIndex].inputs;
                for (size_t i = 0; i < inputs.size(); i++) {
                    const uint input = inputs[i];
                    auto *ccMtlTexture = static_cast<CCMTLTexture *>(colorTextures[input]);
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

    const auto *indirectBuffer = static_cast<CCMTLBuffer *>(_inputAssembler->getIndirectBuffer());
    const auto *indexBuffer    = static_cast<CCMTLBuffer *>(_inputAssembler->getIndexBuffer());
    auto        mtlEncoder     = _renderEncoder.getMTLEncoder();

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
        if (_gpuPipelineState) {
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
    id<MTLBlitCommandEncoder> encoder = [_mtlCommandBuffer blitCommandEncoder];
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
    id<MTLBlitCommandEncoder> encoder        = [_mtlCommandBuffer blitCommandEncoder];
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
    if (hasFlag(texture->getFlags(), TextureFlags::GEN_MIPMAP) && mu::pixelFormatIsColorRenderable(convertedFormat)) {
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
    const auto &vertexBuffers = _inputAssembler->getVertexBuffers();
    for (const auto &bindingInfo : _gpuPipelineState->vertexBufferBindingInfo) {
        auto index  = std::get<0>(bindingInfo);
        auto stream = std::get<1>(bindingInfo);
        static_cast<CCMTLBuffer *>(vertexBuffers[stream])->encodeBuffer(_renderEncoder, 0, index, ShaderStageFlagBit::VERTEX);
    }

    const auto &dynamicOffsetIndices = _gpuPipelineState->gpuPipelineLayout->dynamicOffsetIndices;
    const auto &blocks               = _gpuPipelineState->gpuShader->blocks;
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
            if (_gpuPipelineState->mtlComputePipelineState) {
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

    const auto &samplers = _gpuPipelineState->gpuShader->samplers;
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
    if (srcTexture && regions) {
        id<MTLTexture>            src     = static_cast<CCMTLTexture *>(srcTexture)->getMTLTexture();
        id<MTLTexture>            dst     = nil;
        CCMTLDevice *             device  = CCMTLDevice::getInstance();
        if (!dstTexture) {
            id<CAMetalDrawable> currentDrawable = (id<CAMetalDrawable>)device->getCurrentDrawable();
            dst                                 = [currentDrawable texture];
        } else {
            dst = static_cast<CCMTLTexture *>(dstTexture)->getMTLTexture();
        }
        
        id<MTLDevice> mtlDevice = static_cast<id<MTLDevice>>(_mtlDevice->getMTLDevice());
        MPSImageConversion *conversion = [[MPSImageConversion alloc] initWithDevice: mtlDevice srcAlpha:MPSAlphaTypeNonPremultiplied destAlpha:MPSAlphaTypeNonPremultiplied backgroundColor:nil conversionInfo:nil];
        
        [conversion encodeToCommandBuffer:_mtlCommandBuffer sourceTexture:src destinationTexture:dst];
        [conversion release];
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

} // namespace gfx
} // namespace cc
