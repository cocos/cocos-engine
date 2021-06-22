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
import { EDITOR } from 'internal:constants';
import { legacyCC } from '../../core/global-exports';
import { IConeTwistConstraint, IHingeConstraint, IPointToPointConstraint } from '../spec/i-physics-constraint';
import {
    IBoxShape, ICapsuleShape, IConeShape, ICylinderShape, IPlaneShape,
    ISimplexShape, ISphereShape, ITerrainShape, ITrimeshShape,
} from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { IRigidBody } from '../spec/i-rigid-body';

type IPhysicsEngineId = 'builtin' | 'cannon.js' | 'ammo.js' | 'physx' | string;

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
    id: IPhysicsEngineId,
    wrapper: IPhysicsWrapperObject,
    backend: IPhysicsBackend,
    select: (id: IPhysicsEngineId, wrapper: IPhysicsWrapperObject) => void,
}

function select (id: IPhysicsEngineId, wrapper: IPhysicsWrapperObject): void {
    legacyCC._global.CC_PHYSICS_BUILTIN = id === 'builtin';
    legacyCC._global.CC_PHYSICS_CANNON = id === 'cannon.js';
    legacyCC._global.CC_PHYSICS_AMMO = id === 'ammo.js';
    if (!EDITOR) console.info(`[PHYSICS]: Using ${id}.`);
    selector.id = id;
    selector.wrapper = wrapper;
    if (id != null) selector.backend[id] = wrapper;
}

export const selector: IPhysicsSelector = {
    id: '',
    select,
    wrapper: {} as any,
    backend: {} as any,
};
