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

    private static WeakReference<GamePlayer> mRefGamePlayer;

    private Activity mActivity;

    private native void initEnvNative(Activity activity);

    void init(Activity activity, String libName) {
        mActivity = activity;
        System.loadLibrary(libName);
        initEnvNative(activity);
    }

    IGamePlayer createGamePlayer(FrameLayout engineParentView) {
        GamePlayer player = new GamePlayer(mActivity, engineParentView);
        mRefGamePlayer = new WeakReference<>(player);
        return player;
    }

    void destroy() {
        GamePlayer player = mRefGamePlayer.get();
        if (null != player) {
            player.destroy();
            mRefGamePlayer.clear();
        }
        mActivity = null;
    }

    // invoke from native code
    @SuppressWarnings({"UnusedDeclaration"})
    private static void createSurface(int x, int y, int width, int height, int windowId) {
        GamePlayer player = mRefGamePlayer.get();
        if (null != player) {
            player.createSurface(x, y, width, height, windowId);
        }
    }

    static class GamePlayer implements IGamePlayer {

        private CocosSensorHandler mSensorHandler;

        private CocosWebViewHelper mWebViewHelper = null;
        private CocosVideoHelper mVideoHelper = null;
        private FrameLayout mRootLayout;

        private WeakReference<Activity> mRefActivity;

        private List<CocosSurfaceView> mSurfaceViewArray;
        private SurfaceView mSurfaceView;

        GamePlayer(Activity activity, FrameLayout parentView) {
            mRefActivity = new WeakReference<>(activity);
            mRootLayout = parentView;

            // GlobalObject.init should be initialized at first.
            GlobalObject.init(activity, activity);

            CocosHelper.registerBatteryLevelReceiver(activity);
            CocosHelper.init();
            CocosAudioFocusManager.registerAudioFocusListener(activity);
            CanvasRenderingContext2DImpl.init(activity);
            activity.setVolumeControlStream(AudioManager.STREAM_MUSIC);

            initView();
            mSensorHandler = new CocosSensorHandler(activity);
        }

        @Override
        public void start() {
            mSurfaceView.setVisibility(View.VISIBLE);
            if (null != mSurfaceViewArray) {
                for (CocosSurfaceView surfaceView : mSurfaceViewArray) {
                    surfaceView.setVisibility(View.VISIBLE);
                }
            }
        }

        @Override
        public void stop() {
            mSurfaceView.setVisibility(View.INVISIBLE);
            if (null != mSurfaceViewArray) {
                for (CocosSurfaceView surfaceView : mSurfaceViewArray) {
                    surfaceView.setVisibility(View.INVISIBLE);
                }
            }
        }

        @Override
        public void pause() {
            mSensorHandler.onPause();
        }

        @Override
        public void resume() {
            mSensorHandler.onResume();
            Utils.hideVirtualButton();
            if (CocosAudioFocusManager.isAudioFocusLoss()) {
                CocosAudioFocusManager.registerAudioFocusListener(mRefActivity.get());
            }
        }

        @Override
        public SurfaceView getRenderView() {
            return null;
        }

        @Override
        public void setFocus(boolean hasFocus) {
            if (hasFocus && CocosAudioFocusManager.isAudioFocusLoss()) {
                CocosAudioFocusManager.registerAudioFocusListener(mRefActivity.get());
            }
        }

        private void destroy() {
            CocosHelper.unregisterBatteryLevelReceiver(mRefActivity.get());
            CocosAudioFocusManager.unregisterAudioFocusListener(mRefActivity.get());
            CanvasRenderingContext2DImpl.destroy();
            GlobalObject.destroy();
        }

        private void initView() {
            Activity activity = mRefActivity.get();
            if (activity instanceof CocosActivity) {
                CocosActivity cocosActivity = (CocosActivity) activity;
                mSurfaceView = cocosActivity.getSurfaceView();
            } else {
                // todo: create surfaceView
            }

            if (mWebViewHelper == null) {
                mWebViewHelper = new CocosWebViewHelper(mRootLayout);
            }

            if (mVideoHelper == null) {
                mVideoHelper = new CocosVideoHelper(activity, mRootLayout);
            }
        }

        // invoke from native code
        @SuppressWarnings({"UnusedDeclaration"})
        private void createSurface(int x, int y, int width, int height, int windowId) {
            Activity activity = mRefActivity.get();
            if (activity == null) return;
            activity.runOnUiThread(() -> {
                CocosSurfaceView view = new CocosSurfaceView(mRefActivity.get(), windowId);
                view.setLayoutParams(new FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
                FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(width, height);
                params.leftMargin = x;
                params.topMargin = y;
                //mSubsurfaceView.setBackgroundColor(Color.BLUE);
                mRootLayout.addView(view, params);
                if (null == mSurfaceViewArray) {
                    mSurfaceViewArray = new ArrayList<>();
                }
                mSurfaceViewArray.add(view);
            });
        }
    }
}







