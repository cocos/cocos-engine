/****************************************************************************
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
 ****************************************************************************/

'use strict';

if (cc.internal.WebView) {

    const { EventType } = cc.internal.WebView;

    let vec3 = cc.Vec3;
    let mat4 = cc.Mat4;
    let _mat4_temp = new mat4();

    let _topLeft = new vec3();
    let _bottomRight = new vec3();

    cc.internal.WebViewImplManager.getImpl = function(componenet) {
        return new WebViewImplJSB(componenet);
    };

    class WebViewImplJSB extends cc.internal.WebViewImpl {

        constructor(componenet) {
            super(componenet);
            this.jsCallback = null;
            this.interfaceSchema = null;
            this._matViewProj_temp = new mat4();
        }

        _bindEvent() {
            let onLoaded = () => {
                this._forceUpdate = true;
                this.dispatchEvent(EventType.LOADED);
            };

            let onError = () => {
                this.dispatchEvent(EventType.ERROR);
            };
            this.webview.setOnDidFinishLoading(onLoaded);
            this.webview.setOnDidFailLoading(onError);
            this.jsCallback && this.setOnJSCallback(this.jsCallback);
            this.interfaceSchema && this.setJavascriptInterfaceScheme(this.interfaceSchema);
            // remove obj
            this.jsCallback = null;
            this.interfaceSchema = null;
        }

        createWebView() {
            if (!jsb.WebView) {
                console.warn('jsb.WebView is null');
                return;
            }
            this._webview = jsb.WebView.create();
            this._bindEvent();
        }

        removeWebView() {
            let webview = this.webview;
            if (webview) {
                this.webview.destroy();
                this.reset();
            }
        }

        disable() {
            if (this.webview) {
                this.webview.setVisible(false);
            }
        }

        enable() {
            if (this.webview) {
                this.webview.setVisible(true);
            }
        }

        setOnJSCallback(callback) {
            let webview = this.webview;
            if (webview) {
                webview.setOnJSCallback(callback);
            } else {
                this.jsCallback = callback;
            }
        }

        setJavascriptInterfaceScheme(scheme) {
            let webview = this.webview;
            if (webview) {
                webview.setJavascriptInterfaceScheme(scheme);
            } else {
                this.interfaceSchema = scheme;
            }
        }

        loadURL(url) {
            let webview = this.webview;
            if (webview) {
                webview.src = url;
                webview.loadURL(url);
                this.dispatchEvent(EventType.LOADING);
            }
        }

        evaluateJS(str) {
            let webview = this.webview;
            if (webview) {
                return webview.evaluateJS(str);
            }
        }

        syncMatrix() {
            if (!this._webview || !this._component || !this._uiTrans) return;

            const camera = this.UICamera;
            if (!camera) {
                return;
            }

            this._component.node.getWorldMatrix(_mat4_temp);
            const { width, height } = this._uiTrans.contentSize;
            if (!this._forceUpdate &&
                camera.matViewProj.equals(this._matViewProj_temp) &&
                this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 &&
                this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 &&
                this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 &&
                this._w === width && this._h === height) {
                return;
            }

            this._matViewProj_temp.set(camera.matViewProj);
            // update matrix cache
            this._m00 = _mat4_temp.m00;
            this._m01 = _mat4_temp.m01;
            this._m04 = _mat4_temp.m04;
            this._m05 = _mat4_temp.m05;
            this._m12 = _mat4_temp.m12;
            this._m13 = _mat4_temp.m13;
            this._w = width;
            this._h = height;

            let canvas_width = cc.game.canvas.width;
            let canvas_height = cc.game.canvas.height;

            let ap = this._uiTrans.anchorPoint;
            // Vectors in node space
            vec3.set(_topLeft, -ap.x * this._w, (1.0 - ap.y) * this._h, 0);
            vec3.set(_bottomRight, (1 - ap.x) * this._w, -ap.y * this._h, 0);
            // Convert to world space
            vec3.transformMat4(_topLeft, _topLeft, _mat4_temp);
            vec3.transformMat4(_bottomRight, _bottomRight, _mat4_temp);
            // need update camera data
            camera.update();
            // Convert to Screen space
            camera.worldToScreen(_topLeft, _topLeft);
            camera.worldToScreen(_bottomRight, _bottomRight);

            let finalWidth = _bottomRight.x - _topLeft.x;
            let finalHeight = _topLeft.y - _bottomRight.y;
            this._webview.setFrame(_topLeft.x, canvas_height - _topLeft.y, finalWidth, finalHeight);
            this._forceUpdate = false;
        }
    }
}
