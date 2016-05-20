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

var VideoPlayer = cc.Class({
    name: 'cc.VideoPlayer',
    extends: cc._RendererUnderSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/VideoPlayer',
        inspector: 'app://editor/page/inspector/videoplayer.html',
    },

    properties: {

        _resourceType: 0,
        resourceType: {
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
        url: {
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
        video: {
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

        currentTime: {
            type: cc.Float,
            set: function ( time ) {
                this._time = time;
                this._sgNode.seekTo(time);
            },
            get: function () {
                return this._time;
            }
        },

        keepAspectRatio: {
            default: true,
            type: cc.Boolean,
            notify: function () {
                this._sgNode.setKeepAspectRatioEnabled(this.keepAspectRatio);
            }
        },

        enableFullscreen: {
            default: false,
            type: cc.Boolean,
            notify: function() {
                this._sgNode.setFullScreenEnabled(this.enableFullscreen);
            }
        },

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
