declare module 'pal/screenManager' {
    export interface SafeAreaEdge {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }

    class ScreenManager {
        /**
         * Query whether fullscreen feature is supported on the current platform.
         */
        public get supportFullScreen (): boolean;
        /**
         * Query the current fullscreen state.
         */
        public get isOnFullScreen (): boolean;
        /**
         * Get the size of current screen.
         * On Web platform, this should be the size of game frame.
         */
        public get screenSize (): import('cocos/core/math').Size;
        /**
         * Get the orientation of current game.
         * Available on mobile related platform.
         */
        public get orientation (): import('pal/screen-manager/enum-type').Orientation;
        /**
         * Get the SafeAreaEdge based on the screen coordinate system.
         * @return {SafeAreaEdge} An interface displaying the distance of the sides 'top', 'bottom', 'left' and 'right'.
         */
        public get safeAreaEdge (): SafeAreaEdge;

        /**
         * Asynchronously resize screen to a specified size.
         * Available on desktop related platform.
         * @param {Size} Specify the size that the screen need to resize to.
         * @returns Promise to resize screen.
         * @todo not implemented yet
         */
        public resizeScreen (size: import('cocos/core/math').Size): Promise<void>;
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

        public onFullScreenChange (cb: () => void);
        public onScreenResize (cb: () => void);
        public onOrientationChange (cb: () => void);

        public offFullScreenChange (cb?: () => void);
        public offScreenResize (cb?: () => void);
        public offOrientationChange (cb?: () => void);
    }

    export const screenManager: ScreenManager;
}
