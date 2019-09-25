import { instantiate } from '../impl-selector';
import { AmmoRigidBody } from '../ammo/ammo-body';
import { AmmoWorld } from '../ammo/ammo-world';
import { AmmoBoxShape } from '../ammo/shapes/ammo-box-shape';
import { AmmoSphereShape } from '../ammo/shapes/ammo-sphere-shape';

if (CC_PHYSICS_AMMO) {
    instantiate(
        AmmoBoxShape,
        AmmoSphereShape,
        AmmoRigidBody,
        AmmoWorld,
    );
}
