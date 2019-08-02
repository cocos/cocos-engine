
const EPSILON = 1e-6;

export function binarySearchEpsilon (array: number[], value: number) {
    let low = 0;
    let high = array.length - 1;
    let middle = high >>> 1;
    for (; low <= high; middle = (low + high) >>> 1) {
        const middleValue = array[middle];
        if (middleValue > (value + EPSILON)) {
            high = middle - 1;
        } else if (middleValue < (value - EPSILON)) {
            low = middle + 1;
        } else {
            return middle;
        }
    }
    return ~low;
}
