/**
 * @category physics
 */

import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../core/data/class-decorator';
import { SphereShapeBase } from '../../api';
import { createSphereShape } from '../../instance';
import { ColliderComponent } from './collider-component';

/**
 * @zh
 * 球碰撞器
 */
@ccclass('cc.SphereColliderComponent')
@executionOrder(98)
@menu('Components/SphereCollider')
@executeInEditMode
export class SphereColliderComponent extends ColliderComponent {

    private _shape!: SphereShapeBase;

    /// PRIVATE PROPERTY ///

    @property
    private _radius: number = 0;

    constructor () {
        super();
        this._shape = createSphereShape(this._radius);
        this._shape.setUserData(this);
        this._shapeBase = this._shape;
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        super.onLoad();

        if (!CC_EDITOR) {
            this.radius = this._radius;
            this._shape.setScale(this.node.worldScale);
        }
    }

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
            this._shape.setRadius(this._radius);
            if (CC_PHYSICS_BUILTIN) {
                this._shape.setScale(this.node.worldScale);
            }
        }
    }
}
