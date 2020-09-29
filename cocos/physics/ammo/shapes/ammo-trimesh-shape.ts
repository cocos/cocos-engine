import Ammo from '../ammo-instantiated';
import { AmmoShape } from "./ammo-shape";
import { Mesh, warnID } from "../../../core";
import { MeshCollider } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3, cocos2AmmoTriMesh } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { AmmoConstant } from '../ammo-const';

export class AmmoTrimeshShape extends AmmoShape implements ITrimeshShape {

    public get collider () {
        return this._collider as MeshCollider;
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
                var btTriangleMesh: Ammo.btTriangleMesh = this._getBtTriangleMesh(mesh);
                if (this.collider.convex) {
                    this._btShape = new Ammo.btConvexTriangleMeshShape(btTriangleMesh, true);
                } else {
                    this._btShape = new Ammo.btBvhTriangleMeshShape(btTriangleMesh, true, true);
                }
                cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
                this._btShape.setMargin(0.01);
                this._btShape.setLocalScaling(this.scale);
                this.setWrapper();
                this.setCompound(this._btCompound);
            } else {
                this._btShape = AmmoConstant.instance.EMPTY_SHAPE;
            }
        }
    }

    private refBtTriangleMesh: Ammo.btTriangleMesh | null = null;

    constructor () {
        super(AmmoBroadphaseNativeTypes.TRIANGLE_MESH_SHAPE_PROXYTYPE);
    }

    onComponentSet () {
        this.setMesh(this.collider.mesh);
    }

    onDestroy () {
        if (this.refBtTriangleMesh) { Ammo.destroy(this.refBtTriangleMesh); }
        super.onDestroy();
    }

    setCompound (compound: Ammo.btCompoundShape | null) {
        super.setCompound(compound);
        this.impl.setUserIndex(this._index);
    }

    setScale () {
        super.setScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        this.updateCompoundTransform();
    }

    private _getBtTriangleMesh (mesh: Mesh): Ammo.btTriangleMesh {
        var btTriangleMesh: Ammo.btTriangleMesh;
        if (Ammo['CC_CACHE']['btTriangleMesh'].enable) {
            if (Ammo['CC_CACHE']['btTriangleMesh'][mesh._uuid] == null) {
                var btm = new Ammo.btTriangleMesh();
                Ammo['CC_CACHE']['btTriangleMesh'][mesh._uuid] = btm;
                cocos2AmmoTriMesh(btm, mesh);
            }
            btTriangleMesh = Ammo['CC_CACHE']['btTriangleMesh'][mesh._uuid];
        } else {
            this.refBtTriangleMesh = btTriangleMesh = new Ammo.btTriangleMesh();
            cocos2AmmoTriMesh(btTriangleMesh, mesh);
        }
        return btTriangleMesh;
    }

}
