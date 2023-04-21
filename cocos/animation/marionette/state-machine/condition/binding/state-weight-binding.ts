import { ConditionEvalContext } from '../condition-base';
import { _decorator } from '../../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
import { menu, provide } from './editor';

const { ccclass } = _decorator;

/**
 * @zh 描述过渡条件中的浮点值到当前状态权重的绑定。
 * @en Describes the binding to a float binding in transition condition from an auxiliary curve.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}TCStateWeightBinding`)
@menu('状态权重绑定')
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
