/**
 * @hidden
 */

import { ILifecycle } from './i-lifecycle'
import { IGroupMask } from './i-group-mask'
import { IVec3Like } from '../../core/math/type-define';
import { Collider, RigidBody, PhysicMaterial, SimplexCollider } from '../../../exports/physics-framework';
import { Mesh } from '../../core';
import { ITerrainAsset } from './i-external';
import { aabb, sphere } from '../../core/geometry';

export interface IBaseShape extends ILifecycle, IGroupMask {
    readonly impl: any;
    readonly collider: Collider;
    readonly attachedRigidBody: RigidBody | null;
    initialize (v: Collider): void;
    setMaterial: (v: PhysicMaterial | null) => void;
    setAsTrigger: (v: boolean) => void;
    setCenter: (v: IVec3Like) => void;
    // setAttachedBody: (body: RigidBody | null) => void;
    getAABB: (v: aabb) => void;
    getBoundingSphere: (v: sphere) => void;
}

export interface IBoxShape extends IBaseShape {
    setSize: (v: IVec3Like) => void;
}

export interface ISphereShape extends IBaseShape {
    setRadius: (v: number) => void;
}

export interface ICapsuleShape extends IBaseShape {
    setRadius: (v: number) => void;
    setCylinderHeight: (v: number) => void;
    setDirection: (v: number) => void;
}

export interface ICylinderShape extends IBaseShape {
    setRadius: (v: number) => void;
    setHeight: (v: number) => void;
    setDirection: (v: number) => void;
}

export interface ISimplexShape extends IBaseShape {
    setShapeType: (v: SimplexCollider.ESimplexType) => void;
    setVertices: (v: IVec3Like[]) => void;
}

export interface IConeShape extends IBaseShape {
    setRadius: (v: number) => void;
    setHeight: (v: number) => void;
    setDirection: (v: number) => void;
}

export interface ITrimeshShape extends IBaseShape {
    setMesh: (v: Mesh | null) => void;
}

export interface ITerrainShape extends IBaseShape {
    setTerrain: (v: ITerrainAsset | null) => void;
}

export interface IConeShape extends IBaseShape {
    setRadius: (v: number) => void;
    setHeight: (v: number) => void;
    setDirection: (v: number) => void;
}

export interface IPlaneShape extends IBaseShape {
    setNormal: (v: IVec3Like) => void;
    setConstant: (v: number) => void;
}
