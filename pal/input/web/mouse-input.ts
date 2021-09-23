import { EDITOR, TEST } from 'internal:constants';
import { MouseCallback } from 'pal/input';
import { EventMouse } from '../../../cocos/input/types';
import { EventTarget } from '../../../cocos/core/event';
import { Rect, Vec2 } from '../../../cocos/core/math';
import legacyCC from '../../../predefine';
import { InputEventType } from '../../../cocos/input/types/event-enum';

export class MouseInputSource {
    public support: boolean;
    private _canvas?: HTMLCanvasElement;
    private _eventTarget: EventTarget = new EventTarget();
    private _pointLocked = false;
    private _isPressed = false;
    private _preMousePos: Vec2 = new Vec2();

    constructor () {
        this.support = !EDITOR && document.documentElement.onmouseup !== undefined;
        if (this.support) {
            this._canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            if (!this._canvas && !TEST) {
                console.warn('failed to access canvas');
            }
            this._registerEvent();
        }
    }

    private _getCanvasRect (): Rect {
        const canvas = this._canvas;
        const box = canvas?.getBoundingClientRect();
        if (box) {
            return new Rect(box.x, box.y, box.width, box.height);
        }
        return new Rect(0, 0, 0, 0);
    }

    private _getLocation (mouseEvent: MouseEvent): Vec2 {
        const canvasRect = this._getCanvasRect();
        let x = this._pointLocked ? (this._preMousePos.x + mouseEvent.movementX) : (mouseEvent.clientX - canvasRect.x);
        let y = this._pointLocked ? (this._preMousePos.y - mouseEvent.movementY) : (canvasRect.y + canvasRect.height - mouseEvent.clientY);
        // TODO: should not call engine API
        const view = legacyCC.view;
        const dpr = view._devicePixelRatio;
        x *= dpr;
        y *= dpr;
        return new Vec2(x, y);
    }

    private _registerEvent () {
        // register mouse down event
        window.addEventListener('mousedown', () => {
            this._isPressed = true;
        });
        this._canvas?.addEventListener('mousedown', this._createCallback(InputEventType.MOUSE_DOWN));

        // register mouse move event
        this._canvas?.addEventListener('mousemove', this._createCallback(InputEventType.MOUSE_MOVE));

        // register mouse up event
        const handleMouseUp = this._createCallback(InputEventType.MOUSE_UP);
        window.addEventListener('mouseup', handleMouseUp);
        this._canvas?.addEventListener('mouseup', handleMouseUp);

        // register wheel event
        this._canvas?.addEventListener('wheel', this._handleMouseWheel.bind(this));
        this._registerPointerLockEvent();
    }

    // To be removed in the future.
    private _registerPointerLockEvent () {
        const lockChangeAlert = () => {
            const canvas = this._canvas;
            // @ts-expect-error undefined mozPointerLockElement
            if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
                this._pointLocked = true;
            } else {
                this._pointLocked = false;
            }
        };
        if ('onpointerlockchange' in document) {
            document.addEventListener('pointerlockchange', lockChangeAlert, false);
        } else if ('onmozpointerlockchange' in document) {
            document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
        }
    }

    private _createCallback (eventType: InputEventType) {
        return (mouseEvent: MouseEvent) => {
            const location = this._getLocation(mouseEvent);
            let button = mouseEvent.button;
            switch (eventType) {
            case InputEventType.MOUSE_DOWN:
                this._canvas?.focus();
                this._isPressed = true;
                break;
            case InputEventType.MOUSE_UP:
                this._isPressed = false;
                break;
            case InputEventType.MOUSE_MOVE:
                if (!this._isPressed) {
                    button = EventMouse.BUTTON_MISSING;
                }
                break;
            default:
                break;
            }

            const eventMouse = new EventMouse(eventType, false, this._preMousePos);
            eventMouse.setLocation(location.x, location.y);
            eventMouse.setButton(button);
            eventMouse.movementX = mouseEvent.movementX;
            eventMouse.movementY = mouseEvent.movementY;

            // update previous mouse position.
            this._preMousePos.set(location.x, location.y);
            mouseEvent.stopPropagation();
            if (mouseEvent.target === this._canvas) {
                mouseEvent.preventDefault();
            }
            this._eventTarget.emit(eventType, eventMouse);
        };
    }

    private _handleMouseWheel (mouseEvent: WheelEvent) {
        const eventType = InputEventType.MOUSE_WHEEL;
        const location = this._getLocation(mouseEvent);
        const button = mouseEvent.button;

        const eventMouse = new EventMouse(eventType, false, this._preMousePos);
        eventMouse.setLocation(location.x, location.y);
        eventMouse.setButton(button);
        eventMouse.movementX = mouseEvent.movementX;
        eventMouse.movementY = mouseEvent.movementY;

        const wheelSensitivityFactor = 5;
        eventMouse.setScrollData(mouseEvent.deltaX * wheelSensitivityFactor, -mouseEvent.deltaY * wheelSensitivityFactor);
        // update previous mouse position.
        this._preMousePos.set(location.x, location.y);
        mouseEvent.stopPropagation();
        if (mouseEvent.target === this._canvas) {
            mouseEvent.preventDefault();
        }
        this._eventTarget.emit(eventType, eventMouse);
    }

    public on (eventType: InputEventType, callback: MouseCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }
}
