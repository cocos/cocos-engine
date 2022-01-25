/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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
#include <string>
#include <unordered_map>

#include "WebView-inl.h"

#include "platform/FileUtils.h"
#include "platform/java/jni/JniHelper.h"

static const std::string CLASS_NAME = "com/cocos/lib/CocosWebViewHelper";

#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, "", __VA_ARGS__)

static const std::string S_DEFAULT_BASE_URL = "file:///android_asset/";
static const std::string S_SD_ROOT_BASE_URL = "file://";

static std::string getFixedBaseUrl(const std::string &baseUrl) {
    std::string fixedBaseUrl;
    if (baseUrl.empty()) {
        fixedBaseUrl = S_DEFAULT_BASE_URL;
    } else if (baseUrl.find(S_SD_ROOT_BASE_URL) != std::string::npos) {
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
    auto        charUrl = env->GetStringUTFChars(jurl, nullptr);
    std::string url     = charUrl;
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
    auto        charUrl = env->GetStringUTFChars(jurl, nullptr);
    std::string url     = charUrl;
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
    auto        charUrl = env->GetStringUTFChars(jurl, nullptr);
    std::string url     = charUrl;
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
    auto        charMessage = env->GetStringUTFChars(jmessage, nullptr);
    std::string message     = charMessage;
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

std::string getUrlStringByFileName(const std::string &fileName) {
    // LOGD("error: %s,%d",__func__,__LINE__);
    const std::string basePath("file:///android_asset/");
    std::string       fullPath = cc::FileUtils::getInstance()->fullPathForFilename(fileName);
    const std::string assetsPath("assets/");

    std::string urlString;
    if (fullPath.find(assetsPath) != std::string::npos) {
        urlString = fullPath.replace(fullPath.find_first_of(assetsPath), assetsPath.length(),
                                     basePath);
    } else {
        urlString = fullPath;
    }

    return urlString;
}
} // namespace

namespace cc {

static std::unordered_map<int, WebViewImpl *> sWebViewImpls;

WebViewImpl::WebViewImpl(WebView *webView) : _viewTag(-1),
                                             _webView(webView) {
    _viewTag                = createWebViewJNI();
    sWebViewImpls[_viewTag] = this;
}

WebViewImpl::~WebViewImpl() {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "removeWebView", _viewTag);
    sWebViewImpls.erase(_viewTag);
}

void WebViewImpl::loadData(const Data &data, const std::string &mimeType,
                           const std::string &encoding, const std::string &baseURL) {
    std::string dataString(reinterpret_cast<char *>(data.getBytes()),
                           static_cast<unsigned int>(data.getSize()));
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setJavascriptInterfaceScheme", _viewTag,
                                    dataString, mimeType, encoding, baseURL);
}

void WebViewImpl::loadHTMLString(const std::string &string, const std::string &baseURL) {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "loadHTMLString", _viewTag, string, baseURL);
}

void WebViewImpl::loadURL(const std::string &url) {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "loadUrl", _viewTag, url);
}

void WebViewImpl::loadFile(const std::string &fileName) {
    auto fullPath = getUrlStringByFileName(fileName);
    JniHelper::callStaticVoidMethod(CLASS_NAME, "loadFile", _viewTag, fullPath);
}

void WebViewImpl::stopLoading() {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "stopLoading", _viewTag);
}

void WebViewImpl::reload() {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "reload", _viewTag);
}

bool WebViewImpl::canGoBack() {
    return JniHelper::callStaticBooleanMethod(CLASS_NAME, "canGoBack", _viewTag);
}

bool WebViewImpl::canGoForward() {
    return JniHelper::callStaticBooleanMethod(CLASS_NAME, "canGoForward", _viewTag);
}

void WebViewImpl::goBack() {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "goBack", _viewTag);
}

void WebViewImpl::goForward() {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "goForward", _viewTag);
}

void WebViewImpl::setJavascriptInterfaceScheme(const std::string &scheme) {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setJavascriptInterfaceScheme", _viewTag,
                                    scheme);
}

void WebViewImpl::evaluateJS(const std::string &js) {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "evaluateJS", _viewTag, js);
}

void WebViewImpl::setScalesPageToFit(bool scalesPageToFit) {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setScalesPageToFit", _viewTag, scalesPageToFit);
}

bool WebViewImpl::shouldStartLoading(int viewTag, const std::string &url) {
    bool allowLoad = true;
    auto it        = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto webView = it->second->_webView;
        if (webView->_onShouldStartLoading) {
            allowLoad = webView->_onShouldStartLoading(webView, url);
        }
    }
    return allowLoad;
}

void WebViewImpl::didFinishLoading(int viewTag, const std::string &url) {
    auto it = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto webView = it->second->_webView;
        if (webView->_onDidFinishLoading) {
            webView->_onDidFinishLoading(webView, url);
        }
    }
}

void WebViewImpl::didFailLoading(int viewTag, const std::string &url) {
    auto it = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto webView = it->second->_webView;
        if (webView->_onDidFailLoading) {
            webView->_onDidFailLoading(webView, url);
        }
    }
}

void WebViewImpl::onJsCallback(int viewTag, const std::string &message) {
    auto it = sWebViewImpls.find(viewTag);
    if (it != sWebViewImpls.end()) {
        auto webView = it->second->_webView;
        if (webView->_onJSCallback) {
            webView->_onJSCallback(webView, message);
        }
    }
}

void WebViewImpl::setVisible(bool visible) {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setVisible", _viewTag, visible);
}

void WebViewImpl::setFrame(float x, float y, float width, float height) {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setWebViewRect", _viewTag,
                                    static_cast<int>(x), static_cast<int>(y), static_cast<int>(width), static_cast<int>(height));
}

void WebViewImpl::setBounces(bool bounces) {
    // empty function as this was mainly a fix for iOS
}

void WebViewImpl::setBackgroundTransparent(bool isTransparent) {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setBackgroundTransparent", _viewTag,
                                    isTransparent);
}

} //namespace cc
