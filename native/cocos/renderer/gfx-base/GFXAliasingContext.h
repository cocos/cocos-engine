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
#include "base/std/container/unordered_map.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXTexture.h"
#include "allocator/Allocator.h"

namespace cc::gfx {
using PassScope = uint32_t;
static constexpr PassScope UNDEFINED_PASS_SCOPE = ~(0U);

struct AliasingResource {
    GFXObject* object = nullptr;
};

struct AliasingInfo {
    AliasingResource before;
    AliasingResource after;
    AccessFlagBit beforeAccess = AccessFlagBit::NONE;
    AccessFlagBit afterAccess  = AccessFlagBit::NONE;
    PassScope nextScope = UNDEFINED_PASS_SCOPE;
};

struct AliasingResourceTracked {
    AliasingResource resource;
    PassScope first = UNDEFINED_PASS_SCOPE;
    PassScope last  = UNDEFINED_PASS_SCOPE;
    AccessFlags firstAccess = AccessFlagBit::NONE;
    AccessFlags lastAccess  = AccessFlagBit::NONE;
};

class AliasingContext {
public:
    AliasingContext() = default;
    ~AliasingContext() = default;

    struct ResourceInfo {
        AliasingResourceTracked tracked;
        uint32_t blockIndex;
        uint64_t start;
        uint64_t end;
    };

    void reset();

    void record(const ResourceInfo &);

private:
    ccstd::vector<ResourceInfo> _resources;
    ccstd::unordered_map<PassScope, AliasingInfo> _aliasingInfo;
};


} // namespace cc::gfx
