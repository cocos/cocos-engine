/****************************************************************************
Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "base/std/container/list.h"
#include "gfx-base/memory/MemoryView.h"
#include "gfx-base/memory/TLSFPool.h"

namespace cc::gfx {

struct AllocatorInfo {
    uint64_t chunkSize;
};

class Allocator {
public:
    explicit Allocator(const AllocatorInfo&);
    ~Allocator() = default;

    Allocator(const Allocator&) = delete;
    Allocator &operator=(const Allocator&) = delete;

    class IMemory {
    public:
        IMemory() = default;
        virtual ~IMemory() = default;

        virtual bool allocate() = 0;
        virtual void free(uint32_t index) = 0;
    };

    MemoryView *allocate(uint64_t size, uint64_t alignment);

    void free(MemoryView *);

    void setMemoryImpl(IMemory *impl);

private:
    void allocateMemory();

    AllocatorInfo _info;
    std::vector<TLSFPool> _pools;
    IMemory *_impl = nullptr;
};

} // namespace cc::gfx