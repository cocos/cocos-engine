#pragma once

#include "base/Log.h"

#include "gfx-gles-common/loader/eglw.h"
#include "gfx-gles-common/loader/gles2w.h"
#include "gfx-gles-common/loader/gles3w.h"

#if CC_DEBUG > 0
    #define EGL_CHECK(x)                                              \
        do {                                                          \
            x;                                                        \
            const EGLint err = eglGetError();                         \
            if (err != EGL_SUCCESS) {                                 \
                CC_LOG_ERROR("%s returned EGL error: 0x%x", #x, err); \
                CC_ABORT();                                           \
            }                                                         \
        } while (0)
#else
    #define EGL_CHECK(x) x
#endif

namespace cc::gfx::egl {

struct Config {
    EGLint red           = 8;
    EGLint green         = 8;
    EGLint blue          = 8;
    EGLint alpha         = 8;
    EGLint depth         = 24;
    EGLint stencil       = 8;
    EGLint sampleBuffers = 0;
    EGLint sampleCount   = 0;
};

} // namespace cc::gfx::egl
