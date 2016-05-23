/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en
 *  cc.NodePool is the cache pool designed for node type.<br/>
 *  It can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
 *
 * It's recommended to create cc.NodePool instances by node type, the type corresponds to node type in game design, not the class, 
 * for example, a prefab is a specific node type. <br/>
 * When you create a node pool, you can pass a Component which contains `unuse`, `reuse` functions to control the content of node.<br/>
 *
 * Some common use case is :<br/>
 *      1. Bullets in game (die very soon, massive creation and recreation, no side effect on other objects)<br/>
 *      2. Blocks in candy crash (massive creation and recreation)<br/>
 *      etc...
 * !#zh
 * cc.NodePool 是用于管理节点对象的对象缓存池。<br/>
 * 它可以帮助您提高游戏性能，适用于优化对象的反复创建和销毁<br/>
 *
 * 建议为每种节点分别实例化一个缓冲池，这里的种类对应于游戏中的节点设计，一个 prefab 相当于一个种类的节点。<br/>
 * 在创建缓冲池时，可以传入一个包含 unuse, reuse 函数的组件类型用于节点的回收和复用逻辑。<br/>
 *
 * 一些常见的用例是：<br/>
 *      1.在游戏中的子弹（死亡很快，频繁创建，对其他对象无副作用）<br/>
 *      2.糖果粉碎传奇中的木块（频繁创建）。
 *      等等....
 * @class NodePool
 * @param {Function|String} poolHandlerComp The constructor or the class name of the component to control the unuse/reuse logic.
 * @constructor
 */
cc.NodePool = function (poolHandlerComp) {
    /**
     * !#en The pool handler component, it could be the class name or the constructor.
     * !#zh 缓冲池处理组件，用于节点的回收和复用逻辑，这个属性可以是组件类名或组件的构造函数。
     * @property poolHandlerComp
     * @type {Function|String}
     */
    this.poolHandlerComp = poolHandlerComp;
    this._pool = [];
};
cc.NodePool.prototype = {
    constructor: cc.NodePool,

    /**
     * !#en The current available size in the pool
     * !#zh 获取当前缓冲池的可用对象数量
     * @method size
     */
    size: function () {
        return this._pool.length;
    },

    /**
     * !#en Put a new Node into the pool.
     * It will automatically remove the node from its parent without cleanup.
     * It will also invoke unuse method of the poolHandlerComp if exist.
     * !#zh 向缓冲池中存入一个不再需要的节点对象。
     * 这个函数会自动将目标节点从父节点上移除，但是不会进行 cleanup 操作。
     * 这个函数会调用 poolHandlerComp 的 unuse 函数，如果组件和函数都存在的话。
     * @method put
     */
    put: function (obj) {
        if (obj && this._pool.indexOf(obj) === -1) {
            // Remove from parent, but don't cleanup
            obj.removeFromParent(false);

            // Invoke pool handler
            var handler = obj.getComponent(this.poolHandlerComp);
            if (handler && handler.unuse) {
                handler.unuse();
            }

            this._pool.push(obj);
        }
    },

    /**
     * !#en Get a obj from pool, if no available object in pool, null will be returned.
     * This function will invoke the reuse function of poolHandlerComp if exist.
     * !#zh 获取对象池中的对象，如果对象池没有可用对象，则返回空。
     * 这个函数会调用 poolHandlerComp 的 reuse 函数，如果组件和函数都存在的话。
     * @method get
     * @return {Object|null}
     */
    get: function () {
        var last = this._pool.length-1;
        if (last < 0) {
            return null;
        }
        else {
            // Pop the last object in pool
            var obj = this._pool[last];
            this._pool.length = last;

            // Invoke pool handler
            var handler = obj.getComponent(this.poolHandlerComp);
            if (handler && handler.reuse) {
                handler.reuse.apply(handler, arguments);
            }
            return obj;
        }
    }
};

module.exports = cc.NodePool;