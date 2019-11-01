#include "GLES2Std.h"
#include "GLES2Context.h"
#include "gles2w.h"
#import <QuartzCore/CAEAGLLayer.h>
#import <UIKit/UIScreen.h>

CC_NAMESPACE_BEGIN

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)

bool GLES2Context::Initialize(const GFXContextInfo &info) {
  
  vsync_mode_ = info.vsync_mode;
  window_handle_ = info.window_handle;

  //////////////////////////////////////////////////////////////////////////

  if (!info.shared_ctx) {
    is_primary_ctx_ = true;
    window_handle_ = info.window_handle;

    EAGLContext* eagl_context = [[EAGLContext alloc]initWithAPI:kEAGLRenderingAPIOpenGLES3];
    if (!eagl_context) {
      CC_LOG_ERROR("Create EAGL context failed.");
      return false;
    }

    eagl_context_ = (intptr_t)eagl_context;
    eagl_shared_ctx_ = (intptr_t)eagl_context;

    if (!gles2wInit()) {
      return false;
    }
  } else {
    GLES2Context* shared_ctx = (GLES2Context*)info.shared_ctx;
    EAGLContext* eagl_shared_context = (EAGLContext*)shared_ctx->eagl_shared_ctx();
    EAGLContext* eagl_context = [[EAGLContext alloc] initWithAPI: [eagl_shared_context API] sharegroup: [eagl_shared_context sharegroup]];
    if (!eagl_context) {
      CC_LOG_ERROR("Create EGL context with share context [0x%p] failed.", eagl_shared_context);
      
      eagl_context_ = (intptr_t)eagl_context;
      eagl_shared_ctx_ = (intptr_t)eagl_shared_context;
      
      return false;
    }
  }

  if (!MakeCurrent()) {
    return false;
  }

  return true;
}

void GLES2Context::Destroy() {
  
  if (eagl_context_) {
    [(EAGLContext*)eagl_context_ release];
  }

  is_primary_ctx_ = false;
  window_handle_ = 0;
  vsync_mode_ = GFXVsyncMode::OFF;
  is_initialized = false;
}

void GLES2Context::Present() {
  [(EAGLContext*)eagl_context_ presentRenderbuffer:GL_RENDERBUFFER];
}

bool GLES2Context::MakeCurrentImpl() {
  return [EAGLContext setCurrentContext:(EAGLContext*)eagl_context_];
}

#endif

CC_NAMESPACE_END
