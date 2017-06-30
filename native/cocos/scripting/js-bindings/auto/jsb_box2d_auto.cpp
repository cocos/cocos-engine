#include "scripting/js-bindings/auto/jsb_box2d_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "Box2D/Box2D.h"
#include "scripting/js-bindings/manual/box2d/js_bindings_box2d_manual.h"

JSClass  *jsb_b2Draw_class;
JS::PersistentRootedObject *jsb_b2Draw_prototype;

bool js_box2dclasses_b2Draw_AppendFlags(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Draw* cobj = (b2Draw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Draw_AppendFlags : Invalid Native Object");
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Draw_AppendFlags : Error processing arguments");
        cobj->AppendFlags(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Draw_AppendFlags : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Draw_DrawTransform(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Draw* cobj = (b2Draw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Draw_DrawTransform : Invalid Native Object");
    if (argc == 1) {
        b2Transform arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Draw_DrawTransform : Error processing arguments");
        cobj->DrawTransform(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Draw_DrawTransform : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Draw_ClearFlags(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Draw* cobj = (b2Draw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Draw_ClearFlags : Invalid Native Object");
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Draw_ClearFlags : Error processing arguments");
        cobj->ClearFlags(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Draw_ClearFlags : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Draw_DrawPolygon(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Draw* cobj = (b2Draw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Draw_DrawPolygon : Invalid Native Object");
    if (argc == 3) {
        const b2Vec2* arg0 = nullptr;
        int arg1 = 0;
        b2Color arg2;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Vec2*
		ok = false;
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Color
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Draw_DrawPolygon : Error processing arguments");
        cobj->DrawPolygon(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Draw_DrawPolygon : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2Draw_ClearDraw(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Draw* cobj = (b2Draw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Draw_ClearDraw : Invalid Native Object");
    if (argc == 0) {
        cobj->ClearDraw();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Draw_ClearDraw : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Draw_DrawSolidPolygon(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Draw* cobj = (b2Draw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Draw_DrawSolidPolygon : Invalid Native Object");
    if (argc == 3) {
        const b2Vec2* arg0 = nullptr;
        int arg1 = 0;
        b2Color arg2;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Vec2*
		ok = false;
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Color
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Draw_DrawSolidPolygon : Error processing arguments");
        cobj->DrawSolidPolygon(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Draw_DrawSolidPolygon : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2Draw_DrawCircle(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Draw* cobj = (b2Draw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Draw_DrawCircle : Invalid Native Object");
    if (argc == 3) {
        b2Vec2 arg0;
        float arg1 = 0;
        b2Color arg2;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Color
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Draw_DrawCircle : Error processing arguments");
        cobj->DrawCircle(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Draw_DrawCircle : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2Draw_SetFlags(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Draw* cobj = (b2Draw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Draw_SetFlags : Invalid Native Object");
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Draw_SetFlags : Error processing arguments");
        cobj->SetFlags(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Draw_SetFlags : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Draw_DrawSegment(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Draw* cobj = (b2Draw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Draw_DrawSegment : Invalid Native Object");
    if (argc == 3) {
        b2Vec2 arg0;
        b2Vec2 arg1;
        b2Color arg2;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        ok &= jsval_to_b2Vec2(cx, args.get(1), &arg1);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Color
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Draw_DrawSegment : Error processing arguments");
        cobj->DrawSegment(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Draw_DrawSegment : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2Draw_DrawSolidCircle(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Draw* cobj = (b2Draw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Draw_DrawSolidCircle : Invalid Native Object");
    if (argc == 4) {
        b2Vec2 arg0;
        float arg1 = 0;
        b2Vec2 arg2;
        b2Color arg3;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        ok &= jsval_to_b2Vec2(cx, args.get(2), &arg2);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Color
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Draw_DrawSolidCircle : Error processing arguments");
        cobj->DrawSolidCircle(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Draw_DrawSolidCircle : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_box2dclasses_b2Draw_GetFlags(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Draw* cobj = (b2Draw *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Draw_GetFlags : Invalid Native Object");
    if (argc == 0) {
        unsigned int ret = cobj->GetFlags();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Draw_GetFlags : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Draw_GetFlags : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

void js_register_box2dclasses_b2Draw(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2Draw_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2Draw_class = {
        "Draw",
        JSCLASS_HAS_PRIVATE,
        &b2Draw_classOps
    };
    jsb_b2Draw_class = &b2Draw_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("AppendFlags", js_box2dclasses_b2Draw_AppendFlags, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("DrawTransform", js_box2dclasses_b2Draw_DrawTransform, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ClearFlags", js_box2dclasses_b2Draw_ClearFlags, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("DrawPolygon", js_box2dclasses_b2Draw_DrawPolygon, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ClearDraw", js_box2dclasses_b2Draw_ClearDraw, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("DrawSolidPolygon", js_box2dclasses_b2Draw_DrawSolidPolygon, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("DrawCircle", js_box2dclasses_b2Draw_DrawCircle, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetFlags", js_box2dclasses_b2Draw_SetFlags, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("DrawSegment", js_box2dclasses_b2Draw_DrawSegment, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("DrawSolidCircle", js_box2dclasses_b2Draw_DrawSolidCircle, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetFlags", js_box2dclasses_b2Draw_GetFlags, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2Draw_class,
        empty_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2Draw>(cx, jsb_b2Draw_class, proto);
    jsb_b2Draw_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2Draw", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2Shape_class;
JS::PersistentRootedObject *jsb_b2Shape_prototype;

bool js_box2dclasses_b2Shape_ComputeMass(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Shape* cobj = (b2Shape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Shape_ComputeMass : Invalid Native Object");
    if (argc == 2) {
        b2MassData* arg0 = nullptr;
        float arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
		ok = false;
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Shape_ComputeMass : Error processing arguments");
        cobj->ComputeMass(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Shape_ComputeMass : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2Shape_Clone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Shape* cobj = (b2Shape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Shape_Clone : Invalid Native Object");
    if (argc == 1) {
        b2BlockAllocator* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2BlockAllocator*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Shape_Clone : Error processing arguments");
        b2Shape* ret = cobj->Clone(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Shape>(cx, (b2Shape*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Shape_Clone : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Shape_Clone : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Shape_GetType(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Shape* cobj = (b2Shape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Shape_GetType : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->GetType();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Shape_GetType : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Shape_GetType : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Shape_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Shape* cobj = (b2Shape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Shape_RayCast : Invalid Native Object");
    if (argc == 4) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        b2Transform arg2;
        int arg3 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Shape_RayCast : Error processing arguments");
        bool ret = cobj->RayCast(arg0, arg1, arg2, arg3);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Shape_RayCast : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Shape_RayCast : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_box2dclasses_b2Shape_ComputeAABB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Shape* cobj = (b2Shape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Shape_ComputeAABB : Invalid Native Object");
    if (argc == 3) {
        b2AABB* arg0 = nullptr;
        b2Transform arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2AABB*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Shape_ComputeAABB : Error processing arguments");
        cobj->ComputeAABB(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Shape_ComputeAABB : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2Shape_GetChildCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Shape* cobj = (b2Shape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Shape_GetChildCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetChildCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Shape_GetChildCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Shape_GetChildCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Shape_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Shape* cobj = (b2Shape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Shape_TestPoint : Invalid Native Object");
    if (argc == 2) {
        b2Transform arg0;
        b2Vec2 arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_b2Vec2(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Shape_TestPoint : Error processing arguments");
        bool ret = cobj->TestPoint(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Shape_TestPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Shape_TestPoint : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

void js_register_box2dclasses_b2Shape(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2Shape_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2Shape_class = {
        "Shape",
        JSCLASS_HAS_PRIVATE,
        &b2Shape_classOps
    };
    jsb_b2Shape_class = &b2Shape_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("ComputeMass", js_box2dclasses_b2Shape_ComputeMass, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Clone", js_box2dclasses_b2Shape_Clone, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetType", js_box2dclasses_b2Shape_GetType, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("RayCast", js_box2dclasses_b2Shape_RayCast, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ComputeAABB", js_box2dclasses_b2Shape_ComputeAABB, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetChildCount", js_box2dclasses_b2Shape_GetChildCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("TestPoint", js_box2dclasses_b2Shape_TestPoint, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2Shape_class,
        dummy_constructor<b2Shape>, 0,
        properties,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2Shape>(cx, jsb_b2Shape_class, proto);
    jsb_b2Shape_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2Shape", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2CircleShape_class;
JS::PersistentRootedObject *jsb_b2CircleShape_prototype;

bool js_box2dclasses_b2CircleShape_ComputeMass(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_ComputeMass : Invalid Native Object");
    if (argc == 2) {
        b2MassData* arg0 = nullptr;
        float arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
		ok = false;
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_ComputeMass : Error processing arguments");
        cobj->ComputeMass(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2CircleShape_ComputeMass : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2CircleShape_GetVertex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_GetVertex : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_GetVertex : Error processing arguments");
        const b2Vec2& ret = cobj->GetVertex(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_GetVertex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2CircleShape_GetVertex : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2CircleShape_Clone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_Clone : Invalid Native Object");
    if (argc == 1) {
        b2BlockAllocator* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2BlockAllocator*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_Clone : Error processing arguments");
        b2Shape* ret = cobj->Clone(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Shape>(cx, (b2Shape*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_Clone : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2CircleShape_Clone : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2CircleShape_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_RayCast : Invalid Native Object");
    if (argc == 4) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        b2Transform arg2;
        int arg3 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_RayCast : Error processing arguments");
        bool ret = cobj->RayCast(arg0, arg1, arg2, arg3);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_RayCast : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2CircleShape_RayCast : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_box2dclasses_b2CircleShape_ComputeAABB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_ComputeAABB : Invalid Native Object");
    if (argc == 3) {
        b2AABB* arg0 = nullptr;
        b2Transform arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2AABB*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_ComputeAABB : Error processing arguments");
        cobj->ComputeAABB(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2CircleShape_ComputeAABB : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2CircleShape_GetVertexCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_GetVertexCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetVertexCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_GetVertexCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2CircleShape_GetVertexCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2CircleShape_GetChildCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_GetChildCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetChildCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_GetChildCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2CircleShape_GetChildCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2CircleShape_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_TestPoint : Invalid Native Object");
    if (argc == 2) {
        b2Transform arg0;
        b2Vec2 arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_b2Vec2(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_TestPoint : Error processing arguments");
        bool ret = cobj->TestPoint(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_TestPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2CircleShape_TestPoint : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2CircleShape_GetSupportVertex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_GetSupportVertex : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_GetSupportVertex : Error processing arguments");
        const b2Vec2& ret = cobj->GetSupportVertex(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_GetSupportVertex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2CircleShape_GetSupportVertex : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2CircleShape_GetSupport(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_GetSupport : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_GetSupport : Error processing arguments");
        int ret = cobj->GetSupport(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_GetSupport : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2CircleShape_GetSupport : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2CircleShape_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    b2CircleShape* cobj = new (std::nothrow) b2CircleShape();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_b2CircleShape_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_b2CircleShape_class, proto, &jsobj, "b2CircleShape");
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


extern JS::PersistentRootedObject *jsb_b2Shape_prototype;

void js_b2CircleShape_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (b2CircleShape)", obj);
    b2CircleShape *nobj = static_cast<b2CircleShape *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_box2dclasses_b2CircleShape(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2CircleShape_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_b2CircleShape_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2CircleShape_class = {
        "CircleShape",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &b2CircleShape_classOps
    };
    jsb_b2CircleShape_class = &b2CircleShape_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("ComputeMass", js_box2dclasses_b2CircleShape_ComputeMass, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetVertex", js_box2dclasses_b2CircleShape_GetVertex, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Clone", js_box2dclasses_b2CircleShape_Clone, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("RayCast", js_box2dclasses_b2CircleShape_RayCast, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ComputeAABB", js_box2dclasses_b2CircleShape_ComputeAABB, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetVertexCount", js_box2dclasses_b2CircleShape_GetVertexCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetChildCount", js_box2dclasses_b2CircleShape_GetChildCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("TestPoint", js_box2dclasses_b2CircleShape_TestPoint, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetSupportVertex", js_box2dclasses_b2CircleShape_GetSupportVertex, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetSupport", js_box2dclasses_b2CircleShape_GetSupport, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Shape_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2CircleShape_class,
        js_box2dclasses_b2CircleShape_constructor, 0,
        properties,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2CircleShape>(cx, jsb_b2CircleShape_class, proto);
    jsb_b2CircleShape_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2CircleShape", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2EdgeShape_class;
JS::PersistentRootedObject *jsb_b2EdgeShape_prototype;

bool js_box2dclasses_b2EdgeShape_Set(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2EdgeShape* cobj = (b2EdgeShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2EdgeShape_Set : Invalid Native Object");
    if (argc == 2) {
        b2Vec2 arg0;
        b2Vec2 arg1;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        ok &= jsval_to_b2Vec2(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2EdgeShape_Set : Error processing arguments");
        cobj->Set(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2EdgeShape_Set : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2EdgeShape_ComputeMass(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2EdgeShape* cobj = (b2EdgeShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2EdgeShape_ComputeMass : Invalid Native Object");
    if (argc == 2) {
        b2MassData* arg0 = nullptr;
        float arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
		ok = false;
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2EdgeShape_ComputeMass : Error processing arguments");
        cobj->ComputeMass(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2EdgeShape_ComputeMass : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2EdgeShape_Clone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2EdgeShape* cobj = (b2EdgeShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2EdgeShape_Clone : Invalid Native Object");
    if (argc == 1) {
        b2BlockAllocator* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2BlockAllocator*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2EdgeShape_Clone : Error processing arguments");
        b2Shape* ret = cobj->Clone(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Shape>(cx, (b2Shape*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2EdgeShape_Clone : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2EdgeShape_Clone : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2EdgeShape_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2EdgeShape* cobj = (b2EdgeShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2EdgeShape_RayCast : Invalid Native Object");
    if (argc == 4) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        b2Transform arg2;
        int arg3 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2EdgeShape_RayCast : Error processing arguments");
        bool ret = cobj->RayCast(arg0, arg1, arg2, arg3);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2EdgeShape_RayCast : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2EdgeShape_RayCast : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_box2dclasses_b2EdgeShape_ComputeAABB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2EdgeShape* cobj = (b2EdgeShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2EdgeShape_ComputeAABB : Invalid Native Object");
    if (argc == 3) {
        b2AABB* arg0 = nullptr;
        b2Transform arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2AABB*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2EdgeShape_ComputeAABB : Error processing arguments");
        cobj->ComputeAABB(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2EdgeShape_ComputeAABB : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2EdgeShape_GetChildCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2EdgeShape* cobj = (b2EdgeShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2EdgeShape_GetChildCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetChildCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2EdgeShape_GetChildCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2EdgeShape_GetChildCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2EdgeShape_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2EdgeShape* cobj = (b2EdgeShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2EdgeShape_TestPoint : Invalid Native Object");
    if (argc == 2) {
        b2Transform arg0;
        b2Vec2 arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_b2Vec2(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2EdgeShape_TestPoint : Error processing arguments");
        bool ret = cobj->TestPoint(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2EdgeShape_TestPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2EdgeShape_TestPoint : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2EdgeShape_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    b2EdgeShape* cobj = new (std::nothrow) b2EdgeShape();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_b2EdgeShape_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_b2EdgeShape_class, proto, &jsobj, "b2EdgeShape");
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


extern JS::PersistentRootedObject *jsb_b2Shape_prototype;

void js_b2EdgeShape_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (b2EdgeShape)", obj);
    b2EdgeShape *nobj = static_cast<b2EdgeShape *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_box2dclasses_b2EdgeShape(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2EdgeShape_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_b2EdgeShape_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2EdgeShape_class = {
        "EdgeShape",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &b2EdgeShape_classOps
    };
    jsb_b2EdgeShape_class = &b2EdgeShape_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("Set", js_box2dclasses_b2EdgeShape_Set, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ComputeMass", js_box2dclasses_b2EdgeShape_ComputeMass, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Clone", js_box2dclasses_b2EdgeShape_Clone, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("RayCast", js_box2dclasses_b2EdgeShape_RayCast, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ComputeAABB", js_box2dclasses_b2EdgeShape_ComputeAABB, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetChildCount", js_box2dclasses_b2EdgeShape_GetChildCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("TestPoint", js_box2dclasses_b2EdgeShape_TestPoint, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Shape_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2EdgeShape_class,
        js_box2dclasses_b2EdgeShape_constructor, 0,
        properties,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2EdgeShape>(cx, jsb_b2EdgeShape_class, proto);
    jsb_b2EdgeShape_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2EdgeShape", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2ChainShape_class;
JS::PersistentRootedObject *jsb_b2ChainShape_prototype;

bool js_box2dclasses_b2ChainShape_ComputeMass(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_ComputeMass : Invalid Native Object");
    if (argc == 2) {
        b2MassData* arg0 = nullptr;
        float arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
		ok = false;
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_ComputeMass : Error processing arguments");
        cobj->ComputeMass(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_ComputeMass : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2ChainShape_Clear(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_Clear : Invalid Native Object");
    if (argc == 0) {
        cobj->Clear();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_Clear : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2ChainShape_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_TestPoint : Invalid Native Object");
    if (argc == 2) {
        b2Transform arg0;
        b2Vec2 arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_b2Vec2(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_TestPoint : Error processing arguments");
        bool ret = cobj->TestPoint(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_TestPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_TestPoint : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2ChainShape_GetChildEdge(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_GetChildEdge : Invalid Native Object");
    if (argc == 2) {
        b2EdgeShape* arg0 = nullptr;
        int arg1 = 0;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2EdgeShape*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_GetChildEdge : Error processing arguments");
        cobj->GetChildEdge(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_GetChildEdge : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2ChainShape_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_RayCast : Invalid Native Object");
    if (argc == 4) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        b2Transform arg2;
        int arg3 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_RayCast : Error processing arguments");
        bool ret = cobj->RayCast(arg0, arg1, arg2, arg3);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_RayCast : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_RayCast : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_box2dclasses_b2ChainShape_ComputeAABB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_ComputeAABB : Invalid Native Object");
    if (argc == 3) {
        b2AABB* arg0 = nullptr;
        b2Transform arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2AABB*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_ComputeAABB : Error processing arguments");
        cobj->ComputeAABB(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_ComputeAABB : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2ChainShape_GetChildCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_GetChildCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetChildCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_GetChildCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_GetChildCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2ChainShape_SetPrevVertex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_SetPrevVertex : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_SetPrevVertex : Error processing arguments");
        cobj->SetPrevVertex(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_SetPrevVertex : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2ChainShape_SetNextVertex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_SetNextVertex : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_SetNextVertex : Error processing arguments");
        cobj->SetNextVertex(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_SetNextVertex : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2ChainShape_Clone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_Clone : Invalid Native Object");
    if (argc == 1) {
        b2BlockAllocator* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2BlockAllocator*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_Clone : Error processing arguments");
        b2Shape* ret = cobj->Clone(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Shape>(cx, (b2Shape*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_Clone : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_Clone : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2ChainShape_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    b2ChainShape* cobj = new (std::nothrow) b2ChainShape();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_b2ChainShape_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_b2ChainShape_class, proto, &jsobj, "b2ChainShape");
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


extern JS::PersistentRootedObject *jsb_b2Shape_prototype;

void js_b2ChainShape_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (b2ChainShape)", obj);
    b2ChainShape *nobj = static_cast<b2ChainShape *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_box2dclasses_b2ChainShape(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2ChainShape_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_b2ChainShape_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2ChainShape_class = {
        "ChainShape",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &b2ChainShape_classOps
    };
    jsb_b2ChainShape_class = &b2ChainShape_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("ComputeMass", js_box2dclasses_b2ChainShape_ComputeMass, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Clear", js_box2dclasses_b2ChainShape_Clear, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("TestPoint", js_box2dclasses_b2ChainShape_TestPoint, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetChildEdge", js_box2dclasses_b2ChainShape_GetChildEdge, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("RayCast", js_box2dclasses_b2ChainShape_RayCast, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ComputeAABB", js_box2dclasses_b2ChainShape_ComputeAABB, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetChildCount", js_box2dclasses_b2ChainShape_GetChildCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetPrevVertex", js_box2dclasses_b2ChainShape_SetPrevVertex, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetNextVertex", js_box2dclasses_b2ChainShape_SetNextVertex, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Clone", js_box2dclasses_b2ChainShape_Clone, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Shape_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2ChainShape_class,
        js_box2dclasses_b2ChainShape_constructor, 0,
        properties,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2ChainShape>(cx, jsb_b2ChainShape_class, proto);
    jsb_b2ChainShape_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2ChainShape", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2PolygonShape_class;
JS::PersistentRootedObject *jsb_b2PolygonShape_prototype;

bool js_box2dclasses_b2PolygonShape_ComputeMass(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PolygonShape* cobj = (b2PolygonShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_ComputeMass : Invalid Native Object");
    if (argc == 2) {
        b2MassData* arg0 = nullptr;
        float arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
		ok = false;
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_ComputeMass : Error processing arguments");
        cobj->ComputeMass(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PolygonShape_ComputeMass : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2PolygonShape_GetVertex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PolygonShape* cobj = (b2PolygonShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_GetVertex : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_GetVertex : Error processing arguments");
        const b2Vec2& ret = cobj->GetVertex(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_GetVertex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PolygonShape_GetVertex : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PolygonShape_Clone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PolygonShape* cobj = (b2PolygonShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_Clone : Invalid Native Object");
    if (argc == 1) {
        b2BlockAllocator* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2BlockAllocator*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_Clone : Error processing arguments");
        b2Shape* ret = cobj->Clone(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Shape>(cx, (b2Shape*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_Clone : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PolygonShape_Clone : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PolygonShape_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PolygonShape* cobj = (b2PolygonShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_RayCast : Invalid Native Object");
    if (argc == 4) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        b2Transform arg2;
        int arg3 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_int32(cx, args.get(3), (int32_t *)&arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_RayCast : Error processing arguments");
        bool ret = cobj->RayCast(arg0, arg1, arg2, arg3);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_RayCast : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PolygonShape_RayCast : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_box2dclasses_b2PolygonShape_ComputeAABB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PolygonShape* cobj = (b2PolygonShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_ComputeAABB : Invalid Native Object");
    if (argc == 3) {
        b2AABB* arg0 = nullptr;
        b2Transform arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2AABB*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_ComputeAABB : Error processing arguments");
        cobj->ComputeAABB(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PolygonShape_ComputeAABB : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2PolygonShape_GetVertexCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PolygonShape* cobj = (b2PolygonShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_GetVertexCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetVertexCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_GetVertexCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PolygonShape_GetVertexCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PolygonShape_GetChildCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PolygonShape* cobj = (b2PolygonShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_GetChildCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetChildCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_GetChildCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PolygonShape_GetChildCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PolygonShape_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PolygonShape* cobj = (b2PolygonShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_TestPoint : Invalid Native Object");
    if (argc == 2) {
        b2Transform arg0;
        b2Vec2 arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        ok &= jsval_to_b2Vec2(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_TestPoint : Error processing arguments");
        bool ret = cobj->TestPoint(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_TestPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PolygonShape_TestPoint : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2PolygonShape_Validate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PolygonShape* cobj = (b2PolygonShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_Validate : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->Validate();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_Validate : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PolygonShape_Validate : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PolygonShape_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    b2PolygonShape* cobj = new (std::nothrow) b2PolygonShape();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_b2PolygonShape_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_b2PolygonShape_class, proto, &jsobj, "b2PolygonShape");
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


extern JS::PersistentRootedObject *jsb_b2Shape_prototype;

void js_b2PolygonShape_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (b2PolygonShape)", obj);
    b2PolygonShape *nobj = static_cast<b2PolygonShape *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_box2dclasses_b2PolygonShape(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2PolygonShape_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_b2PolygonShape_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2PolygonShape_class = {
        "PolygonShape",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &b2PolygonShape_classOps
    };
    jsb_b2PolygonShape_class = &b2PolygonShape_class;

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("ComputeMass", js_box2dclasses_b2PolygonShape_ComputeMass, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetVertex", js_box2dclasses_b2PolygonShape_GetVertex, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Clone", js_box2dclasses_b2PolygonShape_Clone, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("RayCast", js_box2dclasses_b2PolygonShape_RayCast, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ComputeAABB", js_box2dclasses_b2PolygonShape_ComputeAABB, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetVertexCount", js_box2dclasses_b2PolygonShape_GetVertexCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetChildCount", js_box2dclasses_b2PolygonShape_GetChildCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("TestPoint", js_box2dclasses_b2PolygonShape_TestPoint, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Validate", js_box2dclasses_b2PolygonShape_Validate, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Shape_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2PolygonShape_class,
        js_box2dclasses_b2PolygonShape_constructor, 0,
        properties,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2PolygonShape>(cx, jsb_b2PolygonShape_class, proto);
    jsb_b2PolygonShape_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2PolygonShape", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2Body_class;
JS::PersistentRootedObject *jsb_b2Body_prototype;

bool js_box2dclasses_b2Body_GetAngle(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetAngle : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetAngle();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetAngle : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetAngle : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_IsSleepingAllowed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_IsSleepingAllowed : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsSleepingAllowed();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_IsSleepingAllowed : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_IsSleepingAllowed : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_SetAngularDamping(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetAngularDamping : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetAngularDamping : Error processing arguments");
        cobj->SetAngularDamping(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetAngularDamping : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_SetActive(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetActive : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetActive : Error processing arguments");
        cobj->SetActive(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetActive : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_SetGravityScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetGravityScale : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetGravityScale : Error processing arguments");
        cobj->SetGravityScale(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetGravityScale : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_GetAngularVelocity(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetAngularVelocity : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetAngularVelocity();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetAngularVelocity : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetAngularVelocity : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_GetFixtureList(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Body* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Body *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetFixtureList : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Fixture* ret = cobj->GetFixtureList();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetFixtureList : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Fixture* ret = cobj->GetFixtureList();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetFixtureList : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetFixtureList : arguments error");
    return false;
}
bool js_box2dclasses_b2Body_ApplyForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_ApplyForce : Invalid Native Object");
    if (argc == 3) {
        b2Vec2 arg0;
        b2Vec2 arg1;
        bool arg2;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        ok &= jsval_to_b2Vec2(cx, args.get(1), &arg1);
        ok &= jsval_to_bool(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_ApplyForce : Error processing arguments");
        cobj->ApplyForce(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_ApplyForce : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2Body_GetLocalPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetLocalPoint : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetLocalPoint : Error processing arguments");
        b2Vec2 ret = cobj->GetLocalPoint(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetLocalPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetLocalPoint : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_SetLinearVelocity(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetLinearVelocity : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetLinearVelocity : Error processing arguments");
        cobj->SetLinearVelocity(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetLinearVelocity : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_GetLinearVelocity(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetLinearVelocity : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLinearVelocity();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetLinearVelocity : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetLinearVelocity : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_GetNext(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Body* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Body *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetNext : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Body* ret = cobj->GetNext();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Body>(cx, (b2Body*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetNext : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Body* ret = cobj->GetNext();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Body>(cx, (b2Body*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetNext : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetNext : arguments error");
    return false;
}
bool js_box2dclasses_b2Body_SetSleepingAllowed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetSleepingAllowed : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetSleepingAllowed : Error processing arguments");
        cobj->SetSleepingAllowed(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetSleepingAllowed : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_SetTransform(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetTransform : Invalid Native Object");
    if (argc == 2) {
        b2Vec2 arg0;
        float arg1 = 0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetTransform : Error processing arguments");
        cobj->SetTransform(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetTransform : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2Body_GetMass(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetMass : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMass();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetMass : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetMass : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_SetAngularVelocity(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetAngularVelocity : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetAngularVelocity : Error processing arguments");
        cobj->SetAngularVelocity(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetAngularVelocity : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_GetMassData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetMassData : Invalid Native Object");
    if (argc == 1) {
        b2MassData* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetMassData : Error processing arguments");
        cobj->GetMassData(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetMassData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint : Error processing arguments");
        b2Vec2 ret = cobj->GetLinearVelocityFromWorldPoint(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_ResetMassData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_ResetMassData : Invalid Native Object");
    if (argc == 0) {
        cobj->ResetMassData();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_ResetMassData : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_ApplyForceToCenter(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_ApplyForceToCenter : Invalid Native Object");
    if (argc == 2) {
        b2Vec2 arg0;
        bool arg1;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_ApplyForceToCenter : Error processing arguments");
        cobj->ApplyForceToCenter(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_ApplyForceToCenter : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2Body_ApplyTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_ApplyTorque : Invalid Native Object");
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_ApplyTorque : Error processing arguments");
        cobj->ApplyTorque(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_ApplyTorque : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2Body_IsAwake(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_IsAwake : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsAwake();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_IsAwake : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_IsAwake : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_SetType(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetType : Invalid Native Object");
    if (argc == 1) {
        b2BodyType arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetType : Error processing arguments");
        cobj->SetType(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetType : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_SetMassData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetMassData : Invalid Native Object");
    if (argc == 1) {
        const b2MassData* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetMassData : Error processing arguments");
        cobj->SetMassData(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetMassData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_GetTransform(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetTransform : Invalid Native Object");
    if (argc == 0) {
        const b2Transform& ret = cobj->GetTransform();
        JS::RootedValue jsret(cx);
        #pragma warning NO CONVERSION FROM NATIVE FOR b2Transform;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetTransform : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetTransform : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_GetWorldCenter(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetWorldCenter : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetWorldCenter();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetWorldCenter : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetWorldCenter : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_GetAngularDamping(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetAngularDamping : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetAngularDamping();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetAngularDamping : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetAngularDamping : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_ApplyLinearImpulse(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_ApplyLinearImpulse : Invalid Native Object");
    if (argc == 3) {
        b2Vec2 arg0;
        b2Vec2 arg1;
        bool arg2;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        ok &= jsval_to_b2Vec2(cx, args.get(1), &arg1);
        ok &= jsval_to_bool(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_ApplyLinearImpulse : Error processing arguments");
        cobj->ApplyLinearImpulse(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_ApplyLinearImpulse : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2Body_IsFixedRotation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_IsFixedRotation : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsFixedRotation();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_IsFixedRotation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_IsFixedRotation : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_GetLocalCenter(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetLocalCenter : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalCenter();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetLocalCenter : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetLocalCenter : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_GetWorldVector(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetWorldVector : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetWorldVector : Error processing arguments");
        b2Vec2 ret = cobj->GetWorldVector(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetWorldVector : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetWorldVector : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint : Error processing arguments");
        b2Vec2 ret = cobj->GetLinearVelocityFromLocalPoint(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_GetContactList(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Body* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Body *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetContactList : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2ContactEdge* ret = cobj->GetContactList();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            #pragma warning NO CONVERSION FROM NATIVE FOR b2ContactEdge*;
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetContactList : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2ContactEdge* ret = cobj->GetContactList();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            #pragma warning NO CONVERSION FROM NATIVE FOR b2ContactEdge*;
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetContactList : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetContactList : arguments error");
    return false;
}
bool js_box2dclasses_b2Body_GetWorldPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetWorldPoint : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetWorldPoint : Error processing arguments");
        b2Vec2 ret = cobj->GetWorldPoint(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetWorldPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetWorldPoint : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_SetAwake(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetAwake : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetAwake : Error processing arguments");
        cobj->SetAwake(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetAwake : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_GetLinearDamping(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetLinearDamping : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetLinearDamping();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetLinearDamping : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetLinearDamping : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_IsBullet(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_IsBullet : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsBullet();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_IsBullet : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_IsBullet : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_GetWorld(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Body* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Body *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetWorld : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2World* ret = cobj->GetWorld();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2World>(cx, (b2World*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetWorld : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2World* ret = cobj->GetWorld();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2World>(cx, (b2World*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetWorld : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetWorld : arguments error");
    return false;
}
bool js_box2dclasses_b2Body_GetLocalVector(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetLocalVector : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetLocalVector : Error processing arguments");
        b2Vec2 ret = cobj->GetLocalVector(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetLocalVector : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetLocalVector : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_SetLinearDamping(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetLinearDamping : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetLinearDamping : Error processing arguments");
        cobj->SetLinearDamping(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetLinearDamping : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_SetBullet(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetBullet : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetBullet : Error processing arguments");
        cobj->SetBullet(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetBullet : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_GetType(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetType : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->GetType();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetType : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetType : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_GetGravityScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetGravityScale : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetGravityScale();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetGravityScale : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetGravityScale : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_DestroyFixture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_DestroyFixture : Invalid Native Object");
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
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_DestroyFixture : Error processing arguments");
        cobj->DestroyFixture(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_DestroyFixture : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_GetInertia(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetInertia : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetInertia();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetInertia : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetInertia : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_IsActive(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_IsActive : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsActive();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_IsActive : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_IsActive : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Body_SetFixedRotation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetFixedRotation : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetFixedRotation : Error processing arguments");
        cobj->SetFixedRotation(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetFixedRotation : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Body_ApplyAngularImpulse(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_ApplyAngularImpulse : Invalid Native Object");
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_ApplyAngularImpulse : Error processing arguments");
        cobj->ApplyAngularImpulse(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_ApplyAngularImpulse : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2Body_GetPosition(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetPosition : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetPosition();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_GetPosition : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetPosition : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

void js_register_box2dclasses_b2Body(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2Body_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2Body_class = {
        "Body",
        JSCLASS_HAS_PRIVATE,
        &b2Body_classOps
    };
    jsb_b2Body_class = &b2Body_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("GetAngle", js_box2dclasses_b2Body_GetAngle, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsSleepingAllowed", js_box2dclasses_b2Body_IsSleepingAllowed, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetAngularDamping", js_box2dclasses_b2Body_SetAngularDamping, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetActive", js_box2dclasses_b2Body_SetActive, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetGravityScale", js_box2dclasses_b2Body_SetGravityScale, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAngularVelocity", js_box2dclasses_b2Body_GetAngularVelocity, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetFixtureList", js_box2dclasses_b2Body_GetFixtureList, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ApplyForce", js_box2dclasses_b2Body_ApplyForce, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalPoint", js_box2dclasses_b2Body_GetLocalPoint, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetLinearVelocity", js_box2dclasses_b2Body_SetLinearVelocity, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLinearVelocity", js_box2dclasses_b2Body_GetLinearVelocity, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetNext", js_box2dclasses_b2Body_GetNext, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetSleepingAllowed", js_box2dclasses_b2Body_SetSleepingAllowed, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetTransform", js_box2dclasses_b2Body_SetTransform, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMass", js_box2dclasses_b2Body_GetMass, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetAngularVelocity", js_box2dclasses_b2Body_SetAngularVelocity, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMassData", js_box2dclasses_b2Body_GetMassData, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLinearVelocityFromWorldPoint", js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ResetMassData", js_box2dclasses_b2Body_ResetMassData, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ApplyForceToCenter", js_box2dclasses_b2Body_ApplyForceToCenter, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ApplyTorque", js_box2dclasses_b2Body_ApplyTorque, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsAwake", js_box2dclasses_b2Body_IsAwake, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetType", js_box2dclasses_b2Body_SetType, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetMassData", js_box2dclasses_b2Body_SetMassData, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetTransform", js_box2dclasses_b2Body_GetTransform, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetWorldCenter", js_box2dclasses_b2Body_GetWorldCenter, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAngularDamping", js_box2dclasses_b2Body_GetAngularDamping, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ApplyLinearImpulse", js_box2dclasses_b2Body_ApplyLinearImpulse, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsFixedRotation", js_box2dclasses_b2Body_IsFixedRotation, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalCenter", js_box2dclasses_b2Body_GetLocalCenter, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetWorldVector", js_box2dclasses_b2Body_GetWorldVector, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLinearVelocityFromLocalPoint", js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetContactList", js_box2dclasses_b2Body_GetContactList, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetWorldPoint", js_box2dclasses_b2Body_GetWorldPoint, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetAwake", js_box2dclasses_b2Body_SetAwake, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLinearDamping", js_box2dclasses_b2Body_GetLinearDamping, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsBullet", js_box2dclasses_b2Body_IsBullet, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetWorld", js_box2dclasses_b2Body_GetWorld, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalVector", js_box2dclasses_b2Body_GetLocalVector, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetLinearDamping", js_box2dclasses_b2Body_SetLinearDamping, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2Body_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetBullet", js_box2dclasses_b2Body_SetBullet, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetType", js_box2dclasses_b2Body_GetType, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetGravityScale", js_box2dclasses_b2Body_GetGravityScale, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("DestroyFixture", js_box2dclasses_b2Body_DestroyFixture, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetInertia", js_box2dclasses_b2Body_GetInertia, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsActive", js_box2dclasses_b2Body_IsActive, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetFixedRotation", js_box2dclasses_b2Body_SetFixedRotation, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ApplyAngularImpulse", js_box2dclasses_b2Body_ApplyAngularImpulse, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetPosition", js_box2dclasses_b2Body_GetPosition, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2Body_class,
        dummy_constructor<b2Body>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2Body>(cx, jsb_b2Body_class, proto);
    jsb_b2Body_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2Body", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2Fixture_class;
JS::PersistentRootedObject *jsb_b2Fixture_prototype;

bool js_box2dclasses_b2Fixture_GetRestitution(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_GetRestitution : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetRestitution();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetRestitution : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_GetRestitution : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Fixture_SetFilterData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_SetFilterData : Invalid Native Object");
    if (argc == 1) {
        b2Filter arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Filter
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_SetFilterData : Error processing arguments");
        cobj->SetFilterData(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_SetFilterData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Fixture_SetFriction(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_SetFriction : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_SetFriction : Error processing arguments");
        cobj->SetFriction(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_SetFriction : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Fixture_GetShape(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Fixture* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Fixture *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_GetShape : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Shape* ret = cobj->GetShape();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Shape>(cx, (b2Shape*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetShape : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Shape* ret = cobj->GetShape();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Shape>(cx, (b2Shape*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetShape : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_GetShape : arguments error");
    return false;
}
bool js_box2dclasses_b2Fixture_SetRestitution(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_SetRestitution : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_SetRestitution : Error processing arguments");
        cobj->SetRestitution(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_SetRestitution : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Fixture_GetBody(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Fixture* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Fixture *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_GetBody : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Body* ret = cobj->GetBody();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Body>(cx, (b2Body*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetBody : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Body* ret = cobj->GetBody();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Body>(cx, (b2Body*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetBody : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_GetBody : arguments error");
    return false;
}
bool js_box2dclasses_b2Fixture_GetNext(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Fixture* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Fixture *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_GetNext : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Fixture* ret = cobj->GetNext();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetNext : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Fixture* ret = cobj->GetNext();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetNext : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_GetNext : arguments error");
    return false;
}
bool js_box2dclasses_b2Fixture_GetFriction(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_GetFriction : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetFriction();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetFriction : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_GetFriction : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Fixture_SetDensity(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_SetDensity : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_SetDensity : Error processing arguments");
        cobj->SetDensity(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_SetDensity : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Fixture_GetMassData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_GetMassData : Invalid Native Object");
    if (argc == 1) {
        b2MassData* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetMassData : Error processing arguments");
        cobj->GetMassData(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_GetMassData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Fixture_SetSensor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_SetSensor : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_SetSensor : Error processing arguments");
        cobj->SetSensor(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_SetSensor : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Fixture_GetAABB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_GetAABB : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetAABB : Error processing arguments");
        const b2AABB& ret = cobj->GetAABB(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2AABB_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetAABB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_GetAABB : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Fixture_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_TestPoint : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_TestPoint : Error processing arguments");
        bool ret = cobj->TestPoint(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_TestPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_TestPoint : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Fixture_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_RayCast : Invalid Native Object");
    if (argc == 3) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
		ok = false;
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_RayCast : Error processing arguments");
        bool ret = cobj->RayCast(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_RayCast : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_RayCast : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2Fixture_Refilter(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_Refilter : Invalid Native Object");
    if (argc == 0) {
        cobj->Refilter();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_Refilter : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Fixture_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_Dump : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_Dump : Error processing arguments");
        cobj->Dump(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_Dump : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Fixture_GetFilterData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_GetFilterData : Invalid Native Object");
    if (argc == 0) {
        const b2Filter& ret = cobj->GetFilterData();
        JS::RootedValue jsret(cx);
        #pragma warning NO CONVERSION FROM NATIVE FOR b2Filter;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetFilterData : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_GetFilterData : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Fixture_IsSensor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_IsSensor : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsSensor();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_IsSensor : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_IsSensor : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Fixture_GetType(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_GetType : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->GetType();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetType : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_GetType : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Fixture_GetDensity(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Fixture* cobj = (b2Fixture *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Fixture_GetDensity : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetDensity();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Fixture_GetDensity : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Fixture_GetDensity : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

void js_register_box2dclasses_b2Fixture(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2Fixture_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2Fixture_class = {
        "Fixture",
        JSCLASS_HAS_PRIVATE,
        &b2Fixture_classOps
    };
    jsb_b2Fixture_class = &b2Fixture_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("GetRestitution", js_box2dclasses_b2Fixture_GetRestitution, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetFilterData", js_box2dclasses_b2Fixture_SetFilterData, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetFriction", js_box2dclasses_b2Fixture_SetFriction, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetShape", js_box2dclasses_b2Fixture_GetShape, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetRestitution", js_box2dclasses_b2Fixture_SetRestitution, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetBody", js_box2dclasses_b2Fixture_GetBody, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetNext", js_box2dclasses_b2Fixture_GetNext, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetFriction", js_box2dclasses_b2Fixture_GetFriction, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetDensity", js_box2dclasses_b2Fixture_SetDensity, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMassData", js_box2dclasses_b2Fixture_GetMassData, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetSensor", js_box2dclasses_b2Fixture_SetSensor, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAABB", js_box2dclasses_b2Fixture_GetAABB, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("TestPoint", js_box2dclasses_b2Fixture_TestPoint, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("RayCast", js_box2dclasses_b2Fixture_RayCast, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Refilter", js_box2dclasses_b2Fixture_Refilter, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2Fixture_Dump, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetFilterData", js_box2dclasses_b2Fixture_GetFilterData, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsSensor", js_box2dclasses_b2Fixture_IsSensor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetType", js_box2dclasses_b2Fixture_GetType, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetDensity", js_box2dclasses_b2Fixture_GetDensity, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2Fixture_class,
        dummy_constructor<b2Fixture>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2Fixture>(cx, jsb_b2Fixture_class, proto);
    jsb_b2Fixture_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2Fixture", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2ContactListener_class;
JS::PersistentRootedObject *jsb_b2ContactListener_prototype;

bool js_box2dclasses_b2ContactListener_EndContact(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ContactListener* cobj = (b2ContactListener *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ContactListener_EndContact : Invalid Native Object");
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
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ContactListener_EndContact : Error processing arguments");
        cobj->EndContact(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ContactListener_EndContact : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2ContactListener_PreSolve(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ContactListener* cobj = (b2ContactListener *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ContactListener_PreSolve : Invalid Native Object");
    if (argc == 2) {
        b2Contact* arg0 = nullptr;
        const b2Manifold* arg1 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2Contact*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Manifold*
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ContactListener_PreSolve : Error processing arguments");
        cobj->PreSolve(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ContactListener_PreSolve : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2ContactListener_BeginContact(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ContactListener* cobj = (b2ContactListener *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ContactListener_BeginContact : Invalid Native Object");
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
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ContactListener_BeginContact : Error processing arguments");
        cobj->BeginContact(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ContactListener_BeginContact : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2ContactListener_PostSolve(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ContactListener* cobj = (b2ContactListener *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ContactListener_PostSolve : Invalid Native Object");
    if (argc == 2) {
        b2Contact* arg0 = nullptr;
        const b2ContactImpulse* arg1 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2Contact*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        #pragma warning NO CONVERSION TO NATIVE FOR b2ContactImpulse*
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ContactListener_PostSolve : Error processing arguments");
        cobj->PostSolve(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ContactListener_PostSolve : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

void js_register_box2dclasses_b2ContactListener(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2ContactListener_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2ContactListener_class = {
        "b2ContactListener",
        JSCLASS_HAS_PRIVATE,
        &b2ContactListener_classOps
    };
    jsb_b2ContactListener_class = &b2ContactListener_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("EndContact", js_box2dclasses_b2ContactListener_EndContact, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("PreSolve", js_box2dclasses_b2ContactListener_PreSolve, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("BeginContact", js_box2dclasses_b2ContactListener_BeginContact, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("PostSolve", js_box2dclasses_b2ContactListener_PostSolve, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2ContactListener_class,
        empty_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2ContactListener>(cx, jsb_b2ContactListener_class, proto);
    jsb_b2ContactListener_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2ContactListener", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2QueryCallback_class;
JS::PersistentRootedObject *jsb_b2QueryCallback_prototype;

bool js_box2dclasses_b2QueryCallback_ReportFixture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2QueryCallback* cobj = (b2QueryCallback *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2QueryCallback_ReportFixture : Invalid Native Object");
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
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2QueryCallback_ReportFixture : Error processing arguments");
        bool ret = cobj->ReportFixture(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2QueryCallback_ReportFixture : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2QueryCallback_ReportFixture : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

void js_register_box2dclasses_b2QueryCallback(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2QueryCallback_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2QueryCallback_class = {
        "b2QueryCallback",
        JSCLASS_HAS_PRIVATE,
        &b2QueryCallback_classOps
    };
    jsb_b2QueryCallback_class = &b2QueryCallback_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("ReportFixture", js_box2dclasses_b2QueryCallback_ReportFixture, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2QueryCallback_class,
        empty_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2QueryCallback>(cx, jsb_b2QueryCallback_class, proto);
    jsb_b2QueryCallback_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2QueryCallback", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2RayCastCallback_class;
JS::PersistentRootedObject *jsb_b2RayCastCallback_prototype;

bool js_box2dclasses_b2RayCastCallback_ReportFixture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RayCastCallback* cobj = (b2RayCastCallback *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RayCastCallback_ReportFixture : Invalid Native Object");
    if (argc == 4) {
        b2Fixture* arg0 = nullptr;
        b2Vec2 arg1;
        b2Vec2 arg2;
        float arg3 = 0;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2Fixture*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_b2Vec2(cx, args.get(1), &arg1);
        ok &= jsval_to_b2Vec2(cx, args.get(2), &arg2);
        ok &= jsval_to_float(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RayCastCallback_ReportFixture : Error processing arguments");
        float ret = cobj->ReportFixture(arg0, arg1, arg2, arg3);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RayCastCallback_ReportFixture : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RayCastCallback_ReportFixture : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}

void js_register_box2dclasses_b2RayCastCallback(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2RayCastCallback_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2RayCastCallback_class = {
        "b2RayCastCallback",
        JSCLASS_HAS_PRIVATE,
        &b2RayCastCallback_classOps
    };
    jsb_b2RayCastCallback_class = &b2RayCastCallback_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("ReportFixture", js_box2dclasses_b2RayCastCallback_ReportFixture, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2RayCastCallback_class,
        empty_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2RayCastCallback>(cx, jsb_b2RayCastCallback_class, proto);
    jsb_b2RayCastCallback_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2RayCastCallback", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2World_class;
JS::PersistentRootedObject *jsb_b2World_prototype;

bool js_box2dclasses_b2World_ShiftOrigin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_ShiftOrigin : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_ShiftOrigin : Error processing arguments");
        cobj->ShiftOrigin(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_ShiftOrigin : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_QueryAABB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_QueryAABB : Invalid Native Object");
    if (argc == 2) {
        b2QueryCallback* arg0 = nullptr;
        b2AABB arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2QueryCallback*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_b2AABB(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_QueryAABB : Error processing arguments");
        cobj->QueryAABB(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_QueryAABB : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2World_SetSubStepping(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_SetSubStepping : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_SetSubStepping : Error processing arguments");
        cobj->SetSubStepping(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_SetSubStepping : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_GetTreeQuality(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetTreeQuality : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetTreeQuality();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetTreeQuality : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetTreeQuality : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_GetTreeHeight(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetTreeHeight : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetTreeHeight();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetTreeHeight : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetTreeHeight : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_GetProfile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetProfile : Invalid Native Object");
    if (argc == 0) {
        const b2Profile& ret = cobj->GetProfile();
        JS::RootedValue jsret(cx);
        #pragma warning NO CONVERSION FROM NATIVE FOR b2Profile;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetProfile : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetProfile : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_GetTreeBalance(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetTreeBalance : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetTreeBalance();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetTreeBalance : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetTreeBalance : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_GetSubStepping(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetSubStepping : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->GetSubStepping();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetSubStepping : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetSubStepping : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_SetContactListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_SetContactListener : Invalid Native Object");
    if (argc == 1) {
        b2ContactListener* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2ContactListener*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_SetContactListener : Error processing arguments");
        cobj->SetContactListener(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_SetContactListener : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_DrawDebugData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_DrawDebugData : Invalid Native Object");
    if (argc == 0) {
        cobj->DrawDebugData();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_DrawDebugData : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_SetContinuousPhysics(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_SetContinuousPhysics : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_SetContinuousPhysics : Error processing arguments");
        cobj->SetContinuousPhysics(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_SetContinuousPhysics : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_SetGravity(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_SetGravity : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_SetGravity : Error processing arguments");
        cobj->SetGravity(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_SetGravity : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_GetBodyCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetBodyCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetBodyCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetBodyCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetBodyCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_GetAutoClearForces(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetAutoClearForces : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->GetAutoClearForces();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetAutoClearForces : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetAutoClearForces : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_GetContinuousPhysics(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetContinuousPhysics : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->GetContinuousPhysics();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetContinuousPhysics : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetContinuousPhysics : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_GetJointList(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2World* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2World *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetJointList : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Joint* ret = cobj->GetJointList();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Joint>(cx, (b2Joint*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetJointList : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Joint* ret = cobj->GetJointList();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Joint>(cx, (b2Joint*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetJointList : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetJointList : arguments error");
    return false;
}
bool js_box2dclasses_b2World_GetBodyList(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2World* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2World *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetBodyList : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Body* ret = cobj->GetBodyList();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Body>(cx, (b2Body*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetBodyList : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Body* ret = cobj->GetBodyList();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Body>(cx, (b2Body*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetBodyList : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetBodyList : arguments error");
    return false;
}
bool js_box2dclasses_b2World_SetDestructionListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_SetDestructionListener : Invalid Native Object");
    if (argc == 1) {
        b2DestructionListener* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2DestructionListener*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_SetDestructionListener : Error processing arguments");
        cobj->SetDestructionListener(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_SetDestructionListener : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_DestroyJoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_DestroyJoint : Invalid Native Object");
    if (argc == 1) {
        b2Joint* arg0 = 0;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2Joint*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_DestroyJoint : Error processing arguments");
        cobj->DestroyJoint(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_DestroyJoint : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_GetJointCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetJointCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetJointCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetJointCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetJointCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_Step(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_Step : Invalid Native Object");
    if (argc == 3) {
        float arg0 = 0;
        int arg1 = 0;
        int arg2 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_Step : Error processing arguments");
        cobj->Step(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_Step : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2World_ClearForces(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_ClearForces : Invalid Native Object");
    if (argc == 0) {
        cobj->ClearForces();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_ClearForces : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_GetWarmStarting(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetWarmStarting : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->GetWarmStarting();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetWarmStarting : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetWarmStarting : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_SetAllowSleeping(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_SetAllowSleeping : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_SetAllowSleeping : Error processing arguments");
        cobj->SetAllowSleeping(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_SetAllowSleeping : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_DestroyBody(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_DestroyBody : Invalid Native Object");
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
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_DestroyBody : Error processing arguments");
        cobj->DestroyBody(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_DestroyBody : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_GetAllowSleeping(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetAllowSleeping : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->GetAllowSleeping();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetAllowSleeping : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetAllowSleeping : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_GetProxyCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetProxyCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetProxyCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetProxyCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetProxyCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_RayCast : Invalid Native Object");
    if (argc == 3) {
        b2RayCastCallback* arg0 = nullptr;
        b2Vec2 arg1;
        b2Vec2 arg2;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2RayCastCallback*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_b2Vec2(cx, args.get(1), &arg1);
        ok &= jsval_to_b2Vec2(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_RayCast : Error processing arguments");
        cobj->RayCast(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_RayCast : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2World_IsLocked(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_IsLocked : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsLocked();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_IsLocked : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_IsLocked : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_GetContactList(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2World* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2World *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetContactList : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Contact* ret = cobj->GetContactList();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Contact>(cx, (b2Contact*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetContactList : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Contact* ret = cobj->GetContactList();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Contact>(cx, (b2Contact*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetContactList : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetContactList : arguments error");
    return false;
}
bool js_box2dclasses_b2World_SetDebugDraw(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_SetDebugDraw : Invalid Native Object");
    if (argc == 1) {
        b2Draw* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2Draw*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_SetDebugDraw : Error processing arguments");
        cobj->SetDebugDraw(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_SetDebugDraw : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_SetAutoClearForces(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_SetAutoClearForces : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_SetAutoClearForces : Error processing arguments");
        cobj->SetAutoClearForces(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_SetAutoClearForces : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_GetGravity(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetGravity : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetGravity();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetGravity : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetGravity : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_GetContactCount(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_GetContactCount : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetContactCount();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_GetContactCount : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_GetContactCount : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2World_SetWarmStarting(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_SetWarmStarting : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_SetWarmStarting : Error processing arguments");
        cobj->SetWarmStarting(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_SetWarmStarting : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_SetContactFilter(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_SetContactFilter : Invalid Native Object");
    if (argc == 1) {
        b2ContactFilter* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (b2ContactFilter*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_SetContactFilter : Error processing arguments");
        cobj->SetContactFilter(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_SetContactFilter : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    b2Vec2 arg0;
    ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_constructor : Error processing arguments");
    b2World* cobj = new (std::nothrow) b2World(arg0);

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_b2World_prototype->get());
    jsb_create_weak_jsobject(cx, cobj, jsb_b2World_class, proto, &jsobj, "b2World");
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


void js_b2World_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (b2World)", obj);
    b2World *nobj = static_cast<b2World *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_box2dclasses_b2World(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2World_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_b2World_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2World_class = {
        "World",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &b2World_classOps
    };
    jsb_b2World_class = &b2World_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("ShiftOrigin", js_box2dclasses_b2World_ShiftOrigin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("QueryAABB", js_box2dclasses_b2World_QueryAABB, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetSubStepping", js_box2dclasses_b2World_SetSubStepping, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetTreeQuality", js_box2dclasses_b2World_GetTreeQuality, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetTreeHeight", js_box2dclasses_b2World_GetTreeHeight, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetProfile", js_box2dclasses_b2World_GetProfile, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetTreeBalance", js_box2dclasses_b2World_GetTreeBalance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetSubStepping", js_box2dclasses_b2World_GetSubStepping, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetContactListener", js_box2dclasses_b2World_SetContactListener, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("DrawDebugData", js_box2dclasses_b2World_DrawDebugData, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetContinuousPhysics", js_box2dclasses_b2World_SetContinuousPhysics, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetGravity", js_box2dclasses_b2World_SetGravity, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetBodyCount", js_box2dclasses_b2World_GetBodyCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAutoClearForces", js_box2dclasses_b2World_GetAutoClearForces, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetContinuousPhysics", js_box2dclasses_b2World_GetContinuousPhysics, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetJointList", js_box2dclasses_b2World_GetJointList, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetBodyList", js_box2dclasses_b2World_GetBodyList, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetDestructionListener", js_box2dclasses_b2World_SetDestructionListener, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("DestroyJoint", js_box2dclasses_b2World_DestroyJoint, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetJointCount", js_box2dclasses_b2World_GetJointCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Step", js_box2dclasses_b2World_Step, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ClearForces", js_box2dclasses_b2World_ClearForces, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetWarmStarting", js_box2dclasses_b2World_GetWarmStarting, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetAllowSleeping", js_box2dclasses_b2World_SetAllowSleeping, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("DestroyBody", js_box2dclasses_b2World_DestroyBody, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAllowSleeping", js_box2dclasses_b2World_GetAllowSleeping, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetProxyCount", js_box2dclasses_b2World_GetProxyCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("RayCast", js_box2dclasses_b2World_RayCast, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsLocked", js_box2dclasses_b2World_IsLocked, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetContactList", js_box2dclasses_b2World_GetContactList, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetDebugDraw", js_box2dclasses_b2World_SetDebugDraw, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2World_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetAutoClearForces", js_box2dclasses_b2World_SetAutoClearForces, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetGravity", js_box2dclasses_b2World_GetGravity, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetContactCount", js_box2dclasses_b2World_GetContactCount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetWarmStarting", js_box2dclasses_b2World_SetWarmStarting, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetContactFilter", js_box2dclasses_b2World_SetContactFilter, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2World_class,
        js_box2dclasses_b2World_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2World>(cx, jsb_b2World_class, proto);
    jsb_b2World_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2World", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2Contact_class;
JS::PersistentRootedObject *jsb_b2Contact_prototype;

bool js_box2dclasses_b2Contact_GetNext(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Contact* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Contact *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_GetNext : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Contact* ret = cobj->GetNext();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Contact>(cx, (b2Contact*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetNext : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Contact* ret = cobj->GetNext();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Contact>(cx, (b2Contact*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetNext : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_GetNext : arguments error");
    return false;
}
bool js_box2dclasses_b2Contact_SetEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_SetEnabled : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_SetEnabled : Error processing arguments");
        cobj->SetEnabled(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_SetEnabled : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Contact_GetWorldManifold(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_GetWorldManifold : Invalid Native Object");
    if (argc == 1) {
        b2WorldManifold* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR b2WorldManifold*
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetWorldManifold : Error processing arguments");
        cobj->GetWorldManifold(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_GetWorldManifold : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Contact_GetRestitution(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_GetRestitution : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetRestitution();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetRestitution : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_GetRestitution : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Contact_ResetFriction(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_ResetFriction : Invalid Native Object");
    if (argc == 0) {
        cobj->ResetFriction();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_ResetFriction : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Contact_GetFriction(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_GetFriction : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetFriction();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetFriction : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_GetFriction : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Contact_IsTouching(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_IsTouching : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsTouching();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_IsTouching : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_IsTouching : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Contact_IsEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_IsEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_IsEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_IsEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Contact_GetFixtureB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Contact* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Contact *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_GetFixtureB : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Fixture* ret = cobj->GetFixtureB();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetFixtureB : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Fixture* ret = cobj->GetFixtureB();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetFixtureB : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_GetFixtureB : arguments error");
    return false;
}
bool js_box2dclasses_b2Contact_SetFriction(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_SetFriction : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_SetFriction : Error processing arguments");
        cobj->SetFriction(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_SetFriction : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Contact_GetFixtureA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Contact* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Contact *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_GetFixtureA : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Fixture* ret = cobj->GetFixtureA();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetFixtureA : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Fixture* ret = cobj->GetFixtureA();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetFixtureA : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_GetFixtureA : arguments error");
    return false;
}
bool js_box2dclasses_b2Contact_GetChildIndexA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_GetChildIndexA : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetChildIndexA();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetChildIndexA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_GetChildIndexA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Contact_GetChildIndexB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_GetChildIndexB : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->GetChildIndexB();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetChildIndexB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_GetChildIndexB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Contact_SetTangentSpeed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_SetTangentSpeed : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_SetTangentSpeed : Error processing arguments");
        cobj->SetTangentSpeed(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_SetTangentSpeed : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Contact_GetTangentSpeed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_GetTangentSpeed : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetTangentSpeed();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetTangentSpeed : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_GetTangentSpeed : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Contact_SetRestitution(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_SetRestitution : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_SetRestitution : Error processing arguments");
        cobj->SetRestitution(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_SetRestitution : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Contact_GetManifold(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Contact* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Contact *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_GetManifold : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Manifold* ret = cobj->GetManifold();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            ok &= b2Manifold_to_jsval(cx, ret, &jsret);
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetManifold : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Manifold* ret = cobj->GetManifold();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            ok &= b2Manifold_to_jsval(cx, ret, &jsret);
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_GetManifold : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_GetManifold : arguments error");
    return false;
}
bool js_box2dclasses_b2Contact_Evaluate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_Evaluate : Invalid Native Object");
    if (argc == 3) {
        b2Manifold* arg0 = nullptr;
        b2Transform arg1;
        b2Transform arg2;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Manifold*
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
		ok = false;
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Contact_Evaluate : Error processing arguments");
        cobj->Evaluate(arg0, arg1, arg2);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_Evaluate : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_box2dclasses_b2Contact_ResetRestitution(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Contact* cobj = (b2Contact *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Contact_ResetRestitution : Invalid Native Object");
    if (argc == 0) {
        cobj->ResetRestitution();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Contact_ResetRestitution : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

void js_register_box2dclasses_b2Contact(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2Contact_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2Contact_class = {
        "Contact",
        JSCLASS_HAS_PRIVATE,
        &b2Contact_classOps
    };
    jsb_b2Contact_class = &b2Contact_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("GetNext", js_box2dclasses_b2Contact_GetNext, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetEnabled", js_box2dclasses_b2Contact_SetEnabled, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetWorldManifold", js_box2dclasses_b2Contact_GetWorldManifold, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetRestitution", js_box2dclasses_b2Contact_GetRestitution, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ResetFriction", js_box2dclasses_b2Contact_ResetFriction, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetFriction", js_box2dclasses_b2Contact_GetFriction, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsTouching", js_box2dclasses_b2Contact_IsTouching, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsEnabled", js_box2dclasses_b2Contact_IsEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetFixtureB", js_box2dclasses_b2Contact_GetFixtureB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetFriction", js_box2dclasses_b2Contact_SetFriction, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetFixtureA", js_box2dclasses_b2Contact_GetFixtureA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetChildIndexA", js_box2dclasses_b2Contact_GetChildIndexA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetChildIndexB", js_box2dclasses_b2Contact_GetChildIndexB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetTangentSpeed", js_box2dclasses_b2Contact_SetTangentSpeed, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetTangentSpeed", js_box2dclasses_b2Contact_GetTangentSpeed, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetRestitution", js_box2dclasses_b2Contact_SetRestitution, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetManifold", js_box2dclasses_b2Contact_GetManifold, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Evaluate", js_box2dclasses_b2Contact_Evaluate, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ResetRestitution", js_box2dclasses_b2Contact_ResetRestitution, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2Contact_class,
        dummy_constructor<b2Contact>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2Contact>(cx, jsb_b2Contact_class, proto);
    jsb_b2Contact_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2Contact", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2Joint_class;
JS::PersistentRootedObject *jsb_b2Joint_prototype;

bool js_box2dclasses_b2Joint_GetNext(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    b2Joint* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Joint *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_GetNext : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            const b2Joint* ret = cobj->GetNext();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Joint>(cx, (b2Joint*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetNext : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            b2Joint* ret = cobj->GetNext();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Joint>(cx, (b2Joint*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
            JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetNext : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_GetNext : arguments error");
    return false;
}
bool js_box2dclasses_b2Joint_GetBodyA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Joint* cobj = (b2Joint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_GetBodyA : Invalid Native Object");
    if (argc == 0) {
        b2Body* ret = cobj->GetBodyA();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Body>(cx, (b2Body*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetBodyA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_GetBodyA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Joint_GetBodyB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Joint* cobj = (b2Joint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_GetBodyB : Invalid Native Object");
    if (argc == 0) {
        b2Body* ret = cobj->GetBodyB();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Body>(cx, (b2Body*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetBodyB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_GetBodyB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Joint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Joint* cobj = (b2Joint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Joint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Joint* cobj = (b2Joint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Joint_ShiftOrigin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Joint* cobj = (b2Joint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_ShiftOrigin : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_ShiftOrigin : Error processing arguments");
        cobj->ShiftOrigin(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_ShiftOrigin : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Joint_GetType(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Joint* cobj = (b2Joint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_GetType : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->GetType();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetType : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_GetType : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Joint_GetCollideConnected(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Joint* cobj = (b2Joint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_GetCollideConnected : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->GetCollideConnected();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetCollideConnected : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_GetCollideConnected : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Joint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Joint* cobj = (b2Joint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Joint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Joint* cobj = (b2Joint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Joint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Joint* cobj = (b2Joint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2Joint_IsActive(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Joint* cobj = (b2Joint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Joint_IsActive : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsActive();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Joint_IsActive : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Joint_IsActive : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

void js_register_box2dclasses_b2Joint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2Joint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2Joint_class = {
        "Joint",
        JSCLASS_HAS_PRIVATE,
        &b2Joint_classOps
    };
    jsb_b2Joint_class = &b2Joint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("GetNext", js_box2dclasses_b2Joint_GetNext, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetBodyA", js_box2dclasses_b2Joint_GetBodyA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetBodyB", js_box2dclasses_b2Joint_GetBodyB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2Joint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorA", js_box2dclasses_b2Joint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ShiftOrigin", js_box2dclasses_b2Joint_ShiftOrigin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetType", js_box2dclasses_b2Joint_GetType, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetCollideConnected", js_box2dclasses_b2Joint_GetCollideConnected, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2Joint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2Joint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2Joint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsActive", js_box2dclasses_b2Joint_IsActive, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2Joint_class,
        dummy_constructor<b2Joint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2Joint>(cx, jsb_b2Joint_class, proto);
    jsb_b2Joint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2Joint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2DistanceJoint_class;
JS::PersistentRootedObject *jsb_b2DistanceJoint_prototype;

bool js_box2dclasses_b2DistanceJoint_SetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_SetDampingRatio : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_SetDampingRatio : Error processing arguments");
        cobj->SetDampingRatio(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_SetDampingRatio : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_SetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_SetFrequency : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_SetFrequency : Error processing arguments");
        cobj->SetFrequency(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_SetFrequency : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_GetLength(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_GetLength : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetLength();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_GetLength : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_GetLength : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_GetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_GetDampingRatio : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetDampingRatio();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_GetDampingRatio : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_GetDampingRatio : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_GetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_GetFrequency : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetFrequency();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_GetFrequency : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_GetFrequency : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_GetLocalAnchorA : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_GetLocalAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_GetLocalAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_GetLocalAnchorB : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_GetLocalAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_GetLocalAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2DistanceJoint_SetLength(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2DistanceJoint* cobj = (b2DistanceJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2DistanceJoint_SetLength : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2DistanceJoint_SetLength : Error processing arguments");
        cobj->SetLength(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2DistanceJoint_SetLength : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

void js_register_box2dclasses_b2DistanceJoint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2DistanceJoint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2DistanceJoint_class = {
        "b2DistanceJoint",
        JSCLASS_HAS_PRIVATE,
        &b2DistanceJoint_classOps
    };
    jsb_b2DistanceJoint_class = &b2DistanceJoint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("SetDampingRatio", js_box2dclasses_b2DistanceJoint_SetDampingRatio, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorA", js_box2dclasses_b2DistanceJoint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2DistanceJoint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2DistanceJoint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetFrequency", js_box2dclasses_b2DistanceJoint_SetFrequency, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLength", js_box2dclasses_b2DistanceJoint_GetLength, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetDampingRatio", js_box2dclasses_b2DistanceJoint_GetDampingRatio, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetFrequency", js_box2dclasses_b2DistanceJoint_GetFrequency, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorA", js_box2dclasses_b2DistanceJoint_GetLocalAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorB", js_box2dclasses_b2DistanceJoint_GetLocalAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2DistanceJoint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2DistanceJoint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetLength", js_box2dclasses_b2DistanceJoint_SetLength, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Joint_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2DistanceJoint_class,
        dummy_constructor<b2DistanceJoint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2DistanceJoint>(cx, jsb_b2DistanceJoint_class, proto);
    jsb_b2DistanceJoint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2DistanceJoint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2FrictionJoint_class;
JS::PersistentRootedObject *jsb_b2FrictionJoint_prototype;

bool js_box2dclasses_b2FrictionJoint_SetMaxTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2FrictionJoint* cobj = (b2FrictionJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2FrictionJoint_SetMaxTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_SetMaxTorque : Error processing arguments");
        cobj->SetMaxTorque(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2FrictionJoint_SetMaxTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2FrictionJoint_GetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2FrictionJoint* cobj = (b2FrictionJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2FrictionJoint_GetMaxForce : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMaxForce();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_GetMaxForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2FrictionJoint_GetMaxForce : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2FrictionJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2FrictionJoint* cobj = (b2FrictionJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2FrictionJoint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2FrictionJoint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2FrictionJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2FrictionJoint* cobj = (b2FrictionJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2FrictionJoint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2FrictionJoint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2FrictionJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2FrictionJoint* cobj = (b2FrictionJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2FrictionJoint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2FrictionJoint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2FrictionJoint_SetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2FrictionJoint* cobj = (b2FrictionJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2FrictionJoint_SetMaxForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_SetMaxForce : Error processing arguments");
        cobj->SetMaxForce(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2FrictionJoint_SetMaxForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2FrictionJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2FrictionJoint* cobj = (b2FrictionJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2FrictionJoint_GetLocalAnchorA : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_GetLocalAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2FrictionJoint_GetLocalAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2FrictionJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2FrictionJoint* cobj = (b2FrictionJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2FrictionJoint_GetLocalAnchorB : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_GetLocalAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2FrictionJoint_GetLocalAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2FrictionJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2FrictionJoint* cobj = (b2FrictionJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2FrictionJoint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2FrictionJoint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2FrictionJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2FrictionJoint* cobj = (b2FrictionJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2FrictionJoint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2FrictionJoint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2FrictionJoint_GetMaxTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2FrictionJoint* cobj = (b2FrictionJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2FrictionJoint_GetMaxTorque : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMaxTorque();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2FrictionJoint_GetMaxTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2FrictionJoint_GetMaxTorque : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

void js_register_box2dclasses_b2FrictionJoint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2FrictionJoint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2FrictionJoint_class = {
        "b2FrictionJoint",
        JSCLASS_HAS_PRIVATE,
        &b2FrictionJoint_classOps
    };
    jsb_b2FrictionJoint_class = &b2FrictionJoint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("SetMaxTorque", js_box2dclasses_b2FrictionJoint_SetMaxTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMaxForce", js_box2dclasses_b2FrictionJoint_GetMaxForce, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorA", js_box2dclasses_b2FrictionJoint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2FrictionJoint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2FrictionJoint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetMaxForce", js_box2dclasses_b2FrictionJoint_SetMaxForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorA", js_box2dclasses_b2FrictionJoint_GetLocalAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorB", js_box2dclasses_b2FrictionJoint_GetLocalAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2FrictionJoint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2FrictionJoint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMaxTorque", js_box2dclasses_b2FrictionJoint_GetMaxTorque, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Joint_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2FrictionJoint_class,
        dummy_constructor<b2FrictionJoint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2FrictionJoint>(cx, jsb_b2FrictionJoint_class, proto);
    jsb_b2FrictionJoint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2FrictionJoint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2GearJoint_class;
JS::PersistentRootedObject *jsb_b2GearJoint_prototype;

bool js_box2dclasses_b2GearJoint_GetJoint1(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2GearJoint* cobj = (b2GearJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2GearJoint_GetJoint1 : Invalid Native Object");
    if (argc == 0) {
        b2Joint* ret = cobj->GetJoint1();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Joint>(cx, (b2Joint*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2GearJoint_GetJoint1 : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2GearJoint_GetJoint1 : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2GearJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2GearJoint* cobj = (b2GearJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2GearJoint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2GearJoint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2GearJoint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2GearJoint_GetJoint2(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2GearJoint* cobj = (b2GearJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2GearJoint_GetJoint2 : Invalid Native Object");
    if (argc == 0) {
        b2Joint* ret = cobj->GetJoint2();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<b2Joint>(cx, (b2Joint*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2GearJoint_GetJoint2 : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2GearJoint_GetJoint2 : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2GearJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2GearJoint* cobj = (b2GearJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2GearJoint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2GearJoint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2GearJoint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2GearJoint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2GearJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2GearJoint* cobj = (b2GearJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2GearJoint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2GearJoint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2GearJoint_SetRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2GearJoint* cobj = (b2GearJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2GearJoint_SetRatio : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2GearJoint_SetRatio : Error processing arguments");
        cobj->SetRatio(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2GearJoint_SetRatio : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2GearJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2GearJoint* cobj = (b2GearJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2GearJoint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2GearJoint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2GearJoint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2GearJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2GearJoint* cobj = (b2GearJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2GearJoint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2GearJoint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2GearJoint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2GearJoint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2GearJoint_GetRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2GearJoint* cobj = (b2GearJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2GearJoint_GetRatio : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetRatio();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2GearJoint_GetRatio : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2GearJoint_GetRatio : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

void js_register_box2dclasses_b2GearJoint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2GearJoint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2GearJoint_class = {
        "b2GearJoint",
        JSCLASS_HAS_PRIVATE,
        &b2GearJoint_classOps
    };
    jsb_b2GearJoint_class = &b2GearJoint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("GetJoint1", js_box2dclasses_b2GearJoint_GetJoint1, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorA", js_box2dclasses_b2GearJoint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetJoint2", js_box2dclasses_b2GearJoint_GetJoint2, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2GearJoint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2GearJoint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetRatio", js_box2dclasses_b2GearJoint_SetRatio, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2GearJoint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2GearJoint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetRatio", js_box2dclasses_b2GearJoint_GetRatio, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Joint_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2GearJoint_class,
        dummy_constructor<b2GearJoint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2GearJoint>(cx, jsb_b2GearJoint_class, proto);
    jsb_b2GearJoint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2GearJoint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2MotorJoint_class;
JS::PersistentRootedObject *jsb_b2MotorJoint_prototype;

bool js_box2dclasses_b2MotorJoint_SetMaxTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_SetMaxTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_SetMaxTorque : Error processing arguments");
        cobj->SetMaxTorque(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_SetMaxTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MotorJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MotorJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MotorJoint_GetCorrectionFactor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_GetCorrectionFactor : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetCorrectionFactor();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_GetCorrectionFactor : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_GetCorrectionFactor : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MotorJoint_SetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_SetMaxForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_SetMaxForce : Error processing arguments");
        cobj->SetMaxForce(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_SetMaxForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MotorJoint_SetLinearOffset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_SetLinearOffset : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_SetLinearOffset : Error processing arguments");
        cobj->SetLinearOffset(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_SetLinearOffset : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MotorJoint_GetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_GetMaxForce : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMaxForce();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_GetMaxForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_GetMaxForce : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MotorJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MotorJoint_SetAngularOffset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_SetAngularOffset : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_SetAngularOffset : Error processing arguments");
        cobj->SetAngularOffset(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_SetAngularOffset : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MotorJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MotorJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MotorJoint_GetAngularOffset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_GetAngularOffset : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetAngularOffset();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_GetAngularOffset : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_GetAngularOffset : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MotorJoint_GetLinearOffset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_GetLinearOffset : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLinearOffset();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_GetLinearOffset : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_GetLinearOffset : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MotorJoint_GetMaxTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_GetMaxTorque : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMaxTorque();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_GetMaxTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_GetMaxTorque : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MotorJoint_SetCorrectionFactor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MotorJoint* cobj = (b2MotorJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MotorJoint_SetCorrectionFactor : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MotorJoint_SetCorrectionFactor : Error processing arguments");
        cobj->SetCorrectionFactor(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MotorJoint_SetCorrectionFactor : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

void js_register_box2dclasses_b2MotorJoint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2MotorJoint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2MotorJoint_class = {
        "b2MotorJoint",
        JSCLASS_HAS_PRIVATE,
        &b2MotorJoint_classOps
    };
    jsb_b2MotorJoint_class = &b2MotorJoint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("SetMaxTorque", js_box2dclasses_b2MotorJoint_SetMaxTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorA", js_box2dclasses_b2MotorJoint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2MotorJoint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetCorrectionFactor", js_box2dclasses_b2MotorJoint_GetCorrectionFactor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetMaxForce", js_box2dclasses_b2MotorJoint_SetMaxForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetLinearOffset", js_box2dclasses_b2MotorJoint_SetLinearOffset, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMaxForce", js_box2dclasses_b2MotorJoint_GetMaxForce, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2MotorJoint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetAngularOffset", js_box2dclasses_b2MotorJoint_SetAngularOffset, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2MotorJoint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2MotorJoint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAngularOffset", js_box2dclasses_b2MotorJoint_GetAngularOffset, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLinearOffset", js_box2dclasses_b2MotorJoint_GetLinearOffset, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMaxTorque", js_box2dclasses_b2MotorJoint_GetMaxTorque, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetCorrectionFactor", js_box2dclasses_b2MotorJoint_SetCorrectionFactor, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Joint_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2MotorJoint_class,
        dummy_constructor<b2MotorJoint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2MotorJoint>(cx, jsb_b2MotorJoint_class, proto);
    jsb_b2MotorJoint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2MotorJoint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2MouseJoint_class;
JS::PersistentRootedObject *jsb_b2MouseJoint_prototype;

bool js_box2dclasses_b2MouseJoint_SetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_SetDampingRatio : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_SetDampingRatio : Error processing arguments");
        cobj->SetDampingRatio(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_SetDampingRatio : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MouseJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MouseJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MouseJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MouseJoint_SetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_SetFrequency : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_SetFrequency : Error processing arguments");
        cobj->SetFrequency(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_SetFrequency : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MouseJoint_GetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_GetDampingRatio : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetDampingRatio();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_GetDampingRatio : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_GetDampingRatio : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MouseJoint_SetTarget(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_SetTarget : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_SetTarget : Error processing arguments");
        cobj->SetTarget(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_SetTarget : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MouseJoint_SetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_SetMaxForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_SetMaxForce : Error processing arguments");
        cobj->SetMaxForce(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_SetMaxForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MouseJoint_GetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_GetFrequency : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetFrequency();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_GetFrequency : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_GetFrequency : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MouseJoint_GetTarget(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_GetTarget : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetTarget();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_GetTarget : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_GetTarget : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MouseJoint_GetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_GetMaxForce : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMaxForce();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_GetMaxForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_GetMaxForce : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MouseJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2MouseJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2MouseJoint_ShiftOrigin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2MouseJoint* cobj = (b2MouseJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2MouseJoint_ShiftOrigin : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2MouseJoint_ShiftOrigin : Error processing arguments");
        cobj->ShiftOrigin(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2MouseJoint_ShiftOrigin : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

void js_register_box2dclasses_b2MouseJoint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2MouseJoint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2MouseJoint_class = {
        "b2MouseJoint",
        JSCLASS_HAS_PRIVATE,
        &b2MouseJoint_classOps
    };
    jsb_b2MouseJoint_class = &b2MouseJoint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("SetDampingRatio", js_box2dclasses_b2MouseJoint_SetDampingRatio, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorA", js_box2dclasses_b2MouseJoint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2MouseJoint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2MouseJoint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetFrequency", js_box2dclasses_b2MouseJoint_SetFrequency, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetDampingRatio", js_box2dclasses_b2MouseJoint_GetDampingRatio, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetTarget", js_box2dclasses_b2MouseJoint_SetTarget, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetMaxForce", js_box2dclasses_b2MouseJoint_SetMaxForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetFrequency", js_box2dclasses_b2MouseJoint_GetFrequency, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetTarget", js_box2dclasses_b2MouseJoint_GetTarget, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMaxForce", js_box2dclasses_b2MouseJoint_GetMaxForce, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2MouseJoint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2MouseJoint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ShiftOrigin", js_box2dclasses_b2MouseJoint_ShiftOrigin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Joint_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2MouseJoint_class,
        dummy_constructor<b2MouseJoint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2MouseJoint>(cx, jsb_b2MouseJoint_class, proto);
    jsb_b2MouseJoint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2MouseJoint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2PrismaticJoint_class;
JS::PersistentRootedObject *jsb_b2PrismaticJoint_prototype;

bool js_box2dclasses_b2PrismaticJoint_GetLocalAxisA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAxisA : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAxisA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAxisA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetLocalAxisA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetLowerLimit(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetLowerLimit : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetLowerLimit();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetLowerLimit : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetLowerLimit : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAnchorA : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetLocalAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_SetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_SetMotorSpeed : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_SetMotorSpeed : Error processing arguments");
        cobj->SetMotorSpeed(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_SetMotorSpeed : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAnchorB : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetLocalAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetMotorSpeed : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMotorSpeed();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetMotorSpeed : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetMotorSpeed : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_SetMaxMotorForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_SetMaxMotorForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_SetMaxMotorForce : Error processing arguments");
        cobj->SetMaxMotorForce(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_SetMaxMotorForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_EnableLimit(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_EnableLimit : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_EnableLimit : Error processing arguments");
        cobj->EnableLimit(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_EnableLimit : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_IsMotorEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_IsMotorEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsMotorEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_IsMotorEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_IsMotorEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetMaxMotorForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetMaxMotorForce : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMaxMotorForce();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetMaxMotorForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetMaxMotorForce : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetJointSpeed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetJointSpeed : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetJointSpeed();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetJointSpeed : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetJointSpeed : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_EnableMotor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_EnableMotor : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_EnableMotor : Error processing arguments");
        cobj->EnableMotor(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_EnableMotor : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetReferenceAngle(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetReferenceAngle : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetReferenceAngle();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetReferenceAngle : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetReferenceAngle : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetMotorForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetMotorForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetMotorForce : Error processing arguments");
        float ret = cobj->GetMotorForce(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetMotorForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetMotorForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetJointTranslation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetJointTranslation : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetJointTranslation();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetJointTranslation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetJointTranslation : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_IsLimitEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_IsLimitEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsLimitEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_IsLimitEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_IsLimitEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_SetLimits(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_SetLimits : Invalid Native Object");
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_SetLimits : Error processing arguments");
        cobj->SetLimits(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_SetLimits : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetUpperLimit(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetUpperLimit : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetUpperLimit();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetUpperLimit : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetUpperLimit : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PrismaticJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PrismaticJoint* cobj = (b2PrismaticJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PrismaticJoint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PrismaticJoint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PrismaticJoint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

void js_register_box2dclasses_b2PrismaticJoint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2PrismaticJoint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2PrismaticJoint_class = {
        "b2PrismaticJoint",
        JSCLASS_HAS_PRIVATE,
        &b2PrismaticJoint_classOps
    };
    jsb_b2PrismaticJoint_class = &b2PrismaticJoint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("GetLocalAxisA", js_box2dclasses_b2PrismaticJoint_GetLocalAxisA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLowerLimit", js_box2dclasses_b2PrismaticJoint_GetLowerLimit, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorA", js_box2dclasses_b2PrismaticJoint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorA", js_box2dclasses_b2PrismaticJoint_GetLocalAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetMotorSpeed", js_box2dclasses_b2PrismaticJoint_SetMotorSpeed, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorB", js_box2dclasses_b2PrismaticJoint_GetLocalAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMotorSpeed", js_box2dclasses_b2PrismaticJoint_GetMotorSpeed, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetMaxMotorForce", js_box2dclasses_b2PrismaticJoint_SetMaxMotorForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("EnableLimit", js_box2dclasses_b2PrismaticJoint_EnableLimit, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsMotorEnabled", js_box2dclasses_b2PrismaticJoint_IsMotorEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2PrismaticJoint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMaxMotorForce", js_box2dclasses_b2PrismaticJoint_GetMaxMotorForce, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetJointSpeed", js_box2dclasses_b2PrismaticJoint_GetJointSpeed, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("EnableMotor", js_box2dclasses_b2PrismaticJoint_EnableMotor, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReferenceAngle", js_box2dclasses_b2PrismaticJoint_GetReferenceAngle, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2PrismaticJoint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMotorForce", js_box2dclasses_b2PrismaticJoint_GetMotorForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetJointTranslation", js_box2dclasses_b2PrismaticJoint_GetJointTranslation, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsLimitEnabled", js_box2dclasses_b2PrismaticJoint_IsLimitEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2PrismaticJoint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetLimits", js_box2dclasses_b2PrismaticJoint_SetLimits, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetUpperLimit", js_box2dclasses_b2PrismaticJoint_GetUpperLimit, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2PrismaticJoint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Joint_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2PrismaticJoint_class,
        dummy_constructor<b2PrismaticJoint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2PrismaticJoint>(cx, jsb_b2PrismaticJoint_class, proto);
    jsb_b2PrismaticJoint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2PrismaticJoint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2PulleyJoint_class;
JS::PersistentRootedObject *jsb_b2PulleyJoint_prototype;

bool js_box2dclasses_b2PulleyJoint_GetCurrentLengthA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_GetCurrentLengthA : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetCurrentLengthA();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetCurrentLengthA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_GetCurrentLengthA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_GetGroundAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_GetGroundAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetGroundAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetGroundAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_GetGroundAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_GetGroundAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_GetGroundAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetGroundAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetGroundAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_GetGroundAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_GetLengthB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_GetLengthB : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetLengthB();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetLengthB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_GetLengthB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_GetLengthA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_GetLengthA : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetLengthA();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetLengthA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_GetLengthA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_GetCurrentLengthB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_GetCurrentLengthB : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetCurrentLengthB();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetCurrentLengthB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_GetCurrentLengthB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_ShiftOrigin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_ShiftOrigin : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_ShiftOrigin : Error processing arguments");
        cobj->ShiftOrigin(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_ShiftOrigin : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2PulleyJoint_GetRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PulleyJoint* cobj = (b2PulleyJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PulleyJoint_GetRatio : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetRatio();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PulleyJoint_GetRatio : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PulleyJoint_GetRatio : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

void js_register_box2dclasses_b2PulleyJoint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2PulleyJoint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2PulleyJoint_class = {
        "b2PulleyJoint",
        JSCLASS_HAS_PRIVATE,
        &b2PulleyJoint_classOps
    };
    jsb_b2PulleyJoint_class = &b2PulleyJoint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("GetCurrentLengthA", js_box2dclasses_b2PulleyJoint_GetCurrentLengthA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorA", js_box2dclasses_b2PulleyJoint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetGroundAnchorB", js_box2dclasses_b2PulleyJoint_GetGroundAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2PulleyJoint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2PulleyJoint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetGroundAnchorA", js_box2dclasses_b2PulleyJoint_GetGroundAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLengthB", js_box2dclasses_b2PulleyJoint_GetLengthB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLengthA", js_box2dclasses_b2PulleyJoint_GetLengthA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetCurrentLengthB", js_box2dclasses_b2PulleyJoint_GetCurrentLengthB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2PulleyJoint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2PulleyJoint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ShiftOrigin", js_box2dclasses_b2PulleyJoint_ShiftOrigin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetRatio", js_box2dclasses_b2PulleyJoint_GetRatio, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Joint_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2PulleyJoint_class,
        dummy_constructor<b2PulleyJoint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2PulleyJoint>(cx, jsb_b2PulleyJoint_class, proto);
    jsb_b2PulleyJoint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2PulleyJoint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2RevoluteJoint_class;
JS::PersistentRootedObject *jsb_b2RevoluteJoint_prototype;

bool js_box2dclasses_b2RevoluteJoint_GetLowerLimit(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetLowerLimit : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetLowerLimit();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetLowerLimit : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetLowerLimit : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetLocalAnchorA : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetLocalAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetLocalAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_SetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_SetMotorSpeed : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_SetMotorSpeed : Error processing arguments");
        cobj->SetMotorSpeed(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_SetMotorSpeed : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetLocalAnchorB : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetLocalAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetLocalAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetJointAngle(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetJointAngle : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetJointAngle();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetJointAngle : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetJointAngle : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetMotorSpeed : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMotorSpeed();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetMotorSpeed : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetMotorSpeed : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetMotorTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetMotorTorque : Error processing arguments");
        float ret = cobj->GetMotorTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetMotorTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetMotorTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_IsLimitEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_IsLimitEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsLimitEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_IsLimitEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_IsLimitEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_EnableLimit(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_EnableLimit : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_EnableLimit : Error processing arguments");
        cobj->EnableLimit(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_EnableLimit : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_IsMotorEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_IsMotorEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsMotorEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_IsMotorEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_IsMotorEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_SetMaxMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_SetMaxMotorTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_SetMaxMotorTorque : Error processing arguments");
        cobj->SetMaxMotorTorque(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_SetMaxMotorTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetJointSpeed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetJointSpeed : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetJointSpeed();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetJointSpeed : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetJointSpeed : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_EnableMotor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_EnableMotor : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_EnableMotor : Error processing arguments");
        cobj->EnableMotor(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_EnableMotor : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetReferenceAngle(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetReferenceAngle : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetReferenceAngle();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetReferenceAngle : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetReferenceAngle : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_SetLimits(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_SetLimits : Invalid Native Object");
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_SetLimits : Error processing arguments");
        cobj->SetLimits(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_SetLimits : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetMaxMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetMaxMotorTorque : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMaxMotorTorque();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetMaxMotorTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetMaxMotorTorque : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetUpperLimit(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetUpperLimit : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetUpperLimit();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetUpperLimit : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetUpperLimit : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RevoluteJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RevoluteJoint* cobj = (b2RevoluteJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RevoluteJoint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RevoluteJoint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RevoluteJoint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

void js_register_box2dclasses_b2RevoluteJoint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2RevoluteJoint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2RevoluteJoint_class = {
        "b2RevoluteJoint",
        JSCLASS_HAS_PRIVATE,
        &b2RevoluteJoint_classOps
    };
    jsb_b2RevoluteJoint_class = &b2RevoluteJoint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("GetLowerLimit", js_box2dclasses_b2RevoluteJoint_GetLowerLimit, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorA", js_box2dclasses_b2RevoluteJoint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorA", js_box2dclasses_b2RevoluteJoint_GetLocalAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetMotorSpeed", js_box2dclasses_b2RevoluteJoint_SetMotorSpeed, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorB", js_box2dclasses_b2RevoluteJoint_GetLocalAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetJointAngle", js_box2dclasses_b2RevoluteJoint_GetJointAngle, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMotorSpeed", js_box2dclasses_b2RevoluteJoint_GetMotorSpeed, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMotorTorque", js_box2dclasses_b2RevoluteJoint_GetMotorTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsLimitEnabled", js_box2dclasses_b2RevoluteJoint_IsLimitEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("EnableLimit", js_box2dclasses_b2RevoluteJoint_EnableLimit, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("IsMotorEnabled", js_box2dclasses_b2RevoluteJoint_IsMotorEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2RevoluteJoint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetMaxMotorTorque", js_box2dclasses_b2RevoluteJoint_SetMaxMotorTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetJointSpeed", js_box2dclasses_b2RevoluteJoint_GetJointSpeed, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("EnableMotor", js_box2dclasses_b2RevoluteJoint_EnableMotor, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReferenceAngle", js_box2dclasses_b2RevoluteJoint_GetReferenceAngle, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2RevoluteJoint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetLimits", js_box2dclasses_b2RevoluteJoint_SetLimits, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMaxMotorTorque", js_box2dclasses_b2RevoluteJoint_GetMaxMotorTorque, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2RevoluteJoint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetUpperLimit", js_box2dclasses_b2RevoluteJoint_GetUpperLimit, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2RevoluteJoint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Joint_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2RevoluteJoint_class,
        dummy_constructor<b2RevoluteJoint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2RevoluteJoint>(cx, jsb_b2RevoluteJoint_class, proto);
    jsb_b2RevoluteJoint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2RevoluteJoint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2RopeJoint_class;
JS::PersistentRootedObject *jsb_b2RopeJoint_prototype;

bool js_box2dclasses_b2RopeJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RopeJoint* cobj = (b2RopeJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RopeJoint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RopeJoint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RopeJoint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RopeJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RopeJoint* cobj = (b2RopeJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RopeJoint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RopeJoint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RopeJoint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RopeJoint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2RopeJoint_GetMaxLength(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RopeJoint* cobj = (b2RopeJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RopeJoint_GetMaxLength : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMaxLength();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RopeJoint_GetMaxLength : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RopeJoint_GetMaxLength : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RopeJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RopeJoint* cobj = (b2RopeJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RopeJoint_GetLocalAnchorA : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RopeJoint_GetLocalAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RopeJoint_GetLocalAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RopeJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RopeJoint* cobj = (b2RopeJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RopeJoint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RopeJoint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RopeJoint_SetMaxLength(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RopeJoint* cobj = (b2RopeJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RopeJoint_SetMaxLength : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RopeJoint_SetMaxLength : Error processing arguments");
        cobj->SetMaxLength(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RopeJoint_SetMaxLength : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2RopeJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RopeJoint* cobj = (b2RopeJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RopeJoint_GetLocalAnchorB : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RopeJoint_GetLocalAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RopeJoint_GetLocalAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RopeJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RopeJoint* cobj = (b2RopeJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RopeJoint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RopeJoint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RopeJoint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2RopeJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RopeJoint* cobj = (b2RopeJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RopeJoint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RopeJoint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RopeJoint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RopeJoint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2RopeJoint_GetLimitState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2RopeJoint* cobj = (b2RopeJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2RopeJoint_GetLimitState : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->GetLimitState();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2RopeJoint_GetLimitState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2RopeJoint_GetLimitState : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

void js_register_box2dclasses_b2RopeJoint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2RopeJoint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2RopeJoint_class = {
        "b2RopeJoint",
        JSCLASS_HAS_PRIVATE,
        &b2RopeJoint_classOps
    };
    jsb_b2RopeJoint_class = &b2RopeJoint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("GetAnchorA", js_box2dclasses_b2RopeJoint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2RopeJoint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMaxLength", js_box2dclasses_b2RopeJoint_GetMaxLength, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorA", js_box2dclasses_b2RopeJoint_GetLocalAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2RopeJoint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetMaxLength", js_box2dclasses_b2RopeJoint_SetMaxLength, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorB", js_box2dclasses_b2RopeJoint_GetLocalAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2RopeJoint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2RopeJoint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLimitState", js_box2dclasses_b2RopeJoint_GetLimitState, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Joint_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2RopeJoint_class,
        dummy_constructor<b2RopeJoint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2RopeJoint>(cx, jsb_b2RopeJoint_class, proto);
    jsb_b2RopeJoint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2RopeJoint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2WeldJoint_class;
JS::PersistentRootedObject *jsb_b2WeldJoint_prototype;

bool js_box2dclasses_b2WeldJoint_SetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_SetDampingRatio : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_SetDampingRatio : Error processing arguments");
        cobj->SetDampingRatio(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_SetDampingRatio : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2WeldJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WeldJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2WeldJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WeldJoint_SetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_SetFrequency : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_SetFrequency : Error processing arguments");
        cobj->SetFrequency(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_SetFrequency : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2WeldJoint_GetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_GetDampingRatio : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetDampingRatio();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_GetDampingRatio : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_GetDampingRatio : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WeldJoint_GetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_GetFrequency : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetFrequency();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_GetFrequency : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_GetFrequency : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WeldJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_GetLocalAnchorA : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_GetLocalAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_GetLocalAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WeldJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_GetLocalAnchorB : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_GetLocalAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_GetLocalAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WeldJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WeldJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2WeldJoint_GetReferenceAngle(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WeldJoint* cobj = (b2WeldJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WeldJoint_GetReferenceAngle : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetReferenceAngle();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WeldJoint_GetReferenceAngle : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WeldJoint_GetReferenceAngle : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

void js_register_box2dclasses_b2WeldJoint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2WeldJoint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2WeldJoint_class = {
        "b2WeldJoint",
        JSCLASS_HAS_PRIVATE,
        &b2WeldJoint_classOps
    };
    jsb_b2WeldJoint_class = &b2WeldJoint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("SetDampingRatio", js_box2dclasses_b2WeldJoint_SetDampingRatio, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorA", js_box2dclasses_b2WeldJoint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2WeldJoint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2WeldJoint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetFrequency", js_box2dclasses_b2WeldJoint_SetFrequency, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetDampingRatio", js_box2dclasses_b2WeldJoint_GetDampingRatio, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetFrequency", js_box2dclasses_b2WeldJoint_GetFrequency, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorA", js_box2dclasses_b2WeldJoint_GetLocalAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorB", js_box2dclasses_b2WeldJoint_GetLocalAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2WeldJoint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2WeldJoint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReferenceAngle", js_box2dclasses_b2WeldJoint_GetReferenceAngle, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Joint_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2WeldJoint_class,
        dummy_constructor<b2WeldJoint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2WeldJoint>(cx, jsb_b2WeldJoint_class, proto);
    jsb_b2WeldJoint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2WeldJoint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

JSClass  *jsb_b2WheelJoint_class;
JS::PersistentRootedObject *jsb_b2WheelJoint_prototype;

bool js_box2dclasses_b2WheelJoint_IsMotorEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_IsMotorEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->IsMotorEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_IsMotorEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_IsMotorEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetMotorSpeed : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMotorSpeed();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetMotorSpeed : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetMotorSpeed : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetAnchorA : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetReactionTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetReactionTorque : Error processing arguments");
        float ret = cobj->GetReactionTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetReactionTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetReactionTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2WheelJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_Dump : Invalid Native Object");
    if (argc == 0) {
        cobj->Dump();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_Dump : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_SetSpringDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_SetSpringDampingRatio : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_SetSpringDampingRatio : Error processing arguments");
        cobj->SetSpringDampingRatio(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_SetSpringDampingRatio : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetSpringFrequencyHz(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetSpringFrequencyHz : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetSpringFrequencyHz();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetSpringFrequencyHz : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetSpringFrequencyHz : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetJointTranslation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetJointTranslation : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetJointTranslation();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetJointTranslation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetJointTranslation : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetSpringDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetSpringDampingRatio : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetSpringDampingRatio();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetSpringDampingRatio : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetSpringDampingRatio : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetLocalAxisA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetLocalAxisA : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAxisA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetLocalAxisA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetLocalAxisA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_SetSpringFrequencyHz(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_SetSpringFrequencyHz : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_SetSpringFrequencyHz : Error processing arguments");
        cobj->SetSpringFrequencyHz(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_SetSpringFrequencyHz : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetLocalAnchorA : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorA();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetLocalAnchorA : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetLocalAnchorA : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_SetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_SetMotorSpeed : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_SetMotorSpeed : Error processing arguments");
        cobj->SetMotorSpeed(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_SetMotorSpeed : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetLocalAnchorB : Invalid Native Object");
    if (argc == 0) {
        const b2Vec2& ret = cobj->GetLocalAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetLocalAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetLocalAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_SetMaxMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_SetMaxMotorTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_SetMaxMotorTorque : Error processing arguments");
        cobj->SetMaxMotorTorque(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_SetMaxMotorTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetAnchorB : Invalid Native Object");
    if (argc == 0) {
        b2Vec2 ret = cobj->GetAnchorB();
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetAnchorB : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetAnchorB : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetReactionForce : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetReactionForce : Error processing arguments");
        b2Vec2 ret = cobj->GetReactionForce(arg0);
        JS::RootedValue jsret(cx);
        ok &= b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetReactionForce : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetReactionForce : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetMotorTorque : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetMotorTorque : Error processing arguments");
        float ret = cobj->GetMotorTorque(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetMotorTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetMotorTorque : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetJointSpeed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetJointSpeed : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetJointSpeed();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetJointSpeed : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetJointSpeed : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_GetMaxMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_GetMaxMotorTorque : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->GetMaxMotorTorque();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_GetMaxMotorTorque : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_GetMaxMotorTorque : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2WheelJoint_EnableMotor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2WheelJoint* cobj = (b2WheelJoint *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2WheelJoint_EnableMotor : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2WheelJoint_EnableMotor : Error processing arguments");
        cobj->EnableMotor(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2WheelJoint_EnableMotor : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

void js_register_box2dclasses_b2WheelJoint(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps b2WheelJoint_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass b2WheelJoint_class = {
        "b2WheelJoint",
        JSCLASS_HAS_PRIVATE,
        &b2WheelJoint_classOps
    };
    jsb_b2WheelJoint_class = &b2WheelJoint_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("IsMotorEnabled", js_box2dclasses_b2WheelJoint_IsMotorEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMotorSpeed", js_box2dclasses_b2WheelJoint_GetMotorSpeed, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorA", js_box2dclasses_b2WheelJoint_GetAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionTorque", js_box2dclasses_b2WheelJoint_GetReactionTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("Dump", js_box2dclasses_b2WheelJoint_Dump, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetSpringDampingRatio", js_box2dclasses_b2WheelJoint_SetSpringDampingRatio, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetSpringFrequencyHz", js_box2dclasses_b2WheelJoint_GetSpringFrequencyHz, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetJointTranslation", js_box2dclasses_b2WheelJoint_GetJointTranslation, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetSpringDampingRatio", js_box2dclasses_b2WheelJoint_GetSpringDampingRatio, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAxisA", js_box2dclasses_b2WheelJoint_GetLocalAxisA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetSpringFrequencyHz", js_box2dclasses_b2WheelJoint_SetSpringFrequencyHz, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorA", js_box2dclasses_b2WheelJoint_GetLocalAnchorA, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetMotorSpeed", js_box2dclasses_b2WheelJoint_SetMotorSpeed, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetLocalAnchorB", js_box2dclasses_b2WheelJoint_GetLocalAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("SetMaxMotorTorque", js_box2dclasses_b2WheelJoint_SetMaxMotorTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetAnchorB", js_box2dclasses_b2WheelJoint_GetAnchorB, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetReactionForce", js_box2dclasses_b2WheelJoint_GetReactionForce, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMotorTorque", js_box2dclasses_b2WheelJoint_GetMotorTorque, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetJointSpeed", js_box2dclasses_b2WheelJoint_GetJointSpeed, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("GetMaxMotorTorque", js_box2dclasses_b2WheelJoint_GetMaxMotorTorque, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("EnableMotor", js_box2dclasses_b2WheelJoint_EnableMotor, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_b2Joint_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_b2WheelJoint_class,
        dummy_constructor<b2WheelJoint>, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<b2WheelJoint>(cx, jsb_b2WheelJoint_class, proto);
    jsb_b2WheelJoint_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "b2WheelJoint", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "b2", &ns);

    js_register_box2dclasses_b2Joint(cx, ns);
    js_register_box2dclasses_b2DistanceJoint(cx, ns);
    js_register_box2dclasses_b2Fixture(cx, ns);
    js_register_box2dclasses_b2MouseJoint(cx, ns);
    js_register_box2dclasses_b2MotorJoint(cx, ns);
    js_register_box2dclasses_b2PulleyJoint(cx, ns);
    js_register_box2dclasses_b2World(cx, ns);
    js_register_box2dclasses_b2PrismaticJoint(cx, ns);
    js_register_box2dclasses_b2Shape(cx, ns);
    js_register_box2dclasses_b2CircleShape(cx, ns);
    js_register_box2dclasses_b2WheelJoint(cx, ns);
    js_register_box2dclasses_b2Draw(cx, ns);
    js_register_box2dclasses_b2GearJoint(cx, ns);
    js_register_box2dclasses_b2RayCastCallback(cx, ns);
    js_register_box2dclasses_b2WeldJoint(cx, ns);
    js_register_box2dclasses_b2RevoluteJoint(cx, ns);
    js_register_box2dclasses_b2ContactListener(cx, ns);
    js_register_box2dclasses_b2ChainShape(cx, ns);
    js_register_box2dclasses_b2QueryCallback(cx, ns);
    js_register_box2dclasses_b2RopeJoint(cx, ns);
    js_register_box2dclasses_b2PolygonShape(cx, ns);
    js_register_box2dclasses_b2EdgeShape(cx, ns);
    js_register_box2dclasses_b2Contact(cx, ns);
    js_register_box2dclasses_b2Body(cx, ns);
    js_register_box2dclasses_b2FrictionJoint(cx, ns);
}

