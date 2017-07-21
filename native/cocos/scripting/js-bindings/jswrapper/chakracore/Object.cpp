#include "Object.hpp"
#include "Utils.hpp"
#include "Class.hpp"
#include "ScriptEngine.hpp"

#ifdef SCRIPT_ENGINE_CHAKRACORE

namespace se {
 
    std::unordered_map<void* /*native*/, Object* /*jsobj*/> __nativePtrToObjectMap;

    Object::Object()
    : _cls(nullptr)
    , _obj(JS_INVALID_REFERENCE)
    , _isRooted(false)
    , _isKeepRootedUntilDie(false)
    , _hasPrivateData(false)
    , _isCleanup(false)
    , _finalizeCb(nullptr)
    {
    }

    Object::~Object()
    {
        _cleanup();
    }

    Object* Object::createPlainObject(bool rooted)
    {
        JsValueRef jsobj;
        _CHECK(JsCreateObject(&jsobj));
        Object* obj = _createJSObject(nullptr, jsobj, rooted);
        return obj;
    }

//    Object* Object::createObject(const char* clsName, bool rooted)
//    {
//        Class* cls = nullptr;
//        JsValueRef jsObj = Class::_createJSObject(clsName, &cls);
//        Object* obj = _createJSObject(cls, jsObj, rooted);
//        return obj;
//    }

    Object* Object::createArrayObject(size_t length, bool rooted)
    {
        JsValueRef jsObj = JS_INVALID_REFERENCE;
        _CHECK(JsCreateArray((unsigned int)length, &jsObj));
        Object* obj = _createJSObject(nullptr, jsObj, rooted);
        return obj;
    }

    Object* Object::createArrayBufferObject(void* data, size_t byteLength, bool rooted)
    {
        Object* obj = nullptr;
        JsValueRef jsobj;
        _CHECK(JsCreateArrayBuffer((unsigned int)byteLength, &jsobj));
        ChakraBytePtr buffer = nullptr;
        unsigned int bufferLength = 0;
        if (JsNoError == JsGetArrayBufferStorage(jsobj, &buffer, &bufferLength))
        {
            memcpy((void*)buffer, data, byteLength);
            obj = Object::_createJSObject(nullptr, jsobj, rooted);
        }

        return obj;
    }

    Object* Object::createUint8TypedArray(uint8_t* data, size_t byteLength, bool rooted)
    {
        Object* obj = nullptr;
        JsValueRef jsobj;
        _CHECK(JsCreateTypedArray(JsArrayTypeUint8, JS_INVALID_REFERENCE, 0, (unsigned int)byteLength, &jsobj));
        ChakraBytePtr buffer = nullptr;
        unsigned int bufferLength = 0;
        JsTypedArrayType arrType;
        int elementSize = 0;
        if (JsNoError == JsGetTypedArrayStorage(jsobj, &buffer, &bufferLength, &arrType, &elementSize))
        {
            memcpy((void*)buffer, data, byteLength);
            obj = Object::_createJSObject(nullptr, jsobj, rooted);
        }

        return obj;
    }

    Object* Object::createJSONObject(const std::string& jsonStr, bool rooted)
    {
        bool ok = false;
        Object* obj = nullptr;

        Object* global = ScriptEngine::getInstance()->getGlobalObject();
        Value jsonVal;
        ok = global->getProperty("JSON", &jsonVal);
        assert(ok);

        Value parseVal;
        ok = jsonVal.toObject()->getProperty("parse", &parseVal);
        assert(ok);

        Value ret;
        ValueArray args;
        args.push_back(Value(jsonStr));
        if (parseVal.toObject()->call(args, jsonVal.toObject(), &ret))
        {
            obj = Object::_createJSObject(nullptr, ret.toObject(), rooted);
        }

        return obj;
    }

    Object* Object::getObjectWithPtr(void* ptr)
    {
        Object* obj = nullptr;
        auto iter = __nativePtrToObjectMap.find(ptr);
        if (iter != __nativePtrToObjectMap.end())
        {
            obj = iter->second;
            obj->addRef();
        }
        return obj;
    }

//    Object* Object::getOrCreateObjectWithPtr(void* ptr, const char* clsName, bool rooted)
//    {
//        Object* obj = getObjectWithPtr(ptr);
//        if (obj == nullptr)
//        {
//            obj = createObject(clsName, rooted);
//            obj->setPrivateData(ptr);
//        }
//        return obj;
//    }

    Object* Object::_createJSObject(Class* cls, JsValueRef obj, bool rooted)
    {
        Object* ret = new Object();
        if (!ret->init(obj, rooted))
        {
            delete ret;
            ret = nullptr;
        }

        ret->_cls = cls;
        return ret;
    }

    Object* Object::createObjectWithClass(Class* cls, bool rooted)
    {
        JsValueRef jsobj = Class::_createJSObjectWithClass(cls);
        Object* obj = Object::_createJSObject(cls, jsobj, rooted);
        return obj;
    }

    bool Object::init(JsValueRef obj, bool rooted)
    {
        _obj = obj;
        _isRooted = rooted;
        if (_isRooted)
        {
            unsigned int count = 0;
            _CHECK(JsAddRef(_obj, &count));
        }
        return true;
    }

    void Object::_cleanup(void* nativeObject/* = nullptr*/)
    {
        if (_isCleanup)
            return;

        if (_hasPrivateData)
        {
            if (_obj != nullptr)
            {
                if (nativeObject == nullptr)
                {
                    nativeObject = internal::getPrivate(_obj);
                }

                if (nativeObject != nullptr)
                {
                    auto iter = __nativePtrToObjectMap.find(nativeObject);
                    if (iter != __nativePtrToObjectMap.end())
                    {
                        __nativePtrToObjectMap.erase(iter);
                    }
                }
            }
        }

        if (_isRooted)
        {
            // Don't unprotect if it's in cleanup, otherwise, it will trigger crash.
            if (!ScriptEngine::getInstance()->_isInCleanup)
            {
                unsigned int count = 0;
                _CHECK(JsRelease(_obj, &count));
            }
        }

        _isCleanup = true;
    }

    void Object::cleanup()
    {
        ScriptEngine::getInstance()->addAfterCleanupHook([](){
            __nativePtrToObjectMap.clear();
        });
    }

    void Object::_setFinalizeCallback(JsFinalizeCallback finalizeCb)
    {
        _finalizeCb = finalizeCb;
    }

    bool Object::getProperty(const char* name, Value* data)
    {
        assert(data != nullptr);
        JsPropertyIdRef propertyId;
        _CHECK(JsCreatePropertyId(name, strlen(name), &propertyId));

        bool exist = false;
        JsHasProperty(_obj, propertyId, &exist);

        if (exist)
        {
            JsValueRef jsValue;
            _CHECK(JsGetProperty(_obj, propertyId, &jsValue));
            internal::jsToSeValue(jsValue, data);
        }

        return exist;
    }

    void Object::setProperty(const char* name, const Value& v)
    {
        JsValueRef jsValue = JS_INVALID_REFERENCE;
        internal::seToJsValue(v, &jsValue);
        JsPropertyIdRef propertyId;
        _CHECK(JsCreatePropertyId(name, strlen(name), &propertyId));
        _CHECK(JsSetProperty(_obj, propertyId, jsValue, true));
    }

    bool Object::defineProperty(const char *name, JsNativeFunction getter, JsNativeFunction setter)
    {
        return internal::defineProperty(_obj, name, getter, setter, true, true);
    }

    bool Object::call(const ValueArray& args, Object* thisObject, Value* rval/* = nullptr*/)
    {
        assert(isFunction());

        JsValueRef contextObject;

        if (thisObject != nullptr)
        {
            contextObject = thisObject->_obj;
        }
        else
        {
            _CHECK(JsGetUndefinedValue(&contextObject));
        }

        JsValueRef* jsArgs = (JsValueRef*)malloc(sizeof(JsValueRef) * (args.size() + 1)); // Requires thisArg as first argument of arguments.

        std::vector<Object*> toUnrootedObjects;

        for (auto& arg : args)
        {
            if (arg.isObject())
            {
                if (!arg.toObject()->isRooted())
                {
                    arg.toObject()->switchToRooted();
                    toUnrootedObjects.push_back(arg.toObject());
                }
            }
        }

        if (!args.empty())
        {
            internal::seToJsArgs(args, jsArgs + 1);
        }

        jsArgs[0] = contextObject;

        JsValueRef rcValue = JS_INVALID_REFERENCE;
        JsErrorCode errCode = JsCallFunction(_obj, jsArgs, args.size() + 1, &rcValue);
        free(jsArgs);

        for (auto& obj: toUnrootedObjects)
        {
            obj->switchToUnrooted();
        }

        if (errCode == JsNoError)
        {
            if (rval != nullptr)
            {
                JsValueType type;
                JsGetValueType(rcValue, &type);
                if (rval != JS_INVALID_REFERENCE && type != JsUndefined)
                {
                    internal::jsToSeValue(rcValue, rval);
                }
            }
            return true;
        }

        se::ScriptEngine::getInstance()->clearException();
        return false;
    }

    bool Object::defineFunction(const char* funcName, JsNativeFunction func)
    {
        JsPropertyIdRef propertyId = JS_INVALID_REFERENCE;
        _CHECK(JsCreatePropertyId(funcName, strlen(funcName), &propertyId));

        JsValueRef funcVal = JS_INVALID_REFERENCE;
        _CHECK(JsCreateFunction(func, nullptr, &funcVal));

        _CHECK(JsSetProperty(_obj, propertyId, funcVal, true));
        return true;
    }

    static bool isArrayOfObject(JsValueRef obj)
    {
        JsValueType type;
        if (JsNoError == JsGetValueType(obj, &type))
        {
            return type == JsArray;
        }
        return false;
    }

    static bool getArrayLengthOfObject(JsValueRef arrObj, uint32_t* length)
    {
        assert(isArrayOfObject(arrObj));
        assert(length != nullptr);

        JsErrorCode err = JsNoError;
        JsPropertyIdRef propertyId = JS_INVALID_REFERENCE;
        const char* lengthName = "length";
        err = JsCreatePropertyId(lengthName, strlen(lengthName), &propertyId);
        if (err != JsNoError)
            return false;

        JsValueRef jsLen = JS_INVALID_REFERENCE;
        err = JsGetProperty(arrObj, propertyId, &jsLen);
        if (err != JsNoError)
            return false;

        int intVal = 0;
        err = JsNumberToInt(jsLen, &intVal);
        if (err != JsNoError)
            return false;

        *length = (uint32_t)intVal;
        
        return true;
    }

    bool Object::isArray() const
    {
        return isArrayOfObject(_obj);
    }

    bool Object::getArrayLength(uint32_t* length) const
    {
        return getArrayLengthOfObject(_obj, length);
    }

    bool Object::getArrayElement(uint32_t index, Value* data) const 
    {
        assert(isArray());
        assert(data != nullptr);

        JsErrorCode err = JsNoError;
        JsValueRef result = JS_INVALID_REFERENCE;
        JsValueRef jsIndex = JS_INVALID_REFERENCE;
        err = JsIntToNumber(index, &jsIndex);
        if (err != JsNoError)
            return false;

        err = JsGetIndexedProperty(_obj, jsIndex, &result);
        if (err != JsNoError)
            return false;

        internal::jsToSeValue(result, data);

        return true;
    }

    bool Object::setArrayElement(uint32_t index, const Value& data)
    {
        assert(isArray());

        JsErrorCode err = JsNoError;
        JsValueRef jsIndex = JS_INVALID_REFERENCE;
        err = JsIntToNumber(index, &jsIndex);
        if (err != JsNoError)
            return false;

        JsValueRef value = JS_INVALID_REFERENCE;
        internal::seToJsValue(data, &value);

        err = JsSetIndexedProperty(_obj, jsIndex, value);
        if (err != JsNoError)
            return false;

        return true;
    }

    bool Object::getAllKeys(std::vector<std::string>* allKeys) const
    {
        assert(allKeys != nullptr);

        JsErrorCode err = JsNoError;
        JsValueRef keys = JS_INVALID_REFERENCE;
        err = JsGetOwnPropertyNames(_obj, &keys);
        if (err != JsNoError)
            return false;

        uint32_t len = 0;
        bool ok = false;
        ok = getArrayLengthOfObject(keys, &len);
        if (!ok)
            return false;

        std::string key;
        for (uint32_t index = 0; index < len; ++index)
        {
            JsValueRef indexValue = JS_INVALID_REFERENCE;
            err = JsIntToNumber(index, &indexValue);
            if (err != JsNoError)
                return false;

            JsValueRef nameValue = JS_INVALID_REFERENCE;
            JsGetIndexedProperty(keys, indexValue, &nameValue);

            internal::jsStringToStdString(nameValue, &key);
            allKeys->push_back(key);
        }

        return true;
    }

    bool Object::isFunction() const
    {
        JsValueType type;
        _CHECK(JsGetValueType(_obj, &type));
        if (_obj != JS_INVALID_REFERENCE && type == JsFunction)
        {
            return true;
        }

        return false;
    }

    bool Object::_isNativeFunction() const
    {
        if (isFunction())
        {
            std::string info;
            internal::forceConvertJsValueToStdString(_obj, &info);
            if (info.find("[native code]") != std::string::npos)
            {
                return true;
            }
        }
        return false;
    }

    bool Object::isTypedArray() const
    {
        JsValueType type;
        if (JsNoError == JsGetValueType(_obj, &type))
        {
            return type == JsTypedArray;
        }
        return false;
    }

    bool Object::getTypedArrayData(uint8_t** ptr, size_t* length) const
    {
        assert(isTypedArray());
        JsTypedArrayType arrayType;
        ChakraBytePtr buffer = nullptr;
        unsigned int bufferLength = 0;
        int elementSize = 0;
        bool ret = false;
        if (JsNoError == JsGetTypedArrayStorage(_obj, &buffer, &bufferLength, &arrayType, &elementSize))
        {
            *ptr = buffer;
            *length = bufferLength;
            ret = true;
        }
        else
        {
            *ptr = nullptr;
            *length = 0;
        }
        return ret;
    }

    bool Object::isArrayBuffer() const
    {
        JsValueType type;
        if (JsNoError == JsGetValueType(_obj, &type))
        {
            return type == JsArrayBuffer;
        }
        return false;
    }

    bool Object::getArrayBufferData(uint8_t** ptr, size_t* length) const
    {
        assert(isArrayBuffer());
        ChakraBytePtr buffer = nullptr;
        unsigned int bufferLength = 0;
        bool ret = false;
        if (JsNoError == JsGetArrayBufferStorage(_obj, &buffer, &bufferLength))
        {
            *ptr = buffer;
            *length = bufferLength;
            ret = true;
        }
        else
        {
            *ptr = nullptr;
            *length = 0;
        }
        return ret;
    }

//    void Object::getAsUint8Array(unsigned char **ptr, unsigned int *length)
//    {
//        assert(false);
//    }
//
//    void Object::getAsUint16Array(unsigned short **ptr, unsigned int *length)
//    {
//        assert(false);
//    }
//    void Object::getAsUint32Array(unsigned int **ptr, unsigned int *length)
//    {
//        assert(false);
//    }
//
//    void Object::getAsFloat32Array(float **ptr, unsigned int *length)
//    {
//        assert(false);
//    }


    void* Object::getPrivateData()
    {
        return internal::getPrivate(_obj);
    }

    void Object::setPrivateData(void *data)
    {
        assert(!_hasPrivateData);
        internal::setPrivate(_obj, data, _finalizeCb);
        __nativePtrToObjectMap.emplace(data, this);
        _hasPrivateData = true;
    }

    void Object::clearPrivateData()
    {
        if (_hasPrivateData)
        {
            void* data = getPrivateData();
            __nativePtrToObjectMap.erase(data);
            internal::clearPrivate(_obj);
            _hasPrivateData = false;
        }
    }

    JsValueRef Object::_getJSObject() const
    {
        return _obj;
    }

    Class* Object::_getClass() const
    {
        return _cls;
    }

    void Object::switchToRooted()
    {
        if (_isRooted)
            return;

        unsigned int count = 0;
        _CHECK(JsAddRef(_obj, &count));
        _isRooted = true;
    }

    void Object::switchToUnrooted()
    {
        if (!_isRooted)
            return;

        if (_isKeepRootedUntilDie)
            return;

        unsigned int count = 0;
        _CHECK(JsRelease(_obj, &count));
        _isRooted = false;
    }

    void Object::setKeepRootedUntilDie(bool keepRooted)
    {
        _isKeepRootedUntilDie = keepRooted;

        if (_isKeepRootedUntilDie)
        {
            if (!_isRooted)
                switchToRooted();
        }
    }
    
    bool Object::isRooted() const
    {
        return _isRooted;
    }

    bool Object::isSame(Object* o) const
    {
        bool same = false;
        _CHECK(JsStrictEquals(_obj, o->_obj, &same));
        return same;
    }

    bool Object::attachChild(Object* child)
    {
        assert(child);

        Object* global = ScriptEngine::getInstance()->getGlobalObject();
        Value jsbVal;
        if (!global->getProperty("jsb", &jsbVal))
            return false;
        Object* jsbObj = jsbVal.toObject();

        Value func;

        if (!jsbObj->getProperty("registerNativeRef", &func))
            return false;

        ValueArray args;
        args.push_back(Value(this));
        args.push_back(Value(child));
        func.toObject()->call(args, global);
        return true;
    }

    bool Object::detachChild(Object* child)
    {
        assert(child);
        Object* global = ScriptEngine::getInstance()->getGlobalObject();
        Value jsbVal;
        if (!global->getProperty("jsb", &jsbVal))
            return false;
        Object* jsbObj = jsbVal.toObject();

        Value func;

        if (!jsbObj->getProperty("unregisterNativeRef", &func))
            return false;

        ValueArray args;
        args.push_back(Value(this));
        args.push_back(Value(child));
        func.toObject()->call(args, global);
        return true;
    }

} // namespace se {

#endif // SCRIPT_ENGINE_CHAKRACORE
