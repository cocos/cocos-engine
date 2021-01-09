declare module 'pal:audio' {
    export interface OneShotAudio {
        stop ();
        onPlay (cb): OneShotAudio;
        onEnded (cb): OneShotAudio;
    }
    export class AudioPlayer {
        private constructor (nativeAudio: any);
        destroy ();
        static load (url: string, opts?: import('pal/audio/type').AudioLoadOptions): Promise<AudioPlayer>;
        static loadNative (url: string, opts?: import('pal/audio/type').AudioLoadOptions): Promise<any>;
        static maxAudioChannel: number;

        get type (): import('pal/audio/type').AudioType;
        get state (): import('pal/audio/type').AudioState;
        get loop (): boolean;
        set loop (val: boolean);
        get volume (): number;
        set volume (val: number);
        get duration (): number;
        get currentTime (): number;
        seek (time: number): Promise<void>;
        playOneShot (volume?: number): OneShotAudio;
        play (): Promise<void>;
        pause (): Promise<void>;
        stop (): Promise<void>;

        onInterruptionBegin (cb);
        offInterruptionBegin (cb?);
        onInterruptionEnd (cb);
        offInterruptionEnd (cb?);
        onEnded (cb);
        offEnded (cb?);
    }
}
