#pragma once

#include "base/std/container/vector.h"
#include "gfx-gles-common/eglw.h"
#include "gfx-gles-new/egl/Core.h"
#include "gfx-gles-new/egl/Surface.h"
#include <memory>

namespace cc::gfx::egl {

struct ContextInfo {
    Config config;
    EGLContext sharedContext = EGL_NO_CONTEXT;

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
    void surfaceDestroy(EGLSurface surface);
    void resetCurrent();

    EGLContext getContext() const { return _context; }
    EGLConfig getConfig() const { return _config; }
    EGLSurface getCurrentSurface() const { return _currentSurface; }

    uint32_t getMinorVersion() const { return _glMinorVersion; }
    uint32_t getMajorVersion() const { return _glMajorVersion; }
private:
    inline bool checkExtension(const ccstd::string &extension) const {
        return std::find(_extensions.begin(), _extensions.end(), extension) != _extensions.end();
    }

    EGLContext _context = EGL_NO_CONTEXT;
    EGLDisplay _display = EGL_NO_DISPLAY;
    EGLSurface _currentSurface = EGL_NO_SURFACE;
    EGLConfig  _config = EGL_NO_CONFIG_KHR;

    uint32_t _glMajorVersion{0U};
    uint32_t _glMinorVersion{0U};

    ccstd::vector<EGLConfig> _configs;
    ccstd::vector<EGLint> _attributes;
    ccstd::vector<ccstd::string> _extensions;

    std::unique_ptr<Surface> _defaultSurface;
};

} // namespace cc::gfx::egl
