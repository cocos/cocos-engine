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

package com.cocos.lib.xr.permission;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Process;
import android.text.TextUtils;
import android.util.Log;
import com.cocos.lib.CocosHelper;
import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.lib.xr.CocosXRApi;

import java.util.Arrays;

public class CocosXRPermissionHelper {
    private static final String LOG_TAG = "CocosXRPermissionHelper";
    public static final String XR_PERMISSION_EVENT_NAME = "xr-permission";
    public static final String XR_PERMISSION_TAG_CHECK = "check";
    public static final String XR_PERMISSION_TAG_REQUEST = "request";
    public interface PermissionCallback {
        void onRequestPermissionsResult(String[] permissions, int[] grantResults);
    }

    private static PermissionCallback permissionCallback = null;
    public static void onScriptEvent(String arg) {
        String[] array = arg.split(":");
        if (TextUtils.equals(array[0], XR_PERMISSION_TAG_CHECK)) {
            int result = checkPermission(array[1]) ? PackageManager.PERMISSION_GRANTED : PackageManager.PERMISSION_DENIED;
            CocosHelper.runOnGameThread(() -> JsbBridgeWrapper.getInstance().dispatchEventToScript(XR_PERMISSION_EVENT_NAME, XR_PERMISSION_TAG_CHECK + ":" + array[1] + ":" +  result));
        } else if (TextUtils.equals(array[0], XR_PERMISSION_TAG_REQUEST)) {
            String[] permissionNames = array[1].split("&");
            acquirePermissions(permissionNames, (PermissionCallback) null);
        }
    }

    public static boolean checkPermission(String permission) {
        Context context = CocosXRApi.getInstance().getContext();
        if (context == null)
            return false;
        if (context.checkPermission(permission, android.os.Process.myPid(), Process.myUid()) == PackageManager.PERMISSION_GRANTED) {
            Log.d(LOG_TAG, "checkPermission: " + permission + " has granted");
            return true;
        } else {
            Log.d(LOG_TAG, "checkPermission: " + permission + " has not granted");
            return false;
        }
    }

    public static void acquirePermissions(String[] permissions, PermissionCallback callback) {
        permissionCallback = callback;
        CocosXRPermissionHelper.acquirePermissions(permissions, CocosXRApi.getInstance().getActivity());
    }

    public static void acquirePermissions(String[] permissions, Activity InActivity) {
        if (InActivity == null)
            return;
        final Activity activity = InActivity;
        activity.runOnUiThread(() -> {
            CocosXRPermissionFragment fragment = CocosXRPermissionFragment.getInstance(activity);
            if (fragment != null) {
                fragment.acquirePermissions(permissions);
            }
        });
    }

    public static void onAcquirePermissions(String[] permissions, int[] grantResults) {
        Log.d(LOG_TAG, "onAcquirePermissions:" + Arrays.toString(permissions) + "|" + Arrays.toString(grantResults));
        //
        CocosHelper.runOnGameThread(() -> {
            StringBuilder stringBuilder = new StringBuilder(XR_PERMISSION_TAG_REQUEST);
            stringBuilder.append(":");
            for (int i = 0; i < permissions.length; i++) {
                stringBuilder.append(permissions[i]).append("#").append(grantResults[i]);
                if (i != permissions.length - 1) {
                    stringBuilder.append("&");
                }
            }
            JsbBridgeWrapper.getInstance().dispatchEventToScript(XR_PERMISSION_EVENT_NAME, stringBuilder.toString());
        });
        if (permissionCallback != null) {
            permissionCallback.onRequestPermissionsResult(permissions, grantResults);
        }
    }
}
