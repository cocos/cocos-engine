/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 */

/**
 * @packageDocumentation
 * @module webView
 */

import { EventType } from './web-view-enums';
import { error, warn, view } from '../core/platform';
import { WebViewImpl } from './web-view-impl';
import { game } from '../core';
import { mat4 } from '../core/math';
import { contains } from '../core/utils/misc';

const _mat4_temp = mat4();

export class WebViewImplWeb extends WebViewImpl {
    constructor (component: any) {
        super(component);
    }

    _bindDomEvent () {
        const onLoaded = (e) => {
            this._forceUpdate = true;
            this.dispatchEvent(EventType.LOADED);

            const iframe = e.target;
            const body = iframe.contentDocument && iframe.contentDocument.body;
            if (body && body.innerHTML.includes('404')) {
                this.dispatchEvent(EventType.ERROR);
            }
        };

        const onError = (e) => {
            this.dispatchEvent(EventType.ERROR);
            const errorObj = e.target.error;
            if (errorObj) {
                error(`Error ${errorObj.code}; details: ${errorObj.message}`);
            }
        };
        this.webview.addEventListener('load', onLoaded);
        this.webview.addEventListener('error', onError);
    }

    public loadURL (url: string) {
        if (this.webview) {
            this.webview.src = url;
            // emit loading event
            this.dispatchEvent(EventType.LOADING);
        }
    }

    public createWebView () {
        const warpper = document.createElement('div');
        this._warpper = warpper;
        warpper.id = 'webview-wrapper';
        warpper.style['-webkit-overflow'] = 'auto';
        warpper.style['-webkit-overflow-scrolling'] = 'touch';
        warpper.style.position = 'absolute';
        warpper.style.bottom = '0px';
        warpper.style.left = '0px';
        warpper.style.transformOrigin = '0px 100% 0px';
        warpper.style['-webkit-transform-origin'] = '0px 100% 0px';
        game.container!.appendChild(warpper);

        const webview = document.createElement('iframe');
        this._webview = webview;
        webview.id = 'webview';
        webview.style.border = 'none';
        webview.style.width = '100%';
        webview.style.height = '100%';
        warpper.appendChild(webview);
        this._bindDomEvent();
    }

    public removeWebView () {
        const warpper = this._warpper;
        if (contains(game.container, warpper)) {
            game.container!.removeChild(warpper);
        }
        this.reset();
    }

    public enable () {
        if (this._warpper) {
            this._warpper.style.visibility = 'visible';
        }
    }

    public disable () {
        if (this._warpper) {
            this._warpper.style.visibility = 'hidden';
        }
    }

    public evaluateJS (str: string) {
        if (this.webview) {
            const win = this.webview.contentWindow;
            if (win) {
                try {
                    win.eval(str);
                } catch (e) {
                    this.dispatchEvent(EventType.ERROR);
                    error(e);
                }
            }
        }
    }

    public setOnJSCallback (callback: Function) {
        warn('The platform does not support');
    }

    public setJavascriptInterfaceScheme (scheme: string) {
        warn('The platform does not support');
    }

    public syncMatrix () {
        if (!this._warpper || !this._uiTrans || !this._component || this._warpper.style.visibility === 'hidden') return;

        const camera = this.UICamera;
        if (!camera) {
            return;
        }

        this._component.node.getWorldMatrix(_mat4_temp);
        camera.update(true);
        camera.worldMatrixToScreen(_mat4_temp, _mat4_temp, game.canvas!.width, game.canvas!.height);

        const { width, height } = this._uiTrans.contentSize;
        if (!this._forceUpdate
            && this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01
            && this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05
            && this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13
            && this._w === width && this._h === height) {
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

        const dpr = view.getDevicePixelRatio();
        const scaleX = 1 / dpr;
        const scaleY = 1 / dpr;

        const container = game.container!;
        const sx = _mat4_temp.m00 * scaleX;
        const b = _mat4_temp.m01;
        const c = _mat4_temp.m04;
        const sy = _mat4_temp.m05 * scaleY;

        this._warpper.style.width = `${width}px`;
        this._warpper.style.height = `${height}px`;
        const w = this._w * scaleX;
        const h = this._h * scaleY;

        const appx = (w * _mat4_temp.m00) * this._uiTrans.anchorX;
        const appy = (h * _mat4_temp.m05) * this._uiTrans.anchorY;

        const offsetX = container && container.style.paddingLeft ? parseInt(container.style.paddingLeft) : 0;
        const offsetY = container && container.style.paddingBottom ? parseInt(container.style.paddingBottom) : 0;
        const tx = _mat4_temp.m12 * scaleX - appx + offsetX;
        const ty = _mat4_temp.m13 * scaleY - appy + offsetY;

        const matrix = `matrix(${sx},${-b},${-c},${sy},${tx},${-ty})`;
        this._warpper.style.transform = matrix;
        this._warpper.style['-webkit-transform'] = matrix;
        this._forceUpdate = false;
    }
}
