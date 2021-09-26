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

import { selector } from '../framework/physics-selector';

import { PhysXWorld } from './physx-world';
import { PhysXRigidBody } from './physx-rigid-body';

import { PhysXSphereShape } from './shapes/physx-sphere-shape';
import { PhysXBoxShape } from './shapes/physx-box-shape';
import { PhysXCapsuleShape } from './shapes/physx-capsule-shape';
import { PhysXPlaneShape } from './shapes/physx-plane-shape';
import { PhysXTrimeshShape } from './shapes/physx-trimesh-shape';
import { PhysXTerrainShape } from './shapes/physx-terrain-shape';
import { PhysXCylinderShape } from './shapes/physx-cylinder-shape';
import { PhysXConeShape } from './shapes/physx-cone-shape';

// import { PhysXFixedJoint } from './joints/physx-fixed-joint';
import { PhysXDistanceJoint } from './joints/physx-distance-joint';
import { PhysXRevoluteJoint } from './joints/physx-revolute-joint';
import { Game, game } from '../../core';

game.once(Game.EVENT_ENGINE_INITED, () => {
    selector.register('physx', {
        PhysicsWorld: PhysXWorld,
        RigidBody: PhysXRigidBody,

        BoxShape: PhysXBoxShape,
        SphereShape: PhysXSphereShape,
        CapsuleShape: PhysXCapsuleShape,
        TrimeshShape: PhysXTrimeshShape,
        CylinderShape: PhysXCylinderShape,
        ConeShape: PhysXConeShape,
        TerrainShape: PhysXTerrainShape,
        // SimplexShape: PhysXSimplexShape,
        PlaneShape: PhysXPlaneShape,

        PointToPointConstraint: PhysXDistanceJoint,
        // PointToPointConstraint: PhysXFixedJoint,
        HingeConstraint: PhysXRevoluteJoint,
    });
});
