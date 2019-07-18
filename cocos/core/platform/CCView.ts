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

import '../data/class';
import { EventTarget } from '../event/event-target';
import Game from '../game';
import { Rect, Size } from '../value-types';

let _currentFrame = 0;

class BrowserGetter {

    public html: HTMLHtmlElement | undefined;

    public meta = {
        width: 'device-width',
    };

    public adaptationType: any = cc.sys.browserType;

    public init () {
        if (!CC_WECHATGAME && !CC_QQPLAY) {
            this.html = document.getElementsByTagName('html')[0];
        }
    }

    public availWidth (frame) {
        if (cc.sys.isMobile || !frame || frame === this.html) {
            return window.innerWidth;
        }
        else {
            return frame.clientWidth;
        }
    }

    public availHeight (frame) {
        if (cc.sys.isMobile || !frame || frame === this.html) {
            return window.innerHeight;
        }
        else {
            return frame.clientHeight;
        }
    }
}

const __BrowserGetter = new BrowserGetter();

if (cc.sys.os === cc.sys.OS_IOS) { // All browsers are WebView
    __BrowserGetter.adaptationType = cc.sys.BROWSER_TYPE_SAFARI;
}

if (CC_WECHATGAME) {
    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
        __BrowserGetter.adaptationType = cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB;
    }
    else {
        __BrowserGetter.adaptationType = cc.sys.BROWSER_TYPE_WECHAT_GAME;
    }
}

if (CC_QQPLAY) {
    __BrowserGetter.adaptationType = cc.sys.BROWSER_TYPE_QQ_PLAY;
}

switch (__BrowserGetter.adaptationType) {
    case cc.sys.BROWSER_TYPE_SAFARI:
        __BrowserGetter.meta['minimal-ui'] = 'true';
    case cc.sys.BROWSER_TYPE_SOUGOU:
    case cc.sys.BROWSER_TYPE_WECHAT_GAME:
        __BrowserGetter.availWidth = () => {
            return window.innerWidth;
        };
        __BrowserGetter.availHeight = () => {
            return window.innerHeight;
        };
        break;
    case cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB:
        const sharedCanvas = window.sharedCanvas || wx.getSharedCanvas();
        __BrowserGetter.availWidth = () => {
            return sharedCanvas.width;
        };
        __BrowserGetter.availHeight = () => {
            return sharedCanvas.height;
        };
        break;
}

let _scissorRect: Rect | null = null;

/**
 * cc.view is the singleton object which represents the game window.<br/>
 * It's main task include: <br/>
 *  - Apply the design resolution policy<br/>
 *  - Provide interaction with the window, like resize event on web, retina display support, etc...<br/>
 *  - Manage the game view port which can be different with the window<br/>
 *  - Manage the content scale and translation<br/>
 * <br/>
 * Since the cc.view is a singleton, you don't need to call any constructor or create functions,<br/>
 * the standard way to use it is by calling:<br/>
 *  - cc.view.methodName(); <br/>
 *
 * @class View
 */
class View extends EventTarget {

    private _frameSize: Size;
    private _designResolutionSize: Size;
    private _originalDesignResolutionSize: Size;
    private _scaleX: number;
    private _scaleY: number;
    private _viewportRect: Rect;
    private _visibleRect: Rect;
    private _autoFullScreen: boolean;
    private _devicePixelRatio: number;
    private _retinaEnabled: boolean;
    private _resizeCallback: null;
    private _resizing: boolean;
    private _resizeWithBrowserSize: boolean;
    private _orientationChanging: boolean;
    private _isRotated: boolean;
    private _orientation: any;
    private _isAdjustViewport: boolean;
    private _antiAliasEnabled: boolean;
    private _resolutionPolicy: any;
    private _rpExactFit: ResolutionPolicy;
    private _rpShowAll: ResolutionPolicy;
    private  _rpNoBorder: ResolutionPolicy;
    private _rpFixedHeight: ResolutionPolicy;
    private _rpFixedWidth: ResolutionPolicy;

    constructor () {
        super();

        const _t = this;
        const _strategyer = ContainerStrategy;
        const _strategy = ContentStrategy;

        // Size of parent node that contains cc.game.container and cc.game.canvas
        this._frameSize = new Size(0, 0);

        // resolution size, it is the size appropriate for the app resources.
        this._designResolutionSize = new Size(0, 0);
        this._originalDesignResolutionSize = new Size(0, 0);
        this._scaleX = 1;
        this._scaleY = 1;
        // Viewport is the container's rect related to content's coordinates in pixel
        this._viewportRect = new Rect(0, 0, 0, 0);
        // The visible rect in content's coordinate in point
        this._visibleRect = new Rect(0, 0, 0, 0);
        // Auto full screen disabled by default
        this._autoFullScreen = false;
        // The device's pixel ratio (for retina displays)
        this._devicePixelRatio = 1;
        // Retina disabled by default
        this._retinaEnabled = false;
        // Custom callback for resize event
        this._resizeCallback = null;
        this._resizing = false;
        this._resizeWithBrowserSize = false;
        this._orientationChanging = true;
        this._isRotated = false;
        this._orientation = cc.macro.ORIENTATION_AUTO;
        this._isAdjustViewport = true;
        this._antiAliasEnabled = false;

        // Setup system default resolution policies
        this._resolutionPolicy = null;
        this._rpExactFit = new ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.EXACT_FIT);
        this._rpShowAll = new ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.SHOW_ALL);
        this._rpNoBorder = new ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.NO_BORDER);
        this._rpFixedHeight = new ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.FIXED_HEIGHT);
        this._rpFixedWidth = new ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.FIXED_WIDTH);

        cc.game.once(Game.EVENT_ENGINE_INITED, this.init, this);
    }

    public init () {
        __BrowserGetter.init();

        this._initFrameSize();
        this.enableAntiAlias(true);

        const w = cc.game.canvas.width;
        const h = cc.game.canvas.height;
        this._designResolutionSize.width = w;
        this._designResolutionSize.height = h;
        this._originalDesignResolutionSize.width = w;
        this._originalDesignResolutionSize.height = h;
        this._viewportRect.width = w;
        this._viewportRect.height = h;
        this._visibleRect.width = w;
        this._visibleRect.height = h;

        cc.winSize.width = this._visibleRect.width;
        cc.winSize.height = this._visibleRect.height;
        if (cc.visibleRect) {
            cc.visibleRect.init(this._visibleRect);
        }
    }

    /**
     * @en
     * Sets view's target-densitydpi for android mobile browser. it can be set to:           <br/>
     *   1. macro.DENSITYDPI_DEVICE, value is "device-dpi"                                      <br/>
     *   2. macro.DENSITYDPI_HIGH, value is "high-dpi"  (default value)                         <br/>
     *   3. macro.DENSITYDPI_MEDIUM, value is "medium-dpi" (browser's default value)            <br/>
     *   4. macro.DENSITYDPI_LOW, value is "low-dpi"                                            <br/>
     *   5. Custom value, e.g: "480"                                                         <br/>
     * @zh 设置目标内容的每英寸像素点密度。
     *
     * @method setTargetDensityDPI
     * @param {String} densityDPI
     * @deprecated since v2.0
     */

    /**
     * @en
     * Returns the current target-densitydpi value of cc.view.
     * @zh 获取目标内容的每英寸像素点密度。
     * @method getTargetDensityDPI
     * @returns {String}
     * @deprecated since v2.0
     */

    /**
     * @en
     * Sets whether resize canvas automatically when browser's size changed.<br/>
     * Useful only on web.
     * @zh 设置当发现浏览器的尺寸改变时，是否自动调整 canvas 尺寸大小。
     * 仅在 Web 模式下有效。
     * @method resizeWithBrowserSize
     * @param {Boolean} enabled - Whether enable automatic resize with browser's resize event
     */
    public resizeWithBrowserSize (enabled) {
        if (enabled) {
            // enable
            if (!this._resizeWithBrowserSize) {
                this._resizeWithBrowserSize = true;
                window.addEventListener('resize', this._resizeEvent);
                window.addEventListener('orientationchange', this._orientationChange);
            }
        } else {
            // disable
            if (this._resizeWithBrowserSize) {
                this._resizeWithBrowserSize = false;
                window.removeEventListener('resize', this._resizeEvent);
                window.removeEventListener('orientationchange', this._orientationChange);
            }
        }
    }

    /**
     * @en
     * Sets the callback function for cc.view's resize action,<br/>
     * this callback will be invoked before applying resolution policy, <br/>
     * so you can do any additional modifications within the callback.<br/>
     * Useful only on web.
     * @zh 设置 cc.view 调整视窗尺寸行为的回调函数，
     * 这个回调函数会在应用适配模式之前被调用，
     * 因此你可以在这个回调函数内添加任意附加改变，
     * 仅在 Web 平台下有效。
     * @method setResizeCallback
     * @param {Function|Null} callback - The callback function
     */
    public setResizeCallback (callback) {
        if (typeof callback === 'function' || callback == null) {
            this._resizeCallback = callback;
        }
    }

    /**
     * @en
     * Sets the orientation of the game, it can be landscape, portrait or auto.
     * When set it to landscape or portrait, and screen w/h ratio doesn't fit,
     * cc.view will automatically rotate the game canvas using CSS.
     * Note that this function doesn't have any effect in native,
     * in native, you need to set the application orientation in native project settings
     * @zh 设置游戏屏幕朝向，它能够是横版，竖版或自动。
     * 当设置为横版或竖版，并且屏幕的宽高比例不匹配时，
     * cc.view 会自动用 CSS 旋转游戏场景的 canvas，
     * 这个方法不会对 native 部分产生任何影响，对于 native 而言，你需要在应用设置中的设置排版。
     * @method setOrientation
     * @param {Number} orientation - Possible values: macro.ORIENTATION_LANDSCAPE | macro.ORIENTATION_PORTRAIT | macro.ORIENTATION_AUTO
     */
    public setOrientation (orientation) {
        orientation = orientation & cc.macro.ORIENTATION_AUTO;
        if (orientation && this._orientation !== orientation) {
            this._orientation = orientation;
        }
    }

    /**
     * @en
     * Sets whether the engine modify the "viewport" meta in your web page.<br/>
     * It's enabled by default, we strongly suggest you not to disable it.<br/>
     * And even when it's enabled, you can still set your own "viewport" meta, it won't be overridden<br/>
     * Only useful on web
     * @zh 设置引擎是否调整 viewport meta 来配合屏幕适配。
     * 默认设置为启动，我们强烈建议你不要将它设置为关闭。
     * 即使当它启动时，你仍然能够设置你的 viewport meta，它不会被覆盖。
     * 仅在 Web 模式下有效
     * @method adjustViewportMeta
     * @param {Boolean} enabled - Enable automatic modification to "viewport" meta
     */
    public adjustViewportMeta (enabled) {
        this._isAdjustViewport = enabled;
    }

    /**
     * @en
     * Retina support is enabled by default for Apple device but disabled for other devices,<br/>
     * it takes effect only when you called setDesignResolutionPolicy<br/>
     * Only useful on web
     * @zh 对于 Apple 这种支持 Retina 显示的设备上默认进行优化而其他类型设备默认不进行优化，
     * 它仅会在你调用 setDesignResolutionPolicy 方法时有影响。
     * 仅在 Web 模式下有效。
     * @method enableRetina
     * @param {Boolean} enabled - Enable or disable retina display
     */
    public enableRetina (enabled) {
        this._retinaEnabled = !!enabled;
    }

    /**
     * @en
     * Check whether retina display is enabled.<br/>
     * Only useful on web
     * @zh 检查是否对 Retina 显示设备进行优化。
     * 仅在 Web 模式下有效。
     * @method isRetinaEnabled
     * @return {Boolean}
     */
    public isRetinaEnabled () {
        return this._retinaEnabled;
    }

    /**
     * @en Whether to Enable on anti-alias
     * @zh 控制抗锯齿是否开启
     * @method enableAntiAlias
     * @param {Boolean} enabled - Enable or not anti-alias
     */
    public enableAntiAlias (enabled) {
        if (this._antiAliasEnabled === enabled) {
            return;
        }
        this._antiAliasEnabled = enabled;
        if (cc.game.renderType === Game.RENDER_TYPE_WEBGL) {
            const cache = cc.loader._cache;
            // tslint:disable-next-line: forin
            for (const key in cache) {
                const item = cache[key];
                const tex = item && item.content instanceof cc.Texture2D ? item.content : null;
                if (tex) {
                    const Filter = cc.Texture2D.Filter;
                    if (enabled) {
                        tex.setFilters(Filter.LINEAR, Filter.LINEAR);
                    }
                    else {
                        tex.setFilters(Filter.NEAREST, Filter.NEAREST);
                    }
                }
            }
        }
        else if (cc.game.renderType === Game.RENDER_TYPE_CANVAS) {
            const ctx = cc.game.canvas.getContext('2d');
            ctx.imageSmoothingEnabled = enabled;
            ctx.mozImageSmoothingEnabled = enabled;
        }
    }

    /**
     * @en Returns whether the current enable on anti-alias
     * @zh 返回当前是否抗锯齿
     * @method isAntiAliasEnabled
     * @return {Boolean}
     */
    public isAntiAliasEnabled () {
        return this._antiAliasEnabled;
    }
    /**
     * @en
     * If enabled, the application will try automatically to enter full screen mode on mobile devices<br/>
     * You can pass true as parameter to enable it and disable it by passing false.<br/>
     * Only useful on web
     * @zh 启动时，移动端游戏会在移动端自动尝试进入全屏模式。
     * 你能够传入 true 为参数去启动它，用 false 参数来关闭它。
     * @method enableAutoFullScreen
     * @param {Boolean} enabled - Enable or disable auto full screen on mobile devices
     */
    public enableAutoFullScreen (enabled) {
        if (enabled &&
            enabled !== this._autoFullScreen &&
            cc.sys.isMobile &&
            cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT) {
            // Automatically full screen when user touches on mobile version
            this._autoFullScreen = true;
            cc.screen.autoFullScreen(cc.game.frame);
        }
        else {
            this._autoFullScreen = false;
        }
    }

    /**
     * @en
     * Check whether auto full screen is enabled.<br/>
     * Only useful on web
     * @zh 检查自动进入全屏模式是否启动。
     * 仅在 Web 模式下有效。
     * @method isAutoFullScreenEnabled
     * @return {Boolean} Auto full screen enabled or not
     */
    public isAutoFullScreenEnabled () {
        return this._autoFullScreen;
    }

    /*
     * Not support on native.<br/>
     * On web, it sets the size of the canvas.
     * @zh 这个方法并不支持 native 平台，在 Web 平台下，可以用来设置 canvas 尺寸。
     * @method setCanvasSize
     * @param {Number} width
     * @param {Number} height
     */
    public setCanvasSize (width, height) {
        const canvas = cc.game.canvas;
        const container = cc.game.container;

        canvas.width = width * this._devicePixelRatio;
        canvas.height = height * this._devicePixelRatio;

        // canvas.width = width;
        // canvas.height = height;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        container.style.width = width + 'px';
        container.style.height = height + 'px';

        this._resizeEvent();
    }

    /**
     * @en
     * Returns the canvas size of the view.<br/>
     * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
     * On web, it returns the size of the canvas element.
     * @zh 返回视图中 canvas 的尺寸。
     * 在 native 平台下，它返回全屏视图下屏幕的尺寸。
     * 在 Web 平台下，它返回 canvas 元素尺寸。
     * @method getCanvasSize
     * @return {Size}
     */
    public getCanvasSize () {
        return cc.size(cc.game.canvas.width, cc.game.canvas.height);
    }

    /**
     * @en
     * Returns the frame size of the view.<br/>
     * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
     * On web, it returns the size of the canvas's outer DOM element.
     * @zh 返回视图中边框尺寸。
     * 在 native 平台下，它返回全屏视图下屏幕的尺寸。
     * 在 web 平台下，它返回 canvas 元素的外层 DOM 元素尺寸。
     * @method getFrameSize
     * @return {Size}
     */
    public getFrameSize () {
        return cc.size(this._frameSize.width, this._frameSize.height);
    }

    /**
     * @en
     * On native, it sets the frame size of view.<br/>
     * On web, it sets the size of the canvas's outer DOM element.
     * @zh 在 native 平台下，设置视图框架尺寸。
     * 在 web 平台下，设置 canvas 外层 DOM 元素尺寸。
     * @method setFrameSize
     * @param {Number} width
     * @param {Number} height
     */
    public setFrameSize (width, height) {
        this._frameSize.width = width;
        this._frameSize.height = height;
        cc.frame.style.width = width + 'px';
        cc.frame.style.height = height + 'px';
        this._resizeEvent();
    }

    /**
     * @en
     * Returns the visible area size of the view port.
     * @zh 返回视图窗口可见区域尺寸。
     * @method getVisibleSize
     * @return {Size}
     */
    public getVisibleSize () {
        return cc.size(this._visibleRect.width, this._visibleRect.height);
    }

    /**
     * @en
     * Returns the visible area size of the view port.
     * @zh 返回视图窗口可见区域像素尺寸。
     * @method getVisibleSizeInPixel
     * @return {Size}
     */
    public getVisibleSizeInPixel () {
        return cc.size( this._visibleRect.width * this._scaleX,
                        this._visibleRect.height * this._scaleY );
    }

    /**
     * @en
     * Returns the visible origin of the view port.
     * @zh 返回视图窗口可见区域原点。
     * @method getVisibleOrigin
     * @return {Vec2}
     */
    public getVisibleOrigin () {
        return cc.v2(this._visibleRect.x, this._visibleRect.y);
    }

    /**
     * @en
     * Returns the visible origin of the view port.
     * @zh 返回视图窗口可见区域像素原点。
     * @method getVisibleOriginInPixel
     * @return {Vec2}
     */
    public getVisibleOriginInPixel () {
        return cc.v2(this._visibleRect.x * this._scaleX,
                    this._visibleRect.y * this._scaleY);
    }

    /**
     * @en
     * Returns the current resolution policy
     * @zh 返回当前分辨率方案
     * @see ResolutionPolicy
     * @method getResolutionPolicy
     * @return {ResolutionPolicy}
     */
    public getResolutionPolicy () {
        return this._resolutionPolicy;
    }

    /**
     * @en
     * Sets the current resolution policy
     * @zh 设置当前分辨率模式
     * @see ResolutionPolicy
     * @method setResolutionPolicy
     * @param {ResolutionPolicy|Number} resolutionPolicy
     */
    public setResolutionPolicy (resolutionPolicy) {
        const _t = this;
        if (resolutionPolicy instanceof ResolutionPolicy) {
            _t._resolutionPolicy = resolutionPolicy;
        }
        // Ensure compatibility with JSB
        else {
            const _locPolicy = ResolutionPolicy;
            if (resolutionPolicy === _locPolicy.EXACT_FIT) {
                _t._resolutionPolicy = _t._rpExactFit;
            }
            if (resolutionPolicy === _locPolicy.SHOW_ALL) {
                _t._resolutionPolicy = _t._rpShowAll;
            }
            if (resolutionPolicy === _locPolicy.NO_BORDER) {
                _t._resolutionPolicy = _t._rpNoBorder;
            }
            if (resolutionPolicy === _locPolicy.FIXED_HEIGHT) {
                _t._resolutionPolicy = _t._rpFixedHeight;
            }
            if (resolutionPolicy === _locPolicy.FIXED_WIDTH) {
                _t._resolutionPolicy = _t._rpFixedWidth;
            }
        }
    }

    // tslint:disable: max-line-length
    /**
     * @en
     * Sets the resolution policy with designed view size in points.<br/>
     * The resolution policy include: <br/>
     * [1] ResolutionExactFit       Fill screen by stretch-to-fit: if the design resolution ratio of width to height is different from the screen resolution ratio, your game view will be stretched.<br/>
     * [2] ResolutionNoBorder       Full screen without black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two areas of your game view will be cut.<br/>
     * [3] ResolutionShowAll        Full screen with black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two black borders will be shown.<br/>
     * [4] ResolutionFixedHeight    Scale the content's height to screen's height and proportionally scale its width<br/>
     * [5] ResolutionFixedWidth     Scale the content's width to screen's width and proportionally scale its height<br/>
     * [ResolutionPolicy]        [Web only feature] Custom resolution policy, constructed by ResolutionPolicy<br/>
     * @zh 通过设置设计分辨率和匹配模式来进行游戏画面的屏幕适配。
     * @method setDesignResolutionSize
     * @param {Number} width Design resolution width.
     * @param {Number} height Design resolution height.
     * @param {ResolutionPolicy|Number} resolutionPolicy The resolution policy desired
     */
    public setDesignResolutionSize (width, height, resolutionPolicy) {
        // Defensive code
        if ( !(width > 0 || height > 0) ){
            cc.logID(2200);
            return;
        }

        this.setResolutionPolicy(resolutionPolicy);
        const policy = this._resolutionPolicy;
        if (policy) {
            policy.preApply(this);
        }

        // Reinit frame size
        if (cc.sys.isMobile) {
            this._adjustViewportMeta();
        }

        // Permit to re-detect the orientation of device.
        this._orientationChanging = true;
        // If resizing, then frame size is already initialized, this logic should be improved
        if (!this._resizing) {
            this._initFrameSize();
        }

        if (!policy) {
            cc.logID(2201);
            return;
        }

        this._originalDesignResolutionSize.width = this._designResolutionSize.width = width;
        this._originalDesignResolutionSize.height = this._designResolutionSize.height = height;

        const result = policy.apply(this, this._designResolutionSize);

        if (result.scale && result.scale.length === 2){
            this._scaleX = result.scale[0];
            this._scaleY = result.scale[1];
        }

        if (result.viewport){
            const vp = this._viewportRect;
            const vb = this._visibleRect;
            const rv = result.viewport;

            vp.x = rv.x;
            vp.y = rv.y;
            vp.width = rv.width;
            vp.height = rv.height;

            vb.x = 0;
            vb.y = 0;
            vb.width = rv.width / this._scaleX;
            vb.height = rv.height / this._scaleY;
        }

        policy.postApply(this);
        cc.winSize.width = this._visibleRect.width;
        cc.winSize.height = this._visibleRect.height;

        if (cc.visibleRect) {
            cc.visibleRect.init(this._visibleRect);
        }

        this.emit('design-resolution-changed');
    }

    /**
     * @en
     * Returns the designed size for the view.
     * Default resolution size is the same as 'getFrameSize'.
     * @zh 返回视图的设计分辨率。
     * 默认下分辨率尺寸同 `getFrameSize` 方法相同
     * @method getDesignResolutionSize
     * @return {Size}
     */
    public getDesignResolutionSize () {
        return cc.size(this._designResolutionSize.width, this._designResolutionSize.height);
    }

    /**
     * @en
     * Sets the container to desired pixel resolution and fit the game content to it.
     * This function is very useful for adaptation in mobile browsers.
     * In some HD android devices, the resolution is very high, but its browser performance may not be very good.
     * In this case, enabling retina display is very costy and not suggested, and if retina is disabled, the image may be blurry.
     * But this API can be helpful to set a desired pixel resolution which is in between.
     * This API will do the following:
     *     1. Set viewport's width to the desired width in pixel
     *     2. Set body width to the exact pixel resolution
     *     3. The resolution policy will be reset with designed view size in points.
     * @zh 设置容器（container）需要的像素分辨率并且适配相应分辨率的游戏内容。
     * @method setRealPixelResolution
     * @param {Number} width Design resolution width.
     * @param {Number} height Design resolution height.
     * @param {ResolutionPolicy|Number} resolutionPolicy The resolution policy desired
     */
    public setRealPixelResolution (width, height, resolutionPolicy) {
        if (!CC_JSB && !CC_WECHATGAME && !CC_QQPLAY) {
            // Set viewport's width
            this._setViewportMeta({width}, true);

            // Set body width to the exact pixel resolution
            document.documentElement.style.width = width + 'px';
            document.body.style.width = width + 'px';
            document.body.style.left = '0px';
            document.body.style.top = '0px';
        }

        // Reset the resolution size and policy
        this.setDesignResolutionSize(width, height, resolutionPolicy);
    }

    /**
     * @en
     * Sets view port rectangle with points.
     * @zh 用设计分辨率下的点尺寸来设置视窗。
     * @method setViewportInPoints
     * @deprecated since v2.0
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w width
     * @param {Number} h height
     */
    public setViewportInPoints (x, y, w, h) {
        const locScaleX = this._scaleX;
        const locScaleY = this._scaleY;
        cc.game._renderContext.viewport((x * locScaleX + this._viewportRect.x),
            (y * locScaleY + this._viewportRect.y),
            (w * locScaleX),
            (h * locScaleY));
    }

    /**
     * @en
     * Sets Scissor rectangle with points.
     * @zh 用设计分辨率下的点的尺寸来设置 scissor 剪裁区域。
     * @method setScissorInPoints
     * @deprecated since v2.0
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    public setScissorInPoints (x, y, w, h) {
        const scaleX = this._scaleX;
        const scaleY = this._scaleY;
        const sx = Math.ceil(x * scaleX + this._viewportRect.x);
        const sy = Math.ceil(y * scaleY + this._viewportRect.y);
        const sw = Math.ceil(w * scaleX);
        const sh = Math.ceil(h * scaleY);
        const gl = cc.game._renderContext;

        if (!_scissorRect) {
            const boxArr = gl.getParameter(gl.SCISSOR_BOX);
            _scissorRect = new Rect(boxArr[0], boxArr[1], boxArr[2], boxArr[3]);
        }

        if (_scissorRect.x !== sx || _scissorRect.y !== sy || _scissorRect.width !== sw || _scissorRect.height !== sh) {
            _scissorRect.x = sx;
            _scissorRect.y = sy;
            _scissorRect.width = sw;
            _scissorRect.height = sh;
            gl.scissor(sx, sy, sw, sh);
        }
    }

    /**
     * @en
     * Returns whether GL_SCISSOR_TEST is enable
     * @zh 检查 scissor 是否生效。
     * @method isScissorEnabled
     * @deprecated since v2.0
     * @return {Boolean}
     */
    public isScissorEnabled () {
        const gl = cc.game._renderContext;
        return gl.isEnabled(gl.SCISSOR_TEST);
    }

    /**
     * @en
     * Returns the current scissor rectangle
     * @zh 返回当前的 scissor 剪裁区域。
     * @method getScissorRect
     * @deprecated since v2.0
     * @return {Rect}
     */
    public getScissorRect () {
        const gl = cc.game._renderContext;
        if (!_scissorRect) {
            const boxArr = gl.getParameter(gl.SCISSOR_BOX);
            _scissorRect = new Rect(boxArr[0], boxArr[1], boxArr[2], boxArr[3]);
        }
        const scaleXFactor = 1 / this._scaleX;
        const scaleYFactor = 1 / this._scaleY;
        return new Rect(
            (_scissorRect.x - this._viewportRect.x) * scaleXFactor,
            (_scissorRect.y - this._viewportRect.y) * scaleYFactor,
            _scissorRect.width * scaleXFactor,
            _scissorRect.height * scaleYFactor,
        );
    }

    /**
     * @en
     * Returns the view port rectangle.
     * @zh 返回视窗剪裁区域。
     * @method getViewportRect
     * @return {Rect}
     */
    public getViewportRect () {
        return this._viewportRect;
    }

    /**
     * @en
     * Returns scale factor of the horizontal direction (X axis).
     * @zh 返回横轴的缩放比，这个缩放比是将画布像素分辨率放到设计分辨率的比例。
     * @method getScaleX
     * @return {Number}
     */
    public getScaleX () {
        return this._scaleX;
    }

    /**
     * @en
     * Returns scale factor of the vertical direction (Y axis).
     * @zh 返回纵轴的缩放比，这个缩放比是将画布像素分辨率缩放到设计分辨率的比例。
     * @method getScaleY
     * @return {Number}
     */
    public getScaleY () {
        return this._scaleY;
    }

    /**
     * @en
     * Returns device pixel ratio for retina display.
     * @zh 返回设备或浏览器像素比例。
     * @method getDevicePixelRatio
     * @return {Number}
     */
    public getDevicePixelRatio () {
        return this._devicePixelRatio;
    }

    /**
     * @en
     * Returns the real location in view for a translation based on a related position
     * @zh 将屏幕坐标转换为游戏视图下的坐标。
     * @method convertToLocationInView
     * @param {Number} tx - The X axis translation
     * @param {Number} ty - The Y axis translation
     * @param {Object} relatedPos - The related position object including "left", "top", "width", "height" informations
     * @return {Vec2}
     */
    public convertToLocationInView (tx, ty, relatedPos, out) {
        const result = out || cc.v2();
        const x = this._devicePixelRatio * (tx - relatedPos.left);
        const y = this._devicePixelRatio * (relatedPos.top + relatedPos.height - ty);
        if (this._isRotated) {
            result.x = cc.game.canvas.width - y;
            result.y = x;
        }
        else {
            result.x = x;
            result.y = y;
        }
        return result;
    }

    // Resize helper functions
    private _resizeEvent () {
        const frameId = cc.director.getTotalFrames();
        if (_currentFrame !== frameId) {
            _currentFrame = frameId;
        }
        else {
            // Avoid adapte multiple times in a frame
            return;
        }
        // tslint:disable: no-shadowed-variable
        let view;
        if (this.setDesignResolutionSize) {
            view = this;
        } else {
            view = cc.view;
        }

        // Check frame size changed or not
        const prevFrameW = view._frameSize.width;
        const prevFrameH = view._frameSize.height;
        const prevRotated = view._isRotated;
        if (cc.sys.isMobile) {
            const containerStyle = cc.game.container.style;
            const margin = containerStyle.margin;
            containerStyle.margin = '0';
            containerStyle.display = 'none';
            view._initFrameSize();
            containerStyle.margin = margin;
            containerStyle.display = 'block';
        }
        else {
            view._initFrameSize();
        }
        if (!view._orientationChanging && view._isRotated === prevRotated && view._frameSize.width === prevFrameW && view._frameSize.height === prevFrameH) {
            return;
        }

        // Frame size changed, do resize works
        const width = view._originalDesignResolutionSize.width;
        const height = view._originalDesignResolutionSize.height;

        view._resizing = true;
        if (width > 0) {
            view.setDesignResolutionSize(width, height, view._resolutionPolicy);
        }
        view._resizing = false;

        if (view._resizeCallback) {
            view._resizeCallback.call();
        }
    }

    private _orientationChange () {
        cc.view._orientationChanging = true;
        cc.view._resizeEvent();
    }

    private _initFrameSize () {
        const locFrameSize = this._frameSize;
        const w = __BrowserGetter.availWidth(cc.game.frame);
        const h = __BrowserGetter.availHeight(cc.game.frame);
        const isLandscape: Boolean = w >= h;

        if (CC_EDITOR || !cc.sys.isMobile ||
            (isLandscape && this._orientation & cc.macro.ORIENTATION_LANDSCAPE) ||
            (!isLandscape && this._orientation & cc.macro.ORIENTATION_PORTRAIT)) {
            locFrameSize.width = w;
            locFrameSize.height = h;
            cc.game.container.style['-webkit-transform'] = 'rotate(0deg)';
            cc.game.container.style.transform = 'rotate(0deg)';
            this._isRotated = false;
        }
        else {
            locFrameSize.width = h;
            locFrameSize.height = w;
            cc.game.container.style['-webkit-transform'] = 'rotate(90deg)';
            cc.game.container.style.transform = 'rotate(90deg)';
            cc.game.container.style['-webkit-transform-origin'] = '0px 0px 0px';
            cc.game.container.style.transformOrigin = '0px 0px 0px';
            this._isRotated = true;

            // Fix for issue: https://github.com/cocos-creator/fireball/issues/8365
            // Reference: https://www.douban.com/note/343402554/
            // For Chrome, z-index not working after container transform rotate 90deg.
            // Because 'transform' style adds canvas (the top-element of container) to a new stack context.
            // That causes the DOM Input was hidden under canvas.
            // This should be done after container rotated, instead of in style-mobile.css.
            cc.game.canvas.style['-webkit-transform'] = 'translateZ(0px)';
            cc.game.canvas.style.transform = 'translateZ(0px)';
        }
        if (this._orientationChanging) {
            setTimeout(() => {
                cc.view._orientationChanging = false;
            }, 1000);
        }
    }

    // hack
    private _adjustSizeKeepCanvasSize () {
        const designWidth = this._originalDesignResolutionSize.width;
        const designHeight = this._originalDesignResolutionSize.height;
        if (designWidth > 0) {
            this.setDesignResolutionSize(designWidth, designHeight, this._resolutionPolicy);
        }
    }

    private _setViewportMeta (metas, overwrite) {
        let vp = document.getElementById('cocosMetaElement');
        if (vp && overwrite) {
            document.head.removeChild(vp);
        }

        const elems = document.getElementsByName('viewport');
        const currentVP = elems ? elems[0] : null;
        let content;
        let key;
        let pattern;

        content = currentVP ? currentVP.content : '';
        vp = vp || document.createElement('meta');
        vp.id = 'cocosMetaElement';
        vp.name = 'viewport';
        vp.content = '';

        for (key in metas) {
            if (content.indexOf(key) === -1) {
                content += ',' + key + '=' + metas[key];
            }
            else if (overwrite) {
                pattern = new RegExp(key + '\s*=\s*[^,]+');
                content.replace(pattern, key + '=' + metas[key]);
            }
        }
        if (/^,/.test(content)) {
            content = content.substr(1);
        }

        vp.content = content;
        // For adopting certain android devices which don't support second viewport
        if (currentVP) {
            currentVP.content = content;
        }

        document.head.appendChild(vp);
    }

    private _adjustViewportMeta () {
        if (this._isAdjustViewport && !CC_JSB && !CC_WECHATGAME && !CC_QQPLAY) {
            this._setViewportMeta(__BrowserGetter.meta, false);
            this._isAdjustViewport = false;
        }
    }

    private _convertMouseToLocation (in_out_point, relatedPos){
        in_out_point.x = this._devicePixelRatio * (in_out_point.x - relatedPos.left);
        in_out_point.y = this._devicePixelRatio * (relatedPos.top + relatedPos.height - in_out_point.y);
    }

    // _convertMouseToLocationInView (in_out_point, relatedPos) {
    //     var viewport = this._viewportRect, _t = this;
    //     in_out_point.x = ((_t._devicePixelRatio * (in_out_point.x - relatedPos.left)) - viewport.x) / _t._scaleX;
    //     in_out_point.y = (_t._devicePixelRatio * (relatedPos.top + relatedPos.height - in_out_point.y) - viewport.y) / _t._scaleY;
    // }

    private _convertPointWithScale (point) {
        const viewport = this._viewportRect;
        point.x = (point.x - viewport.x) / this._scaleX;
        point.y = (point.y - viewport.y) / this._scaleY;
    }

    private _convertTouchWidthScale (selTouch){
        const viewport = this._viewportRect;
        const scaleX = this._scaleX;
        const scaleY = this._scaleY;

        selTouch._point.x = (selTouch._point.x - viewport.x) / scaleX;
        selTouch._point.y = (selTouch._point.y - viewport.y) / scaleY;
        selTouch._prevPoint.x = (selTouch._prevPoint.x - viewport.x) / scaleX;
        selTouch._prevPoint.y = (selTouch._prevPoint.y - viewport.y) / scaleY;
    }

    private _convertTouchesWithScale (touches) {
        const viewport = this._viewportRect;
        const scaleX = this._scaleX;
        const scaleY = this._scaleY;
        let selPoint;
        let selPrePoint;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < touches.length; i++) {
            const selTouch = touches[i];
            selPoint = selTouch._point;
            selPrePoint = selTouch._prevPoint;

            selPoint.x = (selPoint.x - viewport.x) / scaleX;
            selPoint.y = (selPoint.y - viewport.y) / scaleY;
            selPrePoint.x = (selPrePoint.x - viewport.x) / scaleX;
            selPrePoint.y = (selPrePoint.y - viewport.y) / scaleY;
        }
    }
}

/**
 * !en
 * Emit when design resolution changed.
 * !zh
 * 当设计分辨率改变时发送。
 * @event design-resolution-changed
 * <p>cc.game.containerStrategy class is the root strategy class of container's scale strategy,
 * it controls the behavior of how to scale the cc.game.container and cc.game.canvas object</p>
 *
 * @class ContainerStrategy
 */
class ContainerStrategy {
    public static EQUAL_TO_FRAME: any;
    public static PROPORTION_TO_FRAME: any;

    public name: string = 'ContainerStrategy';

    /**
     * @en
     * Manipulation before appling the strategy
     * @zh 在应用策略之前的操作
     * @method preApply
     * @param {View} view - The target view
     */
    public preApply (view) {
    }

    /**
     * @en
     * Function to apply this strategy
     * @zh 策略应用方法
     * @method apply
     * @param {View} view
     * @param {Size} designedResolution
     */
    public apply (view, designedResolution) {
    }

    /**
     * @en
     * Manipulation after applying the strategy
     * @zh 策略调用之后的操作
     * @method postApply
     * @param {View} view  The target view
     */
    public postApply (view) {

    }

    protected _setupContainer (view, w, h) {
        const locCanvas = cc.game.canvas;
        const locContainer = cc.game.container;

        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                document.body.style.width = (view._isRotated ? h : w) + 'px';
                document.body.style.height = (view._isRotated ? w : h) + 'px';
            }
            // Setup style
            locContainer.style.width = locCanvas.style.width = w + 'px';
            locContainer.style.height = locCanvas.style.height = h + 'px';
        }
        // Setup pixel ratio for retina display
        let devicePixelRatio = view._devicePixelRatio = 1;
        if (view.isRetinaEnabled()) {
            devicePixelRatio = view._devicePixelRatio = Math.min(2, window.devicePixelRatio || 1);
        }
        // Setup canvas
        locCanvas.width = w * devicePixelRatio;
        locCanvas.height = h * devicePixelRatio;
    }

    protected _fixContainer () {
        // Add container to document body
        document.body.insertBefore(cc.game.container, document.body.firstChild);
        // Set body's width height to window's size, and forbid overflow, so that game will be centered
        const bs = document.body.style;
        bs.width = window.innerWidth + 'px';
        bs.height = window.innerHeight + 'px';
        bs.overflow = 'hidden';
        // Body size solution doesn't work on all mobile browser so this is the aleternative: fixed container
        const contStyle = cc.game.container.style;
        contStyle.position = 'fixed';
        contStyle.left = contStyle.top = '0px';
        // Reposition body
        document.body.scrollTop = 0;
    }
}

/**
 * <p>ContentStrategy class is the root strategy class of content's scale strategy,
 * it controls the behavior of how to scale the scene and setup the viewport for the game</p>
 *
 * @class ContentStrategy
 */
class ContentStrategy {
    public static EXACT_FIT: any;
    public static SHOW_ALL: any;
    public static NO_BORDER: any;
    public static FIXED_HEIGHT: any;
    public static FIXED_WIDTH: any;

    public name = 'ContentStrategy';
    private _result: { scale: number[]; viewport: null | Rect; };
    constructor () {
        this._result = {
            scale: [1, 1],
            viewport: null,
        };
    }

    /**
     * @en
     * Manipulation before applying the strategy
     * @zh 策略应用前的操作
     * @method preApply
     * @param {View} view - The target view
     */
    public preApply (view) {
    }

    /**
     * @en Function to apply this strategy
     * The return value is {scale: [scaleX, scaleY], viewport: {new Rect}},
     * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
     * @zh 调用策略方法
     * @method apply
     * @param {View} view
     * @param {Size} designedResolution
     * @return {Object} scaleAndViewportRect
     */
    public apply (view, designedResolution) {
        return {scale: [1, 1]};
    }

    /**
     * @en
     * Manipulation after applying the strategy
     * @zh 策略调用之后的操作
     * @method postApply
     * @param {View} view - The target view
     */
    public postApply (view) {
    }

    public _buildResult (containerW, containerH, contentW, contentH, scaleX, scaleY) {
        // Makes content fit better the canvas
        if ( Math.abs(containerW - contentW) < 2 ) {
                contentW = containerW;
        }
        if ( Math.abs(containerH - contentH) < 2 ) {
            contentH = containerH;
        }

        const viewport = new Rect(Math.round((containerW - contentW) / 2),
                               Math.round((containerH - contentH) / 2),
                               contentW, contentH);

        // Translate the content
        if (cc.game.renderType === Game.RENDER_TYPE_CANVAS){
            // TODO: modify something for setTransform
            // game._renderContext.translate(viewport.x, viewport.y + contentH);
        }

        this._result.scale = [scaleX, scaleY];
        this._result.viewport = viewport;
        return this._result;
    }
}

(() => {

// Container scale strategys
    /**
     * @class EqualToFrame
     * @extends ContainerStrategy
     */
    class EqualToFrame extends ContainerStrategy {
        public name = 'EqualToFrame';
        public apply (view) {
            const frameH = view._frameSize.height;
            const containerStyle = cc.game.container.style;
            this._setupContainer(view, view._frameSize.width, view._frameSize.height);
            // Setup container's margin and padding
            if (view._isRotated) {
                containerStyle.margin = '0 0 0 ' + frameH + 'px';
            }
            else {
                containerStyle.margin = '0px';
            }
            containerStyle.padding = '0px';
        }
    }

    /**
     * @class ProportionalToFrame
     * @extends ContainerStrategy
     */
    class ProportionalToFrame extends ContainerStrategy {
        public name = 'ProportionalToFrame';
        public apply (view, designedResolution) {
            const frameW = view._frameSize.width;
            const frameH = view._frameSize.height;
            const containerStyle = cc.game.container.style;
            const designW = designedResolution.width;
            const designH = designedResolution.height;
            const scaleX = frameW / designW;
            const scaleY = frameH / designH;
            let containerW;
            let containerH;

            scaleX < scaleY ? (containerW = frameW, containerH = designH * scaleX) : (containerW = designW * scaleY, containerH = frameH);

            // Adjust container size with integer value
            const offx = Math.round((frameW - containerW) / 2);
            const offy = Math.round((frameH - containerH) / 2);
            containerW = frameW - 2 * offx;
            containerH = frameH - 2 * offy;

            this._setupContainer(view, containerW, containerH);
            if (!CC_EDITOR) {
                // Setup container's margin and padding
                if (view._isRotated) {
                    containerStyle.margin = '0 0 0 ' + frameH + 'px';
                }
                else {
                    containerStyle.margin = '0px';
                }
                containerStyle.paddingLeft = offx + 'px';
                containerStyle.paddingRight = offx + 'px';
                containerStyle.paddingTop = offy + 'px';
                containerStyle.paddingBottom = offy + 'px';
            }
        }
    }

// Alias: Strategy that makes the container's size equals to the frame's size
    ContainerStrategy.EQUAL_TO_FRAME = new EqualToFrame();
// Alias: Strategy that scale proportionally the container's size to frame's size
    ContainerStrategy.PROPORTION_TO_FRAME = new ProportionalToFrame();

// Content scale strategys
    class ExactFit extends ContentStrategy {
        public name = 'ExactFit';
        public apply (view, designedResolution) {
            const containerW = cc.game.canvas.width;
            const containerH = cc.game.canvas.height;
            const scaleX = containerW / designedResolution.width;
            const scaleY = containerH / designedResolution.height;

            return this._buildResult(containerW, containerH, containerW, containerH, scaleX, scaleY);
        }
    }

    class ShowAll extends ContentStrategy {
        public name = 'ShowAll';
        public apply (view, designedResolution) {
            const containerW = cc.game.canvas.width;
            const containerH = cc.game.canvas.height;
            const designW = designedResolution.width;
            const designH = designedResolution.height;
            const scaleX = containerW / designW;
            const scaleY = containerH / designH;
            let scale = 0;
            let contentW;
            let contentH;

            scaleX < scaleY ? (scale = scaleX, contentW = containerW, contentH = designH * scale)
                : (scale = scaleY, contentW = designW * scale, contentH = containerH);

            return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        }
    }

    class NoBorder extends ContentStrategy {
        public name = 'NoBorder';
        public apply (view, designedResolution) {
            const containerW = cc.game.canvas.width;
            const containerH = cc.game.canvas.height;
            const designW = designedResolution.width;
            const designH = designedResolution.height;
            const scaleX = containerW / designW;
            const scaleY = containerH / designH;
            let scale;
            let contentW;
            let contentH;

            scaleX < scaleY ? (scale = scaleY, contentW = designW * scale, contentH = containerH)
                : (scale = scaleX, contentW = containerW, contentH = designH * scale);

            return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        }
    }

    class FixedHeight extends ContentStrategy {
        public name = 'FixedHeight';
        public apply (view, designedResolution) {
            const containerW = cc.game.canvas.width;
            const containerH = cc.game.canvas.height;
            const designH = designedResolution.height;
            const scale = containerH / designH;
            const contentW = containerW;
            const contentH = containerH;

            return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        }
    }

    class FixedWidth extends ContentStrategy {
        public name = 'FixedWidth';
        public apply (view, designedResolution) {
            const containerW = cc.game.canvas.width;
            const containerH = cc.game.canvas.height;
            const designW = designedResolution.width;
            const scale = containerW / designW;
            const contentW = containerW;
            const contentH = containerH;

            return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        }
    }

// Alias: Strategy to scale the content's size to container's size, non proportional
    ContentStrategy.EXACT_FIT = new ExactFit();
// Alias: Strategy to scale the content's size proportionally to maximum size and keeps the whole content area to be visible
    ContentStrategy.SHOW_ALL = new ShowAll();
// Alias: Strategy to scale the content's size proportionally to fill the whole container area
    ContentStrategy.NO_BORDER = new NoBorder();
// Alias: Strategy to scale the content's height to container's height and proportionally scale its width
    ContentStrategy.FIXED_HEIGHT = new FixedHeight();
// Alias: Strategy to scale the content's width to container's width and proportionally scale its height
    ContentStrategy.FIXED_WIDTH = new FixedWidth();

})();

/**
 * <p>ResolutionPolicy class is the root strategy class of scale strategy,
 * its main task is to maintain the compatibility with Cocos2d-x</p>
 *
 * @class ResolutionPolicy
 */
/**
 * @method constructor
 * @param {ContainerStrategy} containerStg The container strategy
 * @param {ContentStrategy} contentStg The content strategy
 */
class ResolutionPolicy {
    public static EXACT_FIT: number;
    public static SHOW_ALL: number;
    public static NO_BORDER: number;
    public static FIXED_HEIGHT: number;
    public static FIXED_WIDTH: number;
    public static UNKNOWN: number;
    public static ContainerStrategy: typeof ContainerStrategy;
    public static ContentStrategy: typeof ContentStrategy;

    public name = 'ResolutionPolicy';

    private _containerStrategy: null | ContainerStrategy;
    private _contentStrategy: null | ContentStrategy;

    /**
     * Constructor of ResolutionPolicy
     * @param {ContainerStrategy} containerStg
     * @param {ContentStrategy} contentStg
     */
    constructor (containerStg, contentStg) {
        this._containerStrategy = null;
        this._contentStrategy = null;
        this.setContainerStrategy(containerStg);
        this.setContentStrategy(contentStg);
    }

    get canvasSize () {
        return cc.v2(cc.game.canvas.width, cc.game.canvas.height);
    }

    /**
     * @en Manipulation before applying the resolution policy
     * @zh 策略应用前的操作
     * @method preApply
     * @param {View} view The target view
     */
    public preApply (view) {
        this._containerStrategy!.preApply(view);
        this._contentStrategy!.preApply(view);
    }

    /**
     * @en Function to apply this resolution policy
     * The return value is {scale: [scaleX, scaleY], viewport: {new Rect}},
     * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
     * @zh 调用策略方法
     * @method apply
     * @param {View} view - The target view
     * @param {Size} designedResolution - The user defined design resolution
     * @return {Object} An object contains the scale X/Y values and the viewport rect
     */
    public apply (view, designedResolution) {
        this._containerStrategy!.apply(view, designedResolution);
        return this._contentStrategy!.apply(view, designedResolution);
    }

    /**
     * @en Manipulation after appyling the strategy
     * @zh 策略应用之后的操作
     * @method postApply
     * @param {View} view - The target view
     */
    public postApply (view) {
        this._containerStrategy!.postApply(view);
        this._contentStrategy!.postApply(view);
    }

    /**
     * @en
     * Setup the container's scale strategy
     * @zh 设置容器的适配策略
     * @method setContainerStrategy
     * @param {ContainerStrategy} containerStg
     */
    public setContainerStrategy (containerStg) {
        if (containerStg instanceof ContainerStrategy) {
            this._containerStrategy = containerStg;
        }
    }

    /**
     * @en
     * Setup the content's scale strategy
     * @zh 设置内容的适配策略
     * @method setContentStrategy
     * @param {ContentStrategy} contentStg
     */
    public setContentStrategy (contentStg) {
        if (contentStg instanceof ContentStrategy) {
            this._contentStrategy = contentStg;
        }
    }
}

/**
 * The entire application is visible in the specified area without trying to preserve the original aspect ratio.<br/>
 * Distortion can occur, and the application may appear stretched or compressed.
 * @property {Number} EXACT_FIT
 * @readonly
 * @static
 */
ResolutionPolicy.EXACT_FIT = 0;

/**
 * The entire application fills the specified area, without distortion but possibly with some cropping,<br/>
 * while maintaining the original aspect ratio of the application.
 * @property {Number} NO_BORDER
 * @readonly
 * @static
 */
ResolutionPolicy.NO_BORDER = 1;

/**
 * The entire application is visible in the specified area without distortion while maintaining the original<br/>
 * aspect ratio of the application. Borders can appear on two sides of the application.
 * @property {Number} SHOW_ALL
 * @readonly
 * @static
 */
ResolutionPolicy.SHOW_ALL = 2;

/**
 * The application takes the height of the design resolution size and modifies the width of the internal<br/>
 * canvas so that it fits the aspect ratio of the device<br/>
 * no distortion will occur however you must make sure your application works on different<br/>
 * aspect ratios
 * @property {Number} FIXED_HEIGHT
 * @readonly
 * @static
 */
ResolutionPolicy.FIXED_HEIGHT = 3;

/**
 * The application takes the width of the design resolution size and modifies the height of the internal<br/>
 * canvas so that it fits the aspect ratio of the device<br/>
 * no distortion will occur however you must make sure your application works on different<br/>
 * aspect ratios
 * @property {Number} FIXED_WIDTH
 * @readonly
 * @static
 */
ResolutionPolicy.FIXED_WIDTH = 4;

/**
 * Unknow policy
 * @property {Number} UNKNOWN
 * @readonly
 * @static
 */
ResolutionPolicy.UNKNOWN = 5;

ResolutionPolicy.ContainerStrategy = ContainerStrategy;
ResolutionPolicy.ContentStrategy = ContentStrategy;
cc.ResolutionPolicy = ResolutionPolicy;

/**
 * @module cc
 */

/**
 * @en cc.view is the shared view object.
 * @zh cc.view 是全局的视图对象。
 * @property view
 * @static
 * @type {View}
 */
const view = cc.view = new View();

/**
 * @en cc.winSize is the alias object for the size of the current game window.
 * @zh cc.winSize 为当前的游戏窗口的大小。
 * @property winSize
 * @type Size
 */
cc.winSize = cc.v2();

export default view;
