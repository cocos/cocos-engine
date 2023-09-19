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
import { replaceProperty, removeProperty, js, cclegacy } from '../../core';
import { BoxCollider } from './components/colliders/box-collider';
import { SphereCollider } from './components/colliders/sphere-collider';
import { CapsuleCollider } from './components/colliders/capsule-collider';
import { CylinderCollider } from './components/colliders/cylinder-collider';
import { MeshCollider } from './components/colliders/mesh-collider';
import { RigidBody } from './components/rigid-body';
import { Collider } from './components/colliders/collider';
import { PhysicsMaterial } from './assets/physics-material';
import { Constraint } from './components/constraints/constraint';
import { EConstraintType } from './physics-enum';

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

/**
 * Alias of [[RigidBody]]
 * @deprecated Since v1.2
 */
export { RigidBody as RigidBodyComponent };
cclegacy.RigidBodyComponent = RigidBody;
js.setClassAlias(RigidBody, 'cc.RigidBodyComponent');
/**
 * Alias of [[Collider]]
 * @deprecated Since v1.2
 */
export { Collider as ColliderComponent };
cclegacy.ColliderComponent = Collider;
js.setClassAlias(Collider, 'cc.ColliderComponent');
/**
 * Alias of [[BoxCollider]]
 * @deprecated Since v1.2
 */
export { BoxCollider as BoxColliderComponent };
cclegacy.BoxColliderComponent = BoxCollider;
js.setClassAlias(BoxCollider, 'cc.BoxColliderComponent');
/**
 * Alias of [[SphereCollider]]
 * @deprecated Since v1.2
 */
export { SphereCollider as SphereColliderComponent };
cclegacy.SphereColliderComponent = SphereCollider;
js.setClassAlias(SphereCollider, 'cc.SphereColliderComponent');
/**
 * Alias of [[CapsuleCollider]]
 * @deprecated Since v1.2
 */
export { CapsuleCollider as CapsuleColliderComponent };
js.setClassAlias(CapsuleCollider, 'cc.CapsuleColliderComponent');
/**
 * Alias of [[MeshCollider]]
 * @deprecated Since v1.2
 */
export { MeshCollider as MeshColliderComponent };
js.setClassAlias(MeshCollider, 'cc.MeshColliderComponent');
/**
 * Alias of [[CylinderCollider]]
 * @deprecated Since v1.2
 */
export { CylinderCollider as CylinderColliderComponent };
js.setClassAlias(CylinderCollider, 'cc.CylinderColliderComponent');
/**
 * Alias of [[PhysicsMaterial]]
 * @deprecated Since v1.2
 */
export { PhysicsMaterial as PhysicMaterial };
cclegacy.PhysicMaterial = PhysicsMaterial;
js.setClassAlias(PhysicsMaterial, 'cc.PhysicMaterial');
