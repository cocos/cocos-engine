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

#include <cstdint>
#include "base/std/container/vector.h"
#include "allocator/Allocator.h"

namespace cc::gfx {
struct AliasingBarrier;

struct IAliasingScope {
    virtual void addBarrier(const AliasingBarrier&) = 0;
};

struct IAliasingResource {
};

struct AliasingBarrier {
    // metal
    IAliasingScope *first;
    IAliasingScope *second;

    // dx12
    IAliasingResource *before;
    IAliasingResource *after;
};

class AliasingContext {
public:
    AliasingContext() = default;
    ~AliasingContext() = default;

    struct ResourceInfo {
        IAliasingScope *scope;
        IAliasingResource *resource;
        uint32_t blockIndex;
        uint64_t start;
        uint64_t end;
    };

    void reset();

    void record(const ResourceInfo &);

private:
    ccstd::vector<ResourceInfo> _resources;
};


} // namespace cc::gfx
