declare module 'pal/input' {
    type TouchCallback = (res: import('cocos/input/types').EventTouch) => void;
    /**
     * Class designed for touch input.
     */
    export class TouchInputSource {
        /**
         * Register the touch event callback.
         */
        public on (eventType: import('cocos/input/types/event-enum').InputEventType, callback: TouchCallback, target?: any);
    }

    type MouseCallback = (res: import('cocos/input/types').EventMouse) => void;
    /**
     * Class designed for mouse input.
     */
    export class MouseInputSource {
        /**
         * Register the mouse event callback.
         */
        public on (eventType: import('cocos/input/types/event-enum').InputEventType, callback: MouseCallback, target?: any);
    }

    type KeyboardCallback = (res: import('cocos/input/types').EventKeyboard) => void;
    /**
     * Class Designed for keyboard input.
     */
    export class KeyboardInputSource {
        /**
         * Register the keyboard event callback.
         */
        public on (eventType: import('cocos/input/types/event-enum').InputEventType, callback: KeyboardCallback, target?: any);
    }

    /**
     * Class designed for gamepad input
     */
    export class GamepadInputSource {
        // TODO: add more details for GamepadInputSource class
    }

    type AccelerometerCallback = (res: import('cocos/input/types').EventAcceleration) => void;
    /**
     * Class designed for accelerometer input
     */
    export class AccelerometerInputSource {
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
         * Register the acceleration event callback.
         */
        public on (eventType: import('cocos/input/types/event-enum').InputEventType, callback: AccelerometerCallback, target?: any);
    }
}
