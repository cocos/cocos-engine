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
import { Collider } from './collider';
import { IConeShape } from '../../../spec/i-physics-shape';
import { EDITOR, TEST } from 'internal:constants';
import { EAxisDirection, EColliderType } from '../../physics-enum';

/**
 * @en
 * Cone collider component.
 * @zh
 * 圆锥体碰撞器。
 */
@ccclass('cc.ConeCollider')
@help('i18n:cc.ConeCollider')
@menu('Physics/ConeCollider(beta)')
@executeInEditMode
export class ConeCollider extends Collider {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the radius of the circle on the cone body, in local space.
     * @zh
     * 获取或设置圆锥体上圆面半径。
     */
    @tooltip('圆锥体上圆面的半径')
    public get radius () {
        return this._radius;
    }

    public set radius (value) {
        if (this._radius == value) return;
        if (value < 0) value = 0;
        this._radius = value;
        if (!EDITOR && !TEST) {
            this.shape.setRadius(value);
        }
    }

    /**
     * @en
     * Gets or sets the cone body is at the corresponding axial height, in local space.
     * @zh
     * 获取或设置圆锥体在相应轴向的高度。
     */
    @tooltip('圆锥体在相应轴向的高度')
    public get height () {
        return this._height;
    }

    public set height (value) {
        if (this._height == value) return;
        if (value < 0) value = 0;
        this._height = value;
        if (!EDITOR && !TEST) {
            this.shape.setHeight(value);
        }
    }

    /**
     * @en
     * Gets or sets the cone direction, in local space.
     * @zh
     * 获取或设置在圆锥体本地空间上的方向。
     */
    @type(EAxisDirection)
    public get direction () {
        return this._direction;
    }

    public set direction (value: EAxisDirection) {
        if (this._direction == value) return;
        if (value < EAxisDirection.X_AXIS || value > EAxisDirection.Z_AXIS) return;
        this._direction = value;
        if (!EDITOR && !TEST) {
            this.shape.setDirection(value);
        }
    }

    public get shape () {
        return this._shape as IConeShape;
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _radius = 0.5;

    @serializable
    private _height = 1;

    @serializable
    private _direction = EAxisDirection.Y_AXIS;

    constructor () {
        super(EColliderType.CONE);
    }
}
