import { ConditionEvalContext } from '../condition-base';
import { _decorator } from '../../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
import { menu, provide } from './editor';
import { EvaluationTimeAuxiliaryCurveView } from '../../../animation-graph-context';

const { ccclass, serializable } = _decorator;

/**
 * @zh 描述过渡条件中的浮点值到辅助曲线值的绑定。
 * @en Describes the binding to a float binding in transition condition from an auxiliary curve.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}TCAuxiliaryCurveBinding`)
@menu('辅助曲线绑定')
@provide(TCBindingValueType.FLOAT)
export class TCAuxiliaryCurveBinding extends TCBinding<TCBindingValueType.FLOAT> {
    /**
     * 辅助曲线的名称。
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
