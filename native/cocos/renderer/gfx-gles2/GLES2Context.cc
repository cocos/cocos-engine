#include "GLES2Std.h"

#include "GLES2Context.h"
#include "gles2w.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include "android/native_window.h"
    #include "scripting/js-bindings/event/CustomEventTypes.h"
    #include "scripting/js-bindings/event/EventDispatcher.h"
#endif

// #define CC_GFX_DEBUG

namespace cc {
namespace gfx {

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)

void APIENTRY GLES2EGLDebugProc(GLenum source,
                                GLenum type, GLuint id,
                                GLenum severity, GLsizei length,
                                const GLchar *message,
                                const void *userParam) {
    String source_desc;
    switch (source) {
        case GL_DEBUG_SOURCE_API_KHR: source_desc = "API"; break;
        case GL_DEBUG_SOURCE_SHADER_COMPILER_KHR: source_desc = "SHADER_COMPILER"; break;
        case GL_DEBUG_SOURCE_WINDOW_SYSTEM_KHR: source_desc = "WINDOW_SYSTEM"; break;
        case GL_DEBUG_SOURCE_THIRD_PARTY_KHR: source_desc = "THIRD_PARTY"; break;
        case GL_DEBUG_SOURCE_APPLICATION_KHR: source_desc = "APPLICATION"; break;
        default: source_desc = "OTHER"; break;
    }

    String type_desc;
    switch (severity) {
        case GL_DEBUG_TYPE_ERROR_KHR: type_desc = "ERROR"; break;
        case GL_DEBUG_TYPE_DEPRECATED_BEHAVIOR_KHR: type_desc = "PEPRECATED_BEHAVIOR"; break;
        case GL_DEBUG_TYPE_UNDEFINED_BEHAVIOR_KHR: type_desc = "UNDEFINED_BEHAVIOR"; break;
        case GL_DEBUG_TYPE_PERFORMANCE_KHR: type_desc = "PERFORMANCE"; break;
        case GL_DEBUG_TYPE_PORTABILITY_KHR: type_desc = "PORTABILITY"; break;
        case GL_DEBUG_TYPE_MARKER_KHR: type_desc = "MARKER"; break;
        case GL_DEBUG_TYPE_PUSH_GROUP_KHR: type_desc = "PUSH_GROUP"; break;
        case GL_DEBUG_TYPE_POP_GROUP_KHR: type_desc = "POP_GROUP"; break;
        default: type_desc = "OTHER"; break;
    }

    String severity_desc;
    switch (severity) {
        case GL_DEBUG_SEVERITY_HIGH_KHR: severity_desc = "HIGH"; break;
        case GL_DEBUG_SEVERITY_MEDIUM_KHR: severity_desc = "MEDIUM"; break;
        case GL_DEBUG_SEVERITY_LOW_KHR: severity_desc = "LOW"; break;
        default: severity_desc = "NOTIFICATION"; break;
    }

    String msg = StringUtil::Format("source: %s, type: %s, severity: %s, message: %s",
                                    source_desc.c_str(), type_desc.c_str(), severity_desc.c_str(),
                                    message);

    if (severity == GL_DEBUG_SEVERITY_HIGH_KHR) {
    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        CCASSERT(false, msg.c_str());
    #else
        CC_LOG_ERROR(msg.c_str());
    #endif
    } else {
        CC_LOG_DEBUG(msg.c_str());
    }
}

#endif

GLES2Context::GLES2Context(GFXDevice *device)
: GFXContext(device) {
}

GLES2Context::~GLES2Context() {
}

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_OSX)

bool GLES2Context::initialize(const GFXContextInfo &info) {

    _vsyncMode = info.vsyncMode;
    _windowHandle = info.windowHandle;

    //////////////////////////////////////////////////////////////////////////

    if (!info.sharedCtx) {
        _isPrimaryContex = true;
        _windowHandle = info.windowHandle;

    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        _nativeDisplay = (NativeDisplayType)GetDC((HWND)_windowHandle);
        if (!_nativeDisplay) {
            return false;
        }

        _eglDisplay = eglGetDisplay(_nativeDisplay);
        if (_eglDisplay == EGL_NO_DISPLAY) {
            _eglDisplay = eglGetDisplay((EGLNativeDisplayType)EGL_DEFAULT_DISPLAY);
        }
    #else
        _eglDisplay = eglGetDisplay((EGLNativeDisplayType)EGL_DEFAULT_DISPLAY);
    #endif
        // If a display still couldn't be obtained, return an error.
        if (_eglDisplay == EGL_NO_DISPLAY) {
            CC_LOG_ERROR("eglGetDisplay() - FAILED.");
            return false;
        }

        EGLint major = 0;
        EGLint minor = 0;
        if (eglInitialize(_eglDisplay, &major, &minor) != EGL_TRUE) {
            CC_LOG_ERROR("Couldn't initialize EGLDisplay.");
            return false;
        }

        //    Make OpenGL ES the current API.
        //    EGL needs a way to know that any subsequent EGL calls are going to be affecting OpenGL ES,
        //    rather than any other API (such as OpenVG).
        eglBindAPI(EGL_OPENGL_ES_API);

        if (!gles2wInit()) {
            return false;
        }

        _colorFmt = GFXFormat::RGBA8;
        _depthStencilFmt = GFXFormat::D24S8;

        const EGLint attribs[] = {
            EGL_SURFACE_TYPE, EGL_WINDOW_BIT | EGL_PBUFFER_BIT,
            EGL_RENDERABLE_TYPE, EGL_OPENGL_ES2_BIT,
            // EGL_BUFFER_SIZE, colorBuffSize,
            EGL_BLUE_SIZE, 8,
            EGL_GREEN_SIZE, 8,
            EGL_RED_SIZE, 8,
            EGL_ALPHA_SIZE, 8,
            EGL_DEPTH_SIZE, 24,
            EGL_STENCIL_SIZE, 8,
            EGL_NONE};

        //    Find a suitable EGLConfig
        //    eglChooseConfig is provided by EGL to provide an easy way to select an appropriate configuration. It takes in the capabilities
        //    specified in the attribute list, and returns a list of available configurations that match or exceed the capabilities requested.
        //    Details of all the possible attributes and how they are selected for by this function are available in the EGL reference pages here:
        //    http://www.khronos.org/registry/egl/sdk/docs/man/xhtml/eglChooseConfig.html
        //    It is also possible to simply get the entire list of configurations and use a custom algorithm to choose a suitable one, as many
        //    advanced applications choose to do. For this application however, taking the first EGLConfig that the function returns suits
        //    its needs perfectly, so we limit it to returning a single EGLConfig.

        EGLint num_configs;
        if (eglChooseConfig(_eglDisplay, attribs, &_eglConfig, 1, &num_configs) == EGL_FALSE ||
            num_configs <= 0) {
            CC_LOG_ERROR("Choosing configuration failed.");
            return false;
        }

        EGLint depth = attribs[13];
        EGLint stencil = attribs[15];
        CC_LOG_INFO("Setup EGLConfig: depth [%d] stencil [%d]", depth, stencil);

        if (depth == 16 && stencil == 0) {
            _depthStencilFmt = GFXFormat::D16;
        } else if (depth == 16 && stencil == 8) {
            _depthStencilFmt = GFXFormat::D16S8;
        } else if (depth == 24 && stencil == 0) {
            _depthStencilFmt = GFXFormat::D24;
        } else if (depth == 24 && stencil == 8) {
            _depthStencilFmt = GFXFormat::D24S8;
        } else if (depth == 32 && stencil == 0) {
            _depthStencilFmt = GFXFormat::D32F;
        } else if (depth == 32 && stencil == 8) {
            _depthStencilFmt = GFXFormat::D32F_S8;
        } else {
            CC_LOG_ERROR("Unknown depth stencil format.");
            return false;
        }

        CC_LOG_INFO("Chosen EGLConfig: color [%s], depth stencil [%s].",
                    GFX_FORMAT_INFOS[(int)_colorFmt].name.c_str(),
                    GFX_FORMAT_INFOS[(int)_depthStencilFmt].name.c_str());

        /**
         * EGL_NATIVE_VISUAL_ID is an attribute of the EGLConfig that is
         * guaranteed to be accepted by ANativeWindow_setBuffersGeometry().
         * As soon as we picked a EGLConfig, we can safely reconfigure the
         * ANativeWindow buffers to match, using EGL_NATIVE_VISUAL_ID.
         */

    #if (CC_PLATFORM == CC_PLATFORM_ANDROID)
        EGLint n_fmt;
        if (eglGetConfigAttrib(_eglDisplay, _eglConfig, EGL_NATIVE_VISUAL_ID, &n_fmt) == EGL_FALSE) {
            CC_LOG_ERROR("Getting configuration attributes failed.");
            return false;
        }

        uint width = _device->getWidth();
        uint height = _device->getHeight();
        ANativeWindow_setBuffersGeometry((ANativeWindow *)_windowHandle, width, height, n_fmt);
    #endif

        _eglSurface = eglCreateWindowSurface(_eglDisplay, _eglConfig, (EGLNativeWindowType)_windowHandle, NULL);
        if (_eglSurface == EGL_NO_SURFACE) {
            CC_LOG_ERROR("Window surface created failed.");
            return false;
        }

        //String egl_vendor = eglQueryString(_eglDisplay, EGL_VENDOR);
        //String egl_version = eglQueryString(_eglDisplay, EGL_VERSION);

        _extensions = StringUtil::Split((const char *)eglQueryString(_eglDisplay, EGL_EXTENSIONS), " ");

        _majorVersion = 2;
        _minorVersion = 0;
        EGLint ctx_attribs[32];
        uint n = 0;

        bool has_khr_create_ctx = CheckExtension(CC_TOSTR(EGL_KHR_create_context));
        if (has_khr_create_ctx) {
            ctx_attribs[n++] = EGL_CONTEXT_MAJOR_VERSION_KHR;
            ctx_attribs[n++] = _majorVersion;
            ctx_attribs[n++] = EGL_CONTEXT_MINOR_VERSION_KHR;
            ctx_attribs[n++] = _minorVersion;

    #ifdef CC_GFX_DEBUG
            ctx_attribs[n++] = EGL_CONTEXT_FLAGS_KHR;
            ctx_attribs[n++] = EGL_CONTEXT_OPENGL_DEBUG_BIT_KHR;
    #endif
            ctx_attribs[n] = EGL_NONE;
        } else {
            ctx_attribs[n++] = EGL_CONTEXT_CLIENT_VERSION;
            ctx_attribs[n++] = _majorVersion;
            ctx_attribs[n] = EGL_NONE;
        }

        _eglContext = eglCreateContext(_eglDisplay, _eglConfig, NULL, ctx_attribs);
        if (!_eglContext) {
            CC_LOG_ERROR("Create EGL context failed.");
            return false;
        }

        _eglSharedContext = _eglContext;
    } else {
        GLES2Context *sharedCtx = (GLES2Context *)info.sharedCtx;

        _majorVersion = sharedCtx->major_ver();
        _minorVersion = sharedCtx->minor_ver();
        _nativeDisplay = sharedCtx->native_display();
        _eglDisplay = sharedCtx->egl_display();
        _eglConfig = sharedCtx->egl_config();
        _eglSharedContext = sharedCtx->egl_shared_ctx();
        _colorFmt = sharedCtx->getColorFormat();
        _depthStencilFmt = sharedCtx->getDepthStencilFormat();

        EGLint pbuff_attribs[] = {
            EGL_WIDTH, 2,
            EGL_HEIGHT, 2,
            EGL_LARGEST_PBUFFER, EGL_TRUE,
            EGL_TEXTURE_FORMAT, EGL_NO_TEXTURE,
            EGL_TEXTURE_TARGET, EGL_NO_TEXTURE,
            EGL_NONE};

        _eglSurface = eglCreatePbufferSurface(_eglDisplay, _eglConfig, pbuff_attribs);
        if (_eglSurface == EGL_NO_SURFACE) {
            CC_LOG_ERROR("eglCreatePbufferSurface - FAILED");
            return false;
        }

        bool has_khr_create_ctx = CheckExtension(CC_TOSTR(EGL_KHR_create_context));
        if (!has_khr_create_ctx) {
            CC_LOG_INFO(
                "EGL context creation: EGL_KHR_create_context not supported. Minor version will be discarded, and debug disabled.");
            _minorVersion = 0;
        }

        EGLint ctx_attribs[32];
        uint n = 0;

        if (has_khr_create_ctx) {
            ctx_attribs[n++] = EGL_CONTEXT_MAJOR_VERSION_KHR;
            ctx_attribs[n++] = _majorVersion;
            ctx_attribs[n++] = EGL_CONTEXT_MINOR_VERSION_KHR;
            ctx_attribs[n++] = _minorVersion;

    #ifdef CC_GFX_DEBUG
            ctx_attribs[n++] = EGL_CONTEXT_FLAGS_KHR;
            ctx_attribs[n++] = EGL_CONTEXT_OPENGL_DEBUG_BIT_KHR;
    #endif
        } else {
            ctx_attribs[n++] = EGL_CONTEXT_CLIENT_VERSION;
            ctx_attribs[n++] = _majorVersion;
        }

        ctx_attribs[n] = EGL_NONE;

        _eglContext = eglCreateContext(_eglDisplay, _eglConfig, _eglSharedContext, ctx_attribs);
        if (!_eglContext) {
            CC_LOG_ERROR("Create EGL context with share context [0x%p] failed.", _eglSharedContext);
            return false;
        }
    }

    if (!MakeCurrent()) {
        return false;
    }

    #if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    EventDispatcher::addCustomEventListener(EVENT_DESTROY_WINDOW, [=](const CustomEvent &) -> void {
        if (_eglSurface != EGL_NO_SURFACE) {
            eglDestroySurface(_eglDisplay, _eglSurface);
            _eglSurface = EGL_NO_SURFACE;
        }
    });

    EventDispatcher::addCustomEventListener(EVENT_RECREATE_WINDOW, [=](const CustomEvent &event) -> void {
        _windowHandle = (uintptr_t)event.args->ptrVal;

        EGLint n_fmt;
        if (eglGetConfigAttrib(_eglDisplay, _eglConfig, EGL_NATIVE_VISUAL_ID, &n_fmt) == EGL_FALSE) {
            CC_LOG_ERROR("Getting configuration attributes failed.");
            return;
        }
        uint width = _device->getWidth();
        uint height = _device->getHeight();
        ANativeWindow_setBuffersGeometry((ANativeWindow *)_windowHandle, width, height, n_fmt);

        _eglSurface = eglCreateWindowSurface(_eglDisplay, _eglConfig, (EGLNativeWindowType)_windowHandle, NULL);
        if (_eglSurface == EGL_NO_SURFACE) {
            CC_LOG_ERROR("Recreate window surface failed.");
            return;
        }

        MakeCurrent();
    });
    #endif

    return true;
}

void GLES2Context::destroy() {
    if (_eglContext != EGL_NO_CONTEXT) {
        eglDestroyContext(_eglDisplay, _eglContext);
        _eglContext = EGL_NO_CONTEXT;
    }

    if (_eglSurface != EGL_NO_SURFACE) {
        eglDestroySurface(_eglDisplay, _eglSurface);
        _eglSurface = EGL_NO_SURFACE;
    }

    eglMakeCurrent(_eglDisplay, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT);

    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    if (_isPrimaryContex && _nativeDisplay) {
        ReleaseDC((HWND)_windowHandle, _nativeDisplay);
    }
    #endif

    _isPrimaryContex = false;
    _windowHandle = 0;
    _nativeDisplay = 0;
    _vsyncMode = GFXVsyncMode::OFF;
    _isInitialized = false;
}

bool GLES2Context::MakeCurrentImpl() {
    return eglMakeCurrent(_eglDisplay, _eglSurface, _eglSurface, _eglContext);
}

void GLES2Context::present() {
    eglSwapBuffers(_eglDisplay, _eglSurface);
}

#endif

bool GLES2Context::MakeCurrent() {
    if (MakeCurrentImpl()) {
        if (!_isInitialized) {

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_ANDROID)
            // Turn on or off the vertical sync depending on the input bool value.
            int interval = 1;
            switch (_vsyncMode) {
                case GFXVsyncMode::OFF: interval = 0; break;
                case GFXVsyncMode::ON: interval = 1; break;
                case GFXVsyncMode::RELAXED: interval = -1; break;
                case GFXVsyncMode::MAILBOX: interval = 0; break;
                case GFXVsyncMode::HALF: interval = 2; break;
                default: break;
            }

            if (eglSwapInterval(_eglDisplay, interval) != 1) {
                CC_LOG_ERROR("wglSwapInterval() - FAILED.");
                return false;
            }
#endif

#if defined(CC_GFX_DEBUG)
            glEnable(GL_DEBUG_OUTPUT_SYNCHRONOUS_KHR);
            glDebugMessageControlKHR(GL_DONT_CARE, GL_DONT_CARE, GL_DONT_CARE, 0, NULL, GL_TRUE);
            glDebugMessageCallbackKHR(GLES2EGLDebugProc, NULL);
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

            _isInitialized = true;
        }

        CC_LOG_DEBUG("eglMakeCurrent() - SUCCESSED, Context: 0x%p", this);
        return true;
    } else {
        CC_LOG_ERROR("MakeCurrent() - FAILED, Context: 0x%p", this);
        return false;
    }
}

bool GLES2Context::CheckExtension(const String &extension) const {
    return (std::find(_extensions.begin(), _extensions.end(), extension) != _extensions.end());
}

} // namespace gfx
} // namespace cc
