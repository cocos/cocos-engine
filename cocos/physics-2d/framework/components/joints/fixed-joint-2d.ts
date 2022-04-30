
import { Joint2D } from './joint-2d';
import { ccclass, property, menu, type } from '../../../../core/data/class-decorator';
import { IFixedJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';

@ccclass('cc.FixedJoint2D')
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
