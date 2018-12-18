
import { PhysicalBody, PhysicalBoxShape, PhysicalShape, PhysicalSphereShape } from './body';
import Component from '../../../components/CCComponent';
import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property
} from '../../../core/data/class-decorator';
import { PhysicalMaterial } from '../../assets/physics/material';

@ccclass('cc.ColliderComponentBase')
export class ColliderComponentBase extends Component {
    protected _shape: PhysicalShape;

    private _material: PhysicalMaterial | null = null;

    private _body: PhysicalBody | null = null;

    private _center: cc.Vec3;

    constructor(shape: PhysicalShape) {
        super();

        this._center = new cc.Vec3(0, 0, 0);
        this._shape = shape;
    }

    public onInit() {
        this._body = this._getSharedBody();
        this._body.addShape(this._shape);
    }

    public onEnable() {
        cc.director._physicalSystem.world.addBody(this._body);
    }

    public onDisable() {
        cc.director._physicalSystem.world.removeBody(this._body);
    }

    @property(cc.Vec3)
    get center() {
        return this._center;
    }

    set center(value: cc.Vec3) {
        this._center.set(value.x, value.y, value.z);
        if (this._body) {
            this._body.setCenter(this._shape, this._center);
        }
    }

    @property(PhysicalMaterial)
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
            this._body = new PhysicalBody();
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
        super(new PhysicalBoxShape(new cc.Vec3(0, 0, 0)));
    }

    @property(cc.Vec3)
    get size() {
        return (this._shape as PhysicalBoxShape).size;
    }

    set size(value) {
        (this._shape as PhysicalBoxShape).size = value;
    }
}

@ccclass('cc.SphereColliderComponent')
@executionOrder(100)
@menu('Components/SphereColliderComponent')
@executeInEditMode
export class SphereColliderComponent extends ColliderComponentBase {
    constructor() {
        super(new PhysicalSphereShape(0));
    }

    @property(Number)
    get radius() {
        return (this._shape as PhysicalSphereShape).radius;
    }

    /**
     * @type {number}
     */
    set radius(value) {
        (this._shape as PhysicalSphereShape).radius = value;
    }
}
