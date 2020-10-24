(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/object.js", "../utils/js.js", "../utils/misc.js", "./component-scheduler.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/object.js"), require("../utils/js.js"), require("../utils/misc.js"), require("./component-scheduler.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.object, global.js, global.misc, global.componentScheduler, global.defaultConstants, global.globalExports, global.debug);
    global.nodeActivator = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _object, _js, _misc, _componentScheduler, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var MAX_POOL_SIZE = 4; // @ts-ignore

  var IsPreloadStarted = _object.CCObject.Flags.IsPreloadStarted; // @ts-ignore

  var IsOnLoadStarted = _object.CCObject.Flags.IsOnLoadStarted; // @ts-ignore

  var IsOnLoadCalled = _object.CCObject.Flags.IsOnLoadCalled; // @ts-ignore

  var Deactivating = _object.CCObject.Flags.Deactivating;
  var callPreloadInTryCatch = _defaultConstants.EDITOR && (0, _misc.tryCatchFunctor_EDITOR)('__preload');

  var callOnLoadInTryCatch = _defaultConstants.EDITOR && function (c) {
    try {
      c.onLoad();
    } catch (e) {
      _globalExports.legacyCC._throw(e);
    }

    c._objFlags |= IsOnLoadCalled;

    _onLoadInEditor(c);
  };

  var callOnDestroyInTryCatch = _defaultConstants.EDITOR && (0, _misc.tryCatchFunctor_EDITOR)('onDestroy');
  var callResetInTryCatch = _defaultConstants.EDITOR && (0, _misc.tryCatchFunctor_EDITOR)('resetInEditor');
  var callOnFocusInTryCatch = _defaultConstants.EDITOR && (0, _misc.tryCatchFunctor_EDITOR)('onFocusInEditor');
  var callOnLostFocusInTryCatch = _defaultConstants.EDITOR && (0, _misc.tryCatchFunctor_EDITOR)('onLostFocusInEditor'); // for __preload: used internally, no sort

  var UnsortedInvoker = /*#__PURE__*/function (_LifeCycleInvoker) {
    _inherits(UnsortedInvoker, _LifeCycleInvoker);

    function UnsortedInvoker() {
      _classCallCheck(this, UnsortedInvoker);

      return _possibleConstructorReturn(this, _getPrototypeOf(UnsortedInvoker).apply(this, arguments));
    }

    _createClass(UnsortedInvoker, [{
      key: "add",
      value: function add(comp) {
        this._zero.array.push(comp);
      }
    }, {
      key: "remove",
      value: function remove(comp) {
        this._zero.fastRemove(comp);
      }
    }, {
      key: "cancelInactive",
      value: function cancelInactive(flagToClear) {
        _componentScheduler.LifeCycleInvoker.stableRemoveInactive(this._zero, flagToClear);
      }
    }, {
      key: "invoke",
      value: function invoke() {
        this._invoke(this._zero);

        this._zero.array.length = 0;
      }
    }]);

    return UnsortedInvoker;
  }(_componentScheduler.LifeCycleInvoker);

  var invokePreload = _defaultConstants.SUPPORT_JIT ? (0, _componentScheduler.createInvokeImplJit)('c.__preload();') : (0, _componentScheduler.createInvokeImpl)(function (c) {
    c.__preload();
  }, function (iterator) {
    var array = iterator.array;

    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
      array[iterator.i].__preload();
    }
  });
  var invokeOnLoad = _defaultConstants.SUPPORT_JIT ? (0, _componentScheduler.createInvokeImplJit)('c.onLoad();c._objFlags|=' + IsOnLoadCalled, false, IsOnLoadCalled) : (0, _componentScheduler.createInvokeImpl)(function (c) {
    c.onLoad();
    c._objFlags |= IsOnLoadCalled;
  }, function (iterator) {
    var array = iterator.array;

    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
      var comp = array[iterator.i];
      comp.onLoad();
      comp._objFlags |= IsOnLoadCalled;
    }
  }, IsOnLoadCalled);
  var activateTasksPool = new _js.Pool(MAX_POOL_SIZE);

  activateTasksPool.get = function getActivateTask() {
    var task = this._get() || {
      preload: new UnsortedInvoker(invokePreload),
      onLoad: new _componentScheduler.OneOffInvoker(invokeOnLoad),
      onEnable: new _componentScheduler.OneOffInvoker(_componentScheduler.invokeOnEnable)
    }; // reset index to -1 so we can skip invoked component in cancelInactive

    task.preload._zero.i = -1;
    var invoker = task.onLoad;
    invoker._zero.i = -1;
    invoker._neg.i = -1;
    invoker._pos.i = -1;
    invoker = task.onEnable;
    invoker._zero.i = -1;
    invoker._neg.i = -1;
    invoker._pos.i = -1;
    return task;
  };

  function _componentCorrupted(node, comp, index) {
    if (_defaultConstants.DEV) {
      (0, _debug.errorID)(3817, node.name, index);
      console.log('Corrupted component value:', comp);
    }

    if (comp) {
      node._removeComponent(comp);
    } else {
      _js.array.removeAt(node._components, index);
    }
  }

  function _onLoadInEditor(comp) {
    if (comp.onLoad && !_globalExports.legacyCC.GAME_VIEW) {
      // @ts-ignore
      var focused = Editor.Selection.getLastSelected('node') === comp.node.uuid;

      if (focused) {
        if (comp.onFocusInEditor && callOnFocusInTryCatch) {
          callOnFocusInTryCatch(comp);
        }
      } else {
        if (comp.onLostFocusInEditor && callOnLostFocusInTryCatch) {
          callOnLostFocusInTryCatch(comp);
        }
      }
    }

    if (!_defaultConstants.TEST) {
      // @ts-ignore
      _Scene.AssetsWatcher.start(comp);
    }
  }
  /**
   * @en The class used to perform activating and deactivating operations of node and component.
   * @zh 用于执行节点和组件的激活和停用操作的管理器。
   */


  var NodeActivator = /*#__PURE__*/function () {
    function NodeActivator() {
      _classCallCheck(this, NodeActivator);

      this.resetComp = void 0;
      this.reset();
    }
    /**
     * @en Reset all activation or des-activation tasks
     * @zh 重置所有激活或非激活任务
     */


    _createClass(NodeActivator, [{
      key: "reset",
      value: function reset() {
        // a stack of node's activating tasks
        this._activatingStack = [];
      }
      /**
       * @en Activate or des-activate a node
       * @zh 激活或者停用某个节点
       * @param node Target node
       * @param active Which state to set the node to
       */

    }, {
      key: "activateNode",
      value: function activateNode(node, active) {
        if (active) {
          var task = activateTasksPool.get();

          this._activatingStack.push(task);

          this._activateNodeRecursively(node, task.preload, task.onLoad, task.onEnable);

          task.preload.invoke();
          task.onLoad.invoke();
          task.onEnable.invoke();

          this._activatingStack.pop();

          activateTasksPool.put(task);
        } else {
          this._deactivateNodeRecursively(node); // remove children of this node from previous activating tasks to debounce
          // (this is an inefficient operation but it ensures general case could be implemented in a efficient way)


          var stack = this._activatingStack;

          var _iterator = _createForOfIteratorHelper(stack),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var lastTask = _step.value;
              lastTask.preload.cancelInactive(IsPreloadStarted);
              lastTask.onLoad.cancelInactive(IsOnLoadStarted);
              lastTask.onEnable.cancelInactive();
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        node.emit('active-in-hierarchy-changed', node);
      }
      /**
       * @en Activate or des-activate a component
       * @zh 激活或者停用某个组件
       * @param comp Target component
       * @param preloadInvoker The invoker for `_preload` method, normally from [[ComponentScheduler]]
       * @param onLoadInvoker The invoker for `onLoad` method, normally from [[ComponentScheduler]]
       * @param onEnableInvoker The invoker for `onEnable` method, normally from [[ComponentScheduler]]
       */

    }, {
      key: "activateComp",
      value: function activateComp(comp, preloadInvoker, onLoadInvoker, onEnableInvoker) {
        if (!(comp._objFlags & IsPreloadStarted)) {
          comp._objFlags |= IsPreloadStarted;

          if (comp.__preload) {
            if (preloadInvoker) {
              preloadInvoker.add(comp);
            } else {
              comp.__preload();
            }
          }
        }

        if (!(comp._objFlags & IsOnLoadStarted)) {
          comp._objFlags |= IsOnLoadStarted;

          if (comp.onLoad) {
            if (onLoadInvoker) {
              onLoadInvoker.add(comp);
            } else {
              comp.onLoad();
              comp._objFlags |= IsOnLoadCalled;
            }
          } else {
            comp._objFlags |= IsOnLoadCalled;
          }
        }

        if (comp._enabled) {
          var deactivatedOnLoading = !comp.node._activeInHierarchy;

          if (deactivatedOnLoading) {
            return;
          }

          _globalExports.legacyCC.director._compScheduler.enableComp(comp, onEnableInvoker);
        }
      }
      /**
       * @en Destroy a component
       * @zh 销毁一个组件
       * @param comp Target component
       */

    }, {
      key: "destroyComp",
      value: function destroyComp(comp) {
        // ensure onDisable called
        _globalExports.legacyCC.director._compScheduler.disableComp(comp);

        if (comp.onDestroy && comp._objFlags & IsOnLoadCalled) {
          comp.onDestroy();
        }
      }
    }, {
      key: "_activateNodeRecursively",
      value: function _activateNodeRecursively(node, preloadInvoker, onLoadInvoker, onEnableInvoker) {
        if (node._objFlags & Deactivating) {
          // en:
          // Forbid reactive the same node during its deactivating procedure
          // to avoid endless loop and simplify the implementation.
          // zh:
          // 对相同节点而言，无法撤销反激活，防止反激活 - 激活 - 反激活的死循环发生。
          // 这样设计简化了一些引擎的实现，而且对调用者来说能保证反激活操作都能成功。
          (0, _debug.errorID)(3816, node.name);
          return;
        }

        node._activeInHierarchy = true; // component maybe added during onEnable, and the onEnable of new component is already called
        // so we should record the origin length

        var originCount = node._components.length; // activate components

        for (var i = 0; i < originCount; ++i) {
          var component = node._components[i];

          if (component instanceof _globalExports.legacyCC.Component) {
            this.activateComp(component, preloadInvoker, onLoadInvoker, onEnableInvoker);
          } else {
            _componentCorrupted(node, component, i);

            --i;
            --originCount;
          }
        }

        node._childArrivalOrder = node._children.length; // activate children recursively

        for (var _i = 0, len = node._children.length; _i < len; ++_i) {
          var child = node._children[_i];

          if (child._active) {
            this._activateNodeRecursively(child, preloadInvoker, onLoadInvoker, onEnableInvoker);
          }
        }

        node._onPostActivated(true);
      }
    }, {
      key: "_deactivateNodeRecursively",
      value: function _deactivateNodeRecursively(node) {
        if (_defaultConstants.DEV) {
          (0, _debug.assert)(!(node._objFlags & Deactivating), 'node should not deactivating'); // ensures _activeInHierarchy is always changing when Deactivating flagged

          (0, _debug.assert)(node._activeInHierarchy, 'node should not deactivated');
        }

        node._objFlags |= Deactivating;
        node._activeInHierarchy = false; // component maybe added during onEnable, and the onEnable of new component is already called
        // so we should record the origin length

        var originCount = node._components.length;

        for (var c = 0; c < originCount; ++c) {
          var component = node._components[c];

          if (component._enabled) {
            _globalExports.legacyCC.director._compScheduler.disableComp(component);

            if (node._activeInHierarchy) {
              // reactivated from root
              node._objFlags &= ~Deactivating;
              return;
            }
          }
        }

        for (var i = 0, len = node._children.length; i < len; ++i) {
          var child = node._children[i];

          if (child._activeInHierarchy) {
            this._deactivateNodeRecursively(child);

            if (node._activeInHierarchy) {
              // reactivated from root
              node._objFlags &= ~Deactivating;
              return;
            }
          }
        }

        node._onPostActivated(false);

        node._objFlags &= ~Deactivating;
      }
    }]);

    return NodeActivator;
  }();

  _exports.default = NodeActivator;

  if (_defaultConstants.EDITOR) {
    NodeActivator.prototype.activateComp = function (comp, preloadInvoker, onLoadInvoker, onEnableInvoker) {
      if (_globalExports.legacyCC.GAME_VIEW || comp.constructor._executeInEditMode) {
        if (!(comp._objFlags & IsPreloadStarted)) {
          comp._objFlags |= IsPreloadStarted;

          if (comp.__preload) {
            if (preloadInvoker) {
              preloadInvoker.add(comp);
            } else if (callPreloadInTryCatch) {
              callPreloadInTryCatch(comp);
            }
          }
        }

        if (!(comp._objFlags & IsOnLoadStarted)) {
          comp._objFlags |= IsOnLoadStarted;

          if (comp.onLoad) {
            if (onLoadInvoker) {
              onLoadInvoker.add(comp);
            } else if (callOnLoadInTryCatch) {
              callOnLoadInTryCatch(comp);
            }
          } else {
            comp._objFlags |= IsOnLoadCalled;

            _onLoadInEditor(comp);
          }
        }
      }

      if (comp._enabled) {
        var deactivatedOnLoading = !comp.node._activeInHierarchy;

        if (deactivatedOnLoading) {
          return;
        }

        _globalExports.legacyCC.director._compScheduler.enableComp(comp, onEnableInvoker);
      }
    };

    NodeActivator.prototype.destroyComp = function (comp) {
      // ensure onDisable called
      _globalExports.legacyCC.director._compScheduler.disableComp(comp);

      if (comp.onDestroy && comp._objFlags & IsOnLoadCalled) {
        if (_globalExports.legacyCC.GAME_VIEW || comp.constructor._executeInEditMode) {
          callOnDestroyInTryCatch && callOnDestroyInTryCatch(comp);
        }
      }
    };

    NodeActivator.prototype.resetComp = function (comp) {
      if (comp.resetInEditor && callResetInTryCatch) {
        callResetInTryCatch(comp);
      }
    };
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZS1hY3RpdmF0b3IudHMiXSwibmFtZXMiOlsiTUFYX1BPT0xfU0laRSIsIklzUHJlbG9hZFN0YXJ0ZWQiLCJDQ09iamVjdCIsIkZsYWdzIiwiSXNPbkxvYWRTdGFydGVkIiwiSXNPbkxvYWRDYWxsZWQiLCJEZWFjdGl2YXRpbmciLCJjYWxsUHJlbG9hZEluVHJ5Q2F0Y2giLCJFRElUT1IiLCJjYWxsT25Mb2FkSW5UcnlDYXRjaCIsImMiLCJvbkxvYWQiLCJlIiwibGVnYWN5Q0MiLCJfdGhyb3ciLCJfb2JqRmxhZ3MiLCJfb25Mb2FkSW5FZGl0b3IiLCJjYWxsT25EZXN0cm95SW5UcnlDYXRjaCIsImNhbGxSZXNldEluVHJ5Q2F0Y2giLCJjYWxsT25Gb2N1c0luVHJ5Q2F0Y2giLCJjYWxsT25Mb3N0Rm9jdXNJblRyeUNhdGNoIiwiVW5zb3J0ZWRJbnZva2VyIiwiY29tcCIsIl96ZXJvIiwiYXJyYXkiLCJwdXNoIiwiZmFzdFJlbW92ZSIsImZsYWdUb0NsZWFyIiwiTGlmZUN5Y2xlSW52b2tlciIsInN0YWJsZVJlbW92ZUluYWN0aXZlIiwiX2ludm9rZSIsImxlbmd0aCIsImludm9rZVByZWxvYWQiLCJTVVBQT1JUX0pJVCIsIl9fcHJlbG9hZCIsIml0ZXJhdG9yIiwiaSIsImludm9rZU9uTG9hZCIsImFjdGl2YXRlVGFza3NQb29sIiwiUG9vbCIsImdldCIsImdldEFjdGl2YXRlVGFzayIsInRhc2siLCJfZ2V0IiwicHJlbG9hZCIsIk9uZU9mZkludm9rZXIiLCJvbkVuYWJsZSIsImludm9rZU9uRW5hYmxlIiwiaW52b2tlciIsIl9uZWciLCJfcG9zIiwiX2NvbXBvbmVudENvcnJ1cHRlZCIsIm5vZGUiLCJpbmRleCIsIkRFViIsIm5hbWUiLCJjb25zb2xlIiwibG9nIiwiX3JlbW92ZUNvbXBvbmVudCIsInJlbW92ZUF0IiwiX2NvbXBvbmVudHMiLCJHQU1FX1ZJRVciLCJmb2N1c2VkIiwiRWRpdG9yIiwiU2VsZWN0aW9uIiwiZ2V0TGFzdFNlbGVjdGVkIiwidXVpZCIsIm9uRm9jdXNJbkVkaXRvciIsIm9uTG9zdEZvY3VzSW5FZGl0b3IiLCJURVNUIiwiX1NjZW5lIiwiQXNzZXRzV2F0Y2hlciIsInN0YXJ0IiwiTm9kZUFjdGl2YXRvciIsInJlc2V0Q29tcCIsInJlc2V0IiwiX2FjdGl2YXRpbmdTdGFjayIsImFjdGl2ZSIsIl9hY3RpdmF0ZU5vZGVSZWN1cnNpdmVseSIsImludm9rZSIsInBvcCIsInB1dCIsIl9kZWFjdGl2YXRlTm9kZVJlY3Vyc2l2ZWx5Iiwic3RhY2siLCJsYXN0VGFzayIsImNhbmNlbEluYWN0aXZlIiwiZW1pdCIsInByZWxvYWRJbnZva2VyIiwib25Mb2FkSW52b2tlciIsIm9uRW5hYmxlSW52b2tlciIsImFkZCIsIl9lbmFibGVkIiwiZGVhY3RpdmF0ZWRPbkxvYWRpbmciLCJfYWN0aXZlSW5IaWVyYXJjaHkiLCJkaXJlY3RvciIsIl9jb21wU2NoZWR1bGVyIiwiZW5hYmxlQ29tcCIsImRpc2FibGVDb21wIiwib25EZXN0cm95Iiwib3JpZ2luQ291bnQiLCJjb21wb25lbnQiLCJDb21wb25lbnQiLCJhY3RpdmF0ZUNvbXAiLCJfY2hpbGRBcnJpdmFsT3JkZXIiLCJfY2hpbGRyZW4iLCJsZW4iLCJjaGlsZCIsIl9hY3RpdmUiLCJfb25Qb3N0QWN0aXZhdGVkIiwicHJvdG90eXBlIiwiY29uc3RydWN0b3IiLCJfZXhlY3V0ZUluRWRpdE1vZGUiLCJkZXN0cm95Q29tcCIsInJlc2V0SW5FZGl0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUNBLE1BQU1BLGFBQWEsR0FBRyxDQUF0QixDLENBRUE7O0FBQ0EsTUFBTUMsZ0JBQWdCLEdBQUdDLGlCQUFTQyxLQUFULENBQWVGLGdCQUF4QyxDLENBQ0E7O0FBQ0EsTUFBTUcsZUFBZSxHQUFHRixpQkFBU0MsS0FBVCxDQUFlQyxl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QWxCLENBQWlDQyxVQUFqQyxDQUE0QzFFLElBQTVDLEVBQWtEbUUsZUFBbEQ7QUFDSDtBQUNKLEtBcENEOztBQXNDQWhCLElBQUFBLGFBQWEsQ0FBQ29DLFNBQWQsQ0FBd0JHLFdBQXhCLEdBQXNDLFVBQUMxRixJQUFELEVBQVU7QUFDNUM7QUFDQVQsOEJBQVNpRixRQUFULENBQWtCQyxjQUFsQixDQUFpQ0UsV0FBakMsQ0FBNkMzRSxJQUE3Qzs7QUFFQSxVQUFJQSxJQUFJLENBQUM0RSxTQUFMLElBQW1CNUUsSUFBSSxDQUFDUCxTQUFMLEdBQWlCVixjQUF4QyxFQUF5RDtBQUNyRCxZQUFJUSx3QkFBU2dELFNBQVQsSUFBc0J2QyxJQUFJLENBQUN3RixXQUFMLENBQWlCQyxrQkFBM0MsRUFBK0Q7QUFDM0Q5RixVQUFBQSx1QkFBdUIsSUFBSUEsdUJBQXVCLENBQUNLLElBQUQsQ0FBbEQ7QUFDSDtBQUNKO0FBQ0osS0FURDs7QUFXQW1ELElBQUFBLGFBQWEsQ0FBQ29DLFNBQWQsQ0FBd0JuQyxTQUF4QixHQUFvQyxVQUFDcEQsSUFBRCxFQUFVO0FBQzFDLFVBQUlBLElBQUksQ0FBQzJGLGFBQUwsSUFBc0IvRixtQkFBMUIsRUFBK0M7QUFDM0NBLFFBQUFBLG1CQUFtQixDQUFDSSxJQUFELENBQW5CO0FBQ0g7QUFDSixLQUpEO0FBS0giLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHNjZW5lLWdyYXBoXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ0NPYmplY3QgfSBmcm9tICcuLi9kYXRhL29iamVjdCc7XHJcbmltcG9ydCB7IGFycmF5LCBQb29sIH0gZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgeyB0cnlDYXRjaEZ1bmN0b3JfRURJVE9SIH0gZnJvbSAnLi4vdXRpbHMvbWlzYyc7XHJcbmltcG9ydCB7IGludm9rZU9uRW5hYmxlLCBjcmVhdGVJbnZva2VJbXBsLCBjcmVhdGVJbnZva2VJbXBsSml0LCBPbmVPZmZJbnZva2VyLCBMaWZlQ3ljbGVJbnZva2VyIH0gZnJvbSAnLi9jb21wb25lbnQtc2NoZWR1bGVyJztcclxuaW1wb3J0IHsgRURJVE9SLCBERVYsIFRFU1QsIFNVUFBPUlRfSklUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IGFzc2VydCwgZXJyb3JJRCB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuXHJcbmNvbnN0IE1BWF9QT09MX1NJWkUgPSA0O1xyXG5cclxuLy8gQHRzLWlnbm9yZVxyXG5jb25zdCBJc1ByZWxvYWRTdGFydGVkID0gQ0NPYmplY3QuRmxhZ3MuSXNQcmVsb2FkU3RhcnRlZDtcclxuLy8gQHRzLWlnbm9yZVxyXG5jb25zdCBJc09uTG9hZFN0YXJ0ZWQgPSBDQ09iamVjdC5GbGFncy5Jc09uTG9hZFN0YXJ0ZWQ7XHJcbi8vIEB0cy1pZ25vcmVcclxuY29uc3QgSXNPbkxvYWRDYWxsZWQgPSBDQ09iamVjdC5GbGFncy5Jc09uTG9hZENhbGxlZDtcclxuLy8gQHRzLWlnbm9yZVxyXG5jb25zdCBEZWFjdGl2YXRpbmcgPSBDQ09iamVjdC5GbGFncy5EZWFjdGl2YXRpbmc7XHJcblxyXG5jb25zdCBjYWxsUHJlbG9hZEluVHJ5Q2F0Y2ggPSBFRElUT1IgJiYgdHJ5Q2F0Y2hGdW5jdG9yX0VESVRPUignX19wcmVsb2FkJyk7XHJcbmNvbnN0IGNhbGxPbkxvYWRJblRyeUNhdGNoID0gRURJVE9SICYmIGZ1bmN0aW9uIChjKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGMub25Mb2FkKCk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGxlZ2FjeUNDLl90aHJvdyhlKTtcclxuICAgIH1cclxuICAgIGMuX29iakZsYWdzIHw9IElzT25Mb2FkQ2FsbGVkO1xyXG4gICAgX29uTG9hZEluRWRpdG9yKGMpO1xyXG59O1xyXG5jb25zdCBjYWxsT25EZXN0cm95SW5UcnlDYXRjaCA9IEVESVRPUiAmJiB0cnlDYXRjaEZ1bmN0b3JfRURJVE9SKCdvbkRlc3Ryb3knKTtcclxuY29uc3QgY2FsbFJlc2V0SW5UcnlDYXRjaCA9IEVESVRPUiAmJiB0cnlDYXRjaEZ1bmN0b3JfRURJVE9SKCdyZXNldEluRWRpdG9yJyk7XHJcbmNvbnN0IGNhbGxPbkZvY3VzSW5UcnlDYXRjaCA9IEVESVRPUiAmJiB0cnlDYXRjaEZ1bmN0b3JfRURJVE9SKCdvbkZvY3VzSW5FZGl0b3InKTtcclxuY29uc3QgY2FsbE9uTG9zdEZvY3VzSW5UcnlDYXRjaCA9IEVESVRPUiAmJiB0cnlDYXRjaEZ1bmN0b3JfRURJVE9SKCdvbkxvc3RGb2N1c0luRWRpdG9yJyk7XHJcblxyXG4vLyBmb3IgX19wcmVsb2FkOiB1c2VkIGludGVybmFsbHksIG5vIHNvcnRcclxuY2xhc3MgVW5zb3J0ZWRJbnZva2VyIGV4dGVuZHMgTGlmZUN5Y2xlSW52b2tlciB7XHJcbiAgICBwdWJsaWMgYWRkIChjb21wKSB7XHJcbiAgICAgICAgdGhpcy5femVyby5hcnJheS5wdXNoKGNvbXApO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZSAoY29tcCkge1xyXG4gICAgICAgIHRoaXMuX3plcm8uZmFzdFJlbW92ZShjb21wKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjYW5jZWxJbmFjdGl2ZSAoZmxhZ1RvQ2xlYXIpIHtcclxuICAgICAgICBMaWZlQ3ljbGVJbnZva2VyLnN0YWJsZVJlbW92ZUluYWN0aXZlKHRoaXMuX3plcm8sIGZsYWdUb0NsZWFyKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBpbnZva2UgKCkge1xyXG4gICAgICAgIHRoaXMuX2ludm9rZSh0aGlzLl96ZXJvKTtcclxuICAgICAgICB0aGlzLl96ZXJvLmFycmF5Lmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGludm9rZVByZWxvYWQgPSBTVVBQT1JUX0pJVCA/IGNyZWF0ZUludm9rZUltcGxKaXQoJ2MuX19wcmVsb2FkKCk7JykgOlxyXG4gICAgY3JlYXRlSW52b2tlSW1wbChcclxuICAgICAgICBmdW5jdGlvbiAoYykgeyBjLl9fcHJlbG9hZCgpOyB9LCBcclxuICAgICAgICBmdW5jdGlvbiAoaXRlcmF0b3IpIHtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XHJcbiAgICAgICAgICAgIGZvciAoaXRlcmF0b3IuaSA9IDA7IGl0ZXJhdG9yLmkgPCBhcnJheS5sZW5ndGg7ICsraXRlcmF0b3IuaSkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbaXRlcmF0b3IuaV0uX19wcmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG5jb25zdCBpbnZva2VPbkxvYWQgPSBTVVBQT1JUX0pJVCA/IGNyZWF0ZUludm9rZUltcGxKaXQoJ2Mub25Mb2FkKCk7Yy5fb2JqRmxhZ3N8PScgKyBJc09uTG9hZENhbGxlZCwgZmFsc2UsIElzT25Mb2FkQ2FsbGVkKSA6XHJcbiAgICBjcmVhdGVJbnZva2VJbXBsKFxyXG4gICAgICAgIGZ1bmN0aW9uIChjKSB7XHJcbiAgICAgICAgICAgIGMub25Mb2FkKCk7XHJcbiAgICAgICAgICAgIGMuX29iakZsYWdzIHw9IElzT25Mb2FkQ2FsbGVkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKGl0ZXJhdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IGl0ZXJhdG9yLmFycmF5O1xyXG4gICAgICAgICAgICBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb21wID0gYXJyYXlbaXRlcmF0b3IuaV07XHJcbiAgICAgICAgICAgICAgICBjb21wLm9uTG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgY29tcC5fb2JqRmxhZ3MgfD0gSXNPbkxvYWRDYWxsZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIElzT25Mb2FkQ2FsbGVkXHJcbiAgICApO1xyXG5cclxuY29uc3QgYWN0aXZhdGVUYXNrc1Bvb2wgPSBuZXcgUG9vbChNQVhfUE9PTF9TSVpFKTtcclxuYWN0aXZhdGVUYXNrc1Bvb2wuZ2V0ID0gZnVuY3Rpb24gZ2V0QWN0aXZhdGVUYXNrICgpIHtcclxuICAgIGNvbnN0IHRhc2s6IGFueSA9IHRoaXMuX2dldCgpIHx8IHtcclxuICAgICAgICBwcmVsb2FkOiBuZXcgVW5zb3J0ZWRJbnZva2VyKGludm9rZVByZWxvYWQpLFxyXG4gICAgICAgIG9uTG9hZDogbmV3IE9uZU9mZkludm9rZXIoaW52b2tlT25Mb2FkKSxcclxuICAgICAgICBvbkVuYWJsZTogbmV3IE9uZU9mZkludm9rZXIoaW52b2tlT25FbmFibGUpLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyByZXNldCBpbmRleCB0byAtMSBzbyB3ZSBjYW4gc2tpcCBpbnZva2VkIGNvbXBvbmVudCBpbiBjYW5jZWxJbmFjdGl2ZVxyXG4gICAgdGFzay5wcmVsb2FkLl96ZXJvLmkgPSAtMTtcclxuICAgIGxldCBpbnZva2VyID0gdGFzay5vbkxvYWQ7XHJcbiAgICBpbnZva2VyLl96ZXJvLmkgPSAtMTtcclxuICAgIGludm9rZXIuX25lZy5pID0gLTE7XHJcbiAgICBpbnZva2VyLl9wb3MuaSA9IC0xO1xyXG4gICAgaW52b2tlciA9IHRhc2sub25FbmFibGU7XHJcbiAgICBpbnZva2VyLl96ZXJvLmkgPSAtMTtcclxuICAgIGludm9rZXIuX25lZy5pID0gLTE7XHJcbiAgICBpbnZva2VyLl9wb3MuaSA9IC0xO1xyXG5cclxuICAgIHJldHVybiB0YXNrO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gX2NvbXBvbmVudENvcnJ1cHRlZCAobm9kZSwgY29tcCwgaW5kZXgpIHtcclxuICAgIGlmIChERVYpIHtcclxuICAgICAgICBlcnJvcklEKDM4MTcsIG5vZGUubmFtZSwgaW5kZXgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3JydXB0ZWQgY29tcG9uZW50IHZhbHVlOicsIGNvbXApO1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbXApIHtcclxuICAgICAgICBub2RlLl9yZW1vdmVDb21wb25lbnQoY29tcCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBhcnJheS5yZW1vdmVBdChub2RlLl9jb21wb25lbnRzLCBpbmRleCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9vbkxvYWRJbkVkaXRvciAoY29tcCkge1xyXG4gICAgaWYgKGNvbXAub25Mb2FkICYmICFsZWdhY3lDQy5HQU1FX1ZJRVcpIHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgY29uc3QgZm9jdXNlZCA9IEVkaXRvci5TZWxlY3Rpb24uZ2V0TGFzdFNlbGVjdGVkKCdub2RlJykgPT09IGNvbXAubm9kZS51dWlkO1xyXG4gICAgICAgIGlmIChmb2N1c2VkKSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wLm9uRm9jdXNJbkVkaXRvciAmJiBjYWxsT25Gb2N1c0luVHJ5Q2F0Y2gpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxPbkZvY3VzSW5UcnlDYXRjaChjb21wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGNvbXAub25Mb3N0Rm9jdXNJbkVkaXRvciAmJiBjYWxsT25Mb3N0Rm9jdXNJblRyeUNhdGNoKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsT25Mb3N0Rm9jdXNJblRyeUNhdGNoKGNvbXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCAhVEVTVCApIHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgX1NjZW5lLkFzc2V0c1dhdGNoZXIuc3RhcnQoY29tcCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gVGhlIGNsYXNzIHVzZWQgdG8gcGVyZm9ybSBhY3RpdmF0aW5nIGFuZCBkZWFjdGl2YXRpbmcgb3BlcmF0aW9ucyBvZiBub2RlIGFuZCBjb21wb25lbnQuXHJcbiAqIEB6aCDnlKjkuo7miafooYzoioLngrnlkoznu4Tku7bnmoTmv4DmtLvlkozlgZznlKjmk43kvZznmoTnrqHnkIblmajjgIJcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vZGVBY3RpdmF0b3Ige1xyXG4gICAgcHVibGljIHJlc2V0Q29tcDogYW55O1xyXG4gICAgcHJvdGVjdGVkIF9hY3RpdmF0aW5nU3RhY2shOiBhbnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlc2V0IGFsbCBhY3RpdmF0aW9uIG9yIGRlcy1hY3RpdmF0aW9uIHRhc2tzXHJcbiAgICAgKiBAemgg6YeN572u5omA5pyJ5r+A5rS75oiW6Z2e5r+A5rS75Lu75YqhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXNldCAoKSB7XHJcbiAgICAgICAgLy8gYSBzdGFjayBvZiBub2RlJ3MgYWN0aXZhdGluZyB0YXNrc1xyXG4gICAgICAgIHRoaXMuX2FjdGl2YXRpbmdTdGFjayA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEFjdGl2YXRlIG9yIGRlcy1hY3RpdmF0ZSBhIG5vZGVcclxuICAgICAqIEB6aCDmv4DmtLvmiJbogIXlgZznlKjmn5DkuKroioLngrlcclxuICAgICAqIEBwYXJhbSBub2RlIFRhcmdldCBub2RlXHJcbiAgICAgKiBAcGFyYW0gYWN0aXZlIFdoaWNoIHN0YXRlIHRvIHNldCB0aGUgbm9kZSB0b1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWN0aXZhdGVOb2RlIChub2RlLCBhY3RpdmUpIHtcclxuICAgICAgICBpZiAoYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhc2s6IGFueSA9IGFjdGl2YXRlVGFza3NQb29sLmdldCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9hY3RpdmF0aW5nU3RhY2sucHVzaCh0YXNrKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2FjdGl2YXRlTm9kZVJlY3Vyc2l2ZWx5KG5vZGUsIHRhc2sucHJlbG9hZCwgdGFzay5vbkxvYWQsIHRhc2sub25FbmFibGUpO1xyXG4gICAgICAgICAgICB0YXNrLnByZWxvYWQuaW52b2tlKCk7XHJcbiAgICAgICAgICAgIHRhc2sub25Mb2FkLmludm9rZSgpO1xyXG4gICAgICAgICAgICB0YXNrLm9uRW5hYmxlLmludm9rZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fYWN0aXZhdGluZ1N0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICBhY3RpdmF0ZVRhc2tzUG9vbC5wdXQodGFzayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWFjdGl2YXRlTm9kZVJlY3Vyc2l2ZWx5KG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGNoaWxkcmVuIG9mIHRoaXMgbm9kZSBmcm9tIHByZXZpb3VzIGFjdGl2YXRpbmcgdGFza3MgdG8gZGVib3VuY2VcclxuICAgICAgICAgICAgLy8gKHRoaXMgaXMgYW4gaW5lZmZpY2llbnQgb3BlcmF0aW9uIGJ1dCBpdCBlbnN1cmVzIGdlbmVyYWwgY2FzZSBjb3VsZCBiZSBpbXBsZW1lbnRlZCBpbiBhIGVmZmljaWVudCB3YXkpXHJcbiAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gdGhpcy5fYWN0aXZhdGluZ1N0YWNrO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGxhc3RUYXNrIG9mIHN0YWNrKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0VGFzay5wcmVsb2FkLmNhbmNlbEluYWN0aXZlKElzUHJlbG9hZFN0YXJ0ZWQpO1xyXG4gICAgICAgICAgICAgICAgbGFzdFRhc2sub25Mb2FkLmNhbmNlbEluYWN0aXZlKElzT25Mb2FkU3RhcnRlZCk7XHJcbiAgICAgICAgICAgICAgICBsYXN0VGFzay5vbkVuYWJsZS5jYW5jZWxJbmFjdGl2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGUuZW1pdCgnYWN0aXZlLWluLWhpZXJhcmNoeS1jaGFuZ2VkJywgbm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWN0aXZhdGUgb3IgZGVzLWFjdGl2YXRlIGEgY29tcG9uZW50XHJcbiAgICAgKiBAemgg5r+A5rS75oiW6ICF5YGc55So5p+Q5Liq57uE5Lu2XHJcbiAgICAgKiBAcGFyYW0gY29tcCBUYXJnZXQgY29tcG9uZW50XHJcbiAgICAgKiBAcGFyYW0gcHJlbG9hZEludm9rZXIgVGhlIGludm9rZXIgZm9yIGBfcHJlbG9hZGAgbWV0aG9kLCBub3JtYWxseSBmcm9tIFtbQ29tcG9uZW50U2NoZWR1bGVyXV1cclxuICAgICAqIEBwYXJhbSBvbkxvYWRJbnZva2VyIFRoZSBpbnZva2VyIGZvciBgb25Mb2FkYCBtZXRob2QsIG5vcm1hbGx5IGZyb20gW1tDb21wb25lbnRTY2hlZHVsZXJdXVxyXG4gICAgICogQHBhcmFtIG9uRW5hYmxlSW52b2tlciBUaGUgaW52b2tlciBmb3IgYG9uRW5hYmxlYCBtZXRob2QsIG5vcm1hbGx5IGZyb20gW1tDb21wb25lbnRTY2hlZHVsZXJdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWN0aXZhdGVDb21wIChjb21wLCBwcmVsb2FkSW52b2tlcj8sIG9uTG9hZEludm9rZXI/LCBvbkVuYWJsZUludm9rZXI/KSB7XHJcbiAgICAgICAgaWYgKCEoY29tcC5fb2JqRmxhZ3MgJiBJc1ByZWxvYWRTdGFydGVkKSkge1xyXG4gICAgICAgICAgICBjb21wLl9vYmpGbGFncyB8PSBJc1ByZWxvYWRTdGFydGVkO1xyXG4gICAgICAgICAgICBpZiAoY29tcC5fX3ByZWxvYWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVsb2FkSW52b2tlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZWxvYWRJbnZva2VyLmFkZChjb21wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXAuX19wcmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCEoY29tcC5fb2JqRmxhZ3MgJiBJc09uTG9hZFN0YXJ0ZWQpKSB7XHJcbiAgICAgICAgICAgIGNvbXAuX29iakZsYWdzIHw9IElzT25Mb2FkU3RhcnRlZDtcclxuICAgICAgICAgICAgaWYgKGNvbXAub25Mb2FkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob25Mb2FkSW52b2tlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uTG9hZEludm9rZXIuYWRkKGNvbXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcC5vbkxvYWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21wLl9vYmpGbGFncyB8PSBJc09uTG9hZENhbGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbXAuX29iakZsYWdzIHw9IElzT25Mb2FkQ2FsbGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21wLl9lbmFibGVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlYWN0aXZhdGVkT25Mb2FkaW5nID0gIWNvbXAubm9kZS5fYWN0aXZlSW5IaWVyYXJjaHk7XHJcbiAgICAgICAgICAgIGlmIChkZWFjdGl2YXRlZE9uTG9hZGluZykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLl9jb21wU2NoZWR1bGVyLmVuYWJsZUNvbXAoY29tcCwgb25FbmFibGVJbnZva2VyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRGVzdHJveSBhIGNvbXBvbmVudFxyXG4gICAgICogQHpoIOmUgOavgeS4gOS4que7hOS7tlxyXG4gICAgICogQHBhcmFtIGNvbXAgVGFyZ2V0IGNvbXBvbmVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVzdHJveUNvbXAgKGNvbXApIHtcclxuICAgICAgICAvLyBlbnN1cmUgb25EaXNhYmxlIGNhbGxlZFxyXG4gICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLl9jb21wU2NoZWR1bGVyLmRpc2FibGVDb21wKGNvbXApO1xyXG5cclxuICAgICAgICBpZiAoY29tcC5vbkRlc3Ryb3kgJiYgKGNvbXAuX29iakZsYWdzICYgSXNPbkxvYWRDYWxsZWQpKSB7XHJcbiAgICAgICAgICAgIGNvbXAub25EZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYWN0aXZhdGVOb2RlUmVjdXJzaXZlbHkgKG5vZGUsIHByZWxvYWRJbnZva2VyLCBvbkxvYWRJbnZva2VyLCBvbkVuYWJsZUludm9rZXIpIHtcclxuICAgICAgICBpZiAobm9kZS5fb2JqRmxhZ3MgJiBEZWFjdGl2YXRpbmcpIHtcclxuICAgICAgICAgICAgLy8gZW46XHJcbiAgICAgICAgICAgIC8vIEZvcmJpZCByZWFjdGl2ZSB0aGUgc2FtZSBub2RlIGR1cmluZyBpdHMgZGVhY3RpdmF0aW5nIHByb2NlZHVyZVxyXG4gICAgICAgICAgICAvLyB0byBhdm9pZCBlbmRsZXNzIGxvb3AgYW5kIHNpbXBsaWZ5IHRoZSBpbXBsZW1lbnRhdGlvbi5cclxuICAgICAgICAgICAgLy8gemg6XHJcbiAgICAgICAgICAgIC8vIOWvueebuOWQjOiKgueCueiAjOiogO+8jOaXoOazleaSpOmUgOWPjea/gOa0u++8jOmYsuatouWPjea/gOa0uyAtIOa/gOa0uyAtIOWPjea/gOa0u+eahOatu+W+queOr+WPkeeUn+OAglxyXG4gICAgICAgICAgICAvLyDov5nmoLforr7orqHnroDljJbkuobkuIDkupvlvJXmk47nmoTlrp7njrDvvIzogIzkuJTlr7nosIPnlKjogIXmnaXor7Tog73kv53or4Hlj43mv4DmtLvmk43kvZzpg73og73miJDlip/jgIJcclxuICAgICAgICAgICAgZXJyb3JJRCgzODE2LCBub2RlLm5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBub2RlLl9hY3RpdmVJbkhpZXJhcmNoeSA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vIGNvbXBvbmVudCBtYXliZSBhZGRlZCBkdXJpbmcgb25FbmFibGUsIGFuZCB0aGUgb25FbmFibGUgb2YgbmV3IGNvbXBvbmVudCBpcyBhbHJlYWR5IGNhbGxlZFxyXG4gICAgICAgIC8vIHNvIHdlIHNob3VsZCByZWNvcmQgdGhlIG9yaWdpbiBsZW5ndGhcclxuICAgICAgICBsZXQgb3JpZ2luQ291bnQgPSBub2RlLl9jb21wb25lbnRzLmxlbmd0aDtcclxuICAgICAgICAvLyBhY3RpdmF0ZSBjb21wb25lbnRzXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmlnaW5Db3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IG5vZGUuX2NvbXBvbmVudHNbaV07XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBsZWdhY3lDQy5Db21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZhdGVDb21wKGNvbXBvbmVudCwgcHJlbG9hZEludm9rZXIsIG9uTG9hZEludm9rZXIsIG9uRW5hYmxlSW52b2tlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfY29tcG9uZW50Q29ycnVwdGVkKG5vZGUsIGNvbXBvbmVudCwgaSk7XHJcbiAgICAgICAgICAgICAgICAtLWk7XHJcbiAgICAgICAgICAgICAgICAtLW9yaWdpbkNvdW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGUuX2NoaWxkQXJyaXZhbE9yZGVyID0gbm9kZS5fY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgIC8vIGFjdGl2YXRlIGNoaWxkcmVuIHJlY3Vyc2l2ZWx5XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG5vZGUuX2NoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gbm9kZS5fY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5fYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmF0ZU5vZGVSZWN1cnNpdmVseShjaGlsZCwgcHJlbG9hZEludm9rZXIsIG9uTG9hZEludm9rZXIsIG9uRW5hYmxlSW52b2tlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZS5fb25Qb3N0QWN0aXZhdGVkKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZGVhY3RpdmF0ZU5vZGVSZWN1cnNpdmVseSAobm9kZSkge1xyXG4gICAgICAgIGlmIChERVYpIHtcclxuICAgICAgICAgICAgYXNzZXJ0KCEobm9kZS5fb2JqRmxhZ3MgJiBEZWFjdGl2YXRpbmcpLCAnbm9kZSBzaG91bGQgbm90IGRlYWN0aXZhdGluZycpO1xyXG4gICAgICAgICAgICAvLyBlbnN1cmVzIF9hY3RpdmVJbkhpZXJhcmNoeSBpcyBhbHdheXMgY2hhbmdpbmcgd2hlbiBEZWFjdGl2YXRpbmcgZmxhZ2dlZFxyXG4gICAgICAgICAgICBhc3NlcnQobm9kZS5fYWN0aXZlSW5IaWVyYXJjaHksICdub2RlIHNob3VsZCBub3QgZGVhY3RpdmF0ZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZS5fb2JqRmxhZ3MgfD0gRGVhY3RpdmF0aW5nO1xyXG4gICAgICAgIG5vZGUuX2FjdGl2ZUluSGllcmFyY2h5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIGNvbXBvbmVudCBtYXliZSBhZGRlZCBkdXJpbmcgb25FbmFibGUsIGFuZCB0aGUgb25FbmFibGUgb2YgbmV3IGNvbXBvbmVudCBpcyBhbHJlYWR5IGNhbGxlZFxyXG4gICAgICAgIC8vIHNvIHdlIHNob3VsZCByZWNvcmQgdGhlIG9yaWdpbiBsZW5ndGhcclxuICAgICAgICBjb25zdCBvcmlnaW5Db3VudCA9IG5vZGUuX2NvbXBvbmVudHMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgb3JpZ2luQ291bnQ7ICsrYykge1xyXG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBub2RlLl9jb21wb25lbnRzW2NdO1xyXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5fY29tcFNjaGVkdWxlci5kaXNhYmxlQ29tcChjb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLl9hY3RpdmVJbkhpZXJhcmNoeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlYWN0aXZhdGVkIGZyb20gcm9vdFxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuX29iakZsYWdzICY9IH5EZWFjdGl2YXRpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBub2RlLl9jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IG5vZGUuX2NoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQuX2FjdGl2ZUluSGllcmFyY2h5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWFjdGl2YXRlTm9kZVJlY3Vyc2l2ZWx5KGNoaWxkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyByZWFjdGl2YXRlZCBmcm9tIHJvb3RcclxuICAgICAgICAgICAgICAgICAgICBub2RlLl9vYmpGbGFncyAmPSB+RGVhY3RpdmF0aW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbm9kZS5fb25Qb3N0QWN0aXZhdGVkKGZhbHNlKTtcclxuICAgICAgICBub2RlLl9vYmpGbGFncyAmPSB+RGVhY3RpdmF0aW5nO1xyXG4gICAgfVxyXG59XHJcblxyXG5pZiAoRURJVE9SKSB7XHJcbiAgICBOb2RlQWN0aXZhdG9yLnByb3RvdHlwZS5hY3RpdmF0ZUNvbXAgPSAoY29tcCwgcHJlbG9hZEludm9rZXIsIG9uTG9hZEludm9rZXIsIG9uRW5hYmxlSW52b2tlcikgPT4ge1xyXG4gICAgICAgIGlmIChsZWdhY3lDQy5HQU1FX1ZJRVcgfHwgY29tcC5jb25zdHJ1Y3Rvci5fZXhlY3V0ZUluRWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgaWYgKCEoY29tcC5fb2JqRmxhZ3MgJiBJc1ByZWxvYWRTdGFydGVkKSkge1xyXG4gICAgICAgICAgICAgICAgY29tcC5fb2JqRmxhZ3MgfD0gSXNQcmVsb2FkU3RhcnRlZDtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wLl9fcHJlbG9hZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmVsb2FkSW52b2tlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkSW52b2tlci5hZGQoY29tcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNhbGxQcmVsb2FkSW5UcnlDYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsUHJlbG9hZEluVHJ5Q2F0Y2goY29tcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKGNvbXAuX29iakZsYWdzICYgSXNPbkxvYWRTdGFydGVkKSkge1xyXG4gICAgICAgICAgICAgICAgY29tcC5fb2JqRmxhZ3MgfD0gSXNPbkxvYWRTdGFydGVkO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbXAub25Mb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uTG9hZEludm9rZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25Mb2FkSW52b2tlci5hZGQoY29tcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNhbGxPbkxvYWRJblRyeUNhdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxPbkxvYWRJblRyeUNhdGNoKGNvbXApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXAuX29iakZsYWdzIHw9IElzT25Mb2FkQ2FsbGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIF9vbkxvYWRJbkVkaXRvcihjb21wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29tcC5fZW5hYmxlZCkge1xyXG4gICAgICAgICAgICBjb25zdCBkZWFjdGl2YXRlZE9uTG9hZGluZyA9ICFjb21wLm5vZGUuX2FjdGl2ZUluSGllcmFyY2h5O1xyXG4gICAgICAgICAgICBpZiAoZGVhY3RpdmF0ZWRPbkxvYWRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5fY29tcFNjaGVkdWxlci5lbmFibGVDb21wKGNvbXAsIG9uRW5hYmxlSW52b2tlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBOb2RlQWN0aXZhdG9yLnByb3RvdHlwZS5kZXN0cm95Q29tcCA9IChjb21wKSA9PiB7XHJcbiAgICAgICAgLy8gZW5zdXJlIG9uRGlzYWJsZSBjYWxsZWRcclxuICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5fY29tcFNjaGVkdWxlci5kaXNhYmxlQ29tcChjb21wKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbXAub25EZXN0cm95ICYmIChjb21wLl9vYmpGbGFncyAmIElzT25Mb2FkQ2FsbGVkKSkge1xyXG4gICAgICAgICAgICBpZiAobGVnYWN5Q0MuR0FNRV9WSUVXIHx8IGNvbXAuY29uc3RydWN0b3IuX2V4ZWN1dGVJbkVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsT25EZXN0cm95SW5UcnlDYXRjaCAmJiBjYWxsT25EZXN0cm95SW5UcnlDYXRjaChjb21wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgTm9kZUFjdGl2YXRvci5wcm90b3R5cGUucmVzZXRDb21wID0gKGNvbXApID0+IHtcclxuICAgICAgICBpZiAoY29tcC5yZXNldEluRWRpdG9yICYmIGNhbGxSZXNldEluVHJ5Q2F0Y2gpIHtcclxuICAgICAgICAgICAgY2FsbFJlc2V0SW5UcnlDYXRjaChjb21wKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbiJdfQ==