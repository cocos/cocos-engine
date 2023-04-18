/****************************************************************************
 * Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.
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

package com.cocos.lib.xr;

import android.app.Activity;
import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;

import java.lang.ref.WeakReference;

public class CocosXRApi {
    private static final String TAG = "CocosXRApi";
    private final static String ACTION_ADB_CMD = "com.cocosxr.adb.cmd";
    private enum ActivityLifecycleType {
        UnKnown,
        Created,
        Started,
        Resumed,
        Paused,
        Stopped,
        SaveInstanceState,
        Destroyed
    }

    private final static CocosXRApi instance = new CocosXRApi();

    /**
     * adb shell am broadcast -a com.cocosxr.adb.cmd --es CMD_KEY LOG --ei CMD_VALUE 1
     * adb shell am broadcast -a com.cocosxr.adb.cmd --es CMD_KEY LOG --es CMD_VALUE abc
     */
    private class CocosXRActionReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (ACTION_ADB_CMD.equals(intent.getAction())) {
                // adb cmd
                if (intent.getExtras() == null) {
                    Log.w(TAG, "[CocosXRActionReceiver] intent.getExtras() == null");
                    return;
                }
                Object cmdKey = intent.getExtras().get("CMD_KEY");
                String key = cmdKey == null ? "" : cmdKey.toString();
                Object cmdValue = intent.getExtras().get("CMD_VALUE");
                String valueStr = null;
                if (cmdValue instanceof Integer) {
                    valueStr = String.valueOf(intent.getIntExtra("CMD_VALUE", Integer.MIN_VALUE));
                } else if (cmdValue instanceof String) {
                    valueStr = intent.getStringExtra("CMD_VALUE");
                }

                try {
                    onAdbCmd(key, valueStr);
                } catch (Throwable e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private CocosXRApi() {
    }

    public static CocosXRApi getInstance() {
        return instance;
    }

    private Application application;
    private WeakReference<Activity> activityWeakReference;
    private Context applicationContext;
    private Application.ActivityLifecycleCallbacks activityLifecycleCallbacks;
    private CocosXRActionReceiver actionReceiver;
    private CocosXRWebViewManager webViewManager;

    public void onCreate(Activity activity) {
        activityWeakReference = new WeakReference<>(activity);
        application = activity.getApplication();
        applicationContext = activity.getApplicationContext();
        webViewManager = new CocosXRWebViewManager();
        if (activityLifecycleCallbacks == null) {
            activityLifecycleCallbacks = new Application.ActivityLifecycleCallbacks() {
                @Override
                public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
                    try {
                        onActivityLifecycleCallback(ActivityLifecycleType.Created.ordinal(), activity.getLocalClassName());
                    } catch (Throwable e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onActivityStarted(Activity activity) {
                    webViewManager.onCreate(activity);
                    try {
                        onActivityLifecycleCallback(ActivityLifecycleType.Started.ordinal(), activity.getLocalClassName());
                    } catch (Throwable e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onActivityResumed(Activity activity) {
                    try {
                        onActivityLifecycleCallback(ActivityLifecycleType.Resumed.ordinal(), activity.getLocalClassName());
                    } catch (Throwable e) {
                        e.printStackTrace();
                    }
                    webViewManager.onResume();
                }

                @Override
                public void onActivityPaused(Activity activity) {
                    try {
                        onActivityLifecycleCallback(ActivityLifecycleType.Paused.ordinal(), activity.getLocalClassName());
                    } catch (Throwable e) {
                        e.printStackTrace();
                    }
                    webViewManager.onPause();
                }

                @Override
                public void onActivityStopped(Activity activity) {
                    try {
                        onActivityLifecycleCallback(ActivityLifecycleType.Stopped.ordinal(), activity.getLocalClassName());
                    } catch (Throwable e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
                    try {
                        onActivityLifecycleCallback(ActivityLifecycleType.SaveInstanceState.ordinal(), activity.getLocalClassName());
                    } catch (Throwable e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onActivityDestroyed(Activity activity) {
                    try {
                        onActivityLifecycleCallback(ActivityLifecycleType.Destroyed.ordinal(), activity.getLocalClassName());
                    } catch (Throwable e) {
                        e.printStackTrace();
                    }
                    webViewManager.onDestroy();
                }
            };
        }
        application.registerActivityLifecycleCallbacks(activityLifecycleCallbacks);

        if(actionReceiver != null) {
            applicationContext.unregisterReceiver(actionReceiver);
            actionReceiver =null;
        }

        actionReceiver = new CocosXRActionReceiver();

        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(ACTION_ADB_CMD);
        applicationContext.registerReceiver(actionReceiver, intentFilter);
    }

    public void onDestroy() {
        if (application != null && activityLifecycleCallbacks != null) {
            application.unregisterActivityLifecycleCallbacks(activityLifecycleCallbacks);
            activityLifecycleCallbacks = null;
        }

        if(applicationContext != null && actionReceiver != null) {
            applicationContext.unregisterReceiver(actionReceiver);
            actionReceiver = null;
        }
    }

    public Context getContext() {
        return applicationContext;
    }

    public Activity getActivity() {
        return activityWeakReference.get();
    }

    // native
    private native void onActivityLifecycleCallback(int id, String activityClassName);
    private native void onAdbCmd(String key, String value);
}
