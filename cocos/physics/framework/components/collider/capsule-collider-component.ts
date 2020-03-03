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
import { createCapsuleShape } from '../../instance';
import { ColliderComponent } from './collider-component';
import { ICapsuleShape } from '../../../spec/i-physics-shape';
import { EDITOR, TEST } from 'internal:constants';
import { EAxisDirection } from '../../physics-enum';

/**
 * @zh
 * 胶囊体碰撞器
 */
@ccclass('cc.CapsuleColliderComponent')
@help('i18n:cc.CapsuleColliderComponent')
@executionOrder(98)
@menu('Physics/CapsuleCollider')
@executeInEditMode
export class CapsuleColliderComponent extends ColliderComponent {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or set the radius of the sphere on the capsule body, in local space.
     * @zh
     * 获取或设置胶囊体上的球半径。
     */
    @property({ tooltip: '胶囊体上的球的半径' })
    public get radius () {
        return this._radius;
    }

    public set radius (value) {
        if (value < 0) value = 0;

        this._radius = value;
        if (!EDITOR && !TEST) {
            this.shape.setRadius(value);
        }
    }

    /**
     * @en
     * Gets or set the capsule body is at the corresponding axial height, in local space.
     * @zh
     * 胶囊体在相应轴向的高度，最小值为两倍的 radius。
     */
    @property({ tooltip: '胶囊体在相应轴向的高度' })
    public get height () {
        return this._height;
    }

    public set height (value) {
        if (value < this._radius * 2) { value = this._radius * 2 }

        this._height = value;
        if (!EDITOR && !TEST) {
            this.shape.setHeight(value);
        }
    }

    /**
     * @en
     * Gets or set the capsule direction, in local space.
     * @zh
     * 获取或设置在胶囊体本地空间上的方向。
     */
    @property({ type: EAxisDirection })
    public get direction () {
        return this._direction;
    }

    public set direction (value: EAxisDirection) {
        value = Math.floor(value);
        if (value < EAxisDirection.X_AXIS || value > EAxisDirection.Z_AXIS) return;
        this._direction = value;
        if (!EDITOR && !TEST) {
            this.shape.setDirection(value);
        }
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowlevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get shape () {
        return this._shape as ICapsuleShape;
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
            this._shape = createCapsuleShape();
        }
    }
}
