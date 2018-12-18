
import { PhysicalBody, PhysicalShape, PhysicalBoxShape, PhysicalSphereShape } from './body';
import {
    ccclass,
    property,
    menu,
    executionOrder,
    executeInEditMode
} from '../../../core/data/class-decorator';
import Component from '../../../components/CCComponent';
import { PhysicalMaterial } from '../../assets/physics/material';

@ccclass('cc.ColliderComponentBase')
export class ColliderComponentBase extends Component {
    private _material: PhysicalMaterial | null = null;

    private _body: PhysicalBody;

    constructor(shape: PhysicalShape) {
        super();

        this._body = new PhysicalBody(shape);
    }

    @property(cc.Vec3)
    get center() {
        return this._body.center;
    }

    set center(value) {
        this._body.center = value;
    }

    @property(PhysicalMaterial)
    get material() {
        return this._material;
    }

    set material(value) {
        this._material = value;
        this._body.material = this._material;
    }

    onEnable() {
        cc.director._physicalSystem.world.addBody(this._body);
    }

    onDisable() {
        cc.director._physicalSystem.world.removeBody(this._body);
    }

    protected _getShape<T extends PhysicalShape>() {
        return this._body.shape as T;
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
        return this._getShape<PhysicalBoxShape>().size;
    }

    set size(value) {
        this._getShape<PhysicalBoxShape>().size = value;
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
        return this._getShape<PhysicalSphereShape>().radius;
    }

    /**
     * @type {number}
     */
    set radius(value) {
        this._getShape<PhysicalSphereShape>().radius = value;
    }
}