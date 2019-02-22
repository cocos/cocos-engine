import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../core/data/class-decorator';
import Vec3 from '../../../core/value-types/vec3';
import { vec3 } from '../../../core/vmath';
import { PhysicsBasedComponent } from './detail/physics-based-component';

export class ColliderComponentBase extends PhysicsBasedComponent {
    /**
     * The center of the collider, in local space.
     */
    @property({type: Vec3})
    get center () {
        return this._center;
    }

    set center (value: Vec3) {
        vec3.copy(this._center, value);
        if (this.sharedBody) {
            this.sharedBody.updateCollidier(this);
        }
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
        this.sharedBody!.addCollider(this);
    }

    public onDisable () {
        // throw new Error(`Not impl!`);
        // this._body!.removeShape(this._impl);
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
        super();
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
        if (this.sharedBody) {
            this.sharedBody.updateCollidier(this);
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
        super();
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
        if (this.sharedBody) {
            this.sharedBody.updateCollidier(this);
        }
    }
}
