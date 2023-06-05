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

export enum AudioEvent {
    PLAYED = 'play',
    PAUSED = 'pause',
    STOPPED = 'stop',
    SEEKED = 'seeked',
    ENDED = 'ended',
    INTERRUPTION_BEGIN = 'interruptionBegin',
    INTERRUPTION_END = 'interruptionEnd',
    USER_GESTURE = 'on_gesture',  // only web needed
}

export enum AudioType {
    DOM_AUDIO,
    WEB_AUDIO,
    MINIGAME_AUDIO,
    NATIVE_AUDIO,
    UNKNOWN_AUDIO,
}

export interface AudioLoadOptions {
    audioLoadMode?: AudioType,
}

export enum AudioState {
    INIT,
    PLAYING,
    PAUSED,
    STOPPED,
    INTERRUPTED,
}

export type AudioBufferView = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

export class AudioPCMDataView {
    private _bufferView: AudioBufferView;
    private _normalizeFactor = 1;

    constructor (arrayBufferView: AudioBufferView, normalizeFactor: number);
    constructor (arrayBuffer: ArrayBuffer, Ctor: Constructor<AudioBufferView>, normalizeFactor: number);
    constructor (...args: any[]) {
        if (args.length === 2) {
            this._bufferView = args[0] as AudioBufferView;
            this._normalizeFactor = args[1] as number;
        } else {
            const arrayBuffer = args[0] as ArrayBuffer;
            const Ctor = args[1] as Constructor<AudioBufferView>;
            const normalizeFactor = args[2] as number;
            this._bufferView = new Ctor(arrayBuffer);
            this._normalizeFactor = normalizeFactor;
        }
    }

    get length (): number {
        return this._bufferView.length;
    }

    public getData (offset: number): number {
        return this._bufferView[offset] * this._normalizeFactor;
    }
}
