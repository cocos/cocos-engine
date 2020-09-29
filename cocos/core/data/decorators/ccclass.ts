/**
 * @category decorator
 */

import { js } from '../../utils/js';
import { DEV } from 'internal:constants';
import { CCClass } from '../class';
import { doValidateMethodWithProps_DEV } from '../utils/preprocess-class';
import { CACHE_KEY, makeSmartClassDecorator } from './utils';

/**
 * @en Declare a standard ES6 or TS Class as a CCClass, please refer to the [document](https://docs.cocos.com/creator3d/manual/zh/scripting/ccclass.html)
 * @zh 将标准写法的 ES6 或者 TS Class 声明为 CCClass，具体用法请参阅[类型定义](https://docs.cocos.com/creator3d/manual/zh/scripting/ccclass.html)。
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
    let base = js.getSuper(constructor);
    if (base === Object) {
        base = null;
    }

    const proto = {
        name,
        extends: base,
        ctor: constructor,
        __ES6__: true,
    };
    const cache = constructor[CACHE_KEY];
    if (cache) {
        const decoratedProto = cache.proto;
        if (decoratedProto) {
            // decoratedProto.properties = createProperties(ctor, decoratedProto.properties);
            js.mixin(proto, decoratedProto);
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
                    doValidateMethodWithProps_DEV(func, prop, js.getClassName(constructor), constructor, base);
                }
            }
        }
    }

    return res;
});

