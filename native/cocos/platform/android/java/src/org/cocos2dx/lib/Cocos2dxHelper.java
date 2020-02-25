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
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.os.Vibrator;
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
import java.util.Locale;


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
    private static String sPackageName;
    private static String sFileDirectory;
    private static Activity sActivity = null;
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

    private static boolean sInited = false;
    public static void init(final Activity activity) {
        sActivity = activity;
        if (!sInited) {
            final ApplicationInfo applicationInfo = activity.getApplicationInfo();
            
            Cocos2dxHelper.sPackageName = applicationInfo.packageName;
            Cocos2dxHelper.sFileDirectory = activity.getFilesDir().getAbsolutePath();
            
            Cocos2dxHelper.nativeSetApkPath(Cocos2dxHelper.getAssetsPath());
    
            Cocos2dxHelper.sAssetManager = activity.getAssets();
            Cocos2dxHelper.nativeSetContext((Context)activity, Cocos2dxHelper.sAssetManager);
            Cocos2dxHelper.sVibrateService = (Vibrator)activity.getSystemService(Context.VIBRATOR_SERVICE);

            sInited = true;
            
            int versionCode = 1;
            try {
                versionCode = sActivity.getPackageManager().getPackageInfo(Cocos2dxHelper.getPackageName(), 0).versionCode;
            } catch (NameNotFoundException e) {
                e.printStackTrace();
            }
            try {
                Cocos2dxHelper.sOBBFile = APKExpansionSupport.getAPKExpansionZipFile(sActivity, versionCode, 0);
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

    private static native void nativeSetContext(final Context pContext, final AssetManager pAssetManager);

    public static String getPackageName() {
        return Cocos2dxHelper.sPackageName;
    }
    public static String getWritablePath() {
        return Cocos2dxHelper.sFileDirectory;
    }

    public static String getCurrentLanguage() {
        return Locale.getDefault().getLanguage();
    }

    public static String getCurrentLanguageCode() {
        return Locale.getDefault().toString();
    }

    public static String getDeviceModel(){
        return Build.MODEL;
    }

    public static AssetManager getAssetManager() {
        return Cocos2dxHelper.sAssetManager;
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
 			String version = sActivity.getPackageManager().getPackageInfo(sActivity.getPackageName(), 0).versionName;
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

    // ===========================================================
    // Inner and Anonymous Classes
    // ===========================================================

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
