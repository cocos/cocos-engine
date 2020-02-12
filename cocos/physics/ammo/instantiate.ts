import { instantiate } from '../framework/Physics-selector';
import { AmmoRigidBody } from './ammo-rigid-body';
import { AmmoWorld } from '../ammo/ammo-world';
import { AmmoBoxShape } from '../ammo/shapes/ammo-box-shape';
import { AmmoSphereShape } from '../ammo/shapes/ammo-sphere-shape';
import { AmmoCapsuleShape } from '../ammo/shapes/ammo-capsule-shape';

if (CC_PHYSICS_AMMO) {
    instantiate(
        AmmoBoxShape,
        AmmoSphereShape,
        AmmoRigidBody,
        AmmoWorld,
        AmmoCapsuleShape as any
    );
}
