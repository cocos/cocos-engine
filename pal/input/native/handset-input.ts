/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

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
