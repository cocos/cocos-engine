import { instantiate } from '../impl-selector';
import { CannonRigidBody } from './cannon-body';
import { CannonWorld } from './cannon-world';
import { CannonBoxShape } from './shapes/cannon-box-shape';
import { CannonSphereShape } from './shapes/cannon-sphere-shape';

if (CC_PHYSICS_CANNON) {
    instantiate(
        CannonBoxShape,
        CannonSphereShape,
        CannonRigidBody,
        CannonWorld,
        );
}
