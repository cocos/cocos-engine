#include "GLES3Std.h"
#include "GLES3Context.h"
#include "gles3w.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
#include "android/native_window.h"
#endif

// #define CC_GFX_DEBUG

NS_CC_BEGIN

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)

void APIENTRY GLES3EGLDebugProc(GLenum source, GLenum type, GLuint id, GLenum severity, GLsizei length, const GLchar* message, const void* userParam)
{
  String source_desc;
  switch (source)
  {
  case GL_DEBUG_SOURCE_API_KHR: source_desc = "API"; break;
  case GL_DEBUG_SOURCE_SHADER_COMPILER_KHR: source_desc = "SHADER_COMPILER"; break;
  case GL_DEBUG_SOURCE_WINDOW_SYSTEM_KHR: source_desc = "WINDOW_SYSTEM"; break;
  case GL_DEBUG_SOURCE_THIRD_PARTY_KHR: source_desc = "THIRD_PARTY"; break;
  case GL_DEBUG_SOURCE_APPLICATION_KHR: source_desc = "APPLICATION"; break;
  default: source_desc = "OTHER";
  }

  String type_desc;
  switch (severity)
  {
  case GL_DEBUG_TYPE_ERROR_KHR: type_desc = "ERROR"; break;
  case GL_DEBUG_TYPE_DEPRECATED_BEHAVIOR_KHR: type_desc = "PEPRECATED_BEHAVIOR"; break;
  case GL_DEBUG_TYPE_UNDEFINED_BEHAVIOR_KHR: type_desc = "UNDEFINED_BEHAVIOR"; break;
  case GL_DEBUG_TYPE_PERFORMANCE_KHR: type_desc = "PERFORMANCE"; break;
  case GL_DEBUG_TYPE_PORTABILITY_KHR: type_desc = "PORTABILITY"; break;
  case GL_DEBUG_TYPE_MARKER_KHR: type_desc = "MARKER"; break;
  case GL_DEBUG_TYPE_PUSH_GROUP_KHR: type_desc = "PUSH_GROUP"; break;
  case GL_DEBUG_TYPE_POP_GROUP_KHR: type_desc = "POP_GROUP"; break;
  default: type_desc = "OTHER";
  }

  String severity_desc;
  switch (severity)
  {
  case GL_DEBUG_SEVERITY_HIGH_KHR: severity_desc = "HIGH"; break;
  case GL_DEBUG_SEVERITY_MEDIUM_KHR: severity_desc = "MEDIUM"; break;
  case GL_DEBUG_SEVERITY_LOW_KHR: severity_desc = "LOW"; break;
  default: severity_desc = "NOTIFICATION";
  }

  String msg = StringUtil::Format("source: %s, type: %s, severity: %s, message: %s",
    source_desc.c_str(), type_desc.c_str(), severity_desc.c_str(), message);

  if (severity == GL_DEBUG_SEVERITY_HIGH_KHR)
  {
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    // CC_ASSERTS(false, msg.c_str());
#else
    CC_LOG_ERROR(msg.c_str());
#endif
  } else {
    CC_LOG_DEBUG(msg.c_str());
  }
}

#endif

GLES3Context::GLES3Context(GFXDevice* device)
    : GFXContext(device),
      is_primary_ctx_(false),
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
      eagl_context_(0),
      eagl_shared_ctx_(0),
#else
      native_display_(0),
      egl_display_(EGL_NO_DISPLAY),
      egl_config_(EGL_NO_CONFIG_KHR),
      egl_surface_(EGL_NO_SURFACE),
      egl_context_(EGL_NO_CONTEXT),
      egl_shared_ctx_(EGL_NO_CONTEXT),
#endif
      major_ver_(0),
      minor_ver_(0),
      is_initialized(false) {
}

GLES3Context::~GLES3Context() {
}

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_ANDROID)

bool GLES3Context::Initialize(const GFXContextInfo &info) {
  
  vsync_mode_ = info.vsync_mode;
  window_handle_ = info.window_handle;

  //////////////////////////////////////////////////////////////////////////

  if (!info.shared_ctx)
  {
    is_primary_ctx_ = true;
    window_handle_ = info.window_handle;

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    native_display_ = (NativeDisplayType)GetDC((HWND)window_handle_);
    if (!native_display_) {
      return false;
    }

    egl_display_ = eglGetDisplay(native_display_);
    if (egl_display_ == EGL_NO_DISPLAY) {
      egl_display_ = eglGetDisplay((EGLNativeDisplayType)EGL_DEFAULT_DISPLAY);
    }
#else
    egl_display_ = eglGetDisplay((EGLNativeDisplayType)EGL_DEFAULT_DISPLAY);
#endif
    // If a display still couldn't be obtained, return an error.
    if (egl_display_ == EGL_NO_DISPLAY) {
      CC_LOG_ERROR("eglGetDisplay() - FAILED.");
      return false;
    }

    EGLint major = 0;
    EGLint minor = 0;
    if (eglInitialize(egl_display_, &major, &minor) != EGL_TRUE) {
      CC_LOG_ERROR("Couldn't initialize EGLDisplay.");
      return false;
    }

    //	Make OpenGL ES the current API.
    //	EGL needs a way to know that any subsequent EGL calls are going to be affecting OpenGL ES,
    //	rather than any other API (such as OpenVG).
    eglBindAPI(EGL_OPENGL_ES_API);

    if (!gles3wInit())
    {
      return false;
    }

    color_fmt_ = GFXFormat::RGBA8;
    depth_stencil_fmt_ = GFXFormat::D24S8;

    const EGLint attribs[] = {
      EGL_SURFACE_TYPE, EGL_WINDOW_BIT | EGL_PBUFFER_BIT,
      //	EGL_RENDERABLE_TYPE, EGL_OPENGL_ES2_BIT,
      EGL_RENDERABLE_TYPE, EGL_OPENGL_ES3_BIT_KHR,
      // EGL_BUFFER_SIZE, colorBuffSize,
      EGL_BLUE_SIZE, 8,
      EGL_GREEN_SIZE, 8,
      EGL_RED_SIZE, 8,
      EGL_ALPHA_SIZE, 8,
      EGL_DEPTH_SIZE, 24,
      EGL_STENCIL_SIZE, 8,
      EGL_NONE
    };

    //	Find a suitable EGLConfig
    //	eglChooseConfig is provided by EGL to provide an easy way to select an appropriate configuration. It takes in the capabilities
    //	specified in the attribute list, and returns a list of available configurations that match or exceed the capabilities requested.
    //	Details of all the possible attributes and how they are selected for by this function are available in the EGL reference pages here:
    //	http://www.khronos.org/registry/egl/sdk/docs/man/xhtml/eglChooseConfig.html
    //	It is also possible to simply get the entire list of configurations and use a custom algorithm to choose a suitable one, as many
    //	advanced applications choose to do. For this application however, taking the first EGLConfig that the function returns suits
    //	its needs perfectly, so we limit it to returning a single EGLConfig.

    EGLint num_configs;
    if (eglChooseConfig(egl_display_, attribs, &egl_config_, 1, &num_configs) == EGL_FALSE || num_configs <= 0)
    {
      CC_LOG_ERROR("Choosing configuration failed.");
      return false;
    }

    EGLint depth = attribs[13];
    EGLint stencil = attribs[15];
    CC_LOG_INFO("Setup EGLConfig: depth [%d] stencil [%d]", depth, stencil);

    if (depth == 16 && stencil == 0) {
      depth_stencil_fmt_ = GFXFormat::D16;
    } else if (depth == 16 && stencil == 8) {
      depth_stencil_fmt_ = GFXFormat::D16S8;
    } else if (depth == 24 && stencil == 0) {
      depth_stencil_fmt_ = GFXFormat::D24;
    } else if (depth == 24 && stencil == 8) {
      depth_stencil_fmt_ = GFXFormat::D24S8;
    } else if (depth == 32 && stencil == 0) {
      depth_stencil_fmt_ = GFXFormat::D32F;
    } else if (depth == 32 && stencil == 8) {
      depth_stencil_fmt_ = GFXFormat::D32F_S8;
    } else {
      CC_LOG_ERROR("Unknown depth stencil format.");
      return false;
    }

    CC_LOG_INFO("Chosen EGLConfig: color [%s], depth stencil [%s].",
      GFX_FORMAT_INFOS[(int)color_fmt_].name.c_str(),
      GFX_FORMAT_INFOS[(int)depth_stencil_fmt_].name.c_str());

    /* EGL_NATIVE_VISUAL_ID is an attribute of the EGLConfig that is
    * guaranteed to be accepted by ANativeWindow_setBuffersGeometry().
    * As soon as we picked a EGLConfig, we can safely reconfigure the
    * ANativeWindow buffers to match, using EGL_NATIVE_VISUAL_ID. */

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    EGLint n_fmt;
    if (eglGetConfigAttrib(egl_display_, egl_config_, EGL_NATIVE_VISUAL_ID, &n_fmt) == EGL_FALSE) {
      CC_LOG_ERROR("Getting configuration attributes failed.");
      return false;
    }

    uint width = device_->width();
    uint height = device_->height();
    ANativeWindow_setBuffersGeometry((ANativeWindow*)window_handle_, width, height, n_fmt);
#endif

    egl_surface_ = eglCreateWindowSurface(egl_display_, egl_config_, (EGLNativeWindowType)window_handle_, NULL);
    if (egl_surface_ == EGL_NO_SURFACE) {
      CC_LOG_ERROR("Window surface created failed.");
      return false;
    }

    //String egl_vendor = eglQueryString(egl_display_, EGL_VENDOR);
    //String egl_version = eglQueryString(egl_display_, EGL_VERSION);

    extensions_ = StringUtil::Split((const char*)eglQueryString(egl_display_, EGL_EXTENSIONS), " ");

    major_ver_ = 3;
    minor_ver_ = 0;
    EGLint ctx_attribs[32];
    uint n = 0;

    bool has_khr_create_ctx = CheckExtension(CC_TOSTR(EGL_KHR_create_context));
    if (has_khr_create_ctx) {
      for (int m = 2; m >= 0; --m) {
        n = 0;
        ctx_attribs[n++] = EGL_CONTEXT_MAJOR_VERSION_KHR;
        ctx_attribs[n++] = major_ver_;
        ctx_attribs[n++] = EGL_CONTEXT_MINOR_VERSION_KHR;
        ctx_attribs[n++] = m;

#ifdef CC_GFX_DEBUG
        ctx_attribs[n++] = EGL_CONTEXT_FLAGS_KHR;
        ctx_attribs[n++] = EGL_CONTEXT_OPENGL_DEBUG_BIT_KHR;
#endif
        ctx_attribs[n] = EGL_NONE;

        egl_context_ = eglCreateContext(egl_display_, egl_config_, NULL, ctx_attribs);
        if (egl_context_) {
          minor_ver_ = m;
          break;
        }
      }
    } else {
      ctx_attribs[n++] = EGL_CONTEXT_CLIENT_VERSION;
      ctx_attribs[n++] = major_ver_;
      ctx_attribs[n] = EGL_NONE;
      egl_context_ = eglCreateContext(egl_display_, egl_config_, NULL, ctx_attribs);
    }

    if (!egl_context_) {
      CC_LOG_ERROR("Create EGL context failed.");
      return false;
    }

    egl_shared_ctx_ = egl_context_;
  } else {
    GLES3Context* shared_ctx = (GLES3Context*)info.shared_ctx;

    major_ver_ = shared_ctx->major_ver();
    minor_ver_ = shared_ctx->minor_ver();
    native_display_ = shared_ctx->native_display();
    egl_display_ = shared_ctx->egl_display();
    egl_config_ = shared_ctx->egl_config();
    egl_shared_ctx_ = shared_ctx->egl_shared_ctx();
    color_fmt_ = shared_ctx->color_fmt();
    depth_stencil_fmt_ = shared_ctx->depth_stencil_fmt();

    EGLint pbuff_attribs[] =
    {
      EGL_WIDTH, 2,
      EGL_HEIGHT, 2,
      EGL_LARGEST_PBUFFER, EGL_TRUE,
      EGL_TEXTURE_FORMAT, EGL_NO_TEXTURE,
      EGL_TEXTURE_TARGET, EGL_NO_TEXTURE,
      EGL_NONE
    };

    egl_surface_ = eglCreatePbufferSurface(egl_display_, egl_config_, pbuff_attribs);
    if (egl_surface_ == EGL_NO_SURFACE) {
      CC_LOG_ERROR("eglCreatePbufferSurface - FAILED");
      return false;
    }

    major_ver_ = 3;
    minor_ver_ = shared_ctx->minor_ver();

    bool has_khr_create_ctx = CheckExtension(CC_TOSTR(EGL_KHR_create_context));
    if (!has_khr_create_ctx)
    {
      CC_LOG_INFO("EGL context creation: EGL_KHR_create_context not supported. Minor version will be discarded, and debug disabled.");
      minor_ver_ = 0;
    }

    EGLint ctx_attribs[32];
    uint n = 0;

    if (has_khr_create_ctx)
    {
      ctx_attribs[n++] = EGL_CONTEXT_MAJOR_VERSION_KHR;
      ctx_attribs[n++] = major_ver_;
      ctx_attribs[n++] = EGL_CONTEXT_MINOR_VERSION_KHR;
      ctx_attribs[n++] = minor_ver_;

#ifdef CC_GFX_DEBUG
      ctx_attribs[n++] = EGL_CONTEXT_FLAGS_KHR;
      ctx_attribs[n++] = EGL_CONTEXT_OPENGL_DEBUG_BIT_KHR;
#endif
    }
    else
    {
      ctx_attribs[n++] = EGL_CONTEXT_CLIENT_VERSION;
      ctx_attribs[n++] = major_ver_;
    }

    ctx_attribs[n] = EGL_NONE;

    egl_context_ = eglCreateContext(egl_display_, egl_config_, egl_shared_ctx_, ctx_attribs);
    if (!egl_context_) {
      CC_LOG_ERROR("Create EGL context with share context [0x%p] failed.", egl_shared_ctx_);
      return false;
    }
  }

  if (!MakeCurrent()) {
    return false;
  }

  return true;
}

void GLES3Context::Destroy() {
  if (egl_context_ != EGL_NO_CONTEXT) {
    eglDestroyContext(egl_display_, egl_context_);
    egl_context_ = EGL_NO_CONTEXT;
  }

  if (egl_surface_ != EGL_NO_SURFACE) {
    eglDestroySurface(egl_display_, egl_surface_);
    egl_surface_ = EGL_NO_SURFACE;
  }

  eglMakeCurrent(egl_display_, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT);

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
  if (is_primary_ctx_ && native_display_)
  {
    ReleaseDC((HWND)window_handle_, native_display_);
  }
#endif

  is_primary_ctx_ = false;
  window_handle_ = 0;
  native_display_ = 0;
  vsync_mode_ = GFXVsyncMode::OFF;
  is_initialized = false;
}

bool GLES3Context::MakeCurrentImpl() {
  return eglMakeCurrent(egl_display_, egl_surface_, egl_surface_, egl_context_);
}

void GLES3Context::Present() {
  eglSwapBuffers(egl_display_, egl_surface_);
}

#endif

bool GLES3Context::MakeCurrent() {
  if (MakeCurrentImpl()) {
    if (!is_initialized) {
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_ANDROID)
      // Turn on or off the vertical sync depending on the input bool value.
      int interval = 1;
      switch (vsync_mode_) {
      case GFXVsyncMode::OFF: interval = 0; break;
      case GFXVsyncMode::ON: interval = 1; break;
      case GFXVsyncMode::RELAXED: interval = -1; break;
      case GFXVsyncMode::MAILBOX: interval = 0; break;
      case GFXVsyncMode::HALF: interval = 2; break;
      default:;
      }

      if (eglSwapInterval(egl_display_, interval) != 1) {
        CC_LOG_ERROR("wglSwapInterval() - FAILED.");
        return false;
      }
#endif

#if defined(CC_GFX_DEBUG)
      glEnable(GL_DEBUG_OUTPUT_SYNCHRONOUS_KHR);
      glDebugMessageControlKHR(GL_DONT_CARE, GL_DONT_CARE, GL_DONT_CARE, 0, NULL, GL_TRUE);
      glDebugMessageCallbackKHR(GLES3EGLDebugProc, NULL);
#endif

      //////////////////////////////////////////////////////////////////////////

      glPixelStorei(GL_PACK_ALIGNMENT, 1);
      glPixelStorei(GL_UNPACK_ALIGNMENT, 1);
      glActiveTexture(GL_TEXTURE0);

      //////////////////////////////////////////////////////////////////////////

      glEnable(GL_CULL_FACE);
      glCullFace(GL_BACK);

      glFrontFace(GL_CCW);

      //glDisable(GL_MULTISAMPLE);

      //////////////////////////////////////////////////////////////////////////
      // DepthStencilState
      glEnable(GL_DEPTH_TEST);
      glDepthMask(GL_TRUE);
      glDepthFunc(GL_LESS);

      glStencilFuncSeparate(GL_FRONT, GL_ALWAYS, 1, 0xffffffff);
      glStencilOpSeparate(GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP);
      glStencilMaskSeparate(GL_FRONT, 0xffffffff);
      glStencilFuncSeparate(GL_BACK, GL_ALWAYS, 1, 0xffffffff);
      glStencilOpSeparate(GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP);
      glStencilMaskSeparate(GL_BACK, 0xffffffff);

      glDisable(GL_STENCIL_TEST);

      //////////////////////////////////////////////////////////////////////////
      // BlendState

      glDisable(GL_SAMPLE_ALPHA_TO_COVERAGE);
      glDisable(GL_BLEND);
      glBlendEquationSeparate(GL_FUNC_ADD, GL_FUNC_ADD);
      glBlendFuncSeparate(GL_ONE, GL_ZERO, GL_ONE, GL_ZERO);
      glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
      glBlendColor((GLclampf)0.0f, (GLclampf)0.0f, (GLclampf)0.0f, (GLclampf)0.0f);

      is_initialized = true;
    }

    CC_LOG_DEBUG("eglMakeCurrent() - SUCCESSED, Context: 0x%p", this);
    return true;
  } else {
    CC_LOG_ERROR("MakeCurrent() - FAILED, Context: 0x%p", this);
    return false;
  }
}

bool GLES3Context::CheckExtension(const String& extension) const {
  return (std::find(extensions_.begin(), extensions_.end(), extension) != extensions_.end());
}

NS_CC_END
