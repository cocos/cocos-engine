import { PHYSICS_AMMO } from 'internal:constants';
import { instantiate } from '../framework/physics-selector';
import { AmmoRigidBody } from './ammo-rigid-body';
import { AmmoWorld } from '../ammo/ammo-world';
import { AmmoBoxShape } from '../ammo/shapes/ammo-box-shape';
import { AmmoSphereShape } from '../ammo/shapes/ammo-sphere-shape';
import { AmmoCapsuleShape } from '../ammo/shapes/ammo-capsule-shape';
import { AmmoBvhTriangleMeshShape } from '../ammo/shapes/ammo-bvh-triangle-mesh-shape';
import { AmmoCylinderShape } from '../ammo/shapes/ammo-cylinder-shape';
import { AmmoConeShape } from "../ammo/shapes/ammo-cone-shape";
import { AmmoTerrainShape } from "../ammo/shapes/ammo-terrain-shape";
import { AmmoSimpleShape } from "../ammo/shapes/ammo-simple-shape";
import { AmmoPlaneShape } from "../ammo/shapes/ammo-plane-shape";

if (PHYSICS_AMMO) {
    instantiate({
        box: AmmoBoxShape,
        sphere: AmmoSphereShape,
        body: AmmoRigidBody,
        world: AmmoWorld,
        capsule: AmmoCapsuleShape,
        trimesh: AmmoBvhTriangleMeshShape,
        cylinder: AmmoCylinderShape,
        cone: AmmoConeShape,
        terrain: AmmoTerrainShape,
        simple: AmmoSimpleShape,
        plane: AmmoPlaneShape,
    });
}

import './deprecated';