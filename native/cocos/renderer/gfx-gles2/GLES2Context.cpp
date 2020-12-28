#include "GLES2Std.h"

#include "GLES2Context.h"
#include "gles2w.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include "android/native_window.h"
    #include "cocos/bindings/event/CustomEventTypes.h"
    #include "cocos/bindings/event/EventDispatcher.h"
#endif


namespace cc {
namespace gfx {

#if CC_DEBUG > 0

void GL_APIENTRY GLES2EGLDebugProc(GLenum source,
                       GLenum type, GLuint id,
                       GLenum severity, GLsizei length,
                       const GLchar *message,
                       const void *userParam) {
    String sourceDesc;
    switch (source) {
        case GL_DEBUG_SOURCE_API_KHR: sourceDesc = "API"; break;
        case GL_DEBUG_SOURCE_SHADER_COMPILER_KHR: sourceDesc = "SHADER_COMPILER"; break;
        case GL_DEBUG_SOURCE_WINDOW_SYSTEM_KHR: sourceDesc = "WINDOW_SYSTEM"; break;
        case GL_DEBUG_SOURCE_THIRD_PARTY_KHR: sourceDesc = "THIRD_PARTY"; break;
        case GL_DEBUG_SOURCE_APPLICATION_KHR: sourceDesc = "APPLICATION"; break;
        default: sourceDesc = "OTHER"; break;
    }

    String typeDesc;
    switch (severity) {
        case GL_DEBUG_TYPE_ERROR_KHR: typeDesc = "ERROR"; break;
        case GL_DEBUG_TYPE_DEPRECATED_BEHAVIOR_KHR: typeDesc = "PEPRECATED_BEHAVIOR"; break;
        case GL_DEBUG_TYPE_UNDEFINED_BEHAVIOR_KHR: typeDesc = "UNDEFINED_BEHAVIOR"; break;
        case GL_DEBUG_TYPE_PERFORMANCE_KHR: typeDesc = "PERFORMANCE"; break;
        case GL_DEBUG_TYPE_PORTABILITY_KHR: typeDesc = "PORTABILITY"; break;
        case GL_DEBUG_TYPE_MARKER_KHR: typeDesc = "MARKER"; break;
        case GL_DEBUG_TYPE_PUSH_GROUP_KHR: typeDesc = "PUSH_GROUP"; break;
        case GL_DEBUG_TYPE_POP_GROUP_KHR: typeDesc = "POP_GROUP"; break;
        default: typeDesc = "OTHER"; break;
    }

    String severityDesc;
    switch (severity) {
        case GL_DEBUG_SEVERITY_HIGH_KHR: severityDesc = "HIGH"; break;
        case GL_DEBUG_SEVERITY_MEDIUM_KHR: severityDesc = "MEDIUM"; break;
        case GL_DEBUG_SEVERITY_LOW_KHR: severityDesc = "LOW"; break;
        default: severityDesc = "NOTIFICATION"; break;
    }

    String msg = StringUtil::Format("source: %s, type: %s, severity: %s, message: %s",
                                    sourceDesc.c_str(), typeDesc.c_str(), severityDesc.c_str(),
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

GLES2Context::GLES2Context(Device *device)
: Context(device) {
}

GLES2Context::~GLES2Context() {
}

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_OSX)

bool GLES2Context::initialize(const ContextInfo &info) {

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

        EGL_CHECK(_eglDisplay = eglGetDisplay(_nativeDisplay));
        if (_eglDisplay == EGL_NO_DISPLAY) {
            EGL_CHECK(_eglDisplay = eglGetDisplay((EGLNativeDisplayType)EGL_DEFAULT_DISPLAY));
        }
    #else
        EGL_CHECK(_eglDisplay = eglGetDisplay((EGLNativeDisplayType)EGL_DEFAULT_DISPLAY));
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
        EGL_CHECK(eglBindAPI(EGL_OPENGL_ES_API));

        if (!gles2wInit()) {
            return false;
        }

        _colorFmt = Format::RGBA8;
        _depthStencilFmt = Format::D24S8;

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

        EGLint numConfigs;
        if (eglChooseConfig(_eglDisplay, attribs, &_eglConfig, 1, &numConfigs) == EGL_FALSE ||
            numConfigs <= 0) {
            CC_LOG_ERROR("Choosing configuration failed.");
            return false;
        }

        EGLint depth = attribs[13];
        EGLint stencil = attribs[15];
        CC_LOG_INFO("Setup EGLConfig: depth [%d] stencil [%d]", depth, stencil);

        if (depth == 16 && stencil == 0) {
            _depthStencilFmt = Format::D16;
        } else if (depth == 16 && stencil == 8) {
            _depthStencilFmt = Format::D16S8;
        } else if (depth == 24 && stencil == 0) {
            _depthStencilFmt = Format::D24;
        } else if (depth == 24 && stencil == 8) {
            _depthStencilFmt = Format::D24S8;
        } else if (depth == 32 && stencil == 0) {
            _depthStencilFmt = Format::D32F;
        } else if (depth == 32 && stencil == 8) {
            _depthStencilFmt = Format::D32F_S8;
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
        EGLint nFmt;
        if (eglGetConfigAttrib(_eglDisplay, _eglConfig, EGL_NATIVE_VISUAL_ID, &nFmt) == EGL_FALSE) {
            CC_LOG_ERROR("Getting configuration attributes failed.");
            return false;
        }

        uint width = _device->getWidth();
        uint height = _device->getHeight();
        ANativeWindow_setBuffersGeometry((ANativeWindow *)_windowHandle, width, height, nFmt);
    #endif

        EGL_CHECK(_eglSurface = eglCreateWindowSurface(_eglDisplay, _eglConfig, (EGLNativeWindowType)_windowHandle, NULL));
        if (_eglSurface == EGL_NO_SURFACE) {
            CC_LOG_ERROR("Window surface created failed.");
            return false;
        }

        //String eglVendor = eglQueryString(_eglDisplay, EGL_VENDOR);
        //String eglVersion = eglQueryString(_eglDisplay, EGL_VERSION);

        EGL_CHECK(_extensions = StringUtil::Split((const char *)eglQueryString(_eglDisplay, EGL_EXTENSIONS), " "));

        _majorVersion = 2;
        _minorVersion = 0;
        EGLint ctxAttribs[32];
        uint n = 0;

        bool hasKHRCreateCtx = CheckExtension(CC_TOSTR(EGL_KHR_create_context));
        if (hasKHRCreateCtx) {
    #if CC_DEBUG > 0
            ctxAttribs[n++] = EGL_CONTEXT_FLAGS_KHR;
            ctxAttribs[n++] = EGL_CONTEXT_OPENGL_DEBUG_BIT_KHR;
    #endif
            ctxAttribs[n++] = EGL_CONTEXT_MAJOR_VERSION_KHR;
            ctxAttribs[n++] = _majorVersion;
            ctxAttribs[n++] = EGL_CONTEXT_MINOR_VERSION_KHR;
            ctxAttribs[n++] = _minorVersion;
            ctxAttribs[n] = EGL_NONE;
        } else {
            ctxAttribs[n++] = EGL_CONTEXT_CLIENT_VERSION;
            ctxAttribs[n++] = _majorVersion;
            ctxAttribs[n] = EGL_NONE;
        }

        EGL_CHECK(_eglContext = eglCreateContext(_eglDisplay, _eglConfig, NULL, ctxAttribs));
        if (!_eglContext) {
            CC_LOG_ERROR("Create EGL context failed.");
            return false;
        }

        _eglSharedContext = _eglContext;

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
        EventDispatcher::addCustomEventListener(EVENT_DESTROY_WINDOW, [=](const CustomEvent &) -> void {
            if (_eglSurface != EGL_NO_SURFACE) {
                eglDestroySurface(_eglDisplay, _eglSurface);
                _eglSurface = EGL_NO_SURFACE;
            }
        });

        EventDispatcher::addCustomEventListener(EVENT_RECREATE_WINDOW, [=](const CustomEvent &event) -> void {
            _windowHandle = (uintptr_t)event.args->ptrVal;

            EGLint nFmt;
            if (eglGetConfigAttrib(_eglDisplay, _eglConfig, EGL_NATIVE_VISUAL_ID, &nFmt) == EGL_FALSE) {
                CC_LOG_ERROR("Getting configuration attributes failed.");
                return;
            }
            uint width = _device->getWidth();
            uint height = _device->getHeight();
            ANativeWindow_setBuffersGeometry((ANativeWindow *)_windowHandle, width, height, nFmt);

            EGL_CHECK(_eglSurface = eglCreateWindowSurface(_eglDisplay, _eglConfig, (EGLNativeWindowType)_windowHandle, NULL));
            if (_eglSurface == EGL_NO_SURFACE) {
                CC_LOG_ERROR("Recreate window surface failed.");
                return;
            }

            ((GLES2Context*)_device->getContext())->MakeCurrent();
        });
#endif

    } else {
        GLES2Context *sharedCtx = (GLES2Context *)info.sharedCtx;

        _majorVersion = sharedCtx->major_ver();
        _minorVersion = sharedCtx->minor_ver();
        _nativeDisplay = sharedCtx->native_display();
        _eglDisplay = sharedCtx->egl_display();
        _eglConfig = sharedCtx->egl_config();
        _eglSharedContext = sharedCtx->egl_shared_ctx();
        _eglSurface = sharedCtx->egl_surface();
        _colorFmt = sharedCtx->getColorFormat();
        _depthStencilFmt = sharedCtx->getDepthStencilFormat();
        _majorVersion = sharedCtx->major_ver();
        _minorVersion = sharedCtx->minor_ver();
        _extensions = sharedCtx->_extensions;
        _isInitialized = sharedCtx->_isInitialized;

        bool hasKHRCreateCtx = CheckExtension(CC_TOSTR(EGL_KHR_create_context));
        if (!hasKHRCreateCtx) {
            CC_LOG_INFO(
                "EGL context creation: EGL_KHR_create_context not supported. Minor version will be discarded, and debug disabled.");
            _minorVersion = 0;
        }

        EGLint ctxAttribs[32];
        uint n = 0;

        if (hasKHRCreateCtx) {
            ctxAttribs[n++] = EGL_CONTEXT_MAJOR_VERSION_KHR;
            ctxAttribs[n++] = _majorVersion;
            ctxAttribs[n++] = EGL_CONTEXT_MINOR_VERSION_KHR;
            ctxAttribs[n++] = _minorVersion;

    #if CC_DEBUG > 0
            ctxAttribs[n++] = EGL_CONTEXT_FLAGS_KHR;
            ctxAttribs[n++] = EGL_CONTEXT_OPENGL_DEBUG_BIT_KHR;
    #endif
        } else {
            ctxAttribs[n++] = EGL_CONTEXT_CLIENT_VERSION;
            ctxAttribs[n++] = _majorVersion;
        }

        ctxAttribs[n] = EGL_NONE;

        EGL_CHECK(_eglContext = eglCreateContext(_eglDisplay, _eglConfig, _eglSharedContext, ctxAttribs));
        if (!_eglContext) {
            CC_LOG_ERROR("Create EGL context with share context [0x%p] failed.", _eglSharedContext);
            return false;
        }
    }

    return true;

}

void GLES2Context::destroy() {
    if (_eglContext != EGL_NO_CONTEXT) {
        EGL_CHECK(eglDestroyContext(_eglDisplay, _eglContext));
        _eglContext = EGL_NO_CONTEXT;
    }

    if (_isPrimaryContex && _eglSurface != EGL_NO_SURFACE) {
        EGL_CHECK(eglDestroySurface(_eglDisplay, _eglSurface));
        _eglSurface = EGL_NO_SURFACE;
    }

    EGL_CHECK(eglMakeCurrent(_eglDisplay, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT));

    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    if (_isPrimaryContex && _nativeDisplay) {
        ReleaseDC((HWND)_windowHandle, _nativeDisplay);
    }
    #endif

    _isPrimaryContex = false;
    _windowHandle = 0;
    _nativeDisplay = 0;
    _vsyncMode = VsyncMode::OFF;
    _isInitialized = false;
}

bool GLES2Context::MakeCurrentImpl(bool bound) {
    bool succeeded;
    EGL_CHECK(succeeded = eglMakeCurrent(_eglDisplay,
        bound ? _eglSurface : EGL_NO_SURFACE,
        bound ? _eglSurface : EGL_NO_SURFACE,
        bound ? _eglContext : EGL_NO_CONTEXT
    ));
    return succeeded;
}

void GLES2Context::present() {
    EGL_CHECK(eglSwapBuffers(_eglDisplay, _eglSurface));
}

#endif

bool GLES2Context::MakeCurrent(bool bound) {
    if (!bound) {
        CC_LOG_DEBUG("eglMakeCurrent() - UNBOUNDED, Context: 0x%p", this);
        return MakeCurrentImpl(false);
    }

    if (MakeCurrentImpl(bound)) {
        if (!_isInitialized) {

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_ANDROID)
            // Turn on or off the vertical sync depending on the input bool value.
            int interval = 1;
            switch (_vsyncMode) {
                case VsyncMode::OFF: interval = 0; break;
                case VsyncMode::ON: interval = 1; break;
                case VsyncMode::RELAXED: interval = 1; break;
                case VsyncMode::MAILBOX: interval = 0; break;
                case VsyncMode::HALF: interval = 2; break;
                default: break;
            }

            if (eglSwapInterval(_eglDisplay, interval) != 1) {
                CC_LOG_ERROR("wglSwapInterval() - FAILED.");
                return false;
            }
#endif

#if CC_DEBUG > 0 && CC_PLATFORM != CC_PLATFORM_MAC_IOS
            GL_CHECK(glEnable(GL_DEBUG_OUTPUT_SYNCHRONOUS_KHR));
            GL_CHECK(glDebugMessageControlKHR(GL_DONT_CARE, GL_DONT_CARE, GL_DONT_CARE, 0, NULL, GL_TRUE));
            GL_CHECK(glDebugMessageCallbackKHR(GLES2EGLDebugProc, NULL));
#endif

            _isInitialized = true;
        }

        //////////////////////////////////////////////////////////////////////////

        GL_CHECK(glPixelStorei(GL_PACK_ALIGNMENT, 1));
        GL_CHECK(glPixelStorei(GL_UNPACK_ALIGNMENT, 1));
        GL_CHECK(glActiveTexture(GL_TEXTURE0));

        //////////////////////////////////////////////////////////////////////////

        GL_CHECK(glEnable(GL_SCISSOR_TEST));
        GL_CHECK(glEnable(GL_CULL_FACE));
        GL_CHECK(glCullFace(GL_BACK));

        GL_CHECK(glFrontFace(GL_CCW));

        //GL_CHECK(glDisable(GL_MULTISAMPLE));

        //////////////////////////////////////////////////////////////////////////
        // DepthStencilState
        GL_CHECK(glEnable(GL_DEPTH_TEST));
        GL_CHECK(glDepthMask(GL_TRUE));
        GL_CHECK(glDepthFunc(GL_LESS));

        GL_CHECK(glStencilFuncSeparate(GL_FRONT, GL_ALWAYS, 1, 0xffffffff));
        GL_CHECK(glStencilOpSeparate(GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP));
        GL_CHECK(glStencilMaskSeparate(GL_FRONT, 0xffffffff));
        GL_CHECK(glStencilFuncSeparate(GL_BACK, GL_ALWAYS, 1, 0xffffffff));
        GL_CHECK(glStencilOpSeparate(GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP));
        GL_CHECK(glStencilMaskSeparate(GL_BACK, 0xffffffff));

        GL_CHECK(glDisable(GL_STENCIL_TEST));

        //////////////////////////////////////////////////////////////////////////
        // BlendState

        GL_CHECK(glDisable(GL_SAMPLE_ALPHA_TO_COVERAGE));
        GL_CHECK(glDisable(GL_BLEND));
        GL_CHECK(glBlendEquationSeparate(GL_FUNC_ADD, GL_FUNC_ADD));
        GL_CHECK(glBlendFuncSeparate(GL_ONE, GL_ZERO, GL_ONE, GL_ZERO));
        GL_CHECK(glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE));
        GL_CHECK(glBlendColor((GLclampf)0.0f, (GLclampf)0.0f, (GLclampf)0.0f, (GLclampf)0.0f));

        CC_LOG_DEBUG("eglMakeCurrent() - SUCCEEDED, Context: 0x%p", this);
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
