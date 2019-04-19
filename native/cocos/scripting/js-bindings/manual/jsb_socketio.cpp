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

#include "jsb_socketio.hpp"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"

#include "cocos/network/SocketIO.h"
#include "base/ccUTF8.h"
#include "platform/CCApplication.h"

using namespace cocos2d;
using namespace cocos2d::network;

se::Class* __jsb_SocketIO_class = nullptr;

class JSB_SocketIODelegate : public Ref, public SocketIO::SIODelegate
{
public:
    //c++11 map to callbacks
    typedef std::unordered_map<std::string/* eventName */, se::ValueArray/* 0:callbackFunc, 1:target */> JSB_SIOCallbackRegistry;

    JSB_SocketIODelegate()
    {
    }

    virtual ~JSB_SocketIODelegate()
    {
        CCLOGINFO("In the destructor of JSB_SocketIODelegate(%p)", this);
    }

    virtual void onConnect(SIOClient* client) override
    {
    }

    virtual void onMessage(SIOClient* client, const std::string& data) override
    {
    }

    virtual void onClose(SIOClient* client) override
    {
        CCLOG("JSB SocketIO::SIODelegate->onClose method called from native");
        this->fireEventToScript(client, "disconnect", "");

        auto iter = se::NativePtrToObjectMap::find(client);
        if (iter != se::NativePtrToObjectMap::end())
        {
            iter->second->unroot();
        }

        if (getReferenceCount() == 1)
        {
            autorelease();
        }
        else
        {
            release();
        }
    }

    virtual void onError(SIOClient* client, const std::string& data) override
    {
        CCLOG("JSB SocketIO::SIODelegate->onError method called from native with data: %s", data.c_str());
        this->fireEventToScript(client, "error", data);

        auto iter = se::NativePtrToObjectMap::find(client);
        if (iter != se::NativePtrToObjectMap::end())
        {
            iter->second->unroot();
        }
    }

    virtual void fireEventToScript(SIOClient* client, const std::string& eventName, const std::string& data) override
    {
        CCLOG("JSB SocketIO::SIODelegate->fireEventToScript method called from native with name '%s' data: %s", eventName.c_str(), data.c_str());

        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        if (cocos2d::Application::getInstance() == nullptr)
            return;

        auto iter = se::NativePtrToObjectMap::find(client); //IDEA: client probably be a new value with the same address as the old one, it may cause undefined result.
        if (iter == se::NativePtrToObjectMap::end())
            return;

        se::Value dataVal;
        if (data.empty())
        {
            dataVal.setNull();
        }
        else
        {
            dataVal.setString(data);
        }

        JSB_SIOCallbackRegistry::iterator it = _eventRegistry.find(eventName);

        if (it != _eventRegistry.end())
        {
            const se::ValueArray& cbStruct = it->second;
            assert(cbStruct.size() == 2);
            const se::Value& callback = cbStruct[0];
            const se::Value& target = cbStruct[1];
            if (callback.isObject() && callback.toObject()->isFunction() && target.isObject())
            {
                se::ValueArray args;
                args.push_back(dataVal);
                callback.toObject()->call(args, target.toObject());
            }
        }

        if (eventName == "disconnect")
        {
            cocos2d::log("disconnect ... "); //IDEA:
        }
    }

    void addEvent(const std::string& eventName, const se::Value& callback, const se::Value& target)
    {
        assert(callback.isObject() && callback.toObject()->isFunction());
        assert(target.isObject());
        _eventRegistry[eventName].clear();
        _eventRegistry[eventName].push_back(callback);
        _eventRegistry[eventName].push_back(target);
        target.toObject()->attachObject(callback.toObject());
    }

private:
    JSB_SIOCallbackRegistry _eventRegistry;
};


static bool SocketIO_finalize(se::State& s)
{
    SIOClient* cobj = (SIOClient*)s.nativeThisObject();
    CCLOGINFO("jsbindings: finalizing JS object %p (SocketIO)", cobj);
    cobj->disconnect();
    JSB_SocketIODelegate* delegate = static_cast<JSB_SocketIODelegate*>(cobj->getDelegate());
    if (delegate->getReferenceCount() == 1)
    {
        delegate->autorelease();
    }
    else
    {
        delegate->release();
    }
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(SocketIO_finalize)


static bool SocketIO_prop_getTag(se::State& s)
{
    SIOClient* cobj = (SIOClient*)s.nativeThisObject();
    s.rval().setString(cobj->getTag());
    return true;
}
SE_BIND_PROP_GET(SocketIO_prop_getTag)

static bool SocketIO_prop_setTag(se::State& s)
{
    SIOClient* cobj = (SIOClient*)s.nativeThisObject();
    cobj->setTag(s.args()[0].toString().c_str());
    return true;
}
SE_BIND_PROP_SET(SocketIO_prop_setTag)

static bool SocketIO_send(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    SIOClient* cobj = (SIOClient*)s.nativeThisObject();

    if (argc == 1)
    {
        std::string payload;
        bool ok = seval_to_std_string(args[0], &payload);
        SE_PRECONDITION2(ok, false, "Converting payload failed!");

        cobj->send(payload);
        return true;
    }

    SE_REPORT_ERROR("Wrong number of arguments: %d, expected: %d", argc, 1);
    return false;
}
SE_BIND_FUNC(SocketIO_send)

static bool SocketIO_emit(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    SIOClient* cobj = (SIOClient*)s.nativeThisObject();

    if (argc >= 1)
    {
        bool ok = false;
        std::string eventName;
        ok = seval_to_std_string(args[0], &eventName);
        SE_PRECONDITION2(ok, false, "Converting eventName failed!");

        std::string payload;
        if (argc >= 2)
        {
            const auto& arg1 = args[1];
            // Add this check to make it compatible with old version.
            // jsval_to_std_string in v1.6 returns empty string if arg1 is null or undefined
            // while seval_to_std_string since 1.7.2 follows JS standard to return "null" or "undefined".
            // Therefore, we need a workaround to make it be compatible with versions lower than v1.7.
            if (!arg1.isNullOrUndefined())
            {
                ok = seval_to_std_string(arg1, &payload);
                SE_PRECONDITION2(ok, false, "Converting payload failed!");
            }
        }

        cobj->emit(eventName, payload);
        return true;
    }

    SE_REPORT_ERROR("Wrong number of arguments: %d, expected: %d", argc, 2);
    return false;
}
SE_BIND_FUNC(SocketIO_emit)

static bool SocketIO_disconnect(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    SIOClient* cobj = (SIOClient*)s.nativeThisObject();

    if (argc == 0)
    {
        cobj->disconnect();
        return true;
    }

    SE_REPORT_ERROR("Wrong number of arguments: %d, expected: %d", argc, 0);
    return false;
}
SE_BIND_FUNC(SocketIO_disconnect)

static bool SocketIO_on(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    SIOClient* cobj = (SIOClient*)s.nativeThisObject();

    if (argc == 2)
    {
        bool ok = false;
        std::string eventName;
        ok = seval_to_std_string(args[0], &eventName);
        SE_PRECONDITION2(ok, false, "Converting eventName failed!");

        CCLOG("JSB SocketIO eventName to: '%s'", eventName.c_str());

        ((JSB_SocketIODelegate *)cobj->getDelegate())->addEvent(eventName, args[1], se::Value(s.thisObject()));
        return true;
    }

    SE_REPORT_ERROR("Wrong number of arguments: %d, expected: %d", argc, 2);
    return false;
}
SE_BIND_FUNC(SocketIO_on)

// static
static bool SocketIO_connect(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("JSB SocketIO.connect method called");

    if (argc >= 1 && argc <= 3)
    {
        std::string url;
        std::string caFilePath;
        bool ok = false;

        ok = seval_to_std_string(args[0], &url);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        if (argc == 2)
        {
            if (args[1].isObject())
            {
                // Just ignore the option argument
            }
            else if (args[1].isString())
            {
                // Assume it's CA root file path
                ok = seval_to_std_string(args[1], &caFilePath);
                SE_PRECONDITION2( ok, false, "Error processing arguments");
            }
        }

        if (argc == 3)
        {
            // Just ignore the option argument

            if (args[2].isString())
            {
                // Assume it's CA root file path
                ok = seval_to_std_string(args[2], &caFilePath);
                SE_PRECONDITION2( ok, false, "Error processing arguments");
            }
        }

        JSB_SocketIODelegate* siodelegate = new (std::nothrow) JSB_SocketIODelegate();

        CCLOG("Calling native SocketIO.connect method");
        SIOClient* ret = SocketIO::connect(url, *siodelegate, caFilePath);
        if (ret != nullptr)
        {
            ret->retain();
            siodelegate->retain();

            se::Object* obj = se::Object::createObjectWithClass(__jsb_SocketIO_class);
            obj->setPrivateData(ret);

            s.rval().setObject(obj);
            obj->root();

            return true;
        }
        else
        {
            siodelegate->release();
            SE_REPORT_ERROR("SocketIO.connect return nullptr!");
            return false;
        }
    }
    SE_REPORT_ERROR("JSB SocketIO.connect: Wrong number of arguments");
    return false;
}
SE_BIND_FUNC(SocketIO_connect)

// static
static bool SocketIO_close(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 0)
    {
        return true;
    }

    SE_REPORT_ERROR("Wrong number of arguments: %d, expected: %d", argc, 0);
    return false;
}
SE_BIND_FUNC(SocketIO_close)

bool register_all_socketio(se::Object* obj)
{
    se::Class* cls = se::Class::create("SocketIO", obj, nullptr, nullptr);
    cls->defineFinalizeFunction(_SE(SocketIO_finalize));

    cls->defineProperty("tag", _SE(SocketIO_prop_getTag), _SE(SocketIO_prop_setTag));

    cls->defineFunction("send", _SE(SocketIO_send));
    cls->defineFunction("emit", _SE(SocketIO_emit));
    cls->defineFunction("disconnect", _SE(SocketIO_disconnect));
    cls->defineFunction("on", _SE(SocketIO_on));

    cls->install();
    
    JSBClassType::registerClass<SocketIO>(cls);

    se::Value ctorVal;
    obj->getProperty("SocketIO", &ctorVal);
    ctorVal.toObject()->defineFunction("connect", _SE(SocketIO_connect));
    ctorVal.toObject()->defineFunction("close", _SE(SocketIO_close));

    __jsb_SocketIO_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
