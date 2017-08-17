//
//  Utils.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 4/26/17.
//
//

#include "Utils.hpp"

#ifdef SCRIPT_ENGINE_JSC

#include "Object.hpp"
#include "ScriptEngine.hpp"
#include "../HandleObject.hpp"

namespace se {

    namespace internal {

    namespace {
        JSContextRef __cx = nullptr;
    }

    void setContext(JSContextRef cx)
    {
        __cx = cx;
    }

    bool defineProperty(Object* obj, const char* name, JSObjectCallAsFunctionCallback jsGetter, JSObjectCallAsFunctionCallback jsSetter)
    {
        bool ok = true;
        Object* globalObject = ScriptEngine::getInstance()->getGlobalObject();
        Value v;
        ok = globalObject->getProperty("Object", &v);
        if (!ok || !v.isObject())
        {
            LOGD("ERROR: couldn't find Object\n");
            return false;
        }

        Value definePropertyFunc;
        ok = v.toObject()->getProperty("defineProperty", &definePropertyFunc);
        if (!ok || !v.isObject())
        {
            LOGD("ERROR: couldn't find Object.defineProperty\n");
            return false;
        }

        ValueArray args;
        args.reserve(3);
        args.push_back(Value(obj));
        args.push_back(Value(name));

        HandleObject desc(Object::createPlainObject());

        JSObjectRef getter = nullptr;
        if (jsGetter != nullptr)
        {
            getter = JSObjectMakeFunctionWithCallback(__cx, nullptr, jsGetter);
        }
        JSObjectRef setter = nullptr;

        if (jsSetter != nullptr)
        {
            setter = JSObjectMakeFunctionWithCallback(__cx, nullptr, jsSetter);
        }

        assert(getter != nullptr);

        if (getter != nullptr)
        {
            HandleObject getterObj(Object::_createJSObject(nullptr, getter));
            desc->setProperty("get", se::Value(getterObj));
        }

        if (setter != nullptr)
        {
            HandleObject setterObj(Object::_createJSObject(nullptr, setter));
            desc->setProperty("set", se::Value(setterObj));
        }

        args.push_back(Value(desc));
        definePropertyFunc.toObject()->call(args, nullptr);

        return true;
    }

    void jsToSeArgs(JSContextRef cx, unsigned short argc, const JSValueRef* argv, ValueArray* outArr)
    {
        outArr->reserve(argc);
        for (unsigned short i = 0; i < argc; ++i)
        {
            Value v;
            jsToSeValue(cx, argv[i], &v);
            outArr->push_back(v);
        }
    }

    void seToJsArgs(JSContextRef cx, const ValueArray& args, JSValueRef* outArr)
    {
        for (size_t i = 0, len = args.size(); i < len; ++i)
        {
            seToJsValue(cx, args[i], &outArr[i]);
        }
    }

    void jsToSeValue(JSContextRef cx, JSValueRef jsValue, Value* data)
    {
        if (JSValueIsNull(cx, jsValue))
        {
            data->setNull();
        }
        else if (JSValueIsUndefined(cx, jsValue))
        {
            data->setUndefined();
        }
        else if (JSValueIsNumber(cx, jsValue))
        {
            JSValueRef exception = nullptr;
            double number = JSValueToNumber(cx, jsValue, &exception);
            if (exception != nullptr)
            {
                ScriptEngine::getInstance()->_clearException(exception);
            }
            else
            {
                data->setNumber(number);
            }
        }
        else if (JSValueIsBoolean(cx, jsValue))
        {
            data->setBoolean(JSValueToBoolean(cx, jsValue));
        }
        else if (JSValueIsString(cx, jsValue))
        {
            std::string str;
            forceConvertJsValueToStdString(cx, jsValue, &str);
            data->setString(str);
        }
        else if (JSValueIsObject(cx, jsValue))
        {
            JSValueRef exception = nullptr;
            JSObjectRef jsobj = JSValueToObject(cx, jsValue, &exception);
            if (exception != nullptr)
            {
                ScriptEngine::getInstance()->_clearException(exception);
            }
            else
            {
                void* nativePtr = internal::getPrivate(jsobj);
                Object* obj = nullptr;
                if (nativePtr != nullptr)
                {
                    obj = Object::getObjectWithPtr(nativePtr);
                }

                if (obj == nullptr)
                {
                    obj = Object::_createJSObject(nullptr, jsobj);
                }
                data->setObject(obj, true);
                obj->release();
            }
        }
        else
        {
            assert(false);
        }
    }

    void seToJsValue(JSContextRef cx, const Value& v, JSValueRef* jsval)
    {
        switch (v.getType()) {
            case Value::Type::Null:
                *jsval = JSValueMakeNull(cx);
                break;

            case Value::Type::Number:
                *jsval = JSValueMakeNumber(cx, v.toNumber());
                break;

            case Value::Type::String:
            {
                JSStringRef str = JSStringCreateWithUTF8CString(v.toString().c_str());
                *jsval = JSValueMakeString(cx, str);
                JSStringRelease(str);
            }
                break;

            case Value::Type::Boolean:
                *jsval = JSValueMakeBoolean(cx, v.toBoolean());
                break;

            case Value::Type::Object:
                *jsval = v.toObject()->_getJSObject();
                break;
                
            default: // Undefined
                *jsval = JSValueMakeUndefined(cx);
                break;
        }
    }

    void forceConvertJsValueToStdString(JSContextRef cx, JSValueRef jsval, std::string* ret)
    {
        JSValueRef exception = nullptr;
        JSStringRef jsstr = JSValueToStringCopy(cx, jsval, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
            ret->clear();
        }
        else
        {
            jsStringToStdString(cx, jsstr, ret);
        }
        JSStringRelease(jsstr);
    }

    void jsStringToStdString(JSContextRef cx, JSStringRef jsStr, std::string* ret)
    {
        size_t len = JSStringGetLength(jsStr);
        const size_t BUF_SIZE = len * 4 + 1;
        char* buf = (char*)malloc(BUF_SIZE);
        memset(buf, 0, BUF_SIZE);
        JSStringGetUTF8CString(jsStr, buf, BUF_SIZE);
        *ret = buf;
        free(buf);
    }

    const char* KEY_PRIVATE_DATA = "__cc_private_data";

    bool hasPrivate(JSObjectRef obj)
    {
        void* data = JSObjectGetPrivate(obj);
        if (data != nullptr)
            return true;

        JSStringRef key = JSStringCreateWithUTF8CString(KEY_PRIVATE_DATA);
        bool found = JSObjectHasProperty(__cx, obj, key);
        JSStringRelease(key);

        return found;
    }

    void setPrivate(JSObjectRef obj, void* data, JSObjectFinalizeCallback finalizeCb)
    {
        bool ok = JSObjectSetPrivate(obj, data);
        if (ok)
        {
            return;
        }

        assert(finalizeCb);
        HandleObject privateObj(Object::createObjectWithClass(__jsb_CCPrivateData_class));
        internal::PrivateData* privateData = (internal::PrivateData*)malloc(sizeof(internal::PrivateData));
        privateData->data = data;
        privateData->finalizeCb = finalizeCb;
        ok = JSObjectSetPrivate(privateObj->_getJSObject(), privateData);
        assert(ok);

        JSStringRef key = JSStringCreateWithUTF8CString(KEY_PRIVATE_DATA);
        JSValueRef exception = nullptr;
        JSObjectSetProperty(__cx, obj, key, privateObj->_getJSObject(), kJSPropertyAttributeDontEnum, &exception);
        if (exception != nullptr)
        {
            ScriptEngine::getInstance()->_clearException(exception);
        }
        JSStringRelease(key);
    }

    void* getPrivate(JSObjectRef obj)
    {
        void* data = JSObjectGetPrivate(obj);
        if (data != nullptr)
            return data;

        JSStringRef key = JSStringCreateWithUTF8CString(KEY_PRIVATE_DATA);
        bool found = JSObjectHasProperty(__cx, obj, key);
        if (found)
        {
            JSValueRef exception = nullptr;
            JSValueRef privateDataVal = JSObjectGetProperty(__cx, obj, key, &exception);
            do
            {
                if (exception != nullptr)
                    break;

                JSObjectRef jsobj = JSValueToObject(__cx, privateDataVal, &exception);
                if (exception != nullptr)
                    break;

                internal::PrivateData* privateData = (internal::PrivateData*)JSObjectGetPrivate(jsobj);
                assert(privateData != nullptr);
                data = privateData->data;
            } while(false);

            if (exception != nullptr)
            {
                ScriptEngine::getInstance()->_clearException(exception);
            }
        }
        JSStringRelease(key);
        return data;
    }

    void clearPrivate(JSObjectRef obj)
    {
        void* data = JSObjectGetPrivate(obj);
        if (data != nullptr)
        {
            JSObjectSetPrivate(obj, nullptr);
        }
        else
        {
            JSStringRef key = JSStringCreateWithUTF8CString(KEY_PRIVATE_DATA); //FIXME: cache the key string
            if (JSObjectHasProperty(__cx, obj, key))
            {
                JSValueRef exception = nullptr;
                do
                {
                    JSValueRef value = JSObjectGetProperty(__cx, obj, key, &exception);
                    if (exception != nullptr)
                        break;

                    JSObjectRef propertyObj = JSValueToObject(__cx, value, &exception);
                    if (exception != nullptr)
                        break;

                    internal::PrivateData* privateData = (internal::PrivateData*)JSObjectGetPrivate(propertyObj);
                    free(privateData);
                    JSObjectSetPrivate(propertyObj, nullptr);
                    bool ok = JSObjectDeleteProperty(__cx, obj, key, nullptr);
                    assert(ok);
                } while (false);

                if (exception != nullptr)
                {
                    ScriptEngine::getInstance()->_clearException(exception);
                }
            }

            JSStringRelease(key);
        }
    }

}} // namespace se { namespace internal {

#endif // #ifdef SCRIPT_ENGINE_JSC
