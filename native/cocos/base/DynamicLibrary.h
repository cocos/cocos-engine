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
    DynamicLibrary(const ccstd::string &name) : _libName(name) {}
    ~DynamicLibrary();

    bool load();
    void unload();

    bool isLoaded() const;

    void* GetAddress(const std::string &key);

private:
    std::string _libName;
    void *handle = nullptr;
};

}
