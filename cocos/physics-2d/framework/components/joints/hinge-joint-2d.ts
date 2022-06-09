

import { Joint2D } from './joint-2d';
import { ccclass, property, menu, type } from '../../../../core/data/class-decorator';
import { IHingeJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';

@ccclass('cc.HingeJoint2D')
@menu('Physics2D/Joints/HingeJoint2D')
export class HingeJoint2D extends Joint2D {
    TYPE = EJoint2DType.HINGE;

    /**
     * @en
     * Enable joint limit?
     * @zh
     * 是否开启关节的限制？
     */
    @property
    get enableLimit (): boolean {
        return this._enableLimit;
    }
    set enableLimit (v: boolean) {
        this._enableLimit = v;
    }

    /**
     * @en
     * The lower angle.
     * @zh
     * 角度的最低限制。
     */
    @property
    get lowerAngle (): number {
        return this._lowerAngle;
    }
    set lowerAngle (v: number) {
        this._lowerAngle = v;
        if (this._joint) {
            (this._joint as IHingeJoint).setLowerAngle(v);
        }
    }

    /**
     * @en
     * The upper angle.
     * @zh
     * 角度的最高限制。
     */
    @property
    get upperAngle (): number {
        return this._upperAngle;
    }
    set upperAngle (v: number) {
        this._upperAngle = v;
        if (this._joint) {
            (this._joint as IHingeJoint).setUpperAngle(v);
        }
    }

    /**
     * @en
     * Enable joint motor?
     * @zh
     * 是否开启关节马达？
     */
    @property
    get enableMotor (): boolean {
        return this._enableMotor;
    }
    set enableMotor (v: boolean) {
        this._enableMotor = v;
        if (this._joint) {
            (this._joint as IHingeJoint).enableMotor(v);
        }
    }

    /**
     * @en
     * The maxium torque can be applied to rigidbody to rearch the target motor speed.
     * @zh
     * 可以施加到刚体的最大扭矩。
     */
    @property
    get maxMotorTorque (): number {
        return this._maxMotorTorque;
    }
    set maxMotorTorque (v: number) {
        this._maxMotorTorque = v;
        if (this._joint) {
            (this._joint as IHingeJoint).setMaxMotorTorque(v);
        }
    }

    /**
     * @en
     * The expected motor speed.
     * @zh
     * 期望的马达速度。
     */
    @property
    get motorSpeed (): number {
        return this._motorSpeed;
    }
    set motorSpeed (v: number) {
        this._motorSpeed = v;
        if (this._joint) {
            (this._joint as IHingeJoint).setMotorSpeed(v);
        }
    }

    /// private properties

    @property
    private _enableLimit = false;
    @property
    private _lowerAngle = 0;
    @property
    private _upperAngle = 0;
    @property
    private _enableMotor = false;
    @property
    private _maxMotorTorque = 1000;
    @property
    private _motorSpeed = 0;
}
