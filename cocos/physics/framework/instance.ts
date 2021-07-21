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

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { EDITOR, TEST } from 'internal:constants';
import { IRigidBody } from '../spec/i-rigid-body';
import { selector } from './physics-selector';
import {
    IBoxShape, ISphereShape, ICapsuleShape, ITrimeshShape, ICylinderShape,
    IConeShape, ITerrainShape, ISimplexShape, IPlaneShape, IBaseShape,
} from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { errorID, warn } from '../../core';
import { EColliderType, EConstraintType } from './physics-enum';
import { IBaseConstraint, IPointToPointConstraint, IHingeConstraint, IConeTwistConstraint } from '../spec/i-physics-constraint';
import { legacyCC } from '../../core/global-exports';

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
