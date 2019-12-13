import CANNON from '@cocos/cannon';
import { Vec3 } from '../../core/math';
import { fillRaycastResult, toCannonRaycastOptions } from './cannon-util';
import { CannonConstraint } from './constraint/cannon-constraint';
import { CannonShape } from './shapes/cannon-shape';
import { ray } from '../../core/geom-utils';
import { RecyclePool, Node } from '../../core';
import { CannonSharedBody } from './cannon-shared-body';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { PhysicMaterial, PhysicsRayResult } from '../framework';
export class CannonWorld implements IPhysicsWorld {

    get world () {
        return this._world;
    }

    set defaultMaterial (mat: PhysicMaterial) {
        this._world.defaultMaterial.friction = mat.friction;
        this._world.defaultMaterial.restitution = mat.restitution;
        if (CannonShape.idToMaterial[mat._uuid] != null) {
            CannonShape.idToMaterial[mat._uuid] = this._world.defaultMaterial;
        }
    }

    set allowSleep (v: boolean) {
        this._world.allowSleep = v;
    }

    set gravity (gravity: Vec3) {
        Vec3.copy(this._world.gravity, gravity);
    }

    // get defaultContactMaterial () {
    //     return this._defaultContactMaterial;
    // }

    readonly bodies: CannonSharedBody[] = [];

    private _world: CANNON.World;
    private _raycastResult = new CANNON.RaycastResult();

    constructor () {
        this._world = new CANNON.World();
        this._world.broadphase = new CANNON.NaiveBroadphase();
    }

    step (deltaTime: number, timeSinceLastCalled?: number, maxSubStep?: number) {
        // sync scene to physics
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncSceneToPhysics();
        }

        this._world.step(deltaTime, timeSinceLastCalled, maxSubStep);

        // sync physics to scene
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncPhysicsToScene();
        }

        this._world.emitTriggeredEvents();
        this._world.emitCollisionEvents();
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
        this._world.addConstraint(constraint.impl);
    }

    removeConstraint (constraint: CannonConstraint) {
        this._world.removeConstraint(constraint.impl);
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
    'skipBackFaces': false
}