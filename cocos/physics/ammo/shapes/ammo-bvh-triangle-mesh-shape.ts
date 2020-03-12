import Ammo from '@cocos/ammo';
import { AmmoShape } from "./ammo-shape";
import { Vec3, Mesh } from "../../../core";
import { MeshColliderComponent } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ITrimeshShape } from '../../spec/i-physics-shape';

export class AmmoBvhTriangleMeshShape extends AmmoShape implements ITrimeshShape {

    public get meshCollider () {
        return this.collider as MeshColliderComponent;
    }

    public get bvhTriangleMesh () {
        return this._btShape as Ammo.btBvhTriangleMeshShape;
    }

    set mesh (v: Mesh | null) {

    }

    constructor () {
        super(AmmoBroadphaseNativeTypes.TRIANGLE_MESH_SHAPE_PROXYTYPE);
        // this._btShape = new Ammo.btBvhTriangleMeshShape(,true,)
        this._btShape = new Ammo.btEmptyShape();
    }


    // onLoad () {
    //     super.onLoad();
    // }

    // onDestroy () {
    //     super.onDestroy();
    // }

    // updateScale () {
    //     super.updateScale();
    // }

}
