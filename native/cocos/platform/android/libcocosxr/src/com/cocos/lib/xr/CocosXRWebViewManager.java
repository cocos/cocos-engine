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

import static android.opengl.EGL14.EGL_CONTEXT_CLIENT_VERSION;

import android.app.Activity;
import android.opengl.EGL14;
import android.opengl.EGLConfig;
import android.opengl.EGLContext;
import android.opengl.EGLDisplay;
import android.opengl.EGLSurface;
import android.opengl.GLES30;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;

import com.cocos.lib.JsbBridgeWrapper;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class CocosXRWebViewManager {
    private static final String TAG = "CocosXRWebViewManager";
    public static final String XR_WEBVIEW_EVENT_NAME = "xr-webview-";
    public static final String XR_WEBVIEW_EVENT_TAG_TO_ADD = "to-add";
    public static final String XR_WEBVIEW_EVENT_TAG_TO_REMOVE = "to-remove";
    public static final String XR_WEBVIEW_EVENT_TAG_ADDED = "added";
    public static final String XR_WEBVIEW_EVENT_TAG_REMOVED = "removed";
    public static final String XR_WEBVIEW_EVENT_TAG_TEXTUREINFO = "textureinfo";
    public static final String XR_WEBVIEW_EVENT_TAG_HOVER = "hover";
    public static final String XR_WEBVIEW_EVENT_TAG_CLICK_DOWN = "click-down";
    public static final String XR_WEBVIEW_EVENT_TAG_CLICK_UP = "click-up";
    public static final String XR_WEBVIEW_EVENT_TAG_GOFORWARD = "go-forward";
    public static final String XR_WEBVIEW_EVENT_TAG_GOBACK = "go-back";
    public static final String XR_WEBVIEW_EVENT_TAG_LOADURL = "load-url";
    public static final String XR_WEBVIEW_EVENT_TAG_RELOAD = "reload";
    final int MAX_COUNT = 3;

    ConcurrentHashMap<String, CocosXRWebViewContainer> xrWebViewHashMap = new ConcurrentHashMap<>();
    private WeakReference<Activity> activityWeakReference;
    CocosXRWebViewGLThread webViewGLThread;

    private final boolean isMobileUA = false;

    public void createWebView(int webviewId, int textureWidth, int textureHeight, String url) {
        Log.d(TAG, "createWebView:" + webviewId + "," + url);
        if (activityWeakReference.get() != null) {
            activityWeakReference.get().runOnUiThread(() -> {
                CocosXRWebViewContainer xrWebViewContainer = new CocosXRWebViewContainer(activityWeakReference.get());
                View decorView = activityWeakReference.get().getWindow().getDecorView();
                if(decorView instanceof FrameLayout) {
                    FrameLayout parentLayout = (FrameLayout) decorView;
                    FrameLayout.LayoutParams frameLayoutParams = new FrameLayout.LayoutParams(textureWidth, textureHeight);
                    parentLayout.addView(xrWebViewContainer, frameLayoutParams);
                    xrWebViewContainer.setZ(-100 + webviewId);
                }
                if (url != null) {
                    if (isMobileUA) {
                        xrWebViewContainer.getSettings().setUserAgentString("Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.82 Mobile Safari/537.36");
                    } else {
                        xrWebViewContainer.getSettings().setUserAgentString("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36");
                    }
                    xrWebViewContainer.loadUrl(url);
                }

                xrWebViewHashMap.put(String.valueOf(webviewId), xrWebViewContainer);
                // notify
                JsbBridgeWrapper.getInstance().dispatchEventToScript(XR_WEBVIEW_EVENT_NAME.concat(String.valueOf(webviewId)), XR_WEBVIEW_EVENT_TAG_ADDED);
            });
        }
    }

    public void removeWebView(int webviewId) {
        if (!xrWebViewHashMap.containsKey(String.valueOf(webviewId))) {
            return;
        }
        Log.d(TAG, "removeWebView:" + webviewId);
        if (activityWeakReference.get() != null) {
            activityWeakReference.get().runOnUiThread(() -> {
                CocosXRWebViewContainer xrWebViewContainer = xrWebViewHashMap.get(String.valueOf(webviewId));
                if (xrWebViewContainer != null) {
                    View decorView = activityWeakReference.get().getWindow().getDecorView();
                    if(decorView instanceof FrameLayout) {
                        FrameLayout parentLayout = (FrameLayout) decorView;
                        parentLayout.removeView(xrWebViewContainer);
                    }

                    xrWebViewContainer.onDestroy();
                    webViewGLThread.queueEvent(() -> {
                        xrWebViewContainer.onGLDestroy();
                        xrWebViewHashMap.remove(String.valueOf(webviewId));
                    });
                    // notify
                    JsbBridgeWrapper.getInstance().dispatchEventToScript(XR_WEBVIEW_EVENT_TAG_REMOVED.concat(String.valueOf(webviewId)));
                }
            });
        }
    }

    private void goForward(int webviewId) {
        if (activityWeakReference.get() != null) {
            activityWeakReference.get().runOnUiThread(() -> {
                CocosXRWebViewContainer xrWebViewContainer = xrWebViewHashMap.get(String.valueOf(webviewId));
                if (xrWebViewContainer != null) {
                    xrWebViewContainer.goForward();
                }
            });
        }
    }

    private void goBack(int webviewId) {
        if (activityWeakReference.get() != null) {
            activityWeakReference.get().runOnUiThread(() -> {
                CocosXRWebViewContainer xrWebViewContainer = xrWebViewHashMap.get(String.valueOf(webviewId));
                if (xrWebViewContainer != null) {
                    xrWebViewContainer.goBack();
                }
            });
        }
    }

    private void reload(int webviewId) {
        if (activityWeakReference.get() != null) {
            activityWeakReference.get().runOnUiThread(() -> {
                CocosXRWebViewContainer xrWebViewContainer = xrWebViewHashMap.get(String.valueOf(webviewId));
                if (xrWebViewContainer != null) {
                    xrWebViewContainer.reload();
                }
            });
        }
    }

    private void loadUrl(int webviewId, String url) {
        if (activityWeakReference.get() != null) {
            activityWeakReference.get().runOnUiThread(() -> {
                CocosXRWebViewContainer xrWebViewContainer = xrWebViewHashMap.get(String.valueOf(webviewId));
                if (xrWebViewContainer != null) {
                    if (isMobileUA) {
                        xrWebViewContainer.getSettings().setUserAgentString("Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.82 Mobile Safari/537.36");
                    } else {
                        xrWebViewContainer.getSettings().setUserAgentString("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36");
                    }
                    xrWebViewContainer.loadUrl(url);
                }
            });
        }
    }

    public void setTextureInfo(int webViewId, int textureId, int textureWidth, int textureHeight) {
        Log.d(TAG, "setTextureInfo:" + webViewId + "," + textureWidth + "x" + textureHeight + ":" + textureId);
        CocosXRWebViewContainer xrWebViewContainer = xrWebViewHashMap.get(String.valueOf(webViewId));
        if (xrWebViewContainer != null) {
            xrWebViewContainer.setTextureInfo(textureWidth, textureHeight, textureId);
        }

        if (webViewGLThread == null) {
            webViewGLThread = new CocosXRWebViewGLThread();
             webViewGLThread.start();
        }
    }

    public void onCreate(Activity activity) {
        Log.d(TAG, "onCreate");
        activityWeakReference = new WeakReference<>(activity);
        for (int i = 0; i < MAX_COUNT; i++) {
            String eventName = XR_WEBVIEW_EVENT_NAME.concat(String.valueOf(i));
            int webviewId = i;
            JsbBridgeWrapper.getInstance().addScriptEventListener(eventName, arg -> {
                if (arg == null) {
                    Log.e(TAG, "Invalid arg is null !!!");
                    return;
                }
                String[] dataArray = arg.split("&");
                if (TextUtils.equals(dataArray[0], XR_WEBVIEW_EVENT_TAG_TEXTUREINFO)) {
                    // id&w&h
                    setTextureInfo(webviewId, Integer.parseInt(dataArray[1]), Integer.parseInt(dataArray[2]), Integer.parseInt(dataArray[3]));
                } else if (TextUtils.equals(dataArray[0], XR_WEBVIEW_EVENT_TAG_TO_ADD)) {
                    int textureWidth = Integer.parseInt(dataArray[1]);
                    int textureHeight = Integer.parseInt(dataArray[2]);
                    String url = dataArray.length > 3 ? dataArray[3] : null;
                    createWebView(webviewId, textureWidth, textureHeight, url);
                } else if (TextUtils.equals(dataArray[0], XR_WEBVIEW_EVENT_TAG_TO_REMOVE)) {
                    removeWebView(webviewId);
                } else if (TextUtils.equals(dataArray[0], XR_WEBVIEW_EVENT_TAG_HOVER)) {
                    CocosXRWebViewContainer xrWebViewContainer = xrWebViewHashMap.get(String.valueOf(webviewId));
                    if (xrWebViewContainer != null) {
                        xrWebViewContainer.simulateTouchMove(Float.parseFloat(dataArray[1]), Float.parseFloat(dataArray[2]));
                    }
                } else if (TextUtils.equals(dataArray[0], XR_WEBVIEW_EVENT_TAG_CLICK_DOWN)) {
                    CocosXRWebViewContainer xrWebViewContainer = xrWebViewHashMap.get(String.valueOf(webviewId));
                    if (xrWebViewContainer != null) {
                        xrWebViewContainer.simulateTouchDown(Float.parseFloat(dataArray[1]), Float.parseFloat(dataArray[2]));
                    }
                } else if (TextUtils.equals(dataArray[0], XR_WEBVIEW_EVENT_TAG_CLICK_UP)) {
                    CocosXRWebViewContainer xrWebViewContainer = xrWebViewHashMap.get(String.valueOf(webviewId));
                    if (xrWebViewContainer != null) {
                        xrWebViewContainer.simulateTouchUp(Float.parseFloat(dataArray[1]), Float.parseFloat(dataArray[2]));
                    }
                } else if (TextUtils.equals(dataArray[0], XR_WEBVIEW_EVENT_TAG_LOADURL)) {
                    loadUrl(webviewId, dataArray[1]);
                } else if (TextUtils.equals(dataArray[0], XR_WEBVIEW_EVENT_TAG_RELOAD)) {
                    reload(webviewId);
                } else if (TextUtils.equals(dataArray[0], XR_WEBVIEW_EVENT_TAG_GOBACK)) {
                    goBack(webviewId);
                } else if (TextUtils.equals(dataArray[0], XR_WEBVIEW_EVENT_TAG_GOFORWARD)) {
                    goForward(webviewId);
                }
            });
        }
    }

    public void onResume() {
        Log.d(TAG, "onResume");
        if (webViewGLThread != null) {
            webViewGLThread.onResume();
        }
    }

    public void onPause() {
        Log.d(TAG, "onPause");
        if (webViewGLThread != null) {
            webViewGLThread.onPause();
        }
    }

    public void onDestroy() {
        Log.d(TAG, "onDestroy");
        if (webViewGLThread != null) {
            webViewGLThread.onDestroy();
            webViewGLThread = null;
        }
        for (int i = 0; i < MAX_COUNT; i++) {
            JsbBridgeWrapper.getInstance().removeAllListenersForEvent(XR_WEBVIEW_EVENT_NAME.concat(String.valueOf(i)));
        }
        Set<Map.Entry<String, CocosXRWebViewContainer>> entrySets = xrWebViewHashMap.entrySet();
        for (Map.Entry<String, CocosXRWebViewContainer> entrySet : entrySets) {
            CocosXRWebViewContainer xrWebViewContainer = entrySet.getValue();
            if (activityWeakReference.get() != null) {
                View decorView = activityWeakReference.get().getWindow().getDecorView();
                if(decorView instanceof FrameLayout) {
                    FrameLayout parentLayout = (FrameLayout) decorView;
                    parentLayout.removeView(xrWebViewContainer);
                }
            }
            xrWebViewContainer.onDestroy();
        }
        xrWebViewHashMap.clear();
    }

    class CocosXRWebViewGLThread extends Thread {
        private final ReentrantLock lockObj = new ReentrantLock(true);
        private final Condition pauseCondition = lockObj.newCondition();
        private boolean running = false;
        private boolean requestPaused = false;
        private boolean requestExited = false;
        long lastTickTime = System.nanoTime();
        private final ArrayList<Runnable> mEventQueue = new ArrayList<>();

        EGLContext eglContext;
        EGLDisplay eglDisplay;
        EGLSurface pBufferSurface;
        EGLContext parentContext;

        CocosXRWebViewGLThread() {
            parentContext = EGL14.eglGetCurrentContext();
        }

        public boolean isRunning() {
            return running;
        }

        @Override
        public void run() {
            init();
            while (true) {
                lockObj.lock();
                try {
                    if (requestExited) {
                        running = false;
                        break;
                    }

                    if (requestPaused) {
                        running = false;
                        pauseCondition.await();
                        running = true;
                    }

                    if (requestExited) {
                        running = false;
                        break;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    lockObj.unlock();
                }

                synchronized (this) {
                    if (!mEventQueue.isEmpty()) {
                        Runnable event = mEventQueue.remove(0);
                        if (event != null) {
                            event.run();
                            continue;
                        }
                    }
                }

                tick();
            }

            exit();
        }

        void init() {
            running = true;
            eglDisplay = EGL14.eglGetDisplay(EGL14.EGL_DEFAULT_DISPLAY);
            int[] attrib_list = {EGL_CONTEXT_CLIENT_VERSION, 3, EGL14.EGL_NONE};
            int[] attrList = new int[]{EGL14.EGL_SURFACE_TYPE, EGL14.EGL_PBUFFER_BIT,
                EGL14.EGL_RENDERABLE_TYPE, 0x00000040,
                EGL14.EGL_RED_SIZE, 8,
                EGL14.EGL_GREEN_SIZE, 8,
                EGL14.EGL_BLUE_SIZE, 8,
                EGL14.EGL_DEPTH_SIZE, 0,
                EGL14.EGL_SAMPLE_BUFFERS, 1,
                EGL14.EGL_SAMPLES, 1,
                EGL14.EGL_STENCIL_SIZE, 0,
                EGL14.EGL_NONE};
            EGLConfig[] configOut = new EGLConfig[1];
            int[] configNumOut = new int[1];
            EGL14.eglChooseConfig(eglDisplay, attrList, 0, configOut, 0, 1,
                configNumOut, 0);
            eglContext = EGL14.eglCreateContext(eglDisplay, configOut[0], parentContext, attrib_list, 0);

            int[] sur_attrib_list = {EGL14.EGL_WIDTH, 1, EGL14.EGL_HEIGHT, 1, EGL14.EGL_NONE};
            pBufferSurface = EGL14.eglCreatePbufferSurface(eglDisplay, configOut[0], sur_attrib_list, 0);

            EGL14.eglMakeCurrent(eglDisplay, pBufferSurface, pBufferSurface, eglContext);
            GLES30.glDisable(GLES30.GL_DEPTH_TEST);
            GLES30.glDisable(GLES30.GL_BLEND);
            GLES30.glDisable(GLES30.GL_CULL_FACE);

            lastTickTime = System.nanoTime();
            Log.d(TAG, "CocosXRWebViewGLThread init");
        }

        void tick() {
            // draw
            lastTickTime = System.nanoTime();

            Set<Map.Entry<String, CocosXRWebViewContainer>> entrySets = xrWebViewHashMap.entrySet();
            for (Map.Entry<String, CocosXRWebViewContainer> entrySet : entrySets) {
                entrySet.getValue().onBeforeGLDrawFrame();
                if(entrySet.getValue().getVideoTextureWidth() == 0 || entrySet.getValue().getVideoTextureHeight() == 0) {
                    continue;
                }
                entrySet.getValue().onGLDrawFrame();
            }

            EGL14.eglSwapBuffers(eglDisplay, pBufferSurface);

            if (System.nanoTime() - lastTickTime < 16666666) {
                // lock 60fps
                try {
                    long sleepTimeNS = 16666666 - (System.nanoTime() - lastTickTime);
                    Thread.sleep(sleepTimeNS / 1000000);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        void exit() {
            running = false;
            Set<Map.Entry<String, CocosXRWebViewContainer>> entrySets = xrWebViewHashMap.entrySet();
            for (Map.Entry<String, CocosXRWebViewContainer> entrySet : entrySets) {
                entrySet.getValue().onGLDestroy();
            }
            EGL14.eglMakeCurrent(eglDisplay, EGL14.EGL_NO_SURFACE, EGL14.EGL_NO_SURFACE, EGL14.EGL_NO_CONTEXT);
            EGL14.eglDestroySurface(eglDisplay, pBufferSurface);
            EGL14.eglDestroyContext(eglDisplay, eglContext);
            Log.d(TAG, "CocosXRWebViewGLThread exit");
        }

        public void onPause() {
            lockObj.lock();
            requestPaused = true;
            lockObj.unlock();
            Log.d(TAG, "CocosXRWebViewGLThread onPause");
        }

        public void onResume() {
            lockObj.lock();
            requestPaused = false;
            pauseCondition.signalAll();
            lockObj.unlock();
            Log.d(TAG, "CocosXRWebViewGLThread onResume");
        }

        public void onDestroy() {
            lockObj.lock();
            requestExited = true;
            pauseCondition.signalAll();
            lockObj.unlock();

            try {
                join();
            } catch (Exception e) {
                e.printStackTrace();
                Log.e(TAG, e.getLocalizedMessage());
            }
            Log.d(TAG, "CocosXRWebViewGLThread onDestroy");
        }

        public void queueEvent(Runnable r) {
            synchronized (this) {
                mEventQueue.add(r);
            }
        }
    }
}
