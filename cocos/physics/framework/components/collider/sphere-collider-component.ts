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
import { ISphereShape } from '../../../spec/i-physics-spahe';

/**
 * @zh
 * 球碰撞器
 */
@ccclass('cc.SphereColliderComponent')
@executionOrder(98)
@menu('Components/SphereCollider')
@executeInEditMode
export class SphereColliderComponent extends ColliderComponent {

    public get sphereShape (): ISphereShape {
        return this._shape as ISphereShape;
    }

    /// PRIVATE PROPERTY ///

    @property
    private _radius: number = 1;

    constructor () {
        super();
        if (!CC_EDITOR) {
            this._shape = createSphereShape(this._radius);
        }
    }

    /// COMPONENT LIFECYCLE ///

    // protected onLoad () {
    //     super.onLoad();

    //     // if (!CC_EDITOR) {
    //     //     this.radius = this._radius;
    //     //     this._shape.setScale(this.node.worldScale);
    //     // }
    // }

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Get or set the radius of the sphere.
     * @zh
     * 获取或设置球的半径。
     */
    @property({
        tooltip:'球的半径',
    })
    public get radius () {
        return this._radius;
    }

    public set radius (value) {
        this._radius = value;

        if (!CC_EDITOR) {
            this.sphereShape.radius = this._radius;
        }

        // if (!CC_EDITOR) {
        //     this._shape.setRadius(this._radius);
        //     if (CC_PHYSICS_BUILTIN) {
        //         this._shape.setScale(this.node.worldScale);
        //     }
        // }
    }
}
