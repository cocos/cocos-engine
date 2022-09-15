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

#pragma once

#include <utility>
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "base/std/optional.h"

#include <cstdint>

#include "base/Value.h"
#include "math/Vec3.h"

namespace cc {

struct Error {
    ccstd::optional<ccstd::string> msg;
};

struct BoundingBox {
    Vec3 min;
    Vec3 max;
};

struct VertexIdChannel {
    uint32_t stream{0};
    uint32_t index{0};
};

struct NativeDep {
    ccstd::string uuid;
    ccstd::string ext;
    bool __isNative__{false}; // NOLINT(bugprone-reserved-identifier)

    explicit NativeDep() = default;

    explicit NativeDep(bool isNative, ccstd::string uuid, ccstd::string ext)
    : uuid(std::move(uuid)), ext(std::move(ext)), __isNative__(isNative), _isValid(true) {}

    inline bool isValid() const { return _isValid; }

private:
    bool _isValid{false};
};

} // namespace cc
