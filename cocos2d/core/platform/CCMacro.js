/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

require('./_CCClass');

/**
 * !#en Key map for keyboard event
 * !#zh 键盘事件的按键值
 * @enum KEY
 * @example {@link utils/api/engine/docs/cocos2d/core/platform/CCCommon/KEY.js}
 */
cc.KEY = {
    /**
     * !#en None
     * !#zh 没有分配
     * @property none
     * @type {Number}
     * @readonly
     */
    none:0,

    // android
    /**
     * !#en The back key
     * !#zh 返回键
     * @property back
     * @type {Number}
     * @readonly
     */
    back:6,
    /**
     * !#en The menu key
     * !#zh 菜单键
     * @property menu
     * @type {Number}
     * @readonly
     */
    menu:18,

    /**
     * !#en The backspace key
     * !#zh 退格键
     * @property backspace
     * @type {Number}
     * @readonly
     */
    backspace:8,

    /**
     * !#en The tab key
     * !#zh Tab 键
     * @property tab
     * @type {Number}
     * @readonly
     */
    tab:9,

    /**
     * !#en The enter key
     * !#zh 回车键
     * @property enter
     * @type {Number}
     * @readonly
     */
    enter:13,

    /**
     * !#en The shift key
     * !#zh Shift 键
     * @property shift
     * @type {Number}
     * @readonly
     */
    shift:16, //should use shiftkey instead

    /**
     * !#en The ctrl key
     * !#zh Ctrl 键
     * @property ctrl
     * @type {Number}
     * @readonly
     */
    ctrl:17, //should use ctrlkey

    /**
     * !#en The alt key
     * !#zh Alt 键
     * @property alt
     * @type {Number}
     * @readonly
     */
    alt:18, //should use altkey

    /**
     * !#en The pause key
     * !#zh 暂停键
     * @property pause
     * @type {Number}
     * @readonly
     */
    pause:19,

    /**
     * !#en The caps lock key
     * !#zh 大写锁定键
     * @property capslock
     * @type {Number}
     * @readonly
     */
    capslock:20,

    /**
     * !#en The esc key
     * !#zh ESC 键
     * @property escape
     * @type {Number}
     * @readonly
     */
    escape:27,

    /**
     * !#en The space key
     * !#zh 空格键
     * @property space
     * @type {Number}
     * @readonly
     */
    space:32,

    /**
     * !#en The page up key
     * !#zh 向上翻页键
     * @property pageup
     * @type {Number}
     * @readonly
     */
    pageup:33,

    /**
     * !#en The page down key
     * !#zh 向下翻页键
     * @property pagedown
     * @type {Number}
     * @readonly
     */
    pagedown:34,

    /**
     * !#en The end key
     * !#zh 结束键
     * @property end
     * @type {Number}
     * @readonly
     */
    end:35,

    /**
     * !#en The home key
     * !#zh 主菜单键
     * @property home
     * @type {Number}
     * @readonly
     */
    home:36,

    /**
     * !#en The left key
     * !#zh 向左箭头键
     * @property left
     * @type {Number}
     * @readonly
     */
    left:37,

    /**
     * !#en The up key
     * !#zh 向上箭头键
     * @property up
     * @type {Number}
     * @readonly
     */
    up:38,

    /**
     * !#en The right key
     * !#zh 向右箭头键
     * @property right
     * @type {Number}
     * @readonly
     */
    right:39,

    /**
     * !#en The down key
     * !#zh 向下箭头键
     * @property down
     * @type {Number}
     * @readonly
     */
    down:40,

    /**
     * !#en The select key
     * !#zh Select 键
     * @property select
     * @type {Number}
     * @readonly
     */
    select:41,

    /**
     * !#en The insert key
     * !#zh 插入键
     * @property insert
     * @type {Number}
     * @readonly
     */
    insert:45,

    /**
     * !#en The Delete key
     * !#zh 删除键
     * @property Delete
     * @type {Number}
     * @readonly
     */
    Delete:46,

    /**
     * !#en The '0' key on the top of the alphanumeric keyboard.
     * !#zh 字母键盘上的 0 键
     * @property 0
     * @type {Number}
     * @readonly
     */
    0:48,

    /**
     * !#en The '1' key on the top of the alphanumeric keyboard.
     * !#zh 字母键盘上的 1 键
     * @property 1
     * @type {Number}
     * @readonly
     */
    1:49,

    /**
     * !#en The '2' key on the top of the alphanumeric keyboard.
     * !#zh 字母键盘上的 2 键
     * @property 2
     * @type {Number}
     * @readonly
     */
    2:50,

    /**
     * !#en The '3' key on the top of the alphanumeric keyboard.
     * !#zh 字母键盘上的 3 键
     * @property 3
     * @type {Number}
     * @readonly
     */
    3:51,

    /**
     * !#en The '4' key on the top of the alphanumeric keyboard.
     * !#zh 字母键盘上的 4 键
     * @property 4
     * @type {Number}
     * @readonly
     */
    4:52,

    /**
     * !#en The '5' key on the top of the alphanumeric keyboard.
     * !#zh 字母键盘上的 5 键
     * @property 5
     * @type {Number}
     * @readonly
     */
    5:53,

    /**
     * !#en The '6' key on the top of the alphanumeric keyboard.
     * !#zh 字母键盘上的 6 键
     * @property 6
     * @type {Number}
     * @readonly
     */
    6:54,

    /**
     * !#en The '7' key on the top of the alphanumeric keyboard.
     * !#zh 字母键盘上的 7 键
     * @property 7
     * @type {Number}
     * @readonly
     */
    7:55,

    /**
     * !#en The '8' key on the top of the alphanumeric keyboard.
     * !#zh 字母键盘上的 8 键
     * @property 8
     * @type {Number}
     * @readonly
     */
    8:56,

    /**
     * !#en The '9' key on the top of the alphanumeric keyboard.
     * !#zh 字母键盘上的 9 键
     * @property 9
     * @type {Number}
     * @readonly
     */
    9:57,

    /**
     * !#en The a key
     * !#zh A 键
     * @property a
     * @type {Number}
     * @readonly
     */
    a:65,

    /**
     * !#en The b key
     * !#zh B 键
     * @property b
     * @type {Number}
     * @readonly
     */
    b:66,

    /**
     * !#en The c key
     * !#zh C 键
     * @property c
     * @type {Number}
     * @readonly
     */
    c:67,

    /**
     * !#en The d key
     * !#zh D 键
     * @property d
     * @type {Number}
     * @readonly
     */
    d:68,

    /**
     * !#en The e key
     * !#zh E 键
     * @property e
     * @type {Number}
     * @readonly
     */
    e:69,

    /**
     * !#en The f key
     * !#zh F 键
     * @property f
     * @type {Number}
     * @readonly
     */
    f:70,

    /**
     * !#en The g key
     * !#zh G 键
     * @property g
     * @type {Number}
     * @readonly
     */
    g:71,

    /**
     * !#en The h key
     * !#zh H 键
     * @property h
     * @type {Number}
     * @readonly
     */
    h:72,

    /**
     * !#en The i key
     * !#zh I 键
     * @property i
     * @type {Number}
     * @readonly
     */
    i:73,

    /**
     * !#en The j key
     * !#zh J 键
     * @property j
     * @type {Number}
     * @readonly
     */
    j:74,

    /**
     * !#en The k key
     * !#zh K 键
     * @property k
     * @type {Number}
     * @readonly
     */
    k:75,

    /**
     * !#en The l key
     * !#zh L 键
     * @property l
     * @type {Number}
     * @readonly
     */
    l:76,

    /**
     * !#en The m key
     * !#zh M 键
     * @property m
     * @type {Number}
     * @readonly
     */
    m:77,

    /**
     * !#en The n key
     * !#zh N 键
     * @property n
     * @type {Number}
     * @readonly
     */
    n:78,

    /**
     * !#en The o key
     * !#zh O 键
     * @property o
     * @type {Number}
     * @readonly
     */
    o:79,

    /**
     * !#en The p key
     * !#zh P 键
     * @property p
     * @type {Number}
     * @readonly
     */
    p:80,

    /**
     * !#en The q key
     * !#zh Q 键
     * @property q
     * @type {Number}
     * @readonly
     */
    q:81,

    /**
     * !#en The r key
     * !#zh R 键
     * @property r
     * @type {Number}
     * @readonly
     */
    r:82,

    /**
     * !#en The s key
     * !#zh S 键
     * @property s
     * @type {Number}
     * @readonly
     */
    s:83,

    /**
     * !#en The t key
     * !#zh T 键
     * @property t
     * @type {Number}
     * @readonly
     */
    t:84,

    /**
     * !#en The u key
     * !#zh U 键
     * @property u
     * @type {Number}
     * @readonly
     */
    u:85,

    /**
     * !#en The v key
     * !#zh V 键
     * @property v
     * @type {Number}
     * @readonly
     */
    v:86,

    /**
     * !#en The w key
     * !#zh W 键
     * @property w
     * @type {Number}
     * @readonly
     */
    w:87,

    /**
     * !#en The x key
     * !#zh X 键
     * @property x
     * @type {Number}
     * @readonly
     */
    x:88,

    /**
     * !#en The y key
     * !#zh Y 键
     * @property y
     * @type {Number}
     * @readonly
     */
    y:89,

    /**
     * !#en The z key
     * !#zh Z 键
     * @property z
     * @type {Number}
     * @readonly
     */
    z:90,

    /**
     * !#en The numeric keypad 0
     * !#zh 数字键盘 0
     * @property num0
     * @type {Number}
     * @readonly
     */
    num0:96,

    /**
     * !#en The numeric keypad 1
     * !#zh 数字键盘 1
     * @property num1
     * @type {Number}
     * @readonly
     */
    num1:97,

    /**
     * !#en The numeric keypad 2
     * !#zh 数字键盘 2
     * @property num2
     * @type {Number}
     * @readonly
     */
    num2:98,

    /**
     * !#en The numeric keypad 3
     * !#zh 数字键盘 3
     * @property num3
     * @type {Number}
     * @readonly
     */
    num3:99,

    /**
     * !#en The numeric keypad 4
     * !#zh 数字键盘 4
     * @property num4
     * @type {Number}
     * @readonly
     */
    num4:100,

    /**
     * !#en The numeric keypad 5
     * !#zh 数字键盘 5
     * @property num5
     * @type {Number}
     * @readonly
     */
    num5:101,

    /**
     * !#en The numeric keypad 6
     * !#zh 数字键盘 6
     * @property num6
     * @type {Number}
     * @readonly
     */
    num6:102,

    /**
     * !#en The numeric keypad 7
     * !#zh 数字键盘 7
     * @property num7
     * @type {Number}
     * @readonly
     */
    num7:103,

    /**
     * !#en The numeric keypad 8
     * !#zh 数字键盘 8
     * @property num8
     * @type {Number}
     * @readonly
     */
    num8:104,

    /**
     * !#en The numeric keypad 9
     * !#zh 数字键盘 9
     * @property num9
     * @type {Number}
     * @readonly
     */
    num9:105,

    /**
     * !#en The numeric keypad '*'
     * !#zh 数字键盘 *
     * @property *
     * @type {Number}
     * @readonly
     */
    '*':106,

    /**
     * !#en The numeric keypad '+'
     * !#zh 数字键盘 +
     * @property +
     * @type {Number}
     * @readonly
     */
    '+':107,

    /**
     * !#en The numeric keypad '-'
     * !#zh 数字键盘 -
     * @property -
     * @type {Number}
     * @readonly
     */
    '-':109,

    /**
     * !#en The numeric keypad 'delete'
     * !#zh 数字键盘删除键
     * @property numdel
     * @type {Number}
     * @readonly
     */
    'numdel':110,

    /**
     * !#en The numeric keypad '/'
     * !#zh 数字键盘 /
     * @property /
     * @type {Number}
     * @readonly
     */
    '/':111,

    /**
     * !#en The F1 function key
     * !#zh F1 功能键
     * @property f1
     * @type {Number}
     * @readonly
     */
    f1:112, //f1-f12 dont work on ie

    /**
     * !#en The F2 function key
     * !#zh F2 功能键
     * @property f2
     * @type {Number}
     * @readonly
     */
    f2:113,

    /**
     * !#en The F3 function key
     * !#zh F3 功能键
     * @property f3
     * @type {Number}
     * @readonly
     */
    f3:114,

    /**
     * !#en The F4 function key
     * !#zh F4 功能键
     * @property f4
     * @type {Number}
     * @readonly
     */
    f4:115,

    /**
     * !#en The F5 function key
     * !#zh F5 功能键
     * @property f5
     * @type {Number}
     * @readonly
     */
    f5:116,

    /**
     * !#en The F6 function key
     * !#zh F6 功能键
     * @property f6
     * @type {Number}
     * @readonly
     */
    f6:117,

    /**
     * !#en The F7 function key
     * !#zh F7 功能键
     * @property f7
     * @type {Number}
     * @readonly
     */
    f7:118,

    /**
     * !#en The F8 function key
     * !#zh F8 功能键
     * @property f8
     * @type {Number}
     * @readonly
     */
    f8:119,

    /**
     * !#en The F9 function key
     * !#zh F9 功能键
     * @property f9
     * @type {Number}
     * @readonly
     */
    f9:120,

    /**
     * !#en The F10 function key
     * !#zh F10 功能键
     * @property f10
     * @type {Number}
     * @readonly
     */
    f10:121,

    /**
     * !#en The F11 function key
     * !#zh F11 功能键
     * @property f11
     * @type {Number}
     * @readonly
     */
    f11:122,

    /**
     * !#en The F12 function key
     * !#zh F12 功能键
     * @property f12
     * @type {Number}
     * @readonly
     */
    f12:123,

    /**
     * !#en The numlock key
     * !#zh 数字锁定键
     * @property numlock
     * @type {Number}
     * @readonly
     */
    numlock:144,

    /**
     * !#en The scroll lock key
     * !#zh 滚动锁定键
     * @property scrolllock
     * @type {Number}
     * @readonly
     */
    scrolllock:145,

    /**
     * !#en The ';' key.
     * !#zh 分号键
     * @property ;
     * @type {Number}
     * @readonly
     */
    ';':186,

    /**
     * !#en The ';' key.
     * !#zh 分号键
     * @property semicolon
     * @type {Number}
     * @readonly
     */
    semicolon:186,

    /**
     * !#en The '=' key.
     * !#zh 等于号键
     * @property equal
     * @type {Number}
     * @readonly
     */
    equal:187,

    /**
     * !#en The '=' key.
     * !#zh 等于号键
     * @property =
     * @type {Number}
     * @readonly
     */
    '=':187,

    /**
     * !#en The ',' key.
     * !#zh 逗号键
     * @property ,
     * @type {Number}
     * @readonly
     */
    ',':188,

    /**
     * !#en The ',' key.
     * !#zh 逗号键
     * @property comma
     * @type {Number}
     * @readonly
     */
    comma:188,

    /**
     * !#en The dash '-' key.
     * !#zh 中划线键
     * @property dash
     * @type {Number}
     * @readonly
     */
    dash:189,

    /**
     * !#en The '.' key.
     * !#zh 句号键
     * @property .
     * @type {Number}
     * @readonly
     */
    '.':190,

    /**
     * !#en The '.' key
     * !#zh 句号键
     * @property period
     * @type {Number}
     * @readonly
     */
    period:190,

    /**
     * !#en The forward slash key
     * !#zh 正斜杠键
     * @property forwardslash
     * @type {Number}
     * @readonly
     */
    forwardslash:191,

    /**
     * !#en The grave key
     * !#zh 按键 `
     * @property grave
     * @type {Number}
     * @readonly
     */
    grave:192,

    /**
     * !#en The '[' key
     * !#zh 按键 [
     * @property [
     * @type {Number}
     * @readonly
     */
    '[':219,

    /**
     * !#en The '[' key
     * !#zh 按键 [
     * @property openbracket
     * @type {Number}
     * @readonly
     */
    openbracket:219,

    /**
     * !#en The '\' key
     * !#zh 反斜杠键
     * @property backslash
     * @type {Number}
     * @readonly
     */
    backslash:220,

    /**
     * !#en The ']' key
     * !#zh 按键 ]
     * @property ]
     * @type {Number}
     * @readonly
     */
    ']':221,

    /**
     * !#en The ']' key
     * !#zh 按键 ]
     * @property closebracket
     * @type {Number}
     * @readonly
     */
    closebracket:221,

    /**
     * !#en The quote key
     * !#zh 单引号键
     * @property quote
     * @type {Number}
     * @readonly
     */
    quote:222,

    // gamepad controll

    /**
     * !#en The dpad left key
     * !#zh 导航键 向左
     * @property dpadLeft
     * @type {Number}
     * @readonly
     */
    dpadLeft:1000,

    /**
     * !#en The dpad right key
     * !#zh 导航键 向右
     * @property dpadRight
     * @type {Number}
     * @readonly
     */
    dpadRight:1001,

    /**
     * !#en The dpad up key
     * !#zh 导航键 向上
     * @property dpadUp
     * @type {Number}
     * @readonly
     */
    dpadUp:1003,

    /**
     * !#en The dpad down key
     * !#zh 导航键 向下
     * @property dpadDown
     * @type {Number}
     * @readonly
     */
    dpadDown:1004,

    /**
     * !#en The dpad center key
     * !#zh 导航键 确定键
     * @property dpadCenter
     * @type {Number}
     * @readonly
     */
    dpadCenter:1005
};

/**
 * Image formats
 * @enum ImageFormat
 */

cc.ImageFormat = cc.Enum({
    /**
     * Image Format:JPG
     * @property JPG
     * @type {Number}
     */
    JPG: 0,
    /**
     * Image Format:PNG
     * @property PNG
     * @type {Number}
     */
    PNG: 1,
    /**
     * Image Format:TIFF
     * @property TIFF
     * @type {Number}
     */
    TIFF: 2,
    /**
     * Image Format:WEBP
     * @property WEBP
     * @type {Number}
     */
    WEBP: 3,
    /**
     * Image Format:PVR
     * @property PVR
     * @type {Number}
     */
    PVR: 4,
    /**
     * Image Format:ETC
     * @property ETC
     * @type {Number}
     */
    ETC: 5,
    /**
     * Image Format:S3TC
     * @property S3TC
     * @type {Number}
     */
    S3TC: 6,
    /**
     * Image Format:ATITC
     * @property ATITC
     * @type {Number}
     */
    ATITC: 7,
    /**
     * Image Format:TGA
     * @property TGA
     * @type {Number}
     */
    TGA: 8,
    /**
     * Image Format:RAWDATA
     * @property RAWDATA
     * @type {Number}
     */
    RAWDATA: 9,
    /**
     * Image Format:UNKNOWN
     * @property UNKNOWN
     * @type {Number}
     */
    UNKNOWN: 10
});

/**
 * get image format by image data
 * @method getImageFormatByData
 * @param {Array} imgData
 * @returns {Number}
 */
cc.getImageFormatByData = function (imgData) {
    // if it is a png file buffer.
    if (imgData.length > 8 && imgData[0] === 0x89
        && imgData[1] === 0x50
        && imgData[2] === 0x4E
        && imgData[3] === 0x47
        && imgData[4] === 0x0D
        && imgData[5] === 0x0A
        && imgData[6] === 0x1A
        && imgData[7] === 0x0A) {
        return cc.ImageFormat.PNG;
    }

    // if it is a tiff file buffer.
    if (imgData.length > 2 && ((imgData[0] === 0x49 && imgData[1] === 0x49)
        || (imgData[0] === 0x4d && imgData[1] === 0x4d)
        || (imgData[0] === 0xff && imgData[1] === 0xd8))) {
        return cc.ImageFormat.TIFF;
    }
    return cc.ImageFormat.UNKNOWN;
};

/**
 * Predefined constants
 * @enum macro
 * @type {Object}
 */
cc.macro = {
    /**
     * @property INVALID_INDEX
     * @type {Number}
     */
    INVALID_INDEX: -1,

    /**
     * Default Node tag
     * @property NODE_TAG_INVALID
     * @type {Number}
     */
    NODE_TAG_INVALID: -1,

    /**
     * PI is the ratio of a circle's circumference to its diameter.
     * @property PI
     * @type {Number}
     */
    PI: Math.PI,

    /**
     * PI * 2
     * @property PI2
     * @type {Number}
     */
    PI2: Math.PI * 2,

    /**
     * Maximum float value
     * @property FLT_MAX
     * @type {Number}
     */
    FLT_MAX: parseFloat('3.402823466e+38F'),

    /**
     * Minimum float value
     * @property FLT_MIN
     * @type {Number}
     */
    FLT_MIN: parseFloat("1.175494351e-38F"),

    /**
     * PI / 180
     * @property RAD
     * @type {Number}
     */
    RAD: Math.PI / 180,

    /**
     * One degree
     * @property DEG
     * @type {Number}
     */
    DEG: 180 / Math.PI,

    /**
     * Maximum unsigned int value
     * @property UINT_MAX
     * @type {Number}
     */
    UINT_MAX: 0xffffffff,

    /**
     * @property REPEAT_FOREVER
     * @type {Number}
     */
    REPEAT_FOREVER: CC_JSB ? 0xffffffff : (Number.MAX_VALUE - 1),

    /**
     * @property FLT_EPSILON
     * @type {Number}
     */
    FLT_EPSILON: 0.0000001192092896,

    //some gl constant variable
    /**
     * @property ONE
     * @type {Number}
     */
    ONE: 1,

    /**
     * @property ZERO
     * @type {Number}
     */
    ZERO: 0,

    /**
     * @property SRC_ALPHA
     * @type {Number}
     */
    SRC_ALPHA: 0x0302,

    /**
     * @property SRC_ALPHA_SATURATE
     * @type {Number}
     */
    SRC_ALPHA_SATURATE: 0x308,

    /**
     * @property SRC_COLOR
     * @type {Number}
     */
    SRC_COLOR: 0x300,

    /**
     * @property DST_ALPHA
     * @type {Number}
     */
    DST_ALPHA: 0x304,

    /**
     * @property DST_COLOR
     * @type {Number}
     */
    DST_COLOR: 0x306,

    /**
     * @property ONE_MINUS_SRC_ALPHA
     * @type {Number}
     */
    ONE_MINUS_SRC_ALPHA: 0x0303,

    /**
     * @property ONE_MINUS_SRC_COLOR
     * @type {Number}
     */
    ONE_MINUS_SRC_COLOR: 0x301,

    /**
     * @property ONE_MINUS_DST_ALPHA
     * @type {Number}
     */
    ONE_MINUS_DST_ALPHA: 0x305,

    /**
     * @property ONE_MINUS_DST_COLOR
     * @type {Number}
     */
    ONE_MINUS_DST_COLOR: 0x0307,

    /**
     * @property ONE_MINUS_CONSTANT_ALPHA
     * @type {Number}
     */
    ONE_MINUS_CONSTANT_ALPHA: 0x8004,

    /**
     * @property ONE_MINUS_CONSTANT_COLOR
     * @type {Number}
     */
    ONE_MINUS_CONSTANT_COLOR: 0x8002,

    /**
     * the constant variable equals gl.LINEAR for texture
     * @property LINEAR
     * @type {Number}
     */
    LINEAR: 0x2601,

    /**
     * default gl blend dst function. Compatible with premultiplied alpha images.
     * @property BLEND_DST
     * @type {Number}
     */
    BLEND_DST: 0x0303,


    //Possible device orientations

    /**
     * Device oriented vertically, home button on the bottom (UIDeviceOrientationPortrait)
     * @property WEB_ORIENTATION_PORTRAIT
     * @type {Number}
     */
    WEB_ORIENTATION_PORTRAIT: 0,

    /**
     * Device oriented horizontally, home button on the right (UIDeviceOrientationLandscapeLeft)
     * @property WEB_ORIENTATION_LANDSCAPE_LEFT
     * @type {Number}
     */
    WEB_ORIENTATION_LANDSCAPE_LEFT: -90,

    /**
     * Device oriented vertically, home button on the top (UIDeviceOrientationPortraitUpsideDown)
     * @property WEB_ORIENTATION_PORTRAIT_UPSIDE_DOWN
     * @type {Number}
     */
    WEB_ORIENTATION_PORTRAIT_UPSIDE_DOWN: 180,

    /**
     * Device oriented horizontally, home button on the left (UIDeviceOrientationLandscapeRight)
     * @property WEB_ORIENTATION_LANDSCAPE_RIGHT
     * @type {Number}
     */
    WEB_ORIENTATION_LANDSCAPE_RIGHT: 90,

    /**
     * Oriented vertically
     * @property ORIENTATION_PORTRAIT
     * @type {Number}
     */
    ORIENTATION_PORTRAIT: 1,

    /**
     * Oriented horizontally
     * @property ORIENTATION_LANDSCAPE
     * @type {Number}
     */
    ORIENTATION_LANDSCAPE: 2,

    /**
     * Oriented automatically
     * @property ORIENTATION_AUTO
     * @type {Number}
     */
    ORIENTATION_AUTO: 3,


    DENSITYDPI_DEVICE: 'device-dpi',
    DENSITYDPI_HIGH: 'high-dpi',
    DENSITYDPI_MEDIUM: 'medium-dpi',
    DENSITYDPI_LOW: 'low-dpi',


    // ------------------- vertex attrib flags -----------------------------

    /**
     * @property VERTEX_ATTRIB_FLAG_NONE
     * @type {Number}
     */
    VERTEX_ATTRIB_FLAG_NONE: 0,
    /**
     * @property VERTEX_ATTRIB_FLAG_POSITION
     * @type {Number}
     */
    VERTEX_ATTRIB_FLAG_POSITION: 1 << 0,
    /**
     * @property VERTEX_ATTRIB_FLAG_COLOR
     * @type {Number}
     */
    VERTEX_ATTRIB_FLAG_COLOR: 1 << 1,
    /**
     * @property VERTEX_ATTRIB_FLAG_TEX_COORDS
     * @type {Number}
     */
    VERTEX_ATTRIB_FLAG_TEX_COORDS: 1 << 2,
    /**
     * @property VERTEX_ATTRIB_FLAG_POS_COLOR_TEX
     * @type {Number}
     */
    VERTEX_ATTRIB_FLAG_POS_COLOR_TEX: ( (1 << 0) | (1 << 1) | (1 << 2) ),

    /**
     * GL server side states
     * @property GL_ALL
     * @type {Number}
     */
    GL_ALL: 0,

    //-------------Vertex Attributes-----------
    /**
     * @property VERTEX_ATTRIB_POSITION
     * @type {Number}
     */
    VERTEX_ATTRIB_POSITION: 0,
    /**
     * @property VERTEX_ATTRIB_COLOR
     * @type {Number}
     */
    VERTEX_ATTRIB_COLOR: 1,
    /**
     * @property VERTEX_ATTRIB_TEX_COORDS
     * @type {Number}
     */
    VERTEX_ATTRIB_TEX_COORDS: 2,
    /**
     * @property VERTEX_ATTRIB_MAX
     * @type {Number}
     */
    VERTEX_ATTRIB_MAX: 3,

    //------------Uniforms------------------
    /**
     * @property UNIFORM_PMATRIX
     * @type {Number}
     */
    UNIFORM_PMATRIX: 0,
    /**
     * @property UNIFORM_MVMATRIX
     * @type {Number}
     */
    UNIFORM_MVMATRIX: 1,
    /**
     * @property UNIFORM_MVPMATRIX
     * @type {Number}
     */
    UNIFORM_MVPMATRIX: 2,
    /**
     * @property UNIFORM_TIME
     * @type {Number}
     */
    UNIFORM_TIME: 3,
    /**
     * @property UNIFORM_SINTIME
     * @type {Number}
     */
    UNIFORM_SINTIME: 4,
    /**
     * @property UNIFORM_COSTIME
     * @type {Number}
     */
    UNIFORM_COSTIME: 5,
    /**
     * @property UNIFORM_RANDOM01
     * @type {Number}
     */
    UNIFORM_RANDOM01: 6,
    /**
     * @property UNIFORM_SAMPLER
     * @type {Number}
     */
    UNIFORM_SAMPLER: 7,
    /**
     * @property UNIFORM_MAX
     * @type {Number}
     */
    UNIFORM_MAX: 8,

    //------------Shader Name---------------
    /**
     * @property SHADER_POSITION_TEXTURECOLOR
     * @type {String}
     */
    SHADER_POSITION_TEXTURECOLOR: "ShaderPositionTextureColor",
    /**
     * @property SHADER_SPRITE_POSITION_TEXTURECOLOR
     * @type {String}
     */
    SHADER_SPRITE_POSITION_TEXTURECOLOR: "ShaderSpritePositionTextureColor",
    /**
     * @property SHADER_POSITION_TEXTURECOLORALPHATEST
     * @type {String}
     */
    SHADER_POSITION_TEXTURECOLORALPHATEST: "ShaderPositionTextureColorAlphaTest",
    /**
     * @property SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST
     * @type {String}
     */
    SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST: "ShaderSpritePositionTextureColorAlphaTest",
    /**
     * @property SHADER_POSITION_COLOR
     * @type {String}
     */
    SHADER_POSITION_COLOR: "ShaderPositionColor",
    /**
     * @property SHADER_SPRITE_POSITION_COLOR
     * @type {String}
     */
    SHADER_SPRITE_POSITION_COLOR: "ShaderSpritePositionColor",
    /**
     * @property SHADER_POSITION_TEXTURE
     * @type {String}
     */
    SHADER_POSITION_TEXTURE: "ShaderPositionTexture",
    /**
     * @property SHADER_POSITION_TEXTURE_UCOLOR
     * @type {String}
     */
    SHADER_POSITION_TEXTURE_UCOLOR: "ShaderPositionTexture_uColor",
    /**
     * @property SHADER_POSITION_TEXTUREA8COLOR
     * @type {String}
     */
    SHADER_POSITION_TEXTUREA8COLOR: "ShaderPositionTextureA8Color",
    /**
     * @property SHADER_POSITION_UCOLOR
     * @type {String}
     */
    SHADER_POSITION_UCOLOR: "ShaderPosition_uColor",
    /**
     * @property SHADER_POSITION_LENGTHTEXTURECOLOR
     * @type {String}
     */
    SHADER_POSITION_LENGTHTEXTURECOLOR: "ShaderPositionLengthTextureColor",

    //------------uniform names----------------
    /**
     * @property UNIFORM_PMATRIX_S
     * @type {String}
     */
    UNIFORM_PMATRIX_S: "CC_PMatrix",
    /**
     * @property UNIFORM_MVMATRIX_S
     * @type {String}
     */
    UNIFORM_MVMATRIX_S: "CC_MVMatrix",
    /**
     * @property UNIFORM_MVPMATRIX_S
     * @type {String}
     */
    UNIFORM_MVPMATRIX_S: "CC_MVPMatrix",
    /**
     * @property UNIFORM_TIME_S
     * @type {String}
     */
    UNIFORM_TIME_S: "CC_Time",
    /**
     * @property UNIFORM_SINTIME_S
     * @type {String}
     */
    UNIFORM_SINTIME_S: "CC_SinTime",
    /**
     * @property UNIFORM_COSTIME_S
     * @type {String}
     */
    UNIFORM_COSTIME_S: "CC_CosTime",
    /**
     * @property UNIFORM_RANDOM01_S
     * @type {String}
     */
    UNIFORM_RANDOM01_S: "CC_Random01",
    /**
     * @property UNIFORM_SAMPLER_S
     * @type {String}
     */
    UNIFORM_SAMPLER_S: "CC_Texture0",
    /**
     * @property UNIFORM_ALPHA_TEST_VALUE_S
     * @type {String}
     */
    UNIFORM_ALPHA_TEST_VALUE_S: "CC_alpha_value",

    //------------Attribute names--------------
    /**
     * @property ATTRIBUTE_NAME_COLOR
     * @type {String}
     */
    ATTRIBUTE_NAME_COLOR: "a_color",
    /**
     * @property ATTRIBUTE_NAME_POSITION
     * @type {String}
     */
    ATTRIBUTE_NAME_POSITION: "a_position",
    /**
     * @property ATTRIBUTE_NAME_TEX_COORD
     * @type {String}
     */
    ATTRIBUTE_NAME_TEX_COORD: "a_texCoord",


    /**
     * default size for font size
     * @property ITEM_SIZE
     * @type {Number}
     */
    ITEM_SIZE: 32,

    /**
     * default tag for current item
     * @property CURRENT_ITEM
     * @type {Number}
     */
    CURRENT_ITEM: 0xc0c05001,
    /**
     * default tag for zoom action tag
     * @property ZOOM_ACTION_TAG
     * @type {Number}
     */
    ZOOM_ACTION_TAG: 0xc0c05002,
    /**
     * default tag for normal
     * @property NORMAL_TAG
     * @type {Number}
     */
    NORMAL_TAG: 8801,

    /**
     * default selected tag
     * @property SELECTED_TAG
     * @type {Number}
     */
    SELECTED_TAG: 8802,

    /**
     * default disabled tag
     * @property DISABLE_TAG
     * @type {Number}
     */
    DISABLE_TAG: 8803,

    // General configurations
    /**
     * <p>
     *   If enabled, the texture coordinates will be calculated by using this formula: <br/>
     *      - texCoord.left = (rect.x*2+1) / (texture.wide*2);                  <br/>
     *      - texCoord.right = texCoord.left + (rect.width*2-2)/(texture.wide*2); <br/>
     *                                                                                 <br/>
     *  The same for bottom and top.                                                   <br/>
     *                                                                                 <br/>
     *  This formula prevents artifacts by using 99% of the texture.                   <br/>
     *  The "correct" way to prevent artifacts is by expand the texture's border with the same color by 1 pixel<br/>
     *                                                                                  <br/>
     *  Affected nodes:                                                                 <br/>
     *      - _ccsg.Sprite                                                              <br/>
     *      - _ccsg.TMXTiledMap                                                         <br/>
     *                                                                                  <br/>
     *  Enabled by default. To disabled set it to 0. <br/>
     *  To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     *
     * @property {Number} FIX_ARTIFACTS_BY_STRECHING_TEXEL
     */
    FIX_ARTIFACTS_BY_STRECHING_TEXEL: 0,

    /**
     * Position of the FPS (Default: 0,0 (bottom-left corner))<br/>
     * To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * @property {Vec2} DIRECTOR_STATS_POSITION
     */
    DIRECTOR_STATS_POSITION: cc.p(0, 0),

    /**
     * <p>
     *   Seconds between FPS updates.<br/>
     *   0.5 seconds, means that the FPS number will be updated every 0.5 seconds.<br/>
     *   Having a bigger number means a more reliable FPS<br/>
     *   <br/>
     *   Default value: 0.1f<br/>
     *   To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} DIRECTOR_FPS_INTERVAL
     */
    DIRECTOR_FPS_INTERVAL: 0.5,

    /**
     * <p>
     *    If enabled, the ccsg.Node objects (_ccsg.Sprite, _ccsg.Label,etc) will be able to render in subpixels.<br/>
     *    If disabled, integer pixels will be used.<br/>
     *    <br/>
     *    To enable set it to 1. Enabled by default.<br/>
     *    To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} COCOSNODE_RENDER_SUBPIXEL
     */
    COCOSNODE_RENDER_SUBPIXEL: 1,

    /**
     * <p>
     *   If enabled, the _ccsg.Sprite objects rendered with cc.SpriteBatchNode will be able to render in subpixels.<br/>
     *   If disabled, integer pixels will be used.<br/>
     *   <br/>
     *   To enable set it to 1. Enabled by default.<br/>
     *   To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} SPRITEBATCHNODE_RENDER_SUBPIXEL
     */
    SPRITEBATCHNODE_RENDER_SUBPIXEL: 1,

    /**
     * <p>
     *     Automatically premultiply alpha for PNG resources
     * </p>
     * @property {Number} AUTO_PREMULTIPLIED_ALPHA_FOR_PNG
     */
    AUTO_PREMULTIPLIED_ALPHA_FOR_PNG: 0,

    /**
     * <p>
     *     If most of your images have pre-multiplied alpha, set it to 1 (if you are going to use .PNG/.JPG file images).<br/>
     *     Only set to 0 if ALL your images by-pass Apple UIImage loading system (eg: if you use libpng or PVR images)<br/>
     *     <br/>
     *     To enable set it to a value different than 0. Enabled by default.<br/>
     *     To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA
     */
    OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA: 0,

    /**
     * <p>
     *   Use GL_TRIANGLE_STRIP instead of GL_TRIANGLES when rendering the texture atlas.<br/>
     *   It seems it is the recommend way, but it is much slower, so, enable it at your own risk<br/>
     *   <br/>
     *   To enable set it to a value different than 0. Disabled by default.<br/>
     *   To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} TEXTURE_ATLAS_USE_TRIANGLE_STRIP
     */
    TEXTURE_ATLAS_USE_TRIANGLE_STRIP: 0,

    /**
     * <p>
     *    By default, cc.TextureAtlas (used by many cocos2d classes) will use VAO (Vertex Array Objects).<br/>
     *    Apple recommends its usage but they might consume a lot of memory, specially if you use many of them.<br/>
     *    So for certain cases, where you might need hundreds of VAO objects, it might be a good idea to disable it.<br/>
     *    <br/>
     *    To disable it set it to 0. disable by default.(Not Supported on WebGL)<br/>
     *    To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} TEXTURE_ATLAS_USE_VAO
     */
    TEXTURE_ATLAS_USE_VAO: 0,

    /**
     * <p>
     *  If enabled, NPOT textures will be used where available. Only 3rd gen (and newer) devices support NPOT textures.<br/>
     *  NPOT textures have the following limitations:<br/>
     *     - They can't have mipmaps<br/>
     *     - They only accept GL_CLAMP_TO_EDGE in GL_TEXTURE_WRAP_{S,T}<br/>
     *  <br/>
     *  To enable set it to a value different than 0. Disabled by default. <br/>
     *  <br/>
     *  This value governs only the PNG, GIF, BMP, images.<br/>
     *  This value DOES NOT govern the PVR (PVR.GZ, PVR.CCZ) files. If NPOT PVR is loaded, then it will create an NPOT texture ignoring this value.<br/>
     *  To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property TEXTURE_NPOT_SUPPORT
     * @type {Number}
     * @deprecated This value will be removed in 1.1 and NPOT textures will be loaded by default if the device supports it.
     */
    TEXTURE_NPOT_SUPPORT: 0,

    /**
     * <p>
     *     If enabled, it will use LA88 (Luminance Alpha 16-bit textures) for CCLabelTTF objects. <br/>
     *     If it is disabled, it will use A8 (Alpha 8-bit textures).                              <br/>
     *     LA88 textures are 6% faster than A8 textures, but they will consume 2x memory.         <br/>
     *                                                                                            <br/>
     *     This feature is enabled by default.
     * </p>
     * @property {Number} USE_LA88_LABELS
     */
    USE_LA88_LABELS: 1,

    /**
     * <p>
     *   If enabled, all subclasses of _ccsg.Sprite will draw a bounding box<br/>
     *   Useful for debugging purposes only. It is recommend to leave it disabled.<br/>
     *   <br/>
     *   To enable set it to a value different than 0. Disabled by default:<br/>
     *      0 -- disabled<br/>
     *      1 -- draw bounding box<br/>
     *      2 -- draw texture box
     * </p>
     * @property {Number} SPRITE_DEBUG_DRAW
     */
    SPRITE_DEBUG_DRAW: 0,

    /**
     * <p>
     *   If enabled, all subclasses of cc.LabelBMFont will draw a bounding box <br/>
     *   Useful for debugging purposes only. It is recommend to leave it disabled.<br/>
     *   <br/>
     *   To enable set it to a value different than 0. Disabled by default.<br/>
     * </p>
     * @property {Number} LABELBMFONT_DEBUG_DRAW
     */
    LABELBMFONT_DEBUG_DRAW: 0,

    /**
     * <p>
     *    If enabled, all subclasses of cc.LabelAtlas will draw a bounding box<br/>
     *    Useful for debugging purposes only. It is recommend to leave it disabled.<br/>
     *    <br/>
     *    To enable set it to a value different than 0. Disabled by default.
     * </p>
     * @property {Number} LABELATLAS_DEBUG_DRAW
     */
    LABELATLAS_DEBUG_DRAW: 0,

    /**
     * <p>
     *    If enabled, actions that alter the position property (eg: CCMoveBy, CCJumpBy, CCBezierBy, etc..) will be stacked.                  <br/>
     *    If you run 2 or more 'position' actions at the same time on a node, then end position will be the sum of all the positions.        <br/>
     *    If disabled, only the last run action will take effect.
     * </p>
     * @property {Number} ENABLE_STACKABLE_ACTIONS
     */
    ENABLE_STACKABLE_ACTIONS: 1,

    /**
     * <p>
     *      If enabled, cocos2d will maintain an OpenGL state cache internally to avoid unnecessary switches.                                     <br/>
     *      In order to use them, you have to use the following functions, instead of the the GL ones:                                             <br/>
     *          - cc.gl.useProgram() instead of glUseProgram()                                                                                      <br/>
     *          - cc.gl.deleteProgram() instead of glDeleteProgram()                                                                                <br/>
     *          - cc.gl.blendFunc() instead of glBlendFunc()                                                                                        <br/>
     *                                                                                                                                            <br/>
     *      If this functionality is disabled, then cc.gl.useProgram(), cc.gl.deleteProgram(), cc.gl.blendFunc() will call the GL ones, without using the cache.              <br/>
     *      It is recommend to enable whenever possible to improve speed.                                                                        <br/>
     *      If you are migrating your code from GL ES 1.1, then keep it disabled. Once all your code works as expected, turn it on.
     * </p>
     * @property {Number} ENABLE_GL_STATE_CACHE
     */
    // Editors do not need to cache fix bug for https://github.com/cocos-creator/fireball/issues/3079
    ENABLE_GL_STATE_CACHE: CC_EDITOR ? 0 : 1,

    /**
     * !#en 
     * The timeout to determine whether a touch is no longer active and should be removed.
     * The reason to add this timeout is due to an issue in X5 browser core, 
     * when X5 is presented in wechat on Android, if a touch is glissed from the bottom up, and leave the page area,
     * no touch cancel event is triggered, and the touch will be considered active forever. 
     * After multiple times of this action, our maximum touches number will be reached and all new touches will be ignored.
     * So this new mechanism can remove the touch that should be inactive if it's not updated during the last 5000 milliseconds.
     * Though it might remove a real touch if it's just not moving for the last 5 seconds which is not easy with the sensibility of mobile touch screen.
     * You can modify this value to have a better behavior if you find it's not enough.
     * !#zh
     * 用于甄别一个触点对象是否已经失效，并且可以被移除的延时时长
     * 添加这个时长的原因是 X5 内核在微信浏览器中出现的一个 bug。
     * 在这个环境下，如果用户将一个触点从底向上移出页面区域，将不会触发任何 touch cancel 或 touch end 事件，而这个触点会被永远当作停留在页面上的有效触点。
     * 重复这样操作几次之后，屏幕上的触点数量将达到我们的事件系统所支持的最高触点数量，之后所有的触摸事件都将被忽略。
     * 所以这个新的机制可以在触点在一定时间内没有任何更新的情况下视为失效触点并从事件系统中移除。
     * 当然，这也可能移除一个真实的触点，如果用户的触点真的在一定时间段内完全没有移动（这在当前手机屏幕的灵敏度下会很难）。
     * 你可以修改这个值来获得你需要的效果，默认值是 5000 毫秒。
     * @property {Number} TOUCH_TIMEOUT
     */
    TOUCH_TIMEOUT: 5000,

    /**
     * !#en 
     * The maximum vertex count for a single batched draw call.
     * !#zh
     * 最大可以被单次批处理渲染的顶点数量。
     * @property {Number} BATCH_VERTEX_COUNT
     */
    BATCH_VERTEX_COUNT: 2000,

    /**
     * !#en 
     * JSB only, using JS object life cycle to control C++ object or inversely, 
     * it indicates two different memory model controled by the native macro CC_ENABLE_GC_FOR_NATIVE_OBJECTS.
     * Modify the JS macro value won't have any effect.
     * !#zh
     * 仅限 JSB 有意义，使用 JS 对象生命周期来控制 C++ 对象，或是相反，这标示了两种不同的内存模型，
     * 它的值被 native 宏 CC_ENABLE_GC_FOR_NATIVE_OBJECTS 所控制，修改 JS 宏的值不会产生任何效果。
     * @property {Number} ENABLE_GC_FOR_NATIVE_OBJECTS
     */
    ENABLE_GC_FOR_NATIVE_OBJECTS: true,

    /**
     * !#en 
     * Whether or not enabled tiled map auto culling.
     * If you use cc.Camera as tiled map's camera, please disable this macro.
     * !#zh
     * 是否开启瓦片地图的自动裁减功能。
     * 如果需要使用 cc.Camera 来作为瓦片地图的摄像机的话，那么请关闭此宏
     * @property {Boolean} ENABLE_TILEDMAP_CULLING
     * @default true
     */
    ENABLE_TILEDMAP_CULLING: true,

    /**
     * !#en 
     * The max concurrent task number for the downloader
     * !#zh
     * 下载任务的最大并发数限制，在安卓平台部分机型或版本上可能需要限制在较低的水平
     * @property {Number} DOWNLOAD_MAX_CONCURRENT
     * @default 64
     */
    DOWNLOAD_MAX_CONCURRENT: 64,

    /**
     * !#en 
     * Boolean that indicates if the canvas contains an alpha channel, default sets to false for better performance.
     * Though if you want to make your canvas background transparent and show other dom elements at the background, 
     * you can set it to true before `cc.game.run`.
     * Web only.
     * !#zh
     * 用于设置 Canvas 背景是否支持 alpha 通道，默认为 false，这样可以有更高的性能表现。
     * 如果你希望 Canvas 背景是透明的，并显示背后的其他 DOM 元素，你可以在 `cc.game.run` 之前将这个值设为 true。
     * 仅支持 Web
     * @property {Boolean} ENABLE_TRANSPARENT_CANVAS
     * @default false
     */
    ENABLE_TRANSPARENT_CANVAS: false,
};

/**
 * !#en
 * default gl blend src function. Compatible with premultiplied alpha images.
 * !#zh
 * 默认的混合源模式
 * @property BLEND_SRC
 * @type {Number}
 */
cc.defineGetterSetter(cc.macro, "BLEND_SRC", function (){
    if (cc._renderType === cc.game.RENDER_TYPE_WEBGL
         && cc.macro.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA) {
        return cc.macro.ONE;
    }
    else {
        return cc.macro.SRC_ALPHA;
    }
});

/**
 * @module cc
 */

/**
 * <p>
 *     Linear interpolation between 2 numbers, the ratio sets how much it is biased to each end
 * </p>
 * @method lerp
 * @param {Number} a number A
 * @param {Number} b number B
 * @param {Number} r ratio between 0 and 1
 * @example {@link utils/api/engine/docs/cocos2d/core/platform/CCMacro/lerp.js}
 */
cc.lerp = function (a, b, r) {
    return a + (b - a) * r;
};

/**
 * get a random number from 0 to 0xffffff
 * @method rand
 * @returns {Number}
 */
cc.rand = function () {
	return Math.random() * 0xffffff;
};

/**
 * returns a random float between -1 and 1
 * @return {Number}
 * @method randomMinus1To1
 */
cc.randomMinus1To1 = function () {
    return (Math.random() - 0.5) * 2;
};

/**
 * returns a random float between 0 and 1, use Math.random directly
 * @return {Number}
 * @method random0To1
 */
cc.random0To1 = Math.random;

/**
 * converts degrees to radians
 * @param {Number} angle
 * @return {Number}
 * @method degreesToRadians
 */
cc.degreesToRadians = function (angle) {
    return angle * cc.macro.RAD;
};

/**
 * converts radians to degrees
 * @param {Number} angle
 * @return {Number}
 * @method radiansToDegrees
 */
cc.radiansToDegrees = function (angle) {
    return angle * cc.macro.DEG;
};

/**
 * Helpful macro that setups the GL server state, the correct GL program and sets the Model View Projection matrix
 * @param {Node} node setup node
 * @method nodeDrawSetup
 */
cc.nodeDrawSetup = function (node) {
    //cc.gl.enable(node._glServerState);
    if (node._shaderProgram) {
        //cc._renderContext.useProgram(node._shaderProgram._programObj);
        node._shaderProgram.use();
        node._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4();
    }
};

/*
 * <p>
 *     GL states that are enabled:<br/>
 *       - GL_TEXTURE_2D<br/>
 *       - GL_VERTEX_ARRAY<br/>
 *       - GL_TEXTURE_COORD_ARRAY<br/>
 *       - GL_COLOR_ARRAY<br/>
 * </p>
 * @method enableDefaultGLStates
 */
// cc.enableDefaultGLStates = function () {
    //TODO OPENGL STUFF
    /*
     glEnableClientState(GL_VERTEX_ARRAY);
     glEnableClientState(GL_COLOR_ARRAY);
     glEnableClientState(GL_TEXTURE_COORD_ARRAY);
     glEnable(GL_TEXTURE_2D);*/
// };

/*
 * <p>
 *   Disable default GL states:<br/>
 *     - GL_TEXTURE_2D<br/>
 *     - GL_TEXTURE_COORD_ARRAY<br/>
 *     - GL_COLOR_ARRAY<br/>
 * </p>
 * @method disableDefaultGLStates
 */
// cc.disableDefaultGLStates = function () {
    //TODO OPENGL
    /*
     glDisable(GL_TEXTURE_2D);
     glDisableClientState(GL_COLOR_ARRAY);
     glDisableClientState(GL_TEXTURE_COORD_ARRAY);
     glDisableClientState(GL_VERTEX_ARRAY);
     */
// };

/**
 * <p>
 *  Increments the GL Draws counts by one.<br/>
 *  The number of calls per frame are displayed on the screen when the CCDirector's stats are enabled.<br/>
 * </p>
 * @param {Number} addNumber
 * @method incrementGLDraws
 */
cc.incrementGLDraws = function (addNumber) {
    cc.g_NumberOfDraws += addNumber;
};

/**
 * Check webgl error.Error will be shown in console if exists.
 * @method checkGLErrorDebug
 */
cc.checkGLErrorDebug = function () {
    if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
        var _error = cc._renderContext.getError();
        if (_error) {
            cc.logID(2400, _error);
        }
    }
};

module.exports = cc.macro;
