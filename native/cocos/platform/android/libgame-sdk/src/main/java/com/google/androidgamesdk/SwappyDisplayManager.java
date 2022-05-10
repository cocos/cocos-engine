package com.google.androidgamesdk;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.ComponentName;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.hardware.display.DisplayManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Display;
import android.view.Window;
import android.view.WindowManager;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import static android.app.NativeActivity.META_DATA_LIB_NAME;

public class SwappyDisplayManager implements DisplayManager.DisplayListener {
    final private String LOG_TAG = "SwappyDisplayManager";
    final private boolean DEBUG = false;
    final private long ONE_MS_IN_NS = 1000000;
    final private long ONE_S_IN_NS = ONE_MS_IN_NS * 1000;

    private long mCookie;
    private Activity mActivity;
    private WindowManager mWindowManager;
    private Display.Mode mCurrentMode;

    private LooperThread mLooper;

    private class LooperThread extends Thread {
        public Handler mHandler;
        private Lock mLock = new ReentrantLock();
        private Condition mCondition = mLock.newCondition();

        @Override
        public void start() {
            mLock.lock();
            super.start();
            try {
                mCondition.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            mLock.unlock();

        }

        public void run() {
            Log.i(LOG_TAG, "Starting looper thread");

            mLock.lock();
            Looper.prepare();
            mHandler = new Handler();
            mCondition.signal();
            mLock.unlock();

            Looper.loop();

            Log.i(LOG_TAG, "Terminating looper thread");
        }
    }

    @TargetApi(Build.VERSION_CODES.M)
    private boolean modeMatchesCurrentResolution(Display.Mode mode) {
        return mode.getPhysicalHeight() == mCurrentMode.getPhysicalHeight() &&
                mode.getPhysicalWidth() == mCurrentMode.getPhysicalWidth();

    }

    public SwappyDisplayManager(long cookie, Activity activity) {
        // Load the native library for cases where an NDK application is running
        // without a java componenet
        try {
            ActivityInfo ai = activity.getPackageManager().getActivityInfo(
                    activity.getIntent().getComponent(), PackageManager.GET_META_DATA);
            if (ai.metaData != null) {
                String nativeLibName = ai.metaData.getString(META_DATA_LIB_NAME);
                if (nativeLibName != null) {
                    System.loadLibrary(nativeLibName);
                }
            }
        } catch (java.lang.Throwable e) {
            Log.e(LOG_TAG, e.getMessage());
        }

        mCookie = cookie;
        mActivity = activity;

        mWindowManager = mActivity.getSystemService(WindowManager.class);
        Display display = mWindowManager.getDefaultDisplay();
        mCurrentMode = display.getMode();
        updateSupportedRefreshRates(display);

        // Register display listener callbacks
        DisplayManager dm = mActivity.getSystemService(DisplayManager.class);

        synchronized(this) {
            mLooper = new LooperThread();
            mLooper.start();
            dm.registerDisplayListener(this, mLooper.mHandler);
        }
    }

    private void updateSupportedRefreshRates(Display display) {
        Display.Mode[] supportedModes = display.getSupportedModes();
        int totalModes = 0;
        for (int i = 0; i < supportedModes.length; i++) {
            if (!modeMatchesCurrentResolution(supportedModes[i])) {
                continue;
            }
            totalModes++;
        }

        long[] supportedRefreshPeriods = new long[totalModes];
        int[] supportedDisplayModeIds = new int[totalModes];
        totalModes = 0;
        for (int i = 0; i < supportedModes.length; i++) {
            if (!modeMatchesCurrentResolution(supportedModes[i])) {
                continue;
            }
            supportedRefreshPeriods[totalModes] =
                    (long) (ONE_S_IN_NS / supportedModes[i].getRefreshRate());
            supportedDisplayModeIds[totalModes] = supportedModes[i].getModeId();
            totalModes++;

        }
        // Call down to native to set the supported refresh rates
        nSetSupportedRefreshPeriods(mCookie, supportedRefreshPeriods, supportedDisplayModeIds);
    }

    public void setPreferredDisplayModeId(final int modeId) {
        mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Window w = mActivity.getWindow();
                WindowManager.LayoutParams l = w.getAttributes();
                if (DEBUG) {
                    Log.v(LOG_TAG, "set preferredDisplayModeId to " + modeId);
                }
                l.preferredDisplayModeId = modeId;


                w.setAttributes(l);
            }
        });
    }

    public void terminate() {
        mLooper.mHandler.getLooper().quit();
    }

    @Override
    public void onDisplayAdded(int displayId) {

    }

    @Override
    public void onDisplayRemoved(int displayId) {

    }

    @Override
    public void onDisplayChanged(int displayId) {
        synchronized(this) {
            Display display = mWindowManager.getDefaultDisplay();
            float newRefreshRate = display.getRefreshRate();
            Display.Mode newMode = display.getMode();
            boolean resolutionChanged =
                    (newMode.getPhysicalWidth() != mCurrentMode.getPhysicalWidth()) |
                    (newMode.getPhysicalHeight() != mCurrentMode.getPhysicalHeight());
            boolean refreshRateChanged = (newRefreshRate != mCurrentMode.getRefreshRate());
            mCurrentMode = newMode;

            if (resolutionChanged) {
                updateSupportedRefreshRates(display);
            }

            if (refreshRateChanged) {
                final long appVsyncOffsetNanos = display.getAppVsyncOffsetNanos();
                final long vsyncPresentationDeadlineNanos =
                        mWindowManager.getDefaultDisplay().getPresentationDeadlineNanos();

                final long vsyncPeriodNanos = (long)(ONE_S_IN_NS / newRefreshRate);
                final long sfVsyncOffsetNanos =
                        vsyncPeriodNanos - (vsyncPresentationDeadlineNanos - ONE_MS_IN_NS);

                nOnRefreshPeriodChanged(mCookie,
                                     vsyncPeriodNanos,
                                     appVsyncOffsetNanos,
                                     sfVsyncOffsetNanos);
            }
        }
    }

    private native void nSetSupportedRefreshPeriods(long cookie,
                                                  long[] refreshPeriods,
                                                  int[] modeIds);
    private native void nOnRefreshPeriodChanged(long cookie,
                                              long refreshPeriod,
                                              long appOffset,
                                              long sfOffset);
}
