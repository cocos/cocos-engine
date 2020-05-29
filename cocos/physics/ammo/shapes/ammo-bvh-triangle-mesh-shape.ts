import Ammo from '@cocos/ammo';
import { AmmoShape } from "./ammo-shape";
import { Mesh, GFXPrimitiveMode, warn, warnID } from "../../../core";
import { MeshColliderComponent } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3, cocos2AmmoTriMesh } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { AmmoConstant } from '../ammo-const';

Ammo["BT_TRIANGLE_MESH"] = {};

export class AmmoBvhTriangleMeshShape extends AmmoShape implements ITrimeshShape {

    public get collider () {
        return this._collider as MeshColliderComponent;
    }

    public get impl () {
        return this._btShape as Ammo.btBvhTriangleMeshShape | Ammo.btConvexTriangleMeshShape;
    }

    setMesh (v: Mesh | null) {
        if (!this._isBinding) return;

        if (this._btShape != null && this._btShape != AmmoConstant.instance.EMPTY_SHAPE) {
            // TODO: change the mesh after initialization
            warnID(9620);
        } else {
            const mesh = v;
            if (mesh && mesh.renderingSubMeshes.length > 0) {
                if (Ammo["BT_TRIANGLE_MESH"][mesh._uuid] == null) {
                    var btm = new Ammo.btTriangleMesh();
                    Ammo["BT_TRIANGLE_MESH"][mesh._uuid] = btm;
                    cocos2AmmoTriMesh(btm, mesh);
                }
                var btTriangleMesh: Ammo.btTriangleMesh = Ammo["BT_TRIANGLE_MESH"][mesh._uuid];
                if (this.collider.convex) {
                    this._btShape = new Ammo.btConvexTriangleMeshShape(btTriangleMesh, true);
                } else {
                    this._btShape = new Ammo.btBvhTriangleMeshShape(btTriangleMesh, true, true);
                }
                cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
                this._btShape.setMargin(0.04);
                this._btShape.setLocalScaling(this.scale);
                this.setWrapper();
                this.setCompound(this._btCompound);
            } else {
                this._btShape = AmmoConstant.instance.EMPTY_SHAPE;
            }
        }
    }

    constructor () {
        super(AmmoBroadphaseNativeTypes.TRIANGLE_MESH_SHAPE_PROXYTYPE);
    }

    onComponentSet () {
        this.setMesh(this.collider.mesh);
    }

    setCompound (compound: Ammo.btCompoundShape | null) {
        super.setCompound(compound);
        this.impl.setUserIndex(this._index);
    }

    setScale () {
        super.setScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
    }

}
