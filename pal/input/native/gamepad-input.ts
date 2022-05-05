import { GamepadCallback } from 'pal/input';
import { systemInfo } from 'pal/system-info';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { Feature } from '../../system-info/enum-type';
import { GamepadCode } from '../../../cocos/input/types/gamepad-code';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Gamepad, EventGamepad } from '../../../cocos/input/types';

const _nativeButtonMap = {
    1: GamepadCode.Y,  // NS_A
    2: GamepadCode.B,  // NS_B
    3: GamepadCode.A,  // NS_X
    4: GamepadCode.X,  // NS_Y
    5: GamepadCode.L1,
    6: GamepadCode.R1,
    7: GamepadCode.NS_MINUS,
    8: GamepadCode.NS_PLUS,
    9: GamepadCode.L3,
    10: GamepadCode.R3,
};

const _nativeAxisMap = {
    // 1: GamepadCode.DPAD_LEFT | GamepadCode.DPAD_RIGHT,
    // 2: GamepadCode.DPAD_UP | GamepadCode.DPAD_DOWN,
    3: GamepadCode.AXIS_LEFT_STICK_X,
    4: GamepadCode.AXIS_LEFT_STICK_Y,
    5: GamepadCode.AXIS_RIGHT_STICK_X,
    6: GamepadCode.AXIS_RIGHT_STICK_Y,
    7: GamepadCode.L2,
    8: GamepadCode.R2,
};

type CodeMap = Record<GamepadCode, number>;

interface ICodeMapList {
    [id: number]: CodeMap;
}

export class GamepadInputSource {
    private _eventTarget: EventTarget = new EventTarget();
    private _codeMapList: ICodeMapList = [];

    constructor () {
        if (!systemInfo.hasFeature(Feature.EVENT_GAMEPAD)) {
            return;
        }
        this._registerEvent();
    }

    public on (eventType: InputEventType, cb: GamepadCallback, target?: any) {
        this._eventTarget.on(eventType, cb, target);
    }

    private _registerEvent () {
        jsb.onControllerInput = (infoList: jsb.ControllerInfo[]) => {
            const gamepads: Gamepad[] = [];
            for (let i = 0; i < infoList.length; ++i) {
                const info = infoList[i];
                const gamepad = new Gamepad(info.id, true, this._genCodeMap(info));
                gamepads.push(gamepad);
            }
            this._eventTarget.emit(InputEventType.GAMEPAD_INPUT, new EventGamepad(InputEventType.GAMEPAD_INPUT, gamepads));
        };

        jsb.onControllerChange = (controllerIds) => {
            const gamepads: Gamepad[] = [];
            for (let i = 0; i < controllerIds.length; ++i) {
                const id = controllerIds[i];
                const gamepad = new Gamepad(id, true, this._genCodeMapFromId(id));
                gamepads.push(gamepad);
            }
            this._eventTarget.emit(InputEventType.GAMEPAD_CHANGE, new EventGamepad(InputEventType.GAMEPAD_CHANGE, gamepads));
        };
    }

    private _createCodeMap (): CodeMap {
        // @ts-expect-error missing properties
        const codeMap: CodeMap = {};
        Object.keys(GamepadCode).forEach((code) => {
            codeMap[code] = 0;
        });
        return codeMap;
    }

    private _genCodeMap (info: jsb.ControllerInfo): Record<GamepadCode, number> {
        const codeMap: CodeMap = this._codeMapList[info.id] = this._codeMapList[info.id] || this._createCodeMap();

        const buttonInfoList = info.buttonInfoList;
        for (let i = 0; i < buttonInfoList.length; ++i) {
            const buttonInfo = buttonInfoList[i];
            const code = _nativeButtonMap[buttonInfo.code];
            codeMap[code] = buttonInfo.isPressed ? 1 : 0;
        }

        const axisInfoList = info.axisInfoList;
        for (let i = 0; i < axisInfoList.length; ++i) {
            const axisInfo = axisInfoList[i];
            let code: number;
            let value: number;
            if (axisInfo.code === 1) {
                if (axisInfo.value > 0) {
                    codeMap[GamepadCode.DPAD_RIGHT] = Math.abs(axisInfo.value);
                    codeMap[GamepadCode.DPAD_LEFT] = 0;
                } else {
                    codeMap[GamepadCode.DPAD_LEFT] = Math.abs(axisInfo.value);
                    codeMap[GamepadCode.DPAD_RIGHT] = 0;
                }
                value = Math.abs(axisInfo.value);
            } else if (axisInfo.code === 2) {
                if (axisInfo.value > 0) {
                    codeMap[GamepadCode.DPAD_UP] = Math.abs(axisInfo.value);
                    codeMap[GamepadCode.DPAD_DOWN] = 0;
                } else {
                    codeMap[GamepadCode.DPAD_DOWN] = Math.abs(axisInfo.value);
                    codeMap[GamepadCode.DPAD_UP] = 0;
                }
            } else {
                code = _nativeAxisMap[axisInfo.code];
                value = axisInfo.value;
                codeMap[code] = value;
            }
        }
        return codeMap;
    }

    private _genCodeMapFromId (id: number) {
        if (!this._codeMapList[id]) {
            this._codeMapList[id] = this._createCodeMap();
        }
        return this._codeMapList[id];
    }
}
