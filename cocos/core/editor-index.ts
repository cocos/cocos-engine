import { assertIsTrue } from './data/utils/asserts';
import { DEBUG } from 'internal:constants';

type UnknownConstructor = new(...args: unknown[]) => unknown;

/**
 * @zh 获取指定 cc 类上声明的所有 cc 属性（连同了基类的 cc 属性）的名称。
 * @zh Gets names of all cc properties(including those from base classes) on specified cc class.
 * @param constructor @zh 类的构造函数。 @zh The class's constructor.
 * @returns @zh 一个只读数组，包括了所有 cc 属性的名称。 @en A readonly array containing names of all cc properties.
 * @note
 *   @zh 如果该类不是 cc 类，行为是未定义的。
 *   @en The behavior is undefined if the class is not a cc class.
 */
export function getCCPropertyNames(constructor: UnknownConstructor): readonly string[] {
    if (DEBUG) {
        assertIsTrue(Array.isArray((constructor as UnknownConstructor & {
            __props__: string[];
        }).__props__), `${constructor} is not a cc class.`);
    }

    return (constructor as UnknownConstructor & {
        __props__: string[];
    }).__props__;
}
