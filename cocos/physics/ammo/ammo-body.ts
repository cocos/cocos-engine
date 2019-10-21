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
    getGroup (): number {
        throw new Error("Method not implemented.");
    }
    setGroup (v: number): void {
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
    private _worldPosition = new Vec3(0, 0, 0);
    private _worldRotation = new Quat();
    private _ammoWorldPositionBuffer = new Ammo.btVector3();
    private _ammoWorldRotationBuffer = new Ammo.btQuaternion();
    private _ammoShapeScalling = new Ammo.btVector3();
    private _mass = 0;
    private _isKinematic: boolean = false;
    private _linearDamping = 0;
    private _angularDamping = 0;
    private _velocityResult: Vec3 = new Vec3();
    private _world: AmmoWorld | null = null;
    private _useGravity = true;
    private _collisionCallbacks: Function[] = [];
    private _userData: any;
    private _shapes: AmmoShape[] = [];
    private _transformBuffer = new Ammo.btTransform();
    private _ammoTransform = new Ammo.btTransform();
    private _beforeWorldStepCallback: () => void;
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

    public addShape (shape_: ShapeBase) {
    }

    public removeShape (shape_: ShapeBase) {
    }

    public commitShapeUpdates () {
        ++this._nReconstructShapeRequest;
    }

    public getMass () {
        return this._mass;
    }

    public setMass (value: number) {
        this._mass = value;

        // See https://studiofreya.com/game-maker/bullet-physics/bullet-physics-how-to-change-body-mass/
        if (this._world) {
            this._world.impl.removeRigidBody(this.impl);
        }
        const localInertia = new Ammo.btVector3(0, 0, 0);
        this.ammoCompoundShape.calculateLocalInertia(this._mass, localInertia);
        this._ammoBody.setMassProps(this._mass, localInertia);
        if (this._world) {
            this._world.impl.addRigidBody(this.impl);
        }
    }

    public getIsKinematic () {
        return this._isKinematic;
    }

    public setIsKinematic (value: boolean) {
        this._isKinematic = value;
        // TO DO
    }

    public getLinearDamping () {
        return this._linearDamping;
    }

    public setLinearDamping (value: number) {
        this._linearDamping = value;
        this._updateDamping();
    }

    public getAngularDamping () {
        return this._angularDamping;
    }

    public setAngularDamping (value: number) {
        this._angularDamping = value;
        this._updateDamping();
    }

    public getUseGravity (): boolean {
        return this._useGravity;
    }

    public setUseGravity (value: boolean) {
        this._useGravity = value;
        if (value) {
            if (this._world) {
                const worldGravity = this._world.gravity;
                this._ammoBody.setGravity(new Ammo.btVector3(worldGravity.x, worldGravity.y, worldGravity.z));
            }
        } else {
            this._ammoBody.setGravity(new Ammo.btVector3(0, 0, 0));
        }
    }

    public getIsTrigger (): boolean {
        // TO DO
        return true;
    }

    public setIsTrigger (value: boolean): void {
        // TO DO
    }

    public getVelocity (): Vec3 {
        const linearVelocity = this._ammoBody.getLinearVelocity();
        // vec3AmmoToCreator(this._velocityResult, linearVelocity);
        return this._velocityResult;
    }

    public setVelocity (value: Vec3): void {
        this._changeRequests.velocity.hasValue = true;
        Vec3.copy(this._changeRequests.velocity.storage, value);
    }

    public getFreezeRotation (): boolean {
        // TO DO
        return false;
    }

    public setFreezeRotation (value: boolean) {
        // TO DO
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

    public setCollisionFilter (group: number, mask: number) {
        // TO DO
    }

    public _getInternalID () {
        return this._id;
    }

    public setWorld (world_: PhysicsWorldBase | null) {
        if (this._world) {
            this._world.decouple(this);
            this._world.impl.removeRigidBody(this.impl);
            this._world.removeBeforeStep(this._beforeWorldStepCallback);
            this._world = null;
        }

        const world = world_ as unknown as (AmmoWorld | null);
        if (world) {
            world.associate(this);
            world.impl.addRigidBody(this.impl);
            world.addBeforeStep(this._beforeWorldStepCallback);
        }
        this._world = world;
    }

    public getPosition (out: Vec3) {
        const physTransform = this._transformBuffer;
        this._ammoBody.getMotionState().getWorldTransform(physTransform);
        const physOrigin = physTransform.getOrigin();
        // vec3AmmoToCreator(this._worldPosition, physOrigin);
        Vec3.copy(out, this._worldPosition);
    }

    public setPosition (value: Vec3) {
        Vec3.copy(this._worldPosition, value);
        this._updateTransform();
    }

    public getRotation (out: Quat) {
        const physTransform = this._transformBuffer;

        this._ammoBody.getMotionState().getWorldTransform(physTransform);
        const physRotation = physTransform.getRotation();
        // quatAmmoToCreator(this._worldRotation, physRotation);
        Quat.copy(out, this._worldRotation);
    }

    public setRotation (value: Quat) {
        Quat.copy(this._worldRotation, value);
        this._updateTransform();
    }

    public _updateTransform () {
        this._ammoTransform.setIdentity();
        // vec3CreatorToAmmo(this._ammoWorldPositionBuffer, this._worldPosition);
        this._ammoTransform.setOrigin(this._ammoWorldPositionBuffer);
        // quatCreatorToAmmo(this._ammoWorldRotationBuffer, this._worldRotation);
        this._ammoTransform.setRotation(this._ammoWorldRotationBuffer);
        this._ammoBody.setWorldTransform(this._ammoTransform);
        this._motionState.setWorldTransform(this._ammoTransform);
        // console.log(`[[Set AMMO Transform]] ` +
        //     `Name: ${this._getName()}; ` +
        //     `Position: ${toString(this._worldPosition)}; ` +
        //     `Rotation: ${toString(this._worldRotation)}`);
    }

    public scaleAllShapes (scale: Vec3) {
        // vec3CreatorToAmmo(this._ammoShapeScalling, scale);
        for (const shape of this._shapes) {
            shape.setScale(scale);
        }
    }

    public addCollisionCallback (callback: Function): void {
        this._collisionCallbacks.push(callback);
    }

    public removeCollisionCllback (callback: Function): void {
        const i = this._collisionCallbacks.indexOf(callback);
        if (i >= 0) {
            this._collisionCallbacks.splice(i, 1);
        }
    }

    public getUserData (): any {
        return this._userData;
    }

    public setUserData (data: any): void {
        this._userData = data;
    }

    public dispatchCollisionWith (target: AmmoRigidBody) {
        this._collisionCallbacks.forEach((fx) => {
            fx({
                type: 'onCollisionEnter',
                selfCollider: null,
                otherCollider: null,
                contacts: []
            });
        });
    }

    private _updateDamping () {
        this._ammoBody.setDamping(this._linearDamping, this._angularDamping);
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
            this._world.decouple(this);
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
        this._ammoBody = new Ammo.btRigidBody(rigidBodyConstructionInfo);
        this._ammoBody.setUserIndex(this._id);

        this.setUseGravity(this._useGravity);

        this._ammoBody.setRestitution(0);
        this._ammoBody.setFriction(0.7745967);
        // this._bodyImpl.setRollingFriction(0.3);

        // this._ammoRigidBody.setCollisionFlags(this._ammoRigidBody.getCollisionFlags() | CF_CUSTOM_MATERIAL_CALLBACK);

        this._updateDamping();

        if (this._world) {
            this._world.impl.addRigidBody(this.impl);
            this._world.associate(this);
        }
        // console.log(`[[Reconstruct AMMO Rigidbody]] ` +
        //     `Name: ${this._getName()}; ` +
        //     `Position: ${toString(this._worldPosition)}; ` +
        //     `Rotation: ${toString(this._worldRotation)}`);
        return this._ammoBody;
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
            this._ammoBody.setLinearVelocity(v);
        }
        for (const { force, position } of this._changeRequests.forces) {
            const ammoForce = new Ammo.btVector3(0, 0, 0);
            // vec3CreatorToAmmo(ammoForce, force);
            const ammoPosition = new Ammo.btVector3(0, 0, 0);
            // vec3CreatorToAmmo(ammoPosition, position);
            this._ammoBody.applyForce(ammoForce, ammoPosition);
        }
        this._changeRequests.forces.length = 0;
    }

    rigidBody!: RigidBodyComponent;

    get impl (): Ammo.btRigidBody {
        return this._ammoBody;
    }
    private _ammoBody!: Ammo.btRigidBody;
    public ammoCompoundShape!: Ammo.btCompoundShape;
    public readonly wroldQuaternion: Ammo.btQuaternion;
    public index: number = -1;

    constructor () {
        // this._transformBuffer.setIdentity();
        // this._ammoTransform.setIdentity();
        // this._compoundShape = new Ammo.btCompoundShape(true);
        // this._id = AmmoRigidBody.ID_COUNTER++;
        // this._ammoBody = this._reconstructBody();
        this._beforeWorldStepCallback = this._beforeWorldStep.bind(this);

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

                if (ammoShape.type == AmmoBroadphaseNativeTypes.SPHERE_SHAPE_PROXYTYPE) {
                    const ws = allColliders[i].node.worldScale;
                    const max_sp = abs(max(max(ws.x, ws.y), ws.z));
                    const sphere = ammoShape as AmmoSphereShape;
                    const rs = sphere.sphereCollider.radius;
                    const scale = new Vec3(rs, rs, rs);
                    scale.multiplyScalar(max_sp * 2);
                    Cocos2AmmoVec3(ammoShape.scale, scale);
                    ammoShape.impl.setLocalScaling(ammoShape.scale);

                    const lt = ammoShape.localTransform;
                    scale.set(max_sp, max_sp, max_sp);
                    Vec3.multiply(scale, allColliders[i].center, scale);
                    Cocos2AmmoVec3(lt.getOrigin(), scale);

                    this.ammoCompoundShape.addChildShape(lt, (allColliders[i] as any)._shapeBase.impl);
                } else {
                    const lt = ammoShape.localTransform;
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
        this._ammoBody = new Ammo.btRigidBody(rbInfo);

        /** 初始化其它的属性 */

        let wr = this.rigidBody.node.worldRotation;
        var rotation = this.impl.getWorldTransform().getRotation();
        rotation.setX(wr.x);
        rotation.setY(wr.y);
        rotation.setZ(wr.z);
        rotation.setW(wr.w);

        this._ammoBody.setLinearFactor(Cocos2AmmoVec3(new Ammo.btVector3(), this.rigidBody.linearFactor));
        this._ammoBody.setAngularFactor(Cocos2AmmoVec3(new Ammo.btVector3(), this.rigidBody.angularFactor));
        if (this.rigidBody.fixedRotation) {
            this._ammoBody.setAngularFactor(Cocos2AmmoVec3(new Ammo.btVector3(), Vec3.ZERO));
        }
        if (this.rigidBody.isKinematic) {
            this._ammoBody.setCollisionFlags(AmmoCollisionFlags.CF_KINEMATIC_OBJECT);
        }
        if (!this.rigidBody.useGravity) {
            /** TODO : wait new ammo version */
            // Cocos2AmmoVec3(this._ammoBody.getGravity(), Vec3.ZERO);
            // this._ammoBody.setFlags(AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY);
        }

        /** disable sleep */
        this._ammoBody.setActivationState(4);
    }

    public start () {

    }

    public onEnable () {
        AmmoWorld.instance.impl.addRigidBody(this._ammoBody);
        AmmoWorld.instance.bodys.push(this);
        this.index = AmmoWorld.instance.bodys.length;
        this._ammoBody.setUserIndex(this.index);
    }

    public onDisable () {
        AmmoWorld.instance.impl.removeRigidBody(this.impl);
        AmmoWorld.instance.bodys.splice(this.index, 1);
        this.index = -1;
        this._ammoBody.setUserIndex(this.index);
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
}

const _btVec3_0 = new Ammo.btVector3();
