import { AudioPlayer as IAudioPlayer, OneShotAudio } from 'pal/audio';
import { AudioType, AudioState, AudioEvent } from '../type';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { legacyCC } from '../../../cocos/core/global-exports';

const urlCount: Record<string, number> = {};
const audioEngine = jsb.AudioEngine;
const INVALID_AUDIO_ID = -1;

// TODO: set state before playing
export class AudioPlayer implements IAudioPlayer {
    private _url: string;
    private _id: number = INVALID_AUDIO_ID;
    private _eventTarget: EventTarget = new EventTarget();
    private _state: AudioState = AudioState.INIT;

    private _onHide: () => void;
    private _onShow: () => void;

    private _beforePlaying = {
        duration: 0, // wrong value before playing
        loop: false,
        currentTime: 0,
        volume: 1,
    }

    constructor(url: string) {
        this._url = url;

        // event
        // TODO: should not call engine API in pal
        this._onHide = () => {
            if (this._state === AudioState.PLAYING) {
                this.pause().then(() => {
                    this._state = AudioState.INTERRUPTED;
                    this._eventTarget.emit(AudioEvent.INTERRUPTION_BEGIN);
                });
            }
        };
        legacyCC.game.on(legacyCC.Game.EVENT_HIDE, this._onHide);
        this._onShow = () => {
            if (this._state === AudioState.INTERRUPTED) {
                this.play().then(() => {
                    this._eventTarget.emit(AudioEvent.INTERRUPTION_END);
                });
            }
        };
        legacyCC.game.on(legacyCC.Game.EVENT_SHOW, this._onShow);
    }
    destroy() {
        if (this._onShow) {
            legacyCC.game.off(legacyCC.Game.EVENT_SHOW, this._onShow);
            // @ts-ignore
            this._onShow = undefined;
        }
        if (this._onHide) {
            legacyCC.game.off(legacyCC.Game.EVENT_HIDE, this._onHide);
            // @ts-ignore
            this._onHide = undefined;
        }
        if (--urlCount[this._url] <= 0) {
            audioEngine.uncache(this._url);
        }
    }
    static load(url: string): Promise<AudioPlayer> {
        return new Promise((resolve, reject) => {
            AudioPlayer.loadNative(url).then(url => {
                resolve(new AudioPlayer(url));
            }).catch(err => reject(err));
        });
    }
    static loadNative(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            audioEngine.preload(url, isSuccess => {
                if (isSuccess) {
                    resolve(url);
                }
                else {
                    reject(new Error('load audio failed'));
                }
            });
        });
    }
    static maxAudioChannel: number = audioEngine.getMaxAudioInstance();

    private get _isValid (): boolean {
        return this._id !== INVALID_AUDIO_ID;
    }
    
    get type(): AudioType {
        return AudioType.NATIVE_AUDIO;
    }
    get state(): AudioState {
        return this._state;
    }
    get loop(): boolean {
        if (!this._isValid) {
            return this._beforePlaying.loop;
        }
        return audioEngine.isLoop(this._id);
    }
    set loop(val: boolean) {
        if (!this._isValid) {
            this._beforePlaying.loop = val;
            return;
        }
        audioEngine.setLoop(this._id, val);
    }
    get volume(): number {
        if (!this._isValid) {
            return this._beforePlaying.volume;
        }
        return audioEngine.getVolume(this._id);
    }
    set volume(val: number) {
        if (!this._isValid) {
            this._beforePlaying.volume = val;
            return;
        }
        audioEngine.setVolume(this._id, val);
    }
    get duration(): number {
        if (!this._isValid) {
            return this._beforePlaying.duration;
        }
        return audioEngine.getDuration(this._id);
    }
    get currentTime(): number {
        if (!this._isValid) {
            return this._beforePlaying.currentTime;
        }
        return audioEngine.getCurrentTime(this._id);
    }
    seek(time: number): Promise<void> {
        return new Promise(resolve => {
            if (!this._isValid) {
                this._beforePlaying.currentTime = time;
                return resolve();
            }
            audioEngine.setCurrentTime(this._id, time);
            resolve();
        });
    }
    playOneShot(volume: number = 1): OneShotAudio {
        let id = INVALID_AUDIO_ID;
        let onPlayCb: () => void;
        let onEndedCb: () => void;
        setTimeout(() => {
            id = audioEngine.play2d(this._url, false, 1);
            onPlayCb && onPlayCb();
            onEndedCb && audioEngine.setFinishCallback(id, onEndedCb);
        });
        return {
            stop () {
                if (id !== INVALID_AUDIO_ID) {
                    audioEngine.stop(id);
                }
            },
            onPlay (cb) {
                onPlayCb = cb;
                return this;
            },
            onEnded (cb) {
                onEndedCb = cb;
                return this;
            },
        }
    }
    play(): Promise<void> {
        return new Promise(resolve => {
            if (this._isValid) {
                if (this._state === AudioState.PAUSED) {
                    audioEngine.resume(this._id);
                }
                else if (this._state === AudioState.PLAYING) {
                    audioEngine.pause(this._id);
                    audioEngine.setCurrentTime(this._id, 0);
                    audioEngine.resume(this._id);
                }
            }
            else {
                this._id = audioEngine.play2d(this._url, this._beforePlaying.loop, this._beforePlaying.volume);
                if (this._isValid) {
                    if (this._beforePlaying.currentTime !== 0) {
                        audioEngine.setCurrentTime(this._id, this._beforePlaying.currentTime);
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
    pause(): Promise<void> {
        return new Promise(resolve => {
            if (this._isValid) {
                audioEngine.pause(this._id);
            }
            this._state = AudioState.PAUSED;
            resolve();
        });
    }
    stop(): Promise<void> {
        return new Promise(resolve => {
            if (this._isValid) {
                audioEngine.stop(this._id);
            }
            this._state = AudioState.STOPPED;
            this._id = INVALID_AUDIO_ID;
            resolve();
        });
    }
    onInterruptionBegin(cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin(cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd(cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd(cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded(cb: () => void) { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded(cb?: () => void) { this._eventTarget.off(AudioEvent.ENDED, cb); }
}

// REMOVE_ME
legacyCC.AudioPlayer = AudioPlayer;