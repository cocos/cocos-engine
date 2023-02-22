#pragma once

#include "gfx-gles-common/eglw.h"
#include "gfx-base/GFXDeviceObject.h"

namespace cc::gfx::egl {

class Surface : public GFXDeviceObject<DefaultDeleter> {
public:
    Surface() {
        _display = eglGetDisplay(EGL_DEFAULT_DISPLAY);
    }

    virtual ~Surface() {
        if (_surface != EGL_NO_CONFIG_KHR) {
            eglDestroySurface(_display, _surface);
        }
    }

    EGLSurface getNativeHandle() const { return _surface; };
    void swapBuffer() { eglSwapBuffers(_display, _surface); };

protected:
    EGLDisplay _display = EGL_NO_DISPLAY;
    EGLSurface _surface = EGL_NO_SURFACE;
};

} // namespace cc::gfx::egl
