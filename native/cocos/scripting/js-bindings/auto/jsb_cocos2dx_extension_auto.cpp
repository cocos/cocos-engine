#include "scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "extensions/cocos-ext.h"

JSClass  *jsb_cocos2d_extension_EventAssetsManagerEx_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_EventAssetsManagerEx_prototype;

bool js_cocos2dx_extension_EventAssetsManagerEx_getAssetsManagerEx(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getAssetsManagerEx : Invalid Native Object");
    if (argc == 0) {
        cocos2d::extension::AssetsManagerEx* ret = cobj->getAssetsManagerEx();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::extension::AssetsManagerEx>(cx, (cocos2d::extension::AssetsManagerEx*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getAssetsManagerEx : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getAssetsManagerEx : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedFiles(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedFiles : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getDownloadedFiles();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedFiles : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedFiles : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_getTotalFiles(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getTotalFiles : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getTotalFiles();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getTotalFiles : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getTotalFiles : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_getAssetId(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getAssetId : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getAssetId();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getAssetId : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getAssetId : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_getTotalBytes(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getTotalBytes : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getTotalBytes();
        JS::RootedValue jsret(cx);
        jsret = JS::DoubleValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getTotalBytes : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getTotalBytes : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_getCURLECode(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getCURLECode : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getCURLECode();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getCURLECode : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getCURLECode : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_getMessage(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getMessage : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getMessage();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getMessage : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getMessage : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_getCURLMCode(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getCURLMCode : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getCURLMCode();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getCURLMCode : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getCURLMCode : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedBytes(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedBytes : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getDownloadedBytes();
        JS::RootedValue jsret(cx);
        jsret = JS::DoubleValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedBytes : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedBytes : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_getPercentByFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getPercentByFile : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getPercentByFile();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getPercentByFile : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getPercentByFile : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_getEventCode(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getEventCode : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getEventCode();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getEventCode : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getEventCode : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_getPercent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getPercent : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getPercent();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_getPercent : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_getPercent : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_isResuming(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_isResuming : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isResuming();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_isResuming : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventAssetsManagerEx_isResuming : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_EventAssetsManagerEx_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    std::string arg0;
    cocos2d::extension::AssetsManagerEx* arg1 = nullptr;
    cocos2d::extension::EventAssetsManagerEx::EventCode arg2;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    do {
            if (args.get(1).isNull()) { arg1 = nullptr; break; }
            if (!args.get(1).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg1 = (cocos2d::extension::AssetsManagerEx*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
        } while (0);
    ok &= jsval_to_int32(cx, args.get(2), (int32_t *)&arg2);
    JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventAssetsManagerEx_constructor : Error processing arguments");
    cocos2d::extension::EventAssetsManagerEx* cobj = new (std::nothrow) cocos2d::extension::EventAssetsManagerEx(arg0, arg1, arg2);

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_EventAssetsManagerEx_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_EventAssetsManagerEx_class, proto, &jsobj, "cocos2d::extension::EventAssetsManagerEx");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}


extern JS::PersistentRootedObject *jsb_cocos2d_EventCustom_prototype;

void js_register_cocos2dx_extension_EventAssetsManagerEx(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_EventAssetsManagerEx_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_EventAssetsManagerEx_class = {
        "EventAssetsManager",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_EventAssetsManagerEx_classOps
    };
    jsb_cocos2d_extension_EventAssetsManagerEx_class = &cocos2d_extension_EventAssetsManagerEx_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getAssetsManagerEx", js_cocos2dx_extension_EventAssetsManagerEx_getAssetsManagerEx, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDownloadedFiles", js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedFiles, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTotalFiles", js_cocos2dx_extension_EventAssetsManagerEx_getTotalFiles, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getAssetId", js_cocos2dx_extension_EventAssetsManagerEx_getAssetId, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTotalBytes", js_cocos2dx_extension_EventAssetsManagerEx_getTotalBytes, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCURLECode", js_cocos2dx_extension_EventAssetsManagerEx_getCURLECode, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMessage", js_cocos2dx_extension_EventAssetsManagerEx_getMessage, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCURLMCode", js_cocos2dx_extension_EventAssetsManagerEx_getCURLMCode, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDownloadedBytes", js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedBytes, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getPercentByFile", js_cocos2dx_extension_EventAssetsManagerEx_getPercentByFile, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getEventCode", js_cocos2dx_extension_EventAssetsManagerEx_getEventCode, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getPercent", js_cocos2dx_extension_EventAssetsManagerEx_getPercent, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isResuming", js_cocos2dx_extension_EventAssetsManagerEx_isResuming, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_EventCustom_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_EventAssetsManagerEx_class,
        js_cocos2dx_extension_EventAssetsManagerEx_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::EventAssetsManagerEx>(cx, jsb_cocos2d_extension_EventAssetsManagerEx_class, proto);
    jsb_cocos2d_extension_EventAssetsManagerEx_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "EventAssetsManagerEx", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_cocos2d_extension_Manifest_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_Manifest_prototype;

bool js_cocos2dx_extension_Manifest_getManifestRoot(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_getManifestRoot : Invalid Native Object");
    if (argc == 0) {
        const std::string& ret = cobj->getManifestRoot();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_getManifestRoot : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_getManifestRoot : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Manifest_setUpdating(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_setUpdating : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_setUpdating : Error processing arguments");
        cobj->setUpdating(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_setUpdating : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_Manifest_getManifestFileUrl(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_getManifestFileUrl : Invalid Native Object");
    if (argc == 0) {
        const std::string& ret = cobj->getManifestFileUrl();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_getManifestFileUrl : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_getManifestFileUrl : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Manifest_isVersionLoaded(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_isVersionLoaded : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isVersionLoaded();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_isVersionLoaded : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_isVersionLoaded : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Manifest_parseFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_parseFile : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_parseFile : Error processing arguments");
        cobj->parseFile(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_parseFile : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_Manifest_isLoaded(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_isLoaded : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isLoaded();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_isLoaded : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_isLoaded : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Manifest_getPackageUrl(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_getPackageUrl : Invalid Native Object");
    if (argc == 0) {
        const std::string& ret = cobj->getPackageUrl();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_getPackageUrl : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_getPackageUrl : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Manifest_isUpdating(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_isUpdating : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isUpdating();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_isUpdating : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_isUpdating : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Manifest_getVersion(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_getVersion : Invalid Native Object");
    if (argc == 0) {
        const std::string& ret = cobj->getVersion();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_getVersion : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_getVersion : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Manifest_parseJSONString(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_parseJSONString : Invalid Native Object");
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_parseJSONString : Error processing arguments");
        cobj->parseJSONString(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_parseJSONString : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_Manifest_getVersionFileUrl(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_getVersionFileUrl : Invalid Native Object");
    if (argc == 0) {
        const std::string& ret = cobj->getVersionFileUrl();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_getVersionFileUrl : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_getVersionFileUrl : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Manifest_getSearchPaths(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Manifest_getSearchPaths : Invalid Native Object");
    if (argc == 0) {
        std::vector<std::string> ret = cobj->getSearchPaths();
        JS::RootedValue jsret(cx);
        ok &= std_vector_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Manifest_getSearchPaths : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_getSearchPaths : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Manifest_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    cocos2d::extension::Manifest* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    do {
        ok = true;
        if (argc == 2) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) cocos2d::extension::Manifest(arg0, arg1);

            JS::RootedObject proto(cx, jsb_cocos2d_extension_Manifest_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_cocos2d_extension_Manifest_class, proto);
            jsb_ref_init(cx, obj, cobj, "cocos2d::extension::Manifest");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            cobj = new (std::nothrow) cocos2d::extension::Manifest();

            JS::RootedObject proto(cx, jsb_cocos2d_extension_Manifest_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_cocos2d_extension_Manifest_class, proto);
            jsb_ref_init(cx, obj, cobj, "cocos2d::extension::Manifest");
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) cocos2d::extension::Manifest(arg0);

            JS::RootedObject proto(cx, jsb_cocos2d_extension_Manifest_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_cocos2d_extension_Manifest_class, proto);
            jsb_ref_init(cx, obj, cobj, "cocos2d::extension::Manifest");
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
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Manifest_constructor : arguments error");
    return false;
}


void js_register_cocos2dx_extension_Manifest(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_Manifest_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_Manifest_class = {
        "Manifest",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_Manifest_classOps
    };
    jsb_cocos2d_extension_Manifest_class = &cocos2d_extension_Manifest_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getManifestRoot", js_cocos2dx_extension_Manifest_getManifestRoot, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setUpdating", js_cocos2dx_extension_Manifest_setUpdating, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getManifestFileUrl", js_cocos2dx_extension_Manifest_getManifestFileUrl, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isVersionLoaded", js_cocos2dx_extension_Manifest_isVersionLoaded, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("parseFile", js_cocos2dx_extension_Manifest_parseFile, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isLoaded", js_cocos2dx_extension_Manifest_isLoaded, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getPackageUrl", js_cocos2dx_extension_Manifest_getPackageUrl, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isUpdating", js_cocos2dx_extension_Manifest_isUpdating, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getVersion", js_cocos2dx_extension_Manifest_getVersion, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("parseJSONString", js_cocos2dx_extension_Manifest_parseJSONString, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getVersionFileUrl", js_cocos2dx_extension_Manifest_getVersionFileUrl, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSearchPaths", js_cocos2dx_extension_Manifest_getSearchPaths, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_Manifest_class,
        js_cocos2dx_extension_Manifest_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::Manifest>(cx, jsb_cocos2d_extension_Manifest_class, proto);
    jsb_cocos2d_extension_Manifest_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "Manifest", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_cocos2d_extension_AssetsManagerEx_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_AssetsManagerEx_prototype;

bool js_cocos2dx_extension_AssetsManagerEx_getDownloadedFiles(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getDownloadedFiles : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getDownloadedFiles();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getDownloadedFiles : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_getDownloadedFiles : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_getState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getState : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getState();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_getState : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_getMaxConcurrentTask(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getMaxConcurrentTask : Invalid Native Object");
    if (argc == 0) {
        const int ret = cobj->getMaxConcurrentTask();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getMaxConcurrentTask : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_getMaxConcurrentTask : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_getTotalFiles(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getTotalFiles : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getTotalFiles();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getTotalFiles : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_getTotalFiles : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::Manifest* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::extension::Manifest*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest : Error processing arguments");
        bool ret = cobj->loadRemoteManifest(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_checkUpdate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_checkUpdate : Invalid Native Object");
    if (argc == 0) {
        cobj->checkUpdate();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_checkUpdate : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_getTotalBytes(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getTotalBytes : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getTotalBytes();
        JS::RootedValue jsret(cx);
        jsret = JS::DoubleValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getTotalBytes : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_getTotalBytes : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_setVerifyCallback(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_setVerifyCallback : Invalid Native Object");
    if (argc == 1) {
        std::function<bool (const std::basic_string<char> &, cocos2d::extension::ManifestAsset)> arg0;
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
		        auto lambda = [=](const std::basic_string<char> & larg0, cocos2d::extension::ManifestAsset larg1) -> bool {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            ok &= std_string_to_jsval(cx, larg0, &largv);
		            valArr.append(largv);
		            ok &= asset_to_jsval(cx, larg1, &largv);
		            valArr.append(largv);
		            JSB_PRECONDITION2(ok, cx, false, "lambda function : Error parsing arguments");
		            JS::RootedValue rval(cx);
		            JS::HandleValueArray largsv(valArr);
		            bool succeed = func->invoke(largsv, &rval);
		            if (!succeed && JS_IsExceptionPending(cx)) {
		                handlePendingException(cx);
		            }
		            bool ret;
		            ok &= jsval_to_bool(cx, rval, &ret);
		            JSB_PRECONDITION2(ok, cx, false, "lambda function : Error processing return value with type bool");
		            return ret;
		        };
		        arg0 = lambda;
		    }
		    else
		    {
		        arg0 = nullptr;
		    }
		} while(0)
		;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_setVerifyCallback : Error processing arguments");
        cobj->setVerifyCallback(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_setVerifyCallback : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_getStoragePath(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getStoragePath : Invalid Native Object");
    if (argc == 0) {
        const std::string& ret = cobj->getStoragePath();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getStoragePath : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_getStoragePath : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_update(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_update : Invalid Native Object");
    if (argc == 0) {
        cobj->update();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_update : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_setVersionCompareHandle(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_setVersionCompareHandle : Invalid Native Object");
    if (argc == 1) {
        std::function<int (const std::basic_string<char> &, const std::basic_string<char> &)> arg0;
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
		        auto lambda = [=](const std::basic_string<char> & larg0, const std::basic_string<char> & larg1) -> int {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            ok &= std_string_to_jsval(cx, larg0, &largv);
		            valArr.append(largv);
		            ok &= std_string_to_jsval(cx, larg1, &largv);
		            valArr.append(largv);
		            JSB_PRECONDITION2(ok, cx, false, "lambda function : Error parsing arguments");
		            JS::RootedValue rval(cx);
		            JS::HandleValueArray largsv(valArr);
		            bool succeed = func->invoke(largsv, &rval);
		            if (!succeed && JS_IsExceptionPending(cx)) {
		                handlePendingException(cx);
		            }
		            int ret;
		            ok &= jsval_to_int32(cx, rval, (int32_t *)&ret);
		            JSB_PRECONDITION2(ok, cx, false, "lambda function : Error processing return value with type int");
		            return ret;
		        };
		        arg0 = lambda;
		    }
		    else
		    {
		        arg0 = nullptr;
		    }
		} while(0)
		;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_setVersionCompareHandle : Error processing arguments");
        cobj->setVersionCompareHandle(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_setVersionCompareHandle : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_setMaxConcurrentTask(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_setMaxConcurrentTask : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_setMaxConcurrentTask : Error processing arguments");
        cobj->setMaxConcurrentTask(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_setMaxConcurrentTask : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_getDownloadedBytes(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getDownloadedBytes : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getDownloadedBytes();
        JS::RootedValue jsret(cx);
        jsret = JS::DoubleValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getDownloadedBytes : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_getDownloadedBytes : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_getLocalManifest(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getLocalManifest : Invalid Native Object");
    if (argc == 0) {
        const cocos2d::extension::Manifest* ret = cobj->getLocalManifest();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::extension::Manifest>(cx, (cocos2d::extension::Manifest*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getLocalManifest : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_getLocalManifest : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    cocos2d::extension::AssetsManagerEx* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest : Invalid Native Object");
    do {
        ok = true;
        if (argc == 1) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->loadLocalManifest(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            cocos2d::extension::Manifest* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::extension::Manifest*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            bool ret = cobj->loadLocalManifest(arg0, arg1);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest : arguments error");
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_getRemoteManifest(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getRemoteManifest : Invalid Native Object");
    if (argc == 0) {
        const cocos2d::extension::Manifest* ret = cobj->getRemoteManifest();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::extension::Manifest>(cx, (cocos2d::extension::Manifest*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_getRemoteManifest : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_getRemoteManifest : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_prepareUpdate(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_prepareUpdate : Invalid Native Object");
    if (argc == 0) {
        cobj->prepareUpdate();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_prepareUpdate : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_downloadFailedAssets(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_downloadFailedAssets : Invalid Native Object");
    if (argc == 0) {
        cobj->downloadFailedAssets();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_downloadFailedAssets : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_isResuming(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_AssetsManagerEx_isResuming : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isResuming();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_isResuming : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_isResuming : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_AssetsManagerEx_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_AssetsManagerEx_create : Error processing arguments");

        auto ret = cocos2d::extension::AssetsManagerEx::create(arg0, arg1);
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_extension_AssetsManagerEx_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_cocos2d_extension_AssetsManagerEx_class, proto, &jsret, "cocos2d::extension::AssetsManagerEx");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_extension_AssetsManagerEx_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    cocos2d::extension::AssetsManagerEx* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    do {
        ok = true;
        if (argc == 3) {
            std::string arg0;
            ok &= jsval_to_std_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            std::function<int (const std::basic_string<char> &, const std::basic_string<char> &)> arg2;
            do {
			    if(JS_TypeOfValue(cx, args.get(2)) == JSTYPE_FUNCTION)
			    {
			        JS::RootedObject jstarget(cx);
			        if (args.thisv().isObject())
			        {
			            jstarget = args.thisv().toObjectOrNull();
			        }
			        JS::RootedObject jsfunc(cx, args.get(2).toObjectOrNull());
			        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
			        auto lambda = [=](const std::basic_string<char> & larg0, const std::basic_string<char> & larg1) -> int {
			            bool ok = true;
			            JS::AutoValueVector valArr(cx);
			            JS::RootedValue largv(cx);
			            ok &= std_string_to_jsval(cx, larg0, &largv);
			            valArr.append(largv);
			            ok &= std_string_to_jsval(cx, larg1, &largv);
			            valArr.append(largv);
			            JSB_PRECONDITION2(ok, cx, false, "lambda function : Error parsing arguments");
			            JS::RootedValue rval(cx);
			            JS::HandleValueArray largsv(valArr);
			            bool succeed = func->invoke(largsv, &rval);
			            if (!succeed && JS_IsExceptionPending(cx)) {
			                handlePendingException(cx);
			            }
			            int ret;
			            ok &= jsval_to_int32(cx, rval, (int32_t *)&ret);
			            JSB_PRECONDITION2(ok, cx, false, "lambda function : Error processing return value with type int");
			            return ret;
			        };
			        arg2 = lambda;
			    }
			    else
			    {
			        arg2 = nullptr;
			    }
			} while(0)
			;
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) cocos2d::extension::AssetsManagerEx(arg0, arg1, arg2);

            JS::RootedObject proto(cx, jsb_cocos2d_extension_AssetsManagerEx_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_cocos2d_extension_AssetsManagerEx_class, proto);
            jsb_ref_init(cx, obj, cobj, "cocos2d::extension::AssetsManagerEx");
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
            cobj = new (std::nothrow) cocos2d::extension::AssetsManagerEx(arg0, arg1);

            JS::RootedObject proto(cx, jsb_cocos2d_extension_AssetsManagerEx_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_cocos2d_extension_AssetsManagerEx_class, proto);
            jsb_ref_init(cx, obj, cobj, "cocos2d::extension::AssetsManagerEx");
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
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_AssetsManagerEx_constructor : arguments error");
    return false;
}


void js_register_cocos2dx_extension_AssetsManagerEx(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_AssetsManagerEx_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_AssetsManagerEx_class = {
        "AssetsManager",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_AssetsManagerEx_classOps
    };
    jsb_cocos2d_extension_AssetsManagerEx_class = &cocos2d_extension_AssetsManagerEx_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getDownloadedFiles", js_cocos2dx_extension_AssetsManagerEx_getDownloadedFiles, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getState", js_cocos2dx_extension_AssetsManagerEx_getState, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMaxConcurrentTask", js_cocos2dx_extension_AssetsManagerEx_getMaxConcurrentTask, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTotalFiles", js_cocos2dx_extension_AssetsManagerEx_getTotalFiles, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("loadRemoteManifest", js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("checkUpdate", js_cocos2dx_extension_AssetsManagerEx_checkUpdate, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTotalBytes", js_cocos2dx_extension_AssetsManagerEx_getTotalBytes, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setVerifyCallback", js_cocos2dx_extension_AssetsManagerEx_setVerifyCallback, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getStoragePath", js_cocos2dx_extension_AssetsManagerEx_getStoragePath, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("update", js_cocos2dx_extension_AssetsManagerEx_update, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setVersionCompareHandle", js_cocos2dx_extension_AssetsManagerEx_setVersionCompareHandle, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMaxConcurrentTask", js_cocos2dx_extension_AssetsManagerEx_setMaxConcurrentTask, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDownloadedBytes", js_cocos2dx_extension_AssetsManagerEx_getDownloadedBytes, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getLocalManifest", js_cocos2dx_extension_AssetsManagerEx_getLocalManifest, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("loadLocalManifest", js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getRemoteManifest", js_cocos2dx_extension_AssetsManagerEx_getRemoteManifest, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("prepareUpdate", js_cocos2dx_extension_AssetsManagerEx_prepareUpdate, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("downloadFailedAssets", js_cocos2dx_extension_AssetsManagerEx_downloadFailedAssets, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isResuming", js_cocos2dx_extension_AssetsManagerEx_isResuming, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_AssetsManagerEx_create, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_AssetsManagerEx_class,
        js_cocos2dx_extension_AssetsManagerEx_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::AssetsManagerEx>(cx, jsb_cocos2d_extension_AssetsManagerEx_class, proto);
    jsb_cocos2d_extension_AssetsManagerEx_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "AssetsManagerEx", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_cocos2d_extension_EventListenerAssetsManagerEx_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_EventListenerAssetsManagerEx_prototype;

bool js_cocos2dx_extension_EventListenerAssetsManagerEx_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::EventListenerAssetsManagerEx* cobj = new (std::nothrow) cocos2d::extension::EventListenerAssetsManagerEx();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_EventListenerAssetsManagerEx_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_EventListenerAssetsManagerEx_class, proto, &jsobj, "cocos2d::extension::EventListenerAssetsManagerEx");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}


extern JS::PersistentRootedObject *jsb_cocos2d_EventListenerCustom_prototype;

void js_register_cocos2dx_extension_EventListenerAssetsManagerEx(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_EventListenerAssetsManagerEx_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_EventListenerAssetsManagerEx_class = {
        "EventListenerAssetsManager",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_EventListenerAssetsManagerEx_classOps
    };
    jsb_cocos2d_extension_EventListenerAssetsManagerEx_class = &cocos2d_extension_EventListenerAssetsManagerEx_class;

    JS::RootedObject parent_proto(cx, jsb_cocos2d_EventListenerCustom_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_EventListenerAssetsManagerEx_class,
        js_cocos2dx_extension_EventListenerAssetsManagerEx_constructor, 0,
        nullptr,
        nullptr,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::EventListenerAssetsManagerEx>(cx, jsb_cocos2d_extension_EventListenerAssetsManagerEx_class, proto);
    jsb_cocos2d_extension_EventListenerAssetsManagerEx_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "EventListenerAssetsManagerEx", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_cocos2d_extension_Control_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_Control_prototype;

bool js_cocos2dx_extension_Control_setEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_setEnabled : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_setEnabled : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_Control_getState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_getState : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getState();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_getState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_getState : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Control_sendActionsForControlEvents(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_sendActionsForControlEvents : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::Control::EventType arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_sendActionsForControlEvents : Error processing arguments");
        cobj->sendActionsForControlEvents(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_sendActionsForControlEvents : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_Control_setSelected(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_setSelected : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_setSelected : Error processing arguments");
        cobj->setSelected(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_setSelected : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_Control_isEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_isEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_isEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_isEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Control_needsLayout(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_needsLayout : Invalid Native Object");
    if (argc == 0) {
        cobj->needsLayout();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_needsLayout : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Control_hasVisibleParents(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_hasVisibleParents : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->hasVisibleParents();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_hasVisibleParents : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_hasVisibleParents : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Control_isSelected(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_isSelected : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isSelected();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_isSelected : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_isSelected : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Control_isTouchInside(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_isTouchInside : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Touch* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Touch*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_isTouchInside : Error processing arguments");
        bool ret = cobj->isTouchInside(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_isTouchInside : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_isTouchInside : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_Control_setHighlighted(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_setHighlighted : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_setHighlighted : Error processing arguments");
        cobj->setHighlighted(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_setHighlighted : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_Control_getTouchLocation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_getTouchLocation : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Touch* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Touch*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_getTouchLocation : Error processing arguments");
        cocos2d::Vec2 ret = cobj->getTouchLocation(arg0);
        JS::RootedValue jsret(cx);
        ok &= vector2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_getTouchLocation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_getTouchLocation : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_Control_isHighlighted(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_Control_isHighlighted : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isHighlighted();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_Control_isHighlighted : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_isHighlighted : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_Control_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        auto ret = cocos2d::extension::Control::create();
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_extension_Control_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_cocos2d_extension_Control_class, proto, &jsret, "cocos2d::extension::Control");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_Control_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_extension_Control_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::Control* cobj = new (std::nothrow) cocos2d::extension::Control();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_Control_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_Control_class, proto, &jsobj, "cocos2d::extension::Control");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}


extern JS::PersistentRootedObject *jsb_cocos2d_Layer_prototype;

void js_register_cocos2dx_extension_Control(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_Control_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_Control_class = {
        "Control",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_Control_classOps
    };
    jsb_cocos2d_extension_Control_class = &cocos2d_extension_Control_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("setEnabled", js_cocos2dx_extension_Control_setEnabled, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getState", js_cocos2dx_extension_Control_getState, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("sendActionsForControlEvents", js_cocos2dx_extension_Control_sendActionsForControlEvents, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setSelected", js_cocos2dx_extension_Control_setSelected, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isEnabled", js_cocos2dx_extension_Control_isEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("needsLayout", js_cocos2dx_extension_Control_needsLayout, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("hasVisibleParents", js_cocos2dx_extension_Control_hasVisibleParents, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isSelected", js_cocos2dx_extension_Control_isSelected, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isTouchInside", js_cocos2dx_extension_Control_isTouchInside, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setHighlighted", js_cocos2dx_extension_Control_setHighlighted, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTouchLocation", js_cocos2dx_extension_Control_getTouchLocation, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isHighlighted", js_cocos2dx_extension_Control_isHighlighted, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_Control_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Layer_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_Control_class,
        js_cocos2dx_extension_Control_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::Control>(cx, jsb_cocos2d_extension_Control_class, proto);
    jsb_cocos2d_extension_Control_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "Control", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_cocos2d_extension_ControlButton_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_ControlButton_prototype;

bool js_cocos2dx_extension_ControlButton_isPushed(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_isPushed : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isPushed();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_isPushed : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_isPushed : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setTitleLabelForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setTitleLabelForState : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::extension::Control::State arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setTitleLabelForState : Error processing arguments");
        cobj->setTitleLabelForState(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setTitleLabelForState : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setAdjustBackgroundImage(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setAdjustBackgroundImage : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setAdjustBackgroundImage : Error processing arguments");
        cobj->setAdjustBackgroundImage(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setAdjustBackgroundImage : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setTitleForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setTitleForState : Invalid Native Object");
    if (argc == 2) {
        std::string arg0;
        cocos2d::extension::Control::State arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setTitleForState : Error processing arguments");
        cobj->setTitleForState(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setTitleForState : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setLabelAnchorPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setLabelAnchorPoint : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setLabelAnchorPoint : Error processing arguments");
        cobj->setLabelAnchorPoint(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setLabelAnchorPoint : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getLabelAnchorPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getLabelAnchorPoint : Invalid Native Object");
    if (argc == 0) {
        const cocos2d::Vec2& ret = cobj->getLabelAnchorPoint();
        JS::RootedValue jsret(cx);
        ok &= vector2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getLabelAnchorPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getLabelAnchorPoint : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlButton_initWithBackgroundSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_initWithBackgroundSprite : Invalid Native Object");
    if (argc == 1) {
        cocos2d::ui::Scale9Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::ui::Scale9Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_initWithBackgroundSprite : Error processing arguments");
        bool ret = cobj->initWithBackgroundSprite(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_initWithBackgroundSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_initWithBackgroundSprite : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState : Error processing arguments");
        float ret = cobj->getTitleTTFSizeForState(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setTitleTTFForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setTitleTTFForState : Invalid Native Object");
    if (argc == 2) {
        std::string arg0;
        cocos2d::extension::Control::State arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setTitleTTFForState : Error processing arguments");
        cobj->setTitleTTFForState(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setTitleTTFForState : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setTitleTTFSizeForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setTitleTTFSizeForState : Invalid Native Object");
    if (argc == 2) {
        float arg0 = 0;
        cocos2d::extension::Control::State arg1;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setTitleTTFSizeForState : Error processing arguments");
        cobj->setTitleTTFSizeForState(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setTitleTTFSizeForState : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setTitleLabel(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setTitleLabel : Invalid Native Object");
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
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setTitleLabel : Error processing arguments");
        cobj->setTitleLabel(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setTitleLabel : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setPreferredSize(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setPreferredSize : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setPreferredSize : Error processing arguments");
        cobj->setPreferredSize(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setPreferredSize : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getCurrentTitleColor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getCurrentTitleColor : Invalid Native Object");
    if (argc == 0) {
        const cocos2d::Color3B& ret = cobj->getCurrentTitleColor();
        JS::RootedValue jsret(cx);
        ok &= cccolor3b_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getCurrentTitleColor : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getCurrentTitleColor : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setZoomOnTouchDown(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setZoomOnTouchDown : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setZoomOnTouchDown : Error processing arguments");
        cobj->setZoomOnTouchDown(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setZoomOnTouchDown : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setBackgroundSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setBackgroundSprite : Invalid Native Object");
    if (argc == 1) {
        cocos2d::ui::Scale9Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::ui::Scale9Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setBackgroundSprite : Error processing arguments");
        cobj->setBackgroundSprite(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setBackgroundSprite : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState : Error processing arguments");
        cocos2d::ui::Scale9Sprite* ret = cobj->getBackgroundSpriteForState(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::ui::Scale9Sprite>(cx, (cocos2d::ui::Scale9Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getHorizontalOrigin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getHorizontalOrigin : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getHorizontalOrigin();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getHorizontalOrigin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getHorizontalOrigin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize : Invalid Native Object");
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        float arg2 = 0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        ok &= jsval_to_float(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize : Error processing arguments");
        bool ret = cobj->initWithTitleAndFontNameAndFontSize(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setTitleBMFontForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setTitleBMFontForState : Invalid Native Object");
    if (argc == 2) {
        std::string arg0;
        cocos2d::extension::Control::State arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setTitleBMFontForState : Error processing arguments");
        cobj->setTitleBMFontForState(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setTitleBMFontForState : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getScaleRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getScaleRatio : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getScaleRatio();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getScaleRatio : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getScaleRatio : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getTitleTTFForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getTitleTTFForState : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleTTFForState : Error processing arguments");
        const std::string& ret = cobj->getTitleTTFForState(arg0);
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleTTFForState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getTitleTTFForState : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getBackgroundSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getBackgroundSprite : Invalid Native Object");
    if (argc == 0) {
        cocos2d::ui::Scale9Sprite* ret = cobj->getBackgroundSprite();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::ui::Scale9Sprite>(cx, (cocos2d::ui::Scale9Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getBackgroundSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getBackgroundSprite : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getTitleColorForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getTitleColorForState : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleColorForState : Error processing arguments");
        cocos2d::Color3B ret = cobj->getTitleColorForState(arg0);
        JS::RootedValue jsret(cx);
        ok &= cccolor3b_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleColorForState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getTitleColorForState : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setTitleColorForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setTitleColorForState : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Color3B arg0;
        cocos2d::extension::Control::State arg1;
        ok &= jsval_to_cccolor3b(cx, args.get(0), &arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setTitleColorForState : Error processing arguments");
        cobj->setTitleColorForState(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setTitleColorForState : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlButton_doesAdjustBackgroundImage(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_doesAdjustBackgroundImage : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->doesAdjustBackgroundImage();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_doesAdjustBackgroundImage : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_doesAdjustBackgroundImage : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setBackgroundSpriteFrameForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setBackgroundSpriteFrameForState : Invalid Native Object");
    if (argc == 2) {
        cocos2d::SpriteFrame* arg0 = nullptr;
        cocos2d::extension::Control::State arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::SpriteFrame*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setBackgroundSpriteFrameForState : Error processing arguments");
        cobj->setBackgroundSpriteFrameForState(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setBackgroundSpriteFrameForState : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setBackgroundSpriteForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setBackgroundSpriteForState : Invalid Native Object");
    if (argc == 2) {
        cocos2d::ui::Scale9Sprite* arg0 = nullptr;
        cocos2d::extension::Control::State arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::ui::Scale9Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setBackgroundSpriteForState : Error processing arguments");
        cobj->setBackgroundSpriteForState(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setBackgroundSpriteForState : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setScaleRatio(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setScaleRatio : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setScaleRatio : Error processing arguments");
        cobj->setScaleRatio(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setScaleRatio : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getTitleBMFontForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getTitleBMFontForState : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleBMFontForState : Error processing arguments");
        const std::string& ret = cobj->getTitleBMFontForState(arg0);
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleBMFontForState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getTitleBMFontForState : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getTitleLabel(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getTitleLabel : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Node* ret = cobj->getTitleLabel();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Node>(cx, (cocos2d::Node*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleLabel : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getTitleLabel : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getPreferredSize(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getPreferredSize : Invalid Native Object");
    if (argc == 0) {
        const cocos2d::Size& ret = cobj->getPreferredSize();
        JS::RootedValue jsret(cx);
        ok &= ccsize_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getPreferredSize : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getPreferredSize : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getVerticalMargin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getVerticalMargin : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getVerticalMargin();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getVerticalMargin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getVerticalMargin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getTitleLabelForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getTitleLabelForState : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleLabelForState : Error processing arguments");
        cocos2d::Node* ret = cobj->getTitleLabelForState(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Node>(cx, (cocos2d::Node*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleLabelForState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getTitleLabelForState : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_setMargins(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_setMargins : Invalid Native Object");
    if (argc == 2) {
        int arg0 = 0;
        int arg1 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_setMargins : Error processing arguments");
        cobj->setMargins(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_setMargins : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getCurrentTitle(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    cocos2d::extension::ControlButton* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getCurrentTitle : Invalid Native Object");
    do {
        ok = true;
        if (argc == 0) {
            std::string ret = cobj->getCurrentTitle();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            ok &= std_string_to_jsval(cx, ret, &jsret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getCurrentTitle : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            const std::string& ret = cobj->getCurrentTitle();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            ok &= std_string_to_jsval(cx, ret, &jsret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getCurrentTitle : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getCurrentTitle : arguments error");
    return false;
}
bool js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite : Invalid Native Object");
    if (argc == 3) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::ui::Scale9Sprite* arg1 = nullptr;
        bool arg2;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        do {
            if (args.get(1).isNull()) { arg1 = nullptr; break; }
            if (!args.get(1).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg1 = (cocos2d::ui::Scale9Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_bool(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite : Error processing arguments");
        bool ret = cobj->initWithLabelAndBackgroundSprite(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getZoomOnTouchDown(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getZoomOnTouchDown : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->getZoomOnTouchDown();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getZoomOnTouchDown : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getZoomOnTouchDown : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlButton_getTitleForState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlButton_getTitleForState : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleForState : Error processing arguments");
        std::string ret = cobj->getTitleForState(arg0);
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_getTitleForState : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_getTitleForState : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlButton_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 1) {
            cocos2d::ui::Scale9Sprite* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::ui::Scale9Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlButton* ret = cocos2d::extension::ControlButton::create(arg0);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ControlButton>(cx, (cocos2d::extension::ControlButton*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 0) {
            cocos2d::extension::ControlButton* ret = cocos2d::extension::ControlButton::create();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ControlButton>(cx, (cocos2d::extension::ControlButton*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 2) {
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
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* arg1 = nullptr;
            do {
                if (args.get(1).isNull()) { arg1 = nullptr; break; }
                if (!args.get(1).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg1 = (cocos2d::ui::Scale9Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlButton* ret = cocos2d::extension::ControlButton::create(arg0, arg1);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ControlButton>(cx, (cocos2d::extension::ControlButton*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_create : error parsing return value");
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
            cocos2d::extension::ControlButton* ret = cocos2d::extension::ControlButton::create(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ControlButton>(cx, (cocos2d::extension::ControlButton*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 3) {
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
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* arg1 = nullptr;
            do {
                if (args.get(1).isNull()) { arg1 = nullptr; break; }
                if (!args.get(1).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg1 = (cocos2d::ui::Scale9Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool arg2;
            ok &= jsval_to_bool(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlButton* ret = cocos2d::extension::ControlButton::create(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ControlButton>(cx, (cocos2d::extension::ControlButton*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlButton_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlButton_create : wrong number of arguments");
    return false;
}
bool js_cocos2dx_extension_ControlButton_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::ControlButton* cobj = new (std::nothrow) cocos2d::extension::ControlButton();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlButton_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_ControlButton_class, proto, &jsobj, "cocos2d::extension::ControlButton");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}
static bool js_cocos2dx_extension_ControlButton_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    cocos2d::extension::ControlButton *nobj = new (std::nothrow) cocos2d::extension::ControlButton();
    jsb_ref_init(cx, obj, nobj, "cocos2d::extension::ControlButton");
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


extern JS::PersistentRootedObject *jsb_cocos2d_extension_Control_prototype;

    
void js_register_cocos2dx_extension_ControlButton(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_ControlButton_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_ControlButton_class = {
        "ControlButton",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_ControlButton_classOps
    };
    jsb_cocos2d_extension_ControlButton_class = &cocos2d_extension_ControlButton_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("isPushed", js_cocos2dx_extension_ControlButton_isPushed, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setTitleLabelForState", js_cocos2dx_extension_ControlButton_setTitleLabelForState, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setAdjustBackgroundImage", js_cocos2dx_extension_ControlButton_setAdjustBackgroundImage, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setTitleForState", js_cocos2dx_extension_ControlButton_setTitleForState, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setLabelAnchorPoint", js_cocos2dx_extension_ControlButton_setLabelAnchorPoint, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getLabelAnchorPoint", js_cocos2dx_extension_ControlButton_getLabelAnchorPoint, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithBackgroundSprite", js_cocos2dx_extension_ControlButton_initWithBackgroundSprite, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTitleTTFSizeForState", js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setTitleTTFForState", js_cocos2dx_extension_ControlButton_setTitleTTFForState, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setTitleTTFSizeForState", js_cocos2dx_extension_ControlButton_setTitleTTFSizeForState, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setTitleLabel", js_cocos2dx_extension_ControlButton_setTitleLabel, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setPreferredSize", js_cocos2dx_extension_ControlButton_setPreferredSize, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCurrentTitleColor", js_cocos2dx_extension_ControlButton_getCurrentTitleColor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setZoomOnTouchDown", js_cocos2dx_extension_ControlButton_setZoomOnTouchDown, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setBackgroundSprite", js_cocos2dx_extension_ControlButton_setBackgroundSprite, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBackgroundSpriteForState", js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getHorizontalOrigin", js_cocos2dx_extension_ControlButton_getHorizontalOrigin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithTitleAndFontNameAndFontSize", js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setTitleBMFontForState", js_cocos2dx_extension_ControlButton_setTitleBMFontForState, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getScaleRatio", js_cocos2dx_extension_ControlButton_getScaleRatio, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTitleTTFForState", js_cocos2dx_extension_ControlButton_getTitleTTFForState, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBackgroundSprite", js_cocos2dx_extension_ControlButton_getBackgroundSprite, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTitleColorForState", js_cocos2dx_extension_ControlButton_getTitleColorForState, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setTitleColorForState", js_cocos2dx_extension_ControlButton_setTitleColorForState, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("doesAdjustBackgroundImage", js_cocos2dx_extension_ControlButton_doesAdjustBackgroundImage, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setBackgroundSpriteFrameForState", js_cocos2dx_extension_ControlButton_setBackgroundSpriteFrameForState, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setBackgroundSpriteForState", js_cocos2dx_extension_ControlButton_setBackgroundSpriteForState, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setScaleRatio", js_cocos2dx_extension_ControlButton_setScaleRatio, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTitleBMFontForState", js_cocos2dx_extension_ControlButton_getTitleBMFontForState, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTitleLabel", js_cocos2dx_extension_ControlButton_getTitleLabel, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getPreferredSize", js_cocos2dx_extension_ControlButton_getPreferredSize, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getVerticalMargin", js_cocos2dx_extension_ControlButton_getVerticalMargin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTitleLabelForState", js_cocos2dx_extension_ControlButton_getTitleLabelForState, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMargins", js_cocos2dx_extension_ControlButton_setMargins, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCurrentTitle", js_cocos2dx_extension_ControlButton_getCurrentTitle, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithLabelAndBackgroundSprite", js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getZoomOnTouchDown", js_cocos2dx_extension_ControlButton_getZoomOnTouchDown, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getTitleForState", js_cocos2dx_extension_ControlButton_getTitleForState, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_cocos2dx_extension_ControlButton_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_ControlButton_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_extension_Control_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_ControlButton_class,
        js_cocos2dx_extension_ControlButton_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::ControlButton>(cx, jsb_cocos2d_extension_ControlButton_class, proto);
    jsb_cocos2d_extension_ControlButton_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ControlButton", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

JSClass  *jsb_cocos2d_extension_ControlHuePicker_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_ControlHuePicker_prototype;

bool js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::Vec2 arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_vector2(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos : Error processing arguments");
        bool ret = cobj->initWithTargetAndPos(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlHuePicker_setHue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlHuePicker_setHue : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_setHue : Error processing arguments");
        cobj->setHue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlHuePicker_setHue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlHuePicker_getStartPos(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlHuePicker_getStartPos : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Vec2 ret = cobj->getStartPos();
        JS::RootedValue jsret(cx);
        ok &= vector2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_getStartPos : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlHuePicker_getStartPos : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlHuePicker_getHue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlHuePicker_getHue : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getHue();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_getHue : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlHuePicker_getHue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlHuePicker_getSlider(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlHuePicker_getSlider : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getSlider();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_getSlider : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlHuePicker_getSlider : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlHuePicker_setBackground(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlHuePicker_setBackground : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_setBackground : Error processing arguments");
        cobj->setBackground(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlHuePicker_setBackground : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlHuePicker_setHuePercentage(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlHuePicker_setHuePercentage : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_setHuePercentage : Error processing arguments");
        cobj->setHuePercentage(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlHuePicker_setHuePercentage : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlHuePicker_getBackground(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlHuePicker_getBackground : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getBackground();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_getBackground : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlHuePicker_getBackground : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlHuePicker_getHuePercentage(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlHuePicker_getHuePercentage : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getHuePercentage();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_getHuePercentage : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlHuePicker_getHuePercentage : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlHuePicker_setSlider(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlHuePicker_setSlider : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_setSlider : Error processing arguments");
        cobj->setSlider(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlHuePicker_setSlider : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlHuePicker_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::Vec2 arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_vector2(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlHuePicker_create : Error processing arguments");

        auto ret = cocos2d::extension::ControlHuePicker::create(arg0, arg1);
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlHuePicker_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_cocos2d_extension_ControlHuePicker_class, proto, &jsret, "cocos2d::extension::ControlHuePicker");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlHuePicker_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_extension_ControlHuePicker_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::ControlHuePicker* cobj = new (std::nothrow) cocos2d::extension::ControlHuePicker();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlHuePicker_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_ControlHuePicker_class, proto, &jsobj, "cocos2d::extension::ControlHuePicker");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}


extern JS::PersistentRootedObject *jsb_cocos2d_extension_Control_prototype;

void js_register_cocos2dx_extension_ControlHuePicker(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_ControlHuePicker_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_ControlHuePicker_class = {
        "ControlHuePicker",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_ControlHuePicker_classOps
    };
    jsb_cocos2d_extension_ControlHuePicker_class = &cocos2d_extension_ControlHuePicker_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("initWithTargetAndPos", js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setHue", js_cocos2dx_extension_ControlHuePicker_setHue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getStartPos", js_cocos2dx_extension_ControlHuePicker_getStartPos, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getHue", js_cocos2dx_extension_ControlHuePicker_getHue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSlider", js_cocos2dx_extension_ControlHuePicker_getSlider, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setBackground", js_cocos2dx_extension_ControlHuePicker_setBackground, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setHuePercentage", js_cocos2dx_extension_ControlHuePicker_setHuePercentage, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBackground", js_cocos2dx_extension_ControlHuePicker_getBackground, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getHuePercentage", js_cocos2dx_extension_ControlHuePicker_getHuePercentage, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setSlider", js_cocos2dx_extension_ControlHuePicker_setSlider, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_ControlHuePicker_create, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_extension_Control_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_ControlHuePicker_class,
        js_cocos2dx_extension_ControlHuePicker_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::ControlHuePicker>(cx, jsb_cocos2d_extension_ControlHuePicker_class, proto);
    jsb_cocos2d_extension_ControlHuePicker_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ControlHuePicker", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_cocos2d_extension_ControlSaturationBrightnessPicker_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_ControlSaturationBrightnessPicker_prototype;

bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getShadow(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getShadow : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getShadow();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getShadow : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getShadow : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::Vec2 arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_vector2(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos : Error processing arguments");
        bool ret = cobj->initWithTargetAndPos(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getStartPos(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getStartPos : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Vec2 ret = cobj->getStartPos();
        JS::RootedValue jsret(cx);
        ok &= vector2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getStartPos : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getStartPos : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getOverlay(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getOverlay : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getOverlay();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getOverlay : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getOverlay : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSlider(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSlider : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getSlider();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSlider : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSlider : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBackground(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBackground : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getBackground();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBackground : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBackground : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSaturation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSaturation : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getSaturation();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSaturation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSaturation : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBrightness(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBrightness : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getBrightness();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBrightness : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBrightness : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::Vec2 arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_vector2(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_create : Error processing arguments");

        auto ret = cocos2d::extension::ControlSaturationBrightnessPicker::create(arg0, arg1);
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlSaturationBrightnessPicker_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_cocos2d_extension_ControlSaturationBrightnessPicker_class, proto, &jsret, "cocos2d::extension::ControlSaturationBrightnessPicker");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = new (std::nothrow) cocos2d::extension::ControlSaturationBrightnessPicker();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlSaturationBrightnessPicker_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_ControlSaturationBrightnessPicker_class, proto, &jsobj, "cocos2d::extension::ControlSaturationBrightnessPicker");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}


extern JS::PersistentRootedObject *jsb_cocos2d_extension_Control_prototype;

void js_register_cocos2dx_extension_ControlSaturationBrightnessPicker(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_ControlSaturationBrightnessPicker_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_ControlSaturationBrightnessPicker_class = {
        "ControlSaturationBrightnessPicker",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_ControlSaturationBrightnessPicker_classOps
    };
    jsb_cocos2d_extension_ControlSaturationBrightnessPicker_class = &cocos2d_extension_ControlSaturationBrightnessPicker_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getShadow", js_cocos2dx_extension_ControlSaturationBrightnessPicker_getShadow, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithTargetAndPos", js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getStartPos", js_cocos2dx_extension_ControlSaturationBrightnessPicker_getStartPos, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getOverlay", js_cocos2dx_extension_ControlSaturationBrightnessPicker_getOverlay, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSlider", js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSlider, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBackground", js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBackground, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSaturation", js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSaturation, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBrightness", js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBrightness, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_ControlSaturationBrightnessPicker_create, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_extension_Control_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_ControlSaturationBrightnessPicker_class,
        js_cocos2dx_extension_ControlSaturationBrightnessPicker_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::ControlSaturationBrightnessPicker>(cx, jsb_cocos2d_extension_ControlSaturationBrightnessPicker_class, proto);
    jsb_cocos2d_extension_ControlSaturationBrightnessPicker_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ControlSaturationBrightnessPicker", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

JSClass  *jsb_cocos2d_extension_ControlColourPicker_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_ControlColourPicker_prototype;

bool js_cocos2dx_extension_ControlColourPicker_hueSliderValueChanged(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlColourPicker_hueSliderValueChanged : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Ref* arg0 = nullptr;
        cocos2d::extension::Control::EventType arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Ref*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlColourPicker_hueSliderValueChanged : Error processing arguments");
        cobj->hueSliderValueChanged(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlColourPicker_hueSliderValueChanged : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlColourPicker_getHuePicker(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlColourPicker_getHuePicker : Invalid Native Object");
    if (argc == 0) {
        cocos2d::extension::ControlHuePicker* ret = cobj->getHuePicker();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::extension::ControlHuePicker>(cx, (cocos2d::extension::ControlHuePicker*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlColourPicker_getHuePicker : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlColourPicker_getHuePicker : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlColourPicker_getcolourPicker(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlColourPicker_getcolourPicker : Invalid Native Object");
    if (argc == 0) {
        cocos2d::extension::ControlSaturationBrightnessPicker* ret = cobj->getcolourPicker();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::extension::ControlSaturationBrightnessPicker>(cx, (cocos2d::extension::ControlSaturationBrightnessPicker*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlColourPicker_getcolourPicker : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlColourPicker_getcolourPicker : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlColourPicker_setBackground(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlColourPicker_setBackground : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlColourPicker_setBackground : Error processing arguments");
        cobj->setBackground(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlColourPicker_setBackground : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlColourPicker_setcolourPicker(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlColourPicker_setcolourPicker : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::ControlSaturationBrightnessPicker* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::extension::ControlSaturationBrightnessPicker*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlColourPicker_setcolourPicker : Error processing arguments");
        cobj->setcolourPicker(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlColourPicker_setcolourPicker : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlColourPicker_colourSliderValueChanged(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlColourPicker_colourSliderValueChanged : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Ref* arg0 = nullptr;
        cocos2d::extension::Control::EventType arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Ref*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlColourPicker_colourSliderValueChanged : Error processing arguments");
        cobj->colourSliderValueChanged(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlColourPicker_colourSliderValueChanged : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlColourPicker_setHuePicker(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlColourPicker_setHuePicker : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::ControlHuePicker* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::extension::ControlHuePicker*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlColourPicker_setHuePicker : Error processing arguments");
        cobj->setHuePicker(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlColourPicker_setHuePicker : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlColourPicker_getBackground(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlColourPicker_getBackground : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getBackground();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlColourPicker_getBackground : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlColourPicker_getBackground : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlColourPicker_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        auto ret = cocos2d::extension::ControlColourPicker::create();
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlColourPicker_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_cocos2d_extension_ControlColourPicker_class, proto, &jsret, "cocos2d::extension::ControlColourPicker");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlColourPicker_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_extension_ControlColourPicker_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::ControlColourPicker* cobj = new (std::nothrow) cocos2d::extension::ControlColourPicker();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlColourPicker_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_ControlColourPicker_class, proto, &jsobj, "cocos2d::extension::ControlColourPicker");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}
static bool js_cocos2dx_extension_ControlColourPicker_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    cocos2d::extension::ControlColourPicker *nobj = new (std::nothrow) cocos2d::extension::ControlColourPicker();
    jsb_ref_init(cx, obj, nobj, "cocos2d::extension::ControlColourPicker");
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


extern JS::PersistentRootedObject *jsb_cocos2d_extension_Control_prototype;

    
void js_register_cocos2dx_extension_ControlColourPicker(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_ControlColourPicker_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_ControlColourPicker_class = {
        "ControlColourPicker",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_ControlColourPicker_classOps
    };
    jsb_cocos2d_extension_ControlColourPicker_class = &cocos2d_extension_ControlColourPicker_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("hueSliderValueChanged", js_cocos2dx_extension_ControlColourPicker_hueSliderValueChanged, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getHuePicker", js_cocos2dx_extension_ControlColourPicker_getHuePicker, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getcolourPicker", js_cocos2dx_extension_ControlColourPicker_getcolourPicker, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setBackground", js_cocos2dx_extension_ControlColourPicker_setBackground, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setcolourPicker", js_cocos2dx_extension_ControlColourPicker_setcolourPicker, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("colourSliderValueChanged", js_cocos2dx_extension_ControlColourPicker_colourSliderValueChanged, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setHuePicker", js_cocos2dx_extension_ControlColourPicker_setHuePicker, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBackground", js_cocos2dx_extension_ControlColourPicker_getBackground, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_cocos2dx_extension_ControlColourPicker_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_ControlColourPicker_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_extension_Control_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_ControlColourPicker_class,
        js_cocos2dx_extension_ControlColourPicker_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::ControlColourPicker>(cx, jsb_cocos2d_extension_ControlColourPicker_class, proto);
    jsb_cocos2d_extension_ControlColourPicker_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ControlColourPicker", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

JSClass  *jsb_cocos2d_extension_ControlPotentiometer_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_ControlPotentiometer_prototype;

bool js_cocos2dx_extension_ControlPotentiometer_setPreviousLocation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setPreviousLocation : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setPreviousLocation : Error processing arguments");
        cobj->setPreviousLocation(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_setPreviousLocation : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_setValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setValue : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setValue : Error processing arguments");
        cobj->setValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_setValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_getProgressTimer(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getProgressTimer : Invalid Native Object");
    if (argc == 0) {
        cocos2d::ProgressTimer* ret = cobj->getProgressTimer();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::ProgressTimer>(cx, (cocos2d::ProgressTimer*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getProgressTimer : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_getProgressTimer : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_getMaximumValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getMaximumValue : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getMaximumValue();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getMaximumValue : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_getMaximumValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint : Invalid Native Object");
    if (argc == 4) {
        cocos2d::Vec2 arg0;
        cocos2d::Vec2 arg1;
        cocos2d::Vec2 arg2;
        cocos2d::Vec2 arg3;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        ok &= jsval_to_vector2(cx, args.get(1), &arg1);
        ok &= jsval_to_vector2(cx, args.get(2), &arg2);
        ok &= jsval_to_vector2(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint : Error processing arguments");
        float ret = cobj->angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(arg0, arg1, arg2, arg3);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_potentiometerBegan(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerBegan : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerBegan : Error processing arguments");
        cobj->potentiometerBegan(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_potentiometerBegan : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_setMaximumValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setMaximumValue : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setMaximumValue : Error processing arguments");
        cobj->setMaximumValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_setMaximumValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_getMinimumValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getMinimumValue : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getMinimumValue();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getMinimumValue : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_getMinimumValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_setThumbSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setThumbSprite : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setThumbSprite : Error processing arguments");
        cobj->setThumbSprite(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_setThumbSprite : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_getValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getValue : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getValue();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getValue : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_getValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_getPreviousLocation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getPreviousLocation : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Vec2 ret = cobj->getPreviousLocation();
        JS::RootedValue jsret(cx);
        ok &= vector2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getPreviousLocation : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_getPreviousLocation : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Vec2 arg0;
        cocos2d::Vec2 arg1;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        ok &= jsval_to_vector2(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint : Error processing arguments");
        float ret = cobj->distanceBetweenPointAndPoint(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_potentiometerEnded(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerEnded : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerEnded : Error processing arguments");
        cobj->potentiometerEnded(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_potentiometerEnded : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_setProgressTimer(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setProgressTimer : Invalid Native Object");
    if (argc == 1) {
        cocos2d::ProgressTimer* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::ProgressTimer*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setProgressTimer : Error processing arguments");
        cobj->setProgressTimer(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_setProgressTimer : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_setMinimumValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setMinimumValue : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_setMinimumValue : Error processing arguments");
        cobj->setMinimumValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_setMinimumValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_getThumbSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getThumbSprite : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getThumbSprite();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_getThumbSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_getThumbSprite : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite : Invalid Native Object");
    if (argc == 3) {
        cocos2d::Sprite* arg0 = nullptr;
        cocos2d::ProgressTimer* arg1 = nullptr;
        cocos2d::Sprite* arg2 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        do {
            if (args.get(1).isNull()) { arg1 = nullptr; break; }
            if (!args.get(1).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg1 = (cocos2d::ProgressTimer*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
        } while (0);
        do {
            if (args.get(2).isNull()) { arg2 = nullptr; break; }
            if (!args.get(2).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(2).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg2 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg2, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite : Error processing arguments");
        bool ret = cobj->initWithTrackSprite_ProgressTimer_ThumbSprite(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_potentiometerMoved(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerMoved : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerMoved : Error processing arguments");
        cobj->potentiometerMoved(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_potentiometerMoved : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlPotentiometer_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 3) {
        const char* arg0 = nullptr;
        const char* arg1 = nullptr;
        const char* arg2 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
        std::string arg2_tmp; ok &= jsval_to_std_string(cx, args.get(2), &arg2_tmp); arg2 = arg2_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlPotentiometer_create : Error processing arguments");

        auto ret = cocos2d::extension::ControlPotentiometer::create(arg0, arg1, arg2);
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlPotentiometer_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_cocos2d_extension_ControlPotentiometer_class, proto, &jsret, "cocos2d::extension::ControlPotentiometer");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlPotentiometer_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_extension_ControlPotentiometer_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::ControlPotentiometer* cobj = new (std::nothrow) cocos2d::extension::ControlPotentiometer();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlPotentiometer_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_ControlPotentiometer_class, proto, &jsobj, "cocos2d::extension::ControlPotentiometer");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}
static bool js_cocos2dx_extension_ControlPotentiometer_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    cocos2d::extension::ControlPotentiometer *nobj = new (std::nothrow) cocos2d::extension::ControlPotentiometer();
    jsb_ref_init(cx, obj, nobj, "cocos2d::extension::ControlPotentiometer");
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


extern JS::PersistentRootedObject *jsb_cocos2d_extension_Control_prototype;

    
void js_register_cocos2dx_extension_ControlPotentiometer(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_ControlPotentiometer_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_ControlPotentiometer_class = {
        "ControlPotentiometer",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_ControlPotentiometer_classOps
    };
    jsb_cocos2d_extension_ControlPotentiometer_class = &cocos2d_extension_ControlPotentiometer_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("setPreviousLocation", js_cocos2dx_extension_ControlPotentiometer_setPreviousLocation, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setValue", js_cocos2dx_extension_ControlPotentiometer_setValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getProgressTimer", js_cocos2dx_extension_ControlPotentiometer_getProgressTimer, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMaximumValue", js_cocos2dx_extension_ControlPotentiometer_getMaximumValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint", js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("potentiometerBegan", js_cocos2dx_extension_ControlPotentiometer_potentiometerBegan, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMaximumValue", js_cocos2dx_extension_ControlPotentiometer_setMaximumValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMinimumValue", js_cocos2dx_extension_ControlPotentiometer_getMinimumValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setThumbSprite", js_cocos2dx_extension_ControlPotentiometer_setThumbSprite, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getValue", js_cocos2dx_extension_ControlPotentiometer_getValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getPreviousLocation", js_cocos2dx_extension_ControlPotentiometer_getPreviousLocation, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("distanceBetweenPointAndPoint", js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("potentiometerEnded", js_cocos2dx_extension_ControlPotentiometer_potentiometerEnded, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setProgressTimer", js_cocos2dx_extension_ControlPotentiometer_setProgressTimer, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMinimumValue", js_cocos2dx_extension_ControlPotentiometer_setMinimumValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getThumbSprite", js_cocos2dx_extension_ControlPotentiometer_getThumbSprite, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithTrackSprite_ProgressTimer_ThumbSprite", js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("potentiometerMoved", js_cocos2dx_extension_ControlPotentiometer_potentiometerMoved, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_cocos2dx_extension_ControlPotentiometer_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_ControlPotentiometer_create, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_extension_Control_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_ControlPotentiometer_class,
        js_cocos2dx_extension_ControlPotentiometer_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::ControlPotentiometer>(cx, jsb_cocos2d_extension_ControlPotentiometer_class, proto);
    jsb_cocos2d_extension_ControlPotentiometer_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ControlPotentiometer", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

JSClass  *jsb_cocos2d_extension_ControlSlider_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_ControlSlider_prototype;

bool js_cocos2dx_extension_ControlSlider_setBackgroundSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_setBackgroundSprite : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_setBackgroundSprite : Error processing arguments");
        cobj->setBackgroundSprite(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_setBackgroundSprite : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_getMaximumAllowedValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_getMaximumAllowedValue : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getMaximumAllowedValue();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_getMaximumAllowedValue : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_getMaximumAllowedValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_initWithSprites(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    cocos2d::extension::ControlSlider* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_initWithSprites : Invalid Native Object");
    do {
        ok = true;
        if (argc == 4) {
            cocos2d::Sprite* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            do {
                if (args.get(1).isNull()) { arg1 = nullptr; break; }
                if (!args.get(1).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg1 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            do {
                if (args.get(2).isNull()) { arg2 = nullptr; break; }
                if (!args.get(2).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(2).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg2 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg2, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            do {
                if (args.get(3).isNull()) { arg3 = nullptr; break; }
                if (!args.get(3).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(3).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg3 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg3, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithSprites(arg0, arg1, arg2, arg3);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_initWithSprites : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 3) {
            cocos2d::Sprite* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            do {
                if (args.get(1).isNull()) { arg1 = nullptr; break; }
                if (!args.get(1).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg1 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            do {
                if (args.get(2).isNull()) { arg2 = nullptr; break; }
                if (!args.get(2).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(2).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg2 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg2, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithSprites(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_initWithSprites : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_initWithSprites : arguments error");
    return false;
}
bool js_cocos2dx_extension_ControlSlider_getMinimumAllowedValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_getMinimumAllowedValue : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getMinimumAllowedValue();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_getMinimumAllowedValue : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_getMinimumAllowedValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_getMaximumValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_getMaximumValue : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getMaximumValue();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_getMaximumValue : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_getMaximumValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_getSelectedThumbSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_getSelectedThumbSprite : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getSelectedThumbSprite();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_getSelectedThumbSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_getSelectedThumbSprite : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_setProgressSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_setProgressSprite : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_setProgressSprite : Error processing arguments");
        cobj->setProgressSprite(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_setProgressSprite : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_setMaximumValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_setMaximumValue : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_setMaximumValue : Error processing arguments");
        cobj->setMaximumValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_setMaximumValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_getMinimumValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_getMinimumValue : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getMinimumValue();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_getMinimumValue : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_getMinimumValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_setThumbSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_setThumbSprite : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_setThumbSprite : Error processing arguments");
        cobj->setThumbSprite(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_setThumbSprite : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_getValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_getValue : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getValue();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_getValue : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_getValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_getBackgroundSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_getBackgroundSprite : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getBackgroundSprite();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_getBackgroundSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_getBackgroundSprite : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_getThumbSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_getThumbSprite : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getThumbSprite();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_getThumbSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_getThumbSprite : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_setValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_setValue : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_setValue : Error processing arguments");
        cobj->setValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_setValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_locationFromTouch(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_locationFromTouch : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Touch* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Touch*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_locationFromTouch : Error processing arguments");
        cocos2d::Vec2 ret = cobj->locationFromTouch(arg0);
        JS::RootedValue jsret(cx);
        ok &= vector2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_locationFromTouch : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_locationFromTouch : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_setMinimumValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_setMinimumValue : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_setMinimumValue : Error processing arguments");
        cobj->setMinimumValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_setMinimumValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_setMinimumAllowedValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_setMinimumAllowedValue : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_setMinimumAllowedValue : Error processing arguments");
        cobj->setMinimumAllowedValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_setMinimumAllowedValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_getProgressSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_getProgressSprite : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getProgressSprite();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_getProgressSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_getProgressSprite : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_setSelectedThumbSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_setSelectedThumbSprite : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_setSelectedThumbSprite : Error processing arguments");
        cobj->setSelectedThumbSprite(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_setSelectedThumbSprite : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_setMaximumAllowedValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSlider_setMaximumAllowedValue : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_setMaximumAllowedValue : Error processing arguments");
        cobj->setMaximumAllowedValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_setMaximumAllowedValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlSlider_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 3) {
            cocos2d::Sprite* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            do {
                if (args.get(1).isNull()) { arg1 = nullptr; break; }
                if (!args.get(1).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg1 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            do {
                if (args.get(2).isNull()) { arg2 = nullptr; break; }
                if (!args.get(2).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(2).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg2 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg2, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSlider* ret = cocos2d::extension::ControlSlider::create(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ControlSlider>(cx, (cocos2d::extension::ControlSlider*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 3) {
            const char* arg0 = nullptr;
            std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
            if (!ok) { ok = true; break; }
            const char* arg1 = nullptr;
            std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
            if (!ok) { ok = true; break; }
            const char* arg2 = nullptr;
            std::string arg2_tmp; ok &= jsval_to_std_string(cx, args.get(2), &arg2_tmp); arg2 = arg2_tmp.c_str();
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSlider* ret = cocos2d::extension::ControlSlider::create(arg0, arg1, arg2);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ControlSlider>(cx, (cocos2d::extension::ControlSlider*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 4) {
            const char* arg0 = nullptr;
            std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
            if (!ok) { ok = true; break; }
            const char* arg1 = nullptr;
            std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
            if (!ok) { ok = true; break; }
            const char* arg2 = nullptr;
            std::string arg2_tmp; ok &= jsval_to_std_string(cx, args.get(2), &arg2_tmp); arg2 = arg2_tmp.c_str();
            if (!ok) { ok = true; break; }
            const char* arg3 = nullptr;
            std::string arg3_tmp; ok &= jsval_to_std_string(cx, args.get(3), &arg3_tmp); arg3 = arg3_tmp.c_str();
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSlider* ret = cocos2d::extension::ControlSlider::create(arg0, arg1, arg2, arg3);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ControlSlider>(cx, (cocos2d::extension::ControlSlider*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 4) {
            cocos2d::Sprite* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            do {
                if (args.get(1).isNull()) { arg1 = nullptr; break; }
                if (!args.get(1).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg1 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            do {
                if (args.get(2).isNull()) { arg2 = nullptr; break; }
                if (!args.get(2).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(2).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg2 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg2, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            do {
                if (args.get(3).isNull()) { arg3 = nullptr; break; }
                if (!args.get(3).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(3).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg3 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg3, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSlider* ret = cocos2d::extension::ControlSlider::create(arg0, arg1, arg2, arg3);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ControlSlider>(cx, (cocos2d::extension::ControlSlider*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSlider_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSlider_create : wrong number of arguments");
    return false;
}
bool js_cocos2dx_extension_ControlSlider_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::ControlSlider* cobj = new (std::nothrow) cocos2d::extension::ControlSlider();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlSlider_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_ControlSlider_class, proto, &jsobj, "cocos2d::extension::ControlSlider");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}
static bool js_cocos2dx_extension_ControlSlider_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    cocos2d::extension::ControlSlider *nobj = new (std::nothrow) cocos2d::extension::ControlSlider();
    jsb_ref_init(cx, obj, nobj, "cocos2d::extension::ControlSlider");
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


extern JS::PersistentRootedObject *jsb_cocos2d_extension_Control_prototype;

    
void js_register_cocos2dx_extension_ControlSlider(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_ControlSlider_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_ControlSlider_class = {
        "ControlSlider",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_ControlSlider_classOps
    };
    jsb_cocos2d_extension_ControlSlider_class = &cocos2d_extension_ControlSlider_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("setBackgroundSprite", js_cocos2dx_extension_ControlSlider_setBackgroundSprite, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMaximumAllowedValue", js_cocos2dx_extension_ControlSlider_getMaximumAllowedValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithSprites", js_cocos2dx_extension_ControlSlider_initWithSprites, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMinimumAllowedValue", js_cocos2dx_extension_ControlSlider_getMinimumAllowedValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMaximumValue", js_cocos2dx_extension_ControlSlider_getMaximumValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSelectedThumbSprite", js_cocos2dx_extension_ControlSlider_getSelectedThumbSprite, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setProgressSprite", js_cocos2dx_extension_ControlSlider_setProgressSprite, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMaximumValue", js_cocos2dx_extension_ControlSlider_setMaximumValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMinimumValue", js_cocos2dx_extension_ControlSlider_getMinimumValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setThumbSprite", js_cocos2dx_extension_ControlSlider_setThumbSprite, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getValue", js_cocos2dx_extension_ControlSlider_getValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBackgroundSprite", js_cocos2dx_extension_ControlSlider_getBackgroundSprite, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getThumbSprite", js_cocos2dx_extension_ControlSlider_getThumbSprite, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setValue", js_cocos2dx_extension_ControlSlider_setValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("locationFromTouch", js_cocos2dx_extension_ControlSlider_locationFromTouch, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMinimumValue", js_cocos2dx_extension_ControlSlider_setMinimumValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMinimumAllowedValue", js_cocos2dx_extension_ControlSlider_setMinimumAllowedValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getProgressSprite", js_cocos2dx_extension_ControlSlider_getProgressSprite, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setSelectedThumbSprite", js_cocos2dx_extension_ControlSlider_setSelectedThumbSprite, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMaximumAllowedValue", js_cocos2dx_extension_ControlSlider_setMaximumAllowedValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_cocos2dx_extension_ControlSlider_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_ControlSlider_create, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_extension_Control_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_ControlSlider_class,
        js_cocos2dx_extension_ControlSlider_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::ControlSlider>(cx, jsb_cocos2d_extension_ControlSlider_class, proto);
    jsb_cocos2d_extension_ControlSlider_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ControlSlider", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

JSClass  *jsb_cocos2d_extension_ControlStepper_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_ControlStepper_prototype;

bool js_cocos2dx_extension_ControlStepper_getMinusSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_getMinusSprite : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getMinusSprite();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_getMinusSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_getMinusSprite : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_setValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_setValue : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= jsval_to_double(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_setValue : Error processing arguments");
        cobj->setValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_setValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_setStepValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_setStepValue : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= jsval_to_double(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_setStepValue : Error processing arguments");
        cobj->setStepValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_setStepValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Sprite* arg0 = nullptr;
        cocos2d::Sprite* arg1 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        do {
            if (args.get(1).isNull()) { arg1 = nullptr; break; }
            if (!args.get(1).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg1 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite : Error processing arguments");
        bool ret = cobj->initWithMinusSpriteAndPlusSprite(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_setValueWithSendingEvent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_setValueWithSendingEvent : Invalid Native Object");
    if (argc == 2) {
        double arg0 = 0;
        bool arg1;
        ok &= jsval_to_double(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_setValueWithSendingEvent : Error processing arguments");
        cobj->setValueWithSendingEvent(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_setValueWithSendingEvent : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_setMaximumValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_setMaximumValue : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= jsval_to_double(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_setMaximumValue : Error processing arguments");
        cobj->setMaximumValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_setMaximumValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_getMinusLabel(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_getMinusLabel : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Label* ret = cobj->getMinusLabel();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Label>(cx, (cocos2d::Label*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_getMinusLabel : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_getMinusLabel : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_getPlusLabel(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_getPlusLabel : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Label* ret = cobj->getPlusLabel();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Label>(cx, (cocos2d::Label*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_getPlusLabel : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_getPlusLabel : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_setWraps(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_setWraps : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_setWraps : Error processing arguments");
        cobj->setWraps(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_setWraps : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_setMinusLabel(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_setMinusLabel : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Label* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Label*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_setMinusLabel : Error processing arguments");
        cobj->setMinusLabel(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_setMinusLabel : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_startAutorepeat(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_startAutorepeat : Invalid Native Object");
    if (argc == 0) {
        cobj->startAutorepeat();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_startAutorepeat : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_updateLayoutUsingTouchLocation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_updateLayoutUsingTouchLocation : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_updateLayoutUsingTouchLocation : Error processing arguments");
        cobj->updateLayoutUsingTouchLocation(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_updateLayoutUsingTouchLocation : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_isContinuous(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_isContinuous : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isContinuous();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_isContinuous : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_isContinuous : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_stopAutorepeat(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_stopAutorepeat : Invalid Native Object");
    if (argc == 0) {
        cobj->stopAutorepeat();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_stopAutorepeat : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_setMinimumValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_setMinimumValue : Invalid Native Object");
    if (argc == 1) {
        double arg0 = 0;
        ok &= jsval_to_double(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_setMinimumValue : Error processing arguments");
        cobj->setMinimumValue(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_setMinimumValue : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_setPlusLabel(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_setPlusLabel : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Label* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Label*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_setPlusLabel : Error processing arguments");
        cobj->setPlusLabel(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_setPlusLabel : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_getValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_getValue : Invalid Native Object");
    if (argc == 0) {
        double ret = cobj->getValue();
        JS::RootedValue jsret(cx);
        jsret = JS::DoubleValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_getValue : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_getValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_getPlusSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_getPlusSprite : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Sprite* ret = cobj->getPlusSprite();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Sprite>(cx, (cocos2d::Sprite*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_getPlusSprite : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_getPlusSprite : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_setPlusSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_setPlusSprite : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_setPlusSprite : Error processing arguments");
        cobj->setPlusSprite(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_setPlusSprite : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_setMinusSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlStepper_setMinusSprite : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_setMinusSprite : Error processing arguments");
        cobj->setMinusSprite(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_setMinusSprite : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlStepper_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 2) {
        cocos2d::Sprite* arg0 = nullptr;
        cocos2d::Sprite* arg1 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        do {
            if (args.get(1).isNull()) { arg1 = nullptr; break; }
            if (!args.get(1).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg1 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlStepper_create : Error processing arguments");

        auto ret = cocos2d::extension::ControlStepper::create(arg0, arg1);
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlStepper_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_cocos2d_extension_ControlStepper_class, proto, &jsret, "cocos2d::extension::ControlStepper");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlStepper_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_extension_ControlStepper_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::ControlStepper* cobj = new (std::nothrow) cocos2d::extension::ControlStepper();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlStepper_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_ControlStepper_class, proto, &jsobj, "cocos2d::extension::ControlStepper");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}
static bool js_cocos2dx_extension_ControlStepper_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    cocos2d::extension::ControlStepper *nobj = new (std::nothrow) cocos2d::extension::ControlStepper();
    jsb_ref_init(cx, obj, nobj, "cocos2d::extension::ControlStepper");
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


extern JS::PersistentRootedObject *jsb_cocos2d_extension_Control_prototype;

    
void js_register_cocos2dx_extension_ControlStepper(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_ControlStepper_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_ControlStepper_class = {
        "ControlStepper",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_ControlStepper_classOps
    };
    jsb_cocos2d_extension_ControlStepper_class = &cocos2d_extension_ControlStepper_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("getMinusSprite", js_cocos2dx_extension_ControlStepper_getMinusSprite, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setValue", js_cocos2dx_extension_ControlStepper_setValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setStepValue", js_cocos2dx_extension_ControlStepper_setStepValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithMinusSpriteAndPlusSprite", js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setValueWithSendingEvent", js_cocos2dx_extension_ControlStepper_setValueWithSendingEvent, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMaximumValue", js_cocos2dx_extension_ControlStepper_setMaximumValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMinusLabel", js_cocos2dx_extension_ControlStepper_getMinusLabel, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getPlusLabel", js_cocos2dx_extension_ControlStepper_getPlusLabel, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setWraps", js_cocos2dx_extension_ControlStepper_setWraps, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMinusLabel", js_cocos2dx_extension_ControlStepper_setMinusLabel, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("startAutorepeat", js_cocos2dx_extension_ControlStepper_startAutorepeat, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("updateLayoutUsingTouchLocation", js_cocos2dx_extension_ControlStepper_updateLayoutUsingTouchLocation, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isContinuous", js_cocos2dx_extension_ControlStepper_isContinuous, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stopAutorepeat", js_cocos2dx_extension_ControlStepper_stopAutorepeat, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMinimumValue", js_cocos2dx_extension_ControlStepper_setMinimumValue, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setPlusLabel", js_cocos2dx_extension_ControlStepper_setPlusLabel, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getValue", js_cocos2dx_extension_ControlStepper_getValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getPlusSprite", js_cocos2dx_extension_ControlStepper_getPlusSprite, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setPlusSprite", js_cocos2dx_extension_ControlStepper_setPlusSprite, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMinusSprite", js_cocos2dx_extension_ControlStepper_setMinusSprite, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_cocos2dx_extension_ControlStepper_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_ControlStepper_create, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_extension_Control_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_ControlStepper_class,
        js_cocos2dx_extension_ControlStepper_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::ControlStepper>(cx, jsb_cocos2d_extension_ControlStepper_class, proto);
    jsb_cocos2d_extension_ControlStepper_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ControlStepper", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

JSClass  *jsb_cocos2d_extension_ControlSwitch_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_ControlSwitch_prototype;

bool js_cocos2dx_extension_ControlSwitch_setOn(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    cocos2d::extension::ControlSwitch* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (cocos2d::extension::ControlSwitch *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSwitch_setOn : Invalid Native Object");
    do {
        ok = true;
        if (argc == 1) {
            bool arg0;
            ok &= jsval_to_bool(cx, args.get(0), &arg0);
            cobj->setOn(arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 2) {
            bool arg0;
            ok &= jsval_to_bool(cx, args.get(0), &arg0);
            bool arg1;
            ok &= jsval_to_bool(cx, args.get(1), &arg1);
            cobj->setOn(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSwitch_setOn : arguments error");
    return false;
}
bool js_cocos2dx_extension_ControlSwitch_locationFromTouch(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSwitch* cobj = (cocos2d::extension::ControlSwitch *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSwitch_locationFromTouch : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Touch* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Touch*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSwitch_locationFromTouch : Error processing arguments");
        cocos2d::Vec2 ret = cobj->locationFromTouch(arg0);
        JS::RootedValue jsret(cx);
        ok &= vector2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSwitch_locationFromTouch : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSwitch_locationFromTouch : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ControlSwitch_isOn(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSwitch* cobj = (cocos2d::extension::ControlSwitch *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSwitch_isOn : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isOn();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSwitch_isOn : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSwitch_isOn : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSwitch_initWithMaskSprite(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    cocos2d::extension::ControlSwitch* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (cocos2d::extension::ControlSwitch *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSwitch_initWithMaskSprite : Invalid Native Object");
    do {
        ok = true;
        if (argc == 6) {
            cocos2d::Sprite* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            do {
                if (args.get(1).isNull()) { arg1 = nullptr; break; }
                if (!args.get(1).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg1 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            do {
                if (args.get(2).isNull()) { arg2 = nullptr; break; }
                if (!args.get(2).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(2).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg2 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg2, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            do {
                if (args.get(3).isNull()) { arg3 = nullptr; break; }
                if (!args.get(3).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(3).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg3 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg3, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Label* arg4 = nullptr;
            do {
                if (args.get(4).isNull()) { arg4 = nullptr; break; }
                if (!args.get(4).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(4).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg4 = (cocos2d::Label*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg4, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Label* arg5 = nullptr;
            do {
                if (args.get(5).isNull()) { arg5 = nullptr; break; }
                if (!args.get(5).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(5).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg5 = (cocos2d::Label*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg5, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithMaskSprite(arg0, arg1, arg2, arg3, arg4, arg5);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSwitch_initWithMaskSprite : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 4) {
            cocos2d::Sprite* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            do {
                if (args.get(1).isNull()) { arg1 = nullptr; break; }
                if (!args.get(1).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg1 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            do {
                if (args.get(2).isNull()) { arg2 = nullptr; break; }
                if (!args.get(2).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(2).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg2 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg2, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            do {
                if (args.get(3).isNull()) { arg3 = nullptr; break; }
                if (!args.get(3).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(3).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg3 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg3, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            bool ret = cobj->initWithMaskSprite(arg0, arg1, arg2, arg3);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            jsret = JS::BooleanValue(ret);
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSwitch_initWithMaskSprite : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSwitch_initWithMaskSprite : arguments error");
    return false;
}
bool js_cocos2dx_extension_ControlSwitch_hasMoved(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ControlSwitch* cobj = (cocos2d::extension::ControlSwitch *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ControlSwitch_hasMoved : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->hasMoved();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSwitch_hasMoved : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSwitch_hasMoved : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ControlSwitch_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 4) {
            cocos2d::Sprite* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            do {
                if (args.get(1).isNull()) { arg1 = nullptr; break; }
                if (!args.get(1).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg1 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            do {
                if (args.get(2).isNull()) { arg2 = nullptr; break; }
                if (!args.get(2).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(2).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg2 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg2, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            do {
                if (args.get(3).isNull()) { arg3 = nullptr; break; }
                if (!args.get(3).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(3).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg3 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg3, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSwitch* ret = cocos2d::extension::ControlSwitch::create(arg0, arg1, arg2, arg3);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ControlSwitch>(cx, (cocos2d::extension::ControlSwitch*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSwitch_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 6) {
            cocos2d::Sprite* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            do {
                if (args.get(1).isNull()) { arg1 = nullptr; break; }
                if (!args.get(1).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg1 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            do {
                if (args.get(2).isNull()) { arg2 = nullptr; break; }
                if (!args.get(2).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(2).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg2 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg2, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            do {
                if (args.get(3).isNull()) { arg3 = nullptr; break; }
                if (!args.get(3).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(3).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg3 = (cocos2d::Sprite*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg3, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Label* arg4 = nullptr;
            do {
                if (args.get(4).isNull()) { arg4 = nullptr; break; }
                if (!args.get(4).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(4).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg4 = (cocos2d::Label*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg4, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::Label* arg5 = nullptr;
            do {
                if (args.get(5).isNull()) { arg5 = nullptr; break; }
                if (!args.get(5).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(5).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg5 = (cocos2d::Label*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg5, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSwitch* ret = cocos2d::extension::ControlSwitch::create(arg0, arg1, arg2, arg3, arg4, arg5);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ControlSwitch>(cx, (cocos2d::extension::ControlSwitch*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ControlSwitch_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ControlSwitch_create : wrong number of arguments");
    return false;
}
bool js_cocos2dx_extension_ControlSwitch_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::ControlSwitch* cobj = new (std::nothrow) cocos2d::extension::ControlSwitch();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_ControlSwitch_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_ControlSwitch_class, proto, &jsobj, "cocos2d::extension::ControlSwitch");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}
static bool js_cocos2dx_extension_ControlSwitch_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    cocos2d::extension::ControlSwitch *nobj = new (std::nothrow) cocos2d::extension::ControlSwitch();
    jsb_ref_init(cx, obj, nobj, "cocos2d::extension::ControlSwitch");
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


extern JS::PersistentRootedObject *jsb_cocos2d_extension_Control_prototype;

    
void js_register_cocos2dx_extension_ControlSwitch(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_ControlSwitch_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_ControlSwitch_class = {
        "ControlSwitch",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_ControlSwitch_classOps
    };
    jsb_cocos2d_extension_ControlSwitch_class = &cocos2d_extension_ControlSwitch_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("setOn", js_cocos2dx_extension_ControlSwitch_setOn, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("locationFromTouch", js_cocos2dx_extension_ControlSwitch_locationFromTouch, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isOn", js_cocos2dx_extension_ControlSwitch_isOn, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithMaskSprite", js_cocos2dx_extension_ControlSwitch_initWithMaskSprite, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("hasMoved", js_cocos2dx_extension_ControlSwitch_hasMoved, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_cocos2dx_extension_ControlSwitch_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_ControlSwitch_create, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_extension_Control_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_ControlSwitch_class,
        js_cocos2dx_extension_ControlSwitch_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::ControlSwitch>(cx, jsb_cocos2d_extension_ControlSwitch_class, proto);
    jsb_cocos2d_extension_ControlSwitch_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ControlSwitch", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

JSClass  *jsb_cocos2d_extension_ScrollView_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_ScrollView_prototype;

bool js_cocos2dx_extension_ScrollView_isClippingToBounds(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_isClippingToBounds : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isClippingToBounds();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_isClippingToBounds : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_isClippingToBounds : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setContainer(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setContainer : Invalid Native Object");
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
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setContainer : Error processing arguments");
        cobj->setContainer(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setContainer : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setContentOffsetInDuration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setContentOffsetInDuration : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Vec2 arg0;
        float arg1 = 0;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setContentOffsetInDuration : Error processing arguments");
        cobj->setContentOffsetInDuration(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setContentOffsetInDuration : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setZoomScaleInDuration(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setZoomScaleInDuration : Invalid Native Object");
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_float(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setZoomScaleInDuration : Error processing arguments");
        cobj->setZoomScaleInDuration(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setZoomScaleInDuration : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ScrollView_updateTweenAction(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_updateTweenAction : Invalid Native Object");
    if (argc == 2) {
        float arg0 = 0;
        std::string arg1;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_updateTweenAction : Error processing arguments");
        cobj->updateTweenAction(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_updateTweenAction : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setMaxScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setMaxScale : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setMaxScale : Error processing arguments");
        cobj->setMaxScale(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setMaxScale : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_hasVisibleParents(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_hasVisibleParents : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->hasVisibleParents();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_hasVisibleParents : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_hasVisibleParents : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_getDirection(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_getDirection : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getDirection();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_getDirection : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_getDirection : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_getContainer(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_getContainer : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Node* ret = cobj->getContainer();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::Node>(cx, (cocos2d::Node*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_getContainer : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_getContainer : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setMinScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setMinScale : Invalid Native Object");
    if (argc == 1) {
        float arg0 = 0;
        ok &= jsval_to_float(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setMinScale : Error processing arguments");
        cobj->setMinScale(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setMinScale : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_getZoomScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_getZoomScale : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getZoomScale();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_getZoomScale : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_getZoomScale : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_updateInset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_updateInset : Invalid Native Object");
    if (argc == 0) {
        cobj->updateInset();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_updateInset : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_initWithViewSize(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_initWithViewSize : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Size arg0;
        cocos2d::Node* arg1 = nullptr;
        ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
        do {
            if (args.get(1).isNull()) { arg1 = nullptr; break; }
            if (!args.get(1).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg1 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_initWithViewSize : Error processing arguments");
        bool ret = cobj->initWithViewSize(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_initWithViewSize : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_initWithViewSize : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_ScrollView_pause(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_pause : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Ref* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Ref*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_pause : Error processing arguments");
        cobj->pause(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_pause : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setDirection(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setDirection : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::ScrollView::Direction arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setDirection : Error processing arguments");
        cobj->setDirection(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setDirection : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_stopAnimatedContentOffset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_stopAnimatedContentOffset : Invalid Native Object");
    if (argc == 0) {
        cobj->stopAnimatedContentOffset();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_stopAnimatedContentOffset : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setContentOffset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setContentOffset : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setContentOffset : Error processing arguments");
        cobj->setContentOffset(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        cocos2d::Vec2 arg0;
        bool arg1;
        ok &= jsval_to_vector2(cx, args.get(0), &arg0);
        ok &= jsval_to_bool(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setContentOffset : Error processing arguments");
        cobj->setContentOffset(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setContentOffset : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_isDragging(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_isDragging : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isDragging();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_isDragging : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_isDragging : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_isTouchEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_isTouchEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isTouchEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_isTouchEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_isTouchEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_isBounceable(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_isBounceable : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isBounceable();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_isBounceable : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_isBounceable : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setTouchEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setTouchEnabled : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setTouchEnabled : Error processing arguments");
        cobj->setTouchEnabled(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setTouchEnabled : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_getContentOffset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_getContentOffset : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Vec2 ret = cobj->getContentOffset();
        JS::RootedValue jsret(cx);
        ok &= vector2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_getContentOffset : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_getContentOffset : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_resume(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_resume : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Ref* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Ref*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_resume : Error processing arguments");
        cobj->resume(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_resume : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setClippingToBounds(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setClippingToBounds : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setClippingToBounds : Error processing arguments");
        cobj->setClippingToBounds(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setClippingToBounds : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setViewSize(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setViewSize : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setViewSize : Error processing arguments");
        cobj->setViewSize(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setViewSize : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_getViewSize(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_getViewSize : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Size ret = cobj->getViewSize();
        JS::RootedValue jsret(cx);
        ok &= ccsize_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_getViewSize : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_getViewSize : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_maxContainerOffset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_maxContainerOffset : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Vec2 ret = cobj->maxContainerOffset();
        JS::RootedValue jsret(cx);
        ok &= vector2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_maxContainerOffset : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_maxContainerOffset : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setBounceable(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setBounceable : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_setBounceable : Error processing arguments");
        cobj->setBounceable(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setBounceable : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_isTouchMoved(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_isTouchMoved : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isTouchMoved();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_isTouchMoved : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_isTouchMoved : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_isNodeVisible(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_isNodeVisible : Invalid Native Object");
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
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_isNodeVisible : Error processing arguments");
        bool ret = cobj->isNodeVisible(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_isNodeVisible : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_isNodeVisible : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_ScrollView_minContainerOffset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_minContainerOffset : Invalid Native Object");
    if (argc == 0) {
        cocos2d::Vec2 ret = cobj->minContainerOffset();
        JS::RootedValue jsret(cx);
        ok &= vector2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_minContainerOffset : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_minContainerOffset : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_ScrollView_setZoomScale(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    cocos2d::extension::ScrollView* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (cocos2d::extension::ScrollView *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_ScrollView_setZoomScale : Invalid Native Object");
    do {
        ok = true;
        if (argc == 2) {
            float arg0 = 0;
            ok &= jsval_to_float(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            bool arg1;
            ok &= jsval_to_bool(cx, args.get(1), &arg1);
            cobj->setZoomScale(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    do {
        ok = true;
        if (argc == 1) {
            float arg0 = 0;
            ok &= jsval_to_float(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cobj->setZoomScale(arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_setZoomScale : arguments error");
    return false;
}
bool js_cocos2dx_extension_ScrollView_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 0) {
            cocos2d::extension::ScrollView* ret = cocos2d::extension::ScrollView::create();
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ScrollView>(cx, (cocos2d::extension::ScrollView*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    
    do {
        bool ok = true; CC_UNUSED_PARAM(ok);
        if (argc == 2) {
            cocos2d::Size arg0;
            ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Node* arg1 = nullptr;
            do {
                if (args.get(1).isNull()) { arg1 = nullptr; break; }
                if (!args.get(1).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg1 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ScrollView* ret = cocos2d::extension::ScrollView::create(arg0, arg1);
            JS::RootedValue jsret(cx, JS::NullHandleValue);
            if (ret) {
                JS::RootedObject jsretObj(cx);
                js_get_or_create_jsobject<cocos2d::extension::ScrollView>(cx, (cocos2d::extension::ScrollView*)ret, &jsretObj);
                jsret = JS::ObjectOrNullValue(jsretObj);
            } else {
                jsret = JS::NullHandleValue;
            };
            JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_ScrollView_create : error parsing return value");
            args.rval().set(jsret);
            return true;
        }
    } while (0);
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_ScrollView_create : wrong number of arguments");
    return false;
}
bool js_cocos2dx_extension_ScrollView_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::ScrollView* cobj = new (std::nothrow) cocos2d::extension::ScrollView();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_ScrollView_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_ScrollView_class, proto, &jsobj, "cocos2d::extension::ScrollView");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}
static bool js_cocos2dx_extension_ScrollView_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    cocos2d::extension::ScrollView *nobj = new (std::nothrow) cocos2d::extension::ScrollView();
    jsb_ref_init(cx, obj, nobj, "cocos2d::extension::ScrollView");
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


extern JS::PersistentRootedObject *jsb_cocos2d_Layer_prototype;

    
void js_register_cocos2dx_extension_ScrollView(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_ScrollView_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_ScrollView_class = {
        "ScrollView",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_ScrollView_classOps
    };
    jsb_cocos2d_extension_ScrollView_class = &cocos2d_extension_ScrollView_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("isClippingToBounds", js_cocos2dx_extension_ScrollView_isClippingToBounds, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setContainer", js_cocos2dx_extension_ScrollView_setContainer, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setContentOffsetInDuration", js_cocos2dx_extension_ScrollView_setContentOffsetInDuration, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setZoomScaleInDuration", js_cocos2dx_extension_ScrollView_setZoomScaleInDuration, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("updateTweenAction", js_cocos2dx_extension_ScrollView_updateTweenAction, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMaxScale", js_cocos2dx_extension_ScrollView_setMaxScale, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("hasVisibleParents", js_cocos2dx_extension_ScrollView_hasVisibleParents, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getDirection", js_cocos2dx_extension_ScrollView_getDirection, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getContainer", js_cocos2dx_extension_ScrollView_getContainer, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setMinScale", js_cocos2dx_extension_ScrollView_setMinScale, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getZoomScale", js_cocos2dx_extension_ScrollView_getZoomScale, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("updateInset", js_cocos2dx_extension_ScrollView_updateInset, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithViewSize", js_cocos2dx_extension_ScrollView_initWithViewSize, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("pause", js_cocos2dx_extension_ScrollView_pause, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setDirection", js_cocos2dx_extension_ScrollView_setDirection, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stopAnimatedContentOffset", js_cocos2dx_extension_ScrollView_stopAnimatedContentOffset, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setContentOffset", js_cocos2dx_extension_ScrollView_setContentOffset, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isDragging", js_cocos2dx_extension_ScrollView_isDragging, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isTouchEnabled", js_cocos2dx_extension_ScrollView_isTouchEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isBounceable", js_cocos2dx_extension_ScrollView_isBounceable, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setTouchEnabled", js_cocos2dx_extension_ScrollView_setTouchEnabled, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getContentOffset", js_cocos2dx_extension_ScrollView_getContentOffset, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("resume", js_cocos2dx_extension_ScrollView_resume, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setClippingToBounds", js_cocos2dx_extension_ScrollView_setClippingToBounds, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setViewSize", js_cocos2dx_extension_ScrollView_setViewSize, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getViewSize", js_cocos2dx_extension_ScrollView_getViewSize, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("maxContainerOffset", js_cocos2dx_extension_ScrollView_maxContainerOffset, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setBounceable", js_cocos2dx_extension_ScrollView_setBounceable, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isTouchMoved", js_cocos2dx_extension_ScrollView_isTouchMoved, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isNodeVisible", js_cocos2dx_extension_ScrollView_isNodeVisible, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("minContainerOffset", js_cocos2dx_extension_ScrollView_minContainerOffset, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setZoomScale", js_cocos2dx_extension_ScrollView_setZoomScale, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_cocos2dx_extension_ScrollView_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_ScrollView_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Layer_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_ScrollView_class,
        js_cocos2dx_extension_ScrollView_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::ScrollView>(cx, jsb_cocos2d_extension_ScrollView_class, proto);
    jsb_cocos2d_extension_ScrollView_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ScrollView", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

JSClass  *jsb_cocos2d_extension_TableViewCell_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_TableViewCell_prototype;

bool js_cocos2dx_extension_TableViewCell_reset(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableViewCell* cobj = (cocos2d::extension::TableViewCell *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableViewCell_reset : Invalid Native Object");
    if (argc == 0) {
        cobj->reset();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableViewCell_reset : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_TableViewCell_getIdx(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableViewCell* cobj = (cocos2d::extension::TableViewCell *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableViewCell_getIdx : Invalid Native Object");
    if (argc == 0) {
        ssize_t ret = cobj->getIdx();
        JS::RootedValue jsret(cx);
        ok &= ssize_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableViewCell_getIdx : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableViewCell_getIdx : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_TableViewCell_setIdx(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableViewCell* cobj = (cocos2d::extension::TableViewCell *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableViewCell_setIdx : Invalid Native Object");
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= jsval_to_ssize(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableViewCell_setIdx : Error processing arguments");
        cobj->setIdx(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableViewCell_setIdx : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_TableViewCell_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        auto ret = cocos2d::extension::TableViewCell::create();
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_extension_TableViewCell_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_cocos2d_extension_TableViewCell_class, proto, &jsret, "cocos2d::extension::TableViewCell");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableViewCell_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_extension_TableViewCell_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::TableViewCell* cobj = new (std::nothrow) cocos2d::extension::TableViewCell();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_TableViewCell_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_TableViewCell_class, proto, &jsobj, "cocos2d::extension::TableViewCell");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}
static bool js_cocos2dx_extension_TableViewCell_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    cocos2d::extension::TableViewCell *nobj = new (std::nothrow) cocos2d::extension::TableViewCell();
    jsb_ref_init(cx, obj, nobj, "cocos2d::extension::TableViewCell");
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

    
void js_register_cocos2dx_extension_TableViewCell(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_TableViewCell_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_TableViewCell_class = {
        "TableViewCell",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_TableViewCell_classOps
    };
    jsb_cocos2d_extension_TableViewCell_class = &cocos2d_extension_TableViewCell_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("reset", js_cocos2dx_extension_TableViewCell_reset, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getIdx", js_cocos2dx_extension_TableViewCell_getIdx, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setIdx", js_cocos2dx_extension_TableViewCell_setIdx, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_cocos2dx_extension_TableViewCell_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_extension_TableViewCell_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Node_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_TableViewCell_class,
        js_cocos2dx_extension_TableViewCell_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::TableViewCell>(cx, jsb_cocos2d_extension_TableViewCell_class, proto);
    jsb_cocos2d_extension_TableViewCell_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "TableViewCell", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

JSClass  *jsb_cocos2d_extension_TableView_class;
JS::PersistentRootedObject *jsb_cocos2d_extension_TableView_prototype;

bool js_cocos2dx_extension_TableView_updateCellAtIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView_updateCellAtIndex : Invalid Native Object");
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= jsval_to_ssize(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_updateCellAtIndex : Error processing arguments");
        cobj->updateCellAtIndex(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView_updateCellAtIndex : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_TableView_setVerticalFillOrder(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView_setVerticalFillOrder : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::TableView::VerticalFillOrder arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_setVerticalFillOrder : Error processing arguments");
        cobj->setVerticalFillOrder(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView_setVerticalFillOrder : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_TableView_scrollViewDidZoom(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView_scrollViewDidZoom : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::ScrollView* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::extension::ScrollView*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_scrollViewDidZoom : Error processing arguments");
        cobj->scrollViewDidZoom(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView_scrollViewDidZoom : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_TableView__updateContentSize(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView__updateContentSize : Invalid Native Object");
    if (argc == 0) {
        cobj->_updateContentSize();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView__updateContentSize : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_TableView_getVerticalFillOrder(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView_getVerticalFillOrder : Invalid Native Object");
    if (argc == 0) {
        int ret = (int)cobj->getVerticalFillOrder();
        JS::RootedValue jsret(cx);
        jsret = JS::Int32Value(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_getVerticalFillOrder : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView_getVerticalFillOrder : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_TableView_removeCellAtIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView_removeCellAtIndex : Invalid Native Object");
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= jsval_to_ssize(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_removeCellAtIndex : Error processing arguments");
        cobj->removeCellAtIndex(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView_removeCellAtIndex : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_TableView_initWithViewSize(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView_initWithViewSize : Invalid Native Object");
    if (argc == 2) {
        cocos2d::Size arg0;
        cocos2d::Node* arg1 = nullptr;
        ok &= jsval_to_ccsize(cx, args.get(0), &arg0);
        do {
            if (args.get(1).isNull()) { arg1 = nullptr; break; }
            if (!args.get(1).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(1).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg1 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg1, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_initWithViewSize : Error processing arguments");
        bool ret = cobj->initWithViewSize(arg0, arg1);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_initWithViewSize : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView_initWithViewSize : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_TableView_scrollViewDidScroll(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView_scrollViewDidScroll : Invalid Native Object");
    if (argc == 1) {
        cocos2d::extension::ScrollView* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::extension::ScrollView*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_scrollViewDidScroll : Error processing arguments");
        cobj->scrollViewDidScroll(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView_scrollViewDidScroll : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_TableView_reloadData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView_reloadData : Invalid Native Object");
    if (argc == 0) {
        cobj->reloadData();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView_reloadData : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_TableView_insertCellAtIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView_insertCellAtIndex : Invalid Native Object");
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= jsval_to_ssize(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_insertCellAtIndex : Error processing arguments");
        cobj->insertCellAtIndex(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView_insertCellAtIndex : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_TableView_cellAtIndex(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView_cellAtIndex : Invalid Native Object");
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= jsval_to_ssize(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_cellAtIndex : Error processing arguments");
        cocos2d::extension::TableViewCell* ret = cobj->cellAtIndex(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::extension::TableViewCell>(cx, (cocos2d::extension::TableViewCell*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_cellAtIndex : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView_cellAtIndex : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_extension_TableView_dequeueCell(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_TableView_dequeueCell : Invalid Native Object");
    if (argc == 0) {
        cocos2d::extension::TableViewCell* ret = cobj->dequeueCell();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<cocos2d::extension::TableViewCell>(cx, (cocos2d::extension::TableViewCell*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_TableView_dequeueCell : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_TableView_dequeueCell : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_extension_TableView_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::extension::TableView* cobj = new (std::nothrow) cocos2d::extension::TableView();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_extension_TableView_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_extension_TableView_class, proto, &jsobj, "cocos2d::extension::TableView");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}
static bool js_cocos2dx_extension_TableView_ctor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    cocos2d::extension::TableView *nobj = new (std::nothrow) cocos2d::extension::TableView();
    jsb_ref_init(cx, obj, nobj, "cocos2d::extension::TableView");
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


extern JS::PersistentRootedObject *jsb_cocos2d_extension_ScrollView_prototype;

    
void js_register_cocos2dx_extension_TableView(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_extension_TableView_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_extension_TableView_class = {
        "TableView",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_extension_TableView_classOps
    };
    jsb_cocos2d_extension_TableView_class = &cocos2d_extension_TableView_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("updateCellAtIndex", js_cocos2dx_extension_TableView_updateCellAtIndex, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setVerticalFillOrder", js_cocos2dx_extension_TableView_setVerticalFillOrder, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("scrollViewDidZoom", js_cocos2dx_extension_TableView_scrollViewDidZoom, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("_updateContentSize", js_cocos2dx_extension_TableView__updateContentSize, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getVerticalFillOrder", js_cocos2dx_extension_TableView_getVerticalFillOrder, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("removeCellAtIndex", js_cocos2dx_extension_TableView_removeCellAtIndex, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initWithViewSize", js_cocos2dx_extension_TableView_initWithViewSize, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("scrollViewDidScroll", js_cocos2dx_extension_TableView_scrollViewDidScroll, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("reloadData", js_cocos2dx_extension_TableView_reloadData, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("insertCellAtIndex", js_cocos2dx_extension_TableView_insertCellAtIndex, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("cellAtIndex", js_cocos2dx_extension_TableView_cellAtIndex, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("dequeueCell", js_cocos2dx_extension_TableView_dequeueCell, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_cocos2dx_extension_TableView_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_extension_ScrollView_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_extension_TableView_class,
        js_cocos2dx_extension_TableView_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::extension::TableView>(cx, jsb_cocos2d_extension_TableView_class, proto);
    jsb_cocos2d_extension_TableView_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "TableView", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    make_class_extend(cx, proto);
}

void register_all_cocos2dx_extension(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "cc", &ns);

    js_register_cocos2dx_extension_AssetsManagerEx(cx, ns);
    js_register_cocos2dx_extension_Control(cx, ns);
    js_register_cocos2dx_extension_ControlHuePicker(cx, ns);
    js_register_cocos2dx_extension_TableViewCell(cx, ns);
    js_register_cocos2dx_extension_ControlStepper(cx, ns);
    js_register_cocos2dx_extension_ControlColourPicker(cx, ns);
    js_register_cocos2dx_extension_ControlButton(cx, ns);
    js_register_cocos2dx_extension_ControlSlider(cx, ns);
    js_register_cocos2dx_extension_ScrollView(cx, ns);
    js_register_cocos2dx_extension_Manifest(cx, ns);
    js_register_cocos2dx_extension_ControlPotentiometer(cx, ns);
    js_register_cocos2dx_extension_EventListenerAssetsManagerEx(cx, ns);
    js_register_cocos2dx_extension_TableView(cx, ns);
    js_register_cocos2dx_extension_EventAssetsManagerEx(cx, ns);
    js_register_cocos2dx_extension_ControlSwitch(cx, ns);
    js_register_cocos2dx_extension_ControlSaturationBrightnessPicker(cx, ns);
}

