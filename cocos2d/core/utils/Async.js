/**
 * Async Pool class, a helper of cc.async
 * @class AsyncPool
 * @constructor
 * @param {Object|Array} srcObj
 * @param {Number} limit the limit of parallel number
 * @param {Function} iterator
 * @param {Function} onEnd
 * @param {Object} target
 */
cc.AsyncPool = function(srcObj, limit, iterator, onEnd, target){
    var self = this;
    self._srcObj = srcObj;
    self._limit = limit;
    self._pool = [];
    self._iterator = iterator;
    self._iteratorTarget = target;
    self._onEnd = onEnd;
    self._onEndTarget = target;
    self._results = srcObj instanceof Array ? [] : {};

    cc.each(srcObj, function(value, index){
        self._pool.push({index : index, value : value});
    });

    self.size = self._pool.length;
    self.finishedSize = 0;
    self._workingSize = 0;

    self._limit = self._limit || self.size;

    self.onIterator = function(iterator, target){
        self._iterator = iterator;
        self._iteratorTarget = target;
    };

    self.onEnd = function(endCb, endCbTarget){
        self._onEnd = endCb;
        self._onEndTarget = endCbTarget;
    };

    self._handleItem = function(){
        var self = this;
        if(self._pool.length === 0 || self._workingSize >= self._limit)
            return;                                                         //return directly if the array's length = 0 or the working size great equal limit number

        var item = self._pool.shift();
        var value = item.value, index = item.index;
        self._workingSize++;
        self._iterator.call(self._iteratorTarget, value, index,
            function(err) {

                self.finishedSize++;
                self._workingSize--;

                var arr = Array.prototype.slice.call(arguments, 1);
                self._results[this.index] = arr[0];
                if (self.finishedSize === self.size) {
                    if (self._onEnd)
                        self._onEnd.call(self._onEndTarget, err, self._results);
                    return;
                }
                self._handleItem();
            }.bind(item),
            self);
    };

    self.flow = function(){
        var self = this;
        if(self._pool.length === 0) {
            if(self._onEnd)
                self._onEnd.call(self._onEndTarget, null, []);
            return;
        }
        for(var i = 0; i < self._limit; i++)
            self._handleItem();
    }
};

/**
 * @class async
 */
cc.async = /** @lends cc.async# */{
    /**
     * Do tasks series.
     * @method series
     * @param {Array|Object} tasks
     * @param {Function} [cb] - callback
     * @param {Object} [target]
     * @return {AsyncPool}
     */
    series : function(tasks, cb, target){
        var asyncPool = new cc.AsyncPool(tasks, 1, function(func, index, cb1){
            func.call(target, cb1);
        }, cb, target);
        asyncPool.flow();
        return asyncPool;
    },

    /**
     * Do tasks parallel.
     * @method parallel
     * @param {Array|Object} tasks
     * @param {Function} cb - callback
     * @param {Object} [target]
     * @return {AsyncPool}
     */
    parallel : function(tasks, cb, target){
        var asyncPool = new cc.AsyncPool(tasks, 0, function(func, index, cb1){
            func.call(target, cb1);
        }, cb, target);
        asyncPool.flow();
        return asyncPool;
    },

    /**
     * Do tasks waterfall.
     * @method waterfall
     * @param {Array|Object} tasks
     * @param {Function} cb - callback
     * @param {Object} [target]
     * @return {AsyncPool}
     */
    waterfall : function(tasks, cb, target){
        var args = [];
        var lastResults = [null];//the array to store the last results
        var asyncPool = new cc.AsyncPool(tasks, 1,
            function (func, index, cb1) {
                args.push(function (err) {
                    args = Array.prototype.slice.call(arguments, 1);
                    if(tasks.length - 1 === index) lastResults = lastResults.concat(args);//while the last task
                    cb1.apply(null, arguments);
                });
                func.apply(target, args);
            }, function (err) {
                if (!cb)
                    return;
                if (err)
                    return cb.call(target, err);
                cb.apply(target, lastResults);
            });
        asyncPool.flow();
        return asyncPool;
    },

    /**
     * Do tasks by iterator.
     * @method map
     * @param {Array|Object} tasks
     * @param {Function|Object} iterator
     * @param {Function} [callback]
     * @param {Object} [target]
     * @return {AsyncPool}
     */
    map : function(tasks, iterator, callback, target){
        var locIterator = iterator;
        if(typeof(iterator) === "object"){
            callback = iterator.cb;
            target = iterator.iteratorTarget;
            locIterator = iterator.iterator;
        }
        var asyncPool = new cc.AsyncPool(tasks, 0, locIterator, callback, target);
        asyncPool.flow();
        return asyncPool;
    },

    /**
     * Do tasks by iterator limit.
     * @method mapLimit
     * @param {Array|Object} tasks
     * @param {Number} limit
     * @param {Function} iterator
     * @param {Function} cb callback
     * @param {Object} [target]
     */
    mapLimit : function(tasks, limit, iterator, cb, target){
        var asyncPool = new cc.AsyncPool(tasks, limit, iterator, cb, target);
        asyncPool.flow();
        return asyncPool;
    }
};