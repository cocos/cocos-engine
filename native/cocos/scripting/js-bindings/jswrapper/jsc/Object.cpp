#include "Object.hpp"

#ifdef SCRIPT_ENGINE_JSC

#include "Utils.hpp"
#include "Class.hpp"
#include "ScriptEngine.hpp"
#include "../MappingUtils.hpp"

namespace se {

    namespace {
        JSContextRef __cx = nullptr;
#if SE_DEBUG > 0
        uint32_t __id = 0;
#endif
    }

    Object::Object()
    : _cls(nullptr)
    , _obj(nullptr)
    , _privateData(nullptr)
    , _finalizeCb(nullptr)
    , _rootCount(0)
#if SE_DEBUG > 0
    , _id(++__id)
#endif
    , _isCleanup(false)
    {
    }

    Object::~Object()
    {
        _cleanup();
    }

    Object* Object::createPlainObject()
    {
        Object* obj = _createJSObject(nullptr, JSObjectMake(__cx, nullptr, nullptr));
        return obj;
    }

    Object* Object::createArrayObject(size_t length)
    {
        JSValueRef exception = nullptr;
        JSObjectRef jsObj = JSObjectMakeArray(__cx, 0, nullptr, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            return nullptr;
        }
        Object* obj = _createJSObject(nullptr, jsObj);
        return obj;
    }

    static void myJSTypedArrayBytesDeallocator(void* bytes, void* deallocatorContext)
    {
        free(bytes);
    }

    Object* Object::createArrayBufferObject(void* data, size_t byteLength)
    {
        void* copiedData = malloc(byteLength);
        memcpy(copiedData, data, byteLength);
        JSValueRef exception = nullptr;
        JSObjectRef jsobj = JSObjectMakeArrayBufferWithBytesNoCopy(__cx, copiedData, byteLength, myJSTypedArrayBytesDeallocator, nullptr, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            return nullptr;
        }
        Object* obj = Object::_createJSObject(nullptr, jsobj);
        return obj;
    }

    Object* Object::createUint8TypedArray(uint8_t* data, size_t byteLength)
    {
        void* copiedData = malloc(byteLength);
        memcpy(copiedData, data, byteLength);
        JSValueRef exception = nullptr;
        JSObjectRef jsobj = JSObjectMakeTypedArrayWithBytesNoCopy(__cx, kJSTypedArrayTypeUint8Array, copiedData, byteLength, myJSTypedArrayBytesDeallocator, nullptr, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            return nullptr;
        }
        Object* obj = Object::_createJSObject(nullptr, jsobj);
        return obj;
    }

    Object* Object::createJSONObject(const std::string& jsonStr)
    {
        Object* obj = nullptr;
        JSStringRef jsStr = JSStringCreateWithUTF8CString(jsonStr.c_str());
        JSValueRef ret = JSValueMakeFromJSONString(__cx, jsStr);

        if (ret != nullptr)
        {
            JSValueRef exception = nullptr;
            JSObjectRef jsobj = JSValueToObject(__cx, ret, &exception);
            if (exception != nullptr)
            {
                ScriptEngine::getInstance()->_clearException(exception);
                return nullptr;
            }
            obj = Object::_createJSObject(nullptr, jsobj);
        }
        return obj;
    }

    Object* Object::getObjectWithPtr(void* ptr)
    {
        Object* obj = nullptr;
        auto iter = NativePtrToObjectMap::find(ptr);
        if (iter != NativePtrToObjectMap::end())
        {
            obj = iter->second;
            obj->incRef();
        }
        return obj;
    }

    Object* Object::createObjectWithClass(Class* cls)
    {
        JSObjectRef jsobj = Class::_createJSObjectWithClass(cls);
        Object* obj = Object::_createJSObject(cls, jsobj);
        return obj;
    }

    Object* Object::_createJSObject(Class* cls, JSObjectRef obj)
    {
        Object* ret = new Object();
        if (!ret->init(cls, obj))
        {
            delete ret;
            ret = nullptr;
        }

        return ret;
    }

    bool Object::init(Class* cls, JSObjectRef obj)
    {
        _obj = obj;
        _cls = cls;
        return true;
    }

    void Object::_cleanup(void* nativeObj/* = nullptr*/)
    {
        if (_isCleanup)
            return;

        if (_privateData != nullptr)
        {
            if (nativeObj == nullptr)
            {
                nativeObj = internal::getPrivate(_obj);
            }

            if (nativeObj != nullptr)
            {
                auto iter = NativePtrToObjectMap::find(nativeObj);
                if (iter != NativePtrToObjectMap::end())
                {
                    NativePtrToObjectMap::erase(iter);
                }
            }
            else
            {
                assert(false);
            }
        }

        if (_rootCount > 0)
        {
//            printf("Object::_cleanup, (%p) rootCount: %u\n", this, _rootCount);
            // Don't unprotect if it's in cleanup, otherwise, it will trigger crash.
            auto se = ScriptEngine::getInstance();
            if (!se->_isInCleanup && !se->isInGC())
                JSValueUnprotect(__cx, _obj);

            _rootCount = 0;
        }

        _isCleanup = true;
    }

    void Object::_setFinalizeCallback(JSObjectFinalizeCallback finalizeCb)
    {
        assert(finalizeCb != nullptr);
        _finalizeCb = finalizeCb;
    }

    bool Object::getProperty(const char* name, Value* data)
    {
        assert(data != nullptr);
        JSStringRef jsName = JSStringCreateWithUTF8CString(name);
        bool exist = JSObjectHasProperty(__cx, _obj, jsName);

        if (exist)
        {
            JSValueRef exception = nullptr;
            JSValueRef jsValue = JSObjectGetProperty(__cx, _obj, jsName, &exception);
            if (exception != nullptr)
            {
                ScriptEngine::getInstance()->_clearException(exception);
                return false;
            }
            internal::jsToSeValue(__cx, jsValue, data);
        }
        else
        {
            data->setUndefined();
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

        JSValueRef exception = nullptr;
        JSObjectSetProperty(__cx, obj, jsName, jsValue, kJSPropertyAttributeNone, &exception);

        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
        }

        JSStringRelease(jsName);
    }

    bool Object::defineProperty(const char *name, JSObjectCallAsFunctionCallback getter, JSObjectCallAsFunctionCallback setter)
    {
        return internal::defineProperty(this, name, getter, setter);
    }

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
            ScriptEngine::getInstance()->_clearException(exception);
        }

        return false;
    }

    bool Object::defineFunction(const char* funcName, JSObjectCallAsFunctionCallback func)
    {
        JSStringRef jsName = JSStringCreateWithUTF8CString(funcName);
        JSObjectRef jsFunc = JSObjectMakeFunctionWithCallback(__cx, jsName, func);
        JSValueRef exception = nullptr;
        JSObjectSetProperty(__cx, _obj, jsName, jsFunc, kJSPropertyAttributeNone, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
        }
        JSStringRelease(jsName);
        return true;
    }

    bool Object::getArrayLength(uint32_t* length) const
    {
        assert(isArray());
        assert(length != nullptr);
        JSStringRef key = JSStringCreateWithUTF8CString("length");
        JSValueRef exception = nullptr;
        JSValueRef v = JSObjectGetProperty(__cx, _obj, key, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            JSStringRelease(key);
            *length = 0;
            return false;
        }

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
        JSValueRef exception = nullptr;
        JSValueRef v = JSObjectGetPropertyAtIndex(__cx, _obj, index, &exception);

        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            return false;
        }

        internal::jsToSeValue(__cx, v, data);

        return true;
    }

    bool Object::setArrayElement(uint32_t index, const Value& data)
    {
        assert(isArray());

        JSValueRef v;
        internal::seToJsValue(__cx, data, &v);
        JSValueRef exception = nullptr;
        JSObjectSetPropertyAtIndex(__cx, _obj, index, v, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            return false;
        }

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
        JSValueRef exception = nullptr;
        *length = JSObjectGetTypedArrayByteLength(__cx, _obj, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            return false;
        }

        *ptr = (uint8_t*)JSObjectGetTypedArrayBytesPtr(__cx, _obj, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            return false;
        }

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

    bool Object::isArray() const
    {
        return JSValueIsArray(__cx, _obj);
    }

    bool Object::isArrayBuffer() const
    {
        JSValueRef exception = nullptr;
        JSTypedArrayType type = JSValueGetTypedArrayType(__cx, _obj, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            return false;
        }
        return type == kJSTypedArrayTypeArrayBuffer;
    }

    bool Object::getArrayBufferData(uint8_t** ptr, size_t* length) const
    {
        assert(ptr && length);
        assert(isArrayBuffer());
        JSValueRef exception = nullptr;
        *length = JSObjectGetArrayBufferByteLength(__cx, _obj, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            return false;
        }

        *ptr = (uint8_t*)JSObjectGetArrayBufferBytesPtr(__cx, _obj, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            return false;
        }

        return (*ptr != nullptr);
    }

    void* Object::getPrivateData() const
    {
        if (_privateData == nullptr)
        {
            const_cast<Object*>(this)->_privateData = internal::getPrivate(_obj);
        }
        return _privateData;
    }

    void Object::setPrivateData(void* data)
    {
        assert(_privateData == nullptr);
        assert(NativePtrToObjectMap::find(data) == NativePtrToObjectMap::end());
        internal::setPrivate(_obj, data, _finalizeCb);
        NativePtrToObjectMap::emplace(data, this);
        _privateData = data;
    }

    void Object::clearPrivateData()
    {
        if (_privateData != nullptr)
        {
            void* data = getPrivateData();
            NativePtrToObjectMap::erase(data);
            internal::clearPrivate(_obj);
            _privateData = nullptr;
        }
    }

    void Object::setContext(JSContextRef cx)
    {
        __cx = cx;
    }

    void Object::cleanup()
    {
        ScriptEngine::getInstance()->addAfterCleanupHook([](){
            const auto& instance = NativePtrToObjectMap::instance();
            se::Object* obj = nullptr;
            for (const auto& e : instance)
            {
                obj = e.second;
                obj->_isCleanup = true; // _cleanup will invoke NativePtrToObjectMap::erase method which will break this for loop. It isn't needed at ScriptEngine::cleanup step.
                obj->decRef();
            }

            NativePtrToObjectMap::clear();
            NonRefNativePtrCreatedByCtorMap::clear();
            __cx = nullptr;
        });
    }

    JSObjectRef Object::_getJSObject() const
    {
        return _obj;
    }

    Class* Object::_getClass() const
    {
        return _cls;
    }

    void Object::root()
    {
        if (_rootCount == 0)
        {
            JSValueProtect(__cx, _obj);
        }
        ++_rootCount;
    }

    void Object::unroot()
    {
        if (_rootCount > 0)
        {
            --_rootCount;
            if (_rootCount == 0)
            {
                // Don't unprotect if it's in cleanup, otherwise, it will trigger crash.
                auto se = ScriptEngine::getInstance();
                if (!se->_isInCleanup && !se->isInGC())
                    JSValueUnprotect(__cx, _obj);
            }
        }
    }
    
    bool Object::isRooted() const
    {
        return _rootCount > 0;
    }

    bool Object::strictEquals(Object* o) const
    {
        return JSValueIsStrictEqual(__cx, _obj, o->_obj);
    }

    bool Object::attachObject(Object* obj)
    {
        assert(obj);

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
        args.push_back(Value(obj));
        func.toObject()->call(args, global);
        return true;
    }

    bool Object::detachObject(Object* obj)
    {
        assert(obj);
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
        args.push_back(Value(obj));
        func.toObject()->call(args, global);
        return true;
    }

} // namespace se {

#endif // SCRIPT_ENGINE_JSC
