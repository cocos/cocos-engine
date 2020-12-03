package com.cocos.lib;

import android.app.Activity;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.FrameLayout;

import java.io.File;
import java.lang.reflect.Field;

public class CocosActivity extends Activity implements SurfaceHolder.Callback {
    private boolean mDestroyed;
    private SurfaceHolder mSurfaceHolder;
    private FrameLayout mFrameLayout;
    private SurfaceView mSurfaceView;
    private CocosWebViewHelper mWebViewHelper = null;
    private CocosVideoHelper mVideoHelper = null;


    private boolean engineInit = false;

    private CocosTouchHandler mTouchHandler;
    private CocosKeyCodeHandler mKeyCodeHandler;
    private CocosSensorHandler mSensorHandler;


    private native void onCreateNative(Activity activity, AssetManager assetManager, String obbPath, int sdkVersion);

    private native void onSurfaceCreatedNative(Surface surface);

    private native void onSurfaceChangedNative(int width, int height);

    private native void onSurfaceDestroyNative();

    private native void onPauseNative();

    private native void onResumeNative();

    private native void onStopNative();

    private native void onStartNative();

    private native void onLowMemoryNative();

    private native void onWindowFocusChangedNative(boolean hasFocus);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        GlobalObject.setActivity(this);
        CocosHelper.registerBatteryLevelReceiver(this);
        CocosHelper.init(this);
        CanvasRenderingContext2DImpl.init(this);
        onLoadNativeLibraries();
        this.setVolumeControlStream(AudioManager.STREAM_MUSIC);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
        initView();
        onCreateNative(this, getAssets(), getAbsolutePath(getObbDir()), Build.VERSION.SDK_INT);

        mTouchHandler = new CocosTouchHandler(this);
        mKeyCodeHandler = new CocosKeyCodeHandler(this);
        mSensorHandler = new CocosSensorHandler(this);

        setImmersiveMode();

        Utils.hideVirtualButton();
    }

    private void setImmersiveMode() {
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        try {
            Field field = lp.getClass().getField("layoutInDisplayCutoutMode");
            //Field constValue = lp.getClass().getDeclaredField("LAYOUT_IN_DISPLAY_CUTOUT_MODE_NEVER");
            Field constValue = lp.getClass().getDeclaredField("LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES");
            field.setInt(lp, constValue.getInt(null));

            // https://developer.android.com/training/system-ui/immersive
            int flag = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;

            flag |= View.class.getDeclaredField("SYSTEM_UI_FLAG_IMMERSIVE_STICKY").getInt(null);
            View view = getWindow().getDecorView();
            view.setSystemUiVisibility(flag);

        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    private static String getAbsolutePath(File file) {
        return (file != null) ? file.getAbsolutePath() : null;
    }

    protected void initView() {
        ViewGroup.LayoutParams frameLayoutParams = new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT);
        mFrameLayout = new FrameLayout(this);
        mFrameLayout.setLayoutParams(frameLayoutParams);
        setContentView(mFrameLayout);

        mSurfaceView = new SurfaceView(this);
        mSurfaceView.getHolder().addCallback(this);
        mFrameLayout.addView(mSurfaceView);

        if (mWebViewHelper == null) {
            mWebViewHelper = new CocosWebViewHelper(mFrameLayout);
        }

        if (mVideoHelper == null) {
            mVideoHelper = new CocosVideoHelper(this, mFrameLayout);
        }
    }


    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (!engineInit) return false;
        //handle touch event
        return mTouchHandler.onTouchEvent(event);
    }

    @Override
    protected void onDestroy() {
        mDestroyed = true;
        if (mSurfaceHolder != null) {
            onSurfaceDestroyNative();
            mSurfaceHolder = null;
        }
        super.onDestroy();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mSensorHandler.onPause();
        onPauseNative();
    }

    @Override
    protected void onResume() {
        super.onResume();
        mSensorHandler.onResume();
        onResumeNative();
    }

    @Override
    protected void onStop() {
        super.onStop();
        onStopNative();
    }

    @Override
    protected void onStart() {
        super.onStart();
        onStartNative();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        if (!mDestroyed) {
            onLowMemoryNative();
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (!mDestroyed) {
            onWindowFocusChangedNative(hasFocus);
        }
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        if (!mDestroyed) {
            mSurfaceHolder = holder;
            onSurfaceCreatedNative(holder.getSurface());

            engineInit = true;
        }
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        if (!mDestroyed) {
            mSurfaceHolder = holder;
            onSurfaceChangedNative(width, height);
        }
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        mSurfaceHolder = null;
        if (!mDestroyed) {
            onSurfaceDestroyNative();
            engineInit = false;
        }
    }

    private void onLoadNativeLibraries() {
        try {
            ApplicationInfo ai = getPackageManager().getApplicationInfo(getPackageName(), PackageManager.GET_META_DATA);
            Bundle bundle = ai.metaData;
            String libName = bundle.getString("android.app.lib_name");
            System.loadLibrary(libName);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        return mKeyCodeHandler.onKeyDown(keyCode, event) || super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        return mKeyCodeHandler.onKeyUp(keyCode, event) || super.onKeyUp(keyCode, event);
    }
}
