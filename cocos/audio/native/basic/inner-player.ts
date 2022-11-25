import { systemInfo } from 'pal/system-info';
import { enqueueOperation, BaseInnerAudioPlayer, OperationInfo, OperationQueueable } from '../../base';
import { AudioBufferView, AudioEvent, AudioPCMDataView, AudioState, AudioType } from '../../type';
import { EventTarget } from '../../../core/event';
import { Platform } from '../../../../pal/system-info/enum-type';
import { clamp01 } from '../../../core';
import { legacyCC } from '../../../core/global-exports';

const urlCount: Record<string, number> = {};
const audioEngine = jsb.AudioEngine;
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

export class NativeOneShotAudio {
    private _id: number = INVALID_AUDIO_ID;
    private _url: string;
    private _volume: number;
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

    private constructor (url: string, volume: number)  {
        this._url = url;
        this._volume = volume;
    }
    public play (): void {
        this._id = jsb.AudioEngine.play2d(this._url, false, this._volume);
        jsb.AudioEngine.setFinishCallback(this._id, () => {
            this.onEnd?.();
        });
        this.onPlay?.();
    }
    public stop (): void {
        if (this._id === INVALID_AUDIO_ID) {
            return;
        }
        jsb.AudioEngine.stop(this._id);
    }
}

export class NativeInnerAudioPlayer extends BaseInnerAudioPlayer {
    protected _onEnded: () => void;
    private _url: string;
    private _id: number = INVALID_AUDIO_ID;
    protected _state: AudioState = AudioState.INIT;
    private _pcmHeader: jsb.PCMHeader | null;

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
        super();
        this._onEnded = () => {};
        this._url = url;
        // this._pcmHeader = audioEngine.getPCMHeader(url);
        this._pcmHeader = null;
        // event
        systemInfo.on('hide', this._onHide, this);
        systemInfo.on('show', this._onShow, this);
    }
    destroy () {
        systemInfo.on('hide', this._onHide, this);
        systemInfo.on('show', this._onShow, this);
        if (--urlCount[this._url] <= 0) {
            audioEngine.uncache(this._url);
        }
    }
    protected _onHide () {
        if (this._state === AudioState.PLAYING) {
            this.pause().then(() => {
                this._state = AudioState.INTERRUPTED;
                this._eventTarget.emit(AudioEvent.INTERRUPTION_BEGIN);
            }).catch((e) => {});
        }
    }
    protected _onShow () {
        if (this._state === AudioState.INTERRUPTED) {
            this.play().then(() => {
                this._eventTarget.emit(AudioEvent.INTERRUPTION_END);
            }).catch((e) => {});
        }
    }
    static load (url: string): Promise<NativeInnerAudioPlayer> {
        return new Promise((resolve, reject) => {
            NativeInnerAudioPlayer.loadNative(url).then((url) => {
                resolve(new NativeInnerAudioPlayer(url as string));
            }).catch((err) => reject(err));
        });
    }
    static loadNative (url: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if (systemInfo.platform === Platform.WIN32) {
                // NOTE: audioEngine.preload() not works well on Win32 platform.
                // Especially when there is not audio output device. But still need to preload
                audioEngine.preload(url, (isSuccess) => {
                    console.debug('somehow preload success on windows');
                });
                resolve(url);
            } else {
                audioEngine.preload(url, (isSuccess) => {
                    if (isSuccess) {
                        resolve(url);
                    } else {
                        reject(new Error('load audio failed'));
                    }
                });
            }
        });
    }
    static loadOneShotAudio (url: string, volume: number): Promise<NativeOneShotAudio> {
        return new Promise((resolve, reject) => {
            NativeInnerAudioPlayer.loadNative(url).then((url) => {
                // @ts-expect-error AudioPlayer should be a friend class in OneShotAudio
                resolve(new NativeOneShotAudio(url, volume));
            }).catch(reject);
        });
    }
    static readonly maxAudioChannel: number = audioEngine.getMaxAudioInstance();

    private get _isValid (): boolean {
        return this._id !== INVALID_AUDIO_ID;
    }

    get src () {
        return this._url;
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
        return audioEngine.isLoop(this._id);
    }
    set loop (val: boolean) {
        if (this._isValid) {
            audioEngine.setLoop(this._id, val);
        }
        this._cachedState.loop = val;
    }
    get volume (): number {
        if (!this._isValid) {
            return this._cachedState.volume;
        }
        return audioEngine.getVolume(this._id);
    }
    set volume (val: number) {
        val = clamp01(val);
        if (this._isValid) {
            audioEngine.setVolume(this._id, val);
        }
        this._cachedState.volume = val;
    }
    get duration (): number {
        if (!this._isValid) {
            return this._cachedState.duration;
        }
        return audioEngine.getDuration(this._id);
    }
    get currentTime (): number {
        if (!this._isValid) {
            return this._cachedState.currentTime;
        }
        return audioEngine.getCurrentTime(this._id);
    }

    get sampleRate (): number {
        if (this._pcmHeader === null) {
            this._pcmHeader = jsb.AudioEngine.getPCMHeader(this._url);
        }
        return this._pcmHeader.sampleRate;
    }

    public getPCMData (channelIndex: number): AudioPCMDataView | undefined {
        const arrayBuffer = audioEngine.getOriginalPCMBuffer(this._url, channelIndex);
        if (this._pcmHeader === null) {
            this._pcmHeader = jsb.AudioEngine.getPCMHeader(this._url);
        }
        const audioBufferInfo = bufferConstructorMap[this._pcmHeader.audioFormat];
        if (!arrayBuffer || !audioBufferInfo) {
            return undefined;
        }
        return new AudioPCMDataView(arrayBuffer, audioBufferInfo.ctor, 1 / audioBufferInfo.maxValue);
    }

    @enqueueOperation
    seek (time: number): Promise<void> {
        return new Promise((resolve) => {
            // Duration is invalid before player
            // time = clamp(time, 0, this.duration);
            if (this._isValid) {
                audioEngine.setCurrentTime(this._id, time);
            }
            this._cachedState.currentTime = time;
            return resolve();
        });
    }

    @enqueueOperation
    play (): Promise<void> {
        return new Promise((resolve) => {
            if (this._isValid) {
                if (this._state === AudioState.PAUSED || this._state === AudioState.INTERRUPTED) {
                    audioEngine.resume(this._id);
                } else if (this._state === AudioState.PLAYING) {
                    audioEngine.pause(this._id);
                    audioEngine.setCurrentTime(this._id, 0);
                    audioEngine.resume(this._id);
                }
            } else {
                this._id = audioEngine.play2d(this._url, this._cachedState.loop, this._cachedState.volume);
                if (this._isValid) {
                    if (this._cachedState.currentTime !== 0) {
                        audioEngine.setCurrentTime(this._id, this._cachedState.currentTime);
                        this._cachedState.currentTime = 0;
                    }
                    audioEngine.setFinishCallback(this._id, () => {
                        this._cachedState.currentTime = 0;
                        this._id = INVALID_AUDIO_ID;
                        this._state = AudioState.INIT;
                        this._eventTarget.emit(AudioEvent.ENDED);
                    });
                }
            }
            this._state = AudioState.PLAYING;
            resolve();
        });
    }

    @enqueueOperation
    pause (): Promise<void> {
        return new Promise((resolve) => {
            if (this._isValid) {
                audioEngine.pause(this._id);
            }
            this._state = AudioState.PAUSED;
            resolve();
        });
    }

    @enqueueOperation
    stop (): Promise<void> {
        return new Promise((resolve) => {
            if (this._isValid) {
                audioEngine.stop(this._id);
            }
            this._state = AudioState.STOPPED;
            this._id = INVALID_AUDIO_ID;
            this._cachedState.currentTime = 0;
            resolve();
        });
    }
    onInterruptionBegin (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded (cb: () => void) { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded (cb?: () => void) { this._eventTarget.off(AudioEvent.ENDED, cb); }
}
