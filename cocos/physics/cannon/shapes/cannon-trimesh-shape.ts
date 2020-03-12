import CANNON from '@cocos/cannon';
import { CannonShape } from './cannon-shape';
import { MeshColliderComponent } from '../../framework';
import { Mesh, Vec3 } from '../../../core';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { commitShapeUpdates } from '../cannon-util';

const v3_cannon0 = new CANNON.Vec3();

export class CannonTrimeshShape extends CannonShape implements ITrimeshShape {

    get collider () {
        return this._collider as MeshColliderComponent;
    }

    get impl () {
        return this._shape as CANNON.Trimesh;
    }

    setMesh (v: Mesh | null) {
        if (!this._isBinding) return;

        const mesh = v;
        if (this._shape != null) {
            if (mesh && mesh.renderingSubMeshes.length > 0) {
                const vertices = mesh.renderingSubMeshes[0].geometricInfo!.positions;
                const indices = mesh.renderingSubMeshes[0].geometricInfo!.indices as Uint16Array;
                this.updateInternalMesh(vertices, indices);
            } else {
                this.updateInternalMesh(new Float32Array(), new Uint16Array());
            }
        } else {
            if (mesh && mesh.renderingSubMeshes.length > 0) {
                const vertices = mesh.renderingSubMeshes[0].geometricInfo!.positions;
                const indices = mesh.renderingSubMeshes[0].geometricInfo!.indices as Uint16Array;
                this._shape = new CANNON.Trimesh(vertices, indices);
            } else {
                this._shape = new CANNON.Trimesh(new Float32Array(), new Uint16Array());
            }
        }
    }

    onComponentSet () {
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

    private updateInternalMesh (vertices: Float32Array, indices: Uint16Array) {
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
