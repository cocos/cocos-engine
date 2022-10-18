import { AudioState } from '../cocos/audio';

declare module 'audio' {
    export class AudioClip {

    }
    export class AudioPlayer {
        set clip(clip: AudioClip);
        get clip(): AudioClip;
        set loop(loop: boolean);
        get loop(): boolean;
        set currentTime(time: number);
        get currentTime(): number;
        set volume(val: number);
        get volume(): number;
        set playbackRate(rate: number);
        get playbackRate(): number;
        set pan(pan: number);
        get pan(): number;
        get state(): AudioState;
        play();
        pause();
        stop();
    }
}
