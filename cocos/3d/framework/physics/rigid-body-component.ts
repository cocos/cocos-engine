
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
import { ETransformSource } from '../../physics/physic-enum';
import { DefaultPhysicsMaterial as DefaultPhysicsMaterial } from './default-material';
import { PhysicsBasedComponent } from './detail/physics-based-component';

const NonRigidBodyProperties = {
    mass: 10,
    linearDamping: 0,
    angularDamping: 0,
};

@ccclass('cc.RigidBodyComponent')
@executionOrder(99)
@menu('Components/RigidBodyComponent')
@executeInEditMode
export class RigidBodyComponent extends PhysicsBasedComponent {

    /// PRIVATE PROPERTY ///

    @property
    private _material: PhysicsMaterial | null = null;

    @property
    private _mass: number = NonRigidBodyProperties.mass;

    @property
    private _linearDamping: number = NonRigidBodyProperties.linearDamping;

    @property
    private _angularDamping: number = NonRigidBodyProperties.angularDamping;

    @property
    private _fixedRotation: boolean = false;

    @property
    private _isTrigger: boolean = false;

    @property
    private _isKinematic: boolean = false;

    @property
    private _useGravity: boolean = true;

    private _velocity: Vec3 = new Vec3();

    constructor () {
        super();
    }

    /// COMPONENT LIFECYCLE ///

    public onLoad () {
        if (!CC_PHYSICS_BUILT_IN) {
            /**
             * 此处设置刚体属性是因为__preload不受executionOrder的顺序影响，
             * 从而导致ColliderComponent后添加会导致刚体的某些属性被重写
             */
            if (this.sharedBody) {
                this.sharedBody.transfromSource = ETransformSource.PHYSIC;
                this.mass = this._mass;
                this.linearDamping = this._linearDamping;
                this.angularDamping = this._angularDamping;
                // this.material = this._material;
                this.useGravity = this._useGravity;
                this.velocity = this._velocity;
                this.isKinematic = this._isKinematic;
                this.fixedRotation = this._fixedRotation;
            }
        }
    }

    /// PUBLIC PROPERTY GETTER\SETTER ///

    // Shielding physics material for alpha version
    // @property({
    //     type: PhysicsMaterial,
    // })
    // get material () {
    //     return this._material;
    // }

    // set material (value) {
    //     this._material = value;
    //     // if (!CC_EDITOR && !CC_PHYISCS_BUILT_IN) {
    //     //     this._body.material = (this._material || DefaultPhysicsMaterial)._getImpl();
    //     // }
    // }

    @property({
        displayOrder: 0,
    })
    public get mass () {
        return this._mass;
    }

    public set mass (value) {
        this._mass = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setMass(value);
        }
    }

    @property({
        displayOrder: 1,
    })
    public get linearDamping () {
        return this._linearDamping;
    }

    public set linearDamping (value) {
        this._linearDamping = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setLinearDamping(value);
        }
    }

    @property({
        displayOrder: 2,
    })
    public get angularDamping () {
        return this._angularDamping;
    }

    public set angularDamping (value) {
        this._angularDamping = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setAngularDamping(value);
        }
    }

    @property({
        displayOrder: 3,
    })
    public get isKinematic () {
        return this._isKinematic;
    }

    public set isKinematic (value) {
        this._isKinematic = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setIsKinematic(value);
        }
    }

    @property({
        displayOrder: 4,
    })
    public get useGravity () {
        return this._useGravity;
    }

    public set useGravity (value) {
        this._useGravity = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setUseGravity(value);
        }
    }

    @property({
        displayOrder: 5,
    })
    public get fixedRotation () {
        return this._fixedRotation;
    }

    public set fixedRotation (value) {
        this._fixedRotation = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setFreezeRotation(value);
        }
    }

    /// PUBLIC GETTER\SETTER ///

    public get isTrigger () {
        return this._isTrigger;
    }

    public set isTrigger (value) {
        this._isTrigger = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setIsTrigger(value);
        }
    }

    public get velocity () {
        return this._velocity;
    }

    public set velocity (value: Vec3) {
        vec3.copy(this._velocity, value);
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setVelocity(this._velocity);
        }
    }

    /// PUBLIC METHOD ///

    public applyForce (force: Vec3, position?: Vec3) {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body!.applyForce(force, position);
        }
    }

    public applyImpulse (impulse: Vec3, position?: Vec3) {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body!.applyImpulse(impulse, position);
        }
    }

    public wakeUp () {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body!.wakeUp();
        }
    }

    public sleep () {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body!.sleep();
        }
    }

    public setCollisionFilter (group: number, mask: number) {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body!.setCollisionFilter(group, mask);
        }
    }
}
