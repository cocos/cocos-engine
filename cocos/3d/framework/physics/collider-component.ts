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
import { PhysicsBasedComponent } from './detail/physics-based-component';

export class ColliderComponentBase extends PhysicsBasedComponent {
    protected _shapeBase: ShapeBase | null = null;

    /**
     * The center of the collider, in local space.
     */
    @property({type: Vec3})
    get center () {
        return this._center;
    }

    set center (value: Vec3) {
        vec3.copy(this._center, value);
        this._shapeBase!.setCenter(this._center);
    }

    @property
    private _center: Vec3 = new cc.Vec3(0, 0, 0);

    constructor () {
        super();
    }

    public onLoad () {
        super.onLoad();
        this.center = this._center;
    }

    public onEnable () {
        this.sharedBody!.body.addShape(this._shapeBase!);
    }

    public onDisable () {
        this.sharedBody!.body.removeShape(this._shapeBase!);
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

    private _shape: BoxShapeBase;

    constructor () {
        super();
        this._shape = createBoxShape(this._size);
        this._shapeBase = this._shape;
    }

    public onLoad () {
        super.onLoad();
        this.size = this._size;
    }

    /**
     * The size of the box, in local space.
     * @note Shall not specify size with component 0.
     */
    @property({type: Vec3})
    get size () {
        return this._size;
    }

    set size (value) {
        vec3.copy(this._size, value);
        this._shape.setSize(this._size);
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

    private _shape: SphereShapeBase;

    constructor () {
        super();
        this._shape = createSphereShape(this._radius);
        this._shapeBase = this._shape;
    }

    public onLoad () {
        super.onLoad();
        this.radius = this._radius;
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
