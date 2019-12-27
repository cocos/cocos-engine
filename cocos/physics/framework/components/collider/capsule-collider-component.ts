/**
 * @category physics
 */

import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../../core/data/class-decorator';
import { createCapsuleShape } from '../../instance';
import { ColliderComponent } from './collider-component';
import { ICapsuleShape } from '../../../spec/i-physics-shape';
import { Enum } from '../../../../core';

export enum ECapsuleDirection {
    X_AXIS,
    Y_AXIS,
    Z_AXIS,
}
Enum(ECapsuleDirection);

/**
 * @zh
 * 胶囊体碰撞器
 */
@ccclass('cc.CapsuleColliderComponent')
@executionOrder(98)
@menu('Components/CapsuleCollider')
@executeInEditMode
export class CapsuleColliderComponent extends ColliderComponent {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Get or set the radius of the sphere on the capsule body, in local space.
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

        /** Recalculated height */
        const doubleR = this._radius * 2
        if (this._height < doubleR) {
            this._height = doubleR;
            // if (!CC_EDITOR) {
            //     this.capsuleShape.height = this._height;
            // }
        }

        if (!CC_EDITOR) {
            this.capsuleShape.radius = this._radius;
        }
    }

    /**
     * @en
     * Get or set the capsule body is at the corresponding axial height, in local space.
     * @zh
     * 胶囊体在相应轴向的高度，最小值为两倍的 radius。
     */
    @property({ tooltip: '胶囊体在相应轴向的高度' })
    public get height () {
        return this._height;
    }

    public set height (value) {
        if (value < this._radius * 2) {
            value = this._radius * 2
        }

        this._height = value;
        if (!CC_EDITOR) {
            this.capsuleShape.height = this._height;
        }
    }

    @property({ type: ECapsuleDirection })
    public get direction () {
        return this._direction;
    }

    public set direction (value: ECapsuleDirection) {
        this._direction = value;
    }

    public get capsuleShape (): ICapsuleShape {
        return this._shape as ICapsuleShape;
    }

    /// PRIVATE PROPERTY ///

    @property
    private _radius = 0.5;

    @property
    private _height = 2;

    @property
    private _direction = ECapsuleDirection.Y_AXIS;

    constructor () {
        super();
        if (!CC_EDITOR) {
            this._shape = createCapsuleShape();
        }
    }
}
