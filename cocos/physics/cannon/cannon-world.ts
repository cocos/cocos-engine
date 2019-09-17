import CANNON from 'cannon';
import { Vec3 } from '../../core/math';
import { PhysicsRayResult } from '../physics-ray-result';
import { setWrap } from '../util';
import { AfterStepCallback, BeforeStepCallback, IRaycastOptions, PhysicsWorldBase } from './../api';
import { fillRaycastResult, toCannonRaycastOptions } from './cannon-util';
import { CannonConstraint } from './constraint/cannon-constraint';
import { CannonShape } from './shapes/cannon-shape';
import { PhysicMaterial } from '../assets/physic-material';
import { ray } from '../../core/geom-utils';
import { RecyclePool } from '../../core';

export class CannonWorld implements PhysicsWorldBase {

    get impl () {
        return this._world;
    }
    private _world: CANNON.World;
    private _customBeforeStepListener: BeforeStepCallback[] = [];
    private _customAfterStepListener: AfterStepCallback[] = [];
    private _raycastResult = new CANNON.RaycastResult();

    constructor () {
        this._world = new CANNON.World();
        setWrap<PhysicsWorldBase>(this._world, this);
        this._world.broadphase = new CANNON.NaiveBroadphase();
    }

    // public get defaultMaterial () {
    //     return this.defaultMaterial;
    // }

    public set defaultMaterial (mat: PhysicMaterial) {
        this._world.defaultMaterial.friction = mat.friction;
        this._world.defaultMaterial.restitution = mat.restitution;
        if (CannonShape.idToMaterial[mat._uuid] != null) {
            CannonShape.idToMaterial[mat._uuid] = this._world.defaultMaterial;
        }
    }

    public getAllowSleep (): boolean {
        return this._world.allowSleep;
    }
    public setAllowSleep (v: boolean): void {
        this._world.allowSleep = v;
    }

    public setGravity (gravity: Vec3): void {
        Vec3.copy(this._world.gravity, gravity);
    }

    public getGravity (out: Vec3): void {
        Vec3.copy(out, this._world.gravity);
    }

    public destroy () {
    }

    // get defaultContactMaterial () {
    //     return this._defaultContactMaterial;
    // }

    public step (deltaTime: number, time?: number, maxSubStep?: number) {
        this._callCustomBeforeSteps();
        this._world.step(deltaTime, time, maxSubStep);
        this._callCustomAfterSteps();
    }

    public addBeforeStep (cb: BeforeStepCallback) {
        this._customBeforeStepListener.push(cb);
    }

    public removeBeforeStep (cb: BeforeStepCallback) {
        const i = this._customBeforeStepListener.indexOf(cb);
        if (i < 0) {
            return;
        }
        this._customBeforeStepListener.splice(i, 1);
    }

    public addAfterStep (cb: AfterStepCallback) {
        this._customAfterStepListener.push(cb);
    }

    public removeAfterStep (cb: AfterStepCallback) {
        const i = this._customAfterStepListener.indexOf(cb);
        if (i < 0) {
            return;
        }
        this._customAfterStepListener.splice(i, 1);
    }

    public raycastClosest (worldRay: ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        setupFromAndTo(worldRay, options.maxDistance);
        toCannonRaycastOptions(raycastOpt, options);
        const hit = this._world.raycastClosest(from, to, raycastOpt, this._raycastResult);
        if (hit) {
            fillRaycastResult(result, this._raycastResult);
        }
        return hit;
    }

    public raycastAny (worldRay: ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        setupFromAndTo(worldRay, options.maxDistance);
        toCannonRaycastOptions(raycastOpt, options);
        const hit = this._world.raycastAny(from, to, raycastOpt, this._raycastResult);
        if (hit) {
            fillRaycastResult(result, this._raycastResult);
        }
        return hit;
    }

    public raycastAll (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        setupFromAndTo(worldRay, options.maxDistance);
        toCannonRaycastOptions(raycastOpt, options);
        const hit = this._world.raycastAll(from, to, raycastOpt, (result: CANNON.RaycastResult): any => {
            const r = pool.add();
            fillRaycastResult(r, result);
            results.push(r);
        });
        return hit
    }

    // public addContactMaterial (contactMaterial: ContactMaterial) {
    //     this._cannonWorld.addContactMaterial(contactMaterial._getImpl());
    // }

    public addConstraint (constraint: CannonConstraint) {
        this._world.addConstraint(constraint.impl);
    }

    public removeConstraint (constraint: CannonConstraint) {
        this._world.removeConstraint(constraint.impl);
    }

    private _callCustomBeforeSteps () {
        this._customBeforeStepListener.forEach((fx) => fx());
    }

    private _callCustomAfterSteps () {
        this._customAfterStepListener.forEach((fx) => fx());
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