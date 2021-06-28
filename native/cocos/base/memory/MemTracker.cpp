/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/CoreStd.h"
#include "MemTracker.h"
#include "../StringUtil.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include <android/log.h>
#endif

#ifdef CC_MEMORY_TRACKER

extern "C" {
    #include <tommyhashdyn.h>
}

    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)

        #ifndef WIN32_LEAN_AND_MEAN
            #define WIN32_LEAN_AND_MEAN
        #endif
        #if !defined(NOMINMAX) && defined(_MSC_VER)
            #define NOMINMAX // required to stop windows.h messing up std::min
        #endif
        #include <Windows.h>

        #define CC_OUTPUT_STR(str) ::OutputDebugStringA(str)
    #else
        #define CC_OUTPUT_STR(str) fputs(str, stdout)
    #endif

    #define LEAK_FILENAME "MemoryLeaks.log"

namespace cc {

struct AllocHashNode {
    tommy_hashdyn_node node;
    void *key;
    unsigned int bytes;
    const char *filename;
    const char *function;
    unsigned int line;
};

struct AllocListParam {
    char *buf;
    char *last;
};

struct AllocDumpParam {
    std::map<std::string, unsigned int> allocMap;
};

inline static void FreeHashNode(AllocHashNode *n) {
    free(n);
}

static int HashNodeCompare(const void *arg, const void *obj) {
    return ((AllocHashNode *)obj)->key != (void *)arg;
}

static void HashNodeListAndFree(void *arg, void *obj) {
    AllocHashNode *node = (AllocHashNode *)obj;
    AllocListParam *param = (AllocListParam *)arg;
    int len = StringUtil::printf(param->buf, param->last, "%s(%u): {%u bytes} functions: %s\n", (node->filename ? node->filename : "(unknown source)"),
                                 node->line, node->bytes, (node->function ? node->function : ""));
    param->buf += len;
    FreeHashNode(node);
}

static void HashNodeListAndDump(void *arg, void *obj) {
    AllocHashNode *node = (AllocHashNode *)obj;
    AllocDumpParam *param = (AllocDumpParam *)arg;
    const char *key = node->filename ? node->filename : "null";
    std::map<std::string, unsigned int>::iterator ptr = param->allocMap.find(key);
    if (ptr == param->allocMap.end()) {
        param->allocMap[key] = node->bytes;
    } else {
        ptr->second += node->bytes;
    }
    //char tmpbuf[1024];
    //sprintf(tmpbuf, "%s|%s|%u\n", node->filename, node->function, node->bytes);
    //fputs(tmpbuf, param);
}

/////////////////////////////////////////////////////////

MemTracker::MemTracker()
: total_memory_allocated_(0) {
    allocations_ = malloc(sizeof(tommy_hashdyn));
    tommy_hashdyn_init((tommy_hashdyn *)allocations_);
}

MemTracker::~MemTracker() {
    ReportLeaks();
    tommy_hashdyn_done((tommy_hashdyn *)allocations_);
    free(allocations_);
}

void MemTracker::RecordAlloc(void *ptr, size_t sz, const char *file, size_t ln, const char *func) {
    tommy_hash_t hash = tommy_inthash_u32((tommy_uint32_t) reinterpret_cast<size_t>(ptr));

    mutex_.lock();

    AllocHashNode *node = (AllocHashNode *)tommy_hashdyn_search((tommy_hashdyn *)allocations_, HashNodeCompare, ptr, hash);
    if (node) {
        CCASSERT(0, "Double allocation with same address - this probably means you have a mismatched allocation / deallocation style.");
    } else {
        node = (AllocHashNode *)malloc(sizeof(AllocHashNode));
        node->key = ptr;
        node->bytes = (unsigned int)sz;
        node->filename = file;
        node->function = func;
        node->line = (unsigned int)ln;
        tommy_hashdyn_insert((tommy_hashdyn *)allocations_, &node->node, node, hash);
        total_memory_allocated_ += sz;
    }

    mutex_.unlock();
}

void MemTracker::RecordReAlloc(void *oldptr, void *ptr, size_t sz, const char *file, size_t ln, const char *func) {
    if (oldptr != ptr) {
        if (oldptr) RecordFree(oldptr);
        RecordAlloc(ptr, sz, file, ln, func);
        return;
    }

    if (sz == 0) {
        RecordFree(oldptr);
        return;
    }

    tommy_hash_t hash = tommy_inthash_u32((tommy_uint32_t) reinterpret_cast<size_t>(ptr));

    mutex_.lock();

    AllocHashNode *node = (AllocHashNode *)tommy_hashdyn_search((tommy_hashdyn *)allocations_, HashNodeCompare, ptr, hash);
    if (node) {
        int oldsize = (int)node->bytes;
        node->bytes = (unsigned int)sz;
        node->filename = file;
        node->function = func;
        node->line = (unsigned int)ln;
        total_memory_allocated_ += ((int)sz - oldsize);
    } else {
        CCASSERT(0, "Reallocation address not found.");
    }

    mutex_.unlock();
}

void MemTracker::RecordFree(void *ptr) {
    // deal cleanly with null pointers
    if (!ptr)
        return;

    tommy_hash_t hash = tommy_inthash_u32((tommy_uint32_t) reinterpret_cast<size_t>(ptr));

    mutex_.lock();

    AllocHashNode *node = (AllocHashNode *)tommy_hashdyn_remove((tommy_hashdyn *)allocations_, HashNodeCompare, ptr, hash);
    if (node) {
        total_memory_allocated_ -= node->bytes;
        FreeHashNode(node);
    } else {
        CCASSERT(0, "Unable to locate allocation unit - this probably means you have a mismatched allocation / deallocation style.");
    }

    mutex_.unlock();
}

int MemTracker::GetAllocSize(void *ptr) {
    int sz = -1;
    tommy_hash_t hash = tommy_inthash_u32((tommy_uint32_t) reinterpret_cast<size_t>(ptr));

    mutex_.lock();
    AllocHashNode *node = (AllocHashNode *)tommy_hashdyn_search((tommy_hashdyn *)allocations_, HashNodeCompare, ptr, hash);
    if (node) {
        sz = (int)node->bytes;
    }
    mutex_.unlock();
    return sz;
}

void MemTracker::ReportLeaks() {
    char *buffer;

    unsigned int count = (unsigned int)tommy_hashdyn_count((tommy_hashdyn *)allocations_);
    if (count == 0) {
        buffer = (char *)malloc(256);
        strcpy(buffer, "MemoryTracker: No memory leaks.\n");
    } else {
        int len = 768 * 1024;
        buffer = (char *)malloc(len);
        char *last = buffer + len - 3;
        char *buf = buffer;
        buf += sprintf(buffer, "MemoryTracker: Detected memory leaks !!!\n"
                               "MemoryTracker: (%u) Allocation(s) with total %u bytes.\n"
                               "MemoryTracker: Dumping allocations ->\n",
                       count, (unsigned int)total_memory_allocated_);

        AllocListParam param;
        param.buf = buf;
        param.last = last;
        tommy_hashdyn_foreach_arg((tommy_hashdyn *)allocations_, HashNodeListAndFree, &param);
    }

    FILE *f = fopen(LEAK_FILENAME, "w");
    if (f) {
        fputs(buffer, f);
        fclose(f);
    }
    CC_OUTPUT_STR(buffer);
    free(buffer);
}

struct AllocDumpNode {
    std::string name;
    unsigned int bytes;
};

bool operator<(const AllocDumpNode &a, const AllocDumpNode &b) {
    return a.bytes < b.bytes;
}

void MemTracker::DumpMemoryAllocation() {
    AllocDumpParam param;
    tommy_hashdyn_foreach_arg((tommy_hashdyn *)allocations_, HashNodeListAndDump, &param);
    std::priority_queue<AllocDumpNode> q;
    for (std::map<std::string, unsigned int>::iterator ptr = param.allocMap.begin(); ptr != param.allocMap.end(); ++ptr) {
        AllocDumpNode node;
        node.name = ptr->first;
        node.bytes = ptr->second;
        q.push(std::move(node));
    }

    unsigned int total = 0;
    char tmpbuf[1024];
    sprintf(tmpbuf, "total memory: %u\n", (unsigned int)total_memory_allocated_);
    std::string str = tmpbuf;
    while (!q.empty()) {
        const AllocDumpNode &n = q.top();
        sprintf(tmpbuf, "%s:%u\n", n.name.c_str(), n.bytes);
        str += tmpbuf;
        total += n.bytes;
        q.pop();
    }
    sprintf(tmpbuf, "calc total memory: %u\n", total);
    str += tmpbuf;

    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    FILE *f = fopen("MemDump.txt", "w");
    if (f) {
        fputs(str.c_str(), f);
        fclose(f);
    }
    #elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    __android_log_write(ANDROID_LOG_WARN, "Tao", str.c_str());
    #else
    fputs(str.c_str(), stdout);
    #endif
}

} // namespace cc
#endif
