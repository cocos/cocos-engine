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
import { CannonLockConstraint } from './constraints/cannon-lock-constraint';
import { Game, game } from '../../game';

game.once(Game.EVENT_PRE_SUBSYSTEM_INIT, () => {
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
        FixedConstraint: CannonLockConstraint,
    });
});
