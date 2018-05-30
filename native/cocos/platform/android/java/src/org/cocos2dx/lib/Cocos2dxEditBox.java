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

import android.graphics.Color;
import android.text.Editable;
import android.text.InputFilter;
import android.text.InputType;
import android.text.TextWatcher;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.graphics.drawable.GradientDrawable;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Button;
import android.view.inputmethod.InputMethodManager;

public class Cocos2dxEditBox {
    private static Cocos2dxEditBox sThis = null;
    private Cocos2dxEditText mEditText = null;
    private Button mButton = null;
    private boolean mConfirmHold = true;
    private Cocos2dxActivity mActivity = null;

    /***************************************************************************************
     Inner class.
     **************************************************************************************/
    class Cocos2dxEditText extends EditText {
        private final String TAG = "Cocos2dxEditBox";
        private boolean mIsMultiLine = false;
        private TextWatcher mTextWatcher = null;

        public  Cocos2dxEditText(Cocos2dxActivity context){
            super(context);
            this.removeFocusBorder();

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
        }

        /***************************************************************************************
         Override functions.
         **************************************************************************************/

        @Override
        public boolean onKeyPreIme(int keyCode, KeyEvent event) {
            switch (keyCode) {
                case KeyEvent.KEYCODE_BACK:
                    Cocos2dxEditBox.this.hide();
                    return true;
                default:
                    return super.onKeyPreIme(keyCode, event);
            }
        }

        /***************************************************************************************
         Other member functions.
         **************************************************************************************/

        public void show(String defaultValue, int maxLength, boolean isMultiline, boolean confirmHold, String confirmType, String inputType) {
            mIsMultiLine = isMultiline;
            this.setText(defaultValue);
            this.setFilters(new InputFilter[]{new InputFilter.LengthFilter(maxLength) });
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
            if (confirmType.contentEquals("done"))
                this.setImeOptions(EditorInfo.IME_ACTION_DONE | EditorInfo.IME_FLAG_NO_EXTRACT_UI);
            else if (confirmType.contentEquals("next"))
                this.setImeOptions(EditorInfo.IME_ACTION_NEXT | EditorInfo.IME_FLAG_NO_EXTRACT_UI);
            else if (confirmType.contentEquals("search"))
                this.setImeOptions(EditorInfo.IME_ACTION_SEARCH | EditorInfo.IME_FLAG_NO_EXTRACT_UI);
            else if (confirmType.contentEquals("go"))
                this.setImeOptions(EditorInfo.IME_ACTION_GO | EditorInfo.IME_FLAG_NO_EXTRACT_UI);
            else if (confirmType.contentEquals("send"))
                this.setImeOptions(EditorInfo.IME_ACTION_SEND | EditorInfo.IME_FLAG_NO_EXTRACT_UI);
            else
                Log.e(TAG, "unknown confirm type " + confirmType);
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
                this.setInputType(InputType.TYPE_CLASS_NUMBER);
            else if (inputType.contentEquals("phone"))
                this.setInputType(InputType.TYPE_CLASS_PHONE);
            else if (inputType.contentEquals("password"))
                this.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            else
                Log.e(TAG, "unknown input type " + inputType);
        }

        private void removeFocusBorder() {
            GradientDrawable shape = new GradientDrawable();
            shape.setShape(GradientDrawable.RECTANGLE);
            shape.setStroke(1, Color.BLACK);
            shape.setColor(Color.WHITE);
            this.setBackground(shape);
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
    }

    public Cocos2dxEditBox(Cocos2dxActivity context, RelativeLayout layout) {
        Cocos2dxEditBox.sThis = this;
        mActivity = context;
        this.addItems(context, layout);
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
        layout.addView(mEditText, new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.FILL_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
    }

    private void addButton(Cocos2dxActivity context, RelativeLayout layout) {
        mButton = new Button(context);
        mButton.setVisibility(View.INVISIBLE);
        RelativeLayout.LayoutParams buttonParams = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        buttonParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
        mButton.setBackgroundColor(Color.GREEN);
        layout.addView(mButton, buttonParams);

        mButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Cocos2dxEditBox.this.onKeyboardConfirm(mEditText.getText().toString());

                if (!Cocos2dxEditBox.this.mConfirmHold)
                    Cocos2dxEditBox.this.hide();
            }
        });
    }

    private void hide() {
        Utils.hideVirtualButton();
        mEditText.hide();
        mButton.setVisibility(View.INVISIBLE);
        this.closeKeyboard();

        mActivity.getGLSurfaceView().requestFocus();
        mActivity.getGLSurfaceView().setStopHandleTouchAndKeyEvents(false);
    }

    private void show(String defaultValue, int maxLength, boolean isMultiline, boolean confirmHold, String confirmType, String inputType) {
        mConfirmHold = confirmHold;
        mButton.setText(confirmType);
        mButton.setVisibility(View.VISIBLE);
        mEditText.show(defaultValue, maxLength, isMultiline, confirmHold, confirmType, inputType);
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
