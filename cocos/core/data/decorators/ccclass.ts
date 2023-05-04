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

import { DEV } from 'internal:constants';
import { getSuper, mixin, getClassName, transferCCClassIdAndName } from '../../utils/js-typed';
import { CCClass } from '../class';
import { doValidateMethodWithProps_DEV } from '../utils/preprocess-class';
import { CACHE_KEY, makeSmartClassDecorator } from './utils';

/**
 * @en Declare a standard class as a CCClass, please refer to the [document](https://docs.cocos.com/creator3d/manual/en/scripting/ccclass.html)
 * @zh 将标准写法的类声明为 CC 类，具体用法请参阅[类型定义](https://docs.cocos.com/creator3d/manual/zh/scripting/ccclass.html)。
 * @param name - The class name used for serialization.
 * @example
 * ```ts
 * import { _decorator, Component } from 'cc';
 * const {ccclass} = _decorator;
 *
 * // define a CCClass, omit the name
 *  @ccclass
 * class NewScript extends Component {
 *     // ...
 * }
 *
 * // define a CCClass with a name
 *  @ccclass('LoginData')
 * class LoginData {
 *     // ...
 * }
 * ```
 */
export const ccclass: ((name?: string) => ClassDecorator) & ClassDecorator = makeSmartClassDecorator<string>((constructor, name) => {
    let base = getSuper(constructor);
    if (base === Object) {
        base = null;
    }

    const proto = {
        name,
        extends: base,
        ctor: constructor,
    };
    const cache = constructor[CACHE_KEY];
    if (cache) {
        const decoratedProto = cache.proto;
        if (decoratedProto) {
            // decoratedProto.properties = createProperties(ctor, decoratedProto.properties);
            mixin(proto, decoratedProto);
        }
        constructor[CACHE_KEY] = undefined;
    }

    const res = CCClass(proto);

    // validate methods
    if (DEV) {
        const propNames = Object.getOwnPropertyNames(constructor.prototype);
        for (let i = 0; i < propNames.length; ++i) {
            const prop = propNames[i];
            if (prop !== 'constructor') {
                const desc = Object.getOwnPropertyDescriptor(constructor.prototype, prop);
                const func = desc && desc.value;
                if (typeof func === 'function') {
                    doValidateMethodWithProps_DEV(func, prop, getClassName(constructor), constructor, base);
                }
            }
        }
    }

    return res;
});

/**
 * @zh
 * 将指定构造函数上关联的所有 cc-class 相关的信息转移到新的构造函数上。
 *
 * 当你的类装饰器会返回新的类时，你需要调用此方法来转移所有 cc-class 相关的信息。
 *
 * @en
 * Transfers all cc-class information that was originally associated to specified constructor
 * instead to new constructor.
 *
 * If your class decorator is going to return a new class.
 * You have to invoke this methods to transfer all cc-class information to the new class.
 *
 * @param originalConstructor @zh 原始构造函数。 @en The original constructor.
 *
 * @param newConstructor @zh 新的接收 cc 属性构造函数。 @en The new constructor which accepts the properties.
 *
 * @example
 *
 * @zh
 * ```ts
 * const someClassDecorator: ClassDecorator = (constructor) => {
 *      class NewClass {}
 *      // 如果你缺少了下面的语句，得到的类不能再作为正常的 cc 类来用，
 *      // 比如，它不能再被序列化或展示在编辑器中。
 *      transferCCClass(constructor, NewClass);
 *      return NewClass;
 * };
 *
 * \@ccclass('SomeClass')
 * class SomeClass {
 *   \@property someProperty = '';
 * }
 * ```
 *
 * @en
 *
 * ```ts
 * const someClassDecorator: ClassDecorator = (constructor) => {
 *      class NewClass {}
 *      // If you missed the following statement,
 *      // the result class will not be able to used as a normal cc-class,
 *      // for example, will not be able to be serialized or be shown in editor.
 *      transferCCClass(constructor, NewClass);
 *      return NewClass;
 * };
 *
 * \@ccclass('SomeClass')
 * class SomeClass {
 *   \@property someProperty = '';
 * }
 * ```
 */
export function transferCCClass (
    // eslint-disable-next-line @typescript-eslint/ban-types
    originalConstructor: Function,

    // eslint-disable-next-line @typescript-eslint/ban-types
    newConstructor: Function,
) {
    // Transfer id and name in case of `@ccclass()` has already been applied on `originalConstructor`.
    transferCCClassIdAndName(originalConstructor, newConstructor);

    // These properties are injected before `@ccclass` is called.
    tryTransferConstructorProperty(originalConstructor, newConstructor, CACHE_KEY);

    // These properties are injected after `@ccclass` is called.
    tryTransferConstructorProperty(originalConstructor, newConstructor, '__props__');
    tryTransferConstructorProperty(originalConstructor, newConstructor, '__attrs__');
    tryTransferConstructorProperty(originalConstructor, newConstructor, '__values__');
    tryTransferConstructorProperty(originalConstructor, newConstructor, '__ctors__');
    tryTransferConstructorProperty(originalConstructor, newConstructor, '_sealed');
}

function tryTransferConstructorProperty (
    // eslint-disable-next-line @typescript-eslint/ban-types
    originalConstructor: Function,

    // eslint-disable-next-line @typescript-eslint/ban-types
    newConstructor: Function,

    propertyKey: typeof CACHE_KEY | '__props__' | '__attrs__' | '__values__' | '__ctors__' | '_sealed',
) {
    if (propertyKey in originalConstructor) {
        newConstructor[propertyKey] = originalConstructor[propertyKey];
        delete originalConstructor[propertyKey];
    }
}
