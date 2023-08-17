import { _decorator } from '../../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
import { provide } from './editor';
import { EvaluationTimeAuxiliaryCurveView } from '../../../animation-graph-context';
import { ConditionBindingContext } from '../condition-base';

const { ccclass, serializable } = _decorator;

/**
 * @zh 一种过渡条件绑定，该绑定用于获取指定辅助曲线的当前值。该类绑定产生浮点值。
 *
 * @en A kind of transition condition binding,
 * which is used to obtain the current value of specified auxiliary curve.
 * This type of binding yields float value.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}TCAuxiliaryCurveBinding`)
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

    public getValueType (): TCBindingValueType.FLOAT {
        return TCBindingValueType.FLOAT as const;
    }

    public bind (context: ConditionBindingContext): TCBindingEvaluation<number> | undefined {
        const view = context.getEvaluationTimeAuxiliaryCurveView();
        return new TCAuxiliaryCurveBindingEvaluation(view, this.curveName);
    }
}

class TCAuxiliaryCurveBindingEvaluation implements TCBindingEvaluation<number> {
    constructor (
        private _view: EvaluationTimeAuxiliaryCurveView,
        private _curveName: string,
    ) { }

    public evaluate (): number {
        return this._view.get(this._curveName);
    }
}
