/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "GLES2Std.h"

#include "GLES2Context.h"
#include "GLES2Device.h"
#include "GLES2GPUObjects.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include "android/native_window.h"
#endif

#define FORCE_DISABLE_VALIDATION 1

namespace cc {
namespace gfx {

#if CC_DEBUG > 0 && defined(GL_DEBUG_SOURCE_API_KHR)

void GL_APIENTRY GLES2EGLDebugProc(GLenum source,
                                   GLenum type, GLuint id,
                                   GLenum severity, GLsizei length,
                                   const GLchar *message,
                                   const void *  userParam) {
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
    switch (type) {
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

    String msg = StringUtil::format("source: %s, type: %s, severity: %s, message: %s",
                                    sourceDesc.c_str(), typeDesc.c_str(), severityDesc.c_str(),
                                    message);

    if (severity == GL_DEBUG_SEVERITY_HIGH_KHR) {
        CC_LOG_WARNING(msg.c_str());
    } else {
        CC_LOG_DEBUG(msg.c_str());
    }
}

#endif

GLES2Context::GLES2Context() = default;

GLES2Context::~GLES2Context() = default;

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_OSX)

bool GLES2Context::doInit(const ContextInfo &info) {
    _vsyncMode    = info.vsyncMode;
    _windowHandle = info.windowHandle;
    auto *window  = reinterpret_cast<EGLNativeWindowType>(_windowHandle); // NOLINT(performance-no-int-to-ptr)

    //////////////////////////////////////////////////////////////////////////

    if (!info.sharedCtx) {
        if (!gles2wInit()) {
            return false;
        }

        _isPrimaryContex = true;
        _windowHandle    = info.windowHandle;

    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        _nativeDisplay = GetDC(window);
        if (!_nativeDisplay) {
            return false;
        }

        EGL_CHECK(_eglDisplay = eglGetDisplay(_nativeDisplay));
        if (_eglDisplay == EGL_NO_DISPLAY) {
            EGL_CHECK(_eglDisplay = eglGetDisplay(EGL_DEFAULT_DISPLAY));
        }
    #else
        EGL_CHECK(_eglDisplay = eglGetDisplay(EGL_DEFAULT_DISPLAY));
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

        _colorFmt        = Format::RGBA8;
        _depthStencilFmt = Format::D24S8;

        bool   msaaEnabled = info.msaaEnabled;
        EGLint redSize{8};
        EGLint greenSize{8};
        EGLint blueSize{8};
        EGLint alphaSize{8};
        EGLint depthSize{24};
        EGLint stencilSize{8};
        EGLint sampleBufferSize{msaaEnabled ? EGL_DONT_CARE : 0};
        EGLint sampleSize{msaaEnabled ? EGL_DONT_CARE : 0};

        EGLint defaultAttribs[] = {
            EGL_SURFACE_TYPE, EGL_WINDOW_BIT | EGL_PBUFFER_BIT,
            EGL_RENDERABLE_TYPE, EGL_OPENGL_ES2_BIT,
            // EGL_BUFFER_SIZE, colorBuffSize,
            EGL_BLUE_SIZE, blueSize,
            EGL_GREEN_SIZE, greenSize,
            EGL_RED_SIZE, redSize,
            EGL_ALPHA_SIZE, alphaSize,
            EGL_DEPTH_SIZE, depthSize,
            EGL_STENCIL_SIZE, stencilSize,
            EGL_SAMPLE_BUFFERS, sampleBufferSize,
            EGL_SAMPLES, sampleSize,
            EGL_NONE};

        int numConfig = 0;

        EGLConfig cfgs[128];

        eglGetConfigs(_eglDisplay, cfgs, 128, &numConfig);
        if (eglChooseConfig(_eglDisplay, defaultAttribs, nullptr, 0, &numConfig)) {
            _vecEGLConfig.resize(numConfig);
        } else {
            CC_LOG_ERROR("Query configuration failed.");
            return false;
        }

        int count = numConfig;
        if (eglChooseConfig(_eglDisplay, defaultAttribs, _vecEGLConfig.data(), count, &numConfig) == EGL_FALSE || !numConfig) {
            CC_LOG_ERROR("eglChooseConfig configuration failed.");
            return false;
        }

        EGLint        depth{0};
        EGLint        stencil{0};
        const uint8_t attrNums         = 8;
        EGLint        params[attrNums] = {0};
        bool          matched          = false;
        const bool    qualityPreferred = info.performance == Performance::HIGH_QUALITY;
        uint64_t      lastScore        = qualityPreferred ? std::numeric_limits<uint64_t>::min() : std::numeric_limits<uint64_t>::max();

        for (int i = 0; i < numConfig; i++) {
            int depthValue{0};
            eglGetConfigAttrib(_eglDisplay, _vecEGLConfig[i], EGL_RED_SIZE, &params[0]);
            eglGetConfigAttrib(_eglDisplay, _vecEGLConfig[i], EGL_GREEN_SIZE, &params[1]);
            eglGetConfigAttrib(_eglDisplay, _vecEGLConfig[i], EGL_BLUE_SIZE, &params[2]);
            eglGetConfigAttrib(_eglDisplay, _vecEGLConfig[i], EGL_ALPHA_SIZE, &params[3]);
            eglGetConfigAttrib(_eglDisplay, _vecEGLConfig[i], EGL_DEPTH_SIZE, &params[4]);
            eglGetConfigAttrib(_eglDisplay, _vecEGLConfig[i], EGL_STENCIL_SIZE, &params[5]);
            eglGetConfigAttrib(_eglDisplay, _vecEGLConfig[i], EGL_SAMPLE_BUFFERS, &params[6]);
            eglGetConfigAttrib(_eglDisplay, _vecEGLConfig[i], EGL_SAMPLES, &params[7]);
            eglGetConfigAttrib(_eglDisplay, _vecEGLConfig[i], EGL_DEPTH_ENCODING_NV, &depthValue);

            int bNonLinearDepth = (depthValue == EGL_DEPTH_ENCODING_NONLINEAR_NV) ? 1 : 0;

            /*------------------------------------------ANGLE's priority-----------------------------------------------*/
            // Favor EGLConfigLists by RGB, then Depth, then Non-linear Depth, then Stencil, then Alpha
            uint64_t currScore{0};
            EGLint   colorScore = std::abs(params[0] - redSize) + std::abs(params[1] - greenSize) + std::abs(params[2] - blueSize);
            currScore |= static_cast<uint64_t>(std::min(std::max(params[6], 0), 15)) << 29;
            currScore |= static_cast<uint64_t>(std::min(std::max(params[7], 0), 31)) << 24;
            currScore |= static_cast<uint64_t>(std::min(colorScore, 127)) << 17;
            currScore |= static_cast<uint64_t>(std::min(std::abs(params[4] - depthSize), 63)) << 11;
            currScore |= static_cast<uint64_t>(std::min(std::abs(1 - bNonLinearDepth), 1)) << 10;
            currScore |= static_cast<uint64_t>(std::min(std::abs(params[5] - stencilSize), 31)) << 6;
            currScore |= static_cast<uint64_t>(std::min(std::abs(params[3] - alphaSize), 31)) << 0;
            /*------------------------------------------ANGLE's priority-----------------------------------------------*/

            // if msaaEnabled, sampleBuffers and sampleCount should be greater than 0, until iterate to the last one(can't find).
            bool msaaLimit = (msaaEnabled ? (params[6] > 0 && params[7] > 0) : (params[6] == 0 && params[7] == 0));
            // performancePreferred ? [>=] : [<] , egl configurations store in "ascending order"
            bool filter = (currScore < lastScore) ^ qualityPreferred;
            if ((filter && msaaLimit) || (!matched && i == numConfig - 1)) {
                _eglConfig     = _vecEGLConfig[i];
                depth          = params[4];
                stencil        = params[5];
                _sampleBuffers = static_cast<uint8_t>(params[6]);
                _sampleCount   = static_cast<uint8_t>(params[7]);
                lastScore      = currScore;
                matched        = true;
            }
        }

        //    Find a suitable EGLConfig
        //    eglChooseConfig is provided by EGL to provide an easy way to select an appropriate configuration. It takes in the capabilities
        //    specified in the attribute list, and returns a list of available configurations that match or exceed the capabilities requested.
        //    Details of all the possible attributes and how they are selected for by this function are available in the EGL reference pages here:
        //    http://www.khronos.org/registry/egl/sdk/docs/man/xhtml/eglChooseConfig.html
        //    It is also possible to simply get the entire list of configurations and use a custom algorithm to choose a suitable one, as many
        //    advanced applications choose to do. For this application however, taking the first EGLConfig that the function returns suits
        //    its needs perfectly, so we limit it to returning a single EGLConfig.

        CC_LOG_INFO("Setup EGLConfig: depth [%d] stencil [%d] sampleBuffer [%d] sampleCount [%d]", depth, stencil, _sampleBuffers, _sampleCount);

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
                    GFX_FORMAT_INFOS[static_cast<uint>(_colorFmt)].name.c_str(),
                    GFX_FORMAT_INFOS[static_cast<uint>(_depthStencilFmt)].name.c_str());

        /**
         * EGL_NATIVE_VISUAL_ID is an attribute of the EGLConfig that is
         * guaranteed to be accepted by ANativeWindow_setBuffersGeometry().
         * As soon as we picked a EGLConfig, we can safely reconfigure the
         * ANativeWindow buffers to match, using EGL_NATIVE_VISUAL_ID.
         */

    #if (CC_PLATFORM == CC_PLATFORM_ANDROID)
        EGLint nFmt = 0;

        if (eglGetConfigAttrib(_eglDisplay, _eglConfig, EGL_NATIVE_VISUAL_ID, &nFmt) == EGL_FALSE) {
            CC_LOG_ERROR("Getting configuration attributes failed.");
            return false;
        }

        auto width  = static_cast<int32_t>(GLES2Device::getInstance()->getWidth());
        auto height = static_cast<int32_t>(GLES2Device::getInstance()->getHeight());

        ANativeWindow_setBuffersGeometry(window, width, height, nFmt);
    #endif

        EGL_CHECK(_eglSurface = eglCreateWindowSurface(_eglDisplay, _eglConfig, window, nullptr));
        if (_eglSurface == EGL_NO_SURFACE) {
            CC_LOG_ERROR("Window surface created failed.");
            return false;
        }

        EGL_CHECK(_extensions = StringUtil::split(eglQueryString(_eglDisplay, EGL_EXTENSIONS), " "));

        _majorVersion = 2;
        _minorVersion = 0;
        EGLint ctxAttribs[32];
        uint   n = 0;

        bool hasKHRCreateCtx = checkExtension(CC_TOSTR(EGL_KHR_create_context));
        if (hasKHRCreateCtx) {
    #if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION
            ctxAttribs[n++] = EGL_CONTEXT_FLAGS_KHR;
            ctxAttribs[n++] = EGL_CONTEXT_OPENGL_DEBUG_BIT_KHR;
    #endif
            ctxAttribs[n++] = EGL_CONTEXT_MAJOR_VERSION_KHR;
            ctxAttribs[n++] = _majorVersion;
            ctxAttribs[n++] = EGL_CONTEXT_MINOR_VERSION_KHR;
            ctxAttribs[n++] = _minorVersion;
            ctxAttribs[n]   = EGL_NONE;
        } else {
            ctxAttribs[n++] = EGL_CONTEXT_CLIENT_VERSION;
            ctxAttribs[n++] = _majorVersion;
            ctxAttribs[n]   = EGL_NONE;
        }

        EGL_CHECK(_eglContext = eglCreateContext(_eglDisplay, _eglConfig, nullptr, ctxAttribs));
        if (!_eglContext) {
            CC_LOG_ERROR("Create EGL context failed.");
            return false;
        }

        _eglSharedContext = _eglContext;
    } else {
        auto *sharedCtx = static_cast<GLES2Context *>(info.sharedCtx);

        _majorVersion     = sharedCtx->majorVer();
        _minorVersion     = sharedCtx->minorVer();
        _nativeDisplay    = sharedCtx->nativeDisplay();
        _eglDisplay       = sharedCtx->eglDisplay();
        _eglConfig        = sharedCtx->eglConfig();
        _eglSharedContext = sharedCtx->eglSharedCtx();
        _eglSurface       = sharedCtx->eglSurface();
        _colorFmt         = sharedCtx->getColorFormat();
        _depthStencilFmt  = sharedCtx->getDepthStencilFormat();
        _majorVersion     = sharedCtx->majorVer();
        _minorVersion     = sharedCtx->minorVer();
        _extensions       = sharedCtx->_extensions;
        _isInitialized    = sharedCtx->_isInitialized;

        bool hasKHRCreateCtx = checkExtension(CC_TOSTR(EGL_KHR_create_context));
        if (!hasKHRCreateCtx) {
            CC_LOG_INFO(
                "EGL context creation: EGL_KHR_create_context not supported. Minor version will be discarded, and debug disabled.");
            _minorVersion = 0;
        }

        EGLint ctxAttribs[32];
        uint   n = 0;

        if (hasKHRCreateCtx) {
            ctxAttribs[n++] = EGL_CONTEXT_MAJOR_VERSION_KHR;
            ctxAttribs[n++] = _majorVersion;
            ctxAttribs[n++] = EGL_CONTEXT_MINOR_VERSION_KHR;
            ctxAttribs[n++] = _minorVersion;

    #if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION
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

void GLES2Context::doDestroy() {
    if (_eglDisplay) {
        EGL_CHECK(eglMakeCurrent(_eglDisplay, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT));
    }

    if (!_vecEGLConfig.empty()) {
        _vecEGLConfig.clear();
    }

    if (_eglContext != EGL_NO_CONTEXT) {
        EGL_CHECK(eglDestroyContext(_eglDisplay, _eglContext));
        _eglContext = EGL_NO_CONTEXT;
    }

    if (_isPrimaryContex) {
        if (_eglSurface != EGL_NO_SURFACE) {
            EGL_CHECK(eglDestroySurface(_eglDisplay, _eglSurface));
            _eglSurface = EGL_NO_SURFACE;
        }

        if (_eglDisplay != EGL_NO_DISPLAY) {
            EGL_CHECK(eglTerminate(_eglDisplay));
            _eglDisplay = EGL_NO_DISPLAY;
        }

    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        if (_nativeDisplay) {
            ReleaseDC(reinterpret_cast<HWND>(_windowHandle), _nativeDisplay);
        }
    #endif
    }

    _isPrimaryContex = false;
    _windowHandle    = 0;
    _nativeDisplay   = 0; // NOLINT(modernize-use-nullptr) portability issues
    _vsyncMode       = VsyncMode::OFF;
    _isInitialized   = false;
}

void GLES2Context::releaseSurface(uintptr_t /*windowHandle*/) {
    #if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    if (_eglSurface != EGL_NO_SURFACE) {
        eglDestroySurface(_eglDisplay, _eglSurface);
        _eglSurface = EGL_NO_SURFACE;
    }
    #endif
}

void GLES2Context::acquireSurface(uintptr_t windowHandle) {
    #if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    {
        _windowHandle = windowHandle;
        auto *window  = reinterpret_cast<EGLNativeWindowType>(_windowHandle); // NOLINT(performance-no-int-to-ptr)

        EGLint nFmt = 0;
        if (eglGetConfigAttrib(_eglDisplay, _eglConfig, EGL_NATIVE_VISUAL_ID, &nFmt) == EGL_FALSE) {
            CC_LOG_ERROR("Getting configuration attributes failed.");
            return;
        }

        // Device's size will be updated after recreate window (in resize event) and is incorrect for now.
        int32_t width  = ANativeWindow_getWidth(window);
        int32_t height = ANativeWindow_getHeight(window);
        ANativeWindow_setBuffersGeometry(window, width, height, nFmt);
        GLES2Device::getInstance()->resize(width, height);

        EGL_CHECK(_eglSurface = eglCreateWindowSurface(_eglDisplay, _eglConfig, window, nullptr));
        if (_eglSurface == EGL_NO_SURFACE) {
            CC_LOG_ERROR("Recreate window surface failed.");
            return;
        }

        static_cast<GLES2Context *>(GLES2Device::getInstance()->getContext())->makeCurrent();
        GLES2Device::getInstance()->stateCache()->reset();
    }
    #endif
}

bool GLES2Context::makeCurrentImpl(bool bound) {
    bool succeeded;
    EGL_CHECK(succeeded = eglMakeCurrent(_eglDisplay,
                                         bound ? _eglSurface : EGL_NO_SURFACE,
                                         bound ? _eglSurface : EGL_NO_SURFACE,
                                         bound ? _eglContext : EGL_NO_CONTEXT));
    return succeeded;
}

void GLES2Context::present() {
    EGL_CHECK(eglSwapBuffers(_eglDisplay, _eglSurface));
}

#endif

bool GLES2Context::makeCurrent(bool bound) {
    if (!bound) {
        CC_LOG_DEBUG("eglMakeCurrent() - UNBOUNDED, Context: 0x%p", this);
        return makeCurrentImpl(false);
    }

    if (makeCurrentImpl(bound)) {
#if (CC_PLATFORM != CC_PLATFORM_MAC_IOS)
        if (!_isInitialized) {
            // Turn on or off the vertical sync depending on the input bool value.
            int interval = 1;
            switch (_vsyncMode) {
                case VsyncMode::OFF: interval = 0; break;
                case VsyncMode::ON:
                case VsyncMode::RELAXED: interval = 1; break;
                case VsyncMode::MAILBOX: interval = 0; break;
                case VsyncMode::HALF: interval = 2; break;
                default: break;
            }

            if (eglSwapInterval(_eglDisplay, interval) != 1) {
                CC_LOG_ERROR("wglSwapInterval() - FAILED.");
                return false;
            }
            _isInitialized = true;
        }

    #if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION && defined(GL_DEBUG_SOURCE_API_KHR)
        GL_CHECK(glEnable(GL_DEBUG_OUTPUT_SYNCHRONOUS_KHR));
        if (glDebugMessageControlKHR) {
            GL_CHECK(glDebugMessageControlKHR(GL_DONT_CARE, GL_DONT_CARE, GL_DONT_CARE, 0, NULL, GL_TRUE));
        }
        if (glDebugMessageCallbackKHR) {
            GL_CHECK(glDebugMessageCallbackKHR(GLES2EGLDebugProc, NULL));
        }
    #endif

#endif

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
        GL_CHECK(glBlendColor(0.0F, 0.0F, 0.0F, 0.0F));

        GL_CHECK(glUseProgram(0));

        GL_CHECK(glBindVertexArrayOES(0));

        GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, 0));
        GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0));

        GL_CHECK(glBindTexture(GL_TEXTURE_2D, 0));
        GL_CHECK(glBindTexture(GL_TEXTURE_CUBE_MAP, 0));

        GL_CHECK(glBindFramebuffer(GL_FRAMEBUFFER, 0));

        CC_LOG_DEBUG("eglMakeCurrent() - SUCCEEDED, Context: 0x%p", this);
        return true;
    }
    CC_LOG_ERROR("MakeCurrent() - FAILED, Context: 0x%p", this);
    return false;
}

bool GLES2Context::checkExtension(const String &extension) const {
    return (std::find(_extensions.begin(), _extensions.end(), extension) != _extensions.end());
}

} // namespace gfx
} // namespace cc
