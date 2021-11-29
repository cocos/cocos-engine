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

#include "GLES3GPUObjects.h"

#define FORCE_DISABLE_VALIDATION 1

namespace cc {
namespace gfx {

#if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION
constexpr uint32_t DISABLE_VALIDATION_ASSERTIONS = 1; // 0 for default behavior, otherwise assertions will be disabled

void GL_APIENTRY GLES3EGLDebugProc(GLenum source, GLenum type, GLuint id, GLenum severity, GLsizei length, const GLchar *message, const void *userParam) {
    String sourceDesc;
    switch (source) {
        case GL_DEBUG_SOURCE_API_KHR: sourceDesc = "API"; break;
        case GL_DEBUG_SOURCE_SHADER_COMPILER_KHR: sourceDesc = "SHADER_COMPILER"; break;
        case GL_DEBUG_SOURCE_WINDOW_SYSTEM_KHR: sourceDesc = "WINDOW_SYSTEM"; break;
        case GL_DEBUG_SOURCE_THIRD_PARTY_KHR: sourceDesc = "THIRD_PARTY"; break;
        case GL_DEBUG_SOURCE_APPLICATION_KHR: sourceDesc = "APPLICATION"; break;
        default: sourceDesc = "OTHER";
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
        default: typeDesc = "OTHER";
    }

    String severityDesc;
    switch (severity) {
        case GL_DEBUG_SEVERITY_HIGH_KHR: severityDesc = "HIGH"; break;
        case GL_DEBUG_SEVERITY_MEDIUM_KHR: severityDesc = "MEDIUM"; break;
        case GL_DEBUG_SEVERITY_LOW_KHR: severityDesc = "LOW"; break;
        default: severityDesc = "NOTIFICATION";
    }

    String msg = StringUtil::format("source: %s, type: %s, severity: %s, message: %s",
                                    sourceDesc.c_str(), typeDesc.c_str(), severityDesc.c_str(), message);

    if (severity == GL_DEBUG_SEVERITY_HIGH_KHR) {
        CC_LOG_ERROR(msg.c_str());
        CCASSERT(DISABLE_VALIDATION_ASSERTIONS, "Validation Error");
    } else if (severity == GL_DEBUG_SEVERITY_MEDIUM_KHR) {
        CC_LOG_WARNING(msg.c_str());
    } else {
        CC_LOG_DEBUG(msg.c_str());
    }
}
#endif

bool GLES3GPUContext::initialize(GLES3GPUStateCache *stateCache, GLES3GPUConstantRegistry *constantRegistry) {
    _stateCache       = stateCache;
    _constantRegistry = constantRegistry;

    if (!gles3wInit()) {
        return false;
    }

    EGL_CHECK(eglDisplay = eglGetDisplay(EGL_DEFAULT_DISPLAY));

    if (eglDisplay == EGL_NO_DISPLAY) {
        CC_LOG_ERROR("eglGetDisplay() - FAILED.");
        return false;
    }

    EGLBoolean success{false};
    EGL_CHECK(success = eglInitialize(eglDisplay, &eglMajorVersion, &eglMinorVersion));

    if (!success) {
        CC_LOG_ERROR("eglInitialize() - FAILED.");
        return false;
    }

    EGL_CHECK(eglBindAPI(EGL_OPENGL_ES_API));

    bool msaaEnabled{false};
    bool qualityPreferred{false};

    EGLint redSize{8};
    EGLint greenSize{8};
    EGLint blueSize{8};
    EGLint alphaSize{8};
    EGLint depthSize{24};
    EGLint stencilSize{8};
    EGLint sampleBufferSize{msaaEnabled ? EGL_DONT_CARE : 0};
    EGLint sampleSize{msaaEnabled ? EGL_DONT_CARE : 0};

    EGLint defaultAttribs[]{
        EGL_SURFACE_TYPE, EGL_WINDOW_BIT | EGL_PBUFFER_BIT,
        EGL_RENDERABLE_TYPE, EGL_OPENGL_ES3_BIT_KHR,
        EGL_BLUE_SIZE, blueSize,
        EGL_GREEN_SIZE, greenSize,
        EGL_RED_SIZE, redSize,
        EGL_ALPHA_SIZE, alphaSize,
        EGL_DEPTH_SIZE, depthSize,
        EGL_STENCIL_SIZE, stencilSize,
        EGL_SAMPLE_BUFFERS, sampleBufferSize,
        EGL_SAMPLES, sampleSize,
        EGL_NONE};

    int               numConfig{0};
    vector<EGLConfig> eglConfigs;

    EGL_CHECK(success = eglChooseConfig(eglDisplay, defaultAttribs, nullptr, 0, &numConfig));
    if (success) {
        eglConfigs.resize(numConfig);
    } else {
        CC_LOG_ERROR("Query configuration failed.");
        return false;
    }

    int count = numConfig;
    EGL_CHECK(success = eglChooseConfig(eglDisplay, defaultAttribs, eglConfigs.data(), count, &numConfig));
    if (!success || !numConfig) {
        CC_LOG_ERROR("eglChooseConfig configuration failed.");
        return false;
    }

    EGLint   depth{0};
    EGLint   stencil{0};
    EGLint   sampleBuffers{0};
    EGLint   sampleCount{0};
    EGLint   params[8]{0};
    uint64_t lastScore = qualityPreferred ? std::numeric_limits<uint64_t>::min() : std::numeric_limits<uint64_t>::max();

    for (int i = 0; i < numConfig; i++) {
        int depthValue{0};
        eglGetConfigAttrib(eglDisplay, eglConfigs[i], EGL_RED_SIZE, &params[0]);
        eglGetConfigAttrib(eglDisplay, eglConfigs[i], EGL_GREEN_SIZE, &params[1]);
        eglGetConfigAttrib(eglDisplay, eglConfigs[i], EGL_BLUE_SIZE, &params[2]);
        eglGetConfigAttrib(eglDisplay, eglConfigs[i], EGL_ALPHA_SIZE, &params[3]);
        eglGetConfigAttrib(eglDisplay, eglConfigs[i], EGL_DEPTH_SIZE, &params[4]);
        eglGetConfigAttrib(eglDisplay, eglConfigs[i], EGL_STENCIL_SIZE, &params[5]);
        eglGetConfigAttrib(eglDisplay, eglConfigs[i], EGL_SAMPLE_BUFFERS, &params[6]);
        eglGetConfigAttrib(eglDisplay, eglConfigs[i], EGL_SAMPLES, &params[7]);
        eglGetConfigAttrib(eglDisplay, eglConfigs[i], EGL_DEPTH_ENCODING_NV, &depthValue);

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
        if ((filter && msaaLimit) || (!eglConfig && i == numConfig - 1)) {
            eglConfig     = eglConfigs[i];
            depth         = params[4];
            stencil       = params[5];
            sampleBuffers = params[6];
            sampleCount   = params[7];
            lastScore     = currScore;
        }
    }

    CC_LOG_INFO("Setup EGLConfig: depth [%d] stencil [%d] sampleBuffer [%d] sampleCount [%d]", depth, stencil, sampleBuffers, sampleCount);

    EGL_CHECK(_extensions = StringUtil::split(eglQueryString(eglDisplay, EGL_EXTENSIONS), " "));

    bool hasKHRCreateCtx = checkExtension(CC_TOSTR(EGL_KHR_create_context));
    if (hasKHRCreateCtx) {
        eglAttributes.push_back(EGL_CONTEXT_MAJOR_VERSION_KHR);
        eglAttributes.push_back(3);
        eglAttributes.push_back(EGL_CONTEXT_MINOR_VERSION_KHR);
        eglAttributes.push_back(2);
#if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION
        eglAttributes.push_back(EGL_CONTEXT_FLAGS_KHR);
        eglAttributes.push_back(EGL_CONTEXT_OPENGL_DEBUG_BIT_KHR);
#endif
        eglAttributes.push_back(EGL_NONE);

        for (int m = 2; m >= 0; --m) {
            eglAttributes[3]  = m;
            eglDefaultContext = eglCreateContext(eglDisplay, eglConfig, nullptr, eglAttributes.data());
            EGLint err        = eglGetError(); // QNX throws egl errors on mismatch
            if (eglDefaultContext && err == EGL_SUCCESS) {
                _constantRegistry->glMinorVersion = m;
                break;
            }
        }
    } else {
        eglAttributes.push_back(EGL_CONTEXT_CLIENT_VERSION);
        eglAttributes.push_back(3);
        eglAttributes.push_back(EGL_NONE);

        EGL_CHECK(eglDefaultContext = eglCreateContext(eglDisplay, eglConfig, nullptr, eglAttributes.data()));
    }

    if (!eglDefaultContext) {
        CC_LOG_ERROR("Create EGL context failed.");
        return false;
    }

    EGLint pbufferAttribs[]{
        EGL_WIDTH, 1,
        EGL_HEIGHT, 1,
        EGL_NONE};
    EGL_CHECK(eglDefaultSurface = eglCreatePbufferSurface(eglDisplay, eglConfig, pbufferAttribs));

    size_t threadID{std::hash<std::thread::id>{}(std::this_thread::get_id())};
    _sharedContexts[threadID] = eglDefaultContext;

    makeCurrent(eglDefaultSurface, eglDefaultSurface, eglDefaultContext);
    resetStates();

    return true;
}

void GLES3GPUContext::destroy() {
    if (eglDisplay) {
        makeCurrent(EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT);
    }

    if (eglDefaultSurface) {
        EGL_CHECK(eglDestroySurface(eglDisplay, eglDefaultSurface));
        eglDefaultSurface = EGL_NO_SURFACE;
    }

    for (auto pair : _sharedContexts) {
        if (pair.second != eglDefaultContext) {
            EGL_CHECK(eglDestroyContext(eglDisplay, pair.second));
        }
    }
    _sharedContexts.clear();

    if (eglDefaultContext) {
        EGL_CHECK(eglDestroyContext(eglDisplay, eglDefaultContext));
        eglDefaultContext = EGL_NO_SURFACE;
    }

    if (eglDisplay) {
        EGL_CHECK(eglTerminate(eglDisplay));
        eglDisplay = EGL_NO_DISPLAY;
    }
}

void GLES3GPUContext::bindContext(bool bound) {
    if (bound) {
        makeCurrent(_eglCurrentDrawSurface, _eglCurrentReadSurface, eglDefaultContext);
        resetStates();
    } else {
        makeCurrent(EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT, false);
        _eglCurrentDrawSurface = EGL_NO_SURFACE;
        _eglCurrentReadSurface = EGL_NO_SURFACE;
    }
}

void GLES3GPUContext::makeCurrent(const GLES3GPUSwapchain *drawSwapchain, const GLES3GPUSwapchain *readSwapchain) {
    EGLSurface drawSurface = drawSwapchain ? drawSwapchain->eglSurface : _eglCurrentDrawSurface;
    EGLSurface readSurface = readSwapchain ? readSwapchain->eglSurface : _eglCurrentReadSurface;
    if (_eglCurrentDrawSurface == drawSurface && _eglCurrentReadSurface == readSurface) return;

    makeCurrent(drawSurface, readSurface, _eglCurrentContext);
}

void GLES3GPUContext::present(const GLES3GPUSwapchain *swapchain) {
    if (_eglCurrentInterval != swapchain->eglSwapInterval) {
        if (!eglSwapInterval(eglDisplay, swapchain->eglSwapInterval)) {
            CC_LOG_ERROR("eglSwapInterval() - FAILED.");
        }
        _eglCurrentInterval = swapchain->eglSwapInterval;
    }
    EGL_CHECK(eglSwapBuffers(eglDisplay, swapchain->eglSurface));
}

EGLContext GLES3GPUContext::getSharedContext() {
    size_t threadID{std::hash<std::thread::id>{}(std::this_thread::get_id())};
    if (_sharedContexts.count(threadID)) return _sharedContexts[threadID];

    EGLContext context = EGL_NO_CONTEXT;
    EGL_CHECK(context = eglCreateContext(eglDisplay, eglConfig, eglDefaultContext, eglAttributes.data()));

    if (!context) {
        CC_LOG_ERROR("Create shared context failed.");
        return EGL_NO_CONTEXT;
    }

    _sharedContexts[threadID] = context;
    return context;
}

bool GLES3GPUContext::makeCurrent(EGLSurface drawSurface, EGLSurface readSurface, EGLContext context, bool updateCache) {
    bool succeeded;
    EGL_CHECK(succeeded = eglMakeCurrent(eglDisplay, drawSurface, readSurface, context));
    if (succeeded && updateCache) {
        _eglCurrentDrawSurface = drawSurface;
        _eglCurrentReadSurface = readSurface;
        _eglCurrentContext     = context;
    }
    return succeeded;
}

// NOLINTNEXTLINE(google-readability-function-size, readability-function-size)
void GLES3GPUContext::resetStates() const {
    GL_CHECK(glPixelStorei(GL_PACK_ALIGNMENT, 1));
    GL_CHECK(glPixelStorei(GL_UNPACK_ALIGNMENT, 1));
    GL_CHECK(glActiveTexture(GL_TEXTURE0));

    //////////////////////////////////////////////////////////////////////////

    GL_CHECK(glEnable(GL_SCISSOR_TEST));
    GL_CHECK(glEnable(GL_CULL_FACE));
    GL_CHECK(glCullFace(GL_BACK));

    GL_CHECK(glFrontFace(GL_CCW));

    GL_CHECK(glDisable(GL_SAMPLE_COVERAGE));

    //////////////////////////////////////////////////////////////////////////

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

    GL_CHECK(glDisable(GL_SAMPLE_ALPHA_TO_COVERAGE));
    GL_CHECK(glDisable(GL_BLEND));
    GL_CHECK(glBlendEquationSeparate(GL_FUNC_ADD, GL_FUNC_ADD));
    GL_CHECK(glBlendFuncSeparate(GL_ONE, GL_ZERO, GL_ONE, GL_ZERO));
    GL_CHECK(glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE));
    GL_CHECK(glBlendColor(0.0F, 0.0F, 0.0F, 0.0F));

    GL_CHECK(glUseProgram(0));

    GL_CHECK(glBindVertexArray(0));

    GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, 0));
    GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0));
    GL_CHECK(glBindBuffer(GL_PIXEL_PACK_BUFFER, 0));
    GL_CHECK(glBindBuffer(GL_PIXEL_UNPACK_BUFFER, 0));
    GL_CHECK(glBindBuffer(GL_TRANSFORM_FEEDBACK_BUFFER, 0));
    GL_CHECK(glBindBuffer(GL_UNIFORM_BUFFER, 0));
    GL_CHECK(glBindBuffer(GL_COPY_READ_BUFFER, 0));
    GL_CHECK(glBindBuffer(GL_COPY_WRITE_BUFFER, 0));

    if (_constantRegistry->glMinorVersion) {
        GL_CHECK(glBindBuffer(GL_ATOMIC_COUNTER_BUFFER, 0));
        GL_CHECK(glBindBuffer(GL_DRAW_INDIRECT_BUFFER, 0));
        GL_CHECK(glBindBuffer(GL_DISPATCH_INDIRECT_BUFFER, 0));
        GL_CHECK(glBindBuffer(GL_SHADER_STORAGE_BUFFER, 0));
        GL_CHECK(glBindTexture(GL_TEXTURE_2D_MULTISAMPLE, 0));
    }

    GL_CHECK(glBindTexture(GL_TEXTURE_2D, 0));
    GL_CHECK(glBindTexture(GL_TEXTURE_3D, 0));
    GL_CHECK(glBindTexture(GL_TEXTURE_2D_ARRAY, 0));
    GL_CHECK(glBindTexture(GL_TEXTURE_CUBE_MAP, 0));

    GL_CHECK(glBindFramebuffer(GL_READ_FRAMEBUFFER, 0));
    GL_CHECK(glBindFramebuffer(GL_DRAW_FRAMEBUFFER, 0));

#if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION
    GL_CHECK(glEnable(GL_DEBUG_OUTPUT_SYNCHRONOUS_KHR));
    if (glDebugMessageControlKHR) {
        GL_CHECK(glDebugMessageControlKHR(GL_DONT_CARE, GL_DONT_CARE, GL_DONT_CARE, 0, NULL, GL_TRUE));
    }
    if (glDebugMessageCallbackKHR) {
        GL_CHECK(glDebugMessageCallbackKHR(GLES3EGLDebugProc, NULL));
    }
#endif

    if (_constantRegistry->mFBF == FBFSupportLevel::NON_COHERENT_QCOM) {
        GL_CHECK(glEnable(GL_FRAMEBUFFER_FETCH_NONCOHERENT_QCOM));
    }

    _stateCache->reset();

    _constantRegistry->currentBoundThreadID = std::hash<std::thread::id>{}(std::this_thread::get_id());

    CC_LOG_DEBUG("EGL context bounded to thread %llx", _constantRegistry->currentBoundThreadID);
}

} // namespace gfx
} // namespace cc
