/**
 * @hidden
 */

import { Vec3 } from '../../core/math';
import { BoxShape, PhysicsWorld, RigidBody, SphereShape, CapsuleShape, TrimeshShape, CylinderShape } from './physics-selector';
import { IRigidBody } from '../spec/i-rigid-body';
import { IBoxShape, ISphereShape, ICapsuleShape, ITrimeshShape, ICylinderShape } from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { errorID, warnID } from '../../core';
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

export function checkPhysicsModule (obj: any) {
    if (DEBUG && !TEST && !EDITOR && obj == null) {
        errorID(9600);
        return true;
    }
    return false;
}
