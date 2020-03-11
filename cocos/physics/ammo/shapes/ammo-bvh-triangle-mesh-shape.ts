import Ammo from '@cocos/ammo';
import { AmmoShape } from "./ammo-shape";
import { Mesh, GFXPrimitiveMode, warn } from "../../../core";
import { MeshColliderComponent } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { AmmoConstant } from '../ammo-const';

export class AmmoBvhTriangleMeshShape extends AmmoShape implements ITrimeshShape {

    public get collider () {
        return this.collider as MeshColliderComponent;
    }

    public get shape () {
        return this._btShape as Ammo.btBvhTriangleMeshShape;
    }

    set mesh (v: Mesh | null) {
        if (!this._isBinding) return;

        if (this._btShape != null && this._btShape != AmmoConstant.instance.emptyShape) {
            // TODO: change the mesh after initialization
            warn('[Physics][Ammo]: Currently, changing the mesh is not supported if the initialization is complete');
        } else {

            const mesh = v;
            if (mesh && mesh.renderingMesh && mesh.renderingMesh.subMeshes.length > 0) {
                const geoInfo = mesh.renderingMesh.subMeshes[0].geometricInfo!;
                if (geoInfo) {
                    this._btTriangleMesh = new Ammo.btTriangleMesh();
                    const primitiveMode = mesh.renderingMesh.subMeshes[0].primitiveMode;
                    const vb = geoInfo.positions;
                    const ib = geoInfo.indices as any;
                    if (primitiveMode == GFXPrimitiveMode.TRIANGLE_LIST) {
                        const cnt = ib.length;
                        for (let j = 0; j < cnt; j += 3) {
                            var i0 = ib[j] * 3;
                            var i1 = ib[j + 1] * 3;
                            var i2 = ib[j + 2] * 3;
                            const v0 = new Ammo.btVector3(vb[i0], vb[i0 + 1], vb[i0 + 2]);
                            const v1 = new Ammo.btVector3(vb[i1], vb[i1 + 1], vb[i1 + 2]);
                            const v2 = new Ammo.btVector3(vb[i2], vb[i2 + 1], vb[i2 + 2]);
                            this._btTriangleMesh.addTriangle(v0, v1, v2);
                        }
                    } else if (primitiveMode == GFXPrimitiveMode.TRIANGLE_STRIP) {
                        const cnt = ib.length - 2;
                        let rev = 0;
                        for (let j = 0; j < cnt; j += 1) {
                            const i0 = ib[j - rev] * 3;
                            const i1 = ib[j + rev + 1] * 3;
                            const i2 = ib[j + 2] * 3;
                            const v0 = new Ammo.btVector3(vb[i0], vb[i0 + 1], vb[i0 + 2]);
                            const v1 = new Ammo.btVector3(vb[i1], vb[i1 + 1], vb[i1 + 2]);
                            const v2 = new Ammo.btVector3(vb[i2], vb[i2 + 1], vb[i2 + 2]);
                            this._btTriangleMesh.addTriangle(v0, v1, v2);
                        }

                    } else if (primitiveMode == GFXPrimitiveMode.TRIANGLE_FAN) {
                        const cnt = ib.length - 1;
                        const i0 = ib[0] * 3;
                        const v0 = new Ammo.btVector3(vb[i0], vb[i0 + 1], vb[i0 + 2]);
                        for (let j = 1; j < cnt; j += 1) {
                            const i1 = ib[j] * 3;
                            const i2 = ib[j + 1] * 3;
                            const v1 = new Ammo.btVector3(vb[i1], vb[i1 + 1], vb[i1 + 2]);
                            const v2 = new Ammo.btVector3(vb[i2], vb[i2 + 1], vb[i2 + 2]);
                            this._btTriangleMesh.addTriangle(v0, v1, v2);
                        }

                    }
                    this._btShape = new Ammo.btBvhTriangleMeshShape(this._btTriangleMesh, true, true);
                    // this._btShape = new Ammo.btGImpactMeshShape(this._btTriangleMesh);
                    // (this._btShape as Ammo.btGImpactMeshShape).updateBound();
                    cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
                    this._btShape.setLocalScaling(this.scale);

                    this.setWrapper();
                    this.setCompound(this._btCompound);
                } else {
                    // TODO: 
                }
            } else {
                this._btShape = AmmoConstant.instance.emptyShape;
            }

        }
    }

    private _btTriangleMesh!: Ammo.btTriangleMesh;

    constructor () {
        super(AmmoBroadphaseNativeTypes.TRIANGLE_MESH_SHAPE_PROXYTYPE);
    }

    onComponentSet () {
        this.mesh = this.collider.mesh;
    }

    setCompound (compound: Ammo.btCompoundShape | null) {
        super.setCompound(compound);
        this.shape.setUserIndex(this._index);
    }

    updateScale () {
        super.updateScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        // if (this._btShape != AmmoConstant.instance.emptyShape) (this._btShape as Ammo.btGImpactMeshShape).updateBound();
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
    }

}
