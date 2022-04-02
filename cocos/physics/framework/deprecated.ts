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
 * @module physics
 */

import { PhysicsSystem } from './physics-system';
import { replaceProperty, removeProperty } from '../../core/utils/x-deprecated';
import { BoxCollider } from './components/colliders/box-collider';
import { SphereCollider } from './components/colliders/sphere-collider';
import { CapsuleCollider } from './components/colliders/capsule-collider';
import { RigidBody } from './components/rigid-body';
import { Collider } from './components/colliders/collider';
import { Constraint } from './components/constraints/constraint';

replaceProperty(PhysicsSystem, 'PhysicsSystem', [
    {
        name: 'ins',
        newName: 'instance',
    },
    {
        name: 'PHYSICS_AMMO',
        newName: 'PHYSICS_BULLET',
    },
]);

replaceProperty(PhysicsSystem.prototype, 'PhysicsSystem.prototype', [
    {
        name: 'deltaTime',
        newName: 'fixedTimeStep',
    },
    {
        name: 'maxSubStep',
        newName: 'maxSubSteps',
    },
]);

removeProperty(PhysicsSystem.prototype, 'PhysicsSystem.prototype', [
    {
        name: 'useFixedTime',
    },
    {
        name: 'useCollisionMatrix',
    },
    {
        name: 'updateCollisionMatrix',
    },
    {
        name: 'resetCollisionMatrix',
    },
    {
        name: 'isCollisionGroup',
    },
    {
        name: 'setCollisionGroup',
    },
]);

replaceProperty(Collider.prototype, 'Collider.prototype', [
    {
        name: 'attachedRigidbody',
        newName: 'attachedRigidBody',
    },
    {
        name: 'TYPE',
        newName: 'type',
    },
]);

replaceProperty(Collider, 'Collider', [
    {
        name: 'EColliderType',
        newName: 'Type',
    },
    {
        name: 'EAxisDirection',
        newName: 'Axis',
    },
]);

replaceProperty(Constraint, 'Constraint', [
    {
        name: 'EConstraintType',
        newName: 'Type',
    },
]);

replaceProperty(BoxCollider.prototype, 'BoxCollider.prototype', [
    {
        name: 'boxShape',
        newName: 'shape',
    },
]);

replaceProperty(SphereCollider.prototype, 'SphereCollider.prototype', [
    {
        name: 'sphereShape',
        newName: 'shape',
    },
]);

replaceProperty(CapsuleCollider.prototype, 'CapsuleCollider.prototype', [
    {
        name: 'capsuleShape',
        newName: 'shape',
    },
]);

replaceProperty(RigidBody.prototype, 'RigidBody.prototype', [
    {
        name: 'rigidBody',
        newName: 'body',
    },
]);

replaceProperty(RigidBody, 'RigidBody', [
    {
        name: 'ERigidBodyType',
        newName: 'Type',
    },
]);

removeProperty(RigidBody.prototype, 'RigidBody.prototype', [
    {
        name: 'fixedRotation',
    },
]);
