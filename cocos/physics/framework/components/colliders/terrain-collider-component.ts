/**
 * @category physics
 */

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    property,
} from '../../../../core/data/class-decorator';
import { ColliderComponent } from './collider-component';
import { ITerrainShape } from '../../../spec/i-physics-shape';
import { ITerrainAsset } from '../../../spec/i-external';
import { EDITOR, TEST } from 'internal:constants';
import { TerrainAsset } from '../../../../terrain/terrain-asset';
import { EColliderType } from '../../physics-enum';

/**
 * @en
 * Terrain collider component.
 * @zh
 * 地形碰撞器。
 */
@ccclass('cc.TerrainColliderComponent')
@help('i18n:cc.TerrainColliderComponent')
@menu('Physics/TerrainCollider(beta)')
@executeInEditMode
export class TerrainColliderComponent extends ColliderComponent {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the terrain assets referenced by this collider.
     * @zh
     * 获取或设置此碰撞体引用的网格资源.
     */
    // @property({ type: js.getClassByName('cc.TerrainAsset') })    
    @property({ type: TerrainAsset })
    get terrain () {
        return this._terrain;
    }

    set terrain (value) {
        this._terrain = value;
        if (!EDITOR && !TEST) this.shape.setTerrain(this._terrain);
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

    @property
    private _terrain: ITerrainAsset | null = null;

    constructor () {
        super(EColliderType.TERRAIN);
    }
}
