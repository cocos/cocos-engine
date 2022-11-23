/****************************************************************************
 * Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.
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

package com.cocos.lib;

import android.content.Context;
import android.util.Log;
import android.view.MotionEvent;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

public class CocosSurfaceView extends SurfaceView implements android.view.SurfaceHolder.Callback2 {
    private CocosTouchHandler mTouchHandler;
    private long mNativeHandle;
    private int mWindowId;

    public CocosSurfaceView(Context context, int windowId) {
        super(context);
        mWindowId = windowId;
        mNativeHandle = constructNative(windowId);
        mTouchHandler = new CocosTouchHandler(mWindowId);
        getHolder().addCallback(this);
    }

    private native long constructNative(int windowId);
    private native void destructNative(long handle);
    private native void onSizeChangedNative(int windowId, int width, final int height);
    private native void onSurfaceRedrawNeededNative(long handle);
    private native void onSurfaceCreatedNative(long handle, Surface surface);
    private native void onSurfaceChangedNative(long handle, Surface surface, int format, int width, int height);
    private native void onSurfaceDestroyedNative(long handle);


    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        CocosHelper.runOnGameThreadAtForeground(new Runnable() {
            @Override
            public void run() {
                onSizeChangedNative(mWindowId, w, h);
            }
        });
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        return mTouchHandler.onTouchEvent(event);
    }

    @Override
    public void surfaceRedrawNeeded(SurfaceHolder holder) {
        onSurfaceRedrawNeededNative(mNativeHandle);
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        onSurfaceCreatedNative(mNativeHandle, holder.getSurface());
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        onSurfaceChangedNative(mNativeHandle, holder.getSurface(), format, width, height);
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        onSurfaceDestroyedNative(mNativeHandle);
    }

    @Override
    protected void finalize() throws Throwable {
        super.finalize();
        destructNative(mNativeHandle);
        mNativeHandle = 0;
    }

}
