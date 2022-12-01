import { legacyCC } from '../../../core/global-exports';
import { InnerCtxAudioPlayer, InnerCtxOneShotAudio } from './basic/innerctx-inner-player';
import { AudioLoadOptions, AudioType, AudioState, AudioPCMDataView } from '../../type';
import { WAAudioPlayer, WAOneShotAudio } from './basic/wa-inner-player';
import { minigame } from 'pal/minigame';

type AbstractOneShotAudio = InnerCtxOneShotAudio | WAOneShotAudio;
type AbstractAudioPlayer = InnerCtxAudioPlayer | WAAudioPlayer;

export class InnerOneShotAudio {
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

export class InnerAudioPlayer {
    private _player: AbstractAudioPlayer;
    constructor (player: AbstractAudioPlayer) {
        this._player = player;
    }

    static load (url: string, opts?: AudioLoadOptions): Promise<InnerAudioPlayer> {
        return new Promise((resolve) => {
            if (typeof minigame.tt === 'object' && typeof minigame.tt.getAudioContext !== 'undefined') {
                WAAudioPlayer.load(url).then((webPlayer) => {
                    resolve(new InnerAudioPlayer(webPlayer));
                }).catch((e) => {});
            } else {
                InnerCtxAudioPlayer.load(url).then((minigamePlayer) => {
                    resolve(new InnerAudioPlayer(minigamePlayer));
                }).catch((e) => {});
            }
        });
    }
    destroy () {
        this._player.destroy();
    }
    static loadNative (url: string, opts?: AudioLoadOptions): Promise<unknown> {
        if (typeof minigame.tt === 'object' && typeof minigame.tt.getAudioContext !== 'undefined') {
            return WAAudioPlayer.loadNative(url);
        }
        return InnerCtxAudioPlayer.loadNative(url);
    }
    static loadOneShotAudio (url: string, volume: number, opts?: AudioLoadOptions): Promise<InnerOneShotAudio> {
        return new Promise((resolve, reject) => {
            if (typeof minigame.tt === 'object' && typeof minigame.tt.getAudioContext !== 'undefined') {
                WAAudioPlayer.loadOneShotAudio(url, volume).then((oneShotAudioWeb) => {
                    // @ts-expect-error AudioPlayer should be a friend class in OneShotAudio
                    resolve(new OneShotAudio(oneShotAudioWeb));
                }).catch(reject);
            } else {
                InnerCtxAudioPlayer.loadOneShotAudio(url, volume).then((oneShotAudioMinigame) => {
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
    get sampleRate (): number { return this._player.sampleRate; }
    getPCMData (channelIndex: number): AudioPCMDataView | undefined { return this._player.getPCMData(channelIndex); }
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
legacyCC.InnerAudioPlayer = InnerAudioPlayer;
