import CANNON from 'cannon';
import { PhysicsMaterial } from '../../assets/physics/material';
import { DataFlow, PhysicsBody, PhysicsShape } from './body';
import { ContactMaterial } from './contact-material';
import { getWrap, setWrap, toCannonOptions } from './util';
import Vec3 from '../../../core/value-types';

export interface RaycastOptions {
    collisionFilterMask?: number;
    collisionFilterGroup?: number;
    queryTriggerInteraction?: boolean;
}

export class RaycastResult {
    public _cannonResult: CANNON.RaycastResult = new CANNON.RaycastResult();

    get hit() {
        return this._cannonResult.hasHit;
    }

    get hitPoint() {
        return this._cannonResult.hitPointWorld;
    }

    get distance() {
        return this._cannonResult.distance;
    }

    get shape() {
        return getWrap<PhysicsShape>(this._cannonResult.shape);
    }

    get body() {
        return getWrap<PhysicsBody>(this._cannonResult.body);
    }
}

export class PhysicsWorld {
    private _cannonWorld: CANNON.World;
    private _defaultMaterial: PhysicsMaterial;
    private _defaultContactMaterial: ContactMaterial;
    private _bodys: Set<PhysicsBody>;
    private _beforeStepEvent: CANNON.IEvent = {
        type: 'beforeStep',
    };

    constructor() {
        this._defaultMaterial = new PhysicsMaterial();
        this._defaultContactMaterial = new ContactMaterial(
            this._defaultMaterial, this._defaultMaterial, { friction: 0.3, restitution: 0.0 });

        this._cannonWorld = new CANNON.World();
        setWrap<PhysicsWorld>(this._cannonWorld, this);
        this._cannonWorld.gravity.set(0, -9.81, 0);
        this._cannonWorld.broadphase = new CANNON.NaiveBroadphase();
        this._cannonWorld.defaultMaterial = this._defaultMaterial._getImpl();
        this._cannonWorld.defaultContactMaterial = this._defaultContactMaterial._getImpl();
        this._bodys = new Set();
    }

    get defaultContactMaterial() {
        return this._defaultContactMaterial;
    }

    public addBody(body: PhysicsBody) {
        this._bodys.add(body);
        this._cannonWorld.addBody(body._getCannonBody());
        body._onAdded();
    }

    public removeBody(body: PhysicsBody) {
        body._onRemoved();
        this._cannonWorld.remove(body._getCannonBody());
        this._bodys.delete(body);
    }

    public step(deltaTime: number) {
        this._cannonWorld.dispatchEvent(this._beforeStepEvent);
        this._cannonWorld.step(deltaTime);
    }

    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    public raycastClosest(from: Vec3, to: Vec3, options: RaycastOptions, result: RaycastResult): boolean {
        const hit = (this._cannonWorld as any).raycastClosest(from, to, toCannonRaycastOptions(options), result._cannonResult);
        return hit;
    }

    /**
     * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
     * @return True if any body was hit.
     */
    public raycastAny(from: Vec3, to: Vec3, options: RaycastOptions, result: RaycastResult): boolean {
        const hit = (this._cannonWorld as any).raycastAny(from, to, toCannonRaycastOptions(options), result._cannonResult);
        return hit;
    }

    /**
     * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
     * @return True if any body was hit.
     */
    public raycastAll(from: Vec3, to: Vec3, options: RaycastOptions, callback: (result: RaycastResult) => void): boolean {
        return (this._cannonWorld as any).raycastAll(from, to, toCannonRaycastOptions(options), (cannonResult: CANNON.RaycastResult) => {
            const result = new RaycastResult();
            result._cannonResult = cannonResult;
            callback(result);
        });
    }

    public addContactMaterial(contactMaterial: ContactMaterial) {
        this._cannonWorld.addContactMaterial(contactMaterial._getImpl());
    }
}

interface CANNONRaycastOptions {
    collisionFilterMask?: number;
    collisionFilterGroup?: number;
    checkCollisionResponse?: boolean;
    skipBackfaces?: boolean;
}

function toCannonRaycastOptions(options: RaycastOptions): CANNONRaycastOptions {
    return toCannonOptions(options, {
        queryTriggerInteraction: 'checkCollisionResponse',
    });
}
