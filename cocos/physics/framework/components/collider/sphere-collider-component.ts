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
import { createSphereShape } from '../../instance';
import { ColliderComponent } from './collider-component';
import { ISphereShape } from '../../../spec/i-physics-shape';
import { EDITOR, TEST } from 'internal:constants';

/**
 * @zh
 * 球碰撞器
 */
@ccclass('cc.SphereColliderComponent')
@executionOrder(98)
@menu('Physics/SphereCollider')
@executeInEditMode
export class SphereColliderComponent extends ColliderComponent {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Get or set the radius of the sphere.
     * @zh
     * 获取或设置球的半径。
     */
    @property({
        tooltip: '球的半径',
    })
    public get radius () {
        return this._radius;
    }

    public set radius (value) {
        this._radius = value;
        if (!EDITOR && !TEST) {
            this.shape.setRadius(this._radius);
        }
    }

    public get shape () {
        return this._shape as ISphereShape;
    }

    /// PRIVATE PROPERTY ///

    @property
    private _radius: number = 1;

    constructor () {
        super();
        if (!EDITOR && !TEST) {
            this._shape = createSphereShape(this._radius);
        }
    }
}
