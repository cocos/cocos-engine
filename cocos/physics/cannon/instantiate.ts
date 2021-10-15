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

import { CannonRigidBody } from './cannon-rigid-body';
import { CannonWorld } from './cannon-world';

import { CannonBoxShape } from './shapes/cannon-box-shape';
import { CannonSphereShape } from './shapes/cannon-sphere-shape';
import { CannonTrimeshShape } from './shapes/cannon-trimesh-shape';
import { CannonCylinderShape } from './shapes/cannon-cylinder-shape';
import { CannonConeShape } from './shapes/cannon-cone-shape';
import { CannonTerrainShape } from './shapes/cannon-terrain-shape';
import { CannonSimplexShape } from './shapes/cannon-simplex-shape';
import { CannonPlaneShape } from './shapes/cannon-plane-shape';

import { CannonPointToPointConstraint } from './constraints/cannon-point-to-point-constraint';
import { CannonHingeConstraint } from './constraints/cannon-hinge-constraint';
import { Game, game } from '../../core';

game.once(Game.EVENT_ENGINE_INITED, () => {
    selector.register('cannon.js', {
        PhysicsWorld: CannonWorld,
        RigidBody: CannonRigidBody,

        BoxShape: CannonBoxShape,
        SphereShape: CannonSphereShape,
        TrimeshShape: CannonTrimeshShape,
        CylinderShape: CannonCylinderShape,
        ConeShape: CannonConeShape,
        TerrainShape: CannonTerrainShape,
        SimplexShape: CannonSimplexShape,
        PlaneShape: CannonPlaneShape,

        PointToPointConstraint: CannonPointToPointConstraint,
        HingeConstraint: CannonHingeConstraint,
    });
});
