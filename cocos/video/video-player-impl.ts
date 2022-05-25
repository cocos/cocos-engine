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

import { legacyCC } from '../core/global-exports';
import { UITransform } from '../2d/framework';
import { VideoPlayer } from './video-player';
import { EventType } from './video-player-enums';
import { error } from '../core/platform';
import { director } from '../core/director';
import { Node } from '../core/scene-graph';

export abstract class VideoPlayerImpl {
    protected _componentEventList: Map<string, () => void> = new Map();
    protected _state = EventType.NONE;
    protected _video: HTMLVideoElement | null = null;

    protected _onHide: () => void;
    protected _onShow: () => void;
    protected _interrupted = false;

    protected _loaded = false;
    protected _loadedMeta = false;
    protected _ignorePause = false;
    protected _fullScreenOnAwake = false;

    protected _visible = true;

    protected _playing = false;
    protected _cachedCurrentTime = -1;

    protected _waitingFullscreen = false;
    protected _waitingPlay = false;

    protected _keepAspectRatio = false;

    protected _component: VideoPlayer | null = null;
    protected _uiTrans: UITransform | null = null;
    protected _node: Node | null = null;

    protected _stayOnBottom = false;
    protected _dirty = false;
    protected _forceUpdate = false;
    protected _w = 0;
    protected _h = 0;
    protected _m00 = 0;
    protected _m01 = 0;
    protected _m04 = 0;
    protected _m05 = 0;
    protected _m12 = 0;
    protected _m13 = 0;

    constructor (component) {
        this._component = component;
        this._node = component.node;
        this._uiTrans = component.node.getComponent(UITransform);
        this._onHide = () => {
            if (!this.video || this._state !== EventType.PLAYING) { return; }
            this.video.pause();
            this._interrupted = true;
        };
        this._onShow = () => {
            if (!this._interrupted || !this.video) { return; }
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.video.play();
            this._interrupted = false;
        };
        /* handle hide & show */
        legacyCC.game.on(legacyCC.Game.EVENT_HIDE, this._onHide);
        legacyCC.game.on(legacyCC.Game.EVENT_SHOW, this._onShow);
    }

    //
    public abstract canPlay(): void;
    public abstract canFullScreen(enabled: boolean): void;

    public abstract pause (): void;
    public abstract resume(): void;
    public abstract stop (): void;
    public abstract seekTo(val: number): void;

    //
    public abstract createVideoPlayer(url: string): void;
    public abstract removeVideoPlayer(): void;
    public abstract enable(): void;
    public abstract disable(noPause?: boolean): void;

    // synchronizing video player data
    public abstract syncClip(clip: any): void;
    public abstract syncURL(url: string): void;
    public abstract syncStayOnBottom(enabled: boolean): void;
    public abstract syncKeepAspectRatio(enabled: boolean): void;
    public abstract syncPlaybackRate(val: number): void;
    public abstract syncVolume(val: number): void;
    public abstract syncMute(enabled: boolean): void;
    public abstract syncLoop(enabled: boolean):void
    public abstract syncMatrix(): void;

    // get video player data
    public abstract getDuration(): number;
    public abstract getCurrentTime(): number;
    public get fullScreenOnAwake () { return this._fullScreenOnAwake; }
    public get loaded () { return this._loaded; }
    public get componentEventList () { return this._componentEventList; }
    public get video () { return this._video; }
    public get state () { return this._state; }
    public get isPlaying () { return this._playing; }
    get UICamera () {
        return director.root!.batcher2D.getFirstRenderCamera(this._node!);
    }

    // video player event
    public onLoadedMetadata (e: Event) {
        this._loadedMeta = true;
        this._forceUpdate = true;
        if (this._visible) {
            this.enable();
        } else {
            this.disable();
        }
        this.dispatchEvent(EventType.META_LOADED);
        const video = e.target as HTMLVideoElement;
        if (this._keepAspectRatio && video) {
            this.syncUITransform(video.videoWidth, video.videoHeight);
        }
        this.delayedFullScreen();
        this.delayedPlay();
    }

    public onCanPlay (e: Event) {
        this._loaded = true;
        this.dispatchEvent(EventType.READY_TO_PLAY);
    }

    public onPlay (e: Event) {
        this._playing = true;
        this.dispatchEvent(EventType.PLAYING);
    }

    public onPlaying (e: Event) {
        this.dispatchEvent(EventType.PLAYING);
    }

    public onPause (e: Event) {
        if (this._ignorePause) {
            this._ignorePause = false;
            return;
        }
        this._playing = false;
        this.dispatchEvent(EventType.PAUSED);
    }

    public onStoped (e: Event) {
        this._playing = false;
        this._ignorePause = false;
        this.dispatchEvent(EventType.STOPPED);
    }

    public onEnded (e: Event) {
        this.dispatchEvent(EventType.COMPLETED);
    }

    public onClick (e: Event) {
        this.dispatchEvent(EventType.CLICKED);
    }

    public onError (e: Event) {
        this.dispatchEvent(EventType.ERROR);
        const video = e.target as HTMLVideoElement;
        if (video && video.error) {
            error(`Error ${video.error.code}; details: ${video.error.message}`);
        }
    }

    //
    public play () {
        if (this._loadedMeta || this._loaded) {
            this.canPlay();
        } else {
            this._waitingPlay = true;
        }
    }

    public delayedPlay () {
        if (this._waitingPlay) {
            this.canPlay();
            this._waitingPlay = false;
        }
    }

    public syncFullScreenOnAwake (enabled: boolean) {
        this._fullScreenOnAwake = enabled;
        if (this._loadedMeta || this._loaded) {
            this.canFullScreen(enabled);
        } else {
            this._waitingFullscreen = true;
        }
    }

    public delayedFullScreen () {
        if (this._waitingFullscreen) {
            this.canFullScreen(this._fullScreenOnAwake);
            this._waitingFullscreen = false;
        }
    }

    protected dispatchEvent (key) {
        const callback = this._componentEventList.get(key);
        if (callback) {
            this._state = key;
            callback.call(this);
        }
    }

    protected syncUITransform (width, height) {
        if (this._uiTrans) {
            this._uiTrans.width = width;
            this._uiTrans.height = height;
        }
    }

    protected syncCurrentTime () {
        if (!this.video) {
            return;
        }
        if (this._cachedCurrentTime !== -1 && this.video.currentTime !== this._cachedCurrentTime) {
            this.seekTo(this._cachedCurrentTime);
            this._cachedCurrentTime = -1;
        }
    }

    public destroy () {
        this.removeVideoPlayer();
        this._componentEventList.clear();
        legacyCC.game.off(legacyCC.Game.EVENT_HIDE, this._onHide);
        legacyCC.game.off(legacyCC.Game.EVENT_SHOW, this._onShow);
    }
}

legacyCC.internal.VideoPlayerImpl = VideoPlayerImpl;
