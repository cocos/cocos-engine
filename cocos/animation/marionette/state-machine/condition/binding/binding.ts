import { ConditionBindingContext, ConditionEvaluationContext } from '../condition-base';

/**
 * @zh
 * 描述过渡条件中，某个绑定提供的值的类型。
 * @en
 * Describes the type of value providing by a transition condition binding.
 */
export enum TCBindingValueType {
    FLOAT = 0 /* VariableType.FLOAT */,

    INTEGER = 3 /* VariableType.INTEGER */,
}

interface TCBindingValueTypeMap {
    [TCBindingValueType.FLOAT]: number;
    [TCBindingValueType.INTEGER]: number;
}

/**
 * @zh 描述过渡条件中的值绑定，例如，二元条件的左操作数上的绑定。
 * 前缀 “TC” 是 “Transition Condition” 的缩写。
 *
 * @en Describes a value binding in transition condition,
 * for example, the binding on binary condition's left hand operand.
 * The prefix "TC" is abbr of `Transition Condition`.
 */
export abstract class TCBinding<TValueType extends TCBindingValueType> {
    /**
     * @zh
     * 获取绑定的值类型。
     * @en
     * Gets the binding value type.
     */
    public abstract getValueType(): TValueType;

    public abstract bind(context: ConditionBindingContext): TCBindingEvaluation<TValueType> | undefined;
}

/**
 * @zh 过渡条件中的值绑定的求值。
 * @en The evaluation of a float binding in transition condition.
 */
export interface TCBindingEvaluation<TValueType extends TCBindingValueType> {
    evaluate(context: ConditionEvaluationContext): TCBindingValueTypeMap[TValueType];
}
