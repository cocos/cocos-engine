/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

import android.app.Activity;
import android.content.Context;
import android.media.AudioManager;
import android.os.Handler;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;


class CocosEngine {
    private static WeakReference<CocosEngine> mRefCocosEngine;

    private CocosAudio mAudio;
    private Context mContext;

    private CocosSensorHandler mSensorHandler;

    private CocosWebViewHelper mWebViewHelper = null;
    private CocosVideoHelper mVideoHelper = null;
    private FrameLayout mRootLayout;
    private Handler mHandler;

    private List<CocosSurfaceView> mSurfaceViewArray;
    private SurfaceView mSurfaceView;

    private native void initEnvNative(Context context);

    CocosEngine(Context context, String libName) {
        mRefCocosEngine = new WeakReference<>(this);
        mContext = context;
        mAudio = new CocosAudio(context);
        mAudio.setFocus(true);
        mHandler = new Handler(context.getMainLooper());
        System.loadLibrary(libName);
        initEnvNative(context);

        Activity activity = null;
        if (mContext instanceof Activity) {
            activity = (Activity) mContext;
        }

        // GlobalObject.init should be initialized at first.
        GlobalObject.init(mContext, activity);
        CocosHelper.registerBatteryLevelReceiver(mContext);
        CocosHelper.init();
        CanvasRenderingContext2DImpl.init(mContext);
        if (activity != null) {
            activity.setVolumeControlStream(AudioManager.STREAM_MUSIC);
        }
        mSensorHandler = new CocosSensorHandler(mContext);
    }

    void destroy() {
        mRefCocosEngine.clear();
        CocosHelper.unregisterBatteryLevelReceiver(mContext);
        mAudio.destroy();
        mAudio = null;
        mHandler.removeCallbacks(null);
        mHandler = null;
        CanvasRenderingContext2DImpl.destroy();
        GlobalObject.destroy();
        mContext = null;
    }

    void start() {
        mSurfaceView.setVisibility(View.VISIBLE);
        if (null != mSurfaceViewArray) {
            for (CocosSurfaceView surfaceView : mSurfaceViewArray) {
                surfaceView.setVisibility(View.VISIBLE);
            }
        }
    }

    void stop() {
        mSurfaceView.setVisibility(View.INVISIBLE);
        if (null != mSurfaceViewArray) {
            for (CocosSurfaceView surfaceView : mSurfaceViewArray) {
                surfaceView.setVisibility(View.INVISIBLE);
            }
        }
    }

    void pause() {
        mSensorHandler.onPause();
    }

    void resume() {
        mSensorHandler.onResume();
        mAudio.setFocus(true);
    }

    SurfaceView getRenderView() {
        return mSurfaceView;
    }

    CocosAudio getAudio() {
        return mAudio;
    }

    void initView(FrameLayout parentView) {
        if (parentView != null) {
            mRootLayout = parentView;
            CocosActivity cocosActivity = null;
            if (mContext instanceof CocosActivity) {
                cocosActivity = (CocosActivity) mContext;
                mSurfaceView = cocosActivity.getSurfaceView();
            } else {
                // todo: create surfaceView
            }

            if (mWebViewHelper == null) {
                mWebViewHelper = new CocosWebViewHelper(mRootLayout);
            }

            if (mVideoHelper == null) {
                mVideoHelper = new CocosVideoHelper(cocosActivity, mRootLayout);
            }
        }
    }

    // invoke from native code
    @SuppressWarnings({"UnusedDeclaration"})
    private static void createSurface(int x, int y, int width, int height, int windowId) {
        CocosEngine cocosEngine = mRefCocosEngine.get();
        if (cocosEngine == null) return;
        cocosEngine.mHandler.post(() -> {
            CocosSurfaceView view = new CocosSurfaceView(cocosEngine.mContext, windowId);
            view.setLayoutParams(new FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(width, height);
            params.leftMargin = x;
            params.topMargin = y;
            //mSubsurfaceView.setBackgroundColor(Color.BLUE);
            cocosEngine.mRootLayout.addView(view, params);
            if (null == cocosEngine.mSurfaceViewArray) {
                cocosEngine.mSurfaceViewArray = new ArrayList<>();
            }
            cocosEngine.mSurfaceViewArray.add(view);
        });
    }
}
