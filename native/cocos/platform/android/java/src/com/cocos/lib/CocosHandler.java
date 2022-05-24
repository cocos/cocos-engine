/****************************************************************************
Copyright (c) 2010-2013 cocos2d-x.org
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

package com.cocos.lib;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Handler;
import android.os.Message;
import android.app.Activity;

import java.lang.ref.WeakReference;

public class CocosHandler extends Handler {
    // ===========================================================
    // Constants
    // ===========================================================
    public final static int HANDLER_SHOW_DIALOG = 1;

    // ===========================================================
    // Fields
    // ===========================================================
    private WeakReference<Activity> mActivity;
    
    // ===========================================================
    // Constructors
    // ===========================================================
    public CocosHandler(Activity activity) {
        this.mActivity = new WeakReference<Activity>(activity);
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

    public void handleMessage(Message msg) {
        switch (msg.what) {
        case CocosHandler.HANDLER_SHOW_DIALOG:
            showDialog(msg);
            break;
        }
    }

    private void showDialog(Message msg) {
        Activity theActivity = this.mActivity.get();
        DialogMessage dialogMessage = (DialogMessage)msg.obj;
        new AlertDialog.Builder(theActivity)
        .setTitle(dialogMessage.title)
        .setMessage(dialogMessage.message)
        .setPositiveButton("Ok", 
                new DialogInterface.OnClickListener() {

                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        // REFINE: Auto-generated method stub

                    }
                }).create().show();
    }

    // ===========================================================
    // Inner and Anonymous Classes
    // ===========================================================

    public static class DialogMessage {
        public String title;
        public String message;
        
        public DialogMessage(String title, String message) {
            this.title = title;
            this.message = message;
        }
    }
}
