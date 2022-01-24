/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "KeyCodeHelper.h"
#include <mutex>

// Copy from glfw3.h

/* The unknown key */
#define GLFW_KEY_UNKNOWN -1

/* Printable keys */
#define GLFW_KEY_SPACE         32
#define GLFW_KEY_APOSTROPHE    39 /* ' */
#define GLFW_KEY_COMMA         44 /* , */
#define GLFW_KEY_MINUS         45 /* - */
#define GLFW_KEY_PERIOD        46 /* . */
#define GLFW_KEY_SLASH         47 /* / */
#define GLFW_KEY_0             48
#define GLFW_KEY_1             49
#define GLFW_KEY_2             50
#define GLFW_KEY_3             51
#define GLFW_KEY_4             52
#define GLFW_KEY_5             53
#define GLFW_KEY_6             54
#define GLFW_KEY_7             55
#define GLFW_KEY_8             56
#define GLFW_KEY_9             57
#define GLFW_KEY_SEMICOLON     59 /* ; */
#define GLFW_KEY_EQUAL         61 /* = */
#define GLFW_KEY_A             65
#define GLFW_KEY_B             66
#define GLFW_KEY_C             67
#define GLFW_KEY_D             68
#define GLFW_KEY_E             69
#define GLFW_KEY_F             70
#define GLFW_KEY_G             71
#define GLFW_KEY_H             72
#define GLFW_KEY_I             73
#define GLFW_KEY_J             74
#define GLFW_KEY_K             75
#define GLFW_KEY_L             76
#define GLFW_KEY_M             77
#define GLFW_KEY_N             78
#define GLFW_KEY_O             79
#define GLFW_KEY_P             80
#define GLFW_KEY_Q             81
#define GLFW_KEY_R             82
#define GLFW_KEY_S             83
#define GLFW_KEY_T             84
#define GLFW_KEY_U             85
#define GLFW_KEY_V             86
#define GLFW_KEY_W             87
#define GLFW_KEY_X             88
#define GLFW_KEY_Y             89
#define GLFW_KEY_Z             90
#define GLFW_KEY_LEFT_BRACKET  91  /* [ */
#define GLFW_KEY_BACKSLASH     92  /* \ */
#define GLFW_KEY_RIGHT_BRACKET 93  /* ] */
#define GLFW_KEY_GRAVE_ACCENT  96  /* ` */
#define GLFW_KEY_WORLD_1       161 /* non-US #1 */
#define GLFW_KEY_WORLD_2       162 /* non-US #2 */

/* Function keys */
#define GLFW_KEY_ESCAPE        256
#define GLFW_KEY_ENTER         257
#define GLFW_KEY_TAB           258
#define GLFW_KEY_BACKSPACE     259
#define GLFW_KEY_INSERT        260
#define GLFW_KEY_DELETE        261
#define GLFW_KEY_RIGHT         262
#define GLFW_KEY_LEFT          263
#define GLFW_KEY_DOWN          264
#define GLFW_KEY_UP            265
#define GLFW_KEY_PAGE_UP       266
#define GLFW_KEY_PAGE_DOWN     267
#define GLFW_KEY_HOME          268
#define GLFW_KEY_END           269
#define GLFW_KEY_CAPS_LOCK     280
#define GLFW_KEY_SCROLL_LOCK   281
#define GLFW_KEY_NUM_LOCK      282
#define GLFW_KEY_PRINT_SCREEN  283
#define GLFW_KEY_PAUSE         284
#define GLFW_KEY_F1            290
#define GLFW_KEY_F2            291
#define GLFW_KEY_F3            292
#define GLFW_KEY_F4            293
#define GLFW_KEY_F5            294
#define GLFW_KEY_F6            295
#define GLFW_KEY_F7            296
#define GLFW_KEY_F8            297
#define GLFW_KEY_F9            298
#define GLFW_KEY_F10           299
#define GLFW_KEY_F11           300
#define GLFW_KEY_F12           301
#define GLFW_KEY_F13           302
#define GLFW_KEY_F14           303
#define GLFW_KEY_F15           304
#define GLFW_KEY_F16           305
#define GLFW_KEY_F17           306
#define GLFW_KEY_F18           307
#define GLFW_KEY_F19           308
#define GLFW_KEY_F20           309
#define GLFW_KEY_F21           310
#define GLFW_KEY_F22           311
#define GLFW_KEY_F23           312
#define GLFW_KEY_F24           313
#define GLFW_KEY_F25           314
#define GLFW_KEY_KP_0          320
#define GLFW_KEY_KP_1          321
#define GLFW_KEY_KP_2          322
#define GLFW_KEY_KP_3          323
#define GLFW_KEY_KP_4          324
#define GLFW_KEY_KP_5          325
#define GLFW_KEY_KP_6          326
#define GLFW_KEY_KP_7          327
#define GLFW_KEY_KP_8          328
#define GLFW_KEY_KP_9          329
#define GLFW_KEY_KP_DECIMAL    330
#define GLFW_KEY_KP_DIVIDE     331
#define GLFW_KEY_KP_MULTIPLY   332
#define GLFW_KEY_KP_SUBTRACT   333
#define GLFW_KEY_KP_ADD        334
#define GLFW_KEY_KP_ENTER      335
#define GLFW_KEY_KP_EQUAL      336
#define GLFW_KEY_LEFT_SHIFT    340
#define GLFW_KEY_LEFT_CONTROL  341
#define GLFW_KEY_LEFT_ALT      342
#define GLFW_KEY_LEFT_SUPER    343
#define GLFW_KEY_RIGHT_SHIFT   344
#define GLFW_KEY_RIGHT_CONTROL 345
#define GLFW_KEY_RIGHT_ALT     346
#define GLFW_KEY_RIGHT_SUPER   347
#define GLFW_KEY_MENU          348

#define GLFW_KEY_LAST GLFW_KEY_MENU

namespace {
// Modifier Key State
bool stateShiftLeft = false;
bool stateShiftRight = false;
bool stateControlLeft = false;
bool stateControlRight = false;
bool stateOptionLeft = false;
bool stateOptionRight = false;

// Refer to https://github.com/glfw/glfw/blob/master/src/cocoa_window.m.
int keyCodes[0xff + 1] = {-1};

void init() {
    keyCodes[0x1D] = GLFW_KEY_0;
    keyCodes[0x12] = GLFW_KEY_1;
    keyCodes[0x13] = GLFW_KEY_2;
    keyCodes[0x14] = GLFW_KEY_3;
    keyCodes[0x15] = GLFW_KEY_4;
    keyCodes[0x17] = GLFW_KEY_5;
    keyCodes[0x16] = GLFW_KEY_6;
    keyCodes[0x1A] = GLFW_KEY_7;
    keyCodes[0x1C] = GLFW_KEY_8;
    keyCodes[0x19] = GLFW_KEY_9;
    keyCodes[0x00] = GLFW_KEY_A;
    keyCodes[0x0B] = GLFW_KEY_B;
    keyCodes[0x08] = GLFW_KEY_C;
    keyCodes[0x02] = GLFW_KEY_D;
    keyCodes[0x0E] = GLFW_KEY_E;
    keyCodes[0x03] = GLFW_KEY_F;
    keyCodes[0x05] = GLFW_KEY_G;
    keyCodes[0x04] = GLFW_KEY_H;
    keyCodes[0x22] = GLFW_KEY_I;
    keyCodes[0x26] = GLFW_KEY_J;
    keyCodes[0x28] = GLFW_KEY_K;
    keyCodes[0x25] = GLFW_KEY_L;
    keyCodes[0x2E] = GLFW_KEY_M;
    keyCodes[0x2D] = GLFW_KEY_N;
    keyCodes[0x1F] = GLFW_KEY_O;
    keyCodes[0x23] = GLFW_KEY_P;
    keyCodes[0x0C] = GLFW_KEY_Q;
    keyCodes[0x0F] = GLFW_KEY_R;
    keyCodes[0x01] = GLFW_KEY_S;
    keyCodes[0x11] = GLFW_KEY_T;
    keyCodes[0x20] = GLFW_KEY_U;
    keyCodes[0x09] = GLFW_KEY_V;
    keyCodes[0x0D] = GLFW_KEY_W;
    keyCodes[0x07] = GLFW_KEY_X;
    keyCodes[0x10] = GLFW_KEY_Y;
    keyCodes[0x06] = GLFW_KEY_Z;

    keyCodes[0x27] = GLFW_KEY_APOSTROPHE;
    keyCodes[0x2A] = GLFW_KEY_BACKSLASH;
    keyCodes[0x2B] = GLFW_KEY_COMMA;
    keyCodes[0x18] = GLFW_KEY_EQUAL;
    keyCodes[0x32] = GLFW_KEY_GRAVE_ACCENT;
    keyCodes[0x21] = GLFW_KEY_LEFT_BRACKET;
    keyCodes[0x1B] = GLFW_KEY_MINUS;
    keyCodes[0x2F] = GLFW_KEY_PERIOD;
    keyCodes[0x1E] = GLFW_KEY_RIGHT_BRACKET;
    keyCodes[0x29] = GLFW_KEY_SEMICOLON;
    keyCodes[0x2C] = GLFW_KEY_SLASH;
    keyCodes[0x0A] = GLFW_KEY_WORLD_1;

    keyCodes[0x33] = GLFW_KEY_BACKSPACE;
    keyCodes[0x39] = GLFW_KEY_CAPS_LOCK;
    keyCodes[0x75] = GLFW_KEY_DELETE;
    keyCodes[0x7D] = GLFW_KEY_DOWN;
    keyCodes[0x77] = GLFW_KEY_END;
    keyCodes[0x24] = GLFW_KEY_ENTER;
    keyCodes[0x35] = GLFW_KEY_ESCAPE;
    keyCodes[0x7A] = GLFW_KEY_F1;
    keyCodes[0x78] = GLFW_KEY_F2;
    keyCodes[0x63] = GLFW_KEY_F3;
    keyCodes[0x76] = GLFW_KEY_F4;
    keyCodes[0x60] = GLFW_KEY_F5;
    keyCodes[0x61] = GLFW_KEY_F6;
    keyCodes[0x62] = GLFW_KEY_F7;
    keyCodes[0x64] = GLFW_KEY_F8;
    keyCodes[0x65] = GLFW_KEY_F9;
    keyCodes[0x6D] = GLFW_KEY_F10;
    keyCodes[0x67] = GLFW_KEY_F11;
    keyCodes[0x6F] = GLFW_KEY_F12;
    keyCodes[0x69] = GLFW_KEY_F13;
    keyCodes[0x6B] = GLFW_KEY_F14;
    keyCodes[0x71] = GLFW_KEY_F15;
    keyCodes[0x6A] = GLFW_KEY_F16;
    keyCodes[0x40] = GLFW_KEY_F17;
    keyCodes[0x4F] = GLFW_KEY_F18;
    keyCodes[0x50] = GLFW_KEY_F19;
    keyCodes[0x5A] = GLFW_KEY_F20;
    keyCodes[0x73] = GLFW_KEY_HOME;
    keyCodes[0x72] = GLFW_KEY_INSERT;
    keyCodes[0x7B] = GLFW_KEY_LEFT;
    keyCodes[0x3A] = GLFW_KEY_LEFT_ALT;
    keyCodes[0x3B] = GLFW_KEY_LEFT_CONTROL;
    keyCodes[0x38] = GLFW_KEY_LEFT_SHIFT;
    keyCodes[0x37] = GLFW_KEY_LEFT_SUPER;
    keyCodes[0x6E] = GLFW_KEY_MENU;
    keyCodes[0x47] = GLFW_KEY_NUM_LOCK;
    keyCodes[0x79] = GLFW_KEY_PAGE_DOWN;
    keyCodes[0x74] = GLFW_KEY_PAGE_UP;
    keyCodes[0x7C] = GLFW_KEY_RIGHT;
    keyCodes[0x3D] = GLFW_KEY_RIGHT_ALT;
    keyCodes[0x3E] = GLFW_KEY_RIGHT_CONTROL;
    keyCodes[0x3C] = GLFW_KEY_RIGHT_SHIFT;
    keyCodes[0x36] = GLFW_KEY_RIGHT_SUPER;
    keyCodes[0x31] = GLFW_KEY_SPACE;
    keyCodes[0x30] = GLFW_KEY_TAB;
    keyCodes[0x7E] = GLFW_KEY_UP;

    keyCodes[0x52] = GLFW_KEY_KP_0;
    keyCodes[0x53] = GLFW_KEY_KP_1;
    keyCodes[0x54] = GLFW_KEY_KP_2;
    keyCodes[0x55] = GLFW_KEY_KP_3;
    keyCodes[0x56] = GLFW_KEY_KP_4;
    keyCodes[0x57] = GLFW_KEY_KP_5;
    keyCodes[0x58] = GLFW_KEY_KP_6;
    keyCodes[0x59] = GLFW_KEY_KP_7;
    keyCodes[0x5B] = GLFW_KEY_KP_8;
    keyCodes[0x5C] = GLFW_KEY_KP_9;
    keyCodes[0x45] = GLFW_KEY_KP_ADD;
    keyCodes[0x41] = GLFW_KEY_KP_DECIMAL;
    keyCodes[0x4B] = GLFW_KEY_KP_DIVIDE;
    keyCodes[0x4C] = GLFW_KEY_KP_ENTER;
    keyCodes[0x51] = GLFW_KEY_KP_EQUAL;
    keyCodes[0x43] = GLFW_KEY_KP_MULTIPLY;
    keyCodes[0x4E] = GLFW_KEY_KP_SUBTRACT;
}
} // namespace

void updateModifierKeyState (int keyCodeInWeb) {
    if (keyCodeInWeb == 16) {  // shift left
        stateShiftLeft = !stateShiftLeft;
    } else if (keyCodeInWeb == 20016) {  // shift right
        stateShiftRight = !stateShiftRight;
    } else if (keyCodeInWeb == 17) {  // ctrl left
        stateControlLeft = !stateControlLeft;
    } else if (keyCodeInWeb == 20017) {  // ctrl right
        stateControlRight = !stateControlRight;
    } else if (keyCodeInWeb == 18) {  // alt left
        stateOptionLeft = !stateOptionLeft;
    } else if (keyCodeInWeb == 20018) {  // alt right
        stateOptionRight = !stateOptionRight;
    }
}

cc::KeyboardEvent::Action getModifierKeyAction (int keyCodeInWeb) {
    if (keyCodeInWeb == 16) {  // shift left
        if (stateShiftLeft) {
            return cc::KeyboardEvent::Action::PRESS;
        } else {
            return cc::KeyboardEvent::Action::RELEASE;
        }
    } else if (keyCodeInWeb == 20016) {  // shift right
        if (stateShiftRight) {
            return cc::KeyboardEvent::Action::PRESS;
        } else {
            return cc::KeyboardEvent::Action::RELEASE;
        }
    } else if (keyCodeInWeb == 17) {  // ctrl left
        if (stateControlLeft) {
            return cc::KeyboardEvent::Action::PRESS;
        } else {
            return cc::KeyboardEvent::Action::RELEASE;
        }
    } else if (keyCodeInWeb == 20017) {  // ctrl right
        if (stateControlRight) {
            return cc::KeyboardEvent::Action::PRESS;
        } else {
            return cc::KeyboardEvent::Action::RELEASE;
        }
    } else if (keyCodeInWeb == 18) {  // alt left
        if (stateOptionLeft) {
            return cc::KeyboardEvent::Action::PRESS;
        } else {
            return cc::KeyboardEvent::Action::RELEASE;
        }
    } else if (keyCodeInWeb == 20018) {  // alt right
        if (stateOptionRight) {
            return cc::KeyboardEvent::Action::PRESS;
        } else {
            return cc::KeyboardEvent::Action::RELEASE;
        }
    }
    return cc::KeyboardEvent::Action::UNKNOWN;
}

// Refer to: https://github.com/cocos-creator/cocos2d-x-lite/blob/v2.4.0/cocos/platform/desktop/CCGLView-desktop.cpp.
int translateKeycode(int keyCode) {
    std::once_flag flag;
    std::call_once(flag, init);

    if (keyCode < 0 || keyCode > 0xff)
        return -1;

    int key = keyCodes[keyCode];
    int keyInWeb = -1;
    if (key >= GLFW_KEY_0 && key <= GLFW_KEY_9)
        keyInWeb = key;
    else if (key >= GLFW_KEY_A && key <= GLFW_KEY_Z)
        keyInWeb = key;
    else if (key >= GLFW_KEY_F1 && key <= GLFW_KEY_F12)
        keyInWeb = key - 178;
    else if (key >= GLFW_KEY_KP_0 && key <= GLFW_KEY_KP_9)
        keyInWeb = key - 272 + 10000; // For indicating number in Numberpad, needs to be converted in JS.
    else if (key == GLFW_KEY_ESCAPE)
        keyInWeb = 27;
    else if (key == GLFW_KEY_MINUS)
        keyInWeb = 189;
    else if (key == GLFW_KEY_EQUAL)
        keyInWeb = 187;
    else if (key == GLFW_KEY_BACKSLASH)
        keyInWeb = 220;
    else if (key == GLFW_KEY_GRAVE_ACCENT)
        keyInWeb = 192;
    else if (key == GLFW_KEY_BACKSPACE)
        keyInWeb = 8;
    else if (key == GLFW_KEY_ENTER)
        keyInWeb = 13;
    else if (key == GLFW_KEY_LEFT_BRACKET)
        keyInWeb = 219;
    else if (key == GLFW_KEY_RIGHT_BRACKET)
        keyInWeb = 221;
    else if (key == GLFW_KEY_SEMICOLON)
        keyInWeb = 186;
    else if (key == GLFW_KEY_APOSTROPHE)
        keyInWeb = 222;
    else if (key == GLFW_KEY_TAB)
        keyInWeb = 9;
    else if (key == GLFW_KEY_LEFT_CONTROL)
        keyInWeb = 17;
    else if (key == GLFW_KEY_RIGHT_CONTROL)
        keyInWeb = 17 + 20000; // For indicating Left/Right control, needs to be converted in JS.
    else if (key == GLFW_KEY_LEFT_SHIFT)
        keyInWeb = 16;
    else if (key == GLFW_KEY_RIGHT_SHIFT)
        keyInWeb = 16 + 20000; // For indicating Left/Right shift, needs to be converted in JS.
    else if (key == GLFW_KEY_LEFT_ALT)
        keyInWeb = 18;
    else if (key == GLFW_KEY_RIGHT_ALT)
        keyInWeb = 18 + 20000; // For indicating Left/Right alt, needs to be converted in JS.
    else if (key == GLFW_KEY_LEFT_SUPER)
        keyInWeb = 91;
    else if (key == GLFW_KEY_RIGHT_SUPER)
        keyInWeb = 93;
    else if (key == GLFW_KEY_UP)
        keyInWeb = 38;
    else if (key == GLFW_KEY_DOWN)
        keyInWeb = 40;
    else if (key == GLFW_KEY_LEFT)
        keyInWeb = 37;
    else if (key == GLFW_KEY_RIGHT)
        keyInWeb = 39;
    else if (key == GLFW_KEY_MENU)
        keyInWeb = 93 + 20000;
    else if (key == GLFW_KEY_KP_ENTER)
        keyInWeb = 13 + 20000; // For indicating numpad enter, needs to be converted in JS.
    else if (key == GLFW_KEY_KP_ADD)
        keyInWeb = 107;
    else if (key == GLFW_KEY_KP_SUBTRACT)
        keyInWeb = 109;
    else if (key == GLFW_KEY_KP_MULTIPLY)
        keyInWeb = 106;
    else if (key == GLFW_KEY_KP_DIVIDE)
        keyInWeb = 111;
    else if (key == GLFW_KEY_NUM_LOCK)
        keyInWeb = 12;
    else if (key == GLFW_KEY_F13)
        keyInWeb = 124;
    else if (key == GLFW_KEY_BACKSPACE)
        keyInWeb = 8;
    else if (key == GLFW_KEY_HOME)
        keyInWeb = 36;
    else if (key == GLFW_KEY_PAGE_UP)
        keyInWeb = 33;
    else if (key == GLFW_KEY_PAGE_DOWN)
        keyInWeb = 34;
    else if (key == GLFW_KEY_END)
        keyInWeb = 35;
    else if (key == GLFW_KEY_COMMA)
        keyInWeb = 188;
    else if (key == GLFW_KEY_PERIOD)
        keyInWeb = 190;
    else if (key == GLFW_KEY_SLASH)
        keyInWeb = 191;
    else if (key == GLFW_KEY_SPACE)
        keyInWeb = 32;
    else if (key == GLFW_KEY_DELETE)
        keyInWeb = 46;
    else if (key == GLFW_KEY_KP_DECIMAL)
        keyInWeb = 110;
    else if (key == GLFW_KEY_CAPS_LOCK)
        keyInWeb = 20;

    return keyInWeb;
}
