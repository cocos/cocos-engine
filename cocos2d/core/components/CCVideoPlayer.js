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

/**
 * !#en Video is playing.
 * !#zh 视频正在播放中
 * @property {String} PLAYING
 */
/**
 * !#en Video is paused.
 * !#zh 视频暂停播放了
 * @property {String} PAUSED
 */
/**
 * !#en Video is stopped.
 * !#zh 视频停止播放了。
 * @property {String} STOPPED
 */
/**
 * !#en Video is completed.
 * !#zh 视频播放完成了
 * @property {String} COMPLETED
 */
var EventType = _ccsg.VideoPlayer.EventType;


/**
 * !#en cc.VideoPlayer is a component for playing videos, you can use it for showing videos in your game.
 * !#zh Video 组件，用于在游戏中播放视频
 * @class VideoPlayer
 * @extends _RendererUnderSG
 */
var VideoPlayer = cc.Class({
    name: 'cc.VideoPlayer',
    extends: cc._RendererUnderSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/VideoPlayer',
        inspector: 'app://editor/page/inspector/videoplayer.html',
        help: 'i18n:COMPONENT.help_url.videoplayer',
    },

    properties: {

        _resourceType: 0,
        /**
         * !#en The resource type of videoplayer, 0 for remote url and 1 for local file path.
         * !#zh 视频来源：0 表示远程视频 URL，1 表示本地视频地址。
         * @property {Number} resourceType
         */
        resourceType: {
            tooltip: 'i18n:COMPONENT.videoplayer.resourceType',
            type: cc.Integer, // 0: remote | 1: local
            set: function ( value ) {
                value = value - 0;
                this._resourceType = value;
                this._updateSgNode();
            },
            get: function () {
                return this._resourceType
            }
        },

        _url: '',
        /**
         * !#en The remote URL of video.
         * !#zh 远程视频的 URL
         * @property {String} url
         */
        url: {
            tooltip: 'i18n:COMPONENT.videoplayer.url',
            type: cc.String,
            set: function ( url ) {
                this._url = url;
                this._updateSgNode();
            },
            get: function () {
                return this._url;
            }
        },

        _video: {
            default: null,
            url: cc.RawAsset
        },
        /**
         * !#en The local video full path.
         * !#zh 本地视频的 URL
         * @property {String} video
         */
        video: {
            tooltip: 'i18n:COMPONENT.videoplayer.video',
            get: function () {
                return this._video;
            },
            set: function ( value ) {
                if (typeof value !== 'string')
                    value = '';
                this._video = value;
                this._updateSgNode();
            },
            url: cc.RawAsset
        },

        _time: 0,
        /**
         * !#en The start time when video start to play.
         * !#zh  从哪个时间点开始播放视频
         * @property {Float} currentTime
         */
        currentTime: {
            tooltip: 'i18n:COMPONENT.videoplayer.currentTime',
            type: cc.Float,
            set: function ( time ) {
                this._time = time;
                this._sgNode.seekTo(time);
            },
            get: function () {
                return this._time;
            }
        },

        /**
         * !#en Whether keep the aspect ration of the original video.
         * !#zh 是否保持视频原来的宽高比
         * @property {Boolean} keepAspectRatio
         */
        keepAspectRatio: {
            tooltip: 'i18n:COMPONENT.videoplayer.keepAspectRatio',
            default: true,
            type: cc.Boolean,
            notify: function () {
                this._sgNode.setKeepAspectRatioEnabled(this.keepAspectRatio);
            }
        },

        /**
         * !#en Whether play video in fullscreen mode.
         * !#zh 是否全屏播放视频
         * @property {Boolean} keepAspectRatio
         */
        enableFullscreen: {
            tooltip: 'i18n:COMPONENT.videoplayer.enableFullscreen',
            default: false,
            type: cc.Boolean,
            notify: function() {
                this._sgNode.setFullScreenEnabled(this.enableFullscreen);
            }
        },

        /**
         * !#en the video player's callback, it will be triggered when certain event occurs, like: playing, paused, stopped and completed.
         * !#zh 视频播放回调函数，该回调函数会在特定情况被触发，比如播放中，暂时，停止和完成播放。
         * @property {cc.Component.EventHandler} onVideoPlayerEvent
         */
        onVideoPlayerEvent: {
            default: [],
            type: cc.Component.EventHandler,
        },
    },

    statics: {
        EventType: EventType
    },

    onLoad: function() {
        this._super();

        if(cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS) {
                this.enabled = false;
            }
        }
    },

    _createSgNode: function () {
        if(cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS) {
                console.log('VideoPlayer is not supported on Mac and Windows!');
                return null;
            }
        }
        return new _ccsg.VideoPlayer();
    },

    _updateSgNode: function () {
        var sgNode = this._sgNode;
        if (this.resourceType === 0) {
            sgNode.setURL(this.url);
        } else {
            sgNode.setURL(this._video || '');
        }
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;
        if(sgNode) {
            this._updateSgNode();

            sgNode.seekTo(this.currentTime);
            sgNode.setKeepAspectRatioEnabled(this.keepAspectRatio);
            sgNode.setFullScreenEnabled(this.enableFullscreen);
            sgNode.setContentSize(this.node.getContentSize());
            this.pause();

            sgNode.setEventListener(EventType.PLAYING, this.onPlaying.bind(this));
            sgNode.setEventListener(EventType.PAUSED, this.onPasued.bind(this));
            sgNode.setEventListener(EventType.STOPPED, this.onStopped.bind(this));
            sgNode.setEventListener(EventType.COMPLETED, this.onCompleted.bind(this));
        }
    },

    onPlaying: function(){
        cc.Component.EventHandler.emitEvents(this.onVideoPlayerEvent, this, EventType.PLAYING);
    },

    onPasued: function() {
        cc.Component.EventHandler.emitEvents(this.onVideoPlayerEvent, this, EventType.PAUSED);
    },

    onStopped: function() {
        cc.Component.EventHandler.emitEvents(this.onVideoPlayerEvent, this, EventType.STOPPED);
    },

    onCompleted: function() {
        cc.Component.EventHandler.emitEvents(this.onVideoPlayerEvent, this, EventType.COMPLETED);
    },

    play: function () {
        if(this._sgNode) {
            this._sgNode.play();
        }
    },

    resume: function() {
        if (this._sgNode) {
            this._sgNode.resume();
        }
    },

    pause: function () {
        if(this._sgNode) {
            this._sgNode.pause();
        }
    },

    seekTo: function ( time ) {
        if(this._sgNode) {
            this._sgNode.seekTo(time);
        }
    },

    stop: function() {
        if(this._sgNode) {
            this._sgNode.stop();
        }
    },

});

cc.VideoPlayer = module.exports = VideoPlayer;
