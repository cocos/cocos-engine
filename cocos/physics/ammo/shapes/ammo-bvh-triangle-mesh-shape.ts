import Ammo from '../ammo-instantiated';
import { AmmoShape } from "./ammo-shape";
import { Mesh, GFXPrimitiveMode, warn, warnID } from "../../../core";
import { MeshColliderComponent } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { AmmoConstant } from '../ammo-const';

export class AmmoBvhTriangleMeshShape extends AmmoShape implements ITrimeshShape {

    public get collider () {
        return this._collider as MeshColliderComponent;
    }

    public get impl () {
        return this._btShape as Ammo.btBvhTriangleMeshShape;
    }

    setMesh (v: Mesh | null) {
        if (!this._isBinding) return;

        if (this._btShape != null && this._btShape != AmmoConstant.instance.EMPTY_SHAPE) {
            // TODO: change the mesh after initialization
            warnID(9620);
        } else {
            const mesh = v;
            if (mesh && mesh.renderingSubMeshes.length > 0) {
                this._btTriangleMesh = new Ammo.btTriangleMesh();
                const len = mesh.renderingSubMeshes.length;
                for (let i = 0; i < len; i++) {
                    const subMesh = mesh.renderingSubMeshes[i];
                    const geoInfo = subMesh.geometricInfo;
                    if (geoInfo) {
                        const primitiveMode = subMesh.primitiveMode;
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
                this._btShape = AmmoConstant.instance.EMPTY_SHAPE;
            }
        }
    }

    private _btTriangleMesh!: Ammo.btTriangleMesh;

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
