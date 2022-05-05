import { GamepadCallback } from 'pal/input';
import { systemInfo } from 'pal/system-info';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { GamepadCode } from '../../../cocos/input/types/gamepad-code';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Gamepad as CocosGamepad, EventGamepad } from '../../../cocos/input/types';
import legacyCC from '../../../predefine';
import { Feature } from '../../system-info/enum-type';

const EPSILON = 0.01;
type WebGamepad = Gamepad;

export class GamepadInputSource {
    private _cachedWebGamepads: (WebGamepad | null)[] = [];
    private _eventTarget: EventTarget = new EventTarget();

    private _intervalId = -1;

    constructor () {
        if (!systemInfo.hasFeature(Feature.EVENT_GAMEPAD)) {
            return;
        }
        this._registerEvent();
    }

    public on (eventType: InputEventType, cb: GamepadCallback, target?: any) {
        this._eventTarget.on(eventType, cb, target);
    }

    private _ensureDirectorDefined () {
        return new Promise<void>((resolve) => {
            this._intervalId = setInterval(() => {
                if (legacyCC.director && legacyCC.Director) {
                    clearInterval(this._intervalId);
                    this._intervalId = -1;
                    resolve();
                }
            }, 50);
        });
    }

    private _registerEvent () {
        this._ensureDirectorDefined().then(() => {
            legacyCC.director.on(legacyCC.Director.EVENT_BEGIN_FRAME, this._scanGamepads, this);
        }).catch((e) => {});
        window.addEventListener('gamepadconnected', (e) => {
            this._cachedWebGamepads[e.gamepad.index] = e.gamepad;
            const coocsGamepad = new CocosGamepad(e.gamepad.index, true);
            this._eventTarget.emit(InputEventType.GAMEPAD_CHANGE, new EventGamepad(InputEventType.GAMEPAD_CHANGE, [coocsGamepad]));
        });
        window.addEventListener('gamepaddisconnected', (e) => {
            this._cachedWebGamepads[e.gamepad.index] = null;
            const coocsGamepad = new CocosGamepad(e.gamepad.index, false);
            this._eventTarget.emit(InputEventType.GAMEPAD_CHANGE, new EventGamepad(InputEventType.GAMEPAD_CHANGE, [coocsGamepad]));
        });
    }
    private _scanGamepads () {
        const webGamepads = this._getWebGamePads();
        if (!webGamepads) {
            return;
        }
        const cocosGamepads: CocosGamepad[] = [];
        for (let i = 0; i < webGamepads.length; ++i) {
            const webGamepad = webGamepads?.[i];
            if (!webGamepad) {
                continue;
            }
            const cachedWebGamepad = this._cachedWebGamepads[webGamepad.index];
            // TODO: what if cachedWebGamepad is null
            if (cachedWebGamepad) {
                let cacheUpdated = false;

                const cachedButtons = cachedWebGamepad.buttons;
                for (let j = 0; j < cachedButtons.length; ++j) {
                    const cachedButton = cachedButtons[j];
                    const button = webGamepad.buttons[j];
                    if (Math.abs(cachedButton.value - button.value) > EPSILON) {
                        cocosGamepads.push(new CocosGamepad(webGamepad.index, true, this._genCodeMap(webGamepad)));
                        cacheUpdated = true;
                        break;
                    }
                }
                if (cacheUpdated) {
                    // update cache
                    this._cachedWebGamepads[webGamepad.index] = webGamepad;
                    continue;
                }

                const cachedAxes = cachedWebGamepad.axes;
                for (let j = 0; j < cachedAxes.length; ++j) {
                    const cachedAxisValue = cachedAxes[j];
                    const axisValue = webGamepad.axes[j];
                    if (Math.abs(cachedAxisValue - axisValue) > EPSILON) {
                        cocosGamepads.push(new CocosGamepad(webGamepad.index, true, this._genCodeMap(webGamepad)));
                        cacheUpdated = true;
                        break;
                    }
                }
                if (cacheUpdated) {
                    // update cache
                    this._cachedWebGamepads[webGamepad.index] = webGamepad;
                    continue;
                }
            }
        }
        if (cocosGamepads.length > 0) {
            this._eventTarget.emit(InputEventType.GAMEPAD_INPUT, new EventGamepad(InputEventType.GAMEPAD_INPUT, cocosGamepads));
        }
    }

    private _genCodeMap (webGamepad: WebGamepad): Record<GamepadCode, number> {
        // @ts-expect-error missing properties
        const codeMap: Record<GamepadCode, number> = {};

        const buttons = webGamepad.buttons;
        for (let i = 0; i < buttons.length; ++i) {
            const button = buttons[i];
            codeMap[i] = button.value;
        }

        const axes = webGamepad.axes;
        for (let i = 0; i < axes.length; ++i) {
            let axisValue = axes[i];
            if (i === 1 || i === 3) {
                axisValue = -axisValue;  // revert y axis
            }
            codeMap[18 + i] = axisValue;
        }
        return codeMap;
    }

    private _getWebGamePads () {
        if (typeof navigator.getGamepads === 'function') {
            return navigator.getGamepads();
            // @ts-expect-error Property 'webkitGetGamepads' does not exist on type 'Navigator'
        } else if (typeof navigator.webkitGetGamepads === 'function') {
            // @ts-expect-error Property 'webkitGetGamepads' does not exist on type 'Navigator'
            return navigator.webkitGetGamepads() as (Gamepad | null)[];
        }
        return [];
    }
}
