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
import { clamp01 } from '../../../cocos/core';
import * as debug from '../../../cocos/core/platform/debug';
import { EventTarget } from '../../../cocos/core/event';
import { audioBufferManager } from '../audio-buffer-manager';
import AudioTimer from '../audio-timer';
import { enqueueOperation, OperationInfo, OperationQueueable } from '../operation-queue';
import { AudioEvent, AudioPCMDataView, AudioState, AudioType } from '../type';
import { Game, game } from '../../../cocos/game';

declare const fsUtils: any;
const audioContext = minigame.tt?.getAudioContext?.();

export class OneShotAudioWeb {
    private _bufferSourceNode: AudioBufferSourceNode;
    private _onPlayCb?: () => void;
    private _url: string;

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
        this._onEndCb = cb;
    }

    private constructor (audioBuffer: AudioBuffer, volume: number, url: string) {
        this._bufferSourceNode = audioContext!.createBufferSource();
        this._bufferSourceNode.buffer = audioBuffer;
        this._bufferSourceNode.loop = false;
        this._url = url;

        const gainNode = audioContext!.createGain();
        gainNode.gain.value = volume;

        this._bufferSourceNode.connect(gainNode);
        gainNode.connect(audioContext!.destination);
    }

    public play (): void {
        this._bufferSourceNode.start();
        this.onPlay?.();
        this._bufferSourceNode.onended = (): void => {
            audioBufferManager.tryReleasingCache(this._url);
            this._onEndCb?.();
        };
    }

    public stop (): void {
        this._bufferSourceNode.onended = null;  // stop will call ended callback
        audioBufferManager.tryReleasingCache(this._url);
        this._bufferSourceNode.stop();
        this._bufferSourceNode.disconnect();
        this._bufferSourceNode.buffer = null;
    }
}

export class AudioPlayerWeb implements OperationQueueable {
    private _src: string;
    private _audioBuffer: AudioBuffer;
    private _sourceNode?: AudioBufferSourceNode;
    private _gainNode: GainNode;
    private _volume = 1;
    private _loop = false;
    private _state: AudioState = AudioState.INIT;
    private _audioTimer: AudioTimer;
    private _readyToHandleOnShow = false;

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _eventTarget: EventTarget = new EventTarget();
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _operationQueue: OperationInfo[] = [];

    constructor (audioBuffer: AudioBuffer, url: string) {
        this._audioBuffer = audioBuffer;
        this._audioTimer = new AudioTimer(audioBuffer);
        this._gainNode = audioContext!.createGain();
        this._gainNode.connect(audioContext!.destination);

        this._src = url;
        // event
        game.on(Game.EVENT_PAUSE, this._onInterruptedBegin, this);
        game.on(Game.EVENT_RESUME, this._onInterruptedEnd, this);
    }
    destroy (): void {
        this._audioTimer.destroy();
        if (this._audioBuffer) {
            // NOTE: need to release AudioBuffer instance
            this._audioBuffer = null as any;
        }
        audioBufferManager.tryReleasingCache(this._src);
        game.off(Game.EVENT_PAUSE, this._onInterruptedBegin, this);
        game.off(Game.EVENT_RESUME, this._onInterruptedEnd, this);
    }
    private _onInterruptedBegin (): void {
        if (this._state === AudioState.PLAYING) {
            this.pause().then(() => {
                this._state = AudioState.INTERRUPTED;
                this._readyToHandleOnShow = true;
                this._eventTarget.emit(AudioEvent.INTERRUPTION_BEGIN);
            }).catch((e) => { debug.warn('_onInterruptedBegin error', e); });
        }
    }
    private _onInterruptedEnd (): void {
        // We don't know whether onShow or resolve callback in pause promise is called at first.
        if (!this._readyToHandleOnShow) {
            this._eventTarget.once(AudioEvent.INTERRUPTION_BEGIN, this._onInterruptedEnd, this);
            return;
        }
        if (this._state === AudioState.INTERRUPTED) {
            this.play().then(() => {
                this._eventTarget.emit(AudioEvent.INTERRUPTION_END);
            }).catch((e) => { debug.warn('_onInterruptedEnd error', e); });
        }
        this._readyToHandleOnShow = false;
    }
    static load (url: string): Promise<AudioPlayerWeb> {
        return new Promise((resolve, reject) => {
            AudioPlayerWeb.loadNative(url).then((audioBuffer) => {
                resolve(new AudioPlayerWeb(audioBuffer, url));
            }).catch(reject);
        });
    }
    static loadNative (url: string): Promise<AudioBuffer> {
        return new Promise((resolve, reject) => {
            // NOTE: maybe url is a temp path, which is not reliable.
            // need to cache the decoded audio buffer.
            const cachedAudioBuffer = audioBufferManager.getCache(url);
            if (cachedAudioBuffer) {
                audioBufferManager.retainCache(url);
                resolve(cachedAudioBuffer);
                return;
            }
            // TODO: use pal/fs
            fsUtils.readArrayBuffer(url, (err: Error, arrayBuffer: ArrayBuffer) => {
                if (err) {
                    reject(err);
                    return;
                }
                audioContext!.decodeAudioData(arrayBuffer).then((decodedAudioBuffer) => {
                    audioBufferManager.addCache(url, decodedAudioBuffer);
                    resolve(decodedAudioBuffer);
                }).catch(reject);
            });
        });
    }

    static loadOneShotAudio (url: string, volume: number): Promise<OneShotAudioWeb> {
        return new Promise((resolve, reject) => {
            AudioPlayerWeb.loadNative(url).then((audioBuffer) => {
                // HACK: AudioPlayer should be a friend class in OneShotAudio
                const oneShotAudio = new (OneShotAudioWeb as any)(audioBuffer, volume, url);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                resolve(oneShotAudio);
            }).catch(reject);
        });
    }

    get src (): string {
        return this._src;
    }
    get type (): AudioType {
        return AudioType.WEB_AUDIO;
    }
    get state (): AudioState {
        return this._state;
    }
    get loop (): boolean {
        return this._loop;
    }
    set loop (val: boolean) {
        this._loop = val;
        if (this._sourceNode) {
            this._sourceNode.loop = val;
        }
    }
    get volume (): number {
        return this._volume;
    }
    set volume (val: number) {
        val = clamp01(val);
        this._volume = val;
        this._gainNode.gain.value = val;
    }
    get duration (): number {
        return this._audioBuffer.duration;
    }
    get currentTime (): number {
        return this._audioTimer.currentTime;
    }

    get sampleRate (): number {
        return this._audioBuffer.sampleRate;
    }

    public getPCMData (channelIndex: number): AudioPCMDataView | undefined {
        return new AudioPCMDataView(this._audioBuffer.getChannelData(channelIndex), 1);
    }

    @enqueueOperation
    seek (time: number): Promise<void> {
        return new Promise((resolve) => {
            this._audioTimer.seek(time);
            if (this._state === AudioState.PLAYING) {
                // one AudioBufferSourceNode can't start twice
                // need to create a new one to start from the offset
                this._doPlay().then(resolve).catch((e) => { debug.warn('seek error', e); });
            } else {
                resolve();
            }
        });
    }

    @enqueueOperation
    play (): Promise<void> {
        return this._doPlay();
    }

    // The decorated play() method can't be call in seek()
    // so we define this method to ensure that the audio seeking works.
    private _doPlay (): Promise<void> {
        return new Promise((resolve) => {
            // one AudioBufferSourceNode can't start twice
            this._stopSourceNode();
            this._sourceNode = audioContext!.createBufferSource();
            this._sourceNode.buffer = this._audioBuffer;
            this._sourceNode.loop = this._loop;
            this._sourceNode.connect(this._gainNode);

            this._sourceNode.start(0, this._audioTimer.currentTime);
            this._state = AudioState.PLAYING;
            this._audioTimer.start();

            this._sourceNode.onended = (): void => {
                this._audioTimer.stop();
                this._eventTarget.emit(AudioEvent.ENDED);
                this._state = AudioState.INIT;
            };
            resolve();
        });
    }

    private _stopSourceNode (): void {
        try {
            if (this._sourceNode) {
                this._sourceNode.onended = null;  // stop will call ended callback
                this._sourceNode.stop();
                this._sourceNode.disconnect();
                this._sourceNode.buffer = null;
                this._sourceNode = undefined;
            }
        } catch (e) {
            // sourceNode can't be stopped twice, especially on Safari.
        }
    }

    @enqueueOperation
    pause (): Promise<void> {
        if (this._state !== AudioState.PLAYING || !this._sourceNode) {
            return Promise.resolve();
        }
        this._audioTimer.pause();
        this._state = AudioState.PAUSED;
        this._stopSourceNode();
        return Promise.resolve();
    }

    @enqueueOperation
    stop (): Promise<void> {
        if (!this._sourceNode) {
            this._audioTimer.stop();
            this._state = AudioState.STOPPED;
            return Promise.resolve();
        }
        this._audioTimer.stop();
        this._state = AudioState.STOPPED;
        this._stopSourceNode();
        return Promise.resolve();
    }

    onInterruptionBegin (cb: () => void): void { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin (cb?: () => void): void { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd (cb: () => void): void { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd (cb?: () => void): void { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded (cb: () => void): void { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded (cb?: () => void): void { this._eventTarget.off(AudioEvent.ENDED, cb); }
}
