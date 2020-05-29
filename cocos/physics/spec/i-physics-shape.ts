/**
 * @hidden
 */

import { ILifecycle } from './i-lifecycle'
import { IGroupMask } from './i-group-mask'
import { IVec3Like } from '../../core/math/type-define';
import { ColliderComponent, RigidBodyComponent, PhysicMaterial, ESimpleShapeType } from '../../../exports/physics-framework';
import { Mesh } from '../../core';
import { ITerrainAsset } from './i-external';
import { aabb, sphere } from '../../core/geometry';

export interface IBaseShape extends ILifecycle, IGroupMask {
    readonly impl: any;
    readonly collider: ColliderComponent;
    readonly attachedRigidBody: RigidBodyComponent | null;
    initialize (v: ColliderComponent): void;
    setMaterial: (v: PhysicMaterial | null) => void;
    setAsTrigger: (v: boolean) => void;
    setCenter: (v: IVec3Like) => void;
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

export interface ISimpleShape extends IBaseShape {
    setShapeType: (v: ESimpleShapeType) => void;
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
