declare module 'pal/input' {

    interface BaseInputEvent {
        readonly type: string;
        readonly timestamp: number;
    }
    
    interface BaseInputSource {
        readonly support: boolean;
    }

    interface TouchData {
        readonly identifier: number;
        readonly x: number;
        readonly y: number;
        readonly force: number;
    }
    export interface TouchInputEvent extends BaseInputEvent {
        readonly changedTouches: TouchData[];
    }
    type TouchCallback = (res: TouchInputEvent) => void;
    export interface TouchInputSource extends BaseInputSource {
        onStart (cb: TouchCallback);
        onMove (cb: TouchCallback);
        onEnd (cb: TouchCallback);
        onCancel (cb: TouchCallback);
    }
    export interface MouseInputEvent extends BaseInputEvent {
        readonly x: number;
        readonly y: number;
        readonly button: number;  // static property in Event class
    }
    type MouseCallback = (res: MouseInputEvent) => void;
    export interface MouseWheelInputEvent extends MouseInputEvent {
        readonly deltaX: number;
        readonly deltaY: number;
    }
    type MouseWheelCallback = (res: MouseWheelInputEvent) => void;
    export interface MouseInputSource extends BaseInputSource {
        onDown (cb: MouseCallback);
        onMove (cb: MouseCallback);
        onUp (cb: MouseCallback);
        onWheel (cb: MouseWheelCallback);
    }
    
    export interface KeyboardInputEvent extends BaseInputEvent {
        readonly code: number; // TODO: enum
    }
    type KeyboardCallback = (res: KeyboardInputEvent) => void;
    export interface KeyboardInputSource extends BaseInputSource {
        onDown (cb: KeyboardCallback);
        onUp (cb: KeyboardCallback);
    }

    export interface GamepadInputSource extends BaseInputSource {
        // TODO: interface like gamepad or joystick
    }

    export interface AccelerometerInputEvent extends BaseInputEvent {
        readonly x: number;
        readonly y: number;
        readonly z: number;
    }
    type AccelerometerCallback = (res: AccelerometerInputEvent) => void;
    export interface AccelerometerInputSource extends BaseInputSource {
        start ();
        stop ();
        /**
         * 
         * @param interval ranged from 0 to 1 in mile seconds
         */
        setInterval (interval: number);
        onChange (cb: AccelerometerCallback);
    }
    
    export interface InputBox extends BaseInputSource {
        show (): Promise<void>;
        hide (): Promise<void>;
        onChange ();
        onComplete ();
        offChange ();
        offComplete ();
    }

    class Input {
        public _touch: TouchInputSource;
        public _mouse: MouseInputSource;
        public _keyboard: KeyboardInputSource;
        public _accelerometer: AccelerometerInputSource;
        public _inputBox: InputBox;

        // Accelerometer
        public startAccelerometer (): Promise<void>;
        public stopAccelerometer (): Promise<void>;
        public setAccelerometerInterval (intercal: number): void;

        // input box
        public showInputBox (): Promise<void>;
        public hideInputBox (): Promise<void>;
        public onInputBoxChange (cb: Function);
        public onInputBoxComplete (cb: Function);

        public pollEvent(): BaseInputEvent | undefined;
    }

    export const input: Input;
}