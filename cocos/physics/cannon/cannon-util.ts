import CANNON from 'cannon';
import { IRaycastOptions, ShapeBase } from '../api';
import { PhysicsRayResult } from '../physics-ray-result';
import { getWrap } from '../util';
import { Vec3 } from '../../core';

export function toCannonRaycastOptions (out: CANNON.IRaycastOptions, options: IRaycastOptions) {
    out.checkCollisionResponse = !options.queryTrigger;
    // out.collisionFilterGroup = options.group;
    // out.collisionFilterMask = options.mask;
    out.skipBackFaces = false;
}

export function fillRaycastResult (result: PhysicsRayResult, cannonResult: CANNON.RaycastResult) {
    result._assign(
        Vec3.copy(new Vec3(), cannonResult.hitPointWorld),
        cannonResult.distance,
        getWrap<ShapeBase>(cannonResult.shape)
    );
}

export function commitShapeUpdates (body: CANNON.Body) {
    body.updateMassProperties();
    body.updateBoundingRadius();
    body.aabbNeedsUpdate = true;
}
