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
        /**
         * @en The gamepad device id
         * @zh 手柄设备 id
         */
        public get deviceId (): number;
        /**
         * @en whether the gamepad is connected
         * @zh 手柄是否处于连接状态
         */
        public get connected (): boolean;
        /**
         * @en  The control button in the north direction which is generally the button Y
         * @zh 处于北向的控制按键，一般是按键 Y
         */
        public get buttonNorth (): InputSourceButton;
        /**
         * @en  The control button in the east direction which is generally the button B
         * @zh 处于东向的控制按键，一般是按键 B
         */
        public get buttonEast (): InputSourceButton;
        /**
         * @en  The control button in the west direction which is generally the button X
         * @zh 处于西向的控制按键，一般是按键 X
         */
        public get buttonWest (): InputSourceButton;
        /**
         * @en  The control button in the south direction which is generally the button A
         * @zh 处于南向的控制按键，一般是按键 A
         */
        public get buttonSouth (): InputSourceButton;

        /**
         * @en The button L1
         * @zh 按键 L1
         */
        public get buttonL1 (): InputSourceButton;
        /**
         * @en The button L2
         * @zh 按键 L2
         */
        public get buttonL2 (): InputSourceButton;
        /**
         * @en The button L3
         * @zh 按键 L3
         */
        public get buttonL3 (): InputSourceButton;
        /**
         * @en The button R1
         * @zh 按键 R1
         */
        public get buttonR1 (): InputSourceButton;
        /**
         * @en The button R2
         * @zh 按键 R2
         */
        public get buttonR2 (): InputSourceButton;
        /**
         * @en The button R3
         * @zh 按键 R3
         */
        public get buttonR3 (): InputSourceButton;

        // public get buttonTouchPad (): InputSourceButton;
        // public get buttonHome (): InputSourceButton;

        /**
         * @en The button Share
         * @zh 分享按键
         */
        public get buttonShare (): InputSourceButton;
        /**
         * @en The button Options
         * @zh 选项按键
         */
        public get buttonOptions (): InputSourceButton;

        /**
         * @en The dpad buttons
         * @zh 方向按键
         */
        public get dpad (): InputSourceDpad;
        /**
         * @en The left stick
         * @zh 左摇杆
         */
        public get leftStick (): InputSourceStick;
        /**
         * @en The right stick
         * @zh 右摇杆
         */
        public get rightStick (): InputSourceStick;
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
