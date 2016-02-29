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
 * <p>
 *  cc.pool is a singleton object serves as an object cache pool.<br/>
 *  It can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
 *  Some common use case is :<br/>
 *      1. Bullets in game (die very soon, massive creation and recreation, no side effect on other objects)<br/>
 *      2. Blocks in candy crash (massive creation and recreation)<br/>
 *      etc...
 * </p>
 *
 * @class pool
 */
cc.pool = /** @lends cc.pool# */{
    _pool: {},

    _releaseCB: function () {
        this.release();
    },

    _autoRelease: function (obj) {
        var running = obj._running === undefined ? false : !obj._running;
        cc.director.getScheduler().schedule(this._releaseCB, obj, 0, 0, 0, running)
    },

    /**
     * Put the obj in pool.
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
        obj.retain && obj.retain();
        // User implementation for disable the object
        obj.unuse && obj.unuse();
        this._pool[cid].push(obj);
    },

    /**
     * Check if this kind of obj has already in pool.
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
     * Remove the obj if you want to delete it.
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
                        obj.release && obj.release();
                        list.splice(i, 1);
                    }
                }
            }
        }
    },

    /**
     * Get the obj from pool.
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
            cc.sys.isNative && obj.release && this._autoRelease(obj);
            return obj;
        }
    },

    /**
     *  Remove all objs in pool and reset the pool.
     *  @method drainAllPools
     */
    drainAllPools: function () {
        for (var i in this._pool) {
            for (var j = 0; j < this._pool[i].length; j++) {
                var obj = this._pool[i][j];
                // JSB release to avoid memory leak
                obj.release && obj.release();
            }
        }
        this._pool = {};
    }
};