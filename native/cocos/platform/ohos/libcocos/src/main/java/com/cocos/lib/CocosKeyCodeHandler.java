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


import ohos.multimodalinput.event.KeyEvent;

public class CocosKeyCodeHandler {
    private CocosAbilitySlice mAct;
    @SuppressWarnings("unused")
    public native void handleKeyDown(final int keyCode);
    @SuppressWarnings("unused")
    public native void handleKeyUp(final int keyCode);

    public CocosKeyCodeHandler(CocosAbilitySlice act) {
        mAct = act;
    }

    public boolean onKeyDown(final int keyCode, final KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEY_BACK:
//                CocosVideoHelper.mVideoHandler.sendEmptyMessage(CocosVideoHelper.KeyEventBack);
            case KeyEvent.KEY_MENU:
            case KeyEvent.KEY_DPAD_LEFT:
            case KeyEvent.KEY_DPAD_RIGHT:
            case KeyEvent.KEY_DPAD_UP:
            case KeyEvent.KEY_DPAD_DOWN:
            case KeyEvent.KEY_ENTER:
            case KeyEvent.KEY_MEDIA_PLAY_PAUSE:
            case KeyEvent.KEY_DPAD_CENTER:
                CocosHelper.runOnGameThreadAtForeground(() -> handleKeyDown(keyCode));
                return true;
            default:
                return false;
        }
    }

    public boolean onKeyUp(final int keyCode, KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEY_BACK:
            case KeyEvent.KEY_MENU:
            case KeyEvent.KEY_DPAD_LEFT:
            case KeyEvent.KEY_DPAD_RIGHT:
            case KeyEvent.KEY_DPAD_UP:
            case KeyEvent.KEY_DPAD_DOWN:
            case KeyEvent.KEY_ENTER:
            case KeyEvent.KEY_MEDIA_PLAY_PAUSE:
            case KeyEvent.KEY_DPAD_CENTER:
                CocosHelper.runOnGameThreadAtForeground(() -> handleKeyDown(keyCode));
                return true;
            default:
                return false;
        }
    }
}
