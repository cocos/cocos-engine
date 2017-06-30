#include "scripting/js-bindings/auto/jsb_cocos2dx_audioengine_auto.hpp"
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT || CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "audio/include/AudioEngine.h"

JSClass  *jsb_cocos2d_experimental_AudioProfile_class;
JS::PersistentRootedObject *jsb_cocos2d_experimental_AudioProfile_prototype;

bool js_cocos2dx_audioengine_AudioProfile_get_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    cocos2d::experimental::AudioProfile* cobj = (cocos2d::experimental::AudioProfile *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_audioengine_AudioProfile_get_name : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    ok &= std_string_to_jsval(cx, cobj->name, &jsret);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioProfile_get_name : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_audioengine_AudioProfile_set_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    cocos2d::experimental::AudioProfile* cobj = (cocos2d::experimental::AudioProfile *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_audioengine_AudioProfile_set_name : Invalid Native Object");

    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioProfile_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
bool js_cocos2dx_audioengine_AudioProfile_get_maxInstances(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    cocos2d::experimental::AudioProfile* cobj = (cocos2d::experimental::AudioProfile *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_audioengine_AudioProfile_get_maxInstances : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->maxInstances);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioProfile_get_maxInstances : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_audioengine_AudioProfile_set_maxInstances(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    cocos2d::experimental::AudioProfile* cobj = (cocos2d::experimental::AudioProfile *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_audioengine_AudioProfile_set_maxInstances : Invalid Native Object");

    bool ok = true;
    unsigned int arg0 = 0;
    ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioProfile_set_maxInstances : Error processing new value");
    cobj->maxInstances = arg0;
    return true;
}
bool js_cocos2dx_audioengine_AudioProfile_get_minDelay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    cocos2d::experimental::AudioProfile* cobj = (cocos2d::experimental::AudioProfile *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_audioengine_AudioProfile_get_minDelay : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::DoubleValue(cobj->minDelay);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioProfile_get_minDelay : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_audioengine_AudioProfile_set_minDelay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    cocos2d::experimental::AudioProfile* cobj = (cocos2d::experimental::AudioProfile *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_audioengine_AudioProfile_set_minDelay : Invalid Native Object");

    bool ok = true;
    double arg0 = 0;
    ok &= jsval_to_double(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioProfile_set_minDelay : Error processing new value");
    cobj->minDelay = arg0;
    return true;
}
bool js_cocos2dx_audioengine_AudioProfile_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::experimental::AudioProfile* cobj = new (std::nothrow) cocos2d::experimental::AudioProfile();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_experimental_AudioProfile_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_cocos2d_experimental_AudioProfile_class, proto, &jsobj, "cocos2d::experimental::AudioProfile");
    JS_SetPrivate(jsobj.get(), cobj);
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}


void js_cocos2d_experimental_AudioProfile_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (AudioProfile)", obj);
    cocos2d::experimental::AudioProfile *nobj = static_cast<cocos2d::experimental::AudioProfile *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_audioengine_AudioProfile(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_experimental_AudioProfile_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_cocos2d_experimental_AudioProfile_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_experimental_AudioProfile_class = {
        "AudioProfile",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &cocos2d_experimental_AudioProfile_classOps
    };
    jsb_cocos2d_experimental_AudioProfile_class = &cocos2d_experimental_AudioProfile_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("name", js_cocos2dx_audioengine_AudioProfile_get_name, js_cocos2dx_audioengine_AudioProfile_set_name, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("maxInstances", js_cocos2dx_audioengine_AudioProfile_get_maxInstances, js_cocos2dx_audioengine_AudioProfile_set_maxInstances, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("minDelay", js_cocos2dx_audioengine_AudioProfile_get_minDelay, js_cocos2dx_audioengine_AudioProfile_set_minDelay, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_experimental_AudioProfile_class,
        js_cocos2dx_audioengine_AudioProfile_constructor, 0,
        properties,
        nullptr,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::experimental::AudioProfile>(cx, jsb_cocos2d_experimental_AudioProfile_class, proto);
    jsb_cocos2d_experimental_AudioProfile_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "AudioProfile", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_cocos2d_experimental_AudioEngine_class;
JS::PersistentRootedObject *jsb_cocos2d_experimental_AudioEngine_prototype;

bool js_cocos2dx_audioengine_AudioEngine_lazyInit(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        bool ret = cocos2d::experimental::AudioEngine::lazyInit();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_lazyInit : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_lazyInit : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_setCurrentTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 2) {
        int arg0 = 0;
        float arg1 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_setCurrentTime : Error processing arguments");

        bool ret = cocos2d::experimental::AudioEngine::setCurrentTime(arg0, arg1);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_setCurrentTime : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_setCurrentTime : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_getVolume(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getVolume : Error processing arguments");

        float ret = cocos2d::experimental::AudioEngine::getVolume(arg0);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getVolume : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_getVolume : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_uncache(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_uncache : Error processing arguments");
        cocos2d::experimental::AudioEngine::uncache(arg0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_uncache : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_resumeAll(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        cocos2d::experimental::AudioEngine::resumeAll();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_resumeAll : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_stopAll(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        cocos2d::experimental::AudioEngine::stopAll();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_stopAll : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_pause(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_pause : Error processing arguments");
        cocos2d::experimental::AudioEngine::pause(arg0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_pause : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_end(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        cocos2d::experimental::AudioEngine::end();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_end : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_getMaxAudioInstance(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        int ret = cocos2d::experimental::AudioEngine::getMaxAudioInstance();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getMaxAudioInstance : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_getMaxAudioInstance : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_getCurrentTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getCurrentTime : Error processing arguments");

        float ret = cocos2d::experimental::AudioEngine::getCurrentTime(arg0);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getCurrentTime : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_getCurrentTime : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_setMaxAudioInstance(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_setMaxAudioInstance : Error processing arguments");

        bool ret = cocos2d::experimental::AudioEngine::setMaxAudioInstance(arg0);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_setMaxAudioInstance : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_setMaxAudioInstance : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_isLoop(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_isLoop : Error processing arguments");

        bool ret = cocos2d::experimental::AudioEngine::isLoop(arg0);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_isLoop : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_isLoop : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_pauseAll(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        cocos2d::experimental::AudioEngine::pauseAll();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_pauseAll : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_uncacheAll(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        cocos2d::experimental::AudioEngine::uncacheAll();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_uncacheAll : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_setVolume(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 2) {
        int arg0 = 0;
        float arg1 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_setVolume : Error processing arguments");
        cocos2d::experimental::AudioEngine::setVolume(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_setVolume : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_preload(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::function<void (bool)> arg1;
            do {
			    if(JS_TypeOfValue(cx, args.get(1)) == JSTYPE_FUNCTION)
			    {
			        JS::RootedObject jstarget(cx);
			        if (args.thisv().isObject())
			        {
			            jstarget = args.thisv().toObjectOrNull();
			        }
			        JS::RootedObject jsfunc(cx, args.get(1).toObjectOrNull());
			        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
			        auto lambda = [=](bool larg0) -> void {
			            bool ok = true;
			            JS::AutoValueVector valArr(cx);
			            JS::RootedValue largv(cx);
			            largv = JS::BooleanValue(larg0);
			            valArr.append(largv);
			            if (!ok) { JS_ReportErrorUTF8(cx, "lambda function : Error parsing arguments"); return; }
			            JS::RootedValue rval(cx);
			            JS::HandleValueArray largsv(valArr);
			            bool succeed = func->invoke(largsv, &rval);
			            if (!succeed && JS_IsExceptionPending(cx)) {
			                handlePendingException(cx);
			            }
			        };
			        arg1 = lambda;
			    }
			    else
			    {
			        arg1 = nullptr;
			    }
			} while(0)
			;
            if (!ok) { ok = true; break; }
            cocos2d::experimental::AudioEngine::preload(arg0, arg1);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::experimental::AudioEngine::preload(arg0);
            return true;
        }
    } while (0);
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_preload : wrong number of arguments");
    return false;
}
bool js_cocos2dx_audioengine_AudioEngine_play2d(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_play2d : Error processing arguments");

        int ret = cocos2d::experimental::AudioEngine::play2d(arg0);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_play2d : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_play2d : Error processing arguments");

        int ret = cocos2d::experimental::AudioEngine::play2d(arg0, arg1);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_play2d : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        bool arg1;
        float arg2 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_play2d : Error processing arguments");

        int ret = cocos2d::experimental::AudioEngine::play2d(arg0, arg1, arg2);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_play2d : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 4) {
        std::string arg0;
        bool arg1;
        float arg2 = 0;
        const cocos2d::experimental::AudioProfile* arg3 = nullptr;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        do {
            if (args.get(3).isNull()) { arg3 = nullptr; break; }
            if (!args.get(3).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(3).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg3 = (const cocos2d::experimental::AudioProfile*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg3, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_play2d : Error processing arguments");

        int ret = cocos2d::experimental::AudioEngine::play2d(arg0, arg1, arg2, arg3);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_play2d : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_play2d : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_getState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getState : Error processing arguments");

        int ret = (int)cocos2d::experimental::AudioEngine::getState(arg0);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_getState : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_resume(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_resume : Error processing arguments");
        cocos2d::experimental::AudioEngine::resume(arg0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_resume : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_stop(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_stop : Error processing arguments");
        cocos2d::experimental::AudioEngine::stop(arg0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_stop : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_getDuration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getDuration : Error processing arguments");

        float ret = cocos2d::experimental::AudioEngine::getDuration(arg0);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getDuration : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_getDuration : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_setLoop(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 2) {
        int arg0 = 0;
        bool arg1;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_setLoop : Error processing arguments");
        cocos2d::experimental::AudioEngine::setLoop(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_setLoop : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_getDefaultProfile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        cocos2d::experimental::AudioProfile* ret = cocos2d::experimental::AudioEngine::getDefaultProfile();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        if (ret) {
        JS::RootedObject jsretObj(cx);
        js_get_or_create_jsobject<cocos2d::experimental::AudioProfile>(cx, (cocos2d::experimental::AudioProfile*)ret, &jsretObj);
        jsret = JS::ObjectOrNullValue(jsretObj);
    } else {
        jsret = JS::NullHandleValue;
    };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getDefaultProfile : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_getDefaultProfile : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_setFinishCallback(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 2) {
        int arg0 = 0;
        std::function<void (int, const std::basic_string<char> &)> arg1;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        do {
		    if(JS_TypeOfValue(cx, args.get(1)) == JSTYPE_FUNCTION)
		    {
		        JS::RootedObject jstarget(cx);
		        if (args.thisv().isObject())
		        {
		            jstarget = args.thisv().toObjectOrNull();
		        }
		        JS::RootedObject jsfunc(cx, args.get(1).toObjectOrNull());
		        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
		        auto lambda = [=](int larg0, const std::basic_string<char> & larg1) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            largv = JS::Int32Value(larg0);
		            valArr.append(largv);
		            ok &= std_string_to_jsval(cx, larg1, &largv);
		            valArr.append(largv);
		            if (!ok) { JS_ReportErrorUTF8(cx, "lambda function : Error parsing arguments"); return; }
		            JS::RootedValue rval(cx);
		            JS::HandleValueArray largsv(valArr);
		            bool succeed = func->invoke(largsv, &rval);
		            if (!succeed && JS_IsExceptionPending(cx)) {
		                handlePendingException(cx);
		            }
		        };
		        arg1 = lambda;
		    }
		    else
		    {
		        arg1 = nullptr;
		    }
		} while(0)
		;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_setFinishCallback : Error processing arguments");
        cocos2d::experimental::AudioEngine::setFinishCallback(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_setFinishCallback : wrong number of arguments");
    return false;
}

bool js_cocos2dx_audioengine_AudioEngine_getProfile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::experimental::AudioProfile* ret = cocos2d::experimental::AudioEngine::getProfile(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::experimental::AudioProfile>(cx, (cocos2d::experimental::AudioProfile*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getProfile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 1) {
            int arg0 = 0;
            ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
            if (!ok) { ok = true; break; }
            cocos2d::experimental::AudioProfile* ret = cocos2d::experimental::AudioEngine::getProfile(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::experimental::AudioProfile>(cx, (cocos2d::experimental::AudioProfile*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_audioengine_AudioEngine_getProfile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    JS_ReportErrorUTF8(cx, "js_cocos2dx_audioengine_AudioEngine_getProfile : wrong number of arguments");
    return false;
}

void js_register_cocos2dx_audioengine_AudioEngine(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_experimental_AudioEngine_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_experimental_AudioEngine_class = {
        "AudioEngine",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_experimental_AudioEngine_classOps
    };
    jsb_cocos2d_experimental_AudioEngine_class = &cocos2d_experimental_AudioEngine_class;

    static JSFunctionSpec st_funcs[] = {
        JS_FN("lazyInit", js_cocos2dx_audioengine_AudioEngine_lazyInit, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setCurrentTime", js_cocos2dx_audioengine_AudioEngine_setCurrentTime, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getVolume", js_cocos2dx_audioengine_AudioEngine_getVolume, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("uncache", js_cocos2dx_audioengine_AudioEngine_uncache, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("resumeAll", js_cocos2dx_audioengine_AudioEngine_resumeAll, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stopAll", js_cocos2dx_audioengine_AudioEngine_stopAll, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pause", js_cocos2dx_audioengine_AudioEngine_pause, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("end", js_cocos2dx_audioengine_AudioEngine_end, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMaxAudioInstance", js_cocos2dx_audioengine_AudioEngine_getMaxAudioInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCurrentTime", js_cocos2dx_audioengine_AudioEngine_getCurrentTime, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMaxAudioInstance", js_cocos2dx_audioengine_AudioEngine_setMaxAudioInstance, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isLoop", js_cocos2dx_audioengine_AudioEngine_isLoop, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pauseAll", js_cocos2dx_audioengine_AudioEngine_pauseAll, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("uncacheAll", js_cocos2dx_audioengine_AudioEngine_uncacheAll, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setVolume", js_cocos2dx_audioengine_AudioEngine_setVolume, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("preload", js_cocos2dx_audioengine_AudioEngine_preload, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("play2d", js_cocos2dx_audioengine_AudioEngine_play2d, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getState", js_cocos2dx_audioengine_AudioEngine_getState, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("resume", js_cocos2dx_audioengine_AudioEngine_resume, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stop", js_cocos2dx_audioengine_AudioEngine_stop, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDuration", js_cocos2dx_audioengine_AudioEngine_getDuration, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setLoop", js_cocos2dx_audioengine_AudioEngine_setLoop, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDefaultProfile", js_cocos2dx_audioengine_AudioEngine_getDefaultProfile, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setFinishCallback", js_cocos2dx_audioengine_AudioEngine_setFinishCallback, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getProfile", js_cocos2dx_audioengine_AudioEngine_getProfile, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_experimental_AudioEngine_class,
        empty_constructor, 0,
        nullptr,
        nullptr,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::experimental::AudioEngine>(cx, jsb_cocos2d_experimental_AudioEngine_class, proto);
    jsb_cocos2d_experimental_AudioEngine_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "AudioEngine", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

void register_all_cocos2dx_audioengine(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "jsb", &ns);

    js_register_cocos2dx_audioengine_AudioProfile(cx, ns);
    js_register_cocos2dx_audioengine_AudioEngine(cx, ns);
}

#endif //#if (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT || CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
