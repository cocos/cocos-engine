(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./tween-system.js", "../core/index.js", "./actions/action-interval.js", "./actions/action-instant.js", "./actions/action.js", "./tween-action.js", "./set-action.js", "../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./tween-system.js"), require("../core/index.js"), require("./actions/action-interval.js"), require("./actions/action-instant.js"), require("./actions/action.js"), require("./tween-action.js"), require("./set-action.js"), require("../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.tweenSystem, global.index, global.actionInterval, global.actionInstant, global.action, global.tweenAction, global.setAction, global.globalExports);
    global.tween = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _tweenSystem, _index, _actionInterval, _actionInstant, _action, _tweenAction, _setAction, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.tween = tween;
  _exports.tweenUtil = tweenUtil;
  _exports.Tween = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en
   * Tween provide a simple and flexible way to action, It's transplanted from cocos creator。
   * @zh
   * Tween 提供了一个简单灵活的方法来缓动目标，从 creator 移植而来。
   * @class Tween
   * @param {Object} [target]
   * @example
   * tween(this.node)
   *   .to(1, {scale: new Vec3(2, 2, 2), position: new Vec3(5, 5, 5)})
   *   .call(() => { console.log('This is a callback'); })
   *   .by(1, {scale: new Vec3(-1, -1, -1), position: new Vec3(-5, -5, -5)}, {easing: 'sineOutIn'})
   *   .start()
   */
  var Tween = /*#__PURE__*/function () {
    function Tween(target) {
      _classCallCheck(this, Tween);

      this._actions = [];
      this._finalAction = null;
      this._target = null;
      this._tag = _action.Action.TAG_INVALID;
      this._target = target === undefined ? null : target;

      if (this._target && this._target instanceof _index.Node) {
        this._target.on(_index.SystemEventType.NODE_DESTROYED, this._destroy, this);
      }
    }
    /**
     * @en Sets tween tag
     * @zh 设置缓动的标签
     */


    _createClass(Tween, [{
      key: "tag",
      value: function tag(_tag) {
        this._tag = _tag;
        return this;
      }
      /**
       * @en
       * Insert an action or tween to this sequence.
       * @zh
       * 插入一个 tween 到队列中。
       * @method then 
       * @param {Tween} other
       * @return {Tween}
       */

    }, {
      key: "then",
      value: function then(other) {
        if (other instanceof _action.Action) {
          this._actions.push(other.clone());
        } else {
          this._actions.push(other._union());
        }

        return this;
      }
      /**
       * @en
       * Sets tween target.
       * @zh
       * 设置 tween 的 target。
       * @method target
       * @param {Object} target
       * @return {Tween}
       */

    }, {
      key: "target",
      value: function target(_target) {
        if (this._target && this._target instanceof _index.Node) {
          this._target.off(_index.SystemEventType.NODE_DESTROYED, this._destroy, this);
        }

        this._target = _target;

        if (this._target && this._target instanceof _index.Node) {
          this._target.on(_index.SystemEventType.NODE_DESTROYED, this._destroy, this);
        }

        return this;
      }
      /**
       * @en
       * Start this tween.
       * @zh
       * 运行当前 tween。
       * @method start
       * @return {Tween}
       */

    }, {
      key: "start",
      value: function start() {
        if (!this._target) {
          (0, _index.warn)('Please set target to tween first');
          return this;
        }

        if (this._finalAction) {
          _tweenSystem.TweenSystem.instance.ActionManager.removeAction(this._finalAction);
        }

        this._finalAction = this._union();

        this._finalAction.setTag(this._tag);

        _tweenSystem.TweenSystem.instance.ActionManager.addAction(this._finalAction, this._target, false);

        return this;
      }
      /**
       * @en
       * Stop this tween.
       * @zh
       * 停止当前 tween。
       * @method stop
       * @return {Tween}
       */

    }, {
      key: "stop",
      value: function stop() {
        if (this._finalAction) {
          _tweenSystem.TweenSystem.instance.ActionManager.removeAction(this._finalAction);
        }

        return this;
      }
      /**
       * @en
       * Clone a tween.
       * @zh
       * 克隆当前 tween。
       * @method clone
       * @param {Object} [target]
       * @return {Tween}
       */

    }, {
      key: "clone",
      value: function clone(target) {
        var action = this._union();

        return tween(target).then(action.clone());
      }
      /**
       * @en
       * Integrate all previous actions to an action.
       * @zh
       * 将之前所有的 action 整合为一个 action。
       * @method union
       * @return {Tween}
       */

    }, {
      key: "union",
      value: function union() {
        var action = this._union();

        this._actions.length = 0;

        this._actions.push(action);

        return this;
      }
      /**
       * @en
       * Add an action which calculate with absolute value.
       * @zh
       * 添加一个对属性进行绝对值计算的 action。
       * @method to
       * @param {number} duration 缓动时间，单位为秒
       * @param {Object} props 缓动的属性列表
       * @param {Object} [opts] 可选的缓动功能
       * @param {Function} [opts.progress]
       * @param {Function|String} [opts.easing]
       * @return {Tween}
       */

    }, {
      key: "to",
      value: function to(duration, props, opts) {
        opts = opts || Object.create(null);
        opts.relative = false;
        var action = new _tweenAction.TweenAction(duration, props, opts);

        this._actions.push(action);

        return this;
      }
      /**
       * @en
       * Add an action which calculate with relative value.
       * @zh
       * 添加一个对属性进行相对值计算的 action。
       * @method by
       * @param {number} duration 缓动时间，单位为秒
       * @param {Object} props 缓动的属性列表
       * @param {Object} [opts] 可选的缓动功能
       * @param {Function} [opts.progress]
       * @param {Function|String} [opts.easing]
       * @return {Tween}
       */

    }, {
      key: "by",
      value: function by(duration, props, opts) {
        opts = opts || Object.create(null);
        opts.relative = true;
        var action = new _tweenAction.TweenAction(duration, props, opts);

        this._actions.push(action);

        return this;
      }
      /**
       * @en
       * Directly set target properties.
       * @zh
       * 直接设置 target 的属性。
       * @method set
       * @param {Object} props
       * @return {Tween}
       */

    }, {
      key: "set",
      value: function set(props) {
        var action = new _setAction.SetAction(props);

        this._actions.push(action);

        return this;
      }
      /**
       * @en
       * Add an delay action.
       * @zh
       * 添加一个延时 action。
       * @method delay
       * @param {number} duration 
       * @return {Tween}
       */

    }, {
      key: "delay",
      value: function delay(duration) {
        var action = (0, _actionInterval.delayTime)(duration);

        this._actions.push(action);

        return this;
      }
      /**
       * @en
       * Add an callback action.
       * @zh
       * 添加一个回调 action。
       * @method call
       * @param {Function} callback
       * @return {Tween}
       */

    }, {
      key: "call",
      value: function call(callback) {
        var action = (0, _actionInstant.callFunc)(callback);

        this._actions.push(action);

        return this;
      }
      /**
       * @en
       * Add an sequence action.
       * @zh
       * 添加一个队列 action。
       * @method sequence
       * @param {Tween} action
       * @param {Tween} ...actions
       * @return {Tween}
       */

    }, {
      key: "sequence",
      value: function sequence() {
        var action = Tween._wrappedSequence.apply(Tween, arguments);

        this._actions.push(action);

        return this;
      }
      /**
       * @en
       * Add an parallel action.
       * @zh
       * 添加一个并行 action。
       * @method parallel
       * @param {Tween} action
       * @param {Tween} ...actions
       * @return {Tween}
       */

    }, {
      key: "parallel",
      value: function parallel() {
        var action = Tween._wrappedParallel.apply(Tween, arguments);

        this._actions.push(action);

        return this;
      }
      /**
       * @en
       * Add an repeat action.
       * This action will integrate before actions to a sequence action as their parameters.
       * @zh
       * 添加一个重复 action，这个 action 会将前一个动作作为他的参数。
       * @method repeat
       * @param {number} repeatTimes 重复次数
       * @param {Tween} embedTween 可选，嵌入 Tween
       * @return {Tween}
       */

    }, {
      key: "repeat",
      value: function repeat(repeatTimes, embedTween) {
        /** adapter */
        if (repeatTimes == Infinity) {
          return this.repeatForever(embedTween);
        }

        var actions = this._actions;
        var action;

        if (embedTween instanceof Tween) {
          action = embedTween._union();
        } else {
          action = actions.pop();
        }

        actions.push((0, _actionInterval.repeat)(action, repeatTimes));
        return this;
      }
      /**
       * @en
       * Add an repeat forever action.
       * This action will integrate before actions to a sequence action as their parameters.
       * @zh
       * 添加一个永久重复 action，这个 action 会将前一个动作作为他的参数。
       * @method repeatForever
       * @param {Tween} embedTween 可选，嵌入 Tween
       * @return {Tween}
       */

    }, {
      key: "repeatForever",
      value: function repeatForever(embedTween) {
        var actions = this._actions;
        var action;

        if (embedTween instanceof Tween) {
          action = embedTween._union();
        } else {
          action = actions.pop();
        }

        actions.push((0, _actionInterval.repeatForever)(action));
        return this;
      }
      /**
       * @en
       * Add an reverse time action.
       * This action will integrate before actions to a sequence action as their parameters.
       * @zh
       * 添加一个倒置时间 action，这个 action 会将前一个动作作为他的参数。
       * @method reverseTime
       * @param {Tween} embedTween 可选，嵌入 Tween
       * @return {Tween}
       */

    }, {
      key: "reverseTime",
      value: function reverseTime(embedTween) {
        var actions = this._actions;
        var action;

        if (embedTween instanceof Tween) {
          action = embedTween._union();
        } else {
          action = actions.pop();
        }

        actions.push((0, _actionInterval.reverseTime)(action));
        return this;
      }
      /**
       * @en
       * Add an hide action, only for node target.
       * @zh
       * 添加一个隐藏 action，只适用于 target 是节点类型的。
       * @method hide
       * @return {Tween}
       */

    }, {
      key: "hide",
      value: function hide() {
        var action = (0, _actionInstant.hide)();

        this._actions.push(action);

        return this;
      }
      /**
       * @en
       * Add an show action, only for node target.
       * @zh
       * 添加一个显示 action，只适用于 target 是节点类型的。
       * @method show
       * @return {Tween}
       */

    }, {
      key: "show",
      value: function show() {
        var action = (0, _actionInstant.show)();

        this._actions.push(action);

        return this;
      }
      /**
       * @en
       * Add an removeSelf action, only for node target.
       * @zh
       * 添加一个移除自己 action，只适用于 target 是节点类型的。
       * @method removeSelf
       * @return {Tween}
       */

    }, {
      key: "removeSelf",
      value: function removeSelf() {
        var action = (0, _actionInstant.removeSelf)(false);

        this._actions.push(action);

        return this;
      }
      /**
       * @en 
       * Stop all tweens
       * @zh 
       * 停止所有缓动
       */

    }, {
      key: "_union",
      value: function _union() {
        var actions = this._actions;
        var action;

        if (actions.length === 1) {
          action = actions[0];
        } else {
          action = (0, _actionInterval.sequence)(actions);
        }

        return action;
      }
    }, {
      key: "_destroy",
      value: function _destroy() {
        this.stop();
      }
    }], [{
      key: "stopAll",
      value: function stopAll() {
        _tweenSystem.TweenSystem.instance.ActionManager.removeAllActions();
      }
      /**
       * @en 
       * Stop all tweens by tag
       * @zh 
       * 停止所有指定标签的缓动
       */

    }, {
      key: "stopAllByTag",
      value: function stopAllByTag(tag, target) {
        _tweenSystem.TweenSystem.instance.ActionManager.removeActionByTag(tag, target);
      }
      /**
       * @en 
       * Stop all tweens by target
       * @zh 
       * 停止所有指定对象的缓动
       */

    }, {
      key: "stopAllByTarget",
      value: function stopAllByTarget(target) {
        _tweenSystem.TweenSystem.instance.ActionManager.removeAllActionsFromTarget(target);
      }
    }, {
      key: "_wrappedSequence",
      value: function _wrappedSequence() {
        var tmp_args = Tween._tmp_args;
        tmp_args.length = 0;

        for (var l = arguments.length, i = 0; i < l; i++) {
          var arg = tmp_args[i] = i < 0 || arguments.length <= i ? undefined : arguments[i];

          if (arg instanceof Tween) {
            tmp_args[i] = arg._union();
          }
        }

        return _actionInterval.sequence.apply(_actionInterval.sequence, tmp_args);
      }
    }, {
      key: "_wrappedParallel",
      value: function _wrappedParallel() {
        var tmp_args = Tween._tmp_args;
        tmp_args.length = 0;

        for (var l = arguments.length, i = 0; i < l; i++) {
          var arg = tmp_args[i] = i < 0 || arguments.length <= i ? undefined : arguments[i];

          if (arg instanceof Tween) {
            tmp_args[i] = arg._union();
          }
        }

        return _actionInterval.spawn.apply(_actionInterval.spawn, tmp_args);
      }
    }]);

    return Tween;
  }();

  _exports.Tween = Tween;
  Tween._tmp_args = [];
  _globalExports.legacyCC.Tween = Tween;
  /**
   * @en
   * tween is a utility function that helps instantiate Tween instances.
   * @zh
   * tween 是一个工具函数，帮助实例化 Tween 实例。
   * @param target 缓动的目标
   * @returns Tween 实例
   * @example
   * tween(this.node)
   *   .to(1, {scale: new Vec3(2, 2, 2), position: new Vec3(5, 5, 5)})
   *   .call(() => { console.log('This is a callback'); })
   *   .by(1, {scale: new Vec3(-1, -1, -1)}, {easing: 'sineOutIn'})
   *   .start()
   */

  function tween(target) {
    return new Tween(target);
  }

  _globalExports.legacyCC.tween = tween;
  /**
   * @en
   * tweenUtil is a utility function that helps instantiate Tween instances.
   * @zh
   * tweenUtil 是一个工具函数，帮助实例化 Tween 实例。
   * @deprecated please use `tween` instead.
   */

  function tweenUtil(target) {
    (0, _index.warn)("tweenUtil' is deprecated, please use 'tween' instead ");
    return new Tween(target);
  }

  _globalExports.legacyCC.tweenUtil = tweenUtil;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3R3ZWVuL3R3ZWVuLnRzIl0sIm5hbWVzIjpbIlR3ZWVuIiwidGFyZ2V0IiwiX2FjdGlvbnMiLCJfZmluYWxBY3Rpb24iLCJfdGFyZ2V0IiwiX3RhZyIsIkFjdGlvbiIsIlRBR19JTlZBTElEIiwidW5kZWZpbmVkIiwiTm9kZSIsIm9uIiwiU3lzdGVtRXZlbnRUeXBlIiwiTk9ERV9ERVNUUk9ZRUQiLCJfZGVzdHJveSIsInRhZyIsIm90aGVyIiwicHVzaCIsImNsb25lIiwiX3VuaW9uIiwib2ZmIiwiVHdlZW5TeXN0ZW0iLCJpbnN0YW5jZSIsIkFjdGlvbk1hbmFnZXIiLCJyZW1vdmVBY3Rpb24iLCJzZXRUYWciLCJhZGRBY3Rpb24iLCJhY3Rpb24iLCJ0d2VlbiIsInRoZW4iLCJsZW5ndGgiLCJkdXJhdGlvbiIsInByb3BzIiwib3B0cyIsIk9iamVjdCIsImNyZWF0ZSIsInJlbGF0aXZlIiwiVHdlZW5BY3Rpb24iLCJTZXRBY3Rpb24iLCJjYWxsYmFjayIsIl93cmFwcGVkU2VxdWVuY2UiLCJfd3JhcHBlZFBhcmFsbGVsIiwicmVwZWF0VGltZXMiLCJlbWJlZFR3ZWVuIiwiSW5maW5pdHkiLCJyZXBlYXRGb3JldmVyIiwiYWN0aW9ucyIsInBvcCIsInN0b3AiLCJyZW1vdmVBbGxBY3Rpb25zIiwicmVtb3ZlQWN0aW9uQnlUYWciLCJyZW1vdmVBbGxBY3Rpb25zRnJvbVRhcmdldCIsInRtcF9hcmdzIiwiX3RtcF9hcmdzIiwibCIsImkiLCJhcmciLCJzZXF1ZW5jZSIsImFwcGx5Iiwic3Bhd24iLCJsZWdhY3lDQyIsInR3ZWVuVXRpbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWNBOzs7Ozs7Ozs7Ozs7OztNQWNhQSxLO0FBT1QsbUJBQWFDLE1BQWIsRUFBcUM7QUFBQTs7QUFBQSxXQUw3QkMsUUFLNkIsR0FMUixFQUtRO0FBQUEsV0FKN0JDLFlBSTZCLEdBSkMs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cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSB0d2VlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFR3ZWVuU3lzdGVtIH0gZnJvbSAnLi90d2Vlbi1zeXN0ZW0nO1xyXG5pbXBvcnQgeyB3YXJuLCBOb2RlLCBTeXN0ZW1FdmVudFR5cGUgfSBmcm9tICcuLi9jb3JlJztcclxuaW1wb3J0IHsgQWN0aW9uSW50ZXJ2YWwsIHNlcXVlbmNlLCByZXBlYXQsIHJlcGVhdEZvcmV2ZXIsIHJldmVyc2VUaW1lLCBkZWxheVRpbWUsIHNwYXduIH0gZnJvbSAnLi9hY3Rpb25zL2FjdGlvbi1pbnRlcnZhbCc7XHJcbmltcG9ydCB7IHJlbW92ZVNlbGYsIHNob3csIGhpZGUsIGNhbGxGdW5jIH0gZnJvbSAnLi9hY3Rpb25zL2FjdGlvbi1pbnN0YW50JztcclxuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnLi9hY3Rpb25zL2FjdGlvbic7XHJcbmltcG9ydCB7IElUd2Vlbk9wdGlvbiB9IGZyb20gJy4vZXhwb3J0LWFwaSc7XHJcbmltcG9ydCB7IFR3ZWVuQWN0aW9uIH0gZnJvbSAnLi90d2Vlbi1hY3Rpb24nO1xyXG5pbXBvcnQgeyBTZXRBY3Rpb24gfSBmcm9tICcuL3NldC1hY3Rpb24nO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUd2VlbiBwcm92aWRlIGEgc2ltcGxlIGFuZCBmbGV4aWJsZSB3YXkgdG8gYWN0aW9uLCBJdCdzIHRyYW5zcGxhbnRlZCBmcm9tIGNvY29zIGNyZWF0b3LjgIJcclxuICogQHpoXHJcbiAqIFR3ZWVuIOaPkOS+m+S6huS4gOS4queugOWNleeBtea0u+eahOaWueazleadpee8k+WKqOebruagh++8jOS7jiBjcmVhdG9yIOenu+akjeiAjOadpeOAglxyXG4gKiBAY2xhc3MgVHdlZW5cclxuICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdXHJcbiAqIEBleGFtcGxlXHJcbiAqIHR3ZWVuKHRoaXMubm9kZSlcclxuICogICAudG8oMSwge3NjYWxlOiBuZXcgVmVjMygyLCAyLCAyKSwgcG9zaXRpb246IG5ldyBWZWMzKDUsIDUsIDUpfSlcclxuICogICAuY2FsbCgoKSA9PiB7IGNvbnNvbGUubG9nKCdUaGlzIGlzIGEgY2FsbGJhY2snKTsgfSlcclxuICogICAuYnkoMSwge3NjYWxlOiBuZXcgVmVjMygtMSwgLTEsIC0xKSwgcG9zaXRpb246IG5ldyBWZWMzKC01LCAtNSwgLTUpfSwge2Vhc2luZzogJ3NpbmVPdXRJbid9KVxyXG4gKiAgIC5zdGFydCgpXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHdlZW4ge1xyXG5cclxuICAgIHByaXZhdGUgX2FjdGlvbnM6IEFjdGlvbltdID0gW107XHJcbiAgICBwcml2YXRlIF9maW5hbEFjdGlvbjogQWN0aW9uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90YXJnZXQ6IG9iamVjdCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfdGFnID0gQWN0aW9uLlRBR19JTlZBTElEO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh0YXJnZXQ/OiBvYmplY3QgfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0ID09PSB1bmRlZmluZWQgPyBudWxsIDogdGFyZ2V0O1xyXG4gICAgICAgIGlmICh0aGlzLl90YXJnZXQgJiYgdGhpcy5fdGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLl90YXJnZXQub24oU3lzdGVtRXZlbnRUeXBlLk5PREVfREVTVFJPWUVELCB0aGlzLl9kZXN0cm95LCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0cyB0d2VlbiB0YWdcclxuICAgICAqIEB6aCDorr7nva7nvJPliqjnmoTmoIfnrb5cclxuICAgICAqL1xyXG4gICAgdGFnICh0YWc6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3RhZyA9IHRhZztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSW5zZXJ0IGFuIGFjdGlvbiBvciB0d2VlbiB0byB0aGlzIHNlcXVlbmNlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmj5LlhaXkuIDkuKogdHdlZW4g5Yiw6Zif5YiX5Lit44CCXHJcbiAgICAgKiBAbWV0aG9kIHRoZW4gXHJcbiAgICAgKiBAcGFyYW0ge1R3ZWVufSBvdGhlclxyXG4gICAgICogQHJldHVybiB7VHdlZW59XHJcbiAgICAgKi9cclxuICAgIHRoZW4gKG90aGVyOiBUd2Vlbik6IFR3ZWVuIHtcclxuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBBY3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5fYWN0aW9ucy5wdXNoKG90aGVyLmNsb25lKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fYWN0aW9ucy5wdXNoKG90aGVyLl91bmlvbigpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldHMgdHdlZW4gdGFyZ2V0LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva4gdHdlZW4g55qEIHRhcmdldOOAglxyXG4gICAgICogQG1ldGhvZCB0YXJnZXRcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcclxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxyXG4gICAgICovXHJcbiAgICB0YXJnZXQgKHRhcmdldDogb2JqZWN0IHwgbnVsbCk6IFR3ZWVuIHtcclxuICAgICAgICBpZiAodGhpcy5fdGFyZ2V0ICYmIHRoaXMuX3RhcmdldCBpbnN0YW5jZW9mIE5vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0Lm9mZihTeXN0ZW1FdmVudFR5cGUuTk9ERV9ERVNUUk9ZRUQsIHRoaXMuX2Rlc3Ryb3ksIHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fdGFyZ2V0ICYmIHRoaXMuX3RhcmdldCBpbnN0YW5jZW9mIE5vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0Lm9uKFN5c3RlbUV2ZW50VHlwZS5OT0RFX0RFU1RST1lFRCwgdGhpcy5fZGVzdHJveSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTdGFydCB0aGlzIHR3ZWVuLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDov5DooYzlvZPliY0gdHdlZW7jgIJcclxuICAgICAqIEBtZXRob2Qgc3RhcnRcclxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxyXG4gICAgICovXHJcbiAgICBzdGFydCAoKTogVHdlZW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5fdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHdhcm4oJ1BsZWFzZSBzZXQgdGFyZ2V0IHRvIHR3ZWVuIGZpcnN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fZmluYWxBY3Rpb24pIHtcclxuICAgICAgICAgICAgVHdlZW5TeXN0ZW0uaW5zdGFuY2UuQWN0aW9uTWFuYWdlci5yZW1vdmVBY3Rpb24odGhpcy5fZmluYWxBY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9maW5hbEFjdGlvbiA9IHRoaXMuX3VuaW9uKCk7XHJcbiAgICAgICAgdGhpcy5fZmluYWxBY3Rpb24uc2V0VGFnKHRoaXMuX3RhZyk7XHJcbiAgICAgICAgVHdlZW5TeXN0ZW0uaW5zdGFuY2UuQWN0aW9uTWFuYWdlci5hZGRBY3Rpb24odGhpcy5fZmluYWxBY3Rpb24sIHRoaXMuX3RhcmdldCBhcyBhbnksIGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU3RvcCB0aGlzIHR3ZWVuLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlgZzmraLlvZPliY0gdHdlZW7jgIJcclxuICAgICAqIEBtZXRob2Qgc3RvcFxyXG4gICAgICogQHJldHVybiB7VHdlZW59XHJcbiAgICAgKi9cclxuICAgIHN0b3AgKCk6IFR3ZWVuIHtcclxuICAgICAgICBpZiAodGhpcy5fZmluYWxBY3Rpb24pIHtcclxuICAgICAgICAgICAgVHdlZW5TeXN0ZW0uaW5zdGFuY2UuQWN0aW9uTWFuYWdlci5yZW1vdmVBY3Rpb24odGhpcy5fZmluYWxBY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ2xvbmUgYSB0d2Vlbi5cclxuICAgICAqIEB6aFxyXG4gICAgICog5YWL6ZqG5b2T5YmNIHR3ZWVu44CCXHJcbiAgICAgKiBAbWV0aG9kIGNsb25lXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF1cclxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxyXG4gICAgICovXHJcbiAgICBjbG9uZSAodGFyZ2V0OiBvYmplY3QpOiBUd2VlbiB7XHJcbiAgICAgICAgbGV0IGFjdGlvbiA9IHRoaXMuX3VuaW9uKCk7XHJcbiAgICAgICAgcmV0dXJuIHR3ZWVuKHRhcmdldCkudGhlbihhY3Rpb24uY2xvbmUoKSBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBJbnRlZ3JhdGUgYWxsIHByZXZpb3VzIGFjdGlvbnMgdG8gYW4gYWN0aW9uLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbkuYvliY3miYDmnInnmoQgYWN0aW9uIOaVtOWQiOS4uuS4gOS4qiBhY3Rpb27jgIJcclxuICAgICAqIEBtZXRob2QgdW5pb25cclxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxyXG4gICAgICovXHJcbiAgICB1bmlvbiAoKTogVHdlZW4ge1xyXG4gICAgICAgIGxldCBhY3Rpb24gPSB0aGlzLl91bmlvbigpO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbnMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9hY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQWRkIGFuIGFjdGlvbiB3aGljaCBjYWxjdWxhdGUgd2l0aCBhYnNvbHV0ZSB2YWx1ZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5re75Yqg5LiA5Liq5a+55bGe5oCn6L+b6KGM57ud5a+55YC86K6h566X55qEIGFjdGlvbuOAglxyXG4gICAgICogQG1ldGhvZCB0b1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIOe8k+WKqOaXtumXtO+8jOWNleS9jeS4uuenklxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzIOe8k+WKqOeahOWxnuaAp+WIl+ihqFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXSDlj6/pgInnmoTnvJPliqjlip/og71cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnByb2dyZXNzXVxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IFtvcHRzLmVhc2luZ11cclxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxyXG4gICAgICovXHJcbiAgICB0byAoZHVyYXRpb246IG51bWJlciwgcHJvcHM6IG9iamVjdCwgb3B0cz86IElUd2Vlbk9wdGlvbik6IFR3ZWVuIHtcclxuICAgICAgICBvcHRzID0gb3B0cyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgIChvcHRzIGFzIGFueSkucmVsYXRpdmUgPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgVHdlZW5BY3Rpb24oZHVyYXRpb24sIHByb3BzLCBvcHRzKTtcclxuICAgICAgICB0aGlzLl9hY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQWRkIGFuIGFjdGlvbiB3aGljaCBjYWxjdWxhdGUgd2l0aCByZWxhdGl2ZSB2YWx1ZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5re75Yqg5LiA5Liq5a+55bGe5oCn6L+b6KGM55u45a+55YC86K6h566X55qEIGFjdGlvbuOAglxyXG4gICAgICogQG1ldGhvZCBieVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIOe8k+WKqOaXtumXtO+8jOWNleS9jeS4uuenklxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzIOe8k+WKqOeahOWxnuaAp+WIl+ihqFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXSDlj6/pgInnmoTnvJPliqjlip/og71cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnByb2dyZXNzXVxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IFtvcHRzLmVhc2luZ11cclxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxyXG4gICAgICovXHJcbiAgICBieSAoZHVyYXRpb246IG51bWJlciwgcHJvcHM6IG9iamVjdCwgb3B0cz86IElUd2Vlbk9wdGlvbik6IFR3ZWVuIHtcclxuICAgICAgICBvcHRzID0gb3B0cyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgIChvcHRzIGFzIGFueSkucmVsYXRpdmUgPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBUd2VlbkFjdGlvbihkdXJhdGlvbiwgcHJvcHMsIG9wdHMpO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbnMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBEaXJlY3RseSBzZXQgdGFyZ2V0IHByb3BlcnRpZXMuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOebtOaOpeiuvue9riB0YXJnZXQg55qE5bGe5oCn44CCXHJcbiAgICAgKiBAbWV0aG9kIHNldFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzXHJcbiAgICAgKiBAcmV0dXJuIHtUd2Vlbn1cclxuICAgICAqL1xyXG4gICAgc2V0IChwcm9wczogb2JqZWN0KTogVHdlZW4ge1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBTZXRBY3Rpb24ocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbnMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGQgYW4gZGVsYXkgYWN0aW9uLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmt7vliqDkuIDkuKrlu7bml7YgYWN0aW9u44CCXHJcbiAgICAgKiBAbWV0aG9kIGRlbGF5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gXHJcbiAgICAgKiBAcmV0dXJuIHtUd2Vlbn1cclxuICAgICAqL1xyXG4gICAgZGVsYXkgKGR1cmF0aW9uOiBudW1iZXIpOiBUd2VlbiB7XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0gZGVsYXlUaW1lKGR1cmF0aW9uKTtcclxuICAgICAgICB0aGlzLl9hY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQWRkIGFuIGNhbGxiYWNrIGFjdGlvbi5cclxuICAgICAqIEB6aFxyXG4gICAgICog5re75Yqg5LiA5Liq5Zue6LCDIGFjdGlvbuOAglxyXG4gICAgICogQG1ldGhvZCBjYWxsXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gICAgICogQHJldHVybiB7VHdlZW59XHJcbiAgICAgKi9cclxuICAgIGNhbGwgKGNhbGxiYWNrOiBGdW5jdGlvbik6IFR3ZWVuIHtcclxuICAgICAgICBjb25zdCBhY3Rpb24gPSBjYWxsRnVuYyhjYWxsYmFjayk7XHJcbiAgICAgICAgdGhpcy5fYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEFkZCBhbiBzZXF1ZW5jZSBhY3Rpb24uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa3u+WKoOS4gOS4qumYn+WIlyBhY3Rpb27jgIJcclxuICAgICAqIEBtZXRob2Qgc2VxdWVuY2VcclxuICAgICAqIEBwYXJhbSB7VHdlZW59IGFjdGlvblxyXG4gICAgICogQHBhcmFtIHtUd2Vlbn0gLi4uYWN0aW9uc1xyXG4gICAgICogQHJldHVybiB7VHdlZW59XHJcbiAgICAgKi9cclxuICAgIHNlcXVlbmNlICguLi5hcmdzOiBUd2VlbltdKTogVHdlZW4ge1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IFR3ZWVuLl93cmFwcGVkU2VxdWVuY2UoLi4uYXJncyk7XHJcbiAgICAgICAgdGhpcy5fYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEFkZCBhbiBwYXJhbGxlbCBhY3Rpb24uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa3u+WKoOS4gOS4quW5tuihjCBhY3Rpb27jgIJcclxuICAgICAqIEBtZXRob2QgcGFyYWxsZWxcclxuICAgICAqIEBwYXJhbSB7VHdlZW59IGFjdGlvblxyXG4gICAgICogQHBhcmFtIHtUd2Vlbn0gLi4uYWN0aW9uc1xyXG4gICAgICogQHJldHVybiB7VHdlZW59XHJcbiAgICAgKi9cclxuICAgIHBhcmFsbGVsICguLi5hcmdzOiBUd2VlbltdKTogVHdlZW4ge1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IFR3ZWVuLl93cmFwcGVkUGFyYWxsZWwoLi4uYXJncyk7XHJcbiAgICAgICAgdGhpcy5fYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEFkZCBhbiByZXBlYXQgYWN0aW9uLlxyXG4gICAgICogVGhpcyBhY3Rpb24gd2lsbCBpbnRlZ3JhdGUgYmVmb3JlIGFjdGlvbnMgdG8gYSBzZXF1ZW5jZSBhY3Rpb24gYXMgdGhlaXIgcGFyYW1ldGVycy5cclxuICAgICAqIEB6aFxyXG4gICAgICog5re75Yqg5LiA5Liq6YeN5aSNIGFjdGlvbu+8jOi/meS4qiBhY3Rpb24g5Lya5bCG5YmN5LiA5Liq5Yqo5L2c5L2c5Li65LuW55qE5Y+C5pWw44CCXHJcbiAgICAgKiBAbWV0aG9kIHJlcGVhdFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJlcGVhdFRpbWVzIOmHjeWkjeasoeaVsFxyXG4gICAgICogQHBhcmFtIHtUd2Vlbn0gZW1iZWRUd2VlbiDlj6/pgInvvIzltYzlhaUgVHdlZW5cclxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxyXG4gICAgICovXHJcbiAgICByZXBlYXQgKHJlcGVhdFRpbWVzOiBudW1iZXIsIGVtYmVkVHdlZW4/OiBUd2Vlbik6IFR3ZWVuIHtcclxuICAgICAgICAvKiogYWRhcHRlciAqL1xyXG4gICAgICAgIGlmIChyZXBlYXRUaW1lcyA9PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBlYXRGb3JldmVyKGVtYmVkVHdlZW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuX2FjdGlvbnM7XHJcbiAgICAgICAgbGV0IGFjdGlvbjogYW55O1xyXG5cclxuICAgICAgICBpZiAoZW1iZWRUd2VlbiBpbnN0YW5jZW9mIFR3ZWVuKSB7XHJcbiAgICAgICAgICAgIGFjdGlvbiA9IGVtYmVkVHdlZW4uX3VuaW9uKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWN0aW9uID0gYWN0aW9ucy5wb3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFjdGlvbnMucHVzaChyZXBlYXQoYWN0aW9uLCByZXBlYXRUaW1lcykpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGQgYW4gcmVwZWF0IGZvcmV2ZXIgYWN0aW9uLlxyXG4gICAgICogVGhpcyBhY3Rpb24gd2lsbCBpbnRlZ3JhdGUgYmVmb3JlIGFjdGlvbnMgdG8gYSBzZXF1ZW5jZSBhY3Rpb24gYXMgdGhlaXIgcGFyYW1ldGVycy5cclxuICAgICAqIEB6aFxyXG4gICAgICog5re75Yqg5LiA5Liq5rC45LmF6YeN5aSNIGFjdGlvbu+8jOi/meS4qiBhY3Rpb24g5Lya5bCG5YmN5LiA5Liq5Yqo5L2c5L2c5Li65LuW55qE5Y+C5pWw44CCXHJcbiAgICAgKiBAbWV0aG9kIHJlcGVhdEZvcmV2ZXJcclxuICAgICAqIEBwYXJhbSB7VHdlZW59IGVtYmVkVHdlZW4g5Y+v6YCJ77yM5bWM5YWlIFR3ZWVuXHJcbiAgICAgKiBAcmV0dXJuIHtUd2Vlbn1cclxuICAgICAqL1xyXG4gICAgcmVwZWF0Rm9yZXZlciAoZW1iZWRUd2Vlbj86IFR3ZWVuKTogVHdlZW4ge1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLl9hY3Rpb25zO1xyXG4gICAgICAgIGxldCBhY3Rpb246IGFueTtcclxuXHJcbiAgICAgICAgaWYgKGVtYmVkVHdlZW4gaW5zdGFuY2VvZiBUd2Vlbikge1xyXG4gICAgICAgICAgICBhY3Rpb24gPSBlbWJlZFR3ZWVuLl91bmlvbigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFjdGlvbiA9IGFjdGlvbnMucG9wKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhY3Rpb25zLnB1c2gocmVwZWF0Rm9yZXZlcihhY3Rpb24gYXMgQWN0aW9uSW50ZXJ2YWwpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQWRkIGFuIHJldmVyc2UgdGltZSBhY3Rpb24uXHJcbiAgICAgKiBUaGlzIGFjdGlvbiB3aWxsIGludGVncmF0ZSBiZWZvcmUgYWN0aW9ucyB0byBhIHNlcXVlbmNlIGFjdGlvbiBhcyB0aGVpciBwYXJhbWV0ZXJzLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmt7vliqDkuIDkuKrlgJLnva7ml7bpl7QgYWN0aW9u77yM6L+Z5LiqIGFjdGlvbiDkvJrlsIbliY3kuIDkuKrliqjkvZzkvZzkuLrku5bnmoTlj4LmlbDjgIJcclxuICAgICAqIEBtZXRob2QgcmV2ZXJzZVRpbWVcclxuICAgICAqIEBwYXJhbSB7VHdlZW59IGVtYmVkVHdlZW4g5Y+v6YCJ77yM5bWM5YWlIFR3ZWVuXHJcbiAgICAgKiBAcmV0dXJuIHtUd2Vlbn1cclxuICAgICAqL1xyXG4gICAgcmV2ZXJzZVRpbWUgKGVtYmVkVHdlZW4/OiBUd2Vlbik6IFR3ZWVuIHtcclxuICAgICAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5fYWN0aW9ucztcclxuICAgICAgICBsZXQgYWN0aW9uOiBhbnk7XHJcblxyXG4gICAgICAgIGlmIChlbWJlZFR3ZWVuIGluc3RhbmNlb2YgVHdlZW4pIHtcclxuICAgICAgICAgICAgYWN0aW9uID0gZW1iZWRUd2Vlbi5fdW5pb24oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhY3Rpb24gPSBhY3Rpb25zLnBvcCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWN0aW9ucy5wdXNoKHJldmVyc2VUaW1lKGFjdGlvbiBhcyBBY3Rpb25JbnRlcnZhbCkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGQgYW4gaGlkZSBhY3Rpb24sIG9ubHkgZm9yIG5vZGUgdGFyZ2V0LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmt7vliqDkuIDkuKrpmpDol48gYWN0aW9u77yM5Y+q6YCC55So5LqOIHRhcmdldCDmmK/oioLngrnnsbvlnovnmoTjgIJcclxuICAgICAqIEBtZXRob2QgaGlkZVxyXG4gICAgICogQHJldHVybiB7VHdlZW59XHJcbiAgICAgKi9cclxuICAgIGhpZGUgKCk6IFR3ZWVuIHtcclxuICAgICAgICBsZXQgYWN0aW9uID0gaGlkZSgpO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbnMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGQgYW4gc2hvdyBhY3Rpb24sIG9ubHkgZm9yIG5vZGUgdGFyZ2V0LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmt7vliqDkuIDkuKrmmL7npLogYWN0aW9u77yM5Y+q6YCC55So5LqOIHRhcmdldCDmmK/oioLngrnnsbvlnovnmoTjgIJcclxuICAgICAqIEBtZXRob2Qgc2hvd1xyXG4gICAgICogQHJldHVybiB7VHdlZW59XHJcbiAgICAgKi9cclxuICAgIHNob3cgKCk6IFR3ZWVuIHtcclxuICAgICAgICBsZXQgYWN0aW9uID0gc2hvdygpO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbnMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGQgYW4gcmVtb3ZlU2VsZiBhY3Rpb24sIG9ubHkgZm9yIG5vZGUgdGFyZ2V0LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmt7vliqDkuIDkuKrnp7vpmaToh6rlt7EgYWN0aW9u77yM5Y+q6YCC55So5LqOIHRhcmdldCDmmK/oioLngrnnsbvlnovnmoTjgIJcclxuICAgICAqIEBtZXRob2QgcmVtb3ZlU2VsZlxyXG4gICAgICogQHJldHVybiB7VHdlZW59XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZVNlbGYgKCk6IFR3ZWVuIHtcclxuICAgICAgICBsZXQgYWN0aW9uID0gcmVtb3ZlU2VsZihmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5fYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gXHJcbiAgICAgKiBTdG9wIGFsbCB0d2VlbnNcclxuICAgICAqIEB6aCBcclxuICAgICAqIOWBnOatouaJgOaciee8k+WKqFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc3RvcEFsbCAoKSB7XHJcbiAgICAgICAgVHdlZW5TeXN0ZW0uaW5zdGFuY2UuQWN0aW9uTWFuYWdlci5yZW1vdmVBbGxBY3Rpb25zKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBcclxuICAgICAqIFN0b3AgYWxsIHR3ZWVucyBieSB0YWdcclxuICAgICAqIEB6aCBcclxuICAgICAqIOWBnOatouaJgOacieaMh+Wumuagh+etvueahOe8k+WKqFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc3RvcEFsbEJ5VGFnICh0YWc6IG51bWJlciwgdGFyZ2V0Pzogb2JqZWN0KSB7XHJcbiAgICAgICAgVHdlZW5TeXN0ZW0uaW5zdGFuY2UuQWN0aW9uTWFuYWdlci5yZW1vdmVBY3Rpb25CeVRhZyh0YWcsIHRhcmdldCBhcyBhbnkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gXHJcbiAgICAgKiBTdG9wIGFsbCB0d2VlbnMgYnkgdGFyZ2V0XHJcbiAgICAgKiBAemggXHJcbiAgICAgKiDlgZzmraLmiYDmnInmjIflrprlr7nosaHnmoTnvJPliqhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHN0b3BBbGxCeVRhcmdldCAodGFyZ2V0KSB7XHJcbiAgICAgICAgVHdlZW5TeXN0ZW0uaW5zdGFuY2UuQWN0aW9uTWFuYWdlci5yZW1vdmVBbGxBY3Rpb25zRnJvbVRhcmdldCh0YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VuaW9uICgpIHtcclxuICAgICAgICBsZXQgYWN0aW9ucyA9IHRoaXMuX2FjdGlvbnM7XHJcbiAgICAgICAgbGV0IGFjdGlvbjogQWN0aW9uO1xyXG4gICAgICAgIGlmIChhY3Rpb25zLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBhY3Rpb24gPSBhY3Rpb25zWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYWN0aW9uID0gc2VxdWVuY2UoYWN0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2Rlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF90bXBfYXJnczogVHdlZW5bXSB8IEFjdGlvbltdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3dyYXBwZWRTZXF1ZW5jZSAoLi4uYXJnczogQWN0aW9uW10gfCBUd2VlbltdKSB7XHJcbiAgICAgICAgY29uc3QgdG1wX2FyZ3MgPSBUd2Vlbi5fdG1wX2FyZ3M7XHJcbiAgICAgICAgdG1wX2FyZ3MubGVuZ3RoID0gMDtcclxuICAgICAgICBmb3IgKGxldCBsID0gYXJncy5sZW5ndGgsIGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBhcmcgPSB0bXBfYXJnc1tpXSA9IGFyZ3NbaV07XHJcbiAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBUd2Vlbikge1xyXG4gICAgICAgICAgICAgICAgdG1wX2FyZ3NbaV0gPSBhcmcuX3VuaW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzZXF1ZW5jZS5hcHBseShzZXF1ZW5jZSwgdG1wX2FyZ3MgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfd3JhcHBlZFBhcmFsbGVsICguLi5hcmdzOiBBY3Rpb25bXSB8IFR3ZWVuW10pIHtcclxuICAgICAgICBjb25zdCB0bXBfYXJncyA9IFR3ZWVuLl90bXBfYXJncztcclxuICAgICAgICB0bXBfYXJncy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGwgPSBhcmdzLmxlbmd0aCwgaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGFyZyA9IHRtcF9hcmdzW2ldID0gYXJnc1tpXTtcclxuICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIFR3ZWVuKSB7XHJcbiAgICAgICAgICAgICAgICB0bXBfYXJnc1tpXSA9IGFyZy5fdW5pb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNwYXduLmFwcGx5KHNwYXduLCB0bXBfYXJncyBhcyBhbnkpO1xyXG4gICAgfVxyXG59XHJcbmxlZ2FjeUNDLlR3ZWVuID0gVHdlZW47XHJcblxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiB0d2VlbiBpcyBhIHV0aWxpdHkgZnVuY3Rpb24gdGhhdCBoZWxwcyBpbnN0YW50aWF0ZSBUd2VlbiBpbnN0YW5jZXMuXHJcbiAqIEB6aFxyXG4gKiB0d2VlbiDmmK/kuIDkuKrlt6Xlhbflh73mlbDvvIzluK7liqnlrp7kvovljJYgVHdlZW4g5a6e5L6L44CCXHJcbiAqIEBwYXJhbSB0YXJnZXQg57yT5Yqo55qE55uu5qCHXHJcbiAqIEByZXR1cm5zIFR3ZWVuIOWunuS+i1xyXG4gKiBAZXhhbXBsZVxyXG4gKiB0d2Vlbih0aGlzLm5vZGUpXHJcbiAqICAgLnRvKDEsIHtzY2FsZTogbmV3IFZlYzMoMiwgMiwgMiksIHBvc2l0aW9uOiBuZXcgVmVjMyg1LCA1LCA1KX0pXHJcbiAqICAgLmNhbGwoKCkgPT4geyBjb25zb2xlLmxvZygnVGhpcyBpcyBhIGNhbGxiYWNrJyk7IH0pXHJcbiAqICAgLmJ5KDEsIHtzY2FsZTogbmV3IFZlYzMoLTEsIC0xLCAtMSl9LCB7ZWFzaW5nOiAnc2luZU91dEluJ30pXHJcbiAqICAgLnN0YXJ0KClcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0d2VlbiAodGFyZ2V0Pzogb2JqZWN0KSB7XHJcbiAgICByZXR1cm4gbmV3IFR3ZWVuKHRhcmdldCk7XHJcbn1cclxubGVnYWN5Q0MudHdlZW4gPSB0d2VlbjtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogdHdlZW5VdGlsIGlzIGEgdXRpbGl0eSBmdW5jdGlvbiB0aGF0IGhlbHBzIGluc3RhbnRpYXRlIFR3ZWVuIGluc3RhbmNlcy5cclxuICogQHpoXHJcbiAqIHR3ZWVuVXRpbCDmmK/kuIDkuKrlt6Xlhbflh73mlbDvvIzluK7liqnlrp7kvovljJYgVHdlZW4g5a6e5L6L44CCXHJcbiAqIEBkZXByZWNhdGVkIHBsZWFzZSB1c2UgYHR3ZWVuYCBpbnN0ZWFkLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHR3ZWVuVXRpbCAodGFyZ2V0Pzogb2JqZWN0KSB7XHJcbiAgICB3YXJuKFwidHdlZW5VdGlsJyBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlICd0d2VlbicgaW5zdGVhZCBcIik7XHJcbiAgICByZXR1cm4gbmV3IFR3ZWVuKHRhcmdldCk7XHJcbn1cclxubGVnYWN5Q0MudHdlZW5VdGlsID0gdHdlZW5VdGlsOyJdfQ==