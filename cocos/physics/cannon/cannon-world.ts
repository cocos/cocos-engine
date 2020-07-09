import CANNON from '@cocos/cannon';
import { Vec3, Quat } from '../../core/math';
import { fillRaycastResult, toCannonRaycastOptions } from './cannon-util';
import { CannonConstraint } from './constraints/cannon-constraint';
import { CannonShape } from './shapes/cannon-shape';
import { ray } from '../../core/geometry';
import { RecyclePool, Node } from '../../core';
import { CannonSharedBody } from './cannon-shared-body';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { PhysicMaterial, PhysicsRayResult } from '../framework';
import { IVec3Like } from '../../core/math/type-define';
export class CannonWorld implements IPhysicsWorld {

    get impl () {
        return this._world;
    }

    setDefaultMaterial (mat: PhysicMaterial) {
        this._world.defaultMaterial.friction = mat.friction;
        this._world.defaultMaterial.restitution = mat.restitution;
        if (CannonShape.idToMaterial[mat._uuid] != null) {
            CannonShape.idToMaterial[mat._uuid] = this._world.defaultMaterial;
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
    private _raycastResult = new CANNON.RaycastResult();

    constructor () {
        this._world = new CANNON.World();
        this._world.broadphase = new CANNON.NaiveBroadphase();
        this._world.solver.iterations = 10;
        (this._world.solver as any).tolerance = 0.0001;
        this._world.defaultContactMaterial.contactEquationStiffness = 1000000;
        this._world.defaultContactMaterial.frictionEquationStiffness = 1000000;
        this._world.defaultContactMaterial.contactEquationRelaxation = 3;
        this._world.defaultContactMaterial.frictionEquationRelaxation = 3;

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

    step (deltaTime: number, timeSinceLastCalled?: number, maxSubStep?: number) {
        if (this.bodies.length == 0) return;
        this._world.step(deltaTime, timeSinceLastCalled, maxSubStep);

        // sync physics to scene
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncPhysicsToScene();
        }
    }

    raycastClosest (worldRay: ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        setupFromAndTo(worldRay, options.maxDistance);
        toCannonRaycastOptions(raycastOpt, options);
        const hit = this._world.raycastClosest(from, to, raycastOpt, this._raycastResult);
        if (hit) {
            fillRaycastResult(result, this._raycastResult);
        }
        return hit;
    }

    raycast (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
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
            this.bodies.splice(i, 1);
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
            this.constraints.splice(i, 1);
            this._world.removeConstraint(constraint.impl);
        }
    }

    updateCollisionMatrix (group: number, mask: number) {
        for (let i = 0; i < this.bodies.length; i++) {
            const b = this.bodies[i].body;
            if (b.collisionFilterGroup == group) {
                b.collisionFilterMask = mask;
            }
        }
    }
}

const from = new CANNON.Vec3();
const to = new CANNON.Vec3();
function setupFromAndTo (worldRay: ray, distance: number) {
    Vec3.copy(from, worldRay.o);
    worldRay.computeHit(to, distance);
}

const raycastOpt: CANNON.IRaycastOptions = {
    'checkCollisionResponse': false,
    'collisionFilterGroup': -1,
    'collisionFilterMask': -1,
    'skipBackFaces': true
}