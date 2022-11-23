

import { IVec2Like } from '../../core';
import { ILifecycle } from '../../physics/spec/i-lifecycle';
import { Joint2D, RigidBody2D } from '../framework';

export interface IJoint2D extends ILifecycle {
    readonly impl: any;

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
