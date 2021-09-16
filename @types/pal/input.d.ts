declare module 'pal/input' {
    /**
     * Basic class for all input sources.
     */
    abstract class BaseInputSource {
        /**
         * Query whether this input source is supported.
         */
        public readonly support: boolean;
    }

    type TouchCallback = (res: import('cocos/input/types').EventTouch) => void;
    /**
     * Class designed for touch input.
     */
    export class TouchInputSource extends BaseInputSource {
        /**
         * Register the touch start event callback.
         * @param cb
         */
        public onStart (cb: TouchCallback);
        /**
         * Register the touch move event callback.
         * @param cb
         */
        public onMove (cb: TouchCallback);
        /**
         * Register the touch end event callback.
         * @param cb
         */
        public onEnd (cb: TouchCallback);
        /**
         * Register the touch cancel event callback.
         * @param cb
         */
        public onCancel (cb: TouchCallback);
    }

    type MouseCallback = (res: import('cocos/input/types').EventMouse) => void;
    /**
     * Class designed for mouse input.
     */
    export class MouseInputSource extends BaseInputSource {
        /**
         * Register the mouse down event callback.
         * @param cb
         */
        public onDown (cb: MouseCallback);
        /**
         * Register the mouse move event callback.
         * @param cb
         */
        public onMove (cb: MouseCallback);
        /**
         * Register the mouse up event callback.
         * @param cb
         */
        public onUp (cb: MouseCallback);
        /**
         * Register the mouse wheel event callback.
         * @param cb
         */
        public onWheel (cb: MouseCallback);
    }

    type KeyboardCallback = (res: import('cocos/input/types').EventKeyboard) => void;
    /**
     * Class Designed for keyboard input.
     */
    export class KeyboardInputSource extends BaseInputSource {
        /**
         * Register the key down event callback.
         * @param cb
         */
        public onDown (cb: KeyboardCallback);
        /**
         * Register the key pressing event callback.
         * NOTE: Compatibility for the deprecated KEY_DOWN event type. It should be removed in the future.
         * @param cb
         */
        public onPressing (cb: KeyboardCallback);
        /**
         * Register the key up event callback.
         * @param cb
         */
        public onUp (cb: KeyboardCallback);
    }

    /**
     * Class designed for gamepad input
     */
    export class GamepadInputSource extends BaseInputSource {
        // TODO: add more details for GamepadInputSource class
    }

    type AccelerometerCallback = (res: import('cocos/input/types').EventAcceleration) => void;
    /**
     * Class designed for accelerometer input
     */
    export class AccelerometerInputSource extends BaseInputSource {
        /**
         * Asynchronously start the accelerometer.
         * TODO: return a promise.
         */
        public start ();
        /**
         * Stop the accelerometer.
         * TODO: return a promise.
         */
        public stop ();
        /**
         * Set interval of the accelerometer callback.
         * The interval is in mile seconds.
         * @param intervalInMileSeconds interval in mile seconds.
         */
        public setInterval (intervalInMileSeconds: number);
        /**
         * Register the accelerometer change event callback.
         * @param cb
         */
        public onChange (cb: AccelerometerCallback);
    }
}
