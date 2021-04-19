import { EDITOR } from 'internal:constants';
import { BaseInputEvent } from 'pal/input';
import { AccelerometerInputSource } from './accelerometer';
import { InputBox } from './input-box';
import { KeyboardInputSource } from './keyboard';
import { MouseInputSource } from './mouse';
import { TouchInputSource } from './touch';

export class Input {
    public _touch = new TouchInputSource();
    public _mouse = new MouseInputSource();
    public _keyboard = new KeyboardInputSource();
    public _accelerometer = new AccelerometerInputSource();
    public _inputBox = new InputBox();
    private _inputEventList: BaseInputEvent[] = [];

    constructor () {
        this._registerEvent();
    }

    private _registerEvent () {
        // if (EDITOR) {
        //     return;
        // }
        // TODO: implement event main loop
        // if (this._touch.support) {
        //     this._touch.onStart(this._pushEvent);
        //     this._touch.onMove(this._pushEvent);
        //     this._touch.onEnd(this._pushEvent);
        //     this._touch.onCancel(this._pushEvent);
        // }

        // if (this._mouse.support) {
        //     this._mouse.onDown(this._pushEvent);
        //     this._mouse.onMove(this._pushEvent);
        //     this._mouse.onUp(this._pushEvent);
        //     this._mouse.onCancel(this._pushEvent);
        //     this._mouse.onWheel(this._pushEvent);
        // }

        // if (this._keyboard.support) {
        //     this._keyboard.onDown(this._pushEvent);
        //     this._keyboard.onUp(this._pushEvent);
        // }

        // if (this._accelerometer.support) {
        //     this._accelerometer.onChange(this._pushEvent);
        // }
    }

    private _pushEvent (inputEvent: BaseInputEvent) {
        this._inputEventList.push(inputEvent);
    }

    // // accelerometer
    // public startAccelerometer (): Promise<void>;
    // public stopAccelerometer (): Promise<void>;
    // public setAccelerometerInterval (intercal: number): void;

    // // input box
    // public showInputBox (): Promise<void>;
    // public hideInputBox (): Promise<void>;
    // public onInputBoxChange (cb: Function);
    // public onInputBoxComplete (cb: Function);

    public pollEvent (): BaseInputEvent | undefined {
        return this._inputEventList.shift();
    }
}

export const input = new Input();
