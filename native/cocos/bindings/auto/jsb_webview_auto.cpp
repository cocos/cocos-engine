#include "cocos/bindings/auto/jsb_webview_auto.h"
#if (USE_WEBVIEW > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "ui/webview/WebView.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_WebView_proto = nullptr;
se::Class* __jsb_cc_WebView_class = nullptr;

static bool js_webview_WebView_setOnShouldStartLoading(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setOnShouldStartLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<bool (cc::WebView *, const std::string&)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](cc::WebView* larg0, const std::string& larg1) -> bool {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval(larg0, &args[0]);
                    ok &= std_string_to_seval(larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                    bool result;
                    ok &= seval_to_boolean(rval, &result);
                    SE_PRECONDITION2(ok, result, "lambda function : Error processing return value with type bool");
                    return result;
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setOnShouldStartLoading : Error processing arguments");
        cobj->setOnShouldStartLoading(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setOnShouldStartLoading)

static bool js_webview_WebView_setOnDidFailLoading(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setOnDidFailLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cc::WebView *, const std::string&)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](cc::WebView* larg0, const std::string& larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval(larg0, &args[0]);
                    ok &= std_string_to_seval(larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setOnDidFailLoading : Error processing arguments");
        cobj->setOnDidFailLoading(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setOnDidFailLoading)

static bool js_webview_WebView_canGoBack(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_canGoBack : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->canGoBack();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_canGoBack : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_canGoBack)

static bool js_webview_WebView_loadHTMLString(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_loadHTMLString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_loadHTMLString : Error processing arguments");
        cobj->loadHTMLString(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_loadHTMLString : Error processing arguments");
        cobj->loadHTMLString(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_loadHTMLString)

static bool js_webview_WebView_goForward(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_goForward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->goForward();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_goForward)

static bool js_webview_WebView_goBack(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_goBack : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->goBack();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_goBack)

static bool js_webview_WebView_setScalesPageToFit(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setScalesPageToFit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setScalesPageToFit : Error processing arguments");
        cobj->setScalesPageToFit(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setScalesPageToFit)

static bool js_webview_WebView_getOnDidFailLoading(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_getOnDidFailLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::WebView::ccWebViewCallback result = cobj->getOnDidFailLoading();
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_getOnDidFailLoading : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_getOnDidFailLoading)

static bool js_webview_WebView_loadFile(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_loadFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_loadFile : Error processing arguments");
        cobj->loadFile(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_loadFile)

static bool js_webview_WebView_loadURL(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_loadURL : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_loadURL : Error processing arguments");
        cobj->loadURL(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_loadURL)

static bool js_webview_WebView_setBounces(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setBounces : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setBounces : Error processing arguments");
        cobj->setBounces(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setBounces)

static bool js_webview_WebView_evaluateJS(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_evaluateJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_evaluateJS : Error processing arguments");
        cobj->evaluateJS(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_evaluateJS)

static bool js_webview_WebView_setOnJSCallback(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setOnJSCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cc::WebView *, const std::string&)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](cc::WebView* larg0, const std::string& larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval(larg0, &args[0]);
                    ok &= std_string_to_seval(larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setOnJSCallback : Error processing arguments");
        cobj->setOnJSCallback(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setOnJSCallback)

static bool js_webview_WebView_setBackgroundTransparent(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setBackgroundTransparent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setBackgroundTransparent : Error processing arguments");
        cobj->setBackgroundTransparent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setBackgroundTransparent)

static bool js_webview_WebView_getOnJSCallback(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_getOnJSCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::WebView::ccWebViewCallback result = cobj->getOnJSCallback();
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_getOnJSCallback : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_getOnJSCallback)

static bool js_webview_WebView_canGoForward(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_canGoForward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->canGoForward();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_canGoForward : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_canGoForward)

static bool js_webview_WebView_getOnShouldStartLoading(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_getOnShouldStartLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::function<bool (cc::WebView *, const std::string&)> result = cobj->getOnShouldStartLoading();
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_getOnShouldStartLoading : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_getOnShouldStartLoading)

static bool js_webview_WebView_stopLoading(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_stopLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopLoading();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_stopLoading)

static bool js_webview_WebView_setFrame(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setFrame : Error processing arguments");
        cobj->setFrame(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setFrame)

static bool js_webview_WebView_setVisible(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setVisible : Error processing arguments");
        cobj->setVisible(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setVisible)

static bool js_webview_WebView_reload(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_reload : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reload();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_reload)

static bool js_webview_WebView_loadData(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_loadData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        cc::Data arg0;
        std::string arg1;
        std::string arg2;
        std::string arg3;
        ok &= seval_to_Data(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_loadData : Error processing arguments");
        cobj->loadData(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_loadData)

static bool js_webview_WebView_setJavascriptInterfaceScheme(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setJavascriptInterfaceScheme : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setJavascriptInterfaceScheme : Error processing arguments");
        cobj->setJavascriptInterfaceScheme(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setJavascriptInterfaceScheme)

static bool js_webview_WebView_setOnDidFinishLoading(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setOnDidFinishLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cc::WebView *, const std::string&)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](cc::WebView* larg0, const std::string& larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval(larg0, &args[0]);
                    ok &= std_string_to_seval(larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setOnDidFinishLoading : Error processing arguments");
        cobj->setOnDidFinishLoading(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setOnDidFinishLoading)

static bool js_webview_WebView_getOnDidFinishLoading(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_getOnDidFinishLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::WebView::ccWebViewCallback result = cobj->getOnDidFinishLoading();
        #pragma warning NO CONVERSION FROM NATIVE FOR std::function;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_getOnDidFinishLoading : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_getOnDidFinishLoading)

static bool js_webview_WebView_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cc::WebView::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cc_WebView_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_create)



static bool js_cc_WebView_finalize(se::State& s)
{
    // destructor is skipped
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_WebView_finalize)

static bool js_cc_WebView_destroy(se::State& s)
{
    cc::WebView* cobj = (cc::WebView*)s.nativeThisObject();
    cobj->release();
    auto objIter = se::NativePtrToObjectMap::find(s.nativeThisObject());
    if(objIter != se::NativePtrToObjectMap::end())
    {
        objIter->second->clearPrivateData(true);
    }
    return true;
}
SE_BIND_FUNC(js_cc_WebView_destroy)

bool js_register_webview_WebView(se::Object* obj)
{
    auto cls = se::Class::create("WebView", obj, nullptr, nullptr);

    cls->defineFunction("setOnShouldStartLoading", _SE(js_webview_WebView_setOnShouldStartLoading));
    cls->defineFunction("setOnDidFailLoading", _SE(js_webview_WebView_setOnDidFailLoading));
    cls->defineFunction("canGoBack", _SE(js_webview_WebView_canGoBack));
    cls->defineFunction("loadHTMLString", _SE(js_webview_WebView_loadHTMLString));
    cls->defineFunction("goForward", _SE(js_webview_WebView_goForward));
    cls->defineFunction("goBack", _SE(js_webview_WebView_goBack));
    cls->defineFunction("setScalesPageToFit", _SE(js_webview_WebView_setScalesPageToFit));
    cls->defineFunction("getOnDidFailLoading", _SE(js_webview_WebView_getOnDidFailLoading));
    cls->defineFunction("loadFile", _SE(js_webview_WebView_loadFile));
    cls->defineFunction("loadURL", _SE(js_webview_WebView_loadURL));
    cls->defineFunction("setBounces", _SE(js_webview_WebView_setBounces));
    cls->defineFunction("evaluateJS", _SE(js_webview_WebView_evaluateJS));
    cls->defineFunction("setOnJSCallback", _SE(js_webview_WebView_setOnJSCallback));
    cls->defineFunction("setBackgroundTransparent", _SE(js_webview_WebView_setBackgroundTransparent));
    cls->defineFunction("getOnJSCallback", _SE(js_webview_WebView_getOnJSCallback));
    cls->defineFunction("canGoForward", _SE(js_webview_WebView_canGoForward));
    cls->defineFunction("getOnShouldStartLoading", _SE(js_webview_WebView_getOnShouldStartLoading));
    cls->defineFunction("stopLoading", _SE(js_webview_WebView_stopLoading));
    cls->defineFunction("setFrame", _SE(js_webview_WebView_setFrame));
    cls->defineFunction("setVisible", _SE(js_webview_WebView_setVisible));
    cls->defineFunction("reload", _SE(js_webview_WebView_reload));
    cls->defineFunction("loadData", _SE(js_webview_WebView_loadData));
    cls->defineFunction("setJavascriptInterfaceScheme", _SE(js_webview_WebView_setJavascriptInterfaceScheme));
    cls->defineFunction("setOnDidFinishLoading", _SE(js_webview_WebView_setOnDidFinishLoading));
    cls->defineFunction("getOnDidFinishLoading", _SE(js_webview_WebView_getOnDidFinishLoading));
    cls->defineFunction("destroy", _SE(js_cc_WebView_destroy));
    cls->defineStaticFunction("create", _SE(js_webview_WebView_create));
    cls->defineFinalizeFunction(_SE(js_cc_WebView_finalize));
    cls->install();
    JSBClassType::registerClass<cc::WebView>(cls);

    __jsb_cc_WebView_proto = cls->getProto();
    __jsb_cc_WebView_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_webview(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("jsb", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_webview_WebView(ns);
    return true;
}

#endif //#if (USE_WEBVIEW > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
