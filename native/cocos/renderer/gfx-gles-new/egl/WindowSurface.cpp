#include "WindowSurface.h"
#include "Core.h"

namespace cc::gfx::egl {

bool WindowSurface::init(EGLConfig cfg, void *window) {
    EGL_CHECK(_surface = eglCreateWindowSurface(_display, cfg, static_cast<EGLNativeWindowType>(window), nullptr));

    eglQuerySurface(_display, _surface, EGL_WIDTH, &width);
    eglQuerySurface(_display, _surface, EGL_HEIGHT, &height);

    return _surface != EGL_NO_SURFACE;
}

} // namespace cc::gfx::egl
