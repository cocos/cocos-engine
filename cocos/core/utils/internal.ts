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
    if (!Object.prototype.propertyIsEnumerable.call(object, originalPropertyKey)) {
        return object;
    }
    if (newPropertyKey in object) {
        return object;
    }

    const result = {} as T;

    if (typeof originalPropertyKey === 'symbol') {
        (Object.entries(object)).forEach(([k, v]) => {
            result[k as keyof T] = v;
        });
        Object.getOwnPropertySymbols(object).forEach((k) => {
            result[k === originalPropertyKey ? newPropertyKey : k as keyof T] = object[k as keyof T];
        });
    } else {
        Object.entries(object).forEach(([k, v]) => {
            result[k === originalPropertyKey ? newPropertyKey : k as keyof T] = v;
        });
        Object.getOwnPropertySymbols(object).forEach((k) => {
            result[k as keyof T] = object[k as keyof T];
        });
    }

    return result;
}
