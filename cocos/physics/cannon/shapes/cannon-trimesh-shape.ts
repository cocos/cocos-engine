import CANNON from '@cocos/cannon';
import { CannonShape } from './cannon-shape';
import { MeshColliderComponent } from '../../framework';
import { Mesh, Vec3 } from '../../../core';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { commitShapeUpdates } from '../cannon-util';

const v3_cannon0 = new CANNON.Vec3();

export class CannonTrimeshShape extends CannonShape implements ITrimeshShape {

    get meshCollider () {
        return this._collider as MeshColliderComponent;
    }

    get trimesh () {
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
        this.mesh = this.meshCollider.mesh;
    }

    onLoad () {
        super.onLoad();
        this.mesh = this.meshCollider.mesh;
    }

    setScale (scale: Vec3) {
        super.setScale(scale);
        Vec3.copy(v3_cannon0, scale);
        this.trimesh.setScale(v3_cannon0);
    }

    private updateInternalMesh (vertices: Float32Array, indices: Uint16Array) {

        /**
         * @property vertices
         * @type {Array}
         */
        this.trimesh.vertices = new Float32Array(vertices);

        /**
         * Array of integers, indicating which vertices each triangle consists of. The length of this array is thus 3 times the number of triangles.
         * @property indices
         * @type {Array}
         */
        this.trimesh.indices = new Int16Array(indices);

        /**
         * The normals data.
         * @property normals
         * @type {Array}
         */
        this.trimesh.normals = new Float32Array(indices.length);

        /**
         * The local AABB of the mesh.
         * @property aabb
         * @type {Array}
         */
        this.trimesh.aabb = new CANNON.AABB();

        /**
         * References to vertex pairs, making up all unique edges in the trimesh.
         * @property {array} edges
         */
        this.trimesh.edges = [];

        /**
         * The indexed triangles. Use .updateTree() to update it.
         * @property {Octree} tree
         */
        this.trimesh.tree = new CANNON.Octree(new CANNON.AABB());

        this.trimesh.updateEdges();
        this.trimesh.updateNormals();
        this.trimesh.updateAABB();
        this.trimesh.updateBoundingSphereRadius();
        this.trimesh.updateTree();
        this.trimesh.setScale(this.trimesh.scale);
        if (this._index >= 0) {
            commitShapeUpdates(this._body);
        }
    }
}
