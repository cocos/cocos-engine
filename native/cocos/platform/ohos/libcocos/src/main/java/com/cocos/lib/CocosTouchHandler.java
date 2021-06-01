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


import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.multimodalinput.event.MmiPoint;
import ohos.multimodalinput.event.TouchEvent;

public class CocosTouchHandler {
    public final static HiLogLabel TAG = new HiLogLabel(HiLog.LOG_APP,0, "CocosTouchHandler");
    private boolean mStopHandleTouchAndKeyEvents = false;

    public CocosTouchHandler() {

    }

    boolean onTouchEvent(TouchEvent pMotionEvent) {
        // these data are used in ACTION_MOVE and ACTION_CANCEL
        final int pointerNumber = pMotionEvent.getPointerCount();
        final int[] ids = new int[pointerNumber];
        final float[] xs = new float[pointerNumber];
        final float[] ys = new float[pointerNumber];

        for (int i = 0; i < pointerNumber; i++) {
            ids[i] = pMotionEvent.getPointerId(i);
            MmiPoint pos = pMotionEvent.getPointerPosition(i);
            xs[i] = pos.getX();
            ys[i] = pos.getY();
        }

        int action = pMotionEvent.getAction();

        HiLog.debug(TAG, "Touch event: " + action);
        switch (action) {
            case TouchEvent.PRIMARY_POINT_DOWN:
            case TouchEvent.OTHER_POINT_DOWN:
                if (mStopHandleTouchAndKeyEvents) {
//                    Cocos2dxEditBox.complete();
                    return true;
                }

                final int indexPointerDown = pMotionEvent.getIndex();
                final int idPointerDown = pMotionEvent.getPointerId(indexPointerDown);
                MmiPoint pos = pMotionEvent.getPointerPosition(indexPointerDown);
                final float xPointerDown = pos.getX();
                final float yPointerDown = pos.getY();
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        handleActionDown(idPointerDown, xPointerDown, yPointerDown);
                    }
                });
                break;

            case TouchEvent.POINT_MOVE:
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        handleActionMove(ids, xs, ys);
                    }
                });

                break;

            case TouchEvent.PRIMARY_POINT_UP:
            case TouchEvent.OTHER_POINT_UP:

                final int indexPointUp = pMotionEvent.getIndex();
                final int idPointerUp = pMotionEvent.getPointerId(indexPointUp);
                MmiPoint posUP = pMotionEvent.getPointerPosition(indexPointUp);
                final float xPointerUp = posUP.getX();
                final float yPointerUp = posUP.getY();
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        handleActionUp(idPointerUp, xPointerUp, yPointerUp);
                    }
                });

                break;

            case TouchEvent.CANCEL:
                CocosHelper.runOnGameThread(new Runnable() {
                    @Override
                    public void run() {
                        handleActionCancel(ids, xs, ys);
                    }
                });
                break;
            default:
                HiLog.debug(TAG, "Unhandled touch event: " + action);
                break;
        }

        return true;
    }
    @SuppressWarnings("unused")
    public void setStopHandleTouchAndKeyEvents(boolean value) {
        mStopHandleTouchAndKeyEvents = value;
    }

    native void handleActionDown(final int id, final float x, final float y);

    native void handleActionMove(final int[] ids, final float[] xPointerList, final float[] yPointerList);

    native void handleActionUp(final int id, final float x, final float y);

    native void handleActionCancel(final int[] ids, final float[] xPointerList, final float[] yPointerList);

}
