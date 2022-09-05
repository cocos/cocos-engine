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

import { Game, game } from '../../core';
import { selector } from '../framework/physics-selector';
import { BulletRigidBody } from './bullet-rigid-body';
import { BulletWorld } from './bullet-world';
import { BulletBoxShape } from './shapes/bullet-box-shape';
import { BulletSphereShape } from './shapes/bullet-sphere-shape';
import { BulletCapsuleShape } from './shapes/bullet-capsule-shape';
import { BulletTrimeshShape } from './shapes/bullet-trimesh-shape';
import { BulletCylinderShape } from './shapes/bullet-cylinder-shape';
import { BulletConeShape } from './shapes/bullet-cone-shape';
import { BulletTerrainShape } from './shapes/bullet-terrain-shape';
import { BulletSimplexShape } from './shapes/bullet-simplex-shape';
import { BulletPlaneShape } from './shapes/bullet-plane-shape';
import { BulletP2PConstraint } from './constraints/bullet-p2p-constraint';
import { BulletHingeConstraint } from './constraints/bullet-hinge-constraint';

game.once(Game.EVENT_PRE_SUBSYSTEM_INIT, () => {
    selector.register('bullet', {
        PhysicsWorld: BulletWorld,
        RigidBody: BulletRigidBody,

        BoxShape: BulletBoxShape,
        SphereShape: BulletSphereShape,
        CapsuleShape: BulletCapsuleShape,
        TrimeshShape: BulletTrimeshShape,
        CylinderShape: BulletCylinderShape,
        ConeShape: BulletConeShape,
        TerrainShape: BulletTerrainShape,
        SimplexShape: BulletSimplexShape,
        PlaneShape: BulletPlaneShape,

        PointToPointConstraint: BulletP2PConstraint,
        HingeConstraint: BulletHingeConstraint,
    });
});
