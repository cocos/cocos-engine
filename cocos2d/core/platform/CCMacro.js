/****************************************************************************
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
 ****************************************************************************/

/**
 * Predefined constants
 * @class macro
 * @static
 */
cc.macro = {
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
     * @property REPEAT_FOREVER
     * @type {Number}
     */
    REPEAT_FOREVER: (Number.MAX_VALUE - 1),

    /**
     * @property FLT_EPSILON
     * @type {Number}
     */
    FLT_EPSILON: 0.0000001192092896,

    /**
     * Minimum z index value for node
     * @property MIN_ZINDEX
     * @type {Number}
     */
    MIN_ZINDEX: -Math.pow(2, 15),

    /**
     * Maximum z index value for node
     * @property MAX_ZINDEX
     * @type {Number}
     */
    MAX_ZINDEX: Math.pow(2, 15) - 1,

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

    //Possible device orientations
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
     *  Affected component:                                                                 <br/>
     *      - cc.TMXLayer                                                       <br/>
     *                                                                                  <br/>
     *  Enabled by default. To disabled set it to 0. <br/>
     *  To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     *
     * @property {Number} FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX
     */
    FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX: true,

    /**
     * Position of the FPS (Default: 0,0 (bottom-left corner))<br/>
     * To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * @property {Vec2} DIRECTOR_STATS_POSITION
     */
    DIRECTOR_STATS_POSITION: cc.v2(0, 0),

    /**
     * <p>
     *    If enabled, actions that alter the position property (eg: CCMoveBy, CCJumpBy, CCBezierBy, etc..) will be stacked.                  <br/>
     *    If you run 2 or more 'position' actions at the same time on a node, then end position will be the sum of all the positions.        <br/>
     *    If disabled, only the last run action will take effect.
     * </p>
     * @property {Number} ENABLE_STACKABLE_ACTIONS
     */
    ENABLE_STACKABLE_ACTIONS: true,

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
     * 用于甄别一个触点对象是否已经失效并且可以被移除的延时时长
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
    BATCH_VERTEX_COUNT: 20000,

    /**
     * !#en 
     * Whether or not enabled tiled map auto culling. If you set the TiledMap skew or rotation, then need to manually disable this, otherwise, the rendering will be wrong.
     * !#zh
     * 是否开启瓦片地图的自动裁减功能。瓦片地图如果设置了 skew, rotation 的话，需要手动关闭，否则渲染会出错。
     * @property {Boolean} ENABLE_TILEDMAP_CULLING
     * @default true
     */
    ENABLE_TILEDMAP_CULLING: true,

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

    /**
     * !#en
     * Boolean that indicates if the WebGL context is created with `antialias` option turned on, default value is false.
     * Set it to true could make your game graphics slightly smoother, like texture hard edges when rotated.
     * Whether to use this really depend on your game design and targeted platform, 
     * device with retina display usually have good detail on graphics with or without this option, 
     * you probably don't want antialias if your game style is pixel art based.
     * Also, it could have great performance impact with some browser / device using software MSAA.
     * You can set it to true before `cc.game.run`.
     * Web only.
     * !#zh
     * 用于设置在创建 WebGL Context 时是否开启抗锯齿选项，默认值是 false。
     * 将这个选项设置为 true 会让你的游戏画面稍稍平滑一些，比如旋转硬边贴图时的锯齿。是否开启这个选项很大程度上取决于你的游戏和面向的平台。
     * 在大多数拥有 retina 级别屏幕的设备上用户往往无法区分这个选项带来的变化；如果你的游戏选择像素艺术风格，你也多半不会想开启这个选项。
     * 同时，在少部分使用软件级别抗锯齿算法的设备或浏览器上，这个选项会对性能产生比较大的影响。
     * 你可以在 `cc.game.run` 之前设置这个值，否则它不会生效。
     * 仅支持 Web
     * @property {Boolean} ENABLE_WEBGL_ANTIALIAS
     * @default false
     */
    ENABLE_WEBGL_ANTIALIAS: false,

    /**
     * !#en
     * Whether or not enable auto culling.
     * This feature have been removed in v2.0 new renderer due to overall performance consumption.
     * We have no plan currently to re-enable auto culling.
     * If your game have more dynamic objects, we suggest to disable auto culling.
     * If your game have more static objects, we suggest to enable auto culling.
     * !#zh
     * 是否开启自动裁减功能，开启裁减功能将会把在屏幕外的物体从渲染队列中去除掉。
     * 这个功能在 v2.0 的新渲染器中被移除了，因为它在大多数游戏中所带来的损耗要高于性能的提升，目前我们没有计划重新支持自动裁剪。
     * 如果游戏中的动态物体比较多的话，建议将此选项关闭。
     * 如果游戏中的静态物体比较多的话，建议将此选项打开。
     * @property {Boolean} ENABLE_CULLING
     * @deprecated since v2.0
     * @default false
     */
    ENABLE_CULLING: false,

    /**
     * !#en
     * Whether or not clear dom Image object cache after uploading to gl texture.
     * Concretely, we are setting image.src to empty string to release the cache.
     * Normally you don't need to enable this option, because on web the Image object doesn't consume too much memory.
     * But on WeChat Game platform, the current version cache decoded data in Image object, which has high memory usage.
     * So we enabled this option by default on WeChat, so that we can release Image cache immediately after uploaded to GPU.
     * !#zh
     * 是否在将贴图上传至 GPU 之后删除 DOM Image 缓存。
     * 具体来说，我们通过设置 image.src 为空字符串来释放这部分内存。
     * 正常情况下，你不需要开启这个选项，因为在 web 平台，Image 对象所占用的内存很小。
     * 但是在微信小游戏平台的当前版本，Image 对象会缓存解码后的图片数据，它所占用的内存空间很大。
     * 所以我们在微信平台默认开启了这个选项，这样我们就可以在上传 GL 贴图之后立即释放 Image 对象的内存，避免过高的内存占用。
     * @property {Boolean} CLEANUP_IMAGE_CACHE
     * @default false
     */
    CLEANUP_IMAGE_CACHE: false,

    /**
     * !#en
     * Whether or not show mesh wire frame.
     * !#zh
     * 是否显示网格的线框。
     * @property {Boolean} SHOW_MESH_WIREFRAME
     * @default false
     */
    SHOW_MESH_WIREFRAME: false,

    /**
     * !#en
     * Set cc.RotateTo/cc.RotateBy rotate direction.
     * If need set rotate positive direction to counterclockwise, please change setting to : cc.macro.ROTATE_ACTION_CCW = true;
     * !#zh
     * 设置 cc.RotateTo/cc.RotateBy 的旋转方向。
     * 如果需要设置旋转的正方向为逆时针方向，请设置选项为： cc.macro.ROTATE_ACTION_CCW = true;
     * @property {Boolean} ROTATE_ACTION_CCW
     * @default false
     */
    ROTATE_ACTION_CCW: false
};


let SUPPORT_TEXTURE_FORMATS = ['.pkm', '.pvr', '.webp', '.jpg', '.jpeg', '.bmp', '.png'];

/**
 * !en
 * The image format supported by the engine defaults, and the supported formats may differ in different build platforms and device types.
 * Currently all platform and device support ['.webp', '.jpg', '.jpeg', '.bmp', '.png'], The iOS mobile platform also supports the PVR format。
 * !zh
 * 引擎默认支持的图片格式，支持的格式可能在不同的构建平台和设备类型上有所差别。
 * 目前所有平台和设备支持的格式有 ['.webp', '.jpg', '.jpeg', '.bmp', '.png']. 另外 Ios 手机平台还额外支持了 PVR 格式。
 * @property {[String]} SUPPORT_TEXTURE_FORMATS
 */
cc.macro.SUPPORT_TEXTURE_FORMATS = SUPPORT_TEXTURE_FORMATS;


/**
 * !#en Key map for keyboard event
 * !#zh 键盘事件的按键值
 * @enum macro.KEY
 * @example {@link cocos2d/core/platform/CCCommon/KEY.js}
 */
cc.macro.KEY = {
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
 * @enum macro.ImageFormat
 */
cc.macro.ImageFormat = cc.Enum({
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
 * !#en
 * Enum for blend factor
 * Refer to: http://www.andersriggelsen.dk/glblendfunc.php
 * !#zh
 * 混合因子
 * 可参考: http://www.andersriggelsen.dk/glblendfunc.php
 * @enum macro.BlendFactor
 */
cc.macro.BlendFactor = cc.Enum({
    /**
     * !#en All use
     * !#zh 全部使用
     * @property {Number} ONE
     */
    ONE:                    1,  //cc.macro.ONE
    /**
     * !#en Not all
     * !#zh 全部不用
     * @property {Number} ZERO
     */
    ZERO:                   0,      //cc.ZERO
    /**
     * !#en Using the source alpha
     * !#zh 使用源颜色的透明度
     * @property {Number} SRC_ALPHA
     */
    SRC_ALPHA:              0x302,  //cc.SRC_ALPHA
    /**
     * !#en Using the source color
     * !#zh 使用源颜色
     * @property {Number} SRC_COLOR
     */
    SRC_COLOR:              0x300,  //cc.SRC_COLOR
    /**
     * !#en Using the target alpha
     * !#zh 使用目标颜色的透明度
     * @property {Number} DST_ALPHA
     */
    DST_ALPHA:              0x304,  //cc.DST_ALPHA
    /**
     * !#en Using the target color
     * !#zh 使用目标颜色
     * @property {Number} DST_COLOR
     */
    DST_COLOR:              0x306,  //cc.DST_COLOR
    /**
     * !#en Minus the source alpha
     * !#zh 减去源颜色的透明度
     * @property {Number} ONE_MINUS_SRC_ALPHA
     */
    ONE_MINUS_SRC_ALPHA:    0x303,  //cc.ONE_MINUS_SRC_ALPHA
    /**
     * !#en Minus the source color
     * !#zh 减去源颜色
     * @property {Number} ONE_MINUS_SRC_COLOR
     */
    ONE_MINUS_SRC_COLOR:    0x301,  //cc.ONE_MINUS_SRC_COLOR
    /**
     * !#en Minus the target alpha
     * !#zh 减去目标颜色的透明度
     * @property {Number} ONE_MINUS_DST_ALPHA
     */
    ONE_MINUS_DST_ALPHA:    0x305,  //cc.ONE_MINUS_DST_ALPHA
    /**
     * !#en Minus the target color
     * !#zh 减去目标颜色
     * @property {Number} ONE_MINUS_DST_COLOR
     */
    ONE_MINUS_DST_COLOR:    0x307,  //cc.ONE_MINUS_DST_COLOR
});

/**
 * @enum macro.TextAlignment
 */
cc.macro.TextAlignment = cc.Enum({
    /**
     * @property {Number} LEFT
     */
    LEFT: 0,
    /**
     * @property {Number} CENTER
     */
    CENTER: 1,
    /**
     * @property {Number} RIGHT
     */
    RIGHT: 2
});

/**
 * @enum VerticalTextAlignment
 */
cc.macro.VerticalTextAlignment = cc.Enum({
    /**
     * @property {Number} TOP
     */
    TOP: 0,
    /**
     * @property {Number} CENTER
     */
    CENTER: 1,
    /**
     * @property {Number} BOTTOM
     */
    BOTTOM: 2
});

module.exports = cc.macro;
