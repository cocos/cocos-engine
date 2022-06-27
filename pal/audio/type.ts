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

    get length () {
        return this._bufferView.length;
    }

    public getData (offset: number) {
        return this._bufferView[offset] * this._normalizeFactor;
    }
}
