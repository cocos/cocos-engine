
import { PHYSICS_CANNON } from 'internal:constants';
import { instantiate } from '../framework/Physics-selector';
import { CannonRigidBody } from './cannon-rigid-body';
import { CannonWorld } from './cannon-world';
import { CannonBoxShape } from './shapes/cannon-box-shape';
import { CannonSphereShape } from './shapes/cannon-sphere-shape';
import { CannonTrimeshShape } from './shapes/cannon-trimesh-shape';

if (PHYSICS_CANNON) {
    instantiate({
        box: CannonBoxShape,
        sphere: CannonSphereShape,
        body: CannonRigidBody,
        world: CannonWorld,
        trimesh: CannonTrimeshShape
    });
}
