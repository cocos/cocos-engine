import { systemInfo } from 'pal/system-info';
import { AudioContext, SourceNode, defaultContext } from './audio';
import { DynamicPath, Playable, AudioAction } from '../playable';
import { AudioEvent, AudioState, PlayerOptions } from '../../type';
import { AudioClip } from '../../audio-clip';
import { EventTarget } from '../../../core/event';
import { clamp, clamp01 } from '../../../core';
import { audioBufferManager } from './audio-buffer-manager';
/**
 *
 */
export class AudioPlayerX extends DynamicPath<AudioState, AudioAction> implements Playable {
    _innerOperation = (action: AudioAction) => {
        switch (action) {
        case AudioAction.PLAY:
            this._sourceNode.start();
            break;
        case AudioAction.PAUSE:
            this._sourceNode.pause();
            break;
        case AudioAction.STOP:
            this._sourceNode.stop();
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

    private _sourceNode: SourceNode;
    private _stereo: StereoPannerNode;
    // private _ctx: AudioContext;
    private _clip: AudioClip;

    constructor (clip: AudioClip, options?: PlayerOptions) {
        super();
        const buffer = audioBufferManager.getCache(clip.nativeUrl);
        if (buffer) {
            this._sourceNode = new SourceNode(defaultContext, buffer);
        } else {
            this._sourceNode = new SourceNode(defaultContext);
            audioBufferManager.loadBuffer(clip.nativeUrl).then((buffer) => {
                this._sourceNode.buffer = buffer;
            }).catch(() => {
                console.error(`buffer load failed with no reason`);
            });
        }

        this._sourceNode.onEnded = this._onEnded;
        this._clip = clip;
        // this._ctx = defaultContext;
        this._stereo = defaultContext.createStereoPanner();
        this._stereo.connect(defaultContext.destination);
        this._sourceNode.connect(this._stereo);
        if (options) {
            if (options.volume) {
                this._sourceNode.volume = options.volume;
            }
            if (options.loop) {
                this._sourceNode.loop = options.loop;
            }
        }
        systemInfo.on('hide', this._onHide, this);
        systemInfo.on('show', this._onShow, this);
    }
    set clip (clip: AudioClip) {
        // throw new Error('Method not implemented.');
        this._clip = clip;
        const buffer = audioBufferManager.getCache(clip.nativeUrl);
        if (buffer) {
            this._sourceNode.buffer = buffer;
            audioBufferManager.retainCache(clip.nativeUrl);
        } else {
            audioBufferManager.loadBuffer(clip.nativeUrl).then((buffer) => {
                this._sourceNode.buffer = buffer;

                audioBufferManager.retainCache(clip.nativeUrl);
            }).catch(() => {
                throw new Error('load buffer failed');
            });
        }
    }
    get clip (): AudioClip {
        // throw new Error('Method not implemented.');
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
        this._sourceNode.playbackRate = rate;
    }
    get playbackRate (): number {
        return this._sourceNode.playbackRate;
    }
    set pan (pan: number) {
        console.log(`Pan setting ${pan}`);
        this._stereo.pan.value = pan;
    }
    get pan (): number {
        return this._stereo.pan.value;
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
        return this._sourceNode.loop;
    }
    set loop (val: boolean) {
        this._sourceNode.loop = val;
    }
    get volume (): number {
        return this._sourceNode.volume;
    }
    set volume (val: number) {
        this._sourceNode.volume = val;
    }
    get duration (): number {
        return this._clip.getDuration();
    }
    get currentTime (): number {
        return this._sourceNode.currentTime;
    }
    set currentTime (time: number) {
        this._sourceNode.currentTime = time;
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
