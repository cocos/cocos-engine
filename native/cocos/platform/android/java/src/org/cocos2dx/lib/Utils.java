/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
import android.os.Build;
import android.view.View;

public class Utils {
    private static Activity sActivity = null;

    public static void setActivity(final Activity activity) {
        Utils.sActivity = activity;
    }

    public static void hideVirtualButton() {
        if (Build.VERSION.SDK_INT >= 19 &&
                null != Utils.sActivity) {
            // use reflection to remove dependence of API level

            Class viewClass = View.class;
            final int SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION = Cocos2dxReflectionHelper.<Integer>getConstantValue(viewClass, "SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION");
            final int SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN = Cocos2dxReflectionHelper.<Integer>getConstantValue(viewClass, "SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN");
            final int SYSTEM_UI_FLAG_HIDE_NAVIGATION = Cocos2dxReflectionHelper.<Integer>getConstantValue(viewClass, "SYSTEM_UI_FLAG_HIDE_NAVIGATION");
            final int SYSTEM_UI_FLAG_FULLSCREEN = Cocos2dxReflectionHelper.<Integer>getConstantValue(viewClass, "SYSTEM_UI_FLAG_FULLSCREEN");
            final int SYSTEM_UI_FLAG_IMMERSIVE_STICKY = Cocos2dxReflectionHelper.<Integer>getConstantValue(viewClass, "SYSTEM_UI_FLAG_IMMERSIVE_STICKY");
            final int SYSTEM_UI_FLAG_LAYOUT_STABLE = Cocos2dxReflectionHelper.<Integer>getConstantValue(viewClass, "SYSTEM_UI_FLAG_LAYOUT_STABLE");

            // getWindow().getDecorView().setSystemUiVisibility();
            final Object[] parameters = new Object[]{SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
                    | SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                    | SYSTEM_UI_FLAG_IMMERSIVE_STICKY};
            Cocos2dxReflectionHelper.<Void>invokeInstanceMethod(Utils.sActivity.getWindow().getDecorView(),
                    "setSystemUiVisibility",
                    new Class[]{Integer.TYPE},
                    parameters);
        }
    }
}