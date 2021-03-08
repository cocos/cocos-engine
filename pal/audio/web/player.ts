import { OneShotAudio } from 'pal/audio';
import { warnID } from '../../../cocos/core';
import { AudioLoadOptions, AudioType, AudioState } from '../type';
import { AudioPlayerDOM } from './player-dom';
import { AudioPlayerWeb } from './player-web';

type AbstractAudioPlayer = AudioPlayerDOM | AudioPlayerWeb;

export class AudioPlayer {
    private _player: AbstractAudioPlayer;
    constructor (player: AbstractAudioPlayer) {
        this._player = player;
    }

    static load (url: string, opts?: AudioLoadOptions): Promise<AudioPlayer> {
        return new Promise((resolve) => {
            if (opts?.audioLoadMode === AudioType.DOM_AUDIO) {
                AudioPlayerDOM.load(url).then((domPlayer) => {
                    resolve(new AudioPlayer(domPlayer));
                }).catch((e) => {});
            } else if (!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext)) {
                warnID(5201);
                AudioPlayerDOM.load(url).then((domPlayer) => {
                    resolve(new AudioPlayer(domPlayer));
                }).catch((e) => {});
            } else {
                AudioPlayerWeb.load(url).then((webPlayer) => {
                    resolve(new AudioPlayer(webPlayer));
                }).catch((e) => {});
            }
        });
    }
    destroy () {
        this._player.destroy();
    }
    static loadNative (url: string, opts?: AudioLoadOptions): Promise<any> {
        if (opts?.audioLoadMode === AudioType.DOM_AUDIO) {
            return AudioPlayerDOM.loadNative(url);
        }
        return AudioPlayerWeb.loadNative(url);
    }
    static maxAudioChannel = 24;

    get type (): AudioType { return this._player.type; }
    get state (): AudioState { return this._player.state; }
    get loop (): boolean { return this._player.loop; }
    set loop (val: boolean) { this._player.loop = val; }
    get volume (): number { return this._player.volume; }
    set volume (val: number) { this._player.volume = val; }
    get duration (): number { return this._player.duration; }
    get currentTime (): number { return this._player.currentTime; }
    seek (time: number): Promise<void> { return this._player.seek(time); }

    playOneShot (volume?: number): OneShotAudio { return this._player.playOneShot(volume); }
    play (): Promise<void> { return this._player.play(); }
    pause (): Promise<void> {  return this._player.pause(); }
    stop (): Promise<void> { return this._player.stop(); }
    onInterruptionBegin (cb: () => void) { this._player.onInterruptionBegin(cb); }
    offInterruptionBegin (cb?: () => void) { this._player.offInterruptionBegin(cb); }
    onInterruptionEnd (cb: () => void) { this._player.onInterruptionEnd(cb); }
    offInterruptionEnd (cb?: () => void) { this._player.offInterruptionEnd(cb); }
    onEnded (cb: () => void) { this._player.onEnded(cb); }
    offEnded (cb?: () => void) { this._player.offEnded(cb); }
}
