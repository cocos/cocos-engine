#include "scripting/js-bindings/auto/jsb_cocos2dx_experimental_webView_auto.hpp"
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "ui/UIWebView.h"

se::Object* __jsb_cocos2d_experimental_ui_WebView_proto = nullptr;
se::Class* __jsb_cocos2d_experimental_ui_WebView_class = nullptr;

static bool js_cocos2dx_experimental_webView_WebView_canGoBack(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_canGoBack : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->canGoBack();
        ok &= boolean_to_seval(result, &s.rval());
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_canGoBack : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_canGoBack)

static bool js_cocos2dx_experimental_webView_WebView_loadHTMLString(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_loadHTMLString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_loadHTMLString : Error processing arguments");
        cobj->loadHTMLString(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_loadHTMLString : Error processing arguments");
        cobj->loadHTMLString(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_loadHTMLString)

static bool js_cocos2dx_experimental_webView_WebView_goForward(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_goForward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->goForward();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_goForward)

static bool js_cocos2dx_experimental_webView_WebView_goBack(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_goBack : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->goBack();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_goBack)

static bool js_cocos2dx_experimental_webView_WebView_setScalesPageToFit(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_setScalesPageToFit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_setScalesPageToFit : Error processing arguments");
        cobj->setScalesPageToFit(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_setScalesPageToFit)

static bool js_cocos2dx_experimental_webView_WebView_getOnDidFailLoading(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_getOnDidFailLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::experimental::ui::WebView::ccWebViewCallback result = cobj->getOnDidFailLoading();
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_getOnDidFailLoading : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_getOnDidFailLoading)

static bool js_cocos2dx_experimental_webView_WebView_loadFile(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_loadFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_loadFile : Error processing arguments");
        cobj->loadFile(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_loadFile)

static bool js_cocos2dx_experimental_webView_WebView_loadURL(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_loadURL : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_loadURL : Error processing arguments");
        cobj->loadURL(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_loadURL)

static bool js_cocos2dx_experimental_webView_WebView_setBounces(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_setBounces : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_setBounces : Error processing arguments");
        cobj->setBounces(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_setBounces)

static bool js_cocos2dx_experimental_webView_WebView_evaluateJS(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_evaluateJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_evaluateJS : Error processing arguments");
        cobj->evaluateJS(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_evaluateJS)

static bool js_cocos2dx_experimental_webView_WebView_getOnJSCallback(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_getOnJSCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::experimental::ui::WebView::ccWebViewCallback result = cobj->getOnJSCallback();
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_getOnJSCallback : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_getOnJSCallback)

static bool js_cocos2dx_experimental_webView_WebView_canGoForward(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_canGoForward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->canGoForward();
        ok &= boolean_to_seval(result, &s.rval());
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_canGoForward : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_canGoForward)

static bool js_cocos2dx_experimental_webView_WebView_getOnShouldStartLoading(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_getOnShouldStartLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::function<bool (cocos2d::experimental::ui::WebView *, const std::basic_string<char> &)> result = cobj->getOnShouldStartLoading();
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_getOnShouldStartLoading : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_getOnShouldStartLoading)

static bool js_cocos2dx_experimental_webView_WebView_stopLoading(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_stopLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopLoading();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_stopLoading)

static bool js_cocos2dx_experimental_webView_WebView_reload(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_reload : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reload();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_reload)

static bool js_cocos2dx_experimental_webView_WebView_setJavascriptInterfaceScheme(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_setJavascriptInterfaceScheme : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_setJavascriptInterfaceScheme : Error processing arguments");
        cobj->setJavascriptInterfaceScheme(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_setJavascriptInterfaceScheme)

static bool js_cocos2dx_experimental_webView_WebView_getOnDidFinishLoading(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
    JSB_PRECONDITION2(cobj, false, "js_cocos2dx_experimental_webView_WebView_getOnDidFinishLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::experimental::ui::WebView::ccWebViewCallback result = cobj->getOnDidFinishLoading();
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        JSB_PRECONDITION2(ok, false, "js_cocos2dx_experimental_webView_WebView_getOnDidFinishLoading : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_getOnDidFinishLoading)

static bool js_cocos2dx_experimental_webView_WebView_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::experimental::ui::WebView::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_experimental_ui_WebView_class, false);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_experimental_webView_WebView_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_experimental_ui_WebView_finalize)

static bool js_cocos2dx_experimental_webView_WebView_constructor(se::State& s)
{
    cocos2d::experimental::ui::WebView* cobj = new (std::nothrow) cocos2d::experimental::ui::WebView();
    s.thisObject()->setPrivateData(cobj);
    s.thisObject()->addRef();
    return true;
}
SE_BIND_CTOR(js_cocos2dx_experimental_webView_WebView_constructor, __jsb_cocos2d_experimental_ui_WebView_class, js_cocos2d_experimental_ui_WebView_finalize)



extern se::Object* __jsb_cocos2d_ui_Widget_proto;

bool js_cocos2d_experimental_ui_WebView_finalize(se::State& s)
{
    if (s.nativeThisObject() != nullptr)
    {
        cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::experimental::ui::WebView)", s.nativeThisObject());
        cocos2d::experimental::ui::WebView* cobj = (cocos2d::experimental::ui::WebView*)s.nativeThisObject();
        if (cobj->getReferenceCount() == 1)
            cobj->autorelease();
        else
            cobj->release();
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_experimental_ui_WebView_finalize)

bool js_register_cocos2dx_experimental_webView_WebView(se::Object* obj)
{
    auto cls = se::Class::create("WebView", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_experimental_webView_WebView_constructor));

    cls->defineFunction("canGoBack", _SE(js_cocos2dx_experimental_webView_WebView_canGoBack));
    cls->defineFunction("loadHTMLString", _SE(js_cocos2dx_experimental_webView_WebView_loadHTMLString));
    cls->defineFunction("goForward", _SE(js_cocos2dx_experimental_webView_WebView_goForward));
    cls->defineFunction("goBack", _SE(js_cocos2dx_experimental_webView_WebView_goBack));
    cls->defineFunction("setScalesPageToFit", _SE(js_cocos2dx_experimental_webView_WebView_setScalesPageToFit));
    cls->defineFunction("getOnDidFailLoading", _SE(js_cocos2dx_experimental_webView_WebView_getOnDidFailLoading));
    cls->defineFunction("loadFile", _SE(js_cocos2dx_experimental_webView_WebView_loadFile));
    cls->defineFunction("loadURL", _SE(js_cocos2dx_experimental_webView_WebView_loadURL));
    cls->defineFunction("setBounces", _SE(js_cocos2dx_experimental_webView_WebView_setBounces));
    cls->defineFunction("evaluateJS", _SE(js_cocos2dx_experimental_webView_WebView_evaluateJS));
    cls->defineFunction("getOnJSCallback", _SE(js_cocos2dx_experimental_webView_WebView_getOnJSCallback));
    cls->defineFunction("canGoForward", _SE(js_cocos2dx_experimental_webView_WebView_canGoForward));
    cls->defineFunction("getOnShouldStartLoading", _SE(js_cocos2dx_experimental_webView_WebView_getOnShouldStartLoading));
    cls->defineFunction("stopLoading", _SE(js_cocos2dx_experimental_webView_WebView_stopLoading));
    cls->defineFunction("reload", _SE(js_cocos2dx_experimental_webView_WebView_reload));
    cls->defineFunction("setJavascriptInterfaceScheme", _SE(js_cocos2dx_experimental_webView_WebView_setJavascriptInterfaceScheme));
    cls->defineFunction("getOnDidFinishLoading", _SE(js_cocos2dx_experimental_webView_WebView_getOnDidFinishLoading));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_experimental_webView_WebView_create));
    cls->defineFinalizedFunction(_SE(js_cocos2d_experimental_ui_WebView_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::experimental::ui::WebView>(cls);

    __jsb_cocos2d_experimental_ui_WebView_proto = cls->getProto();
    __jsb_cocos2d_experimental_ui_WebView_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx_experimental_webView(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("ccui", &nsVal))
    {
        se::Object* jsobj = se::Object::createPlainObject(false);
        nsVal.setObject(jsobj);
        obj->setProperty("ccui", nsVal);
        jsobj->release();
    }
    se::Object* ns = nsVal.toObject();

    js_register_cocos2dx_experimental_webView_WebView(ns);
    return true;
}

#endif //#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)
