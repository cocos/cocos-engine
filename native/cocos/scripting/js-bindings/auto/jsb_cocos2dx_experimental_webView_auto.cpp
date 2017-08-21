#include "scripting/js-bindings/auto/jsb_cocos2dx_experimental_webView_auto.hpp"
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "ui/UIWebView.h"

JSClass  *jsb_cocos2d_experimental_ui_WebView_class;
JS::PersistentRootedObject *jsb_cocos2d_experimental_ui_WebView_prototype;

bool js_cocos2dx_experimental_webView_WebView_canGoBack(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_canGoBack : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->canGoBack();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_canGoBack : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_canGoBack : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_loadHTMLString(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_loadHTMLString : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_loadHTMLString : Error processing arguments");
        cobj->loadHTMLString(arg0);
        args.rval().setUndefined();
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_loadHTMLString : Error processing arguments");
        cobj->loadHTMLString(arg0, arg1);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_loadHTMLString : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_goForward(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_goForward : Invalid Native Object");
    if (argc == 0) {
        cobj->goForward();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_goForward : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_goBack(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_goBack : Invalid Native Object");
    if (argc == 0) {
        cobj->goBack();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_goBack : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_setScalesPageToFit(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_setScalesPageToFit : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_setScalesPageToFit : Error processing arguments");
        cobj->setScalesPageToFit(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_setScalesPageToFit : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_getOnDidFailLoading(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_getOnDidFailLoading : Invalid Native Object");
    if (argc == 0) {
        cocos2d::experimental::ui::WebView::ccWebViewCallback ret = cobj->getOnDidFailLoading();
        JS::RootedValue jsret(cx);
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_getOnDidFailLoading : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_getOnDidFailLoading : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_loadFile(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_loadFile : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_loadFile : Error processing arguments");
        cobj->loadFile(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_loadFile : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_loadURL(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_loadURL : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_loadURL : Error processing arguments");
        cobj->loadURL(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_loadURL : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_setBounces(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_setBounces : Invalid Native Object");
    if (argc == 1) {
        bool arg0;
        ok &= jsval_to_bool(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_setBounces : Error processing arguments");
        cobj->setBounces(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_setBounces : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_evaluateJS(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_evaluateJS : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_evaluateJS : Error processing arguments");
        cobj->evaluateJS(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_evaluateJS : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_setOnJSCallback(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_setOnJSCallback : Invalid Native Object");
    if (argc == 1) {
        std::function<void (cocos2d::experimental::ui::WebView *, const std::basic_string<char> &)> arg0;
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
		        auto lambda = [=](cocos2d::experimental::ui::WebView* larg0, const std::basic_string<char> & larg1) -> void {
		            bool ok = true;
		            JS::AutoValueVector valArr(cx);
		            JS::RootedValue largv(cx);
		            if (larg0) {
		            JS::RootedObject largvObj(cx);
		            js_get_or_create_jsobject<cocos2d::experimental::ui::WebView>(cx, (cocos2d::experimental::ui::WebView*)larg0, &largvObj);
		            largv = JS::ObjectOrNullValue(largvObj);
		        } else {
		            largv = JS::NullHandleValue;
		        };
		            valArr.append(largv);
		            ok &= std_string_to_jsval(cx, larg1, &largv);
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
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_setOnJSCallback : Error processing arguments");
        cobj->setOnJSCallback(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_setOnJSCallback : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_getOnJSCallback(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_getOnJSCallback : Invalid Native Object");
    if (argc == 0) {
        cocos2d::experimental::ui::WebView::ccWebViewCallback ret = cobj->getOnJSCallback();
        JS::RootedValue jsret(cx);
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_getOnJSCallback : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_getOnJSCallback : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_canGoForward(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_canGoForward : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->canGoForward();
        JS::RootedValue jsret(cx);
        jsret = JS::BooleanValue(ret);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_canGoForward : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_canGoForward : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_getOnShouldStartLoading(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_getOnShouldStartLoading : Invalid Native Object");
    if (argc == 0) {
        std::function<bool (cocos2d::experimental::ui::WebView *, const std::basic_string<char> &)> ret = cobj->getOnShouldStartLoading();
        JS::RootedValue jsret(cx);
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_getOnShouldStartLoading : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_getOnShouldStartLoading : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_stopLoading(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_stopLoading : Invalid Native Object");
    if (argc == 0) {
        cobj->stopLoading();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_stopLoading : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_reload(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_reload : Invalid Native Object");
    if (argc == 0) {
        cobj->reload();
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_reload : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_setJavascriptInterfaceScheme(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_setJavascriptInterfaceScheme : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_setJavascriptInterfaceScheme : Error processing arguments");
        cobj->setJavascriptInterfaceScheme(arg0);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_setJavascriptInterfaceScheme : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_getOnDidFinishLoading(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_experimental_webView_WebView_getOnDidFinishLoading : Invalid Native Object");
    if (argc == 0) {
        cocos2d::experimental::ui::WebView::ccWebViewCallback ret = cobj->getOnDidFinishLoading();
        JS::RootedValue jsret(cx);
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_experimental_webView_WebView_getOnDidFinishLoading : error parsing return value");
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_getOnDidFinishLoading : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_cocos2dx_experimental_webView_WebView_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true; CC_UNUSED_PARAM(ok);
    if (argc == 0) {

        auto ret = cocos2d::experimental::ui::WebView::create();
        JS::RootedObject jsret(cx);
        JS::RootedObject proto(cx, jsb_cocos2d_experimental_ui_WebView_prototype->get());
        jsb_ref_autoreleased_create_jsobject(cx, ret, jsb_cocos2d_experimental_ui_WebView_class, proto, &jsret, "cocos2d::experimental::ui::WebView");
        args.rval().set(JS::ObjectOrNullValue(jsret));
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_experimental_webView_WebView_create : wrong number of arguments");
    return false;
}

bool js_cocos2dx_experimental_webView_WebView_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    cocos2d::experimental::ui::WebView* cobj = new (std::nothrow) cocos2d::experimental::ui::WebView();

    // create the js object and link the native object with the javascript object
    JS::RootedObject jsobj(cx);
    JS::RootedObject proto(cx, jsb_cocos2d_experimental_ui_WebView_prototype->get());
    jsb_ref_create_jsobject(cx, cobj, jsb_cocos2d_experimental_ui_WebView_class, proto, &jsobj, "cocos2d::experimental::ui::WebView");
    JS::RootedValue retVal(cx, JS::ObjectOrNullValue(jsobj));
    args.rval().set(retVal);
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok) 
    {
        JS::HandleValueArray argsv(args);
        ScriptingCore::getInstance()->executeFunctionWithOwner(retVal, "_ctor", argsv);
    }
    return true;
}


extern JS::PersistentRootedObject *jsb_cocos2d_ui_Widget_prototype;

void js_register_cocos2dx_experimental_webView_WebView(JSContext *cx, JS::HandleObject global) {
    static const JSClassOps cocos2d_experimental_ui_WebView_classOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        nullptr,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass cocos2d_experimental_ui_WebView_class = {
        "WebView",
        JSCLASS_HAS_PRIVATE,
        &cocos2d_experimental_ui_WebView_classOps
    };
    jsb_cocos2d_experimental_ui_WebView_class = &cocos2d_experimental_ui_WebView_class;

    static JSFunctionSpec funcs[] = {
        JS_FN("canGoBack", js_cocos2dx_experimental_webView_WebView_canGoBack, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("loadHTMLString", js_cocos2dx_experimental_webView_WebView_loadHTMLString, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("goForward", js_cocos2dx_experimental_webView_WebView_goForward, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("goBack", js_cocos2dx_experimental_webView_WebView_goBack, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setScalesPageToFit", js_cocos2dx_experimental_webView_WebView_setScalesPageToFit, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getOnDidFailLoading", js_cocos2dx_experimental_webView_WebView_getOnDidFailLoading, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("loadFile", js_cocos2dx_experimental_webView_WebView_loadFile, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("loadURL", js_cocos2dx_experimental_webView_WebView_loadURL, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setBounces", js_cocos2dx_experimental_webView_WebView_setBounces, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("evaluateJS", js_cocos2dx_experimental_webView_WebView_evaluateJS, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setOnJSCallback", js_cocos2dx_experimental_webView_WebView_setOnJSCallback, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getOnJSCallback", js_cocos2dx_experimental_webView_WebView_getOnJSCallback, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("canGoForward", js_cocos2dx_experimental_webView_WebView_canGoForward, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getOnShouldStartLoading", js_cocos2dx_experimental_webView_WebView_getOnShouldStartLoading, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("stopLoading", js_cocos2dx_experimental_webView_WebView_stopLoading, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("reload", js_cocos2dx_experimental_webView_WebView_reload, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("setJavascriptInterfaceScheme", js_cocos2dx_experimental_webView_WebView_setJavascriptInterfaceScheme, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getOnDidFinishLoading", js_cocos2dx_experimental_webView_WebView_getOnDidFinishLoading, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("create", js_cocos2dx_experimental_webView_WebView_create, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JS::RootedObject parent_proto(cx, jsb_cocos2d_ui_Widget_prototype->get());
    JS::RootedObject proto(cx, JS_InitClass(
        cx, global,
        parent_proto,
        jsb_cocos2d_experimental_ui_WebView_class,
        js_cocos2dx_experimental_webView_WebView_constructor, 0,
        nullptr,
        funcs,
        nullptr,
        st_funcs));

    // add the proto and JSClass to the type->js info hash table
    js_type_class_t *typeClass = jsb_register_class<cocos2d::experimental::ui::WebView>(cx, jsb_cocos2d_experimental_ui_WebView_class, proto);
    jsb_cocos2d_experimental_ui_WebView_prototype = typeClass->proto;
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "WebView", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
}

void register_all_cocos2dx_experimental_webView(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "ccui", &ns);

    js_register_cocos2dx_experimental_webView_WebView(cx, ns);
}

#endif //#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)
