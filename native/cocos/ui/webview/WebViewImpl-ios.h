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

#ifndef __COCOS2D_UI_WEBVIEWIMPL_IOS_H_
#define __COCOS2D_UI_WEBVIEWIMPL_IOS_H_
/// @cond DO_NOT_SHOW

#include <iosfwd>

@class UIWebViewWrapper;

namespace cc {

class Data;

class WebView;

class WebViewImpl final {
public:
    explicit WebViewImpl(WebView *webView);

    ~WebViewImpl();

    void destroy();

    void setJavascriptInterfaceScheme(const ccstd::string &scheme);

    void loadData(const cc::Data &data,
                  const ccstd::string &MIMEType,
                  const ccstd::string &encoding,
                  const ccstd::string &baseURL);

    void loadHTMLString(const ccstd::string &string, const ccstd::string &baseURL);

    void loadURL(const ccstd::string &url);

    void loadFile(const ccstd::string &fileName);

    void stopLoading();

    void reload();

    bool canGoBack();

    bool canGoForward();

    void goBack();

    void goForward();

    void evaluateJS(const ccstd::string &js);

    void setScalesPageToFit(const bool scalesPageToFit);

    void setVisible(bool visible);

    void setFrame(float x, float y, float width, float height);

    void setBounces(bool bounces);

    void setBackgroundTransparent(bool isTransparent);

private:
    UIWebViewWrapper *_uiWebViewWrapper;
    WebView *_webView;
};
} //namespace cc

/// @endcond
#endif /* __COCOS2D_UI_WEBVIEWIMPL_IOS_H_ */
