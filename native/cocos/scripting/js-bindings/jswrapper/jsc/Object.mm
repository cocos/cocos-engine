/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#include "EJConvertTypedArray.h"

namespace se {

    namespace {
        JSContextRef __cx = nullptr;
#if SE_DEBUG > 0
        uint32_t __id = 0;
#endif

        bool isInstanceOfConstructor(JSContextRef ctx, JSValueRef value, const char* ctorName)
        {
            if (ctorName == nullptr)
                return false;
            Object* global = ScriptEngine::getInstance()->getGlobalObject();
            Value ctorVal;
            bool ret = false;
            if (global->getProperty(ctorName, &ctorVal), ctorVal.isObject())
            {
                ret = JSValueIsInstanceOfConstructor(ctx, value, ctorVal.toObject()->_getJSObject(), nullptr);
            }
            return ret;
        }
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
    , _type(Type::UNKNOWN)
    {
        _currentVMId = ScriptEngine::getInstance()->getVMId();
    }

    Object::~Object()
    {
        _cleanup();
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
            if (data)
            {
                memcpy(copiedData, data, byteLength);
            }
            else
            {
                memset(copiedData, 0, byteLength);
            }
            
            JSValueRef exception = nullptr;
            JSObjectRef jsobj = JSObjectMakeArrayBufferWithBytesNoCopy(__cx, copiedData, byteLength, myJSTypedArrayBytesDeallocator, nullptr, &exception);
            if (exception != nullptr)
            {
                ScriptEngine::getInstance()->_clearException(exception);
                return nullptr;
            }

            Object* obj = Object::_createJSObject(nullptr, jsobj);
            if (obj != nullptr)
                obj->_type = Type::ARRAY_BUFFER;
            return obj;
        }
#endif
        JSObjectRef ret = EJJSObjectMakeTypedArray(__cx, kEJJSTypedArrayTypeArrayBuffer, byteLength);
        NSData* nsData = [NSData dataWithBytes:data length:byteLength];
        EJJSObjectSetTypedArrayData(__cx, ret, nsData);

        Object* obj = Object::_createJSObject(nullptr, ret);
        if (obj != nullptr)
            obj->_type = Type::ARRAY_BUFFER;
        return obj;
    }

    Object* Object::createTypedArray(TypedArrayType type, void* data, size_t byteLength)
    {
        if (type == TypedArrayType::NONE)
        {
            SE_LOGE("Don't pass se::Object::TypedArrayType::NONE to createTypedArray API!");
            return nullptr;
        }

        if (type == TypedArrayType::UINT8_CLAMPED)
        {
            SE_LOGE("Doesn't support to create Uint8ClampedArray with Object::createTypedArray API!");
            return nullptr;
        }

#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000)
        if (isSupportTypedArrayAPI())
        {
            void* copiedData = malloc(byteLength);
            //If data has content,then will copy data into buffer,or will only clear buffer.
            if (data){
                memcpy(copiedData, data, byteLength);
            }
            else
            {
                memset(copiedData, 0, byteLength);
            }
            
            JSValueRef exception = nullptr;
            JSTypedArrayType jscTypedArrayType = kJSTypedArrayTypeNone;
            Type objectType = Type::UNKNOWN;
            switch (type) {
                case TypedArrayType::INT8:
                    objectType = Type::TYPED_ARRAY_INT8;
                    jscTypedArrayType = kJSTypedArrayTypeInt8Array;
                    break;
                case TypedArrayType::INT16:
                    objectType = Type::TYPED_ARRAY_INT16;
                    jscTypedArrayType = kJSTypedArrayTypeInt16Array;
                    break;
                case TypedArrayType::INT32:
                    objectType = Type::TYPED_ARRAY_INT32;
                    jscTypedArrayType = kJSTypedArrayTypeInt32Array;
                    break;
                case TypedArrayType::UINT8:
                    objectType = Type::TYPED_ARRAY_UINT8;
                    jscTypedArrayType = kJSTypedArrayTypeUint8Array;
                    break;
                case TypedArrayType::UINT8_CLAMPED:
                    objectType = Type::TYPED_ARRAY_UINT8_CLAMPED;
                    jscTypedArrayType = kJSTypedArrayTypeUint8ClampedArray;
                    break;
                case TypedArrayType::UINT16:
                    objectType = Type::TYPED_ARRAY_UINT16;
                    jscTypedArrayType = kJSTypedArrayTypeUint16Array;
                    break;
                case TypedArrayType::UINT32:
                    objectType = Type::TYPED_ARRAY_UINT32;
                    jscTypedArrayType = kJSTypedArrayTypeUint32Array;
                    break;
                case TypedArrayType::FLOAT32:
                    objectType = Type::TYPED_ARRAY_FLOAT32;
                    jscTypedArrayType = kJSTypedArrayTypeFloat32Array;
                    break;
                case TypedArrayType::FLOAT64:
                    objectType = Type::TYPED_ARRAY_FLOAT64;
                    jscTypedArrayType = kJSTypedArrayTypeFloat64Array;
                    break;
                default:
                    break;
            }
            JSObjectRef jsobj = JSObjectMakeTypedArrayWithBytesNoCopy(__cx, jscTypedArrayType, copiedData, byteLength, myJSTypedArrayBytesDeallocator, nullptr, &exception);
            if (exception != nullptr)
            {
                ScriptEngine::getInstance()->_clearException(exception);
                return nullptr;
            }
            Object* obj = Object::_createJSObject(nullptr, jsobj);
            if (obj != nullptr)
                obj->_type = objectType;
            return obj;
        }
#endif
        size_t numElements = 0;
        EJJSTypedArrayType jscTypedArrayType = kEJJSTypedArrayTypeNone;
        Type objectType = Type::UNKNOWN;
        switch (type) {
            case TypedArrayType::INT8:
                objectType = Type::TYPED_ARRAY_INT8;
                jscTypedArrayType = kEJJSTypedArrayTypeInt8Array;
                numElements = byteLength;
                break;
            case TypedArrayType::INT16:
                objectType = Type::TYPED_ARRAY_INT16;
                jscTypedArrayType = kEJJSTypedArrayTypeInt16Array;
                numElements = byteLength / 2;
                break;
            case TypedArrayType::INT32:
                objectType = Type::TYPED_ARRAY_INT32;
                jscTypedArrayType = kEJJSTypedArrayTypeInt32Array;
                numElements = byteLength / 4;
                break;
            case TypedArrayType::UINT8:
                objectType = Type::TYPED_ARRAY_UINT8;
                jscTypedArrayType = kEJJSTypedArrayTypeUint8Array;
                numElements = byteLength;
                break;
            case TypedArrayType::UINT8_CLAMPED:
                objectType = Type::TYPED_ARRAY_UINT8_CLAMPED;
                jscTypedArrayType = kEJJSTypedArrayTypeUint8ClampedArray;
                numElements = byteLength;
                break;
            case TypedArrayType::UINT16:
                objectType = Type::TYPED_ARRAY_UINT16;
                jscTypedArrayType = kEJJSTypedArrayTypeUint16Array;
                numElements = byteLength / 2;
                break;
            case TypedArrayType::UINT32:
                objectType = Type::TYPED_ARRAY_UINT32;
                jscTypedArrayType = kEJJSTypedArrayTypeUint32Array;
                numElements = byteLength / 4;
                break;
            case TypedArrayType::FLOAT32:
                objectType = Type::TYPED_ARRAY_FLOAT32;
                jscTypedArrayType = kEJJSTypedArrayTypeFloat32Array;
                numElements = byteLength / 4;
                break;
            case TypedArrayType::FLOAT64:
                objectType = Type::TYPED_ARRAY_FLOAT64;
                jscTypedArrayType = kEJJSTypedArrayTypeFloat64Array;
                numElements = byteLength / 8;
                break;
            default:
                break;
        }

        JSObjectRef ret = EJJSObjectMakeTypedArray(__cx, jscTypedArrayType, numElements);
        NSData* nsData = [NSData dataWithBytes:data length:byteLength];
        EJJSObjectSetTypedArrayData(__cx, ret, nsData);

        Object* obj = Object::_createJSObject(nullptr, ret);
        if (obj != nullptr)
            obj->_type = objectType;
        return obj;
    }

    Object* Object::createUint8TypedArray(uint8_t* data, size_t dataCount)
    {
        return createTypedArray(TypedArrayType::UINT8, data, dataCount);
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
                //            SE_LOGD("Object::_cleanup, (%p) rootCount: %u\n", this, _rootCount);
                // Don't unprotect if it's in cleanup, otherwise, it will trigger crash.
                if (!se->isInCleanup() && !se->isGarbageCollecting())
                    JSValueUnprotect(__cx, _obj);

                _rootCount = 0;
            }
        }
        else
        {
            SE_LOGD("Object::_cleanup, ScriptEngine was initialized again, ignore cleanup work, oldVMId: %u, newVMId: %u\n", _currentVMId, se->getVMId());
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
        if (_type == Type::TYPED_ARRAY_INT8
            || _type == Type::TYPED_ARRAY_INT16
            || _type == Type::TYPED_ARRAY_INT32
            || _type == Type::TYPED_ARRAY_UINT8
            || _type == Type::TYPED_ARRAY_UINT8_CLAMPED
            || _type == Type::TYPED_ARRAY_UINT16
            || _type == Type::TYPED_ARRAY_UINT32
            || _type == Type::TYPED_ARRAY_FLOAT32
            || _type == Type::TYPED_ARRAY_FLOAT64
            )
        {
            return true;
        }

#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000)
        if (isSupportTypedArrayAPI())
        {
            JSTypedArrayType type = JSValueGetTypedArrayType(__cx, _obj, nullptr);
            bool ret = (type != kJSTypedArrayTypeNone && type != kJSTypedArrayTypeArrayBuffer);
            if (ret)
            {
                switch (type) {
                    case kJSTypedArrayTypeInt8Array:
                        _type = Type::TYPED_ARRAY_INT8;
                        break;
                    case kJSTypedArrayTypeInt16Array:
                        _type = Type::TYPED_ARRAY_INT16;
                        break;
                    case kJSTypedArrayTypeInt32Array:
                        _type = Type::TYPED_ARRAY_INT32;
                        break;
                    case kJSTypedArrayTypeUint8Array:
                        _type = Type::TYPED_ARRAY_UINT8;
                        break;
                    case kJSTypedArrayTypeUint8ClampedArray:
                        _type = Type::TYPED_ARRAY_UINT8_CLAMPED;
                        break;
                    case kJSTypedArrayTypeUint16Array:
                        _type = Type::TYPED_ARRAY_UINT16;
                        break;
                    case kJSTypedArrayTypeUint32Array:
                        _type = Type::TYPED_ARRAY_UINT32;
                        break;
                    case kJSTypedArrayTypeFloat32Array:
                        _type = Type::TYPED_ARRAY_FLOAT32;
                        break;
                    case kJSTypedArrayTypeFloat64Array:
                        _type = Type::TYPED_ARRAY_FLOAT64;
                        break;
                    default:
                        break;
                }
            }
            return ret;
        }
#endif

        EJJSTypedArrayType typedArrayType = EJJSObjectGetTypedArrayType(__cx, _obj);
        return typedArrayType >= kEJJSTypedArrayTypeInt8Array && typedArrayType <= kEJJSTypedArrayTypeFloat64Array;
    }

    Object::TypedArrayType Object::getTypedArrayType() const
    {
        if (_type == Type::TYPED_ARRAY_INT8)
            return TypedArrayType::INT8;
        else if (_type == Type::TYPED_ARRAY_INT16)
            return TypedArrayType::INT16;
        else if (_type == Type::TYPED_ARRAY_INT32)
            return TypedArrayType::INT32;
        else if (_type == Type::TYPED_ARRAY_UINT8)
            return TypedArrayType::UINT8;
        else if (_type == Type::TYPED_ARRAY_UINT8_CLAMPED)
            return TypedArrayType::UINT8_CLAMPED;
        else if (_type == Type::TYPED_ARRAY_UINT16)
            return TypedArrayType::UINT16;
        else if (_type == Type::TYPED_ARRAY_UINT32)
            return TypedArrayType::UINT32;
        else if (_type == Type::TYPED_ARRAY_FLOAT32)
            return TypedArrayType::FLOAT32;
        else if (_type == Type::TYPED_ARRAY_FLOAT64)
            return TypedArrayType::FLOAT64;

        TypedArrayType typedArrayType = TypedArrayType::NONE;

#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000)
        if (isSupportTypedArrayAPI())
        {
            JSTypedArrayType type = JSValueGetTypedArrayType(__cx, _obj, nullptr);
            bool ret = (type != kJSTypedArrayTypeNone && type != kJSTypedArrayTypeArrayBuffer);
            if (ret)
            {
                switch (type) {
                    case kJSTypedArrayTypeInt8Array:
                        _type = Type::TYPED_ARRAY_INT8;
                        typedArrayType = TypedArrayType::INT8;
                        break;
                    case kJSTypedArrayTypeInt16Array:
                        _type = Type::TYPED_ARRAY_INT16;
                        typedArrayType = TypedArrayType::INT16;
                        break;
                    case kJSTypedArrayTypeInt32Array:
                        _type = Type::TYPED_ARRAY_INT32;
                        typedArrayType = TypedArrayType::INT32;
                        break;
                    case kJSTypedArrayTypeUint8Array:
                        _type = Type::TYPED_ARRAY_UINT8;
                        typedArrayType = TypedArrayType::UINT8;
                        break;
                    case kJSTypedArrayTypeUint8ClampedArray:
                        _type = Type::TYPED_ARRAY_UINT8_CLAMPED;
                        typedArrayType = TypedArrayType::UINT8_CLAMPED;
                        break;
                    case kJSTypedArrayTypeUint16Array:
                        _type = Type::TYPED_ARRAY_UINT16;
                        typedArrayType = TypedArrayType::UINT16;
                        break;
                    case kJSTypedArrayTypeUint32Array:
                        _type = Type::TYPED_ARRAY_UINT32;
                        typedArrayType = TypedArrayType::UINT32;
                        break;
                    case kJSTypedArrayTypeFloat32Array:
                        _type = Type::TYPED_ARRAY_FLOAT32;
                        typedArrayType = TypedArrayType::FLOAT32;
                        break;
                    case kJSTypedArrayTypeFloat64Array:
                        _type = Type::TYPED_ARRAY_FLOAT64;
                        typedArrayType = TypedArrayType::FLOAT64;
                        break;
                    default:
                        break;
                }
            }
            return typedArrayType;
        }
#endif
        EJJSTypedArrayType ejTypedArrayType = EJJSObjectGetTypedArrayType(__cx, _obj);

        switch (ejTypedArrayType) {
            case kEJJSTypedArrayTypeInt8Array:
                _type = Type::TYPED_ARRAY_INT8;
                typedArrayType = TypedArrayType::INT8;
                break;
            case kEJJSTypedArrayTypeInt16Array:
                _type = Type::TYPED_ARRAY_INT16;
                typedArrayType = TypedArrayType::INT16;
                break;
            case kEJJSTypedArrayTypeInt32Array:
                _type = Type::TYPED_ARRAY_INT32;
                typedArrayType = TypedArrayType::INT32;
                break;
            case kEJJSTypedArrayTypeUint8Array:
                _type = Type::TYPED_ARRAY_UINT8;
                typedArrayType = TypedArrayType::UINT8;
                break;
            case kEJJSTypedArrayTypeUint8ClampedArray:
                _type = Type::TYPED_ARRAY_UINT8_CLAMPED;
                typedArrayType = TypedArrayType::UINT8_CLAMPED;
                break;
            case kEJJSTypedArrayTypeUint16Array:
                _type = Type::TYPED_ARRAY_UINT16;
                typedArrayType = TypedArrayType::UINT16;
                break;
            case kEJJSTypedArrayTypeUint32Array:
                _type = Type::TYPED_ARRAY_UINT32;
                typedArrayType = TypedArrayType::UINT32;
                break;
            case kEJJSTypedArrayTypeFloat32Array:
                _type = Type::TYPED_ARRAY_FLOAT32;
                typedArrayType = TypedArrayType::FLOAT32;
                break;
            case kEJJSTypedArrayTypeFloat64Array:
                _type = Type::TYPED_ARRAY_FLOAT64;
                typedArrayType = TypedArrayType::FLOAT64;
                break;
            default:
                typedArrayType = TypedArrayType::NONE;
                break;
        }

        return typedArrayType;
    }

    bool Object::getTypedArrayData(uint8_t** ptr, size_t* length) const
    {
        assert(isTypedArray());
#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000)
        if (isSupportTypedArrayAPI())
        {
            bool succeed = false;
            JSValueRef exception = nullptr;
            do
            {
                *length = JSObjectGetTypedArrayByteLength(__cx, _obj, &exception);
                if (exception != nullptr)
                    break;

                size_t offset = JSObjectGetTypedArrayByteOffset(__cx, _obj, &exception);
                if (exception != nullptr)
                    break;

                uint8_t* buf = (uint8_t*)JSObjectGetTypedArrayBytesPtr(__cx, _obj, &exception);
                if (exception != nullptr)
                    break;

                if (buf == nullptr)
                    break;

                *ptr = buf + offset;
                succeed = true;
            } while (false);

            if (!succeed)
            {
                *ptr = nullptr;
                *length = 0;
                ScriptEngine::getInstance()->_clearException(exception);
                return false;
            }

            return true;
        }
#endif
        NSMutableData* data = EJJSObjectGetTypedArrayData(__cx, _obj);
        *ptr = (uint8_t*)data.mutableBytes;
        *length = data.length;
        return true;
    }

    bool Object::_isNativeFunction() const
    {
        if (isFunction())
        {
            std::string info = toString();
            if (info.find("[native code]") != std::string::npos)
            {
                return true;
            }
        }
        return false;
    }

    bool Object::isArray() const
    {
        if (_type == Type::ARRAY)
            return true;

#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101100 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 90000)
        if (isSupportArrayTestAPI())
        {
            return JSValueIsArray(__cx, _obj);
        }
#endif
        bool ret = isInstanceOfConstructor(__cx, _obj, "Array");
        if (ret)
            _type = Type::ARRAY;
        return ret;
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

        bool ret = isInstanceOfConstructor(__cx, _obj, "ArrayBuffer");
        if (ret)
            _type = Type::ARRAY_BUFFER;
        return ret;
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
#endif
        NSMutableData* data = EJJSObjectGetTypedArrayData(__cx, _obj);
        *ptr = (uint8_t*)data.mutableBytes;
        *length = data.length;
        return true;
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

    void Object::clearPrivateData(bool clearMapping)
    {
        if (_privateData != nullptr)
        {
            if (clearMapping)
                NativePtrToObjectMap::erase(_privateData);
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
                    SE_LOGD("Object::unroot, ScriptEngine was initialized again, ignore cleanup work, oldVMId: %u, newVMId: %u\n", _currentVMId, se->getVMId());
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

    std::string Object::toString() const
    {
        std::string ret;
        if (isFunction() || isArray() || isTypedArray())
        {
            internal::forceConvertJsValueToStdString(__cx, _obj, &ret);
        }
        else if (isArrayBuffer())
        {
            ret = "[object ArrayBuffer]";
        }
        else
        {
            ret = "[object Object]";
        }
        return ret;
    }

} // namespace se {

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_JSC

