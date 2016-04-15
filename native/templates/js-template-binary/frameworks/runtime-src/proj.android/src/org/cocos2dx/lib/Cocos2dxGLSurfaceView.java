/****************************************************************************
Copyright (c) 2010-2013 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.

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
import android.content.Context;
import android.opengl.GLSurfaceView;
import android.os.Handler;
import android.os.Message;
import android.util.AttributeSet;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;

public class Cocos2dxGLSurfaceView extends GLSurfaceView {
    // ===========================================================
    // Constants
    // ===========================================================

    private static final String TAG = "Cocos2dxGLSurfaceView";

    private final static int HANDLER_OPEN_IME_KEYBOARD = 2;
    private final static int HANDLER_CLOSE_IME_KEYBOARD = 3;

    // ===========================================================
    // Fields
    // ===========================================================
    private static IMEHandler sIMEHandler;
    private static Cocos2dxGLSurfaceView sGLSurfaceView;
    private static Cocos2dxTextInputWrapper sTextInputWrapper;

    private Cocos2dxRenderer mCocosRenderer;
    private Cocos2dxEditBox mCocosEditText;
    private boolean mSoftKeyboardShown = false;

    public boolean isSoftKeyboardShown() {
        return mSoftKeyboardShown;
    }

    public void setSoftKeyboardShown(boolean softKeyboardShown) {
        mSoftKeyboardShown = softKeyboardShown;
    }

    // ===========================================================
    // Constructors
    // ===========================================================

    public Cocos2dxGLSurfaceView(final Context context) {
        super(context);
        initView();
    }

    public Cocos2dxGLSurfaceView(final Context context, final AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    static class IMEHandler extends Handler {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case HANDLER_OPEN_IME_KEYBOARD:
                    if (null != sGLSurfaceView.mCocosEditText && sGLSurfaceView.mCocosEditText.requestFocus()) {
                        sGLSurfaceView.mCocosEditText.removeTextChangedListener(Cocos2dxGLSurfaceView.sTextInputWrapper);
                        sGLSurfaceView.mCocosEditText.setText("");
                        final String text = (String) msg.obj;
                        sGLSurfaceView.mCocosEditText.append(text);
                        Cocos2dxGLSurfaceView.sTextInputWrapper.setOriginText(text);
                        sGLSurfaceView.mCocosEditText.addTextChangedListener(Cocos2dxGLSurfaceView.sTextInputWrapper);

                        InputMethodManager imm = (InputMethodManager) Cocos2dxActivity.COCOS_ACTIVITY.getSystemService(Context.INPUT_METHOD_SERVICE);
                        imm.showSoftInput(sGLSurfaceView.mCocosEditText, 0);
                        Log.d(TAG, "showSoftInput");
                    }
                    break;

                case HANDLER_CLOSE_IME_KEYBOARD:
                    if (null != sGLSurfaceView.mCocosEditText) {
                        sGLSurfaceView.mCocosEditText.removeTextChangedListener(Cocos2dxGLSurfaceView.sTextInputWrapper);
                        InputMethodManager imm = (InputMethodManager) Cocos2dxActivity.COCOS_ACTIVITY.getSystemService(Context.INPUT_METHOD_SERVICE);
                        imm.hideSoftInputFromWindow(sGLSurfaceView.mCocosEditText.getWindowToken(), 0);
                        sGLSurfaceView.requestFocus();
                        Log.d(TAG, "HideSoftInput");
                    }
                    break;
            }
        }
    }

    protected void initView() {
        setEGLContextClientVersion(2);
        setFocusableInTouchMode(true);

        sGLSurfaceView = this;
        sTextInputWrapper = new Cocos2dxTextInputWrapper(this);
        sIMEHandler = new IMEHandler();
    }

    // ===========================================================
    // Getter & Setter
    // ===========================================================
    public static Cocos2dxGLSurfaceView getInstance() {
        return sGLSurfaceView;
    }

    public static void queueAccelerometer(final float x, final float y, final float z, final long timestamp) {
        sGLSurfaceView.queueEvent(new Runnable() {
            @Override
            public void run() {
                Cocos2dxAccelerometer.onSensorChanged(x, y, z, timestamp);
        }
        });
    }

    public void setCocos2dxRenderer(final Cocos2dxRenderer renderer) {
        mCocosRenderer = renderer;
        setRenderer(mCocosRenderer);
    }

    public Cocos2dxRenderer getCocos2dxRenderer() {
        return mCocosRenderer;
    }

    private String getContentText() {
        return mCocosRenderer.getContentText();
    }

    public Cocos2dxEditBox getCocos2dxEditText() {
        return mCocosEditText;
    }

    public void setCocos2dxEditText(final Cocos2dxEditBox cocos2dxEditText) {
        mCocosEditText = cocos2dxEditText;
        if (null != mCocosEditText && null != sTextInputWrapper) {
            mCocosEditText.setOnEditorActionListener(sTextInputWrapper);
            requestFocus();
        }
    }

    // ===========================================================
    // Methods for/from SuperClass/Interfaces
    // ===========================================================

    @Override
    public void onResume() {
        super.onResume();
        setRenderMode(RENDERMODE_CONTINUOUSLY);
        queueEvent(new Runnable() {
            @Override
            public void run() {
                sGLSurfaceView.mCocosRenderer.handleOnResume();
            }
        });
    }

    @Override
    public void onPause() {
        queueEvent(new Runnable() {
            @Override
            public void run() {
                sGLSurfaceView.mCocosRenderer.handleOnPause();
            }
        });
        setRenderMode(RENDERMODE_WHEN_DIRTY);
        //super.onPause();
    }

    @Override
    public boolean onTouchEvent(final MotionEvent pMotionEvent) {
        // these data are used in ACTION_MOVE and ACTION_CANCEL
        final int pointerNumber = pMotionEvent.getPointerCount();
        final int[] ids = new int[pointerNumber];
        final float[] xs = new float[pointerNumber];
        final float[] ys = new float[pointerNumber];

        if (mSoftKeyboardShown){
            InputMethodManager imm = (InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
            View view = ((Activity)getContext()).getCurrentFocus();
            if (view != null)
                imm.hideSoftInputFromWindow(view.getWindowToken(),0);
            requestFocus();
            mSoftKeyboardShown = false;
        }

        for (int i = 0; i < pointerNumber; i++) {
            ids[i] = pMotionEvent.getPointerId(i);
            xs[i] = pMotionEvent.getX(i);
            ys[i] = pMotionEvent.getY(i);
        }

        switch (pMotionEvent.getAction() & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_POINTER_DOWN:
                final int indexPointerDown = pMotionEvent.getAction() >> MotionEvent.ACTION_POINTER_INDEX_SHIFT;
                final int idPointerDown = pMotionEvent.getPointerId(indexPointerDown);
                final float xPointerDown = pMotionEvent.getX(indexPointerDown);
                final float yPointerDown = pMotionEvent.getY(indexPointerDown);

                this.queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        sGLSurfaceView.mCocosRenderer.handleActionDown(idPointerDown, xPointerDown, yPointerDown);
                    }
                });
                break;

            case MotionEvent.ACTION_DOWN:
                // there are only one finger on the screen
                final int idDown = pMotionEvent.getPointerId(0);
                final float xDown = xs[0];
                final float yDown = ys[0];

                this.queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        sGLSurfaceView.mCocosRenderer.handleActionDown(idDown, xDown, yDown);
                    }
                });
                break;

            case MotionEvent.ACTION_MOVE:
                this.queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        sGLSurfaceView.mCocosRenderer.handleActionMove(ids, xs, ys);
                    }
                });
                break;

            case MotionEvent.ACTION_POINTER_UP:
                final int indexPointUp = pMotionEvent.getAction() >> MotionEvent.ACTION_POINTER_INDEX_SHIFT;
                final int idPointerUp = pMotionEvent.getPointerId(indexPointUp);
                final float xPointerUp = pMotionEvent.getX(indexPointUp);
                final float yPointerUp = pMotionEvent.getY(indexPointUp);

                this.queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        sGLSurfaceView.mCocosRenderer.handleActionUp(idPointerUp, xPointerUp, yPointerUp);
                    }
                });
                break;

            case MotionEvent.ACTION_UP:
                // there are only one finger on the screen
                final int idUp = pMotionEvent.getPointerId(0);
                final float xUp = xs[0];
                final float yUp = ys[0];

                this.queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        sGLSurfaceView.mCocosRenderer.handleActionUp(idUp, xUp, yUp);
                    }
                });
                break;

            case MotionEvent.ACTION_CANCEL:
                this.queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        sGLSurfaceView.mCocosRenderer.handleActionCancel(ids, xs, ys);
                    }
                });
                break;
        }

        return true;
    }

    /*
     * This function is called before Cocos2dxRenderer.nativeInit(), so the
     * width and height is correct.
     */
    @Override
    protected void onSizeChanged(final int pNewSurfaceWidth, final int pNewSurfaceHeight, final int pOldSurfaceWidth, final int pOldSurfaceHeight) {
        if(!isInEditMode()) {
            mCocosRenderer.setScreenWidthAndHeight(pNewSurfaceWidth, pNewSurfaceHeight);
        }
    }

    @Override
    public boolean onKeyDown(final int pKeyCode, final KeyEvent pKeyEvent) {
        switch (pKeyCode) {
            case KeyEvent.KEYCODE_BACK:
                Cocos2dxVideoHelper.sVideoHandler.sendEmptyMessage(Cocos2dxVideoHelper.KeyEventBack);
            case KeyEvent.KEYCODE_MENU:
            case KeyEvent.KEYCODE_DPAD_LEFT:
            case KeyEvent.KEYCODE_DPAD_RIGHT:
            case KeyEvent.KEYCODE_DPAD_UP:
            case KeyEvent.KEYCODE_DPAD_DOWN:
            case KeyEvent.KEYCODE_ENTER:
            case KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE:
            case KeyEvent.KEYCODE_DPAD_CENTER:
                this.queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        sGLSurfaceView.mCocosRenderer.handleKeyDown(pKeyCode);
                    }
                });
                return true;
            default:
                return super.onKeyDown(pKeyCode, pKeyEvent);
        }
    }

    @Override
    public boolean onKeyUp(final int keyCode, KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEYCODE_BACK:
            case KeyEvent.KEYCODE_MENU:
            case KeyEvent.KEYCODE_DPAD_LEFT:
            case KeyEvent.KEYCODE_DPAD_RIGHT:
            case KeyEvent.KEYCODE_DPAD_UP:
            case KeyEvent.KEYCODE_DPAD_DOWN:
            case KeyEvent.KEYCODE_ENTER:
            case KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE:
            case KeyEvent.KEYCODE_DPAD_CENTER:
                this.queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        sGLSurfaceView.mCocosRenderer.handleKeyUp(keyCode);
                    }
                });
                return true;
            default:
                return super.onKeyUp(keyCode, event);
        }
    }

    // ===========================================================
    // Inner and Anonymous Classes
    // ===========================================================

    public static void openIMEKeyboard() {
        Message msg = Message.obtain();
        msg.what = HANDLER_OPEN_IME_KEYBOARD;
        msg.obj = sGLSurfaceView.getContentText();
        sIMEHandler.sendMessage(msg);
    }

    public static void closeIMEKeyboard() {
        Message msg = Message.obtain();
        msg.what = HANDLER_CLOSE_IME_KEYBOARD;
        sIMEHandler.sendMessage(msg);
    }

    public void insertText(final String text) {
        this.queueEvent(new Runnable() {
            @Override
            public void run() {
                sGLSurfaceView.mCocosRenderer.handleInsertText(text);
            }
        });
    }

    public void deleteBackward() {
        this.queueEvent(new Runnable() {
            @Override
            public void run() {
                sGLSurfaceView.mCocosRenderer.handleDeleteBackward();
            }
        });
    }
}

