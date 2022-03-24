/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "cocos/bindings/auto/jsb_video_auto.h"
#if (USE_VIDEO > 0)
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "ui/videoplayer/VideoPlayer.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_VideoPlayer_proto = nullptr;
se::Class* __jsb_cc_VideoPlayer_class = nullptr;

static bool js_video_VideoPlayer_addEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::function<void ()>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=]() -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(se::EmptyValueArray, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1.data = lambda;
            }
            else
            {
                arg1.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_video_VideoPlayer_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_addEventListener)

static bool js_video_VideoPlayer_currentTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_currentTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->currentTime();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_video_VideoPlayer_currentTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_currentTime)

static bool js_video_VideoPlayer_duration(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_duration : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->duration();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_video_VideoPlayer_duration : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_duration)

static bool js_video_VideoPlayer_isKeepAspectRatioEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_isKeepAspectRatioEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isKeepAspectRatioEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_video_VideoPlayer_isKeepAspectRatioEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_isKeepAspectRatioEnabled)

static bool js_video_VideoPlayer_onPlayEvent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_onPlayEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_video_VideoPlayer_onPlayEvent : Error processing arguments");
        cobj->onPlayEvent(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_onPlayEvent)

static bool js_video_VideoPlayer_pause(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_pause : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->pause();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_pause)

static bool js_video_VideoPlayer_play(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_play : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->play();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_play)

static bool js_video_VideoPlayer_seekTo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_seekTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_video_VideoPlayer_seekTo : Error processing arguments");
        cobj->seekTo(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_seekTo)

static bool js_video_VideoPlayer_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_video_VideoPlayer_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_setFrame)

static bool js_video_VideoPlayer_setFullScreenEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_setFullScreenEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_video_VideoPlayer_setFullScreenEnabled : Error processing arguments");
        cobj->setFullScreenEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_setFullScreenEnabled)

static bool js_video_VideoPlayer_setKeepAspectRatioEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_setKeepAspectRatioEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_video_VideoPlayer_setKeepAspectRatioEnabled : Error processing arguments");
        cobj->setKeepAspectRatioEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_setKeepAspectRatioEnabled)

static bool js_video_VideoPlayer_setURL(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_setURL : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_video_VideoPlayer_setURL : Error processing arguments");
        cobj->setURL(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_setURL)

static bool js_video_VideoPlayer_setVisible(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_setVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_video_VideoPlayer_setVisible : Error processing arguments");
        cobj->setVisible(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_setVisible)

static bool js_video_VideoPlayer_stop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    SE_PRECONDITION2(cobj, false, "js_video_VideoPlayer_stop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stop();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_video_VideoPlayer_stop)

SE_DECLARE_FINALIZE_FUNC(js_cc_VideoPlayer_finalize)

static bool js_video_VideoPlayer_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::VideoPlayer* cobj = JSB_ALLOC(cc::VideoPlayer);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_video_VideoPlayer_constructor, __jsb_cc_VideoPlayer_class, js_cc_VideoPlayer_finalize)



static bool js_cc_VideoPlayer_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    // destructor is skipped
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_VideoPlayer_finalize)

static bool js_cc_VideoPlayer_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VideoPlayer>(s);
    cobj->release();
    auto objIter = se::NativePtrToObjectMap::find(SE_THIS_OBJECT<cc::VideoPlayer>(s));
    if(objIter != se::NativePtrToObjectMap::end())
    {
        objIter->second->clearPrivateData(true);
    }
    return true;
}
SE_BIND_FUNC(js_cc_VideoPlayer_destroy)

bool js_register_video_VideoPlayer(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("VideoPlayer", obj, nullptr, _SE(js_video_VideoPlayer_constructor));

    cls->defineFunction("addEventListener", _SE(js_video_VideoPlayer_addEventListener));
    cls->defineFunction("currentTime", _SE(js_video_VideoPlayer_currentTime));
    cls->defineFunction("duration", _SE(js_video_VideoPlayer_duration));
    cls->defineFunction("isKeepAspectRatioEnabled", _SE(js_video_VideoPlayer_isKeepAspectRatioEnabled));
    cls->defineFunction("onPlayEvent", _SE(js_video_VideoPlayer_onPlayEvent));
    cls->defineFunction("pause", _SE(js_video_VideoPlayer_pause));
    cls->defineFunction("play", _SE(js_video_VideoPlayer_play));
    cls->defineFunction("seekTo", _SE(js_video_VideoPlayer_seekTo));
    cls->defineFunction("setFrame", _SE(js_video_VideoPlayer_setFrame));
    cls->defineFunction("setFullScreenEnabled", _SE(js_video_VideoPlayer_setFullScreenEnabled));
    cls->defineFunction("setKeepAspectRatioEnabled", _SE(js_video_VideoPlayer_setKeepAspectRatioEnabled));
    cls->defineFunction("setURL", _SE(js_video_VideoPlayer_setURL));
    cls->defineFunction("setVisible", _SE(js_video_VideoPlayer_setVisible));
    cls->defineFunction("stop", _SE(js_video_VideoPlayer_stop));
    cls->defineFunction("destroy", _SE(js_cc_VideoPlayer_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_VideoPlayer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::VideoPlayer>(cls);

    __jsb_cc_VideoPlayer_proto = cls->getProto();
    __jsb_cc_VideoPlayer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_video(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("jsb", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_video_VideoPlayer(ns);
    return true;
}

#endif //#if (USE_VIDEO > 0)
