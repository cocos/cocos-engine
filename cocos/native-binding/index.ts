/* eslint-disable @typescript-eslint/no-namespace */
// @ts-expect-error this is a virtual module
export * from 'internal:native';

/**
 * @zh 该对象提供由原生绑定出来的 JavaScript 接口。
 * 注意：全局作用域下的 `jsb` 对象已经废弃，我们更推荐使用由 `cc` 模块下导出的 `native` 对象。
 * 该对象是前者的子集，我们开放了一些开发者真正需要的原生接口，例如文件，反射等接口。
 * 使用之前需要先通过 `NATIVE` 宏判断该接口在平台上是否支持。
 *
 * @en This object provides the JavaScript interface bound from the native.
 * Note: `jsb` object in global scope is deprecated, we recommend using the exported `native` object from `cc` module.
 * This object is a subset of the former, we open some interfaces that the developer really needs, such as file, reflection, etc.
 * Before using, you need to check whether the interface is supported on the platform with the `NATIVE` constant.
 *
 * @example
 * ```ts
 * import { native } from 'cc';
 * import { NATIVE } from 'cc/env';
 *
 * if (NATIVE) {
 *    native.reflection.callStaticMethod( ...args );
 * }
 * ```
 */
export declare namespace native {

}
