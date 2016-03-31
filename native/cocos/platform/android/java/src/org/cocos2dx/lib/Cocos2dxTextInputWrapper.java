/****************************************************************************
Copyright (c) 2010-2016 cocos2d-x.org

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
import android.text.Editable;
import android.text.TextWatcher;
import android.view.KeyEvent;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;

public class Cocos2dxTextInputWrapper implements TextWatcher, OnEditorActionListener {
    // ===========================================================
    // Constants
    // ===========================================================

    private static final String TAG = "Cocos2dxTextInputWrapper";

    // ===========================================================
    // Fields
    // ===========================================================

    private final Cocos2dxGLSurfaceView mCocos2dxGLSurfaceView;
    private String mText;
    private String mOriginText;

    // ===========================================================
    // Constructors
    // ===========================================================

    public Cocos2dxTextInputWrapper(final Cocos2dxGLSurfaceView cocos2dxGLSurfaceView) {
        mCocos2dxGLSurfaceView = cocos2dxGLSurfaceView;
    }

    // ===========================================================
    // Getter & Setter
    // ===========================================================

    private boolean isFullScreenEdit() {
        final TextView textField = mCocos2dxGLSurfaceView.getCocos2dxEditText();
        final InputMethodManager imm = (InputMethodManager) textField.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
        return imm.isFullscreenMode();
    }

    public void setOriginText(final String originText) {
        mOriginText = originText;
    }

    // ===========================================================
    // Methods for/from SuperClass/Interfaces
    // ===========================================================

    @Override
    public void afterTextChanged(final Editable s) {
        if (isFullScreenEdit()) {
            return;
        }

        int old_i = 0;
        int new_i = 0;
        while (old_i < mText.length() && new_i < s.length()) {
            if (mText.charAt(old_i) != s.charAt(new_i)) {
                break;
            }
            old_i += 1;
            new_i += 1;
        }

        for (; old_i < mText.length(); ++old_i) {
            mCocos2dxGLSurfaceView.deleteBackward();
        }

        int nModified = s.length() - new_i;
        if (nModified > 0) {
            final String insertText = s.subSequence(new_i, s.length()).toString();
            mCocos2dxGLSurfaceView.insertText(insertText);
        }

        mText = s.toString();
    }

    @Override
    public void beforeTextChanged(final CharSequence charSequence, final int start, final int count, final int after) {
        mText = charSequence.toString();
    }

    @Override
    public void onTextChanged(final CharSequence charSequence, final int start, final int before, final int count) {

    }

    @Override
    public boolean onEditorAction(final TextView textView, final int actionID, final KeyEvent keyEvent) {
        if (mCocos2dxGLSurfaceView.getCocos2dxEditText() == textView && this.isFullScreenEdit()) {
            // user press the action button, delete all old text and insert new text
            if (null != mOriginText) {
                for (int i = mOriginText.length(); i > 0; i--) {
                    this.mCocos2dxGLSurfaceView.deleteBackward();
                }
            }

            String text = textView.getText().toString();

            if (text != null) {
                /* If user input nothing, translate "\n" to engine. */
                if ( text.compareTo("") == 0) {
                    text = "\n";
                }

                if ( '\n' != text.charAt(text.length() - 1)) {
                    text += '\n';
                }

                mCocos2dxGLSurfaceView.insertText(text);
            } else {
                mCocos2dxGLSurfaceView.insertText("");
            }
        }

        if (actionID == EditorInfo.IME_ACTION_DONE) {
            mCocos2dxGLSurfaceView.requestFocus();
        }

        return false;
    }

}

