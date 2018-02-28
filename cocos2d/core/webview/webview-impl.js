/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 http://www.cocos.com
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.
 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var Utils = require('../platform/utils');
var eventManager = require('../event-manager');
var sys = require('../platform/CCSys');

var WebViewImpl = cc.Class({
    name: "WebViewImpl",

    ctor () {
        // this.setContentSize(cc.size(300, 200));
        this._EventList = {};

        this._visible = false;
        this._parent = null;
        this._div = null;
        this._iframe = null;
        this._listener = null;

        // update matrix cache
        this._forceUpdate = true;
        this._m00 = 0;
        this._m01 = 0;
        this._m04 = 0;
        this._m05 = 0;
        this._m12 = 0;
        this._m13 = 0;
        this._w = 0;
        this._h = 0;
    },

    _updateVisibility () {
        if (!this._div) return;
        var div = this._div;
        if (this._visible) {
            div.style.visibility = 'visible';
        }
        else {
            div.style.visibility = 'hidden';
        }
        this._forceUpdate = true;
    },

    _updateSize (w, h) {
        var div = this._div;
        if (div) {
            div.style.width = w + "px";
            div.style.height = h + "px";
        }
    },

    _initEvent () {
        var self = this;
        this._iframe.addEventListener("load", function () {
            self._dispatchEvent(WebViewImpl.EventType.LOADED);
        });
        this._iframe.addEventListener("error", function () {
            self._dispatchEvent(WebViewImpl.EventType.ERROR);
        });
    },

    _initStyle () {
        if (!this._div) return;
        var div = this._div;
        div.style.position = "absolute";
        div.style.bottom = "0px";
        div.style.left = "0px";
    },

    _createDom (w, h) {
        if (WebViewImpl._polyfill.enableDiv) {
            this._div = document.createElement("div");
            this._div.style["-webkit-overflow"] = "auto";
            this._div.style["-webkit-overflow-scrolling"] = "touch";
            this._iframe = document.createElement("iframe");
            this._div.appendChild(this._iframe);
            this._iframe.style.width = "100%";
            this._iframe.style.height = "100%";
        }
        else {
            this._div = this._iframe = document.createElement("iframe");
        }

        if (WebViewImpl._polyfill.enableBG)
            this._div.style["background"] = "#FFF";

        this._div.style["background"] = "#FFF";
        this._div.style.height = h + "px";
        this._div.style.width = w + "px";
        this._div.style.overflow = "scroll";
        this._iframe.style.border = "none";
        cc.game.container.appendChild(this._div);
        this._updateVisibility();
    },

    _createNativeControl (w, h) {
        this._createDom(w, h);
        this._initStyle();
        this._initEvent();
    },

    createDomElementIfNeeded (w, h) {
        if (!this._div) {
            this._createNativeControl(w, h);
        }
        else {
            this._updateSize(w, h);
        }
    },

    removeDom () {
        var div = this._div;
        if (div) {
            var hasChild = Utils.contains(cc.game.container, div);
            if (hasChild)
                cc.game.container.removeChild(div);
        }
        this._div = null;
    },

    setOnJSCallback (callback) {},
    setJavascriptInterfaceScheme (scheme) {},
    loadData (data, MIMEType, encoding, baseURL) {},
    loadHTMLString (string, baseURL) {},

    /**
     * Load an URL
     * @param {String} url
     */
    loadURL (url) {
        var iframe = this._iframe;
        iframe.src = url;
        var self = this;
        var cb = function () {
            self._loaded = true;
            self._updateVisibility();
            iframe.removeEventListener("load", cb);
        };
        iframe.addEventListener("load", cb);
        this._dispatchEvent(WebViewImpl.EventType.LOADING);
    },

    /**
     * Stop loading
     */
    stopLoading () {
        cc.logID(7800);
    },

    /**
     * Reload the WebView
     */
    reload () {
        var iframe = this._iframe;
        if (iframe) {
            var win = iframe.contentWindow;
            if (win && win.location)
                win.location.reload();
        }
    },

    /**
     * Determine whether to go back
     */
    canGoBack () {
        cc.logID(7801);
        return true;
    },

    /**
     * Determine whether to go forward
     */
    canGoForward () {
        cc.logID(7802);
        return true;
    },

    /**
     * go back
     */
    goBack () {
        try {
            if (WebViewImpl._polyfill.closeHistory)
                return cc.logID(7803);
            var iframe = this._iframe;
            if (iframe) {
                var win = iframe.contentWindow;
                if (win && win.location)
                    win.history.back.call(win);
            }
        } catch (err) {
            cc.log(err);
        }
    },

    /**
     * go forward
     */
    goForward () {
        try {
            if (WebViewImpl._polyfill.closeHistory)
                return cc.logID(7804);
            var iframe = this._iframe;
            if (iframe) {
                var win = iframe.contentWindow;
                if (win && win.location)
                    win.history.forward.call(win);
            }
        } catch (err) {
            cc.log(err);
        }
    },

    /**
     * In the webview execution within a period of js string
     * @param {String} str
     */
    evaluateJS (str) {
        var iframe = this._iframe;
        if (iframe) {
            var win = iframe.contentWindow;
            try {
                win.eval(str);
                this._dispatchEvent(WebViewImpl.EventType.JS_EVALUATED);
            } catch (err) {
                console.error(err);
            }
        }
    },

    /**
     * Limited scale
     */
    setScalesPageToFit () {
        cc.logID(7805);
    },

    /**
     * The binding event
     * @param {_ccsg.WebView.EventType} event
     * @param {Function} callback
     */
    setEventListener (event, callback) {
        this._EventList[event] = callback;
    },

    /**
     * Delete events
     * @param {_ccsg.WebView.EventType} event
     */
    removeEventListener (event) {
        this._EventList[event] = null;
    },

    _dispatchEvent (event) {
        var callback = this._EventList[event];
        if (callback)
            callback.call(this, this, this._iframe.src);
    },

    _createRenderCmd () {
        return new WebViewImpl.RenderCmd(this);
    },

    destroy () {
        this.removeDom();
    },

    setVisible (visible) {
        if (this._visible !== visible) {
            this._visible = !!visible;
            this._updateVisibility();
        }
    },

    updateMatrix (node) {
        if (!this._div || !this._visible) return;

        node._updateWorldMatrix();
        var mat = node._worldMatrix;
        if (!this._forceUpdate &&
            this._m00 === mat.m00 && this._m01 === mat.m01 && this._m04 === mat.m04 && this._m05 === mat.m05 && this._m12 === mat.m12 && this._m13 === mat.m13 &&
            this._w === node._contentSize.width && this._h === node._contentSize.height) {
            return;
        }

        // update matrix cache
        this._m00 = mat.m00;
        this._m01 = mat.m01;
        this._m04 = mat.m04;
        this._m05 = mat.m05;
        this._m12 = mat.m12;
        this._m13 = mat.m13;
        this._w = node._contentSize.width;
        this._h = node._contentSize.height;

        var scaleX = cc.view._scaleX, scaleY = cc.view._scaleY;
        var dpr = cc.view._devicePixelRatio;

        scaleX /= dpr;
        scaleY /= dpr;

        var container = cc.game.container;
        var a = mat.m00 * scaleX, b = mat.m01, c = mat.m04, d = mat.m05 * scaleY;

        var offsetX = container && container.style.paddingLeft && parseInt(container.style.paddingLeft);
        var offsetY = container && container.style.paddingBottom && parseInt(container.style.paddingBottom);
        this._updateSize(this._w, this._h);
        var w = this._div.clientWidth * scaleX;
        var h = this._div.clientHeight * scaleY;
        var appx = w * node._anchorPoint.x;
        var appy = h - h * node._anchorPoint.y;
        var tx = mat.m12 * scaleX - appx + offsetX, ty = mat.m13 * scaleY - appy + offsetY;

        var matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
        this._div.style['transform'] = matrix;
        this._div.style['-webkit-transform'] = matrix;
        this._div.style['transform-origin'] = '0px 100% 0px';
        this._div.style['-webkit-transform-origin'] = '0px 100% 0px';
    }
});

WebViewImpl.EventType = {
    LOADING: 0,
    LOADED: 1,
    ERROR: 2,
    JS_EVALUATED: 3
};

var polyfill = WebViewImpl._polyfill = {
    devicePixelRatio: false,
    enableDiv: false
};

if (sys.os === sys.OS_IOS)
    polyfill.enableDiv = true;

if (sys.isMobile) {
    if (sys.browserType === sys.BROWSER_TYPE_FIREFOX) {
        polyfill.enableBG = true;
    }
}
else {
    if (sys.browserType === sys.BROWSER_TYPE_IE) {
        polyfill.closeHistory = true;
    }
}

module.exports = WebViewImpl;