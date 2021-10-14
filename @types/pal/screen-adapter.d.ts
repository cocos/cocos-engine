declare module 'pal/screen-adapter' {
    export interface SafeAreaEdge {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }

    class ScreenAdapter {
        /**
         * Query whether fullscreen feature is supported on the current platform.
         */
        public get supportFullScreen (): boolean;
        /**
         * Query the current fullscreen state.
         */
        public get isFullScreen (): boolean;
        /**
         * Get the size of current window.
         * On Web platform, this should be the size of game frame.
         */
        public get windowSize (): import('cocos/core/math').Size;

        /**
         * Set the size of current window.
         * On Web platform, this should be the size of game frame.
         * @param {Size} Specify the size that the window need to resize to.
         * @todo not implemented yet
         */
        public set windowSize (size: import('cocos/core/math').Size);

        /**
         * Get the orientation of current game.
         * Available on mobile related platform.
         */
        public get orientation (): import('pal/screen-adapter/enum-type').Orientation;
        /**
         * Get the SafeAreaEdge based on the screen coordinate system.
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
