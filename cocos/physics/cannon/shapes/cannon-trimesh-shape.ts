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

    get shape () {
        return this._shape as CANNON.Trimesh;
    }

    set mesh (v: Mesh | null) {
        if (!this._isBinding) return;

        const mesh = v;
        if (this._shape != null) {
            if (mesh) {
                const vertices = mesh.renderingMesh.subMeshes[0].geometricInfo!.positions;
                const indices = mesh.renderingMesh.subMeshes[0].geometricInfo!.indices as Uint16Array;
                this.updateInternalMesh(vertices, indices);
            } else {
                this.updateInternalMesh(new Float32Array(), new Uint16Array());
            }
        } else {
            if (mesh) {
                const vertices = mesh.renderingMesh.subMeshes[0].geometricInfo!.positions;
                const indices = mesh.renderingMesh.subMeshes[0].geometricInfo!.indices as Uint16Array;
                this._shape = new CANNON.Trimesh(vertices, indices);
            } else {
                this._shape = new CANNON.Trimesh(new Float32Array(), new Uint16Array());
            }
        }
    }

    onComponentSet () {
        this.mesh = this.collider.mesh;
    }

    onLoad () {
        super.onLoad();
        this.mesh = this.collider.mesh;
    }

    setScale (scale: Vec3) {
        super.setScale(scale);
        Vec3.copy(v3_cannon0, scale);
        this.shape.setScale(v3_cannon0);
    }

    private updateInternalMesh (vertices: Float32Array, indices: Uint16Array) {
        this.shape.vertices = new Float32Array(vertices);
        this.shape.indices = new Int16Array(indices);
        this.shape.normals = new Float32Array(indices.length);
        this.shape.aabb = new CANNON.AABB();
        this.shape.edges = [];
        this.shape.tree = new CANNON.Octree(new CANNON.AABB());
        this.shape.updateEdges();
        this.shape.updateNormals();
        this.shape.updateAABB();
        this.shape.updateBoundingSphereRadius();
        this.shape.updateTree();
        this.shape.setScale(this.shape.scale);
        if (this._index >= 0) {
            commitShapeUpdates(this._body);
        }
    }
}
