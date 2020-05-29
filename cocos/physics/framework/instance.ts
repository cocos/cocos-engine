/**
 * @hidden
 */

import { Vec3 } from '../../core/math';
import { IRigidBody } from '../spec/i-rigid-body';
import { BoxShape, PhysicsWorld, RigidBody, SphereShape, CapsuleShape, TrimeshShape, CylinderShape, ConeShape, TerrainShape, SimpleShape } from './physics-selector';
import { IBoxShape, ISphereShape, ICapsuleShape, ITrimeshShape, ICylinderShape, IConeShape, ITerrainShape, ISimpleShape } from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { errorID, warnID, warn } from '../../core';
import { EDITOR, DEBUG, PHYSICS_BUILTIN, PHYSICS_AMMO, TEST, PHYSICS_CANNON } from 'internal:constants';

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
        const func = () => { };
        return {
            setRadius: func,
            setHeight: func,
            setDirection: func,
            setMaterial: func,
            setIsTrigger: func,
            setCenter: func,
            initialize: func,
            onLoad: func,
            onEnable: func,
            onDisable: func,
            onDestroy: func
        } as any
    }
}

export function createCylinderShape (radius = 0.5, height = 2, dir = 1): ICylinderShape {
    if (PHYSICS_CANNON || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(CylinderShape)) { return null as any; }
        return new CylinderShape(radius, height, dir) as ICylinderShape;
    } else {
        warnID(9612);
        const func = () => { };
        return {
            setRadius: func,
            setHeight: func,
            setDirection: func,
            setMaterial: func,
            setIsTrigger: func,
            setCenter: func,
            initialize: func,
            onLoad: func,
            onEnable: func,
            onDisable: func,
            onDestroy: func
        } as any
    }
}

export function createConeShape (radius = 0.5, height = 1, dir = 1): IConeShape {
    if (PHYSICS_CANNON || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(ConeShape)) { return null as any; }
        return new ConeShape(radius, height, dir) as IConeShape;
    } else {
        warnID(9612);
        const func = () => { };
        return {
            setRadius: func,
            setHeight: func,
            setDirection: func,
            setMaterial: func,
            setIsTrigger: func,
            setCenter: func,
            initialize: func,
            onLoad: func,
            onEnable: func,
            onDisable: func,
            onDestroy: func
        } as any
    }
}

export function createTrimeshShape (): ITrimeshShape {
    if (PHYSICS_CANNON || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(TrimeshShape)) { return null as any; }
        return new TrimeshShape() as ITrimeshShape;
    } else {
        warnID(9611);
        const func = () => { };
        return {
            setMesh: func,
            setMaterial: func,
            setIsTrigger: func,
            setCenter: func,
            initialize: func,
            onLoad: func,
            onEnable: func,
            onDisable: func,
            onDestroy: func
        } as any
    }
}

export function createTerrainShape (): ITerrainShape {
    if (PHYSICS_CANNON || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(TerrainShape)) { return null as any; }
        return new TerrainShape() as ITerrainShape;
    } else {
        warn("[Physics]: builtin physics system doesn't support cylinder collider");
        const func = () => { };
        return {
            setTerrain: func,
            setMaterial: func,
            setIsTrigger: func,
            setCenter: func,
            initialize: func,
            onLoad: func,
            onEnable: func,
            onDisable: func,
            onDestroy: func
        } as any
    }
}

export function createSimpleShape (): ISimpleShape {
    if (PHYSICS_CANNON || PHYSICS_AMMO) {
        if (DEBUG && checkPhysicsModule(SimpleShape)) { return null as any; }
        return new SimpleShape() as ISimpleShape;
    } else {
        warn("[Physics]: builtin physics system doesn't support simple collider");
        const func = () => { };
        return {
            setShapeType: func,
            setVertices: func,
            setMaterial: func,
            setIsTrigger: func,
            setCenter: func,
            initialize: func,
            onLoad: func,
            onEnable: func,
            onDisable: func,
            onDestroy: func
        } as any
    }
}

export function checkPhysicsModule (obj: any) {
    if (DEBUG && !TEST && !EDITOR && obj == null) {
        errorID(9600);
        return true;
    }
    return false;
}
