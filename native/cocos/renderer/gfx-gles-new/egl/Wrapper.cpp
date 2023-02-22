#include "Wrapper.h"
#include "Core.h"

#include "base/DynamicLibrary.h"
#include <memory>

std::unique_ptr<cc::DynamicLibrary> libGLES;
std::unique_ptr<cc::DynamicLibrary> libEGL;

static void *eglLoad(const char *proc) {
    return libEGL->GetAddress(proc);
}

static void *gles3wLoad(const char *proc) {
    return libGLES->GetAddress(proc);
}

namespace cc::gfx::egl {

Wrapper::~Wrapper() {
    eglTerminate(eglGetDisplay(EGL_DEFAULT_DISPLAY));
}

bool Wrapper::init() {
    if (!loadLib()) {
        return false;
    }

    eglwLoadProcs(eglLoad);
    gles2wLoadProcs(gles3wLoad);
    gles3wLoadProcs(gles3wLoad);

    EGLint _eglMajorVersion{0};
    EGLint _eglMinorVersion{0};
    eglInitialize(eglGetDisplay(EGL_DEFAULT_DISPLAY), &_eglMajorVersion, &_eglMinorVersion);
    return true;
}

bool Wrapper::loadLib() {
#if defined(_WIN32) && !defined(ANDROID)
    libEGL = std::make_unique<DynamicLibrary>("libEGL.dll");
    libEGL->load();

    libGLES = std::make_unique<DynamicLibrary>("libGLESv2.dll");
    libGLES->load();

    return libGLES->isLoaded() && libEGL->isLoaded();
#elif defined(__EMSCRIPTEN__)
    libEGL = std::make_unique<DynamicLibrary>("libEGL.so");
    libEGL->load();

    libGLES = std::make_unique<DynamicLibrary>("libGLESv2.so");
    libGLES->load();
    return libGLES->isLoaded() && libEGL->isLoaded();
#else
    return true;
#endif
}

} // namespace cc::gfx::egl
