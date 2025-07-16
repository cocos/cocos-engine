import { ConditionBindingContext } from '../condition-base';
import { _decorator } from '../../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
import { provide } from './editor';
import { VarInstance } from '../../../variable';
import { editorOnly } from '../../../../../core/data/decorators';

const { ccclass, serializable } = _decorator;

/**
 * @zh 一种过渡条件绑定，该绑定用于获取动画图变量的当前值。该类绑定产生的值类型对应于变量的值类型。
 *
 * @en A kind of transition condition binding,
 * which is used to obtain the current value of a animation graph variable.
 * This type of binding yields the type corresponding to the variable's type.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}TCVariableBinding`)
@provide(TCBindingValueType.FLOAT, TCBindingValueType.INTEGER)
export class TCVariableBinding<TValueType extends TCBindingValueType> extends TCBinding<TValueType> {
    @serializable
    @editorOnly
    public type = TCBindingValueType.FLOAT as TValueType;

    /**
     * @zh
     * 动画图变量的名称。
     * @en
     * The animation graph variable's name.
     */
    @serializable
    public variableName = '';

    public getValueType (): TValueType {
        return this.type;
    }

    public bind (context: ConditionBindingContext): TCBindingEvaluation<TValueType> | undefined {
        const varInstance = context.getVar(this.variableName);
        if (!varInstance) {
            return undefined;
        }
        return new TCVariableBindingEvaluation(varInstance);
    }
}

class TCVariableBindingEvaluation implements TCBindingEvaluation<TCBindingValueType.FLOAT | TCBindingValueType.INTEGER> {
    constructor (private _varInstance: VarInstance) { }

    public evaluate (): number {
        return this._varInstance.value as number;
    }
}
