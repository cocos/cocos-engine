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

    #include <mutex>
    #include "../Macros.h"
    #include "base/std/container/string.h"
    #include "base/std/container/unordered_map.h"
    #include "base/std/container/vector.h"

typedef void *(*MallocType)(size_t size);
typedef void (*FreeType)(void *ptr);

typedef void (*NewHookType)(const void *ptr, size_t size);
typedef void (*DeleteHookType)(const void *ptr);

namespace cc {

struct CC_DLL MemoryRecord {
    uint64_t address{0};
    size_t size{0};
    ccstd::vector<void *> callstack;
};

class CC_DLL MemoryHook {
public:
    MemoryHook();
    ~MemoryHook();

    /**
     * RecordMap's key is memory address.
     */
    using RecordMap = ccstd::unordered_map<uint64_t, MemoryRecord>;

    void addRecord(uint64_t address, size_t size);
    void removeRecord(uint64_t address);
    inline size_t getTotalSize() const { return _totalSize; }

private:
    /**
     * Dump all memory leaks to output window
     */
    void dumpMemoryLeak();

    static void log(const ccstd::string &msg);

    /**
     * Register all malloc hooks
     */
    void registerAll();

    /**
     * Unregister all malloc hooks
     */
    void unRegisterAll();

private:
    std::recursive_mutex _mutex;
    bool _hooking{false};
    RecordMap _records;
    size_t _totalSize{0U};
};

extern MemoryHook GMemoryHook;

} // namespace cc

#endif
