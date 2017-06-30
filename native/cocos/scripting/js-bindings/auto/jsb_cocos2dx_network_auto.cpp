#include "scripting/js-bindings/auto/jsb_cocos2dx_network_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "network/CCDownloader.h"
#include "network/js_network_manual.h"

JSClass  *jsb_cocos2d_network_Downloader_class;
JS::PersistentRootedObject *jsb_cocos2d_network_Downloader_prototype;

bool js_cocos2dx_network_Downloader_setOnTaskError(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::network::Downloader* cobj = (cocos2d::network::Downloader *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_network_Downloader_setOnTaskError : Invalid Native Object");
    if (argc == 1) {
        std::function<void (const cocos2d::network::DownloadTask &, int, int, const std::basic_string<char> &)> arg0;
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
		        auto lambda = [=](const cocos2d::network::DownloadTask & larg0, int larg1, int larg2, const std::basic_string<char> & larg3) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            ok &= downloadTask_to_jsval(cx, larg0, &largv);
		            valArr.append(largv);
		            largv = JS::Int32Value(larg1);
		            valArr.append(largv);
		            largv = JS::Int32Value(larg2);
		            valArr.append(largv);
		            ok &= std_string_to_jsval(cx, larg3, &largv);
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
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_network_Downloader_setOnTaskError : Error processing arguments");
        cobj->setOnTaskError(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_network_Downloader_setOnTaskError : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_network_Downloader_setOnTaskProgress(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::network::Downloader* cobj = (cocos2d::network::Downloader *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_network_Downloader_setOnTaskProgress : Invalid Native Object");
    if (argc == 1) {
        std::function<void (const cocos2d::network::DownloadTask &, long long, long long, long long)> arg0;
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
		        auto lambda = [=](const cocos2d::network::DownloadTask & larg0, long long larg1, long long larg2, long long larg3) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            ok &= downloadTask_to_jsval(cx, larg0, &largv);
		            valArr.append(largv);
		            ok &= long_long_to_jsval(cx, larg1, &largv);
		            valArr.append(largv);
		            ok &= long_long_to_jsval(cx, larg2, &largv);
		            valArr.append(largv);
		            ok &= long_long_to_jsval(cx, larg3, &largv);
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
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_network_Downloader_setOnTaskProgress : Error processing arguments");
        cobj->setOnTaskProgress(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_network_Downloader_setOnTaskProgress : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_network_Downloader_createDownloadFileTask(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::network::Downloader* cobj = (cocos2d::network::Downloader *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_network_Downloader_createDownloadFileTask : Invalid Native Object");
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_network_Downloader_createDownloadFileTask : Error processing arguments");
        std::shared_ptr<const cocos2d::network::DownloadTask> ret = cobj->createDownloadFileTask(arg0, arg1);
        JS::RootedValue jsret(cx);
        ok &= downloadTask_to_jsval(cx, *ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_network_Downloader_createDownloadFileTask : error parsing return value");
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
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_network_Downloader_createDownloadFileTask : Error processing arguments");
        std::shared_ptr<const cocos2d::network::DownloadTask> ret = cobj->createDownloadFileTask(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);
        ok &= downloadTask_to_jsval(cx, *ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_network_Downloader_createDownloadFileTask : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_network_Downloader_createDownloadFileTask : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_network_Downloader_setOnFileTaskSuccess(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::network::Downloader* cobj = (cocos2d::network::Downloader *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_network_Downloader_setOnFileTaskSuccess : Invalid Native Object");
    if (argc == 1) {
        std::function<void (const cocos2d::network::DownloadTask &)> arg0;
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
		        auto lambda = [=](const cocos2d::network::DownloadTask & larg0) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            ok &= downloadTask_to_jsval(cx, larg0, &largv);
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
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_network_Downloader_setOnFileTaskSuccess : Error processing arguments");
        cobj->setOnFileTaskSuccess(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_network_Downloader_setOnFileTaskSuccess : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_network_Downloader_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    bool ok = true;
    cocos2d::network::Downloader* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    do {
        ok = true;
        if (argc == 1) {
            cocos2d::network::DownloaderHints arg0;
            ok &= jsval_to_DownloaderHints(cx, args.get(0), &arg0);
            if (!ok) { ok = true; break; }
            cobj = new (std::nothrow) cocos2d::network::Downloader(arg0);

            JS::RootedObject proto(cx, jsb_cocos2d_network_Downloader_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_cocos2d_network_Downloader_class, proto);
            jsb_non_ref_init(cx, obj, cobj, "cocos2d::network::Downloader");
            JS_SetPrivate(obj.get(), cobj);
            jsb_new_proxy(cx, cobj, obj);
        }
    } while(0);

    do {
        ok = true;
        if (argc == 0) {
            cobj = new (std::nothrow) cocos2d::network::Downloader();

            JS::RootedObject proto(cx, jsb_cocos2d_network_Downloader_prototype->get());
            obj = JS_NewObjectWithGivenProto(cx, jsb_cocos2d_network_Downloader_class, proto);
            jsb_non_ref_init(cx, obj, cobj, "cocos2d::network::Downloader");
            JS_SetPrivate(obj.get(), cobj);
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
    JS_ReportErrorUTF8(cx, "js_cocos2dx_network_Downloader_constructor : arguments error");
    return false;
}


void js_cocos2d_network_Downloader_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (Downloader)", obj);
    cocos2d::network::Downloader *nobj = static_cast<cocos2d::network::Downloader *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}
void js_register_cocos2dx_network_Downloader(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_network_Downloader_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_cocos2d_network_Downloader_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_network_Downloader_class = {
        "Downloader",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &cocos2d_network_Downloader_classOps
    };
    jsb_cocos2d_network_Downloader_class = &cocos2d_network_Downloader_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("setOnTaskError", js_cocos2dx_network_Downloader_setOnTaskError, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setOnTaskProgress", js_cocos2dx_network_Downloader_setOnTaskProgress, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("createDownloadFileTask", js_cocos2dx_network_Downloader_createDownloadFileTask, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setOnFileTaskSuccess", js_cocos2dx_network_Downloader_setOnFileTaskSuccess, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, nullptr);
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_network_Downloader_class,
        js_cocos2dx_network_Downloader_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        nullptr));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::network::Downloader>(cx, jsb_cocos2d_network_Downloader_class, proto);
    jsb_cocos2d_network_Downloader_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "Downloader", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
}

void register_all_cocos2dx_network(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "jsb", &ns);

    js_register_cocos2dx_network_Downloader(cx, ns);
}

