import { renameObjectProperty } from '../../cocos/core/utils/internal';

test(`renameObjectProperty()`, () => {
    const symKey = Symbol();
    const nonEnumerableSymKey = Symbol();
    const nonOwnSymKey = Symbol();

    const originalObject: Record<PropertyKey, any> = {
        c: 1, a: '2', b: null,
        get x() { return 6; },
        [symKey]: false,
    };
    Object.defineProperty(originalObject, 'pNonEnumerable', {
        value: 6,
        enumerable: false,
    });
    Object.defineProperty(originalObject, nonEnumerableSymKey, {
        value: 7,
        enumerable: false,
    });
    Object.setPrototypeOf(originalObject, {
        pNonOwn: '',
        nonOwnSymKey: true,
    });
    // Freeze to ensure our readonly on original object.
    Object.freeze(originalObject);

    const originalKeyOrder = Object.keys(originalObject);
    expect(originalKeyOrder).toStrictEqual(['c', 'a', 'b', 'x']);

    // Failed: original key does not exists.
    expect(renameObjectProperty(originalObject, 'd', 'e')).toBe(originalObject);
    
    // Failed: new key has already existed.
    expect(renameObjectProperty(originalObject, 'b', 'a')).toBe(originalObject);

    // Failed: can not rename a non-enumerable object.
    expect(renameObjectProperty(originalObject, 'pNonEnumerable', 'pNonEnumerable_1')).toBe(originalObject);

    // Failed: can not rename a non-own object.
    expect(renameObjectProperty(originalObject, 'pNonOwn', 'pNonOwn_1')).toBe(originalObject);

    /// The following should all rename successively.

    const checkOk = (originalPropertyKey: PropertyKey, newPropertyKey: PropertyKey) => {
        const renamed = renameObjectProperty(originalObject, originalPropertyKey, newPropertyKey);

        // A copy is returned instead of modifying original object.
        expect(renamed).not.toBe(originalObject);

        const {
            [originalPropertyKey]: _, // Trick: Delete the property to rename.
            ...unchangedProperties    // <--- all other unchanged properties are collected into a new object.
        } = originalObject;
        const expected: Record<PropertyKey, any> = {
            ...unchangedProperties,
            [newPropertyKey]: originalObject[originalPropertyKey],
        };

        // The copy should be equal to the original object, except the key is renamed.
        // This assertion does not check the order. The order is checked below.
        expect(renamed).toStrictEqual(expected);

        // Order is retained.
        expect(Object.keys(renamed)).toStrictEqual(
            originalKeyOrder
                .map((k) => k === originalPropertyKey ? newPropertyKey : k)
                .filter((k) => typeof k === 'string')
        );

        // Accessor field become data fields(i.e the descriptor of that property has no `get`).
        if (originalPropertyKey === 'x') {
            expect(Object.getOwnPropertyDescriptor(renamed, 'x')?.get).toBeUndefined();
        } else {
            expect(Object.getOwnPropertyDescriptor(renamed, newPropertyKey)?.get).toBeUndefined();
        }

        // The [[prototype]] slot is `Object`.
        expect(Object.getPrototypeOf(renamed)).toBe(Object.prototype);

        // Non-enumerable-own properties are excluded in the result.
        expect('pNonEnumerable' in renamed).toBe(false);
        expect('pNonOwn' in renamed).toBe(false);
        expect(nonEnumerableSymKey in renamed).toBe(false);
        expect(nonOwnSymKey in renamed).toBe(false);
    };

    // Rename a data field.
    checkOk('a', 'd');

    // Rename a data field from string key to symbol key.
    checkOk('a', Symbol());

    // Rename an accessor field.
    checkOk('x', 'x1');
});
