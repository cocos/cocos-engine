import { systemInfo } from 'pal/system-info';

import { EventTarget } from '../../../../core/event';
import { AudioState, AudioEvent, AudioBufferView, PlayerOptions } from '../../../type';
import { AudioClip } from '../../../audio-clip';
import { AudioAction, DynamicPath, Playable } from '../../../impl/playable';

declare const jsb:any;
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
export function playOneShot (clip: AudioClip, volumeScale: number) {
    jsb.AudioEngine.play2d(clip.nativeUrl, false, volumeScale);
}
/**
 * The AudioPlayer is about to deprecated which is used on OHOS with AudioEngine.
 */
export class AudioPlayerDeprecated extends DynamicPath<AudioState, AudioAction> implements Playable {
    _innerOperation = (action: AudioAction) => {
        switch (action) {
        case AudioAction.PLAY:
            if (this._node === AudioState.PAUSED) {
                jsb.AudioEngine.resume(this._audioId);
            } else if (this._node === AudioState.PLAYING) {
                jsb.AudioEngine.stop(this._audioId);
                jsb.AudioEngine.play2d(this._clip.nativeUrl, this._loop, this._volume);
            } else {
                jsb.AudioEngine.play2d(this._clip.nativeUrl, this._loop, this._volume);
            }
            break;
        case AudioAction.PAUSE:
            jsb.AudioEngine.pause(this._audioId);
            break;
        case AudioAction.STOP:
            jsb.AudioEngine.stop(this._audioId);
            break;
        default:
            break;
        }
        this._isTranslating = false;
    }
    // Common members
    _node: AudioState = AudioState.READY;
    //Note: If support WebAudio, use H5 audio element for streaming play, otherwise for dom play.
    // private _domAudio: HTMLAudioElement = new Audio();

    // Time relative
    private _isTranslating = false;
    private _eventTarget = new EventTarget();
    // Start time is used to calculate the current time immediatly and it always update when playbackRate is updated.
    // private _startTime = 0;

    private _loop = false;
    private _volume = 1;
    private _clip: AudioClip;
    private _audioId = -1;

    constructor (clip: AudioClip, options?: PlayerOptions) {
        super();
        this._clip = clip;
        systemInfo.on('hide', this._onHide, this);
        systemInfo.on('show', this._onShow, this);
    }
    set clip (clip: AudioClip) {
        this._clip = clip;
        jsb.AudioEngine.stop(this._audioId);
    }
    get clip (): AudioClip {
        return this._clip;
    }
    get state (): AudioState {
        return this._node;
    }
    // set clip (clip: AudioClip) {
    //     this._sourceNode.url = clip._nativeUrl;
    // }
    // get clip (): AudioClip {
    //     return this._sourceNode.clip;
    // }
    set playbackRate (rate: number) {
        console.error('playback rate setting is not supported on this platform');
    }
    get playbackRate (): number {
        console.error('playback rate setting is not supported on this platform');
        return 1;
    }
    set pan (pan: number) {
        console.error('pan setting is not supported on this platform');
    }
    get pan (): number {
        console.error('pan setting is not supported on this platform');
        return 0;
    }
    destroy () {
        systemInfo.off('hide', this._onHide, this);
        systemInfo.off('show', this._onShow, this);
        this.stop();
    }

    private _onHide () {
        if (this._node === AudioState.PLAYING) {
            if (this._isTranslating) {
                this._updatePathWithLink(this._node, AudioState.INTERRUPTED, AudioAction.PAUSE);
                return;
            }
            this._innerOperation(AudioAction.PAUSE);
            this._node = AudioState.INTERRUPTED;
        }
    }
    private _onShow () {
        // Only interrupted if the old state is playing.
        if (this._node === AudioState.INTERRUPTED) {
            // No path should exist once it's already paused.
            this._innerOperation(AudioAction.PLAY);
            this._node = AudioState.PLAYING;
        }
    }

    get loop (): boolean {
        return this._loop;
    }
    set loop (val: boolean) {
        this._loop = val;
        if (this._audioId !== -1) {
            jsb.AudioEngine.setLoop(this._audioId, val);
        }
    }
    get volume (): number {
        return this._volume;
    }
    set volume (val: number) {
        this._volume = val;
        if (this._audioId !== -1) {
            jsb.AudioEngine.setVolume(this._audioId, val);
        }
    }
    get duration (): number {
        return this._clip.getDuration();
    }
    get currentTime (): number {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return jsb.AudioEngine.getCurrentTime(this._audioId);
    }
    set currentTime (time: number) {
        jsb.AudioEngine.setCurrentTime(this._audioId, time);
    }

    play () {
        this._eventTarget.emit(AudioEvent.PLAYED);
        if (this._dynamicPath.length > 0 || this._isTranslating) {
            this._updatePathWithLink(this._node, AudioState.PLAYING, AudioAction.PLAY);
            return;
        }
        this._isTranslating = true;
        this._innerOperation(AudioAction.PLAY);
    }

    pause () {
        this._eventTarget.emit(AudioEvent.PAUSED);
        if (this._dynamicPath.length > 0 || this._isTranslating) {
            this._updatePathWithLink(this._node, AudioState.PAUSED, AudioAction.PAUSE);
            return;
        }
        this._isTranslating = true;
        this._innerOperation(AudioAction.PAUSE);
    }

    stop () {
        this._eventTarget.emit(AudioEvent.STOPPED);
        if (this._dynamicPath.length > 0 || this._isTranslating) {
            this._updatePathWithLink(this._node, AudioState.STOPPED, AudioAction.STOP);
            return;
        }
        this._isTranslating = true;
        this._innerOperation(AudioAction.STOP);
    }
    private _onEnded () {
        this._eventTarget.emit(AudioEvent.ENDED);
        //
        this._cleanPath();
        this._forceSetNode(AudioState.STOPPED);
    }

    onInterruptionBegin (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded (cb: () => void) { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded (cb?: () => void) { this._eventTarget.off(AudioEvent.ENDED, cb); }
}
