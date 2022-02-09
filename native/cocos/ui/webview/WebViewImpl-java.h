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

#pragma once

#include <cstdint>
#include <iosfwd>

#include "base/Data.h"
#include "base/Macros.h"

namespace cc {

class WebView;

class WebViewImpl {
public:
    explicit WebViewImpl(WebView *webView);

    virtual ~WebViewImpl();

    void setJavascriptInterfaceScheme(const std::string &scheme);

    void loadData(const cc::Data &data, const std::string &mimeType,
                  const std::string &encoding, const std::string &baseURL);

    void loadHTMLString(const std::string &string, const std::string &baseURL);

    void loadURL(const std::string &url);

    void loadFile(const std::string &fileName);

    void stopLoading();

    void reload();

    bool canGoBack();

    bool canGoForward();

    void goBack();

    void goForward();

    void evaluateJS(const std::string &js);

    void setScalesPageToFit(bool scalesPageToFit);

    virtual void setVisible(bool visible);

    virtual void setFrame(float x, float y, float width, float height);

    void setBounces(bool bounces);

    void setBackgroundTransparent(bool isTransparent);

    static bool shouldStartLoading(int viewTag, const std::string &url);

    static void didFinishLoading(int viewTag, const std::string &url);

    static void didFailLoading(int viewTag, const std::string &url);

    static void onJsCallback(int viewTag, const std::string &message);

private:
    int      _viewTag;
    WebView *_webView;
};

} // namespace cc
