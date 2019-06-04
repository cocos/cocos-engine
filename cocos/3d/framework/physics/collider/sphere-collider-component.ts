import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../../core/data/class-decorator';
import { SphereShapeBase } from '../../../physics/api';
import { createSphereShape } from '../../../physics/instance';
import { ColliderComponentBase } from './collider-component';

@ccclass('cc.SphereColliderComponent')
@executionOrder(98)
@menu('Components/SphereColliderComponent')
@executeInEditMode
export class SphereColliderComponent extends ColliderComponentBase {

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

    public onLoad () {
        super.onLoad();

        if (!CC_EDITOR) {
            this.radius = this._radius;
            this._shape.setScale(this.node._scale);
        }
    }

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * The radius of the sphere.
     */
    @property
    get radius () {
        return this._radius;
    }

    set radius (value) {
        this._radius = value;

        if (!CC_EDITOR) {
            this._shape.setRadius(value);
            if (!CC_PHYISCS_BUILT_IN) {
                this.sharedBody.body.commitShapeUpdates();
            }
        }
    }
}
