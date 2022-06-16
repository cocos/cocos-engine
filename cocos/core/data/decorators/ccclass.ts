/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { DEV } from 'internal:constants';
import { js } from '../../utils/js';
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
    let base = js.getSuper(constructor);
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
