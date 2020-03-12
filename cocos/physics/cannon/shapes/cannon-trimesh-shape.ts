import CANNON from '@cocos/cannon';
import { CannonShape } from './cannon-shape';
import { MeshColliderComponent } from '../../framework';
import { Mesh } from '../../../core';
import { ITrimeshShape } from '../../spec/i-physics-shape';

export class CannonTrimeshShape extends CannonShape implements ITrimeshShape {

    get meshCollider () {
        return this._collider as MeshColliderComponent;
    }

    get trimesh () {
        return this._shape as CANNON.Trimesh;
    }

    constructor () {
        super();
    }

    set mesh (v: Mesh | null) {

    }

    onComponentSet () {
        const mesh = this.meshCollider.mesh;
        if (mesh) {
            const vertices = mesh.renderingMesh.subMeshes[0].geometricInfo!.positions;
            const indices = mesh.renderingMesh.subMeshes[0].geometricInfo!.indices as Uint16Array;
            this._shape = new CANNON.Trimesh(vertices, indices);
        }
    }

    onLoad () {
        super.onLoad();
        this.mesh = this.meshCollider.mesh;
    }
}
