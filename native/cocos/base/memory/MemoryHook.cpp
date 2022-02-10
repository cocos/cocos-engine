/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "MemoryHook.h"
#if USE_MEMORY_LEAK_DETECTOR

    #include <sstream>

    #if CC_PLATFORM == CC_PLATFORM_ANDROID
        #define __GNU_SOURCE
        #include <dlfcn.h>

static NewHookType    g_new_hooker    = nullptr;
static DeleteHookType g_delete_hooker = nullptr;

extern "C" {

void* malloc(size_t size) __attribute__((weak));
void  free(void* ptr) __attribute__((weak));

// Use strong symbol to overwrite the weak one.
void* malloc(size_t size) {
    static MallocType system_malloc = nullptr;
    if (CC_PREDICT_FALSE(system_malloc == nullptr)) {
        system_malloc = (MallocType)dlsym(RTLD_NEXT, "malloc");
    }

    void* ptr = system_malloc(size);
    if (CC_PREDICT_TRUE(g_new_hooker != nullptr)) {
        g_new_hooker(ptr, size);
    }

    return ptr;
}

void free(void* ptr) {
    static FreeType system_free = nullptr;
    if (CC_PREDICT_FALSE(system_free == nullptr)) {
        system_free = (FreeType)dlsym(RTLD_NEXT, "free");
    }

    system_free(ptr);
    if (CC_PREDICT_TRUE(g_delete_hooker != nullptr)) {
        g_delete_hooker(ptr);
    }
}
}

    #elif CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX
typedef void malloc_logger_t(uint32_t  aType,
                             uintptr_t aArg1, uintptr_t aArg2, uintptr_t aArg3,
                             uintptr_t aResult, uint32_t aNumHotFramesToSkip);

extern malloc_logger_t* malloc_logger;
static malloc_logger_t* g_system_malloc_logger = nullptr;
static NewHookType      g_new_hooker           = nullptr;
static DeleteHookType   g_delete_hooker        = nullptr;

static void
cc_malloc_logger(uint32_t  aType,
                 uintptr_t aArg1, uintptr_t aArg2, uintptr_t aArg3,
                 uintptr_t aResult, uint32_t aNumHotFramesToSkip) {
    if (aResult != 0) {
        size_t new_size = reinterpret_cast<size_t>(aArg3);
        if (new_size != 0) {
            // realloc
            if (CC_PREDICT_TRUE(g_delete_hooker != nullptr)) {
                const void* ptr = reinterpret_cast<const void*>(aArg2);
                g_delete_hooker(ptr);
            }

            if (CC_PREDICT_TRUE(g_new_hooker != nullptr)) {
                const void* new_ptr = reinterpret_cast<const void*>(aResult);
                g_new_hooker(new_ptr, new_size);
            }
        } else {
            // malloc/calloc/valloc
            if (CC_PREDICT_TRUE(g_new_hooker != nullptr)) {
                const void* ptr  = reinterpret_cast<const void*>(aResult);
                size_t      size = reinterpret_cast<size_t>(aArg2);
                g_new_hooker(ptr, size);
            }
        }
    } else {
        // free
        if (CC_PREDICT_TRUE(g_delete_hooker != nullptr)) {
            const void* ptr = reinterpret_cast<const void*>(aArg2);
            g_delete_hooker(ptr);
        }
    }
}

    #elif CC_PLATFORM == CC_PLATFORM_WINDOWS
        #include <Windows.h>

extern "C" {
typedef void (*MallocHook_NewHook)(const void* ptr, size_t size);
typedef void (*MallocHook_DeleteHook)(const void* ptr);

int MallocHook_AddNewHook(MallocHook_NewHook hook);
int MallocHook_RemoveNewHook(MallocHook_NewHook hook);
int MallocHook_AddDeleteHook(MallocHook_DeleteHook hook);
int MallocHook_RemoveDeleteHook(MallocHook_DeleteHook hook);
}

    #endif

namespace cc {

static void newHook(const void* ptr, size_t size) {
    uint64_t address = reinterpret_cast<uint64_t>(ptr);
    GMemoryHook.addRecord(address, size);
}

static void deleteHook(const void* ptr) {
    uint64_t address = reinterpret_cast<uint64_t>(ptr);
    GMemoryHook.removeRecord(address);
}

MemoryHook::MemoryHook() {
    registerAll();
}

MemoryHook::~MemoryHook() {
    unRegisterAll();
    dumpMemoryLeak();
}

void MemoryHook::addRecord(uint64_t address, size_t size) {
    std::lock_guard<std::recursive_mutex> lock(_mutex);
    if (_hooking) {
        return;
    }

    _hooking = true;

    // {} is necessary here to make variables being destroyed before _hooking = false
    {
        MemoryRecord record;
        record.address   = address;
        record.size      = size;
        record.callstack = CallStack::backtrace();
        _records.insert({address, record});
    }

    _hooking = false;
}

void MemoryHook::removeRecord(uint64_t address) {
    std::lock_guard<std::recursive_mutex> lock(_mutex);
    if (_hooking) {
        return;
    }

    _hooking = true;

    // {} is necessary here to make variables being destroyed before _hooking = false
    {
        auto iter = _records.find(address);
        if (iter != _records.end()) {
            _records.erase(iter);
        }
    }

    _hooking = false;
}

void MemoryHook::dumpMemoryLeak() {
    std::lock_guard<std::recursive_mutex> lock(_mutex);
    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
    CallStack::initSym();
    #endif

    std::stringstream startStream;
    startStream << std::endl;
    startStream << "---------------------------------------------------------------------------------------------------------" << std::endl;
    startStream << "--------------------------------------memory leak report start-------------------------------------------" << std::endl;
    startStream << "---------------------------------------------------------------------------------------------------------" << std::endl;
    log(startStream.str());

    if (_records.size() == 0) {
        std::stringstream stream;
        stream << std::endl;
        stream << "Congratulations! There is no memory leak at all." << std::endl;
        log(stream.str());
    }

    int    i     = 0;
    size_t total = 0;
    for (const auto& iter : _records) {
        std::stringstream stream;
        int               k = 0;
        total += iter.second.size;

        stream << std::endl;
        stream << "<" << ++i << ">:"
               << "leak " << iter.second.size << " bytes at 0x" << std::hex << iter.second.address << std::dec << std::endl;
        stream << "\tcallstack:" << std::endl;
        auto frames = CallStack::backtraceSymbols(iter.second.callstack);
        for (auto& frame : frames) {
            stream << "\t[" << ++k << "]:" << frame.toString() << std::endl;
        }

        log(stream.str());
    }

    std::stringstream endStream;
    endStream << std::endl
              << "Total Leak: " << total << " bytes" << std::endl;
    endStream << "---------------------------------------------------------------------------------------------------------" << std::endl;
    endStream << "--------------------------------------memory leak report end---------------------------------------------" << std::endl;
    endStream << "---------------------------------------------------------------------------------------------------------" << std::endl;
    log(endStream.str());

    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
    CallStack::cleanupSym();
    #endif
}

void MemoryHook::log(const std::string& msg) {
    #if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    __android_log_write(ANDROID_LOG_WARN, "Cocos", msg.c_str());
    #elif CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX
    fputs(msg.c_str(), stdout);
    #elif (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    OutputDebugStringA(msg.c_str());
    #endif
}

void MemoryHook::registerAll() {
    #if CC_PLATFORM == CC_PLATFORM_ANDROID
    g_new_hooker    = newHook;
    g_delete_hooker = deleteHook;
    free(malloc(1)); // force to init system_malloc/system_free
    #elif CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX
    g_system_malloc_logger = malloc_logger;
    malloc_logger          = cc_malloc_logger;
    g_new_hooker           = newHook;
    g_delete_hooker        = deleteHook;
    #elif CC_PLATFORM == CC_PLATFORM_WINDOWS
    MallocHook_AddNewHook(&newHook);
    MallocHook_AddDeleteHook(&deleteHook);
    #endif
}

void MemoryHook::unRegisterAll() {
    #if CC_PLATFORM == CC_PLATFORM_ANDROID
    g_new_hooker    = nullptr;
    g_delete_hooker = nullptr;
    #elif CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX
    malloc_logger          = g_system_malloc_logger;
    g_new_hooker           = nullptr;
    g_delete_hooker        = nullptr;
    #elif CC_PLATFORM == CC_PLATFORM_WINDOWS
    MallocHook_RemoveNewHook(&newHook);
    MallocHook_RemoveDeleteHook(&deleteHook);
    #endif
}

} // namespace cc

#endif
