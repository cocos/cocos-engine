import { HandsetCallback } from 'pal/input';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { EventHandset } from '../../../cocos/input/types';
import { InputSourcePosition, InputSourceOrientation } from '../input-source';
import { Vec3, Quat } from '../../../cocos/core/math';

enum Pose {
    AR_MOBILE,
}

interface IPoseValue {
    position: Vec3;
    orientation: Quat;
}

type NativePoseState = Record<Pose, IPoseValue>

export class HandsetInputDevice {
    public get handsetPosition () { return this._handsetPosition; }
    public get handsetOrientation () { return this._handsetOrientation; }

    private _eventTarget: EventTarget = new EventTarget();

    private _handsetPosition!: InputSourcePosition;
    private _handsetOrientation!: InputSourceOrientation;

    private _nativePoseState: NativePoseState = {
        [Pose.AR_MOBILE]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
    }

    constructor () {
        this._initInputSource();
        this._registerEvent();
    }

    private _registerEvent () {
        jsb.onHandsetPoseInput = (infoList: jsb.PoseInfo[]) => {
            for (let i = 0; i < infoList.length; ++i) {
                const info = infoList[i];
                this._updateNativePoseState(info);
            }

            this._eventTarget.emit(InputEventType.HANDSET_POSE_INPUT, new EventHandset(InputEventType.HANDSET_POSE_INPUT, this));
        };
    }

    /**
     * @engineInternal
     */
    public _on (eventType: InputEventType, callback: HandsetCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }

    private _updateNativePoseState (info: jsb.PoseInfo) {
        switch (info.code) {
            case 7:
                this._nativePoseState[Pose.AR_MOBILE] = { position: new Vec3(info.x, info.y, info.z), orientation: new Quat(info.quaternionX, info.quaternionY, info.quaternionZ, info.quaternionW) };
                break;
            default:
                break;
        }
    }

    private _initInputSource () {
        this._handsetPosition = new InputSourcePosition();
        this._handsetPosition.getValue = () => this._nativePoseState[Pose.AR_MOBILE].position;
        
        this._handsetOrientation = new InputSourceOrientation();
        this._handsetOrientation.getValue = () => this._nativePoseState[Pose.AR_MOBILE].orientation;
    }
}
