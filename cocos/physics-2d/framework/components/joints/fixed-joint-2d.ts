import { Joint2D } from './joint-2d';
import { _decorator } from '../../../../core';
import { IFixedJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { help, tooltip } from '../../../../core/data/decorators';

const { ccclass, menu, property } = _decorator;

@ccclass('cc.FixedJoint2D')
@help('i18n:cc.Joint2D')
@menu('Physics2D/Joints/FixedJoint2D')
export class FixedJoint2D extends Joint2D {
    TYPE = EJoint2DType.FIXED;

    /**
     * @en
     * The frequency.
     * @zh
     * 弹性系数。
     */
    @property
    @tooltip('i18n:physics2d.joint.frequency')
    get frequency (): number {
        return this._frequency;
    }
    set frequency (v: number) {
        this._frequency = v;
        if (this._joint) {
            (this._joint as IFixedJoint).setFrequency(v);
        }
    }

    /**
     * @en
     * The damping ratio.
     * @zh
     * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
     */
    @property
    @tooltip('i18n:physics2d.joint.dampingRatio')
    get dampingRatio (): number {
        return this._dampingRatio;
    }
    set dampingRatio (v: number) {
        this._dampingRatio = v;
        if (this._joint) {
            (this._joint as IFixedJoint).setDampingRatio(v);
        }
    }

    /// private properties

    @property
    private _frequency = 0.7;
    @property
    private _dampingRatio = 0.5;
}
