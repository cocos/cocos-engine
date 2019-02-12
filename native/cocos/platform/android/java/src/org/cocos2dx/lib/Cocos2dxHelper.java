/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
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

import android.content.ClipData;
import android.content.ClipboardManager;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.media.AudioManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.os.Vibrator;
import android.preference.PreferenceManager.OnActivityResultListener;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.view.Surface;
import android.view.WindowManager;

import com.android.vending.expansion.zipfile.APKExpansionSupport;
import com.android.vending.expansion.zipfile.ZipResourceFile;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;


public class Cocos2dxHelper {
    // ===========================================================
    // Constants
    // ===========================================================
    private static final String PREFS_NAME = "Cocos2dxPrefsFile";
    private static final int RUNNABLES_PER_FRAME = 5;
    private static final String TAG = Cocos2dxHelper.class.getSimpleName();

    // ===========================================================
    // Fields
    // ===========================================================

    private static AssetManager sAssetManager;
    private static Cocos2dxAccelerometer sCocos2dxAccelerometer;
    private static boolean sAccelerometerEnabled;
    private static boolean sCompassEnabled;
    private static boolean sActivityVisible;
    private static String sPackageName;
    private static String sFileDirectory;
    private static Activity sActivity = null;
    private static Cocos2dxHelperListener sCocos2dxHelperListener;
    private static Set<OnActivityResultListener> onActivityResultListeners = new LinkedHashSet<OnActivityResultListener>();
    private static Vibrator sVibrateService = null;

    // The absolute path to the OBB if it exists, else the absolute path to the APK.
    private static String sAssetsPath = "";
    
    // The OBB file
    private static ZipResourceFile sOBBFile = null;

    /**
     * Battery receiver to getting battery level.
     */
    static class BatteryReceiver extends BroadcastReceiver {
        public float sBatteryLevel = 0.0f;

        @Override
        public void onReceive(Context context, Intent intent) {
            setBatteryLevelByIntent(intent);
        }

        public void setBatteryLevelByIntent(Intent intent) {
            if (null != intent) {
                int current = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, 0);
                int total = intent.getIntExtra(BatteryManager.EXTRA_SCALE, 1);
                float level = current * 1.0f / total;
                // clamp to 0~1
                sBatteryLevel = Math.min(Math.max(level, 0.0f), 1.0f);
            }
        }
    }

    private static BatteryReceiver sBatteryReceiver = new BatteryReceiver();

    static void registerBatteryLevelReceiver(Context context) {
        Intent intent = context.registerReceiver(sBatteryReceiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        sBatteryReceiver.setBatteryLevelByIntent(intent);
    }

    static void unregisterBatteryLevelReceiver(Context context) {
        context.unregisterReceiver(sBatteryReceiver);
    }

    public static float getBatteryLevel() {
        return sBatteryReceiver.sBatteryLevel;
    }

    public static final int NETWORK_TYPE_NONE = 0;
    public static final int NETWORK_TYPE_LAN  = 1;
    public static final int NETWORK_TYPE_WWAN = 2;

    public static int getNetworkType() {
        int status = NETWORK_TYPE_NONE;
        NetworkInfo networkInfo;
        try {
            ConnectivityManager connMgr = (ConnectivityManager) sActivity.getSystemService(Context.CONNECTIVITY_SERVICE);
            networkInfo = connMgr.getActiveNetworkInfo();
        } catch (Exception e) {
            e.printStackTrace();
            return status;
        }
        if (networkInfo == null) {
            return status;
        }
        int nType = networkInfo.getType();
        if (nType == ConnectivityManager.TYPE_MOBILE) {
            status = NETWORK_TYPE_WWAN;
        } else if (nType == ConnectivityManager.TYPE_WIFI) {
            status = NETWORK_TYPE_LAN;
        }
        return status;
    }

    // ===========================================================
    // Constructors
    // ===========================================================

    public static void runOnGLThread(final Runnable r) {
        ((Cocos2dxActivity)sActivity).runOnGLThread(r);
    }

    private static boolean sInited = false;
    public static void init(final Activity activity) {
        sActivity = activity;
        Cocos2dxHelper.sCocos2dxHelperListener = (Cocos2dxHelperListener)activity;
        if (!sInited) {

            PackageManager pm = activity.getPackageManager();
            boolean isSupportLowLatency = pm.hasSystemFeature(PackageManager.FEATURE_AUDIO_LOW_LATENCY);

            Log.d(TAG, "isSupportLowLatency:" + isSupportLowLatency);

            int sampleRate = 44100;
            int bufferSizeInFrames = 192;

            if (Build.VERSION.SDK_INT >= 17) {
                AudioManager am = (AudioManager) activity.getSystemService(Context.AUDIO_SERVICE);
                // use reflection to remove dependence of API 17 when compiling

                // AudioManager.getProperty(AudioManager.PROPERTY_OUTPUT_SAMPLE_RATE);
                final Class audioManagerClass = AudioManager.class;
                Object[] parameters = new Object[]{Cocos2dxReflectionHelper.<String>getConstantValue(audioManagerClass, "PROPERTY_OUTPUT_SAMPLE_RATE")};
                final String strSampleRate = Cocos2dxReflectionHelper.<String>invokeInstanceMethod(am, "getProperty", new Class[]{String.class}, parameters);

                // AudioManager.getProperty(AudioManager.PROPERTY_OUTPUT_FRAMES_PER_BUFFER);
                parameters = new Object[]{Cocos2dxReflectionHelper.<String>getConstantValue(audioManagerClass, "PROPERTY_OUTPUT_FRAMES_PER_BUFFER")};
                final String strBufferSizeInFrames = Cocos2dxReflectionHelper.<String>invokeInstanceMethod(am, "getProperty", new Class[]{String.class}, parameters);

                sampleRate = Integer.parseInt(strSampleRate);
                bufferSizeInFrames = Integer.parseInt(strBufferSizeInFrames);

                Log.d(TAG, "sampleRate: " + sampleRate + ", framesPerBuffer: " + bufferSizeInFrames);
            } else {
                Log.d(TAG, "android version is lower than 17");
            }

            nativeSetAudioDeviceInfo(isSupportLowLatency, sampleRate, bufferSizeInFrames);

            final ApplicationInfo applicationInfo = activity.getApplicationInfo();
            
            Cocos2dxHelper.sPackageName = applicationInfo.packageName;
            Cocos2dxHelper.sFileDirectory = activity.getFilesDir().getAbsolutePath();
            
            Cocos2dxHelper.nativeSetApkPath(Cocos2dxHelper.getAssetsPath());
    
            Cocos2dxHelper.sCocos2dxAccelerometer = new Cocos2dxAccelerometer(activity);
            Cocos2dxHelper.sAssetManager = activity.getAssets();
            Cocos2dxHelper.nativeSetContext((Context)activity, Cocos2dxHelper.sAssetManager);
            Cocos2dxHelper.sVibrateService = (Vibrator)activity.getSystemService(Context.VIBRATOR_SERVICE);

            sInited = true;
            
            int versionCode = 1;
            try {
                versionCode = Cocos2dxActivity.getContext().getPackageManager().getPackageInfo(Cocos2dxHelper.getPackageName(), 0).versionCode;
            } catch (NameNotFoundException e) {
                e.printStackTrace();
            }
            try {
                Cocos2dxHelper.sOBBFile = APKExpansionSupport.getAPKExpansionZipFile(Cocos2dxActivity.getContext(), versionCode, 0);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    // This function returns the absolute path to the OBB if it exists,
    // else it returns the absolute path to the APK.
    public static String getAssetsPath()
    {
        if (Cocos2dxHelper.sAssetsPath == "") {
            int versionCode = 1;
            try {
                versionCode = Cocos2dxHelper.sActivity.getPackageManager().getPackageInfo(Cocos2dxHelper.sPackageName, 0).versionCode;
            } catch (NameNotFoundException e) {
                e.printStackTrace();
            }
            String pathToOBB = Environment.getExternalStorageDirectory().getAbsolutePath() + "/Android/obb/" + Cocos2dxHelper.sPackageName + "/main." + versionCode + "." + Cocos2dxHelper.sPackageName + ".obb";
            File obbFile = new File(pathToOBB);
            if (obbFile.exists())
                Cocos2dxHelper.sAssetsPath = pathToOBB;
            else
                Cocos2dxHelper.sAssetsPath = Cocos2dxHelper.sActivity.getApplicationInfo().sourceDir;
        }
        
        return Cocos2dxHelper.sAssetsPath;
    }
    
    public static ZipResourceFile getObbFile()
    {
        return Cocos2dxHelper.sOBBFile;
    }
    
    public static Activity getActivity() {
        return sActivity;
    }
    
    public static void addOnActivityResultListener(OnActivityResultListener listener) {
        onActivityResultListeners.add(listener);
    }
    
    public static Set<OnActivityResultListener> getOnActivityResultListeners() {
        return onActivityResultListeners;
    }
    
    public static boolean isActivityVisible(){
        return sActivityVisible;
    }

    // ===========================================================
    // Getter & Setter
    // ===========================================================

    // ===========================================================
    // Methods for/from SuperClass/Interfaces
    // ===========================================================

    // ===========================================================
    // Methods
    // ===========================================================

    private static native void nativeSetApkPath(final String pApkPath);

    private static native void nativeSetEditTextDialogResult(final byte[] pBytes);

    private static native void nativeSetContext(final Context pContext, final AssetManager pAssetManager);

    private static native void nativeSetAudioDeviceInfo(boolean isSupportLowLatency, int deviceSampleRate, int audioBufferSizeInFames);

    public static String getPackageName() {
        return Cocos2dxHelper.sPackageName;
    }
    public static String getWritablePath() {
        return Cocos2dxHelper.sFileDirectory;
    }

    public static String getCurrentLanguage() {
        return Locale.getDefault().getLanguage();
    }
    
    public static String getDeviceModel(){
        return Build.MODEL;
    }

    public static AssetManager getAssetManager() {
        return Cocos2dxHelper.sAssetManager;
    }

    public static void enableAccelerometer() {
        Cocos2dxHelper.sAccelerometerEnabled = true;
        Cocos2dxHelper.sCocos2dxAccelerometer.enable();
    }

    public static void setAccelerometerInterval(float interval) {
        Cocos2dxHelper.sCocos2dxAccelerometer.setInterval(interval);
    }

    public static void disableAccelerometer() {
        Cocos2dxHelper.sAccelerometerEnabled = false;
        Cocos2dxHelper.sCocos2dxAccelerometer.disable();
    }

    public static void setKeepScreenOn(boolean value) {
        ((Cocos2dxActivity)sActivity).setKeepScreenOn(value);
    }

    public static void vibrate(float duration) {
        try {
            if (sVibrateService != null && sVibrateService.hasVibrator()) {
                if (android.os.Build.VERSION.SDK_INT >= 26) {
                    Class<?> vibrationEffectClass = Class.forName("android.os.VibrationEffect");
                    if(vibrationEffectClass != null) {
                        final int DEFAULT_AMPLITUDE = Cocos2dxReflectionHelper.<Integer>getConstantValue(vibrationEffectClass,
                                "DEFAULT_AMPLITUDE");
                        //VibrationEffect.createOneShot(long milliseconds, int amplitude)
                        final Method method = vibrationEffectClass.getMethod("createOneShot",
                                new Class[]{Long.TYPE, Integer.TYPE});
                        Class<?> type = method.getReturnType();

                        Object effect =  method.invoke(vibrationEffectClass,
                                new Object[]{(long) (duration * 1000), DEFAULT_AMPLITUDE});
                        //sVibrateService.vibrate(VibrationEffect effect);
                        Cocos2dxReflectionHelper.invokeInstanceMethod(sVibrateService,"vibrate",
                                new Class[]{type}, new Object[]{(effect)});
                    }
                } else {
                    sVibrateService.vibrate((long) (duration * 1000));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

 	public static String getVersion() {
 		try {
 			String version = Cocos2dxActivity.getContext().getPackageManager().getPackageInfo(Cocos2dxActivity.getContext().getPackageName(), 0).versionName;
 			return version;
 		} catch(Exception e) {
 			return "";
 		}
 	}

    public static boolean openURL(String url) { 
        boolean ret = false;
        try {
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setData(Uri.parse(url));
            sActivity.startActivity(i);
            ret = true;
        } catch (Exception e) {
        }
        return ret;
    }

    // 复制文本到剪切板
    public static void copyTextToClipboard(final String text){
        sActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ClipboardManager myClipboard = (ClipboardManager)sActivity.getSystemService(Context.CLIPBOARD_SERVICE);
                ClipData myClip = ClipData.newPlainText("text", text);
                myClipboard.setPrimaryClip(myClip);
            }
        });
    }
    
    public static long[] getObbAssetFileDescriptor(final String path) {
        long[] array = new long[3];
        if (Cocos2dxHelper.sOBBFile != null) {
            AssetFileDescriptor descriptor = Cocos2dxHelper.sOBBFile.getAssetFileDescriptor(path);
            if (descriptor != null) {
                try {
                    ParcelFileDescriptor parcel = descriptor.getParcelFileDescriptor();
                    Method method = parcel.getClass().getMethod("getFd", new Class[] {});
                    array[0] = (Integer)method.invoke(parcel);
                    array[1] = descriptor.getStartOffset();
                    array[2] = descriptor.getLength();
                } catch (NoSuchMethodException e) {
                    Log.e(Cocos2dxHelper.TAG, "Accessing file descriptor directly from the OBB is only supported from Android 3.1 (API level 12) and above.");
                } catch (IllegalAccessException e) {
                    Log.e(Cocos2dxHelper.TAG, e.toString());
                } catch (InvocationTargetException e) {
                    Log.e(Cocos2dxHelper.TAG, e.toString());
                }
            }
        }
        return array;
    }

    public static void endApplication() {
        if (sActivity != null)
            sActivity.finish();
    }

    public static void onResume() {
        sActivityVisible = true;
        if (Cocos2dxHelper.sAccelerometerEnabled) {
            Cocos2dxHelper.sCocos2dxAccelerometer.enable();
        }
    }

    public static void onPause() {
        sActivityVisible = false;
        if (Cocos2dxHelper.sAccelerometerEnabled) {
            Cocos2dxHelper.sCocos2dxAccelerometer.disable();
        }
    }

    public static void onEnterBackground() {

    }
    
    public static void onEnterForeground() {

    }
    
    public static void terminateProcess() {
        android.os.Process.killProcess(android.os.Process.myPid());
    }

    private static void showDialog(final String pTitle, final String pMessage) {
        Cocos2dxHelper.sCocos2dxHelperListener.showDialog(pTitle, pMessage);
    }

    public static void setEditTextDialogResult(final String pResult) {
        try {
            final byte[] bytesUTF8 = pResult.getBytes("UTF8");

            Cocos2dxHelper.sCocos2dxHelperListener.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxHelper.nativeSetEditTextDialogResult(bytesUTF8);
                }
            });
        } catch (UnsupportedEncodingException pUnsupportedEncodingException) {
            /* Nothing. */
        }
    }

    public static int getDPI()
    {
        if (sActivity != null)
        {
            DisplayMetrics metrics = new DisplayMetrics();
            WindowManager wm = sActivity.getWindowManager();
            if (wm != null)
            {
                Display d = wm.getDefaultDisplay();
                if (d != null)
                {
                    d.getMetrics(metrics);
                    return (int)(metrics.density*160.0f);
                }
            }
        }
        return -1;
    }

    public static byte[] conversionEncoding(byte[] text, String fromCharset,String newCharset)
    {
        try {
            String str = new String(text,fromCharset);
            return str.getBytes(newCharset);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return null;
    }

    private static void setGameInfoDebugViewText(int index, String text) {
        if (sOnGameInfoUpdatedListener != null) {
            if (index == 0) {
                sOnGameInfoUpdatedListener.onGameInfoUpdated_0(text);
            }
            else if (index == 1) {
                sOnGameInfoUpdatedListener.onGameInfoUpdated_1(text);
            }
            else if (index == 2) {
                sOnGameInfoUpdatedListener.onGameInfoUpdated_2(text);
            }
        }
    }

    private static void setJSBInvocationCount(int count) {
        if (sOnGameInfoUpdatedListener != null) {
            sOnGameInfoUpdatedListener.onJSBInvocationCountUpdated(count);
        }
    }

    private static void openDebugView() {
        if (sOnGameInfoUpdatedListener != null) {
            sOnGameInfoUpdatedListener.onOpenDebugView();
        }
    }

    private static void disableBatchGLCommandsToNative() {
        if (sOnGameInfoUpdatedListener != null) {
            sOnGameInfoUpdatedListener.onDisableBatchGLCommandsToNative();
        }
    }

    public interface OnGameInfoUpdatedListener {
        void onFPSUpdated(float fps);
        void onJSBInvocationCountUpdated(int count);
        void onOpenDebugView();
        void onDisableBatchGLCommandsToNative();
        void onGameInfoUpdated_0(String text);
        void onGameInfoUpdated_1(String text);
        void onGameInfoUpdated_2(String text);
    }

    private static OnGameInfoUpdatedListener sOnGameInfoUpdatedListener;

    public static void setOnGameInfoUpdatedListener(OnGameInfoUpdatedListener listener) {
        sOnGameInfoUpdatedListener = listener;
    }

    public static OnGameInfoUpdatedListener getOnGameInfoUpdatedListener() {
        return sOnGameInfoUpdatedListener;
    }

    // ===========================================================
    // Inner and Anonymous Classes
    // ===========================================================

    public static interface Cocos2dxHelperListener {
        public void showDialog(final String pTitle, final String pMessage);

        public void runOnGLThread(final Runnable pRunnable);
    }

    private static float[] sDeviceMotionValues = new float[9];

    private static float[] getDeviceMotionValue() {
        Cocos2dxAccelerometer.DeviceMotionEvent event = Cocos2dxHelper.sCocos2dxAccelerometer.getDeviceMotionEvent();
        sDeviceMotionValues[0] = event.acceleration.x;
        sDeviceMotionValues[1] = event.acceleration.y;
        sDeviceMotionValues[2] = event.acceleration.z;

        sDeviceMotionValues[3] = event.accelerationIncludingGravity.x;
        sDeviceMotionValues[4] = event.accelerationIncludingGravity.y;
        sDeviceMotionValues[5] = event.accelerationIncludingGravity.z;

        sDeviceMotionValues[6] = event.rotationRate.alpha;
        sDeviceMotionValues[7] = event.rotationRate.beta;
        sDeviceMotionValues[8] = event.rotationRate.gamma;

        return sDeviceMotionValues;
    }

    public static int getSDKVersion() {
        return Build.VERSION.SDK_INT;
    }

    public static String getSystemVersion() {
        return Build.VERSION.RELEASE;
    }


    public static int getDeviceRotation() {
        try {
            Display display = ((WindowManager) sActivity.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay();
            return display.getRotation();
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
        return Surface.ROTATION_0;
    }
}
