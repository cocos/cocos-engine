/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
#include <memory>
#include <unordered_set>
#include "../MappingUtils.h"
#include "Class.h"
#include "ScriptEngine.h"
#include "Utils.h"
#include "application/ApplicationManager.h"

#define MAX_STRING_LEN 512

namespace se {
std::unique_ptr<std::unordered_set<Object*>> __objectSet;
std::unordered_set<Object*> __objectSetToBeReleasedInCleanup;

Object::Object(): _objRef(this) {}
Object::~Object() {
    if (!_destructInFinalizer && _cls != nullptr) {
        // Remove wrap will ensure that we release the underlying `v8impl::Reference` that the private wrap associates with.
        // This could avoid memory leaks of `v8impl::Reference`.
        // We just do this if `_cls` is not null since only JSB objects get wrapped,
        OH_JSVM_RemoveWrap(_env, _objRef.getValue(_env), nullptr);
    }
    
    if (__objectSet) {
        __objectSet->erase(this);
    }

    delete _privateObject;
    _privateObject = nullptr;
}

Object* Object::createObjectWithClass(Class* cls) {
    JSVM_Value jsobj = Class::_createJSObjectWithClass(cls);
    Object* obj = Object::_createJSObject(ScriptEngine::getEnv(), jsobj, cls);
    return obj;
}

bool Object::setProperty(const char* name, const Value& data) {
    JSVM_Status status;
    JSVM_Value jsVal;
    bool ret = internal::seToJsValue(data, &jsVal);
    if(!ret) {
        return false;
    }
    NODE_API_CALL(status, _env, OH_JSVM_SetNamedProperty(_env, _objRef.getValue(_env), name, jsVal));
    return status == JSVM_OK;
}

bool Object::getProperty(const char* name, Value* d) {
    JSVM_Status status;
    JSVM_Value jsVal;
    Value data;
    NODE_API_CALL(status, _env, OH_JSVM_GetNamedProperty(_env, _objRef.getValue(_env), name, &jsVal));
    if (status == JSVM_OK) {
        internal::jsToSeValue(jsVal, &data);
        *d = data;
        if (data.isUndefined()) {
            return false;
        }
        return true;
    }
    return false;
}

PrivateObjectBase* Object::getPrivateObject() const {
    return _privateObject;
}

void Object::setPrivateObject(PrivateObjectBase* data) {
    assert(_privateData == nullptr);
#if CC_DEBUG
    if (data != nullptr) {
        NativePtrToObjectMap::filter(data->getRaw(), _getClass())
            .forEach([&](se::Object* seObj) {
                auto* pri = seObj->getPrivateObject();
                SE_LOGE("Already exists object %s/[%s], trying to add %s/[%s]\n", pri->getName(), typeid(*pri).name(), data->getName(), typeid(*data).name());
    #if JSB_TRACK_OBJECT_CREATION
                SE_LOGE(" previous object created at %s\n", it->second->_objectCreationStackFrame.c_str());
    #endif
                CC_ABORT();
            });
    }
#endif

    if (data) {
        _privateData = data->getRaw();
        _privateObject = data;
        NativePtrToObjectMap::emplace(_privateData, this);
    }

    JSVM_Status status;
    auto tmpThis = _objRef.getValue(_env);

    // Passing nullptr to the `result` parameter to make JSVM mangle the lifecycle of `v8impl::Reference`
    NODE_API_CALL(status, _env, OH_JSVM_Wrap(_env, tmpThis, this, weakCallback, this /* finalize_hint */, nullptr));
    
    // WORKAROUND: See the explain in `ObjectRef::deleteRef` about why we need to `decRef` here.
    _objRef.decRef(_env);
    //
}

bool Object::deleteProperty(const char* name) {
    JSVM_Status status;
    JSVM_Value key;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_GetNamedProperty(_env, _objRef.getValue(_env), name, &key), false);
    bool ret = false;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_DeleteProperty(_env, _objRef.getValue(_env), key, &ret), false);
    return ret;
}

bool Object::isArray() const {
    JSVM_Status status;
    bool ret = false;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_IsArray(_env, _objRef.getValue(_env), &ret), false);
    return ret;
}

bool Object::getArrayLength(uint32_t* length) const {
    JSVM_Status status;
    uint32_t len = 0;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_GetArrayLength(_env, _objRef.getValue(_env), &len), false);
    if (length) {
        *length = len;
    }
    return true;
}

bool Object::getArrayElement(uint32_t index, Value* data) const {
    JSVM_Status status;
    JSVM_Value val;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_GetElement(_env, _objRef.getValue(_env), index, &val), false);
    internal::jsToSeValue(val, data);
    return true;
}

bool Object::setArrayElement(uint32_t index, const Value& data) {
    JSVM_Status status;
    JSVM_Value val;
    bool ret = internal::seToJsValue(data, &val);
    if(!ret) {
        return false;
    }
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_SetElement(_env, _objRef.getValue(_env), index, val), false);
    return true;
}

bool Object::isTypedArray() const {
    JSVM_Status status;
    bool ret = false;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_IsTypedarray(_env, _objRef.getValue(_env), &ret), false);
    return ret;
}

bool Object::isProxy() const {
    //return const_cast<Object *>(this)->_obj.handle(__isolate)->IsProxy();
    // todo:
    return false;
}

Object::TypedArrayType Object::getTypedArrayType() const {
    JSVM_Status status;
    JSVM_TypedarrayType type;
    JSVM_Value inputBuffer;
    size_t byteOffset;
    size_t length;
    NODE_API_CALL(status, _env, OH_JSVM_GetTypedarrayInfo(_env, _objRef.getValue(_env), &type, &length, NULL, &inputBuffer, &byteOffset));

    TypedArrayType ret = TypedArrayType::NONE;
    switch (type) {
        case JSVM_INT8_ARRAY:
            ret = TypedArrayType::INT8;
            break;
        case JSVM_UINT8_ARRAY:
            ret = TypedArrayType::UINT8;
            break;
        case JSVM_UINT8_CLAMPED_ARRAY:
            ret = TypedArrayType::UINT8_CLAMPED;
            break;
        case JSVM_INT16_ARRAY:
            ret = TypedArrayType::INT16;
            break;
        case JSVM_UINT16_ARRAY:
            ret = TypedArrayType::UINT16;
            break;
        case JSVM_INT32_ARRAY:
            ret = TypedArrayType::INT32;
            break;
        case JSVM_UINT32_ARRAY:
            ret = TypedArrayType::UINT32;
            break;
        case JSVM_FLOAT32_ARRAY:
            ret = TypedArrayType::FLOAT32;
            break;
        case JSVM_FLOAT64_ARRAY:
            ret = TypedArrayType::FLOAT64;
            break;
        case JSVM_BIGINT64_ARRAY:
            ret = TypedArrayType::BIGINT64;
            break;
        case JSVM_BIGUINT64_ARRAY:
            ret = TypedArrayType::BIGUINT64;
            break;
        default:
            break;
    }
    return ret;
}

bool Object::getTypedArrayData(uint8_t** ptr, size_t* length) const {
    JSVM_Status status;
    JSVM_TypedarrayType type;
    JSVM_Value inputBuffer;
    size_t byteOffset;
    size_t arrayLength;
    void* data = nullptr;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_GetTypedarrayInfo(_env, _objRef.getValue(_env), &type, &arrayLength, &data, &inputBuffer, &byteOffset), false);
    *ptr = (uint8_t*)(data);
    if (length) {
        size_t bytesOfElement = 1;
        switch (type) {
            case JSVM_INT16_ARRAY:
            case JSVM_UINT16_ARRAY:
                bytesOfElement = 2;
                break;
            case JSVM_INT32_ARRAY:
            case JSVM_UINT32_ARRAY:
            case JSVM_FLOAT32_ARRAY:
                bytesOfElement = 4;
                break;
            case JSVM_FLOAT64_ARRAY:
            case JSVM_BIGINT64_ARRAY:
            case JSVM_BIGUINT64_ARRAY:
                bytesOfElement = 8;
                break;
            default:
                break;
        }
        *length = arrayLength * bytesOfElement;
    }
    return true;
}

bool Object::isArrayBuffer() const {
    bool ret = false;
    JSVM_Status status;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_IsArraybuffer(_env, _objRef.getValue(_env), &ret), false);
    return ret;
}

bool Object::getArrayBufferData(uint8_t** ptr, size_t* length) const {
    JSVM_Status status;
    size_t len = 0;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_GetArraybufferInfo(_env, _objRef.getValue(_env), reinterpret_cast<void**>(ptr), &len), false);
    if (length) {
        *length = len;
    }
    return true;
}

Object* Object::createTypedArray(Object::TypedArrayType type, const void* data, size_t byteLength) {
    JSVM_Status status;
    if (type == TypedArrayType::NONE) {
        SE_LOGE("Don't pass se::Object::TypedArrayType::NONE to createTypedArray API!");
        return nullptr;
    }

    JSVM_TypedarrayType jsvmType;
    JSVM_Value outputBuffer;
    void* outputPtr = nullptr;
    NODE_API_CALL_RESULT(status, ScriptEngine::getEnv(), OH_JSVM_CreateArraybuffer(ScriptEngine::getEnv(), byteLength, &outputPtr, &outputBuffer), nullptr);
    if (outputPtr && data && byteLength > 0) {
        memcpy(outputPtr, data, byteLength);
    }
    size_t sizeOfEle = 0;
    switch (type) {
        case TypedArrayType::INT8:
            jsvmType = JSVM_INT8_ARRAY;
            sizeOfEle = 1;
            break;
        case TypedArrayType::UINT8:
            jsvmType = JSVM_UINT8_ARRAY;
            sizeOfEle = 1;
            break;
        case TypedArrayType::UINT8_CLAMPED:
            jsvmType = JSVM_UINT8_CLAMPED_ARRAY;
            sizeOfEle = 1;
            break;
        case TypedArrayType::INT16:
            jsvmType = JSVM_INT16_ARRAY;
            sizeOfEle = 2;
            break;
        case TypedArrayType::UINT16:
            jsvmType = JSVM_UINT16_ARRAY;
            sizeOfEle = 2;
            break;
        case TypedArrayType::INT32:
            jsvmType = JSVM_INT32_ARRAY;
            sizeOfEle = 4;
            break;
        case TypedArrayType::UINT32:
            jsvmType = JSVM_UINT32_ARRAY;
            sizeOfEle = 4;
            break;
        case TypedArrayType::FLOAT32:
            jsvmType = JSVM_FLOAT32_ARRAY;
            sizeOfEle = 4;
            break;
        case TypedArrayType::FLOAT64:
            jsvmType = JSVM_FLOAT64_ARRAY;
            sizeOfEle = 8;
            break;
        case TypedArrayType::BIGINT64:
            jsvmType = JSVM_BIGINT64_ARRAY;
            sizeOfEle = 8;
            break;
        case TypedArrayType::BIGUINT64:
            jsvmType = JSVM_BIGUINT64_ARRAY;
            sizeOfEle = 8;
            break;
        default:
            assert(false); // Should never go here.
            break;
    }
    size_t eleCounts = byteLength / sizeOfEle;
    JSVM_Value outputArray;
    NODE_API_CALL_RESULT(status, ScriptEngine::getEnv(), OH_JSVM_CreateTypedarray(ScriptEngine::getEnv(), jsvmType, eleCounts, outputBuffer, 0, &outputArray), nullptr);
    Object* obj = Object::_createJSObject(ScriptEngine::getEnv(), outputArray, nullptr);
    return obj;
}

Object* Object::createTypedArrayWithBuffer(TypedArrayType type, const Object* obj) {
    return Object::createTypedArrayWithBuffer(type, obj, 0);
}

Object* Object::createTypedArrayWithBuffer(TypedArrayType type, const Object* obj, size_t offset) {
    size_t byteLength{0};
    uint8_t* skip{nullptr};

    if (obj->getArrayBufferData(&skip, &byteLength)) {
        return Object::createTypedArrayWithBuffer(type, obj, offset, byteLength - offset);
    }

    assert(false);
    return nullptr;
}

Object* Object::createTypedArrayWithBuffer(TypedArrayType type, const Object* obj, size_t offset, size_t byteLength) {
    if (type == TypedArrayType::NONE) {
        SE_LOGE("Don't pass se::Object::TypedArrayType::NONE to createTypedArray API!");
        return nullptr;
    }
    if (!obj->_getJSObject()) {
        SE_LOGE("Failed to create typed array: underlying ArrayBuffer is invalid (possibly released)");
        return nullptr;
    }
    assert(obj->isArrayBuffer());
    JSVM_Status status;
    JSVM_Value outputBuffer = obj->_getJSObject();
    JSVM_TypedarrayType jsvmType;

    size_t sizeOfEle = 0;
    switch (type) {
        case TypedArrayType::INT8:
            jsvmType = JSVM_INT8_ARRAY;
            sizeOfEle = 1;
            break;
        case TypedArrayType::UINT8:
            jsvmType = JSVM_UINT8_ARRAY;
            sizeOfEle = 1;
            break;
        case TypedArrayType::INT16:
            jsvmType = JSVM_INT16_ARRAY;
            sizeOfEle = 2;
            break;
        case TypedArrayType::UINT16:
            jsvmType = JSVM_UINT16_ARRAY;
            sizeOfEle = 2;
            break;
        case TypedArrayType::INT32:
            jsvmType = JSVM_INT32_ARRAY;
            sizeOfEle = 4;
            break;
        case TypedArrayType::UINT32:
            jsvmType = JSVM_UINT32_ARRAY;
            sizeOfEle = 4;
            break;
        case TypedArrayType::FLOAT32:
            jsvmType = JSVM_FLOAT32_ARRAY;
            sizeOfEle = 4;
            break;
        case TypedArrayType::FLOAT64:
            jsvmType = JSVM_FLOAT64_ARRAY;
            sizeOfEle = 8;
            break;
        case TypedArrayType::BIGINT64:
            jsvmType = JSVM_BIGINT64_ARRAY;
            sizeOfEle = 8;
            break;
        case TypedArrayType::BIGUINT64:
            jsvmType = JSVM_BIGUINT64_ARRAY;
            sizeOfEle = 8;
            break;
        default:
            assert(false); // Should never go here.
            break;
    }
    size_t eleCounts = byteLength / sizeOfEle;
    JSVM_Value outputArray;
    NODE_API_CALL_RESULT(status, ScriptEngine::getEnv(), OH_JSVM_CreateTypedarray(ScriptEngine::getEnv(), jsvmType, eleCounts, outputBuffer, offset, &outputArray), nullptr);
    return Object::_createJSObject(ScriptEngine::getEnv(), outputArray, nullptr);
}

Object* Object::createExternalArrayBufferObject(void* contents, size_t byteLength, BufferContentsFreeFunc freeFunc, void* freeUserData) {
    JSVM_Status status;
    JSVM_Value result;
    // JSVM does not support the napi_create_external_arraybuffer interface like in NAPI.
    NODE_API_CALL_RESULT(status, ScriptEngine::getEnv(), OH_JSVM_CreateArrayBufferFromBackingStoreData(ScriptEngine::getEnv(), contents, byteLength, 0, byteLength, &result), nullptr);
    Object* obj = Object::_createJSObject(ScriptEngine::getEnv(), result, nullptr);
    return obj;
}

bool Object::isFunction() const {
    JSVM_ValueType valuetype0;
    JSVM_Status status;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_Typeof(_env, _objRef.getValue(_env), &valuetype0), false);
    return (valuetype0 == JSVM_ValueType::JSVM_FUNCTION);
}

bool Object::defineFunction(const char* funcName, JSVM_Callback func) {
    JSVM_Value fn;
    JSVM_Status status;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_CreateFunction(_env, funcName, JSVM_AUTO_LENGTH, func, &fn), false);
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_SetNamedProperty(_env, _objRef.getValue(_env), funcName, fn), false);
    return true;
}

bool Object::defineProperty(const char* name, JSVM_Callback getter, JSVM_Callback setter) {
    JSVM_Status status;
    JSVM_PropertyDescriptor properties[] = {{name, nullptr, nullptr, getter, setter, 0, JSVM_DEFAULT}};
    status = OH_JSVM_DefineProperties(_env, _objRef.getValue(_env), sizeof(properties) / sizeof(JSVM_PropertyDescriptor), properties);
    if (status == JSVM_OK) {
        return true;
    }
    return false;
}

Object* Object::_createJSObject(JSVM_Env env, JSVM_Value js_object, Class* cls) { // NOLINT(readability-identifier-naming)
    Object* ret = new Object();
    if (!ret->init(env, js_object, cls)) {
        delete ret;
        ret = nullptr;
    }
    return ret;
}

Object* Object::createPlainObject() {
    JSVM_Value result;
    JSVM_Status status;
    NODE_API_CALL_RESULT(status, ScriptEngine::getEnv(), OH_JSVM_CreateObject(ScriptEngine::getEnv(), &result), nullptr);
    Object* obj = _createJSObject(ScriptEngine::getEnv(), result, nullptr);
    return obj;
}

Object* Object::createArrayObject(size_t length) {
    JSVM_Value result;
    JSVM_Status status;
    NODE_API_CALL_RESULT(status, ScriptEngine::getEnv(), OH_JSVM_CreateArrayWithLength(ScriptEngine::getEnv(), length, &result), nullptr);
    Object* obj = _createJSObject(ScriptEngine::getEnv(), result, nullptr);
    return obj;
}

Object* Object::createArrayBufferObject(const void* data, size_t byteLength) {
    JSVM_Value result;
    JSVM_Status status;
    void* retData;
    Object* obj = nullptr;
    NODE_API_CALL_RESULT(status, ScriptEngine::getEnv(), OH_JSVM_CreateArraybuffer(ScriptEngine::getEnv(), byteLength, &retData, &result), nullptr);
    if (data) {
        memcpy(retData, data, byteLength);
    }
    obj = _createJSObject(ScriptEngine::getEnv(), result, nullptr);
    return obj;
}

bool Object::getAllKeys(std::vector<std::string>* allKeys) const {
    JSVM_Status status;
    JSVM_Value names;

    NODE_API_CALL_RESULT(status, _env, OH_JSVM_GetPropertyNames(_env, _objRef.getValue(_env), &names), false);
    uint32_t name_len = 0;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_GetArrayLength(_env, names, &name_len), false);
    for (uint32_t i = 0; i < name_len; i++) {
        JSVM_Value val;
        NODE_API_CALL(status, _env, OH_JSVM_GetElement(_env, names, i, &val));
        if (status == JSVM_OK) {
            size_t result = 0;
            NODE_API_CALL(status, _env, OH_JSVM_GetValueStringUtf8(_env, val, nullptr, 0, &result));
            if(status == JSVM_OK){
                result += 1;
                char buffer[result];
                NODE_API_CALL(status, _env, OH_JSVM_GetValueStringUtf8(_env, val, buffer, sizeof(buffer), &result));
                if (result > 0) {
                    allKeys->push_back(buffer);
                }
            }
        }
    }

    return true;
}

bool Object::init(JSVM_Env env, JSVM_Value js_object, Class* cls) {
    assert(env);
    _cls = cls;
    _env = env;
    _objRef.init(env, js_object);

    if (__objectSet) {
        assert(__objectSet->find(this) == __objectSet->end());
        __objectSet->emplace(this);
    }
    return true;
}

bool Object::call(const ValueArray& args, Object* thisObject, Value* rval) {
    if (_getJSObject() == nullptr) {
        SE_LOGE("Attempted to call function on invalid JS object (possibly released or uninitialized)");
        return false;
    }
    size_t argc = 0;
    std::vector<JSVM_Value> argv;
    argv.reserve(10);
    argc = args.size();
    bool valid = internal::seToJsArgs(_env, args, &argv);
    if(!valid) {
        SE_LOGE("Failed to convert arguments from se::Value to JSVM_Value");
        return false;
    }
    JSVM_Value return_val;
    JSVM_Status status;
    assert(isFunction());
    if(thisObject != nullptr && !thisObject->_getJSObject()) {
        SE_LOGE("Invalid 'this' object passed to function call (JS object is invalid or released)");
        return false;
    }
    JSVM_Value thisObj = thisObject ? thisObject->_getJSObject() : ({
        JSVM_Value undefinedValue;
        OH_JSVM_GetUndefined(_env, &undefinedValue);
        undefinedValue;
    });
    NODE_API_CALL_RESULT(status, _env,
                  OH_JSVM_CallFunction(_env, thisObj, _getJSObject(), argc, argv.data(), &return_val), false);
    if (rval) {
        internal::jsToSeValue(return_val, rval);
    }
    return true;
}

void Object::_setFinalizeCallback(JSVM_Finalize finalizeCb) {
    assert(finalizeCb != nullptr);
    _finalizeCb = finalizeCb;
}

void* Object::getPrivateData() const {
    return _privateData;
}

bool Object::attachObject(Object* obj) {
    assert(obj);

    Object* global = ScriptEngine::getInstance()->getGlobalObject();
    Value jsbVal;
    if (!global->getProperty("jsb", &jsbVal)) {
        return false;
    }
    Object* jsbObj = jsbVal.toObject();

    Value func;

    if (!jsbObj->getProperty("registerNativeRef", &func)) {
        return false;
    }

    ValueArray args;
    args.push_back(Value(this));
    args.push_back(Value(obj));
    func.toObject()->call(args, global);
    return true;
}

bool Object::detachObject(Object* obj) {
    assert(obj);

    Object* global = ScriptEngine::getInstance()->getGlobalObject();
    Value jsbVal;
    if (!global->getProperty("jsb", &jsbVal)) {
        return false;
    }
    Object* jsbObj = jsbVal.toObject();

    Value func;

    if (!jsbObj->getProperty("unregisterNativeRef", &func)) {
        return false;
    }

    ValueArray args;
    args.push_back(Value(this));
    args.push_back(Value(obj));
    func.toObject()->call(args, global);
    return true;
}

std::string Object::toString() const {
    std::string ret;
    JSVM_Status status;
    if (isFunction() || isArray() || isTypedArray()) {
        JSVM_Value result;
        NODE_API_CALL_RESULT(status, _env, OH_JSVM_CoerceToString(_env, _objRef.getValue(_env), &result), ret);
        size_t result_t = 0;
        NODE_API_CALL_RESULT(status, _env, OH_JSVM_GetValueStringUtf8(_env, result, nullptr, 0, &result_t), ret);
        result_t += 1;
        char buffer[result_t];
        NODE_API_CALL_RESULT(status, _env, OH_JSVM_GetValueStringUtf8(_env, result, buffer, sizeof(buffer), &result_t), ret);
        ret = buffer;
    } else if (isArrayBuffer()) {
        ret = "[object ArrayBuffer]";
    } else {
        ret = "[object Object]";
    }
    return ret;
}

void Object::root() {
    if (_rootCount == 0) {
        uint32_t result = 0;
        _objRef.incRef(_env);
    }
    ++_rootCount;
}

void Object::unroot() {
    if (_rootCount > 0) {
        --_rootCount;
        if (_rootCount == 0) {
            _objRef.decRef(_env);
        }
    }
}

bool Object::isRooted() const {
    return _rootCount > 0;
}

Class* Object::_getClass() const {
    return _cls;
}

Object* Object::getObjectWithPtr(void* ptr) {
    Object* obj = nullptr;
    auto iter = NativePtrToObjectMap::find(ptr);
    if (iter != NativePtrToObjectMap::end()) {
        obj = iter->second;
        obj->incRef();
    }
    return obj;
}

JSVM_Value Object::_getJSObject() const {
    return _objRef.getValue(_env);
}

void Object::sendWeakCallback(JSVM_Env env, void* nativeObject, void* finalizeHint /*finalize_hint*/) {
    auto cb = std::bind(weakCallback, env, nativeObject, finalizeHint);
    CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread(cb);
}

void Object::setClearMappingInFinalizer(bool v) {
    _clearMappingInFinalizer = v;
    
    // The lifecycle of Spine and Dragonbones c++ objects are controlled by their runtime.
    // See the `cc::setSpineObjectDisposeCallback` invocation in jsb_spine_manuall.cpp.
    // It listens on spine C++ objects's destruction and when the callback comes,
    // the `native raw ptr -> se::Object` mapping will be erased which will cause memory leak
    // while restart or shutdown the engine. This is because the JSVM's implementation of `se::Object::cleanup`
    // will not know this hung `se::Object`, so its `decRef` will not be invoked.
    // The following code is a workaround for JSVM backend. We use a set to cache the hung `se::Object` instances
    // and release them in `se::Object::cleanup`.
    if (!v) {
        __objectSetToBeReleasedInCleanup.emplace(this);
    }
}

void Object::weakCallback(JSVM_Env env, void* nativeObject, void* finalizeHint /*finalize_hint*/) {
    if (finalizeHint) {
        if (nativeObject == nullptr) {
            return;
        }
        void* rawPtr = reinterpret_cast<Object*>(finalizeHint)->_privateData;
        Object* seObj = reinterpret_cast<Object*>(finalizeHint);
        if (seObj->_onCleaingPrivateData) { //called by cleanPrivateData, not release seObj;
            return;
        }
        if(!NativePtrToObjectMap::isValid()) {
            return;
        }
        if (seObj->_clearMappingInFinalizer && rawPtr != nullptr) {
            auto iter = NativePtrToObjectMap::find(rawPtr);
            if (iter != NativePtrToObjectMap::end()) {
                NativePtrToObjectMap::erase(iter);
            } else {
                SE_LOGE("not find ptr in NativePtrToObjectMap");
            }
        }

        if (seObj->_finalizeCb != nullptr) {
            seObj->_finalizeCb(env, finalizeHint, finalizeHint);
        } else {
            assert(seObj->_getClass() != nullptr);
            if (seObj->_getClass()->_getFinalizeFunction() != nullptr) {
                seObj->_getClass()->_getFinalizeFunction()(env, finalizeHint, finalizeHint);
            }
        }
        
        __objectSetToBeReleasedInCleanup.erase(seObj);
        
        seObj->_destructInFinalizer = true;
        seObj->decRef();
    }
}

void Object::setup() {
    __objectSet = std::make_unique<std::unordered_set<Object*>>();
}

void Object::cleanup() {
    void* nativeObj = nullptr;
    Object* obj = nullptr;
    Class* cls = nullptr;

    const auto& nativePtrToObjectMap = NativePtrToObjectMap::instance();
    for (const auto& e : nativePtrToObjectMap) {
        nativeObj = e.first;
        obj = e.second;

        if (obj->_finalizeCb != nullptr) {
            obj->_finalizeCb(ScriptEngine::getEnv(), obj, nullptr);
        } else {
            if (obj->_getClass() != nullptr) {
                if (obj->_getClass()->_getFinalizeFunction() != nullptr) {
                    obj->_getClass()->_getFinalizeFunction()(ScriptEngine::getEnv(), obj, nullptr);
                }
            }
        }
        obj->decRef();
    }
    
    for (auto *obj : __objectSetToBeReleasedInCleanup) {
        obj->decRef();
    }
    __objectSetToBeReleasedInCleanup.clear();

    NativePtrToObjectMap::clear();
    
    if (__objectSet) {
        for (const auto& obj : *__objectSet) {
            cls = obj->_getClass();
            obj->_rootCount = 0;
        }
    }

    __objectSet.reset();
}

Object* Object::createJSONObject(const std::string& jsonStr) {
    auto _env = ScriptEngine::getEnv();
    JSVM_Status status = JSVM_OK;

    JSVM_Value jsJsonStr = nullptr;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_CreateStringUtf8(_env, jsonStr.c_str(), jsonStr.length(), &jsJsonStr), nullptr);
    JSVM_Value jsObj = nullptr;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_JsonParse(_env, jsJsonStr, &jsObj), nullptr);
    return Object::_createJSObject(_env, jsObj, nullptr);
}

Object* Object::createJSONObject(std::u16string&& jsonStr) {
    auto _env = ScriptEngine::getEnv();
    JSVM_Status status = JSVM_OK;

    JSVM_Value jsJsonStr = nullptr;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_CreateStringUtf16(_env, jsonStr.c_str(), jsonStr.length(), &jsJsonStr), nullptr);
    JSVM_Value jsObj = nullptr;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_JsonParse(_env, jsJsonStr, &jsObj), nullptr);
    return Object::_createJSObject(_env, jsObj, nullptr);
}

Object* Object::createProxyTarget(se::Object* proxy) {
    // SE_ASSERT(proxy->isProxy(), "parameter is not a Proxy object");
    // v8::Local<v8::Object> jsobj = proxy->getProxyTarget().As<v8::Object>();
    // Object *obj = Object::_createJSObject(nullptr, jsobj);
    // return obj;
    assert(false); // NOT SUPPORTED NOW.
    return nullptr;
}

void Object::clearPrivateData(bool clearMapping) {
    if (_privateObject != nullptr) {
        JSVM_Status status;
        void* result = nullptr;
        auto tmpThis = _objRef.getValue(_env);
        _onCleaingPrivateData = true;
        if (clearMapping) {
            NativePtrToObjectMap::erase(_privateData);
        }
        NODE_API_CALL(status, _env, OH_JSVM_RemoveWrap(_env, tmpThis, &result));
        delete _privateObject;
        _privateObject = nullptr;
        _privateData = nullptr;
        _onCleaingPrivateData = false;
    }
}

Object* Object::createUTF8String(const std::string& str) {
    JSVM_Status status;
    JSVM_Value result;
    NODE_API_CALL_RESULT(status, ScriptEngine::getEnv(), OH_JSVM_CreateStringUtf8(ScriptEngine::getEnv(), str.c_str(), JSVM_AUTO_LENGTH, &result), nullptr);
    Object* obj = _createJSObject(ScriptEngine::getEnv(), result, nullptr);
    return obj;
}

std::unordered_map<Object*, JSVM_Deferred> Object::resolverMap;

void Object::resolverPromise(Object* object, const Value& value) {
    auto it = resolverMap.find(object);
    if (it != resolverMap.end()) {
        auto* resolver = it->second;
        JSVM_Value jsvmValue;
        se::internal::seToJsValue(value, &jsvmValue);
        OH_JSVM_ResolveDeferred(ScriptEngine::getEnv(), resolver, jsvmValue);
        resolverMap.erase(it);
    }
}

void Object::rejectPromise(Object* object, const Value& value) {
    auto it = resolverMap.find(object);
    if (it != resolverMap.end()) {
        auto* resolver = it->second;
        JSVM_Value jsvmValue;
        se::internal::seToJsValue(value, &jsvmValue);
        OH_JSVM_ResolveDeferred(ScriptEngine::getEnv(), resolver, jsvmValue);
        resolverMap.erase(it);
    }
}

Object* Object::createPromise() {
    JSVM_Deferred deferred = nullptr;
    JSVM_Value promise = nullptr;
    JSVM_Status createStatus = OH_JSVM_CreatePromise(ScriptEngine::getEnv(), &deferred, &promise);
    if (createStatus != JSVM_OK) {
        return nullptr;
    }
    Object* object = Object::_createJSObject(ScriptEngine::getEnv(), promise, nullptr);
    resolverMap[object] = deferred;
    return object;
}

ObjectRef::ObjectRef(Object *parent)
: _parent(parent) {

}

ObjectRef::~ObjectRef() {
    deleteRef();
}
    
void ObjectRef::init(JSVM_Env env, JSVM_Value obj) {
    assert(_ref == nullptr);
    _obj = obj;
    _env = env;
    
    // There is a bug in JSVM implementation:
    // If we initialize the reference to 0 which means weak reference in JSVM,
    // then we call the JSVM API in the following order:
    // OH_JSVM_ReferenceRef -> OH_JSVM_ReferenceUnref -> OH_JSVM_ReferenceRef ( strong ref ) -> OH_JSVM_DeleteReference ( delete v8impl::Reference directly )
    // The v8impl::Reference::WeakCallback will still be invoked which will cause invalid memory reading.
    //
    // WORKAROUND:
    // Set the reference to 1 to make it to a strong reference in the lifecycle of `se::Object` until it is destructed or be wrapped with a private data.
    //
    OH_JSVM_CreateReference(_env, _obj, 1, &_ref);
}
    
JSVM_Value ObjectRef::getValue(JSVM_Env env) const {
    JSVM_Value r = nullptr;
    JSVM_Status status;
    NODE_API_CALL_RESULT(status, _env, OH_JSVM_GetReferenceValue(_env, _ref, &r), nullptr);
    return r;
}

void ObjectRef::incRef(JSVM_Env env) {
    OH_JSVM_ReferenceRef(_env, _ref, nullptr);
}

void ObjectRef::decRef(JSVM_Env env) {
    OH_JSVM_ReferenceUnref(_env, _ref, nullptr);
}

void ObjectRef::deleteRef() {
    if (!_ref) {
        return;
    }

    /*
    BUG Analyze:
     
    Before invoking `OH_JSVM_DeleteReference`, if the reference count is 0, the object will be set to weak state.
     
    OH_JSVM_ReferenceUnref calls v8impl::Reference::Unref

    https://gitee.com/openharmony/third_party_node/blob/OpenHarmony-v5.0.2-Release/src/js_native_api_v8.cc#L1284

    ```c++
    uint32_t Reference::Unref() {
      if (persistent_.IsEmpty()) {
        return 0;
      }
      uint32_t old_refcount = RefCount();
      uint32_t refcount = RefBase::Unref();
      if (old_refcount == 1 && refcount == 0) {
        SetWeak(); // --> If the reference count gets to 0, the object will be set to weak state.
      }
      return refcount;
    }

    ```
    v8impl::Reference::SetWeak

    https://gitee.com/openharmony/third_party_node/blob/OpenHarmony-v5.0.2-Release/src/js_native_api_v8.cc#L1320

    ```c++
    void Reference::SetWeak() {
      if (can_be_weak_) {
        wait_callback = true;

        // --> BUG: Set a weak callback to release `v8impl::Reference` in it.
        persistent_.SetWeak(this, WeakCallback, v8::WeakCallbackType::kParameter);
      } else {
        persistent_.Reset();
      }
    }
    ```

    The bug is that `v8impl::Reference` will only be released in WeakCallback, but if we create a reference for an object that is always held,
    for example, global variables or singleton's properties, `v8impl::Reference` will never get a chance to be released which will cause memory leaks heavily.

    OH_JSVM_DeleteReference calls Reference::Delete

    https://gitee.com/openharmony/third_party_node/blob/OpenHarmony-v5.0.2-Release/src/js_native_api_v8.cc#L3886

    Reference::Delete

    https://gitee.com/openharmony/third_party_node/blob/OpenHarmony-v5.0.2-Release/src/js_native_api_v8.cc#L1302

    ```c++
    void Reference::Delete() {
      assert(Ownership() == kUserland);
      if (!wait_callback) {
        delete this;
      } else {
        deleted_by_user = true; // --> BUG: If the reference count is 0, just set the deleted_by_user to true.
      }
    }
    ```

    It just sets `deleted_by_user` flag to true and wait the WeakCallback to come to release `v8impl::Reference`
    which will never be invoked if the reference target is held forever.

    According the source code in JSVM, we make a workaround to avoid this memory leaks. It's we call `OH_JSVM_ReferenceRef`
    to ensure the object is not weak, then `wait_callback` is false. So while we invoke `OH_JSVM_DeleteReference`,
    v8impl::Reference instance will be deleted in `Reference::Delete`.
    
    There also should be another workaround to be cooperated with this workaround.
     
    In `se::Object::setPrivateObject`, after invoking `OH_JSVM_Wrap`, we need to call `ObjectRef::decRef` to reset
    the object state to weak, which makes sure that weak callback get called.
    */
    
    // If we have already been in the weak callback ( finalizer ), no need to apply this workaround fix.
    if (!_parent->_destructInFinalizer) {
        // WORKAROUND HERE
        OH_JSVM_ReferenceRef(_env, _ref, nullptr);
    }
    //

    OH_JSVM_DeleteReference(_env, _ref);
    _ref = nullptr;
}

} // namespace se

