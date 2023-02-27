/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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

#include "Utils.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

    #include <cfloat>
    #include "Class.h"
    #include "Object.h"
    #include "ScriptEngine.h"
    #include "base/Log.h"
    #include "base/Macros.h"

namespace se {

namespace internal {

void jsToSeArgs(const v8::FunctionCallbackInfo<v8::Value> &v8args, ValueArray &outArr) {
    v8::Isolate *isolate = v8args.GetIsolate();
    for (int i = 0; i < v8args.Length(); i++) {
        jsToSeValue(isolate, v8args[i], &outArr[i]);
    }
}

void seToJsArgs(v8::Isolate *isolate, const ValueArray &args, v8::Local<v8::Value> *outArr) {
    CC_ASSERT_NOT_NULL(outArr);
    uint32_t i = 0;
    for (const auto &data : args) {
        v8::Local<v8::Value> &jsval = outArr[i];
        seToJsValue(isolate, data, &jsval);
        ++i;
    }
}

void seToJsValue(v8::Isolate *isolate, const Value &v, v8::Local<v8::Value> *outJsVal) {
    CC_ASSERT_NOT_NULL(outJsVal);
    switch (v.getType()) {
        case Value::Type::Number:
            *outJsVal = v8::Number::New(isolate, v.toDouble());
            break;
        case Value::Type::String: {
            v8::MaybeLocal<v8::String> str = v8::String::NewFromUtf8(isolate, v.toString().data(), v8::NewStringType::kNormal, static_cast<int>(v.toString().length()));
            if (!str.IsEmpty()) {
                *outJsVal = str.ToLocalChecked();
            } else {
                outJsVal->Clear();
            }
        } break;
        case Value::Type::Boolean:
            *outJsVal = v8::Boolean::New(isolate, v.toBoolean());
            break;
        case Value::Type::Object:
            *outJsVal = v.toObject()->_getJSObject();
            break;
        case Value::Type::Null:
            *outJsVal = v8::Null(isolate);
            break;
        case Value::Type::Undefined:
            *outJsVal = v8::Undefined(isolate);
            break;
        case Value::Type::BigInt:
            *outJsVal = v8::BigInt::New(isolate, v.toInt64());
            break;
        default:
            CC_ABORT();
            break;
    }
}

void jsToSeValue(v8::Isolate *isolate, v8::Local<v8::Value> jsval, Value *v) {
    CC_ASSERT_NOT_NULL(v);
    v8::HandleScope handleScope(isolate);

    if (jsval->IsUndefined()) {
        v->setUndefined();
    } else if (jsval->IsNull()) {
        v->setNull();
    } else if (jsval->IsNumber()) {
        v8::MaybeLocal<v8::Number> jsNumber = jsval->ToNumber(isolate->GetCurrentContext());
        if (!jsNumber.IsEmpty()) {
            v->setDouble(jsNumber.ToLocalChecked()->Value());
        } else {
            v->setUndefined();
        }
    } else if (jsval->IsBigInt()) {
        v8::MaybeLocal<v8::BigInt> jsBigInt = jsval->ToBigInt(isolate->GetCurrentContext());
        if (!jsBigInt.IsEmpty()) {
            auto bigInt = jsBigInt.ToLocalChecked();
            v->setInt64(bigInt->Int64Value());
        } else {
            v->setUndefined();
        }
    } else if (jsval->IsString()) {
        v8::String::Utf8Value utf8(isolate, jsval);
        const char *utf8Str = *utf8;
        v->setString(utf8Str);
    } else if (jsval->IsBoolean()) {
        v8::MaybeLocal<v8::Boolean> jsBoolean = jsval->ToBoolean(isolate);
        if (!jsBoolean.IsEmpty()) {
            v->setBoolean(jsBoolean.ToLocalChecked()->Value());
        } else {
            v->setUndefined();
        }
    } else if (jsval->IsObject()) {
        v8::MaybeLocal<v8::Object> jsObj = jsval->ToObject(isolate->GetCurrentContext());
        if (!jsObj.IsEmpty()) {
            auto *obj = internal::getPrivate(isolate, jsObj.ToLocalChecked());
            if (obj == nullptr) {
                obj = Object::_createJSObject(nullptr, jsObj.ToLocalChecked());
            } else {
                obj->incRef();
            }
            v->setObject(obj, true);
            obj->decRef();
        } else {
            v->setUndefined();
        }
    }
}

template <int N>
static void warnWithinTimesInReleaseMode(const char *msg) {
    static int timesLimit = N;
    #if CC_DEBUG
    CC_LOG_DEBUG(msg);
    #else
    if (timesLimit > 0) {
        CC_LOG_WARNING(msg);
        timesLimit--;
    }
    #endif
}

template <typename T>
void setReturnValueTemplate(const Value &data, const T &argv) {
    switch (data.getType()) {
        case Value::Type::Undefined: {
            argv.GetReturnValue().Set(v8::Undefined(argv.GetIsolate()));
            break;
        }
        case Value::Type::Null: {
            argv.GetReturnValue().Set(v8::Null(argv.GetIsolate()));
            break;
        }
        case Value::Type::Number: {
            argv.GetReturnValue().Set(v8::Number::New(argv.GetIsolate(), data.toDouble()));
            break;
        }
        case Value::Type::BigInt: {
            constexpr int64_t maxSafeInt = 9007199254740991LL;  // value refer to JS Number.MAX_SAFE_INTEGER
            constexpr int64_t minSafeInt = -9007199254740991LL; // value refer to JS Number.MIN_SAFE_INTEGER
            if (data.toInt64() > maxSafeInt || data.toInt64() < minSafeInt) {
                // NOTICE: Precision loss will happend here.
                warnWithinTimesInReleaseMode<100>("int64 value is out of range for double");
                CC_ABORT(); // should be fixed in debug mode.
            }
            argv.GetReturnValue().Set(v8::Number::New(argv.GetIsolate(), static_cast<double>(data.toInt64())));
            break;
        }
        case Value::Type::String: {
            v8::MaybeLocal<v8::String> value = v8::String::NewFromUtf8(argv.GetIsolate(), data.toString().c_str(), v8::NewStringType::kNormal);
            CC_ASSERT(!value.IsEmpty());
            argv.GetReturnValue().Set(value.ToLocalChecked());
            break;
        }
        case Value::Type::Boolean: {
            argv.GetReturnValue().Set(v8::Boolean::New(argv.GetIsolate(), data.toBoolean()));
            break;
        }
        case Value::Type::Object: {
            argv.GetReturnValue().Set(data.toObject()->_getJSObject());
            break;
        }
    }
}

void setReturnValue(const Value &data, const v8::FunctionCallbackInfo<v8::Value> &argv) {
    setReturnValueTemplate(data, argv);
}

void setReturnValue(const Value &data, const v8::PropertyCallbackInfo<v8::Value> &argv) {
    setReturnValueTemplate(data, argv);
}

bool hasPrivate(v8::Isolate * /*isolate*/, v8::Local<v8::Value> value) {
    v8::Local<v8::Object> obj = v8::Local<v8::Object>::Cast(value);
    return obj->InternalFieldCount() > 0;
}

void setPrivate(v8::Isolate *isolate, ObjectWrap &wrap, Object *thizObj) {
    v8::Local<v8::Object> obj = wrap.handle(isolate);
    int c = obj->InternalFieldCount();
    CC_ASSERT_GT(c, 0);
    if (c == 1) {
        wrap.wrap(thizObj, 0);
    }
}

Object *getPrivate(v8::Isolate *isolate, v8::Local<v8::Value> value) {
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    v8::MaybeLocal<v8::Object> obj = value->ToObject(context);
    if (obj.IsEmpty()) {
        return nullptr;
    }

    v8::Local<v8::Object> objChecked = obj.ToLocalChecked();
    int c = objChecked->InternalFieldCount();
    if (c == 1) {
        return static_cast<Object *>(ObjectWrap::unwrap(objChecked, 0));
    }

    return nullptr;
}

void clearPrivate(v8::Isolate *isolate, ObjectWrap &wrap) {
    v8::Local<v8::Object> obj = wrap.handle(isolate);
    int c = obj->InternalFieldCount();
    if (c == 1) {
        wrap.wrap(nullptr, 0);
    }
}

} // namespace internal
} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
