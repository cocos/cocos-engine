import { BYTEDANCE } from "internal:constants";

let _px = globalThis['PhysX'] as any;
if (BYTEDANCE) _px = globalThis['phy'] as any;
export const PX = _px;

if (PX) {
    PX.CACHE_MAT = {};
    PX.VECTIR_MAT = {};
    PX.IMPL_PTR = {};
}

export const _trans = {
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
};

export const _pxtrans = BYTEDANCE && PX ? new PX.Transform([0, 0, 0], [0, 0, 0, 1]) : _trans;
