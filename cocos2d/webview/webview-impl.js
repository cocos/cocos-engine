/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { mat4 } from '../core/vmath';

const utils = require('../core/platform/utils');
const sys = require('../core/platform/CCSys');

let _mat4_temp = mat4.create();

let WebViewImpl = cc.Class({
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
        //
        this.__eventListeners = {};
    },

    _updateVisibility () {
        if (!this._div) return;
        let div = this._div;
        if (this._visible) {
            div.style.visibility = 'visible';
        }
        else {
            div.style.visibility = 'hidden';
        }
        this._forceUpdate = true;
    },

    _updateSize (w, h) {
        let div = this._div;
        if (div) {
            div.style.width = w + "px";
            div.style.height = h + "px";
        }
    },

    _initEvent () {
        let iframe = this._iframe;
        if (iframe) {
            let cbs = this.__eventListeners, self = this;
            cbs.load = function () {
                self._dispatchEvent(WebViewImpl.EventType.LOADED);
            };
            cbs.error = function () {
                self._dispatchEvent(WebViewImpl.EventType.ERROR);
            };
            iframe.addEventListener("load", cbs.load);
            iframe.addEventListener("error", cbs.error);
        }
    },

    _initStyle () {
        if (!this._div) return;
        let div = this._div;
        div.style.position = "absolute";
        div.style.bottom = "0px";
        div.style.left = "0px";
    },

    _setOpacity (opacity) {
        let iframe = this._iframe;
        if (iframe && iframe.style) {
            iframe.style.opacity = opacity / 255;
        }
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

    createDomElementIfNeeded: CC_EDITOR ? function (w, h) {
        this._div = document.createElement('div');
        this._div.style.background = 'rgba(255, 255, 255, 0.8)';
        this._div.style.color = 'rgb(51, 51, 51)';
        this._div.style.height = w + 'px';
        this._div.style.width = h + 'px';
        this._div.style.position = 'absolute';
        this._div.style.bottom = '0px';
        this._div.style.left = '0px';
        this._div.style['word-wrap'] = 'break-word';
        cc.game.container.appendChild(this._div);
    } : function (w, h) {
        if (!this._div) {
            this._createNativeControl(w, h);
        }
        else {
            this._updateSize(w, h);
        }
    },

    removeDom () {
        let div = this._div;
        if (div) {
            let hasChild = utils.contains(cc.game.container, div);
            if (hasChild)
                cc.game.container.removeChild(div);

            this._div = null;
        }
        let iframe = this._iframe;
        if (iframe) {
            let cbs = this.__eventListeners;
            iframe.removeEventListener("load", cbs.load);
            iframe.removeEventListener("error", cbs.error);
            cbs.load = null;
            cbs.error = null;
            this._iframe = null;
        }
    },

    setOnJSCallback (callback) {},
    setJavascriptInterfaceScheme (scheme) {},
    // private method
    loadData (data, MIMEType, encoding, baseURL) {},
    loadHTMLString (string, baseURL) {},

    /**
     * Load an URL
     * @param {String} url
     */
    loadURL: CC_EDITOR ? function (url) {
        this._div.innerText = url;
    } : function (url) {
        let iframe = this._iframe;
        if (iframe) {
            iframe.src = url;
            let self = this;
            let cb = function () {
                self._loaded = true;
                self._updateVisibility();
                iframe.removeEventListener("load", cb);
            };
            iframe.addEventListener("load", cb);
            this._dispatchEvent(WebViewImpl.EventType.LOADING);
        }
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
        let iframe = this._iframe;
        if (iframe) {
            let win = iframe.contentWindow;
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
            let iframe = this._iframe;
            if (iframe) {
                let win = iframe.contentWindow;
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
            let iframe = this._iframe;
            if (iframe) {
                let win = iframe.contentWindow;
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
        let iframe = this._iframe;
        if (iframe) {
            let win = iframe.contentWindow;
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
     * @param {WebViewImpl.EventType} event
     * @param {Function} callback
     */
    setEventListener (event, callback) {
        this._EventList[event] = callback;
    },

    /**
     * Delete events
     * @param {WebViewImpl.EventType} event
     */
    removeEventListener (event) {
        this._EventList[event] = null;
    },

    _dispatchEvent (event) {
        let callback = this._EventList[event];
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

        node.getWorldMatrix(_mat4_temp);
        let renderCamera = cc.Camera._findRendererCamera(node);
        if (renderCamera) {
            renderCamera.worldMatrixToScreen(_mat4_temp, _mat4_temp, cc.visibleRect.width, cc.visibleRect.height);
        }

        let _mat4_tempm = _mat4_temp.m;
        if (!this._forceUpdate &&
            this._m00 === _mat4_tempm[0] && this._m01 === _mat4_tempm[1] &&
            this._m04 === _mat4_tempm[4] && this._m05 === _mat4_tempm[5] &&
            this._m12 === _mat4_tempm[12] && this._m13 === _mat4_tempm[13] &&
            this._w === node._contentSize.width && this._h === node._contentSize.height) {
            return;
        }

        // update matrix cache
        this._m00 = _mat4_tempm[0];
        this._m01 = _mat4_tempm[1];
        this._m04 = _mat4_tempm[4];
        this._m05 = _mat4_tempm[5];
        this._m12 = _mat4_tempm[12];
        this._m13 = _mat4_tempm[13];
        this._w = node._contentSize.width;
        this._h = node._contentSize.height;

        let scaleX = cc.view._scaleX, scaleY = cc.view._scaleY;
        let dpr = cc.view._devicePixelRatio;

        scaleX /= dpr;
        scaleY /= dpr;

        let container = cc.game.container;
        let a = _mat4_tempm[0] * scaleX, b = _mat4_tempm[1], c = _mat4_tempm[4], d = _mat4_tempm[5] * scaleY;

        let offsetX = container && container.style.paddingLeft ? parseInt(container.style.paddingLeft) : 0;
        let offsetY = container && container.style.paddingBottom ? parseInt(container.style.paddingBottom) : 0;
        this._updateSize(this._w, this._h);
        let w = this._div.clientWidth * scaleX;
        let h = this._div.clientHeight * scaleY;
        let appx = (w * _mat4_tempm[0]) * node._anchorPoint.x;
        let appy = (h * _mat4_tempm[5]) * node._anchorPoint.y;

        let viewport = cc.view._viewportRect;
        offsetX += viewport.x / dpr;
        offsetY += viewport.y / dpr;

        let tx = _mat4_tempm[12] * scaleX - appx + offsetX, ty = _mat4_tempm[13] * scaleY - appy + offsetY;

        let matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
        this._div.style['transform'] = matrix;
        this._div.style['-webkit-transform'] = matrix;
        this._div.style['transform-origin'] = '0px 100% 0px';
        this._div.style['-webkit-transform-origin'] = '0px 100% 0px';

        // chagned iframe opacity
        this._setOpacity(node.opacity);
    }
});

WebViewImpl.EventType = {
    LOADING: 0,
    LOADED: 1,
    ERROR: 2,
    JS_EVALUATED: 3
};

let polyfill = WebViewImpl._polyfill = {
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
