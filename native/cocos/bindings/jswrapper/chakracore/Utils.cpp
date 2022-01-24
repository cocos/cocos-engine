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

#include "Utils.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE

    #include "Object.h"
    #include "ScriptEngine.h"
    #include "../HandleObject.h"

namespace se {

namespace internal {

bool defineProperty(JsValueRef obj, const char *name, JsNativeFunction getter, JsNativeFunction setter, bool enumerable, bool configurable) {
    bool result = false;

    JsPropertyIdRef propertyId = JS_INVALID_REFERENCE;
    _CHECK(JsCreatePropertyId(name, strlen(name), &propertyId));
    JsValueRef propertyDescriptor;
    _CHECK(JsCreateObject(&propertyDescriptor));

    const char *tmp = nullptr;
    JsValueRef jsValue = JS_INVALID_REFERENCE;
    JsPropertyIdRef id = JS_INVALID_REFERENCE;

    if (getter != nullptr) {
        tmp = "get";
        _CHECK(JsCreateFunction(getter, nullptr, &jsValue));
        _CHECK(JsCreatePropertyId(tmp, strlen(tmp), &id));
        _CHECK(JsSetProperty(propertyDescriptor, id, jsValue, true));
    }

    if (setter != nullptr) {
        tmp = "set";
        _CHECK(JsCreateFunction(setter, nullptr, &jsValue));
        _CHECK(JsCreatePropertyId(tmp, strlen(tmp), &id));
        _CHECK(JsSetProperty(propertyDescriptor, id, jsValue, true));
    }

    JsValueRef trueValue;
    _CHECK(JsGetTrueValue(&trueValue));

    tmp = "enumerable";
    _CHECK(JsCreatePropertyId(tmp, strlen(tmp), &id));
    _CHECK(JsSetProperty(propertyDescriptor, id, trueValue, true));

    tmp = "configurable";
    _CHECK(JsCreatePropertyId(tmp, strlen(tmp), &id));
    _CHECK(JsSetProperty(propertyDescriptor, id, trueValue, true));

    _CHECK(JsDefineProperty(obj, propertyId, propertyDescriptor, &result));
    return result;
}

void jsToSeArgs(int argc, const JsValueRef *argv, ValueArray *outArr) {
    outArr->reserve(argc);
    for (int i = 0; i < argc; ++i) {
        Value v;
        jsToSeValue(argv[i], &v);
        outArr->push_back(v);
    }
}

void seToJsArgs(const ValueArray &args, JsValueRef *outArr) {
    for (size_t i = 0, len = args.size(); i < len; ++i) {
        seToJsValue(args[i], &outArr[i]);
    }
}

void jsToSeValue(JsValueRef jsValue, Value *data) {
    JsValueType type;
    _CHECK(JsGetValueType(jsValue, &type));

    if (type == JsNull) {
        data->setNull();
    } else if (type == JsUndefined) {
        data->setUndefined();
    } else if (type == JsNumber) {
        double v = 0.0;
        _CHECK(JsNumberToDouble(jsValue, &v));
        data->setNumber(v);
    } else if (type == JsBoolean) {
        bool v = false;
        _CHECK(JsBooleanToBool(jsValue, &v));
        data->setBoolean(v);
    } else if (type == JsString) {
        std::string str;
        forceConvertJsValueToStdString(jsValue, &str);
        data->setString(str);
    } else if (type == JsObject || type == JsFunction || type == JsArrayBuffer || type == JsTypedArray || type == JsArray) {
        void *nativePtr = internal::getPrivate(jsValue);
        Object *obj = nullptr;
        if (nativePtr != nullptr) {
            obj = Object::getObjectWithPtr(nativePtr);
        }

        if (obj == nullptr) {
            obj = Object::_createJSObject(nullptr, jsValue);
        }
        data->setObject(obj, true);
        obj->decRef();
    } else {
        assert(false);
    }
}

void seToJsValue(const Value &v, JsValueRef *jsval) {
    switch (v.getType()) {
        case Value::Type::Null:
            _CHECK(JsGetNullValue(jsval));
            break;

        case Value::Type::Number:
            _CHECK(JsDoubleToNumber(v.toNumber(), jsval));
            break;

        case Value::Type::String: {
            _CHECK(JsCreateString(v.toString().c_str(), v.toString().length(), jsval));
        } break;

        case Value::Type::Boolean:
            _CHECK(JsBoolToBoolean(v.toBoolean(), jsval));
            break;

        case Value::Type::Object:
            *jsval = v.toObject()->_getJSObject();
            break;

        default: // Undefined
            _CHECK(JsGetUndefinedValue(jsval));
            break;
    }
}

void forceConvertJsValueToStdString(JsValueRef jsval, std::string *ret) {
    JsValueRef strVal = JS_INVALID_REFERENCE;
    _CHECK(JsConvertValueToString(jsval, &strVal));
    jsStringToStdString(strVal, ret);
}

void jsStringToStdString(JsValueRef strVal, std::string *ret) {
    // Get the buffer size
    size_t bufSize = 0;
    _CHECK(JsCopyString(strVal, nullptr, 0, &bufSize));
    // Allocate buffer
    char *buf = (char *)malloc(bufSize + 1);
    memset(buf, 0, bufSize + 1);
    // Copy
    _CHECK(JsCopyString(strVal, buf, bufSize, nullptr));
    *ret = buf;
    free(buf);
}

const char *KEY_PRIVATE_DATA = "__cc_private_data";

bool hasPrivate(JsValueRef obj) {
    JsValueType type;
    _CHECK(JsGetValueType(obj, &type));
    if (type != JsObject && type != JsFunction && type != JsArray && type != JsSymbol && type != JsArrayBuffer && type != JsTypedArray && type != JsDataView) {
        return nullptr;
    }

    bool isExist = false;
    JsErrorCode err = JsHasExternalData(obj, &isExist);
    assert(err == JsNoError);
    if (isExist)
        return true;

    JsPropertyIdRef propertyId = JS_INVALID_REFERENCE;
    _CHECK(JsCreatePropertyId(KEY_PRIVATE_DATA, strlen(KEY_PRIVATE_DATA), &propertyId));
    _CHECK(JsHasProperty(obj, propertyId, &isExist));
    return isExist;
}

void setPrivate(JsValueRef obj, void *data, JsFinalizeCallback finalizeCb) {
    bool isExist = false;
    _CHECK(JsHasExternalData(obj, &isExist));
    if (isExist) {
        _CHECK(JsSetExternalData(obj, data));
        return;
    }

    assert(finalizeCb);
    Object *privateObj = Object::createObjectWithClass(__jsb_CCPrivateData_class);
    privateObj->root();

    internal::PrivateData *privateData = (internal::PrivateData *)malloc(sizeof(internal::PrivateData));
    privateData->data = data;
    privateData->finalizeCb = finalizeCb;
    _CHECK(JsSetExternalData(privateObj->_getJSObject(), privateData));
    //        SE_LOGD("setPrivate: %p\n", data);

    JsPropertyIdRef propertyId = JS_INVALID_REFERENCE;
    JsCreatePropertyId(KEY_PRIVATE_DATA, strlen(KEY_PRIVATE_DATA), &propertyId);
    _CHECK(JsSetProperty(obj, propertyId, privateObj->_getJSObject(), true));

    privateObj->unroot();
    privateObj->decRef();
}

void *getPrivate(JsValueRef obj) {
    JsValueType type;
    _CHECK(JsGetValueType(obj, &type));
    if (type != JsObject && type != JsFunction && type != JsArray && type != JsSymbol && type != JsArrayBuffer && type != JsTypedArray && type != JsDataView) {
        return nullptr;
    }

    void *data = nullptr;
    bool isExist = false;
    _CHECK(JsHasExternalData(obj, &isExist));
    if (isExist) {
        _CHECK(JsGetExternalData(obj, &data));
        return data;
    }

    JsPropertyIdRef propertyId = JS_INVALID_REFERENCE;
    _CHECK(JsCreatePropertyId(KEY_PRIVATE_DATA, strlen(KEY_PRIVATE_DATA), &propertyId));
    _CHECK(JsHasProperty(obj, propertyId, &isExist));
    if (isExist) {
        JsValueRef privateDataVal;
        _CHECK(JsGetProperty(obj, propertyId, &privateDataVal));
        void *tmpPrivateData = nullptr;
        _CHECK(JsGetExternalData(privateDataVal, &tmpPrivateData));
        internal::PrivateData *privateData = (internal::PrivateData *)tmpPrivateData;
        assert(privateData);
        data = privateData->data;
    }
    //        SE_LOGD("getPrivate: %p\n", data);
    return data;
}

void clearPrivate(JsValueRef obj) {
    JsValueType type;
    _CHECK(JsGetValueType(obj, &type));
    if (type != JsObject && type != JsFunction && type != JsArray && type != JsSymbol && type != JsArrayBuffer && type != JsTypedArray && type != JsDataView) {
        return;
    }

    bool isExist = false;
    JsErrorCode err = JsHasExternalData(obj, &isExist);
    assert(err == JsNoError);
    if (isExist) {
        _CHECK(JsSetExternalData(obj, nullptr));
    } else {
        JsPropertyIdRef propertyId = JS_INVALID_REFERENCE;
        _CHECK(JsCreatePropertyId(KEY_PRIVATE_DATA, strlen(KEY_PRIVATE_DATA), &propertyId));
        _CHECK(JsHasProperty(obj, propertyId, &isExist));
        if (isExist) {
            void *data = nullptr;
            _CHECK(JsGetExternalData(obj, &data));
            internal::PrivateData *privateData = (internal::PrivateData *)data;
            free(privateData);
            JsSetExternalData(obj, nullptr);
            _CHECK(JsDeleteProperty(obj, propertyId, true, nullptr));
        }
    }
}

} // namespace internal
} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE
