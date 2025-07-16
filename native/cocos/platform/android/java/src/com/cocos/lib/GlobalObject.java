/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;

public class GlobalObject {
    private static Context sContext = null;
    private static Activity sActivity = null;
    private static Handler sHandler = null;
    private static Thread sUiThread = null;

    // Should be invoked in UI thread. The parameter `context` and `activity` could be the same value.
    public static void init(Context context, Activity activity) {
        sContext = context;
        sActivity = activity;
        sHandler = new Handler(Looper.getMainLooper());
        sUiThread = Thread.currentThread();
        if (sUiThread != Looper.getMainLooper().getThread()) {
            throw new RuntimeException("GlobalObject.init should be invoked in UI thread");
        }
    }

    public static void destroy() {
        sContext = null;
        sActivity = null;
        if (sHandler != null) {
            sHandler.removeCallbacksAndMessages(null);
        }
        sHandler = null;
    }

    public static Activity getActivity() {
        return sActivity;
    }

    public static Context getContext() {
        return sContext;
    }

    /**
     * Runs the specified action on the UI thread. If the current thread is the UI
     * thread, then the action is executed immediately. If the current thread is
     * not the UI thread, the action is posted to the event queue of the UI thread.
     * This method keeps the same logic as which in Activity.runOnUiThread.
     * https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-13.0.0_r37/core/java/android/app/Activity.java#7364
     * @param action the action to run on the UI thread
     */
    public static void runOnUiThread(Runnable action) {
        if (Thread.currentThread() != sUiThread) {
            sHandler.post(action);
        } else {
            action.run();
        }
    }
}
