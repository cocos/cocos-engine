/****************************************************************************
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "jsb_websocket.h"
#include "base/Config.h"
#if (USE_SOCKET > 0)
    #include "cocos/bindings/jswrapper/SeApi.h"
    #include "cocos/bindings/manual/jsb_conversions.h"
    #include "cocos/bindings/manual/jsb_global.h"

    #include "base/UTF8.h"
    #include "application/ApplicationManager.h"

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

namespace {
se::Class *jsbWebSocketClass = nullptr;
}

JsbWebSocketDelegate::~JsbWebSocketDelegate() {
    CC_LOG_INFO("In the destructor of JSbWebSocketDelegate(%p)", this);
}

void JsbWebSocketDelegate::onOpen(cc::network::WebSocket *ws) {
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    if (CC_CURRENT_APPLICATION() == nullptr) {
        return;
    }

    auto iter = se::NativePtrToObjectMap::find(ws);
    if (iter == se::NativePtrToObjectMap::end()) {
        return;
    }

    se::Object *wsObj = iter->second;
    wsObj->setProperty("protocol", se::Value(ws->getProtocol()));

    se::HandleObject jsObj(se::Object::createPlainObject());
    jsObj->setProperty("type", se::Value("open"));
    se::Value target;
    native_ptr_to_seval<cc::network::WebSocket>(ws, &target);
    jsObj->setProperty("target", target);

    se::Value func;
    bool      ok = _JSDelegate.toObject()->getProperty("onopen", &func);
    if (ok && func.isObject() && func.toObject()->isFunction()) {
        se::ValueArray args;
        args.push_back(se::Value(jsObj));
        func.toObject()->call(args, wsObj);
    } else {
        SE_REPORT_ERROR("Can't get onopen function!");
    }
}

void JsbWebSocketDelegate::onMessage(cc::network::WebSocket *ws, const cc::network::WebSocket::Data &data) {
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    if (CC_CURRENT_APPLICATION() == nullptr) {
        return;
    }

    auto iter = se::NativePtrToObjectMap::find(ws);
    if (iter == se::NativePtrToObjectMap::end()) {
        return;
    }

    se::Object *     wsObj = iter->second;
    se::HandleObject jsObj(se::Object::createPlainObject());
    jsObj->setProperty("type", se::Value("message"));
    se::Value target;
    native_ptr_to_seval<cc::network::WebSocket>(ws, &target);
    jsObj->setProperty("target", target);

    se::Value func;
    bool      ok = _JSDelegate.toObject()->getProperty("onmessage", &func);
    if (ok && func.isObject() && func.toObject()->isFunction()) {
        se::ValueArray args;
        args.push_back(se::Value(jsObj));

        if (data.isBinary) {
            se::HandleObject dataObj(se::Object::createArrayBufferObject(data.bytes, data.len));
            jsObj->setProperty("data", se::Value(dataObj));
        } else {
            se::Value dataVal;
            if (strlen(data.bytes) == 0 && data.len > 0) { // String with 0x00 prefix
                std::string str(data.bytes, data.len);
                dataVal.setString(str);
            } else { // Normal string
                dataVal.setString(std::string(data.bytes, data.len));
            }

            if (dataVal.isNullOrUndefined()) {
                ws->closeAsync();
            } else {
                jsObj->setProperty("data", se::Value(dataVal));
            }
        }

        func.toObject()->call(args, wsObj);
    } else {
        SE_REPORT_ERROR("Can't get onmessage function!");
    }
}

void JsbWebSocketDelegate::onClose(cc::network::WebSocket *ws) {
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    if (CC_CURRENT_APPLICATION() == nullptr) {
        return;
    }

    auto iter = se::NativePtrToObjectMap::find(ws);
    do {
        if (iter == se::NativePtrToObjectMap::end()) {
            CC_LOG_INFO("WebSocket js instance was destroyted, don't need to invoke onclose callback!");
            break;
        }

        se::Object *     wsObj = iter->second;
        se::HandleObject jsObj(se::Object::createPlainObject());
        jsObj->setProperty("type", se::Value("close"));
        se::Value target;
        native_ptr_to_seval<cc::network::WebSocket>(ws, &target);
        jsObj->setProperty("target", target);

        se::Value func;
        bool      ok = _JSDelegate.toObject()->getProperty("onclose", &func);
        if (ok && func.isObject() && func.toObject()->isFunction()) {
            se::ValueArray args;
            args.push_back(se::Value(jsObj));
            func.toObject()->call(args, wsObj);
        } else {
            SE_REPORT_ERROR("Can't get onclose function!");
        }

        //JS Websocket object now can be GC, since the connection is closed.
        wsObj->unroot();

        // Websocket instance is attached to global object in 'WebSocket_close'
        // It's safe to detach it here since JS 'onclose' method has been already invoked.
        se::ScriptEngine::getInstance()->getGlobalObject()->detachObject(wsObj);

    } while (false);

    ws->release();
    release(); // Release delegate self at last
}

void JsbWebSocketDelegate::onError(cc::network::WebSocket *ws, const cc::network::WebSocket::ErrorCode & /*error*/) {
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    if (CC_CURRENT_APPLICATION() == nullptr) {
        return;
    }

    auto iter = se::NativePtrToObjectMap::find(ws);
    if (iter == se::NativePtrToObjectMap::end()) {
        return;
    }

    se::Object *     wsObj = iter->second;
    se::HandleObject jsObj(se::Object::createPlainObject());
    jsObj->setProperty("type", se::Value("error"));
    se::Value target;
    native_ptr_to_seval<cc::network::WebSocket>(ws, &target);
    jsObj->setProperty("target", target);

    se::Value func;
    bool      ok = _JSDelegate.toObject()->getProperty("onerror", &func);
    if (ok && func.isObject() && func.toObject()->isFunction()) {
        se::ValueArray args;
        args.push_back(se::Value(jsObj));
        func.toObject()->call(args, wsObj);
    } else {
        SE_REPORT_ERROR("Can't get onerror function!");
    }

    wsObj->unroot();
}

void JsbWebSocketDelegate::setJSDelegate(const se::Value &jsDelegate) {
    assert(jsDelegate.isObject());
    _JSDelegate = jsDelegate;
}

static bool webSocketFinalize(const se::State &s) {
    auto *cobj = static_cast<cc::network::WebSocket *>(s.nativeThisObject());
    CC_LOG_INFO("jsbindings: finalizing JS object %p (WebSocket)", cobj);

    // Manually close if web socket is not closed
    if (cobj->getReadyState() != cc::network::WebSocket::State::CLOSED) {
        CC_LOG_INFO("WebSocket (%p) isn't closed, try to close it!", cobj);
        cobj->closeAsync();
    }

    static_cast<JsbWebSocketDelegate *>(cobj->getDelegate())->release();
    if (cobj->getReferenceCount() == 1) {
        cobj->autorelease();
    } else {
        cobj->release();
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(webSocketFinalize)

static bool webSocketConstructor(se::State &s) {
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());

    if (argc == 1 || argc == 2 || argc == 3) {
        std::string url;

        bool ok = seval_to_std_string(args[0], &url);
        SE_PRECONDITION2(ok, false, "Error processing url argument");

        se::Object *            obj  = s.thisObject();
        cc::network::WebSocket *cobj = nullptr;
        if (argc >= 2) {
            std::string              caFilePath;
            std::vector<std::string> protocols;

            if (args[1].isString()) {
                std::string protocol;
                ok = seval_to_std_string(args[1], &protocol);
                SE_PRECONDITION2(ok, false, "Error processing protocol string");
                protocols.push_back(protocol);
            } else if (args[1].isObject() && args[1].toObject()->isArray()) {
                se::Object *protocolArr = args[1].toObject();
                uint32_t    len         = 0;
                ok                      = protocolArr->getArrayLength(&len);
                SE_PRECONDITION2(ok, false, "getArrayLength failed!");

                se::Value tmp;
                for (uint32_t i = 0; i < len; ++i) {
                    if (!protocolArr->getArrayElement(i, &tmp)) {
                        continue;
                    }

                    std::string protocol;
                    ok = seval_to_std_string(tmp, &protocol);
                    SE_PRECONDITION2(ok, false, "Error processing protocol object");
                    protocols.push_back(protocol);
                }
            }

            if (argc > 2) {
                ok = seval_to_std_string(args[2], &caFilePath);
                SE_PRECONDITION2(ok, false, "Error processing caFilePath");
            }

            cobj           = new (std::nothrow) cc::network::WebSocket();
            auto *delegate = new (std::nothrow) JsbWebSocketDelegate();
            if (cobj->init(*delegate, url, &protocols, caFilePath)) {
                delegate->setJSDelegate(se::Value(obj, true));
                cobj->retain();     // release in finalize function and onClose delegate method
                delegate->retain(); // release in finalize function and onClose delegate method
            } else {
                cobj->release();
                delegate->release();
                SE_REPORT_ERROR("WebSocket init failed!");
                return false;
            }
        } else {
            cobj           = new (std::nothrow) cc::network::WebSocket();
            auto *delegate = new (std::nothrow) JsbWebSocketDelegate();
            if (cobj->init(*delegate, url)) {
                delegate->setJSDelegate(se::Value(obj, true));
                cobj->retain();     // release in finalize function and onClose delegate method
                delegate->retain(); // release in finalize function and onClose delegate method
            } else {
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

        obj->root();

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1<= and <=3", argc);
    return false;
}
SE_BIND_CTOR(webSocketConstructor, jsbWebSocketClass, webSocketFinalize)

static bool webSocketSend(const se::State &s) {
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());

    if (argc == 1) {
        auto *cobj = static_cast<cc::network::WebSocket *>(s.nativeThisObject());
        bool  ok   = false;
        if (args[0].isString()) {
            std::string data;
            ok = seval_to_std_string(args[0], &data);
            SE_PRECONDITION2(ok, false, "Convert string failed");
            //IDEA: We didn't find a way to get the JS string length in JSB2.0.
            //            if (data.empty() && len > 0)
            //            {
            //                CC_LOG_DEBUGWARN("Text message to send is empty, but its length is greater than 0!");
            //                //IDEA: Note that this text message contains '0x00' prefix, so its length calcuted by strlen is 0.
            //                // we need to fix that if there is '0x00' in text message,
            //                // since javascript language could support '0x00' inserted at the beginning or the middle of text message
            //            }

            cobj->send(data);
        } else if (args[0].isObject()) {
            se::Object *dataObj = args[0].toObject();
            uint8_t *   ptr     = nullptr;
            size_t      length  = 0;
            if (dataObj->isArrayBuffer()) {
                ok = dataObj->getArrayBufferData(&ptr, &length);
                SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
            } else if (dataObj->isTypedArray()) {
                ok = dataObj->getTypedArrayData(&ptr, &length);
                SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
            } else {
                assert(false);
            }

            cobj->send(ptr, static_cast<unsigned int>(length));
        } else {
            assert(false);
        }

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1", argc);
    return false;
}
SE_BIND_FUNC(webSocketSend)

static bool webSocketClose(se::State &s) {
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());

    auto *cobj = static_cast<cc::network::WebSocket *>(s.nativeThisObject());
    if (argc == 0) {
        cobj->closeAsync();
    } else if (argc == 1) {
        if (args[0].isNumber()) {
            int reason;
            seval_to_int32(args[0], &reason);
            cobj->closeAsync(reason, "no_reason");
        } else if (args[0].isString()) {
            std::string reason;
            seval_to_std_string(args[0], &reason);
            cobj->closeAsync(1005, reason);
        } else {
            assert(false);
        }
    } else if (argc == 2) {
        assert(args[0].isNumber());
        assert(args[1].isString());
        int         reasonCode;
        std::string reasonString;
        seval_to_int32(args[0], &reasonCode);
        seval_to_std_string(args[1], &reasonString);
        cobj->closeAsync(reasonCode, reasonString);
    } else {
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
SE_BIND_FUNC(webSocketClose)

static bool webSocketGetReadyState(se::State &s) {
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());

    if (argc == 0) {
        auto *cobj = static_cast<cc::network::WebSocket *>(s.nativeThisObject());
        s.rval().setInt32(static_cast<int>(cobj->getReadyState()));
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_PROP_GET(webSocketGetReadyState)

static bool webSocketGetBufferedAmount(se::State &s) {
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());

    if (argc == 0) {
        auto *cobj = static_cast<cc::network::WebSocket *>(s.nativeThisObject());
        s.rval().setUint32(static_cast<uint32_t>(cobj->getBufferedAmount()));
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_PROP_GET(webSocketGetBufferedAmount)

static bool webSocketGetExtensions(se::State &s) {
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());

    if (argc == 0) {
        auto *cobj = static_cast<cc::network::WebSocket *>(s.nativeThisObject());
        s.rval().setString(cobj->getExtensions());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_PROP_GET(webSocketGetExtensions)

    #define WEBSOCKET_DEFINE_READONLY_INT_FIELD(full_name, value)                    \
        static bool full_name(se::State &s) {                                        \
            const auto &args = s.args();                                             \
            int         argc = (int)args.size();                                     \
            if (argc == 0) {                                                         \
                s.rval().setInt32(value);                                            \
                return true;                                                         \
            }                                                                        \
            SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc); \
            return false;                                                            \
        }                                                                            \
        SE_BIND_PROP_GET(full_name)

WEBSOCKET_DEFINE_READONLY_INT_FIELD(Websocket_CONNECTING, static_cast<int>(cc::network::WebSocket::State::CONNECTING))
WEBSOCKET_DEFINE_READONLY_INT_FIELD(Websocket_OPEN, static_cast<int>(cc::network::WebSocket::State::OPEN))
WEBSOCKET_DEFINE_READONLY_INT_FIELD(Websocket_CLOSING, static_cast<int>(cc::network::WebSocket::State::CLOSING))
WEBSOCKET_DEFINE_READONLY_INT_FIELD(Websocket_CLOSED, static_cast<int>(cc::network::WebSocket::State::CLOSED))

bool register_all_websocket(se::Object *obj) { // NOLINT (readability-identifier-naming)
    se::Class *cls = se::Class::create("WebSocket", obj, nullptr, _SE(webSocketConstructor));
    cls->defineFinalizeFunction(_SE(webSocketFinalize));

    cls->defineFunction("send", _SE(webSocketSend));
    cls->defineFunction("close", _SE(webSocketClose));
    cls->defineProperty("readyState", _SE(webSocketGetReadyState), nullptr);
    cls->defineProperty("bufferedAmount", _SE(webSocketGetBufferedAmount), nullptr);
    cls->defineProperty("extensions", _SE(webSocketGetExtensions), nullptr);
    cls->defineProperty("CONNECTING", _SE(Websocket_CONNECTING), nullptr);
    cls->defineProperty("CLOSING", _SE(Websocket_CLOSING), nullptr);
    cls->defineProperty("OPEN", _SE(Websocket_OPEN), nullptr);
    cls->defineProperty("CLOSED", _SE(Websocket_CLOSED), nullptr);

    cls->install();

    se::Value tmp;
    obj->getProperty("WebSocket", &tmp);
    tmp.toObject()->defineProperty("CONNECTING", _SE(Websocket_CONNECTING), nullptr);
    tmp.toObject()->defineProperty("CLOSING", _SE(Websocket_CLOSING), nullptr);
    tmp.toObject()->defineProperty("OPEN", _SE(Websocket_OPEN), nullptr);
    tmp.toObject()->defineProperty("CLOSED", _SE(Websocket_CLOSED), nullptr);

    JSBClassType::registerClass<cc::network::WebSocket>(cls);

    jsbWebSocketClass = cls;

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
#endif //#if (USE_SOCKET > 0)
