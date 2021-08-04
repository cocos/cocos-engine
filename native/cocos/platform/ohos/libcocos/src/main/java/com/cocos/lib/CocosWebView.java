/****************************************************************************
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

package com.cocos.lib;


import ohos.agp.components.PositionLayout;
import ohos.agp.components.webengine.*;
import ohos.app.Context;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;

import java.net.URI;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;


public class CocosWebView extends WebView {
    private static final HiLogLabel TAG = new HiLogLabel(HiLog.LOG_APP, 0, CocosWebViewHelper.class.getSimpleName());

    private int mViewTag;
    private String mJSScheme;

    public CocosWebView(Context context, int viewTag) {
        super(context);
        this.mViewTag = viewTag;
        this.mJSScheme = "";
        this.setWebAgent(new Cocos2dxWebViewClient());


        WebConfig cfg = getWebConfig();
        cfg.setJavaScriptPermit(true);
        cfg.setDataAbilityPermit(true);
        cfg.setLoadsImagesPermit(true);
        cfg.setWebStoragePermit(true);
        cfg.setViewPortFitScreen(true);
        cfg.setTextAutoSizing(true);

//        setTouchFocusable(true);
//        setFocusable(FOCUS_ENABLE);
//        requestFocus();
    }

    public void setJavascriptInterfaceScheme(String scheme) {
        this.mJSScheme = scheme != null ? scheme : "";
    }

    public void setScalesPageToFit(boolean scalesPageToFit) {
        this.getWebConfig().setViewPortFitScreen(scalesPageToFit);
    }

    class Cocos2dxWebViewClient extends WebAgent {
        @Override
        public boolean isNeedLoadUrl(WebView view, ResourceRequest request) {
            String urlString = request.getRequestUrl().toString();
            try {
                URI uri = new URI(request.getRequestUrl().toString());
                if (uri.getScheme().equals(mJSScheme)) {
                    CocosHelper.runOnGameThread(
                            () -> CocosWebViewHelper._onJsCallback(mViewTag, urlString)
                    );
                    return true;
                }
            } catch (Exception e) {
                HiLog.debug(TAG, "Failed to create URI from url");
            }

            FutureTask<Boolean> shouldStartLoadingCB = new FutureTask<>(
                    ()-> CocosWebViewHelper._shouldStartLoading(mViewTag, urlString)
            );

            // run worker on cocos thread
            CocosHelper.runOnGameThread(shouldStartLoadingCB);
            // wait for result from cocos thread

            try {
                return shouldStartLoadingCB.get();
            } catch (InterruptedException ex) {
                HiLog.debug(TAG, "'shouldOverrideUrlLoading' failed");
            } catch (ExecutionException e) {
                e.printStackTrace();
            }
            return true;
        }

        @Override
        public void onPageLoaded(WebView view, final String url) {
            super.onPageLoaded(view, url);

            CocosHelper.runOnGameThread(
                    () -> CocosWebViewHelper._didFinishLoading(mViewTag, url)
            );
        }

        @Override
        public void onError(WebView view, ResourceRequest request, ResourceError error) {
            super.onError(view, request, error);
            final String failingUrl = request.getRequestUrl().toString();
            CocosHelper.runOnGameThread(
                    () -> CocosWebViewHelper._didFailLoading(mViewTag, failingUrl)
            );
        }
    }

    public void setWebViewRect(int left, int top, int maxWidth, int maxHeight) {
        PositionLayout.LayoutConfig layoutParams = new PositionLayout.LayoutConfig(
                PositionLayout.LayoutConfig.MATCH_CONTENT,
                PositionLayout.LayoutConfig.MATCH_CONTENT);
        layoutParams.setMarginLeft(left);
        layoutParams.setMarginTop(top);
        layoutParams.width = maxWidth;
        layoutParams.height = maxHeight;
        this.setLayoutConfig(layoutParams);

    }
}
