import { assertsArrayIndex } from '../data/utils/asserts';

/**
 * @en Circle shift an array once in range [first, last]. If `first < last`, then will do left circle shift;
 * If `first > last`, then will do right circle shift; If `first == last`, there is not effect.
 * @zh 在 [first, last] 范围做一次环形移动。如果 `first < last`，进行左环形移动；如果 `first > last`，进行右环
 * 形移动；如果 `first == last`，将没有效果。
 * @param array @en The array to be rotated. @zh 被修改的数组。
 * @param first @en The beginning of the original range. @zh 移动区间的起始坐标。
 * @param last @en The end of the original range. @zh 移动区间的结束坐标。
 * @returns @en The input array. @zh 输入的数组。
 * @engineInternal
 */
export function shift<T> (array: T[], first: number, last: number) {
    assertsArrayIndex(array, first);
    assertsArrayIndex(array, last);
    if (first === last) {
        return array;
    }
    const element = array[first];
    if (first < last) { // Shift left.
        for (let iElement = first + 1; iElement <= last; ++iElement) {
            array[iElement - 1] = array[iElement];
        }
    } else { // Shift right.
        for (let iElement = first; iElement !== last; --iElement) {
            array[iElement] = array[iElement - 1];
        }
    }
    array[last] = element;
    return array;
}
