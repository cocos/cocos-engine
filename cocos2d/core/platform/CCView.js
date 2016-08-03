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

var __BrowserGetter = {
    init: function(){
        this.html = document.getElementsByTagName("html")[0];
    },
    availWidth: function(frame){
        if(!frame || frame === this.html)
            return window.innerWidth;
        else
            return frame.clientWidth;
    },
    availHeight: function(frame){
        if(!frame || frame === this.html)
            return window.innerHeight;
        else
            return frame.clientHeight;
    },
    meta: {
        "width": "device-width"
    },
    adaptationType: cc.sys.browserType
};

if(window.navigator.userAgent.indexOf("OS 8_1_") > -1) //this mistake like MIUI, so use of MIUI treatment method
    __BrowserGetter.adaptationType = cc.sys.BROWSER_TYPE_MIUI;

if(cc.sys.os === cc.sys.OS_IOS) // All browsers are WebView
    __BrowserGetter.adaptationType = cc.sys.BROWSER_TYPE_SAFARI;

switch(__BrowserGetter.adaptationType){
    case cc.sys.BROWSER_TYPE_SAFARI:
        __BrowserGetter.meta["minimal-ui"] = "true";
        __BrowserGetter.availWidth = function(frame){
            return frame.clientWidth;
        };
        __BrowserGetter.availHeight = function(frame){
            return frame.clientHeight;
        };
        break;
    case cc.sys.BROWSER_TYPE_CHROME:
        __BrowserGetter.__defineGetter__("target-densitydpi", function(){
            return cc.view._targetDensityDPI;
        });
    case cc.sys.BROWSER_TYPE_SOUGOU:
    case cc.sys.BROWSER_TYPE_UC:
        __BrowserGetter.availWidth = function(frame){
            return frame.clientWidth;
        };
        __BrowserGetter.availHeight = function(frame){
            return frame.clientHeight;
        };
        break;
    case cc.sys.BROWSER_TYPE_MIUI:
        __BrowserGetter.init = function(view){
            if(view.__resizeWithBrowserSize) return;
            var resize = function(){
                view.setDesignResolutionSize(
                    view._designResolutionSize.width,
                    view._designResolutionSize.height,
                    view._resolutionPolicy
                );
                window.removeEventListener("resize", resize, false);
            };
            window.addEventListener("resize", resize, false);
        };
        break;
}

var _scissorRect = cc.rect();

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
var View = cc._Class.extend({
    _delegate: null,
    // Size of parent node that contains cc.container and cc.game.canvas
    _frameSize: null,
    // resolution size, it is the size appropriate for the app resources.
    _designResolutionSize: null,
    _originalDesignResolutionSize: null,
    // Viewport is the container's rect related to content's coordinates in pixel
    _viewPortRect: null,
    // The visible rect in content's coordinate in point
    _visibleRect: null,
    _retinaEnabled: false,
    _autoFullScreen: false,
    // The device's pixel ratio (for retina displays)
    _devicePixelRatio: 1,
    // the view name
    _viewName: "",
    // Custom callback for resize event
    _resizeCallback: null,

    _scaleX: 1,
    _originalScaleX: 1,
    _scaleY: 1,
    _originalScaleY: 1,

    _isRotated: false,
    _orientation: 3,

    _resolutionPolicy: null,
    _rpExactFit: null,
    _rpShowAll: null,
    _rpNoBorder: null,
    _rpFixedHeight: null,
    _rpFixedWidth: null,
    _initialized: false,

    _contentTranslateLeftTop: null,

    _frameZoomFactor: 1.0,
    __resizeWithBrowserSize: false,
    _isAdjustViewPort: true,
    _targetDensityDPI: null,

    _antiAliasEnabled: false,

    /**
     * Constructor of View
     */
    ctor: function () {
        var _t = this, d = document, _strategyer = cc.ContainerStrategy, _strategy = cc.ContentStrategy;

        __BrowserGetter.init(this);

        _t._frameSize = cc.size(0, 0);
        _t._initFrameSize();

        var w = cc.game.canvas.width, h = cc.game.canvas.height;
        _t._designResolutionSize = cc.size(w, h);
        _t._originalDesignResolutionSize = cc.size(w, h);
        _t._viewPortRect = cc.rect(0, 0, w, h);
        _t._visibleRect = cc.rect(0, 0, w, h);
        _t._contentTranslateLeftTop = {left: 0, top: 0};
        _t._viewName = "Cocos2dHTML5";

        var sys = cc.sys;
        _t.enableRetina(sys.os === sys.OS_IOS || sys.os === sys.OS_OSX);
        cc.visibleRect && cc.visibleRect.init(_t._visibleRect);

        // Setup system default resolution policies
        _t._rpExactFit = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.EXACT_FIT);
        _t._rpShowAll = new cc.ResolutionPolicy(_strategyer.PROPORTION_TO_FRAME, _strategy.SHOW_ALL);
        _t._rpNoBorder = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.NO_BORDER);
        _t._rpFixedHeight = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.FIXED_HEIGHT);
        _t._rpFixedWidth = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.FIXED_WIDTH);

        _t._targetDensityDPI = cc.macro.DENSITYDPI_HIGH;
        _t.enableAntiAlias(true);
    },

    // Resize helper functions
    _resizeEvent: function () {
        var view;
        if(this.setDesignResolutionSize){
            view = this;
        }else{
            view = cc.view;
        }

        // Check frame size changed or not
        var prevFrameW = view._frameSize.width, prevFrameH = view._frameSize.height, prevRotated = view._isRotated;
        view._initFrameSize();
        if (view._isRotated === prevRotated && view._frameSize.width === prevFrameW && view._frameSize.height === prevFrameH)
            return;

        // Frame size changed, do resize works
        var width = view._originalDesignResolutionSize.width;
        var height = view._originalDesignResolutionSize.height;
        if (width > 0)
            view.setDesignResolutionSize(width, height, view._resolutionPolicy);

        cc.eventManager.dispatchCustomEvent('canvas-resize');
        if (view._resizeCallback) {
            view._resizeCallback.call();
        }
    },

    /**
     * <p>
     * Sets view's target-densitydpi for android mobile browser. it can be set to:           <br/>
     *   1. cc.macro.DENSITYDPI_DEVICE, value is "device-dpi"                                      <br/>
     *   2. cc.macro.DENSITYDPI_HIGH, value is "high-dpi"  (default value)                         <br/>
     *   3. cc.macro.DENSITYDPI_MEDIUM, value is "medium-dpi" (browser's default value)            <br/>
     *   4. cc.macro.DENSITYDPI_LOW, value is "low-dpi"                                            <br/>
     *   5. Custom value, e.g: "480"                                                         <br/>
     * </p>
     *
     * @method setTargetDensityDPI
     * @param {String} densityDPI
     */
    setTargetDensityDPI: function(densityDPI){
        this._targetDensityDPI = densityDPI;
        this._adjustViewportMeta();
    },

    /**
     * Returns the current target-densitydpi value of cc.view.
     * @method getTargetDensityDPI
     * @returns {String}
     */
    getTargetDensityDPI: function(){
        return this._targetDensityDPI;
    },

    /**
     * Sets whether resize canvas automatically when browser's size changed.<br/>
     * Useful only on web.
     * @method resizeWithBrowserSize
     * @param {Boolean} enabled - Whether enable automatic resize with browser's resize event
     */
    resizeWithBrowserSize: function (enabled) {
        if (enabled) {
            //enable
            if (!this.__resizeWithBrowserSize) {
                this.__resizeWithBrowserSize = true;
                window.addEventListener('resize', this._resizeEvent);
                window.addEventListener('orientationchange', this._resizeEvent);
            }
        } else {
            //disable
            if (this.__resizeWithBrowserSize) {
                this.__resizeWithBrowserSize = false;
                window.removeEventListener('resize', this._resizeEvent);
                window.removeEventListener('orientationchange', this._resizeEvent);
            }
        }
    },

    /**
     * Sets the callback function for cc.view's resize action,<br/>
     * this callback will be invoked before applying resolution policy, <br/>
     * so you can do any additional modifications within the callback.<br/>
     * Useful only on web.
     * @method setResizeCallback
     * @param {Function|Null} callback - The callback function
     */
    setResizeCallback: function (callback) {
        if (typeof callback === 'function' || callback == null) {
            this._resizeCallback = callback;
        }
    },

    /**
     * Sets the orientation of the game, it can be landscape, portrait or auto.
     * When set it to landscape or portrait, and screen w/h ratio doesn't fit, 
     * cc.view will automatically rotate the game canvas using CSS.
     * Note that this function doesn't have any effect in native, 
     * in native, you need to set the application orientation in native project settings
     * @method setOrientation
     * @param {Number} orientation - Possible values: cc.macro.ORIENTATION_LANDSCAPE | cc.macro.ORIENTATION_PORTRAIT | cc.macro.ORIENTATION_AUTO
     */
    setOrientation: function (orientation) {
        orientation = orientation & cc.macro.ORIENTATION_AUTO;
        if (orientation) {
            this._orientation = orientation;
        }
    },

    _initFrameSize: function () {
        var locFrameSize = this._frameSize;
        var w = __BrowserGetter.availWidth(cc.game.frame);
        var h = __BrowserGetter.availHeight(cc.game.frame);
        var isLandscape = w >= h;

        if (CC_EDITOR || !cc.sys.isMobile ||
            (isLandscape && this._orientation & cc.macro.ORIENTATION_LANDSCAPE) || 
            (!isLandscape && this._orientation & cc.macro.ORIENTATION_PORTRAIT)) {
            locFrameSize.width = w;
            locFrameSize.height = h;
            cc.container.style['-webkit-transform'] = 'rotate(0deg)';
            cc.container.style.transform = 'rotate(0deg)';
            this._isRotated = false;
        }
        else {
            locFrameSize.width = h;
            locFrameSize.height = w;
            cc.container.style['-webkit-transform'] = 'rotate(90deg)';
            cc.container.style.transform = 'rotate(90deg)';
            cc.container.style['-webkit-transform-origin'] = '0px 0px 0px';
            cc.container.style.transformOrigin = '0px 0px 0px';
            this._isRotated = true;
        }
    },

    // hack
    _adjustSizeKeepCanvasSize: function () {
        var designWidth = this._originalDesignResolutionSize.width;
        var designHeight = this._originalDesignResolutionSize.height;
        if (designWidth > 0)
            this.setDesignResolutionSize(designWidth, designHeight, this._resolutionPolicy);
    },

    _setViewportMeta: function (metas, overwrite) {
        var vp = document.getElementById("cocosMetaElement");
        if(vp && overwrite){
            document.head.removeChild(vp);
        }

        var elems = document.getElementsByName("viewport"),
            currentVP = elems ? elems[0] : null,
            content, key, pattern;

        content = currentVP ? currentVP.content : "";
        vp = vp || document.createElement("meta");
        vp.id = "cocosMetaElement";
        vp.name = "viewport";
        vp.content = "";

        for (key in metas) {
            if (content.indexOf(key) == -1) {
                content += "," + key + "=" + metas[key];
            }
            else if (overwrite) {
                pattern = new RegExp(key+"\s*=\s*[^,]+");
                content.replace(pattern, key + "=" + metas[key]);
            }
        }
        if(/^,/.test(content))
            content = content.substr(1);

        vp.content = content;
        // For adopting certain android devices which don't support second viewport
        if (currentVP)
            currentVP.content = content;

        document.head.appendChild(vp);
    },

    _adjustViewportMeta: function () {
        if (this._isAdjustViewPort) {
            this._setViewportMeta(__BrowserGetter.meta, false);
            this._isAdjustViewPort = false;
        }
    },

    // Other helper functions
    _resetScale: function () {
        this._scaleX = this._originalScaleX;
        this._scaleY = this._originalScaleY;
    },

    // Useless, just make sure the compatibility temporarily, should be removed
    _adjustSizeToBrowser: function () {
    },

    initialize: function () {
        this._initialized = true;
    },

    /**
     * Sets whether the engine modify the "viewport" meta in your web page.<br/>
     * It's enabled by default, we strongly suggest you not to disable it.<br/>
     * And even when it's enabled, you can still set your own "viewport" meta, it won't be overridden<br/>
     * Only useful on web
     * @method adjustViewPort
     * @param {Boolean} enabled - Enable automatic modification to "viewport" meta
     */
    adjustViewPort: function (enabled) {
        this._isAdjustViewPort = enabled;
    },

    /**
     * Retina support is enabled by default for Apple device but disabled for other devices,<br/>
     * it takes effect only when you called setDesignResolutionPolicy<br/>
     * Only useful on web
     * @method enableRetina
     * @param {Boolean} enabled - Enable or disable retina display
     */
    enableRetina: function(enabled) {
        this._retinaEnabled = !!enabled;
    },

    /**
     * Check whether retina display is enabled.<br/>
     * Only useful on web
     * @method isRetinaEnabled
     * @return {Boolean}
     */
    isRetinaEnabled: function() {
        return this._retinaEnabled;
    },

    /**
     * !#en Whether to Enable on anti-alias
     * !#zh 是否开启抗锯齿
     * @method enableAntiAlias
     * @param {Boolean} enabled - Enable or not anti-alias
     */
    enableAntiAlias: function (enabled) {
        if (this._antiAliasEnabled === enabled) {
            return;
        }
        this._antiAliasEnabled = enabled;
        if(cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            var map = cc.loader._items.map;
            for (var key in map) {
                var item = map[key];
                var tex = item && item.content instanceof cc.Texture2D ? item.content : null;
                if (tex) {
                    if (enabled) {
                        tex.setAntiAliasTexParameters();
                    }
                    else {
                        tex.setAliasTexParameters();
                    }
                }
            }
        }
        else if(cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            var ctx = cc._canvas.getContext('2d');
            ctx.imageSmoothingEnabled = enabled;
            ctx.mozImageSmoothingEnabled = enabled;
            // refresh canvas
            var dirtyRegion = cc.rendererCanvas._dirtyRegion;
            if (dirtyRegion) {
                var oldRegion = new cc.Region();
                oldRegion.setTo(0, 0, cc.visibleRect.width, cc.visibleRect.height);
                dirtyRegion.addRegion(oldRegion);
            }
        }
    },

    /**
     * !#en Returns whether the current enable on anti-alias
     * !#zh 返回当前是否抗锯齿
     * @method isAntiAliasEnabled
     * @param {Boolean}
     */
    isAntiAliasEnabled: function () {
        return this._antiAliasEnabled;
    },

    /**
     * If enabled, the application will try automatically to enter full screen mode on mobile devices<br/>
     * You can pass true as parameter to enable it and disable it by passing false.<br/>
     * Only useful on web
     * @method enableAutoFullScreen
     * @param {Boolean} enabled - Enable or disable auto full screen on mobile devices
     */
    enableAutoFullScreen: function(enabled) {
        if (enabled && enabled !== this._autoFullScreen && cc.sys.isMobile && cc.game.frame === document.documentElement) {
            // Automatically full screen when user touches on mobile version
            this._autoFullScreen = true;
            cc.screen.autoFullScreen(cc.game.frame);
        }
        else {
            this._autoFullScreen = false;
        }
    },

    /**
     * Check whether auto full screen is enabled.<br/>
     * Only useful on web
     * @method isAutoFullScreenEnabled
     * @return {Boolean} Auto full screen enabled or not
     */
    isAutoFullScreenEnabled: function() {
        return this._autoFullScreen;
    },

    /**
     * Get whether render system is ready(no matter opengl or canvas),<br/>
     * this name is for the compatibility with cocos2d-x, subclass must implement this method.
     * @method isViewReady
     * @return {Boolean}
     */
    isViewReady: function () {
        return cc.game.canvas && cc._renderContext;
    },

    /*
     * Set zoom factor for frame. This method is for debugging big resolution (e.g.new ipad) app on desktop.
     * @method setFrameZoomFactor
     * @param {Number} zoomFactor
     */
    setFrameZoomFactor: function (zoomFactor) {
        this._frameZoomFactor = zoomFactor;
        this.centerWindow();
        cc.director.setProjection(cc.director.getProjection());
    },

    /**
     * Sets the resolution translate on View.
     * @method setContentTranslateLeftTop
     * @param {Number} offsetLeft
     * @param {Number} offsetTop
     */
    setContentTranslateLeftTop: function (offsetLeft, offsetTop) {
        this._contentTranslateLeftTop = {left: offsetLeft, top: offsetTop};
    },

    /**
     * Returns the resolution translate on View
     * @method getContentTranslateLeftTop
     * @return {Size|Object}
     */
    getContentTranslateLeftTop: function () {
        return this._contentTranslateLeftTop;
    },

    /*
     * Not support on native.<br/>
     * On web, it sets the size of the canvas.
     * @method setCanvasSize
     * @param {Number} width
     * @param {Number} height
     */
    setCanvasSize: function (width, height) {
        var canvas = cc.game.canvas;
        var container = cc.game.container;

        canvas.width = width * this._devicePixelRatio;
        canvas.height = height * this._devicePixelRatio;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        container.style.width = width + 'px';
        container.style.height = height + 'px';

        this._resizeEvent();
    },

    /*
     * Returns the canvas size of the view.<br/>
     * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
     * On web, it returns the size of the canvas element.
     * @method getCanvasSize
     * @return {Size}
     */
    getCanvasSize: function () {
        return cc.size(cc.game.canvas.width, cc.game.canvas.height);
    },

    /**
     * Returns the frame size of the view.<br/>
     * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
     * On web, it returns the size of the canvas's outer DOM element.
     * @method getFrameSize
     * @return {Size}
     */
    getFrameSize: function () {
        return cc.size(this._frameSize.width, this._frameSize.height);
    },

    /**
     * On native, it sets the frame size of view.<br/>
     * On web, it sets the size of the canvas's outer DOM element.
     * @method setFrameSize
     * @param {Number} width
     * @param {Number} height
     */
    setFrameSize: function (width, height) {
        this._frameSize.width = width;
        this._frameSize.height = height;
        cc.game.frame.style.width = width + "px";
        cc.game.frame.style.height = height + "px";
        //this.centerWindow();
        this._resizeEvent();
        cc.director.setProjection(cc.director.getProjection());
    },

    /**
     * Returns the visible area size of the view port.
     * @method getVisibleSize
     * @return {Size}
     */
    getVisibleSize: function () {
        return cc.size(this._visibleRect.width,this._visibleRect.height);
    },

    /**
     * Returns the visible area size of the view port.
     * @method getVisibleSizeInPixel
     * @return {Size}
     */
    getVisibleSizeInPixel: function () {
        return cc.size( this._visibleRect.width * this._scaleX,
                        this._visibleRect.height * this._scaleY );
    },

    /**
     * Returns the visible origin of the view port.
     * @method getVisibleOrigin
     * @return {Vec2}
     */
    getVisibleOrigin: function () {
        return cc.p(this._visibleRect.x,this._visibleRect.y);
    },

    /**
     * Returns the visible origin of the view port.
     * @method getVisibleOriginInPixel
     * @return {Vec2}
     */
    getVisibleOriginInPixel: function () {
        return cc.p(this._visibleRect.x * this._scaleX,
                    this._visibleRect.y * this._scaleY);
    },

    /**
     * Returns whether developer can set content's scale factor.
     * @method canSetContentScaleFactor
     * @return {Boolean}
     */
    canSetContentScaleFactor: function () {
        return true;
    },

    /**
     * Returns the current resolution policy
     * @see cc.ResolutionPolicy
     * @method getResolutionPolicy
     * @return {ResolutionPolicy}
     */
    getResolutionPolicy: function () {
        return this._resolutionPolicy;
    },

    /**
     * Sets the current resolution policy
     * @see cc.ResolutionPolicy
     * @method setResolutionPolicy
     * @param {ResolutionPolicy|Number} resolutionPolicy
     */
    setResolutionPolicy: function (resolutionPolicy) {
        var _t = this;
        if (resolutionPolicy instanceof cc.ResolutionPolicy) {
            _t._resolutionPolicy = resolutionPolicy;
        }
        // Ensure compatibility with JSB
        else {
            var _locPolicy = cc.ResolutionPolicy;
            if(resolutionPolicy === _locPolicy.EXACT_FIT)
                _t._resolutionPolicy = _t._rpExactFit;
            if(resolutionPolicy === _locPolicy.SHOW_ALL)
                _t._resolutionPolicy = _t._rpShowAll;
            if(resolutionPolicy === _locPolicy.NO_BORDER)
                _t._resolutionPolicy = _t._rpNoBorder;
            if(resolutionPolicy === _locPolicy.FIXED_HEIGHT)
                _t._resolutionPolicy = _t._rpFixedHeight;
            if(resolutionPolicy === _locPolicy.FIXED_WIDTH)
                _t._resolutionPolicy = _t._rpFixedWidth;
        }
    },

    /**
     * Sets the resolution policy with designed view size in points.<br/>
     * The resolution policy include: <br/>
     * [1] ResolutionExactFit       Fill screen by stretch-to-fit: if the design resolution ratio of width to height is different from the screen resolution ratio, your game view will be stretched.<br/>
     * [2] ResolutionNoBorder       Full screen without black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two areas of your game view will be cut.<br/>
     * [3] ResolutionShowAll        Full screen with black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two black borders will be shown.<br/>
     * [4] ResolutionFixedHeight    Scale the content's height to screen's height and proportionally scale its width<br/>
     * [5] ResolutionFixedWidth     Scale the content's width to screen's width and proportionally scale its height<br/>
     * [cc.ResolutionPolicy]        [Web only feature] Custom resolution policy, constructed by cc.ResolutionPolicy<br/>
     * @method setDesignResolutionSize
     * @param {Number} width Design resolution width.
     * @param {Number} height Design resolution height.
     * @param {ResolutionPolicy|Number} resolutionPolicy The resolution policy desired
     */
    setDesignResolutionSize: function (width, height, resolutionPolicy) {
        // Defensive code
        if( !(width > 0 || height > 0) ){
            cc.log(cc._LogInfos.view.setDesignResolutionSize);
            return;
        }

        this.setResolutionPolicy(resolutionPolicy);
        var policy = this._resolutionPolicy;
        if (!policy){
            cc.log(cc._LogInfos.view.setDesignResolutionSize_2);
            return;
        }
        policy.preApply(this);

        // Reinit frame size
        if(cc.sys.isMobile)
            this._adjustViewportMeta();

        this._initFrameSize();

        this._originalDesignResolutionSize.width = this._designResolutionSize.width = width;
        this._originalDesignResolutionSize.height = this._designResolutionSize.height = height;

        var result = policy.apply(this, this._designResolutionSize);

        if(result.scale && result.scale.length === 2){
            this._scaleX = result.scale[0];
            this._scaleY = result.scale[1];
        }

        if(result.viewport){
            var vp = this._viewPortRect,
                vb = this._visibleRect,
                rv = result.viewport;

            vp.x = rv.x;
            vp.y = rv.y;
            vp.width = rv.width;
            vp.height = rv.height;

            vb.x = -vp.x / this._scaleX;
            vb.y = -vp.y / this._scaleY;
            vb.width = cc.game.canvas.width / this._scaleX;
            vb.height = cc.game.canvas.height / this._scaleY;
            cc._renderContext.setOffset && cc._renderContext.setOffset(vp.x, -vp.y);
        }

        // reset director's member variables to fit visible rect
        var director = cc.director;
        director._winSizeInPoints.width = this._designResolutionSize.width;
        director._winSizeInPoints.height = this._designResolutionSize.height;
        policy.postApply(this);
        cc.winSize.width = director._winSizeInPoints.width;
        cc.winSize.height = director._winSizeInPoints.height;

        if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            // reset director's member variables to fit visible rect
            director.setGLDefaultValues();
        }

        this._originalScaleX = this._scaleX;
        this._originalScaleY = this._scaleY;
        // For editbox
        if (cc.DOM)
            cc.DOM._resetEGLViewDiv();
        cc.visibleRect && cc.visibleRect.init(this._visibleRect);
    },

    /**
     * Returns the designed size for the view.
     * Default resolution size is the same as 'getFrameSize'.
     * @method getDesignResolutionSize
     * @return {Size}
     */
    getDesignResolutionSize: function () {
        return cc.size(this._designResolutionSize.width, this._designResolutionSize.height);
    },

    /**
     * Sets the container to desired pixel resolution and fit the game content to it.
     * This function is very useful for adaptation in mobile browsers.
     * In some HD android devices, the resolution is very high, but its browser performance may not be very good.
     * In this case, enabling retina display is very costy and not suggested, and if retina is disabled, the image may be blurry.
     * But this API can be helpful to set a desired pixel resolution which is in between.
     * This API will do the following:
     *     1. Set viewport's width to the desired width in pixel
     *     2. Set body width to the exact pixel resolution
     *     3. The resolution policy will be reset with designed view size in points.
     * @method setRealPixelResolution
     * @param {Number} width Design resolution width.
     * @param {Number} height Design resolution height.
     * @param {ResolutionPolicy|Number} resolutionPolicy The resolution policy desired
     */
    setRealPixelResolution: function (width, height, resolutionPolicy) {
        // Set viewport's width
        this._setViewportMeta({"width": width}, true);

        // Set body width to the exact pixel resolution
        document.body.style.width = width + "px";
        document.body.style.left = "0px";
        document.body.style.top = "0px";

        // Reset the resolution size and policy
        this.setDesignResolutionSize(width, height, resolutionPolicy);
    },

    /**
     * Sets view port rectangle with points.
     * @method setViewPortInPoints
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w width
     * @param {Number} h height
     */
    setViewPortInPoints: function (x, y, w, h) {
        var locFrameZoomFactor = this._frameZoomFactor, locScaleX = this._scaleX, locScaleY = this._scaleY;
        cc._renderContext.viewport((x * locScaleX * locFrameZoomFactor + this._viewPortRect.x * locFrameZoomFactor),
            (y * locScaleY * locFrameZoomFactor + this._viewPortRect.y * locFrameZoomFactor),
            (w * locScaleX * locFrameZoomFactor),
            (h * locScaleY * locFrameZoomFactor));
    },

    /**
     * Sets Scissor rectangle with points.
     * @method setScissorInPoints
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    setScissorInPoints: function (x, y, w, h) {
        var zoomFactor = this._frameZoomFactor, scaleX = this._scaleX, scaleY = this._scaleY;
        _scissorRect.x = x;
        _scissorRect.y = y;
        _scissorRect.width = w;
        _scissorRect.height = h;
        cc._renderContext.scissor(x * scaleX * zoomFactor + this._viewPortRect.x * zoomFactor,
                                  y * scaleY * zoomFactor + this._viewPortRect.y * zoomFactor,
                                  w * scaleX * zoomFactor,
                                  h * scaleY * zoomFactor);
    },

    /**
     * Returns whether GL_SCISSOR_TEST is enable
     * @method isScissorEnabled
     * @return {Boolean}
     */
    isScissorEnabled: function () {
        return cc._renderContext.isEnabled(gl.SCISSOR_TEST);
    },

    /**
     * Returns the current scissor rectangle
     * @method getScissorRect
     * @return {Rect}
     */
    getScissorRect: function () {
        return cc.rect(_scissorRect);
    },

    /**
     * Sets the name of the view
     * @method setViewName
     * @param {String} viewName
     */
    setViewName: function (viewName) {
        if (viewName != null && viewName.length > 0) {
            this._viewName = viewName;
        }
    },

    /**
     * Returns the name of the view
     * @method getViewName
     * @return {String}
     */
    getViewName: function () {
        return this._viewName;
    },

    /**
     * Returns the view port rectangle.
     * @method getViewPortRect
     * @return {Rect}
     */
    getViewPortRect: function () {
        return this._viewPortRect;
    },

    /**
     * Returns scale factor of the horizontal direction (X axis).
     * @method getScaleX
     * @return {Number}
     */
    getScaleX: function () {
        return this._scaleX;
    },

    /**
     * Returns scale factor of the vertical direction (Y axis).
     * @method getScaleY
     * @return {Number}
     */
    getScaleY: function () {
        return this._scaleY;
    },

    /**
     * Returns device pixel ratio for retina display.
     * @method getDevicePixelRatio
     * @return {Number}
     */
    getDevicePixelRatio: function() {
        return this._devicePixelRatio;
    },

    /**
     * Returns the real location in view for a translation based on a related position
     * @method convertToLocationInView
     * @param {Number} tx - The X axis translation
     * @param {Number} ty - The Y axis translation
     * @param {Object} relatedPos - The related position object including "left", "top", "width", "height" informations
     * @return {Vec2}
     */
    convertToLocationInView: function (tx, ty, relatedPos) {
        var x = this._devicePixelRatio * (tx - relatedPos.left);
        var y = this._devicePixelRatio * (relatedPos.top + relatedPos.height - ty);
        return this._isRotated ? {x: this._viewPortRect.width - y, y: x} : {x: x, y: y};
    },

    _convertMouseToLocationInView: function (point, relatedPos) {
        var viewport = this._viewPortRect, _t = this;
        point.x = ((_t._devicePixelRatio * (point.x - relatedPos.left)) - viewport.x) / _t._scaleX;
        point.y = (_t._devicePixelRatio * (relatedPos.top + relatedPos.height - point.y) - viewport.y) / _t._scaleY;
    },

    _convertPointWithScale: function (point) {
        var viewport = this._viewPortRect;
        point.x = (point.x - viewport.x) / this._scaleX;
        point.y = (point.y - viewport.y) / this._scaleY;
    },

    _convertTouchesWithScale: function (touches) {
        var viewport = this._viewPortRect, scaleX = this._scaleX, scaleY = this._scaleY,
            selTouch, selPoint, selPrePoint;
        for( var i = 0; i < touches.length; i++){
            selTouch = touches[i];
            selPoint = selTouch._point;
            selPrePoint = selTouch._prevPoint;

            selPoint.x = (selPoint.x - viewport.x) / scaleX;
            selPoint.y = (selPoint.y - viewport.y) / scaleY;
            selPrePoint.x = (selPrePoint.x - viewport.x) / scaleX;
            selPrePoint.y = (selPrePoint.y - viewport.y) / scaleY;
        }
    }
});

/**
 * @method _getInstance
 * @return {View}
 * @private
 */
View._getInstance = function () {
    if (!this._instance) {
        this._instance = this._instance || new View();
        this._instance.initialize();
    }
    return this._instance;
};

/**
 * <p>cc.ContainerStrategy class is the root strategy class of container's scale strategy,
 * it controls the behavior of how to scale the cc.container and cc.game.canvas object</p>
 *
 * @class ContainerStrategy
 */
cc.ContainerStrategy = cc._Class.extend(/** @lends cc.ContainerStrategy# */{
    /**
     * Manipulation before appling the strategy
     * @method preApply
     * @param {View} view - The target view
     */
    preApply: function (view) {
    },

    /**
     * Function to apply this strategy
     * @method apply
     * @param {View} view
     * @param {Size} designedResolution
     */
    apply: function (view, designedResolution) {
    },

    /**
     * Manipulation after applying the strategy
     * @method postApply
     * @param {View} view  The target view
     */
    postApply: function (view) {

    },

    _setupContainer: function (view, w, h) {
        var locCanvas = cc.game.canvas, locContainer = cc.game.container;
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            document.body.style.width = (view._isRotated ? h : w) + 'px';
            document.body.style.height = (view._isRotated ? w : h) + 'px';
        }

        // Setup style
        locContainer.style.width = locCanvas.style.width = w + 'px';
        locContainer.style.height = locCanvas.style.height = h + 'px';
        // Setup pixel ratio for retina display
        var devicePixelRatio = view._devicePixelRatio = 1;
        if (view.isRetinaEnabled())
            devicePixelRatio = view._devicePixelRatio = Math.min(2, window.devicePixelRatio || 1);
        // Setup canvas
        locCanvas.width = w * devicePixelRatio;
        locCanvas.height = h * devicePixelRatio;
        cc._renderContext.resetCache && cc._renderContext.resetCache();
    },

    _fixContainer: function () {
        // Add container to document body
        document.body.insertBefore(cc.container, document.body.firstChild);
        // Set body's width height to window's size, and forbid overflow, so that game will be centered
        var bs = document.body.style;
        bs.width = window.innerWidth + "px";
        bs.height = window.innerHeight + "px";
        bs.overflow = "hidden";
        // Body size solution doesn't work on all mobile browser so this is the aleternative: fixed container
        cc.container.style.position = "fixed";
        // Reposition body
        document.body.scrollTop = 0;
    }
});

/**
 * <p>cc.ContentStrategy class is the root strategy class of content's scale strategy,
 * it controls the behavior of how to scale the scene and setup the viewport for the game</p>
 *
 * @class ContentStrategy
 */
cc.ContentStrategy = cc._Class.extend(/** @lends cc.ContentStrategy# */{

    _result: {
        scale: [1, 1],
        viewport: null
    },

    _buildResult: function (containerW, containerH, contentW, contentH, scaleX, scaleY) {
        // Makes content fit better the canvas
        Math.abs(containerW - contentW) < 2 && (contentW = containerW);
        Math.abs(containerH - contentH) < 2 && (contentH = containerH);

        var viewport = cc.rect(Math.round((containerW - contentW) / 2),
                               Math.round((containerH - contentH) / 2),
                               contentW, contentH);

        // Translate the content
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS){
            //TODO: modify something for setTransform
            //cc._renderContext.translate(viewport.x, viewport.y + contentH);
        }

        this._result.scale = [scaleX, scaleY];
        this._result.viewport = viewport;
        return this._result;
    },

    /**
     * Manipulation before applying the strategy
     * @method preApply
     * @param {View} view - The target view
     */
    preApply: function (view) {
    },

    /**
     * Function to apply this strategy
     * The return value is {scale: [scaleX, scaleY], viewport: {cc.Rect}},
     * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
     * @method apply
     * @param {View} view
     * @param {Size} designedResolution
     * @return {Object} scaleAndViewportRect
     */
    apply: function (view, designedResolution) {
        return {"scale": [1, 1]};
    },

    /**
     * Manipulation after applying the strategy
     * @method postApply
     * @param {View} view - The target view
     */
    postApply: function (view) {
    }
});

(function () {

// Container scale strategys
    /**
     * @class EqualToFrame
     * @extends ContainerStrategy
     */
    var EqualToFrame = cc.ContainerStrategy.extend({
        apply: function (view) {
            this._setupContainer(view, view._frameSize.width, view._frameSize.height);
        }
    });

    /**
     * @class ProportionalToFrame
     * @extends ContainerStrategy
     */
    var ProportionalToFrame = cc.ContainerStrategy.extend({
        apply: function (view, designedResolution) {
            var frameW = view._frameSize.width, frameH = view._frameSize.height, containerStyle = cc.container.style,
                designW = designedResolution.width, designH = designedResolution.height,
                scaleX = frameW / designW, scaleY = frameH / designH,
                containerW, containerH;

            scaleX < scaleY ? (containerW = frameW, containerH = designH * scaleX) : (containerW = designW * scaleY, containerH = frameH);

            // Adjust container size with integer value
            var offx = Math.round((frameW - containerW) / 2);
            var offy = Math.round((frameH - containerH) / 2);
            containerW = frameW - 2 * offx;
            containerH = frameH - 2 * offy;

            this._setupContainer(view, containerW, containerH);
            if (!CC_EDITOR) {
                // Setup container's margin and padding
                if (view._isRotated) {
                    containerStyle.marginLeft = frameH + 'px';
                }
                else {
                    containerStyle.margin = '0px';
                }
                containerStyle.paddingLeft = offx + "px";
                containerStyle.paddingRight = offx + "px";
                containerStyle.paddingTop = offy + "px";
                containerStyle.paddingBottom = offy + "px";
            }
        }
    });

    /**
     * @class EqualToWindow
     * @extends EqualToFrame
     */
    var EqualToWindow = EqualToFrame.extend({
        preApply: function (view) {
            this._super(view);
            cc.game.frame = document.documentElement;
        },

        apply: function (view) {
            this._super(view);
            this._fixContainer();
        }
    });

    /**
     * @class ProportionalToWindow
     * @extends ProportionalToFrame
     */
    var ProportionalToWindow = ProportionalToFrame.extend({
        preApply: function (view) {
            this._super(view);
            cc.game.frame = document.documentElement;
        },

        apply: function (view, designedResolution) {
            this._super(view, designedResolution);
            this._fixContainer();
        }
    });

    /**
     * @class OriginalContainer
     * @extends ContainerStrategy
     */
    var OriginalContainer = cc.ContainerStrategy.extend({
        apply: function (view) {
            this._setupContainer(view, cc.game.canvas.width, cc.game.canvas.height);
        }
    });

// #NOT STABLE on Android# Alias: Strategy that makes the container's size equals to the window's size
//    cc.ContainerStrategy.EQUAL_TO_WINDOW = new EqualToWindow();
// #NOT STABLE on Android# Alias: Strategy that scale proportionally the container's size to window's size
//    cc.ContainerStrategy.PROPORTION_TO_WINDOW = new ProportionalToWindow();
// Alias: Strategy that makes the container's size equals to the frame's size
    cc.ContainerStrategy.EQUAL_TO_FRAME = new EqualToFrame();
// Alias: Strategy that scale proportionally the container's size to frame's size
    cc.ContainerStrategy.PROPORTION_TO_FRAME = new ProportionalToFrame();
// Alias: Strategy that keeps the original container's size
    cc.ContainerStrategy.ORIGINAL_CONTAINER = new OriginalContainer();

// Content scale strategys
    var ExactFit = cc.ContentStrategy.extend({
        apply: function (view, designedResolution) {
            var containerW = cc.game.canvas.width, containerH = cc.game.canvas.height,
                scaleX = containerW / designedResolution.width, scaleY = containerH / designedResolution.height;

            return this._buildResult(containerW, containerH, containerW, containerH, scaleX, scaleY);
        }
    });

    var ShowAll = cc.ContentStrategy.extend({
        apply: function (view, designedResolution) {
            var containerW = cc.game.canvas.width, containerH = cc.game.canvas.height,
                designW = designedResolution.width, designH = designedResolution.height,
                scaleX = containerW / designW, scaleY = containerH / designH, scale = 0,
                contentW, contentH;

            scaleX < scaleY ? (scale = scaleX, contentW = containerW, contentH = designH * scale)
                : (scale = scaleY, contentW = designW * scale, contentH = containerH);

            return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        }
    });

    var NoBorder = cc.ContentStrategy.extend({
        apply: function (view, designedResolution) {
            var containerW = cc.game.canvas.width, containerH = cc.game.canvas.height,
                designW = designedResolution.width, designH = designedResolution.height,
                scaleX = containerW / designW, scaleY = containerH / designH, scale,
                contentW, contentH;

            scaleX < scaleY ? (scale = scaleY, contentW = designW * scale, contentH = containerH)
                : (scale = scaleX, contentW = containerW, contentH = designH * scale);

            return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        }
    });

    var FixedHeight = cc.ContentStrategy.extend({
        apply: function (view, designedResolution) {
            var containerW = cc.game.canvas.width, containerH = cc.game.canvas.height,
                designH = designedResolution.height, scale = containerH / designH,
                contentW = containerW, contentH = containerH;

            return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        },

        postApply: function (view) {
            cc.director._winSizeInPoints = view.getVisibleSize();
        }
    });

    var FixedWidth = cc.ContentStrategy.extend({
        apply: function (view, designedResolution) {
            var containerW = cc.game.canvas.width, containerH = cc.game.canvas.height,
                designW = designedResolution.width, scale = containerW / designW,
                contentW = containerW, contentH = containerH;

            return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        },

        postApply: function (view) {
            cc.director._winSizeInPoints = view.getVisibleSize();
        }
    });

// Alias: Strategy to scale the content's size to container's size, non proportional
    cc.ContentStrategy.EXACT_FIT = new ExactFit();
// Alias: Strategy to scale the content's size proportionally to maximum size and keeps the whole content area to be visible
    cc.ContentStrategy.SHOW_ALL = new ShowAll();
// Alias: Strategy to scale the content's size proportionally to fill the whole container area
    cc.ContentStrategy.NO_BORDER = new NoBorder();
// Alias: Strategy to scale the content's height to container's height and proportionally scale its width
    cc.ContentStrategy.FIXED_HEIGHT = new FixedHeight();
// Alias: Strategy to scale the content's width to container's width and proportionally scale its height
    cc.ContentStrategy.FIXED_WIDTH = new FixedWidth();

})();

/**
 * <p>cc.ResolutionPolicy class is the root strategy class of scale strategy,
 * its main task is to maintain the compatibility with Cocos2d-x</p>
 *
 * @class ResolutionPolicy
 */
/**
 * @method ResolutionPolicy
 * @param {ContainerStrategy} containerStg The container strategy
 * @param {ContentStrategy} contentStg The content strategy
 */
cc.ResolutionPolicy = cc._Class.extend(/** @lends cc.ResolutionPolicy# */{
    _containerStrategy: null,
    _contentStrategy: null,

    /**
     * Constructor of cc.ResolutionPolicy
     * @param {ContainerStrategy} containerStg
     * @param {ContentStrategy} contentStg
     */
    ctor: function (containerStg, contentStg) {
        this.setContainerStrategy(containerStg);
        this.setContentStrategy(contentStg);
    },

    /**
     * Manipulation before applying the resolution policy
     * @method preApply
     * @param {View} view The target view
     */
    preApply: function (view) {
        this._containerStrategy.preApply(view);
        this._contentStrategy.preApply(view);
    },

    /**
     * Function to apply this resolution policy
     * The return value is {scale: [scaleX, scaleY], viewport: {cc.Rect}},
     * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
     * @method apply
     * @param {View} view - The target view
     * @param {Size} designedResolution - The user defined design resolution
     * @return {Object} An object contains the scale X/Y values and the viewport rect
     */
    apply: function (view, designedResolution) {
        this._containerStrategy.apply(view, designedResolution);
        return this._contentStrategy.apply(view, designedResolution);
    },

    /**
     * Manipulation after appyling the strategy
     * @method postApply
     * @param {View} view - The target view
     */
    postApply: function (view) {
        this._containerStrategy.postApply(view);
        this._contentStrategy.postApply(view);
    },

    /**
     * Setup the container's scale strategy
     * @method setContainerStrategy
     * @param {ContainerStrategy} containerStg
     */
    setContainerStrategy: function (containerStg) {
        if (containerStg instanceof cc.ContainerStrategy)
            this._containerStrategy = containerStg;
    },

    /**
     * Setup the content's scale strategy
     * @method setContentStrategy
     * @param {ContentStrategy} contentStg
     */
    setContentStrategy: function (contentStg) {
        if (contentStg instanceof cc.ContentStrategy)
            this._contentStrategy = contentStg;
    }
});

cc.js.get(cc.ResolutionPolicy.prototype, "canvasSize", function () {
    return cc.v2(cc.game.canvas.width, cc.game.canvas.height);
});

/**
 * The entire application is visible in the specified area without trying to preserve the original aspect ratio.<br/>
 * Distortion can occur, and the application may appear stretched or compressed.
 * @property {Number} EXACT_FIT
 * @readonly
 * @static
 */
cc.ResolutionPolicy.EXACT_FIT = 0;

/**
 * The entire application fills the specified area, without distortion but possibly with some cropping,<br/>
 * while maintaining the original aspect ratio of the application.
 * @property {Number} NO_BORDER
 * @readonly
 * @static
 */
cc.ResolutionPolicy.NO_BORDER = 1;

/**
 * The entire application is visible in the specified area without distortion while maintaining the original<br/>
 * aspect ratio of the application. Borders can appear on two sides of the application.
 * @property {Number} SHOW_ALL
 * @readonly
 * @static
 */
cc.ResolutionPolicy.SHOW_ALL = 2;

/**
 * The application takes the height of the design resolution size and modifies the width of the internal<br/>
 * canvas so that it fits the aspect ratio of the device<br/>
 * no distortion will occur however you must make sure your application works on different<br/>
 * aspect ratios
 * @property {Number} FIXED_HEIGHT
 * @readonly
 * @static
 */
cc.ResolutionPolicy.FIXED_HEIGHT = 3;

/**
 * The application takes the width of the design resolution size and modifies the height of the internal<br/>
 * canvas so that it fits the aspect ratio of the device<br/>
 * no distortion will occur however you must make sure your application works on different<br/>
 * aspect ratios
 * @property {Number} FIXED_WIDTH
 * @readonly
 * @static
 */
cc.ResolutionPolicy.FIXED_WIDTH = 4;

/**
 * Unknow policy
 * @property {Number} UNKNOWN
 * @readonly
 * @static
 */
cc.ResolutionPolicy.UNKNOWN = 5;

module.exports = View;
