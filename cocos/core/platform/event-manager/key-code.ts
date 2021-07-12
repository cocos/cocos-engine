/**
 * @en Enum type of keyCode for key event
 * @zh 按键事件的按键码
 */
export enum KeyCode {
    /**
    * @en None
    * @zh 没有分配
    */
    NONE = 0,

    /**
    * @en The backspace key
    * @zh 退格键
    */
    BACKSPACE = 8,

    /**
    * @en The tab key
    * @zh Tab 键
    */
    TAB = 9,

    /**
    * @en The enter key
    * @zh 回车键
    */
    ENTER = 13,

    /**
    * @en The left shift key
    * @zh 左 Shift 键
    */
    SHIFT_LEFT = 16,

    /**
    * @en The left ctrl key
    * @zh 左 Ctrl 键
    */
    CTRL_LEFT = 17,

    /**
    * @en The left alt key
    * @zh 左 Alt 键
    */
    ALT_LEFT = 18,

    /**
    * @en The pause key
    * @zh 暂停键
    */
    PAUSE = 19,

    /**
    * @en The caps lock key
    * @zh 大写锁定键
    */
    CAPS_LOCK = 20,

    /**
    * @en The esc key
    * @zh ESC 键
    */
    ESCAPE = 27,

    /**
    * @en The space key
    * @zh 空格键
    */
    SPACE = 32,

    /**
    * @en The page up key
    * @zh 向上翻页键
    */
    PAGE_UP = 33,

    /**
    * @en The page down key
    * @zh 向下翻页键
    */
    PAGE_DOWN = 34,

    /**
    * @en The end key
    * @zh 结束键
    */
    END = 35,

    /**
    * @en The home key
    * @zh 主菜单键
    */
    HOME = 36,

    /**
    * @en The left key
    * @zh 向左箭头键
    */
    ARROW_LEFT = 37,

    /**
    * @en The up key
    * @zh 向上箭头键
    */
    ARROW_UP = 38,

    /**
    * @en The right key
    * @zh 向右箭头键
    */
    ARROW_RIGHT = 39,

    /**
    * @en The down key
    * @zh 向下箭头键
    */
    ARROW_DOWN = 40,

    /**
    * @en The insert key
    * @zh 插入键
    */
    INSERT = 45,

    /**
    * @en The Delete key
    * @zh 删除键
    */
    DELETE = 46,

    /**
    * @en The '0' key on the top of the alphanumeric keyboard.
    * @zh 字母键盘上的 0 键
    */
    DIGIT_0 = 48,

    /**
    * @en The '1' key on the top of the alphanumeric keyboard.
    * @zh 字母键盘上的 1 键
    */
    DIGIT_1 = 49,

    /**
    * @en The '2' key on the top of the alphanumeric keyboard.
    * @zh 字母键盘上的 2 键
    */
    DIGIT_2 = 50,

    /**
    * @en The '3' key on the top of the alphanumeric keyboard.
    * @zh 字母键盘上的 3 键
    */
    DIGIT_3 = 51,

    /**
    * @en The '4' key on the top of the alphanumeric keyboard.
    * @zh 字母键盘上的 4 键
    */
    DIGIT_4 = 52,

    /**
    * @en The '5' key on the top of the alphanumeric keyboard.
    * @zh 字母键盘上的 5 键
    */
    DIGIT_5 = 53,

    /**
    * @en The '6' key on the top of the alphanumeric keyboard.
    * @zh 字母键盘上的 6 键
    */
    DIGIT_6 = 54,

    /**
    * @en The '7' key on the top of the alphanumeric keyboard.
    * @zh 字母键盘上的 7 键
    */
    DIGIT_7 = 55,

    /**
    * @en The '8' key on the top of the alphanumeric keyboard.
    * @zh 字母键盘上的 8 键
    */
    DIGIT_8 = 56,

    /**
    * @en The '9' key on the top of the alphanumeric keyboard.
    * @zh 字母键盘上的 9 键
    */
    DIGIT_9 = 57,

    /**
    * @en The a key
    * @zh A 键
    */
    KEY_A = 65,

    /**
    * @en The b key
    * @zh B 键
    */
    KEY_B = 66,

    /**
    * @en The c key
    * @zh C 键
    */
    KEY_C = 67,

    /**
    * @en The d key
    * @zh D 键
    */
    KEY_D = 68,

    /**
    * @en The e key
    * @zh E 键
    */
    KEY_E = 69,

    /**
    * @en The f key
    * @zh F 键
    */
    KEY_F = 70,

    /**
    * @en The g key
    * @zh G 键
    */
    KEY_G = 71,

    /**
    * @en The h key
    * @zh H 键
    */
    KEY_H = 72,

    /**
    * @en The i key
    * @zh I 键
    */
    KEY_I = 73,

    /**
    * @en The j key
    * @zh J 键
    */
    KEY_J = 74,

    /**
    * @en The k key
    * @zh K 键
    */
    KEY_K = 75,

    /**
    * @en The l key
    * @zh L 键
    */
    KEY_L = 76,

    /**
    * @en The m key
    * @zh M 键
    */
    KEY_M = 77,

    /**
    * @en The n key
    * @zh N 键
    */
    KEY_N = 78,

    /**
    * @en The o key
    * @zh O 键
    */
    KEY_O = 79,

    /**
    * @en The p key
    * @zh P 键
    */
    KEY_P = 80,

    /**
    * @en The q key
    * @zh Q 键
    */
    KEY_Q = 81,

    /**
    * @en The r key
    * @zh R 键
    */
    KEY_R = 82,

    /**
    * @en The s key
    * @zh S 键
    */
    KEY_S = 83,

    /**
    * @en The t key
    * @zh T 键
    */
    KEY_T = 84,

    /**
    * @en The u key
    * @zh U 键
    */
    KEY_U = 85,

    /**
    * @en The v key
    * @zh V 键
    */
    KEY_V = 86,

    /**
    * @en The w key
    * @zh W 键
    */
    KEY_W = 87,

    /**
    * @en The x key
    * @zh X 键
    */
    KEY_X = 88,

    /**
    * @en The y key
    * @zh Y 键
    */
    KEY_Y = 89,

    /**
    * @en The z key
    * @zh Z 键
    */
    KEY_Z = 90,

    /**
    * @en The numeric keypad 0
    * @zh 数字键盘 0
    */
    NUM_0 = 96,

    /**
    * @en The numeric keypad 1
    * @zh 数字键盘 1
    */
    NUM_1 = 97,

    /**
    * @en The numeric keypad 2
    * @zh 数字键盘 2
    */
    NUM_2 = 98,

    /**
    * @en The numeric keypad 3
    * @zh 数字键盘 3
    */
    NUM_3 = 99,

    /**
    * @en The numeric keypad 4
    * @zh 数字键盘 4
    */
    NUM_4 = 100,

    /**
    * @en The numeric keypad 5
    * @zh 数字键盘 5
    */
    NUM_5 = 101,

    /**
    * @en The numeric keypad 6
    * @zh 数字键盘 6
    */
    NUM_6 = 102,

    /**
    * @en The numeric keypad 7
    * @zh 数字键盘 7
    */
    NUM_7 = 103,

    /**
    * @en The numeric keypad 8
    * @zh 数字键盘 8
    */
    NUM_8 = 104,

    /**
    * @en The numeric keypad 9
    * @zh 数字键盘 9
    */
    NUM_9 = 105,

    /**
    * @en The numeric keypad '*'
    * @zh 数字键盘 *
    */
    NUM_MULTIPLY = 106,

    /**
    * @en The numeric keypad '+'
    * @zh 数字键盘 +
    */
    NUM_PLUS = 107,

    /**
    * @en The numeric keypad '-'
    * @zh 数字键盘 -
    */
    NUM_SUBTRACT = 109,

    /**
    * @en The numeric keypad '.'
    * @zh 数字键盘小数点 '.'
    */
    NUM_DECIMAL = 110,

    /**
    * @en The numeric keypad '/'
    * @zh 数字键盘 /
    */
    NUM_DIVIDE = 111,

    /**
    * @en The F1 function key
    * @zh F1 功能键
    */
    F1 = 112,

    /**
    * @en The F2 function key
    * @zh F2 功能键
    */
    F2 = 113,

    /**
    * @en The F3 function key
    * @zh F3 功能键
    */
    F3 = 114,

    /**
    * @en The F4 function key
    * @zh F4 功能键
    */
    F4 = 115,

    /**
    * @en The F5 function key
    * @zh F5 功能键
    */
    F5 = 116,

    /**
    * @en The F6 function key
    * @zh F6 功能键
    */
    F6 = 117,

    /**
    * @en The F7 function key
    * @zh F7 功能键
    */
    F7 = 118,

    /**
    * @en The F8 function key
    * @zh F8 功能键
    */
    F8 = 119,

    /**
    * @en The F9 function key
    * @zh F9 功能键
    */
    F9 = 120,

    /**
    * @en The F10 function key
    * @zh F10 功能键
    */
    F10 = 121,

    /**
    * @en The F11 function key
    * @zh F11 功能键
    */
    F11 = 122,

    /**
    * @en The F12 function key
    * @zh F12 功能键
    */
    F12 = 123,

    /**
    * @en The numlock key
    * @zh 数字锁定键
    */
    NUM_LOCK = 144,

    /**
    * @en The scroll lock key
    * @zh 滚动锁定键
    */
    SCROLL_LOCK = 145,

    /**
    * @en The ';' key.
    * @zh 分号键
    */
    SEMICOLON = 186,

    /**
    * @en The '=' key.
    * @zh 等于号键
    */
    EQUAL = 187,

    /**
    * @en The ',' key.
    * @zh 逗号键
    */
    COMMA = 188,

    /**
    * @en The dash '-' key.
    * @zh 中划线键
    */
    DASH = 189,

    /**
    * @en The '.' key
    * @zh 句号键
    */
    PERIOD = 190,

    /**
    * @en The slash key '/'
    * @zh 正斜杠键 '/'
    */
    SLASH = 191,

    /**
    * @en The back quote key `
    * @zh 按键 `
    */
    BACK_QUOTE = 192,

    /**
    * @en The '[' key
    * @zh 按键 [
    */
    BRACKET_LEFT = 219,

    /**
    * @en The back slash key '\'
    * @zh 反斜杠键 '\'
    */
    BACKSLASH = 220,

    /**
    * @en The ']' key
    * @zh 按键 ]
    */
    BRACKET_RIGHT = 221,

    /**
    * @en The quote key
    * @zh 单引号键
    */
    QUOTE = 222,

// #region The new allocated key enum since v3.3

    /**
    * @en The right shift key
    * @zh 右 Shift 键
    */
    SHIFT_RIGHT = 2000,

    /**
    * @en The right ctrl key
    * @zh 右 Ctrl 键
    */
    CTRL_RIGHT = 2001,

    /**
    * @en The right alt key
    * @zh 右 Alt 键
    */
    ALT_RIGHT = 2002,

    /**
    * @en The numeric keypad enter
    * @zh 数字键盘 enter
    */
    NUM_ENTER = 2003,

// #endregion The new allocated key enum since v3.3
}
