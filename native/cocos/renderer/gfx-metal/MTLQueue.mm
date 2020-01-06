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
    Destroy();
}

bool CCMTLQueue::Initialize(const GFXQueueInfo &info)
{
    MTKView* mtkView = (MTKView*)((CCMTLDevice*)device_)->getMTKView();
    _metalQueue = [mtkView.device newCommandQueue];
    type_ = info.type;
    
    return _metalQueue != nil;
}

void CCMTLQueue::Destroy()
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
    {
        executeCommands(static_cast<CCMTLCommandBuffer*>(cmd_buffs[i])->getCommandPackage() );
    }
    
    [autoReleasePool release];
}

void CCMTLQueue::executeCommands(const CCMTLCommandPackage* commandPackage)
{
    static uint commandIndices[(int)GFXCmdType::COUNT] = {0};
    
    auto commandSize = commandPackage->commandTypes.Size();
    if (commandSize == 0)
        return;
    
    memset(commandIndices, 0, sizeof(commandIndices));
    
    id<MTLCommandBuffer> mtlCommandBuffer = [_metalQueue commandBuffer];
    [mtlCommandBuffer enqueue];
    id<MTLRenderCommandEncoder> encoder;
    MTKView* mtkView = (MTKView*)((CCMTLDevice*)device_)->getMTKView();
    GFXCmdType commandType;
    CCMTLCmdBeginRenderPass* cmdBeginRenderPass = nullptr;
    CCMTLGPUPipelineState* gpuPipelineState = nullptr;
    CCMTLInputAssembler* inputAssembler = nullptr;
    MTLPrimitiveType primitiveType;
    
    for (uint i = 0; i < commandSize; ++i) {
        commandType = commandPackage->commandTypes[i];
        uint& cmdIdx = commandIndices[(int)commandType];
        
        switch (commandType) {
            case GFXCmdType::BEGIN_RENDER_PASS: {
                cmdBeginRenderPass = commandPackage->beginRenderPassCmds[cmdIdx++];
                
                MTLRenderPassDescriptor* mtlRenderPassDescriptor;
                if (!cmdBeginRenderPass->frameBuffer->is_offscreen() )
                {
                    mtlRenderPassDescriptor = mtkView.currentRenderPassDescriptor;
                    mtlRenderPassDescriptor.colorAttachments[0].clearColor = mu::toMTLClearColor(cmdBeginRenderPass->clearColors[0]);
                    mtlRenderPassDescriptor.depthAttachment.clearDepth = cmdBeginRenderPass->clearDepth;
                    mtlRenderPassDescriptor.stencilAttachment.clearStencil = cmdBeginRenderPass->clearStencil;
                }
                else
                {
                    //TODO
                }
                
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
                    
                    primitiveType = gpuPipelineState->primitiveType;
                }
                
                if (cmd->viewportDirty) [encoder setViewport:cmd->viewport];
                if (cmd->scissorDirty) [encoder setScissorRect:cmd->scissorRect];
                
                // bind vertex buffer
                //TODO: collect gpub buffers information in CCMTLInputAssembler.
                // And how to support multiple verte buffers?
                inputAssembler = cmd->inputAssembler;
                if (inputAssembler)
                {
                    CCMTLBuffer* buffer = static_cast<CCMTLBuffer*>(inputAssembler->vertex_buffers()[0]);
                    [encoder setVertexBuffer:buffer->getMTLBuffer()
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
                    if (!inputAssembler->indirect_buffer() )
                    {
                        if (inputAssembler->index_buffer() && cmd->drawInfo.index_count >= 0)
                        {
                            uint8_t* offset = 0;
                            offset += cmd->drawInfo.first_index * inputAssembler->index_buffer()->stride();
                            if (cmd->drawInfo.instance_count == 0)
                            {
                                // TODO: translate index type
                                [encoder drawIndexedPrimitives:primitiveType
                                                    indexCount:cmd->drawInfo.index_count
                                                     indexType:MTLIndexTypeUInt32
                                                   indexBuffer:nil
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

