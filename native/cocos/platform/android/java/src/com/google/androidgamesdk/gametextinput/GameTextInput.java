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

import android.text.Editable;
import android.text.Spanned;
import android.view.inputmethod.EditorInfo;

/*
 * Singleton GameTextInput class with helper methods.
 */
public final class GameTextInput {
  private static final GameTextInput composingRegionKey;
  private static final Class selectionKey;

  public final static void copyEditorInfo(EditorInfo from, EditorInfo to) {
    if (from == null || to == null)
      return;
    if (from.hintText != null) {
      to.hintText = from.hintText;
    }

    to.inputType = from.inputType;
    to.imeOptions = from.imeOptions;
    to.label = from.label;
    to.initialCapsMode = from.initialCapsMode;
    to.privateImeOptions = from.privateImeOptions;
    if (from.packageName != null) {
      to.packageName = from.packageName;
    }

    to.fieldId = from.fieldId;
    if (from.fieldName != null) {
      to.fieldName = from.fieldName;
    }
  }

  public static final class Pair {
    int first, second;

    Pair(int f, int s) {
      first = f;
      second = s;
    }
  }

  public final static Pair getSelection(Editable editable) {
    return new Pair(editable.getSpanStart(selectionKey), editable.getSpanEnd(selectionKey));
  }

  public final static Pair getComposingRegion(Editable editable) {
    return new Pair(
        editable.getSpanStart(composingRegionKey), editable.getSpanEnd(composingRegionKey));
  }

  public final static void setSelection(Editable editable, int start, int end) {
    if (start > editable.length())
      start = editable.length();
    if (end > editable.length())
      end = editable.length();

    // Note that selections can be in the opposite order
    if (start > end)
      editable.setSpan(selectionKey, end, start, 0);
    else
      editable.setSpan(selectionKey, start, end, 0);
  }

  public final static void setComposingRegion(Editable editable, int start, int end) {
    if (start > editable.length())
      start = editable.length();
    if (end > editable.length())
      end = editable.length();

    // Note that selections can be in the opposite order
    if (start > end)
      editable.setSpan(composingRegionKey, end, start, Spanned.SPAN_COMPOSING);
    else
      editable.setSpan(composingRegionKey, start, end, Spanned.SPAN_COMPOSING);
  }

  public final static void removeComposingRegion(Editable editable) {
    editable.removeSpan(composingRegionKey);
  }

  public final static GameTextInput getComposingRegionKey() {
    return composingRegionKey;
  }

  public final static Class getSelectionKey() {
    return selectionKey;
  }

  private GameTextInput() {}

  static {
    composingRegionKey = new GameTextInput();
    selectionKey = composingRegionKey.getClass();
  }
}
