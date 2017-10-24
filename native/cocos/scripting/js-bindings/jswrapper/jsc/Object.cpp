/****************************************************************************
 Copyright (c) 2017 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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
#include "Object.hpp"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_JSC

#include "Utils.hpp"
#include "Class.hpp"
#include "ScriptEngine.hpp"
#include "PlatformUtils.h"
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
    , _arrayBuffer(nullptr)
    , _arrayBufferSize(0)
    , _rootCount(0)
#if SE_DEBUG > 0
    , _id(++__id)
#endif
    , _isCleanup(false)
    , _type(Type::UNKNOWN)
    {
        _currentVMId = ScriptEngine::getInstance()->getVMId();
    }

    Object::~Object()
    {
        _cleanup();
        if (_arrayBuffer != nullptr)
        {
            free(_arrayBuffer);
        }
    }

    Object* Object::createPlainObject()
    {
        Object* obj = _createJSObject(nullptr, JSObjectMake(__cx, nullptr, nullptr));
        if (obj != nullptr)
            obj->_type = Type::PLAIN;
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
        if (obj != nullptr)
            obj->_type = Type::ARRAY;
        return obj;
    }

#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000)
    static void myJSTypedArrayBytesDeallocator(void* bytes, void* deallocatorContext)
    {
        free(bytes);
    }
#endif

    Object* Object::createArrayBufferObject(void* data, size_t byteLength)
    {
#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000)
        if (isSupportTypedArrayAPI())
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
        else
#endif
        {
            HandleObject arr(Object::createArrayObject(byteLength));
            if (!arr.isEmpty())
            {
                uint8_t* p = (uint8_t*)data;
                for (size_t i = 0; i < byteLength; ++i)
                {
                    arr->setArrayElement((uint32_t)i, se::Value(p[i]));
                }

                ValueArray args;
                args.push_back(Value(arr));
                Value func;
                bool ok = ScriptEngine::getInstance()->getGlobalObject()->getProperty("__jsc_createArrayBufferObject", &func);
                if (ok && func.isObject() && func.toObject()->isFunction())
                {
                    Value ret;
                    ok = func.toObject()->call(args, nullptr, &ret);
                    if (ok && ret.isObject())
                    {
                        Object* obj = Object::_createJSObject(nullptr, ret.toObject()->_obj);
                        if (obj != nullptr)
                            obj->_type = Type::ARRAY_BUFFER;
                        return obj;
                    }
                }
            }
        }

        return nullptr;
    }

    Object* Object::createUint8TypedArray(uint8_t* data, size_t byteLength)
    {
#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000)
        if (isSupportTypedArrayAPI())
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
        else
#endif
        {
            HandleObject arr(Object::createArrayObject(byteLength));
            if (!arr.isEmpty())
            {
                uint8_t* p = (uint8_t*)data;
                for (size_t i = 0; i < byteLength; ++i)
                {
                    arr->setArrayElement((uint32_t)i, se::Value(p[i]));
                }

                ValueArray args;
                args.push_back(Value(arr));
                Value func;
                bool ok = ScriptEngine::getInstance()->getGlobalObject()->getProperty("__jsc_createUint8TypedArray", &func);
                if (ok && func.isObject() && func.toObject()->isFunction())
                {
                    Value ret;
                    ok = func.toObject()->call(args, nullptr, &ret);
                    if (ok && ret.isObject())
                    {
                        Object* obj = Object::_createJSObject(nullptr, ret.toObject()->_obj);
                        if (obj != nullptr)
                            obj->_type = Type::TYPED_ARRAY;

                        return obj;
                    }
                }
            }
        }

        return nullptr;
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
            if (obj != nullptr)
                obj->_type = Type::PLAIN;
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

        auto se = ScriptEngine::getInstance();
        if (_currentVMId == se->getVMId())
        {
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
    //            LOGD("Object::_cleanup, (%p) rootCount: %u\n", this, _rootCount);
                // Don't unprotect if it's in cleanup, otherwise, it will trigger crash.
                if (!se->isInCleanup() && !se->isGarbageCollecting())
                    JSValueUnprotect(__cx, _obj);

                _rootCount = 0;
            }
        }
        else
        {
            LOGD("Object::_cleanup, ScriptEngine was initialized again, ignore cleanup work, oldVMId: %u, newVMId: %u\n", _currentVMId, se->getVMId());
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

    bool Object::setProperty(const char* name, const Value& v)
    {
        bool ret = true;
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
            ret = false;
        }

        JSStringRelease(jsName);

        return ret;
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
        if (_type == Type::TYPED_ARRAY)
            return true;

#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000)
        if (isSupportTypedArrayAPI())
        {
            JSTypedArrayType type = JSValueGetTypedArrayType(__cx, _obj, nullptr);
            bool ret = (type != kJSTypedArrayTypeNone && type != kJSTypedArrayTypeArrayBuffer);
            if (ret)
                _type = Type::TYPED_ARRAY;
            return ret;
        }
#endif
        Value func;
        bool ok = ScriptEngine::getInstance()->getGlobalObject()->getProperty("__jsc_isTypedArray", &func);
        if (ok && func.isObject() && func.toObject()->isFunction())
        {
            ValueArray args;
            args.push_back(Value((Object*)this));

            Value rval;
            ok = func.toObject()->call(args, nullptr, &rval);
            if (ok && rval.isBoolean())
            {
                bool ret = rval.toBoolean();
                if (ret)
                    _type = Type::TYPED_ARRAY;
                return ret;
            }
        }

        return false;
    }

    bool Object::getTypedArrayData(uint8_t** ptr, size_t* length) const
    {
        assert(isTypedArray());
#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000)
        if (isSupportTypedArrayAPI())
        {
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
        else
#endif
        {
            Value func;
            bool ok = ScriptEngine::getInstance()->getGlobalObject()->getProperty("__jsc_getUint8ArrayData", &func);
            if (ok && func.isObject() && func.toObject()->isFunction())
            {
                ValueArray args;
                args.push_back(Value((Object*)this));

                Value rval;
                ok = func.toObject()->call(args, nullptr, &rval);
                if (ok && rval.isObject() && rval.toObject()->isArray())
                {
                    uint32_t len = 0;
                    Object* arrObj = rval.toObject();
                    if (arrObj->getArrayLength(&len))
                    {
                        if (len > 0)
                        {
                            Value tmp;
                            if (_arrayBuffer == nullptr)
                            {
                                _arrayBuffer = (uint8_t*)malloc(len);
                            }
                            else if (_arrayBufferSize != len)
                            {
                                _arrayBuffer = (uint8_t*)realloc(_arrayBuffer, len);
                            }

                            *length = _arrayBufferSize = len;
                            *ptr = _arrayBuffer;
                            for (uint32_t i = 0; i < len; ++i)
                            {
                                if (arrObj->getArrayElement(i, &tmp) && tmp.isNumber())
                                {
                                    _arrayBuffer[i] = tmp.toUint8();
                                }
                            }
                            return true;
                        }
                    }
                }
            }
        }

        return false;
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
        if (_type == Type::ARRAY_BUFFER)
            return true;

#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000)
        if (isSupportTypedArrayAPI())
        {
            JSValueRef exception = nullptr;
            JSTypedArrayType type = JSValueGetTypedArrayType(__cx, _obj, &exception);
            if (exception != nullptr)
            {
                ScriptEngine::getInstance()->_clearException(exception);
                return false;
            }

            bool ret = type == kJSTypedArrayTypeArrayBuffer;
            if (ret)
                _type = Type::ARRAY_BUFFER;
            return ret;
        }
#endif

        Value func;
        bool ok = ScriptEngine::getInstance()->getGlobalObject()->getProperty("__jsc_isArrayBuffer", &func);
        if (ok && func.isObject() && func.toObject()->isFunction())
        {
            ValueArray args;
            args.push_back(Value((Object*)this));

            Value rval;
            ok = func.toObject()->call(args, nullptr, &rval);
            if (ok && rval.isBoolean())
            {
                bool ret = rval.toBoolean();
                if (ret)
                    _type = Type::ARRAY_BUFFER;
                return ret;
            }
        }

        return false;
    }

    bool Object::getArrayBufferData(uint8_t** ptr, size_t* length) const
    {
        assert(ptr && length);
        assert(isArrayBuffer());

#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000)
        if (isSupportTypedArrayAPI())
        {
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
        else
#endif
        {
            Value func;
            bool ok = ScriptEngine::getInstance()->getGlobalObject()->getProperty("__jsc_getArrayBufferData", &func);
            if (ok && func.isObject() && func.toObject()->isFunction())
            {
                ValueArray args;
                args.push_back(Value((Object*)this));

                Value rval;
                ok = func.toObject()->call(args, nullptr, &rval);
                if (ok && rval.isObject() && rval.toObject()->isArray())
                {
                    uint32_t len = 0;
                    Object* arrObj = rval.toObject();
                    if (arrObj->getArrayLength(&len))
                    {
                        if (len > 0)
                        {
                            Value tmp;
                            if (_arrayBuffer == nullptr)
                            {
                                _arrayBuffer = (uint8_t*)malloc(len);
                            }
                            else if (_arrayBufferSize != len)
                            {
                                _arrayBuffer = (uint8_t*)realloc(_arrayBuffer, len);
                            }

                            *length = _arrayBufferSize = len;
                            *ptr = _arrayBuffer;
                            for (uint32_t i = 0; i < len; ++i)
                            {
                                if (arrObj->getArrayElement(i, &tmp) && tmp.isNumber())
                                {
                                    _arrayBuffer[i] = tmp.toUint8();
                                }
                            }
                            return true;
                        }
                    }
                }
            }
        }
        return false;
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
                if (_currentVMId == se->getVMId())
                {
                    if (!se->isInCleanup() && !se->isGarbageCollecting())
                        JSValueUnprotect(__cx, _obj);
                }
                else
                {
                    LOGD("Object::unroot, ScriptEngine was initialized again, ignore cleanup work, oldVMId: %u, newVMId: %u\n", _currentVMId, se->getVMId());
                }
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

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_JSC
