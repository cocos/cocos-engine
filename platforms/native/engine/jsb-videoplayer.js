/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

'use strict';

if (cc.internal.VideoPlayer) {

    const { EventType } = cc.internal.VideoPlayer;

    let vec3 = cc.Vec3;
    let mat4 = cc.Mat4;
    let _mat4_temp = new mat4();

    let _topLeft = new vec3();
    let _bottomRight = new vec3();

    cc.internal.VideoPlayerImplManager.getImpl = function(componenet) {
        return new VideoPlayerImplJSB(componenet);
    };

    class VideoPlayerImplJSB extends cc.internal.VideoPlayerImpl {

        constructor(componenet) {
            super(componenet);
            this._matViewProj_temp = new mat4();
        }

        syncClip(clip) {
            this.removeVideoPlayer();
            if (!clip) {
                return;
            }
            this.createVideoPlayer(clip._nativeAsset);
        }

        syncURL(url) {
            this.removeVideoPlayer();
            if (!url) {
                return;
            }
            this.createVideoPlayer(url);
        }

        onCanplay () {
            if (this._loaded) {
                return;
            }
            this._loaded = true;
            this.video.setVisible(this._visible);
            this.dispatchEvent(EventType.READY_TO_PLAY);
            this.delayedPlay();
        }

        _bindEvent() {
            this.video.addEventListener('loadedmetadata', this.onLoadedMetadata.bind(this));
            this.video.addEventListener('suspend', this.onCanPlay.bind(this));
            this.video.addEventListener('play', this.onPlay.bind(this));
            this.video.addEventListener('pause', this.onPause.bind(this));
            this.video.addEventListener('stoped', this.onStoped.bind(this));
            this.video.addEventListener('click', this.onClick.bind(this));
            this.video.addEventListener('ended', this.onEnded.bind(this));
        }

        onLoadedMetadata() {
            this._loadedMeta = true;
            this._forceUpdate = true;
            if (this._visible) {
                this.enable();
            } else {
                this.disable();
            }
            this.dispatchEvent(EventType.META_LOADED);
            this.delayedFullScreen();
            this.delayedPlay();
        }

        createVideoPlayer(url) {
            this._video = new jsb.VideoPlayer();
            this._bindEvent();
            this._video.setVisible(this._visible);
            this._video.setURL(url);
            this._forceUpdate = true;
        }

        removeVideoPlayer() {
            let video = this.video;
            if (video) {
                video.stop();
                video.setVisible(false);
                video.destroy();
                this._playing = false;
                this._loaded = false;
                this._loadedMeta = false;
                this._ignorePause = false;
                this._cachedCurrentTime = 0;
                this._video = null;
            }
        }

        getDuration () {
            if (!this.video) {
                return -1;
            }
            return this.video.duration();
        }

        syncPlaybackRate(value) {
            if (this.video) {
                this.video.setPlaybackRate(value);
            }
        }

        syncVolume() {
            cc.warn('The platform does not support');
        }

        syncMute(enable) {
            if (this.video && this.video.muted !== enable) {
                this.video.setMute(enable);
            }
        }

        syncLoop(enable) {
            if (this.video && this.video.loop !== enable) {
                this.video.setLoop(enable);
            }
        }

        syncStayOnBottom() {
            cc.warn('The platform does not support');
        }

        getCurrentTime() {
            if (this.video) {
                this._cachedCurrentTime = this.video.currentTime();
                return this._cachedCurrentTime;
            }
            return -1;
        }

        seekTo (val) {
            let video = this._video;
            if (!video) return;
            video.seekTo(val);
            this._cachedCurrentTime = val;
        }

        disable(noPause) {
            if (this.video) {
                if (!noPause) {
                    this.video.pause();
                }
                this.video.setVisible(false);
                this._visible = false;
            }
        }

        enable() {
            if (this.video) {
                this.video.setVisible(true);
                this._visible = true;
            }
        }

        canPlay () {
            this.video.play();
            this.syncCurrentTime();
        }

        resume() {
            if (this.video) {
                this.video.resume();
                this.syncCurrentTime();
                this._playing = true;
            }
        }

        pause() {
            if (this.video) {
                this._cachedCurrentTime = this.video.currentTime();
                this.video.pause();
            }
        }

        stop() {
            if (this.video) {
                this._ignorePause = true;
                this.video.seekTo(0);
                this._cachedCurrentTime = 0;
                this.video.stop();
            }
        }

        canFullScreen(enabled) {
            if (this.video) {
                this.video.setFullScreenEnabled(enabled);
            }
        }

        syncKeepAspectRatio(enabled) {
            if (this.video) {
                this.video.setKeepAspectRatioEnabled(enabled);
            }
        }

        syncMatrix() {
            if (!this._video || !this._component || !this._uiTrans) return;

            const camera = this.UICamera;
            if (!camera) {
                return;
            }

            this._component.node.getWorldMatrix(_mat4_temp);
            const { width, height } = this._uiTrans.contentSize;
            if (!this._forceUpdate &&
                camera.matViewProj.equals(this._matViewProj_temp) &&
                this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 &&
                this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 &&
                this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 &&
                this._w === width && this._h === height) {
                return;
            }

            this._matViewProj_temp.set(camera.matViewProj);
            // update matrix cache
            this._m00 = _mat4_temp.m00;
            this._m01 = _mat4_temp.m01;
            this._m04 = _mat4_temp.m04;
            this._m05 = _mat4_temp.m05;
            this._m12 = _mat4_temp.m12;
            this._m13 = _mat4_temp.m13;
            this._w = width;
            this._h = height;

            let canvas_width = cc.game.canvas.width;
            let canvas_height = cc.game.canvas.height;

            let ap = this._uiTrans.anchorPoint;
            // Vectors in node space
            vec3.set(_topLeft, -ap.x * this._w, (1.0 - ap.y) * this._h, 0);
            vec3.set(_bottomRight, (1 - ap.x) * this._w, -ap.y * this._h, 0);
            // Convert to world space
            vec3.transformMat4(_topLeft, _topLeft, _mat4_temp);
            vec3.transformMat4(_bottomRight, _bottomRight, _mat4_temp);
            // need update camera data
            camera.update();
            // Convert to Screen space
            camera.worldToScreen(_topLeft, _topLeft);
            camera.worldToScreen(_bottomRight, _bottomRight);

            let finalWidth = _bottomRight.x - _topLeft.x;
            let finalHeight = _topLeft.y - _bottomRight.y;
            this._video.setFrame(_topLeft.x, canvas_height - _topLeft.y, finalWidth, finalHeight);
            this._forceUpdate = false;
        }
    }
}
