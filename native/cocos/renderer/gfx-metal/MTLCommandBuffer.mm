#include "MTLStd.h"

#include "MTLBindingLayout.h"
#include "MTLBuffer.h"
#include "MTLCommandBuffer.h"
#include "MTLCommands.h"
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
}

CCMTLCommandBuffer::~CCMTLCommandBuffer() { destroy(); }

bool CCMTLCommandBuffer::initialize(const CommandBufferInfo &info) {
    _type = info.type;
    _queue = info.queue;

    _status = Status::SUCCESS;

    return true;
}

void CCMTLCommandBuffer::destroy() {
    _status = Status::UNREADY;
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

void CCMTLCommandBuffer::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const vector<Color> &colors, float depth, int stencil) {

    auto isOffscreen = static_cast<CCMTLFramebuffer *>(fbo)->isOffscreen();
    if (!isOffscreen) {
        static_cast<CCMTLRenderPass *>(renderPass)->setColorAttachment(0, ((MTKView *)_mtkView).currentDrawable.texture, 0);
        static_cast<CCMTLRenderPass *>(renderPass)->setDepthStencilAttachment(((MTKView *)_mtkView).depthStencilTexture, 0);
    }
    MTLRenderPassDescriptor *mtlRenderPassDescriptor = static_cast<CCMTLRenderPass *>(renderPass)->getMTLRenderPassDescriptor();

    for (size_t slot = 0; slot < colors.size(); slot++) {
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
}

void CCMTLCommandBuffer::bindBindingLayout(BindingLayout *layout) {
    const auto *bindingLayout = static_cast<CCMTLBindingLayout *>(layout);

    for (const auto &binding : bindingLayout->getBindingUnits()) {
        if (binding.buffer)
            static_cast<CCMTLBuffer *>(binding.buffer)->encodeBuffer(_mtlEncoder, 0, binding.binding, binding.shaderStages);

        if (binding.shaderStages & ShaderType::VERTEX) {
            if (binding.texture)
                [_mtlEncoder setVertexTexture:static_cast<CCMTLTexture *>(binding.texture)->getMTLTexture()
                                      atIndex:binding.binding];

            if (binding.sampler)
                [_mtlEncoder setVertexSamplerState:static_cast<CCMTLSampler *>(binding.sampler)->getMTLSamplerState()
                                           atIndex:_gpuPipelineState->vertexSamplerBinding.at(binding.binding)];
        }

        if (binding.shaderStages & ShaderType::FRAGMENT) {
            if (binding.sampler && binding.texture) {
#if COCOS2D_DEBUG > 0
                if (_gpuPipelineState->fragmentSamplerBinding.find(binding.binding) == _gpuPipelineState->fragmentSamplerBinding.end()) {
                    CC_LOG_WARNING("%s(binding = %d) not used in shader.", binding.name.c_str(), binding.binding);
                    continue;
                }
#endif
                [_mtlEncoder setFragmentTexture:static_cast<CCMTLTexture *>(binding.texture)->getMTLTexture()
                                        atIndex:binding.binding];

                [_mtlEncoder setFragmentSamplerState:static_cast<CCMTLSampler *>(binding.sampler)->getMTLSamplerState()
                                             atIndex:_gpuPipelineState->fragmentSamplerBinding.at(binding.binding)];
            }
        }
    }
}

void CCMTLCommandBuffer::bindInputAssembler(InputAssembler *ia) {
    if (ia) {
        const auto mtlInputAssembler = static_cast<CCMTLInputAssembler *>(ia);
        if (mtlInputAssembler->getIndexBuffer()) {
            _gpuIndexBuffer.mtlBuffer = static_cast<CCMTLBuffer *>(mtlInputAssembler->getIndexBuffer())->getMTLBuffer();
            _gpuIndexBuffer.stride = mtlInputAssembler->getIndexBuffer()->getStride();
            _indexType = static_cast<CCMTLBuffer *>(mtlInputAssembler->getIndexBuffer())->getIndexType();
        }

        if (mtlInputAssembler->getIndirectBuffer()) {
            _gpuIndirectBuffer.mtlBuffer = static_cast<CCMTLBuffer *>(mtlInputAssembler->getIndirectBuffer())->getMTLBuffer();
            _gpuIndirectBuffer.count = mtlInputAssembler->getIndirectBuffer()->getCount();
        }
        auto &vertexBuffers = mtlInputAssembler->getVertexBuffers();
        for (const auto &bindingInfo : _gpuPipelineState->vertexBufferBindingInfo) {
            auto index = std::get<0>(bindingInfo);
            auto stream = std::get<1>(bindingInfo);
            static_cast<CCMTLBuffer *>(vertexBuffers[stream])->encodeBuffer(_mtlEncoder, 0, index, ShaderType::VERTEX);
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

void CCMTLCommandBuffer::copyBuffersToTexture(const BufferDataList &buffers, Texture *texture, const BufferTextureCopyList &regions) {
    if ((_type == CommandBufferType::PRIMARY) ||
        (_type == CommandBufferType::SECONDARY)) {
        if (texture) {
            static_cast<CCMTLTexture *>(texture)->update(buffers.data(), regions);
        } else {
            CC_LOG_ERROR("CCMTLCommandBuffer::copyBufferToTexture: texture is nullptr");
        }
    } else {
        CC_LOG_ERROR("CCMTLCommandBuffer::copyBufferToTexture: invalid command buffer type %d.", _type);
    }
}

void CCMTLCommandBuffer::execute(const CommandBufferList &commandBuffs, uint32_t count) {
    for (uint i = 0; i < count; ++i) {
        auto commandBuffer = static_cast<CCMTLCommandBuffer *>(commandBuffs[i]);
        _numDrawCalls += commandBuffer->_numDrawCalls;
        _numInstances += commandBuffer->_numInstances;
        _numTriangles += commandBuffer->_numTriangles;
    }
}

} // namespace gfx
} // namespace cc
