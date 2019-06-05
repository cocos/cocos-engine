import {
    ccclass,
    property,
} from '../../../../core/data/class-decorator';
import Vec3 from '../../../../core/value-types/vec3';
import { vec3 } from '../../../../core/vmath';
import { ShapeBase } from '../../../physics/api';
import { ERigidBodyType, ETransformSource } from '../../../physics/physic-enum';
import { PhysicsBasedComponent } from '../detail/physics-based-component';

@ccclass('cc.ColliderComponentBase')
export class ColliderComponentBase extends PhysicsBasedComponent {

    protected _shapeBase!: ShapeBase;

    /// PRIVATE PROPERTY ///

    @property
    private _isTrigger: boolean = false;

    @property
    private _center: Vec3 = new cc.Vec3(0, 0, 0);

    constructor () {
        super();
    }

    /// PUBLIC PROPERTY GETTER\SETTER ///

    @property({
        displayOrder: 0,
    })
    public get isTrigger () {
        return this._isTrigger;
    }

    public set isTrigger (value) {
        this._isTrigger = value;

        if (!CC_EDITOR) {
            if (!CC_PHYSICS_BUILT_IN) {
                const type = this._isTrigger ? ERigidBodyType.DYNAMIC : ERigidBodyType.STATIC;
                this.sharedBody.body.setType(type);
                this._shapeBase.setCollisionResponse!(!this._isTrigger);
            }
        }
    }

    /**
     * The center of the collider, in local space.
     */
    @property({
        type: Vec3,
        displayOrder: 1,
        tooltip: 'The center of the collider, in local space',
    })
    public get center () {
        return this._center;
    }

    public set center (value: Vec3) {
        vec3.copy(this._center, value);

        if (!CC_EDITOR) {
            this._shapeBase.setCenter(this._center);
        }
    }

    /// COMPONENT LIFECYCLE ///

    public onLoad () {
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            // init collider
            this.sharedBody.transfromSource = ETransformSource.SCENE;
            this.sharedBody.body.setUseGravity(false);
            this.isTrigger = this._isTrigger;
        }

        this.center = this._center;
    }

    public onEnable () {
        super.onEnable();

        if (!CC_EDITOR) {
            this.sharedBody.body.addShape(this._shapeBase!);
        }
    }

    public onDisable () {
        if (!CC_EDITOR) {
            this.sharedBody.body.removeShape(this._shapeBase!);

            if (this.sharedBody.isShapeOnly) {
                super.onDisable();
            }
        }
    }

    public onDestroy () {
        if (!CC_EDITOR) {
            this.sharedBody.body.removeShape(this._shapeBase!);
        }
        super.onDestroy();
    }
}
