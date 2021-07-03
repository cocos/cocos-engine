import { ValueType } from '../value-types/value-type';
import { FloatArray } from './type-define';

export const MATH_FLOAT_ARRAY = Float32Array;

export class MathBase extends ValueType {
    public static createFloatArray (size: number) {
        return new MATH_FLOAT_ARRAY(size);
    }

    /**
     * @en Get the internal array data.
     * @zh 获取内部 array 数据。
     */
    public get array (): FloatArray  {
        return this._array;
    }

    protected declare _array: FloatArray;
}
