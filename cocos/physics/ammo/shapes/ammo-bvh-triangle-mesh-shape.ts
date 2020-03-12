import Ammo from '@cocos/ammo';
import { AmmoShape } from "./ammo-shape";
import { Mesh, GFXPrimitiveMode, warn } from "../../../core";
import { MeshColliderComponent } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { AmmoConstant } from '../ammo-const';

export class AmmoBvhTriangleMeshShape extends AmmoShape implements ITrimeshShape {

    public get meshCollider () {
        return this.collider as MeshColliderComponent;
    }

    public get bvhTriangleMesh () {
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
        this.mesh = this.meshCollider.mesh;

        // // DEBUG
        // if (this.meshCollider.mesh == null) {
        //     this._btTriangleMesh = new Ammo.btTriangleMesh();
        //     const geometry = buildPlaneGeometry();
        //     const vb = geometry.vertices;
        //     const ib = geometry.indices;
        //     for (var i = 0, j = 0, l = vb.length; i < l; i++ , j += 3) {
        //         var i0 = ib[j] * 3;
        //         var i1 = ib[j + 1] * 3;
        //         var i2 = ib[j + 2] * 3;
        //         const v0 = new Ammo.btVector3(vb[i0], vb[i0 + 1], vb[i0 + 2]);
        //         const v1 = new Ammo.btVector3(vb[i1], vb[i1 + 1], vb[i1 + 2]);
        //         const v2 = new Ammo.btVector3(vb[i2], vb[i2 + 1], vb[i2 + 2]);
        //         this._btTriangleMesh.addTriangle(v0, v1, v2);
        //     }
        //     this._btShape = new Ammo.btBvhTriangleMeshShape(this._btTriangleMesh, true, true);
        // }
    }

    setCompound (compound: Ammo.btCompoundShape | null) {
        super.setCompound(compound);
        this.bvhTriangleMesh.setUserIndex(this._index);
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

/**
 * Debug
 */

function buildPlaneGeometry (width = 10, height = 10, widthSegments = 12, heightSegments = 12) {

    var width_half = width / 2;
    var height_half = height / 2;

    var gridX = Math.floor(widthSegments) || 1;
    var gridY = Math.floor(heightSegments) || 1;

    var gridX1 = gridX + 1;
    var gridY1 = gridY + 1;

    var segment_width = width / gridX;
    var segment_height = height / gridY;

    var ix: number, iy: number;

    // buffers

    var indices: number[] = [];
    var vertices: number[] = [];
    var normals: number[] = [];
    var uvs: number[] = [];

    // generate vertices, normals and uvs

    for (iy = 0; iy < gridY1; iy++) {

        var y = iy * segment_height - height_half;

        for (ix = 0; ix < gridX1; ix++) {

            var x = ix * segment_width - width_half;

            vertices.push(x, - y, 0);

            normals.push(0, 0, 1);

            uvs.push(ix / gridX);
            uvs.push(1 - (iy / gridY));

        }

    }

    // indices

    for (iy = 0; iy < gridY; iy++) {

        for (ix = 0; ix < gridX; ix++) {

            var a = ix + gridX1 * iy;
            var b = ix + gridX1 * (iy + 1);
            var c = (ix + 1) + gridX1 * (iy + 1);
            var d = (ix + 1) + gridX1 * iy;

            // faces

            indices.push(a, b, d);
            indices.push(b, c, d);

        }

    }

    return { indices, vertices, normals, uvs };
}
