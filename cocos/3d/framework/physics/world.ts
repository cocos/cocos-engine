import CANNON from 'cannon';
import { RigidBody, DataFlow, PhysicsShape } from './body';
import { getWrap, setWrap } from './util';

export interface RaycastOptions {
    collisionFilterMask?: number;
    collisionFilterGroup?: number;
    queryTriggerInteraction?: boolean;
}

export class RaycastResult {
    public _cannonResult: CANNON.RaycastResult = new CANNON.RaycastResult();

    public _update() {
        
    }

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
        return getWrap<RigidBody>(this._cannonResult.body);
    }
}

export class PhysicsWorld {
    private _cannonWorld: CANNON.World;
    private _bodys: Set<RigidBody>;

    constructor() {
        this._cannonWorld = new CANNON.World();
        setWrap<PhysicsWorld>(this._cannonWorld, this);
        this._cannonWorld.gravity.set(0, -9.82, 0);
        this._bodys = new Set();
    }

    public addBody(body: RigidBody) {
        this._cannonWorld.addBody(body._getCannonBody());
        body._onAdded();
    }

    public removeBody(body: RigidBody) {
        body._onRemoved();
        this._cannonWorld.remove(body._getCannonBody());
    }

    public step(deltaTime: number) {
        this._bodys.forEach((physicalBody) => {
            if (physicalBody.dataFlow === DataFlow.PUSHING) {
                physicalBody.push();
            }
        });

        this._cannonWorld.step(deltaTime);
    }

    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    public raycastClosest(from: cc.Vec3, to: cc.Vec3, options: RaycastOptions, result: RaycastResult): boolean {
        const hit = (this._cannonWorld as any).raycastClosest(from, to, toCannonOptions(options), result._cannonResult);
        if (hit) {
            result._update();
        }
        return hit;
    }

    /**
     * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
     * @return True if any body was hit.
     */
    public raycastAny(from: cc.Vec3, to: cc.Vec3, options: RaycastOptions, result: RaycastResult): boolean {
        const hit = (this._cannonWorld as any).raycastAny(from, to, toCannonOptions(options), result._cannonResult);
        if (hit) {
            result._update();
        }
        return hit;
    };

    /**
     * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
     * @return True if any body was hit.
     */
    public raycastAll(from: cc.Vec3, to: cc.Vec3, options: RaycastOptions, callback: (result: RaycastResult) => void): boolean {
        return (this._cannonWorld as any).raycastAll(from, to, toCannonOptions(options), (cannonResult: CANNON.RaycastResult) => {
            const result = new RaycastResult();
            result._cannonResult = cannonResult;
            result._update();
            callback(result);
        });
    };
}

interface CANNONRaycastOptions {
    collisionFilterMask?: number;
    collisionFilterGroup?: number;
    checkCollisionResponse?: boolean;
    skipBackfaces?: boolean;
}

function toCannonOptions(options: RaycastOptions): CANNONRaycastOptions {
    return {
        collisionFilterMask: options.collisionFilterMask === undefined ? -1 : options.collisionFilterMask,
        collisionFilterGroup: options.collisionFilterGroup === undefined ? -1 : options.collisionFilterGroup,
        checkCollisionResponse: options.queryTriggerInteraction === undefined ? true : options.queryTriggerInteraction
    };
}