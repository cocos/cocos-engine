/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-undef */
import { BYTEDANCE } from 'internal:constants';

export let USE_BYTEDANCE = false;
if (BYTEDANCE) USE_BYTEDANCE = true;

let _px = globalThis.PhysX as any;
if (USE_BYTEDANCE) _px = globalThis.phy;
export const PX = _px;

if (PX) {
    PX.CACHE_MAT = {};
    PX.VECTOR_MAT = USE_BYTEDANCE ? null : new PX.PxMaterialVector();
    PX.IMPL_PTR = {};
    PX.MESH_CONVEX = {};
    PX.MESH_STATIC = {};
    PX.TERRAIN_STATIC = {};
}

export const _trans = {
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
};

export const _trans2 = {
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
};

export const _pxtrans = USE_BYTEDANCE && PX ? new PX.Transform({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0, w: 1 }) : _trans;

export const _pxtrans2 = USE_BYTEDANCE && PX ? new PX.Transform({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0, w: 1 }) : _trans2;

export function getWrapShape<T> (pxShape: any): T {
    if (USE_BYTEDANCE) {
        return PX.IMPL_PTR[pxShape.getQueryFilterData().word2];
    }
    return PX.IMPL_PTR[pxShape.$$.ptr];
}
