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
        this._shape = new CANNON.Trimesh();
    }

    set mesh (v: Mesh | null) {

    }

    onLoad () {
        super.onLoad();
        this.mesh = this.meshCollider.mesh;
    }
}
