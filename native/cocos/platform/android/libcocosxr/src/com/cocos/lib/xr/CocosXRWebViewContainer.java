/****************************************************************************
 * Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.
 *
 * http://www.cocos.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 ****************************************************************************/

package com.cocos.lib.xr;

import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Canvas;
import android.graphics.PorterDuff;
import android.net.http.SslError;
import android.opengl.GLES30;
import android.os.Build;
import android.os.Message;
import android.os.SystemClock;
import android.util.AttributeSet;
import android.util.Log;
import android.view.Gravity;
import android.view.InputDevice;
import android.view.MotionEvent;
import android.view.Surface;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.webkit.ClientCertRequest;
import android.webkit.CookieManager;
import android.webkit.HttpAuthHandler;
import android.webkit.PermissionRequest;
import android.webkit.SafeBrowsingResponse;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

public class CocosXRWebViewContainer extends FrameLayout {
    private static final String TAG = "CocosXRWebViewContainer";
    WebView webView;
    private long lastDrawTime = 0;
    private CocosXRVideoTexture videoTexture;
    private Surface webViewSurface;
    private CocosXRGLHelper.GLQuadScreen quadScreen;
    private boolean isGLInitialized = false;
    private int renderTargetFboId;
    private int videoTextureId = 0;
    private int videoTextureWidth = 0;
    private int videoTextureHeight = 0;

    private boolean isKeyDown = false;
    private long keyDownTime = 0;

    public CocosXRWebViewContainer(Context context) {
        super(context);
        init();
    }

    public CocosXRWebViewContainer(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public CocosXRWebViewContainer(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init();
    }

    void init() {
        webView = new WebView(getContext());
        webView.setLayoutParams(new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT, Gravity.NO_GRAVITY));
        webView.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        webView.getSettings().setSupportZoom(false);
        webView.getSettings().setBuiltInZoomControls(true);
        webView.getSettings().setTextZoom(100);

        webView.getSettings().setDisplayZoomControls(false);
        webView.getSettings().setLoadWithOverviewMode(true);
        webView.getSettings().setUseWideViewPort(true);
        webView.getSettings().setMediaPlaybackRequiresUserGesture(false);

        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setDefaultTextEncodingName("UTF-8");
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowContentAccess(true);
        webView.getSettings().setAllowFileAccessFromFileURLs(true);
        webView.getSettings().setDatabaseEnabled(true);
        webView.getSettings().setAppCacheEnabled(true);
        webView.getSettings().setLoadsImagesAutomatically(true);
        webView.getSettings().setSupportMultipleWindows(false);
        webView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);
        webView.getSettings().setBlockNetworkImage(false);
        webView.getSettings().setGeolocationEnabled(true);
        webView.getSettings().setPluginState(WebSettings.PluginState.ON);
        webView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            webView.getSettings().setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);
        } else {
            webView.getSettings().setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NORMAL);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            webView.getSettings().setSafeBrowsingEnabled(false);
        }
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
        webView.setWebViewClient(new WebViewClient() {

            @Override
            public void onSafeBrowsingHit(WebView view, WebResourceRequest request, int threatType, SafeBrowsingResponse callback) {
                Log.d(TAG, "onSafeBrowsingHit:" + threatType + "," +  request.getUrl().toString());
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                Log.d(TAG, "onReceivedSslError:" + error.toString());
            }

            @Override
            public void onReceivedClientCertRequest(WebView view, ClientCertRequest request) {
                Log.d(TAG, "onReceivedClientCertRequest:" + request.toString());
            }

            @Override
            public void onReceivedHttpAuthRequest(WebView view, HttpAuthHandler handler, String host, String realm) {
                Log.d(TAG, "onReceivedHttpAuthRequest:" + host + ":" + realm);
            }

            @Override
            public void onReceivedLoginRequest(WebView view, String realm, String account, String args) {
                Log.d(TAG, "onReceivedLoginRequest:" + account + ":" + realm + ":" + args);
            }

            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (!url.startsWith("http://") && !url.startsWith("https://")) {
                    Log.e(TAG, "shouldOverrideUrlLoading failed:" + url);
                    view.reload();
                    return false;
                }

                view.loadUrl(url);
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    Log.e(TAG, "onReceivedError:" + error.getDescription() + "," + error.getErrorCode() + "," + view.getTitle());
                }
                super.onReceivedError(view, request, error);
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
                Log.e(TAG, "onReceivedHttpError:" + errorResponse.toString());
                super.onReceivedHttpError(view, request, errorResponse);
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {

            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
                Log.d(TAG, "onCreateWindow：" + resultMsg.toString());
                return super.onCreateWindow(view, isDialog, isUserGesture, resultMsg);
            }

            @Override
            public void onCloseWindow(WebView window) {
                Log.d(TAG, "onCreateWindowonCloseWindow");
                super.onCloseWindow(window);
            }

            @Override
            public void onReceivedTitle(WebView view, String title) {
            }

            @Override
            public void onProgressChanged(WebView view, int newProgress) {
            }

            @Override
            public void onShowCustomView(View view, CustomViewCallback callback) {
                Log.d(TAG, "onShowCustomView");
                if(callback != null) {
                    view.setVisibility(View.GONE);
                    callback.onCustomViewHidden();
                }
                /*ViewParent viewParent = webView.getParent();
                if (viewParent instanceof ViewGroup) {
                    ViewGroup viewGroup = (ViewGroup)viewParent;
                    if (viewGroup.getChildCount() > 1) {
                        callback.onCustomViewHidden();
                        return;
                    }
                    viewGroup.getChildAt(0).setVisibility(View.GONE);
                    view.setBackgroundColor(0);
                    viewGroup.addView(view);
                    view.setVisibility(View.VISIBLE);
                }*/
            }

            @Override
            public void onHideCustomView() {
                Log.d(TAG, "onHideCustomView");
                /*ViewParent viewParent = webView.getParent();
                if (viewParent instanceof ViewGroup) {
                    ViewGroup viewGroup = (ViewGroup)viewParent;
                    while (viewGroup.getChildCount() > 1)
                        viewGroup.removeViewAt(1);
                    viewGroup.getChildAt(0).setVisibility(View.VISIBLE);
                }*/
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                String[] resources = request.getResources();
                ArrayList<String> permissions = new ArrayList<>();
                for (String resource : resources) {
                    Log.d(TAG, "onPermissionRequest.resource:" + resource);
                    if (resource.equals("android.webkit.resource.AUDIO_CAPTURE")) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                            if (getContext().checkSelfPermission("android.permission.RECORD_AUDIO") != PackageManager.PERMISSION_GRANTED) {
                                permissions.add(resource);
                            }
                        }
                    } else if (resource.equals("android.webkit.resource.PROTECTED_MEDIA_ID")) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                            if (getContext().checkSelfPermission("android.permission.PROTECTED_MEDIA_ID") != PackageManager.PERMISSION_GRANTED) {
                                permissions.add(resource);
                            }
                        }
                    }
                }

                if(permissions.size() > 0) {
                    String[] names = new String[permissions.size()];
                    permissions.toArray(names);
                    Log.d(TAG, "acquirePermissions:" + Arrays.toString(names));
                    request.grant(names);
                }

            }
        });
        String userAgentString = webView.getSettings().getUserAgentString();
        Log.d(TAG, "ua:" + userAgentString);


        this.quadScreen = new CocosXRGLHelper.GLQuadScreen();
        videoTexture = new CocosXRVideoTexture();
        webView.clearFocus();
        webView.setFocusableInTouchMode(false);
        addView(webView);
    }

    @Override
    public void draw(Canvas canvas) {
        lastDrawTime = System.currentTimeMillis();
        if (webViewSurface == null && canvas != null) {
            super.draw(canvas);
            return;
        } else if(webViewSurface == null) {
            return;
        }
        //returns canvas attached to gl texture to draw on
        Canvas glAttachedCanvas;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            glAttachedCanvas = webViewSurface.lockHardwareCanvas();
        } else {
            glAttachedCanvas = webViewSurface.lockCanvas(null);
        }
        if (glAttachedCanvas != null) {
            glAttachedCanvas.drawColor(0, PorterDuff.Mode.CLEAR);
            glAttachedCanvas.scale(1.0F, 1.0F);
            glAttachedCanvas.translate(-getScrollX(), -getScrollY());
            //draw the view to provided canvas
            super.draw(glAttachedCanvas);
        }
        webViewSurface.unlockCanvasAndPost(glAttachedCanvas);
        if (videoTexture != null) {
            videoTexture.onFrameAvailable(null);
        }
    }

    public void onDrawCheck() {
        if (webViewSurface != null && System.currentTimeMillis() - lastDrawTime > 16) {
            post(() -> draw(null));
        }
    }

    CocosXRVideoTexture getVideoTexture() {
        return videoTexture;
    }

    public void onDestroy() {
        Log.d(TAG, "destroy." + hashCode());
        if(webView != null) {
            webView.removeAllViews();
            webView.destroy();
            webView = null;
        }

        if (webViewSurface != null) {
            webViewSurface.release();
            webViewSurface = null;
        }
    }

    public void setTextureInfo(int textureWidth, int textureHeight, int videoTextureId) {
        this.videoTextureId = videoTextureId;
        this.videoTextureWidth = textureWidth;
        this.videoTextureHeight = textureHeight;
    }

    public int getTargetTextureId() {
        return videoTextureId;
    }

    public int getVideoTextureWidth() {
        return videoTextureWidth;
    }

    public int getVideoTextureHeight() {
        return videoTextureHeight;
    }

    public void onGLReady() {
        videoTexture.createSurfaceTexture();
        videoTexture.getSurfaceTexture().setDefaultBufferSize(this.videoTextureWidth, this.videoTextureHeight);
        quadScreen.initShader();
        webViewSurface = new Surface(videoTexture.getSurfaceTexture());
        isGLInitialized = true;

        int[] tmpFboId = new int[1];
        GLES30.glGenFramebuffers(1, tmpFboId, 0);
        renderTargetFboId = tmpFboId[0];
        CocosXRGLHelper.checkGLError("fbo");
        Log.d(TAG, "onGLReady." + this.hashCode() + ",oes." + videoTexture.getOESTextureId() + ",fbo." + tmpFboId[0] +
            "," + this.videoTextureWidth + "x" + this.videoTextureHeight);
    }

    public void onBeforeGLDrawFrame() {
        if (videoTextureId == 0 || videoTextureWidth == 0 || videoTextureHeight == 0) {
            return;
        }

        if (!isGLInitialized) {
            onGLReady();
        }
    }

    public void onGLDrawFrame() {
        if (videoTextureId == 0 || videoTextureWidth == 0 || videoTextureHeight == 0) {
            return;
        }

        GLES30.glBindFramebuffer(GLES30.GL_FRAMEBUFFER, renderTargetFboId);
        GLES30.glFramebufferTexture2D(GLES30.GL_FRAMEBUFFER, GLES30.GL_COLOR_ATTACHMENT0, GLES30.GL_TEXTURE_2D, videoTextureId, 0);
        GLES30.glViewport(0, 0, videoTextureWidth, videoTextureHeight);
        GLES30.glScissor(0, 0, videoTextureWidth, videoTextureHeight);
        onDrawCheck();
        videoTexture.updateTexture();
        quadScreen.draw(videoTexture.getOESTextureId(), videoTexture.getVideoMatrix());
        GLES30.glFlush();
    }

    public void onGLDestroy() {
        Log.d(TAG, "onGLDestroy." + this.hashCode());
        if(renderTargetFboId > 0) {
            GLES30.glDeleteFramebuffers(1, new int[]{renderTargetFboId}, 0);
            renderTargetFboId = 0;
        }

        if (videoTexture != null) {
            videoTexture.release();
            videoTexture = null;
        }

        if (quadScreen != null) {
            quadScreen.release();
            quadScreen = null;
        }
    }

    public void simulateTouchDown(float ux, float uy) {
        isKeyDown = true;
        keyDownTime = SystemClock.uptimeMillis();
        float touchX = ux * getWidth();
        float touchY = getHeight() - uy * getHeight();
        post(() -> {
            MotionEvent motionEvent = MotionEvent.obtain(keyDownTime, SystemClock.uptimeMillis() + 100, MotionEvent.ACTION_DOWN, touchX, touchY, 0);
            motionEvent.setSource(InputDevice.SOURCE_TOUCHSCREEN);
            dispatchTouchEvent(motionEvent);
        });
    }

    public void simulateTouchMove(float ux, float uy) {
        if (isKeyDown) {
            post(() -> {
                float touchX = ux * getWidth();
                float touchY = getHeight() - uy * getHeight();
                MotionEvent motionEvent = MotionEvent.obtain(keyDownTime, SystemClock.uptimeMillis() + 100, MotionEvent.ACTION_MOVE, touchX, touchY, 0);
                motionEvent.setSource(InputDevice.SOURCE_TOUCHSCREEN);
                dispatchTouchEvent(motionEvent);
            });
        }
    }

    public void simulateTouchUp(float ux, float uy) {
        isKeyDown = false;
        float touchX = ux * getWidth();
        float touchY = getHeight() - uy * getHeight();
        post(() -> {
            MotionEvent motionEvent = MotionEvent.obtain(keyDownTime, SystemClock.uptimeMillis() + 100, MotionEvent.ACTION_UP, touchX, touchY, 0);
            motionEvent.setSource(InputDevice.SOURCE_TOUCHSCREEN);
            dispatchTouchEvent(motionEvent);
        });
    }

    public void loadUrl(String url) {
        if(webView != null) {
            HashMap<String, String> hashMap = new HashMap<>();
            hashMap.put("Referer", "https://www.cocos.com/");
            webView.loadUrl(url, hashMap);
        }
    }

    public WebSettings getSettings() {
        return webView.getSettings();
    }

    public void goForward() {
        webView.goForward();
    }

    public void goBack() {
        webView.goBack();
    }

    public void reload() {
        webView.reload();
    }


}
