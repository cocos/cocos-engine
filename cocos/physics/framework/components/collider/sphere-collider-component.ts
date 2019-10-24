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

/**
 * @zh
 * 球碰撞器
 */
@ccclass('cc.SphereColliderComponent')
@executionOrder(98)
@menu('Components/SphereCollider')
@executeInEditMode
export class SphereColliderComponent extends ColliderComponent {

<<<<<<< HEAD:cocos/physics/framework/components/collider/sphere-collider-component.ts
=======
    private _shape!: SphereShapeBase;

    /// PRIVATE PROPERTY ///

    @property
    private _radius: number = 0;

    constructor () {
        super();

        if (CC_PHYSICS_AMMO) {
            this._shape = createSphereShape(this._radius);
            this._shapeBase = this._shape;
        } else {
            if (!CC_EDITOR) {
                this._shape = createSphereShape(this._radius);
                this._shape.setUserData(this);
                this._shapeBase = this._shape;
            }
        }
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (CC_PHYSICS_AMMO) {
            super.onLoad();
        } else {
            super.onLoad();
            if (!CC_EDITOR) {
                this.radius = this._radius;
                this._shape.setScale(this.node.worldScale);
            }
        }
    }

>>>>>>> tweaks:cocos/physics/components/collider/sphere-collider-component.ts
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
    }

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
}
