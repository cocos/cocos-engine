import { Mat4 } from '../../core';
import { VFXParameterType } from '../define';
import { VFXParameter } from '../vfx-parameter';

export class Mat4Parameter extends VFXParameter {
    get isArray (): boolean {
        return false;
    }

    get type (): VFXParameterType {
        return VFXParameterType.MAT4;
    }

    get data (): Readonly<Mat4> {
        return this._data;
    }

    set data (val: Readonly<Mat4>) {
        Mat4.copy(this._data, val);
    }

    private _data = new Mat4();
}
