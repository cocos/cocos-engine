import { GamepadCallback } from 'pal/input';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { InputSourceButton, InputSourceDpad, InputSourceStick } from '../input-source';

export class GamepadInputDevice {
    public static all: GamepadInputDevice[] = [];

    public buttonNorth!: InputSourceButton;
    public buttonEast!: InputSourceButton;
    public buttonWest!: InputSourceButton;
    public buttonSouth!: InputSourceButton;

    public buttonL1!: InputSourceButton;
    public buttonL2!: InputSourceButton;
    public buttonL3!: InputSourceButton;
    public buttonR1!: InputSourceButton;
    public buttonR2!: InputSourceButton;
    public buttonR3!: InputSourceButton;

    // public buttonTouchPad!: InputSourceButton;
    // public buttonHome!: InputSourceButton;
    public buttonShare!: InputSourceButton;
    public buttonOptions!: InputSourceButton;

    public dpad!: InputSourceDpad;
    public leftStick!: InputSourceStick;
    public rightStick!: InputSourceStick;

    public get deviceId () {
        return this._deviceId;
    }
    public get connected () {
        return this._connected;
    }

    private static _eventTarget: EventTarget = new EventTarget();

    private _deviceId = -1;
    private _connected = false;

    constructor (deviceId: number) {
        this._deviceId = deviceId;
        this._initInputSource();
    }

    /**
     * @engineInternal
     */
    public static _init () {
        // not supported
    }

    /**
     * @engineInternal
     */
    public static _on (eventType: InputEventType, cb: GamepadCallback, target?: any) {
        GamepadInputDevice._eventTarget.on(eventType, cb, target);
    }

    private _initInputSource () {
        this.buttonNorth = new InputSourceButton();
        this.buttonNorth.getValue = () => 0;
        this.buttonEast = new InputSourceButton();
        this.buttonEast.getValue = () => 0;
        this.buttonWest = new InputSourceButton();
        this.buttonWest.getValue = () => 0;
        this.buttonSouth = new InputSourceButton();
        this.buttonSouth.getValue = () => 0;

        this.buttonL1 = new InputSourceButton();
        this.buttonL1.getValue = () => 0;
        this.buttonL2 = new InputSourceButton();
        this.buttonL2.getValue = () => 0;
        this.buttonL3 = new InputSourceButton();
        this.buttonL3.getValue = () => 0;
        this.buttonR1 = new InputSourceButton();
        this.buttonR1.getValue = () => 0;
        this.buttonR2 = new InputSourceButton();
        this.buttonR2.getValue = () => 0;
        this.buttonR3 = new InputSourceButton();
        this.buttonR3.getValue = () => 0;

        // this.buttonTouchPad = new InputSourceButton();
        // this.buttonTouchPad.getValue = () => 0;
        // this.buttonHome = new InputSourceButton();
        // this.buttonHome.getValue = () => 0;

        this.buttonShare = new InputSourceButton();
        this.buttonShare.getValue = () => 0;
        this.buttonOptions = new InputSourceButton();
        this.buttonOptions.getValue = () => 0;

        const dpadUp = new InputSourceButton();
        dpadUp.getValue = () => 0;
        const dpadDown = new InputSourceButton();
        dpadDown.getValue = () => 0;
        const dpadLeft = new InputSourceButton();
        dpadLeft.getValue = () => 0;
        const dpadRight = new InputSourceButton();
        dpadRight.getValue = () => 0;
        this.dpad = new InputSourceDpad({ up: dpadUp, down: dpadDown, left: dpadLeft, right: dpadRight });

        const leftStickUp = new InputSourceButton();
        leftStickUp.getValue = () => 0;
        const leftStickDown = new InputSourceButton();
        leftStickDown.getValue = () => 0;
        const leftStickLeft = new InputSourceButton();
        leftStickLeft.getValue = () => 0;
        const leftStickRight = new InputSourceButton();
        leftStickRight.getValue = () => 0;
        this.leftStick = new InputSourceStick({ up: leftStickUp, down: leftStickDown, left: leftStickLeft, right: leftStickRight });

        const rightStickUp = new InputSourceButton();
        rightStickUp.getValue = () => 0;
        const rightStickDown = new InputSourceButton();
        rightStickDown.getValue = () => 0;
        const rightStickLeft = new InputSourceButton();
        rightStickLeft.getValue = () => 0;
        const rightStickRight = new InputSourceButton();
        rightStickRight.getValue = () => 0;
        this.rightStick = new InputSourceStick({ up: rightStickUp, down: rightStickDown, left: rightStickLeft, right: rightStickRight });
    }
}
