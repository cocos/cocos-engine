/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import { ccclass} from '../../../../core/data/class-decorator';
import sys from '../../../../core/platform/CCSys';
import * as utils from '../../../../core/utils/misc';
import * as vmath from '../../../../core/vmath';
import { Node } from '../../../../scene-graph';
import { UIRenderComponent } from '../ui-render-component';

const _mat4_temp = vmath.mat4.create();

export enum WebViewEventType {
    LOADING = 0,
    LOADED = 1,
    ERROR = 2,
    JS_EVALUATED = 3,
}

interface IFrameEventListener{
    load: EventListenerOrEventListenerObject | null;
    error: EventListenerOrEventListenerObject | null;
}

interface IPolyfill{
    devicePixelRatio: boolean;
    enableDiv: boolean;
    enableBG?: boolean;
    closeHistory?: boolean;
}

const polyfill: IPolyfill = {
    devicePixelRatio: false,
    enableDiv: false,
};

if (sys.os === sys.OS_IOS) {
    polyfill.enableDiv = true;
}

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

@ccclass('cc.WebviewImpl')
export class WebViewImpl{
    public static Polyfill = polyfill;
    public static EventType = WebViewEventType;
    private _EventList = new Map<WebViewEventType, Function | null>();

    private _visible = false;
    private _div: HTMLElement | null = null;
    private _iframe: HTMLIFrameElement | null = null;

    // update matrix cache
    private _forceUpdate = true;
    private _m00 = 0;
    private _m01 = 0;
    private _m04 = 0;
    private _m05 = 0;
    private _m12 = 0;
    private _m13 = 0;
    private _w = 0;
    private _h = 0;
    private _eventListeners: IFrameEventListener = { load: () => {}, error: () => {} };

    public createDomElementIfNeeded (w: number, h: number){
        // if (CC_EDITOR) {
        //     this._div = document.createElement('div');
        //     this._div.style.background = 'rgba(255, 255, 255, 0.8)';
        //     this._div.style.color = 'rgb(51, 51, 51)';
        //     this._div.style.height = w + 'px';
        //     this._div.style.width = h + 'px';
        //     this._div.style.position = 'absolute';
        //     this._div.style.bottom = '0px';
        //     this._div.style.left = '0px';
        //     this._div.style['word-wrap'] = 'break-word';
        //     cc.game.container.appendChild(this._div);
        // } else {
            if (!this._div) {
                this._createNativeControl(w, h);
            }
            else {
                this._updateSize(w, h);
            }
        // }
    }

    public removeDom () {
        const div = this._div;
        if (div) {
            const hasChild = utils.contains(cc.game.container, div);
            if (hasChild) {
                cc.game.container.removeChild(div);
            }

            this._div = null;
        }
        const iframe = this._iframe;
        if (iframe) {
            const cbs = this._eventListeners;
            iframe.removeEventListener('load', cbs.load!);
            iframe.removeEventListener('error', cbs.error!);
            cbs.load = null;
            cbs.error = null;
            this._iframe = null;
        }
    }

    /**
     * Load an URL
     * @param {String} url
     */
    public loadURL (url: string) {
        if (CC_EDITOR) {
            if (this._div){
                this._div.innerText = url;
            }
        } else {
            const iframe = this._iframe;
            if (iframe) {
                iframe.src = url;
                const self = this;
                const cb = () => {
                    // self._loaded = true;
                    self._updateVisibility();
                    iframe.removeEventListener('load', cb);
                };
                iframe.addEventListener('load', cb);
                this._dispatchEvent(WebViewImpl.EventType.LOADING);
            }
        }
    }

    /**
     * Stop loading
     */
    public stopLoading () {
        cc.logID(7800);
    }

    /**
     * Reload the WebView
     */
    public reload () {
        const iframe = this._iframe;
        if (iframe) {
            const win = iframe.contentWindow;
            if (win && win.location) {
                win.location.reload();
            }
        }
    }

    /**
     * Determine whether to go back
     */
    public canGoBack () {
        cc.logID(7801);
        return true;
    }

    /**
     * Determine whether to go forward
     */
    public canGoForward () {
        cc.logID(7802);
        return true;
    }

    /**
     * go back
     */
    public goBack () {
        try {
            if (WebViewImpl.Polyfill.closeHistory) {
                return cc.logID(7803);
            }
            const iframe = this._iframe;
            if (iframe) {
                const win = iframe.contentWindow;
                if (win && win.location) {
                    win.history.back.call(win);
                }
            }
        } catch (err) {
            cc.log(err);
        }
    }

    /**
     * go forward
     */
    public goForward () {
        try {
            if (WebViewImpl.Polyfill.closeHistory) {
                return cc.logID(7804);
            }
            const iframe = this._iframe;
            if (iframe) {
                const win = iframe.contentWindow;
                if (win && win.location) {
                    win.history.forward.call(win);
                }
            }
        } catch (err) {
            cc.log(err);
        }
    }

    /**
     * In the webview execution within a period of js string
     * @param {String} str
     */
    public evaluateJS (str: string) {
        const iframe = this._iframe;
        if (iframe) {
            const win = iframe.contentWindow;
            if (win){
                try {
                    // eval(str);
                    // this._dispatchEvent(WebViewImpl.EventType.JS_EVALUATED);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    /**
     * Limited scale
     */
    public setScalesPageToFit () {
        cc.logID(7805);
    }

    /**
     * The binding event
     * @param {WebViewImpl.EventType} event
     * @param {Function} callback
     */
    public setEventListener (event: WebViewEventType, callback: Function) {
        this._EventList[event] = callback;
    }

    /**
     * Delete events
     * @param {WebViewImpl.EventType} event
     */
    public removeEventListener (event: WebViewEventType) {
        this._EventList[event] = null;
    }

    public _dispatchEvent (event: WebViewEventType) {
        const callback = this._EventList[event];
        if (callback && this._iframe) {
            callback.call(this, this, this._iframe.src);
        }
    }

    // public _createRenderCmd () {
    //     return new WebViewImpl.RenderCmd(this);
    // }

    public destroy () {
        this.removeDom();
    }

    public setVisible (visible: boolean) {
        if (this._visible !== visible) {
            this._visible = !!visible;
            this._updateVisibility();
        }
    }

    public updateMatrix (node: Node) {
        if (!this._div || !this._visible) {
            return;
        }

        node.getWorldMatrix(_mat4_temp);
        const contentSize = node.getContentSize();
        if (!this._forceUpdate &&
            this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 &&
            this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 &&
            this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 &&
            this._w === contentSize.width && this._h === contentSize.height) {
            return;
        }

        // update matrix cache
        this._m00 = _mat4_temp.m00;
        this._m01 = _mat4_temp.m01;
        this._m04 = _mat4_temp.m04;
        this._m05 = _mat4_temp.m05;
        this._m12 = _mat4_temp.m12;
        this._m13 = _mat4_temp.m13;
        this._w = contentSize.width;
        this._h = contentSize.height;

        let scaleX = cc.view._scaleX;
        let scaleY = cc.view._scaleY;
        const dpr = cc.view._devicePixelRatio;

        scaleX /= dpr;
        scaleY /= dpr;

        const container = cc.game.container;
        const a = _mat4_temp.m00 * scaleX;
        const b = _mat4_temp.m01;
        const c = _mat4_temp.m04;
        const d = _mat4_temp.m05 * scaleY;

        const offsetX = container && container.style.paddingLeft ? parseInt(container.style.paddingLeft) : 0;
        const offsetY = container && container.style.paddingBottom ? parseInt(container.style.paddingBottom) : 0;
        this._updateSize(this._w, this._h);
        const w = this._div.clientWidth * scaleX;
        const h = this._div.clientHeight * scaleY;
        const ap = node.getAnchorPoint();
        const appx = (w * _mat4_temp.m00) * ap.x;
        const appy = (h * _mat4_temp.m05) * ap.y;
        const tx = _mat4_temp.m12 * scaleX - appx + offsetX;
        const ty = _mat4_temp.m13 * scaleY - appy + offsetY;

        const matrix = 'matrix(' + a + ',' + -b + ',' + -c + ',' + d + ',' + tx + ',' + -ty + ')';
        this._div.style.transform = matrix;
        this._div.style['-webkit-transform'] = matrix;
        this._div.style['transform-origin'] = '0px 100% 0px';
        this._div.style['-webkit-transform-origin'] = '0px 100% 0px';

        // chagned iframe opacity
        const renderComp = node.getComponent(UIRenderComponent);
        if (renderComp){
            this._setOpacity(renderComp.color.a);
        }
    }

    public setOnJSCallback (callback) { }
    public setJavascriptInterfaceScheme (scheme) { }
    public loadData (data, MIMEType, encoding, baseURL) { }
    public loadHTMLString (string, baseURL) { }

    private _updateVisibility () {
        if (!this._div) { return; }
        const div = this._div;
        if (this._visible) {
            div.style.visibility = 'visible';
        }
        else {
            div.style.visibility = 'hidden';
        }
        this._forceUpdate = true;
    }

    private _updateSize (w: number, h: number) {
        const div = this._div;
        if (div) {
            div.style.width = w + 'px';
            div.style.height = h + 'px';
        }
    }

    private _initEvent () {
        const iframe = this._iframe;
        if (iframe) {
            const cbs = this._eventListeners;
            const self = this;
            cbs.load = () => {
                self._dispatchEvent(WebViewImpl.EventType.LOADED);
            };
            cbs.error = () => {
                self._dispatchEvent(WebViewImpl.EventType.ERROR);
            };
            iframe.addEventListener('load', cbs.load);
            iframe.addEventListener('error', cbs.error);
        }
    }

    private _initStyle () {
        if (!this._div) {
            return;
        }

        const div = this._div;
        div.style.position = 'absolute';
        div.style.bottom = '0px';
        div.style.left = '0px';
    }

    private _setOpacity (opacity: number) {
        const iframe = this._iframe;
        if (iframe && iframe.style) {
            iframe.style.opacity = (opacity / 255).toString();
        }
    }

    private _createDom (w: number, h: number) {
        if (WebViewImpl.Polyfill.enableDiv) {
            this._div = document.createElement('div');
            this._div.style['-webkit-overflow'] = 'auto';
            this._div.style['-webkit-overflow-scrolling'] = 'touch';
            this._iframe = document.createElement('iframe');
            this._div.appendChild(this._iframe);
            this._iframe.style.width = '100%';
            this._iframe.style.height = '100%';
        }
        else {
            this._div = this._iframe = document.createElement('iframe');
        }

        if (WebViewImpl.Polyfill.enableBG) {
            this._div.style.background = '#FFF';
        }

        this._div.style.background = '#FFF';
        this._div.style.height = h + 'px';
        this._div.style.width = w + 'px';
        this._div.style.overflow = 'scroll';
        this._iframe.style.border = 'none';

        cc.game.container.appendChild(this._div);
        this._updateVisibility();
    }

    private _createNativeControl (w: number, h: number) {
        this._createDom(w, h);
        this._initStyle();
        this._initEvent();
    }
}
