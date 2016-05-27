#include "jsb_creator_auto.hpp"
#include "cocos2d_specifics.hpp"
#include "creator/CCScale9Sprite.h"

template<class T>
static bool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedValue initializing(cx);
    bool isNewValid = true;
    if (isNewValid)
    {
        TypeTest<T> t;
        js_type_class_t *typeClass = nullptr;
        std::string typeName = t.s_name();
        auto typeMapIter = _js_global_type_map.find(typeName);
        CCASSERT(typeMapIter != _js_global_type_map.end(), "Can't find the class type!");
        typeClass = typeMapIter->second;
        CCASSERT(typeClass, "The value is null.");

        JS::RootedObject proto(cx, typeClass->proto.ref());
        JS::RootedObject parent(cx, typeClass->parentProto.ref());
        JS::RootedObject _tmp(cx, JS_NewObject(cx, typeClass->jsclass, proto, parent));
        
        T* cobj = new T();
        js_proxy_t *pp = jsb_new_proxy(cobj, _tmp);
        AddObjectRoot(cx, &pp->obj);
        args.rval().set(OBJECT_TO_JSVAL(_tmp));
        return true;
    }

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
            if (!ok) { break; }
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
            if (!ok) { break; }
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
        jsval jsret = JSVAL_NULL;
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
        jsval jsret = JSVAL_NULL;
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
        jsval jsret = JSVAL_NULL;
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
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !isnan(arg0);
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
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !isnan(arg0);
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
        jsval jsret = JSVAL_NULL;
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
        jsval jsret = JSVAL_NULL;
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
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !isnan(arg0);
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
            ok &= JS::ToNumber( cx, args.get(0), &arg0) && !isnan(arg0);
            if (!ok) { break; }
            double arg1 = 0;
            ok = true;
            ok &= JS::ToNumber( cx, args.get(1), &arg1) && !isnan(arg1);
            if (!ok) { break; }
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
            if (!ok) { break; }
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
            if (!ok) { break; }
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
            if (!ok) { break; }
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
        jsval jsret = JSVAL_NULL;
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
            if (!ok) { break; }
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
            if (!ok) { break; }
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
        jsval jsret = JSVAL_NULL;
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
        jsval jsret = JSVAL_NULL;
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
        jsval jsret = JSVAL_NULL;
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
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !isnan(arg0);
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
        jsval jsret = JSVAL_NULL;
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
            if (!ok) { break; }
            unsigned int arg1 = 0;
            ok = true;
            ok &= jsval_to_uint32(cx, args.get(1), &arg1);
            if (!ok) { break; }
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
            if (!ok) { break; }
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
        jsval jsret = JSVAL_NULL;
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
        jsval jsret = JSVAL_NULL;
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
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !isnan(arg0);
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
            if (!ok) { break; }
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
            if (!ok) { break; }
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
        ok &= JS::ToNumber( cx, args.get(0), &arg0) && !isnan(arg0);
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
    TypeTest<creator::Scale9SpriteV2> t;
    js_type_class_t *typeClass = nullptr;
    std::string typeName = t.s_name();
    auto typeMapIter = _js_global_type_map.find(typeName);
    CCASSERT(typeMapIter != _js_global_type_map.end(), "Can't find the class type!");
    typeClass = typeMapIter->second;
    CCASSERT(typeClass, "The value is null.");
    JS::RootedObject proto(cx, typeClass->proto.ref());
    JS::RootedObject parent(cx, typeClass->parentProto.ref());
    JS::RootedObject obj(cx, JS_NewObject(cx, typeClass->jsclass, proto, parent));
    args.rval().set(OBJECT_TO_JSVAL(obj));
    // link the native object with the javascript object
    jsb_new_proxy(cobj, obj);
    if (JS_HasProperty(cx, obj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    return true;
}static bool js_creator_Scale9SpriteV2_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    creator::Scale9SpriteV2 *nobj = new (std::nothrow) creator::Scale9SpriteV2();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    bool isFound = false;
    if (JS_HasProperty(cx, obj, "_ctor", &isFound) && isFound)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(obj), "_ctor", args);
    args.rval().setUndefined();
    return true;
}

extern JSObject *jsb_cocos2d_Node_prototype;

void js_creator_Scale9SpriteV2_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (Scale9SpriteV2)", obj);
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JS::RootedObject jsobj(cx, obj);
    auto proxy = jsb_get_js_proxy(jsobj);
    if (proxy) {
        creator::Scale9SpriteV2 *nobj = static_cast<creator::Scale9SpriteV2 *>(proxy->ptr);

        if (nobj) {
            jsb_remove_proxy(proxy);
            nobj->release();
        }
        else jsb_remove_proxy(proxy);
    }
}
    
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
    jsb_creator_Scale9SpriteV2_class->finalize = js_creator_Scale9SpriteV2_finalize;
    jsb_creator_Scale9SpriteV2_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PSG("__nativeObj", js_is_native_obj, JSPROP_PERMANENT | JSPROP_ENUMERATE),
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

    // add the proto and JSClass to the type->js info hash table
    JS::RootedObject proto(cx, jsb_creator_Scale9SpriteV2_prototype);
    jsb_register_class<creator::Scale9SpriteV2>(cx, jsb_creator_Scale9SpriteV2_class, proto, parent_proto);
    anonEvaluate(cx, global, "(function () { cc.Scale9SpriteV2.extend = cc.Class.extend; })()");
}
void register_all_creator(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "cc", &ns);

    js_register_creator_Scale9SpriteV2(cx, ns);
}

