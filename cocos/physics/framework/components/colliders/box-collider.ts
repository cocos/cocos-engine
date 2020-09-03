/**
 * @category physics
 */

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    tooltip,
    type,
    serializable,
} from 'cc.decorator';
import { Vec3 } from '../../../../core/math';
import { Collider } from './collider';
import { IBoxShape } from '../../../spec/i-physics-shape';
import { EColliderType } from '../../physics-enum';

/**
 * @en
 * Box collider component.
 * @zh
 * 盒子碰撞器。
 */
@ccclass('cc.BoxCollider')
@help('i18n:cc.BoxCollider')
@menu('Physics/BoxCollider')
@executeInEditMode
export class BoxCollider extends Collider {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the size of the box, in local space.
     * @zh
     * 获取或设置盒的大小。
     */
    @type(Vec3)
    @tooltip('盒的大小，即长、宽、高')
    public get size () {
        return this._size;
    }

    public set size (value) {
        Vec3.copy(this._size, value);
        if (this._shape) {
            this.shape.setSize(this._size);
        }
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get shape () {
        return this._shape as IBoxShape;
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _size: Vec3 = new Vec3(1, 1, 1);

    constructor () {
        super(EColliderType.BOX);
    }
}
