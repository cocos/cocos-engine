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

import { VariableType, BindableBoolean, bindOr, validateVariableExistence, validateVariableTypeTriggerLike } from '../../parametric';
import { _decorator } from '../../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { createEval } from '../../create-eval';
import { Condition, ConditionEval, ConditionBindingContext } from './condition-base';

const { ccclass, serializable } = _decorator;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}TriggerCondition`)
export class TriggerCondition implements Condition {
    @serializable
    public trigger = '';

    public clone (): TriggerCondition {
        const that = new TriggerCondition();
        that.trigger = this.trigger;
        return that;
    }

    [createEval] (context: ConditionBindingContext): ConditionEval {
        const evaluation = new TriggerConditionEval(false);
        const triggerInstance = context.getVar(this.trigger);
        if (validateVariableExistence(triggerInstance, this.trigger)) {
            validateVariableTypeTriggerLike(triggerInstance.type, this.trigger);
            evaluation.setTrigger(triggerInstance.bind(
                evaluation.setTrigger,
                evaluation,
            ) as boolean);
        }
        return evaluation;
    }
}

class TriggerConditionEval implements ConditionEval {
    constructor (triggered: boolean) {
        this._triggered = triggered;
    }

    public setTrigger (trigger: boolean): void {
        this._triggered = trigger;
    }

    public eval (): boolean {
        return this._triggered;
    }

    private _triggered = false;
}
