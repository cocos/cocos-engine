/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE

    #include "Base.h"

    #include "../Value.h"

namespace se {

namespace internal {

struct PrivateData {
    void *data;
    JsFinalizeCallback finalizeCb;
};

bool defineProperty(JsValueRef obj, const char *name, JsNativeFunction getter, JsNativeFunction setter, bool enumerable, bool configurable);

void jsToSeArgs(int argc, const JsValueRef *argv, ValueArray *outArr);
void seToJsArgs(const ValueArray &args, JsValueRef *outArr);
void jsToSeValue(JsValueRef jsval, Value *v);
void seToJsValue(const Value &v, JsValueRef *jsval);

void forceConvertJsValueToStdString(JsValueRef jsval, std::string *ret);
void jsStringToStdString(JsValueRef jsStr, std::string *ret);

bool hasPrivate(JsValueRef obj);
void setPrivate(JsValueRef obj, void *data, JsFinalizeCallback finalizeCb);
void *getPrivate(JsValueRef obj);
void clearPrivate(JsValueRef obj);

} // namespace internal
} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE
