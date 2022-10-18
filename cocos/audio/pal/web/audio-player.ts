import { EDITOR } from 'internal:constants';
import { systemInfo } from 'pal/system-info';
import { audioBufferManager } from '../graph_based/audio-buffer-manager';
import { Playable } from '../../inner/playable';
import { AudioClip } from '../../audio-clip';
import { EventTarget } from '../../../core/event';
import { AudioEvent, AudioState, PlayerOptions } from '../../type';
import { Director, director } from '../../../game';
import { clamp, clamp01 } from '../../../core';
import { AudioPlayerDom } from './player-dom';
import { AudioPlayerX } from '../graph_based/audio-player';

const WebAudioSupport = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
export abstract class AudioPlayer implements Playable {
    private _isDom = false;
    get isDom () {
        return this._isDom;
    }
    // Responsive to this._isDom, if true, use _domAudio to play the audio.
    // private transform () {
    //     //TODO(timlyeee) : transform between DOM and WebAudio.
    // }
    private _innerPlayer : Playable;
    constructor (clip: AudioClip, options?: PlayerOptions) {
        if (options?.isDom || !WebAudioSupport) {
            this._innerPlayer = new AudioPlayerDom(clip, options);
            this._isDom = true;
        } else {
            this._innerPlayer = new AudioPlayerX(clip, options);
        }
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
}
