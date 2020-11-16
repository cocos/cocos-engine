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

import { legacyCC } from '../../core/global-exports';
interface IPhysicsWrapperObject {
    PhysicsWorld: any,
    RigidBody?: any,

    BoxShape: any,
    SphereShape: any,
    CapsuleShape?: any,
    TrimeshShape?: any,
    CylinderShape?: any,
    ConeShape?: any,
    TerrainShape?: any,
    SimplexShape?: any,
    PlaneShape?: any,

    PointToPointConstraint?: any,
    HingeConstraint?: any,
    ConeTwistConstraint?: any,
}

type IPhysicsEngineId = 'builtin' | 'cannon.js' | 'ammo.js' | string | undefined;

export let WRAPPER: IPhysicsWrapperObject;

export let physicsEngineId: IPhysicsEngineId;

export function select (id: IPhysicsEngineId, wrapper: IPhysicsWrapperObject) {
    physicsEngineId = id;
    legacyCC._global['CC_PHYSICS_BUILTIN'] = id == 'builtin';
    legacyCC._global['CC_PHYSICS_CANNON'] = id == "cannon.js";
    legacyCC._global['CC_PHYSICS_AMMO'] = id == "ammo.js";
    
    WRAPPER = wrapper;
}
