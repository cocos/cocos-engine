import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../../core/data/class-decorator';
import { SphereShapeBase } from '../../../physics/api';
import { createSphereShape } from '../../../physics/instance';
import { ColliderComponent } from './collider-component';

@ccclass('cc.SphereColliderComponent')
@executionOrder(98)
@menu('Components/SphereColliderComponent')
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
            this._shape.setScale(this.node._scale);
        }
    }

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Get the radius of the sphere.
     * @zh
     * 获取球的半径。
     */
    @property
    public get radius () {
        return this._radius;
    }

    /**
     * @zh
     * 设置球的半径。
     */
    public set radius (value) {
        this._radius = value;

        if (!CC_EDITOR) {
            this._shape.setRadius(value);
        }
    }
}
