/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/RefCounted.h"

#if CC_REF_LEAK_DETECTION
    #include <algorithm> // std::find
    #include "base/Log.h"
    #include "base/std/container/list.h"
#endif

namespace cc {

#if CC_REF_LEAK_DETECTION
static void trackRef(RefCounted *ref);
static void untrackRef(RefCounted *ref);
#endif

RefCounted::RefCounted() { // NOLINT(modernize-use-equals-default)
#if CC_REF_LEAK_DETECTION
    trackRef(this);
#endif
}

RefCounted::~RefCounted() { // NOLINT(modernize-use-equals-default)
#if CC_REF_LEAK_DETECTION
    untrackRef(this);
#endif
}

void RefCounted::addRef() {
    ++_referenceCount;
}

void RefCounted::release() {
    CC_ASSERT_GT(_referenceCount, 0);
    --_referenceCount;

    if (_referenceCount == 0) {
        delete this;
    }
}

unsigned int RefCounted::getRefCount() const {
    return _referenceCount;
}

#if CC_REF_LEAK_DETECTION

static ccstd::list<RefCounted *> __refAllocationList;

void RefCounted::printLeaks() {
    // Dump Ref object memory leaks
    if (__refAllocationList.empty()) {
        CC_LOG_INFO("[memory] All Ref objects successfully cleaned up (no leaks detected).\n");
    } else {
        CC_LOG_INFO("[memory] WARNING: %d Ref objects still active in memory.\n", (int)__refAllocationList.size());

        for (const auto &ref : __refAllocationList) {
            CC_ASSERT(ref);
            const char *type = typeid(*ref).name();
            CC_LOG_INFO("[memory] LEAK: Ref object '%s' still active with reference count %d.\n", (type ? type : ""), ref->getRefCount());
        }
    }
}

static void trackRef(RefCounted *ref) {
    CC_ASSERT(ref);

    // Create memory allocation record.
    __refAllocationList.push_back(ref);
}

static void untrackRef(RefCounted *ref) {
    auto iter = std::find(__refAllocationList.begin(), __refAllocationList.end(), ref);
    if (iter == __refAllocationList.end()) {
        CC_LOG_INFO("[memory] CORRUPTION: Attempting to free (%s) with invalid ref tracking record.\n", typeid(*ref).name());
        return;
    }

    __refAllocationList.erase(iter);
}

#endif // #if CC_REF_LEAK_DETECTION

} // namespace cc
