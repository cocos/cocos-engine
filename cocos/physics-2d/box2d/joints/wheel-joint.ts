import b2 from '@cocos/box2d';
import { IWheelJoint } from '../../spec/i-physics-joint';
import { WheelJoint2D } from '../../framework';
import { b2Joint } from './joint-2d';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';
import { toRadian } from '../../../core';

export class b2WheelJoint extends b2Joint implements IWheelJoint {
    setDampingRatio (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.WheelJoint).SetSpringDampingRatio(v);
        }
    }
    setFrequency (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.WheelJoint).SetSpringFrequencyHz(v);
        }
    }

    // motor
    enableMotor (v: boolean) {
        if (this._b2joint) {
            (this._b2joint as b2.WheelJoint).EnableMotor(v);
        }
    }
    setMaxMotorTorque (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.WheelJoint).SetMaxMotorTorque(v);
        }
    }
    setMotorSpeed (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.WheelJoint).SetMotorSpeed(v);
        }
    }

    _createJointDef () {
        const comp = this._jointComp as WheelJoint2D;
        const def = new b2.WheelJointDef();
        def.localAnchorA.Set(comp.anchor.x / PHYSICS_2D_PTM_RATIO, comp.anchor.y / PHYSICS_2D_PTM_RATIO);
        def.localAnchorB.Set(comp.connectedAnchor.x / PHYSICS_2D_PTM_RATIO, comp.connectedAnchor.y / PHYSICS_2D_PTM_RATIO);
        const angle = toRadian(comp.angle);
        def.localAxisA.Set(Math.cos(angle), Math.sin(angle));
        // def.localAxisA.Set(0, 1);
        def.maxMotorTorque = comp.maxMotorTorque;
        def.motorSpeed = toRadian(comp.motorSpeed);
        def.enableMotor = comp.enableMotor;
        def.dampingRatio = comp.dampingRatio;
        def.frequencyHz = comp.frequency;
        return def;
    }
}
