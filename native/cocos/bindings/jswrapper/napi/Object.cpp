#include "Object.h"
#include <memory>
#include <unordered_map>
#include "../MappingUtils.h"
#include "Class.h"
#include "ScriptEngine.h"
#include "Utils.h"

#include "base/Log.h"

#define MAX_STRING_LEN 512
namespace se {
std::unique_ptr<std::unordered_map<Object*, void*>> __objectMap; // Currently, the value `void*` is always nullptr

Object::Object() {}
Object::~Object() {
    if (__objectMap) {
        __objectMap->erase(this);
    }
#if USE_NODE_NAPI
    //napi_status status;
    //NODE_API_CALL(status, _env, napi_delete_reference(_env, _napiRefObj));
    _napiRefObj = nullptr;
#endif
}

Object* Object::createObjectWithClass(Class* cls) {
    se::AutoHandleScope scope;
    napi_value          jsobj = Class::_createJSObjectWithClass(cls);
    Object*             obj   = Object::_createJSObject(ScriptEngine::getEnv(), jsobj, cls);
    return obj;
}

bool Object::setProperty(const char* name, const Value& data) {
    se::AutoHandleScope scope;
    napi_status         status;
    napi_value          jsVal;
    internal::seToJsValue(data, &jsVal);
    status = napi_set_named_property(_env, _getJSObject(), name, jsVal);
    return true;
}

bool Object::getProperty(const char* name, Value* d) {
    napi_status         status;
    napi_value          jsVal;
    se::AutoHandleScope scope;
    Value               data;
#if USE_NODE_NAPI
    status = napi_get_named_property(_env, _getJSObject(), name, &jsVal);
    if (status != napi_ok) {
        d->setUndefined();
        return false;
    }
#else
    NODE_API_CALL(status, _env, napi_get_named_property(_env, _getJSObject(), name, &jsVal));
#endif
    internal::jsToSeValue(jsVal, &data);
    *d = data;
    if (data.isUndefined()) {
        return false;
    }
    return true;
}

bool Object::isArray() const {
    napi_status status;
    bool        ret = false;
    NODE_API_CALL(status, _env, napi_is_array(_env, _getJSObject(), &ret));
    return ret;
}

bool Object::getArrayLength(uint32_t* length) const {
    napi_status status;
    uint32_t    len = 0;
    NODE_API_CALL(status, _env, napi_get_array_length(_env, _getJSObject(), &len));
    if (length) {
        *length = len;
    }
    return true;
}

bool Object::getArrayElement(uint32_t index, Value* data) const {
    napi_status status;
    napi_value  val;
    NODE_API_CALL(status, _env, napi_get_element(_env, _getJSObject(), index, &val));
    internal::jsToSeValue(val, data);
    return true;
}

bool Object::setArrayElement(uint32_t index, const Value& data) {
    napi_status status;
    napi_value  val;
    internal::seToJsValue(data, &val);
    NODE_API_CALL(status, _env, napi_set_element(_env, _getJSObject(), index, val));
    return true;
}

bool Object::isTypedArray() const {
    napi_status status;
    bool        ret = false;
    NODE_API_CALL(status, _env, napi_is_typedarray(_env, _getJSObject(), &ret));
    return ret;
}

Object::TypedArrayType Object::getTypedArrayType() const {
    se::AutoHandleScope  scope;
    napi_status          status;
    napi_typedarray_type type;
    napi_value           inputBuffer;
    size_t               byteOffset;
    size_t               length;
    NODE_API_CALL(status, _env, napi_get_typedarray_info(_env, _getJSObject(), &type, &length, NULL, &inputBuffer, &byteOffset));

    TypedArrayType ret = TypedArrayType::NONE;
    switch (type) {
        case napi_int8_array:
            ret = TypedArrayType::INT8;
            break;
        case napi_uint8_array:
            ret = TypedArrayType::UINT8;
            break;
        case napi_uint8_clamped_array:
            ret = TypedArrayType::UINT8_CLAMPED;
            break;
        case napi_int16_array:
            ret = TypedArrayType::INT16;
            break;
        case napi_uint16_array:
            ret = TypedArrayType::UINT16;
            break;
        case napi_int32_array:
            ret = TypedArrayType::INT32;
            break;
        case napi_uint32_array:
            ret = TypedArrayType::UINT32;
            break;
        case napi_float32_array:
            ret = TypedArrayType::FLOAT32;
            break;
        case napi_float64_array:
            ret = TypedArrayType::FLOAT64;
            break;
        default:
            break;
    }
    return ret;
}

bool Object::getTypedArrayData(uint8_t** ptr, size_t* length) const {
    se::AutoHandleScope  scope;
    napi_status          status;
    napi_typedarray_type type;
    napi_value           inputBuffer;
    size_t               byteOffset;
    size_t               byteLength;
    void*                data = nullptr;
    NODE_API_CALL(status, _env, napi_get_typedarray_info(_env, _getJSObject(), &type, &byteLength, &data, &inputBuffer, &byteOffset));
#if USE_NODE_NAPI
    *ptr = (uint8_t*)(data);
#else
    *ptr = (uint8_t*)(data) + byteOffset;
#endif
    if (length) {
        *length = byteLength;
    }
    return true;
}

bool Object::isArrayBuffer() const {
    se::AutoHandleScope scope;
    bool                ret = false;
    napi_status         status;
    NODE_API_CALL(status, _env, napi_is_arraybuffer(_env, _getJSObject(), &ret));
    return ret;
}

bool Object::getArrayBufferData(uint8_t** ptr, size_t* length) const {
    se::AutoHandleScope scope;
    napi_status         status;
    size_t              len = 0;
    NODE_API_CALL(status, _env, napi_get_arraybuffer_info(_env, _getJSObject(), reinterpret_cast<void**>(ptr), &len));
    if (length) {
        *length = len;
    }
    return true;
}

Object* Object::createTypedArray(Object::TypedArrayType type, const void* data, size_t byteLength) {
    se::AutoHandleScope scope;
    napi_status         status;
    if (type == TypedArrayType::NONE) {
        SE_LOGE("Don't pass se::Object::TypedArrayType::NONE to createTypedArray API!");
        return nullptr;
    }

    if (type == TypedArrayType::UINT8_CLAMPED) {
        SE_LOGE("Doesn't support to create Uint8ClampedArray with Object::createTypedArray API!");
        return nullptr;
    }
    napi_typedarray_type napiType;
    napi_value           outputBuffer;
    void*                outputPtr = nullptr;
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_create_arraybuffer(ScriptEngine::getEnv(), byteLength, &outputPtr, &outputBuffer));
    if (outputPtr && data && byteLength > 0) {
        memcpy(outputPtr, data, byteLength);
    }
    size_t sizeOfEle = 0;
    switch (type) {
        case TypedArrayType::INT8:
            napiType  = napi_int8_array;
            sizeOfEle = 1;
            break;
        case TypedArrayType::UINT8:
            napiType  = napi_uint8_array;
            sizeOfEle = 1;
            break;
        case TypedArrayType::INT16:
            napiType  = napi_int8_array;
            sizeOfEle = 2;
        case TypedArrayType::UINT16:
            napiType  = napi_uint8_array;
            sizeOfEle = 2;
            break;
        case TypedArrayType::INT32:
            napiType  = napi_int32_array;
            sizeOfEle = 4;
        case TypedArrayType::UINT32:
            napiType  = napi_uint32_array;
            sizeOfEle = 4;
        case TypedArrayType::FLOAT32:
            napiType  = napi_float32_array;
            sizeOfEle = 4;
            break;
        case TypedArrayType::FLOAT64:
            napiType  = napi_float64_array;
            sizeOfEle = 8;
            break;
        default:
            assert(false); // Should never go here.
            break;
    }
    size_t     eleCounts = byteLength / sizeOfEle;
    napi_value outputArray;
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_create_typedarray(ScriptEngine::getEnv(), napiType, eleCounts, outputBuffer, 0, &outputArray));

    Object* obj = Object::_createJSObject(ScriptEngine::getEnv(), outputArray, nullptr);
    return obj;
}

bool Object::isFunction() const {
    se::AutoHandleScope scope;
    napi_valuetype      valuetype0;
    napi_status         status;
    NODE_API_CALL(status, _env, napi_typeof(_env, _getJSObject(), &valuetype0));
    return (valuetype0 == napi_function);
}

bool Object::defineFunction(const char* funcName, napi_callback func) {
    se::AutoHandleScope scope;
    napi_value          fn;
    napi_status         status;
    NODE_API_CALL(status, _env, napi_create_function(_env, funcName, NAPI_AUTO_LENGTH, func, NULL, &fn));
    NODE_API_CALL(status, _env, napi_set_named_property(_env, _getJSObject(), funcName, fn));
    return true;
}

bool Object::defineProperty(const char* name, napi_callback getter, napi_callback setter) {
    se::AutoHandleScope      scope;
    napi_status              status;
    napi_property_descriptor properties[] = {{name, nullptr, nullptr, getter, setter, 0, napi_default, 0}};
    LOGI("get this :%p", this);
    status = napi_define_properties(_env, _getJSObject(), sizeof(properties) / sizeof(napi_property_descriptor), properties);
    if (status == napi_ok) {
        return true;
    }
    return false;
}

Object* Object::_createJSObject(napi_env env, napi_value js_object, Class* cls) { // NOLINT(readability-identifier-naming)
    se::AutoHandleScope scope;
    auto*               ret = new Object();
    if (!ret->init(env, js_object, cls)) {
        delete ret;
        ret = nullptr;
    }
    return ret;
}

Object* Object::createPlainObject() {
    se::AutoHandleScope scope;
    napi_value          result;
    napi_status         status;
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_create_object(ScriptEngine::getEnv(), &result));
    Object* obj = _createJSObject(ScriptEngine::getEnv(), result, nullptr);
    return obj;
}

Object* Object::createArrayObject(size_t length) {
    se::AutoHandleScope scope;
    napi_value          result;
    napi_status         status;
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_create_array_with_length(ScriptEngine::getEnv(), length, &result));
    Object* obj = _createJSObject(ScriptEngine::getEnv(), result, nullptr);
    return obj;
}

Object* Object::createArrayBufferObject(void* data, size_t byteLength) {
    se::AutoHandleScope scope;
    napi_value          result;
    napi_status         status;
    void*               retData;
    Object*             obj = nullptr;
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_create_arraybuffer(ScriptEngine::getEnv(), byteLength, &retData, &result));
    if (status == napi_ok) {
        if (data) {
            memcpy(retData, data, byteLength);
        }
        obj = _createJSObject(ScriptEngine::getEnv(), result, nullptr);
    }
    return obj;
}

bool Object::getAllKeys(std::vector<std::string>* allKeys) const {
    se::AutoHandleScope scope;
    napi_status         status;
    napi_value          names;

    NODE_API_CALL(status, _env, napi_get_property_names(_env, _getJSObject(), &names));
    if (status != napi_ok) {
        return false;
    }
    uint32_t name_len = 0;
    NODE_API_CALL(status, _env, napi_get_array_length(_env, names, &name_len));
    for (uint32_t i = 0; i < name_len; i++) {
        napi_value val;
        NODE_API_CALL(status, _env, napi_get_element(_env, names, i, &val));
        if (status == napi_ok) {
            char   buffer[MAX_STRING_LEN];
            size_t result = 0;
            NODE_API_CALL(status, _env, napi_get_value_string_utf8(_env, val, buffer, MAX_STRING_LEN, &result));
            if (result > 0) {
                allKeys->push_back(buffer);
            }
        }
    }

    return true;
}

bool Object::init(napi_env env, napi_value js_object, Class* cls) {
    se::AutoHandleScope scope;
    assert(env);
    //assert(cls);
    _cls = cls;
    _env = env;
#if USE_NODE_NAPI
    napi_status status;
    NODE_API_CALL(status, _env, napi_create_reference(_env, js_object, 0, &_napiRefObj));
    assert(_napiRefObj);
#else
    _objRef.initWeakref(env, js_object);
#endif
    if (__objectMap) {
        assert(__objectMap->find(this) == __objectMap->end());
        __objectMap->emplace(this, nullptr);
    }

    //napi_status status;
    LOGI("init this :%p", this);
    return true;
}

bool Object::call(const ValueArray& args, Object* thisObject, Value* rval) {
    se::AutoHandleScope     scope;
    size_t                  argc = 0;
    std::vector<napi_value> argv;
    argv.reserve(10);
    argc = args.size();
    internal::seToJsArgs(_env, args, &argv);
    napi_value  return_val;
    napi_status status;
    assert(isFunction());
    napi_value thisObj;
    if (thisObject) {
        thisObj = thisObject->_getJSObject();
    } else {
        napi_get_null(_env, &thisObj);
    }
    //CC_LOG_DEBUG("qgh object::call start %p", thisObj);
    status =
        napi_call_function(_env, thisObj, _getJSObject(), argc, argv.data(), &return_val);
    //CC_LOG_DEBUG("qgh object::call end thisObj %p _getJSObject  %p", thisObj, _getJSObject());
    if (rval) {
        internal::jsToSeValue(return_val, rval);
    }
    //CC_LOG_DEBUG("qgh object::call finish %p", return_val);
    return true;
}

void Object::_setFinalizeCallback(napi_finalize finalizeCb) {
    assert(finalizeCb != nullptr);
    _finalizeCb = finalizeCb;
}

void* Object::getPrivateData() const {
    void*       obj{nullptr};
    napi_status status = napi_unwrap(_env, _getJSObject(), reinterpret_cast<void**>(&obj));
    assert(status == napi_ok || status == napi_invalid_arg);
    return obj;
}

void Object::setPrivateData(void* data) {
    assert(_privateData == nullptr);
    assert(NativePtrToObjectMap::find(data) == NativePtrToObjectMap::end());
    NativePtrToObjectMap::emplace(data, this);

    napi_status status;
    _privateData = data;

    napi_valuetype valType;
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_typeof(ScriptEngine::getEnv(), _getJSObject(), &valType));
    LOGI("this type is %d, native this:%p", valType, data);

    //issue https://github.com/nodejs/node/issues/23999
    auto tmpThis = _getJSObject();
//_objRef.deleteRef();
#if USE_NODE_NAPI
    NODE_API_CALL(status, _env,
                  napi_wrap(_env, tmpThis, data, weakCallback,
                            (void*)this /* finalize_hint */, nullptr));
#else
    napi_ref result = nullptr;
    NODE_API_CALL(status, _env,
                  napi_wrap(_env, tmpThis, data, weakCallback,
                            (void*)this /* finalize_hint */, &result));
#endif
    //_objRef.setWeakref(_env, result);
    setProperty("__native_ptr__", se::Value(static_cast<uint64_t>(reinterpret_cast<uintptr_t>(data))));

    return;
}

#if USE_NODE_NAPI
uint32_t Object::getRootCount() const {
    uint32_t refCnt = 0;
    napi_reference_count(_env, _napiRefObj, &refCnt);
    return refCnt;
}
#endif

void Object::clearPrivateData(bool clearMapping) {
    //TODO: impl
}

bool Object::attachObject(Object* obj) {
    se::AutoHandleScope scope;
    assert(obj);

    Object* global = ScriptEngine::getInstance()->getGlobalObject();
    Value   jsbVal;
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
    se::AutoHandleScope scope;
    assert(obj);

    Object* global = ScriptEngine::getInstance()->getGlobalObject();
    Value   jsbVal;
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
    se::AutoHandleScope scope;
    std::string         ret;
    napi_status         status;
    if (isFunction() || isArray() || isTypedArray()) {
        napi_value result;
        NODE_API_CALL(status, _env, napi_coerce_to_string(_env, _getJSObject(), &result));
        char   buffer[MAX_STRING_LEN];
        size_t result_t = 0;
        NODE_API_CALL(status, _env, napi_get_value_string_utf8(_env, result, buffer, MAX_STRING_LEN, &result_t));
        ret = buffer;
    } else if (isArrayBuffer()) {
        ret = "[object ArrayBuffer]";
    } else {
        ret = "[object Object]";
    }
    return ret;
}

#if USE_NODE_NAPI
void Object::root() {
    napi_status status;
    NODE_API_CALL(status, _env, napi_reference_ref(_env, _napiRefObj, nullptr));
}
#else
void Object::root() {
    //napi_status status;
    if (_rootCount == 0) {
        uint32_t result = 0;
        _objRef.incRef(_env);
        //NODE_API_CALL(status, _env, napi_reference_ref(_env, _wrapper, &result));
    }
    ++_rootCount;
}
#endif

#if USE_NODE_NAPI
void Object::unroot() {
    napi_status status;
    #if CC_DEBUG
    if (getRootCount() == 0) {
        SE_LOGD("Failed to unroot object %p which is not rooted before");
        return;
    }
    #endif
    NODE_API_CALL(status, _env, napi_reference_unref(_env, _napiRefObj, nullptr));
}
#else
void Object::unroot() {
    //napi_status status;
    if (_rootCount > 0) {
        --_rootCount;
        if (_rootCount == 0) {
            _napiRefObj
                _objRef.decRef(_env);
        }
    }
}
#endif

bool Object::isRooted() const {
    return getRootCount() > 0;
}

Class* Object::_getClass() const {
    return _cls;
}

Object* Object::getObjectWithPtr(void* ptr) {
    Object* obj  = nullptr;
    auto    iter = NativePtrToObjectMap::find(ptr);
    if (iter != NativePtrToObjectMap::end()) {
        obj = iter->second;
        obj->incRef();
    }
    return obj;
}

napi_value Object::_getJSObject() const {
#if USE_NODE_NAPI
    napi_status status;
    napi_value  ret;
    NODE_API_CALL(status, _env, napi_get_reference_value(_env, _napiRefObj, &ret));
    return ret;
#else
    return _objRef.getValue(_env);
#endif
}

napi_value Object::_getJSObject() {
#if USE_NODE_NAPI
    napi_status status;
    napi_value  ret;
    NODE_API_CALL(status, _env, napi_get_reference_value(_env, _napiRefObj, &ret));
    return ret;
#else
    return _objRef.getValue(_env);
#endif
}

void Object::weakCallback(napi_env env, void* nativeObject, void* finalizeHint /*finalize_hint*/) {
    if (finalizeHint) {
        Object* obj = reinterpret_cast<Object*>(finalizeHint);

        if (nativeObject == nullptr) {
            return;
        }

        auto iter = NativePtrToObjectMap::find(nativeObject);
        if (iter != NativePtrToObjectMap::end()) {
            Object* obj = iter->second;
            if (obj->_finalizeCb != nullptr) {
                obj->_finalizeCb(env, nativeObject, finalizeHint);
            } else {
                assert(obj->_getClass() != nullptr);
                if (obj->_getClass()->_getFinalizeFunction() != nullptr) {
                    obj->_getClass()->_getFinalizeFunction()(env, nativeObject, finalizeHint);
                }
            }
            obj->decRef();
            NativePtrToObjectMap::erase(iter);
        } else {
            //            assert(false);
        }
    }
}

void Object::setup() {
    __objectMap = std::make_unique<std::unordered_map<Object*, void*>>();
}

void Object::cleanup() {
    void*   nativeObj = nullptr;
    Object* obj       = nullptr;
    Class*  cls       = nullptr;

    const auto& nativePtrToObjectMap = NativePtrToObjectMap::instance();
    for (const auto& e : nativePtrToObjectMap) {
        nativeObj = e.first;
        obj       = e.second;

        if (obj->_finalizeCb != nullptr) {
            obj->_finalizeCb(ScriptEngine::getEnv(), nativeObj, nullptr);
        } else {
            if (obj->_getClass() != nullptr) {
                if (obj->_getClass()->_getFinalizeFunction() != nullptr) {
                    obj->_getClass()->_getFinalizeFunction()(ScriptEngine::getEnv(), nativeObj, nullptr);
                }
            }
        }
        obj->decRef();
    }

    NativePtrToObjectMap::clear();
    NonRefNativePtrCreatedByCtorMap::clear();

    if (__objectMap) {
        std::vector<Object*> toReleaseObjects;
        for (const auto& e : *__objectMap) {
            obj = e.first;
            cls = obj->_getClass();
#if !USE_NODE_NAPI
            obj->_rootCount = 0;
#endif

            if (cls != nullptr && cls->getName() == "__PrivateData") {
                toReleaseObjects.push_back(obj);
            }
        }
        for (auto* e : toReleaseObjects) {
            e->decRef();
        }
    }

    __objectMap.reset();
}

Object* Object::createJSONObject(const std::string& jsonStr) {
    //not impl
    return nullptr;
}
} // namespace se
