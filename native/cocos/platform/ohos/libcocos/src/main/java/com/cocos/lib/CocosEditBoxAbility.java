/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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


import ohos.aafwk.ability.AbilitySlice;
import ohos.aafwk.content.Intent;
import ohos.accessibility.ability.AccessibleAbility;
import ohos.accessibility.ability.SoftKeyBoardController;
import ohos.agp.components.*;
import ohos.agp.utils.Color;
import ohos.agp.utils.Rect;
import ohos.agp.window.service.DisplayAttributes;
import ohos.agp.window.service.DisplayManager;
import ohos.agp.window.service.WindowManager;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.multimodalinput.event.TouchEvent;

import java.lang.ref.WeakReference;


public class CocosEditBoxAbility extends AbilitySlice {

    // a color of dark green, was used for confirm button background
    private static final Color DARK_GREEN = new Color(Color.getIntColor("#1fa014"));
    private static final Color DARK_GREEN_PRESS = new Color(Color.getIntColor("#008e26"));
    private static final HiLogLabel LABEL = new HiLogLabel(HiLog.LOG_APP, 0, "CocosEditBoxAbility");

    private static WeakReference<CocosEditBoxAbility> sThis = null;
    private CocosTextHelper mTextFieldHelper = null;
    private Button mButton = null;
    private String mButtonTitle = null;
    private boolean mConfirmHold = true;
    private boolean mIsMultiLine;


    /***************************************************************************************
     Inner class.
     **************************************************************************************/
    class CocosTextHelper {
        private final HiLogLabel TAG = new HiLogLabel(HiLog.LOG_APP, 0, "Cocos2dxEditBox");
        private Text.TextObserver mTextWatcher = null;
        private TextField mTextFieldLocal;
        private int mVisibleHeight = 0;
        private ComponentContainer mLayout;

        public CocosTextHelper(TextField tf) {
            mTextFieldLocal = tf;
            DisplayAttributes displayAttrib = DisplayManager.getInstance().getDefaultDisplay(tf.getContext()).get().getRealAttributes();

            mTextWatcher = new Text.TextObserver() {
                @Override
                public void onTextUpdated(String s, int i, int i1, int i2) {
                    CocosEditBoxAbility.this.onKeyboardInput(s);
                }
            };
            tf.setAdjustInputPanel(true);

            mTextFieldHelper = this;

            mLayout = (ComponentContainer) findComponentById(ResourceTable.Id_editbox_container);
            mLayout.setLayoutRefreshedListener(new Component.LayoutRefreshedListener() {
                @Override
                public void onRefreshed(Component component) {
                    HiLog.debug(LABEL, "onRefreshed");
                    Rect rect = new Rect();
                    boolean result = mTextFieldLocal.getWindowVisibleRect(rect);
                    if (!result) {
                        HiLog.debug(LABEL, "getWindowVisibleRect fail");
                        return;
                    }

                    int tempVisibleHeight = rect.bottom;

                    if (tempVisibleHeight == 0) {
                        HiLog.debug(LABEL, "invaild rect");
                    } else if (mVisibleHeight == 0) {
                        mVisibleHeight = tempVisibleHeight;
                    } else {
                        if (tempVisibleHeight > mVisibleHeight && (Math.abs(tempVisibleHeight - mVisibleHeight) > 200)) {
                            HiLog.debug(LABEL, "input method down, the height is 0");
                            mTextFieldLocal.setText("input method down, the height is 0");
                            mVisibleHeight = tempVisibleHeight;
                            onBoardDown();
                            return;
                        }
                        if (tempVisibleHeight < mVisibleHeight && (Math.abs(tempVisibleHeight - mVisibleHeight) > 200)) {
                            HiLog.debug(LABEL, "input method up, the height is" + Math.abs(tempVisibleHeight - mVisibleHeight));
                            mTextFieldLocal.setText("input method up, the height is   ---" + Math.abs(tempVisibleHeight - mVisibleHeight));
                            onBoardUp(Math.abs(tempVisibleHeight - mVisibleHeight));
                            mVisibleHeight = tempVisibleHeight;
                            return;
                        }

                    }
                }
            });
        }


        private void onBoardUp(int boardHeight) {
            HiLog.debug(LABEL, "onBoardUp, the height is ++++" + boardHeight);
            ComponentContainer.LayoutConfig layoutConfig = mTextFieldLocal.getLayoutConfig();
            layoutConfig.setMarginBottom(boardHeight);//835
            mTextFieldLocal.setLayoutConfig(layoutConfig);
        }

        private void onBoardDown() {
            HiLog.debug(LABEL, "onBoardDown");
            ComponentContainer.LayoutConfig layoutConfig = mTextFieldLocal.getLayoutConfig();
            layoutConfig.setMarginBottom(0);
            mTextFieldLocal.setLayoutConfig(layoutConfig);
        }

        /***************************************************************************************
         Public functions.
         **************************************************************************************/

        public void show(String defaultValue, int maxLength, boolean isMultiline, boolean confirmHold, String confirmType, String inputType) {
            mIsMultiLine = isMultiline;
            // TODO: truncate
//            this.setFilters(new InputFilter[]{new InputFilter.LengthFilter(maxLength)});
//            mTextField.setTruncationMode(Text.TruncationMode.ELLIPSIS_AT_END);

            mTextFieldLocal.setText(defaultValue);
            this.setConfirmType(confirmType);
//            this.setInputType(inputType, mIsMultiLine); // FIXME: should enable
            this.addListeners();
        }

        public void hide() {
            mTextFieldLocal.clearFocus();
            this.removeListeners();
        }

        /***************************************************************************************
         Private functions.
         **************************************************************************************/

        private void setConfirmType(final String confirmType) {
            if (confirmType.contentEquals("done")) {
                mTextFieldLocal.setInputMethodOption(InputAttribute.ENTER_KEY_TYPE_UNSPECIFIED);
                mButtonTitle = "Done"; //TODO: read from ResourceTable
            } else if (confirmType.contentEquals("next")) {
                mTextFieldLocal.setInputMethodOption(InputAttribute.ENTER_KEY_TYPE_UNSPECIFIED);
                mButtonTitle = "Done"; //TODO: read from ResourceTable
            } else if (confirmType.contentEquals("search")) {
                mTextFieldLocal.setInputMethodOption(InputAttribute.ENTER_KEY_TYPE_SEARCH);
                mButtonTitle = "Search"; //TODO: read from ResourceTable
            } else if (confirmType.contentEquals("go")) {
                mTextFieldLocal.setInputMethodOption(InputAttribute.ENTER_KEY_TYPE_GO);
                mButtonTitle = "Go"; //TODO: read from ResourceTable
            } else if (confirmType.contentEquals("send")) {
                mTextFieldLocal.setInputMethodOption(InputAttribute.ENTER_KEY_TYPE_SEND);
                mButtonTitle = "Send"; //TODO: read from ResourceTable
            } else {
                mButtonTitle = null;
                HiLog.error(TAG, "unknown confirm type " + confirmType);
            }
        }

        private void setInputType(final String inputType, boolean isMultiLine) {
            if (inputType.contentEquals("text")) {
                if (isMultiLine) {
//                    this.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_MULTI_LINE);
                    mTextFieldLocal.setTextInputType(InputAttribute.PATTERN_TEXT);
                    mTextFieldLocal.setMultipleLine(true);
                } else {
                    mTextFieldLocal.setTextInputType(InputAttribute.PATTERN_TEXT);
                    mTextFieldLocal.setMultipleLine(false);
                }
            } else if (inputType.contentEquals("email")) {
//                this.setInputType(InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
                mTextFieldLocal.setTextInputType(InputAttribute.PATTERN_TEXT);
            } else if (inputType.contentEquals("number")) {
//                this.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL | InputType.TYPE_NUMBER_FLAG_SIGNED);
                mTextFieldLocal.setTextInputType(InputAttribute.PATTERN_NUMBER);
            } else if (inputType.contentEquals("phone")) {
//                this.setInputType(InputType.TYPE_CLASS_PHONE);
                mTextFieldLocal.setTextInputType(InputAttribute.PATTERN_TEXT);
            } else if (inputType.contentEquals("password")) {
//                this.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                mTextFieldLocal.setTextInputType(InputAttribute.PATTERN_PASSWORD);
            } else {
                HiLog.error(TAG, "unknown input type " + inputType);
            }
        }

        private void addListeners() {

            mTextFieldLocal.setEditorActionListener(new Text.EditorActionListener() {
                @Override
                public boolean onTextEditorAction(int i) {
                    //TODO:
                    return false;
                }
            });

            mTextFieldLocal.addTextObserver(mTextWatcher);
        }

        private void removeListeners() {
//            this.setOnEditorActionListener(null);
            mTextFieldLocal.removeTextObserver(mTextWatcher);
        }

    }

    @Override
    protected void onStart(Intent intent) {
        super.onStart(intent);

        getKeyBoard().setShowMode(AccessibleAbility.SHOW_MODE_AUTO);
        getAbility().setAbilitySliceAnimator(null); // remove animation

        //FIXME: todo
//        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE); // android
//        getWindow().setInputPanelDisplayType(Dis); // ohos

        sThis = new WeakReference<CocosEditBoxAbility>(this);
        getWindow().setInputPanelDisplayType(WindowManager.LayoutConfig.INPUT_ADJUST_PAN);

        setUIContent(ResourceTable.Layout_editbox_layout);
        delayShow(intent);


    }

    private void delayShow(final Intent intent) {
        CocosHelper.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                CocosEditBoxAbility.this.addItems();
                CocosEditBoxAbility.this.show(intent.getStringParam("defaultValue"),
                        intent.getIntParam("maxLength", 60),
                        intent.getBooleanParam("isMultiline", false),
                        intent.getBooleanParam("confirmHold", true),
                        intent.getStringParam("confirmType"),
                        intent.getStringParam("inputType"));

            }
        });
    }




    /***************************************************************************************
     Public functions.
     **************************************************************************************/

    /***************************************************************************************
     Private functions.
     **************************************************************************************/
    private void addItems() {
        mTextFieldHelper = new CocosTextHelper(getTextField());
        getTextField().setBubbleSize(0, 0);
        mButton = (Button) findComponentById(ResourceTable.Id_editbox_enterBtn);
        mButton.setTouchEventListener(new Component.TouchEventListener() {
            @Override
            public boolean onTouchEvent(Component component, TouchEvent touchEvent) {
                CocosEditBoxAbility.this.onKeyboardConfirm(CocosEditBoxAbility.this.getTextField().getText());
                if (!CocosEditBoxAbility.this.mConfirmHold && touchEvent.getAction() == TouchEvent.PRIMARY_POINT_DOWN)
                    CocosEditBoxAbility.this.hide();
                return true;
            }
        });
        // When touch area outside EditText and soft keyboard, then hide.
        Component layout = findComponentById(ResourceTable.Id_editbox_container);
        layout.setTouchEventListener(new Component.TouchEventListener() {
            @Override
            public boolean onTouchEvent(Component component, TouchEvent touchEvent) {
                if(touchEvent.getAction() == TouchEvent.PRIMARY_POINT_DOWN) {
                    CocosEditBoxAbility.this.hide();
                }
                return true;
            }
        });
//        layout.setLayoutRefreshedListener(new Component.LayoutRefreshedListener() {
//            @Override
//            public void onRefreshed(Component component) {
//                // detect keyboard re-layout?
//                HiLog.debug(LABEL, component.getClass().getSimpleName());
//            }
//        });
    }

    private TextField getTextField() {
        return (TextField)findComponentById(ResourceTable.Id_editbox_textField);
    }

    private void hide() {
//        Utils.hideVirtualButton(); // TODO: hide virtual button
        this.closeKeyboard();
    }

    public void show(String defaultValue, int maxLength, boolean isMultiline, boolean confirmHold, String confirmType, String inputType) {
        TextField tf = getTextField();
        mConfirmHold = confirmHold;
        mTextFieldHelper.show(defaultValue, maxLength, isMultiline, confirmHold, confirmType, inputType);
        int editPaddingBottom = tf.getPaddingBottom();
        int editPadding = tf.getPaddingTop();
        tf.setPadding(editPadding, editPadding, editPadding, editPaddingBottom);


        mButton.setText(mButtonTitle);
//        if (mButtonTitle == null || mButton.length() == 0) {
//            mButton.setPadding(0, 0, 0, 0);
//            mButtonParams.setMargins(0, 0, 0, 0);
//            mButtonLayout.setVisibility(Component.INVISIBLE);
//        } else {
//            int buttonTextPadding = mEditText.getPaddingBottom() / 2;
//            mButton.setPadding(editPadding, buttonTextPadding, editPadding, buttonTextPadding);
//            mButtonParams.setMargins(0, buttonTextPadding, 2, 0);
//            mButtonLayout.setVisibility(Component.VISIBLE);
//        }

        this.openKeyboard();
    }

    private void closeKeyboard() {
        TextField tf = getTextField();
        CocosHelper.runOnUIThread(tf::clearFocus);
        this.onKeyboardComplete(tf.getText());

    }

    private void openKeyboard() {
        TextField tf = getTextField();
        CocosHelper.runOnUIThread(() -> {
            tf.requestFocus();
            tf.simulateClick();
        });
    }

    private SoftKeyBoardController getKeyBoard() {
        return ((AccessibleAbility)getAbility()).getSoftKeyBoardController();
    }

    /***************************************************************************************
     Functions invoked by CPP.
     **************************************************************************************/

    @SuppressWarnings("unused")
    private static void showNative(String defaultValue, int maxLength, boolean isMultiline, boolean confirmHold, String confirmType, String inputType) {

        CocosHelper.runOnUIThread(() -> {
            Intent i = new Intent();
            i.setParam("defaultValue", defaultValue);
            i.setParam("maxLength", maxLength);
            i.setParam("isMultiline", isMultiline);
            i.setParam("confirmHold", confirmHold);
            i.setParam("confirmType", confirmType);
            i.setParam("inputType", inputType);
            CocosEditBoxAbility ability = new CocosEditBoxAbility();
            GlobalObject.getAbilitySlice().present(ability, i);
        });
    }

    @SuppressWarnings("unused")
    private static void hideNative() {
        CocosHelper.runOnUIThread(() -> {
            if(null != CocosEditBoxAbility.sThis) {
                CocosEditBoxAbility ability = CocosEditBoxAbility.sThis.get();
                if(ability != null) {
                    ability.hide();
                    ability.terminate();
                    CocosEditBoxAbility.sThis = null;
                }
            }
        });
    }

    /***************************************************************************************
     Native functions invoked by UI.
     **************************************************************************************/
    private void onKeyboardInput(String text) {
        CocosHelper.runOnGameThreadAtForeground(() ->
                CocosEditBoxAbility.onKeyboardInputNative(text)
        );
    }

    private void onKeyboardComplete(String text) {
        CocosHelper.runOnGameThreadAtForeground(() ->
                CocosEditBoxAbility.onKeyboardCompleteNative(text)
        );
    }

    private void onKeyboardConfirm(String text) {
        CocosHelper.runOnGameThreadAtForeground(() ->
                CocosEditBoxAbility.onKeyboardConfirmNative(text)
        );
    }

    private static native void onKeyboardInputNative(String text);

    private static native void onKeyboardCompleteNative(String text);

    private static native void onKeyboardConfirmNative(String text);
}
