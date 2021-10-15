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

import { IVec3Like } from '../../../core';
import { PhysicsMaterial, TerrainCollider } from '../../framework';
import { ITerrainAsset } from '../../spec/i-external';
import { ITerrainShape } from '../../spec/i-physics-shape';
import { createHeightField, createHeightFieldGeometry, getTempTransform, PX } from '../physx-adapter';
import { PhysXInstance } from '../physx-instance';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

export class PhysXTerrainShape extends PhysXShape implements ITerrainShape {
    static heightScale = 1 / 5000;

    constructor () {
        super(EPhysXShapeType.TERRAIN);
    }

    setTerrain (v: ITerrainAsset | null): void {
        if (v && this._impl == null) {
            const physics = PhysXInstance.physics;
            const collider = this.collider;
            if (PX.TERRAIN_STATIC[v._uuid] == null) {
                const cooking = PhysXInstance.cooking;
                PX.TERRAIN_STATIC[v._uuid] = createHeightField(v, PhysXTerrainShape.heightScale, cooking, physics);
            }
            const hf = PX.TERRAIN_STATIC[v._uuid];
            const pxmat = this.getSharedMaterial(collider.sharedMaterial!);
            const geometry = createHeightFieldGeometry(hf, 0, PhysXTerrainShape.heightScale, v.tileSize, v.tileSize);
            this._impl = physics.createShape(geometry, pxmat, true, this._flags);
            this.updateByReAdd();
        }
    }

    get collider () {
        return this._collider as TerrainCollider;
    }

    onComponentSet () {
        this.setTerrain(this.collider.terrain);
    }

    updateScale () {
        this.setCenter(this._collider.center);
    }

    /* override */

    setCenter (v: IVec3Like): void {
        if (this._impl) this._impl.setLocalPose(getTempTransform(v, this._rotation));
    }

    setMaterial (v: PhysicsMaterial | null) {
        if (this._impl) super.setMaterial(v);
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
