import { Vec3 } from '../../../core';
import { AfterStepCallback, BeforeStepCallback, IRaycastOptions, PhysicsWorldBase, RigidBodyBase } from '../api';
import { RaycastResult } from '../raycast-result';
import { BuiltInBody } from './built-in-body';

/**
 * Built-in collision system, intended for use as a
 * efficient discrete collision detector,
 * not a full physical simulator
 */
export class BuiltInWorld implements PhysicsWorldBase {
  private _bodies: RigidBodyBase[] = [];
  private _customBeforeStepListener: BeforeStepCallback[] = [];
  private _customAfterStepListener: AfterStepCallback[] = [];
  constructor () {
  }
  public step (deltaTime: number): void {
    /** 执行 before step */
    this._customBeforeStepListener.forEach((fx) => fx());

    /** 进行物理检测 */
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this._bodies.length; i++) {
      const bodyA = this._bodies[i] as BuiltInBody;
      // tslint:disable-next-line:prefer-for-of
      for (let j = i + 1; j < this._bodies.length; j++) {
        const bodyB = this._bodies[j] as BuiltInBody;

        // TODO: 判断是否碰撞
        if ((bodyA.collisionFilterGroup & bodyB.collisionFilterMask) === 0 ||
          (bodyB.collisionFilterGroup & bodyA.collisionFilterMask) === 0) {
          continue;
        }

        bodyA.intersects(bodyB);
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
