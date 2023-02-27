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

import CANNON from '@cocos/cannon';
import { Vec3, RecyclePool, error, js, geometry, IVec3Like } from '../../core';
import { fillRaycastResult, toCannonRaycastOptions } from './cannon-util';
import { CannonConstraint } from './constraints/cannon-constraint';
import { CannonShape } from './shapes/cannon-shape';
import { CannonSharedBody } from './cannon-shared-body';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { PhysicsMaterial, PhysicsRayResult } from '../framework';
import { CannonRigidBody } from './cannon-rigid-body';
import { Node } from '../../scene-graph';

export class CannonWorld implements IPhysicsWorld {
    get impl () {
        return this._world;
    }

    setDefaultMaterial (mat: PhysicsMaterial) {
        this._world.defaultMaterial.friction = mat.friction;
        this._world.defaultMaterial.restitution = mat.restitution;
        if (CannonShape.idToMaterial[mat.id] != null) {
            CannonShape.idToMaterial[mat.id] = this._world.defaultMaterial;
        }
    }

    setAllowSleep (v: boolean) {
        this._world.allowSleep = v;
    }

    setGravity (gravity: IVec3Like) {
        Vec3.copy(this._world.gravity, gravity);
    }

    // get defaultContactMaterial () {
    //     return this._defaultContactMaterial;
    // }

    readonly bodies: CannonSharedBody[] = [];
    readonly constraints: CannonConstraint[] = [];

    private _world: CANNON.World;
    static readonly rayResult = new CANNON.RaycastResult();

    constructor () {
        this._world = new CANNON.World();
        this._world.broadphase = new CANNON.NaiveBroadphase();
        // this._world.broadphase = new CANNON.SAPBroadphase(this._world);
        this._world.solver.iterations = 10;
        (this._world.solver as any).tolerance = 0.0001;
        this._world.defaultContactMaterial.contactEquationStiffness = 1000000;
        this._world.defaultContactMaterial.frictionEquationStiffness = 1000000;
        this._world.defaultContactMaterial.contactEquationRelaxation = 3;
        this._world.defaultContactMaterial.frictionEquationRelaxation = 3;
    }

    destroy (): void {
        if (this.constraints.length || this.bodies.length) error('You should destroy all physics component first.');
        (this._world.broadphase as any) = null;
        (this._world as any) = null;
    }

    emitEvents (): void {
        this._world.emitTriggeredEvents();
        this._world.emitCollisionEvents();
    }

    syncSceneToPhysics (): void {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncSceneToPhysics();
        }
    }

    syncAfterEvents (): void {
        this.syncSceneToPhysics();
    }

    step (deltaTime: number, timeSinceLastCalled?: number, maxSubStep?: number) {
        if (this.bodies.length === 0) return;
        this._world.step(deltaTime, timeSinceLastCalled, maxSubStep);

        // sync physics to scene
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncPhysicsToScene();
        }
    }

    raycastClosest (worldRay: geometry.Ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        setupFromAndTo(worldRay, options.maxDistance);
        toCannonRaycastOptions(raycastOpt, options);
        const hit = this._world.raycastClosest(from, to, raycastOpt, CannonWorld.rayResult);
        if (hit) {
            fillRaycastResult(result, CannonWorld.rayResult);
        }
        return hit;
    }

    raycast (worldRay: geometry.Ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        setupFromAndTo(worldRay, options.maxDistance);
        toCannonRaycastOptions(raycastOpt, options);
        const hit = this._world.raycastAll(from, to, raycastOpt, (result: CANNON.RaycastResult): any => {
            const r = pool.add();
            fillRaycastResult(r, result);
            results.push(r);
        });
        return hit;
    }

    getSharedBody (node: Node, wrappedBody?: CannonRigidBody): CannonSharedBody {
        return CannonSharedBody.getSharedBody(node, this, wrappedBody);
    }

    addSharedBody (sharedBody: CannonSharedBody) {
        const i = this.bodies.indexOf(sharedBody);
        if (i < 0) {
            this.bodies.push(sharedBody);
            this._world.addBody(sharedBody.body);
        }
    }

    removeSharedBody (sharedBody: CannonSharedBody) {
        const i = this.bodies.indexOf(sharedBody);
        if (i >= 0) {
            js.array.fastRemoveAt(this.bodies, i);
            this._world.remove(sharedBody.body);
        }
    }

    //  addContactMaterial (contactMaterial: ContactMaterial) {
    //     this._cannonWorld.addContactMaterial(contactMaterial._getImpl());
    // }

    addConstraint (constraint: CannonConstraint) {
        const i = this.constraints.indexOf(constraint);
        if (i < 0) {
            this.constraints.push(constraint);
            this._world.addConstraint(constraint.impl);
        }
    }

    removeConstraint (constraint: CannonConstraint) {
        const i = this.constraints.indexOf(constraint);
        if (i >= 0) {
            js.array.fastRemoveAt(this.constraints, i);
            this._world.removeConstraint(constraint.impl);
        }
    }
}

const from = new CANNON.Vec3();
const to = new CANNON.Vec3();
function setupFromAndTo (worldRay: geometry.Ray, distance: number) {
    Vec3.copy(from, worldRay.o);
    worldRay.computeHit(to, distance);
}

const raycastOpt: CANNON.IRaycastOptions = {
    checkCollisionResponse: false,
    collisionFilterGroup: -1,
    collisionFilterMask: -1,
    skipBackfaces: true,
} as any;
