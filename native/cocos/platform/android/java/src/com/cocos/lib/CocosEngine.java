package com.cocos.lib;

import android.app.Activity;
import android.media.AudioManager;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;


public class CocosEngine {
    private static WeakReference<CocosEngine> mRefCocosEngine;
    private Activity mActivity;

    private CocosSensorHandler mSensorHandler;

    private CocosWebViewHelper mWebViewHelper = null;
    private CocosVideoHelper mVideoHelper = null;
    private FrameLayout mRootLayout;

    private List<CocosSurfaceView> mSurfaceViewArray;
    private SurfaceView mSurfaceView;

    private native void initEnvNative(Activity activity);

    public CocosEngine(Activity activity, String libName) {
        mRefCocosEngine = new WeakReference<>(this);
        mActivity = activity;
        System.loadLibrary(libName);
        initEnvNative(activity);
    }

    public void destroy() {
        mRefCocosEngine.clear();
        CocosHelper.unregisterBatteryLevelReceiver(mActivity);
        CocosAudioFocusManager.unregisterAudioFocusListener(mActivity);
        CanvasRenderingContext2DImpl.destroy();
        GlobalObject.destroy();
        mActivity = null;
    }

    public void init(FrameLayout parentView) {
        mRootLayout = parentView;

        // GlobalObject.init should be initialized at first.
        GlobalObject.init(mActivity, mActivity);

        CocosHelper.registerBatteryLevelReceiver(mActivity);
        CocosHelper.init();
        CocosAudioFocusManager.registerAudioFocusListener(mActivity);
        CanvasRenderingContext2DImpl.init(mActivity);
        mActivity.setVolumeControlStream(AudioManager.STREAM_MUSIC);

        initView();
        mSensorHandler = new CocosSensorHandler(mActivity);
    }

    public void start() {
        mSurfaceView.setVisibility(View.VISIBLE);
        if (null != mSurfaceViewArray) {
            for (CocosSurfaceView surfaceView : mSurfaceViewArray) {
                surfaceView.setVisibility(View.VISIBLE);
            }
        }
    }

    public void stop() {
        mSurfaceView.setVisibility(View.INVISIBLE);
        if (null != mSurfaceViewArray) {
            for (CocosSurfaceView surfaceView : mSurfaceViewArray) {
                surfaceView.setVisibility(View.INVISIBLE);
            }
        }
    }

    public void pause() {
        mSensorHandler.onPause();
    }

    public void resume() {
        mSensorHandler.onResume();
        Utils.hideVirtualButton();
        if (CocosAudioFocusManager.isAudioFocusLoss()) {
            CocosAudioFocusManager.registerAudioFocusListener(mActivity);
        }
    }

    public SurfaceView getRenderView() {
        return mSurfaceView;
    }

    public void setAudioFocus(boolean hasFocus) {
        if (hasFocus && CocosAudioFocusManager.isAudioFocusLoss()) {
            CocosAudioFocusManager.registerAudioFocusListener(mActivity);
        }
    }

    private void initView() {
        if (mActivity instanceof CocosActivity) {
            CocosActivity cocosActivity = (CocosActivity) mActivity;
            mSurfaceView = cocosActivity.getSurfaceView();
        } else {
            // todo: create surfaceView
        }

        if (mWebViewHelper == null) {
            mWebViewHelper = new CocosWebViewHelper(mRootLayout);
        }

        if (mVideoHelper == null) {
            mVideoHelper = new CocosVideoHelper(mActivity, mRootLayout);
        }
    }

    // invoke from native code
    @SuppressWarnings({"UnusedDeclaration"})
    private static void createSurface(int x, int y, int width, int height, int windowId) {
        CocosEngine cocosEngine = mRefCocosEngine.get();
        if (cocosEngine == null) return;
        Activity activity = cocosEngine.mActivity;
        activity.runOnUiThread(() -> {
            CocosSurfaceView view = new CocosSurfaceView(activity, windowId);
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







