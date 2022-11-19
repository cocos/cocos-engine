import b2 from '@cocos/box2d';
import { IDistanceJoint } from '../../spec/i-physics-joint';
import { b2Joint } from './joint-2d';
import { DistanceJoint2D } from '../../framework';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';

export class b2DistanceJoint extends b2Joint implements IDistanceJoint {
    setMaxLength (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.RopeJoint).SetMaxLength(v);
        }
    }

    _createJointDef () {
        const comp = this._jointComp as DistanceJoint2D;
        const def = new b2.RopeJointDef();
        def.localAnchorA.Set(comp.anchor.x / PHYSICS_2D_PTM_RATIO, comp.anchor.y / PHYSICS_2D_PTM_RATIO);
        def.localAnchorB.Set(comp.connectedAnchor.x / PHYSICS_2D_PTM_RATIO, comp.connectedAnchor.y / PHYSICS_2D_PTM_RATIO);
        def.maxLength = comp.maxLength / PHYSICS_2D_PTM_RATIO;
        return def;
    }
}
