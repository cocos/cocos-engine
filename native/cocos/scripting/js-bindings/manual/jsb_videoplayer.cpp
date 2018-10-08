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

#include "jsb_videoplayer.hpp"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"

#include "base/ccUTF8.h"
#include "platform/CCApplication.h"
#include "ui/videoplayer/VideoPlayer.h"

using namespace cocos2d;
using namespace cocos2d::network;

/*
 [Constructor(in DOMString url, in optional DOMString protocols)]
 [Constructor(in DOMString url, in optional DOMString[] protocols)]
 interface VideoPlayer {
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
 VideoPlayer implements EventTarget;
 */

se::Class *__jsb_VideoPlayer_class = nullptr;

static bool VideoPlayer_finalize(se::State &s)
{
    VideoPlayer *cobj = (VideoPlayer *)s.nativeThisObject();
    CCLOGINFO("jsbindings: finalizing JS object %p (VideoPlayer)", cobj);

    cobj->stop();
    cobj->autorelease();

    return true;
}
SE_BIND_FINALIZE_FUNC(VideoPlayer_finalize)

static bool VideoPlayer_constructor(se::State &s)
{
    se::Object *obj = s.thisObject();
    VideoPlayer *cobj = new (std::nothrow) VideoPlayer();
    obj->setPrivateData(cobj);

    return true;
}
SE_BIND_CTOR(VideoPlayer_constructor, __jsb_VideoPlayer_class, VideoPlayer_finalize)

static bool VideoPlayer_close(se::State &s)
{
    VideoPlayer *cobj = (VideoPlayer *)s.nativeThisObject();

    // Attach current VideoPlayer instance to global object to prevent VideoPlayer instance
    // being garbage collected after "ws.close(); ws = null;"
    // There is a state that current VideoPlayer JS instance is being garbaged but its finalize
    // callback has not be invoked. Then in "JSB_VideoPlayerDelegate::onClose", se::Object is
    // still be able to be found and while invoking JS 'onclose' method, crash will happen since
    // JS instance is invalid and is going to be collected. This bug is easiler reproduced on iOS
    // because JavaScriptCore is more GC sensitive.
    // Please note that we need to detach it from global object in "JSB_VideoPlayerDelegate::onClose".
    se::ScriptEngine::getInstance()->getGlobalObject()->attachObject(s.thisObject());
    return true;
}
SE_BIND_FUNC(VideoPlayer_close)

static bool VideoPlayer_addEventListener(se::State& s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        
        std::function<void ()> arg1;
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=]() -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
                    
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1 = lambda;
            }
            else
            {
                arg1 = []() -> void {};
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(VideoPlayer_addEventListener)

static bool VideoPlayer_removeEventListener(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        std::function<void ()> arg1 = []() -> void {};
        SE_PRECONDITION2(ok, false, "VideoPlayer_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(VideoPlayer_removeEventListener)

static bool VideoPlayer_setURL(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_setURL : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "VideoPlayer_setURL : Error processing arguments");
        cobj->setURL(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(VideoPlayer_setURL)

static bool VideoPlayer_play(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_play : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->play();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(VideoPlayer_play)

static bool VideoPlayer_pause(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_play : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->pause();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(VideoPlayer_pause)

static bool VideoPlayer_stop(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_stop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stop();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(VideoPlayer_stop)

static bool VideoPlayer_seekTo(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_seekTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "VideoPlayer_seekTo : Error processing arguments");
        cobj->seekTo(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(VideoPlayer_seekTo)

static bool VideoPlayer_currentTime(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_currentTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->currentTime();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "VideoPlayer_currentTime : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(VideoPlayer_currentTime)

static bool VideoPlayer_duration(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_duration : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->duration();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "VideoPlayer_duration : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(VideoPlayer_duration)

static bool VideoPlayer_setKeepAspectRatioEnabled(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_setKeepAspectRatioEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "VideoPlayer_setKeepAspectRatioEnabled : Error processing arguments");
        cobj->setKeepAspectRatioEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(VideoPlayer_setKeepAspectRatioEnabled)

static bool VideoPlayer_isKeepAspectRatioEnabled(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_onPlayEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isKeepAspectRatioEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "VideoPlayer_currentTime : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(VideoPlayer_isKeepAspectRatioEnabled)

static bool VideoPlayer_setFullScreenEnabled(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_setFullScreenEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "VideoPlayer_setFullScreenEnabled : Error processing arguments");
        cobj->setFullScreenEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(VideoPlayer_setFullScreenEnabled)

static bool VideoPlayer_setVisible(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_setVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "VideoPlayer_setVisible : Error processing arguments");
        cobj->setVisible(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(VideoPlayer_setVisible)

static bool VideoPlayer_setFrame(se::State &s)
{
    VideoPlayer* cobj = (VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "VideoPlayer_setViewPos : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float x = 0;
        ok = seval_to_float(args[0], &x);
        SE_PRECONDITION2(ok, false, "Convert arg0 failed!");
        float y = 0;
        ok = seval_to_float(args[1], &y);
        SE_PRECONDITION2(ok, false, "Convert arg1 failed!");
        int32_t width = 0;
        ok = seval_to_int32(args[2], &width);
        SE_PRECONDITION2(ok, false, "Convert arg2 failed!");
        int32_t height = 0;
        ok = seval_to_int32(args[3], &height);
        SE_PRECONDITION2(ok, false, "Convert arg3 failed!");
        cobj->setFrame(x, y, width, height);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(VideoPlayer_setFrame)

static bool VideoPlayer_setViewSize(se::State &s)
{
    return true;
}
SE_BIND_FUNC(VideoPlayer_setViewSize)

bool register_all_videoplayer(se::Object *obj)
{
    se::Class *cls = se::Class::create("VideoPlayerCore", obj, nullptr, _SE(VideoPlayer_constructor));
    cls->defineFinalizeFunction(_SE(VideoPlayer_finalize));
    cls->defineFunction("close", _SE(VideoPlayer_close));
    cls->defineFunction("setURL", _SE(VideoPlayer_setURL));
    cls->defineFunction("play", _SE(VideoPlayer_play));
    cls->defineFunction("pause", _SE(VideoPlayer_pause));
    cls->defineFunction("stop", _SE(VideoPlayer_stop));
    cls->defineFunction("seekTo", _SE(VideoPlayer_seekTo));
    cls->defineFunction("currentTime", _SE(VideoPlayer_currentTime));
    cls->defineFunction("duration", _SE(VideoPlayer_duration));
    cls->defineFunction("setKeepAspectRatioEnabled", _SE(VideoPlayer_setKeepAspectRatioEnabled));
    cls->defineFunction("isKeepAspectRatioEnabled", _SE(VideoPlayer_isKeepAspectRatioEnabled));
    cls->defineFunction("setFullScreenEnabled", _SE(VideoPlayer_setFullScreenEnabled));
    cls->defineFunction("addEventListener", _SE(VideoPlayer_addEventListener));
    cls->defineFunction("removeEventListener", _SE(VideoPlayer_removeEventListener));
    cls->defineFunction("setVisible", _SE(VideoPlayer_setVisible));
    cls->defineFunction("setViewSize", _SE(VideoPlayer_setViewSize));
    cls->defineFunction("setFrame", _SE(VideoPlayer_setFrame));
    cls->install();

    JSBClassType::registerClass<VideoPlayer>(cls);

    __jsb_VideoPlayer_class = cls;

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
