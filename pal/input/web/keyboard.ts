import { KeyboardCallback, KeyboardInputEvent } from 'pal/input';
import { KeyboardEvent } from '../../../cocos/core/platform/event-manager/event-enum';
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
        canvas?.addEventListener('keydown', (event: any) => {
            event.stopPropagation();
            event.preventDefault();
            if (!event.repeat) {
                const keyDownInputEvent = this._getInputEvent(event, KeyboardEvent.KEY_DOWN);
                this._eventTarget.emit(KeyboardEvent.KEY_DOWN, keyDownInputEvent);
            }
            // @ts-expect-error Compability for key pressing callback
            const keyPressingInputEvent = this._getInputEvent(event, 'keydown');
            this._eventTarget.emit('keydown', keyPressingInputEvent);
        });
        canvas?.addEventListener('keyup', (event: any) => {
            const inputEvent = this._getInputEvent(event, KeyboardEvent.KEY_UP);
            event.stopPropagation();
            event.preventDefault();
            this._eventTarget.emit(KeyboardEvent.KEY_UP, inputEvent);
        });
    }

    private _getInputEvent (event: any, eventType: KeyboardEvent) {
        const inputEvent: KeyboardInputEvent = {
            type: eventType,
            code: event.keyCode,  // TODO: keyCode is deprecated on Web standard
            timestamp: performance.now(),
        };
        return inputEvent;
    }

    public onDown (cb: KeyboardCallback) {
        this._eventTarget.on(KeyboardEvent.KEY_DOWN, cb);
    }

    public onPressing (cb: KeyboardCallback) {
        this._eventTarget.on('keydown', cb);
    }

    public onUp (cb: KeyboardCallback) {
        this._eventTarget.on(KeyboardEvent.KEY_UP, cb);
    }
}
