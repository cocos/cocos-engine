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

#include "Handle.h"
#include "base/Macros.h"

namespace cc {
namespace framegraph {

using PassInsertPoint = uint16_t;

class PassInsertPointManager final {
public:
    PassInsertPointManager(const PassInsertPointManager &) = delete;
    PassInsertPointManager(PassInsertPointManager &&) noexcept = delete;
    PassInsertPointManager &operator=(const PassInsertPointManager &) = delete;
    PassInsertPointManager &operator=(PassInsertPointManager &&) noexcept = delete;

    static PassInsertPointManager &getInstance();

    PassInsertPoint record(const char *name, PassInsertPoint point);
    PassInsertPoint get(const char *name) const;

private:
    PassInsertPointManager() = default;
    ~PassInsertPointManager() = default;

    inline PassInsertPoint get(StringHandle name) const;

    StringPool _stringPool;
    ccstd::vector<PassInsertPoint> _insertPoints{};
};

//////////////////////////////////////////////////////////////////////////

PassInsertPoint PassInsertPointManager::get(const StringHandle name) const {
    return _insertPoints[name];
}

} // namespace framegraph
} // namespace cc
