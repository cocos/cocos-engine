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

#include <vector>
#include "Handle.h"
#include "base/Macros.h"

namespace cc {
namespace framegraph {

using PassInsertPoint = uint16_t;

class PassInsertPointManager final {
public:
    PassInsertPointManager(const PassInsertPointManager &)     = delete;
    PassInsertPointManager(PassInsertPointManager &&) noexcept = delete;
    PassInsertPointManager &operator=(const PassInsertPointManager &) = delete;
    PassInsertPointManager &operator=(PassInsertPointManager &&) noexcept = delete;

    static PassInsertPointManager &getInstance();

    PassInsertPoint record(const char *name, PassInsertPoint point);
    PassInsertPoint get(const char *name) const;

private:
    PassInsertPointManager()  = default;
    ~PassInsertPointManager() = default;

    inline PassInsertPoint get(StringHandle name) const;

    StringPool                   _stringPool;
    std::vector<PassInsertPoint> _insertPoints{};
};

//////////////////////////////////////////////////////////////////////////

PassInsertPoint PassInsertPointManager::get(const StringHandle name) const {
    return _insertPoints[name];
}

} // namespace framegraph
} // namespace cc
