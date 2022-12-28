/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { HandheldCallback } from 'pal/input';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { EventHandheld } from '../../../cocos/input/types';
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

export class HandheldInputDevice {
    public get handheldPosition () { return this._handheldPosition; }
    public get handheldOrientation () { return this._handheldOrientation; }

    private _eventTarget: EventTarget = new EventTarget();

    private _handheldPosition!: InputSourcePosition;
    private _handheldOrientation!: InputSourceOrientation;

    private _nativePoseState: NativePoseState = {
        [Pose.AR_MOBILE]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
    }

    constructor () {
        this._initInputSource();
        this._registerEvent();
    }

    private _registerEvent () {
        jsb.onHandheldPoseInput = (infoList: jsb.PoseInfo[]) => {
            for (let i = 0; i < infoList.length; ++i) {
                const info = infoList[i];
                this._updateNativePoseState(info);
            }

            this._eventTarget.emit(InputEventType.HANDHELD_POSE_INPUT, new EventHandheld(InputEventType.HANDHELD_POSE_INPUT, this));
        };
    }

    /**
     * @engineInternal
     */
    public _on (eventType: InputEventType, callback: HandheldCallback, target?: any) {
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
        this._handheldPosition = new InputSourcePosition();
        this._handheldPosition.getValue = () => this._nativePoseState[Pose.AR_MOBILE].position;

        this._handheldOrientation = new InputSourceOrientation();
        this._handheldOrientation.getValue = () => this._nativePoseState[Pose.AR_MOBILE].orientation;
    }
}
