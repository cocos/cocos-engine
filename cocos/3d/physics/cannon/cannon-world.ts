import CANNON from 'cannon';
import { Vec3 } from '../../../core/value-types';
import { RaycastResult } from '../raycast-result';
import { setWrap } from '../util';
import { AfterStepCallback, BeforeStepCallback, IRaycastOptions, PhysicsWorldBase } from './../api';
import { defaultCannonContactMaterial, defaultCannonMaterial } from './cannon-const';
import { fillRaycastResult, toCannonRaycastOptions, toCannonVec3, toCocosVec3 } from './cannon-util';
import { CannonConstraint } from './constraint/cannon-constraint';

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
        this._world.defaultMaterial = defaultCannonMaterial;
        this._world.defaultContactMaterial = defaultCannonContactMaterial;
    }

    public getAllowSleep (): boolean {
        return this._world.allowSleep;
    }
    public setAllowSleep (v: boolean): void {
        this._world.allowSleep = v;
    }

    public setGravity (gravity: Vec3): void {
        this._world.gravity = toCannonVec3(gravity);
    }

    public getGravity (out: Vec3): void {
        toCocosVec3(this._world.gravity, out);
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

    public raycastClosest (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean {
        const hit = (this._world as any).raycastClosest(from, to, toCannonRaycastOptions(options), this._raycastResult);
        if (hit) {
            fillRaycastResult(result, this._raycastResult);
        }
        return hit;
    }

    public raycastAny (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean {
        const hit = (this._world as any).raycastAny(from, to, toCannonRaycastOptions(options), this._raycastResult);
        if (hit) {
            fillRaycastResult(result, this._raycastResult);
        }
        return hit;
    }

    public raycastAll (from: Vec3, to: Vec3, options: IRaycastOptions, callback: (result: RaycastResult) => void): boolean {
        return (this._world as any).raycastAll(from, to, toCannonRaycastOptions(options), (cannonResult: CANNON.RaycastResult) => {
            const result = new RaycastResult();
            fillRaycastResult(result, cannonResult);
            callback(result);
        });
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
