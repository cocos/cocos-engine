/**
 * @hidden
 */

import { select } from '../framework/physics-selector';
import { BuiltInWorld } from './builtin-world';
import { BuiltinRigidBody } from './builtin-rigid-body';
import { BuiltinBoxShape } from './shapes/builtin-box-shape';
import { BuiltinSphereShape } from './shapes/builtin-sphere-shape';
import { BuiltinCapsuleShape } from './shapes/builtin-capsule-shape';

select('builtin', {
    RigidBody: BuiltinRigidBody,
    BoxShape: BuiltinBoxShape,
    SphereShape: BuiltinSphereShape,
    PhysicsWorld: BuiltInWorld,
    CapsuleShape: BuiltinCapsuleShape
});

import './deprecated';