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

import { PhysicsSystem } from './physics-system';
import { PhysicsMaterial } from './assets/physics-material';
import { PhysicsRayResult, PhysicsLineStripCastResult } from './physics-ray-result';
import { BoxCollider } from './components/colliders/box-collider';
import { Collider } from './components/colliders/collider';
import { SphereCollider } from './components/colliders/sphere-collider';
import { CapsuleCollider } from './components/colliders/capsule-collider';
import { CylinderCollider } from './components/colliders/cylinder-collider';
import { ConeCollider } from './components/colliders/cone-collider';
import { MeshCollider } from './components/colliders/mesh-collider';
import { RigidBody } from './components/rigid-body';
import { ConstantForce } from './components/constant-force';
import { TerrainCollider } from './components/colliders/terrain-collider';
import { SimplexCollider } from './components/colliders/simplex-collider';
import { PlaneCollider } from './components/colliders/plane-collider';

// constraints
import { Constraint } from './components/constraints/constraint';
import { HingeConstraint } from './components/constraints/hinge-constraint';
import { FixedConstraint } from './components/constraints/fixed-constraint';
import { ConfigurableConstraint } from './components/constraints/configurable-constraint';

import { PointToPointConstraint } from './components/constraints/point-to-point-constraint';

import { CharacterController } from './components/character-controllers/character-controller';
import { BoxCharacterController } from './components/character-controllers/box-character-controller';
import { CapsuleCharacterController } from './components/character-controllers/capsule-character-controller';

import { cclegacy } from '../../core';
import { selector } from './physics-selector';
import * as utils from '../utils/util';

export {
    PhysicsSystem,
    PhysicsRayResult,
    PhysicsLineStripCastResult,

    Collider,
    BoxCollider,
    SphereCollider,
    CapsuleCollider,
    MeshCollider,
    CylinderCollider,
    ConeCollider,
    TerrainCollider,
    SimplexCollider,
    PlaneCollider,

    Constraint,
    HingeConstraint,
    FixedConstraint,
    PointToPointConstraint,
    ConfigurableConstraint,

    RigidBody,
    PhysicsMaterial,
    ConstantForce,

    CharacterController,
    BoxCharacterController,
    CapsuleCharacterController,

    selector,
    utils,
};

cclegacy.PhysicsSystem = PhysicsSystem;

cclegacy.PhysicsMaterial = PhysicsMaterial;
cclegacy.PhysicsRayResult = PhysicsRayResult;
cclegacy.ConstantForce = ConstantForce;

export * from './physics-interface';
export * from './physics-config';
export * from './physics-enum';
