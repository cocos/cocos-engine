/****************************************************************************
 Copyright Joyent, Inc. and other Node contributors.
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "ObjectWrap.h"
#include "Object.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

namespace {
bool gIsIsolateValid = false;
}

namespace se {

/* static */
void ObjectWrap::setIsolateValid(bool valid) {
    gIsIsolateValid = valid;
}

ObjectWrap::ObjectWrap() = default;

ObjectWrap::~ObjectWrap() {
    if (!gIsIsolateValid || persistent().IsEmpty()) {
        return;
    }
    //cjh            CC_ASSERT(persistent().IsNearDeath());
    persistent().ClearWeak();
    persistent().Reset();
}

bool ObjectWrap::init(v8::Local<v8::Object> handle, Object *parent, bool registerWeak) {
    CC_ASSERT(persistent().IsEmpty());
    _parent = parent;
    _registerWeakCallback = registerWeak;
    persistent().Reset(v8::Isolate::GetCurrent(), handle);
    makeWeak();
    return true;
}

void ObjectWrap::setFinalizeCallback(FinalizeFunc finalizeCb) {
    _finalizeCb = finalizeCb;
}

/*static*/
void *ObjectWrap::unwrap(v8::Local<v8::Object> handle, uint32_t fieldIndex) {
    CC_ASSERT(!handle.IsEmpty());
    CC_ASSERT(handle->InternalFieldCount() > 0);
    CC_ASSERT(fieldIndex >= 0 && fieldIndex < 1);
    return handle->GetAlignedPointerFromInternalField(static_cast<int>(fieldIndex));
}
void ObjectWrap::wrap(void *nativeObj, uint32_t fieldIndex) {
    CC_ASSERT(handle()->InternalFieldCount() > 0);
    CC_ASSERT(fieldIndex >= 0 && fieldIndex < 1);
    handle()->SetAlignedPointerInInternalField(static_cast<int>(fieldIndex), nativeObj);
    if (nativeObj) {
        persistent().SetWrapperClassId(MAGIC_CLASS_ID_JSB);
    } else {
        persistent().SetWrapperClassId(0);
    }
}

v8::Local<v8::Object> ObjectWrap::handle() {
    return handle(v8::Isolate::GetCurrent());
}

v8::Local<v8::Object> ObjectWrap::handle(v8::Isolate *isolate) {
    return v8::Local<v8::Object>::New(isolate, persistent());
}

v8::Persistent<v8::Object> &ObjectWrap::persistent() {
    return _handle;
}

void ObjectWrap::makeWeak() {
    // V8 offical documentation said that:
    // kParameter will pass a void* parameter back to the callback, kInternalFields
    // will pass the first two internal fields back to the callback,
    // kFinalizer will pass a void* parameter back, but is invoked before the object is
    // actually collected, so it can be resurrected. In the last case, it is not
    // possible to request a second pass callback.
    // enum class WeakCallbackType { kParameter, kInternalFields, kFinalizer };
    //
    // NOTE: We get random crashes while previewing material in editor's inspector window,
    // the reason is that kFinalizer will trigger weak callback when some assets are
    // still being used, jsbinding code will get a dead se::Object pointer that was
    // freed by weak callback. According V8 documentation, kParameter is a better option.
    if (_registerWeakCallback) {
        persistent().SetWeak(_parent, weakCallback, v8::WeakCallbackType::kParameter);
    } else {
        persistent().SetWeak();
    }
    //        persistent().MarkIndependent();
}

void ObjectWrap::ref() {
    CC_ASSERT(!persistent().IsEmpty());
    persistent().ClearWeak();
    _refs++;
}

void ObjectWrap::unref() {
    if (!gIsIsolateValid) {
        return;
    }
    CC_ASSERT(!persistent().IsEmpty());
    CC_ASSERT(!persistent().IsWeak());
    CC_ASSERT_GT(_refs, 0);
    if (--_refs == 0) {
        makeWeak();
    }
}

/*static*/
void ObjectWrap::weakCallback(const v8::WeakCallbackInfo<Object> &data) {
    Object *seObj = data.GetParameter();
    ObjectWrap *wrap = &seObj->_getWrap();

    CC_ASSERT(wrap->_refs == 0);
    wrap->_handle.Reset();
    if (wrap->_finalizeCb != nullptr) {
        wrap->_finalizeCb(seObj);
    } else {
        CC_ABORT();
    }
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
