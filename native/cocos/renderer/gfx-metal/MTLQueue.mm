#include "MTLStd.h"
#include "MTLQueue.h"
#include "MTLDevice.h"
#include "MTLCommandBuffer.h"
#include "MTLCommands.h"
#include "MTLFrameBuffer.h"
#include "MTLRenderPass.h"
#include "MTLStateCache.h"
#include "MTLUtils.h"

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
    id<MTLCommandEncoder> encoder;
    MTKView* mtkView = (MTKView*)((CCMTLDevice*)device_)->getMTKView();
    GFXCmdType commandType;
    CCMTLCmdBeginRenderPass* cmdBeginRenderPass = nullptr;
    CCMTLStateCache* cache = static_cast<CCMTLDevice*>(device_)->getStateCache();
    
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
            default:
                break;
        }
    }
    
    [mtlCommandBuffer presentDrawable:mtkView.currentDrawable];
    [mtlCommandBuffer commit];
}

NS_CC_END

