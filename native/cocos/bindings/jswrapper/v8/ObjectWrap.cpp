/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
#include "ObjectWrap.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

namespace se {

ObjectWrap::ObjectWrap() {
    refs_       = 0;
    _nativeObj  = nullptr;
    _finalizeCb = nullptr;
}

bool ObjectWrap::init(v8::Local<v8::Object> handle) {
    assert(persistent().IsEmpty());
    persistent().Reset(v8::Isolate::GetCurrent(), handle);
    makeWeak();
    return true;
}

void ObjectWrap::setFinalizeCallback(V8FinalizeFunc finalizeCb) {
    _finalizeCb = finalizeCb;
}

ObjectWrap::~ObjectWrap() {
    if (persistent().IsEmpty())
        return;
    //cjh            assert(persistent().IsNearDeath());
    persistent().ClearWeak();
    persistent().Reset();
}

/*static*/
void *ObjectWrap::unwrap(v8::Local<v8::Object> handle) {
    assert(!handle.IsEmpty());
    assert(handle->InternalFieldCount() > 0);
    return handle->GetAlignedPointerFromInternalField(0);
}

v8::Local<v8::Object> ObjectWrap::handle() {
    return handle(v8::Isolate::GetCurrent());
}

v8::Local<v8::Object> ObjectWrap::handle(v8::Isolate *isolate) {
    return v8::Local<v8::Object>::New(isolate, persistent());
}

v8::Persistent<v8::Object> &ObjectWrap::persistent() {
    return handle_;
}

void ObjectWrap::wrap(void *nativeObj) {
    assert(handle()->InternalFieldCount() > 0);
    _nativeObj = nativeObj;
    handle()->SetAlignedPointerInInternalField(0, nativeObj);
}

void ObjectWrap::makeWeak() {
    persistent().SetWeak(this, weakCallback, v8::WeakCallbackType::kFinalizer);
    //        persistent().MarkIndependent();
}

void ObjectWrap::ref() {
    assert(!persistent().IsEmpty());
    persistent().ClearWeak();
    refs_++;
}

void ObjectWrap::unref() {
    assert(!persistent().IsEmpty());
    assert(!persistent().IsWeak());
    assert(refs_ > 0);
    if (--refs_ == 0)
        makeWeak();
}

/*static*/
void ObjectWrap::weakCallback(const v8::WeakCallbackInfo<ObjectWrap> &data) {
    ObjectWrap *wrap = data.GetParameter();
    //        SE_LOGD("weakCallback: %p, nativeObj = %p, finalize: %p\n", wrap, wrap->_nativeObj, wrap->_finalizeCb);
    assert(wrap->refs_ == 0);
    wrap->handle_.Reset();
    if (wrap->_finalizeCb != nullptr) {
        wrap->_finalizeCb(wrap->_nativeObj); // wrap will be destroyed in wrap->_finalizeCb, should not use any wrap object after this line.
    } else {
        assert(false);
    }
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
