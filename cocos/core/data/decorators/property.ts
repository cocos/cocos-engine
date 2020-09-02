/**
 * @category decorator
 */

import { CCString, CCInteger, CCFloat, CCBoolean } from '../utils/attribute';
import { IExposedAttributes } from '../utils/attribute-defines';
import { LegacyPropertyDecorator, getSubDict, getClassCache } from './utils';
import { warnID, errorID } from '../../platform/debug';
import { js } from '../../utils/js';
import { DEV } from 'internal:constants';
import { getFullFormOfProperty } from '../utils/preprocess-class';

export type SimplePropertyType = Function | string | typeof CCString | typeof CCInteger | typeof CCFloat | typeof CCBoolean;

export type PropertyType = SimplePropertyType | SimplePropertyType[];

/**
 * @zh CCClass 属性选项。
 * @en CCClass property options
 */
export interface IPropertyOptions extends IExposedAttributes {
}

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
        const cache = getClassCache(target.constructor);
        if (cache) {
            const ccclassProto = getSubDict(cache, 'proto');
            const properties = getSubDict(ccclassProto, 'properties');
            genProperty(target.constructor, properties, propertyKey, options, descriptor, cache);
        }
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
    }
}

function getDefaultFromInitializer (initializer) {
    let value;
    try {
        value = initializer();
    }
    catch (e) {
        // just lazy initialize by CCClass
        return initializer;
    }
    if (typeof value !== 'object' || value === null) {
        // string boolean number function undefined null
        return value;
    }
    else {
        // The default attribute will not be used in ES6 constructor actually,
        // so we dont need to simplify into `{}` or `[]` or vec2 completely.
        return initializer;
    }
}

function extractActualDefaultValues (ctor) {
    let dummyObj;
    try {
        dummyObj = new ctor();
    }
    catch (e) {
        if (DEV) {
            warnID(3652, js.getClassName(ctor), e);
        }
        return {};
    }
    return dummyObj;
}

function genProperty (
    ctor,
    properties,
    propertyKey: Parameters<LegacyPropertyDecorator>[1],
    options,
    descriptor: Parameters<LegacyPropertyDecorator>[2] | undefined,
    cache,
) {
    let fullOptions;
    if (options) {
        fullOptions = DEV ? getFullFormOfProperty(options, propertyKey, js.getClassName(ctor)) :
            getFullFormOfProperty(options);
        fullOptions = fullOptions || options;
    }
    const existsPropertyRecord = properties[propertyKey];
    const propertyRecord = js.mixin(existsPropertyRecord || {}, fullOptions || {});

    if (descriptor && (descriptor.get || descriptor.set)) { // If the target property is accessor
        // typescript or babel
        if (DEV && options && (options.get || options.set)) {
            const errorProps = getSubDict(cache, 'errorProps');
            if (!errorProps[propertyKey]) {
                errorProps[propertyKey] = true;
                warnID(3655, propertyKey, js.getClassName(ctor), propertyKey, propertyKey);
            }
        }
        if (descriptor.get) {
            propertyRecord.get = descriptor.get;
        }
        if (descriptor.set) {
            propertyRecord.set = descriptor.set;
        }
    } else { // Target property is non-accessor
        if (DEV && (propertyRecord.get || propertyRecord.set)) {
            // Specify "accessor options" for non-accessor property is forbidden.
            errorID(3655, propertyKey, js.getClassName(ctor), propertyKey, propertyKey);
            return;
        }

        let defaultValue: any;
        let isDefaultValueSpecified = false;
        if (descriptor) {
            // In case of Babel, if an initializer is given for class field.
            // That initializer is passed to `descriptor.initializer`.
            // babel
            if (descriptor.initializer) {
                defaultValue = getDefaultFromInitializer(descriptor.initializer);
                isDefaultValueSpecified = true;
            }
        } else {
            // In case of TypeScript, we can not directly capture the initializer.
            // We have to be hacking to extract the value.
            const actualDefaultValues = cache.default || (cache.default = extractActualDefaultValues(ctor));
            if (actualDefaultValues.hasOwnProperty(propertyKey)) {
                defaultValue = actualDefaultValues[propertyKey];
                isDefaultValueSpecified = true;
            }
        }

        if (DEV) {
            if (options && options.hasOwnProperty('default')) {
                warnID(3653, propertyKey, js.getClassName(ctor));
            } else if (!isDefaultValueSpecified) {
                warnID(3654, js.getClassName(ctor), propertyKey);
            }
        }

        propertyRecord.default = defaultValue;
    }

    properties[propertyKey] = propertyRecord;
}