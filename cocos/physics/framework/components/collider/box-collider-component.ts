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
import { Vec3 } from '../../../../core/math';
import { createBoxShape } from '../../instance';
import { ColliderComponent } from './collider-component';
import { IBoxShape } from '../../../spec/i-physics-shape';

/**
 * @zh
 * 盒子碰撞器
 */
@ccclass('cc.BoxColliderComponent')
@executionOrder(98)
@menu('Components/BoxCollider')
@executeInEditMode
export class BoxColliderComponent extends ColliderComponent {

<<<<<<< HEAD:cocos/physics/framework/components/collider/box-collider-component.ts
=======
    private _shape!: BoxShapeBase;

    /// PRIVATE PROPERTY ///

    @property
    private _size: Vec3 = new Vec3(0, 0, 0);

    constructor () {
        super();

        if (CC_PHYSICS_AMMO) {
            this._shape = createBoxShape(this._size);
            this._shapeBase = this._shape;
        } else {
            if (!CC_EDITOR) {
                this._shape = createBoxShape(this._size);
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
                this.size = this._size;
                this._shape.setScale(this.node.worldScale);
            }
        }
    }

>>>>>>> tweaks:cocos/physics/components/collider/box-collider-component.ts
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Get or set the size of the box, in local space.
     * @zh
     * 获取或设置盒的大小。
     */
    @property({
        type: Vec3,
        tooltip:'盒的大小，即长、宽、高'
    })
    public get size () {
        return this._size;
    }

    public set size (value) {
        Vec3.copy(this._size, value);
        if (!CC_EDITOR) {
            this.boxShape.size = this._size;
        }
    }

    public get boxShape (): IBoxShape {
        return this._shape as IBoxShape;
    }

    /// PRIVATE PROPERTY ///

    @property
    private _size: Vec3 = new Vec3(1, 1, 1);

    constructor () {
        super();
        if (!CC_EDITOR) {
            this._shape = createBoxShape(this._size);
        }
    }

}
