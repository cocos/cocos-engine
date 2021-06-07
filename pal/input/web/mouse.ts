import { EDITOR, TEST } from 'internal:constants';
import { MouseCallback, MouseInputEvent, MouseWheelCallback, MouseWheelInputEvent } from 'pal/input';
import { MouseEvent } from '../../../cocos/core/platform/event-manager/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Rect, Vec2 } from '../../../cocos/core/math';

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

    private _getLocation (event: any): Vec2 {
        return new Vec2(event.clientX, event.clientY);
    }

    private _registerEvent () {
        // register mouse down event
        window.addEventListener('mousedown', () => {
            this._isPressed = true;
        });
        this._canvas?.addEventListener('mousedown', this._createCallback(MouseEvent.MOUSE_DOWN));

        // register mouse move event
        this._canvas?.addEventListener('mousemove', this._createCallback(MouseEvent.MOUSE_MOVE));

        // register mouse up event
        window.addEventListener('mouseup', this._createCallback(MouseEvent.MOUSE_UP));
        this._canvas?.addEventListener('mouseup', this._createCallback(MouseEvent.MOUSE_UP));

        // register wheel event
        this._canvas?.addEventListener('wheel', (event: WheelEvent) => {
            const canvasRect = this._getCanvasRect();
            const location = this._getLocation(event);
            const wheelSensitivityFactor = 5;
            const inputEvent: MouseWheelInputEvent = {
                type: MouseEvent.MOUSE_WHEEL,
                x: location.x - canvasRect.x,
                y: canvasRect.y + canvasRect.height - location.y,
                button: event.button,  // TODO: what is the button when tracking mouse move ?
                deltaX: event.deltaX * wheelSensitivityFactor,
                deltaY: -event.deltaY * wheelSensitivityFactor,
                timestamp: performance.now(),
                movementX: event.movementX,
                movementY: event.movementY,
            };
            event.stopPropagation();
            event.preventDefault();
            this._eventTarget.emit(MouseEvent.MOUSE_WHEEL, inputEvent);
        });
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
            // @ts-expect-error undefined mozpointerlockchange event
            document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
        }
    }

    private _createCallback (eventType: MouseEvent) {
        return (event: any) => {
            const canvasRect = this._getCanvasRect();
            const location = this._getLocation(event);
            let button = event.button;
            switch (event.type) {
            case 'mousedown':
                this._canvas?.focus();
                this._isPressed = true;
                break;
            case 'mouseup':
                this._isPressed = false;
                break;
            case 'mousemove':
                if (!this._isPressed) {
                    button = -1;  // TODO: should not access EventMouse.BUTTON_MISSING, need a button enum type
                }
                break;
            default:
                break;
            }
            const inputEvent: MouseInputEvent = {
                type: eventType,
                x: this._pointLocked ? (this._preMousePos.x + <number>event.movementX) : (location.x - canvasRect.x),
                y: this._pointLocked ? (this._preMousePos.y - <number>event.movementY) : (canvasRect.y + canvasRect.height - location.y),
                button,
                timestamp: performance.now(),
                // this is web only property
                movementX: event.movementX,
                movementY: event.movementY,
            };
            // update previous mouse position.
            this._preMousePos.set(inputEvent.x, inputEvent.y);
            event.stopPropagation();
            if (event.target === this._canvas) {
                event.preventDefault();
            }
            // emit web mouse event
            this._eventTarget.emit(eventType, inputEvent);
        };
    }

    onDown (cb: MouseCallback) {
        this._eventTarget.on(MouseEvent.MOUSE_DOWN, cb);
    }
    onMove (cb: MouseCallback) {
        this._eventTarget.on(MouseEvent.MOUSE_MOVE, cb);
    }
    onUp (cb: MouseCallback) {
        this._eventTarget.on(MouseEvent.MOUSE_UP, cb);
    }
    onWheel (cb: MouseWheelCallback) {
        this._eventTarget.on(MouseEvent.MOUSE_WHEEL, cb);
    }
}
