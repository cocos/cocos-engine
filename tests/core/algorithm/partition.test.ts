import { partition } from "../../../cocos/core/algorithm/partition";

test(`Partition algorithm`, () => {
    interface Element { /** The value. */ v: number, /** Result of the predicate function. */ p: boolean }

    const p = (array: Element[]) => {
        const nFirstGroup = partition(array, (element) => element.p);
        return [array.map(({ v: value }) => value), nFirstGroup];
    };

    // Empty array.
    expect(p([])).toStrictEqual([[], 0]);

    //#region Single element

    // Predicate to true.
    expect(p([
        { v: 6, p: true },
    ])).toStrictEqual([[6], 1]);

    // Predicate to false.
    expect(p([
        { v: 6, p: false },
    ])).toStrictEqual([[6], 0]);

    //#endregion

    //#region Two elements

    // Both predicate to true.
    expect(p([
        { v: 7, p: true },
        { v: 6, p: true },
    ])).toStrictEqual([[7, 6], 2]);

    // Both predicate to false.
    expect(p([
        { v: 6, p: false },
        { v: 7, p: false },
    ])).toStrictEqual([[6, 7], 0]);

    // Either predicate to true.
    expect(p([
        { v: 7, p: true },
        { v: 6, p: false },
    ])).toStrictEqual([[7, 6], 1]);

    // Either predicate to true.
    expect(p([
        { v: 6, p: false },
        { v: 7, p: true },
    ])).toStrictEqual([[7, 6], 1]);

    //#endregion

    //#region Three elements

    // Both predicate to true.
    expect(p([
        { v: 7, p: true },
        { v: 6, p: true },
        { v: 8, p: true },
    ])).toStrictEqual([[7, 6, 8], 3]);

    expect(p([
        { v: 7, p: true },
        { v: 8, p: false },
        { v: 6, p: true },
    ])).toStrictEqual([[7, 6, 8], 2]);

    expect(p([
        { v: 6, p: true },
        { v: 7, p: true },
        { v: 8, p: false },
    ])).toStrictEqual([[6, 7, 8], 2]);

    expect(p([
        { v: 6, p: true },
        { v: 7, p: false },
        { v: 8, p: false },
    ])).toStrictEqual([[6, 7, 8], 1]);

    // Both predicate to false.
    expect(p([
        { v: 6, p: false },
        { v: 8, p: false },
        { v: 7, p: false },
    ])).toStrictEqual([[6, 8, 7], 0]);

    expect(p([
        { v: 7, p: false },
        { v: 8, p: false },
        { v: 6, p: true },
    ])).toStrictEqual([[6, 8, 7], 1]); // ⚠️ Relative order changed

    expect(p([
        { v: 6, p: false },
        { v: 7, p: true },
        { v: 8, p: false },
    ])).toStrictEqual([[7, 6, 8], 1]);

    expect(p([
        { v: 7, p: false },
        { v: 8, p: true },
        { v: 6, p: true },
    ])).toStrictEqual([[8, 6, 7], 2]);

    //#endregion

    // Multiple elements...
    expect(p([
        { v: 1, p: false },
        { v: 2, p: true },
        { v: 3, p: true },
        { v: 4, p: false },
        { v: 5, p: true },
        { v: 6, p: false },
        { v: 7, p: false },
        { v: 8, p: false },
        { v: 9, p: true },
    ])).toStrictEqual([[
        2, 3, 5, 9,
        1, 6, 7, 8, 4, // ⚠️ Relative order changed
    ], 4]);
});
