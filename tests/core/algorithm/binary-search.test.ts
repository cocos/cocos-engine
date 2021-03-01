import { binarySearch } from '../../../cocos/core/algorithm/binary-search';

describe('Binary search', () => {
    test('Found', () => {
        expect(binarySearch([3.14, 3.15, 3.16], 3.15)).toBe(1);
    });
    test('Not found: less than some', () => {
        expect(binarySearch([3.14, 3.15, 3.16], 3.145)).toBe(~1);
    });
    test('Not found: larger than all', () => {
        expect(binarySearch([3.14, 3.15, 3.16], 3.17)).toBe(~3);
    });
    test('Not found: empty array', () => {
        expect(binarySearch([], 0.28)).toBe(~0);
    });
});