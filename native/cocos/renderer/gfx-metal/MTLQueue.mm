#include "MTLStd.h"
#include "MTLQueue.h"
#include "MTLDevice.h"
#include "MTLCommandBuffer.h"
#include "MTLCommands.h"
#include "MTLFrameBuffer.h"
#include "MTLRenderPass.h"
#include "MTLStateCache.h"
#include "MTLUtils.h"
#include "MTLGPUObjects.h"
#include "MTLInputAssembler.h"
#include "MTLBuffer.h"
#include "MTLShader.h"
#include "MTLTexture.h"
#include "MTLPipelineState.h"
#include "MTLTextureView.h"
#include "MTLSampler.h"
#include "platform/mac/CCView.h"

#import <Metal/MTLDevice.h>

NS_CC_BEGIN

CCMTLQueue::CCMTLQueue(GFXDevice* device) : GFXQueue(device) {}

CCMTLQueue::~CCMTLQueue()
{
    destroy();
}

bool CCMTLQueue::initialize(const GFXQueueInfo &info)
{
    _type = info.type;
    _status = GFXStatus::SUCCESS;
    _frameBoundarySemaphore = dispatch_semaphore_create(1);
    _mtkView = (MTKView*)((CCMTLDevice*)_device)->getMTKView();
    
    return true;
}

void CCMTLQueue::destroy()
{
    _status = GFXStatus::UNREADY;
}

void CCMTLQueue::submit(const std::vector<GFXCommandBuffer*>& cmd_buffs)
{
    // Should remove USE_METAL aftr switch to use metal.
#ifdef USE_METAL
//    dispatch_semaphore_wait(_frameBoundarySemaphore, DISPATCH_TIME_FOREVER);
    
    uint count = static_cast<uint>(cmd_buffs.size());
    id<MTLCommandBuffer> mtlCommandBuffer = [static_cast<View*>(_mtkView).mtlCommandQueue commandBuffer];
    [mtlCommandBuffer enqueue];
    
    for (uint i = 0; i < count; ++i)
    {
        CCMTLCommandBuffer* commandBuff = static_cast<CCMTLCommandBuffer*>(cmd_buffs[i]);
        executeCommands(commandBuff->getCommandPackage(), mtlCommandBuffer);
        _numDrawCalls += commandBuff->_numDrawCalls;
        _numInstances += commandBuff->_numInstances;
        _numTriangles += commandBuff->_numTriangles;
    }
    
//    [mtlCommandBuffer addCompletedHandler:^(id<MTLCommandBuffer> commandBuffer) {
//        // GPU work is complete
//        // Signal the semaphore to start the CPU work
//        dispatch_semaphore_signal(_frameBoundarySemaphore);
//    }];
    [mtlCommandBuffer commit];
    
    //FIXME: use semaphore can not work, don't know why.
    [mtlCommandBuffer waitUntilCompleted];
#endif
}

void CCMTLQueue::executeCommands(const CCMTLCommandPackage* commandPackage, id<MTLCommandBuffer> mtlCommandBuffer)
{
    static uint commandIndices[(int)GFXCmdType::COUNT] = {0};
    
    auto commandSize = commandPackage->commandTypes.size();
    if (commandSize == 0)
        return;
    
    memset(commandIndices, 0, sizeof(commandIndices));
    
    id<MTLRenderCommandEncoder> encoder;
    GFXCmdType commandType;
    CCMTLCmdBeginRenderPass* cmdBeginRenderPass = nullptr;
    CCMTLGPUPipelineState* gpuPipelineState = nullptr;
    CCMTLInputAssembler* inputAssembler = nullptr;
    id<MTLBuffer> mtlIndexBuffer = nil;
    MTLPrimitiveType primitiveType;
    
    for (uint i = 0; i < commandSize; ++i) {
        commandType = commandPackage->commandTypes[i];
        uint& cmdIdx = commandIndices[(int)commandType];
        
        switch (commandType) {
            case GFXCmdType::BEGIN_RENDER_PASS: {
                cmdBeginRenderPass = commandPackage->beginRenderPassCmds[cmdIdx++];
                
                MTLRenderPassDescriptor* mtlRenderPassDescriptor;
                auto isOffscreen = cmdBeginRenderPass->frameBuffer->isOffscreen();
                if (isOffscreen)
                {
                    mtlRenderPassDescriptor = static_cast<CCMTLRenderPass*>(cmdBeginRenderPass->frameBuffer->getRenderPass())->getMTLRenderPassDescriptor();
                }
                else
                {
                    mtlRenderPassDescriptor = _mtkView.currentRenderPassDescriptor;
                }
                
                if (cmdBeginRenderPass->clearFlags & GFXClearFlagBit::COLOR)
                {
                    auto count = isOffscreen ? cmdBeginRenderPass->clearColors.size() : 1;
                    for(size_t slot = 0; slot < count; slot++)
                    {
                        mtlRenderPassDescriptor.colorAttachments[slot].clearColor = mu::toMTLClearColor(cmdBeginRenderPass->clearColors[i]);
                        mtlRenderPassDescriptor.colorAttachments[slot].loadAction = MTLLoadActionClear;
                    }
                }
                else
                {
                    auto count = isOffscreen ? static_cast<CCMTLRenderPass*>(cmdBeginRenderPass->frameBuffer->getRenderPass())->getColorRenderTargetNums() : 1;
                    for(size_t slot = 0; slot < count; slot ++)
                    {
                        mtlRenderPassDescriptor.colorAttachments[slot].loadAction = MTLLoadActionLoad;
                    }
                }
                
                if (cmdBeginRenderPass->clearFlags & GFXClearFlagBit::DEPTH)
                {
                    mtlRenderPassDescriptor.depthAttachment.clearDepth = cmdBeginRenderPass->clearDepth;
                    mtlRenderPassDescriptor.depthAttachment.loadAction = MTLLoadActionClear;
                }
                else
                    mtlRenderPassDescriptor.depthAttachment.loadAction = MTLLoadActionLoad;
                                
                if (cmdBeginRenderPass->clearFlags & GFXClearFlagBit::STENCIL)
                {
                    mtlRenderPassDescriptor.stencilAttachment.clearStencil = cmdBeginRenderPass->clearStencil;
                    mtlRenderPassDescriptor.stencilAttachment.loadAction = MTLLoadActionClear;
                }
                else
                    mtlRenderPassDescriptor.stencilAttachment.loadAction = MTLLoadActionLoad;
                                
                encoder = [mtlCommandBuffer renderCommandEncoderWithDescriptor:mtlRenderPassDescriptor];
                
                break;
            }
            case GFXCmdType::END_RENDER_PASS:
                [encoder endEncoding];
                break;
                
            case GFXCmdType::BIND_STATES: {
                auto cmd = commandPackage->bindStatesCmds[cmdIdx++];
                if (cmd->pipelineState->getGPUPipelineState())
                {
                    gpuPipelineState = cmd->pipelineState->getGPUPipelineState();
                    
                    [encoder setCullMode:gpuPipelineState->cullMode];
                    [encoder setFrontFacingWinding:gpuPipelineState->winding];
                    [encoder setDepthClipMode:gpuPipelineState->depthClipMode];
                    [encoder setTriangleFillMode:gpuPipelineState->fillMode];
                    [encoder setRenderPipelineState:gpuPipelineState->mtlRenderPipelineState];
                    
                    if (gpuPipelineState->mtlDepthStencilState)
                    {
                        [encoder setStencilFrontReferenceValue:gpuPipelineState->stencilRefFront
                                            backReferenceValue:gpuPipelineState->stencilRefBack];
                        [encoder setDepthStencilState:gpuPipelineState->mtlDepthStencilState];
                    }
                    primitiveType = gpuPipelineState->primitiveType;
                }
                
                const auto* shader = static_cast<CCMTLShader*>(cmd->pipelineState->getShader());
                const auto& vertexSamplerBindings = shader->getVertexSamplerBindings();
                const auto& fragmentSamplerBindings = shader->getFragmentSamplerBindings();
                
                for(const auto& binding : cmd->bindingLayout->getBindingUnits())
                {
                    if(binding.buffer)
                        static_cast<CCMTLBuffer*>(binding.buffer)->encodeBuffer(encoder, 0, binding.binding, binding.shaderStages);
                    
                    if(binding.shaderStages & GFXShaderType::VERTEX)
                    {
                        if(binding.texView)
                            [encoder setVertexTexture:static_cast<CCMTLTextureView*>(binding.texView)->getMTLTexture()
                                              atIndex:binding.binding];
                        
                        if(binding.sampler)
                            [encoder setVertexSamplerState:static_cast<CCMTLSampler*>(binding.sampler)->getMTLSamplerState()
                                                   atIndex:vertexSamplerBindings.at(binding.binding)];
                    }
                    
                    if(binding.shaderStages & GFXShaderType::FRAGMENT)
                    {
                        if(binding.texView)
                            [encoder setFragmentTexture:static_cast<CCMTLTextureView*>(binding.texView)->getMTLTexture()
                                              atIndex:binding.binding];
                        
                        if(binding.sampler)
                            [encoder setFragmentSamplerState:static_cast<CCMTLSampler*>(binding.sampler)->getMTLSamplerState()
                                                     atIndex:fragmentSamplerBindings.at(binding.binding)];
                    }
                }
                
                if (cmd->viewportDirty) [encoder setViewport:cmd->viewport];
                if (cmd->scissorDirty) [encoder setScissorRect:cmd->scissorRect];
                [encoder setDepthBias:cmd->depthBias.depthBias
                           slopeScale:cmd->depthBias.slopeScale
                                clamp:cmd->depthBias.clamp];
                
                // bind vertex buffer
                inputAssembler = cmd->inputAssembler;
                if (inputAssembler)
                {
                    if (inputAssembler->_indexBuffer)
                        mtlIndexBuffer = static_cast<CCMTLBuffer*>(inputAssembler->_indexBuffer)->getMTLBuffer();
                    
                    for(const auto& bindingInfo : gpuPipelineState->vertexBufferBindingInfo)
                    {
                        auto index = std::get<0>(bindingInfo);
                        auto stream = std::get<1>(bindingInfo);
                        static_cast<CCMTLBuffer*>(inputAssembler->_vertexBuffers[stream])->encodeBuffer(encoder, 0, index, GFXShaderType::VERTEX);
                    }
                }
                
                break;
            }
            case GFXCmdType::DRAW:
            {
                CCMTLCmdDraw* cmd = commandPackage->drawCmds[cmdIdx++];
                if (inputAssembler && gpuPipelineState)
                {
                    auto indirectBuffer = inputAssembler->getIndirectBuffer();
                    if (!indirectBuffer)
                    {
                        if (cmd->drawInfo.indexCount > 0)
                        {
                            NSUInteger offset = 0;
                            offset += cmd->drawInfo.firstIndex * inputAssembler->getIndexBuffer()->getStride();
                            if (cmd->drawInfo.instanceCount == 0)
                            {
                                [encoder drawIndexedPrimitives:primitiveType
                                                    indexCount:cmd->drawInfo.indexCount
                                                     // TODO: remove static_cast<>.
                                                     indexType:static_cast<CCMTLBuffer*>(inputAssembler->getIndexBuffer() )->getIndexType()
                                                   indexBuffer:mtlIndexBuffer
                                             indexBufferOffset:offset];
                            }
                            else
                            {
                                [encoder drawIndexedPrimitives:primitiveType
                                       indexCount:cmd->drawInfo.indexCount
                                        indexType:static_cast<CCMTLBuffer*>(inputAssembler->getIndexBuffer() )->getIndexType()
                                      indexBuffer:mtlIndexBuffer
                                indexBufferOffset:offset
                                    instanceCount:cmd->drawInfo.instanceCount];
                            }
                        }
                        else
                        {
                            if (cmd->drawInfo.instanceCount == 0)
                            {
                                [encoder drawPrimitives:primitiveType
                                            vertexStart:cmd->drawInfo.firstIndex
                                            vertexCount:cmd->drawInfo.vertexCount];
                            }
                            else
                            {
                                [encoder drawPrimitives:primitiveType
                                            vertexStart:cmd->drawInfo.firstIndex
                                            vertexCount:cmd->drawInfo.vertexCount
                                          instanceCount:cmd->drawInfo.instanceCount];
                            }
                        }
                    }
                    else
                    {
                        auto indirects = static_cast<CCMTLBuffer*>(indirectBuffer)->getIndirects();
                        for(size_t j = 0; j < indirects.size(); j++)
                        {
                            const auto& draw = indirects[j];
                            if(mtlIndexBuffer && draw.indexCount)
                            {
                                NSUInteger offset = 0;
                                offset += draw.firstIndex * inputAssembler->getIndexBuffer()->getStride();
                                if (cmd->drawInfo.instanceCount == 0)
                                {
                                    [encoder drawIndexedPrimitives:primitiveType
                                                        indexCount:draw.indexCount
                                                         // TODO: remove static_cast<>.
                                                         indexType:static_cast<CCMTLBuffer*>(inputAssembler->getIndexBuffer() )->getIndexType()
                                                       indexBuffer:mtlIndexBuffer
                                                 indexBufferOffset:offset];
                                }
                                else
                                {
                                    [encoder drawIndexedPrimitives:primitiveType
                                           indexCount:draw.indexCount
                                            indexType:static_cast<CCMTLBuffer*>(inputAssembler->getIndexBuffer() )->getIndexType()
                                          indexBuffer:mtlIndexBuffer
                                    indexBufferOffset:offset
                                        instanceCount:draw.instanceCount];
                                }
                            }
                            else
                            {
                                if (draw.instanceCount == 0)
                                {
                                    [encoder drawPrimitives:primitiveType
                                                vertexStart:draw.firstIndex
                                                vertexCount:draw.vertexCount];
                                }
                                else
                                {
                                    [encoder drawPrimitives:primitiveType
                                                vertexStart:draw.firstIndex
                                                vertexCount:draw.vertexCount
                                              instanceCount:draw.instanceCount];
                                }
                            }
                        }
                    }
                }
                break;
            }
            case GFXCmdType::UPDATE_BUFFER:
            {
                CCMTLCmdUpdateBuffer* cmd = commandPackage->updateBufferCmds[cmdIdx];
                cmd->gpuBuffer->update(cmd->buffer, cmd->offset, cmd->size);
            }
            case GFXCmdType::COPY_BUFFER_TO_TEXTURE:
            {
                CCMTLCmdCopyBufferToTexture* cmd = commandPackage->copyBufferToTextureCmds[cmdIdx];
                auto buffer = cmd->gpuBuffer->getBufferView();
                cmd->gpuTexture->update(&buffer, cmd->regions);
            }
            default:
                break;
        }
    }
}

NS_CC_END

