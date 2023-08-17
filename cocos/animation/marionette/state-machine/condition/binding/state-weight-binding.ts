import { ConditionBindingContext, ConditionEvaluationContext } from '../condition-base';
import { _decorator } from '../../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
import { provide, support, TCBindingTransitionSourceFilter } from './editor';

const { ccclass } = _decorator;

/**
 * @zh 一种过渡条件绑定，该绑定用于获取过渡的源头状态当前的权重值。该类绑定产生浮点值。
 *
 * @en A kind of transition condition binding,
 * which is used to obtain the current weight value of transition source state.
 * This type of binding yields float value.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}TCStateWeightBinding`)
@provide(TCBindingValueType.FLOAT)
@support(TCBindingTransitionSourceFilter.WEIGHTED)
export class TCStateWeightBinding extends TCBinding<TCBindingValueType.FLOAT> {
    public getValueType (): TCBindingValueType.FLOAT {
        return TCBindingValueType.FLOAT as const;
    }

    public bind (_context: ConditionBindingContext): TCBindingEvaluation<number> | undefined {
        return new TCStateWeightBindingEvaluation();
    }
}

class TCStateWeightBindingEvaluation implements TCBindingEvaluation<number> {
    public evaluate (context: ConditionEvaluationContext): number {
        return context.sourceStateWeight;
    }
}
