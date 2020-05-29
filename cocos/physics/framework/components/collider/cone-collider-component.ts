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
import { createConeShape } from '../../instance';
import { ColliderComponent } from './collider-component';
import { IConeShape } from '../../../spec/i-physics-shape';
import { EDITOR, TEST } from 'internal:constants';
import { EAxisDirection } from '../../physics-enum';

/**
 * @en
 * Cone collider component.
 * @zh
 * 圆锥体碰撞器。
 */
@ccclass('cc.ConeColliderComponent')
@help('i18n:cc.ConeColliderComponent')
@executionOrder(98)
@menu('Physics/ConeCollider(beta)')
@executeInEditMode
export class ConeColliderComponent extends ColliderComponent {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the radius of the circle on the cone body, in local space.
     * @zh
     * 获取或设置圆锥体上圆面半径。
     */
    @property({ tooltip: '圆锥体上圆面的半径' })
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
    @property({ tooltip: '圆锥体在相应轴向的高度' })
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
    @property({ type: EAxisDirection })
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

    @property
    private _radius = 0.5;

    @property
    private _height = 1;

    @property
    private _direction = EAxisDirection.Y_AXIS;

    constructor () {
        super();
        if (!EDITOR && !TEST) {
            this._shape = createConeShape();
        }
    }
}
