/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.
 https://www.cocos.com/
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { VariableType, BindableBoolean, bindOr } from '../../parametric';
import { _decorator } from '../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { createEval } from '../../create-eval';
import { Condition, ConditionEval, ConditionBindingContext } from './condition-base';

const { ccclass, serializable } = _decorator;

enum UnaryOperator {
    TRUTHY,
    FALSY,
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}UnaryCondition`)
export class UnaryCondition implements Condition {
    public static readonly Operator = UnaryOperator;

    @serializable
    public operator: UnaryOperator = UnaryOperator.TRUTHY;

    @serializable
    public operand = new BindableBoolean();

    public clone (): UnaryCondition {
        const that = new UnaryCondition();
        that.operator = this.operator;
        that.operand = this.operand.clone();
        return that;
    }

    public [createEval] (context: ConditionBindingContext): UnaryConditionEval {
        const { operator, operand } = this;
        const evaluation = new UnaryConditionEval(operator, false);
        const value = bindOr(
            context,
            operand,
            VariableType.BOOLEAN,
            evaluation.setOperand,
            evaluation,
        );
        evaluation.reset(value);
        return evaluation;
    }
}

export declare namespace UnaryCondition {
    export type Operator = UnaryOperator;
}

class UnaryConditionEval implements ConditionEval {
    private declare _operator: UnaryOperator;
    private declare _operand: boolean;
    private declare _result: boolean;

    constructor (operator: UnaryOperator, operand: boolean) {
        this._operator = operator;
        this._operand = operand;
        this._eval();
    }

    public reset (value: boolean): void {
        this.setOperand(value);
    }

    public setOperand (value: boolean): void {
        this._operand = value;
        this._eval();
    }

    /**
     * Evaluates this condition.
     */
    public eval (): boolean {
        return this._result;
    }

    private _eval (): void {
        const { _operand: operand } = this;
        switch (this._operator) {
        default:
        case UnaryOperator.TRUTHY:
            this._result = !!operand;
            break;
        case UnaryOperator.FALSY:
            this._result = !operand;
            break;
        }
    }
}
