/****************************************************************************
 * Copyright (c) 2018-2022 Xiamen Yaji Software Co., Ltd.
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

package com.cocos.lib;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.SurfaceView;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;

import com.google.androidgamesdk.GameActivity;

import java.lang.reflect.Field;

public class CocosActivity extends GameActivity {
    private static final String _TAG = "CocosActivity";
    private CocosWebViewHelper mWebViewHelper = null;
    private CocosVideoHelper mVideoHelper = null;
    private CocosOrientationHelper mOrientationHelper = null;

    private CocosSensorHandler mSensorHandler;


    private native void onCreateNative(Activity activity);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        onLoadNativeLibraries();
        onCreateNative(this);
        super.onCreate(savedInstanceState);
        GlobalObject.setActivity(this);
        CocosHelper.registerBatteryLevelReceiver(this);
        CocosHelper.init(this);
        CocosAudioFocusManager.registerAudioFocusListener(this);
        CanvasRenderingContext2DImpl.init(this);
        this.setVolumeControlStream(AudioManager.STREAM_MUSIC);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
        initView();


        mSensorHandler = new CocosSensorHandler(this);

        setImmersiveMode();

        Utils.hideVirtualButton();

        mOrientationHelper = new CocosOrientationHelper(this);
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

        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    protected void initView() {
        FrameLayout frameLayout = findViewById(contentViewId);
        if (mWebViewHelper == null) {
            mWebViewHelper = new CocosWebViewHelper(frameLayout);
        }

        if (mVideoHelper == null) {
            mVideoHelper = new CocosVideoHelper(this, frameLayout);
        }
    }

    public SurfaceView getSurfaceView() {
        return this.mSurfaceView;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        CocosHelper.unregisterBatteryLevelReceiver(this);
        CocosAudioFocusManager.unregisterAudioFocusListener(this);
        CanvasRenderingContext2DImpl.destroy();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mSensorHandler.onPause();
        mOrientationHelper.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        mSensorHandler.onResume();
        mOrientationHelper.onResume();
        Utils.hideVirtualButton();
        if (CocosAudioFocusManager.isAudioFocusLoss()) {
            CocosAudioFocusManager.registerAudioFocusListener(this);
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        mSurfaceView.setVisibility(View.INVISIBLE);
    }

    @Override
    protected void onStart() {
        super.onStart();
        mSurfaceView.setVisibility(View.VISIBLE);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus && CocosAudioFocusManager.isAudioFocusLoss()) {
            CocosAudioFocusManager.registerAudioFocusListener(this);
        }
    }

    private void onLoadNativeLibraries() {
        try {
            ActivityInfo ai = this.getPackageManager().getActivityInfo(this.getIntent().getComponent(), PackageManager.GET_META_DATA);
            Bundle bundle = ai.metaData;
            String libName = bundle.getString("android.app.lib_name");
            if (TextUtils.isEmpty(libName)) {
                Log.e(_TAG, "can not find library, please config android.app.lib_name at AndroidManifest.xml");
            }
            assert libName != null;
            System.loadLibrary(libName);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
