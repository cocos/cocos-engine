/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en Class for prefab handling.
 * !#zh 预制资源类。
 * @class Prefab
 * @extends Asset
 */
var Prefab = cc.Class({
    name: 'cc.Prefab',
    extends: cc.Asset,

    properties: {
        /**
         * @property {Node} data - the main cc.Node in the prefab
         */
        data: null,

        /**
         * !#en Indicates the raw assets of this prefab can be load after prefab loaded.
         * !#zh 指示该 Prefab 依赖的资源可否在 Prefab 加载后再延迟加载。
         * @property {Boolean} asyncLoadAssets
         * @default false
         */
        asyncLoadAssets: undefined,

        /**
         * Cache function for fast instantiation
         * @property {Function} _createFunction
         * @private
         */
        _createFunction: {
            default: null,
            serializable: false
        }
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
        // instantiate node
        var node = this._doInstantiate();
        // initialize node
        this.data._instantiate(node);
        // link prefab in editor
        if (CC_EDITOR || CC_TEST) {
            // This operation is not necessary, but some old prefab asset may not contain complete data.
            _Scene.PrefabUtils.linkPrefab(this, node);
        }
        return node;
    }
});

cc.Prefab = module.exports = Prefab;
cc.js.obsolete(cc, 'cc._Prefab', 'Prefab');
