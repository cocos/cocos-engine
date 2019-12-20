#include "MTLStd.h"
#include "MTLDevice.h"
#include "MTLQueue.h"
#include "MTLBuffer.h"

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
    
    _metalDevice = ((MTKView*)window_handle_).device;
    
    return true;
}

void CCMTLDevice::Destroy()
{
    _metalDevice = nullptr;
}

void CCMTLDevice::Resize(uint width, uint height)
{
    
}

void CCMTLDevice::Present()
{
    
}

GFXWindow* CCMTLDevice::CreateGFXWindow(const GFXWindowInfo& info)
{

}

GFXQueue* CCMTLDevice::CreateGFXQueue(const GFXQueueInfo& info)
{
    GFXQueue* queue = CC_NEW(CCMTLQueue(this) );
    if (queue)
    {
        if (! queue->Initialize(info))
            CC_SAFE_DESTROY(queue);
    }
    
    return queue;
}

GFXCommandAllocator* CCMTLDevice::CreateGFXCommandAllocator(const GFXCommandAllocatorInfo& info)
{
    
}

GFXCommandBuffer* CCMTLDevice::CreateGFXCommandBuffer(const GFXCommandBufferInfo& info)
{
}

GFXBuffer* CCMTLDevice::CreateGFXBuffer(const GFXBufferInfo& info)
{
    GFXBuffer* buffer = CC_NEW(CCMTLBuffer(this) );
    if (buffer)
    {
        if (!buffer->Initialize(info))
            CC_SAFE_DESTROY(buffer);
    }
    return buffer;
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
    
}

GFXFramebuffer* CCMTLDevice::CreateGFXFramebuffer(const GFXFramebufferInfo& info)
{
    
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

NS_CC_END
