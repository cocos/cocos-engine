/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include <cstdlib>
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"

#include "WebView-inl.h"

#include "platform/FileUtils.h"
#include "platform/openharmony/napi/NapiHelper.h"
#include "WebViewImpl-openharmony.h"
#include "cocos/base/Log.h"

static const ccstd::string S_DEFAULT_BASE_URL = "file:///openharmony_asset/";
static const ccstd::string S_SD_ROOT_BASE_URL = "file://";

static ccstd::string getFixedBaseUrl(const ccstd::string &baseUrl) {
    ccstd::string fixedBaseUrl;
    if (baseUrl.empty()) {
        fixedBaseUrl = S_DEFAULT_BASE_URL;
    } else if (baseUrl.find(S_SD_ROOT_BASE_URL) != ccstd::string::npos) {
        fixedBaseUrl = baseUrl;
    } else if (baseUrl.c_str()[0] != '/') {
        if (baseUrl.find("assets/") == 0) {
            fixedBaseUrl = S_DEFAULT_BASE_URL + baseUrl.c_str()[7];
        } else {
            fixedBaseUrl = S_DEFAULT_BASE_URL + baseUrl;
        }
    } else {
        fixedBaseUrl = S_SD_ROOT_BASE_URL + baseUrl;
    }

    if (fixedBaseUrl.c_str()[fixedBaseUrl.length() - 1] != '/') {
        fixedBaseUrl += "/";
    }

    return fixedBaseUrl;
}

ccstd::string getUrlStringByFileName(const ccstd::string &fileName) {
    // LOGD("error: %s,%d",__func__,__LINE__);
    const ccstd::string basePath(S_DEFAULT_BASE_URL);
    ccstd::string fullPath = cc::FileUtils::getInstance()->fullPathForFilename(fileName);
    const ccstd::string assetsPath("assets/");

    ccstd::string urlString;
    if (fullPath.find(assetsPath) != ccstd::string::npos) {
        urlString = fullPath.replace(fullPath.find_first_of(assetsPath), assetsPath.length(),
                                     basePath);
    } else {
        urlString = fullPath;
    }

    return urlString;
}

namespace cc {
static int32_t kWebViewTag = 0;
static ccstd::unordered_map<int, WebViewImpl *> sWebViewImpls;

WebViewImpl::WebViewImpl(WebView *webView) : _viewTag(-1),
                                             _webView(webView) {
    _viewTag = kWebViewTag++;
    NapiHelper::postMessageToUIThread("createWebView", Napi::Number::New(NapiHelper::getWorkerEnv(), static_cast<double>(_viewTag)));
    sWebViewImpls[_viewTag] = this;
}

WebViewImpl::~WebViewImpl() {
    destroy();
}

void WebViewImpl::destroy() {
    if (_viewTag != -1) {
        NapiHelper::postMessageToUIThread("removeWebView", Napi::Number::New(NapiHelper::getWorkerEnv(), static_cast<double>(_viewTag)));
        auto iter = sWebViewImpls.find(_viewTag);
        if (iter != sWebViewImpls.end()) {
            sWebViewImpls.erase(iter);
        }
        _viewTag = -1;
    }
}

void WebViewImpl::loadData(const Data &data, const ccstd::string &mimeType,
                           const ccstd::string &encoding, const ccstd::string &baseURL) {
    ccstd::string dataString(reinterpret_cast<char *>(data.getBytes()),
                             static_cast<unsigned int>(data.getSize()));

    auto env = NapiHelper::getWorkerEnv();
    auto args = Napi::Object::New(env);
    args["tag"] = Napi::Number::New(env, static_cast<double>(_viewTag));
    args["contents"] = Napi::String::New(env, dataString);
    args["mimeType"] = Napi::String::New(env, mimeType);
    args["encoding"] = Napi::String::New(env, encoding);
    args["baseUrl"] = Napi::String::New(env, baseURL);

    NapiHelper::postMessageToUIThread("loadData", args);
}

void WebViewImpl::loadHTMLString(const ccstd::string &string, const ccstd::string &baseURL) {
    auto env = NapiHelper::getWorkerEnv();
    auto args = Napi::Object::New(env);
    args["tag"] = Napi::Number::New(env, static_cast<double>(_viewTag));
    args["contents"] = Napi::String::New(env, string);
    args["baseUrl"] = Napi::String::New(env, baseURL);

    NapiHelper::postMessageToUIThread("loadHTMLString", args);
}

void WebViewImpl::loadURL(const ccstd::string &url) {
    auto env = NapiHelper::getWorkerEnv();
    auto args = Napi::Object::New(env);
    args["tag"] = Napi::Number::New(env, static_cast<double>(_viewTag));
    args["url"] = Napi::String::New(env, url);

    NapiHelper::postMessageToUIThread("loadUrl", args);
}

void WebViewImpl::loadFile(const ccstd::string &fileName) {
    auto fullPath = getUrlStringByFileName(fileName);

    auto env = NapiHelper::getWorkerEnv();
    auto args = Napi::Object::New(env);
    args["tag"] = Napi::Number::New(env, static_cast<double>(_viewTag));
    args["url"] = Napi::String::New(env, fullPath);

    NapiHelper::postMessageToUIThread("loadUrl", args);
}

void WebViewImpl::stopLoading() {
    NapiHelper::postMessageToUIThread("stopLoading", Napi::Number::New(NapiHelper::getWorkerEnv(), static_cast<double>(_viewTag)));
}

void WebViewImpl::reload() {
    NapiHelper::postMessageToUIThread("reload", Napi::Number::New(NapiHelper::getWorkerEnv(), static_cast<double>(_viewTag)));
}

bool WebViewImpl::canGoBack() {
    // TODO(qgh):OpenHarmony does not support this interface.
    return true;
}

bool WebViewImpl::canGoForward() {
    // TODO(qgh):OpenHarmony does not support this interface.
    return true;
}

void WebViewImpl::goBack() {
    NapiHelper::postMessageToUIThread("goBack", Napi::Number::New(NapiHelper::getWorkerEnv(), static_cast<double>(_viewTag)));
}

void WebViewImpl::goForward() {
     NapiHelper::postMessageToUIThread("goForward", Napi::Number::New(NapiHelper::getWorkerEnv(), static_cast<double>(_viewTag)));
}

void WebViewImpl::setJavascriptInterfaceScheme(const ccstd::string &scheme) {
    // TODO(qgh):OpenHarmony does not support this interface.
}

void WebViewImpl::evaluateJS(const ccstd::string &js) {
    auto env = NapiHelper::getWorkerEnv();
    auto args = Napi::Object::New(env);
    args["tag"] = Napi::Number::New(env, static_cast<double>(_viewTag));
    args["jsContents"] = Napi::String::New(env, js);

    NapiHelper::postMessageToUIThread("evaluateJS", args);
}

void WebViewImpl::setScalesPageToFit(bool scalesPageToFit) {
    NapiHelper::postMessageToUIThread("setScalesPageToFit", Napi::Number::New(NapiHelper::getWorkerEnv(), static_cast<double>(_viewTag)));
}

bool WebViewImpl::shouldStartLoading(int viewTag, const ccstd::string &url) {
    bool allowLoad = true;
    auto it = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto webView = it->second->_webView;
        if (webView->_onShouldStartLoading) {
            allowLoad = webView->_onShouldStartLoading(webView, url);
        }
    }
    return allowLoad;
}

void WebViewImpl::didFinishLoading(int viewTag, const ccstd::string &url) {
    auto it = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto webView = it->second->_webView;
        if (webView->_onDidFinishLoading) {
            webView->_onDidFinishLoading(webView, url);
        }
    }
}

void WebViewImpl::didFailLoading(int viewTag, const ccstd::string &url) {
    auto it = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto webView = it->second->_webView;
        if (webView->_onDidFailLoading) {
            webView->_onDidFailLoading(webView, url);
        }
    }
}

void WebViewImpl::onJsCallback(int viewTag, const ccstd::string &message) {
    auto it = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto webView = it->second->_webView;
        if (webView->_onJSCallback) {
            webView->_onJSCallback(webView, message);
        }
    }
}

void WebViewImpl::setVisible(bool visible) {
    auto env = NapiHelper::getWorkerEnv();
    auto args = Napi::Object::New(env);
    args["tag"] = Napi::Number::New(env, static_cast<double>(_viewTag));
    args["visible"] = Napi::Boolean::New(env, visible);

    NapiHelper::postMessageToUIThread("setVisible", args);
}

void WebViewImpl::setFrame(float x, float y, float width, float height) {
    auto env = NapiHelper::getWorkerEnv();
    auto args = Napi::Object::New(env);
    args["tag"] = Napi::Number::New(env, static_cast<double>(_viewTag));
    args["x"] = Napi::Number::New(env, x);
    args["y"] = Napi::Number::New(env, y);
    args["w"] = Napi::Number::New(env, width);
    args["h"] = Napi::Number::New(env, height);

    NapiHelper::postMessageToUIThread("setWebViewRect", args);
}

void WebViewImpl::setBounces(bool bounces) {
    // empty function as this was mainly a fix for iOS
}

void WebViewImpl::setBackgroundTransparent(bool isTransparent) {
    // TODO(qgh):OpenHarmony is not supported at this time
}

static void getViewTagAndUrlFromCallbackInfo(const Napi::CallbackInfo &info, int32_t *viewTag, ccstd::string *url) {
    auto env = info.Env();
    if (info.Length() != 2) {
        Napi::Error::New(env, "napiShouldStartLoading, 2 arguments expected").ThrowAsJavaScriptException();
        return;
    }

    auto arg0 = info[0].As<Napi::Number>();
    auto arg1 = info[1].As<Napi::String>();

    if (env.IsExceptionPending()) {
        return;
    }

    *viewTag = arg0.Int32Value();
    *url = arg1.Utf8Value();
}

void OpenHarmonyWebView::napiShouldStartLoading(const Napi::CallbackInfo &info) {
    int32_t viewTag = 0;
    ccstd::string url;
    getViewTagAndUrlFromCallbackInfo(info,  &viewTag, &url);
    WebViewImpl::shouldStartLoading(viewTag, url);
}

void OpenHarmonyWebView::napiFinishLoading(const Napi::CallbackInfo &info) {
    int32_t viewTag = 0;
    ccstd::string url;
    getViewTagAndUrlFromCallbackInfo(info,  &viewTag, &url);
    WebViewImpl::didFinishLoading(viewTag, url);
}

void OpenHarmonyWebView::napiFailLoading(const Napi::CallbackInfo &info) {
    int32_t viewTag = 0;
    ccstd::string url;
    getViewTagAndUrlFromCallbackInfo(info,  &viewTag, &url);
    WebViewImpl::didFailLoading(viewTag, url);
}

void OpenHarmonyWebView::napiJsCallback(const Napi::CallbackInfo &info) {
    int32_t viewTag = 0;
    ccstd::string url;
    getViewTagAndUrlFromCallbackInfo(info,  &viewTag, &url);
    WebViewImpl::onJsCallback(viewTag, url);
}


} //namespace cc
