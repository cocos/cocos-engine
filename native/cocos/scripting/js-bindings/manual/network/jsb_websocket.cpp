/*
 * Created by James Chen
 * Copyright (c) 2013-2017 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

#include "scripting/js-bindings/manual/network/jsb_websocket.h"

#include "base/ccUTF8.h"
#include "base/CCDirector.h"
#include "network/WebSocket.h"
#include "platform/CCPlatformMacros.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/manual/spidermonkey_specifics.h"

using namespace cocos2d;
using namespace cocos2d::network;

/*
 [Constructor(in DOMString url, in optional DOMString protocols)]
 [Constructor(in DOMString url, in optional DOMString[] protocols)]
 interface WebSocket {
 readonly attribute DOMString url;

 // ready state
 const unsigned short CONNECTING = 0;
 const unsigned short OPEN = 1;
 const unsigned short CLOSING = 2;
 const unsigned short CLOSED = 3;
 readonly attribute unsigned short readyState;
 readonly attribute unsigned long bufferedAmount;

 // networking
 attribute Function onopen;
 attribute Function onmessage;
 attribute Function onerror;
 attribute Function onclose;
 readonly attribute DOMString protocol;
 void send(in DOMString data);
 void close();
 };
 WebSocket implements EventTarget;
 */

class JSB_WebSocketDelegate : public Ref, public WebSocket::Delegate
{
public:

    JSB_WebSocketDelegate()
    {
    }

private:
    virtual ~JSB_WebSocketDelegate()
    {
    }

public:
    virtual void onOpen(WebSocket* ws)
    {
        js_proxy_t * p = jsb_get_native_proxy(ws);
        if (!p) return;

        if (cocos2d::Director::getInstance() == nullptr || cocos2d::ScriptEngineManager::getInstance() == nullptr)
            return;

        JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();

        // Set the protocol which server selects.
        JS::RootedValue jsprotocol(cx);
        std_string_to_jsval(cx, ws->getProtocol(), &jsprotocol);
        JS::RootedObject wsObj(cx, p->obj);
        JS_SetProperty(cx, wsObj, "protocol", jsprotocol);

        JS::RootedObject jsobj(cx, JS_NewPlainObject(cx));
        JS::RootedValue vp(cx);
        c_string_to_jsval(cx, "open", &vp);
        JS_SetProperty(cx, jsobj, "type", vp);
        
        JS::RootedValue jsobjVal(cx, JS::ObjectOrNullValue(jsobj));
        JS::HandleValueArray args(jsobjVal);
        JS::RootedValue owner(cx, JS::ObjectOrNullValue(_JSDelegate));

        ScriptingCore::getInstance()->executeFunctionWithOwner(owner, "onopen", args);
    }

    virtual void onMessage(WebSocket* ws, const WebSocket::Data& data)
    {
        js_proxy_t * p = jsb_get_native_proxy(ws);
        if (p == nullptr) return;

        if (cocos2d::Director::getInstance() == nullptr || cocos2d::ScriptEngineManager::getInstance() == nullptr)
            return;

        JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedObject jsobj(cx, JS_NewPlainObject(cx));
        JS::RootedValue vp(cx);
        c_string_to_jsval(cx, "message", &vp);
        JS_SetProperty(cx, jsobj, "type", vp);

        JS::RootedValue arg(cx, JS::ObjectOrNullValue(jsobj));
        bool flag;
        if (data.isBinary)
        {// data is binary
            JS::RootedObject buffer(cx, JS_NewArrayBuffer(cx, static_cast<uint32_t>(data.len)));
            if (data.len > 0)
            {
                uint8_t* bufdata = JS_GetArrayBufferData(buffer, &flag, JS::AutoCheckCannotGC());
                memcpy((void*)bufdata, (void*)data.bytes, data.len);
            }
            JS::RootedValue dataVal(cx, JS::ObjectOrNullValue(buffer));
            JS_SetProperty(cx, jsobj, "data", dataVal);
        }
        else
        {// data is string
            JS::RootedValue dataVal(cx);
            if (strlen(data.bytes) == 0 && data.len > 0)
            {// String with 0x00 prefix
                dataVal = JS::StringValue(JS_NewStringCopyN(cx, data.bytes, data.len));
            }
            else
            {// Normal string
                c_string_to_jsval(cx, data.bytes, &dataVal);
            }
            if (dataVal.isNullOrUndefined())
            {
                ws->closeAsync();
                return;
            }
            JS_SetProperty(cx, jsobj, "data", dataVal);
        }

        JS::RootedValue delegate(cx, JS::ObjectOrNullValue(_JSDelegate));
        JS::HandleValueArray args(arg);
        ScriptingCore::getInstance()->executeFunctionWithOwner(delegate, "onmessage", args);
    }

    virtual void onClose(WebSocket* ws)
    {
        js_proxy_t * p = jsb_get_native_proxy(ws);
        if (p != nullptr)
        {
            if (cocos2d::Director::getInstance() != nullptr && cocos2d::Director::getInstance()->getRunningScene() && cocos2d::ScriptEngineManager::getInstance() != nullptr)
            {
                JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();
                JS::RootedObject jsobj(cx, JS_NewPlainObject(cx));
                JS::RootedValue vp(cx);
                c_string_to_jsval(cx, "close", &vp);
                JS_SetProperty(cx, jsobj, "type", vp);
                
                JS::RootedValue delegate(cx, JS::ObjectOrNullValue(_JSDelegate));
                JS::RootedValue arg(cx, JS::ObjectOrNullValue(jsobj));
                JS::HandleValueArray args(arg);
                ScriptingCore::getInstance()->executeFunctionWithOwner(delegate, "onclose", args);
            }
            JS_SetPrivate(p->obj, nullptr);
        }
        ws->release();
        release(); // Release delegate self at last
    }

    virtual void onError(WebSocket* ws, const WebSocket::ErrorCode& error)
    {
        js_proxy_t * p = jsb_get_native_proxy(ws);
        if (!p) return;

        if (cocos2d::Director::getInstance() == nullptr || cocos2d::ScriptEngineManager::getInstance() == nullptr)
            return;

        JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedObject jsobj(cx, JS_NewPlainObject(cx));
        JS::RootedValue vp(cx);
        c_string_to_jsval(cx, "error", &vp);
        JS_SetProperty(cx, jsobj, "type", vp);
        
        JS::RootedValue delegate(cx, JS::ObjectOrNullValue(_JSDelegate));
        JS::RootedValue arg(cx, JS::ObjectOrNullValue(jsobj));
        JS::HandleValueArray args(arg);
        ScriptingCore::getInstance()->executeFunctionWithOwner(delegate, "onerror", args);
    }

    void setJSDelegate(JS::HandleObject pJSDelegate)
    {
        _JSDelegate = pJSDelegate;
    }
private:
    JS::PersistentRootedObject _JSDelegate;
};

JSClass  *js_cocos2dx_websocket_class;
JSObject *js_cocos2dx_websocket_prototype;

void js_cocos2dx_WebSocket_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOG("jsbindings: finalizing JS object %p (WebSocket)", obj);
    WebSocket *cobj = static_cast<WebSocket *>(JS_GetPrivate(obj));
    if (cobj)
    {
        js_proxy_t * p = jsb_get_native_proxy(cobj);
        if (p)
        {
#if not CC_ENABLE_GC_FOR_NATIVE_OBJECTS
            auto copy = &p->obj;
            JS::RemoveObjectRoot(cx, copy);
#endif
            jsb_remove_proxy(p);
        }
        
        ScriptingCore::getInstance()->setFinalizing(true);
        // Manually close if WebSocket is not closed
        if (cobj->getReadyState() != WebSocket::State::CLOSED)
        {
            cobj->closeAsync();
        }
        static_cast<JSB_WebSocketDelegate*>(cobj->getDelegate())->release();
        cobj->release();
        ScriptingCore::getInstance()->setFinalizing(false);
    }
}

bool js_cocos2dx_extension_WebSocket_send(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs argv = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, argv.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    WebSocket* cobj = (WebSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if(argc == 1)
    {
        if (argv[0].isString())
        {
            ssize_t len = JS_GetStringLength(argv[0].toString());
            std::string data;
            jsval_to_std_string(cx, argv[0], &data);

            if (data.empty() && len > 0)
            {
                CCLOGWARN("Text message to send is empty, but its length is greater than 0!");
                //FIXME: Note that this text message contains '0x00' prefix, so its length calcuted by strlen is 0.
                // we need to fix that if there is '0x00' in text message,
                // since javascript language could support '0x00' inserted at the beginning or the middle of text message
            }

            cobj->send(data);
        }
        else if (argv[0].isObject())
        {
            uint8_t *bufdata = NULL;
            uint32_t len = 0;

            JS::RootedObject jsobj(cx, argv[0].toObjectOrNull());
            bool flag;
            if (JS_IsArrayBufferObject(jsobj))
            {
                bufdata = JS_GetArrayBufferData(jsobj, &flag, JS::AutoCheckCannotGC());
                len = JS_GetArrayBufferByteLength(jsobj);
            }
            else if (JS_IsArrayBufferViewObject(jsobj))
            {
                bufdata = (uint8_t*)JS_GetArrayBufferViewData(jsobj, &flag, JS::AutoCheckCannotGC());
                len = JS_GetArrayBufferViewByteLength(jsobj);
            }

            cobj->send(bufdata, len);
        }
        else
        {
            JS_ReportErrorUTF8(cx, "data type to be sent is unsupported.");
            return false;
        }

        argv.rval().setUndefined();

        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return true;
}

bool js_cocos2dx_extension_WebSocket_close(JSContext *cx, uint32_t argc, JS::Value *vp){
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    WebSocket* cobj = (WebSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if(argc == 0){
        cobj->closeAsync();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_extension_WebSocket_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    if (argc == 1 || argc == 2 || argc == 3)
    {
        std::string url;

        do {
            bool ok = jsval_to_std_string(cx, args.get(0), &url);
            JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        } while (0);

        JS::RootedObject proto(cx, js_cocos2dx_websocket_prototype);
        JS::RootedObject obj(cx, JS_NewObjectWithGivenProto(cx, js_cocos2dx_websocket_class, proto));
        js_add_FinalizeHook(cx, obj, false);

        WebSocket* cobj = nullptr;
        if (argc >= 2)
        {
            std::string caFilePath;
            std::vector<std::string> protocols;

            if (args.get(1).isString())
            {
                std::string protocol;
                do {
                    bool ok = jsval_to_std_string(cx, args.get(1), &protocol);
                    JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
                } while (0);
                protocols.push_back(protocol);
            }
            else if (args.get(1).isObject())
            {
                bool ok = true;
                JS::RootedObject arg2(cx, args.get(1).toObjectOrNull());
                JS_IsArrayObject(cx, arg2, &ok);
                JSB_PRECONDITION(ok, "Object must be an array");

                uint32_t len = 0;
                JS_GetArrayLength(cx, arg2, &len);

                for (uint32_t i = 0; i< len; i++)
                {
                    JS::RootedValue valarg(cx);
                    JS_GetElement(cx, arg2, i, &valarg);
                    std::string protocol;
                    do {
                        ok = jsval_to_std_string(cx, valarg, &protocol);
                        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
                    } while (0);

                    protocols.push_back(protocol);
                }
            }

            if (argc > 2)
            {
                do {
                    bool ok = jsval_to_std_string(cx, args.get(2), &caFilePath);
                    JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
                } while (0);
            }

            cobj = new (std::nothrow) WebSocket();
            JSB_WebSocketDelegate* delegate = new (std::nothrow) JSB_WebSocketDelegate();
            if (cobj->init(*delegate, url, &protocols, caFilePath))
            {
                delegate->setJSDelegate(obj);
                cobj->retain(); // release in finalize function and onClose delegate method
                delegate->retain(); // release in finalize function and onClose delegate method
            }
            else
            {
                cobj->release();
                delegate->release();
                JS_ReportErrorUTF8(cx, "WebSocket init failed!");
                return false;
            }
        }
        else
        {
            cobj = new (std::nothrow) WebSocket();
            JSB_WebSocketDelegate* delegate = new (std::nothrow) JSB_WebSocketDelegate();

            delegate->setJSDelegate(obj);
            if (cobj->init(*delegate, url))
            {
                delegate->setJSDelegate(obj);
                cobj->retain(); // release in finalize function and onClose delegate method
                delegate->retain(); // release in finalize function and onClose delegate method
            }
            else
            {
                cobj->release();
                delegate->release();
                JS_ReportErrorUTF8(cx, "WebSocket init failed!");
                return false;
            }
        }

        JS_DefineProperty(cx, obj, "url", args.get(0), JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);

        // The websocket draft uses lowercase 'url', so 'URL' need to be deprecated.
        JS_DefineProperty(cx, obj, "URL", args.get(0), JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);

        // Initialize protocol property with an empty string, it will be assigned in onOpen delegate.
        JS::RootedValue jsprotocol(cx);
        c_string_to_jsval(cx, "", &jsprotocol);
        JS_DefineProperty(cx, obj, "protocol", jsprotocol, JSPROP_ENUMERATE | JSPROP_PERMANENT);

        // link the native object with the javascript object
        jsb_new_proxy(cx, cobj, obj);
        JS_SetPrivate(obj.get(), cobj);
#if not CC_ENABLE_GC_FOR_NATIVE_OBJECTS
//        JS::AddNamedObjectRoot(cx, &p->obj, "WebSocket");
#endif
        args.rval().set(JS::ObjectOrNullValue(obj));
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

static bool js_cocos2dx_extension_WebSocket_get_readyState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsobj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsobj);
    WebSocket* cobj = (WebSocket *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if (cobj) {
        args.rval().set(JS::Int32Value((int)cobj->getReadyState()));
        return true;
    } else {
        JS_ReportErrorUTF8(cx, "Error: WebSocket instance is invalid.");
        return false;
    }
}

void register_jsb_websocket(JSContext *cx, JS::HandleObject global)
{
    static const JSClassOps websocket_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_cocos2dx_WebSocket_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    
    static JSClass websocket_class = {
        "WebSocket",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &websocket_classOps
    };
    js_cocos2dx_websocket_class = &websocket_class;

    static JSPropertySpec properties[] = {
        JS_PSG("readyState", js_cocos2dx_extension_WebSocket_get_readyState, JSPROP_ENUMERATE | JSPROP_PERMANENT),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("send",js_cocos2dx_extension_WebSocket_send, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("close",js_cocos2dx_extension_WebSocket_close, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, nullptr);
    js_cocos2dx_websocket_prototype = JS_InitClass(
                                                cx, global,
                                                parent_proto,
                                                js_cocos2dx_websocket_class,
                                                js_cocos2dx_extension_WebSocket_constructor, 0, // constructor
                                                properties,
                                                funcs,
                                                nullptr, // no static properties
                                                nullptr);

    JS::RootedValue jsclassVal(cx);
    bool ok = anonEvaluate(cx, global, "(function () { return WebSocket; })()", &jsclassVal);
    if (ok)
    {
        JS::RootedObject jsclassObj(cx, jsclassVal.toObjectOrNull());
        JS_DefineProperty(cx, jsclassObj, "CONNECTING", (int)WebSocket::State::CONNECTING, JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);
        JS_DefineProperty(cx, jsclassObj, "OPEN", (int)WebSocket::State::OPEN, JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);
        JS_DefineProperty(cx, jsclassObj, "CLOSING", (int)WebSocket::State::CLOSING, JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);
        JS_DefineProperty(cx, jsclassObj, "CLOSED", (int)WebSocket::State::CLOSED, JSPROP_ENUMERATE | JSPROP_PERMANENT | JSPROP_READONLY);
    }
}
