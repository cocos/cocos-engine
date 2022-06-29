import { minigame } from 'pal/minigame';
import { systemInfo } from 'pal/system-info';
import { EventTarget } from '../../../cocos/core/event';
import { AudioEvent, AudioPCMDataView, AudioState, AudioType } from '../type';
import { clamp, clamp01 } from '../../../cocos/core';
import { enqueueOperation, OperationInfo, OperationQueueable } from '../operation-queue';

export class OneShotAudioMinigame {
    private _innerAudioContext: InnerAudioContext;
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

    private constructor (nativeAudio: InnerAudioContext, volume: number) {
        this._innerAudioContext = nativeAudio;
        nativeAudio.volume = volume;
        nativeAudio.onPlay(() => {
            this._onPlayCb?.();
        });
        nativeAudio.onEnded(() => {
            this._onEndCb?.();
            nativeAudio.destroy();
            // @ts-expect-error Type 'null' is not assignable to type 'InnerAudioContext'.
            this._innerAudioContext = null;
        });
    }
    public play (): void {
        this._innerAudioContext.play();
    }
    public stop (): void {
        this._innerAudioContext.stop();
    }
}

export class AudioPlayerMinigame implements OperationQueueable {
    private _innerAudioContext: InnerAudioContext;
    private _state: AudioState = AudioState.INIT;

    private _onPlay: () => void;
    private _onPause: () => void;
    private _onStop: () => void;
    private _onSeeked: () => void;
    private _onEnded: () => void;
    private _readyToHandleOnShow = false;

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _eventTarget: EventTarget = new EventTarget();
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _operationQueue: OperationInfo[] = [];

    constructor (innerAudioContext: InnerAudioContext) {
        this._innerAudioContext = innerAudioContext;
        this._eventTarget = new EventTarget();

        // event
        systemInfo.on('hide', this._onHide, this);
        systemInfo.on('show', this._onShow, this);
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
        systemInfo.off('hide', this._onHide, this);
        systemInfo.off('show', this._onShow, this);
        if (this._innerAudioContext) {
            ['Play', 'Pause', 'Stop', 'Seeked', 'Ended'].forEach((event) => {
                this._offEvent(event);
            });
            this._innerAudioContext.destroy();
            // @ts-expect-error Type 'null' is not assignable to type 'InnerAudioContext'
            this._innerAudioContext = null;
        }
    }
    private _onHide () {
        if (this._state === AudioState.PLAYING) {
            this.pause().then(() => {
                this._state = AudioState.INTERRUPTED;
                this._readyToHandleOnShow = true;
                this._eventTarget.emit(AudioEvent.INTERRUPTION_BEGIN);
            }).catch((e) => {});
        }
    }
    private _onShow () {
        // We don't know whether onShow or resolve callback in pause promise is called at first.
        if (!this._readyToHandleOnShow) {
            this._eventTarget.once(AudioEvent.INTERRUPTION_BEGIN, this._onShow, this);
            return;
        }
        if (this._state === AudioState.INTERRUPTED) {
            this.play().then(() => {
                this._eventTarget.emit(AudioEvent.INTERRUPTION_END);
            }).catch((e) => {});
        }
        this._readyToHandleOnShow = false;
    }
    private _offEvent (eventName: string) {
        if (this[`_on${eventName}`]) {
            this._innerAudioContext[`off${eventName}`](this[`_on${eventName}`]);
            this[`_on${eventName}`] = null;
        }
    }

    get src () {
        return this._innerAudioContext ? this._innerAudioContext.src : '';
    }
    get type (): AudioType {
        return AudioType.MINIGAME_AUDIO;
    }
    static load (url: string): Promise<AudioPlayerMinigame> {
        return new Promise((resolve) => {
            AudioPlayerMinigame.loadNative(url).then((innerAudioContext) => {
                resolve(new AudioPlayerMinigame(<InnerAudioContext>innerAudioContext));
            }).catch((e) => {});
        });
    }
    static loadNative (url: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            const innerAudioContext = minigame.createInnerAudioContext();
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
    static loadOneShotAudio (url: string, volume: number): Promise<OneShotAudioMinigame> {
        return new Promise((resolve, reject) => {
            AudioPlayerMinigame.loadNative(url).then((innerAudioContext) => {
                // @ts-expect-error AudioPlayer should be a friend class in OneShotAudio
                resolve(new OneShotAudioMinigame(innerAudioContext, volume));
            }).catch(reject);
        });
    }

    get state (): AudioState {
        return this._state;
    }
    get loop (): boolean {
        return this._innerAudioContext.loop;
    }
    set loop (val: boolean) {
        this._innerAudioContext.loop = val;
    }
    get volume (): number {
        return this._innerAudioContext.volume;
    }
    set volume (val: number) {
        val = clamp01(val);
        this._innerAudioContext.volume = val;
    }
    get duration (): number {
        // KNOWN ISSUES: duration doesn't work well
        // On WeChat platform, duration is 0 at the time audio is loaded.
        // On Native or Runtime platform, duration is 0 before playing.
        return this._innerAudioContext.duration;
    }
    get currentTime (): number {
        // KNOWN ISSUES: currentTime doesn't work well
        // on Baidu: currentTime returns without numbers on decimal places
        // on WeChat iOS: we can't reset currentTime to 0 when stop audio
        return this._innerAudioContext.currentTime;
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
            time = clamp(time, 0, this.duration);
            if (time === 0 && this.currentTime === 0) {
                // skip invalid seek
                resolve();
            } else {
                this._eventTarget.once(AudioEvent.SEEKED, resolve);
                this._innerAudioContext.seek(time);
            }
        });
    }

    @enqueueOperation
    play (): Promise<void> {
        return new Promise((resolve) => {
            this._eventTarget.once(AudioEvent.PLAYED, resolve);
            this._innerAudioContext.play();
        });
    }

    @enqueueOperation
    pause (): Promise<void> {
        return new Promise((resolve) => {
            this._eventTarget.once(AudioEvent.PAUSED, resolve);
            this._innerAudioContext.pause();
        });
    }

    @enqueueOperation
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
