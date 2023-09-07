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
    private final Handler mHandler;

    private List<CocosSurfaceView> mSurfaceViewArray;
    private SurfaceView mSurfaceView;

    private native void initEnvNative(Context context);

    CocosEngine(Context context, String libName) {
        mRefCocosEngine = new WeakReference<>(this);
        mContext = context;
        mAudio = new CocosAudio(context);
        mHandler = new Handler(context.getMainLooper());
        System.loadLibrary(libName);
        initEnvNative(context);
    }

    void destroy() {
        mRefCocosEngine.clear();
        CocosHelper.unregisterBatteryLevelReceiver(mContext);
        mAudio.unregisterAudioFocusListener(mContext);
        CanvasRenderingContext2DImpl.destroy();
        GlobalObject.destroy();
        mAudio = null;
        mContext = null;
    }

    void init() {
        initWithView(null);
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
        Utils.hideVirtualButton();
        if (mAudio.isAudioFocusLoss()) {
            mAudio.registerAudioFocusListener(mContext);
        }
    }

    SurfaceView getRenderView() {
        return mSurfaceView;
    }

    CocosAudio getAudio() {
        return mAudio;
    }

    void initWithView(FrameLayout parentView) {
        Activity activity = null;
        if (mContext instanceof Activity) {
            activity = (Activity) mContext;
        }

        // GlobalObject.init should be initialized at first.
        GlobalObject.init(mContext, activity);

        CocosHelper.registerBatteryLevelReceiver(mContext);
        CocosHelper.init();
        mAudio.registerAudioFocusListener(mContext);
        CanvasRenderingContext2DImpl.init(mContext);
        if (activity != null) {
            activity.setVolumeControlStream(AudioManager.STREAM_MUSIC);
        }

        mSensorHandler = new CocosSensorHandler(mContext);

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







