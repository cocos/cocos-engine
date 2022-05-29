

import { Joint2D } from './joint-2d';
import { ccclass, property, menu, type } from '../../../../core/data/class-decorator';
import { IWheelJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';

@ccclass('cc.WheelJoint2D')
@menu('Physics2D/Joints/WheelJoint2D')
export class WheelJoint2D extends Joint2D {
    TYPE = EJoint2DType.WHEEL;

    /**
     * @en Wheel susspension direction
     * @zh 轮子震动方向
     */
    @property
    get angle (): number {
        return this._angle;
    }
    set angle (v: number) {
        this._angle = v;
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
            (this._joint as IWheelJoint).enableMotor(v);
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
            (this._joint as IWheelJoint).setMaxMotorTorque(v);
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
            (this._joint as IWheelJoint).setMotorSpeed(v);
        }
    }

    /**
     * @en
     * The spring frequency.
     * @zh
     * 弹性系数。
     */
    @property
    get frequency (): number {
        return this._frequency;
    }
    set frequency (v: number) {
        this._frequency = v;
        if (this._joint) {
            (this._joint as IWheelJoint).setFrequency(v);
        }
    }

    /**
     * @en
     * The damping ratio.
     * @zh
     * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
     */
    @property
    get dampingRatio (): number {
        return this._dampingRatio;
    }
    set dampingRatio (v: number) {
        this._dampingRatio = v;
        if (this._joint) {
            (this._joint as IWheelJoint).setDampingRatio(v);
        }
    }

    /// private properties

    @property
    private _angle = 90;
    @property
    private _enableMotor = false;
    @property
    private _maxMotorTorque = 1000;
    @property
    private _motorSpeed = 0;
    @property
    private _frequency = 5;
    @property
    private _dampingRatio = 0.7;
}
