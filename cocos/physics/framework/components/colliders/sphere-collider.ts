/**
 * @category physics
 */

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    tooltip,
    serializable,
} from 'cc.decorator';
import { Collider } from './collider';
import { ISphereShape } from '../../../spec/i-physics-shape';
import { EDITOR, TEST } from 'internal:constants';
import { EColliderType } from '../../physics-enum';

/**
 * @en
 * Sphere collider component.
 * @zh
 * 球碰撞器。
 */
@ccclass('cc.SphereCollider')
@help('i18n:cc.SphereCollider')
@menu('Physics/SphereCollider')
@executeInEditMode
export class SphereCollider extends Collider {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the radius of the sphere.
     * @zh
     * 获取或设置球的半径。
     */
    @tooltip('球的半径')
    public get radius () {
        return this._radius;
    }

    public set radius (value) {
        this._radius = value;
        if (!EDITOR && !TEST) {
            this.shape.setRadius(this._radius);
        }
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get shape () {
        return this._shape as ISphereShape;
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _radius: number = 0.5;

    constructor () {
        super(EColliderType.SPHERE);
    }
}
