#include "Instance.h"

#include <algorithm>

#include "base/Log.h"
#include "base/StringUtil.h"
#include "gfx-gles-common/egl/Base.h"
#include "gfx-gles-common/egl/Debug.h"
#include "gfx-gles-common/loader/eglw.h"
#include "gfx-gles-common/loader/gles2w.h"
#ifdef CC_USE_GLES3
#include "gfx-gles-common/loader/gles3w.h"
#endif

namespace cc::gfx::egl {
namespace {
std::unique_ptr<DynamicLibrary> gLibEGL;
std::unique_ptr<DynamicLibrary> gLibGLES;
std::unique_ptr<Instance> gInstance;
}

void *getProcAddress(const char *proc) {
    void *res = nullptr;
    if (eglGetProcAddress) res = reinterpret_cast<void *>(eglGetProcAddress(proc));
    if (res == nullptr) res = reinterpret_cast<void *>(gLibEGL->getProcAddress(proc));
    return res;
}

namespace {
ccstd::string getFullDirectory() {
    ccstd::string dir;
#if defined(_WIN32)
    // In editor,there are same library,so we need to use abs path to load them.
    HMODULE engine = nullptr;
    if (GetModuleHandleEx(GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS |
                              GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT,
                          reinterpret_cast<LPCWSTR>(&getFullDirectory), &engine) != 0) {

        int times = 1;
        do {
            auto size = MAX_PATH * times++;
            char *path = static_cast<char *>(CC_MALLOC(size));
            if (path) {
                GetModuleFileNameA(engine, path, size);
                dir = path;
            }
            CC_FREE(path);
        } while (GetLastError() == ERROR_INSUFFICIENT_BUFFER);
        dir = dir.substr(0, dir.rfind('\\') + 1);
    } else {
        DWORD const err = GetLastError();
        CC_LOG_WARNING("Failed to get abs path for editor,error code:%lu", err);
    }
#endif
    return dir;
}

bool loadLibrary() {
    if (gLibEGL && gLibGLES) {
        return true;
    }

#ifdef _WIN32
    ccstd::string libEGLPath = "libEGL.dll";
    ccstd::string libGLESV2Path;
    ccstd::string libGLESV3Path = "libGLESv2.dll";
    #if CC_EDITOR
    auto fullDir = getFullDirectory();
    libEGLPath = fullDir + libEGLPath;
    libGLESV3Path = fullDir + libGLESV3Path;
    #endif
#else
    ccstd::string libEGLPath = "libEGL.so";
    ccstd::string libGLESV2Path = "libGLESv2.so";
    ccstd::string libGLESV3Path = "libGLESv3.so";
#endif

    auto libEGL = std::make_unique<DynamicLibrary>(libEGLPath);
    if (!libEGL->load()) {
        return false;
    }

    auto libGLES = std::make_unique<DynamicLibrary>(libGLESV3Path);
    // usually gles2 && gles3 shares the same so, first load libGLESv3
    if (!libGLES->load() && !libGLESV2Path.empty()) {
        // try libGLESv2
        libGLES = std::make_unique<DynamicLibrary>(libGLESV2Path);
        if (!libGLES->load()) {
            return false;
        }
    }
    gLibEGL = std::move(libEGL);
    gLibGLES = std::move(libGLES);

    eglwLoadProcs(getProcAddress);
    gles2wLoadProcs(getProcAddress);
#ifdef CC_USE_GLES3
    gles3wLoadProcs(getProcAddress);
#endif
    return true;
}
} // namespace
Instance *Instance::getInstance() {
    return gInstance.get();
}

Instance::~Instance() {
    terminateEGL();
}

bool Instance::initialize() {
    if (!gInstance) {
        gInstance.reset(ccnew Instance());
        if (!gInstance->initInternal()) {
            gInstance = nullptr;
        }
    }
    return static_cast<bool>(gInstance);
}

void Instance::shutdown() {
    gInstance = nullptr;
}

bool Instance::initInternal() {
#ifndef __EMSCRIPTEN__
    if (!loadLibrary()) {
        return false;
    }
#endif
    if (!initEGL()) {
        return false;
    }

    EGL_CHECK(_extensions = StringUtil::split(eglQueryString(_display, EGL_EXTENSIONS), " "));
    return true;
}

bool Instance::initEGL() {
    EGL_CHECK(_display = eglGetDisplay(EGL_DEFAULT_DISPLAY));

    if (_display == EGL_NO_DISPLAY) {
        CC_LOG_ERROR("eglGetDisplay() - FAILED.");
        return false;
    }

    EGLBoolean success;
    EGL_CHECK(success = eglInitialize(_display, &_eglMajorVersion, &_eglMinorVersion));
    if (!success) {
        CC_LOG_ERROR("eglInitialize() - FAILED.");
        return false;
    }

    EGL_CHECK(eglBindAPI(EGL_OPENGL_ES_API));
    return true;
}

void Instance::terminateEGL() {
    if (_display) {
        EGL_CHECK(eglTerminate(_display));
        _display = EGL_NO_DISPLAY;
    }
}

bool Instance::checkExtension(const ccstd::string &extension) const {
    return std::any_of(_extensions.begin(), _extensions.end(), [&extension](auto &ext) {
        return ext.find(extension) != ccstd::string::npos;
    });
}
} // namespace cc::gfx::egl
