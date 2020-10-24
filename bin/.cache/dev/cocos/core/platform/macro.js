(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports);
    global.macro = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.macro = void 0;

  /*
   Copyright (c) 2008-2010 Ricardo Quesada
   Copyright (c) 2011-2012 cocos2d-x.org
   Copyright (c) 2013-2016 Chukong Technologies Inc.
   Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  
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
  */

  /**
   * @category core
   */
  var SUPPORT_TEXTURE_FORMATS = ['.astc', '.pkm', '.pvr', '.webp', '.jpg', '.jpeg', '.bmp', '.png'];
  var KEY = {
    /**
     * @en None
     * @zh 没有分配
     * @readonly
     */
    'none': 0,
    // android

    /**
     * @en The back key
     * @zh 返回键
     * @readonly
     */
    'back': 6,

    /**
     * @en The menu key
     * @zh 菜单键
     * @readonly
     */
    'menu': 18,

    /**
     * @en The backspace key
     * @zh 退格键
     * @readonly
     */
    'backspace': 8,

    /**
     * @en The tab key
     * @zh Tab 键
     * @readonly
     */
    'tab': 9,

    /**
     * @en The enter key
     * @zh 回车键
     * @readonly
     */
    'enter': 13,

    /**
     * @en The shift key
     * @zh Shift 键
     * @readonly
     */
    'shift': 16,
    // should use shiftkey instead

    /**
     * @en The ctrl key
     * @zh Ctrl 键
     * @readonly
     */
    'ctrl': 17,
    // should use ctrlkey

    /**
     * @en The alt key
     * @zh Alt 键
     * @readonly
     */
    'alt': 18,
    // should use altkey

    /**
     * @en The pause key
     * @zh 暂停键
     * @readonly
     */
    'pause': 19,

    /**
     * @en The caps lock key
     * @zh 大写锁定键
     * @readonly
     */
    'capslock': 20,

    /**
     * @en The esc key
     * @zh ESC 键
     * @readonly
     */
    'escape': 27,

    /**
     * @en The space key
     * @zh 空格键
     * @readonly
     */
    'space': 32,

    /**
     * @en The page up key
     * @zh 向上翻页键
     * @readonly
     */
    'pageup': 33,

    /**
     * @en The page down key
     * @zh 向下翻页键
     * @readonly
     */
    'pagedown': 34,

    /**
     * @en The end key
     * @zh 结束键
     * @readonly
     */
    'end': 35,

    /**
     * @en The home key
     * @zh 主菜单键
     * @readonly
     */
    'home': 36,

    /**
     * @en The left key
     * @zh 向左箭头键
     * @readonly
     */
    'left': 37,

    /**
     * @en The up key
     * @zh 向上箭头键
     * @readonly
     */
    'up': 38,

    /**
     * @en The right key
     * @zh 向右箭头键
     * @readonly
     */
    'right': 39,

    /**
     * @en The down key
     * @zh 向下箭头键
     * @readonly
     */
    'down': 40,

    /**
     * @en The select key
     * @zh Select 键
     * @readonly
     */
    'select': 41,

    /**
     * @en The insert key
     * @zh 插入键
     * @readonly
     */
    'insert': 45,

    /**
     * @en The Delete key
     * @zh 删除键
     * @readonly
     */
    'Delete': 46,

    /**
     * @en The '0' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 0 键
     * @readonly
     */
    '0': 48,

    /**
     * @en The '1' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 1 键
     * @readonly
     */
    '1': 49,

    /**
     * @en The '2' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 2 键
     * @readonly
     */
    '2': 50,

    /**
     * @en The '3' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 3 键
     * @readonly
     */
    '3': 51,

    /**
     * @en The '4' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 4 键
     * @readonly
     */
    '4': 52,

    /**
     * @en The '5' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 5 键
     * @readonly
     */
    '5': 53,

    /**
     * @en The '6' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 6 键
     * @readonly
     */
    '6': 54,

    /**
     * @en The '7' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 7 键
     * @readonly
     */
    '7': 55,

    /**
     * @en The '8' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 8 键
     * @readonly
     */
    '8': 56,

    /**
     * @en The '9' key on the top of the alphanumeric keyboard.
     * @zh 字母键盘上的 9 键
     * @readonly
     */
    '9': 57,

    /**
     * @en The a key
     * @zh A 键
     * @readonly
     */
    'a': 65,

    /**
     * @en The b key
     * @zh B 键
     * @readonly
     */
    'b': 66,

    /**
     * @en The c key
     * @zh C 键
     * @readonly
     */
    'c': 67,

    /**
     * @en The d key
     * @zh D 键
     * @readonly
     */
    'd': 68,

    /**
     * @en The e key
     * @zh E 键
     * @readonly
     */
    'e': 69,

    /**
     * @en The f key
     * @zh F 键
     * @readonly
     */
    'f': 70,

    /**
     * @en The g key
     * @zh G 键
     * @readonly
     */
    'g': 71,

    /**
     * @en The h key
     * @zh H 键
     * @readonly
     */
    'h': 72,

    /**
     * @en The i key
     * @zh I 键
     * @readonly
     */
    'i': 73,

    /**
     * @en The j key
     * @zh J 键
     * @readonly
     */
    'j': 74,

    /**
     * @en The k key
     * @zh K 键
     * @readonly
     */
    'k': 75,

    /**
     * @en The l key
     * @zh L 键
     * @readonly
     */
    'l': 76,

    /**
     * @en The m key
     * @zh M 键
     * @readonly
     */
    'm': 77,

    /**
     * @en The n key
     * @zh N 键
     * @readonly
     */
    'n': 78,

    /**
     * @en The o key
     * @zh O 键
     * @readonly
     */
    'o': 79,

    /**
     * @en The p key
     * @zh P 键
     * @readonly
     */
    'p': 80,

    /**
     * @en The q key
     * @zh Q 键
     * @readonly
     */
    'q': 81,

    /**
     * @en The r key
     * @zh R 键
     * @readonly
     */
    'r': 82,

    /**
     * @en The s key
     * @zh S 键
     * @readonly
     */
    's': 83,

    /**
     * @en The t key
     * @zh T 键
     * @readonly
     */
    't': 84,

    /**
     * @en The u key
     * @zh U 键
     * @readonly
     */
    'u': 85,

    /**
     * @en The v key
     * @zh V 键
     * @readonly
     */
    'v': 86,

    /**
     * @en The w key
     * @zh W 键
     * @readonly
     */
    'w': 87,

    /**
     * @en The x key
     * @zh X 键
     * @readonly
     */
    'x': 88,

    /**
     * @en The y key
     * @zh Y 键
     * @readonly
     */
    'y': 89,

    /**
     * @en The z key
     * @zh Z 键
     * @readonly
     */
    'z': 90,

    /**
     * @en The numeric keypad 0
     * @zh 数字键盘 0
     * @readonly
     */
    'num0': 96,

    /**
     * @en The numeric keypad 1
     * @zh 数字键盘 1
     * @readonly
     */
    'num1': 97,

    /**
     * @en The numeric keypad 2
     * @zh 数字键盘 2
     * @readonly
     */
    'num2': 98,

    /**
     * @en The numeric keypad 3
     * @zh 数字键盘 3
     * @readonly
     */
    'num3': 99,

    /**
     * @en The numeric keypad 4
     * @zh 数字键盘 4
     * @readonly
     */
    'num4': 100,

    /**
     * @en The numeric keypad 5
     * @zh 数字键盘 5
     * @readonly
     */
    'num5': 101,

    /**
     * @en The numeric keypad 6
     * @zh 数字键盘 6
     * @readonly
     */
    'num6': 102,

    /**
     * @en The numeric keypad 7
     * @zh 数字键盘 7
     * @readonly
     */
    'num7': 103,

    /**
     * @en The numeric keypad 8
     * @zh 数字键盘 8
     * @readonly
     */
    'num8': 104,

    /**
     * @en The numeric keypad 9
     * @zh 数字键盘 9
     * @readonly
     */
    'num9': 105,

    /**
     * @en The numeric keypad '*'
     * @zh 数字键盘 *
     * @readonly
     */
    '*': 106,

    /**
     * @en The numeric keypad '+'
     * @zh 数字键盘 +
     * @readonly
     */
    '+': 107,

    /**
     * @en The numeric keypad '-'
     * @zh 数字键盘 -
     * @readonly
     */
    '-': 109,

    /**
     * @en The numeric keypad 'delete'
     * @zh 数字键盘删除键
     * @readonly
     */
    'numdel': 110,

    /**
     * @en The numeric keypad '/'
     * @zh 数字键盘 /
     * @readonly
     */
    '/': 111,

    /**
     * @en The F1 function key
     * @zh F1 功能键
     * @readonly
     */
    'f1': 112,
    // f1-f12 dont work on ie

    /**
     * @en The F2 function key
     * @zh F2 功能键
     * @readonly
     */
    'f2': 113,

    /**
     * @en The F3 function key
     * @zh F3 功能键
     * @readonly
     */
    'f3': 114,

    /**
     * @en The F4 function key
     * @zh F4 功能键
     * @readonly
     */
    'f4': 115,

    /**
     * @en The F5 function key
     * @zh F5 功能键
     * @readonly
     */
    'f5': 116,

    /**
     * @en The F6 function key
     * @zh F6 功能键
     * @readonly
     */
    'f6': 117,

    /**
     * @en The F7 function key
     * @zh F7 功能键
     * @readonly
     */
    'f7': 118,

    /**
     * @en The F8 function key
     * @zh F8 功能键
     * @readonly
     */
    'f8': 119,

    /**
     * @en The F9 function key
     * @zh F9 功能键
     * @readonly
     */
    'f9': 120,

    /**
     * @en The F10 function key
     * @zh F10 功能键
     * @readonly
     */
    'f10': 121,

    /**
     * @en The F11 function key
     * @zh F11 功能键
     * @readonly
     */
    'f11': 122,

    /**
     * @en The F12 function key
     * @zh F12 功能键
     * @readonly
     */
    'f12': 123,

    /**
     * @en The numlock key
     * @zh 数字锁定键
     * @readonly
     */
    'numlock': 144,

    /**
     * @en The scroll lock key
     * @zh 滚动锁定键
     * @readonly
     */
    'scrolllock': 145,

    /**
     * @en The ';' key.
     * @zh 分号键
     * @readonly
     */
    ';': 186,

    /**
     * @en The ';' key.
     * @zh 分号键
     * @readonly
     */
    'semicolon': 186,

    /**
     * @en The '=' key.
     * @zh 等于号键
     * @readonly
     */
    'equal': 187,

    /**
     * @en The '=' key.
     * @zh 等于号键
     * @readonly
     */
    '=': 187,

    /**
     * @en The ',' key.
     * @zh 逗号键
     * @readonly
     */
    ',': 188,

    /**
     * @en The ',' key.
     * @zh 逗号键
     * @readonly
     */
    'comma': 188,

    /**
     * @en The dash '-' key.
     * @zh 中划线键
     * @readonly
     */
    'dash': 189,

    /**
     * @en The '.' key.
     * @zh 句号键
     * @readonly
     */
    '.': 190,

    /**
     * @en The '.' key
     * @zh 句号键
     * @readonly
     */
    'period': 190,

    /**
     * @en The forward slash key
     * @zh 正斜杠键
     * @readonly
     */
    'forwardslash': 191,

    /**
     * @en The grave key
     * @zh 按键 `
     * @readonly
     */
    'grave': 192,

    /**
     * @en The '[' key
     * @zh 按键 [
     * @readonly
     */
    '[': 219,

    /**
     * @en The '[' key
     * @zh 按键 [
     * @readonly
     */
    'openbracket': 219,

    /**
     * @en The '\' key
     * @zh 反斜杠键
     * @readonly
     */
    'backslash': 220,

    /**
     * @en The ']' key
     * @zh 按键 ]
     * @readonly
     */
    ']': 221,

    /**
     * @en The ']' key
     * @zh 按键 ]
     * @readonly
     */
    'closebracket': 221,

    /**
     * @en The quote key
     * @zh 单引号键
     * @readonly
     */
    'quote': 222,
    // gamepad controll

    /**
     * @en The dpad left key
     * @zh 导航键 向左
     * @readonly
     */
    'dpadLeft': 1000,

    /**
     * @en The dpad right key
     * @zh 导航键 向右
     * @readonly
     */
    'dpadRight': 1001,

    /**
     * @en The dpad up key
     * @zh 导航键 向上
     * @readonly
     */
    'dpadUp': 1003,

    /**
     * @en The dpad down key
     * @zh 导航键 向下
     * @readonly
     */
    'dpadDown': 1004,

    /**
     * @en The dpad center key
     * @zh 导航键 确定键
     * @readonly
     */
    'dpadCenter': 1005
  };
  /**
   * @en
   * Predefined constants
   * @zh
   * 预定义常量。
   */

  var macro = {
    /**
     * @en
     * The image format supported by the engine defaults, and the supported formats may differ in different build platforms and device types.
     * Currently all platform and device support ['.webp', '.jpg', '.jpeg', '.bmp', '.png'], ios mobile platform
     * @zh
     * 引擎默认支持的图片格式，支持的格式可能在不同的构建平台和设备类型上有所差别。
     * 目前所有平台和设备支持的格式有 ['.webp', '.jpg', '.jpeg', '.bmp', '.png']. The iOS mobile platform also supports the PVR format。
     */
    SUPPORT_TEXTURE_FORMATS: SUPPORT_TEXTURE_FORMATS,

    /**
     * @en Key map for keyboard event
     * @zh 键盘事件的按键值。
     * @example {@link cocos/core/platform/CCCommon/KEY.js}
     */
    KEY: KEY,

    /**
     * PI / 180
     */
    RAD: Math.PI / 180,

    /**
     * One degree
     */
    DEG: 180 / Math.PI,

    /**
     * A maximum value of number
     */
    REPEAT_FOREVER: Number.MAX_VALUE - 1,

    /**
     * A minimal float value
     */
    FLT_EPSILON: 0.0000001192092896,
    // Possible device orientations

    /**
     * @en Oriented vertically
     * @zh 竖屏朝向
     */
    ORIENTATION_PORTRAIT: 1,

    /**
     * @en Oriented horizontally
     * @zh 横屏朝向
     */
    ORIENTATION_LANDSCAPE: 2,

    /**
     * @en Oriented automatically
     * @zh 自动适配朝向
     */
    ORIENTATION_AUTO: 3,

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
     *  Affected component:                                                                 <br/>
     *      - TMXLayer                                                       <br/>
     *                                                                                  <br/>
     *  Enabled by default. To disabled set it to 0. <br/>
     *  To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * Currently not useful in 3D engine
     */
    // FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX: true,

    /**
     * @en
     * Whether or not enabled tiled map auto culling. If you set the TiledMap skew or rotation,
     * then need to manually disable this, otherwise, the rendering will be wrong.
     * Currently not useful in 3D engine
     * @zh
     * 是否开启瓦片地图的自动裁减功能。瓦片地图如果设置了 skew, rotation 的话，需要手动关闭，否则渲染会出错。
     * 在 3D 引擎中暂时无效。
     * @default true
     */
    ENABLE_TILEDMAP_CULLING: true,

    /**
     * @en
     * The timeout to determine whether a touch is no longer active and should be removed.
     * The reason to add this timeout is due to an issue in X5 browser core,
     * when X5 is presented in wechat on Android, if a touch is glissed from the bottom up, and leave the page area,
     * no touch cancel event is triggered, and the touch will be considered active forever.
     * After multiple times of this action, our maximum touches number will be reached and all new touches will be ignored.
     * So this new mechanism can remove the touch that should be inactive if it's not updated during the last 5000 milliseconds.
     * Though it might remove a real touch if it's just not moving for the last 5 seconds which is not easy with the sensibility of mobile touch screen.
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
    TOUCH_TIMEOUT: 5000,

    /**
     * @en
     * The max concurrent task number for the downloader
     * @zh
     * 下载任务的最大并发数限制，在安卓平台部分机型或版本上可能需要限制在较低的水平
     * @default 64
     */
    DOWNLOAD_MAX_CONCURRENT: 64,

    /**
     * @en
     * Boolean that indicates if the canvas contains an alpha channel, default sets to false for better performance.
     * Though if you want to make your canvas background transparent and show other dom elements at the background,
     * you can set it to true before {{game.init}}.
     * Web only.
     * @zh
     * 用于设置 Canvas 背景是否支持 alpha 通道，默认为 false，这样可以有更高的性能表现。
     * 如果你希望 Canvas 背景是透明的，并显示背后的其他 DOM 元素，你可以在 {{game.init}} 之前将这个值设为 true。
     * 仅支持 Web
     * @default false
     */
    ENABLE_TRANSPARENT_CANVAS: false,

    /**
     * @en
     * Boolean that indicates if the WebGL context is created with `antialias` option turned on, default value is false.
     * Set it to true could make your game graphics slightly smoother, like texture hard edges when rotated.
     * Whether to use this really depend on your game design and targeted platform,
     * device with retina display usually have good detail on graphics with or without this option,
     * you probably don't want antialias if your game style is pixel art based.
     * Also, it could have great performance impact with some browser / device using software MSAA.
     * You can set it to true before {{game.init}}.
     * Web only.
     * @zh
     * 用于设置在创建 WebGL Context 时是否开启抗锯齿选项，默认值是 false。
     * 将这个选项设置为 true 会让你的游戏画面稍稍平滑一些，比如旋转硬边贴图时的锯齿。是否开启这个选项很大程度上取决于你的游戏和面向的平台。
     * 在大多数拥有 retina 级别屏幕的设备上用户往往无法区分这个选项带来的变化；如果你的游戏选择像素艺术风格，你也多半不会想开启这个选项。
     * 同时，在少部分使用软件级别抗锯齿算法的设备或浏览器上，这个选项会对性能产生比较大的影响。
     * 你可以在 {{game.init}} 之前设置这个值，否则它不会生效。
     * 仅支持 Web
     * @default false
     */
    ENABLE_WEBGL_ANTIALIAS: false,

    /**
     * @en
     * Whether or not clear dom Image object cache after uploading to gl texture.
     * Concretely, we are setting image.src to empty string to release the cache.
     * Normally you don't need to enable this option, because on web the Image object doesn't consume too much memory.
     * But on Wechat Game platform, the current version cache decoded data in Image object, which has high memory usage.
     * So we enabled this option by default on Wechat, so that we can release Image cache immediately after uploaded to GPU.
     * Currently not useful in 3D engine
     * @zh
     * 是否在将贴图上传至 GPU 之后删除 DOM Image 缓存。
     * 具体来说，我们通过设置 image.src 为空字符串来释放这部分内存。
     * 正常情况下，你不需要开启这个选项，因为在 web 平台，Image 对象所占用的内存很小。
     * 但是在微信小游戏平台的当前版本，Image 对象会缓存解码后的图片数据，它所占用的内存空间很大。
     * 所以我们在微信平台默认开启了这个选项，这样我们就可以在上传 GL 贴图之后立即释放 Image 对象的内存，避免过高的内存占用。
     * 在 3D 引擎中暂时无效。
     * @default false
     */
    CLEANUP_IMAGE_CACHE: false,

    /**
     * @en
     * Whether to enable multi-touch.
     * @zh
     * 是否开启多点触摸
     * @default true
     */
    ENABLE_MULTI_TOUCH: true
  };
  _exports.macro = macro;
  _globalExports.legacyCC.macro = macro;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vbWFjcm8udHMiXSwibmFtZXMiOlsiU1VQUE9SVF9URVhUVVJFX0ZPUk1BVFMiLCJLRVkiLCJtYWNybyIsIlJBRCIsIk1hdGgiLCJQSSIsIkRFRyIsIlJFUEVBVF9GT1JFVkVSIiwiTnVtYmVyIiwiTUFYX1ZBTFVFIiwiRkxUX0VQU0lMT04iLCJPUklFTlRBVElPTl9QT1JUUkFJVCIsIk9SSUVOVEFUSU9OX0xBTkRTQ0FQRSIsIk9SSUVOVEFUSU9OX0FVVE8iLCJFTkFCTEVfVElMRURNQVBfQ1VMTElORyIsIlRPVUNIX1RJTUVPVVQiLCJET1dOTE9BRF9NQVhfQ09OQ1VSUkVOVCIsIkVOQUJMRV9UUkFOU1BBUkVOVF9DQU5WQVMiLCJFTkFCTEVfV0VCR0xfQU5USUFMSUFTIiwiQ0xFQU5VUF9JTUFHRV9DQUNIRSIsIkVOQUJMRV9NVUxUSV9UT1VDSCIsImxlZ2FjeUNDIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkE7OztBQU1BLE1BQU1BLHVCQUF1QixHQUFHLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsTUFBbEIsRUFBMEIsT0FBMUIsRUFBbUMsTUFBbkMsRUFBMkMsT0FBM0MsRUFBb0QsTUFBcEQsRUFBNEQsTUFBNUQsQ0FBaEM7QUFFQSxNQUFNQyxHQUFHLEdBQUc7QUFDUjs7Ozs7QUFLQSxZQUFRLENBTkE7QUFRUjs7QUFDQTs7Ozs7QUFLQSxZQUFRLENBZEE7O0FBZVI7Ozs7O0FBS0EsWUFBUSxFQXBCQTs7QUFzQlI7Ozs7O0FBS0EsaUJBQWEsQ0EzQkw7O0FBNkJSOzs7OztBQUtBLFdBQU8sQ0FsQ0M7O0FBb0NSOzs7OztBQUtBLGFBQVMsRUF6Q0Q7O0FBMkNSOzs7OztBQUtBLGFBQVMsRUFoREQ7QUFnREs7O0FBRWI7Ozs7O0FBS0EsWUFBUSxFQXZEQTtBQXVESTs7QUFFWjs7Ozs7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QixFQUFFLEtBMUpkOztBQTRKVjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkFDLElBQUFBLG1CQUFtQixFQUFFLEtBN0tYOztBQStLVDs7Ozs7OztBQU9EQyxJQUFBQSxrQkFBa0IsRUFBRTtBQXRMVixHQUFkOztBQXlMQUMsMEJBQVNuQixLQUFULEdBQWlCQSxLQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcclxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuXHJcbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxyXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvcmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmNvbnN0IFNVUFBPUlRfVEVYVFVSRV9GT1JNQVRTID0gWycuYXN0YycsICcucGttJywgJy5wdnInLCAnLndlYnAnLCAnLmpwZycsICcuanBlZycsICcuYm1wJywgJy5wbmcnXTtcclxuXHJcbmNvbnN0IEtFWSA9IHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIE5vbmVcclxuICAgICAqIEB6aCDmsqHmnInliIbphY1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnbm9uZSc6IDAsXHJcblxyXG4gICAgLy8gYW5kcm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGJhY2sga2V5XHJcbiAgICAgKiBAemgg6L+U5Zue6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2JhY2snOiA2LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIG1lbnUga2V5XHJcbiAgICAgKiBAemgg6I+c5Y2V6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ21lbnUnOiAxOCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgYmFja3NwYWNlIGtleVxyXG4gICAgICogQHpoIOmAgOagvOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdiYWNrc3BhY2UnOiA4LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0YWIga2V5XHJcbiAgICAgKiBAemggVGFiIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICd0YWInOiA5LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBlbnRlciBrZXlcclxuICAgICAqIEB6aCDlm57ovabplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZW50ZXInOiAxMyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgc2hpZnQga2V5XHJcbiAgICAgKiBAemggU2hpZnQg6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ3NoaWZ0JzogMTYsIC8vIHNob3VsZCB1c2Ugc2hpZnRrZXkgaW5zdGVhZFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBjdHJsIGtleVxyXG4gICAgICogQHpoIEN0cmwg6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2N0cmwnOiAxNywgLy8gc2hvdWxkIHVzZSBjdHJsa2V5XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGFsdCBrZXlcclxuICAgICAqIEB6aCBBbHQg6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2FsdCc6IDE4LCAvLyBzaG91bGQgdXNlIGFsdGtleVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBwYXVzZSBrZXlcclxuICAgICAqIEB6aCDmmoLlgZzplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAncGF1c2UnOiAxOSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgY2FwcyBsb2NrIGtleVxyXG4gICAgICogQHpoIOWkp+WGmemUgeWumumUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdjYXBzbG9jayc6IDIwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBlc2Mga2V5XHJcbiAgICAgKiBAemggRVNDIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdlc2NhcGUnOiAyNyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgc3BhY2Uga2V5XHJcbiAgICAgKiBAemgg56m65qC86ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ3NwYWNlJzogMzIsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHBhZ2UgdXAga2V5XHJcbiAgICAgKiBAemgg5ZCR5LiK57+76aG16ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ3BhZ2V1cCc6IDMzLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBwYWdlIGRvd24ga2V5XHJcbiAgICAgKiBAemgg5ZCR5LiL57+76aG16ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ3BhZ2Vkb3duJzogMzQsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGVuZCBrZXlcclxuICAgICAqIEB6aCDnu5PmnZ/plK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZW5kJzogMzUsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGhvbWUga2V5XHJcbiAgICAgKiBAemgg5Li76I+c5Y2V6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2hvbWUnOiAzNixcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbGVmdCBrZXlcclxuICAgICAqIEB6aCDlkJHlt6bnrq3lpLTplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnbGVmdCc6IDM3LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB1cCBrZXlcclxuICAgICAqIEB6aCDlkJHkuIrnrq3lpLTplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAndXAnOiAzOCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgcmlnaHQga2V5XHJcbiAgICAgKiBAemgg5ZCR5Y+z566t5aS06ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ3JpZ2h0JzogMzksXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGRvd24ga2V5XHJcbiAgICAgKiBAemgg5ZCR5LiL566t5aS06ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2Rvd24nOiA0MCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgc2VsZWN0IGtleVxyXG4gICAgICogQHpoIFNlbGVjdCDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnc2VsZWN0JzogNDEsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGluc2VydCBrZXlcclxuICAgICAqIEB6aCDmj5LlhaXplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnaW5zZXJ0JzogNDUsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIERlbGV0ZSBrZXlcclxuICAgICAqIEB6aCDliKDpmaTplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnRGVsZXRlJzogNDYsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICcwJyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxyXG4gICAgICogQHpoIOWtl+avjemUruebmOS4iueahCAwIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICcwJzogNDgsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICcxJyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxyXG4gICAgICogQHpoIOWtl+avjemUruebmOS4iueahCAxIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICcxJzogNDksXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICcyJyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxyXG4gICAgICogQHpoIOWtl+avjemUruebmOS4iueahCAyIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICcyJzogNTAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICczJyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxyXG4gICAgICogQHpoIOWtl+avjemUruebmOS4iueahCAzIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICczJzogNTEsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICc0JyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxyXG4gICAgICogQHpoIOWtl+avjemUruebmOS4iueahCA0IOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICc0JzogNTIsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICc1JyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxyXG4gICAgICogQHpoIOWtl+avjemUruebmOS4iueahCA1IOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICc1JzogNTMsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICc2JyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxyXG4gICAgICogQHpoIOWtl+avjemUruebmOS4iueahCA2IOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICc2JzogNTQsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICc3JyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxyXG4gICAgICogQHpoIOWtl+avjemUruebmOS4iueahCA3IOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICc3JzogNTUsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICc4JyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxyXG4gICAgICogQHpoIOWtl+avjemUruebmOS4iueahCA4IOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICc4JzogNTYsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICc5JyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxyXG4gICAgICogQHpoIOWtl+avjemUruebmOS4iueahCA5IOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICc5JzogNTcsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGEga2V5XHJcbiAgICAgKiBAemggQSDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnYSc6IDY1LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBiIGtleVxyXG4gICAgICogQHpoIEIg6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2InOiA2NixcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgYyBrZXlcclxuICAgICAqIEB6aCBDIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdjJzogNjcsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGQga2V5XHJcbiAgICAgKiBAemggRCDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZCc6IDY4LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBlIGtleVxyXG4gICAgICogQHpoIEUg6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2UnOiA2OSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZiBrZXlcclxuICAgICAqIEB6aCBGIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdmJzogNzAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGcga2V5XHJcbiAgICAgKiBAemggRyDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZyc6IDcxLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBoIGtleVxyXG4gICAgICogQHpoIEgg6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2gnOiA3MixcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgaSBrZXlcclxuICAgICAqIEB6aCBJIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdpJzogNzMsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGoga2V5XHJcbiAgICAgKiBAemggSiDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnaic6IDc0LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBrIGtleVxyXG4gICAgICogQHpoIEsg6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2snOiA3NSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbCBrZXlcclxuICAgICAqIEB6aCBMIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdsJzogNzYsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIG0ga2V5XHJcbiAgICAgKiBAemggTSDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnbSc6IDc3LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBuIGtleVxyXG4gICAgICogQHpoIE4g6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ24nOiA3OCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbyBrZXlcclxuICAgICAqIEB6aCBPIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdvJzogNzksXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHAga2V5XHJcbiAgICAgKiBAemggUCDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAncCc6IDgwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBxIGtleVxyXG4gICAgICogQHpoIFEg6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ3EnOiA4MSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgciBrZXlcclxuICAgICAqIEB6aCBSIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdyJzogODIsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHMga2V5XHJcbiAgICAgKiBAemggUyDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAncyc6IDgzLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0IGtleVxyXG4gICAgICogQHpoIFQg6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ3QnOiA4NCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgdSBrZXlcclxuICAgICAqIEB6aCBVIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICd1JzogODUsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHYga2V5XHJcbiAgICAgKiBAemggViDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAndic6IDg2LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB3IGtleVxyXG4gICAgICogQHpoIFcg6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ3cnOiA4NyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgeCBrZXlcclxuICAgICAqIEB6aCBYIOmUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICd4JzogODgsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHkga2V5XHJcbiAgICAgKiBAemggWSDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAneSc6IDg5LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB6IGtleVxyXG4gICAgICogQHpoIFog6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ3onOiA5MCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbnVtZXJpYyBrZXlwYWQgMFxyXG4gICAgICogQHpoIOaVsOWtl+mUruebmCAwXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ251bTAnOiA5NixcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbnVtZXJpYyBrZXlwYWQgMVxyXG4gICAgICogQHpoIOaVsOWtl+mUruebmCAxXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ251bTEnOiA5NyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbnVtZXJpYyBrZXlwYWQgMlxyXG4gICAgICogQHpoIOaVsOWtl+mUruebmCAyXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ251bTInOiA5OCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbnVtZXJpYyBrZXlwYWQgM1xyXG4gICAgICogQHpoIOaVsOWtl+mUruebmCAzXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ251bTMnOiA5OSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbnVtZXJpYyBrZXlwYWQgNFxyXG4gICAgICogQHpoIOaVsOWtl+mUruebmCA0XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ251bTQnOiAxMDAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIG51bWVyaWMga2V5cGFkIDVcclxuICAgICAqIEB6aCDmlbDlrZfplK7nm5ggNVxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdudW01JzogMTAxLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBudW1lcmljIGtleXBhZCA2XHJcbiAgICAgKiBAemgg5pWw5a2X6ZSu55uYIDZcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnbnVtNic6IDEwMixcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbnVtZXJpYyBrZXlwYWQgN1xyXG4gICAgICogQHpoIOaVsOWtl+mUruebmCA3XHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ251bTcnOiAxMDMsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIG51bWVyaWMga2V5cGFkIDhcclxuICAgICAqIEB6aCDmlbDlrZfplK7nm5ggOFxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdudW04JzogMTA0LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBudW1lcmljIGtleXBhZCA5XHJcbiAgICAgKiBAemgg5pWw5a2X6ZSu55uYIDlcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnbnVtOSc6IDEwNSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbnVtZXJpYyBrZXlwYWQgJyonXHJcbiAgICAgKiBAemgg5pWw5a2X6ZSu55uYICpcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnKic6IDEwNixcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbnVtZXJpYyBrZXlwYWQgJysnXHJcbiAgICAgKiBAemgg5pWw5a2X6ZSu55uYICtcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnKyc6IDEwNyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbnVtZXJpYyBrZXlwYWQgJy0nXHJcbiAgICAgKiBAemgg5pWw5a2X6ZSu55uYIC1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnLSc6IDEwOSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbnVtZXJpYyBrZXlwYWQgJ2RlbGV0ZSdcclxuICAgICAqIEB6aCDmlbDlrZfplK7nm5jliKDpmaTplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnbnVtZGVsJzogMTEwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBudW1lcmljIGtleXBhZCAnLydcclxuICAgICAqIEB6aCDmlbDlrZfplK7nm5ggL1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICcvJzogMTExLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBGMSBmdW5jdGlvbiBrZXlcclxuICAgICAqIEB6aCBGMSDlip/og73plK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZjEnOiAxMTIsIC8vIGYxLWYxMiBkb250IHdvcmsgb24gaWVcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgRjIgZnVuY3Rpb24ga2V5XHJcbiAgICAgKiBAemggRjIg5Yqf6IO96ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2YyJzogMTEzLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBGMyBmdW5jdGlvbiBrZXlcclxuICAgICAqIEB6aCBGMyDlip/og73plK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZjMnOiAxMTQsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIEY0IGZ1bmN0aW9uIGtleVxyXG4gICAgICogQHpoIEY0IOWKn+iDvemUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdmNCc6IDExNSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgRjUgZnVuY3Rpb24ga2V5XHJcbiAgICAgKiBAemggRjUg5Yqf6IO96ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2Y1JzogMTE2LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBGNiBmdW5jdGlvbiBrZXlcclxuICAgICAqIEB6aCBGNiDlip/og73plK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZjYnOiAxMTcsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIEY3IGZ1bmN0aW9uIGtleVxyXG4gICAgICogQHpoIEY3IOWKn+iDvemUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdmNyc6IDExOCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgRjggZnVuY3Rpb24ga2V5XHJcbiAgICAgKiBAemggRjgg5Yqf6IO96ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2Y4JzogMTE5LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBGOSBmdW5jdGlvbiBrZXlcclxuICAgICAqIEB6aCBGOSDlip/og73plK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZjknOiAxMjAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIEYxMCBmdW5jdGlvbiBrZXlcclxuICAgICAqIEB6aCBGMTAg5Yqf6IO96ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2YxMCc6IDEyMSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgRjExIGZ1bmN0aW9uIGtleVxyXG4gICAgICogQHpoIEYxMSDlip/og73plK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZjExJzogMTIyLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBGMTIgZnVuY3Rpb24ga2V5XHJcbiAgICAgKiBAemggRjEyIOWKn+iDvemUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdmMTInOiAxMjMsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIG51bWxvY2sga2V5XHJcbiAgICAgKiBAemgg5pWw5a2X6ZSB5a6a6ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ251bWxvY2snOiAxNDQsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHNjcm9sbCBsb2NrIGtleVxyXG4gICAgICogQHpoIOa7muWKqOmUgeWumumUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdzY3JvbGxsb2NrJzogMTQ1LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSAnOycga2V5LlxyXG4gICAgICogQHpoIOWIhuWPt+mUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICc7JzogMTg2LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSAnOycga2V5LlxyXG4gICAgICogQHpoIOWIhuWPt+mUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdzZW1pY29sb24nOiAxODYsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICc9JyBrZXkuXHJcbiAgICAgKiBAemgg562J5LqO5Y+36ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2VxdWFsJzogMTg3LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSAnPScga2V5LlxyXG4gICAgICogQHpoIOetieS6juWPt+mUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICc9JzogMTg3LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSAnLCcga2V5LlxyXG4gICAgICogQHpoIOmAl+WPt+mUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICcsJzogMTg4LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSAnLCcga2V5LlxyXG4gICAgICogQHpoIOmAl+WPt+mUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdjb21tYSc6IDE4OCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZGFzaCAnLScga2V5LlxyXG4gICAgICogQHpoIOS4reWIkue6v+mUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdkYXNoJzogMTg5LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSAnLicga2V5LlxyXG4gICAgICogQHpoIOWPpeWPt+mUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICcuJzogMTkwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSAnLicga2V5XHJcbiAgICAgKiBAemgg5Y+l5Y+36ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ3BlcmlvZCc6IDE5MCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZm9yd2FyZCBzbGFzaCBrZXlcclxuICAgICAqIEB6aCDmraPmlpzmnaDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZm9yd2FyZHNsYXNoJzogMTkxLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBncmF2ZSBrZXlcclxuICAgICAqIEB6aCDmjInplK4gYFxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdncmF2ZSc6IDE5MixcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgJ1snIGtleVxyXG4gICAgICogQHpoIOaMiemUriBbXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ1snOiAyMTksXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlICdbJyBrZXlcclxuICAgICAqIEB6aCDmjInplK4gW1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdvcGVuYnJhY2tldCc6IDIxOSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgJ1xcJyBrZXlcclxuICAgICAqIEB6aCDlj43mlpzmnaDplK5cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnYmFja3NsYXNoJzogMjIwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSAnXScga2V5XHJcbiAgICAgKiBAemgg5oyJ6ZSuIF1cclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnXSc6IDIyMSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgJ10nIGtleVxyXG4gICAgICogQHpoIOaMiemUriBdXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2Nsb3NlYnJhY2tldCc6IDIyMSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgcXVvdGUga2V5XHJcbiAgICAgKiBAemgg5Y2V5byV5Y+36ZSuXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ3F1b3RlJzogMjIyLFxyXG5cclxuICAgIC8vIGdhbWVwYWQgY29udHJvbGxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZHBhZCBsZWZ0IGtleVxyXG4gICAgICogQHpoIOWvvOiIqumUriDlkJHlt6ZcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZHBhZExlZnQnOiAxMDAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBkcGFkIHJpZ2h0IGtleVxyXG4gICAgICogQHpoIOWvvOiIqumUriDlkJHlj7NcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICAnZHBhZFJpZ2h0JzogMTAwMSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZHBhZCB1cCBrZXlcclxuICAgICAqIEB6aCDlr7zoiKrplK4g5ZCR5LiKXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2RwYWRVcCc6IDEwMDMsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGRwYWQgZG93biBrZXlcclxuICAgICAqIEB6aCDlr7zoiKrplK4g5ZCR5LiLXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgJ2RwYWREb3duJzogMTAwNCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZHBhZCBjZW50ZXIga2V5XHJcbiAgICAgKiBAemgg5a+86Iiq6ZSuIOehruWumumUrlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgICdkcGFkQ2VudGVyJzogMTAwNSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogUHJlZGVmaW5lZCBjb25zdGFudHNcclxuICogQHpoXHJcbiAqIOmihOWumuS5ieW4uOmHj+OAglxyXG4gKi9cclxuY29uc3QgbWFjcm8gPSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGltYWdlIGZvcm1hdCBzdXBwb3J0ZWQgYnkgdGhlIGVuZ2luZSBkZWZhdWx0cywgYW5kIHRoZSBzdXBwb3J0ZWQgZm9ybWF0cyBtYXkgZGlmZmVyIGluIGRpZmZlcmVudCBidWlsZCBwbGF0Zm9ybXMgYW5kIGRldmljZSB0eXBlcy5cclxuICAgICAqIEN1cnJlbnRseSBhbGwgcGxhdGZvcm0gYW5kIGRldmljZSBzdXBwb3J0IFsnLndlYnAnLCAnLmpwZycsICcuanBlZycsICcuYm1wJywgJy5wbmcnXSwgaW9zIG1vYmlsZSBwbGF0Zm9ybVxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvJXmk47pu5jorqTmlK/mjIHnmoTlm77niYfmoLzlvI/vvIzmlK/mjIHnmoTmoLzlvI/lj6/og73lnKjkuI3lkIznmoTmnoTlu7rlubPlj7Dlkozorr7lpIfnsbvlnovkuIrmnInmiYDlt67liKvjgIJcclxuICAgICAqIOebruWJjeaJgOacieW5s+WPsOWSjOiuvuWkh+aUr+aMgeeahOagvOW8j+aciSBbJy53ZWJwJywgJy5qcGcnLCAnLmpwZWcnLCAnLmJtcCcsICcucG5nJ10uIFRoZSBpT1MgbW9iaWxlIHBsYXRmb3JtIGFsc28gc3VwcG9ydHMgdGhlIFBWUiBmb3JtYXTjgIJcclxuICAgICAqL1xyXG4gICAgU1VQUE9SVF9URVhUVVJFX0ZPUk1BVFMsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gS2V5IG1hcCBmb3Iga2V5Ym9hcmQgZXZlbnRcclxuICAgICAqIEB6aCDplK7nm5jkuovku7bnmoTmjInplK7lgLzjgIJcclxuICAgICAqIEBleGFtcGxlIHtAbGluayBjb2Nvcy9jb3JlL3BsYXRmb3JtL0NDQ29tbW9uL0tFWS5qc31cclxuICAgICAqL1xyXG4gICAgS0VZLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUEkgLyAxODBcclxuICAgICAqL1xyXG4gICAgUkFEOiBNYXRoLlBJIC8gMTgwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT25lIGRlZ3JlZVxyXG4gICAgICovXHJcbiAgICBERUc6IDE4MCAvIE1hdGguUEksXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBIG1heGltdW0gdmFsdWUgb2YgbnVtYmVyXHJcbiAgICAgKi9cclxuICAgIFJFUEVBVF9GT1JFVkVSOiAoTnVtYmVyLk1BWF9WQUxVRSAtIDEpLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBtaW5pbWFsIGZsb2F0IHZhbHVlXHJcbiAgICAgKi9cclxuICAgIEZMVF9FUFNJTE9OOiAwLjAwMDAwMDExOTIwOTI4OTYsXHJcblxyXG4gICAgLy8gUG9zc2libGUgZGV2aWNlIG9yaWVudGF0aW9uc1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gT3JpZW50ZWQgdmVydGljYWxseVxyXG4gICAgICogQHpoIOerluWxj+acneWQkVxyXG4gICAgICovXHJcbiAgICBPUklFTlRBVElPTl9QT1JUUkFJVDogMSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBPcmllbnRlZCBob3Jpem9udGFsbHlcclxuICAgICAqIEB6aCDmqKrlsY/mnJ3lkJFcclxuICAgICAqL1xyXG4gICAgT1JJRU5UQVRJT05fTEFORFNDQVBFOiAyLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE9yaWVudGVkIGF1dG9tYXRpY2FsbHlcclxuICAgICAqIEB6aCDoh6rliqjpgILphY3mnJ3lkJFcclxuICAgICAqL1xyXG4gICAgT1JJRU5UQVRJT05fQVVUTzogMyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIDxwPlxyXG4gICAgICogICBJZiBlbmFibGVkLCB0aGUgdGV4dHVyZSBjb29yZGluYXRlcyB3aWxsIGJlIGNhbGN1bGF0ZWQgYnkgdXNpbmcgdGhpcyBmb3JtdWxhOiA8YnIvPlxyXG4gICAgICogICAgICAtIHRleENvb3JkLmxlZnQgPSAocmVjdC54KjIrMSkgLyAodGV4dHVyZS53aWRlKjIpOyAgICAgICAgICAgICAgICAgIDxici8+XHJcbiAgICAgKiAgICAgIC0gdGV4Q29vcmQucmlnaHQgPSB0ZXhDb29yZC5sZWZ0ICsgKHJlY3Qud2lkdGgqMi0yKS8odGV4dHVyZS53aWRlKjIpOyA8YnIvPlxyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxyXG4gICAgICogIFRoZSBzYW1lIGZvciBib3R0b20gYW5kIHRvcC4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxyXG4gICAgICogIFRoaXMgZm9ybXVsYSBwcmV2ZW50cyBhcnRpZmFjdHMgYnkgdXNpbmcgOTklIG9mIHRoZSB0ZXh0dXJlLiAgICAgICAgICAgICAgICAgICA8YnIvPlxyXG4gICAgICogIFRoZSBcImNvcnJlY3RcIiB3YXkgdG8gcHJldmVudCBhcnRpZmFjdHMgaXMgYnkgZXhwYW5kIHRoZSB0ZXh0dXJlJ3MgYm9yZGVyIHdpdGggdGhlIHNhbWUgY29sb3IgYnkgMSBwaXhlbDxici8+XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxyXG4gICAgICogIEFmZmVjdGVkIGNvbXBvbmVudDogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XHJcbiAgICAgKiAgICAgIC0gVE1YTGF5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XHJcbiAgICAgKiAgRW5hYmxlZCBieSBkZWZhdWx0LiBUbyBkaXNhYmxlZCBzZXQgaXQgdG8gMC4gPGJyLz5cclxuICAgICAqICBUbyBtb2RpZnkgaXQsIGluIFdlYiBlbmdpbmUgcGxlYXNlIHJlZmVyIHRvIENDTWFjcm8uanMsIGluIEpTQiBwbGVhc2UgcmVmZXIgdG8gQ0NDb25maWcuaFxyXG4gICAgICogPC9wPlxyXG4gICAgICogQ3VycmVudGx5IG5vdCB1c2VmdWwgaW4gM0QgZW5naW5lXHJcbiAgICAgKi9cclxuICAgIC8vIEZJWF9BUlRJRkFDVFNfQllfU1RSRUNISU5HX1RFWEVMX1RNWDogdHJ1ZSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogV2hldGhlciBvciBub3QgZW5hYmxlZCB0aWxlZCBtYXAgYXV0byBjdWxsaW5nLiBJZiB5b3Ugc2V0IHRoZSBUaWxlZE1hcCBza2V3IG9yIHJvdGF0aW9uLFxyXG4gICAgICogdGhlbiBuZWVkIHRvIG1hbnVhbGx5IGRpc2FibGUgdGhpcywgb3RoZXJ3aXNlLCB0aGUgcmVuZGVyaW5nIHdpbGwgYmUgd3JvbmcuXHJcbiAgICAgKiBDdXJyZW50bHkgbm90IHVzZWZ1bCBpbiAzRCBlbmdpbmVcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm5byA5ZCv55Om54mH5Zyw5Zu+55qE6Ieq5Yqo6KOB5YeP5Yqf6IO944CC55Om54mH5Zyw5Zu+5aaC5p6c6K6+572u5LqGIHNrZXcsIHJvdGF0aW9uIOeahOivne+8jOmcgOimgeaJi+WKqOWFs+mXre+8jOWQpuWImea4suafk+S8muWHuumUmeOAglxyXG4gICAgICog5ZyoIDNEIOW8leaTjuS4reaaguaXtuaXoOaViOOAglxyXG4gICAgICogQGRlZmF1bHQgdHJ1ZVxyXG4gICAgICovXHJcbiAgICBFTkFCTEVfVElMRURNQVBfQ1VMTElORzogdHJ1ZSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHRpbWVvdXQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSB0b3VjaCBpcyBubyBsb25nZXIgYWN0aXZlIGFuZCBzaG91bGQgYmUgcmVtb3ZlZC5cclxuICAgICAqIFRoZSByZWFzb24gdG8gYWRkIHRoaXMgdGltZW91dCBpcyBkdWUgdG8gYW4gaXNzdWUgaW4gWDUgYnJvd3NlciBjb3JlLFxyXG4gICAgICogd2hlbiBYNSBpcyBwcmVzZW50ZWQgaW4gd2VjaGF0IG9uIEFuZHJvaWQsIGlmIGEgdG91Y2ggaXMgZ2xpc3NlZCBmcm9tIHRoZSBib3R0b20gdXAsIGFuZCBsZWF2ZSB0aGUgcGFnZSBhcmVhLFxyXG4gICAgICogbm8gdG91Y2ggY2FuY2VsIGV2ZW50IGlzIHRyaWdnZXJlZCwgYW5kIHRoZSB0b3VjaCB3aWxsIGJlIGNvbnNpZGVyZWQgYWN0aXZlIGZvcmV2ZXIuXHJcbiAgICAgKiBBZnRlciBtdWx0aXBsZSB0aW1lcyBvZiB0aGlzIGFjdGlvbiwgb3VyIG1heGltdW0gdG91Y2hlcyBudW1iZXIgd2lsbCBiZSByZWFjaGVkIGFuZCBhbGwgbmV3IHRvdWNoZXMgd2lsbCBiZSBpZ25vcmVkLlxyXG4gICAgICogU28gdGhpcyBuZXcgbWVjaGFuaXNtIGNhbiByZW1vdmUgdGhlIHRvdWNoIHRoYXQgc2hvdWxkIGJlIGluYWN0aXZlIGlmIGl0J3Mgbm90IHVwZGF0ZWQgZHVyaW5nIHRoZSBsYXN0IDUwMDAgbWlsbGlzZWNvbmRzLlxyXG4gICAgICogVGhvdWdoIGl0IG1pZ2h0IHJlbW92ZSBhIHJlYWwgdG91Y2ggaWYgaXQncyBqdXN0IG5vdCBtb3ZpbmcgZm9yIHRoZSBsYXN0IDUgc2Vjb25kcyB3aGljaCBpcyBub3QgZWFzeSB3aXRoIHRoZSBzZW5zaWJpbGl0eSBvZiBtb2JpbGUgdG91Y2ggc2NyZWVuLlxyXG4gICAgICogWW91IGNhbiBtb2RpZnkgdGhpcyB2YWx1ZSB0byBoYXZlIGEgYmV0dGVyIGJlaGF2aW9yIGlmIHlvdSBmaW5kIGl0J3Mgbm90IGVub3VnaC5cclxuICAgICAqIEB6aFxyXG4gICAgICog55So5LqO55SE5Yir5LiA5Liq6Kem54K55a+56LGh5piv5ZCm5bey57uP5aSx5pWI5bm25LiU5Y+v5Lul6KKr56e76Zmk55qE5bu25pe25pe26ZW/XHJcbiAgICAgKiDmt7vliqDov5nkuKrml7bplb/nmoTljp/lm6DmmK8gWDUg5YaF5qC45Zyo5b6u5L+h5rWP6KeI5Zmo5Lit5Ye6546w55qE5LiA5LiqIGJ1Z+OAglxyXG4gICAgICog5Zyo6L+Z5Liq546v5aKD5LiL77yM5aaC5p6c55So5oi35bCG5LiA5Liq6Kem54K55LuO5bqV5ZCR5LiK56e75Ye66aG16Z2i5Yy65Z+f77yM5bCG5LiN5Lya6Kem5Y+R5Lu75L2VIHRvdWNoIGNhbmNlbCDmiJYgdG91Y2ggZW5kIOS6i+S7tu+8jOiAjOi/meS4quinpueCueS8muiiq+awuOi/nOW9k+S9nOWBnOeVmeWcqOmhtemdouS4iueahOacieaViOinpueCueOAglxyXG4gICAgICog6YeN5aSN6L+Z5qC35pON5L2c5Yeg5qyh5LmL5ZCO77yM5bGP5bmV5LiK55qE6Kem54K55pWw6YeP5bCG6L6+5Yiw5oiR5Lus55qE5LqL5Lu257O757uf5omA5pSv5oyB55qE5pyA6auY6Kem54K55pWw6YeP77yM5LmL5ZCO5omA5pyJ55qE6Kem5pG45LqL5Lu26YO95bCG6KKr5b+955Wl44CCXHJcbiAgICAgKiDmiYDku6Xov5nkuKrmlrDnmoTmnLrliLblj6/ku6XlnKjop6bngrnlnKjkuIDlrprml7bpl7TlhoXmsqHmnInku7vkvZXmm7TmlrDnmoTmg4XlhrXkuIvop4bkuLrlpLHmlYjop6bngrnlubbku47kuovku7bns7vnu5/kuK3np7vpmaTjgIJcclxuICAgICAqIOW9k+eEtu+8jOi/meS5n+WPr+iDveenu+mZpOS4gOS4quecn+WunueahOinpueCue+8jOWmguaenOeUqOaIt+eahOinpueCueecn+eahOWcqOS4gOWumuaXtumXtOauteWGheWujOWFqOayoeacieenu+WKqO+8iOi/meWcqOW9k+WJjeaJi+acuuWxj+W5leeahOeBteaVj+W6puS4i+S8muW+iOmavu+8ieOAglxyXG4gICAgICog5L2g5Y+v5Lul5L+u5pS56L+Z5Liq5YC85p2l6I635b6X5L2g6ZyA6KaB55qE5pWI5p6c77yM6buY6K6k5YC85pivIDUwMDAg5q+r56eS44CCXHJcbiAgICAgKiBAZGVmYXVsdCA1MDAwXHJcbiAgICAgKi9cclxuICAgIFRPVUNIX1RJTUVPVVQ6IDUwMDAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBtYXggY29uY3VycmVudCB0YXNrIG51bWJlciBmb3IgdGhlIGRvd25sb2FkZXJcclxuICAgICAqIEB6aFxyXG4gICAgICog5LiL6L295Lu75Yqh55qE5pyA5aSn5bm25Y+R5pWw6ZmQ5Yi277yM5Zyo5a6J5Y2T5bmz5Y+w6YOo5YiG5py65Z6L5oiW54mI5pys5LiK5Y+v6IO96ZyA6KaB6ZmQ5Yi25Zyo6L6D5L2O55qE5rC05bmzXHJcbiAgICAgKiBAZGVmYXVsdCA2NFxyXG4gICAgICovXHJcbiAgICBET1dOTE9BRF9NQVhfQ09OQ1VSUkVOVDogNjQsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEJvb2xlYW4gdGhhdCBpbmRpY2F0ZXMgaWYgdGhlIGNhbnZhcyBjb250YWlucyBhbiBhbHBoYSBjaGFubmVsLCBkZWZhdWx0IHNldHMgdG8gZmFsc2UgZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cclxuICAgICAqIFRob3VnaCBpZiB5b3Ugd2FudCB0byBtYWtlIHlvdXIgY2FudmFzIGJhY2tncm91bmQgdHJhbnNwYXJlbnQgYW5kIHNob3cgb3RoZXIgZG9tIGVsZW1lbnRzIGF0IHRoZSBiYWNrZ3JvdW5kLFxyXG4gICAgICogeW91IGNhbiBzZXQgaXQgdG8gdHJ1ZSBiZWZvcmUge3tnYW1lLmluaXR9fS5cclxuICAgICAqIFdlYiBvbmx5LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnlKjkuo7orr7nva4gQ2FudmFzIOiDjOaZr+aYr+WQpuaUr+aMgSBhbHBoYSDpgJrpgZPvvIzpu5jorqTkuLogZmFsc2XvvIzov5nmoLflj6/ku6XmnInmm7Tpq5jnmoTmgKfog73ooajnjrDjgIJcclxuICAgICAqIOWmguaenOS9oOW4jOacmyBDYW52YXMg6IOM5pmv5piv6YCP5piO55qE77yM5bm25pi+56S66IOM5ZCO55qE5YW25LuWIERPTSDlhYPntKDvvIzkvaDlj6/ku6XlnKgge3tnYW1lLmluaXR9fSDkuYvliY3lsIbov5nkuKrlgLzorr7kuLogdHJ1ZeOAglxyXG4gICAgICog5LuF5pSv5oyBIFdlYlxyXG4gICAgICogQGRlZmF1bHQgZmFsc2VcclxuICAgICAqL1xyXG4gICAgRU5BQkxFX1RSQU5TUEFSRU5UX0NBTlZBUzogZmFsc2UsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEJvb2xlYW4gdGhhdCBpbmRpY2F0ZXMgaWYgdGhlIFdlYkdMIGNvbnRleHQgaXMgY3JlYXRlZCB3aXRoIGBhbnRpYWxpYXNgIG9wdGlvbiB0dXJuZWQgb24sIGRlZmF1bHQgdmFsdWUgaXMgZmFsc2UuXHJcbiAgICAgKiBTZXQgaXQgdG8gdHJ1ZSBjb3VsZCBtYWtlIHlvdXIgZ2FtZSBncmFwaGljcyBzbGlnaHRseSBzbW9vdGhlciwgbGlrZSB0ZXh0dXJlIGhhcmQgZWRnZXMgd2hlbiByb3RhdGVkLlxyXG4gICAgICogV2hldGhlciB0byB1c2UgdGhpcyByZWFsbHkgZGVwZW5kIG9uIHlvdXIgZ2FtZSBkZXNpZ24gYW5kIHRhcmdldGVkIHBsYXRmb3JtLFxyXG4gICAgICogZGV2aWNlIHdpdGggcmV0aW5hIGRpc3BsYXkgdXN1YWxseSBoYXZlIGdvb2QgZGV0YWlsIG9uIGdyYXBoaWNzIHdpdGggb3Igd2l0aG91dCB0aGlzIG9wdGlvbixcclxuICAgICAqIHlvdSBwcm9iYWJseSBkb24ndCB3YW50IGFudGlhbGlhcyBpZiB5b3VyIGdhbWUgc3R5bGUgaXMgcGl4ZWwgYXJ0IGJhc2VkLlxyXG4gICAgICogQWxzbywgaXQgY291bGQgaGF2ZSBncmVhdCBwZXJmb3JtYW5jZSBpbXBhY3Qgd2l0aCBzb21lIGJyb3dzZXIgLyBkZXZpY2UgdXNpbmcgc29mdHdhcmUgTVNBQS5cclxuICAgICAqIFlvdSBjYW4gc2V0IGl0IHRvIHRydWUgYmVmb3JlIHt7Z2FtZS5pbml0fX0uXHJcbiAgICAgKiBXZWIgb25seS5cclxuICAgICAqIEB6aFxyXG4gICAgICog55So5LqO6K6+572u5Zyo5Yib5bu6IFdlYkdMIENvbnRleHQg5pe25piv5ZCm5byA5ZCv5oqX6ZSv6b2/6YCJ6aG577yM6buY6K6k5YC85pivIGZhbHNl44CCXHJcbiAgICAgKiDlsIbov5nkuKrpgInpobnorr7nva7kuLogdHJ1ZSDkvJrorqnkvaDnmoTmuLjmiI/nlLvpnaLnqI3nqI3lubPmu5HkuIDkupvvvIzmr5TlpoLml4vovaznoazovrnotLTlm77ml7bnmoTplK/pvb/jgILmmK/lkKblvIDlkK/ov5nkuKrpgInpobnlvojlpKfnqIvluqbkuIrlj5blhrPkuo7kvaDnmoTmuLjmiI/lkozpnaLlkJHnmoTlubPlj7DjgIJcclxuICAgICAqIOWcqOWkp+WkmuaVsOaLpeaciSByZXRpbmEg57qn5Yir5bGP5bmV55qE6K6+5aSH5LiK55So5oi35b6A5b6A5peg5rOV5Yy65YiG6L+Z5Liq6YCJ6aG55bim5p2l55qE5Y+Y5YyW77yb5aaC5p6c5L2g55qE5ri45oiP6YCJ5oup5YOP57Sg6Im65pyv6aOO5qC877yM5L2g5Lmf5aSa5Y2K5LiN5Lya5oOz5byA5ZCv6L+Z5Liq6YCJ6aG544CCXHJcbiAgICAgKiDlkIzml7bvvIzlnKjlsJHpg6jliIbkvb/nlKjova/ku7bnuqfliKvmipfplK/pvb/nrpfms5XnmoTorr7lpIfmiJbmtY/op4jlmajkuIrvvIzov5nkuKrpgInpobnkvJrlr7nmgKfog73kuqfnlJ/mr5TovoPlpKfnmoTlvbHlk43jgIJcclxuICAgICAqIOS9oOWPr+S7peWcqCB7e2dhbWUuaW5pdH19IOS5i+WJjeiuvue9rui/meS4quWAvO+8jOWQpuWImeWug+S4jeS8mueUn+aViOOAglxyXG4gICAgICog5LuF5pSv5oyBIFdlYlxyXG4gICAgICogQGRlZmF1bHQgZmFsc2VcclxuICAgICAqL1xyXG4gICAgRU5BQkxFX1dFQkdMX0FOVElBTElBUzogZmFsc2UsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZXRoZXIgb3Igbm90IGNsZWFyIGRvbSBJbWFnZSBvYmplY3QgY2FjaGUgYWZ0ZXIgdXBsb2FkaW5nIHRvIGdsIHRleHR1cmUuXHJcbiAgICAgKiBDb25jcmV0ZWx5LCB3ZSBhcmUgc2V0dGluZyBpbWFnZS5zcmMgdG8gZW1wdHkgc3RyaW5nIHRvIHJlbGVhc2UgdGhlIGNhY2hlLlxyXG4gICAgICogTm9ybWFsbHkgeW91IGRvbid0IG5lZWQgdG8gZW5hYmxlIHRoaXMgb3B0aW9uLCBiZWNhdXNlIG9uIHdlYiB0aGUgSW1hZ2Ugb2JqZWN0IGRvZXNuJ3QgY29uc3VtZSB0b28gbXVjaCBtZW1vcnkuXHJcbiAgICAgKiBCdXQgb24gV2VjaGF0IEdhbWUgcGxhdGZvcm0sIHRoZSBjdXJyZW50IHZlcnNpb24gY2FjaGUgZGVjb2RlZCBkYXRhIGluIEltYWdlIG9iamVjdCwgd2hpY2ggaGFzIGhpZ2ggbWVtb3J5IHVzYWdlLlxyXG4gICAgICogU28gd2UgZW5hYmxlZCB0aGlzIG9wdGlvbiBieSBkZWZhdWx0IG9uIFdlY2hhdCwgc28gdGhhdCB3ZSBjYW4gcmVsZWFzZSBJbWFnZSBjYWNoZSBpbW1lZGlhdGVseSBhZnRlciB1cGxvYWRlZCB0byBHUFUuXHJcbiAgICAgKiBDdXJyZW50bHkgbm90IHVzZWZ1bCBpbiAzRCBlbmdpbmVcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm5Zyo5bCG6LS05Zu+5LiK5Lyg6IezIEdQVSDkuYvlkI7liKDpmaQgRE9NIEltYWdlIOe8k+WtmOOAglxyXG4gICAgICog5YW35L2T5p2l6K+077yM5oiR5Lus6YCa6L+H6K6+572uIGltYWdlLnNyYyDkuLrnqbrlrZfnrKbkuLLmnaXph4rmlL7ov5npg6jliIblhoXlrZjjgIJcclxuICAgICAqIOato+W4uOaDheWGteS4i++8jOS9oOS4jemcgOimgeW8gOWQr+i/meS4qumAiemhue+8jOWboOS4uuWcqCB3ZWIg5bmz5Y+w77yMSW1hZ2Ug5a+56LGh5omA5Y2g55So55qE5YaF5a2Y5b6I5bCP44CCXHJcbiAgICAgKiDkvYbmmK/lnKjlvq7kv6HlsI/muLjmiI/lubPlj7DnmoTlvZPliY3niYjmnKzvvIxJbWFnZSDlr7nosaHkvJrnvJPlrZjop6PnoIHlkI7nmoTlm77niYfmlbDmja7vvIzlroPmiYDljaDnlKjnmoTlhoXlrZjnqbrpl7TlvojlpKfjgIJcclxuICAgICAqIOaJgOS7peaIkeS7rOWcqOW+ruS/oeW5s+WPsOm7mOiupOW8gOWQr+S6hui/meS4qumAiemhue+8jOi/meagt+aIkeS7rOWwseWPr+S7peWcqOS4iuS8oCBHTCDotLTlm77kuYvlkI7nq4vljbPph4rmlL4gSW1hZ2Ug5a+56LGh55qE5YaF5a2Y77yM6YG/5YWN6L+H6auY55qE5YaF5a2Y5Y2g55So44CCXHJcbiAgICAgKiDlnKggM0Qg5byV5pOO5Lit5pqC5pe25peg5pWI44CCXHJcbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxyXG4gICAgICovXHJcbiAgICBDTEVBTlVQX0lNQUdFX0NBQ0hFOiBmYWxzZSxcclxuXHJcbiAgICAgLyoqXHJcbiAgICAgICogQGVuXHJcbiAgICAgICogV2hldGhlciB0byBlbmFibGUgbXVsdGktdG91Y2guXHJcbiAgICAgICogQHpoXHJcbiAgICAgICog5piv5ZCm5byA5ZCv5aSa54K56Kem5pG4XHJcbiAgICAgICogQGRlZmF1bHQgdHJ1ZVxyXG4gICAgICAqL1xyXG4gICAgRU5BQkxFX01VTFRJX1RPVUNIOiB0cnVlLFxyXG59O1xyXG5cclxubGVnYWN5Q0MubWFjcm8gPSBtYWNybztcclxuXHJcbmV4cG9ydCB7IG1hY3JvIH07XHJcbiJdfQ==