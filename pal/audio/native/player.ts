import { systemInfo } from 'pal/system-info';
import { AudioType, AudioState, AudioEvent } from '../type';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { legacyCC } from '../../../cocos/core/global-exports';
import { clamp, clamp01 } from '../../../cocos/core';
import { enqueueOperation, OperationInfo, OperationQueueable } from '../operation-queue';
import { Platform } from '../../system-info/enum-type';

const urlCount: Record<string, number> = {};
const audioEngine = jsb.AudioEngine;
const INVALID_AUDIO_ID = -1;

export class OneShotAudio {
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

export class AudioPlayer implements OperationQueueable {
    private _url: string;
    private _id: number = INVALID_AUDIO_ID;
    private _state: AudioState = AudioState.INIT;

    // NOTE: the implemented interface properties need to be public access
    public _eventTarget: EventTarget = new EventTarget();
    public _operationQueue: OperationInfo[] = [];

    private _beforePlaying = {
        duration: 1, // wrong value before playing
        loop: false,
        currentTime: 0,
        volume: 1,
    }

    constructor (url: string) {
        this._url = url;

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
    private _onHide () {
        if (this._state === AudioState.PLAYING) {
            this.pause().then(() => {
                this._state = AudioState.INTERRUPTED;
                this._eventTarget.emit(AudioEvent.INTERRUPTION_BEGIN);
            }).catch((e) => {});
        }
    }
    private _onShow () {
        if (this._state === AudioState.INTERRUPTED) {
            this.play().then(() => {
                this._eventTarget.emit(AudioEvent.INTERRUPTION_END);
            }).catch((e) => {});
        }
    }
    static load (url: string): Promise<AudioPlayer> {
        return new Promise((resolve, reject) => {
            AudioPlayer.loadNative(url).then((url) => {
                resolve(new AudioPlayer(url as string));
            }).catch((err) => reject(err));
        });
    }
    static loadNative (url: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if (systemInfo.platform === Platform.WIN32) {
                // NOTE: audioEngine.preload() not works well on Win32 platform.
                // Especially when there is not audio output device.
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
    static loadOneShotAudio (url: string, volume: number): Promise<OneShotAudio> {
        return new Promise((resolve, reject) => {
            AudioPlayer.loadNative(url).then((url) => {
                // @ts-expect-error AudioPlayer should be a friend class in OneShotAudio
                resolve(new OneShotAudio(url, volume));
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
            return this._beforePlaying.loop;
        }
        return audioEngine.isLoop(this._id);
    }
    set loop (val: boolean) {
        if (!this._isValid) {
            this._beforePlaying.loop = val;
        } else  {
            audioEngine.setLoop(this._id, val);
        }
    }
    get volume (): number {
        if (!this._isValid) {
            return this._beforePlaying.volume;
        }
        return audioEngine.getVolume(this._id);
    }
    set volume (val: number) {
        val = clamp01(val);
        if (!this._isValid) {
            this._beforePlaying.volume = val;
        } else {
            audioEngine.setVolume(this._id, val);
        }
    }
    get duration (): number {
        if (!this._isValid) {
            return this._beforePlaying.duration;
        }
        return audioEngine.getDuration(this._id);
    }
    get currentTime (): number {
        if (!this._isValid) {
            return this._beforePlaying.currentTime;
        }
        return audioEngine.getCurrentTime(this._id);
    }

    @enqueueOperation
    seek (time: number): Promise<void> {
        return new Promise((resolve) => {
            // Duration is invalid before player
            // time = clamp(time, 0, this.duration);
            if (!this._isValid) {
                this._beforePlaying.currentTime = time;
                return resolve();
            }
            audioEngine.setCurrentTime(this._id, time);
            return resolve();
        });
    }

    @enqueueOperation
    play (): Promise<void> {
        return new Promise((resolve) => {
            if (this._isValid) {
                if (this._state === AudioState.PAUSED) {
                    audioEngine.resume(this._id);
                } else if (this._state === AudioState.PLAYING) {
                    audioEngine.pause(this._id);
                    audioEngine.setCurrentTime(this._id, 0);
                    audioEngine.resume(this._id);
                }
            } else {
                this._id = audioEngine.play2d(this._url, this._beforePlaying.loop, this._beforePlaying.volume);
                if (this._isValid) {
                    if (this._beforePlaying.currentTime !== 0) {
                        audioEngine.setCurrentTime(this._id, this._beforePlaying.currentTime);
                        this._beforePlaying.currentTime = 0;
                    }
                    audioEngine.setFinishCallback(this._id, () => {
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

// REMOVE_ME
legacyCC.AudioPlayer = AudioPlayer;
