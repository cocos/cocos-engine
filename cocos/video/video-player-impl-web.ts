/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import {mat4} from "../core/math";
import {error, sys, view, screen} from "../core/platform";
import {game} from "../core";
import {contains} from '../core/utils/misc';
import {EventType, READY_STATE} from './video-player-enums';
import {VideoPlayerImpl} from "./video-player-impl";
import {ClearFlag} from "../core/gfx";
import visibleRect from '../core/platform/visible-rect';

const MIN_ZINDEX = -Math.pow(2, 15);

let _mat4_temp = mat4();

/**
 * @category component/video
 */

export class VideoPlayerImplWeb extends VideoPlayerImpl {

    protected _eventList: Map<string, Function> = new Map<string, Function>();

    // use stay on bottom
    protected _clearColorA = -1;
    protected _clearFlag;

    constructor(component) {
        super(component);
    }

    protected addListener(type: string, handler: Function) {
        if (!this._video) {
            return;
        }
        this._eventList.set(type, handler);
        this._video.addEventListener(type, handler);
    }
    protected removeAllListeners() {
        this._eventList.forEach((handler, type) => {
            this._video.removeEventListener(type, handler);
        });
        this._eventList.clear();
    }

    public canPlay() {
        if (this.video) {
            let promise = this.video.play();
            // the play API can only be initiated by user gesture.
            if (window.Promise && promise instanceof Promise) {
                promise.catch(error => {
                    // Auto-play was prevented
                    // Show a UI element to let the user manually start playback
                }).then(() => {
                    // calibration time
                    this.syncCurrentTime();
                });
            }
        }
    }

    public pause() {
        if (this.video) {
            this.video.pause();
            this._cachedCurrentTime = this.video.currentTime;
        }
    }

    public resume() {
        this.play();
    }

    public stop() {
        if (this.video) {
            this._ignorePause = true;
            this.video.currentTime = 0;
            this.video.pause();
            setTimeout(() => {
                this._ignorePause = false;
                this.dispatchEvent(EventType.STOPPED);
            }, 0)
        }
    }

    public syncClip(clip: any) {
        this.removeVideoPlayer();
        if (!clip) { return; }
        this.createVideoPlayer(clip.nativeUrl);
    }

    public syncURL(url: string) {
        this.removeVideoPlayer();
        if (!url) { return; }
        this.createVideoPlayer(url);
    }

    public syncPlaybackRate(val: number) {
        if (sys.browserType === sys.BROWSER_TYPE_UC) {
            console.warn('playbackRate is not supported by the uc mobile browser.');
            return;
        }
        if (this.video) {
            this.video.playbackRate = val;
        }
    }

    public syncVolume(val: number) {
        if (this.video) {
            this.video.volume = val;
        }
    }

    public syncMute(enabled: boolean) {
        if (this.video) {
            this.video.mute = enabled;
        }
    }

    public syncLoop(enabled: boolean) {
        if (this.video) {
            this.video.loop = enabled;
        }
    }

    public getDuration() {
        if (!this.video) {
            return 0;
        }
        return this.video.duration;
    }

    public getCurrentTime() {
        if (this.video) {
            return this.video.currentTime;
        }
        return -1;
    }

    public seekTo (val: number) {
        if (this.video) {
            this.video.currentTime = val;
        }
    }

    canFullScreen (enabled: boolean) {
        let video = this._video;
        if (!video || video.readyState !== READY_STATE.HAVE_ENOUGH_DATA) {
            return;
        }

        if (sys.os === sys.OS_IOS && sys.isBrowser) {
            if (enabled) {
                video.webkitEnterFullscreen && video.webkitEnterFullscreen();
            }
            else {
                video.webkitExitFullscreen && video.webkitExitFullscreen();
            }
            this._fullScreenOnAwake = video.webkitDisplayingFullscreen;
            return;
        }

        // If video does not support native full-screen playback,
        // change to setting the video size to full screen.
        if (!screen.supportsFullScreen) {
            this._fullScreenOnAwake = enabled;
            this._forceUpdate = true;
            this.syncMatrix();
            return;
        }

        if (enabled) {
            // fix IE full screen content is not centered
            if (sys.browserType === sys.BROWSER_TYPE_IE) {
                video.style.transform = '';
            }
            // Monitor video entry and exit full-screen events
            video.setAttribute("x5-video-player-fullscreen", 'true');
            screen.requestFullScreen(video, (document) => {
                let fullscreenElement = sys.browserType === sys.BROWSER_TYPE_IE ? document.msFullscreenElement : document.fullscreenElement;
                this._fullScreenOnAwake = (fullscreenElement === video);
            }, () => {
                this._fullScreenOnAwake = false;
            });
        } else {
            video.removeAttribute("x5-video-player-fullscreen");
            screen.exitFullScreen();
        }
    }

    public syncStayOnBottom (enabled: boolean) {
        if (this._video) {
            this._video.style['z-index'] = enabled ? MIN_ZINDEX : 0;
            this._stayOnBottom = enabled;
        }
        this._dirty = true;
    }

    public syncKeepAspectRatio (enabled: boolean) {
        this._keepAspectRatio = enabled;
        if (enabled && this._loadedMeta) {
            this.syncUITransform(this._video.videoWidth, this._video.videoHeight);
        }
    }

    public removeVideoPlayer () {
        let video = this._video;
        if (contains(game.container, video)) {
            game.container!.removeChild(video);
            this.removeAllListeners();
        }
        this._cachedCurrentTime = 0;
        this._playing = false;
        this._loaded = false;
        this._loadedMeta = false;
        this._video = null;

    }

    public createVideoPlayer (url: string) {
        const video = this._video = document.createElement('video');
        video.className = "cocosVideo";
        video.style.visibility = 'hidden';
        video.style.position = "absolute";
        video.style.bottom = "0px";
        video.style.left = "0px";
        // video.style['object-fit'] = 'none';
        video.style['transform-origin'] = '0px 100% 0px';
        video.style['-webkit-transform-origin'] = '0px 100% 0px';
        video.setAttribute('preload', 'auto');
        video.setAttribute('webkit-playsinline', '');
        // This x5-playsinline tag must be added, otherwise the play, pause events will only fire once, in the qq browser.
        video.setAttribute("x5-playsinline", '');
        video.setAttribute('playsinline', '');
        this._bindDomEvent();
        game.container!.appendChild(video);
        let source = document.createElement("source");
        video.appendChild(source);
        source.src = url;
    }

    protected _bindDomEvent () {
        let video = this._video;
        this.addListener('loadedmetadata', this.onLoadedMetadata.bind(this));
        this.addListener('canplay', this.onCanPlay.bind(this));
        this.addListener('canplaythrough', this.onCanPlay.bind(this));
        this.addListener('play', this.onPlay.bind(this));
        this.addListener('playing', this.onPlaying.bind(this));
        this.addListener('pause', this.onPause.bind(this));
        this.addListener('click', this.onClick.bind(this));
        this.addListener('ended', this.onEnded.bind(this));
        this.addListener('error', this.onError.bind(this));
    }

    public onCanPlay(e) {
        if (this._loaded) {
            return;
        }
        switch (e.target.readyState) {
            case READY_STATE.HAVE_METADATA:
            case READY_STATE.HAVE_ENOUGH_DATA: {
                super.onCanPlay(e);
                break;
            }
        }
    }

    public enable () {
        if (this._video) {
            this._visible = true;
            if (this._video.style.visibility === 'visible') {
                return;
            }
            this._video.style.visibility = 'visible';
        }
    }

    public disable (noPause?: boolean) {
        if (this._video) {
            if (!noPause && this._playing) {
                this._video.pause();
            }
            this._visible = false;
            if (this._video.style.visibility === 'hidden') {
                return;
            }
            this._video.style.visibility = 'hidden';
        }
    }

    public syncMatrix () {
        if (!this._video || !this._visible || !this._component) return;

        const canvas = this.UICanvas;
        if (!canvas) {
            return;
        }
        const camera = canvas.camera;
        if (!camera) {
            return;
        }

        if (screen.fullScreen()) {
            return;
        }

        // use stayOnBottom
        if (this._dirty) {
            this._dirty = false;
            if (this._stayOnBottom) {
                this._clearColorA = canvas.color.a;
                this._clearFlag = canvas.clearFlag;
                canvas.color.a = 0;
                canvas.clearFlag = ClearFlag.ALL;
            }
            else {
                if (this._clearFlag) {
                    canvas.color.a = this._clearColorA;
                    canvas.clearFlag = this._clearFlag;
                    this._clearColorA = -1;
                    this._clearFlag = null;
                }
            }
        }

        this._component.node.getWorldMatrix(_mat4_temp);
        camera.update(true);
        camera.worldMatrixToScreen(_mat4_temp, _mat4_temp, game.canvas!.width, game.canvas!.height);

        let width = 0, height = 0;
        if (this._fullScreenOnAwake) {
            width = visibleRect.width;
            height = visibleRect.height;
        }
        else {
            width = this._uiTrans!.contentSize.width;
            height = this._uiTrans!.contentSize.height;
        }

        if (!this._forceUpdate &&
            this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 &&
            this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 &&
            this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 &&
            this._w === width && this._h === height) {
            return;
        }

        // update matrix cache
        this._m00 = _mat4_temp.m00;
        this._m01 = _mat4_temp.m01;
        this._m04 = _mat4_temp.m04;
        this._m05 = _mat4_temp.m05;
        this._m12 = _mat4_temp.m12;
        this._m13 = _mat4_temp.m13;
        this._w = width;
        this._h = height;

        let dpr = view.getDevicePixelRatio();
        let scaleX = 1 / dpr;
        let scaleY = 1 / dpr;

        let container = game.container;
        let sx = _mat4_temp.m00 * scaleX, b = _mat4_temp.m01, c = _mat4_temp.m04, sy = _mat4_temp.m05 * scaleY;

        let w, h;
        this._video.style.width = this._w + 'px';
        this._video.style.height = this._h + 'px';

        if (sys.browserType !== sys.BROWSER_TYPE_MOBILE_QQ) {
            this._video.style.objectFit = this._keepAspectRatio ? 'none' : 'fill';
        }
        else {
            console.warn('keepAspectRatio is not supported by the qq mobile browser.');
        }

        w = this._w * scaleX;
        h = this._h * scaleY;

        const { x, y } = this._uiTrans!.anchorPoint;
        let appx = (w * _mat4_temp.m00) * x;
        let appy = (h * _mat4_temp.m05) * y;

        let offsetX = container && container.style.paddingLeft ? parseInt(container.style.paddingLeft) : 0;
        let offsetY = container && container.style.paddingBottom ? parseInt(container.style.paddingBottom) : 0;
        let tx = _mat4_temp.m12 * scaleX - appx + offsetX, ty = _mat4_temp.m13 * scaleY - appy + offsetY;

        let matrix = "matrix(" + sx + "," + -b + "," + -c + "," + sy + "," + tx + "," + -ty + ")";
        this._video.style['transform'] = matrix;
        this._video.style['-webkit-transform'] = matrix;
        // video style would change when enter fullscreen on IE
        // there is no way to add fullscreenchange event listeners on IE so that we can restore the cached video style
        if (sys.browserType !== sys.BROWSER_TYPE_IE) {
            this._forceUpdate = false;
        }
    }
}

