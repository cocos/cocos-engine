/*
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

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
import { AudioType, AudioState, AudioEvent, AudioPCMDataView, AudioBufferView, AudioLoadOptions } from '../type';
import { EventTarget } from '../../../cocos/core/event';
import { legacyCC } from '../../../cocos/core/global-exports';
import { clamp, clamp01 } from '../../../cocos/core';
import { enqueueOperation, OperationInfo, OperationQueueable } from '../operation-queue';
import { Platform } from '../../system-info/enum-type';

const urlCount: Record<string, number> = {};
const INVALID_AUDIO_ID = -1;

enum AudioBufferFormat {
    UNKNOWN = 0,
    SIGNED_8,
    UNSIGNED_8,
    SIGNED_16,
    UNSIGNED_16,
    SIGNED_32,
    UNSIGNED_32,
    FLOAT_32,
    FLOAT_64
}

interface AudioBufferInfo {
    ctor: Constructor<AudioBufferView>,
    maxValue: number;
}

const bufferConstructorMap: Record<number, AudioBufferInfo | undefined> = {
    [AudioBufferFormat.UNKNOWN]: undefined,
    [AudioBufferFormat.SIGNED_8]: { ctor: Int8Array, maxValue: 127 },
    [AudioBufferFormat.UNSIGNED_8]: { ctor: Uint8Array, maxValue: 255 },
    [AudioBufferFormat.SIGNED_16]: { ctor: Int16Array, maxValue: 32767 },
    [AudioBufferFormat.UNSIGNED_16]: { ctor: Uint16Array, maxValue: 65535 },
    [AudioBufferFormat.SIGNED_32]: { ctor: Int32Array, maxValue: 2147483647 },
    [AudioBufferFormat.UNSIGNED_32]: { ctor: Uint32Array, maxValue: 4294967295 },
    // decoded float data is normalized data, so we specify the maxValue as 1.
    [AudioBufferFormat.FLOAT_32]: { ctor: Float32Array, maxValue: 1 },
    [AudioBufferFormat.FLOAT_64]: { ctor: Float64Array, maxValue: 1 },
};

export class OneShotAudio {
    private _id: number = INVALID_AUDIO_ID;
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
        this._onEndCb = cb;
    }

    private constructor (url: string, volume: number)  {
    }
    public play (): void {

    }
    public stop (): void {
        if (this._id === INVALID_AUDIO_ID) {
            return;
        }
    }
}

export class AudioPlayer implements OperationQueueable {
    private _id: number = INVALID_AUDIO_ID;
    private _state: AudioState = AudioState.INIT;
    

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _eventTarget: EventTarget = new EventTarget();
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _operationQueue: OperationInfo[] = [];

    // NOTE: we need to cache the state in case the audio id is invalid.
    private _cachedState = {
        duration: 1, // wrong value before playing
        loop: false,
        currentTime: 0,
        volume: 1,
    }

    constructor (url: string) {

    }
    destroy (): void {

    }
    
    static load (url: string, opts?: AudioLoadOptions): Promise<AudioPlayer> {
        return new Promise((resolve, reject) => {
            AudioPlayer.loadNative(url, opts).then((url) => {
                resolve(new AudioPlayer(url as string));
            }).catch((err) => reject(err));
        });
    }
    static loadNative (url: string, opts?: AudioLoadOptions): Promise<unknown> {
        return new Promise((resolve, reject) => {
            // Todo(qgh): We need to parse the audio file, but this feature is not yet implemented.
            console.warn("Audio file parsing is not supported.");
            resolve(url);
        });
    }
    static loadOneShotAudio (url: string, volume: number, opts?: AudioLoadOptions): Promise<OneShotAudio> {
        return new Promise((resolve, reject) => {
            AudioPlayer.loadNative(url, opts).then((url) => {
                // HACK: AudioPlayer should be a friend class in OneShotAudio
                resolve(new (OneShotAudio as any)(url, volume));
            }).catch(reject);
        });
    }

    private get _isValid (): boolean {
        return this._id !== INVALID_AUDIO_ID;
    }

    get src (): string {
        return "";
    }
    get type (): AudioType {
        return AudioType.NATIVE_AUDIO;
    }
    get state (): AudioState {
        return this._state;
    }
    get loop (): boolean {
        if (!this._isValid) {
            return this._cachedState.loop;
        }
        return false;
    }
    set loop (val: boolean) {
        if (this._isValid) {
        }
        this._cachedState.loop = val;
    }
    get volume (): number {
        if (!this._isValid) {
            return this._cachedState.volume;
        }
        return 0;
    }
    set volume (val: number) {
        val = clamp01(val);
        if (this._isValid) {
        }
        this._cachedState.volume = val;
    }
    get duration (): number {
        if (!this._isValid) {
            return this._cachedState.duration;
        }
        return 0;
    }
    get currentTime (): number {
        if (!this._isValid) {
            return this._cachedState.currentTime;
        }
        return 0;
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
            // Duration is invalid before player
            // time = clamp(time, 0, this.duration);
            if (this._isValid) {
            }
            this._cachedState.currentTime = time;
            return resolve();
        });
    }

    @enqueueOperation
    play (): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }

    @enqueueOperation
    pause (): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }

    @enqueueOperation
    stop (): Promise<void> {
        return new Promise((resolve) => {
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

// REMOVE_ME
legacyCC.AudioPlayer = AudioPlayer;
