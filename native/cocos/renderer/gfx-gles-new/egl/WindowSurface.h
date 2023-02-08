#pragma once

#include "gfx-gles-new/egl/Surface.h"

namespace cc::gfx::egl {

class WindowSurface : public Surface {
public:
    WindowSurface() = default;
    ~WindowSurface() = default;

    bool init(EGLConfig cfg, void *window);
    EGLint getWidth() const { return width; }
    EGLint getHeight() const { return height; }

private:
    EGLint width = 1;
    EGLint height = 1;
};

} // namespace cc::gfx::egl
