/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "../Config.h"
#if USE_MEMORY_LEAK_DETECTOR

    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
        #include <Windows.h>
    #endif
    #include <cstdint>
    #include "../Macros.h"
    #include "base/std/container/string.h"
    #include "base/std/container/vector.h"

namespace cc {

    #define MAX_STACK_FRAMES  64
    #define MAX_SYMBOL_LENGTH 255

/**
 * A single frame of callstack.
 */
struct CC_DLL StackFrame {
    ccstd::string module;
    ccstd::string file;
    ccstd::string function;
    uint32_t line{0};

    ccstd::string toString();
};

/**
 * An utility class used to backtrace callstack.
 */
class CC_DLL CallStack {
public:
    static ccstd::string basename(const ccstd::string &path);

    static ccstd::vector<void *> backtrace();
    static ccstd::vector<StackFrame> backtraceSymbols(const ccstd::vector<void *> &callstack);

    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
    static void initSym();
    static void cleanupSym();

private:
    static HANDLE _process;
    #endif
};

} // namespace cc

#endif
