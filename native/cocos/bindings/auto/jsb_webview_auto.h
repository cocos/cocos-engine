// clang-format off
#pragma once
#include "base/Config.h"
#if USE_WEBVIEW > 0
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/ui/webview/WebView.h"

bool register_all_webview(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::WebView);


extern se::Object *__jsb_cc_WebView_proto; // NOLINT
extern se::Class * __jsb_cc_WebView_class; // NOLINT

bool js_register_cc_WebView(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_webview_WebView_canGoBack);
SE_DECLARE_FUNC(js_webview_WebView_canGoForward);
SE_DECLARE_FUNC(js_webview_WebView_evaluateJS);
SE_DECLARE_FUNC(js_webview_WebView_getOnDidFailLoading);
SE_DECLARE_FUNC(js_webview_WebView_getOnDidFinishLoading);
SE_DECLARE_FUNC(js_webview_WebView_getOnJSCallback);
SE_DECLARE_FUNC(js_webview_WebView_getOnShouldStartLoading);
SE_DECLARE_FUNC(js_webview_WebView_goBack);
SE_DECLARE_FUNC(js_webview_WebView_goForward);
SE_DECLARE_FUNC(js_webview_WebView_loadData);
SE_DECLARE_FUNC(js_webview_WebView_loadFile);
SE_DECLARE_FUNC(js_webview_WebView_loadHTMLString);
SE_DECLARE_FUNC(js_webview_WebView_loadURL);
SE_DECLARE_FUNC(js_webview_WebView_reload);
SE_DECLARE_FUNC(js_webview_WebView_setBackgroundTransparent);
SE_DECLARE_FUNC(js_webview_WebView_setBounces);
SE_DECLARE_FUNC(js_webview_WebView_setFrame);
SE_DECLARE_FUNC(js_webview_WebView_setJavascriptInterfaceScheme);
SE_DECLARE_FUNC(js_webview_WebView_setOnDidFailLoading);
SE_DECLARE_FUNC(js_webview_WebView_setOnDidFinishLoading);
SE_DECLARE_FUNC(js_webview_WebView_setOnJSCallback);
SE_DECLARE_FUNC(js_webview_WebView_setOnShouldStartLoading);
SE_DECLARE_FUNC(js_webview_WebView_setScalesPageToFit);
SE_DECLARE_FUNC(js_webview_WebView_setVisible);
SE_DECLARE_FUNC(js_webview_WebView_stopLoading);
SE_DECLARE_FUNC(js_webview_WebView_create);
#endif //#if USE_WEBVIEW > 0
// clang-format on