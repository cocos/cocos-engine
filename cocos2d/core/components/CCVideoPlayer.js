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

var EventType = _ccsg.VideoPlayer.EventType;


/**
 * !#en Enum for video resouce type type.
 * !#zh 视频来源
 * @enum VideoPlayer.ResourceType
 */
var ResourceType = cc.Enum({
    /**
     * !#en The remote resource type.
     * !#zh 远程视频
     * @property {Number} REMOTE
     */
    REMOTE: 0,
    /**
     * !#en The local resouce type.
     * !#zh 本地视频
     * @property {Number} LOCAL
     */
    LOCAL: 1
});


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

        _resourceType: ResourceType.REMOTE,
        /**
         * !#en The resource type of videoplayer, REMOTE for remote url and LOCAL for local file path.
         * !#zh 视频来源：REMOTE 表示远程视频 URL，LOCAL 表示本地视频地址。
         * @property {VideoPlayer.ResourceType} resourceType
         */
        resourceType: {
            tooltip: 'i18n:COMPONENT.videoplayer.resourceType',
            type: ResourceType,
            set: function ( value ) {
                this._resourceType = value;
                this._updateSgNode();
            },
            get: function () {
                return this._resourceType
            }
        },

        _remoteURL: '',
        /**
         * !#en The remote URL of video.
         * !#zh 远程视频的 URL
         * @property {String} remoteURL
         */
        remoteURL: {
            tooltip: 'i18n:COMPONENT.videoplayer.url',
            type: cc.String,
            set: function ( url ) {
                this._remoteURL = url;
                this._updateSgNode();
            },
            get: function () {
                return this._remoteURL;
            }
        },

        _clip: {
            default: null,
            url: cc.RawAsset
        },
        /**
         * !#en The local video full path.
         * !#zh 本地视频的 URL
         * @property {String} video
         */
        clip: {
            tooltip: 'i18n:COMPONENT.videoplayer.video',
            get: function () {
                return this._clip;
            },
            set: function ( value ) {
                if (typeof value !== 'string')
                    value = '';
                this._clip = value;
                this._updateSgNode();
            },
            url: cc.RawAsset
        },

        _time: 0,
        /**
         * !#en The current time when video start to play.
         * !#zh  从当前时间点开始播放视频
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
         * @property {Boolean} isFullscreen
         */
        isFullscreen: {
            tooltip: 'i18n:COMPONENT.videoplayer.isFullscreen',
            default: false,
            type: cc.Boolean,
            notify: function() {
                this._sgNode.setFullScreenEnabled(this.isFullscreen);
            }
        },

        /**
         * !#en the video player's callback, it will be triggered when certain event occurs, like: playing, paused, stopped and completed.
         * !#zh 视频播放回调函数，该回调函数会在特定情况被触发，比如播放中，暂时，停止和完成播放。
         * @property {cc.Component.EventHandler[]} videoPlayerEvent
         */
        videoPlayerEvent: {
            default: [],
            type: cc.Component.EventHandler,
        },
    },

    statics: {
        EventType: EventType,
        ResourceType: ResourceType
    },

    onLoad: function() {

        if(CC_JSB) {
            if (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS) {
                this.enabled = false;
            }
        }
    },

    _createSgNode: function () {
        if(CC_JSB) {
            if (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS) {
                console.log('VideoPlayer is not supported on Mac and Windows!');
                return null;
            }
        }
        return new _ccsg.VideoPlayer();
    },

    _updateSgNode: function () {
        var sgNode = this._sgNode;
        if (this.resourceType === ResourceType.REMOTE) {
            sgNode.setURL(this.remoteURL);
        } else {
            sgNode.setURL(this._clip || '');
        }
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;
        if(sgNode) {
            this._updateSgNode();

            sgNode.seekTo(this.currentTime);
            sgNode.setKeepAspectRatioEnabled(this.keepAspectRatio);
            sgNode.setFullScreenEnabled(this.isFullscreen);
            sgNode.setContentSize(this.node.getContentSize());
            this.pause();

            sgNode.setEventListener(EventType.PLAYING, this.onPlaying.bind(this));
            sgNode.setEventListener(EventType.PAUSED, this.onPasued.bind(this));
            sgNode.setEventListener(EventType.STOPPED, this.onStopped.bind(this));
            sgNode.setEventListener(EventType.COMPLETED, this.onCompleted.bind(this));
        }
    },

    onPlaying: function(){
        cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.PLAYING);
    },

    onPasued: function() {
        cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.PAUSED);
    },

    onStopped: function() {
        cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.STOPPED);
    },

    onCompleted: function() {
        cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.COMPLETED);
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

    stop: function() {
        if(this._sgNode) {
            this._sgNode.stop();
        }
    },

});

cc.VideoPlayer = module.exports = VideoPlayer;
