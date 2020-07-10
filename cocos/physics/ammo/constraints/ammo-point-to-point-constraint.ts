import Ammo from '@cocos/ammo';
import { AmmoConstraint } from "./ammo-constraint";
import { IPointToPointConstraint } from "../../spec/i-physics-constraint";
import { IVec3Like, Vec3 } from "../../../core";
import { PointToPointConstraintComponent } from "../../framework";
import { AmmoRigidBody } from "../ammo-rigid-body";
import { cocos2AmmoVec3 } from "../ammo-util";
import { CC_V3_0 } from '../ammo-const';

export class AmmoPointToPointConstraint extends AmmoConstraint implements IPointToPointConstraint {

    setPivotA (v: IVec3Like): void {
        if (this._pivotA) {
            Vec3.multiply(CC_V3_0, v, this._com.node.worldScale);
            cocos2AmmoVec3(this._pivotA, CC_V3_0);
            this.impl.setPivotA(this._pivotA);
        }
    }

    setPivotB (v: IVec3Like): void {
        Vec3.copy(CC_V3_0, v);
        const cb = this._com.connectedBody;
        if (cb) {
            Vec3.multiply(CC_V3_0, v, cb.node.worldScale);
        }
        cocos2AmmoVec3(this._pivotB, CC_V3_0);
        this.impl.setPivotB(this._pivotB);
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
            this._pivotA = new Ammo.btVector3();
            this._pivotB = new Ammo.btVector3();
            cocos2AmmoVec3(this._pivotA, this.constraint.pivotA);
            cocos2AmmoVec3(this._pivotB, this.constraint.pivotB);
            if (bodyB) {
                this._impl = new Ammo.btPoint2PointConstraint(bodyA, bodyB, this._pivotA, this._pivotB);
            } else {
                this._impl = new Ammo.btPoint2PointConstraint(bodyA, this._pivotA);
            }
        }
    }
}
