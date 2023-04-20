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

import { HMDCallback } from 'pal/input';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { EventHMD } from '../../../cocos/input/types';
import { InputSourcePosition, InputSourceOrientation } from '../input-source';
import { Vec3, Quat } from '../../../cocos/core/math';
import legacyCC from '../../../predefine';

enum Pose {
    VIEW_LEFT = 0,
    VIEW_RIGHT = 3,
    HEAD_MIDDLE = 6,
}

interface IPoseValue {
    position: Vec3;
    orientation: Quat;
}

interface IPoseInfo {
    readonly code: number;
    readonly position: DOMPointReadOnly;
    readonly orientation: DOMPointReadOnly;
}

type WebPoseState = Record<Pose, IPoseValue>

export class HMDInputDevice {
    public get viewLeftPosition () { return this._viewLeftPosition; }
    public get viewLeftOrientation () { return this._viewLeftOrientation; }
    public get viewRightPosition () { return this._viewRightPosition; }
    public get viewRightOrientation () { return this._viewRightOrientation; }
    public get headMiddlePosition () { return this._headMiddlePosition; }
    public get headMiddleOrientation () { return this._headMiddleOrientation; }

    private _eventTarget: EventTarget = new EventTarget();
    private _intervalId = -1;

    private _viewLeftPosition!: InputSourcePosition;
    private _viewLeftOrientation!: InputSourceOrientation;
    private _viewRightPosition!: InputSourcePosition;
    private _viewRightOrientation!: InputSourceOrientation;
    private _headMiddlePosition!: InputSourcePosition;
    private _headMiddleOrientation!: InputSourceOrientation;

    private _webPoseState: WebPoseState = {
        [Pose.VIEW_LEFT]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
        [Pose.VIEW_RIGHT]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
        [Pose.HEAD_MIDDLE]: { position: Vec3.ZERO, orientation: Quat.IDENTITY },
    }

    constructor () {
        this._initInputSource();
        this._registerEvent();
    }

    private _ensureDirectorDefined () {
        return new Promise<void>((resolve) => {
            this._intervalId = setInterval(() => {
                if (legacyCC.director && legacyCC.Director) {
                    clearInterval(this._intervalId);
                    this._intervalId = -1;
                    resolve();
                }
            }, 50);
        });
    }

    private _registerEvent () {
        this._ensureDirectorDefined().then(() => {
            legacyCC.director.on(legacyCC.Director.EVENT_BEGIN_FRAME, this._scanHmd, this);
        }).catch((e) => {});
    }

    private _scanHmd () {
        const infoList = globalThis.__globalXR?.webxrHmdPoseInfos as IPoseInfo[];
        if (!infoList) {
            return;
        }

        for (let i = 0; i < infoList.length; ++i) {
            const info = infoList[i];
            this._updateWebPoseState(info);
        }
        this._eventTarget.emit(InputEventType.HMD_POSE_INPUT, new EventHMD(InputEventType.HMD_POSE_INPUT, this));
    }

    /**
     * @engineInternal
     */
    public _on (eventType: InputEventType, callback: HMDCallback, target?: any) {
        this._eventTarget.on(eventType, callback, target);
    }

    private _updateWebPoseState (info: IPoseInfo) {
        if (info.code !== Pose.VIEW_LEFT && info.code !== Pose.VIEW_RIGHT && info.code !== Pose.HEAD_MIDDLE) {
            return;
        }

        this._webPoseState[info.code] = {
            position: new Vec3(info.position.x, info.position.y, info.position.z),
            orientation: new Quat(info.orientation.x, info.orientation.y, info.orientation.z, info.orientation.w),
        };
    }

    private _initInputSource () {
        this._viewLeftPosition = new InputSourcePosition();
        this._viewLeftPosition.getValue = () => this._webPoseState[Pose.VIEW_LEFT].position;
        this._viewLeftOrientation = new InputSourceOrientation();
        this._viewLeftOrientation.getValue = () => this._webPoseState[Pose.VIEW_LEFT].orientation;

        this._viewRightPosition = new InputSourcePosition();
        this._viewRightPosition.getValue = () => this._webPoseState[Pose.VIEW_RIGHT].position;
        this._viewRightOrientation = new InputSourceOrientation();
        this._viewRightOrientation.getValue = () => this._webPoseState[Pose.VIEW_RIGHT].orientation;

        this._headMiddlePosition = new InputSourcePosition();
        this._headMiddlePosition.getValue = () => this._webPoseState[Pose.HEAD_MIDDLE].position;
        this._headMiddleOrientation = new InputSourceOrientation();
        this._headMiddleOrientation.getValue = () => this._webPoseState[Pose.HEAD_MIDDLE].orientation;
    }
}
