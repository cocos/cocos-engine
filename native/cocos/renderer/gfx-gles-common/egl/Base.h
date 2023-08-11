#pragma once

#include "gfx-gles-common/loader/eglw.h"

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
