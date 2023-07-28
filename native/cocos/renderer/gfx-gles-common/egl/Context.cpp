#include "Context.h"

#include "gfx-gles-common/egl/Debug.h"
#include "gfx-gles-common/egl/Instance.h"

namespace cc::gfx::egl {
namespace {
EGLConfig chooseConfig(EGLDisplay eglDisplay, const Config &cfg, bool qualityPreferred, bool msaaEnabled) {
    EGLConfig eglConfig = EGL_NO_CONFIG_KHR;

    EGLint eglAttributes[]{
        EGL_SURFACE_TYPE, EGL_WINDOW_BIT | EGL_PBUFFER_BIT,
        EGL_RENDERABLE_TYPE, EGL_OPENGL_ES3_BIT_KHR,
        EGL_BLUE_SIZE, cfg.blue,
        EGL_GREEN_SIZE, cfg.green,
        EGL_RED_SIZE, cfg.blue,
        EGL_ALPHA_SIZE, cfg.alpha,
        EGL_DEPTH_SIZE, cfg.depth,
        EGL_STENCIL_SIZE, cfg.stencil,
        EGL_SAMPLE_BUFFERS, cfg.sampleBuffers,
        EGL_SAMPLES, cfg.sampleCount,
        EGL_NONE};

    int numConfig{0};
    ccstd::vector<EGLConfig> eglConfigs;
    auto success = eglChooseConfig(eglDisplay, eglAttributes, nullptr, 0, &numConfig);
    if (success) {
        eglConfigs.resize(numConfig);
    } else {
        CC_LOG_ERROR("Query GLES3 configuration failed.");
        return eglConfig;
    }

    int const count = numConfig;
    EGL_CHECK(success = eglChooseConfig(eglDisplay, eglAttributes, eglConfigs.data(), numConfig, &numConfig));
    if (!success || !numConfig) {
        CC_LOG_ERROR("eglChooseConfig configuration failed.");
        return eglConfig;
    }

    EGLint depth{0};
    EGLint stencil{0};
    EGLint sampleBuffers{0};
    EGLint sampleCount{0};
    EGLint params[8]{0};
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

        int const bNonLinearDepth = (depthValue == EGL_DEPTH_ENCODING_NONLINEAR_NV) ? 1 : 0;

        /*------------------------------------------ANGLE's priority-----------------------------------------------*/
        // Favor EGLConfigLists by RGB, then Depth, then Non-linear Depth, then Stencil, then Alpha
        uint64_t currScore{0};
        EGLint const colorScore = std::abs(params[0] - cfg.red) + std::abs(params[1] - cfg.green) + std::abs(params[2] - cfg.blue);
        currScore |= static_cast<uint64_t>(std::min(std::max(params[6], 0), 15)) << 29;
        currScore |= static_cast<uint64_t>(std::min(std::max(params[7], 0), 31)) << 24;
        currScore |= static_cast<uint64_t>(std::min(colorScore, 127)) << 17;
        currScore |= static_cast<uint64_t>(std::min(std::abs(params[4] - cfg.depth), 63)) << 11;
        currScore |= static_cast<uint64_t>(std::min(std::abs(1 - bNonLinearDepth), 1)) << 10;
        currScore |= static_cast<uint64_t>(std::min(std::abs(params[5] - cfg.stencil), 31)) << 6;
        currScore |= static_cast<uint64_t>(std::min(std::abs(params[3] - cfg.alpha), 31)) << 0;
        /*------------------------------------------ANGLE's priority-----------------------------------------------*/

        // if msaaEnabled, sampleBuffers and sampleCount should be greater than 0, until iterate to the last one(can't find).
        bool const msaaLimit = (msaaEnabled ? (params[6] > 0 && params[7] > 0) : (params[6] == 0 && params[7] == 0));
        // performancePreferred ? [>=] : [<] , egl configurations store in "ascending order"
        bool const filter = (currScore < lastScore) ^ qualityPreferred;
        if ((filter && msaaLimit) || (!eglConfig && i == numConfig - 1)) {
            eglConfig = eglConfigs[i];
            depth = params[4];
            stencil = params[5];
            sampleBuffers = params[6];
            sampleCount = params[7];
            lastScore = currScore;
        }
    }
    CC_LOG_INFO("Setup EGLConfig: depth [%d] stencil [%d] sampleBuffer [%d] sampleCount [%d]", depth, stencil, sampleBuffers, sampleCount);
    return eglConfig;
}
} // namespace

Context::~Context() {
    resetCurrent(true);

    if (_context != EGL_NO_CONTEXT) {
        eglDestroyContext(_display, _context);
    }
}

bool Context::createEGLContext(const ContextInfo &info) {
    auto *instance = Instance::getInstance();
    EGL_CHECK(_display = eglGetDisplay(EGL_DEFAULT_DISPLAY));
    _config = chooseConfig(_display, info.config, info.qualityPreferred, info.msaaEnabled);

    _glMajorVersion = info.majorVersion;
    _glMinorVersion = _glMajorVersion >= 3 ? 2 : 0;
    ccstd::vector<EGLint> eglAttributes;
    if (instance->checkExtension(CC_TOSTR(EGL_KHR_create_context))) {
        eglAttributes.push_back(EGL_CONTEXT_MAJOR_VERSION_KHR);
        eglAttributes.push_back(_glMajorVersion);
        eglAttributes.push_back(EGL_CONTEXT_MINOR_VERSION_KHR);
        eglAttributes.push_back(_glMinorVersion);
#if CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION
        eglAttributes.push_back(EGL_CONTEXT_FLAGS_KHR);
        eglAttributes.push_back(EGL_CONTEXT_OPENGL_DEBUG_BIT_KHR);
#endif
        eglAttributes.push_back(EGL_NONE);

        for (EGLint m = _glMinorVersion; m >= 0; --m) {
            eglAttributes[3] = m;
            _context = eglCreateContext(_display, _config, info.sharedContext, eglAttributes.data());
            auto err = eglGetError(); // QNX throws egl errors on mismatch
            if (_context && err == EGL_SUCCESS) {
                _glMinorVersion = m;
                break;
            }
        }
    } else {
        eglAttributes.push_back(EGL_CONTEXT_CLIENT_VERSION);
        eglAttributes.push_back(_glMajorVersion);
        eglAttributes.push_back(EGL_NONE);
        EGL_CHECK(_context = eglCreateContext(_display, _config, info.sharedContext, eglAttributes.data()));
    }
    return _context != EGL_NO_CONTEXT;
}

bool Context::createPBuffer() {
    _pBuffer = std::make_unique<PBufferSurface>();

    EGLint pBufferAttribs[]{
        EGL_WIDTH, 1,
        EGL_HEIGHT, 1,
        EGL_NONE};
    return _pBuffer->init(_config, pBufferAttribs);
}

bool Context::init(const ContextInfo &info) {
    if (!createEGLContext(info)) {
        return false;
    }

    if (!createPBuffer()) {
        return false;
    }
    return true;
}

void Context::makeCurrent() {
    makeCurrent(_pBuffer->getNativeHandle());
}

void Context::makeCurrent(EGLSurface surface) {
    makeCurrent(surface, surface);
}

void Context::makeCurrent(EGLSurface drawSurface, EGLSurface readSurface) {
    if (_currentDrawSurface == drawSurface && _currentReadSurface == readSurface) {
        return;
    }

    EGL_CHECK(eglMakeCurrent(_display, drawSurface, readSurface, _context));
    _currentDrawSurface = drawSurface;
    _currentReadSurface = readSurface;
}

void Context::surfaceDestroy(EGLSurface surface) {
    if (_currentReadSurface == surface || _currentDrawSurface == surface) {
        resetCurrent();
    }
}

void Context::resetCurrent(bool noContext) {
    if (noContext) {
        EGL_CHECK(eglMakeCurrent(_display, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT));
        _currentDrawSurface = EGL_NO_SURFACE;
        _currentReadSurface = EGL_NO_SURFACE;
    } else {
        makeCurrent();
    }
}

} // namespace cc::gfx::egl
