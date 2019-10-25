import Ammo from 'ammo.js';
import { Quat, Vec3, quat, math } from "../../core";
import { RigidBodyBase, ShapeBase, PhysicsWorldBase } from "../api";
import { AmmoWorld } from "./ammo-world";
import { AmmoShape } from "./shapes/ammo-shape";
import { RigidBodyComponent } from "../components/rigid-body-component";
import { Cocos2AmmoVec3, Cocos2AmmoQuat } from "./ammo-util";
import { defaultRigidBodyInfo } from './ammo-const';
import { ColliderComponent } from '../../../exports/physics-framework';
import { AmmoCollisionFlags, AmmoRigidBodyFlags, AmmoBroadphaseNativeTypes } from './ammo-enum';
import { TransformDirtyBit } from '../../core/scene-graph/node-enum';
import { max, abs } from '../../core/math/bits';
import { AmmoSphereShape } from './shapes/ammo-sphere-shape';

export class AmmoRigidBody implements RigidBodyBase {
    getMass (): number {
        throw new Error("Method not implemented.");
    }
    getUseGravity (): boolean {
        throw new Error("Method not implemented.");
    }
    applyLocalForce (force: Vec3, localPoint?: Vec3 | undefined): void {
        // throw new Error("Method not implemented.");
    }
    applyLocalImpulse (impulse: Vec3, localPoint?: Vec3 | undefined): void {
        // throw new Error("Method not implemented.");
    }
    applyTorque (torque: Vec3): void {
        // throw new Error("Method not implemented.");
    }
    applyLocalTorque (torque: Vec3): void {
        // throw new Error("Method not implemented.");
    }
    getCollisionResponse (): boolean {
        // throw new Error("Method not implemented.");
        return false;
    }
    setCollisionResponse (value: boolean): void {
        // throw new Error("Method not implemented.");
    }
    getLinearVelocity (out?: Vec3 | undefined): Vec3 {
        throw new Error("Method not implemented.");
    }
    setLinearVelocity (value: Vec3): void {
        throw new Error("Method not implemented.");
    }
    getAngularVelocity (out?: Vec3 | undefined): Vec3 {
        throw new Error("Method not implemented.");
    }
    setAngularVelocity (value: Vec3): void {
        throw new Error("Method not implemented.");
    }
    getLinearFactor (out?: Vec3 | undefined): Vec3 {
        throw new Error("Method not implemented.");
    }
    setLinearFactor (value: Vec3): void {
        throw new Error("Method not implemented.");
    }
    getAngularFactor (out?: Vec3 | undefined): Vec3 {
        throw new Error("Method not implemented.");
    }
    setAngularFactor (value: Vec3): void {
        throw new Error("Method not implemented.");
    }
    getAllowSleep (): boolean {
        throw new Error("Method not implemented.");
    }
    setAllowSleep (v: boolean): void {
        throw new Error("Method not implemented.");
    }

    translateAndRotate (m: import("../../core").Mat4, rot: Quat): void {
        throw new Error("Method not implemented.");
    }
    getType (): import("../physic-enum").ERigidBodyType {
        throw new Error("Method not implemented.");
    }
    setType (v: import("../physic-enum").ERigidBodyType): void {
        throw new Error("Method not implemented.");
    }
    wakeUp (): void {
        throw new Error("Method not implemented.");
    }
    sleep (): void {
        throw new Error("Method not implemented.");
    }
    isAwake (): boolean {
        throw new Error("Method not implemented.");
    }
    isSleepy (): boolean {
        throw new Error("Method not implemented.");
    }
    isSleeping (): boolean {
        throw new Error("Method not implemented.");
    }

    private static ID_COUNTER = 0;

    private _id: number = -1;
    private _ammoWorldPositionBuffer = new Ammo.btVector3();
    private _ammoWorldRotationBuffer = new Ammo.btQuaternion();
    private _velocityResult: Vec3 = new Vec3();
    private _world: AmmoWorld | null = null;
    private _mass: number = 0;
    private _useGravity = true;
    private _userData: any;
    private _shapes: AmmoShape[] = [];
    private _transformBuffer = new Ammo.btTransform();
    private _ammoTransform = new Ammo.btTransform();
    private _nReconstructShapeRequest = 1;
    private _nReconstructBodyRequest = 1;
    private _changeRequests = {
        velocity: {
            hasValue: false,
            storage: new Vec3(),
        },
        forces: [],
        applyImpulse: {
            hasValue: false,
            storage: new Vec3(),
        },
    };

    private _motionState!: Ammo.btDefaultMotionState;

    public commitShapeUpdates () {
        ++this._nReconstructShapeRequest;
    }

    public applyForce (force: Vec3, position?: Vec3) {
        // if (!position) {
        //     position = new Vec3();
        //     const p = this._ammoRigidBody.getWorldTransform().getOrigin();
        // vec3AmmoToCreator(position, p);
        // }
        // this._changeRequests.forces.push({
        //     force,
        //     position,
        // });
    }

    public applyImpulse (impulse: Vec3) {
        // const ammoImpulse = new Ammo.btVector3(0, 0, 0);
        // vec3CreatorToAmmo(ammoImpulse, impulse);
        // this._ammoRigidBody.applyCentralImpulse(ammoImpulse);
    }

    public _updateTransform () {
        this._ammoTransform.setIdentity();
        // vec3CreatorToAmmo(this._ammoWorldPositionBuffer, this._worldPosition);
        this._ammoTransform.setOrigin(this._ammoWorldPositionBuffer);
        // quatCreatorToAmmo(this._ammoWorldRotationBuffer, this._worldRotation);
        this._ammoTransform.setRotation(this._ammoWorldRotationBuffer);
        this._btBody.setWorldTransform(this._ammoTransform);
        this._motionState.setWorldTransform(this._ammoTransform);
        // console.log(`[[Set AMMO Transform]] ` +
        //     `Name: ${this._getName()}; ` +
        //     `Position: ${toString(this._worldPosition)}; ` +
        //     `Rotation: ${toString(this._worldRotation)}`);
    }

    private _reconstructCompoundShape () {
        // this._compoundShape = new Ammo.btCompoundShape();
        // for (const shape of this._shapes) {
        //     this._compoundShape.addChildShape(shape.transform, shape.impl);
        // }
        // ++this._nReconstructBodyRequest;
    }

    private _reconstructBody () {
        if (this._world) {
            this._world.impl.removeRigidBody(this.impl);
            // this._world.decouple(this);
        }

        // vec3CreatorToAmmo(this._ammoWorldPositionBuffer, this._worldPosition);
        // quatCreatorToAmmo(this._ammoWorldRotationBuffer, this._worldRotation);
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(this._ammoWorldPositionBuffer);
        transform.setRotation(this._ammoWorldRotationBuffer);

        const localInertia = new Ammo.btVector3(0, 0, 0);
        this.ammoCompoundShape.calculateLocalInertia(this._mass, localInertia);

        this._motionState = new Ammo.btDefaultMotionState(transform);
        const rigidBodyConstructionInfo = new Ammo.btRigidBodyConstructionInfo(this._mass, this._motionState, this.ammoCompoundShape, localInertia);
        this._btBody = new Ammo.btRigidBody(rigidBodyConstructionInfo);
        this._btBody.setUserIndex(this._id);

        // this.setUseGravity(this._useGravity);

        this._btBody.setRestitution(0);
        this._btBody.setFriction(0.7745967);
        // this._bodyImpl.setRollingFriction(0.3);

        // this._ammoRigidBody.setCollisionFlags(this._ammoRigidBody.getCollisionFlags() | CF_CUSTOM_MATERIAL_CALLBACK);

        // this._updateDamping();

        if (this._world) {
            this._world.impl.addRigidBody(this.impl);
            // this._world.associate(this);
        }
        // console.log(`[[Reconstruct AMMO Rigidbody]] ` +
        //     `Name: ${this._getName()}; ` +
        //     `Position: ${toString(this._worldPosition)}; ` +
        //     `Rotation: ${toString(this._worldRotation)}`);
        return this._btBody;
    }

    private _beforeWorldStep () {
        if (this._nReconstructShapeRequest) {
            this._reconstructCompoundShape();
            this._nReconstructShapeRequest = 0;
        }
        if (this._nReconstructBodyRequest) {
            this._reconstructBody();
            this._nReconstructBodyRequest = 0;
        }
        if (this._changeRequests.velocity.hasValue) {
            this._changeRequests.velocity.hasValue = false;
            const v = new Ammo.btVector3();
            // vec3CreatorToAmmo(v, this._changeRequests.velocity.storage);
            this._btBody.setLinearVelocity(v);
        }
        for (const { force, position } of this._changeRequests.forces) {
            const ammoForce = new Ammo.btVector3(0, 0, 0);
            // vec3CreatorToAmmo(ammoForce, force);
            const ammoPosition = new Ammo.btVector3(0, 0, 0);
            // vec3CreatorToAmmo(ammoPosition, position);
            this._btBody.applyForce(ammoForce, ammoPosition);
        }
        this._changeRequests.forces.length = 0;
    }

    rigidBody!: RigidBodyComponent;

    public readonly id: number;
    private static idCounter = 0;
    get impl (): Ammo.btRigidBody {
        return this._btBody;
    }
    private _btBody!: Ammo.btRigidBody;
    public ammoCompoundShape!: Ammo.btCompoundShape;
    public shapes: AmmoShape[] = [];
    public readonly wroldQuaternion: Ammo.btQuaternion;
    public index: number = -1;

    constructor () {
        this.id = AmmoRigidBody.idCounter++;

        // this._transformBuffer.setIdentity();
        // this._ammoTransform.setIdentity();
        // this._compoundShape = new Ammo.btCompoundShape(true);
        // this._id = AmmoRigidBody.ID_COUNTER++;
        // this._ammoBody = this._reconstructBody();

        // var startTransform = new Ammo.btTransform();
        // startTransform.setIdentity();
        // var mass = 1;
        // var localInertia = new Ammo.btVector3(0, 0, 0);

        // var boxShape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1));
        // boxShape.calculateLocalInertia(mass, localInertia);

        // var myMotionState = new Ammo.btDefaultMotionState(startTransform);
        // var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, boxShape, localInertia);

        this.wroldQuaternion = new Ammo.btQuaternion();
    }

    public __preload () {

    }

    public onLoad () {
        /** 构造复合形状 */
        this.ammoCompoundShape = new Ammo.btCompoundShape(true);

        /** 添加子形状 */
        let allColliders = this.rigidBody.getComponents(ColliderComponent);
        for (let i = 0; i < allColliders.length; i++) {
            if (!allColliders[i].isTrigger) {
                const ammoShape = (allColliders[i] as any)._shapeBase as AmmoShape;
                ammoShape.index = i;
                this.shapes.push(ammoShape);

                if (ammoShape.type == AmmoBroadphaseNativeTypes.SPHERE_SHAPE_PROXYTYPE) {
                    const ws = allColliders[i].node.worldScale;
                    const max_sp = abs(max(max(ws.x, ws.y), ws.z));
                    const sphere = ammoShape as AmmoSphereShape;
                    const rs = sphere.sphereCollider.radius;
                    const scale = new Vec3(rs, rs, rs);
                    scale.multiplyScalar(max_sp * 2);
                    Cocos2AmmoVec3(ammoShape.scale, scale);
                    ammoShape.impl.setLocalScaling(ammoShape.scale);

                    const lt = ammoShape.transform;
                    scale.set(max_sp, max_sp, max_sp);
                    Vec3.multiply(scale, allColliders[i].center, scale);
                    Cocos2AmmoVec3(lt.getOrigin(), scale);

                    this.ammoCompoundShape.addChildShape(lt, (allColliders[i] as any)._shapeBase.impl);
                } else {
                    const lt = ammoShape.transform;
                    Cocos2AmmoVec3(lt.getOrigin(), allColliders[i].center);

                    Cocos2AmmoVec3(ammoShape.scale, allColliders[i].node.worldScale);
                    ammoShape.impl.setLocalScaling(ammoShape.scale);

                    this.ammoCompoundShape.addChildShape(lt, (allColliders[i] as any)._shapeBase.impl);
                }
            }
        }

        /** 构造和初始化刚体*/
        var st = new Ammo.btTransform();
        st.setIdentity();
        Cocos2AmmoVec3(st.getOrigin(), this.rigidBody.node.worldPosition)

        Cocos2AmmoQuat(this.wroldQuaternion, this.rigidBody.node.worldRotation);
        st.setRotation(this.wroldQuaternion);

        var localInertia = new Ammo.btVector3(0, 0, 0);
        this.ammoCompoundShape.calculateLocalInertia(this.rigidBody.mass, localInertia);
        var myMotionState = new Ammo.btDefaultMotionState(st);
        var rbInfo = new Ammo.btRigidBodyConstructionInfo(this.rigidBody.mass, myMotionState, this.ammoCompoundShape, localInertia);
        rbInfo.m_linearDamping = this.rigidBody.linearDamping;
        rbInfo.m_angularDamping = this.rigidBody.angularDamping;
        this._btBody = new Ammo.btRigidBody(rbInfo);

        /** 初始化其它的属性 */

        let wr = this.rigidBody.node.worldRotation;
        var rotation = this.impl.getWorldTransform().getRotation();
        rotation.setX(wr.x);
        rotation.setY(wr.y);
        rotation.setZ(wr.z);
        rotation.setW(wr.w);

        this._btBody.setLinearFactor(Cocos2AmmoVec3(new Ammo.btVector3(), this.rigidBody.linearFactor));
        this._btBody.setAngularFactor(Cocos2AmmoVec3(new Ammo.btVector3(), this.rigidBody.angularFactor));
        if (this.rigidBody.fixedRotation) {
            this._btBody.setAngularFactor(Cocos2AmmoVec3(new Ammo.btVector3(), Vec3.ZERO));
        }
        if (this.rigidBody.isKinematic) {
            this._btBody.setCollisionFlags(AmmoCollisionFlags.CF_KINEMATIC_OBJECT);
        }
        this._btBody.setGravity(Cocos2AmmoVec3(_btVec3_0, Vec3.ZERO));
        if (!this.rigidBody.useGravity) {
            this._btBody.setFlags(AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY);
        }

        /** disable sleep */
        this._btBody.setActivationState(4);
    }

    public start () {

    }

    public onEnable () {
        this._world = AmmoWorld.instance;
        AmmoWorld.instance.impl.addRigidBody(this._btBody);
        AmmoWorld.instance.bodys.push(this);
        this.index = AmmoWorld.instance.bodys.length - 1;
        this._btBody.setUserIndex(this.index);
    }

    public onDisable () {
        AmmoWorld.instance.impl.removeRigidBody(this.impl);
        AmmoWorld.instance.bodys.splice(this.index, 1);
        this.index = -1;
        this._btBody.setUserIndex(this.index);
    }

    public beforeStep () {
        if (this.rigidBody.node.hasChangedFlags) {
            const wt = this.impl.getWorldTransform();
            Cocos2AmmoVec3(wt.getOrigin(), this.rigidBody.node.worldPosition)

            Cocos2AmmoQuat(this.wroldQuaternion, this.rigidBody.node.worldRotation);
            wt.setRotation(this.wroldQuaternion);
            this.impl.activate();
        }
    }

    public afterStep () {
        let transform = new Ammo.btTransform();
        this.impl.getMotionState().getWorldTransform(transform);
        let origin = transform.getOrigin();
        this.rigidBody.node.worldPosition = new Vec3(origin.x(), origin.y(), origin.z());
        let rotation = transform.getRotation();
        this.rigidBody.node.worldRotation = new Quat(rotation.x(), rotation.y(), rotation.z(), rotation.w());
    }

    public setMass (value: number) {
        // See https://studiofreya.com/game-maker/bullet-physics/bullet-physics-how-to-change-body-mass/
        if (this._world) {
            this._world.impl.removeRigidBody(this.impl);
        }
        const localInertia = new Ammo.btVector3(0, 0, 0);
        this.ammoCompoundShape.calculateLocalInertia(this.rigidBody.mass, localInertia);
        this._btBody.setMassProps(this.rigidBody.mass, localInertia);
        if (this._world) {
            this._world.impl.addRigidBody(this.impl);
        }
    }

    public setLinearDamping (value: number) {
        this._btBody.setDamping(this.rigidBody.linearDamping, this.rigidBody.angularDamping);
    }

    public setAngularDamping (value: number) {
        this._btBody.setDamping(this.rigidBody.linearDamping, this.rigidBody.angularDamping);
    }

    public setIsKinematic (value: boolean) {
        let m_collisionFlags = this._btBody.getCollisionFlags();
        if (this.rigidBody.isKinematic) {
            m_collisionFlags |= AmmoCollisionFlags.CF_KINEMATIC_OBJECT;
        } else {
            m_collisionFlags &= (~AmmoCollisionFlags.CF_KINEMATIC_OBJECT);
        }
        this._btBody.setCollisionFlags(m_collisionFlags);
    }

    public setUseGravity (value: boolean) {
        if (this._world) {
            this._world.impl.removeRigidBody(this.impl);
        }

        let m_rigidBodyFlag = this._btBody.getFlags()
        if (this.rigidBody.useGravity) {
            m_rigidBodyFlag &= (~AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY);
        } else {
            this._btBody.setGravity(Cocos2AmmoVec3(_btVec3_0, Vec3.ZERO));
            m_rigidBodyFlag |= AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY;
        }
        this._btBody.setFlags(m_rigidBodyFlag);

        if (this._world) {
            this._world.impl.addRigidBody(this.impl);
        }
    }

    public setFreezeRotation (value: boolean) {
        if (this.rigidBody.fixedRotation) {
            /** TODO : should i reset angular velocity & torque ? */

            this._btBody.setAngularFactor(Cocos2AmmoVec3(_btVec3_0, Vec3.ZERO));
        } else {
            this._btBody.setAngularFactor(Cocos2AmmoVec3(_btVec3_0, this.rigidBody.angularFactor));
        }
    }
}

const _btVec3_0 = new Ammo.btVector3();
