import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../core/data/class-decorator';
import Vec3 from '../../../core/value-types/vec3';
import { vec3 } from '../../../core/vmath';
import { BoxShapeBase, ShapeBase, SphereShapeBase } from '../../physics/api';
import { createBoxShape, createSphereShape } from '../../physics/instance';
import { ERigidBodyType, ETransformSource } from '../../physics/physic-enum';
import { PhysicsBasedComponent } from './detail/physics-based-component';

@ccclass('cc.ColliderComponentBase')
export class ColliderComponentBase extends PhysicsBasedComponent {
    protected _shapeBase!: ShapeBase;

    @property
    private _isTrigger: boolean = false;

    @property
    get isTrigger () {
        return this._isTrigger;
    }

    set isTrigger (value) {
        this._isTrigger = value;

        if (!CC_EDITOR) {
            const type = this._isTrigger ? ERigidBodyType.DYNAMIC : ERigidBodyType.STATIC;
            this.sharedBody.body.setType(type);
            this._shapeBase.setCollisionResponse(!this._isTrigger);
        }
    }

    @property
    private _center: Vec3 = new cc.Vec3(0, 0, 0);

    /**
     * The center of the collider, in local space.
     */
    @property({ type: Vec3 })
    get center () {
        return this._center;
    }

    set center (value: Vec3) {
        vec3.copy(this._center, value);

        if (!CC_EDITOR) {
            this._shapeBase.setCenter(this._center);
        }
    }

    constructor () {
        super();
    }

    public onLoad () {
        if (!CC_EDITOR) {
            // init collider
            this.sharedBody.transfromSource = ETransformSource.SCENE;
            this.sharedBody.body.setUseGravity(false);
            this.center = this._center;
            this.isTrigger = this._isTrigger;
        }
    }

    // public lateUpdate () {
    // TODO : 根据node的scale dirty标记去缩放shape
    // if (this.node.hasChanged) {
    //     this._shapeBase.setScale(this.node._scale);
    // }
    // }

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

@ccclass('cc.BoxColliderComponent')
@executionOrder(98)
@menu('Components/BoxColliderComponent')
@executeInEditMode
export class BoxColliderComponent extends ColliderComponentBase {
    @property
    private _size: Vec3 = new Vec3(0, 0, 0);

    private _shape!: BoxShapeBase;

    constructor () {
        super();
        if (!CC_EDITOR) {
            // 父类在__preload要对_shapeBase进行操作，需要保证其已经构造完成
            this._shape = createBoxShape(this._size);
            this._shape.setUserData(this);
            this._shapeBase = this._shape;
        }
    }

    public onLoad () {
        super.onLoad();

        if (!CC_EDITOR) {
            this.size = this._size;
            this._shape.setScale(this.node._scale);
        }
    }

    /**
     * The size of the box, in local space.
     * @note Shall not specify size with component 0.
     */
    @property({ type: Vec3 })
    get size () {
        return this._size;
    }

    set size (value) {
        vec3.copy(this._size, value);

        if (!CC_EDITOR) {
            this._shape.setSize(this._size);
            this.sharedBody.body.commitShapeUpdates();
        }
    }
}

@ccclass('cc.SphereColliderComponent')
@executionOrder(98)
@menu('Components/SphereColliderComponent')
@executeInEditMode
export class SphereColliderComponent extends ColliderComponentBase {
    @property
    private _radius: number = 0;

    private _shape!: SphereShapeBase;

    constructor () {
        super();
        this._shape = createSphereShape(this._radius);
        this._shape.setUserData(this);
        this._shapeBase = this._shape;
    }

    public onLoad () {
        super.onLoad();

        if (!CC_EDITOR) {
            this.radius = this._radius;
            this._shape.setScale(this.node._scale);
        }
    }

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
            this.sharedBody.body.commitShapeUpdates();
        }
    }
}
