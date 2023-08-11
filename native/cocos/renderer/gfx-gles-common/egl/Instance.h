#pragma once

#include "base/std/container/vector.h"
#include "base/std/container/string.h"
#include "base/DynamicLibrary.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-gles-common/egl/Base.h"
#include <memory>

namespace cc::gfx::egl {

class Instance {
public:
    static Instance *getInstance();
    static bool initialize();
    static void shutdown();

    ~Instance();

    bool checkExtension(const ccstd::string &extension) const;
private:
    Instance() = default;
    bool initInternal();
    bool initEGL();
    void terminateEGL();

    EGLDisplay _display{EGL_NO_DISPLAY};
    EGLint _eglMajorVersion{0};
    EGLint _eglMinorVersion{0};
    ccstd::vector<ccstd::string> _extensions;
};

void *getProcAddress(const char *proc);

} // namespace cc::gfx::egl
