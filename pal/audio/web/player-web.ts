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

import { EDITOR_NOT_IN_PREVIEW } from 'internal:constants';
import { AudioPCMDataView, AudioEvent, AudioState, AudioType } from '../type';
import { EventTarget } from '../../../cocos/core/event';
import { clamp01 } from '../../../cocos/core';
import * as debug from '../../../cocos/core/platform/debug';
import { enqueueOperation, OperationInfo, OperationQueueable } from '../operation-queue';
import AudioTimer from '../audio-timer';
import { audioBufferManager } from '../audio-buffer-manager';
import { Game, game } from '../../../cocos/game';

// NOTE: fix CI
const AudioContextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
const _contextRunningEvent = 'on-context-running';

export class AudioContextAgent {
    public static support = !!AudioContextClass;

    private _eventTarget: EventTarget;
    private _context: AudioContext;
    private _isRunning = false;
    constructor () {
        this._context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
        this._eventTarget = new EventTarget();
        this._context.onstatechange = (): void => {
            if (this._context.state === 'running') {
                this._isRunning = true;
                this._eventTarget.emit(_contextRunningEvent);
            } else {
                this._isRunning = false;
            }
        };
    }

    get isRunning (): boolean {
        return this._isRunning;
    }

    get currentTime (): number {
        return this._context.currentTime;
    }

    public onceRunning (cb: (...args: any[]) => void, target?: any): void {
        this._eventTarget.once(_contextRunningEvent, cb, target);
    }

    public offRunning (cb?: (...args: any[]) => void, target?: any): void {
        this._eventTarget.off(_contextRunningEvent, cb, target);
    }

    public decodeAudioData (audioData: ArrayBuffer): Promise<AudioBuffer> {
        return new Promise((resolve, reject) => {
            const promise = this._context.decodeAudioData(audioData, (audioBuffer) => {
                resolve(audioBuffer);
            }, (err) => {
                // TODO: need to reject the error.
                // eslint-disable-next-line no-console
                console.error('failed to load Web Audio', err);
            });
            promise?.catch(reject);  // Safari doesn't support the promise based decodeAudioData
        });
    }

    public runContext (): Promise<void> {
        return new Promise((resolve) => {
            if (this.isRunning) {
                resolve();
                return;
            }
            const context = this._context;
            if (!context.resume) {
                resolve();
                return;
            }
            context.resume().catch((e) => { debug.warn('runContext error', e); });
            if (context.state === 'running') {
                resolve();
                return;
            }
            // Force running audio context if state is not 'running', may be 'suspended' or 'interrupted'.
            const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            // HACK NOTE: if the user slide after touch start, the context cannot be resumed correctly.
            const onGesture = (): void => {
                context.resume().then(() => {
                    canvas?.removeEventListener('touchend', onGesture, { capture: true });
                    canvas?.removeEventListener('mouseup', onGesture, { capture: true });
                    resolve();
                }).catch((e) => { debug.warn('onGesture resume error', e); });
            };
            canvas?.addEventListener('touchend', onGesture, { capture: true });
            canvas?.addEventListener('mouseup', onGesture, { capture: true });
        });
    }

    public createBufferSource (audioBuffer?: AudioBuffer, loop?: boolean): AudioBufferSourceNode {
        const sourceBufferNode = this._context.createBufferSource();
        if (audioBuffer !== undefined) {
            sourceBufferNode.buffer = audioBuffer;
        }
        if (loop !== undefined) {
            sourceBufferNode.loop = loop;
        }
        return sourceBufferNode;
    }

    public createGain (volume = 1): GainNode {
        const gainNode = this._context.createGain();
        this.setGainValue(gainNode, volume);
        return gainNode;
    }

    public setGainValue (gain: GainNode, volume: number): void {
        if (gain.gain.setTargetAtTime) {
            try {
                gain.gain.setTargetAtTime(volume, this._context.currentTime, 0);
            } catch (e) {
                // Some unknown browsers may crash if timeConstant is 0
                gain.gain.setTargetAtTime(volume, this._context.currentTime, 0.01);
            }
        } else {
            gain.gain.value = volume;
        }
    }

    public connectContext (audioNode: GainNode): void {
        if (!this._context) {
            return;
        }
        audioNode.connect(this._context.destination);
    }
}

let audioContextAgent: AudioContextAgent | undefined;
if (AudioContextAgent.support) {
    audioContextAgent = new AudioContextAgent();
}

export class OneShotAudioWeb {
    private _duration: number;
    private _bufferSourceNode: AudioBufferSourceNode;
    private _onPlayCb?: () => void;
    private _currentTimer = 0;
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
        this._duration = audioBuffer.duration;
        this._url = url;
        this._bufferSourceNode = audioContextAgent!.createBufferSource(audioBuffer, false);
        const gainNode = audioContextAgent!.createGain(volume);
        this._bufferSourceNode.connect(gainNode);
        audioContextAgent!.connectContext(gainNode);
    }

    public play (): void {
        if (EDITOR_NOT_IN_PREVIEW) {
            return;
        }
        this._bufferSourceNode.start();
        // audioContextAgent does exist
        audioContextAgent!.runContext().then(() => {
            this.onPlay?.();
            this._currentTimer = window.setTimeout(() => {
                audioBufferManager.tryReleasingCache(this._url);
                this.onEnd?.();
            }, this._duration * 1000);
        }).catch((e) => { debug.warn('play error', e); });
    }

    public stop (): void {
        clearTimeout(this._currentTimer);
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
    private _currentTimer = 0;
    private _volume = 1;
    private _loop = false;
    private _state: AudioState = AudioState.INIT;
    private _audioTimer: AudioTimer;
    private _runningCallback?: () => void;

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
        this._gainNode = audioContextAgent!.createGain();
        audioContextAgent!.connectContext(this._gainNode);
        this._src = url;
        // event
        game.on(Game.EVENT_PAUSE, this._onInterruptedBegin, this);
        game.on(Game.EVENT_RESUME, this._onInterruptedEnd, this);
    }
    destroy (): void {
        window.clearTimeout(this._currentTimer);
        this._audioTimer.destroy();
        if (this._audioBuffer) {
            // NOTE: need to release AudioBuffer instance
            this._audioBuffer = null as any;
        }
        audioBufferManager.tryReleasingCache(this._src);
        game.off(Game.EVENT_PAUSE, this._onInterruptedBegin, this);
        game.off(Game.EVENT_RESUME, this._onInterruptedEnd, this);
        this.offRunning();
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
            const cachedAudioBuffer = audioBufferManager.getCache(url);
            if (cachedAudioBuffer) {
                audioBufferManager.retainCache(url);
                resolve(cachedAudioBuffer);
                return;
            }
            const xhr = new XMLHttpRequest();
            const errInfo = `load audio failed: ${url}, status: `;
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = (): void => {
                if (xhr.status === 200 || xhr.status === 0) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    audioContextAgent!.decodeAudioData(xhr.response).then((decodedAudioBuffer) => {
                        audioBufferManager.addCache(url, decodedAudioBuffer);
                        resolve(decodedAudioBuffer);
                    }).catch((e) => { debug.warn('loadNative error', url, e); });
                } else {
                    reject(new Error(`${errInfo}${xhr.status}(no response)`));
                }
            };
            xhr.onerror = (): void => { reject(new Error(`${errInfo}${xhr.status}(error)`)); };
            xhr.ontimeout = (): void => { reject(new Error(`${errInfo}${xhr.status}(time out)`)); };
            xhr.onabort = (): void => { reject(new Error(`${errInfo}${xhr.status}(abort)`)); };

            xhr.send(null);
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

    get sampleRate (): number {
        return this._audioBuffer.sampleRate;
    }

    public getPCMData (channelIndex: number): AudioPCMDataView | undefined {
        return new AudioPCMDataView(this._audioBuffer.getChannelData(channelIndex), 1);
    }

    private _onInterruptedBegin (): void {
        if (this._state === AudioState.PLAYING) {
            this.pause().then(() => {
                this._state = AudioState.INTERRUPTED;
                this._eventTarget.emit(AudioEvent.INTERRUPTION_BEGIN);
            }).catch((e) => { debug.warn('_onInterruptedBegin error', e); });
        }
    }
    private _onInterruptedEnd (): void {
        if (this._state === AudioState.INTERRUPTED) {
            this.play().then(() => {
                this._eventTarget.emit(AudioEvent.INTERRUPTION_END);
            }).catch((e) => { debug.warn('_onInterruptedEnd error', e); });
        }
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
        audioContextAgent!.setGainValue(this._gainNode, val);
    }
    get duration (): number {
        return this._audioBuffer.duration;
    }
    get currentTime (): number {
        return this._audioTimer.currentTime;
    }
    private offRunning (): void {
        if (this._runningCallback) {
            audioContextAgent!.offRunning(this._runningCallback);
            this._runningCallback = undefined;
        }
    }

    @enqueueOperation
    seek (time: number): Promise<void> {
        return new Promise((resolve) => {
            this.offRunning();
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
        this.offRunning();
        if (EDITOR_NOT_IN_PREVIEW) {
            return Promise.resolve();
        }
        return this._doPlay();
    }

    // The decorated play() method can't be call in seek()
    // so we define this method to ensure that the audio seeking works.
    private _doPlay (): Promise<void> {
        return new Promise((resolve) => {
            if (audioContextAgent!.isRunning) {
                this._startSourceNode();
                resolve();
            } else {
                this.offRunning();
                this._runningCallback = (): void => {
                    this._startSourceNode();
                    resolve();
                };
                // Running event may be emit when:
                // - manually resume audio context.
                // - system automatically resume audio context when enter foreground from background.
                audioContextAgent!.onceRunning(this._runningCallback);
                // Ensure resume context.
                audioContextAgent!.runContext().catch((e) => { debug.warn('doPlay error', e); });
            }
        });
    }

    private _startSourceNode (): void {
        // one AudioBufferSourceNode can't start twice
        this._stopSourceNode();
        this._sourceNode = audioContextAgent!.createBufferSource(this._audioBuffer, this.loop);
        this._sourceNode.connect(this._gainNode);
        this._sourceNode.loop = this._loop;
        this._sourceNode.start(0, this._audioTimer.currentTime);
        this._state = AudioState.PLAYING;
        this._audioTimer.start();

        /* still not supported by all platforms *
        this._sourceNode.onended = this._onEnded;
        /* doing it manually for now */
        const checkEnded = (): void => {
            if (this.loop) {
                this._currentTimer = window.setTimeout(checkEnded, this._audioBuffer.duration * 1000);
            } else {  // do ended
                this._audioTimer.stop();
                this._eventTarget.emit(AudioEvent.ENDED);
                this._state = AudioState.INIT;
            }
        };
        window.clearTimeout(this._currentTimer);
        this._currentTimer = window.setTimeout(checkEnded, (this._audioBuffer.duration - this._audioTimer.currentTime) * 1000);
    }

    private _stopSourceNode (): void {
        try {
            if (this._sourceNode) {
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
        this.offRunning();
        if (this._state !== AudioState.PLAYING || !this._sourceNode) {
            return Promise.resolve();
        }
        this._audioTimer.pause();
        this._state = AudioState.PAUSED;
        window.clearTimeout(this._currentTimer);
        this._stopSourceNode();
        return Promise.resolve();
    }

    @enqueueOperation
    stop (): Promise<void> {
        this.offRunning();
        if (!this._sourceNode) {
            this._audioTimer.stop();
            this._state = AudioState.STOPPED;
            return Promise.resolve();
        }
        this._audioTimer.stop();
        this._state = AudioState.STOPPED;
        window.clearTimeout(this._currentTimer);
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
