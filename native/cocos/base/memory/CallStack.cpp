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

#include "CallStack.h"
#if USE_MEMORY_LEAK_DETECTOR

    #if CC_PLATFORM == CC_PLATFORM_ANDROID
        #define __GNU_SOURCE
        #include <cxxabi.h>
        #include <dlfcn.h>
        #include <pthread.h>
    #elif CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX
        #include <execinfo.h>
    #elif CC_PLATFORM == CC_PLATFORM_WINDOWS
        #include <DbgHelp.h>
        #include <Windows.h>

        #pragma comment(lib, "dbghelp.lib")
    #endif

    #include <sstream>

namespace cc {

std::string StackFrame::toString() {
    static std::string unknown("unknown");
    #if CC_PLATFORM == CC_PLATFORM_ANDROID
    std::stringstream stream;
    stream << "\tmodule: " << (module.empty() ? unknown : module)
           << "\tfunction: " << (function.empty() ? unknown : function);

    return stream.str();

    #elif CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX
    std::stringstream stream;
    stream << "\tfile: " << (file.empty() ? unknown : file);

    return stream.str();

    #elif CC_PLATFORM == CC_PLATFORM_WINDOWS
    std::stringstream stream;
    stream << "\tmodule: " << (module.empty() ? unknown : module)
           << "\tfile: " << (file.empty() ? unknown : file)
           << "\tfunction: " << (function.empty() ? unknown : function)
           << "\tline: " << line;

    return stream.str();

    #else
    return unknown;
    #endif
}

    #if CC_PLATFORM == CC_PLATFORM_ANDROID

struct ThreadStack {
    void* stack[MAX_STACK_FRAMES];
    int   current;
    int   overflow;
};

extern "C" {

static pthread_once_t s_once           = PTHREAD_ONCE_INIT;
static pthread_key_t  s_threadStackKey = 0;

static void __attribute__((no_instrument_function))
init_once(void) {
    pthread_key_create(&s_threadStackKey, NULL);
}

static ThreadStack* __attribute__((no_instrument_function))
getThreadStack() {
    ThreadStack* ptr = (ThreadStack*)pthread_getspecific(s_threadStackKey);
    if (ptr) {
        return ptr;
    }

    ptr           = (ThreadStack*)calloc(1, sizeof(ThreadStack));
    ptr->current  = 0;
    ptr->overflow = 0;
    pthread_setspecific(s_threadStackKey, ptr);
    return ptr;
}

void __attribute__((no_instrument_function))
__cyg_profile_func_enter(void* this_fn, void* call_site) {
    pthread_once(&s_once, init_once);
    ThreadStack* ptr = getThreadStack();
    if (ptr->current < MAX_STACK_FRAMES) {
        ptr->stack[ptr->current++] = this_fn;
        ptr->overflow              = 0;
    } else {
        ptr->overflow++;
    }
}

void __attribute__((no_instrument_function))
__cyg_profile_func_exit(void* this_fn, void* call_site) {
    pthread_once(&s_once, init_once);
    ThreadStack* ptr = getThreadStack();

    if (ptr->overflow == 0 && ptr->current > 0) {
        ptr->current--;
    }

    if (ptr->overflow > 0) {
        ptr->overflow--;
    }
}
}

    #endif

std::string CallStack::basename(const std::string& path) {
    size_t found = path.find_last_of("/\\");

    if (std::string::npos != found) {
        return path.substr(found + 1);
    } else {
        return path;
    }
}

std::vector<void*> CallStack::backtrace() {
    #if CC_PLATFORM == CC_PLATFORM_ANDROID
    std::vector<void*> callstack;
    callstack.reserve(MAX_STACK_FRAMES);

    pthread_once(&s_once, init_once);
    ThreadStack* ptr = getThreadStack();
    for (int i = ptr->current - 1; i >= 0; i--) {
        callstack.push_back(ptr->stack[i]);
    }

    return callstack;

    #elif CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX
    std::vector<void*> callstack;
    callstack.reserve(MAX_STACK_FRAMES);

    void* array[MAX_STACK_FRAMES];
    int   count = ::backtrace(array, MAX_STACK_FRAMES);
    for (auto i = 0; i < count; i++) {
        callstack.push_back(array[i]);
    }
    return callstack;

    #elif CC_PLATFORM == CC_PLATFORM_WINDOWS
    std::vector<void*> callstack;
    callstack.reserve(MAX_STACK_FRAMES);

    void* array[MAX_STACK_FRAMES];
    int   count = CaptureStackBackTrace(0, MAX_STACK_FRAMES, array, NULL);
    for (auto i = 0; i < count; i++) {
        callstack.push_back(array[i]);
    }
    return callstack;

    #else
    return {};
    #endif
}

std::vector<StackFrame> CallStack::backtraceSymbols(const std::vector<void*>& callstack) {
    #if CC_PLATFORM == CC_PLATFORM_ANDROID
    std::vector<StackFrame> frames;
    size_t                  size = callstack.size();
    for (size_t i = 0; i < size; i++) {
        Dl_info    info;
        StackFrame frame;
        if (dladdr(callstack[i], &info)) {
            if (info.dli_fname && strlen(info.dli_fname) > 0) {
                frame.module = basename(info.dli_fname);
            }

            if (info.dli_sname && strlen(info.dli_sname) > 0) {
                char* real_name = abi::__cxa_demangle(info.dli_sname, nullptr, nullptr, nullptr);
                if (real_name) {
                    frame.function = real_name;
                    free(real_name);
                } else {
                    frame.function = info.dli_sname;
                }
            }
        }

        frames.push_back(std::move(frame));
    }
    return frames;

    #elif CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX
    size_t size = callstack.size();
    if (size == 0) {
        return {};
    }

    std::vector<StackFrame> frames;
    char**                  strs = ::backtrace_symbols(&callstack[0], size);
    for (size_t i = 0; i < size; i++) {
        StackFrame frame;
        frame.file = strs[i];
        frames.push_back(std::move(frame));
    }

    return frames;

    #elif CC_PLATFORM == CC_PLATFORM_WINDOWS
    std::vector<StackFrame> frames;

        #if _WIN64
    using PTR_DWORD = DWORD64;
        #else
    using PTR_DWORD = DWORD;
        #endif

    size_t size = callstack.size();
    for (size_t i = 0; i < size; i++) {
        StackFrame frame;
        PTR_DWORD  address = reinterpret_cast<PTR_DWORD>(callstack[i]);

        char      moduelName[MAX_PATH];
        #if _WIN64
        PTR_DWORD moduleBase = SymGetModuleBase64(_process, address);
        #else
        PTR_DWORD moduleBase = SymGetModuleBase(_process, address);
        #endif
        if (moduleBase && GetModuleFileNameA((HINSTANCE)moduleBase, moduelName, MAX_PATH)) {
            frame.module = basename(moduelName);
        }

        DWORD64      offset                                                = 0;
        char         symbolBuffer[sizeof(SYMBOL_INFO) + MAX_SYMBOL_LENGTH] = {0};
        PSYMBOL_INFO symbol                                                = (PSYMBOL_INFO)symbolBuffer;
        symbol->SizeOfStruct                                               = sizeof(SYMBOL_INFO);
        symbol->MaxNameLen                                                 = MAX_SYMBOL_LENGTH - 1;

        if (SymFromAddr(_process, address, &offset, symbol)) {
            frame.function = symbol->Name;
        }

        IMAGEHLP_LINE line;
        line.SizeOfStruct = sizeof(IMAGEHLP_LINE);
        DWORD offset_ln   = 0;

        if (SymGetLineFromAddr(_process, address, &offset_ln, &line)) {
            frame.file = line.FileName;
            frame.line = line.LineNumber;
        }

        frames.push_back(std::move(frame));
    }

    return frames;

    #else
    return {};
    #endif
}

    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
void CallStack::initSym() {
    _process = GetCurrentProcess();
    if (SymInitialize(_process, NULL, TRUE) == FALSE) {
        CCASSERT(0, "Failed to call SymInitialize.");
    }
    SymSetOptions(SYMOPT_LOAD_LINES);
}

void CallStack::cleanupSym() {
    SymCleanup(_process);
}

HANDLE CallStack::_process = 0;
    #endif

} // namespace cc

#endif
