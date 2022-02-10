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

#include "core/data/Object.h"

#include <vector>

namespace cc {

namespace {
std::vector<CCObject *> objectsToDestroy;
}

/* static */
void CCObject::deferredDestroy() {
    if (objectsToDestroy.empty()) return;
    auto deleteCount = static_cast<int32_t>(objectsToDestroy.size());
    for (size_t i = 0; i < deleteCount; ++i) {
        CCObject *obj = objectsToDestroy[i];
        if (!(obj->_objFlags & Flags::DESTROYED)) {
            obj->destroyImmediate();
            obj->release();
        }
    }
    // if we called b.destory() in a.onDestroy(), objectsToDestroy will be resized,
    // but we only destroy the objects which called destory in this frame.
    if (deleteCount == objectsToDestroy.size()) {
        objectsToDestroy.clear();
    } else {
        objectsToDestroy.erase(objectsToDestroy.begin(), objectsToDestroy.begin() + deleteCount);
    }
}

CCObject::CCObject(std::string name /* = ""*/)
: _name(std::move(name)) {
}

bool CCObject::destroy() {
    if (static_cast<bool>(_objFlags & Flags::DESTROYED)) {
        //cjh TODO:        warnID(5000);
        return false;
    }
    if (static_cast<bool>(_objFlags & Flags::TO_DESTROY)) {
        return false;
    }
    _objFlags |= Flags::TO_DESTROY;
    addRef();
    objectsToDestroy.emplace_back(this);

    //NOTE: EDITOR's deferredDestroyTimer trigger from ts
    return true;
}

void CCObject::destroyImmediate() {
    if (static_cast<bool>(_objFlags & Flags::DESTROYED)) {
        //cjh TODO:        errorID(5000);
        return;
    }

    onPreDestroy();

    // NOTE: native has been use smart pointer, not needed to implement 'destruct' interface, remove 'destruct' reference code

    _objFlags |= Flags::DESTROYED;
}

bool isObjectValid(CCObject *value, bool strictMode /* = false*/) {
    if (value == nullptr) {
        return false;
    }

    return !(value->_objFlags & (strictMode ? (CCObject::Flags::DESTROYED | CCObject::Flags::TO_DESTROY) : CCObject::Flags::DESTROYED));
}

} // namespace cc
