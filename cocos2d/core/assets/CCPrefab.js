/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

/**
 * !#zh
 * Prefab 创建实例所用的优化策略，配合 {{#crossLink "Prefab.optimizationPolicy"}}cc.Prefab#optimizationPolicy{{/crossLink}} 使用。
 * !#en
 * An enumeration used with the {{#crossLink "Prefab.optimizationPolicy"}}cc.Prefab#optimizationPolicy{{/crossLink}}
 * to specify how to optimize the instantiate operation.
 *
 * @enum Prefab.OptimizationPolicy
 * @since 1.10.0
 */
var OptimizationPolicy = cc.Enum({
    /**
     * !#zh
     * 根据创建次数自动调整优化策略。初次创建实例时，行为等同 SINGLE_INSTANCE，多次创建后将自动采用 MULTI_INSTANCE。
     * !#en
     * The optimization policy is automatically chosen based on the number of instantiations.
     * When you first create an instance, the behavior is the same as SINGLE_INSTANCE. MULTI_INSTANCE will be automatically used after multiple creation.
     * @property {Number} AUTO
     */
    AUTO: 0,
    /**
     * !#zh
     * 优化单次创建性能。<br>
     * 该选项会跳过针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般只会创建一个实例时，请选择此项。
     * !#en
     * Optimize for single instance creation.<br>
     * This option skips code generation for this prefab.
     * When this prefab will usually create only one instances, please select this option.
     * @property {Number} SINGLE_INSTANCE
     */
    SINGLE_INSTANCE: 1,
    /**
     * !#zh
     * 优化多次创建性能。<br>
     * 该选项会启用针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般会创建多个实例时，请选择此项。如果该 prefab 在场景中的节点启用了自动关联，并且在场景中有多份实例，也建议选择此项。
     * !#en
     * Optimize for creating instances multiple times.<br>
     * This option enables code generation for this prefab.
     * When this prefab will usually create multiple instances, please select this option.
     * It is also recommended to select this option if the prefab instance in the scene has Auto Sync enabled and there are multiple instances in the scene.
     * @property {Number} MULTI_INSTANCE
     */
    MULTI_INSTANCE: 2,
});

/**
 * !#en Class for prefab handling.
 * !#zh 预制资源类。
 * @class Prefab
 * @extends Asset
 */
var Prefab = cc.Class({
    name: 'cc.Prefab',
    extends: cc.Asset,
    ctor () {
        /**
         * Cache function to optimize instance creaton.
         * @property {Function} _createFunction
         * @private
         */
        this._createFunction = null;

        this._instantiatedTimes = 0;
    },

    properties: {
        /**
         * @property {Node} data - the main cc.Node in the prefab
         */
        data: null,

        /**
         * !#zh
         * 设置实例化这个 prefab 时所用的优化策略。根据使用情况设置为合适的值，能优化该 prefab 实例化所用的时间。
         * !#en
         * Indicates the optimization policy for instantiating this prefab.
         * Set to a suitable value based on usage, can optimize the time it takes to instantiate this prefab.
         *
         * @property {Prefab.OptimizationPolicy} optimizationPolicy
         * @default Prefab.OptimizationPolicy.AUTO
         * @since 1.10.0
         * @example
         * prefab.optimizationPolicy = cc.Prefab.OptimizationPolicy.MULTI_INSTANCE;
         */
        optimizationPolicy: OptimizationPolicy.AUTO,

        /**
         * !#en Indicates the raw assets of this prefab can be load after prefab loaded.
         * !#zh 指示该 Prefab 依赖的资源可否在 Prefab 加载后再延迟加载。
         * @property {Boolean} asyncLoadAssets
         * @default false
         */
        asyncLoadAssets: false,

        /**
         * @property {Boolean} readonly
         * @default false
         */
        readonly: {
            default: false,
            editorOnly: true
        }
    },

    statics: {
        OptimizationPolicy,
        OptimizationPolicyThreshold: 3,
    },

    createNode: CC_EDITOR && function (cb) {
        var node = cc.instantiate(this);
        node.name = this.name;
        cb(null, node);
    },

    /**
     * Dynamically translation prefab data into minimized code.<br/>
     * This method will be called automatically before the first time the prefab being instantiated,
     * but you can re-call to refresh the create function once you modified the original prefab data in script.
     * @method compileCreateFunction
     */
    compileCreateFunction: function () {
        var jit = require('../platform/instantiate-jit');
        this._createFunction = jit.compile(this.data);
    },

    // just instantiate, will not initialize the Node, this will be called during Node's initialization.
    // @param {Node} [rootToRedirect] - specify an instantiated prefabRoot that all references to prefabRoot in prefab
    //                                  will redirect to
    _doInstantiate: function (rootToRedirect) {
        if (this.data._prefab) {
            // prefab asset is always synced
            this.data._prefab._synced = true;
        }
        else {
            // temp guard code
            cc.warnID(3700);
        }
        if (!this._createFunction) {
            this.compileCreateFunction();
        }
        return this._createFunction(rootToRedirect);  // this.data._instantiate();
    },

    _instantiate: function () {
        var node, useJit = false;
        if (CC_SUPPORT_JIT) {
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

        // link prefab in editor
        if (CC_EDITOR || CC_TEST) {
            var PrefabUtils = Editor.require('scene://utils/prefab');
            // This operation is not necessary, but some old prefab asset may not contain complete data.
            PrefabUtils.linkPrefab(this, node);
        }
        return node;
    },

    destroy () {
        this.data && this.data.destroy();
        this._super();
    },
});

cc.Prefab = module.exports = Prefab;
cc.js.obsolete(cc, 'cc._Prefab', 'Prefab');
