#include "Object.hpp"

#ifdef SCRIPT_ENGINE_JSC

#include "Utils.hpp"
#include "Class.hpp"
#include "ScriptEngine.hpp"

namespace se {
 
    std::unordered_map<void* /*native*/, Object* /*jsobj*/> __nativePtrToObjectMap;

    namespace {
        JSContextRef __cx = nullptr;
    }

    Object::Object()
    : _cls(nullptr)
    , _obj(nullptr)
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
        Object* obj = _createJSObject(nullptr, JSObjectMake(__cx, nullptr, nullptr), rooted);
        return obj;
    }

//    Object* Object::createObject(const char* clsName, bool rooted)
//    {
//        Class* cls = nullptr;
//        JSObjectRef jsObj = Class::_createJSObject(clsName, &cls);
//        Object* obj = _createJSObject(cls, jsObj, rooted);
//        return obj;
//    }

    Object* Object::createArrayObject(size_t length, bool rooted)
    {
        JSObjectRef jsObj = JSObjectMakeArray(__cx, 0, nullptr, nullptr);
        Object* obj = _createJSObject(nullptr, jsObj, rooted);
        return obj;
    }

    static void myJSTypedArrayBytesDeallocator(void* bytes, void* deallocatorContext)
    {
        free(bytes);
    }

    Object* Object::createArrayBufferObject(void* data, size_t byteLength, bool rooted)
    {
        void* copiedData = malloc(byteLength);
        memcpy(copiedData, data, byteLength);
        JSObjectRef jsobj = JSObjectMakeArrayBufferWithBytesNoCopy(__cx, copiedData, byteLength, myJSTypedArrayBytesDeallocator, nullptr, nullptr);
        Object* obj = Object::_createJSObject(nullptr, jsobj, rooted);
        return obj;
    }

    Object* Object::createUint8TypedArray(uint8_t* data, size_t byteLength, bool rooted)
    {
        void* copiedData = malloc(byteLength);
        memcpy(copiedData, data, byteLength);
        JSObjectRef jsobj = JSObjectMakeTypedArrayWithBytesNoCopy(__cx, kJSTypedArrayTypeUint8Array, copiedData, byteLength, myJSTypedArrayBytesDeallocator, nullptr, nullptr);
        Object* obj = Object::_createJSObject(nullptr, jsobj, rooted);
        return obj;
    }

    Object* Object::createJSONObject(const std::string& jsonStr, bool rooted)
    {
        Object* obj = nullptr;
        JSStringRef jsStr = JSStringCreateWithUTF8CString(jsonStr.c_str());
        JSValueRef ret = JSValueMakeFromJSONString(__cx, jsStr);

        if (ret != nullptr)
        {
            obj = Object::_createJSObject(nullptr, JSValueToObject(__cx, ret, nullptr), rooted);
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

    Object* Object::createObjectWithClass(Class* cls, bool rooted)
    {
        JSObjectRef jsobj = Class::_createJSObjectWithClass(cls);
        Object* obj = Object::_createJSObject(cls, jsobj, rooted);
        return obj;
    }

    Object* Object::_createJSObject(Class* cls, JSObjectRef obj, bool rooted)
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

    bool Object::init(JSObjectRef obj, bool rooted)
    {
        _obj = obj;
        _isRooted = rooted;
        if (_isRooted)
        {
            JSValueProtect(__cx, _obj);
        }
        return true;
    }

    void Object::_cleanup(void* nativeObj/* = nullptr*/)
    {
        if (_isCleanup)
            return;

        if (_hasPrivateData)
        {
            if (nativeObj == nullptr)
            {
                nativeObj = internal::getPrivate(_obj);
            }

            if (nativeObj != nullptr)
            {
                auto iter = __nativePtrToObjectMap.find(nativeObj);
                if (iter != __nativePtrToObjectMap.end())
                {
                    __nativePtrToObjectMap.erase(iter);
                }
            }
            else
            {
                assert(false);
            }
        }

        if (_isRooted)
        {
            JSValueUnprotect(__cx, _obj);
        }

        _isCleanup = true;
    }

    void Object::_setFinalizeCallback(JSObjectFinalizeCallback finalizeCb)
    {
        _finalizeCb = finalizeCb;
    }

    // --- Getter/Setter

    bool Object::getProperty(const char* name, Value* data)
    {
        assert(data != nullptr);
        JSStringRef jsName = JSStringCreateWithUTF8CString(name);
        bool exist = JSObjectHasProperty(__cx, _obj, jsName);

        if (exist)
        {
            JSValueRef jsValue = JSObjectGetProperty(__cx, _obj, jsName, nullptr);
            internal::jsToSeValue(__cx, jsValue, data);
        }

        JSStringRelease(jsName);

        return exist;
    }

    void Object::setProperty(const char* name, const Value& v)
    {
        JSStringRef jsName = JSStringCreateWithUTF8CString(name);
        JSValueRef jsValue = nullptr;
        JSObjectRef obj = _obj;
        if (v.getType() == Value::Type::Number)
        {
            jsValue = JSValueMakeNumber(__cx, v.toNumber());
        }
        else if (v.getType() == Value::Type::String)
        {
            JSStringRef jsstr = JSStringCreateWithUTF8CString(v.toString().c_str());
            jsValue = JSValueMakeString(__cx, jsstr);
            JSStringRelease(jsstr);
        }
        else if (v.getType() == Value::Type::Boolean)
        {
            jsValue = JSValueMakeBoolean(__cx, v.toBoolean());
        }
        else if (v.getType() == Value::Type::Object)
        {
            jsValue = v.toObject()->_obj;
        }
        else if (v.getType() == Value::Type::Null)
        {
            jsValue = JSValueMakeNull(__cx);
        }
        else
        {
            jsValue = JSValueMakeUndefined(__cx);
        }

        JSObjectSetProperty(__cx, obj, jsName, jsValue, kJSPropertyAttributeNone, nullptr);
        JSStringRelease(jsName);
    }

    bool Object::defineProperty(const char *name, JSObjectCallAsFunctionCallback getter, JSObjectCallAsFunctionCallback setter)
    {
        return internal::defineProperty(this, name, getter, setter);
    }

    // --- call

    bool Object::call(const ValueArray& args, Object* thisObject, Value* rval/* = nullptr*/)
    {
        assert(isFunction());

        JSObjectRef contextObject = nullptr;
        if (thisObject != nullptr)
        {
            contextObject = thisObject->_obj;
        }

        JSValueRef* jsArgs = nullptr;

        if (!args.empty())
        {
            jsArgs = (JSValueRef*)malloc(sizeof(JSValueRef) * args.size());
            internal::seToJsArgs(__cx, args, jsArgs);
        }

        JSValueRef exception = nullptr;
        JSValueRef rcValue = JSObjectCallAsFunction(__cx, _obj, contextObject, args.size(), jsArgs, &exception);
        free(jsArgs);

        if (rcValue != nullptr)
        {
            if (rval != nullptr && !JSValueIsUndefined(__cx, rcValue))
            {
                internal::jsToSeValue(__cx, rcValue, rval);
            }
            return true;
        }

        // Function call failed, try to output exception
        if (exception != nullptr)
        {
            std::string exceptionStr = se::ScriptEngine::getInstance()->_formatException(exception);
            if (!exceptionStr.empty())
            {
                LOGD("%s\n", exceptionStr.c_str());
            }
            se::ScriptEngine::getInstance()->clearException();
        }

        return false;
    }

    bool Object::defineFunction(const char* funcName, JSObjectCallAsFunctionCallback func)
    {
        JSStringRef jsName = JSStringCreateWithUTF8CString(funcName);
        JSObjectRef jsFunc = JSObjectMakeFunctionWithCallback(__cx, nullptr, func);
        JSObjectSetProperty(__cx, _obj, jsName, jsFunc, kJSPropertyAttributeNone, nullptr);
        JSStringRelease(jsName);
        return true;
    }

    // --- Arrays

    bool Object::getArrayLength(uint32_t* length) const 
    {
        assert(isArray());
        assert(length != nullptr);
        JSStringRef key = JSStringCreateWithUTF8CString("length");
        JSValueRef v = JSObjectGetProperty(__cx, _obj, key, nullptr);
        assert(JSValueIsNumber(__cx, v));
        double len = JSValueToNumber(__cx, v, nullptr);
        JSStringRelease(key);

        *length = (uint32_t)len;
        return true;
    }

    bool Object::getArrayElement(uint32_t index, Value* data) const 
    {
        assert(isArray());
        assert(data != nullptr);
        JSValueRef v = JSObjectGetPropertyAtIndex(__cx, _obj, index, nullptr);
        internal::jsToSeValue(__cx, v, data);

        return true;
    }

    bool Object::setArrayElement(uint32_t index, const Value& data)
    {
        assert(isArray());

        JSValueRef v;
        internal::seToJsValue(__cx, data, &v);
        JSObjectSetPropertyAtIndex(__cx, _obj, index, v, nullptr);
        return true;
    }

    bool Object::getAllKeys(std::vector<std::string>* allKeys) const
    {
        JSPropertyNameArrayRef keys = JSObjectCopyPropertyNames(__cx, _obj);
        size_t expectedCount = JSPropertyNameArrayGetCount(keys);

        std::string tmp;
        for (size_t count = 0; count < expectedCount; ++count)
        {
            JSStringRef key = JSPropertyNameArrayGetNameAtIndex(keys, count);
            internal::jsStringToStdString(__cx, key, &tmp);
            allKeys->push_back(tmp);
        }

        JSPropertyNameArrayRelease(keys);
        return true;
    }

    bool Object::isFunction() const
    {
        return JSObjectIsFunction(__cx, _obj);
    }

    bool Object::isTypedArray() const
    {
        JSTypedArrayType type = JSValueGetTypedArrayType(__cx, _obj, nullptr);
        return type != kJSTypedArrayTypeNone && type != kJSTypedArrayTypeArrayBuffer;
    }

    bool Object::getTypedArrayData(uint8_t** ptr, size_t* length) const
    {
        assert(isTypedArray());
        *length = JSObjectGetTypedArrayByteLength(__cx, _obj, nullptr);
        *ptr = (uint8_t*)JSObjectGetTypedArrayBytesPtr(__cx, _obj, nullptr);
        return (*ptr != nullptr);
    }

    bool Object::_isNativeFunction() const
    {
        if (isFunction())
        {
            std::string info;
            internal::forceConvertJsValueToStdString(__cx, _obj, &info);
            if (info.find("[native code]") != std::string::npos)
            {
                return true;
            }
        }
        return false;
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
//
//
//    void Object::getAsUint32Array(unsigned int **ptr, unsigned int *length)
//    {
//        assert(false);
//    }
//
//    void Object::getAsFloat32Array(float **ptr, unsigned int *length)
//    {
//        assert(false);
//    }

    bool Object::isArray() const
    {
        return JSValueIsArray(__cx, _obj);
    }

    bool Object::isArrayBuffer() const
    {
        JSTypedArrayType type = JSValueGetTypedArrayType(__cx, _obj, nullptr);
        return type == kJSTypedArrayTypeArrayBuffer;
    }

    bool Object::getArrayBufferData(uint8_t** ptr, size_t* length) const
    {
        assert(ptr && length);
        assert(isArrayBuffer());
        *length = JSObjectGetArrayBufferByteLength(__cx, _obj, nullptr);
        *ptr = (uint8_t*)JSObjectGetArrayBufferBytesPtr(__cx, _obj, nullptr);
        return (*ptr != nullptr);
    }

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

    void Object::setContext(JSContextRef cx)
    {
        __cx = cx;
    }

    void Object::debug(const char *what)
    {
//        LOGD("Object %p %s\n", this,
//               what);
    }

    JSObjectRef Object::_getJSObject() const
    {
        return _obj;
    }

    Class* Object::_getClass() const
    {
        return _cls;
    }

    void Object::switchToRooted()
    {
        debug("switch to rooted");
        if (_isRooted)
            return;

        JSValueProtect(__cx, _obj);
        _isRooted = true;
    }

    void Object::switchToUnrooted()
    {
        if (!_isRooted)
            return;

        if (_isKeepRootedUntilDie)
            return;

        debug("switch to unrooted");
        JSValueUnprotect(__cx, _obj);
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
        return JSValueIsStrictEqual(__cx, _obj, o->_obj);
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

#endif // SCRIPT_ENGINE_JSC
