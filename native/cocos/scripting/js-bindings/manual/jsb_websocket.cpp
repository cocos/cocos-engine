#include "jsb_websocket.hpp"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"

#include "cocos/network/WebSocket.h"
#include "base/ccUTF8.h"
#include "base/CCDirector.h"

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

class JSB_WebSocketDelegate : public Ref, public WebSocket::Delegate
{
public:

    JSB_WebSocketDelegate()
    {
    }

private:
    virtual ~JSB_WebSocketDelegate()
    {
        CCLOGINFO("In the destructor of JSB_WebSocketDelegate(%p)", this);
    }

public:
    virtual void onOpen(WebSocket* ws) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        if (cocos2d::Director::getInstance() == nullptr || cocos2d::ScriptEngineManager::getInstance() == nullptr)
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

    virtual void onMessage(WebSocket* ws, const WebSocket::Data& data) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        if (cocos2d::Director::getInstance() == nullptr || cocos2d::ScriptEngineManager::getInstance() == nullptr)
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

    virtual void onClose(WebSocket* ws) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        if (cocos2d::Director::getInstance() == nullptr || cocos2d::ScriptEngineManager::getInstance() == nullptr)
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

        } while(false);

        ws->release();
        release(); // Release delegate self at last
    }

    virtual void onError(WebSocket* ws, const WebSocket::ErrorCode& error) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        if (cocos2d::Director::getInstance() == nullptr || cocos2d::ScriptEngineManager::getInstance() == nullptr)
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

    void setJSDelegate(const se::Value& jsDelegate)
    {
        assert(jsDelegate.isObject());
        _JSDelegate = jsDelegate;
    }
private:
    se::Value _JSDelegate;
};

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
//FIXME: We didn't find a way to get the JS string length in JSB2.0.
//            if (data.empty() && len > 0)
//            {
//                CCLOGWARN("Text message to send is empty, but its length is greater than 0!");
//                //FIXME: Note that this text message contains '0x00' prefix, so its length calcuted by strlen is 0.
//                // we need to fix that if there is '0x00' in text message,
//                // since javascript language could support '0x00' inserted at the beginning or the middle of text message
//            }

            cobj->send(data);
        }
        else if (args[0].isObject())
        {
            se::Object* dataObj = args[0].toObject();
            uint8* ptr = nullptr;
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

    if (argc == 0)
    {
        WebSocket* cobj = (WebSocket*)s.nativeThisObject();
        cobj->closeAsync();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
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

bool register_all_websocket(se::Object* obj)
{
    se::Class* cls = se::Class::create("WebSocket", obj, nullptr, _SE(WebSocket_constructor));
    cls->defineFinalizeFunction(_SE(WebSocket_finalize));

    cls->defineFunction("send", _SE(WebSocket_send));
    cls->defineFunction("close", _SE(WebSocket_close));
    cls->defineProperty("readyState", _SE(WebSocket_getReadyState), nullptr);

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
