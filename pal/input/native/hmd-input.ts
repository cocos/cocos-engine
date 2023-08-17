/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { InputEventType } from '../../../cocos/input/types/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { EventHMD } from '../../../cocos/input/types';
import { InputSourcePosition, InputSourceOrientation } from '../input-source';
import { Vec3, Quat } from '../../../cocos/core/math';

export type HMDCallback = (res: EventHMD) => void;

enum Pose {
    VIEW_LEFT,
    VIEW_RIGHT,
    HEAD_MIDDLE,
}

interface IPoseValue {
    position: Vec3;
    orientation: Quat;
}

type NativePoseState = Record<Pose, IPoseValue>

export class HMDInputDevice {
    public get viewLeftPosition (): InputSourcePosition { return this._viewLeftPosition; }
    public get viewLeftOrientation (): InputSourceOrientation { return this._viewLeftOrientation; }
    public get viewRightPosition (): InputSourcePosition { return this._viewRightPosition; }
    public get viewRightOrientation (): InputSourceOrientation { return this._viewRightOrientation; }
    public get headMiddlePosition (): InputSourcePosition { return this._headMiddlePosition; }
    public get headMiddleOrientation (): InputSourceOrientation { return this._headMiddleOrientation; }

    private _eventTarget: EventTarget = new EventTarget();

    private _viewLeftPosition!: InputSourcePosition;
    private _viewLeftOrientation!: InputSourceOrientation;
    private _viewRightPosition!: InputSourcePosition;
    private _viewRightOrientation!: InputSourceOrientation;
    private _headMiddlePosition!: InputSourcePosition;
    private _headMiddleOrientation!: InputSourceOrientation;

    private _nativePoseState: NativePoseState = {
        [Pose.VIEW_LEFT]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
        [Pose.VIEW_RIGHT]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
        [Pose.HEAD_MIDDLE]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
    }

    constructor () {
        this._initInputSource();
        this._registerEvent();
    }

    private _registerEvent (): void {
        jsb.onHMDPoseInput = (infoList: jsb.PoseInfo[]): void => {
            for (let i = 0; i < infoList.length; ++i) {
                const info = infoList[i];
                this._updateNativePoseState(info);
            }
            this._eventTarget.emit(InputEventType.HMD_POSE_INPUT, new EventHMD(InputEventType.HMD_POSE_INPUT, this));
        };
    }

    /**
     * @engineInternal
     */
    public _on (eventType: InputEventType, callback: HMDCallback, target?: any): void {
        this._eventTarget.on(eventType, callback, target);
    }

    private _updateNativePoseState (info: jsb.PoseInfo): void {
        switch (info.code) {
            case 0:
                this._nativePoseState[Pose.VIEW_LEFT] = { position: new Vec3(info.x, info.y, info.z), orientation: new Quat(info.quaternionX, info.quaternionY, info.quaternionZ, info.quaternionW) };
                break;
            case 3:
                this._nativePoseState[Pose.VIEW_RIGHT] = { position: new Vec3(info.x, info.y, info.z), orientation: new Quat(info.quaternionX, info.quaternionY, info.quaternionZ, info.quaternionW) };
                break;
            case 6:
                this._nativePoseState[Pose.HEAD_MIDDLE] = { position: new Vec3(info.x, info.y, info.z), orientation: new Quat(info.quaternionX, info.quaternionY, info.quaternionZ, info.quaternionW) };
                break;
            default:
                break;
        }
    }

    private _initInputSource (): void {
        this._viewLeftPosition = new InputSourcePosition();
        this._viewLeftPosition.getValue = (): Vec3 => this._nativePoseState[Pose.VIEW_LEFT].position;
        this._viewLeftOrientation = new InputSourceOrientation();
        this._viewLeftOrientation.getValue = (): Quat => this._nativePoseState[Pose.VIEW_LEFT].orientation;

        this._viewRightPosition = new InputSourcePosition();
        this._viewRightPosition.getValue = (): Vec3 => this._nativePoseState[Pose.VIEW_RIGHT].position;
        this._viewRightOrientation = new InputSourceOrientation();
        this._viewRightOrientation.getValue = (): Quat => this._nativePoseState[Pose.VIEW_RIGHT].orientation;

        this._headMiddlePosition = new InputSourcePosition();
        this._headMiddlePosition.getValue = (): Vec3 => this._nativePoseState[Pose.HEAD_MIDDLE].position;
        this._headMiddleOrientation = new InputSourceOrientation();
        this._headMiddleOrientation.getValue = (): Quat => this._nativePoseState[Pose.HEAD_MIDDLE].orientation;
    }
}
