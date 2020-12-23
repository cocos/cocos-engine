import { Vec3 } from "../../core";

export const PX = globalThis['PhysX'] as any;

if (PX) {
    PX.CACHE_MAT = {};
    PX.VECTIR_MAT = {};
    PX.IMPL_PTR = {};
}

export const _trans = {
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
};
