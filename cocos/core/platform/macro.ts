/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

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
*/

import { EDITOR, MINIGAME, NATIVE, PREVIEW, RUNTIME_BASED } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { Settings, settings } from '../settings';
import { Orientation } from '../../../pal/screen-adapter/enum-type';

const SUPPORT_TEXTURE_FORMATS = ['.astc', '.pkm', '.pvr', '.webp', '.jpg', '.jpeg', '.bmp', '.png'];

const KEY = {
    /**
     * @en None
     * @zh 没有分配
     * @readonly
     */
    none: 0,

    // android
    /**
     * @en The back key on mobile phone
     * @zh 移动端返回键
     * @readonly
     * @deprecated since v3.3, please use KeyCode.MOBILE_BACK instead.
     */
    back: 6,
    /**
     * @en The menu key on mobile phone
     * @zh 移动端菜单键
     * @readonly
     * @deprecated since v3.3
     */
    menu: 18,

    /**
     * @en The backspace key
     * @zh 退格键
     * @readonly
     */
    backspace: 8,

    /**
     * @en The tab key
     * @zh Tab 键
     * @readonly
     */
    tab: 9,

    /**
     * @en The enter key
     * @zh 回车键
     * @readonly
     */
    enter: 13,

    /**
     * @en The shift key
     * @zh Shift 键
     * @readonly
     * @deprecated since v3.3, please use KeyCode.SHIFT_LEFT instead.
     */
    shift: 16, // should use shiftkey instead

    /**
     * @en The ctrl key
     * @zh Ctrl 键
     * @readonly
     * @deprecated since v3.3, please use KeyCode.CTRL_LEFT instead.
     */
    ctrl: 17, // should use ctrlkey

    /**
     * @en The alt key
     * @zh Alt 键
     * @readonly
     * @deprecated since v3.3, please use KeyCode.ALT_LEFT instead.
     */
    alt: 18, // should use altkey

    /**
     * @en The pause key
     * @zh 暂停键
     * @readonly
     */
    pause: 19,

    /**
     * @en The caps lock key
     * @zh 大写锁定键
     * @readonly
     */
    capslock: 20,

    /**
     * @en The esc key
     * @zh ESC 键
     * @readonly
     */
    escape: 27,

    /**
     * @en The space key
     * @zh 空格键
     * @readonly
     */
    space: 32,

    /**
     * @en The page up key
     * @zh 向上翻页键
     * @readonly
     */
    pageup: 33,

    /**
     * @en The page down key
     * @zh 向下翻页键
     * @readonly
     */
    pagedown: 34,

    /**
     * @en The end key
     * @zh 结束键
     * @readonly
     */
    end: 35,

    /**
     * @en The home key
     * @zh 主菜单键
     * @readonly
     */
    home: 36,

    /**
     * @en The left key
     * @zh 向左箭头键
     * @readonly
     */
    left: 37,

    /**
     * @en The up key
     * @zh 向上箭头键
     * @readonly
     */
    up: 38,

    /**
     * @en The right key
     * @zh 向右箭头键
     * @readonly
     */
    right: 39,

    /**
     * @en The down key
     * @zh 向下箭头键
     * @readonly
     */
    down: 40,

    /**
     * @en The select key
     * @zh Select 键
     * @readonly
     * @deprecated since v3.3
     */
    select: 41,

    /**
     * @en The insert key
     * @zh 插入键
     * @readonly
     */
    insert: 45,

    /**
     * @en The Delete key
     * @zh 删除键
     * @readonly
     */
    Delete: 46,

    /**
     * @en The '0' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 0 键
     * @readonly
     * @deprecated since v3.3
     */
    0: 48,

    /**
     * @en The '1' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 1 键
     * @readonly
     * @deprecated since v3.3
     */
    1: 49,

    /**
     * @en The '2' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 2 键
     * @readonly
     * @deprecated since v3.3
     */
    2: 50,

    /**
     * @en The '3' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 3 键
     * @readonly
     * @deprecated since v3.3
     */
    3: 51,

    /**
     * @en The '4' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 4 键
     * @readonly
     * @deprecated since v3.3
     */
    4: 52,

    /**
     * @en The '5' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 5 键
     * @readonly
     * @deprecated since v3.3
     */
    5: 53,

    /**
     * @en The '6' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 6 键
     * @readonly
     * @deprecated since v3.3
     */
    6: 54,

    /**
     * @en The '7' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 7 键
     * @readonly
     * @deprecated since v3.3
     */
    7: 55,

    /**
     * @en The '8' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 8 键
     * @readonly
     * @deprecated since v3.3
     */
    8: 56,

    /**
     * @en The '9' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 9 键
     * @readonly
     * @deprecated since v3.3
     */
    9: 57,

    /**
     * @en The a key
     * @zh A 键
     * @readonly
     */
    a: 65,

    /**
     * @en The b key
     * @zh B 键
     * @readonly
     */
    b: 66,

    /**
     * @en The c key
     * @zh C 键
     * @readonly
     */
    c: 67,

    /**
     * @en The d key
     * @zh D 键
     * @readonly
     */
    d: 68,

    /**
     * @en The e key
     * @zh E 键
     * @readonly
     */
    e: 69,

    /**
     * @en The f key
     * @zh F 键
     * @readonly
     */
    f: 70,

    /**
     * @en The g key
     * @zh G 键
     * @readonly
     */
    g: 71,

    /**
     * @en The h key
     * @zh H 键
     * @readonly
     */
    h: 72,

    /**
     * @en The i key
     * @zh I 键
     * @readonly
     */
    i: 73,

    /**
     * @en The j key
     * @zh J 键
     * @readonly
     */
    j: 74,

    /**
     * @en The k key
     * @zh K 键
     * @readonly
     */
    k: 75,

    /**
     * @en The l key
     * @zh L 键
     * @readonly
     */
    l: 76,

    /**
     * @en The m key
     * @zh M 键
     * @readonly
     */
    m: 77,

    /**
     * @en The n key
     * @zh N 键
     * @readonly
     */
    n: 78,

    /**
     * @en The o key
     * @zh O 键
     * @readonly
     */
    o: 79,

    /**
     * @en The p key
     * @zh P 键
     * @readonly
     */
    p: 80,

    /**
     * @en The q key
     * @zh Q 键
     * @readonly
     */
    q: 81,

    /**
     * @en The r key
     * @zh R 键
     * @readonly
     */
    r: 82,

    /**
     * @en The s key
     * @zh S 键
     * @readonly
     */
    s: 83,

    /**
     * @en The t key
     * @zh T 键
     * @readonly
     */
    t: 84,

    /**
     * @en The u key
     * @zh U 键
     * @readonly
     */
    u: 85,

    /**
     * @en The v key
     * @zh V 键
     * @readonly
     */
    v: 86,

    /**
     * @en The w key
     * @zh W 键
     * @readonly
     */
    w: 87,

    /**
     * @en The x key
     * @zh X 键
     * @readonly
     */
    x: 88,

    /**
     * @en The y key
     * @zh Y 键
     * @readonly
     */
    y: 89,

    /**
     * @en The z key
     * @zh Z 键
     * @readonly
     */
    z: 90,

    /**
     * @en The numeric keypad 0
     * @zh 数字键盘 0
     * @readonly
     */
    num0: 96,

    /**
     * @en The numeric keypad 1
     * @zh 数字键盘 1
     * @readonly
     */
    num1: 97,

    /**
     * @en The numeric keypad 2
     * @zh 数字键盘 2
     * @readonly
     */
    num2: 98,

    /**
     * @en The numeric keypad 3
     * @zh 数字键盘 3
     * @readonly
     */
    num3: 99,

    /**
     * @en The numeric keypad 4
     * @zh 数字键盘 4
     * @readonly
     */
    num4: 100,

    /**
     * @en The numeric keypad 5
     * @zh 数字键盘 5
     * @readonly
     */
    num5: 101,

    /**
     * @en The numeric keypad 6
     * @zh 数字键盘 6
     * @readonly
     */
    num6: 102,

    /**
     * @en The numeric keypad 7
     * @zh 数字键盘 7
     * @readonly
     */
    num7: 103,

    /**
     * @en The numeric keypad 8
     * @zh 数字键盘 8
     * @readonly
     */
    num8: 104,

    /**
     * @en The numeric keypad 9
     * @zh 数字键盘 9
     * @readonly
     */
    num9: 105,

    /**
     * @en The numeric keypad '*'
     * @zh 数字键盘 *
     * @readonly
     * @deprecated since v3.3
     */
    '*': 106,

    /**
     * @en The numeric keypad '+'
     * @zh 数字键盘 +
     * @readonly
     * @deprecated since v3.3
     */
    '+': 107,

    /**
     * @en The numeric keypad '-'
     * @zh 数字键盘 -
     * @readonly
     * @deprecated since v3.3
     */
    '-': 109,

    /**
     * @en The numeric keypad 'delete'
     * @zh 数字键盘删除键
     * @readonly
     */
    numdel: 110,

    /**
     * @en The numeric keypad '/'
     * @zh 数字键盘 /
     * @readonly
     * @deprecated since v3.3
     */
    '/': 111,

    /**
     * @en The F1 function key
     * @zh F1 功能键
     * @readonly
     */
    f1: 112, // f1-f12 dont work on ie

    /**
     * @en The F2 function key
     * @zh F2 功能键
     * @readonly
     */
    f2: 113,

    /**
     * @en The F3 function key
     * @zh F3 功能键
     * @readonly
     */
    f3: 114,

    /**
     * @en The F4 function key
     * @zh F4 功能键
     * @readonly
     */
    f4: 115,

    /**
     * @en The F5 function key
     * @zh F5 功能键
     * @readonly
     */
    f5: 116,

    /**
     * @en The F6 function key
     * @zh F6 功能键
     * @readonly
     */
    f6: 117,

    /**
     * @en The F7 function key
     * @zh F7 功能键
     * @readonly
     */
    f7: 118,

    /**
     * @en The F8 function key
     * @zh F8 功能键
     * @readonly
     */
    f8: 119,

    /**
     * @en The F9 function key
     * @zh F9 功能键
     * @readonly
     */
    f9: 120,

    /**
     * @en The F10 function key
     * @zh F10 功能键
     * @readonly
     */
    f10: 121,

    /**
     * @en The F11 function key
     * @zh F11 功能键
     * @readonly
     */
    f11: 122,

    /**
     * @en The F12 function key
     * @zh F12 功能键
     * @readonly
     */
    f12: 123,

    /**
     * @en The numlock key
     * @zh 数字锁定键
     * @readonly
     */
    numlock: 144,

    /**
     * @en The scroll lock key
     * @zh 滚动锁定键
     * @readonly
     */
    scrolllock: 145,

    /**
     * @en The ';' key.
     * @zh 分号键
     * @readonly
     * @deprecated since v3.3
     */
    ';': 186,

    /**
     * @en The ';' key.
     * @zh 分号键
     * @readonly
     */
    semicolon: 186,

    /**
     * @en The '=' key.
     * @zh 等于号键
     * @readonly
     */
    equal: 187,

    /**
     * @en The '=' key.
     * @zh 等于号键
     * @readonly
     * @deprecated since v3.3
     */
    '=': 187,

    /**
     * @en The ',' key.
     * @zh 逗号键
     * @readonly
     * @deprecated since v3.3
     */
    ',': 188,

    /**
     * @en The ',' key.
     * @zh 逗号键
     * @readonly
     */
    comma: 188,

    /**
     * @en The dash '-' key.
     * @zh 中划线键
     * @readonly
     */
    dash: 189,

    /**
     * @en The '.' key.
     * @zh 句号键
     * @readonly
     * @deprecated since v3.3
     */
    '.': 190,

    /**
     * @en The '.' key
     * @zh 句号键
     * @readonly
     */
    period: 190,

    /**
     * @en The forward slash key
     * @zh 正斜杠键
     * @readonly
     */
    forwardslash: 191,

    /**
     * @en The grave key
     * @zh 按键 `
     * @readonly
     */
    grave: 192,

    /**
     * @en The '[' key
     * @zh 按键 [
     * @readonly
     * @deprecated since v3.3
     */
    '[': 219,

    /**
     * @en The '[' key
     * @zh 按键 [
     * @readonly
     */
    openbracket: 219,

    /**
     * @en The '\' key
     * @zh 反斜杠键
     * @readonly
     */
    backslash: 220,

    /**
     * @en The ']' key
     * @zh 按键 ]
     * @readonly
     * @deprecated since v3.3
     */
    ']': 221,

    /**
     * @en The ']' key
     * @zh 按键 ]
     * @readonly
     */
    closebracket: 221,

    /**
     * @en The quote key
     * @zh 单引号键
     * @readonly
     */
    quote: 222,

    // gamepad controll

    /**
     * @en The dpad left key
     * @zh 导航键 向左
     * @readonly
     * @deprecated since v3.3
     */
    dpadLeft: 1000,

    /**
     * @en The dpad right key
     * @zh 导航键 向右
     * @readonly
     * @deprecated since v3.3
     */
    dpadRight: 1001,

    /**
     * @en The dpad up key
     * @zh 导航键 向上
     * @readonly
     * @deprecated since v3.3
     */
    dpadUp: 1003,

    /**
     * @en The dpad down key
     * @zh 导航键 向下
     * @readonly
     * @deprecated since v3.3
     */
    dpadDown: 1004,

    /**
     * @en The dpad center key
     * @zh 导航键 确定键
     * @readonly
     * @deprecated since v3.3
     */
    dpadCenter: 1005,
};
/**
 * @en
 * Predefined constants, see [[Macro]] for detailed contents.
 * @zh
 * 预定义常量，具体内容参考 [[Macro]] 文档。
 */
/**
 * @en Interface declaration for predefined constants, for usage you should be importing [[macro]] directly.
 * @zh 预定义常量的接口声明，实际使用应该直接导入 [[macro]]。
 */
interface Macro {
    /**
     * @en
     * The image format supported by the engine, the actual supported formats may differ in different build platforms and device types.
     * Currently contains ['.astc', '.pkm', '.pvr', '.webp', '.jpg', '.jpeg', '.bmp', '.png'].
     * @zh
     * 引擎默认支持的图片格式，实际运行时支持的格式可能在不同的构建平台和设备类型上有所差别。
     * 目前包含的格式有 ['.astc', '.pkm', '.pvr', '.webp', '.jpg', '.jpeg', '.bmp', '.png']。
     */
    SUPPORT_TEXTURE_FORMATS: string[];

    /**
     * @en Key map for keyboard event
     * @zh 键盘事件的按键值。
     * @example {@link cocos/core/platform/CCCommon/KEY.js}
     * @deprecated since v3.3 please use [[KeyCode]] instead
     */
    KEY: typeof KEY;

    /**
     * @en One angle in radian, equals to PI / 180
     * @zh 弧度制中的单位角度，等同于 PI / 180
     */
    RAD: number;

    /**
     * @en One radian in angle, equals to 180 / PI
     * @zh 角度制中的单位弧度，等同于 180 / PI
     */
    DEG: number;

    /**
     * @en A maximum value of number representing infinity repeat times
     * @zh 重复执行的最大值，实际取值为数字的最大值
     */
    REPEAT_FOREVER: number;

    /**
     * @en A float value for representing a minimum error in comparison
     * @zh 用于比较时可忽略的浮点误差值
     */
    FLT_EPSILON: number;

    // Possible device orientations
    /**
     * @en Oriented vertically
     * @zh 竖屏朝向
     */
    ORIENTATION_PORTRAIT: number;

    /**
     * @en Inverted portrait orientation, with the device bottom facing upward.
     * @zh 倒置竖屏，设备底部朝上
     */
    ORIENTATION_PORTRAIT_UPSIDE_DOWN: number;

    /**
     * @en Oriented horizontally. Users cannot directly listen to this value; they need to listen for ORIENTATION_LANDSCAPE_LEFT or ORIENTATION_LANDSCAPE_RIGHT.
     * @zh 横屏朝向, 外部不能直接监听该值，需要监听 ORIENTATION_LANDSCAPE_LEFT 或 ORIENTATION_LANDSCAPE_RIGHT
     */
    ORIENTATION_LANDSCAPE: number;

    /**
     * @en Oriented horizontally, top side facing to the left. Supported only on mobile devices.
     * @zh 水平方向，顶部朝向左侧;仅移动端支持
     */
    ORIENTATION_LANDSCAPE_LEFT: number;

    /**
     * @en Oriented horizontally, top side facing to the right. Supported only on mobile devices.
     * @zh 水平方向，顶部朝向右侧;仅移动端支持
     */
    ORIENTATION_LANDSCAPE_RIGHT: number;

    /**
     * @en Oriented automatically
     * @zh 自动适配朝向
     */
    ORIENTATION_AUTO: number;

    /**
     * @en
     * Whether or not enabled tiled map auto culling. If you set the TiledMap skew or rotation,
     * then need to manually disable this, otherwise, the rendering will be wrong.
     * Currently not used in 3D engine
     * @zh
     * 是否开启瓦片地图的自动裁减功能。瓦片地图如果设置了 skew, rotation 的话，需要手动关闭，否则渲染会出错。
     * 在 3D 引擎中暂时无效。
     * @default true
     * @deprecated since v3.0
     */
    ENABLE_TILEDMAP_CULLING: boolean;

    /**
     * @en
     * The timeout to determine whether a touch is no longer active and should be removed.
     * The reason to add this timeout is due to an issue in X5 browser core,
     * when X5 is presented in wechat on Android, if a touch is glissed from the bottom up, and leave the page area,
     * no touch cancel event is triggered, and the touch will be considered active forever.
     * After multiple times of this action, our maximum touches number will be reached and all new touches will be ignored.
     * So this new mechanism can remove the touch that should be inactive if it's not updated during the last 5000 milliseconds.
     * Though it might remove a real touch if it's just not moving for the last 5 seconds,
     * which is not easy with the sensibility of mobile touch screen.
     * You can modify this value to have a better behavior if you find it's not enough.
     * @zh
     * 用于甄别一个触点对象是否已经失效并且可以被移除的延时时长
     * 添加这个时长的原因是 X5 内核在微信浏览器中出现的一个 bug。
     * 在这个环境下，如果用户将一个触点从底向上移出页面区域，将不会触发任何 touch cancel 或 touch end 事件，而这个触点会被永远当作停留在页面上的有效触点。
     * 重复这样操作几次之后，屏幕上的触点数量将达到我们的事件系统所支持的最高触点数量，之后所有的触摸事件都将被忽略。
     * 所以这个新的机制可以在触点在一定时间内没有任何更新的情况下视为失效触点并从事件系统中移除。
     * 当然，这也可能移除一个真实的触点，如果用户的触点真的在一定时间段内完全没有移动（这在当前手机屏幕的灵敏度下会很难）。
     * 你可以修改这个值来获得你需要的效果，默认值是 5000 毫秒。
     * @default 5000
     */
    TOUCH_TIMEOUT: number;

    /**
     * @en
     * Boolean that indicates if the canvas contains an alpha channel, default sets to false for better performance.
     * Though if you want to make your canvas background transparent and show other dom elements at the background,
     * you can set it to true before [[game.init]].
     * Web only.
     * @zh
     * 用于设置 Canvas 背景是否支持 alpha 通道，默认为 false，这样可以有更高的性能表现。
     * 如果你希望 Canvas 背景是透明的，并显示背后的其他 DOM 元素，你可以在 [[game.init]] 之前将这个值设为 true。
     * 仅支持 Web
     * @default false
     */
    ENABLE_TRANSPARENT_CANVAS: boolean;

    /**
     * @en
     * Boolean that indicates if the GL context is created with `antialias` option turned on, default value is false.
     * Set it to true could make your game graphics slightly smoother, like texture hard edges when rotated.
     * Whether to use this really depend on your game design and targeted platform,
     * device with retina display usually have good detail on graphics with or without this option,
     * you probably don't want antialias if your game style is pixel art based.
     * Also, it could have great performance impact with some browser / device using software MSAA.
     * You can set it to true before [[game.init]].
     * Only affect OpenGL ES and WebGL backend
     * @zh
     * 用于设置在创建 GL Context 时是否开启抗锯齿选项，默认值是 false。
     * 将这个选项设置为 true 会让你的游戏画面稍稍平滑一些，比如旋转硬边贴图时的锯齿。是否开启这个选项很大程度上取决于你的游戏和面向的平台。
     * 在大多数拥有 retina 级别屏幕的设备上用户往往无法区分这个选项带来的变化；如果你的游戏选择像素艺术风格，你也多半不会想开启这个选项。
     * 同时，在少部分使用软件级别抗锯齿算法的设备或浏览器上，这个选项会对性能产生比较大的影响。
     * 你可以在 [[game.init]] 之前设置这个值，否则它不会生效。
     * 仅影响 WebGL 后端
     * @default true
     */
    ENABLE_WEBGL_ANTIALIAS: boolean;

    /**
     * @en
     * Used to set float output render target, more accurate multiple light sources, fog, and translucent effects, custom pipeline only, the default value is false.
     * @zh
     * 用于开启浮点格式的RT输出, 更精确的多光源、雾化和半透明效果, 仅用于自定义管线, 默认值为 false。
     * @default false
     */
    ENABLE_FLOAT_OUTPUT: boolean;

    /**
     * @en
     * Whether to clear the original image cache after uploaded a texture to GPU.
     * If cleared, [Dynamic Atlas](https://docs.cocos.com/creator/manual/en/advanced-topics/dynamic-atlas.html) will not be supported.
     * Normally you don't need to enable this option on the web platform, because Image object doesn't consume too much memory.
     * But on Wechat Game platform, the current version cache decoded data in Image object, which has high memory usage.
     * So we enabled this option by default on Wechat, so that we can release Image cache immediately after uploaded to GPU.
     * Currently not useful in 3D engine
     * @zh
     * 是否在将贴图上传至 GPU 之后删除原始图片缓存，删除之后图片将无法进行 [动态合图](https://docs.cocos.com/creator/manual/zh/advanced-topics/dynamic-atlas.html)。
     * 在 Web 平台，你通常不需要开启这个选项，因为在 Web 平台 Image 对象所占用的内存很小。
     * 但是在微信小游戏平台的当前版本，Image 对象会缓存解码后的图片数据，它所占用的内存空间很大。
     * 所以我们在微信平台默认开启了这个选项，这样我们就可以在上传 GL 贴图之后立即释放 Image 对象的内存，避免过高的内存占用。
     * 在 3D 引擎中暂时无效。
     * @default false
     */
    CLEANUP_IMAGE_CACHE: boolean;

    /**
     * @en
     * Whether to enable multi-touch.
     * @zh
     * 是否开启多点触摸
     * @default true
     */
    ENABLE_MULTI_TOUCH: boolean;

    /**
     * @en
     * The maximum size of the canvas pool used by Label, please adjust according to the number of label component in the same scene of the project
     * @zh
     * Label 使用的 canvas pool 的最大大小，请根据项目同场景的 label 数量进行调整
     * @default 20
     */
    MAX_LABEL_CANVAS_POOL_SIZE: number;

    /**
     * @en
     * Boolean that indicates if enable highp precision data in structure with fragment shader.
     * Enable this option will make the variables defined by the HIGHP_VALUE_STRUCT_DEFINE macro in the shader more accurate, such as position.
     * Enable this option can avoid some distorted lighting effects. That depends on whether your game has abnormal lighting effects on this platform.
     * There will be a slight performance loss if enable this option, but the impact is not significant.
     * Only affect WebGL backend
     * @zh
     * 用于设置是否在片元着色器中使用结构体的时候，允许其中的数据使用highp精度
     * 将这个选项设置为 true 会让shader中使用HIGHP_VALUE_STRUCT_DEFINE宏定义的变量精度更高，比如位置信息等，避免出现一些失真的光照效果。是否开启这个选项很大程度上取决于你的游戏在此平台上是否出现了异常的表现。
     * 开启后会有轻微的性能损失，但影响不大。
     * 仅影响 WebGL 后端
     * @default false
     */
    ENABLE_WEBGL_HIGHP_STRUCT_VALUES: boolean;

    /**
     * @zh Batcher2D 中内存增量的大小（KB）
     * 这个值决定了当场景中存在的 2d 渲染组件的顶点数量超过当前 batcher2D 中可容纳的顶点数量时，内存扩充的增加量
     * 这个值越大，共用同一个 meshBuffer 的 2d 渲染组件数量会更多，但每次扩充所占用的内存也会更大
     * 默认值在标准格式（[[VertexFormat.vfmtPosUvColor]]）下可容纳 4096 个顶点（4096*9*4/1024），你可以增加容量来提升每个批次可容纳的元素数量
     * @en The MeshBuffer chunk size in Batcher2D (KB)
     * This value determines the increase in memory expansion,
     * when the number of vertices of 2d rendering components present in the scene exceeds the number of vertices,
     * that can be accommodated in the current batcher2D.
     * The larger this value is, the more 2d rendering components will share the same meshBuffer, but the more memory will be used for each expansion
     * The default size can contain 4096 standard vertex ([[VertexFormat.vfmtPosUvColor]]) in one buffer,
     * you can user larger buffer size to increase the elements count per 2d draw batch.
     * @default 144 KB
     */
    BATCHER2D_MEM_INCREMENT: number;

    /**
     * @zh 自定义渲染管线的名字（实验性）
     * 引擎会根据名字创建对应的渲染管线（仅限Web平台）。如果名字为空，则不启用自定义渲染管线。
     * 目前仅支持'Forward', 'Deferred'两种。
     * @en The name of custom rendering pipeline (experimental)
     * Engine will use the name to create the custom pipeline (Web only). If the name is empty, custom pipeline will be disabled.
     * Currently only 'Forward' and 'Deferred' are supported.
     */
    CUSTOM_PIPELINE_NAME: string;

    /**
     * @internal
     */
    init (): void;
}

/**
 * @en
 * Predefined constants, see [[Macro]] for detailed contents.
 * @zh
 * 预定义常量，具体内容参考 [[Macro]] 文档。
 */
const macro: Macro = {
    SUPPORT_TEXTURE_FORMATS,
    KEY,
    RAD: Math.PI / 180,
    DEG: 180 / Math.PI,
    REPEAT_FOREVER: (Number.MAX_VALUE - 1),
    FLT_EPSILON: 0.0000001192092896,
    ORIENTATION_PORTRAIT: Orientation.PORTRAIT,
    ORIENTATION_PORTRAIT_UPSIDE_DOWN: Orientation.PORTRAIT_UPSIDE_DOWN,
    ORIENTATION_LANDSCAPE: Orientation.LANDSCAPE,
    ORIENTATION_LANDSCAPE_LEFT: Orientation.LANDSCAPE_LEFT,
    ORIENTATION_LANDSCAPE_RIGHT: Orientation.LANDSCAPE_RIGHT,
    ORIENTATION_AUTO: Orientation.AUTO,
    ENABLE_TILEDMAP_CULLING: true,
    TOUCH_TIMEOUT: 5000,
    ENABLE_TRANSPARENT_CANVAS: false,
    ENABLE_WEBGL_ANTIALIAS: true,
    ENABLE_FLOAT_OUTPUT: false,
    CLEANUP_IMAGE_CACHE: false,
    ENABLE_MULTI_TOUCH: true,
    MAX_LABEL_CANVAS_POOL_SIZE: 20,
    ENABLE_WEBGL_HIGHP_STRUCT_VALUES: false,
    BATCHER2D_MEM_INCREMENT: 144,
    CUSTOM_PIPELINE_NAME: '',
    init () {
        if (NATIVE || MINIGAME || RUNTIME_BASED) {
            this.CLEANUP_IMAGE_CACHE = true;
        }
        const defaultValues = settings.querySettings(Settings.Category.ENGINE, 'macros');
        if (defaultValues) {
            for (const key in defaultValues) {
                macro[key] = defaultValues[key];
            }
        }
        if (PREVIEW || EDITOR) {
            this.ENABLE_WEBGL_ANTIALIAS = true;
        }
        if (EDITOR) {
            this.ENABLE_TRANSPARENT_CANVAS = false;
        }
    },
};

legacyCC.macro = macro;
export { macro };
export type { Macro };
