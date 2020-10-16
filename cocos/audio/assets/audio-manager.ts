import { legacyCC } from "../../core/global-exports";

export abstract class AudioManager<AudioType> {
    protected _playingAudios: Array<AudioType>;
    public static readonly maxAudioChannel: number = 3;

    constructor () {
        this._playingAudios = [];
    }

    public addPlaying (audio: AudioType) {
        this._playingAudios.push(audio);
    }

    public removePlaying (audio: AudioType) {
        let index = this._playingAudios.indexOf(audio);
        if (index > -1) {
            this._playingAudios.splice(index, 1);
        }
    }

    public abstract discardOnePlayingIfNeeded ();
}

legacyCC.internal.AudioManager = AudioManager;