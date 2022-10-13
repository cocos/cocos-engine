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

import android.util.Log;
import android.view.MotionEvent;
import android.view.Surface;
import android.view.SurfaceView;

public class CocosTouchHandler {
    public final static String TAG = "CocosTouchHandler";
    private boolean mStopHandleTouchAndKeyEvents = false;
    private int mWindowId;

    public CocosTouchHandler(int windowId) {
        mWindowId = windowId;
    }

    boolean onTouchEvent(MotionEvent pMotionEvent) {
        // these data are used in ACTION_MOVE and ACTION_CANCEL
        final int pointerNumber = pMotionEvent.getPointerCount();
        final int[] ids = new int[pointerNumber];
        final float[] xs = new float[pointerNumber];
        final float[] ys = new float[pointerNumber];

        for (int i = 0; i < pointerNumber; i++) {
            ids[i] = pMotionEvent.getPointerId(i);
            xs[i] = pMotionEvent.getX(i);
            ys[i] = pMotionEvent.getY(i);
        }

        switch (pMotionEvent.getAction() & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_POINTER_DOWN:
                if (mStopHandleTouchAndKeyEvents) {
//                    Cocos2dxEditBox.complete();
                    return true;
                }

                final int indexPointerDown = pMotionEvent.getAction() >> MotionEvent.ACTION_POINTER_INDEX_SHIFT;
                final int idPointerDown = pMotionEvent.getPointerId(indexPointerDown);
                final float xPointerDown = pMotionEvent.getX(indexPointerDown);
                final float yPointerDown = pMotionEvent.getY(indexPointerDown);
                CocosHelper.runOnGameThreadAtForeground(new Runnable() {
                    @Override
                    public void run() {
                        handleActionDown(mWindowId, idPointerDown, xPointerDown, yPointerDown);
                    }
                });
                break;

            case MotionEvent.ACTION_DOWN:
                if (mStopHandleTouchAndKeyEvents) {
//                    Cocos2dxEditBox.complete();
                    return true;
                }

                // there are only one finger on the screen
                final int idDown = pMotionEvent.getPointerId(0);
                final float xDown = xs[0];
                final float yDown = ys[0];

                CocosHelper.runOnGameThreadAtForeground(new Runnable() {
                    @Override
                    public void run() {
                        handleActionDown(mWindowId, idDown, xDown, yDown);
                    }
                });

                break;

            case MotionEvent.ACTION_MOVE:
                CocosHelper.runOnGameThreadAtForeground(new Runnable() {
                    @Override
                    public void run() {
                        handleActionMove(mWindowId, ids, xs, ys);
                    }
                });

                break;

            case MotionEvent.ACTION_POINTER_UP:
                final int indexPointUp = pMotionEvent.getAction() >> MotionEvent.ACTION_POINTER_INDEX_SHIFT;
                final int idPointerUp = pMotionEvent.getPointerId(indexPointUp);
                final float xPointerUp = pMotionEvent.getX(indexPointUp);
                final float yPointerUp = pMotionEvent.getY(indexPointUp);
                CocosHelper.runOnGameThreadAtForeground(new Runnable() {
                    @Override
                    public void run() {
                        handleActionUp(mWindowId, idPointerUp, xPointerUp, yPointerUp);
                    }
                });

                break;

            case MotionEvent.ACTION_UP:
                // there are only one finger on the screen
                final int idUp = pMotionEvent.getPointerId(0);
                final float xUp = xs[0];
                final float yUp = ys[0];
                CocosHelper.runOnGameThreadAtForeground(new Runnable() {
                    @Override
                    public void run() {
                        handleActionUp(mWindowId, idUp, xUp, yUp);
                    }
                });

                break;

            case MotionEvent.ACTION_CANCEL:
                CocosHelper.runOnGameThreadAtForeground(new Runnable() {
                    @Override
                    public void run() {
                        handleActionCancel(mWindowId, ids, xs, ys);
                    }
                });
                break;
        }

        if (BuildConfig.DEBUG) {
//            CocosTouchHandler.dumpMotionEvent(pMotionEvent);
        }
        return true;
    }

    public void setStopHandleTouchAndKeyEvents(boolean value) {
        mStopHandleTouchAndKeyEvents = value;
    }

    private static void dumpMotionEvent(final MotionEvent event) {
        final String names[] = {"DOWN", "UP", "MOVE", "CANCEL", "OUTSIDE", "POINTER_DOWN", "POINTER_UP", "7?", "8?", "9?"};
        final StringBuilder sb = new StringBuilder();
        final int action = event.getAction();
        final int actionCode = action & MotionEvent.ACTION_MASK;
        sb.append("event ACTION_").append(names[actionCode]);
        if (actionCode == MotionEvent.ACTION_POINTER_DOWN || actionCode == MotionEvent.ACTION_POINTER_UP) {
            sb.append("(pid ").append(action >> MotionEvent.ACTION_POINTER_INDEX_SHIFT);
            sb.append(")");
        }
        sb.append("[");
        for (int i = 0; i < event.getPointerCount(); i++) {
            sb.append("#").append(i);
            sb.append("(pid ").append(event.getPointerId(i));
            sb.append(")=").append((int) event.getX(i));
            sb.append(",").append((int) event.getY(i));
            if (i + 1 < event.getPointerCount()) {
                sb.append(";");
            }
        }
        sb.append("]");
        Log.d(TAG, sb.toString());
    }

    private native void handleActionDown(int windowId, final int id, final float x, final float y);

    private native void handleActionMove(int windowId, final int[] ids, final float[] xPointerList, final float[] yPointerList);

    private native void handleActionUp(int windowId, final int id, final float x, final float y);

    private native void handleActionCancel(int windowId, final int[] ids, final float[] xPointerList, final float[] yPointerList);

}
