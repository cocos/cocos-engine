
import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property
} from '../../../core/data/class-decorator';
import { PhysicsMaterial } from '../../assets/physics/material';
import { PhysicsBasedComponent } from './detail/physics-based-component';

@ccclass('cc.RigidBodyComponent')
@executionOrder(100)
@menu('Components/RigidBodyComponent')
@executeInEditMode
export class RigidBodyComponent extends PhysicsBasedComponent {
    @property
    private _material: PhysicsMaterial | null = null;

    @property
    private _mass: number = NonRigidBodyProperties.mass;

    @property
    private _linearDamping: number = NonRigidBodyProperties.linearDamping;

    @property
    private _angularDamping: number = NonRigidBodyProperties.angularDamping;

    constructor() {
        super();
    }

    public get body() {
        return this._body;
    }

    public onLoad() {
        super.onLoad();
    }

    public onEnable() {
        super.onEnable();
        this.mass = this._mass;
        this.linearDamping = this._linearDamping;
        this.angularDamping = this._angularDamping;
    }

    public onDisable() {
        super.onDisable();
        this.mass = NonRigidBodyProperties.mass;
        this.linearDamping = NonRigidBodyProperties.linearDamping;
        this.angularDamping = NonRigidBodyProperties.angularDamping;
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

    @property
    get mass() {
        return this._mass;
    }

    set mass(value) {
        this._mass = value;
        if (this._body) {
            this._body.mass = value;
        }
    }

    @property
    get linearDamping() {
        return this._linearDamping;
    }

    set linearDamping(value) {
        this._linearDamping = value;
        if (this._body) {
            this._body.linearDamping = value;
        }
    }

    @property
    get angularDamping() {
        return this._angularDamping;
    }

    set angularDamping(value) {
        this._angularDamping = value;
        if (this._body) {
            this._body.angularDamping = value;
        }
    }
}

const NonRigidBodyProperties = {
    mass: 0,
    linearDamping: 0,
    angularDamping: 0,
};
