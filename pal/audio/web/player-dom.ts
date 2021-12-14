import { systemInfo } from 'pal/system-info';
import { AudioEvent, AudioState, AudioType } from '../type';
import { EventTarget } from '../../../cocos/core/event';
import { clamp, clamp01 } from '../../../cocos/core';
import { enqueueOperation, OperationInfo, OperationQueueable } from '../operation-queue';
import { BrowserType, OS } from '../../system-info/enum-type';

function ensurePlaying (domAudio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve) => {
        const promise = domAudio.play();
        if (promise === undefined) {  // Chrome50/Firefox53 below
            return resolve();
        }
        promise.then(resolve).catch(() => {
            const onGesture = () => {
                domAudio.play().catch((e) => {});
                resolve();
            };
            const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            canvas?.addEventListener('touchend', onGesture, { once: true });
            canvas?.addEventListener('mousedown', onGesture, { once: true });
        });
        return null;
    });
}

export class OneShotAudioDOM {
    private _domAudio: HTMLAudioElement;
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
        if (this._onEndCb) {
            this._domAudio.removeEventListener('ended', this._onEndCb);
        }
        this._onEndCb = cb;
        if (cb) {
            this._domAudio.addEventListener('ended', cb);
        }
    }

    private constructor (nativeAudio: HTMLAudioElement, volume: number) {
        this._domAudio = nativeAudio;
        nativeAudio.volume =  volume;
    }
    public play (): void {
        ensurePlaying(this._domAudio).then(() => {
            this.onPlay?.();
        }).catch((e) => {});
    }
    public stop (): void {
        this._domAudio.pause();
    }
}

export class AudioPlayerDOM implements OperationQueueable {
    private _domAudio: HTMLAudioElement;
    private _state: AudioState = AudioState.INIT;
    private _onEnded: () => void;

    /**
     * @private_cc
     */
    public _eventTarget: EventTarget = new EventTarget();
    /**
     * @private_cc
     */
    public _operationQueue: OperationInfo[] = [];

    constructor (nativeAudio: HTMLAudioElement) {
        this._domAudio = nativeAudio;

        // event
        systemInfo.on('hide', this._onHide, this);
        systemInfo.on('show', this._onShow, this);
        this._onEnded = () => {
            this.seek(0).catch((e) => {});
            this._state = AudioState.INIT;
            this._eventTarget.emit(AudioEvent.ENDED);
        };
        this._domAudio.addEventListener('ended', this._onEnded);
    }

    destroy () {
        systemInfo.off('hide', this._onHide, this);
        systemInfo.off('show', this._onShow, this);
        this._domAudio.removeEventListener('ended', this._onEnded);
        // @ts-expect-error need to release DOM Audio instance
        this._domAudio = null;
    }
    static load (url: string): Promise<AudioPlayerDOM> {
        return new Promise((resolve) => {
            AudioPlayerDOM.loadNative(url).then((domAudio) => {
                resolve(new AudioPlayerDOM(domAudio));
            }).catch((e) => {});
        });
    }
    static loadNative (url: string): Promise<HTMLAudioElement> {
        return new Promise((resolve, reject) => {
            const domAudio = document.createElement('audio');
            let loadedEvent = 'canplaythrough';
            if (systemInfo.os === OS.IOS) {
                // iOS no event that used to parse completed callback
                // this time is not complete, can not play
                loadedEvent = 'loadedmetadata';
            } else if (systemInfo.browserType === BrowserType.FIREFOX) {
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
    static loadOneShotAudio (url: string, volume: number): Promise<OneShotAudioDOM> {
        return new Promise((resolve, reject) => {
            AudioPlayerDOM.loadNative(url).then((domAudio) => {
                // @ts-expect-error AudioPlayer should be a friend class in OneShotAudio
                const oneShotAudio = new OneShotAudioDOM(domAudio, volume);
                resolve(oneShotAudio);
            }).catch(reject);
        });
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

    get src (): string {
        return this._domAudio ? this._domAudio.src : '';
    }
    get type (): AudioType {
        return AudioType.DOM_AUDIO;
    }
    get state (): AudioState {
        return this._state;
    }
    get loop (): boolean {
        return this._domAudio.loop;
    }
    set loop (val: boolean) {
        this._domAudio.loop = val;
    }
    get volume (): number {
        return this._domAudio.volume;
    }
    set volume (val: number) {
        val = clamp01(val);
        this._domAudio.volume = val;
    }
    get duration (): number {
        return this._domAudio.duration;
    }
    get currentTime (): number {
        return this._domAudio.currentTime;
    }

    @enqueueOperation
    seek (time: number): Promise<void> {
        time = clamp(time, 0, this.duration);
        this._domAudio.currentTime = time;
        return Promise.resolve();
    }

    @enqueueOperation
    play (): Promise<void> {
        return new Promise((resolve) => {
            ensurePlaying(this._domAudio).then(() => {
                this._state = AudioState.PLAYING;
                resolve();
            }).catch((e)  => {});
        });
    }

    @enqueueOperation
    pause (): Promise<void> {
        this._domAudio.pause();
        this._state = AudioState.PAUSED;
        return Promise.resolve();
    }

    @enqueueOperation
    stop (): Promise<void> {
        return new Promise((resolve) => {
            this._domAudio.pause();
            this._domAudio.currentTime = 0;
            this._state = AudioState.STOPPED;
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
