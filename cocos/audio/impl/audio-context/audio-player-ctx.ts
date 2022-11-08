/*
Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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
import { minigame } from 'pal/minigame';
import { DynamicPath, Playable, stateGraph, AudioAction } from '../playable';
import { AudioClip } from '../../audio-clip';
import { EventTarget } from '../../../core/event';
import { AudioEvent, AudioState } from '../../type';
import { Director, director } from '../../../game';
import { clamp, clamp01 } from '../../../core';
import { audioPool } from './audio-pool-ctx';

export function playOneShot (clip: AudioClip, volumeScale: number) {
    const ctx = audioPool.alloc(clip.nativeUrl);
    ctx.volume = volumeScale;
    ctx.onEnded(() => {
        audioPool.dealloc(clip.nativeUrl, ctx);
    });
    ctx.play();
}
export class AudioPlayerCtx extends DynamicPath<AudioState, AudioAction> implements Playable  {
    // override properties.
    _innerOperation (action: AudioAction) {
        this._isTranslating = true;
        switch (action) {
        case AudioAction.PLAY:
            this._ctx.play();
            if (this._cachedCurrentTime) {
                this._ctx.seek(this._cachedCurrentTime);
            }
            break;
        case AudioAction.PAUSE:
            this._ctx.pause();
            break;
        case AudioAction.STOP:
            this._ctx.stop();
            break;
        default:
            console.warn('Action is invalid, unable to act');
            break;
        }
    }
    private _onInnerOperationEnd () {
        this._isTranslating = false;
        this._applyOnePath();
    }
    set clip (clip: AudioClip) {
        this._innerOperation(AudioAction.STOP);
        this._clip = clip;
        this._ctx.src = this._clip.nativeUrl;
        this._isTranslating = true; // Untill can play, all operations will be processed.
    }
    get clip (): AudioClip {
        return this._clip;
    }
    set loop (loop: boolean) {
        this._loop = loop;
        this._ctx.loop = loop;
    }
    get loop (): boolean {
        return this._loop;
    }
    get duration (): number {
        return this._clip.getDuration();
    }
    set currentTime (time: number) {
        time = clamp(time, 0, this.duration);
        this._cachedCurrentTime = time;
        if (this.state == AudioState.PLAYING) {
            this._ctx.seek(time);
        }
    }
    get currentTime (): number {
        if (this.state == AudioState.PLAYING) {
            // State unchanging, still playing
            return this._ctx.currentTime;
        }
        return this._cachedCurrentTime;
    }
    set playbackRate (rate: number) {
        console.error('PlaybackRate setting is not support on this platform');
    }
    get playbackRate (): number {
        console.error('PlaybackRate setting is not support on this platform');
        return 1;
    }
    set pan (pan: number) {
        console.error('Pan setting is not support on this platform');
    }
    get pan (): number {
        console.error('Pan setting is not support on this platform');
        return 0;
    }
    get state (): AudioState {
        return this._node;
    }
    set volume (val: number) {
        val = clamp01(val);
        this._ctx.volume = val;
    }
    get volume (): number {
        return this._ctx.volume;
    }
    play () {
        this._eventTarget.emit(AudioEvent.PLAYED);
        if (this._dynamicPath.length > 0 || this._isTranslating) {
            this._updatePathWithLink(this._node, AudioState.PLAYING, AudioAction.PLAY);
            return;
        }
        this._isTranslating;
        this._innerOperation(AudioAction.PLAY);
    }
    pause () {
        this._eventTarget.emit(AudioEvent.PAUSED);
        if (this._dynamicPath.length > 0 || this._isTranslating) {
            this._updatePathWithLink(this._node, AudioState.PAUSED, AudioAction.PAUSE);
            return;
        }
        this._isTranslating;
        this._innerOperation(AudioAction.PAUSE);
    }

    stop () {
        this._eventTarget.emit(AudioEvent.STOPPED);
        if (this._dynamicPath.length > 0 || this._isTranslating) {
            this._updatePathWithLink(this._node, AudioState.STOPPED, AudioAction.STOP);
            return;
        }
        this._isTranslating;
        this._innerOperation(AudioAction.STOP);
    }

    destroy () {

    }

    constructor (clip: AudioClip) {
        super();
        this._clip = clip;
        // TODO(timlyeee): AudioContext pool for reused ctx.
        this._ctx = minigame.createInnerAudioContext();
        this._registerCtxEvent();

        this._isTranslating = true;
        this._ctx.src = clip.nativeUrl;
        // Dynamic path
        this._node = AudioState.READY;
        this._graph = stateGraph;
    }

    // Should we really care about when will this innerCtx play and callback?
    private _registerCtxEvent () {
        if (this._ctx === null) {
            console.error('InnerAudioContext was not created, API is missing?');
            return;
        }
        this._ctx.onCanplay(() => {
            this._onInnerOperationEnd();
        });
        this._ctx.onPlay(() => {
            this._onInnerOperationEnd();
        });
        this._ctx.onPause(() => {
            this._onInnerOperationEnd();
        });
        this._ctx.onStop(() => {
            this._onInnerOperationEnd();
        });
        this._ctx.onSeeked(() => {
            this._onInnerOperationEnd();
        });
        this._ctx.onEnded(() => {
            this._onInnerOperationEnd();
        });
        this._ctx.onError((err) => {
            console.error(`Error occurs to inner audio context with error ${err.toString()}`);
            this._ctx && this._ctx.destroy();
            // @ts-expect-error Type 'null' is not assignable to type 'InnerAudioContext'
            this._ctx = null;
        });
        director.on(Director.EVENT_END_FRAME, () => {
            this._update();
        });
    }
    /**
     * Update function calls each frame when there's operation to do.
     * Duplicated operation will be deleted and only final state translation exist.
     * Also, event to emit will be concluded here so that innerAudioCtx could be in light use.
     */
    private _update () {
        // On Minigame platform, apply one path will recursively apply all paths.
        this._applyOnePath();
    }
    private _onHide () {
        // Hide is a special state that if is playing, all translate to Interrupted state.

        if (this._node === AudioState.PLAYING) {
            if (this._isTranslating) {
                this._updatePathWithLink(this._node, AudioState.INTERRUPTED, AudioAction.PAUSE);
                return;
            }
            this._isTranslating;
            this._innerOperation(AudioAction.PAUSE);
            this._node = AudioState.INTERRUPTED;
        }
    }
    private _onShow () {
        // Only interrupted if the old state is playing.
        if (this._node === AudioState.INTERRUPTED) {
            // No path should exist once it's already paused.
            this._innerOperation(AudioAction.PLAY);
            this._node = AudioState.PLAYING;
        }
    }
    _node : AudioState = AudioState.READY;
    private _eventTarget: EventTarget = new EventTarget();
    private _clip: AudioClip;
    private _ctx: InnerAudioContext;
    private _loop = false;
    /**
     * When the last operation is not finished, and the next operation is coming, this parameter becomes important.
     * For minigame, this situation happens all the time.
    */
    private _isTranslating = false;
    private _cachedCurrentTime = 0;
    onInterruptionBegin (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded (cb: () => void) { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded (cb?: () => void) { this._eventTarget.off(AudioEvent.ENDED, cb); }
}
