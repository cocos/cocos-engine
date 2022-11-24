import { warnID } from '../../core';
import { legacyCC } from '../../core/global-exports';
import { DomInnerAudioPlayer, DomInnerOneShotAudio } from '../dom/basic/dom-inner-player';
import { AudioLoadOptions, AudioType, AudioState, AudioPCMDataView } from '../type';
import { AudioContextAgent, WAAudioPlayer, WAOneShotAudio } from '../webaudio/basic/wa-inner-player';

type AbstractOneShotAudio = DomInnerOneShotAudio | WAOneShotAudio;
type AbstractAudioPlayer = DomInnerAudioPlayer | WAAudioPlayer;

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
            if (opts?.audioLoadMode === AudioType.DOM_AUDIO || !AudioContextAgent.support) {
                if (!AudioContextAgent.support) { warnID(5201); }
                DomInnerAudioPlayer.load(url).then((domPlayer) => {
                    resolve(new InnerAudioPlayer(domPlayer));
                }).catch((e) => {});
            } else {
                WAAudioPlayer.load(url).then((webPlayer) => {
                    resolve(new InnerAudioPlayer(webPlayer));
                }).catch((e) => {});
            }
        });
    }
    destroy () {
        this._player.destroy();
    }
    static loadNative (url: string, opts?: AudioLoadOptions): Promise<unknown> {
        if (opts?.audioLoadMode === AudioType.DOM_AUDIO || !AudioContextAgent.support) {
            if (!AudioContextAgent.support) { warnID(5201); }
            return DomInnerAudioPlayer.loadNative(url);
        }
        return WAAudioPlayer.loadNative(url);
    }
    static loadOneShotAudio (url: string, volume: number, opts?: AudioLoadOptions): Promise<OneShotAudio> {
        return new Promise((resolve, reject) => {
            if (opts?.audioLoadMode === AudioType.DOM_AUDIO || !AudioContextAgent.support) {
                if (!AudioContextAgent.support) { warnID(5201); }
                DomInnerAudioPlayer.loadOneShotAudio(url, volume).then((oneShotAudioDOM) => {
                    // @ts-expect-error AudioPlayer should be a friend class in OneShotAudio
                    resolve(new OneShotAudio(oneShotAudioDOM));
                }).catch(reject);
            } else {
                WAAudioPlayer.loadOneShotAudio(url, volume).then((oneShotAudioWeb) => {
                    // @ts-expect-error AudioPlayer should be a friend class in OneShotAudio
                    resolve(new OneShotAudio(oneShotAudioWeb));
                }).catch(reject);
            }
        });
    }
    static readonly maxAudioChannel = 24;

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
