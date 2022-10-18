import { EDITOR } from 'internal:constants';
import { systemInfo } from 'pal/system-info';
import { audioBufferManager } from './audio-buffer-manager';
import { DynamicPath, Playable, AudioAction, stateGraph, StateLinks, TinyOGraph, TinyOLink } from '../../inner/playable';
import { AudioClip } from '../../audio-clip';
import { EventTarget } from '../../../core/event';
import { AudioEvent, AudioState, PlayerOptions } from '../../type';
import { Director, director } from '../../../game';
import { clamp, clamp01 } from '../../../core';
import { AudioPlayerDom } from '../web/player-dom';
import { defaultContext, SourceNode } from './audio';

/**
 *
 */
export class AudioPlayerX extends DynamicPath<AudioState, AudioAction> implements Playable {
    _innerOperation = (action: AudioAction) => {
        switch (action) {
        case AudioAction.PLAY:

            break;

        default:
            break;
        }
    }
    // Common members
    _node: AudioState = AudioState.READY;

    //Note: If support WebAudio, use H5 audio element for streaming play, otherwise for dom play.
    private _domAudio: HTMLAudioElement = new Audio();

    // Time relative
    private _cachedCurrentTime = 0;
    private _volume = 1;
    private _isTranslating = false;
    private _eventTarget = new EventTarget();
    // Start time is used to calculate the current time immediatly and it always update when playbackRate is updated.
    private _startTime = 0;

    private _sourceNode: SourceNode;
    private _gainNode: GainNode;
    private _ctx: AudioContext;

    constructor (clip: AudioClip, options?: PlayerOptions) {
        super();
        this._sourceNode = new SourceNode(defaultContext, clip);
        this._ctx = defaultContext;
        this._gainNode = defaultContext.createGain();

        if (options) {
            if (options.volume) {
                this._volume = options.volume;
                this._gainNode.gain.value = options.volume;
            }
            if (options.loop) {
                this._sourceNode.loop = options.loop;
            }
        }
        systemInfo.on('hide', this._onHide, this);
        systemInfo.on('show', this._onShow, this);
    }
    get state (): AudioState {
        return this._node;
    }
    set clip (clip: AudioClip) {
        this._sourceNode.clip = clip;
    }
    get clip (): AudioClip {
        return this._sourceNode.clip;
    }
    set playbackRate (rate: number) {
        this._sourceNode.playbackRate = rate;
    }
    get playbackRate (): number {
        return this._sourceNode.playbackRate;
    }
    set pan (pan: number) {
        throw new Error('Method not implemented.');
    }
    get pan (): number {
        throw new Error('Method not implemented.');
    }
    destroy () {
        systemInfo.off('hide', this._onHide, this);
        systemInfo.off('show', this._onShow, this);
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
        return this._volume;
    }
    set volume (val: number) {
        val = clamp01(val);
        this._volume = val;
        this._gainNode.gain.value = val;
    }
    get duration (): number {
        return this._sourceNode.clip.getDuration();
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
        this._isTranslating;
        this._innerOperation(AudioAction.PLAY);
    }

    pause () {
        this._eventTarget.emit(AudioEvent.PAUSED);
        if (this._dynamicPath.length > 0 || this._isTranslating) {
            this._updatePathWithLink(this._node, AudioState.PAUSED, AudioAction.PAUSE);
            return;
        }
        this._isTranslating;
        this._innerOperation(AudioAction.PAUSE);
    }

    stop () {
        this._eventTarget.emit(AudioEvent.PLAYED);
        if (this._dynamicPath.length > 0 || this._isTranslating) {
            this._updatePathWithLink(this._node, AudioState.STOPPED, AudioAction.STOP);
            return;
        }
        this._isTranslating;
        this._innerOperation(AudioAction.STOP);
    }

    onInterruptionBegin (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded (cb: () => void) { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded (cb?: () => void) { this._eventTarget.off(AudioEvent.ENDED, cb); }
}
