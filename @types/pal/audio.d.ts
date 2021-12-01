declare module 'pal/audio' {
    /**
     * Each audio instance needs to be managed, but should not take up too much memory.
     * The `OneShotAudio` is a lite version of audio class designed for audio manager.
     */
    export class OneShotAudio {
        /**
         * Constructor for OneShotAudio.
         * This is a private constructor.
         * OneShotAudio shoulb be instantiated by `AudioPlayer.loadOneShotAudio()` method.
         * @param nativeAudio The native audio such as `HTMLAudioElement` or `AudioBuffer`.
         * @param volume Init the audio volume.
         */
        private constructor (nativeAudio: unknown, volume: number);

        /**
         * get or set current playback rate of this player, ranged from 0 to N, default is 1.
         */
        get playbackRate (): number;
        set playbackRate (val: number);

        /**
         * Play the audio.
         */
        public play (): void;

        /**
         * Stops playing the audio.
         */
        public stop (): void;

        /**
         * Get or set the onPlay callback.
         */
        get onPlay (): () => void | undefined;
        set onPlay (cb: () => void | undefined);

        /**
         * Get or set the onEnd callback.
         */
        get onEnd (): () => void | undefined;
        set onEnd (cb: () => void | undefined);
    }

    export class AudioPlayer {
        private constructor (nativeAudio: unknown);

        /**
         * Destroys the player.
         */
        destroy (): void;

        /**
         * Asynchronously creates an audio player to load an audio.
         * @param url URL to the audio.
         * @param opts Load options.
         * @returns The audio player.
         */
        static load (url: string, opts?: import('pal/audio/type').AudioLoadOptions): Promise<AudioPlayer>;

        /**
         * Asynchronously load a native audio for playing one shot.
         * This is a basic loading method for AudioPlayer.
         * @param url URL to the audio.
         * @param opts Load options.
         * @returns The native audio such as `HTMLAudioElement` or `AudioBuffer`.
         */
        static loadNative (url: string, opts?: import('pal/audio/type').AudioLoadOptions): Promise<unknown>;

        /**
         * Asynchronously load an OneShotAudio instance.
         * @param url URL to the audio.
         * @param volume Specify the volume.
         * @param opts Load options.
         * @returns The OneShotAudio instance.
         */
        static loadOneShotAudio (url: string, volume: number, opts?: import('pal/audio/type').AudioLoadOptions): Promise<OneShotAudio>;

        /**
         * Max audio channel count allowed on current platform.
         * If the amount of playing audios exceeds the limit,
         * some audio instances would be discarded by audio manager.
         */
        static readonly maxAudioChannel: number;

        /**
         * Readonly property to get the url of audio src.
         */
        get src (): string;

        /**
         * The type of this player.
         * For WEB platform, it can be `WEB_AUDIO` or `DOM_AUDIO`.
         */
        get type (): import('pal/audio/type').AudioType;

        /**
         * The state of this player.
         * The state would be restored to `INIT` when the audio finished its playing.
         */
        get state (): import('pal/audio/type').AudioState;

        /**
         * Gets or sets whether if the playing audio should be looped.
         */
        get loop (): boolean;
        set loop (val: boolean);

        /**
         * The volume of this player, ranged from 0 to 1.
         */
        get volume (): number;
        set volume (val: number);

        /**
         * The duration of this audio player.
         */
        get duration (): number;

        /**
         * The current time of this player, in seconds, ranged from 0 to its total duration.
         * Note this field is immutable, if you want to set the current time, please call the seek() method instead.
         */
        get currentTime (): number;

        /**
         * get or set current playback rate of this player, ranged from 0 to N, default is 1.
         */
        get playbackRate (): number;
        set playbackRate (val: number);

        /**
         * Asynchronously seeks the player's playing time onto specified location.
         * @param time Desired playing time.
         */
        seek (time: number): Promise<void>;

        /**
         * Asynchronously plays the audio or resumes the audio while it is paused.
         */
        play (): Promise<void>;

        /**
         * Asynchronously pauses the playing.
         */
        pause (): Promise<void>;
        /**
         * Asynchronously stops the playing.
         */
        stop (): Promise<void>;

        /**
         * Registers an callback which would be called at an interruption begin.
         * The interruption includes the show/hide events, phone call/alarm, earphones un-plugging.
         * @param cb The callback.
         */
        onInterruptionBegin (cb: () => void): void;

        /**
         * Unregister the callback that registered to `onInterruptionBegin`.
         * @param cb  The callback. If not specified, all callback would be unregistered.
         */
        offInterruptionBegin (cb?: () => void): void;

        /**
         * Register an callback which would be called at an interruption end.
         * @param cb The callback.
         */
        onInterruptionEnd (cb: () => void): void;

        /**
         * Unregister the callback that registered to `onInterruptionEnd`.
         * @param cb The callback. If not specified, all callback would be unregistered.
         */
        offInterruptionEnd (cb?: () => void): void;

        /**
         * Register an callback which would be called when the player finished its playing.
         * @param cb The callback.
         */
        onEnded (cb: () => void): void;

        /**
         * Unregister the callback that registered to `onEnded`.
         * @param cb The callback. If not specified, all callback would be unregistered.
         */
        offEnded (cb?: () => void): void;
    }
}
