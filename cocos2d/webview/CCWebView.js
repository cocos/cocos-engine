/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

const WebViewImpl = require('./webview-impl');

/**
 * !#en WebView event type
 * !#zh 网页视图事件类型
 * @enum WebView.EventType
 */
const EventType = WebViewImpl.EventType;


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
 * !#en cc.WebView is a component for display web pages in the game. Because different platforms have different authorization, API and control methods for WebView component. And have not yet formed a unified standard, only Web, iOS, and Android platforms are currently supported.
 * !#zh WebView 组件，用于在游戏中显示网页。由于不同平台对于 WebView 组件的授权、API、控制方式都不同，还没有形成统一的标准，所以目前只支持 Web、iOS 和 Android 平台。
 * @class WebView
 * @extends Component
 */
let WebView = cc.Class({
    name: 'cc.WebView',
    extends: cc.Component,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/WebView',
        executeInEditMode: true
    },

    properties: {
        _useOriginalSize: true,

        _url: '',
        /**
         * !#en A given URL to be loaded by the WebView, it should have a http or https prefix.
         * !#zh 指定 WebView 加载的网址，它应该是一个 http 或者 https 开头的字符串
         * @property {String} url
         */
        url: {
            type: cc.String,
            tooltip: CC_DEV && 'i18n:COMPONENT.webview.url',
            get: function () {
                return this._url;
            },
            set: function (url) {
                this._url = url;
                let impl = this._impl;
                if (impl) {
                    impl.loadURL(url);
                }
            }
        },

        /**
         * !#en The webview's event callback , it will be triggered when certain webview event occurs.
         * !#zh WebView 的回调事件，当网页加载过程中，加载完成后或者加载出错时都会回调此函数
         * @property {Component.EventHandler[]} webviewLoadedEvents
         */
        webviewEvents: {
            default: [],
            type: cc.Component.EventHandler,
        },
    },

    statics: {
        EventType: EventType,
        // Impl will be overrided in the different platform.
        Impl: WebViewImpl
    },

    ctor () {
        this._impl = new WebView.Impl();
    },

    onRestore () {
        if (!this._impl) {
            this._impl = new WebView.Impl();
        }
    },

    onEnable () {
        let impl = this._impl;
        impl.createDomElementIfNeeded(this.node.width, this.node.height);
        if (!CC_EDITOR) {
            impl.setEventListener(EventType.LOADED, this._onWebViewLoaded.bind(this));
            impl.setEventListener(EventType.LOADING, this._onWebViewLoading.bind(this));
            impl.setEventListener(EventType.ERROR, this._onWebViewLoadError.bind(this));
        }
        impl.loadURL(this._url);
        impl.setVisible(true);
    },

    onDisable () {
        let impl = this._impl;
        impl.setVisible(false);
        if (!CC_EDITOR) {
            impl.setEventListener(EventType.LOADED, emptyCallback);
            impl.setEventListener(EventType.LOADING, emptyCallback);
            impl.setEventListener(EventType.ERROR, emptyCallback);
        }
    },

    onDestroy () {
        if (this._impl) {
            this._impl.destroy();
            this._impl = null;
        }
    },

    update (dt) {
        if (this._impl) {
            this._impl.updateMatrix(this.node);
        }
    },

    _onWebViewLoaded () {
        cc.Component.EventHandler.emitEvents(this.webviewEvents, this, EventType.LOADED);
        this.node.emit('loaded', this);
    },

    _onWebViewLoading () {
        cc.Component.EventHandler.emitEvents(this.webviewEvents, this, EventType.LOADING);
        this.node.emit('loading', this);
        return true;
    },

    _onWebViewLoadError () {
        cc.Component.EventHandler.emitEvents(this.webviewEvents, this, EventType.ERROR);
        this.node.emit('error', this);
    },

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
    setJavascriptInterfaceScheme (scheme) {
        if (this._impl) {
            this._impl.setJavascriptInterfaceScheme(scheme);
        }
    },

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
    setOnJSCallback (callback) {
        if (this._impl) {
            this._impl.setOnJSCallback(callback);
        }
    },

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
    evaluateJS (str) {
        if (this._impl) {
            this._impl.evaluateJS(str);
        }
    },

});

cc.WebView = module.exports = WebView;
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
