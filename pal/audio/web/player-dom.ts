import { AudioEvent, AudioState, AudioType } from "../type";
import { EventTarget } from '../../../cocos/core/event/event-target';
import { legacyCC } from '../../../cocos/core/global-exports';
import { OneShotAudio } from "pal_audio";

export class AudioPlayerDOM {
    private _domAudio: HTMLAudioElement;
    private _eventTarget: EventTarget = new EventTarget();
    private _state: AudioState = AudioState.INIT;
    private _onGesture: () => void;
    private _onHide: () => void;
    private _onShow: () => void;
    private _onEnded: () => void;

    constructor(nativeAudio: HTMLAudioElement) {
        this._domAudio = nativeAudio;

        // event
        // TODO: should not call engine API in pal
        this._onGesture = () => this._eventTarget.emit(AudioEvent.USER_GESTURE);
        legacyCC.game.canvas.addEventListener('touchend', this._onGesture);
        legacyCC.game.canvas.addEventListener('mouseup', this._onGesture);
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
        this._onEnded = () => {
            this.seek(0);
            this._state = AudioState.INIT;
            this._eventTarget.emit(AudioEvent.ENDED)
        };
        this._domAudio.addEventListener('ended', this._onEnded);
    }
    destroy() {
        if (this._onGesture) {
            legacyCC.game.canvas.removeEventListener('touchend', this._onGesture);
            legacyCC.game.canvas.removeEventListener('mouseup', this._onGesture);
            // @ts-ignore
            this._onGesture = undefined;
        }
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
        if (this._onEnded) {
            this._domAudio.removeEventListener('ended', this._onEnded);
            // @ts-ignore
            this._onEnded = undefined;
        }
        // @ts-ignore
        this._domAudio = undefined;
    }
    static load(url: string): Promise<AudioPlayerDOM> {
        return new Promise(resolve => {
            AudioPlayerDOM.loadNative(url).then(domAudio => {
                resolve(new AudioPlayerDOM(domAudio));
            });
        });
    }
    static loadNative(url: string): Promise<HTMLAudioElement> {
        return new Promise((resolve, reject) => {
            let domAudio = document.createElement('audio');
            let loadedEvent = 'canplaythrough';
            let sys = legacyCC.sys;
            if (sys.os === sys.OS_IOS) {
                // iOS no event that used to parse completed callback
                // this time is not complete, can not play
                loadedEvent = 'loadedmetadata';
            }
            else if (sys.browserType === sys.BROWSER_TYPE_FIREFOX) {
                loadedEvent = 'canplay';
            }

            const timer = setTimeout(() => {
                if (domAudio.readyState === 0) {
                    failure();
                } else {
                    success();
                }
            }, 8000);
            const clearEvent = () => {
                clearTimeout(timer);
                domAudio.removeEventListener(loadedEvent, success, false);
                domAudio.removeEventListener('error', failure, false);
            };
            const success = () => {
                clearEvent();
                resolve(domAudio);
            };
            const failure = () => {
                clearEvent();
                const message = `load audio failure - ${url}`;
                reject(message);
            };
            domAudio.addEventListener(loadedEvent, success, false);
            domAudio.addEventListener('error', failure, false);
            domAudio.src = url;
        });
    }
    
    get type(): AudioType {
        return AudioType.DOM_AUDIO;
    }
    get state(): AudioState {
        return this._state;
    }
    get loop(): boolean {
        return this._domAudio.loop;
    }
    set loop(val: boolean) {
        this._domAudio.loop = val;
    }
    get volume(): number {
        return this._domAudio.volume;
    }
    set volume(val: number) {
        this._domAudio.volume = val;
    }
    get duration(): number {
        return this._domAudio.duration;
    }
    get currentTime(): number {
        return this._domAudio.currentTime;
    }
    seek(time: number): Promise<void> {
        this._domAudio.currentTime = time;
        return Promise.resolve();
    }

    private _ensurePlaying(domAudio: HTMLAudioElement): Promise<void> {
        return new Promise(resolve => {
            const promise = domAudio.play();;
            if (!promise) {  // Chrome50/Firefox53 below
                return resolve();
            }
            promise.then(resolve).catch(() => {
                this._eventTarget.once(AudioEvent.USER_GESTURE, () => {
                    domAudio.play();
                    resolve();
                });
            });
        });
    }
    playOneShot(volume: number = 1): OneShotAudio {
        let onPlayCb: () => void;
        let onEndedCb: () => void;
        let domAudio: HTMLAudioElement;
        AudioPlayerDOM.loadNative(this._domAudio.src).then(res => {
            domAudio = res;
            domAudio.volume = volume;
            onEndedCb && domAudio.addEventListener('ended', onEndedCb);
            this._ensurePlaying(domAudio).then(() => {
                onPlayCb &&  onPlayCb();
            });
        });
        let oneShotAudio: OneShotAudio = {
            stop() {
                domAudio.pause();
            },
            onPlay(cb) {
                onPlayCb = cb;
                return this;
            },
            onEnded(cb) {
                onEndedCb = cb;
                return this;
            },
        }
        return oneShotAudio;
    }

    private _ensureStop(): Promise<void> {
        return new Promise(resolve => {
            /* sometimes there is no way to update the playing state
            especially when player unplug earphones and the audio automatically stops
            so we need to force updating the playing state by pausing audio */
            if (this._state === AudioState.PLAYING) {
                return this.stop().then(resolve);
            }
            resolve();
        });
    }
    play(): Promise<void> {
        return new Promise(resolve => {
            this._ensureStop().then(() => {
                this._ensurePlaying(this._domAudio).then(() => {
                    this._state = AudioState.PLAYING;
                    resolve();
                });
            });
        });
    }
    pause(): Promise<void> {
        this._domAudio.pause();
        this._state = AudioState.PAUSED;
        return Promise.resolve();
    }
    stop(): Promise<void> {
        this._domAudio.pause();
        this._state = AudioState.STOPPED;
        return this.seek(0);
    }

    onInterruptionBegin(cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin(cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd(cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd(cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded(cb: () => void) { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded(cb?: () => void) { this._eventTarget.off(AudioEvent.ENDED, cb); }
}