/**
 * @category decorator
 */

import { LegacyPropertyDecorator } from './utils';
import { property } from './property';
import { CCString, CCInteger, CCFloat, CCBoolean, PrimitiveType } from '../utils/attribute';

/**
 * @en Declare the property as integer
 * @zh 将该属性标记为整数。
 */
export const integer = type(CCInteger);

/**
 * @en Declare the property as float
 * @zh 将该属性标记为浮点数。
 */
export const float = type(CCFloat);

/**
 * @en Declare the property as boolean
 * @zh 将该属性标记为布尔值。
 */
export const boolean = type(CCBoolean);

/**
 * @en Declare the property as string
 * @zh 将该属性标记为字符串。
 */
export const string = type(CCString);

/**
 * @en Declare the property as the given type
 * @zh 标记该属性的类型。
 * @param type
 */
export function type (type: Function | [Function] | any): PropertyDecorator;

export function type<T> (type: PrimitiveType<T> | [PrimitiveType<T>]): PropertyDecorator;

export function type<T> (type: PrimitiveType<T> | Function | [PrimitiveType<T>] | [Function]): LegacyPropertyDecorator {
    return property({
        type,
    });
}