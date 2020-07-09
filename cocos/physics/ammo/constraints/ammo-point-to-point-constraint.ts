import Ammo from '@cocos/ammo';
import { AmmoConstraint } from "./ammo-constraint";
import { IPointToPointConstraint } from "../../spec/i-physics-constraint";
import { IVec3Like } from "../../../core";
import { PointToPointConstraintComponent } from "../../framework";
import { AmmoRigidBody } from "../ammo-rigid-body";
import { cocos2AmmoVec3 } from "../ammo-util";

export class AmmoPointToPointConstraint extends AmmoConstraint implements IPointToPointConstraint {

    setPivotA (v: IVec3Like): void {
        if (this._pivotA) {
            cocos2AmmoVec3(this._pivotA, v);
            this.impl.setPivotA(this._pivotA);
        }
    }

    setPivotB (v: IVec3Like): void {
        if (this._pivotB) {
            cocos2AmmoVec3(this._pivotB, v);
            this.impl.setPivotB(this._pivotB);
        }
    }

    get impl (): Ammo.btPoint2PointConstraint {
        return this._impl as Ammo.btPoint2PointConstraint;
    }

    get constraint (): PointToPointConstraintComponent {
        return this._com as PointToPointConstraintComponent;
    }

    private _pivotA!: Ammo.btVector3;
    private _pivotB!: Ammo.btVector3;

    onComponentSet () {
        if (this._rigidBody) {
            const bodyA = (this._rigidBody.body as AmmoRigidBody).impl;
            const cb = this.constraint.connectedBody;
            let bodyB: Ammo.btRigidBody | undefined;
            if (cb) {
                bodyB = (cb.body as AmmoRigidBody).impl;
            }
            if (bodyB) {
                this._pivotA = new Ammo.btVector3();
                this._pivotB = new Ammo.btVector3();
                cocos2AmmoVec3(this._pivotA, this.constraint.pivotA);
                cocos2AmmoVec3(this._pivotB, this.constraint.pivotB);
                this._impl = new Ammo.btPoint2PointConstraint(bodyA, bodyB, this._pivotA, this._pivotB);
            } else {
                this._pivotA = new Ammo.btVector3();
                this._pivotB = new Ammo.btVector3();
                this._impl = new Ammo.btPoint2PointConstraint(bodyA, this._pivotA);
            }
        }
    }
}
