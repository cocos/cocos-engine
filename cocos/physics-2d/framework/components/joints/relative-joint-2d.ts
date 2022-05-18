

import { Joint2D } from './joint-2d';
import { ccclass, property, menu, type } from '../../../../core/data/class-decorator';
import { IRelativeJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { Vec3, Vec2, IVec2Like, Quat } from '../../../../core';

const tempVec3_1 = new Vec3();
const tempVec3_2 = new Vec3();

@ccclass('cc.RelativeJoint2D')
@menu('Physics2D/Joints/RelativeJoint2D')
export class RelativeJoint2D extends Joint2D {
    TYPE = EJoint2DType.RELATIVE;

    /**
     * @en
     * The maximum force can be applied to rigidbody.
     * @zh
     * 可以应用于刚体的最大的力值
     */
    @property
    get maxForce (): number {
        return this._maxForce;
    }
    set maxForce (v: number) {
        this._maxForce = v;
        if (this._joint) {
            (this._joint as IRelativeJoint).setMaxForce(v);
        }
    }

    /**
     * @en
     * The maximum torque can be applied to rigidbody.
     * @zh
     * 可以应用于刚体的最大扭矩值
     */
    @property
    get maxTorque (): number {
        return this._maxTorque;
    }
    set maxTorque (v: number) {
        this._maxTorque = v;
        if (this._joint) {
            (this._joint as IRelativeJoint).setMaxTorque(v);
        }
    }

    /**
     * @en
     * The position correction factor in the range [0,1].
     * @zh
     * 位置矫正系数，范围为 [0, 1]
     */
    @property
    get correctionFactor (): number {
        return this._correctionFactor;
    }
    set correctionFactor (v: number) {
        this._correctionFactor = v;
        if (this._joint) {
            (this._joint as IRelativeJoint).setCorrectionFactor(v);
        }
    }

    /**
     * @en
     * The linear offset from connected rigidbody to rigidbody.
     * @zh
     * 关节另一端的刚体相对于起始端刚体的位置偏移量
     */
    @property
    get linearOffset (): Vec2 {
        if (this._autoCalcOffset && this.connectedBody) {
            return Vec2.subtract(this._linearOffset, this.connectedBody.node.worldPosition as IVec2Like, this.node.worldPosition as IVec2Like) as Vec2;
        }
        return this._linearOffset;
    }
    set linearOffset (v: Vec2) {
        this._linearOffset.set(v);
        if (this._joint) {
            (this._joint as IRelativeJoint).setLinearOffset(v);
        }
    }

    /**
     * @en
     * The angular offset from connected rigidbody to rigidbody.
     * @zh
     * 关节另一端的刚体相对于起始端刚体的角度偏移量
     */
    @property
    get angularOffset (): number {
        if (this._autoCalcOffset && this.connectedBody) {
            Quat.toEuler(tempVec3_1, this.node.worldRotation);
            Quat.toEuler(tempVec3_2, this.connectedBody.node.worldRotation);
            this._angularOffset = tempVec3_2.z - tempVec3_1.z;
        }
        return this._angularOffset;
    }
    set angularOffset (v: number) {
        this._angularOffset = v;
        if (this._joint) {
            (this._joint as IRelativeJoint).setAngularOffset(v);
        }
    }

    /**
     * @en
     * Auto calculate the angularOffset and linearOffset between the connected two rigid bodies.
     * @zh
     * 自动计算关节连接的两个刚体间的 angularOffset 和 linearOffset
     */
    @property
    get autoCalcOffset (): boolean {
        return this._autoCalcOffset;
    }
    set autoCalcOffset (v: boolean) {
        this._autoCalcOffset = v;
    }

    /// private properties

    @property
    private _maxForce = 5;
    @property
    private _maxTorque = 0.7;
    @property
    private _correctionFactor = 0.3;
    @property
    private _angularOffset = 0;
    @property
    private _linearOffset = new Vec2();
    @property
    private _autoCalcOffset = true;
}
