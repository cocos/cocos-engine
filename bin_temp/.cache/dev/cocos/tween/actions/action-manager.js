(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/utils/js.js", "../../core/platform/debug.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/utils/js.js"), require("../../core/platform/debug.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global.debug, global.globalExports);
    global.actionManager = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, js, _debug, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ActionManager = void 0;
  js = _interopRequireWildcard(js);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var ID_COUNTER = 0;
  /*
   * @class HashElement
   * @constructor
   * @private
   */

  var HashElement = function HashElement() {
    _classCallCheck(this, HashElement);

    this.actions = [];
    this.target = null;
    this.actionIndex = 0;
    this.currentAction = null;
    this.paused = false;
    this.lock = false;
  };
  /**
   * !#en
   * `ActionManager` is a class that can manage actions.<br/>
   * Normally you won't need to use this class directly. 99% of the cases you will use the CCNode interface,
   * which uses this class's singleton object.
   * But there are some cases where you might need to use this class. <br/>
   * Examples:<br/>
   * - When you want to run an action where the target is different from a CCNode.<br/>
   * - When you want to pause / resume the actions<br/>
   * !#zh
   * `ActionManager` 是可以管理动作的单例类。<br/>
   * 通常你并不需要直接使用这个类，99%的情况您将使用 CCNode 的接口。<br/>
   * 但也有一些情况下，您可能需要使用这个类。 <br/>
   * 例如：
   *  - 当你想要运行一个动作，但目标不是 CCNode 类型时。 <br/>
   *  - 当你想要暂停/恢复动作时。 <br/>
   * @class ActionManager
   * @example {@link cocos2d/core/CCActionManager/ActionManager.js}
   */


  var ActionManager = /*#__PURE__*/function () {
    function ActionManager() {
      _classCallCheck(this, ActionManager);

      this._hashTargets = js.createMap(true);
      this._arrayTargets = [];
      this._elementPool = [];
    }

    _createClass(ActionManager, [{
      key: "_searchElementByTarget",
      value: function _searchElementByTarget(arr, target) {
        for (var k = 0; k < arr.length; k++) {
          if (target === arr[k].target) return arr[k];
        }

        return null;
      }
    }, {
      key: "_getElement",
      value: function _getElement(target, paused) {
        var element = this._elementPool.pop();

        if (!element) {
          element = new HashElement();
        }

        element.target = target;
        element.paused = !!paused;
        return element;
      }
    }, {
      key: "_putElement",
      value: function _putElement(element) {
        element.actions.length = 0;
        element.actionIndex = 0;
        element.currentAction = null;
        element.paused = false;
        element.target = null;
        element.lock = false;

        this._elementPool.push(element);
      }
      /**
       * !#en
       * Adds an action with a target.<br/>
       * If the target is already present, then the action will be added to the existing target.
       * If the target is not present, a new instance of this target will be created either paused or not, and the action will be added to the newly created target.
       * When the target is paused, the queued actions won't be 'ticked'.
       * !#zh
       * 增加一个动作，同时还需要提供动作的目标对象，目标对象是否暂停作为参数。<br/>
       * 如果目标已存在，动作将会被直接添加到现有的节点中。<br/>
       * 如果目标不存在，将为这一目标创建一个新的实例，并将动作添加进去。<br/>
       * 当目标状态的 paused 为 true，动作将不会被执行
       *
       * @method addAction
       * @param {Action} action
       * @param {object} target
       * @param {Boolean} paused
       */

    }, {
      key: "addAction",
      value: function addAction(action, target, paused) {
        if (!action || !target) {
          (0, _debug.errorID)(1000);
          return;
        }

        if (target.uuid == null) {
          target.uuid = '_TWEEN_UUID_' + ID_COUNTER++;
        } //check if the action target already exists


        var element = this._hashTargets[target.uuid]; //if doesn't exists, create a hashelement and push in mpTargets

        if (!element) {
          element = this._getElement(target, paused);
          this._hashTargets[target.uuid] = element;

          this._arrayTargets.push(element);
        } else if (!element.actions) {
          element.actions = [];
        }

        element.actions.push(action);
        action.startWithTarget(target);
      }
      /**
       * !#en Removes all actions from all the targets.
       * !#zh 移除所有对象的所有动作。
       * @method removeAllActions
       */

    }, {
      key: "removeAllActions",
      value: function removeAllActions() {
        var locTargets = this._arrayTargets;

        for (var i = 0; i < locTargets.length; i++) {
          var element = locTargets[i];
          if (element) this._putElement(element);
        }

        this._arrayTargets.length = 0;
        this._hashTargets = js.createMap(true);
      }
      /**
       * !#en
       * Removes all actions from a certain target. <br/>
       * All the actions that belongs to the target will be removed.
       * !#zh
       * 移除指定对象上的所有动作。<br/>
       * 属于该目标的所有的动作将被删除。
       * @method removeAllActionsFromTarget
       * @param {Node} target
       */

    }, {
      key: "removeAllActionsFromTarget",
      value: function removeAllActionsFromTarget(target) {
        // explicit null handling
        if (target == null) return;
        var element = this._hashTargets[target.uuid];

        if (element) {
          element.actions.length = 0;

          this._deleteHashElement(element);
        }
      }
      /**
       * !#en Removes an action given an action reference.
       * !#zh 移除指定的动作。
       * @method removeAction
       * @param {Action} action
       */

    }, {
      key: "removeAction",
      value: function removeAction(action) {
        // explicit null handling
        if (action == null) return;
        var target = action.getOriginalTarget();
        var element = this._hashTargets[target.uuid];

        if (element) {
          for (var i = 0; i < element.actions.length; i++) {
            if (element.actions[i] === action) {
              element.actions.splice(i, 1); // update actionIndex in case we are in tick. looping over the actions

              if (element.actionIndex >= i) element.actionIndex--;
              break;
            }
          }
        }
      }
    }, {
      key: "_removeActionByTag",
      value: function _removeActionByTag(tag, element, target) {
        for (var i = 0, l = element.actions.length; i < l; ++i) {
          var action = element.actions[i];

          if (action && action.getTag() === tag) {
            if (target && action.getOriginalTarget() !== target) {
              continue;
            }

            this._removeActionAtIndex(i, element);

            break;
          }
        }
      }
      /**
       * !#en Removes an action given its tag and the target.
       * !#zh 删除指定对象下特定标签的一个动作，将删除首个匹配到的动作。
       * @method removeActionByTag
       * @param {Number} tag
       * @param {Node} target
       */

    }, {
      key: "removeActionByTag",
      value: function removeActionByTag(tag, target) {
        if (tag === _globalExports.legacyCC.Action.TAG_INVALID) (0, _debug.logID)(1002);
        var hashTargets = this._hashTargets;

        if (target) {
          var element = hashTargets[target.uuid];

          if (element) {
            this._removeActionByTag(tag, element, target);
          }
        } else {
          for (var name in hashTargets) {
            var _element = hashTargets[name];

            this._removeActionByTag(tag, _element);
          }
        }
      }
      /**
       * !#en Gets an action given its tag an a target.
       * !#zh 通过目标对象和标签获取一个动作。
       * @method getActionByTag
       * @param {Number} tag
       * @param {Node} target
       * @return {Action|null}  return the Action with the given tag on success
       */

    }, {
      key: "getActionByTag",
      value: function getActionByTag(tag, target) {
        if (tag === _globalExports.legacyCC.Action.TAG_INVALID) (0, _debug.logID)(1004);
        var element = this._hashTargets[target.uuid];

        if (element) {
          if (element.actions != null) {
            for (var i = 0; i < element.actions.length; ++i) {
              var action = element.actions[i];
              if (action && action.getTag() === tag) return action;
            }
          }

          (0, _debug.logID)(1005, tag);
        }

        return null;
      }
      /**
       * !#en
       * Returns the numbers of actions that are running in a certain target. <br/>
       * Composable actions are counted as 1 action. <br/>
       * Example: <br/>
       * - If you are running 1 Sequence of 7 actions, it will return 1. <br/>
       * - If you are running 7 Sequences of 2 actions, it will return 7.
       * !#zh
       * 返回指定对象下所有正在运行的动作数量。 <br/>
       * 组合动作被算作一个动作。<br/>
       * 例如：<br/>
       *  - 如果您正在运行 7 个动作组成的序列动作（Sequence），这个函数将返回 1。<br/>
       *  - 如果你正在运行 2 个序列动作（Sequence）和 5 个普通动作，这个函数将返回 7。<br/>
       *
       * @method getNumberOfRunningActionsInTarget
       * @param {Node} target
       * @return {Number}
       */

    }, {
      key: "getNumberOfRunningActionsInTarget",
      value: function getNumberOfRunningActionsInTarget(target) {
        var element = this._hashTargets[target.uuid];
        if (element) return element.actions ? element.actions.length : 0;
        return 0;
      }
      /**
       * !#en Pauses the target: all running actions and newly added actions will be paused.
       * !#zh 暂停指定对象：所有正在运行的动作和新添加的动作都将会暂停。
       * @method pauseTarget
       * @param {Node} target
       */

    }, {
      key: "pauseTarget",
      value: function pauseTarget(target) {
        var element = this._hashTargets[target.uuid];
        if (element) element.paused = true;
      }
      /**
       * !#en Resumes the target. All queued actions will be resumed.
       * !#zh 让指定目标恢复运行。在执行序列中所有被暂停的动作将重新恢复运行。
       * @method resumeTarget
       * @param {Node} target
       */

    }, {
      key: "resumeTarget",
      value: function resumeTarget(target) {
        var element = this._hashTargets[target.uuid];
        if (element) element.paused = false;
      }
      /**
       * !#en Pauses all running actions, returning a list of targets whose actions were paused.
       * !#zh 暂停所有正在运行的动作，返回一个包含了那些动作被暂停了的目标对象的列表。
       * @method pauseAllRunningActions
       * @return {Array}  a list of targets whose actions were paused.
       */

    }, {
      key: "pauseAllRunningActions",
      value: function pauseAllRunningActions() {
        var idsWithActions = [];
        var locTargets = this._arrayTargets;

        for (var i = 0; i < locTargets.length; i++) {
          var element = locTargets[i];

          if (element && !element.paused) {
            element.paused = true;
            idsWithActions.push(element.target);
          }
        }

        return idsWithActions;
      }
      /**
       * !#en Resume a set of targets (convenience function to reverse a pauseAllRunningActions or pauseTargets call).
       * !#zh 让一组指定对象恢复运行（用来逆转 pauseAllRunningActions 效果的便捷函数）。
       * @method resumeTargets
       * @param {Array} targetsToResume
       */

    }, {
      key: "resumeTargets",
      value: function resumeTargets(targetsToResume) {
        if (!targetsToResume) return;

        for (var i = 0; i < targetsToResume.length; i++) {
          if (targetsToResume[i]) this.resumeTarget(targetsToResume[i]);
        }
      }
      /**
       * !#en Pause a set of targets.
       * !#zh 暂停一组指定对象。
       * @method pauseTargets
       * @param {Array} targetsToPause
       */

    }, {
      key: "pauseTargets",
      value: function pauseTargets(targetsToPause) {
        if (!targetsToPause) return;

        for (var i = 0; i < targetsToPause.length; i++) {
          if (targetsToPause[i]) this.pauseTarget(targetsToPause[i]);
        }
      }
      /**
       * !#en
       * purges the shared action manager. It releases the retained instance. <br/>
       * because it uses this, so it can not be static.
       * !#zh
       * 清除共用的动作管理器。它释放了持有的实例。 <br/>
       * 因为它使用 this，因此它不能是静态的。
       * @method purgeSharedManager
       */

    }, {
      key: "purgeSharedManager",
      value: function purgeSharedManager() {
        _globalExports.legacyCC.director.getScheduler().unscheduleUpdate(this);
      } //protected

    }, {
      key: "_removeActionAtIndex",
      value: function _removeActionAtIndex(index, element) {
        var action = element.actions[index];
        element.actions.splice(index, 1); // update actionIndex in case we are in tick. looping over the actions

        if (element.actionIndex >= index) element.actionIndex--;

        if (element.actions.length === 0) {
          this._deleteHashElement(element);
        }
      }
    }, {
      key: "_deleteHashElement",
      value: function _deleteHashElement(element) {
        var ret = false;

        if (element && !element.lock) {
          if (this._hashTargets[element.target.uuid]) {
            delete this._hashTargets[element.target.uuid];
            var targets = this._arrayTargets;

            for (var i = 0, l = targets.length; i < l; i++) {
              if (targets[i] === element) {
                targets.splice(i, 1);
                break;
              }
            }

            this._putElement(element);

            ret = true;
          }
        }

        return ret;
      }
      /**
       * !#en The ActionManager update。
       * !#zh ActionManager 主循环。
       * @method update
       * @param {Number} dt delta time in seconds
       */

    }, {
      key: "update",
      value: function update(dt) {
        var locTargets = this._arrayTargets;
        var locCurrTarget;

        for (var elt = 0; elt < locTargets.length; elt++) {
          this._currentTarget = locTargets[elt];
          locCurrTarget = this._currentTarget;

          if (!locCurrTarget.paused && locCurrTarget.actions) {
            locCurrTarget.lock = true; // The 'actions' CCMutableArray may change while inside this loop.

            for (locCurrTarget.actionIndex = 0; locCurrTarget.actionIndex < locCurrTarget.actions.length; locCurrTarget.actionIndex++) {
              locCurrTarget.currentAction = locCurrTarget.actions[locCurrTarget.actionIndex];
              if (!locCurrTarget.currentAction) continue; //use for speed

              locCurrTarget.currentAction.step(dt * (locCurrTarget.currentAction._speedMethod ? locCurrTarget.currentAction._speed : 1));

              if (locCurrTarget.currentAction && locCurrTarget.currentAction.isDone()) {
                locCurrTarget.currentAction.stop();
                var action = locCurrTarget.currentAction; // Make currentAction nil to prevent removeAction from salvaging it.

                locCurrTarget.currentAction = null;
                this.removeAction(action);
              }

              locCurrTarget.currentAction = null;
            }

            locCurrTarget.lock = false;
          } // only delete currentTarget if no actions were scheduled during the cycle (issue #481)


          if (locCurrTarget.actions.length === 0) {
            this._deleteHashElement(locCurrTarget) && elt--;
          }
        }
      }
    }]);

    return ActionManager;
  }();

  _exports.ActionManager = ActionManager;
  ;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3R3ZWVuL2FjdGlvbnMvYWN0aW9uLW1hbmFnZXIudHMiXSwibmFtZXMiOlsiSURfQ09VTlRFUiIsIkhhc2hFbGVtZW50IiwiYWN0aW9ucyIsInRhcmdldCIsImFjdGlvbkluZGV4IiwiY3VycmVudEFjdGlvbiIsInBhdXNlZCIsImxvY2siLCJBY3Rpb25NYW5hZ2VyIiwiX2hhc2hUYXJnZXRzIiwianMiLCJjcmVhdGVNYXAiLCJfYXJyYXlUYXJnZXRzIiwiX2VsZW1lbnRQb29sIiwiYXJyIiwiayIsImxlbmd0aCIsImVsZW1lbnQiLCJwb3AiLCJwdXNoIiwiYWN0aW9uIiwidXVpZCIsIl9nZXRFbGVtZW50Iiwic3RhcnRXaXRoVGFyZ2V0IiwibG9jVGFyZ2V0cyIsImkiLCJfcHV0RWxlbWVudCIsIl9kZWxldGVIYXNoRWxlbWVudCIsImdldE9yaWdpbmFsVGFyZ2V0Iiwic3BsaWNlIiwidGFnIiwibCIsImdldFRhZyIsIl9yZW1vdmVBY3Rpb25BdEluZGV4IiwibGVnYWN5Q0MiLCJBY3Rpb24iLCJUQUdfSU5WQUxJRCIsImhhc2hUYXJnZXRzIiwiX3JlbW92ZUFjdGlvbkJ5VGFnIiwibmFtZSIsImlkc1dpdGhBY3Rpb25zIiwidGFyZ2V0c1RvUmVzdW1lIiwicmVzdW1lVGFyZ2V0IiwidGFyZ2V0c1RvUGF1c2UiLCJwYXVzZVRhcmdldCIsImRpcmVjdG9yIiwiZ2V0U2NoZWR1bGVyIiwidW5zY2hlZHVsZVVwZGF0ZSIsImluZGV4IiwicmV0IiwidGFyZ2V0cyIsImR0IiwibG9jQ3VyclRhcmdldCIsImVsdCIsIl9jdXJyZW50VGFyZ2V0Iiwic3RlcCIsIl9zcGVlZE1ldGhvZCIsIl9zcGVlZCIsImlzRG9uZSIsInN0b3AiLCJyZW1vdmVBY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQ0EsTUFBSUEsVUFBVSxHQUFHLENBQWpCO0FBRUE7Ozs7OztN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LEVBQTlGLEVBQTJIO0FBQ3ZIZ0QsY0FBQUEsYUFBYSxDQUFDL0MsYUFBZCxHQUE4QitDLGFBQWEsQ0FBQ2xELE9BQWQsQ0FBc0JrRCxhQUFhLENBQUNoRCxXQUFwQyxDQUE5QjtBQUNBLGtCQUFJLENBQUNnRCxhQUFhLENBQUMvQyxhQUFuQixFQUNJLFNBSG1ILENBS3ZIOztBQUNBK0MsY0FBQUEsYUFBYSxDQUFDL0MsYUFBZCxDQUE0QmtELElBQTVCLENBQWlDSixFQUFFLElBQUlDLGFBQWEsQ0FBQy9DLGFBQWQsQ0FBNEJtRCxZQUE1QixHQUEyQ0osYUFBYSxDQUFDL0MsYUFBZCxDQUE0Qm9ELE1BQXZFLEdBQWdGLENBQXBGLENBQW5DOztBQUVBLGtCQUFJTCxhQUFhLENBQUMvQyxhQUFkLElBQStCK0MsYUFBYSxDQUFDL0MsYUFBZCxDQUE0QnFELE1BQTVCLEVBQW5DLEVBQXlFO0FBQ3JFTixnQkFBQUEsYUFBYSxDQUFDL0MsYUFBZCxDQUE0QnNELElBQTVCO0FBQ0Esb0JBQUl2QyxNQUFNLEdBQUdnQyxhQUFhLENBQUMvQyxhQUEzQixDQUZxRSxDQUdyRTs7QUFDQStDLGdCQUFBQSxhQUFhLENBQUMvQyxhQUFkLEdBQThCLElBQTlCO0FBQ0EscUJBQUt1RCxZQUFMLENBQWtCeEMsTUFBbEI7QUFDSDs7QUFFRGdDLGNBQUFBLGFBQWEsQ0FBQy9DLGFBQWQsR0FBOEIsSUFBOUI7QUFDSDs7QUFDRCtDLFlBQUFBLGFBQWEsQ0FBQzdDLElBQWQsR0FBcUIsS0FBckI7QUFDSCxXQXpCNkMsQ0EwQjlDOzs7QUFDQSxjQUFJNkMsYUFBYSxDQUFDbEQsT0FBZCxDQUFzQmMsTUFBdEIsS0FBaUMsQ0FBckMsRUFBd0M7QUFDcEMsaUJBQUtXLGtCQUFMLENBQXdCeUIsYUFBeEIsS0FBMENDLEdBQUcsRUFBN0M7QUFDSDtBQUNKO0FBQ0o7Ozs7Ozs7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcclxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuXHJcbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxyXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgKiBhcyBqcyBmcm9tICcuLi8uLi9jb3JlL3V0aWxzL2pzJztcclxuaW1wb3J0IHsgZXJyb3JJRCwgbG9nSUQsIGFzc2VydElEIH0gZnJvbSAnLi4vLi4vY29yZS9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4vYWN0aW9uJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxubGV0IElEX0NPVU5URVIgPSAwO1xyXG5cclxuLypcclxuICogQGNsYXNzIEhhc2hFbGVtZW50XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuY2xhc3MgSGFzaEVsZW1lbnQge1xyXG4gICAgYWN0aW9ucyA9IFtdO1xyXG4gICAgdGFyZ2V0OiBvYmplY3QgfCBudWxsID0gbnVsbDsgLy9jY29iamVjdFxyXG4gICAgYWN0aW9uSW5kZXggPSAwO1xyXG4gICAgY3VycmVudEFjdGlvbiA9IG51bGw7IC8vQ0NBY3Rpb25cclxuICAgIHBhdXNlZCA9IGZhbHNlO1xyXG4gICAgbG9jayA9IGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogISNlblxyXG4gKiBgQWN0aW9uTWFuYWdlcmAgaXMgYSBjbGFzcyB0aGF0IGNhbiBtYW5hZ2UgYWN0aW9ucy48YnIvPlxyXG4gKiBOb3JtYWxseSB5b3Ugd29uJ3QgbmVlZCB0byB1c2UgdGhpcyBjbGFzcyBkaXJlY3RseS4gOTklIG9mIHRoZSBjYXNlcyB5b3Ugd2lsbCB1c2UgdGhlIENDTm9kZSBpbnRlcmZhY2UsXHJcbiAqIHdoaWNoIHVzZXMgdGhpcyBjbGFzcydzIHNpbmdsZXRvbiBvYmplY3QuXHJcbiAqIEJ1dCB0aGVyZSBhcmUgc29tZSBjYXNlcyB3aGVyZSB5b3UgbWlnaHQgbmVlZCB0byB1c2UgdGhpcyBjbGFzcy4gPGJyLz5cclxuICogRXhhbXBsZXM6PGJyLz5cclxuICogLSBXaGVuIHlvdSB3YW50IHRvIHJ1biBhbiBhY3Rpb24gd2hlcmUgdGhlIHRhcmdldCBpcyBkaWZmZXJlbnQgZnJvbSBhIENDTm9kZS48YnIvPlxyXG4gKiAtIFdoZW4geW91IHdhbnQgdG8gcGF1c2UgLyByZXN1bWUgdGhlIGFjdGlvbnM8YnIvPlxyXG4gKiAhI3poXHJcbiAqIGBBY3Rpb25NYW5hZ2VyYCDmmK/lj6/ku6XnrqHnkIbliqjkvZznmoTljZXkvovnsbvjgII8YnIvPlxyXG4gKiDpgJrluLjkvaDlubbkuI3pnIDopoHnm7TmjqXkvb/nlKjov5nkuKrnsbvvvIw5OSXnmoTmg4XlhrXmgqjlsIbkvb/nlKggQ0NOb2RlIOeahOaOpeWPo+OAgjxici8+XHJcbiAqIOS9huS5n+acieS4gOS6m+aDheWGteS4i++8jOaCqOWPr+iDvemcgOimgeS9v+eUqOi/meS4quexu+OAgiA8YnIvPlxyXG4gKiDkvovlpoLvvJpcclxuICogIC0g5b2T5L2g5oOz6KaB6L+Q6KGM5LiA5Liq5Yqo5L2c77yM5L2G55uu5qCH5LiN5pivIENDTm9kZSDnsbvlnovml7bjgIIgPGJyLz5cclxuICogIC0g5b2T5L2g5oOz6KaB5pqC5YGcL+aBouWkjeWKqOS9nOaXtuOAgiA8YnIvPlxyXG4gKiBAY2xhc3MgQWN0aW9uTWFuYWdlclxyXG4gKiBAZXhhbXBsZSB7QGxpbmsgY29jb3MyZC9jb3JlL0NDQWN0aW9uTWFuYWdlci9BY3Rpb25NYW5hZ2VyLmpzfVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFjdGlvbk1hbmFnZXIge1xyXG4gICAgcHJpdmF0ZSBfaGFzaFRhcmdldHMgPSBqcy5jcmVhdGVNYXAodHJ1ZSk7XHJcbiAgICBwcml2YXRlIF9hcnJheVRhcmdldHM6IEhhc2hFbGVtZW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRUYXJnZXQhOiBIYXNoRWxlbWVudDtcclxuICAgIHByaXZhdGUgX2VsZW1lbnRQb29sOiBIYXNoRWxlbWVudFtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VhcmNoRWxlbWVudEJ5VGFyZ2V0IChhcnI6IEhhc2hFbGVtZW50W10sIHRhcmdldDogb2JqZWN0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBhcnIubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gYXJyW2tdLnRhcmdldClcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcnJba107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldEVsZW1lbnQgKHRhcmdldDogb2JqZWN0LCBwYXVzZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRQb29sLnBvcCgpO1xyXG4gICAgICAgIGlmICghZWxlbWVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gbmV3IEhhc2hFbGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsZW1lbnQudGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgIGVsZW1lbnQucGF1c2VkID0gISFwYXVzZWQ7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcHV0RWxlbWVudCAoZWxlbWVudDogSGFzaEVsZW1lbnQpIHtcclxuICAgICAgICBlbGVtZW50LmFjdGlvbnMubGVuZ3RoID0gMDtcclxuICAgICAgICBlbGVtZW50LmFjdGlvbkluZGV4ID0gMDtcclxuICAgICAgICBlbGVtZW50LmN1cnJlbnRBY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIGVsZW1lbnQucGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgZWxlbWVudC50YXJnZXQgPSBudWxsO1xyXG4gICAgICAgIGVsZW1lbnQubG9jayA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnRQb29sLnB1c2goZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuXHJcbiAgICAgKiBBZGRzIGFuIGFjdGlvbiB3aXRoIGEgdGFyZ2V0Ljxici8+XHJcbiAgICAgKiBJZiB0aGUgdGFyZ2V0IGlzIGFscmVhZHkgcHJlc2VudCwgdGhlbiB0aGUgYWN0aW9uIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGV4aXN0aW5nIHRhcmdldC5cclxuICAgICAqIElmIHRoZSB0YXJnZXQgaXMgbm90IHByZXNlbnQsIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgdGFyZ2V0IHdpbGwgYmUgY3JlYXRlZCBlaXRoZXIgcGF1c2VkIG9yIG5vdCwgYW5kIHRoZSBhY3Rpb24gd2lsbCBiZSBhZGRlZCB0byB0aGUgbmV3bHkgY3JlYXRlZCB0YXJnZXQuXHJcbiAgICAgKiBXaGVuIHRoZSB0YXJnZXQgaXMgcGF1c2VkLCB0aGUgcXVldWVkIGFjdGlvbnMgd29uJ3QgYmUgJ3RpY2tlZCcuXHJcbiAgICAgKiAhI3poXHJcbiAgICAgKiDlop7liqDkuIDkuKrliqjkvZzvvIzlkIzml7bov5jpnIDopoHmj5DkvpvliqjkvZznmoTnm67moIflr7nosaHvvIznm67moIflr7nosaHmmK/lkKbmmoLlgZzkvZzkuLrlj4LmlbDjgII8YnIvPlxyXG4gICAgICog5aaC5p6c55uu5qCH5bey5a2Y5Zyo77yM5Yqo5L2c5bCG5Lya6KKr55u05o6l5re75Yqg5Yiw546w5pyJ55qE6IqC54K55Lit44CCPGJyLz5cclxuICAgICAqIOWmguaenOebruagh+S4jeWtmOWcqO+8jOWwhuS4uui/meS4gOebruagh+WIm+W7uuS4gOS4quaWsOeahOWunuS+i++8jOW5tuWwhuWKqOS9nOa3u+WKoOi/m+WOu+OAgjxici8+XHJcbiAgICAgKiDlvZPnm67moIfnirbmgIHnmoQgcGF1c2VkIOS4uiB0cnVl77yM5Yqo5L2c5bCG5LiN5Lya6KKr5omn6KGMXHJcbiAgICAgKlxyXG4gICAgICogQG1ldGhvZCBhZGRBY3Rpb25cclxuICAgICAqIEBwYXJhbSB7QWN0aW9ufSBhY3Rpb25cclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcGF1c2VkXHJcbiAgICAgKi9cclxuICAgIGFkZEFjdGlvbiAoYWN0aW9uOiBBY3Rpb24sIHRhcmdldDogTm9kZSwgcGF1c2VkOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCFhY3Rpb24gfHwgIXRhcmdldCkge1xyXG4gICAgICAgICAgICBlcnJvcklEKDEwMDApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGFyZ2V0LnV1aWQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAodGFyZ2V0IGFzIGFueSkudXVpZCA9ICdfVFdFRU5fVVVJRF8nICsgSURfQ09VTlRFUisrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9jaGVjayBpZiB0aGUgYWN0aW9uIHRhcmdldCBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5faGFzaFRhcmdldHNbdGFyZ2V0LnV1aWRdO1xyXG4gICAgICAgIC8vaWYgZG9lc24ndCBleGlzdHMsIGNyZWF0ZSBhIGhhc2hlbGVtZW50IGFuZCBwdXNoIGluIG1wVGFyZ2V0c1xyXG4gICAgICAgIGlmICghZWxlbWVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5fZ2V0RWxlbWVudCh0YXJnZXQsIHBhdXNlZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhc2hUYXJnZXRzW3RhcmdldC51dWlkXSA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2FycmF5VGFyZ2V0cy5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghZWxlbWVudC5hY3Rpb25zKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWN0aW9ucyA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxlbWVudC5hY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuICAgICAgICBhY3Rpb24uc3RhcnRXaXRoVGFyZ2V0KHRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuIFJlbW92ZXMgYWxsIGFjdGlvbnMgZnJvbSBhbGwgdGhlIHRhcmdldHMuXHJcbiAgICAgKiAhI3poIOenu+mZpOaJgOacieWvueixoeeahOaJgOacieWKqOS9nOOAglxyXG4gICAgICogQG1ldGhvZCByZW1vdmVBbGxBY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUFsbEFjdGlvbnMgKCkge1xyXG4gICAgICAgIHZhciBsb2NUYXJnZXRzID0gdGhpcy5fYXJyYXlUYXJnZXRzO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9jVGFyZ2V0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGxvY1RhcmdldHNbaV07XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHV0RWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXJyYXlUYXJnZXRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5faGFzaFRhcmdldHMgPSBqcy5jcmVhdGVNYXAodHJ1ZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqICEjZW5cclxuICAgICAqIFJlbW92ZXMgYWxsIGFjdGlvbnMgZnJvbSBhIGNlcnRhaW4gdGFyZ2V0LiA8YnIvPlxyXG4gICAgICogQWxsIHRoZSBhY3Rpb25zIHRoYXQgYmVsb25ncyB0byB0aGUgdGFyZ2V0IHdpbGwgYmUgcmVtb3ZlZC5cclxuICAgICAqICEjemhcclxuICAgICAqIOenu+mZpOaMh+WumuWvueixoeS4iueahOaJgOacieWKqOS9nOOAgjxici8+XHJcbiAgICAgKiDlsZ7kuo7or6Xnm67moIfnmoTmiYDmnInnmoTliqjkvZzlsIbooqvliKDpmaTjgIJcclxuICAgICAqIEBtZXRob2QgcmVtb3ZlQWxsQWN0aW9uc0Zyb21UYXJnZXRcclxuICAgICAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUFsbEFjdGlvbnNGcm9tVGFyZ2V0ICh0YXJnZXQ6IE5vZGUpIHtcclxuICAgICAgICAvLyBleHBsaWNpdCBudWxsIGhhbmRsaW5nXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9oYXNoVGFyZ2V0c1t0YXJnZXQudXVpZF07XHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5hY3Rpb25zLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGV0ZUhhc2hFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogISNlbiBSZW1vdmVzIGFuIGFjdGlvbiBnaXZlbiBhbiBhY3Rpb24gcmVmZXJlbmNlLlxyXG4gICAgICogISN6aCDnp7vpmaTmjIflrprnmoTliqjkvZzjgIJcclxuICAgICAqIEBtZXRob2QgcmVtb3ZlQWN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge0FjdGlvbn0gYWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUFjdGlvbiAoYWN0aW9uOiBBY3Rpb24pIHtcclxuICAgICAgICAvLyBleHBsaWNpdCBudWxsIGhhbmRsaW5nXHJcbiAgICAgICAgaWYgKGFjdGlvbiA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IGFjdGlvbi5nZXRPcmlnaW5hbFRhcmdldCgpITtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2hhc2hUYXJnZXRzW3RhcmdldC51dWlkXTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50LmFjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmFjdGlvbnNbaV0gPT09IGFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWN0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIGFjdGlvbkluZGV4IGluIGNhc2Ugd2UgYXJlIGluIHRpY2suIGxvb3Bpbmcgb3ZlciB0aGUgYWN0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmFjdGlvbkluZGV4ID49IGkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWN0aW9uSW5kZXgtLTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfcmVtb3ZlQWN0aW9uQnlUYWcgKHRhZzogbnVtYmVyLCBlbGVtZW50OiBhbnksIHRhcmdldD86IE5vZGUpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGVsZW1lbnQuYWN0aW9ucy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIGFjdGlvbiA9IGVsZW1lbnQuYWN0aW9uc1tpXTtcclxuICAgICAgICAgICAgaWYgKGFjdGlvbiAmJiBhY3Rpb24uZ2V0VGFnKCkgPT09IHRhZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAmJiBhY3Rpb24uZ2V0T3JpZ2luYWxUYXJnZXQoKSAhPT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVBY3Rpb25BdEluZGV4KGksIGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuIFJlbW92ZXMgYW4gYWN0aW9uIGdpdmVuIGl0cyB0YWcgYW5kIHRoZSB0YXJnZXQuXHJcbiAgICAgKiAhI3poIOWIoOmZpOaMh+WumuWvueixoeS4i+eJueWumuagh+etvueahOS4gOS4quWKqOS9nO+8jOWwhuWIoOmZpOmmluS4quWMuemFjeWIsOeahOWKqOS9nOOAglxyXG4gICAgICogQG1ldGhvZCByZW1vdmVBY3Rpb25CeVRhZ1xyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRhZ1xyXG4gICAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlQWN0aW9uQnlUYWcgKHRhZzogbnVtYmVyLCB0YXJnZXQ/OiBOb2RlKSB7XHJcbiAgICAgICAgaWYgKHRhZyA9PT0gbGVnYWN5Q0MuQWN0aW9uLlRBR19JTlZBTElEKVxyXG4gICAgICAgICAgICBsb2dJRCgxMDAyKTtcclxuXHJcbiAgICAgICAgbGV0IGhhc2hUYXJnZXRzID0gdGhpcy5faGFzaFRhcmdldHM7XHJcbiAgICAgICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGhhc2hUYXJnZXRzW3RhcmdldC51dWlkXTtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUFjdGlvbkJ5VGFnKHRhZywgZWxlbWVudCwgdGFyZ2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBoYXNoVGFyZ2V0cykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBoYXNoVGFyZ2V0c1tuYW1lXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUFjdGlvbkJ5VGFnKHRhZywgZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuIEdldHMgYW4gYWN0aW9uIGdpdmVuIGl0cyB0YWcgYW4gYSB0YXJnZXQuXHJcbiAgICAgKiAhI3poIOmAmui/h+ebruagh+WvueixoeWSjOagh+etvuiOt+WPluS4gOS4quWKqOS9nOOAglxyXG4gICAgICogQG1ldGhvZCBnZXRBY3Rpb25CeVRhZ1xyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRhZ1xyXG4gICAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcclxuICAgICAqIEByZXR1cm4ge0FjdGlvbnxudWxsfSAgcmV0dXJuIHRoZSBBY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gdGFnIG9uIHN1Y2Nlc3NcclxuICAgICAqL1xyXG4gICAgZ2V0QWN0aW9uQnlUYWcgKHRhZzogbnVtYmVyLCB0YXJnZXQ6IE5vZGUpOiBBY3Rpb24gfCBudWxsIHtcclxuICAgICAgICBpZiAodGFnID09PSBsZWdhY3lDQy5BY3Rpb24uVEFHX0lOVkFMSUQpXHJcbiAgICAgICAgICAgIGxvZ0lEKDEwMDQpO1xyXG5cclxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2hhc2hUYXJnZXRzW3RhcmdldC51dWlkXTtcclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5hY3Rpb25zICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudC5hY3Rpb25zLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdGlvbiA9IGVsZW1lbnQuYWN0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uICYmIGFjdGlvbi5nZXRUYWcoKSA9PT0gdGFnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxvZ0lEKDEwMDUsIHRhZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqICEjZW5cclxuICAgICAqIFJldHVybnMgdGhlIG51bWJlcnMgb2YgYWN0aW9ucyB0aGF0IGFyZSBydW5uaW5nIGluIGEgY2VydGFpbiB0YXJnZXQuIDxici8+XHJcbiAgICAgKiBDb21wb3NhYmxlIGFjdGlvbnMgYXJlIGNvdW50ZWQgYXMgMSBhY3Rpb24uIDxici8+XHJcbiAgICAgKiBFeGFtcGxlOiA8YnIvPlxyXG4gICAgICogLSBJZiB5b3UgYXJlIHJ1bm5pbmcgMSBTZXF1ZW5jZSBvZiA3IGFjdGlvbnMsIGl0IHdpbGwgcmV0dXJuIDEuIDxici8+XHJcbiAgICAgKiAtIElmIHlvdSBhcmUgcnVubmluZyA3IFNlcXVlbmNlcyBvZiAyIGFjdGlvbnMsIGl0IHdpbGwgcmV0dXJuIDcuXHJcbiAgICAgKiAhI3poXHJcbiAgICAgKiDov5Tlm57mjIflrprlr7nosaHkuIvmiYDmnInmraPlnKjov5DooYznmoTliqjkvZzmlbDph4/jgIIgPGJyLz5cclxuICAgICAqIOe7hOWQiOWKqOS9nOiiq+eul+S9nOS4gOS4quWKqOS9nOOAgjxici8+XHJcbiAgICAgKiDkvovlpoLvvJo8YnIvPlxyXG4gICAgICogIC0g5aaC5p6c5oKo5q2j5Zyo6L+Q6KGMIDcg5Liq5Yqo5L2c57uE5oiQ55qE5bqP5YiX5Yqo5L2c77yIU2VxdWVuY2XvvInvvIzov5nkuKrlh73mlbDlsIbov5Tlm54gMeOAgjxici8+XHJcbiAgICAgKiAgLSDlpoLmnpzkvaDmraPlnKjov5DooYwgMiDkuKrluo/liJfliqjkvZzvvIhTZXF1ZW5jZe+8ieWSjCA1IOS4quaZrumAmuWKqOS9nO+8jOi/meS4quWHveaVsOWwhui/lOWbniA344CCPGJyLz5cclxuICAgICAqXHJcbiAgICAgKiBAbWV0aG9kIGdldE51bWJlck9mUnVubmluZ0FjdGlvbnNJblRhcmdldFxyXG4gICAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcclxuICAgICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0TnVtYmVyT2ZSdW5uaW5nQWN0aW9uc0luVGFyZ2V0ICh0YXJnZXQ6IE5vZGUpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5faGFzaFRhcmdldHNbdGFyZ2V0LnV1aWRdO1xyXG4gICAgICAgIGlmIChlbGVtZW50KVxyXG4gICAgICAgICAgICByZXR1cm4gKGVsZW1lbnQuYWN0aW9ucykgPyBlbGVtZW50LmFjdGlvbnMubGVuZ3RoIDogMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqICEjZW4gUGF1c2VzIHRoZSB0YXJnZXQ6IGFsbCBydW5uaW5nIGFjdGlvbnMgYW5kIG5ld2x5IGFkZGVkIGFjdGlvbnMgd2lsbCBiZSBwYXVzZWQuXHJcbiAgICAgKiAhI3poIOaaguWBnOaMh+WumuWvueixoe+8muaJgOacieato+WcqOi/kOihjOeahOWKqOS9nOWSjOaWsOa3u+WKoOeahOWKqOS9nOmDveWwhuS8muaaguWBnOOAglxyXG4gICAgICogQG1ldGhvZCBwYXVzZVRhcmdldFxyXG4gICAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcclxuICAgICAqL1xyXG4gICAgcGF1c2VUYXJnZXQgKHRhcmdldDogTm9kZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5faGFzaFRhcmdldHNbdGFyZ2V0LnV1aWRdO1xyXG4gICAgICAgIGlmIChlbGVtZW50KVxyXG4gICAgICAgICAgICBlbGVtZW50LnBhdXNlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqICEjZW4gUmVzdW1lcyB0aGUgdGFyZ2V0LiBBbGwgcXVldWVkIGFjdGlvbnMgd2lsbCBiZSByZXN1bWVkLlxyXG4gICAgICogISN6aCDorqnmjIflrprnm67moIfmgaLlpI3ov5DooYzjgILlnKjmiafooYzluo/liJfkuK3miYDmnInooqvmmoLlgZznmoTliqjkvZzlsIbph43mlrDmgaLlpI3ov5DooYzjgIJcclxuICAgICAqIEBtZXRob2QgcmVzdW1lVGFyZ2V0XHJcbiAgICAgKiBAcGFyYW0ge05vZGV9IHRhcmdldFxyXG4gICAgICovXHJcbiAgICByZXN1bWVUYXJnZXQgKHRhcmdldDogTm9kZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5faGFzaFRhcmdldHNbdGFyZ2V0LnV1aWRdO1xyXG4gICAgICAgIGlmIChlbGVtZW50KVxyXG4gICAgICAgICAgICBlbGVtZW50LnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogISNlbiBQYXVzZXMgYWxsIHJ1bm5pbmcgYWN0aW9ucywgcmV0dXJuaW5nIGEgbGlzdCBvZiB0YXJnZXRzIHdob3NlIGFjdGlvbnMgd2VyZSBwYXVzZWQuXHJcbiAgICAgKiAhI3poIOaaguWBnOaJgOacieato+WcqOi/kOihjOeahOWKqOS9nO+8jOi/lOWbnuS4gOS4quWMheWQq+S6humCo+S6m+WKqOS9nOiiq+aaguWBnOS6hueahOebruagh+WvueixoeeahOWIl+ihqOOAglxyXG4gICAgICogQG1ldGhvZCBwYXVzZUFsbFJ1bm5pbmdBY3Rpb25zXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gIGEgbGlzdCBvZiB0YXJnZXRzIHdob3NlIGFjdGlvbnMgd2VyZSBwYXVzZWQuXHJcbiAgICAgKi9cclxuICAgIHBhdXNlQWxsUnVubmluZ0FjdGlvbnMgKCk6IEFycmF5PGFueT4ge1xyXG4gICAgICAgIHZhciBpZHNXaXRoQWN0aW9uczogb2JqZWN0W10gPSBbXTtcclxuICAgICAgICB2YXIgbG9jVGFyZ2V0cyA9IHRoaXMuX2FycmF5VGFyZ2V0cztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvY1RhcmdldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBsb2NUYXJnZXRzW2ldO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCAmJiAhZWxlbWVudC5wYXVzZWQpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQucGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlkc1dpdGhBY3Rpb25zLnB1c2goZWxlbWVudC50YXJnZXQhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaWRzV2l0aEFjdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuIFJlc3VtZSBhIHNldCBvZiB0YXJnZXRzIChjb252ZW5pZW5jZSBmdW5jdGlvbiB0byByZXZlcnNlIGEgcGF1c2VBbGxSdW5uaW5nQWN0aW9ucyBvciBwYXVzZVRhcmdldHMgY2FsbCkuXHJcbiAgICAgKiAhI3poIOiuqeS4gOe7hOaMh+WumuWvueixoeaBouWkjei/kOihjO+8iOeUqOadpemAhui9rCBwYXVzZUFsbFJ1bm5pbmdBY3Rpb25zIOaViOaenOeahOS+v+aNt+WHveaVsO+8ieOAglxyXG4gICAgICogQG1ldGhvZCByZXN1bWVUYXJnZXRzXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0YXJnZXRzVG9SZXN1bWVcclxuICAgICAqL1xyXG4gICAgcmVzdW1lVGFyZ2V0cyAodGFyZ2V0c1RvUmVzdW1lOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgaWYgKCF0YXJnZXRzVG9SZXN1bWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXRzVG9SZXN1bWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRhcmdldHNUb1Jlc3VtZVtpXSlcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzdW1lVGFyZ2V0KHRhcmdldHNUb1Jlc3VtZVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogISNlbiBQYXVzZSBhIHNldCBvZiB0YXJnZXRzLlxyXG4gICAgICogISN6aCDmmoLlgZzkuIDnu4TmjIflrprlr7nosaHjgIJcclxuICAgICAqIEBtZXRob2QgcGF1c2VUYXJnZXRzXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB0YXJnZXRzVG9QYXVzZVxyXG4gICAgICovXHJcbiAgICBwYXVzZVRhcmdldHMgKHRhcmdldHNUb1BhdXNlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgaWYgKCF0YXJnZXRzVG9QYXVzZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldHNUb1BhdXNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRzVG9QYXVzZVtpXSlcclxuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VUYXJnZXQodGFyZ2V0c1RvUGF1c2VbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqICEjZW5cclxuICAgICAqIHB1cmdlcyB0aGUgc2hhcmVkIGFjdGlvbiBtYW5hZ2VyLiBJdCByZWxlYXNlcyB0aGUgcmV0YWluZWQgaW5zdGFuY2UuIDxici8+XHJcbiAgICAgKiBiZWNhdXNlIGl0IHVzZXMgdGhpcywgc28gaXQgY2FuIG5vdCBiZSBzdGF0aWMuXHJcbiAgICAgKiAhI3poXHJcbiAgICAgKiDmuIXpmaTlhbHnlKjnmoTliqjkvZznrqHnkIblmajjgILlroPph4rmlL7kuobmjIHmnInnmoTlrp7kvovjgIIgPGJyLz5cclxuICAgICAqIOWboOS4uuWug+S9v+eUqCB0aGlz77yM5Zug5q2k5a6D5LiN6IO95piv6Z2Z5oCB55qE44CCXHJcbiAgICAgKiBAbWV0aG9kIHB1cmdlU2hhcmVkTWFuYWdlclxyXG4gICAgICovXHJcbiAgICBwdXJnZVNoYXJlZE1hbmFnZXIgKCkge1xyXG4gICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnVuc2NoZWR1bGVVcGRhdGUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9wcm90ZWN0ZWRcclxuICAgIHByaXZhdGUgX3JlbW92ZUFjdGlvbkF0SW5kZXggKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIGFjdGlvbiA9IGVsZW1lbnQuYWN0aW9uc1tpbmRleF07XHJcblxyXG4gICAgICAgIGVsZW1lbnQuYWN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgICAgICAvLyB1cGRhdGUgYWN0aW9uSW5kZXggaW4gY2FzZSB3ZSBhcmUgaW4gdGljay4gbG9vcGluZyBvdmVyIHRoZSBhY3Rpb25zXHJcbiAgICAgICAgaWYgKGVsZW1lbnQuYWN0aW9uSW5kZXggPj0gaW5kZXgpXHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWN0aW9uSW5kZXgtLTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQuYWN0aW9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVsZXRlSGFzaEVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2RlbGV0ZUhhc2hFbGVtZW50IChlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIHJldCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChlbGVtZW50ICYmICFlbGVtZW50LmxvY2spIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2hhc2hUYXJnZXRzW2VsZW1lbnQudGFyZ2V0LnV1aWRdKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5faGFzaFRhcmdldHNbZWxlbWVudC50YXJnZXQudXVpZF07XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0cyA9IHRoaXMuX2FycmF5VGFyZ2V0cztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGFyZ2V0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0c1tpXSA9PT0gZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHV0RWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqICEjZW4gVGhlIEFjdGlvbk1hbmFnZXIgdXBkYXRl44CCXHJcbiAgICAgKiAhI3poIEFjdGlvbk1hbmFnZXIg5Li75b6q546v44CCXHJcbiAgICAgKiBAbWV0aG9kIHVwZGF0ZVxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IGRlbHRhIHRpbWUgaW4gc2Vjb25kc1xyXG4gICAgICovXHJcbiAgICB1cGRhdGUgKGR0OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgbG9jVGFyZ2V0cyA9IHRoaXMuX2FycmF5VGFyZ2V0cztcclxuICAgICAgICB2YXIgbG9jQ3VyclRhcmdldDtcclxuICAgICAgICBmb3IgKHZhciBlbHQgPSAwOyBlbHQgPCBsb2NUYXJnZXRzLmxlbmd0aDsgZWx0KyspIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFRhcmdldCA9IGxvY1RhcmdldHNbZWx0XTtcclxuICAgICAgICAgICAgbG9jQ3VyclRhcmdldCA9IHRoaXMuX2N1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgICAgIGlmICghbG9jQ3VyclRhcmdldC5wYXVzZWQgJiYgbG9jQ3VyclRhcmdldC5hY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NDdXJyVGFyZ2V0LmxvY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlICdhY3Rpb25zJyBDQ011dGFibGVBcnJheSBtYXkgY2hhbmdlIHdoaWxlIGluc2lkZSB0aGlzIGxvb3AuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxvY0N1cnJUYXJnZXQuYWN0aW9uSW5kZXggPSAwOyBsb2NDdXJyVGFyZ2V0LmFjdGlvbkluZGV4IDwgbG9jQ3VyclRhcmdldC5hY3Rpb25zLmxlbmd0aDsgbG9jQ3VyclRhcmdldC5hY3Rpb25JbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jQ3VyclRhcmdldC5jdXJyZW50QWN0aW9uID0gbG9jQ3VyclRhcmdldC5hY3Rpb25zW2xvY0N1cnJUYXJnZXQuYWN0aW9uSW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbG9jQ3VyclRhcmdldC5jdXJyZW50QWN0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy91c2UgZm9yIHNwZWVkXHJcbiAgICAgICAgICAgICAgICAgICAgbG9jQ3VyclRhcmdldC5jdXJyZW50QWN0aW9uLnN0ZXAoZHQgKiAobG9jQ3VyclRhcmdldC5jdXJyZW50QWN0aW9uLl9zcGVlZE1ldGhvZCA/IGxvY0N1cnJUYXJnZXQuY3VycmVudEFjdGlvbi5fc3BlZWQgOiAxKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NDdXJyVGFyZ2V0LmN1cnJlbnRBY3Rpb24gJiYgbG9jQ3VyclRhcmdldC5jdXJyZW50QWN0aW9uLmlzRG9uZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY0N1cnJUYXJnZXQuY3VycmVudEFjdGlvbi5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhY3Rpb24gPSBsb2NDdXJyVGFyZ2V0LmN1cnJlbnRBY3Rpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ha2UgY3VycmVudEFjdGlvbiBuaWwgdG8gcHJldmVudCByZW1vdmVBY3Rpb24gZnJvbSBzYWx2YWdpbmcgaXQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY0N1cnJUYXJnZXQuY3VycmVudEFjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aW9uKGFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsb2NDdXJyVGFyZ2V0LmN1cnJlbnRBY3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbG9jQ3VyclRhcmdldC5sb2NrID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gb25seSBkZWxldGUgY3VycmVudFRhcmdldCBpZiBubyBhY3Rpb25zIHdlcmUgc2NoZWR1bGVkIGR1cmluZyB0aGUgY3ljbGUgKGlzc3VlICM0ODEpXHJcbiAgICAgICAgICAgIGlmIChsb2NDdXJyVGFyZ2V0LmFjdGlvbnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxldGVIYXNoRWxlbWVudChsb2NDdXJyVGFyZ2V0KSAmJiBlbHQtLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuIl19