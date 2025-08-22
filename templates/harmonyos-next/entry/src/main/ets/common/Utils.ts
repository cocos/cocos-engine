/**
 * @en
 * A simple wrapper of `Object.create(null)` which ensures the return object have no prototype (and thus no inherited members).
 * This eliminates the need to make `hasOwnProperty` judgments when we look for values by key on the object,
 * which is helpful for performance in this case.
 * @zh
 * 该方法是对 `Object.create(null)` 的简单封装。
 * `Object.create(null)` 用于创建无 prototype （也就无继承）的空对象。
 * 这样我们在该对象上查找属性时，就不用进行 `hasOwnProperty` 判断，此时对性能提升有帮助。
 *
 * @param forceDictMode @en Apply the delete operator to newly created map object. This will let V8 put the object in
 * "dictionary mode" and disables creation of hidden classes. This will improve the performance of objects that are
 * constantly changing shape.
 * @zh 对新创建的地图对象应用删除操作。这将让V8将对象置于 "字典模式"，并禁止创建隐藏类。这将提高那些不断变化形状对象的性能。
 * @returns @en A newly map object. @zh 一个新的 map 对象。
 */
export function createMap (forceDictMode?: boolean): any {
  const map = Object.create(null);
  if (forceDictMode) {
    const INVALID_IDENTIFIER_1 = '.';
    const INVALID_IDENTIFIER_2 = '/';
    // assign dummy values on the object
    map[INVALID_IDENTIFIER_1] = 1;
    map[INVALID_IDENTIFIER_2] = 1;
    delete map[INVALID_IDENTIFIER_1];
    delete map[INVALID_IDENTIFIER_2];
  }
  return map;
}

export function patchConsoleAssert() {
  if (!(console as any).assert) {
    (console as any).assert = (cond, msg) => {
      if (!cond) {
        throw new Error(msg);
      }
    };
  }
}