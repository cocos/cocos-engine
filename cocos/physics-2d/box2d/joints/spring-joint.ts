import b2 from '@cocos/box2d';
import { ISpringJoint } from '../../spec/i-physics-joint';
import { b2Joint } from './joint-2d';
import { SpringJoint2D } from '../../framework';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';

export class b2SpringJoint extends b2Joint implements ISpringJoint {
    setDampingRatio (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.DistanceJoint).SetDampingRatio(v);
        }
    }
    setFrequency (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.DistanceJoint).SetFrequency(v);
        }
    }
    setDistance (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.DistanceJoint).SetLength(v);
        }
    }

    _createJointDef () {
        const comp = this._jointComp as SpringJoint2D;
        const def = new b2.DistanceJointDef();
        def.localAnchorA.Set(comp.anchor.x / PHYSICS_2D_PTM_RATIO, comp.anchor.y / PHYSICS_2D_PTM_RATIO);
        def.localAnchorB.Set(comp.connectedAnchor.x / PHYSICS_2D_PTM_RATIO, comp.connectedAnchor.y / PHYSICS_2D_PTM_RATIO);
        def.length = comp.distance / PHYSICS_2D_PTM_RATIO;
        def.dampingRatio = comp.dampingRatio;
        def.frequencyHz = comp.frequency;
        return def;
    }
}
