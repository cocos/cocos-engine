/**
 * @hidden
 */

import Ammo from 'ammo.js';
import { Quat, Vec3 } from '../../core/math';
import { Node } from '../../core/scene-graph/node';
import { AmmoDebugger } from './ammo-debugger';
import {
    AfterStepCallback, BeforeStepCallback,
    BoxShapeBase,
    ConstraintBase, DistanceConstraintBase,
    ICollisionCallback, ICollisionEvent,
    ICreateBodyOptions, IDistanceConstraintOptions,
    ILockConstraintOptions,
    IPointToPointConstraintOptions,
    IRaycastOptions, LockConstraintBase, PhysicsWorldBase,
    PointToPointConstraintBase, RigidBodyBase, ShapeBase, SphereShapeBase
} from '../api';
import { RaycastResult } from '../raycast-result';
import { director } from '../../core/director';

export class CollisionEvent {
    get target () {
        return this._target!;
    }

    get position () {
        return this._position;
    }

    get targetPosition () {
        return this._target;
    }

    get normal () {
        return this._normal;
    }

    get targetNormal () {
        return this._targetNormal;
    }

    public _normal: Vec3 = new Vec3();

    public _targetNormal: Vec3 = new Vec3();

    public _position: Vec3 = new Vec3();

    public _targetPosition: Vec3 = new Vec3();

    public _target: Node | null = null;

    public _swap (sourceNode: Node) {
        this._target = sourceNode;

        const p = this._position;
        this._position = this._targetPosition;
        this._targetPosition = p;

        const n = this._normal;
        this._normal = this._targetNormal;
        this._targetNormal = n;
    }
}

interface ICollisionState {
    valid: boolean;
}

interface ICollisionTriple {
    indexA: number;
    indexB: number;
    state: ICollisionState;
}

class CollisionStateManager {
    public static makeQuery (bodyIndexA: number, bodyIndexB: number) {
        return bodyIndexA + bodyIndexB;
    }

    private _map: Map<number, ICollisionTriple[]>;

    constructor () {
        this._map = new Map();
    }

    public query (bodyIndexA: number, bodyIndexB: number) {
        const hash = bodyIndexA + bodyIndexB;
        const triples = this._map.get(hash);
        if (!triples) {
            return undefined;
        } else {
            const triple = this._findTriple(triples, bodyIndexA, bodyIndexB);
            if (!triple) {
                return undefined;
            } else {
                return triple.state;
            }
        }
    }

    public emplace (bodyIndexA: number, bodyIndexB: number, state: ICollisionState) {
        const hash = bodyIndexA + bodyIndexB;
        let triples = this._map.get(hash);
        if (!triples) {
            triples = new Array();
            this._map.set(hash, triples);
        }
        const triple = this._findTriple(triples, bodyIndexA, bodyIndexB);
        if (triple) {
            return triple.state = state;
        } else {
            triples.push({
                indexA: bodyIndexA,
                indexB: bodyIndexB,
                state,
            });
        }
    }

    public invalidateAll () {
        this._map.forEach((triples) => triples.forEach((triple) => triple.state.valid = false));
    }

    public clear () {
        const emptyKeys: number[] = [];
        this._map.forEach((triples, key) => {
            const validTriples = triples.filter((triple) => triple.state.valid);
            if (validTriples.length === 0) {
                emptyKeys.push(key);
            } else {
                this._map.set(key, validTriples);
            }
        });
        emptyKeys.forEach((emptyKey) => {
            this._map.delete(emptyKey);
        });
    }

    private _findTriple (triples: ICollisionTriple[], bodyIndexA: number, bodyIndexB: number) {
        return triples.find((triple) =>
            (triple.indexA === bodyIndexA && triple.indexB === bodyIndexB) ||
            (triple.indexA === bodyIndexB && triple.indexB === bodyIndexA));
    }
}


enum TransformSource {
    Scene,
    Phycis,
}

interface IBufferedOptional<Storage> {
    hasValue: boolean;
    storage: Storage;
}


export function vec3CreatorToAmmo (ammoVec3: Ammo.btVector3, ccVec3: Vec3) {
    ammoVec3.setX(ccVec3.x);
    ammoVec3.setY(ccVec3.y);
    ammoVec3.setZ(ccVec3.z);
}

export function vec3AmmoToCreator (ccVec3: Vec3, ammoVec3: Ammo.btVector3) {
    ccVec3.x = ammoVec3.x();
    ccVec3.y = ammoVec3.y();
    ccVec3.z = ammoVec3.z();
}

export function quatCreatorToAmmo (ammoQuat: Ammo.btQuaternion, ccQuat: Quat) {
    ammoQuat.setX(ccQuat.x);
    ammoQuat.setY(ccQuat.y);
    ammoQuat.setZ(ccQuat.z);
    ammoQuat.setW(ccQuat.w);
}

export function quatAmmoToCreator (ccQuat: Quat, ammoQuat: Ammo.btQuaternion) {
    ccQuat.x = ammoQuat.x();
    ccQuat.y = ammoQuat.y();
    ccQuat.z = ammoQuat.z();
    ccQuat.w = ammoQuat.w();
}

function maxComponent (v: Vec3) {
    return Math.max(v.x, Math.max(v.y, v.z));
}

function toString (value: Vec3 | Quat): string {
    if (value instanceof Vec3) {
        return `(x: ${value.x}, y: ${value.y}, z: ${value.z})`;
    } else if (value instanceof Quat) {
        if (Quat.strictEquals(value, new Quat())) {
            return `<No-rotation>`;
        } else {
            return `(x: ${value.x}, y: ${value.y}, z: ${value.z}, w: ${value.w})`;
        }
    }
    return '';
}
