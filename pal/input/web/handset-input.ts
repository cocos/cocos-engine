import { HandsetCallback } from 'pal/input';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { InputSourcePosition, InputSourceOrientation } from '../input-source';
import { Vec3, Quat } from '../../../cocos/core/math';

export class HandsetInputDevice {
    public get handsetPosition () { return this._handsetPosition; }
    public get handsetOrientation () { return this._handsetOrientation; }

    private _eventTarget: EventTarget = new EventTarget();

    private _handsetPosition!: InputSourcePosition;
    private _handsetOrientation!: InputSourceOrientation;

    constructor () {
        this._initInputSource();
    }

    /**
     * @engineInternal
     */
    public _on (eventType: InputEventType, callback: HandsetCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }

    private _initInputSource () {
        this._handsetPosition = new InputSourcePosition();
        this._handsetPosition.getValue = () => Vec3.ZERO;
        this._handsetOrientation = new InputSourceOrientation();
        this._handsetOrientation.getValue = () =>  Quat.IDENTITY;
    }
}
