// import { AudioPlayer as IAudioPlayer } from 'pal:audio';
import { warnID } from 'cocos/core';
import { OneShotAudio } from 'pal:audio';
import { AudioLoadOptions, AudioType, AudioState } from '../type';
import { AudioPlayerDOM } from './player-dom';
import { AudioPlayerWeb } from './player-web';

type AbstractAudioPlayer = AudioPlayerDOM | AudioPlayerWeb;
// export class AudioPlayer implements IAudioPlayer {
export class AudioPlayer {
    private _player: AbstractAudioPlayer;
    constructor (player: AbstractAudioPlayer) {
        this._player = player;
    }

    static async load (url: string, opts?: AudioLoadOptions): Promise<AudioPlayer> {
        let player: AbstractAudioPlayer;
        if (opts?.audioLoadMode === AudioType.DOM_AUDIO) {
            player = await AudioPlayerDOM.load(url);
        }
        else if (!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext)) {
            warnID(5201);
            player = await AudioPlayerDOM.load(url);
        }
        else {
            player = await AudioPlayerWeb.load(url);
        }
        return new AudioPlayer(player);
    }
    destroy() {
        this._player.destroy();
    }
    static loadNative(url: string, opts?: AudioLoadOptions): Promise<any> {
        if (opts?.audioLoadMode === AudioType.DOM_AUDIO) {
            return AudioPlayerDOM.loadNative(url);
        }
        return AudioPlayerWeb.loadNative(url);
    }
    static maxAudioChannel: number = 24;

    get type(): AudioType { return this._player.type; }
    get state(): AudioState { return this._player.state; }
    get loop(): boolean { return this._player.loop; }
    set loop(val: boolean) { this._player.loop = val; }
    get volume(): number { return this._player.volume; }
    set volume(val: number) { this._player.volume = val; }
    get duration (): number { return this._player.duration; }
    get currentTime(): number { return this._player.currentTime; }
    seek(time: number): Promise<void> { return this._player.seek(time); }

    playOneShot(volume?: number): OneShotAudio { return this._player.playOneShot(volume); }
    play(): Promise<void> { return this._player.play(); }
    pause(): Promise<void> {  return this._player.pause(); }
    stop(): Promise<void> { return this._player.stop(); }
    onInterruptionBegin(cb: any) { this._player.onInterruptionBegin(cb); }
    offInterruptionBegin(cb?: any) { this._player.offInterruptionBegin(cb); }
    onInterruptionEnd(cb: any) { this._player.onInterruptionEnd(cb); }
    offInterruptionEnd(cb?: any) { this._player.offInterruptionEnd(cb); }
    onEnded(cb: any) { this._player.onEnded(cb); }
    offEnded(cb?: any) { this._player.offEnded(cb); }
}