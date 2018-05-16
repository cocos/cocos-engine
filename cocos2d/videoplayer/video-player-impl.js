/****************************************************************************
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

var utils = require('../core/platform/utils');
var sys = require('../core/platform/CCSys');

let VideoPlayerImpl = cc.Class({
    name: 'VideoPlayerImpl',

    ctor () {
        // 播放结束等事件处理的队列
        this._EventList = {};

        this._video = null;
        this._url = '';

        this._loaded = false;
        this._visible = false;
        // 有一些浏览器第一次播放视频需要特殊处理，这个标记用来标识是否播放过
        this._played = false;
        this._playing = false;
        this._ignorePause = false;

        // update matrix cache
        this._forceUpdate = true;
        this._m00 = 0;
        this._m01 = 0;
        this._m04 = 0;
        this._m05 = 0;
        this._m12 = 0;
        this._m13 = 0;
        this._w = 0;
        this._h = 0;
    },

    _bindEvent () {
        var video = this._video, self = this;
        //binding event
        video.onloadedmetadata = function () {
            self._dispatchEvent(VideoPlayerImpl.EventType.META_LOADED);
        };
        video.addEventListener("ended", function () {
            if (self._video !== video) return;
            self._playing = false;
            self._dispatchEvent(VideoPlayerImpl.EventType.COMPLETED);
        });
        video.addEventListener("play", function () {
            if (self._video !== video) return;
            self._playing = true;
            self._dispatchEvent(VideoPlayerImpl.EventType.PLAYING);
        });
        video.addEventListener("pause", function () {
            if (self._ignorePause || self._video !== video) return;
            self._playing = false;
            self._dispatchEvent(VideoPlayerImpl.EventType.PAUSED);
        });
        video.addEventListener("click", function () {
            self._dispatchEvent(VideoPlayerImpl.EventType.CLICKED);
        });
    },

    _updateVisibility () {
        if (!this._video) return;
        var video = this._video;
        if (this._visible) {
            video.style.visibility = 'visible';
        }
        else {
            video.style.visibility = 'hidden';
            video.pause();
            this._playing = false;
        }
        this._forceUpdate = true;
    },

    _updateSize (width, height) {
        var video = this._video;
        if (!video) return;

        video.style.width = width + 'px';
        video.style.height = height + 'px';
    },

    _createDom () {
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
    },

    createDomElementIfNeeded: function () {
        if (!this._video) {
            this._createDom();
        }
    },

    removeDom () {
        var video = this._video;
        if (video) {
            var hasChild = utils.contains(cc.game.container, video);
            if (hasChild)
                cc.game.container.removeChild(video);
        }
        this._video = null;
        this._url = "";
    },

    setURL (path) {
        var source, video, extname;

        if (this._url === path) {
            return;
        }

        this._url = path;

        if (cc.loader.resPath && !/^http/.test(path))
            path = cc.path.join(cc.loader.resPath, path);

        this.removeDom();
        this.createDomElementIfNeeded();

        this._bindEvent();

        video = this._video;

        video.oncanplay = function () {
            if (this._loaded)
                return;
            this._loaded = true;
            // node.setContentSize(node._contentSize.width, node._contentSize.height);
            video.currentTime = 0;
            this._dispatchEvent(VideoPlayerImpl.EventType.READY_TO_PLAY);
            this._updateVisibility();
        }.bind(this);

        video.style["visibility"] = "hidden";
        this._loaded = false;
        this._played = false;
        this._playing = false;

        source = document.createElement("source");
        source.src = path;
        video.appendChild(source);

        extname = cc.path.extname(path);
        var polyfill = VideoPlayerImpl._polyfill;
        for (var i = 0; i < polyfill.canPlayType.length; i++) {
            if (extname !== polyfill.canPlayType[i]) {
                source = document.createElement("source");
                source.src = path.replace(extname, polyfill.canPlayType[i]);
                video.appendChild(source);
            }
        }
    },

    getURL: function() {
        return this._url;
    },

    play: function () {
        var video = this._video;
        if (!video || !this._visible) return;

        this._played = true;
        if (this._playing) {
            return;
        }

        if (VideoPlayerImpl._polyfill.autoplayAfterOperation) {
            var self = this;
            setTimeout(function () {
                video.play();
                self._playing = !video.paused;
            }, 20);
        }
        else {
            video.play();
            this._playing = !video.paused;
        }
    },

    pause: function () {
        var video = this._video;
        if (!this._playing) return;

        this._playing = false;
        if (!video) {
            return;
        }
        video.pause();
    },

    _resume: function () {
        this.play();
    },

    stop: function () {
        var video = this._video;
        if (!video || !this._visible) return;
        this._ignorePause = true;
        video.pause();
        var self = this;
        setTimeout(function () {
            self._dispatchEvent(VideoPlayerImpl.EventType.STOPPED);
            self._ignorePause = false;
        }, 0);
        // 恢复到视频起始位置
        video.currentTime = 0;
        this._playing = false;
    },

    setVolume: function (volume) {
        var video = this._video;
        if (video) {
            video.volume = volume;
        }
    },

    seekTo: function (time) {
        var video = this._video;
        if (!video) return;

        if (this._loaded) {
            video.currentTime = time;
        }
        else {
            var cb = function () {
                video.currentTime = time;
                video.removeEventListener(VideoPlayerImpl._polyfill.event, cb);
            };
            video.addEventListener(VideoPlayerImpl._polyfill.event, cb);
        }
        if (VideoPlayerImpl._polyfill.autoplayAfterOperation && this.isPlaying()) {
            setTimeout(function () {
                video.play();
            }, 20);
        }
    },

    isPlaying: function () {
        var video = this._video;
        if (VideoPlayerImpl._polyfill.autoplayAfterOperation && this._playing) {
            setTimeout(function () {
                video.play();
            }, 20);
        }
        return this._playing;
    },

    duration: function () {
        var video = this._video;
        var duration = -1;
        if (!video) return duration;

        duration = video.duration;
        if (duration <= 0) {
            cc.logID(7702);
        }

        return duration;
    },

    currentTime: function() {
        var video = this._video;
        if (!video) return -1;

        return video.currentTime;
    },

    setKeepAspectRatioEnabled: function () {
        cc.logID(7700);
    },

    isKeepAspectRatioEnabled: function () {
        return true;
    },

    setFullScreenEnabled: function (enable) {
        var video = this._video;
        if (!video) return;

        if (enable)
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
            callback.call(this, this, this._video.src);
    },

    onPlayEvent: function () {
        var callback = this._EventList[VideoPlayerImpl.EventType.PLAYING];
        callback.call(this, this, this._video.src);
    },

    enable: function () {
        var list = VideoPlayerImpl.elements;
        if (list.indexOf(this) === -1)
            list.push(this);
        this.setVisible(true);
    },

    disable: function () {
        var list = VideoPlayerImpl.elements;
        var index = list.indexOf(this);
        if (index !== -1)
            list.splice(index, 1);
        this.setVisible(false);
    },

    destroy: function () {
        this.disable();
        this.removeDom();
    },

    setVisible: function (visible) {
        if (this._visible !== visible) {
            this._visible = !!visible;
            this._updateVisibility();
        }
    },

    updateMatrix (node) {
        if (!this._video || !this._visible) return;

        var mat = node._worldMatrix;
        if (!this._forceUpdate &&
            this._m00 === mat.m00 && this._m01 === mat.m01 && this._m04 === mat.m04 && this._m05 === mat.m05 && this._m12 === mat.m12 && this._m13 === mat.m13 &&
            this._w === node._contentSize.width && this._h === node._contentSize.height) {
            return;
        }

        // update matrix cache
        this._m00 = mat.m00;
        this._m01 = mat.m01;
        this._m04 = mat.m04;
        this._m05 = mat.m05;
        this._m12 = mat.m12;
        this._m13 = mat.m13;
        this._w = node._contentSize.width;
        this._h = node._contentSize.height;
        
        var scaleX = cc.view._scaleX, scaleY = cc.view._scaleY;
        var dpr = cc.view._devicePixelRatio;

        scaleX /= dpr;
        scaleY /= dpr;

        var container = cc.game.container;
        var a = mat.m00 * scaleX, b = mat.m01, c = mat.m04, d = mat.m05 * scaleY;

        var offsetX = container && container.style.paddingLeft && parseInt(container.style.paddingLeft);
        var offsetY = container && container.style.paddingBottom && parseInt(container.style.paddingBottom);
        var w, h;
        if (VideoPlayerImpl._polyfill.zoomInvalid) {
            this._updateSize(this._w * a, this._h * d);
            a = 1;
            d = 1;
            w = this._w * scaleX;
            h = this._h * scaleY;
        }
        else {
            this._updateSize(this._w, this._h);
            w = this._w * scaleX;
            h = this._h * scaleY;
        }

        var appx = w * node._anchorPoint.x;
        var appy = h - h * node._anchorPoint.y;
        var tx = mat.m12 * scaleX - appx + offsetX, ty = mat.m13 * scaleY - appy + offsetY;

        var matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
        this._video.style['transform'] = matrix;
        this._video.style['-webkit-transform'] = matrix;
        this._video.style['transform-origin'] = '0px 100% 0px';
        this._video.style['-webkit-transform-origin'] = '0px 100% 0px';
    }
});

VideoPlayerImpl.EventType = {
    PLAYING: 0,
    PAUSED: 1,
    STOPPED: 2,
    COMPLETED: 3,
    META_LOADED: 4,
    CLICKED: 5,
    READY_TO_PLAY: 6
};

// video 队列，所有 vidoe 在 onEnter 的时候都会插入这个队列
VideoPlayerImpl.elements = [];
// video 在 game_hide 事件中被自动暂停的队列，用于回复的时候重新开始播放
VideoPlayerImpl.pauseElements = [];

cc.game.on(cc.game.EVENT_HIDE, function () {
    var list = VideoPlayerImpl.elements;
    for (var element, i = 0; i < list.length; i++) {
        element = list[i];
        if (element.isPlaying()) {
            element.pause();
            VideoPlayerImpl.pauseElements.push(element);
        }
    }
});

cc.game.on(cc.game.EVENT_SHOW, function () {
    var list = VideoPlayerImpl.pauseElements;
    var element = list.pop();
    while (element) {
        element.play();
        element = list.pop();
    }
});


/**
 * Adapter various machines
 * @devicePixelRatio Whether you need to consider devicePixelRatio calculated position
 * @event To get the data using events
 */
VideoPlayerImpl._polyfill = {
    devicePixelRatio: false,
    event: "canplay",
    canPlayType: []
};

/**
 * Some old browser only supports Theora encode video
 * But native does not support this encode,
 * so it is best to provide mp4 and webm or ogv file
 */
let dom = document.createElement("video");
if (sys.platform !== sys.WECHAT_GAME) {
    if (dom.canPlayType("video/ogg")) {
        VideoPlayerImpl._polyfill.canPlayType.push(".ogg");
        VideoPlayerImpl._polyfill.canPlayType.push(".ogv");
    }
    if (dom.canPlayType("video/mp4"))
        VideoPlayerImpl._polyfill.canPlayType.push(".mp4");
    if (dom.canPlayType("video/webm"))
        VideoPlayerImpl._polyfill.canPlayType.push(".webm");
}

if (sys.browserType === sys.BROWSER_TYPE_FIREFOX) {
    VideoPlayerImpl._polyfill.autoplayAfterOperation = true;
}

if (
    sys.OS_ANDROID === sys.os && (
    sys.browserType === sys.BROWSER_TYPE_SOUGOU ||
    sys.browserType === sys.BROWSER_TYPE_360
)
) {
    VideoPlayerImpl._polyfill.zoomInvalid = true;
}

let style = document.createElement("style");
style.innerHTML = ".cocosVideo:-moz-full-screen{transform:matrix(1,0,0,1,0,0) !important;}" +
    ".cocosVideo:full-screen{transform:matrix(1,0,0,1,0,0) !important;}" +
    ".cocosVideo:-webkit-full-screen{transform:matrix(1,0,0,1,0,0) !important;}";
document.head.appendChild(style);

module.exports = VideoPlayerImpl;