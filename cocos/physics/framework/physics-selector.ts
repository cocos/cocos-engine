/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { EDITOR, TEST } from 'internal:constants';
import { IBaseConstraint, IPointToPointConstraint, IHingeConstraint, IFixedConstraint,
    IConfigurableConstraint } from '../spec/i-physics-constraint';
import {
    IBoxShape, ISphereShape, ICapsuleShape, ITrimeshShape, ICylinderShape,
    IConeShape, ITerrainShape, ISimplexShape, IPlaneShape, IBaseShape,
} from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { IRigidBody } from '../spec/i-rigid-body';
import { IBoxCharacterController, ICapsuleCharacterController } from '../spec/i-character-controller';
import { errorID, IVec3Like, warn, cclegacy, log } from '../../core';
import { EColliderType, EConstraintType, ECharacterControllerType } from './physics-enum';
import { PhysicsMaterial } from '.';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type IPhysicsEngineId = 'builtin' | 'cannon.js' | 'bullet' | 'physx' | string;

interface IPhysicsWrapperObject {
    PhysicsWorld?: Constructor<IPhysicsWorld>,
    RigidBody?: Constructor<IRigidBody>,
    BoxCharacterController?: Constructor<IBoxCharacterController>,
    CapsuleCharacterController?: Constructor<ICapsuleCharacterController>,
    BoxShape?: Constructor<IBoxShape>,
    SphereShape?: Constructor<ISphereShape>,
    CapsuleShape?: Constructor<ICapsuleShape>,
    TrimeshShape?: Constructor<ITrimeshShape>,
    CylinderShape?: Constructor<ICylinderShape>,
    ConeShape?: Constructor<IConeShape>,
    TerrainShape?: Constructor<ITerrainShape>,
    SimplexShape?: Constructor<ISimplexShape>,
    PlaneShape?: Constructor<IPlaneShape>,
    PointToPointConstraint?: Constructor<IPointToPointConstraint>,
    HingeConstraint?: Constructor<IHingeConstraint>,
    FixedConstraint?: Constructor<IFixedConstraint>,
    ConfigurableConstraint?: Constructor<IConfigurableConstraint>,
}

interface IPhysicsBackend { [key: string]: IPhysicsWrapperObject; }

export interface IPhysicsSelector {
    /**
     * @en
     * The id of the physics engine being used by the physics system.
     * @zh
     * 物理系统正在使用的物理引擎的唯一标志。
     */
    readonly id: IPhysicsEngineId,

    /**
     * @en
     * The wrapper of the physics engine being used by the physics system.
     * @zh
     * 物理系统使用的物理引擎的封装层。
     */
    readonly wrapper: IPhysicsWrapperObject,

    /**
     * @en
     * All physics engine backends that the physics module has registered.
     * @zh
     * 物理模块已注册的所有物理引擎后端。
     */
    readonly backend: IPhysicsBackend,

    /**
     * @en
     * An instance of the physical world through which you can access the lowlevel objects.
     * @zh
     * 物理世界实例，通过它可以访问到底层对象。
     */
    readonly physicsWorld: IPhysicsWorld | null;

    /**
     * @en
     * To register the backend, the system will use the last backend registered before initialization,
     * and the registration after that needs to be switched manually.
     * @zh
     * 注册后端，系统将使用在初始化前注册的最后一个后端，此后注册的需要手动切换。
     */
    register: (id: IPhysicsEngineId, wrapper: IPhysicsWrapperObject) => void,

    /**
     * @en
     * Switch to the physics backend corresponding to the id in the registry.
     * @zh
     * 切换为注册表里对应 id 的物理后端。
     */
    switchTo: (id: IPhysicsEngineId) => void,

    // polyfill
    [x: string]: any,
}

function updateLegacyMacro (id: string): void {
    cclegacy._global.CC_PHYSICS_BUILTIN = id === 'builtin';
    cclegacy._global.CC_PHYSICS_CANNON = id === 'cannon.js';
    cclegacy._global.CC_PHYSICS_AMMO = id === 'bullet';
}

function register (id: IPhysicsEngineId, wrapper: IPhysicsWrapperObject): void {
    if (!EDITOR && !TEST) log(`[PHYSICS]: register ${id}.`);
    selector.backend[id] = wrapper;
    if (!selector.physicsWorld || selector.id === id) {
        updateLegacyMacro(id);
        const mutableSelector = selector as Mutable<IPhysicsSelector>;
        mutableSelector.id = id;
        mutableSelector.wrapper = wrapper;
    }
}

export interface IWorldInitData {
    gravity: IVec3Like;
    allowSleep: boolean;
    defaultMaterial: PhysicsMaterial;
}
let worldInitData: IWorldInitData | null;

function switchTo (id: IPhysicsEngineId): void {
    if (!selector.runInEditor) return;
    const mutableSelector = selector as Mutable<IPhysicsSelector>;
    if (selector.physicsWorld && id !== selector.id && selector.backend[id] != null) {
        selector.physicsWorld.destroy();
        if (!TEST) log(`[PHYSICS]: switch from ${selector.id} to ${id}.`);
        updateLegacyMacro(id);
        mutableSelector.id = id;
        mutableSelector.wrapper = selector.backend[id];
        mutableSelector.physicsWorld = createPhysicsWorld();
    } else {
        if (!EDITOR && !TEST) log(`[PHYSICS]: using ${id}.`);
        mutableSelector.physicsWorld = createPhysicsWorld();
    }
    if (worldInitData) {
        const world = mutableSelector.physicsWorld;
        world.setGravity(worldInitData.gravity);
        world.setAllowSleep(worldInitData.allowSleep);
    }
}

/**
 * @en
 * The physics selector is used to register and switch the physics engine backend.
 * @zh
 * 物理选择器用于注册和切换物理引擎后端。
 */
export const selector: IPhysicsSelector = {
    id: '',
    switchTo,
    register,
    wrapper: {} as any,
    backend: {} as any,
    physicsWorld: null as any,

    /// hide for now ///
    runInEditor: !EDITOR,
};

export function constructDefaultWorld (data: IWorldInitData): void {
    if (!worldInitData) worldInitData = data;
    if (!selector.runInEditor) return;
    if (!selector.physicsWorld) {
        if (!TEST) log(`[PHYSICS]: using ${selector.id}.`);
        const mutableSelector = selector as Mutable<IPhysicsSelector>;
        const world = mutableSelector.physicsWorld = createPhysicsWorld();
        world.setGravity(worldInitData.gravity);
        world.setAllowSleep(worldInitData.allowSleep);
    }
}

/// Utility Function For Create Wrapper Entity ///

const FUNC = (...v: any): any => 0 as any;
const ENTIRE_WORLD: IPhysicsWorld = {
    impl: null,
    debugDrawFlags: 0,
    debugDrawConstraintSize: 0,
    setGravity: FUNC,
    setAllowSleep: FUNC,
    setDefaultMaterial: FUNC,
    step: FUNC,
    syncAfterEvents: FUNC,
    syncSceneToPhysics: FUNC,
    raycast: FUNC,
    raycastClosest: FUNC,
    sweepBox: FUNC,
    sweepBoxClosest: FUNC,
    sweepSphere: FUNC,
    sweepSphereClosest: FUNC,
    sweepCapsule: FUNC,
    sweepCapsuleClosest: FUNC,
    emitEvents: FUNC,
    destroy: FUNC,
};

enum ECheckType {
    World,
    RigidBody,
    // COLLIDER //
    BoxCollider,
    SphereCollider,
    CapsuleCollider,
    MeshCollider,
    CylinderCollider,
    ConeCollider,
    TerrainCollider,
    SimplexCollider,
    PlaneCollider,
    // JOINT //
    PointToPointConstraint,
    HingeConstraint,
    FixedConstraint,
    ConfigurableConstraint,
    // CHARACTER CONTROLLER //
    BoxCharacterController,
    CapsuleCharacterController,
}

function check (obj: any, type: ECheckType): boolean {
    if (obj == null) {
        if (selector.id) {
            warn(`${selector.id} physics does not support ${ECheckType[type]}`);
        } else {
            errorID(9600);
        }
        return true;
    }
    return false;
}

export function createPhysicsWorld (): IPhysicsWorld {
    if (check(selector.wrapper.PhysicsWorld, ECheckType.World)) {
        return ENTIRE_WORLD;
    }
    return new selector.wrapper.PhysicsWorld!();
}

const ENTIRE_RIGID_BODY: IRigidBody = {
    impl: null,
    rigidBody: null as unknown as any,
    isAwake: false,
    isSleepy: false,
    isSleeping: false,
    initialize: FUNC,
    onEnable: FUNC,
    onDisable: FUNC,
    onDestroy: FUNC,
    setType: FUNC,
    setMass: FUNC,
    setLinearDamping: FUNC,
    setAngularDamping: FUNC,
    useGravity: FUNC,
    setLinearFactor: FUNC,
    setAngularFactor: FUNC,
    setAllowSleep: FUNC,
    wakeUp: FUNC,
    sleep: FUNC,
    clearState: FUNC,
    clearForces: FUNC,
    clearVelocity: FUNC,
    setSleepThreshold: FUNC,
    getSleepThreshold: FUNC,
    getLinearVelocity: FUNC,
    setLinearVelocity: FUNC,
    getAngularVelocity: FUNC,
    setAngularVelocity: FUNC,
    applyForce: FUNC,
    applyLocalForce: FUNC,
    applyImpulse: FUNC,
    applyLocalImpulse: FUNC,
    applyTorque: FUNC,
    applyLocalTorque: FUNC,
    setGroup: FUNC,
    getGroup: FUNC,
    addGroup: FUNC,
    removeGroup: FUNC,
    setMask: FUNC,
    getMask: FUNC,
    addMask: FUNC,
    removeMask: FUNC,
    isUsingCCD: FUNC,
    useCCD: FUNC,
};

export function createRigidBody (): IRigidBody {
    if (check(selector.wrapper.RigidBody, ECheckType.RigidBody)) {
        return ENTIRE_RIGID_BODY;
    }
    return new selector.wrapper.RigidBody!();
}

/// CREATE COLLIDER ///

const CREATE_COLLIDER_PROXY = { INITED: false };

interface IEntireShape extends IBoxShape, ISphereShape, ICapsuleShape,
    ITrimeshShape, ICylinderShape, IConeShape, ITerrainShape, ISimplexShape, IPlaneShape { }
const ENTIRE_SHAPE: IEntireShape = {
    impl: null,
    collider: null as unknown as any,
    attachedRigidBody: null,
    initialize: FUNC,
    onLoad: FUNC,
    onEnable: FUNC,
    onDisable: FUNC,
    onDestroy: FUNC,
    setGroup: FUNC,
    getGroup: FUNC,
    addGroup: FUNC,
    removeGroup: FUNC,
    setMask: FUNC,
    getMask: FUNC,
    addMask: FUNC,
    removeMask: FUNC,
    setMaterial: FUNC,
    setAsTrigger: FUNC,
    setCenter: FUNC,
    getAABB: FUNC,
    getBoundingSphere: FUNC,
    updateSize: FUNC,
    updateRadius: FUNC,
    setRadius: FUNC,
    setCylinderHeight: FUNC,
    setDirection: FUNC,
    setHeight: FUNC,
    setShapeType: FUNC,
    setVertices: FUNC,
    setMesh: FUNC,
    setTerrain: FUNC,
    setNormal: FUNC,
    setConstant: FUNC,
    updateEventListener: FUNC,
};

export function createShape (type: EColliderType): IBaseShape {
    initColliderProxy();
    return CREATE_COLLIDER_PROXY[type]();
}

function initColliderProxy (): void {
    if (CREATE_COLLIDER_PROXY.INITED) return;
    CREATE_COLLIDER_PROXY.INITED = true;

    CREATE_COLLIDER_PROXY[EColliderType.BOX] = function createBoxShape (): IBoxShape {
        if (check(selector.wrapper.BoxShape, ECheckType.BoxCollider)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.BoxShape!();
    };

    CREATE_COLLIDER_PROXY[EColliderType.SPHERE] = function createSphereShape (): ISphereShape {
        if (check(selector.wrapper.SphereShape, ECheckType.SphereCollider)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.SphereShape!();
    };

    CREATE_COLLIDER_PROXY[EColliderType.CAPSULE] = function createCapsuleShape (): ICapsuleShape {
        if (check(selector.wrapper.CapsuleShape, ECheckType.CapsuleCollider)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.CapsuleShape!();
    };

    CREATE_COLLIDER_PROXY[EColliderType.CYLINDER] = function createCylinderShape (): ICylinderShape {
        if (check(selector.wrapper.CylinderShape, ECheckType.CylinderCollider)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.CylinderShape!();
    };

    CREATE_COLLIDER_PROXY[EColliderType.CONE] = function createConeShape (): IConeShape {
        if (check(selector.wrapper.ConeShape, ECheckType.ConeCollider)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.ConeShape!();
    };

    CREATE_COLLIDER_PROXY[EColliderType.MESH] = function createTrimeshShape (): ITrimeshShape {
        if (check(selector.wrapper.TrimeshShape, ECheckType.MeshCollider)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.TrimeshShape!();
    };

    CREATE_COLLIDER_PROXY[EColliderType.TERRAIN] = function createTerrainShape (): ITerrainShape {
        if (check(selector.wrapper.TerrainShape, ECheckType.TerrainCollider)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.TerrainShape!();
    };

    CREATE_COLLIDER_PROXY[EColliderType.SIMPLEX] = function createSimplexShape (): ISimplexShape {
        if (check(selector.wrapper.SimplexShape, ECheckType.SimplexCollider)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.SimplexShape!();
    };

    CREATE_COLLIDER_PROXY[EColliderType.PLANE] = function createPlaneShape (): IPlaneShape {
        if (check(selector.wrapper.PlaneShape, ECheckType.PlaneCollider)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.PlaneShape!();
    };
}

/// CREATE CONSTRAINT ///

const CREATE_CONSTRAINT_PROXY = { INITED: false };

interface IEntireConstraint extends IPointToPointConstraint, IHingeConstraint, IFixedConstraint, IConfigurableConstraint { }
const ENTIRE_CONSTRAINT: IEntireConstraint = {
    impl: null,
    initialize: FUNC,
    onLoad: FUNC,
    onEnable: FUNC,
    onDisable: FUNC,
    onDestroy: FUNC,
    setEnableCollision: FUNC,
    setConnectedBody: FUNC,
    setPivotA: FUNC,
    setPivotB: FUNC,
    setAxis: FUNC,
    setSecondaryAxis: FUNC,
    setBreakForce: FUNC,
    setBreakTorque: FUNC,
    setConstraintMode: FUNC,
    setLinearLimit: FUNC,
    setAngularExtent: FUNC,
    setLinearSoftConstraint: FUNC,
    setLinearStiffness: FUNC,
    setLinearDamping: FUNC,
    setLinearRestitution: FUNC,
    setSwingSoftConstraint: FUNC,
    setTwistSoftConstraint: FUNC,
    setSwingStiffness: FUNC,
    setSwingDamping: FUNC,
    setSwingRestitution: FUNC,
    setTwistStiffness: FUNC,
    setTwistDamping: FUNC,
    setTwistRestitution: FUNC,
    setDriverMode: FUNC,
    setLinearMotorTarget: FUNC,
    setLinearMotorVelocity: FUNC,
    setLinearMotorForceLimit: FUNC,
    setAngularMotorTarget: FUNC,
    setAngularMotorVelocity: FUNC,
    setAngularMotorForceLimit: FUNC,
    setAutoPivotB: FUNC,
    setLimitEnabled: FUNC,
    setLowerLimit: FUNC,
    setUpperLimit: FUNC,
    setMotorEnabled: FUNC,
    setMotorVelocity: FUNC,
    setMotorForceLimit: FUNC,
};

export function createConstraint (type: EConstraintType): IBaseConstraint {
    initConstraintProxy();
    return CREATE_CONSTRAINT_PROXY[type]();
}

function initConstraintProxy (): void {
    if (CREATE_CONSTRAINT_PROXY.INITED) return;
    CREATE_CONSTRAINT_PROXY.INITED = true;

    CREATE_CONSTRAINT_PROXY[EConstraintType.POINT_TO_POINT] = function createPointToPointConstraint (): IPointToPointConstraint {
        if (check(selector.wrapper.PointToPointConstraint, ECheckType.PointToPointConstraint)) { return ENTIRE_CONSTRAINT; }
        return new selector.wrapper.PointToPointConstraint!();
    };

    CREATE_CONSTRAINT_PROXY[EConstraintType.HINGE] = function createHingeConstraint (): IHingeConstraint {
        if (check(selector.wrapper.HingeConstraint, ECheckType.HingeConstraint)) { return ENTIRE_CONSTRAINT; }
        return new selector.wrapper.HingeConstraint!();
    };

    CREATE_CONSTRAINT_PROXY[EConstraintType.FIXED] = function createFixedConstraint (): IFixedConstraint {
        if (check(selector.wrapper.FixedConstraint, ECheckType.FixedConstraint)) { return ENTIRE_CONSTRAINT; }
        return new selector.wrapper.FixedConstraint!();
    };

    CREATE_CONSTRAINT_PROXY[EConstraintType.CONFIGURABLE] = function createConfigurableConstraint (): IConfigurableConstraint {
        if (check(selector.wrapper.ConfigurableConstraint, ECheckType.ConfigurableConstraint)) { return ENTIRE_CONSTRAINT; }
        return new selector.wrapper.ConfigurableConstraint!();
    };
}

/// CREATE CHARACTER CONTROLLER ///
const CREATE_CHARACTER_CONTROLLER_PROXY = { INITED: false };

interface IEntireCharacterController extends IBoxCharacterController, ICapsuleCharacterController { }
const ENTIRE_CHARACTER_CONTROLLER: IEntireCharacterController = {
    initialize: FUNC,
    onLoad: FUNC,
    onEnable: FUNC,
    onDisable: FUNC,
    onDestroy: FUNC,
    onGround: FUNC,
    getPosition: FUNC,
    setPosition: FUNC,
    setStepOffset: FUNC,
    setSlopeLimit: FUNC,
    setContactOffset: FUNC,
    setDetectCollisions: FUNC,
    setOverlapRecovery: FUNC,
    setGroup: FUNC,
    getGroup: FUNC,
    addGroup: FUNC,
    removeGroup: FUNC,
    setMask: FUNC,
    getMask: FUNC,
    addMask: FUNC,
    removeMask: FUNC,
    move: FUNC,
    syncPhysicsToScene: FUNC,
    updateEventListener: FUNC,
    //IBoxCharacterController
    setHalfHeight: FUNC,
    setHalfSideExtent: FUNC,
    setHalfForwardExtent: FUNC,
    //ICapsuleCharacterController
    setRadius: FUNC,
    setHeight: FUNC,
};

export function createCharacterController (type: ECharacterControllerType): IEntireCharacterController {
    initCharacterControllerProxy();
    return CREATE_CHARACTER_CONTROLLER_PROXY[type]();
}

function initCharacterControllerProxy (): void {
    if (CREATE_CHARACTER_CONTROLLER_PROXY.INITED) return;
    CREATE_CHARACTER_CONTROLLER_PROXY.INITED = true;

    CREATE_CHARACTER_CONTROLLER_PROXY[ECharacterControllerType.BOX] = function createBoxCharacterController (): IBoxCharacterController {
        if (check(selector.wrapper.BoxCharacterController, ECheckType.BoxCharacterController)) { return ENTIRE_CHARACTER_CONTROLLER; }
        return new selector.wrapper.BoxCharacterController!();
    };

    CREATE_CHARACTER_CONTROLLER_PROXY[ECharacterControllerType.CAPSULE] = function createCapsuleCharacterController (): ICapsuleCharacterController {
        if (check(selector.wrapper.CapsuleCharacterController, ECheckType.CapsuleCharacterController)) { return ENTIRE_CHARACTER_CONTROLLER; }
        return new selector.wrapper.CapsuleCharacterController!();
    };
}
