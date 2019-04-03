/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import { EventHandler } from '../../../../components/component-event-handler';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../../../core/data/class-decorator';
import { UIComponent } from '../ui-component';
import { WebViewEventType, WebViewImpl } from './webview-impl';

/**
 * !#en WebView event type
 * !#zh 网页视图事件类型
 * @enum WebView.EventType
 */
const EventType = WebViewEventType;

/**
 * !#en Web page Load completed.
 * !#zh  网页加载完成
 * @property {String} LOADED
 */

/**
 * !#en Web page is loading.
 * !#zh  网页加载中
 * @property {String} LOADING
 */

/**
 * !#en Web page error occurs when loading.
 * !#zh  网页加载出错
 * @property {String} ERROR
 */

//
function emptyCallback () { }

/**
 * !#en cc.WebView is a component for display web pages in the game
 * !#zh WebView 组件，用于在游戏中显示网页
 * @class WebView
 * @extends Component
 */

@ccclass('cc.WebviewComponent')
@menu('UI/WebView')
@executionOrder(100)
// @executeInEditMode
export class WebviewComponent extends UIComponent {
    /**
     * !#en A given URL to be loaded by the WebView, it should have a http or https prefix.
     * !#zh 指定 WebView 加载的网址，它应该是一个 http 或者 https 开头的字符串
     * @property {String} url
     */
    @property
    get url () {
        return this._url;
    }

    set url (url: string) {
        this._url = url;
        const impl = this._impl;
        if (impl) {
            impl.loadURL(url);
        }
    }
    public static EventType = EventType;

    /**
     * !#en The webview's event callback , it will be triggered when certain webview event occurs.
     * !#zh WebView 的回调事件，当网页加载过程中，加载完成后或者加载出错时都会回调此函数
     * @property {Component.EventHandler[]} webviewLoadedEvents
     */
    @property({
        type: EventHandler,
    })
    public webviewEvents: EventHandler[] = [];

    @property
    private _url = '';
    private _impl: WebViewImpl | null = null;

    constructor (){
        super();
        //  TODO: finished in CC_EDITOR
        if (!CC_EDITOR){
            this._impl = new WebViewImpl();
        }
    }

    public onRestore () {
        if (!this._impl) {
            this._impl = new WebViewImpl();
        }
    }

    public onEnable () {
        if (!this._impl){
            return;
        }

        const impl = this._impl;
        impl.createDomElementIfNeeded(this.node.width, this.node.height);
        impl.loadURL(this._url);
        impl.setVisible(true);
        // if (!CC_EDITOR) {
        impl.setEventListener(EventType.LOADED, this._onWebViewLoaded.bind(this));
        impl.setEventListener(EventType.LOADING, this._onWebViewLoading.bind(this));
        impl.setEventListener(EventType.ERROR, this._onWebViewLoadError.bind(this));
        // }
    }

    public onDisable () {
        if (!this._impl) {
            return;
        }

        const impl = this._impl;
        impl.setVisible(false);
        // if (!CC_EDITOR) {
        impl.setEventListener(EventType.LOADED, emptyCallback);
        impl.setEventListener(EventType.LOADING, emptyCallback);
        impl.setEventListener(EventType.ERROR, emptyCallback);
        // }
    }

    public onDestroy () {
        if (this._impl) {
            this._impl.destroy();
            this._impl = null;
        }
    }

    public update (dt) {
        if (CC_EDITOR){
            return;
        }

        if (this._impl) {
            this._impl.updateMatrix(this.node);
        }
    }

    /**
     * !#en
     * Set javascript interface scheme (see also setOnJSCallback). <br/>
     * Note: Supports only on the Android and iOS. For HTML5, please refer to the official documentation.<br/>
     * Please refer to the official documentation for more details.
     * !#zh
     * 设置 JavaScript 接口方案（与 'setOnJSCallback' 配套使用）。<br/>
     * 注意：只支持 Android 和 iOS ，Web 端用法请前往官方文档查看。<br/>
     * 详情请参阅官方文档
     * @method setJavascriptInterfaceScheme
     * @param {String} scheme
     */
    public setJavascriptInterfaceScheme (scheme: string) {
        if (this._impl) {
            this._impl.setJavascriptInterfaceScheme(scheme);
        }
    }

    /**
     * !#en
     * This callback called when load URL that start with javascript
     * interface scheme (see also setJavascriptInterfaceScheme). <br/>
     * Note: Supports only on the Android and iOS. For HTML5, please refer to the official documentation.<br/>
     * Please refer to the official documentation for more details.
     * !#zh
     * 当加载 URL 以 JavaScript 接口方案开始时调用这个回调函数。<br/>
     * 注意：只支持 Android 和 iOS，Web 端用法请前往官方文档查看。
     * 详情请参阅官方文档
     * @method setOnJSCallback
     * @param {Function} callback
     */
    public setOnJSCallback (callback: Function) {
        if (this._impl) {
            this._impl.setOnJSCallback(callback);
        }
    }

    /**
     * !#en
     * Evaluates JavaScript in the context of the currently displayed page. <br/>
     * Please refer to the official document for more details <br/>
     * Note: Cross domain issues need to be resolved by yourself <br/>
     * !#zh
     * 执行 WebView 内部页面脚本（详情请参阅官方文档） <br/>
     * 注意：需要自行解决跨域问题
     * @method evaluateJS
     * @param {String} str
     */
    public evaluateJS (str: string) {
        if (this._impl) {
            this._impl.evaluateJS(str);
        }
    }

    private _onWebViewLoaded () {
        EventHandler.emitEvents(this.webviewEvents, this, EventType.LOADED);
        this.node.emit('loaded', this);
    }

    private _onWebViewLoading () {
        EventHandler.emitEvents(this.webviewEvents, this, EventType.LOADING);
        this.node.emit('loading', this);
        return true;
    }

    private _onWebViewLoadError () {
        EventHandler.emitEvents(this.webviewEvents, this, EventType.ERROR);
        this.node.emit('error', this);
    }
}

cc.WebviewComponent = WebviewComponent;
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event loaded
 * @param {Event.EventCustom} event
 * @param {WebView} webView - The WebView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event loading
 * @param {Event.EventCustom} event
 * @param {WebView} webView - The WebView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event error
 * @param {Event.EventCustom} event
 * @param {WebView} webView - The WebView component.
 */

/**
 * !#en if you don't need the WebView and it isn't in any running Scene, you should
 * call the destroy method on this component or the associated node explicitly.
 * Otherwise, the created DOM element won't be removed from web page.
 * !#zh
 * 如果你不再使用 WebView，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
 * 这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
 * @example
 * webview.node.parent = null;  // or  webview.node.removeFromParent(false);
 * // when you don't need webview anymore
 * webview.node.destroy();
 * @method destroy
 * @return {Boolean} whether it is the first time the destroy being called
 */
