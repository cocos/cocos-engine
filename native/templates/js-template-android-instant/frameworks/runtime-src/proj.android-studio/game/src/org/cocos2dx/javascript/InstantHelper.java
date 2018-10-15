/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

package org.cocos2dx.javascript;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.google.android.gms.instantapps.InstantApps;
import com.google.android.gms.instantapps.PackageManagerCompat;

public class InstantHelper {
    private static final String TAG = "InstantHelper";
    private Context mCtx = null;
    private static InstantHelper mHelper = null;

    public static InstantHelper getInstance() {
        if (null == mHelper) {
            mHelper = new InstantHelper();
            mHelper.init(SDKWrapper.getInstance().getContext());
        }
        return mHelper;
    }

    public void init(Context ctx) {
        this.mCtx = ctx;
    }

    private void _showInstallPrompt() {
        Activity act = ((Activity) mCtx);
        Uri a = act.getIntent().getData();
        Intent postInstallIntent = new Intent(Intent.ACTION_VIEW, a);
        postInstallIntent.addCategory(Intent.CATEGORY_BROWSABLE);
        com.google.android.instantapps.InstantApps.showInstallPrompt(act, postInstallIntent, 0, "AppActivity");
    }

    private boolean _isInstantApp() {
        PackageManagerCompat compact = InstantApps.getPackageManagerCompat(mCtx);
        return compact.isInstantApp();
    }

    private boolean _setInstantAppCookie(String ck) {
        PackageManagerCompat compact = InstantApps.getPackageManagerCompat(mCtx);
        if (null == ck || "null".equals(ck)) {
            return compact.setInstantAppCookie(null);
        }
        return compact.setInstantAppCookie(ck.getBytes());
    }

    private String _getInstantAppCookie() {
        String result;
        PackageManagerCompat compact = InstantApps.getPackageManagerCompat(mCtx);
        byte[] bt = compact.getInstantAppCookie();
        if (bt != null) {
            result = new String(bt);
        } else {
            result = "null";
        }
        return result;
    }

    private int _getInstantAppCookieMaxSize() {
        PackageManagerCompat compact = InstantApps.getPackageManagerCompat(mCtx);
        return compact.getInstantAppCookieMaxSize();
    }

    public static boolean isInstantApp() {
        return InstantHelper.getInstance()._isInstantApp();
    }

    public static String getInstantAppCookie() {
        return InstantHelper.getInstance()._getInstantAppCookie();
    }

    public static boolean setInstantAppCookie(final String ck) {
        return InstantHelper.getInstance()._setInstantAppCookie(ck);
    }

    public static boolean clearInstantAppCookie() {
        return InstantHelper.getInstance()._setInstantAppCookie(null);
    }

    public static int getInstantAppCookieMaxSize() {
        return InstantHelper.getInstance()._getInstantAppCookieMaxSize();
    }

    public static void showInstallPrompt() {
        InstantHelper.getInstance()._showInstallPrompt();
    }
}
