#include "scripting/js-bindings/auto/jsb_cocos2dx_dragonbones_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "editor-support/dragonbones/cocos2dx/CCDragonBonesHeaders.h"

JSClass  *jsb_dragonBones_BaseObject_class;
JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

bool js_cocos2dx_dragonbones_BaseObject_getClassTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::BaseObject* cobj = (dragonBones::BaseObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BaseObject_getClassTypeIndex : Invalid Native Object");
    if (argc == 0) {
        unsigned long ret = cobj->getClassTypeIndex();
        JS::RootedValue jsret(cx);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseObject_getClassTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseObject_getClassTypeIndex : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_BaseObject_returnToPool(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::BaseObject* cobj = (dragonBones::BaseObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BaseObject_returnToPool : Invalid Native Object");
    if (argc == 0) {
        cobj->returnToPool();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseObject_returnToPool : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_BaseObject_clearPool(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        unsigned long arg0 = 0;
        ok &= jsval_to_ulong(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseObject_clearPool : Error processing arguments");
        dragonBones::BaseObject::clearPool(arg0);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseObject_clearPool : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_BaseObject_setMaxCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 2) {
        unsigned long arg0 = 0;
        unsigned long arg1 = 0;
        ok &= jsval_to_ulong(cx, args.get(0), &arg0);
        ok &= jsval_to_ulong(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseObject_setMaxCount : Error processing arguments");
        dragonBones::BaseObject::setMaxCount(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseObject_setMaxCount : wrong number of arguments");
    return false;
}


void js_register_cocos2dx_dragonbones_BaseObject(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_BaseObject_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_BaseObject_class = {
        "BaseObject",
        JSCLASS_HAS_PRIVATE,
        &dragonBones_BaseObject_classOps
    };
    jsb_dragonBones_BaseObject_class = &dragonBones_BaseObject_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getClassTypeIndex", js_cocos2dx_dragonbones_BaseObject_getClassTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("returnToPool", js_cocos2dx_dragonbones_BaseObject_returnToPool, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("clearPool", js_cocos2dx_dragonbones_BaseObject_clearPool, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMaxCount", js_cocos2dx_dragonbones_BaseObject_setMaxCount, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_BaseObject_class,
        empty_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::BaseObject>(cx, jsb_dragonBones_BaseObject_class, proto);
    jsb_dragonBones_BaseObject_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "BaseObject", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_Matrix_class;
JS::PersistentRootedObject *jsb_dragonBones_Matrix_prototype;

bool js_cocos2dx_dragonbones_Matrix_get_a(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_get_a : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->a);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_get_a : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_set_a(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_set_a : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_set_a : Error processing new value");
    cobj->a = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_get_b(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_get_b : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->b);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_get_b : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_set_b(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_set_b : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_set_b : Error processing new value");
    cobj->b = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_get_c(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_get_c : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->c);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_get_c : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_set_c(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_set_c : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_set_c : Error processing new value");
    cobj->c = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_get_d(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_get_d : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->d);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_get_d : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_set_d(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_set_d : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_set_d : Error processing new value");
    cobj->d = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_get_tx(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_get_tx : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->tx);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_get_tx : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_set_tx(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_set_tx : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_set_tx : Error processing new value");
    cobj->tx = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_get_ty(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_get_ty : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->ty);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_get_ty : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_set_ty(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Matrix* cobj = (dragonBones::Matrix *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Matrix_set_ty : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Matrix_set_ty : Error processing new value");
    cobj->ty = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Matrix_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::Matrix* cobj = new (std::nothrow) dragonBones::Matrix();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_Matrix_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_Matrix_class, proto, &jsobj, "dragonBones::Matrix");
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


void js_dragonBones_Matrix_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (Matrix)", obj);
    dragonBones::Matrix *nobj = static_cast<dragonBones::Matrix *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_Matrix(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_Matrix_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_Matrix_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_Matrix_class = {
        "Matrix",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_Matrix_classOps
    };
    jsb_dragonBones_Matrix_class = &dragonBones_Matrix_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("a", js_cocos2dx_dragonbones_Matrix_get_a, js_cocos2dx_dragonbones_Matrix_set_a, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("b", js_cocos2dx_dragonbones_Matrix_get_b, js_cocos2dx_dragonbones_Matrix_set_b, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("c", js_cocos2dx_dragonbones_Matrix_get_c, js_cocos2dx_dragonbones_Matrix_set_c, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("d", js_cocos2dx_dragonbones_Matrix_get_d, js_cocos2dx_dragonbones_Matrix_set_d, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("tx", js_cocos2dx_dragonbones_Matrix_get_tx, js_cocos2dx_dragonbones_Matrix_set_tx, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("ty", js_cocos2dx_dragonbones_Matrix_get_ty, js_cocos2dx_dragonbones_Matrix_set_ty, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_Matrix_class,
        js_cocos2dx_dragonbones_Matrix_constructor, 0,
        properties,
        nullptr,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::Matrix>(cx, jsb_dragonBones_Matrix_class, proto);
    jsb_dragonBones_Matrix_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "Matrix", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_Transform_class;
JS::PersistentRootedObject *jsb_dragonBones_Transform_prototype;

bool js_cocos2dx_dragonbones_Transform_getRotation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_getRotation : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getRotation();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_getRotation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Transform_getRotation : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Transform_setRotation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_setRotation : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_setRotation : Error processing arguments");
        cobj->setRotation(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Transform_setRotation : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Transform_normalizeRadian(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_normalizeRadian : Error processing arguments");

        float ret = dragonBones::Transform::normalizeRadian(arg0);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_normalizeRadian : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Transform_normalizeRadian : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_Transform_get_x(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_get_x : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->x);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_get_x : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Transform_set_x(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_set_x : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_set_x : Error processing new value");
    cobj->x = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Transform_get_y(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_get_y : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->y);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_get_y : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Transform_set_y(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_set_y : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_set_y : Error processing new value");
    cobj->y = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Transform_get_skewX(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_get_skewX : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->skewX);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_get_skewX : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Transform_set_skewX(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_set_skewX : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_set_skewX : Error processing new value");
    cobj->skewX = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Transform_get_skewY(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_get_skewY : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->skewY);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_get_skewY : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Transform_set_skewY(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_set_skewY : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_set_skewY : Error processing new value");
    cobj->skewY = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Transform_get_scaleX(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_get_scaleX : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->scaleX);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_get_scaleX : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Transform_set_scaleX(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_set_scaleX : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_set_scaleX : Error processing new value");
    cobj->scaleX = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Transform_get_scaleY(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_get_scaleY : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->scaleY);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_get_scaleY : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Transform_set_scaleY(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Transform* cobj = (dragonBones::Transform *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Transform_set_scaleY : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Transform_set_scaleY : Error processing new value");
    cobj->scaleY = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Transform_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::Transform* cobj = new (std::nothrow) dragonBones::Transform();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_Transform_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_Transform_class, proto, &jsobj, "dragonBones::Transform");
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


void js_dragonBones_Transform_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (Transform)", obj);
    dragonBones::Transform *nobj = static_cast<dragonBones::Transform *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_Transform(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_Transform_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_Transform_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_Transform_class = {
        "Transform",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_Transform_classOps
    };
    jsb_dragonBones_Transform_class = &dragonBones_Transform_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("x", js_cocos2dx_dragonbones_Transform_get_x, js_cocos2dx_dragonbones_Transform_set_x, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("y", js_cocos2dx_dragonbones_Transform_get_y, js_cocos2dx_dragonbones_Transform_set_y, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("skewX", js_cocos2dx_dragonbones_Transform_get_skewX, js_cocos2dx_dragonbones_Transform_set_skewX, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("skewY", js_cocos2dx_dragonbones_Transform_get_skewY, js_cocos2dx_dragonbones_Transform_set_skewY, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("scaleX", js_cocos2dx_dragonbones_Transform_get_scaleX, js_cocos2dx_dragonbones_Transform_set_scaleX, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("scaleY", js_cocos2dx_dragonbones_Transform_get_scaleY, js_cocos2dx_dragonbones_Transform_set_scaleY, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("getRotation", js_cocos2dx_dragonbones_Transform_getRotation, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setRotation", js_cocos2dx_dragonbones_Transform_setRotation, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("normalizeRadian", js_cocos2dx_dragonbones_Transform_normalizeRadian, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_Transform_class,
        js_cocos2dx_dragonbones_Transform_constructor, 0,
        properties,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::Transform>(cx, jsb_dragonBones_Transform_class, proto);
    jsb_dragonBones_Transform_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "Transform", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_TextureData_class;
JS::PersistentRootedObject *jsb_dragonBones_TextureData_prototype;

bool js_cocos2dx_dragonbones_TextureData_generateRectangle(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        dragonBones::Rectangle* ret = dragonBones::TextureData::generateRectangle();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        if (ret) {
        JS::RootedObject jsretObj(cx);
        js_get_or_create_jsobject<dragonBones::Rectangle>(cx, (dragonBones::Rectangle*)ret, &jsretObj);
        jsret = JS::ObjectOrNullValue(jsretObj);
    } else {
        jsret = JS::NullHandleValue;
    };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TextureData_generateRectangle : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_TextureData_generateRectangle : wrong number of arguments");
    return false;
}


extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_register_cocos2dx_dragonbones_TextureData(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_TextureData_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_TextureData_class = {
        "TextureData",
        JSCLASS_HAS_PRIVATE,
        &dragonBones_TextureData_classOps
    };
    jsb_dragonBones_TextureData_class = &dragonBones_TextureData_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("generateRectangle", js_cocos2dx_dragonbones_TextureData_generateRectangle, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_TextureData_class,
        empty_constructor, 0,
        properties,
        nullptr,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::TextureData>(cx, jsb_dragonBones_TextureData_class, proto);
    jsb_dragonBones_TextureData_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "TextureData", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_TextureAtlasData_class;
JS::PersistentRootedObject *jsb_dragonBones_TextureAtlasData_prototype;

bool js_cocos2dx_dragonbones_TextureAtlasData_addTexture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::TextureAtlasData* cobj = (dragonBones::TextureAtlasData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TextureAtlasData_addTexture : Invalid Native Object");
    if (argc == 1) {
        dragonBones::TextureData* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::TextureData*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TextureAtlasData_addTexture : Error processing arguments");
        cobj->addTexture(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_TextureAtlasData_addTexture : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_TextureAtlasData_generateTexture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::TextureAtlasData* cobj = (dragonBones::TextureAtlasData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TextureAtlasData_generateTexture : Invalid Native Object");
    if (argc == 0) {
        dragonBones::TextureData* ret = cobj->generateTexture();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::TextureData>(cx, (dragonBones::TextureData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TextureAtlasData_generateTexture : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_TextureAtlasData_generateTexture : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_TextureAtlasData_getTexture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::TextureAtlasData* cobj = (dragonBones::TextureAtlasData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TextureAtlasData_getTexture : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TextureAtlasData_getTexture : Error processing arguments");
        dragonBones::TextureData* ret = cobj->getTexture(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::TextureData>(cx, (dragonBones::TextureData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TextureAtlasData_getTexture : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_TextureAtlasData_getTexture : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_register_cocos2dx_dragonbones_TextureAtlasData(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_TextureAtlasData_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_TextureAtlasData_class = {
        "TextureAtlasData",
        JSCLASS_HAS_PRIVATE,
        &dragonBones_TextureAtlasData_classOps
    };
    jsb_dragonBones_TextureAtlasData_class = &dragonBones_TextureAtlasData_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("addTexture", js_cocos2dx_dragonbones_TextureAtlasData_addTexture, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("generateTexture", js_cocos2dx_dragonbones_TextureAtlasData_generateTexture, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTexture", js_cocos2dx_dragonbones_TextureAtlasData_getTexture, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_TextureAtlasData_class,
        empty_constructor, 0,
        properties,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::TextureAtlasData>(cx, jsb_dragonBones_TextureAtlasData_class, proto);
    jsb_dragonBones_TextureAtlasData_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "TextureAtlasData", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_AnimationData_class;
JS::PersistentRootedObject *jsb_dragonBones_AnimationData_prototype;

bool js_cocos2dx_dragonbones_AnimationData_getClassTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_getClassTypeIndex : Invalid Native Object");
    if (argc == 0) {
        unsigned long ret = cobj->getClassTypeIndex();
        JS::RootedValue jsret(cx);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_getClassTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationData_getClassTypeIndex : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationData_getBoneTimeline(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_getBoneTimeline : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_getBoneTimeline : Error processing arguments");
        dragonBones::BoneTimelineData* ret = cobj->getBoneTimeline(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::BoneTimelineData>(cx, (dragonBones::BoneTimelineData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_getBoneTimeline : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationData_getBoneTimeline : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::AnimationData::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationData_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_AnimationData_get_frameCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_frameCount : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->frameCount);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_frameCount : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_set_frameCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_frameCount : Invalid Native Object");

    bool ok = true;
    unsigned int arg0 = 0;
    ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_frameCount : Error processing new value");
    cobj->frameCount = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_get_playTimes(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_playTimes : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->playTimes);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_playTimes : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_set_playTimes(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_playTimes : Invalid Native Object");

    bool ok = true;
    unsigned int arg0 = 0;
    ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_playTimes : Error processing new value");
    cobj->playTimes = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_get_position(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_position : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->position);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_position : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_set_position(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_position : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_position : Error processing new value");
    cobj->position = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_get_duration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_duration : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->duration);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_duration : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_set_duration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_duration : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_duration : Error processing new value");
    cobj->duration = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_get_fadeInTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_fadeInTime : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->fadeInTime);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_fadeInTime : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_set_fadeInTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_fadeInTime : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_fadeInTime : Error processing new value");
    cobj->fadeInTime = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_get_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_name : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    ok &= std_string_to_jsval(cx, cobj->name, &jsret);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_get_name : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_set_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationData* cobj = (dragonBones::AnimationData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_name : Invalid Native Object");

    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::AnimationData* cobj = new (std::nothrow) dragonBones::AnimationData();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_AnimationData_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_AnimationData_class, proto, &jsobj, "dragonBones::AnimationData");
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


void js_dragonBones_AnimationData_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (AnimationData)", obj);
    dragonBones::AnimationData *nobj = static_cast<dragonBones::AnimationData *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_AnimationData(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_AnimationData_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_AnimationData_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_AnimationData_class = {
        "AnimationData",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_AnimationData_classOps
    };
    jsb_dragonBones_AnimationData_class = &dragonBones_AnimationData_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("frameCount", js_cocos2dx_dragonbones_AnimationData_get_frameCount, js_cocos2dx_dragonbones_AnimationData_set_frameCount, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("playTimes", js_cocos2dx_dragonbones_AnimationData_get_playTimes, js_cocos2dx_dragonbones_AnimationData_set_playTimes, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("position", js_cocos2dx_dragonbones_AnimationData_get_position, js_cocos2dx_dragonbones_AnimationData_set_position, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("duration", js_cocos2dx_dragonbones_AnimationData_get_duration, js_cocos2dx_dragonbones_AnimationData_set_duration, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("fadeInTime", js_cocos2dx_dragonbones_AnimationData_get_fadeInTime, js_cocos2dx_dragonbones_AnimationData_set_fadeInTime, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("name", js_cocos2dx_dragonbones_AnimationData_get_name, js_cocos2dx_dragonbones_AnimationData_set_name, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("getClassTypeIndex", js_cocos2dx_dragonbones_AnimationData_getClassTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBoneTimeline", js_cocos2dx_dragonbones_AnimationData_getBoneTimeline, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_AnimationData_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_AnimationData_class,
        js_cocos2dx_dragonbones_AnimationData_constructor, 0,
        properties,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::AnimationData>(cx, jsb_dragonBones_AnimationData_class, proto);
    jsb_dragonBones_AnimationData_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "AnimationData", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_BoneData_class;
JS::PersistentRootedObject *jsb_dragonBones_BoneData_prototype;

bool js_cocos2dx_dragonbones_BoneData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::BoneData::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BoneData_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BoneData_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_BoneData_get_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::BoneData* cobj = (dragonBones::BoneData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BoneData_get_name : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    ok &= std_string_to_jsval(cx, cobj->name, &jsret);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BoneData_get_name : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_BoneData_set_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::BoneData* cobj = (dragonBones::BoneData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BoneData_set_name : Invalid Native Object");

    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BoneData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_BoneData_get_parent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::BoneData* cobj = (dragonBones::BoneData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BoneData_get_parent : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    if (cobj->parent) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::BoneData>(cx, (dragonBones::BoneData*)cobj->parent, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BoneData_get_parent : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_BoneData_set_parent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::BoneData* cobj = (dragonBones::BoneData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BoneData_set_parent : Invalid Native Object");

    bool ok = true;
    dragonBones::BoneData* arg0 = nullptr;
    do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::BoneData*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BoneData_set_parent : Error processing new value");
    cobj->parent = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_BoneData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::BoneData* cobj = new (std::nothrow) dragonBones::BoneData();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_BoneData_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_BoneData_class, proto, &jsobj, "dragonBones::BoneData");
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


extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_dragonBones_BoneData_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (BoneData)", obj);
    dragonBones::BoneData *nobj = static_cast<dragonBones::BoneData *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_BoneData(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_BoneData_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_BoneData_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_BoneData_class = {
        "BoneData",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_BoneData_classOps
    };
    jsb_dragonBones_BoneData_class = &dragonBones_BoneData_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("name", js_cocos2dx_dragonbones_BoneData_get_name, js_cocos2dx_dragonbones_BoneData_set_name, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("parent", js_cocos2dx_dragonbones_BoneData_get_parent, js_cocos2dx_dragonbones_BoneData_set_parent, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_BoneData_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_BoneData_class,
        js_cocos2dx_dragonbones_BoneData_constructor, 0,
        properties,
        nullptr,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::BoneData>(cx, jsb_dragonBones_BoneData_class, proto);
    jsb_dragonBones_BoneData_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "BoneData", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_SlotData_class;
JS::PersistentRootedObject *jsb_dragonBones_SlotData_prototype;

bool js_cocos2dx_dragonbones_SlotData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::SlotData::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_SlotData_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_SlotData_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_SlotData_generateColor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        dragonBones::ColorTransform* ret = dragonBones::SlotData::generateColor();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        if (ret) {
        JS::RootedObject jsretObj(cx);
        js_get_or_create_jsobject<dragonBones::ColorTransform>(cx, (dragonBones::ColorTransform*)ret, &jsretObj);
        jsret = JS::ObjectOrNullValue(jsretObj);
    } else {
        jsret = JS::NullHandleValue;
    };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_SlotData_generateColor : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_SlotData_generateColor : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_SlotData_get_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::SlotData* cobj = (dragonBones::SlotData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_SlotData_get_name : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    ok &= std_string_to_jsval(cx, cobj->name, &jsret);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_SlotData_get_name : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_SlotData_set_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::SlotData* cobj = (dragonBones::SlotData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_SlotData_set_name : Invalid Native Object");

    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_SlotData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_SlotData_get_parent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::SlotData* cobj = (dragonBones::SlotData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_SlotData_get_parent : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    if (cobj->parent) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::BoneData>(cx, (dragonBones::BoneData*)cobj->parent, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_SlotData_get_parent : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_SlotData_set_parent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::SlotData* cobj = (dragonBones::SlotData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_SlotData_set_parent : Invalid Native Object");

    bool ok = true;
    dragonBones::BoneData* arg0 = nullptr;
    do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::BoneData*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_SlotData_set_parent : Error processing new value");
    cobj->parent = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_SlotData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::SlotData* cobj = new (std::nothrow) dragonBones::SlotData();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_SlotData_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_SlotData_class, proto, &jsobj, "dragonBones::SlotData");
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


extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_dragonBones_SlotData_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (SlotData)", obj);
    dragonBones::SlotData *nobj = static_cast<dragonBones::SlotData *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_SlotData(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_SlotData_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_SlotData_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_SlotData_class = {
        "SlotData",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_SlotData_classOps
    };
    jsb_dragonBones_SlotData_class = &dragonBones_SlotData_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("name", js_cocos2dx_dragonbones_SlotData_get_name, js_cocos2dx_dragonbones_SlotData_set_name, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("parent", js_cocos2dx_dragonbones_SlotData_get_parent, js_cocos2dx_dragonbones_SlotData_set_parent, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_SlotData_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("generateColor", js_cocos2dx_dragonbones_SlotData_generateColor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_SlotData_class,
        js_cocos2dx_dragonbones_SlotData_constructor, 0,
        properties,
        nullptr,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::SlotData>(cx, jsb_dragonBones_SlotData_class, proto);
    jsb_dragonBones_SlotData_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "SlotData", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_SkinData_class;
JS::PersistentRootedObject *jsb_dragonBones_SkinData_prototype;

bool js_cocos2dx_dragonbones_SkinData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::SkinData::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_SkinData_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_SkinData_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_SkinData_get_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::SkinData* cobj = (dragonBones::SkinData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_SkinData_get_name : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    ok &= std_string_to_jsval(cx, cobj->name, &jsret);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_SkinData_get_name : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_SkinData_set_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::SkinData* cobj = (dragonBones::SkinData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_SkinData_set_name : Invalid Native Object");

    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_SkinData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_SkinData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::SkinData* cobj = new (std::nothrow) dragonBones::SkinData();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_SkinData_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_SkinData_class, proto, &jsobj, "dragonBones::SkinData");
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


extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_dragonBones_SkinData_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (SkinData)", obj);
    dragonBones::SkinData *nobj = static_cast<dragonBones::SkinData *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_SkinData(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_SkinData_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_SkinData_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_SkinData_class = {
        "SkinData",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_SkinData_classOps
    };
    jsb_dragonBones_SkinData_class = &dragonBones_SkinData_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("name", js_cocos2dx_dragonbones_SkinData_get_name, js_cocos2dx_dragonbones_SkinData_set_name, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_SkinData_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_SkinData_class,
        js_cocos2dx_dragonbones_SkinData_constructor, 0,
        properties,
        nullptr,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::SkinData>(cx, jsb_dragonBones_SkinData_class, proto);
    jsb_dragonBones_SkinData_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "SkinData", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_ArmatureData_class;
JS::PersistentRootedObject *jsb_dragonBones_ArmatureData_prototype;

bool js_cocos2dx_dragonbones_ArmatureData_getBone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getBone : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getBone : Error processing arguments");
        dragonBones::BoneData* ret = cobj->getBone(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::BoneData>(cx, (dragonBones::BoneData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getBone : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_ArmatureData_getBone : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_ArmatureData_getAnimation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getAnimation : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getAnimation : Error processing arguments");
        dragonBones::AnimationData* ret = cobj->getAnimation(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationData>(cx, (dragonBones::AnimationData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getAnimation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_ArmatureData_getAnimation : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_ArmatureData_getSlot(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getSlot : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getSlot : Error processing arguments");
        dragonBones::SlotData* ret = cobj->getSlot(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::SlotData>(cx, (dragonBones::SlotData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getSlot : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_ArmatureData_getSlot : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_ArmatureData_getSkin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getSkin : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getSkin : Error processing arguments");
        dragonBones::SkinData* ret = cobj->getSkin(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::SkinData>(cx, (dragonBones::SkinData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getSkin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_ArmatureData_getSkin : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin : Invalid Native Object");
    if (argc == 0) {
        dragonBones::SkinData* ret = cobj->getDefaultSkin();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::SkinData>(cx, (dragonBones::SkinData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation : Invalid Native Object");
    if (argc == 0) {
        dragonBones::AnimationData* ret = cobj->getDefaultAnimation();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationData>(cx, (dragonBones::AnimationData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_ArmatureData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::ArmatureData::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_ArmatureData_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_ArmatureData_get_frameRate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_get_frameRate : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->frameRate);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_get_frameRate : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_ArmatureData_set_frameRate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_set_frameRate : Invalid Native Object");

    bool ok = true;
    unsigned int arg0 = 0;
    ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_set_frameRate : Error processing new value");
    cobj->frameRate = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_ArmatureData_get_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_get_name : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    ok &= std_string_to_jsval(cx, cobj->name, &jsret);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_get_name : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_ArmatureData_set_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_ArmatureData_set_name : Invalid Native Object");

    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_ArmatureData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_ArmatureData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::ArmatureData* cobj = new (std::nothrow) dragonBones::ArmatureData();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_ArmatureData_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_ArmatureData_class, proto, &jsobj, "dragonBones::ArmatureData");
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


extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_dragonBones_ArmatureData_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (ArmatureData)", obj);
    dragonBones::ArmatureData *nobj = static_cast<dragonBones::ArmatureData *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_ArmatureData(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_ArmatureData_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_ArmatureData_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_ArmatureData_class = {
        "ArmatureData",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_ArmatureData_classOps
    };
    jsb_dragonBones_ArmatureData_class = &dragonBones_ArmatureData_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("frameRate", js_cocos2dx_dragonbones_ArmatureData_get_frameRate, js_cocos2dx_dragonbones_ArmatureData_set_frameRate, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("name", js_cocos2dx_dragonbones_ArmatureData_get_name, js_cocos2dx_dragonbones_ArmatureData_set_name, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("getBone", js_cocos2dx_dragonbones_ArmatureData_getBone, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getAnimation", js_cocos2dx_dragonbones_ArmatureData_getAnimation, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSlot", js_cocos2dx_dragonbones_ArmatureData_getSlot, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSkin", js_cocos2dx_dragonbones_ArmatureData_getSkin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDefaultSkin", js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDefaultAnimation", js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_ArmatureData_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_ArmatureData_class,
        js_cocos2dx_dragonbones_ArmatureData_constructor, 0,
        properties,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::ArmatureData>(cx, jsb_dragonBones_ArmatureData_class, proto);
    jsb_dragonBones_ArmatureData_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ArmatureData", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_DragonBonesData_class;
JS::PersistentRootedObject *jsb_dragonBones_DragonBonesData_prototype;

bool js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames : Invalid Native Object");
    if (argc == 0) {
        const std::vector<std::string>& ret = cobj->getArmatureNames();
        JS::RootedValue jsret(cx);
        ok &= std_vector_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_DragonBonesData_addArmature(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_addArmature : Invalid Native Object");
    if (argc == 1) {
        dragonBones::ArmatureData* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::ArmatureData*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_addArmature : Error processing arguments");
        cobj->addArmature(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_DragonBonesData_addArmature : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_DragonBonesData_getArmature(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_getArmature : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_getArmature : Error processing arguments");
        dragonBones::ArmatureData* ret = cobj->getArmature(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::ArmatureData>(cx, (dragonBones::ArmatureData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_getArmature : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_DragonBonesData_getArmature : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_DragonBonesData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::DragonBonesData::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_DragonBonesData_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_DragonBonesData_get_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_get_name : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    ok &= std_string_to_jsval(cx, cobj->name, &jsret);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_get_name : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_DragonBonesData_set_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_set_name : Invalid Native Object");

    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_DragonBonesData_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_DragonBonesData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::DragonBonesData* cobj = new (std::nothrow) dragonBones::DragonBonesData();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_DragonBonesData_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_DragonBonesData_class, proto, &jsobj, "dragonBones::DragonBonesData");
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


extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_dragonBones_DragonBonesData_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (DragonBonesData)", obj);
    dragonBones::DragonBonesData *nobj = static_cast<dragonBones::DragonBonesData *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_DragonBonesData(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_DragonBonesData_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_DragonBonesData_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_DragonBonesData_class = {
        "DragonBonesData",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_DragonBonesData_classOps
    };
    jsb_dragonBones_DragonBonesData_class = &dragonBones_DragonBonesData_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("name", js_cocos2dx_dragonbones_DragonBonesData_get_name, js_cocos2dx_dragonbones_DragonBonesData_set_name, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("getArmatureNames", js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("addArmature", js_cocos2dx_dragonbones_DragonBonesData_addArmature, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getArmature", js_cocos2dx_dragonbones_DragonBonesData_getArmature, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_DragonBonesData_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_DragonBonesData_class,
        js_cocos2dx_dragonbones_DragonBonesData_constructor, 0,
        properties,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::DragonBonesData>(cx, jsb_dragonBones_DragonBonesData_class, proto);
    jsb_dragonBones_DragonBonesData_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "DragonBonesData", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_EventObject_class;
JS::PersistentRootedObject *jsb_dragonBones_EventObject_prototype;

bool js_cocos2dx_dragonbones_EventObject_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::EventObject::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_EventObject_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_EventObject_get_type(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_get_type : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    ok &= std_string_to_jsval(cx, cobj->type, &jsret);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_get_type : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_set_type(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_set_type : Invalid Native Object");

    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_set_type : Error processing new value");
    cobj->type = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_get_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_get_name : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    ok &= std_string_to_jsval(cx, cobj->name, &jsret);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_get_name : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_set_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_set_name : Invalid Native Object");

    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_get_armature(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_get_armature : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    if (cobj->armature) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Armature>(cx, (dragonBones::Armature*)cobj->armature, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_get_armature : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_set_armature(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_set_armature : Invalid Native Object");

    bool ok = true;
    dragonBones::Armature* arg0 = nullptr;
    do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Armature*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_set_armature : Error processing new value");
    cobj->armature = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_get_bone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_get_bone : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    if (cobj->bone) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Bone>(cx, (dragonBones::Bone*)cobj->bone, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_get_bone : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_set_bone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_set_bone : Invalid Native Object");

    bool ok = true;
    dragonBones::Bone* arg0 = nullptr;
    do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Bone*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_set_bone : Error processing new value");
    cobj->bone = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_get_slot(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_get_slot : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    if (cobj->slot) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Slot>(cx, (dragonBones::Slot*)cobj->slot, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_get_slot : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_set_slot(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_set_slot : Invalid Native Object");

    bool ok = true;
    dragonBones::Slot* arg0 = nullptr;
    do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Slot*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_set_slot : Error processing new value");
    cobj->slot = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_get_animationState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_get_animationState : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    if (cobj->animationState) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)cobj->animationState, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_get_animationState : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_set_animationState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::EventObject* cobj = (dragonBones::EventObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_EventObject_set_animationState : Invalid Native Object");

    bool ok = true;
    dragonBones::AnimationState* arg0 = nullptr;
    do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::AnimationState*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_EventObject_set_animationState : Error processing new value");
    cobj->animationState = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_EventObject_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::EventObject* cobj = new (std::nothrow) dragonBones::EventObject();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_EventObject_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_EventObject_class, proto, &jsobj, "dragonBones::EventObject");
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


extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_dragonBones_EventObject_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (EventObject)", obj);
    dragonBones::EventObject *nobj = static_cast<dragonBones::EventObject *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_EventObject(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_EventObject_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_EventObject_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_EventObject_class = {
        "EventObject",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_EventObject_classOps
    };
    jsb_dragonBones_EventObject_class = &dragonBones_EventObject_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("type", js_cocos2dx_dragonbones_EventObject_get_type, js_cocos2dx_dragonbones_EventObject_set_type, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("name", js_cocos2dx_dragonbones_EventObject_get_name, js_cocos2dx_dragonbones_EventObject_set_name, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("armature", js_cocos2dx_dragonbones_EventObject_get_armature, js_cocos2dx_dragonbones_EventObject_set_armature, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("bone", js_cocos2dx_dragonbones_EventObject_get_bone, js_cocos2dx_dragonbones_EventObject_set_bone, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("slot", js_cocos2dx_dragonbones_EventObject_get_slot, js_cocos2dx_dragonbones_EventObject_set_slot, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("animationState", js_cocos2dx_dragonbones_EventObject_get_animationState, js_cocos2dx_dragonbones_EventObject_set_animationState, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_EventObject_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_EventObject_class,
        js_cocos2dx_dragonbones_EventObject_constructor, 0,
        properties,
        nullptr,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::EventObject>(cx, jsb_dragonBones_EventObject_class, proto);
    jsb_dragonBones_EventObject_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "EventObject", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_Armature_class;
JS::PersistentRootedObject *jsb_dragonBones_Armature_prototype;

bool js_cocos2dx_dragonbones_Armature_getSlot(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getSlot : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getSlot : Error processing arguments");
        dragonBones::Slot* ret = cobj->getSlot(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Slot>(cx, (dragonBones::Slot*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getSlot : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_getSlot : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Armature__bufferAction(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature__bufferAction : Invalid Native Object");
    if (argc == 1) {
        dragonBones::ActionData* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::ActionData*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature__bufferAction : Error processing arguments");
        cobj->_bufferAction(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature__bufferAction : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_getCacheFrameRate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getCacheFrameRate : Invalid Native Object");
    if (argc == 0) {
        unsigned int ret = cobj->getCacheFrameRate();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getCacheFrameRate : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_getCacheFrameRate : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_getName(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getName : Invalid Native Object");
    if (argc == 0) {
        const std::string& ret = cobj->getName();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getName : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_getName : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_dispose(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_dispose : Invalid Native Object");
    if (argc == 0) {
        cobj->dispose();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_dispose : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_addSlot(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_addSlot : Invalid Native Object");
    if (argc == 2) {
        dragonBones::Slot* arg0 = nullptr;
        std::string arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Slot*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_addSlot : Error processing arguments");
        cobj->addSlot(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_addSlot : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_invalidUpdate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_invalidUpdate : Invalid Native Object");
    if (argc == 0) {
        cobj->invalidUpdate();
        args.rval().setUndefined();
        return true;
    }
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_invalidUpdate : Error processing arguments");
        cobj->invalidUpdate(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_invalidUpdate : Error processing arguments");
        cobj->invalidUpdate(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_invalidUpdate : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_getBoneByDisplay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getBoneByDisplay : Invalid Native Object");
    if (argc == 1) {
        void* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getBoneByDisplay : Error processing arguments");
        dragonBones::Bone* ret = cobj->getBoneByDisplay(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Bone>(cx, (dragonBones::Bone*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getBoneByDisplay : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_getBoneByDisplay : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_setCacheFrameRate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_setCacheFrameRate : Invalid Native Object");
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_setCacheFrameRate : Error processing arguments");
        cobj->setCacheFrameRate(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_setCacheFrameRate : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_removeSlot(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_removeSlot : Invalid Native Object");
    if (argc == 1) {
        dragonBones::Slot* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Slot*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_removeSlot : Error processing arguments");
        cobj->removeSlot(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_removeSlot : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_addBone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_addBone : Invalid Native Object");
    if (argc == 1) {
        dragonBones::Bone* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Bone*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_addBone : Error processing arguments");
        cobj->addBone(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        dragonBones::Bone* arg0 = nullptr;
        std::string arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Bone*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_addBone : Error processing arguments");
        cobj->addBone(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_addBone : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_advanceTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_advanceTime : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_advanceTime : Error processing arguments");
        cobj->advanceTime(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_advanceTime : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_getBone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getBone : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getBone : Error processing arguments");
        dragonBones::Bone* ret = cobj->getBone(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Bone>(cx, (dragonBones::Bone*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getBone : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_getBone : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_getParent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getParent : Invalid Native Object");
    if (argc == 0) {
        dragonBones::Slot* ret = cobj->getParent();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Slot>(cx, (dragonBones::Slot*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getParent : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_getParent : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_getSlotByDisplay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_getSlotByDisplay : Invalid Native Object");
    if (argc == 1) {
        void* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getSlotByDisplay : Error processing arguments");
        dragonBones::Slot* ret = cobj->getSlotByDisplay(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Slot>(cx, (dragonBones::Slot*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getSlotByDisplay : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_getSlotByDisplay : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_removeBone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_removeBone : Invalid Native Object");
    if (argc == 1) {
        dragonBones::Bone* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Bone*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_removeBone : Error processing arguments");
        cobj->removeBone(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_removeBone : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_replaceTexture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Armature* cobj = (dragonBones::Armature *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Armature_replaceTexture : Invalid Native Object");
    if (argc == 1) {
        void* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR void*
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_replaceTexture : Error processing arguments");
        cobj->replaceTexture(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_replaceTexture : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Armature_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::Armature::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Armature_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Armature_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_Armature_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::Armature* cobj = new (std::nothrow) dragonBones::Armature();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_Armature_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_Armature_class, proto, &jsobj, "dragonBones::Armature");
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


extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_dragonBones_Armature_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (Armature)", obj);
    dragonBones::Armature *nobj = static_cast<dragonBones::Armature *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_Armature(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_Armature_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_Armature_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_Armature_class = {
        "Armature",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_Armature_classOps
    };
    jsb_dragonBones_Armature_class = &dragonBones_Armature_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("getSlot", js_cocos2dx_dragonbones_Armature_getSlot, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("_bufferAction", js_cocos2dx_dragonbones_Armature__bufferAction, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCacheFrameRate", js_cocos2dx_dragonbones_Armature_getCacheFrameRate, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getName", js_cocos2dx_dragonbones_Armature_getName, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("dispose", js_cocos2dx_dragonbones_Armature_dispose, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("addSlot", js_cocos2dx_dragonbones_Armature_addSlot, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("invalidUpdate", js_cocos2dx_dragonbones_Armature_invalidUpdate, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBoneByDisplay", js_cocos2dx_dragonbones_Armature_getBoneByDisplay, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setCacheFrameRate", js_cocos2dx_dragonbones_Armature_setCacheFrameRate, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeSlot", js_cocos2dx_dragonbones_Armature_removeSlot, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("addBone", js_cocos2dx_dragonbones_Armature_addBone, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("advanceTime", js_cocos2dx_dragonbones_Armature_advanceTime, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBone", js_cocos2dx_dragonbones_Armature_getBone, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getParent", js_cocos2dx_dragonbones_Armature_getParent, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSlotByDisplay", js_cocos2dx_dragonbones_Armature_getSlotByDisplay, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeBone", js_cocos2dx_dragonbones_Armature_removeBone, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("replaceTexture", js_cocos2dx_dragonbones_Armature_replaceTexture, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_Armature_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_Armature_class,
        js_cocos2dx_dragonbones_Armature_constructor, 0,
        properties,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::Armature>(cx, jsb_dragonBones_Armature_class, proto);
    jsb_dragonBones_Armature_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "Armature", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_Animation_class;
JS::PersistentRootedObject *jsb_dragonBones_Animation_prototype;

bool js_cocos2dx_dragonbones_Animation_isPlaying(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_isPlaying : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isPlaying();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_isPlaying : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_isPlaying : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_getAnimationNames(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_getAnimationNames : Invalid Native Object");
    if (argc == 0) {
        const std::vector<std::string>& ret = cobj->getAnimationNames();
        JS::RootedValue jsret(cx);
        ok &= std_vector_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_getAnimationNames : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_getAnimationNames : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_fadeIn(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->fadeIn(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        float arg1 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->fadeIn(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->fadeIn(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 4) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->fadeIn(arg0, arg1, arg2, arg3);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 5) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        ok &= jsval_to_std_string(cx, args.get(4), &arg4);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 6) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        dragonBones::AnimationFadeOutMode arg5;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        ok &= jsval_to_std_string(cx, args.get(4), &arg4);
        ok &= jsval_to_int32(cx, args.get(5), (int32_t *)&arg5);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4, arg5);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 7) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        dragonBones::AnimationFadeOutMode arg5;
        bool arg6;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        ok &= jsval_to_std_string(cx, args.get(4), &arg4);
        ok &= jsval_to_int32(cx, args.get(5), (int32_t *)&arg5);
        ok &= jsval_to_bool(cx, args.get(6), &arg6);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 8) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        dragonBones::AnimationFadeOutMode arg5;
        bool arg6;
        bool arg7;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        ok &= jsval_to_std_string(cx, args.get(4), &arg4);
        ok &= jsval_to_int32(cx, args.get(5), (int32_t *)&arg5);
        ok &= jsval_to_bool(cx, args.get(6), &arg6);
        ok &= jsval_to_bool(cx, args.get(7), &arg7);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 9) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        dragonBones::AnimationFadeOutMode arg5;
        bool arg6;
        bool arg7;
        bool arg8;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        ok &= jsval_to_std_string(cx, args.get(4), &arg4);
        ok &= jsval_to_int32(cx, args.get(5), (int32_t *)&arg5);
        ok &= jsval_to_bool(cx, args.get(6), &arg6);
        ok &= jsval_to_bool(cx, args.get(7), &arg7);
        ok &= jsval_to_bool(cx, args.get(8), &arg8);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 10) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        dragonBones::AnimationFadeOutMode arg5;
        bool arg6;
        bool arg7;
        bool arg8;
        bool arg9;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        ok &= jsval_to_std_string(cx, args.get(4), &arg4);
        ok &= jsval_to_int32(cx, args.get(5), (int32_t *)&arg5);
        ok &= jsval_to_bool(cx, args.get(6), &arg6);
        ok &= jsval_to_bool(cx, args.get(7), &arg7);
        ok &= jsval_to_bool(cx, args.get(8), &arg8);
        ok &= jsval_to_bool(cx, args.get(9), &arg9);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->fadeIn(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_fadeIn : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_fadeIn : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_isCompleted(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_isCompleted : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isCompleted();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_isCompleted : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_isCompleted : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_reset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_reset : Invalid Native Object");
    if (argc == 0) {
        cobj->reset();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_reset : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_play(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_play : Invalid Native Object");
    if (argc == 0) {
        dragonBones::AnimationState* ret = cobj->play();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_play : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_play : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->play(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_play : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        int arg1 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_play : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->play(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_play : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_play : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_getState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_getState : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_getState : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->getState(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_getState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_getState : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_stop(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_stop : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_stop : Error processing arguments");
        cobj->stop(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_stop : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_getLastAnimationName(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_getLastAnimationName : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getLastAnimationName();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_getLastAnimationName : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_getLastAnimationName : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_getLastAnimationState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_getLastAnimationState : Invalid Native Object");
    if (argc == 0) {
        dragonBones::AnimationState* ret = cobj->getLastAnimationState();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_getLastAnimationState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_getLastAnimationState : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndPlayByTime(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        float arg1 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndPlayByTime(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndPlayByTime(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndPlayByProgress(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        float arg1 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndPlayByProgress(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        float arg1 = 0;
        int arg2 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndPlayByProgress(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_hasAnimation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_hasAnimation : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_hasAnimation : Error processing arguments");
        bool ret = cobj->hasAnimation(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_hasAnimation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_hasAnimation : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_gotoAndStopByTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByTime : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByTime : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndStopByTime(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByTime : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        float arg1 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByTime : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndStopByTime(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByTime : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_gotoAndStopByTime : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndStopByProgress(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        float arg1 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndStopByProgress(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndPlayByFrame(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        unsigned int arg1 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndPlayByFrame(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        unsigned int arg1 = 0;
        int arg2 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndPlayByFrame(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndStopByFrame(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        unsigned int arg1 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame : Error processing arguments");
        dragonBones::AnimationState* ret = cobj->gotoAndStopByFrame(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::AnimationState>(cx, (dragonBones::AnimationState*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Animation_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::Animation::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Animation_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_Animation_get_timeScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_get_timeScale : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->timeScale);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_get_timeScale : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Animation_set_timeScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Animation* cobj = (dragonBones::Animation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Animation_set_timeScale : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Animation_set_timeScale : Error processing new value");
    cobj->timeScale = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Animation_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::Animation* cobj = new (std::nothrow) dragonBones::Animation();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_Animation_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_Animation_class, proto, &jsobj, "dragonBones::Animation");
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


extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_dragonBones_Animation_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (Animation)", obj);
    dragonBones::Animation *nobj = static_cast<dragonBones::Animation *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_Animation(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_Animation_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_Animation_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_Animation_class = {
        "Animation",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_Animation_classOps
    };
    jsb_dragonBones_Animation_class = &dragonBones_Animation_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("timeScale", js_cocos2dx_dragonbones_Animation_get_timeScale, js_cocos2dx_dragonbones_Animation_set_timeScale, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("isPlaying", js_cocos2dx_dragonbones_Animation_isPlaying, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getAnimationNames", js_cocos2dx_dragonbones_Animation_getAnimationNames, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("fadeIn", js_cocos2dx_dragonbones_Animation_fadeIn, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isCompleted", js_cocos2dx_dragonbones_Animation_isCompleted, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("reset", js_cocos2dx_dragonbones_Animation_reset, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("play", js_cocos2dx_dragonbones_Animation_play, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getState", js_cocos2dx_dragonbones_Animation_getState, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stop", js_cocos2dx_dragonbones_Animation_stop, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getLastAnimationName", js_cocos2dx_dragonbones_Animation_getLastAnimationName, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getLastAnimationState", js_cocos2dx_dragonbones_Animation_getLastAnimationState, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("gotoAndPlayByTime", js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("gotoAndPlayByProgress", js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("hasAnimation", js_cocos2dx_dragonbones_Animation_hasAnimation, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("gotoAndStopByTime", js_cocos2dx_dragonbones_Animation_gotoAndStopByTime, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("gotoAndStopByProgress", js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("gotoAndPlayByFrame", js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("gotoAndStopByFrame", js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_Animation_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_Animation_class,
        js_cocos2dx_dragonbones_Animation_constructor, 0,
        properties,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::Animation>(cx, jsb_dragonBones_Animation_class, proto);
    jsb_dragonBones_Animation_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "Animation", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_TransformObject_class;
JS::PersistentRootedObject *jsb_dragonBones_TransformObject_prototype;

bool js_cocos2dx_dragonbones_TransformObject__setArmature(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TransformObject__setArmature : Invalid Native Object");
    if (argc == 1) {
        dragonBones::Armature* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Armature*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TransformObject__setArmature : Error processing arguments");
        cobj->_setArmature(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_TransformObject__setArmature : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_TransformObject__setParent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TransformObject__setParent : Invalid Native Object");
    if (argc == 1) {
        dragonBones::Bone* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Bone*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TransformObject__setParent : Error processing arguments");
        cobj->_setParent(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_TransformObject__setParent : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_TransformObject_getParent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TransformObject_getParent : Invalid Native Object");
    if (argc == 0) {
        dragonBones::Bone* ret = cobj->getParent();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Bone>(cx, (dragonBones::Bone*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TransformObject_getParent : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_TransformObject_getParent : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_TransformObject_getArmature(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TransformObject_getArmature : Invalid Native Object");
    if (argc == 0) {
        dragonBones::Armature* ret = cobj->getArmature();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Armature>(cx, (dragonBones::Armature*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TransformObject_getArmature : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_TransformObject_getArmature : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_TransformObject_get_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TransformObject_get_name : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    ok &= std_string_to_jsval(cx, cobj->name, &jsret);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TransformObject_get_name : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_TransformObject_set_name(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TransformObject_set_name : Invalid Native Object");

    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TransformObject_set_name : Error processing new value");
    cobj->name = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_TransformObject_get_globalTransformMatrix(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TransformObject_get_globalTransformMatrix : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    if (cobj->globalTransformMatrix) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Matrix>(cx, (dragonBones::Matrix*)cobj->globalTransformMatrix, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TransformObject_get_globalTransformMatrix : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_TransformObject_set_globalTransformMatrix(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_TransformObject_set_globalTransformMatrix : Invalid Native Object");

    bool ok = true;
    dragonBones::Matrix* arg0 = nullptr;
    do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Matrix*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_TransformObject_set_globalTransformMatrix : Error processing new value");
    cobj->globalTransformMatrix = arg0;
    return true;
}

extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_register_cocos2dx_dragonbones_TransformObject(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_TransformObject_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_TransformObject_class = {
        "TransformObject",
        JSCLASS_HAS_PRIVATE,
        &dragonBones_TransformObject_classOps
    };
    jsb_dragonBones_TransformObject_class = &dragonBones_TransformObject_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("name", js_cocos2dx_dragonbones_TransformObject_get_name, js_cocos2dx_dragonbones_TransformObject_set_name, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("globalTransformMatrix", js_cocos2dx_dragonbones_TransformObject_get_globalTransformMatrix, js_cocos2dx_dragonbones_TransformObject_set_globalTransformMatrix, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("_setArmature", js_cocos2dx_dragonbones_TransformObject__setArmature, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("_setParent", js_cocos2dx_dragonbones_TransformObject__setParent, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getParent", js_cocos2dx_dragonbones_TransformObject_getParent, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getArmature", js_cocos2dx_dragonbones_TransformObject_getArmature, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_TransformObject_class,
        empty_constructor, 0,
        properties,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::TransformObject>(cx, jsb_dragonBones_TransformObject_class, proto);
    jsb_dragonBones_TransformObject_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "TransformObject", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_Bone_class;
JS::PersistentRootedObject *jsb_dragonBones_Bone_prototype;

bool js_cocos2dx_dragonbones_Bone_getIK(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Bone* cobj = (dragonBones::Bone *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Bone_getIK : Invalid Native Object");
    if (argc == 0) {
        dragonBones::Bone* ret = cobj->getIK();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Bone>(cx, (dragonBones::Bone*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Bone_getIK : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Bone_getIK : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Bone_getIKChainIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Bone* cobj = (dragonBones::Bone *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Bone_getIKChainIndex : Invalid Native Object");
    if (argc == 0) {
        unsigned int ret = cobj->getIKChainIndex();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Bone_getIKChainIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Bone_getIKChainIndex : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Bone_contains(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Bone* cobj = (dragonBones::Bone *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Bone_contains : Invalid Native Object");
    if (argc == 1) {
        const dragonBones::TransformObject* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (const dragonBones::TransformObject*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Bone_contains : Error processing arguments");
        bool ret = cobj->contains(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Bone_contains : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Bone_contains : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Bone_getIKChain(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Bone* cobj = (dragonBones::Bone *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Bone_getIKChain : Invalid Native Object");
    if (argc == 0) {
        unsigned int ret = cobj->getIKChain();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Bone_getIKChain : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Bone_getIKChain : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Bone_getVisible(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Bone* cobj = (dragonBones::Bone *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Bone_getVisible : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->getVisible();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Bone_getVisible : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Bone_getVisible : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Bone_setVisible(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Bone* cobj = (dragonBones::Bone *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Bone_setVisible : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Bone_setVisible : Error processing arguments");
        cobj->setVisible(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Bone_setVisible : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Bone_invalidUpdate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Bone* cobj = (dragonBones::Bone *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Bone_invalidUpdate : Invalid Native Object");
    if (argc == 0) {
        cobj->invalidUpdate();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Bone_invalidUpdate : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Bone_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::Bone::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Bone_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Bone_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_Bone_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::Bone* cobj = new (std::nothrow) dragonBones::Bone();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_Bone_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_Bone_class, proto, &jsobj, "dragonBones::Bone");
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


extern JS::PersistentRootedObject *jsb_dragonBones_TransformObject_prototype;

void js_dragonBones_Bone_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (Bone)", obj);
    dragonBones::Bone *nobj = static_cast<dragonBones::Bone *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_Bone(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_Bone_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_Bone_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_Bone_class = {
        "Bone",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_Bone_classOps
    };
    jsb_dragonBones_Bone_class = &dragonBones_Bone_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("getIK", js_cocos2dx_dragonbones_Bone_getIK, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getIKChainIndex", js_cocos2dx_dragonbones_Bone_getIKChainIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("contains", js_cocos2dx_dragonbones_Bone_contains, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getIKChain", js_cocos2dx_dragonbones_Bone_getIKChain, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getVisible", js_cocos2dx_dragonbones_Bone_getVisible, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setVisible", js_cocos2dx_dragonbones_Bone_setVisible, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("invalidUpdate", js_cocos2dx_dragonbones_Bone_invalidUpdate, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_Bone_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_TransformObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_Bone_class,
        js_cocos2dx_dragonbones_Bone_constructor, 0,
        properties,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::Bone>(cx, jsb_dragonBones_Bone_class, proto);
    jsb_dragonBones_Bone_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "Bone", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_Slot_class;
JS::PersistentRootedObject *jsb_dragonBones_Slot_prototype;

bool js_cocos2dx_dragonbones_Slot_getChildArmature(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_getChildArmature : Invalid Native Object");
    if (argc == 0) {
        dragonBones::Armature* ret = cobj->getChildArmature();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Armature>(cx, (dragonBones::Armature*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Slot_getChildArmature : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Slot_getChildArmature : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Slot_invalidUpdate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_invalidUpdate : Invalid Native Object");
    if (argc == 0) {
        cobj->invalidUpdate();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Slot_invalidUpdate : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Slot_setDisplayIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_setDisplayIndex : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Slot_setDisplayIndex : Error processing arguments");
        cobj->setDisplayIndex(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Slot_setDisplayIndex : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Slot_setChildArmature(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_setChildArmature : Invalid Native Object");
    if (argc == 1) {
        dragonBones::Armature* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::Armature*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Slot_setChildArmature : Error processing arguments");
        cobj->setChildArmature(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Slot_setChildArmature : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_Slot_getDisplayIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_getDisplayIndex : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getDisplayIndex();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Slot_getDisplayIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_Slot_getDisplayIndex : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_Slot_get_inheritAnimation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_get_inheritAnimation : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::BooleanValue(cobj->inheritAnimation);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Slot_get_inheritAnimation : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Slot_set_inheritAnimation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_set_inheritAnimation : Invalid Native Object");

    bool ok = true;
    bool arg0;
    ok &= jsval_to_bool(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Slot_set_inheritAnimation : Error processing new value");
    cobj->inheritAnimation = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_Slot_get_displayController(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_get_displayController : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    ok &= std_string_to_jsval(cx, cobj->displayController, &jsret);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Slot_get_displayController : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_Slot_set_displayController(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::Slot* cobj = (dragonBones::Slot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_Slot_set_displayController : Invalid Native Object");

    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_Slot_set_displayController : Error processing new value");
    cobj->displayController = arg0;
    return true;
}

void js_register_cocos2dx_dragonbones_Slot(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_Slot_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_Slot_class = {
        "Slot",
        JSCLASS_HAS_PRIVATE,
        &dragonBones_Slot_classOps
    };
    jsb_dragonBones_Slot_class = &dragonBones_Slot_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("inheritAnimation", js_cocos2dx_dragonbones_Slot_get_inheritAnimation, js_cocos2dx_dragonbones_Slot_set_inheritAnimation, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("displayController", js_cocos2dx_dragonbones_Slot_get_displayController, js_cocos2dx_dragonbones_Slot_set_displayController, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("getChildArmature", js_cocos2dx_dragonbones_Slot_getChildArmature, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("invalidUpdate", js_cocos2dx_dragonbones_Slot_invalidUpdate, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setDisplayIndex", js_cocos2dx_dragonbones_Slot_setDisplayIndex, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setChildArmature", js_cocos2dx_dragonbones_Slot_setChildArmature, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDisplayIndex", js_cocos2dx_dragonbones_Slot_getDisplayIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_Slot_class,
        empty_constructor, 0,
        properties,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::Slot>(cx, jsb_dragonBones_Slot_class, proto);
    jsb_dragonBones_Slot_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "Slot", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_BaseFactory_class;
JS::PersistentRootedObject *jsb_dragonBones_BaseFactory_prototype;

bool js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData : Error processing arguments");
        cobj->removeDragonBonesData(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData : Error processing arguments");
        cobj->removeDragonBonesData(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData : Error processing arguments");
        cobj->removeTextureAtlasData(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData : Error processing arguments");
        cobj->removeTextureAtlasData(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : Invalid Native Object");
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* ret = cobj->parseDragonBonesData(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::DragonBonesData>(cx, (dragonBones::DragonBonesData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        const char* arg0 = nullptr;
        std::string arg1;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* ret = cobj->parseDragonBonesData(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::DragonBonesData>(cx, (dragonBones::DragonBonesData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 3) {
        const char* arg0 = nullptr;
        std::string arg1;
        float arg2 = 0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* ret = cobj->parseDragonBonesData(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::DragonBonesData>(cx, (dragonBones::DragonBonesData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_BaseFactory_clear(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BaseFactory_clear : Invalid Native Object");
    if (argc == 0) {
        cobj->clear();
        args.rval().setUndefined();
        return true;
    }
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_clear : Error processing arguments");
        cobj->clear(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseFactory_clear : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData : Invalid Native Object");
    if (argc == 1) {
        dragonBones::DragonBonesData* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::DragonBonesData*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData : Error processing arguments");
        cobj->addDragonBonesData(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        dragonBones::DragonBonesData* arg0 = nullptr;
        std::string arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::DragonBonesData*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData : Error processing arguments");
        cobj->addDragonBonesData(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_BaseFactory_buildArmature(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        dragonBones::Armature* ret = cobj->buildArmature(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Armature>(cx, (dragonBones::Armature*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        dragonBones::Armature* ret = cobj->buildArmature(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Armature>(cx, (dragonBones::Armature*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        ok &= jsval_to_std_string(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : Error processing arguments");
        dragonBones::Armature* ret = cobj->buildArmature(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Armature>(cx, (dragonBones::Armature*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseFactory_buildArmature : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData : Invalid Native Object");
    if (argc == 1) {
        dragonBones::TextureAtlasData* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::TextureAtlasData*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData : Error processing arguments");
        cobj->addTextureAtlasData(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        dragonBones::TextureAtlasData* arg0 = nullptr;
        std::string arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (dragonBones::TextureAtlasData*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData : Error processing arguments");
        cobj->addTextureAtlasData(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::BaseFactory* cobj = (dragonBones::BaseFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData : Error processing arguments");
        dragonBones::DragonBonesData* ret = cobj->getDragonBonesData(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::DragonBonesData>(cx, (dragonBones::DragonBonesData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

void js_register_cocos2dx_dragonbones_BaseFactory(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_BaseFactory_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_BaseFactory_class = {
        "BaseFactory",
        JSCLASS_HAS_PRIVATE,
        &dragonBones_BaseFactory_classOps
    };
    jsb_dragonBones_BaseFactory_class = &dragonBones_BaseFactory_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("removeDragonBonesData", js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeTextureAtlasData", js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("parseDragonBonesData", js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("clear", js_cocos2dx_dragonbones_BaseFactory_clear, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("addDragonBonesData", js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("buildArmature", js_cocos2dx_dragonbones_BaseFactory_buildArmature, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("addTextureAtlasData", js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDragonBonesData", js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_BaseFactory_class,
        empty_constructor, 0,
        properties,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::BaseFactory>(cx, jsb_dragonBones_BaseFactory_class, proto);
    jsb_dragonBones_BaseFactory_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "BaseFactory", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_WorldClock_class;
JS::PersistentRootedObject *jsb_dragonBones_WorldClock_prototype;

bool js_cocos2dx_dragonbones_WorldClock_clear(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_WorldClock_clear : Invalid Native Object");
    if (argc == 0) {
        cobj->clear();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_WorldClock_clear : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_WorldClock_contains(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_WorldClock_contains : Invalid Native Object");
    if (argc == 1) {
        const dragonBones::IAnimateble* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (const dragonBones::IAnimateble*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_WorldClock_contains : Error processing arguments");
        bool ret = cobj->contains(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_WorldClock_contains : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_WorldClock_contains : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_WorldClock_advanceTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::WorldClock* cobj = (dragonBones::WorldClock *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_WorldClock_advanceTime : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_WorldClock_advanceTime : Error processing arguments");
        cobj->advanceTime(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_WorldClock_advanceTime : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_WorldClock_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::WorldClock* cobj = new (std::nothrow) dragonBones::WorldClock();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_WorldClock_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_WorldClock_class, proto, &jsobj, "dragonBones::WorldClock");
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


void js_dragonBones_WorldClock_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (WorldClock)", obj);
    dragonBones::WorldClock *nobj = static_cast<dragonBones::WorldClock *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_WorldClock(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_WorldClock_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_WorldClock_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_WorldClock_class = {
        "WorldClock",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_WorldClock_classOps
    };
    jsb_dragonBones_WorldClock_class = &dragonBones_WorldClock_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("clear", js_cocos2dx_dragonbones_WorldClock_clear, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("contains", js_cocos2dx_dragonbones_WorldClock_contains, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("advanceTime", js_cocos2dx_dragonbones_WorldClock_advanceTime, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_WorldClock_class,
        js_cocos2dx_dragonbones_WorldClock_constructor, 0,
        properties,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::WorldClock>(cx, jsb_dragonBones_WorldClock_class, proto);
    jsb_dragonBones_WorldClock_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "WorldClock", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_AnimationState_class;
JS::PersistentRootedObject *jsb_dragonBones_AnimationState_prototype;

bool js_cocos2dx_dragonbones_AnimationState_setCurrentTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_setCurrentTime : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_setCurrentTime : Error processing arguments");
        cobj->setCurrentTime(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_setCurrentTime : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_removeBoneMask(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_removeBoneMask : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_removeBoneMask : Error processing arguments");
        cobj->removeBoneMask(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_removeBoneMask : Error processing arguments");
        cobj->removeBoneMask(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_removeBoneMask : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_getGroup(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_getGroup : Invalid Native Object");
    if (argc == 0) {
        const std::string& ret = cobj->getGroup();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_getGroup : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_getGroup : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes : Invalid Native Object");
    if (argc == 0) {
        unsigned int ret = cobj->getCurrentPlayTimes();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_getName(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_getName : Invalid Native Object");
    if (argc == 0) {
        const std::string ret = cobj->getName();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_getName : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_getName : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_getCurrentTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_getCurrentTime : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getCurrentTime();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_getCurrentTime : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_getCurrentTime : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_getTotalTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_getTotalTime : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getTotalTime();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_getTotalTime : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_getTotalTime : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_removeAllBoneMask(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_removeAllBoneMask : Invalid Native Object");
    if (argc == 0) {
        cobj->removeAllBoneMask();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_removeAllBoneMask : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_getLayer(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_getLayer : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getLayer();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_getLayer : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_getLayer : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_isCompleted(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_isCompleted : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isCompleted();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_isCompleted : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_isCompleted : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_play(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_play : Invalid Native Object");
    if (argc == 0) {
        cobj->play();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_play : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_fadeOut(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_fadeOut : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_fadeOut : Error processing arguments");
        cobj->fadeOut(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_fadeOut : Error processing arguments");
        cobj->fadeOut(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_fadeOut : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_stop(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_stop : Invalid Native Object");
    if (argc == 0) {
        cobj->stop();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_stop : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_isPlaying(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_isPlaying : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isPlaying();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_isPlaying : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_isPlaying : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_addBoneMask(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_addBoneMask : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_addBoneMask : Error processing arguments");
        cobj->addBoneMask(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_addBoneMask : Error processing arguments");
        cobj->addBoneMask(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_addBoneMask : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_containsBoneMask(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_containsBoneMask : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_containsBoneMask : Error processing arguments");
        bool ret = cobj->containsBoneMask(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_containsBoneMask : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_containsBoneMask : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_AnimationState_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::AnimationState::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_AnimationState_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_AnimationState_get_displayControl(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_displayControl : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::BooleanValue(cobj->displayControl);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_displayControl : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_set_displayControl(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_displayControl : Invalid Native Object");

    bool ok = true;
    bool arg0;
    ok &= jsval_to_bool(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_displayControl : Error processing new value");
    cobj->displayControl = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_get_additiveBlending(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_additiveBlending : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::BooleanValue(cobj->additiveBlending);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_additiveBlending : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_set_additiveBlending(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_additiveBlending : Invalid Native Object");

    bool ok = true;
    bool arg0;
    ok &= jsval_to_bool(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_additiveBlending : Error processing new value");
    cobj->additiveBlending = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_get_playTimes(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_playTimes : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->playTimes);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_playTimes : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_set_playTimes(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_playTimes : Invalid Native Object");

    bool ok = true;
    unsigned int arg0 = 0;
    ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_playTimes : Error processing new value");
    cobj->playTimes = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_get_timeScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_timeScale : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->timeScale);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_timeScale : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_set_timeScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_timeScale : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_timeScale : Error processing new value");
    cobj->timeScale = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_get_weight(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_weight : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->weight);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_weight : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_set_weight(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_weight : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_weight : Error processing new value");
    cobj->weight = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_get_autoFadeOutTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_autoFadeOutTime : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->autoFadeOutTime);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_autoFadeOutTime : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_set_autoFadeOutTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_autoFadeOutTime : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_autoFadeOutTime : Error processing new value");
    cobj->autoFadeOutTime = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_get_fadeTotalTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_fadeTotalTime : Invalid Native Object");

    bool ok = true;
    JS::RootedValue jsret(cx);
    jsret = JS::NumberValue(cobj->fadeTotalTime);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_get_fadeTotalTime : error parsing return value");
    args.rval().set(jsret);
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_set_fadeTotalTime(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    dragonBones::AnimationState* cobj = (dragonBones::AnimationState *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_fadeTotalTime : Invalid Native Object");

    bool ok = true;
    float arg0 = 0;
    ok &= jsval_to_float(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_AnimationState_set_fadeTotalTime : Error processing new value");
    cobj->fadeTotalTime = arg0;
    return true;
}
bool js_cocos2dx_dragonbones_AnimationState_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::AnimationState* cobj = new (std::nothrow) dragonBones::AnimationState();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_AnimationState_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_AnimationState_class, proto, &jsobj, "dragonBones::AnimationState");
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


extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

void js_dragonBones_AnimationState_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (AnimationState)", obj);
    dragonBones::AnimationState *nobj = static_cast<dragonBones::AnimationState *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_AnimationState(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_AnimationState_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_AnimationState_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_AnimationState_class = {
        "AnimationState",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_AnimationState_classOps
    };
    jsb_dragonBones_AnimationState_class = &dragonBones_AnimationState_class;

    static JSPropertySpec properties[] = {
        JS_PSGS("displayControl", js_cocos2dx_dragonbones_AnimationState_get_displayControl, js_cocos2dx_dragonbones_AnimationState_set_displayControl, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("additiveBlending", js_cocos2dx_dragonbones_AnimationState_get_additiveBlending, js_cocos2dx_dragonbones_AnimationState_set_additiveBlending, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("playTimes", js_cocos2dx_dragonbones_AnimationState_get_playTimes, js_cocos2dx_dragonbones_AnimationState_set_playTimes, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("timeScale", js_cocos2dx_dragonbones_AnimationState_get_timeScale, js_cocos2dx_dragonbones_AnimationState_set_timeScale, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("weight", js_cocos2dx_dragonbones_AnimationState_get_weight, js_cocos2dx_dragonbones_AnimationState_set_weight, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("autoFadeOutTime", js_cocos2dx_dragonbones_AnimationState_get_autoFadeOutTime, js_cocos2dx_dragonbones_AnimationState_set_autoFadeOutTime, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSGS("fadeTotalTime", js_cocos2dx_dragonbones_AnimationState_get_fadeTotalTime, js_cocos2dx_dragonbones_AnimationState_set_fadeTotalTime, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("setCurrentTime", js_cocos2dx_dragonbones_AnimationState_setCurrentTime, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeBoneMask", js_cocos2dx_dragonbones_AnimationState_removeBoneMask, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getGroup", js_cocos2dx_dragonbones_AnimationState_getGroup, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCurrentPlayTimes", js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getName", js_cocos2dx_dragonbones_AnimationState_getName, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCurrentTime", js_cocos2dx_dragonbones_AnimationState_getCurrentTime, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTotalTime", js_cocos2dx_dragonbones_AnimationState_getTotalTime, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeAllBoneMask", js_cocos2dx_dragonbones_AnimationState_removeAllBoneMask, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getLayer", js_cocos2dx_dragonbones_AnimationState_getLayer, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isCompleted", js_cocos2dx_dragonbones_AnimationState_isCompleted, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("play", js_cocos2dx_dragonbones_AnimationState_play, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("fadeOut", js_cocos2dx_dragonbones_AnimationState_fadeOut, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stop", js_cocos2dx_dragonbones_AnimationState_stop, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isPlaying", js_cocos2dx_dragonbones_AnimationState_isPlaying, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("addBoneMask", js_cocos2dx_dragonbones_AnimationState_addBoneMask, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("containsBoneMask", js_cocos2dx_dragonbones_AnimationState_containsBoneMask, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_AnimationState_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseObject_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_AnimationState_class,
        js_cocos2dx_dragonbones_AnimationState_constructor, 0,
        properties,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::AnimationState>(cx, jsb_dragonBones_AnimationState_class, proto);
    jsb_dragonBones_AnimationState_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "AnimationState", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_CCTextureData_class;
JS::PersistentRootedObject *jsb_dragonBones_CCTextureData_prototype;

bool js_cocos2dx_dragonbones_CCTextureData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::CCTextureData::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCTextureData_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCTextureData_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_CCTextureData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::CCTextureData* cobj = new (std::nothrow) dragonBones::CCTextureData();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_CCTextureData_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_CCTextureData_class, proto, &jsobj, "dragonBones::CCTextureData");
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


extern JS::PersistentRootedObject *jsb_dragonBones_TextureData_prototype;

void js_dragonBones_CCTextureData_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (CCTextureData)", obj);
    dragonBones::CCTextureData *nobj = static_cast<dragonBones::CCTextureData *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_CCTextureData(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_CCTextureData_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_CCTextureData_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_CCTextureData_class = {
        "CCTextureData",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_CCTextureData_classOps
    };
    jsb_dragonBones_CCTextureData_class = &dragonBones_CCTextureData_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_CCTextureData_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_TextureData_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_CCTextureData_class,
        js_cocos2dx_dragonbones_CCTextureData_constructor, 0,
        properties,
        nullptr,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::CCTextureData>(cx, jsb_dragonBones_CCTextureData_class, proto);
    jsb_dragonBones_CCTextureData_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "CCTextureData", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_CCTextureAtlasData_class;
JS::PersistentRootedObject *jsb_dragonBones_CCTextureAtlasData_prototype;

bool js_cocos2dx_dragonbones_CCTextureAtlasData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::CCTextureAtlasData::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCTextureAtlasData_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCTextureAtlasData_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_CCTextureAtlasData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::CCTextureAtlasData* cobj = new (std::nothrow) dragonBones::CCTextureAtlasData();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_CCTextureAtlasData_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_CCTextureAtlasData_class, proto, &jsobj, "dragonBones::CCTextureAtlasData");
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


extern JS::PersistentRootedObject *jsb_dragonBones_TextureAtlasData_prototype;

void js_dragonBones_CCTextureAtlasData_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (CCTextureAtlasData)", obj);
    dragonBones::CCTextureAtlasData *nobj = static_cast<dragonBones::CCTextureAtlasData *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_CCTextureAtlasData(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_CCTextureAtlasData_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_CCTextureAtlasData_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_CCTextureAtlasData_class = {
        "CCTextureAtlasData",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_CCTextureAtlasData_classOps
    };
    jsb_dragonBones_CCTextureAtlasData_class = &dragonBones_CCTextureAtlasData_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_CCTextureAtlasData_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_TextureAtlasData_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_CCTextureAtlasData_class,
        js_cocos2dx_dragonbones_CCTextureAtlasData_constructor, 0,
        properties,
        nullptr,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::CCTextureAtlasData>(cx, jsb_dragonBones_CCTextureAtlasData_class, proto);
    jsb_dragonBones_CCTextureAtlasData_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "CCTextureAtlasData", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_CCArmatureDisplay_class;
JS::PersistentRootedObject *jsb_dragonBones_CCArmatureDisplay_prototype;

bool js_cocos2dx_dragonbones_CCArmatureDisplay_advanceTimeBySelf(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_advanceTimeBySelf : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_advanceTimeBySelf : Error processing arguments");
        cobj->advanceTimeBySelf(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCArmatureDisplay_advanceTimeBySelf : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_CCArmatureDisplay_removeEvent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_removeEvent : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_removeEvent : Error processing arguments");
        cobj->removeEvent(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCArmatureDisplay_removeEvent : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_CCArmatureDisplay_dispose(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_dispose : Invalid Native Object");
    if (argc == 0) {
        cobj->dispose();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCArmatureDisplay_dispose : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_CCArmatureDisplay_hasEventCallback(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEventCallback : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->hasEventCallback();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEventCallback : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEventCallback : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_CCArmatureDisplay_setEventCallback(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setEventCallback : Invalid Native Object");
    if (argc == 1) {
        std::function<void (dragonBones::EventObject *)> arg0;
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
		        auto lambda = [=](dragonBones::EventObject* larg0) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            if (larg0) {
		            JS::RootedObject largvObj(cx);
		            js_get_or_create_jsobject<dragonBones::EventObject>(cx, (dragonBones::EventObject*)larg0, &largvObj);
		            largv = JS::ObjectOrNullValue(largvObj);
		        } else {
		            largv = JS::NullHandleValue;
		        };
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
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_setEventCallback : Error processing arguments");
        cobj->setEventCallback(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCArmatureDisplay_setEventCallback : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_CCArmatureDisplay_clearEventCallback(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_clearEventCallback : Invalid Native Object");
    if (argc == 0) {
        cobj->clearEventCallback();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCArmatureDisplay_clearEventCallback : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_CCArmatureDisplay_addEvent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_addEvent : Invalid Native Object");
    if (argc == 2) {
        std::string arg0;
        std::function<void (dragonBones::EventObject *)> arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
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
		        auto lambda = [=](dragonBones::EventObject* larg0) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            if (larg0) {
		            JS::RootedObject largvObj(cx);
		            js_get_or_create_jsobject<dragonBones::EventObject>(cx, (dragonBones::EventObject*)larg0, &largvObj);
		            largv = JS::ObjectOrNullValue(largvObj);
		        } else {
		            largv = JS::NullHandleValue;
		        };
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
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_addEvent : Error processing arguments");
        cobj->addEvent(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCArmatureDisplay_addEvent : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent : Error processing arguments");
        bool ret = cobj->hasEvent(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature : Invalid Native Object");
    if (argc == 0) {
        dragonBones::Armature* ret = cobj->getArmature();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::Armature>(cx, (dragonBones::Armature*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_CCArmatureDisplay_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        auto ret = dragonBones::CCArmatureDisplay::create();
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_dragonBones_CCArmatureDisplay_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_dragonBones_CCArmatureDisplay_class, proto, &jsret, "dragonBones::CCArmatureDisplay");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCArmatureDisplay_create : wrong number of arguments");
    return false;
}


extern JS::PersistentRootedObject *jsb_cocos2d_Node_prototype;

void js_register_cocos2dx_dragonbones_CCArmatureDisplay(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_CCArmatureDisplay_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_CCArmatureDisplay_class = {
        "CCArmatureDisplay",
        JSCLASS_HAS_PRIVATE,
        &dragonBones_CCArmatureDisplay_classOps
    };
    jsb_dragonBones_CCArmatureDisplay_class = &dragonBones_CCArmatureDisplay_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("advanceTimeBySelf", js_cocos2dx_dragonbones_CCArmatureDisplay_advanceTimeBySelf, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeEventListener", js_cocos2dx_dragonbones_CCArmatureDisplay_removeEvent, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("dispose", js_cocos2dx_dragonbones_CCArmatureDisplay_dispose, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("hasEventCallback", js_cocos2dx_dragonbones_CCArmatureDisplay_hasEventCallback, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setEventCallback", js_cocos2dx_dragonbones_CCArmatureDisplay_setEventCallback, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("clearEventCallback", js_cocos2dx_dragonbones_CCArmatureDisplay_clearEventCallback, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("addEventListener", js_cocos2dx_dragonbones_CCArmatureDisplay_addEvent, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("hasEvent", js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("armature", js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_dragonbones_CCArmatureDisplay_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Node_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_CCArmatureDisplay_class,
        dummy_constructor<dragonBones::CCArmatureDisplay>, 0,
        properties,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::CCArmatureDisplay>(cx, jsb_dragonBones_CCArmatureDisplay_class, proto);
    jsb_dragonBones_CCArmatureDisplay_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "CCArmatureDisplay", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_dragonBones_DBCCSprite_class;
JS::PersistentRootedObject *jsb_dragonBones_DBCCSprite_prototype;

bool js_cocos2dx_dragonbones_DBCCSprite_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        auto ret = dragonBones::DBCCSprite::create();
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_dragonBones_DBCCSprite_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_dragonBones_DBCCSprite_class, proto, &jsret, "dragonBones::DBCCSprite");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_DBCCSprite_create : wrong number of arguments");
    return false;
}


extern JS::PersistentRootedObject *jsb_cocos2d_Sprite_prototype;

void js_register_cocos2dx_dragonbones_DBCCSprite(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_DBCCSprite_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_DBCCSprite_class = {
        "DBCCSprite",
        JSCLASS_HAS_PRIVATE,
        &dragonBones_DBCCSprite_classOps
    };
    jsb_dragonBones_DBCCSprite_class = &dragonBones_DBCCSprite_class;

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_dragonbones_DBCCSprite_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Sprite_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_DBCCSprite_class,
        dummy_constructor<dragonBones::DBCCSprite>, 0,
        nullptr,
        nullptr,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::DBCCSprite>(cx, jsb_dragonBones_DBCCSprite_class, proto);
    jsb_dragonBones_DBCCSprite_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "DBCCSprite", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_dragonBones_CCSlot_class;
JS::PersistentRootedObject *jsb_dragonBones_CCSlot_prototype;

bool js_cocos2dx_dragonbones_CCSlot_getClassTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCSlot* cobj = (dragonBones::CCSlot *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCSlot_getClassTypeIndex : Invalid Native Object");
    if (argc == 0) {
        unsigned long ret = cobj->getClassTypeIndex();
        JS::RootedValue jsret(cx);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCSlot_getClassTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCSlot_getClassTypeIndex : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_CCSlot_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        unsigned long ret = dragonBones::CCSlot::getTypeIndex();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= ulong_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCSlot_getTypeIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCSlot_getTypeIndex : wrong number of arguments");
    return false;
}

bool js_cocos2dx_dragonbones_CCSlot_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::CCSlot* cobj = new (std::nothrow) dragonBones::CCSlot();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_CCSlot_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_CCSlot_class, proto, &jsobj, "dragonBones::CCSlot");
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


extern JS::PersistentRootedObject *jsb_dragonBones_Slot_prototype;

void js_dragonBones_CCSlot_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (CCSlot)", obj);
    dragonBones::CCSlot *nobj = static_cast<dragonBones::CCSlot *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_CCSlot(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_CCSlot_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_CCSlot_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_CCSlot_class = {
        "CCSlot",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_CCSlot_classOps
    };
    jsb_dragonBones_CCSlot_class = &dragonBones_CCSlot_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getClassTypeIndex", js_cocos2dx_dragonbones_CCSlot_getClassTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("getTypeIndex", js_cocos2dx_dragonbones_CCSlot_getTypeIndex, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_Slot_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_CCSlot_class,
        js_cocos2dx_dragonbones_CCSlot_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::CCSlot>(cx, jsb_dragonBones_CCSlot_class, proto);
    jsb_dragonBones_CCSlot_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "CCSlot", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_dragonBones_CCFactory_class;
JS::PersistentRootedObject *jsb_dragonBones_CCFactory_prototype;

bool js_cocos2dx_dragonbones_CCFactory_getTextureDisplay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCFactory_getTextureDisplay : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_getTextureDisplay : Error processing arguments");
        cocos2d::Sprite* ret = cobj->getTextureDisplay(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_getTextureDisplay : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_getTextureDisplay : Error processing arguments");
        cocos2d::Sprite* ret = cobj->getTextureDisplay(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_getTextureDisplay : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCFactory_getTextureDisplay : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_CCFactory_getSoundEventManater(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCFactory_getSoundEventManater : Invalid Native Object");
    if (argc == 0) {
        dragonBones::CCArmatureDisplay* ret = cobj->getSoundEventManater();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::CCArmatureDisplay>(cx, (dragonBones::CCArmatureDisplay*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_getSoundEventManater : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCFactory_getSoundEventManater : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        dragonBones::CCArmatureDisplay* ret = cobj->buildArmatureDisplay(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::CCArmatureDisplay>(cx, (dragonBones::CCArmatureDisplay*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        dragonBones::CCArmatureDisplay* ret = cobj->buildArmatureDisplay(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::CCArmatureDisplay>(cx, (dragonBones::CCArmatureDisplay*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        ok &= jsval_to_std_string(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : Error processing arguments");
        dragonBones::CCArmatureDisplay* ret = cobj->buildArmatureDisplay(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::CCArmatureDisplay>(cx, (dragonBones::CCArmatureDisplay*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    dragonBones::CCFactory* cobj = (dragonBones::CCFactory *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : Invalid Native Object");
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : Error processing arguments");
        dragonBones::TextureAtlasData* ret = cobj->parseTextureAtlasData(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::TextureAtlasData>(cx, (dragonBones::TextureAtlasData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        ok &= jsval_to_std_string(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : Error processing arguments");
        dragonBones::TextureAtlasData* ret = cobj->parseTextureAtlasData(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::TextureAtlasData>(cx, (dragonBones::TextureAtlasData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    if (argc == 4) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        float arg3 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        ok &= jsval_to_std_string(cx, args.get(2), &arg2);
        ok &= jsval_to_float(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : Error processing arguments");
        dragonBones::TextureAtlasData* ret = cobj->parseTextureAtlasData(arg0, arg1, arg2, arg3);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<dragonBones::TextureAtlasData>(cx, (dragonBones::TextureAtlasData*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_dragonbones_CCFactory_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    dragonBones::CCFactory* cobj = new (std::nothrow) dragonBones::CCFactory();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_dragonBones_CCFactory_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_dragonBones_CCFactory_class, proto, &jsobj, "dragonBones::CCFactory");
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


extern JS::PersistentRootedObject *jsb_dragonBones_BaseFactory_prototype;

void js_dragonBones_CCFactory_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (CCFactory)", obj);
    dragonBones::CCFactory *nobj = static_cast<dragonBones::CCFactory *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_dragonbones_CCFactory(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps dragonBones_CCFactory_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_dragonBones_CCFactory_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass dragonBones_CCFactory_class = {
        "CCFactory",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &dragonBones_CCFactory_classOps
    };
    jsb_dragonBones_CCFactory_class = &dragonBones_CCFactory_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getTextureDisplay", js_cocos2dx_dragonbones_CCFactory_getTextureDisplay, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSoundEventManater", js_cocos2dx_dragonbones_CCFactory_getSoundEventManater, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("buildArmatureDisplay", js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("parseTextureAtlasData", js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_dragonBones_BaseFactory_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_dragonBones_CCFactory_class,
        js_cocos2dx_dragonbones_CCFactory_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<dragonBones::CCFactory>(cx, jsb_dragonBones_CCFactory_class, proto);
    jsb_dragonBones_CCFactory_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "CCFactory", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "dragonBones", &ns);

    js_register_cocos2dx_dragonbones_Slot(cx, ns);
    js_register_cocos2dx_dragonbones_Matrix(cx, ns);
    js_register_cocos2dx_dragonbones_Transform(cx, ns);
    js_register_cocos2dx_dragonbones_BaseObject(cx, ns);
    js_register_cocos2dx_dragonbones_Animation(cx, ns);
    js_register_cocos2dx_dragonbones_TextureData(cx, ns);
    js_register_cocos2dx_dragonbones_CCTextureData(cx, ns);
    js_register_cocos2dx_dragonbones_BaseFactory(cx, ns);
    js_register_cocos2dx_dragonbones_CCFactory(cx, ns);
    js_register_cocos2dx_dragonbones_WorldClock(cx, ns);
    js_register_cocos2dx_dragonbones_DBCCSprite(cx, ns);
    js_register_cocos2dx_dragonbones_TextureAtlasData(cx, ns);
    js_register_cocos2dx_dragonbones_CCArmatureDisplay(cx, ns);
    js_register_cocos2dx_dragonbones_AnimationState(cx, ns);
    js_register_cocos2dx_dragonbones_BoneData(cx, ns);
    js_register_cocos2dx_dragonbones_ArmatureData(cx, ns);
    js_register_cocos2dx_dragonbones_CCTextureAtlasData(cx, ns);
    js_register_cocos2dx_dragonbones_TransformObject(cx, ns);
    js_register_cocos2dx_dragonbones_CCSlot(cx, ns);
    js_register_cocos2dx_dragonbones_Armature(cx, ns);
    js_register_cocos2dx_dragonbones_Bone(cx, ns);
    js_register_cocos2dx_dragonbones_SkinData(cx, ns);
    js_register_cocos2dx_dragonbones_EventObject(cx, ns);
    js_register_cocos2dx_dragonbones_SlotData(cx, ns);
    js_register_cocos2dx_dragonbones_DragonBonesData(cx, ns);
    js_register_cocos2dx_dragonbones_AnimationData(cx, ns);
}

