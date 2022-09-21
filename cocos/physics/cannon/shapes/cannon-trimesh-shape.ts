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

import CANNON from '@cocos/cannon';
import { CannonShape } from './cannon-shape';
import { MeshCollider } from '../../framework';
import { Vec3 } from '../../../core';
import { Mesh } from '../../../3d/assets';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { commitShapeUpdates } from '../cannon-util';

const v3_cannon0 = new CANNON.Vec3();

export class CannonTrimeshShape extends CannonShape implements ITrimeshShape {
    get collider () {
        return this._collider as MeshCollider;
    }

    get impl () {
        return this._shape as CANNON.Trimesh;
    }

    setMesh (v: Mesh | null) {
        if (!this._isBinding) return;

        const mesh = v;
        if (this._shape != null) {
            if (mesh && mesh.renderingSubMeshes.length > 0) {
                const vertices = mesh.renderingSubMeshes[0].geometricInfo.positions;
                const indices = mesh.renderingSubMeshes[0].geometricInfo.indices as Uint16Array;
                this.updateProperties(vertices, indices);
            } else {
                this.updateProperties(new Float32Array(), new Uint16Array());
            }
        } else if (mesh && mesh.renderingSubMeshes.length > 0) {
            const vertices = mesh.renderingSubMeshes[0].geometricInfo.positions;
            const indices = mesh.renderingSubMeshes[0].geometricInfo.indices as Uint16Array;
            this._shape = new CANNON.Trimesh(vertices, indices);
        } else {
            this._shape = new CANNON.Trimesh(new Float32Array(), new Uint16Array());
        }
    }

    protected onComponentSet () {
        this.setMesh(this.collider.mesh);
    }

    onLoad () {
        super.onLoad();
        this.setMesh(this.collider.mesh);
    }

    setScale (scale: Vec3) {
        super.setScale(scale);
        Vec3.copy(v3_cannon0, scale);
        this.impl.setScale(v3_cannon0);
    }

    updateProperties (vertices: Float32Array, indices: Uint16Array) {
        this.impl.vertices = new Float32Array(vertices);
        this.impl.indices = new Int16Array(indices);
        this.impl.normals = new Float32Array(indices.length);
        this.impl.aabb = new CANNON.AABB();
        this.impl.edges = [];
        this.impl.tree = new CANNON.Octree(new CANNON.AABB());
        this.impl.updateEdges();
        this.impl.updateNormals();
        this.impl.updateAABB();
        this.impl.updateBoundingSphereRadius();
        this.impl.updateTree();
        this.impl.setScale(this.impl.scale);
        if (this._index >= 0) {
            commitShapeUpdates(this._body);
        }
    }
}
