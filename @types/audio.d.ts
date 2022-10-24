// This module is initially declare the Graph-based audio components.
declare module 'audio' {
    type PlayerOptions = import('cocos/audio/type').PlayerOptions;
    type AudioClip = import('cocos/audio/audio-clip').AudioClip;
    type AudioState = import('cocos/audio/type').AudioState;
    export class AudioPlayer {
        constructor (clip: AudioClip, options?: PlayerOptions);
        get state (): AudioState;
        set clip (clip: AudioClip);
        get clip (): AudioClip;
        set playbackRate (rate: number);
        get playbackRate (): number;
        set pan (pan: number);
        get pan (): number;
        get loop (): boolean;
        set loop (val: boolean);
        get volume (): number;
        set volume (val: number);
        get currentTime (): number;
        set currentTime (time: number);

        play ();
        pause ();
        stop ();
    }
}
