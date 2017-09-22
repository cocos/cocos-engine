#include "jsb_anysdk_protocols_auto.hpp"
#include "jsb_anysdk_basic_conversions.h"
using namespace anysdk;
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "PluginManager.h"
#include "ProtocolAnalytics.h"
#include "ProtocolYAP.h"
#include "ProtocolAds.h"
#include "ProtocolShare.h"
#include "ProtocolSocial.h"
#include "ProtocolUser.h"
#include "ProtocolPush.h"
#include "ProtocolCrash.h"
#include "ProtocolREC.h"
#include "ProtocolCustom.h"
#include "AgentManager.h"
#include "JSBRelation.h"
#include "ProtocolAdTracking.h"

JSClass  *jsb_anysdk_framework_PluginProtocol_class;
JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

bool js_anysdk_framework_PluginProtocol_isFunctionSupported(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginProtocol* cobj = (anysdk::framework::PluginProtocol *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_PluginProtocol_isFunctionSupported : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginProtocol_isFunctionSupported : Error processing arguments");
        bool ret = cobj->isFunctionSupported(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginProtocol_isFunctionSupported : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_PluginProtocol_isFunctionSupported : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_PluginProtocol_getPluginName(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginProtocol* cobj = (anysdk::framework::PluginProtocol *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_PluginProtocol_getPluginName : Invalid Native Object");
    if (argc == 0) {
        const char* ret = cobj->getPluginName();
        JS::RootedValue jsret(cx);
        ok &= c_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginProtocol_getPluginName : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_PluginProtocol_getPluginName : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_PluginProtocol_getPluginVersion(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginProtocol* cobj = (anysdk::framework::PluginProtocol *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_PluginProtocol_getPluginVersion : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getPluginVersion();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginProtocol_getPluginVersion : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_PluginProtocol_getPluginVersion : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_PluginProtocol_setPluginName(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginProtocol* cobj = (anysdk::framework::PluginProtocol *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_PluginProtocol_setPluginName : Invalid Native Object");
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginProtocol_setPluginName : Error processing arguments");
        cobj->setPluginName(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_PluginProtocol_setPluginName : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_PluginProtocol_getSDKVersion(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginProtocol* cobj = (anysdk::framework::PluginProtocol *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_PluginProtocol_getSDKVersion : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getSDKVersion();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginProtocol_getSDKVersion : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_PluginProtocol_getSDKVersion : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

void js_register_anysdk_framework_PluginProtocol(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_PluginProtocol_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_PluginProtocol_class = {
        "PluginProtocol",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_PluginProtocol_classOps
    };
    jsb_anysdk_framework_PluginProtocol_class = &anysdk_framework_PluginProtocol_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("isFunctionSupported", js_anysdk_framework_PluginProtocol_isFunctionSupported, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getPluginName", js_anysdk_framework_PluginProtocol_getPluginName, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getPluginVersion", js_anysdk_framework_PluginProtocol_getPluginVersion, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setPluginName", js_anysdk_framework_PluginProtocol_setPluginName, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSDKVersion", js_anysdk_framework_PluginProtocol_getSDKVersion, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, nullptr);
    jsb_anysdk_framework_PluginProtocol_prototype = JS_InitClass(
                                                                 cx, global,
                                                                 parent_proto,
                                                                 jsb_anysdk_framework_PluginProtocol_class,
                                                                 empty_constructor, 0,
                                                                 nullptr,
                                                                 funcs,
                                                                 nullptr,
                                                                 nullptr);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PluginProtocol", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::PluginProtocol>(cx, jsb_anysdk_framework_PluginProtocol_class, proto);
}

JSClass  *jsb_anysdk_framework_PluginFactory_class;
JSObject *jsb_anysdk_framework_PluginFactory_prototype;

bool js_anysdk_framework_PluginFactory_purgeFactory(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        anysdk::framework::PluginFactory::purgeFactory();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_PluginFactory_purgeFactory : wrong number of arguments");
    return false;
}

bool js_anysdk_framework_PluginFactory_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {
        
        anysdk::framework::PluginFactory* ret = anysdk::framework::PluginFactory::getInstance();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::PluginFactory>(cx, (anysdk::framework::PluginFactory*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginFactory_getInstance : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_PluginFactory_getInstance : wrong number of arguments");
    return false;
}


void js_register_anysdk_framework_PluginFactory(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_PluginFactory_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_PluginFactory_class = {
        "PluginFactory",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_PluginFactory_classOps
    };
    jsb_anysdk_framework_PluginFactory_class = &anysdk_framework_PluginFactory_class;
    
    static JSFunctionSpec st_funcs[] = {
        JS_FN("purgeFactory", js_anysdk_framework_PluginFactory_purgeFactory, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getInstance", js_anysdk_framework_PluginFactory_getInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, nullptr);
    jsb_anysdk_framework_PluginFactory_prototype = JS_InitClass(
                                                                cx, global,
                                                                parent_proto,
                                                                jsb_anysdk_framework_PluginFactory_class,
                                                                empty_constructor, 0,
                                                                nullptr,
                                                                nullptr,
                                                                nullptr,
                                                                st_funcs);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_PluginFactory_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PluginFactory", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::PluginFactory>(cx, jsb_anysdk_framework_PluginFactory_class, proto);
}

JSClass  *jsb_anysdk_framework_PluginManager_class;
JSObject *jsb_anysdk_framework_PluginManager_prototype;

bool js_anysdk_framework_PluginManager_unloadPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginManager* cobj = (anysdk::framework::PluginManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_PluginManager_unloadPlugin : Invalid Native Object");
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginManager_unloadPlugin : Error processing arguments");
        cobj->unloadPlugin(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        const char* arg0 = nullptr;
        int arg1 = 0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginManager_unloadPlugin : Error processing arguments");
        cobj->unloadPlugin(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_PluginManager_unloadPlugin : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_PluginManager_loadPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginManager* cobj = (anysdk::framework::PluginManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_PluginManager_loadPlugin : Invalid Native Object");
    if (argc == 2) {
        const char* arg0 = nullptr;
        int arg1 = 0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginManager_loadPlugin : Error processing arguments");
        anysdk::framework::PluginProtocol* ret = cobj->loadPlugin(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::PluginProtocol>(cx, (anysdk::framework::PluginProtocol*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginManager_loadPlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_PluginManager_loadPlugin : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_anysdk_framework_PluginManager_end(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        anysdk::framework::PluginManager::end();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_PluginManager_end : wrong number of arguments");
    return false;
}

bool js_anysdk_framework_PluginManager_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {
        
        anysdk::framework::PluginManager* ret = anysdk::framework::PluginManager::getInstance();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::PluginManager>(cx, (anysdk::framework::PluginManager*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_PluginManager_getInstance : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_PluginManager_getInstance : wrong number of arguments");
    return false;
}


void js_register_anysdk_framework_PluginManager(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_PluginManager_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_PluginManager_class = {
        "PluginManager",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_PluginManager_classOps
    };
    jsb_anysdk_framework_PluginManager_class = &anysdk_framework_PluginManager_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("unloadPlugin", js_anysdk_framework_PluginManager_unloadPlugin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("loadPlugin", js_anysdk_framework_PluginManager_loadPlugin, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    static JSFunctionSpec st_funcs[] = {
        JS_FN("end", js_anysdk_framework_PluginManager_end, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getInstance", js_anysdk_framework_PluginManager_getInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, nullptr);
    jsb_anysdk_framework_PluginManager_prototype = JS_InitClass(
                                                                cx, global,
                                                                parent_proto,
                                                                jsb_anysdk_framework_PluginManager_class,
                                                                empty_constructor, 0,
                                                                nullptr,
                                                                funcs,
                                                                nullptr,
                                                                st_funcs);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_PluginManager_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PluginManager", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::PluginManager>(cx, jsb_anysdk_framework_PluginManager_class, proto);
}

JSClass  *jsb_anysdk_framework_ProtocolAnalytics_class;
JSObject *jsb_anysdk_framework_ProtocolAnalytics_prototype;

bool js_anysdk_framework_ProtocolAnalytics_logTimedEventBegin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAnalytics_logTimedEventBegin : Invalid Native Object");
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAnalytics_logTimedEventBegin : Error processing arguments");
        cobj->logTimedEventBegin(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAnalytics_logTimedEventBegin : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolAnalytics_logError(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAnalytics_logError : Invalid Native Object");
    if (argc == 2) {
        const char* arg0 = nullptr;
        const char* arg1 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAnalytics_logError : Error processing arguments");
        cobj->logError(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAnalytics_logError : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_anysdk_framework_ProtocolAnalytics_setCaptureUncaughtException(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAnalytics_setCaptureUncaughtException : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAnalytics_setCaptureUncaughtException : Error processing arguments");
        cobj->setCaptureUncaughtException(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAnalytics_setCaptureUncaughtException : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolAnalytics_setSessionContinueMillis(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAnalytics_setSessionContinueMillis : Invalid Native Object");
    if (argc == 1) {
        long arg0 = 0;
        ok &= jsval_to_long(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAnalytics_setSessionContinueMillis : Error processing arguments");
        cobj->setSessionContinueMillis(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAnalytics_setSessionContinueMillis : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolAnalytics_startSession(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAnalytics_startSession : Invalid Native Object");
    if (argc == 0) {
        cobj->startSession();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAnalytics_startSession : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolAnalytics_stopSession(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAnalytics_stopSession : Invalid Native Object");
    if (argc == 0) {
        cobj->stopSession();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAnalytics_stopSession : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolAnalytics_logTimedEventEnd(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAnalytics_logTimedEventEnd : Invalid Native Object");
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAnalytics_logTimedEventEnd : Error processing arguments");
        cobj->logTimedEventEnd(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAnalytics_logTimedEventEnd : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

void js_register_anysdk_framework_ProtocolAnalytics(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_ProtocolAnalytics_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_ProtocolAnalytics_class = {
        "ProtocolAnalytics",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_ProtocolAnalytics_classOps
    };
    jsb_anysdk_framework_ProtocolAnalytics_class = &anysdk_framework_ProtocolAnalytics_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("logTimedEventBegin", js_anysdk_framework_ProtocolAnalytics_logTimedEventBegin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("logError", js_anysdk_framework_ProtocolAnalytics_logError, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setCaptureUncaughtException", js_anysdk_framework_ProtocolAnalytics_setCaptureUncaughtException, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setSessionContinueMillis", js_anysdk_framework_ProtocolAnalytics_setSessionContinueMillis, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("startSession", js_anysdk_framework_ProtocolAnalytics_startSession, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stopSession", js_anysdk_framework_ProtocolAnalytics_stopSession, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("logTimedEventEnd", js_anysdk_framework_ProtocolAnalytics_logTimedEventEnd, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_ProtocolAnalytics_prototype = JS_InitClass(
                                                                    cx, global,
                                                                    parent_proto,
                                                                    jsb_anysdk_framework_ProtocolAnalytics_class,
                                                                    empty_constructor, 0,
                                                                    nullptr,
                                                                    funcs,
                                                                    nullptr,
                                                                    nullptr);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_ProtocolAnalytics_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ProtocolAnalytics", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::ProtocolAnalytics>(cx, jsb_anysdk_framework_ProtocolAnalytics_class, proto);
}

JSClass  *jsb_anysdk_framework_ProtocolYAP_class;
JSObject *jsb_anysdk_framework_ProtocolYAP_prototype;

bool js_anysdk_framework_ProtocolYAP_getPluginId(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolYAP* cobj = (anysdk::framework::ProtocolYAP *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolYAP_getPluginId : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getPluginId();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolYAP_getPluginId : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolYAP_getPluginId : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolYAP_getOrderId(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolYAP* cobj = (anysdk::framework::ProtocolYAP *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolYAP_getOrderId : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getOrderId();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolYAP_getOrderId : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolYAP_getOrderId : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolYAP_resetYapState(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        anysdk::framework::ProtocolYAP::resetYapState();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolYAP_resetYapState : wrong number of arguments");
    return false;
}


extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

void js_register_anysdk_framework_ProtocolYAP(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_ProtocolYAP_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_ProtocolYAP_class = {
        "ProtocolYAP",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_ProtocolYAP_classOps
    };
    jsb_anysdk_framework_ProtocolYAP_class = &anysdk_framework_ProtocolYAP_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("getPluginId", js_anysdk_framework_ProtocolYAP_getPluginId, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getOrderId", js_anysdk_framework_ProtocolYAP_getOrderId, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    static JSFunctionSpec st_funcs[] = {
        JS_FN("resetYapState", js_anysdk_framework_ProtocolYAP_resetYapState, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_ProtocolYAP_prototype = JS_InitClass(
                                                              cx, global,
                                                              parent_proto,
                                                              jsb_anysdk_framework_ProtocolYAP_class,
                                                              empty_constructor, 0,
                                                              nullptr,
                                                              funcs,
                                                              nullptr,
                                                              st_funcs);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_ProtocolYAP_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ProtocolYAP", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::ProtocolYAP>(cx, jsb_anysdk_framework_ProtocolYAP_class, proto);
}

JSClass  *jsb_anysdk_framework_ProtocolAds_class;
JSObject *jsb_anysdk_framework_ProtocolAds_prototype;

bool js_anysdk_framework_ProtocolAds_showAds(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAds_showAds : Invalid Native Object");
    if (argc == 1) {
        anysdk::framework::AdsType arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAds_showAds : Error processing arguments");
        cobj->showAds(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        anysdk::framework::AdsType arg0;
        int arg1 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAds_showAds : Error processing arguments");
        cobj->showAds(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAds_showAds : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolAds_hideAds(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAds_hideAds : Invalid Native Object");
    if (argc == 1) {
        anysdk::framework::AdsType arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAds_hideAds : Error processing arguments");
        cobj->hideAds(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        anysdk::framework::AdsType arg0;
        int arg1 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAds_hideAds : Error processing arguments");
        cobj->hideAds(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAds_hideAds : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolAds_queryPoints(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAds_queryPoints : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->queryPoints();
        JS::RootedValue jsret(cx);
        jsret = JS::NumberValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAds_queryPoints : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAds_queryPoints : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolAds_isAdTypeSupported(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAds_isAdTypeSupported : Invalid Native Object");
    if (argc == 1) {
        anysdk::framework::AdsType arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAds_isAdTypeSupported : Error processing arguments");
        bool ret = cobj->isAdTypeSupported(arg0);
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAds_isAdTypeSupported : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAds_isAdTypeSupported : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolAds_preloadAds(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAds_preloadAds : Invalid Native Object");
    if (argc == 1) {
        anysdk::framework::AdsType arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAds_preloadAds : Error processing arguments");
        cobj->preloadAds(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        anysdk::framework::AdsType arg0;
        int arg1 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAds_preloadAds : Error processing arguments");
        cobj->preloadAds(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAds_preloadAds : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolAds_spendPoints(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAds_spendPoints : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAds_spendPoints : Error processing arguments");
        cobj->spendPoints(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAds_spendPoints : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

void js_register_anysdk_framework_ProtocolAds(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_ProtocolAds_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_ProtocolAds_class = {
        "ProtocolAds",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_ProtocolAds_classOps
    };
    jsb_anysdk_framework_ProtocolAds_class = &anysdk_framework_ProtocolAds_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("showAds", js_anysdk_framework_ProtocolAds_showAds, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("hideAds", js_anysdk_framework_ProtocolAds_hideAds, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("queryPoints", js_anysdk_framework_ProtocolAds_queryPoints, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isAdTypeSupported", js_anysdk_framework_ProtocolAds_isAdTypeSupported, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("preloadAds", js_anysdk_framework_ProtocolAds_preloadAds, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("spendPoints", js_anysdk_framework_ProtocolAds_spendPoints, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_ProtocolAds_prototype = JS_InitClass(
                                                              cx, global,
                                                              parent_proto,
                                                              jsb_anysdk_framework_ProtocolAds_class,
                                                              empty_constructor, 0,
                                                              nullptr,
                                                              funcs,
                                                              nullptr,
                                                              nullptr);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_ProtocolAds_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ProtocolAds", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::ProtocolAds>(cx, jsb_anysdk_framework_ProtocolAds_class, proto);
}

JSClass  *jsb_anysdk_framework_ProtocolSocial_class;
JSObject *jsb_anysdk_framework_ProtocolSocial_prototype;

bool js_anysdk_framework_ProtocolSocial_showLeaderboard(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolSocial* cobj = (anysdk::framework::ProtocolSocial *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolSocial_showLeaderboard : Invalid Native Object");
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolSocial_showLeaderboard : Error processing arguments");
        cobj->showLeaderboard(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolSocial_showLeaderboard : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolSocial_signOut(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolSocial* cobj = (anysdk::framework::ProtocolSocial *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolSocial_signOut : Invalid Native Object");
    if (argc == 0) {
        cobj->signOut();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolSocial_signOut : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolSocial_showAchievements(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolSocial* cobj = (anysdk::framework::ProtocolSocial *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolSocial_showAchievements : Invalid Native Object");
    if (argc == 0) {
        cobj->showAchievements();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolSocial_showAchievements : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolSocial_signIn(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolSocial* cobj = (anysdk::framework::ProtocolSocial *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolSocial_signIn : Invalid Native Object");
    if (argc == 0) {
        cobj->signIn();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolSocial_signIn : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolSocial_submitScore(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolSocial* cobj = (anysdk::framework::ProtocolSocial *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolSocial_submitScore : Invalid Native Object");
    if (argc == 2) {
        const char* arg0 = nullptr;
        long arg1 = 0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= jsval_to_long(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolSocial_submitScore : Error processing arguments");
        cobj->submitScore(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolSocial_submitScore : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

void js_register_anysdk_framework_ProtocolSocial(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_ProtocolSocial_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_ProtocolSocial_class = {
        "ProtocolSocial",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_ProtocolSocial_classOps
    };
    jsb_anysdk_framework_ProtocolSocial_class = &anysdk_framework_ProtocolSocial_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("showLeaderboard", js_anysdk_framework_ProtocolSocial_showLeaderboard, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("signOut", js_anysdk_framework_ProtocolSocial_signOut, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("showAchievements", js_anysdk_framework_ProtocolSocial_showAchievements, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("signIn", js_anysdk_framework_ProtocolSocial_signIn, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("submitScore", js_anysdk_framework_ProtocolSocial_submitScore, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_ProtocolSocial_prototype = JS_InitClass(
                                                                 cx, global,
                                                                 parent_proto,
                                                                 jsb_anysdk_framework_ProtocolSocial_class,
                                                                 empty_constructor, 0,
                                                                 nullptr,
                                                                 funcs,
                                                                 nullptr,
                                                                 nullptr);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_ProtocolSocial_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ProtocolSocial", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::ProtocolSocial>(cx, jsb_anysdk_framework_ProtocolSocial_class, proto);
}

JSClass  *jsb_anysdk_framework_ProtocolUser_class;
JSObject *jsb_anysdk_framework_ProtocolUser_prototype;

bool js_anysdk_framework_ProtocolUser_isLogined(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolUser* cobj = (anysdk::framework::ProtocolUser *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolUser_isLogined : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isLogined();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolUser_isLogined : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolUser_isLogined : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolUser_getUserID(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolUser* cobj = (anysdk::framework::ProtocolUser *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolUser_getUserID : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getUserID();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolUser_getUserID : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolUser_getUserID : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolUser_login(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    anysdk::framework::ProtocolUser* cobj = nullptr;
    
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (anysdk::framework::ProtocolUser *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolUser_login : Invalid Native Object");
    do {
        ok = true;
        if (argc == 1) {
            std::map<std::string, std::string> arg0;
            ok &= jsval_to_std_map_string_string(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cobj->login(arg0);
            args.rval().setUndefined();
            return true;
        }
    } while(0);
    
    do {
        ok = true;
        if (argc == 0) {
            cobj->login();
            args.rval().setUndefined();
            return true;
        }
    } while(0);
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolUser_login : arguments error");
    return false;
}
bool js_anysdk_framework_ProtocolUser_getPluginId(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolUser* cobj = (anysdk::framework::ProtocolUser *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolUser_getPluginId : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getPluginId();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolUser_getPluginId : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolUser_getPluginId : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

void js_register_anysdk_framework_ProtocolUser(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_ProtocolUser_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_ProtocolUser_class = {
        "ProtocolUser",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_ProtocolUser_classOps
    };
    jsb_anysdk_framework_ProtocolUser_class = &anysdk_framework_ProtocolUser_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("isLogined", js_anysdk_framework_ProtocolUser_isLogined, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getUserID", js_anysdk_framework_ProtocolUser_getUserID, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("login", js_anysdk_framework_ProtocolUser_login, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getPluginId", js_anysdk_framework_ProtocolUser_getPluginId, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_ProtocolUser_prototype = JS_InitClass(
                                                               cx, global,
                                                               parent_proto,
                                                               jsb_anysdk_framework_ProtocolUser_class,
                                                               empty_constructor, 0,
                                                               nullptr,
                                                               funcs,
                                                               nullptr,
                                                               nullptr);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_ProtocolUser_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ProtocolUser", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::ProtocolUser>(cx, jsb_anysdk_framework_ProtocolUser_class, proto);
}

JSClass  *jsb_anysdk_framework_ProtocolPush_class;
JSObject *jsb_anysdk_framework_ProtocolPush_prototype;

bool js_anysdk_framework_ProtocolPush_startPush(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolPush* cobj = (anysdk::framework::ProtocolPush *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolPush_startPush : Invalid Native Object");
    if (argc == 0) {
        cobj->startPush();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolPush_startPush : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolPush_closePush(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolPush* cobj = (anysdk::framework::ProtocolPush *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolPush_closePush : Invalid Native Object");
    if (argc == 0) {
        cobj->closePush();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolPush_closePush : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolPush_delAlias(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolPush* cobj = (anysdk::framework::ProtocolPush *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolPush_delAlias : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolPush_delAlias : Error processing arguments");
        cobj->delAlias(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolPush_delAlias : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolPush_setAlias(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolPush* cobj = (anysdk::framework::ProtocolPush *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolPush_setAlias : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolPush_setAlias : Error processing arguments");
        cobj->setAlias(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolPush_setAlias : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

void js_register_anysdk_framework_ProtocolPush(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_ProtocolPush_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_ProtocolPush_class = {
        "ProtocolPush",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_ProtocolPush_classOps
    };
    jsb_anysdk_framework_ProtocolPush_class = &anysdk_framework_ProtocolPush_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("startPush", js_anysdk_framework_ProtocolPush_startPush, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("closePush", js_anysdk_framework_ProtocolPush_closePush, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("delAlias", js_anysdk_framework_ProtocolPush_delAlias, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setAlias", js_anysdk_framework_ProtocolPush_setAlias, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_ProtocolPush_prototype = JS_InitClass(
                                                               cx, global,
                                                               parent_proto,
                                                               jsb_anysdk_framework_ProtocolPush_class,
                                                               empty_constructor, 0,
                                                               nullptr,
                                                               funcs,
                                                               nullptr,
                                                               nullptr);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_ProtocolPush_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ProtocolPush", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::ProtocolPush>(cx, jsb_anysdk_framework_ProtocolPush_class, proto);
}

JSClass  *jsb_anysdk_framework_ProtocolCrash_class;
JSObject *jsb_anysdk_framework_ProtocolCrash_prototype;

bool js_anysdk_framework_ProtocolCrash_setUserIdentifier(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolCrash* cobj = (anysdk::framework::ProtocolCrash *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolCrash_setUserIdentifier : Invalid Native Object");
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolCrash_setUserIdentifier : Error processing arguments");
        cobj->setUserIdentifier(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolCrash_setUserIdentifier : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolCrash_reportException(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolCrash* cobj = (anysdk::framework::ProtocolCrash *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolCrash_reportException : Invalid Native Object");
    if (argc == 2) {
        const char* arg0 = nullptr;
        const char* arg1 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolCrash_reportException : Error processing arguments");
        cobj->reportException(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolCrash_reportException : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_anysdk_framework_ProtocolCrash_leaveBreadcrumb(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolCrash* cobj = (anysdk::framework::ProtocolCrash *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolCrash_leaveBreadcrumb : Invalid Native Object");
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolCrash_leaveBreadcrumb : Error processing arguments");
        cobj->leaveBreadcrumb(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolCrash_leaveBreadcrumb : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

void js_register_anysdk_framework_ProtocolCrash(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_ProtocolCrash_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_ProtocolCrash_class = {
        "ProtocolCrash",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_ProtocolCrash_classOps
    };
    jsb_anysdk_framework_ProtocolCrash_class = &anysdk_framework_ProtocolCrash_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("setUserIdentifier", js_anysdk_framework_ProtocolCrash_setUserIdentifier, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("reportException", js_anysdk_framework_ProtocolCrash_reportException, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("leaveBreadcrumb", js_anysdk_framework_ProtocolCrash_leaveBreadcrumb, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_ProtocolCrash_prototype = JS_InitClass(
                                                                cx, global,
                                                                parent_proto,
                                                                jsb_anysdk_framework_ProtocolCrash_class,
                                                                empty_constructor, 0,
                                                                nullptr,
                                                                funcs,
                                                                nullptr,
                                                                nullptr);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_ProtocolCrash_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ProtocolCrash", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::ProtocolCrash>(cx, jsb_anysdk_framework_ProtocolCrash_class, proto);
}

JSClass  *jsb_anysdk_framework_ProtocolREC_class;
JSObject *jsb_anysdk_framework_ProtocolREC_prototype;

bool js_anysdk_framework_ProtocolREC_share(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolREC* cobj = (anysdk::framework::ProtocolREC *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolREC_share : Invalid Native Object");
    if (argc == 1) {
        std::map<std::string, std::string> arg0;
        ok &= jsval_to_std_map_string_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolREC_share : Error processing arguments");
        cobj->share(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolREC_share : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolREC_startRecording(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolREC* cobj = (anysdk::framework::ProtocolREC *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolREC_startRecording : Invalid Native Object");
    if (argc == 0) {
        cobj->startRecording();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolREC_startRecording : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_ProtocolREC_stopRecording(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolREC* cobj = (anysdk::framework::ProtocolREC *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolREC_stopRecording : Invalid Native Object");
    if (argc == 0) {
        cobj->stopRecording();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolREC_stopRecording : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

void js_register_anysdk_framework_ProtocolREC(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_ProtocolREC_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_ProtocolREC_class = {
        "ProtocolREC",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_ProtocolREC_classOps
    };
    jsb_anysdk_framework_ProtocolREC_class = &anysdk_framework_ProtocolREC_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("share", js_anysdk_framework_ProtocolREC_share, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("startRecording", js_anysdk_framework_ProtocolREC_startRecording, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stopRecording", js_anysdk_framework_ProtocolREC_stopRecording, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_ProtocolREC_prototype = JS_InitClass(
                                                              cx, global,
                                                              parent_proto,
                                                              jsb_anysdk_framework_ProtocolREC_class,
                                                              empty_constructor, 0,
                                                              nullptr,
                                                              funcs,
                                                              nullptr,
                                                              nullptr);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_ProtocolREC_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ProtocolREC", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::ProtocolREC>(cx, jsb_anysdk_framework_ProtocolREC_class, proto);
}

JSClass  *jsb_anysdk_framework_ProtocolCustom_class;
JSObject *jsb_anysdk_framework_ProtocolCustom_prototype;


extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

void js_register_anysdk_framework_ProtocolCustom(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_ProtocolCustom_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_ProtocolCustom_class = {
        "ProtocolCustom",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_ProtocolCustom_classOps
    };
    jsb_anysdk_framework_ProtocolCustom_class = &anysdk_framework_ProtocolCustom_class;
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_ProtocolCustom_prototype = JS_InitClass(
                                                                 cx, global,
                                                                 parent_proto,
                                                                 jsb_anysdk_framework_ProtocolCustom_class,
                                                                 empty_constructor, 0,
                                                                 nullptr,
                                                                 nullptr,
                                                                 nullptr,
                                                                 nullptr);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_ProtocolCustom_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ProtocolCustom", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::ProtocolCustom>(cx, jsb_anysdk_framework_ProtocolCustom_class, proto);
}

JSClass  *jsb_anysdk_framework_ProtocolAdTracking_class;
JSObject *jsb_anysdk_framework_ProtocolAdTracking_prototype;

bool js_anysdk_framework_ProtocolAdTracking_onYap(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAdTracking* cobj = (anysdk::framework::ProtocolAdTracking *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAdTracking_onYap : Invalid Native Object");
    if (argc == 1) {
        std::map<std::string, std::string> arg0;
        ok &= jsval_to_std_map_string_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAdTracking_onYap : Error processing arguments");
        cobj->onYap(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAdTracking_onYap : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolAdTracking_onLogin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAdTracking* cobj = (anysdk::framework::ProtocolAdTracking *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAdTracking_onLogin : Invalid Native Object");
    if (argc == 1) {
        std::map<std::string, std::string> arg0;
        ok &= jsval_to_std_map_string_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAdTracking_onLogin : Error processing arguments");
        cobj->onLogin(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAdTracking_onLogin : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_ProtocolAdTracking_onRegister(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::ProtocolAdTracking* cobj = (anysdk::framework::ProtocolAdTracking *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_ProtocolAdTracking_onRegister : Invalid Native Object");
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_ProtocolAdTracking_onRegister : Error processing arguments");
        cobj->onRegister(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_ProtocolAdTracking_onRegister : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

void js_register_anysdk_framework_ProtocolAdTracking(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_ProtocolAdTracking_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_ProtocolAdTracking_class = {
        "ProtocolAdTracking",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_ProtocolAdTracking_classOps
    };
    jsb_anysdk_framework_ProtocolAdTracking_class = &anysdk_framework_ProtocolAdTracking_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("onYap", js_anysdk_framework_ProtocolAdTracking_onYap, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("onLogin", js_anysdk_framework_ProtocolAdTracking_onLogin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("onRegister", js_anysdk_framework_ProtocolAdTracking_onRegister, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_ProtocolAdTracking_prototype = JS_InitClass(
                                                                     cx, global,
                                                                     parent_proto,
                                                                     jsb_anysdk_framework_ProtocolAdTracking_class,
                                                                     dummy_constructor<anysdk::framework::ProtocolAdTracking>, 0,
                                                                     nullptr,
                                                                     funcs,
                                                                     nullptr,
                                                                     nullptr);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_ProtocolAdTracking_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ProtocolAdTracking", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::ProtocolAdTracking>(cx, jsb_anysdk_framework_ProtocolAdTracking_class, proto);
}

JSClass  *jsb_anysdk_framework_AgentManager_class;
JSObject *jsb_anysdk_framework_AgentManager_prototype;

bool js_anysdk_framework_AgentManager_unloadAllPlugins(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_unloadAllPlugins : Invalid Native Object");
    if (argc == 0) {
        cobj->unloadAllPlugins();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_unloadAllPlugins : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_getSocialPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getSocialPlugin : Invalid Native Object");
    if (argc == 0) {
        anysdk::framework::ProtocolSocial* ret = cobj->getSocialPlugin();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::ProtocolSocial>(cx, (anysdk::framework::ProtocolSocial*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getSocialPlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getSocialPlugin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_getPushPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getPushPlugin : Invalid Native Object");
    if (argc == 0) {
        anysdk::framework::ProtocolPush* ret = cobj->getPushPlugin();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::ProtocolPush>(cx, (anysdk::framework::ProtocolPush*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getPushPlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getPushPlugin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_getUserPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getUserPlugin : Invalid Native Object");
    if (argc == 0) {
        anysdk::framework::ProtocolUser* ret = cobj->getUserPlugin();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::ProtocolUser>(cx, (anysdk::framework::ProtocolUser*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getUserPlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getUserPlugin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_getAdTrackingPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getAdTrackingPlugin : Invalid Native Object");
    if (argc == 0) {
        anysdk::framework::ProtocolAdTracking* ret = cobj->getAdTrackingPlugin();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::ProtocolAdTracking>(cx, (anysdk::framework::ProtocolAdTracking*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getAdTrackingPlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getAdTrackingPlugin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_getCustomPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getCustomPlugin : Invalid Native Object");
    if (argc == 0) {
        anysdk::framework::ProtocolCustom* ret = cobj->getCustomPlugin();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::ProtocolCustom>(cx, (anysdk::framework::ProtocolCustom*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getCustomPlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getCustomPlugin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_getCustomParam(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getCustomParam : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getCustomParam();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getCustomParam : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getCustomParam : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_loadAllPlugins(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_loadAllPlugins : Invalid Native Object");
    if (argc == 0) {
        cobj->loadAllPlugins();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_loadAllPlugins : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_init(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_init : Invalid Native Object");
    if (argc == 4) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        std::string arg3;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        ok &= jsval_to_std_string(cx, args.get(2), &arg2);
        ok &= jsval_to_std_string(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_init : Error processing arguments");
        cobj->init(arg0, arg1, arg2, arg3);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_init : wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
bool js_anysdk_framework_AgentManager_isAnaylticsEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_isAnaylticsEnabled : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->isAnaylticsEnabled();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_isAnaylticsEnabled : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_isAnaylticsEnabled : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_getChannelId(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getChannelId : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getChannelId();
        JS::RootedValue jsret(cx);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getChannelId : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getChannelId : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_getAdsPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getAdsPlugin : Invalid Native Object");
    if (argc == 0) {
        anysdk::framework::ProtocolAds* ret = cobj->getAdsPlugin();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::ProtocolAds>(cx, (anysdk::framework::ProtocolAds*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getAdsPlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getAdsPlugin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_setIsAnaylticsEnabled(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_setIsAnaylticsEnabled : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_setIsAnaylticsEnabled : Error processing arguments");
        cobj->setIsAnaylticsEnabled(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_setIsAnaylticsEnabled : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_anysdk_framework_AgentManager_getSharePlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getSharePlugin : Invalid Native Object");
    if (argc == 0) {
        anysdk::framework::ProtocolShare* ret = cobj->getSharePlugin();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::ProtocolShare>(cx, (anysdk::framework::ProtocolShare*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getSharePlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getSharePlugin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_getAnalyticsPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getAnalyticsPlugin : Invalid Native Object");
    if (argc == 0) {
        anysdk::framework::ProtocolAnalytics* ret = cobj->getAnalyticsPlugin();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::ProtocolAnalytics>(cx, (anysdk::framework::ProtocolAnalytics*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getAnalyticsPlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getAnalyticsPlugin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_getRECPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getRECPlugin : Invalid Native Object");
    if (argc == 0) {
        anysdk::framework::ProtocolREC* ret = cobj->getRECPlugin();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::ProtocolREC>(cx, (anysdk::framework::ProtocolREC*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getRECPlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getRECPlugin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_getCrashPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_anysdk_framework_AgentManager_getCrashPlugin : Invalid Native Object");
    if (argc == 0) {
        anysdk::framework::ProtocolCrash* ret = cobj->getCrashPlugin();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::ProtocolCrash>(cx, (anysdk::framework::ProtocolCrash*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getCrashPlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getCrashPlugin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_anysdk_framework_AgentManager_end(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        anysdk::framework::AgentManager::end();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_end : wrong number of arguments");
    return false;
}

bool js_anysdk_framework_AgentManager_getInstance(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {
        
        anysdk::framework::AgentManager* ret = anysdk::framework::AgentManager::getInstance();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        if (ret) {
            JS::RootedObject jsretObj(cx);
            js_get_or_create_jsobject<anysdk::framework::AgentManager>(cx, (anysdk::framework::AgentManager*)ret, &jsretObj);
            jsret = JS::ObjectOrNullValue(jsretObj);
        } else {
            jsret = JS::NullHandleValue;
        };
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_AgentManager_getInstance : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_AgentManager_getInstance : wrong number of arguments");
    return false;
}


void js_register_anysdk_framework_AgentManager(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_AgentManager_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_AgentManager_class = {
        "AgentManager",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_AgentManager_classOps
    };
    jsb_anysdk_framework_AgentManager_class = &anysdk_framework_AgentManager_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("unloadAllPlugins", js_anysdk_framework_AgentManager_unloadAllPlugins, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSocialPlugin", js_anysdk_framework_AgentManager_getSocialPlugin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getPushPlugin", js_anysdk_framework_AgentManager_getPushPlugin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getUserPlugin", js_anysdk_framework_AgentManager_getUserPlugin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getAdTrackingPlugin", js_anysdk_framework_AgentManager_getAdTrackingPlugin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCustomPlugin", js_anysdk_framework_AgentManager_getCustomPlugin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCustomParam", js_anysdk_framework_AgentManager_getCustomParam, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("loadAllPlugins", js_anysdk_framework_AgentManager_loadAllPlugins, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("init", js_anysdk_framework_AgentManager_init, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("isAnaylticsEnabled", js_anysdk_framework_AgentManager_isAnaylticsEnabled, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getChannelId", js_anysdk_framework_AgentManager_getChannelId, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getAdsPlugin", js_anysdk_framework_AgentManager_getAdsPlugin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setIsAnaylticsEnabled", js_anysdk_framework_AgentManager_setIsAnaylticsEnabled, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getSharePlugin", js_anysdk_framework_AgentManager_getSharePlugin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getAnalyticsPlugin", js_anysdk_framework_AgentManager_getAnalyticsPlugin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getRECPlugin", js_anysdk_framework_AgentManager_getRECPlugin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getCrashPlugin", js_anysdk_framework_AgentManager_getCrashPlugin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    static JSFunctionSpec st_funcs[] = {
        JS_FN("end", js_anysdk_framework_AgentManager_end, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getInstance", js_anysdk_framework_AgentManager_getInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, nullptr);
    jsb_anysdk_framework_AgentManager_prototype = JS_InitClass(
                                                               cx, global,
                                                               parent_proto,
                                                               jsb_anysdk_framework_AgentManager_class,
                                                               empty_constructor, 0,
                                                               nullptr,
                                                               funcs,
                                                               nullptr,
                                                               st_funcs);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_AgentManager_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "AgentManager", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::AgentManager>(cx, jsb_anysdk_framework_AgentManager_class, proto);
}

JSClass  *jsb_anysdk_framework_JSBRelation_class;
JSObject *jsb_anysdk_framework_JSBRelation_prototype;

bool js_anysdk_framework_JSBRelation_getMethodsOfPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 1) {
        anysdk::framework::PluginProtocol* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (anysdk::framework::PluginProtocol*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_JSBRelation_getMethodsOfPlugin : Error processing arguments");
        
        std::string ret = anysdk::framework::JSBRelation::getMethodsOfPlugin(arg0);
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        ok &= std_string_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_anysdk_framework_JSBRelation_getMethodsOfPlugin : error parsing return value");
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_anysdk_framework_JSBRelation_getMethodsOfPlugin : wrong number of arguments");
    return false;
}


void js_register_anysdk_framework_JSBRelation(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps anysdk_framework_JSBRelation_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass anysdk_framework_JSBRelation_class = {
        "JSBRelation",
        JSCLASS_HAS_PRIVATE,
        &anysdk_framework_JSBRelation_classOps
    };
    jsb_anysdk_framework_JSBRelation_class = &anysdk_framework_JSBRelation_class;
    
    static JSFunctionSpec st_funcs[] = {
        JS_FN("getMethodsOfPlugin", js_anysdk_framework_JSBRelation_getMethodsOfPlugin, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, nullptr);
    jsb_anysdk_framework_JSBRelation_prototype = JS_InitClass(
                                                              cx, global,
                                                              parent_proto,
                                                              jsb_anysdk_framework_JSBRelation_class,
                                                              dummy_constructor<anysdk::framework::JSBRelation>, 0,
                                                              nullptr,
                                                              nullptr,
                                                              nullptr,
                                                              st_funcs);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_JSBRelation_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "JSBRelation", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::JSBRelation>(cx, jsb_anysdk_framework_JSBRelation_class, proto);
}

void register_all_anysdk_framework(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "anysdk", &ns);
    
    js_register_anysdk_framework_PluginProtocol(cx, ns);
    js_register_anysdk_framework_ProtocolCustom(cx, ns);
    js_register_anysdk_framework_ProtocolUser(cx, ns);
    js_register_anysdk_framework_PluginFactory(cx, ns);
    js_register_anysdk_framework_ProtocolYAP(cx, ns);
    js_register_anysdk_framework_AgentManager(cx, ns);
    js_register_anysdk_framework_ProtocolSocial(cx, ns);
    js_register_anysdk_framework_ProtocolAdTracking(cx, ns);
    js_register_anysdk_framework_ProtocolAnalytics(cx, ns);
    js_register_anysdk_framework_ProtocolAds(cx, ns);
    js_register_anysdk_framework_ProtocolCrash(cx, ns);
    js_register_anysdk_framework_PluginManager(cx, ns);
    js_register_anysdk_framework_ProtocolPush(cx, ns);
    js_register_anysdk_framework_ProtocolREC(cx, ns);
    js_register_anysdk_framework_JSBRelation(cx, ns);
}

