import { instantiate } from '../framework/Physics-selector';
import { CannonRigidBody } from './cannon-rigid-body';
import { CannonWorld } from './cannon-world';
import { CannonBoxShape } from './shapes/cannon-box-shape';
import { CannonSphereShape } from './shapes/cannon-sphere-shape';
import { PHYSICS_CANNON } from 'internal:constants';

if (PHYSICS_CANNON) {
    instantiate(
        CannonBoxShape,
        CannonSphereShape,
        CannonRigidBody,
        CannonWorld,
        );
}
