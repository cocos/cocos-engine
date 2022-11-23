/****************************************************************************
 Copyright (c) 2010-2011 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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
package com.cocos.lib;


import ohos.agp.colors.RgbColor;
import ohos.agp.components.Component;
import ohos.agp.components.DirectionalLayout;
import ohos.agp.components.StackLayout;

import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;


public class CocosWebViewHelper {
    private static final String TAG = CocosWebViewHelper.class.getSimpleName();

    private static StackLayout sLayout;

    private static ConcurrentHashMap<Integer, CocosWebView> webViews;
    private static int viewTag = 0;

    public CocosWebViewHelper(StackLayout layout) {

        CocosWebViewHelper.sLayout = layout;

        CocosWebViewHelper.webViews = new ConcurrentHashMap<Integer, CocosWebView>();
    }

    private static native boolean shouldStartLoading(int index, String message);
    private static native void didFinishLoading(int index, String message);
    private static native void didFailLoading(int index, String message);
    private static native void onJsCallback(int index, String message);

    public static boolean _shouldStartLoading(int index, String message) { return shouldStartLoading(index, message); }
    public static void _didFinishLoading(int index, String message) { didFinishLoading(index, message); }
    public static void _didFailLoading(int index, String message) { didFailLoading(index, message); }
    public static void _onJsCallback(int index, String message) { onJsCallback(index, message); }

    public static int createWebView() {
        final int index = viewTag;
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = new CocosWebView(CocosHelper.getContext(), index);
                DirectionalLayout.LayoutConfig lParams = new DirectionalLayout.LayoutConfig(
                        DirectionalLayout.LayoutConfig.MATCH_CONTENT,
                        DirectionalLayout.LayoutConfig.MATCH_CONTENT);
                sLayout.addComponent(webView, lParams);

                webViews.put(index, webView);
            }
        });
        return viewTag++;
    }

    public static void removeWebView(final int index) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webViews.remove(index);
                    sLayout.removeComponent(webView);
                    webView.release();
                    webView = null;
                }
            }
        });
    }

    public static void setVisible(final int index, final boolean visible) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webView.setVisibility(visible ? Component.VISIBLE : Component.HIDE);
                }
            }
        });
    }

    public static void setWebViewRect(final int index, final int left, final int top, final int maxWidth, final int maxHeight) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webView.setWebViewRect(left, top, maxWidth, maxHeight);
                }
            }
        });
    }

    public static void setBackgroundTransparent(final int index, final boolean isTransparent) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    RgbColor color = isTransparent ? new RgbColor(255, 255, 255, 0 ): new RgbColor(255, 255, 255, 255);
//                  Element bg = webView.getResourceManager().getElement(isTransparent ? ResourceTable.Graphic_bg_webview_transparent : ResourceTable.Graphic_bg_webview_white);
                    webView.setWebViewBackground(color);

                }
            }
        });
    }

    public static void setJavascriptInterfaceScheme(final int index, final String scheme) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webView.setJavascriptInterfaceScheme(scheme);
                }
            }
        });
    }

    public static void loadData(final int index, final String data, final String mimeType, final String encoding, final String baseURL) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webView.load(data, mimeType, encoding, baseURL, null);
                }
            }
        });
    }

    public static void loadHTMLString(final int index, final String data, final String baseUrl) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webView.load(data, null, null, baseUrl, null);
                }
            }
        });
    }

    public static void loadUrl(final int index, final String url) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webView.load(url);
                }
            }
        });
    }

    public static void loadFile(final int index, final String filePath) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webView.load(filePath);
                }
            }
        });
    }

    public static void stopLoading(final int index) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    // FIXME: stop
                  //  webView.abo();
                }
            }
        });

    }

    public static void reload(final int index) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webView.reload();
                }
            }
        });
    }

    public static <T> T callInMainThread(Callable<T> call) throws ExecutionException, InterruptedException {
        FutureTask<T> task = new FutureTask<T>(call);
        CocosHelper.runOnUIThread(task);
        return task.get();
    }

    public static boolean canGoBack(final int index) throws InterruptedException {
        Callable<Boolean> callable = new Callable<Boolean>() {
            @Override
            public Boolean call() throws Exception {
                CocosWebView webView = webViews.get(index);
                return webView != null  && webView.getNavigator().canGoBack();
            }
        };
        try {
            return callInMainThread(callable);
        } catch (ExecutionException e) {
            return false;
        }
    }

    public static boolean canGoForward(final int index) throws InterruptedException {
        Callable<Boolean> callable = new Callable<Boolean>() {
            @Override
            public Boolean call() throws Exception {
                CocosWebView webView = webViews.get(index);
                return webView != null && webView.getNavigator().canGoForward();
            }
        };
        try {
            return callInMainThread(callable);
        } catch (ExecutionException e) {
            return false;
        }
    }

    public static void goBack(final int index) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webView.getNavigator().goBack();
                }
            }
        });
    }

    public static void goForward(final int index) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webView.getNavigator().goForward();
                }
            }
        });
    }

    public static void evaluateJS(final int index, final String js) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    // webView.load("javascript:" + js);
                    webView.executeJs(js, null);;
                }
            }
        });
    }

    public static void setScalesPageToFit(final int index, final boolean scalesPageToFit) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosWebView webView = webViews.get(index);
                if (webView != null) {
                    webView.setScalesPageToFit(scalesPageToFit);
                }
            }
        });
    }
}
