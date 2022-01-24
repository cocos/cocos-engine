/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once
#include "base/Config.h"
#if USE_WEBVIEW > 0
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/ui/webview/WebView.h"

extern se::Object* __jsb_cc_WebView_proto;
extern se::Class* __jsb_cc_WebView_class;

bool js_register_cc_WebView(se::Object* obj);
bool register_all_webview(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::WebView);
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
