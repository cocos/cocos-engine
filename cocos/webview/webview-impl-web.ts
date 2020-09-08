
/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 */

import { legacyCC } from "../core/global-exports";
import { WebView } from "./webview";
import { UITransform } from "../core/components/ui-base";
import { error } from "../core/platform";

const { game, view, mat4, misc, sys } = legacyCC;

const MIN_ZINDEX = -Math.pow(2, 15);

let _mat4_temp = mat4();

/**
 * @category component/webview
 */

export class WebViewImpl {

    protected _eventList: Map<number, Function> = new Map<number, Function>();
    protected _state = WebView.EventType.NONE;
    protected _webview: any;

    protected _loaded = false;

    protected _webViewComponent: WebView | null = null;
    protected _uiTrans: UITransform | null = null;

    protected _w = 0;
    protected _h = 0;
    protected _m00 = 0;
    protected _m01 = 0;
    protected _m04 = 0;
    protected _m05 = 0;
    protected _m12 = 0;
    protected _m13 = 0;
    protected _forceUpdate = false;

    protected _loadedCb: (e) => void;
    protected _errorCb: (e) => void;

    constructor (component) {
        this._webViewComponent = component;
        this._uiTrans = component.node.getComponent(UITransform);

        this._loadedCb = (e) => {
            this._forceUpdate = true;
            this._dispatchEvent(WebView.EventType.LOADED);
        };

        this._errorCb = (e) => {
            this._dispatchEvent(WebView.EventType.ERROR);
            let errorObj = e.target.error;
            if (errorObj) {
                error("Error " + errorObj.code + "; details: " + errorObj.message);
            }
        };
        this._appendDom();
    }

    get loaded () {
        return this._loaded;
    }

    get eventList () {
        return this._eventList;
    }

    get webview () {
        return this._webview;
    }

    get state () {
        return this._state;
    }

    public loadURL (url: string) {
        if (this._webview) {
            this._webview.src = url;
            // emit loading event
            this._dispatchEvent(WebView.EventType.LOADING);
        }
    }

    public evaluateJS (str: string) {
        if (this._webview) {
            let win = this._webview.contentWindow;
            if (win) {
                try {
                    win.eval(str);
                } catch (e) {
                    this._dispatchEvent(WebView.EventType.ERROR);
                    error(e);
                }
            }
        }
    }

    // Native method
    setOnJSCallback (callback: Function) {}
    setJavascriptInterfaceScheme (scheme: string) {}
    // ---

    protected _dispatchEvent (key) {
        let callback = this._eventList.get(key);
        if (callback) {
            this._state = key;
            callback.call(this);
        }
    }

    protected _appendDom () {
        this._webview = document.createElement("iframe");
        this._webview.style.border = "none";
        this._webview.style.position = "absolute";
        this._webview.style.bottom = "0px";
        this._webview.style.left = "0px";
        this._webview.style['transform-origin'] = '0px 100% 0px';
        this._webview.style['-webkit-transform-origin'] = '0px 100% 0px';
        this._bindEvent();
        game.container.appendChild(this._webview);
    }

    protected _removeDom () {
        let webview = this._webview;
        if (misc.contains(game.container, webview)) {
            game.container.removeChild(webview);
            this._removeEvent();
        }
        this._loaded = false;
        this._webview = null;
    }

    protected _bindEvent () {
        let webview = this._webview;
        webview.addEventListener('load', this._loadedCb);
        webview.addEventListener('error', this._errorCb);
    }

    protected _removeEvent () {
        let webview = this._webview;
        webview.removeEventListener('load', this._loadedCb);
        webview.removeEventListener('error', this._errorCb);
    }

    public enable () {
        if (this._webview) {
            this._webview.style.visibility = 'visible';
        }
    }

    public disable () {
        if (this._webview) {
            this._webview.style.visibility = 'hidden';
        }
    }

    public destroy () {
        this._removeDom();
        this._eventList.clear();
    }

    syncStyleSize (w, h) {
        let webview = this._webview;
        if (webview) {
            webview.style.width = w + 'px';
            webview.style.height = h + 'px';
        }
    }

    getUICamera () {
        if (!this._uiTrans || !this._uiTrans._canvas) {
            return null;
        }
        return this._uiTrans._canvas.camera;
    }

    public syncMatrix () {
        if (!this._webview || this._webview.style.visibility === 'hidden' || !this._webViewComponent) return;

        const camera = this.getUICamera();
        if (!camera) {
            return;
        }

        this._webViewComponent.node.getWorldMatrix(_mat4_temp);
        camera.update(true);
        camera.worldMatrixToScreen(_mat4_temp, _mat4_temp, game.canvas.width, game.canvas.height);

        let width = this._uiTrans!.contentSize.width;
        let height = this._uiTrans!.contentSize.height;
        if (!this._forceUpdate &&
            this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 &&
            this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 &&
            this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 &&
            this._w === width && this._h === height) {
            return;
        }

        // update matrix cache
        this._m00 = _mat4_temp.m00;
        this._m01 = _mat4_temp.m01;
        this._m04 = _mat4_temp.m04;
        this._m05 = _mat4_temp.m05;
        this._m12 = _mat4_temp.m12;
        this._m13 = _mat4_temp.m13;
        this._w = width;
        this._h = height;

        let dpr = view._devicePixelRatio;
        let scaleX = 1 / dpr;
        let scaleY = 1 / dpr;

        let container = game.container;
        let sx = _mat4_temp.m00 * scaleX, b = _mat4_temp.m01, c = _mat4_temp.m04, sy = _mat4_temp.m05 * scaleY;

        this._webview.style.width = `${width}px`;
        this._webview.style.height = `${height}px`;
        let w = this._w * scaleX;
        let h = this._h * scaleY;

        let appx = (w * _mat4_temp.m00) * this._uiTrans!.anchorX;
        let appy = (h * _mat4_temp.m05) * this._uiTrans!.anchorY;

        let offsetX = container && container.style.paddingLeft ? parseInt(container.style.paddingLeft) : 0;
        let offsetY = container && container.style.paddingBottom ? parseInt(container.style.paddingBottom) : 0;
        let tx = _mat4_temp.m12 * scaleX - appx + offsetX, ty = _mat4_temp.m13 * scaleY - appy + offsetY;

        let matrix = "matrix(" + sx + "," + -b + "," + -c + "," + sy + "," + tx + "," + -ty + ")";
        this._webview.style['transform'] = matrix;
        this._webview.style['-webkit-transform'] = matrix;
        this._forceUpdate = false;
    }
}

legacyCC.internal.WebViewImpl = WebViewImpl;
