/****************************************************************************
Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "GFXAliasingContext.h"

namespace cc::gfx {

void AliasingContext::clear()
{
    _resources.clear();
    _aliasingInfo.clear();
}

void AliasingContext::record(const ResourceInfo& inRes) {
    for (auto iter = _resources.begin(); iter != _resources.end();) {
        auto &current = *iter;

        // not overlap
        if (current.blockIndex != inRes.blockIndex || inRes.end < current.start || inRes.start > current.end) {
            ++iter;
            continue;
        }
        if (current.tracked.last != UNDEFINED_PASS_SCOPE) {
            auto &info = _aliasingInfo[current.tracked.last].emplace_back();
            info.before = current.tracked.resource;
            info.after = inRes.tracked.resource;
            info.beforeAccess = current.tracked.lastAccess;
            info.afterAccess = inRes.tracked.firstAccess;
            info.nextScope = inRes.tracked.first;
        }


        // *****[-------------current--------------]***
        // [------------------inRes-------------------]
        if (inRes.start <= current.start && inRes.end >= current.end) {
            iter = _resources.erase(iter);
            continue;
        }

        if (inRes.start > current.start && inRes.end < current.end) {
            // [-------------current--------------]
            // ******[-------inRes------]**********

            // split into 2 part, resize left part and add right part.
            current.end = inRes.start - 1;

            ResourceInfo right = current;
            right.start = inRes.end + 1;
            _resources.insert(iter + 1, right);

            // should not overlap with other resources
            break;
        }

        if (inRes.start > current.start) {
            // [-------------current-----------]********
            // **************[-----------inRes---------]
            current.end = inRes.start - 1;
        } else {
            // *****[-------------current--------------]
            // [----------inRes---------]***************
            current.start = inRes.end + 1;
        }

        ++iter;
    }

    _resources.emplace_back(inRes);
}

const ccstd::unordered_map<PassScope, ccstd::vector<AliasingInfo>> &AliasingContext::getAliasingData() const {
    return _aliasingInfo;
}

} // namespace cc::gfx
