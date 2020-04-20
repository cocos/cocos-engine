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
#include "MTLPipelineState.h"
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
    id<MTLBuffer> mtlIndirectBuffer = nil;
    MTLPrimitiveType primitiveType;
    
    for (uint i = 0; i < commandSize; ++i) {
        commandType = commandPackage->commandTypes[i];
        uint& cmdIdx = commandIndices[(int)commandType];
        
        switch (commandType) {
            case GFXCmdType::BEGIN_RENDER_PASS: {
                cmdBeginRenderPass = commandPackage->beginRenderPassCmds[cmdIdx++];
                
                MTLRenderPassDescriptor* mtlRenderPassDescriptor;
                if (!cmdBeginRenderPass->frameBuffer->isOffscreen() )
                    mtlRenderPassDescriptor = _mtkView.currentRenderPassDescriptor;
                else
                    mtlRenderPassDescriptor = static_cast<CCMTLRenderPass*>(cmdBeginRenderPass->frameBuffer->getRenderPass() )->getMTLRenderPassDescriptor();
                                
                if (cmdBeginRenderPass->clearFlags & GFXClearFlagBit::COLOR)
                {
                    mtlRenderPassDescriptor.colorAttachments[0].clearColor = mu::toMTLClearColor(cmdBeginRenderPass->clearColors[0]);
                    mtlRenderPassDescriptor.colorAttachments[0].loadAction = MTLLoadActionClear;
                }
                else
                    mtlRenderPassDescriptor.colorAttachments[0].loadAction = MTLLoadActionLoad;
                
                mtlRenderPassDescriptor.colorAttachments[0].storeAction = MTLStoreActionStore;

                
                if (cmdBeginRenderPass->clearFlags & GFXClearFlagBit::DEPTH)
                {
                    mtlRenderPassDescriptor.depthAttachment.clearDepth = cmdBeginRenderPass->clearDepth;
                    mtlRenderPassDescriptor.depthAttachment.loadAction = MTLLoadActionClear;
                }
                else
                    mtlRenderPassDescriptor.depthAttachment.loadAction = MTLLoadActionLoad;
                
                mtlRenderPassDescriptor.depthAttachment.storeAction = MTLStoreActionStore;
                
                if (cmdBeginRenderPass->clearFlags & GFXClearFlagBit::STENCIL)
                {
                    mtlRenderPassDescriptor.stencilAttachment.clearStencil = cmdBeginRenderPass->clearStencil;
                    mtlRenderPassDescriptor.stencilAttachment.loadAction = MTLLoadActionClear;
                }
                else
                    mtlRenderPassDescriptor.stencilAttachment.loadAction = MTLLoadActionLoad;
                
                mtlRenderPassDescriptor.stencilAttachment.storeAction = MTLStoreActionStore;
                
                encoder = [mtlCommandBuffer renderCommandEncoderWithDescriptor:mtlRenderPassDescriptor];
                
                break;
            }
            case GFXCmdType::END_RENDER_PASS:
                [encoder endEncoding];
                break;
                
            case GFXCmdType::BIND_STATES: {
                auto cmd = commandPackage->bindStatesCmds[cmdIdx++];
                //TODO coulsonwang, update when bindingLayout is dirty
                cmd->pipelineState->updateBindingBlocks(cmd->bindingLayout);
                if (cmd->pipelineState->getGPUPipelineState())
                {
                    gpuPipelineState = cmd->pipelineState->getGPUPipelineState();
                    
                    [encoder setCullMode:gpuPipelineState->cullMode];
                    [encoder setFrontFacingWinding:gpuPipelineState->winding];
                    [encoder setDepthClipMode:gpuPipelineState->depthClipMode];
                    [encoder setTriangleFillMode:gpuPipelineState->fillMode];
                    [encoder setRenderPipelineState:gpuPipelineState->mtlRenderPipelineState];
                    [encoder setStencilFrontReferenceValue:gpuPipelineState->stencilRefFront
                                        backReferenceValue:gpuPipelineState->stencilRefBack];
                    if (gpuPipelineState->mtlDepthStencilState)
                        [encoder setDepthStencilState:gpuPipelineState->mtlDepthStencilState];
                    
                    for (const auto& block : *(gpuPipelineState->vertexUniformBlocks) )
                        [encoder setVertexBuffer:block.buffer offset:0 atIndex:block.mtlBinding];
                    
                    for (const auto& block : *(gpuPipelineState->fragmentUniformBlocks) )
                        [encoder setFragmentBuffer:block.buffer offset:0 atIndex:block.mtlBinding];
                    
                    for (const auto& texture : *(gpuPipelineState->vertexTextureList) )
                        [encoder setVertexTexture:texture.texture atIndex:texture.mtlBinding];
                    
                    for (const auto& texture : *(gpuPipelineState->fragmentTextureList) )
                         [encoder setFragmentTexture:texture.texture atIndex:texture.mtlBinding];
                    
                    for (const auto& sampler : *(gpuPipelineState->vertexSampleStateList) )
                        [encoder setVertexSamplerState:sampler.samplerState atIndex:sampler.mtlBinding];
                    
                    for (const auto& sampler : *(gpuPipelineState->fragmentSampleStateList) )
                        [encoder setFragmentSamplerState:sampler.samplerState atIndex:sampler.mtlBinding];
                    
                    primitiveType = gpuPipelineState->primitiveType;
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
                    
                    if (inputAssembler->_indirectBuffer)
                        mtlIndirectBuffer = static_cast<CCMTLBuffer*>(inputAssembler->_indirectBuffer)->getMTLBuffer();
                    
                    for(const auto& bindingInfo : gpuPipelineState->vertexBufferBindingInfo)
                    {
                        auto index = std::get<0>(bindingInfo);
                        auto stream = std::get<1>(bindingInfo);
                        id<MTLBuffer> vertexBuffer = static_cast<CCMTLBuffer*>(inputAssembler->_vertexBuffers[stream])->getMTLBuffer();
                        [encoder setVertexBuffer:vertexBuffer
                                          offset:0
                                         atIndex:index];
                    }
                }
                
                break;
            }
            case GFXCmdType::DRAW:
            {
                CCMTLCmdDraw* cmd = commandPackage->drawCmds[cmdIdx++];
                if (inputAssembler && gpuPipelineState)
                {
                    if (!mtlIndirectBuffer)
                    {
                        if (mtlIndexBuffer && cmd->drawInfo.indexCount >= 0)
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
                        //TODO: handle indirect buffers.
                        assert(false);
                    }
                }
                break;
            }
            
            default:
                break;
        }
    }
}

NS_CC_END

