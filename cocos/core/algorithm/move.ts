import { assertsArrayIndex } from '../data/utils/asserts';

/**
 * Moves an array element to new location.
 * @param array The array.
 * @param index Index to the array element to move.
 * @param newIndex New array index it should have.
 */
export function move<T> (array: T[], index: number, newIndex: number) {
    assertsArrayIndex(array, index);
    assertsArrayIndex(array, newIndex);
    if (index === newIndex) {
        return array;
    }
    const element = array[index];
    if (index < newIndex) { // Shift right
        for (let iElement = index + 1; iElement <= newIndex; ++iElement) {
            array[iElement - 1] = array[iElement];
        }
    } else { // Shift left
        for (let iElement = index; iElement !== newIndex; --iElement) {
            array[iElement] = array[iElement - 1];
        }
    }
    array[newIndex] = element;
    return array;
}
