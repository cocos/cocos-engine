#pragma once

#include "base/std/container/vector.h"
#include "base/std/container/string.h"
#include "gfx-gles-common/egl/Surface.h"
#include "gfx-gles-common/egl/Base.h"
#include <memory>

namespace cc::gfx::egl {

struct ContextInfo {
    Config config;
    EGLContext sharedContext = EGL_NO_CONTEXT;

    EGLint majorVersion = 3;
    bool msaaEnabled{false};
    bool qualityPreferred{false};
};

class Context {
public:
    Context() = default;
    ~Context();

    bool init(const ContextInfo &info);

    void makeCurrent();
    void makeCurrent(EGLSurface surface);
    void makeCurrent(EGLSurface drawSurface, EGLSurface readSurface);
    void surfaceDestroy(EGLSurface surface);
    void resetCurrent(bool noContext = false);

    EGLContext getContext() const { return _context; }
    EGLConfig getConfig() const { return _config; }
    EGLSurface getCurrentDrawSurface() const { return _currentDrawSurface; }
    EGLSurface getCurrentReadSurface() const { return _currentReadSurface; }

    uint32_t getMinorVersion() const { return _glMinorVersion; }
    uint32_t getMajorVersion() const { return _glMajorVersion; }
private:
    bool createEGLContext(const ContextInfo &info);
    bool createPBuffer();

    EGLContext _context = EGL_NO_CONTEXT;
    EGLDisplay _display = EGL_NO_DISPLAY;
    EGLSurface _currentDrawSurface = EGL_NO_SURFACE;
    EGLSurface _currentReadSurface = EGL_NO_SURFACE;
    EGLConfig  _config = EGL_NO_CONFIG_KHR;

    uint32_t _glMajorVersion{0U};
    uint32_t _glMinorVersion{0U};
    EGLint _majorVersion{0};
    EGLint _minorVersion{0};
    ccstd::vector<ccstd::string> _extensions;
    std::unique_ptr<PBufferSurface> _pBuffer;
};

} // namespace cc::gfx::egl
