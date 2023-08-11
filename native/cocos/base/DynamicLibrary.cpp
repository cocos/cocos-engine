#include "DynamicLibrary.h"

namespace cc {

DynamicLibrary::~DynamicLibrary() {
    unload();
}

bool DynamicLibrary::load() {
#ifdef _WIN32
    _handle = ::LoadLibraryExA(_libName.c_str(), nullptr, 0);
#elif defined(__EMSCRIPTEN__)
    _handle = nullptr;
#else
    _handle = dlopen(_libName.c_str(), RTLD_LOCAL | RTLD_LAZY);
#endif
    return _handle != nullptr;
}

void DynamicLibrary::unload() {
    if (_handle != nullptr) {
#ifdef _WIN32
        ::FreeLibrary(static_cast<HMODULE>(_handle));
#elif defined(__EMSCRIPTEN__)
        // do nothing
#else
        dlclose(_handle);
#endif
        _handle = nullptr;
    }
}

bool DynamicLibrary::isLoaded() const {
    return _handle != nullptr;
}

void* DynamicLibrary::getProcAddress(const std::string &key) const {
    if (_handle == nullptr) {
        return nullptr;
    }
#ifdef _WIN32
    return reinterpret_cast<void*>(::GetProcAddress(static_cast<HMODULE>(_handle), key.c_str()));
#elif defined(__EMSCRIPTEN__)
    return nullptr;
#else
    return dlsym(_handle, key.c_str());
#endif
}

} // namespace cc
