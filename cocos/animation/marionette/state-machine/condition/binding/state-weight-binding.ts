import { ConditionEvalContext } from '../condition-base';
import { _decorator } from '../../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
import { menu, provide } from './editor';

const { ccclass } = _decorator;

/**
 * @zh 一种过渡条件绑定，该绑定用于获取过渡的源头状态当前的权重值。该类绑定产生浮点值。
 *
 * @en A kind of transition condition binding,
 * which is used to obtain the current weight value of transition source state.
 * This type of binding yields float value.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}TCStateWeightBinding`)
@menu('i18n:animation.tc_state_weight_binding.menu')
@provide(TCBindingValueType.FLOAT)
export class TCStateWeightBinding extends TCBinding<TCBindingValueType.FLOAT> {
    public getValueType () {
        return TCBindingValueType.FLOAT as const;
    }

    public bind (_context: ConditionEvalContext): TCBindingEvaluation<number> | undefined {
        return new TCStateWeightBindingEvaluation();
    }
}

class TCStateWeightBindingEvaluation implements TCBindingEvaluation<number> {
    constructor () { }

    evaluate (): number {
        // TODO Implement this before release!
        return 0.0;
    }
}
