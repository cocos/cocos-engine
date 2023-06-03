import { assertIsTrue, Vec3 } from '../../../core';
import { ccclass, serializable } from '../../../core/data/decorators';
import { BasicVariableDescription, VariableType, createInstanceTag, VarInstanceBase, Value } from './basic';

@ccclass('cc.animation.Vec3Variable')
export class Vec3Variable implements BasicVariableDescription<VariableType.VEC3_experimental> {
    get type (): VariableType.VEC3_experimental {
        return VariableType.VEC3_experimental as const;
    }

    get value (): Readonly<Vec3> {
        return this._value as Readonly<Vec3>;
    }

    set value (value) {
        Vec3.copy(this._value, value);
    }

    public [createInstanceTag] (): VarInstanceVec3 {
        return new VarInstanceVec3(this.value);
    }

    @serializable
    private _value = new Vec3();
}

class VarInstanceVec3 extends VarInstanceBase {
    constructor (value: Readonly<Vec3>) {
        super(VariableType.VEC3_experimental);
        Vec3.copy(this._value, value);
    }

    protected getValue (): Value {
        return this._value;
    }

    protected setValue (value: Value): void {
        assertIsTrue(value instanceof Vec3);
        Vec3.copy(this._value, value);
    }

    private readonly _value = new Vec3();
}
