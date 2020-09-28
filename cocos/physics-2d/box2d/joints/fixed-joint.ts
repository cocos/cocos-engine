import b2 from '@cocos/box2d';
import { IFixedJoint } from '../../spec/i-physics-joint';
import { b2Joint } from './joint-2d';
import { FixedJoint2D } from '../../framework';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';

export class b2FixedJoint extends b2Joint implements IFixedJoint {
    setFrequency (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.WeldJoint).SetStiffness(v);
        }
    }
    setDampingRatio (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.WeldJoint).SetDamping(v);
        }
    }

    _createJointDef () {
        let comp = this._jointComp as FixedJoint2D;
        let def = new b2.WeldJointDef();
        def.localAnchorA.Set(comp.anchor.x/PHYSICS_2D_PTM_RATIO, comp.anchor.y/PHYSICS_2D_PTM_RATIO);
        def.localAnchorB.Set(comp.connectedAnchor.x/PHYSICS_2D_PTM_RATIO, comp.connectedAnchor.y/PHYSICS_2D_PTM_RATIO);
        def.referenceAngle = 0;
        def.stiffness = comp.frequency;
        def.damping = comp.dampingRatio;
        return def;
    }
}
