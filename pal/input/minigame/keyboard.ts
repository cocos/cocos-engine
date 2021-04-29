import { KeyboardCallback, KeyboardInputEvent } from 'pal/input';
import { SystemEventType } from '../../../cocos/core/platform/event-manager/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';

export class KeyboardInputSource {
    public support: boolean;
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this.support = false;  // TODO: pc-wechat
    }

    public onDown (cb: KeyboardCallback) {
        this._eventTarget.on(SystemEventType.KEY_DOWN, cb);
    }

    public onUp (cb: KeyboardCallback) {
        this._eventTarget.on(SystemEventType.KEY_UP, cb);
    }
}
