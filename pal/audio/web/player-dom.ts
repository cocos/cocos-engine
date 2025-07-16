/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { systemInfo } from 'pal/system-info';
import { AudioEvent, AudioState, AudioPCMDataView, AudioType } from '../type';
import { EventTarget } from '../../../cocos/core/event';
import { clamp, clamp01 } from '../../../cocos/core';
import { enqueueOperation, OperationInfo, OperationQueueable } from '../operation-queue';
import { BrowserType, OS } from '../../system-info/enum-type';
import { Game, game } from '../../../cocos/game';

function ensurePlaying (domAudio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve) => {
        const promise = domAudio.play();
        if (promise === undefined) {  // Chrome50/Firefox53 below
            return resolve();
        }
        promise.then(resolve).catch((): void => {
            const onGesture = (): void => {
                domAudio.play().then(() => {
                    // HACK NOTE: if the user slide after touch start, the context cannot be resumed correctly.
                    canvas?.removeEventListener('touchend', onGesture, { capture: true });
                    canvas?.removeEventListener('mouseup', onGesture, { capture: true });
                }).catch((e) => {});
                resolve();
            };
            const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            canvas?.addEventListener('touchend', onGesture, { capture: true });
            canvas?.addEventListener('mouseup', onGesture, { capture: true });
        });
        return null;
    });
}

export class OneShotAudioDOM {
    private _domAudio: HTMLAudioElement;
    private _onPlayCb?: () => void;
    get onPlay (): (() => void) | undefined {
        return this._onPlayCb;
    }
    set onPlay (cb) {
        this._onPlayCb = cb;
    }

    private _onEndCb?: () => void;
    get onEnd (): (() => void) | undefined {
        return this._onEndCb;
    }
    set onEnd (cb) {
        if (this._onEndCb) {
            this._domAudio.removeEventListener('ended', this._onEndCb);
        }
        this._onEndCb = cb;
        if (cb) {
            this._domAudio.addEventListener('ended', cb);
        }
    }

    private constructor (nativeAudio: HTMLAudioElement, volume: number) {
        this._domAudio = nativeAudio;
        nativeAudio.volume =  volume;
    }
    public play (): void {
        ensurePlaying(this._domAudio).then(() => {
            this.onPlay?.();
        }).catch((e) => {});
    }
    public stop (): void {
        this._domAudio.pause();
    }
}

export class AudioPlayerDOM implements OperationQueueable {
    private _domAudio: HTMLAudioElement;
    private _state: AudioState = AudioState.INIT;
    private _onEnded: () => void;

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _eventTarget: EventTarget = new EventTarget();
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _operationQueue: OperationInfo[] = [];

    constructor (nativeAudio: HTMLAudioElement) {
        this._domAudio = nativeAudio;

        // event
        game.on(Game.EVENT_PAUSE, this._onInterruptedBegin, this);
        game.on(Game.EVENT_RESUME, this._onInterruptedEnd, this);
        this._onEnded = (): void => {
            this.seek(0).catch((e) => {});
            this._state = AudioState.INIT;
            this._eventTarget.emit(AudioEvent.ENDED);
        };
        this._domAudio.addEventListener('ended', this._onEnded);
    }

    destroy (): void {
        game.off(Game.EVENT_PAUSE, this._onInterruptedBegin, this);
        game.off(Game.EVENT_RESUME, this._onInterruptedEnd, this);
        this._domAudio.removeEventListener('ended', this._onEnded);
        // NOTE: need to release DOM Audio instance
        this._domAudio = null as any;
    }
    static load (url: string): Promise<AudioPlayerDOM> {
        return new Promise((resolve, reject) => {
            AudioPlayerDOM.loadNative(url).then((domAudio) => {
                resolve(new AudioPlayerDOM(domAudio));
            }).catch(reject);
        });
    }
    static loadNative (url: string): Promise<HTMLAudioElement> {
        return new Promise((resolve, reject) => {
            const domAudio = document.createElement('audio');
            let loadedEvent = 'canplaythrough';
            if (systemInfo.os === OS.IOS) {
                // iOS no event that used to parse completed callback
                // this time is not complete, can not play
                loadedEvent = 'loadedmetadata';
            } else if (systemInfo.browserType === BrowserType.FIREFOX) {
                loadedEvent = 'canplay';
            }

            const timer = setTimeout(() => {
                if (domAudio.readyState === 0) {
                    failure();
                } else {
                    success();
                }
            }, 8000);
            const clearEvent = (): void => {
                clearTimeout(timer);
                domAudio.removeEventListener(loadedEvent, success, false);
                domAudio.removeEventListener('error', failure, false);
            };
            const success = (): void => {
                clearEvent();
                resolve(domAudio);
            };
            const failure = (): void => {
                clearEvent();
                const message = `load audio failure - ${url}`;
                reject(new Error(message));
            };
            domAudio.addEventListener(loadedEvent, success, false);
            domAudio.addEventListener('error', failure, false);
            domAudio.src = url;
        });
    }
    static loadOneShotAudio (url: string, volume: number): Promise<OneShotAudioDOM> {
        return new Promise((resolve, reject) => {
            AudioPlayerDOM.loadNative(url).then((domAudio) => {
                // HACK: AudioPlayer should be a friend class in OneShotAudio
                const oneShotAudio = new (OneShotAudioDOM as any)(domAudio, volume);
                resolve(oneShotAudio);
            }).catch(reject);
        });
    }

    private _onInterruptedBegin (): void {
        if (this._state === AudioState.PLAYING) {
            this.pause().then(() => {
                this._state = AudioState.INTERRUPTED;
                this._eventTarget.emit(AudioEvent.INTERRUPTION_BEGIN);
            }).catch((e) => {});
        }
    }
    private _onInterruptedEnd (): void {
        if (this._state === AudioState.INTERRUPTED) {
            this.play().then(() => {
                this._eventTarget.emit(AudioEvent.INTERRUPTION_END);
            }).catch((e) => {});
        }
    }

    get src (): string {
        return this._domAudio ? this._domAudio.src : '';
    }
    get type (): AudioType {
        return AudioType.DOM_AUDIO;
    }
    get state (): AudioState {
        return this._state;
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
        return this._domAudio.duration;
    }
    get currentTime (): number {
        return this._domAudio.currentTime;
    }

    get sampleRate (): number {
        return 0;
    }

    public getPCMData (channelIndex: number): AudioPCMDataView | undefined {
        return undefined;
    }

    @enqueueOperation
    seek (time: number): Promise<void> {
        time = clamp(time, 0, this.duration);
        this._domAudio.currentTime = time;
        return Promise.resolve();
    }

    @enqueueOperation
    play (): Promise<void> {
        return new Promise((resolve) => {
            ensurePlaying(this._domAudio).then(() => {
                this._state = AudioState.PLAYING;
                resolve();
            }).catch((e)  => {});
        });
    }

    @enqueueOperation
    pause (): Promise<void> {
        this._domAudio.pause();
        this._state = AudioState.PAUSED;
        return Promise.resolve();
    }

    @enqueueOperation
    stop (): Promise<void> {
        return new Promise((resolve) => {
            this._domAudio.pause();
            this._domAudio.currentTime = 0;
            this._state = AudioState.STOPPED;
            resolve();
        });
    }

    onInterruptionBegin (cb: () => void): void { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin (cb?: () => void): void { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd (cb: () => void): void { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd (cb?: () => void): void { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded (cb: () => void): void { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded (cb?: () => void): void { this._eventTarget.off(AudioEvent.ENDED, cb); }
}
