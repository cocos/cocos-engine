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
import { systemInfo } from 'pal/system-info';
import { DynamicPath, Playable, AudioAction, stateGraph, StateLinks, TinyOGraph, TinyOLink } from '../playable';
import { AudioClip } from '../../audio-clip';
import { EventTarget } from '../../../core/event';
import { AudioEvent, AudioState, PlayerOptions } from '../../type';
import { clamp, clamp01 } from '../../../core';
import { domAudioPool } from './audio-pool-dom';

function ensurePlaying (domAudio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve) => {
        const promise = domAudio.play();
        if (promise === undefined) {  // Chrome50/Firefox53 below
            resolve();
        }
        promise.then(resolve).catch(() => {
            const onGesture = () => {
                domAudio.play().catch((e) => {});
                resolve();
            };
            const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            canvas?.addEventListener('touchend', onGesture, { once: true });
            canvas?.addEventListener('mousedown', onGesture, { once: true });
        });
        return null;
    });
}
export function playOneShot (clip: AudioClip, volumeScale: number) {
    const audio = new Audio(clip.nativeUrl);
    audio.volume = volumeScale;
    ensurePlaying(audio).catch(() => {
        console.log('play failed');
    });
}

export class AudioPlayerDom extends DynamicPath<AudioState, AudioAction> implements Playable {
    _innerOperation = (action: AudioAction) => {
        this._isTranslating = true;
        switch (action) {
        case AudioAction.PLAY:
            ensurePlaying(this._domAudio).then(() => {
                this._isTranslating = false;
                this._applyPath();
            }).catch((err:Error) => {
                console.error(err.message);
            });
            break;
        case AudioAction.PAUSE:
            this._domAudio.pause();
            break;
        case AudioAction.STOP:
            this._domAudio.pause();
            this._domAudio.currentTime = 0;
            break;
        default:
            console.warn('Action is invalid, unable to act');
            break;
        }
    }
    private _clip: AudioClip;
    private _onEnded: () => void;
    constructor (clip: AudioClip, options?: PlayerOptions) {
        super();
        this._clip = clip;
        // clip.nativeUrl is exactly the same as meta data.
        this._domAudio = domAudioPool.alloc(clip.nativeUrl);

        // event
        systemInfo.on('hide', this._onHide, this);
        systemInfo.on('show', this._onShow, this);
        this._onEnded = () => {
            console.log(`on end`);
            this.currentTime = 0;
            this._cleanPath();
            this._forceSetNode(AudioState.READY);
            this._eventTarget.emit(AudioEvent.ENDED);
        };
        this._domAudio.addEventListener('ended', this._onEnded);
    }
    set clip (clip: AudioClip) {
        this._domAudio.src = clip.nativeUrl;
    }
    get clip (): AudioClip {
        return this.clip;
    }
    set playbackRate (rate: number) {
        this._domAudio.playbackRate = rate;
    }
    get playbackRate (): number {
        return this._domAudio.playbackRate;
    }
    set pan (pan: number) {
        console.error('Pan setting is not supported on current platform');
    }
    get pan (): number {
        console.error('Pan setting is not supported on current platform');
        return 0; // 0 is center
    }

    destroy () {
        // console.log(`ondestroy`);
        systemInfo.off('hide', this._onHide, this);
        systemInfo.off('show', this._onShow, this);
        this._domAudio.removeEventListener('ended', this._onEnded);
        domAudioPool.dealloc(this.clip._nativeUrl, this._domAudio);
    }
    private _onHide () {
        // Hide is a special state that if is playing, all translate to Interrupted state.

        if (this._node === AudioState.PLAYING) {
            if (this._isTranslating) {
                this._updatePathWithLink(this._node, AudioState.INTERRUPTED, AudioAction.PAUSE);
                return;
            }
            this._isTranslating = true;
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

    get src (): string {
        return this._domAudio ? this._domAudio.src : '';
    }
    get state (): AudioState {
        return this._node;
    }
    get loop (): boolean {
        return this._domAudio.loop;
    }
    set loop (val: boolean) {
        this._domAudio.loop = val;
    }
    get volume (): number {
        return this._domAudio.volume;
    }
    set volume (val: number) {
        val = clamp01(val);
        this._domAudio.volume = val;
    }
    get duration (): number {
        return this._clip.getDuration();
    }
    get currentTime (): number {
        return this._domAudio.currentTime;
    }

    set currentTime (time: number) {
        time = clamp(time, 0, this.duration);
        this._domAudio.fastSeek ? this._domAudio.fastSeek(time) : this._domAudio.currentTime = time;
    }

    play () {
        this._eventTarget.emit(AudioEvent.PLAYED);
        if (this._dynamicPath.length > 0 || this._isTranslating) {
            this._updatePathWithLink(this._node, AudioState.PLAYING, AudioAction.PLAY);
            return;
        }
        this._isTranslating = true;
        this._innerOperation(AudioAction.PLAY);
    }

    pause () {
        this._eventTarget.emit(AudioEvent.PAUSED);
        if (this._dynamicPath.length > 0 || this._isTranslating) {
            this._updatePathWithLink(this._node, AudioState.PAUSED, AudioAction.PAUSE);
            return;
        }
        this._isTranslating = true;
        this._innerOperation(AudioAction.PAUSE);
    }

    stop () {
        this._eventTarget.emit(AudioEvent.PLAYED);
        if (this._dynamicPath.length > 0 || this._isTranslating) {
            this._updatePathWithLink(this._node, AudioState.STOPPED, AudioAction.STOP);
            return;
        }
        this._isTranslating = true;
        this._innerOperation(AudioAction.STOP);
    }
    private _domAudio: HTMLAudioElement;
    private _eventTarget: EventTarget = new EventTarget();
    _node : AudioState = AudioState.READY;
    // private _clip: AudioClip;
    private _loop = false;
    /**
     * When the last operation is not finished, and the next operation is coming, this parameter becomes important.
     * For minigame, this situation happens all the time.
    */
    private _isTranslating = false;
    onInterruptionBegin (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded (cb: () => void) { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded (cb?: () => void) { this._eventTarget.off(AudioEvent.ENDED, cb); }
}
