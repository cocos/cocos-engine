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

#pragma once

#include <functional>
#include "base/Data.h"
#include "base/Macros.h"
#include "base/RefCounted.h"
#include "base/std/container/string.h"

/**
 * @addtogroup ui
 * @{
 */

namespace cc {

class WebViewImpl;

/**
 * @brief A View that displays web pages.
 *
 * @note WebView displays web pages base on system widget.
 * It's mean WebView displays web pages above all graphical elements of cocos2d-x.
 * @js NA
 */
class WebView final {
public:
    /**
         * Allocates and initializes a WebView.
         */
    static WebView *create();

    /**
     * Destroy webview, remove it from its parent
     */
    void destroy();

    /**
         * Set javascript interface scheme.
         *
         * @see WebView::setOnJSCallback()
         */
    void setJavascriptInterfaceScheme(const ccstd::string &scheme);

    /**
         * Sets the main page contents, MIME type, content encoding, and base URL.
         *
         * @param data The content for the main page.
         * @param mimeType The MIME type of the data.
         * @param encoding The encoding of the data.
         * @param baseURL The base URL for the content.
         */
    void loadData(const cc::Data &data,
                  const ccstd::string &mimeType,
                  const ccstd::string &encoding,
                  const ccstd::string &baseURL);

    /**
         * Sets the main page content and base URL.
         *
         * @param string The content for the main page.
         * @param baseURL The base URL for the content.
         */
    void loadHTMLString(const ccstd::string &string, const ccstd::string &baseURL = "");

    /**
         * Loads the given URL.
         *
         * @param url Content URL.
         */
    void loadURL(const ccstd::string &url);

    /**
         * Loads the given fileName.
         *
         * @param fileName Content fileName.
         */
    void loadFile(const ccstd::string &fileName);

    /**
         * Stops the current load.
         */
    void stopLoading();

    /**
         * Reloads the current URL.
         */
    void reload();

    /**
         * Gets whether this WebView has a back history item.
         *
         * @return WebView has a back history item.
         */
    bool canGoBack();

    /**
         * Gets whether this WebView has a forward history item.
         *
         * @return WebView has a forward history item.
         */
    bool canGoForward();

    /**
         * Goes back in the history.
         */
    void goBack();

    /**
         * Goes forward in the history.
         */
    void goForward();

    /**
         * Evaluates JavaScript in the context of the currently displayed page.
         */
    void evaluateJS(const ccstd::string &js);

    /**
         * Set WebView should support zooming. The default value is false.
         */
    void setScalesPageToFit(bool scalesPageToFit);

    /**
         * Call before a web view begins loading.
         *
         * @param callback The web view that is about to load new content.
         * @return YES if the web view should begin loading content; otherwise, NO.
         */
    void setOnShouldStartLoading(
        const std::function<bool(WebView *sender, const ccstd::string &url)> &callback);

    /**
         * A callback which will be called when a WebView event happens.
         */
    using ccWebViewCallback = std::function<void(WebView *, const ccstd::string &)>;

    /**
         * Call after a web view finishes loading.
         *
         * @param callback The web view that has finished loading.
         */
    void setOnDidFinishLoading(const ccWebViewCallback &callback);

    /**
         * Call if a web view failed to load content.
         *
         * @param callback The web view that has failed loading.
         */
    void setOnDidFailLoading(const ccWebViewCallback &callback);

    /**
         * This callback called when load URL that start with javascript interface scheme.
         */
    void setOnJSCallback(const ccWebViewCallback &callback);

    /**
         * Get the callback when WebView is about to start.
         */
    std::function<bool(WebView *sender, const ccstd::string &url)>
    getOnShouldStartLoading() const;

    /**
         * Get the callback when WebView has finished loading.
         */
    ccWebViewCallback getOnDidFinishLoading() const;

    /**
         * Get the callback when WebView has failed loading.
         */
    ccWebViewCallback getOnDidFailLoading() const;

    /**
         *Get the Javascript callback.
         */
    ccWebViewCallback getOnJSCallback() const;

    /**
         * Set whether the webview bounces at end of scroll of WebView.
         */
    void setBounces(bool bounce);

    /**
         * Toggle visibility of WebView.
         */
    virtual void setVisible(bool visible);

    /**
         * Set the rect of WebView.
         */
    virtual void setFrame(float x, float y, float width, float height);

    /**
         * Set the background transparent
         */
    virtual void setBackgroundTransparent(bool isTransparent);

protected:
    std::function<bool(WebView *sender, const ccstd::string &url)> _onShouldStartLoading;

    ccWebViewCallback _onDidFinishLoading;

    ccWebViewCallback _onDidFailLoading;

    ccWebViewCallback _onJSCallback;

    /**
         * Default constructor.
         */
    WebView();

    /**
         * Default destructor.
         */
    ~WebView();

private:
    WebViewImpl *_impl;

    friend class WebViewImpl;
};

} // namespace cc
