/*
 * Copyright (C) 2021 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.google.androidgamesdk.gametextinput;

import android.app.Activity;
import android.content.Context;
import android.os.Build.VERSION;
import android.text.Editable;
import android.text.SpannableStringBuilder;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.BaseInputConnection;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import androidx.core.graphics.Insets;
import androidx.core.view.OnApplyWindowInsetsListener;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.google.androidgamesdk.gametextinput.GameTextInput.Pair;
import java.util.BitSet;

public class InputConnection
    extends BaseInputConnection
    implements View.OnKeyListener, OnApplyWindowInsetsListener {
  private static final String TAG = "gti.InputConnection";
  // TODO: (b/183179971) We should react to most of these events rather than ignoring them? Plus
  // there are others that should be ignored.
  private static final int[] notInsertedKeyCodes = {KeyEvent.KEYCODE_DEL,
      KeyEvent.KEYCODE_FORWARD_DEL, KeyEvent.KEYCODE_SHIFT_LEFT, KeyEvent.KEYCODE_SHIFT_RIGHT,
      KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_DPAD_DOWN, KeyEvent.KEYCODE_DPAD_UP,
      KeyEvent.KEYCODE_DPAD_LEFT, KeyEvent.KEYCODE_DPAD_RIGHT, KeyEvent.KEYCODE_DPAD_DOWN_LEFT,
      KeyEvent.KEYCODE_DPAD_UP_LEFT, KeyEvent.KEYCODE_DPAD_UP_LEFT, KeyEvent.KEYCODE_DPAD_UP_RIGHT,
      KeyEvent.KEYCODE_BACK};
  private final InputMethodManager imm;
  private final View targetView;
  private final Settings settings;
  private final Editable mEditable;
  // The characters we should not insert into a string.
  private final BitSet dontInsertChars;
  private Listener listener;
  private boolean mSoftKeyboardActive;

  /**
   * Constructor
   *
   * @param ctx        The app's context
   * @param targetView The view created this input connection
   * @param settings   EditorInfo and other settings needed by this class
   *                   InputConnection.
   */
  public InputConnection(Context ctx, View targetView, Settings settings) {
    super(targetView, settings.mEditorInfo.inputType != 0);
    this.targetView = targetView;
    this.settings = settings;
    Object imm = ctx.getSystemService(Context.INPUT_METHOD_SERVICE);
    if (imm == null) {
      throw new java.lang.RuntimeException("Can't get IMM");
    } else {
      this.imm = (InputMethodManager) imm;
      this.mEditable = (Editable) (new SpannableStringBuilder());
    }
    // BitSet.valueOf is only available in API 30 so insert manually.
    dontInsertChars = new BitSet();
    for (int c : notInsertedKeyCodes) {
      dontInsertChars.set(c);
    }
    // Listen for insets changes
    WindowCompat.setDecorFitsSystemWindows(((Activity)targetView.getContext()).getWindow(), false);
    ViewCompat.setOnApplyWindowInsetsListener(targetView, this);
  }

  /**
   * Restart the input method manager. This is useful to apply changes to the keyboard
   * after calling setEditorInfo.
   */
  public void restartInput() {
    this.imm.restartInput(targetView);
  }

  /**
   * Get whether the soft keyboard is visible.
   *
   * @return true if the soft keyboard is visible, false otherwise
   */
  public final boolean getSoftKeyboardActive() {
    return this.mSoftKeyboardActive;
  }

  /**
   * Request the soft keyboard to become visible or invisible.
   *
   * @param active True if the soft keyboard should be made visible, otherwise false.
   * @param flags  See
   *     https://developer.android.com/reference/android/view/inputmethod/InputMethodManager#showSoftInput(android.view.View,%20int)
   */
  public final void setSoftKeyboardActive(boolean active, int flags) {
    if (active) {
      this.targetView.setFocusableInTouchMode(true);
      this.targetView.requestFocus();
      this.imm.showSoftInput(this.targetView, flags);
    } else {
      this.imm.hideSoftInputFromWindow(this.targetView.getWindowToken(), flags);
    }

    this.mSoftKeyboardActive = active;
  }

  /**
   * Get the current EditorInfo used to configure the InputConnection's behaviour.
   *
   * @return The current EditorInfo.
   */
  public final EditorInfo getEditorInfo() {
    return this.settings.mEditorInfo;
  }

  /**
   * Set the current EditorInfo used to configure the InputConnection's behaviour.
   *
   * @param editorInfo The EditorInfo to use
   */
  public final void setEditorInfo(EditorInfo editorInfo) {
    this.settings.mEditorInfo = editorInfo;
  }

  /**
   * Set the text, selection and composing region state.
   *
   * @param state The state to be used by the IME.
   *              This replaces any text, selections and composing regions currently active.
   */
  public final void setState(State state) {
    if (state == null)
      return;
    Log.d(TAG,
        "setState: '" + state.text + "', selection=(" + state.selectionStart + ","
            + state.selectionEnd + "), composing region=(" + state.composingRegionStart + ","
            + state.composingRegionEnd + ")");
    this.mEditable.clear();
    this.mEditable.insert(0, (CharSequence) state.text);
    this.setSelectionInternal(state.selectionStart, state.selectionEnd);
    this.setComposingRegionInternal(state.composingRegionStart, state.composingRegionEnd);
    this.informIMM();
  }

  /**
   * Get the current listener for state changes.
   *
   * @return The current Listener
   */
  public final Listener getListener() {
    return this.listener;
  }

  /**
   * Set a listener for state changes.
   *
   * @param listener
   * @return This InputConnection, for setter chaining.
   */
  public final InputConnection setListener(Listener listener) {
    this.listener = listener;
    return this;
  }

  // From View.OnKeyListener
  @Override
  public boolean onKey(View view, int i, KeyEvent keyEvent) {
    // Don't call sendKeyEvent as it might produce an infinite loop.
    return processKeyEvent(keyEvent);
  }

  // From BaseInputConnection
  @Override
  public Editable getEditable() {
    Log.d(TAG, "getEditable ");
    return this.mEditable;
  }

  // From BaseInputConnection
  @Override
  public boolean setSelection(int start, int end) {
    Log.d(TAG, "setSelection: " + start + ":" + end);
    this.setSelectionInternal(start, end);
    return true;
  }

  // From BaseInputConnection
  @Override
  public boolean setComposingText(CharSequence text, int newCursorPosition) {
    Log.d(TAG,
        (new StringBuilder())
            .append("setComposingText: '")
            .append(text)
            .append("', newCursorPosition=")
            .append(newCursorPosition)
            .toString());
    if (text == null) {
      return false;
    } else {
      Pair composingRegion = this.getComposingRegion();
      if (composingRegion.first == -1) {
        composingRegion = this.getSelection();
        if (composingRegion.first == -1) {
          composingRegion = new Pair(0, 0);
        }
      }

      this.mEditable.delete(composingRegion.first, composingRegion.second);
      this.mEditable.insert(composingRegion.first, text);
      this.setComposingRegion(composingRegion.first, composingRegion.first + text.length());
      composingRegion = this.getComposingRegion();
      int actualNewCursorPosition = newCursorPosition > 0
          ? Math.min(composingRegion.second + newCursorPosition - 1, this.mEditable.length())
          : Math.max(0, composingRegion.first + newCursorPosition);
      this.setSelection(actualNewCursorPosition, actualNewCursorPosition);
      this.stateUpdated(false);
      return true;
    }
  }

  // From BaseInputConnection
  @Override
  public boolean setComposingRegion(int start, int end) {
    Log.d(TAG, "setComposingRegion: " + start + ":" + end);
    this.setComposingRegionInternal(start, end);
    this.stateUpdated(false);
    return true;
  }

  // From BaseInputConnection
  @Override
  public boolean finishComposingText() {
    Log.d(TAG, "finishComposingText");
    this.setComposingRegion(-1, -1);
    return true;
  }

  // From BaseInputConnection
  @Override
  public boolean commitText(CharSequence text, int newCursorPosition) {
    Log.d(TAG,
        (new StringBuilder())
            .append("Commit: ")
            .append(text)
            .append(", new pos = ")
            .append(newCursorPosition)
            .toString());
    this.setComposingText(text, newCursorPosition);
    this.finishComposingText();
    this.informIMM();
    return true;
  }

  // From BaseInputConnection
  @Override
  public boolean deleteSurroundingText(int beforeLength, int afterLength) {
    Log.d(TAG, "deleteSurroundingText: " + beforeLength + ":" + afterLength);
    Pair selection = this.getSelection();
    int shift = 0;
    if (beforeLength > 0) {
      this.mEditable.delete(Math.max(0, selection.first - beforeLength), selection.first);
      shift = beforeLength;
    }

    if (afterLength > 0) {
      this.mEditable.delete(Math.max(0, selection.second - shift),
          Math.min(this.mEditable.length(), selection.second - shift + afterLength));
    }

    this.stateUpdated(false);
    return true;
  }

  // From BaseInputConnection
  @Override
  public boolean deleteSurroundingTextInCodePoints(int beforeLength, int afterLength) {
    Log.d(TAG, "deleteSurroundingTextInCodePoints: " + beforeLength + ":" + afterLength);
    return super.deleteSurroundingTextInCodePoints(beforeLength, afterLength);
  }

  // From BaseInputConnection
  @Override
  public boolean sendKeyEvent(KeyEvent event) {
    if (settings.mForwardKeyEvents && VERSION.SDK_INT >= 24
        && this.settings.mEditorInfo.inputType == 0 && event != null) {
      this.imm.dispatchKeyEventFromInputMethod(this.targetView, event);
    }
    return processKeyEvent(event);
  }

  // From BaseInputConnection
  @Override
  public CharSequence getSelectedText(int flags) {
    Pair selection = this.getSelection();
    return selection.first == -1 ? (CharSequence) ""
                                 : this.mEditable.subSequence(selection.first, selection.second);
  }

  // From BaseInputConnection
  @Override
  public CharSequence getTextAfterCursor(int length, int flags) {
    Log.d(TAG, "getTextAfterCursor: " + length + ":" + flags);
    Pair selection = this.getSelection();
    if (selection.first == -1) {
      return (CharSequence) "";
    } else {
      int n = Math.min(selection.second + length, this.mEditable.length());
      CharSequence seq = this.mEditable.subSequence(selection.second, n);
      return (CharSequence) seq.toString();
    }
  }

  // From BaseInputConnection
  @Override
  public CharSequence getTextBeforeCursor(int length, int flags) {
    Log.d(TAG, "getTextBeforeCursor: " + length + ", flags=" + flags);
    Pair selection = this.getSelection();
    if (selection.first == -1) {
      return (CharSequence) "";
    } else {
      int start = Math.max(selection.first - length, 0);
      CharSequence seq = this.mEditable.subSequence(start, selection.first);
      return (CharSequence) seq.toString();
    }
  }

  // From BaseInputConnection
  @Override
  public boolean requestCursorUpdates(int cursorUpdateMode) {
    Log.d(TAG, "Request cursor updates: " + cursorUpdateMode);
    return super.requestCursorUpdates(cursorUpdateMode);
  }

  // From BaseInputConnection
  @Override
  public void closeConnection() {
    Log.d(TAG, "closeConnection");
    super.closeConnection();
  }

  private final void informIMM() {
    Pair selection = this.getSelection();
    Pair cr = this.getComposingRegion();
    this.imm.updateSelection(
        this.targetView, selection.first, selection.second, cr.first, cr.second);
  }

  private final Pair getSelection() {
    return GameTextInput.getSelection(this.mEditable);
  }

  private final Pair getComposingRegion() {
    return GameTextInput.getComposingRegion(this.mEditable);
  }

  private final void setSelectionInternal(int start, int end) {
    GameTextInput.setSelection(this.mEditable, start, end);
  }

  private final void setComposingRegionInternal(int start_in, int end_in) {
    if (start_in == -1) {
      GameTextInput.removeComposingRegion(this.mEditable);
    } else {
      int start = Math.min(this.mEditable.length(), Math.max(0, start_in));
      int end = Math.min(this.mEditable.length(), Math.max(0, end_in));
      GameTextInput.setComposingRegion(this.mEditable, start, end);
    }
  }

  private boolean processKeyEvent(KeyEvent event) {
    Log.d(TAG, "sendKeyEvent");
    Pair selection = this.getSelection();
    if (event == null) {
      return false;
    } else if (event.getAction() != 0) {
      return true;
    } else {
      // If no selection is set, move the selection to the end.
      // This is the case when first typing on keys when the selection is not set.
      // Note that for InputType.TYPE_CLASS_TEXT, this is not be needed because the
      // selection is set in setComposingText.
      if (selection.first == -1) {
        selection.first = this.mEditable.length();
        selection.second = this.mEditable.length();
      }

      if (selection.first != selection.second) {
        this.mEditable.delete(selection.first, selection.second);
      } else if (event.getKeyCode() == KeyEvent.KEYCODE_DEL && selection.first > 0) {
        this.mEditable.delete(selection.first - 1, selection.first);
      } else if (event.getKeyCode() == KeyEvent.KEYCODE_FORWARD_DEL
          && selection.first < this.mEditable.length() - 1) {
        this.mEditable.delete(selection.first, selection.first + 1);
      }

      int code = event.getKeyCode();
      if (!dontInsertChars.get(code)) {
        this.mEditable.insert(
            selection.first, (CharSequence) Character.toString((char) event.getUnicodeChar()));
        int new_cursor = selection.first + 1;
        GameTextInput.setSelection(this.mEditable, new_cursor, new_cursor);
      }

      this.stateUpdated(false);
      return true;
    }
  }

  private final void stateUpdated(boolean dismissed) {
    Pair selection = this.getSelection();
    Pair cr = this.getComposingRegion();
    State state = new State(
        this.mEditable.toString(), selection.first, selection.second, cr.first, cr.second);

    // Keep a reference to the listener to avoid a race condition when setting the listener.
    Listener listener = this.listener;

    // Only propagate the state change when the keyboard is set to active.
    // If we don't do this, 'back' events can be passed unnecessarily.
    if (listener != null && this.mSoftKeyboardActive) {
      listener.stateChanged(state, dismissed);
    }
  }

  // From OnApplyWindowInsetsListener
  @Override
  public WindowInsetsCompat onApplyWindowInsets(View v, WindowInsetsCompat insets) {
    if (listener != null)
      listener.onImeInsetsChanged(insets.getInsets(WindowInsetsCompat.Type.ime()));
    return insets;
  }

  /**
   * Get the current IME insets.
   *
   * @return The current IME insets
   */
  public Insets getImeInsets() {
    WindowInsetsCompat insets = ViewCompat.getRootWindowInsets(this.targetView);
    return insets.getInsets(WindowInsetsCompat.Type.ime());
  }

}
