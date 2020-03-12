import Ammo from '@cocos/ammo';
import { AmmoShape } from "./ammo-shape";
import { Vec3, Mesh, GFXPrimitiveMode } from "../../../core";
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
        //todo: dynamic change mesh
    }

    private _btTriangleMesh = new Ammo.btTriangleMesh();

    constructor () {
        super(AmmoBroadphaseNativeTypes.TRIANGLE_MESH_SHAPE_PROXYTYPE);
    }

    onComponentSet () {
        const mesh = this.meshCollider.mesh;
        if (mesh) {
            const primitiveMode = mesh.renderingMesh.subMeshes[0].primitiveMode;
            const geoInfo = mesh.renderingMesh.subMeshes[0].geometricInfo!;
            const vertices = geoInfo.positions;
            const indices = geoInfo.indices as any;
            const cnt = indices.length;
            if (primitiveMode == GFXPrimitiveMode.TRIANGLE_LIST) {
                for (let j = 0; j < cnt; j += 3) {
                    var i0 = indices[j] * 3;
                    var i1 = indices[j + 1] * 3;
                    var i2 = indices[j + 2] * 3;
                    const v0 = new Ammo.btVector3(vertices[i0], vertices[i0 + 1], vertices[i0 + 2]);
                    const v1 = new Ammo.btVector3(vertices[i1], vertices[i1 + 1], vertices[i1 + 2]);
                    const v2 = new Ammo.btVector3(vertices[i2], vertices[i2 + 1], vertices[i2 + 2]);
                    this._btTriangleMesh.addTriangle(v0, v1, v2);
                }
            } else if (primitiveMode == GFXPrimitiveMode.TRIANGLE_STRIP) {

            } else if (primitiveMode == GFXPrimitiveMode.TRIANGLE_FAN) {

            }
            this._btShape = new Ammo.btBvhTriangleMeshShape(this._btTriangleMesh, true, true);
        } else {
            const geometry = buildPlaneGeometry();
            const vertices = geometry.vertices;
            const indices = geometry.indices;
            for (var i = 0, j = 0, l = vertices.length; i < l; i++ , j += 3) {
                var i0 = indices[j] * 3;
                var i1 = indices[j + 1] * 3;
                var i2 = indices[j + 2] * 3;
                const v0 = new Ammo.btVector3(vertices[i0], vertices[i0 + 1], vertices[i0 + 2]);
                const v1 = new Ammo.btVector3(vertices[i1], vertices[i1 + 1], vertices[i1 + 2]);
                const v2 = new Ammo.btVector3(vertices[i2], vertices[i2 + 1], vertices[i2 + 2]);
                this._btTriangleMesh.addTriangle(v0, v1, v2);
            }
            this._btShape = new Ammo.btBvhTriangleMeshShape(this._btTriangleMesh, true, true);
        }
    }

    setCompound (compound: Ammo.btCompoundShape | null) {
        super.setCompound(compound);
        this.bvhTriangleMesh.setUserIndex(this._index);
    }

    updateScale () {
        super.updateScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
    }

}

/**
 * Debug
 * @param width 
 * @param height 
 * @param widthSegments 
 * @param heightSegments 
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
