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
import { createCylinderShape } from '../../instance';
import { ColliderComponent } from './collider-component';
import { ICylinderShape } from '../../../spec/i-physics-shape';
import { EDITOR, TEST } from 'internal:constants';
import { EAxisDirection } from '../../physics-enum';

/**
 * @en
 * Cylinder collider component.
 * @zh
 * 圆柱体碰撞器。
 */
@ccclass('cc.CylinderColliderComponent')
@help('i18n:cc.CylinderColliderComponent')
@executionOrder(98)
@menu('Physics/CylinderCollider')
@executeInEditMode
export class CylinderColliderComponent extends ColliderComponent {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the radius of the circle on the cylinder body, in local space.
     * @zh
     * 获取或设置圆柱体上圆面半径。
     */
    @property({ tooltip: '圆柱体上圆面的半径' })
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
     * Gets or sets the cylinder body is at the corresponding axial height, in local space.
     * @zh
     * 获取或设置圆柱体在相应轴向的高度。
     */
    @property({ tooltip: '圆柱体在相应轴向的高度' })
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
     * Gets or sets the cylinder direction, in local space.
     * @zh
     * 获取或设置在圆柱体本地空间上的方向。
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
        return this._shape as ICylinderShape;
    }

    /// PRIVATE PROPERTY ///

    @property
    private _radius = 0.5;

    @property
    private _height = 2;

    @property
    private _direction = EAxisDirection.Y_AXIS;

    constructor () {
        super();
        if (!EDITOR && !TEST) {
            this._shape = createCylinderShape();
        }
    }
}
