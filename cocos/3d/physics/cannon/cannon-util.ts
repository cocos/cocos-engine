import CANNON from 'cannon';
import { Vec3 } from '../../../core/value-types';
import { IRaycastOptions, RigidBodyBase, ShapeBase } from '../api';
import { RaycastResult } from '../raycast-result';
import { getWrap } from '../util';

interface ICANNONRaycastOptions {
    collisionFilterMask?: number;
    collisionFilterGroup?: number;
    checkCollisionResponse?: boolean;
    skipBackfaces?: boolean;
}

export function toCannonRaycastOptions (options: IRaycastOptions): ICANNONRaycastOptions {
    return toCannonOptions(options, {
        queryTriggerInteraction: 'checkCollisionResponse',
    });
}

export function toCannonVec3 (value: Vec3) {
    return new CANNON.Vec3(value.x, value.y, value.z);
}

export function toCannonOptions<T> (options: any, optionsRename?: { [x: string]: string; }) {
    const result = {};
    for (const key of Object.keys(options)) {
        let destKey = key;
        if (optionsRename) {
            const rename = optionsRename[key];
            if (rename) {
                destKey = rename;
            }
        }
        result[destKey] = options[key];
    }
    return result as T;
}

export function fillRaycastResult (result: RaycastResult, cannonResult: CANNON.RaycastResult) {
    result._assign(
        cannonResult.hitPointWorld,
        cannonResult.distance,
        getWrap<ShapeBase>(cannonResult.shape),
        getWrap<RigidBodyBase>(cannonResult.body),
    );
}

export function commitShapeUpdates (body: CANNON.Body) {
    body.updateMassProperties();
    body.updateBoundingRadius();
    body.aabbNeedsUpdate = true;
}
