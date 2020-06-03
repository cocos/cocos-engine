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
import { absMax } from '../../../../core';

/**
 * @en
 * Capsule collider component.
 * @zh
 * 胶囊体碰撞器。
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
     * Gets or sets the radius of the sphere on the capsule body, in local space.
     * @zh
     * 获取或设置胶囊体在本地坐标系下的球半径。
     */
    @property({ tooltip: '本地坐标系下胶囊体上的球的半径' })
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
     * Gets or sets the cylinder on the capsule body is at the corresponding axial height, in local space.
     * @zh
     * 获取或设置在本地坐标系下的胶囊体上圆柱体的高度。
     */
    @property({ tooltip: '本地坐标系下胶囊体上的圆柱体的高度' })
    public get cylinderHeight () {
        return this._cylinderHeight;
    }

    public set cylinderHeight (value) {
        if (value < 0) value = 0;
        this._cylinderHeight = value;
        if (!EDITOR && !TEST) {
            this.shape.setCylinderHeight(value);
        }
    }

    /**
     * @en
     * Gets or sets the capsule direction, in local space.
     * @zh
     * 获取或设置在本地坐标系下胶囊体的方向。
     */
    @property({ type: EAxisDirection, tooltip: "本地坐标系下胶囊体的朝向" })
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
     * Gets or sets the capsule height, in local space, with the minimum value being the diameter of the sphere.
     * @zh
     * 获取或设置在本地坐标系下胶囊体的高度，最小值为球的直径。
     */
    public get height () {
        return this._radius * 2 + this._cylinderHeight;
    }

    public set height (value) {
        let ch = value - this._radius * 2;
        if (ch < 0) ch = 0;
        this.cylinderHeight = ch;
    }

    /**
     * @en
     * Gets the capsule body is at the corresponding axial height, in world space.
     * @zh
     * 获取胶囊体在世界坐标系下相应胶囊体朝向上的高度，只读属性。
     */
    public get worldHeight () {
        return this._radius * 2 * this._getRadiusScale() + this._cylinderHeight * this._getHeightScale();
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
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
    private _cylinderHeight = 1;

    @property
    private _direction = EAxisDirection.Y_AXIS;

    constructor () {
        super();
        if (!EDITOR && !TEST) {
            this._shape = createCapsuleShape();
        }
    }

    private _getRadiusScale () {
        if (this.node == null) return 1;
        const ws = this.node.worldScale;
        if (this._direction == EAxisDirection.Y_AXIS)
            return Math.abs(absMax(ws.x, ws.z));
        else if (this._direction == EAxisDirection.X_AXIS)
            return Math.abs(absMax(ws.y, ws.z));
        else
            return Math.abs(absMax(ws.x, ws.y));
    }

    private _getHeightScale () {
        if (this.node == null) return 1;
        const ws = this.node.worldScale;
        if (this._direction == EAxisDirection.Y_AXIS)
            return Math.abs(ws.y);
        else if (this._direction == EAxisDirection.X_AXIS)
            return Math.abs(ws.x);
        else
            return Math.abs(ws.z);
    }
}
