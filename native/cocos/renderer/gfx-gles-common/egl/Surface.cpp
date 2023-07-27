#include "Surface.h"

namespace cc::gfx::egl {

bool PBufferSurface::init(EGLConfig cfg, const EGLint *attributes) {
    EGL_CHECK(_surface = eglCreatePbufferSurface(eglGetDisplay(EGL_DEFAULT_DISPLAY), cfg, attributes));
    return _surface != EGL_NO_SURFACE;
}

bool WindowSurface::init(EGLConfig cfg, void *window) {
    EGL_CHECK(_surface = eglCreateWindowSurface(_display, cfg, reinterpret_cast<EGLNativeWindowType>(window), nullptr));

    eglQuerySurface(_display, _surface, EGL_WIDTH, &_width);
    eglQuerySurface(_display, _surface, EGL_HEIGHT, &_height);

    return _surface != EGL_NO_SURFACE;
}

} // namespace cc::gfx::egl
