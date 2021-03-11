declare module 'pal/audio' {
    /**
     * each audio instance needs to be managed, but not take up too much memory
     * this is a lite version of audio interface designed for audio manager
     */
    export interface OneShotAudio {
        /**
         * stop playing one shot audio
         */
        stop ();
        /**
         * register the play finish callback
         * @param cb
         */
        onPlay (cb): OneShotAudio;
        /**
         * register the end callback
         * @param cb
         */
        onEnded (cb): OneShotAudio;
    }
    export class AudioPlayer {
        private constructor (nativeAudio: unknown);
        /**
         * destroy AudioPlayer
         */
        destroy ();
        /**
         * load AudioPlayer
         * @param url
         * @param opts
         */
        static load (url: string, opts?: import('pal/audio/type').AudioLoadOptions): Promise<AudioPlayer>;
        /**
         * load native audio for playing one shot
         * @param url
         * @param opts
         */
        static loadNative (url: string, opts?: import('pal/audio/type').AudioLoadOptions): Promise<unknown>;
        /**
         * max audio channel, if the amount of playing audios exceeds maxAudioChannel, some audio instances should be discarded by audio manager
         */
        static readonly maxAudioChannel: number;

        /**
         * type of AudioPlayer，there are WEB_AUDIO and DOM_AUDIO for web platform
         */
        get type (): import('pal/audio/type').AudioType;
        /**
         * state of AudioPlayer，restores to INIT when the audio ended playing
         */
        get state (): import('pal/audio/type').AudioState;
        /**
         * whether to loop
         */
        get loop (): boolean;
        set loop (val: boolean);
        /**
         * volume of AudioPlayer, ranged from 0 to 1
         */
        get volume (): number;
        set volume (val: number);
        /**
         * duration of AudioPlayer
         */
        get duration (): number;
        /**
         * read only current time of AudioPlayer, if you want to set the current time, please call the seek() method
         * it displays in seconds, ranged from 0 to its total duration
         */
        get currentTime (): number;
        /**
         * seek the currentTime，the returned Promise is to ensure the completion of asynchronous operation
         * @param time
         */
        seek (time: number): Promise<void>;
        /**
         * play one shot of the audio，the returned OneShotAudio can be managed by audio manager
         * @param volume
         */
        playOneShot (volume?: number): OneShotAudio;
        /**
         * play audio or resume audio when it is paused, the returned Promise is to ensure the completion of asynchronous operation
         */
        play (): Promise<void>;
        /**
         * pause audio, the returned Promise is to ensure the completion of asynchronous operation
         */
        pause (): Promise<void>;
        /**
         * stop audio, the returned Promise is to ensure the completion of asynchronous operation
         */
        stop (): Promise<void>;

        /**
         * register the InterruptionBegin callback，the Interruption includes the show/hide events, phone call/alarm, unpluging earphones
         * @param cb
         */
        onInterruptionBegin (cb: () => void);
        /**
         * unregister the InterruptionBegin callback
         * @param cb unregister all callbacks if cb is undefined
         */
        offInterruptionBegin (cb?: () => void);
        /**
         * register the InterruptionEnd callback
         * @param cb
         */
        onInterruptionEnd (cb: () => void);
        /**
         * unregister the InterruptionEnd callback
         * @param cb unregister all callbacks if cb is undefined
         */
        offInterruptionEnd (cb?: () => void);
        /**
         * register the end event callback
         * @param cb
         */
        onEnded (cb: () => void);
        /**
         * unregister the end event callback
         * @param cb unregister all callbacks if cb is undefined
         */
        offEnded (cb?: () => void);
    }
}
