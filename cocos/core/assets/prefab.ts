/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

/**
 * @category asset
 */

import { ccclass, property } from '../data/class-decorator';
import { compile } from '../data/instantiate-jit';
import { obsolete } from '../utils/js';
import { Enum } from '../value-types';
import { Asset } from './asset';
import { SUPPORT_JIT, ALIPAY, RUNTIME_BASED } from 'internal:constants';
import { legacyCC } from '../global-exports';

/**
 * Prefab 创建实例所用的优化策略，配合 [[optimizationPolicy]] 使用。
 *
 * @enum Prefab.OptimizationPolicy
 * @since 1.10.0
 */
const OptimizationPolicy = Enum({
    /**
     * 根据创建次数自动调整优化策略。初次创建实例时，行为等同 SINGLE_INSTANCE，多次创建后将自动采用 MULTI_INSTANCE。
     * @property {Number} AUTO
     */
    AUTO: 0,
    /**
     * 优化单次创建性能。<br>
     * 该选项会跳过针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般只会创建一个实例时，请选择此项。
     * @property {Number} SINGLE_INSTANCE
     */
    SINGLE_INSTANCE: 1,
    /**
     * 优化多次创建性能。<br>
     * 该选项会启用针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般会创建多个实例时，请选择此项。如果该 prefab 在场景中的节点启用了自动关联，并且在场景中有多份实例，也建议选择此项。
     * @property {Number} MULTI_INSTANCE
     */
    MULTI_INSTANCE: 2,
});

/**
 * @en Class for prefab handling.
 * @zh 预制资源类。
 */
@ccclass('cc.Prefab')
export default class Prefab extends Asset {

    public static OptimizationPolicy = OptimizationPolicy;

    public static OptimizationPolicyThreshold = 3;
    /**
     * @property {Node} data - the main cc.Node in the prefab
     */
    @property
    public data: any = null;

    /**
     * @zh
     * 设置实例化这个 prefab 时所用的优化策略。根据使用情况设置为合适的值，能优化该 prefab 实例化所用的时间。
     * @en
     * Indicates the optimization policy for instantiating this prefab.
     * Set to a suitable value based on usage, can optimize the time it takes to instantiate this prefab.
     *
     * @property {Prefab.OptimizationPolicy} optimizationPolicy
     * @default Prefab.OptimizationPolicy.AUTO
     * @since 1.10.0
     * @example
     * ```typescript
     * prefab.optimizationPolicy = cc.Prefab.OptimizationPolicy.MULTI_INSTANCE;
     * ```
     */
    @property
    public optimizationPolicy = OptimizationPolicy.AUTO;

    /**
     * @en Indicates the raw assets of this prefab can be load after prefab loaded.
     * @zh 指示该 Prefab 依赖的资源可否在 Prefab 加载后再延迟加载。
     * @default false
     */
    @property
    public asyncLoadAssets: Boolean = false;

    private _createFunction: Function | null;
    private _instantiatedTimes: number;
    constructor () {
        super();
        /**
         * Cache function to optimize instance creaton.
         * @property {Function} _createFunction
         * @private
         */
        this._createFunction = null;

        this._instantiatedTimes = 0;
    }

    public createNode (cb: Function): void {
        const node = legacyCC.instantiate(this);
        node.name = this.name;
        cb(null, node);
    }

    /**
     * @en
     * Dynamically translation prefab data into minimized code.<br/>
     * This method will be called automatically before the first time the prefab being instantiated,<br/>
     * but you can re-call to refresh the create function once you modified the original prefab data in script.
     * @zh
     * 将预制数据动态转换为最小化代码。<br/>
     * 此方法将在第一次实例化预制件之前自动调用，<br/>
     * 但是您可以在脚本中修改原始预制数据后重新调用以刷新创建功能。
     */
    public compileCreateFunction (): void {
        this._createFunction = compile(this.data);
    }

    // just instantiate, will not initialize the Node, this will be called during Node's initialization.
    // @param {Node} [rootToRedirect] - specify an instantiated prefabRoot that all references to prefabRoot in prefab
    //                                  will redirect to
    private _doInstantiate (rootToRedirect?: any) {
        if (this.data._prefab) {
            // prefab asset is always synced
            this.data._prefab._synced = true;
        }
        else {
            // temp guard code
            legacyCC.warnID(3700);
        }
        if (!this._createFunction) {
            this.compileCreateFunction();
        }
        return this._createFunction!(rootToRedirect);  // this.data._instantiate();
    }

    private _instantiate () {
        let node;
        let useJit: Boolean = false;
        if (SUPPORT_JIT) {
            if (this.optimizationPolicy === OptimizationPolicy.SINGLE_INSTANCE) {
                useJit = false;
            }
            else if (this.optimizationPolicy === OptimizationPolicy.MULTI_INSTANCE) {
                useJit = true;
            }
            else {
                // auto
                useJit = (this._instantiatedTimes + 1) >= Prefab.OptimizationPolicyThreshold;
            }
        }
        if (useJit) {
            // instantiate node
            node = this._doInstantiate();
            // initialize node
            this.data._instantiate(node);
        }
        else {
            // prefab asset is always synced
            this.data._prefab._synced = true;
            // instantiate node
            node = this.data._instantiate();
        }
        ++this._instantiatedTimes;

        return node;
    }
}

legacyCC.Prefab = Prefab;
if (ALIPAY || RUNTIME_BASED) {
    legacyCC._Prefab = Prefab;
} else {
    obsolete(legacyCC, 'cc._Prefab', 'Prefab');
}
