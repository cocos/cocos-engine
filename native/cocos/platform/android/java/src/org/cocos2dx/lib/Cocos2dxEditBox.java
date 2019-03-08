/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
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
package org.cocos2dx.lib;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.StateListDrawable;
import android.graphics.drawable.shapes.RoundRectShape;
import android.text.Editable;
import android.text.InputFilter;
import android.text.InputType;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.TextView;

public class Cocos2dxEditBox {

    // a color of dark green, was used for confirm button background
    private static final int DARK_GREEN = Color.parseColor("#1fa014");
    private static final int DARK_GREEN_PRESS = Color.parseColor("#008e26");

    private static Cocos2dxEditBox sThis = null;
    private Cocos2dxEditText mEditText = null;
    private Button mButton = null;
    private String mButtonTitle = null;
    private boolean mConfirmHold = true;
    private Cocos2dxActivity mActivity = null;
    private RelativeLayout mButtonLayout = null;
    private RelativeLayout.LayoutParams mButtonParams;
    private int mEditTextID = 1;
    private int mButtonLayoutID = 2;

    /***************************************************************************************
     Inner class.
     **************************************************************************************/
    class Cocos2dxEditText extends EditText {
        private final String TAG = "Cocos2dxEditBox";
        private boolean mIsMultiLine = false;
        private TextWatcher mTextWatcher = null;
        private Paint mPaint;
        private int mLineColor = DARK_GREEN;
        private float mLineWidth = 2f;
        private boolean keyboardVisible = false;
        private int mScreenHeight;

        public  Cocos2dxEditText(Cocos2dxActivity context){
            super(context);
            //remove focus border
            this.setBackground(null);
            mScreenHeight = ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE)).
                    getDefaultDisplay().getHeight();
            mPaint = new Paint();
            mPaint.setStrokeWidth(mLineWidth);
            mPaint.setStyle(Paint.Style.FILL);
            mPaint.setColor(mLineColor);

            mTextWatcher = new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {

                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {

                }

                @Override
                public void afterTextChanged(Editable s) {
                    // Pass text to c++.
                    Cocos2dxEditBox.this.onKeyboardInput(s.toString());
                }
            };
            registKeyboardVisible();
        }

        /***************************************************************************************
         Override functions.
         **************************************************************************************/

        @Override
        protected void onDraw(Canvas canvas) {
            // draw the underline
            int padB = this.getPaddingBottom();
            canvas.drawLine(getScrollX(), this.getHeight() - padB / 2 - mLineWidth,
                    getScrollX() + this.getWidth(),
                    this.getHeight() - padB / 2 - mLineWidth, mPaint);
            super.onDraw(canvas);
        }

        /***************************************************************************************
         Public functions.
         **************************************************************************************/

        public void show(String defaultValue, int maxLength, boolean isMultiline, boolean confirmHold, String confirmType, String inputType) {
            mIsMultiLine = isMultiline;
            this.setFilters(new InputFilter[]{new InputFilter.LengthFilter(maxLength) });
            this.setText(defaultValue);
            if (this.getText().length() >= defaultValue.length()) {
                this.setSelection(defaultValue.length());
            } else {
                this.setSelection(this.getText().length());
            }
            this.setConfirmType(confirmType);
            this.setInputType(inputType, mIsMultiLine);
            this.setVisibility(View.VISIBLE);

            // Open soft keyboard manually. Should request focus to open soft keyboard.
            this.requestFocus();

            this.addListeners();
        }

        public void hide() {
            mEditText.setVisibility(View.INVISIBLE);
            this.removeListeners();
        }

        /***************************************************************************************
         Private functions.
         **************************************************************************************/

        private void setConfirmType(final String confirmType) {
            if (confirmType.contentEquals("done")) {
                this.setImeOptions(EditorInfo.IME_ACTION_DONE | EditorInfo.IME_FLAG_NO_EXTRACT_UI);
                mButtonTitle = mActivity.getResources().getString(R.string.done);
            } else if (confirmType.contentEquals("next")) {
                this.setImeOptions(EditorInfo.IME_ACTION_NEXT | EditorInfo.IME_FLAG_NO_EXTRACT_UI);
                mButtonTitle = mActivity.getResources().getString(R.string.next);
            } else if (confirmType.contentEquals("search")) {
                this.setImeOptions(EditorInfo.IME_ACTION_SEARCH | EditorInfo.IME_FLAG_NO_EXTRACT_UI);
                mButtonTitle = mActivity.getResources().getString(R.string.search);
            } else if (confirmType.contentEquals("go")) {
                this.setImeOptions(EditorInfo.IME_ACTION_GO | EditorInfo.IME_FLAG_NO_EXTRACT_UI);
                mButtonTitle = mActivity.getResources().getString(R.string.go);
            } else if (confirmType.contentEquals("send")) {
                this.setImeOptions(EditorInfo.IME_ACTION_SEND | EditorInfo.IME_FLAG_NO_EXTRACT_UI);
                mButtonTitle = mActivity.getResources().getString(R.string.send);
            } else{
                mButtonTitle = null;
                Log.e(TAG, "unknown confirm type " + confirmType);
            }
        }

        private void setInputType(final String inputType, boolean isMultiLine){
            if (inputType.contentEquals("text")) {
                if (isMultiLine)
                    this.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_MULTI_LINE);
                else
                    this.setInputType(InputType.TYPE_CLASS_TEXT);
            }
            else if (inputType.contentEquals("email"))
                this.setInputType(InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
            else if (inputType.contentEquals("number"))
                this.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL | InputType.TYPE_NUMBER_FLAG_SIGNED);
            else if (inputType.contentEquals("phone"))
                this.setInputType(InputType.TYPE_CLASS_PHONE);
            else if (inputType.contentEquals("password"))
                this.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            else
                Log.e(TAG, "unknown input type " + inputType);
        }

        private void addListeners() {

            this.setOnEditorActionListener(new TextView.OnEditorActionListener() {
                @Override
                public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                    if (! mIsMultiLine) {
                        Cocos2dxEditBox.this.hide();
                    }

                    return false; // pass on to other listeners.
                }
            });


            this.addTextChangedListener(mTextWatcher);
        }

        private void removeListeners() {
            this.setOnEditorActionListener(null);
            this.removeTextChangedListener(mTextWatcher);
        }

        private void registKeyboardVisible() {
            getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                @Override
                public void onGlobalLayout() {
                    Rect r = new Rect();
                    getWindowVisibleDisplayFrame(r);
                    int heightDiff = getRootView().getHeight() - (r.bottom - r.top);
                    // if more than a quarter of the screen, its probably a keyboard
                    if (heightDiff > mScreenHeight/4) {
                        if (!keyboardVisible) {
                            keyboardVisible = true;
                        }
                    } else {
                        if (keyboardVisible) {
                            keyboardVisible = false;
                            Cocos2dxEditBox.this.hide();
                        }
                    }
                }
            });
        }
    }

    public Cocos2dxEditBox(Cocos2dxActivity context, RelativeLayout layout) {
        Cocos2dxEditBox.sThis = this;
        mActivity = context;
        this.addItems(context, layout);
    }

    /***************************************************************************************
     Public functions.
     **************************************************************************************/

    // Invoked by surface view to send a complete message to CPP.
    public static void complete() {
        Cocos2dxEditBox.sThis.hide();
    }

    /***************************************************************************************
     Private functions.
     **************************************************************************************/
    private void addItems(Cocos2dxActivity context, RelativeLayout layout) {
        RelativeLayout myLayout = new RelativeLayout(context);
        this.addEditText(context, myLayout);
        this.addButton(context, myLayout);

        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        layout.addView(myLayout, layoutParams);

        //FXI ME: Is it needed?
        // When touch area outside EditText and soft keyboard, then hide.
//        layout.setOnTouchListener(new View.OnTouchListener() {
//            @Override
//            public boolean onTouch(View v, MotionEvent event) {
//                Cocos2dxEditBox.this.hide();
//                return true;
//            }
//
//        });
    }

    private void addEditText(Cocos2dxActivity context, RelativeLayout layout) {
        mEditText = new Cocos2dxEditText(context);
        mEditText.setVisibility(View.INVISIBLE);
        mEditText.setBackgroundColor(Color.WHITE);
        mEditText.setId(mEditTextID);
        RelativeLayout.LayoutParams editParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.FILL_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        editParams.addRule(RelativeLayout.LEFT_OF, mButtonLayoutID);
        layout.addView(mEditText, editParams);
    }

    private void addButton(Cocos2dxActivity context, RelativeLayout layout) {
        mButton = new Button(context);
        mButtonParams = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        mButton.setTextColor(Color.WHITE);
        mButton.setBackground(getRoundRectShape());
        mButtonLayout = new RelativeLayout(Cocos2dxHelper.getActivity());
        mButtonLayout.setVisibility(View.INVISIBLE);
        mButtonLayout.setBackgroundColor(Color.WHITE);
        RelativeLayout.LayoutParams buttonLayoutParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        buttonLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
        buttonLayoutParams.addRule(RelativeLayout.ALIGN_BOTTOM, mEditTextID);
        buttonLayoutParams.addRule(RelativeLayout.ALIGN_TOP, mEditTextID);
        mButtonLayout.addView(mButton, mButtonParams);
        mButtonLayout.setId(mButtonLayoutID);
        layout.addView(mButtonLayout, buttonLayoutParams);

        mButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Cocos2dxEditBox.this.onKeyboardConfirm(mEditText.getText().toString());

                if (!Cocos2dxEditBox.this.mConfirmHold)
                    Cocos2dxEditBox.this.hide();
            }
        });
    }

    private Drawable getRoundRectShape() {
        int radius = 7;
        float[] outerRadii = new float[]{radius, radius, radius, radius, radius, radius, radius, radius};
        RoundRectShape roundRectShape = new RoundRectShape(outerRadii, null, null);
        ShapeDrawable shapeDrawableNormal = new ShapeDrawable();
        shapeDrawableNormal.setShape(roundRectShape);
        shapeDrawableNormal.getPaint().setStyle(Paint.Style.FILL);
        shapeDrawableNormal.getPaint().setColor(DARK_GREEN);
        ShapeDrawable shapeDrawablePress = new ShapeDrawable();
        shapeDrawablePress.setShape(roundRectShape);
        shapeDrawablePress.getPaint().setStyle(Paint.Style.FILL);
        shapeDrawablePress.getPaint().setColor(DARK_GREEN_PRESS);
        StateListDrawable drawable = new StateListDrawable();
        drawable.addState(new int[]{android.R.attr.state_pressed}, shapeDrawablePress);
        drawable.addState(new int[]{}, shapeDrawableNormal);
        return drawable;
    }


    private void hide() {
        Utils.hideVirtualButton();
        mEditText.hide();
        mButtonLayout.setVisibility(View.INVISIBLE);
        this.closeKeyboard();

        mActivity.getGLSurfaceView().requestFocus();
        mActivity.getGLSurfaceView().setStopHandleTouchAndKeyEvents(false);
    }

    private void show(String defaultValue, int maxLength, boolean isMultiline, boolean confirmHold, String confirmType, String inputType) {
        mConfirmHold = confirmHold;
        mEditText.show(defaultValue, maxLength, isMultiline, confirmHold, confirmType, inputType);
        int editPaddingBottom = mEditText.getPaddingBottom();
        int editPadding = mEditText.getPaddingTop();
        mEditText.setPadding(editPadding, editPadding, editPadding, editPaddingBottom);
        mButton.setText(mButtonTitle);
        if (TextUtils.isEmpty(mButtonTitle)) {
            mButton.setPadding(0, 0, 0, 0);
            mButtonParams.setMargins(0, 0, 0, 0);
            mButtonLayout.setVisibility(View.INVISIBLE);
        } else {
            int buttonTextPadding = mEditText.getPaddingBottom() / 2;
            mButton.setPadding(editPadding, buttonTextPadding, editPadding, buttonTextPadding);
            mButtonParams.setMargins(0, buttonTextPadding, 2, 0);
            mButtonLayout.setVisibility(View.VISIBLE);
        }
        mActivity.getGLSurfaceView().setStopHandleTouchAndKeyEvents(true);
        this.openKeyboard();
    }

    private void closeKeyboard() {
        InputMethodManager imm = (InputMethodManager) Cocos2dxEditBox.this.mActivity.getSystemService(Cocos2dxEditBox.this.mActivity.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(mEditText.getWindowToken(), 0);

        this.onKeyboardComplete(mEditText.getText().toString());
    }

    private void openKeyboard() {
        InputMethodManager imm = (InputMethodManager) Cocos2dxEditBox.this.mActivity.getSystemService(Cocos2dxEditBox.this.mActivity.INPUT_METHOD_SERVICE);
        imm.showSoftInput(mEditText, InputMethodManager.SHOW_IMPLICIT);
    }

    /***************************************************************************************
     Functions invoked by CPP.
     **************************************************************************************/

    private static void showNative(String defaultValue, int maxLength, boolean isMultiline, boolean confirmHold, String confirmType, String inputType) {
        if (null != Cocos2dxEditBox.sThis) {
            Cocos2dxEditBox.sThis.mActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxEditBox.sThis.show(defaultValue, maxLength, isMultiline, confirmHold, confirmType, inputType);
                }
            });
        }
    }

    private static void hideNative() {
        if (null != Cocos2dxEditBox.sThis) {
            Cocos2dxEditBox.sThis.mActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxEditBox.sThis.hide();
                }
            });
        }
    }

    /***************************************************************************************
     Native functions invoked by UI.
     **************************************************************************************/
    private void onKeyboardInput(String text) {
        mActivity.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox.onKeyboardInputNative(text);
            }
        });
    }

    private void onKeyboardComplete(String text) {
        mActivity.getGLSurfaceView().requestFocus();
        mActivity.getGLSurfaceView().setStopHandleTouchAndKeyEvents(false);
        mActivity.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox.onKeyboardCompleteNative(text);
            }
        });
    }

    private void onKeyboardConfirm(String text) {
        mActivity.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox.onKeyboardConfirmNative(text);
            }
        });
    }

    private static native void onKeyboardInputNative(String text);
    private static native void onKeyboardCompleteNative(String text);
    private static native void onKeyboardConfirmNative(String text);
}
