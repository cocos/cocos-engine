#pragma once
#include "gfx-gles-common/egl/Base.h"
#include "gfx-base/GFXDeviceObject.h"

namespace cc::gfx::egl {

class Surface : public GFXDeviceObject<DefaultDeleter> {
public:
    Surface() {
        _display = eglGetDisplay(EGL_DEFAULT_DISPLAY);
    }

    ~Surface() override {
        if (_surface != EGL_NO_CONFIG_KHR) {
            eglDestroySurface(_display, _surface);
        }
    }

    EGLSurface getNativeHandle() const { return _surface; };
    virtual void swapBuffer() {};

protected:
    EGLDisplay _display = EGL_NO_DISPLAY;
    EGLSurface _surface = EGL_NO_SURFACE;
};

class WindowSurface : public Surface {
public:
    WindowSurface() = default;
    ~WindowSurface() override = default;

    bool init(EGLConfig cfg, EGLNativeWindowType window);
    void swapBuffer() override;
    EGLint getWidth() const { return _width; }
    EGLint getHeight() const { return _height; }

private:
    EGLint _width = 1;
    EGLint _height = 1;
};

class PBufferSurface : public Surface {
public:
    PBufferSurface() = default;
    ~PBufferSurface() override = default;

    bool init(EGLConfig cfg, const EGLint *attributes);
};

} // namespace cc::gfx::egl
