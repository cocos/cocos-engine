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
import android.app.Fragment;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import java.util.Arrays;

public class CocosXRPermissionFragment extends Fragment {
    private static final int PERMISSION_REQUEST_CODE = 1101;
    private static final String TAG = "CocosPermissionFragment";
    private static final String PERMISSION_TAG = "TAG_PermissionFragment";

    public static CocosXRPermissionFragment getInstance(Activity activity) {
        FragmentManager fm = activity.getFragmentManager();
        CocosXRPermissionFragment fragment = (CocosXRPermissionFragment) fm.findFragmentByTag(PERMISSION_TAG);
        if (fragment == null) {
            try {
                Log.d(TAG, "Creating CocosXRPermissionFragment");
                fragment = new CocosXRPermissionFragment();
                FragmentTransaction trans = fm.beginTransaction();
                trans.add(fragment, PERMISSION_TAG);
                trans.commit();
                fm.executePendingTransactions();
            } catch (Throwable th) {
                Log.e(TAG, "Cannot launch PermissionFragment:" + th.getMessage(), th);
                return null;
            }
        }
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRetainInstance(true);
        Log.d(TAG, "onCreate");
    }

    public void acquirePermissions(String[] permissions) {
        Handler handler = new Handler(Looper.getMainLooper());
        handler.post(() -> {
            final int[] grantResults = new int[permissions.length];
            Activity context = getActivity();
            if (context != null) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    PackageManager packageManager = context.getPackageManager();
                    String packageName = context.getPackageName();
                    for (String permission : permissions) {
                        if (PackageManager.PERMISSION_DENIED == packageManager.checkPermission(permission, packageName)) {
                            CocosXRPermissionFragment.this.requestPermissions(permissions, PERMISSION_REQUEST_CODE);
                            break;
                        }
                    }
                    Arrays.fill(grantResults, PackageManager.PERMISSION_GRANTED);
                    onRequestPermissionsResult(PERMISSION_REQUEST_CODE, permissions, grantResults);
                } else {
                    Log.e(TAG, "acquirePermissions failed !");
                    Arrays.fill(grantResults, PackageManager.PERMISSION_DENIED);
                    onRequestPermissionsResult(PERMISSION_REQUEST_CODE, permissions, grantResults);
                }
            } else {
                Arrays.fill(grantResults, PackageManager.PERMISSION_DENIED);
                onRequestPermissionsResult(PERMISSION_REQUEST_CODE, permissions, grantResults);
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == PERMISSION_REQUEST_CODE && permissions.length > 0) {
            CocosXRPermissionHelper.onAcquirePermissions(permissions, grantResults);
        }
    }
}
