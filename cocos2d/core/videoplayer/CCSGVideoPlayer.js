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
/**
 * @class
 * @extends _ccsg.Node
 * @brief Displays a video file.
 *
 * @note VideoPlayer displays a video file based on DOM element
 * VideoPlayer will be rendered above all other graphical elements.
 *
 * @property {String}   path - The video path
 */
_ccsg.VideoPlayer = _ccsg.Node.extend(/** @lends _ccsg.VideoPlayer# */{

    ctor: function () {
        _ccsg.Node.prototype.ctor.call(this);
        // 播放结束等事件处理的队列
        this._EventList = {};
    },

    _createRenderCmd: function(){
        return new _ccsg.VideoPlayer.RenderCmd(this);
    },

    setURL: function (url) {
        this._renderCmd.updateURL(url);
    },

    getURL: function() {
        return this._renderCmd._url;
    },

    play: function () {
        this._renderCmd.play();
    },

    pause: function () {
        this._renderCmd.pause();
    },

    _resume: function () {
        this._renderCmd.play();
    },

    stop: function () {
        this._renderCmd.stop();
    },

    seekTo: function (time) {
        this._renderCmd.seekTo(time);
    },

    isPlaying: function () {
        return this._renderCmd.isPlaying();
    },

    duration: function () {
        return this._renderCmd.duration();
    },

    currentTime: function() {
        return this._renderCmd.currentTime();
    },

    createDomElementIfNeeded: function () {
        if (!this._renderCmd._video) {
            this._renderCmd.createDom();
        }
    },

    setKeepAspectRatioEnabled: function () {
        cc.logID(7700);
    },

    isKeepAspectRatioEnabled: function () {
        return true;
    },

    setFullScreenEnabled: function (enable) {
        var video = this._renderCmd._video;
        if (!video) return;

        if(enable)
            cc.screen.requestFullScreen(video);
        else
            cc.screen.exitFullScreen(video);

    },

    isFullScreenEnabled: function () {
        cc.logID(7701);
    },

    setEventListener: function (event, callback) {
        this._EventList[event] = callback;
    },

    removeEventListener: function (event) {
        this._EventList[event] = null;
    },

    _dispatchEvent: function (event) {
        var callback = this._EventList[event];
        if (callback)
            callback.call(this, this, this._renderCmd._video.src);
    },

    onPlayEvent: function () {
        var callback = this._EventList[_ccsg.VideoPlayer.EventType.PLAYING];
        callback.call(this, this, this._renderCmd._video.src);
    },

    setContentSize: function (width, height) {
        if (width.width !== undefined && width.height !== undefined) {
            height = width.height;
            width = width.width;
        }
        _ccsg.Node.prototype.setContentSize.call(this, width, height);
        this._renderCmd.updateSize(width, height);
    },

    onEnter: function () {
        _ccsg.Node.prototype.onEnter.call(this);
        var list = _ccsg.VideoPlayer.elements;
        if(list.indexOf(this) === -1)
            list.push(this);
    },

    cleanup: function () {
        this._super();
        this._renderCmd.removeDom();
    },

    onExit: function () {
        _ccsg.Node.prototype.onExit.call(this);
        var list = _ccsg.VideoPlayer.elements;
        var index = list.indexOf(this);
        if(index !== -1)
            list.splice(index, 1);
    },

    setVisible: function ( visible ) {
        _ccsg.Node.prototype.setVisible.call(this, visible);
        this._renderCmd.updateVisibility();
    }
});

// video 队列，所有 vidoe 在 onEnter 的时候都会插入这个队列
_ccsg.VideoPlayer.elements = [];
// video 在 game_hide 事件中被自动暂停的队列，用于回复的时候重新开始播放
_ccsg.VideoPlayer.pauseElements = [];

cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
    var list = _ccsg.VideoPlayer.elements;
    for(var node, i=0; i<list.length; i++){
        node = list[i];
        if(list[i]._playing){
            node.pause();
            _ccsg.VideoPlayer.pauseElements.push(node);
        }
    }
});

cc.game.on(cc.game.EVENT_SHOW, function () {
    var list = _ccsg.VideoPlayer.pauseElements;
    var node = list.pop();
    while(node){
        node.play();
        node = list.pop();
    }
});

_ccsg.VideoPlayer.EventType = {
    PLAYING: 0,
    PAUSED: 1,
    STOPPED: 2,
    COMPLETED: 3,
    META_LOADED: 4,
    CLICKED: 5,
    READY_TO_PLAY: 6
};

(function (video) {
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

    if(cc.sys.browserType === cc.sys.BROWSER_TYPE_FIREFOX){
        video._polyfill.autoplayAfterOperation = true;
    }

    if (
        cc.sys.OS_ANDROID === cc.sys.os && (
        cc.sys.browserType === cc.sys.BROWSER_TYPE_SOUGOU ||
        cc.sys.browserType === cc.sys.BROWSER_TYPE_360
    )
    ) {
        video._polyfill.zoomInvalid = true;
    }

    var style = document.createElement("style");
    style.innerHTML = ".cocosVideo:-moz-full-screen{transform:matrix(1,0,0,1,0,0) !important;}" +
        ".cocosVideo:full-screen{transform:matrix(1,0,0,1,0,0) !important;}" +
        ".cocosVideo:-webkit-full-screen{transform:matrix(1,0,0,1,0,0) !important;}";
    document.head.appendChild(style);

})(_ccsg.VideoPlayer);

(function (polyfill) {

    _ccsg.VideoPlayer.RenderCmd = function (node) {
        this._rootCtor(node);

        this._video = null;
        this._url = '';

        // 有一些浏览器第一次播放视频需要特殊处理，这个标记用来标识是否播放过
        this._played = false;
        this._playing = false;
        this._ignorePause = false;
    };

    var proto = _ccsg.VideoPlayer.RenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
    proto.constructor = _ccsg.VideoPlayer.RenderCmd;

    proto.transform = function (parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        this.updateMatrix();
    };

    proto.updateMatrix = function () {
        if (!this._video) return;
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

        if (polyfill.zoomInvalid) {
            this.updateSize(node._contentSize.width * a, node._contentSize.height * d);
            a = 1;
            d = 1;
        }

        var matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
        this._video.style['transform'] = matrix;
        this._video.style['-webkit-transform'] = matrix;
        this._video.style['transform-origin'] = '0px 100% 0px';
        this._video.style['-webkit-transform-origin'] = '0px 100% 0px';
    };

    proto.updateURL = function (path) {
        var source, video, extname;
        var node = this._node;


        if (this._url == path) {
            return;
        }

        this._url = path;

        if(cc.loader.resPath && !/^http/.test(path))
            path = cc.path.join(cc.loader.resPath, path);

        this.removeDom();
        this.createDom();

        this.bindEvent();

        video = this._video;

        var cb = function(){
            if(this._loaded == true)
                return;
            this._loaded = true;
            node.setContentSize(node._contentSize.width, node._contentSize.height);
            video.currentTime = 0;
            node._dispatchEvent(_ccsg.VideoPlayer.EventType.READY_TO_PLAY);
            this.updateVisibility();
            this.updateMatrix();
        }.bind(this);
        video.oncanplay = cb;

        //video.controls = "controls";
        // if preload set to metadata, the canplay event can't be fired on safari
        // video.preload = "metadata";
        video.style["visibility"] = "hidden";
        this._loaded = false;
        this._played = false;
        this._playing = false;

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

    proto.bindEvent = function () {
        var node = this._node, video = this._video, self = this;
        //binding event
        video.onloadedmetadata = function () {
            node._dispatchEvent(_ccsg.VideoPlayer.EventType.META_LOADED);
        };
        video.addEventListener("ended", function(){
            if (self._video !== video) return;
            this._playing = false;
            node._dispatchEvent(_ccsg.VideoPlayer.EventType.COMPLETED);
        }.bind(this));
        video.addEventListener("play", function(){
            if (self._video !== video) return;
            node._dispatchEvent(_ccsg.VideoPlayer.EventType.PLAYING);
        });
        video.addEventListener("pause", function(){
            if (self._ignorePause || self._video !== video) return;
            node._dispatchEvent(_ccsg.VideoPlayer.EventType.PAUSED);
        });
        video.addEventListener("click", function () {
            node._dispatchEvent(_ccsg.VideoPlayer.EventType.CLICKED);
        });
    };

    proto.updateVisibility = function () {
        var node = this._node;
        if (!this._video) return;
        var video = this._video;
        if (node.visible) {
            video.style.visibility = 'visible';
        } else {
            video.style.visibility = 'hidden';
            video.pause();
            this._playing = false;
        }
    };

    proto.createDom = function () {
        var video = document.createElement('video');
        video.style.position = "absolute";
        video.style.bottom = "0px";
        video.style.left = "0px";
        video.className = "cocosVideo";
        video.setAttribute('preload', true);
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('playsinline', '');
        this._video = video;
        cc.game.container.appendChild(video);
    };

    proto.removeDom = function () {
        var video = this._video;
        if(video){
            var hasChild = Utils.contains(cc.game.container, video);
            if(hasChild)
                cc.game.container.removeChild(video);
        }
        this._video = null;
        this._url = "";
    };

    proto.updateSize = function (width, height) {
        var video = this._video;
        if (!video) return;

        video.style['width'] = width + 'px';
        video.style['height'] = height + 'px';
    };

    // 播放控制
    proto.play = function () {
        var video = this._video;
        if (!video || !this._node.isVisible()) return;

        this._played = true;
        if (this._playing) {
            return;
        }

        if(_ccsg.VideoPlayer._polyfill.autoplayAfterOperation){
            var self = this;
            setTimeout(function(){
                video.play();
                self._playing = true;
            }, 20);
        }else{
            video.play();
            this._playing = true;
        }
    };

    proto.pause = function () {
        var video = this._video;
        if(!this._playing) return;

        this._playing = false;
        if (!video) {
            return;
        }
        video.pause();
    };

    proto.stop = function () {
        var video = this._video;
        if (!video || !this._node.isVisible()) return;
        this._ignorePause = true;
        video.pause();
        var node = this._node;
        setTimeout(function(){
            node._dispatchEvent(_ccsg.VideoPlayer.EventType.STOPPED);
            this._ignorePause = false;
        }.bind(this), 0);
        // 恢复到视频起始位置
        video.currentTime = 0;
        this._playing = false;
    };

    proto.seekTo = function (sec) {
        var video = this._video;
        if (!video) return;

        if (this._loaded) {
            video.currentTime = sec;
        } else {
            var cb = function () {
                video.currentTime = sec;
                video.removeEventListener(polyfill.event, cb);
            };
            video.addEventListener(polyfill.event, cb);
        }
        if(_ccsg.VideoPlayer._polyfill.autoplayAfterOperation && this.isPlaying()){
            setTimeout(function(){
                video.play();
            }, 20);
        }
    };

    proto.isPlaying = function () {
        var video = this._video;
        if(_ccsg.VideoPlayer._polyfill.autoplayAfterOperation && this._playing){
            setTimeout(function(){
                video.play();
            }, 20);
        }
        return this._playing;
    };

    proto.duration = function () {
        var video = this._video;
        var duration = -1;
        if(!video) return duration;

        duration = video.duration;
        if(duration <= 0) {
            cc.logID(7702);
        }

        return duration;
    };

    proto.currentTime = function () {
        var video = this._video;
        if(!video) return -1;

        return video.currentTime;
    };

})(_ccsg.VideoPlayer._polyfill);
