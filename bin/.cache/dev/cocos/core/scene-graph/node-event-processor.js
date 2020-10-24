(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../math/vec2.js", "../platform/event-manager/event-enum.js", "../platform/event-manager/event-manager.js", "../event/callbacks-invoker.js", "../platform/debug.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../math/vec2.js"), require("../platform/event-manager/event-enum.js"), require("../platform/event-manager/event-manager.js"), require("../event/callbacks-invoker.js"), require("../platform/debug.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.vec2, global.eventEnum, global.eventManager, global.callbacksInvoker, global.debug, global.globalExports);
    global.nodeEventProcessor = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _vec, _eventEnum, _eventManager, _callbacksInvoker, _debug, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.NodeEventProcessor = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _cachedArray = new Array(16);

  var _currentHovered = null;
  var pos = new _vec.Vec2();
  var _touchEvents = [_eventEnum.SystemEventType.TOUCH_START.toString(), _eventEnum.SystemEventType.TOUCH_MOVE.toString(), _eventEnum.SystemEventType.TOUCH_END.toString(), _eventEnum.SystemEventType.TOUCH_CANCEL.toString()];
  var _mouseEvents = [_eventEnum.SystemEventType.MOUSE_DOWN.toString(), _eventEnum.SystemEventType.MOUSE_ENTER.toString(), _eventEnum.SystemEventType.MOUSE_MOVE.toString(), _eventEnum.SystemEventType.MOUSE_LEAVE.toString(), _eventEnum.SystemEventType.MOUSE_UP.toString(), _eventEnum.SystemEventType.MOUSE_WHEEL.toString()]; // TODO: rearrange event

  function _touchStartHandler(touch, event) {
    var node = this.owner;

    if (!node || !node._uiProps.uiTransformComp) {
      return false;
    }

    touch.getUILocation(pos);

    if (node._uiProps.uiTransformComp.isHit(pos, this)) {
      event.type = _eventEnum.SystemEventType.TOUCH_START.toString();
      event.touch = touch;
      event.bubbles = true;
      node.dispatchEvent(event);
      return true;
    }

    return false;
  }

  function _touchMoveHandler(touch, event) {
    var node = this.owner;

    if (!node || !node._uiProps.uiTransformComp) {
      return false;
    }

    event.type = _eventEnum.SystemEventType.TOUCH_MOVE.toString();
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
  }

  function _touchEndHandler(touch, event) {
    var node = this.owner;

    if (!node || !node._uiProps.uiTransformComp) {
      return;
    }

    touch.getUILocation(pos);

    if (node._uiProps.uiTransformComp.isHit(pos, this)) {
      event.type = _eventEnum.SystemEventType.TOUCH_END.toString();
    } else {
      event.type = _eventEnum.SystemEventType.TOUCH_CANCEL.toString();
    }

    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
  }

  function _touchCancelHandler(touch, event) {
    var node = this.owner;

    if (!node || !node._uiProps.uiTransformComp) {
      return;
    }

    event.type = _eventEnum.SystemEventType.TOUCH_CANCEL.toString();
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
  }

  function _mouseDownHandler(event) {
    var node = this.owner;

    if (!node || !node._uiProps.uiTransformComp) {
      return;
    }

    pos = event.getUILocation();

    if (node._uiProps.uiTransformComp.isHit(pos, this)) {
      event.type = _eventEnum.SystemEventType.MOUSE_DOWN.toString();
      event.bubbles = true;
      node.dispatchEvent(event);
    }
  }

  function _mouseMoveHandler(event) {
    var node = this.owner;

    if (!node || !node._uiProps.uiTransformComp) {
      return;
    }

    pos = event.getUILocation();

    var hit = node._uiProps.uiTransformComp.isHit(pos, this);

    if (hit) {
      if (!this._previousIn) {
        // Fix issue when hover node switched, previous hovered node won't get MOUSE_LEAVE notification
        if (_currentHovered && _currentHovered.eventProcessor.mouseListener) {
          event.type = _eventEnum.SystemEventType.MOUSE_LEAVE;

          _currentHovered.dispatchEvent(event);

          if (_currentHovered.eventProcessor.mouseListener) {
            _currentHovered.eventProcessor.mouseListener._previousIn = false;
          }
        }

        _currentHovered = node;
        event.type = _eventEnum.SystemEventType.MOUSE_ENTER.toString();
        node.dispatchEvent(event);
        this._previousIn = true;
      }

      event.type = _eventEnum.SystemEventType.MOUSE_MOVE.toString();
      event.bubbles = true;
      node.dispatchEvent(event);
    } else if (this._previousIn) {
      event.type = _eventEnum.SystemEventType.MOUSE_LEAVE.toString();
      node.dispatchEvent(event);
      this._previousIn = false;
      _currentHovered = null;
    } else {
      // continue dispatching
      return;
    } // Event processed, cleanup
    // event.propagationStopped = true;


    event.propagationStopped = true;
  }

  function _mouseUpHandler(event) {
    var node = this.owner;

    if (!node || !node._uiProps.uiTransformComp) {
      return;
    }

    pos = event.getUILocation();

    if (node._uiProps.uiTransformComp.isHit(pos, this)) {
      event.type = _eventEnum.SystemEventType.MOUSE_UP.toString();
      event.bubbles = true;
      node.dispatchEvent(event); // event.propagationStopped = true;

      event.propagationStopped = true;
    }
  }

  function _mouseWheelHandler(event) {
    var node = this.owner;

    if (!node || !node._uiProps.uiTransformComp) {
      return;
    }

    pos = event.getUILocation();

    if (node._uiProps.uiTransformComp.isHit(pos, this)) {
      event.type = _eventEnum.SystemEventType.MOUSE_WHEEL.toString();
      event.bubbles = true;
      node.dispatchEvent(event); // event.propagationStopped = true;

      event.propagationStopped = true;
    }
  }

  function _doDispatchEvent(owner, event) {
    var target;
    var i = 0;
    event.target = owner; // Event.CAPTURING_PHASE

    _cachedArray.length = 0;
    owner.eventProcessor.getCapturingTargets(event.type, _cachedArray); // capturing

    event.eventPhase = 1;

    for (i = _cachedArray.length - 1; i >= 0; --i) {
      target = _cachedArray[i];

      if (target.eventProcessor.capturingTargets) {
        event.currentTarget = target; // fire event

        target.eventProcessor.capturingTargets.emit(event.type, event, _cachedArray); // check if propagation stopped

        if (event.propagationStopped) {
          _cachedArray.length = 0;
          return;
        }
      }
    }

    _cachedArray.length = 0; // Event.AT_TARGET
    // checks if destroyed in capturing callbacks

    event.eventPhase = 2;
    event.currentTarget = owner;

    if (owner.eventProcessor.capturingTargets) {
      owner.eventProcessor.capturingTargets.emit(event.type, event);
    }

    if (!event.propagationImmediateStopped && owner.eventProcessor.bubblingTargets) {
      owner.eventProcessor.bubblingTargets.emit(event.type, event);
    }

    if (!event.propagationStopped && event.bubbles) {
      // Event.BUBBLING_PHASE
      owner.eventProcessor.getBubblingTargets(event.type, _cachedArray); // propagate

      event.eventPhase = 3;

      for (i = 0; i < _cachedArray.length; ++i) {
        target = _cachedArray[i];

        if (target.eventProcessor.bubblingTargets) {
          event.currentTarget = target; // fire event

          target.eventProcessor.bubblingTargets.emit(event.type, event); // check if propagation stopped

          if (event.propagationStopped) {
            _cachedArray.length = 0;
            return;
          }
        }
      }
    }

    _cachedArray.length = 0;
  }

  function _searchMaskInParent(node) {
    var Mask = _globalExports.legacyCC.Mask;

    if (Mask) {
      var index = 0;

      for (var curr = node; curr && _globalExports.legacyCC.Node.isNode(curr); curr = curr.parent, ++index) {
        if (curr.getComponent(Mask)) {
          return {
            index: index,
            node: curr
          };
        }
      }
    }

    return null;
  }

  function _checkListeners(node, events) {
    if (!node._persistNode) {
      if (node.eventProcessor.bubblingTargets) {
        for (var i = 0; i < events.length; ++i) {
          if (node.eventProcessor.bubblingTargets.hasEventListener(events[i])) {
            return true;
          }
        }
      }

      if (node.eventProcessor.capturingTargets) {
        for (var _i = 0; _i < events.length; ++_i) {
          if (node.eventProcessor.capturingTargets.hasEventListener(events[_i])) {
            return true;
          }
        }
      }

      return false;
    }

    return true;
  }
  /**
   * @zh
   * 节点事件类。
   */


  var NodeEventProcessor = /*#__PURE__*/function () {
    _createClass(NodeEventProcessor, [{
      key: "node",
      get: function get() {
        return this._node;
      }
      /**
       * @zh
       * 节点冒泡事件监听器
       */

    }]);

    function NodeEventProcessor(node) {
      _classCallCheck(this, NodeEventProcessor);

      this.bubblingTargets = null;
      this.capturingTargets = null;
      this.touchListener = null;
      this.mouseListener = null;
      this._node = void 0;
      this._node = node;
    }

    _createClass(NodeEventProcessor, [{
      key: "reattach",
      value: function reattach() {
        if (this.touchListener) {
          var mask = this.touchListener.mask = _searchMaskInParent(this._node);

          if (this.mouseListener) {
            this.mouseListener.mask = mask;
          }
        } else if (this.mouseListener) {
          this.mouseListener.mask = _searchMaskInParent(this._node);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (_currentHovered === this._node) {
          _currentHovered = null;
        } // Remove all event listeners if necessary


        if (this.touchListener || this.mouseListener) {
          _eventManager.eventManager.removeListeners(this._node);

          if (this.touchListener) {
            this.touchListener.owner = null;
            this.touchListener.mask = null;
            this.touchListener = null;
          }

          if (this.mouseListener) {
            this.mouseListener.owner = null;
            this.mouseListener.mask = null;
            this.mouseListener = null;
          }
        }

        this.capturingTargets && this.capturingTargets.clear();
        this.bubblingTargets && this.bubblingTargets.clear();
      }
      /**
       * @zh
       * 在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的 this 对象。<br/>
       * 鼠标或触摸事件会被系统调用 dispatchEvent 方法触发，触发的过程包含三个阶段：<br/>
       * 1. 捕获阶段：派发事件给捕获目标（通过 `getCapturingTargets` 获取），比如，节点树中注册了捕获阶段的父节点，从根节点开始派发直到目标节点。<br/>
       * 2. 目标阶段：派发给目标节点的监听器。<br/>
       * 3. 冒泡阶段：派发事件给冒泡目标（通过 `getBubblingTargets` 获取），比如，节点树中注册了冒泡阶段的父节点，从目标节点开始派发直到根节点。<br/>
       * 同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。<br/>
       * 推荐使用这种方式来监听节点上的触摸或鼠标事件，请不要在节点上直接使用 `eventManager`。<br/>
       * 你也可以注册自定义事件到节点上，并通过 emit 方法触发此类事件，对于这类事件，不会发生捕获冒泡阶段，只会直接派发给注册在该节点上的监听器。<br/>
       * 你可以通过在 emit 方法调用时在 type 之后传递额外的参数作为事件回调的参数列表。<br/>
       *
       * @param type - 一个监听事件类型的字符串。参见：[[EventType]]
       * @param callback - 事件分派时将被调用的回调函数。如果该回调存在则不会重复添加。
       * @param callback.event - 事件派发的时候回调的第一个参数。
       * @param callback.arg2 - 第二个参数。
       * @param callback.arg3 - 第三个参数。
       * @param callback.arg4 - 第四个参数。
       * @param callback.arg5 - 第五个参数。
       * @param target - 调用回调的目标。可以为空。
       * @param useCapture - 当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
       * @return - 返回监听回调函数自身。
       *
       * @example
       * ```ts
       * import { Node } from 'cc';
       * this.node.on(Node.EventType.TOUCH_START, this.memberFunction, this);  // if "this" is component and the "memberFunction" declared in CCClass.
       * this.node.on(Node.EventType.TOUCH_START, callback, this);
       * this.node.on(Node.EventType.ANCHOR_CHANGED, callback);
       * ```
       */

    }, {
      key: "on",
      value: function on(type, callback, target, useCapture) {
        var forDispatch = this._checknSetupSysEvent(type);

        if (forDispatch) {
          return this._onDispatch(type, callback, target, useCapture);
        } else {
          // switch (type) {
          //     case EventType.POSITION_CHANGED:
          //         this._eventMask |= POSITION_ON;
          //         break;
          //     case EventType.SCALE_CHANGED:
          //         this._eventMask |= SCALE_ON;
          //         break;
          //     case EventType.ROTATION_CHANGED:
          //         this._eventMask |= ROTATION_ON;
          //         break;
          //     case EventType.SIZE_CHANGED:
          //         this._eventMask |= SIZE_ON;
          //         break;
          //     case EventType.ANCHOR_CHANGED:
          //         this._eventMask |= ANCHOR_ON;
          //         break;
          // }
          if (!this.bubblingTargets) {
            this.bubblingTargets = new _callbacksInvoker.CallbacksInvoker();
          }

          return this.bubblingTargets.on(type, callback, target);
        }
      }
      /**
       * @zh
       * 注册节点的特定事件类型回调，回调会在第一时间被触发后删除自身。
       *
       * @param type - 一个监听事件类型的字符串。参见：[[EventType]]。
       * @param callback - 事件分派时将被调用的回调函数。如果该回调存在则不会重复添加。
       * @param callback.event - 事件派发的时候回调的第一个参数。
       * @param callback.arg2 - 第二个参数。
       * @param callback.arg3 - 第三个参数。
       * @param callback.arg4 - 第四个参数。
       * @param callback.arg5 - 第五个参数。
       * @param target - 调用回调的目标。可以为空。
       * @param useCapture - 当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
       *
       * @example
       * ```ts
       * import { Node } from 'cc';
       * node.once(Node.EventType.ANCHOR_CHANGED, callback);
       * ```
       */

    }, {
      key: "once",
      value: function once(type, callback, target, useCapture) {
        var _this = this;

        var forDispatch = this._checknSetupSysEvent(type);

        var listeners;

        if (forDispatch && useCapture) {
          listeners = this.capturingTargets = this.capturingTargets || new _callbacksInvoker.CallbacksInvoker();
        } else {
          listeners = this.bubblingTargets = this.bubblingTargets || new _callbacksInvoker.CallbacksInvoker();
        }

        listeners.on(type, callback, target, true);
        listeners.on(type, function () {
          _this.off(type, callback, target);
        }, undefined, true);
      }
      /**
       * @zh
       * 删除之前与同类型，回调，目标或 useCapture 注册的回调。
       *
       * @param type - 一个监听事件类型的字符串。参见：[[EventType]]。
       * @param callback - 移除指定注册回调。如果没有给，则删除全部同事件类型的监听。
       * @param target - 调用回调的目标。配合 callback 一起使用。
       * @param useCapture - 当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
       *
       * @example
       * ```ts
       * import { Node } from 'cc';
       * this.node.off(Node.EventType.TOUCH_START, this.memberFunction, this);
       * node.off(Node.EventType.TOUCH_START, callback, this.node);
       * node.off(Node.EventType.ANCHOR_CHANGED, callback, this);
       * ```
       */

    }, {
      key: "off",
      value: function off(type, callback, target, useCapture) {
        var touchEvent = _touchEvents.indexOf(type) !== -1;
        var mouseEvent = !touchEvent && _mouseEvents.indexOf(type) !== -1;

        if (touchEvent || mouseEvent) {
          this._offDispatch(type, callback, target, useCapture);

          if (touchEvent) {
            if (this.touchListener && !_checkListeners(this._node, _touchEvents)) {
              _eventManager.eventManager.removeListener(this.touchListener);

              this.touchListener = null;
            }
          } else if (mouseEvent) {
            if (this.mouseListener && !_checkListeners(this._node, _mouseEvents)) {
              _eventManager.eventManager.removeListener(this.mouseListener);

              this.mouseListener = null;
            }
          }
        } else if (this.bubblingTargets) {
          this.bubblingTargets.off(type, callback, target); // const hasListeners = this.bubblingTargets.hasEventListener(type);
          // All listener removed
          // if (!hasListeners) {
          //     switch (type) {
          //         case EventType.POSITION_CHANGED:
          //             this._eventMask &= ~POSITION_ON;
          //             break;
          //         case EventType.SCALE_CHANGED:
          //             this._eventMask &= ~SCALE_ON;
          //             break;
          //         case EventType.ROTATION_CHANGED:
          //             this._eventMask &= ~ROTATION_ON;
          //             break;
          //         case EventType.SIZE_CHANGED:
          //             this._eventMask &= ~SIZE_ON;
          //             break;
          //         case EventType.ANCHOR_CHANGED:
          //             this._eventMask &= ~ANCHOR_ON;
          //             break;
          //     }
          // }
        }
      }
      /**
       * @zh
       * 通过事件名发送自定义事件
       *
       * @param type - 一个监听事件类型的字符串。
       * @param arg0 - 回调第一个参数。
       * @param arg1 - 回调第二个参数。
       * @param arg2 - 回调第三个参数。
       * @param arg3 - 回调第四个参数。
       * @param arg4 - 回调第五个参数。
       * @example
       * ```ts
       * eventTarget.emit('fire', event);
       * eventTarget.emit('fire', message, emitter);
       * ```
       */

    }, {
      key: "emit",
      value: function emit(type, arg0, arg1, arg2, arg3, arg4) {
        if (this.bubblingTargets) {
          this.bubblingTargets.emit(type, arg0, arg1, arg2, arg3, arg4);
        }
      }
      /**
       * @zh
       * 分发事件到事件流中。
       *
       * @param event - 分派到事件流中的事件对象。
       */

    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        _doDispatchEvent(this._node, event);

        _cachedArray.length = 0;
      }
      /**
       * @zh
       * 是否监听过某事件。
       *
       * @param type - 一个监听事件类型的字符串。
       * @param callback - The callback function of the event listener, if absent all event listeners for the given type will be removed
       * @param target - The callback callee of the event listener
       * @return - 返回是否当前节点已监听该事件类型。
       */

    }, {
      key: "hasEventListener",
      value: function hasEventListener(type, callback, target) {
        var has = false;

        if (this.bubblingTargets) {
          has = this.bubblingTargets.hasEventListener(type, callback, target);
        }

        if (!has && this.capturingTargets) {
          has = this.capturingTargets.hasEventListener(type, callback, target);
        }

        return has;
      }
      /**
       * @zh
       * 移除在特定事件类型中注册的所有回调或在某个目标中注册的所有回调。
       *
       * @param target - 要删除的事件键或要删除的目标。
       */

    }, {
      key: "targetOff",
      value: function targetOff(target) {
        if (this.capturingTargets) {
          this.capturingTargets.removeAll(target);
        }

        if (this.bubblingTargets) {
          this.bubblingTargets.removeAll(target);
        }

        if (this.touchListener && !_checkListeners(this.node, _touchEvents)) {
          _eventManager.eventManager.removeListener(this.touchListener);

          this.touchListener = null;
        }

        if (this.mouseListener && !_checkListeners(this.node, _mouseEvents)) {
          _eventManager.eventManager.removeListener(this.mouseListener);

          this.mouseListener = null;
        }
      }
      /**
       * @zh
       * 获得所提供的事件类型在目标捕获阶段监听的所有目标。
       * 捕获阶段包括从根节点到目标节点的过程。
       * 结果保存在数组参数中，并且必须从子节点排序到父节点。
       *
       * @param type - 一个监听事件类型的字符串。
       * @param array - 接收目标的数组。
       */

    }, {
      key: "getCapturingTargets",
      value: function getCapturingTargets(type, targets) {
        var parent = this._node.parent;

        while (parent) {
          if (parent.eventProcessor.capturingTargets && parent.eventProcessor.capturingTargets.hasEventListener(type)) {
            targets.push(parent);
          }

          parent = parent.parent;
        }
      }
      /**
       * @zh
       * 获得所提供的事件类型在目标冒泡阶段监听的所有目标。
       * 冒泡阶段目标节点到根节点的过程。
       * 结果保存在数组参数中，并且必须从子节点排序到父节点。
       *
       * @param type - 一个监听事件类型的字符串。
       * @param array - 接收目标的数组。
       */

    }, {
      key: "getBubblingTargets",
      value: function getBubblingTargets(type, targets) {
        var parent = this._node.parent;

        while (parent) {
          if (parent.eventProcessor.bubblingTargets && parent.eventProcessor.bubblingTargets.hasEventListener(type)) {
            targets.push(parent);
          }

          parent = parent.parent;
        }
      } // EVENT TARGET

    }, {
      key: "_checknSetupSysEvent",
      value: function _checknSetupSysEvent(type) {
        var _this2 = this;

        var newAdded = false;
        var forDispatch = false; // just for ui

        if (_touchEvents.indexOf(type) !== -1) {
          if (!this.touchListener) {
            this.touchListener = _globalExports.legacyCC.EventListener.create({
              event: _globalExports.legacyCC.EventListener.TOUCH_ONE_BY_ONE,
              swallowTouches: true,
              owner: this._node,
              mask: _searchMaskInParent(this._node),
              onTouchBegan: _touchStartHandler,
              onTouchMoved: _touchMoveHandler,
              onTouchEnded: _touchEndHandler,
              onTouchCancelled: _touchCancelHandler
            });

            _eventManager.eventManager.addListener(this.touchListener, this._node);

            newAdded = true;
          }

          forDispatch = true;
        } else if (_mouseEvents.indexOf(type) !== -1) {
          if (!this.mouseListener) {
            this.mouseListener = _globalExports.legacyCC.EventListener.create({
              event: _globalExports.legacyCC.EventListener.MOUSE,
              _previousIn: false,
              owner: this._node,
              mask: _searchMaskInParent(this._node),
              onMouseDown: _mouseDownHandler,
              onMouseMove: _mouseMoveHandler,
              onMouseUp: _mouseUpHandler,
              onMouseScroll: _mouseWheelHandler
            });

            _eventManager.eventManager.addListener(this.mouseListener, this._node);

            newAdded = true;
          }

          forDispatch = true;
        }

        if (newAdded && !this._node.activeInHierarchy) {
          _globalExports.legacyCC.director.getScheduler().schedule(function () {
            if (!_this2._node.activeInHierarchy) {
              _eventManager.eventManager.pauseTarget(_this2._node);
            }
          }, this._node, 0, 0, 0, false);
        }

        return forDispatch;
      }
    }, {
      key: "_onDispatch",
      value: function _onDispatch(type, callback, target, useCapture) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
          useCapture = target;
          target = undefined;
        } else {
          useCapture = !!useCapture;
        }

        if (!callback) {
          (0, _debug.errorID)(6800);
          return;
        }

        var listeners = null;

        if (useCapture) {
          listeners = this.capturingTargets = this.capturingTargets || new _callbacksInvoker.CallbacksInvoker();
        } else {
          listeners = this.bubblingTargets = this.bubblingTargets || new _callbacksInvoker.CallbacksInvoker();
        }

        if (!listeners.hasEventListener(type, callback, target)) {
          listeners.on(type, callback, target);
        }

        return callback;
      }
    }, {
      key: "_offDispatch",
      value: function _offDispatch(type, callback, target, useCapture) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
          useCapture = target;
          target = undefined;
        } else {
          useCapture = !!useCapture;
        }

        if (!callback) {
          if (this.capturingTargets) {
            this.capturingTargets.removeAll(type);
          }

          if (this.bubblingTargets) {
            this.bubblingTargets.removeAll(type);
          }
        } else {
          var listeners = useCapture ? this.capturingTargets : this.bubblingTargets;

          if (listeners) {
            listeners.off(type, callback, target);
          }
        }
      }
    }]);

    return NodeEventProcessor;
  }();

  _exports.NodeEventProcessor = NodeEventProcessor;
  _globalExports.legacyCC.NodeEventProcessor = NodeEventProcessor;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZS1ldmVudC1wcm9jZXNzb3IudHMiXSwibmFtZXMiOlsiX2NhY2hlZEFycmF5IiwiQXJyYXkiLCJfY3VycmVudEhvdmVyZWQiLCJwb3MiLCJWZWMyIiwiX3RvdWNoRXZlbnRzIiwiU3lzdGVtRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJ0b1N0cmluZyIsIlRPVUNIX01PVkUiLCJUT1VDSF9FTkQiLCJUT1VDSF9DQU5DRUwiLCJfbW91c2VFdmVudHMiLCJNT1VTRV9ET1dOIiwiTU9VU0VfRU5URVIiLCJNT1VTRV9NT1ZFIiwiTU9VU0VfTEVBVkUiLCJNT1VTRV9VUCIsIk1PVVNFX1dIRUVMIiwiX3RvdWNoU3RhcnRIYW5kbGVyIiwidG91Y2giLCJldmVudCIsIm5vZGUiLCJvd25lciIsIl91aVByb3BzIiwidWlUcmFuc2Zvcm1Db21wIiwiZ2V0VUlMb2NhdGlvbiIsImlzSGl0IiwidHlwZSIsImJ1YmJsZXMiLCJkaXNwYXRjaEV2ZW50IiwiX3RvdWNoTW92ZUhhbmRsZXIiLCJfdG91Y2hFbmRIYW5kbGVyIiwiX3RvdWNoQ2FuY2VsSGFuZGxlciIsIl9tb3VzZURvd25IYW5kbGVyIiwiX21vdXNlTW92ZUhhbmRsZXIiLCJoaXQiLCJfcHJldmlvdXNJbiIsImV2ZW50UHJvY2Vzc29yIiwibW91c2VMaXN0ZW5lciIsInByb3BhZ2F0aW9uU3RvcHBlZCIsIl9tb3VzZVVwSGFuZGxlciIsIl9tb3VzZVdoZWVsSGFuZGxlciIsIl9kb0Rpc3BhdGNoRXZlbnQiLCJ0YXJnZXQiLCJpIiwibGVuZ3RoIiwiZ2V0Q2FwdHVyaW5nVGFyZ2V0cyIsImV2ZW50UGhhc2UiLCJjYXB0dXJpbmdUYXJnZXRzIiwiY3VycmVudFRhcmdldCIsImVtaXQiLCJwcm9wYWdhdGlvbkltbWVkaWF0ZVN0b3BwZWQiLCJidWJibGluZ1RhcmdldHMiLCJnZXRCdWJibGluZ1RhcmdldHMiLCJfc2VhcmNoTWFza0luUGFyZW50IiwiTWFzayIsImxlZ2FjeUNDIiwiaW5kZXgiLCJjdXJyIiwiTm9kZSIsImlzTm9kZSIsInBhcmVudCIsImdldENvbXBvbmVudCIsIl9jaGVja0xpc3RlbmVycyIsImV2ZW50cyIsIl9wZXJzaXN0Tm9kZSIsImhhc0V2ZW50TGlzdGVuZXIiLCJOb2RlRXZlbnRQcm9jZXNzb3IiLCJfbm9kZSIsInRvdWNoTGlzdGVuZXIiLCJtYXNrIiwiZXZlbnRNYW5hZ2VyIiwicmVtb3ZlTGlzdGVuZXJzIiwiY2xlYXIiLCJjYWxsYmFjayIsInVzZUNhcHR1cmUiLCJmb3JEaXNwYXRjaCIsIl9jaGVja25TZXR1cFN5c0V2ZW50IiwiX29uRGlzcGF0Y2giLCJDYWxsYmFja3NJbnZva2VyIiwib24iLCJsaXN0ZW5lcnMiLCJvZmYiLCJ1bmRlZmluZWQiLCJ0b3VjaEV2ZW50IiwiaW5kZXhPZiIsIm1vdXNlRXZlbnQiLCJfb2ZmRGlzcGF0Y2giLCJyZW1vdmVMaXN0ZW5lciIsImFyZzAiLCJhcmcxIiwiYXJnMiIsImFyZzMiLCJhcmc0IiwiaGFzIiwicmVtb3ZlQWxsIiwidGFyZ2V0cyIsInB1c2giLCJuZXdBZGRlZCIsIkV2ZW50TGlzdGVuZXIiLCJjcmVhdGUiLCJUT1VDSF9PTkVfQllfT05FIiwic3dhbGxvd1RvdWNoZXMiLCJvblRvdWNoQmVnYW4iLCJvblRvdWNoTW92ZWQiLCJvblRvdWNoRW5kZWQiLCJvblRvdWNoQ2FuY2VsbGVkIiwiYWRkTGlzdGVuZXIiLCJNT1VTRSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJvbk1vdXNlU2Nyb2xsIiwiYWN0aXZlSW5IaWVyYXJjaHkiLCJkaXJlY3RvciIsImdldFNjaGVkdWxlciIsInNjaGVkdWxlIiwicGF1c2VUYXJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMENBLE1BQU1BLFlBQVksR0FBRyxJQUFJQyxLQUFKLENBQW9CLEVBQXBCLENBQXJCOztBQUNBLE1BQUlDLGVB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QjtBQUNIO0FBQ0o7QUFDSjs7Ozs7OztBQUdMYSwwQkFBU1csa0JBQVQsR0FBOEJBLGtCQUE5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IEV2ZW50IGZyb20gJy4uL2V2ZW50L2V2ZW50JztcclxuaW1wb3J0IHsgVmVjMiB9IGZyb20gJy4uL21hdGgvdmVjMic7XHJcbmltcG9ydCB7IFN5c3RlbUV2ZW50VHlwZSB9IGZyb20gJy4uL3BsYXRmb3JtL2V2ZW50LW1hbmFnZXIvZXZlbnQtZW51bSc7XHJcbmltcG9ydCB7IEV2ZW50TGlzdGVuZXIgfSBmcm9tICcuLi9wbGF0Zm9ybS9ldmVudC1tYW5hZ2VyL2V2ZW50LWxpc3RlbmVyJztcclxuaW1wb3J0IHsgZXZlbnRNYW5hZ2VyIH0gZnJvbSAnLi4vcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9ldmVudC1tYW5hZ2VyJztcclxuaW1wb3J0IHsgRXZlbnRNb3VzZSwgRXZlbnRUb3VjaCB9IGZyb20gJy4uL3BsYXRmb3JtL2V2ZW50LW1hbmFnZXIvZXZlbnRzJztcclxuaW1wb3J0IHsgVG91Y2ggfSBmcm9tICcuLi9wbGF0Zm9ybS9ldmVudC1tYW5hZ2VyL3RvdWNoJztcclxuaW1wb3J0IHsgQmFzZU5vZGUgfSBmcm9tICcuL2Jhc2Utbm9kZSc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuL25vZGUnO1xyXG5pbXBvcnQgeyBDYWxsYmFja3NJbnZva2VyIH0gZnJvbSAnLi4vZXZlbnQvY2FsbGJhY2tzLWludm9rZXInO1xyXG5pbXBvcnQgeyBlcnJvcklEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmNvbnN0IF9jYWNoZWRBcnJheSA9IG5ldyBBcnJheTxCYXNlTm9kZT4oMTYpO1xyXG5sZXQgX2N1cnJlbnRIb3ZlcmVkOiBCYXNlTm9kZSB8IG51bGwgPSBudWxsO1xyXG5sZXQgcG9zID0gbmV3IFZlYzIoKTtcclxuXHJcbmNvbnN0IF90b3VjaEV2ZW50cyA9IFtcclxuICAgIFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9TVEFSVC50b1N0cmluZygpLFxyXG4gICAgU3lzdGVtRXZlbnRUeXBlLlRPVUNIX01PVkUudG9TdHJpbmcoKSxcclxuICAgIFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9FTkQudG9TdHJpbmcoKSxcclxuICAgIFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9DQU5DRUwudG9TdHJpbmcoKSxcclxuXTtcclxuXHJcbmNvbnN0IF9tb3VzZUV2ZW50cyA9IFtcclxuICAgIFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9ET1dOLnRvU3RyaW5nKCksXHJcbiAgICBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfRU5URVIudG9TdHJpbmcoKSxcclxuICAgIFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9NT1ZFLnRvU3RyaW5nKCksXHJcbiAgICBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfTEVBVkUudG9TdHJpbmcoKSxcclxuICAgIFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9VUC50b1N0cmluZygpLFxyXG4gICAgU3lzdGVtRXZlbnRUeXBlLk1PVVNFX1dIRUVMLnRvU3RyaW5nKCksXHJcbl07XHJcblxyXG4vLyBUT0RPOiByZWFycmFuZ2UgZXZlbnRcclxuZnVuY3Rpb24gX3RvdWNoU3RhcnRIYW5kbGVyICh0aGlzOiBFdmVudExpc3RlbmVyLCB0b3VjaDogVG91Y2gsIGV2ZW50OiBFdmVudFRvdWNoKSB7XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5vd25lciBhcyBOb2RlIHwgbnVsbDtcclxuICAgIGlmICghbm9kZSB8fCAhbm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXApIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdG91Y2guZ2V0VUlMb2NhdGlvbihwb3MpO1xyXG5cclxuICAgIGlmIChub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcC5pc0hpdChwb3MsIHRoaXMpKSB7XHJcbiAgICAgICAgZXZlbnQudHlwZSA9IFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9TVEFSVC50b1N0cmluZygpO1xyXG4gICAgICAgIGV2ZW50LnRvdWNoID0gdG91Y2g7XHJcbiAgICAgICAgZXZlbnQuYnViYmxlcyA9IHRydWU7XHJcbiAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF90b3VjaE1vdmVIYW5kbGVyICh0aGlzOiBFdmVudExpc3RlbmVyLCB0b3VjaDogVG91Y2gsIGV2ZW50OiBFdmVudFRvdWNoKSB7XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5vd25lciBhcyBOb2RlO1xyXG4gICAgaWYgKCFub2RlIHx8ICFub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBldmVudC50eXBlID0gU3lzdGVtRXZlbnRUeXBlLlRPVUNIX01PVkUudG9TdHJpbmcoKTtcclxuICAgIGV2ZW50LnRvdWNoID0gdG91Y2g7XHJcbiAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcclxuICAgIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF90b3VjaEVuZEhhbmRsZXIgKHRoaXM6IEV2ZW50TGlzdGVuZXIsIHRvdWNoOiBUb3VjaCwgZXZlbnQ6IEV2ZW50VG91Y2gpIHtcclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLm93bmVyIGFzIE5vZGU7XHJcbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRvdWNoLmdldFVJTG9jYXRpb24ocG9zKTtcclxuXHJcbiAgICBpZiAobm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAuaXNIaXQocG9zLCB0aGlzKSkge1xyXG4gICAgICAgIGV2ZW50LnR5cGUgPSBTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfRU5ELnRvU3RyaW5nKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGV2ZW50LnR5cGUgPSBTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgICBldmVudC50b3VjaCA9IHRvdWNoO1xyXG4gICAgZXZlbnQuYnViYmxlcyA9IHRydWU7XHJcbiAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfdG91Y2hDYW5jZWxIYW5kbGVyICh0aGlzOiBFdmVudExpc3RlbmVyLCB0b3VjaDogVG91Y2gsIGV2ZW50OiBFdmVudFRvdWNoKSB7XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5vd25lciBhcyBOb2RlO1xyXG4gICAgaWYgKCFub2RlIHx8ICFub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBldmVudC50eXBlID0gU3lzdGVtRXZlbnRUeXBlLlRPVUNIX0NBTkNFTC50b1N0cmluZygpO1xyXG4gICAgZXZlbnQudG91Y2ggPSB0b3VjaDtcclxuICAgIGV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xyXG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gX21vdXNlRG93bkhhbmRsZXIgKHRoaXM6IEV2ZW50TGlzdGVuZXIsIGV2ZW50OiBFdmVudE1vdXNlKSB7XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5vd25lciBhcyBOb2RlO1xyXG4gICAgaWYgKCFub2RlIHx8ICFub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBwb3MgPSBldmVudC5nZXRVSUxvY2F0aW9uKCk7XHJcblxyXG4gICAgaWYgKG5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wLmlzSGl0KHBvcywgdGhpcykpIHtcclxuICAgICAgICBldmVudC50eXBlID0gU3lzdGVtRXZlbnRUeXBlLk1PVVNFX0RPV04udG9TdHJpbmcoKTtcclxuICAgICAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcclxuICAgICAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBfbW91c2VNb3ZlSGFuZGxlciAodGhpczogRXZlbnRMaXN0ZW5lciwgZXZlbnQ6IEV2ZW50TW91c2UpIHtcclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLm93bmVyIGFzIE5vZGU7XHJcbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHBvcyA9IGV2ZW50LmdldFVJTG9jYXRpb24oKTtcclxuXHJcbiAgICBjb25zdCBoaXQgPSBub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcC5pc0hpdChwb3MsIHRoaXMpO1xyXG4gICAgaWYgKGhpdCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcHJldmlvdXNJbikge1xyXG4gICAgICAgICAgICAvLyBGaXggaXNzdWUgd2hlbiBob3ZlciBub2RlIHN3aXRjaGVkLCBwcmV2aW91cyBob3ZlcmVkIG5vZGUgd29uJ3QgZ2V0IE1PVVNFX0xFQVZFIG5vdGlmaWNhdGlvblxyXG4gICAgICAgICAgICBpZiAoX2N1cnJlbnRIb3ZlcmVkICYmIF9jdXJyZW50SG92ZXJlZCEuZXZlbnRQcm9jZXNzb3IubW91c2VMaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQudHlwZSA9IFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9MRUFWRTtcclxuICAgICAgICAgICAgICAgIF9jdXJyZW50SG92ZXJlZCEuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2N1cnJlbnRIb3ZlcmVkIS5ldmVudFByb2Nlc3Nvci5tb3VzZUxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2N1cnJlbnRIb3ZlcmVkIS5ldmVudFByb2Nlc3Nvci5tb3VzZUxpc3RlbmVyIS5fcHJldmlvdXNJbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF9jdXJyZW50SG92ZXJlZCA9IG5vZGU7XHJcbiAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfRU5URVIudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNJbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV2ZW50LnR5cGUgPSBTeXN0ZW1FdmVudFR5cGUuTU9VU0VfTU9WRS50b1N0cmluZygpO1xyXG4gICAgICAgIGV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xyXG4gICAgICAgIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3ByZXZpb3VzSW4pIHtcclxuICAgICAgICBldmVudC50eXBlID0gU3lzdGVtRXZlbnRUeXBlLk1PVVNFX0xFQVZFLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgICAgICB0aGlzLl9wcmV2aW91c0luID0gZmFsc2U7XHJcbiAgICAgICAgX2N1cnJlbnRIb3ZlcmVkID0gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gY29udGludWUgZGlzcGF0Y2hpbmdcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRXZlbnQgcHJvY2Vzc2VkLCBjbGVhbnVwXHJcbiAgICAvLyBldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xyXG4gICAgZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gX21vdXNlVXBIYW5kbGVyICh0aGlzOiBFdmVudExpc3RlbmVyLCBldmVudDogRXZlbnRNb3VzZSkge1xyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMub3duZXIgYXMgTm9kZTtcclxuICAgIGlmICghbm9kZSB8fCAhbm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgcG9zID0gZXZlbnQuZ2V0VUlMb2NhdGlvbigpO1xyXG5cclxuICAgIGlmIChub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcC5pc0hpdChwb3MsIHRoaXMpKSB7XHJcbiAgICAgICAgZXZlbnQudHlwZSA9IFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9VUC50b1N0cmluZygpO1xyXG4gICAgICAgIGV2ZW50LmJ1YmJsZXMgPSB0cnVlO1xyXG4gICAgICAgIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICAgICAgLy8gZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcclxuICAgICAgICBldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBfbW91c2VXaGVlbEhhbmRsZXIgKHRoaXM6IEV2ZW50TGlzdGVuZXIsIGV2ZW50OiBFdmVudE1vdXNlKSB7XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5vd25lciBhcyBOb2RlO1xyXG4gICAgaWYgKCFub2RlIHx8ICFub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBwb3MgPSBldmVudC5nZXRVSUxvY2F0aW9uKCk7XHJcblxyXG4gICAgaWYgKG5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wLmlzSGl0KHBvcywgdGhpcykpIHtcclxuICAgICAgICBldmVudC50eXBlID0gU3lzdGVtRXZlbnRUeXBlLk1PVVNFX1dIRUVMLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgZXZlbnQuYnViYmxlcyA9IHRydWU7XHJcbiAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgICAgICAvLyBldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xyXG4gICAgICAgIGV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9kb0Rpc3BhdGNoRXZlbnQgKG93bmVyOiBCYXNlTm9kZSwgZXZlbnQ6IEV2ZW50KSB7XHJcbiAgICBsZXQgdGFyZ2V0OiBCYXNlTm9kZTtcclxuICAgIGxldCBpID0gMDtcclxuICAgIGV2ZW50LnRhcmdldCA9IG93bmVyO1xyXG5cclxuICAgIC8vIEV2ZW50LkNBUFRVUklOR19QSEFTRVxyXG4gICAgX2NhY2hlZEFycmF5Lmxlbmd0aCA9IDA7XHJcbiAgICBvd25lci5ldmVudFByb2Nlc3Nvci5nZXRDYXB0dXJpbmdUYXJnZXRzKGV2ZW50LnR5cGUsIF9jYWNoZWRBcnJheSk7XHJcbiAgICAvLyBjYXB0dXJpbmdcclxuICAgIGV2ZW50LmV2ZW50UGhhc2UgPSAxO1xyXG4gICAgZm9yIChpID0gX2NhY2hlZEFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XHJcbiAgICAgICAgdGFyZ2V0ID0gX2NhY2hlZEFycmF5W2ldO1xyXG4gICAgICAgIGlmICh0YXJnZXQuZXZlbnRQcm9jZXNzb3IuY2FwdHVyaW5nVGFyZ2V0cykge1xyXG4gICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICAvLyBmaXJlIGV2ZW50XHJcbiAgICAgICAgICAgIHRhcmdldC5ldmVudFByb2Nlc3Nvci5jYXB0dXJpbmdUYXJnZXRzLmVtaXQoZXZlbnQudHlwZSwgZXZlbnQsIF9jYWNoZWRBcnJheSk7XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHByb3BhZ2F0aW9uIHN0b3BwZWRcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCkge1xyXG4gICAgICAgICAgICAgICAgX2NhY2hlZEFycmF5Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfY2FjaGVkQXJyYXkubGVuZ3RoID0gMDtcclxuXHJcbiAgICAvLyBFdmVudC5BVF9UQVJHRVRcclxuICAgIC8vIGNoZWNrcyBpZiBkZXN0cm95ZWQgaW4gY2FwdHVyaW5nIGNhbGxiYWNrc1xyXG4gICAgZXZlbnQuZXZlbnRQaGFzZSA9IDI7XHJcbiAgICBldmVudC5jdXJyZW50VGFyZ2V0ID0gb3duZXI7XHJcbiAgICBpZiAob3duZXIuZXZlbnRQcm9jZXNzb3IuY2FwdHVyaW5nVGFyZ2V0cykge1xyXG4gICAgICAgIG93bmVyLmV2ZW50UHJvY2Vzc29yLmNhcHR1cmluZ1RhcmdldHMuZW1pdChldmVudC50eXBlLCBldmVudCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWV2ZW50LnByb3BhZ2F0aW9uSW1tZWRpYXRlU3RvcHBlZCAmJiBvd25lci5ldmVudFByb2Nlc3Nvci5idWJibGluZ1RhcmdldHMpIHtcclxuICAgICAgICBvd25lci5ldmVudFByb2Nlc3Nvci5idWJibGluZ1RhcmdldHMuZW1pdChldmVudC50eXBlLCBldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgJiYgZXZlbnQuYnViYmxlcykge1xyXG4gICAgICAgIC8vIEV2ZW50LkJVQkJMSU5HX1BIQVNFXHJcbiAgICAgICAgb3duZXIuZXZlbnRQcm9jZXNzb3IuZ2V0QnViYmxpbmdUYXJnZXRzKGV2ZW50LnR5cGUsIF9jYWNoZWRBcnJheSk7XHJcbiAgICAgICAgLy8gcHJvcGFnYXRlXHJcbiAgICAgICAgZXZlbnQuZXZlbnRQaGFzZSA9IDM7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IF9jYWNoZWRBcnJheS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB0YXJnZXQgPSBfY2FjaGVkQXJyYXlbaV07XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQuZXZlbnRQcm9jZXNzb3IuYnViYmxpbmdUYXJnZXRzKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgLy8gZmlyZSBldmVudFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmV2ZW50UHJvY2Vzc29yLmJ1YmJsaW5nVGFyZ2V0cy5lbWl0KGV2ZW50LnR5cGUsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHByb3BhZ2F0aW9uIHN0b3BwZWRcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5wcm9wYWdhdGlvblN0b3BwZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBfY2FjaGVkQXJyYXkubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBfY2FjaGVkQXJyYXkubGVuZ3RoID0gMDtcclxufVxyXG5cclxuZnVuY3Rpb24gX3NlYXJjaE1hc2tJblBhcmVudCAobm9kZTogTm9kZSB8IG51bGwpIHtcclxuICAgIGNvbnN0IE1hc2sgPSBsZWdhY3lDQy5NYXNrO1xyXG4gICAgaWYgKE1hc2spIHtcclxuICAgICAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGN1cnIgPSBub2RlOyBjdXJyICYmIGxlZ2FjeUNDLk5vZGUuaXNOb2RlKGN1cnIpOyBjdXJyID0gY3Vyci5wYXJlbnQsICsraW5kZXgpIHtcclxuICAgICAgICAgICAgaWYgKGN1cnIuZ2V0Q29tcG9uZW50KE1hc2spKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IGN1cnIsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9jaGVja0xpc3RlbmVycyAobm9kZTogQmFzZU5vZGUsIGV2ZW50czogc3RyaW5nW10pIHtcclxuICAgIGlmICghbm9kZS5fcGVyc2lzdE5vZGUpIHtcclxuICAgICAgICBpZiAobm9kZS5ldmVudFByb2Nlc3Nvci5idWJibGluZ1RhcmdldHMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmV2ZW50UHJvY2Vzc29yLmJ1YmJsaW5nVGFyZ2V0cy5oYXNFdmVudExpc3RlbmVyKGV2ZW50c1tpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobm9kZS5ldmVudFByb2Nlc3Nvci5jYXB0dXJpbmdUYXJnZXRzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5ldmVudFByb2Nlc3Nvci5jYXB0dXJpbmdUYXJnZXRzLmhhc0V2ZW50TGlzdGVuZXIoZXZlbnRzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIOiKgueCueS6i+S7tuexu+OAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE5vZGVFdmVudFByb2Nlc3NvciB7XHJcbiAgICBwdWJsaWMgZ2V0IG5vZGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDoioLngrnlhpLms6Hkuovku7bnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgcHVibGljIGJ1YmJsaW5nVGFyZ2V0czogQ2FsbGJhY2tzSW52b2tlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDoioLngrnmjZXojrfkuovku7bnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNhcHR1cmluZ1RhcmdldHM6IENhbGxiYWNrc0ludm9rZXIgfCBudWxsID0gbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDop6bmkbjnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvdWNoTGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgfCBudWxsID0gbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDpvKDmoIfnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgcHVibGljIG1vdXNlTGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIF9ub2RlOiBCYXNlTm9kZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAobm9kZTogQmFzZU5vZGUpIHtcclxuICAgICAgICB0aGlzLl9ub2RlID0gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVhdHRhY2ggKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnRvdWNoTGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgbWFzayA9IHRoaXMudG91Y2hMaXN0ZW5lci5tYXNrID0gX3NlYXJjaE1hc2tJblBhcmVudCh0aGlzLl9ub2RlIGFzIE5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb3VzZUxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlTGlzdGVuZXIubWFzayA9IG1hc2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5tb3VzZUxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VMaXN0ZW5lci5tYXNrID0gX3NlYXJjaE1hc2tJblBhcmVudCh0aGlzLl9ub2RlIGFzIE5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKTogdm9pZHtcclxuICAgICAgICBpZiAoX2N1cnJlbnRIb3ZlcmVkID09PSB0aGlzLl9ub2RlKSB7XHJcbiAgICAgICAgICAgIF9jdXJyZW50SG92ZXJlZCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZW1vdmUgYWxsIGV2ZW50IGxpc3RlbmVycyBpZiBuZWNlc3NhcnlcclxuICAgICAgICBpZiAodGhpcy50b3VjaExpc3RlbmVyIHx8IHRoaXMubW91c2VMaXN0ZW5lcikge1xyXG4gICAgICAgICAgICBldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXJzKHRoaXMuX25vZGUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b3VjaExpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvdWNoTGlzdGVuZXIub3duZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b3VjaExpc3RlbmVyLm1hc2sgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b3VjaExpc3RlbmVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tb3VzZUxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlTGlzdGVuZXIub3duZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZUxpc3RlbmVyLm1hc2sgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZUxpc3RlbmVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jYXB0dXJpbmdUYXJnZXRzICYmIHRoaXMuY2FwdHVyaW5nVGFyZ2V0cy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuYnViYmxpbmdUYXJnZXRzICYmIHRoaXMuYnViYmxpbmdUYXJnZXRzLmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWcqOiKgueCueS4iuazqOWGjOaMh+Wumuexu+Wei+eahOWbnuiwg+WHveaVsO+8jOS5n+WPr+S7peiuvue9riB0YXJnZXQg55So5LqO57uR5a6a5ZON5bqU5Ye95pWw55qEIHRoaXMg5a+56LGh44CCPGJyLz5cclxuICAgICAqIOm8oOagh+aIluinpuaRuOS6i+S7tuS8muiiq+ezu+e7n+iwg+eUqCBkaXNwYXRjaEV2ZW50IOaWueazleinpuWPke+8jOinpuWPkeeahOi/h+eoi+WMheWQq+S4ieS4qumYtuaute+8mjxici8+XHJcbiAgICAgKiAxLiDmjZXojrfpmLbmrrXvvJrmtL7lj5Hkuovku7bnu5nmjZXojrfnm67moIfvvIjpgJrov4cgYGdldENhcHR1cmluZ1RhcmdldHNgIOiOt+WPlu+8ie+8jOavlOWmgu+8jOiKgueCueagkeS4reazqOWGjOS6huaNleiOt+mYtuauteeahOeItuiKgueCue+8jOS7juagueiKgueCueW8gOWni+a0vuWPkeebtOWIsOebruagh+iKgueCueOAgjxici8+XHJcbiAgICAgKiAyLiDnm67moIfpmLbmrrXvvJrmtL7lj5Hnu5nnm67moIfoioLngrnnmoTnm5HlkKzlmajjgII8YnIvPlxyXG4gICAgICogMy4g5YaS5rOh6Zi25q6177ya5rS+5Y+R5LqL5Lu257uZ5YaS5rOh55uu5qCH77yI6YCa6L+HIGBnZXRCdWJibGluZ1RhcmdldHNgIOiOt+WPlu+8ie+8jOavlOWmgu+8jOiKgueCueagkeS4reazqOWGjOS6huWGkuazoemYtuauteeahOeItuiKgueCue+8jOS7juebruagh+iKgueCueW8gOWni+a0vuWPkeebtOWIsOagueiKgueCueOAgjxici8+XHJcbiAgICAgKiDlkIzml7bmgqjlj6/ku6XlsIbkuovku7bmtL7lj5HliLDniLboioLngrnmiJbogIXpgJrov4fosIPnlKggc3RvcFByb3BhZ2F0aW9uIOaLpuaIquWug+OAgjxici8+XHJcbiAgICAgKiDmjqjojZDkvb/nlKjov5nnp43mlrnlvI/mnaXnm5HlkKzoioLngrnkuIrnmoTop6bmkbjmiJbpvKDmoIfkuovku7bvvIzor7fkuI3opoHlnKjoioLngrnkuIrnm7TmjqXkvb/nlKggYGV2ZW50TWFuYWdlcmDjgII8YnIvPlxyXG4gICAgICog5L2g5Lmf5Y+v5Lul5rOo5YaM6Ieq5a6a5LmJ5LqL5Lu25Yiw6IqC54K55LiK77yM5bm26YCa6L+HIGVtaXQg5pa55rOV6Kem5Y+R5q2k57G75LqL5Lu277yM5a+55LqO6L+Z57G75LqL5Lu277yM5LiN5Lya5Y+R55Sf5o2V6I635YaS5rOh6Zi25q6177yM5Y+q5Lya55u05o6l5rS+5Y+R57uZ5rOo5YaM5Zyo6K+l6IqC54K55LiK55qE55uR5ZCs5Zmo44CCPGJyLz5cclxuICAgICAqIOS9oOWPr+S7pemAmui/h+WcqCBlbWl0IOaWueazleiwg+eUqOaXtuWcqCB0eXBlIOS5i+WQjuS8oOmAkumineWklueahOWPguaVsOS9nOS4uuS6i+S7tuWbnuiwg+eahOWPguaVsOWIl+ihqOOAgjxici8+XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHR5cGUgLSDkuIDkuKrnm5HlkKzkuovku7bnsbvlnovnmoTlrZfnrKbkuLLjgILlj4Lop4HvvJpbW0V2ZW50VHlwZV1dXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgLSDkuovku7bliIbmtL7ml7blsIbooqvosIPnlKjnmoTlm57osIPlh73mlbDjgILlpoLmnpzor6Xlm57osIPlrZjlnKjliJnkuI3kvJrph43lpI3mt7vliqDjgIJcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjay5ldmVudCAtIOS6i+S7tua0vuWPkeeahOaXtuWAmeWbnuiwg+eahOesrOS4gOS4quWPguaVsOOAglxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrLmFyZzIgLSDnrKzkuozkuKrlj4LmlbDjgIJcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjay5hcmczIC0g56ys5LiJ5Liq5Y+C5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2suYXJnNCAtIOesrOWbm+S4quWPguaVsOOAglxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrLmFyZzUgLSDnrKzkupTkuKrlj4LmlbDjgIJcclxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSDosIPnlKjlm57osIPnmoTnm67moIfjgILlj6/ku6XkuLrnqbrjgIJcclxuICAgICAqIEBwYXJhbSB1c2VDYXB0dXJlIC0g5b2T6K6+572u5Li6IHRydWXvvIznm5HlkKzlmajlsIblnKjmjZXojrfpmLbmrrXop6blj5HvvIzlkKbliJnlsIblnKjlhpLms6HpmLbmrrXop6blj5HjgILpu5jorqTkuLogZmFsc2XjgIJcclxuICAgICAqIEByZXR1cm4gLSDov5Tlm57nm5HlkKzlm57osIPlh73mlbDoh6rouqvjgIJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGltcG9ydCB7IE5vZGUgfSBmcm9tICdjYyc7XHJcbiAgICAgKiB0aGlzLm5vZGUub24oTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMubWVtYmVyRnVuY3Rpb24sIHRoaXMpOyAgLy8gaWYgXCJ0aGlzXCIgaXMgY29tcG9uZW50IGFuZCB0aGUgXCJtZW1iZXJGdW5jdGlvblwiIGRlY2xhcmVkIGluIENDQ2xhc3MuXHJcbiAgICAgKiB0aGlzLm5vZGUub24oTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGNhbGxiYWNrLCB0aGlzKTtcclxuICAgICAqIHRoaXMubm9kZS5vbihOb2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgY2FsbGJhY2spO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbiAodHlwZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIHRhcmdldD86IE9iamVjdCwgdXNlQ2FwdHVyZT86IE9iamVjdCkge1xyXG4gICAgICAgIGNvbnN0IGZvckRpc3BhdGNoID0gdGhpcy5fY2hlY2tuU2V0dXBTeXNFdmVudCh0eXBlKTtcclxuICAgICAgICBpZiAoZm9yRGlzcGF0Y2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uRGlzcGF0Y2godHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgdXNlQ2FwdHVyZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBjYXNlIEV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VEOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuX2V2ZW50TWFzayB8PSBQT1NJVElPTl9PTjtcclxuICAgICAgICAgICAgLy8gICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgLy8gICAgIGNhc2UgRXZlbnRUeXBlLlNDQUxFX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5fZXZlbnRNYXNrIHw9IFNDQUxFX09OO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyAgICAgY2FzZSBFdmVudFR5cGUuUk9UQVRJT05fQ0hBTkdFRDpcclxuICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLl9ldmVudE1hc2sgfD0gUk9UQVRJT05fT047XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICBjYXNlIEV2ZW50VHlwZS5TSVpFX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5fZXZlbnRNYXNrIHw9IFNJWkVfT047XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICBjYXNlIEV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRDpcclxuICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLl9ldmVudE1hc2sgfD0gQU5DSE9SX09OO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5idWJibGluZ1RhcmdldHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnViYmxpbmdUYXJnZXRzID0gbmV3IENhbGxiYWNrc0ludm9rZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5idWJibGluZ1RhcmdldHMub24odHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDms6jlhozoioLngrnnmoTnibnlrprkuovku7bnsbvlnovlm57osIPvvIzlm57osIPkvJrlnKjnrKzkuIDml7bpl7Tooqvop6blj5HlkI7liKDpmaToh6rouqvjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdHlwZSAtIOS4gOS4quebkeWQrOS6i+S7tuexu+Wei+eahOWtl+espuS4suOAguWPguinge+8mltbRXZlbnRUeXBlXV3jgIJcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIOS6i+S7tuWIhua0vuaXtuWwhuiiq+iwg+eUqOeahOWbnuiwg+WHveaVsOOAguWmguaenOivpeWbnuiwg+WtmOWcqOWImeS4jeS8mumHjeWkjea3u+WKoOOAglxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrLmV2ZW50IC0g5LqL5Lu25rS+5Y+R55qE5pe25YCZ5Zue6LCD55qE56ys5LiA5Liq5Y+C5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2suYXJnMiAtIOesrOS6jOS4quWPguaVsOOAglxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrLmFyZzMgLSDnrKzkuInkuKrlj4LmlbDjgIJcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjay5hcmc0IC0g56ys5Zub5Liq5Y+C5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2suYXJnNSAtIOesrOS6lOS4quWPguaVsOOAglxyXG4gICAgICogQHBhcmFtIHRhcmdldCAtIOiwg+eUqOWbnuiwg+eahOebruagh+OAguWPr+S7peS4uuepuuOAglxyXG4gICAgICogQHBhcmFtIHVzZUNhcHR1cmUgLSDlvZPorr7nva7kuLogdHJ1Ze+8jOebkeWQrOWZqOWwhuWcqOaNleiOt+mYtuauteinpuWPke+8jOWQpuWImeWwhuWcqOWGkuazoemYtuauteinpuWPkeOAgum7mOiupOS4uiBmYWxzZeOAglxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogaW1wb3J0IHsgTm9kZSB9IGZyb20gJ2NjJztcclxuICAgICAqIG5vZGUub25jZShOb2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgY2FsbGJhY2spO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbmNlICh0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgdGFyZ2V0PzogT2JqZWN0LCB1c2VDYXB0dXJlPzogT2JqZWN0KSB7XHJcbiAgICAgICAgY29uc3QgZm9yRGlzcGF0Y2ggPSB0aGlzLl9jaGVja25TZXR1cFN5c0V2ZW50KHR5cGUpO1xyXG5cclxuICAgICAgICBsZXQgbGlzdGVuZXJzOiBDYWxsYmFja3NJbnZva2VyO1xyXG4gICAgICAgIGlmIChmb3JEaXNwYXRjaCAmJiB1c2VDYXB0dXJlKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IHRoaXMuY2FwdHVyaW5nVGFyZ2V0cyA9IHRoaXMuY2FwdHVyaW5nVGFyZ2V0cyB8fCBuZXcgQ2FsbGJhY2tzSW52b2tlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGlzdGVuZXJzID0gdGhpcy5idWJibGluZ1RhcmdldHMgPSB0aGlzLmJ1YmJsaW5nVGFyZ2V0cyB8fCBuZXcgQ2FsbGJhY2tzSW52b2tlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGlzdGVuZXJzLm9uKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIHRydWUpO1xyXG4gICAgICAgIGxpc3RlbmVycy5vbih0eXBlLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub2ZmKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpO1xyXG4gICAgICAgIH0sIHVuZGVmaW5lZCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWIoOmZpOS5i+WJjeS4juWQjOexu+Wei++8jOWbnuiwg++8jOebruagh+aIliB1c2VDYXB0dXJlIOazqOWGjOeahOWbnuiwg+OAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0eXBlIC0g5LiA5Liq55uR5ZCs5LqL5Lu257G75Z6L55qE5a2X56ym5Liy44CC5Y+C6KeB77yaW1tFdmVudFR5cGVdXeOAglxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIC0g56e76Zmk5oyH5a6a5rOo5YaM5Zue6LCD44CC5aaC5p6c5rKh5pyJ57uZ77yM5YiZ5Yig6Zmk5YWo6YOo5ZCM5LqL5Lu257G75Z6L55qE55uR5ZCs44CCXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0g6LCD55So5Zue6LCD55qE55uu5qCH44CC6YWN5ZCIIGNhbGxiYWNrIOS4gOi1t+S9v+eUqOOAglxyXG4gICAgICogQHBhcmFtIHVzZUNhcHR1cmUgLSDlvZPorr7nva7kuLogdHJ1Ze+8jOebkeWQrOWZqOWwhuWcqOaNleiOt+mYtuauteinpuWPke+8jOWQpuWImeWwhuWcqOWGkuazoemYtuauteinpuWPkeOAgum7mOiupOS4uiBmYWxzZeOAglxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogaW1wb3J0IHsgTm9kZSB9IGZyb20gJ2NjJztcclxuICAgICAqIHRoaXMubm9kZS5vZmYoTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMubWVtYmVyRnVuY3Rpb24sIHRoaXMpO1xyXG4gICAgICogbm9kZS5vZmYoTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGNhbGxiYWNrLCB0aGlzLm5vZGUpO1xyXG4gICAgICogbm9kZS5vZmYoTm9kZS5FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIGNhbGxiYWNrLCB0aGlzKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb2ZmICh0eXBlOiBzdHJpbmcsIGNhbGxiYWNrPzogRnVuY3Rpb24sIHRhcmdldD86IE9iamVjdCwgdXNlQ2FwdHVyZT86IE9iamVjdCkge1xyXG4gICAgICAgIGNvbnN0IHRvdWNoRXZlbnQgPSBfdG91Y2hFdmVudHMuaW5kZXhPZih0eXBlKSAhPT0gLTE7XHJcbiAgICAgICAgY29uc3QgbW91c2VFdmVudCA9ICF0b3VjaEV2ZW50ICYmIF9tb3VzZUV2ZW50cy5pbmRleE9mKHR5cGUpICE9PSAtMTtcclxuICAgICAgICBpZiAodG91Y2hFdmVudCB8fCBtb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29mZkRpc3BhdGNoKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIHVzZUNhcHR1cmUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRvdWNoRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRvdWNoTGlzdGVuZXIgJiYgIV9jaGVja0xpc3RlbmVycyh0aGlzLl9ub2RlLCBfdG91Y2hFdmVudHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKHRoaXMudG91Y2hMaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3VjaExpc3RlbmVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChtb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3VzZUxpc3RlbmVyICYmICFfY2hlY2tMaXN0ZW5lcnModGhpcy5fbm9kZSwgX21vdXNlRXZlbnRzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5yZW1vdmVMaXN0ZW5lcih0aGlzLm1vdXNlTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW91c2VMaXN0ZW5lciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYnViYmxpbmdUYXJnZXRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnViYmxpbmdUYXJnZXRzLm9mZih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGhhc0xpc3RlbmVycyA9IHRoaXMuYnViYmxpbmdUYXJnZXRzLmhhc0V2ZW50TGlzdGVuZXIodHlwZSk7XHJcbiAgICAgICAgICAgIC8vIEFsbCBsaXN0ZW5lciByZW1vdmVkXHJcbiAgICAgICAgICAgIC8vIGlmICghaGFzTGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBjYXNlIEV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VEOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gflBPU0lUSU9OX09OO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgLy8gICAgICAgICBjYXNlIEV2ZW50VHlwZS5TQ0FMRV9DSEFOR0VEOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gflNDQUxFX09OO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgLy8gICAgICAgICBjYXNlIEV2ZW50VHlwZS5ST1RBVElPTl9DSEFOR0VEOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gflJPVEFUSU9OX09OO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgLy8gICAgICAgICBjYXNlIEV2ZW50VHlwZS5TSVpFX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuX2V2ZW50TWFzayAmPSB+U0laRV9PTjtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgY2FzZSBFdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQ6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuX2V2ZW50TWFzayAmPSB+QU5DSE9SX09OO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6YCa6L+H5LqL5Lu25ZCN5Y+R6YCB6Ieq5a6a5LmJ5LqL5Lu2XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHR5cGUgLSDkuIDkuKrnm5HlkKzkuovku7bnsbvlnovnmoTlrZfnrKbkuLLjgIJcclxuICAgICAqIEBwYXJhbSBhcmcwIC0g5Zue6LCD56ys5LiA5Liq5Y+C5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gYXJnMSAtIOWbnuiwg+esrOS6jOS4quWPguaVsOOAglxyXG4gICAgICogQHBhcmFtIGFyZzIgLSDlm57osIPnrKzkuInkuKrlj4LmlbDjgIJcclxuICAgICAqIEBwYXJhbSBhcmczIC0g5Zue6LCD56ys5Zub5Liq5Y+C5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gYXJnNCAtIOWbnuiwg+esrOS6lOS4quWPguaVsOOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBldmVudFRhcmdldC5lbWl0KCdmaXJlJywgZXZlbnQpO1xyXG4gICAgICogZXZlbnRUYXJnZXQuZW1pdCgnZmlyZScsIG1lc3NhZ2UsIGVtaXR0ZXIpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxucHVibGljIGVtaXQgKHR5cGU6IHN0cmluZywgYXJnMD86IGFueSwgYXJnMT86IGFueSwgYXJnMj86IGFueSwgYXJnMz86IGFueSwgYXJnND86IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzLmJ1YmJsaW5nVGFyZ2V0cykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1YmJsaW5nVGFyZ2V0cy5lbWl0KHR5cGUsIGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5YiG5Y+R5LqL5Lu25Yiw5LqL5Lu25rWB5Lit44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50IC0g5YiG5rS+5Yiw5LqL5Lu25rWB5Lit55qE5LqL5Lu25a+56LGh44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkaXNwYXRjaEV2ZW50IChldmVudDogRXZlbnQpIHtcclxuICAgICAgICBfZG9EaXNwYXRjaEV2ZW50KHRoaXMuX25vZGUsIGV2ZW50KTtcclxuICAgICAgICBfY2FjaGVkQXJyYXkubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm55uR5ZCs6L+H5p+Q5LqL5Lu244CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHR5cGUgLSDkuIDkuKrnm5HlkKzkuovku7bnsbvlnovnmoTlrZfnrKbkuLLjgIJcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiBvZiB0aGUgZXZlbnQgbGlzdGVuZXIsIGlmIGFic2VudCBhbGwgZXZlbnQgbGlzdGVuZXJzIGZvciB0aGUgZ2l2ZW4gdHlwZSB3aWxsIGJlIHJlbW92ZWRcclxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgY2FsbGJhY2sgY2FsbGVlIG9mIHRoZSBldmVudCBsaXN0ZW5lclxyXG4gICAgICogQHJldHVybiAtIOi/lOWbnuaYr+WQpuW9k+WJjeiKgueCueW3suebkeWQrOivpeS6i+S7tuexu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGFzRXZlbnRMaXN0ZW5lciAodHlwZTogc3RyaW5nLCBjYWxsYmFjaz86IEZ1bmN0aW9uLCB0YXJnZXQ/OiBPYmplY3QpIHtcclxuICAgICAgICBsZXQgaGFzID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuYnViYmxpbmdUYXJnZXRzKSB7XHJcbiAgICAgICAgICAgIGhhcyA9IHRoaXMuYnViYmxpbmdUYXJnZXRzLmhhc0V2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghaGFzICYmIHRoaXMuY2FwdHVyaW5nVGFyZ2V0cykge1xyXG4gICAgICAgICAgICBoYXMgPSB0aGlzLmNhcHR1cmluZ1RhcmdldHMuaGFzRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhhcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog56e76Zmk5Zyo54m55a6a5LqL5Lu257G75Z6L5Lit5rOo5YaM55qE5omA5pyJ5Zue6LCD5oiW5Zyo5p+Q5Liq55uu5qCH5Lit5rOo5YaM55qE5omA5pyJ5Zue6LCD44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRhcmdldCAtIOimgeWIoOmZpOeahOS6i+S7tumUruaIluimgeWIoOmZpOeahOebruagh+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdGFyZ2V0T2ZmICh0YXJnZXQ6IHN0cmluZyB8IE9iamVjdCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhcHR1cmluZ1RhcmdldHMpIHtcclxuICAgICAgICAgICAgdGhpcy5jYXB0dXJpbmdUYXJnZXRzLnJlbW92ZUFsbCh0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5idWJibGluZ1RhcmdldHMpIHtcclxuICAgICAgICAgICAgdGhpcy5idWJibGluZ1RhcmdldHMucmVtb3ZlQWxsKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50b3VjaExpc3RlbmVyICYmICFfY2hlY2tMaXN0ZW5lcnModGhpcy5ub2RlLCBfdG91Y2hFdmVudHMpKSB7XHJcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5yZW1vdmVMaXN0ZW5lcih0aGlzLnRvdWNoTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnRvdWNoTGlzdGVuZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5tb3VzZUxpc3RlbmVyICYmICFfY2hlY2tMaXN0ZW5lcnModGhpcy5ub2RlLCBfbW91c2VFdmVudHMpKSB7XHJcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5yZW1vdmVMaXN0ZW5lcih0aGlzLm1vdXNlTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlTGlzdGVuZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635b6X5omA5o+Q5L6b55qE5LqL5Lu257G75Z6L5Zyo55uu5qCH5o2V6I636Zi25q6155uR5ZCs55qE5omA5pyJ55uu5qCH44CCXHJcbiAgICAgKiDmjZXojrfpmLbmrrXljIXmi6zku47moLnoioLngrnliLDnm67moIfoioLngrnnmoTov4fnqIvjgIJcclxuICAgICAqIOe7k+aenOS/neWtmOWcqOaVsOe7hOWPguaVsOS4re+8jOW5tuS4lOW/hemhu+S7juWtkOiKgueCueaOkuW6j+WIsOeItuiKgueCueOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0eXBlIC0g5LiA5Liq55uR5ZCs5LqL5Lu257G75Z6L55qE5a2X56ym5Liy44CCXHJcbiAgICAgKiBAcGFyYW0gYXJyYXkgLSDmjqXmlLbnm67moIfnmoTmlbDnu4TjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENhcHR1cmluZ1RhcmdldHMgKHR5cGU6IHN0cmluZywgdGFyZ2V0czogQmFzZU5vZGVbXSkge1xyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLl9ub2RlLnBhcmVudDtcclxuICAgICAgICB3aGlsZSAocGFyZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuZXZlbnRQcm9jZXNzb3IuY2FwdHVyaW5nVGFyZ2V0cyAmJiBwYXJlbnQuZXZlbnRQcm9jZXNzb3IuY2FwdHVyaW5nVGFyZ2V0cy5oYXNFdmVudExpc3RlbmVyKHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRzLnB1c2gocGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635b6X5omA5o+Q5L6b55qE5LqL5Lu257G75Z6L5Zyo55uu5qCH5YaS5rOh6Zi25q6155uR5ZCs55qE5omA5pyJ55uu5qCH44CCXHJcbiAgICAgKiDlhpLms6HpmLbmrrXnm67moIfoioLngrnliLDmoLnoioLngrnnmoTov4fnqIvjgIJcclxuICAgICAqIOe7k+aenOS/neWtmOWcqOaVsOe7hOWPguaVsOS4re+8jOW5tuS4lOW/hemhu+S7juWtkOiKgueCueaOkuW6j+WIsOeItuiKgueCueOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0eXBlIC0g5LiA5Liq55uR5ZCs5LqL5Lu257G75Z6L55qE5a2X56ym5Liy44CCXHJcbiAgICAgKiBAcGFyYW0gYXJyYXkgLSDmjqXmlLbnm67moIfnmoTmlbDnu4TjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEJ1YmJsaW5nVGFyZ2V0cyAodHlwZTogc3RyaW5nLCB0YXJnZXRzOiBCYXNlTm9kZVtdKSB7XHJcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuX25vZGUucGFyZW50O1xyXG4gICAgICAgIHdoaWxlIChwYXJlbnQpIHtcclxuICAgICAgICAgICAgaWYgKHBhcmVudC5ldmVudFByb2Nlc3Nvci5idWJibGluZ1RhcmdldHMgJiYgcGFyZW50LmV2ZW50UHJvY2Vzc29yLmJ1YmJsaW5nVGFyZ2V0cy5oYXNFdmVudExpc3RlbmVyKHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRzLnB1c2gocGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBFVkVOVCBUQVJHRVRcclxuXHJcbiAgICBwcml2YXRlIF9jaGVja25TZXR1cFN5c0V2ZW50ICh0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgbmV3QWRkZWQgPSBmYWxzZTtcclxuICAgICAgICBsZXQgZm9yRGlzcGF0Y2ggPSBmYWxzZTtcclxuICAgICAgICAvLyBqdXN0IGZvciB1aVxyXG4gICAgICAgIGlmIChfdG91Y2hFdmVudHMuaW5kZXhPZih0eXBlKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRvdWNoTGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG91Y2hMaXN0ZW5lciA9IGxlZ2FjeUNDLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudDogbGVnYWN5Q0MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FLFxyXG4gICAgICAgICAgICAgICAgICAgIHN3YWxsb3dUb3VjaGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLl9ub2RlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hc2s6IF9zZWFyY2hNYXNrSW5QYXJlbnQodGhpcy5fbm9kZSBhcyBOb2RlKSxcclxuICAgICAgICAgICAgICAgICAgICBvblRvdWNoQmVnYW46IF90b3VjaFN0YXJ0SGFuZGxlcixcclxuICAgICAgICAgICAgICAgICAgICBvblRvdWNoTW92ZWQ6IF90b3VjaE1vdmVIYW5kbGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIG9uVG91Y2hFbmRlZDogX3RvdWNoRW5kSGFuZGxlcixcclxuICAgICAgICAgICAgICAgICAgICBvblRvdWNoQ2FuY2VsbGVkOiBfdG91Y2hDYW5jZWxIYW5kbGVyLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIodGhpcy50b3VjaExpc3RlbmVyIGFzIEV2ZW50TGlzdGVuZXIsIHRoaXMuX25vZGUpO1xyXG4gICAgICAgICAgICAgICAgbmV3QWRkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvckRpc3BhdGNoID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKF9tb3VzZUV2ZW50cy5pbmRleE9mKHR5cGUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMubW91c2VMaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZUxpc3RlbmVyID0gbGVnYWN5Q0MuRXZlbnRMaXN0ZW5lci5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBsZWdhY3lDQy5FdmVudExpc3RlbmVyLk1PVVNFLFxyXG4gICAgICAgICAgICAgICAgICAgIF9wcmV2aW91c0luOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBvd25lcjogdGhpcy5fbm9kZSxcclxuICAgICAgICAgICAgICAgICAgICBtYXNrOiBfc2VhcmNoTWFza0luUGFyZW50KHRoaXMuX25vZGUgYXMgTm9kZSksXHJcbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd246IF9tb3VzZURvd25IYW5kbGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VNb3ZlOiBfbW91c2VNb3ZlSGFuZGxlcixcclxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlVXA6IF9tb3VzZVVwSGFuZGxlcixcclxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlU2Nyb2xsOiBfbW91c2VXaGVlbEhhbmRsZXIsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih0aGlzLm1vdXNlTGlzdGVuZXIgYXMgRXZlbnRMaXN0ZW5lciwgdGhpcy5fbm9kZSk7XHJcbiAgICAgICAgICAgICAgICBuZXdBZGRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yRGlzcGF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3QWRkZWQgJiYgIXRoaXMuX25vZGUuYWN0aXZlSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuc2NoZWR1bGUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9ub2RlLmFjdGl2ZUluSGllcmFyY2h5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMuX25vZGUgYXMgTm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMuX25vZGUsIDAsIDAsIDAsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZvckRpc3BhdGNoO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX29uRGlzcGF0Y2ggKHR5cGU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCB0YXJnZXQ/OiBPYmplY3QsIHVzZUNhcHR1cmU/OiBPYmplY3QpIHtcclxuICAgICAgICAvLyBBY2NlcHQgYWxzbyBwYXRhbWV0ZXJzIGxpa2U6ICh0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSlcclxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIHVzZUNhcHR1cmUgPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgIHRhcmdldCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9IGVsc2UgeyB1c2VDYXB0dXJlID0gISF1c2VDYXB0dXJlOyB9XHJcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBlcnJvcklEKDY4MDApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGlzdGVuZXJzOiBDYWxsYmFja3NJbnZva2VyIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgaWYgKHVzZUNhcHR1cmUpIHtcclxuICAgICAgICAgICAgbGlzdGVuZXJzID0gdGhpcy5jYXB0dXJpbmdUYXJnZXRzID0gdGhpcy5jYXB0dXJpbmdUYXJnZXRzIHx8IG5ldyBDYWxsYmFja3NJbnZva2VyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGlzdGVuZXJzID0gdGhpcy5idWJibGluZ1RhcmdldHMgPSB0aGlzLmJ1YmJsaW5nVGFyZ2V0cyB8fCBuZXcgQ2FsbGJhY2tzSW52b2tlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFsaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KSkge1xyXG4gICAgICAgICAgICBsaXN0ZW5lcnMub24odHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2FsbGJhY2s7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfb2ZmRGlzcGF0Y2ggKHR5cGU6IHN0cmluZywgY2FsbGJhY2s/OiBGdW5jdGlvbiwgdGFyZ2V0PzogT2JqZWN0LCB1c2VDYXB0dXJlPzogT2JqZWN0KSB7XHJcbiAgICAgICAgLy8gQWNjZXB0IGFsc28gcGF0YW1ldGVycyBsaWtlOiAodHlwZSwgY2FsbGJhY2ssIHVzZUNhcHR1cmUpXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICB1c2VDYXB0dXJlID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICB0YXJnZXQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSBlbHNlIHsgdXNlQ2FwdHVyZSA9ICEhdXNlQ2FwdHVyZTsgfVxyXG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FwdHVyaW5nVGFyZ2V0cyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhcHR1cmluZ1RhcmdldHMucmVtb3ZlQWxsKHR5cGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5idWJibGluZ1RhcmdldHMpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idWJibGluZ1RhcmdldHMucmVtb3ZlQWxsKHR5cGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdXNlQ2FwdHVyZSA/IHRoaXMuY2FwdHVyaW5nVGFyZ2V0cyA6IHRoaXMuYnViYmxpbmdUYXJnZXRzO1xyXG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMub2ZmKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5sZWdhY3lDQy5Ob2RlRXZlbnRQcm9jZXNzb3IgPSBOb2RlRXZlbnRQcm9jZXNzb3I7XHJcbiJdfQ==