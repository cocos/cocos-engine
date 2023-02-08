#pragma once

#include "gfx-gles-new/egl/Surface.h"

namespace cc::gfx::egl {

class PBufferSurface : public Surface {
public:
    PBufferSurface() = default;
    ~PBufferSurface() = default;

    bool init(EGLConfig cfg, const EGLint *attributes);
};

} // namespace cc::gfx::egl
