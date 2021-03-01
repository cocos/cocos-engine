import b2, { MotorJointDef, Vec2 } from '@cocos/box2d';
import { IRelativeJoint } from '../../spec/i-physics-joint';
import { b2Joint } from './joint-2d';
import { RelativeJoint2D } from '../../framework';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';
import { toRadian } from '../../../core';

export class b2RelativeJoint extends b2Joint implements IRelativeJoint {
    setMaxForce (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.MotorJoint).SetMaxForce(v);
        }
    }
    setAngularOffset (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.MotorJoint).SetAngularOffset(toRadian(v));
        }
    }
    setLinearOffset (v: Vec2) {
        if (this._b2joint) {
            (this._b2joint as b2.MotorJoint).SetLinearOffset(new b2.Vec2(v.x / PHYSICS_2D_PTM_RATIO, v.y / PHYSICS_2D_PTM_RATIO));
        }
    }
    setCorrectionFactor (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.MotorJoint).m_correctionFactor = v;
        }
    }
    setMaxTorque (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.MotorJoint).SetMaxTorque(v);
        }
    }

    _createJointDef () {
        const comp = this._jointComp as RelativeJoint2D;
        const def = new b2.MotorJointDef();
        def.linearOffset.Set(comp.linearOffset.x / PHYSICS_2D_PTM_RATIO, comp.linearOffset.y / PHYSICS_2D_PTM_RATIO);
        def.angularOffset = toRadian(comp.angularOffset);
        def.maxForce = comp.maxForce;
        def.maxTorque = comp.maxTorque;
        def.correctionFactor = comp.correctionFactor;
        return def;
    }
}
