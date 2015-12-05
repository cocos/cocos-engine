/****************************************************************************
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * @class
 * @extends ccui.Widget
 * @brief A View that displays web pages.
 *
 * @note WebView displays web pages based on DOM element
 * WebView will be rendered above all other graphical elements.
 *
 * @property {String}   path - The url to be shown in the web view
 */
ccui.WebView = ccui.Widget.extend(/** @lends ccui.WebView# */{

    ctor: function(path){
        ccui.Widget.prototype.ctor.call(this);
        this._EventList = {};
        if(path)
            this.loadURL(path);
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
        this._dispatchEvent(ccui.WebView.EventType.LOADING);
    },

    /**
     * Stop loading
     */
    stopLoading: function(){
        cc.log("Web does not support loading");
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
        cc.log("Web does not support query history");
        return true;
    },

    /**
     * Determine whether to go forward
     */
    canGoForward: function(){
        cc.log("Web does not support query history");
        return true;
    },

    /**
     * go back
     */
    goBack: function(){
        try{
            if(ccui.WebView._polyfill.closeHistory)
                return cc.log("The current browser does not support the GoBack");
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
            if(ccui.WebView._polyfill.closeHistory)
                return cc.log("The current browser does not support the GoForward");
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
                this._dispatchEvent(ccui.WebView.EventType.JS_EVALUATED);
            }catch(err){
                console.error(err);
            }
        }
    },

    /**
     * Limited scale
     */
    setScalesPageToFit: function(){
        cc.log("Web does not support zoom");
    },

    /**
     * The binding event
     * @param {ccui.WebView.EventType} event
     * @param {Function} callback
     */
    setEventListener: function(event, callback){
        this._EventList[event] = callback;
    },

    /**
     * Delete events
     * @param {ccui.WebView.EventType} event
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
        return new ccui.WebView.RenderCmd(this);
    },

    /**
     * Set the contentSize
     * @param {Number} w
     * @param {Number} h
     */
    setContentSize: function(w, h){
        ccui.Widget.prototype.setContentSize.call(this, w, h);
        if(h === undefined){
            h = w.height;
            w = w.width;
        }
        this._renderCmd.changeSize(w, h);
    },

    /**
     * remove node
     */
    cleanup: function(){
        this._renderCmd.removeDom();
        this.stopAllActions();
        this.unscheduleAllCallbacks();
    }
});

/**
 * The WebView support list of events
 * @type {{LOADING: string, LOADED: string, ERROR: string}}
 */
ccui.WebView.EventType = {
    LOADING: "loading",
    LOADED: "load",
    ERROR: "error",
    JS_EVALUATED: "js"
};

(function(){

    var polyfill = ccui.WebView._polyfill = {
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

    ccui.WebView.RenderCmd = function(node){
        cc.Node.CanvasRenderCmd.call(this, node);

        this._div = null;
        this._iframe = null;

        if(polyfill.enableDiv){
            this._div = document.createElement("div");
            this._div.style["-webkit-overflow"] = "auto";
            this._div.style["-webkit-overflow-scrolling"] = "touch";
            this._iframe = document.createElement("iframe");
            this._div.appendChild(this._iframe);
        }else{
            this._div = this._iframe = document.createElement("iframe");
        }

        if(polyfill.enableBG)
            this._div.style["background"] = "#FFF";

        this._iframe.addEventListener("load", function(){
            node._dispatchEvent(ccui.WebView.EventType.LOADED);
        });
        this._iframe.addEventListener("error", function(){
            node._dispatchEvent(ccui.WebView.EventType.ERROR);
        });
        this._div.style["background"] = "#FFF";
        this._div.style.height = "200px";
        this._div.style.width = "300px";
        this._div.style.overflow = "scroll";
        this._listener = null;
        this.initStyle();
    };

    var proto = ccui.WebView.RenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    proto.constructor = ccui.WebView.RenderCmd;

    proto.updateStatus = function(){
        polyfill.devicePixelRatio = cc.view.isRetinaEnabled();
        var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        if(locFlag & flags.transformDirty){
            //update the transform
            this.transform(this.getParentRenderCmd(), true);
            this.updateMatrix(this._worldTransform, cc.view._scaleX, cc.view._scaleY);
            this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.transformDirty ^ this._dirtyFlag;
        }
    };

    proto.visit = function(){
        var self = this,
            container = cc.container,
            eventManager = cc.eventManager;
        if(this._node._visible){
            container.appendChild(this._div);
            if(this._listener === null)
                this._listener = eventManager.addCustomListener(cc.game.EVENT_RESIZE, function () {
                    self.resize();
                });
        }else{
            var hasChild = false;
            if('contains' in container) {
                hasChild = container.contains(this._div);
            }else {
                hasChild = container.compareDocumentPosition(this._div) % 16;
            }
            if(hasChild)
                container.removeChild(this._div);
            var list = eventManager._listenersMap[cc.game.EVENT_RESIZE].getFixedPriorityListeners();
            eventManager._removeListenerInVector(list, this._listener);
            this._listener = null;
        }
        this.updateStatus();
        this.resize(cc.view);
    };

    proto.resize = function(view){
        view = view || cc.view;
        var node = this._node,
            eventManager = cc.eventManager;
        if(node._parent && node._visible)
            this.updateMatrix(this._worldTransform, view._scaleX, view._scaleY);
        else{
            var list = eventManager._listenersMap[cc.game.EVENT_RESIZE].getFixedPriorityListeners();
            eventManager._removeListenerInVector(list, this._listener);
            this._listener = null;
        }
    };

    proto.updateMatrix = function(t, scaleX, scaleY){
        var node = this._node;
        if(polyfill.devicePixelRatio && scaleX !== 1 && scaleX !== 1){
            var dpr = window.devicePixelRatio;
            scaleX = scaleX / dpr;
            scaleY = scaleY / dpr;
        }
        if(this._loaded === false) return;
        var cw = node._contentSize.width,
            ch = node._contentSize.height;
        var a = t.a * scaleX,
            b = t.b,
            c = t.c,
            d = t.d * scaleY,
            tx = t.tx*scaleX - cw/2 + cw*node._scaleX/2*scaleX,
            ty = t.ty*scaleY - ch/2 + ch*node._scaleY/2*scaleY;
        var matrix = "matrix(" + a + "," + b + "," + c + "," + d + "," + tx + "," + -ty + ")";
        this._div.style["transform"] = matrix;
        this._div.style["-webkit-transform"] = matrix;
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
            iframe.removeEventListener("load", cb);
        };
        iframe.addEventListener("load", cb);
    };

    proto.changeSize = function(w, h){
        var div = this._div;
        if(div){
            div.style["width"] = w+"px";
            div.style["height"] = h+"px";
        }
    };

    proto.removeDom = function(){
        var div = this._div;
        if(div){
            var hasChild = false;
            if('contains' in cc.container) {
                hasChild = cc.container.contains(div);
            }else {
                hasChild = cc.container.compareDocumentPosition(div) % 16;
            }
            if(hasChild)
                cc.container.removeChild(div);
        }
    };

})(ccui.WebView._polyfill);