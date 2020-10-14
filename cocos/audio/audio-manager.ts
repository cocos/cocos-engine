import { AudioClip } from './assets/clip';
import { legacyCC } from '../core/global-exports';

enum DiscardStrategy {
    OLDEST,
    NEWEST,
    QUIETEST,
}

class AudioManager {
    private _playingClips: Array<AudioClip>;

    public static DiscardStrategy = DiscardStrategy;
    public discardStrategy: DiscardStrategy;
    public static readonly maxAudioChannel: number = 24;

    constructor () {
        this._playingClips = [];
        this.discardStrategy = DiscardStrategy.OLDEST;
    }

    public addPlaying (clip: AudioClip) {
        clip.once('ended', () => {
            this.removePlaying(clip);
        });
        this._playingClips.push(clip);
    }

    public removePlaying (clip: AudioClip) {
        let index = this._playingClips.indexOf(clip);
        if (index > -1) {
            this._playingClips.splice(index, 1);
        }
    }

    public discardOnePlayingIfNeeded () {
        if (this._playingClips.length < AudioManager.maxAudioChannel) {
            return;
        }
        let clip: AudioClip | undefined;
        switch (this.discardStrategy) {
            case DiscardStrategy.OLDEST:
                clip = this._playingClips.shift();
                break;
            case DiscardStrategy.NEWEST:
                clip = this._playingClips.pop();
                break;
            case DiscardStrategy.QUIETEST:
                let minVolume = 9999;
                this._playingClips.forEach(playingClip => {
                    let currentVolume = playingClip.getVolume();
                    if (minVolume > currentVolume) {
                        minVolume = currentVolume;
                        clip = playingClip;
                    }
                });
                break;
        }
        if (clip) {
            if (clip.state === AudioClip.PlayingState.PLAYING) {
                clip.stop();
            }
            // one shot audio clip should be destroyed
            if (clip.isOneShot) {
                clip.destroy();
            }
        }
    }
}

export default legacyCC.internal.audioManager = new AudioManager();