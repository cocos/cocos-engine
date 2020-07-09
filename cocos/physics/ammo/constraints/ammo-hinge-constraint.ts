import Ammo from '@cocos/ammo';
import { AmmoConstraint } from "./ammo-constraint";
import { IHingeConstraint } from "../../spec/i-physics-constraint";
import { IVec3Like, Quat } from '../../../core';
import { cocos2AmmoVec3 } from '../ammo-util';
import { HingeConstraintComponent } from '../../framework';
import { AmmoRigidBody } from '../ammo-rigid-body';

export class AmmoHingeConstraint extends AmmoConstraint implements IHingeConstraint {

    setPivotA (v: IVec3Like): void {
        if (this._pivotA) {
            cocos2AmmoVec3(this._pivotA, v);
            // this.impl.setPivotA(this._pivotA);
        }
    }

    setPivotB (v: IVec3Like): void {
        if (this._pivotB) {
            cocos2AmmoVec3(this._pivotB, v);
            // this.impl.setPivotB(this._pivotB);
        }
    }

    setAxisA (v: IVec3Like) {

    }

    setAxisB (v: IVec3Like) {

    }

    get impl (): Ammo.btHingeConstraint {
        return this._impl as Ammo.btHingeConstraint;
    }

    get constraint (): HingeConstraintComponent {
        return this._com as HingeConstraintComponent;
    }

    private _pivotA!: Ammo.btVector3;
    private _pivotB!: Ammo.btVector3;
    private _axisA!: Ammo.btVector3;
    private _axisB!: Ammo.btVector3;

    onComponentSet () {
        if (this._rigidBody) {
            const bodyA = (this._rigidBody.body as AmmoRigidBody).impl;
            const cb = this.constraint.connectedBody;
            let bodyB: Ammo.btRigidBody | undefined;
            if (cb) {
                bodyB = (cb.body as AmmoRigidBody).impl;
            }
            this._pivotA = new Ammo.btVector3();
            this._pivotB = new Ammo.btVector3();
            this._axisA = new Ammo.btVector3();
            this._axisB = new Ammo.btVector3();
            cocos2AmmoVec3(this._pivotA, this.constraint.pivotA);
            cocos2AmmoVec3(this._pivotB, this.constraint.pivotB);
            cocos2AmmoVec3(this._axisA, this.constraint.axisA);
            cocos2AmmoVec3(this._axisB, this.constraint.axisB);
            if (bodyB) {
                this._impl = new Ammo.btHingeConstraint(bodyA, bodyB, this._pivotA, this._pivotB, this._axisA, this._axisB);
            } else {
                const quat = new Quat();
                Quat.fromEuler(quat, -90, 0, 0);
                const qa = new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w);
                const rbAFrame = new Ammo.btTransform();
                rbAFrame.setIdentity();
                rbAFrame.setOrigin(this._pivotA);
                rbAFrame.setRotation(qa);
                this._impl = new Ammo.btHingeConstraint(bodyA, rbAFrame);
            }
        }
    }
}
