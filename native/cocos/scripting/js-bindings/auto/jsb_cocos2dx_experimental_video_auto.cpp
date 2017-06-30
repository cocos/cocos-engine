#include "scripting/js-bindings/auto/jsb_cocos2dx_experimental_video_auto.hpp"
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "ui/UIVideoPlayer.h"

JSClass  *jsb_cocos2d_experimental_ui_VideoPlayer_class;
JS::PersistentRootedObject *jsb_cocos2d_experimental_ui_VideoPlayer_prototype;

bool js_cocos2dx_experimental_video_VideoPlayer_getFileName(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_getFileName : Invalid Native Object");
    if (argc == 0) {
        const std::string& ret = cobj->getFileName();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_getFileName : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_getFileName : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_getURL(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_getURL : Invalid Native Object");
    if (argc == 0) {
        const std::string& ret = cobj->getURL();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_getURL : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_getURL : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_play(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_play : Invalid Native Object");
    if (argc == 0) {
        cobj->play();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_play : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_setKeepAspectRatioEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_setKeepAspectRatioEnabled : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_setKeepAspectRatioEnabled : Error processing arguments");
        cobj->setKeepAspectRatioEnabled(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_setKeepAspectRatioEnabled : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_currentTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_currentTime : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->currentTime();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_currentTime : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_currentTime : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_stop(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_stop : Invalid Native Object");
    if (argc == 0) {
        cobj->stop();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_stop : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_setFullScreenEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_setFullScreenEnabled : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_setFullScreenEnabled : Error processing arguments");
        cobj->setFullScreenEnabled(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_setFullScreenEnabled : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_setFileName(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_setFileName : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_setFileName : Error processing arguments");
        cobj->setFileName(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_setFileName : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_setURL(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_setURL : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_setURL : Error processing arguments");
        cobj->setURL(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_setURL : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_isKeepAspectRatioEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_isKeepAspectRatioEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isKeepAspectRatioEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_isKeepAspectRatioEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_isKeepAspectRatioEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent : Error processing arguments");
        cobj->onPlayEvent(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_isFullScreenEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_isFullScreenEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isFullScreenEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_isFullScreenEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_isFullScreenEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_duration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_duration : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->duration();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_duration : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_duration : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_isPlaying(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_isPlaying : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isPlaying();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_isPlaying : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_isPlaying : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_seekTo(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::VideoPlayer* cobj = (cocos2d::experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_seekTo : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_video_VideoPlayer_seekTo : Error processing arguments");
        cobj->seekTo(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_seekTo : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_video_VideoPlayer_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        auto ret = cocos2d::experimental::ui::VideoPlayer::create();
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_experimental_ui_VideoPlayer_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_cocos2d_experimental_ui_VideoPlayer_class, proto, &jsret, "cocos2d::experimental::ui::VideoPlayer");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_video_VideoPlayer_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_experimental_video_VideoPlayer_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::experimental::ui::VideoPlayer* cobj = new (std::nothrow) cocos2d::experimental::ui::VideoPlayer();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_experimental_ui_VideoPlayer_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_experimental_ui_VideoPlayer_class, proto, &jsobj, "cocos2d::experimental::ui::VideoPlayer");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}


extern JS::PersistentRootedObject *jsb_cocos2d_ui_Widget_prototype;

void js_register_cocos2dx_experimental_video_VideoPlayer(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_experimental_ui_VideoPlayer_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_experimental_ui_VideoPlayer_class = {
        "VideoPlayer",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_experimental_ui_VideoPlayer_classOps
    };
    jsb_cocos2d_experimental_ui_VideoPlayer_class = &cocos2d_experimental_ui_VideoPlayer_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getFileName", js_cocos2dx_experimental_video_VideoPlayer_getFileName, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getURL", js_cocos2dx_experimental_video_VideoPlayer_getURL, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("play", js_cocos2dx_experimental_video_VideoPlayer_play, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setKeepAspectRatioEnabled", js_cocos2dx_experimental_video_VideoPlayer_setKeepAspectRatioEnabled, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("currentTime", js_cocos2dx_experimental_video_VideoPlayer_currentTime, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stop", js_cocos2dx_experimental_video_VideoPlayer_stop, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setFullScreenEnabled", js_cocos2dx_experimental_video_VideoPlayer_setFullScreenEnabled, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setFileName", js_cocos2dx_experimental_video_VideoPlayer_setFileName, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setURL", js_cocos2dx_experimental_video_VideoPlayer_setURL, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isKeepAspectRatioEnabled", js_cocos2dx_experimental_video_VideoPlayer_isKeepAspectRatioEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("onPlayEvent", js_cocos2dx_experimental_video_VideoPlayer_onPlayEvent, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isFullScreenEnabled", js_cocos2dx_experimental_video_VideoPlayer_isFullScreenEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("duration", js_cocos2dx_experimental_video_VideoPlayer_duration, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isPlaying", js_cocos2dx_experimental_video_VideoPlayer_isPlaying, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("seekTo", js_cocos2dx_experimental_video_VideoPlayer_seekTo, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_experimental_video_VideoPlayer_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_ui_Widget_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_experimental_ui_VideoPlayer_class,
        js_cocos2dx_experimental_video_VideoPlayer_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::experimental::ui::VideoPlayer>(cx, jsb_cocos2d_experimental_ui_VideoPlayer_class, proto);
    jsb_cocos2d_experimental_ui_VideoPlayer_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "VideoPlayer", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

void register_all_cocos2dx_experimental_video(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "ccui", &ns);

    js_register_cocos2dx_experimental_video_VideoPlayer(cx, ns);
}

#endif //#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)
