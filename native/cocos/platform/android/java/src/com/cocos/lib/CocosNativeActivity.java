/****************************************************************************
Copyright (c) 2010-2013 cocos2d-x.org
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

import android.app.NativeActivity;
import android.media.AudioManager;
import android.os.Bundle;
import android.util.Log;
import android.widget.FrameLayout;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;

public abstract class CocosNativeActivity extends NativeActivity {
    // ===========================================================
    // Constants
    // ===========================================================

    private final static String TAG = CocosNativeActivity.class.getSimpleName();

    // ===========================================================
    // Fields
    // ===========================================================
    private boolean hasFocus = false;
    private boolean paused = true;

    protected FrameLayout mFrameLayout = null;

    private CocosVideoHelper mVideoHelper   = null;
    private CocosWebViewHelper mWebViewHelper = null;

    // ===========================================================
    // Override functions
    // ===========================================================

    @Override
    protected void onCreate(final Bundle savedInstanceState) {
        Log.d(TAG, "CocosNativeActivity onCreate: " + this + ", savedInstanceState: " + savedInstanceState);
        super.onCreate(savedInstanceState);

        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            finish();
            Log.w(TAG, "[Workaround] Ignore the activity started from icon!");
            return;
        }

        GlobalObject.setActivity(this);
        Utils.hideVirtualButton();

        CocosHelper.registerBatteryLevelReceiver(this);
        // Load native library to enable invoke native API.
        onLoadNativeLibraries();

        CocosHelper.init(this);
        CanvasRenderingContext2DImpl.init(this);


        if (mFrameLayout == null) {
            ViewGroup.LayoutParams frameLayoutParams = new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT);
            mFrameLayout = new FrameLayout(this);
            mFrameLayout.setLayoutParams(frameLayoutParams);

            //
            setContentView(mFrameLayout);
        }

        if (mVideoHelper == null) {
            mVideoHelper = new CocosVideoHelper(this, mFrameLayout);
        }
        
        if (mWebViewHelper == null) {
            mWebViewHelper = new CocosWebViewHelper(mFrameLayout);
        }

        this.setVolumeControlStream(AudioManager.STREAM_MUSIC);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
    }

    @Override
    protected void onResume() {
    	Log.d(TAG, "onResume()");
        paused = false;
        super.onResume();
        Utils.hideVirtualButton();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
    	Log.d(TAG, "onWindowFocusChanged() hasFocus=" + hasFocus);
        super.onWindowFocusChanged(hasFocus);

        this.hasFocus = hasFocus;
        resumeIfHasFocus();
    }

    @Override
    protected void onPause() {
        Log.d(TAG, "onPause()");
        paused = true;
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

         // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }
        CocosHelper.unregisterBatteryLevelReceiver(this);;
        CanvasRenderingContext2DImpl.destroy();
    }

    // ===========================================================
    // Protected and private methods
    // ===========================================================
    protected void onLoadNativeLibraries() {
        try {
            ApplicationInfo ai = getPackageManager().getApplicationInfo(getPackageName(), PackageManager.GET_META_DATA);
            Bundle bundle = ai.metaData;
            String libName = bundle.getString("android.app.lib_name");
            System.loadLibrary(libName);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void resumeIfHasFocus() {
        if(hasFocus && !paused) {
            Utils.hideVirtualButton();
        }
    }
}
