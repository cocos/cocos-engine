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

// The state of an editable text region.
public final class State {
  public State(String text_in, int selectionStart_in, int selectionEnd_in,
      int composingRegionStart_in, int composingRegionEnd_in) {
    text = text_in;
    selectionStart = selectionStart_in;
    selectionEnd = selectionEnd_in;
    composingRegionStart = composingRegionStart_in;
    composingRegionEnd = composingRegionEnd_in;
  }

  public String text;
  public int selectionStart;
  public int selectionEnd;
  public int composingRegionStart;
  public int composingRegionEnd;
}
