#include "Context.h"
#include "PBufferSurface.h"
#include "base/StringUtil.h"
#include "base/Log.h"
#include "base/memory/Memory.h"

namespace cc::gfx::egl {

Context::~Context() {
    _defaultSurface = nullptr;
    resetCurrent();
    if (_context != EGL_NO_CONTEXT) {
        eglDestroyContext(_display, _context);
    }
}

bool Context::init(const ContextInfo &info) {

    EGLint defaultAttribs[]{
        EGL_SURFACE_TYPE, EGL_WINDOW_BIT | EGL_PBUFFER_BIT,
        EGL_RENDERABLE_TYPE, EGL_OPENGL_ES3_BIT_KHR,
        EGL_BLUE_SIZE, info.config.rgb,
        EGL_GREEN_SIZE, info.config.rgb,
        EGL_RED_SIZE, info.config.rgb,
        EGL_ALPHA_SIZE, info.config.alpha,
        EGL_DEPTH_SIZE, info.config.depth,
        EGL_STENCIL_SIZE, info.config.stencil,
        EGL_SAMPLE_BUFFERS, info.config.sampleBuffers,
        EGL_SAMPLES, info.config.sampleCount,
        EGL_NONE};
    _display = eglGetDisplay(EGL_DEFAULT_DISPLAY);

    int numConfig = 0;
    auto success = eglChooseConfig(_display, defaultAttribs, nullptr, 0, &numConfig);
    if (success) {
        _configs.resize(numConfig);
    } else {
        CC_LOG_ERROR("Query GLES configuration failed.");
        return false;
    }

    int count = numConfig;
    EGL_CHECK(success = eglChooseConfig(_display, defaultAttribs, _configs.data(), count, &numConfig));
    if (!success || !numConfig) {
        CC_LOG_ERROR("eglChooseConfig configuration failed.");
        return false;
    }

    EGLint depth{0};
    EGLint stencil{0};
    EGLint sampleBuffers{0};
    EGLint sampleCount{0};
    EGLint params[8]{0};
    uint64_t lastScore = info.qualityPreferred ? std::numeric_limits<uint64_t>::min() : std::numeric_limits<uint64_t>::max();

    for (int i = 0; i < numConfig; i++) {
        int depthValue{0};
        eglGetConfigAttrib(_display, _configs[i], EGL_RED_SIZE, &params[0]);
        eglGetConfigAttrib(_display, _configs[i], EGL_GREEN_SIZE, &params[1]);
        eglGetConfigAttrib(_display, _configs[i], EGL_BLUE_SIZE, &params[2]);
        eglGetConfigAttrib(_display, _configs[i], EGL_ALPHA_SIZE, &params[3]);
        eglGetConfigAttrib(_display, _configs[i], EGL_DEPTH_SIZE, &params[4]);
        eglGetConfigAttrib(_display, _configs[i], EGL_STENCIL_SIZE, &params[5]);
        eglGetConfigAttrib(_display, _configs[i], EGL_SAMPLE_BUFFERS, &params[6]);
        eglGetConfigAttrib(_display, _configs[i], EGL_SAMPLES, &params[7]);
        eglGetConfigAttrib(_display, _configs[i], EGL_DEPTH_ENCODING_NV, &depthValue);

        int bNonLinearDepth = (depthValue == EGL_DEPTH_ENCODING_NONLINEAR_NV) ? 1 : 0;

        /*------------------------------------------ANGLE's priority-----------------------------------------------*/
        // Favor EGLConfigLists by RGB, then Depth, then Non-linear Depth, then Stencil, then Alpha
        uint64_t currScore{0};
        EGLint colorScore = std::abs(params[0] - info.config.rgb) + std::abs(params[1] - info.config.rgb) + std::abs(params[2] - info.config.rgb);
        currScore |= static_cast<uint64_t>(std::min(std::max(params[6], 0), 15)) << 29;
        currScore |= static_cast<uint64_t>(std::min(std::max(params[7], 0), 31)) << 24;
        currScore |= static_cast<uint64_t>(std::min(colorScore, 127)) << 17;
        currScore |= static_cast<uint64_t>(std::min(std::abs(params[4] - info.config.depth), 63)) << 11;
        currScore |= static_cast<uint64_t>(std::min(std::abs(1 - bNonLinearDepth), 1)) << 10;
        currScore |= static_cast<uint64_t>(std::min(std::abs(params[5] - info.config.stencil), 31)) << 6;
        currScore |= static_cast<uint64_t>(std::min(std::abs(params[3] - info.config.alpha), 31)) << 0;
        /*------------------------------------------ANGLE's priority-----------------------------------------------*/

        // if msaaEnabled, sampleBuffers and sampleCount should be greater than 0, until iterate to the last one(can't find).
        bool msaaLimit = (info.msaaEnabled ? (params[6] > 0 && params[7] > 0) : (params[6] == 0 && params[7] == 0));
        // performancePreferred ? [>=] : [<] , egl configurations store in "ascending order"
        bool filter = (currScore < lastScore) ^ info.qualityPreferred;
        if ((filter && msaaLimit) || (!_config && i == numConfig - 1)) {
            _config = _configs[i];
            depth = params[4];
            stencil = params[5];
            sampleBuffers = params[6];
            sampleCount = params[7];
            lastScore = currScore;
        }
    }

    CC_LOG_INFO("Setup EGLConfig: depth [%d] stencil [%d] sampleBuffer [%d] sampleCount [%d]", depth, stencil, sampleBuffers, sampleCount);
    EGL_CHECK(_extensions = StringUtil::split(eglQueryString(_display, EGL_EXTENSIONS), " "));

    _glMajorVersion = 3;
    bool hasKHRCreateCtx = checkExtension(CC_TOSTR(EGL_KHR_create_context));
    if (hasKHRCreateCtx) {
        _attributes.push_back(EGL_CONTEXT_MAJOR_VERSION_KHR);
        _attributes.push_back(3);
        _attributes.push_back(EGL_CONTEXT_MINOR_VERSION_KHR);
        _attributes.push_back(2);
#if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION
        _attributes.push_back(EGL_CONTEXT_FLAGS_KHR);
        _attributes.push_back(EGL_CONTEXT_OPENGL_DEBUG_BIT_KHR);
#endif
        _attributes.push_back(EGL_NONE);

        for (int m = 2; m >= 0; --m) {
            _attributes[3] = m;
            _context = eglCreateContext(_display, _config, info.sharedContext, _attributes.data());
            EGLint err = eglGetError(); // QNX throws egl errors on mismatch
            if (_context && err == EGL_SUCCESS) {
                _glMinorVersion = m;
                break;
            }
        }
    } else {
        _attributes.push_back(EGL_CONTEXT_CLIENT_VERSION);
        _attributes.push_back(3);
        _attributes.push_back(EGL_NONE);

        EGL_CHECK(_context = eglCreateContext(_display, _config, info.sharedContext, _attributes.data()));
    }

    if (_context == EGL_NO_CONTEXT) {
        CC_LOG_ERROR("Create EGL context failed.");
        return false;
    }

    // create default pBuffer surface
    EGLint pBufferAttribs[]{
        EGL_WIDTH, 1,
        EGL_HEIGHT, 1,
        EGL_NONE};
    auto *pBuffer = ccnew PBufferSurface();
    pBuffer->init(_config, pBufferAttribs);
    _defaultSurface.reset(pBuffer);
    return true;
}

void Context::makeCurrent() {
    makeCurrent(_defaultSurface->getNativeHandle());
}

void Context::makeCurrent(EGLSurface surface) {
    _currentSurface = surface;
    eglMakeCurrent(_display, _currentSurface, _currentSurface, _context);
}

void Context::resetCurrent() {
    _currentSurface = EGL_NO_SURFACE;
    eglMakeCurrent(_display, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT);
}

void Context::surfaceDestroy(EGLSurface surface) {
    if (_currentSurface == surface) {
        makeCurrent();
    }
}

} // namespace cc::gfx::egl
