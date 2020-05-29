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
import { createPlaneShape } from '../../instance';
import { ColliderComponent } from './collider-component';
import { IPlaneShape } from '../../../spec/i-physics-shape';
import { EDITOR, TEST } from 'internal:constants';

/**
 * @en
 * Plane collider component.
 * @zh
 * 静态平面碰撞器。
 */
@ccclass('cc.PlaneColliderComponent')
@help('i18n:cc.PlaneColliderComponent')
@executionOrder(98)
@menu('Physics/PlaneCollider(beta)')
@executeInEditMode
export class PlaneColliderComponent extends ColliderComponent {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the normal of the plane, in local space.
     * @zh
     * 获取或设置平面在本地坐标系下的法线。
     */
    @property({
        type: Vec3,
        tooltip: '平面的法线'
    })
    public get normal () {
        return this._normal;
    }

    public set normal (value) {
        Vec3.copy(this._normal, value);
        if (!EDITOR && !TEST) {
            this.shape.setNormal(this._normal);
        }
    }

    /**
     * @en
     * Gets or sets the value of the plane moving along the normal, in local space.
     * @zh
     * 获取或设置平面在本地坐标系下沿着法线移动的数值。
     */
    @property
    public get constant () {
        return this._constant;
    }

    public set constant (v: number) {
        this._constant = v;
        if (!EDITOR && !TEST) {
            this.shape.setConstant(this._constant);
        }
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get shape () {
        return this._shape as IPlaneShape;
    }

    /// PRIVATE PROPERTY ///

    @property
    private _normal = new Vec3(0, 1, 0);

    @property
    private _constant = 0;

    constructor () {
        super();
        if (!EDITOR && !TEST) {
            this._shape = createPlaneShape();
        }
    }

}
