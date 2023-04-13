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

#include "core/data/Object.h"
#include "base/std/container/vector.h"
#include "core/platform/Debug.h"

namespace cc {

namespace {
ccstd::vector<CCObject *> objectsToDestroy;
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

CCObject::CCObject(ccstd::string name /* = ""*/)
: _name(std::move(name)) {
}

CCObject::~CCObject() = default;

void CCObject::destruct() {
    _name.clear();
}

bool CCObject::destroy() {
    //NOTE: _objFlags will be set to TO_DESTROY when destroy method in TS is triggered.
    // CCObject::destroy method will be invoked at the end. Refer to cocos/core/data/object.ts
    /*
     public destroy (): boolean {
         if (this._objFlags & Destroyed) {
             warnID(5000);
             return false;
         }
         ... ...

         if (JSB) {
             // @ts-ignore
             // _destroy is a JSB method
             this._destroy();
         }

         return true;
     }
     */

    if (static_cast<bool>(_objFlags & Flags::TO_DESTROY)) {
        //NOTE: Should not return false because _objFlags is already set to TO_DESTROY in TS.
        // And Scene::destroy depends on the return value. Refer to:
        /*
         bool Scene::destroy() {
             bool success = Super::destroy();
             if (success) {
                 for (auto &child : _children) {
                     child->setActive(false);
                 }
             }
             ......
         }
         */
        return true;
    }

    if (static_cast<bool>(_objFlags & Flags::DESTROYED)) {
        debug::warnID(5000);
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
        debug::errorID(5000);
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
