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

// Webview not available on tvOS
#if (USE_WEBVIEW > 0) && (CC_PLATFORM == CC_PLATFORM_MAC_IOS)

    #import <WebKit/WKWebView.h>
    #import <WebKit/WKUIDelegate.h>
    #import <WebKit/WKNavigationDelegate.h>

    #include "WebView-inl.h"
    #include "platform/FileUtils.h"

@interface UIWebViewWrapper : NSObject
@property (nonatomic) std::function<bool(std::string url)> shouldStartLoading;
@property (nonatomic) std::function<void(std::string url)> didFinishLoading;
@property (nonatomic) std::function<void(std::string url)> didFailLoading;
@property (nonatomic) std::function<void(std::string url)> onJsCallback;

@property (nonatomic, readonly, getter=canGoBack) BOOL canGoBack;
@property (nonatomic, readonly, getter=canGoForward) BOOL canGoForward;

+ (instancetype)webViewWrapper;

- (void)setVisible:(bool)visible;

- (void)setBounces:(bool)bounces;

- (void)setFrameWithX:(float)x y:(float)y width:(float)width height:(float)height;

- (void)setJavascriptInterfaceScheme:(const std::string &)scheme;

- (void)loadData:(const std::string &)data MIMEType:(const std::string &)MIMEType textEncodingName:(const std::string &)encodingName baseURL:(const std::string &)baseURL;

- (void)loadHTMLString:(const std::string &)string baseURL:(const std::string &)baseURL;

- (void)loadUrl:(const std::string &)urlString;

- (void)loadFile:(const std::string &)filePath;

- (void)stopLoading;

- (void)reload;

- (void)evaluateJS:(const std::string &)js;

- (void)goBack;

- (void)goForward;

- (void)setScalesPageToFit:(const bool)scalesPageToFit;

- (void)setBackgroundTransparent:(const bool)isTransparent;
@end

@interface UIWebViewWrapper () <WKUIDelegate, WKNavigationDelegate>
@property (nonatomic, assign) WKWebView *uiWebView;
@property (nonatomic, copy) NSString *jsScheme;
@end

@implementation UIWebViewWrapper {
}

+ (instancetype)webViewWrapper {
    return [[[self alloc] init] autorelease];
}

- (instancetype)init {
    self = [super init];
    if (self) {
        self.uiWebView = nil;
        self.shouldStartLoading = nullptr;
        self.didFinishLoading = nullptr;
        self.didFailLoading = nullptr;
    }
    return self;
}

- (void)dealloc {
    self.uiWebView.UIDelegate = nil;
    [self.uiWebView removeFromSuperview];
    [self.uiWebView release];
    self.jsScheme = nil;
    [super dealloc];
}

- (void)setupWebView {
    if (!self.uiWebView) {
        self.uiWebView = [[WKWebView alloc] init];
        self.uiWebView.UIDelegate = self;
        self.uiWebView.navigationDelegate = self;
    }
    if (!self.uiWebView.superview) {
        UIView *eaglview = UIApplication.sharedApplication.delegate.window.rootViewController.view;
        [eaglview addSubview:self.uiWebView];
    }
}

- (void)setVisible:(bool)visible {
    self.uiWebView.hidden = !visible;
}

- (void)setBounces:(bool)bounces {
    self.uiWebView.scrollView.bounces = bounces;
}

- (void)setFrameWithX:(float)x y:(float)y width:(float)width height:(float)height {
    if (!self.uiWebView) {
        [self setupWebView];
    }
    CGRect newFrame = CGRectMake(x, y, width, height);
    if (!CGRectEqualToRect(self.uiWebView.frame, newFrame)) {
        self.uiWebView.frame = CGRectMake(x, y, width, height);
    }
}

- (void)setJavascriptInterfaceScheme:(const std::string &)scheme {
    self.jsScheme = @(scheme.c_str());
}

- (void)loadData:(const std::string &)data MIMEType:(const std::string &)MIMEType textEncodingName:(const std::string &)encodingName baseURL:(const std::string &)baseURL {
    auto path = [[NSBundle mainBundle] resourcePath];
    path = [path stringByAppendingPathComponent:@(baseURL.c_str())];
    auto url = [NSURL fileURLWithPath:path];

    [self.uiWebView loadData:[NSData dataWithBytes:data.c_str() length:data.length()]
                     MIMEType:@(MIMEType.c_str())
        characterEncodingName:@(encodingName.c_str())
                      baseURL:url];
}

- (void)loadHTMLString:(const std::string &)string baseURL:(const std::string &)baseURL {
    if (!self.uiWebView) {
        [self setupWebView];
    }
    auto path = [[NSBundle mainBundle] resourcePath];
    path = [path stringByAppendingPathComponent:@(baseURL.c_str())];
    auto url = [NSURL fileURLWithPath:path];
    [self.uiWebView loadHTMLString:@(string.c_str()) baseURL:url];
}

- (void)loadUrl:(const std::string &)urlString {
    if (!self.uiWebView) {
        [self setupWebView];
    }
    NSURL *url = [NSURL URLWithString:@(urlString.c_str())];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    [self.uiWebView loadRequest:request];
}

- (void)loadFile:(const std::string &)filePath {
    if (!self.uiWebView) {
        [self setupWebView];
    }
    NSURL *url = [NSURL fileURLWithPath:@(filePath.c_str())];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    [self.uiWebView loadRequest:request];
}

- (void)stopLoading {
    [self.uiWebView stopLoading];
}

- (void)reload {
    [self.uiWebView reload];
}

- (BOOL)canGoForward {
    return self.uiWebView.canGoForward;
}

- (BOOL)canGoBack {
    return self.uiWebView.canGoBack;
}

- (void)goBack {
    [self.uiWebView goBack];
}

- (void)goForward {
    [self.uiWebView goForward];
}

- (void)evaluateJS:(const std::string &)js {
    if (!self.uiWebView) {
        [self setupWebView];
    }
    [self.uiWebView evaluateJavaScript:@(js.c_str()) completionHandler:nil];
}

- (void)setScalesPageToFit:(const bool)scalesPageToFit {
    // TODO: there is not corresponding API in WK.
    // https://stackoverflow.com/questions/26295277/wkwebview-equivalent-for-uiwebviews-scalespagetofit/43048514 seems has a solution,
    // but it doesn't support setting it dynamically. If we want to set this feature dynamically, then it will be too complex.
}

- (void)setBackgroundTransparent:(const bool)isTransparent {
    if (!self.uiWebView) {
        [self setupWebView];
    }
    [self.uiWebView setOpaque:isTransparent ? NO : YES];
    [self.uiWebView setBackgroundColor:isTransparent ? [UIColor clearColor] : [UIColor whiteColor]];
}

    #pragma mark - WKNavigationDelegate
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSString *url = [[navigationAction request].URL.absoluteString stringByRemovingPercentEncoding];
    NSString *scheme = [navigationAction request].URL.scheme;
    if ([scheme isEqualToString:self.jsScheme]) {
        self.onJsCallback(url.UTF8String);
        decisionHandler(WKNavigationActionPolicyCancel);
        return;
    }
    if (self.shouldStartLoading && url) {
        if (self.shouldStartLoading(url.UTF8String))
            decisionHandler(WKNavigationActionPolicyAllow);
        else
            decisionHandler(WKNavigationActionPolicyCancel);

        return;
    }

    decisionHandler(WKNavigationActionPolicyAllow);
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    if (self.didFinishLoading) {
        NSString *url = [webView.URL absoluteString];
        self.didFinishLoading([url UTF8String]);
    }
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    if (self.didFailLoading) {
        NSString *errorInfo = error.userInfo[NSURLErrorFailingURLStringErrorKey];
        if (errorInfo) {
            self.didFailLoading([errorInfo UTF8String]);
        }
    }
}

    #pragma WKUIDelegate

// Implement js alert function.
- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)())completionHandler {
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:message
                                                                             message:nil
                                                                      preferredStyle:UIAlertControllerStyleAlert];
    [alertController addAction:[UIAlertAction actionWithTitle:@"Ok"
                                                        style:UIAlertActionStyleCancel
                                                      handler:^(UIAlertAction *action) {
                                                          completionHandler();
                                                      }]];

    auto rootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
    [rootViewController presentViewController:alertController
                                     animated:YES
                                   completion:^{
                                   }];
}

@end

namespace cc {

WebViewImpl::WebViewImpl(WebView *webView)
: _uiWebViewWrapper([UIWebViewWrapper webViewWrapper]),
  _webView(webView) {
    [_uiWebViewWrapper retain];

    _uiWebViewWrapper.shouldStartLoading = [this](std::string url) {
        if (this->_webView->_onShouldStartLoading) {
            return this->_webView->_onShouldStartLoading(this->_webView, url);
        }
        return true;
    };
    _uiWebViewWrapper.didFinishLoading = [this](std::string url) {
        if (this->_webView->_onDidFinishLoading) {
            this->_webView->_onDidFinishLoading(this->_webView, url);
        }
    };
    _uiWebViewWrapper.didFailLoading = [this](std::string url) {
        if (this->_webView->_onDidFailLoading) {
            this->_webView->_onDidFailLoading(this->_webView, url);
        }
    };
    _uiWebViewWrapper.onJsCallback = [this](std::string url) {
        if (this->_webView->_onJSCallback) {
            this->_webView->_onJSCallback(this->_webView, url);
        }
    };
}

WebViewImpl::~WebViewImpl() {
    [_uiWebViewWrapper release];
    _uiWebViewWrapper = nullptr;
}

void WebViewImpl::setJavascriptInterfaceScheme(const std::string &scheme) {
    [_uiWebViewWrapper setJavascriptInterfaceScheme:scheme];
}

void WebViewImpl::loadData(const Data &data,
                           const std::string &MIMEType,
                           const std::string &encoding,
                           const std::string &baseURL) {

    std::string dataString(reinterpret_cast<char *>(data.getBytes()), static_cast<unsigned int>(data.getSize()));
    [_uiWebViewWrapper loadData:dataString MIMEType:MIMEType textEncodingName:encoding baseURL:baseURL];
}

void WebViewImpl::loadHTMLString(const std::string &string, const std::string &baseURL) {
    [_uiWebViewWrapper loadHTMLString:string baseURL:baseURL];
}

void WebViewImpl::loadURL(const std::string &url) {
    [_uiWebViewWrapper loadUrl:url];
}

void WebViewImpl::loadFile(const std::string &fileName) {
    auto fullPath = cc::FileUtils::getInstance()->fullPathForFilename(fileName);
    [_uiWebViewWrapper loadFile:fullPath];
}

void WebViewImpl::stopLoading() {
    [_uiWebViewWrapper stopLoading];
}

void WebViewImpl::reload() {
    [_uiWebViewWrapper reload];
}

bool WebViewImpl::canGoBack() {
    return _uiWebViewWrapper.canGoBack;
}

bool WebViewImpl::canGoForward() {
    return _uiWebViewWrapper.canGoForward;
}

void WebViewImpl::goBack() {
    [_uiWebViewWrapper goBack];
}

void WebViewImpl::goForward() {
    [_uiWebViewWrapper goForward];
}

void WebViewImpl::evaluateJS(const std::string &js) {
    [_uiWebViewWrapper evaluateJS:js];
}

void WebViewImpl::setBounces(bool bounces) {
    [_uiWebViewWrapper setBounces:bounces];
}

void WebViewImpl::setScalesPageToFit(bool scalesPageToFit) {
    [_uiWebViewWrapper setScalesPageToFit:scalesPageToFit];
}

void WebViewImpl::setVisible(bool visible) {
    [_uiWebViewWrapper setVisible:visible];
}

void WebViewImpl::setFrame(float x, float y, float width, float height) {
    UIView *view = UIApplication.sharedApplication.delegate.window.rootViewController.view;
    auto scaleFactor = [view contentScaleFactor];
    [_uiWebViewWrapper setFrameWithX:x / scaleFactor
                                   y:y / scaleFactor
                               width:width / scaleFactor
                              height:height / scaleFactor];
}

void WebViewImpl::setBackgroundTransparent(bool isTransparent) {
    [_uiWebViewWrapper setBackgroundTransparent:isTransparent];
}
} //namespace cc

#endif
