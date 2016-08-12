/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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
 *  Attention: In creator, it's strongly not recommended to use cc.pool to manager cc.Node.
 *  We provided {{#crossLink "NodePool"}}cc.NodePool{{/crossLink}} instead.
 * 
 *  cc.pool is a singleton object serves as an object cache pool.<br/>
 *  It can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
 * !#zh
 * 首先请注意，在 Creator 中我们强烈不建议使用 cc.pool 来管理 cc.Node 节点对象，请使用 {{#crossLink "NodePool"}}cc.NodePool{{/crossLink}} 代替
 * 因为 cc.pool 是面向类来设计的，而 cc.Node 中使用 Component 来进行组合，它的类永远都一样，实际却千差万别。
 *
 * cc.pool 是一个单例对象，用作为对象缓存池。<br/>
 * 它可以帮助您提高游戏性能，适用于优化对象的反复创建和销毁<br/>
 * @class pool
 * @deprecated !#en Please use cc.NodePool instead !#zh 请使用 cc.NodePool 代替
 */
cc.pool = /** @lends cc.pool# */{
    _pool: {},

    _releaseCB: function () {
        this.release();
    },

    _autoRelease: function (obj) {
        var running = obj._running === undefined ? false : !obj._running;
        cc.director.getScheduler().schedule(this._releaseCB, obj, 0, 0, 0, running);
    },

    /**
     * !#en Put the obj in pool.
     * !#zh 加入对象到对象池中。
     * @method putInPool
     * @param {Object} obj - The need put in pool object.
     * @example {@link utils/api/engine/docs/extensions/ccpool/putInPool.js}
     */
    putInPool: function (obj) {
        var cid = cc.js._getClassId(obj.constructor);
        if (!cid) {
            return;
        }
        if (!this._pool[cid]) {
            this._pool[cid] = [];
        }
        // JSB retain to avoid being auto released
        CC_JSB && obj.retain && obj.retain();
        // User implementation for disable the object
        obj.unuse && obj.unuse();
        this._pool[cid].push(obj);
    },

    /**
     * !#en Check if this kind of obj has already in pool.
     * !#zh 检查对象池中是否有指定对象的存在。
     * @method hasObject
     * @param {Object} objClass - The check object class.
     * @returns {Boolean} If this kind of obj is already in pool return true,else return false.
     */
    hasObject: function (objClass) {
        var cid = cc.js._getClassId(objClass);
        var list = this._pool[cid];
        if (!list || list.length === 0) {
            return false;
        }
        return true;
    },

    /**
     * !#en Remove the obj if you want to delete it.
     * !#zh 移除在对象池中指定的对象。
     * @method removeObject
     */
    removeObject: function (obj) {
        var cid = cc.js._getClassId(obj.constructor);
        if (cid) {
            var list = this._pool[cid];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (obj === list[i]) {
                        // JSB release to avoid memory leak
                        CC_JSB && obj.release && obj.release();
                        list.splice(i, 1);
                    }
                }
            }
        }
    },

    /**
     * !#en Get the obj from pool.
     * !#zh 获取对象池中的指定对象。
     * @method getFromPool
     * @returns {*} Call the reuse function an return the obj.
     */
    getFromPool: function (objClass/*,args*/) {
        if (this.hasObject(objClass)) {
            var cid = cc.js._getClassId(objClass);
            var list = this._pool[cid];
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            var obj = list.pop();
            // User implementation for re-enable the object
            obj.reuse && obj.reuse.apply(obj, args);
            // JSB release to avoid memory leak
            CC_JSB && obj.release && this._autoRelease(obj);
            return obj;
        }
    },

    /**
     *  !#en Remove all objs in pool and reset the pool.
     *  !#zh 移除对象池中的所有对象，并且重置对象池。
     *  @method drainAllPools
     */
    drainAllPools: function () {
        if (CC_JSB) {
            for (var i in this._pool) {
                for (var j = 0; j < this._pool[i].length; j++) {
                    var obj = this._pool[i][j];
                    // JSB release to avoid memory leak
                    obj.release && obj.release();
                }
            }
        }
        this._pool = {};
    }
};