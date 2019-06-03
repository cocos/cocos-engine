import { Vec3 } from '../../../core';
import { AfterStepCallback, BeforeStepCallback, ICollisionEvent, IRaycastOptions, PhysicsWorldBase, RigidBodyBase } from '../api';
import { RaycastResult } from '../raycast-result';
import { BuiltInBody } from './builtin-body';
import { ArrayCollisionMatrix } from './utils/array-collision-matrix';

/**
 * Built-in collision system, intended for use as a
 * efficient discrete collision detector,
 * not a full physical simulator
 */
export class BuiltInWorld implements PhysicsWorldBase {
  private _bodies: RigidBodyBase[] = [];
  private _customBeforeStepListener: BeforeStepCallback[] = [];
  private _customAfterStepListener: AfterStepCallback[] = [];

  /** 碰撞矩阵 */
  private _collisionMatrix: ArrayCollisionMatrix = new ArrayCollisionMatrix();
  /** 上一次的碰撞矩阵 */
  // private _preCollisionMatrix: ArrayCollisionMatrix = new ArrayCollisionMatrix();

  constructor () {
  }
  public step (deltaTime: number): void {
    this._customBeforeStepListener.forEach((fx) => fx());

    /** collision detection */
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this._bodies.length; i++) {
      const bodyA = this._bodies[i] as BuiltInBody;
      // tslint:disable-next-line:prefer-for-of
      for (let j = i + 1; j < this._bodies.length; j++) {
        const bodyB = this._bodies[j] as BuiltInBody;

        // first, Check collision filter masks
        if ((bodyA.collisionFilterGroup & bodyB.collisionFilterMask) === 0 ||
          (bodyB.collisionFilterGroup & bodyA.collisionFilterMask) === 0) {
          continue;
        }

        if (bodyA.intersects(bodyB)) {
          const event: ICollisionEvent = {
            source: bodyA,
            target: bodyB,
          };
          if (this._collisionMatrix.get(bodyA.id, bodyB.id)) {
            // TODO: 触发Stay
            bodyA.onTrigger('onCollisionStay', event);
            bodyB.onTrigger('onCollisionStay', event);
          } else {
            this._collisionMatrix.set(bodyA.id, bodyB.id, true);
            /** 是第一次 */ // TODO: 触发Enter
            bodyA.onTrigger('onCollisionEnter', event);
            bodyB.onTrigger('onCollisionEnter', event);
          }
        } else {
          if (this._collisionMatrix.get(bodyA.id, bodyB.id)) {
            // TODO: 触发Exiter
            const event: ICollisionEvent = {
              source: bodyA,
              target: bodyB,
            };
            bodyA.onTrigger('onCollisionExit', event);
            bodyB.onTrigger('onCollisionExit', event);
          }

          this._collisionMatrix.set(bodyA.id, bodyB.id, false);
        }

      }

      this._customAfterStepListener.forEach((fx) => fx());
    }

    /** 执行 after step */
    this._customAfterStepListener.forEach((fx) => fx());
  }
  public addBody (body: RigidBodyBase) {
    this._bodies.push(body);
  }
  public removeBody (body: RigidBodyBase) {
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
