#include "GLES3Std.h"
#include "GLES3Context.h"
#include "gles3w.h"

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)

#import <UIKit/UIScreen.h>

namespace cc {
namespace gfx {

bool GLES3Context::initialize(const ContextInfo &info) {

    _vsyncMode = info.vsyncMode;
    _windowHandle = info.windowHandle;

    //////////////////////////////////////////////////////////////////////////

    if (!info.sharedCtx) {
        _isPrimaryContex = true;
        _windowHandle = info.windowHandle;

        CAEAGLLayer* eaglLayer = (CAEAGLLayer*)( ((UIView*)(_windowHandle)).layer);
        eaglLayer.opaque = TRUE;

        EAGLContext* eagl_context = [[EAGLContext alloc]initWithAPI:kEAGLRenderingAPIOpenGLES3];
        if (!eagl_context) {
          CC_LOG_ERROR("Create EAGL context failed.");
          return false;
        }
        
        _eaglContext = (intptr_t)eagl_context;
        _eaglSharedContext = (intptr_t)eagl_context;
        _majorVersion = 3;

        if (!gles3wInit()) {
          return false;
        }

    } else {
        GLES3Context* sharedCtx = (GLES3Context*)info.sharedCtx;
        _majorVersion = sharedCtx->_majorVersion;
        _defaultFBO = sharedCtx->_defaultFBO;
        _defaultColorBuffer = sharedCtx->_defaultColorBuffer;
        _defaultDepthStencilBuffer = sharedCtx->_defaultDepthStencilBuffer;

        EAGLContext* eagl_shared_context = (EAGLContext*)sharedCtx->eagl_shared_ctx();
        EAGLContext* eagl_context = [[EAGLContext alloc] initWithAPI: [eagl_shared_context API] sharegroup: [eagl_shared_context sharegroup]];
        if (!eagl_context) {
          CC_LOG_ERROR("Create EGL context with share context [0x%p] failed.", eagl_shared_context);
          return false;
        }
        
        _eaglContext = (intptr_t)eagl_context;
        _eaglSharedContext = (intptr_t)eagl_shared_context;
    }

    _colorFmt = Format::RGBA8;
    _depthStencilFmt = Format::D24S8;

    return true;
}

bool GLES3Context::createCustomFrameBuffer()
{
    if (_defaultFBO) {
        GL_CHECK(glBindFramebuffer(GL_FRAMEBUFFER, _defaultFBO));
        GL_CHECK(glBindRenderbuffer(GL_RENDERBUFFER, _defaultColorBuffer));
        return true;
    }

    GL_CHECK(glGenFramebuffers(1, &_defaultFBO));
    if (0 == _defaultFBO)
    {
        CC_LOG_ERROR("Can not create default frame buffer");
        return false;
    }
    GL_CHECK(glBindFramebuffer(GL_FRAMEBUFFER, _defaultFBO));

    GL_CHECK(glGenRenderbuffers(1, &_defaultColorBuffer));
    if (0 == _defaultColorBuffer)
    {
        CC_LOG_ERROR("Can not create default color buffer");
        return false;
    }
    GL_CHECK(glBindRenderbuffer(GL_RENDERBUFFER, _defaultColorBuffer));

    CAEAGLLayer* eaglLayer = (CAEAGLLayer*)( ((UIView*)(_windowHandle)).layer);
    if (! [(EAGLContext*)_eaglContext renderbufferStorage:GL_RENDERBUFFER
                                              fromDrawable:eaglLayer])
    {
        CC_LOG_ERROR("Attaches EAGLDrawable as storage for the OpenGL ES renderbuffer object failed.");
        GL_CHECK(glBindRenderbuffer(GL_RENDERBUFFER, 0));
        GL_CHECK(glDeleteRenderbuffers(1, &_defaultColorBuffer));
        return false;
    }

    GL_CHECK(glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_RENDERBUFFER, _defaultColorBuffer));

    GLint framebufferWidth = 0, framebufferHeight = 0;
    GL_CHECK(glGetRenderbufferParameteriv(GL_RENDERBUFFER, GL_RENDERBUFFER_WIDTH, &framebufferWidth));
    GL_CHECK(glGetRenderbufferParameteriv(GL_RENDERBUFFER, GL_RENDERBUFFER_HEIGHT, &framebufferHeight));

    GL_CHECK(glGenRenderbuffers(1, &_defaultDepthStencilBuffer));
    if (_defaultDepthStencilBuffer == 0)
    {
        // Application can run without depth/stencil buffer, so don't return false here.
        CC_LOG_ERROR("Can not create default depth/stencil buffer");
    }

    GL_CHECK(glBindRenderbuffer(GL_RENDERBUFFER, _defaultDepthStencilBuffer));
    GL_CHECK(glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8_OES, framebufferWidth, framebufferHeight));
    GL_CHECK(glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, _defaultDepthStencilBuffer));
    GL_CHECK(glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, _defaultDepthStencilBuffer));

    GLenum status;
    GL_CHECK(status = glCheckFramebufferStatus(GL_FRAMEBUFFER));
    if (status != GL_FRAMEBUFFER_COMPLETE)
    {
        switch (status)
        {
            case GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            {
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                break;
            }
            case GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            {
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                break;
            }
            case GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            {
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                break;
            }
            case GL_FRAMEBUFFER_UNSUPPORTED:
            {
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_UNSUPPORTED");
                break;
            }
            default:;
        }
        destroyCustomFrameBuffer();
        return false;
    }

    GL_CHECK(glBindRenderbuffer(GL_RENDERBUFFER, _defaultColorBuffer));
    return true;
}

void GLES3Context::destroyCustomFrameBuffer() {
    if (_defaultColorBuffer) {
        GL_CHECK(glDeleteRenderbuffers(1, &_defaultColorBuffer));
        _defaultColorBuffer = 0;
    }
    if (_defaultDepthStencilBuffer) {
        GL_CHECK(glDeleteRenderbuffers(1, &_defaultDepthStencilBuffer));
        _defaultDepthStencilBuffer = 0;
    }

    if (_defaultFBO) {
        GL_CHECK(glDeleteFramebuffers(1, &_defaultFBO));
        _defaultFBO = 0;
    }
}

void GLES3Context::destroy() {
    destroyCustomFrameBuffer();

    if (_eaglContext) {
        [(EAGLContext*)_eaglContext release];
    }

    _isPrimaryContex = false;
    _windowHandle = 0;
    _vsyncMode = VsyncMode::OFF;
    _isInitialized = false;
}

void GLES3Context::present() {
    if (! [(EAGLContext*)_eaglContext presentRenderbuffer:GL_RENDERBUFFER] ) {
        CC_LOG_ERROR("Failed to present content.");
    }
}

bool GLES3Context::MakeCurrentImpl(bool bound) {
    if (!bound) return [EAGLContext setCurrentContext: nil];
    return [EAGLContext setCurrentContext: (EAGLContext*)_eaglContext] && createCustomFrameBuffer();
}

} // namespace gfx
} // namespace cc

#endif
