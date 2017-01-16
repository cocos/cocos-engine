#include "scripting/js-bindings/auto/jsb_creator_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "creator/CCScale9Sprite.h"
#include "creator/CCGraphicsNode.h"

template<class T>
static bool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS_ReportError(cx, "Constructor for the requested class is not available, please refer to the API reference.");
    return false;
}

static bool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
    return false;
}

static bool js_is_native_obj(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().setBoolean(true);
    return true;
}
JSClass  *jsb_creator_Scale9SpriteV2_class;
JSObject *jsb_creator_Scale9SpriteV2_prototype;

bool js_creator_Scale9SpriteV2_setTexture(JSContext *cx, uint32_t argc, jsval *vp)
{
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setTexture : Invalid Native Object");
    do {
        bool ok = true;
        if (argc == 1) {
            cocos2d::Texture2D* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(tmpObj);
                arg0 = (cocos2d::Texture2D*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->setTexture(arg0);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        bool ok = true;
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->setTexture(arg0);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setTexture : wrong number of arguments");
    return false;
}
bool js_creator_Scale9SpriteV2_getFillType(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getFillType : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getFillType();
        JS::RootedValue jsret(cx);
        jsret = int32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_getFillType : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isTrimmedContentSizeEnabled();
        JS::RootedValue jsret(cx);
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_isTrimmedContentSizeEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_getState(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getState : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getState();
        JS::RootedValue jsret(cx);
        jsret = int32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_getState : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setState(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setState : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setInsetBottom(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setInsetBottom : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setInsetBottom : Error processing arguments");
        cobj->setInsetBottom(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setInsetBottom : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setFillRange(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setFillRange : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setFillRange : Error processing arguments");
        cobj->setFillRange(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setFillRange : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_getFillStart(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getFillStart : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getFillStart();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_getFillStart : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_getFillRange(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getFillRange : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getFillRange();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_getFillRange : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setInsetTop(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setInsetTop : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setInsetTop : Error processing arguments");
        cobj->setInsetTop(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setInsetTop : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setRenderingType(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setRenderingType : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setDistortionOffset(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setDistortionOffset : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setFillCenter(JSContext *cx, uint32_t argc, jsval *vp)
{
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setFillCenter : Invalid Native Object");
    do {
        bool ok = true;
        if (argc == 2) {
            double arg0 = 0;
            ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
            if (!ok) { ok = true; break; }
            double arg1 = 0;
            ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
            if (!ok) { ok = true; break; }
            cobj->setFillCenter(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        bool ok = true;
        if (argc == 1) {
            cocos2d::Vec2 arg0;
            ok &= jsval_to_vector2(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cobj->setFillCenter(arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setFillCenter : wrong number of arguments");
    return false;
}
bool js_creator_Scale9SpriteV2_setSpriteFrame(JSContext *cx, uint32_t argc, jsval *vp)
{
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setSpriteFrame : Invalid Native Object");
    do {
        bool ok = true;
        if (argc == 1) {
            cocos2d::SpriteFrame* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(tmpObj);
                arg0 = (cocos2d::SpriteFrame*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->setSpriteFrame(arg0);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        bool ok = true;
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->setSpriteFrame(arg0);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setSpriteFrame : wrong number of arguments");
    return false;
}
bool js_creator_Scale9SpriteV2_getBlendFunc(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getBlendFunc : Invalid Native Object");
    if (argc == 0) {
        const cocos2d::BlendFunc& ret = cobj->getBlendFunc();
        JS::RootedValue jsret(cx);
        jsret = blendfunc_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_getBlendFunc : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_initWithTexture(JSContext *cx, uint32_t argc, jsval *vp)
{
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_initWithTexture : Invalid Native Object");
    do {
        bool ok = true;
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithTexture(arg0);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        bool ok = true;
        if (argc == 1) {
            cocos2d::Texture2D* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(tmpObj);
                arg0 = (cocos2d::Texture2D*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithTexture(arg0);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_initWithTexture : wrong number of arguments");
    return false;
}
bool js_creator_Scale9SpriteV2_getInsetLeft(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getInsetLeft : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getInsetLeft();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_getInsetLeft : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_getInsetBottom(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getInsetBottom : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getInsetBottom();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_getInsetBottom : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setDistortionTiling(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setDistortionTiling : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_getRenderingType(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getRenderingType : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getRenderingType();
        JS::RootedValue jsret(cx);
        jsret = int32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_getRenderingType : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setFillStart(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setFillStart : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setFillStart : Error processing arguments");
        cobj->setFillStart(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setFillStart : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_getInsetRight(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getInsetRight : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getInsetRight();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_getInsetRight : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setBlendFunc(JSContext *cx, uint32_t argc, jsval *vp)
{
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setBlendFunc : Invalid Native Object");
    do {
        bool ok = true;
        if (argc == 2) {
            unsigned int arg0 = 0;
            ok &= jsval_to_uint32(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            unsigned int arg1 = 0;
            ok &= jsval_to_uint32(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            cobj->setBlendFunc(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        bool ok = true;
        if (argc == 1) {
            cocos2d::BlendFunc arg0;
            ok &= jsval_to_blendfunc(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cobj->setBlendFunc(arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setBlendFunc : wrong number of arguments");
    return false;
}
bool js_creator_Scale9SpriteV2_getFillCenter(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getFillCenter : Invalid Native Object");
    if (argc == 0) {
        const cocos2d::Vec2& ret = cobj->getFillCenter();
        JS::RootedValue jsret(cx);
        jsret = vector2_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_getFillCenter : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_getInsetTop(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_getInsetTop : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getInsetTop();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_getInsetTop : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_Scale9SpriteV2_setInsetLeft(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setInsetLeft : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setInsetLeft : Error processing arguments");
        cobj->setInsetLeft(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setInsetLeft : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_initWithSpriteFrame(JSContext *cx, uint32_t argc, jsval *vp)
{
    creator::Scale9SpriteV2* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_initWithSpriteFrame : Invalid Native Object");
    do {
        bool ok = true;
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithSpriteFrame(arg0);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        bool ok = true;
        if (argc == 1) {
            cocos2d::SpriteFrame* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(tmpObj);
                arg0 = (cocos2d::SpriteFrame*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithSpriteFrame(arg0);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_initWithSpriteFrame : wrong number of arguments");
    return false;
}
bool js_creator_Scale9SpriteV2_setFillType(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setFillType : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_setInsetRight(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_setInsetRight : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_setInsetRight : Error processing arguments");
        cobj->setInsetRight(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_setInsetRight : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_enableTrimmedContentSize(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::Scale9SpriteV2* cobj = (creator::Scale9SpriteV2 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_Scale9SpriteV2_enableTrimmedContentSize : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_creator_Scale9SpriteV2_enableTrimmedContentSize : Error processing arguments");
        cobj->enableTrimmedContentSize(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_Scale9SpriteV2_enableTrimmedContentSize : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_Scale9SpriteV2_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::Scale9SpriteV2* cobj = new (std::nothrow) creator::Scale9SpriteV2();

    js_type_class_t *typeClass = js_get_type_from_native<creator::Scale9SpriteV2>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "creator::Scale9SpriteV2"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}
static bool js_creator_Scale9SpriteV2_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    creator::Scale9SpriteV2 *nobj = new (std::nothrow) creator::Scale9SpriteV2();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    jsb_ref_init(cx, &p->obj, nobj, "creator::Scale9SpriteV2");
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    args.rval().setUndefined();
    return true;
}


extern JSObject *jsb_cocos2d_Node_prototype;

    
void js_register_creator_Scale9SpriteV2(JSContext *cx, JS::HandleObject global) {
    jsb_creator_Scale9SpriteV2_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_creator_Scale9SpriteV2_class->name = "Scale9SpriteV2";
    jsb_creator_Scale9SpriteV2_class->addProperty = JS_PropertyStub;
    jsb_creator_Scale9SpriteV2_class->delProperty = JS_DeletePropertyStub;
    jsb_creator_Scale9SpriteV2_class->getProperty = JS_PropertyStub;
    jsb_creator_Scale9SpriteV2_class->setProperty = JS_StrictPropertyStub;
    jsb_creator_Scale9SpriteV2_class->enumerate = JS_EnumerateStub;
    jsb_creator_Scale9SpriteV2_class->resolve = JS_ResolveStub;
    jsb_creator_Scale9SpriteV2_class->convert = JS_ConvertStub;
    jsb_creator_Scale9SpriteV2_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

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

    JSFunctionSpec *st_funcs = NULL;

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Node_prototype);
    jsb_creator_Scale9SpriteV2_prototype = JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_Scale9SpriteV2_class,
        js_creator_Scale9SpriteV2_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_creator_Scale9SpriteV2_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "Scale9SpriteV2"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<creator::Scale9SpriteV2>(cx, jsb_creator_Scale9SpriteV2_class, proto, parent_proto);
    anonEvaluate(cx, global, "(function () { cc.Scale9SpriteV2.extend = cc.Class.extend; })()");
}

JSClass  *jsb_creator_GraphicsNode_class;
JSObject *jsb_creator_GraphicsNode_prototype;

bool js_creator_GraphicsNode_quadraticCurveTo(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_quadraticCurveTo : Invalid Native Object");
    if (argc == 4) {
        double arg0 = 0;
        double arg1 = 0;
        double arg2 = 0;
        double arg3 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        ok &= JS::ToNumber( cx, args.get(2), &arg2) && !std::isnan(arg2);
        ok &= JS::ToNumber( cx, args.get(3), &arg3) && !std::isnan(arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_quadraticCurveTo : Error processing arguments");
        cobj->quadraticCurveTo(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_quadraticCurveTo : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_creator_GraphicsNode_moveTo(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_moveTo : Invalid Native Object");
    if (argc == 2) {
        double arg0 = 0;
        double arg1 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_moveTo : Error processing arguments");
        cobj->moveTo(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_moveTo : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_creator_GraphicsNode_lineTo(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_lineTo : Invalid Native Object");
    if (argc == 2) {
        double arg0 = 0;
        double arg1 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_lineTo : Error processing arguments");
        cobj->lineTo(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_lineTo : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_creator_GraphicsNode_stroke(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_stroke : Invalid Native Object");
    if (argc == 0) {
        cobj->stroke();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_stroke : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_arc(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_arc : Invalid Native Object");
    if (argc == 6) {
        double arg0 = 0;
        double arg1 = 0;
        double arg2 = 0;
        double arg3 = 0;
        double arg4 = 0;
        bool arg5;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        ok &= JS::ToNumber( cx, args.get(2), &arg2) && !std::isnan(arg2);
        ok &= JS::ToNumber( cx, args.get(3), &arg3) && !std::isnan(arg3);
        ok &= JS::ToNumber( cx, args.get(4), &arg4) && !std::isnan(arg4);
        arg5 = JS::ToBoolean(args.get(5));
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_arc : Error processing arguments");
        cobj->arc(arg0, arg1, arg2, arg3, arg4, arg5);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_arc : wrong number of arguments: %d, was expecting %d", argc, 6);
    return false;
}
bool js_creator_GraphicsNode_setLineJoin(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_creator_GraphicsNode_setLineJoin : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_close(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_close : Invalid Native Object");
    if (argc == 0) {
        cobj->close();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_close : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_ellipse(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_ellipse : Invalid Native Object");
    if (argc == 4) {
        double arg0 = 0;
        double arg1 = 0;
        double arg2 = 0;
        double arg3 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        ok &= JS::ToNumber( cx, args.get(2), &arg2) && !std::isnan(arg2);
        ok &= JS::ToNumber( cx, args.get(3), &arg3) && !std::isnan(arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_ellipse : Error processing arguments");
        cobj->ellipse(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_ellipse : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_creator_GraphicsNode_setLineWidth(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_setLineWidth : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_setLineWidth : Error processing arguments");
        cobj->setLineWidth(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_setLineWidth : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_fill(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_fill : Invalid Native Object");
    if (argc == 0) {
        cobj->fill();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_fill : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_getStrokeColor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getStrokeColor : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Color4F ret = cobj->getStrokeColor();
        JS::RootedValue jsret(cx);
        jsret = cccolor4f_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_getStrokeColor : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_setLineCap(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_creator_GraphicsNode_setLineCap : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_circle(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_circle : Invalid Native Object");
    if (argc == 3) {
        double arg0 = 0;
        double arg1 = 0;
        double arg2 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        ok &= JS::ToNumber( cx, args.get(2), &arg2) && !std::isnan(arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_circle : Error processing arguments");
        cobj->circle(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_circle : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_creator_GraphicsNode_roundRect(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_roundRect : Invalid Native Object");
    if (argc == 5) {
        double arg0 = 0;
        double arg1 = 0;
        double arg2 = 0;
        double arg3 = 0;
        double arg4 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        ok &= JS::ToNumber( cx, args.get(2), &arg2) && !std::isnan(arg2);
        ok &= JS::ToNumber( cx, args.get(3), &arg3) && !std::isnan(arg3);
        ok &= JS::ToNumber( cx, args.get(4), &arg4) && !std::isnan(arg4);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_roundRect : Error processing arguments");
        cobj->roundRect(arg0, arg1, arg2, arg3, arg4);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_roundRect : wrong number of arguments: %d, was expecting %d", argc, 5);
    return false;
}
bool js_creator_GraphicsNode_bezierCurveTo(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_bezierCurveTo : Invalid Native Object");
    if (argc == 6) {
        double arg0 = 0;
        double arg1 = 0;
        double arg2 = 0;
        double arg3 = 0;
        double arg4 = 0;
        double arg5 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        ok &= JS::ToNumber( cx, args.get(2), &arg2) && !std::isnan(arg2);
        ok &= JS::ToNumber( cx, args.get(3), &arg3) && !std::isnan(arg3);
        ok &= JS::ToNumber( cx, args.get(4), &arg4) && !std::isnan(arg4);
        ok &= JS::ToNumber( cx, args.get(5), &arg5) && !std::isnan(arg5);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_bezierCurveTo : Error processing arguments");
        cobj->bezierCurveTo(arg0, arg1, arg2, arg3, arg4, arg5);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_bezierCurveTo : wrong number of arguments: %d, was expecting %d", argc, 6);
    return false;
}
bool js_creator_GraphicsNode_arcTo(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_arcTo : Invalid Native Object");
    if (argc == 5) {
        double arg0 = 0;
        double arg1 = 0;
        double arg2 = 0;
        double arg3 = 0;
        double arg4 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        ok &= JS::ToNumber( cx, args.get(2), &arg2) && !std::isnan(arg2);
        ok &= JS::ToNumber( cx, args.get(3), &arg3) && !std::isnan(arg3);
        ok &= JS::ToNumber( cx, args.get(4), &arg4) && !std::isnan(arg4);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_arcTo : Error processing arguments");
        cobj->arcTo(arg0, arg1, arg2, arg3, arg4);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_arcTo : wrong number of arguments: %d, was expecting %d", argc, 5);
    return false;
}
bool js_creator_GraphicsNode_fillRect(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_fillRect : Invalid Native Object");
    if (argc == 4) {
        double arg0 = 0;
        double arg1 = 0;
        double arg2 = 0;
        double arg3 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        ok &= JS::ToNumber( cx, args.get(2), &arg2) && !std::isnan(arg2);
        ok &= JS::ToNumber( cx, args.get(3), &arg3) && !std::isnan(arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_fillRect : Error processing arguments");
        cobj->fillRect(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_fillRect : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_creator_GraphicsNode_onDraw(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_onDraw : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Mat4 arg0;
        unsigned int arg1 = 0;
        ok &= jsval_to_matrix(cx, args.get(0), &arg0);
        ok &= jsval_to_uint32(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_onDraw : Error processing arguments");
        cobj->onDraw(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_onDraw : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_creator_GraphicsNode_setFillColor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_creator_GraphicsNode_setFillColor : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_getFillColor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getFillColor : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Color4F ret = cobj->getFillColor();
        JS::RootedValue jsret(cx);
        jsret = cccolor4f_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_getFillColor : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_beginPath(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_beginPath : Invalid Native Object");
    if (argc == 0) {
        cobj->beginPath();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_beginPath : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_setDeviceRatio(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_setDeviceRatio : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_setDeviceRatio : Error processing arguments");
        cobj->setDeviceRatio(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_setDeviceRatio : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_rect(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_rect : Invalid Native Object");
    if (argc == 4) {
        double arg0 = 0;
        double arg1 = 0;
        double arg2 = 0;
        double arg3 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
        ok &= JS::ToNumber( cx, args.get(2), &arg2) && !std::isnan(arg2);
        ok &= JS::ToNumber( cx, args.get(3), &arg3) && !std::isnan(arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_rect : Error processing arguments");
        cobj->rect(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_rect : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_creator_GraphicsNode_getMiterLimit(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getMiterLimit : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getMiterLimit();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_getMiterLimit : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_getLineJoin(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getLineJoin : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getLineJoin();
        JS::RootedValue jsret(cx);
        jsret = int32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_getLineJoin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_getLineCap(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getLineCap : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getLineCap();
        JS::RootedValue jsret(cx);
        jsret = int32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_getLineCap : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_setMiterLimit(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_setMiterLimit : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_setMiterLimit : Error processing arguments");
        cobj->setMiterLimit(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_setMiterLimit : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_clear(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_clear : Invalid Native Object");
    if (argc == 0) {
        cobj->clear();
        args.rval().setUndefined();
        return true;
    }
    if (argc == 1) {
        bool arg0;
        arg0 = JS::ToBoolean(args.get(0));
        JSB_PRECONDITION2(ok, cx, false, "js_creator_GraphicsNode_clear : Error processing arguments");
        cobj->clear(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_clear : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_getDeviceRatio(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getDeviceRatio : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getDeviceRatio();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_getDeviceRatio : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_getLineWidth(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    creator::GraphicsNode* cobj = (creator::GraphicsNode *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_creator_GraphicsNode_getLineWidth : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getLineWidth();
        JS::RootedValue jsret(cx);
        jsret = DOUBLE_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_creator_GraphicsNode_getLineWidth : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_creator_GraphicsNode_setStrokeColor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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

    JS_ReportError(cx, "js_creator_GraphicsNode_setStrokeColor : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_creator_GraphicsNode_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {

        auto ret = creator::GraphicsNode::create();
        js_type_class_t *typeClass = js_get_type_from_native<creator::GraphicsNode>(ret);
        JS::RootedObject jsret(cx, jsb_ref_autoreleased_create_jsobject(cx, ret, typeClass, "creator::GraphicsNode"));
        args.rval().set(OBJECT_TO_JSVAL(jsret));
        return true;
    }
    JS_ReportError(cx, "js_creator_GraphicsNode_create : wrong number of arguments");
    return false;
}

bool js_creator_GraphicsNode_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    creator::GraphicsNode* cobj = new (std::nothrow) creator::GraphicsNode();

    js_type_class_t *typeClass = js_get_type_from_native<creator::GraphicsNode>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "creator::GraphicsNode"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}
static bool js_creator_GraphicsNode_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    creator::GraphicsNode *nobj = new (std::nothrow) creator::GraphicsNode();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    jsb_ref_init(cx, &p->obj, nobj, "creator::GraphicsNode");
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    args.rval().setUndefined();
    return true;
}


extern JSObject *jsb_cocos2d_Node_prototype;

    
void js_register_creator_GraphicsNode(JSContext *cx, JS::HandleObject global) {
    jsb_creator_GraphicsNode_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_creator_GraphicsNode_class->name = "GraphicsNode";
    jsb_creator_GraphicsNode_class->addProperty = JS_PropertyStub;
    jsb_creator_GraphicsNode_class->delProperty = JS_DeletePropertyStub;
    jsb_creator_GraphicsNode_class->getProperty = JS_PropertyStub;
    jsb_creator_GraphicsNode_class->setProperty = JS_StrictPropertyStub;
    jsb_creator_GraphicsNode_class->enumerate = JS_EnumerateStub;
    jsb_creator_GraphicsNode_class->resolve = JS_ResolveStub;
    jsb_creator_GraphicsNode_class->convert = JS_ConvertStub;
    jsb_creator_GraphicsNode_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

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

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Node_prototype);
    jsb_creator_GraphicsNode_prototype = JS_InitClass(
        cx, global,
        parent_proto,
        jsb_creator_GraphicsNode_class,
        js_creator_GraphicsNode_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_creator_GraphicsNode_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "GraphicsNode"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<creator::GraphicsNode>(cx, jsb_creator_GraphicsNode_class, proto, parent_proto);
    anonEvaluate(cx, global, "(function () { cc.GraphicsNode.extend = cc.Class.extend; })()");
}

void register_all_creator(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "cc", &ns);

    js_register_creator_GraphicsNode(cx, ns);
    js_register_creator_Scale9SpriteV2(cx, ns);
}

