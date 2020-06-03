/**
 * @category physics
 */

import {
    ccclass,
    help,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../../core/data/class-decorator';
import { Vec3 } from '../../../../core/math';
import { createBoxShape } from '../../instance';
import { ColliderComponent } from './collider-component';
import { IBoxShape } from '../../../spec/i-physics-shape';
import { EDITOR, TEST } from 'internal:constants';

/**
 * @en
 * Box collider component.
 * @zh
 * 盒子碰撞器。
 */
@ccclass('cc.BoxColliderComponent')
@help('i18n:cc.BoxColliderComponent')
@executionOrder(98)
@menu('Physics/BoxCollider')
@executeInEditMode
export class BoxColliderComponent extends ColliderComponent {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the size of the box, in local space.
     * @zh
     * 获取或设置盒的大小。
     */
    @property({
        type: Vec3,
        tooltip: '盒的大小，即长、宽、高'
    })
    public get size () {
        return this._size;
    }

    public set size (value) {
        Vec3.copy(this._size, value);
        if (!EDITOR && !TEST) {
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

    @property
    private _size: Vec3 = new Vec3(1, 1, 1);

    constructor () {
        super();
        if (!EDITOR && !TEST) {
            this._shape = createBoxShape(this._size);
        }
    }

}
