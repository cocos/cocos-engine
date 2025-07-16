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

import { EDITOR, TEST } from 'internal:constants';
import { emptyDecorator, LegacyPropertyDecorator } from './utils';
import { getOrCreatePropertyStash } from './property';
import { PropertyStash, PropertyStashInternalFlag } from '../class-stash';
import { getOrCreateSerializationMetadata } from '../serialization-metadata';

/**
 * True if the serialization feature is enabled in the current environment.
 * @engineInternal
 */
const WITH_SERIALIZATION = EDITOR || TEST;

/**
 * @engineInternal
 */
export const serializable: LegacyPropertyDecorator = (target, propertyKey, descriptorOrInitializer) => {
    const propertyStash = getOrCreatePropertyStash(target, propertyKey, descriptorOrInitializer);
    setImplicitSerializable(propertyStash);
};

/**
 * @engineInternal
 */
export function formerlySerializedAs (name: string): LegacyPropertyDecorator {
    return (target, propertyKey, descriptorOrInitializer): void => {
        const propertyStash = getOrCreatePropertyStash(target, propertyKey, descriptorOrInitializer);
        propertyStash.formerlySerializedAs = name;
        setImplicitSerializable(propertyStash);
    };
}

/**
 * @en
 * Marks the property as editor only.
 * @zh
 * 设置该属性仅在编辑器中生效。
 */
export const editorOnly: LegacyPropertyDecorator = (target, propertyKey, descriptorOrInitializer) => {
    const propertyStash = getOrCreatePropertyStash(target, propertyKey, descriptorOrInitializer);
    propertyStash.editorOnly = true;
    setImplicitSerializable(propertyStash);
};

function setImplicitSerializable (propertyStash: PropertyStash): void {
    propertyStash.__internalFlags |= PropertyStashInternalFlag.IMPLICIT_SERIALIZABLE;
}

/**
 * @en
 * Marks the target class as "uniquely referenced" which means, in the aspect of serialization,
 * no more than one object should reference the same instance of that class.
 * When serializing references to objects of such class,
 * they're treated as different objects even if they point to actually the same.
 * While deserializing, these two references would point two distinct objects.
 * For example:
 * ```ts
 * import { _decorator } from 'cc';
 * @_decorator.ccclass
 * @_decorator.uniquelyReferenced
 * class Foo { }
 *
 * @_decorator.ccclass
 * class Bar {
 *   @_decorator.property
 *   public foo = new Foo();
 * }
 *
 * const bar1 = new Bar();
 * const bar2 = new Bar();
 * bar2.foo = bar1.foo; // Programmatically let them reference to the same
 * ```
 * `bar1` and `bar2` reference to the same `Foo` object.
 * However, after deserializing, `bar1.foo === bar2.foo` always evaluates to `false`.
 * @zh
 * 将目标类标记为“被唯一引用”的，其意味着就序列化而言，不会有多个对象引用该类的同一实例。
 * 当序列化到该类的对象引用时，即使它们明面上指向同一对象，也会被当作是不同对象；
 * 而当反序列化后，这两个引用将指向截然不同的两个对象。
 * 例如：
 * ```ts
 * import { _decorator } from 'cc';
 * @_decorator.ccclass
 * @_decorator.uniquelyReferenced
 * class Foo { }
 *
 * @_decorator.ccclass
 * class Bar {
 *   @_decorator.property
 *   public foo = new Foo();
 * }
 *
 * const bar1 = new Bar();
 * const bar2 = new Bar();
 * bar2.foo = bar1.foo; // 由程序逻辑让它们引用同一个对象
 * ```
 * `bar1` 和 `bar2` 引用同一个 `Foo` 对象。
 * 但在反序列化之后，`bar1.foo === bar2.foo` 永不成立。
 */
export const uniquelyReferenced: ClassDecorator = !WITH_SERIALIZATION
    ? emptyDecorator
    // eslint-disable-next-line func-names, @typescript-eslint/ban-types
    : function uniquelyReferenced<TFunction extends Function> (constructor: TFunction): void {
        const metadata = getOrCreateSerializationMetadata(constructor);
        metadata.uniquelyReferenced = true;
    };
