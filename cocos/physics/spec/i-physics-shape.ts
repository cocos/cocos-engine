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

import { ILifecycle } from './i-lifecycle';
import { IGroupMask } from './i-group-mask';
import { IVec3Like, geometry } from '../../core';
import { Collider, RigidBody, PhysicsMaterial, SimplexCollider } from '../../../exports/physics-framework';
import { Mesh } from '../../3d/assets';
import { ITerrainAsset } from './i-external';

export interface IBaseShape extends ILifecycle, IGroupMask {
    readonly impl: any;
    readonly collider: Collider;
    readonly attachedRigidBody: RigidBody | null;
    initialize (v: Collider): void;
    setMaterial: (v: PhysicsMaterial | null) => void;
    setAsTrigger: (v: boolean) => void;
    setCenter: (v: IVec3Like) => void;
    // setAttachedBody: (body: RigidBody | null) => void;
    getAABB: (v: geometry.AABB) => void;
    getBoundingSphere: (v: geometry.Sphere) => void;
    updateEventListener: () => void;
}

export interface IBoxShape extends IBaseShape {
    updateSize: () => void;
}

export interface ISphereShape extends IBaseShape {
    updateRadius: () => void;
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
