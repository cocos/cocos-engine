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

import { legacyCC } from '../../core/global-exports';
import { mat4 } from "../../core/math";
import { error, sys } from "../../core/platform";
import { UITransform } from "../../core/components/ui-base";
import { VideoPlayer } from "../video-player";
import { contains } from '../../core/utils/misc';

const { game, Game, view, screen, visibleRect } = legacyCC;

const MIN_ZINDEX = -Math.pow(2, 15);

let _mat4_temp = mat4();

const READY_STATE = {
    HAVE_NOTHING: 0,      // 没有关于音频/视频是否就绪的信息
    HAVE_METADATA: 1,     // 关于音频/视频就绪的元数据
    HAVE_CURRENT_DATA: 2, // 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
    HAVE_FUTURE_DATA: 3,  // 当前及至少下一帧的数据是可用的
    HAVE_ENOUGH_DATA: 4   // 可用数据足以开始播放
};

export enum EventType {
    NONE,           //- 无
    PLAYING,        //- 视频播放中
    PAUSED,         //- 视频暂停中
    STOPPED,        //- 视频停止中
    COMPLETED,      //- 视频播放完毕
    META_LOADED,    //- 视频元数据加载完毕
    READY_TO_PLAY,  //- 视频加载完毕可播放
    ERROR,          //- 视频错误
}

/**
 * @category component/video
 */

export class VideoPlayerImpl {

    protected _eventList: Map<number, Function> = new Map<number, Function>();
    protected _state = EventType.NONE;
    protected _video: any;

    protected _onHide: Function;
    protected _onShow: Function;
    protected _interrupted = false;

    protected _loaded = false;
    protected _loadedMeta = false;
    protected _ignorePause = false;
    protected _waitingFullscreen = false;
    protected _fullScreenOnAwake = false;

    protected _videoComponent: VideoPlayer | null = null;
    protected _uiTrans: UITransform | null = null;

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

    protected _clearColorA = -1;

    protected _loadedMetadataCb: (e) => void;
    protected _canplayCb: (e) => void;
    protected _playCb: (e) => void;
    protected _pauseCb: (e) => void;
    protected _playingCb: (e) => void;
    protected _endedCb: (e) => void;
    protected _errorCb: (e) => void;

    constructor (component) {
        this._videoComponent = component;
        this._uiTrans = component.node.getComponent(UITransform);
        this._onHide = () => {
            if (!this.video || this._state !== EventType.PLAYING) { return; }
            this.video.pause();
            this._interrupted = true;
        };
        this._onShow = () => {
            if (!this._interrupted || !this.video) { return; }
            this.video.play();
            this._interrupted = false;
        };
        /* handle hide & show */
        game.on(Game.EVENT_HIDE, this._onHide);
        game.on(Game.EVENT_SHOW, this._onShow);

        this._loadedMetadataCb = (e) => {
            this._forceUpdate = true;
            this._loadedMeta = true;
            this.syncTrans(e.target.videoWidth, e.target.videoHeight);
            if (this._waitingFullscreen) {
                this._waitingFullscreen = false;
                this._toggleFullscreen(true);
            }
            this._dispatchEvent(EventType.META_LOADED);
        };

        this._canplayCb = (e) => {
            if (this._loaded) {
                return;
            }
            switch (e.target.readyState) {
                case READY_STATE.HAVE_METADATA:
                case READY_STATE.HAVE_ENOUGH_DATA: {
                    this._loaded = true;
                    this._dispatchEvent(EventType.READY_TO_PLAY);
                    break;
                }
            }
        };

        this._playCb = (e) => {
            this._dispatchEvent(EventType.PLAYING);
        };

        this._pauseCb = (e) => {
            if (this._ignorePause) {
                this._ignorePause = false;
            }
            else {
                this._dispatchEvent(EventType.PAUSED);
            }
        };

        this._playingCb = (e) => {
            this._dispatchEvent(EventType.PLAYING);
        };

        this._endedCb = (e) => {
            this._dispatchEvent(EventType.COMPLETED);
        };

        this._errorCb = (e) => {
            this._dispatchEvent(EventType.ERROR);
            let errorObj = e.target.error;
            if (errorObj) {
                error("Error " + errorObj.code + "; details: " + errorObj.message);
            }
        };
    }

    _toggleFullscreen (enabled) {
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

    get fullScreenOnAwake () {
        return this._fullScreenOnAwake;
    }

    get loaded () {
        return this._loaded;
    }

    get eventList () {
        return this._eventList;
    }

    get video () {
        return this._video;
    }

    get state () {
        return this._state;
    }

    protected _dispatchEvent (key) {
        let callback = this._eventList.get(key);
        if (callback) {
            this._state = key;
            callback.call(this);
        }
    }

    protected syncTrans (width, height) {
        if (this._uiTrans) {
            this._uiTrans.width = width;
            this._uiTrans.height = height
        }
    }

    public play () {
        if (this.video) {
            let promise = this.video.play();
            // the play API can only be initiated by user gesture.
            if (window.Promise && promise instanceof Promise) {
                promise.catch(error => {
                    // Auto-play was prevented
                    // Show a UI element to let the user manually start playback
                }).then(() => {
                    // Auto-play started
                });
            }
        }
    }

    public pause () {
        if (this.video) {
            this.video.pause();
        }
    }

    public stop () {
        if (this.video) {
            this._ignorePause = true;
            this.video.currentTime = 0;
            this.video.pause();
            setTimeout(() => {
                this._ignorePause = false;
                this._dispatchEvent(EventType.STOPPED);
            }, 0)
        }
    }

    public syncClip (clip) {
        this.removeDom();
        if (!clip) { return; }
        this.appendDom(clip._nativeAsset);
    }

    public syncURL (url) {
        this.removeDom();
        if (!url) { return; }
        this.appendDom(document.createElement('video'), url);
    }

    public syncFullScreenOnAwake (enabled) {
        if (!this._loadedMeta && enabled) {
            this._waitingFullscreen = true;
        }
        else {
            this._toggleFullscreen(enabled);
        }
    }

    public syncStayOnBottom (enabled) {
        if (this._video) {
            this._video.style['z-index'] = enabled ? MIN_ZINDEX : 0;
            this._stayOnBottom = enabled;
        }
        this._dirty = true;
    }

    public removeDom () {
        let video = this._video;
        if (contains(game.container, video)) {
            game.container.removeChild(video);
            this._removeEvent();
        }
        this._loaded = false;
        this._video = null;
    }

    public appendDom (video, url?) {
        this._video = video;
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
        this._bindEvent();
        game.container.appendChild(video);
        if (url) {
            let source = document.createElement("source");
            source.src = url;
            video.appendChild(source);
        }
        else {
            this.syncTrans(video.videoWidth, video.videoHeight);
        }
    }

    public _removeEvent () {
        let video = this._video;
        video.removeEventListener('loadedmetadata', this._loadedMetadataCb);
        video.removeEventListener('canplay', this._canplayCb);
        video.removeEventListener('canplaythrough', this._canplayCb);
        video.removeEventListener('play', this._playCb);
        video.removeEventListener('pause', this._pauseCb);
        video.removeEventListener('playing', this._playingCb);
        video.removeEventListener('ended', this._endedCb);
        video.removeEventListener('error', this._errorCb);
    }

    public _bindEvent () {
        let video = this._video;
        video.addEventListener('loadedmetadata', this._loadedMetadataCb);
        video.addEventListener('canplay', this._canplayCb);
        video.addEventListener('canplaythrough', this._canplayCb);
        video.addEventListener('play', this._playCb);
        video.addEventListener('pause', this._pauseCb);
        video.addEventListener('playing', this._playingCb);
        video.addEventListener('ended', this._endedCb);
        video.addEventListener('error', this._errorCb);
    }

    public enable () {
        if (this._video) {
            this._video.style.visibility = 'visible';
        }
    }

    public disable () {
        if (this._video) {
            this._video.style.visibility = 'hidden';
            this._video.pause();
        }
    }

    public destroy () {
        this.removeDom();
        this._eventList.clear();
        game.off(Game.EVENT_HIDE, this._onHide);
        game.off(Game.EVENT_SHOW, this._onShow);
    }

    syncSize (w, h) {
        let video = this._video;
        if (!video) return;

        video.style.width = w + 'px';
        video.style.height = h + 'px';
    }

    getUICamera () {
        if (!this._uiTrans || !this._uiTrans._canvas) {
            return null;
        }
        return this._uiTrans._canvas.camera;
    }

    public syncMatrix () {
        if (!this._video || this._video.style.visibility === 'hidden' || !this._videoComponent) return;

        const camera = this.getUICamera();
        if (!camera) {
            return;
        }

        if (screen.fullScreen()) {
            return;
        }

        // use stayOnBottom
        if (this._dirty) {
            this._dirty = false;
            let clearColor = camera.clearColor;
            if (this._clearColorA === -1) {
                this._clearColorA = clearColor.a;
            }
            clearColor.a = this._stayOnBottom ? 0 : this._clearColorA;
            camera.clearColor = clearColor;
        }

        this._videoComponent.node.getWorldMatrix(_mat4_temp);
        camera.update(true);
        camera.worldMatrixToScreen(_mat4_temp, _mat4_temp, game.canvas.width, game.canvas.height);

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

        let dpr = view._devicePixelRatio;
        let scaleX = 1 / dpr;
        let scaleY = 1 / dpr;

        let container = game.container;
        let sx = _mat4_temp.m00 * scaleX, b = _mat4_temp.m01, c = _mat4_temp.m04, sy = _mat4_temp.m05 * scaleY;

        let w, h;
        w = this._w * scaleX;
        h = this._h * scaleY;
        this.syncSize(this._w, this._h);

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

legacyCC.internal.VideoPlayerImpl = VideoPlayerImpl;
