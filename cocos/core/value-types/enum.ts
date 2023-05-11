/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { EDITOR, TEST, DEV } from 'internal:constants';
import { value } from '../utils/js';
import { legacyCC } from '../global-exports';
import { errorID } from '../platform/debug';
import { assertIsTrue } from '../data/utils/asserts';

export type EnumType = Record<string, string | number>;

interface EnumRegister {
    /**
     * `string` indicates the enumeration's name. `undefined` indicates the enumeration has no name.
     */
    name: string | undefined;

    /**
     * `null` if haven't not computed.
     */
    members: null | Enum.Member<EnumType>[];
}

const enumTypeRegistry = new WeakMap<EnumType, EnumRegister | null>();

const enumNameLookupMap = new Map<string, EnumType>();

/**
 * @en
 * Define an enum type. <br/>
 * If a enum item has a value of -1, it will be given an Integer number according to it's order in the list.<br/>
 * Otherwise it will use the value specified by user who writes the enum definition.
 *
 * @zh
 * 定义一个枚举类型。<br/>
 * 用户可以把枚举值设为任意的整数，如果设为 -1，系统将会分配为上一个枚举值 + 1。
 *
 * @param obj
 * @en A JavaScript literal object containing enum names and values, or a TypeScript enum type.
 * @zh 包含枚举名和值的 JavaScript literal 对象，或者是一个 TypeScript enum 类型。
 * @return @en The defined enum type. @zh 定义的枚举类型。
 */
export function Enum<T extends EnumType> (obj: T): T {
    if (enumTypeRegistry.has(obj)) {
        return obj;
    }
    ccenum(obj);
    return Enum.update(obj);
}

/**
 * @en
 * Update the enum object properties.
 * @zh
 * 更新枚举对象的属性列表。
 * @param obj @en The enum object to update. @zh 需要更新的枚举对象。
 */
Enum.update = <T extends EnumType> (obj: T): T => {
    let lastIndex = -1;
    const keys: string[] = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let val = obj[key];
        if (val === -1) {
            val = ++lastIndex;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error TS bug.
            obj[key] = val;
        } else if (typeof val === 'number') {
            lastIndex = val;
        } else if (typeof val === 'string' && Number.isInteger(parseFloat(key))) {
            continue;
        }
        const reverseKey = `${val}`;
        if (key !== reverseKey) {
            if ((EDITOR || TEST) && reverseKey in obj && obj[reverseKey] !== key) {
                errorID(7100, reverseKey);
                continue;
            }
            value(obj, reverseKey, key);
        }
    }
    const register = enumTypeRegistry.get(obj);
    if (register && Array.isArray(register.members)) {
        updateList(obj);
    }
    return obj;
};

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Enum {
    export interface Member<EnumT> {
        /**
         * The name of the member.
         */
        name: keyof EnumT;

        /**
         * The value of the member.
         */
        value: EnumT[keyof EnumT];
    }
}

/**
 * Determines if the object is an enum type.
 * @param enumType @en The object to judge. @zh 需要判断的对象。
 */
Enum.isEnum = <EnumT extends EnumType>(enumType: EnumT): boolean => enumType && enumTypeRegistry.has(enumType);

/**
 * @zh 获取枚举成员。
 * @en Get enum members.
 * @param enumType @en An enum type. @zh 枚举类型。
 */
Enum.getList = <EnumT extends EnumType>(enumType: EnumT): readonly Enum.Member<EnumT>[] => {
    const register = enumTypeRegistry.get(enumType);
    assertIsTrue(register);

    if (register.members) {
        return register.members as unknown as readonly Enum.Member<EnumT>[];
    }

    return updateList(enumType);
};

/**
 * @zh 更新枚举成员。
 * @en Update members.
 * @param enumType @en The enum type defined from [[Enum]] @zh 从[[Enum]]定义的枚举类型。
 * @return {Object[]}
 */
function updateList<EnumT extends EnumType> (enumType: EnumT): readonly Enum.Member<EnumT>[] {
    const register = enumTypeRegistry.get(enumType);
    assertIsTrue(register);
    const enums = (register.members || []);
    enums.length = 0;

    for (const name in enumType) {
        const v = enumType[name];
        if (Number.isInteger(v)) {
            enums.push({ name, value: v });
        }
    }
    enums.sort((a, b) => a.value as number - (b.value as number));
    register.members = enums;
    return enums as unknown as readonly Enum.Member<EnumT>[];
}

/**
 * Reorder the members in the enumeration type by compareFunction.
 * @param enumType @en The enum type defined from [[Enum]] @zh 从[[Enum]]定义的枚举类型。
 * @param compareFn @en Function used to determine the order of the elements. @zh 用于确定元素顺序的函数。
 */
Enum.sortList = <EnumT extends EnumType> (enumType: EnumT, compareFn: (a, b) => number): void => {
    const register = enumTypeRegistry.get(enumType);
    assertIsTrue(register);
    if (!Array.isArray(register.members)) {
        return;
    }
    register.members.sort(compareFn);
};

if (DEV) {
    // check key order in object literal
    const _TestEnum = Enum({
        ZERO: -1,
        ONE: -1,
        TWO: -1,
        THREE: -1,
    });
    if (_TestEnum.ZERO !== 0 || _TestEnum.ONE !== 1 || _TestEnum.THREE !== 3) {
        errorID(7101);
    }
}

/**
 * @zh 标记指定的枚举类型 `enumType` 为枚举，令 Creator 可以鉴别和鉴别它。
 * 正式来讲，此函数的调用会使得：
 * - `Enum.isEnum(enumType)` 返回 `true`；
 * - `Enum.getList(enumType)` 返回 `enumType`。
 *
 * @en
 * Make the enum type `enumType` as enumeration so that Creator may identify, operate on it.
 * Formally, as a result of invocation on this function with enum type `enumType`:
 * - `Enum.isEnum(enumType)` returns `true`;
 * - `Enum.getList(enumType)` returns the members of `enumType`.
 *
 * @param enumType
 * @en enumType An enum type, eg, a kind of type with similar semantic defined by TypeScript.
 * @zh 枚举类型，例如 TypeScript 中定义的类型。
 *
 * @param name
 * @zh 若指定且非空，注册该枚举类型为命名枚举。如果该枚举名已被注册，则此函数不生效。
 * @en If specified and not empty, registers this enumeration type as named enumeration.
 * If the name has already been registered, this function does not take effect.
 */
export function ccenum<EnumT extends EnumType> (enumType: EnumT, name?: string): void {
    const existingRegister = enumTypeRegistry.get(enumType);
    if (existingRegister) {
        const name = existingRegister.name;
        if (typeof name === 'string') {
            errorID(7103, name); // Want to register an already-registered named enum.
        } else {
            errorID(7104); // Want to register an already-registered anonymous enum.
        }
        return;
    }
    if (name) {
        const existing = enumNameLookupMap.get(name);
        if (existing) {
            errorID(7102, name); // Want to override the already-assigned name.
            return;
        }
        enumNameLookupMap.set(name, enumType);
    }
    enumTypeRegistry.set(enumType, {
        name: name || undefined,
        members: null,
    });
}

/**
 * @zh 注销枚举类型。
 * @en Un-registers an enumeration type.
 * @param name @zh 枚举名称。 @en Name of the enumeration.
 */
export function unregisterEnum (name: string): void {
    const enumType = enumNameLookupMap.get(name);
    if (enumType) {
        enumNameLookupMap.delete(name);
        enumTypeRegistry.delete(enumType);
    }
}

/**
 * @zh
 * 通过名称查找枚举类型。
 * @zn
 * Finds enumeration type by name.
 * @param name @zh 要查找的名称。 @en Name to find.
 * @returns @zh 若找到，返回枚举类型；否则返回 `undefined`。 @en The enumeration type if found, `undefined` otherwise.
 */
export function findEnum (name: string): EnumType | undefined {
    return enumNameLookupMap.get(name);
}

/**
 * @zh
 * 获取枚举类型的名称。
 * @zn
 * Gets name of an enumeration.
 * @param enumType @zh 枚举类型。 @en The enumeration type.
 * @returns @zh 如该枚举存在名称，返回起名称；否则返回 `undefined`。 @en Name of the enumeration if found, `undefined` otherwise.
 */
export function getEnumName<EnumT extends EnumType> (enumType: EnumT): string | undefined {
    return enumTypeRegistry.get(enumType)?.name;
}

legacyCC.Enum = Enum;
