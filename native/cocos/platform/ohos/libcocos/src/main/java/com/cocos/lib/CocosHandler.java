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

import ohos.agp.window.dialog.CommonDialog;
import ohos.agp.window.dialog.IDialog;
import ohos.eventhandler.EventHandler;
import ohos.eventhandler.EventRunner;
import ohos.eventhandler.InnerEvent;

import java.lang.ref.WeakReference;

public class CocosHandler extends EventHandler {
    // ===========================================================
    // Constants
    // ===========================================================
    public final static int HANDLER_SHOW_DIALOG = 1;

    // ===========================================================
    // Fields
    // ===========================================================
    private WeakReference<CocosAbilitySlice> mActivity;
    
    // ===========================================================
    // Constructors
    // ===========================================================
    public CocosHandler(CocosAbilitySlice activity) {
        super(EventRunner.getMainEventRunner());
        this.mActivity = new WeakReference<CocosAbilitySlice>(activity);
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

    @Override
    public void processEvent(InnerEvent msg) {
        switch (msg.eventId) {
        case CocosHandler.HANDLER_SHOW_DIALOG:
            showDialog(msg);
            break;
        }
    }

    private void showDialog(InnerEvent msg) {
        CocosAbilitySlice theActivity = this.mActivity.get();
        DialogMessage dialogMessage = (DialogMessage)msg.object;

        CommonDialog dialog = new CommonDialog(theActivity.getContext());
        dialog.setTitleText(dialogMessage.title)
                .setContentText(dialogMessage.message)
                .setButton(IDialog.BUTTON1, "OK", new IDialog.ClickedListener() {
                    @Override
                    public void onClick(IDialog iDialog, int i) {

                    }
                });
        dialog.show();
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
