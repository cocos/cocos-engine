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

_ccsg.WebView = _ccsg.Node.extend(/** @lends _ccsg.WebView# */{

    ctor: function () {
        _ccsg.Node.prototype.ctor.call(this);
        this.setContentSize(cc.size(300, 200));
        this._EventList = {};
    },

    createDomElementIfNeeded: function () {
        if (!this._renderCmd._div) {
            this._renderCmd.createNativeControl();
        }
    },

    setJavascriptInterfaceScheme: function(scheme){},
    loadData: function(data, MIMEType, encoding, baseURL){},
    loadHTMLString: function(string, baseURL){},
    /**
     * Load an URL
     * @param {String} url
     */
    loadURL: function(url){
        this._renderCmd.updateURL(url);
        this._dispatchEvent(_ccsg.WebView.EventType.LOADING);
    },

    /**
     * Stop loading
     */
    stopLoading: function(){
        cc.logID(7800);
    },

    /**
     * Reload the WebView
     */
    reload: function(){
        var iframe = this._renderCmd._iframe;
        if(iframe){
            var win = iframe.contentWindow;
            if(win && win.location)
                win.location.reload();
        }
    },

    /**
     * Determine whether to go back
     */
    canGoBack: function(){
        cc.logID(7801);
        return true;
    },

    /**
     * Determine whether to go forward
     */
    canGoForward: function(){
        cc.logID(7802);
        return true;
    },

    /**
     * go back
     */
    goBack: function(){
        try{
            if(_ccsg.WebView._polyfill.closeHistory)
                return cc.logID(7803);
            var iframe = this._renderCmd._iframe;
            if(iframe){
                var win = iframe.contentWindow;
                if(win && win.location)
                    win.history.back.call(win);
            }
        }catch(err){
            cc.log(err);
        }
    },

    /**
     * go forward
     */
    goForward: function(){
        try{
            if(_ccsg.WebView._polyfill.closeHistory)
                return cc.logID(7804);
            var iframe = this._renderCmd._iframe;
            if(iframe){
                var win = iframe.contentWindow;
                if(win && win.location)
                    win.history.forward.call(win);
            }
        }catch(err){
            cc.log(err);
        }
    },

    /**
     * In the webview execution within a period of js string
     * @param {String} str
     */
    evaluateJS: function(str){
        var iframe = this._renderCmd._iframe;
        if(iframe){
            var win = iframe.contentWindow;
            try{
                win.eval(str);
                this._dispatchEvent(_ccsg.WebView.EventType.JS_EVALUATED);
            }catch(err){
                console.error(err);
            }
        }
    },

    /**
     * Limited scale
     */
    setScalesPageToFit: function(){
        cc.logID(7805);
    },

    /**
     * The binding event
     * @param {_ccsg.WebView.EventType} event
     * @param {Function} callback
     */
    setEventListener: function(event, callback){
        this._EventList[event] = callback;
    },

    /**
     * Delete events
     * @param {_ccsg.WebView.EventType} event
     */
    removeEventListener: function(event){
        this._EventList[event] = null;
    },

    _dispatchEvent: function(event) {
        var callback = this._EventList[event];
        if (callback)
            callback.call(this, this, this._renderCmd._iframe.src);
    },

    _createRenderCmd: function(){
        return new _ccsg.WebView.RenderCmd(this);
    },

    /**
     * Set the contentSize
     * @param {Number} width
     * @param {Number} height
     */
    setContentSize: function(width, height){
        if (width.width !== undefined && width.height !== undefined) {
            height = width.height;
            width = width.width;
        }
        _ccsg.Node.prototype.setContentSize.call(this, width, height);
        this._renderCmd.updateSize(width, height);
    },

    cleanup: function () {
        this._super();
        this._renderCmd.removeDom();
    },

    setVisible: function ( visible ) {
        _ccsg.Node.prototype.setVisible.call(this, visible);
        this._renderCmd.updateVisibility();
    }
});

_ccsg.WebView.EventType = {
    LOADING: 0,
    LOADED: 1,
    ERROR: 2,
    JS_EVALUATED: 3
};

(function(){

    var polyfill = _ccsg.WebView._polyfill = {
        devicePixelRatio: false,
        enableDiv: false
    };

    if(cc.sys.os === cc.sys.OS_IOS)
        polyfill.enableDiv = true;

    if(cc.sys.isMobile){
        if(cc.sys.browserType === cc.sys.BROWSER_TYPE_FIREFOX){
            polyfill.enableBG = true;
        }
    }else{
        if(cc.sys.browserType === cc.sys.BROWSER_TYPE_IE){
            polyfill.closeHistory = true;
        }
    }


})();

(function(polyfill){

    var RenderCmd;
    if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
        RenderCmd = _ccsg.Node.CanvasRenderCmd;
    } else {
        RenderCmd = _ccsg.Node.WebGLRenderCmd;
    }

    _ccsg.WebView.RenderCmd = function(node){
        this._rootCtor(node);

        this._parent = null;
        this._div = null;
        this._iframe = null;
        this._listener = null;
    };

    var proto = _ccsg.WebView.RenderCmd.prototype = Object.create(RenderCmd.prototype);
    proto.constructor = _ccsg.WebView.RenderCmd;

    proto.transform = function (parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        this.updateMatrix();
    };

    proto.updateStatus = function(){
        polyfill.devicePixelRatio = cc.view.isRetinaEnabled();
        var flags = _ccsg.Node._dirtyFlags, locFlag = this._dirtyFlag;
        if(locFlag & flags.transformDirty){
            //update the transform
            this.transform(this.getParentRenderCmd(), true);
            this.updateMatrix();
            this._dirtyFlag &= ~_ccsg.Node._dirtyFlags.transformDirty;
        }
    };

    proto.initEvent = function () {
        var node = this._node;
        this._iframe.addEventListener("load", function(){
            node._dispatchEvent(_ccsg.WebView.EventType.LOADED);
        });
        this._iframe.addEventListener("error", function(){
            node._dispatchEvent(_ccsg.WebView.EventType.ERROR);
        });
    };

    proto.resize = function(view){
        view = view || cc.view;
        var node = this._node,
            eventManager = cc.eventManager;
        if(node._parent && node._visible)
            this.updateMatrix();
        else{
            var list = eventManager._listenersMap[cc.game.EVENT_RESIZE].getFixedPriorityListeners();
            eventManager._removeListenerInVector(list, this._listener);
            this._listener = null;
        }
    };

    proto.updateMatrix = function(){
        if (!this._div) return;

        var node = this._node, scaleX = cc.view._scaleX, scaleY = cc.view._scaleY;
        var dpr = cc.view._devicePixelRatio;
        var t = this._worldTransform;

        scaleX /= dpr;
        scaleY /= dpr;

        var container = cc.game.container;
        var a = t.a * scaleX, b = t.b, c = t.c, d = t.d * scaleY;

        var offsetX = container && container.style.paddingLeft &&  parseInt(container.style.paddingLeft);
        var offsetY = container && container.style.paddingBottom && parseInt(container.style.paddingBottom);
        var tx = t.tx * scaleX + offsetX, ty = t.ty * scaleY + offsetY;

        var matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
        this._div.style['transform'] = matrix;
        this._div.style['-webkit-transform'] = matrix;
        this._div.style['transform-origin'] = '0px 100% 0px';
        this._div.style['-webkit-transform-origin'] = '0px 100% 0px';
    };

    proto.initStyle = function(){
        if(!this._div)  return;
        var div = this._div;
        div.style.position = "absolute";
        div.style.bottom = "0px";
        div.style.left = "0px";
    };

    proto.updateURL = function(url){
        var iframe = this._iframe;
        iframe.src = url;
        var self = this;
        var cb = function(){
            self._loaded = true;
            self.updateVisibility();
            iframe.removeEventListener("load", cb);
        };
        iframe.addEventListener("load", cb);
    };

    proto.updateSize = function(w, h){
        var div = this._div;
        if(div){
            div.style["width"] = w+"px";
            div.style["height"] = h+"px";
        }
    };

    proto.createDom = function () {
        if(polyfill.enableDiv){
            this._div = document.createElement("div");
            this._div.style["-webkit-overflow"] = "auto";
            this._div.style["-webkit-overflow-scrolling"] = "touch";
            this._iframe = document.createElement("iframe");
            this._div.appendChild(this._iframe);
            this._iframe.style.width = "100%";
            this._iframe.style.height = "100%";
        }else{
            this._div = this._iframe = document.createElement("iframe");
        }

        if(polyfill.enableBG)
            this._div.style["background"] = "#FFF";

        this._div.style["background"] = "#FFF";
        var contentSize = this._node._contentSize;
        this._div.style.height = contentSize.height + "px";
        this._div.style.width = contentSize.width + "px";
        this._div.style.overflow = "scroll";
        this._iframe.style.border = "none";
        cc.game.container.appendChild(this._div);
        this.updateVisibility();
    };

    proto.createNativeControl = function () {
        this.createDom();
        this.initStyle();
        this.initEvent();
    };

    proto.removeDom = function(){
        var div = this._div;
        if(div){
            var hasChild = Utils.contains(cc.game.container, div);
            if(hasChild)
                cc.game.container.removeChild(div);
        }
        this._div = null;
    };

    proto.updateVisibility = function () {
        var node = this._node;
        if (!this._div) return;
        var div = this._div;
        if (node.visible) {
            div.style.visibility = 'visible';
        } else {
            div.style.visibility = 'hidden';
        }
    };

})(_ccsg.WebView._polyfill);
