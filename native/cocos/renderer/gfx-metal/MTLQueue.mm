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

#import <Metal/MTLDevice.h>
#import <MetalKit/MTKView.h>

NS_CC_BEGIN

CCMTLQueue::CCMTLQueue(GFXDevice* device) : GFXQueue(device) {}

CCMTLQueue::~CCMTLQueue()
{
    destroy();
}

bool CCMTLQueue::initialize(const GFXQueueInfo &info)
{
    MTKView* mtkView = (MTKView*)((CCMTLDevice*)_device)->getMTKView();
    _metalQueue = [mtkView.device newCommandQueue];
    _type = info.type;
    
    return _metalQueue != nil;
}

void CCMTLQueue::destroy()
{
    if (_metalQueue)
    {
        [_metalQueue release];
        _metalQueue = nil;
    }
}

void CCMTLQueue::submit(GFXCommandBuffer** cmd_buffs, uint count)
{
    NSAutoreleasePool* autoReleasePool = [[NSAutoreleasePool alloc] init];
    
    for (uint i = 0; i < count; ++i)
        executeCommands(static_cast<CCMTLCommandBuffer*>(cmd_buffs[i])->getCommandPackage() );
    
    [autoReleasePool release];
}

void CCMTLQueue::executeCommands(const CCMTLCommandPackage* commandPackage)
{
    static uint commandIndices[(int)GFXCmdType::COUNT] = {0};
    
    auto commandSize = commandPackage->commandTypes.size();
    if (commandSize == 0)
        return;
    
    memset(commandIndices, 0, sizeof(commandIndices));
    
    id<MTLCommandBuffer> mtlCommandBuffer = [_metalQueue commandBuffer];
    [mtlCommandBuffer enqueue];
    id<MTLRenderCommandEncoder> encoder;
    MTKView* mtkView = (MTKView*)((CCMTLDevice*)_device)->getMTKView();
    GFXCmdType commandType;
    CCMTLCmdBeginRenderPass* cmdBeginRenderPass = nullptr;
    CCMTLGPUPipelineState* gpuPipelineState = nullptr;
    CCMTLInputAssembler* inputAssembler = nullptr;
    CCMTLGPUInputAssembler* gpuInputAssembler = nullptr;
    MTLPrimitiveType primitiveType;
    
    for (uint i = 0; i < commandSize; ++i) {
        commandType = commandPackage->commandTypes[i];
        uint& cmdIdx = commandIndices[(int)commandType];
        
        switch (commandType) {
            case GFXCmdType::BEGIN_RENDER_PASS: {
                cmdBeginRenderPass = commandPackage->beginRenderPassCmds[cmdIdx++];
                
                MTLRenderPassDescriptor* mtlRenderPassDescriptor;
                if (!cmdBeginRenderPass->frameBuffer->isOffscreen() )
                    mtlRenderPassDescriptor = mtkView.currentRenderPassDescriptor;
                else
                    mtlRenderPassDescriptor = static_cast<CCMTLRenderPass*>(cmdBeginRenderPass->frameBuffer->renderPass() )->getMTLRenderPassDescriptor();
                
                if (cmdBeginRenderPass->clearFlags & GFXClearFlagBit::COLOR)
                    mtlRenderPassDescriptor.colorAttachments[0].clearColor = mu::toMTLClearColor(cmdBeginRenderPass->clearColors[0]);
                if (cmdBeginRenderPass->clearFlags & GFXClearFlagBit::DEPTH)
                    mtlRenderPassDescriptor.depthAttachment.clearDepth = cmdBeginRenderPass->clearDepth;
                if (cmdBeginRenderPass->clearFlags & GFXClearFlagBit::STENCIL)
                    mtlRenderPassDescriptor.stencilAttachment.clearStencil = cmdBeginRenderPass->clearStencil;
                
                encoder = [mtlCommandBuffer renderCommandEncoderWithDescriptor:mtlRenderPassDescriptor];
                
                break;
            }
            case GFXCmdType::END_RENDER_PASS:
                [encoder endEncoding];
                break;
                
            case GFXCmdType::BIND_STATES: {
                auto cmd = commandPackage->bindStatesCmds[cmdIdx++];
                if (cmd->gpuPipelineState)
                {
                    gpuPipelineState = cmd->gpuPipelineState;
                    
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
                
                // bind vertex buffer
                inputAssembler = cmd->inputAssembler;
                if (inputAssembler)
                {
                    gpuInputAssembler = inputAssembler->getGPUInputAssembler();
                    [encoder setVertexBuffer:gpuInputAssembler->mtlVertexBufers[0]
                                      offset:0
                                     atIndex:30];
                }
                
                break;
            }
            case GFXCmdType::DRAW:
            {
                CCMTLCmdDraw* cmd = commandPackage->drawCmds[cmdIdx++];
                if (inputAssembler && gpuPipelineState)
                {
                    if (!gpuInputAssembler->mtlIndirectBuffer)
                    {
                        if (gpuInputAssembler->mtlIndexBuffer && cmd->drawInfo.index_count >= 0)
                        {
                            uint8_t* offset = 0;
                            offset += cmd->drawInfo.first_index * inputAssembler->indexBuffer()->stride();
                            if (cmd->drawInfo.instance_count == 0)
                            {
                                [encoder drawIndexedPrimitives:primitiveType
                                                    indexCount:cmd->drawInfo.index_count
                                                     // TODO: remove static_cast<>.
                                                     indexType:static_cast<CCMTLBuffer*>(inputAssembler->indexBuffer() )->getIndexType()
                                                   indexBuffer:gpuInputAssembler->mtlIndexBuffer
                                             indexBufferOffset:0];
                            }
                            else
                            {
                                
                            }
                        }
                        else
                        {
                            if (cmd->drawInfo.instance_count == 0)
                            {
                                [encoder drawPrimitives:primitiveType
                                            vertexStart:cmd->drawInfo.first_index
                                            vertexCount:cmd->drawInfo.vertex_count];
                            }
                            else
                            {
                                [encoder drawPrimitives:primitiveType
                                            vertexStart:cmd->drawInfo.first_index
                                            vertexCount:cmd->drawInfo.vertex_count
                                          instanceCount:cmd->drawInfo.instance_count];
                            }
                        }
                    }
                    else
                    {
                        //TODO: handle indirect buffers.
                    }
                }
                break;
            }
            
            default:
                break;
        }
    }
    
    [mtlCommandBuffer presentDrawable:mtkView.currentDrawable];
    [mtlCommandBuffer commit];
}

NS_CC_END

