import Ammo from './ammo-instantiated';
import { Vec3, Node } from "../../core";
import { AmmoWorld } from "./ammo-world";
import { cocos2AmmoVec3, ammo2CocosVec3 } from "./ammo-util";
import { RigidBodyComponent, PhysicsSystem } from '../../../exports/physics-framework';
import { AmmoCollisionFlags, AmmoRigidBodyFlags, AmmoCollisionObjectStates } from './ammo-enum';
import { IRigidBody } from '../spec/i-rigid-body';
import { ERigidBodyType } from '../framework/physics-enum';
import { AmmoSharedBody } from './ammo-shared-body';
import { IVec3Like } from '../../core/math/type-define';

const v3_0 = new Vec3();
const v3_1 = new Vec3();

export class AmmoRigidBody implements IRigidBody {

    get isAwake (): boolean {
        const state = this.impl.getActivationState();
        return state == AmmoCollisionObjectStates.ACTIVE_TAG ||
            state == AmmoCollisionObjectStates.DISABLE_DEACTIVATION;
    }

    get isSleepy (): boolean {
        const state = this.impl.getActivationState();
        return state == AmmoCollisionObjectStates.WANTS_DEACTIVATION;
    }

    get isSleeping (): boolean {
        const state = this.impl.getActivationState();
        return state == AmmoCollisionObjectStates.ISLAND_SLEEPING;
    }

    setMass (value: number) {
        // See https://studiofreya.com/game-maker/bullet-physics/bullet-physics-how-to-change-body-mass/
        const localInertia = this._sharedBody.bodyStruct.localInertia;
        localInertia.setValue(1.6666666269302368, 1.6666666269302368, 1.6666666269302368);
        if (this._btCompoundShape.getNumChildShapes() > 0) {
            this._btCompoundShape.calculateLocalInertia(this._rigidBody.mass, localInertia);
        }
        this.impl.setMassProps(value, localInertia);
        this._sharedBody.updateByReAdd();
    }

    setLinearDamping (value: number) {
        this.impl.setDamping(this._rigidBody.linearDamping, this._rigidBody.angularDamping);
    }

    setAngularDamping (value: number) {
        this.impl.setDamping(this._rigidBody.linearDamping, this._rigidBody.angularDamping);
    }

    setIsKinematic (value: boolean) {
        let m_collisionFlags = this.impl.getCollisionFlags();
        if (value) {
            m_collisionFlags |= AmmoCollisionFlags.CF_KINEMATIC_OBJECT;
        } else {
            m_collisionFlags &= (~AmmoCollisionFlags.CF_KINEMATIC_OBJECT);
        }
        this.impl.setCollisionFlags(m_collisionFlags);
    }

    useGravity (value: boolean) {
        let m_rigidBodyFlag = this.impl.getFlags()
        if (value) {
            m_rigidBodyFlag &= (~AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY);
        } else {
            this.impl.setGravity(cocos2AmmoVec3(this._btVec3_0, Vec3.ZERO));
            m_rigidBodyFlag |= AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY;
        }
        this.impl.setFlags(m_rigidBodyFlag);
        this._sharedBody.updateByReAdd();
    }

    fixRotation (value: boolean) {
        if (value) {
            /** TODO : should i reset angular velocity & torque ? */
            this.impl.setAngularFactor(cocos2AmmoVec3(this._btVec3_0, Vec3.ZERO));
        } else {
            this.impl.setAngularFactor(cocos2AmmoVec3(this._btVec3_0, this._rigidBody.angularFactor));
        }
        if (!this.isAwake) this.impl.activate();
    }

    setLinearFactor (value: IVec3Like) {
        this.impl.setLinearFactor(cocos2AmmoVec3(this._btVec3_0, value));
        if (!this.isAwake) this.impl.activate();
    }

    setAngularFactor (value: IVec3Like) {
        if (!this._rigidBody.fixedRotation) {
            this.impl.setAngularFactor(cocos2AmmoVec3(this._btVec3_0, value));
        }
        if (!this.isAwake) this.impl.activate();
    }

    setAllowSleep (v: boolean) {
        if (v) {
            this.impl.forceActivationState(AmmoCollisionObjectStates.ACTIVE_TAG);
        } else {
            this.impl.forceActivationState(AmmoCollisionObjectStates.DISABLE_DEACTIVATION);
        }
        if (!this.isAwake) this.impl.activate();
    }

    get isEnabled () { return this._isEnabled; }
    get impl () { return this._sharedBody.body; }
    get rigidBody () { return this._rigidBody; }

    private static idCounter = 0;
    readonly id: number;

    private _isEnabled = false;
    private _sharedBody!: AmmoSharedBody;
    private _rigidBody!: RigidBodyComponent;
    private get _btCompoundShape () { return this._sharedBody.bodyCompoundShape };

    private _btVec3_0 = new Ammo.btVector3();
    private _btVec3_1 = new Ammo.btVector3();

    constructor () {
        this.id = AmmoRigidBody.idCounter++;
    }

    /** LIFECYCLE */

    initialize (com: RigidBodyComponent) {
        this._rigidBody = com;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as AmmoWorld).getSharedBody(this._rigidBody.node as Node, this);
        this._sharedBody.reference = true;
    }

    onEnable () {
        this._isEnabled = true;
        this.setMass(this._rigidBody.mass);
        this.setAllowSleep(this._rigidBody.allowSleep);
        this.setLinearDamping(this._rigidBody.linearDamping);
        this.setAngularDamping(this._rigidBody.angularDamping);
        this.setIsKinematic(this._rigidBody.isKinematic);
        this.fixRotation(this._rigidBody.fixedRotation);
        this.setLinearFactor(this._rigidBody.linearFactor);
        this.setAngularFactor(this._rigidBody.angularFactor);
        this.useGravity(this._rigidBody.useGravity);
        this._sharedBody.bodyEnabled = true;
    }

    onDisable () {
        this._isEnabled = false;
        this._sharedBody.bodyEnabled = false;
    }

    onDestroy () {
        this._sharedBody.reference = false;
        (this._rigidBody as any) = null;
        (this._sharedBody as any) = null;
    }

    /** INTERFACE */

    wakeUp (force?: boolean): void {
        this.impl.activate(force);
    }

    sleep (): void {
        return this.impl.wantsSleeping() as any;
    }

    /** type */

    getType (): ERigidBodyType {
        if (this.impl.isStaticOrKinematicObject()) {
            if (this.impl.isKinematicObject()) {
                return ERigidBodyType.KINEMATIC
            } else {
                return ERigidBodyType.STATIC
            }
        } else {
            return ERigidBodyType.DYNAMIC
        }
    }

    /** kinematic */

    getLinearVelocity (out: Vec3): Vec3 {
        return ammo2CocosVec3(out, this.impl.getLinearVelocity());
    }

    setLinearVelocity (value: Vec3): void {
        if (!this.isAwake) this.impl.activate();
        cocos2AmmoVec3(this.impl.getLinearVelocity(), value);
    }

    getAngularVelocity (out: Vec3): Vec3 {
        return ammo2CocosVec3(out, this.impl.getAngularVelocity());
    }

    setAngularVelocity (value: Vec3): void {
        if (!this.isAwake) this.impl.activate();
        cocos2AmmoVec3(this.impl.getAngularVelocity(), value);
    }

    /** dynamic */

    applyLocalForce (force: Vec3, rel_pos?: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        if (!this.isAwake) this.impl.activate();
        const quat = this._sharedBody.node.worldRotation;
        const v = Vec3.transformQuat(v3_0, force, quat);
        const rp = rel_pos ? Vec3.transformQuat(v3_1, rel_pos, quat) : Vec3.ZERO;
        this.impl.applyForce(
            cocos2AmmoVec3(this._btVec3_0, v),
            cocos2AmmoVec3(this._btVec3_1, rp)
        )
    }

    applyLocalTorque (torque: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        if (!this.isAwake) this.impl.activate();
        Vec3.transformQuat(v3_0, torque, this._sharedBody.node.worldRotation);
        this.impl.applyTorque(cocos2AmmoVec3(this._btVec3_0, v3_0));
    }

    applyLocalImpulse (impulse: Vec3, rel_pos?: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        if (!this.isAwake) this.impl.activate();
        const quat = this._sharedBody.node.worldRotation;
        const v = Vec3.transformQuat(v3_0, impulse, quat);
        const rp = rel_pos ? Vec3.transformQuat(v3_1, rel_pos, quat) : Vec3.ZERO;
        this.impl.applyImpulse(
            cocos2AmmoVec3(this._btVec3_0, v),
            cocos2AmmoVec3(this._btVec3_1, rp)
        )
    }

    applyForce (force: Vec3, rel_pos?: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        if (!this.isAwake) this.impl.activate();
        const rp = rel_pos ? rel_pos : Vec3.ZERO;
        this.impl.applyForce(
            cocos2AmmoVec3(this._btVec3_0, force),
            cocos2AmmoVec3(this._btVec3_1, rp)
        )
    }

    applyTorque (torque: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        if (!this.isAwake) this.impl.activate();
        this.impl.applyTorque(cocos2AmmoVec3(this._btVec3_0, torque));
    }

    applyImpulse (impulse: Vec3, rel_pos?: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        if (!this.isAwake) this.impl.activate();
        const rp = rel_pos ? rel_pos : Vec3.ZERO;
        this.impl.applyImpulse(
            cocos2AmmoVec3(this._btVec3_0, impulse),
            cocos2AmmoVec3(this._btVec3_1, rp)
        )
    }

    /** group mask */
    getGroup (): number {
        return this._sharedBody.collisionFilterGroup;
    }

    setGroup (v: number): void {
        this._sharedBody.collisionFilterGroup = v;
    }

    addGroup (v: number): void {
        this._sharedBody.collisionFilterGroup |= v;
    }

    removeGroup (v: number): void {
        this._sharedBody.collisionFilterGroup &= ~v;
    }

    getMask (): number {
        return this._sharedBody.collisionFilterMask;
    }

    setMask (v: number): void {
        this._sharedBody.collisionFilterMask = v;
    }

    addMask (v: number): void {
        this._sharedBody.collisionFilterMask |= v;
    }

    removeMask (v: number): void {
        this._sharedBody.collisionFilterMask &= ~v;
    }

}
