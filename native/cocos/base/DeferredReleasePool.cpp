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

#include "base/DeferredReleasePool.h"
#include "base/Log.h"
namespace cc {

ccstd::vector<RefCounted *> DeferredReleasePool::managedObjectArray{};

void DeferredReleasePool::add(RefCounted *object) {
    DeferredReleasePool::managedObjectArray.push_back(object);
}

void DeferredReleasePool::clear() {
    for (const auto &obj : DeferredReleasePool::managedObjectArray) {
        obj->release();
    }
    DeferredReleasePool::managedObjectArray.clear();
}

bool DeferredReleasePool::contains(RefCounted *object) {
    for (const auto &obj : DeferredReleasePool::managedObjectArray) { // NOLINT(readability-use-anyofallof) // remove after using C++20
        if (obj == object) {
            return true;
        }
    }
    return false;
}

void DeferredReleasePool::dump() {
    CC_LOG_DEBUG("number of managed object %ul\n", DeferredReleasePool::managedObjectArray.size());
    CC_LOG_DEBUG("%20s%20s%20s", "Object pointer", "Object id", "reference count");
    for (const auto &obj : DeferredReleasePool::managedObjectArray) {
        CC_UNUSED_PARAM(obj);
        CC_LOG_DEBUG("%20p%20u\n", obj, obj->getRefCount());
    }
}

} // namespace cc
