/**
 * @hidden
 */

import { instantiate } from '../framework/physics-selector';
import { BuiltInWorld } from './builtin-world';
import { BuiltinRigidBody } from './builtin-rigid-body';
import { BuiltinBoxShape } from './shapes/builtin-box-shape';
import { BuiltinSphereShape } from './shapes/builtin-sphere-shape';
import { BuiltinCapsuleShape } from './shapes/builtin-capsule-shape';
import { PHYSICS_BUILTIN } from 'internal:constants';

if (PHYSICS_BUILTIN) {
    instantiate(
        {
            body: BuiltinRigidBody,
            box: BuiltinBoxShape,
            sphere: BuiltinSphereShape,
            world: BuiltInWorld,
            capsule: BuiltinCapsuleShape
        }
    );
}

import './deprecated';