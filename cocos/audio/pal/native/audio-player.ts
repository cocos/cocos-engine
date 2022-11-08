import { Platform } from '../../../../pal/system-info/enum-type';
import { sys } from '../../../core';
import { AudioClip } from '../../audio-clip';
import { AudioPlayerX } from '../../impl/graph-based/audio-player';
import { Playable } from '../../impl/playable';
import { AudioState, PlayerOptions } from '../../type';
import { AudioPlayerDeprecated } from './deprecated/player';

export { playOneShot } from '../../impl/graph-based/audio-player';
export class AudioPlayer implements Playable  {
    public _useWebAudio = true;

    // Responsive to this._isDom, if true, use _domAudio to play the audio.
    // private transform () {
    //     //TODO(timlyeee) : transform between DOM and WebAudio.
    // }
    private _innerPlayer : Playable;
    constructor (clip: AudioClip, options?: PlayerOptions) {
        if (sys.platform === Platform.OHOS) {
            this._innerPlayer = new AudioPlayerDeprecated(clip, options);
            this._useWebAudio = false;
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
    destroy () { this._innerPlayer.destroy(); }
    onInterruptionBegin (cb: () => void) { this._innerPlayer.onInterruptionBegin(cb); }
    offInterruptionBegin (cb?: () => void) { this._innerPlayer.offInterruptionBegin(cb); }
    onInterruptionEnd (cb: () => void) { this._innerPlayer.onInterruptionEnd(cb); }
    offInterruptionEnd (cb?: () => void) { this._innerPlayer.offInterruptionEnd(cb); }
    onEnded (cb: () => void) { this._innerPlayer.onEnded(cb); }
    offEnded (cb?: () => void) { this._innerPlayer.offEnded(cb); }
}
