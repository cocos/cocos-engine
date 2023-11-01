import { Enum, findEnum, getEnumName, unregisterEnum } from "../../cocos/core/value-types/enum";
import { ccenum } from "../../exports/base";
import { captureErrorIDs } from '../utils/log-capture';

test(`Enum registration`, () => {
    const errorIDWatcher = captureErrorIDs();

    // `ccenum()` not providing name does **NOT** assign a name to that enum.
    enum AnonymousEnum1 {}
    ccenum(AnonymousEnum1);
    expect(getEnumName(AnonymousEnum1)).toBeUndefined();

    // `ccenum()` with an empty string does **NOT** assign a name to that enum.
    {
        enum AnonymousEnum2 {}
        ccenum(AnonymousEnum2, '');
        expect(getEnumName(AnonymousEnum2)).toBeUndefined();
        expect(findEnum('')).toBeUndefined();
    }

    // `ccenum()` with a non-empty name does assign a name to that enum.
    enum Enum3 {}
    ccenum(Enum3, 'SomeEnum');
    expect(Enum.isEnum(Enum3)).toBe(true);
    expect(getEnumName(Enum3)).toBe('SomeEnum');
    expect(findEnum(getEnumName(Enum3)!)).toBe(Enum3);

    // Registering an already-registered named enum **abort the registration**, errors are logged.
    {
        for (const name of [undefined, '', 'SomeEnum', 'SomeAbsentEnumName'] as const) {
            ccenum(Enum3, name);
            // Errors are logged.
            expect(errorIDWatcher.captured).toStrictEqual([
                [7103, 'SomeEnum'],
            ]);
            errorIDWatcher.clear();
            // The already-existing enum is not effected.
            expect(Enum.isEnum(Enum3)).toBe(true);
            expect(getEnumName(Enum3)).toBe('SomeEnum');
            expect(findEnum(getEnumName(Enum3)!)).toBe(Enum3);
        }
    }

    // Registering an already-registered anonymous enum **abort the registration**, errors are logged.
    {
        for (const name of [undefined, '', 'SomeEnum', 'SomeAbsentEnumName'] as const) {
            ccenum(AnonymousEnum1, name);
            // Errors are logged.
            expect(errorIDWatcher.captured).toStrictEqual([
                [7104],
            ]);
            errorIDWatcher.clear();
            // The already-existing enum is not effected.
            expect(Enum.isEnum(AnonymousEnum1)).toBe(true);
            expect(getEnumName(AnonymousEnum1)).toBeUndefined();
        }
    }

    // `ccenum()` with an already existing name **abort the registration**, errors are logged.
    {
        enum UnregisteredEnum {}
        for (const enumType of [
            UnregisteredEnum,
        ] as const) {
            ccenum(enumType, 'SomeEnum');
            // Errors are logged.
            expect(errorIDWatcher.captured).toStrictEqual([
                [7102, 'SomeEnum'],
            ]);
            errorIDWatcher.clear();
        }
        // The registration failed.
        expect(Enum.isEnum(UnregisteredEnum)).toBe(false);
        expect(getEnumName(UnregisteredEnum)).toBeUndefined();
        // The already-existing enum is not effected.
        expect(Enum.isEnum(Enum3)).toBe(true);
        expect(getEnumName(Enum3)).toBe('SomeEnum');
        expect(findEnum(getEnumName(Enum3)!)).toBe(Enum3);
    }

    // Unregister a named enum.
    unregisterEnum(getEnumName(Enum3)!);
    expect(Enum.isEnum(Enum3)).toBe(false);
    expect(getEnumName(Enum3)).toBeUndefined();

    // Then the named enum can be registered again.
    ccenum(Enum3, 'Enum3_1');
    expect(Enum.isEnum(Enum3)).toBe(true);
    expect(getEnumName(Enum3)).toBe('Enum3_1');
    expect(findEnum(getEnumName(Enum3)!)).toBe(Enum3);
});