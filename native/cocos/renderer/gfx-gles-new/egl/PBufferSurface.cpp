#include "PBufferSurface.h"
#include "Core.h"

namespace cc::gfx::egl {

bool PBufferSurface::init(EGLConfig cfg, const EGLint *attributes) {
    EGL_CHECK(_surface = eglCreatePbufferSurface(eglGetDisplay(EGL_DEFAULT_DISPLAY), cfg, attributes));
    return _surface != EGL_NO_SURFACE;
}

} // namespace cc::gfx::egl
