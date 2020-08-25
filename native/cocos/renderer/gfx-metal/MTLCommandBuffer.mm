#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLCommandBuffer.h"
#include "MTLCommands.h"
#include "MTLDescriptorSet.h"
#include "MTLDevice.h"
#include "MTLFramebuffer.h"
#include "MTLInputAssembler.h"
#include "MTLPipelineState.h"
#include "MTLRenderPass.h"
#include "MTLSampler.h"
#include "MTLShader.h"
#include "MTLTexture.h"
#include "MTLUtils.h"

namespace cc {
namespace gfx {

CCMTLCommandBuffer::CCMTLCommandBuffer(Device *device)
: CommandBuffer(device),
  _mtkView((MTKView *)((CCMTLDevice *)_device)->getMTKView()),
  _frameBoundarySemaphore(dispatch_semaphore_create(MAX_INFLIGHT_BUFFER)) {
    uint setCount = device->bindingMappingInfo().bufferOffsets.size();
    _GPUDescriptorSets.resize(setCount);
    _dynamicOffsets.resize(setCount);
}

CCMTLCommandBuffer::~CCMTLCommandBuffer() { destroy(); }

bool CCMTLCommandBuffer::initialize(const CommandBufferInfo &info) {
    _type = info.type;
    _queue = info.queue;

    return true;
}

void CCMTLCommandBuffer::destroy() {
    dispatch_semaphore_signal(_frameBoundarySemaphore);
}

void CCMTLCommandBuffer::begin(RenderPass *renderPass, uint subpass, Framebuffer *frameBuffer) {
    dispatch_semaphore_wait(_frameBoundarySemaphore, DISPATCH_TIME_FOREVER);
    _mtlCommandBuffer = [id<MTLCommandQueue>(((CCMTLDevice *)(_device))->getMTLCommandQueue()) commandBuffer];
    [_mtlCommandBuffer enqueue];
    [_mtlCommandBuffer retain];
    _numTriangles = 0;
    _numDrawCalls = 0;
    _gpuIndexBuffer = {0, 0, 0};
    _gpuIndirectBuffer = {0, 0, 0};

    _GPUDescriptorSets.assign(_GPUDescriptorSets.size(), nullptr);
    for (auto &dynamicOffset : _dynamicOffsets) {
        dynamicOffset.clear();
    }
}

void CCMTLCommandBuffer::end() {
    [_mtlCommandBuffer addCompletedHandler:^(id<MTLCommandBuffer> commandBuffer) {
        // GPU work is complete
        // Signal the semaphore to start the CPU work
        dispatch_semaphore_signal(_frameBoundarySemaphore);
    }];
    [_mtlCommandBuffer commit];
    [_mtlCommandBuffer release];
}

void CCMTLCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil) {

    auto isOffscreen = static_cast<CCMTLFramebuffer *>(fbo)->isOffscreen();
    if (!isOffscreen) {
        static_cast<CCMTLRenderPass *>(renderPass)->setColorAttachment(0, ((MTKView *)_mtkView).currentDrawable.texture, 0);
        static_cast<CCMTLRenderPass *>(renderPass)->setDepthStencilAttachment(((MTKView *)_mtkView).depthStencilTexture, 0);
    }
    MTLRenderPassDescriptor *mtlRenderPassDescriptor = static_cast<CCMTLRenderPass *>(renderPass)->getMTLRenderPassDescriptor();
    auto colorAttachmentCount = renderPass->getColorAttachments().size();

    for (size_t slot = 0; slot < colorAttachmentCount; slot++) {
        mtlRenderPassDescriptor.colorAttachments[slot].clearColor = mu::toMTLClearColor(colors[slot]);
    }

    mtlRenderPassDescriptor.depthAttachment.clearDepth = depth;
    mtlRenderPassDescriptor.stencilAttachment.clearStencil = stencil;

    _mtlEncoder = [_mtlCommandBuffer renderCommandEncoderWithDescriptor:mtlRenderPassDescriptor];
}

void CCMTLCommandBuffer::endRenderPass() {
    [_mtlEncoder endEncoding];
}

void CCMTLCommandBuffer::bindPipelineState(PipelineState *pso) {
    _gpuPipelineState = static_cast<CCMTLPipelineState *>(pso)->getGPUPipelineState();
    _mtlPrimitiveType = _gpuPipelineState->primitiveType;
    [_mtlEncoder setCullMode:_gpuPipelineState->cullMode];
    [_mtlEncoder setFrontFacingWinding:_gpuPipelineState->winding];
    [_mtlEncoder setDepthClipMode:_gpuPipelineState->depthClipMode];
    [_mtlEncoder setTriangleFillMode:_gpuPipelineState->fillMode];
    [_mtlEncoder setRenderPipelineState:_gpuPipelineState->mtlRenderPipelineState];

    if (_gpuPipelineState->mtlDepthStencilState) {
        [_mtlEncoder setStencilFrontReferenceValue:_gpuPipelineState->stencilRefFront
                                backReferenceValue:_gpuPipelineState->stencilRefBack];
        [_mtlEncoder setDepthStencilState:_gpuPipelineState->mtlDepthStencilState];
    }

    _GPUDescriptorSets.resize(_gpuPipelineState->gpuPipelineLayout->setLayouts.size());
}

void CCMTLCommandBuffer::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    auto &vertexBuffers = _inputAssembler->getVertexBuffers();
    for (const auto &bindingInfo : _gpuPipelineState->vertexBufferBindingInfo) {
        auto index = std::get<0>(bindingInfo);
        auto stream = std::get<1>(bindingInfo);
        static_cast<CCMTLBuffer *>(vertexBuffers[stream])->encodeBuffer(_mtlEncoder, 0, index, ShaderStageFlagBit::VERTEX);
    }

    if (dynamicOffsetCount) {
        _dynamicOffsets[set].assign(dynamicOffsets, dynamicOffsets + dynamicOffsetCount);
    }

    _GPUDescriptorSets[set] = static_cast<CCMTLDescriptorSet *>(descriptorSet)->gpuDescriptorSet();
    const auto &blocks = _gpuPipelineState->gpuShader->blocks;
    auto blockCount = blocks.size();
    const auto &dynamicOffsetIndices = _gpuPipelineState->gpuPipelineLayout->dynamicOffsetIndices;
    for (size_t i = 0; i < blockCount; i++) {
        const auto &block = blocks[i];
        CCASSERT(_GPUDescriptorSets.size() > block.set, "Invalid ubo set index");

        const auto gpuDescriptorSet = _GPUDescriptorSets[block.set];
        const auto &gpuDescriptor = gpuDescriptorSet->gpuDescriptors[block.binding];

        if (!gpuDescriptor.buffer) {
            CC_LOG_ERROR("Buffer binding %s at set %d binding %d is not bounded.", block.name.c_str(), block.set, block.binding);
            continue;
        }

        int dynamicOffsetIndex = -1;
        if (dynamicOffsetIndices.size() > block.set) {
            const auto &dynamicOffsetIndexSet = dynamicOffsetIndices[block.set];
            if (dynamicOffsetIndices.size() > block.binding) {
                dynamicOffsetIndex = dynamicOffsetIndexSet[block.binding];
            }
        }

        if (gpuDescriptor.buffer) {
            uint offset = (dynamicOffsetIndex >= 0) ? dynamicOffsets[0] : 0;
            gpuDescriptor.buffer->encodeBuffer(_mtlEncoder, offset, block.binding, gpuDescriptor.stages);
        }
    }
    const auto &samplers = _gpuPipelineState->gpuShader->samplers;
    auto samplerCount = samplers.size();
    for (size_t j = 0; j < samplerCount; j++) {
        const auto sampler = samplers[j];
        CCASSERT(_GPUDescriptorSets.size() > sampler.set, "Invalid sampler set index");

        const auto gpuDescriptorSet = _GPUDescriptorSets[sampler.set];
        const auto &gpuDescriptor = gpuDescriptorSet->gpuDescriptors[sampler.binding];

        if (!gpuDescriptor.texture || !gpuDescriptor.sampler) {
            CC_LOG_ERROR("Sampler binding %s at set %d binding %d is not bounded.", sampler.name.c_str(), sampler.set, sampler.binding);
            continue;
        }

        const auto &vertexSamplerBinding = _gpuPipelineState->gpuShader->vertexSamplerBindings;
        const auto &fragmentSamplerBinding = _gpuPipelineState->gpuShader->fragmentSamplerBindings;
        if (gpuDescriptor.stages & ShaderStageFlagBit::VERTEX) {
            [_mtlEncoder setVertexTexture:gpuDescriptor.texture->getMTLTexture() atIndex:sampler.binding];
            [_mtlEncoder setVertexSamplerState:gpuDescriptor.sampler->getMTLSamplerState() atIndex:vertexSamplerBinding.at(sampler.binding)];
        }

        if (gpuDescriptor.stages & ShaderStageFlagBit::FRAGMENT) {
            [_mtlEncoder setFragmentTexture:gpuDescriptor.texture->getMTLTexture() atIndex:sampler.binding];
            [_mtlEncoder setFragmentSamplerState:gpuDescriptor.sampler->getMTLSamplerState() atIndex:fragmentSamplerBinding.at(sampler.binding)];
        }
    }
}

void CCMTLCommandBuffer::bindInputAssembler(InputAssembler *ia) {
    if (ia) {
        _inputAssembler = static_cast<CCMTLInputAssembler *>(ia);
        if (_inputAssembler->getIndexBuffer()) {
            _gpuIndexBuffer.mtlBuffer = static_cast<CCMTLBuffer *>(_inputAssembler->getIndexBuffer())->getMTLBuffer();
            _gpuIndexBuffer.stride = _inputAssembler->getIndexBuffer()->getStride();
            _indexType = static_cast<CCMTLBuffer *>(_inputAssembler->getIndexBuffer())->getIndexType();
        }

        if (_inputAssembler->getIndirectBuffer()) {
            _gpuIndirectBuffer.mtlBuffer = static_cast<CCMTLBuffer *>(_inputAssembler->getIndirectBuffer())->getMTLBuffer();
            _gpuIndirectBuffer.count = _inputAssembler->getIndirectBuffer()->getCount();
        }
    }
}

void CCMTLCommandBuffer::setViewport(const Viewport &vp) {
    if (_currentViewport == vp)
        return;

    _currentViewport = vp;
    [_mtlEncoder setViewport:mu::toMTLViewport(_currentViewport)];
}

void CCMTLCommandBuffer::setScissor(const Rect &rect) {
    if (_currentScissor == rect)
        return;

    _currentScissor = rect;
    [_mtlEncoder setScissorRect:mu::toMTLScissorRect(_currentScissor)];
}

void CCMTLCommandBuffer::setLineWidth(const float width) {
    CC_LOG_WARNING("Metal doesn't support setting line width.");
}

void CCMTLCommandBuffer::setDepthBias(float constant, float clamp, float slope) {
    if (math::IsNotEqualF(constant, _depthBias.depthBias) ||
        math::IsNotEqualF(clamp, _depthBias.clamp) ||
        math::IsNotEqualF(slope, _depthBias.slopeScale)) {
        _depthBias.depthBias = constant;
        _depthBias.slopeScale = slope;
        _depthBias.clamp = clamp;
        [_mtlEncoder setDepthBias:_depthBias.depthBias
                       slopeScale:_depthBias.slopeScale
                            clamp:_depthBias.clamp];
    }
}

void CCMTLCommandBuffer::setBlendConstants(const Color &constants) {
    if (math::IsNotEqualF(constants.r, _blendConstants.r) ||
        math::IsNotEqualF(constants.g, _blendConstants.g) ||
        math::IsNotEqualF(constants.b, _blendConstants.b) ||
        math::IsNotEqualF(constants.a, _blendConstants.a)) {
        _blendConstants.r = constants.r;
        _blendConstants.g = constants.g;
        _blendConstants.b = constants.b;
        _blendConstants.a = constants.a;
        [_mtlEncoder setBlendColorRed:_blendConstants.r
                                green:_blendConstants.g
                                 blue:_blendConstants.b
                                alpha:_blendConstants.a];
    }
}

void CCMTLCommandBuffer::setDepthBound(float minBounds, float maxBounds) {
    CC_LOG_ERROR("Metal doesn't support setting depth bound.");
}

void CCMTLCommandBuffer::setStencilWriteMask(StencilFace face, uint mask) {
    CC_LOG_ERROR("Don't support change stencil write mask here.");
}

void CCMTLCommandBuffer::setStencilCompareMask(StencilFace face, int ref, uint mask) {
    CC_LOG_ERROR("Don't support change stencil compare mask here.");
}

void CCMTLCommandBuffer::draw(InputAssembler *ia) {
    //

    if (_type == CommandBufferType::PRIMARY) {
        if (_gpuIndirectBuffer.count) {
            for (size_t j = 0; j < _gpuIndirectBuffer.count; j++) {
                if (_gpuIndexBuffer.mtlBuffer) {
                    [_mtlEncoder drawIndexedPrimitives:_mtlPrimitiveType
                                             indexType:_indexType
                                           indexBuffer:_gpuIndexBuffer.mtlBuffer
                                     indexBufferOffset:j * _gpuIndexBuffer.stride
                                        indirectBuffer:_gpuIndirectBuffer.mtlBuffer
                                  indirectBufferOffset:j * sizeof(MTLDrawIndexedPrimitivesIndirectArguments)];
                } else {
                    [_mtlEncoder drawPrimitives:_mtlPrimitiveType
                                 indirectBuffer:_gpuIndirectBuffer.mtlBuffer
                           indirectBufferOffset:j * sizeof(MTLDrawIndexedPrimitivesIndirectArguments)];
                }
            }
        } else {
            DrawInfo drawInfo;
            static_cast<CCMTLInputAssembler *>(ia)->extractDrawInfo(drawInfo);
            if (drawInfo.indexCount > 0) {
                NSUInteger offset = 0;
                offset += drawInfo.firstIndex * _gpuIndexBuffer.stride;
                if (drawInfo.instanceCount == 0) {
                    [_mtlEncoder drawIndexedPrimitives:_mtlPrimitiveType
                                            indexCount:drawInfo.indexCount
                                             indexType:_indexType
                                           indexBuffer:_gpuIndexBuffer.mtlBuffer
                                     indexBufferOffset:offset];
                } else {
                    [_mtlEncoder drawIndexedPrimitives:_mtlPrimitiveType
                                            indexCount:drawInfo.indexCount
                                             indexType:_indexType
                                           indexBuffer:_gpuIndexBuffer.mtlBuffer
                                     indexBufferOffset:offset
                                         instanceCount:drawInfo.instanceCount];
                }
            } else {
                if (drawInfo.instanceCount == 0) {
                    [_mtlEncoder drawPrimitives:_mtlPrimitiveType
                                    vertexStart:drawInfo.firstIndex
                                    vertexCount:drawInfo.vertexCount];
                } else {
                    [_mtlEncoder drawPrimitives:_mtlPrimitiveType
                                    vertexStart:drawInfo.firstIndex
                                    vertexCount:drawInfo.vertexCount
                                  instanceCount:drawInfo.instanceCount];
                }
            }
        }

    } else if (_type == CommandBufferType::SECONDARY) {
        CC_LOG_ERROR("CommandBufferType::SECONDARY not implemented.");
    } else {
        CC_LOG_ERROR("Command 'draw' must be recorded inside a render pass.");
    }
}

void CCMTLCommandBuffer::updateBuffer(Buffer *buff, void *data, uint size, uint offset) {
    if ((_type == CommandBufferType::PRIMARY) ||
        (_type == CommandBufferType::SECONDARY)) {
        if (buff) {
            buff->update(data, offset, size);
        } else {
            CC_LOG_ERROR("CCMTLCommandBuffer::updateBuffer: buffer is nullptr.");
        }
    } else {
        CC_LOG_ERROR("CCMTLCommandBuffer::updateBuffer: invalid command buffer type.");
    }
}

void CCMTLCommandBuffer::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    if ((_type == CommandBufferType::PRIMARY) ||
        (_type == CommandBufferType::SECONDARY)) {
        if (texture) {
            static_cast<CCMTLTexture *>(texture)->update(buffers, regions, count);
        } else {
            CC_LOG_ERROR("CCMTLCommandBuffer::copyBufferToTexture: texture is nullptr");
        }
    } else {
        CC_LOG_ERROR("CCMTLCommandBuffer::copyBufferToTexture: invalid command buffer type %d.", _type);
    }
}

void CCMTLCommandBuffer::execute(const CommandBuffer *const *commandBuffs, uint32_t count) {
    for (uint i = 0; i < count; ++i) {
        auto commandBuffer = static_cast<const CCMTLCommandBuffer *>(commandBuffs[i]);
        _numDrawCalls += commandBuffer->_numDrawCalls;
        _numInstances += commandBuffer->_numInstances;
        _numTriangles += commandBuffer->_numTriangles;
    }
}

} // namespace gfx
} // namespace cc
