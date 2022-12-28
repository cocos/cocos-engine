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

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

    #include "Class.h"
    #include "Object.h"
    #include "ScriptEngine.h"

namespace se {

namespace internal {

void *SE_JS_GetPrivate(JSObject *obj, uint32_t slot) {
    assert(slot >= 0 && slot < 2);
    const auto &v = JS::GetReservedSlot(obj, slot);
    return v.isNullOrUndefined() ? nullptr : v.toPrivate();
}

void SE_JS_SetPrivate(JSObject *obj, uint32_t slot, void *data) {
    assert(slot >= 0 && slot < 2);
    JS::SetReservedSlot(obj, slot, JS::PrivateValue(data));
}

bool isJSBClass(JSObject *obj) {
    const JSClass *cls = JS::GetClass(obj);
    return (cls->flags & (JSCLASS_HAS_RESERVED_SLOTS(2)) && (cls->flags & JSCLASS_USERBIT1));
}

void forceConvertJsValueToStdString(JSContext *cx, JS::HandleValue jsval, std::string *ret) {
    assert(ret != nullptr);
    JS::RootedString jsStr(cx, JS::ToString(cx, jsval));
    *ret = jsToStdString(cx, jsStr);
}

std::string jsToStdString(JSContext *cx, JS::HandleString jsStr) {
    JS::UniqueChars str = JS_EncodeStringToUTF8(cx, jsStr);
    std::string ret(str.get());
    return ret;
}

void jsToSeArgs(JSContext *cx, int argc, const JS::CallArgs &argv, ValueArray &outArr) {
    for (int i = 0; i < argc; ++i) {
        jsToSeValue(cx, argv[i], &outArr[i]);
    }
}

void seToJsArgs(JSContext *cx, const ValueArray &args, JS::RootedValueVector *outArr) {
    for (const auto &arg : args) {
        JS::RootedValue v(cx);
        seToJsValue(cx, arg, &v);
        outArr->append(v);
    }
}

void seToJsValue(JSContext *cx, const Value &arg, JS::MutableHandleValue outVal) {
    switch (arg.getType()) {
        case Value::Type::Number: {
            JS::RootedValue value(cx);
            value.setDouble(arg.toNumber());
            outVal.set(value);
        } break;

        case Value::Type::String: {
            JS::UTF8Chars utf8Str(arg.toString().c_str(), arg.toString().length());
            JSString *string = JS_NewStringCopyUTF8N(cx, utf8Str);
            JS::RootedValue value(cx);
            value.setString(string);
            outVal.set(value);
        } break;

        case Value::Type::Boolean: {
            JS::RootedValue value(cx);
            value.setBoolean(arg.toBoolean());
            outVal.set(value);
        } break;

        case Value::Type::Object: {
            JS::RootedValue value(cx, JS::ObjectValue(*arg.toObject()->_getJSObject()));
            outVal.set(value);
        } break;

        case Value::Type::Null: {
            JS::RootedValue value(cx);
            value.setNull();
            outVal.set(value);
        } break;

        case Value::Type::Undefined: {
            JS::RootedValue value(cx);
            value.setUndefined();
            outVal.set(value);
        } break;
        case Value::Type::BigInt: {
            JS::RootedValue value(cx);
            JS::BigInt *bi = JS::NumberToBigInt(cx, arg.toUint64());
            outVal.setBigInt(bi);
        } break;
        default:
            assert(false);
            break;
    }
}

void jsToSeValue(JSContext *cx, JS::HandleValue jsval, Value *v) {
    if (jsval.isNumber()) {
        v->setNumber(jsval.toNumber());
    } else if (jsval.isString()) {
        JS::RootedString jsstr(cx, jsval.toString());
        v->setString(jsToStdString(cx, jsstr));
    } else if (jsval.isBoolean()) {
        v->setBoolean(jsval.toBoolean());
    } else if (jsval.isObject()) {
        Object *object = nullptr;

        JS::RootedObject jsobj(cx, jsval.toObjectOrNull());
        PrivateObjectBase *privateObject = static_cast<PrivateObjectBase *>(internal::getPrivate(cx, jsobj, 0));
        void *nativeObj = privateObject ? privateObject->getRaw() : nullptr;
        bool needRoot = false;
        if (nativeObj != nullptr) {
            object = Object::getObjectWithPtr(nativeObj);
        }

        if (object == nullptr) {
            object = Object::_createJSObject(nullptr, jsobj);
            needRoot = true;
        }
        v->setObject(object, needRoot);
        object->decRef();
    } else if (jsval.isNull()) {
        v->setNull();
    } else if (jsval.isUndefined()) {
        v->setUndefined();
    } else if (jsval.isBigInt()) {
        v->setUint64(JS::ToBigUint64(jsval.toBigInt()));
    } else {
        assert(false);
    }
}

void setReturnValue(JSContext *cx, const Value &data, const JS::CallArgs &argv) {
    JS::RootedValue rval(cx);
    seToJsValue(cx, data, &rval);
    argv.rval().set(rval);
}

bool hasPrivate(JSContext *cx, JS::HandleObject obj) {
    return isJSBClass(obj);
}

void *getPrivate(JSContext *cx, JS::HandleObject obj, uint32_t slot) {
    bool found = isJSBClass(obj);
    if (found) {
        return SE_JS_GetPrivate(obj, slot);
    }

    return nullptr;
}

void setPrivate(JSContext *cx, JS::HandleObject obj, PrivateObjectBase *data, Object *seObj, PrivateData **outInternalData, JSFinalizeOp finalizeCb) {
    bool found = isJSBClass(obj);
    assert(found);
    if (found) {
        SE_JS_SetPrivate(obj, 0, data);
        SE_JS_SetPrivate(obj, 1, seObj);
        if (outInternalData != nullptr) {
            *outInternalData = nullptr;
        }
    }
}

void clearPrivate(JSContext *cx, JS::HandleObject obj) {
    bool found = isJSBClass(obj);
    if (found) {
        SE_JS_SetPrivate(obj, 0, nullptr);
        SE_JS_SetPrivate(obj, 1, nullptr);
    }
}

} // namespace internal
} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
