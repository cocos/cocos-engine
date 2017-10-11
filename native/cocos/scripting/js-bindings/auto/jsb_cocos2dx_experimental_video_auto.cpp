#include "scripting/js-bindings/auto/jsb_cocos2dx_experimental_video_auto.hpp"
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "ui/UIVideoPlayer.h"

se::Object* __jsb_cocos2d_experimental_ui_VideoPlayer_proto = nullptr;
se::Class* __jsb_cocos2d_experimental_ui_VideoPlayer_class = nullptr;

static bool js_cocos2dx_experimental_video_VideoPlayer_getFileName(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_getFileName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getFileName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_getFileName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_getFileName)

static bool js_cocos2dx_experimental_video_VideoPlayer_getURL(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_getURL : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getURL();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_getURL : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_getURL)

static bool js_cocos2dx_experimental_video_VideoPlayer_play(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_play : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->play();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_play)

static bool js_cocos2dx_experimental_video_VideoPlayer_setKeepAspectRatioEnabled(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_setKeepAspectRatioEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_setKeepAspectRatioEnabled : Error processing arguments");
        cobj->setKeepAspectRatioEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_setKeepAspectRatioEnabled)

static bool js_cocos2dx_experimental_video_VideoPlayer_currentTime(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_currentTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->currentTime();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_currentTime : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_currentTime)

static bool js_cocos2dx_experimental_video_VideoPlayer_stop(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
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
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_stop)

static bool js_cocos2dx_experimental_video_VideoPlayer_setFullScreenEnabled(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_setFullScreenEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_setFullScreenEnabled : Error processing arguments");
        cobj->setFullScreenEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_setFullScreenEnabled)

static bool js_cocos2dx_experimental_video_VideoPlayer_setFileName(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_setFileName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_setFileName : Error processing arguments");
        cobj->setFileName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_setFileName)

static bool js_cocos2dx_experimental_video_VideoPlayer_setURL(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_setURL : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_setURL : Error processing arguments");
        cobj->setURL(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_setURL)

static bool js_cocos2dx_experimental_video_VideoPlayer_isKeepAspectRatioEnabled(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_isKeepAspectRatioEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isKeepAspectRatioEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_isKeepAspectRatioEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_isKeepAspectRatioEnabled)

static bool js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent : Error processing arguments");
        cobj->onPlayEvent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent)

static bool js_cocos2dx_experimental_video_VideoPlayer_isFullScreenEnabled(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_isFullScreenEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFullScreenEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_isFullScreenEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_isFullScreenEnabled)

static bool js_cocos2dx_experimental_video_VideoPlayer_addEventListener(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::Ref *, cocos2d::experimental::ui::VideoPlayer::EventType)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](cocos2d::Ref* larg0, cocos2d::experimental::ui::VideoPlayer::EventType larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval<cocos2d::Ref>((cocos2d::Ref*)larg0, &args[0]);
                    ok &= int32_to_seval((int32_t)larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_addEventListener)

static bool js_cocos2dx_experimental_video_VideoPlayer_duration(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_duration : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->duration();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_duration : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_duration)

static bool js_cocos2dx_experimental_video_VideoPlayer_isPlaying(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_isPlaying : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPlaying();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_isPlaying : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_isPlaying)

static bool js_cocos2dx_experimental_video_VideoPlayer_seekTo(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_video_VideoPlayer_seekTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_experimental_video_VideoPlayer_seekTo : Error processing arguments");
        cobj->seekTo(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_seekTo)

static bool js_cocos2dx_experimental_video_VideoPlayer_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::experimental::ui::VideoPlayer::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_experimental_ui_VideoPlayer_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_video_VideoPlayer_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_experimental_ui_VideoPlayer_finalize)

static bool js_cocos2dx_experimental_video_VideoPlayer_constructor(se::State& s)
{
    cocos2d::experimental::ui::VideoPlayer* cobj = new (std::nothrow) cocos2d::experimental::ui::VideoPlayer();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_experimental_video_VideoPlayer_constructor, __jsb_cocos2d_experimental_ui_VideoPlayer_class, js_cocos2d_experimental_ui_VideoPlayer_finalize)



extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_experimental_ui_VideoPlayer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::experimental::ui::VideoPlayer)", s.nativeThisObject());
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_experimental_ui_VideoPlayer_finalize)

bool js_register_cocos2dx_experimental_video_VideoPlayer(se::Object* obj)
{
    auto cls = se::Class::create("VideoPlayer", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_experimental_video_VideoPlayer_constructor));

    cls->defineFunction("getFileName", _SE(js_cocos2dx_experimental_video_VideoPlayer_getFileName));
    cls->defineFunction("getURL", _SE(js_cocos2dx_experimental_video_VideoPlayer_getURL));
    cls->defineFunction("play", _SE(js_cocos2dx_experimental_video_VideoPlayer_play));
    cls->defineFunction("setKeepAspectRatioEnabled", _SE(js_cocos2dx_experimental_video_VideoPlayer_setKeepAspectRatioEnabled));
    cls->defineFunction("currentTime", _SE(js_cocos2dx_experimental_video_VideoPlayer_currentTime));
    cls->defineFunction("stop", _SE(js_cocos2dx_experimental_video_VideoPlayer_stop));
    cls->defineFunction("setFullScreenEnabled", _SE(js_cocos2dx_experimental_video_VideoPlayer_setFullScreenEnabled));
    cls->defineFunction("setFileName", _SE(js_cocos2dx_experimental_video_VideoPlayer_setFileName));
    cls->defineFunction("setURL", _SE(js_cocos2dx_experimental_video_VideoPlayer_setURL));
    cls->defineFunction("isKeepAspectRatioEnabled", _SE(js_cocos2dx_experimental_video_VideoPlayer_isKeepAspectRatioEnabled));
    cls->defineFunction("onPlayEvent", _SE(js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent));
    cls->defineFunction("isFullScreenEnabled", _SE(js_cocos2dx_experimental_video_VideoPlayer_isFullScreenEnabled));
    cls->defineFunction("addEventListener", _SE(js_cocos2dx_experimental_video_VideoPlayer_addEventListener));
    cls->defineFunction("duration", _SE(js_cocos2dx_experimental_video_VideoPlayer_duration));
    cls->defineFunction("isPlaying", _SE(js_cocos2dx_experimental_video_VideoPlayer_isPlaying));
    cls->defineFunction("seekTo", _SE(js_cocos2dx_experimental_video_VideoPlayer_seekTo));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_experimental_video_VideoPlayer_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_experimental_ui_VideoPlayer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::experimental::ui::VideoPlayer>(cls);

    __jsb_cocos2d_experimental_ui_VideoPlayer_proto = cls->getProto();
    __jsb_cocos2d_experimental_ui_VideoPlayer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx_experimental_video(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("ccui", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("ccui", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_cocos2dx_experimental_video_VideoPlayer(ns);
    return true;
}

#endif //#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)
