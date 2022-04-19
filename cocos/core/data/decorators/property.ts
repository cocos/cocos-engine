/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module decorator
 */

import { DEV, EDITOR, TEST } from 'internal:constants';
import { CCString, CCInteger, CCFloat, CCBoolean } from '../utils/attribute';
import { IExposedAttributes } from '../utils/attribute-defines';
import { LegacyPropertyDecorator, getSubDict, getClassCache, BabelPropertyDecoratorDescriptor } from './utils';
import { warnID, errorID } from '../../platform/debug';
import { js } from '../../utils/js';
import { getFullFormOfProperty } from '../utils/preprocess-class';
import { ClassStash, PropertyStash, PropertyStashInternalFlag } from '../class-stash';

export type SimplePropertyType = Function | string | typeof CCString | typeof CCInteger | typeof CCFloat | typeof CCBoolean;

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
 * @param type A {{ccclass}} type or a {{ValueType}}
 */
export function property (type: PropertyType): LegacyPropertyDecorator;

/**
 * @en Declare as a CCClass property
 * @zh 标注属性为 cc 属性。<br/>
 * 等价于`@property()`。
 */
export function property (...args: Parameters<LegacyPropertyDecorator>): void;

export function property (
    target?: Parameters<LegacyPropertyDecorator>[0],
    propertyKey?: Parameters<LegacyPropertyDecorator>[1],
    descriptor?: Parameters<LegacyPropertyDecorator>[2],
) {
    let options: IPropertyOptions | PropertyType | null = null;
    function normalized (
        target: Parameters<LegacyPropertyDecorator>[0],
        propertyKey: Parameters<LegacyPropertyDecorator>[1],
        descriptor: Parameters<LegacyPropertyDecorator>[2],
    ) {
        const classStash = getOrCreateClassStash(target);
        const propertyStash = getOrCreateEmptyPropertyStash(
            target,
            propertyKey,
        );
        const classConstructor = target.constructor;
        mergePropertyOptions(
            classStash,
            propertyStash,
            classConstructor,
            propertyKey,
            options,
            descriptor,
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
        normalized(target, propertyKey, descriptor);
        return undefined;
    }
}

function getDefaultFromInitializer (initializer: () => unknown) {
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
        // The default attribute will not be used in ES6 constructor actually,
        // so we don't need to simplify into `{}` or `[]` or vec2 completely.
        return initializer;
    }
}

function extractActualDefaultValues (classConstructor: new () => unknown) {
    let dummyObj: unknown;
    try {
        // eslint-disable-next-line new-cap
        dummyObj = new classConstructor();
    } catch (e) {
        if (DEV) {
            warnID(3652, js.getClassName(classConstructor), e);
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
    descriptor?: BabelPropertyDecoratorDescriptor,
): PropertyStash {
    const classStash = getClassCache(target.constructor) as ClassStash;
    const ccclassProto = getSubDict(classStash, 'proto');
    const properties = getSubDict(ccclassProto, 'properties');
    const propertyStash = properties[(propertyKey as string)] ??= {} as PropertyStash;
    propertyStash.__internalFlags |= PropertyStashInternalFlag.STANDALONE;
    if (descriptor && (descriptor.get || descriptor.set)) {
        if (descriptor.get) {
            propertyStash.get = descriptor.get;
        }
        if (descriptor.set) {
            propertyStash.set = descriptor.set;
        }
    } else {
        setDefaultValue(
            classStash,
            propertyStash,
            target.constructor as new () => unknown,
            propertyKey,
            descriptor,
        );
    }
    return propertyStash;
}

function mergePropertyOptions (
    cache: ClassStash,
    propertyStash: PropertyStash,
    ctor,
    propertyKey: Parameters<LegacyPropertyDecorator>[1],
    options,
    descriptor: Parameters<LegacyPropertyDecorator>[2] | undefined,
) {
    let fullOptions;
    const isGetset = descriptor && (descriptor.get || descriptor.set);
    if (options) {
        fullOptions = getFullFormOfProperty(options, isGetset);
    }
    const propertyRecord: PropertyStash = js.mixin(propertyStash, fullOptions || options || {});

    if (isGetset) {
        // typescript or babel
        if (DEV && options && ((fullOptions || options).get || (fullOptions || options).set)) {
            const errorProps = getSubDict(cache, 'errorProps');
            if (!errorProps[(propertyKey as string)]) {
                errorProps[(propertyKey as string)] = true;
                warnID(3655, propertyKey, js.getClassName(ctor), propertyKey, propertyKey);
            }
        }
        if (descriptor!.get) {
            propertyRecord.get = descriptor!.get;
        }
        if (descriptor!.set) {
            propertyRecord.set = descriptor!.set;
        }
    } else { // Target property is non-accessor
        if (DEV && (propertyRecord.get || propertyRecord.set)) {
            // Specify "accessor options" for non-accessor property is forbidden.
            errorID(3655, propertyKey, js.getClassName(ctor), propertyKey, propertyKey);
            return;
        }

        setDefaultValue(
            cache,
            propertyRecord,
            ctor,
            propertyKey,
            descriptor,
        );

        if ((EDITOR && !window.Build) || TEST) {
            if (!fullOptions && options && options.hasOwnProperty('default')) {
                warnID(3653, propertyKey, js.getClassName(ctor));
            }
        }
    }
}

function setDefaultValue<T> (
    classStash: ClassStash,
    propertyStash: PropertyStash,
    classConstructor: new () => T,
    propertyKey: PropertyKey,
    descriptor: BabelPropertyDecoratorDescriptor | undefined,
) {
    if (descriptor) {
        // In case of Babel, if an initializer is given for class field.
        // That initializer is passed to `descriptor.initializer`.
        // babel
        if (descriptor.initializer) {
            propertyStash.default = getDefaultFromInitializer(descriptor.initializer);
        }
    } else {
        // In case of TypeScript, we can not directly capture the initializer.
        // We have to be hacking to extract the value.
        const actualDefaultValues = classStash.default || (classStash.default = extractActualDefaultValues(classConstructor));
        // eslint-disable-next-line no-prototype-builtins
        if ((actualDefaultValues as any).hasOwnProperty(propertyKey)) {
            propertyStash.default = (actualDefaultValues as any)[propertyKey];
        }
    }
}
