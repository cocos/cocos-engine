#pragma once
#include "base/ccConfig.h"
#if (USE_WEB_VIEW > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cocos2d_WebView_proto;
extern se::Class* __jsb_cocos2d_WebView_class;

bool js_register_cocos2d_WebView(se::Object* obj);
bool register_all_webview(se::Object* obj);
SE_DECLARE_FUNC(js_webview_WebView_setOnShouldStartLoading);
SE_DECLARE_FUNC(js_webview_WebView_setOnDidFailLoading);
SE_DECLARE_FUNC(js_webview_WebView_canGoBack);
SE_DECLARE_FUNC(js_webview_WebView_loadHTMLString);
SE_DECLARE_FUNC(js_webview_WebView_goForward);
SE_DECLARE_FUNC(js_webview_WebView_goBack);
SE_DECLARE_FUNC(js_webview_WebView_setScalesPageToFit);
SE_DECLARE_FUNC(js_webview_WebView_getOnDidFailLoading);
SE_DECLARE_FUNC(js_webview_WebView_loadFile);
SE_DECLARE_FUNC(js_webview_WebView_loadURL);
SE_DECLARE_FUNC(js_webview_WebView_setBounces);
SE_DECLARE_FUNC(js_webview_WebView_evaluateJS);
SE_DECLARE_FUNC(js_webview_WebView_setOnJSCallback);
SE_DECLARE_FUNC(js_webview_WebView_setBackgroundTransparent);
SE_DECLARE_FUNC(js_webview_WebView_getOnJSCallback);
SE_DECLARE_FUNC(js_webview_WebView_canGoForward);
SE_DECLARE_FUNC(js_webview_WebView_getOnShouldStartLoading);
SE_DECLARE_FUNC(js_webview_WebView_stopLoading);
SE_DECLARE_FUNC(js_webview_WebView_setFrame);
SE_DECLARE_FUNC(js_webview_WebView_setVisible);
SE_DECLARE_FUNC(js_webview_WebView_reload);
SE_DECLARE_FUNC(js_webview_WebView_loadData);
SE_DECLARE_FUNC(js_webview_WebView_setJavascriptInterfaceScheme);
SE_DECLARE_FUNC(js_webview_WebView_setOnDidFinishLoading);
SE_DECLARE_FUNC(js_webview_WebView_getOnDidFinishLoading);
SE_DECLARE_FUNC(js_webview_WebView_create);
SE_DECLARE_FUNC(js_webview_WebView_WebView);

#endif //#if (USE_WEB_VIEW > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)
