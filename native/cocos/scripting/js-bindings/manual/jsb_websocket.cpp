/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
#include "base/ccConfig.h"
#include "jsb_websocket.hpp"
#if (USE_NET_WORK > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"

#include "base/ccUTF8.h"
#include "platform/CCApplication.h"

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

se::Class* __jsb_WebSocket_class = nullptr;

JSB_WebSocketDelegate::JSB_WebSocketDelegate()
{
}

JSB_WebSocketDelegate::~JSB_WebSocketDelegate()
{
    CCLOGINFO("In the destructor of JSB_WebSocketDelegate(%p)", this);
}

void JSB_WebSocketDelegate::onOpen(WebSocket* ws)
{
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    if (cocos2d::Application::getInstance() == nullptr)
        return;

    auto iter = se::NativePtrToObjectMap::find(ws);
    if (iter == se::NativePtrToObjectMap::end())
        return;

    se::Object* wsObj = iter->second;
    wsObj->setProperty("protocol", se::Value(ws->getProtocol()));

    se::HandleObject jsObj(se::Object::createPlainObject());
    jsObj->setProperty("type", se::Value("open"));
    se::Value target;
    native_ptr_to_seval<WebSocket>(ws, &target);
    jsObj->setProperty("target", target);

    se::Value func;
    bool ok = _JSDelegate.toObject()->getProperty("onopen", &func);
    if (ok && func.isObject() && func.toObject()->isFunction())
    {
        se::ValueArray args;
        args.push_back(se::Value(jsObj));
        func.toObject()->call(args, wsObj);
    }
    else
    {
        SE_REPORT_ERROR("Can't get onopen function!");
    }
}

void JSB_WebSocketDelegate::onMessage(WebSocket* ws, const WebSocket::Data& data)
{
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    if (cocos2d::Application::getInstance() == nullptr)
        return;

    auto iter = se::NativePtrToObjectMap::find(ws);
    if (iter == se::NativePtrToObjectMap::end())
        return;

    se::Object* wsObj = iter->second;
    se::HandleObject jsObj(se::Object::createPlainObject());
    jsObj->setProperty("type", se::Value("message"));
    se::Value target;
    native_ptr_to_seval<WebSocket>(ws, &target);
    jsObj->setProperty("target", target);

    se::Value func;
    bool ok = _JSDelegate.toObject()->getProperty("onmessage", &func);
    if (ok && func.isObject() && func.toObject()->isFunction())
    {
        se::ValueArray args;
        args.push_back(se::Value(jsObj));

        if (data.isBinary)
        {
            se::HandleObject dataObj(se::Object::createArrayBufferObject(data.bytes, data.len));
            jsObj->setProperty("data", se::Value(dataObj));
        }
        else
        {
            se::Value dataVal;
            if (strlen(data.bytes) == 0 && data.len > 0)
            {// String with 0x00 prefix
                std::string str(data.bytes, data.len);
                dataVal.setString(str);
            }
            else
            {// Normal string
                dataVal.setString(data.bytes);
            }

            if (dataVal.isNullOrUndefined())
            {
                ws->closeAsync();
            }
            else
            {
                jsObj->setProperty("data", se::Value(dataVal));
            }
        }

        func.toObject()->call(args, wsObj);
    }
    else
    {
        SE_REPORT_ERROR("Can't get onmessage function!");
    }
}

void JSB_WebSocketDelegate::onClose(WebSocket* ws)
{
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    if (cocos2d::Application::getInstance() == nullptr)
        return;

    auto iter = se::NativePtrToObjectMap::find(ws);
    do
    {
        if (iter == se::NativePtrToObjectMap::end())
        {
            CCLOGINFO("WebSocket js instance was destroyted, don't need to invoke onclose callback!");
            break;
        }

        se::Object* wsObj = iter->second;
        se::HandleObject jsObj(se::Object::createPlainObject());
        jsObj->setProperty("type", se::Value("close"));
        se::Value target;
        native_ptr_to_seval<WebSocket>(ws, &target);
        jsObj->setProperty("target", target);

        se::Value func;
        bool ok = _JSDelegate.toObject()->getProperty("onclose", &func);
        if (ok && func.isObject() && func.toObject()->isFunction())
        {
            se::ValueArray args;
            args.push_back(se::Value(jsObj));
            func.toObject()->call(args, wsObj);
        }
        else
        {
            SE_REPORT_ERROR("Can't get onclose function!");
        }

        // Websocket instance is attached to global object in 'WebSocket_close'
        // It's safe to detach it here since JS 'onclose' method has been already invoked.
        se::ScriptEngine::getInstance()->getGlobalObject()->detachObject(wsObj);

    } while(false);

    ws->release();
    release(); // Release delegate self at last
}

void JSB_WebSocketDelegate::onError(WebSocket* ws, const WebSocket::ErrorCode& error)
{
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    if (cocos2d::Application::getInstance() == nullptr)
        return;

    auto iter = se::NativePtrToObjectMap::find(ws);
    if (iter == se::NativePtrToObjectMap::end())
        return;

    se::Object* wsObj = iter->second;
    se::HandleObject jsObj(se::Object::createPlainObject());
    jsObj->setProperty("type", se::Value("error"));
    se::Value target;
    native_ptr_to_seval<WebSocket>(ws, &target);
    jsObj->setProperty("target", target);

    se::Value func;
    bool ok = _JSDelegate.toObject()->getProperty("onerror", &func);
    if (ok && func.isObject() && func.toObject()->isFunction())
    {
        se::ValueArray args;
        args.push_back(se::Value(jsObj));
        func.toObject()->call(args, wsObj);
    }
    else
    {
        SE_REPORT_ERROR("Can't get onerror function!");
    }
}

void JSB_WebSocketDelegate::setJSDelegate(const se::Value& jsDelegate)
{
    assert(jsDelegate.isObject());
    _JSDelegate = jsDelegate;
}

static bool WebSocket_finalize(se::State& s)
{
    WebSocket* cobj = (WebSocket*)s.nativeThisObject();
    CCLOGINFO("jsbindings: finalizing JS object %p (WebSocket)", cobj);

    // Manually close if web socket is not closed
    if (cobj->getReadyState() != WebSocket::State::CLOSED)
    {
        CCLOGINFO("WebSocket (%p) isn't closed, try to close it!", cobj);
        cobj->closeAsync();
    }

    static_cast<JSB_WebSocketDelegate*>(cobj->getDelegate())->release();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(WebSocket_finalize)

static bool WebSocket_constructor(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 1 || argc == 2 || argc == 3)
    {
        std::string url;

        bool ok = seval_to_std_string(args[0], &url);
        SE_PRECONDITION2(ok, false, "Error processing url argument");

        se::Object* obj = s.thisObject();
        WebSocket* cobj = nullptr;
        if (argc >= 2)
        {
            std::string caFilePath;
            std::vector<std::string> protocols;

            if (args[1].isString())
            {
                std::string protocol;
                ok = seval_to_std_string(args[1], &protocol);
                SE_PRECONDITION2(ok, false, "Error processing protocol string");
                protocols.push_back(protocol);
            }
            else if (args[1].isObject() && args[1].toObject()->isArray())
            {
                se::Object* protocolArr = args[1].toObject();
                uint32_t len = 0;
                ok = protocolArr->getArrayLength(&len);
                SE_PRECONDITION2(ok, false, "getArrayLength failed!");

                se::Value tmp;
                for (uint32_t i=0; i < len; ++i)
                {
                    if (!protocolArr->getArrayElement(i, &tmp))
                        continue;

                    std::string protocol;
                    ok = seval_to_std_string(tmp, &protocol);
                    SE_PRECONDITION2(ok, false, "Error processing protocol object");
                    protocols.push_back(protocol);
                }
            }

            if (argc > 2)
            {
                ok = seval_to_std_string(args[2], &caFilePath);
                SE_PRECONDITION2(ok, false, "Error processing caFilePath");
            }

            cobj = new (std::nothrow) WebSocket();
            JSB_WebSocketDelegate* delegate = new (std::nothrow) JSB_WebSocketDelegate();
            if (cobj->init(*delegate, url, &protocols, caFilePath))
            {
                delegate->setJSDelegate(se::Value(obj));
                cobj->retain(); // release in finalize function and onClose delegate method
                delegate->retain(); // release in finalize function and onClose delegate method
            }
            else
            {
                cobj->release();
                delegate->release();
                SE_REPORT_ERROR("WebSocket init failed!");
                return false;
            }
        }
        else
        {
            cobj = new (std::nothrow) WebSocket();
            JSB_WebSocketDelegate* delegate = new (std::nothrow) JSB_WebSocketDelegate();
            if (cobj->init(*delegate, url))
            {
                delegate->setJSDelegate(se::Value(obj));
                cobj->retain(); // release in finalize function and onClose delegate method
                delegate->retain(); // release in finalize function and onClose delegate method
            }
            else
            {
                cobj->release();
                delegate->release();
                SE_REPORT_ERROR("WebSocket init failed!");
                return false;
            }
        }

        obj->setProperty("url", args[0]);

        // The websocket draft uses lowercase 'url', so 'URL' need to be deprecated.
        obj->setProperty("URL", args[0]);

        // Initialize protocol property with an empty string, it will be assigned in onOpen delegate.
        obj->setProperty("protocol", se::Value(""));

        obj->setPrivateData(cobj);

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1<= and <=3", argc);
    return false;
}
SE_BIND_CTOR(WebSocket_constructor, __jsb_WebSocket_class, WebSocket_finalize)

static bool WebSocket_send(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 1)
    {
        WebSocket* cobj = (WebSocket*)s.nativeThisObject();
        bool ok = false;
        if (args[0].isString())
        {
            std::string data;
            ok = seval_to_std_string(args[0], &data);
            SE_PRECONDITION2(ok, false, "Convert string failed");
//IDEA: We didn't find a way to get the JS string length in JSB2.0.
//            if (data.empty() && len > 0)
//            {
//                CCLOGWARN("Text message to send is empty, but its length is greater than 0!");
//                //IDEA: Note that this text message contains '0x00' prefix, so its length calcuted by strlen is 0.
//                // we need to fix that if there is '0x00' in text message,
//                // since javascript language could support '0x00' inserted at the beginning or the middle of text message
//            }

            cobj->send(data);
        }
        else if (args[0].isObject())
        {
            se::Object* dataObj = args[0].toObject();
            uint8_t* ptr = nullptr;
            size_t length = 0;
            if (dataObj->isArrayBuffer())
            {
                ok = dataObj->getArrayBufferData(&ptr, &length);
                SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
            }
            else if (dataObj->isTypedArray())
            {
                ok = dataObj->getTypedArrayData(&ptr, &length);
                SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
            }
            else
            {
                assert(false);
            }

            cobj->send(ptr, (unsigned int)length);
        }
        else
        {
            assert(false);
        }

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1", argc);
    return false;
}
SE_BIND_FUNC(WebSocket_send)

static bool WebSocket_close(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    WebSocket* cobj = (WebSocket*)s.nativeThisObject();
    if(argc == 0)
    {
        cobj->closeAsync();
    }
    else if (argc == 1)
    {
        if (args[0].isNumber())
        {
            int reason;
            seval_to_int32(args[0], &reason);
            cobj->closeAsync(reason, "no_reason");
        }
        else if (args[0].isString())
        {
            std::string reason;
            seval_to_std_string(args[0], &reason);
            cobj->closeAsync(1005, reason);
        }
        else
        {
            assert(false);
        }
    }
    else if (argc == 2)
    {
        assert(args[0].isNumber());
        assert(args[1].isString());
        int reasonCode;
        std::string reasonString;
        seval_to_int32(args[0], &reasonCode);
        seval_to_std_string(args[1], &reasonString);
        cobj->closeAsync(reasonCode, reasonString);
    }
    else 
    {
        assert(false);
    }
    // Attach current WebSocket instance to global object to prevent WebSocket instance
    // being garbage collected after "ws.close(); ws = null;"
    // There is a state that current WebSocket JS instance is being garbaged but its finalize
    // callback has not be invoked. Then in "JSB_WebSocketDelegate::onClose", se::Object is
    // still be able to be found and while invoking JS 'onclose' method, crash will happen since
    // JS instance is invalid and is going to be collected. This bug is easiler reproduced on iOS
    // because JavaScriptCore is more GC sensitive.
    // Please note that we need to detach it from global object in "JSB_WebSocketDelegate::onClose".
    se::ScriptEngine::getInstance()->getGlobalObject()->attachObject(s.thisObject());
    return true;
}
SE_BIND_FUNC(WebSocket_close)

static bool WebSocket_getReadyState(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 0)
    {
        WebSocket* cobj = (WebSocket*)s.nativeThisObject();
        s.rval().setInt32((int)cobj->getReadyState());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_PROP_GET(WebSocket_getReadyState)

static bool WebSocket_getBufferedAmount(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 0)
    {
        WebSocket* cobj = (WebSocket*)s.nativeThisObject();
        s.rval().setUint32((uint32_t)cobj->getBufferedAmount());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_PROP_GET(WebSocket_getBufferedAmount)

static bool WebSocket_getExtensions(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 0)
    {
        WebSocket* cobj = (WebSocket*)s.nativeThisObject();
        s.rval().setString(cobj->getExtensions());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_PROP_GET(WebSocket_getExtensions)


bool register_all_websocket(se::Object* obj)
{
    se::Class* cls = se::Class::create("WebSocket", obj, nullptr, _SE(WebSocket_constructor));
    cls->defineFinalizeFunction(_SE(WebSocket_finalize));

    cls->defineFunction("send", _SE(WebSocket_send));
    cls->defineFunction("close", _SE(WebSocket_close));
    cls->defineProperty("readyState", _SE(WebSocket_getReadyState), nullptr);
    cls->defineProperty("bufferedAmount", _SE(WebSocket_getBufferedAmount), nullptr);
    cls->defineProperty("extensions", _SE(WebSocket_getExtensions), nullptr);

    cls->install();

    se::Value tmp;
    obj->getProperty("WebSocket", &tmp);
    tmp.toObject()->setProperty("CONNECTING", se::Value((int)WebSocket::State::CONNECTING));
    tmp.toObject()->setProperty("OPEN", se::Value((int)WebSocket::State::OPEN));
    tmp.toObject()->setProperty("CLOSING", se::Value((int)WebSocket::State::CLOSING));
    tmp.toObject()->setProperty("CLOSED", se::Value((int)WebSocket::State::CLOSED));

    JSBClassType::registerClass<WebSocket>(cls);

    __jsb_WebSocket_class = cls;

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
#endif //#if (USE_NET_WORK > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
