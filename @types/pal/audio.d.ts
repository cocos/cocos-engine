declare module 'pal:audio' {
    export interface OneShotAudio {
        stop ();
        onPlay (cb): OneShotAudio;
        onEnded (cb): OneShotAudio;
    }
    export class AudioPlayer {
        private constructor (nativeAudio: unknown);
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

        onInterruptionBegin (cb: () => void);
        offInterruptionBegin (cb?: () => void);
        onInterruptionEnd (cb: () => void);
        offInterruptionEnd (cb?: () => void);
        onEnded (cb: () => void);
        offEnded (cb?: () => void);
    }
}
