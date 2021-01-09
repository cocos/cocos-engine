// import { AudioPlayer as IAudioPlayer} from 'pal/audio';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { AudioEvent, AudioState } from '../type';

// export class AudioPlayer implements IAudioPlayer{
export class AudioPlayer {
    private _innerAudioContext: any;
    private _eventTarget: EventTarget;
    private _state: AudioState = AudioState.INIT;
    private _volume = 0;
    private _loop = false;
    private _duration = 0;

    constructor (nativeAudio: any) {
        this._innerAudioContext = nativeAudio; 
        this._eventTarget = new EventTarget();

        // event register
        let eventTarget = this._eventTarget;
        nativeAudio.onPlay(() => { eventTarget.emit(AudioEvent.PLAYED); });
        nativeAudio.onPause(() => { eventTarget.emit(AudioEvent.PAUSED); });
        nativeAudio.onStop(() => { eventTarget.emit(AudioEvent.STOPPED); });
        nativeAudio.onSeeked(() => { eventTarget.emit(AudioEvent.SEEKED); });
        nativeAudio.onEnded(() => { eventTarget.emit(AudioEvent.ENDED); });
    }
    static async load (url: string): Promise<AudioPlayer> {
        let innerAudioContext = await AudioPlayer.loadNative(url);
        return new AudioPlayer(innerAudioContext);
    }
    static loadNative (url: string): Promise<any> {
        return new Promise(resolve => {
            // @ts-ignore
            let innerAudioContext = wx.createInnerAudioContext();
            // TODO: handle timeout
            innerAudioContext.onCanplay(() => {
                resolve(innerAudioContext);
            });
            innerAudioContext.src = url;
        });
    }
    static playOneShot(nativeAudio: any, volume: number = 1): Promise<void> {
        nativeAudio.volume = volume;
        return nativeAudio.play();
    }

    get state(): AudioState {
        return this._state;
    }
    get loop(): boolean {
        return this._loop;
    }
    set loop(val: boolean) {
        this._innerAudioContext.loop = val;
        this._loop = val;
    }
    get volume(): number {
        return this._volume;
    }
    set volume(val: number) {
        this._innerAudioContext.volume = val;
        this._volume = val;
    }
    get duration(): number {
        return this._duration;
    }
    get currentTime(): number {
        return this._innerAudioContext.currentTime;
    }
    seek(time: number): Promise<void> {
        return new Promise(resolve => {
            this._eventTarget.once(AudioEvent.SEEKED, resolve);
            this._innerAudioContext.seek(time);
        });
    }

    play (): Promise<void> {
        return new Promise(resolve => {
            this._eventTarget.once(AudioEvent.PLAYED, resolve);
            this._innerAudioContext.play();
        });
    }
    pause (): Promise<void> {
        return new Promise(resolve => {
            this._eventTarget.once(AudioEvent.PAUSED, resolve);
            this._innerAudioContext.pause();
        });
    }
    stop (): Promise<void> {
        return new Promise(resolve => {
            this._eventTarget.once(AudioEvent.STOPPED, resolve);
            this._innerAudioContext.stop();
        });
    }

    onInterruptionBegin(cb: any) { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin(cb?: any) { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd(cb: any) { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd(cb?: any) { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded (cb) { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded (cb?) { this._eventTarget.off(AudioEvent.ENDED, cb); }
}