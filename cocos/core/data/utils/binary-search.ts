
const EPSILON = 1e-6;

export function binarySearchEpsilon (array: number[], value: number) {
    let l = 0;
    for (let h = array.length - 1, m = h >>> 1; l <= h; m = (l + h) >>> 1) {
        const test = array[m];
        if (test > value + EPSILON) {
            h = m - 1;
        }
        else if (test < value - EPSILON) {
            l = m + 1;
        }
        else {
            return m;
        }
    }
    return ~l;
}
