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

import { VariableType, VariableTypeValueTypeMap, VarInstanceBase } from './basic';
import { PlainVariable, PlainVariableType } from './primitive-variable';
import { TriggerVariable } from './trigger-variable';
import { Vec3Variable } from './vec3-variable';
import { QuatVariable } from './quat-variable';

export type VariableDescription =
    | PlainVariable
    | Vec3Variable
    | QuatVariable
    | TriggerVariable;

export type VarInstance = VarInstanceBase;

export { VariableType, createInstanceTag } from './basic';
export type { PrimitiveValue, Value, VariableTypeValueTypeMap } from './basic';

export { VarInstanceTrigger, TriggerResetMode } from './trigger-variable';

export function createVariable<TVariableType extends VariableType> (
    type: TVariableType,
    initialValue?: VariableTypeValueTypeMap[TVariableType],
): VariableDescription {
    let variable: VariableDescription;
    switch (type) {
    case VariableType.FLOAT:
    case VariableType.INTEGER:
    case VariableType.BOOLEAN:
        variable = new PlainVariable(type as PlainVariableType);
        break;
    case VariableType.TRIGGER:
        variable = new TriggerVariable();
        break;
    case VariableType.VEC3_experimental:
        variable = new Vec3Variable();
        break;
    case VariableType.QUAT_experimental:
        variable = new QuatVariable();
        break;
    default:
        throw new Error(`Unknown variable type ${type}`);
    }
    if (typeof initialValue !== 'undefined') {
        variable.value = initialValue;
    }
    return variable;
}
