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
import { createBoxShape, createSphereShape, ERigidBodyType } from '../../physics/instance';
import { PhysicsBasedComponent } from './detail/physics-based-component';

export class ColliderComponentBase extends PhysicsBasedComponent {
    protected _shapeBase!: ShapeBase;

    @property
    private _triggered: boolean = false;

    @property
    get isTrigger () { return this._triggered; }

    set isTrigger (value) {
        this._triggered = value;

        const type = this._triggered ? ERigidBodyType.DYNAMIC : ERigidBodyType.STATIC;
        if (this._body) {
            this._body.setType(type);
        }
        this._shapeBase.setCollisionResponse(!this._triggered);
    }

    /**
     * The center of the collider, in local space.
     */
    @property({ type: Vec3 })
    get center () {
        return this._center;
    }

    set center (value: Vec3) {
        vec3.copy(this._center, value);
        this._shapeBase.setCenter(this._center);
    }

    @property
    private _center: Vec3 = new cc.Vec3(0, 0, 0);

    constructor () {
        super();
    }

    public __preload () {
        super.__preload();

        this.center = this._center;
        this.isTrigger = this._triggered;

        if (this._enabled) {
            this.onEnable();
        }
    }

    public onLoad () {
        super.onLoad();
    }

    public start () {
        super.start();
    }

    public lateUpdate () {
        if (this.node.hasChanged) {
            this._shapeBase.setScale(this.node._scale);
        }
    }

    public onEnable () {
        if (this.sharedBody) {
            this.sharedBody.body.addShape(this._shapeBase!);
        }
    }

    public onDisable () {
        if (this.sharedBody) {
            this.sharedBody.body.removeShape(this._shapeBase!);
        }
    }

    public destroy () {
        if (this.sharedBody) {
            this.sharedBody.body.removeShape(this._shapeBase!);
        }
        super.destroy();
    }
}

@ccclass('cc.BoxColliderComponent')
@executionOrder(100)
@menu('Components/BoxColliderComponent')
@executeInEditMode
export class BoxColliderComponent extends ColliderComponentBase {
    @property
    private _size: Vec3 = new Vec3(0, 0, 0);

    private _shape: BoxShapeBase | undefined;

    constructor () {
        super();
    }

    public __preload () {
        // 父类在__preload要对_shapeBase进行操作，需要保证其已经构造完成
        this._shape = createBoxShape(this._size);
        this._shape.setUserData(this);
        this._shapeBase = this._shape;

        super.__preload();

        this._shape.setScale(this.node._scale);
    }

    public onLoad () {
        super.onLoad();
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
        this._shape!.setSize(this._size);
        if (this.sharedBody) {
            this.sharedBody.body.commitShapeUpdates();
        }
    }
}

@ccclass('cc.SphereColliderComponent')
@executionOrder(100)
@menu('Components/SphereColliderComponent')
@executeInEditMode
export class SphereColliderComponent extends ColliderComponentBase {
    @property
    private _radius: number = 0;

    private _shape!: SphereShapeBase;

    constructor () {
        super();
    }

    public __preload () {

        // const scale = this.node._scale;
        // const max = Math.abs(Math.max(scale.x, Math.max(scale.y, scale.z)));
        this._shape = createSphereShape(this._radius);
        this._shape.setUserData(this);
        this._shapeBase = this._shape;

        super.__preload();

        this._shape.setScale(this.node._scale);
    }

    public onLoad () {
        super.onLoad();
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
        this._shape.setRadius(value);
        if (this.sharedBody) {
            this.sharedBody.body.commitShapeUpdates();
        }
    }
}
