#include "scripting/js-bindings/auto/jsb_creator_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "creator/CCScale9Sprite.h"
#include "creator/CCGraphicsNode.h"
#include "editor-support/creator/physics/CCPhysicsDebugDraw.h"
#include "editor-support/creator/physics/CCPhysicsUtils.h"
#include "editor-support/creator/physics/CCPhysicsContactListener.h"
#include "editor-support/creator/physics/CCPhysicsAABBQueryCallback.h"
#include "editor-support/creator/physics/CCPhysicsRayCastCallback.h"
#include "editor-support/creator/physics/CCPhysicsWorldManifoldWrapper.h"
#include "editor-support/creator/physics/CCPhysicsContactImpulse.h"
#include "editor-support/creator/CCCameraNode.h"
#include "scripting/js-bindings/manual/box2d/js_bindings_box2d_manual.h"

JSClass  *jsb_creator_Scale9SpriteV2_class;
JS::PersistentRootedObject *jsb_creator_Scale9SpriteV2_prototype;

bool js_creator_Scale9SpriteV2_setTexture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setTexture : Invalid Native Object");
    do {
        ok = true;
        if (argc == 1) {
            cocos2d::Texture2D* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::Texture2D*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->setTexture(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setTexture : error parsing return value");
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
            bool ret = cobj->setTexture(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setTexture : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setTexture : arguments error");
    return false;
}
bool js_creator_Scale9SpriteV2_getFillType(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getFillType : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getFillType();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_getFillType : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_getFillType : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isTrimmedContentSizeEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_getState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getState : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getState();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_getState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_getState : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setState : Invalid Native Object");
    if (argc == 1) {
        creator::Scale9SpriteV2::State arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setState : Error processing arguments");
        cobj->setState(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setState : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setInsetBottom(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setInsetBottom : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setInsetBottom : Error processing arguments");
        cobj->setInsetBottom(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setInsetBottom : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setFillRange(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setFillRange : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setFillRange : Error processing arguments");
        cobj->setFillRange(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setFillRange : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_getFillStart(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getFillStart : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getFillStart();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_getFillStart : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_getFillStart : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_getFillRange(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getFillRange : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getFillRange();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_getFillRange : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_getFillRange : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setInsetTop(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setInsetTop : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setInsetTop : Error processing arguments");
        cobj->setInsetTop(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setInsetTop : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setRenderingType(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setRenderingType : Invalid Native Object");
    if (argc == 1) {
        creator::Scale9SpriteV2::RenderingType arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setRenderingType : Error processing arguments");
        cobj->setRenderingType(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setRenderingType : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setDistortionOffset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setDistortionOffset : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setDistortionOffset : Error processing arguments");
        cobj->setDistortionOffset(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setDistortionOffset : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setFillCenter(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setFillCenter : Invalid Native Object");
    do {
        ok = true;
        if (argc == 2) {
            float arg0 = 0;
            ok &= jsval_to_float(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            float arg1 = 0;
            ok &= jsval_to_float(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            cobj->setFillCenter(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 1) {
            cocos2d::Vec2 arg0;
            ok &= jsval_to_vector2(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cobj->setFillCenter(arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setFillCenter : arguments error");
    return false;
}
bool js_creator_Scale9SpriteV2_setSpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setSpriteFrame : Invalid Native Object");
    do {
        ok = true;
        if (argc == 1) {
            cocos2d::SpriteFrame* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::SpriteFrame*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->setSpriteFrame(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setSpriteFrame : error parsing return value");
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
            bool ret = cobj->setSpriteFrame(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setSpriteFrame : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setSpriteFrame : arguments error");
    return false;
}
bool js_creator_Scale9SpriteV2_getBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getBlendFunc : Invalid Native Object");
    if (argc == 0) {
        const cocos2d::BlendFunc& ret = cobj->getBlendFunc();
        JS::RootedValue jsret(cx);
        ok &= blendfunc_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_getBlendFunc : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_getBlendFunc : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_initWithTexture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_initWithTexture : Invalid Native Object");
    do {
        ok = true;
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithTexture(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_initWithTexture : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 1) {
            cocos2d::Texture2D* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::Texture2D*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithTexture(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_initWithTexture : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_initWithTexture : arguments error");
    return false;
}
bool js_creator_Scale9SpriteV2_getInsetLeft(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getInsetLeft : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getInsetLeft();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_getInsetLeft : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_getInsetLeft : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_getInsetBottom(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getInsetBottom : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getInsetBottom();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_getInsetBottom : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_getInsetBottom : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setDistortionTiling(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setDistortionTiling : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setDistortionTiling : Error processing arguments");
        cobj->setDistortionTiling(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setDistortionTiling : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_getRenderingType(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getRenderingType : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getRenderingType();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_getRenderingType : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_getRenderingType : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setFillStart(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setFillStart : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setFillStart : Error processing arguments");
        cobj->setFillStart(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setFillStart : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_getInsetRight(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getInsetRight : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getInsetRight();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_getInsetRight : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_getInsetRight : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setBlendFunc(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setBlendFunc : Invalid Native Object");
    do {
        ok = true;
        if (argc == 2) {
            unsigned int arg0 = 0;
            ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
            if (!ok) { ok = true; break; }
            unsigned int arg1 = 0;
            ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
            if (!ok) { ok = true; break; }
            cobj->setBlendFunc(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 1) {
            cocos2d::BlendFunc arg0;
            ok &= jsval_to_blendfunc(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cobj->setBlendFunc(arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setBlendFunc : arguments error");
    return false;
}
bool js_creator_Scale9SpriteV2_getFillCenter(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getFillCenter : Invalid Native Object");
    if (argc == 0) {
        const cocos2d::Vec2& ret = cobj->getFillCenter();
        JS::RootedValue jsret(cx);
        ok &= vector2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_getFillCenter : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_getFillCenter : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_getInsetTop(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getInsetTop : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getInsetTop();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_getInsetTop : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_getInsetTop : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setInsetLeft(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setInsetLeft : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setInsetLeft : Error processing arguments");
        cobj->setInsetLeft(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setInsetLeft : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_initWithSpriteFrame(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_initWithSpriteFrame : Invalid Native Object");
    do {
        ok = true;
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithSpriteFrame(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_initWithSpriteFrame : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 1) {
            cocos2d::SpriteFrame* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::SpriteFrame*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithSpriteFrame(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_initWithSpriteFrame : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_initWithSpriteFrame : arguments error");
    return false;
}
bool js_creator_Scale9SpriteV2_setFillType(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setFillType : Invalid Native Object");
    if (argc == 1) {
        creator::Scale9SpriteV2::FillType arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setFillType : Error processing arguments");
        cobj->setFillType(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setFillType : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setInsetRight(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setInsetRight : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setInsetRight : Error processing arguments");
        cobj->setInsetRight(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_setInsetRight : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_enableTrimmedContentSize(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_enableTrimmedContentSize : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_enableTrimmedContentSize : Error processing arguments");
        cobj->enableTrimmedContentSize(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_Scale9SpriteV2_enableTrimmedContentSize : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::Scale9SpriteV2* cobj = new (std::nothrow) creator::Scale9SpriteV2();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_creator_Scale9SpriteV2_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_creator_Scale9SpriteV2_class, proto, &jsobj, "creator::Scale9SpriteV2");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}
static bool js_creator_Scale9SpriteV2_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    creator::Scale9SpriteV2 *nobj = new (std::nothrow) creator::Scale9SpriteV2();
    jsb_ref_init(cx, obj, nobj, "creator::Scale9SpriteV2");
    jsb_new_proxy(cx, nobj, obj);
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
    {
        JS::HandleValueArray argsv(args);
        JS::RootedValue objVal(cx, JS::ObjectOrNullValue(obj));
        ScriptingCore::getInstance()->executeFunctionWithOwner(objVal, "_ctor", argsv);
    }
    args.rval().setUndefined();
    return true;
}


extern JS::PersistentRootedObject *jsb_cocos2d_Node_prototype;

    
void js_register_creator_Scale9SpriteV2(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps creator_Scale9SpriteV2_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass creator_Scale9SpriteV2_class = {
        "Scale9SpriteV2",
        JSCLASS_HAS_PRIVATE,
        &creator_Scale9SpriteV2_classOps
    };
    jsb_creator_Scale9SpriteV2_class = &creator_Scale9SpriteV2_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("setTexture", js_creator_Scale9SpriteV2_setTexture, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getFillType", js_creator_Scale9SpriteV2_getFillType, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isTrimmedContentSizeEnabled", js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getState", js_creator_Scale9SpriteV2_getState, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setState", js_creator_Scale9SpriteV2_setState, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setInsetBottom", js_creator_Scale9SpriteV2_setInsetBottom, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setFillRange", js_creator_Scale9SpriteV2_setFillRange, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getFillStart", js_creator_Scale9SpriteV2_getFillStart, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getFillRange", js_creator_Scale9SpriteV2_getFillRange, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setInsetTop", js_creator_Scale9SpriteV2_setInsetTop, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setRenderingType", js_creator_Scale9SpriteV2_setRenderingType, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setDistortionOffset", js_creator_Scale9SpriteV2_setDistortionOffset, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setFillCenter", js_creator_Scale9SpriteV2_setFillCenter, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setSpriteFrame", js_creator_Scale9SpriteV2_setSpriteFrame, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBlendFunc", js_creator_Scale9SpriteV2_getBlendFunc, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithTexture", js_creator_Scale9SpriteV2_initWithTexture, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getInsetLeft", js_creator_Scale9SpriteV2_getInsetLeft, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getInsetBottom", js_creator_Scale9SpriteV2_getInsetBottom, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setDistortionTiling", js_creator_Scale9SpriteV2_setDistortionTiling, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getRenderingType", js_creator_Scale9SpriteV2_getRenderingType, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setFillStart", js_creator_Scale9SpriteV2_setFillStart, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getInsetRight", js_creator_Scale9SpriteV2_getInsetRight, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setBlendFunc", js_creator_Scale9SpriteV2_setBlendFunc, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getFillCenter", js_creator_Scale9SpriteV2_getFillCenter, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getInsetTop", js_creator_Scale9SpriteV2_getInsetTop, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setInsetLeft", js_creator_Scale9SpriteV2_setInsetLeft, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithSpriteFrame", js_creator_Scale9SpriteV2_initWithSpriteFrame, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setFillType", js_creator_Scale9SpriteV2_setFillType, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setInsetRight", js_creator_Scale9SpriteV2_setInsetRight, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("enableTrimmedContentSize", js_creator_Scale9SpriteV2_enableTrimmedContentSize, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_creator_Scale9SpriteV2_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Node_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_Scale9SpriteV2_class,
        js_creator_Scale9SpriteV2_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<creator::Scale9SpriteV2>(cx, jsb_creator_Scale9SpriteV2_class, proto);
    jsb_creator_Scale9SpriteV2_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "Scale9SpriteV2", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

JSClass  *jsb_creator_GraphicsNode_class;
JS::PersistentRootedObject *jsb_creator_GraphicsNode_prototype;

bool js_creator_GraphicsNode_quadraticCurveTo(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_quadraticCurveTo : Invalid Native Object");
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        ok &= jsval_to_float(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_quadraticCurveTo : Error processing arguments");
        cobj->quadraticCurveTo(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_quadraticCurveTo : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_creator_GraphicsNode_moveTo(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_moveTo : Invalid Native Object");
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_moveTo : Error processing arguments");
        cobj->moveTo(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_moveTo : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_creator_GraphicsNode_lineTo(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_lineTo : Invalid Native Object");
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_lineTo : Error processing arguments");
        cobj->lineTo(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_lineTo : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_creator_GraphicsNode_stroke(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_stroke : Invalid Native Object");
    if (argc == 0) {
        cobj->stroke();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_stroke : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_arc(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_arc : Invalid Native Object");
    if (argc == 6) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        bool arg5;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        ok &= jsval_to_float(cx, args.get(3), &arg3);
        ok &= jsval_to_float(cx, args.get(4), &arg4);
        ok &= jsval_to_bool(cx, args.get(5), &arg5);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_arc : Error processing arguments");
        cobj->arc(arg0, arg1, arg2, arg3, arg4, arg5);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_arc : wrong number of arguments: %d, was expecting %d", argc, 6);
    return false;
}
bool js_creator_GraphicsNode_setLineJoin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_setLineJoin : Invalid Native Object");
    if (argc == 1) {
        creator::LineJoin arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_setLineJoin : Error processing arguments");
        cobj->setLineJoin(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_setLineJoin : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_close(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_close : Invalid Native Object");
    if (argc == 0) {
        cobj->close();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_close : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_ellipse(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_ellipse : Invalid Native Object");
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        ok &= jsval_to_float(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_ellipse : Error processing arguments");
        cobj->ellipse(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_ellipse : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_creator_GraphicsNode_setLineWidth(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_setLineWidth : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_setLineWidth : Error processing arguments");
        cobj->setLineWidth(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_setLineWidth : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_fill(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_fill : Invalid Native Object");
    if (argc == 0) {
        cobj->fill();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_fill : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_getStrokeColor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getStrokeColor : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Color4F ret = cobj->getStrokeColor();
        JS::RootedValue jsret(cx);
        ok &= cccolor4f_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_getStrokeColor : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_getStrokeColor : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_setLineCap(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_setLineCap : Invalid Native Object");
    if (argc == 1) {
        creator::LineCap arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_setLineCap : Error processing arguments");
        cobj->setLineCap(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_setLineCap : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_circle(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_circle : Invalid Native Object");
    if (argc == 3) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_circle : Error processing arguments");
        cobj->circle(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_circle : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_creator_GraphicsNode_roundRect(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_roundRect : Invalid Native Object");
    if (argc == 5) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        ok &= jsval_to_float(cx, args.get(3), &arg3);
        ok &= jsval_to_float(cx, args.get(4), &arg4);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_roundRect : Error processing arguments");
        cobj->roundRect(arg0, arg1, arg2, arg3, arg4);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_roundRect : wrong number of arguments: %d, was expecting %d", argc, 5);
    return false;
}
bool js_creator_GraphicsNode_draw(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_draw : Invalid Native Object");
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
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_draw : Error processing arguments");
        cobj->draw(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_draw : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_creator_GraphicsNode_bezierCurveTo(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_bezierCurveTo : Invalid Native Object");
    if (argc == 6) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        float arg5 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        ok &= jsval_to_float(cx, args.get(3), &arg3);
        ok &= jsval_to_float(cx, args.get(4), &arg4);
        ok &= jsval_to_float(cx, args.get(5), &arg5);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_bezierCurveTo : Error processing arguments");
        cobj->bezierCurveTo(arg0, arg1, arg2, arg3, arg4, arg5);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_bezierCurveTo : wrong number of arguments: %d, was expecting %d", argc, 6);
    return false;
}
bool js_creator_GraphicsNode_arcTo(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_arcTo : Invalid Native Object");
    if (argc == 5) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        ok &= jsval_to_float(cx, args.get(3), &arg3);
        ok &= jsval_to_float(cx, args.get(4), &arg4);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_arcTo : Error processing arguments");
        cobj->arcTo(arg0, arg1, arg2, arg3, arg4);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_arcTo : wrong number of arguments: %d, was expecting %d", argc, 5);
    return false;
}
bool js_creator_GraphicsNode_fillRect(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_fillRect : Invalid Native Object");
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        ok &= jsval_to_float(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_fillRect : Error processing arguments");
        cobj->fillRect(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_fillRect : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_creator_GraphicsNode_onDraw(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_onDraw : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Mat4 arg0;
        unsigned int arg1 = 0;
        ok &= jsval_to_matrix(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_onDraw : Error processing arguments");
        cobj->onDraw(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_onDraw : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_creator_GraphicsNode_setFillColor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_setFillColor : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Color4F arg0;
        ok &= jsval_to_cccolor4f(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_setFillColor : Error processing arguments");
        cobj->setFillColor(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_setFillColor : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_getFillColor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getFillColor : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Color4F ret = cobj->getFillColor();
        JS::RootedValue jsret(cx);
        ok &= cccolor4f_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_getFillColor : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_getFillColor : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_beginPath(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_beginPath : Invalid Native Object");
    if (argc == 0) {
        cobj->beginPath();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_beginPath : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_setDeviceRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_setDeviceRatio : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_setDeviceRatio : Error processing arguments");
        cobj->setDeviceRatio(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_setDeviceRatio : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_rect(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_rect : Invalid Native Object");
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        ok &= jsval_to_float(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_rect : Error processing arguments");
        cobj->rect(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_rect : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_creator_GraphicsNode_getMiterLimit(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getMiterLimit : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getMiterLimit();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_getMiterLimit : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_getMiterLimit : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_getLineJoin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getLineJoin : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getLineJoin();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_getLineJoin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_getLineJoin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_getLineCap(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getLineCap : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getLineCap();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_getLineCap : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_getLineCap : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_setMiterLimit(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_setMiterLimit : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_setMiterLimit : Error processing arguments");
        cobj->setMiterLimit(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_setMiterLimit : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_clear(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_clear : Invalid Native Object");
    if (argc == 0) {
        cobj->clear();
        args.rval().setUndefined();
        return true;
    }
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_clear : Error processing arguments");
        cobj->clear(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_clear : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_getDeviceRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getDeviceRatio : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getDeviceRatio();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_getDeviceRatio : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_getDeviceRatio : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_getLineWidth(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getLineWidth : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getLineWidth();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_getLineWidth : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_getLineWidth : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_setStrokeColor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_setStrokeColor : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Color4F arg0;
        ok &= jsval_to_cccolor4f(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_setStrokeColor : Error processing arguments");
        cobj->setStrokeColor(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_setStrokeColor : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        auto ret = creator::GraphicsNode::create();
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_creator_GraphicsNode_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_creator_GraphicsNode_class, proto, &jsret, "creator::GraphicsNode");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_creator_GraphicsNode_create : wrong number of arguments");
    return false;
}

bool js_creator_GraphicsNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::GraphicsNode* cobj = new (std::nothrow) creator::GraphicsNode();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_creator_GraphicsNode_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_creator_GraphicsNode_class, proto, &jsobj, "creator::GraphicsNode");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}
static bool js_creator_GraphicsNode_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    creator::GraphicsNode *nobj = new (std::nothrow) creator::GraphicsNode();
    jsb_ref_init(cx, obj, nobj, "creator::GraphicsNode");
    jsb_new_proxy(cx, nobj, obj);
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
    {
        JS::HandleValueArray argsv(args);
        JS::RootedValue objVal(cx, JS::ObjectOrNullValue(obj));
        ScriptingCore::getInstance()->executeFunctionWithOwner(objVal, "_ctor", argsv);
    }
    args.rval().setUndefined();
    return true;
}


extern JS::PersistentRootedObject *jsb_cocos2d_Node_prototype;

    
void js_register_creator_GraphicsNode(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps creator_GraphicsNode_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass creator_GraphicsNode_class = {
        "GraphicsNode",
        JSCLASS_HAS_PRIVATE,
        &creator_GraphicsNode_classOps
    };
    jsb_creator_GraphicsNode_class = &creator_GraphicsNode_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("quadraticCurveTo", js_creator_GraphicsNode_quadraticCurveTo, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("moveTo", js_creator_GraphicsNode_moveTo, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("lineTo", js_creator_GraphicsNode_lineTo, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stroke", js_creator_GraphicsNode_stroke, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("arc", js_creator_GraphicsNode_arc, 6, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setLineJoin", js_creator_GraphicsNode_setLineJoin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("close", js_creator_GraphicsNode_close, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ellipse", js_creator_GraphicsNode_ellipse, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setLineWidth", js_creator_GraphicsNode_setLineWidth, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("fill", js_creator_GraphicsNode_fill, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getStrokeColor", js_creator_GraphicsNode_getStrokeColor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setLineCap", js_creator_GraphicsNode_setLineCap, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("circle", js_creator_GraphicsNode_circle, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("roundRect", js_creator_GraphicsNode_roundRect, 5, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("draw", js_creator_GraphicsNode_draw, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("bezierCurveTo", js_creator_GraphicsNode_bezierCurveTo, 6, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("arcTo", js_creator_GraphicsNode_arcTo, 5, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("fillRect", js_creator_GraphicsNode_fillRect, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("onDraw", js_creator_GraphicsNode_onDraw, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setFillColor", js_creator_GraphicsNode_setFillColor, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getFillColor", js_creator_GraphicsNode_getFillColor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("beginPath", js_creator_GraphicsNode_beginPath, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setDeviceRatio", js_creator_GraphicsNode_setDeviceRatio, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("rect", js_creator_GraphicsNode_rect, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMiterLimit", js_creator_GraphicsNode_getMiterLimit, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getLineJoin", js_creator_GraphicsNode_getLineJoin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getLineCap", js_creator_GraphicsNode_getLineCap, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMiterLimit", js_creator_GraphicsNode_setMiterLimit, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("clear", js_creator_GraphicsNode_clear, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDeviceRatio", js_creator_GraphicsNode_getDeviceRatio, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getLineWidth", js_creator_GraphicsNode_getLineWidth, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setStrokeColor", js_creator_GraphicsNode_setStrokeColor, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_creator_GraphicsNode_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_creator_GraphicsNode_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Node_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_GraphicsNode_class,
        js_creator_GraphicsNode_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<creator::GraphicsNode>(cx, jsb_creator_GraphicsNode_class, proto);
    jsb_creator_GraphicsNode_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "GraphicsNode", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

JSClass  *jsb_creator_PhysicsDebugDraw_class;
JS::PersistentRootedObject *jsb_creator_PhysicsDebugDraw_prototype;

bool js_creator_PhysicsDebugDraw_getDrawer(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsDebugDraw* cobj = (creator::PhysicsDebugDraw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsDebugDraw_getDrawer : Invalid Native Object");
    if (argc == 0) {
        creator::GraphicsNode* ret = cobj->getDrawer();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<creator::GraphicsNode>(cx, (creator::GraphicsNode*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsDebugDraw_getDrawer : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsDebugDraw_getDrawer : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_PhysicsDebugDraw_ClearDraw(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsDebugDraw* cobj = (creator::PhysicsDebugDraw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsDebugDraw_ClearDraw : Invalid Native Object");
    if (argc == 0) {
        cobj->ClearDraw();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsDebugDraw_ClearDraw : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_PhysicsDebugDraw_AddDrawerToNode(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsDebugDraw* cobj = (creator::PhysicsDebugDraw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsDebugDraw_AddDrawerToNode : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsDebugDraw_AddDrawerToNode : Error processing arguments");
        cobj->AddDrawerToNode(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsDebugDraw_AddDrawerToNode : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsDebugDraw_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::PhysicsDebugDraw* cobj = new (std::nothrow) creator::PhysicsDebugDraw();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_creator_PhysicsDebugDraw_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_creator_PhysicsDebugDraw_class, proto, &jsobj, "creator::PhysicsDebugDraw");
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


extern JS::PersistentRootedObject *jsb_b2Draw_prototype;

void js_creator_PhysicsDebugDraw_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (PhysicsDebugDraw)", obj);
    creator::PhysicsDebugDraw *nobj = static_cast<creator::PhysicsDebugDraw *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_creator_PhysicsDebugDraw(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps creator_PhysicsDebugDraw_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_creator_PhysicsDebugDraw_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass creator_PhysicsDebugDraw_class = {
        "PhysicsDebugDraw",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &creator_PhysicsDebugDraw_classOps
    };
    jsb_creator_PhysicsDebugDraw_class = &creator_PhysicsDebugDraw_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getDrawer", js_creator_PhysicsDebugDraw_getDrawer, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ClearDraw", js_creator_PhysicsDebugDraw_ClearDraw, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("AddDrawerToNode", js_creator_PhysicsDebugDraw_AddDrawerToNode, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Draw_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_PhysicsDebugDraw_class,
        js_creator_PhysicsDebugDraw_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<creator::PhysicsDebugDraw>(cx, jsb_creator_PhysicsDebugDraw_class, proto);
    jsb_creator_PhysicsDebugDraw_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PhysicsDebugDraw", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_creator_PhysicsWorldManifoldWrapper_class;
JS::PersistentRootedObject *jsb_creator_PhysicsWorldManifoldWrapper_prototype;

bool js_creator_PhysicsWorldManifoldWrapper_getSeparation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getSeparation : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getSeparation : Error processing arguments");
        float ret = cobj->getSeparation(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getSeparation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsWorldManifoldWrapper_getSeparation : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsWorldManifoldWrapper_getX(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getX : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getX : Error processing arguments");
        float ret = cobj->getX(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getX : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsWorldManifoldWrapper_getX : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsWorldManifoldWrapper_getY(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getY : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getY : Error processing arguments");
        float ret = cobj->getY(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getY : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsWorldManifoldWrapper_getY : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsWorldManifoldWrapper_getCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsWorldManifoldWrapper_getCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_PhysicsWorldManifoldWrapper_getNormalY(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getNormalY : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getNormalY();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getNormalY : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsWorldManifoldWrapper_getNormalY : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_PhysicsWorldManifoldWrapper_getNormalX(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsWorldManifoldWrapper* cobj = (creator::PhysicsWorldManifoldWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getNormalX : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getNormalX();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsWorldManifoldWrapper_getNormalX : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsWorldManifoldWrapper_getNormalX : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_PhysicsWorldManifoldWrapper_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::PhysicsWorldManifoldWrapper* cobj = new (std::nothrow) creator::PhysicsWorldManifoldWrapper();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_creator_PhysicsWorldManifoldWrapper_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_creator_PhysicsWorldManifoldWrapper_class, proto, &jsobj, "creator::PhysicsWorldManifoldWrapper");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}


void js_register_creator_PhysicsWorldManifoldWrapper(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps creator_PhysicsWorldManifoldWrapper_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass creator_PhysicsWorldManifoldWrapper_class = {
        "PhysicsWorldManifoldWrapper",
        JSCLASS_HAS_PRIVATE,
        &creator_PhysicsWorldManifoldWrapper_classOps
    };
    jsb_creator_PhysicsWorldManifoldWrapper_class = &creator_PhysicsWorldManifoldWrapper_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getSeparation", js_creator_PhysicsWorldManifoldWrapper_getSeparation, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getX", js_creator_PhysicsWorldManifoldWrapper_getX, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getY", js_creator_PhysicsWorldManifoldWrapper_getY, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCount", js_creator_PhysicsWorldManifoldWrapper_getCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getNormalY", js_creator_PhysicsWorldManifoldWrapper_getNormalY, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getNormalX", js_creator_PhysicsWorldManifoldWrapper_getNormalX, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_PhysicsWorldManifoldWrapper_class,
        js_creator_PhysicsWorldManifoldWrapper_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<creator::PhysicsWorldManifoldWrapper>(cx, jsb_creator_PhysicsWorldManifoldWrapper_class, proto);
    jsb_creator_PhysicsWorldManifoldWrapper_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PhysicsWorldManifoldWrapper", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_creator_PhysicsUtils_class;
JS::PersistentRootedObject *jsb_creator_PhysicsUtils_prototype;

bool js_creator_PhysicsUtils_addB2Body(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsUtils* cobj = (creator::PhysicsUtils *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsUtils_addB2Body : Invalid Native Object");
    if (argc == 1) {
        b2Body* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2Body*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsUtils_addB2Body : Error processing arguments");
        cobj->addB2Body(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsUtils_addB2Body : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsUtils_syncNode(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsUtils* cobj = (creator::PhysicsUtils *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsUtils_syncNode : Invalid Native Object");
    if (argc == 0) {
        cobj->syncNode();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsUtils_syncNode : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_PhysicsUtils_removeB2Body(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsUtils* cobj = (creator::PhysicsUtils *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsUtils_removeB2Body : Invalid Native Object");
    if (argc == 1) {
        b2Body* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2Body*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsUtils_removeB2Body : Error processing arguments");
        cobj->removeB2Body(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsUtils_removeB2Body : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsUtils_getContactManifoldWrapper(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        b2Contact* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2Contact*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsUtils_getContactManifoldWrapper : Error processing arguments");

        const creator::PhysicsManifoldWrapper* ret = creator::PhysicsUtils::getContactManifoldWrapper(arg0);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        if (ret) {
        JS::RootedObject jsretObj(cx);
        js_get_or_create_jsobject<creator::PhysicsManifoldWrapper>(cx, (creator::PhysicsManifoldWrapper*)ret, &jsretObj);
        jsret = JS::ObjectOrNullValue(jsretObj);
    } else {
        jsret = JS::NullHandleValue;
    };
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsUtils_getContactManifoldWrapper : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_creator_PhysicsUtils_getContactManifoldWrapper : wrong number of arguments");
    return false;
}

bool js_creator_PhysicsUtils_getContactWorldManifoldWrapper(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        b2Contact* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2Contact*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsUtils_getContactWorldManifoldWrapper : Error processing arguments");

        const creator::PhysicsWorldManifoldWrapper* ret = creator::PhysicsUtils::getContactWorldManifoldWrapper(arg0);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        if (ret) {
        JS::RootedObject jsretObj(cx);
        js_get_or_create_jsobject<creator::PhysicsWorldManifoldWrapper>(cx, (creator::PhysicsWorldManifoldWrapper*)ret, &jsretObj);
        jsret = JS::ObjectOrNullValue(jsretObj);
    } else {
        jsret = JS::NullHandleValue;
    };
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsUtils_getContactWorldManifoldWrapper : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_creator_PhysicsUtils_getContactWorldManifoldWrapper : wrong number of arguments");
    return false;
}

bool js_creator_PhysicsUtils_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::PhysicsUtils* cobj = new (std::nothrow) creator::PhysicsUtils();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_creator_PhysicsUtils_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_creator_PhysicsUtils_class, proto, &jsobj, "creator::PhysicsUtils");
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


void js_creator_PhysicsUtils_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (PhysicsUtils)", obj);
    creator::PhysicsUtils *nobj = static_cast<creator::PhysicsUtils *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_creator_PhysicsUtils(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps creator_PhysicsUtils_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_creator_PhysicsUtils_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass creator_PhysicsUtils_class = {
        "PhysicsUtils",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &creator_PhysicsUtils_classOps
    };
    jsb_creator_PhysicsUtils_class = &creator_PhysicsUtils_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("addB2Body", js_creator_PhysicsUtils_addB2Body, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("syncNode", js_creator_PhysicsUtils_syncNode, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeB2Body", js_creator_PhysicsUtils_removeB2Body, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getContactManifoldWrapper", js_creator_PhysicsUtils_getContactManifoldWrapper, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getContactWorldManifoldWrapper", js_creator_PhysicsUtils_getContactWorldManifoldWrapper, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_PhysicsUtils_class,
        js_creator_PhysicsUtils_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<creator::PhysicsUtils>(cx, jsb_creator_PhysicsUtils_class, proto);
    jsb_creator_PhysicsUtils_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PhysicsUtils", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_creator_PhysicsContactImpulse_class;
JS::PersistentRootedObject *jsb_creator_PhysicsContactImpulse_prototype;

bool js_creator_PhysicsContactImpulse_getCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsContactImpulse* cobj = (creator::PhysicsContactImpulse *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsContactImpulse_getCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsContactImpulse_getCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsContactImpulse_getCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_PhysicsContactImpulse_getNormalImpulse(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsContactImpulse* cobj = (creator::PhysicsContactImpulse *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsContactImpulse_getNormalImpulse : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsContactImpulse_getNormalImpulse : Error processing arguments");
        float ret = cobj->getNormalImpulse(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsContactImpulse_getNormalImpulse : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsContactImpulse_getNormalImpulse : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsContactImpulse_getTangentImpulse(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsContactImpulse* cobj = (creator::PhysicsContactImpulse *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsContactImpulse_getTangentImpulse : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsContactImpulse_getTangentImpulse : Error processing arguments");
        float ret = cobj->getTangentImpulse(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsContactImpulse_getTangentImpulse : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsContactImpulse_getTangentImpulse : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsContactImpulse_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::PhysicsContactImpulse* cobj = new (std::nothrow) creator::PhysicsContactImpulse();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_creator_PhysicsContactImpulse_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_creator_PhysicsContactImpulse_class, proto, &jsobj, "creator::PhysicsContactImpulse");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}


void js_register_creator_PhysicsContactImpulse(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps creator_PhysicsContactImpulse_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass creator_PhysicsContactImpulse_class = {
        "PhysicsContactImpulse",
        JSCLASS_HAS_PRIVATE,
        &creator_PhysicsContactImpulse_classOps
    };
    jsb_creator_PhysicsContactImpulse_class = &creator_PhysicsContactImpulse_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getCount", js_creator_PhysicsContactImpulse_getCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getNormalImpulse", js_creator_PhysicsContactImpulse_getNormalImpulse, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTangentImpulse", js_creator_PhysicsContactImpulse_getTangentImpulse, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_PhysicsContactImpulse_class,
        js_creator_PhysicsContactImpulse_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<creator::PhysicsContactImpulse>(cx, jsb_creator_PhysicsContactImpulse_class, proto);
    jsb_creator_PhysicsContactImpulse_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PhysicsContactImpulse", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_creator_PhysicsContactListener_class;
JS::PersistentRootedObject *jsb_creator_PhysicsContactListener_prototype;

bool js_creator_PhysicsContactListener_unregisterContactFixture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsContactListener_unregisterContactFixture : Invalid Native Object");
    if (argc == 1) {
        b2Fixture* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2Fixture*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsContactListener_unregisterContactFixture : Error processing arguments");
        cobj->unregisterContactFixture(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsContactListener_unregisterContactFixture : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsContactListener_registerContactFixture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsContactListener* cobj = (creator::PhysicsContactListener *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsContactListener_registerContactFixture : Invalid Native Object");
    if (argc == 1) {
        b2Fixture* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2Fixture*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsContactListener_registerContactFixture : Error processing arguments");
        cobj->registerContactFixture(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsContactListener_registerContactFixture : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsContactListener_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::PhysicsContactListener* cobj = new (std::nothrow) creator::PhysicsContactListener();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_creator_PhysicsContactListener_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_creator_PhysicsContactListener_class, proto, &jsobj, "creator::PhysicsContactListener");
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


extern JS::PersistentRootedObject *jsb_b2ContactListener_prototype;

void js_creator_PhysicsContactListener_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (PhysicsContactListener)", obj);
    creator::PhysicsContactListener *nobj = static_cast<creator::PhysicsContactListener *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_creator_PhysicsContactListener(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps creator_PhysicsContactListener_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_creator_PhysicsContactListener_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass creator_PhysicsContactListener_class = {
        "PhysicsContactListener",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &creator_PhysicsContactListener_classOps
    };
    jsb_creator_PhysicsContactListener_class = &creator_PhysicsContactListener_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("unregisterContactFixture", js_creator_PhysicsContactListener_unregisterContactFixture, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("registerContactFixture", js_creator_PhysicsContactListener_registerContactFixture, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2ContactListener_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_PhysicsContactListener_class,
        js_creator_PhysicsContactListener_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<creator::PhysicsContactListener>(cx, jsb_creator_PhysicsContactListener_class, proto);
    jsb_creator_PhysicsContactListener_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PhysicsContactListener", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_creator_PhysicsAABBQueryCallback_class;
JS::PersistentRootedObject *jsb_creator_PhysicsAABBQueryCallback_prototype;

bool js_creator_PhysicsAABBQueryCallback_init(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    creator::PhysicsAABBQueryCallback* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (creator::PhysicsAABBQueryCallback *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsAABBQueryCallback_init : Invalid Native Object");
    do {
        ok = true;
        if (argc == 1) {
            b2Vec2 arg0;
            ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cobj->init(arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            cobj->init();
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsAABBQueryCallback_init : arguments error");
    return false;
}
bool js_creator_PhysicsAABBQueryCallback_getFixture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsAABBQueryCallback* cobj = (creator::PhysicsAABBQueryCallback *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsAABBQueryCallback_getFixture : Invalid Native Object");
    if (argc == 0) {
        b2Fixture* ret = cobj->getFixture();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsAABBQueryCallback_getFixture : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsAABBQueryCallback_getFixture : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_PhysicsAABBQueryCallback_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::PhysicsAABBQueryCallback* cobj = new (std::nothrow) creator::PhysicsAABBQueryCallback();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_creator_PhysicsAABBQueryCallback_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_creator_PhysicsAABBQueryCallback_class, proto, &jsobj, "creator::PhysicsAABBQueryCallback");
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


extern JS::PersistentRootedObject *jsb_b2QueryCallback_prototype;

void js_creator_PhysicsAABBQueryCallback_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (PhysicsAABBQueryCallback)", obj);
    creator::PhysicsAABBQueryCallback *nobj = static_cast<creator::PhysicsAABBQueryCallback *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_creator_PhysicsAABBQueryCallback(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps creator_PhysicsAABBQueryCallback_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_creator_PhysicsAABBQueryCallback_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass creator_PhysicsAABBQueryCallback_class = {
        "PhysicsAABBQueryCallback",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &creator_PhysicsAABBQueryCallback_classOps
    };
    jsb_creator_PhysicsAABBQueryCallback_class = &creator_PhysicsAABBQueryCallback_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("init", js_creator_PhysicsAABBQueryCallback_init, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getFixture", js_creator_PhysicsAABBQueryCallback_getFixture, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2QueryCallback_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_PhysicsAABBQueryCallback_class,
        js_creator_PhysicsAABBQueryCallback_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<creator::PhysicsAABBQueryCallback>(cx, jsb_creator_PhysicsAABBQueryCallback_class, proto);
    jsb_creator_PhysicsAABBQueryCallback_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PhysicsAABBQueryCallback", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_creator_PhysicsRayCastCallback_class;
JS::PersistentRootedObject *jsb_creator_PhysicsRayCastCallback_prototype;

bool js_creator_PhysicsRayCastCallback_getType(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsRayCastCallback_getType : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getType();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsRayCastCallback_getType : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsRayCastCallback_getType : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_PhysicsRayCastCallback_init(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsRayCastCallback_init : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsRayCastCallback_init : Error processing arguments");
        cobj->init(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsRayCastCallback_init : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_PhysicsRayCastCallback_getFractions(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::PhysicsRayCastCallback* cobj = (creator::PhysicsRayCastCallback *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_PhysicsRayCastCallback_getFractions : Invalid Native Object");
    if (argc == 0) {
        std::vector<float, std::allocator<float> >& ret = cobj->getFractions();
        JS::RootedValue jsret(cx);
        ok &= std_vector_float_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_PhysicsRayCastCallback_getFractions : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_PhysicsRayCastCallback_getFractions : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_PhysicsRayCastCallback_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::PhysicsRayCastCallback* cobj = new (std::nothrow) creator::PhysicsRayCastCallback();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_creator_PhysicsRayCastCallback_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_creator_PhysicsRayCastCallback_class, proto, &jsobj, "creator::PhysicsRayCastCallback");
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


extern JS::PersistentRootedObject *jsb_b2RayCastCallback_prototype;

void js_creator_PhysicsRayCastCallback_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (PhysicsRayCastCallback)", obj);
    creator::PhysicsRayCastCallback *nobj = static_cast<creator::PhysicsRayCastCallback *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_creator_PhysicsRayCastCallback(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps creator_PhysicsRayCastCallback_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_creator_PhysicsRayCastCallback_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass creator_PhysicsRayCastCallback_class = {
        "PhysicsRayCastCallback",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &creator_PhysicsRayCastCallback_classOps
    };
    jsb_creator_PhysicsRayCastCallback_class = &creator_PhysicsRayCastCallback_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getType", js_creator_PhysicsRayCastCallback_getType, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("init", js_creator_PhysicsRayCastCallback_init, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getFractions", js_creator_PhysicsRayCastCallback_getFractions, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2RayCastCallback_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_PhysicsRayCastCallback_class,
        js_creator_PhysicsRayCastCallback_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<creator::PhysicsRayCastCallback>(cx, jsb_creator_PhysicsRayCastCallback_class, proto);
    jsb_creator_PhysicsRayCastCallback_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PhysicsRayCastCallback", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_creator_CameraNode_class;
JS::PersistentRootedObject *jsb_creator_CameraNode_prototype;

bool js_creator_CameraNode_removeTarget(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::CameraNode* cobj = (creator::CameraNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_CameraNode_removeTarget : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_CameraNode_removeTarget : Error processing arguments");
        cobj->removeTarget(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_CameraNode_removeTarget : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_CameraNode_setTransform(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::CameraNode* cobj = (creator::CameraNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_CameraNode_setTransform : Invalid Native Object");
    if (argc == 6) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        float arg5 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        ok &= jsval_to_float(cx, args.get(3), &arg3);
        ok &= jsval_to_float(cx, args.get(4), &arg4);
        ok &= jsval_to_float(cx, args.get(5), &arg5);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_CameraNode_setTransform : Error processing arguments");
        cobj->setTransform(arg0, arg1, arg2, arg3, arg4, arg5);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_CameraNode_setTransform : wrong number of arguments: %d, was expecting %d", argc, 6);
    return false;
}
bool js_creator_CameraNode_getVisibleRect(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::CameraNode* cobj = (creator::CameraNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_CameraNode_getVisibleRect : Invalid Native Object");
    if (argc == 0) {
        const cocos2d::Rect& ret = cobj->getVisibleRect();
        JS::RootedValue jsret(cx);
        ok &= ccrect_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_CameraNode_getVisibleRect : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_CameraNode_getVisibleRect : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_CameraNode_containsNode(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::CameraNode* cobj = (creator::CameraNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_CameraNode_containsNode : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_CameraNode_containsNode : Error processing arguments");
        bool ret = cobj->containsNode(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_CameraNode_containsNode : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_CameraNode_containsNode : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_CameraNode_addTarget(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    creator::CameraNode* cobj = (creator::CameraNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_CameraNode_addTarget : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_CameraNode_addTarget : Error processing arguments");
        cobj->addTarget(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_creator_CameraNode_addTarget : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_CameraNode_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        auto ret = creator::CameraNode::getInstance();
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_creator_CameraNode_prototype->get());
        jsb_ref_get_or_create_jsobject(cx, ret, jsb_creator_CameraNode_class, proto, &jsret, "creator::CameraNode");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_creator_CameraNode_getInstance : wrong number of arguments");
    return false;
}

bool js_creator_CameraNode_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::CameraNode* cobj = new (std::nothrow) creator::CameraNode();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_creator_CameraNode_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_creator_CameraNode_class, proto, &jsobj, "creator::CameraNode");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}


extern JS::PersistentRootedObject *jsb_cocos2d_Node_prototype;

void js_register_creator_CameraNode(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps creator_CameraNode_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass creator_CameraNode_class = {
        "CameraNode",
        JSCLASS_HAS_PRIVATE,
        &creator_CameraNode_classOps
    };
    jsb_creator_CameraNode_class = &creator_CameraNode_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("removeTarget", js_creator_CameraNode_removeTarget, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setTransform", js_creator_CameraNode_setTransform, 6, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getVisibleRect", js_creator_CameraNode_getVisibleRect, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("containsNode", js_creator_CameraNode_containsNode, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("addTarget", js_creator_CameraNode_addTarget, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getInstance", js_creator_CameraNode_getInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Node_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_CameraNode_class,
        js_creator_CameraNode_constructor, 0,
        properties,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<creator::CameraNode>(cx, jsb_creator_CameraNode_class, proto);
    jsb_creator_CameraNode_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "CameraNode", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

void register_all_creator(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "cc", &ns);

    js_register_creator_PhysicsRayCastCallback(cx, ns);
    js_register_creator_PhysicsDebugDraw(cx, ns);
    js_register_creator_PhysicsContactListener(cx, ns);
    js_register_creator_PhysicsContactImpulse(cx, ns);
    js_register_creator_PhysicsUtils(cx, ns);
    js_register_creator_Scale9SpriteV2(cx, ns);
    js_register_creator_PhysicsWorldManifoldWrapper(cx, ns);
    js_register_creator_GraphicsNode(cx, ns);
    js_register_creator_PhysicsAABBQueryCallback(cx, ns);
    js_register_creator_CameraNode(cx, ns);
}

