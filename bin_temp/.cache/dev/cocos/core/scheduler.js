(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./utils/id-generator.js", "./utils/js.js", "./components/system.js", "./global-exports.js", "./platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./utils/id-generator.js"), require("./utils/js.js"), require("./components/system.js"), require("./global-exports.js"), require("./platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.idGenerator, global.js, global.system, global.globalExports, global.debug);
    global.scheduler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _idGenerator, _js, _system, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Scheduler = void 0;
  _idGenerator = _interopRequireDefault(_idGenerator);
  _system = _interopRequireDefault(_system);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var MAX_POOL_SIZE = 20;
  var idGenerator = new _idGenerator.default('Scheduler');

  // data structures

  /**
   * @en A list double-linked list used for "updates with priority"
   * @zh 用于“优先更新”的列表
   * @class ListEntry
   * @param {Object} target not retained (retained by hashUpdateEntry)
   * @param {Number} priority
   * @param {Boolean} paused
   * @param {Boolean} markedForDeletion selector will no longer be called and entry will be removed at end of the next tick
   */
  var ListEntry = function ListEntry(target, priority, paused, markedForDeletion) {
    _classCallCheck(this, ListEntry);

    this.target = void 0;
    this.priority = void 0;
    this.paused = void 0;
    this.markedForDeletion = void 0;
    this.target = target;
    this.priority = priority;
    this.paused = paused;
    this.markedForDeletion = markedForDeletion;
  };
  /**
   * @en A update entry list
   * @zh 更新条目列表
   * @class HashUpdateEntry
   * @param {Array} list Which list does it belong to ?
   * @param {ListEntry} entry entry in the list
   * @param {Object} target hash key (retained)
   * @param {function} callback
   */


  ListEntry.get = function (target, priority, paused, markedForDeletion) {
    var result = ListEntry._listEntries.pop();

    if (result) {
      result.target = target;
      result.priority = priority;
      result.paused = paused;
      result.markedForDeletion = markedForDeletion;
    } else {
      result = new ListEntry(target, priority, paused, markedForDeletion);
    }

    return result;
  };

  ListEntry.put = function (entry) {
    if (ListEntry._listEntries.length < MAX_POOL_SIZE) {
      entry.target = null;

      ListEntry._listEntries.push(entry);
    }
  };

  ListEntry._listEntries = [];

  var HashUpdateEntry = function HashUpdateEntry(list, entry, target, callback) {
    _classCallCheck(this, HashUpdateEntry);

    this.list = void 0;
    this.entry = void 0;
    this.target = void 0;
    this.callback = void 0;
    this.list = list;
    this.entry = entry;
    this.target = target;
    this.callback = callback;
  };
  /**
   * @en Hash Element used for "selectors with interval"
   * @zh “用于间隔选择”的哈希元素
   * @class HashTimerEntry
   * @param {Array} timers
   * @param {Object} target  hash key (retained)
   * @param {Number} timerIndex
   * @param {Timer} currentTimer
   * @param {Boolean} currentTimerSalvaged
   * @param {Boolean} paused
   */


  HashUpdateEntry.get = function (list, entry, target, callback) {
    var result = HashUpdateEntry._hashUpdateEntries.pop();

    if (result) {
      result.list = list;
      result.entry = entry;
      result.target = target;
      result.callback = callback;
    } else {
      result = new HashUpdateEntry(list, entry, target, callback);
    }

    return result;
  };

  HashUpdateEntry.put = function (entry) {
    if (HashUpdateEntry._hashUpdateEntries.length < MAX_POOL_SIZE) {
      entry.list = entry.entry = entry.target = entry.callback = null;

      HashUpdateEntry._hashUpdateEntries.push(entry);
    }
  };

  HashUpdateEntry._hashUpdateEntries = [];

  var HashTimerEntry = function HashTimerEntry(timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused) {
    _classCallCheck(this, HashTimerEntry);

    this.timers = void 0;
    this.target = void 0;
    this.timerIndex = void 0;
    this.currentTimer = void 0;
    this.currentTimerSalvaged = void 0;
    this.paused = void 0;
    this.timers = timers;
    this.target = target;
    this.timerIndex = timerIndex;
    this.currentTimer = currentTimer;
    this.currentTimerSalvaged = currentTimerSalvaged;
    this.paused = paused;
  };
  /*
   * Light weight timer
   */


  HashTimerEntry.get = function (timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused) {
    var result = HashTimerEntry._hashTimerEntries.pop();

    if (result) {
      result.timers = timers;
      result.target = target;
      result.timerIndex = timerIndex;
      result.currentTimer = currentTimer;
      result.currentTimerSalvaged = currentTimerSalvaged;
      result.paused = paused;
    } else {
      result = new HashTimerEntry(timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused);
    }

    return result;
  };

  HashTimerEntry.put = function (entry) {
    if (HashTimerEntry._hashTimerEntries.length < MAX_POOL_SIZE) {
      entry.timers = entry.target = entry.currentTimer = null;

      HashTimerEntry._hashTimerEntries.push(entry);
    }
  };

  HashTimerEntry._hashTimerEntries = [];

  var CallbackTimer = /*#__PURE__*/function () {
    function CallbackTimer() {
      _classCallCheck(this, CallbackTimer);

      this._lock = void 0;
      this._scheduler = void 0;
      this._elapsed = void 0;
      this._runForever = void 0;
      this._useDelay = void 0;
      this._timesExecuted = void 0;
      this._repeat = void 0;
      this._delay = void 0;
      this._interval = void 0;
      this._target = void 0;
      this._callback = void 0;
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

    _createClass(CallbackTimer, [{
      key: "initWithCallback",
      value: function initWithCallback(scheduler, callback, target, seconds, repeat, delay) {
        this._lock = false;
        this._scheduler = scheduler;
        this._target = target;
        this._callback = callback;
        this._elapsed = -1;
        this._interval = seconds;
        this._delay = delay;
        this._useDelay = this._delay > 0;
        this._repeat = repeat;
        this._runForever = this._repeat === _globalExports.legacyCC.macro.REPEAT_FOREVER;
        return true;
      }
      /**
       * @return {Number} returns interval of timer
       */

    }, {
      key: "getInterval",
      value: function getInterval() {
        return this._interval;
      }
      /**
       * @param {Number} interval set interval in seconds
       */

    }, {
      key: "setInterval",
      value: function setInterval(interval) {
        this._interval = interval;
      }
      /**
       * triggers the timer
       * @param {Number} dt delta time
       */

    }, {
      key: "update",
      value: function update(dt) {
        if (this._elapsed === -1) {
          this._elapsed = 0;
          this._timesExecuted = 0;
        } else {
          this._elapsed += dt;

          if (this._runForever && !this._useDelay) {
            // standard timer usage
            if (this._elapsed >= this._interval) {
              this.trigger();
              this._elapsed = 0;
            }
          } else {
            // advanced usage
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

            if (this._callback && !this._runForever && this._timesExecuted > this._repeat) {
              this.cancel();
            }
          }
        }
      }
    }, {
      key: "getCallback",
      value: function getCallback() {
        return this._callback;
      }
    }, {
      key: "trigger",
      value: function trigger() {
        if (this._target && this._callback) {
          this._lock = true;

          this._callback.call(this._target, this._elapsed);

          this._lock = false;
        }
      }
    }, {
      key: "cancel",
      value: function cancel() {
        // override
        this._scheduler.unschedule(this._callback, this._target);
      }
    }]);

    return CallbackTimer;
  }();
  /**
   * @en
   * Scheduler is responsible of triggering the scheduled callbacks.<br>
   * You should not use NSTimer. Instead use this class.<br>
   * <br>
   * There are 2 different types of callbacks (selectors):<br>
   *     - update callback: the 'update' callback will be called every frame. You can customize the priority.<br>
   *     - custom callback: A custom callback will be called every frame, or with a custom interval of time<br>
   * <br>
   * The 'custom selectors' should be avoided when possible. It is faster,<br>
   * and consumes less memory to use the 'update callback'. *
   * @zh
   * Scheduler 是负责触发回调函数的类。<br>
   * 通常情况下，建议使用 `director.getScheduler()` 来获取系统定时器。<br>
   * 有两种不同类型的定时器：<br>
   *     - update 定时器：每一帧都会触发。您可以自定义优先级。<br>
   *     - 自定义定时器：自定义定时器可以每一帧或者自定义的时间间隔触发。<br>
   * 如果希望每帧都触发，应该使用 update 定时器，使用 update 定时器更快，而且消耗更少的内存。
   *
   * @class Scheduler
   */


  CallbackTimer._timers = [];

  CallbackTimer.get = function () {
    return CallbackTimer._timers.pop() || new CallbackTimer();
  };

  CallbackTimer.put = function (timer) {
    if (CallbackTimer._timers.length < MAX_POOL_SIZE && !timer._lock) {
      timer._scheduler = timer._target = timer._callback = null;

      CallbackTimer._timers.push(timer);
    }
  };

  var Scheduler = /*#__PURE__*/function (_System) {
    _inherits(Scheduler, _System);

    _createClass(Scheduler, null, [{
      key: "enableForTarget",

      /**
       * @en Priority level reserved for system services.
       * @zh 系统服务的优先级。
       */

      /**
       * @en Minimum priority level for user scheduling.
       * @zh 用户调度最低优先级。
       */

      /**
       * @en This method should be called for any target which needs to schedule tasks, and this method should be called before any scheduler API usage.<bg>
       * This method will add a `id` property if it doesn't exist.
       * @zh 任何需要用 Scheduler 管理任务的对象主体都应该调用这个方法，并且应该在调用任何 Scheduler API 之前调用这个方法。<bg>
       * 这个方法会给对象添加一个 `id` 属性，如果这个属性不存在的话。
       * @param {Object} target
       */
      value: function enableForTarget(target) {
        var found = false;

        if (target.uuid) {
          found = true;
        } else if (target.id) {
          found = true;
        }

        if (!found) {
          // @ts-ignore
          if (target.__instanceId) {
            (0, _debug.warnID)(1513);
          } else {
            target.id = idGenerator.getNewId();
          }
        }
      }
    }]);

    function Scheduler() {
      var _this;

      _classCallCheck(this, Scheduler);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Scheduler).call(this));
      _this._timeScale = void 0;
      _this._updatesNegList = void 0;
      _this._updates0List = void 0;
      _this._updatesPosList = void 0;
      _this._hashForUpdates = void 0;
      _this._hashForTimers = void 0;
      _this._currentTarget = void 0;
      _this._currentTargetSalvaged = void 0;
      _this._updateHashLocked = void 0;
      _this._arrayForTimers = void 0;
      _this._timeScale = 1.0;
      _this._updatesNegList = []; // list of priority < 0

      _this._updates0List = []; // list of priority == 0

      _this._updatesPosList = []; // list of priority > 0

      _this._hashForUpdates = (0, _js.createMap)(true); // hash used to fetch quickly the list entries for pause, delete, etc

      _this._hashForTimers = (0, _js.createMap)(true); // Used for "selectors with interval"

      _this._currentTarget = null;
      _this._currentTargetSalvaged = false;
      _this._updateHashLocked = false; // If true unschedule will not remove anything from a hash. Elements will only be marked for deletion.

      _this._arrayForTimers = []; // Speed up indexing
      // this._arrayForUpdates = [];   // Speed up indexing

      return _this;
    } // -----------------------public method-------------------------

    /**
     * @en
     * Modifies the time of all scheduled callbacks.<br>
     * You can use this property to create a 'slow motion' or 'fast forward' effect.<br>
     * Default is 1.0. To create a 'slow motion' effect, use values below 1.0.<br>
     * To create a 'fast forward' effect, use values higher than 1.0.<br>
     * Note：It will affect EVERY scheduled selector / action.
     * @zh
     * 设置时间间隔的缩放比例。<br>
     * 您可以使用这个方法来创建一个 “slow motion（慢动作）” 或 “fast forward（快进）” 的效果。<br>
     * 默认是 1.0。要创建一个 “slow motion（慢动作）” 效果,使用值低于 1.0。<br>
     * 要使用 “fast forward（快进）” 效果，使用值大于 1.0。<br>
     * 注意：它影响该 Scheduler 下管理的所有定时器。
     * @param {Number} timeScale
     */


    _createClass(Scheduler, [{
      key: "setTimeScale",
      value: function setTimeScale(timeScale) {
        this._timeScale = timeScale;
      }
      /**
       * @en Returns time scale of scheduler.
       * @zh 获取时间间隔的缩放比例。
       * @return {Number}
       */

    }, {
      key: "getTimeScale",
      value: function getTimeScale() {
        return this._timeScale;
      }
      /**
       * @en 'update' the scheduler. (You should NEVER call this method, unless you know what you are doing.)
       * @zh update 调度函数。(不应该直接调用这个方法，除非完全了解这么做的结果)
       * @param {Number} dt delta time
       */

    }, {
      key: "update",
      value: function update(dt) {
        this._updateHashLocked = true;

        if (this._timeScale !== 1) {
          dt *= this._timeScale;
        }

        var i;
        var list;
        var len;
        var entry;

        for (i = 0, list = this._updatesNegList, len = list.length; i < len; i++) {
          entry = list[i];

          if (!entry.paused && !entry.markedForDeletion) {
            entry.target.update(dt);
          }
        }

        for (i = 0, list = this._updates0List, len = list.length; i < len; i++) {
          entry = list[i];

          if (!entry.paused && !entry.markedForDeletion) {
            entry.target.update(dt);
          }
        }

        for (i = 0, list = this._updatesPosList, len = list.length; i < len; i++) {
          entry = list[i];

          if (!entry.paused && !entry.markedForDeletion) {
            entry.target.update(dt);
          }
        } // Iterate over all the custom selectors


        var elt;
        var arr = this._arrayForTimers;

        for (i = 0; i < arr.length; i++) {
          elt = arr[i];
          this._currentTarget = elt;
          this._currentTargetSalvaged = false;

          if (!elt.paused) {
            // The 'timers' array may change while inside this loop
            for (elt.timerIndex = 0; elt.timerIndex < elt.timers.length; ++elt.timerIndex) {
              elt.currentTimer = elt.timers[elt.timerIndex];
              elt.currentTimerSalvaged = false;
              elt.currentTimer.update(dt);
              elt.currentTimer = null;
            }
          } // only delete currentTarget if no actions were scheduled during the cycle (issue #481)


          if (this._currentTargetSalvaged && this._currentTarget.timers.length === 0) {
            this._removeHashElement(this._currentTarget);

            --i;
          }
        } // delete all updates that are marked for deletion
        // updates with priority < 0


        for (i = 0, list = this._updatesNegList; i < list.length;) {
          entry = list[i];

          if (entry.markedForDeletion) {
            this._removeUpdateFromHash(entry);
          } else {
            i++;
          }
        }

        for (i = 0, list = this._updates0List; i < list.length;) {
          entry = list[i];

          if (entry.markedForDeletion) {
            this._removeUpdateFromHash(entry);
          } else {
            i++;
          }
        }

        for (i = 0, list = this._updatesPosList; i < list.length;) {
          entry = list[i];

          if (entry.markedForDeletion) {
            this._removeUpdateFromHash(entry);
          } else {
            i++;
          }
        }

        this._updateHashLocked = false;
        this._currentTarget = null;
      }
      /**
       * @en
       * <p>
       *   The scheduled method will be called every 'interval' seconds.<br/>
       *   If paused is YES, then it won't be called until it is resumed.<br/>
       *   If 'interval' is 0, it will be called every frame, but if so, it recommended to use 'scheduleUpdateForTarget:' instead.<br/>
       *   If the callback function is already scheduled, then only the interval parameter will be updated without re-scheduling it again.<br/>
       *   repeat let the action be repeated repeat + 1 times, use `macro.REPEAT_FOREVER` to let the action run continuously<br/>
       *   delay is the amount of time the action will wait before it'll start<br/>
       * </p>
       * @zh
       * 指定回调函数，调用对象等信息来添加一个新的定时器。<br/>
       * 如果 paused 值为 true，那么直到 resume 被调用才开始计时。<br/>
       * 当时间间隔达到指定值时，设置的回调函数将会被调用。<br/>
       * 如果 interval 值为 0，那么回调函数每一帧都会被调用，但如果是这样，
       * 建议使用 scheduleUpdateForTarget 代替。<br/>
       * 如果回调函数已经被定时器使用，那么只会更新之前定时器的时间间隔参数，不会设置新的定时器。<br/>
       * repeat 值可以让定时器触发 repeat + 1 次，使用 `macro.REPEAT_FOREVER`
       * 可以让定时器一直循环触发。<br/>
       * delay 值指定延迟时间，定时器会在延迟指定的时间之后开始计时。
       * @param {Function} callback
       * @param {Object} target
       * @param {Number} interval
       * @param {Number} [repeat]
       * @param {Number} [delay=0]
       * @param {Boolean} [paused=fasle]
       */

    }, {
      key: "schedule",
      value: function schedule(callback, target, interval, repeat, delay, paused) {
        'use strict';

        if (typeof callback !== 'function') {
          var tmp = callback; // @ts-ignore

          callback = target;
          target = tmp;
        } // selector, target, interval, repeat, delay, paused
        // selector, target, interval, paused


        if (arguments.length === 3 || arguments.length === 4 || arguments.length === 5) {
          paused = !!repeat;
          repeat = _globalExports.legacyCC.macro.REPEAT_FOREVER;
          delay = 0;
        }

        (0, _debug.assertID)(target, 1502);
        var targetId = target.uuid || target.id;

        if (!targetId) {
          (0, _debug.errorID)(1510);
          return;
        }

        var element = this._hashForTimers[targetId];

        if (!element) {
          // Is this the 1st element ? Then set the pause level to all the callback_fns of this target
          element = HashTimerEntry.get(null, target, 0, null, null, paused);

          this._arrayForTimers.push(element);

          this._hashForTimers[targetId] = element;
        } else if (element.paused !== paused) {
          (0, _debug.warnID)(1511);
        }

        var timer;
        var i;

        if (element.timers == null) {
          element.timers = [];
        } else {
          for (i = 0; i < element.timers.length; ++i) {
            timer = element.timers[i];

            if (timer && callback === timer._callback) {
              (0, _debug.logID)(1507, timer.getInterval(), interval);
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
      }
      /**
       * @en
       * Schedules the update callback for a given target,
       * During every frame after schedule started, the "update" function of target will be invoked.
       * @zh
       * 使用指定的优先级为指定的对象设置 update 定时器。<br>
       * update 定时器每一帧都会被触发，触发时自动调用指定对象的 "update" 函数。<br>
       * 优先级的值越低，定时器被触发的越早。
       * @param {Object} target
       * @param {Number} priority
       * @param {Boolean} paused
       */

    }, {
      key: "scheduleUpdate",
      value: function scheduleUpdate(target, priority, paused) {
        var targetId = target.uuid || target.id;

        if (!targetId) {
          (0, _debug.errorID)(1510);
          return;
        }

        var hashElement = this._hashForUpdates[targetId];

        if (hashElement && hashElement.entry) {
          // check if priority has changed
          if (hashElement.entry.priority !== priority) {
            if (this._updateHashLocked) {
              (0, _debug.logID)(1506);
              hashElement.entry.markedForDeletion = false;
              hashElement.entry.paused = paused;
              return;
            } else {
              // will be added again outside if (hashElement).
              this.unscheduleUpdate(target);
            }
          } else {
            hashElement.entry.markedForDeletion = false;
            hashElement.entry.paused = paused;
            return;
          }
        }

        var listElement = ListEntry.get(target, priority, paused, false);
        var ppList; // most of the updates are going to be 0, that's way there
        // is an special list for updates with priority 0

        if (priority === 0) {
          ppList = this._updates0List;

          this._appendIn(ppList, listElement);
        } else {
          ppList = priority < 0 ? this._updatesNegList : this._updatesPosList;

          this._priorityIn(ppList, listElement, priority);
        } // update hash entry for quick access


        this._hashForUpdates[targetId] = HashUpdateEntry.get(ppList, listElement, target, null);
      }
      /**
       * @en
       * Unschedules a callback for a callback and a given target.
       * If you want to unschedule the "update", use `unscheduleUpdate()`
       * @zh
       * 取消指定对象定时器。
       * 如果需要取消 update 定时器，请使用 unscheduleUpdate()。
       * @param {Function} callback The callback to be unscheduled
       * @param {Object} target The target bound to the callback.
       */

    }, {
      key: "unschedule",
      value: function unschedule(callback, target) {
        // callback, target
        // explicity handle nil arguments when removing an object
        if (!target || !callback) {
          return;
        }

        var targetId = target.uuid || target.id;

        if (!targetId) {
          (0, _debug.errorID)(1510);
          return;
        }

        var self = this;
        var element = self._hashForTimers[targetId];

        if (element) {
          var timers = element.timers;

          for (var i = 0, li = timers.length; i < li; i++) {
            var timer = timers[i];

            if (callback === timer._callback) {
              if (timer === element.currentTimer && !element.currentTimerSalvaged) {
                element.currentTimerSalvaged = true;
              }

              timers.splice(i, 1);
              CallbackTimer.put(timer); // update timerIndex in case we are in tick;, looping over the actions

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
      }
      /**
       * @en Unschedules the update callback for a given target.
       * @zh 取消指定对象的 update 定时器。
       * @param {Object} target The target to be unscheduled.
       */

    }, {
      key: "unscheduleUpdate",
      value: function unscheduleUpdate(target) {
        if (!target) {
          return;
        }

        var targetId = target.uuid || target.id;

        if (!targetId) {
          (0, _debug.errorID)(1510);
          return;
        }

        var element = this._hashForUpdates[targetId];

        if (element) {
          if (this._updateHashLocked) {
            element.entry.markedForDeletion = true;
          } else {
            this._removeUpdateFromHash(element.entry);
          }
        }
      }
      /**
       * @en
       * Unschedules all scheduled callbacks for a given target.
       * This also includes the "update" callback.
       * @zh 取消指定对象的所有定时器，包括 update 定时器。
       * @param {Object} target The target to be unscheduled.
       */

    }, {
      key: "unscheduleAllForTarget",
      value: function unscheduleAllForTarget(target) {
        // explicit nullptr handling
        if (!target) {
          return;
        }

        var targetId = target.uuid || target.id;

        if (!targetId) {
          (0, _debug.errorID)(1510);
          return;
        } // Custom Selectors


        var element = this._hashForTimers[targetId];

        if (element) {
          var timers = element.timers;

          if (timers.indexOf(element.currentTimer) > -1 && !element.currentTimerSalvaged) {
            element.currentTimerSalvaged = true;
          }

          for (var i = 0, l = timers.length; i < l; i++) {
            CallbackTimer.put(timers[i]);
          }

          timers.length = 0;

          if (this._currentTarget === element) {
            this._currentTargetSalvaged = true;
          } else {
            this._removeHashElement(element);
          }
        } // update selector


        this.unscheduleUpdate(target);
      }
      /**
       * @en
       * Unschedules all scheduled callbacks from all targets including the system callbacks.<br/>
       * You should NEVER call this method, unless you know what you are doing.
       * @zh
       * 取消所有对象的所有定时器，包括系统定时器。<br/>
       * 不要调用此函数，除非你确定你在做什么。
       */

    }, {
      key: "unscheduleAll",
      value: function unscheduleAll() {
        this.unscheduleAllWithMinPriority(_globalExports.legacyCC.Scheduler.PRIORITY_SYSTEM);
      }
      /**
       * @en
       * Unschedules all callbacks from all targets with a minimum priority.<br/>
       * You should only call this with `PRIORITY_NON_SYSTEM_MIN` or higher.
       * @zh
       * 取消所有优先级的值大于指定优先级的定时器。<br/>
       * 你应该只取消优先级的值大于 PRIORITY_NON_SYSTEM_MIN 的定时器。
       * @param {Number} minPriority The minimum priority of selector to be unscheduled. Which means, all selectors which
       *        priority is higher than minPriority will be unscheduled.
       */

    }, {
      key: "unscheduleAllWithMinPriority",
      value: function unscheduleAllWithMinPriority(minPriority) {
        // Custom Selectors
        var i;
        var element;
        var arr = this._arrayForTimers;

        for (i = arr.length - 1; i >= 0; i--) {
          element = arr[i];
          this.unscheduleAllForTarget(element.target);
        } // Updates selectors


        var entry;
        var temp_length = 0;

        if (minPriority < 0) {
          for (i = 0; i < this._updatesNegList.length;) {
            temp_length = this._updatesNegList.length;
            entry = this._updatesNegList[i];

            if (entry && entry.priority >= minPriority) {
              this.unscheduleUpdate(entry.target);
            }

            if (temp_length === this._updatesNegList.length) {
              i++;
            }
          }
        }

        if (minPriority <= 0) {
          for (i = 0; i < this._updates0List.length;) {
            temp_length = this._updates0List.length;
            entry = this._updates0List[i];

            if (entry) {
              this.unscheduleUpdate(entry.target);
            }

            if (temp_length === this._updates0List.length) {
              i++;
            }
          }
        }

        for (i = 0; i < this._updatesPosList.length;) {
          temp_length = this._updatesPosList.length;
          entry = this._updatesPosList[i];

          if (entry && entry.priority >= minPriority) {
            this.unscheduleUpdate(entry.target);
          }

          if (temp_length === this._updatesPosList.length) {
            i++;
          }
        }
      }
      /**
       * @en Checks whether a callback for a given target is scheduled.
       * @zh 检查指定的回调函数和回调对象组合是否存在定时器。
       * @param {Function} callback The callback to check.
       * @param {Object} target The target of the callback.
       * @return {Boolean} True if the specified callback is invoked, false if not.
       */

    }, {
      key: "isScheduled",
      value: function isScheduled(callback, target) {
        // key, target
        // selector, target
        (0, _debug.assertID)(callback, 1508);
        (0, _debug.assertID)(target, 1509);
        var targetId = target.uuid || target.id;

        if (!targetId) {
          (0, _debug.errorID)(1510);
          return;
        }

        var element = this._hashForTimers[targetId];

        if (!element) {
          return false;
        }

        if (element.timers == null) {
          return false;
        } else {
          var timers = element.timers; // tslint:disable-next-line: prefer-for-of

          for (var i = 0; i < timers.length; ++i) {
            var timer = timers[i];

            if (callback === timer._callback) {
              return true;
            }
          }

          return false;
        }
      }
      /**
       * @en
       * Pause all selectors from all targets.<br/>
       * You should NEVER call this method, unless you know what you are doing.
       * @zh
       * 暂停所有对象的所有定时器。<br/>
       * 不要调用这个方法，除非你知道你正在做什么。
       */

    }, {
      key: "pauseAllTargets",
      value: function pauseAllTargets() {
        return this.pauseAllTargetsWithMinPriority(_globalExports.legacyCC.Scheduler.PRIORITY_SYSTEM);
      }
      /**
       * @en
       * Pause all selectors from all targets with a minimum priority. <br/>
       * You should only call this with kCCPriorityNonSystemMin or higher.
       * @zh
       * 暂停所有优先级的值大于指定优先级的定时器。<br/>
       * 你应该只暂停优先级的值大于 PRIORITY_NON_SYSTEM_MIN 的定时器。
       * @param {Number} minPriority
       */

    }, {
      key: "pauseAllTargetsWithMinPriority",
      value: function pauseAllTargetsWithMinPriority(minPriority) {
        var idsWithSelectors = [];
        var self = this;
        var element;
        var locArrayForTimers = self._arrayForTimers;
        var i;
        var li; // Custom Selectors

        for (i = 0, li = locArrayForTimers.length; i < li; i++) {
          element = locArrayForTimers[i];

          if (element) {
            element.paused = true;
            idsWithSelectors.push(element.target);
          }
        }

        var entry;

        if (minPriority < 0) {
          for (i = 0; i < this._updatesNegList.length; i++) {
            entry = this._updatesNegList[i];

            if (entry) {
              if (entry.priority >= minPriority) {
                entry.paused = true;
                idsWithSelectors.push(entry.target);
              }
            }
          }
        }

        if (minPriority <= 0) {
          for (i = 0; i < this._updates0List.length; i++) {
            entry = this._updates0List[i];

            if (entry) {
              entry.paused = true;
              idsWithSelectors.push(entry.target);
            }
          }
        }

        for (i = 0; i < this._updatesPosList.length; i++) {
          entry = this._updatesPosList[i];

          if (entry) {
            if (entry.priority >= minPriority) {
              entry.paused = true;
              idsWithSelectors.push(entry.target);
            }
          }
        }

        return idsWithSelectors;
      }
      /**
       * @en
       * Resume selectors on a set of targets.<br/>
       * This can be useful for undoing a call to pauseAllCallbacks.
       * @zh
       * 恢复指定数组中所有对象的定时器。<br/>
       * 这个函数是 pauseAllCallbacks 的逆操作。
       * @param {Array} targetsToResume
       */

    }, {
      key: "resumeTargets",
      value: function resumeTargets(targetsToResume) {
        if (!targetsToResume) {
          return;
        } // tslint:disable-next-line: prefer-for-of


        for (var i = 0; i < targetsToResume.length; i++) {
          this.resumeTarget(targetsToResume[i]);
        }
      }
      /**
       * @en
       * Pauses the target.<br/>
       * All scheduled selectors/update for a given target won't be 'ticked' until the target is resumed.<br/>
       * If the target is not present, nothing happens.
       * @zh
       * 暂停指定对象的定时器。<br/>
       * 指定对象的所有定时器都会被暂停。<br/>
       * 如果指定的对象没有定时器，什么也不会发生。
       * @param {Object} target
       */

    }, {
      key: "pauseTarget",
      value: function pauseTarget(target) {
        (0, _debug.assertID)(target, 1503);
        var targetId = target.uuid || target.id;

        if (!targetId) {
          (0, _debug.errorID)(1510);
          return;
        } // customer selectors


        var self = this;
        var element = self._hashForTimers[targetId];

        if (element) {
          element.paused = true;
        } // update callback


        var elementUpdate = self._hashForUpdates[targetId];

        if (elementUpdate) {
          elementUpdate.entry.paused = true;
        }
      }
      /**
       * @en
       * Resumes the target.<br/>
       * The 'target' will be unpaused, so all schedule selectors/update will be 'ticked' again.<br/>
       * If the target is not present, nothing happens.
       * @zh
       * 恢复指定对象的所有定时器。<br/>
       * 指定对象的所有定时器将继续工作。<br/>
       * 如果指定的对象没有定时器，什么也不会发生。
       * @param {Object} target
       */

    }, {
      key: "resumeTarget",
      value: function resumeTarget(target) {
        (0, _debug.assertID)(target, 1504);
        var targetId = target.uuid || target.id;

        if (!targetId) {
          (0, _debug.errorID)(1510);
          return;
        } // custom selectors


        var self = this;
        var element = self._hashForTimers[targetId];

        if (element) {
          element.paused = false;
        } // update callback


        var elementUpdate = self._hashForUpdates[targetId];

        if (elementUpdate) {
          elementUpdate.entry.paused = false;
        }
      }
      /**
       * @en Returns whether or not the target is paused.
       * @zh 返回指定对象的定时器是否处于暂停状态。
       * @param {Object} target
       * @return {Boolean}
       */

    }, {
      key: "isTargetPaused",
      value: function isTargetPaused(target) {
        (0, _debug.assertID)(target, 1505);
        var targetId = target.uuid || target.id;

        if (!targetId) {
          (0, _debug.errorID)(1510);
          return false;
        } // Custom selectors


        var element = this._hashForTimers[targetId];

        if (element) {
          return element.paused;
        }

        var elementUpdate = this._hashForUpdates[targetId];

        if (elementUpdate) {
          return elementUpdate.entry.paused;
        }

        return false;
      } // -----------------------private method----------------------

    }, {
      key: "_removeHashElement",
      value: function _removeHashElement(element) {
        var targetId = element.target.uuid || element.target.id;
        delete this._hashForTimers[targetId];
        var arr = this._arrayForTimers;

        for (var i = 0, l = arr.length; i < l; i++) {
          if (arr[i] === element) {
            arr.splice(i, 1);
            break;
          }
        }

        HashTimerEntry.put(element);
      }
    }, {
      key: "_removeUpdateFromHash",
      value: function _removeUpdateFromHash(entry) {
        var targetId = entry.target.uuid || entry.target.id;
        var self = this;
        var element = self._hashForUpdates[targetId];

        if (element) {
          // Remove list entry from list
          var list = element.list;
          var listEntry = element.entry;

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
      }
    }, {
      key: "_priorityIn",
      value: function _priorityIn(ppList, listElement, priority) {
        for (var i = 0; i < ppList.length; i++) {
          if (priority < ppList[i].priority) {
            ppList.splice(i, 0, listElement);
            return;
          }
        }

        ppList.push(listElement);
      }
    }, {
      key: "_appendIn",
      value: function _appendIn(ppList, listElement) {
        ppList.push(listElement);
      }
    }]);

    return Scheduler;
  }(_system.default);

  _exports.Scheduler = Scheduler;
  Scheduler.PRIORITY_SYSTEM = 1 << 31;
  Scheduler.PRIORITY_NON_SYSTEM = Scheduler.PRIORITY_SYSTEM + 1;
  Scheduler.ID = 'scheduler';
  _globalExports.legacyCC.Scheduler = Scheduler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NoZWR1bGVyLnRzIl0sIm5hbWVzIjpbIk1BWF9QT09MX1NJWkUiLCJpZEdlbmVyYXRvciIsIklkR2VuZXJhdG9yIiwiTGlzdEVudHJ5IiwidGFyZ2V0IiwicHJpb3JpdHkiLCJwYXVzZWQiLCJtYXJrZWRGb3JEZWxldGlvbiIsImdldCIsInJlc3VsdCIsIl9saXN0RW50cmllcyIsInBvcCIsInB1dCIsImVudHJ5IiwibGVuZ3RoIiwicHVzaCIsIkhhc2hVcGRhdGVFbnRyeSIsImxpc3QiLCJjYWxsYmFjayIsIl9oYXNoVXBkYXRlRW50cmllcyIsIkhhc2hUaW1lckVudHJ5IiwidGltZXJzIiwidGltZXJJbmRleCIsImN1cnJlbnRUaW1lciIsImN1cnJlbnRUaW1lclNhbHZhZ2VkIiwiX2hhc2hUaW1lckVudHJpZXMiLCJDYWxsYmFja1RpbWVyIiwiX2xvY2siLCJfc2NoZWR1bGVyIiwiX2VsYXBzZWQiLCJfcnVuRm9yZXZlciIsIl91c2VEZWxheSIsIl90aW1lc0V4ZWN1dGVkIiwiX3JlcGVhdCIsIl9kZWxheSIsIl9pbnRlcnZhbCIsIl90YXJnZXQiLCJfY2FsbGJhY2siLCJzY2hlZHVsZXIiLCJzZWNvbmRzIiwicmVwZWF0IiwiZGVsYXkiLCJsZWdhY3lDQyIsIm1hY3JvIiwiUkVQRUFUX0ZPUkVWRVIiLCJpbnRlcnZhbCIsImR0IiwidHJpZ2dlciIsImNhbmNlbCIsImNhbGwiLCJ1bnNjaGVkdWxlIiwiX3RpbWVycyIsInRpbWVyIiwiU2NoZWR1bGVyIiwiZm91bmQiLCJ1dWlkIiwiaWQiLCJfX2luc3RhbmNlSWQiLCJnZXROZXdJZCIsIl90aW1lU2NhbGUiLCJfdXBkYXRlc05lZ0xpc3QiLCJfdXBkYXRlczBMaXN0IiwiX3VwZGF0ZXNQb3NMaXN0IiwiX2hhc2hGb3JVcGRhdGVzIiwiX2hhc2hGb3JUaW1lcnMiLCJfY3VycmVudFRhcmdldCIsIl9jdXJyZW50VGFyZ2V0U2FsdmFnZWQiLCJfdXBkYXRlSGFzaExvY2tlZCIsIl9hcnJheUZvclRpbWVycyIsInRpbWVTY2FsZSIsImkiLCJsZW4iLCJ1cGRhdGUiLCJlbHQiLCJhcnIiLCJfcmVtb3ZlSGFzaEVsZW1lbnQiLCJfcmVtb3ZlVXBkYXRlRnJvbUhhc2giLCJ0bXAiLCJhcmd1bWVudHMiLCJ0YXJnZXRJZCIsImVsZW1lbnQiLCJnZXRJbnRlcnZhbCIsImluaXRXaXRoQ2FsbGJhY2siLCJoYXNoRWxlbWVudCIsInVuc2NoZWR1bGVVcGRhdGUiLCJsaXN0RWxlbWVudCIsInBwTGlzdCIsIl9hcHBlbmRJbiIsIl9wcmlvcml0eUluIiwic2VsZiIsImxpIiwic3BsaWNlIiwiaW5kZXhPZiIsImwiLCJ1bnNjaGVkdWxlQWxsV2l0aE1pblByaW9yaXR5IiwiUFJJT1JJVFlfU1lTVEVNIiwibWluUHJpb3JpdHkiLCJ1bnNjaGVkdWxlQWxsRm9yVGFyZ2V0IiwidGVtcF9sZW5ndGgiLCJwYXVzZUFsbFRhcmdldHNXaXRoTWluUHJpb3JpdHkiLCJpZHNXaXRoU2VsZWN0b3JzIiwibG9jQXJyYXlGb3JUaW1lcnMiLCJ0YXJnZXRzVG9SZXN1bWUiLCJyZXN1bWVUYXJnZXQiLCJlbGVtZW50VXBkYXRlIiwibGlzdEVudHJ5IiwiU3lzdGVtIiwiUFJJT1JJVFlfTk9OX1NZU1RFTSIsIklEIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ0EsTUFBTUEsYUFBYSxHQUFHLEVBQXRCO0FBRUEsTUFBTUMsV0FBVyxHQUFHLElBQUlDLG9CQUFKLENBQWdCLFdBQWhCLENBQXBCOztBQU9BOztBQUNBOzs7Ozs7Ozs7TUFTTUMsUyxHQThCRixtQkFBYUMsTUFBYixFQUFtQ0MsUUFBbkMsRUFBcURDLE1BQXJELEVBQXNFQyxpQkFBdEUsRUFBa0c7QUFBQTs7QUFBQSxTQUwzRkgsTUFLMkY7QUFBQSxTQUozRkMsUUFJMkY7QUFBQSxTQUgzRkMsTUFHMkY7QUFBQSxTQUYzRkMsaUJBRTJGO0FBQzlG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QUFDSDtBQUNKOztBQUNEQyxRQUFBQSxNQUFNLENBQUN2RSxJQUFQLENBQVlzRSxXQUFaO0FBQ0g7OztnQ0FFa0JDLE0sRUFBUUQsVyxFQUFhO0FBQ3BDQyxRQUFBQSxNQUFNLENBQUN2RSxJQUFQLENBQVlzRSxXQUFaO0FBQ0g7Ozs7SUFueUIwQnFCLGU7OztBQUFsQnJELEVBQUFBLFMsQ0FLSzBDLGUsR0FBMEIsS0FBSyxFO0FBTHBDMUMsRUFBQUEsUyxDQVdLc0QsbUIsR0FBOEJ0RCxTQUFTLENBQUMwQyxlQUFWLEdBQTRCLEM7QUFYL0QxQyxFQUFBQSxTLENBYUt1RCxFLEdBQUssVztBQTB4QnZCbEUsMEJBQVNXLFNBQVQsR0FBcUJBLFNBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG4vKipcclxuICogQGNhdGVnb3J5IGNvcmVcclxuICovXHJcblxyXG5pbXBvcnQgSWRHZW5lcmF0b3IgZnJvbSAnLi91dGlscy9pZC1nZW5lcmF0b3InO1xyXG5pbXBvcnQge2NyZWF0ZU1hcH0gZnJvbSAnLi91dGlscy9qcyc7XHJcbmltcG9ydCBTeXN0ZW0gZnJvbSAnLi9jb21wb25lbnRzL3N5c3RlbSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IGVycm9ySUQsIHdhcm5JRCwgbG9nSUQsIGFzc2VydElEIH0gZnJvbSAnLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcblxyXG5jb25zdCBNQVhfUE9PTF9TSVpFID0gMjA7XHJcblxyXG5jb25zdCBpZEdlbmVyYXRvciA9IG5ldyBJZEdlbmVyYXRvcignU2NoZWR1bGVyJyk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTY2hlZHVsYWJsZSB7XHJcbiAgICBpZD86c3RyaW5nO1xyXG4gICAgdXVpZD86c3RyaW5nO1xyXG59XHJcblxyXG4vLyBkYXRhIHN0cnVjdHVyZXNcclxuLyoqXHJcbiAqIEBlbiBBIGxpc3QgZG91YmxlLWxpbmtlZCBsaXN0IHVzZWQgZm9yIFwidXBkYXRlcyB3aXRoIHByaW9yaXR5XCJcclxuICogQHpoIOeUqOS6juKAnOS8mOWFiOabtOaWsOKAneeahOWIl+ihqFxyXG4gKiBAY2xhc3MgTGlzdEVudHJ5XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgbm90IHJldGFpbmVkIChyZXRhaW5lZCBieSBoYXNoVXBkYXRlRW50cnkpXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBwcmlvcml0eVxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHBhdXNlZFxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG1hcmtlZEZvckRlbGV0aW9uIHNlbGVjdG9yIHdpbGwgbm8gbG9uZ2VyIGJlIGNhbGxlZCBhbmQgZW50cnkgd2lsbCBiZSByZW1vdmVkIGF0IGVuZCBvZiB0aGUgbmV4dCB0aWNrXHJcbiAqL1xyXG5jbGFzcyBMaXN0RW50cnkge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0ID0gKHRhcmdldDogSVNjaGVkdWxhYmxlLCBwcmlvcml0eTogTnVtYmVyLCBwYXVzZWQ6IEJvb2xlYW4sIG1hcmtlZEZvckRlbGV0aW9uOiBCb29sZWFuKSA9PiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IExpc3RFbnRyeS5fbGlzdEVudHJpZXMucG9wKCk7XHJcbiAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICByZXN1bHQudGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICByZXN1bHQucHJpb3JpdHkgPSBwcmlvcml0eTtcclxuICAgICAgICAgICAgcmVzdWx0LnBhdXNlZCA9IHBhdXNlZDtcclxuICAgICAgICAgICAgcmVzdWx0Lm1hcmtlZEZvckRlbGV0aW9uID0gbWFya2VkRm9yRGVsZXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBuZXcgTGlzdEVudHJ5KHRhcmdldCwgcHJpb3JpdHksIHBhdXNlZCwgbWFya2VkRm9yRGVsZXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcHV0ID0gKGVudHJ5KSA9PiB7XHJcbiAgICAgICAgaWYgKExpc3RFbnRyeS5fbGlzdEVudHJpZXMubGVuZ3RoIDwgTUFYX1BPT0xfU0laRSkge1xyXG4gICAgICAgICAgICBlbnRyeS50YXJnZXQgPSBudWxsO1xyXG4gICAgICAgICAgICBMaXN0RW50cnkuX2xpc3RFbnRyaWVzLnB1c2goZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfbGlzdEVudHJpZXM6IGFueSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyB0YXJnZXQ6IElTY2hlZHVsYWJsZTtcclxuICAgIHB1YmxpYyBwcmlvcml0eTogTnVtYmVyO1xyXG4gICAgcHVibGljIHBhdXNlZDogQm9vbGVhbjtcclxuICAgIHB1YmxpYyBtYXJrZWRGb3JEZWxldGlvbjogQm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAodGFyZ2V0OiBJU2NoZWR1bGFibGUsIHByaW9yaXR5OiBOdW1iZXIsIHBhdXNlZDogQm9vbGVhbiwgbWFya2VkRm9yRGVsZXRpb246IEJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICB0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHk7XHJcbiAgICAgICAgdGhpcy5wYXVzZWQgPSBwYXVzZWQ7XHJcbiAgICAgICAgdGhpcy5tYXJrZWRGb3JEZWxldGlvbiA9IG1hcmtlZEZvckRlbGV0aW9uO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEEgdXBkYXRlIGVudHJ5IGxpc3RcclxuICogQHpoIOabtOaWsOadoeebruWIl+ihqFxyXG4gKiBAY2xhc3MgSGFzaFVwZGF0ZUVudHJ5XHJcbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgV2hpY2ggbGlzdCBkb2VzIGl0IGJlbG9uZyB0byA/XHJcbiAqIEBwYXJhbSB7TGlzdEVudHJ5fSBlbnRyeSBlbnRyeSBpbiB0aGUgbGlzdFxyXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IGhhc2gga2V5IChyZXRhaW5lZClcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcbmNsYXNzIEhhc2hVcGRhdGVFbnRyeSB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgPSAobGlzdDogYW55LCBlbnRyeTogTGlzdEVudHJ5LCB0YXJnZXQ6IElTY2hlZHVsYWJsZSwgY2FsbGJhY2s6IGFueSkgPT4ge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBIYXNoVXBkYXRlRW50cnkuX2hhc2hVcGRhdGVFbnRyaWVzLnBvcCgpO1xyXG4gICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgcmVzdWx0Lmxpc3QgPSBsaXN0O1xyXG4gICAgICAgICAgICByZXN1bHQuZW50cnkgPSBlbnRyeTtcclxuICAgICAgICAgICAgcmVzdWx0LnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICAgICAgcmVzdWx0LmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBuZXcgSGFzaFVwZGF0ZUVudHJ5KGxpc3QsIGVudHJ5LCB0YXJnZXQsIGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHB1dCA9IChlbnRyeSkgPT4ge1xyXG4gICAgICAgIGlmIChIYXNoVXBkYXRlRW50cnkuX2hhc2hVcGRhdGVFbnRyaWVzLmxlbmd0aCA8IE1BWF9QT09MX1NJWkUpIHtcclxuICAgICAgICAgICAgZW50cnkubGlzdCA9IGVudHJ5LmVudHJ5ID0gZW50cnkudGFyZ2V0ID0gZW50cnkuY2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgICAgICBIYXNoVXBkYXRlRW50cnkuX2hhc2hVcGRhdGVFbnRyaWVzLnB1c2goZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfaGFzaFVwZGF0ZUVudHJpZXM6IGFueSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBsaXN0OiBhbnk7XHJcbiAgICBwdWJsaWMgZW50cnk6IExpc3RFbnRyeTtcclxuICAgIHB1YmxpYyB0YXJnZXQ6IElTY2hlZHVsYWJsZTtcclxuICAgIHB1YmxpYyBjYWxsYmFjazogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChsaXN0OiBhbnksIGVudHJ5OiBMaXN0RW50cnksIHRhcmdldDogSVNjaGVkdWxhYmxlLCBjYWxsYmFjazogYW55KSB7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gbGlzdDtcclxuICAgICAgICB0aGlzLmVudHJ5ID0gZW50cnk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEhhc2ggRWxlbWVudCB1c2VkIGZvciBcInNlbGVjdG9ycyB3aXRoIGludGVydmFsXCJcclxuICogQHpoIOKAnOeUqOS6jumXtOmalOmAieaLqeKAneeahOWTiOW4jOWFg+e0oFxyXG4gKiBAY2xhc3MgSGFzaFRpbWVyRW50cnlcclxuICogQHBhcmFtIHtBcnJheX0gdGltZXJzXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgIGhhc2gga2V5IChyZXRhaW5lZClcclxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVySW5kZXhcclxuICogQHBhcmFtIHtUaW1lcn0gY3VycmVudFRpbWVyXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY3VycmVudFRpbWVyU2FsdmFnZWRcclxuICogQHBhcmFtIHtCb29sZWFufSBwYXVzZWRcclxuICovXHJcbmNsYXNzIEhhc2hUaW1lckVudHJ5IHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCA9ICh0aW1lcnM6IGFueSwgdGFyZ2V0OiBJU2NoZWR1bGFibGUsIHRpbWVySW5kZXg6IE51bWJlciwgY3VycmVudFRpbWVyOiBhbnksIGN1cnJlbnRUaW1lclNhbHZhZ2VkOiBhbnksIHBhdXNlZDogYW55KSA9PiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IEhhc2hUaW1lckVudHJ5Ll9oYXNoVGltZXJFbnRyaWVzLnBvcCgpO1xyXG4gICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgcmVzdWx0LnRpbWVycyA9IHRpbWVycztcclxuICAgICAgICAgICAgcmVzdWx0LnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICAgICAgcmVzdWx0LnRpbWVySW5kZXggPSB0aW1lckluZGV4O1xyXG4gICAgICAgICAgICByZXN1bHQuY3VycmVudFRpbWVyID0gY3VycmVudFRpbWVyO1xyXG4gICAgICAgICAgICByZXN1bHQuY3VycmVudFRpbWVyU2FsdmFnZWQgPSBjdXJyZW50VGltZXJTYWx2YWdlZDtcclxuICAgICAgICAgICAgcmVzdWx0LnBhdXNlZCA9IHBhdXNlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBIYXNoVGltZXJFbnRyeSh0aW1lcnMsIHRhcmdldCwgdGltZXJJbmRleCwgY3VycmVudFRpbWVyLCBjdXJyZW50VGltZXJTYWx2YWdlZCwgcGF1c2VkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHB1dCA9IChlbnRyeSkgPT4ge1xyXG4gICAgICAgIGlmIChIYXNoVGltZXJFbnRyeS5faGFzaFRpbWVyRW50cmllcy5sZW5ndGggPCBNQVhfUE9PTF9TSVpFKSB7XHJcbiAgICAgICAgICAgIGVudHJ5LnRpbWVycyA9IGVudHJ5LnRhcmdldCA9IGVudHJ5LmN1cnJlbnRUaW1lciA9IG51bGw7XHJcbiAgICAgICAgICAgIEhhc2hUaW1lckVudHJ5Ll9oYXNoVGltZXJFbnRyaWVzLnB1c2goZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfaGFzaFRpbWVyRW50cmllczogYW55ID0gW107XHJcblxyXG4gICAgcHVibGljIHRpbWVyczogYW55O1xyXG4gICAgcHVibGljIHRhcmdldDogSVNjaGVkdWxhYmxlO1xyXG4gICAgcHVibGljIHRpbWVySW5kZXg6IE51bWJlcjtcclxuICAgIHB1YmxpYyBjdXJyZW50VGltZXI6IGFueTtcclxuICAgIHB1YmxpYyBjdXJyZW50VGltZXJTYWx2YWdlZDogYW55O1xyXG4gICAgcHVibGljIHBhdXNlZDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh0aW1lcnM6IGFueSwgdGFyZ2V0OiBJU2NoZWR1bGFibGUsIHRpbWVySW5kZXg6IE51bWJlciwgY3VycmVudFRpbWVyOiBhbnksIGN1cnJlbnRUaW1lclNhbHZhZ2VkOiBhbnksIHBhdXNlZDogYW55KXtcclxuICAgICAgICB0aGlzLnRpbWVycyA9IHRpbWVycztcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICB0aGlzLnRpbWVySW5kZXggPSB0aW1lckluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRpbWVyID0gY3VycmVudFRpbWVyO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRpbWVyU2FsdmFnZWQgPSBjdXJyZW50VGltZXJTYWx2YWdlZDtcclxuICAgICAgICB0aGlzLnBhdXNlZCA9IHBhdXNlZDtcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuICogTGlnaHQgd2VpZ2h0IHRpbWVyXHJcbiAqL1xyXG5jbGFzcyBDYWxsYmFja1RpbWVyIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIF90aW1lcnM6IGFueSA9IFtdO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gQ2FsbGJhY2tUaW1lci5fdGltZXJzLnBvcCgpIHx8IG5ldyBDYWxsYmFja1RpbWVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHB1dCA9ICh0aW1lcikgPT4ge1xyXG4gICAgICAgIGlmIChDYWxsYmFja1RpbWVyLl90aW1lcnMubGVuZ3RoIDwgTUFYX1BPT0xfU0laRSAmJiAhdGltZXIuX2xvY2spIHtcclxuICAgICAgICAgICAgdGltZXIuX3NjaGVkdWxlciA9IHRpbWVyLl90YXJnZXQgPSB0aW1lci5fY2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgICAgICBDYWxsYmFja1RpbWVyLl90aW1lcnMucHVzaCh0aW1lcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2xvY2s6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9zY2hlZHVsZXI6IGFueTtcclxuICAgIHByaXZhdGUgX2VsYXBzZWQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3J1bkZvcmV2ZXI6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF91c2VEZWxheTogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3RpbWVzRXhlY3V0ZWQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3JlcGVhdDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZGVsYXk6IG51bWJlcjtcclxuICAgIHByaXZhdGUgIF9pbnRlcnZhbDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfdGFyZ2V0OiBJU2NoZWR1bGFibGUgfCBudWxsO1xyXG4gICAgcHJpdmF0ZSBfY2FsbGJhY2s6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5fbG9jayA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fZWxhcHNlZCA9IC0xO1xyXG4gICAgICAgIHRoaXMuX3J1bkZvcmV2ZXIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl91c2VEZWxheSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3RpbWVzRXhlY3V0ZWQgPSAwO1xyXG4gICAgICAgIHRoaXMuX3JlcGVhdCA9IDA7XHJcbiAgICAgICAgdGhpcy5fZGVsYXkgPSAwO1xyXG4gICAgICAgIHRoaXMuX2ludGVydmFsID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXRXaXRoQ2FsbGJhY2sgKHNjaGVkdWxlcjogYW55LCBjYWxsYmFjazogYW55LCB0YXJnZXQ6IElTY2hlZHVsYWJsZSwgc2Vjb25kczogbnVtYmVyLCByZXBlYXQ6IG51bWJlciwgZGVsYXk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2xvY2sgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XHJcblxyXG4gICAgICAgIHRoaXMuX2VsYXBzZWQgPSAtMTtcclxuICAgICAgICB0aGlzLl9pbnRlcnZhbCA9IHNlY29uZHM7XHJcbiAgICAgICAgdGhpcy5fZGVsYXkgPSBkZWxheTtcclxuICAgICAgICB0aGlzLl91c2VEZWxheSA9ICh0aGlzLl9kZWxheSA+IDApO1xyXG4gICAgICAgIHRoaXMuX3JlcGVhdCA9IHJlcGVhdDtcclxuICAgICAgICB0aGlzLl9ydW5Gb3JldmVyID0gKHRoaXMuX3JlcGVhdCA9PT0gbGVnYWN5Q0MubWFjcm8uUkVQRUFUX0ZPUkVWRVIpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHJldHVybnMgaW50ZXJ2YWwgb2YgdGltZXJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEludGVydmFsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJ2YWw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCBzZXQgaW50ZXJ2YWwgaW4gc2Vjb25kc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0SW50ZXJ2YWwgKGludGVydmFsKSB7XHJcbiAgICAgICAgdGhpcy5faW50ZXJ2YWwgPSBpbnRlcnZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRyaWdnZXJzIHRoZSB0aW1lclxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IGRlbHRhIHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHVwZGF0ZSAoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9lbGFwc2VkID09PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbGFwc2VkID0gMDtcclxuICAgICAgICAgICAgdGhpcy5fdGltZXNFeGVjdXRlZCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxhcHNlZCArPSBkdDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3J1bkZvcmV2ZXIgJiYgIXRoaXMuX3VzZURlbGF5KSB7Ly8gc3RhbmRhcmQgdGltZXIgdXNhZ2VcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9lbGFwc2VkID49IHRoaXMuX2ludGVydmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7Ly8gYWR2YW5jZWQgdXNhZ2VcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl91c2VEZWxheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9lbGFwc2VkID49IHRoaXMuX2RlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZCAtPSB0aGlzLl9kZWxheTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGltZXNFeGVjdXRlZCArPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91c2VEZWxheSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VsYXBzZWQgPj0gdGhpcy5faW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGFwc2VkID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGltZXNFeGVjdXRlZCArPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2FsbGJhY2sgJiYgIXRoaXMuX3J1bkZvcmV2ZXIgJiYgdGhpcy5fdGltZXNFeGVjdXRlZCA+IHRoaXMuX3JlcGVhdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENhbGxiYWNrICgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYWxsYmFjaztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJpZ2dlciAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldCAmJiB0aGlzLl9jYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2NrID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2suY2FsbCh0aGlzLl90YXJnZXQsIHRoaXMuX2VsYXBzZWQpO1xyXG4gICAgICAgICAgICB0aGlzLl9sb2NrID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjYW5jZWwgKCkge1xyXG4gICAgICAgIC8vIG92ZXJyaWRlXHJcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnVuc2NoZWR1bGUodGhpcy5fY2FsbGJhY2ssIHRoaXMuX3RhcmdldCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogU2NoZWR1bGVyIGlzIHJlc3BvbnNpYmxlIG9mIHRyaWdnZXJpbmcgdGhlIHNjaGVkdWxlZCBjYWxsYmFja3MuPGJyPlxyXG4gKiBZb3Ugc2hvdWxkIG5vdCB1c2UgTlNUaW1lci4gSW5zdGVhZCB1c2UgdGhpcyBjbGFzcy48YnI+XHJcbiAqIDxicj5cclxuICogVGhlcmUgYXJlIDIgZGlmZmVyZW50IHR5cGVzIG9mIGNhbGxiYWNrcyAoc2VsZWN0b3JzKTo8YnI+XHJcbiAqICAgICAtIHVwZGF0ZSBjYWxsYmFjazogdGhlICd1cGRhdGUnIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIGV2ZXJ5IGZyYW1lLiBZb3UgY2FuIGN1c3RvbWl6ZSB0aGUgcHJpb3JpdHkuPGJyPlxyXG4gKiAgICAgLSBjdXN0b20gY2FsbGJhY2s6IEEgY3VzdG9tIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIGV2ZXJ5IGZyYW1lLCBvciB3aXRoIGEgY3VzdG9tIGludGVydmFsIG9mIHRpbWU8YnI+XHJcbiAqIDxicj5cclxuICogVGhlICdjdXN0b20gc2VsZWN0b3JzJyBzaG91bGQgYmUgYXZvaWRlZCB3aGVuIHBvc3NpYmxlLiBJdCBpcyBmYXN0ZXIsPGJyPlxyXG4gKiBhbmQgY29uc3VtZXMgbGVzcyBtZW1vcnkgdG8gdXNlIHRoZSAndXBkYXRlIGNhbGxiYWNrJy4gKlxyXG4gKiBAemhcclxuICogU2NoZWR1bGVyIOaYr+i0n+i0o+inpuWPkeWbnuiwg+WHveaVsOeahOexu+OAgjxicj5cclxuICog6YCa5bi45oOF5Ya15LiL77yM5bu66K6u5L2/55SoIGBkaXJlY3Rvci5nZXRTY2hlZHVsZXIoKWAg5p2l6I635Y+W57O757uf5a6a5pe25Zmo44CCPGJyPlxyXG4gKiDmnInkuKTnp43kuI3lkIznsbvlnovnmoTlrprml7blmajvvJo8YnI+XHJcbiAqICAgICAtIHVwZGF0ZSDlrprml7blmajvvJrmr4/kuIDluKfpg73kvJrop6blj5HjgILmgqjlj6/ku6Xoh6rlrprkuYnkvJjlhYjnuqfjgII8YnI+XHJcbiAqICAgICAtIOiHquWumuS5ieWumuaXtuWZqO+8muiHquWumuS5ieWumuaXtuWZqOWPr+S7peavj+S4gOW4p+aIluiAheiHquWumuS5ieeahOaXtumXtOmXtOmalOinpuWPkeOAgjxicj5cclxuICog5aaC5p6c5biM5pyb5q+P5bin6YO96Kem5Y+R77yM5bqU6K+l5L2/55SoIHVwZGF0ZSDlrprml7blmajvvIzkvb/nlKggdXBkYXRlIOWumuaXtuWZqOabtOW/q++8jOiAjOS4lOa2iOiAl+abtOWwkeeahOWGheWtmOOAglxyXG4gKlxyXG4gKiBAY2xhc3MgU2NoZWR1bGVyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2NoZWR1bGVyIGV4dGVuZHMgU3lzdGVtIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFByaW9yaXR5IGxldmVsIHJlc2VydmVkIGZvciBzeXN0ZW0gc2VydmljZXMuXHJcbiAgICAgKiBAemgg57O757uf5pyN5Yqh55qE5LyY5YWI57qn44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgUFJJT1JJVFlfU1lTVEVNOiBudW1iZXIgPSAxIDw8IDMxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE1pbmltdW0gcHJpb3JpdHkgbGV2ZWwgZm9yIHVzZXIgc2NoZWR1bGluZy5cclxuICAgICAqIEB6aCDnlKjmiLfosIPluqbmnIDkvY7kvJjlhYjnuqfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBQUklPUklUWV9OT05fU1lTVEVNOiBudW1iZXIgPSBTY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNICsgMTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIElEID0gJ3NjaGVkdWxlcic7XHJcblxyXG4gICAgcHJpdmF0ZSBfdGltZVNjYWxlOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF91cGRhdGVzTmVnTGlzdDogYW55W107XHJcbiAgICBwcml2YXRlIF91cGRhdGVzMExpc3Q6IGFueVtdO1xyXG4gICAgcHJpdmF0ZSBfdXBkYXRlc1Bvc0xpc3Q6IGFueVtdO1xyXG4gICAgcHJpdmF0ZSBfaGFzaEZvclVwZGF0ZXM6IGFueTtcclxuICAgIHByaXZhdGUgX2hhc2hGb3JUaW1lcnM6IGFueTtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRUYXJnZXQ6IGFueTtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRUYXJnZXRTYWx2YWdlZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3VwZGF0ZUhhc2hMb2NrZWQ6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9hcnJheUZvclRpbWVycztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIGZvciBhbnkgdGFyZ2V0IHdoaWNoIG5lZWRzIHRvIHNjaGVkdWxlIHRhc2tzLCBhbmQgdGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCBiZWZvcmUgYW55IHNjaGVkdWxlciBBUEkgdXNhZ2UuPGJnPlxyXG4gICAgICogVGhpcyBtZXRob2Qgd2lsbCBhZGQgYSBgaWRgIHByb3BlcnR5IGlmIGl0IGRvZXNuJ3QgZXhpc3QuXHJcbiAgICAgKiBAemgg5Lu75L2V6ZyA6KaB55SoIFNjaGVkdWxlciDnrqHnkIbku7vliqHnmoTlr7nosaHkuLvkvZPpg73lupTor6XosIPnlKjov5nkuKrmlrnms5XvvIzlubbkuJTlupTor6XlnKjosIPnlKjku7vkvZUgU2NoZWR1bGVyIEFQSSDkuYvliY3osIPnlKjov5nkuKrmlrnms5XjgII8Ymc+XHJcbiAgICAgKiDov5nkuKrmlrnms5XkvJrnu5nlr7nosaHmt7vliqDkuIDkuKogYGlkYCDlsZ7mgKfvvIzlpoLmnpzov5nkuKrlsZ7mgKfkuI3lrZjlnKjnmoTor53jgIJcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBlbmFibGVGb3JUYXJnZXQgKHRhcmdldDogSVNjaGVkdWxhYmxlKSB7XHJcbiAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRhcmdldC51dWlkKSB7XHJcbiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGFyZ2V0LmlkKSB7XHJcbiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFmb3VuZCkge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQuX19pbnN0YW5jZUlkKSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuSUQoMTUxMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuaWQgPSBpZEdlbmVyYXRvci5nZXROZXdJZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3RpbWVTY2FsZSA9IDEuMDtcclxuICAgICAgICB0aGlzLl91cGRhdGVzTmVnTGlzdCA9IFtdOyAgLy8gbGlzdCBvZiBwcmlvcml0eSA8IDBcclxuICAgICAgICB0aGlzLl91cGRhdGVzMExpc3QgPSBbXTsgICAgLy8gbGlzdCBvZiBwcmlvcml0eSA9PSAwXHJcbiAgICAgICAgdGhpcy5fdXBkYXRlc1Bvc0xpc3QgPSBbXTsgIC8vIGxpc3Qgb2YgcHJpb3JpdHkgPiAwXHJcbiAgICAgICAgdGhpcy5faGFzaEZvclVwZGF0ZXMgPSBjcmVhdGVNYXAodHJ1ZSk7ICAvLyBoYXNoIHVzZWQgdG8gZmV0Y2ggcXVpY2tseSB0aGUgbGlzdCBlbnRyaWVzIGZvciBwYXVzZSwgZGVsZXRlLCBldGNcclxuICAgICAgICB0aGlzLl9oYXNoRm9yVGltZXJzID0gY3JlYXRlTWFwKHRydWUpOyAgIC8vIFVzZWQgZm9yIFwic2VsZWN0b3JzIHdpdGggaW50ZXJ2YWxcIlxyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRUYXJnZXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRUYXJnZXRTYWx2YWdlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUhhc2hMb2NrZWQgPSBmYWxzZTsgLy8gSWYgdHJ1ZSB1bnNjaGVkdWxlIHdpbGwgbm90IHJlbW92ZSBhbnl0aGluZyBmcm9tIGEgaGFzaC4gRWxlbWVudHMgd2lsbCBvbmx5IGJlIG1hcmtlZCBmb3IgZGVsZXRpb24uXHJcblxyXG4gICAgICAgIHRoaXMuX2FycmF5Rm9yVGltZXJzID0gW107ICAvLyBTcGVlZCB1cCBpbmRleGluZ1xyXG4gICAgICAgIC8vIHRoaXMuX2FycmF5Rm9yVXBkYXRlcyA9IFtdOyAgIC8vIFNwZWVkIHVwIGluZGV4aW5nXHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1wdWJsaWMgbWV0aG9kLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBNb2RpZmllcyB0aGUgdGltZSBvZiBhbGwgc2NoZWR1bGVkIGNhbGxiYWNrcy48YnI+XHJcbiAgICAgKiBZb3UgY2FuIHVzZSB0aGlzIHByb3BlcnR5IHRvIGNyZWF0ZSBhICdzbG93IG1vdGlvbicgb3IgJ2Zhc3QgZm9yd2FyZCcgZWZmZWN0Ljxicj5cclxuICAgICAqIERlZmF1bHQgaXMgMS4wLiBUbyBjcmVhdGUgYSAnc2xvdyBtb3Rpb24nIGVmZmVjdCwgdXNlIHZhbHVlcyBiZWxvdyAxLjAuPGJyPlxyXG4gICAgICogVG8gY3JlYXRlIGEgJ2Zhc3QgZm9yd2FyZCcgZWZmZWN0LCB1c2UgdmFsdWVzIGhpZ2hlciB0aGFuIDEuMC48YnI+XHJcbiAgICAgKiBOb3Rl77yaSXQgd2lsbCBhZmZlY3QgRVZFUlkgc2NoZWR1bGVkIHNlbGVjdG9yIC8gYWN0aW9uLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva7ml7bpl7Tpl7TpmpTnmoTnvKnmlL7mr5TkvovjgII8YnI+XHJcbiAgICAgKiDmgqjlj6/ku6Xkvb/nlKjov5nkuKrmlrnms5XmnaXliJvlu7rkuIDkuKog4oCcc2xvdyBtb3Rpb27vvIjmhaLliqjkvZzvvInigJ0g5oiWIOKAnGZhc3QgZm9yd2FyZO+8iOW/q+i/m++8ieKAnSDnmoTmlYjmnpzjgII8YnI+XHJcbiAgICAgKiDpu5jorqTmmK8gMS4w44CC6KaB5Yib5bu65LiA5LiqIOKAnHNsb3cgbW90aW9u77yI5oWi5Yqo5L2c77yJ4oCdIOaViOaenCzkvb/nlKjlgLzkvY7kuo4gMS4w44CCPGJyPlxyXG4gICAgICog6KaB5L2/55SoIOKAnGZhc3QgZm9yd2FyZO+8iOW/q+i/m++8ieKAnSDmlYjmnpzvvIzkvb/nlKjlgLzlpKfkuo4gMS4w44CCPGJyPlxyXG4gICAgICog5rOo5oSP77ya5a6D5b2x5ZON6K+lIFNjaGVkdWxlciDkuIvnrqHnkIbnmoTmiYDmnInlrprml7blmajjgIJcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lU2NhbGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFRpbWVTY2FsZSAodGltZVNjYWxlKSB7XHJcbiAgICAgICAgdGhpcy5fdGltZVNjYWxlID0gdGltZVNjYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGltZSBzY2FsZSBvZiBzY2hlZHVsZXIuXHJcbiAgICAgKiBAemgg6I635Y+W5pe26Ze06Ze06ZqU55qE57yp5pS+5q+U5L6L44CCXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRUaW1lU2NhbGUgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbWVTY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiAndXBkYXRlJyB0aGUgc2NoZWR1bGVyLiAoWW91IHNob3VsZCBORVZFUiBjYWxsIHRoaXMgbWV0aG9kLCB1bmxlc3MgeW91IGtub3cgd2hhdCB5b3UgYXJlIGRvaW5nLilcclxuICAgICAqIEB6aCB1cGRhdGUg6LCD5bqm5Ye95pWw44CCKOS4jeW6lOivpeebtOaOpeiwg+eUqOi/meS4quaWueazle+8jOmZpOmdnuWujOWFqOS6huino+i/meS5iOWBmueahOe7k+aenClcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdCBkZWx0YSB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1cGRhdGUgKGR0KSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlSGFzaExvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVTY2FsZSAhPT0gMSkge1xyXG4gICAgICAgICAgICBkdCAqPSB0aGlzLl90aW1lU2NhbGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaTogbnVtYmVyO1xyXG4gICAgICAgIGxldCBsaXN0O1xyXG4gICAgICAgIGxldCBsZW46IG51bWJlcjtcclxuICAgICAgICBsZXQgZW50cnk7XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDAsIGxpc3QgPSB0aGlzLl91cGRhdGVzTmVnTGlzdCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICAgICAgICAgIGVudHJ5ID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgaWYgKCFlbnRyeS5wYXVzZWQgJiYgIWVudHJ5Lm1hcmtlZEZvckRlbGV0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeS50YXJnZXQudXBkYXRlKGR0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICggaSA9IDAsIGxpc3QgPSB0aGlzLl91cGRhdGVzMExpc3QsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgICAgICAgICBlbnRyeSA9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGlmICghZW50cnkucGF1c2VkICYmICFlbnRyeS5tYXJrZWRGb3JEZWxldGlvbikge1xyXG4gICAgICAgICAgICAgICAgZW50cnkudGFyZ2V0LnVwZGF0ZShkdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoIGkgPSAwLCBsaXN0ID0gdGhpcy5fdXBkYXRlc1Bvc0xpc3QsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgICAgICAgICBlbnRyeSA9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGlmICghZW50cnkucGF1c2VkICYmICFlbnRyeS5tYXJrZWRGb3JEZWxldGlvbikge1xyXG4gICAgICAgICAgICAgICAgZW50cnkudGFyZ2V0LnVwZGF0ZShkdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIGN1c3RvbSBzZWxlY3RvcnNcclxuICAgICAgICBsZXQgZWx0O1xyXG4gICAgICAgIGNvbnN0IGFyciA9IHRoaXMuX2FycmF5Rm9yVGltZXJzO1xyXG4gICAgICAgIGZvciAoIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgZWx0ID0gYXJyW2ldO1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VGFyZ2V0ID0gZWx0O1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VGFyZ2V0U2FsdmFnZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZWx0LnBhdXNlZCl7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgJ3RpbWVycycgYXJyYXkgbWF5IGNoYW5nZSB3aGlsZSBpbnNpZGUgdGhpcyBsb29wXHJcbiAgICAgICAgICAgICAgICBmb3IgKGVsdC50aW1lckluZGV4ID0gMDsgZWx0LnRpbWVySW5kZXggPCBlbHQudGltZXJzLmxlbmd0aDsgKysoZWx0LnRpbWVySW5kZXgpKXtcclxuICAgICAgICAgICAgICAgICAgICBlbHQuY3VycmVudFRpbWVyID0gZWx0LnRpbWVyc1tlbHQudGltZXJJbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgZWx0LmN1cnJlbnRUaW1lclNhbHZhZ2VkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsdC5jdXJyZW50VGltZXIudXBkYXRlKGR0KTtcclxuICAgICAgICAgICAgICAgICAgICBlbHQuY3VycmVudFRpbWVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gb25seSBkZWxldGUgY3VycmVudFRhcmdldCBpZiBubyBhY3Rpb25zIHdlcmUgc2NoZWR1bGVkIGR1cmluZyB0aGUgY3ljbGUgKGlzc3VlICM0ODEpXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50VGFyZ2V0U2FsdmFnZWQgJiYgdGhpcy5fY3VycmVudFRhcmdldC50aW1lcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVIYXNoRWxlbWVudCh0aGlzLl9jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIC0taTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZGVsZXRlIGFsbCB1cGRhdGVzIHRoYXQgYXJlIG1hcmtlZCBmb3IgZGVsZXRpb25cclxuICAgICAgICAvLyB1cGRhdGVzIHdpdGggcHJpb3JpdHkgPCAwXHJcbiAgICAgICAgZm9yICggaSA9IDAsIGxpc3QgPSB0aGlzLl91cGRhdGVzTmVnTGlzdDsgaSA8IGxpc3QubGVuZ3RoOyApe1xyXG4gICAgICAgICAgICBlbnRyeSA9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGlmIChlbnRyeS5tYXJrZWRGb3JEZWxldGlvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlVXBkYXRlRnJvbUhhc2goZW50cnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKCBpID0gMCwgbGlzdCA9IHRoaXMuX3VwZGF0ZXMwTGlzdDsgaSA8IGxpc3QubGVuZ3RoOyApe1xyXG4gICAgICAgICAgICBlbnRyeSA9IGxpc3RbaV07XHJcbiAgICAgICAgICAgIGlmIChlbnRyeS5tYXJrZWRGb3JEZWxldGlvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlVXBkYXRlRnJvbUhhc2goZW50cnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKCBpID0gMCwgbGlzdCA9IHRoaXMuX3VwZGF0ZXNQb3NMaXN0OyBpIDwgbGlzdC5sZW5ndGg7ICl7XHJcbiAgICAgICAgICAgIGVudHJ5ID0gbGlzdFtpXTtcclxuICAgICAgICAgICAgaWYgKGVudHJ5Lm1hcmtlZEZvckRlbGV0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVVcGRhdGVGcm9tSGFzaChlbnRyeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUhhc2hMb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50VGFyZ2V0ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogPHA+XHJcbiAgICAgKiAgIFRoZSBzY2hlZHVsZWQgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIGV2ZXJ5ICdpbnRlcnZhbCcgc2Vjb25kcy48YnIvPlxyXG4gICAgICogICBJZiBwYXVzZWQgaXMgWUVTLCB0aGVuIGl0IHdvbid0IGJlIGNhbGxlZCB1bnRpbCBpdCBpcyByZXN1bWVkLjxici8+XHJcbiAgICAgKiAgIElmICdpbnRlcnZhbCcgaXMgMCwgaXQgd2lsbCBiZSBjYWxsZWQgZXZlcnkgZnJhbWUsIGJ1dCBpZiBzbywgaXQgcmVjb21tZW5kZWQgdG8gdXNlICdzY2hlZHVsZVVwZGF0ZUZvclRhcmdldDonIGluc3RlYWQuPGJyLz5cclxuICAgICAqICAgSWYgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIGFscmVhZHkgc2NoZWR1bGVkLCB0aGVuIG9ubHkgdGhlIGludGVydmFsIHBhcmFtZXRlciB3aWxsIGJlIHVwZGF0ZWQgd2l0aG91dCByZS1zY2hlZHVsaW5nIGl0IGFnYWluLjxici8+XHJcbiAgICAgKiAgIHJlcGVhdCBsZXQgdGhlIGFjdGlvbiBiZSByZXBlYXRlZCByZXBlYXQgKyAxIHRpbWVzLCB1c2UgYG1hY3JvLlJFUEVBVF9GT1JFVkVSYCB0byBsZXQgdGhlIGFjdGlvbiBydW4gY29udGludW91c2x5PGJyLz5cclxuICAgICAqICAgZGVsYXkgaXMgdGhlIGFtb3VudCBvZiB0aW1lIHRoZSBhY3Rpb24gd2lsbCB3YWl0IGJlZm9yZSBpdCdsbCBzdGFydDxici8+XHJcbiAgICAgKiA8L3A+XHJcbiAgICAgKiBAemhcclxuICAgICAqIOaMh+WumuWbnuiwg+WHveaVsO+8jOiwg+eUqOWvueixoeetieS/oeaBr+adpea3u+WKoOS4gOS4quaWsOeahOWumuaXtuWZqOOAgjxici8+XHJcbiAgICAgKiDlpoLmnpwgcGF1c2VkIOWAvOS4uiB0cnVl77yM6YKj5LmI55u05YiwIHJlc3VtZSDooqvosIPnlKjmiY3lvIDlp4vorqHml7bjgII8YnIvPlxyXG4gICAgICog5b2T5pe26Ze06Ze06ZqU6L6+5Yiw5oyH5a6a5YC85pe277yM6K6+572u55qE5Zue6LCD5Ye95pWw5bCG5Lya6KKr6LCD55So44CCPGJyLz5cclxuICAgICAqIOWmguaenCBpbnRlcnZhbCDlgLzkuLogMO+8jOmCo+S5iOWbnuiwg+WHveaVsOavj+S4gOW4p+mDveS8muiiq+iwg+eUqO+8jOS9huWmguaenOaYr+i/meagt++8jFxyXG4gICAgICog5bu66K6u5L2/55SoIHNjaGVkdWxlVXBkYXRlRm9yVGFyZ2V0IOS7o+abv+OAgjxici8+XHJcbiAgICAgKiDlpoLmnpzlm57osIPlh73mlbDlt7Lnu4/ooqvlrprml7blmajkvb/nlKjvvIzpgqPkuYjlj6rkvJrmm7TmlrDkuYvliY3lrprml7blmajnmoTml7bpl7Tpl7TpmpTlj4LmlbDvvIzkuI3kvJrorr7nva7mlrDnmoTlrprml7blmajjgII8YnIvPlxyXG4gICAgICogcmVwZWF0IOWAvOWPr+S7peiuqeWumuaXtuWZqOinpuWPkSByZXBlYXQgKyAxIOasoe+8jOS9v+eUqCBgbWFjcm8uUkVQRUFUX0ZPUkVWRVJgXHJcbiAgICAgKiDlj6/ku6Xorqnlrprml7blmajkuIDnm7Tlvqrnjq/op6blj5HjgII8YnIvPlxyXG4gICAgICogZGVsYXkg5YC85oyH5a6a5bu26L+f5pe26Ze077yM5a6a5pe25Zmo5Lya5Zyo5bu26L+f5oyH5a6a55qE5pe26Ze05LmL5ZCO5byA5aeL6K6h5pe244CCXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3JlcGVhdF1cclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsYXk9MF1cclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3BhdXNlZD1mYXNsZV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjaGVkdWxlIChjYWxsYmFjazogRnVuY3Rpb24sIHRhcmdldDogSVNjaGVkdWxhYmxlLCBpbnRlcnZhbDogbnVtYmVyLCByZXBlYXQ/OiBudW1iZXIsIGRlbGF5PzogbnVtYmVyLCBwYXVzZWQ/OiBib29sZWFuKSB7XHJcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgY29uc3QgdG1wID0gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgY2FsbGJhY2sgPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgIHRhcmdldCA9IHRtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc2VsZWN0b3IsIHRhcmdldCwgaW50ZXJ2YWwsIHJlcGVhdCwgZGVsYXksIHBhdXNlZFxyXG4gICAgICAgIC8vIHNlbGVjdG9yLCB0YXJnZXQsIGludGVydmFsLCBwYXVzZWRcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA0IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcclxuICAgICAgICAgICAgcGF1c2VkID0gISFyZXBlYXQ7XHJcbiAgICAgICAgICAgIHJlcGVhdCA9IGxlZ2FjeUNDLm1hY3JvLlJFUEVBVF9GT1JFVkVSO1xyXG4gICAgICAgICAgICBkZWxheSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhc3NlcnRJRCh0YXJnZXQsIDE1MDIpO1xyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0SWQgPSB0YXJnZXQudXVpZCB8fCB0YXJnZXQuaWQ7XHJcbiAgICAgICAgaWYgKCF0YXJnZXRJZCkge1xyXG4gICAgICAgICAgICBlcnJvcklEKDE1MTApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5faGFzaEZvclRpbWVyc1t0YXJnZXRJZF07XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIC8vIElzIHRoaXMgdGhlIDFzdCBlbGVtZW50ID8gVGhlbiBzZXQgdGhlIHBhdXNlIGxldmVsIHRvIGFsbCB0aGUgY2FsbGJhY2tfZm5zIG9mIHRoaXMgdGFyZ2V0XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBIYXNoVGltZXJFbnRyeS5nZXQobnVsbCwgdGFyZ2V0LCAwLCBudWxsLCBudWxsLCBwYXVzZWQpO1xyXG4gICAgICAgICAgICB0aGlzLl9hcnJheUZvclRpbWVycy5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9oYXNoRm9yVGltZXJzW3RhcmdldElkXSA9IGVsZW1lbnQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnBhdXNlZCAhPT0gcGF1c2VkKSB7XHJcbiAgICAgICAgICAgIHdhcm5JRCgxNTExKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0aW1lcjtcclxuICAgICAgICBsZXQgaTtcclxuICAgICAgICBpZiAoZWxlbWVudC50aW1lcnMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnRpbWVycyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGVsZW1lbnQudGltZXJzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aW1lciA9IGVsZW1lbnQudGltZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRpbWVyICYmIGNhbGxiYWNrID09PSB0aW1lci5fY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dJRCgxNTA3LCB0aW1lci5nZXRJbnRlcnZhbCgpLCBpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXIuX2ludGVydmFsID0gaW50ZXJ2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aW1lciA9IENhbGxiYWNrVGltZXIuZ2V0KCk7XHJcbiAgICAgICAgdGltZXIuaW5pdFdpdGhDYWxsYmFjayh0aGlzLCBjYWxsYmFjaywgdGFyZ2V0LCBpbnRlcnZhbCwgcmVwZWF0LCBkZWxheSk7XHJcbiAgICAgICAgZWxlbWVudC50aW1lcnMucHVzaCh0aW1lcik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50VGFyZ2V0ID09PSBlbGVtZW50ICYmIHRoaXMuX2N1cnJlbnRUYXJnZXRTYWx2YWdlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VGFyZ2V0U2FsdmFnZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNjaGVkdWxlcyB0aGUgdXBkYXRlIGNhbGxiYWNrIGZvciBhIGdpdmVuIHRhcmdldCxcclxuICAgICAqIER1cmluZyBldmVyeSBmcmFtZSBhZnRlciBzY2hlZHVsZSBzdGFydGVkLCB0aGUgXCJ1cGRhdGVcIiBmdW5jdGlvbiBvZiB0YXJnZXQgd2lsbCBiZSBpbnZva2VkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDkvb/nlKjmjIflrprnmoTkvJjlhYjnuqfkuLrmjIflrprnmoTlr7nosaHorr7nva4gdXBkYXRlIOWumuaXtuWZqOOAgjxicj5cclxuICAgICAqIHVwZGF0ZSDlrprml7blmajmr4/kuIDluKfpg73kvJrooqvop6blj5HvvIzop6blj5Hml7boh6rliqjosIPnlKjmjIflrprlr7nosaHnmoQgXCJ1cGRhdGVcIiDlh73mlbDjgII8YnI+XHJcbiAgICAgKiDkvJjlhYjnuqfnmoTlgLzotorkvY7vvIzlrprml7blmajooqvop6blj5HnmoTotorml6njgIJcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwcmlvcml0eVxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBwYXVzZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjaGVkdWxlVXBkYXRlICh0YXJnZXQ6IElTY2hlZHVsYWJsZSwgcHJpb3JpdHk6IE51bWJlciwgcGF1c2VkOiBCb29sZWFuKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldElkID0gdGFyZ2V0LnV1aWQgfHwgdGFyZ2V0LmlkO1xyXG4gICAgICAgIGlmICghdGFyZ2V0SWQpIHtcclxuICAgICAgICAgICAgZXJyb3JJRCgxNTEwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBoYXNoRWxlbWVudCA9IHRoaXMuX2hhc2hGb3JVcGRhdGVzW3RhcmdldElkXTtcclxuICAgICAgICBpZiAoaGFzaEVsZW1lbnQgJiYgaGFzaEVsZW1lbnQuZW50cnkpe1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBwcmlvcml0eSBoYXMgY2hhbmdlZFxyXG4gICAgICAgICAgICBpZiAoaGFzaEVsZW1lbnQuZW50cnkucHJpb3JpdHkgIT09IHByaW9yaXR5KXtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl91cGRhdGVIYXNoTG9ja2VkKXtcclxuICAgICAgICAgICAgICAgICAgICBsb2dJRCgxNTA2KTtcclxuICAgICAgICAgICAgICAgICAgICBoYXNoRWxlbWVudC5lbnRyeS5tYXJrZWRGb3JEZWxldGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc2hFbGVtZW50LmVudHJ5LnBhdXNlZCA9IHBhdXNlZDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAvLyB3aWxsIGJlIGFkZGVkIGFnYWluIG91dHNpZGUgaWYgKGhhc2hFbGVtZW50KS5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGVVcGRhdGUodGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBoYXNoRWxlbWVudC5lbnRyeS5tYXJrZWRGb3JEZWxldGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaGFzaEVsZW1lbnQuZW50cnkucGF1c2VkID0gcGF1c2VkO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBsaXN0RWxlbWVudCA9IExpc3RFbnRyeS5nZXQodGFyZ2V0LCBwcmlvcml0eSwgcGF1c2VkLCBmYWxzZSk7XHJcbiAgICAgICAgbGV0IHBwTGlzdDtcclxuXHJcbiAgICAgICAgLy8gbW9zdCBvZiB0aGUgdXBkYXRlcyBhcmUgZ29pbmcgdG8gYmUgMCwgdGhhdCdzIHdheSB0aGVyZVxyXG4gICAgICAgIC8vIGlzIGFuIHNwZWNpYWwgbGlzdCBmb3IgdXBkYXRlcyB3aXRoIHByaW9yaXR5IDBcclxuICAgICAgICBpZiAocHJpb3JpdHkgPT09IDApIHtcclxuICAgICAgICAgICAgcHBMaXN0ID0gdGhpcy5fdXBkYXRlczBMaXN0O1xyXG4gICAgICAgICAgICB0aGlzLl9hcHBlbmRJbihwcExpc3QsIGxpc3RFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHBwTGlzdCA9IHByaW9yaXR5IDwgMCA/IHRoaXMuX3VwZGF0ZXNOZWdMaXN0IDogdGhpcy5fdXBkYXRlc1Bvc0xpc3Q7XHJcbiAgICAgICAgICAgIHRoaXMuX3ByaW9yaXR5SW4ocHBMaXN0LCBsaXN0RWxlbWVudCwgcHJpb3JpdHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIGhhc2ggZW50cnkgZm9yIHF1aWNrIGFjY2Vzc1xyXG4gICAgICAgIHRoaXMuX2hhc2hGb3JVcGRhdGVzW3RhcmdldElkXSA9IEhhc2hVcGRhdGVFbnRyeS5nZXQocHBMaXN0LCBsaXN0RWxlbWVudCwgdGFyZ2V0LCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVW5zY2hlZHVsZXMgYSBjYWxsYmFjayBmb3IgYSBjYWxsYmFjayBhbmQgYSBnaXZlbiB0YXJnZXQuXHJcbiAgICAgKiBJZiB5b3Ugd2FudCB0byB1bnNjaGVkdWxlIHRoZSBcInVwZGF0ZVwiLCB1c2UgYHVuc2NoZWR1bGVVcGRhdGUoKWBcclxuICAgICAqIEB6aFxyXG4gICAgICog5Y+W5raI5oyH5a6a5a+56LGh5a6a5pe25Zmo44CCXHJcbiAgICAgKiDlpoLmnpzpnIDopoHlj5bmtoggdXBkYXRlIOWumuaXtuWZqO+8jOivt+S9v+eUqCB1bnNjaGVkdWxlVXBkYXRlKCnjgIJcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBiZSB1bnNjaGVkdWxlZFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBUaGUgdGFyZ2V0IGJvdW5kIHRvIHRoZSBjYWxsYmFjay5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHVuc2NoZWR1bGUgKGNhbGxiYWNrLCB0YXJnZXQ6SVNjaGVkdWxhYmxlKSB7XHJcbiAgICAgICAgLy8gY2FsbGJhY2ssIHRhcmdldFxyXG5cclxuICAgICAgICAvLyBleHBsaWNpdHkgaGFuZGxlIG5pbCBhcmd1bWVudHMgd2hlbiByZW1vdmluZyBhbiBvYmplY3RcclxuICAgICAgICBpZiAoIXRhcmdldCB8fCAhY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdGFyZ2V0SWQgPSB0YXJnZXQudXVpZCB8fCB0YXJnZXQuaWQ7XHJcbiAgICAgICAgaWYgKCF0YXJnZXRJZCkge1xyXG4gICAgICAgICAgICBlcnJvcklEKDE1MTApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gc2VsZi5faGFzaEZvclRpbWVyc1t0YXJnZXRJZF07XHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgdGltZXJzID0gZWxlbWVudC50aW1lcnM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsaSA9IHRpbWVycy5sZW5ndGg7IGkgPCBsaTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lciA9IHRpbWVyc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayA9PT0gdGltZXIuX2NhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh0aW1lciA9PT0gZWxlbWVudC5jdXJyZW50VGltZXIpICYmICghZWxlbWVudC5jdXJyZW50VGltZXJTYWx2YWdlZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jdXJyZW50VGltZXJTYWx2YWdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2FsbGJhY2tUaW1lci5wdXQodGltZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aW1lckluZGV4IGluIGNhc2Ugd2UgYXJlIGluIHRpY2s7LCBsb29waW5nIG92ZXIgdGhlIGFjdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50aW1lckluZGV4ID49IGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50aW1lckluZGV4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGltZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5fY3VycmVudFRhcmdldCA9PT0gZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fY3VycmVudFRhcmdldFNhbHZhZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3JlbW92ZUhhc2hFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBVbnNjaGVkdWxlcyB0aGUgdXBkYXRlIGNhbGxiYWNrIGZvciBhIGdpdmVuIHRhcmdldC5cclxuICAgICAqIEB6aCDlj5bmtojmjIflrprlr7nosaHnmoQgdXBkYXRlIOWumuaXtuWZqOOAglxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBUaGUgdGFyZ2V0IHRvIGJlIHVuc2NoZWR1bGVkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdW5zY2hlZHVsZVVwZGF0ZSAodGFyZ2V0OklTY2hlZHVsYWJsZSkge1xyXG4gICAgICAgIGlmICghdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHRhcmdldElkID0gdGFyZ2V0LnV1aWQgfHwgdGFyZ2V0LmlkO1xyXG4gICAgICAgIGlmICghdGFyZ2V0SWQpIHtcclxuICAgICAgICAgICAgZXJyb3JJRCgxNTEwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2hhc2hGb3JVcGRhdGVzW3RhcmdldElkXTtcclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdXBkYXRlSGFzaExvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbnRyeS5tYXJrZWRGb3JEZWxldGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVVcGRhdGVGcm9tSGFzaChlbGVtZW50LmVudHJ5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVW5zY2hlZHVsZXMgYWxsIHNjaGVkdWxlZCBjYWxsYmFja3MgZm9yIGEgZ2l2ZW4gdGFyZ2V0LlxyXG4gICAgICogVGhpcyBhbHNvIGluY2x1ZGVzIHRoZSBcInVwZGF0ZVwiIGNhbGxiYWNrLlxyXG4gICAgICogQHpoIOWPlua2iOaMh+WumuWvueixoeeahOaJgOacieWumuaXtuWZqO+8jOWMheaLrCB1cGRhdGUg5a6a5pe25Zmo44CCXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IFRoZSB0YXJnZXQgdG8gYmUgdW5zY2hlZHVsZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1bnNjaGVkdWxlQWxsRm9yVGFyZ2V0ICh0YXJnZXQpIHtcclxuICAgICAgICAvLyBleHBsaWNpdCBudWxscHRyIGhhbmRsaW5nXHJcbiAgICAgICAgaWYgKCF0YXJnZXQpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB0YXJnZXRJZCA9IHRhcmdldC51dWlkIHx8IHRhcmdldC5pZDtcclxuICAgICAgICBpZiAoIXRhcmdldElkKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMTUxMCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEN1c3RvbSBTZWxlY3RvcnNcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5faGFzaEZvclRpbWVyc1t0YXJnZXRJZF07XHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgdGltZXJzID0gZWxlbWVudC50aW1lcnM7XHJcbiAgICAgICAgICAgIGlmICh0aW1lcnMuaW5kZXhPZihlbGVtZW50LmN1cnJlbnRUaW1lcikgPiAtMSAmJlxyXG4gICAgICAgICAgICAgICAgKCFlbGVtZW50LmN1cnJlbnRUaW1lclNhbHZhZ2VkKSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5jdXJyZW50VGltZXJTYWx2YWdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aW1lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBDYWxsYmFja1RpbWVyLnB1dCh0aW1lcnNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRpbWVycy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUYXJnZXQgPT09IGVsZW1lbnQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFRhcmdldFNhbHZhZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVIYXNoRWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHNlbGVjdG9yXHJcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlVXBkYXRlKHRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFVuc2NoZWR1bGVzIGFsbCBzY2hlZHVsZWQgY2FsbGJhY2tzIGZyb20gYWxsIHRhcmdldHMgaW5jbHVkaW5nIHRoZSBzeXN0ZW0gY2FsbGJhY2tzLjxici8+XHJcbiAgICAgKiBZb3Ugc2hvdWxkIE5FVkVSIGNhbGwgdGhpcyBtZXRob2QsIHVubGVzcyB5b3Uga25vdyB3aGF0IHlvdSBhcmUgZG9pbmcuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWPlua2iOaJgOacieWvueixoeeahOaJgOacieWumuaXtuWZqO+8jOWMheaLrOezu+e7n+WumuaXtuWZqOOAgjxici8+XHJcbiAgICAgKiDkuI3opoHosIPnlKjmraTlh73mlbDvvIzpmaTpnZ7kvaDnoa7lrprkvaDlnKjlgZrku4DkuYjjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHVuc2NoZWR1bGVBbGwgKCl7XHJcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlQWxsV2l0aE1pblByaW9yaXR5KGxlZ2FjeUNDLlNjaGVkdWxlci5QUklPUklUWV9TWVNURU0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBVbnNjaGVkdWxlcyBhbGwgY2FsbGJhY2tzIGZyb20gYWxsIHRhcmdldHMgd2l0aCBhIG1pbmltdW0gcHJpb3JpdHkuPGJyLz5cclxuICAgICAqIFlvdSBzaG91bGQgb25seSBjYWxsIHRoaXMgd2l0aCBgUFJJT1JJVFlfTk9OX1NZU1RFTV9NSU5gIG9yIGhpZ2hlci5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Y+W5raI5omA5pyJ5LyY5YWI57qn55qE5YC85aSn5LqO5oyH5a6a5LyY5YWI57qn55qE5a6a5pe25Zmo44CCPGJyLz5cclxuICAgICAqIOS9oOW6lOivpeWPquWPlua2iOS8mOWFiOe6p+eahOWAvOWkp+S6jiBQUklPUklUWV9OT05fU1lTVEVNX01JTiDnmoTlrprml7blmajjgIJcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtaW5Qcmlvcml0eSBUaGUgbWluaW11bSBwcmlvcml0eSBvZiBzZWxlY3RvciB0byBiZSB1bnNjaGVkdWxlZC4gV2hpY2ggbWVhbnMsIGFsbCBzZWxlY3RvcnMgd2hpY2hcclxuICAgICAqICAgICAgICBwcmlvcml0eSBpcyBoaWdoZXIgdGhhbiBtaW5Qcmlvcml0eSB3aWxsIGJlIHVuc2NoZWR1bGVkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdW5zY2hlZHVsZUFsbFdpdGhNaW5Qcmlvcml0eSAobWluUHJpb3JpdHk6IG51bWJlcil7XHJcbiAgICAgICAgLy8gQ3VzdG9tIFNlbGVjdG9yc1xyXG4gICAgICAgIGxldCBpO1xyXG4gICAgICAgIGxldCBlbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGFyciA9IHRoaXMuX2FycmF5Rm9yVGltZXJzO1xyXG4gICAgICAgIGZvciAoIGkgPSBhcnIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGFycltpXTtcclxuICAgICAgICAgICAgdGhpcy51bnNjaGVkdWxlQWxsRm9yVGFyZ2V0KGVsZW1lbnQudGFyZ2V0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZXMgc2VsZWN0b3JzXHJcbiAgICAgICAgbGV0IGVudHJ5O1xyXG4gICAgICAgIGxldCB0ZW1wX2xlbmd0aCA9IDA7XHJcbiAgICAgICAgaWYgKG1pblByaW9yaXR5IDwgMCl7XHJcbiAgICAgICAgICAgIGZvciAoIGkgPSAwOyBpIDwgdGhpcy5fdXBkYXRlc05lZ0xpc3QubGVuZ3RoOyApIHtcclxuICAgICAgICAgICAgICAgIHRlbXBfbGVuZ3RoID0gdGhpcy5fdXBkYXRlc05lZ0xpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZW50cnkgPSB0aGlzLl91cGRhdGVzTmVnTGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChlbnRyeSAmJiBlbnRyeS5wcmlvcml0eSA+PSBtaW5Qcmlvcml0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5zY2hlZHVsZVVwZGF0ZShlbnRyeS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRlbXBfbGVuZ3RoID09PSB0aGlzLl91cGRhdGVzTmVnTGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtaW5Qcmlvcml0eSA8PSAwICkge1xyXG4gICAgICAgICAgICBmb3IgKCBpID0gMDsgaSA8IHRoaXMuX3VwZGF0ZXMwTGlzdC5sZW5ndGg7ICkge1xyXG4gICAgICAgICAgICAgICAgdGVtcF9sZW5ndGggPSB0aGlzLl91cGRhdGVzMExpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZW50cnkgPSB0aGlzLl91cGRhdGVzMExpc3RbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZW50cnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGVVcGRhdGUoZW50cnkudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0ZW1wX2xlbmd0aCA9PT0gdGhpcy5fdXBkYXRlczBMaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICggaSA9IDA7IGkgPCB0aGlzLl91cGRhdGVzUG9zTGlzdC5sZW5ndGg7ICkge1xyXG4gICAgICAgICAgICB0ZW1wX2xlbmd0aCA9IHRoaXMuX3VwZGF0ZXNQb3NMaXN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgZW50cnkgPSB0aGlzLl91cGRhdGVzUG9zTGlzdFtpXTtcclxuICAgICAgICAgICAgaWYgKCBlbnRyeSAmJiBlbnRyeS5wcmlvcml0eSA+PSBtaW5Qcmlvcml0eSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudW5zY2hlZHVsZVVwZGF0ZShlbnRyeS50YXJnZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0ZW1wX2xlbmd0aCA9PT0gdGhpcy5fdXBkYXRlc1Bvc0xpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ2hlY2tzIHdoZXRoZXIgYSBjYWxsYmFjayBmb3IgYSBnaXZlbiB0YXJnZXQgaXMgc2NoZWR1bGVkLlxyXG4gICAgICogQHpoIOajgOafpeaMh+WumueahOWbnuiwg+WHveaVsOWSjOWbnuiwg+Wvueixoee7hOWQiOaYr+WQpuWtmOWcqOWumuaXtuWZqOOAglxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGNoZWNrLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBUaGUgdGFyZ2V0IG9mIHRoZSBjYWxsYmFjay5cclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBjYWxsYmFjayBpcyBpbnZva2VkLCBmYWxzZSBpZiBub3QuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc1NjaGVkdWxlZCAoY2FsbGJhY2ssIHRhcmdldDpJU2NoZWR1bGFibGUpe1xyXG4gICAgICAgIC8vIGtleSwgdGFyZ2V0XHJcbiAgICAgICAgLy8gc2VsZWN0b3IsIHRhcmdldFxyXG4gICAgICAgIGFzc2VydElEKGNhbGxiYWNrLCAxNTA4KTtcclxuICAgICAgICBhc3NlcnRJRCh0YXJnZXQsIDE1MDkpO1xyXG4gICAgICAgIGxldCB0YXJnZXRJZCA9IHRhcmdldC51dWlkIHx8IHRhcmdldC5pZDtcclxuICAgICAgICBpZiAoIXRhcmdldElkKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMTUxMCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9oYXNoRm9yVGltZXJzW3RhcmdldElkXTtcclxuXHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50LnRpbWVycyA9PSBudWxsKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdGltZXJzID0gZWxlbWVudC50aW1lcnM7XHJcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogcHJlZmVyLWZvci1vZlxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbWVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGltZXIgPSAgdGltZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrID09PSB0aW1lci5fY2FsbGJhY2spe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFBhdXNlIGFsbCBzZWxlY3RvcnMgZnJvbSBhbGwgdGFyZ2V0cy48YnIvPlxyXG4gICAgICogWW91IHNob3VsZCBORVZFUiBjYWxsIHRoaXMgbWV0aG9kLCB1bmxlc3MgeW91IGtub3cgd2hhdCB5b3UgYXJlIGRvaW5nLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmoLlgZzmiYDmnInlr7nosaHnmoTmiYDmnInlrprml7blmajjgII8YnIvPlxyXG4gICAgICog5LiN6KaB6LCD55So6L+Z5Liq5pa55rOV77yM6Zmk6Z2e5L2g55+l6YGT5L2g5q2j5Zyo5YGa5LuA5LmI44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwYXVzZUFsbFRhcmdldHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhdXNlQWxsVGFyZ2V0c1dpdGhNaW5Qcmlvcml0eShsZWdhY3lDQy5TY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUGF1c2UgYWxsIHNlbGVjdG9ycyBmcm9tIGFsbCB0YXJnZXRzIHdpdGggYSBtaW5pbXVtIHByaW9yaXR5LiA8YnIvPlxyXG4gICAgICogWW91IHNob3VsZCBvbmx5IGNhbGwgdGhpcyB3aXRoIGtDQ1ByaW9yaXR5Tm9uU3lzdGVtTWluIG9yIGhpZ2hlci5cclxuICAgICAqIEB6aFxyXG4gICAgICog5pqC5YGc5omA5pyJ5LyY5YWI57qn55qE5YC85aSn5LqO5oyH5a6a5LyY5YWI57qn55qE5a6a5pe25Zmo44CCPGJyLz5cclxuICAgICAqIOS9oOW6lOivpeWPquaaguWBnOS8mOWFiOe6p+eahOWAvOWkp+S6jiBQUklPUklUWV9OT05fU1lTVEVNX01JTiDnmoTlrprml7blmajjgIJcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtaW5Qcmlvcml0eVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGF1c2VBbGxUYXJnZXRzV2l0aE1pblByaW9yaXR5IChtaW5Qcmlvcml0eTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgaWRzV2l0aFNlbGVjdG9yczogYW55ID0gW107XHJcblxyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGxldCBlbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGxvY0FycmF5Rm9yVGltZXJzID0gc2VsZi5fYXJyYXlGb3JUaW1lcnM7XHJcbiAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgbGV0IGxpO1xyXG4gICAgICAgIC8vIEN1c3RvbSBTZWxlY3RvcnNcclxuICAgICAgICBmb3IgKGkgPSAwLCBsaSA9IGxvY0FycmF5Rm9yVGltZXJzLmxlbmd0aDsgaSA8IGxpOyBpKyspIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGxvY0FycmF5Rm9yVGltZXJzW2ldO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWRzV2l0aFNlbGVjdG9ycy5wdXNoKGVsZW1lbnQudGFyZ2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVudHJ5O1xyXG4gICAgICAgIGlmIChtaW5Qcmlvcml0eSA8IDApIHtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuX3VwZGF0ZXNOZWdMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeSA9IHRoaXMuX3VwZGF0ZXNOZWdMaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5LnByaW9yaXR5ID49IG1pblByaW9yaXR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5LnBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkc1dpdGhTZWxlY3RvcnMucHVzaChlbnRyeS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1pblByaW9yaXR5IDw9IDApIHtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuX3VwZGF0ZXMwTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZW50cnkgPSB0aGlzLl91cGRhdGVzMExpc3RbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZW50cnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRyeS5wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkc1dpdGhTZWxlY3RvcnMucHVzaChlbnRyeS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fdXBkYXRlc1Bvc0xpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZW50cnkgPSB0aGlzLl91cGRhdGVzUG9zTGlzdFtpXTtcclxuICAgICAgICAgICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZW50cnkucHJpb3JpdHkgPj0gbWluUHJpb3JpdHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRyeS5wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkc1dpdGhTZWxlY3RvcnMucHVzaChlbnRyeS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaWRzV2l0aFNlbGVjdG9ycztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVzdW1lIHNlbGVjdG9ycyBvbiBhIHNldCBvZiB0YXJnZXRzLjxici8+XHJcbiAgICAgKiBUaGlzIGNhbiBiZSB1c2VmdWwgZm9yIHVuZG9pbmcgYSBjYWxsIHRvIHBhdXNlQWxsQ2FsbGJhY2tzLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmgaLlpI3mjIflrprmlbDnu4TkuK3miYDmnInlr7nosaHnmoTlrprml7blmajjgII8YnIvPlxyXG4gICAgICog6L+Z5Liq5Ye95pWw5pivIHBhdXNlQWxsQ2FsbGJhY2tzIOeahOmAhuaTjeS9nOOAglxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gdGFyZ2V0c1RvUmVzdW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXN1bWVUYXJnZXRzICh0YXJnZXRzVG9SZXN1bWUpIHtcclxuICAgICAgICBpZiAoIXRhcmdldHNUb1Jlc3VtZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogcHJlZmVyLWZvci1vZlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFyZ2V0c1RvUmVzdW1lLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdW1lVGFyZ2V0KHRhcmdldHNUb1Jlc3VtZVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBQYXVzZXMgdGhlIHRhcmdldC48YnIvPlxyXG4gICAgICogQWxsIHNjaGVkdWxlZCBzZWxlY3RvcnMvdXBkYXRlIGZvciBhIGdpdmVuIHRhcmdldCB3b24ndCBiZSAndGlja2VkJyB1bnRpbCB0aGUgdGFyZ2V0IGlzIHJlc3VtZWQuPGJyLz5cclxuICAgICAqIElmIHRoZSB0YXJnZXQgaXMgbm90IHByZXNlbnQsIG5vdGhpbmcgaGFwcGVucy5cclxuICAgICAqIEB6aFxyXG4gICAgICog5pqC5YGc5oyH5a6a5a+56LGh55qE5a6a5pe25Zmo44CCPGJyLz5cclxuICAgICAqIOaMh+WumuWvueixoeeahOaJgOacieWumuaXtuWZqOmDveS8muiiq+aaguWBnOOAgjxici8+XHJcbiAgICAgKiDlpoLmnpzmjIflrprnmoTlr7nosaHmsqHmnInlrprml7blmajvvIzku4DkuYjkuZ/kuI3kvJrlj5HnlJ/jgIJcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBhdXNlVGFyZ2V0ICh0YXJnZXQ6SVNjaGVkdWxhYmxlKSB7XHJcbiAgICAgICAgYXNzZXJ0SUQodGFyZ2V0LCAxNTAzKTtcclxuICAgICAgICBsZXQgdGFyZ2V0SWQgPSB0YXJnZXQudXVpZCB8fCB0YXJnZXQuaWQ7XHJcbiAgICAgICAgaWYgKCF0YXJnZXRJZCkge1xyXG4gICAgICAgICAgICBlcnJvcklEKDE1MTApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjdXN0b21lciBzZWxlY3RvcnNcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gc2VsZi5faGFzaEZvclRpbWVyc1t0YXJnZXRJZF07XHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAgICAgY29uc3QgZWxlbWVudFVwZGF0ZSA9IHNlbGYuX2hhc2hGb3JVcGRhdGVzW3RhcmdldElkXTtcclxuICAgICAgICBpZiAoZWxlbWVudFVwZGF0ZSkge1xyXG4gICAgICAgICAgICBlbGVtZW50VXBkYXRlLmVudHJ5LnBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZXN1bWVzIHRoZSB0YXJnZXQuPGJyLz5cclxuICAgICAqIFRoZSAndGFyZ2V0JyB3aWxsIGJlIHVucGF1c2VkLCBzbyBhbGwgc2NoZWR1bGUgc2VsZWN0b3JzL3VwZGF0ZSB3aWxsIGJlICd0aWNrZWQnIGFnYWluLjxici8+XHJcbiAgICAgKiBJZiB0aGUgdGFyZ2V0IGlzIG5vdCBwcmVzZW50LCBub3RoaW5nIGhhcHBlbnMuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaBouWkjeaMh+WumuWvueixoeeahOaJgOacieWumuaXtuWZqOOAgjxici8+XHJcbiAgICAgKiDmjIflrprlr7nosaHnmoTmiYDmnInlrprml7blmajlsIbnu6fnu63lt6XkvZzjgII8YnIvPlxyXG4gICAgICog5aaC5p6c5oyH5a6a55qE5a+56LGh5rKh5pyJ5a6a5pe25Zmo77yM5LuA5LmI5Lmf5LiN5Lya5Y+R55Sf44CCXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXN1bWVUYXJnZXQgKHRhcmdldDpJU2NoZWR1bGFibGUpIHtcclxuICAgICAgICBhc3NlcnRJRCh0YXJnZXQsIDE1MDQpO1xyXG4gICAgICAgIGxldCB0YXJnZXRJZCA9IHRhcmdldC51dWlkIHx8IHRhcmdldC5pZDtcclxuICAgICAgICBpZiAoIXRhcmdldElkKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMTUxMCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGN1c3RvbSBzZWxlY3RvcnNcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gc2VsZi5faGFzaEZvclRpbWVyc1t0YXJnZXRJZF07XHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRVcGRhdGUgPSBzZWxmLl9oYXNoRm9yVXBkYXRlc1t0YXJnZXRJZF07XHJcbiAgICAgICAgaWYgKGVsZW1lbnRVcGRhdGUpIHtcclxuICAgICAgICAgICAgZWxlbWVudFVwZGF0ZS5lbnRyeS5wYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgdGFyZ2V0IGlzIHBhdXNlZC5cclxuICAgICAqIEB6aCDov5Tlm57mjIflrprlr7nosaHnmoTlrprml7blmajmmK/lkKblpITkuo7mmoLlgZznirbmgIHjgIJcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc1RhcmdldFBhdXNlZCAodGFyZ2V0OklTY2hlZHVsYWJsZSkge1xyXG4gICAgICAgIGFzc2VydElEKHRhcmdldCwgMTUwNSk7XHJcbiAgICAgICAgbGV0IHRhcmdldElkID0gdGFyZ2V0LnV1aWQgfHwgdGFyZ2V0LmlkO1xyXG4gICAgICAgIGlmICghdGFyZ2V0SWQpIHtcclxuICAgICAgICAgICAgZXJyb3JJRCgxNTEwKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3VzdG9tIHNlbGVjdG9yc1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9oYXNoRm9yVGltZXJzW3RhcmdldElkXTtcclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5wYXVzZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRVcGRhdGUgPSB0aGlzLl9oYXNoRm9yVXBkYXRlc1t0YXJnZXRJZF07XHJcbiAgICAgICAgaWYgKGVsZW1lbnRVcGRhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRVcGRhdGUuZW50cnkucGF1c2VkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1wcml2YXRlIG1ldGhvZC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHByaXZhdGUgX3JlbW92ZUhhc2hFbGVtZW50IChlbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IHRhcmdldElkID0gZWxlbWVudC50YXJnZXQudXVpZCB8fCBlbGVtZW50LnRhcmdldC5pZDtcclxuICAgICAgICBkZWxldGUgdGhpcy5faGFzaEZvclRpbWVyc1t0YXJnZXRJZF07XHJcbiAgICAgICAgY29uc3QgYXJyID0gdGhpcy5fYXJyYXlGb3JUaW1lcnM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChhcnJbaV0gPT09IGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBIYXNoVGltZXJFbnRyeS5wdXQoZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVtb3ZlVXBkYXRlRnJvbUhhc2ggKGVudHJ5KSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0SWQgPSBlbnRyeS50YXJnZXQudXVpZCB8fCBlbnRyeS50YXJnZXQuaWQ7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHNlbGYuX2hhc2hGb3JVcGRhdGVzW3RhcmdldElkXTtcclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAvLyBSZW1vdmUgbGlzdCBlbnRyeSBmcm9tIGxpc3RcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGVsZW1lbnQubGlzdDtcclxuICAgICAgICAgICAgY29uc3QgbGlzdEVudHJ5ID0gZWxlbWVudC5lbnRyeTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RFbnRyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3Quc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkZWxldGUgc2VsZi5faGFzaEZvclVwZGF0ZXNbdGFyZ2V0SWRdO1xyXG4gICAgICAgICAgICBMaXN0RW50cnkucHV0KGxpc3RFbnRyeSk7XHJcbiAgICAgICAgICAgIEhhc2hVcGRhdGVFbnRyeS5wdXQoZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3ByaW9yaXR5SW4gKHBwTGlzdCwgbGlzdEVsZW1lbnQsIHByaW9yaXR5KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcExpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBpZiAocHJpb3JpdHkgPCBwcExpc3RbaV0ucHJpb3JpdHkpIHtcclxuICAgICAgICAgICAgICAgIHBwTGlzdC5zcGxpY2UoaSwgMCwgbGlzdEVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBwTGlzdC5wdXNoKGxpc3RFbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hcHBlbmRJbiAocHBMaXN0LCBsaXN0RWxlbWVudCkge1xyXG4gICAgICAgIHBwTGlzdC5wdXNoKGxpc3RFbGVtZW50KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmxlZ2FjeUNDLlNjaGVkdWxlciA9IFNjaGVkdWxlcjtcclxuIl19