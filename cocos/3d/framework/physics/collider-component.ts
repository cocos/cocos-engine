
import { RigidBody, PhysicsBoxShape, PhysicsShape as PhysicsShape, PhysicsSphereShape } from './body';
import Component from '../../../components/CCComponent';
import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property
} from '../../../core/data/class-decorator';
import { PhysicsMaterial } from '../../assets/physics/material';
import Vec3 from '../../../core/value-types/vec3';

@ccclass('cc.ColliderComponentBase')
export class ColliderComponentBase extends Component {
    protected _shape: PhysicsShape;

    private _material: PhysicsMaterial | null = null;

    private _body: RigidBody | null = null;

    private _center: Vec3;

    constructor(shape: PhysicsShape) {
        super();

        this._center = new Vec3(0, 0, 0);
        this._shape = shape;
    }

    public onInit() {
        this._body = this._getSharedBody();
        this._body.addShape(this._shape);
    }

    public onEnable() {
        cc.director._physicsSystem.world.addBody(this._body);
    }

    public onDisable() {
        cc.director._physicsSystem.world.removeBody(this._body);
    }

    @property(Vec3)
    get center() {
        return this._center;
    }

    set center(value: Vec3) {
        this._center = new Vec3(value.x, value.y, value.z);
        if (this._body) {
            this._body.setCenter(this._shape, this._center);
        }
    }

    @property(PhysicsMaterial)
    get material() {
        return this._material;
    }

    set material(value) {
        this._material = value;
        if (this._body) {
            this._body.material = this._material;
        }
    }

    private _getSharedBody() {
        let component = this.getComponent(ColliderComponentBase) as (ColliderComponentBase | null);
        if (!component) {
            component = this;
            this._body = new RigidBody();
        }
        return component._body!;
    }
}

@ccclass('cc.BoxColliderComponent')
@executionOrder(100)
@menu('Components/BoxColliderComponent')
@executeInEditMode
export class BoxColliderComponent extends ColliderComponentBase {
    constructor() {
        super(new PhysicsBoxShape(new Vec3(0, 0, 0)));
    }

    @property(Vec3)
    get size() {
        return (this._shape as PhysicsBoxShape).size;
    }

    set size(value) {
        (this._shape as PhysicsBoxShape).size = value;
    }
}

@ccclass('cc.SphereColliderComponent')
@executionOrder(100)
@menu('Components/SphereColliderComponent')
@executeInEditMode
export class SphereColliderComponent extends ColliderComponentBase {
    constructor() {
        super(new PhysicsSphereShape(0));
    }

    @property(Number)
    get radius() {
        return (this._shape as PhysicsSphereShape).radius;
    }

    /**
     * @type {number}
     */
    set radius(value) {
        (this._shape as PhysicsSphereShape).radius = value;
    }
}
