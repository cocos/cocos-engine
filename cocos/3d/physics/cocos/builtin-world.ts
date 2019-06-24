import { Vec3 } from '../../../core/value-types';
import { AfterStepCallback, BeforeStepCallback, BuiltInRigidBodyBase, IRaycastOptions,
    ITriggerEventType, PhysicsWorldBase, RigidBodyBase, ShapeBase } from '../api';
import { RaycastResult } from '../raycast-result';
import { getWrap } from '../util';
import { BuiltInBody } from './builtin-body';
import { BuiltinShape } from './shapes/builtin-shape';
import { ArrayCollisionMatrix } from './utils/array-collision-matrix';

/**
 * Built-in collision system, intended for use as a
 * efficient discrete collision detector,
 * not a full physical simulator
 */
export class BuiltInWorld implements PhysicsWorldBase {

    private _bodies: BuiltInRigidBodyBase[] = [];

    private _customBeforeStepListener: BeforeStepCallback[] = [];

    private _customAfterStepListener: AfterStepCallback[] = [];

    private _collisionMatrix: ArrayCollisionMatrix = new ArrayCollisionMatrix();

    private _collisionMatrixPrev: ArrayCollisionMatrix = new ArrayCollisionMatrix();

    private _shapeArr: BuiltinShape[] = [];

    public get shapeArr () {
        return this._shapeArr;
    }

    private _shapeArrOld: BuiltinShape[] = [];

    public get shapeArrOld () {
        return this._shapeArrOld;
    }

    constructor () {
    }

    public step (deltaTime: number): void {

        // emit before step
        this._customBeforeStepListener.forEach((fx) => fx());

        // store and reset collsion array
        this._shapeArrOld = this._shapeArr.slice();
        this._shapeArr.length = 0;

        // collision detection
        for (let i = 0; i < this._bodies.length; i++) {
            const bodyA = this._bodies[i] as BuiltInBody;
            for (let j = i + 1; j < this._bodies.length; j++) {
                const bodyB = this._bodies[j] as BuiltInBody;

                // first, Check collision filter masks
                if ((bodyA.collisionFilterGroup & bodyB.collisionFilterMask) === 0 ||
                    (bodyB.collisionFilterGroup & bodyA.collisionFilterMask) === 0) {
                    continue;
                }
                bodyA.intersects(bodyB);
            }
        }

        // emit trigger event
        let shapeA: BuiltinShape;
        let shapeB: BuiltinShape;
        for (let i = 0; i < this._shapeArr.length; i += 2) {
            shapeA = this._shapeArr[i];
            shapeB = this._shapeArr[i + 1];

            TriggerEventObject.selfCollider = shapeA.getUserData();
            TriggerEventObject.otherCollider = shapeB.getUserData();
            // TriggerEventObject.selfRigidBody = shapeA.body!.getUserData();
            // TriggerEventObject.otherRigidBody = shapeB.body!.getUserData();

            this._collisionMatrix.set(shapeA.id, shapeB.id, true);

            if (this._collisionMatrixPrev.get(shapeA.id, shapeB.id)) {
                // emit stay
                 TriggerEventObject.type = 'onTriggerStay';
            } else {
                // first trigger, emit enter
                 TriggerEventObject.type = 'onTriggerEnter';
            }
            shapeA.onTrigger(TriggerEventObject);

            TriggerEventObject.selfCollider = shapeB.getUserData();
            TriggerEventObject.otherCollider = shapeA.getUserData();
            // TriggerEventObject.selfRigidBody = shapeB.body!.getUserData();
            // TriggerEventObject.otherRigidBody = shapeA.body!.getUserData();

            shapeB.onTrigger(TriggerEventObject);
        }

        for (let i = 0; i < this._shapeArrOld.length; i += 2) {
            shapeA = this._shapeArrOld[i];
            shapeB = this._shapeArrOld[i + 1];

            if (this._collisionMatrixPrev.get(shapeA.id, shapeB.id)) {
                if (!this._collisionMatrix.get(shapeA.id, shapeB.id)) {
                    // emit exit
                    TriggerEventObject.type = 'onTriggerExit';
                    TriggerEventObject.selfCollider = shapeA.getUserData();
                    TriggerEventObject.otherCollider = shapeB.getUserData();
                    // TriggerEventObject.selfRigidBody = shapeA.body!.getUserData();
                    // TriggerEventObject.otherRigidBody = shapeB.body!.getUserData();

                    shapeA.onTrigger(TriggerEventObject);

                    TriggerEventObject.selfCollider = shapeB.getUserData();
                    TriggerEventObject.otherCollider = shapeA.getUserData();
                    // TriggerEventObject.selfRigidBody = shapeB.body!.getUserData();
                    // TriggerEventObject.otherRigidBody = shapeA.body!.getUserData();

                    shapeB.onTrigger(TriggerEventObject);

                    this._collisionMatrix.set(shapeA.id, shapeB.id, false);
                }
            }
        }

        this._collisionMatrixPrev.matrix = this._collisionMatrix.matrix.slice();
        this._collisionMatrix.reset();

        // emit after step
        this._customAfterStepListener.forEach((fx) => fx());
    }

    public addBody (body: BuiltInRigidBodyBase) {
        this._bodies.push(body);
    }

    public removeBody (body: BuiltInRigidBodyBase) {
        const i = this._bodies.indexOf(body);
        if (i >= 0) {
            this._bodies.splice(i, 1);
        }
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
        return false;
    }

    public raycastAny (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean {
        return false;
    }

    public raycastAll (from: Vec3, to: Vec3, options: IRaycastOptions, callback: (result: RaycastResult) => void): boolean {
        return false;
    }

}

const TriggerEventObject = {
    type: '' as unknown as ITriggerEventType,
    selfCollider: null,
    otherCollider: null,
    // selfRigidBody: null,
    // otherRigidBody: null,
};
