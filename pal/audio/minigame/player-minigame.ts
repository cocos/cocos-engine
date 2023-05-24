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

import { minigame } from 'pal/minigame';
import { systemInfo } from 'pal/system-info';
import { TAOBAO, TAOBAO_MINIGAME } from 'internal:constants';
import { EventTarget } from '../../../cocos/core/event';
import { AudioEvent, AudioPCMDataView, AudioState, AudioType } from '../type';
import { clamp, clamp01 } from '../../../cocos/core';
import { enqueueOperation, OperationInfo, OperationQueueable } from '../operation-queue';
import { OS } from '../../system-info/enum-type';
import { Game, game } from '../../../cocos/game';

export class OneShotAudioMinigame {
    private _innerAudioContext: InnerAudioContext;
    private _onPlayCb?: () => void;
    get onPlay () {
        return this._onPlayCb;
    }
    set onPlay (cb) {
        this._onPlayCb = cb;
    }

    private _onEndCb?: () => void;
    get onEnd () {
        return this._onEndCb;
    }
    set onEnd (cb) {
        this._onEndCb = cb;
    }

    private constructor (nativeAudio: InnerAudioContext, volume: number) {
        this._innerAudioContext = nativeAudio;
        nativeAudio.volume = volume;
        nativeAudio.onPlay(() => {
            this._onPlayCb?.();
        });
        nativeAudio.onEnded(() => {
            this._onEndCb?.();
            nativeAudio.destroy();
            // NOTE: Type 'null' is not assignable to type 'InnerAudioContext'.
            this._innerAudioContext = null as any;
        });
    }
    public play (): void {
        this._innerAudioContext.play();
    }
    public stop (): void {
        this._innerAudioContext.stop();
    }
}

export class AudioPlayerMinigame implements OperationQueueable {
    private _innerAudioContext: InnerAudioContext;
    private _state: AudioState = AudioState.INIT;
    private _cacheTime = 0;
    private _needSeek = false;
    private _seeking = false;

    private _onPlay: () => void;
    private _onPause: () => void;
    private _onStop: () => void;
    private _onSeeked: () => void;
    private _onEnded: () => void;
    private _readyToHandleOnShow = false;

    private _resetSeekCache () {
        this._cacheTime = 0;
        this._needSeek = false;
        this._seeking = false;
    }
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _eventTarget: EventTarget = new EventTarget();
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _operationQueue: OperationInfo[] = [];

    constructor (innerAudioContext: InnerAudioContext) {
        this._innerAudioContext = innerAudioContext;
        this._eventTarget = new EventTarget();

        // event
        game.on(Game.EVENT_PAUSE, this._onInterruptedBegin, this);
        game.on(Game.EVENT_RESUME, this._onInterruptedEnd, this);
        const eventTarget = this._eventTarget;
        this._onPlay = () => {
            this._state = AudioState.PLAYING;
            eventTarget.emit(AudioEvent.PLAYED);
            if (this._needSeek) {
                this.seek(this._cacheTime).catch((e) => {});
            }
        };
        innerAudioContext.onPlay(this._onPlay);
        this._onPause = () => {
            this._state = AudioState.PAUSED;
            try {
                const currentTime = this._innerAudioContext.currentTime;
                if (currentTime !== null && currentTime !== undefined) {
                    this._cacheTime = currentTime;
                }
            } catch {
                // Do nothing, cacheTime is not updated.
            }
            eventTarget.emit(AudioEvent.PAUSED);
        };
        innerAudioContext.onPause(this._onPause);
        this._onStop = () => {
            this._state = AudioState.STOPPED;
            // Reset all properties
            this._resetSeekCache();
            eventTarget.emit(AudioEvent.STOPPED);
            const currentTime = this._innerAudioContext ? this._innerAudioContext.currentTime : 0;
            if (currentTime !== 0) {
                this._innerAudioContext.seek(0);
            }
        };
        innerAudioContext.onStop(this._onStop);
        this._onSeeked = () => {
            eventTarget.emit(AudioEvent.SEEKED);
            this._seeking = false;
            if (this._needSeek) {
                this._needSeek = false;
                if (this._cacheTime.toFixed(3) !== this._innerAudioContext.currentTime.toFixed(3)) {
                    this.seek(this._cacheTime).catch((e) => {});
                } else {
                    this._needSeek = false;
                }
            }

            // TaoBao iOS: After calling pause or stop, when seek is called, it will automatically play and call onPlay.
            if ((TAOBAO || TAOBAO_MINIGAME) && systemInfo.os === OS.IOS
                && (this._state === AudioState.PAUSED || this._state === AudioState.STOPPED)) {
                innerAudioContext.pause();
            }
        };
        innerAudioContext.onSeeked(this._onSeeked);
        this._onEnded = () => {
            this._state = AudioState.INIT;
            this._resetSeekCache();
            eventTarget.emit(AudioEvent.ENDED);
        };
        innerAudioContext.onEnded(this._onEnded);
    }
    destroy () {
        game.off(Game.EVENT_PAUSE, this._onInterruptedBegin, this);
        game.off(Game.EVENT_RESUME, this._onInterruptedEnd, this);
        if (this._innerAudioContext) {
            ['Play', 'Pause', 'Stop', 'Seeked', 'Ended'].forEach((event) => {
                this._offEvent(event);
            });
            // NOTE: innewAudioContext might not stop the audio playing, have to call it explicitly.
            this._innerAudioContext.stop();
            this._innerAudioContext.destroy();
            // NOTE: Type 'null' is not assignable to type 'InnerAudioContext'
            this._innerAudioContext = null as any;
        }
    }
    private _onInterruptedBegin () {
        if (this._state === AudioState.PLAYING) {
            this.pause().then(() => {
                this._state = AudioState.INTERRUPTED;
                this._readyToHandleOnShow = true;
                this._eventTarget.emit(AudioEvent.INTERRUPTION_BEGIN);
            }).catch((e) => {});
        }
    }
    private _onInterruptedEnd () {
        // We don't know whether onShow or resolve callback in pause promise is called at first.
        if (!this._readyToHandleOnShow) {
            this._eventTarget.once(AudioEvent.INTERRUPTION_BEGIN, this._onInterruptedEnd, this);
            return;
        }
        if (this._state === AudioState.INTERRUPTED) {
            this.play().then(() => {
                this._eventTarget.emit(AudioEvent.INTERRUPTION_END);
            }).catch((e) => {});
        }
        this._readyToHandleOnShow = false;
    }
    private _offEvent (eventName: string) {
        if (this[`_on${eventName}`]) {
            this._innerAudioContext[`off${eventName}`](this[`_on${eventName}`]);
            this[`_on${eventName}`] = null;
        }
    }

    get src () {
        return this._innerAudioContext ? this._innerAudioContext.src : '';
    }
    get type (): AudioType {
        return AudioType.MINIGAME_AUDIO;
    }
    static load (url: string): Promise<AudioPlayerMinigame> {
        return new Promise((resolve) => {
            AudioPlayerMinigame.loadNative(url).then((innerAudioContext) => {
                resolve(new AudioPlayerMinigame(innerAudioContext as InnerAudioContext));
            }).catch((e) => {});
        });
    }
    static loadNative (url: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            const innerAudioContext = minigame.createInnerAudioContext();
            const timer = setTimeout(() => {
                clearEvent();
                resolve(innerAudioContext);
            }, 8000);
            function clearEvent () {
                innerAudioContext.offCanplay(success);
                innerAudioContext.offError(fail);
            }
            function success () {
                clearEvent();
                clearTimeout(timer);
                resolve(innerAudioContext);
            }
            function fail (err) {
                clearEvent();
                clearTimeout(timer);
                console.error('failed to load innerAudioContext');
                reject(new Error(err));
            }
            innerAudioContext.onCanplay(success);
            innerAudioContext.onError(fail);
            innerAudioContext.src = url;
        });
    }
    static loadOneShotAudio (url: string, volume: number): Promise<OneShotAudioMinigame> {
        return new Promise((resolve, reject) => {
            AudioPlayerMinigame.loadNative(url).then((innerAudioContext) => {
                // HACK: AudioPlayer should be a friend class in OneShotAudio
                resolve(new (OneShotAudioMinigame as any)(innerAudioContext, volume));
            }).catch(reject);
        });
    }

    get state (): AudioState {
        return this._state;
    }
    get loop (): boolean {
        return this._innerAudioContext.loop;
    }
    set loop (val: boolean) {
        this._innerAudioContext.loop = val;
    }
    get volume (): number {
        return this._innerAudioContext.volume;
    }
    set volume (val: number) {
        val = clamp01(val);
        this._innerAudioContext.volume = val;
    }
    get duration (): number {
        // KNOWN ISSUES: duration doesn't work well
        // On WeChat platform, duration is 0 at the time audio is loaded.
        return this._innerAudioContext.duration;
    }
    get currentTime (): number {
        if (this._state !== AudioState.PLAYING || this._needSeek || this._seeking) {
            return this._cacheTime;
        }
        return this._innerAudioContext.currentTime;
    }

    get sampleRate (): number {
        return 0;
    }

    public getPCMData (channelIndex: number): AudioPCMDataView | undefined {
        return undefined;
    }

    @enqueueOperation
    seek (time: number): Promise<void> {
        return new Promise((resolve) => {
            // KNOWN ISSUES: on Baidu: currentTime returns without numbers on decimal places
            if (this._state === AudioState.PLAYING && !this._seeking) {
                time = clamp(time, 0, this.duration);
                this._seeking = true;
                this._innerAudioContext.seek(time);
            } else if (this._cacheTime !== time) { // Skip the invalid seek
                this._cacheTime = time;
                this._needSeek = true;
            }
            resolve();
        });
    }

    @enqueueOperation
    play (): Promise<void> {
        return new Promise((resolve) => {
            this._eventTarget.once(AudioEvent.PLAYED, resolve);
            this._innerAudioContext.play();
        });
    }

    @enqueueOperation
    pause (): Promise<void> {
        return new Promise((resolve) => {
            if (this.state !== AudioState.PLAYING) {
                resolve();
            } else {
                this._eventTarget.once(AudioEvent.PAUSED, resolve);
                this._innerAudioContext.pause();
            }
        });
    }

    @enqueueOperation
    stop (): Promise<void> {
        // NOTE: on Taobao, it is designed that innerAudioContext is useless after calling stop.
        // so we implement stop as pase + seek.
        if (TAOBAO || TAOBAO_MINIGAME) {
            this._innerAudioContext.pause();
            this._innerAudioContext.seek(0);
            this._onStop?.();
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            this._eventTarget.once(AudioEvent.STOPPED, resolve);
            this._innerAudioContext.stop();
        });
    }

    onInterruptionBegin (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded (cb: () => void) { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded (cb?: () => void) { this._eventTarget.off(AudioEvent.ENDED, cb); }
}
