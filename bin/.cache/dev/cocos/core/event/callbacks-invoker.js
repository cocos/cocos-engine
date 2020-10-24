(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../memop/index.js", "../utils/js.js", "../default-constants.js", "../data/object.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../memop/index.js"), require("../utils/js.js"), require("../default-constants.js"), require("../data/object.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.js, global.defaultConstants, global.object, global.globalExports);
    global.callbacksInvoker = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _js, _defaultConstants, _object, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CallbacksInvoker = _exports.CallbackList = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var fastRemoveAt = _js.array.fastRemoveAt;

  function empty() {}

  var CallbackInfo = /*#__PURE__*/function () {
    function CallbackInfo() {
      _classCallCheck(this, CallbackInfo);

      this.callback = empty;
      this.target = undefined;
      this.once = false;
    }

    _createClass(CallbackInfo, [{
      key: "set",
      value: function set(callback, target, once) {
        this.callback = callback || empty;
        this.target = target;
        this.once = !!once;
      }
    }, {
      key: "reset",
      value: function reset() {
        this.target = undefined;
        this.callback = empty;
        this.once = false;
      }
    }, {
      key: "check",
      value: function check() {
        // Validation
        if (this.target instanceof _object.CCObject && !(0, _object.isValid)(this.target, true)) {
          return false;
        } else {
          return true;
        }
      }
    }]);

    return CallbackInfo;
  }();

  var callbackInfoPool = new _index.Pool(function () {
    return new CallbackInfo();
  }, 32);
  /**
   * @zh 事件监听器列表的简单封装。
   * @en A simple list of event callbacks
   */

  var CallbackList = /*#__PURE__*/function () {
    function CallbackList() {
      _classCallCheck(this, CallbackList);

      this.callbackInfos = [];
      this.isInvoking = false;
      this.containCanceled = false;
    }

    _createClass(CallbackList, [{
      key: "removeByCallback",

      /**
       * @zh 从列表中移除与指定目标相同回调函数的事件。
       * @en Remove the event listeners with the given callback from the list
       *
       * @param cb - The callback to be removed
       */
      value: function removeByCallback(cb) {
        for (var i = 0; i < this.callbackInfos.length; ++i) {
          var info = this.callbackInfos[i];

          if (info && info.callback === cb) {
            info.reset();
            callbackInfoPool.free(info);
            fastRemoveAt(this.callbackInfos, i);
            --i;
          }
        }
      }
      /**
       * @zh 从列表中移除与指定目标相同调用者的事件。
       * @en Remove the event listeners with the given target from the list
       * @param target
       */

    }, {
      key: "removeByTarget",
      value: function removeByTarget(target) {
        for (var i = 0; i < this.callbackInfos.length; ++i) {
          var info = this.callbackInfos[i];

          if (info && info.target === target) {
            info.reset();
            callbackInfoPool.free(info);
            fastRemoveAt(this.callbackInfos, i);
            --i;
          }
        }
      }
      /**
       * @zh 移除指定编号事件。
       * @en Remove the event listener at the given index
       * @param index
       */

    }, {
      key: "cancel",
      value: function cancel(index) {
        var info = this.callbackInfos[index];

        if (info) {
          info.reset();

          if (this.isInvoking) {
            this.callbackInfos[index] = null;
          } else {
            fastRemoveAt(this.callbackInfos, index);
          }

          callbackInfoPool.free(info);
        }

        this.containCanceled = true;
      }
      /**
       * @zh 注销所有事件。
       * @en Cancel all event listeners
       */

    }, {
      key: "cancelAll",
      value: function cancelAll() {
        for (var i = 0; i < this.callbackInfos.length; i++) {
          var info = this.callbackInfos[i];

          if (info) {
            info.reset();
            callbackInfoPool.free(info);
            this.callbackInfos[i] = null;
          }
        }

        this.containCanceled = true;
      }
      /**
       * @zh 立即删除所有取消的回调。（在移除过程中会更加紧凑的排列数组）
       * @en Delete all canceled callbacks and compact array
       */

    }, {
      key: "purgeCanceled",
      value: function purgeCanceled() {
        for (var i = this.callbackInfos.length - 1; i >= 0; --i) {
          var info = this.callbackInfos[i];

          if (!info) {
            fastRemoveAt(this.callbackInfos, i);
          }
        }

        this.containCanceled = false;
      }
      /**
       * @zh 清除并重置所有数据。
       * @en Clear all data
       */

    }, {
      key: "clear",
      value: function clear() {
        this.cancelAll();
        this.callbackInfos.length = 0;
        this.isInvoking = false;
        this.containCanceled = false;
      }
    }]);

    return CallbackList;
  }();

  _exports.CallbackList = CallbackList;
  var MAX_SIZE = 16;
  var callbackListPool = new _index.Pool(function () {
    return new CallbackList();
  }, MAX_SIZE);

  /**
   * @zh CallbacksInvoker 用来根据事件名（Key）管理事件监听器列表并调用回调方法。
   * @en CallbacksInvoker is used to manager and invoke event listeners with different event keys, 
   * each key is mapped to a CallbackList.
   */
  var CallbacksInvoker = /*#__PURE__*/function () {
    function CallbacksInvoker() {
      _classCallCheck(this, CallbacksInvoker);

      this._callbackTable = (0, _js.createMap)(true);
    }

    _createClass(CallbacksInvoker, [{
      key: "on",

      /**
       * @zh 向一个事件名注册一个新的事件监听器，包含回调函数和调用者
       * @en Register an event listener to a given event key with callback and target.
       *
       * @param key - Event type
       * @param callback - Callback function when event triggered
       * @param target - Callback callee
       * @param once - Whether invoke the callback only once (and remove it)
       */
      value: function on(key, callback, target, once) {
        if (!this.hasEventListener(key, callback, target)) {
          var list = this._callbackTable[key];

          if (!list) {
            list = this._callbackTable[key] = callbackListPool.alloc();
          }

          var info = callbackInfoPool.alloc();
          info.set(callback, target, once);
          list.callbackInfos.push(info);
        }

        return callback;
      }
      /**
       * @zh 检查指定事件是否已注册回调。
       * @en Checks whether there is correspond event listener registered on the given event
       * @param key - Event type
       * @param callback - Callback function when event triggered
       * @param target - Callback callee
       */

    }, {
      key: "hasEventListener",
      value: function hasEventListener(key, callback, target) {
        var list = this._callbackTable[key];

        if (!list) {
          return false;
        } // check any valid callback


        var infos = list.callbackInfos;

        if (!callback) {
          // Make sure no cancelled callbacks
          if (list.isInvoking) {
            for (var i = 0; i < infos.length; ++i) {
              if (infos[i]) {
                return true;
              }
            }

            return false;
          } else {
            return infos.length > 0;
          }
        }

        for (var _i = 0; _i < infos.length; ++_i) {
          var info = infos[_i];

          if (info && info.check() && info.callback === callback && info.target === target) {
            return true;
          }
        }

        return false;
      }
      /**
       * @zh 移除在特定事件类型中注册的所有回调或在某个目标中注册的所有回调。
       * @en Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
       * @param keyOrTarget - The event type or target with which the listeners will be removed
       */

    }, {
      key: "removeAll",
      value: function removeAll(keyOrTarget) {
        if (typeof keyOrTarget === 'string') {
          // remove by key
          var list = this._callbackTable[keyOrTarget];

          if (list) {
            if (list.isInvoking) {
              list.cancelAll();
            } else {
              list.clear();
              callbackListPool.free(list);
              delete this._callbackTable[keyOrTarget];
            }
          }
        } else if (keyOrTarget) {
          // remove by target
          for (var key in this._callbackTable) {
            var _list = this._callbackTable[key];

            if (_list.isInvoking) {
              var infos = _list.callbackInfos;

              for (var i = 0; i < infos.length; ++i) {
                var info = infos[i];

                if (info && info.target === keyOrTarget) {
                  _list.cancel(i);
                }
              }
            } else {
              _list.removeByTarget(keyOrTarget);
            }
          }
        }
      }
      /**
       * @zh 删除以指定事件，回调函数，目标注册的回调。
       * @en Remove event listeners registered with the given event key, callback and target
       * @param key - Event type
       * @param callback - The callback function of the event listener, if absent all event listeners for the given type will be removed
       * @param target - The callback callee of the event listener
       */

    }, {
      key: "off",
      value: function off(key, callback, target) {
        var list = this._callbackTable[key];

        if (list) {
          var infos = list.callbackInfos;

          if (callback) {
            for (var i = 0; i < infos.length; ++i) {
              var info = infos[i];

              if (info && info.callback === callback && info.target === target) {
                list.cancel(i);
                break;
              }
            }
          } else {
            this.removeAll(key);
          }
        }
      }
      /**
       * @zh 派发一个指定事件，并传递需要的参数
       * @en Trigger an event directly with the event name and necessary arguments.
       * @param key - event type
       * @param arg0 - The first argument to be passed to the callback
       * @param arg1 - The second argument to be passed to the callback
       * @param arg2 - The third argument to be passed to the callback
       * @param arg3 - The fourth argument to be passed to the callback
       * @param arg4 - The fifth argument to be passed to the callback
       */

    }, {
      key: "emit",
      value: function emit(key, arg0, arg1, arg2, arg3, arg4) {
        var list = this._callbackTable[key];

        if (list) {
          var rootInvoker = !list.isInvoking;
          list.isInvoking = true;
          var infos = list.callbackInfos;

          for (var i = 0, len = infos.length; i < len; ++i) {
            var info = infos[i];

            if (info) {
              var callback = info.callback;
              var target = info.target; // Pre off once callbacks to avoid influence on logic in callback

              if (info.once) {
                this.off(key, callback, target);
              } // Lazy check validity of callback target, 
              // if target is CCObject and is no longer valid, then remove the callback info directly


              if (!info.check()) {
                this.off(key, callback, target);
              } else {
                if (target) {
                  callback.call(target, arg0, arg1, arg2, arg3, arg4);
                } else {
                  callback(arg0, arg1, arg2, arg3, arg4);
                }
              }
            }
          }

          if (rootInvoker) {
            list.isInvoking = false;

            if (list.containCanceled) {
              list.purgeCanceled();
            }
          }
        }
      }
      /**
       * 移除所有回调。
       */

    }, {
      key: "clear",
      value: function clear() {
        for (var key in this._callbackTable) {
          var list = this._callbackTable[key];

          if (list) {
            list.clear();
            callbackListPool.free(list);
            delete this._callbackTable[key];
          }
        }
      }
    }]);

    return CallbacksInvoker;
  }();

  _exports.CallbacksInvoker = CallbacksInvoker;

  if (_defaultConstants.TEST) {
    _globalExports.legacyCC._Test.CallbacksInvoker = CallbacksInvoker;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZXZlbnQvY2FsbGJhY2tzLWludm9rZXIudHMiXSwibmFtZXMiOlsiZmFzdFJlbW92ZUF0IiwiYXJyYXkiLCJlbXB0eSIsIkNhbGxiYWNrSW5mbyIsImNhbGxiYWNrIiwidGFyZ2V0IiwidW5kZWZpbmVkIiwib25jZSIsIkNDT2JqZWN0IiwiY2FsbGJhY2tJbmZvUG9vbCIsIlBvb2wiLCJDYWxsYmFja0xpc3QiLCJjYWxsYmFja0luZm9zIiwiaXNJbnZva2luZyIsImNvbnRhaW5DYW5jZWxlZCIsImNiIiwiaSIsImxlbmd0aCIsImluZm8iLCJyZXNldCIsImZyZWUiLCJpbmRleCIsImNhbmNlbEFsbCIsIk1BWF9TSVpFIiwiY2FsbGJhY2tMaXN0UG9vbCIsIkNhbGxiYWNrc0ludm9rZXIiLCJfY2FsbGJhY2tUYWJsZSIsImtleSIsImhhc0V2ZW50TGlzdGVuZXIiLCJsaXN0IiwiYWxsb2MiLCJzZXQiLCJwdXNoIiwiaW5mb3MiLCJjaGVjayIsImtleU9yVGFyZ2V0IiwiY2xlYXIiLCJjYW5jZWwiLCJyZW1vdmVCeVRhcmdldCIsInJlbW92ZUFsbCIsImFyZzAiLCJhcmcxIiwiYXJnMiIsImFyZzMiLCJhcmc0Iiwicm9vdEludm9rZXIiLCJsZW4iLCJvZmYiLCJjYWxsIiwicHVyZ2VDYW5jZWxlZCIsIlRFU1QiLCJsZWdhY3lDQyIsIl9UZXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1DQSxNQUFNQSxZQUFZLEdBQUdDLFVBQU1ELFlBQTNCOztBQUVBLFdBQVNFLEtBQVQsR0FBaUIsQ0FBRTs7TUFFYkMsWTs7OztXQUNLQyxRLEdBQXFCRixLO1dBQ3JCRyxNLEdBQTZCQyxTO1dBQzdCQyxJLEdBQU8sSzs7Ozs7MEJBRUZILFEsRUFBb0JDLE0sRUFBaUJFLEksRUFBZ0I7QUFDN0QsYUFBS0gsUUFBTCxHQUFnQkEsUUFBUSxJQUFJRixLQUE1QjtBQUNBLGFB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RCxFQUFPQyxJQUFQLEVBQWFDLElBQWIsRUFBbUJDLElBQW5CLEVBQXlCQyxJQUF6QixDQUFSO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBRUQsY0FBSUMsV0FBSixFQUFpQjtBQUNiaEIsWUFBQUEsSUFBSSxDQUFDaEIsVUFBTCxHQUFrQixLQUFsQjs7QUFDQSxnQkFBSWdCLElBQUksQ0FBQ2YsZUFBVCxFQUEwQjtBQUN0QmUsY0FBQUEsSUFBSSxDQUFDb0IsYUFBTDtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBRUQ7Ozs7Ozs4QkFHZ0I7QUFDWixhQUFLLElBQUl0QixHQUFULElBQWdCLEtBQUtELGNBQXJCLEVBQXFDO0FBQ2pDLGNBQUlHLElBQUksR0FBRyxLQUFLSCxjQUFMLENBQW9CQyxHQUFwQixDQUFYOztBQUNBLGNBQUlFLElBQUosRUFBVTtBQUNOQSxZQUFBQSxJQUFJLENBQUNPLEtBQUw7QUFDQVosWUFBQUEsZ0JBQWdCLENBQUNKLElBQWpCLENBQXNCUyxJQUF0QjtBQUNBLG1CQUFPLEtBQUtILGNBQUwsQ0FBb0JDLEdBQXBCLENBQVA7QUFDSDtBQUNKO0FBQ0o7Ozs7Ozs7O0FBR0wsTUFBSXVCLHNCQUFKLEVBQVU7QUFDTkMsNEJBQVNDLEtBQVQsQ0FBZTNCLGdCQUFmLEdBQWtDQSxnQkFBbEM7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAyMCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgUG9vbCB9IGZyb20gJy4uL21lbW9wJztcclxuaW1wb3J0IHsgYXJyYXksIGNyZWF0ZU1hcCB9IGZyb20gJy4uL3V0aWxzL2pzJztcclxuaW1wb3J0IHsgVEVTVCB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IENDT2JqZWN0LCBpc1ZhbGlkIH0gZnJvbSAnLi4vZGF0YS9vYmplY3QnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuY29uc3QgZmFzdFJlbW92ZUF0ID0gYXJyYXkuZmFzdFJlbW92ZUF0O1xyXG5cclxuZnVuY3Rpb24gZW1wdHkgKCl7fVxyXG5cclxuY2xhc3MgQ2FsbGJhY2tJbmZvIHtcclxuICAgIHB1YmxpYyBjYWxsYmFjazogRnVuY3Rpb24gPSBlbXB0eTtcclxuICAgIHB1YmxpYyB0YXJnZXQ6IE9iamVjdCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBvbmNlID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIHNldCAoY2FsbGJhY2s6IEZ1bmN0aW9uLCB0YXJnZXQ/OiBPYmplY3QsIG9uY2U/OiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrIHx8IGVtcHR5O1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMub25jZSA9ICEhb25jZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzZXQgKCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBlbXB0eTtcclxuICAgICAgICB0aGlzLm9uY2UgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hlY2sgKCkge1xyXG4gICAgICAgIC8vIFZhbGlkYXRpb25cclxuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBDQ09iamVjdCAmJiAhaXNWYWxpZCh0aGlzLnRhcmdldCwgdHJ1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjYWxsYmFja0luZm9Qb29sID0gbmV3IFBvb2woKCkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBDYWxsYmFja0luZm8oKTtcclxufSwgMzIpO1xyXG4vKipcclxuICogQHpoIOS6i+S7tuebkeWQrOWZqOWIl+ihqOeahOeugOWNleWwgeijheOAglxyXG4gKiBAZW4gQSBzaW1wbGUgbGlzdCBvZiBldmVudCBjYWxsYmFja3NcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYWxsYmFja0xpc3Qge1xyXG4gICAgcHVibGljIGNhbGxiYWNrSW5mb3M6IEFycmF5PENhbGxiYWNrSW5mbyB8IG51bGw+ID0gW107XHJcbiAgICBwdWJsaWMgaXNJbnZva2luZyA9IGZhbHNlO1xyXG4gICAgcHVibGljIGNvbnRhaW5DYW5jZWxlZCA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOS7juWIl+ihqOS4reenu+mZpOS4juaMh+Wumuebruagh+ebuOWQjOWbnuiwg+WHveaVsOeahOS6i+S7tuOAglxyXG4gICAgICogQGVuIFJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXJzIHdpdGggdGhlIGdpdmVuIGNhbGxiYWNrIGZyb20gdGhlIGxpc3RcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2IgLSBUaGUgY2FsbGJhY2sgdG8gYmUgcmVtb3ZlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQnlDYWxsYmFjayAoY2I6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrSW5mb3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IHRoaXMuY2FsbGJhY2tJbmZvc1tpXTtcclxuICAgICAgICAgICAgaWYgKGluZm8gJiYgaW5mby5jYWxsYmFjayA9PT0gY2IpIHtcclxuICAgICAgICAgICAgICAgIGluZm8ucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrSW5mb1Bvb2wuZnJlZShpbmZvKTtcclxuICAgICAgICAgICAgICAgIGZhc3RSZW1vdmVBdCh0aGlzLmNhbGxiYWNrSW5mb3MsIGkpO1xyXG4gICAgICAgICAgICAgICAgLS1pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5LuO5YiX6KGo5Lit56e76Zmk5LiO5oyH5a6a55uu5qCH55u45ZCM6LCD55So6ICF55qE5LqL5Lu244CCXHJcbiAgICAgKiBAZW4gUmVtb3ZlIHRoZSBldmVudCBsaXN0ZW5lcnMgd2l0aCB0aGUgZ2l2ZW4gdGFyZ2V0IGZyb20gdGhlIGxpc3RcclxuICAgICAqIEBwYXJhbSB0YXJnZXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUJ5VGFyZ2V0ICh0YXJnZXQ6IE9iamVjdCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYWxsYmFja0luZm9zLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLmNhbGxiYWNrSW5mb3NbaV07XHJcbiAgICAgICAgICAgIGlmIChpbmZvICYmIGluZm8udGFyZ2V0ID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGluZm8ucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrSW5mb1Bvb2wuZnJlZShpbmZvKTtcclxuICAgICAgICAgICAgICAgIGZhc3RSZW1vdmVBdCh0aGlzLmNhbGxiYWNrSW5mb3MsIGkpO1xyXG4gICAgICAgICAgICAgICAgLS1pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOenu+mZpOaMh+Wumue8luWPt+S6i+S7tuOAglxyXG4gICAgICogQGVuIFJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXIgYXQgdGhlIGdpdmVuIGluZGV4XHJcbiAgICAgKiBAcGFyYW0gaW5kZXhcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNhbmNlbCAoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLmNhbGxiYWNrSW5mb3NbaW5kZXhdO1xyXG4gICAgICAgIGlmIChpbmZvKSB7XHJcbiAgICAgICAgICAgIGluZm8ucmVzZXQoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNJbnZva2luZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja0luZm9zW2luZGV4XSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmYXN0UmVtb3ZlQXQodGhpcy5jYWxsYmFja0luZm9zLCBpbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2tJbmZvUG9vbC5mcmVlKGluZm8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbnRhaW5DYW5jZWxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5rOo6ZSA5omA5pyJ5LqL5Lu244CCXHJcbiAgICAgKiBAZW4gQ2FuY2VsIGFsbCBldmVudCBsaXN0ZW5lcnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNhbmNlbEFsbCAoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrSW5mb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IHRoaXMuY2FsbGJhY2tJbmZvc1tpXTtcclxuICAgICAgICAgICAgaWYgKGluZm8pIHtcclxuICAgICAgICAgICAgICAgIGluZm8ucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrSW5mb1Bvb2wuZnJlZShpbmZvKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tJbmZvc1tpXSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250YWluQ2FuY2VsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeri+WNs+WIoOmZpOaJgOacieWPlua2iOeahOWbnuiwg+OAgu+8iOWcqOenu+mZpOi/h+eoi+S4reS8muabtOWKoOe0p+WHkeeahOaOkuWIl+aVsOe7hO+8iVxyXG4gICAgICogQGVuIERlbGV0ZSBhbGwgY2FuY2VsZWQgY2FsbGJhY2tzIGFuZCBjb21wYWN0IGFycmF5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwdXJnZUNhbmNlbGVkICgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5jYWxsYmFja0luZm9zLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLmNhbGxiYWNrSW5mb3NbaV07XHJcbiAgICAgICAgICAgIGlmICghaW5mbykge1xyXG4gICAgICAgICAgICAgICAgZmFzdFJlbW92ZUF0KHRoaXMuY2FsbGJhY2tJbmZvcywgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb250YWluQ2FuY2VsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmuIXpmaTlubbph43nva7miYDmnInmlbDmja7jgIJcclxuICAgICAqIEBlbiBDbGVhciBhbGwgZGF0YVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIHRoaXMuY2FuY2VsQWxsKCk7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFja0luZm9zLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5pc0ludm9raW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb250YWluQ2FuY2VsZWQgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgTUFYX1NJWkUgPSAxNjtcclxuY29uc3QgY2FsbGJhY2tMaXN0UG9vbCA9IG5ldyBQb29sPENhbGxiYWNrTGlzdD4oKCkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBDYWxsYmFja0xpc3QoKTtcclxufSwgTUFYX1NJWkUpO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ2FsbGJhY2tUYWJsZSB7XHJcbiAgICBbeDogc3RyaW5nXTogQ2FsbGJhY2tMaXN0IHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG4vKipcclxuICogQHpoIENhbGxiYWNrc0ludm9rZXIg55So5p2l5qC55o2u5LqL5Lu25ZCN77yIS2V577yJ566h55CG5LqL5Lu255uR5ZCs5Zmo5YiX6KGo5bm26LCD55So5Zue6LCD5pa55rOV44CCXHJcbiAqIEBlbiBDYWxsYmFja3NJbnZva2VyIGlzIHVzZWQgdG8gbWFuYWdlciBhbmQgaW52b2tlIGV2ZW50IGxpc3RlbmVycyB3aXRoIGRpZmZlcmVudCBldmVudCBrZXlzLCBcclxuICogZWFjaCBrZXkgaXMgbWFwcGVkIHRvIGEgQ2FsbGJhY2tMaXN0LlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhbGxiYWNrc0ludm9rZXIge1xyXG4gICAgcHVibGljIF9jYWxsYmFja1RhYmxlOiBJQ2FsbGJhY2tUYWJsZSA9IGNyZWF0ZU1hcCh0cnVlKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHkuIDkuKrkuovku7blkI3ms6jlhozkuIDkuKrmlrDnmoTkuovku7bnm5HlkKzlmajvvIzljIXlkKvlm57osIPlh73mlbDlkozosIPnlKjogIVcclxuICAgICAqIEBlbiBSZWdpc3RlciBhbiBldmVudCBsaXN0ZW5lciB0byBhIGdpdmVuIGV2ZW50IGtleSB3aXRoIGNhbGxiYWNrIGFuZCB0YXJnZXQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGtleSAtIEV2ZW50IHR5cGVcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIENhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gZXZlbnQgdHJpZ2dlcmVkXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gQ2FsbGJhY2sgY2FsbGVlXHJcbiAgICAgKiBAcGFyYW0gb25jZSAtIFdoZXRoZXIgaW52b2tlIHRoZSBjYWxsYmFjayBvbmx5IG9uY2UgKGFuZCByZW1vdmUgaXQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbiAoa2V5OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgdGFyZ2V0PzogT2JqZWN0LCBvbmNlPzogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNFdmVudExpc3RlbmVyKGtleSwgY2FsbGJhY2ssIHRhcmdldCkpIHtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLl9jYWxsYmFja1RhYmxlW2tleV07XHJcbiAgICAgICAgICAgIGlmICghbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IHRoaXMuX2NhbGxiYWNrVGFibGVba2V5XSA9IGNhbGxiYWNrTGlzdFBvb2wuYWxsb2MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gY2FsbGJhY2tJbmZvUG9vbC5hbGxvYygpO1xyXG4gICAgICAgICAgICBpbmZvLnNldChjYWxsYmFjaywgdGFyZ2V0LCBvbmNlKTtcclxuICAgICAgICAgICAgbGlzdC5jYWxsYmFja0luZm9zLnB1c2goaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYWxsYmFjaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmo4Dmn6XmjIflrprkuovku7bmmK/lkKblt7Lms6jlhozlm57osIPjgIJcclxuICAgICAqIEBlbiBDaGVja3Mgd2hldGhlciB0aGVyZSBpcyBjb3JyZXNwb25kIGV2ZW50IGxpc3RlbmVyIHJlZ2lzdGVyZWQgb24gdGhlIGdpdmVuIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ga2V5IC0gRXZlbnQgdHlwZVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIC0gQ2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBldmVudCB0cmlnZ2VyZWRcclxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBDYWxsYmFjayBjYWxsZWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGhhc0V2ZW50TGlzdGVuZXIgKGtleTogc3RyaW5nLCBjYWxsYmFjaz86IEZ1bmN0aW9uLCB0YXJnZXQ/OiBPYmplY3QpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5fY2FsbGJhY2tUYWJsZVtrZXldO1xyXG4gICAgICAgIGlmICghbGlzdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjaGVjayBhbnkgdmFsaWQgY2FsbGJhY2tcclxuICAgICAgICBjb25zdCBpbmZvcyA9IGxpc3QuY2FsbGJhY2tJbmZvcztcclxuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBubyBjYW5jZWxsZWQgY2FsbGJhY2tzXHJcbiAgICAgICAgICAgIGlmIChsaXN0LmlzSW52b2tpbmcpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5mb3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5mb3NbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZm9zLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5mb3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgbGV0IGluZm8gPSBpbmZvc1tpXTtcclxuICAgICAgICAgICAgaWYgKGluZm8gJiYgaW5mby5jaGVjaygpICYmIGluZm8uY2FsbGJhY2sgPT09IGNhbGxiYWNrICYmIGluZm8udGFyZ2V0ID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnp7vpmaTlnKjnibnlrprkuovku7bnsbvlnovkuK3ms6jlhoznmoTmiYDmnInlm57osIPmiJblnKjmn5DkuKrnm67moIfkuK3ms6jlhoznmoTmiYDmnInlm57osIPjgIJcclxuICAgICAqIEBlbiBSZW1vdmVzIGFsbCBjYWxsYmFja3MgcmVnaXN0ZXJlZCBpbiBhIGNlcnRhaW4gZXZlbnQgdHlwZSBvciBhbGwgY2FsbGJhY2tzIHJlZ2lzdGVyZWQgd2l0aCBhIGNlcnRhaW4gdGFyZ2V0XHJcbiAgICAgKiBAcGFyYW0ga2V5T3JUYXJnZXQgLSBUaGUgZXZlbnQgdHlwZSBvciB0YXJnZXQgd2l0aCB3aGljaCB0aGUgbGlzdGVuZXJzIHdpbGwgYmUgcmVtb3ZlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQWxsIChrZXlPclRhcmdldDogc3RyaW5nIHwgT2JqZWN0KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXlPclRhcmdldCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGJ5IGtleVxyXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5fY2FsbGJhY2tUYWJsZVtrZXlPclRhcmdldF07XHJcbiAgICAgICAgICAgIGlmIChsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5pc0ludm9raW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5jYW5jZWxBbGwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja0xpc3RQb29sLmZyZWUobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrVGFibGVba2V5T3JUYXJnZXRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGtleU9yVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBieSB0YXJnZXRcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5fY2FsbGJhY2tUYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuX2NhbGxiYWNrVGFibGVba2V5XSE7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5pc0ludm9raW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5mb3MgPSBsaXN0LmNhbGxiYWNrSW5mb3M7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmZvcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmZvID0gaW5mb3NbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZvICYmIGluZm8udGFyZ2V0ID09PSBrZXlPclRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5jYW5jZWwoaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnJlbW92ZUJ5VGFyZ2V0KGtleU9yVGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDliKDpmaTku6XmjIflrprkuovku7bvvIzlm57osIPlh73mlbDvvIznm67moIfms6jlhoznmoTlm57osIPjgIJcclxuICAgICAqIEBlbiBSZW1vdmUgZXZlbnQgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgZ2l2ZW4gZXZlbnQga2V5LCBjYWxsYmFjayBhbmQgdGFyZ2V0XHJcbiAgICAgKiBAcGFyYW0ga2V5IC0gRXZlbnQgdHlwZVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIG9mIHRoZSBldmVudCBsaXN0ZW5lciwgaWYgYWJzZW50IGFsbCBldmVudCBsaXN0ZW5lcnMgZm9yIHRoZSBnaXZlbiB0eXBlIHdpbGwgYmUgcmVtb3ZlZFxyXG4gICAgICogQHBhcmFtIHRhcmdldCAtIFRoZSBjYWxsYmFjayBjYWxsZWUgb2YgdGhlIGV2ZW50IGxpc3RlbmVyXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvZmYgKGtleTogc3RyaW5nLCBjYWxsYmFjaz86IEZ1bmN0aW9uLCB0YXJnZXQ/OiBPYmplY3QpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5fY2FsbGJhY2tUYWJsZVtrZXldO1xyXG4gICAgICAgIGlmIChsaXN0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZm9zID0gbGlzdC5jYWxsYmFja0luZm9zO1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5mb3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmZvID0gaW5mb3NbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8gJiYgaW5mby5jYWxsYmFjayA9PT0gY2FsbGJhY2sgJiYgaW5mby50YXJnZXQgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LmNhbmNlbChpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGwoa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmtL7lj5HkuIDkuKrmjIflrprkuovku7bvvIzlubbkvKDpgJLpnIDopoHnmoTlj4LmlbBcclxuICAgICAqIEBlbiBUcmlnZ2VyIGFuIGV2ZW50IGRpcmVjdGx5IHdpdGggdGhlIGV2ZW50IG5hbWUgYW5kIG5lY2Vzc2FyeSBhcmd1bWVudHMuXHJcbiAgICAgKiBAcGFyYW0ga2V5IC0gZXZlbnQgdHlwZVxyXG4gICAgICogQHBhcmFtIGFyZzAgLSBUaGUgZmlyc3QgYXJndW1lbnQgdG8gYmUgcGFzc2VkIHRvIHRoZSBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIGFyZzEgLSBUaGUgc2Vjb25kIGFyZ3VtZW50IHRvIGJlIHBhc3NlZCB0byB0aGUgY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSBhcmcyIC0gVGhlIHRoaXJkIGFyZ3VtZW50IHRvIGJlIHBhc3NlZCB0byB0aGUgY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSBhcmczIC0gVGhlIGZvdXJ0aCBhcmd1bWVudCB0byBiZSBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrXHJcbiAgICAgKiBAcGFyYW0gYXJnNCAtIFRoZSBmaWZ0aCBhcmd1bWVudCB0byBiZSBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbWl0IChrZXk6IHN0cmluZywgYXJnMD86IGFueSwgYXJnMT86IGFueSwgYXJnMj86IGFueSwgYXJnMz86IGFueSwgYXJnND86IGFueSkge1xyXG4gICAgICAgIGNvbnN0IGxpc3Q6IENhbGxiYWNrTGlzdCA9IHRoaXMuX2NhbGxiYWNrVGFibGVba2V5XSE7XHJcbiAgICAgICAgaWYgKGxpc3QpIHtcclxuICAgICAgICAgICAgY29uc3Qgcm9vdEludm9rZXIgPSAhbGlzdC5pc0ludm9raW5nO1xyXG4gICAgICAgICAgICBsaXN0LmlzSW52b2tpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5mb3MgPSBsaXN0LmNhbGxiYWNrSW5mb3M7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBpbmZvcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5mbyA9IGluZm9zW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGluZm8uY2FsbGJhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gaW5mby50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUHJlIG9mZiBvbmNlIGNhbGxiYWNrcyB0byBhdm9pZCBpbmZsdWVuY2Ugb24gbG9naWMgaW4gY2FsbGJhY2tcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5mby5vbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2ZmKGtleSwgY2FsbGJhY2ssIHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIExhenkgY2hlY2sgdmFsaWRpdHkgb2YgY2FsbGJhY2sgdGFyZ2V0LCBcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0YXJnZXQgaXMgQ0NPYmplY3QgYW5kIGlzIG5vIGxvbmdlciB2YWxpZCwgdGhlbiByZW1vdmUgdGhlIGNhbGxiYWNrIGluZm8gZGlyZWN0bHlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWluZm8uY2hlY2soKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9mZihrZXksIGNhbGxiYWNrLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0YXJnZXQsIGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soYXJnMCwgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyb290SW52b2tlcikge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5pc0ludm9raW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5jb250YWluQ2FuY2VsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1cmdlQ2FuY2VsZWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOaJgOacieWbnuiwg+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9jYWxsYmFja1RhYmxlKSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5fY2FsbGJhY2tUYWJsZVtrZXldO1xyXG4gICAgICAgICAgICBpZiAobGlzdCkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tMaXN0UG9vbC5mcmVlKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrVGFibGVba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuaWYgKFRFU1QpIHtcclxuICAgIGxlZ2FjeUNDLl9UZXN0LkNhbGxiYWNrc0ludm9rZXIgPSBDYWxsYmFja3NJbnZva2VyO1xyXG59XHJcbiJdfQ==