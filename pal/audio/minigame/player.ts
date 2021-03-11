import { mg } from 'pal/minigame';
import { OneShotAudio } from 'pal/audio';
import { legacyCC } from '../../../cocos/core/global-exports';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { AudioEvent, AudioState, AudioType } from '../type';
import { clamp, clamp01 } from '../../../cocos/core';

export class AudioPlayer {
    private _innerAudioContext: any;
    private _eventTarget: EventTarget;
    private _state: AudioState = AudioState.INIT;

    private _onHide?: () => void;
    private _onShow?: () => void;

    private _onPlay: () => void;
    private _onPause: () => void;
    private _onStop: () => void;
    private _onSeeked: () => void;
    private _onEnded: () => void;

    constructor (innerAudioContext: any) {
        this._innerAudioContext = innerAudioContext;
        this._eventTarget = new EventTarget();

        // event
        // TODO: should not call engine API in pal
        this._onHide = () => {
            if (this._state === AudioState.PLAYING) {
                this.pause().then(() => {
                    this._state = AudioState.INTERRUPTED;
                    this._eventTarget.emit(AudioEvent.INTERRUPTION_BEGIN);
                }).catch((e) => {});
            }
        };
        legacyCC.game.on(legacyCC.Game.EVENT_HIDE, this._onHide);
        this._onShow = () => {
            if (this._state === AudioState.INTERRUPTED) {
                this.play().then(() => {
                    this._eventTarget.emit(AudioEvent.INTERRUPTION_END);
                }).catch((e) => {});
            }
        };
        legacyCC.game.on(legacyCC.Game.EVENT_SHOW, this._onShow);
        const eventTarget = this._eventTarget;
        this._onPlay = () => {
            this._state = AudioState.PLAYING;
            eventTarget.emit(AudioEvent.PLAYED);
        };
        innerAudioContext.onPlay(this._onPlay);
        this._onPause = () => {
            this._state = AudioState.PAUSED;
            eventTarget.emit(AudioEvent.PAUSED);
        };
        innerAudioContext.onPause(this._onPause);
        this._onStop = () => {
            this._state = AudioState.STOPPED;
            eventTarget.emit(AudioEvent.STOPPED);
        };
        innerAudioContext.onStop(this._onStop);
        this._onSeeked = () => { eventTarget.emit(AudioEvent.SEEKED); };
        innerAudioContext.onSeeked(this._onSeeked);
        this._onEnded = () => {
            this._state = AudioState.INIT;
            eventTarget.emit(AudioEvent.ENDED);
        };
        innerAudioContext.onEnded(this._onEnded);
    }
    destroy () {
        if (this._onShow) {
            legacyCC.game.off(legacyCC.Game.EVENT_SHOW, this._onShow);
            this._onShow = undefined;
        }
        if (this._onHide) {
            legacyCC.game.off(legacyCC.Game.EVENT_HIDE, this._onHide);
            this._onHide = undefined;
        }
        if (this._innerAudioContext) {
            ['Play', 'Pause', 'Stop', 'Seeked', 'Ended'].forEach((event) => {
                this._offEvent(event);
            });
            this._innerAudioContext = null;
        }
    }
    private _offEvent (eventName: string) {
        if (this[`_on${eventName}`]) {
            this._innerAudioContext[`off${eventName}`](this[`_on${eventName}`]);
            this[`_on${eventName}`] = undefined;
        }
    }

    get type (): AudioType {
        return AudioType.MINIGAME_AUDIO;
    }
    static load (url: string): Promise<AudioPlayer> {
        return new Promise((resolve) => {
            AudioPlayer.loadNative(url).then((innerAudioContext) => {
                resolve(new AudioPlayer(innerAudioContext));
            }).catch((e) => {});
        });
    }
    static loadNative (url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const innerAudioContext = mg.createInnerAudioContext();
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
    static readonly maxAudioChannel = 10;

    get state (): AudioState {
        return this._state;
    }
    get loop (): boolean {
        return this._innerAudioContext.loop as boolean;
    }
    set loop (val: boolean) {
        this._innerAudioContext.loop = val;
    }
    get volume (): number {
        return this._innerAudioContext.volume as number;
    }
    set volume (val: number) {
        val = clamp01(val);
        this._innerAudioContext.volume = val;
    }
    get duration (): number {
        return this._innerAudioContext.duration as number;
    }
    get currentTime (): number {
        return this._innerAudioContext.currentTime as number;
    }
    seek (time: number): Promise<void> {
        return new Promise((resolve) => {
            time = clamp(time, 0, this.duration);
            this._eventTarget.once(AudioEvent.SEEKED, resolve);
            this._innerAudioContext.seek(time);
        });
    }

    playOneShot (volume = 1): OneShotAudio {
        let innerAudioContext;
        let onPlayCb: () => void;
        let onEndedCb: () => void;
        AudioPlayer.loadNative(this._innerAudioContext.src).then((res) => {
            innerAudioContext = res;
            innerAudioContext.volume = volume;
            onPlayCb && innerAudioContext.onPlay(onPlayCb);
            onEndedCb && innerAudioContext.onEnded(onEndedCb);
            innerAudioContext.play();
        }).catch((e) => {});
        const oneShotAudio: OneShotAudio = {
            stop () {
                innerAudioContext && innerAudioContext.stop();
            },
            onPlay (cb) {
                onPlayCb = cb;
                return this;
            },
            onEnded (cb) {
                onEndedCb = cb;
                return this;
            },
        };
        return oneShotAudio;
    }

    private _ensureStop (): Promise<void> {
        return new Promise((resolve) => {
            /* sometimes there is no way to update the playing state
            especially when player unplug earphones and the audio automatically stops
            so we need to force updating the playing state by pausing audio */
            if (this._state === AudioState.PLAYING) {
                this.stop().then(resolve).catch((e) => {});
            } else {
                resolve();
            }
        });
    }

    play (): Promise<void> {
        return new Promise((resolve) => {
            this._ensureStop().then(() => {
                this._eventTarget.once(AudioEvent.PLAYED, resolve);
                this._innerAudioContext.play();
            }).catch((e) => {});
        });
    }
    pause (): Promise<void> {
        return new Promise((resolve) => {
            this._eventTarget.once(AudioEvent.PAUSED, resolve);
            this._innerAudioContext.pause();
        });
    }
    stop (): Promise<void> {
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

// REMOVE_ME
legacyCC.AudioPlayer = AudioPlayer;
