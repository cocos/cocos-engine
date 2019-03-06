
import CANNON from 'cannon';
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
import { PhysicsBasedComponent, TransformSource } from './detail/physics-based-component';
import { toCannonVec3 } from './util';

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
        this.mass = this._mass;
        this.linearDamping = this._linearDamping;
        this.angularDamping = this._angularDamping;
        this.material = this._material;
        this.useGravity = this._useGravity;
    }

    public onDisable () {
        this.mass = NonRigidBodyProperties.mass;
        this.linearDamping = NonRigidBodyProperties.linearDamping;
        this.angularDamping = NonRigidBodyProperties.angularDamping;
        this.material = DefaultPhysicsMaterial;
        this.useGravity = true;
    }

    @property({
        type: PhysicsMaterial,
    })
    get material () {
        return this._material;
    }

    set material (value) {
        this._material = value;
        if (this._body) {
            this._body.material = (this._material || DefaultPhysicsMaterial)._getImpl();
        }
    }

    @property
    get mass () {
        return this._mass;
    }

    set mass (value) {
        this._mass = value;
        if (this._body) {
            this._body.mass = value;
            this._body.updateMassProperties();
            if (this._body.type !== CANNON.Body.KINEMATIC) {
                this._resetBodyTypeAccordingMess();
                this._onBodyTypeUpdated();
            }
        }
    }

    @property
    get isKinematic () {
        return this._isKinematic;
    }

    set isKinematic (value) {
        this._isKinematic = value;
        if (this._body) {
            if (value) {
                this._body.type = CANNON.Body.KINEMATIC;
            } else {
                this._resetBodyTypeAccordingMess();
            }
            this._onBodyTypeUpdated();
        }
    }

    @property
    get useGravity () {
        return this._useGravity;
    }

    set useGravity (value) {
        this._useGravity = value;
        if (this.sharedBody) {
            this.sharedBody.setUseGravity(value);
        }
    }

    @property
    get linearDamping () {
        return this._linearDamping;
    }

    set linearDamping (value) {
        this._linearDamping = value;
        if (this._body) {
            this._body.linearDamping = value;
        }
    }

    @property
    get angularDamping () {
        return this._angularDamping;
    }

    set angularDamping (value) {
        this._angularDamping = value;
        if (this._body) {
            this._body.angularDamping = value;
        }
    }

    get fixedRotation () {
        return this._fixedRotation;
    }

    set fixedRotation (value) {
        this._fixedRotation = value;
        if (this._body) {
            this._body.fixedRotation = value;
            this._body.updateMassProperties();
        }
    }

    get isTrigger () {
        return this._triggered;
    }

    set isTrigger (value) {
        this._triggered = value;
        if (this._body) {
            this._body.collisionResponse = value;
        }
    }

    get velocity () {
        if (this._body) {
            vec3.copy(this._velocity, this._body!.velocity);
        }
        return this._velocity;
    }

    set velocity (value: Vec3) {
        vec3.copy(this._velocity, value);
        if (this._body) {
            vec3.copy(this._body.velocity, this._velocity);
        }
    }

    public applyForce (force: Vec3, position?: Vec3) {
        if (!position) {
            position = new Vec3();
            vec3.copy(position, this._body!.position);
        }
        this._body!.applyForce(toCannonVec3(force), toCannonVec3(position));
    }

    public applyImpulse (impulse: Vec3) {
        this._body!.applyImpulse(toCannonVec3(impulse), toCannonVec3(new Vec3()));
    }

    /**
     * Set the collision filter of this body, remember that they are tested bitwise.
     * @param {number} group The group which this body will be put into.
     * @param {number} mask The groups which this body can collide with.
     */
    public setCollisionFilter (group: number, mask: number) {
        if (this._body) {
            this._body.collisionFilterGroup = group;
            this._body.collisionFilterMask = mask;
        }
    }

    // /**
    //  * Is this body currently in contact with the specified body?
    //  * @param {CannonBody} body The body to test against.
    //  */
    // public isInContactWith (body: PhysicsBody) {
    //     if (!this._cannonBody.world) {
    //         return false;
    //     }

    //     return this._cannonBody.world.collisionMatrix.get(
    //         this._cannonBody.id, body._cannonBody.id) > 0;
    // }

    private _resetBodyTypeAccordingMess () {
        if (this._body) {
            if (this.mass <= 0) {
                this._body.type = CANNON.Body.STATIC;
            } else {
                this._body.type = CANNON.Body.DYNAMIC;
            }
        }
    }

    private _onBodyTypeUpdated () {
        if (this.sharedBody) {
            if (this.sharedBody.body.type === CANNON.Body.STATIC) {
                this.sharedBody.transformSource = TransformSource.Scene;
            } else {
                this.sharedBody.transformSource = TransformSource.Phycis;
            }
        }
    }
}
