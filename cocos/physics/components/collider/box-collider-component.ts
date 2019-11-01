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
import { Vec3 } from '../../../core/math';
import { createBoxShape } from '../../instance';
import { ColliderComponent } from './collider-component';
import { IBoxShape } from '../../spec/i-physics-spahe';

/**
 * @zh
 * 盒子碰撞器
 */
@ccclass('cc.BoxColliderComponent')
@executionOrder(98)
@menu('Components/BoxCollider')
@executeInEditMode
export class BoxColliderComponent extends ColliderComponent {

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

    /// COMPONENT LIFECYCLE ///

    // protected onLoad () {
    //     super.onLoad();

    //     // if (!CC_EDITOR) {
    //     //     this.size = this._size;
    //     //     this._shape.setScale(this.node.worldScale);
    //     // }
    // }

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

        // if (!CC_EDITOR) {
        //     this._shape.setSize(this._size);
        //     if (CC_PHYSICS_BUILTIN) {
        //         this._shape.setScale(this.node.worldScale);
        //     }
        // }
    }
}
