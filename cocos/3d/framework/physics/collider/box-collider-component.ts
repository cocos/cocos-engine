/**
 * @internal
 * @module physics
 */
/**
 * @able
 */

import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../../core/data/class-decorator';
import Vec3 from '../../../../core/value-types/vec3';
import { vec3 } from '../../../../core/vmath';
import { BoxShapeBase } from '../../../physics/api';
import { createBoxShape } from '../../../physics/instance';
import { ColliderComponent } from './collider-component';

/**
 * @zh
 * 盒子碰撞器
 */
@ccclass('cc.BoxColliderComponent')
@executionOrder(98)
@menu('Components/BoxColliderComponent')
@executeInEditMode
export class BoxColliderComponent extends ColliderComponent {

    private _shape!: BoxShapeBase;

    /// PRIVATE PROPERTY ///

    @property
    private _size: Vec3 = new Vec3(0, 0, 0);

    constructor () {
        super();
        if (!CC_EDITOR) {
            this._shape = createBoxShape(this._size);
            this._shape.setUserData(this);
            this._shapeBase = this._shape;
        }
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        super.onLoad();

        if (!CC_EDITOR) {
            this.size = this._size;
            this._shape.setScale(this.node.worldScale);
        }
    }

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Get the size of the box, in local space.
     * @zh
     * 获取盒的大小。
     */
    @property({ type: Vec3 })
    public get size () {
        return this._size;
    }

    /**
     * @zh
     * 设置盒的大小。
     */
    public set size (value) {
        vec3.copy(this._size, value);

        if (!CC_EDITOR) {
            this._shape.setSize(this._size);
        }
    }
}
