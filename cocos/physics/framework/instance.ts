/**
 * @hidden
 */

import { Vec3 } from '../../core/math';
import { IRigidBody } from '../spec/i-rigid-body';
import { BoxShape, PhysicsWorld, RigidBody, SphereShape, CapsuleShape, TrimeshShape, CylinderShape, ConeShape, TerrainShape, SimpleShape, PlaneShape } from './physics-selector';
import { IBoxShape, ISphereShape, ICapsuleShape, ITrimeshShape, ICylinderShape, IConeShape, ITerrainShape, ISimpleShape, IPlaneShape } from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { errorID, warnID, warn } from '../../core';
import { EDITOR, DEBUG, PHYSICS_BUILTIN, PHYSICS_AMMO, TEST, PHYSICS_CANNON } from 'internal:constants';

interface IEntireShape extends IBoxShape, ISphereShape, ICapsuleShape, ITrimeshShape, ICylinderShape, IConeShape, ITerrainShape, ISimpleShape, IPlaneShape { }
const FUNC = (...v: any) => { return 0 as any; };
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
}

export function checkPhysicsModule (obj: any) {
    if (DEBUG && !TEST && !EDITOR && obj == null) {
        errorID(9600);
        return true;
    }
    return false;
}

export function createPhysicsWorld (): IPhysicsWorld {
    if (DEBUG && checkPhysicsModule(PhysicsWorld)) { return null as any; }
    return new PhysicsWorld() as IPhysicsWorld;
}

export function createRigidBody (): IRigidBody {
    if (DEBUG && checkPhysicsModule(RigidBody)) { return null as any; }
    return new RigidBody() as IRigidBody;
}

export function createBoxShape (size: Vec3): IBoxShape {
    if (DEBUG && checkPhysicsModule(BoxShape)) { return null as any; }
    return new BoxShape(size) as IBoxShape;
}

export function createSphereShape (radius: number): ISphereShape {
    if (DEBUG && checkPhysicsModule(SphereShape)) { return null as any; }
    return new SphereShape(radius) as ISphereShape;
}

export function createCapsuleShape (radius = 0.5, height = 2, dir = 1): ICapsuleShape {
    if (PHYSICS_BUILTIN || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(CapsuleShape)) { return null as any; }
        return new CapsuleShape(radius, height, dir) as ICapsuleShape;
    } else {
        warnID(9610);
        return ENTIRE_SHAPE;
    }
}

export function createCylinderShape (radius = 0.5, height = 2, dir = 1): ICylinderShape {
    if (PHYSICS_CANNON || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(CylinderShape)) { return null as any; }
        return new CylinderShape(radius, height, dir) as ICylinderShape;
    } else {
        warnID(9612);
        return ENTIRE_SHAPE;
    }
}

export function createConeShape (radius = 0.5, height = 1, dir = 1): IConeShape {
    if (PHYSICS_CANNON || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(ConeShape)) { return null as any; }
        return new ConeShape(radius, height, dir) as IConeShape;
    } else {
        warnID(9612);
        return ENTIRE_SHAPE;
    }
}

export function createTrimeshShape (): ITrimeshShape {
    if (PHYSICS_CANNON || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(TrimeshShape)) { return null as any; }
        return new TrimeshShape() as ITrimeshShape;
    } else {
        warnID(9611);
        return ENTIRE_SHAPE;
    }
}

export function createTerrainShape (): ITerrainShape {
    if (PHYSICS_CANNON || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(TerrainShape)) { return null as any; }
        return new TerrainShape() as ITerrainShape;
    } else {
        warn("[Physics]: builtin physics system doesn't support cylinder collider");
        return ENTIRE_SHAPE;
    }
}

export function createSimpleShape (): ISimpleShape {
    if (PHYSICS_CANNON || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(SimpleShape)) { return null as any; }
        return new SimpleShape() as ISimpleShape;
    } else {
        warn("[Physics]: builtin physics system doesn't support simple collider");
        return ENTIRE_SHAPE;
    }
}

export function createPlaneShape (): IPlaneShape {
    if (PHYSICS_CANNON || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(PlaneShape)) { return null as any; }
        return new PlaneShape() as IPlaneShape;
    } else {
        warn("[Physics]: builtin physics system doesn't support plane collider");
        return ENTIRE_SHAPE;
    }
}
