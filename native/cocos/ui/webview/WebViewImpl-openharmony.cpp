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
    NapiHelper::postMessageToUIThread("createWebView", _viewTag);
    sWebViewImpls[_viewTag] = this;
}

WebViewImpl::~WebViewImpl() {
    destroy();
}

void WebViewImpl::destroy() {
    if (_viewTag != -1) {
        NapiHelper::postMessageToUIThread("removeWebView", _viewTag);
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
    ccstd::unordered_map<ccstd::string, cc::Value> vals;
    vals.insert(std::make_pair("tag", _viewTag));
    vals.insert(std::make_pair("contents", cc::Value(dataString)));
    vals.insert(std::make_pair("mimeType", mimeType));
    vals.insert(std::make_pair("encoding", encoding));
    vals.insert(std::make_pair("baseUrl", baseURL));
    NapiHelper::postMessageToUIThread("loadData", vals);
}

void WebViewImpl::loadHTMLString(const ccstd::string &string, const ccstd::string &baseURL) {
    ccstd::unordered_map<ccstd::string, cc::Value> vals;
    vals.insert(std::make_pair("tag", _viewTag));
    vals.insert(std::make_pair("contents", cc::Value(string)));
    vals.insert(std::make_pair("baseUrl", baseURL));
    NapiHelper::postMessageToUIThread("loadHTMLString", vals);
}

void WebViewImpl::loadURL(const ccstd::string &url) {
    ccstd::unordered_map<ccstd::string, cc::Value> vals;
    vals.insert(std::make_pair("tag", _viewTag));
    vals.insert(std::make_pair("url", url));
    NapiHelper::postMessageToUIThread("loadUrl", vals);
}

void WebViewImpl::loadFile(const ccstd::string &fileName) {
    auto fullPath = getUrlStringByFileName(fileName);
    ccstd::unordered_map<ccstd::string, cc::Value> vals;
    vals.insert(std::make_pair("tag", _viewTag));
    vals.insert(std::make_pair("url", fullPath));
    NapiHelper::postMessageToUIThread("loadUrl", vals);
}

void WebViewImpl::stopLoading() {
    NapiHelper::postMessageToUIThread("stopLoading", _viewTag);
}

void WebViewImpl::reload() {
    NapiHelper::postMessageToUIThread("reload", _viewTag);
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
    NapiHelper::postMessageToUIThread("goBack", _viewTag);
}

void WebViewImpl::goForward() {
     NapiHelper::postMessageToUIThread("goForward", _viewTag);
}

void WebViewImpl::setJavascriptInterfaceScheme(const ccstd::string &scheme) {
    // TODO(qgh):OpenHarmony does not support this interface.
}

void WebViewImpl::evaluateJS(const ccstd::string &js) {
    ccstd::unordered_map<ccstd::string, cc::Value> vals;
    vals.insert(std::make_pair("tag", _viewTag));
    vals.insert(std::make_pair("jsContents", js));
    NapiHelper::postMessageToUIThread("evaluateJS", vals);
}

void WebViewImpl::setScalesPageToFit(bool scalesPageToFit) {
    NapiHelper::postMessageToUIThread("setScalesPageToFit", _viewTag);
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
    ccstd::unordered_map<ccstd::string, cc::Value> vals;
    vals.insert(std::make_pair("tag", _viewTag));
    vals.insert(std::make_pair("visible", visible));
    NapiHelper::postMessageToUIThread("setVisible", vals);
}

void WebViewImpl::setFrame(float x, float y, float width, float height) {
    //cc::Rect rect(x, y, width, height);
    ccstd::unordered_map<ccstd::string, cc::Value> vals;
    vals.insert(std::make_pair("tag", _viewTag));
    vals.insert(std::make_pair("x", x));
    vals.insert(std::make_pair("y", y));
    vals.insert(std::make_pair("w", width));
    vals.insert(std::make_pair("h", height));
    NapiHelper::postMessageToUIThread("setWebViewRect", vals);
}

void WebViewImpl::setBounces(bool bounces) {
    // empty function as this was mainly a fix for iOS
}

void WebViewImpl::setBackgroundTransparent(bool isTransparent) {
    // TODO(qgh):OpenHarmony is not supported at this time
}

void OpenHarmonyWebView::GetInterfaces(std::vector<napi_property_descriptor> &descriptors) {
    descriptors = {
        DECLARE_NAPI_FUNCTION("shouldStartLoading", OpenHarmonyWebView::napiShouldStartLoading),
        DECLARE_NAPI_FUNCTION("finishLoading", OpenHarmonyWebView::napiFinishLoading),
        DECLARE_NAPI_FUNCTION("failLoading", OpenHarmonyWebView::napiFailLoading),
        DECLARE_NAPI_FUNCTION("jsCallback", OpenHarmonyWebView::napiJsCallback),
    };
}

napi_value OpenHarmonyWebView::napiShouldStartLoading(napi_env env, napi_callback_info info) {
    size_t      argc = 2;
    napi_value  args[2];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    
    se::ValueArray seArgs;
    seArgs.reserve(2);   
    se::internal::jsToSeArgs(argc, args, &seArgs);

    int32_t viewTag;
    sevalue_to_native(seArgs[0], &viewTag, nullptr);

    std::string url;
    sevalue_to_native(seArgs[1], &url, nullptr);
    WebViewImpl::shouldStartLoading(viewTag, url);
    return nullptr;
}

napi_value OpenHarmonyWebView::napiFinishLoading(napi_env env, napi_callback_info info) {
    size_t      argc = 2;
    napi_value  args[2];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    
    se::ValueArray seArgs;
    seArgs.reserve(2);   
    se::internal::jsToSeArgs(argc, args, &seArgs);

    int32_t viewTag;
    sevalue_to_native(seArgs[0], &viewTag, nullptr);

    std::string url;
    sevalue_to_native(seArgs[1], &url, nullptr);
    WebViewImpl::didFinishLoading(viewTag, url);
    return nullptr;
}

napi_value OpenHarmonyWebView::napiFailLoading(napi_env env, napi_callback_info info) {
    size_t      argc = 2;
    napi_value  args[2];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    
    se::ValueArray seArgs;
    seArgs.reserve(2);   
    se::internal::jsToSeArgs(argc, args, &seArgs);

    int32_t viewTag;
    sevalue_to_native(seArgs[0], &viewTag, nullptr);

    std::string url;
    sevalue_to_native(seArgs[1], &url, nullptr);
    WebViewImpl::didFailLoading(viewTag, url);
    return nullptr;
}

napi_value OpenHarmonyWebView::napiJsCallback(napi_env env, napi_callback_info info) {
    size_t      argc = 2;
    napi_value  args[2];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    
    se::ValueArray seArgs;
    seArgs.reserve(2);   
    se::internal::jsToSeArgs(argc, args, &seArgs);

    int32_t viewTag;
    sevalue_to_native(seArgs[0], &viewTag, nullptr);

    std::string url;
    sevalue_to_native(seArgs[1], &url, nullptr);
    WebViewImpl::onJsCallback(viewTag, url);
    return nullptr;
}


} //namespace cc
