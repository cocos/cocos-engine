/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#include "Utils.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_QUICKJS

    #include "Class.h"
    #include "Object.h"
    #include "ScriptEngine.h"

namespace se {

namespace internal {

void *SE_JS_GetPrivate(JSValue obj) {
    return JS_GetOpaqueDontCheckClassId(obj);
}

void SE_JS_SetPrivate(JSValue obj, void *data) {
    JS_SetOpaque(obj, data);
}

bool isJSBClass(JSValue obj) {
    return JS_IsNativeObject(obj);
}

void forceConvertJsValueToStdString(JSContext *cx, JSValue jsval, std::string *ret) {
    assert(ret != nullptr);
    const char *cStr = JS_ToCString(cx, jsval);
    if (cStr != nullptr) {
        *ret = cStr;
        JS_FreeCString(cx, cStr);
    }
}

void jsToSeArgs(JSContext *cx, int argc, JSValueConst *argv, ValueArray &outArr) {
    for (int i = 0; i < argc; ++i) {
        jsToSeValue(cx, argv[i], &outArr[i]);
    }
}

void seToJsArgs(JSContext *cx, int argc, const Value *args, JSValue *outArr) {
    for (int i = 0; i < argc; ++i) {
        JSValue v;
        seToJsValue(cx, args[i], &v);
        outArr[i] = v;
    }
}

void seToJsValue(JSContext *cx, const Value &arg, JSValue *outVal) {
    switch (arg.getType()) {
        case Value::Type::Number: {
            *outVal = JS_NewFloat64(cx, arg.toDouble());
        } break;

        case Value::Type::String: {
            *outVal = JS_NewStringLen(cx, arg.toString().c_str(), arg.toString().length());
        } break;

        case Value::Type::Boolean: {
            *outVal = JS_NewBool(cx, arg.toBoolean());
        } break;

        case Value::Type::Object: {
            *outVal = arg.toObject()->_getJSObject();
        } break;

        case Value::Type::Null: {
            *outVal = JS_NULL;
        } break;

        case Value::Type::Undefined: {
            *outVal = JS_UNDEFINED;
        } break;
        case Value::Type::BigInt: {
            *outVal = JS_NewBigInt64(cx, arg.toInt64());
        } break;
        default:
            assert(false);
            break;
    }
}

void jsToSeValue(JSContext *cx, JSValue jsval, Value *v) {
    if (JS_IsNumber(jsval)) {
        double val{0.0};
        JS_ToFloat64(cx, &val, jsval);
        v->setDouble(val);
    } else if (JS_IsString(jsval)) {
        const char *cStr = JS_ToCString(cx, jsval);
        if (cStr != nullptr) {
            v->setString(cStr);
            JS_FreeCString(cx, cStr);
        }
    } else if (JS_IsBool(jsval)) {
        v->setBoolean(JS_ToBool(cx, jsval));
    } else if (JS_IsObject(jsval)) {
        jsObjectToSeObject(jsval, v);
    } else if (JS_IsNull(jsval)) {
        v->setNull();
    } else if (JS_IsUndefined(jsval)) {
        v->setUndefined();
    } else if (JS_IsBigInt(cx, jsval)) {
        int64_t val{0};
        JS_ToBigInt64(cx, &val, jsval);
        v->setInt64(val);
    } else {
        assert(false);
    }
}

bool hasPrivate(JSValue obj) {
    return isJSBClass(obj);
}

void *getPrivate(JSValue obj) {
    bool found = isJSBClass(obj);
    if (found) {
        return SE_JS_GetPrivate(obj);
    }

    return nullptr;
}

void setPrivate(JSValue obj, Object *seObj) {
    bool found = isJSBClass(obj);
    assert(found);
    if (found) {
        SE_JS_SetPrivate(obj, seObj);
    }
}

void clearPrivate(JSValue obj) {
    bool found = isJSBClass(obj);
    if (found) {
        SE_JS_SetPrivate(obj, nullptr);
    }
}

void jsObjectToSeObject(JSValueConst jsval, Value *v) {
    Value   ret;
    Object *seObj = static_cast<Object *>(getPrivate(jsval));
    if (seObj == nullptr) {
        seObj = Object::_createJSObject(nullptr, jsval);
        v->setObject(seObj, true);
        seObj->decRef();
    } else {
        v->setObject(seObj, false);
    }
}

void setReturnJSValue(JSContext *cx, const Value &arg, JSValue *outVal) {
    seToJsValue(cx, arg, outVal);
    if (arg.isObject()) {
        if (!arg.toObject()->_isFirstSendToQuickAPI()) {
            JS_DupValue(cx, *outVal);
        } else {
            arg.toObject()->_setFirstSendToQuickAPI(false);
        }
    }
}

} // namespace internal
} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_QUICKJS
