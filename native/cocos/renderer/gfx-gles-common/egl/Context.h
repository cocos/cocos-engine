#pragma once

#include <memory>
#include "base/std/container/string.h"
#include "base/std/container/vector.h"
#include "gfx-gles-common/egl/Base.h"
#include "gfx-gles-common/egl/Surface.h"

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
    explicit Context(uint32_t index) : _contextID(index) {}
    ~Context();

    bool init(const ContextInfo &info);

    void makeCurrent();
    void makeCurrent(EGLSurface surface);
    void makeCurrent(EGLSurface drawSurface, EGLSurface readSurface);
    void surfaceDestroy(EGLSurface surface);
    void resetCurrent(bool noContext = false);

    PBufferSurface *getPBufferSurface() const { return _pBuffer.get(); }
    EGLDisplay getDisplay() const { return _display; }
    EGLContext getContext() const { return _context; }
    EGLConfig getConfig() const { return _config; }
    EGLSurface getCurrentDrawSurface() const { return _currentDrawSurface; }
    EGLSurface getCurrentReadSurface() const { return _currentReadSurface; }

    EGLint getMinorVersion() const { return _glMinorVersion; }
    EGLint getMajorVersion() const { return _glMajorVersion; }

    uint32_t getContextID() const { return _contextID; }
private:
    bool createEGLContext(const ContextInfo &info);
    bool createPBuffer();

    uint32_t _contextID = 0;

    EGLContext _context = EGL_NO_CONTEXT;
    EGLDisplay _display = EGL_NO_DISPLAY;
    EGLSurface _currentDrawSurface = EGL_NO_SURFACE;
    EGLSurface _currentReadSurface = EGL_NO_SURFACE;
    EGLConfig  _config = EGL_NO_CONFIG_KHR;

    EGLint _glMajorVersion{0U};
    EGLint _glMinorVersion{0U};
    ccstd::vector<ccstd::string> _extensions;
    std::unique_ptr<PBufferSurface> _pBuffer;
};

} // namespace cc::gfx::egl
