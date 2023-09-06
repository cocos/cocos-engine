/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { DEV, EDITOR, JSB, TEST } from 'internal:constants';
import { CCString, CCInteger, CCFloat, CCBoolean } from '../utils/attribute';
import { IExposedAttributes } from '../utils/attribute-defines';
import { LegacyPropertyDecorator, getSubDict, getClassCache, BabelPropertyDecoratorDescriptor, Initializer } from './utils';
import { warnID, errorID } from '../../platform/debug';
import { getFullFormOfProperty } from '../utils/preprocess-class';
import { ClassStash, PropertyStash, PropertyStashInternalFlag } from '../class-stash';
import { getClassName, mixin } from '../../utils/js-typed';

// eslint-disable-next-line @typescript-eslint/ban-types
export type SimplePropertyType = Function | string | typeof CCString | typeof CCInteger | typeof CCBoolean;

export type PropertyType = SimplePropertyType | SimplePropertyType[];

/**
 * @zh CCClass 属性选项。
 * @en CCClass property options
 */
export type IPropertyOptions = IExposedAttributes

/**
 * @en Declare as a CCClass property with options
 * @zh 声明属性为 CCClass 属性。
 * @param options property options
 */
export function property (options?: IPropertyOptions): LegacyPropertyDecorator;

/**
 * @en Declare as a CCClass property with the property type
 * @zh 标注属性为 cc 属性。<br/>
 * 等价于`@property({type})`。
 * @param type A [[ccclass]] type or a [[ValueType]]
 */
export function property (type: PropertyType): LegacyPropertyDecorator;

/**
 * @en Declare as a CCClass property
 * @zh 标注属性为 cc 属性。<br/>
 * 等价于`@property()`。
 */
export function property (...args: Parameters<LegacyPropertyDecorator>): void;

export function property (
    target?: Parameters<LegacyPropertyDecorator>[0] | PropertyType,
    propertyKey?: Parameters<LegacyPropertyDecorator>[1],
    descriptorOrInitializer?: Parameters<LegacyPropertyDecorator>[2],
): LegacyPropertyDecorator | undefined {
    let options: IPropertyOptions | PropertyType | null = null;
    function normalized (
        target: Parameters<LegacyPropertyDecorator>[0],
        propertyKey: Parameters<LegacyPropertyDecorator>[1],
        descriptorOrInitializer: Parameters<LegacyPropertyDecorator>[2],
    ): void {
        const classStash = getOrCreateClassStash(target);
        const propertyStash = getOrCreateEmptyPropertyStash(
            target,
            propertyKey,
        );
        const classConstructor = target.constructor as new () => unknown;
        mergePropertyOptions(
            classStash,
            propertyStash,
            classConstructor,
            propertyKey,
            options,
            descriptorOrInitializer,
        );
    }

    if (target === undefined) {
        // @property() => LegacyPropertyDecorator
        return property({
            type: undefined,
        });
    } else if (typeof propertyKey === 'undefined') {
        // @property(options) => LegacyPropertyDescriptor
        // @property(type) => LegacyPropertyDescriptor
        options = target;
        return normalized;
    } else {
        // @property
        normalized(target as Parameters<LegacyPropertyDecorator>[0], propertyKey, descriptorOrInitializer);
        return undefined;
    }
}

function getDefaultFromInitializer (initializer: Initializer): unknown {
    let value: unknown;
    try {
        value = initializer();
    } catch (e) {
        // just lazy initialize by CCClass
        return initializer;
    }
    if (typeof value !== 'object' || value === null) {
        // string boolean number function undefined null
        return value;
    } else {
        // The default attribute will not be used in the ES6 constructor actually,
        // so we don't need to simplify into `{}` or `[]` or vec2 completely.
        return initializer;
    }
}

function extractActualDefaultValues (classConstructor: new () => unknown): unknown {
    let dummyObj: unknown;
    try {
        // eslint-disable-next-line new-cap
        dummyObj = new classConstructor();
    } catch (e) {
        if (DEV) {
            // NOTE: here we use unknown e as a string, or sometheing supports toString() method.
            warnID(3652, getClassName(classConstructor), e as string);
        }
        return {};
    }
    return dummyObj;
}

function getOrCreateClassStash (target: Parameters<LegacyPropertyDecorator>[0]): ClassStash {
    const cache = getClassCache(target.constructor) as ClassStash;
    return cache;
}

function getOrCreateEmptyPropertyStash (
    target: Parameters<LegacyPropertyDecorator>[0],
    propertyKey: Parameters<LegacyPropertyDecorator>[1],
): PropertyStash {
    const classStash = getClassCache(target.constructor) as ClassStash;
    const ccclassProto = getSubDict(classStash, 'proto');
    const properties = getSubDict(ccclassProto, 'properties');
    const propertyStash = properties[(propertyKey as string)] ??= {} as PropertyStash;
    return propertyStash;
}

export function getOrCreatePropertyStash (
    target: Parameters<LegacyPropertyDecorator>[0],
    propertyKey: Parameters<LegacyPropertyDecorator>[1],
    descriptorOrInitializer?: Parameters<LegacyPropertyDecorator>[2],
): PropertyStash {
    const classStash = getClassCache(target.constructor) as ClassStash;
    const ccclassProto = getSubDict(classStash, 'proto');
    const properties = getSubDict(ccclassProto, 'properties');
    const propertyStash = properties[(propertyKey as string)] ??= {} as PropertyStash;
    propertyStash.__internalFlags |= PropertyStashInternalFlag.STANDALONE;
    if (descriptorOrInitializer && typeof descriptorOrInitializer !== 'function' && (descriptorOrInitializer.get || descriptorOrInitializer.set)) {
        if (descriptorOrInitializer.get) {
            propertyStash.get = descriptorOrInitializer.get;
        }
        if (descriptorOrInitializer.set) {
            propertyStash.set = descriptorOrInitializer.set;
        }
    } else {
        setDefaultValue(
            classStash,
            propertyStash,
            target.constructor as new () => unknown,
            propertyKey,
            descriptorOrInitializer,
        );
    }
    return propertyStash;
}

function mergePropertyOptions (
    cache: ClassStash,
    propertyStash: PropertyStash,
    ctor: new () => unknown,
    propertyKey: Parameters<LegacyPropertyDecorator>[1],
    options,
    descriptorOrInitializer: Parameters<LegacyPropertyDecorator>[2] | undefined,
): void {
    let fullOptions;
    const isGetset = descriptorOrInitializer && typeof descriptorOrInitializer !== 'function'
        && (descriptorOrInitializer.get || descriptorOrInitializer.set);
    if (options) {
        fullOptions = getFullFormOfProperty(options, isGetset);
    }
    const propertyRecord: PropertyStash = mixin(propertyStash, fullOptions || options || {}) as PropertyStash;

    if (isGetset) {
        // typescript or babel
        if (DEV && options && ((fullOptions || options).get || (fullOptions || options).set)) {
            const errorProps = getSubDict(cache, 'errorProps');
            if (!errorProps[(propertyKey as string)]) {
                errorProps[(propertyKey as string)] = true;
                warnID(3655, propertyKey as string, getClassName(ctor), propertyKey as string, propertyKey as string);
            }
        }
        if ((descriptorOrInitializer as BabelPropertyDecoratorDescriptor).get) {
            propertyRecord.get = (descriptorOrInitializer as BabelPropertyDecoratorDescriptor).get;
        }
        if ((descriptorOrInitializer as BabelPropertyDecoratorDescriptor).set) {
            propertyRecord.set = (descriptorOrInitializer as BabelPropertyDecoratorDescriptor).set;
        }
    } else { // Target property is non-accessor
        if (DEV && (propertyRecord.get || propertyRecord.set)) {
            // Specify "accessor options" for non-accessor property is forbidden.
            errorID(3655, propertyKey as string, getClassName(ctor), propertyKey  as string, propertyKey  as string);
            return;
        }

        setDefaultValue(
            cache,
            propertyRecord,
            ctor,
            propertyKey,
            descriptorOrInitializer,
        );

        if ((EDITOR && !window.Build) || TEST) {
            // eslint-disable-next-line no-prototype-builtins
            if (!fullOptions && options && options.hasOwnProperty('default')) {
                warnID(3653, propertyKey as string, getClassName(ctor));
            }
        }
    }
}

function setDefaultValue<T> (
    classStash: ClassStash,
    propertyStash: PropertyStash,
    classConstructor: new () => T,
    propertyKey: PropertyKey,
    descriptorOrInitializer: BabelPropertyDecoratorDescriptor | Initializer | undefined | null,
): void {
    if (descriptorOrInitializer !== undefined) {
        if (typeof descriptorOrInitializer === 'function') {
            propertyStash.default = getDefaultFromInitializer(descriptorOrInitializer);
        } else if (descriptorOrInitializer === null) {
            // For some decorated properties we haven't specified the default value, then the initializer should be null.
            // We fall back to the behavior of v3.6.3, where we don't specify the default value automatically.
            // propertyStash.default = undefined;
        } else if (descriptorOrInitializer.initializer) {
            // In the case of Babel, if an initializer is given for a class field.
            // That initializer is passed to `descriptor.initializer`.
            propertyStash.default = getDefaultFromInitializer(descriptorOrInitializer.initializer);
        }
    } else {
        // In the case of TypeScript, we can not directly capture the initializer.
        // We have to be hacking to extract the value.
        // We should fall back to the TypeScript case only when `descriptorOrInitializer` is undefined.
        const actualDefaultValues = classStash.default || (classStash.default = extractActualDefaultValues(classConstructor));
        // eslint-disable-next-line no-prototype-builtins
        if ((actualDefaultValues as any).hasOwnProperty(propertyKey)) {
            propertyStash.default = (actualDefaultValues as any)[propertyKey];
        }
    }
}
