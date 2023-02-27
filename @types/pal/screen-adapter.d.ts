declare module 'pal/screen-adapter' {
    export interface SafeAreaEdge {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }

    export type ConfigOrientation = 'auto' | 'landscape' | 'portrait';
    export interface IScreenOptions {
        /**
         * Orientation options from editor builder.
         */
        configOrientation: ConfigOrientation;
        /**
         * Determine whether the game frame exact fits the screen.
         * Now it only works on Web platform.
         */
        exactFitScreen: boolean;

        /**
         * Determine whether use headless renderer, which means do not support some screen operations.
         */
        isHeadlessMode: boolean;
    }

    class ScreenAdapter {
        /**
         * Init the callback to rebuild frame buffer when update the resolution.
         * This method will also init the resolution.
         * This method should be called when the engine director.root is initiated.
         * @param options
         * @param cbToRebuildFrameBuffer
         */
        public init (options: IScreenOptions, cbToRebuildFrameBuffer: () => void);
        /**
         * On web mobile platform, sometimes we need to rotate the game frame.
         * This field record the rotate state of game frame, which is false by default.
         */
        public isFrameRotated: boolean;
        /**
         * On web platform, we support to set container strategy.
         * This field record whether we apply ProportionalToFrame strategy on container, which is false by default.
         */
        public get isProportionalToFrame (): boolean;
        public set isProportionalToFrame (v: boolean);
        /**
         * In some case we don't want to handle the resize event.
         * For example, when the soft keyboard shows up, we don't want to resize the canvas.
         * This is true by default.
         */
        public handleResizeEvent: boolean;
        /**
         * Query whether fullscreen feature is supported on the current platform.
         */
        public get supportFullScreen (): boolean;
        /**
         * Query the current fullscreen state.
         */
        public get isFullScreen (): boolean;
        /**
         * The ratio of pixel sizes:
         * the size of one CSS pixel to the size of one physical pixel.
         */
        public get devicePixelRatio (): number;
        /**
         * Get the size of current window in physical pixels.
         */

        /**
         * Get and set the size of current window in physical pixels.
         */
        public get windowSize (): import('cocos/core/math').Size;
        public set windowSize (size: import('cocos/core/math').Size);

        /**
         * Get the current resolution of game.
         * This is a readonly property, you can change the value by setting screenAdapter.resolutionScale.
         */
        public get resolution (): import('cocos/core/math').Size;

        /**
         * Update the resolution by resolutionScale.
         * This method rebuilds the size of frame buffer and the size of canvas.
         * This method should be called when window resized (fullscreen changing included) or the resolution scale changed.
         */
        private _updateResolution ();
        /**
         * Get and set the resolution scale of screen, which will affect the quality of the rendering.
         * Note: if this value is set too high, the rendering performance of GPU will be reduced, this value is 1 by default.
         */
        public get resolutionScale (): number;
        public set resolutionScale (value: number);

        /**
         * Get or set the orientation of current game.
         * Available on mobile related platform for now.
         */
        public get orientation (): import('pal/screen-adapter/enum-type').Orientation;
        public set orientation (value: import('pal/screen-adapter/enum-type').Orientation);

        /**
         * Get the SafeAreaEdge based on the screen coordinate system in physical pixels.
         * @return {SafeAreaEdge} An interface displaying the distance of the sides 'top', 'bottom', 'left' and 'right'.
         */
        public get safeAreaEdge (): SafeAreaEdge;

        /**
         * Asynchronously request fullscreen
         * If failed to request fullscreen, another attempt will be made to request fullscreen the next time a user interaction occurs.
         * @returns Promise to request fullscreen
         */
        public requestFullScreen (): Promise<void>;
        /**
         * Asynchronously exit fullscreen
         * @returns Promise to exit fullscreen
         */
        public exitFullScreen (): Promise<void>;

        on (event: import('pal/screen-adapter/enum-type').PalScreenEvent, cb: (...args: any)=>void, target?: any);
        off (event: import('pal/screen-adapter/enum-type').PalScreenEvent, cb?: (...args: any)=>void, target?: any);
    }

    export const screenAdapter: ScreenAdapter;
}
