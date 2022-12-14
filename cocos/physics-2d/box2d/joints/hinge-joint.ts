import b2 from '@cocos/box2d';
import { IHingeJoint } from '../../spec/i-physics-joint';
import { HingeJoint2D } from '../../framework';
import { b2Joint } from './joint-2d';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';
import { toRadian } from '../../../core';

export class b2HingeJoint extends b2Joint implements IHingeJoint {
    enableLimit (v: boolean) {
        if (this._b2joint) {
            (this._b2joint as b2.RevoluteJoint).EnableLimit(v);
        }
    }
    setLowerAngle (v: number) {
        this.updateLimits();
    }
    setUpperAngle (v: number) {
        this.updateLimits();
    }
    updateLimits () {
        if (this._b2joint) {
            const comp = this._jointComp as HingeJoint2D;
            (this._b2joint as b2.RevoluteJoint).SetLimits(toRadian(comp.lowerAngle), toRadian(comp.upperAngle));
        }
    }

    // motor
    enableMotor (v: boolean) {
        if (this._b2joint) {
            (this._b2joint as b2.RevoluteJoint).EnableMotor(v);
        }
    }
    setMaxMotorTorque (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.RevoluteJoint).SetMaxMotorTorque(v);
        }
    }
    setMotorSpeed (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.RevoluteJoint).SetMotorSpeed(v);
        }
    }

    _createJointDef () {
        const comp = this._jointComp as HingeJoint2D;
        const def = new b2.RevoluteJointDef();
        def.localAnchorA.Set(comp.anchor.x / PHYSICS_2D_PTM_RATIO, comp.anchor.y / PHYSICS_2D_PTM_RATIO);
        def.localAnchorB.Set(comp.connectedAnchor.x / PHYSICS_2D_PTM_RATIO, comp.connectedAnchor.y / PHYSICS_2D_PTM_RATIO);

        def.enableMotor = comp.enableMotor;
        def.maxMotorTorque = comp.maxMotorTorque;
        def.motorSpeed = toRadian(comp.motorSpeed);

        def.enableLimit = comp.enableLimit;
        def.lowerAngle = toRadian(comp.lowerAngle);
        def.upperAngle = toRadian(comp.upperAngle);
        return def;
    }
}
