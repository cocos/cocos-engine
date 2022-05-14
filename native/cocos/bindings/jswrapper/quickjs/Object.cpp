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

#include "Object.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_QUICKJS

    #include "../MappingUtils.h"
    #include "Class.h"
    #include "ScriptEngine.h"
    #include "Utils.h"

namespace se {

std::unordered_map<Object *, void *> __objectMap; // Currently, the value `void*` is always nullptr

namespace {
JSContext *__cx = nullptr;
} // namespace

Object::Object() {
    _currentVMId = ScriptEngine::getInstance()->getVMId();
}

Object::~Object() {
    if (_cls == nullptr) {
        unroot();
    }

    if (_rootCount > 0) {
        unprotect();
    }

    auto iter = __objectMap.find(this);
    if (iter != __objectMap.end()) {
        __objectMap.erase(iter);
    }
}

bool Object::init(Class *cls, JSValue obj) {
    _cls = cls;
    _obj = obj;

    assert(__objectMap.find(this) == __objectMap.end());
    __objectMap.emplace(this, nullptr);

    if (_cls == nullptr) {
        root();
    }

    return true;
}

Object *Object::_createJSObject(Class *cls, JSValue obj) {
    Object *ret = new Object();
    if (!ret->init(cls, obj)) {
        delete ret;
        ret = nullptr;
    }

    return ret;
}

Object *Object::createPlainObject() {
    Object *obj = Object::_createJSObject(nullptr, JS_NewObject(__cx));
    return obj;
}

Object *Object::createObjectWithClass(Class *cls) {
    JSValue jsobj = Class::_createJSObjectWithClass(cls);
    Object *obj   = Object::_createJSObject(cls, jsobj);
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

Object *Object::createArrayObject(size_t length) {
    JSValue jsobj = JS_NewArray(__cx);
    for (size_t i = 0; i < length; ++i) {
        JS_SetPropertyUint32(__cx, jsobj, i, JS_UNDEFINED);
    }
    Object *obj = Object::_createJSObject(nullptr, jsobj);
    return obj;
}

Object *Object::createArrayBufferObject(const void *data, size_t byteLength) {
    Object *obj   = nullptr;
    JSValue jsobj = JS_NewArrayBufferCopy(__cx, reinterpret_cast<const uint8_t *>(data), byteLength);
    if (!JS_IsException(jsobj)) {
        obj = Object::_createJSObject(nullptr, jsobj);
    } else {
        ScriptEngine::getInstance()->clearException();
    }

    return obj;
}

/* static */
Object *Object::createExternalArrayBufferObject(void *contents, size_t byteLength, BufferContentsFreeFunc freeFunc, void *freeUserData /* = nullptr*/) {
    struct BackingStoreUserData {
        BufferContentsFreeFunc freeFunc;
        void *                 freeUserData;
        size_t                 byteLength;
    };

    auto *userData         = new BackingStoreUserData();
    userData->freeFunc     = freeFunc;
    userData->freeUserData = freeUserData;
    userData->byteLength   = byteLength;

    Object *obj = nullptr;

    JSValue jsobj = JS_NewArrayBuffer(
        __cx, reinterpret_cast<uint8_t *>(contents), byteLength, [](JSRuntime *rt, void *opaque, void *ptr) {
            auto *userData = reinterpret_cast<BackingStoreUserData *>(opaque);
            userData->freeFunc(ptr, userData->byteLength, userData->freeUserData);
            delete userData;
        },
        userData, 0);

    if (!JS_IsException(jsobj)) {
        obj = Object::_createJSObject(nullptr, jsobj);
    } else {
        ScriptEngine::getInstance()->clearException();
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

    #define CREATE_TYPEDARRAY(_name)                                                                       \
        {                                                                                                  \
            se::Value ctorVal;                                                                             \
            se::ScriptEngine::getInstance()->getGlobalObject()->getProperty(#_name, &ctorVal);             \
            JSValue ab = JS_NewArrayBufferCopy(__cx, reinterpret_cast<const uint8_t *>(data), byteLength); \
            JS_DupValue(__cx, ab);                                                                         \
            JSValue ta = JS_CallConstructor(__cx, ctorVal.toObject()->_getJSObject(), 1, &ab);             \
            JS_FreeValue(__cx, ab);                                                                        \
            Object *obj = Object::_createJSObject(nullptr, ta);                                            \
            return obj;                                                                                    \
        }

    switch (type) {
        case TypedArrayType::INT8:
            CREATE_TYPEDARRAY(Int8Array)
        case TypedArrayType::INT16:
            CREATE_TYPEDARRAY(Int16Array)
        case TypedArrayType::INT32:
            CREATE_TYPEDARRAY(Int32Array)
        case TypedArrayType::UINT8:
            CREATE_TYPEDARRAY(Uint8Array)
        case TypedArrayType::UINT16:
            CREATE_TYPEDARRAY(Uint16Array)
        case TypedArrayType::UINT32:
            CREATE_TYPEDARRAY(Uint32Array)
        case TypedArrayType::FLOAT32:
            CREATE_TYPEDARRAY(Float32Array)
        case TypedArrayType::FLOAT64:
            CREATE_TYPEDARRAY(Float64Array)
        default:
            assert(false); // Should never go here.
            break;
    }

    return nullptr;
    #undef CREATE_TYPEDARRAY
}

/* static */
Object *Object::createTypedArrayWithBuffer(TypedArrayType type, const Object *obj) {
    return Object::createTypedArrayWithBuffer(type, obj, 0);
}

/* static */
Object *Object::createTypedArrayWithBuffer(TypedArrayType type, const Object *obj, size_t offset) {
    size_t   byteLength{0};
    uint8_t *skip{nullptr};
    obj->getTypedArrayData(&skip, &byteLength);
    return Object::createTypedArrayWithBuffer(type, obj, offset, byteLength - offset);
}

/* static */
Object *Object::createTypedArrayWithBuffer(TypedArrayType type, const Object *obj, size_t offset, size_t byteLength) {
    if (type == TypedArrayType::NONE) {
        SE_LOGE("Don't pass se::Object::TypedArrayType::NONE to createTypedArray API!");
        return nullptr;
    }

    if (type == TypedArrayType::UINT8_CLAMPED) {
        SE_LOGE("Doesn't support to create Uint8ClampedArray with Object::createTypedArray API!");
        return nullptr;
    }

    assert(obj->isArrayBuffer());

    #define CREATE_TYPEDARRAY(_name, elementBytes)                                              \
        {                                                                                       \
            se::Value ctorVal;                                                                  \
            se::ScriptEngine::getInstance()->getGlobalObject()->getProperty(#_name, &ctorVal);  \
            JSValue ab      = obj->_getJSObject();                                              \
            JSValue args[3] = {                                                                 \
                ab,                                                                             \
                JS_NewUint32(__cx, offset),                                                     \
                JS_NewUint32(__cx, byteLength / elementBytes),                                  \
            };                                                                                  \
            JS_DupValue(__cx, ab);                                                              \
            JSValue ta = JS_CallConstructor(__cx, ctorVal.toObject()->_getJSObject(), 3, args); \
            JS_FreeValue(__cx, ab);                                                             \
            Object *obj = Object::_createJSObject(nullptr, ta);                                 \
            return obj;                                                                         \
        }

    switch (type) {
        case TypedArrayType::INT8:
            CREATE_TYPEDARRAY(Int8Array, 1)
        case TypedArrayType::INT16:
            CREATE_TYPEDARRAY(Int16Array, 2)
        case TypedArrayType::INT32:
            CREATE_TYPEDARRAY(Int32Array, 4)
        case TypedArrayType::UINT8:
            CREATE_TYPEDARRAY(Uint8Array, 1)
        case TypedArrayType::UINT16:
            CREATE_TYPEDARRAY(Uint16Array, 2)
        case TypedArrayType::UINT32:
            CREATE_TYPEDARRAY(Uint32Array, 4)
        case TypedArrayType::FLOAT32:
            CREATE_TYPEDARRAY(Float32Array, 4)
        case TypedArrayType::FLOAT64:
            CREATE_TYPEDARRAY(Float64Array, 8)
        default:
            assert(false); // Should never go here.
            break;
    }

    return nullptr;

    #undef CREATE_TYPEDARRAY
}

Object *Object::createUint8TypedArray(uint8_t *data, size_t dataCount) {
    return createTypedArray(TypedArrayType::UINT8, data, dataCount);
}

Object *Object::createJSONObject(const std::string &jsonStr) {
    Object *obj   = nullptr;
    JSValue jsval = JS_ParseJSON(__cx, jsonStr.c_str(), jsonStr.length(), "json_file");
    if (!JS_IsException(jsval)) {
        obj = Object::_createJSObject(nullptr, jsval);
    } else {
        ScriptEngine::getInstance()->clearException();
    }
    return obj;
}

void Object::_setFinalizeCallback(JSClassFinalizer finalizeCb) {
    _finalizeCb = finalizeCb;
}

bool Object::getProperty(const char *name, Value *data, bool cachePropertyName) {
    assert(data != nullptr);

    bool    ret   = false;
    JSValue jsval = JS_UNDEFINED;

    JSAtom atom = JS_NewAtom(__cx, name);

    if (JS_HasProperty(__cx, _obj, atom) > 0) {
        jsval = JS_GetProperty(__cx, _obj, atom);
        ret   = true;
    }

    JS_FreeAtom(__cx, atom);

    uint32_t    oldFreeValueCount = 0;
    se::Object *oldObj            = nullptr;
    if (data->isObject()) {
        oldObj = data->toObject();
        oldObj->incRef();
        oldFreeValueCount = data->getFreeValueCount();
        data->clearFreeValueCount();
    }

    if (ret) {
        internal::jsToSeValue(__cx, jsval, data);

        if (data->isObject()) {
            data->advanceFreeValueCount();
        }
    } else {
        data->setUndefined();
    }

    if (oldObj != nullptr) {
        for (uint32_t i = 0; i < oldFreeValueCount; ++i) {
            oldObj->unprotect();
        }
        oldObj->decRef();
    }
    return ret;
}

bool Object::setProperty(const char *name, const Value &v) {
    JSValue jsval = JS_UNDEFINED;
    internal::seToJsValue(__cx, v, &jsval);
    if (v.isObject()) {
        if (v.toObject()->_isFirstSendToQuickAPI()) {
            v.toObject()->_setFirstSendToQuickAPI(false);
        } else {
            JS_DupValue(__cx, jsval);
        }
    }

    JS_SetPropertyStr(__cx, _obj, name, jsval);
    return true;
}

bool Object::defineProperty(const char *name, JSPropGetter getter, JSPropSetter setter) {
    JSCFunctionListEntry entry = JS_CGETSET_DEF(name, getter, setter);
    JS_SetPropertyFunctionList(__cx, _obj, &entry, 1);
    return true;
}

bool Object::defineOwnProperty(const char *name, const se::Value &value, bool writable, bool enumerable, bool configurable) {
    JSValue jsval = JS_UNDEFINED;
    internal::seToJsValue(__cx, value, &jsval);

    int flags = 0;
    if (writable) {
        flags |= JS_PROP_WRITABLE;
    }
    if (enumerable) {
        flags |= JS_PROP_ENUMERABLE;
    }
    if (configurable) {
        flags |= JS_PROP_CONFIGURABLE;
    }

    return JS_DefinePropertyValueStr(__cx, _obj, name, jsval, flags) > 0;
}

bool Object::call(const ValueArray &args, Object *thisObject, Value *rval /* = nullptr*/) {
    assert(isFunction());

    JS_DupValue(__cx, _obj);
    JSValue *jsArgs = reinterpret_cast<JSValue *>(alloca(args.size() * sizeof(JSValue)));
    internal::seToJsArgs(__cx, args.size(), args.data(), jsArgs);
    JSValue jsRet = JS_Call(__cx, _obj, (thisObject != nullptr ? thisObject->_getJSObject() : JS_UNDEFINED), args.size(), jsArgs);
    if (!JS_IsException(jsRet) && rval != nullptr) {
        internal::jsToSeValue(__cx, jsRet, rval);
        JS_FreeValue(__cx, _obj);
        return true;
    }

    JS_FreeValue(__cx, _obj);
    ScriptEngine::getInstance()->clearException();
    return false;
}

bool Object::defineFunction(const char *funcName, JSCFunction *func) {
    JSValue jsFuncVal = JS_NewCFunction2(__cx, func, funcName, 0, JS_CFUNC_generic, 0);
    JS_SetPropertyStr(__cx, _obj, funcName, jsFuncVal);
    return true;
}

bool Object::getArrayLength(uint32_t *length) const {
    assert(length != nullptr);
    if (!isArray())
        return false;

    JSValue lengthVal = JS_GetPropertyStr(__cx, _obj, "length");
    assert(JS_IsNumber(lengthVal));
    return 0 == JS_ToUint32(__cx, length, lengthVal);
}

bool Object::getArrayElement(uint32_t index, Value *data) const {
    assert(data != nullptr);
    data->setUndefined();

    if (!isArray())
        return false;

    uint32_t length{0};
    getArrayLength(&length);
    if (length > 0 && index < length) {
        JSValue jsval = JS_GetPropertyUint32(__cx, _obj, index);
        internal::jsToSeValue(__cx, jsval, data);
        return true;
    }
    return false;
}

bool Object::setArrayElement(uint32_t index, const Value &data) {
    if (!isArray())
        return false;

    JSValue jsval = JS_UNDEFINED;
    internal::seToJsValue(__cx, data, &jsval);
    JSValue oldJsVal = JS_GetPropertyUint32(__cx, _obj, index); //FIXME: for add _obj[i] ref
    JS_SetPropertyUint32(__cx, _obj, index, jsval);
    return true;
}

bool Object::isFunction() const {
    return JS_IsFunction(__cx, _obj);
}

bool Object::isTypedArray() const {
    if (hasProperty("BYTES_PER_ELEMENT")) {
        return true;
    }

    return false;
}

Object::TypedArrayType Object::getTypedArrayType() const {
    TypedArrayType ret = TypedArrayType::NONE;

    JSValue     ctorVal  = JS_GetPropertyStr(__cx, _obj, "constructor");
    const char *ctorCStr = JS_ToCString(__cx, ctorVal);

    if (ctorCStr != nullptr) {
        std::string ctorStr{ctorCStr};
        if (ctorStr.find("Uint8Array") != std::string::npos) {
            ret = TypedArrayType::UINT8;
        }

        if (ctorStr.find("Uint16Array") != std::string::npos) {
            ret = TypedArrayType::UINT16;
        }

        if (ctorStr.find("Uint32Array") != std::string::npos) {
            ret = TypedArrayType::UINT32;
        }

        if (ctorStr.find("Int8Array") != std::string::npos) {
            ret = TypedArrayType::INT8;
        }

        if (ctorStr.find("Int16Array") != std::string::npos) {
            ret = TypedArrayType::INT16;
        }

        if (ctorStr.find("Int32Array") != std::string::npos) {
            ret = TypedArrayType::INT32;
        }

        if (ctorStr.find("Int8Array") != std::string::npos) {
            ret = TypedArrayType::INT8;
        }

        if (ctorStr.find("Float32Array") != std::string::npos) {
            ret = TypedArrayType::FLOAT32;
        }

        if (ctorStr.find("Float64Array") != std::string::npos) {
            ret = TypedArrayType::FLOAT64;
        }

        if (ctorStr.find("Uint8ClampedArray") != std::string::npos) {
            ret = TypedArrayType::UINT8_CLAMPED;
        }
    }

    JS_FreeCString(__cx, ctorCStr);
    return ret;
}

bool Object::getTypedArrayData(uint8_t **ptr, size_t *length) const {
    if (ptr == nullptr && length == nullptr) {
        return false;
    }
    size_t   byteOffset{0};
    size_t   byteLength{0};
    size_t   bytesPerElement{0};
    JSValue  ab = JS_GetTypedArrayBuffer(__cx, _obj, &byteOffset, &byteLength, &bytesPerElement);
    size_t   abBytes{0};
    uint8_t *abPtr = JS_GetArrayBuffer(__cx, &abBytes, ab);
    assert(byteOffset + byteLength <= abBytes);
    if (ptr != nullptr) {
        *ptr = abPtr + byteOffset;
    }
    if (length != nullptr) {
        *length = byteLength;
    }
    return true;
}

bool Object::isArray() const {
    return JS_IsArray(__cx, _obj) != 0;
}

bool Object::isArrayBuffer() const {
    if (hasProperty("byteLength") && !hasProperty("buffer")) {
        return true;
    }

    return false;
}

bool Object::hasProperty(const char *name) const {
    JSAtom atom = JS_NewAtom(__cx, name);
    bool   ret  = false;
    if (JS_HasProperty(__cx, _obj, atom) > 0) {
        ret = true;
    }

    JS_FreeAtom(__cx, atom);
    return ret;
}

bool Object::getArrayBufferData(uint8_t **ptr, size_t *length) const {
    assert(isArrayBuffer());
    assert(ptr != nullptr);
    size_t byteLength{0};
    *ptr = JS_GetArrayBuffer(__cx, &byteLength, _obj);
    if (length != nullptr) {
        *length = byteLength;
    }
    return true;
}

bool Object::getAllKeys(std::vector<std::string> *allKeys) const {
    assert(allKeys != nullptr);
    allKeys->clear();

    uint32_t        len{0};
    JSPropertyEnum *tab{nullptr};
    JSValue         val = JS_UNDEFINED;

    if (JS_GetOwnPropertyNames(__cx, &tab, &len, _obj, JS_GPN_STRING_MASK | JS_GPN_ENUM_ONLY) < 0) {
        return false;
    }

    do {
        for (int i = 0; i < len; i++) {
            const char *key = JS_AtomToCString(__cx, tab[i].atom);
            if (key != nullptr) {
                allKeys->emplace_back(key);
                JS_FreeCString(__cx, key);
            } else {
                break;
            }
        }
    } while (false);

    return true;
}

void Object::setPrivateData(void *data) {
    assert(_privateData == nullptr);
    assert(NativePtrToObjectMap::find(data) == NativePtrToObjectMap::end());
    internal::setPrivate(_obj, this);
    NativePtrToObjectMap::emplace(data, this);
    _privateData = data;
    setProperty("__native_ptr__", se::Value(static_cast<uint64_t>(reinterpret_cast<uintptr_t>(data))));
}

void *Object::getPrivateData() const {
    if (_privateData == nullptr) {
        const_cast<Object *>(this)->_privateData = internal::getPrivate(_obj);
    }
    return _privateData;
}

void Object::clearPrivateData(bool clearMapping) {
    if (_privateData != nullptr) {
        if (clearMapping) {
            NativePtrToObjectMap::erase(_privateData);
        }
        internal::clearPrivate(_obj);
        setProperty("__native_ptr__", se::Value(static_cast<uint64_t>(reinterpret_cast<uintptr_t>(nullptr))));
        _privateData = nullptr;
    }
}

void Object::setContext(JSContext *cx) {
    __cx = cx;
}

// static
void Object::cleanup() {
    for (const auto &e : __objectMap) {
        e.first->reset();
    }

    ScriptEngine::getInstance()->addAfterCleanupHook([]() {
        __objectMap.clear();
        const auto &instance = NativePtrToObjectMap::instance();
        for (const auto &e : instance) {
            e.second->decRef();
        }
        NativePtrToObjectMap::clear();
        __cx = nullptr;
    });
}

JSValue Object::_getJSObject() const {
    return _obj;
}

void Object::root() {
    if (_rootCount == 0) {
        protect();
    }
    ++_rootCount;
}

void Object::unroot() {
    if (_rootCount > 0) {
        --_rootCount;
        if (_rootCount == 0) {
            unprotect();
        }
    }
}

void Object::protect() {
    JS_DupValue(__cx, _obj);
}

void Object::unprotect() {
    JS_FreeValue(__cx, _obj);
}

void Object::reset() {
    _obj = JS_UNDEFINED;
}

bool Object::isRooted() const {
    return _rootCount > 0;
}

bool Object::strictEquals(Object *o) const {
    assert(false);
    return false;
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
        internal::forceConvertJsValueToStdString(__cx, _obj, &ret);
    } else if (isArrayBuffer()) {
        ret = "[object ArrayBuffer]";
    } else {
        ret = "[object Object]";
    }
    return ret;
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_QUICKJS
