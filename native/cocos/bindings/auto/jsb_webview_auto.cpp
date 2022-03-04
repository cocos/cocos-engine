
// clang-format off
#include "cocos/bindings/auto/jsb_webview_auto.h"
#if USE_WEBVIEW > 0
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "ui/webview/WebView.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_WebView_proto = nullptr; // NOLINT
se::Class* __jsb_cc_WebView_class = nullptr;  // NOLINT

static bool js_webview_WebView_canGoBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_canGoBack : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->canGoBack();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_canGoBack : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_canGoBack)

static bool js_webview_WebView_canGoForward(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_canGoForward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->canGoForward();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_canGoForward : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_canGoForward)

static bool js_webview_WebView_evaluateJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_evaluateJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_evaluateJS : Error processing arguments");
        cobj->evaluateJS(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_evaluateJS)

static bool js_webview_WebView_getOnDidFailLoading(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_getOnDidFailLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::WebView::ccWebViewCallback result = cobj->getOnDidFailLoading();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_getOnDidFailLoading : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_getOnDidFailLoading)

static bool js_webview_WebView_getOnDidFinishLoading(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_getOnDidFinishLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::WebView::ccWebViewCallback result = cobj->getOnDidFinishLoading();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_getOnDidFinishLoading : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_getOnDidFinishLoading)

static bool js_webview_WebView_getOnJSCallback(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_getOnJSCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::WebView::ccWebViewCallback result = cobj->getOnJSCallback();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_getOnJSCallback : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_getOnJSCallback)

static bool js_webview_WebView_getOnShouldStartLoading(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_getOnShouldStartLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::function<bool (cc::WebView *, const std::string)> result = cobj->getOnShouldStartLoading();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_getOnShouldStartLoading : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_getOnShouldStartLoading)

static bool js_webview_WebView_goBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
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

static bool js_webview_WebView_goForward(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
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

static bool js_webview_WebView_loadData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_loadData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<cc::Data, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<std::string, true> arg2 = {};
        HolderType<std::string, true> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_loadData : Error processing arguments");
        cobj->loadData(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_loadData)

static bool js_webview_WebView_loadFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_loadFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_loadFile : Error processing arguments");
        cobj->loadFile(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_loadFile)

static bool js_webview_WebView_loadHTMLString(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_loadHTMLString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_loadHTMLString : Error processing arguments");
        cobj->loadHTMLString(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_loadHTMLString : Error processing arguments");
        cobj->loadHTMLString(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_loadHTMLString)

static bool js_webview_WebView_loadURL(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_loadURL : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_loadURL : Error processing arguments");
        cobj->loadURL(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_loadURL)

static bool js_webview_WebView_reload(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
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

static bool js_webview_WebView_setBackgroundTransparent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setBackgroundTransparent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setBackgroundTransparent : Error processing arguments");
        cobj->setBackgroundTransparent(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setBackgroundTransparent)

static bool js_webview_WebView_setBounces(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setBounces : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setBounces : Error processing arguments");
        cobj->setBounces(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setBounces)

static bool js_webview_WebView_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setFrame)

static bool js_webview_WebView_setJavascriptInterfaceScheme(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setJavascriptInterfaceScheme : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setJavascriptInterfaceScheme : Error processing arguments");
        cobj->setJavascriptInterfaceScheme(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setJavascriptInterfaceScheme)

static bool js_webview_WebView_setOnDidFailLoading(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setOnDidFailLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (cc::WebView *, const std::string)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto * thisObj = s.thisObject();
                auto lambda = [=](cc::WebView* larg0, const std::string larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setOnDidFailLoading : Error processing arguments");
        cobj->setOnDidFailLoading(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setOnDidFailLoading)

static bool js_webview_WebView_setOnDidFinishLoading(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setOnDidFinishLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (cc::WebView *, const std::string)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto * thisObj = s.thisObject();
                auto lambda = [=](cc::WebView* larg0, const std::string larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setOnDidFinishLoading : Error processing arguments");
        cobj->setOnDidFinishLoading(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setOnDidFinishLoading)

static bool js_webview_WebView_setOnJSCallback(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setOnJSCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (cc::WebView *, const std::string)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto * thisObj = s.thisObject();
                auto lambda = [=](cc::WebView* larg0, const std::string larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setOnJSCallback : Error processing arguments");
        cobj->setOnJSCallback(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setOnJSCallback)

static bool js_webview_WebView_setOnShouldStartLoading(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setOnShouldStartLoading : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<bool (cc::WebView *, const std::string)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto * thisObj = s.thisObject();
                auto lambda = [=](cc::WebView* larg0, const std::string larg1) -> bool {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                    bool result;
                    ok &= sevalue_to_native(rval, &result, nullptr);
                    SE_PRECONDITION2(ok, result, "lambda function : Error processing return value with type bool");
                    return result;
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setOnShouldStartLoading : Error processing arguments");
        cobj->setOnShouldStartLoading(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setOnShouldStartLoading)

static bool js_webview_WebView_setScalesPageToFit(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setScalesPageToFit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setScalesPageToFit : Error processing arguments");
        cobj->setScalesPageToFit(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setScalesPageToFit)

static bool js_webview_WebView_setVisible(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
    SE_PRECONDITION2(cobj, false, "js_webview_WebView_setVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_webview_WebView_setVisible : Error processing arguments");
        cobj->setVisible(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_setVisible)

static bool js_webview_WebView_stopLoading(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::WebView>(s);
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

static bool js_webview_WebView_create_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::WebView* result = cc::WebView::create();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_webview_WebView_create_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_webview_WebView_create_static)
static bool js_cc_WebView_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_WebView_finalize)
static bool js_cc_WebView_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto objIter = se::NativePtrToObjectMap::find(SE_THIS_OBJECT<cc::WebView>(s));
    if(objIter != se::NativePtrToObjectMap::end())
    {
        objIter->second->clearPrivateData(true);
        objIter->second->decRef();
    }
    return true;
}
SE_BIND_FUNC(js_cc_WebView_destroy)

bool js_register_webview_WebView(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("WebView", obj, nullptr, nullptr);

    cls->defineFunction("canGoBack", _SE(js_webview_WebView_canGoBack));
    cls->defineFunction("canGoForward", _SE(js_webview_WebView_canGoForward));
    cls->defineFunction("evaluateJS", _SE(js_webview_WebView_evaluateJS));
    cls->defineFunction("getOnDidFailLoading", _SE(js_webview_WebView_getOnDidFailLoading));
    cls->defineFunction("getOnDidFinishLoading", _SE(js_webview_WebView_getOnDidFinishLoading));
    cls->defineFunction("getOnJSCallback", _SE(js_webview_WebView_getOnJSCallback));
    cls->defineFunction("getOnShouldStartLoading", _SE(js_webview_WebView_getOnShouldStartLoading));
    cls->defineFunction("goBack", _SE(js_webview_WebView_goBack));
    cls->defineFunction("goForward", _SE(js_webview_WebView_goForward));
    cls->defineFunction("loadData", _SE(js_webview_WebView_loadData));
    cls->defineFunction("loadFile", _SE(js_webview_WebView_loadFile));
    cls->defineFunction("loadHTMLString", _SE(js_webview_WebView_loadHTMLString));
    cls->defineFunction("loadURL", _SE(js_webview_WebView_loadURL));
    cls->defineFunction("reload", _SE(js_webview_WebView_reload));
    cls->defineFunction("setBackgroundTransparent", _SE(js_webview_WebView_setBackgroundTransparent));
    cls->defineFunction("setBounces", _SE(js_webview_WebView_setBounces));
    cls->defineFunction("setFrame", _SE(js_webview_WebView_setFrame));
    cls->defineFunction("setJavascriptInterfaceScheme", _SE(js_webview_WebView_setJavascriptInterfaceScheme));
    cls->defineFunction("setOnDidFailLoading", _SE(js_webview_WebView_setOnDidFailLoading));
    cls->defineFunction("setOnDidFinishLoading", _SE(js_webview_WebView_setOnDidFinishLoading));
    cls->defineFunction("setOnJSCallback", _SE(js_webview_WebView_setOnJSCallback));
    cls->defineFunction("setOnShouldStartLoading", _SE(js_webview_WebView_setOnShouldStartLoading));
    cls->defineFunction("setScalesPageToFit", _SE(js_webview_WebView_setScalesPageToFit));
    cls->defineFunction("setVisible", _SE(js_webview_WebView_setVisible));
    cls->defineFunction("stopLoading", _SE(js_webview_WebView_stopLoading));
    cls->defineFunction("destroy", _SE(js_cc_WebView_destroy));
    cls->defineStaticFunction("create", _SE(js_webview_WebView_create_static));
    cls->defineFinalizeFunction(_SE(js_cc_WebView_finalize));
    cls->install();
    JSBClassType::registerClass<cc::WebView>(cls);

    __jsb_cc_WebView_proto = cls->getProto();
    __jsb_cc_WebView_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_webview(se::Object* obj)    // NOLINT
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("jsb", &nsVal, true))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_webview_WebView(ns);
    return true;
}

#endif //#if USE_WEBVIEW > 0
// clang-format on