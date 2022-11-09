import { Joint2D } from './joint-2d';
import { ISliderJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { Vec2, IVec2Like, toDegree, _decorator } from '../../../../core';

const tempVec2 = new Vec2();
const { ccclass, menu, property } = _decorator;

@ccclass('cc.SliderJoint2D')
@menu('Physics2D/Joints/SliderJoint2D')
export class SliderJoint2D extends Joint2D {
    TYPE = EJoint2DType.SLIDER;

    /**
     * @en Slide direction
     * @zh 滑动的方向
     */
    @property
    get angle (): number {
        if (this._autoCalcAngle && this.connectedBody) {
            Vec2.subtract(tempVec2, this.connectedBody.node.worldPosition as IVec2Like, this.node.worldPosition as IVec2Like);
            this._angle = toDegree(Math.atan2(tempVec2.y, tempVec2.x));
        }
        return this._angle;
    }
    set angle (v: number) {
        this._angle = v;
    }

    /**
     * @en Auto calculate slide direction according to the slide direction
     * @zh 根据连接的两个刚体自动计算滑动方向
     */
    @property
    get autoCalcAngle (): boolean {
        return this._autoCalcAngle;
    }
    set autoCalcAngle (v: boolean) {
        this._autoCalcAngle = v;
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
    }

    /**
     * @en
     * The maxium force can be applied to rigidbody to rearch the target motor speed.
     * @zh
     * 可以施加到刚体的最大力。
     */
    @property
    get maxMotorForce (): number {
        return this._maxMotorForce;
    }
    set maxMotorForce (v: number) {
        this._maxMotorForce = v;
        if (this._joint) {
            (this._joint as ISliderJoint).setMaxMotorForce(v);
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
            (this._joint as ISliderJoint).setMotorSpeed(v);
        }
    }

    /**
     * @en
     * Enable joint distance limit?
     * @zh
     * 是否开启关节的距离限制？
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
     * The lower joint limit.
     * @zh
     * 刚体能够移动的最小值
     */
    @property
    get lowerLimit (): number {
        return this._lowerLimit;
    }
    set lowerLimit (v: number) {
        this._lowerLimit = v;
        if (this._joint) {
            (this._joint as ISliderJoint).setLowerLimit(v);
        }
    }

    /**
     * @en
     * The lower joint limit.
     * @zh
     * 刚体能够移动的最大值
     */
    @property
    get upperLimit (): number {
        return this._upperLimit;
    }
    set upperLimit (v: number) {
        this._upperLimit = v;
        if (this._joint) {
            (this._joint as ISliderJoint).setUpperLimit(v);
        }
    }

    /// private properties

    @property
    private _angle = 0;
    @property
    private _autoCalcAngle = true;
    @property
    private _enableMotor = false;
    @property
    private _maxMotorForce = 1000;
    @property
    private _motorSpeed = 1000;
    @property
    private _enableLimit = false;
    @property
    private _lowerLimit = 0;
    @property
    private _upperLimit = 0;
}
