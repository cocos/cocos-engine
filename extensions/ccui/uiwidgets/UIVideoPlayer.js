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
 * @brief Displays a video file.
 *
 * @note VideoPlayer displays a video file based on DOM element
 * VideoPlayer will be rendered above all other graphical elements.
 *
 * @property {String}   path - The video path
 */
ccui.VideoPlayer = ccui.Widget.extend(/** @lends ccui.VideoPlayer# */{

    _played: false,
    _playing: false,
    _stopped: true,

    ctor: function(path){
        ccui.Widget.prototype.ctor.call(this);
        this._EventList = {};
        if(path)
            this.setURL(path);
    },

    _createRenderCmd: function(){
        return new ccui.VideoPlayer.RenderCmd(this);
    },

    /**
     * Set the video address
     * Automatically replace extname
     * All supported video formats will be added to the video
     * @param {String} address
     */
    setURL: function(address){
        this._renderCmd.updateURL(address);
    },

    /**
     * Get the video path
     * @returns {String}
     */
    getURL: function() {
        return this._renderCmd._url;
    },

    /**
     * Play the video
     */
    play: function(){
        var self = this,
            video = this._renderCmd._video;
        if(video){
            this._played = true;
            video.pause();
            if(this._stopped !== false || this._playing !== false || this._played !== true)
                video.currentTime = 0;
            if(ccui.VideoPlayer._polyfill.autoplayAfterOperation){
                setTimeout(function(){
                    video.play();
                    self._playing = true;
                    self._stopped = false;
                }, 20);
            }else{
                video.play();
                this._playing = true;
                this._stopped = false;
            }
        }
    },

    /**
     * Pause the video
     */
    pause: function(){
        var video = this._renderCmd._video;
        if(video && this._playing === true && this._stopped === false){
            video.pause();
            this._playing = false;
        }
    },

    /**
     * Resume the video
     */
    resume: function(){
        if(this._stopped === false && this._playing === false && this._played === true){
            this.play();
        }
    },

    /**
     * Stop the video
     */
    stop: function(){
        var self = this,
            video = this._renderCmd._video;
        if(video){
            video.pause();
            video.currentTime = 0;
            this._playing = false;
            this._stopped = true;
        }

        setTimeout(function(){
            self._dispatchEvent(ccui.VideoPlayer.EventType.STOPPED);
        }, 0);
    },
    /**
     * Jump to the specified point in time
     * @param {Number} sec
     */
    seekTo: function(sec){
        var video = this._renderCmd._video;
        if(video){
            video.currentTime = sec;
            if(ccui.VideoPlayer._polyfill.autoplayAfterOperation && this.isPlaying()){
                setTimeout(function(){
                    video.play();
                }, 20);
            }
        }
    },

    /**
     * Whether the video is playing
     * @returns {boolean}
     */
    isPlaying: function(){
        if(ccui.VideoPlayer._polyfill.autoplayAfterOperation && this._playing){
            setTimeout(function(){
                video.play();
            }, 20);
        }
        return this._playing;
    },

    /**
     * Whether to keep the aspect ratio
     */
    setKeepAspectRatioEnabled: function(enable){
        cc.log("On the web is always keep the aspect ratio");
    },
    isKeepAspectRatioEnabled: function(){
        return false;
    },

    /**
     * Set whether the full screen
     * May appear inconsistent in different browsers
     * @param {boolean} enable
     */
    setFullScreenEnabled: function(enable){
        var video = this._renderCmd._video;
        if(video){
            if(enable)
                cc.screen.requestFullScreen(video);
            else
                cc.screen.exitFullScreen(video);
        }
    },

    /**
     * Determine whether already full screen
     */
    isFullScreenEnabled: function(){
        cc.log("Can't know status");
    },

    /**
     * The binding event
     * @param {ccui.VideoPlayer.EventType} event
     * @param {Function} callback
     */
    setEventListener: function(event, callback){
        this._EventList[event] = callback;
    },

    /**
     * Delete events
     * @param {ccui.VideoPlayer.EventType} event
     */
    removeEventListener: function(event){
        this._EventList[event] = null;
    },

    _dispatchEvent: function(event) {
        var callback = this._EventList[event];
        if (callback)
            callback.call(this, this, this._renderCmd._video.src);
    },

    /**
     * Trigger playing events
     */
    onPlayEvent: function(){
        var list = this._EventList[ccui.VideoPlayer.EventType.PLAYING];
        if(list)
            for(var i=0; i<list.length; i++)
                list[i].call(this, this, this._renderCmd._video.src);
    },

    //_createCloneInstance: function(){},
    //_copySpecialProperties: function(){},

    setContentSize: function(w, h){
        ccui.Widget.prototype.setContentSize.call(this, w, h);
        if(h === undefined){
            h = w.height;
            w = w.width;
        }
        this._renderCmd.changeSize(w, h);
    },

    cleanup: function(){
        this._renderCmd.removeDom();
        this.stopAllActions();
        this.unscheduleAllCallbacks();
    },

    onEnter: function(){
        ccui.Widget.prototype.onEnter.call(this);
        var list = ccui.VideoPlayer.elements;
        if(list.indexOf(this) === -1)
            list.push(this);
    },

    onExit: function(){
        ccui.Widget.prototype.onExit.call(this);
        var list = ccui.VideoPlayer.elements;
        var index = list.indexOf(this);
        if(index !== -1)
            list.splice(index, 1);
    }

});

// VideoHTMLElement list
ccui.VideoPlayer.elements = [];
ccui.VideoPlayer.pauseElements = [];

cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
    var list = ccui.VideoPlayer.elements;
    for(var node, i=0; i<list.length; i++){
        node = list[i];
        if(list[i]._playing){
            node.pause();
            ccui.VideoPlayer.pauseElements.push(node);
        }
    }
});
cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
    var list = ccui.VideoPlayer.pauseElements;
    var node = list.pop();
    while(node){
        node.play();
        node = list.pop();
    }
});

/**
 * The VideoPlayer support list of events
 * @type {{PLAYING: string, PAUSED: string, STOPPED: string, COMPLETED: string}}
 */
ccui.VideoPlayer.EventType = {
    PLAYING: "play",
    PAUSED: "pause",
    STOPPED: "stop",
    COMPLETED: "complete"
};

(function(video){
    /**
     * Adapter various machines
     * @devicePixelRatio Whether you need to consider devicePixelRatio calculated position
     * @event To get the data using events
     */
    video._polyfill = {
        devicePixelRatio: false,
        event: "canplay",
        canPlayType: []
    };

    (function(){
        /**
         * Some old browser only supports Theora encode video
         * But native does not support this encode,
         * so it is best to provide mp4 and webm or ogv file
         */
        var dom = document.createElement("video");
        if(dom.canPlayType("video/ogg")){
            video._polyfill.canPlayType.push(".ogg");
            video._polyfill.canPlayType.push(".ogv");
        }
        if(dom.canPlayType("video/mp4"))
            video._polyfill.canPlayType.push(".mp4");
        if(dom.canPlayType("video/webm"))
            video._polyfill.canPlayType.push(".webm");
    })();

    if(cc.sys.OS_IOS === cc.sys.os){
        video._polyfill.devicePixelRatio = true;
        video._polyfill.event = "progress";
    }
    if(cc.sys.browserType === cc.sys.BROWSER_TYPE_FIREFOX){
        video._polyfill.autoplayAfterOperation = true;
    }

    var style = document.createElement("style");
    style.innerHTML = ".cocosVideo:-moz-full-screen{transform:matrix(1,0,0,1,0,0) !important;}" +
    ".cocosVideo:full-screen{transform:matrix(1,0,0,1,0,0) !important;}" +
    ".cocosVideo:-webkit-full-screen{transform:matrix(1,0,0,1,0,0) !important;}";
    document.head.appendChild(style);

})(ccui.VideoPlayer);

(function(polyfill){
    ccui.VideoPlayer.RenderCmd = function(node){
        cc.Node.CanvasRenderCmd.call(this, node);
        this._listener = null;
        this._url = "";
        this.initStyle();
    };

    var proto = ccui.VideoPlayer.RenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    proto.constructor = ccui.VideoPlayer.RenderCmd;

    proto.visit = function(){
        var self = this,
            container = cc.container,
            eventManager = cc.eventManager;
        if(this._node._visible){
            container.appendChild(this._video);
            if(this._listener === null)
                this._listener = cc.eventManager.addCustomListener(cc.game.EVENT_RESIZE, function () {
                    self.resize();
                });
        }else{
            var hasChild = false;
            if('contains' in container) {
                hasChild = container.contains(this._video);
            }else {
                hasChild = container.compareDocumentPosition(this._video) % 16;
            }
            if(hasChild)
                container.removeChild(this._video);
            eventManager.removeListener(this._listener);
            this._listener = null;
        }
        this.updateStatus();
    };

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

    proto.resize = function(view){
        view = view || cc.view;
        var node = this._node,
            eventManager = cc.eventManager;
        if(node._parent && node._visible)
            this.updateMatrix(this._worldTransform, view._scaleX, view._scaleY);
        else{
            eventManager.removeListener(this._listener);
            this._listener = null;
        }
    };

    proto.updateMatrix = function(t, scaleX, scaleY){
        var node = this._node;
        if(polyfill.devicePixelRatio){
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
        this._video.style["transform"] = matrix;
        this._video.style["-webkit-transform"] = matrix;
    };

    proto.updateURL = function(path){
        var source, video, hasChild, container, extname;
        var node = this._node;

        if (this._url == path)
            return;

        this._url = path;

        if(cc.loader.resPath && !/^http/.test(path))
            path = cc.path.join(cc.loader.resPath, path);

        hasChild = false;
        container = cc.container;
        if('contains' in container) {
            hasChild = container.contains(this._video);
        }else {
            hasChild = container.compareDocumentPosition(this._video) % 16;
        }
        if(hasChild)
            container.removeChild(this._video);

        this._video = document.createElement("video");
        video = this._video;
        this.bindEvent();
        var self = this;

        var cb = function(){
            if(self._loaded == true)
                return;
            self._loaded = true;
            self.changeSize();
            self.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
            video.removeEventListener(polyfill.event, cb);
            video.currentTime = 0;
            video.style["visibility"] = "visible";
            //IOS does not display video images
            video.play();
            if(!node._played){
                video.pause();
                video.currentTime = 0;
            }
        };
        video.addEventListener(polyfill.event, cb);

        //video.controls = "controls";
        video.preload = "metadata";
        video.style["visibility"] = "hidden";
        this._loaded = false;
        node._played = false;
        node._playing = false;
        node._stopped = true;
        this.initStyle();
        this.visit();

        source = document.createElement("source");
        source.src = path;
        video.appendChild(source);

        extname = cc.path.extname(path);
        for(var i=0; i<polyfill.canPlayType.length; i++){
            if(extname !== polyfill.canPlayType[i]){
                source = document.createElement("source");
                source.src = path.replace(extname, polyfill.canPlayType[i]);
                video.appendChild(source);
            }
        }
    };

    proto.bindEvent = function(){
        var self = this,
            node = this._node,
            video = this._video;
        //binding event
        video.addEventListener("ended", function(){
            node._renderCmd.updateMatrix(self._worldTransform, cc.view._scaleX, cc.view._scaleY);
            node._playing = false;
            node._dispatchEvent(ccui.VideoPlayer.EventType.COMPLETED);
        });
        video.addEventListener("play", function(){
            node._dispatchEvent(ccui.VideoPlayer.EventType.PLAYING);
        });
        video.addEventListener("pause", function(){
            node._dispatchEvent(ccui.VideoPlayer.EventType.PAUSED);
        });
    };

    proto.initStyle = function(){
        if(!this._video)  return;
        var video = this._video;
        video.style.position = "absolute";
        video.style.bottom = "0px";
        video.style.left = "0px";
        video.className = "cocosVideo";
    };

    proto.changeSize = function(w, h){
        var contentSize = this._node._contentSize;
        w = w || contentSize.width;
        h = h || contentSize.height;
        var video = this._video;
        if(video){
            if(w !== 0)
                video.width = w;
            if(h !== 0)
                video.height = h;
        }
    };

    proto.removeDom = function(){
        var video = this._video;
        if(video){
            var hasChild = false;
            if('contains' in cc.container) {
                hasChild = cc.container.contains(video);
            }else {
                hasChild = cc.container.compareDocumentPosition(video) % 16;
            }
            if(hasChild)
                cc.container.removeChild(video);
        }
    };

})(ccui.VideoPlayer._polyfill);