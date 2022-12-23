import { Joint2D } from './joint-2d';
import { IMouseJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { Vec2, _decorator } from '../../../../core';
import { help, tooltip } from '../../../../core/data/decorators';

const { ccclass, menu, property } = _decorator;

@ccclass('cc.MouseJoint2D')
@help('i18n:cc.Joint2D')
@menu('Physics2D/Joints/MouseJoint2D')
export class MouseJoint2D extends Joint2D {
    TYPE = EJoint2DType.MOUSE;

    get target () {
        return this._target;
    }
    set target (v) {
        this._target = v;
        if (this._joint) {
            (this._joint as IMouseJoint).setTarget(v);
        }
    }

    /**
     * @en
     * The spring frequency.
     * @zh
     * 弹簧系数。
     */
    @property
    @tooltip('i18n:physics2d.joint.frequency')
    get frequency (): number {
        return this._frequency;
    }
    set frequency (v: number) {
        this._frequency = v;
        if (this._joint) {
            (this._joint as IMouseJoint).setFrequency(v);
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
            (this._joint as IMouseJoint).setDampingRatio(v);
        }
    }

    /**
     * @en
     * The maximum force
     * @zh
     * 最大阻力值
     */
    @property
    @tooltip('i18n:physics2d.joint.maxForce')
    get maxForce (): number {
        return this._maxForce;
    }
    set maxForce (v: number) {
        this._maxForce = v;
        if (this._joint) {
            (this._joint as IMouseJoint).setMaxForce(v);
        }
    }

    update (dt) {
        this._joint!.update!(dt);
    }

    @property
    private _maxForce = 1000;
    @property
    private _dampingRatio = 0.7;
    @property
    private _frequency = 5;
    private _target = new Vec2();
}
