/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include <android/input.h>
#include <android/keycodes.h>
#include <unordered_map>
#include "base/std/container/unordered_map.h"

namespace cc {
ccstd::unordered_map<int32_t, const char *> androidKeyCodes = {
    {AKEYCODE_BACK, "Backspace"},
    {AKEYCODE_TAB, "Tab"},
    {AKEYCODE_ENTER, "Enter"},
    {AKEYCODE_SHIFT_LEFT, "ShiftLeft"},
    {AKEYCODE_CTRL_LEFT, "ControlLeft"},
    {AKEYCODE_ALT_LEFT, "AltLeft"},
    {AKEYCODE_SHIFT_RIGHT, "ShiftRight"},
    {AKEYCODE_CTRL_RIGHT, "ControlRight"},
    {AKEYCODE_ALT_RIGHT, "AltRight"},
    {AKEYCODE_MEDIA_PLAY_PAUSE, "Pause"},
    {AKEYCODE_CAPS_LOCK, "CapsLock"},
    {AKEYCODE_ESCAPE, "Escape"},
    {AKEYCODE_SPACE, "Space"},
    {AKEYCODE_PAGE_UP, "PageUp"},
    {AKEYCODE_PAGE_DOWN, "PageDown"},
    {AKEYCODE_MOVE_END, "End"},
    {AKEYCODE_MOVE_HOME, "Home"},
    {AKEYCODE_DPAD_LEFT, "ArrowLeft"},
    {AKEYCODE_DPAD_UP, "ArrowUp"},
    {AKEYCODE_DPAD_RIGHT, "ArrowRight"},
    {AKEYCODE_DPAD_DOWN, "ArrowDown"},
    {AKEYCODE_INSERT, "Insert"},
    {AKEYCODE_DEL, "Delete"},
    {AKEYCODE_0, "Digit0"},
    {AKEYCODE_1, "Digit1"},
    {AKEYCODE_2, "Digit2"},
    {AKEYCODE_3, "Digit3"},
    {AKEYCODE_4, "Digit4"},
    {AKEYCODE_5, "Digit5"},
    {AKEYCODE_6, "Digit6"},
    {AKEYCODE_7, "Digit7"},
    {AKEYCODE_8, "Digit8"},
    {AKEYCODE_9, "Digit9"},
    {AKEYCODE_A, "KeyA"},
    {AKEYCODE_B, "KeyB"},
    {AKEYCODE_C, "KeyC"},
    {AKEYCODE_D, "KeyD"},
    {AKEYCODE_E, "KeyE"},
    {AKEYCODE_F, "KeyF"},
    {AKEYCODE_G, "KeyG"},
    {AKEYCODE_H, "KeyH"},
    {AKEYCODE_I, "KeyI"},
    {AKEYCODE_J, "KeyJ"},
    {AKEYCODE_K, "KeyK"},
    {AKEYCODE_L, "KeyL"},
    {AKEYCODE_M, "KeyM"},
    {AKEYCODE_N, "KeyN"},
    {AKEYCODE_O, "KeyO"},
    {AKEYCODE_P, "KeyP"},
    {AKEYCODE_Q, "KeyQ"},
    {AKEYCODE_R, "KeyR"},
    {AKEYCODE_S, "KeyS"},
    {AKEYCODE_T, "KeyT"},
    {AKEYCODE_U, "KeyU"},
    {AKEYCODE_V, "KeyV"},
    {AKEYCODE_W, "KeyW"},
    {AKEYCODE_X, "KeyX"},
    {AKEYCODE_Y, "KeyY"},
    {AKEYCODE_Z, "KeyZ"},
    {AKEYCODE_NUMPAD_0, "Numpad0"},
    {AKEYCODE_NUMPAD_1, "Numpad1"},
    {AKEYCODE_NUMPAD_2, "Numpad2"},
    {AKEYCODE_NUMPAD_3, "Numpad3"},
    {AKEYCODE_NUMPAD_4, "Numpad4"},
    {AKEYCODE_NUMPAD_5, "Numpad5"},
    {AKEYCODE_NUMPAD_6, "Numpad6"},
    {AKEYCODE_NUMPAD_7, "Numpad7"},
    {AKEYCODE_NUMPAD_8, "Numpad8"},
    {AKEYCODE_NUMPAD_9, "Numpad9"},
    {AKEYCODE_NUMPAD_MULTIPLY, "NumpadMultiply"},
    {AKEYCODE_NUMPAD_ADD, "NumpadAdd"},
    {AKEYCODE_NUMPAD_SUBTRACT, "NumpadSubtract"},
    {AKEYCODE_NUMPAD_DOT, "NumpadDecimal"},
    {AKEYCODE_NUMPAD_DIVIDE, "NumpadDivide"},
    {AKEYCODE_NUMPAD_ENTER, "NumpadEnter"},
    {AKEYCODE_F1, "F1"},
    {AKEYCODE_F2, "F2"},
    {AKEYCODE_F3, "F3"},
    {AKEYCODE_F4, "F4"},
    {AKEYCODE_F5, "F5"},
    {AKEYCODE_F6, "F6"},
    {AKEYCODE_F7, "F7"},
    {AKEYCODE_F8, "F8"},
    {AKEYCODE_F9, "F9"},
    {AKEYCODE_F10, "F10"},
    {AKEYCODE_F11, "F11"},
    {AKEYCODE_F12, "F12"},
    {AKEYCODE_NUM_LOCK, "NumLock"},
    {AKEYCODE_SCROLL_LOCK, "ScrollLock"},
    {AKEYCODE_SEMICOLON, "Semicolon"},
    {AKEYCODE_EQUALS, "Equal"},
    {AKEYCODE_COMMA, "Comma"},
    {AKEYCODE_MINUS, "Minus"},
    {AKEYCODE_PERIOD, "Period"},
    {AKEYCODE_SLASH, "Slash"},
    {AKEYCODE_GRAVE, "Backquote"},
    {AKEYCODE_LEFT_BRACKET, "BracketLeft"},
    {AKEYCODE_BACKSLASH, "Backslash"},
    {AKEYCODE_RIGHT_BRACKET, "BracketRight"},
    {AKEYCODE_APOSTROPHE, "Quote"},
};
} // namespace cc