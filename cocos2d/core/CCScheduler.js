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
 * @module cc
 */
const js = require('./platform/js');
const IdGenerater = require('./platform/id-generater');
const MAX_POOL_SIZE = 20;

var idGenerater = new IdGenerater('Scheduler');

//data structures
/*
 * A list double-linked list used for "updates with priority"
 * @class ListEntry
 * @param {Object} target not retained (retained by hashUpdateEntry)
 * @param {Number} priority
 * @param {Boolean} paused
 * @param {Boolean} markedForDeletion selector will no longer be called and entry will be removed at end of the next tick
 */
var ListEntry = function (target, priority, paused, markedForDeletion) {
    this.target = target;
    this.priority = priority;
    this.paused = paused;
    this.markedForDeletion = markedForDeletion;
};

var _listEntries = [];
ListEntry.get = function (target, priority, paused, markedForDeletion) {
    var result = _listEntries.pop();
    if (result) {
        result.target = target;
        result.priority = priority;
        result.paused = paused;
        result.markedForDeletion = markedForDeletion;
    }
    else {
        result = new ListEntry(target, priority, paused, markedForDeletion);
    }
    return result;
};
ListEntry.put = function (entry) {
    if (_listEntries.length < MAX_POOL_SIZE) {
        entry.target = null;
        _listEntries.push(entry);
    }
};

/*
 * A update entry list
 * @class HashUpdateEntry
 * @param {Array} list Which list does it belong to ?
 * @param {ListEntry} entry entry in the list
 * @param {Object} target hash key (retained)
 * @param {function} callback
 */
var HashUpdateEntry = function (list, entry, target, callback) {
    this.list = list;
    this.entry = entry;
    this.target = target;
    this.callback = callback;
};
var _hashUpdateEntries = [];
HashUpdateEntry.get = function (list, entry, target, callback) {
    var result = _hashUpdateEntries.pop();
    if (result) {
        result.list = list;
        result.entry = entry;
        result.target = target;
        result.callback = callback;
    }
    else {
        result = new HashUpdateEntry(list, entry, target, callback);
    }
    return result;
};
HashUpdateEntry.put = function (entry) {
    if (_hashUpdateEntries.length < MAX_POOL_SIZE) {
        entry.list = entry.entry = entry.target = entry.callback = null;
        _hashUpdateEntries.push(entry);
    }
};

//
/*
 * Hash Element used for "selectors with interval"
 * @class HashTimerEntry
 * @param {Array} timers
 * @param {Object} target  hash key (retained)
 * @param {Number} timerIndex
 * @param {Timer} currentTimer
 * @param {Boolean} currentTimerSalvaged
 * @param {Boolean} paused
 */
var HashTimerEntry = function (timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused) {
    var _t = this;
    _t.timers = timers;
    _t.target = target;
    _t.timerIndex = timerIndex;
    _t.currentTimer = currentTimer;
    _t.currentTimerSalvaged = currentTimerSalvaged;
    _t.paused = paused;
};
var _hashTimerEntries = [];
HashTimerEntry.get = function (timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused) {
    var result = _hashTimerEntries.pop();
    if (result) {
        result.timers = timers;
        result.target = target;
        result.timerIndex = timerIndex;
        result.currentTimer = currentTimer;
        result.currentTimerSalvaged = currentTimerSalvaged;
        result.paused = paused;
    }
    else {
        result = new HashTimerEntry(timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused);
    }
    return result;
};
HashTimerEntry.put = function (entry) {
    if (_hashTimerEntries.length < MAX_POOL_SIZE) {
        entry.timers = entry.target = entry.currentTimer = null;
        _hashTimerEntries.push(entry);
    }
};

/*
 * Light weight timer
 * @extends cc.Class
 */
function CallbackTimer () {
    this._lock = false;
    this._scheduler = null;
    this._elapsed = -1;
    this._runForever = false;
    this._useDelay = false;
    this._timesExecuted = 0;
    this._repeat = 0;
    this._delay = 0;
    this._interval = 0;

    this._target = null;
    this._callback = null;
}

var proto = CallbackTimer.prototype;

proto.initWithCallback = function (scheduler, callback, target, seconds, repeat, delay) {
    this._lock = false;
    this._scheduler = scheduler;
    this._target = target;
    this._callback = callback;

    this._elapsed = -1;
    this._interval = seconds;
    this._delay = delay;
    this._useDelay = (this._delay > 0);
    this._repeat = repeat;
    this._runForever = (this._repeat === cc.macro.REPEAT_FOREVER);
    return true;
};
/**
 * @return {Number} returns interval of timer
 */
proto.getInterval = function(){return this._interval;};
/**
 * @param {Number} interval set interval in seconds
 */
proto.setInterval = function(interval){this._interval = interval;};

/**
 * triggers the timer
 * @param {Number} dt delta time
 */
proto.update = function (dt) {
    if (this._elapsed === -1) {
        this._elapsed = 0;
        this._timesExecuted = 0;
    } else {
        this._elapsed += dt;
        if (this._runForever && !this._useDelay) {//standard timer usage
            if (this._elapsed >= this._interval) {
                this.trigger();
                this._elapsed = 0;
            }
        } else {//advanced usage
            if (this._useDelay) {
                if (this._elapsed >= this._delay) {
                    this.trigger();

                    this._elapsed -= this._delay;
                    this._timesExecuted += 1;
                    this._useDelay = false;
                }
            } else {
                if (this._elapsed >= this._interval) {
                    this.trigger();

                    this._elapsed = 0;
                    this._timesExecuted += 1;
                }
            }

            if (this._callback && !this._runForever && this._timesExecuted > this._repeat)
                this.cancel();
        }
    }
};

proto.getCallback = function(){
    return this._callback;
};

proto.trigger = function () {
    if (this._target && this._callback) {
        this._lock = true;
        this._callback.call(this._target, this._elapsed);
        this._lock = false;
    }
};

proto.cancel = function () {
    //override
    this._scheduler.unschedule(this._callback, this._target);
};

var _timers = [];
CallbackTimer.get = function () {
    return _timers.pop() || new CallbackTimer();
};
CallbackTimer.put = function (timer) {
    if (_timers.length < MAX_POOL_SIZE && !timer._lock) {
        timer._scheduler = timer._target = timer._callback = null;
        _timers.push(timer);
    }
};

/**
 * !#en
 * Scheduler is responsible of triggering the scheduled callbacks.<br/>
 * You should not use NSTimer. Instead use this class.<br/>
 * <br/>
 * There are 2 different types of callbacks (selectors):<br/>
 *     - update callback: the 'update' callback will be called every frame. You can customize the priority.<br/>
 *     - custom callback: A custom callback will be called every frame, or with a custom interval of time<br/>
 * <br/>
 * The 'custom selectors' should be avoided when possible. It is faster,
 * and consumes less memory to use the 'update callback'. *
 * !#zh
 * Scheduler 是负责触发回调函数的类。<br/>
 * 通常情况下，建议使用 cc.director.getScheduler() 来获取系统定时器。<br/>
 * 有两种不同类型的定时器：<br/>
 *     - update 定时器：每一帧都会触发。您可以自定义优先级。<br/>
 *     - 自定义定时器：自定义定时器可以每一帧或者自定义的时间间隔触发。<br/>
 * 如果希望每帧都触发，应该使用 update 定时器，使用 update 定时器更快，而且消耗更少的内存。
 *
 * @class Scheduler
 */
cc.Scheduler = function () {
    this._timeScale = 1.0;
    this._updatesNegList = [];  // list of priority < 0
    this._updates0List = [];    // list of priority == 0
    this._updatesPosList = [];  // list of priority > 0
    this._hashForUpdates = js.createMap(true);  // hash used to fetch quickly the list entries for pause, delete, etc
    this._hashForTimers = js.createMap(true);   // Used for "selectors with interval"
    this._currentTarget = null;
    this._currentTargetSalvaged = false;
    this._updateHashLocked = false; // If true unschedule will not remove anything from a hash. Elements will only be marked for deletion.

    this._arrayForTimers = [];  // Speed up indexing
    //this._arrayForUpdates = [];   // Speed up indexing
};

cc.Scheduler.prototype = {
    constructor: cc.Scheduler,
    //-----------------------private method----------------------

    _removeHashElement: function (element) {
        delete this._hashForTimers[element.target._id];
        var arr = this._arrayForTimers;
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === element) {
                arr.splice(i, 1);
                break;
            }
        }
        HashTimerEntry.put(element);
    },

    _removeUpdateFromHash: function (entry) {
        var targetId = entry.target._id;
        var self = this, element = self._hashForUpdates[targetId];
        if (element) {
            // Remove list entry from list
            var list = element.list, listEntry = element.entry;
            for (var i = 0, l = list.length; i < l; i++) {
                if (list[i] === listEntry) {
                    list.splice(i, 1);
                    break;
                }
            }

            delete self._hashForUpdates[targetId];
            ListEntry.put(listEntry);
            HashUpdateEntry.put(element);
        }
    },

    _priorityIn: function (ppList, listElement, priority) {
        for (var i = 0; i < ppList.length; i++){
            if (priority < ppList[i].priority) {
                ppList.splice(i, 0, listElement);
                return;
            }
        }
        ppList.push(listElement);
    },

    _appendIn: function (ppList, listElement) {
        ppList.push(listElement);
    },

    //-----------------------public method-------------------------
    /**
     * !#en This method should be called for any target which needs to schedule tasks, and this method should be called before any scheduler API usage.
     * This method will add a `_id` property if it doesn't exist.
     * !#zh 任何需要用 Scheduler 管理任务的对象主体都应该调用这个方法，并且应该在调用任何 Scheduler API 之前调用这个方法。
     * 这个方法会给对象添加一个 `_id` 属性，如果这个属性不存在的话。
     * @method enableForTarget
     * @param {Object} target
     */
    enableForTarget: function (target) {
        if (!target._id) {
            if (target.__instanceId) {
                cc.warnID(1513);
            }
            else {
                target._id = idGenerater.getNewId();
            }
        }
    },

    /**
     * !#en
     * Modifies the time of all scheduled callbacks.<br/>
     * You can use this property to create a 'slow motion' or 'fast forward' effect.<br/>
     * Default is 1.0. To create a 'slow motion' effect, use values below 1.0.<br/>
     * To create a 'fast forward' effect, use values higher than 1.0.<br/>
     * Note：It will affect EVERY scheduled selector / action.
     * !#zh
     * 设置时间间隔的缩放比例。<br/>
     * 您可以使用这个方法来创建一个 “slow motion（慢动作）” 或 “fast forward（快进）” 的效果。<br/>
     * 默认是 1.0。要创建一个 “slow motion（慢动作）” 效果,使用值低于 1.0。<br/>
     * 要使用 “fast forward（快进）” 效果，使用值大于 1.0。<br/>
     * 注意：它影响该 Scheduler 下管理的所有定时器。
     * @method setTimeScale
     * @param {Number} timeScale
     */
    setTimeScale: function (timeScale) {
        this._timeScale = timeScale;
    },

    /**
     * !#en Returns time scale of scheduler.
     * !#zh 获取时间间隔的缩放比例。
     * @method getTimeScale
     * @return {Number}
     */
    getTimeScale: function () {
        return this._timeScale;
    },

    /**
     * !#en 'update' the scheduler. (You should NEVER call this method, unless you know what you are doing.)
     * !#zh update 调度函数。(不应该直接调用这个方法，除非完全了解这么做的结果)
     * @method update
     * @param {Number} dt delta time
     */
    update: function (dt) {
        this._updateHashLocked = true;
        if(this._timeScale !== 1)
            dt *= this._timeScale;

        var i, list, len, entry;

        for(i=0,list=this._updatesNegList, len = list.length; i<len; i++){
            entry = list[i];
            if (!entry.paused && !entry.markedForDeletion)
                entry.target.update(dt);
        }

        for(i=0, list=this._updates0List, len=list.length; i<len; i++){
            entry = list[i];
            if (!entry.paused && !entry.markedForDeletion)
                entry.target.update(dt);
        }

        for(i=0, list=this._updatesPosList, len=list.length; i<len; i++){
            entry = list[i];
            if (!entry.paused && !entry.markedForDeletion)
                entry.target.update(dt);
        }

        // Iterate over all the custom selectors
        var elt, arr = this._arrayForTimers;
        for(i=0; i<arr.length; i++){
            elt = arr[i];
            this._currentTarget = elt;
            this._currentTargetSalvaged = false;

            if (!elt.paused){
                // The 'timers' array may change while inside this loop
                for (elt.timerIndex = 0; elt.timerIndex < elt.timers.length; ++(elt.timerIndex)){
                    elt.currentTimer = elt.timers[elt.timerIndex];
                    elt.currentTimerSalvaged = false;

                    elt.currentTimer.update(dt);
                    elt.currentTimer = null;
                }
            }

            // only delete currentTarget if no actions were scheduled during the cycle (issue #481)
            if (this._currentTargetSalvaged && this._currentTarget.timers.length === 0) {
                this._removeHashElement(this._currentTarget);
                --i;
            }
        }

        // delete all updates that are marked for deletion
        // updates with priority < 0
        for(i=0,list=this._updatesNegList; i<list.length; ){
            entry = list[i];
            if(entry.markedForDeletion)
                this._removeUpdateFromHash(entry);
            else
                i++;
        }

        for(i=0, list=this._updates0List; i<list.length; ){
            entry = list[i];
            if (entry.markedForDeletion)
                this._removeUpdateFromHash(entry);
            else
                i++;
        }

        for(i=0, list=this._updatesPosList; i<list.length; ){
            entry = list[i];
            if (entry.markedForDeletion)
                this._removeUpdateFromHash(entry);
            else
                i++;
        }

        this._updateHashLocked = false;
        this._currentTarget = null;
    },

    /**
     * !#en
     * <p>
     *   The scheduled method will be called every 'interval' seconds.<br/>
     *   If paused is YES, then it won't be called until it is resumed.<br/>
     *   If 'interval' is 0, it will be called every frame, but if so, it recommended to use 'scheduleUpdateForTarget:' instead.<br/>
     *   If the callback function is already scheduled, then only the interval parameter will be updated without re-scheduling it again.<br/>
     *   repeat let the action be repeated repeat + 1 times, use cc.macro.REPEAT_FOREVER to let the action run continuously<br/>
     *   delay is the amount of time the action will wait before it'll start. Unit: s.<br/>
     * </p>
     * !#zh
     * 指定回调函数，调用对象等信息来添加一个新的定时器。<br/>
     * 如果 paused 值为 true，那么直到 resume 被调用才开始计时。<br/>
     * 当时间间隔达到指定值时，设置的回调函数将会被调用。<br/>
     * 如果 interval 值为 0，那么回调函数每一帧都会被调用，但如果是这样，
     * 建议使用 scheduleUpdateForTarget 代替。<br/>
     * 如果回调函数已经被定时器使用，那么只会更新之前定时器的时间间隔参数，不会设置新的定时器。<br/>
     * repeat 值可以让定时器触发 repeat + 1 次，使用 cc.macro.REPEAT_FOREVER
     * 可以让定时器一直循环触发。<br/>
     * delay 值指定延迟时间，定时器会在延迟指定的时间之后开始计时，单位: 秒。
     * @method schedule
     * @param {Function} callback
     * @param {Object} target
     * @param {Number} interval
     * @param {Number} [repeat=cc.macro.REPEAT_FOREVER]
     * @param {Number} [delay=0]
     * @param {Boolean} paused
     * @example {@link cocos2d/core/CCScheduler/schedule.js}
     * @typescript
     * schedule(callback: Function, target: any, interval: number, repeat: number, delay: number, paused?: boolean): void
     * schedule(callback: Function, target: any, interval: number, paused?: boolean): void
     */
    schedule: function (callback, target, interval, repeat, delay, paused) {
        'use strict';
        if (typeof callback !== 'function') {
            var tmp = callback;
            callback = target;
            target = tmp;
        }
        //selector, target, interval, repeat, delay, paused
        //selector, target, interval, paused
        if (arguments.length === 4 || arguments.length === 5) {
            paused = !!repeat;
            repeat = cc.macro.REPEAT_FOREVER;
            delay = 0;
        }

        cc.assertID(target, 1502);

        var targetId = target._id;
        if (!targetId) {
            if (target.__instanceId) {
                cc.warnID(1513);
                targetId = target._id = target.__instanceId;
            }
            else {
                cc.errorID(1510);
            }
        }
        var element = this._hashForTimers[targetId];
        if (!element) {
            // Is this the 1st element ? Then set the pause level to all the callback_fns of this target
            element = HashTimerEntry.get(null, target, 0, null, null, paused);
            this._arrayForTimers.push(element);
            this._hashForTimers[targetId] = element;
        } else if (element.paused !== paused) {
            cc.warnID(1511);
        }

        var timer, i;
        if (element.timers == null) {
            element.timers = [];
        }
        else {
            for (i = 0; i < element.timers.length; ++i) {
                timer = element.timers[i];
                if (timer && callback === timer._callback) {
                    cc.logID(1507, timer.getInterval(), interval);
                    timer._interval = interval;
                    return;
                }
            }
        }

        timer = CallbackTimer.get();
        timer.initWithCallback(this, callback, target, interval, repeat, delay);
        element.timers.push(timer);

        if (this._currentTarget === element && this._currentTargetSalvaged) {
            this._currentTargetSalvaged = false;
        }
    },

    /**
     * !#en
     * Schedules the update callback for a given target,
     * During every frame after schedule started, the "update" function of target will be invoked.
     * !#zh
     * 使用指定的优先级为指定的对象设置 update 定时器。
     * update 定时器每一帧都会被触发，触发时自动调用指定对象的 "update" 函数。
     * 优先级的值越低，定时器被触发的越早。
     * @method scheduleUpdate
     * @param {Object} target
     * @param {Number} priority
     * @param {Boolean} paused
     */
    scheduleUpdate: function(target, priority, paused) {
        var targetId = target._id;
        if (!targetId) {
            if (target.__instanceId) {
                cc.warnID(1513);
                targetId = target._id = target.__instanceId;
            }
            else {
                cc.errorID(1510);
            }
        }
        var hashElement = this._hashForUpdates[targetId];
        if (hashElement && hashElement.entry){
            // check if priority has changed
            if (hashElement.entry.priority !== priority){
                if (this._updateHashLocked){
                    cc.logID(1506);
                    hashElement.entry.markedForDeletion = false;
                    hashElement.entry.paused = paused;
                    return;
                }else{
                    // will be added again outside if (hashElement).
                    this.unscheduleUpdate(target);
                }
            }else{
                hashElement.entry.markedForDeletion = false;
                hashElement.entry.paused = paused;
                return;
            }
        }

        var listElement = ListEntry.get(target, priority, paused, false);
        var ppList;

        // most of the updates are going to be 0, that's way there
        // is an special list for updates with priority 0
        if (priority === 0) {
            ppList = this._updates0List;
            this._appendIn(ppList, listElement);
        }
        else {
            ppList = priority < 0 ? this._updatesNegList : this._updatesPosList;
            this._priorityIn(ppList, listElement, priority);
        }

        //update hash entry for quick access
        this._hashForUpdates[targetId] = HashUpdateEntry.get(ppList, listElement, target, null);
    },

    /**
     * !#en
     * Unschedules a callback for a callback and a given target.
     * If you want to unschedule the "update", use `unscheduleUpdate()`
     * !#zh
     * 取消指定对象定时器。
     * 如果需要取消 update 定时器，请使用 unscheduleUpdate()。
     * @method unschedule
     * @param {Function} callback The callback to be unscheduled
     * @param {Object} target The target bound to the callback.
     */
    unschedule: function (callback, target) {
        //callback, target

        // explicity handle nil arguments when removing an object
        if (!target || !callback)
            return;
        var targetId = target._id;
        if (!targetId) {
            if (target.__instanceId) {
                cc.warnID(1513);
                targetId = target._id = target.__instanceId;
            }
            else {
                cc.errorID(1510);
            }
        }

        var self = this, element = self._hashForTimers[targetId];
        if (element) {
            var timers = element.timers;
            for(var i = 0, li = timers.length; i < li; i++){
                var timer = timers[i];
                if (callback === timer._callback) {
                    if ((timer === element.currentTimer) && (!element.currentTimerSalvaged)) {
                        element.currentTimerSalvaged = true;
                    }
                    timers.splice(i, 1);
                    CallbackTimer.put(timer);
                    //update timerIndex in case we are in tick;, looping over the actions
                    if (element.timerIndex >= i) {
                        element.timerIndex--;
                    }

                    if (timers.length === 0) {
                        if (self._currentTarget === element) {
                            self._currentTargetSalvaged = true;
                        } else {
                            self._removeHashElement(element);
                        }
                    }
                    return;
                }
            }
        }
    },

    /** 
     * !#en Unschedules the update callback for a given target.
     * !#zh 取消指定对象的 update 定时器。
     * @method unscheduleUpdate
     * @param {Object} target The target to be unscheduled.
     */
    unscheduleUpdate: function (target) {
        if (!target)
            return;
        var targetId = target._id;
        if (!targetId) {
            if (target.__instanceId) {
                cc.warnID(1513);
                targetId = target._id = target.__instanceId;
            }
            else {
                cc.errorID(1510);
            }
        }

        var element = this._hashForUpdates[targetId];
        if (element) {
            if (this._updateHashLocked) {
                element.entry.markedForDeletion = true;
            } else {
                this._removeUpdateFromHash(element.entry);
            }
        }
    },

    /** 
     * !#en
     * Unschedules all scheduled callbacks for a given target.
     * This also includes the "update" callback.
     * !#zh 取消指定对象的所有定时器，包括 update 定时器。
     * @method unscheduleAllForTarget
     * @param {Object} target The target to be unscheduled.
     */
    unscheduleAllForTarget: function (target) {
        // explicit nullptr handling
        if (!target){
            return;
        }
        var targetId = target._id;
        if (!targetId) {
            if (target.__instanceId) {
                cc.warnID(1513);
                targetId = target._id = target.__instanceId;
            }
            else {
                cc.errorID(1510);
            }
        }

        // Custom Selectors
        var element = this._hashForTimers[targetId];
        if (element) {
            var timers = element.timers;
            if (timers.indexOf(element.currentTimer) > -1 && 
                (!element.currentTimerSalvaged)) {
                element.currentTimerSalvaged = true;
            }
            for (var i = 0, l = timers.length; i < l; i++) {
                CallbackTimer.put(timers[i]);
            }
            timers.length = 0;

            if (this._currentTarget === element){
                this._currentTargetSalvaged = true;
            }else{
                this._removeHashElement(element);
            }
        }

        // update selector
        this.unscheduleUpdate(target);
    },

    /**
     * !#en
     * Unschedules all scheduled callbacks from all targets including the system callbacks.<br/>
     * You should NEVER call this method, unless you know what you are doing.
     * !#zh
     * 取消所有对象的所有定时器，包括系统定时器。<br/>
     * 不要调用此函数，除非你确定你在做什么。
     * @method unscheduleAll
     */
    unscheduleAll: function(){
        this.unscheduleAllWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM);
    },

    /**
     * !#en
     * Unschedules all callbacks from all targets with a minimum priority.<br/>
     * You should only call this with `PRIORITY_NON_SYSTEM_MIN` or higher.
     * !#zh
     * 取消所有优先级的值大于指定优先级的定时器。<br/>
     * 你应该只取消优先级的值大于 PRIORITY_NON_SYSTEM_MIN 的定时器。
     * @method unscheduleAllWithMinPriority
     * @param {Number} minPriority The minimum priority of selector to be unscheduled. Which means, all selectors which
     *        priority is higher than minPriority will be unscheduled.
     */
    unscheduleAllWithMinPriority: function(minPriority){
        // Custom Selectors
        var i, element, arr = this._arrayForTimers;
        for(i=arr.length-1; i>=0; i--){
            element = arr[i];
            this.unscheduleAllForTarget(element.target);
        }

        // Updates selectors
        var entry;
        var temp_length = 0;
        if(minPriority < 0){
            for(i=0; i<this._updatesNegList.length; ){
                temp_length = this._updatesNegList.length;
                entry = this._updatesNegList[i];
                if(entry && entry.priority >= minPriority)
                    this.unscheduleUpdate(entry.target);
                if (temp_length == this._updatesNegList.length)
                    i++;
            }
        }

        if(minPriority <= 0){
            for(i=0; i<this._updates0List.length; ){
                temp_length = this._updates0List.length;
                entry = this._updates0List[i];
                if (entry)
                    this.unscheduleUpdate(entry.target);
                if (temp_length == this._updates0List.length)
                    i++;
            }
        }

        for(i=0; i<this._updatesPosList.length; ){
            temp_length = this._updatesPosList.length;
            entry = this._updatesPosList[i];
            if(entry && entry.priority >= minPriority)
                this.unscheduleUpdate(entry.target);
            if (temp_length == this._updatesPosList.length)
                i++;
        }
    },

    /** 
     * !#en Checks whether a callback for a given target is scheduled.
     * !#zh 检查指定的回调函数和回调对象组合是否存在定时器。
     * @method isScheduled
     * @param {Function} callback The callback to check.
     * @param {Object} target The target of the callback.
     * @return {Boolean} True if the specified callback is invoked, false if not.
     */
    isScheduled: function(callback, target){
        //key, target
        //selector, target
        cc.assertID(callback, 1508);
        cc.assertID(target, 1509);
        var targetId = target._id;
        if (!targetId) {
            if (target.__instanceId) {
                cc.warnID(1513);
                targetId = target._id = target.__instanceId;
            }
            else {
                cc.errorID(1510);
            }
        }
        
        var element = this._hashForTimers[targetId];

        if (!element) {
            return false;
        }

        if (element.timers == null){
            return false;
        }
        else {
            var timers = element.timers;
            for (var i = 0; i < timers.length; ++i) {
                var timer =  timers[i];

                if (callback === timer._callback){
                    return true;
                }
            }
            return false;
        }
    },

    /**
     * !#en
     * Pause all selectors from all targets.<br/>
     * You should NEVER call this method, unless you know what you are doing.
     * !#zh
     * 暂停所有对象的所有定时器。<br/>
     * 不要调用这个方法，除非你知道你正在做什么。
     * @method pauseAllTargets
     */
    pauseAllTargets: function () {
        return this.pauseAllTargetsWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM);
    },

    /**
     * !#en
     * Pause all selectors from all targets with a minimum priority. <br/>
     * You should only call this with kCCPriorityNonSystemMin or higher.
     * !#zh
     * 暂停所有优先级的值大于指定优先级的定时器。<br/>
     * 你应该只暂停优先级的值大于 PRIORITY_NON_SYSTEM_MIN 的定时器。
     * @method pauseAllTargetsWithMinPriority
     * @param {Number} minPriority
     */
    pauseAllTargetsWithMinPriority: function (minPriority) {
        var idsWithSelectors = [];

        var self = this, element, locArrayForTimers = self._arrayForTimers;
        var i, li;
        // Custom Selectors
        for(i = 0, li = locArrayForTimers.length; i < li; i++){
            element = locArrayForTimers[i];
            if (element) {
                element.paused = true;
                idsWithSelectors.push(element.target);
            }
        }

        var entry;
        if(minPriority < 0){
            for(i=0; i<this._updatesNegList.length; i++){
                entry = this._updatesNegList[i];
                if (entry) {
                    if(entry.priority >= minPriority){
                        entry.paused = true;
                        idsWithSelectors.push(entry.target);
                    }
                }
            }
        }

        if(minPriority <= 0){
            for(i=0; i<this._updates0List.length; i++){
                entry = this._updates0List[i];
                if (entry) {
                    entry.paused = true;
                    idsWithSelectors.push(entry.target);
                }
            }
        }

        for(i=0; i<this._updatesPosList.length; i++){
            entry = this._updatesPosList[i];
            if (entry) {
                if(entry.priority >= minPriority){
                    entry.paused = true;
                    idsWithSelectors.push(entry.target);
                }
            }
        }

        return idsWithSelectors;
    },

    /**
     * !#en
     * Resume selectors on a set of targets.<br/>
     * This can be useful for undoing a call to pauseAllCallbacks.
     * !#zh
     * 恢复指定数组中所有对象的定时器。<br/>
     * 这个函数是 pauseAllCallbacks 的逆操作。
     * @method resumeTargets
     * @param {Array} targetsToResume
     */
    resumeTargets: function (targetsToResume) {
        if (!targetsToResume)
            return;

        for (var i = 0; i < targetsToResume.length; i++) {
            this.resumeTarget(targetsToResume[i]);
        }
    },

    /**
     * !#en
     * Pauses the target.<br/>
     * All scheduled selectors/update for a given target won't be 'ticked' until the target is resumed.<br/>
     * If the target is not present, nothing happens.
     * !#zh
     * 暂停指定对象的定时器。<br/>
     * 指定对象的所有定时器都会被暂停。<br/>
     * 如果指定的对象没有定时器，什么也不会发生。
     * @method pauseTarget
     * @param {Object} target
     */
    pauseTarget: function (target) {
        cc.assertID(target, 1503);
        var targetId = target._id;
        if (!targetId) {
            if (target.__instanceId) {
                cc.warnID(1513);
                targetId = target._id = target.__instanceId;
            }
            else {
                cc.errorID(1510);
            }
        }

        //customer selectors
        var self = this, 
            element = self._hashForTimers[targetId];
        if (element) {
            element.paused = true;
        }

        //update callback
        var elementUpdate = self._hashForUpdates[targetId];
        if (elementUpdate) {
            elementUpdate.entry.paused = true;
        }
    },

    /**
     * !#en
     * Resumes the target.<br/>
     * The 'target' will be unpaused, so all schedule selectors/update will be 'ticked' again.<br/>
     * If the target is not present, nothing happens.
     * !#zh
     * 恢复指定对象的所有定时器。<br/>
     * 指定对象的所有定时器将继续工作。<br/>
     * 如果指定的对象没有定时器，什么也不会发生。
     * @method resumeTarget
     * @param {Object} target
     */
    resumeTarget: function (target) {
        cc.assertID(target, 1504);
        var targetId = target._id;
        if (!targetId) {
            if (target.__instanceId) {
                cc.warnID(1513);
                targetId = target._id = target.__instanceId;
            }
            else {
                cc.errorID(1510);
            }
        }

        // custom selectors
        var self = this,
            element = self._hashForTimers[targetId];
        if (element) {
            element.paused = false;
        }

        //update callback
        var elementUpdate = self._hashForUpdates[targetId];
        if (elementUpdate) {
            elementUpdate.entry.paused = false;
        }
    },

    /**
     * !#en Returns whether or not the target is paused.
     * !#zh 返回指定对象的定时器是否暂停了。
     * @method isTargetPaused
     * @param {Object} target
     * @return {Boolean}
     */
    isTargetPaused: function (target) {
        cc.assertID(target, 1505);
        var targetId = target._id;
        if (!targetId) {
            if (target.__instanceId) {
                cc.warnID(1513);
                targetId = target._id = target.__instanceId;
            }
            else {
                cc.errorID(1510);
            }
        }

        // Custom selectors
        var element = this._hashForTimers[targetId];
        if (element) {
            return element.paused;
        }
        var elementUpdate = this._hashForUpdates[targetId];
        if (elementUpdate) {
            return elementUpdate.entry.paused;
        }
        return false;
    },
};

/**
 * !#en Priority level reserved for system services.
 * !#zh 系统服务的优先级。
 * @property PRIORITY_SYSTEM
 * @type {Number}
 * @static
 */
cc.Scheduler.PRIORITY_SYSTEM = 1 << 31;

/**
 * !#en Minimum priority level for user scheduling.
 * !#zh 用户调度最低优先级。
 * @property PRIORITY_NON_SYSTEM
 * @type {Number}
 * @static
 */
cc.Scheduler.PRIORITY_NON_SYSTEM = cc.Scheduler.PRIORITY_SYSTEM + 1;

module.exports = cc.Scheduler;
