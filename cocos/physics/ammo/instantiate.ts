import { PHYSICS_AMMO } from 'internal:constants';
import { instantiate } from '../framework/Physics-selector';
import { AmmoRigidBody } from './ammo-rigid-body';
import { AmmoWorld } from '../ammo/ammo-world';
import { AmmoBoxShape } from '../ammo/shapes/ammo-box-shape';
import { AmmoSphereShape } from '../ammo/shapes/ammo-sphere-shape';
import { AmmoCapsuleShape } from '../ammo/shapes/ammo-capsule-shape';
import { AmmoBvhTriangleMeshShape } from '../ammo/shapes/ammo-bvh-triangle-mesh-shape';

if (PHYSICS_AMMO) {
    instantiate({
        box: AmmoBoxShape,
        sphere: AmmoSphereShape,
        body: AmmoRigidBody,
        world: AmmoWorld,
        capsule: AmmoCapsuleShape,
        trimesh: AmmoBvhTriangleMeshShape
    });
}
