#include "scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_webView_manual.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

#include "ui/UIWebView.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"

using namespace cocos2d;


static bool jsb_cocos2dx_experimental_webView_setOnShouldStartLoading(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    experimental::ui::WebView* cobj = (experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if(argc == 1){
        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, obj, jsfunc, obj));
        cobj->setOnShouldStartLoading([=](experimental::ui::WebView *sender, const std::string &url)->bool{
            JS::AutoValueVector arg(cx);
            JS::RootedObject jsobj(cx);
            js_get_or_create_jsobject<experimental::ui::WebView>(cx, sender, &jsobj);
            arg.append(JS::ObjectOrNullValue(jsobj));
            JS::RootedValue larg(cx);
            std_string_to_jsval(cx, url, &larg);
            arg.append(larg);
            JS::HandleValueArray argsv(arg);
            JS::RootedValue rval(cx);

            bool ok = func->invoke(argsv, &rval);
            if (!ok && JS_IsExceptionPending(cx)) {
                handlePendingException(cx);
            }
            return rval.toBoolean();
        });
        return true;
    }

    JS_ReportErrorUTF8(cx, "jsb_cocos2dx_experimental_webView_setOnShouldStartLoading : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

static bool jsb_cocos2dx_experimental_webView_setOnDidFinishLoading(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    experimental::ui::WebView* cobj = (experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if(argc == 1){
        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, obj, jsfunc, obj));
        cobj->setOnDidFinishLoading([=](experimental::ui::WebView *sender, const std::string &url)->void{
            JS::AutoValueVector arg(cx);
            JS::RootedObject jsobj(cx);
            js_get_or_create_jsobject<experimental::ui::WebView>(cx, sender, &jsobj);
            arg.append(JS::ObjectOrNullValue(jsobj));
            JS::RootedValue larg(cx);
            std_string_to_jsval(cx, url, &larg);
            arg.append(larg);
            JS::HandleValueArray argsv(arg);
            JS::RootedValue rval(cx);

            bool ok = func->invoke(argsv, &rval);
            if (!ok && JS_IsExceptionPending(cx)) {
                handlePendingException(cx);
            }
        });
        return true;
    }

    JS_ReportErrorUTF8(cx, "jsb_cocos2dx_experimental_webView_setOnDidFinishLoading : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

static bool jsb_cocos2dx_experimental_webView_setOnDidFailLoading(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    experimental::ui::WebView* cobj = (experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if(argc == 1){
        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, obj, jsfunc, obj));
        cobj->setOnDidFailLoading([=](experimental::ui::WebView *sender, const std::string &url)->void{
            JS::AutoValueVector arg(cx);
            JS::RootedObject jsobj(cx);
            js_get_or_create_jsobject<experimental::ui::WebView>(cx, sender, &jsobj);
            arg.append(JS::ObjectOrNullValue(jsobj));
            JS::RootedValue larg(cx);
            std_string_to_jsval(cx, url, &larg);
            arg.append(larg);
            JS::HandleValueArray argsv(arg);
            JS::RootedValue rval(cx);

            bool ok = func->invoke(argsv, &rval);
            if (!ok && JS_IsExceptionPending(cx)) {
                handlePendingException(cx);
            }
        });
        return true;
    }

    JS_ReportErrorUTF8(cx, "jsb_cocos2dx_experimental_webView_setOnDidFailLoading : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

static bool jsb_cocos2dx_experimental_webView_setOnJSCallback(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    experimental::ui::WebView* cobj = (experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if(argc == 1){
        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, obj, jsfunc, obj));
        cobj->setOnJSCallback([=](experimental::ui::WebView *sender, const std::string &url)->void{
            JS::AutoValueVector arg(cx);
            JS::RootedObject jsobj(cx);
            js_get_or_create_jsobject<experimental::ui::WebView>(cx, sender, &jsobj);
            arg.append(JS::ObjectOrNullValue(jsobj));
            JS::RootedValue larg(cx);
            std_string_to_jsval(cx, url, &larg);
            arg.append(larg);
            JS::HandleValueArray argsv(arg);
            JS::RootedValue rval(cx);

            bool ok = func->invoke(argsv, &rval);
            if (!ok && JS_IsExceptionPending(cx)) {
                handlePendingException(cx);
            }
        });
        return true;
    }

    JS_ReportErrorUTF8(cx, "jsb_cocos2dx_experimental_webView_setOnJSCallback : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
extern JS::PersistentRootedObject* jsb_cocos2d_experimental_ui_WebView_prototype;

void register_all_cocos2dx_experimental_webView_manual(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject proto(cx, jsb_cocos2d_experimental_ui_WebView_prototype->get());
    JS_DefineFunction(cx, proto, "setOnShouldStartLoading", jsb_cocos2dx_experimental_webView_setOnShouldStartLoading, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "setOnDidFinishLoading", jsb_cocos2dx_experimental_webView_setOnDidFinishLoading, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "setOnDidFailLoading", jsb_cocos2dx_experimental_webView_setOnDidFailLoading, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, proto, "setOnJSCallback", jsb_cocos2dx_experimental_webView_setOnJSCallback, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
}

#endif
