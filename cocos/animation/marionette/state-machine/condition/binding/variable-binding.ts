import { ConditionEvalContext } from '../condition-base';
import { _decorator } from '../../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
import { menu, provide } from './editor';
import { VarInstance, VariableType } from '../../../variable';
import { editorOnly } from '../../../../../core/data/decorators';

const { ccclass, serializable } = _decorator;

export type BindableVariableType = VariableType.FLOAT | VariableType.INTEGER;

/**
 * @zh 描述过渡条件中的浮点值到动画图变量的绑定。
 * @en Describes the binding to a float binding in transition condition from animation graph.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}TCVariableBinding`)
@menu('变量绑定')
@provide(TCBindingValueType.FLOAT, TCBindingValueType.INTEGER)
export class TCVariableBinding<TValueType extends TCBindingValueType> extends TCBinding<TValueType> {
    @serializable
    @editorOnly
    public type = TCBindingValueType.FLOAT as TValueType;

    /**
     * 动画图变量的名称。
     */
    @serializable
    public variableName = '';

    public getValueType (): TValueType {
        return this.type;
    }

    public bind (context: ConditionEvalContext): TCBindingEvaluation<TValueType> | undefined {
        const varInstance = context.getVar(this.variableName);
        if (!varInstance) {
            return undefined;
        }
        return new TCVariableBindingEvaluation(varInstance);
    }
}

class TCVariableBindingEvaluation implements TCBindingEvaluation<TCBindingValueType.FLOAT | TCBindingValueType.INTEGER> {
    constructor (private _varInstance: VarInstance) { }

    public evaluate () {
        return this._varInstance.value as number;
    }
}
