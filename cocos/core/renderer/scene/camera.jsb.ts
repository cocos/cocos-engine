/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
import { Ray } from '../../geometry';
import { RenderWindow } from '../core/render-window';
import { ClearFlagBit } from '../../gfx';
import { _tempFloatArray } from '../../scene-graph/node.jsb';
import { Mat4, Vec3 } from '../../math';

export enum CameraFOVAxis {
    VERTICAL,
    HORIZONTAL,
}

export enum CameraProjection {
    ORTHO,
    PERSPECTIVE,
}

export enum CameraAperture {
    F1_8,
    F2_0,
    F2_2,
    F2_5,
    F2_8,
    F3_2,
    F3_5,
    F4_0,
    F4_5,
    F5_0,
    F5_6,
    F6_3,
    F7_1,
    F8_0,
    F9_0,
    F10_0,
    F11_0,
    F13_0,
    F14_0,
    F16_0,
    F18_0,
    F20_0,
    F22_0,
}

export enum CameraISO {
    ISO100,
    ISO200,
    ISO400,
    ISO800,
}

export enum CameraShutter {
    D1,
    D2,
    D4,
    D8,
    D15,
    D30,
    D60,
    D125,
    D250,
    D500,
    D1000,
    D2000,
    D4000,
}

export interface ICameraInfo {
    name: string;
    node: Node;
    projection: number;
    targetDisplay?: number;
    window?: RenderWindow | null;
    priority: number;
    pipeline?: string;
}

export const SKYBOX_FLAG = ClearFlagBit.STENCIL << 1;

export const Camera = jsb.Camera;
const cameraProto: any = jsb.Camera.prototype;

Object.defineProperty(Camera, "standardExposureValue", {
    configurable: true,
    enumerable: true,
    get () {
        return Camera.getStandardExposureValue();
    },
});

Object.defineProperty(Camera, "standardLightMeterScale", {
    configurable: true,
    enumerable: true,
    get () {
        return Camera.getStandardLightMeterScale();
    },
});

const oldScreenPointToRay = cameraProto.screenPointToRay;
const oldScreenToWorld = cameraProto.screenToWorld;
const oldWorldToScreen = cameraProto.worldToScreen;
const oldWorldMatrixToScreen = cameraProto.worldMatrixToScreen;

/**
 * transform a screen position (in oriented space) to a world space ray
 */
cameraProto.screenPointToRay = function screenPointToRay (out: Ray, x: number, y: number): Ray {
    _tempFloatArray[0] = x;
    _tempFloatArray[1] = y;
    oldScreenPointToRay.call(this);

    out.o.x = _tempFloatArray[0];
    out.o.y = _tempFloatArray[1];
    out.o.z = _tempFloatArray[2];
    out.d.x = _tempFloatArray[3];
    out.d.y = _tempFloatArray[4];
    out.d.z = _tempFloatArray[5];

    return out;
};

cameraProto.screenToWorld = function screenToWorld (out: Vec3, screenPos: Vec3): Vec3 {
    _tempFloatArray[0] = screenPos.x;
    _tempFloatArray[1] = screenPos.y;
    _tempFloatArray[2] = screenPos.z;
    oldScreenToWorld.call(this);
    Vec3.set(out, _tempFloatArray[0], _tempFloatArray[1], _tempFloatArray[2]);
    return out;
};

cameraProto.worldToScreen = function worldToScreen (out: Vec3, worldPos: Vec3 | Readonly<Vec3>): Vec3 {
    _tempFloatArray[0] = worldPos.x;
    _tempFloatArray[1] = worldPos.y;
    _tempFloatArray[2] = worldPos.z;
    oldWorldToScreen.call(this);
    Vec3.set(out, _tempFloatArray[0], _tempFloatArray[1], _tempFloatArray[2]);
    return out;
};

cameraProto.worldMatrixToScreen = function worldMatrixToScreen (out: Mat4, worldMatrix: Mat4, width: number, height: number) {
    _tempFloatArray[0] = worldMatrix.m00;
    _tempFloatArray[1] = worldMatrix.m01;
    _tempFloatArray[2] = worldMatrix.m02;
    _tempFloatArray[3] = worldMatrix.m03;
    _tempFloatArray[4] = worldMatrix.m04;
    _tempFloatArray[5] = worldMatrix.m05;
    _tempFloatArray[6] = worldMatrix.m06;
    _tempFloatArray[7] = worldMatrix.m07;
    _tempFloatArray[8] = worldMatrix.m08;
    _tempFloatArray[9] = worldMatrix.m09;
    _tempFloatArray[10] = worldMatrix.m10;
    _tempFloatArray[11] = worldMatrix.m11;
    _tempFloatArray[12] = worldMatrix.m12;
    _tempFloatArray[13] = worldMatrix.m13;
    _tempFloatArray[14] = worldMatrix.m14;
    _tempFloatArray[15] = worldMatrix.m15;

    _tempFloatArray[16] = width;
    _tempFloatArray[17] = height;

    oldWorldMatrixToScreen.call(this);
    Mat4.set(out,
        _tempFloatArray[0], _tempFloatArray[1], _tempFloatArray[2], _tempFloatArray[3],
        _tempFloatArray[4], _tempFloatArray[5], _tempFloatArray[6], _tempFloatArray[7],
        _tempFloatArray[8], _tempFloatArray[9], _tempFloatArray[10], _tempFloatArray[11],
        _tempFloatArray[12], _tempFloatArray[13], _tempFloatArray[14], _tempFloatArray[15]
    );
    return out;
};


