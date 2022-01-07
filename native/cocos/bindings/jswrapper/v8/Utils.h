/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include "../config.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

    #include "../Value.h"
    #include "Base.h"
    #include "ObjectWrap.h"

namespace se {

namespace internal {

struct PrivateData {
    PrivateObjectBase *data{nullptr};
    Object *           seObj{nullptr};
};

void jsToSeArgs(const v8::FunctionCallbackInfo<v8::Value> &_v8args, ValueArray &outArr);
void jsToSeValue(v8::Isolate *isolate, v8::Local<v8::Value> jsval, Value *v);
void seToJsArgs(v8::Isolate *isolate, const ValueArray &args, v8::Local<v8::Value> *outArr);
void seToJsValue(v8::Isolate *isolate, const Value &v, v8::Local<v8::Value> *outJsVal);

void setReturnValue(const Value &data, const v8::FunctionCallbackInfo<v8::Value> &argv);
void setReturnValue(const Value &data, const v8::PropertyCallbackInfo<v8::Value> &argv);

bool  hasPrivate(v8::Isolate *isolate, v8::Local<v8::Value> value);
void  setPrivate(v8::Isolate *isolate, ObjectWrap &wrap, PrivateObjectBase *data, Object *obj, PrivateData **outInternalData);
void *getPrivate(v8::Isolate *isolate, v8::Local<v8::Value> value, uint32_t index = 0);
void  clearPrivate(v8::Isolate *isolate, ObjectWrap &wrap);

} // namespace internal
} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
