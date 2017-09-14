#include "manualanysdkbindings.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/manual/js_manual_conversions.h"
#include "jsb_anysdk_basic_conversions.h"
#include "AgentManager.h"
#include "PluginProtocol.h"
#include "ProtocolPush.h"
#include "PluginFactory.h"
#include "ProtocolAds.h"
#include "PluginManager.h"
#include "ProtocolAnalytics.h"
#include "ProtocolSocial.h"
#include "ProtocolYAP.h"
#include "ProtocolUser.h"
#include "ProtocolREC.h"
#include "ProtocolAdTracking.h"
#include "ProtocolCustom.h"
#include "JSBRelation.h"
#include "base/CCDirector.h"
#include "base/CCEventDispatcher.h"
#include "base/CCEventListenerCustom.h"
#include "base/CCEventCustom.h"

using namespace anysdk::framework;

JSClass  *jsb_anysdk_framework_PluginParam_class;
JSObject *jsb_anysdk_framework_PluginParam_prototype;


bool js_anysdk_PluginParam_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    
    PluginParam* cobj = nullptr;
    
    do {
        if (argc == 2) {
            int arg0;
            ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
            if (!ok) { ok = true; break; }
            
            switch (arg0)
            {
                case PluginParam::kParamTypeInt:
                {
                    int arg1;
                    ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
                    if (ok) { cobj = new PluginParam(arg1); }
                }
                break;
                case PluginParam::kParamTypeFloat:
                {
                   	float arg1;
                    ok &= jsval_to_float(cx, args.get(1), &arg1);
                    if (ok) {
                        cobj = new PluginParam(arg1);
                    }
                }
                break;
                case PluginParam::kParamTypeBool:
                {
                    bool arg1;
                    ok &= jsval_to_bool(cx, args.get(1), &arg1);
                    if (ok) {
                        cobj = new PluginParam(arg1);
                    }
                }
                break;
                case PluginParam::kParamTypeString:
                {
                    const char* arg1;
                    std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
                    if (ok) { cobj = new PluginParam(arg1); }
                }
                break;
                case PluginParam::kParamTypeStringMap:
                {
           	        StringMap arg1;
                    ok &= jsval_to_StringMap(cx, args.get(1), &arg1);
                    if (ok) { cobj = new PluginParam(arg1); }
                }
                break;
                default:
                break;
            }
            if (!ok || NULL == cobj) { ok = true; break; }
            
            js_type_class_t *typeClass = js_get_type_from_native<PluginParam>(cobj);
            JS::RootedObject proto(cx, typeClass->proto->get());
            JS::RootedObject jsobj(cx, JS_NewObjectWithGivenProto(cx, typeClass->jsclass, proto));
            js_add_FinalizeHook(cx, jsobj, false);
            jsb_new_proxy(cx, cobj, jsobj);
            JS::RootedValue objVal(cx, JS::ObjectOrNullValue(jsobj));
            js_add_object_root(objVal);
            
            args.rval().set(objVal);
            return true;
        }
    } while (0);
    
    JS_ReportErrorUTF8(cx, "wrong number of arguments");
    return false;
}

bool jsb_anysdk_PluginParam_getStringValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginParam* cobj = (anysdk::framework::PluginParam *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "jsb_anysdk_PluginParam_getStringValue : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->getStringValue();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        std_string_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "jsb_anysdk_PluginParam_getStringValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool jsb_anysdk_PluginParam_getCurrentType(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginParam* cobj = (anysdk::framework::PluginParam *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "jsb_anysdk_PluginParam_getCurrentType : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getCurrentType();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::Int32Value(ret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "jsb_anysdk_PluginParam_getCurrentType : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool jsb_anysdk_PluginParam_getIntValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginParam* cobj = (anysdk::framework::PluginParam *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "jsb_anysdk_PluginParam_getIntValue : Invalid Native Object");
    if (argc == 0) {
        int ret = cobj->getIntValue();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::Int32Value(ret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "jsb_anysdk_PluginParam_getIntValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool jsb_anysdk_PluginParam_getFloatValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginParam* cobj = (anysdk::framework::PluginParam *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "jsb_anysdk_PluginParam_getFloatValue : Invalid Native Object");
    if (argc == 0) {
        float ret = cobj->getFloatValue();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret.setNumber(ret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "jsb_anysdk_PluginParam_getFloatValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool jsb_anysdk_PluginParam_getBoolValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginParam* cobj = (anysdk::framework::PluginParam *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "jsb_anysdk_PluginParam_getBoolValue : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->getBoolValue();
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret.setBoolean(ret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "jsb_anysdk_PluginParam_getBoolValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool jsb_anysdk_PluginParam_getMapValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginParam* cobj = (anysdk::framework::PluginParam *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "jsb_anysdk_PluginParam_getMapValue : Invalid Native Object");
    if (argc == 0) {
        typedef std::map<std::string, PluginParam*> MAP_PLUGINPARAM;
        MAP_PLUGINPARAM values = cobj->getMapValue();
        JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
        if (!tmp) return false;
        
        MAP_PLUGINPARAM::iterator iter;
        bool ok = true;
        for (iter = values.begin(); iter != values.end(); iter++)
        {
            std::string str_key = ((std::string)(iter->first));
            JS::RootedObject paramObj(cx);
            js_get_or_create_jsobject<PluginParam>(cx, (PluginParam*)&(iter->second), &paramObj);
            JS::RootedValue paramVal(cx, JS::ObjectOrNullValue(paramObj));
            ok &= JS_DefineProperty(cx, tmp, str_key.c_str(), paramVal, JSPROP_ENUMERATE | JSPROP_PERMANENT);
        }
        
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::ObjectOrNullValue(tmp);
        args.rval().set(jsret);
    }
    
    JS_ReportErrorUTF8(cx, "jsb_anysdk_PluginParam_getMapValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return true;
}

bool jsb_anysdk_PluginParam_getStrMapValue(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    anysdk::framework::PluginParam* cobj = (anysdk::framework::PluginParam *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "jsb_anysdk_PluginParam_getStrMapValue : Invalid Native Object");
    if (argc == 0) {
        StringMap values = cobj->getStrMapValue();
        JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
        if (!tmp) return false;
        
        StringMap::iterator iter;
        bool ok = true;
        for (iter = values.begin(); iter != values.end(); iter++)
        {
            std::string str_key = ((std::string)(iter->first));
            std::string str_tmp = ((std::string)(iter->second));
            JS::RootedValue tmpVal(cx);
            std_string_to_jsval(cx, str_tmp, &tmpVal);
            ok &= JS_DefineProperty(cx, tmp, str_key.c_str(), tmpVal, JSPROP_ENUMERATE | JSPROP_PERMANENT);
        }
        
        JS::RootedValue jsret(cx, JS::NullHandleValue);
        jsret = JS::ObjectOrNullValue(tmp);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "jsb_anysdk_PluginParam_getStrMapValue : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_cocos2dx_PluginParam_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    PluginParam* ret = nullptr;
    if(argc == 0){
        ret = new PluginParam();
    }
    else if (argc == 1){
        bool ok = true;
        JS::RootedValue arg0(cx, args.get(0));
        if ( arg0.isObject() ){
            StringMap arg;
            jsval_to_std_map_string_string(cx, arg0, &arg);
            ret = new PluginParam( arg );
        }
        else if(arg0.isBoolean()){
            bool arg = arg0.toBoolean();
            ret = new PluginParam( arg );
        }
        else if(arg0.isInt32()){
            int arg = arg0.toInt32();
            ret = new PluginParam( arg );
        }
        else if(arg0.isNumber()){
            float arg = arg0.toNumber();
            ret = new PluginParam( arg );
        }
        else if(arg0.isString()){
            std::string arg;
            ok = jsval_to_std_string(cx, arg0, &arg);
            if (ok)
            ret = new PluginParam( arg.c_str() );
            else
            CCLOG("PluginParam string is wrong.");
        }
    }
    else{
        JS_ReportErrorUTF8(cx, "js_cocos2dx_PluginParam_create : wrong number of arguments: %d, was expecting %d", argc, 0);
        return false;
    }
    
    JS::RootedValue jsret(cx, JS::NullHandleValue);
    JS::RootedObject paramObj(cx);
    js_get_or_create_jsobject<PluginParam>(cx, ret, &paramObj);
    JS_SetPrivate(paramObj.get(), ret);
    jsret = JS::ObjectOrNullValue(paramObj);
    args.rval().set(jsret);
    return true;
}

extern JSObject *jsb_anysdk_framework_PluginProtocol_prototype;

void js_anysdk_PluginParam_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (PluginParam)", obj);
    void *nativePtr = JS_GetPrivate(obj);
    if (nativePtr) {
        PluginParam *nobj = static_cast<PluginParam *>(nativePtr);
        if (nobj)
        delete nobj;
    }
}

void js_register_anysdkbindings_PluginParam(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps PluginParam_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_anysdk_PluginParam_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    
    static JSClass PluginParam_class = {
        "PluginParam",
        JSCLASS_HAS_PRIVATE | JSCLASS_HAS_RESERVED_SLOTS(2) | JSCLASS_FOREGROUND_FINALIZE,
        &PluginParam_classOps
    };
    jsb_anysdk_framework_PluginParam_class = &PluginParam_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("getCurrentType", jsb_anysdk_PluginParam_getCurrentType, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getIntValue", jsb_anysdk_PluginParam_getIntValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getFloatValue", jsb_anysdk_PluginParam_getFloatValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getBoolValue", jsb_anysdk_PluginParam_getBoolValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getStringValue", jsb_anysdk_PluginParam_getStringValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getMapValue", jsb_anysdk_PluginParam_getMapValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getStrMapValue", jsb_anysdk_PluginParam_getStrMapValue, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_PluginParam_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_PluginParam_prototype = JS_InitClass(
                                                              cx, global,
                                                              parent_proto, // parent proto
                                                              jsb_anysdk_framework_PluginParam_class,
                                                              js_anysdk_PluginParam_constructor, 0, // no constructor
                                                              nullptr,
                                                              funcs,
                                                              nullptr, // no static properties
                                                              st_funcs);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_PluginParam_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "PluginParam", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::PluginParam>(cx, jsb_anysdk_framework_PluginParam_class, proto);
}

class ProtocolShareResultListener : public ShareResultListener, public JSFunctionWrapper
{
public:
    ProtocolShareResultListener(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    : JSFunctionWrapper(cx, jsthis, func, owner)
    {
    }
    ~ProtocolShareResultListener()
    {
        CCLOG("on share result ~listener");
    }
    
    virtual void onShareResult(ShareResultCode code, const char* msg)
    {
        CCLOG("on action result: %d, msg: %s.", code, msg);
        
        JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedValue retval(cx);
        JS::AutoValueVector valArr(cx);
        JS::RootedValue tmp(cx);
        valArr.append( JS::Int32Value(code) );
        std_string_to_jsval(cx, msg, &tmp);
        valArr.append( tmp );
        
        JS::HandleValueArray args(valArr);
        invoke(args, &retval);
    }
};

bool jsb_anysdk_ProtocolShare_setResultListener(JSContext *cx, uint32_t argc, JS::Value *vp){
    CCLOG("in ProtocolShare_setResultListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolShare* cobj = (ProtocolShare *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc != 2)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_ProtocolShare_setResultListener : wrong number of arguments: %d, was expecting %d", argc, 0);
        return false;
    }
    JS::RootedObject jsthis(cx, args.get(1).toObjectOrNull());
    JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
    ProtocolShareResultListener* listener = new ProtocolShareResultListener(cx, jsthis, jsfunc, obj);
    cobj->setResultListener(listener);
    return true;
}


bool jsb_anysdk_ProtocolShare_share(JSContext *cx, uint32_t argc, JS::Value *vp){
    CCLOG("in ProtocolShare_share, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolShare* cobj = (ProtocolShare *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc != 1)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_ProtocolShare_share : wrong number of arguments: %d, was expecting %d", argc, 0);
        return true;
    }
    JS::RootedValue arg0(cx, args.get(0));
    if ( arg0.isObject() ){
        if (arg0.isNullOrUndefined()) {
            CCLOG("%s", "jsb_anysdk_ProtocolShare_share: js argument is not an object.");
            return false;
        }
        
        TShareInfo info;
        bool ok = jsval_to_std_map_string_string(cx, arg0, &info);
        JSB_PRECONDITION2(ok, cx, false, "jsb_anysdk_ProtocolShare_share : Error processing arguments");
        
        cobj->share( info );
    }
    return true;
}

JSClass  *jsb_anysdk_framework_ProtocolShare_class;
JSObject *jsb_anysdk_framework_ProtocolShare_prototype;

void js_anysdk_framework_ProtocolShare_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (ProtocolShare)", obj);
}

void js_register_anysdkbindings_ProtocolShare(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps ProtocolShare_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_anysdk_framework_ProtocolShare_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    
    static JSClass ProtocolShare_class = {
        "ProtocolShare",
        JSCLASS_HAS_PRIVATE | JSCLASS_HAS_RESERVED_SLOTS(2) | JSCLASS_FOREGROUND_FINALIZE,
        &ProtocolShare_classOps
    };
    jsb_anysdk_framework_ProtocolShare_class = &ProtocolShare_class;
    
    static JSFunctionSpec funcs[] = {
        JS_FN("share", jsb_anysdk_ProtocolShare_share, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setResultListener", jsb_anysdk_ProtocolShare_setResultListener, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };
    
    static JSFunctionSpec st_funcs[] = {
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, jsb_anysdk_framework_PluginProtocol_prototype);
    jsb_anysdk_framework_ProtocolShare_prototype = JS_InitClass(
                                                                cx, global,
                                                                parent_proto, // parent proto
                                                                jsb_anysdk_framework_ProtocolShare_class,
                                                                empty_constructor, 0, // no constructor
                                                                nullptr,
                                                                funcs,
                                                                nullptr, // no static properties
                                                                st_funcs);
    
    JS::RootedObject proto(cx, jsb_anysdk_framework_ProtocolShare_prototype);
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "ProtocolShare", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<anysdk::framework::ProtocolShare>(cx, jsb_anysdk_framework_ProtocolShare_class, proto);
}

static bool jsb_anysdk_framework_PluginProtocol_callFuncWithParam(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    PluginProtocol* cobj = (PluginProtocol *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    CCLOG("callFuncWithParam, param count:%d.\n", argc);
    bool ok = true;
    if(argc == 1){
        std::string arg0;
        JS::RootedValue arg0Val(cx, args.get(0));
        ok &= jsval_to_std_string(cx, arg0Val, &arg0);
        CCLOG("arg0: %s\n", arg0.c_str());
        cobj->callFuncWithParam(arg0.c_str(), NULL);
        return true;
    }
    else if (argc == 0) {
        JS_ReportErrorUTF8(cx, "Invalid number of arguments");
        return false;
    }
    else{
        std::string arg0;
        JS::RootedValue arg0Val(cx, args.get(0));
        ok &= jsval_to_std_string(cx, arg0Val, &arg0);
        CCLOG("arg0: %s\n", arg0.c_str());
        
        std::vector<PluginParam*> params;
        
        JS::RootedObject obj_1(cx, args.get(1).toObjectOrNull());
        bool isArray = false;
        JS_IsArrayObject(cx, obj_1, &isArray);
        if ( isArray )
        {
            JS::RootedObject jsArr(cx);
            JS::RootedValue arg1Val(cx, args.get(1));
            bool ok = args.get(1).isObject() && JS_ValueToObject( cx, arg1Val, &jsArr );
            JSB_PRECONDITION2(ok, cx, false, "jsb_anysdk_framework_PluginProtocol_callFuncWithParam : Error processing arguments");
            
            uint32_t len = 0;
            JS_GetArrayLength(cx, jsArr, &len);
            params.reserve(len);
            CCLOG("param len: %d", len);
            for (uint32_t i=0; i < len; i++)
            {
                JS::RootedValue value(cx);
                if (JS_GetElement(cx, jsArr, i, &value))
                {
                    if (value.isObject())
                    {
                        JS::RootedObject jsobj(cx, value.toObjectOrNull());
                        js_proxy_t *proxy_2 = jsb_get_js_proxy(cx, jsobj);
                        PluginParam* pobj_2 = (PluginParam *)(proxy_2 ? proxy_2->ptr : NULL);
                        params.push_back(pobj_2);
                    }
                }
            }
        }
        else{
            for (int i = 1; i < argc; i++)
            {
                JS::RootedObject jsobj(cx, args.get(i).toObjectOrNull());
                js_proxy_t *proxy_2 = jsb_get_js_proxy(cx, jsobj);
                PluginParam* param = (PluginParam *)(proxy_2 ? proxy_2->ptr : NULL);
                params.push_back(param);
            }
        }
        cobj->callFuncWithParam(arg0.c_str(), params);
        return true;
    }
}

static bool jsb_anysdk_framework_PluginProtocol_callStringFuncWithParam(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    PluginProtocol* cobj = (PluginProtocol *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    CCLOG("callStringFuncWithParam, param count:%d.\n", argc);
    bool ok = true;
    if(argc == 1){
        std::string arg0;
        JS::RootedValue arg0Val(cx, args.get(0));
        ok &= jsval_to_std_string(cx, arg0Val, &arg0);
        CCLOG("arg0: %s\n", arg0.c_str());
        std::string ret = cobj->callStringFuncWithParam(arg0.c_str(), NULL);
        JS::RootedValue jsret(cx);
        std_string_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }
    else if (argc == 0) {
        JS_ReportErrorUTF8(cx, "Invalid number of arguments");
        return false;
    }
    else{
        std::string arg0;
        JS::RootedValue arg0Val(cx, args.get(0));
        ok &= jsval_to_std_string(cx, arg0Val, &arg0);
        CCLOG("arg0: %s\n", arg0.c_str());
        
        std::vector<PluginParam*> params;
        
        bool isArray = false;
        JS::RootedObject obj_1(cx, args.get(1).toObjectOrNull());
        JS_IsArrayObject(cx, obj_1, &isArray);
        if ( isArray )
        {
            JS::RootedObject jsArr(cx);
            JS::RootedValue arg1Val(cx, args.get(1));
            bool ok = args.get(1).isObject() && JS_ValueToObject( cx, arg1Val, &jsArr );
            JSB_PRECONDITION2(ok, cx, false, "jsb_anysdk_framework_PluginProtocol_callStringFuncWithParam : Error processing arguments");
            
            uint32_t len = 0;
            JS_GetArrayLength(cx, jsArr, &len);
            params.reserve(len);
            CCLOG("param len: %d", len);
            for (uint32_t i=0; i < len; i++)
            {
                JS::RootedValue value(cx);
                if (JS_GetElement(cx, jsArr, i, &value))
                {
                    if (value.isObject())
                    {
                        JS::RootedObject jsobj(cx, value.toObjectOrNull());
                        js_proxy_t *proxy_2 = jsb_get_js_proxy(cx, jsobj);
                        PluginParam* pobj_2 = (PluginParam *)(proxy_2 ? proxy_2->ptr : NULL);
                        params.push_back(pobj_2);
                    }
                }
            }
        }
        else{
            for (int i = 1; i < argc; i++)
            {
                JS::RootedObject jsobj(cx, args.get(i).toObjectOrNull());
                js_proxy_t *proxy_2 = jsb_get_js_proxy(cx, jsobj);
                PluginParam* param = (PluginParam *)(proxy_2 ? proxy_2->ptr : NULL);
                params.push_back(param);
            }
        }
        std::string ret = cobj->callStringFuncWithParam(arg0.c_str(), params);
        JS::RootedValue jsret(cx);
        std_string_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }
}

static bool jsb_anysdk_framework_PluginProtocol_callIntFuncWithParam(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    PluginProtocol* cobj = (PluginProtocol *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    CCLOG("callIntFuncWithParam, param count:%d.\n", argc);
    bool ok = true;
    if(argc == 1){
        std::string arg0;
        JS::RootedValue arg0Val(cx, args.get(0));
        ok &= jsval_to_std_string(cx, arg0Val, &arg0);
        CCLOG("arg0: %s\n", arg0.c_str());
        int ret =cobj->callIntFuncWithParam(arg0.c_str(), NULL);
        JS::RootedValue jsret(cx, JS::Int32Value(ret));
        args.rval().set(jsret);
        return true;
    }
    else if (argc == 0) {
        JS_ReportErrorUTF8(cx, "Invalid number of arguments");
        return false;
    }
    else{
        std::string arg0;
        JS::RootedValue arg0Val(cx, args.get(0));
        ok &= jsval_to_std_string(cx, arg0Val, &arg0);
        CCLOG("arg0: %s\n", arg0.c_str());
        
        std::vector<PluginParam*> params;
        
        JS::RootedObject obj_1(cx, args.get(1).toObjectOrNull());
        bool isArray = false;
        if ( JS_IsArrayObject(cx, obj_1, &isArray) && isArray )
        {
            JS::RootedObject jsArr(cx);
            JS::RootedValue arg1Val(cx, args.get(1));
            bool ok = args.get(1).isObject() && JS_ValueToObject( cx, arg1Val, &jsArr );
            JSB_PRECONDITION2(ok, cx, false, "jsb_anysdk_framework_PluginProtocol_callStringFuncWithParam : Error processing arguments");
            
            uint32_t len = 0;
            JS_GetArrayLength(cx, jsArr, &len);
            CCLOG("param len: %d", len);
            for (uint32_t i=0; i < len; i++)
            {
                JS::RootedValue value(cx);
                if (JS_GetElement(cx, jsArr, i, &value))
                {
                    if (value.isObject())
                    {
                        JS::RootedObject jsobj(cx, value.toObjectOrNull());
                        js_proxy_t *proxy_2 = jsb_get_js_proxy(cx, jsobj);
                        PluginParam* pobj_2 = (PluginParam *)(proxy_2 ? proxy_2->ptr : NULL);
                        params.push_back(pobj_2);
                    }
                }
            }
        }
        else{
            for (int i = 1; i < argc; i++)
            {
                JS::RootedObject jsobj(cx, args.get(i).toObjectOrNull());
                js_proxy_t *proxy_2 = jsb_get_js_proxy(cx, jsobj);
                PluginParam* param = (PluginParam *)(proxy_2 ? proxy_2->ptr : NULL);
                params.push_back(param);
            }
        }
        int ret = cobj->callIntFuncWithParam(arg0.c_str(), params);
        JS::RootedValue jsret(cx, JS::Int32Value(ret));
        args.rval().set(jsret);
        return true;
    }
}

static bool jsb_anysdk_framework_PluginProtocol_callBoolFuncWithParam(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    PluginProtocol* cobj = (PluginProtocol *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    CCLOG("callBoolFuncWithParam, param count:%d.\n", argc);
    bool ok = true;
    if(argc == 1){
        std::string arg0;
        JS::RootedValue arg0Val(cx, args.get(0));
        ok &= jsval_to_std_string(cx, arg0Val, &arg0);
        CCLOG("arg0: %s\n", arg0.c_str());
        bool ret = cobj->callBoolFuncWithParam(arg0.c_str(), NULL);
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }
    else if (argc == 0) {
        JS_ReportErrorUTF8(cx, "Invalid number of arguments");
        return false;
    }
    else{
        std::string arg0;
        JS::RootedValue arg0Val(cx, args.get(0));
        ok &= jsval_to_std_string(cx, arg0Val, &arg0);
        CCLOG("arg0: %s\n", arg0.c_str());
        
        std::vector<PluginParam*> params;
        
        JS::RootedObject obj_1(cx, args.get(1).toObjectOrNull());
        bool isArray = false;
        if ( JS_IsArrayObject(cx, obj_1, &isArray) && isArray )
        {
            JS::RootedObject jsArr(cx);
            JS::RootedValue arg1Val(cx, args.get(1));
            bool ok = args.get(1).isObject() && JS_ValueToObject( cx, arg1Val, &jsArr );
            JSB_PRECONDITION2(ok, cx, false, "jsb_anysdk_framework_PluginProtocol_callStringFuncWithParam : Error processing arguments");
            
            uint32_t len = 0;
            JS_GetArrayLength(cx, jsArr, &len);
            CCLOG("param len: %d", len);
            for (uint32_t i=0; i < len; i++)
            {
                JS::RootedValue value(cx);
                if (JS_GetElement(cx, jsArr, i, &value))
                {
                    if (value.isObject())
                    {
                        JS::RootedObject jsobj(cx, value.toObjectOrNull());
                        js_proxy_t *proxy_2 = jsb_get_js_proxy(cx, jsobj);
                        PluginParam* pobj_2 = (PluginParam *)(proxy_2 ? proxy_2->ptr : NULL);
                        params.push_back(pobj_2);
                    }
                }
            }
        }
        else{
            for (int i = 1; i < argc; i++)
            {
                JS::RootedObject jsobj(cx, args.get(i).toObjectOrNull());
                js_proxy_t *proxy_2 = jsb_get_js_proxy(cx, jsobj);
                PluginParam* param = (PluginParam *)(proxy_2 ? proxy_2->ptr : NULL);
                params.push_back(param);
            }
        }
        bool ret = cobj->callBoolFuncWithParam(arg0.c_str(), params);
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }
}

static bool jsb_anysdk_framework_PluginProtocol_callFloatFuncWithParam(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    PluginProtocol* cobj = (PluginProtocol *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    CCLOG("callFloatFuncWithParam, param count:%d.\n", argc);
    bool ok = true;
    if(argc == 1){
        std::string arg0;
        JS::RootedValue arg0Val(cx, args.get(0));
        ok &= jsval_to_std_string(cx, arg0Val, &arg0);
        CCLOG("arg0: %s\n", arg0.c_str());
        double ret = cobj->callFloatFuncWithParam(arg0.c_str(), NULL);
        JS::RootedValue jsret(cx, JS::DoubleValue(ret));
        args.rval().set(jsret);
        return true;
    }
    else if (argc == 0) {
        JS_ReportErrorUTF8(cx, "Invalid number of arguments");
        return false;
    }
    else{
        std::string arg0;
        JS::RootedValue arg0Val(cx, args.get(0));
        ok &= jsval_to_std_string(cx, arg0Val, &arg0);
        CCLOG("arg0: %s\n", arg0.c_str());
        
        std::vector<PluginParam*> params;
        
        JS::RootedObject obj_1(cx, args.get(1).toObjectOrNull());
        bool isArray = false;
        if ( JS_IsArrayObject(cx, obj_1, &isArray) && isArray )
        {
            JS::RootedObject jsArr(cx);
            JS::RootedValue arg1Val(cx, args.get(1));
            bool ok = args.get(1).isObject() && JS_ValueToObject( cx, arg1Val, &jsArr );
            JSB_PRECONDITION2(ok, cx, false, "jsb_anysdk_framework_PluginProtocol_callStringFuncWithParam : Error processing arguments");
            
            uint32_t len = 0;
            JS_GetArrayLength(cx, jsArr, &len);
            CCLOG("param len: %d", len);
            for (uint32_t i=0; i < len; i++)
            {
                JS::RootedValue value(cx);
                if (JS_GetElement(cx, jsArr, i, &value))
                {
                    if (value.isObject())
                    {
                        JS::RootedObject jsobj(cx, value.toObjectOrNull());
                        js_proxy_t *proxy_2 = jsb_get_js_proxy(cx, jsobj);
                        PluginParam* pobj_2 = (PluginParam *)(proxy_2 ? proxy_2->ptr : NULL);
                        params.push_back(pobj_2);
                    }
                }
            }
        }
        else{
            for (int i = 1; i < argc; i++)
            {
                JS::RootedObject jsobj(cx, args.get(i).toObjectOrNull());
                js_proxy_t *proxy_2 = jsb_get_js_proxy(cx, jsobj);
                PluginParam* param = (PluginParam *)(proxy_2 ? proxy_2->ptr : NULL);
                params.push_back(param);
            }
        }
        double ret = cobj->callFloatFuncWithParam(arg0.c_str(), params);
        JS::RootedValue jsret(cx, JS::DoubleValue(ret));
        args.rval().set(jsret);
        return true;
    }
}

static bool jsb_anysdk_framework_AgentManager_getYAPPlugin(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    AgentManager* cobj = (AgentManager *)(proxy ? proxy->ptr : NULL);
    
    if (argc != 0)
    {
        CCLOG("AgentManager_getYAPPlugin param number is wrong.");
        return false;
    }
    std::map<std::string , ProtocolYAP*>* plugins = cobj->getYAPPlugin();
    JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, 0));
    
    for (auto iter = plugins->begin(); iter != plugins->end(); ++iter)
    {
        JS::RootedValue dictElement(cx);
        
        std::string key = std::string(iter->first);
        CCLOG("yap key: %s.", key.c_str());
        ProtocolYAP* yap_plugin = (ProtocolYAP*)(iter->second);
        JS::RootedObject paramObj(cx);
        js_get_or_create_jsobject<ProtocolYAP>(cx, yap_plugin, &paramObj);
        dictElement = JS::ObjectOrNullValue(paramObj);
        
        JS_SetProperty(cx, jsretArr, key.c_str(), dictElement);
    }
    JS::RootedValue jsret(cx, JS::ObjectOrNullValue(jsretArr));
    args.rval().set(jsret);
    
    return true;
}
static bool jsb_anysdk_framework_AgentManager_getFrameworkVersion(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    AgentManager* cobj = (AgentManager *)(proxy ? proxy->ptr : NULL);
    
    if (argc != 0)
    {
        CCLOG("AgentManager_getYAPPlugin param number is wrong.");
        return false;
    }
    
    JS::RootedValue jsret(cx);
    std_string_to_jsval(cx, cobj->getFrameworkVersion(), &jsret);
    args.rval().set(jsret);
    return true;
    
}

class ProtocolAdsResultListener : public AdsListener, public JSFunctionWrapper
{
public:
    ProtocolAdsResultListener(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    : JSFunctionWrapper(cx, jsthis, func, owner)
    {
    }
    ~ProtocolAdsResultListener()
    {
        CCLOG("on ads result ~listener");
    }
    
    virtual void onAdsResult(AdsResultCode code, const char* msg)
    {
        CCLOG("on ads result: %d, msg: %s.", code, msg);
        
        JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedValue retval(cx);
        JS::AutoValueVector valArr(cx);
        JS::RootedValue tmp(cx);
        valArr.append( JS::Int32Value(code) );
        std_string_to_jsval(cx, msg, &tmp);
        valArr.append( tmp );
        JS::HandleValueArray args(valArr);
        
        invoke(args, &retval);
    }
    virtual void onPlayerGetPoints(ProtocolAds* pAdsPlugin, int points)
    {
        CCLOG("on player get points: %d.", points);
        JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedObject paramObj(cx);
        js_get_or_create_jsobject<ProtocolAds>(cx, pAdsPlugin, &paramObj);
        
        JS::RootedValue retval(cx);
        JS::AutoValueVector valArr(cx);
        valArr.append( JS::ObjectOrNullValue(paramObj) );
        valArr.append( JS::Int32Value(points) );
        JS::HandleValueArray args(valArr);
        
        invoke(args, &retval);
    }
    
    static ProtocolAdsResultListener* _instance;
    static ProtocolAdsResultListener* getInstance(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    {
        if (_instance == nullptr)
        {
            _instance = new ProtocolAdsResultListener(cx, jsthis, func, owner);
        }
        else
        {
            _instance->setOwner(cx, owner);
            _instance->setJSTarget(cx, jsthis);
            _instance->setJSCallback(cx, func);
        }
        return _instance;
    }
    static void purge()
    {
        if (_instance != NULL)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
};
ProtocolAdsResultListener* ProtocolAdsResultListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolAds_setAdsListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolAds_setAdsListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolAds* cobj = (ProtocolAds *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc != 2)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolAds_setAdsListener : wrong number of arguments: %d, was expecting %d", argc, 0);
        return false;
    }
    
    JS::RootedObject jsthis(cx, args.get(1).toObjectOrNull());
    JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
    ProtocolAdsResultListener* listener = ProtocolAdsResultListener::getInstance(cx, jsthis, jsfunc, obj);
    cobj->setAdsListener(listener);
    return true;
}

static bool jsb_anysdk_framework_ProtocolAds_removeListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolAds_removeListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolAds* cobj = (ProtocolAds *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (ProtocolAdsResultListener::_instance != nullptr)
    {
        ProtocolAdsResultListener::purge();
    }
    if(argc != 0)
    CCLOG("ProtocolAds_removeListener has wrong number of arguments.");
    return true;
}

static bool jsb_anysdk_framework_ProtocolAnalytics_logEvent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolAnalytics* cobj = (ProtocolAnalytics *)(proxy ? proxy->ptr : NULL);
    
    JS::RootedValue arg0(cx, args.get(0));
    std::string arg;
    bool ok = jsval_to_std_string(cx, arg0, &arg);
    CCLOG("logevent, argc: %d, str: %s.", argc, arg.c_str());
    if (!ok)
    {
        CCLOG("ProtocolAnalytics_logEvent param type is wrong.");
        return false;
    }
    if (argc == 1)
    {
        cobj->logEvent(arg.c_str());
        return true;
    }
    else if(argc == 2)
    {
        if (!args.get(1).isObject() || args.get(1).isNullOrUndefined()) {
            CCLOG("%s", "jsval_to_stdmap: the jsval is not an object.");
            return false;
        }
        
        LogEventParamMap params;
        bool ok = jsval_to_std_map_string_string(cx, args.get(1), &params);
        JSB_PRECONDITION2(ok, cx, false, "jsb_anysdk_framework_ProtocolAnalytics_logEvent : Error processing arguments");
        
        cobj->logEvent(arg.c_str(), &params);
        
        return true;
    }
    JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolAnalytics_logEvent : wrong number of arguments: %d, was expecting %d", argc, 0);
    return true;
}

class ProtocolYAPResultListener : public YapResultListener, public JSFunctionWrapper
{
public:
    ProtocolYAPResultListener(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    : JSFunctionWrapper(cx, jsthis, func, owner)
    {
    }
    ~ProtocolYAPResultListener()
    {
        CCLOG("on YAP result ~listener");
    }
    
    virtual void onYapResult(YapResultCode code, const char* msg, TProductInfo info)
    {
        CCLOG("on yap result: %d, msg: %s.", code, msg);
        
        JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedValue retval(cx);
        
        std::string vec="{";
        for (auto iter = info.begin(); iter != info.end(); ++iter)
        {
            std::string key = std::string(iter->first);
            std::string value = (std::string)(iter->second);
            // CCLOG("productInfo key: %s, value: %s.", key.c_str(), value.c_str());
            vec += key + ":" +value+ ",";
        }
        vec.replace(vec.length() - 1, 1, "}");
        
        JS::AutoValueVector valArr(cx);
        JS::RootedValue tmp(cx);
        valArr.append( JS::Int32Value(code) );
        std_string_to_jsval(cx, msg, &tmp);
        valArr.append( tmp );
        std_string_to_jsval(cx, vec, &tmp);
        valArr.append( tmp );
        JS::HandleValueArray args(valArr);
        
        invoke(args, &retval);
    }
    
    
    virtual void onRequestResult(RequestResultCode code, const char* msg, AllProductsInfo info)
    {
        CCLOG("on request result: %d, msg: %s.", code, msg);
        
        JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedValue retval(cx);
        
        string value = "{";
        map<string, TProductInfo >::iterator iterParent;
        iterParent = info.begin();
        while(iterParent != info.end())
        {
            value.append(iterParent->first);
            value.append("={");
            map<string, string> infoChild = iterParent->second;
            map<string, string >::iterator iterChild;
            iterChild = infoChild.begin();
            while(iterChild != infoChild.end())
            {
                value.append(iterChild->first);
                value.append("=");
                value.append(iterChild->second);
                iterChild++;
                if(iterChild != infoChild.end())
                value.append(", ");
            }
            iterParent++;
            if(iterParent != info.end())
            value.append("}, ");
        }
        value.append("}");
        
        
        JS::AutoValueVector valArr(cx);
        JS::RootedValue tmp(cx);
        valArr.append( JS::Int32Value(code) );
        std_string_to_jsval(cx, msg, &tmp);
        valArr.append( tmp );
        std_string_to_jsval(cx, value, &tmp);
        valArr.append( tmp );
        
        JS::HandleValueArray args(valArr);
        invoke(args, &retval);
    }
    
    typedef std::map<std::string, ProtocolYAPResultListener*> STD_MAP;
    static STD_MAP std_map;
    static ProtocolYAPResultListener* getListenerByKey(std::string key, JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    {
        auto listener = std_map[key];
        if (listener == NULL) {
            listener = new ProtocolYAPResultListener(cx, jsthis, func, owner);
            std_map[key] = listener;
        }
        return listener;
    }
    static void purge(std::string key)
    {
        auto listener = std_map[key];
        CC_SAFE_DELETE(listener);
        std_map.erase(key);
    }
    static void clear()
    {
        STD_MAP::iterator it = std_map.begin();
        while (it != std_map.end())
        {
            auto listener = it->second;
            CC_SAFE_DELETE(listener);
            it = std_map.erase(it);
        }
    }
};
ProtocolYAPResultListener::STD_MAP ProtocolYAPResultListener::std_map;

static bool jsb_anysdk_framework_ProtocolYAP_setResultListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolAds_setAdsListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolYAP* cobj = (ProtocolYAP *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc != 2)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolAds_setAdsListener : wrong number of arguments: %d, was expecting %d", argc, 0);
        return true;
    }
    std::string p_id = cobj->getPluginId();
    if (p_id.length() < 1)
    {
        p_id = "no_plugin";
    }
    if (ProtocolYAPResultListener::std_map[p_id] == NULL)
    {
        CCLOG("will set listener:");
        
        JS::RootedObject jsthis(cx, args.get(1).toObjectOrNull());
        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
        ProtocolYAPResultListener* listener = ProtocolYAPResultListener::getListenerByKey(p_id, cx, jsthis, jsfunc, obj);
        cobj->setResultListener(listener);
    }
    
    return true;
}

static bool jsb_anysdk_framework_ProtocolYAP_removeListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolYAP_removeListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolYAP* cobj = (ProtocolYAP *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    std::string p_id = cobj->getPluginId();
    if (p_id.length() < 1)
    {
        p_id = "no_plugin";
    }
    if (ProtocolYAPResultListener::std_map[p_id] != NULL)
    {
        ProtocolYAPResultListener* listener = ProtocolYAPResultListener::std_map[p_id];
        listener->purge(p_id);
    }
    if(argc != 0)
    CCLOG("ProtocolYAP_removeListener has wrong number of arguments.");
    return true;
}

static bool jsb_anysdk_framework_ProtocolYAP_yapForProduct(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolYAP_yapForProduct, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolYAP* cobj = (ProtocolYAP *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc != 1)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolYAP_yapForProduct : wrong number of arguments: %d, was expecting %d", argc, 0);
        return true;
    }
    JS::RootedValue arg0(cx, args.get(0));
    if ( arg0.isObject() ){
        if (arg0.isNullOrUndefined()) {
            CCLOG("%s", "jsval_to_ccvaluemap: the jsval is not an object.");
            return true;
        }
        
        TProductInfo arg;
        bool ok = jsval_to_std_map_string_string(cx, arg0, &arg);
        JSB_PRECONDITION2(ok, cx, false, "jsb_anysdk_framework_ProtocolYAP_yapForProduct : Error processing arguments");
        
        cobj->yapForProduct( arg );
    }
    return true;
}

class ProtocolPushActionListener : public PushActionListener, public JSFunctionWrapper
{
public:
    ProtocolPushActionListener(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    : JSFunctionWrapper(cx, jsthis, func, owner)
    {
    }
    ~ProtocolPushActionListener()
    {
        CCLOG("on Push result ~listener");
    }
    
    virtual void onActionResult(ProtocolPush* pPlugin, PushActionResultCode code, const char* msg)
    {
        CCLOG("on push result: %d, msg: %s.", code, msg);
        
        JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedObject paramObj(cx);
        js_get_or_create_jsobject<ProtocolPush>(cx, pPlugin, &paramObj);
        
        JS::RootedValue retval(cx);
        JS::AutoValueVector valArr(cx);
        JS::RootedValue tmp(cx);
        valArr.append( JS::ObjectOrNullValue(paramObj) );
        valArr.append( JS::Int32Value(code) );
        std_string_to_jsval(cx, msg, &tmp);
        valArr.append( tmp );
        JS::HandleValueArray args(valArr);
        
        invoke(args, &retval);
    }
    
    static ProtocolPushActionListener* _instance;
    static ProtocolPushActionListener* getInstance(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    {
        if (_instance == nullptr)
        {
            _instance = new ProtocolPushActionListener(cx, jsthis, func, owner);
        }
        else
        {
            _instance->setOwner(cx, owner);
            _instance->setJSTarget(cx, jsthis);
            _instance->setJSCallback(cx, func);
        }
        return _instance;
    }
    static void purge()
    {
        if (_instance != NULL)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
};
ProtocolPushActionListener* ProtocolPushActionListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolPush_setActionListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolPush_setActionListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolPush* cobj = (ProtocolPush *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc != 2)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolPush_setActionListener : wrong number of arguments: %d, was expecting %d", argc, 0);
        return false;
    }
    
    JS::RootedObject jsthis(cx, args.get(1).toObjectOrNull());
    JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
    ProtocolPushActionListener* listener = ProtocolPushActionListener::getInstance(cx, jsthis, jsfunc, obj);
    cobj->setActionListener(listener);
    return true;
}

static bool jsb_anysdk_framework_ProtocolPush_removeListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolPush_removeListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolPush* cobj = (ProtocolPush *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (ProtocolPushActionListener::_instance != NULL)
    {
        ProtocolPushActionListener::purge();
    }
    if(argc != 0)
    CCLOG("ProtocolPush_removeListener has wrong number of arguments.");
    return true;
}

static bool jsb_anysdk_framework_ProtocolPush_setTags(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolPush_setActionListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolPush* cobj = (ProtocolPush *)(proxy ? proxy->ptr : NULL);
    if (argc != 1)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolPush_setTags : wrong number of arguments: %d, was expecting %d", argc, 0);
        return true;
    }
    JS::RootedValue arg0(cx, args.get(0));
    if ( arg0.isObject() ){
        list<std::string> arg;
        JS::RootedObject jsobj(cx, arg0.toObjectOrNull());
        bool isArray = false;
        JSB_PRECONDITION3(jsobj && JS_IsArrayObject(cx, jsobj, &isArray) && isArray, cx, false, "Object must be an array");
        
        uint32_t len;
        JS_GetArrayLength(cx, jsobj, &len);
        
        for( uint32_t i=0; i< len;i++ ) {
            JS::RootedValue valarg(cx);
            JS_GetElement(cx, jsobj, i, &valarg);
            
            if( valarg.isString() )
            {
                CCLOG("value is string;");
                std::string key;
                bool ok = jsval_to_std_string(cx, valarg, &key);
                if (ok)
                {
                    CCLOG("key: %s.", key.c_str());
                    arg.push_back( key );
                }
            }
        }
        cobj->setTags(arg);
    }
    else {
        CCLOG("settags: is not object.");
    }
    return true;
}

static bool jsb_anysdk_framework_ProtocolPush_delTags(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolPush_setActionListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolPush* cobj = (ProtocolPush *)(proxy ? proxy->ptr : NULL);
    if (argc != 1)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolPush_delTags : wrong number of arguments: %d, was expecting %d", argc, 0);
        return true;
    }
    JS::RootedValue arg0(cx, args.get(0));
    if ( arg0.isObject() ){
        list<std::string> arg;
        JS::RootedObject jsobj(cx, arg0.toObjectOrNull());
        bool isArray = false;
        JSB_PRECONDITION3(jsobj && JS_IsArrayObject( cx, jsobj, &isArray) && isArray, cx, false, "Object must be an array");
        
        uint32_t len;
        JS_GetArrayLength(cx, jsobj, &len);
        
        for( uint32_t i=0; i< len;i++ ) {
            JS::RootedValue valarg(cx);
            JS_GetElement(cx, jsobj, i, &valarg);
            
            if( valarg.isString() )
            {
                CCLOG("value is string;");
                std::string key;
                bool ok = jsval_to_std_string(cx, valarg, &key);
                if (ok)
                {
                    CCLOG("key: %s.", key.c_str());
                    arg.push_back( key );
                }
            }
        }
        cobj->delTags(arg);
    }
    return true;
}

class ProtocolUserActionListener : public UserActionListener, public JSFunctionWrapper
{
public:
    ProtocolUserActionListener(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    : JSFunctionWrapper(cx, jsthis, func, owner)
    {
    }
    ~ProtocolUserActionListener()
    {
        CCLOG("on user action result ~listener");
    }
    
    virtual void onActionResult(ProtocolUser* pPlugin, UserActionResultCode code, const char* msg)
    {
        CCLOG("on user action result: %d, msg: %s.", code, msg);
        
        JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedObject paramObj(cx);
        js_get_or_create_jsobject<ProtocolUser>(cx, pPlugin, &paramObj);
        JS::RootedValue retval(cx);
        JS::AutoValueVector valArr(cx);
        JS::RootedValue tmp(cx);
        valArr.append( JS::ObjectOrNullValue(paramObj) );
        valArr.append( JS::Int32Value(code) );
        std_string_to_jsval(cx, msg, &tmp);
        valArr.append( tmp );
        
        JS::HandleValueArray args(valArr);
        invoke(args, &retval);
    }
    
    static ProtocolUserActionListener* _instance;
    static ProtocolUserActionListener* getInstance(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner){
        if (_instance == nullptr)
        {
            _instance = new ProtocolUserActionListener(cx, jsthis, func, owner);
        }
        else
        {
            _instance->setOwner(cx, owner);
            _instance->setJSTarget(cx, jsthis);
            _instance->setJSCallback(cx, func);
        }
        return _instance;
    }
    static void purge(){
        if (_instance)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
};
ProtocolUserActionListener* ProtocolUserActionListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolUser_setActionListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolUser_setActionListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolUser* cobj = (ProtocolUser *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc != 2)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolUser_setActionListener : wrong number of arguments: %d, was expecting %d", argc, 0);
        return false;
    }
    JS::RootedObject jsthis(cx, args.get(1).toObjectOrNull());
    JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
    ProtocolUserActionListener* listener = ProtocolUserActionListener::getInstance(cx, jsthis, jsfunc, obj);
    cobj->setActionListener(listener);
    return true;
}
static bool jsb_anysdk_framework_ProtocolUser_removeListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolUser_removeListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolUser* cobj = (ProtocolUser *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (ProtocolUserActionListener::_instance != NULL)
    {
        ProtocolUserActionListener::purge();
    }
    if(argc != 0)
    CCLOG("ProtocolUser_removeListener has wrong number of arguments.");
    return true;
}

class ProtocolSocialListener : public SocialListener, public JSFunctionWrapper
{
public:
    ProtocolSocialListener(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    : JSFunctionWrapper(cx, jsthis, func, owner)
    {
    }
    ~ProtocolSocialListener()
    {
        CCLOG("on social result ~listener");
    }
    
    virtual void onSocialResult(SocialRetCode code, const char* msg)
    {
        CCLOG("on action result: %d, msg: %s.", code, msg);
        
        JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedValue retval(cx);
        JS::AutoValueVector valArr(cx);
        JS::RootedValue tmp(cx);
        valArr.append( JS::Int32Value(code) );
        std_string_to_jsval(cx, msg, &tmp);
        valArr.append( tmp );
        JS::HandleValueArray args(valArr);
        invoke(args, &retval);
    }
    
    static ProtocolSocialListener* _instance;
    static ProtocolSocialListener* getInstance(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    {
        if (_instance == nullptr)
        {
            _instance = new ProtocolSocialListener(cx, jsthis, func, owner);
        }
        else
        {
            _instance->setOwner(cx, owner);
            _instance->setJSTarget(cx, jsthis);
            _instance->setJSCallback(cx, func);
        }
        return _instance;
    }
    static void purge()
    {
        if (_instance != NULL)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
};
ProtocolSocialListener* ProtocolSocialListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolSocial_setListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolSocial_setListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolSocial* cobj = (ProtocolSocial *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc != 2)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolSocial_setListener : wrong number of arguments: %d, was expecting %d", argc, 0);
        return false;
    }
    JS::RootedObject jsthis(cx, args.get(1).toObjectOrNull());
    JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
    ProtocolSocialListener* listener = ProtocolSocialListener::getInstance(cx, jsthis, jsfunc, obj);
    cobj->setListener(listener);
    return true;
}

static bool jsb_anysdk_framework_ProtocolSocial_removeListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolSocial_removeListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolSocial* cobj = (ProtocolSocial *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (ProtocolSocialListener::_instance != NULL)
    {
        ProtocolSocialListener::purge();
    }
    if(argc != 0)
    CCLOG("ProtocolSocial_removeListener has wrong number of arguments.");
    return true;
}

static bool jsb_anysdk_framework_ProtocolSocial_unlockAchievement(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolSocial_unlockAchievement, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolSocial* cobj = (ProtocolSocial *)(proxy ? proxy->ptr : NULL);
    if (argc != 1)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolSocial_unlockAchievement : wrong number of arguments: %d, was expecting %d", argc, 0);
        return false;
    }
    JS::RootedValue arg0(cx, args.get(0));
    if ( arg0.isObject() ){
        if (arg0.isNullOrUndefined()) {
            CCLOG("%s", "jsval_to_ccvaluemap: the jsval is not an object.");
            return false;
        }
        
        TAchievementInfo arg;
        bool ok = jsval_to_std_map_string_string(cx, arg0, &arg);
        JSB_PRECONDITION2(ok, cx, false, "jsb_anysdk_framework_ProtocolSocial_unlockAchievement : Error processing arguments");
        
        cobj->unlockAchievement( arg );
    }
    return true;
}

class ProtocolRECListener : public RECResultListener, public JSFunctionWrapper
{
public:
    ProtocolRECListener(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    : JSFunctionWrapper(cx, jsthis, func, owner)
    {
    }
    ~ProtocolRECListener()
    {
        CCLOG("on REC result ~listener");
    }
    
    virtual void onRECResult(RECResultCode code, const char* msg)
    {
        CCLOG("on action result: %d, msg: %s.", code, msg);
        
        JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedValue retval(cx);
        JS::AutoValueVector valArr(cx);
        JS::RootedValue tmp(cx);
        valArr.append( JS::Int32Value(code) );
        std_string_to_jsval(cx, msg, &tmp);
        valArr.append( tmp );
        
        JS::HandleValueArray args(valArr);
        invoke(args, &retval);
    }
    
    static ProtocolRECListener* _instance;
    static ProtocolRECListener* getInstance(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    {
        if (_instance == nullptr)
        {
            _instance = new ProtocolRECListener(cx, jsthis, func, owner);
        }
        else
        {
            _instance->setOwner(cx, owner);
            _instance->setJSTarget(cx, jsthis);
            _instance->setJSCallback(cx, func);
        }
        return _instance;
    }
    static void purge()
    {
        if (_instance != NULL)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
};
ProtocolRECListener* ProtocolRECListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolREC_setResultListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolREC_setListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolREC* cobj = (ProtocolREC *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc != 2)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolREC_setListener : wrong number of arguments: %d, was expecting %d", argc, 0);
        return false;
    }
    JS::RootedObject jsthis(cx, args.get(1).toObjectOrNull());
    JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
    ProtocolRECListener* listener = ProtocolRECListener::getInstance(cx, jsthis, jsfunc, obj);
    cobj->setResultListener(listener);
    return true;
}

static bool jsb_anysdk_framework_ProtocolREC_removeListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolREC_removeListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolREC* cobj = (ProtocolREC *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (ProtocolRECListener::_instance != NULL)
    {
        ProtocolRECListener::purge();
    }
    if(argc != 0)
    CCLOG("ProtocolREC_removeListener has wrong number of arguments.");
    return true;
}

class ProtocolCustomListener : public CustomResultListener, public JSFunctionWrapper
{
public:
    ProtocolCustomListener(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    : JSFunctionWrapper(cx, jsthis, func, owner)
    {
    }
    ~ProtocolCustomListener()
    {
        CCLOG("on Custom result ~listener");
    }
    
    virtual void onCustomResult(CustomResultCode code, const char* msg)
    {
        CCLOG("on action result: %d, msg: %s.", code, msg);
        
        JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
        JS::RootedValue retval(cx);
        JS::AutoValueVector valArr(cx);
        JS::RootedValue tmp(cx);
        valArr.append( JS::Int32Value(code) );
        std_string_to_jsval(cx, msg, &tmp);
        valArr.append( tmp );
        
        JS::HandleValueArray args(valArr);
        invoke(args, &retval);
    }
    
    static ProtocolCustomListener* _instance;
    static ProtocolCustomListener* getInstance(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner)
    {
        if (_instance == nullptr)
        {
            _instance = new ProtocolCustomListener(cx, jsthis, func, owner);
        }
        else
        {
            _instance->setOwner(cx, owner);
            _instance->setJSTarget(cx, jsthis);
            _instance->setJSCallback(cx, func);
        }
        return _instance;
    }
    static void purge()
    {
        if (_instance != NULL)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
};
ProtocolCustomListener* ProtocolCustomListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolCustom_setResultListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolCustom_setListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolCustom* cobj = (ProtocolCustom *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc != 2)
    {
        JS_ReportErrorUTF8(cx, "jsb_anysdk_framework_ProtocolCustom_setListener : wrong number of arguments: %d, was expecting %d", argc, 0);
        return false;
    }
    JS::RootedObject jsthis(cx, args.get(1).toObjectOrNull());
    JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
    ProtocolCustomListener* listener = ProtocolCustomListener::getInstance(cx, jsthis, jsfunc, obj);
    cobj->setResultListener(listener);
    return true;
}

static bool jsb_anysdk_framework_ProtocolCustom_removeListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    CCLOG("in ProtocolCustom_removeListener, argc:%d.", argc);
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ProtocolCustom* cobj = (ProtocolCustom *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (ProtocolCustomListener::_instance != NULL)
    {
        ProtocolCustomListener::purge();
    }
    if(argc != 0)
    CCLOG("ProtocolCustom_removeListener has wrong number of arguments.");
    return true;
}

extern JSObject* jsb_anysdk_framework_ProtocolREC_prototype;
extern JSObject* jsb_anysdk_framework_ProtocolCustom_prototype;
extern JSObject* jsb_anysdk_framework_PluginProtocol_prototype;
extern JSObject* jsb_anysdk_framework_ProtocolYAP_prototype;
extern JSObject* jsb_anysdk_framework_ProtocolAnalytics_prototype;
extern JSObject* jsb_anysdk_framework_ProtocolAds_prototype;
extern JSObject* jsb_anysdk_framework_ProtocolSocial_prototype;
extern JSObject* jsb_anysdk_framework_ProtocolPush_prototype;
extern JSObject* jsb_anysdk_framework_ProtocolUser_prototype;
extern JSObject* jsb_anysdk_framework_AgentManager_prototype;


void register_all_anysdk_manual(JSContext* cx, JS::HandleObject obj) {
    JS::RootedObject anysdkObj(cx);
    JS::RootedObject proto(cx);
    get_or_create_js_obj(cx, obj, "anysdk", &anysdkObj);
    
    js_register_anysdkbindings_PluginParam(cx, anysdkObj);
    js_register_anysdkbindings_ProtocolShare(cx, anysdkObj);
    
    //PluginProtocol
    proto.set(jsb_anysdk_framework_PluginProtocol_prototype);
    JS_DefineFunction(cx, proto, "callFuncWithParam", jsb_anysdk_framework_PluginProtocol_callFuncWithParam, 6, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "callStringFuncWithParam", jsb_anysdk_framework_PluginProtocol_callStringFuncWithParam, 6, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "callIntFuncWithParam", jsb_anysdk_framework_PluginProtocol_callIntFuncWithParam, 6, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "callBoolFuncWithParam", jsb_anysdk_framework_PluginProtocol_callBoolFuncWithParam, 6, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "callFloatFuncWithParam", jsb_anysdk_framework_PluginProtocol_callFloatFuncWithParam, 6, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    //AgentManager
    proto.set(jsb_anysdk_framework_AgentManager_prototype);
    JS_DefineFunction(cx, proto, "getYAPPlugin", jsb_anysdk_framework_AgentManager_getYAPPlugin, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "getFrameworkVersion", jsb_anysdk_framework_AgentManager_getFrameworkVersion, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    //ProtocolAds
    proto.set(jsb_anysdk_framework_ProtocolAds_prototype);
    JS_DefineFunction(cx, proto, "setAdsListener", jsb_anysdk_framework_ProtocolAds_setAdsListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "removeListener", jsb_anysdk_framework_ProtocolAds_removeListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    //ProtocolAnalytics
    proto.set(jsb_anysdk_framework_ProtocolAnalytics_prototype);
    JS_DefineFunction(cx, proto, "logEvent", jsb_anysdk_framework_ProtocolAnalytics_logEvent, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    //ProtocolYAP
    proto.set(jsb_anysdk_framework_ProtocolYAP_prototype);
    JS_DefineFunction(cx, proto, "setResultListener", jsb_anysdk_framework_ProtocolYAP_setResultListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "removeListener", jsb_anysdk_framework_ProtocolYAP_removeListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "yapForProduct", jsb_anysdk_framework_ProtocolYAP_yapForProduct, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    //ProtocolSocial
    proto.set(jsb_anysdk_framework_ProtocolSocial_prototype);
    JS_DefineFunction(cx, proto, "setListener", jsb_anysdk_framework_ProtocolSocial_setListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "removeListener", jsb_anysdk_framework_ProtocolSocial_removeListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "unlockAchievement", jsb_anysdk_framework_ProtocolSocial_unlockAchievement, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    //ProtocolPush
    proto.set(jsb_anysdk_framework_ProtocolPush_prototype);
    JS_DefineFunction(cx, proto, "setActionListener", jsb_anysdk_framework_ProtocolPush_setActionListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "removeListener", jsb_anysdk_framework_ProtocolPush_removeListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "setTags", jsb_anysdk_framework_ProtocolPush_setTags, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "delTags", jsb_anysdk_framework_ProtocolPush_delTags, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    //ProtocolUser
    proto.set(jsb_anysdk_framework_ProtocolUser_prototype);
    JS_DefineFunction(cx, proto, "setActionListener", jsb_anysdk_framework_ProtocolUser_setActionListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "removeListener", jsb_anysdk_framework_ProtocolUser_removeListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    //ProtocolCustom
    proto.set(jsb_anysdk_framework_ProtocolCustom_prototype);
    JS_DefineFunction(cx, proto, "setResultListener", jsb_anysdk_framework_ProtocolCustom_setResultListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "removeListener", jsb_anysdk_framework_ProtocolCustom_removeListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    //ProtocolREC
    proto.set(jsb_anysdk_framework_ProtocolREC_prototype);
    JS_DefineFunction(cx, proto, "setResultListener", jsb_anysdk_framework_ProtocolREC_setResultListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "removeListener", jsb_anysdk_framework_ProtocolREC_removeListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    cocos2d::EventListenerCustom* _event = cocos2d::Director::getInstance()->getEventDispatcher()->addCustomEventListener(ScriptingCore::EVENT_RESET, [&](cocos2d::EventCustom *event) {
        cocos2d::Director::getInstance()->getEventDispatcher()->removeEventListener(_event);
        
        ProtocolYAPResultListener::clear();
        if (ProtocolAdsResultListener::_instance != nullptr)
        {
            CC_SAFE_DELETE(ProtocolAdsResultListener::_instance);
        }
        if (ProtocolSocialListener::_instance != nullptr)
        {
            CC_SAFE_DELETE(ProtocolSocialListener::_instance);
        }
        if (ProtocolPushActionListener::_instance != nullptr)
        {
            CC_SAFE_DELETE(ProtocolPushActionListener::_instance);
        }
        if (ProtocolUserActionListener::_instance != nullptr)
        {
            CC_SAFE_DELETE(ProtocolUserActionListener::_instance);
        }
        if (ProtocolCustomListener::_instance != nullptr)
        {
            CC_SAFE_DELETE(ProtocolCustomListener::_instance);
        }
        if (ProtocolRECListener::_instance != nullptr)
        {
            CC_SAFE_DELETE(ProtocolRECListener::_instance);
        }
    });
}
