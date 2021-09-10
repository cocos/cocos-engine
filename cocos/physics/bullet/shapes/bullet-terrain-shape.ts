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

/* eslint-disable new-cap */
import { BulletShape } from './bullet-shape';
import { Vec3, warn } from '../../../core';
import { TerrainCollider } from '../../../../exports/physics-framework';
import { cocos2BulletVec3 } from '../bullet-utils';
import { ITerrainShape } from '../../spec/i-physics-shape';
import { ITerrainAsset } from '../../spec/i-external';
import { CC_V3_0, BulletConstant } from '../bullet-const';
import { IVec3Like } from '../../../core/math/type-define';
import { bt } from '../bullet.asmjs';

export class BulletTerrainShape extends BulletShape implements ITerrainShape {
    public get collider () {
        return this._collider as TerrainCollider;
    }

    setTerrain (v: ITerrainAsset | null): void {
        if (!this._isInitialized) return;

        if (this._impl != null && BulletConstant.isNotEmptyShape(this._impl)) {
            // TODO: change the terrain asset after initialization
            warn('[Physics][Bullet]: change the terrain asset after initialization is not support.');
        } else {
            const terrain = v;
            if (terrain) {
                this._tileSize = terrain.tileSize;
                const sizeI = terrain.getVertexCountI();
                const sizeJ = terrain.getVertexCountJ();
                this._bufPtr = bt._malloc(4 * sizeI * sizeJ);
                let offset = 0;
                let min = Number.MAX_SAFE_INTEGER;
                let max = Number.MIN_SAFE_INTEGER;
                for (let j = 0; j < sizeJ; j++) {
                    for (let i = 0; i < sizeI; i++) {
                        const v = terrain.getHeight(i, j);
                        bt._write_f32(this._bufPtr + offset, v);
                        if (min > v) min = v;
                        if (v > max) max = v;
                        offset += 4;
                    }
                }
                max += 0.01; min -= 0.01;
                this._localOffset.set((sizeI - 1) / 2 * this._tileSize, (max + min) / 2, (sizeJ - 1) / 2 * this._tileSize);
                this._impl = bt.TerrainShape_new(sizeI, sizeJ, this._bufPtr, 1, min, max);
                const bt_v3 = BulletConstant.instance.BT_V3_0;
                bt.Vec3_set(bt_v3, this._tileSize, 1, this._tileSize);
                bt.CollisionShape_setLocalScaling(this._impl, bt_v3);
                this.setCompound(this._compound);
                this.updateByReAdd();
            } else {
                this._impl = bt.EmptyShape_static();
            }
        }
    }

    private _bufPtr = 0;
    private _tileSize = 0;
    private _localOffset = new Vec3();

    onComponentSet () {
        this.setTerrain(this.collider.terrain);
    }

    onDestroy () {
        if (this._bufPtr) bt._free(this._bufPtr);
        super.onDestroy();
    }

    setCompound (compound: Bullet.ptr) {
        super.setCompound(compound);
        bt.CollisionShape_setUserIndex(this._impl, this._index);
    }

    setCenter (v: IVec3Like) {
        Vec3.copy(CC_V3_0, v);
        CC_V3_0.add(this._localOffset);
        // CC_V3_0.multiply(this._collider.node.worldScale);
        cocos2BulletVec3(bt.Transform_getOrigin(this.transform), CC_V3_0);
        this.updateCompoundTransform();
    }
}
