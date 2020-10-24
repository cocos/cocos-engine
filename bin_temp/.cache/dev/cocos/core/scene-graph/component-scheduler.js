(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/object.js", "../utils/array.js", "../utils/js.js", "../utils/misc.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/object.js"), require("../utils/array.js"), require("../utils/js.js"), require("../utils/misc.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.object, global.array, global.js, global.misc, global.defaultConstants, global.globalExports, global.debug);
    global.componentScheduler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _object, _array2, _js, _misc, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.createInvokeImplJit = createInvokeImplJit;
  _exports.createInvokeImpl = createInvokeImpl;
  _exports.ComponentScheduler = _exports.invokeOnEnable = _exports.OneOffInvoker = _exports.LifeCycleInvoker = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var fastRemoveAt = _js.array.fastRemoveAt; // @ts-ignore

  var IsStartCalled = _object.CCObject.Flags.IsStartCalled; // @ts-ignore

  var IsOnEnableCalled = _object.CCObject.Flags.IsOnEnableCalled; // @ts-ignore

  var IsEditorOnEnableCalled = _object.CCObject.Flags.IsEditorOnEnableCalled;
  var callerFunctor = _defaultConstants.EDITOR && _misc.tryCatchFunctor_EDITOR;
  var callOnEnableInTryCatch = _defaultConstants.EDITOR && callerFunctor('onEnable');
  var callOnDisableInTryCatch = _defaultConstants.EDITOR && callerFunctor('onDisable');

  function sortedIndex(array, comp) {
    var order = comp.constructor._executionOrder;
    var id = comp._id;
    var l = 0;

    for (var h = array.length - 1, m = h >>> 1; l <= h; m = l + h >>> 1) {
      var test = array[m];
      var testOrder = test.constructor._executionOrder;

      if (testOrder > order) {
        h = m - 1;
      } else if (testOrder < order) {
        l = m + 1;
      } else {
        var testId = test._id;

        if (testId > id) {
          h = m - 1;
        } else if (testId < id) {
          l = m + 1;
        } else {
          return m;
        }
      }
    }

    return ~l;
  } // remove disabled and not invoked component from array


  function stableRemoveInactive(iterator, flagToClear) {
    var array = iterator.array;
    var next = iterator.i + 1;

    while (next < array.length) {
      var comp = array[next];

      if (comp._enabled && comp.node._activeInHierarchy) {
        ++next;
      } else {
        iterator.removeAt(next);

        if (flagToClear) {
          comp._objFlags &= ~flagToClear;
        }
      }
    }
  } // This class contains some queues used to invoke life-cycle methods by script execution order


  var LifeCycleInvoker = function LifeCycleInvoker(invokeFunc) {
    _classCallCheck(this, LifeCycleInvoker);

    this._zero = void 0;
    this._neg = void 0;
    this._pos = void 0;
    this._invoke = void 0;
    var Iterator = _array2.MutableForwardIterator; // components which priority === 0 (default)

    this._zero = new Iterator([]); // components which priority < 0

    this._neg = new Iterator([]); // components which priority > 0

    this._pos = new Iterator([]);

    if (_defaultConstants.TEST) {
      (0, _debug.assert)(typeof invokeFunc === 'function', 'invokeFunc must be type function');
    }

    this._invoke = invokeFunc;
  };

  _exports.LifeCycleInvoker = LifeCycleInvoker;
  LifeCycleInvoker.stableRemoveInactive = stableRemoveInactive;

  function compareOrder(a, b) {
    return a.constructor._executionOrder - b.constructor._executionOrder;
  } // for onLoad: sort once all components registered, invoke once


  var OneOffInvoker = /*#__PURE__*/function (_LifeCycleInvoker) {
    _inherits(OneOffInvoker, _LifeCycleInvoker);

    function OneOffInvoker() {
      _classCallCheck(this, OneOffInvoker);

      return _possibleConstructorReturn(this, _getPrototypeOf(OneOffInvoker).apply(this, arguments));
    }

    _createClass(OneOffInvoker, [{
      key: "add",
      value: function add(comp) {
        var order = comp.constructor._executionOrder;
        (order === 0 ? this._zero : order < 0 ? this._neg : this._pos).array.push(comp);
      }
    }, {
      key: "remove",
      value: function remove(comp) {
        var order = comp.constructor._executionOrder;
        (order === 0 ? this._zero : order < 0 ? this._neg : this._pos).fastRemove(comp);
      }
    }, {
      key: "cancelInactive",
      value: function cancelInactive(flagToClear) {
        stableRemoveInactive(this._zero, flagToClear);
        stableRemoveInactive(this._neg, flagToClear);
        stableRemoveInactive(this._pos, flagToClear);
      }
    }, {
      key: "invoke",
      value: function invoke() {
        var compsNeg = this._neg;

        if (compsNeg.array.length > 0) {
          compsNeg.array.sort(compareOrder);

          this._invoke(compsNeg);

          compsNeg.array.length = 0;
        }

        this._invoke(this._zero);

        this._zero.array.length = 0;
        var compsPos = this._pos;

        if (compsPos.array.length > 0) {
          compsPos.array.sort(compareOrder);

          this._invoke(compsPos);

          compsPos.array.length = 0;
        }
      }
    }]);

    return OneOffInvoker;
  }(LifeCycleInvoker); // for update: sort every time new component registered, invoke many times


  _exports.OneOffInvoker = OneOffInvoker;

  var ReusableInvoker = /*#__PURE__*/function (_LifeCycleInvoker2) {
    _inherits(ReusableInvoker, _LifeCycleInvoker2);

    function ReusableInvoker() {
      _classCallCheck(this, ReusableInvoker);

      return _possibleConstructorReturn(this, _getPrototypeOf(ReusableInvoker).apply(this, arguments));
    }

    _createClass(ReusableInvoker, [{
      key: "add",
      value: function add(comp) {
        var order = comp.constructor._executionOrder;

        if (order === 0) {
          this._zero.array.push(comp);
        } else {
          var _array = order < 0 ? this._neg.array : this._pos.array;

          var i = sortedIndex(_array, comp);

          if (i < 0) {
            _array.splice(~i, 0, comp);
          } else if (_defaultConstants.DEV) {
            (0, _debug.error)('component already added');
          }
        }
      }
    }, {
      key: "remove",
      value: function remove(comp) {
        var order = comp.constructor._executionOrder;

        if (order === 0) {
          this._zero.fastRemove(comp);
        } else {
          var iterator = order < 0 ? this._neg : this._pos;
          var i = sortedIndex(iterator.array, comp);

          if (i >= 0) {
            iterator.removeAt(i);
          }
        }
      }
    }, {
      key: "invoke",
      value: function invoke(dt) {
        if (this._neg.array.length > 0) {
          this._invoke(this._neg, dt);
        }

        this._invoke(this._zero, dt);

        if (this._pos.array.length > 0) {
          this._invoke(this._pos, dt);
        }
      }
    }]);

    return ReusableInvoker;
  }(LifeCycleInvoker);

  function enableInEditor(comp) {
    if (!(comp._objFlags & IsEditorOnEnableCalled)) {
      _globalExports.legacyCC.engine.emit('component-enabled', comp.uuid);

      if (!_globalExports.legacyCC.GAME_VIEW) {
        comp._objFlags |= IsEditorOnEnableCalled;
      }
    }
  } // return function to simply call each component with try catch protection


  function createInvokeImplJit(code, useDt, ensureFlag) {
    // function (it) {
    //     let a = it.array;
    //     for (it.i = 0; it.i < a.length; ++it.i) {
    //         let c = a[it.i];
    //         // ...
    //     }
    // }
    var body = 'var a=it.array;' + 'for(it.i=0;it.i<a.length;++it.i){' + 'var c=a[it.i];' + code + '}';
    var fastPath = useDt ? Function('it', 'dt', body) : Function('it', body);
    var singleInvoke = Function('c', 'dt', code);
    return createInvokeImpl(singleInvoke, fastPath, ensureFlag);
  }

  function createInvokeImpl(singleInvoke, fastPath, ensureFlag) {
    return function (iterator, dt) {
      try {
        fastPath(iterator, dt);
      } catch (e) {
        // slow path
        _globalExports.legacyCC._throw(e);

        var array = iterator.array;

        if (ensureFlag) {
          array[iterator.i]._objFlags |= ensureFlag;
        }

        ++iterator.i; // invoke next callback

        for (; iterator.i < array.length; ++iterator.i) {
          try {
            singleInvoke(array[iterator.i], dt);
          } catch (e) {
            _globalExports.legacyCC._throw(e);

            if (ensureFlag) {
              array[iterator.i]._objFlags |= ensureFlag;
            }
          }
        }
      }
    };
  }

  var invokeStart = _defaultConstants.SUPPORT_JIT ? createInvokeImplJit('c.start();c._objFlags|=' + IsStartCalled, false, IsStartCalled) : createInvokeImpl(function (c) {
    c.start();
    c._objFlags |= IsStartCalled;
  }, function (iterator) {
    var array = iterator.array;

    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
      var comp = array[iterator.i];
      comp.start();
      comp._objFlags |= IsStartCalled;
    }
  }, IsStartCalled);
  var invokeUpdate = _defaultConstants.SUPPORT_JIT ? createInvokeImplJit('c.update(dt)', true) : createInvokeImpl(function (c, dt) {
    c.update(dt);
  }, function (iterator, dt) {
    var array = iterator.array;

    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
      array[iterator.i].update(dt);
    }
  });
  var invokeLateUpdate = _defaultConstants.SUPPORT_JIT ? createInvokeImplJit('c.lateUpdate(dt)', true) : createInvokeImpl(function (c, dt) {
    c.lateUpdate(dt);
  }, function (iterator, dt) {
    var array = iterator.array;

    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
      array[iterator.i].lateUpdate(dt);
    }
  });
  var invokeOnEnable = _defaultConstants.EDITOR ? function (iterator) {
    var compScheduler = _globalExports.legacyCC.director._compScheduler;
    var array = iterator.array;

    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
      var comp = array[iterator.i];

      if (comp._enabled) {
        callOnEnableInTryCatch(comp);
        var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

        if (!deactivatedDuringOnEnable) {
          compScheduler._onEnabled(comp);
        }
      }
    }
  } : function (iterator) {
    var compScheduler = _globalExports.legacyCC.director._compScheduler;
    var array = iterator.array;

    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
      var comp = array[iterator.i];

      if (comp._enabled) {
        comp.onEnable();
        var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

        if (!deactivatedDuringOnEnable) {
          compScheduler._onEnabled(comp);
        }
      }
    }
  };
  /**
   * @en The Manager for Component's life-cycle methods.
   * It collaborates with [[NodeActivator]] to schedule and invoke life cycle methods for components
   * @zh 组件生命周期函数的调度器。
   * 它和 [[NodeActivator]] 一起调度并执行组件的生命周期函数。
   */

  _exports.invokeOnEnable = invokeOnEnable;

  var ComponentScheduler = /*#__PURE__*/function () {
    /**
     * @en The invoker of `start` callback
     * @zh `start` 回调的调度器
     */

    /**
     * @en The invoker of `update` callback
     * @zh `update` 回调的调度器
     */

    /**
     * @en The invoker of `lateUpdate` callback
     * @zh `lateUpdate` 回调的调度器
     */
    // components deferred to schedule
    function ComponentScheduler() {
      _classCallCheck(this, ComponentScheduler);

      this._deferredComps = [];
      this.unscheduleAll();
    }
    /**
     * @en Cancel all future callbacks, including `start`, `update` and `lateUpdate`
     * @zh 取消所有未来的函数调度，包括 `start`，`update` 和 `lateUpdate`
     */


    _createClass(ComponentScheduler, [{
      key: "unscheduleAll",
      value: function unscheduleAll() {
        // invokers
        this.startInvoker = new OneOffInvoker(invokeStart);
        this.updateInvoker = new ReusableInvoker(invokeUpdate);
        this.lateUpdateInvoker = new ReusableInvoker(invokeLateUpdate); // during a loop

        this._updating = false;
      }
    }, {
      key: "_onEnabled",
      value: function _onEnabled(comp) {
        _globalExports.legacyCC.director.getScheduler().resumeTarget(comp);

        comp._objFlags |= IsOnEnableCalled; // schedule

        if (this._updating) {
          this._deferredComps.push(comp);
        } else {
          this._scheduleImmediate(comp);
        }
      }
    }, {
      key: "_onDisabled",
      value: function _onDisabled(comp) {
        _globalExports.legacyCC.director.getScheduler().pauseTarget(comp);

        comp._objFlags &= ~IsOnEnableCalled; // cancel schedule task

        var index = this._deferredComps.indexOf(comp);

        if (index >= 0) {
          fastRemoveAt(this._deferredComps, index);
          return;
        } // unschedule


        if (comp.start && !(comp._objFlags & IsStartCalled)) {
          this.startInvoker.remove(comp);
        }

        if (comp.update) {
          this.updateInvoker.remove(comp);
        }

        if (comp.lateUpdate) {
          this.lateUpdateInvoker.remove(comp);
        }
      }
      /**
       * @en Enable a component
       * @zh 启用一个组件
       * @param comp The component to be enabled
       * @param invoker The invoker which is responsible to schedule the `onEnable` call
       */

    }, {
      key: "enableComp",
      value: function enableComp(comp, invoker) {
        if (!(comp._objFlags & IsOnEnableCalled)) {
          if (comp.onEnable) {
            if (invoker) {
              invoker.add(comp);
              return;
            } else {
              comp.onEnable();
              var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

              if (deactivatedDuringOnEnable) {
                return;
              }
            }
          }

          this._onEnabled(comp);
        }
      }
      /**
       * @en Disable a component
       * @zh 禁用一个组件
       * @param comp The component to be disabled
       */

    }, {
      key: "disableComp",
      value: function disableComp(comp) {
        if (comp._objFlags & IsOnEnableCalled) {
          if (comp.onDisable) {
            comp.onDisable();
          }

          this._onDisabled(comp);
        }
      }
      /**
       * @en Process start phase for registered components
       * @zh 为当前注册的组件执行 start 阶段任务
       */

    }, {
      key: "startPhase",
      value: function startPhase() {
        // Start of this frame
        this._updating = true; // call start

        this.startInvoker.invoke(); // Start components of new activated nodes during start

        this._startForNewComps(); // if (PREVIEW) {
        //     try {
        //         this.startInvoker.invoke();
        //     }
        //     catch (e) {
        //         // prevent start from getting into infinite loop
        //         this.startInvoker._neg.array.length = 0;
        //         this.startInvoker._zero.array.length = 0;
        //         this.startInvoker._pos.array.length = 0;
        //         throw e;
        //     }
        // }
        // else {
        //     this.startInvoker.invoke();
        // }

      }
      /**
       * @en Process update phase for registered components
       * @zh 为当前注册的组件执行 update 阶段任务
       * @param dt 距离上一帧的时间
       */

    }, {
      key: "updatePhase",
      value: function updatePhase(dt) {
        this.updateInvoker.invoke(dt);
      }
      /**
       * @en Process late update phase for registered components
       * @zh 为当前注册的组件执行 late update 阶段任务
       * @param dt 距离上一帧的时间
       */

    }, {
      key: "lateUpdatePhase",
      value: function lateUpdatePhase(dt) {
        this.lateUpdateInvoker.invoke(dt); // End of this frame

        this._updating = false; // Start components of new activated nodes during update and lateUpdate
        // They will be running in the next frame

        this._startForNewComps();
      } // Call new registered start schedule immediately since last time start phase calling in this frame
      // See cocos-creator/2d-tasks/issues/256

    }, {
      key: "_startForNewComps",
      value: function _startForNewComps() {
        if (this._deferredComps.length > 0) {
          this._deferredSchedule();

          this.startInvoker.invoke();
        }
      }
    }, {
      key: "_scheduleImmediate",
      value: function _scheduleImmediate(comp) {
        if (typeof comp.start === 'function' && !(comp._objFlags & IsStartCalled)) {
          this.startInvoker.add(comp);
        }

        if (typeof comp.update === 'function') {
          this.updateInvoker.add(comp);
        }

        if (typeof comp.lateUpdate === 'function') {
          this.lateUpdateInvoker.add(comp);
        }
      }
    }, {
      key: "_deferredSchedule",
      value: function _deferredSchedule() {
        var comps = this._deferredComps;

        for (var i = 0, len = comps.length; i < len; i++) {
          this._scheduleImmediate(comps[i]);
        }

        comps.length = 0;
      }
    }]);

    return ComponentScheduler;
  }();

  _exports.ComponentScheduler = ComponentScheduler;

  if (_defaultConstants.EDITOR) {
    ComponentScheduler.prototype.enableComp = function (comp, invoker) {
      if (_globalExports.legacyCC.GAME_VIEW || comp.constructor._executeInEditMode) {
        if (!(comp._objFlags & IsOnEnableCalled)) {
          if (comp.onEnable) {
            if (invoker) {
              invoker.add(comp);
              enableInEditor(comp);
              return;
            } else {
              callOnEnableInTryCatch(comp);
              var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

              if (deactivatedDuringOnEnable) {
                return;
              }
            }
          }

          this._onEnabled(comp);
        }
      }

      enableInEditor(comp);
    };

    ComponentScheduler.prototype.disableComp = function (comp) {
      if (_globalExports.legacyCC.GAME_VIEW || comp.constructor._executeInEditMode) {
        if (comp._objFlags & IsOnEnableCalled) {
          if (comp.onDisable) {
            callOnDisableInTryCatch(comp);
          }

          this._onDisabled(comp);
        }
      }

      if (comp._objFlags & IsEditorOnEnableCalled) {
        _globalExports.legacyCC.engine.emit('component-disabled', comp.uuid);

        comp._objFlags &= ~IsEditorOnEnableCalled;
      }
    };
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvY29tcG9uZW50LXNjaGVkdWxlci50cyJdLCJuYW1lcyI6WyJmYXN0UmVtb3ZlQXQiLCJhcnJheSIsIklzU3RhcnRDYWxsZWQiLCJDQ09iamVjdCIsIkZsYWdzIiwiSXNPbkVuYWJsZUNhbGxlZCIsIklzRWRpdG9yT25FbmFibGVDYWxsZWQiLCJjYWxsZXJGdW5jdG9yIiwiRURJVE9SIiwidHJ5Q2F0Y2hGdW5jdG9yX0VESVRPUiIsImNhbGxPbkVuYWJsZUluVHJ5Q2F0Y2giLCJjYWxsT25EaXNhYmxlSW5UcnlDYXRjaCIsInNvcnRlZEluZGV4IiwiY29tcCIsIm9yZGVyIiwiY29uc3RydWN0b3IiLCJfZXhlY3V0aW9uT3JkZXIiLCJpZCIsIl9pZCIsImwiLCJoIiwibGVuZ3RoIiwibSIsInRlc3QiLCJ0ZXN0T3JkZXIiLCJ0ZXN0SWQiLCJzdGFibGVSZW1vdmVJbmFjdGl2ZSIsIml0ZXJhdG9yIiwiZmxhZ1RvQ2xlYXIiLCJuZXh0IiwiaSIsIl9lbmFibGVkIiwibm9kZSIsIl9hY3RpdmVJbkhpZXJhcmNoeSIsInJlbW92ZUF0IiwiX29iakZsYWdzIiwiTGlmZUN5Y2xlSW52b2tlciIsImludm9rZUZ1bmMiLCJfemVybyIsIl9uZWciLCJfcG9zIiwiX2ludm9rZSIsIkl0ZXJhdG9yIiwiTXV0YWJsZUZvcndhcmRJdGVyYXRvciIsIlRFU1QiLCJjb21wYXJlT3JkZXIiLCJhIiwiYiIsIk9uZU9mZkludm9rZXIiLCJwdXNoIiwiZmFzdFJlbW92ZSIsImNvbXBzTmVnIiwic29ydCIsImNvbXBzUG9zIiwiUmV1c2FibGVJbnZva2VyIiwic3BsaWNlIiwiREVWIiwiZHQiLCJlbmFibGVJbkVkaXRvciIsImxlZ2FjeUNDIiwiZW5naW5lIiwiZW1pdCIsInV1aWQiLCJHQU1FX1ZJRVciLCJjcmVhdGVJbnZva2VJbXBsSml0IiwiY29kZSIsInVzZUR0IiwiZW5zdXJlRmxhZyIsImJvZHkiLCJmYXN0UGF0aCIsIkZ1bmN0aW9uIiwic2luZ2xlSW52b2tlIiwiY3JlYXRlSW52b2tlSW1wbCIsImUiLCJfdGhyb3ciLCJpbnZva2VTdGFydCIsIlNVUFBPUlRfSklUIiwiYyIsInN0YXJ0IiwiaW52b2tlVXBkYXRlIiwidXBkYXRlIiwiaW52b2tlTGF0ZVVwZGF0ZSIsImxhdGVVcGRhdGUiLCJpbnZva2VPbkVuYWJsZSIsImNvbXBTY2hlZHVsZXIiLCJkaXJlY3RvciIsIl9jb21wU2NoZWR1bGVyIiwiZGVhY3RpdmF0ZWREdXJpbmdPbkVuYWJsZSIsIl9vbkVuYWJsZWQiLCJvbkVuYWJsZSIsIkNvbXBvbmVudFNjaGVkdWxlciIsIl9kZWZlcnJlZENvbXBzIiwidW5zY2hlZHVsZUFsbCIsInN0YXJ0SW52b2tlciIsInVwZGF0ZUludm9rZXIiLCJsYXRlVXBkYXRlSW52b2tlciIsIl91cGRhdGluZyIsImdldFNjaGVkdWxlciIsInJlc3VtZVRhcmdldCIsIl9zY2hlZHVsZUltbWVkaWF0ZSIsInBhdXNlVGFyZ2V0IiwiaW5kZXgiLCJpbmRleE9mIiwicmVtb3ZlIiwiaW52b2tlciIsImFkZCIsIm9uRGlzYWJsZSIsIl9vbkRpc2FibGVkIiwiaW52b2tlIiwiX3N0YXJ0Rm9yTmV3Q29tcHMiLCJfZGVmZXJyZWRTY2hlZHVsZSIsImNvbXBzIiwibGVuIiwicHJvdG90eXBlIiwiZW5hYmxlQ29tcCIsIl9leGVjdXRlSW5FZGl0TW9kZSIsImRpc2FibGVDb21wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0NBLE1BQU1BLFlBQVksR0FBR0MsVUFBTUQsWUFBM0IsQyxDQUVBOztBQUNBLE1BQU1FLGFBQWEsR0FBR0MsaUJBQVNDLEtBQVQsQ0FBZUYsYUFBckMsQyxDQUNBOztBQUNBLE1BQU1HLGdCQUFnQixHQUFHRixpQkFBU0MsS0FBVCxDQUFlQyxnQkFBeEMsQyxDQUNBOztBQUNBLE1BQU1DLHNCQUFzQixHQUFHSCxpQkFBU0MsS0FBVCxDQUFlRSxzQkFBOUM7QUFFQSxNQUFNQyxhQUFrQixHQUFHQyw0QkFBVUMsNEJBQXJDO0FBQ0EsTUFBTUMsc0JBQXNCLEdBQUdGLDRCQUFVRCxhQUFhLENBQUMsVUFBRCxDQUF0RDtBQUNBLE1BQU1JLHVCQUF1QixHQUFHSCw0QkFBVUQsYUFBYSxDQUFDLFdBQUQsQ0FBdkQ7O0FBRUEsV0FBU0ssV0FBVCxDQUFzQlgsS0FBdEIsRUFBNkJZLElBQTdCLEVBQW1DO0FBQy9CLFFBQU1DLEtBQUssR0FBR0QsSUFBSSxDQUFDRSxXQUFMLENBQWlCQyxlQUEvQjtBQUNBLFFBQU1DLEVBQUUsR0FBR0osSUFBSSxDQUFDSyxHQUFoQjtBQUNBLFFBQUlDLENBQUMsR0FBRyxDQUFSOztBQUNBLFNBQUssSUFBSUMsQ0FBQyxHQUFHbkIsS0FBSyxDQUFDb0IsTUFBTixHQUFlLENBQXZCLEVBQTBCQyxDQUFDLEdBQUdGLENBQUMsS0FBSyxDQUF6QyxFQUNLRCxDQUFDLElBQUlDLENBRFYsRUFFS0UsQ0FBQyxHQUFJSCxDQUFDLEdBQUdDLENBQUwsS0FBWSxDQUZyQixFQUdFO0FBQ0UsVUFBTUcsSUFBSSxHQUFHdEIsS0FBSyxDQUFDcUIsQ0FBRCxDQUFsQjtBQUNBLFVBQU1FLFNBQVMsR0FBR0QsSUFBSSxDQUFDUixXQUFMLENBQWlCQyxlQUFuQzs7QUFDQSxVQUFJUSxTQUFTLEdBQUdWLEtBQWhCLEVBQXVCO0FBQ25CTSxRQUFBQSxDQUFDLEdBQUdFLENBQUMsR0FBRyxDQUFSO0FBQ0gsT0FGRCxNQUdLLElBQUlFLFNBQVMsR0FBR1YsS0FBaEIsRUFBdUI7QUFDeEJLLFFBQUFBLENBQUMsR0FBR0csQ0FBQyxHQUFHLENBQVI7QUFDSCxPQUZJLE1BR0E7QUFDRCxZQUFNRyxNQUFNLEdBQUdGLElBQUksQ0FBQ0wsR0FBcEI7O0FBQ0EsWUFBSU8sTUFBTSxHQUFHUixFQUFiLEVBQWlCO0FBQ2JHLFVBQUFBLENBQUMsR0FBR0UsQ0FBQyxHQUFHLENBQVI7QUFDSCxTQUZELE1BR0ssSUFBSUcsTUFBTSxHQUFHUixFQUFiLEVBQWlCO0FBQ2xCRSxVQUFBQSxDQUFDLEdBQUdHLENBQUMsR0FBRyxDQUFSO0FBQ0gsU0FGSSxNQUdBO0FBQ0QsaUJBQU9BLENBQVA7QUFDSDtBQUNKO0FBQ0o7O0FBQ0QsV0FBTyxDQUFDSCxDQUFSO0FBQ0gsRyxDQUVEOzs7QUFDQSxXQUFTTyxvQkFBVCxDQUErQkMsUUFBL0IsRUFBeUNDLFdBQXpDLEVBQXNEO0FBQ2xELFFBQU0zQixLQUFLLEdBQUcwQixRQUFRLENBQUMxQixLQUF2QjtBQUNBLFFBQUk0QixJQUFJLEdBQUdGLFFBQVEsQ0FBQ0csQ0FBVCxHQUFhLENBQXhCOztBQUNBLFdBQU9ELElBQUksR0FBRzVCLEtBQUssQ0FBQ29CLE1BQXBCLEVBQTRCO0FBQ3hCLFVBQU1SLElBQUksR0FBR1osS0FBSyxDQUFDNEIsSUFBRCxDQUFsQjs7QUFDQSxVQUFJaEIsSUFBSSxDQUFDa0IsUUFBTCxJQUFpQmxCLElBQUksQ0FBQ21CLElBQUwsQ0FBVUMsa0JBQS9CLEVBQW1EO0FBQy9DLFVBQUVKLElBQUY7QUFDSCxPQUZELE1BR0s7QUFDREYsUUFBQUEsUUFBUSxDQUFDTyxRQUFULENBQWtCTCxJQUFsQjs7QUFDQSxZQUFJRCxXQUFKLEVBQWlCO0FBQ2JmLFVBQUFBLElBQUksQ0FBQ3NCLFNBQUwsSUFBa0IsQ0FBQ1AsV0FBbkI7QUFDSDtBQUNKO0FBQ0o7QUFDSixHLENBRUQ7OztNQUNhUSxnQixHQU9ULDBCQUFhQyxVQUFiLEVBQXlCO0FBQUE7O0FBQUEsU0FKZkMsS0FJZTtBQUFBLFNBSGZDLElBR2U7QUFBQSxTQUZmQyxJQUVlO0FBQUEsU0FEZkMsT0FDZTtBQUNyQixRQUFNQyxRQUFRLEdBQUdDLDhCQUFqQixDQURxQixDQUVyQjs7QUFDQSxTQUFLTCxLQUFMLEdBQWEsSUFBSUksUUFBSixDQUFhLEVBQWIsQ0FBYixDQUhxQixDQUlyQjs7QUFDQSxTQUFLSCxJQUFMLEdBQVksSUFBSUcsUUFBSixDQUFhLEVBQWIsQ0FBWixDQUxxQixDQU1yQjs7QUFDQSxTQUFLRixJQUFMLEdBQVksSUFBSUUsUUFBSixDQUFhLEVBQWIsQ0FBWjs7QUFFQSxRQUFJRSxzQkFBSixFQUFVO0FBQ04seUJBQU8sT0FBT1AsVUFBUCxLQUFzQixVQUE3QixFQUF5QyxrQ0FBekM7QUFDSDs7QUFDRCxTQUFLSSxPQUFMLEdBQWVKLFVBQWY7QUFDSCxHOzs7QUFwQlFELEVBQUFBLGdCLENBQ0tWLG9CLEdBQXVCQSxvQjs7QUFzQnpDLFdBQVNtQixZQUFULENBQXVCQyxDQUF2QixFQUEwQkMsQ0FBMUIsRUFBNkI7QUFDekIsV0FBT0QsQ0FBQyxDQUFDL0IsV0FBRixDQUFjQyxlQUFkLEdBQWdDK0IsQ0FBQyxDQUFDaEMsV0FBRixDQUFjQyxlQUFyRDtBQUNILEcsQ0FFRDs7O01BQ2FnQyxhOzs7Ozs7Ozs7OzswQkFDR25DLEksRUFBTTtBQUNkLFlBQU1DLEtBQUssR0FBR0QsSUFBSSxDQUFDRSxXQUFMLENBQWlCQyxlQUEvQjtBQUNBLFNBQUNGLEtBQUssS0FBSyxDQUFWLEdBQWMsS0FBS3dCLEtBQW5CLEdBQTRCeEIsS0FBSyxHQUFHLENBQVIsR0FBWSxLQUFLeUIsSUFBakIsR0FBd0IsS0FBS0MsSUFBMUQsRUFBaUV2QyxLQUFqRSxDQUF1RWdELElBQXZFLENBQTRFcEMsSUFBNUU7QUFDSDs7OzZCQUVjQSxJLEVBQU07QUFDakIsWUFBTUMsS0FBSyxHQUFHRCxJQUFJLENBQUNFLFdBQUwsQ0FBaUJDLGVBQS9CO0FBQ0EsU0FBQ0YsS0FBSyxLQUFLLENBQVYsR0FBYyxLQUFLd0IsS0FBbkIsR0FBNEJ4QixLQUFLLEdBQUcsQ0FBUixHQUFZLEtBQUt5QixJQUFqQixHQUF3QixLQUFLQyxJQUExRCxFQUFpRVUsVUFBakUsQ0FBNEVyQyxJQUE1RTtBQUNIOzs7cUNBRXNCZSxXLEVBQWE7QUFDaENGLFFBQUFBLG9CQUFvQixDQUFDLEtBQUtZLEtBQU4sRUFBYVYsV0FBYixDQUFwQjtBQUNBRixRQUFBQSxvQkFBb0IsQ0FBQyxLQUFLYSxJQUFOLEVBQVlYLFdBQVosQ0FBcEI7QUFDQUYsUUFBQUEsb0JBQW9CLENBQUMsS0FBS2MsSUFBTixFQUFZWixXQUFaLENBQXBCO0FBQ0g7OzsrQkFFZ0I7QUFDYixZQUFNdUIsUUFBUSxHQUFHLEtBQUtaLElBQXRCOztBQUNBLFlBQUlZLFFBQVEsQ0FBQ2xELEtBQVQsQ0FBZW9CLE1BQWYsR0FBd0IsQ0FBNUIsRUFBK0I7QUFDM0I4QixVQUFBQSxRQUFRLENBQUNsRCxLQUFULENBQWVtRCxJQUFmLENBQW9CUCxZQUFwQjs7QUFDQSxlQUFLSixPQUFMLENBQWFVLFFBQWI7O0FBQ0FBLFVBQUFBLFFBQVEsQ0FBQ2xELEtBQVQsQ0FBZW9CLE1BQWYsR0FBd0IsQ0FBeEI7QUFDSDs7QUFFRCxhQUFLb0IsT0FBTCxDQUFhLEtBQUtILEtBQWxCOztBQUNBLGFBQUtBLEtBQUwsQ0FBV3JDLEtBQVgsQ0FBaUJvQixNQUFqQixHQUEwQixDQUExQjtBQUVBLFlBQU1nQyxRQUFRLEdBQUcsS0FBS2IsSUFBdEI7O0FBQ0EsWUFBSWEsUUFBUSxDQUFDcEQsS0FBVCxDQUFlb0IsTUFBZixHQUF3QixDQUE1QixFQUErQjtBQUMzQmdDLFVBQUFBLFFBQVEsQ0FBQ3BELEtBQVQsQ0FBZW1ELElBQWYsQ0FBb0JQLFlBQXBCOztBQUNBLGVBQUtKLE9BQUwsQ0FBYVksUUFBYjs7QUFDQUEsVUFBQUEsUUFBUSxDQUFDcEQsS0FBVCxDQUFlb0IsTUFBZixHQUF3QixDQUF4QjtBQUNIO0FBQ0o7Ozs7SUFsQzhCZSxnQixHQXFDbkM7Ozs7O01BQ01rQixlOzs7Ozs7Ozs7OzswQkFDVXpDLEksRUFBTTtBQUNkLFlBQU1DLEtBQUssR0FBR0QsSUFBSSxDQUFDRSxXQUFMLENBQWlCQyxlQUEvQjs7QUFDQSxZQUFJRixLQUFLLEtBQUssQ0FBZCxFQUFpQjtBQUNiLGVBQUt3QixLQUFMLENBQVdyQyxLQUFYLENBQWlCZ0QsSUFBakIsQ0FBc0JwQyxJQUF0QjtBQUNILFNBRkQsTUFHSztBQUNELGNBQU1aLE1BQUssR0FBR2EsS0FBSyxHQUFHLENBQVIsR0FBWSxLQUFLeUIsSUFBTCxDQUFVdEMsS0FBdEIsR0FBOEIsS0FBS3VDLElBQUwsQ0FBVXZDLEtBQXREOztBQUNBLGNBQU02QixDQUFDLEdBQUdsQixXQUFXLENBQUNYLE1BQUQsRUFBUVksSUFBUixDQUFyQjs7QUFDQSxjQUFJaUIsQ0FBQyxHQUFHLENBQVIsRUFBVztBQUNQN0IsWUFBQUEsTUFBSyxDQUFDc0QsTUFBTixDQUFhLENBQUN6QixDQUFkLEVBQWlCLENBQWpCLEVBQW9CakIsSUFBcEI7QUFDSCxXQUZELE1BR0ssSUFBSTJDLHFCQUFKLEVBQVM7QUFDViw4QkFBTSx5QkFBTjtBQUNIO0FBQ0o7QUFDSjs7OzZCQUVjM0MsSSxFQUFNO0FBQ2pCLFlBQU1DLEtBQUssR0FBR0QsSUFBSSxDQUFDRSxXQUFMLENBQWlCQyxlQUEvQjs7QUFDQSxZQUFJRixLQUFLLEtBQUssQ0FBZCxFQUFpQjtBQUNiLGVBQUt3QixLQUFMLENBQVdZLFVBQVgsQ0FBc0JyQyxJQUF0QjtBQUNILFNBRkQsTUFHSztBQUNELGNBQU1jLFFBQVEsR0FBR2IsS0FBSyxHQUFHLENBQVIsR0FBWSxLQUFLeUIsSUFBakIsR0FBd0IsS0FBS0MsSUFBOUM7QUFDQSxjQUFNVixDQUFDLEdBQUdsQixXQUFXLENBQUNlLFFBQVEsQ0FBQzFCLEtBQVYsRUFBaUJZLElBQWpCLENBQXJCOztBQUNBLGNBQUlpQixDQUFDLElBQUksQ0FBVCxFQUFZO0FBQ1JILFlBQUFBLFFBQVEsQ0FBQ08sUUFBVCxDQUFrQkosQ0FBbEI7QUFDSDtBQUNKO0FBQ0o7Ozs2QkFFYzJCLEUsRUFBSTtBQUNmLFlBQUksS0FBS2xCLElBQUwsQ0FBVXRDLEtBQVYsQ0FBZ0JvQixNQUFoQixHQUF5QixDQUE3QixFQUFnQztBQUM1QixlQUFLb0IsT0FBTCxDQUFhLEtBQUtGLElBQWxCLEVBQXdCa0IsRUFBeEI7QUFDSDs7QUFFRCxhQUFLaEIsT0FBTCxDQUFhLEtBQUtILEtBQWxCLEVBQXlCbUIsRUFBekI7O0FBRUEsWUFBSSxLQUFLakIsSUFBTCxDQUFVdkMsS0FBVixDQUFnQm9CLE1BQWhCLEdBQXlCLENBQTdCLEVBQWdDO0FBQzVCLGVBQUtvQixPQUFMLENBQWEsS0FBS0QsSUFBbEIsRUFBd0JpQixFQUF4QjtBQUNIO0FBQ0o7Ozs7SUExQ3lCckIsZ0I7O0FBNkM5QixXQUFTc0IsY0FBVCxDQUF5QjdDLElBQXpCLEVBQStCO0FBQzNCLFFBQUksRUFBRUEsSUFBSSxDQUFDc0IsU0FBTCxHQUFpQjdCLHNCQUFuQixDQUFKLEVBQWdEO0FBQzVDcUQsOEJBQVNDLE1BQVQsQ0FBZ0JDLElBQWhCLENBQXFCLG1CQUFyQixFQUEwQ2hELElBQUksQ0FBQ2lELElBQS9DOztBQUNBLFVBQUcsQ0FBQ0gsd0JBQVNJLFNBQWIsRUFBd0I7QUFDcEJsRCxRQUFBQSxJQUFJLENBQUNzQixTQUFMLElBQWtCN0Isc0JBQWxCO0FBQ0g7QUFDSjtBQUNKLEcsQ0FFRDs7O0FBQ08sV0FBUzBELG1CQUFULENBQThCQyxJQUE5QixFQUE0Q0MsS0FBNUMsRUFBb0RDLFVBQXBELEVBQWlFO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTUMsSUFBSSxHQUFHLG9CQUNELG1DQURDLEdBRUQsZ0JBRkMsR0FHREgsSUFIQyxHQUlELEdBSlo7QUFLQSxRQUFJSSxRQUFRLEdBQUdILEtBQUssR0FBR0ksUUFBUSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWFGLElBQWIsQ0FBWCxHQUFnQ0UsUUFBUSxDQUFDLElBQUQsRUFBT0YsSUFBUCxDQUE1RDtBQUNBLFFBQUlHLFlBQVksR0FBR0QsUUFBUSxDQUFDLEdBQUQsRUFBTSxJQUFOLEVBQVlMLElBQVosQ0FBM0I7QUFDQSxXQUFPTyxnQkFBZ0IsQ0FBQ0QsWUFBRCxFQUFlRixRQUFmLEVBQXlCRixVQUF6QixDQUF2QjtBQUNIOztBQUNNLFdBQVNLLGdCQUFULENBQTJCRCxZQUEzQixFQUF5Q0YsUUFBekMsRUFBbURGLFVBQW5ELEVBQWdFO0FBQ25FLFdBQU8sVUFBQ3hDLFFBQUQsRUFBVzhCLEVBQVgsRUFBa0I7QUFDckIsVUFBSTtBQUNBWSxRQUFBQSxRQUFRLENBQUMxQyxRQUFELEVBQVc4QixFQUFYLENBQVI7QUFDSCxPQUZELENBR0EsT0FBT2dCLENBQVAsRUFBVTtBQUNOO0FBQ0FkLGdDQUFTZSxNQUFULENBQWdCRCxDQUFoQjs7QUFDQSxZQUFJeEUsS0FBSyxHQUFHMEIsUUFBUSxDQUFDMUIsS0FBckI7O0FBQ0EsWUFBSWtFLFVBQUosRUFBZ0I7QUFDWmxFLFVBQUFBLEtBQUssQ0FBQzBCLFFBQVEsQ0FBQ0csQ0FBVixDQUFMLENBQWtCSyxTQUFsQixJQUErQmdDLFVBQS9CO0FBQ0g7O0FBQ0QsVUFBRXhDLFFBQVEsQ0FBQ0csQ0FBWCxDQVBNLENBT1U7O0FBQ2hCLGVBQU9ILFFBQVEsQ0FBQ0csQ0FBVCxHQUFhN0IsS0FBSyxDQUFDb0IsTUFBMUIsRUFBa0MsRUFBRU0sUUFBUSxDQUFDRyxDQUE3QyxFQUFnRDtBQUM1QyxjQUFJO0FBQ0F5QyxZQUFBQSxZQUFZLENBQUN0RSxLQUFLLENBQUMwQixRQUFRLENBQUNHLENBQVYsQ0FBTixFQUFvQjJCLEVBQXBCLENBQVo7QUFDSCxXQUZELENBR0EsT0FBT2dCLENBQVAsRUFBVTtBQUNOZCxvQ0FBU2UsTUFBVCxDQUFnQkQsQ0FBaEI7O0FBQ0EsZ0JBQUlOLFVBQUosRUFBZ0I7QUFDWmxFLGNBQUFBLEtBQUssQ0FBQzBCLFFBQVEsQ0FBQ0csQ0FBVixDQUFMLENBQWtCSyxTQUFsQixJQUErQmdDLFVBQS9CO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDSixLQXhCRDtBQXlCSDs7QUFFRCxNQUFNUSxXQUFXLEdBQUdDLGdDQUFjWixtQkFBbUIsQ0FBQyw0QkFBNEI5RCxhQUE3QixFQUE0QyxLQUE1QyxFQUFtREEsYUFBbkQsQ0FBakMsR0FDaEJzRSxnQkFBZ0IsQ0FDWixVQUFVSyxDQUFWLEVBQWE7QUFDVEEsSUFBQUEsQ0FBQyxDQUFDQyxLQUFGO0FBQ0FELElBQUFBLENBQUMsQ0FBQzFDLFNBQUYsSUFBZWpDLGFBQWY7QUFDSCxHQUpXLEVBS1osVUFBVXlCLFFBQVYsRUFBb0I7QUFDaEIsUUFBSTFCLEtBQUssR0FBRzBCLFFBQVEsQ0FBQzFCLEtBQXJCOztBQUNBLFNBQUswQixRQUFRLENBQUNHLENBQVQsR0FBYSxDQUFsQixFQUFxQkgsUUFBUSxDQUFDRyxDQUFULEdBQWE3QixLQUFLLENBQUNvQixNQUF4QyxFQUFnRCxFQUFFTSxRQUFRLENBQUNHLENBQTNELEVBQThEO0FBQzFELFVBQUlqQixJQUFJLEdBQUdaLEtBQUssQ0FBQzBCLFFBQVEsQ0FBQ0csQ0FBVixDQUFoQjtBQUNBakIsTUFBQUEsSUFBSSxDQUFDaUUsS0FBTDtBQUNBakUsTUFBQUEsSUFBSSxDQUFDc0IsU0FBTCxJQUFrQmpDLGFBQWxCO0FBQ0g7QUFDSixHQVpXLEVBYVpBLGFBYlksQ0FEcEI7QUFpQkEsTUFBTTZFLFlBQVksR0FBR0gsZ0NBQWNaLG1CQUFtQixDQUFDLGNBQUQsRUFBaUIsSUFBakIsQ0FBakMsR0FDakJRLGdCQUFnQixDQUNaLFVBQVVLLENBQVYsRUFBYXBCLEVBQWIsRUFBaUI7QUFDYm9CLElBQUFBLENBQUMsQ0FBQ0csTUFBRixDQUFTdkIsRUFBVDtBQUNILEdBSFcsRUFJWixVQUFVOUIsUUFBVixFQUFvQjhCLEVBQXBCLEVBQXdCO0FBQ3BCLFFBQUl4RCxLQUFLLEdBQUcwQixRQUFRLENBQUMxQixLQUFyQjs7QUFDQSxTQUFLMEIsUUFBUSxDQUFDRyxDQUFULEdBQWEsQ0FBbEIsRUFBcUJILFFBQVEsQ0FBQ0csQ0FBVCxHQUFhN0IsS0FBSyxDQUFDb0IsTUFBeEMsRUFBZ0QsRUFBRU0sUUFBUSxDQUFDRyxDQUEzRCxFQUE4RDtBQUMxRDdCLE1BQUFBLEtBQUssQ0FBQzBCLFFBQVEsQ0FBQ0csQ0FBVixDQUFMLENBQWtCa0QsTUFBbEIsQ0FBeUJ2QixFQUF6QjtBQUNIO0FBQ0osR0FUVyxDQURwQjtBQWFBLE1BQU13QixnQkFBZ0IsR0FBR0wsZ0NBQWNaLG1CQUFtQixDQUFDLGtCQUFELEVBQXFCLElBQXJCLENBQWpDLEdBQ3JCUSxnQkFBZ0IsQ0FDWixVQUFVSyxDQUFWLEVBQWFwQixFQUFiLEVBQWlCO0FBQ2JvQixJQUFBQSxDQUFDLENBQUNLLFVBQUYsQ0FBYXpCLEVBQWI7QUFDSCxHQUhXLEVBSVosVUFBVTlCLFFBQVYsRUFBb0I4QixFQUFwQixFQUF3QjtBQUNwQixRQUFJeEQsS0FBSyxHQUFHMEIsUUFBUSxDQUFDMUIsS0FBckI7O0FBQ0EsU0FBSzBCLFFBQVEsQ0FBQ0csQ0FBVCxHQUFhLENBQWxCLEVBQXFCSCxRQUFRLENBQUNHLENBQVQsR0FBYTdCLEtBQUssQ0FBQ29CLE1BQXhDLEVBQWdELEVBQUVNLFFBQVEsQ0FBQ0csQ0FBM0QsRUFBOEQ7QUFDMUQ3QixNQUFBQSxLQUFLLENBQUMwQixRQUFRLENBQUNHLENBQVYsQ0FBTCxDQUFrQm9ELFVBQWxCLENBQTZCekIsRUFBN0I7QUFDSDtBQUNKLEdBVFcsQ0FEcEI7QUFhTyxNQUFNMEIsY0FBYyxHQUFHM0UsMkJBQVMsVUFBQ21CLFFBQUQsRUFBYztBQUNqRCxRQUFNeUQsYUFBYSxHQUFHekIsd0JBQVMwQixRQUFULENBQWtCQyxjQUF4QztBQUNBLFFBQU1yRixLQUFLLEdBQUcwQixRQUFRLENBQUMxQixLQUF2Qjs7QUFDQSxTQUFLMEIsUUFBUSxDQUFDRyxDQUFULEdBQWEsQ0FBbEIsRUFBcUJILFFBQVEsQ0FBQ0csQ0FBVCxHQUFhN0IsS0FBSyxDQUFDb0IsTUFBeEMsRUFBZ0QsRUFBRU0sUUFBUSxDQUFDRyxDQUEzRCxFQUE4RDtBQUMxRCxVQUFNakIsSUFBSSxHQUFHWixLQUFLLENBQUMwQixRQUFRLENBQUNHLENBQVYsQ0FBbEI7O0FBQ0EsVUFBSWpCLElBQUksQ0FBQ2tCLFFBQVQsRUFBbUI7QUFDZnJCLFFBQUFBLHNCQUFzQixDQUFDRyxJQUFELENBQXRCO0FBQ0EsWUFBTTBFLHlCQUF5QixHQUFHLENBQUMxRSxJQUFJLENBQUNtQixJQUFMLENBQVVDLGtCQUE3Qzs7QUFDQSxZQUFJLENBQUNzRCx5QkFBTCxFQUFnQztBQUM1QkgsVUFBQUEsYUFBYSxDQUFDSSxVQUFkLENBQXlCM0UsSUFBekI7QUFDSDtBQUNKO0FBQ0o7QUFDSixHQWI2QixHQWExQixVQUFDYyxRQUFELEVBQWM7QUFDZCxRQUFNeUQsYUFBYSxHQUFHekIsd0JBQVMwQixRQUFULENBQWtCQyxjQUF4QztBQUNBLFFBQU1yRixLQUFLLEdBQUcwQixRQUFRLENBQUMxQixLQUF2Qjs7QUFDQSxTQUFLMEIsUUFBUSxDQUFDRyxDQUFULEdBQWEsQ0FBbEIsRUFBcUJILFFBQVEsQ0FBQ0csQ0FBVCxHQUFhN0IsS0FBSyxDQUFDb0IsTUFBeEMsRUFBZ0QsRUFBRU0sUUFBUSxDQUFDRyxDQUEzRCxFQUE4RDtBQUMxRCxVQUFNakIsSUFBSSxHQUFHWixLQUFLLENBQUMwQixRQUFRLENBQUNHLENBQVYsQ0FBbEI7O0FBQ0EsVUFBSWpCLElBQUksQ0FBQ2tCLFFBQVQsRUFBbUI7QUFDZmxCLFFBQUFBLElBQUksQ0FBQzRFLFFBQUw7QUFDQSxZQUFNRix5QkFBeUIsR0FBRyxDQUFDMUUsSUFBSSxDQUFDbUIsSUFBTCxDQUFVQyxrQkFBN0M7O0FBQ0EsWUFBSSxDQUFDc0QseUJBQUwsRUFBZ0M7QUFDNUJILFVBQUFBLGFBQWEsQ0FBQ0ksVUFBZCxDQUF5QjNFLElBQXpCO0FBQ0g7QUFDSjtBQUNKO0FBQ0osR0ExQk07QUE0QlA7Ozs7Ozs7OztNQU1hNkUsa0I7QUFDVDs7Ozs7QUFLQTs7Ozs7QUFLQTs7OztBQUtBO0FBSUEsa0NBQWU7QUFBQTs7QUFBQSxXQUhQQyxjQUdPLEdBSGlCLEVBR2pCO0FBQ1gsV0FBS0MsYUFBTDtBQUNIO0FBRUQ7Ozs7Ozs7O3NDQUl3QjtBQUNwQjtBQUNBLGFBQUtDLFlBQUwsR0FBb0IsSUFBSTdDLGFBQUosQ0FBa0IyQixXQUFsQixDQUFwQjtBQUNBLGFBQUttQixhQUFMLEdBQXFCLElBQUl4QyxlQUFKLENBQW9CeUIsWUFBcEIsQ0FBckI7QUFDQSxhQUFLZ0IsaUJBQUwsR0FBeUIsSUFBSXpDLGVBQUosQ0FBb0IyQixnQkFBcEIsQ0FBekIsQ0FKb0IsQ0FNcEI7O0FBQ0EsYUFBS2UsU0FBTCxHQUFpQixLQUFqQjtBQUNIOzs7aUNBRWtCbkYsSSxFQUFNO0FBQ3JCOEMsZ0NBQVMwQixRQUFULENBQWtCWSxZQUFsQixHQUFpQ0MsWUFBakMsQ0FBOENyRixJQUE5Qzs7QUFDQUEsUUFBQUEsSUFBSSxDQUFDc0IsU0FBTCxJQUFrQjlCLGdCQUFsQixDQUZxQixDQUlyQjs7QUFDQSxZQUFJLEtBQUsyRixTQUFULEVBQW9CO0FBQ2hCLGVBQUtMLGNBQUwsQ0FBb0IxQyxJQUFwQixDQUF5QnBDLElBQXpCO0FBQ0gsU0FGRCxNQUdLO0FBQ0QsZUFBS3NGLGtCQUFMLENBQXdCdEYsSUFBeEI7QUFDSDtBQUNKOzs7a0NBRW1CQSxJLEVBQU07QUFDdEI4QyxnQ0FBUzBCLFFBQVQsQ0FBa0JZLFlBQWxCLEdBQWlDRyxXQUFqQyxDQUE2Q3ZGLElBQTdDOztBQUNBQSxRQUFBQSxJQUFJLENBQUNzQixTQUFMLElBQWtCLENBQUM5QixnQkFBbkIsQ0FGc0IsQ0FJdEI7O0FBQ0EsWUFBTWdHLEtBQUssR0FBRyxLQUFLVixjQUFMLENBQW9CVyxPQUFwQixDQUE0QnpGLElBQTVCLENBQWQ7O0FBQ0EsWUFBSXdGLEtBQUssSUFBSSxDQUFiLEVBQWdCO0FBQ1pyRyxVQUFBQSxZQUFZLENBQUMsS0FBSzJGLGNBQU4sRUFBc0JVLEtBQXRCLENBQVo7QUFDQTtBQUNILFNBVHFCLENBV3RCOzs7QUFDQSxZQUFJeEYsSUFBSSxDQUFDaUUsS0FBTCxJQUFjLEVBQUVqRSxJQUFJLENBQUNzQixTQUFMLEdBQWlCakMsYUFBbkIsQ0FBbEIsRUFBcUQ7QUFDakQsZUFBSzJGLFlBQUwsQ0FBa0JVLE1BQWxCLENBQXlCMUYsSUFBekI7QUFDSDs7QUFDRCxZQUFJQSxJQUFJLENBQUNtRSxNQUFULEVBQWlCO0FBQ2IsZUFBS2MsYUFBTCxDQUFtQlMsTUFBbkIsQ0FBMEIxRixJQUExQjtBQUNIOztBQUNELFlBQUlBLElBQUksQ0FBQ3FFLFVBQVQsRUFBcUI7QUFDakIsZUFBS2EsaUJBQUwsQ0FBdUJRLE1BQXZCLENBQThCMUYsSUFBOUI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7OztpQ0FNbUJBLEksRUFBTTJGLE8sRUFBVTtBQUMvQixZQUFJLEVBQUUzRixJQUFJLENBQUNzQixTQUFMLEdBQWlCOUIsZ0JBQW5CLENBQUosRUFBMEM7QUFDdEMsY0FBSVEsSUFBSSxDQUFDNEUsUUFBVCxFQUFtQjtBQUNmLGdCQUFJZSxPQUFKLEVBQWE7QUFDVEEsY0FBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVk1RixJQUFaO0FBQ0E7QUFDSCxhQUhELE1BSUs7QUFDREEsY0FBQUEsSUFBSSxDQUFDNEUsUUFBTDtBQUVBLGtCQUFNRix5QkFBeUIsR0FBRyxDQUFDMUUsSUFBSSxDQUFDbUIsSUFBTCxDQUFVQyxrQkFBN0M7O0FBQ0Esa0JBQUlzRCx5QkFBSixFQUErQjtBQUMzQjtBQUNIO0FBQ0o7QUFDSjs7QUFDRCxlQUFLQyxVQUFMLENBQWdCM0UsSUFBaEI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7O2tDQUtvQkEsSSxFQUFNO0FBQ3RCLFlBQUlBLElBQUksQ0FBQ3NCLFNBQUwsR0FBaUI5QixnQkFBckIsRUFBdUM7QUFDbkMsY0FBSVEsSUFBSSxDQUFDNkYsU0FBVCxFQUFvQjtBQUNoQjdGLFlBQUFBLElBQUksQ0FBQzZGLFNBQUw7QUFDSDs7QUFDRCxlQUFLQyxXQUFMLENBQWlCOUYsSUFBakI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7bUNBSXFCO0FBQ2pCO0FBQ0EsYUFBS21GLFNBQUwsR0FBaUIsSUFBakIsQ0FGaUIsQ0FJakI7O0FBQ0EsYUFBS0gsWUFBTCxDQUFrQmUsTUFBbEIsR0FMaUIsQ0FNakI7O0FBQ0EsYUFBS0MsaUJBQUwsR0FQaUIsQ0FRakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNIO0FBRUQ7Ozs7Ozs7O2tDQUtvQnBELEUsRUFBVztBQUMzQixhQUFLcUMsYUFBTCxDQUFtQmMsTUFBbkIsQ0FBMEJuRCxFQUExQjtBQUNIO0FBRUQ7Ozs7Ozs7O3NDQUt3QkEsRSxFQUFXO0FBQy9CLGFBQUtzQyxpQkFBTCxDQUF1QmEsTUFBdkIsQ0FBOEJuRCxFQUE5QixFQUQrQixDQUcvQjs7QUFDQSxhQUFLdUMsU0FBTCxHQUFpQixLQUFqQixDQUorQixDQU0vQjtBQUNBOztBQUNBLGFBQUthLGlCQUFMO0FBQ0gsTyxDQUVEO0FBQ0E7Ozs7MENBQzZCO0FBQ3pCLFlBQUksS0FBS2xCLGNBQUwsQ0FBb0J0RSxNQUFwQixHQUE2QixDQUFqQyxFQUFvQztBQUNoQyxlQUFLeUYsaUJBQUw7O0FBQ0EsZUFBS2pCLFlBQUwsQ0FBa0JlLE1BQWxCO0FBQ0g7QUFDSjs7O3lDQUUyQi9GLEksRUFBTTtBQUM5QixZQUFJLE9BQU9BLElBQUksQ0FBQ2lFLEtBQVosS0FBc0IsVUFBdEIsSUFBb0MsRUFBRWpFLElBQUksQ0FBQ3NCLFNBQUwsR0FBaUJqQyxhQUFuQixDQUF4QyxFQUEyRTtBQUN2RSxlQUFLMkYsWUFBTCxDQUFrQlksR0FBbEIsQ0FBc0I1RixJQUF0QjtBQUNIOztBQUNELFlBQUksT0FBT0EsSUFBSSxDQUFDbUUsTUFBWixLQUF1QixVQUEzQixFQUF1QztBQUNuQyxlQUFLYyxhQUFMLENBQW1CVyxHQUFuQixDQUF1QjVGLElBQXZCO0FBQ0g7O0FBQ0QsWUFBSSxPQUFPQSxJQUFJLENBQUNxRSxVQUFaLEtBQTJCLFVBQS9CLEVBQTJDO0FBQ3ZDLGVBQUthLGlCQUFMLENBQXVCVSxHQUF2QixDQUEyQjVGLElBQTNCO0FBQ0g7QUFDSjs7OzBDQUU0QjtBQUN6QixZQUFNa0csS0FBSyxHQUFHLEtBQUtwQixjQUFuQjs7QUFDQSxhQUFLLElBQUk3RCxDQUFDLEdBQUcsQ0FBUixFQUFXa0YsR0FBRyxHQUFHRCxLQUFLLENBQUMxRixNQUE1QixFQUFvQ1MsQ0FBQyxHQUFHa0YsR0FBeEMsRUFBNkNsRixDQUFDLEVBQTlDLEVBQWtEO0FBQzlDLGVBQUtxRSxrQkFBTCxDQUF3QlksS0FBSyxDQUFDakYsQ0FBRCxDQUE3QjtBQUNIOztBQUNEaUYsUUFBQUEsS0FBSyxDQUFDMUYsTUFBTixHQUFlLENBQWY7QUFDSDs7Ozs7Ozs7QUFHTCxNQUFJYix3QkFBSixFQUFZO0FBQ1JrRixJQUFBQSxrQkFBa0IsQ0FBQ3VCLFNBQW5CLENBQTZCQyxVQUE3QixHQUEwQyxVQUFVckcsSUFBVixFQUFnQjJGLE9BQWhCLEVBQXlCO0FBQy9ELFVBQUk3Qyx3QkFBU0ksU0FBVCxJQUFzQmxELElBQUksQ0FBQ0UsV0FBTCxDQUFpQm9HLGtCQUEzQyxFQUErRDtBQUMzRCxZQUFJLEVBQUV0RyxJQUFJLENBQUNzQixTQUFMLEdBQWlCOUIsZ0JBQW5CLENBQUosRUFBMEM7QUFDdEMsY0FBSVEsSUFBSSxDQUFDNEUsUUFBVCxFQUFtQjtBQUNmLGdCQUFJZSxPQUFKLEVBQWE7QUFDVEEsY0FBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVk1RixJQUFaO0FBQ0E2QyxjQUFBQSxjQUFjLENBQUM3QyxJQUFELENBQWQ7QUFDQTtBQUNILGFBSkQsTUFLSztBQUNESCxjQUFBQSxzQkFBc0IsQ0FBQ0csSUFBRCxDQUF0QjtBQUVBLGtCQUFNMEUseUJBQXlCLEdBQUcsQ0FBQzFFLElBQUksQ0FBQ21CLElBQUwsQ0FBVUMsa0JBQTdDOztBQUNBLGtCQUFJc0QseUJBQUosRUFBK0I7QUFDM0I7QUFDSDtBQUNKO0FBQ0o7O0FBQ0QsZUFBS0MsVUFBTCxDQUFnQjNFLElBQWhCO0FBQ0g7QUFDSjs7QUFDRDZDLE1BQUFBLGNBQWMsQ0FBQzdDLElBQUQsQ0FBZDtBQUNILEtBdEJEOztBQXdCQTZFLElBQUFBLGtCQUFrQixDQUFDdUIsU0FBbkIsQ0FBNkJHLFdBQTdCLEdBQTJDLFVBQVV2RyxJQUFWLEVBQWdCO0FBQ3ZELFVBQUk4Qyx3QkFBU0ksU0FBVCxJQUFzQmxELElBQUksQ0FBQ0UsV0FBTCxDQUFpQm9HLGtCQUEzQyxFQUErRDtBQUMzRCxZQUFJdEcsSUFBSSxDQUFDc0IsU0FBTCxHQUFpQjlCLGdCQUFyQixFQUF1QztBQUNuQyxjQUFJUSxJQUFJLENBQUM2RixTQUFULEVBQW9CO0FBQ2hCL0YsWUFBQUEsdUJBQXVCLENBQUNFLElBQUQsQ0FBdkI7QUFDSDs7QUFDRCxlQUFLOEYsV0FBTCxDQUFpQjlGLElBQWpCO0FBQ0g7QUFDSjs7QUFDRCxVQUFJQSxJQUFJLENBQUNzQixTQUFMLEdBQWlCN0Isc0JBQXJCLEVBQTZDO0FBQ3pDcUQsZ0NBQVNDLE1BQVQsQ0FBZ0JDLElBQWhCLENBQXFCLG9CQUFyQixFQUEyQ2hELElBQUksQ0FBQ2lELElBQWhEOztBQUNBakQsUUFBQUEsSUFBSSxDQUFDc0IsU0FBTCxJQUFrQixDQUFDN0Isc0JBQW5CO0FBQ0g7QUFDSixLQWJEO0FBY0giLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHNjZW5lLWdyYXBoXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ0NPYmplY3QgfSBmcm9tICcuLi9kYXRhL29iamVjdCc7XHJcbmltcG9ydCB7IE11dGFibGVGb3J3YXJkSXRlcmF0b3IgfSBmcm9tICcuLi91dGlscy9hcnJheSc7XHJcbmltcG9ydCB7IGFycmF5IH0gZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgeyB0cnlDYXRjaEZ1bmN0b3JfRURJVE9SIH0gZnJvbSAnLi4vdXRpbHMvbWlzYyc7XHJcbmltcG9ydCB7IEVESVRPUiwgU1VQUE9SVF9KSVQsIERFViwgVEVTVCB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBlcnJvciwgYXNzZXJ0IH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5jb25zdCBmYXN0UmVtb3ZlQXQgPSBhcnJheS5mYXN0UmVtb3ZlQXQ7XHJcblxyXG4vLyBAdHMtaWdub3JlXHJcbmNvbnN0IElzU3RhcnRDYWxsZWQgPSBDQ09iamVjdC5GbGFncy5Jc1N0YXJ0Q2FsbGVkO1xyXG4vLyBAdHMtaWdub3JlXHJcbmNvbnN0IElzT25FbmFibGVDYWxsZWQgPSBDQ09iamVjdC5GbGFncy5Jc09uRW5hYmxlQ2FsbGVkO1xyXG4vLyBAdHMtaWdub3JlXHJcbmNvbnN0IElzRWRpdG9yT25FbmFibGVDYWxsZWQgPSBDQ09iamVjdC5GbGFncy5Jc0VkaXRvck9uRW5hYmxlQ2FsbGVkO1xyXG5cclxuY29uc3QgY2FsbGVyRnVuY3RvcjogYW55ID0gRURJVE9SICYmIHRyeUNhdGNoRnVuY3Rvcl9FRElUT1I7XHJcbmNvbnN0IGNhbGxPbkVuYWJsZUluVHJ5Q2F0Y2ggPSBFRElUT1IgJiYgY2FsbGVyRnVuY3Rvcignb25FbmFibGUnKTtcclxuY29uc3QgY2FsbE9uRGlzYWJsZUluVHJ5Q2F0Y2ggPSBFRElUT1IgJiYgY2FsbGVyRnVuY3Rvcignb25EaXNhYmxlJyk7XHJcblxyXG5mdW5jdGlvbiBzb3J0ZWRJbmRleCAoYXJyYXksIGNvbXApIHtcclxuICAgIGNvbnN0IG9yZGVyID0gY29tcC5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXI7XHJcbiAgICBjb25zdCBpZCA9IGNvbXAuX2lkO1xyXG4gICAgbGV0IGwgPSAwO1xyXG4gICAgZm9yIChsZXQgaCA9IGFycmF5Lmxlbmd0aCAtIDEsIG0gPSBoID4+PiAxO1xyXG4gICAgICAgICBsIDw9IGg7XHJcbiAgICAgICAgIG0gPSAobCArIGgpID4+PiAxXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCB0ZXN0ID0gYXJyYXlbbV07XHJcbiAgICAgICAgY29uc3QgdGVzdE9yZGVyID0gdGVzdC5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXI7XHJcbiAgICAgICAgaWYgKHRlc3RPcmRlciA+IG9yZGVyKSB7XHJcbiAgICAgICAgICAgIGggPSBtIC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGVzdE9yZGVyIDwgb3JkZXIpIHtcclxuICAgICAgICAgICAgbCA9IG0gKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdGVzdElkID0gdGVzdC5faWQ7XHJcbiAgICAgICAgICAgIGlmICh0ZXN0SWQgPiBpZCkge1xyXG4gICAgICAgICAgICAgICAgaCA9IG0gLSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRlc3RJZCA8IGlkKSB7XHJcbiAgICAgICAgICAgICAgICBsID0gbSArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB+bDtcclxufVxyXG5cclxuLy8gcmVtb3ZlIGRpc2FibGVkIGFuZCBub3QgaW52b2tlZCBjb21wb25lbnQgZnJvbSBhcnJheVxyXG5mdW5jdGlvbiBzdGFibGVSZW1vdmVJbmFjdGl2ZSAoaXRlcmF0b3IsIGZsYWdUb0NsZWFyKSB7XHJcbiAgICBjb25zdCBhcnJheSA9IGl0ZXJhdG9yLmFycmF5O1xyXG4gICAgbGV0IG5leHQgPSBpdGVyYXRvci5pICsgMTtcclxuICAgIHdoaWxlIChuZXh0IDwgYXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3QgY29tcCA9IGFycmF5W25leHRdO1xyXG4gICAgICAgIGlmIChjb21wLl9lbmFibGVkICYmIGNvbXAubm9kZS5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgKytuZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaXRlcmF0b3IucmVtb3ZlQXQobmV4dCk7XHJcbiAgICAgICAgICAgIGlmIChmbGFnVG9DbGVhcikge1xyXG4gICAgICAgICAgICAgICAgY29tcC5fb2JqRmxhZ3MgJj0gfmZsYWdUb0NsZWFyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBUaGlzIGNsYXNzIGNvbnRhaW5zIHNvbWUgcXVldWVzIHVzZWQgdG8gaW52b2tlIGxpZmUtY3ljbGUgbWV0aG9kcyBieSBzY3JpcHQgZXhlY3V0aW9uIG9yZGVyXHJcbmV4cG9ydCBjbGFzcyBMaWZlQ3ljbGVJbnZva2VyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgc3RhYmxlUmVtb3ZlSW5hY3RpdmUgPSBzdGFibGVSZW1vdmVJbmFjdGl2ZTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3plcm86IE11dGFibGVGb3J3YXJkSXRlcmF0b3I8YW55PjtcclxuICAgIHByb3RlY3RlZCBfbmVnOiBNdXRhYmxlRm9yd2FyZEl0ZXJhdG9yPGFueT47XHJcbiAgICBwcm90ZWN0ZWQgX3BvczogTXV0YWJsZUZvcndhcmRJdGVyYXRvcjxhbnk+O1xyXG4gICAgcHJvdGVjdGVkIF9pbnZva2U6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yIChpbnZva2VGdW5jKSB7XHJcbiAgICAgICAgY29uc3QgSXRlcmF0b3IgPSBNdXRhYmxlRm9yd2FyZEl0ZXJhdG9yO1xyXG4gICAgICAgIC8vIGNvbXBvbmVudHMgd2hpY2ggcHJpb3JpdHkgPT09IDAgKGRlZmF1bHQpXHJcbiAgICAgICAgdGhpcy5femVybyA9IG5ldyBJdGVyYXRvcihbXSk7XHJcbiAgICAgICAgLy8gY29tcG9uZW50cyB3aGljaCBwcmlvcml0eSA8IDBcclxuICAgICAgICB0aGlzLl9uZWcgPSBuZXcgSXRlcmF0b3IoW10pO1xyXG4gICAgICAgIC8vIGNvbXBvbmVudHMgd2hpY2ggcHJpb3JpdHkgPiAwXHJcbiAgICAgICAgdGhpcy5fcG9zID0gbmV3IEl0ZXJhdG9yKFtdKTtcclxuXHJcbiAgICAgICAgaWYgKFRFU1QpIHtcclxuICAgICAgICAgICAgYXNzZXJ0KHR5cGVvZiBpbnZva2VGdW5jID09PSAnZnVuY3Rpb24nLCAnaW52b2tlRnVuYyBtdXN0IGJlIHR5cGUgZnVuY3Rpb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faW52b2tlID0gaW52b2tlRnVuYztcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY29tcGFyZU9yZGVyIChhLCBiKSB7XHJcbiAgICByZXR1cm4gYS5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXIgLSBiLmNvbnN0cnVjdG9yLl9leGVjdXRpb25PcmRlcjtcclxufVxyXG5cclxuLy8gZm9yIG9uTG9hZDogc29ydCBvbmNlIGFsbCBjb21wb25lbnRzIHJlZ2lzdGVyZWQsIGludm9rZSBvbmNlXHJcbmV4cG9ydCBjbGFzcyBPbmVPZmZJbnZva2VyIGV4dGVuZHMgTGlmZUN5Y2xlSW52b2tlciB7XHJcbiAgICBwdWJsaWMgYWRkIChjb21wKSB7XHJcbiAgICAgICAgY29uc3Qgb3JkZXIgPSBjb21wLmNvbnN0cnVjdG9yLl9leGVjdXRpb25PcmRlcjtcclxuICAgICAgICAob3JkZXIgPT09IDAgPyB0aGlzLl96ZXJvIDogKG9yZGVyIDwgMCA/IHRoaXMuX25lZyA6IHRoaXMuX3BvcykpLmFycmF5LnB1c2goY29tcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZSAoY29tcCkge1xyXG4gICAgICAgIGNvbnN0IG9yZGVyID0gY29tcC5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXI7XHJcbiAgICAgICAgKG9yZGVyID09PSAwID8gdGhpcy5femVybyA6IChvcmRlciA8IDAgPyB0aGlzLl9uZWcgOiB0aGlzLl9wb3MpKS5mYXN0UmVtb3ZlKGNvbXApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjYW5jZWxJbmFjdGl2ZSAoZmxhZ1RvQ2xlYXIpIHtcclxuICAgICAgICBzdGFibGVSZW1vdmVJbmFjdGl2ZSh0aGlzLl96ZXJvLCBmbGFnVG9DbGVhcik7XHJcbiAgICAgICAgc3RhYmxlUmVtb3ZlSW5hY3RpdmUodGhpcy5fbmVnLCBmbGFnVG9DbGVhcik7XHJcbiAgICAgICAgc3RhYmxlUmVtb3ZlSW5hY3RpdmUodGhpcy5fcG9zLCBmbGFnVG9DbGVhcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGludm9rZSAoKSB7XHJcbiAgICAgICAgY29uc3QgY29tcHNOZWcgPSB0aGlzLl9uZWc7XHJcbiAgICAgICAgaWYgKGNvbXBzTmVnLmFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29tcHNOZWcuYXJyYXkuc29ydChjb21wYXJlT3JkZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbnZva2UoY29tcHNOZWcpO1xyXG4gICAgICAgICAgICBjb21wc05lZy5hcnJheS5sZW5ndGggPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faW52b2tlKHRoaXMuX3plcm8pO1xyXG4gICAgICAgIHRoaXMuX3plcm8uYXJyYXkubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgY29uc3QgY29tcHNQb3MgPSB0aGlzLl9wb3M7XHJcbiAgICAgICAgaWYgKGNvbXBzUG9zLmFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29tcHNQb3MuYXJyYXkuc29ydChjb21wYXJlT3JkZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbnZva2UoY29tcHNQb3MpO1xyXG4gICAgICAgICAgICBjb21wc1Bvcy5hcnJheS5sZW5ndGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8gZm9yIHVwZGF0ZTogc29ydCBldmVyeSB0aW1lIG5ldyBjb21wb25lbnQgcmVnaXN0ZXJlZCwgaW52b2tlIG1hbnkgdGltZXNcclxuY2xhc3MgUmV1c2FibGVJbnZva2VyIGV4dGVuZHMgTGlmZUN5Y2xlSW52b2tlciB7XHJcbiAgICBwdWJsaWMgYWRkIChjb21wKSB7XHJcbiAgICAgICAgY29uc3Qgb3JkZXIgPSBjb21wLmNvbnN0cnVjdG9yLl9leGVjdXRpb25PcmRlcjtcclxuICAgICAgICBpZiAob3JkZXIgPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5femVyby5hcnJheS5wdXNoKGNvbXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYXJyYXkgPSBvcmRlciA8IDAgPyB0aGlzLl9uZWcuYXJyYXkgOiB0aGlzLl9wb3MuYXJyYXk7XHJcbiAgICAgICAgICAgIGNvbnN0IGkgPSBzb3J0ZWRJbmRleChhcnJheSwgY29tcCk7XHJcbiAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXkuc3BsaWNlKH5pLCAwLCBjb21wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChERVYpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yKCdjb21wb25lbnQgYWxyZWFkeSBhZGRlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUgKGNvbXApIHtcclxuICAgICAgICBjb25zdCBvcmRlciA9IGNvbXAuY29uc3RydWN0b3IuX2V4ZWN1dGlvbk9yZGVyO1xyXG4gICAgICAgIGlmIChvcmRlciA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl96ZXJvLmZhc3RSZW1vdmUoY29tcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVyYXRvciA9IG9yZGVyIDwgMCA/IHRoaXMuX25lZyA6IHRoaXMuX3BvcztcclxuICAgICAgICAgICAgY29uc3QgaSA9IHNvcnRlZEluZGV4KGl0ZXJhdG9yLmFycmF5LCBjb21wKTtcclxuICAgICAgICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgaXRlcmF0b3IucmVtb3ZlQXQoaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGludm9rZSAoZHQpIHtcclxuICAgICAgICBpZiAodGhpcy5fbmVnLmFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5faW52b2tlKHRoaXMuX25lZywgZHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faW52b2tlKHRoaXMuX3plcm8sIGR0KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3Bvcy5hcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ludm9rZSh0aGlzLl9wb3MsIGR0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVuYWJsZUluRWRpdG9yIChjb21wKSB7XHJcbiAgICBpZiAoIShjb21wLl9vYmpGbGFncyAmIElzRWRpdG9yT25FbmFibGVDYWxsZWQpKSB7XHJcbiAgICAgICAgbGVnYWN5Q0MuZW5naW5lLmVtaXQoJ2NvbXBvbmVudC1lbmFibGVkJywgY29tcC51dWlkKTtcclxuICAgICAgICBpZighbGVnYWN5Q0MuR0FNRV9WSUVXKSB7XHJcbiAgICAgICAgICAgIGNvbXAuX29iakZsYWdzIHw9IElzRWRpdG9yT25FbmFibGVDYWxsZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyByZXR1cm4gZnVuY3Rpb24gdG8gc2ltcGx5IGNhbGwgZWFjaCBjb21wb25lbnQgd2l0aCB0cnkgY2F0Y2ggcHJvdGVjdGlvblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW52b2tlSW1wbEppdCAoY29kZTogc3RyaW5nLCB1c2VEdD8sIGVuc3VyZUZsYWc/KSB7XHJcbiAgICAvLyBmdW5jdGlvbiAoaXQpIHtcclxuICAgIC8vICAgICBsZXQgYSA9IGl0LmFycmF5O1xyXG4gICAgLy8gICAgIGZvciAoaXQuaSA9IDA7IGl0LmkgPCBhLmxlbmd0aDsgKytpdC5pKSB7XHJcbiAgICAvLyAgICAgICAgIGxldCBjID0gYVtpdC5pXTtcclxuICAgIC8vICAgICAgICAgLy8gLi4uXHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgY29uc3QgYm9keSA9ICd2YXIgYT1pdC5hcnJheTsnICtcclxuICAgICAgICAgICAgICAgICdmb3IoaXQuaT0wO2l0Lmk8YS5sZW5ndGg7KytpdC5pKXsnICtcclxuICAgICAgICAgICAgICAgICd2YXIgYz1hW2l0LmldOycgK1xyXG4gICAgICAgICAgICAgICAgY29kZSArXHJcbiAgICAgICAgICAgICAgICAnfSc7XHJcbiAgICBsZXQgZmFzdFBhdGggPSB1c2VEdCA/IEZ1bmN0aW9uKCdpdCcsICdkdCcsIGJvZHkpIDogRnVuY3Rpb24oJ2l0JywgYm9keSk7XHJcbiAgICBsZXQgc2luZ2xlSW52b2tlID0gRnVuY3Rpb24oJ2MnLCAnZHQnLCBjb2RlKTtcclxuICAgIHJldHVybiBjcmVhdGVJbnZva2VJbXBsKHNpbmdsZUludm9rZSwgZmFzdFBhdGgsIGVuc3VyZUZsYWcpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJbnZva2VJbXBsIChzaW5nbGVJbnZva2UsIGZhc3RQYXRoLCBlbnN1cmVGbGFnPykge1xyXG4gICAgcmV0dXJuIChpdGVyYXRvciwgZHQpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBmYXN0UGF0aChpdGVyYXRvciwgZHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAvLyBzbG93IHBhdGhcclxuICAgICAgICAgICAgbGVnYWN5Q0MuX3Rocm93KGUpO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBpdGVyYXRvci5hcnJheTtcclxuICAgICAgICAgICAgaWYgKGVuc3VyZUZsYWcpIHtcclxuICAgICAgICAgICAgICAgIGFycmF5W2l0ZXJhdG9yLmldLl9vYmpGbGFncyB8PSBlbnN1cmVGbGFnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICsraXRlcmF0b3IuaTsgICAvLyBpbnZva2UgbmV4dCBjYWxsYmFja1xyXG4gICAgICAgICAgICBmb3IgKDsgaXRlcmF0b3IuaSA8IGFycmF5Lmxlbmd0aDsgKytpdGVyYXRvci5pKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZUludm9rZShhcnJheVtpdGVyYXRvci5pXSwgZHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZWdhY3lDQy5fdGhyb3coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuc3VyZUZsYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlbaXRlcmF0b3IuaV0uX29iakZsYWdzIHw9IGVuc3VyZUZsYWc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3QgaW52b2tlU3RhcnQgPSBTVVBQT1JUX0pJVCA/IGNyZWF0ZUludm9rZUltcGxKaXQoJ2Muc3RhcnQoKTtjLl9vYmpGbGFnc3w9JyArIElzU3RhcnRDYWxsZWQsIGZhbHNlLCBJc1N0YXJ0Q2FsbGVkKSA6XHJcbiAgICBjcmVhdGVJbnZva2VJbXBsKFxyXG4gICAgICAgIGZ1bmN0aW9uIChjKSB7XHJcbiAgICAgICAgICAgIGMuc3RhcnQoKTtcclxuICAgICAgICAgICAgYy5fb2JqRmxhZ3MgfD0gSXNTdGFydENhbGxlZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChpdGVyYXRvcikge1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBpdGVyYXRvci5hcnJheTtcclxuICAgICAgICAgICAgZm9yIChpdGVyYXRvci5pID0gMDsgaXRlcmF0b3IuaSA8IGFycmF5Lmxlbmd0aDsgKytpdGVyYXRvci5pKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29tcCA9IGFycmF5W2l0ZXJhdG9yLmldO1xyXG4gICAgICAgICAgICAgICAgY29tcC5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgY29tcC5fb2JqRmxhZ3MgfD0gSXNTdGFydENhbGxlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgSXNTdGFydENhbGxlZFxyXG4gICAgKTtcclxuXHJcbmNvbnN0IGludm9rZVVwZGF0ZSA9IFNVUFBPUlRfSklUID8gY3JlYXRlSW52b2tlSW1wbEppdCgnYy51cGRhdGUoZHQpJywgdHJ1ZSkgOlxyXG4gICAgY3JlYXRlSW52b2tlSW1wbChcclxuICAgICAgICBmdW5jdGlvbiAoYywgZHQpIHtcclxuICAgICAgICAgICAgYy51cGRhdGUoZHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKGl0ZXJhdG9yLCBkdCkge1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBpdGVyYXRvci5hcnJheTtcclxuICAgICAgICAgICAgZm9yIChpdGVyYXRvci5pID0gMDsgaXRlcmF0b3IuaSA8IGFycmF5Lmxlbmd0aDsgKytpdGVyYXRvci5pKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVtpdGVyYXRvci5pXS51cGRhdGUoZHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbmNvbnN0IGludm9rZUxhdGVVcGRhdGUgPSBTVVBQT1JUX0pJVCA/IGNyZWF0ZUludm9rZUltcGxKaXQoJ2MubGF0ZVVwZGF0ZShkdCknLCB0cnVlKSA6XHJcbiAgICBjcmVhdGVJbnZva2VJbXBsKFxyXG4gICAgICAgIGZ1bmN0aW9uIChjLCBkdCkge1xyXG4gICAgICAgICAgICBjLmxhdGVVcGRhdGUoZHQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKGl0ZXJhdG9yLCBkdCkge1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBpdGVyYXRvci5hcnJheTtcclxuICAgICAgICAgICAgZm9yIChpdGVyYXRvci5pID0gMDsgaXRlcmF0b3IuaSA8IGFycmF5Lmxlbmd0aDsgKytpdGVyYXRvci5pKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVtpdGVyYXRvci5pXS5sYXRlVXBkYXRlKGR0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG5leHBvcnQgY29uc3QgaW52b2tlT25FbmFibGUgPSBFRElUT1IgPyAoaXRlcmF0b3IpID0+IHtcclxuICAgIGNvbnN0IGNvbXBTY2hlZHVsZXIgPSBsZWdhY3lDQy5kaXJlY3Rvci5fY29tcFNjaGVkdWxlcjtcclxuICAgIGNvbnN0IGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XHJcbiAgICBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcclxuICAgICAgICBjb25zdCBjb21wID0gYXJyYXlbaXRlcmF0b3IuaV07XHJcbiAgICAgICAgaWYgKGNvbXAuX2VuYWJsZWQpIHtcclxuICAgICAgICAgICAgY2FsbE9uRW5hYmxlSW5UcnlDYXRjaChjb21wKTtcclxuICAgICAgICAgICAgY29uc3QgZGVhY3RpdmF0ZWREdXJpbmdPbkVuYWJsZSA9ICFjb21wLm5vZGUuX2FjdGl2ZUluSGllcmFyY2h5O1xyXG4gICAgICAgICAgICBpZiAoIWRlYWN0aXZhdGVkRHVyaW5nT25FbmFibGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBTY2hlZHVsZXIuX29uRW5hYmxlZChjb21wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSA6IChpdGVyYXRvcikgPT4ge1xyXG4gICAgY29uc3QgY29tcFNjaGVkdWxlciA9IGxlZ2FjeUNDLmRpcmVjdG9yLl9jb21wU2NoZWR1bGVyO1xyXG4gICAgY29uc3QgYXJyYXkgPSBpdGVyYXRvci5hcnJheTtcclxuICAgIGZvciAoaXRlcmF0b3IuaSA9IDA7IGl0ZXJhdG9yLmkgPCBhcnJheS5sZW5ndGg7ICsraXRlcmF0b3IuaSkge1xyXG4gICAgICAgIGNvbnN0IGNvbXAgPSBhcnJheVtpdGVyYXRvci5pXTtcclxuICAgICAgICBpZiAoY29tcC5fZW5hYmxlZCkge1xyXG4gICAgICAgICAgICBjb21wLm9uRW5hYmxlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlYWN0aXZhdGVkRHVyaW5nT25FbmFibGUgPSAhY29tcC5ub2RlLl9hY3RpdmVJbkhpZXJhcmNoeTtcclxuICAgICAgICAgICAgaWYgKCFkZWFjdGl2YXRlZER1cmluZ09uRW5hYmxlKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wU2NoZWR1bGVyLl9vbkVuYWJsZWQoY29tcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQGVuIFRoZSBNYW5hZ2VyIGZvciBDb21wb25lbnQncyBsaWZlLWN5Y2xlIG1ldGhvZHMuXHJcbiAqIEl0IGNvbGxhYm9yYXRlcyB3aXRoIFtbTm9kZUFjdGl2YXRvcl1dIHRvIHNjaGVkdWxlIGFuZCBpbnZva2UgbGlmZSBjeWNsZSBtZXRob2RzIGZvciBjb21wb25lbnRzXHJcbiAqIEB6aCDnu4Tku7bnlJ/lkb3lkajmnJ/lh73mlbDnmoTosIPluqblmajjgIJcclxuICog5a6D5ZKMIFtbTm9kZUFjdGl2YXRvcl1dIOS4gOi1t+iwg+W6puW5tuaJp+ihjOe7hOS7tueahOeUn+WRveWRqOacn+WHveaVsOOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudFNjaGVkdWxlciB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgaW52b2tlciBvZiBgc3RhcnRgIGNhbGxiYWNrXHJcbiAgICAgKiBAemggYHN0YXJ0YCDlm57osIPnmoTosIPluqblmahcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXJ0SW52b2tlciE6IE9uZU9mZkludm9rZXI7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgaW52b2tlciBvZiBgdXBkYXRlYCBjYWxsYmFja1xyXG4gICAgICogQHpoIGB1cGRhdGVgIOWbnuiwg+eahOiwg+W6puWZqFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXBkYXRlSW52b2tlciE6IFJldXNhYmxlSW52b2tlcjtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBpbnZva2VyIG9mIGBsYXRlVXBkYXRlYCBjYWxsYmFja1xyXG4gICAgICogQHpoIGBsYXRlVXBkYXRlYCDlm57osIPnmoTosIPluqblmahcclxuICAgICAqL1xyXG4gICAgcHVibGljIGxhdGVVcGRhdGVJbnZva2VyITogUmV1c2FibGVJbnZva2VyO1xyXG4gICAgLy8gY29tcG9uZW50cyBkZWZlcnJlZCB0byBzY2hlZHVsZVxyXG4gICAgcHJpdmF0ZSBfZGVmZXJyZWRDb21wczogYW55W10gPSBbXTtcclxuICAgIHByaXZhdGUgX3VwZGF0aW5nITogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlQWxsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ2FuY2VsIGFsbCBmdXR1cmUgY2FsbGJhY2tzLCBpbmNsdWRpbmcgYHN0YXJ0YCwgYHVwZGF0ZWAgYW5kIGBsYXRlVXBkYXRlYFxyXG4gICAgICogQHpoIOWPlua2iOaJgOacieacquadpeeahOWHveaVsOiwg+W6pu+8jOWMheaLrCBgc3RhcnRg77yMYHVwZGF0ZWAg5ZKMIGBsYXRlVXBkYXRlYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdW5zY2hlZHVsZUFsbCAoKSB7XHJcbiAgICAgICAgLy8gaW52b2tlcnNcclxuICAgICAgICB0aGlzLnN0YXJ0SW52b2tlciA9IG5ldyBPbmVPZmZJbnZva2VyKGludm9rZVN0YXJ0KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUludm9rZXIgPSBuZXcgUmV1c2FibGVJbnZva2VyKGludm9rZVVwZGF0ZSk7XHJcbiAgICAgICAgdGhpcy5sYXRlVXBkYXRlSW52b2tlciA9IG5ldyBSZXVzYWJsZUludm9rZXIoaW52b2tlTGF0ZVVwZGF0ZSk7XHJcblxyXG4gICAgICAgIC8vIGR1cmluZyBhIGxvb3BcclxuICAgICAgICB0aGlzLl91cGRhdGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfb25FbmFibGVkIChjb21wKSB7XHJcbiAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkucmVzdW1lVGFyZ2V0KGNvbXApO1xyXG4gICAgICAgIGNvbXAuX29iakZsYWdzIHw9IElzT25FbmFibGVDYWxsZWQ7XHJcblxyXG4gICAgICAgIC8vIHNjaGVkdWxlXHJcbiAgICAgICAgaWYgKHRoaXMuX3VwZGF0aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmVycmVkQ29tcHMucHVzaChjb21wKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlSW1tZWRpYXRlKGNvbXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29uRGlzYWJsZWQgKGNvbXApIHtcclxuICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS5wYXVzZVRhcmdldChjb21wKTtcclxuICAgICAgICBjb21wLl9vYmpGbGFncyAmPSB+SXNPbkVuYWJsZUNhbGxlZDtcclxuXHJcbiAgICAgICAgLy8gY2FuY2VsIHNjaGVkdWxlIHRhc2tcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2RlZmVycmVkQ29tcHMuaW5kZXhPZihjb21wKTtcclxuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICBmYXN0UmVtb3ZlQXQodGhpcy5fZGVmZXJyZWRDb21wcywgaW5kZXgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1bnNjaGVkdWxlXHJcbiAgICAgICAgaWYgKGNvbXAuc3RhcnQgJiYgIShjb21wLl9vYmpGbGFncyAmIElzU3RhcnRDYWxsZWQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLnJlbW92ZShjb21wKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXAudXBkYXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW52b2tlci5yZW1vdmUoY29tcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wLmxhdGVVcGRhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5sYXRlVXBkYXRlSW52b2tlci5yZW1vdmUoY29tcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEVuYWJsZSBhIGNvbXBvbmVudFxyXG4gICAgICogQHpoIOWQr+eUqOS4gOS4que7hOS7tlxyXG4gICAgICogQHBhcmFtIGNvbXAgVGhlIGNvbXBvbmVudCB0byBiZSBlbmFibGVkXHJcbiAgICAgKiBAcGFyYW0gaW52b2tlciBUaGUgaW52b2tlciB3aGljaCBpcyByZXNwb25zaWJsZSB0byBzY2hlZHVsZSB0aGUgYG9uRW5hYmxlYCBjYWxsXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbmFibGVDb21wIChjb21wLCBpbnZva2VyPykge1xyXG4gICAgICAgIGlmICghKGNvbXAuX29iakZsYWdzICYgSXNPbkVuYWJsZUNhbGxlZCkpIHtcclxuICAgICAgICAgICAgaWYgKGNvbXAub25FbmFibGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbnZva2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW52b2tlci5hZGQoY29tcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcC5vbkVuYWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWFjdGl2YXRlZER1cmluZ09uRW5hYmxlID0gIWNvbXAubm9kZS5fYWN0aXZlSW5IaWVyYXJjaHk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlYWN0aXZhdGVkRHVyaW5nT25FbmFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9vbkVuYWJsZWQoY29tcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIERpc2FibGUgYSBjb21wb25lbnRcclxuICAgICAqIEB6aCDnpoHnlKjkuIDkuKrnu4Tku7ZcclxuICAgICAqIEBwYXJhbSBjb21wIFRoZSBjb21wb25lbnQgdG8gYmUgZGlzYWJsZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRpc2FibGVDb21wIChjb21wKSB7XHJcbiAgICAgICAgaWYgKGNvbXAuX29iakZsYWdzICYgSXNPbkVuYWJsZUNhbGxlZCkge1xyXG4gICAgICAgICAgICBpZiAoY29tcC5vbkRpc2FibGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbXAub25EaXNhYmxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fb25EaXNhYmxlZChjb21wKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUHJvY2VzcyBzdGFydCBwaGFzZSBmb3IgcmVnaXN0ZXJlZCBjb21wb25lbnRzXHJcbiAgICAgKiBAemgg5Li65b2T5YmN5rOo5YaM55qE57uE5Lu25omn6KGMIHN0YXJ0IOmYtuauteS7u+WKoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhcnRQaGFzZSAoKSB7XHJcbiAgICAgICAgLy8gU3RhcnQgb2YgdGhpcyBmcmFtZVxyXG4gICAgICAgIHRoaXMuX3VwZGF0aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8gY2FsbCBzdGFydFxyXG4gICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLmludm9rZSgpO1xyXG4gICAgICAgIC8vIFN0YXJ0IGNvbXBvbmVudHMgb2YgbmV3IGFjdGl2YXRlZCBub2RlcyBkdXJpbmcgc3RhcnRcclxuICAgICAgICB0aGlzLl9zdGFydEZvck5ld0NvbXBzKCk7XHJcbiAgICAgICAgLy8gaWYgKFBSRVZJRVcpIHtcclxuICAgICAgICAvLyAgICAgdHJ5IHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLmludm9rZSgpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAvLyBwcmV2ZW50IHN0YXJ0IGZyb20gZ2V0dGluZyBpbnRvIGluZmluaXRlIGxvb3BcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLl9uZWcuYXJyYXkubGVuZ3RoID0gMDtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLl96ZXJvLmFycmF5Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnN0YXJ0SW52b2tlci5fcG9zLmFycmF5Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgLy8gICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIGVsc2Uge1xyXG4gICAgICAgIC8vICAgICB0aGlzLnN0YXJ0SW52b2tlci5pbnZva2UoKTtcclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUHJvY2VzcyB1cGRhdGUgcGhhc2UgZm9yIHJlZ2lzdGVyZWQgY29tcG9uZW50c1xyXG4gICAgICogQHpoIOS4uuW9k+WJjeazqOWGjOeahOe7hOS7tuaJp+ihjCB1cGRhdGUg6Zi25q615Lu75YqhXHJcbiAgICAgKiBAcGFyYW0gZHQg6Led56a75LiK5LiA5bin55qE5pe26Ze0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1cGRhdGVQaGFzZSAoZHQ6bnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVJbnZva2VyLmludm9rZShkdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUHJvY2VzcyBsYXRlIHVwZGF0ZSBwaGFzZSBmb3IgcmVnaXN0ZXJlZCBjb21wb25lbnRzXHJcbiAgICAgKiBAemgg5Li65b2T5YmN5rOo5YaM55qE57uE5Lu25omn6KGMIGxhdGUgdXBkYXRlIOmYtuauteS7u+WKoVxyXG4gICAgICogQHBhcmFtIGR0IOi3neemu+S4iuS4gOW4p+eahOaXtumXtFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbGF0ZVVwZGF0ZVBoYXNlIChkdDpudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmxhdGVVcGRhdGVJbnZva2VyLmludm9rZShkdCk7XHJcblxyXG4gICAgICAgIC8vIEVuZCBvZiB0aGlzIGZyYW1lXHJcbiAgICAgICAgdGhpcy5fdXBkYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gU3RhcnQgY29tcG9uZW50cyBvZiBuZXcgYWN0aXZhdGVkIG5vZGVzIGR1cmluZyB1cGRhdGUgYW5kIGxhdGVVcGRhdGVcclxuICAgICAgICAvLyBUaGV5IHdpbGwgYmUgcnVubmluZyBpbiB0aGUgbmV4dCBmcmFtZVxyXG4gICAgICAgIHRoaXMuX3N0YXJ0Rm9yTmV3Q29tcHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsIG5ldyByZWdpc3RlcmVkIHN0YXJ0IHNjaGVkdWxlIGltbWVkaWF0ZWx5IHNpbmNlIGxhc3QgdGltZSBzdGFydCBwaGFzZSBjYWxsaW5nIGluIHRoaXMgZnJhbWVcclxuICAgIC8vIFNlZSBjb2Nvcy1jcmVhdG9yLzJkLXRhc2tzL2lzc3Vlcy8yNTZcclxuICAgIHByaXZhdGUgX3N0YXJ0Rm9yTmV3Q29tcHMgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9kZWZlcnJlZENvbXBzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVmZXJyZWRTY2hlZHVsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0SW52b2tlci5pbnZva2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2NoZWR1bGVJbW1lZGlhdGUgKGNvbXApIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNvbXAuc3RhcnQgPT09ICdmdW5jdGlvbicgJiYgIShjb21wLl9vYmpGbGFncyAmIElzU3RhcnRDYWxsZWQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLmFkZChjb21wKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb21wLnVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUludm9rZXIuYWRkKGNvbXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIGNvbXAubGF0ZVVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzLmxhdGVVcGRhdGVJbnZva2VyLmFkZChjb21wKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZGVmZXJyZWRTY2hlZHVsZSAoKSB7XHJcbiAgICAgICAgY29uc3QgY29tcHMgPSB0aGlzLl9kZWZlcnJlZENvbXBzO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjb21wcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZUltbWVkaWF0ZShjb21wc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmIChFRElUT1IpIHtcclxuICAgIENvbXBvbmVudFNjaGVkdWxlci5wcm90b3R5cGUuZW5hYmxlQ29tcCA9IGZ1bmN0aW9uIChjb21wLCBpbnZva2VyKSB7XHJcbiAgICAgICAgaWYgKGxlZ2FjeUNDLkdBTUVfVklFVyB8fCBjb21wLmNvbnN0cnVjdG9yLl9leGVjdXRlSW5FZGl0TW9kZSkge1xyXG4gICAgICAgICAgICBpZiAoIShjb21wLl9vYmpGbGFncyAmIElzT25FbmFibGVDYWxsZWQpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5vbkVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnZva2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludm9rZXIuYWRkKGNvbXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVJbkVkaXRvcihjb21wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbE9uRW5hYmxlSW5UcnlDYXRjaChjb21wKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlYWN0aXZhdGVkRHVyaW5nT25FbmFibGUgPSAhY29tcC5ub2RlLl9hY3RpdmVJbkhpZXJhcmNoeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlYWN0aXZhdGVkRHVyaW5nT25FbmFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX29uRW5hYmxlZChjb21wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbmFibGVJbkVkaXRvcihjb21wKTtcclxuICAgIH07XHJcblxyXG4gICAgQ29tcG9uZW50U2NoZWR1bGVyLnByb3RvdHlwZS5kaXNhYmxlQ29tcCA9IGZ1bmN0aW9uIChjb21wKSB7XHJcbiAgICAgICAgaWYgKGxlZ2FjeUNDLkdBTUVfVklFVyB8fCBjb21wLmNvbnN0cnVjdG9yLl9leGVjdXRlSW5FZGl0TW9kZSkge1xyXG4gICAgICAgICAgICBpZiAoY29tcC5fb2JqRmxhZ3MgJiBJc09uRW5hYmxlQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5vbkRpc2FibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsT25EaXNhYmxlSW5UcnlDYXRjaChjb21wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX29uRGlzYWJsZWQoY29tcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXAuX29iakZsYWdzICYgSXNFZGl0b3JPbkVuYWJsZUNhbGxlZCkge1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5lbmdpbmUuZW1pdCgnY29tcG9uZW50LWRpc2FibGVkJywgY29tcC51dWlkKTtcclxuICAgICAgICAgICAgY29tcC5fb2JqRmxhZ3MgJj0gfklzRWRpdG9yT25FbmFibGVDYWxsZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4iXX0=