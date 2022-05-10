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

import androidx.core.graphics.Insets;

/**
 * Listener interface for text, selection and composing region changes.
 * Also a listener for window insets changes.
 */
public interface Listener {

  /*
   * Called when the IME text, selection or composing region has changed.
   *
   * @param newState The updated state
   * @param dismmissed Whether the IME has been dismissed by the user
   */
  void stateChanged(State newState, boolean dismissed);

  /*
   * Called when the IME window insets change, i.e. the IME moves into or out of view.
   *
   * @param insets The new window insets, i.e. the offsets of top, bottom, left and right
   * relative to the window
   */
  void onImeInsetsChanged(Insets insets);

}
