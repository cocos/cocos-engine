import Ammo from 'ammo.js';
import { Quat, Vec3, quat, math, Node } from "../../core";
import { AmmoWorld } from "./ammo-world";
import { AmmoShape } from "./shapes/ammo-shape";
import { Cocos2AmmoVec3, Cocos2AmmoQuat, Ammo2CocosQuat, Ammo2CocosVec3 } from "./ammo-util";
import { ColliderComponent, RigidBodyComponent, PhysicsSystem } from '../../../exports/physics-framework';
import { AmmoCollisionFlags, AmmoRigidBodyFlags, AmmoBroadphaseNativeTypes, AmmoCollisionObjectStates } from './ammo-enum';
import { TransformDirtyBit } from '../../core/scene-graph/node-enum';
import { max, abs } from '../../core/math/bits';
import { AmmoSphereShape } from './shapes/ammo-sphere-shape';
import { IRigidBody } from '../spec/I-rigid-body';
import { ERigidBodyType } from '../framework/physics-enum';
import { AmmoSharedBody } from './ammo-shared-body';

export class AmmoRigidBody implements IRigidBody {
    setGroup (v: number): void {
        throw new Error("Method not implemented.");
    }
    getGroup (): number {
        throw new Error("Method not implemented.");
    }
    addGroup (v: number): void {
        throw new Error("Method not implemented.");
    }
    removeGroup (v: number): void {
        throw new Error("Method not implemented.");
    }
    setMask (v: number): void {
        throw new Error("Method not implemented.");
    }
    getMask (): number {
        throw new Error("Method not implemented.");
    }
    addMask (v: number): void {
        throw new Error("Method not implemented.");
    }
    removeMask (v: number): void {
        throw new Error("Method not implemented.");
    }

    private static idCounter = 0;
    readonly id: number;

    // index: number = -1;

    // get impl (): Ammo.btRigidBody { return this._btBody; }
    // private _btBody!: Ammo.btRigidBody;
    // _btCompoundShape!: Ammo.btCompoundShape;

    // private _world!: AmmoWorld;
    // readonly shapes: AmmoShape[] = [];

    readonly wroldQuaternion: Ammo.btQuaternion;
    readonly localInertia: Ammo.btVector3;

    // motionState!: Ammo.btMotionState;

    get isEnabled () {
        return this._isEnabled;
    }

    private _isEnabled = false;
    private _sharedBody!: AmmoSharedBody;
    private get _btBody () { return this._sharedBody.body };
    private get _btCompoundShape () { return this._sharedBody.bodyCompoundShape };
    get rigidBody () {
        return this._rigidBody;
    }
    private _rigidBody!: RigidBodyComponent;
    constructor () {
        this.id = AmmoRigidBody.idCounter++;
        this.wroldQuaternion = new Ammo.btQuaternion();
        this.localInertia = new Ammo.btVector3(1.6666666269302368, 1.6666666269302368, 1.6666666269302368);
    }

    __preload (com: RigidBodyComponent) {
        this._rigidBody = com;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as AmmoWorld).getSharedBody(this._rigidBody.node as Node, this);
        this._sharedBody.reference = true;
    }

    onLoad () {
        // /** 构造复合形状 */
        // this._btCompoundShape = new Ammo.btCompoundShape(true);

        // /** 添加子形状 */
        // const allColliders = this.rigidBody.getComponents(ColliderComponent as any) as ColliderComponent[];
        // for (let i = 0; i < allColliders.length; i++) {
        //     if (!allColliders[i].isTrigger) {
        //         const ammoShape = (allColliders[i] as any)._shapeBase as AmmoShape;
        //         ammoShape.index = i;
        //         this.shapes.push(ammoShape);

        //         if (ammoShape.type == AmmoBroadphaseNativeTypes.SPHERE_SHAPE_PROXYTYPE) {
        //             const ws = allColliders[i].node.worldScale;
        //             const max_sp = abs(max(max(ws.x, ws.y), ws.z));
        //             const sphere = ammoShape as AmmoSphereShape;
        //             const rs = sphere.sphereCollider.radius;
        //             const scale = new Vec3(rs, rs, rs);
        //             scale.multiplyScalar(max_sp * 2);
        //             Cocos2AmmoVec3(ammoShape.scale, scale);
        //             ammoShape.shape.setLocalScaling(ammoShape.scale);

        //             const lt = ammoShape.transform;
        //             scale.set(max_sp, max_sp, max_sp);
        //             Vec3.multiply(scale, allColliders[i].center, scale);
        //             Cocos2AmmoVec3(lt.getOrigin(), scale);

        //             this._btCompoundShape.addChildShape(lt, (allColliders[i] as any)._shapeBase.impl);
        //         } else {
        //             const lt = ammoShape.transform;
        //             Cocos2AmmoVec3(lt.getOrigin(), allColliders[i].center);

        //             Cocos2AmmoVec3(ammoShape.scale, allColliders[i].node.worldScale);
        //             ammoShape.shape.setLocalScaling(ammoShape.scale);

        //             this._btCompoundShape.addChildShape(lt, (allColliders[i] as any)._shapeBase.impl);
        //         }
        //     }
        // }

        // /** 构造和初始化刚体*/
        // var st = new Ammo.btTransform();
        // st.setIdentity();
        // Cocos2AmmoVec3(st.getOrigin(), this.rigidBody.node.worldPosition)

        // Cocos2AmmoQuat(this.wroldQuaternion, this.rigidBody.node.worldRotation);
        // st.setRotation(this.wroldQuaternion);

        // if (this._btCompoundShape.getNumChildShapes() > 0) {
        //     this._btCompoundShape.calculateLocalInertia(this.rigidBody.mass, this.localInertia);
        // }
        // this.motionState = new Ammo.btDefaultMotionState(st);
        // var rbInfo = new Ammo.btRigidBodyConstructionInfo(this.rigidBody.mass, this.motionState, this._btCompoundShape, this.localInertia);
        // rbInfo.m_linearDamping = this.rigidBody.linearDamping;
        // rbInfo.m_angularDamping = this.rigidBody.angularDamping;
        // this._btBody = new Ammo.btRigidBody(rbInfo);

        // this.motionState.setWorldTransform = (transform: Ammo.btTransform) => {
        //     // if (this.rigidBody.node.hasChangedFlags) {
        //     //     const wt = this._btBody.getWorldTransform();
        //     //     Cocos2AmmoVec3(wt.getOrigin(), this.rigidBody.node.worldPosition)

        //     //     Cocos2AmmoQuat(this.wroldQuaternion, this.rigidBody.node.worldRotation);
        //     //     wt.setRotation(this.wroldQuaternion);
        //     //     this._btBody.activate();
        //     // }
        //     console.log("setWorldTransform///");
        // }

        // this.motionState.getWorldTransform = (transform: Ammo.btTransform) => {
        //     console.log("getWorldTransform----------------");
        // }

        // /** 初始化其它的属性 */

        // let wr = this.rigidBody.node.worldRotation;
        // var rotation = this.impl.getWorldTransform().getRotation();
        // rotation.setX(wr.x);
        // rotation.setY(wr.y);
        // rotation.setZ(wr.z);
        // rotation.setW(wr.w);

        // this._btBody.setLinearFactor(Cocos2AmmoVec3(new Ammo.btVector3(), this.rigidBody.linearFactor));
        // this._btBody.setAngularFactor(Cocos2AmmoVec3(new Ammo.btVector3(), this.rigidBody.angularFactor));
        // if (this.rigidBody.fixedRotation) {
        //     this._btBody.setAngularFactor(Cocos2AmmoVec3(new Ammo.btVector3(), Vec3.ZERO));
        // }
        // if (this.rigidBody.isKinematic) {
        //     this._btBody.setCollisionFlags(AmmoCollisionFlags.CF_KINEMATIC_OBJECT);
        // }
        // if (!this.rigidBody.useGravity) {
        //     this._btBody.setGravity(Cocos2AmmoVec3(new Ammo.btVector3(), Vec3.ZERO));
        //     this._btBody.setFlags(AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY);
        // }

        // /** disable sleep */
        // this._btBody.setActivationState(4);

        // /** hack */
        // (this.rigidBody as any)._isPreLoaded = true;
        // (this.rigidBody as any)._sharedBody = {
        //     body: this,
        //     rigidBody: this.rigidBody,
        //     _node: this.rigidBody.node
        // };

    }

    onEnable () {
        this._isEnabled = true;
        this.mass = this._rigidBody.mass;
        this.allowSleep = this._rigidBody.allowSleep;
        this.linearDamping = this._rigidBody.linearDamping;
        this.angularDamping = this._rigidBody.angularDamping;
        this.useGravity = this._rigidBody.useGravity;
        this.isKinematic = this._rigidBody.isKinematic;
        this.fixedRotation = this._rigidBody.fixedRotation;
        this.linearFactor = this._rigidBody.linearFactor;
        this.angularFactor = this._rigidBody.angularFactor;
        this._sharedBody.enabled = true;
        // this._world = AmmoWorld.instance;
        // AmmoWorld.instance.impl.addRigidBody(this._btBody);
        // AmmoWorld.instance.bodies.push(this);
        // this.index = AmmoWorld.instance.bodies.length - 1;
        // this._btBody.setUserIndex(this.index);
    }

    onDisable () {
        this._isEnabled = false;
        this._sharedBody.enabled = false;
        // AmmoWorld.instance.impl.removeRigidBody(this.impl);
        // AmmoWorld.instance.bodies.splice(this.index, 1);
        // this.index = -1;
        // this._btBody.setUserIndex(this.index);
    }

    // beforeStep () {
    //     if (this._rigidBody.node.hasChangedFlags) {
    //         const wt = this._btBody.getWorldTransform();
    //         Cocos2AmmoVec3(wt.getOrigin(), this._rigidBody.node.worldPosition)

    //         Cocos2AmmoQuat(this.wroldQuaternion, this._rigidBody.node.worldRotation);
    //         wt.setRotation(this.wroldQuaternion);
    //         this._btBody.activate();
    //     }
    // }

    // afterStep () {
    //     // let transform = new Ammo.btTransform();
    //     // this._btBody.getMotionState().getWorldTransform(transform);
    //     let transform = this._btBody.getWorldTransform();
    //     let origin = transform.getOrigin();
    //     this._rigidBody.node.worldPosition = new Vec3(origin.x(), origin.y(), origin.z());
    //     let rotation = transform.getRotation();
    //     this._rigidBody.node.worldRotation = new Quat(rotation.x(), rotation.y(), rotation.z(), rotation.w());
    // }

    /** property */

    set mass (value: number) {
        // See https://studiofreya.com/game-maker/bullet-physics/bullet-physics-how-to-change-body-mass/
        const wrappedWorld = this._sharedBody.wrappedWorld;
        if (wrappedWorld) {
            wrappedWorld.removeSharedBody(this._sharedBody);
        }
        this.localInertia.setValue(1.6666666269302368, 1.6666666269302368, 1.6666666269302368);
        if (this._btCompoundShape.getNumChildShapes() > 0) {
            this._btCompoundShape.calculateLocalInertia(this._rigidBody.mass, this.localInertia);
        }
        this._btBody.setMassProps(value, this.localInertia);
        if (wrappedWorld) {
            wrappedWorld.addSharedBody(this._sharedBody);
        }
    }

    set linearDamping (value: number) {
        this._btBody.setDamping(value, this._rigidBody.angularDamping);
    }

    set angularDamping (value: number) {
        this._btBody.setDamping(value, this._rigidBody.angularDamping);
    }

    set isKinematic (value: boolean) {
        let m_collisionFlags = this._btBody.getCollisionFlags();
        if (value) {
            m_collisionFlags |= AmmoCollisionFlags.CF_KINEMATIC_OBJECT;
        } else {
            m_collisionFlags &= (~AmmoCollisionFlags.CF_KINEMATIC_OBJECT);
        }
        this._btBody.setCollisionFlags(m_collisionFlags);
    }

    set useGravity (value: boolean) {
        const wrappedWorld = this._sharedBody.wrappedWorld;
        if (wrappedWorld) {
            wrappedWorld.removeSharedBody(this._sharedBody);
        }

        let m_rigidBodyFlag = this._btBody.getFlags()
        if (value) {
            m_rigidBodyFlag &= (~AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY);
        } else {
            this._btBody.setGravity(Cocos2AmmoVec3(new Ammo.btVector3(), Vec3.ZERO));
            m_rigidBodyFlag |= AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY;
        }
        this._btBody.setFlags(m_rigidBodyFlag);

        if (wrappedWorld) {
            wrappedWorld.addSharedBody(this._sharedBody);
        }
    }

    set fixedRotation (value: boolean) {
        if (value) {
            /** TODO : should i reset angular velocity & torque ? */

            this._btBody.setAngularFactor(Cocos2AmmoVec3(new Ammo.btVector3(), Vec3.ZERO));
        } else {
            this._btBody.setAngularFactor(Cocos2AmmoVec3(new Ammo.btVector3(), this._rigidBody.angularFactor));
        }
    }

    set linearFactor (value: Vec3) {
        this._btBody.setLinearFactor(Cocos2AmmoVec3(new Ammo.btVector3(), value));
    }

    set angularFactor (value: Vec3) {
        this._btBody.setAngularFactor(Cocos2AmmoVec3(new Ammo.btVector3(), value));
    }

    /** state */

    get isAwake (): boolean {
        const state = this._btBody.getActivationState();
        return state == AmmoCollisionObjectStates.ACTIVE_TAG ||
            state == AmmoCollisionObjectStates.DISABLE_DEACTIVATION;
    }

    get isSleepy (): boolean {
        const state = this._btBody.getActivationState();
        return state == AmmoCollisionObjectStates.WANTS_DEACTIVATION;
    }

    get isSleeping (): boolean {
        const state = this._btBody.getActivationState();
        return state == AmmoCollisionObjectStates.ISLAND_SLEEPING;
    }

    get allowSleep (): boolean {
        const state = this._btBody.getActivationState();
        return state == AmmoCollisionObjectStates.DISABLE_DEACTIVATION;
    }

    set allowSleep (v: boolean) {
        if (v) {
            this._btBody.setActivationState(AmmoCollisionObjectStates.DISABLE_DEACTIVATION);
        } else {
            const state = this._btBody.getActivationState();
            if (state == AmmoCollisionObjectStates.DISABLE_DEACTIVATION) {
                this._btBody.setActivationState(AmmoCollisionObjectStates.ACTIVE_TAG);
            }
        }
    }

    wakeUp (force?: boolean): void {
        this._btBody.activate(force);
    }

    sleep (): void {
        return this._btBody.wantsSleeping() as any;
    }

    /** type */

    getType (): ERigidBodyType {
        if (this._btBody.isStaticOrKinematicObject()) {
            if (this._btBody.isKinematicObject()) {
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
        return Ammo2CocosVec3(out, this._btBody.getLinearVelocity());
    }

    setLinearVelocity (value: Vec3): void {
        Cocos2AmmoVec3(this._btBody.getLinearVelocity(), value);
    }

    getAngularVelocity (out: Vec3): Vec3 {
        return Ammo2CocosVec3(out, this._btBody.getAngularFactor());
    }

    setAngularVelocity (value: Vec3): void {
        Cocos2AmmoVec3(this._btBody.getAngularFactor(), value);
    }

    /** dynamic */

    applyLocalForce (force: Vec3, rel_pos?: Vec3): void {
        rel_pos = rel_pos ? Vec3.transformQuat(rel_pos, rel_pos, this._rigidBody.node.worldRotation) : Vec3.ZERO;
        this._btBody.applyForce(
            Cocos2AmmoVec3(_btVec3_0, force),
            Cocos2AmmoVec3(_btVec3_1, rel_pos)
        )
    }

    applyLocalTorque (torque: Vec3): void {
        this._btBody.applyLocalTorque(Cocos2AmmoVec3(_btVec3_0, torque));
    }

    applyLocalImpulse (impulse: Vec3, rel_pos?: Vec3): void {
        rel_pos = rel_pos ? Vec3.transformQuat(rel_pos, rel_pos, this._rigidBody.node.worldRotation) : Vec3.ZERO;
        this._btBody.applyImpulse(
            Cocos2AmmoVec3(_btVec3_0, impulse),
            Cocos2AmmoVec3(_btVec3_1, rel_pos)
        )
    }

    applyForce (force: Vec3, rel_pos?: Vec3): void {
        rel_pos = rel_pos ? rel_pos : Vec3.ZERO;
        this._btBody.applyForce(
            Cocos2AmmoVec3(_btVec3_0, force),
            Cocos2AmmoVec3(_btVec3_1, rel_pos)
        )
    }

    applyTorque (torque: Vec3): void {
        this._btBody.applyTorque(Cocos2AmmoVec3(_btVec3_0, torque));
    }

    applyImpulse (impulse: Vec3, rel_pos?: Vec3): void {
        rel_pos = rel_pos ? rel_pos : Vec3.ZERO;
        this._btBody.applyImpulse(
            Cocos2AmmoVec3(_btVec3_0, impulse),
            Cocos2AmmoVec3(_btVec3_1, rel_pos)
        )
    }
}

const _btVec3_0 = new Ammo.btVector3();
const _btVec3_1 = new Ammo.btVector3();
