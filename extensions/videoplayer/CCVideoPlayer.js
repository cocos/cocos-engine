/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

const VideoPlayerImpl = require('./video-player-impl');

/**
 * !#en Video event type
 * !#zh 视频事件类型
 * @enum VideoPlayer.EventType
 */
/**
 * !#en play
 * !#zh 播放
 * @property {Number} PLAYING
 */
/**
 * !#en pause
 * !#zh 暂停
 * @property {Number} PAUSED
 */
/**
 * !#en stop
 * !#zh 停止
 * @property {Number} STOPPED
 */
/**
 * !#en play end
 * !#zh 播放结束
 * @property {Number} COMPLETED
 */
/**
 * !#en meta data is loaded
 * !#zh 视频的元信息已加载完成，你可以调用 getDuration 来获取视频总时长
 * @property {Number} META_LOADED
 */
/**
 * !#en clicked by the user
 * !#zh 视频被用户点击了
 * @property {Number} CLICKED
 */
/**
 * !#en ready to play, this event is not guaranteed to be triggered on all platform or browser, please don't rely on it to play your video.<br/>
 * !#zh 视频准备好了，这个事件并不保障会在所有平台或浏览器中被触发，它依赖于平台实现，请不要依赖于这个事件做视频播放的控制。
 * @property {Number} READY_TO_PLAY
 */
const EventType = VideoPlayerImpl.EventType;


/**
 * !#en Enum for video resouce type type.
 * !#zh 视频来源
 * @enum VideoPlayer.ResourceType
 */
const ResourceType = cc.Enum({
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
 * @extends Component
 */
let VideoPlayer = cc.Class({
    name: 'cc.VideoPlayer',
    extends: cc.Component,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/VideoPlayer',
        inspector: 'packages://inspector/inspectors/comps/videoplayer.js',
        help: 'i18n:COMPONENT.help_url.videoplayer',
        executeInEditMode: true
    },

    properties: {

        _resourceType: ResourceType.REMOTE,
        /**
         * !#en The resource type of videoplayer, REMOTE for remote url and LOCAL for local file path.
         * !#zh 视频来源：REMOTE 表示远程视频 URL，LOCAL 表示本地视频地址。
         * @property {VideoPlayer.ResourceType} resourceType
         */
        resourceType: {
            tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.resourceType',
            type: ResourceType,
            set: function (value) {
                this._resourceType = value;
                this._updateVideoSource();
            },
            get: function () {
                return this._resourceType;
            }
        },

        _remoteURL: '',
        /**
         * !#en The remote URL of video.
         * !#zh 远程视频的 URL
         * @property {String} remoteURL
         */
        remoteURL: {
            tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.url',
            type: cc.String,
            set: function (url) {
                this._remoteURL = url;
                this._updateVideoSource();
            },
            get: function () {
                return this._remoteURL;
            }
        },

        _clip: {
            default: null,
            type: cc.Asset
        },
        /**
         * !#en The local video full path.
         * !#zh 本地视频的 URL
         * @property {String} clip
         */
        clip: {
            tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.video',
            get: function () {
                return this._clip;
            },
            set: function (value) {
                this._clip = value;
                this._updateVideoSource();
            },
            type: cc.Asset
        },

        /**
         * !#en The current playback time of the now playing item in seconds, you could also change the start playback time.
         * !#zh 指定视频从什么时间点开始播放，单位是秒，也可以用来获取当前视频播放的时间进度。
         * @property {Number} currentTime
         */
        currentTime: {
            tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.currentTime',
            type: cc.Float,
            set: function (time) {
                if (this._impl) {
                    this._impl.seekTo(time);
                }
            },
            get: function () {
                if (this._impl) {
                    return this._impl.currentTime();
                }
                return -1;
            }
        },

        _volume: 1,
        /**
         * !#en The volume of the video.
         * !#zh 视频的音量（0.0 ~ 1.0）
         * @property volume
         * @type {Number}
         * @default 1
         */
        volume: {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                this._volume = value;
                if (this.isPlaying() && !this._mute) {
                    this._syncVolume();
                }
            },
            range: [0, 1],
            type: cc.Float,
            tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.volume'
        },

        _mute: false,
        /**
         * !#en Mutes the VideoPlayer. Mute sets the volume=0, Un-Mute restore the original volume.
         * !#zh 是否静音视频。静音时设置音量为 0，取消静音是恢复原来的音量。
         * @property mute
         * @type {Boolean}
         * @default false
         */
        mute: {
            get: function () {
                return this._mute;
            },
            set: function (value) {
                this._mute = value;
                this._syncVolume();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.mute',
        },

        /**
         * !#en Whether keep the aspect ration of the original video.
         * !#zh 是否保持视频原来的宽高比
         * @property {Boolean} keepAspectRatio
         */
        keepAspectRatio: {
            tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.keepAspectRatio',
            default: true,
            type: cc.Boolean,
            notify: function () {
                this._impl.setKeepAspectRatioEnabled(this.keepAspectRatio);
            }
        },

        /**
         * !#en Whether play video in fullscreen mode.
         * !#zh 是否全屏播放视频
         * @property {Boolean} isFullscreen
         */
        isFullscreen: {
            tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.isFullscreen',
            default: false,
            type: cc.Boolean,
            notify: function () {
                this._impl.setFullScreenEnabled(this.isFullscreen);
            }
        },

        /**
         * !#en the video player's callback, it will be triggered when certain event occurs, like: playing, paused, stopped and completed.
         * !#zh 视频播放回调函数，该回调函数会在特定情况被触发，比如播放中，暂时，停止和完成播放。
         * @property {Component.EventHandler[]} videoPlayerEvent
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

    ctor () {
        this._impl = new VideoPlayerImpl();
    },

    _syncVolume () {
        let impl = this._impl;
        if (impl) {
            let volume = this._mute ? 0 : this._volume;
            impl.setVolume(volume);
        }
    },

    _updateVideoSource () {
        let url = '';
        if (this.resourceType === ResourceType.REMOTE) {
            url = this.remoteURL;
        }
        else if (this._clip) {
            url = this._clip.nativeUrl || '';
        }
        if (url && cc.loader.md5Pipe) {
            url = cc.loader.md5Pipe.transformURL(url);
        }
        this._impl.setURL(url);
    },

    onLoad () {
        let impl = this._impl;
        if (impl) {
            impl.createDomElementIfNeeded();
            this._updateVideoSource();

            impl.seekTo(this.currentTime);
            impl.setKeepAspectRatioEnabled(this.keepAspectRatio);
            impl.setFullScreenEnabled(this.isFullscreen);
            this.pause();

            if (!CC_EDITOR) {
                impl.setEventListener(EventType.PLAYING, this.onPlaying.bind(this));
                impl.setEventListener(EventType.PAUSED, this.onPaused.bind(this));
                impl.setEventListener(EventType.STOPPED, this.onStopped.bind(this));
                impl.setEventListener(EventType.COMPLETED, this.onCompleted.bind(this));
                impl.setEventListener(EventType.META_LOADED, this.onMetaLoaded.bind(this));
                impl.setEventListener(EventType.CLICKED, this.onClicked.bind(this));
                impl.setEventListener(EventType.READY_TO_PLAY, this.onReadyToPlay.bind(this));
            }
        }
    },

    onRestore () {
        if (!this._impl) {
            this._impl = new VideoPlayerImpl();
        }
    },

    onEnable () {
        if (this._impl) {
            this._impl.enable();
        }
    },

    onDisable () {
        if (this._impl) {
            this._impl.disable();
        }
    },

    onDestroy () {
        if (this._impl) {
            this._impl.destroy();
            this._impl = null;
        }
    },

    update (dt) {
        if (this._impl) {
            this._impl.updateMatrix(this.node);
        }
    },

    onReadyToPlay () {
        cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.READY_TO_PLAY);
        this.node.emit('ready-to-play', this);
    },

    onMetaLoaded () {
        cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.META_LOADED);
        this.node.emit('meta-loaded', this);
    },

    onClicked () {
        cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.CLICKED);
        this.node.emit('clicked', this);
    },

    onPlaying () {
        cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.PLAYING);
        this.node.emit('playing', this);
    },

    onPaused () {
        cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.PAUSED);
        this.node.emit('paused', this);
    },

    onStopped () {
        cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.STOPPED);
        this.node.emit('stopped', this);
    },

    onCompleted () {
        cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.COMPLETED);
        this.node.emit('completed', this);
    },

    /**
     * !#en If a video is paused, call this method could resume playing. If a video is stopped, call this method to play from scratch.
     * !#zh 如果视频被暂停播放了，调用这个接口可以继续播放。如果视频被停止播放了，调用这个接口可以从头开始播放。
     * @method play
     */
    play () {
        if (this._impl) {
            this._syncVolume();
            this._impl.play();
        }
    },

    /**
     * !#en If a video is paused, call this method to resume playing.
     * !#zh 如果一个视频播放被暂停播放了，调用这个接口可以继续播放。
     * @method resume
     */
    resume () {
        if (this._impl) {
            this._syncVolume();
            this._impl.resume();
        }
    },

    /**
     * !#en If a video is playing, call this method to pause playing.
     * !#zh 如果一个视频正在播放，调用这个接口可以暂停播放。
     * @method pause
     */
    pause () {
        if (this._impl) {
            this._impl.pause();
        }
    },

    /**
     * !#en If a video is playing, call this method to stop playing immediately.
     * !#zh 如果一个视频正在播放，调用这个接口可以立马停止播放。
     * @method stop
     */
    stop () {
        if (this._impl) {
            this._impl.stop();
        }
    },

    /**
     * !#en Gets the duration of the video
     * !#zh 获取视频文件的播放总时长
     * @method getDuration
     * @returns {Number}
     */
    getDuration () {
        if (this._impl) {
            return this._impl.duration();
        }
        return -1;
    },

    /**
     * !#en Determine whether video is playing or not.
     * !#zh 判断当前视频是否处于播放状态
     * @method isPlaying
     * @returns {Boolean}
     */
    isPlaying () {
        if (this._impl) {
            return this._impl.isPlaying();
        }
        return false;
    }

    /**
     * !#en if you don't need the VideoPlayer and it isn't in any running Scene, you should
     * call the destroy method on this component or the associated node explicitly.
     * Otherwise, the created DOM element won't be removed from web page.
     * !#zh
     * 如果你不再使用 VideoPlayer，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
     * 这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
     * @example
     * videoplayer.node.parent = null;  // or  videoplayer.node.removeFromParent(false);
     * // when you don't need videoplayer anymore
     * videoplayer.node.destroy();
     * @method destroy
     * @return {Boolean} whether it is the first time the destroy being called
     */
});

cc.VideoPlayer = module.exports = VideoPlayer;

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event ready-to-play
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event meta-loaded
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event clicked
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */


/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event playing
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event paused
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event stopped
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event completed
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */
