/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
#include "platform/java/jni/JniHelper.h"

static const ccstd::string CLASS_NAME = "com/cocos/lib/CocosWebViewHelper";

#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, "", __VA_ARGS__)

static const ccstd::string S_DEFAULT_BASE_URL = "file:///android_asset/";
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

extern "C" {
/*
 * Class:     com_cocos_lib_CocosWebViewHelper
 * Method:    shouldStartLoading
 * Signature: (ILjava/lang/String;)Z
 */
JNIEXPORT jboolean JNICALL
Java_com_cocos_lib_CocosWebViewHelper_shouldStartLoading(JNIEnv *env, jclass, jint index, //NOLINT
                                                         jstring jurl) {
    const auto *charUrl = env->GetStringUTFChars(jurl, nullptr);
    ccstd::string url = charUrl;
    env->ReleaseStringUTFChars(jurl, charUrl);
    return cc::WebViewImpl::shouldStartLoading(index, url);
}

/*
 * Class:     com_cocos_lib_CocosWebViewHelper
 * Method:    didFinishLoading
 * Signature: (ILjava/lang/String;)V
 */
JNIEXPORT void JNICALL
Java_com_cocos_lib_CocosWebViewHelper_didFinishLoading(JNIEnv *env, jclass, jint index, //NOLINT
                                                       jstring jurl) {
    // LOGD("didFinishLoading");
    const auto *charUrl = env->GetStringUTFChars(jurl, nullptr);
    ccstd::string url = charUrl;
    env->ReleaseStringUTFChars(jurl, charUrl);
    cc::WebViewImpl::didFinishLoading(index, url);
}

/*
 * Class:     com_cocos_lib_CocosWebViewHelper
 * Method:    didFailLoading
 * Signature: (ILjava/lang/String;)V
 */
JNIEXPORT void JNICALL
Java_com_cocos_lib_CocosWebViewHelper_didFailLoading(JNIEnv *env, jclass, jint index, //NOLINT
                                                     jstring jurl) {
    // LOGD("didFailLoading");
    const auto *charUrl = env->GetStringUTFChars(jurl, nullptr);
    ccstd::string url = charUrl;
    env->ReleaseStringUTFChars(jurl, charUrl);
    cc::WebViewImpl::didFailLoading(index, url);
}

/*
 * Class:     com_cocos_lib_CocosWebViewHelper
 * Method:    onJsCallback
 * Signature: (ILjava/lang/String;)V
 */
JNIEXPORT void JNICALL
Java_com_cocos_lib_CocosWebViewHelper_onJsCallback(JNIEnv *env, jclass, jint index, //NOLINT
                                                   jstring jmessage) {
    // LOGD("jsCallback");
    const auto *charMessage = env->GetStringUTFChars(jmessage, nullptr);
    ccstd::string message = charMessage;
    env->ReleaseStringUTFChars(jmessage, charMessage);
    cc::WebViewImpl::onJsCallback(index, message);
}
}

namespace {

int createWebViewJNI() {
    cc::JniMethodInfo t;
    if (cc::JniHelper::getStaticMethodInfo(t, CLASS_NAME.c_str(), "createWebView", "()I")) {
        // LOGD("error: %s,%d",__func__,__LINE__);
        jint viewTag = t.env->CallStaticIntMethod(t.classID, t.methodID);
        ccDeleteLocalRef(t.env, t.classID);
        return viewTag;
    }
    return -1;
}

ccstd::string getUrlStringByFileName(const ccstd::string &fileName) {
    // LOGD("error: %s,%d",__func__,__LINE__);
    const ccstd::string basePath("file:///android_asset/");
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
} // namespace

namespace cc {

static ccstd::unordered_map<int, WebViewImpl *> sWebViewImpls;

WebViewImpl::WebViewImpl(WebView *webView) : _viewTag(-1),
                                             _webView(webView) {
    _viewTag = createWebViewJNI();
    sWebViewImpls[_viewTag] = this;
}

WebViewImpl::~WebViewImpl() {
    destroy();
}

void WebViewImpl::destroy() {
    if (_viewTag != -1) {
        JniHelper::callStaticVoidMethod(CLASS_NAME, "removeWebView", _viewTag);
        auto iter = sWebViewImpls.find(_viewTag);
        if (iter != sWebViewImpls.end()) {
            sWebViewImpls.erase(iter);
        }
        _viewTag = -1;
    }
}

void WebViewImpl::loadData(const Data &data, const ccstd::string &mimeType,               // NOLINT
                           const ccstd::string &encoding, const ccstd::string &baseURL) { // NOLINT
    ccstd::string dataString(reinterpret_cast<char *>(data.getBytes()),
                             static_cast<unsigned int>(data.getSize()));
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setJavascriptInterfaceScheme", _viewTag,
                                    dataString, mimeType, encoding, baseURL);
}

void WebViewImpl::loadHTMLString(const ccstd::string &string, const ccstd::string &baseURL) { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "loadHTMLString", _viewTag, string, baseURL);
}

void WebViewImpl::loadURL(const ccstd::string &url) { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "loadUrl", _viewTag, url);
}

void WebViewImpl::loadFile(const ccstd::string &fileName) { // NOLINT
    auto fullPath = getUrlStringByFileName(fileName);
    JniHelper::callStaticVoidMethod(CLASS_NAME, "loadFile", _viewTag, fullPath);
}

void WebViewImpl::stopLoading() { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "stopLoading", _viewTag);
}

void WebViewImpl::reload() { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "reload", _viewTag);
}

bool WebViewImpl::canGoBack() { // NOLINT
    return JniHelper::callStaticBooleanMethod(CLASS_NAME, "canGoBack", _viewTag);
}

bool WebViewImpl::canGoForward() { // NOLINT
    return JniHelper::callStaticBooleanMethod(CLASS_NAME, "canGoForward", _viewTag);
}

void WebViewImpl::goBack() { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "goBack", _viewTag);
}

void WebViewImpl::goForward() { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "goForward", _viewTag);
}

void WebViewImpl::setJavascriptInterfaceScheme(const ccstd::string &scheme) { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setJavascriptInterfaceScheme", _viewTag,
                                    scheme);
}

void WebViewImpl::evaluateJS(const ccstd::string &js) { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "evaluateJS", _viewTag, js);
}

void WebViewImpl::setScalesPageToFit(bool scalesPageToFit) { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setScalesPageToFit", _viewTag, scalesPageToFit);
}

bool WebViewImpl::shouldStartLoading(int viewTag, const ccstd::string &url) {
    bool allowLoad = true;
    auto it = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto *webView = it->second->_webView;
        if (webView->_onShouldStartLoading) {
            allowLoad = webView->_onShouldStartLoading(webView, url);
        }
    }
    return allowLoad;
}

void WebViewImpl::didFinishLoading(int viewTag, const ccstd::string &url) {
    auto it = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto *webView = it->second->_webView;
        if (webView->_onDidFinishLoading) {
            webView->_onDidFinishLoading(webView, url);
        }
    }
}

void WebViewImpl::didFailLoading(int viewTag, const ccstd::string &url) {
    auto it = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto *webView = it->second->_webView;
        if (webView->_onDidFailLoading) {
            webView->_onDidFailLoading(webView, url);
        }
    }
}

void WebViewImpl::onJsCallback(int viewTag, const ccstd::string &message) {
    auto it = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto *webView = it->second->_webView;
        if (webView->_onJSCallback) {
            webView->_onJSCallback(webView, message);
        }
    }
}

void WebViewImpl::setVisible(bool visible) { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setVisible", _viewTag, visible);
}

void WebViewImpl::setFrame(float x, float y, float width, float height) { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setWebViewRect", _viewTag,
                                    static_cast<int>(x), static_cast<int>(y), static_cast<int>(width), static_cast<int>(height));
}

void WebViewImpl::setBounces(bool bounces) {
    // empty function as this was mainly a fix for iOS
}

void WebViewImpl::setBackgroundTransparent(bool isTransparent) { // NOLINT
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setBackgroundTransparent", _viewTag,
                                    isTransparent);
}

} //namespace cc
