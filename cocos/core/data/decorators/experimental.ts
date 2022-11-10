import { warnID } from '../../platform';

/**
 * @en Marks a class method as experimental.
 * @zh 标记类方法为实验性质的。
 * @engineInternal
 * @example
 * ```ts
 * class Meow {
 *   \@experimental
 *   fn() {}
 * }
 * ```
 */
export const experimental: MethodDecorator = (target, propertyKey, descriptor) => {
    let called = false;
    const vendor = descriptor.value;
    const targetName = target.constructor.name;
    // eslint-disable-next-line func-names
    descriptor.value = function (this: unknown, ...args: unknown[]) {
        if (!called) {
            called = true;
            warnID(101, targetName, propertyKey);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/ban-types
        return Function.prototype.apply.call(vendor as unknown as Function, this, args);
    } as unknown as typeof vendor;
};
