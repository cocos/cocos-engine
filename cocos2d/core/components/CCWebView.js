/*global _ccsg */

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
require('../webview/CCSGWebView');
/**
 * !#en WebView event type
 * !#zh 网页视图事件类型
 * @enum WebView.EventType
 */
var EventType = _ccsg.WebView.EventType;


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

/**
 * !#en cc.WebView is a component for display web pages in the game
 * !#zh WebView 组件，用于在游戏中显示网页
 * @class WebView
 * @extends _RendererUnderSG
 */
var WebView = cc.Class({
    name: 'cc.WebView',
    extends: cc._RendererUnderSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/WebView'
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
            type: String,
            tooltip: CC_DEV && 'i18n:COMPONENT.webview.url',
            get: function () {
                return this._url;
            },
            set: function (url) {
                this._url = url;
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.loadURL(url);
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
    },

    onLoad: CC_JSB && function() {
        if (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS) {
            this.enabled = false;
        }
    },

    _createSgNode: function () {
        if(CC_JSB) {
            if (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS) {
                console.log('WebView is not supported on Mac and Windows!');
                return null;
            }
        }
        return new _ccsg.WebView();
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;
        if (!sgNode) return;

        if(!CC_JSB) {
            sgNode.createDomElementIfNeeded();
        }
        sgNode.setEventListener(EventType.LOADED , this._onWebViewLoaded.bind(this));
        sgNode.setEventListener(EventType.LOADING , this._onWebViewLoading.bind(this));
        sgNode.setEventListener(EventType.ERROR , this._onWebViewLoadError.bind(this));

        sgNode.loadURL(this._url);

        if (CC_EDITOR && this._useOriginalSize) {
            this.node.setContentSize(sgNode.getContentSize());
            this._useOriginalSize = false;
        } else {
            sgNode.setContentSize(this.node.getContentSize());
        }
    },

    _onWebViewLoaded: function () {
        cc.Component.EventHandler.emitEvents(this.webviewEvents, this, EventType.LOADED);
        this.node.emit('loaded', this);
    },

    _onWebViewLoading: function () {
        cc.Component.EventHandler.emitEvents(this.webviewEvents, this, EventType.LOADING);
        this.node.emit('loading', this);
        return true;
    },

    _onWebViewLoadError: function () {
        cc.Component.EventHandler.emitEvents(this.webviewEvents, this, EventType.ERROR);
        this.node.emit('error', this);
    }
});

cc.WebView = module.exports = WebView;
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event loaded
 * @param {Event.EventCustom} event
 * @param {WebView} event.detail - The WebView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event loading
 * @param {Event.EventCustom} event
 * @param {WebView} event.detail - The WebView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event error
 * @param {Event.EventCustom} event
 * @param {WebView} event.detail - The WebView component.
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
 */
