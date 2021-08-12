/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @hidden
 */

/* eslint-disable new-cap */
import Ammo from './instantiated';
import { IVec3Like, IQuatLike } from '../../core/math/type-define';
import { Mesh } from '../../3d';
import { PrimitiveMode } from '../../core/gfx';

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

export function ammoEqualCocosVec3 (a: Ammo.btVector3, b: IVec3Like) {
    return a.x() === b.x && a.y() === b.y && a.z() === b.z;
}

export function ammoEqualCocosQuat (a: Ammo.btQuaternion, b: IQuatLike) {
    return a.x() === b.x && a.y() === b.y && a.z() === b.z && a.w() === b.w;
}

export function ammoDeletePtr (obj: Ammo.Type, klass: Constructor<Ammo.Type>): void {
    const cache = Ammo.getCache(klass);
    const ptr = Ammo.getPointer(obj) as any;
    delete cache[ptr];
}

export function cocos2AmmoTriMesh (out: Ammo.btTriangleMesh, mesh: Mesh): Ammo.btTriangleMesh {
    const len = mesh.renderingSubMeshes.length;
    for (let i = 0; i < len; i++) {
        const subMesh = mesh.renderingSubMeshes[i];
        const geoInfo = subMesh.geometricInfo;
        if (geoInfo) {
            const primitiveMode = subMesh.primitiveMode;
            const vb = geoInfo.positions;
            const ib = geoInfo.indices as any;
            const v0 = new Ammo.btVector3();
            const v1 = new Ammo.btVector3();
            const v2 = new Ammo.btVector3();
            if (primitiveMode === PrimitiveMode.TRIANGLE_LIST) {
                const cnt = ib.length;
                for (let j = 0; j < cnt; j += 3) {
                    const i0 = ib[j] * 3;
                    const i1 = ib[j + 1] * 3;
                    const i2 = ib[j + 2] * 3;
                    v0.setValue(vb[i0], vb[i0 + 1], vb[i0 + 2]);
                    v1.setValue(vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    v2.setValue(vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    out.addTriangle(v0, v1, v2);
                }
            } else if (primitiveMode === PrimitiveMode.TRIANGLE_STRIP) {
                const cnt = ib.length - 2;
                let rev = 0;
                for (let j = 0; j < cnt; j += 1) {
                    const i0 = ib[j - rev] * 3;
                    const i1 = ib[j + rev + 1] * 3;
                    const i2 = ib[j + 2] * 3;
                    rev = ~rev;
                    v0.setValue(vb[i0], vb[i0 + 1], vb[i0 + 2]);
                    v1.setValue(vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    v2.setValue(vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    out.addTriangle(v0, v1, v2);
                }
            } else if (primitiveMode === PrimitiveMode.TRIANGLE_FAN) {
                const cnt = ib.length - 1;
                const i0 = ib[0] * 3;
                v0.setValue(vb[i0], vb[i0 + 1], vb[i0 + 2]);
                for (let j = 1; j < cnt; j += 1) {
                    const i1 = ib[j] * 3;
                    const i2 = ib[j + 1] * 3;
                    v1.setValue(vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    v2.setValue(vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    out.addTriangle(v0, v1, v2);
                }
            }
            Ammo.destroy(v0); Ammo.destroy(v1); Ammo.destroy(v2);
        }
    }
    return out;
}
