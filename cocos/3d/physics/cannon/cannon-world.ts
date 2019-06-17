import CANNON from 'cannon';
import { Vec3 } from '../../../core/value-types';
import { RaycastResult } from '../raycast-result';
import { setWrap } from '../util';
import { AfterStepCallback, BeforeStepCallback, IRaycastOptions, PhysicsWorldBase } from './../api';
import { defaultCannonContactMaterial, defaultCannonMaterial } from './cannon-const';
import { fillRaycastResult, toCannonRaycastOptions } from './cannon-util';
import { CannonConstraint } from './constraint/cannon-constraint';

export class CannonWorld implements PhysicsWorldBase {
    private _world: CANNON.World;
    private _customBeforeStepListener: BeforeStepCallback[] = [];
    private _customAfterStepListener: AfterStepCallback[] = [];
    private _onCannonPreStepListener: Function;
    private _onCannonPostStepListener: Function;
    private _raycastResult = new CANNON.RaycastResult();
    // private _initedBodys = new Set<CannonRigidBody>();

    constructor () {
        this._world = new CANNON.World();
        setWrap<PhysicsWorldBase>(this._world, this);
        // this._cannonWorld.allowSleep = true;
        this._world.gravity.set(0, -9.81, 0);
        this._world.broadphase = new CANNON.NaiveBroadphase();
        this._world.defaultMaterial = defaultCannonMaterial;
        this._world.defaultContactMaterial = defaultCannonContactMaterial;

        this._onCannonPreStepListener = this._onCannonPreStep.bind(this);
        this._onCannonPostStepListener = this._onCannonPostStep.bind(this);

        this._world.addEventListener('preStep', this._onCannonPreStepListener);
        this._world.addEventListener('postStep', this._onCannonPostStepListener);
    }

    public destroy () {
        this._world.removeEventListener('preStep', this._onCannonPreStepListener);
        this._world.removeEventListener('postStep', this._onCannonPostStepListener);
    }

    get impl () {
        return this._world;
    }

    // get defaultContactMaterial () {
    //     return this._defaultContactMaterial;
    // }

    public step (deltaTime: number) {
        this._callCustomBeforeSteps();

        // const initBodys: CannonRigidBody[] = [];
        // this._cannonWorld.bodies.forEach((b) => {
        //     const body = getWrap<CannonRigidBody>(b);
        //     if (!this._initedBodys.has(body)) {
        //         this._initedBodys.add(body);
        //         initBodys.push(body);
        //     }
        // });
        // if (initBodys.length !== 0) {
        //     console.log(`Frame ${this._cannonWorld.stepnumber} add bodys:\n${initBodys.map((b) => b._devStrinfy()).join('\n')}`);
        // }

        this._world.step(deltaTime);
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

    private _onCannonPreStep () {
        // this._callCustomBeforeSteps();
    }

    private _onCannonPostStep () {
        // this._callCustomAfterStep();
    }

    private _callCustomBeforeSteps () {
        this._customBeforeStepListener.forEach((fx) => fx());
    }

    private _callCustomAfterSteps () {
        this._customAfterStepListener.forEach((fx) => fx());
    }
}
