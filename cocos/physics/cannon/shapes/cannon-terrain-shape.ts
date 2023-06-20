/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import CANNON from '@cocos/cannon';
import { CannonShape } from './cannon-shape';
import { TerrainCollider } from '../../framework';
import { Vec3, Quat, IVec3Like } from '../../../core';
import { ITerrainShape } from '../../spec/i-physics-shape';
import { ITerrainAsset } from '../../spec/i-external';
import { commitShapeUpdates } from '../cannon-util';

const CANNON_AABB_LOCAL = new CANNON.AABB();
const CANNON_AABB = new CANNON.AABB();
const CANNON_TRANSFORM = new CANNON.Transform();
// eslint-disable-next-line func-names
CANNON.Heightfield.prototype.calculateWorldAABB = function (pos: CANNON.Vec3, quat: CANNON.Quaternion, min: CANNON.Vec3, max: CANNON.Vec3): void {
    const frame = CANNON_TRANSFORM;
    const result = CANNON_AABB;
    Vec3.copy(frame.position, pos);
    Quat.copy(frame.quaternion, quat);
    const s = this.elementSize;
    const data = this.data;
    CANNON_AABB_LOCAL.lowerBound.set(0, 0, this.minValue);
    CANNON_AABB_LOCAL.upperBound.set((data.length - 1) * s, (data[0].length - 1) * s, this.maxValue);
    CANNON_AABB_LOCAL.toWorldFrame(frame, result);
    min.copy(result.lowerBound);
    max.copy(result.upperBound);
};

export class CannonTerrainShape extends CannonShape implements ITerrainShape {
    get collider (): TerrainCollider {
        return this._collider as TerrainCollider;
    }

    get impl (): CANNON.Heightfield {
        return this._shape as CANNON.Heightfield;
    }

    setTerrain (v: ITerrainAsset | null): void {
        if (v) {
            if (this._terrainID !== v._uuid) {
                const terrain = v;
                const sizeI = terrain.getVertexCountI();
                const sizeJ = terrain.getVertexCountJ();
                this._terrainID = terrain._uuid;
                this.data.length = sizeI - 1;
                for (let i = 0; i < sizeI; i++) {
                    if (this.data[i] == null) this.data[i] = [];
                    this.data[i].length = sizeJ - 1;
                    for (let j = 0; j < sizeJ; j++) {
                        this.data[i][j] = terrain.getHeight(i, sizeJ - 1 - j);
                    }
                }
                this.options.elementSize = terrain.tileSize;
                this.updateProperties(this.data, this.options.elementSize);
            }
        } else if (this._terrainID !== '') {
            this._terrainID = '';
            this.data.length = 1;
            this.data[0] = this.data[0] || [];
            this.data[0].length = 0;
            this.options.elementSize = 0;
            this.updateProperties(this.data, this.options.elementSize);
        }
    }

    readonly data: number[][];
    readonly options: CANNON.IHightfield;
    private _terrainID: string;

    constructor () {
        super();
        this.data = [[]];
        this.options = { elementSize: 0 };
        this._terrainID = '';
    }

    protected onComponentSet (): void {
        const terrain = this.collider.terrain;
        if (terrain) {
            const sizeI = terrain.getVertexCountI();
            const sizeJ = terrain.getVertexCountJ();
            for (let i = 0; i < sizeI; i++) {
                if (this.data[i] == null) this.data[i] = [];
                for (let j = 0; j < sizeJ; j++) {
                    this.data[i][j] = terrain.getHeight(i, sizeJ - 1 - j);
                }
            }
            this.options.elementSize = terrain.tileSize;
            this._terrainID = terrain._uuid;
        }

        this._shape = new CANNON.Heightfield(this.data, this.options);
    }

    onLoad (): void {
        super.onLoad();
        this.setTerrain(this.collider.terrain);
    }

    updateProperties (data: number[][], elementSize: number): void {
        const impl = this.impl;
        impl.data = data;
        impl.elementSize = elementSize;
        impl.updateMinValue();
        impl.updateMaxValue();
        impl.updateBoundingSphereRadius();
        impl.update();
        if (this._index >= 0) {
            commitShapeUpdates(this._body);
        }
    }

    // override
    protected _setCenter (v: IVec3Like): void {
        const terrain = this.collider.terrain;
        if (terrain) {
            Quat.fromEuler(this._orient, -90, 0, 0);
            const lpos = this._offset as IVec3Like;
            Vec3.set(lpos, 0, 0, (terrain.getVertexCountJ() - 1) * terrain.tileSize);
            Vec3.add(lpos, lpos, v);
            // Vec3.multiply(lpos, lpos, this._collider.node.worldScale);
        }
    }
}
