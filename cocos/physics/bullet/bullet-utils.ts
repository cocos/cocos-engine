/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { IVec3Like, IQuatLike } from '../../core';
import { Mesh } from '../../3d';
import { PrimitiveMode } from '../../gfx';
import { bt } from './instantiated';
import { BulletCache } from './bullet-cache';

export function cocos2BulletVec3 (out: Bullet.ptr, v: IVec3Like): Bullet.ptr {
    bt.Vec3_set(out, v.x, v.y, v.z);
    return out;
}

export function bullet2CocosVec3<T extends IVec3Like> (out: T, v: Bullet.ptr): T {
    const rawVertexBuffer = bt.HEAPF32.subarray(v / 4, v / 4 + 3);
    out.x = rawVertexBuffer[0];
    out.y = rawVertexBuffer[1];
    out.z = rawVertexBuffer[2];
    return out;
}

export function cocos2BulletQuat (out: Bullet.ptr, q: IQuatLike): Bullet.ptr {
    bt.Quat_set(out, q.x, q.y, q.z, q.w);
    return out;
}

export function bullet2CocosQuat<T extends IQuatLike> (out: T, q: Bullet.ptr): T {
    const rawVertexBuffer = bt.HEAPF32.subarray(q / 4, q / 4 + 4);
    out.x = rawVertexBuffer[0];
    out.y = rawVertexBuffer[1];
    out.z = rawVertexBuffer[2];
    out.w = rawVertexBuffer[3];
    return out;
}

export function cocos2BulletTriMesh (out: Bullet.ptr, mesh: Mesh): any {
    const len = mesh.renderingSubMeshes.length;
    for (let i = 0; i < len; i++) {
        const subMesh = mesh.renderingSubMeshes[i];
        const geoInfo = subMesh.geometricInfo;
        if (geoInfo) {
            const primitiveMode = subMesh.primitiveMode;
            const vb = geoInfo.positions;
            const ib = geoInfo.indices!;
            const v0 = BulletCache.instance.BT_V3_0;
            const v1 = BulletCache.instance.BT_V3_1;
            const v2 = BulletCache.instance.BT_V3_2;
            if (primitiveMode === PrimitiveMode.TRIANGLE_LIST) {
                const cnt = ib.length;
                for (let j = 0; j < cnt; j += 3) {
                    const i0 = ib[j] * 3;
                    const i1 = ib[j + 1] * 3;
                    const i2 = ib[j + 2] * 3;
                    bt.Vec3_set(v0, vb[i0], vb[i0 + 1], vb[i0 + 2]);
                    bt.Vec3_set(v1, vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    bt.Vec3_set(v2, vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    bt.TriangleMesh_addTriangle(out, v0, v1, v2, false);
                }
            } else if (primitiveMode === PrimitiveMode.TRIANGLE_STRIP) {
                const cnt = ib.length - 2;
                let rev = 0;
                for (let j = 0; j < cnt; j += 1) {
                    const i0 = ib[j - rev] * 3;
                    const i1 = ib[j + rev + 1] * 3;
                    const i2 = ib[j + 2] * 3;
                    rev = ~rev;
                    bt.Vec3_set(v0, vb[i0], vb[i0 + 1], vb[i0 + 2]);
                    bt.Vec3_set(v1, vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    bt.Vec3_set(v2, vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    bt.TriangleMesh_addTriangle(out, v0, v1, v2, false);
                }
            } else if (primitiveMode === PrimitiveMode.TRIANGLE_FAN) {
                const cnt = ib.length - 1;
                const i0 = ib[0] * 3;
                bt.Vec3_set(v0, vb[i0], vb[i0 + 1], vb[i0 + 2]);
                for (let j = 1; j < cnt; j += 1) {
                    const i1 = ib[j] * 3;
                    const i2 = ib[j + 1] * 3;
                    bt.Vec3_set(v1, vb[i1], vb[i1 + 1], vb[i1 + 2]);
                    bt.Vec3_set(v2, vb[i2], vb[i2 + 1], vb[i2 + 2]);
                    bt.TriangleMesh_addTriangle(out, v0, v1, v2, false);
                }
            }
        }
    }
    return out;
}

export function force2Impulse (force: number, dt: number): number {
    return force * dt;
}

export function impulse2Force (impulse: number, dt: number): number {
    return impulse / dt;
}
