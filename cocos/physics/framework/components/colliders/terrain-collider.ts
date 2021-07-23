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
 * @module physics
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
import { EColliderType } from '../../physics-enum';

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
    get terrain () {
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
    get shape () {
        return this._shape as ITerrainShape;
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _terrain: ITerrainAsset | null = null;

    constructor () {
        super(EColliderType.TERRAIN);
    }
}
