import Ammo from './ammo-instantiated';
import { IVec3Like, IQuatLike } from '../../core/math/type-define';
import { Mesh, GFXPrimitiveMode } from '../../core';

export function cocos2AmmoVec3 (out: Ammo.btVector3, v: IVec3Like): Ammo.btVector3 {
    out.setValue(v.x, v.y, v.z);
    return out;
}

export function ammo2CocosVec3<T extends IVec3Like> (out: T, v: Ammo.btVector3): T {
    out.x = v.x();
    out.y = v.y();
    out.z = v.z();
    return out;
}

export function cocos2AmmoQuat (out: Ammo.btQuaternion, q: IQuatLike): Ammo.btQuaternion {
    out.setValue(q.x, q.y, q.z, q.w);
    return out;
}

export function ammo2CocosQuat<T extends IQuatLike> (out: T, q: Ammo.btQuaternion): T {
    out.x = q.x();
    out.y = q.y();
    out.z = q.z();
    out.w = q.w();
    return out;
}

export function ammoDeletePtr (obj: Ammo.Type, klass: Constructor<Ammo.Type>): void {
    delete (klass as any).__cache__[(obj as any).ptr];
}
// TODO : Ammo['deletePtr'] = deletePtr;

export function cocos2AmmoTriMesh (out: Ammo.btTriangleMesh, mesh: Mesh): Ammo.btTriangleMesh {
    const len = mesh.renderingSubMeshes.length;
    for (let i = 0; i < len; i++) {
        const subMesh = mesh.renderingSubMeshes[i];
        const geoInfo = subMesh.geometricInfo;
        if (geoInfo) {
            const primitiveMode = subMesh.primitiveMode;
            const vb = geoInfo.positions;
            const ib = geoInfo.indices as any;
            if (primitiveMode == GFXPrimitiveMode.TRIANGLE_LIST) {
                const cnt = ib.length;
                for (let j = 0; j < cnt; j += 3) {
                    var i0 = ib[j] * 3;
                    var i1 = ib[j + 1] * 3;
                    var i2 = ib[j + 2] * 3;
                    const v0 = new Ammo.btVector3(vb[i0], vb[i0 + 1], vb[i0 + 2]);
                    const v1 = new Ammo.btVector3(vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    const v2 = new Ammo.btVector3(vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    out.addTriangle(v0, v1, v2);
                    Ammo.destroy(v0); Ammo.destroy(v1); Ammo.destroy(v2);
                }
            } else if (primitiveMode == GFXPrimitiveMode.TRIANGLE_STRIP) {
                const cnt = ib.length - 2;
                let rev = 0;
                for (let j = 0; j < cnt; j += 1) {
                    const i0 = ib[j - rev] * 3;
                    const i1 = ib[j + rev + 1] * 3;
                    const i2 = ib[j + 2] * 3;
                    const v0 = new Ammo.btVector3(vb[i0], vb[i0 + 1], vb[i0 + 2]);
                    const v1 = new Ammo.btVector3(vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    const v2 = new Ammo.btVector3(vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    out.addTriangle(v0, v1, v2);
                    Ammo.destroy(v0); Ammo.destroy(v1); Ammo.destroy(v2);
                }

            } else if (primitiveMode == GFXPrimitiveMode.TRIANGLE_FAN) {
                const cnt = ib.length - 1;
                const i0 = ib[0] * 3;
                const v0 = new Ammo.btVector3(vb[i0], vb[i0 + 1], vb[i0 + 2]);
                for (let j = 1; j < cnt; j += 1) {
                    const i1 = ib[j] * 3;
                    const i2 = ib[j + 1] * 3;
                    const v1 = new Ammo.btVector3(vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    const v2 = new Ammo.btVector3(vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    out.addTriangle(v0, v1, v2);
                    Ammo.destroy(v0); Ammo.destroy(v1); Ammo.destroy(v2);
                }

            }
        }
    }
    return out;
}
