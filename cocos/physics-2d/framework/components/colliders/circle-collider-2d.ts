

import { ccclass, property, menu } from '../../../../core/data/class-decorator';
import { Component, Vec2, Size } from '../../../../core';
import { Collider2D } from './collider-2d';
import { ECollider2DType } from '../../physics-types';
import { ICircleShape } from '../../../spec/i-physics-shape';

@ccclass('cc.CircleCollider2D')
@menu('Physics2D/Colliders/CircleCollider2D')
export class CircleCollider2D extends Collider2D {
    @property
    private _radius = 1;

    /**
     * @en Circle radius
     * @zh 圆形半径
     */
    @property
    get radius () {
        return this._radius;
    }
    set radius (v) {
        this._radius = v < 0 ? 0 : v;
    }

    /**
     * @en Get world center of the circle collider.
     * @zh 世界坐标下圆形碰撞体的中心。
     */
    get worldPosition (): Readonly<Vec2> {
        if (this._shape) {
            return (this._shape as ICircleShape).worldPosition;
        }
        return new Vec2();
    }
    /**
     * @en Get world radius of the circle collider.
     * @zh 世界坐标下圆形碰撞体的半径。
     */
    get worldRadius (): number {
        if (this._shape) {
            return (this._shape as ICircleShape).worldRadius;
        }
        return 0;
    }

    readonly TYPE = ECollider2DType.CIRCLE;
}
