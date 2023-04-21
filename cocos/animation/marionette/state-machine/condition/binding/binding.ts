import { ConditionEvalContext } from '../condition-base';

/**
 * Describes the type of value providing by a binding.
 */
export enum TCBindingValueType {
    FLOAT = 0,

    INTEGER = 3,
}

type TCBindingValueTypeMap = {
    [TCBindingValueType.FLOAT]: number;
    [TCBindingValueType.INTEGER]: number;
};

/**
 * @zh 描述过渡条件中的值绑定。
 * @en Describes a value binding in transition condition.
 */
export abstract class TCBinding<TValueType extends TCBindingValueType> {
    /**
     * Gets the binding value type.
     */
    public abstract getValueType(): TValueType;

    public abstract bind(context: ConditionEvalContext): TCBindingEvaluation<TValueType> | undefined;
}

/**
 * @zh 过渡条件中的值绑定的求值。
 * @en The evaluation of a float binding in transition condition.
 */
export interface TCBindingEvaluation<TValueType extends TCBindingValueType> {
    evaluate(): TCBindingValueTypeMap[TValueType];
}
