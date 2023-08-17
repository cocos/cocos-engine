/**
 * @zh
 * 重命名对象[自身的、可枚举的](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)指定属性，并且保持原本的属性顺序。
 * @en
 * Renames an [enumerable own](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)
 * property but also retains the original property order.
 *
 * @param object @zh 原始对象。 @en The original object.
 * @param originalPropertyKey @zh 要重命名的属性的原始键。@en Original key of the property to rename.
 * @param newPropertyKey @zh 要重命名的属性的新键。@en New key of the property to rename.
 * @returns
 * @zh 若重命名成功，返回新的对象；否则返回原始对象。
 * @en A new object which is a copy of original object if rename succeed, otherwise the original object.
 *
 * @description
 * @zh
 * 若原始键不存在、原始属性不是自身可枚举属性或新键已存在，此函数视重命名为失败，会直接返回原始对象。
 * 若可以重命名，则此函数返回原始对象的 **拷贝**。
 * 在拷贝时，使用 `[[Set]]` 语义，且仅会拷贝那些自身的、可枚举的属性，因此，本函数更适合用来重命名纯字典对象的属性。
 * @en
 * If the original key does not exist,
 * or the original property is not enumerable own property,
 * or the new property has already existed,
 * this function treats the renaming as failure and returns the original object directly.
 * Otherwise, the rename succeeds, this function returns a **copy** of original object.
 * For the copying, `[[Set]]` semantic would be used. Only those enumerable own properties would be copied.
 * That's why this function is suggested to used to rename properties of pure dictionary objects.
 *
 * @example
 * @zh
 * ```ts
 * // 成功重命名，属性顺序保留
 * const original = { a: 1, b: 2, c: 3 };
 * Object.defineProperty(original, 'x', { value: '', enumerable: false });
 * console.log(original); // {a: 1, b: 2, c: 3, x: ''}
 *
 * const renamed = renameObjectProperty(original, 'b', 'd');
 * console.log(original === renamed) // false
 * console.log(original); // {a: 1, d: 2, c: 3}
 * console.log(Object.entries(renamed)) // [['a', 1], ['d', 2], ['c', 3]]
 *
 * // 重命名失败：原始键不存在
 * console.log(renameObjectProperty(original, 'e', 'f') === original); // true
 * // 重命名失败：新键已存在
 * console.log(renameObjectProperty(original, 'e', 'a') === original); // true
 * // 重命名失败：原始键对应的属性不是自身可枚举的
 * console.log(renameObjectProperty(original, 'x', 'x1') === original); // true
 * ```
 * @en
 * ```ts
 * // Rename succeed, key order is retained.
 * const original = { a: 1, b: 2, c: 3 };
 * Object.defineProperty(original, 'x', { value: '', enumerable: false });
 * console.log(original); // {a: 1, b: 2, c: 3, x: ''}
 *
 * const renamed = renameObjectProperty(original, 'b', 'd');
 * console.log(original === renamed) // false
 * console.log(original); // {a: 1, d: 2, c: 3}
 * console.log(Object.entries(renamed)) // [['a', 1], ['d', 2], ['c', 3]]
 *
 * // Rename failed: the original key does not exist.
 * console.log(renameObjectProperty(original, 'e', 'f') === original); // true
 * // Rename failed: the new key has already existed.
 * console.log(renameObjectProperty(original, 'e', 'a') === original); // true
 * // Rename failed: the corresponding original property is not enumerable own property.
 * console.log(renameObjectProperty(original, 'x', 'x1') === original); // true
 * ```
 */
export function renameObjectProperty<T extends Record<PropertyKey, any>> (
    object: T,
    originalPropertyKey: keyof T,
    newPropertyKey: keyof T,
): T {
    const { propertyIsEnumerable } = Object.prototype;

    if (!propertyIsEnumerable.call(object, originalPropertyKey)) {
        return object;
    }

    if (newPropertyKey in object) {
        return object;
    }

    const result = {} as T;

    if (typeof originalPropertyKey === 'symbol') {
        (Object.entries(object)).forEach(([k, v]): void => {
            result[k as keyof T] = v;
        });
        Object.getOwnPropertySymbols(object).forEach((k): void => {
            if (!propertyIsEnumerable.call(object, k)) {
                return;
            }
            result[k === originalPropertyKey ? newPropertyKey : k as keyof T] = object[k as keyof T];
        });
    } else {
        Object.entries(object).forEach(([k, v]): void => {
            result[k === originalPropertyKey ? newPropertyKey : k as keyof T] = v;
        });
        Object.getOwnPropertySymbols(object).forEach((k): void => {
            if (!propertyIsEnumerable.call(object, k)) {
                return;
            }
            result[k as keyof T] = object[k as keyof T];
        });
    }

    return result;
}

/**
 * @zh
 * 创建一个代理对象 `c` 以使得 `o instanceof c`，其中 `o instanceof constructor === true`。
 * 这个函数用于防止 `new constructor` 但保持 `instanceof` 的可用性。
 * @en
 * Creates a proxy object `c` so that `o instanceof c`, where `o instanceof constructor === true`.
 * This function is used to prevent from `new constructor` in the same time keep `instanceof` usable.
 *
 * @param constructor @zh 要代理的构造函数。 @en The constructor to proxy.
 *
 * @returns @zh 代理对象。 @en The proxy object.
 *
 * @note
 * @zh 如果系统不支持这样的代理，会直接返回 `constructor`。
 * @en If such proxy is not available in current system. `constructor` is directly returned.
 *
 * @example
 * @zh
 * ```ts
 * // 这是你的类，你希望用户不能直接去 `new Foo`，而是只能通过你提供的其它方式创建 `Foo` 的实例。
 * // 但同时，你想保证 `Foo` 的实例能使用 `instanceof`。
 * class Foo {}
 * function createFoo() { return new Foo(); }
 *
 * /// 你可以这样：
 *
 * const FooProxy = createInstanceOfProxy(Foo); // 创建 `Foo` 的代理
 * export { FooProxy as Foo }; // 并不想给用户造成困扰，所以我们改名后再暴露出去
 *
 * /// 外部如此使用：
 *
 * new FooProxy(); // 这句会抛出异常
 *                 // 达到了我们的目的：不允许直接 `new Foo`
 * console.log(createFoo() instanceof FooProxy); // 输出 "true"
 *                                               // 达到了我们的目的：可以使用 `instanceof`
 * ```
 * @en
 * ```ts
 * // This is your class.
 * // You expect users not to `new Foo` directly
 * // but instead only create instances of `Foo` in other manners you provided.
 * // In the mean time, you expect the `instanceof` to be available on instances of `Foo`.
 * class Foo {}
 * function createFoo() { return new Foo(); }
 *
 * /// You can try these:
 *
 * const FooProxy = createInstanceOfProxy(Foo); // Create a proxy for `Foo`
 * export { FooProxy as Foo }; // Don't bother users, so rename then export.
 *
 * /// Users may use like these:
 *
 * new FooProxy(); // This will throw
 *                 // This is what we want to achieve: `new Foo` is not allowed
 * console.log(createFoo() instanceof FooProxy); // Print "true"
 *                                               // This is what we want to achieve: `instanceof` is available
 * ```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const createInstanceofProxy = ((): CreateInstanceofProxySignature => {
    // Test if we can proxy the instanceof operator by
    // [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance).
    //
    // This symbol was introduced in ES2015 and has been supported in most platforms:
    // https://caniuse.com/?search=Symbol.hasInstance
    // To guarantee we won't suffer from platform issue, we do check here.
    let isSymbolHasInstanceAvailable = false;
    try {
        class Array1 { static [Symbol.hasInstance] (instance: unknown): boolean { return Array.isArray(instance); } }
        isSymbolHasInstanceAvailable = ([] instanceof Array1);
    } catch {
        isSymbolHasInstanceAvailable = false;
    }

    // If `Symbol.hasInstance` is not available, fallback to return the original constructor.
    if (!isSymbolHasInstanceAvailable) {
        return (constructor): any => constructor;
    }

    // Otherwise, proxy it.
    return (constructor): any => {
        function InstanceOfProxy (): void {
            throw new Error(`This function can not be called as a constructor.`);
        }

        Object.defineProperty(InstanceOfProxy, Symbol.hasInstance, {
            value (instance: unknown): boolean {
                return instance instanceof constructor;
            },
        });

        return InstanceOfProxy as unknown as typeof constructor;
    };
})();

// May be hacky?
type ExcludeConstructor<T> = T;

// eslint-disable-next-line @typescript-eslint/ban-types
type CreateInstanceofProxySignature = <TConstructor extends Function> (constructor: TConstructor) => ExcludeConstructor<TConstructor>;
