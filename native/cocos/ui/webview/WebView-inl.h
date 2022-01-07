/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include "WebView.h"
#include "platform/FileUtils.h"

#if CC_PLATFORM == CC_PLATFORM_MAC_IOS
    #include "WebViewImpl-ios.h"
#elif CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS
    #include "WebViewImpl-java.h"
#else
static_assert(false, "WebView only supported on iOS & Android");
#endif

namespace cc {

WebView::WebView()
: _impl(new WebViewImpl(this)),
  _onJSCallback(nullptr),
  _onShouldStartLoading(nullptr),
  _onDidFinishLoading(nullptr),
  _onDidFailLoading(nullptr) {
}

WebView::~WebView() {
    CC_SAFE_DELETE(_impl);
}

WebView *WebView::create() {
    auto webView = new (std::nothrow) WebView();
    if (webView) {
        return webView;
    }
    CC_SAFE_DELETE(webView);
    return nullptr;
}

void WebView::setJavascriptInterfaceScheme(const std::string &scheme) {
    _impl->setJavascriptInterfaceScheme(scheme);
}

void WebView::loadData(const cc::Data &   data,
                       const std::string &MIMEType,
                       const std::string &encoding,
                       const std::string &baseURL) {
    _impl->loadData(data, MIMEType, encoding, baseURL);
}

void WebView::loadHTMLString(const std::string &string, const std::string &baseURL) {
    _impl->loadHTMLString(string, baseURL);
}

void WebView::loadURL(const std::string &url) {
    _impl->loadURL(url);
}

void WebView::loadFile(const std::string &fileName) {
    _impl->loadFile(fileName);
}

void WebView::stopLoading() {
    _impl->stopLoading();
}

void WebView::reload() {
    _impl->reload();
}

bool WebView::canGoBack() {
    return _impl->canGoBack();
}

bool WebView::canGoForward() {
    return _impl->canGoForward();
}

void WebView::goBack() {
    _impl->goBack();
}

void WebView::goForward() {
    _impl->goForward();
}

void WebView::evaluateJS(const std::string &js) {
    _impl->evaluateJS(js);
}

void WebView::setScalesPageToFit(bool scalesPageToFit) {
    _impl->setScalesPageToFit(scalesPageToFit);
}

void WebView::setVisible(bool visible) {
    _impl->setVisible(visible);
}

void WebView::setFrame(float x, float y, float width, float height) {
    _impl->setFrame(x, y, width, height);
}

void WebView::setBounces(bool bounces) {
    _impl->setBounces(bounces);
}

void WebView::setBackgroundTransparent(bool isTransparent) {
    _impl->setBackgroundTransparent(isTransparent);
}

void WebView::setOnDidFailLoading(const ccWebViewCallback &callback) {
    _onDidFailLoading = callback;
}

void WebView::setOnDidFinishLoading(const ccWebViewCallback &callback) {
    _onDidFinishLoading = callback;
}

void WebView::setOnShouldStartLoading(
    const std::function<bool(WebView *sender, const std::string &url)> &callback) {
    _onShouldStartLoading = callback;
}

void WebView::setOnJSCallback(const ccWebViewCallback &callback) {
    _onJSCallback = callback;
}

std::function<bool(WebView
                       *              sender,
                   const std::string &url)>

WebView::getOnShouldStartLoading() const {
    return _onShouldStartLoading;
}

WebView::ccWebViewCallback WebView::getOnDidFailLoading() const {
    return _onDidFailLoading;
}

WebView::ccWebViewCallback WebView::getOnDidFinishLoading() const {
    return _onDidFinishLoading;
}

WebView::ccWebViewCallback WebView::getOnJSCallback() const {
    return _onJSCallback;
}

} //namespace cc
