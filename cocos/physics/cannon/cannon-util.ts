import CANNON from '@cocos/cannon';
import { IRaycastOptions } from '../api';
import { PhysicsRayResult } from '../framework/physics-ray-result';
import { getWrap } from '../framework/util';
import { Vec3 } from '../../core';
import { IBaseShape } from '../spec/i-physics-spahe';

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
        getWrap<IBaseShape>(cannonResult.shape).collider
    );
}

export function commitShapeUpdates (body: CANNON.Body) {
    body.updateMassProperties();
    body.updateBoundingRadius();
    body.aabbNeedsUpdate = true;
}