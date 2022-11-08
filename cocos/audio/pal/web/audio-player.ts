import { Playable } from '../../impl/playable';
import { AudioClip } from '../../audio-clip';
import { AudioState, PlayerOptions } from '../../type';
import { AudioPlayerDom } from '../../impl/dom/audio-player-dom';
import { AudioPlayerX } from '../../impl/graph-based/audio-player';
import { CCObject } from '../../../core';

const WebAudioSupport = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
export class AudioPlayer implements Playable  {
    public _useWebAudio = true;

    // Responsive to this._isDom, if true, use _domAudio to play the audio.
    // private transform () {
    //     //TODO(timlyeee) : transform between DOM and WebAudio.
    // }
    private _innerPlayer : Playable;
    constructor (clip: AudioClip, options?: PlayerOptions) {
        if (options?.noWebAudio || !WebAudioSupport) {
            this._innerPlayer = new AudioPlayerDom(clip, options);
            this._useWebAudio = false;
        } else {
            this._innerPlayer = new AudioPlayerX(clip, options);
        }
    }
    onInterruptionBegin(cb: () => void) {
        throw new Error('Method not implemented.');
    }
    offInterruptionBegin(cb?: (() => void) | undefined) {
        throw new Error('Method not implemented.');
    }
    onInterruptionEnd(cb: () => void) {
        throw new Error('Method not implemented.');
    }
    offInterruptionEnd(cb?: (() => void) | undefined) {
        throw new Error('Method not implemented.');
    }
    onEnded(cb: () => void) {
        throw new Error('Method not implemented.');
    }
    offEnded(cb?: (() => void) | undefined) {
        throw new Error('Method not implemented.');
    }
    get state (): AudioState { return this._innerPlayer.state; }
    set clip (clip: AudioClip) { this._innerPlayer.clip = clip; }
    get clip (): AudioClip { return this._innerPlayer.clip; }
    set playbackRate (rate: number) { this._innerPlayer.playbackRate = rate; }
    get playbackRate (): number { return this._innerPlayer.playbackRate; }
    set pan (pan: number) { this._innerPlayer.pan = pan; }
    get pan (): number { return this._innerPlayer.pan; }
    get loop (): boolean { return this._innerPlayer.loop; }
    set loop (val: boolean) { this._innerPlayer.loop = val; }
    get volume (): number { return this._innerPlayer.volume; }
    set volume (val: number) { this._innerPlayer.volume = val; }
    get currentTime (): number { return this._innerPlayer.currentTime; }
    set currentTime (time: number) { this._innerPlayer.currentTime = time; }

    play () { this._innerPlayer.play(); }
    pause () { this._innerPlayer.pause(); }
    stop () { this._innerPlayer.stop(); }
    destroy () { this._innerPlayer.destroy(); }
}
