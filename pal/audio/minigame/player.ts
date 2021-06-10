import { minigame } from 'pal/minigame';
import { warnID } from '../../../cocos/core';
import { legacyCC } from '../../../cocos/core/global-exports';
import { AudioLoadOptions, AudioType, AudioState } from '../type';
import { AudioPlayerMinigame, OneShotAudioMinigame } from './player-minigame';
import { AudioPlayerWeb, OneShotAudioWeb } from './player-web';

type AbstractOneShotAudio = OneShotAudioMinigame | OneShotAudioWeb;
type AbstractAudioPlayer = AudioPlayerMinigame | AudioPlayerWeb;

export class OneShotAudio {
    private _audio:  AbstractOneShotAudio;
    get onPlay () {
        return this._audio.onPlay;
    }
    set onPlay (v) {
        this._audio.onPlay = v;
    }

    get onEnd () {
        return this._audio.onEnd;
    }
    set onEnd (v) {
        this._audio.onEnd = v;
    }

    private constructor (audio: AbstractOneShotAudio) {
        this._audio = audio;
    }
    public play (): void {
        this._audio.play();
    }
    public stop (): void {
        this._audio.stop();
    }
}

export class AudioPlayer {
    private _player: AbstractAudioPlayer;
    constructor (player: AbstractAudioPlayer) {
        this._player = player;
    }

    static load (url: string, opts?: AudioLoadOptions): Promise<AudioPlayer> {
        return new Promise((resolve) => {
            if (typeof minigame.tt === 'object' && typeof minigame.tt.getAudioContext !== 'undefined') {
                AudioPlayerWeb.load(url).then((webPlayer) => {
                    resolve(new AudioPlayer(webPlayer));
                }).catch((e) => {});
            } else {
                AudioPlayerMinigame.load(url).then((minigamePlayer) => {
                    resolve(new AudioPlayer(minigamePlayer));
                }).catch((e) => {});
            }
        });
    }
    destroy () {
        this._player.destroy();
    }
    static loadNative (url: string, opts?: AudioLoadOptions): Promise<unknown> {
        if (typeof minigame.tt === 'object' && typeof minigame.tt.getAudioContext !== 'undefined') {
            return AudioPlayerWeb.loadNative(url);
        }
        return AudioPlayerMinigame.loadNative(url);
    }
    static loadOneShotAudio (url: string, volume: number, opts?: AudioLoadOptions): Promise<OneShotAudio> {
        return new Promise((resolve, reject) => {
            if (typeof minigame.tt === 'object' && typeof minigame.tt.getAudioContext !== 'undefined') {
                AudioPlayerWeb.loadOneShotAudio(url, volume).then((oneShotAudioWeb) => {
                    // @ts-expect-error AudioPlayer should be a friend class in OneShotAudio
                    resolve(new OneShotAudio(oneShotAudioWeb));
                }).catch(reject);
            } else {
                AudioPlayerMinigame.loadOneShotAudio(url, volume).then((oneShotAudioMinigame) => {
                    // @ts-expect-error AudioPlayer should be a friend class in OneShotAudio
                    resolve(new OneShotAudio(oneShotAudioMinigame));
                }).catch(reject);
            }
        });
    }
    static readonly maxAudioChannel = 10;

    get src (): string { return this._player.src; }
    get type (): AudioType { return this._player.type; }
    get state (): AudioState { return this._player.state; }
    get loop (): boolean { return this._player.loop; }
    set loop (val: boolean) { this._player.loop = val; }
    get volume (): number { return this._player.volume; }
    set volume (val: number) { this._player.volume = val; }
    get duration (): number { return this._player.duration; }
    get currentTime (): number { return this._player.currentTime; }
    seek (time: number): Promise<void> { return this._player.seek(time); }

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

// REMOVE_ME
legacyCC.AudioPlayer = AudioPlayer;
