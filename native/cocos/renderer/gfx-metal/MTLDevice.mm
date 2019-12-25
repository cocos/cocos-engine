#include "MTLStd.h"
#include "MTLDevice.h"
#include "MTLQueue.h"
#include "MTLBuffer.h"
#include "MTLCommandBuffer.h"
#include "MTLCommandAllocator.h"
#include "MTLWindow.h"
#include "MTLRenderPass.h"
#include "MTLFrameBuffer.h"
#include "MTLStateCache.h"

#import <MetalKit/MTKView.h>

NS_CC_BEGIN

CCMTLDevice::CCMTLDevice()
{
    
}

CCMTLDevice::~CCMTLDevice()
{
    
}

bool CCMTLDevice::Initialize(const GFXDeviceInfo& info)
{
    api_ = GFXAPI::METAL;
    width_ = info.width;
    height_ = info.height;
    native_width_ = info.native_width;
    native_height_ = info.native_height;
    window_handle_ = info.window_handle;
    
    _stateCache = CC_NEW(CCMTLStateCache);
    
    _mtkView = (MTKView*)window_handle_;
    
    GFXWindowInfo window_info;
    window_info.is_offscreen = false;
    window_ = CreateGFXWindow(window_info);
    
    GFXQueueInfo queue_info;
    queue_info.type = GFXQueueType::GRAPHICS;
    queue_ = CreateGFXQueue(queue_info);
    
    GFXCommandAllocatorInfo cmd_alloc_info;
    cmd_allocator_ = CreateGFXCommandAllocator(cmd_alloc_info);
    
    return true;
}

void CCMTLDevice::Destroy()
{
    CC_SAFE_DELETE(_stateCache);
}

void CCMTLDevice::Resize(uint width, uint height)
{
    
}

void CCMTLDevice::Present()
{
    
}

GFXWindow* CCMTLDevice::CreateGFXWindow(const GFXWindowInfo& info)
{
    auto window = CC_NEW(CCMTLWindow(this) );
    if (window && window->Initialize(info) )
        return window;
    
    CC_SAFE_DESTROY(window);
    return nullptr;
}

GFXQueue* CCMTLDevice::CreateGFXQueue(const GFXQueueInfo& info)
{
    auto queue = CC_NEW(CCMTLQueue(this) );
    if (queue && queue->Initialize(info) )
        return queue;
    
    CC_SAFE_DESTROY(queue);
    return nullptr;
}

GFXCommandAllocator* CCMTLDevice::CreateGFXCommandAllocator(const GFXCommandAllocatorInfo& info)
{
    auto allocator = CC_NEW(CCMTLCommandAllocator(this) );
    if (allocator && allocator->Initialize(info) )
        return allocator;
    
    CC_SAFE_DESTROY(allocator);
    return nullptr;
}

GFXCommandBuffer* CCMTLDevice::CreateGFXCommandBuffer(const GFXCommandBufferInfo& info)
{
    auto commandBuffer = CC_NEW(CCMTLCommandBuffer(this) );
    if (commandBuffer && commandBuffer->Initialize(info) )
        return commandBuffer;
    
    CC_SAFE_DESTROY(commandBuffer);
    return nullptr;
}

GFXBuffer* CCMTLDevice::CreateGFXBuffer(const GFXBufferInfo& info)
{
    auto buffer = CC_NEW(CCMTLBuffer(this) );
    if (buffer && buffer->Initialize(info) )
        return buffer;
        
    CC_SAFE_DESTROY(buffer);
    return nullptr;
}

GFXTexture* CCMTLDevice::CreateGFXTexture(const GFXTextureInfo& info)
{
    
}

GFXTextureView* CCMTLDevice::CreateGFXTextureView(const GFXTextureViewInfo& info)
{
    
}

GFXSampler* CCMTLDevice::CreateGFXSampler(const GFXSamplerInfo& info)
{
    
}

GFXShader* CCMTLDevice::CreateGFXShader(const GFXShaderInfo& info)
{
    
}

GFXInputAssembler* CCMTLDevice::CreateGFXInputAssembler(const GFXInputAssemblerInfo& info)
{
    
}

GFXRenderPass* CCMTLDevice::CreateGFXRenderPass(const GFXRenderPassInfo& info)
{
    auto renderPass = CC_NEW(CCMTLRenderPass(this) );
    if (renderPass && renderPass->Initialize(info) )
        return renderPass;
    
    CC_SAFE_DESTROY(renderPass);
    return nullptr;
}

GFXFramebuffer* CCMTLDevice::CreateGFXFramebuffer(const GFXFramebufferInfo& info)
{
    auto frameBuffer = CC_NEW(CCMTLFrameBuffer(this) );
    if (frameBuffer && frameBuffer->Initialize(info) )
        return frameBuffer;
    
    CC_SAFE_DESTROY(frameBuffer);
    return nullptr;
}

GFXBindingLayout* CCMTLDevice::CreateGFXBindingLayout(const GFXBindingLayoutInfo& info)
{
    
}

GFXPipelineState* CCMTLDevice::CreateGFXPipelineState(const GFXPipelineStateInfo& info)
{
    
}

GFXPipelineLayout* CCMTLDevice::CreateGFXPipelieLayout(const GFXPipelineLayoutInfo& info)
{
    
}

void CCMTLDevice::CopyBuffersToTexture(GFXBuffer* src, GFXTexture* dst, const GFXBufferTextureCopyList& regions)
{
    
}

NS_CC_END
