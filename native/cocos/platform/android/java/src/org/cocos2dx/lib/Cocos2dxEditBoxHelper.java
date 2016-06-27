/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
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

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Looper;
import android.renderscript.Type;
import android.text.Editable;
import android.text.InputType;
import android.text.TextWatcher;
import android.util.Log;
import android.util.SparseArray;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.FrameLayout;
import android.widget.TextView;

public class Cocos2dxEditBoxHelper {
    private static final String TAG = "Cocos2dxEditBoxHelper";

    private static SparseArray<Cocos2dxEditBox> sEditBoxArray = null;
    private static int sViewTag = 0;

    static void reset() {
        if (sEditBoxArray != null) {
            sEditBoxArray.clear();
            sEditBoxArray = null;
            sViewTag = 0;
        }
    }

    //Call native methods
    private static native void editBoxEditingDidBegin(int index);
    public static void __editBoxEditingDidBegin(int index){
        editBoxEditingDidBegin(index);
    }

    private static native void editBoxEditingChanged(int index, String text);
    public static void __editBoxEditingChanged(int index, String text){
        editBoxEditingChanged(index, text);
    }

    private static native void editBoxEditingDidEnd(int index, String text);
    public static void __editBoxEditingDidEnd(int index, String text){
        editBoxEditingDidEnd(index, text);
    }

    public Cocos2dxEditBoxHelper() {
        sEditBoxArray = new SparseArray<Cocos2dxEditBox>();
    }

    public static int convertToSP(float point){
        Resources r = Cocos2dxActivity.COCOS_ACTIVITY.getResources();

        int convertedValue = (int)TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_SP, point, r.getDisplayMetrics());

        return  convertedValue;

    }

    public static int createEditBox(final int left, final int top, final int width, final int height, final float scaleX) {
        final int index = sViewTag;
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final Cocos2dxEditBox editBox = new Cocos2dxEditBox(Cocos2dxActivity.COCOS_ACTIVITY);
                editBox.setFocusable(true);
                editBox.setFocusableInTouchMode(true);
                editBox.setInputFlag(5); //kEditBoxInputFlagLowercaseAllCharacters
                editBox.setInputMode(6); //kEditBoxInputModeSingleLine
                editBox.setReturnType(0);  //kKeyboardReturnTypeDefault
                editBox.setHintTextColor(Color.GRAY);
                editBox.setVisibility(View.INVISIBLE);
                editBox.setBackgroundColor(Color.TRANSPARENT);
                editBox.setTextColor(Color.WHITE);
                editBox.setSingleLine();
                editBox.setOpenGLViewScaleX(scaleX);
                Resources r = Cocos2dxActivity.COCOS_ACTIVITY.getResources();
                float density =  r.getDisplayMetrics().density;
                int paddingBottom = (int)(height * 0.33f / density);
                paddingBottom = convertToSP(paddingBottom  - 5 * scaleX / density);
                paddingBottom = paddingBottom / 2;
                int paddingTop = paddingBottom;
                int paddingLeft = (int)(5 * scaleX / density);
                paddingLeft = convertToSP(paddingLeft);

                editBox.setPadding(paddingLeft,paddingTop, 0, paddingBottom);

                FrameLayout.LayoutParams lParams = new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.WRAP_CONTENT,
                        FrameLayout.LayoutParams.WRAP_CONTENT);

                lParams.leftMargin = left;
                lParams.topMargin = top;
                lParams.width = width;
                lParams.height = height;
                lParams.gravity = Gravity.TOP | Gravity.LEFT;

                Cocos2dxActivity.ROOT_LAYOUT.addView(editBox, lParams);

                editBox.addTextChangedListener(new TextWatcher() {
                    @Override
                    public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                    }

                    @Override
                    public void onTextChanged(final CharSequence s, int start, int before, int count) {
                        //The optimization can't be turn on due to unknown keyboard hide in some custom keyboard
//                        Cocos2dxActivity.ROOT_LAYOUT.setEnableForceDoLayout(false);

                        Cocos2dxActivity.COCOS_ACTIVITY.runOnGLThread(new Runnable() {
                            @Override
                            public void run() {
                                Cocos2dxEditBoxHelper.__editBoxEditingChanged(index, s.toString());
                            }
                        });
                    }

                    @Override
                    public void afterTextChanged(Editable s) {

                    }

                });


                editBox.setOnFocusChangeListener(new View.OnFocusChangeListener() {

                    @Override
                    public void onFocusChange(View v, boolean hasFocus) {
                        if (hasFocus) {
                            Cocos2dxActivity.COCOS_ACTIVITY.runOnGLThread(new Runnable() {
                                @Override
                                public void run() {
                                    Cocos2dxEditBoxHelper.__editBoxEditingDidBegin(index);
                                }
                            });
                            editBox.setSelection(editBox.getText().length());
                            Cocos2dxActivity.ROOT_LAYOUT.setEnableForceDoLayout(true);
                            Cocos2dxActivity.COCOS_ACTIVITY.getGLSurfaceView().setSoftKeyboardShown(true);
                            Log.d(TAG, "edit box get focus");
                        } else {
                            editBox.setVisibility(View.GONE);
                            Cocos2dxActivity.COCOS_ACTIVITY.runOnGLThread(new Runnable() {
                                @Override
                                public void run() {
                                    Cocos2dxEditBoxHelper.__editBoxEditingDidEnd(index, editBox.getText().toString());
                                }
                            });
                            Cocos2dxActivity.ROOT_LAYOUT.setEnableForceDoLayout(false);
                            Log.d(TAG, "edit box lose focus");
                        }
                    }
                });

                editBox.setOnKeyListener(new View.OnKeyListener() {
                    public boolean onKey(View v, int keyCode, KeyEvent event) {
                        // If the event is a key-down event on the "enter" button
                        if ((event.getAction() == KeyEvent.ACTION_DOWN) &&
                                (keyCode == KeyEvent.KEYCODE_ENTER)) {
                            //if editbox doesn't support multiline, just hide the keyboard
                            if ((editBox.getInputType() & InputType.TYPE_TEXT_FLAG_MULTI_LINE) != InputType.TYPE_TEXT_FLAG_MULTI_LINE) {
                                Cocos2dxEditBoxHelper.closeKeyboardOnUiThread(index);
                                return true;
                            }
                        }
                        return false;
                    }
                });


                editBox.setOnEditorActionListener(new TextView.OnEditorActionListener() {
                    @Override
                    public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                        if (actionId == EditorInfo.IME_ACTION_DONE) {
                            Cocos2dxEditBoxHelper.closeKeyboardOnUiThread(index);
                        }
                        return false;
                    }
                });

                sEditBoxArray.put(index, editBox);
            }
        });
        return sViewTag++;
    }

    public static void removeEditBox(final int index) {
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    sEditBoxArray.remove(index);
                    Cocos2dxActivity.ROOT_LAYOUT.removeView(editBox);
                }
            }
        });
    }

    public static void setFont(final int index, final String fontName, final float fontSize){
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    Typeface tf;
                    if (!fontName.isEmpty()) {
                        if (fontName.endsWith(".ttf")) {
                            try {
                                tf = Cocos2dxTypefaces.get(Cocos2dxActivity.COCOS_ACTIVITY.getContext(), fontName);
                            } catch (final Exception e) {
                                Log.e("Cocos2dxEditBoxHelper", "error to create ttf type face: " + fontName);
                                tf = Typeface.create(fontName, Typeface.NORMAL);
                            }
                        }
                        tf  =  Typeface.create(fontName, Typeface.NORMAL);
                    }else{
                        tf = Typeface.DEFAULT;
                    }
                    //TODO: The font size is not the same across all the anroid devices...
                    if (fontSize >= 0){
                        float density =  Cocos2dxActivity.COCOS_ACTIVITY.getResources().getDisplayMetrics().density;
                        editBox.setTextSize(TypedValue.COMPLEX_UNIT_SP,
                                fontSize / density );
                    }
                    editBox.setTypeface(tf);
                }
            }
        });
    }

    public static void setFontColor(final int index, final int red, final int green, final int blue, final int alpha){
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    editBox.setTextColor(Color.argb(alpha, red, green, blue));
                }
            }
        });
    }

    public static void setPlaceHolderText(final int index, final String text){
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    editBox.setHint(text);
                }
            }
        });
    }

    public static void setPlaceHolderTextColor(final int index, final int red, final int green, final int blue, final int alpha){
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    editBox.setHintTextColor(Color.argb(alpha, red, green, blue));
                }
            }
        });
    }

    public static void setMaxLength(final int index, final int maxLength) {
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    editBox.setMaxLength(maxLength);
                }
            }
        });
    }

    public static void setVisible(final int index, final boolean visible) {
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    editBox.setVisibility(visible ? View.VISIBLE : View.GONE);
                }
            }
        });
    }


    public static void setText(final int index, final String text){
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    editBox.setText(text);
                }
            }
        });
    }

    public static void setReturnType(final int index, final int returnType) {
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    editBox.setReturnType(returnType);
                }
            }
        });
    }

    public static void setInputMode(final int index, final int inputMode) {
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    editBox.setInputMode(inputMode);
                }
            }
        });
    }

    public static void setInputFlag(final int index, final int inputFlag) {
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    editBox.setInputFlag(inputFlag);
                }
            }
        });
    }


    public static void setEditBoxViewRect(final int index, final int left, final int top, final int maxWidth, final int maxHeight) {
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxEditBox editBox = sEditBoxArray.get(index);
                if (editBox != null) {
                    editBox.setEditBoxViewRect(left, top, maxWidth, maxHeight);
                }
            }
        });
    }

    public static void openKeyboard(final int index) {
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                openKeyboardOnUiThread(index);
            }
        });
    }

    public static void closeKeyboard(final int index) {
        Cocos2dxActivity.COCOS_ACTIVITY.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                closeKeyboardOnUiThread(index);
            }
        });
    }

    private static void openKeyboardOnUiThread(int index) {
        if (Looper.myLooper() != Looper.getMainLooper()) {
            Log.e(TAG, "openKeyboardOnUiThread doesn't run on UI thread!");
            return;
        }

        final InputMethodManager imm = (InputMethodManager) Cocos2dxActivity.COCOS_ACTIVITY.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
        Cocos2dxEditBox editBox = sEditBoxArray.get(index);
        if (null != editBox) {
            editBox.requestFocus();
            imm.showSoftInput(editBox, 0);
            Cocos2dxActivity.COCOS_ACTIVITY.getGLSurfaceView().setSoftKeyboardShown(true);
        }
    }

    private static void closeKeyboardOnUiThread(int index) {
        if (Looper.myLooper() != Looper.getMainLooper()) {
            Log.e(TAG, "closeKeyboardOnUiThread doesn't run on UI thread!");
            return;
        }

        final InputMethodManager imm = (InputMethodManager) Cocos2dxActivity.COCOS_ACTIVITY.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
        Cocos2dxEditBox editBox = sEditBoxArray.get(index);
        if (null != editBox) {
            imm.hideSoftInputFromWindow(editBox.getWindowToken(), 0);
            Cocos2dxActivity.COCOS_ACTIVITY.getGLSurfaceView().setSoftKeyboardShown(false);
            Cocos2dxActivity.COCOS_ACTIVITY.getGLSurfaceView().requestFocus();
        }
    }
}

