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

import { bt, EBulletType } from './instantiated';
import { Mesh } from '../../3d/assets';
import { cocos2BulletTriMesh } from './bullet-utils';

export class BulletTriangleMesh {
    private static readonly BulletTriangleMeshMap = new Map<number, BulletTriangleMesh>();

    static getBulletTriangleMesh (key: number, mesh: Mesh) {
        let newTriangleMesh!: BulletTriangleMesh;//Bullet.ptr;
        if (BulletTriangleMesh.BulletTriangleMeshMap.has(key)) { //can be improved
            newTriangleMesh = BulletTriangleMesh.BulletTriangleMeshMap.get(key)!;
        } else {
            newTriangleMesh = new BulletTriangleMesh(key);
            cocos2BulletTriMesh(newTriangleMesh.bulletTriangleMeshInternal, mesh);
            BulletTriangleMesh.BulletTriangleMeshMap.set(key, newTriangleMesh);
        }
        return newTriangleMesh;
    }

    private readonly key: number;
    private ref = 0;
    bulletTriangleMeshInternal : Bullet.ptr;

    set reference (v: boolean) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        v ? this.ref++ : this.ref--;
        if (this.ref === 0) { this.destroy(); }
    }

    private constructor (key: number) {
        this.key = key;
        this.bulletTriangleMeshInternal = bt.TriangleMesh_new();
    }

    private destroy () {
        if (this.bulletTriangleMeshInternal) {
            bt._safe_delete(EBulletType.EBulletTypeTriangleMesh, this.bulletTriangleMeshInternal);
        }
        BulletTriangleMesh.BulletTriangleMeshMap.delete(this.key);
    }
}
