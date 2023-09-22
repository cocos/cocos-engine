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

import { IVec2Like } from '../../core';
import { ILifecycle } from '../../physics/spec/i-lifecycle';
import { Joint2D, RigidBody2D } from '../framework';

export interface IJoint2D extends ILifecycle {
    readonly impl: any;
    apply (): void;
    initialize (v: Joint2D): void;
}

export interface IDistanceJoint extends IJoint2D {
    setMaxLength (v: number): void;
}

export interface ISpringJoint extends IJoint2D {
    setDistance (v: number): void;
    setFrequency (v: number): void;
    setDampingRatio (v: number): void;
}

export interface IFixedJoint extends IJoint2D {
    setFrequency (v: number): void;
    setDampingRatio (v: number): void;
}

export interface IRelativeJoint extends IJoint2D {
    setMaxForce (v: number): void;
    setMaxTorque (v: number): void;
    setLinearOffset (v: IVec2Like): void;
    setAngularOffset (v: number): void;
    setCorrectionFactor (v: number): void;
}

export interface IMouseJoint extends IJoint2D {
    setTarget (v: IVec2Like): void;
    setFrequency (v: number): void;
    setDampingRatio (v: number): void;
    setMaxForce (v: number): void;
}

export interface ISliderJoint extends IJoint2D {
    enableLimit (v: boolean): void;
    setLowerLimit (v: number): void;
    setUpperLimit (v: number): void;

    enableMotor (v: boolean): void;
    setMaxMotorForce (v: number): void;
    setMotorSpeed (v: number): void;
}

export interface IWheelJoint extends IJoint2D {
    enableMotor (v: boolean): void;
    setMaxMotorTorque (v: number): void;
    setMotorSpeed (v: number): void;

    setFrequency (v: number): void;
    setDampingRatio (v: number): void;
}

export interface IHingeJoint extends IJoint2D {
    enableMotor (v: boolean): void;
    setMaxMotorTorque (v: number): void;
    setMotorSpeed (v: number): void;

    enableLimit (v: boolean): void;
    setLowerAngle (v: number): void;
    setUpperAngle (v: number): void;
}
