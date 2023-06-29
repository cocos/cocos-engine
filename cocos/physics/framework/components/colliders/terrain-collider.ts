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

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    type,
    serializable,
    tooltip,
} from 'cc.decorator';
import { Collider } from './collider';
import { ITerrainShape } from '../../../spec/i-physics-shape';
import { ITerrainAsset } from '../../../spec/i-external';
import { TerrainAsset } from '../../../../terrain/terrain-asset';
import { EColliderType, ERigidBodyType } from '../../physics-enum';
import { RigidBody } from '../rigid-body';
import { warnID } from '../../../../core';

/**
 * @en
 * Terrain collider component.
 * @zh
 * 地形碰撞器。
 */
@ccclass('cc.TerrainCollider')
@help('i18n:cc.TerrainCollider')
@menu('Physics/TerrainCollider')
@executeInEditMode
export class TerrainCollider extends Collider {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the terrain assets referenced by this collider.
     * @zh
     * 获取或设置此碰撞体引用的网格资源.
     */
    @type(TerrainAsset)
    @tooltip('i18n:physics3d.collider.terrain_terrain')
    get terrain (): ITerrainAsset | null {
        return this._terrain;
    }

    set terrain (value) {
        this._terrain = value;
        if (this._shape) this.shape.setTerrain(this._terrain);
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape (): ITerrainShape {
        return this._shape as ITerrainShape;
    }

    protected onEnable (): void {
        super.onEnable();

        if (this.node) {
            const body = this.node.getComponent(RigidBody);
            if (body && body.isValid && (body.type === ERigidBodyType.DYNAMIC)) {
                warnID(9630, this.node.name);
            }
        }
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _terrain: ITerrainAsset | null = null;

    constructor () {
        super(EColliderType.TERRAIN);
    }
}
