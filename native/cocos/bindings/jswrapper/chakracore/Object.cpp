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

#include "Object.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE

    #include "../MappingUtils.h"
    #include "Class.h"
    #include "ScriptEngine.h"
    #include "Utils.h"

namespace se {

Object::Object()
: _cls(nullptr),
  _obj(JS_INVALID_REFERENCE),
  _privateData(nullptr),
  _finalizeCb(nullptr),
  _rootCount(0),
  _isCleanup(false) {
    _currentVMId = ScriptEngine::getInstance()->getVMId();
}

Object::~Object() {
    _cleanup();
}

Object *Object::createPlainObject() {
    JsValueRef jsobj;
    _CHECK(JsCreateObject(&jsobj));
    Object *obj = _createJSObject(nullptr, jsobj);
    return obj;
}

Object *Object::createArrayObject(size_t length) {
    JsValueRef jsObj = JS_INVALID_REFERENCE;
    _CHECK(JsCreateArray((unsigned int)length, &jsObj));
    Object *obj = _createJSObject(nullptr, jsObj);
    return obj;
}

Object *Object::createArrayBufferObject(void *data, size_t byteLength) {
    Object *   obj = nullptr;
    JsValueRef jsobj;
    _CHECK(JsCreateArrayBuffer((unsigned int)byteLength, &jsobj));
    ChakraBytePtr buffer       = nullptr;
    unsigned int  bufferLength = 0;
    if (JsNoError == JsGetArrayBufferStorage(jsobj, &buffer, &bufferLength)) {
        if (data) {
            memcpy((void *)buffer, data, byteLength);
        } else {
            memset((void *)buffer, 0, byteLength);
        }
        obj = Object::_createJSObject(nullptr, jsobj);
    }

    return obj;
}

Object *Object::createTypedArray(TypedArrayType type, const void *data, size_t byteLength) {
    if (type == TypedArrayType::NONE) {
        SE_LOGE("Don't pass se::Object::TypedArrayType::NONE to createTypedArray API!");
        return nullptr;
    }

    if (type == TypedArrayType::UINT8_CLAMPED) {
        SE_LOGE("Doesn't support to create Uint8ClampedArray with Object::createTypedArray API!");
        return nullptr;
    }

    JsTypedArrayType typedArrayType;
    size_t           elementLength = 0;

    switch (type) {
        case TypedArrayType::INT8:
            typedArrayType = JsArrayTypeInt8;
            elementLength  = byteLength;
            break;
        case TypedArrayType::INT16:
            typedArrayType = JsArrayTypeInt16;
            elementLength  = byteLength / 2;
            break;
        case TypedArrayType::INT32:
            typedArrayType = JsArrayTypeInt32;
            elementLength  = byteLength / 4;
            break;
        case TypedArrayType::UINT8:
            typedArrayType = JsArrayTypeUint8;
            elementLength  = byteLength;
            break;
        case TypedArrayType::UINT16:
            typedArrayType = JsArrayTypeUint16;
            elementLength  = byteLength / 2;
            break;
        case TypedArrayType::UINT32:
            typedArrayType = JsArrayTypeUint32;
            elementLength  = byteLength / 4;
            break;
        case TypedArrayType::FLOAT32:
            typedArrayType = JsArrayTypeFloat32;
            elementLength  = byteLength / 4;
            break;
        case TypedArrayType::FLOAT64:
            typedArrayType = JsArrayTypeFloat64;
            elementLength  = byteLength / 8;
            break;
        default:
            assert(false); // Should never go here.
            break;
    }

    Object *   obj = nullptr;
    JsValueRef jsobj;
    _CHECK(JsCreateTypedArray(typedArrayType, JS_INVALID_REFERENCE, 0, (unsigned int)elementLength, &jsobj));
    ChakraBytePtr    buffer       = nullptr;
    unsigned int     bufferLength = 0;
    JsTypedArrayType arrType;
    int              elementSize = 0;
    if (JsNoError == JsGetTypedArrayStorage(jsobj, &buffer, &bufferLength, &arrType, &elementSize)) {
        //If data has content,then will copy data into buffer,or will only clear buffer.
        if (data) {
            memcpy((void *)buffer, data, byteLength);
        } else {
            memset((void *)buffer, 0, byteLength);
        }

        obj = Object::_createJSObject(nullptr, jsobj);
    }

    return obj;
}

Object *Object::createUint8TypedArray(uint8_t *data, size_t dataCount) {
    return createTypedArray(TypedArrayType::UINT8, data, dataCount);
}

Object *Object::createJSONObject(const std::string &jsonStr) {
    bool    ok  = false;
    Object *obj = nullptr;

    Object *global = ScriptEngine::getInstance()->getGlobalObject();
    Value   jsonVal;
    ok = global->getProperty("JSON", &jsonVal);
    assert(ok);

    Value parseVal;
    ok = jsonVal.toObject()->getProperty("parse", &parseVal);
    assert(ok);

    Value      ret;
    ValueArray args;
    args.push_back(Value(jsonStr));
    if (parseVal.toObject()->call(args, jsonVal.toObject(), &ret)) {
        obj = Object::_createJSObject(nullptr, ret.toObject());
    }

    return obj;
}

Object *Object::getObjectWithPtr(void *ptr) {
    Object *obj  = nullptr;
    auto    iter = NativePtrToObjectMap::find(ptr);
    if (iter != NativePtrToObjectMap::end()) {
        obj = iter->second;
        obj->incRef();
    }
    return obj;
}

Object *Object::_createJSObject(Class *cls, JsValueRef obj) {
    Object *ret = new Object();
    if (!ret->init(obj)) {
        delete ret;
        ret = nullptr;
    }

    ret->_cls = cls;
    return ret;
}

Object *Object::createObjectWithClass(Class *cls) {
    JsValueRef jsobj = Class::_createJSObjectWithClass(cls);
    Object *   obj   = Object::_createJSObject(cls, jsobj);
    return obj;
}

bool Object::init(JsValueRef obj) {
    _obj = obj;
    return true;
}

void Object::_cleanup(void *nativeObject /* = nullptr*/) {
    if (_isCleanup)
        return;

    auto se = ScriptEngine::getInstance();
    if (_currentVMId == se->getVMId()) {
        if (_privateData != nullptr) {
            if (_obj != nullptr) {
                if (nativeObject == nullptr) {
                    nativeObject = internal::getPrivate(_obj);
                }

                if (nativeObject != nullptr) {
                    auto iter = NativePtrToObjectMap::find(nativeObject);
                    if (iter != NativePtrToObjectMap::end()) {
                        NativePtrToObjectMap::erase(iter);
                    }
                }
            }
        }

        if (_rootCount > 0) {
            // Don't unprotect if it's in cleanup, otherwise, it will trigger crash.
            if (!se->isInCleanup() && !se->isGarbageCollecting()) {
                unsigned int count = 0;
                _CHECK(JsRelease(_obj, &count));
            }
            _rootCount = 0;
        }
    } else {
        SE_LOGD("Object::_cleanup, ScriptEngine was initialized again, ignore cleanup work, oldVMId: %u, newVMId: %u\n", _currentVMId, se->getVMId());
    }

    _isCleanup = true;
}

void Object::cleanup() {
    ScriptEngine::getInstance()->addAfterCleanupHook([]() {
        const auto &instance = NativePtrToObjectMap::instance();
        se::Object *obj      = nullptr;
        for (const auto &e : instance) {
            obj             = e.second;
            obj->_isCleanup = true; // _cleanup will invoke NativePtrToObjectMap::erase method which will break this for loop. It isn't needed at ScriptEngine::cleanup step.
            obj->decRef();
        }
        NativePtrToObjectMap::clear();
        NonRefNativePtrCreatedByCtorMap::clear();
    });
}

void Object::_setFinalizeCallback(JsFinalizeCallback finalizeCb) {
    _finalizeCb = finalizeCb;
}

bool Object::getProperty(const char *name, Value *data) {
    assert(data != nullptr);
    data->setUndefined();

    JsPropertyIdRef propertyId;
    _CHECK(JsCreatePropertyId(name, strlen(name), &propertyId));

    bool exist = false;
    JsHasProperty(_obj, propertyId, &exist);

    if (exist) {
        JsValueRef jsValue;
        _CHECK(JsGetProperty(_obj, propertyId, &jsValue));
        internal::jsToSeValue(jsValue, data);
    }

    return exist;
}

bool Object::setProperty(const char *name, const Value &v) {
    JsValueRef jsValue = JS_INVALID_REFERENCE;
    internal::seToJsValue(v, &jsValue);
    JsPropertyIdRef propertyId;
    _CHECK(JsCreatePropertyId(name, strlen(name), &propertyId));
    _CHECK(JsSetProperty(_obj, propertyId, jsValue, true));
    return true;
}

bool Object::defineProperty(const char *name, JsNativeFunction getter, JsNativeFunction setter) {
    return internal::defineProperty(_obj, name, getter, setter, true, true);
}

bool Object::call(const ValueArray &args, Object *thisObject, Value *rval /* = nullptr*/) {
    assert(isFunction());

    JsValueRef contextObject;

    if (thisObject != nullptr) {
        contextObject = thisObject->_obj;
    } else {
        _CHECK(JsGetUndefinedValue(&contextObject));
    }

    JsValueRef *jsArgs = (JsValueRef *)malloc(sizeof(JsValueRef) * (args.size() + 1)); // Requires thisArg as first argument of arguments.

    std::vector<Object *> toUnrootedObjects;

    for (auto &arg : args) {
        if (arg.isObject()) {
            if (!arg.toObject()->isRooted()) {
                arg.toObject()->root();
                toUnrootedObjects.push_back(arg.toObject());
            }
        }
    }

    if (!args.empty()) {
        internal::seToJsArgs(args, jsArgs + 1);
    }

    jsArgs[0] = contextObject;

    JsValueRef  rcValue = JS_INVALID_REFERENCE;
    JsErrorCode errCode = JsCallFunction(_obj, jsArgs, args.size() + 1, &rcValue);
    free(jsArgs);

    for (auto &obj : toUnrootedObjects) {
        obj->unroot();
    }

    if (errCode == JsNoError) {
        if (rval != nullptr) {
            JsValueType type;
            JsGetValueType(rcValue, &type);
            if (rval != JS_INVALID_REFERENCE && type != JsUndefined) {
                internal::jsToSeValue(rcValue, rval);
            }
        }
        return true;
    }

    se::ScriptEngine::getInstance()->clearException();
    return false;
}

bool Object::defineFunction(const char *funcName, JsNativeFunction func) {
    JsPropertyIdRef propertyId = JS_INVALID_REFERENCE;
    _CHECK(JsCreatePropertyId(funcName, strlen(funcName), &propertyId));

    JsValueRef funcVal = JS_INVALID_REFERENCE;
    _CHECK(JsCreateFunction(func, nullptr, &funcVal));

    _CHECK(JsSetProperty(_obj, propertyId, funcVal, true));
    return true;
}

static bool isArrayOfObject(JsValueRef obj) {
    JsValueType type;
    if (JsNoError == JsGetValueType(obj, &type)) {
        return type == JsArray;
    }
    return false;
}

static bool getArrayLengthOfObject(JsValueRef arrObj, uint32_t *length) {
    assert(isArrayOfObject(arrObj));
    assert(length != nullptr);

    JsErrorCode     err        = JsNoError;
    JsPropertyIdRef propertyId = JS_INVALID_REFERENCE;
    const char *    lengthName = "length";
    err                        = JsCreatePropertyId(lengthName, strlen(lengthName), &propertyId);
    if (err != JsNoError)
        return false;

    JsValueRef jsLen = JS_INVALID_REFERENCE;
    err              = JsGetProperty(arrObj, propertyId, &jsLen);
    if (err != JsNoError)
        return false;

    int intVal = 0;
    err        = JsNumberToInt(jsLen, &intVal);
    if (err != JsNoError)
        return false;

    *length = (uint32_t)intVal;

    return true;
}

bool Object::isArray() const {
    return isArrayOfObject(_obj);
}

bool Object::getArrayLength(uint32_t *length) const {
    return getArrayLengthOfObject(_obj, length);
}

bool Object::getArrayElement(uint32_t index, Value *data) const {
    assert(isArray());
    assert(data != nullptr);

    JsErrorCode err     = JsNoError;
    JsValueRef  result  = JS_INVALID_REFERENCE;
    JsValueRef  jsIndex = JS_INVALID_REFERENCE;
    err                 = JsIntToNumber(index, &jsIndex);
    if (err != JsNoError)
        return false;

    err = JsGetIndexedProperty(_obj, jsIndex, &result);
    if (err != JsNoError)
        return false;

    internal::jsToSeValue(result, data);

    return true;
}

bool Object::setArrayElement(uint32_t index, const Value &data) {
    assert(isArray());

    JsErrorCode err     = JsNoError;
    JsValueRef  jsIndex = JS_INVALID_REFERENCE;
    err                 = JsIntToNumber(index, &jsIndex);
    if (err != JsNoError)
        return false;

    JsValueRef value = JS_INVALID_REFERENCE;
    internal::seToJsValue(data, &value);

    err = JsSetIndexedProperty(_obj, jsIndex, value);
    if (err != JsNoError)
        return false;

    return true;
}

bool Object::getAllKeys(std::vector<std::string> *allKeys) const {
    assert(allKeys != nullptr);

    JsErrorCode err  = JsNoError;
    JsValueRef  keys = JS_INVALID_REFERENCE;
    err              = JsGetOwnPropertyNames(_obj, &keys);
    if (err != JsNoError)
        return false;

    uint32_t len = 0;
    bool     ok  = false;
    ok           = getArrayLengthOfObject(keys, &len);
    if (!ok)
        return false;

    std::string key;
    for (uint32_t index = 0; index < len; ++index) {
        JsValueRef indexValue = JS_INVALID_REFERENCE;
        err                   = JsIntToNumber(index, &indexValue);
        if (err != JsNoError)
            return false;

        JsValueRef nameValue = JS_INVALID_REFERENCE;
        JsGetIndexedProperty(keys, indexValue, &nameValue);

        internal::jsStringToStdString(nameValue, &key);
        allKeys->push_back(key);
    }

    return true;
}

bool Object::isFunction() const {
    JsValueType type;
    _CHECK(JsGetValueType(_obj, &type));
    if (_obj != JS_INVALID_REFERENCE && type == JsFunction) {
        return true;
    }

    return false;
}

bool Object::_isNativeFunction() const {
    if (isFunction()) {
        std::string info = toString();
        if (info.find("[native code]") != std::string::npos) {
            return true;
        }
    }
    return false;
}

bool Object::isTypedArray() const {
    JsValueType type;
    if (JsNoError == JsGetValueType(_obj, &type)) {
        return type == JsTypedArray;
    }
    return false;
}

Object::TypedArrayType Object::getTypedArrayType() const {
    TypedArrayType ret = TypedArrayType::NONE;
    if (!isTypedArray())
        return ret;

    JsTypedArrayType type;
    JsValueRef       arrayBuffer = JS_INVALID_REFERENCE;
    unsigned int     byteOffset  = 0;
    unsigned int     byteLength  = 0;

    if (JsNoError == JsGetTypedArrayInfo(_obj, &type, &arrayBuffer, &byteOffset, &byteLength)) {
        if (type == JsArrayTypeInt8)
            ret = TypedArrayType::INT8;
        else if (type == JsArrayTypeInt16)
            ret = TypedArrayType::INT16;
        else if (type == JsArrayTypeInt32)
            ret = TypedArrayType::INT32;
        else if (type == JsArrayTypeUint8)
            ret = TypedArrayType::UINT8;
        else if (type == JsArrayTypeUint8Clamped)
            ret = TypedArrayType::UINT8_CLAMPED;
        else if (type == JsArrayTypeUint16)
            ret = TypedArrayType::UINT16;
        else if (type == JsArrayTypeUint32)
            ret = TypedArrayType::UINT32;
        else if (type == JsArrayTypeFloat32)
            ret = TypedArrayType::FLOAT32;
        else if (type == JsArrayTypeFloat64)
            ret = TypedArrayType::FLOAT64;
    }

    return ret;
}

bool Object::getTypedArrayData(uint8_t **ptr, size_t *length) const {
    assert(isTypedArray());
    JsTypedArrayType arrayType;
    ChakraBytePtr    buffer       = nullptr;
    unsigned int     bufferLength = 0;
    int              elementSize  = 0;
    bool             ret          = false;
    if (JsNoError == JsGetTypedArrayStorage(_obj, &buffer, &bufferLength, &arrayType, &elementSize)) {
        *ptr    = buffer;
        *length = bufferLength;
        ret     = true;
    } else {
        *ptr    = nullptr;
        *length = 0;
    }
    return ret;
}

bool Object::isArrayBuffer() const {
    JsValueType type;
    if (JsNoError == JsGetValueType(_obj, &type)) {
        return type == JsArrayBuffer;
    }
    return false;
}

bool Object::getArrayBufferData(uint8_t **ptr, size_t *length) const {
    assert(isArrayBuffer());
    ChakraBytePtr buffer       = nullptr;
    unsigned int  bufferLength = 0;
    bool          ret          = false;
    if (JsNoError == JsGetArrayBufferStorage(_obj, &buffer, &bufferLength)) {
        *ptr    = buffer;
        *length = bufferLength;
        ret     = true;
    } else {
        *ptr    = nullptr;
        *length = 0;
    }
    return ret;
}

void *Object::getPrivateData() const {
    if (_privateData == nullptr) {
        const_cast<Object *>(this)->_privateData = internal::getPrivate(_obj);
    }
    return _privateData;
}

void Object::setPrivateData(void *data) {
    assert(_privateData == nullptr);
    assert(NativePtrToObjectMap::find(data) == NativePtrToObjectMap::end());
    internal::setPrivate(_obj, data, _finalizeCb);
    NativePtrToObjectMap::emplace(data, this);
    _privateData = data;
}

void Object::clearPrivateData(bool clearMapping) {
    if (_privateData != nullptr) {
        if (clearMapping)
            NativePtrToObjectMap::erase(_privateData);
        internal::clearPrivate(_obj);
        _privateData = nullptr;
    }
}

JsValueRef Object::_getJSObject() const {
    return _obj;
}

Class *Object::_getClass() const {
    return _cls;
}

void Object::root() {
    if (_rootCount == 0) {
        unsigned int count = 0;
        _CHECK(JsAddRef(_obj, &count));
    }
    ++_rootCount;
}

void Object::unroot() {
    if (_rootCount > 0) {
        --_rootCount;
        if (_rootCount == 0) {
            // Don't unprotect if it's in cleanup, otherwise, it will trigger crash.
            auto se = ScriptEngine::getInstance();
            if (_currentVMId == se->getVMId()) {
                if (!se->isInCleanup() && !se->isGarbageCollecting()) {
                    unsigned int count = 0;
                    _CHECK(JsRelease(_obj, &count));
                }
            } else {
                SE_LOGD("Object::unroot, ScriptEngine was initialized again, ignore cleanup work, oldVMId: %u, newVMId: %u\n", _currentVMId, se->getVMId());
            }
        }
    }
}

bool Object::isRooted() const {
    return _rootCount > 0;
}

bool Object::strictEquals(Object *o) const {
    bool same = false;
    _CHECK(JsStrictEquals(_obj, o->_obj, &same));
    return same;
}

bool Object::attachObject(Object *obj) {
    assert(obj);

    Object *global = ScriptEngine::getInstance()->getGlobalObject();
    Value   jsbVal;
    if (!global->getProperty("jsb", &jsbVal))
        return false;
    Object *jsbObj = jsbVal.toObject();

    Value func;

    if (!jsbObj->getProperty("registerNativeRef", &func))
        return false;

    ValueArray args;
    args.push_back(Value(this));
    args.push_back(Value(obj));
    func.toObject()->call(args, global);
    return true;
}

bool Object::detachObject(Object *obj) {
    assert(obj);
    Object *global = ScriptEngine::getInstance()->getGlobalObject();
    Value   jsbVal;
    if (!global->getProperty("jsb", &jsbVal))
        return false;
    Object *jsbObj = jsbVal.toObject();

    Value func;

    if (!jsbObj->getProperty("unregisterNativeRef", &func))
        return false;

    ValueArray args;
    args.push_back(Value(this));
    args.push_back(Value(obj));
    func.toObject()->call(args, global);
    return true;
}

std::string Object::toString() const {
    std::string ret;
    if (isFunction() || isArray() || isTypedArray()) {
        internal::forceConvertJsValueToStdString(_obj, &ret);
    } else if (isArrayBuffer()) {
        ret = "[object ArrayBuffer]";
    } else {
        ret = "[object Object]";
    }
    return ret;
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE
