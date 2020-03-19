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
package org.cocos2dx.lib;

import android.app.NativeActivity;
import android.media.AudioManager;
import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;
import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;

public abstract class Cocos2dxActivity extends NativeActivity {
    // ===========================================================
    // Constants
    // ===========================================================

    private final static String TAG = Cocos2dxActivity.class.getSimpleName();

    // ===========================================================
    // Fields
    // ===========================================================
    private Cocos2dxVideoHelper mVideoHelper = null;
    private Cocos2dxWebViewHelper mWebViewHelper = null;
    private boolean hasFocus = false;
    private boolean paused = true;

    // ===========================================================
    // Inner class
    // ===========================================================


    // ===========================================================
    // Member methods
    // ===========================================================

    // ===========================================================
    // Override functions
    // ===========================================================

    @Override
    protected void onCreate(final Bundle savedInstanceState) {
        Log.d(TAG, "Cocos2dxActivity onCreate: " + this + ", savedInstanceState: " + savedInstanceState);
        super.onCreate(savedInstanceState);

        GlobalObject.setActivity(this);

        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            finish();
            Log.w(TAG, "[Workaround] Ignore the activity started from icon!");
            return;
        }

        Utils.hideVirtualButton();

        Cocos2dxHelper.registerBatteryLevelReceiver(this);
        // Load native library to enable invoke native API.
        onLoadNativeLibraries();

        Cocos2dxHelper.init(this);
        CanvasRenderingContext2DImpl.init(this);


        //TODO
//        if (mVideoHelper == null) {
//            mVideoHelper = new Cocos2dxVideoHelper(this, mFrameLayout);
//        }
//
//        if(mWebViewHelper == null){
//            mWebViewHelper = new Cocos2dxWebViewHelper(mFrameLayout);
//        }

        this.setVolumeControlStream(AudioManager.STREAM_MUSIC);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
    }

    @Override
    protected void onResume() {
    	Log.d(TAG, "onResume()");
        paused = false;
        super.onResume();
        Utils.hideVirtualButton();
       	resumeIfHasFocus();
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

        Cocos2dxHelper.unregisterBatteryLevelReceiver(this);;
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
