#include "scripting/js-bindings/auto/jsb_cocos2dx_spine_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "spine/spine-cocos2dx.h"
#include "spine/jsb_cocos2dx_spine_manual.h"

JSClass  *jsb_spine_SkeletonRenderer_class;
JS::PersistentRootedObject *jsb_spine_SkeletonRenderer_prototype;

bool js_cocos2dx_spine_SkeletonRenderer_setTimeScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setTimeScale : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setTimeScale : Error processing arguments");
        cobj->setTimeScale(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_setTimeScale : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_getDebugSlotsEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_getDebugSlotsEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->getDebugSlotsEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_getDebugSlotsEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_getDebugSlotsEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_setAttachment(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    spine::SkeletonRenderer* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setAttachment : Invalid Native Object");
    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            const char* arg1 = nullptr;
            std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
            if (!ok) { ok = true; break; }
            bool ret = cobj->setAttachment(arg0, arg1);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setAttachment : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            bool ret = cobj->setAttachment(arg0, arg1);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setAttachment : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_setAttachment : arguments error");
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_setBonesToSetupPose(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setBonesToSetupPose : Invalid Native Object");
    if (argc == 0) {
        cobj->setBonesToSetupPose();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_setBonesToSetupPose : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_setDebugSlotsEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setDebugSlotsEnabled : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setDebugSlotsEnabled : Error processing arguments");
        cobj->setDebugSlotsEnabled(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_setDebugSlotsEnabled : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_initWithJsonFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    spine::SkeletonRenderer* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_initWithJsonFile : Invalid Native Object");
    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            cobj->initWithJsonFile(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            cobj->initWithJsonFile(arg0, arg1, arg2);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            cobj->initWithJsonFile(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            cobj->initWithJsonFile(arg0, arg1, arg2);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_initWithJsonFile : arguments error");
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_setSlotsToSetupPose(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setSlotsToSetupPose : Invalid Native Object");
    if (argc == 0) {
        cobj->setSlotsToSetupPose();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_setSlotsToSetupPose : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_initWithBinaryFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    spine::SkeletonRenderer* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_initWithBinaryFile : Invalid Native Object");
    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            cobj->initWithBinaryFile(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            cobj->initWithBinaryFile(arg0, arg1, arg2);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            cobj->initWithBinaryFile(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            cobj->initWithBinaryFile(arg0, arg1, arg2);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_initWithBinaryFile : arguments error");
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_setToSetupPose(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setToSetupPose : Invalid Native Object");
    if (argc == 0) {
        cobj->setToSetupPose();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_setToSetupPose : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_getBlendFunc : Invalid Native Object");
    if (argc == 0) {
        const cocos2d::BlendFunc& ret = cobj->getBlendFunc();
        JS::RootedValue jsret(cx);
        ok &= blendfunc_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_getBlendFunc : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_getBlendFunc : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_updateWorldTransform(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_updateWorldTransform : Invalid Native Object");
    if (argc == 0) {
        cobj->updateWorldTransform();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_updateWorldTransform : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_initialize(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_initialize : Invalid Native Object");
    if (argc == 0) {
        cobj->initialize();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_initialize : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_setDebugBonesEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setDebugBonesEnabled : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setDebugBonesEnabled : Error processing arguments");
        cobj->setDebugBonesEnabled(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_setDebugBonesEnabled : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_getDebugBonesEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_getDebugBonesEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->getDebugBonesEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_getDebugBonesEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_getDebugBonesEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_getTimeScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_getTimeScale : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getTimeScale();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_getTimeScale : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_getTimeScale : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setBlendFunc : Invalid Native Object");
    if (argc == 1) {
        cocos2d::BlendFunc arg0;
        ok &= jsval_to_blendfunc(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setBlendFunc : Error processing arguments");
        cobj->setBlendFunc(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_setBlendFunc : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_setSkin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    spine::SkeletonRenderer* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setSkin : Invalid Native Object");
    do {
        ok = true;
        if (argc == 1) {
            const char* arg0 = nullptr;
            std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
            if (!ok) { ok = true; break; }
            bool ret = cobj->setSkin(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setSkin : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->setSkin(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_setSkin : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_setSkin : arguments error");
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_getSkeleton(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_getSkeleton : Invalid Native Object");
    if (argc == 0) {
        spSkeleton* ret = cobj->getSkeleton();
        JS::RootedValue jsret(cx);
        if (ret) { ok &= spskeleton_to_jsval(cx, *ret, &jsret); } else { jsret = JS::NullHandleValue; };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_getSkeleton : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_getSkeleton : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_drawDebug(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonRenderer* cobj = (spine::SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonRenderer_drawDebug : Invalid Native Object");
    if (argc == 3) {
        cocos2d::Renderer* arg0 = nullptr;
        cocos2d::Mat4 arg1;
        unsigned int arg2 = 0;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Renderer*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_matrix(cx, args.get(1), &arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_drawDebug : Error processing arguments");
        cobj->drawDebug(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_drawDebug : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_createWithFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* ret = spine::SkeletonRenderer::createWithFile(arg0, arg1);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonRenderer>(cx, (spine::SkeletonRenderer*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_createWithFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* ret = spine::SkeletonRenderer::createWithFile(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonRenderer>(cx, (spine::SkeletonRenderer*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_createWithFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 0) {
            spine::SkeletonRenderer* ret = spine::SkeletonRenderer::create();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonRenderer>(cx, (spine::SkeletonRenderer*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_createWithFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* ret = spine::SkeletonRenderer::createWithFile(arg0, arg1);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonRenderer>(cx, (spine::SkeletonRenderer*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_createWithFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* ret = spine::SkeletonRenderer::createWithFile(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonRenderer>(cx, (spine::SkeletonRenderer*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonRenderer_createWithFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_createWithFile : wrong number of arguments");
    return false;
}
bool js_cocos2dx_spine_SkeletonRenderer_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    spine::SkeletonRenderer* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    do {
        ok = true;
        if (argc == 1) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
			ok = false;
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonRenderer(arg0);

            JS::RootedObject proto(cx, jsb_spine_SkeletonRenderer_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonRenderer_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonRenderer");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
			ok = false;
            if (!ok) { ok = true; break; }
            bool arg1;
            ok &= jsval_to_bool(cx, args.get(1), &arg1);
            cobj = new (std::nothrow) spine::SkeletonRenderer(arg0, arg1);

            JS::RootedObject proto(cx, jsb_spine_SkeletonRenderer_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonRenderer_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonRenderer");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            cobj = new (std::nothrow) spine::SkeletonRenderer();

            JS::RootedObject proto(cx, jsb_spine_SkeletonRenderer_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonRenderer_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonRenderer");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonRenderer(arg0, arg1);

            JS::RootedObject proto(cx, jsb_spine_SkeletonRenderer_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonRenderer_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonRenderer");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonRenderer(arg0, arg1, arg2);

            JS::RootedObject proto(cx, jsb_spine_SkeletonRenderer_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonRenderer_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonRenderer");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonRenderer(arg0, arg1);

            JS::RootedObject proto(cx, jsb_spine_SkeletonRenderer_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonRenderer_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonRenderer");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonRenderer(arg0, arg1, arg2);

            JS::RootedObject proto(cx, jsb_spine_SkeletonRenderer_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonRenderer_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonRenderer");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    if (cobj)
    {
        JS::RootedValue objVal(cx, JS::ObjectOrNullValue(obj));
        if (JS_HasProperty(cx, obj, "_ctor", &ok) && ok)
        {
            JS::HandleValueArray argsv(args);
            ScriptingCore::getInstance()->executeFunctionWithOwner(objVal, "_ctor", argsv);
        }
        args.rval().set(objVal);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonRenderer_constructor : arguments error");
    return false;
}


extern JS::PersistentRootedObject *jsb_cocos2d_Node_prototype;

void js_register_cocos2dx_spine_SkeletonRenderer(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps spine_SkeletonRenderer_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass spine_SkeletonRenderer_class = {
        "Skeleton",
        JSCLASS_HAS_PRIVATE,
        &spine_SkeletonRenderer_classOps
    };
    jsb_spine_SkeletonRenderer_class = &spine_SkeletonRenderer_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("setTimeScale", js_cocos2dx_spine_SkeletonRenderer_setTimeScale, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDebugSlotsEnabled", js_cocos2dx_spine_SkeletonRenderer_getDebugSlotsEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setAttachment", js_cocos2dx_spine_SkeletonRenderer_setAttachment, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setBonesToSetupPose", js_cocos2dx_spine_SkeletonRenderer_setBonesToSetupPose, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setDebugSlotsEnabled", js_cocos2dx_spine_SkeletonRenderer_setDebugSlotsEnabled, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithJsonFile", js_cocos2dx_spine_SkeletonRenderer_initWithJsonFile, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setSlotsToSetupPose", js_cocos2dx_spine_SkeletonRenderer_setSlotsToSetupPose, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithBinaryFile", js_cocos2dx_spine_SkeletonRenderer_initWithBinaryFile, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setToSetupPose", js_cocos2dx_spine_SkeletonRenderer_setToSetupPose, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBlendFunc", js_cocos2dx_spine_SkeletonRenderer_getBlendFunc, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("updateWorldTransform", js_cocos2dx_spine_SkeletonRenderer_updateWorldTransform, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initialize", js_cocos2dx_spine_SkeletonRenderer_initialize, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setDebugBonesEnabled", js_cocos2dx_spine_SkeletonRenderer_setDebugBonesEnabled, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDebugBonesEnabled", js_cocos2dx_spine_SkeletonRenderer_getDebugBonesEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTimeScale", js_cocos2dx_spine_SkeletonRenderer_getTimeScale, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setBlendFunc", js_cocos2dx_spine_SkeletonRenderer_setBlendFunc, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setSkin", js_cocos2dx_spine_SkeletonRenderer_setSkin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSkeleton", js_cocos2dx_spine_SkeletonRenderer_getSkeleton, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("drawDebug", js_cocos2dx_spine_SkeletonRenderer_drawDebug, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_spine_SkeletonRenderer_createWithFile, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Node_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_spine_SkeletonRenderer_class,
        js_cocos2dx_spine_SkeletonRenderer_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<spine::SkeletonRenderer>(cx, jsb_spine_SkeletonRenderer_class, proto);
    jsb_spine_SkeletonRenderer_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "SkeletonRenderer", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_spine_SkeletonAnimation_class;
JS::PersistentRootedObject *jsb_spine_SkeletonAnimation_prototype;

bool js_cocos2dx_spine_SkeletonAnimation_findAnimation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonAnimation_findAnimation : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_findAnimation : Error processing arguments");
        spAnimation* ret = cobj->findAnimation(arg0);
        JS::RootedValue jsret(cx);
        if (ret) { ok &= spanimation_to_jsval(cx, *ret, &jsret); } else { jsret = JS::NullHandleValue; };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_findAnimation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_findAnimation : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_setMix(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setMix : Invalid Native Object");
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        float arg2 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setMix : Error processing arguments");
        cobj->setMix(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_setMix : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_setDisposeListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setDisposeListener : Invalid Native Object");
    if (argc == 1) {
        std::function<void (spTrackEntry *)> arg0;
        do {
		    if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
		    {
		        JS::RootedObject jstarget(cx);
		        if (args.thisv().isObject())
		        {
		            jstarget = args.thisv().toObjectOrNull();
		        }
		        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
		        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
		        auto lambda = [=](spTrackEntry* larg0) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            if (larg0) { ok &= sptrackentry_to_jsval(cx, *larg0, &largv); } else { largv = JS::NullHandleValue; };
		            valArr.append(largv);
		            if (!ok) { JS_ReportErrorUTF8(cx, "lambda function : Error parsing arguments"); return; }
		            JS::RootedValue rval(cx);
		            JS::HandleValueArray largsv(valArr);
		            bool succeed = func->invoke(largsv, &rval);
		            if (!succeed && JS_IsExceptionPending(cx)) {
		                handlePendingException(cx);
		            }
		        };
		        arg0 = lambda;
		    }
		    else
		    {
		        arg0 = nullptr;
		    }
		} while(0)
		;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setDisposeListener : Error processing arguments");
        cobj->setDisposeListener(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_setDisposeListener : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_setEndListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setEndListener : Invalid Native Object");
    if (argc == 1) {
        std::function<void (spTrackEntry *)> arg0;
        do {
		    if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
		    {
		        JS::RootedObject jstarget(cx);
		        if (args.thisv().isObject())
		        {
		            jstarget = args.thisv().toObjectOrNull();
		        }
		        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
		        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
		        auto lambda = [=](spTrackEntry* larg0) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            if (larg0) { ok &= sptrackentry_to_jsval(cx, *larg0, &largv); } else { largv = JS::NullHandleValue; };
		            valArr.append(largv);
		            if (!ok) { JS_ReportErrorUTF8(cx, "lambda function : Error parsing arguments"); return; }
		            JS::RootedValue rval(cx);
		            JS::HandleValueArray largsv(valArr);
		            bool succeed = func->invoke(largsv, &rval);
		            if (!succeed && JS_IsExceptionPending(cx)) {
		                handlePendingException(cx);
		            }
		        };
		        arg0 = lambda;
		    }
		    else
		    {
		        arg0 = nullptr;
		    }
		} while(0)
		;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setEndListener : Error processing arguments");
        cobj->setEndListener(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_setEndListener : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_getState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonAnimation_getState : Invalid Native Object");
    if (argc == 0) {
        spAnimationState* ret = cobj->getState();
        JS::RootedValue jsret(cx);
        if (ret) { ok &= spanimationstate_to_jsval(cx, *ret, &jsret); } else { jsret = JS::NullHandleValue; };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_getState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_getState : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_setCompleteListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setCompleteListener : Invalid Native Object");
    if (argc == 1) {
        std::function<void (spTrackEntry *)> arg0;
        do {
		    if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
		    {
		        JS::RootedObject jstarget(cx);
		        if (args.thisv().isObject())
		        {
		            jstarget = args.thisv().toObjectOrNull();
		        }
		        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
		        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
		        auto lambda = [=](spTrackEntry* larg0) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            if (larg0) { ok &= sptrackentry_to_jsval(cx, *larg0, &largv); } else { largv = JS::NullHandleValue; };
		            valArr.append(largv);
		            if (!ok) { JS_ReportErrorUTF8(cx, "lambda function : Error parsing arguments"); return; }
		            JS::RootedValue rval(cx);
		            JS::HandleValueArray largsv(valArr);
		            bool succeed = func->invoke(largsv, &rval);
		            if (!succeed && JS_IsExceptionPending(cx)) {
		                handlePendingException(cx);
		            }
		        };
		        arg0 = lambda;
		    }
		    else
		    {
		        arg0 = nullptr;
		    }
		} while(0)
		;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setCompleteListener : Error processing arguments");
        cobj->setCompleteListener(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_setCompleteListener : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_setEventListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setEventListener : Invalid Native Object");
    if (argc == 1) {
        std::function<void (spTrackEntry *, spEvent *)> arg0;
        do {
		    if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
		    {
		        JS::RootedObject jstarget(cx);
		        if (args.thisv().isObject())
		        {
		            jstarget = args.thisv().toObjectOrNull();
		        }
		        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
		        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
		        auto lambda = [=](spTrackEntry* larg0, spEvent* larg1) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            if (larg0) { ok &= sptrackentry_to_jsval(cx, *larg0, &largv); } else { largv = JS::NullHandleValue; };
		            valArr.append(largv);
		            if (larg1) { ok &= spevent_to_jsval(cx, *larg1, &largv); } else { largv = JS::NullHandleValue; };
		            valArr.append(largv);
		            if (!ok) { JS_ReportErrorUTF8(cx, "lambda function : Error parsing arguments"); return; }
		            JS::RootedValue rval(cx);
		            JS::HandleValueArray largsv(valArr);
		            bool succeed = func->invoke(largsv, &rval);
		            if (!succeed && JS_IsExceptionPending(cx)) {
		                handlePendingException(cx);
		            }
		        };
		        arg0 = lambda;
		    }
		    else
		    {
		        arg0 = nullptr;
		    }
		} while(0)
		;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setEventListener : Error processing arguments");
        cobj->setEventListener(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_setEventListener : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_clearTrack(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonAnimation_clearTrack : Invalid Native Object");
    if (argc == 0) {
        cobj->clearTrack();
        args.rval().setUndefined();
        return true;
    }
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_clearTrack : Error processing arguments");
        cobj->clearTrack(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_clearTrack : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_setInterruptListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setInterruptListener : Invalid Native Object");
    if (argc == 1) {
        std::function<void (spTrackEntry *)> arg0;
        do {
		    if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
		    {
		        JS::RootedObject jstarget(cx);
		        if (args.thisv().isObject())
		        {
		            jstarget = args.thisv().toObjectOrNull();
		        }
		        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
		        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
		        auto lambda = [=](spTrackEntry* larg0) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            if (larg0) { ok &= sptrackentry_to_jsval(cx, *larg0, &largv); } else { largv = JS::NullHandleValue; };
		            valArr.append(largv);
		            if (!ok) { JS_ReportErrorUTF8(cx, "lambda function : Error parsing arguments"); return; }
		            JS::RootedValue rval(cx);
		            JS::HandleValueArray largsv(valArr);
		            bool succeed = func->invoke(largsv, &rval);
		            if (!succeed && JS_IsExceptionPending(cx)) {
		                handlePendingException(cx);
		            }
		        };
		        arg0 = lambda;
		    }
		    else
		    {
		        arg0 = nullptr;
		    }
		} while(0)
		;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setInterruptListener : Error processing arguments");
        cobj->setInterruptListener(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_setInterruptListener : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_clearTracks(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonAnimation_clearTracks : Invalid Native Object");
    if (argc == 0) {
        cobj->clearTracks();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_clearTracks : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_setStartListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setStartListener : Invalid Native Object");
    if (argc == 1) {
        std::function<void (spTrackEntry *)> arg0;
        do {
		    if(JS_TypeOfValue(cx, args.get(0)) == JSTYPE_FUNCTION)
		    {
		        JS::RootedObject jstarget(cx);
		        if (args.thisv().isObject())
		        {
		            jstarget = args.thisv().toObjectOrNull();
		        }
		        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
		        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
		        auto lambda = [=](spTrackEntry* larg0) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            if (larg0) { ok &= sptrackentry_to_jsval(cx, *larg0, &largv); } else { largv = JS::NullHandleValue; };
		            valArr.append(largv);
		            if (!ok) { JS_ReportErrorUTF8(cx, "lambda function : Error parsing arguments"); return; }
		            JS::RootedValue rval(cx);
		            JS::HandleValueArray largsv(valArr);
		            bool succeed = func->invoke(largsv, &rval);
		            if (!succeed && JS_IsExceptionPending(cx)) {
		                handlePendingException(cx);
		            }
		        };
		        arg0 = lambda;
		    }
		    else
		    {
		        arg0 = nullptr;
		    }
		} while(0)
		;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_setStartListener : Error processing arguments");
        cobj->setStartListener(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_setStartListener : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            spine::SkeletonAnimation* ret = spine::SkeletonAnimation::createWithBinaryFile(arg0, arg1);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonAnimation>(cx, (spine::SkeletonAnimation*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            spine::SkeletonAnimation* ret = spine::SkeletonAnimation::createWithBinaryFile(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonAnimation>(cx, (spine::SkeletonAnimation*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            spine::SkeletonAnimation* ret = spine::SkeletonAnimation::createWithBinaryFile(arg0, arg1);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonAnimation>(cx, (spine::SkeletonAnimation*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            spine::SkeletonAnimation* ret = spine::SkeletonAnimation::createWithBinaryFile(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonAnimation>(cx, (spine::SkeletonAnimation*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile : wrong number of arguments");
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        auto ret = spine::SkeletonAnimation::create();
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_spine_SkeletonAnimation_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_spine_SkeletonAnimation_class, proto, &jsret, "spine::SkeletonAnimation");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            spine::SkeletonAnimation* ret = spine::SkeletonAnimation::createWithJsonFile(arg0, arg1);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonAnimation>(cx, (spine::SkeletonAnimation*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            spine::SkeletonAnimation* ret = spine::SkeletonAnimation::createWithJsonFile(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonAnimation>(cx, (spine::SkeletonAnimation*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            spine::SkeletonAnimation* ret = spine::SkeletonAnimation::createWithJsonFile(arg0, arg1);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonAnimation>(cx, (spine::SkeletonAnimation*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            spine::SkeletonAnimation* ret = spine::SkeletonAnimation::createWithJsonFile(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<spine::SkeletonAnimation>(cx, (spine::SkeletonAnimation*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile : wrong number of arguments");
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    spine::SkeletonAnimation* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    do {
        ok = true;
        if (argc == 1) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
			ok = false;
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0);

            JS::RootedObject proto(cx, jsb_spine_SkeletonAnimation_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonAnimation_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
			ok = false;
            if (!ok) { ok = true; break; }
            bool arg1;
            ok &= jsval_to_bool(cx, args.get(1), &arg1);
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);

            JS::RootedObject proto(cx, jsb_spine_SkeletonAnimation_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonAnimation_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            cobj = new (std::nothrow) spine::SkeletonAnimation();

            JS::RootedObject proto(cx, jsb_spine_SkeletonAnimation_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonAnimation_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);

            JS::RootedObject proto(cx, jsb_spine_SkeletonAnimation_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonAnimation_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1, arg2);

            JS::RootedObject proto(cx, jsb_spine_SkeletonAnimation_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonAnimation_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);

            JS::RootedObject proto(cx, jsb_spine_SkeletonAnimation_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonAnimation_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1, arg2);

            JS::RootedObject proto(cx, jsb_spine_SkeletonAnimation_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_spine_SkeletonAnimation_class, proto);
            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    if (cobj)
    {
        JS::RootedValue objVal(cx, JS::ObjectOrNullValue(obj));
        if (JS_HasProperty(cx, obj, "_ctor", &ok) && ok)
        {
            JS::HandleValueArray argsv(args);
            ScriptingCore::getInstance()->executeFunctionWithOwner(objVal, "_ctor", argsv);
        }
        args.rval().set(objVal);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_constructor : arguments error");
    return false;
}
bool js_cocos2dx_spine_SkeletonAnimation_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    spine::SkeletonAnimation* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    do {
        ok = true;
        if (argc == 1) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
			ok = false;
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0);

            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            spSkeletonData* arg0 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spSkeletonData*
			ok = false;
            if (!ok) { ok = true; break; }
            bool arg1;
            ok &= jsval_to_bool(cx, args.get(1), &arg1);
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);

            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            cobj = new (std::nothrow) spine::SkeletonAnimation();

            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);

            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            spAtlas* arg1 = nullptr;
            #pragma warning NO CONVERSION TO NATIVE FOR spAtlas*
			ok = false;
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1, arg2);

            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1);

            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= jsval_to_float(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) spine::SkeletonAnimation(arg0, arg1, arg2);

            jsb_ref_init(cx, obj, cobj, "spine::SkeletonAnimation");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    if (cobj)
    {
        JS::RootedValue objVal(cx, JS::ObjectOrNullValue(obj));
        if (JS_HasProperty(cx, obj, "_ctor", &ok) && ok)
        {
            JS::HandleValueArray argsv(args);
            ScriptingCore::getInstance()->executeFunctionWithOwner(objVal, "_ctor", argsv);
        }
        args.rval().set(objVal);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_spine_SkeletonAnimation_ctor : arguments error");
    return false;
}


extern JS::PersistentRootedObject *jsb_spine_SkeletonRenderer_prototype;

    
void js_register_cocos2dx_spine_SkeletonAnimation(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps spine_SkeletonAnimation_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass spine_SkeletonAnimation_class = {
        "SkeletonAnimation",
        JSCLASS_HAS_PRIVATE,
        &spine_SkeletonAnimation_classOps
    };
    jsb_spine_SkeletonAnimation_class = &spine_SkeletonAnimation_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("findAnimation", js_cocos2dx_spine_SkeletonAnimation_findAnimation, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMix", js_cocos2dx_spine_SkeletonAnimation_setMix, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setDisposeListener", js_cocos2dx_spine_SkeletonAnimation_setDisposeListener, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setEndListener", js_cocos2dx_spine_SkeletonAnimation_setEndListener, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getState", js_cocos2dx_spine_SkeletonAnimation_getState, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setCompleteListenerNative", js_cocos2dx_spine_SkeletonAnimation_setCompleteListener, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setEventListener", js_cocos2dx_spine_SkeletonAnimation_setEventListener, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("clearTrack", js_cocos2dx_spine_SkeletonAnimation_clearTrack, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setInterruptListener", js_cocos2dx_spine_SkeletonAnimation_setInterruptListener, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("clearTracks", js_cocos2dx_spine_SkeletonAnimation_clearTracks, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setStartListener", js_cocos2dx_spine_SkeletonAnimation_setStartListener, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_cocos2dx_spine_SkeletonAnimation_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("createWithBinaryFile", js_cocos2dx_spine_SkeletonAnimation_createWithBinaryFile, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("create", js_cocos2dx_spine_SkeletonAnimation_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("createWithJsonFile", js_cocos2dx_spine_SkeletonAnimation_createWithJsonFile, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_spine_SkeletonRenderer_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_spine_SkeletonAnimation_class,
        js_cocos2dx_spine_SkeletonAnimation_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<spine::SkeletonAnimation>(cx, jsb_spine_SkeletonAnimation_class, proto);
    jsb_spine_SkeletonAnimation_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "SkeletonAnimation", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

void register_all_cocos2dx_spine(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "sp", &ns);

    js_register_cocos2dx_spine_SkeletonRenderer(cx, ns);
    js_register_cocos2dx_spine_SkeletonAnimation(cx, ns);
}

