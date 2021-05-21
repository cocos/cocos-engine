/****************************************************************************
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

const utils = require('../core/platform/utils');
const sys = require('../core/platform/sys');
const renderEngine = require('../core/renderer/render-engine');
const math = renderEngine.math;

let _mat4_temp = math.mat4.create();

// ios brower need to wait until the video's loadedmetadata event
// has been fired before calling webkitEnterFullScreen()
function triggerFullScene (video, enable) {
    if (!video) return;
    if (enable) {
        video.webkitEnterFullscreen && video.webkitEnterFullscreen();
    }
    else {
        video.webkitExitFullscreen && video.webkitExitFullscreen();
    }
}

let VideoPlayerImpl = cc.Class({
    name: 'VideoPlayerImpl',

    ctor () {
        // 播放结束等事件处理的队列
        this._EventList = {};

        this._video = null;
        this._url = '';

        this._fullScreenEnabled = false;

        this._loadedmeta = false;
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
        //
        this.__eventListeners = {};
    },

    _bindEvent () {
        let video = this._video, self = this;
        //binding event
        let cbs = this.__eventListeners;
        cbs.loadedmetadata = function () {
            this._loadedmeta = true;
            if (sys.os === sys.OS.IOS && sys.isBrowser) {
                triggerFullScene(video, self._fullScreenEnabled);
            }
            self._dispatchEvent(VideoPlayerImpl.EventType.META_LOADED);
        };
        cbs.ended = function () {
            if (self._video !== video) return;
            self._playing = false;
            self._dispatchEvent(VideoPlayerImpl.EventType.COMPLETED);
        };
        cbs.play = function () {
            if (self._video !== video) return;
            self._playing = true;
            self._dispatchEvent(VideoPlayerImpl.EventType.PLAYING);
        };
        cbs.pause = function () {
            if (self._ignorePause || self._video !== video) return;
            self._playing = false;
            self._dispatchEvent(VideoPlayerImpl.EventType.PAUSED);
        };
        cbs.click = function () {
            self._dispatchEvent(VideoPlayerImpl.EventType.CLICKED);
        };

        video.addEventListener("loadedmetadata", cbs.loadedmetadata);
        video.addEventListener("ended", cbs.ended);
        video.addEventListener("play", cbs.play);
        video.addEventListener("pause", cbs.pause);
        video.addEventListener("click", cbs.click);

        function onCanPlay () {
            if (this._loaded)
                return;
            let video = this._video;
            if (video.readyState === 4) {
                this._loaded = true;
                // node.setContentSize(node._contentSize.width, node._contentSize.height);
                video.currentTime = 0;
                this._dispatchEvent(VideoPlayerImpl.EventType.READY_TO_PLAY);
                this._updateVisibility();
            }
        }

        cbs.onCanPlay = onCanPlay.bind(this);
        video.addEventListener('canplay', cbs.onCanPlay);
        video.addEventListener('canplaythrough', cbs.onCanPlay);
        video.addEventListener('suspend', cbs.onCanPlay);
    },

    _updateVisibility () {
        if (!this._video) return;
        let video = this._video;
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
        let video = this._video;
        if (!video) return;

        video.style.width = width + 'px';
        video.style.height = height + 'px';
    },

    _createDom () {
        let video = document.createElement('video');
        video.style.position = "absolute";
        video.style.bottom = "0px";
        video.style.left = "0px";
        video.className = "cocosVideo";
        video.setAttribute('preload', 'auto');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('playsinline', '');

        // Stupid tencent x5 adaptation
        let orientation = cc.winSize.width > cc.winSize.height ? "landscape" : "portrait";
        video.setAttribute("x5-playsinline", "");
        video.setAttribute("x5-video-player-type", "h5");
        video.setAttribute("x5-video-orientation", orientation);

        this._video = video;
        cc.game.container.appendChild(video);
    },

    createDomElementIfNeeded: function () {
        if (!this._video) {
            this._createDom();
        }
    },

    removeDom () {
        let video = this._video;
        if (video) {
            let hasChild = utils.contains(cc.game.container, video);
            if (hasChild)
                cc.game.container.removeChild(video);
            let cbs = this.__eventListeners;
            video.removeEventListener("loadedmetadata", cbs.loadedmetadata);
            video.removeEventListener("ended", cbs.ended);
            video.removeEventListener("play", cbs.play);
            video.removeEventListener("pause", cbs.pause);
            video.removeEventListener("click", cbs.click);
            video.removeEventListener("canplay", cbs.onCanPlay);
            video.removeEventListener("canplaythrough", cbs.onCanPlay);
            video.removeEventListener("suspend", cbs.onCanPlay);

            cbs.loadedmetadata = null;
            cbs.ended = null;
            cbs.play = null;
            cbs.pause = null;
            cbs.click = null;
            cbs.onCanPlay = null;
        }

        this._video = null;
        this._url = "";
    },

    setURL (path) {
        let source, extname;

        if (this._url === path) {
            return;
        }

        this._url = path;
        this.removeDom();
        this.createDomElementIfNeeded();
        this._bindEvent();

        let video = this._video;
        video.style["visibility"] = "hidden";
        this._loaded = false;
        this._played = false;
        this._playing = false;
        this._loadedmeta = false;

        source = document.createElement("source");
        source.src = path;
        video.appendChild(source);

        extname = cc.path.extname(path);
        let polyfill = VideoPlayerImpl._polyfill;
        for (let i = 0; i < polyfill.canPlayType.length; i++) {
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
        let video = this._video;
        if (!video || !this._visible) return;

        this._played = true;
        if (this._playing) {
            return;
        }

        if (VideoPlayerImpl._polyfill.autoplayAfterOperation) {
            let self = this;
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
        let video = this._video;
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
        let video = this._video;
        if (!video || !this._visible) return;
        this._ignorePause = true;
        video.pause();
        let self = this;
        setTimeout(function () {
            self._dispatchEvent(VideoPlayerImpl.EventType.STOPPED);
            self._ignorePause = false;
        }, 0);
        // 恢复到视频起始位置
        video.currentTime = 0;
        this._playing = false;
    },

    setVolume: function (volume) {
        let video = this._video;
        if (video) {
            video.volume = volume;
        }
    },

    seekTo: function (time) {
        let video = this._video;
        if (!video) return;

        if (this._loaded) {
            video.currentTime = time;
        }
        else {
            let cb = function () {
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
        let video = this._video;
        if (VideoPlayerImpl._polyfill.autoplayAfterOperation && this._playing) {
            setTimeout(function () {
                video.play();
            }, 20);
        }
        return this._playing;
    },

    duration: function () {
        let video = this._video;
        let duration = -1;
        if (!video) return duration;

        duration = video.duration;
        if (duration <= 0) {
            cc.logID(7702);
        }

        return duration;
    },

    currentTime: function() {
        let video = this._video;
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
        let video =  this._video;
        if (!video) {
            return;
        }
        if (sys.os === sys.OS.IOS && sys.isBrowser) {
            this._fullScreenEnabled = enable;
            if (this._loadedmeta) {
                triggerFullScene(video, enable);
            }
        }
        else {
            if (enable) {
                cc.screen.requestFullScreen(video);
            }
            else {
                cc.screen.exitFullScreen(video);
            }
        }
    },

    isFullScreenEnabled: function () {
        return this._fullScreenEnabled;
    },

    setEventListener: function (event, callback) {
        this._EventList[event] = callback;
    },

    removeEventListener: function (event) {
        this._EventList[event] = null;
    },

    _dispatchEvent: function (event) {
        let callback = this._EventList[event];
        if (callback)
            callback.call(this, this, this._video.src);
    },

    onPlayEvent: function () {
        let callback = this._EventList[VideoPlayerImpl.EventType.PLAYING];
        callback.call(this, this, this._video.src);
    },

    enable: function () {
        let list = VideoPlayerImpl.elements;
        if (list.indexOf(this) === -1)
            list.push(this);
        this.setVisible(true);
    },

    disable: function () {
        let list = VideoPlayerImpl.elements;
        let index = list.indexOf(this);
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

        node.getWorldMatrix(_mat4_temp);
        if (!this._forceUpdate &&
            this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 &&
            this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 &&
            this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 &&
            this._w === node._contentSize.width && this._h === node._contentSize.height) {
            return;
        }

        // update matrix cache
        this._m00 = _mat4_temp.m00;
        this._m01 = _mat4_temp.m01;
        this._m04 = _mat4_temp.m04;
        this._m05 = _mat4_temp.m05;
        this._m12 = _mat4_temp.m12;
        this._m13 = _mat4_temp.m13;
        this._w = node._contentSize.width;
        this._h = node._contentSize.height;

        let scaleX = cc.view._scaleX, scaleY = cc.view._scaleY;
        let dpr = cc.view._devicePixelRatio;

        scaleX /= dpr;
        scaleY /= dpr;

        let container = cc.game.container;
        let a = _mat4_temp.m00 * scaleX, b = _mat4_temp.m01, c = _mat4_temp.m04, d = _mat4_temp.m05 * scaleY;

        let offsetX = container && container.style.paddingLeft ? parseInt(container.style.paddingLeft) : 0;
        let offsetY = container && container.style.paddingBottom ? parseInt(container.style.paddingBottom) : 0;
        let w, h;
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

        let appx = (w * _mat4_temp.m00) * node._anchorPoint.x;
        let appy = (h * _mat4_temp.m05) * node._anchorPoint.y;
        let tx = _mat4_temp.m12 * scaleX - appx + offsetX, ty = _mat4_temp.m13 * scaleY - appy + offsetY;

        let matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
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
    let list = VideoPlayerImpl.elements;
    for (let element, i = 0; i < list.length; i++) {
        element = list[i];
        if (element.isPlaying()) {
            element.pause();
            VideoPlayerImpl.pauseElements.push(element);
        }
    }
});

cc.game.on(cc.game.EVENT_SHOW, function () {
    let list = VideoPlayerImpl.pauseElements;
    let element = list.pop();
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

if (sys.browserType === sys.BrowserType.FIREFOX) {
    VideoPlayerImpl._polyfill.autoplayAfterOperation = true;
}

if (
    sys.OS_ANDROID === sys.os && (
    sys.browserType === sys.BrowserType.SOUGOU ||
    sys.browserType === sys.BrowserType.BROWSER_360
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