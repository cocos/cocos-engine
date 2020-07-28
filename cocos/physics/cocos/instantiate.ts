/**
 * @hidden
 */

import { registerSelectorCB } from '../framework/physics-selector';
import { BuiltInWorld } from './builtin-world';
import { BuiltinRigidBody } from './builtin-rigid-body';
import { BuiltinBoxShape } from './shapes/builtin-box-shape';
import { BuiltinSphereShape } from './shapes/builtin-sphere-shape';
import { BuiltinCapsuleShape } from './shapes/builtin-capsule-shape';

import { PhysicsSystem } from '../framework';

registerSelectorCB(() => {
    if (PhysicsSystem.PHYSICS_BUILTIN) {
        return {
            RigidBody: BuiltinRigidBody,
            BoxShape: BuiltinBoxShape,
            SphereShape: BuiltinSphereShape,
            PhysicsWorld: BuiltInWorld,
            CapsuleShape: BuiltinCapsuleShape
        }
    }
    return null;
});

import './deprecated';