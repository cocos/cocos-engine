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
import { AmmoRigidBody } from './ammo-rigid-body';
import { AmmoWorld } from './ammo-world';
import { BulletBoxShape } from './shapes/ammo-box-shape';
import { BulletSphereShape } from './shapes/ammo-sphere-shape';
import { AmmoCapsuleShape } from './shapes/ammo-capsule-shape';
import { AmmoTrimeshShape } from './shapes/ammo-trimesh-shape';
import { AmmoCylinderShape } from './shapes/ammo-cylinder-shape';
import { AmmoConeShape } from './shapes/ammo-cone-shape';
import { AmmoTerrainShape } from './shapes/ammo-terrain-shape';
import { AmmoSimplexShape } from './shapes/ammo-simplex-shape';
import { AmmoPlaneShape } from './shapes/ammo-plane-shape';

// import { AmmoPointToPointConstraint } from './constraints/ammo-point-to-point-constraint';
// import { AmmoHingeConstraint } from './constraints/ammo-hinge-constraint';
import { Game, game } from '../../core';
import { BulletP2PConstraint } from './constraints/bullet-p2p-constraint';
import { BulletHingeConstraint } from './constraints/bullet-hinge-constraint';

game.once(Game.EVENT_ENGINE_INITED, () => {
    selector.register('ammo.js', {
        PhysicsWorld: AmmoWorld,
        RigidBody: AmmoRigidBody,

        BoxShape: BulletBoxShape,
        SphereShape: BulletSphereShape,
        // CapsuleShape: AmmoCapsuleShape,
        // TrimeshShape: AmmoTrimeshShape,
        // CylinderShape: AmmoCylinderShape,
        // ConeShape: AmmoConeShape,
        // TerrainShape: AmmoTerrainShape,
        // SimplexShape: AmmoSimplexShape,
        PlaneShape: AmmoPlaneShape,

        // PointToPointConstraint: AmmoPointToPointConstraint,
        // HingeConstraint: AmmoHingeConstraint,
    });
});
