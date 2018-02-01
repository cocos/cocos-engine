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
#include "Utils.hpp"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

#include "Class.hpp"
#include "Object.hpp"
#include "ScriptEngine.hpp"

namespace se {

    namespace internal {

    void forceConvertJsValueToStdString(JSContext* cx, JS::HandleValue jsval, std::string* ret)
    {
        assert(ret != nullptr);
        JS::RootedString jsStr(cx, JS::ToString(cx, jsval));
        *ret = jsToStdString(cx, jsStr);
    }

    std::string jsToStdString(JSContext* cx, JS::HandleString jsStr)
    {
        char* str = JS_EncodeStringToUTF8(cx, jsStr);
        std::string ret(str);
        JS_free(cx, str);
        return ret;
    }

    void jsToSeArgs(JSContext* cx, int argc, const JS::CallArgs& argv, ValueArray* outArr)
    {
        outArr->reserve(argc);
        for (int i = 0; i < argc; ++i)
        {
            Value v;
            jsToSeValue(cx, argv[i], &v);
            outArr->push_back(v);
        }
    }

    void seToJsArgs(JSContext* cx, const ValueArray& args, JS::AutoValueVector* outArr)
    {
        for (const auto& arg : args)
        {
            JS::RootedValue v(cx);
            seToJsValue(cx, arg, &v);
            outArr->append(v);
        }
    }

    void seToJsValue(JSContext* cx, const Value& arg, JS::MutableHandleValue outVal)
    {
        switch( arg.getType())
        {
            case Value::Type::Number:
            {
                JS::RootedValue value(cx);
                value.setDouble(arg.toNumber());
                outVal.set(value);
            }
                break;

            case Value::Type::String:
            {
                JS::UTF8Chars utf8Str(arg.toString().c_str(), arg.toString().length());
                JSString* string = JS_NewStringCopyUTF8N(cx, utf8Str);
                JS::RootedValue value(cx);
                value.setString(string);
                outVal.set(value);
            }
                break;

            case Value::Type::Boolean:
            {
                JS::RootedValue value(cx);
                value.setBoolean(arg.toBoolean());
                outVal.set(value);
            }
                break;

            case Value::Type::Object:
            {
                JS::RootedValue value(cx, JS::ObjectValue(*arg.toObject()->_getJSObject()));
                outVal.set(value);
            }
                break;

            case Value::Type::Null:
            {
                JS::RootedValue value(cx);
                value.setNull();
                outVal.set(value);
            }
                break;

            case Value::Type::Undefined:
            {
                JS::RootedValue value(cx);
                value.setUndefined();
                outVal.set(value);
            }
                break;
            default:
                assert(false);
                break;
        }
    }

    void jsToSeValue(JSContext* cx, JS::HandleValue jsval, Value* v)
    {
        if (jsval.isNumber())
        {
            v->setNumber(jsval.toNumber());
        }
        else if (jsval.isString())
        {
            JS::RootedString jsstr(cx, jsval.toString());
            v->setString(jsToStdString(cx, jsstr));
        }
        else if (jsval.isBoolean())
        {
            v->setBoolean(jsval.toBoolean());
        }
        else if (jsval.isObject())
        {
            Object* object = nullptr;

            JS::RootedObject jsobj(cx, jsval.toObjectOrNull());
            void* nativeObj = getPrivate(cx, jsobj);

            if (nativeObj != nullptr)
            {
                object = Object::getObjectWithPtr(nativeObj);
            }

            if (object == nullptr)
            {
                object = Object::_createJSObject(nullptr, jsval.toObjectOrNull());
            }
            v->setObject(object, true);
            object->decRef();
        }
        else if (jsval.isNull())
        {
            v->setNull();
        }
        else if (jsval.isUndefined())
        {
            v->setUndefined();
        }
        else
        {
            assert(false);
        }
    }

    void setReturnValue(JSContext* cx, const Value& data, const JS::CallArgs& argv)
    {
        JS::RootedValue rval(cx);
        seToJsValue(cx, data, &rval);
        argv.rval().set(rval);
    }

    const char* KEY_PRIVATE_DATA = "__cc_private_data";

    bool hasPrivate(JSContext* cx, JS::HandleObject obj)
    {
        bool found = false;
        const JSClass* cls = JS_GetClass(obj);
        found = !!(cls->flags & JSCLASS_HAS_PRIVATE);

        if (!found)
        {
            JS::RootedObject jsobj(cx, obj);
            if (JS_HasProperty(cx, jsobj, KEY_PRIVATE_DATA, &found) && found)
            {
                return true;
            }
        }

        return found;
    }

    void* getPrivate(JSContext* cx, JS::HandleObject obj)
    {
        bool found = false;
        const JSClass* cls = JS_GetClass(obj);
        found = !!(cls->flags & JSCLASS_HAS_PRIVATE);

        if (found)
        {
            return JS_GetPrivate(obj);
        }

        if (JS_HasProperty(cx, obj, KEY_PRIVATE_DATA, &found) && found)
        {
            JS::RootedValue jsData(cx);
            if (JS_GetProperty(cx, obj, KEY_PRIVATE_DATA, &jsData))
            {
                PrivateData* privateData = (PrivateData*)JS_GetPrivate(jsData.toObjectOrNull());
                return privateData->data;
            }
        }

        return nullptr;
    }

    void setPrivate(JSContext* cx, JS::HandleObject obj, void* data, JSFinalizeOp finalizeCb)
    {
        bool found = false;
        const JSClass* jsCls = JS_GetClass(obj);
        found = !!(jsCls->flags & JSCLASS_HAS_PRIVATE);

        if (found)
        {
            JS_SetPrivate(obj, data);
        }
        else
        {
            assert(finalizeCb);
            Object* privateObj = Object::createObjectWithClass(__jsb_CCPrivateData_class);
            PrivateData* privateData = (PrivateData*)malloc(sizeof(PrivateData));
            privateData->data = data;
            privateData->finalizeCb = finalizeCb;
            JS_SetPrivate(privateObj->_getJSObject(), privateData);

            JS::RootedValue privateVal(cx, JS::ObjectValue(*privateObj->_getJSObject()));
            JS_SetProperty(cx, obj, KEY_PRIVATE_DATA, privateVal);
            privateObj->decRef();
        }
    }

    void clearPrivate(JSContext* cx, JS::HandleObject obj)
    {
        bool found = false;
        const JSClass* cls = JS_GetClass(obj);
        found = !!(cls->flags & JSCLASS_HAS_PRIVATE);

        if (found)
        {
            JS_SetPrivate(obj, nullptr);
        }
        else if (JS_HasProperty(cx, obj, KEY_PRIVATE_DATA, &found) && found)
        {
            JS::RootedValue jsData(cx);
            assert(JS_GetProperty(cx, obj, KEY_PRIVATE_DATA, &jsData));

            PrivateData* privateData = (PrivateData*)JS_GetPrivate(jsData.toObjectOrNull());
            free(privateData);
            JS_SetPrivate(jsData.toObjectOrNull(), nullptr);
            bool ok = JS_DeleteProperty(cx, obj, KEY_PRIVATE_DATA);
            assert(ok);
        }
    }

}} // namespace se { namespace internal {

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
