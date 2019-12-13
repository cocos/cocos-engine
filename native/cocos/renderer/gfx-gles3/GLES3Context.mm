#include "GLES3Std.h"
#include "GLES3Context.h"
#include "gles3w.h"

NS_CC_BEGIN

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)

#import <QuartzCore/CAEAGLLayer.h>
#import <UIKit/UIScreen.h>

bool GLES3Context::Initialize(const GFXContextInfo &info)
{
  
    vsync_mode_ = info.vsync_mode;
    window_handle_ = info.window_handle;

    //////////////////////////////////////////////////////////////////////////

    if (!info.shared_ctx)
    {
        is_primary_ctx_ = true;
        window_handle_ = info.window_handle;

        EAGLContext* eagl_context = [[EAGLContext alloc]initWithAPI:kEAGLRenderingAPIOpenGLES3];
        if (!eagl_context)
        {
          CC_LOG_ERROR("Create EAGL context failed.");
          return false;
        }

        eagl_context_ = (intptr_t)eagl_context;
        eagl_shared_ctx_ = (intptr_t)eagl_context;

        if (!gles3wInit())
        {
          return false;
        }
    }
    else
    {
        GLES3Context* shared_ctx = (GLES3Context*)info.shared_ctx;
        EAGLContext* eagl_shared_context = (EAGLContext*)shared_ctx->eagl_shared_ctx();
        EAGLContext* eagl_context = [[EAGLContext alloc] initWithAPI: [eagl_shared_context API] sharegroup: [eagl_shared_context sharegroup]];
        if (!eagl_context)
        {
          CC_LOG_ERROR("Create EGL context with share context [0x%p] failed.", eagl_shared_context);
          
          eagl_context_ = (intptr_t)eagl_context;
          eagl_shared_ctx_ = (intptr_t)eagl_shared_context;
          
          return false;
        }
    }
    color_fmt_ = GFXFormat::RGBA8;
    depth_stencil_fmt_ = GFXFormat::D24S8;

    if (!MakeCurrent())
        return false;

    return createCustomFrameBuffer();
}

bool GLES3Context::createCustomFrameBuffer()
{
    glGenFramebuffers(1, &_defaultFBO);
    if (0 == _defaultFBO)
    {
        CC_LOG_ERROR("Can not create default frame buffer");
        glDeleteFramebuffers(1,&_defaultFBO);
        return false;
    }
    
    glGenRenderbuffers(1, &_defaultColorBuffer);
    if (0 == _defaultColorBuffer)
    {
        CC_LOG_ERROR("Can not create default color buffer");
        return false;
    }
    glBindRenderbuffer(GL_RENDERBUFFER, _defaultColorBuffer);
    CAEAGLLayer* eaglLayer = (CAEAGLLayer*)( ((UIView*)(window_handle_)).layer);
    if (! [(EAGLContext*)eagl_context_ renderbufferStorage:GL_RENDERBUFFER
                                              fromDrawable:eaglLayer])
    {
        CC_LOG_ERROR("Attaches EAGLDrawable as storage for the OpenGL ES renderbuffer object failed.");
        glBindRenderbuffer(GL_RENDERBUFFER, 0);
        glDeleteRenderbuffers(1, &_defaultColorBuffer);
        return false;
    }
    glBindFramebuffer(GL_FRAMEBUFFER, _defaultFBO);
    glBindRenderbuffer(GL_RENDERBUFFER, _defaultColorBuffer);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER, _defaultColorBuffer);
    
    //FIXME: if use depth/stencil buffer, then wrong effect.
    //    glGenRenderbuffers(1, &_defaultDepthStencilBuffer);
    //    if (_defaultDepthStencilBuffer != 0)
    //    {
    //        // Application can run without depth/stencil buffer, so don't return false here.
    //        glBindRenderbuffer(GL_RENDERBUFFER, _defaultDepthStencilBuffer);
    //        glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, _defaultDepthStencilBuffer);
    //        glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, _defaultDepthStencilBuffer);
    //    }
    //    else
    //        CC_LOG_ERROR("Can not create default depth/stencil buffer");
    
    return true;
}

void GLES3Context::destroyCustomFrameBuffer()
{
    if (_defaultColorBuffer)
    {
        glDeleteRenderbuffers(1, &_defaultColorBuffer);
        _defaultColorBuffer = 0;
    }
    if (_defaultDepthStencilBuffer)
    {
        glDeleteRenderbuffers(1, &_defaultDepthStencilBuffer);
        _defaultDepthStencilBuffer = 0;
    }
    
    if (_defaultFBO)
    {
        glDeleteFramebuffers(1, &_defaultFBO);
        _defaultFBO = 0;
    }
}

void GLES3Context::Destroy()
{
    destroyCustomFrameBuffer();
    
    if (eagl_context_)
    {
        [(EAGLContext*)eagl_context_ release];
    }

    is_primary_ctx_ = false;
    window_handle_ = 0;
    vsync_mode_ = GFXVsyncMode::OFF;
    is_initialized = false;
}

void GLES3Context::Present()
{
  
    if (! [(EAGLContext*)eagl_context_ presentRenderbuffer:GL_RENDERBUFFER] )
    {
        CC_LOG_ERROR("Failed to present content.");
    }
}

bool GLES3Context::MakeCurrentImpl()
{
  return [EAGLContext setCurrentContext:(EAGLContext*)eagl_context_];
}

#endif

NS_CC_END
