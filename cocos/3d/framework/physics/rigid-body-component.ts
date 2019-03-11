
import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../core/data/class-decorator';
import { Quat, Vec3 } from '../../../core/value-types';
import { vec3 } from '../../../core/vmath';
import { PhysicsMaterial } from '../../assets/physics/material';
import { DefaultPhysicsMaterial as DefaultPhysicsMaterial } from './default-material';
import { PhysicsBasedComponent } from './detail/physics-based-component';

const NonRigidBodyProperties = {
    mass: 0,
    linearDamping: 0,
    angularDamping: 0,
};

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

    @property
    private _fixedRotation: boolean = true;

    @property
    private _triggered: boolean = true;

    @property
    private _isKinematic: boolean = false;

    @property
    private _useGravity: boolean = true;

    private _velocity: Vec3 = new Vec3();

    constructor () {
        super();
    }

    public onLoad () {
        super.onLoad();
    }

    public onEnable () {
        if (this.sharedBody) {
            this.mass = this._mass;
            this.linearDamping = this._linearDamping;
            this.angularDamping = this._angularDamping;
            this.material = this._material;
            this.useGravity = this._useGravity;
        }
        // if (this.sharedBody) {
        //     this.sharedBody.body.wakeUp();
        // }
    }

    public onDisable () {
        // if (this.sharedBody) {
        //     this.sharedBody.body.sleep();
        // }
    }

    public start () {
        super.start();
        if (this._enabled) {
            this.onEnable();
        }
    }

    @property({
        type: PhysicsMaterial,
    })
    get material () {
        return this._material;
    }

    set material (value) {
        this._material = value;
        // if (this._body) {
        //     this._body.material = (this._material || DefaultPhysicsMaterial)._getImpl();
        // }
    }

    @property
    get mass () {
        return this._mass;
    }

    set mass (value) {
        this._mass = value;
        if (this._body) {
            this._body.setMass(value);
        }
    }

    @property
    get isKinematic () {
        return this._isKinematic;
    }

    set isKinematic (value) {
        this._isKinematic = value;
        if (this._body) {
            this._body.setIsKinematic(value);
        }
    }

    @property
    get useGravity () {
        return this._useGravity;
    }

    set useGravity (value) {
        this._useGravity = value;
        if (this._body) {
            this._body.setUseGravity(value);
        }
    }

    @property
    get linearDamping () {
        return this._linearDamping;
    }

    set linearDamping (value) {
        this._linearDamping = value;
        if (this._body) {
            this._body.setLinearDamping(value);
        }
    }

    @property
    get angularDamping () {
        return this._angularDamping;
    }

    set angularDamping (value) {
        this._angularDamping = value;
        if (this._body) {
            this._body.setAngularDamping(value);
        }
    }

    get fixedRotation () {
        return this._fixedRotation;
    }

    set fixedRotation (value) {
        this._fixedRotation = value;
        if (this._body) {
            this._body.setFreezeRotation(!value);
        }
    }

    get isTrigger () {
        return this._triggered;
    }

    set isTrigger (value) {
        this._triggered = value;
        if (this._body) {
            this._body.setIsTrigger(value);
        }
    }

    get velocity () {
        if (this._body) {
            vec3.copy(this._velocity, this._body!.getVelocity());
        }
        return this._velocity;
    }

    set velocity (value: Vec3) {
        vec3.copy(this._velocity, value);
        if (this._body) {
            this._body.setVelocity(this._velocity);
        }
    }

    public applyForce (force: Vec3, position?: Vec3) {
        this._body!.applyForce(force, position);
    }

    public applyImpulse (impulse: Vec3) {
        this._body!.applyImpulse(impulse);
    }

    public setCollisionFilter (group: number, mask: number) {
        this._body!.setCollisionFilter(group, mask);
    }
}
