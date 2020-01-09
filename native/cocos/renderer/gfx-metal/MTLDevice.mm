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
#include "MTLInputAssembler.h"
#include "MTLBindingLayout.h"
#include "MTLPipelineLayout.h"
#include "MTLPipelineState.h"
#include "MTLShader.h"
#include "MTLTexture.h"
#include "MTLTextureView.h"
#include "MTLSampler.h"

#import <MetalKit/MTKView.h>

NS_CC_BEGIN

CCMTLDevice::CCMTLDevice() {}
CCMTLDevice::~CCMTLDevice() {}

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
    _mtlDevice = ((MTKView*)_mtkView).device;
    
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
    auto texture = CC_NEW(CCMTLTexture(this) );
    if (texture && texture->Initialize(info) )
        return texture;
    
    CC_SAFE_DESTROY(texture);
    return nullptr;
}

GFXTextureView* CCMTLDevice::CreateGFXTextureView(const GFXTextureViewInfo& info)
{
    auto textureView = CC_NEW(CCMTLTextureView(this) );
    if (textureView && textureView->Initialize(info) )
        return textureView;
    
    CC_SAFE_DESTROY(textureView);
    return nullptr;
}

GFXSampler* CCMTLDevice::CreateGFXSampler(const GFXSamplerInfo& info)
{
    auto sampler = CC_NEW(CCMTLSampler(this) );
    if (sampler && sampler->Initialize(info) )
        return sampler;
    
    CC_SAFE_DESTROY(sampler);
    return sampler;
}

GFXShader* CCMTLDevice::CreateGFXShader(const GFXShaderInfo& info)
{
    auto shader = CC_NEW(CCMTLShader(this) );
    if (shader && shader->Initialize(info) )
        return shader;
    
    CC_SAFE_DESTROY(shader);
    return shader;
}

GFXInputAssembler* CCMTLDevice::CreateGFXInputAssembler(const GFXInputAssemblerInfo& info)
{
    auto ia = CC_NEW(CCMTLInputAssembler(this) );
    if (ia && ia->Initialize(info) )
        return ia;
    
    CC_SAFE_DESTROY(ia);
    return nullptr;
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
    auto bl = CC_NEW(CCMTLBindingLayout(this) );
    if (bl && bl->Initialize(info) )
        return bl;
    
    CC_SAFE_DESTROY(bl);
    return nullptr;
}

GFXPipelineState* CCMTLDevice::CreateGFXPipelineState(const GFXPipelineStateInfo& info)
{
    auto ps = CC_NEW(CCMTLPipelineState(this) );
    if (ps && ps->Initialize(info) )
        return ps;
    
    CC_SAFE_DESTROY(ps);
    return nullptr;
}

GFXPipelineLayout* CCMTLDevice::CreateGFXPipelieLayout(const GFXPipelineLayoutInfo& info)
{
    auto pl = CC_NEW(CCMTLPipelineLayout(this) );
    if (pl && pl->Initialize(info) )
        return pl;
    
    CC_SAFE_DESTROY(pl);
    return nullptr;
}

void CCMTLDevice::CopyBuffersToTexture(GFXBuffer* src, GFXTexture* dst, const GFXBufferTextureCopyList& regions)
{
    static_cast<CCMTLTexture*>(dst)->update(static_cast<CCMTLBuffer*>(src)->getTransferBuffer(), regions[0]);
}

NS_CC_END
