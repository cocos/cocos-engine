/*
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
 */

/**
 * @packageDocumentation
 * @module component/video
 */

import { ccclass, displayOrder, executeInEditMode, help, menu, slide, range, requireComponent, tooltip, type, serializable } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { warn } from '../core/platform';
import { Component, EventHandler as ComponentEventHandler } from '../core/components';
import { UITransform } from '../2d/framework';
import { clamp } from '../core/math';
import { VideoClip } from './assets/video-clip';
import { VideoPlayerImplManager } from './video-player-impl-manager';
import { EventType, ResourceType } from './video-player-enums';
import { legacyCC } from '../core/global-exports';
import { VideoPlayerImplWeb } from './video-player-impl-web';

/**
 * @en
 * VideoPlayer is a component for playing videos, you can use it for showing videos in your game.
 * Because different platforms have different authorization, API and control methods for VideoPlayer component.
 * And have not yet formed a unified standard, only Web, iOS, and Android platforms are currently supported.
 * @zh
 * Video 组件，用于在游戏中播放视频。
 * 由于不同平台对于 VideoPlayer 组件的授权、API、控制方式都不同，还没有形成统一的标准，所以目前只支持 Web、iOS 和 Android 平台。
 */
@ccclass('cc.VideoPlayer')
@help('i18n:cc.VideoPlayer')
@menu('Video/VideoPlayer')
@requireComponent(UITransform)
@executeInEditMode
export class VideoPlayer extends Component {
    @serializable
    protected _resourceType = ResourceType.LOCAL;
    @serializable
    protected _remoteURL = '';
    @type(VideoClip)
    @serializable
    protected _clip: VideoClip | null = null;
    @serializable
    protected _playOnAwake = true;
    @serializable
    protected _volume = 1.0;
    @serializable
    protected _mute = false;
    @serializable
    protected _playbackRate = 1;
    @serializable
    protected _loop = false;
    @serializable
    protected _fullScreenOnAwake = false;
    @serializable
    protected _stayOnBottom = false;
    @serializable
    protected _keepAspectRatio = true;

    protected _impl: VideoPlayerImplWeb | null = null;
    protected _cachedCurrentTime = 0;

    /**
     * @en
     * The resource type of video player, REMOTE for remote url and LOCAL for local file path.
     * @zh
     * 视频来源：REMOTE 表示远程视频 URL，LOCAL 表示本地视频地址。
     */
    @type(ResourceType)
    @tooltip('i18n:videoplayer.resourceType')
    get resourceType () {
        return this._resourceType;
    }
    set resourceType (val) {
        if (this._resourceType !== val) {
            this._resourceType = val;
            this.syncSource();
        }
    }

    /**
     * @en
     * The remote URL of video.
     * @zh
     * 远程视频的 URL
     */
    @tooltip('i18n:videoplayer.remoteURL')
    get remoteURL () {
        return this._remoteURL;
    }
    set remoteURL (val: string) {
        if (this._remoteURL !== val) {
            this._remoteURL = val;
            this.syncSource();
        }
    }

    /**
     * @en
     * The local video clip
     * @zh
     * 本地视频剪辑。
     */
    @type(VideoClip)
    @tooltip('i18n:videoplayer.clip')
    get clip () {
        return this._clip;
    }
    set clip (val) {
        if (this._clip !== val) {
            this._clip = val;
            this.syncSource();
        }
    }

    /**
     * @en
     * Whether the video start playing automatically after loaded?
     * @zh
     * 视频加载后是否自动开始播放？
     */
    @tooltip('i18n:videoplayer.playOnAwake')
    get playOnAwake () {
        return this._playOnAwake;
    }
    set playOnAwake (value) {
        this._playOnAwake = value;
    }

    /**
     * @en
     * The Video playback rate
     * @zh
     * 视频播放时的速率（0.0 ~ 10.0）
     */
    @slide
    @range([0.0, 10, 1.0])
    @tooltip('i18n:videoplayer.playbackRate')
    get playbackRate () {
        return this._playbackRate;
    }
    set playbackRate (value: number) {
        this._playbackRate = value;
        if (this._impl) {
            this._impl.syncPlaybackRate(value);
        }
    }

    /**
     * @en
     * The volume of the video.
     * @zh
     * 视频的音量（0.0 ~ 1.0）
     */
    @slide
    @range([0.0, 1.0, 0.1])
    @tooltip('i18n:videoplayer.volume')
    get volume () {
        return this._volume;
    }
    set volume (value: number) {
        this._volume = value;
        if (this._impl) {
            this._impl.syncVolume(value);
        }
    }

    /**
     * @en
     * Mutes the VideoPlayer. Mute sets the volume=0, Un-Mute restore the original volume.
     * @zh
     * 是否静音视频。静音时设置音量为 0，取消静音是恢复原来的音量。
     */
    @tooltip('i18n:videoplayer.mute')
    get mute () {
        return this._mute;
    }
    set mute (value) {
        this._mute = value;
        if (this._impl) {
            this._impl.syncMute(value);
        }
    }

    /**
     * @en
     * Whether the video should be played again at the end
     * @zh
     * 视频是否应在结束时再次播放
     */
    @tooltip('i18n:videoplayer.loop')
    get loop () {
        return this._loop;
    }
    set loop (value) {
        this._loop = value;
        if (this._impl) {
            this._impl.syncLoop(value);
        }
    }

    /**
     * @en
     * Whether keep the aspect ration of the original video.
     * @zh
     * 是否保持视频原来的宽高比
     */
    @tooltip('i18n:videoplayer.keepAspectRatio')
    get keepAspectRatio () {
        return this._keepAspectRatio;
    }
    set keepAspectRatio (value) {
        if (this._keepAspectRatio !== value) {
            this._keepAspectRatio = value;
            if (this._impl) {
                this._impl.syncKeepAspectRatio(value);
            }
        }
    }

    /**
     * @en
     * Whether play video in fullscreen mode.
     * @zh
     * 是否全屏播放视频
     */
    @tooltip('i18n:videoplayer.fullScreenOnAwake')
    get fullScreenOnAwake () {
        if (!EDITOR) {
            if (this._impl) {
                this._fullScreenOnAwake = this._impl.fullScreenOnAwake;
                return this._fullScreenOnAwake;
            }
        }
        return this._fullScreenOnAwake;
    }
    set fullScreenOnAwake (value: boolean) {
        if (this._fullScreenOnAwake !== value) {
            this._fullScreenOnAwake = value;
            if (this._impl) {
                this._impl.syncFullScreenOnAwake(value);
            }
        }
    }

    /**
     * @en
     * Always below the game view (only useful on Web.
     * Note: The specific effects are not guaranteed to be consistent, depending on whether each browser supports or restricts).
     * @zh
     * 永远在游戏视图最底层（这个属性只有在 Web 平台上有效果。注意：具体效果无法保证一致，跟各个浏览器是否支持与限制有关）
     */
    @tooltip('i18n:videoplayer.stayOnBottom')
    get stayOnBottom () {
        return this._stayOnBottom;
    }
    set stayOnBottom (value: boolean) {
        if (this._stayOnBottom !== value) {
            this._stayOnBottom = value;
            if (this._impl) {
                this._impl.syncStayOnBottom(value);
            }
        }
    }

    public static EventType = EventType;
    public static ResourceType = ResourceType;

    /**
     * @en
     * The video player's callback, it will be triggered when certain event occurs, like: playing, paused, stopped and completed.
     * @zh
     * 视频播放回调函数，该回调函数会在特定情况被触发，比如播放中，暂时，停止和完成播放。
     */
    @serializable
    @type([ComponentEventHandler])
    @displayOrder(20)
    @tooltip('i18n:videoplayer.videoPlayerEvent')
    public videoPlayerEvent: ComponentEventHandler[] = [];

    /**
     * @en
     * Raw video objects for user customization
     * @zh
     * 原始视频对象，用于用户定制
     */
    get nativeVideo () {
        return (this._impl && this._impl.video) || null;
    }

    /**
     * @en
     * The current playback time of the now playing item in seconds, you could also change the start playback time.
     * @zh
     * 指定视频从什么时间点开始播放，单位是秒，也可以用来获取当前视频播放的时间进度。
     */
    get currentTime () {
        if (!this._impl) { return this._cachedCurrentTime; }
        return this._impl.getCurrentTime();
    }
    set currentTime (val: number) {
        if (Number.isNaN(val)) { warn(`illegal video time! value:${val}`); return; }
        val = clamp(val, 0, this.duration);
        this._cachedCurrentTime = val;
        if (this._impl) {
            this._impl.seekTo(val);
        }
    }

    /**
     * @en
     * Get the audio duration, in seconds.
     * @zh
     * 获取以秒为单位的视频总时长。
     */
    get duration () {
        if (!this._impl) { return 0; }
        return this._impl.getDuration();
    }

    /**
     * @en
     * Get current audio state.
     * @zh
     * 获取当前视频状态。
     */
    get state () {
        if (!this._impl) { return EventType.NONE; }
        return this._impl.state;
    }

    /**
     * @en
     * Is the audio currently playing?
     * @zh
     * 当前视频是否正在播放？
     */
    get isPlaying () {
        if (!this._impl) { return false; }
        return this._impl.isPlaying;
    }

    protected syncSource () {
        if (!this._impl) { return; }
        if (this._resourceType === ResourceType.REMOTE) {
            this._impl.syncURL(this._remoteURL);
        } else {
            this._impl.syncClip(this._clip);
        }
    }

    public __preload () {
        if (EDITOR) {
            return;
        }
        this._impl = VideoPlayerImplManager.getImpl(this);
        this.syncSource();
        this._impl.syncLoop(this._loop);
        this._impl.syncVolume(this._volume);
        this._impl.syncMute(this._mute);
        this._impl.seekTo(this._cachedCurrentTime);
        this._impl.syncPlaybackRate(this._playbackRate);
        this._impl.syncStayOnBottom(this._stayOnBottom);
        this._impl.syncKeepAspectRatio(this._keepAspectRatio);
        this._impl.syncFullScreenOnAwake(this._fullScreenOnAwake);
        //
        this._impl.componentEventList.set(EventType.META_LOADED, this.onMetaLoaded.bind(this));
        this._impl.componentEventList.set(EventType.READY_TO_PLAY, this.onReadyToPlay.bind(this));
        this._impl.componentEventList.set(EventType.PLAYING, this.onPlaying.bind(this));
        this._impl.componentEventList.set(EventType.PAUSED, this.onPaused.bind(this));
        this._impl.componentEventList.set(EventType.STOPPED, this.onStopped.bind(this));
        this._impl.componentEventList.set(EventType.COMPLETED, this.onCompleted.bind(this));
        this._impl.componentEventList.set(EventType.ERROR, this.onError.bind(this));
        if (this._playOnAwake && this._impl.loaded) {
            this.play();
        }
    }

    public onEnable () {
        if (this._impl) {
            this._impl.enable();
        }
    }

    public onDisable () {
        if (this._impl) {
            this._impl.disable();
        }
    }

    public onDestroy () {
        if (this._impl) {
            this._impl.destroy();
            this._impl = null;
        }
    }

    public update (dt: number) {
        if (this._impl) {
            this._impl.syncMatrix();
        }
    }

    public onMetaLoaded () {
        ComponentEventHandler.emitEvents(this.videoPlayerEvent, this, EventType.META_LOADED);
        this.node.emit('meta-loaded', this);
    }

    public onReadyToPlay () {
        if (this._playOnAwake && !this.isPlaying) { this.play(); }
        ComponentEventHandler.emitEvents(this.videoPlayerEvent, this, EventType.READY_TO_PLAY);
        this.node.emit(EventType.READY_TO_PLAY, this);
    }

    public onPlaying () {
        ComponentEventHandler.emitEvents(this.videoPlayerEvent, this, EventType.PLAYING);
        this.node.emit(EventType.PLAYING, this);
    }

    public onPaused () {
        ComponentEventHandler.emitEvents(this.videoPlayerEvent, this, EventType.PAUSED);
        this.node.emit(EventType.PAUSED, this);
    }

    public onStopped () {
        ComponentEventHandler.emitEvents(this.videoPlayerEvent, this, EventType.STOPPED);
        this.node.emit(EventType.STOPPED, this);
    }

    public onCompleted () {
        ComponentEventHandler.emitEvents(this.videoPlayerEvent, this, EventType.COMPLETED);
        this.node.emit(EventType.COMPLETED, this);
    }

    public onError () {
        ComponentEventHandler.emitEvents(this.videoPlayerEvent, this, EventType.ERROR);
        this.node.emit(EventType.ERROR, this);
    }

    /**
     * @en
     * Play the clip.<br>
     * Restart if already playing.<br>
     * Resume if paused.
     * @zh
     * 开始播放。<br>
     * 如果视频处于正在播放状态，将会重新开始播放视频。<br>
     * 如果视频处于暂停状态，则会继续播放视频。
     */
    public play () {
        if (this._impl) {
            this._impl.play();
        }
    }

    /**
     * @en
     * If a video is paused, call this method to resume playing.
     * @zh
     * 如果一个视频播放被暂停播放了，调用这个接口可以继续播放。
     */
    public resume () {
        if (this._impl) {
            this._impl.resume();
        }
    }

    /**
     * @en
     * Pause the clip.
     * @zh
     * 暂停播放。
     */
    public pause () {
        if (this._impl) {
            this._impl.pause();
        }
    }

    /**
     * @en
     * Stop the clip.
     * @zh
     * 停止播放。
     */
    public stop () {
        if (this._impl) {
            this._impl.stop();
        }
    }
}

// TODO Since jsb adapter does not support import cc, put it on internal first and adjust it later.
legacyCC.internal.VideoPlayer = VideoPlayer;
