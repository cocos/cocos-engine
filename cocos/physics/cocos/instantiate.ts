/**
 * @hidden
 */

import { instantiate } from '../framework/physics-selector';
import { BuiltInWorld } from './builtin-world';
import { BuiltinRigidBody } from './builtin-rigid-body';
import { BuiltinBoxShape } from './shapes/builtin-box-shape';
import { BuiltinSphereShape } from './shapes/builtin-sphere-shape';
import { BuiltinCapsuleShape } from './shapes/builtin-capsule-shape';

import { PhysicsSystem } from '../framework';

if (PhysicsSystem.PHYSICS_BUILTIN) {
    instantiate(
        {
            RigidBody: BuiltinRigidBody,
            BoxShape: BuiltinBoxShape,
            SphereShape: BuiltinSphereShape,
            PhysicsWorld: BuiltInWorld,
            CapsuleShape: BuiltinCapsuleShape
        }
    );
}

import './deprecated';