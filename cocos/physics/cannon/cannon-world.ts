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
import { Vec3, RecyclePool, error, js, geometry, IVec3Like, IQuatLike, warnID, Color } from '../../core';
import { fillRaycastResult, toCannonRaycastOptions } from './cannon-util';
import { CannonConstraint } from './constraints/cannon-constraint';
import { CannonShape } from './shapes/cannon-shape';
import { CannonSharedBody } from './cannon-shared-body';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { EPhysicsDrawFlags, PhysicsMaterial, PhysicsRayResult } from '../framework';
import { CannonRigidBody } from './cannon-rigid-body';
import { Node } from '../../scene-graph';
import { GeometryRenderer } from '../../rendering/geometry-renderer';
import { director } from '../../game';

const aabbTemp = new geometry.AABB();
const AABB_LINE_COUNT = 12;

export class CannonWorld implements IPhysicsWorld {
    get impl (): CANNON.World {
        return this._world;
    }

    setDefaultMaterial (mat: PhysicsMaterial): void {
        this._world.defaultMaterial.friction = mat.friction;
        this._world.defaultMaterial.restitution = mat.restitution;
        if (CannonShape.idToMaterial[mat.id] != null) {
            CannonShape.idToMaterial[mat.id] = this._world.defaultMaterial;
        }
    }

    setAllowSleep (v: boolean): void {
        this._world.allowSleep = v;
    }

    setGravity (gravity: IVec3Like): void {
        Vec3.copy(this._world.gravity, gravity);
    }

    // get defaultContactMaterial () {
    //     return this._defaultContactMaterial;
    // }

    readonly bodies: CannonSharedBody[] = [];
    readonly constraints: CannonConstraint[] = [];

    private _world: CANNON.World;
    static readonly rayResult = new CANNON.RaycastResult();

    private _debugLineCount = 0;
    private _MAX_DEBUG_LINE_COUNT = 16384;
    private _debugDrawFlags = EPhysicsDrawFlags.NONE;
    private _debugConstraintSize = 0.3;
    private _aabbColor = new Color(0, 255, 255, 255);
    private _wireframeColor = new Color(255, 0, 255, 255);

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

    sweepBox (
        worldRay: geometry.Ray,
        halfExtent: IVec3Like,
        orientation: IQuatLike,
        options: IRaycastOptions,
        pool: RecyclePool<PhysicsRayResult>,
        results: PhysicsRayResult[],
    ): boolean {
        warnID(9641);
        return false;
    }

    sweepBoxClosest (
        worldRay: geometry.Ray,
        halfExtent: IVec3Like,
        orientation: IQuatLike,
        options: IRaycastOptions,
        result: PhysicsRayResult,
    ): boolean {
        warnID(9641);
        return false;
    }

    sweepSphere (
        worldRay: geometry.Ray,
        radius: number,
        options: IRaycastOptions,
        pool: RecyclePool<PhysicsRayResult>,
        results: PhysicsRayResult[],
    ): boolean {
        warnID(9641);
        return false;
    }

    sweepSphereClosest (
        worldRay: geometry.Ray,
        radius: number,
        options: IRaycastOptions,
        result: PhysicsRayResult,
    ): boolean {
        warnID(9641);
        return false;
    }

    sweepCapsule (
        worldRay: geometry.Ray,
        radius: number,
        height: number,
        orientation: IQuatLike,
        options: IRaycastOptions,
        pool: RecyclePool<PhysicsRayResult>,
        results: PhysicsRayResult[],
    ): boolean {
        warnID(9641);
        return false;
    }

    sweepCapsuleClosest (
        worldRay: geometry.Ray,
        radius: number,
        height: number,
        orientation: IQuatLike,
        options: IRaycastOptions,
        result: PhysicsRayResult,
    ): boolean {
        warnID(9641);
        return false;
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

    step (deltaTime: number, timeSinceLastCalled?: number, maxSubStep?: number): void {
        if (this.bodies.length === 0) return;
        this._world.step(deltaTime, timeSinceLastCalled, maxSubStep);

        // sync physics to scene
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncPhysicsToScene();
        }

        this._debugDraw();
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

    addSharedBody (sharedBody: CannonSharedBody): void {
        const i = this.bodies.indexOf(sharedBody);
        if (i < 0) {
            this.bodies.push(sharedBody);
            this._world.addBody(sharedBody.body);
        }
    }

    removeSharedBody (sharedBody: CannonSharedBody): void {
        const i = this.bodies.indexOf(sharedBody);
        if (i >= 0) {
            js.array.fastRemoveAt(this.bodies, i);
            this._world.remove(sharedBody.body);
        }
    }

    //  addContactMaterial (contactMaterial: ContactMaterial) {
    //     this._cannonWorld.addContactMaterial(contactMaterial._getImpl());
    // }

    addConstraint (constraint: CannonConstraint): void {
        const i = this.constraints.indexOf(constraint);
        if (i < 0) {
            this.constraints.push(constraint);
            this._world.addConstraint(constraint.impl);
        }
    }

    removeConstraint (constraint: CannonConstraint): void {
        const i = this.constraints.indexOf(constraint);
        if (i >= 0) {
            js.array.fastRemoveAt(this.constraints, i);
            this._world.removeConstraint(constraint.impl);
        }
    }

    get debugDrawFlags (): EPhysicsDrawFlags {
        return this._debugDrawFlags;
    }

    set debugDrawFlags (v: EPhysicsDrawFlags) {
        this._debugDrawFlags = v;
    }

    get debugDrawConstraintSize (): number {
        return this._debugConstraintSize;
    }

    set debugDrawConstraintSize (v) {
        this._debugConstraintSize = v;
    }

    private _getDebugRenderer (): GeometryRenderer|null {
        const cameras = director.root!.mainWindow?.cameras;
        if (!cameras) return null;
        if (cameras.length === 0) return null;
        if (!cameras[0]) return null;
        cameras[0].initGeometryRenderer();

        return cameras[0].geometryRenderer;
    }

    private _debugDraw (): void {
        const debugRenderer = this._getDebugRenderer();
        if (!debugRenderer) return;

        this._debugLineCount = 0;
        if (this._debugDrawFlags & EPhysicsDrawFlags.AABB) {
            for (let i = 0; i < this.bodies.length; i++) {
                const body = this.bodies[i];
                for (let j = 0; j < body.wrappedShapes.length; j++) {
                    const shape = body.wrappedShapes[j];
                    if (this._debugLineCount + AABB_LINE_COUNT < this._MAX_DEBUG_LINE_COUNT) {
                        this._debugLineCount += AABB_LINE_COUNT;
                        shape.getAABB(aabbTemp);
                        debugRenderer.addBoundingBox(aabbTemp, this._aabbColor);
                    }
                }
            }
        }
    }
}

const from = new CANNON.Vec3();
const to = new CANNON.Vec3();
function setupFromAndTo (worldRay: geometry.Ray, distance: number): void {
    Vec3.copy(from, worldRay.o);
    worldRay.computeHit(to, distance);
}

const raycastOpt: CANNON.IRaycastOptions = {
    checkCollisionResponse: false,
    collisionFilterGroup: -1,
    collisionFilterMask: -1,
    skipBackfaces: true,
} as any;
