import CANNON from 'cannon';
import { Component } from '../../../components/component';
import { Vec3 } from '../../../core/value-types';
import { Node } from '../../../scene-graph/node';
import { PhysicsMaterial } from '../../assets/physics/material';
import { Constraint } from './constraints';
import { ContactMaterial } from './contact-material';
import { DefaultPhysicsMaterial } from './default-material';
import { getWrap, setWrap, toCannonOptions } from './util';

export interface IRaycastOptions {
    collisionFilterMask?: number;
    collisionFilterGroup?: number;
    queryTriggerInteraction?: boolean;
}

export class RaycastResult {
    public _cannonResult: CANNON.RaycastResult = new CANNON.RaycastResult();

    get hit () {
        return this._cannonResult.hasHit;
    }

    get hitPoint () {
        return this._cannonResult.hitPointWorld;
    }

    get distance () {
        return this._cannonResult.distance;
    }

    get shape () {
        return getWrap<Component>(this._cannonResult.shape);
    }

    get body () {
        return getWrap<Node>(this._cannonResult.body);
    }
}
cc.RaycastResult = RaycastResult;

export class PhysicsWorld {
    private _cannonWorld: CANNON.World;
    private _defaultContactMaterial: ContactMaterial;
    private _beforeStepEvent: CANNON.IEvent = {
        type: 'beforeStep',
    };

    constructor () {
        this._defaultContactMaterial = new ContactMaterial(DefaultPhysicsMaterial, DefaultPhysicsMaterial);
        this._defaultContactMaterial.friction = 0;

        this._cannonWorld = new CANNON.World();
        setWrap<PhysicsWorld>(this._cannonWorld, this);
        this._cannonWorld.gravity.set(0, -9.81, 0);
        this._cannonWorld.broadphase = new CANNON.NaiveBroadphase();
        this._cannonWorld.defaultMaterial = DefaultPhysicsMaterial._getImpl();
        this._cannonWorld.defaultContactMaterial = this._defaultContactMaterial._getImpl();
    }

    get defaultContactMaterial () {
        return this._defaultContactMaterial;
    }

    public addBody (body: CANNON.Body) {
        this._cannonWorld.addBody(body);
    }

    public removeBody (body: CANNON.Body) {
        this._cannonWorld.remove(body);
    }

    public step (deltaTime: number) {
        this._cannonWorld.dispatchEvent(this._beforeStepEvent);
        this._cannonWorld.step(deltaTime);
    }

    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    public raycastClosest (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean {
        const hit = (this._cannonWorld as any).raycastClosest(from, to, toCannonRaycastOptions(options), result._cannonResult);
        return hit;
    }

    /**
     * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
     * @return True if any body was hit.
     */
    public raycastAny (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean {
        const hit = (this._cannonWorld as any).raycastAny(from, to, toCannonRaycastOptions(options), result._cannonResult);
        return hit;
    }

    /**
     * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
     * @return True if any body was hit.
     */
    public raycastAll (from: Vec3, to: Vec3, options: IRaycastOptions, callback: (result: RaycastResult) => void): boolean {
        return (this._cannonWorld as any).raycastAll(from, to, toCannonRaycastOptions(options), (cannonResult: CANNON.RaycastResult) => {
            const result = new RaycastResult();
            result._cannonResult = cannonResult;
            callback(result);
        });
    }

    public addContactMaterial (contactMaterial: ContactMaterial) {
        this._cannonWorld.addContactMaterial(contactMaterial._getImpl());
    }

    public addConstraint (constraint: Constraint) {
        this._cannonWorld.addConstraint(constraint._getImpl());
    }

    public removeConstraint (constraint: Constraint) {
        this._cannonWorld.removeConstraint(constraint._getImpl());
    }
}

interface ICANNONRaycastOptions {
    collisionFilterMask?: number;
    collisionFilterGroup?: number;
    checkCollisionResponse?: boolean;
    skipBackfaces?: boolean;
}

function toCannonRaycastOptions (options: IRaycastOptions): ICANNONRaycastOptions {
    return toCannonOptions(options, {
        queryTriggerInteraction: 'checkCollisionResponse',
    });
}
