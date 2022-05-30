declare module 'pal/input' {
    type InputSourceButton = import('pal/input/input-source').InputSourceButton;
    type InputSourceStick = import('pal/input/input-source').InputSourceStick;
    type InputSourceDpad = import('pal/input/input-source').InputSourceDpad;

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

    export type GamepadCallback = (res: import('cocos/input/types/event').EventGamepad) => void;

    /**
     * Class designed for gamepad input
     */
    export class GamepadInputDevice {
        /**
         * @engineInternal
         */
        public static _init ();
        /**
         * @engineInternal
         */
        public static _on (eventType: import('cocos/input/types/event-enum').InputEventType, cb: GamepadCallback, target?: any);

        public static all: GamepadInputDevice[];
        public get deviceId (): number;
        public get connected (): boolean;
        public buttonNorth: InputSourceButton;
        public buttonEast: InputSourceButton;
        public buttonWest: InputSourceButton;
        public buttonSouth: InputSourceButton;

        public buttonL1: InputSourceButton;
        public buttonL2: InputSourceButton;
        public buttonL3: InputSourceButton;
        public buttonR1: InputSourceButton;
        public buttonR2: InputSourceButton;
        public buttonR3: InputSourceButton;

        // public buttonTouchPad: InputSourceButton;
        // public buttonHome: InputSourceButton;
        public buttonShare: InputSourceButton;
        public buttonOptions: InputSourceButton;

        public dpad: InputSourceDpad;
        public leftStick: InputSourceStick;
        public rightStick: InputSourceStick;
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
