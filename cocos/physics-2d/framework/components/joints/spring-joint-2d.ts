

import { Joint2D } from './joint-2d';
import { ccclass, property, menu, type } from '../../../../core/data/class-decorator';
import { ISpringJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { Vec3 } from '../../../../core';

@ccclass('cc.SpringJoint2D')
@menu('Physics2D/Joints/SpringJoint2D')
export class SpringJoint2D extends Joint2D {
    TYPE = EJoint2DType.SPRING;

    /**
     * @en
     * The spring frequency.
     * @zh
     * 弹性系数。
     */
    @property
    get frequency () {
        return this._frequency;
    }
    set frequency (v) {
        this._frequency = v;
        if (this._joint) {
            (this._joint as ISpringJoint).setFrequency(v);
        }
    }

    /**
     * @en
     * The damping ratio.
     * @zh
     * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
     */
    @property
    get dampingRatio () {
        return this._dampingRatio;
    }
    set dampingRatio (v) {
        this._dampingRatio = v;
        if (this._joint) {
            (this._joint as ISpringJoint).setDampingRatio(v);
        }
    }

    /**
     * @en
     * The distance separating the two ends of the joint.
     * @zh
     * 关节两端的距离
     */
    @property
    get distance () {
        if (this._autoCalcDistance && this.connectedBody) {
            return Vec3.distance(this.node.worldPosition, this.connectedBody.node.worldPosition);
        }
        return this._distance;
    }
    set distance (v) {
        this._distance = v;
        if (this._joint) {
            (this._joint as ISpringJoint).setDistance(v);
        }
    }

    /**
     * @en
     * Auto calculate the distance between the connected two rigid bodies.
     * @zh
     * 自动计算关节连接的两个刚体间的距离
     */
    @property
    get autoCalcDistance () {
        return this._autoCalcDistance;
    }
    set autoCalcDistance (v) {
        this._autoCalcDistance = v;
    }

    /// private properties

    @property
    private _frequency = 5;
    @property
    private _dampingRatio = 0.7;
    @property
    private _distance = 10;
    @property
    private _autoCalcDistance = true;
}
