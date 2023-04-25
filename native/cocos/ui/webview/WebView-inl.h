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

#include "WebView.h"
#include "base/memory/Memory.h"
#include "platform/FileUtils.h"

#if CC_PLATFORM == CC_PLATFORM_IOS
    #include "WebViewImpl-ios.h"
#elif CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS || CC_PLATFORM == CC_PLATFORM_OPENHARMONY
    #include "WebViewImpl-java.h"
#else
static_assert(false, "WebView only supported on iOS & Android");
#endif

namespace cc {

WebView::WebView()
: _impl(ccnew WebViewImpl(this)),
  _onJSCallback(nullptr),
  _onShouldStartLoading(nullptr),
  _onDidFinishLoading(nullptr),
  _onDidFailLoading(nullptr) {
}

WebView::~WebView() {
    CC_SAFE_DELETE(_impl);
}

WebView *WebView::create() {
    auto webView = ccnew WebView();
    if (webView) {
        return webView;
    }
    return nullptr;
}

void WebView::destroy() {
    CC_SAFE_DESTROY(_impl);
}

void WebView::setJavascriptInterfaceScheme(const ccstd::string &scheme) {
    if (_impl != nullptr) {
        _impl->setJavascriptInterfaceScheme(scheme);
    }
}

void WebView::loadData(const cc::Data &data,
                       const ccstd::string &MIMEType,
                       const ccstd::string &encoding,
                       const ccstd::string &baseURL) {
    if (_impl != nullptr) {
        _impl->loadData(data, MIMEType, encoding, baseURL);
    }
}

void WebView::loadHTMLString(const ccstd::string &string, const ccstd::string &baseURL) {
    if (_impl != nullptr) {
        _impl->loadHTMLString(string, baseURL);
    }
}

void WebView::loadURL(const ccstd::string &url) {
    if (_impl != nullptr) {
        _impl->loadURL(url);
    }
}

void WebView::loadFile(const ccstd::string &fileName) {
    if (_impl != nullptr) {
        _impl->loadFile(fileName);
    }
}

void WebView::stopLoading() {
    if (_impl != nullptr) {
        _impl->stopLoading();
    }
}

void WebView::reload() {
    if (_impl != nullptr) {
        _impl->reload();
    }
}

bool WebView::canGoBack() {
    if (_impl != nullptr) {
        return _impl->canGoBack();
    }
    return false;
}

bool WebView::canGoForward() {
    if (_impl != nullptr) {
        return _impl->canGoForward();
    }
    return false;
}

void WebView::goBack() {
    if (_impl != nullptr) {
        _impl->goBack();
    }
}

void WebView::goForward() {
    if (_impl != nullptr) {
        _impl->goForward();
    }
}

void WebView::evaluateJS(const ccstd::string &js) {
    if (_impl != nullptr) {
        _impl->evaluateJS(js);
    }
}

void WebView::setScalesPageToFit(bool scalesPageToFit) {
    if (_impl != nullptr) {
        _impl->setScalesPageToFit(scalesPageToFit);
    }
}

void WebView::setVisible(bool visible) {
    if (_impl != nullptr) {
        _impl->setVisible(visible);
    }
}

void WebView::setFrame(float x, float y, float width, float height) {
    if (_impl != nullptr) {
        _impl->setFrame(x, y, width, height);
    }
}

void WebView::setBounces(bool bounces) {
    if (_impl != nullptr) {
        _impl->setBounces(bounces);
    }
}

void WebView::setBackgroundTransparent(bool isTransparent) {
    if (_impl != nullptr) {
        _impl->setBackgroundTransparent(isTransparent);
    }
}

void WebView::setOnDidFailLoading(const ccWebViewCallback &callback) {
    _onDidFailLoading = callback;
}

void WebView::setOnDidFinishLoading(const ccWebViewCallback &callback) {
    _onDidFinishLoading = callback;
}

void WebView::setOnShouldStartLoading(
    const std::function<bool(WebView *sender, const ccstd::string &url)> &callback) {
    _onShouldStartLoading = callback;
}

void WebView::setOnJSCallback(const ccWebViewCallback &callback) {
    _onJSCallback = callback;
}

std::function<bool(WebView
                       *sender,
                   const ccstd::string &url)>

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
