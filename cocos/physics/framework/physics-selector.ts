/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @hidden
 */

/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { EDITOR, TEST } from 'internal:constants';
import { legacyCC } from '../../core/global-exports';
import { IBaseConstraint, IPointToPointConstraint, IHingeConstraint, IConeTwistConstraint } from '../spec/i-physics-constraint';
import {
    IBoxShape, ISphereShape, ICapsuleShape, ITrimeshShape, ICylinderShape,
    IConeShape, ITerrainShape, ISimplexShape, IPlaneShape, IBaseShape,
} from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { IRigidBody } from '../spec/i-rigid-body';
import { errorID, warn } from '../../core';
import { EColliderType, EConstraintType } from './physics-enum';

export type IPhysicsEngineId = 'builtin' | 'cannon.js' | 'ammo.js' | 'physx' | string;

interface IPhysicsWrapperObject {
    PhysicsWorld?: Constructor<IPhysicsWorld>,
    RigidBody?: Constructor<IRigidBody>,
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
    ConeTwistConstraint?: Constructor<IConeTwistConstraint>,
}

type IPhysicsBackend = { [key: string]: IPhysicsWrapperObject; }

interface IPhysicsSelector {
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
     *
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
}

function updateLegacyMacro (id: string) {
    legacyCC._global.CC_PHYSICS_BUILTIN = id === 'builtin';
    legacyCC._global.CC_PHYSICS_CANNON = id === 'cannon.js';
    legacyCC._global.CC_PHYSICS_AMMO = id === 'ammo.js';
}

function register (id: IPhysicsEngineId, wrapper: IPhysicsWrapperObject): void {
    if (!EDITOR) console.info(`[PHYSICS]: register ${id}.`);
    selector.backend[id] = wrapper;
    if (!selector.physicsWorld || selector.id === id) {
        updateLegacyMacro(id);
        const mutableSelector = selector as Mutable<IPhysicsSelector>;
        mutableSelector.id = id;
        mutableSelector.wrapper = wrapper;
    }
}

function switchTo (id: IPhysicsEngineId) {
    const mutableSelector = selector as Mutable<IPhysicsSelector>;
    if (selector.physicsWorld && id !== selector.id && selector.backend[id] != null) {
        selector.physicsWorld.destroy();
        console.info(`[PHYSICS]: switch from ${selector.id} to ${id}.`);
        updateLegacyMacro(id);
        mutableSelector.id = id;
        mutableSelector.wrapper = selector.backend[id];
        mutableSelector.physicsWorld = createPhysicsWorld();
    } else {
        console.info(`[PHYSICS]: using ${id}.`);
        mutableSelector.physicsWorld = createPhysicsWorld();
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
};

export function constructDefaultWorld () {
    if (!selector.physicsWorld) {
        console.info(`[PHYSICS]: using ${selector.id}.`);
        const mutableSelector = selector as Mutable<IPhysicsSelector>;
        mutableSelector.physicsWorld = createPhysicsWorld();
    }
}

/// Utility Function For Create Wrapper Entity ///

const FUNC = (...v: any) => 0 as any;
const ENTIRE_WORLD: IPhysicsWorld = {
    impl: null,
    setGravity: FUNC,
    setAllowSleep: FUNC,
    setDefaultMaterial: FUNC,
    step: FUNC,
    syncAfterEvents: FUNC,
    syncSceneToPhysics: FUNC,
    raycast: FUNC,
    raycastClosest: FUNC,
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
    ConeTwistConstraint,
}

function check (obj: any, type: ECheckType) {
    if (!TEST && !EDITOR && !legacyCC.GAME_VIEW && obj == null) {
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
    isUseCCD: FUNC,
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
    setSize: FUNC,
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

function initColliderProxy () {
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

interface IEntireConstraint extends IPointToPointConstraint, IHingeConstraint, IConeTwistConstraint { }
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
};

export function createConstraint (type: EConstraintType): IBaseConstraint {
    initConstraintProxy();
    return CREATE_CONSTRAINT_PROXY[type]();
}

function initConstraintProxy () {
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

    CREATE_CONSTRAINT_PROXY[EConstraintType.CONE_TWIST] = function createConeTwistConstraint (): IConeTwistConstraint {
        if (check(selector.wrapper.ConeTwistConstraint, ECheckType.ConeTwistConstraint)) { return ENTIRE_CONSTRAINT; }
        return new selector.wrapper.ConeTwistConstraint!();
    };
}
