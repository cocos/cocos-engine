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

namespace se {

    const bool NEED_THIS = true;
    const bool DONT_NEED_THIS = false;

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
        ok = globalObject->getProperty("__defineProperty", &v);
        if (!ok)
        {
            printf("ERROR: couldn't find __defineProperty\n");
            return false;
        }

        Object* definePropertyFunc = v.toObject();

        ValueArray args;
        args.reserve(4);
        args.push_back(Value(obj));
        args.push_back(Value(name));

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
            Object* getterObj = Object::_createJSObject(nullptr, getter, false);
            args.push_back(Value(getterObj));
            getterObj->release();
        }

        if (setter != nullptr)
        {
            Object* setterObj = Object::_createJSObject(nullptr, setter, false);
            args.push_back(Value(setterObj));
            setterObj->release();
        }
        
        definePropertyFunc->call(args, nullptr);
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
            data->setNumber(JSValueToNumber(cx, jsValue, nullptr));
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
            Object* obj = Object::_createJSObject(nullptr, JSValueToObject(cx, jsValue, nullptr), true);
            data->setObject(obj);
            obj->release();
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
        JSStringRef jsstr = JSValueToStringCopy(cx, jsval, nullptr);
        jsStringToStdString(cx, jsstr, ret);
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
        Object* privateObj = Object::createObjectWithClass(__jsb_CCPrivateData_class, false);
        internal::PrivateData* privateData = (internal::PrivateData*)malloc(sizeof(internal::PrivateData));
        privateData->data = data;
        privateData->finalizeCb = finalizeCb;
        assert(JSObjectSetPrivate(privateObj->_getJSObject(), privateData));

        JSStringRef key = JSStringCreateWithUTF8CString(KEY_PRIVATE_DATA);
        JSObjectSetProperty(__cx, obj, key, privateObj->_getJSObject(), kJSPropertyAttributeDontEnum, nullptr);
        JSStringRelease(key);
        privateObj->release();
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
            JSValueRef privateDataVal = JSObjectGetProperty(__cx, obj, key, nullptr);
            internal::PrivateData* privateData = (internal::PrivateData*)JSObjectGetPrivate(JSValueToObject(__cx, privateDataVal, nullptr));
            assert(privateData != nullptr);
            data = privateData->data;
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
            JSStringRef key = JSStringCreateWithUTF8CString(KEY_PRIVATE_DATA);
            if (JSObjectHasProperty(__cx, obj, key))
            {
                JSValueRef value = JSObjectGetProperty(__cx, obj, key, nullptr);
                JSObjectRef propertyObj = JSValueToObject(__cx, value, nullptr);
                internal::PrivateData* privateData = (internal::PrivateData*)JSObjectGetPrivate(propertyObj);
                free(privateData);
                JSObjectSetPrivate(propertyObj, nullptr);
                bool ok = JSObjectDeleteProperty(__cx, obj, key, nullptr);
                assert(ok);
            }

            JSStringRelease(key);
        }
    }

}} // namespace se { namespace internal {

#endif // #ifdef SCRIPT_ENGINE_JSC
