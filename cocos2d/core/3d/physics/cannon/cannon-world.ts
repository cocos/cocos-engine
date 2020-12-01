/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import CANNON from '../../../../../external/cannon/cannon';
import { fillRaycastResult, toCannonRaycastOptions } from './cannon-util';
import { CannonShape } from './shapes/cannon-shape';
import { CannonSharedBody } from './cannon-shared-body';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { PhysicsMaterial, PhysicsRayResult } from '../framework';
import { clearNodeTransformRecord, clearNodeTransformDirtyFlag } from '../framework/util'

const Vec3 = cc.Vec3;
const fastRemoveAt = cc.js.array.fastRemoveAt;

export class CannonWorld implements IPhysicsWorld {

    get world () {
        return this._world;
    }

    set defaultMaterial (mat: PhysicsMaterial) {
        this._world.defaultMaterial.friction = mat.friction;
        this._world.defaultMaterial.restitution = mat.restitution;
        if (CannonShape.idToMaterial[mat._uuid] != null) {
            CannonShape.idToMaterial[mat._uuid] = this._world.defaultMaterial;
        }
    }

    set allowSleep (v: boolean) {
        this._world.allowSleep = v;
    }

    set gravity (gravity: cc.Vec3) {
        Vec3.copy(this._world.gravity, gravity);
    }

    readonly bodies: CannonSharedBody[] = [];

    private _world: CANNON.World;
    private _raycastResult = new CANNON.RaycastResult();

    constructor () {
        this._world = new CANNON.World();
        this._world.broadphase = new CANNON.NaiveBroadphase();
        this._world.addEventListener("postStep", this.onPostStep.bind(this));
    }

    onPostStep () {
        const p3dm = cc.director.getPhysics3DManager();
        if (p3dm.useFixedDigit) {
            const pd = p3dm.fixDigits.position;
            const rd = p3dm.fixDigits.rotation;
            const bodies = this._world.bodies;
            for (let i = 0; i < bodies.length; i++) {
                const bi = bodies[i];
                if(bi.type != CANNON.Body.STATIC && !bi.isSleeping()){
                    const pos = bi.position;
                    pos.x = parseFloat(pos.x.toFixed(pd));
                    pos.y = parseFloat(pos.y.toFixed(pd));
                    pos.z = parseFloat(pos.z.toFixed(pd));
                    const rot = bi.quaternion;
                    rot.x = parseFloat(rot.x.toFixed(rd));
                    rot.y = parseFloat(rot.y.toFixed(rd));
                    rot.z = parseFloat(rot.z.toFixed(rd));
                    rot.w = parseFloat(rot.w.toFixed(rd));
                    const vel = bi.velocity;
                    vel.x = parseFloat(vel.x.toFixed(pd));
                    vel.y = parseFloat(vel.y.toFixed(pd));
                    vel.z = parseFloat(vel.z.toFixed(pd));
                    const avel = bi.angularVelocity;
                    avel.x = parseFloat(avel.x.toFixed(pd));
                    avel.y = parseFloat(avel.y.toFixed(pd));
                    avel.z = parseFloat(avel.z.toFixed(pd));
                }
            }
        }
    }

    step (deltaTime: number, timeSinceLastCalled?: number, maxSubStep?: number) {
        this.syncSceneToPhysics();
        this._world.step(deltaTime, timeSinceLastCalled, maxSubStep);
        this.syncPhysicsToScene();
        this.emitEvents();
    }

    syncSceneToPhysics () {
        clearNodeTransformRecord();
        // sync scene to physics
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncSceneToPhysics();
        }
        clearNodeTransformDirtyFlag();
    }

    syncPhysicsToScene () {
        // sync physics to scene
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncPhysicsToScene();
        }
    }

    emitEvents () {
        this._world.emitTriggeredEvents();
        this._world.emitCollisionEvents();
    }

    raycastClosest (worldRay: cc.geomUtils.Ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        setupFromAndTo(worldRay, options.maxDistance);
        toCannonRaycastOptions(raycastOpt, options);
        const hit = this._world.raycastClosest(from, to, raycastOpt, this._raycastResult);
        if (hit) {
            fillRaycastResult(result, this._raycastResult);
        }
        return hit;
    }

    raycast (worldRay: cc.geomUtils.Ray, options: IRaycastOptions, pool: cc.RecyclePool, results: PhysicsRayResult[]): boolean {
        setupFromAndTo(worldRay, options.maxDistance);
        toCannonRaycastOptions(raycastOpt, options);
        const hit = this._world.raycastAll(from, to, raycastOpt, (result: CANNON.RaycastResult): any => {
            const r = pool.add();
            fillRaycastResult(r, result);
            results.push(r);
        });
        return hit
    }

    getSharedBody (node: Node): CannonSharedBody {
        return CannonSharedBody.getSharedBody(node, this);
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
            fastRemoveAt(this.bodies, i);
            this._world.remove(sharedBody.body);
        }
    }
}

const from = new CANNON.Vec3();
const to = new CANNON.Vec3();
function setupFromAndTo (worldRay: cc.geomUtils.Ray, distance: number) {
    Vec3.copy(from, worldRay.o);
    worldRay.computeHit(to, distance);
}

const raycastOpt: CANNON.IRaycastOptions = {
    'checkCollisionResponse': false,
    'collisionFilterGroup': -1,
    'collisionFilterMask': -1,
    'skipBackFaces': false
}