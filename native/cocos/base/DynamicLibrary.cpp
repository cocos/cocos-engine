#include "DynamicLibrary.h"

namespace cc {

DynamicLibrary::~DynamicLibrary() {
    unload();
}

bool DynamicLibrary::load() {
#ifdef _WIN32
    handle = ::LoadLibraryExA(_libName.c_str(), nullptr, 0);
#else
    handle = dlopen(_libName.c_str(), RTLD_LOCAL | RTLD_LAZY);
#endif
    return handle != nullptr;
}

void DynamicLibrary::unload() {
    if (handle != nullptr) {
#ifdef _WIN32
        ::FreeLibrary(static_cast<HMODULE>(handle));
#else
        dlclose(handle);
#endif
        handle = nullptr;
    }
}

bool DynamicLibrary::isLoaded() const {
    return handle != nullptr;
}

void* DynamicLibrary::GetAddress(const std::string &key) {
    if (handle == nullptr) {
        return nullptr;
    }
#ifdef _WIN32
    return ::GetProcAddress(static_cast<HMODULE>(handle), key.c_str());
#else
    return dlsym(handle, key.c_str());
#endif
}

}
