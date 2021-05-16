import { KeyboardCallback, KeyboardInputEvent } from 'pal/input';
import { SystemEventType } from '../../../cocos/core/platform/event-manager/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';

export class KeyboardInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = document.documentElement.onkeyup !== undefined;
        this._registerEvent();
    }

    private _registerEvent () {
        const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
        canvas?.addEventListener('keydown', this._createCallback('keydown'));
        canvas?.addEventListener('keyup', this._createCallback('keyup'));
    }

    private _createCallback (eventType: string) {
        return (event: KeyboardEvent) => {
            const inputEvent: KeyboardInputEvent = {
                type: eventType,
                code: event.keyCode,  // TODO: keyCode is deprecated on Web standard
                timestamp: performance.now(),
            };
            event.stopPropagation();
            event.preventDefault();
            this._eventTarget.emit(eventType, inputEvent);
        };
    }

    public onDown (cb: KeyboardCallback) {
        this._eventTarget.on(SystemEventType.KEYBOARD_DOWN, cb);
    }

    public onPressing (cb: KeyboardCallback) {
        this._eventTarget.on('keydown', cb);
    }

    public onUp (cb: KeyboardCallback) {
        this._eventTarget.on('keyup', cb);
        this._eventTarget.on(SystemEventType.KEYBOARD_UP, cb);
    }
}
