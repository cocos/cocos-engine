import { shift } from '../../../cocos/core/algorithm/move';

describe('Array utils', () => {
    describe('Shift', () => {
        test('Location does not alters', () => {
            expect(shift([1, 2, 3], 0, 0)).toStrictEqual([1, 2, 3]);
        });

        test('Shift right', () => {
            expect(shift([1, 2, 3], 0, 1)).toStrictEqual([2, 1, 3]);
            expect(shift([1, 2, 3], 0, 2)).toStrictEqual([2, 3, 1]);
            expect(shift([1, 2, 3, 4], 0, 2)).toStrictEqual([2, 3, 1, 4]);
            expect(shift([1, 2, 3, 4], 1, 2)).toStrictEqual([1, 3, 2, 4]);
        });

        test('Shift left', () => {
            expect(shift([1, 2, 3], 1, 0)).toStrictEqual([2, 1, 3]);
            expect(shift([1, 2, 3], 2, 0)).toStrictEqual([3, 1, 2]);
            expect(shift([1, 2, 3, 4], 2, 0)).toStrictEqual([3, 1, 2, 4]);
            expect(shift([1, 2, 3, 4], 2, 1)).toStrictEqual([1, 3, 2, 4]);
        });
    });
});