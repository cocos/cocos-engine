/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.

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

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.res.AssetManager;
import android.net.Uri;
import android.os.Build;
import android.os.Vibrator;
import android.preference.PreferenceManager.OnActivityResultListener;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.WindowManager;

import java.io.UnsupportedEncodingException;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

public class Cocos2dxHelper {
    private static final String PREFS_NAME = "Cocos2dxPrefsFile";
    private static final int RUNNABLES_PER_FRAME = 5;

    // ===========================================================
    // Fields
    // ===========================================================

    private static Cocos2dxMusic sCocosMusic;
    private static Cocos2dxSound sCocosSound;
    private static AssetManager sAssetManager;
    private static Cocos2dxAccelerometer sAccelerometer;
    private static boolean sAccelerometerEnabled;
    private static boolean sActivityVisible;
    private static String sPackageName;
    private static String sFileDirectory;

    private static Set<OnActivityResultListener> onActivityResultListeners = new LinkedHashSet<OnActivityResultListener>();
    private static Vibrator sVibrateService = null;

    public static void runOnGLThread(final Runnable r) {
        Cocos2dxActivity.COCOS_ACTIVITY.runOnGLThread(r);
    }

    private static boolean sInited = false;
    public static void init(final Activity activity) {
        if (!sInited) {
            final ApplicationInfo applicationInfo = activity.getApplicationInfo();

            sPackageName = applicationInfo.packageName;
            sFileDirectory = activity.getFilesDir().getAbsolutePath();

            nativeSetApkPath(applicationInfo.sourceDir);

            sAccelerometer = new Cocos2dxAccelerometer(activity);
            sCocosMusic = new Cocos2dxMusic(activity);
            sCocosSound = new Cocos2dxSound(activity);
            sAssetManager = activity.getAssets();
            nativeSetContext(activity.getClass().getClassLoader(), sAssetManager);
            sVibrateService = (Vibrator)activity.getSystemService(Context.VIBRATOR_SERVICE);

            sInited = true;
        }
    }

    public static Activity getActivity() {
        return Cocos2dxActivity.COCOS_ACTIVITY;
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
    // Methods
    // ===========================================================

    private static native void nativeSetApkPath(final String pApkPath);

    private static native void nativeSetEditTextDialogResult(final byte[] pBytes);

    private static native void nativeSetContext(final ClassLoader classLoader, final AssetManager pAssetManager);

    public static String getCocos2dxPackageName() {
        return Cocos2dxHelper.sPackageName;
    }
    public static String getCocos2dxWritablePath() {
        return Cocos2dxHelper.sFileDirectory;
    }

    public static String getCurrentLanguage() {
        return Locale.getDefault().getLanguage();
    }

    public static String getDeviceModel(){
        return Build.MODEL;
    }

    public static int getSDKVersion() {
        return Build.VERSION.SDK_INT;
    }

    public static AssetManager getAssetManager() {
        return Cocos2dxHelper.sAssetManager;
    }

    public static void enableAccelerometer() {
        if (sAccelerometer != null) {
            sAccelerometerEnabled = true;
            sAccelerometer.enable();
        }
    }

    public static void setAccelerometerInterval(float interval) {
        if (sAccelerometer != null) {
            sAccelerometer.setInterval(interval);
        }
    }

    public static void disableAccelerometer() {
        if (sAccelerometer != null) {
            sAccelerometerEnabled = false;
            sAccelerometer.disable();
        }
    }

    public static void setKeepScreenOn(boolean value) {
        Cocos2dxActivity.COCOS_ACTIVITY.setKeepScreenOn(value);
    }

    public static void vibrate(float duration) {
        if (sVibrateService != null)
            sVibrateService.vibrate((long)(duration * 1000));
    }

    public static boolean openURL(String url) {
        boolean ret = false;
        try {
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setData(Uri.parse(url));
            Cocos2dxActivity.COCOS_ACTIVITY.startActivity(i);
            ret = true;
        } catch (Exception e) {
        }
        return ret;
    }

    public static void preloadBackgroundMusic(final String pPath) {
        sCocosMusic.preloadBackgroundMusic(pPath);
    }

    public static void playBackgroundMusic(final String pPath, final boolean isLoop) {
        sCocosMusic.playBackgroundMusic(pPath, isLoop);
    }

    public static void resumeBackgroundMusic() {
       sCocosMusic.resumeBackgroundMusic();
    }

    public static void pauseBackgroundMusic() {
        sCocosMusic.pauseBackgroundMusic();
    }

    public static void stopBackgroundMusic() {
        sCocosMusic.stopBackgroundMusic();
    }

    public static void rewindBackgroundMusic() {
        sCocosMusic.rewindBackgroundMusic();
    }

    public static boolean isBackgroundMusicPlaying() {
        return sCocosMusic.isBackgroundMusicPlaying();
    }

    public static float getBackgroundMusicVolume() {
        return sCocosMusic.getBackgroundVolume();
    }

    public static void setBackgroundMusicVolume(final float volume) {
        sCocosMusic.setBackgroundVolume(volume);
    }

    public static void preloadEffect(final String path) {
        sCocosSound.preloadEffect(path);
    }

    public static int playEffect(final String path, final boolean isLoop, final float pitch, final float pan, final float gain) {
        return sCocosSound.playEffect(path, isLoop, pitch, pan, gain);
    }

    public static void resumeEffect(final int soundId) {
        sCocosSound.resumeEffect(soundId);
    }

    public static void pauseEffect(final int soundId) {
        sCocosSound.pauseEffect(soundId);
    }

    public static void stopEffect(final int soundId) {
        sCocosSound.stopEffect(soundId);
    }

    public static float getEffectsVolume() {
        return sCocosSound.getEffectsVolume();
    }

    public static void setEffectsVolume(final float volume) {
        sCocosSound.setEffectsVolume(volume);
    }

    public static void unloadEffect(final String path) {
        sCocosSound.unloadEffect(path);
    }

    public static void pauseAllEffects() {
        sCocosSound.pauseAllEffects();
    }

    public static void resumeAllEffects() {
        sCocosSound.resumeAllEffects();
    }

    public static void stopAllEffects() {
        sCocosSound.stopAllEffects();
    }

    public static void destroyAudioEngine() {
        if (sCocosMusic != null)
        {
            sCocosMusic.end();
            sCocosMusic = null;
        }
        if (sCocosSound != null)
        {
            sCocosSound.end();
            sCocosSound = null;
        }
    }

    public static void reset() {
        destroyAudioEngine();
        onActivityResultListeners.clear();

        if (sAccelerometer != null) {
            disableAccelerometer();
            sAccelerometer = null;
        }

        sVibrateService = null;
    }

    public static void onResume() {
        sActivityVisible = true;
        if (sAccelerometerEnabled) {
            sAccelerometer.enable();
        }
    }

    public static void onPause() {
        sActivityVisible = false;
        if (sAccelerometerEnabled) {
            sAccelerometer.disable();
        }
    }

    public static void onEnterBackground() {
        if (sCocosSound != null) {
            sCocosSound.onEnterBackground();
        }

        if (sCocosMusic != null) {
            sCocosMusic.onEnterBackground();
        }
    }

    public static void onEnterForeground() {
        if (sCocosSound != null) {
            sCocosSound.onEnterForeground();
        }

        if (sCocosMusic != null) {
            sCocosMusic.onEnterForeground();
        }
    }

    public static void terminateProcess() {
        android.os.Process.killProcess(android.os.Process.myPid());
    }

    private static void showDialog(final String pTitle, final String pMessage) {
        Cocos2dxActivity.COCOS_ACTIVITY.showDialog(pTitle, pMessage);
    }


    public static void setEditTextDialogResult(final String pResult) {
        try {
            final byte[] bytesUTF8 = pResult.getBytes("UTF8");

            Cocos2dxActivity.COCOS_ACTIVITY.runOnGLThread(new Runnable() {
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
        if (Cocos2dxActivity.COCOS_ACTIVITY != null)
        {
            DisplayMetrics metrics = new DisplayMetrics();
            WindowManager wm = Cocos2dxActivity.COCOS_ACTIVITY.getWindowManager();
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

    // ===========================================================
    // Functions for CCUserDefault
    // ===========================================================

    public static boolean getBoolForKey(String key, boolean defaultValue) {
        SharedPreferences settings = Cocos2dxActivity.COCOS_ACTIVITY.getSharedPreferences(Cocos2dxHelper.PREFS_NAME, 0);
        try {
            return settings.getBoolean(key, defaultValue);
        }
        catch (Exception ex) {
            ex.printStackTrace();

            Map allValues = settings.getAll();
            Object value = allValues.get(key);
            if ( value instanceof String)
            {
                return  Boolean.parseBoolean(value.toString());
            }
            else if (value instanceof Integer)
            {
                int intValue = ((Integer) value).intValue();
                return (intValue !=  0) ;
            }
            else if (value instanceof Float)
            {
                float floatValue = ((Float) value).floatValue();
                return (floatValue != 0.0f);
            }
        }

        return false;
    }

    public static int getIntegerForKey(String key, int defaultValue) {
        SharedPreferences settings = Cocos2dxActivity.COCOS_ACTIVITY.getSharedPreferences(Cocos2dxHelper.PREFS_NAME, 0);
        try {
            return settings.getInt(key, defaultValue);
        }
        catch (Exception ex) {
            ex.printStackTrace();

            Map allValues = settings.getAll();
            Object value = allValues.get(key);
            if ( value instanceof String) {
                return  Integer.parseInt(value.toString());
            }
            else if (value instanceof Float)
            {
                return ((Float) value).intValue();
            }
            else if (value instanceof Boolean)
            {
                boolean booleanValue = ((Boolean) value).booleanValue();
                if (booleanValue)
                    return 1;
            }
        }

        return 0;
    }

    public static float getFloatForKey(String key, float defaultValue) {
        SharedPreferences settings = Cocos2dxActivity.COCOS_ACTIVITY.getSharedPreferences(Cocos2dxHelper.PREFS_NAME, 0);
        try {
            return settings.getFloat(key, defaultValue);
        }
        catch (Exception ex) {
            ex.printStackTrace();;

            Map allValues = settings.getAll();
            Object value = allValues.get(key);
            if ( value instanceof String) {
                return  Float.parseFloat(value.toString());
            }
            else if (value instanceof Integer)
            {
                return ((Integer) value).floatValue();
            }
            else if (value instanceof Boolean)
            {
                boolean booleanValue = ((Boolean) value).booleanValue();
                if (booleanValue)
                    return 1.0f;
            }
        }

        return 0.0f;
    }

    public static double getDoubleForKey(String key, double defaultValue) {
        // SharedPreferences doesn't support saving double value
        return getFloatForKey(key, (float) defaultValue);
    }

    public static String getStringForKey(String key, String defaultValue) {
        SharedPreferences settings = Cocos2dxActivity.COCOS_ACTIVITY.getSharedPreferences(Cocos2dxHelper.PREFS_NAME, 0);
        try {
            return settings.getString(key, defaultValue);
        }
        catch (Exception ex) {
            ex.printStackTrace();

            return settings.getAll().get(key).toString();
        }
    }

    public static void setBoolForKey(String key, boolean value) {
        SharedPreferences settings = Cocos2dxActivity.COCOS_ACTIVITY.getSharedPreferences(Cocos2dxHelper.PREFS_NAME, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putBoolean(key, value);
        editor.commit();
    }

    public static void setIntegerForKey(String key, int value) {
        SharedPreferences settings = Cocos2dxActivity.COCOS_ACTIVITY.getSharedPreferences(Cocos2dxHelper.PREFS_NAME, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putInt(key, value);
        editor.commit();
    }

    public static void setFloatForKey(String key, float value) {
        SharedPreferences settings = Cocos2dxActivity.COCOS_ACTIVITY.getSharedPreferences(Cocos2dxHelper.PREFS_NAME, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putFloat(key, value);
        editor.commit();
    }

    public static void setDoubleForKey(String key, double value) {
        // SharedPreferences doesn't support recording double value
        SharedPreferences settings = Cocos2dxActivity.COCOS_ACTIVITY.getSharedPreferences(Cocos2dxHelper.PREFS_NAME, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putFloat(key, (float)value);
        editor.commit();
    }

    public static void setStringForKey(String key, String value) {
        SharedPreferences settings = Cocos2dxActivity.COCOS_ACTIVITY.getSharedPreferences(Cocos2dxHelper.PREFS_NAME, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public static void deleteValueForKey(String key) {
        SharedPreferences settings = Cocos2dxActivity.COCOS_ACTIVITY.getSharedPreferences(Cocos2dxHelper.PREFS_NAME, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.remove(key);
        editor.commit();
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

}

