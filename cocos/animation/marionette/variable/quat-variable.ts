import { BasicVariableDescription, VariableType, createInstanceTag, VarInstanceBase, Value } from './basic';
import { ccclass, serializable } from '../../../core/data/decorators';
import { assertIsTrue, Quat } from '../../../core';

@ccclass('cc.animation.QuatVariable')
export class QuatVariable implements BasicVariableDescription<VariableType.QUAT_experimental> {
    get type (): VariableType.QUAT_experimental {
        return VariableType.QUAT_experimental as const;
    }

    get value (): Readonly<Quat> {
        return this._value as Readonly<Quat>;
    }

    set value (value) {
        Quat.copy(this._value, value);
    }

    public [createInstanceTag] (): VarInstanceQuat {
        return new VarInstanceQuat(this._value);
    }

    @serializable
    private _value = new Quat();
}

class VarInstanceQuat extends VarInstanceBase {
    constructor (value: Readonly<Quat>) {
        super(VariableType.QUAT_experimental);
        Quat.copy(this._value, value);
    }

    protected getValue (): Value {
        return this._value;
    }

    protected setValue (value: Value): void {
        assertIsTrue(value instanceof Quat);
        Quat.copy(this._value, value);
    }

    private readonly _value = new Quat();
}
