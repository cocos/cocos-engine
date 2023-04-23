import { ConditionEvalContext } from '../condition-base';
import { _decorator } from '../../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
import { menu, provide } from './editor';
import { EvaluationTimeAuxiliaryCurveView } from '../../../animation-graph-context';

const { ccclass, serializable } = _decorator;

/**
 * @zh 一种过渡条件绑定，该绑定用于获取指定辅助曲线的当前值。该类绑定产生浮点值。
 *
 * @en A kind of transition condition binding,
 * which is used to obtain the current value of specified auxiliary curve.
 * This type of binding yields float value.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}TCAuxiliaryCurveBinding`)
@menu('i18n:animation.tc_auxiliary_curve_binding.menu')
@provide(TCBindingValueType.FLOAT)
export class TCAuxiliaryCurveBinding extends TCBinding<TCBindingValueType.FLOAT> {
    /**
     * @zh
     * 辅助曲线的名称。
     * @en
     * The auxiliary curve's name.
     */
    @serializable
    public curveName = '';

    public getValueType () {
        return TCBindingValueType.FLOAT as const;
    }

    public bind (context: ConditionEvalContext): TCBindingEvaluation<number> | undefined {
        const view = context.getEvaluationTimeAuxiliaryCurveView();
        return new TCAuxiliaryCurveBindingEvaluation(view, this.curveName);
    }
}

class TCAuxiliaryCurveBindingEvaluation implements TCBindingEvaluation<number> {
    constructor (
        private _view: EvaluationTimeAuxiliaryCurveView,
        private _curveName: string,
    ) { }

    evaluate () {
        return this._view.get(this._curveName);
    }
}
