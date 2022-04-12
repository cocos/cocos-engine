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
 * @module component/web-view
 */

import { legacyCC } from '../core/global-exports';
import { WebView } from './web-view';
import { EventType } from './web-view-enums';
import { UITransform } from '../2d/framework';
import { director } from '../core/director';
import { Node } from '../core/scene-graph';

export abstract class WebViewImpl {
    protected _componentEventList: Map<EventType, (...args: any[any]) => void> = new Map();
    protected _state = EventType.NONE;
    protected _wrapper: any; // Fix iframe display problem in ios.
    protected _webview: HTMLIFrameElement | null = null;

    protected _loaded = false;
    protected _forceUpdate = false;

    protected _component: WebView | null = null;
    protected _uiTrans: UITransform | null = null;
    protected _node: Node | null = null;

    protected _w = 0;
    protected _h = 0;
    protected _m00 = 0;
    protected _m01 = 0;
    protected _m04 = 0;
    protected _m05 = 0;
    protected _m12 = 0;
    protected _m13 = 0;

    constructor (component: WebView) {
        this._component = component;
        this._node = component.node;
        this._uiTrans = component.node.getComponent(UITransform);
        this.reset();
        this.createWebView();
    }

    public reset () {
        this._wrapper = null;
        this._webview = null;
        this._loaded = false;
        this._w = 0;
        this._h = 0;
        this._m00 = 0;
        this._m01 = 0;
        this._m04 = 0;
        this._m05 = 0;
        this._m12 = 0;
        this._m13 = 0;
        this._state = EventType.NONE;
        this._forceUpdate = false;
    }

    public abstract loadURL(url: string): void;
    public abstract createWebView(): void;
    public abstract removeWebView(): void;
    public abstract enable(): void;
    public abstract disable(): void;
    public abstract syncMatrix(): void;

    public abstract evaluateJS(str: string): void;
    public abstract setOnJSCallback(callback: () => void): void;
    public abstract setJavascriptInterfaceScheme(scheme: string): void;

    get loaded () { return this._loaded; }
    get componentEventList () { return this._componentEventList; }
    get webview () { return this._webview; }
    get state () { return this._state; }
    get UICamera () {
        return director.root!.batcher2D.getFirstRenderCamera(this._node!);
    }

    protected dispatchEvent (key: EventType, ...args: any[any]) {
        const callback = this._componentEventList.get(key);
        if (callback) {
            this._state = key;
            callback.call(this, args);
        }
    }

    public destroy () {
        this.removeWebView();
        this._wrapper = null;
        this._webview = null;
        this._loaded = false;
        this._component = null;
        this._uiTrans = null;
        this._forceUpdate = false;
        this._componentEventList.clear();
    }
}

legacyCC.internal.WebViewImpl = WebViewImpl;
