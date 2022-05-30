/* eslint-disable brace-style */
import { GamepadCallback } from 'pal/input';
import { systemInfo } from 'pal/system-info';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { Feature } from '../../system-info/enum-type';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { EventGamepad } from '../../../cocos/input/types';
import { InputSourceButton, InputSourceDpad, InputSourceStick } from '../input-source';
import { fastRemoveAt } from '../../../cocos/core/utils/array';

enum Button {
    BUTTON_SOUTH = 'BUTTON_SOUTH',
    BUTTON_EAST = 'BUTTON_EAST',
    BUTTON_WEST = 'BUTTON_WEST',
    BUTTON_NORTH = 'BUTTON_NORTH',
    NS_MINUS = 'NS_MINUS',
    NS_PLUS = 'NS_PLUS',

    BUTTON_L1 = 'BUTTON_L1',
    BUTTON_L2 = 'BUTTON_L2',
    BUTTON_L3 = 'BUTTON_L3',
    BUTTON_R1 = 'BUTTON_R1',
    BUTTON_R2 = 'BUTTON_R2',
    BUTTON_R3 = 'BUTTON_R3',

    DPAD_UP = 'DPAD_UP',
    DPAD_DOWN = 'DPAD_DOWN',
    DPAD_LEFT = 'DPAD_LEFT',
    DPAD_RIGHT = 'DPAD_RIGHT',

    LEFT_STICK_UP = 'LEFT_STICK_UP',
    LEFT_STICK_DOWN = 'LEFT_STICK_DOWN',
    LEFT_STICK_LEFT = 'LEFT_STICK_LEFT',
    LEFT_STICK_RIGHT = 'LEFT_STICK_RIGHT',
    RIGHT_STICK_UP = 'RIGHT_STICK_UP',
    RIGHT_STICK_DOWN = 'RIGHT_STICK_DOWN',
    RIGHT_STICK_LEFT = 'RIGHT_STICK_LEFT',
    RIGHT_STICK_RIGHT = 'RIGHT_STICK_RIGHT',
}

type NativeButtonState = Record<Button, number>

const _nativeButtonMap = {
    1: Button.BUTTON_EAST,
    2: Button.BUTTON_SOUTH,
    3: Button.BUTTON_NORTH,
    4: Button.BUTTON_WEST,
    5: Button.BUTTON_L1,
    6: Button.BUTTON_R1,
    7: Button.NS_MINUS,
    8: Button.NS_PLUS,
    9: Button.BUTTON_L3,
    10: Button.BUTTON_R3,
};

interface IAxisValue {
    negative: number;
    positive: number;
}

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
    // @ts-expect-error init latter
    private _nativeButtonState: NativeButtonState = {};

    constructor (deviceId: number) {
        this._deviceId = deviceId;
        this._initNativeButtonState();
        this._initInputSource();
    }

    /**
     * @engineInternal
     */
    public static _init () {
        if (!systemInfo.hasFeature(Feature.EVENT_GAMEPAD)) {
            return;
        }
        GamepadInputDevice._registerEvent();
    }

    /**
     * @engineInternal
     */
    public static _on (eventType: InputEventType, cb: GamepadCallback, target?: any) {
        GamepadInputDevice._eventTarget.on(eventType, cb, target);
    }

    private static _removeInputDevice (id: number) {
        const removeIndex = GamepadInputDevice.all.findIndex((device) => device.deviceId === id);
        if (removeIndex === -1) {
            return;
        }
        fastRemoveAt(GamepadInputDevice.all, removeIndex);
    }
    private static _getInputDevice (id: number) {
        return GamepadInputDevice.all.find((device) => device.deviceId === id);
    }
    private static _createInputDevice (id: number, connected: boolean) {
        const device = new GamepadInputDevice(id);
        device._connected = connected;
        GamepadInputDevice.all.push(device);
        return device;
    }
    private static _getOrCreateInputDevice (id: number, connected: boolean): GamepadInputDevice {
        let device =  GamepadInputDevice._getInputDevice(id);
        if (!device) {
            device = GamepadInputDevice._createInputDevice(id, connected);
        }
        device._connected = connected;
        return device;
    }

    private static _registerEvent () {
        jsb.onControllerInput = (infoList: jsb.ControllerInfo[]) => {
            for (let i = 0; i < infoList.length; ++i) {
                const info = infoList[i];
                const device = GamepadInputDevice._getOrCreateInputDevice(info.id, true);
                device._updateNativeButtonState(info);
                GamepadInputDevice._eventTarget.emit(InputEventType.GAMEPAD_INPUT, new EventGamepad(InputEventType.GAMEPAD_INPUT, device));
            }
        };

        jsb.onControllerChange = (controllerIds) => {
            // check connecting
            for (let i = 0; i < controllerIds.length; ++i) {
                const id = controllerIds[i];
                let device = GamepadInputDevice._getInputDevice(id);
                if (!device) {
                    device = GamepadInputDevice._createInputDevice(id, true);
                    GamepadInputDevice._eventTarget.emit(InputEventType.GAMEPAD_CHANGE, new EventGamepad(InputEventType.GAMEPAD_CHANGE, device));
                }
            }
            // check disconnecting
            const allDevices = GamepadInputDevice.all;
            for (let i = 0; i < allDevices.length; ++i) {
                const device = allDevices[i];
                if (!controllerIds.includes(device.deviceId)) {
                    GamepadInputDevice._removeInputDevice(device.deviceId);
                    device._connected = false;
                    GamepadInputDevice._eventTarget.emit(InputEventType.GAMEPAD_CHANGE, new EventGamepad(InputEventType.GAMEPAD_CHANGE, device));
                }
            }
        };
    }

    private _initNativeButtonState () {
        const keys = Object.keys(Button);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            this._nativeButtonState[key] = 0;
        }
    }

    private _axisToButtons (axisValue: number): IAxisValue {
        const value = Math.abs(axisValue);
        if (axisValue > 0) {
            return { negative: 0, positive: value };
        } else if (axisValue < 0) {
            return { negative: value, positive: 0 };
        } else {
            return { negative: 0, positive: 0 };
        }
    }

    private _updateNativeButtonState (info: jsb.ControllerInfo) {
        const { buttonInfoList, axisInfoList } = info;
        for (let i = 0; i < buttonInfoList.length; ++i) {
            const buttonInfo = buttonInfoList[i];
            const button = _nativeButtonMap[buttonInfo.code];
            this._nativeButtonState[button] = buttonInfo.isPressed ? 1 : 0;
        }
        for (let i = 0; i < axisInfoList.length; ++i) {
            const axisInfo = axisInfoList[i];
            const { code, value } = axisInfo;
            let negativeButton: Button | undefined;
            let positiveButton: Button | undefined;
            let axisValue: IAxisValue | undefined;
            switch (code) {
            case 1:
                negativeButton = Button.DPAD_LEFT;
                positiveButton = Button.DPAD_RIGHT;
                axisValue = this._axisToButtons(value);
                break;
            case 2:
                negativeButton = Button.DPAD_DOWN;
                positiveButton = Button.DPAD_UP;
                axisValue = this._axisToButtons(value);
                break;
            case 3:
                negativeButton = Button.LEFT_STICK_LEFT;
                positiveButton = Button.LEFT_STICK_RIGHT;
                axisValue = this._axisToButtons(value);
                break;
            case 4:
                negativeButton = Button.LEFT_STICK_DOWN;
                positiveButton = Button.LEFT_STICK_UP;
                axisValue = this._axisToButtons(value);
                break;
            case 5:
                negativeButton = Button.RIGHT_STICK_LEFT;
                positiveButton = Button.RIGHT_STICK_RIGHT;
                axisValue = this._axisToButtons(value);
                break;
            case 6:
                negativeButton = Button.RIGHT_STICK_DOWN;
                positiveButton = Button.RIGHT_STICK_UP;
                axisValue = this._axisToButtons(value);
                break;
            default:
                if (code === 7) { this._nativeButtonState[Button.BUTTON_L2] = value; }
                else if (code === 8) { this._nativeButtonState[Button.BUTTON_R2] = value; }
                break;
            }
            if (negativeButton && positiveButton && axisValue) {
                this._nativeButtonState[negativeButton] = axisValue.negative;
                this._nativeButtonState[positiveButton] = axisValue.positive;
            }
        }
    }

    private _initInputSource () {
        this.buttonNorth = new InputSourceButton();
        this.buttonNorth.getValue = () => this._nativeButtonState[Button.BUTTON_NORTH];
        this.buttonEast = new InputSourceButton();
        this.buttonEast.getValue = () => this._nativeButtonState[Button.BUTTON_EAST];
        this.buttonWest = new InputSourceButton();
        this.buttonWest.getValue = () => this._nativeButtonState[Button.BUTTON_WEST];
        this.buttonSouth = new InputSourceButton();
        this.buttonSouth.getValue = () => this._nativeButtonState[Button.BUTTON_SOUTH];

        this.buttonL1 = new InputSourceButton();
        this.buttonL1.getValue = () => this._nativeButtonState[Button.BUTTON_L1];
        this.buttonL2 = new InputSourceButton();
        this.buttonL2.getValue = () => this._nativeButtonState[Button.BUTTON_L2];
        this.buttonL3 = new InputSourceButton();
        this.buttonL3.getValue = () => this._nativeButtonState[Button.BUTTON_L3];
        this.buttonR1 = new InputSourceButton();
        this.buttonR1.getValue = () => this._nativeButtonState[Button.BUTTON_R1];
        this.buttonR2 = new InputSourceButton();
        this.buttonR2.getValue = () => this._nativeButtonState[Button.BUTTON_R2];
        this.buttonR3 = new InputSourceButton();
        this.buttonR3.getValue = () => this._nativeButtonState[Button.BUTTON_R3];

        // this.buttonTouchPad = new InputSourceButton();
        // this.buttonTouchPad.getValue = () => 0;  // TODO: NX unavailable
        // this.buttonHome = new InputSourceButton();
        // this.buttonHome.getValue = () => 0;  // TODO: NX unavailable

        this.buttonShare = new InputSourceButton();
        this.buttonShare.getValue = () => this._nativeButtonState[Button.NS_MINUS];  // TODO: NX only for now
        this.buttonOptions = new InputSourceButton();
        this.buttonOptions.getValue = () => this._nativeButtonState[Button.NS_PLUS];  // TODO: NX only for now

        const dpadUp = new InputSourceButton();
        dpadUp.getValue = () => this._nativeButtonState[Button.DPAD_UP];
        const dpadDown = new InputSourceButton();
        dpadDown.getValue = () => this._nativeButtonState[Button.DPAD_DOWN];
        const dpadLeft = new InputSourceButton();
        dpadLeft.getValue = () => this._nativeButtonState[Button.DPAD_LEFT];
        const dpadRight = new InputSourceButton();
        dpadRight.getValue = () => this._nativeButtonState[Button.DPAD_RIGHT];
        this.dpad = new InputSourceDpad({ up: dpadUp, down: dpadDown, left: dpadLeft, right: dpadRight });

        const leftStickUp = new InputSourceButton();
        leftStickUp.getValue = () => this._nativeButtonState[Button.LEFT_STICK_UP];
        const leftStickDown = new InputSourceButton();
        leftStickDown.getValue = () => this._nativeButtonState[Button.LEFT_STICK_DOWN];
        const leftStickLeft = new InputSourceButton();
        leftStickLeft.getValue = () => this._nativeButtonState[Button.LEFT_STICK_LEFT];
        const leftStickRight = new InputSourceButton();
        leftStickRight.getValue = () => this._nativeButtonState[Button.LEFT_STICK_RIGHT];
        this.leftStick = new InputSourceStick({ up: leftStickUp, down: leftStickDown, left: leftStickLeft, right: leftStickRight });

        const rightStickUp = new InputSourceButton();
        rightStickUp.getValue = () => this._nativeButtonState[Button.RIGHT_STICK_UP];
        const rightStickDown = new InputSourceButton();
        rightStickDown.getValue = () => this._nativeButtonState[Button.RIGHT_STICK_DOWN];
        const rightStickLeft = new InputSourceButton();
        rightStickLeft.getValue = () => this._nativeButtonState[Button.RIGHT_STICK_LEFT];
        const rightStickRight = new InputSourceButton();
        rightStickRight.getValue = () => this._nativeButtonState[Button.RIGHT_STICK_RIGHT];
        this.rightStick = new InputSourceStick({ up: rightStickUp, down: rightStickDown, left: rightStickLeft, right: rightStickRight });
    }
}
