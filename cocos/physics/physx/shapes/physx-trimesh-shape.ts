/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @hidden
 */

import { IVec3Like, Quat, Vec3 } from '../../../core';

import { Mesh } from '../../../3d/assets';
import { MeshCollider, PhysicsMaterial } from '../../framework';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { createConvexMesh, createMeshGeometryFlags, createTriangleMesh, PX, _trans } from '../physx-adapter';
import { EPhysXShapeType, PhysXShape } from './physx-shape';
import { AttributeName } from '../../../core/gfx';

export class PhysXTrimeshShape extends PhysXShape implements ITrimeshShape {
    geometry: any;

    constructor () {
        super(EPhysXShapeType.MESH);
    }

    setMesh (v: Mesh | null): void {
        if (v && v.renderingSubMeshes.length > 0 && this._impl == null) {
            const wrappedWorld = this._sharedBody.wrappedWorld;
            const physics = wrappedWorld.physics;
            const collider = this.collider;
            const pxmat = this.getSharedMaterial(collider.sharedMaterial!);
            const meshScale = PhysXShape.MESH_SCALE;
            meshScale.setScale(Vec3.ONE);
            meshScale.setRotation(Quat.IDENTITY);
            if (collider.convex) {
                if (PX.MESH_CONVEX[v._uuid] == null) {
                    const cooking = wrappedWorld.cooking;
                    const posBuf = v.readAttribute(0, AttributeName.ATTR_POSITION)! as unknown as Float32Array;
                    PX.MESH_CONVEX[v._uuid] = createConvexMesh(posBuf, cooking, physics);
                }
                const convexMesh = PX.MESH_CONVEX[v._uuid];
                this.geometry = new PX.ConvexMeshGeometry(convexMesh, meshScale, createMeshGeometryFlags(0, true));
            } else {
                if (PX.MESH_STATIC[v._uuid] == null) {
                    const cooking = wrappedWorld.cooking;
                    const posBuf = v.readAttribute(0, AttributeName.ATTR_POSITION)! as unknown as Float32Array;
                    const indBuf = v.readIndices(0)! as unknown as Uint32Array; // Uint16Array ?
                    PX.MESH_STATIC[v._uuid] = createTriangleMesh(posBuf, indBuf, cooking, physics);
                }
                const trimesh = PX.MESH_STATIC[v._uuid];
                this.geometry = new PX.TriangleMeshGeometry(trimesh, meshScale, createMeshGeometryFlags(0, false));
            }
            this.updateGeometry();
            this._impl = physics.createShape(this.geometry, pxmat, true, this._flags);
            this.updateByReAdd();
        }
    }

    get collider (): MeshCollider {
        return this._collider as MeshCollider;
    }

    onComponentSet (): void {
        this.setMesh(this.collider.mesh);
    }

    updateScale (): void {
        this.updateGeometry();
        this.setCenter(this._collider.center);
    }

    updateGeometry (): void {
        const meshScale = PhysXShape.MESH_SCALE;
        meshScale.setScale(this.collider.node.worldScale);
        meshScale.setRotation(Quat.IDENTITY);
        this.geometry.setScale(meshScale);
    }

    /* override */

    setMaterial (v: PhysicsMaterial | null) {
        if (this._impl) super.setMaterial(v);
    }

    setCenter (v: IVec3Like) {
        if (this._impl) super.setCenter(v);
    }

    setAsTrigger (v: boolean) {
        if (this._impl) super.setAsTrigger(v);
    }

    setFilerData (v: any) {
        if (this._impl) super.setFilerData(v);
    }

    addToBody () {
        if (this._impl) super.addToBody();
    }

    removeFromBody () {
        if (this._impl) super.removeFromBody();
    }
}
