
import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../core/data/class-decorator';
import Vec3 from '../../../core/value-types/vec3';
import { PhysicsBoxShape, PhysicsShape, PhysicsSphereShape } from './body';
import { PhysicsBasedComponent } from './detail/physics-based-component';

@ccclass('cc.ColliderComponentBase')
export class ColliderComponentBase extends PhysicsBasedComponent {
    protected _shape: PhysicsShape;

    @property
    private _center: Vec3 = new cc.Vec3(0, 0, 0);

    constructor (shape: PhysicsShape) {
        super();
        this._center = new Vec3(0, 0, 0);
        this._shape = shape;
    }

    public get body () {
        return this._body;
    }

    public onLoad () {
        super.onLoad();
        this.center = this._center;
    }

    public onEnable () {
        super.onEnable();
        this._body!.addShape(this._shape);
    }

    public onDisable () {
        super.onDisable();
        this._body!.removeShape(this._shape);
    }

    @property({
        type: Vec3,
    })
    get center () {
        return this._center;
    }

    set center (value: Vec3) {
        this._center = new Vec3(value.x, value.y, value.z);
        this._shape.center = value;
    }
}

@ccclass('cc.BoxColliderComponent')
@executionOrder(100)
@menu('Components/BoxColliderComponent')
@executeInEditMode
export class BoxColliderComponent extends ColliderComponentBase {
    @property
    private _size: Vec3 = new Vec3(0, 0, 0);

    constructor () {
        super(new PhysicsBoxShape(new Vec3(0, 0, 0)));
    }

    public onLoad () {
        super.onLoad();
        this.size = this._size;
    }

    @property({
        type: Vec3,
    })
    get size () {
        return this._size;
    }

    /**
     * Note, shall not specify size with component 0
     */
    set size (value) {
        this._size = value;
        (this._shape as PhysicsBoxShape).size = this._size;
        if (this._body) {
            this._body.commitShapesUpdate();
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

    constructor () {
        super(new PhysicsSphereShape(0));
    }

    public onLoad () {
        super.onLoad();
        this.radius = this._radius;
    }

    @property
    get radius () {
        return this._radius;
    }

    set radius (value) {
        this._radius = value;
        (this._shape as PhysicsSphereShape).radius = value;
        if (this._body) {
            this._body.commitShapesUpdate();
        }
    }
}
