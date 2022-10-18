export enum AudioEvent {
    READY = 'ready',
    PLAYED = 'play',
    PAUSED = 'pause',
    STOPPED = 'stop',
    SEEKED = 'seeked',
    ENDED = 'ended',
    INTERRUPTION_BEGIN = 'interruptionBegin',
    INTERRUPTION_END = 'interruptionEnd',
    USER_GESTURE = 'on_gesture',  // only web needed
}

export enum AudioState {
    READY,
    PLAYING,
    PAUSED,
    STOPPED,
    INTERRUPTED,
}

enum AudioErrorCode {
    LOAD_FAILED,
    LOAD_REJECTED,
    PLAY_FAILED,
    PLAY_REJECTED,
    //etc. TODO(timlyeee): Accomplish error mechanism
}

export interface PlayerOptions {
    loop?: boolean;
    volume?: number;
    isDom?: boolean; //Only for web
}
export interface AudioOperationResult {
    success: boolean,
    error: AudioErrorCode,
}
export type AudioBufferView = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export enum AudioFormat {
    UNKNOWN,
    SIGNED_8,
    UNSIGNED_8,
    SIGNED_16,
    UNSIGNED_16,
    SIGNED_32,
    UNSIGNED_32,
    FLOAT_32,
    FLOAT_64
}
export interface AudioPCMHeader {
    totalFrames: number;
    sampleRate: number;
    bytesPerFrame: number;
    audioFormat: AudioFormat;
    channelCount: number;
}
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
