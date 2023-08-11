#pragma once

#include "base/std/container/string.h"

#ifdef _WIN32
    #include <windows.h>
#else
    #include <dlfcn.h>
#endif


namespace cc {

class DynamicLibrary {
public:
    explicit DynamicLibrary(ccstd::string name) : _libName(std::move(name)) {}
    ~DynamicLibrary();

    bool load();
    void unload();
    bool isLoaded() const;

    void* getProcAddress(const std::string &key) const;

private:
    std::string _libName;
    void *_handle = nullptr;
};

} // namespace cc
