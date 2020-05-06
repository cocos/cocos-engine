#include "VKStd.h"
#include "VKContext.h"
#include "gles3w.h"
#import <QuartzCore/CAEAGLLayer.h>
#import <UIKit/UIScreen.h>

NS_CC_BEGIN

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)

bool VKContext::initialize(const GFXContextInfo &info)
{
  
    _vsyncMode = info.vsyncMode;
    _windowHandle = info.windowHandle;

    //////////////////////////////////////////////////////////////////////////

    if (!info.sharedCtx)
    {
        _isPrimaryContex = true;
        _windowHandle = info.windowHandle;
        
        CAEAGLLayer* eaglLayer = (CAEAGLLayer*)( ((UIView*)(_windowHandle)).layer);
        eaglLayer.opaque = TRUE;

        EAGLContext* eagl_context = [[EAGLContext alloc]initWithAPI:kEAGLRenderingAPIOpenVK];
        if (!eagl_context)
        {
          CC_LOG_ERROR("Create EAGL context failed.");
          return false;
        }

        _eaglContext = (intptr_t)eagl_context;
        _eaglSharedContext = (intptr_t)eagl_context;

        if (!VKwInit())
        {
          return false;
        }
    }
    else
    {
        VKContext* sharedCtx = (VKContext*)info.sharedCtx;
        EAGLContext* eagl_shared_context = (EAGLContext*)sharedCtx->eagl_shared_ctx();
        EAGLContext* eagl_context = [[EAGLContext alloc] initWithAPI: [eagl_shared_context API] sharegroup: [eagl_shared_context sharegroup]];
        if (!eagl_context)
        {
          CC_LOG_ERROR("Create EGL context with share context [0x%p] failed.", eagl_shared_context);
          
          _eaglContext = (intptr_t)eagl_context;
          _eaglSharedContext = (intptr_t)eagl_shared_context;
          
          return false;
        }
    }
    _colorFmt = GFXFormat::RGBA8;
    _depthStencilFmt = GFXFormat::D24S8;

    if (!MakeCurrent())
        return false;

    return createCustomFrameBuffer();
}

bool VKContext::createCustomFrameBuffer()
{
    glGenFramebuffers(1, &_defaultFBO);
    if (0 == _defaultFBO)
    {
        CC_LOG_ERROR("Can not create default frame buffer");
        return false;
    }
    glBindFramebuffer(GL_FRAMEBUFFER, _defaultFBO);
    
    glGenRenderbuffers(1, &_defaultColorBuffer);
    if (0 == _defaultColorBuffer)
    {
        CC_LOG_ERROR("Can not create default color buffer");
        return false;
    }
    glBindRenderbuffer(GL_RENDERBUFFER, _defaultColorBuffer);
    
    CAEAGLLayer* eaglLayer = (CAEAGLLayer*)( ((UIView*)(_windowHandle)).layer);
    if (! [(EAGLContext*)_eaglContext renderbufferStorage:GL_RENDERBUFFER
                                              fromDrawable:eaglLayer])
    {
        CC_LOG_ERROR("Attaches EAGLDrawable as storage for the OpenGL ES renderbuffer object failed.");
        glBindRenderbuffer(GL_RENDERBUFFER, 0);
        glDeleteRenderbuffers(1, &_defaultColorBuffer);
        return false;
    }
    
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER, _defaultColorBuffer);
    
    GLint framebufferWidth = 0, framebufferHeight = 0;
    glGetRenderbufferParameteriv(GL_RENDERBUFFER, GL_RENDERBUFFER_WIDTH, &framebufferWidth);
    glGetRenderbufferParameteriv(GL_RENDERBUFFER, GL_RENDERBUFFER_HEIGHT, &framebufferHeight);
    
    glGenRenderbuffers(1, &_defaultDepthStencilBuffer);
    if (_defaultDepthStencilBuffer == 0)
    {
        // Application can run without depth/stencil buffer, so don't return false here.
        CC_LOG_ERROR("Can not create default depth/stencil buffer");
    }

    glBindRenderbuffer(GL_RENDERBUFFER, _defaultDepthStencilBuffer);
    glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8_OES, framebufferWidth, framebufferHeight);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, _defaultDepthStencilBuffer);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, _defaultDepthStencilBuffer);

    GLenum status = glCheckFramebufferStatus(GL_FRAMEBUFFER);
    if (status != GL_FRAMEBUFFER_COMPLETE)
    {
        switch (status)
        {
            case GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            {
                CC_LOG_ERROR("glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                break;
            }
            case GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            {
                CC_LOG_ERROR("glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                break;
            }
            case GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            {
                CC_LOG_ERROR("glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                break;
            }
            case GL_FRAMEBUFFER_UNSUPPORTED:
            {
                CC_LOG_ERROR("glCheckFramebufferStatus() - FRAMEBUFFER_UNSUPPORTED");
                break;
            }
            default:;
        }
        destroyCustomFrameBuffer();
        return false;
    }
    
    glBindRenderbuffer(GL_RENDERBUFFER, _defaultColorBuffer);
    return true;
}

void VKContext::destroyCustomFrameBuffer()
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

void VKContext::destroy()
{
    destroyCustomFrameBuffer();
    
    if (_eaglContext)
    {
        [(EAGLContext*)_eaglContext release];
    }

    _isPrimaryContex = false;
    _windowHandle = 0;
    _vsyncMode = GFXVsyncMode::OFF;
    _isInitialized = false;
}

void VKContext::present()
{
  
    if (! [(EAGLContext*)_eaglContext presentRenderbuffer:GL_RENDERBUFFER] )
    {
        CC_LOG_ERROR("Failed to present content.");
    }
}

bool VKContext::MakeCurrentImpl()
{
  return [EAGLContext setCurrentContext:(EAGLContext*)_eaglContext];
}

#endif

NS_CC_END
