import { ConditionBindingContext, ConditionEvaluationContext } from '../condition-base';
import { _decorator } from '../../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
import { provide, support, TCBindingTransitionSourceFilter } from './editor';

const { ccclass } = _decorator;

/**
 * @zh 一种过渡条件绑定，该绑定用于获取过渡的源头状态所包含的动作已流逝的标准化时间。
 * 如果源头中不包含动作，则返回 0。
 * 该类绑定产生浮点值。
 *
 * @en A kind of transition condition binding,
 * which is used to obtain the elapsed normalized time of motions within transition source state.
 * If there's no motion in source state, 0 is returned.
 * This type of binding yields float value.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}TCStateMotionTimeBinding`)
@provide(TCBindingValueType.FLOAT)
@support(TCBindingTransitionSourceFilter.POSE)
export class TCStateMotionTimeBinding extends TCBinding<TCBindingValueType.FLOAT> {
    public getValueType (): TCBindingValueType.FLOAT {
        return TCBindingValueType.FLOAT as const;
    }

    public bind (_context: ConditionBindingContext): TCBindingEvaluation<number> | undefined {
        return new TCStateMotionTimeBindingEvaluation();
    }
}

class TCStateMotionTimeBindingEvaluation implements TCBindingEvaluation<number> {
    public evaluate (context: ConditionEvaluationContext): number {
        return context.sourceStateMotionTimeNormalized;
    }
}
