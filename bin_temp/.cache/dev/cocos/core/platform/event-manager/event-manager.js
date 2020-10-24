(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../event/index.js", "./events.js", "./event-listener.js", "../macro.js", "../../global-exports.js", "../debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../event/index.js"), require("./events.js"), require("./event-listener.js"), require("../macro.js"), require("../../global-exports.js"), require("../debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.events, global.eventListener, global.macro, global.globalExports, global.debug);
    global.eventManager = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _events, _eventListener, _macro, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.eventManager = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var ListenerID = _eventListener.EventListener.ListenerID;

  function checkUINode(node) {
    if (node && node.getComponent('cc.UITransform')) {
      return true;
    }

    return false;
  } // tslint:disable-next-line: class-name


  var _EventListenerVector = /*#__PURE__*/function () {
    function _EventListenerVector() {
      _classCallCheck(this, _EventListenerVector);

      this.gt0Index = 0;
      this._fixedListeners = [];
      this._sceneGraphListeners = [];
    }

    _createClass(_EventListenerVector, [{
      key: "size",
      value: function size() {
        return this._fixedListeners.length + this._sceneGraphListeners.length;
      }
    }, {
      key: "empty",
      value: function empty() {
        return this._fixedListeners.length === 0 && this._sceneGraphListeners.length === 0;
      }
    }, {
      key: "push",
      value: function push(listener) {
        if (listener._getFixedPriority() === 0) {
          this._sceneGraphListeners.push(listener);
        } else {
          this._fixedListeners.push(listener);
        }
      }
    }, {
      key: "clearSceneGraphListeners",
      value: function clearSceneGraphListeners() {
        this._sceneGraphListeners.length = 0;
      }
    }, {
      key: "clearFixedListeners",
      value: function clearFixedListeners() {
        this._fixedListeners.length = 0;
      }
    }, {
      key: "clear",
      value: function clear() {
        this._sceneGraphListeners.length = 0;
        this._fixedListeners.length = 0;
      }
    }, {
      key: "getFixedPriorityListeners",
      value: function getFixedPriorityListeners() {
        return this._fixedListeners;
      }
    }, {
      key: "getSceneGraphPriorityListeners",
      value: function getSceneGraphPriorityListeners() {
        return this._sceneGraphListeners;
      }
    }]);

    return _EventListenerVector;
  }();

  function __getListenerID(event) {
    var eventType = _index.Event;
    var type = event.type;

    if (type === eventType.ACCELERATION) {
      return ListenerID.ACCELERATION;
    }

    if (type === eventType.KEYBOARD) {
      return ListenerID.KEYBOARD;
    }

    if (type.startsWith(eventType.MOUSE)) {
      return ListenerID.MOUSE;
    }

    if (type.startsWith(eventType.TOUCH)) {
      // Touch listener is very special, it contains two kinds of listeners:
      // EventListenerTouchOneByOne and EventListenerTouchAllAtOnce.
      // return UNKNOWN instead.
      (0, _debug.logID)(2000);
    }

    return '';
  } // Priority dirty flag


  var DIRTY_NONE = 0;
  var DIRTY_FIXED_PRIORITY = 1 << 0;
  var DIRTY_SCENE_GRAPH_PRIORITY = 1 << 1;
  var DIRTY_ALL = 3;

  var EventManager = /*#__PURE__*/function () {
    function EventManager() {
      _classCallCheck(this, EventManager);

      this._listenersMap = {};
      this._priorityDirtyFlagMap = {};
      this._nodeListenersMap = {};
      this._toAddedListeners = [];
      this._toRemovedListeners = [];
      this._dirtyListeners = [];
      this._inDispatch = 0;
      this._isEnabled = false;
      this._internalCustomListenerIDs = [];
      this._currentTouch = null;
      this._currentTouchListener = null;
    }

    _createClass(EventManager, [{
      key: "pauseTarget",

      /**
       * @en Pauses all listeners which are associated the specified target.
       * @zh 暂停传入的 node 相关的所有监听器的事件响应。
       * @param node - 暂停目标节点
       * @param recursive - 是否往子节点递归暂停。默认为 false。
       */
      value: function pauseTarget(node) {
        var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!(node instanceof _globalExports.legacyCC._BaseNode)) {
          (0, _debug.warnID)(3506);
          return;
        }

        var listeners = this._nodeListenersMap[node.uuid];

        if (listeners) {
          for (var i = 0; i < listeners.length; ++i) {
            var listener = listeners[i];

            listener._setPaused(true);
          }
        }

        if (recursive === true) {
          var locChildren = node.children;

          if (locChildren) {
            for (var _i = 0; _i < locChildren.length; ++_i) {
              var locChild = locChildren[_i];
              this.pauseTarget(locChild, true);
            }
          }
        }
      }
      /**
       * @en
       * Resumes all listeners which are associated the specified target.
       *
       * @zh
       * 恢复传入的 node 相关的所有监听器的事件响应。
       *
       * @param node - 监听器节点。
       * @param recursive - 是否往子节点递归。默认为 false。
       */

    }, {
      key: "resumeTarget",
      value: function resumeTarget(node) {
        var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!(node instanceof _globalExports.legacyCC._BaseNode)) {
          (0, _debug.warnID)(3506);
          return;
        }

        var listeners = this._nodeListenersMap[node.uuid];

        if (listeners) {
          for (var i = 0; i < listeners.length; ++i) {
            var listener = listeners[i];

            listener._setPaused(false);
          }
        }

        this._setDirtyForNode(node);

        if (recursive === true && node.children.length > 0) {
          var locChildren = node.children;

          if (locChildren) {
            for (var _i2 = 0; _i2 < locChildren.length; ++_i2) {
              var locChild = locChildren[_i2];
              this.resumeTarget(locChild, true);
            }
          }
        }
      }
    }, {
      key: "frameUpdateListeners",
      value: function frameUpdateListeners() {
        var locListenersMap = this._listenersMap;
        var locPriorityDirtyFlagMap = this._priorityDirtyFlagMap;

        for (var selKey in locListenersMap) {
          if (locListenersMap[selKey].empty()) {
            delete locPriorityDirtyFlagMap[selKey];
            delete locListenersMap[selKey];
          }
        }

        var locToAddedListeners = this._toAddedListeners;

        if (locToAddedListeners.length !== 0) {
          for (var i = 0, len = locToAddedListeners.length; i < len; i++) {
            this._forceAddEventListener(locToAddedListeners[i]);
          }

          locToAddedListeners.length = 0;
        }

        if (this._toRemovedListeners.length !== 0) {
          this._cleanToRemovedListeners();
        }
      }
      /**
       * @en
       * Query whether the specified event listener id has been added.
       *
       * @zh
       * 查询指定的事件 ID 是否存在。
       *
       * @param listenerID - 查找监听器 ID。
       * @returns 是否已查找到。
       */

    }, {
      key: "hasEventListener",
      value: function hasEventListener(listenerID) {
        return !!this._getListeners(listenerID);
      }
      /**
       * @en
       * <p>
       * Adds a event listener for a specified event.<br/>
       * if the parameter "nodeOrPriority" is a node,
       * it means to add a event listener for a specified event with the priority of scene graph.<br/>
       * if the parameter "nodeOrPriority" is a Number,
       * it means to add a event listener for a specified event with the fixed priority.<br/>
       * </p>
       *
       * @zh
       * 将事件监听器添加到事件管理器中。<br/>
       * 如果参数 “nodeOrPriority” 是节点，优先级由 node 的渲染顺序决定，显示在上层的节点将优先收到事件。<br/>
       * 如果参数 “nodeOrPriority” 是数字，优先级则固定为该参数的数值，数字越小，优先级越高。<br/>
       *
       * @param listener - 指定事件监听器。
       * @param nodeOrPriority - 监听程序的优先级。
       * @returns
       */

    }, {
      key: "addListener",
      value: function addListener(listener, nodeOrPriority) {
        (0, _debug.assertID)(listener && nodeOrPriority, 3503);

        if (!(_globalExports.legacyCC.js.isNumber(nodeOrPriority) || nodeOrPriority instanceof _globalExports.legacyCC._BaseNode)) {
          (0, _debug.warnID)(3506);
          return;
        }

        if (!(listener instanceof _globalExports.legacyCC.EventListener)) {
          (0, _debug.assertID)(!_globalExports.legacyCC.js.isNumber(nodeOrPriority), 3504);
          listener = _globalExports.legacyCC.EventListener.create(listener);
        } else {
          if (listener._isRegistered()) {
            (0, _debug.logID)(3505);
            return;
          }
        }

        if (!listener.checkAvailable()) {
          return;
        }

        if (_globalExports.legacyCC.js.isNumber(nodeOrPriority)) {
          if (nodeOrPriority === 0) {
            (0, _debug.logID)(3500);
            return;
          }

          listener._setSceneGraphPriority(null);

          listener._setFixedPriority(nodeOrPriority);

          listener._setRegistered(true);

          listener._setPaused(false);

          this._addListener(listener);
        } else {
          if (!checkUINode(nodeOrPriority)) {
            (0, _debug.logID)(3512);
            return;
          }

          listener._setSceneGraphPriority(nodeOrPriority);

          listener._setFixedPriority(0);

          listener._setRegistered(true);

          this._addListener(listener);
        }

        return listener;
      }
      /**
       * @en
       * Adds a Custom event listener. It will use a fixed priority of 1.
       *
       * @zh
       * 向事件管理器添加一个自定义事件监听器。
       *
       * @param eventName - 自定义事件名。
       * @param callback - 事件回调。
       * @returns 返回自定义监听器。
       */

    }, {
      key: "addCustomListener",
      value: function addCustomListener(eventName, callback) {
        var listener = _eventListener.EventListener.create({
          event: _globalExports.legacyCC.EventListener.CUSTOM,
          eventName: eventName,
          callback: callback
        });

        this.addListener(listener, 1);
        return listener;
      }
      /**
       * @en
       * Remove a listener.
       *
       * @zh
       * 移除一个已添加的监听器。
       *
       * @param listener - 需要移除的监听器。
       */

    }, {
      key: "removeListener",
      value: function removeListener(listener) {
        if (listener == null) {
          return;
        }

        var isFound = false;
        var locListener = this._listenersMap;

        for (var selKey in locListener) {
          var listeners = locListener[selKey];
          var fixedPriorityListeners = listeners.getFixedPriorityListeners();
          var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
          isFound = this._removeListenerInVector(sceneGraphPriorityListeners, listener);

          if (isFound) {
            // fixed #4160: Dirty flag need to be updated after listeners were removed.
            this._setDirty(listener._getListenerID(), DIRTY_SCENE_GRAPH_PRIORITY);
          } else {
            isFound = this._removeListenerInVector(fixedPriorityListeners, listener);

            if (isFound) {
              this._setDirty(listener._getListenerID(), DIRTY_FIXED_PRIORITY);
            }
          }

          if (listeners.empty()) {
            delete this._priorityDirtyFlagMap[listener._getListenerID()];
            delete locListener[selKey];
          }

          if (isFound) {
            break;
          }
        }

        if (!isFound) {
          var locToAddedListeners = this._toAddedListeners;

          for (var i = locToAddedListeners.length - 1; i >= 0; i--) {
            var selListener = locToAddedListeners[i];

            if (selListener === listener) {
              _globalExports.legacyCC.js.array.removeAt(locToAddedListeners, i);

              selListener._setRegistered(false);

              break;
            }
          }
        }
      }
      /**
       * @en
       * Removes all listeners with the same event listener type or removes all listeners of a node.
       *
       * @zh
       * 移除注册到 eventManager 中指定类型的所有事件监听器。<br/>
       * 1. 如果传入的第一个参数类型是 Node，那么事件管理器将移除与该对象相关的所有事件监听器。
       * （如果第二参数 recursive 是 true 的话，就会连同该对象的子控件上所有的事件监听器也一并移除）<br/>
       * 2. 如果传入的第一个参数类型是 Number（该类型 EventListener 中定义的事件类型），
       * 那么事件管理器将移除该类型的所有事件监听器。<br/>
       *
       * 下列是目前存在监听器类型：       <br/>
       * `EventListener.UNKNOWN`       <br/>
       * `EventListener.KEYBOARD`      <br/>
       * `EventListener.ACCELERATION`，<br/>
       *
       * @param listenerType - 监听器类型。
       * @param recursive - 递归子节点的同类型监听器一并移除。默认为 false。
       */

    }, {
      key: "removeListeners",
      value: function removeListeners(listenerType) {
        var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!(_globalExports.legacyCC.js.isNumber(listenerType) || listenerType instanceof _globalExports.legacyCC._BaseNode)) {
          (0, _debug.warnID)(3506);
          return;
        }

        if (listenerType._id !== undefined) {
          // Ensure the node is removed from these immediately also.
          // Don't want any dangling pointers or the possibility of dealing with deleted objects..
          var listeners = this._nodeListenersMap[listenerType._id];

          if (listeners) {
            var listenersCopy = _globalExports.legacyCC.js.array.copy(listeners);

            for (var i = 0; i < listenersCopy.length; ++i) {
              var listenerCopy = listenersCopy[i];
              this.removeListener(listenerCopy);
            }

            delete this._nodeListenersMap[listenerType._id];
          } // Bug fix: ensure there are no references to the node in the list of listeners to be added.
          // If we find any listeners associated with the destroyed node in this list then remove them.
          // This is to catch the scenario where the node gets destroyed before it's listener
          // is added into the event dispatcher fully. This could happen if a node registers a listener
          // and gets destroyed while we are dispatching an event (touch etc.)


          var locToAddedListeners = this._toAddedListeners;

          for (var _i3 = 0; _i3 < locToAddedListeners.length;) {
            var listener = locToAddedListeners[_i3];

            if (listener._getSceneGraphPriority() === listenerType) {
              // Ensure no dangling ptr to the target node.
              listener._setSceneGraphPriority(null);

              listener._setRegistered(false);

              locToAddedListeners.splice(_i3, 1);
            } else {
              ++_i3;
            }
          }

          if (recursive === true) {
            var locChildren = listenerType.getChildren();

            for (var _i4 = 0; _i4 < locChildren.length; ++_i4) {
              var locChild = locChildren[_i4];
              this.removeListeners(locChild, true);
            }
          }
        } else {
          if (listenerType === _globalExports.legacyCC.EventListener.TOUCH_ONE_BY_ONE) {
            this._removeListenersForListenerID(ListenerID.TOUCH_ONE_BY_ONE);
          } else if (listenerType === _globalExports.legacyCC.EventListener.TOUCH_ALL_AT_ONCE) {
            this._removeListenersForListenerID(ListenerID.TOUCH_ALL_AT_ONCE);
          } else if (listenerType === _globalExports.legacyCC.EventListener.MOUSE) {
            this._removeListenersForListenerID(ListenerID.MOUSE);
          } else if (listenerType === _globalExports.legacyCC.EventListener.ACCELERATION) {
            this._removeListenersForListenerID(ListenerID.ACCELERATION);
          } else if (listenerType === _globalExports.legacyCC.EventListener.KEYBOARD) {
            this._removeListenersForListenerID(ListenerID.KEYBOARD);
          } else {
            (0, _debug.logID)(3501);
          }
        }
      }
      /**
       * @en
       * Removes all custom listeners with the same event name.
       *
       * @zh
       * 移除同一事件名的自定义事件监听器。
       *
       * @param customEventName - 自定义事件监听器名。
       */

    }, {
      key: "removeCustomListeners",
      value: function removeCustomListeners(customEventName) {
        this._removeListenersForListenerID(customEventName);
      }
      /**
       * @en
       * Removes all listeners.
       *
       * @zh
       * 移除所有事件监听器。
       */

    }, {
      key: "removeAllListeners",
      value: function removeAllListeners() {
        var locListeners = this._listenersMap;
        var locInternalCustomEventIDs = this._internalCustomListenerIDs;

        for (var selKey in locListeners) {
          if (locInternalCustomEventIDs.indexOf(selKey) === -1) {
            this._removeListenersForListenerID(selKey);
          }
        }
      }
      /**
       * @en
       * Sets listener's priority with fixed value.
       *
       * @zh
       * 设置 FixedPriority 类型监听器的优先级。
       *
       * @param listener - 监听器。
       * @param fixedPriority - 优先级。
       */

    }, {
      key: "setPriority",
      value: function setPriority(listener, fixedPriority) {
        if (listener == null) {
          return;
        }

        var locListeners = this._listenersMap;

        for (var selKey in locListeners) {
          var selListeners = locListeners[selKey];
          var fixedPriorityListeners = selListeners.getFixedPriorityListeners();

          if (fixedPriorityListeners) {
            var found = fixedPriorityListeners.indexOf(listener);

            if (found !== -1) {
              if (listener._getSceneGraphPriority() != null) {
                (0, _debug.logID)(3502);
              }

              if (listener._getFixedPriority() !== fixedPriority) {
                listener._setFixedPriority(fixedPriority);

                this._setDirty(listener._getListenerID(), DIRTY_FIXED_PRIORITY);
              }

              return;
            }
          }
        }
      }
      /**
       * @en
       * Whether to enable dispatching events.
       *
       * @zh
       * 启用或禁用事件管理器，禁用后不会分发任何事件。
       *
       * @param enabled - 是否启用事件管理器。
       */

    }, {
      key: "setEnabled",
      value: function setEnabled(enabled) {
        this._isEnabled = enabled;
      }
      /**
       * @en
       * Checks whether dispatching events is enabled.
       *
       * @zh 检测事件管理器是否启用。
       *
       * @returns
       */

    }, {
      key: "isEnabled",
      value: function isEnabled() {
        return this._isEnabled;
      }
      /**
       * @en
       * Dispatches the event, also removes all EventListeners marked for deletion from the event dispatcher list.
       *
       * @zh
       * 分发事件。
       *
       * @param event - 分发事件。
       */

    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        if (!this._isEnabled) {
          return;
        }

        this._updateDirtyFlagForSceneGraph();

        this._inDispatch++;

        if (!event || !event.getType) {
          (0, _debug.errorID)(3511);
          return;
        }

        if (event.getType().startsWith(_globalExports.legacyCC.Event.TOUCH)) {
          this._dispatchTouchEvent(event);

          this._inDispatch--;
          return;
        }

        var listenerID = __getListenerID(event);

        this._sortEventListeners(listenerID);

        var selListeners = this._listenersMap[listenerID];

        if (selListeners != null) {
          this._dispatchEventToListeners(selListeners, this._onListenerCallback, event);

          this._onUpdateListeners(selListeners);
        }

        this._inDispatch--;
      }
    }, {
      key: "_onListenerCallback",
      value: function _onListenerCallback(listener, event) {
        event.currentTarget = listener._target;
        var onEvent = listener.onEvent;

        if (onEvent) {
          onEvent(event);
        }

        return event.isStopped();
      }
      /**
       * @en
       * Dispatches a Custom Event with a event name an optional user data.
       *
       * @zh
       * 分发自定义事件。
       *
       * @param eventName - 自定义事件名。
       * @param optionalUserData
       */

    }, {
      key: "dispatchCustomEvent",
      value: function dispatchCustomEvent(eventName, optionalUserData) {
        var ev = new _globalExports.legacyCC.Event.EventCustom(eventName);
        ev.setUserData(optionalUserData);
        this.dispatchEvent(ev);
      }
    }, {
      key: "_setDirtyForNode",
      value: function _setDirtyForNode(node) {
        // Mark the node dirty only when there is an event listener associated with it.
        // @ts-ignore
        var selListeners = this._nodeListenersMap[node._id];

        if (selListeners !== undefined) {
          for (var j = 0, len = selListeners.length; j < len; j++) {
            var selListener = selListeners[j];

            var listenerID = selListener._getListenerID();

            if (this._dirtyListeners[listenerID] == null) {
              this._dirtyListeners[listenerID] = true;
            }
          }
        }

        if (node.children.length > 0) {
          var _children = node.children;

          for (var i = 0, _len = _children ? _children.length : 0; i < _len; i++) {
            this._setDirtyForNode(_children[i]);
          }
        }
      }
    }, {
      key: "_addListener",
      value: function _addListener(listener) {
        if (this._inDispatch === 0) {
          this._forceAddEventListener(listener);
        } else {
          this._toAddedListeners.push(listener);
        }
      }
    }, {
      key: "_forceAddEventListener",
      value: function _forceAddEventListener(listener) {
        var listenerID = listener._getListenerID();

        var listeners = this._listenersMap[listenerID];

        if (!listeners) {
          listeners = new _EventListenerVector();
          this._listenersMap[listenerID] = listeners;
        }

        listeners.push(listener);

        if (listener._getFixedPriority() === 0) {
          this._setDirty(listenerID, DIRTY_SCENE_GRAPH_PRIORITY);

          var node = listener._getSceneGraphPriority();

          if (node === null) {
            (0, _debug.logID)(3507);
          }

          this._associateNodeAndEventListener(node, listener);

          if (node.activeInHierarchy) {
            this.resumeTarget(node);
          }
        } else {
          this._setDirty(listenerID, DIRTY_FIXED_PRIORITY);
        }
      }
    }, {
      key: "_getListeners",
      value: function _getListeners(listenerID) {
        return this._listenersMap[listenerID];
      }
    }, {
      key: "_updateDirtyFlagForSceneGraph",
      value: function _updateDirtyFlagForSceneGraph() {
        var locDirtyListeners = this._dirtyListeners; // tslint:disable-next-line: forin

        for (var selKey in locDirtyListeners) {
          this._setDirty(selKey, DIRTY_SCENE_GRAPH_PRIORITY);
        }

        this._dirtyListeners.length = 0;
      }
    }, {
      key: "_removeAllListenersInVector",
      value: function _removeAllListenersInVector(listenerVector) {
        if (!listenerVector) {
          return;
        }

        var selListener;

        for (var i = listenerVector.length - 1; i >= 0; i--) {
          selListener = listenerVector[i];

          selListener._setRegistered(false);

          if (selListener._getSceneGraphPriority() != null) {
            this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);

            selListener._setSceneGraphPriority(null); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.

          }

          if (this._inDispatch === 0) {
            _globalExports.legacyCC.js.array.removeAt(listenerVector, i);
          }
        }
      }
    }, {
      key: "_removeListenersForListenerID",
      value: function _removeListenersForListenerID(listenerID) {
        var listeners = this._listenersMap[listenerID];

        if (listeners) {
          var fixedPriorityListeners = listeners.getFixedPriorityListeners();
          var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

          this._removeAllListenersInVector(sceneGraphPriorityListeners);

          this._removeAllListenersInVector(fixedPriorityListeners); // Remove the dirty flag according the 'listenerID'.
          // No need to check whether the dispatcher is dispatching event.


          delete this._priorityDirtyFlagMap[listenerID];

          if (!this._inDispatch) {
            listeners.clear();
            delete this._listenersMap[listenerID];
          }
        }

        var locToAddedListeners = this._toAddedListeners;

        for (var i = locToAddedListeners.length - 1; i >= 0; i--) {
          var listener = locToAddedListeners[i];

          if (listener && listener._getListenerID() === listenerID) {
            _globalExports.legacyCC.js.array.removeAt(locToAddedListeners, i);
          }
        }
      }
    }, {
      key: "_sortEventListeners",
      value: function _sortEventListeners(listenerID) {
        var dirtyFlag = DIRTY_NONE;
        var locFlagMap = this._priorityDirtyFlagMap;

        if (locFlagMap[listenerID]) {
          dirtyFlag = locFlagMap[listenerID];
        }

        if (dirtyFlag !== DIRTY_NONE) {
          // Clear the dirty flag first, if `rootNode` is null, then set its dirty flag of scene graph priority
          locFlagMap[listenerID] = DIRTY_NONE;

          if (dirtyFlag & DIRTY_FIXED_PRIORITY) {
            this._sortListenersOfFixedPriority(listenerID);
          }

          if (dirtyFlag & DIRTY_SCENE_GRAPH_PRIORITY) {
            var rootEntity = _globalExports.legacyCC.director.getScene();

            if (rootEntity) {
              this._sortListenersOfSceneGraphPriority(listenerID);
            }
          }
        }
      }
    }, {
      key: "_sortListenersOfSceneGraphPriority",
      value: function _sortListenersOfSceneGraphPriority(listenerID) {
        var listeners = this._getListeners(listenerID);

        if (!listeners) {
          return;
        }

        var sceneGraphListener = listeners.getSceneGraphPriorityListeners();

        if (!sceneGraphListener || sceneGraphListener.length === 0) {
          return;
        } // After sort: priority < 0, > 0


        listeners.getSceneGraphPriorityListeners().sort(this._sortEventListenersOfSceneGraphPriorityDes);
      }
    }, {
      key: "_sortEventListenersOfSceneGraphPriorityDes",
      value: function _sortEventListenersOfSceneGraphPriorityDes(l1, l2) {
        var node1 = l1._getSceneGraphPriority();

        var node2 = l2._getSceneGraphPriority(); // Event manager should only care about ui node in the current scene hierarchy


        if (!l2 || !node2 || !node2._activeInHierarchy || !node2._uiProps.uiTransformComp) {
          return -1;
        } else if (!l1 || !node1 || !node1._activeInHierarchy || !node1._uiProps.uiTransformComp) {
          return 1;
        }

        var p1 = node1,
            p2 = node2,
            ex = false;
        var trans1 = node1._uiProps.uiTransformComp;
        var trans2 = node2._uiProps.uiTransformComp;

        if (trans1.visibility !== trans2.visibility) {
          return trans2.visibility - trans1.visibility;
        }

        while (p1.parent._id !== p2.parent._id) {
          p1 = p1.parent.parent === null ? (ex = true) && node2 : p1.parent;
          p2 = p2.parent.parent === null ? (ex = true) && node1 : p2.parent;
        }

        if (p1._id === p2._id) {
          if (p1._id === node2._id) {
            return -1;
          }

          if (p1._id === node1._id) {
            return 1;
          }
        }

        var priority1 = p1.getSiblingIndex();
        var priority2 = p2.getSiblingIndex();
        return ex ? priority1 - priority2 : priority2 - priority1;
      }
    }, {
      key: "_sortListenersOfFixedPriority",
      value: function _sortListenersOfFixedPriority(listenerID) {
        var listeners = this._listenersMap[listenerID];

        if (!listeners) {
          return;
        }

        var fixedListeners = listeners.getFixedPriorityListeners();

        if (!fixedListeners || fixedListeners.length === 0) {
          return;
        } // After sort: priority < 0, > 0


        fixedListeners.sort(this._sortListenersOfFixedPriorityAsc); // FIXME: Should use binary search

        var index = 0;

        for (var len = fixedListeners.length; index < len;) {
          if (fixedListeners[index]._getFixedPriority() >= 0) {
            break;
          }

          ++index;
        }

        listeners.gt0Index = index;
      }
    }, {
      key: "_sortListenersOfFixedPriorityAsc",
      value: function _sortListenersOfFixedPriorityAsc(l1, l2) {
        return l1._getFixedPriority() - l2._getFixedPriority();
      }
    }, {
      key: "_onUpdateListeners",
      value: function _onUpdateListeners(listeners) {
        var fixedPriorityListeners = listeners.getFixedPriorityListeners();
        var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
        var toRemovedListeners = this._toRemovedListeners;

        if (sceneGraphPriorityListeners) {
          for (var i = sceneGraphPriorityListeners.length - 1; i >= 0; i--) {
            var selListener = sceneGraphPriorityListeners[i];

            if (!selListener._isRegistered()) {
              _globalExports.legacyCC.js.array.removeAt(sceneGraphPriorityListeners, i); // if item in toRemove list, remove it from the list


              var idx = toRemovedListeners.indexOf(selListener);

              if (idx !== -1) {
                toRemovedListeners.splice(idx, 1);
              }
            }
          }
        }

        if (fixedPriorityListeners) {
          for (var _i5 = fixedPriorityListeners.length - 1; _i5 >= 0; _i5--) {
            var _selListener = fixedPriorityListeners[_i5];

            if (!_selListener._isRegistered()) {
              _globalExports.legacyCC.js.array.removeAt(fixedPriorityListeners, _i5); // if item in toRemove list, remove it from the list


              var _idx = toRemovedListeners.indexOf(_selListener);

              if (_idx !== -1) {
                toRemovedListeners.splice(_idx, 1);
              }
            }
          }
        }

        if (sceneGraphPriorityListeners && sceneGraphPriorityListeners.length === 0) {
          listeners.clearSceneGraphListeners();
        }

        if (fixedPriorityListeners && fixedPriorityListeners.length === 0) {
          listeners.clearFixedListeners();
        }
      }
    }, {
      key: "_updateTouchListeners",
      value: function _updateTouchListeners(event) {
        var locInDispatch = this._inDispatch;
        (0, _debug.assertID)(locInDispatch > 0, 3508);

        if (locInDispatch > 1) {
          return;
        }

        var listeners;
        listeners = this._listenersMap[ListenerID.TOUCH_ONE_BY_ONE];

        if (listeners) {
          this._onUpdateListeners(listeners);
        }

        listeners = this._listenersMap[ListenerID.TOUCH_ALL_AT_ONCE];

        if (listeners) {
          this._onUpdateListeners(listeners);
        }

        (0, _debug.assertID)(locInDispatch === 1, 3509);
        var locToAddedListeners = this._toAddedListeners;

        if (locToAddedListeners.length !== 0) {
          for (var i = 0, len = locToAddedListeners.length; i < len; i++) {
            this._forceAddEventListener(locToAddedListeners[i]);
          }

          this._toAddedListeners.length = 0;
        }

        if (this._toRemovedListeners.length !== 0) {
          this._cleanToRemovedListeners();
        }
      } // Remove all listeners in _toRemoveListeners list and cleanup

    }, {
      key: "_cleanToRemovedListeners",
      value: function _cleanToRemovedListeners() {
        var toRemovedListeners = this._toRemovedListeners;

        for (var i = 0; i < toRemovedListeners.length; ++i) {
          var selListener = toRemovedListeners[i];

          var listeners = this._listenersMap[selListener._getListenerID()];

          if (!listeners) {
            continue;
          }

          var fixedPriorityListeners = listeners.getFixedPriorityListeners();
          var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

          if (sceneGraphPriorityListeners) {
            var idx = sceneGraphPriorityListeners.indexOf(selListener);

            if (idx !== -1) {
              sceneGraphPriorityListeners.splice(idx, 1);
            }
          }

          if (fixedPriorityListeners) {
            var _idx2 = fixedPriorityListeners.indexOf(selListener);

            if (_idx2 !== -1) {
              fixedPriorityListeners.splice(_idx2, 1);
            }
          }
        }

        toRemovedListeners.length = 0;
      }
    }, {
      key: "_onTouchEventCallback",
      value: function _onTouchEventCallback(listener, argsObj) {
        // Skip if the listener was removed.
        if (!listener._isRegistered()) {
          return false;
        }

        var event = argsObj.event;
        var selTouch = event.touch;
        event.currentTarget = listener._getSceneGraphPriority();
        var isClaimed = false;
        var removedIdx = -1;
        var getCode = event.getEventCode(); // const EventTouch = cc.Event.EventTouch;

        if (getCode === _events.EventTouch.BEGAN) {
          if (!_macro.macro.ENABLE_MULTI_TOUCH && eventManager._currentTouch) {
            var node = eventManager._currentTouchListener._node;

            if (!node || node.activeInHierarchy) {
              return false;
            }
          }

          if (listener.onTouchBegan) {
            isClaimed = listener.onTouchBegan(selTouch, event);

            if (isClaimed && listener._isRegistered()) {
              listener._claimedTouches.push(selTouch);

              if (_macro.macro.ENABLE_MULTI_TOUCH || !eventManager._currentTouch) {
                eventManager._currentTouch = selTouch;
              }

              eventManager._currentTouchListener = listener;
            }
          }
        } else if (listener._claimedTouches.length > 0) {
          removedIdx = listener._claimedTouches.indexOf(selTouch);

          if (removedIdx !== -1) {
            isClaimed = true;

            if (!_macro.macro.ENABLE_MULTI_TOUCH && eventManager._currentTouch && eventManager._currentTouch !== selTouch) {
              return false;
            }

            if (getCode === _events.EventTouch.MOVED && listener.onTouchMoved) {
              listener.onTouchMoved(selTouch, event);
            } else if (getCode === _events.EventTouch.ENDED) {
              if (listener.onTouchEnded) {
                listener.onTouchEnded(selTouch, event);
              }

              if (listener._isRegistered()) {
                listener._claimedTouches.splice(removedIdx, 1);
              }

              if (_macro.macro.ENABLE_MULTI_TOUCH || eventManager._currentTouch === selTouch) {
                eventManager._currentTouch = null;
              }

              eventManager._currentTouchListener = null;
            } else if (getCode === _events.EventTouch.CANCELLED) {
              if (listener.onTouchCancelled) {
                listener.onTouchCancelled(selTouch, event);
              }

              if (listener._isRegistered()) {
                listener._claimedTouches.splice(removedIdx, 1);
              }

              if (_macro.macro.ENABLE_MULTI_TOUCH || eventManager._currentTouch === selTouch) {
                eventManager._currentTouch = null;
              }

              eventManager._currentTouchListener = null;
            }
          }
        } // If the event was stopped, return directly.


        if (event.isStopped()) {
          eventManager._updateTouchListeners(event);

          return true;
        }

        if (isClaimed && listener._isRegistered() && listener.swallowTouches) {
          if (argsObj.needsMutableSet) {
            argsObj.touches.splice(selTouch, 1);
          }

          return true;
        }

        return false;
      }
    }, {
      key: "_dispatchTouchEvent",
      value: function _dispatchTouchEvent(event) {
        this._sortEventListeners(ListenerID.TOUCH_ONE_BY_ONE);

        this._sortEventListeners(ListenerID.TOUCH_ALL_AT_ONCE);

        var oneByOneListeners = this._getListeners(ListenerID.TOUCH_ONE_BY_ONE);

        var allAtOnceListeners = this._getListeners(ListenerID.TOUCH_ALL_AT_ONCE); // If there aren't any touch listeners, return directly.


        if (null === oneByOneListeners && null === allAtOnceListeners) {
          return;
        }

        var originalTouches = event.getTouches();

        var mutableTouches = _globalExports.legacyCC.js.array.copy(originalTouches);

        var oneByOneArgsObj = {
          event: event,
          needsMutableSet: oneByOneListeners && allAtOnceListeners,
          touches: mutableTouches,
          selTouch: null
        }; //
        // process the target handlers 1st
        //

        if (oneByOneListeners) {
          for (var i = 0; i < originalTouches.length; ++i) {
            var originalTouch = originalTouches[i];
            event.touch = originalTouch;
            event.propagationStopped = event.propagationImmediateStopped = false;

            this._dispatchEventToListeners(oneByOneListeners, this._onTouchEventCallback, oneByOneArgsObj);
          }
        } //
        // process standard handlers 2nd
        //


        if (allAtOnceListeners && mutableTouches.length > 0) {
          this._dispatchEventToListeners(allAtOnceListeners, this._onTouchesEventCallback, {
            event: event,
            touches: mutableTouches
          });

          if (event.isStopped()) {
            return;
          }
        }

        this._updateTouchListeners(event);
      }
    }, {
      key: "_onTouchesEventCallback",
      value: function _onTouchesEventCallback(listener, callbackParams) {
        // Skip if the listener was removed.
        if (!listener._isRegistered()) {
          return false;
        } // const EventTouch = cc.Event.EventTouch;


        var event = callbackParams.event;
        var touches = callbackParams.touches;
        var getCode = event.getEventCode();
        event.currentTarget = listener._getSceneGraphPriority();

        if (getCode === _events.EventTouch.BEGAN && listener.onTouchesBegan) {
          listener.onTouchesBegan(touches, event);
        } else if (getCode === _events.EventTouch.MOVED && listener.onTouchesMoved) {
          listener.onTouchesMoved(touches, event);
        } else if (getCode === _events.EventTouch.ENDED && listener.onTouchesEnded) {
          listener.onTouchesEnded(touches, event);
        } else if (getCode === _events.EventTouch.CANCELLED && listener.onTouchesCancelled) {
          listener.onTouchesCancelled(touches, event);
        } // If the event was stopped, return directly.


        if (event.isStopped()) {
          eventManager._updateTouchListeners(event);

          return true;
        }

        return false;
      }
    }, {
      key: "_associateNodeAndEventListener",
      value: function _associateNodeAndEventListener(node, listener) {
        var listeners = this._nodeListenersMap[node.uuid];

        if (!listeners) {
          listeners = [];
          this._nodeListenersMap[node.uuid] = listeners;
        }

        listeners.push(listener);
      }
    }, {
      key: "_dissociateNodeAndEventListener",
      value: function _dissociateNodeAndEventListener(node, listener) {
        var listeners = this._nodeListenersMap[node.uuid];

        if (listeners) {
          _globalExports.legacyCC.js.array.remove(listeners, listener);

          if (listeners.length === 0) {
            delete this._nodeListenersMap[node.uuid];
          }
        }
      }
    }, {
      key: "_dispatchEventToListeners",
      value: function _dispatchEventToListeners(listeners, onEvent, eventOrArgs) {
        var shouldStopPropagation = false;
        var fixedPriorityListeners = listeners.getFixedPriorityListeners();
        var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
        var i = 0;

        if (fixedPriorityListeners) {
          // priority < 0
          if (fixedPriorityListeners.length !== 0) {
            for (; i < listeners.gt0Index; ++i) {
              var selListener = fixedPriorityListeners[i];

              if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
                shouldStopPropagation = true;
                break;
              }
            }
          }
        }

        if (sceneGraphPriorityListeners && !shouldStopPropagation) {
          // priority == 0, scene graph priority
          for (var _i6 = 0; _i6 < sceneGraphPriorityListeners.length; ++_i6) {
            var _selListener2 = sceneGraphPriorityListeners[_i6];

            if (_selListener2.isEnabled() && !_selListener2._isPaused() && _selListener2._isRegistered() && onEvent(_selListener2, eventOrArgs)) {
              shouldStopPropagation = true;
              break;
            }
          }
        }

        if (fixedPriorityListeners && !shouldStopPropagation) {
          // priority > 0
          for (; i < fixedPriorityListeners.length; ++i) {
            var _selListener3 = fixedPriorityListeners[i];

            if (_selListener3.isEnabled() && !_selListener3._isPaused() && _selListener3._isRegistered() && onEvent(_selListener3, eventOrArgs)) {
              shouldStopPropagation = true;
              break;
            }
          }
        }
      }
    }, {
      key: "_setDirty",
      value: function _setDirty(listenerID, flag) {
        var locDirtyFlagMap = this._priorityDirtyFlagMap;

        if (locDirtyFlagMap[listenerID] == null) {
          locDirtyFlagMap[listenerID] = flag;
        } else {
          locDirtyFlagMap[listenerID] = flag | locDirtyFlagMap[listenerID];
        }
      }
    }, {
      key: "_sortNumberAsc",
      value: function _sortNumberAsc(a, b) {
        return a - b;
      }
    }, {
      key: "_removeListenerInCallback",
      value: function _removeListenerInCallback(listeners, callback) {
        if (listeners == null) {
          return false;
        }

        for (var i = listeners.length - 1; i >= 0; i--) {
          var selListener = listeners[i]; // @ts-ignore

          if (selListener._onCustomEvent === callback || selListener.onEvent === callback) {
            selListener._setRegistered(false);

            if (selListener._getSceneGraphPriority() != null) {
              this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.


              selListener._setSceneGraphPriority(null);
            }

            if (this._inDispatch === 0) {
              _globalExports.legacyCC.js.array.removeAt(listeners, i);
            } else {
              this._toRemovedListeners.push(selListener);
            }

            return true;
          }
        }

        return false;
      }
    }, {
      key: "_removeListenerInVector",
      value: function _removeListenerInVector(listeners, listener) {
        if (listeners == null) {
          return false;
        }

        for (var i = listeners.length - 1; i >= 0; i--) {
          var selListener = listeners[i];

          if (selListener === listener) {
            selListener._setRegistered(false);

            if (selListener._getSceneGraphPriority() != null) {
              this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.


              selListener._setSceneGraphPriority(null);
            }

            if (this._inDispatch === 0) {
              _globalExports.legacyCC.js.array.removeAt(listeners, i);
            } else {
              this._toRemovedListeners.push(selListener);
            }

            return true;
          }
        }

        return false;
      }
    }]);

    return EventManager;
  }();
  /**
   * @en
   * This class has been deprecated, please use `systemEvent` or `EventTarget` instead.
   * See [Listen to and launch events](../../../manual/en/scripting/events.md) for details.<br>
   * <br>
   * `eventManager` is a singleton object which manages event listener subscriptions and event dispatching.
   * The EventListener list is managed in such way so that event listeners can be added and removed
   * while events are being dispatched.
   *
   * @zh
   * 该类已废弃，请使用 `systemEvent` 或 `EventTarget` 代替，详见 [监听和发射事件](../../../manual/zh/scripting/events.md)。<br>
   * <br>
   * 事件管理器，它主要管理事件监听器注册和派发系统事件。
   *
   * @class eventManager
   * @static
   * @example {@link cocos/core/event-manager/CCEventManager/addListener.js}
   * @deprecated
   */


  var eventManager = new EventManager();
  _exports.eventManager = eventManager;
  _globalExports.legacyCC.eventManager = eventManager;
  var _default = eventManager;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9ldmVudC1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbIkxpc3RlbmVySUQiLCJFdmVudExpc3RlbmVyIiwiY2hlY2tVSU5vZGUiLCJub2RlIiwiZ2V0Q29tcG9uZW50IiwiX0V2ZW50TGlzdGVuZXJWZWN0b3IiLCJndDBJbmRleCIsIl9maXhlZExpc3RlbmVycyIsIl9zY2VuZUdyYXBoTGlzdGVuZXJzIiwibGVuZ3RoIiwibGlzdGVuZXIiLCJfZ2V0Rml4ZWRQcmlvcml0eSIsInB1c2giLCJfX2dldExpc3RlbmVySUQiLCJldmVudCIsImV2ZW50VHlwZSIsIkV2ZW50IiwidHlwZSIsIkFDQ0VMRVJBVElPTiIsIktFWUJPQVJEIiwic3RhcnRzV2l0aCIsIk1PVVNFIiwiVE9VQ0giLCJESVJUWV9OT05FIiwiRElSVFlfRklYRURfUFJJT1JJVFkiLCJESVJUWV9TQ0VORV9HUkFQSF9QUklPUklUWSIsIkRJUlRZX0FMTCIsIkV2ZW50TWFuYWdlciIsIl9saXN0ZW5lcnNNYXAiLCJfcHJpb3JpdHlEaXJ0eUZsYWdNYXAiLCJfbm9kZUxpc3RlbmVyc01hcCIsIl90b0FkZGVkTGlzdGVuZXJzIiwiX3RvUmVtb3ZlZExpc3RlbmVycyIsIl9kaXJ0eUxpc3RlbmVycyIsIl9pbkRpc3BhdGNoIiwiX2lzRW5hYmxlZCIsIl9pbnRlcm5hbEN1c3RvbUxpc3RlbmVySURzIiwiX2N1cnJlbnRUb3VjaCIsIl9jdXJyZW50VG91Y2hMaXN0ZW5lciIsInJlY3Vyc2l2ZSIsImxlZ2FjeUNDIiwiX0Jhc2VOb2RlIiwibGlzdGVuZXJzIiwidXVpZCIsImkiLCJfc2V0UGF1c2VkIiwibG9jQ2hpbGRyZW4iLCJjaGlsZHJlbiIsImxvY0NoaWxkIiwicGF1c2VUYXJnZXQiLCJfc2V0RGlydHlGb3JOb2RlIiwicmVzdW1lVGFyZ2V0IiwibG9jTGlzdGVuZXJzTWFwIiwibG9jUHJpb3JpdHlEaXJ0eUZsYWdNYXAiLCJzZWxLZXkiLCJlbXB0eSIsImxvY1RvQWRkZWRMaXN0ZW5lcnMiLCJsZW4iLCJfZm9yY2VBZGRFdmVudExpc3RlbmVyIiwiX2NsZWFuVG9SZW1vdmVkTGlzdGVuZXJzIiwibGlzdGVuZXJJRCIsIl9nZXRMaXN0ZW5lcnMiLCJub2RlT3JQcmlvcml0eSIsImpzIiwiaXNOdW1iZXIiLCJjcmVhdGUiLCJfaXNSZWdpc3RlcmVkIiwiY2hlY2tBdmFpbGFibGUiLCJfc2V0U2NlbmVHcmFwaFByaW9yaXR5IiwiX3NldEZpeGVkUHJpb3JpdHkiLCJfc2V0UmVnaXN0ZXJlZCIsIl9hZGRMaXN0ZW5lciIsImV2ZW50TmFtZSIsImNhbGxiYWNrIiwiQ1VTVE9NIiwiYWRkTGlzdGVuZXIiLCJpc0ZvdW5kIiwibG9jTGlzdGVuZXIiLCJmaXhlZFByaW9yaXR5TGlzdGVuZXJzIiwiZ2V0Rml4ZWRQcmlvcml0eUxpc3RlbmVycyIsInNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyIsImdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyIsIl9yZW1vdmVMaXN0ZW5lckluVmVjdG9yIiwiX3NldERpcnR5IiwiX2dldExpc3RlbmVySUQiLCJzZWxMaXN0ZW5lciIsImFycmF5IiwicmVtb3ZlQXQiLCJsaXN0ZW5lclR5cGUiLCJfaWQiLCJ1bmRlZmluZWQiLCJsaXN0ZW5lcnNDb3B5IiwiY29weSIsImxpc3RlbmVyQ29weSIsInJlbW92ZUxpc3RlbmVyIiwiX2dldFNjZW5lR3JhcGhQcmlvcml0eSIsInNwbGljZSIsImdldENoaWxkcmVuIiwicmVtb3ZlTGlzdGVuZXJzIiwiVE9VQ0hfT05FX0JZX09ORSIsIl9yZW1vdmVMaXN0ZW5lcnNGb3JMaXN0ZW5lcklEIiwiVE9VQ0hfQUxMX0FUX09OQ0UiLCJjdXN0b21FdmVudE5hbWUiLCJsb2NMaXN0ZW5lcnMiLCJsb2NJbnRlcm5hbEN1c3RvbUV2ZW50SURzIiwiaW5kZXhPZiIsImZpeGVkUHJpb3JpdHkiLCJzZWxMaXN0ZW5lcnMiLCJmb3VuZCIsImVuYWJsZWQiLCJfdXBkYXRlRGlydHlGbGFnRm9yU2NlbmVHcmFwaCIsImdldFR5cGUiLCJfZGlzcGF0Y2hUb3VjaEV2ZW50IiwiX3NvcnRFdmVudExpc3RlbmVycyIsIl9kaXNwYXRjaEV2ZW50VG9MaXN0ZW5lcnMiLCJfb25MaXN0ZW5lckNhbGxiYWNrIiwiX29uVXBkYXRlTGlzdGVuZXJzIiwiY3VycmVudFRhcmdldCIsIl90YXJnZXQiLCJvbkV2ZW50IiwiaXNTdG9wcGVkIiwib3B0aW9uYWxVc2VyRGF0YSIsImV2IiwiRXZlbnRDdXN0b20iLCJzZXRVc2VyRGF0YSIsImRpc3BhdGNoRXZlbnQiLCJqIiwiX2NoaWxkcmVuIiwiX2Fzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyIiwiYWN0aXZlSW5IaWVyYXJjaHkiLCJsb2NEaXJ0eUxpc3RlbmVycyIsImxpc3RlbmVyVmVjdG9yIiwiX2Rpc3NvY2lhdGVOb2RlQW5kRXZlbnRMaXN0ZW5lciIsIl9yZW1vdmVBbGxMaXN0ZW5lcnNJblZlY3RvciIsImNsZWFyIiwiZGlydHlGbGFnIiwibG9jRmxhZ01hcCIsIl9zb3J0TGlzdGVuZXJzT2ZGaXhlZFByaW9yaXR5Iiwicm9vdEVudGl0eSIsImRpcmVjdG9yIiwiZ2V0U2NlbmUiLCJfc29ydExpc3RlbmVyc09mU2NlbmVHcmFwaFByaW9yaXR5Iiwic2NlbmVHcmFwaExpc3RlbmVyIiwic29ydCIsIl9zb3J0RXZlbnRMaXN0ZW5lcnNPZlNjZW5lR3JhcGhQcmlvcml0eURlcyIsImwxIiwibDIiLCJub2RlMSIsIm5vZGUyIiwiX2FjdGl2ZUluSGllcmFyY2h5IiwiX3VpUHJvcHMiLCJ1aVRyYW5zZm9ybUNvbXAiLCJwMSIsInAyIiwiZXgiLCJ0cmFuczEiLCJ0cmFuczIiLCJ2aXNpYmlsaXR5IiwicGFyZW50IiwicHJpb3JpdHkxIiwiZ2V0U2libGluZ0luZGV4IiwicHJpb3JpdHkyIiwiZml4ZWRMaXN0ZW5lcnMiLCJfc29ydExpc3RlbmVyc09mRml4ZWRQcmlvcml0eUFzYyIsImluZGV4IiwidG9SZW1vdmVkTGlzdGVuZXJzIiwiaWR4IiwiY2xlYXJTY2VuZUdyYXBoTGlzdGVuZXJzIiwiY2xlYXJGaXhlZExpc3RlbmVycyIsImxvY0luRGlzcGF0Y2giLCJhcmdzT2JqIiwic2VsVG91Y2giLCJ0b3VjaCIsImlzQ2xhaW1lZCIsInJlbW92ZWRJZHgiLCJnZXRDb2RlIiwiZ2V0RXZlbnRDb2RlIiwiRXZlbnRUb3VjaCIsIkJFR0FOIiwibWFjcm8iLCJFTkFCTEVfTVVMVElfVE9VQ0giLCJldmVudE1hbmFnZXIiLCJfbm9kZSIsIm9uVG91Y2hCZWdhbiIsIl9jbGFpbWVkVG91Y2hlcyIsIk1PVkVEIiwib25Ub3VjaE1vdmVkIiwiRU5ERUQiLCJvblRvdWNoRW5kZWQiLCJDQU5DRUxMRUQiLCJvblRvdWNoQ2FuY2VsbGVkIiwiX3VwZGF0ZVRvdWNoTGlzdGVuZXJzIiwic3dhbGxvd1RvdWNoZXMiLCJuZWVkc011dGFibGVTZXQiLCJ0b3VjaGVzIiwib25lQnlPbmVMaXN0ZW5lcnMiLCJhbGxBdE9uY2VMaXN0ZW5lcnMiLCJvcmlnaW5hbFRvdWNoZXMiLCJnZXRUb3VjaGVzIiwibXV0YWJsZVRvdWNoZXMiLCJvbmVCeU9uZUFyZ3NPYmoiLCJvcmlnaW5hbFRvdWNoIiwicHJvcGFnYXRpb25TdG9wcGVkIiwicHJvcGFnYXRpb25JbW1lZGlhdGVTdG9wcGVkIiwiX29uVG91Y2hFdmVudENhbGxiYWNrIiwiX29uVG91Y2hlc0V2ZW50Q2FsbGJhY2siLCJjYWxsYmFja1BhcmFtcyIsIm9uVG91Y2hlc0JlZ2FuIiwib25Ub3VjaGVzTW92ZWQiLCJvblRvdWNoZXNFbmRlZCIsIm9uVG91Y2hlc0NhbmNlbGxlZCIsInJlbW92ZSIsImV2ZW50T3JBcmdzIiwic2hvdWxkU3RvcFByb3BhZ2F0aW9uIiwiaXNFbmFibGVkIiwiX2lzUGF1c2VkIiwiZmxhZyIsImxvY0RpcnR5RmxhZ01hcCIsImEiLCJiIiwiX29uQ3VzdG9tRXZlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUNB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QUFDRCxtQkFBTyxJQUFQO0FBQ0g7QUFDSjs7QUFDRCxlQUFPLEtBQVA7QUFDSDs7Ozs7QUFHTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJPLE1BQU1nRyxZQUFZLEdBQUcsSUFBSTFKLFlBQUosRUFBckI7O0FBRVBhLDBCQUFTNkksWUFBVCxHQUF3QkEsWUFBeEI7aUJBRWVBLFkiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbi8vIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aFxyXG5cclxuaW1wb3J0IHsgRXZlbnQgfSBmcm9tICcuLi8uLi9ldmVudCc7XHJcbmltcG9ydCB7IEV2ZW50VG91Y2ggfSBmcm9tICcuL2V2ZW50cyc7XHJcbmltcG9ydCB7IEV2ZW50TGlzdGVuZXIsIFRvdWNoT25lQnlPbmUgfSBmcm9tICcuL2V2ZW50LWxpc3RlbmVyJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoJztcclxuaW1wb3J0IHsgbWFjcm8gfSBmcm9tICcuLi9tYWNybyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBlcnJvcklELCB3YXJuSUQsIGxvZ0lELCBhc3NlcnRJRCB9IGZyb20gJy4uLy4uL3BsYXRmb3JtL2RlYnVnJztcclxuY29uc3QgTGlzdGVuZXJJRCA9IEV2ZW50TGlzdGVuZXIuTGlzdGVuZXJJRDtcclxuXHJcbmZ1bmN0aW9uIGNoZWNrVUlOb2RlIChub2RlKSB7XHJcbiAgICBpZihub2RlICYmIG5vZGUuZ2V0Q29tcG9uZW50KCdjYy5VSVRyYW5zZm9ybScpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogY2xhc3MtbmFtZVxyXG5jbGFzcyBfRXZlbnRMaXN0ZW5lclZlY3RvciB7XHJcbiAgICBwdWJsaWMgZ3QwSW5kZXggPSAwO1xyXG4gICAgcHJpdmF0ZSBfZml4ZWRMaXN0ZW5lcnM6IEV2ZW50TGlzdGVuZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfc2NlbmVHcmFwaExpc3RlbmVyczogRXZlbnRMaXN0ZW5lcltdID0gW107XHJcblxyXG4gICAgcHVibGljIHNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9maXhlZExpc3RlbmVycy5sZW5ndGggKyB0aGlzLl9zY2VuZUdyYXBoTGlzdGVuZXJzLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW1wdHkgKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fZml4ZWRMaXN0ZW5lcnMubGVuZ3RoID09PSAwKSAmJiAodGhpcy5fc2NlbmVHcmFwaExpc3RlbmVycy5sZW5ndGggPT09IDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwdXNoIChsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgIGlmIChsaXN0ZW5lci5fZ2V0Rml4ZWRQcmlvcml0eSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NjZW5lR3JhcGhMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZml4ZWRMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhclNjZW5lR3JhcGhMaXN0ZW5lcnMgKCkge1xyXG4gICAgICAgIHRoaXMuX3NjZW5lR3JhcGhMaXN0ZW5lcnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXJGaXhlZExpc3RlbmVycyAoKSB7XHJcbiAgICAgICAgdGhpcy5fZml4ZWRMaXN0ZW5lcnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIHRoaXMuX3NjZW5lR3JhcGhMaXN0ZW5lcnMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9maXhlZExpc3RlbmVycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZml4ZWRMaXN0ZW5lcnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjZW5lR3JhcGhMaXN0ZW5lcnM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9fZ2V0TGlzdGVuZXJJRCAoZXZlbnQ6IEV2ZW50KSB7XHJcbiAgICBjb25zdCBldmVudFR5cGUgPSBFdmVudDtcclxuICAgIGNvbnN0IHR5cGUgPSBldmVudC50eXBlO1xyXG4gICAgaWYgKHR5cGUgPT09IGV2ZW50VHlwZS5BQ0NFTEVSQVRJT04pIHtcclxuICAgICAgICByZXR1cm4gTGlzdGVuZXJJRC5BQ0NFTEVSQVRJT047XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZSA9PT0gZXZlbnRUeXBlLktFWUJPQVJEKSB7XHJcbiAgICAgICAgcmV0dXJuIExpc3RlbmVySUQuS0VZQk9BUkQ7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZS5zdGFydHNXaXRoKGV2ZW50VHlwZS5NT1VTRSkpIHtcclxuICAgICAgICByZXR1cm4gTGlzdGVuZXJJRC5NT1VTRTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlLnN0YXJ0c1dpdGgoZXZlbnRUeXBlLlRPVUNIKSkge1xyXG4gICAgICAgIC8vIFRvdWNoIGxpc3RlbmVyIGlzIHZlcnkgc3BlY2lhbCwgaXQgY29udGFpbnMgdHdvIGtpbmRzIG9mIGxpc3RlbmVyczpcclxuICAgICAgICAvLyBFdmVudExpc3RlbmVyVG91Y2hPbmVCeU9uZSBhbmQgRXZlbnRMaXN0ZW5lclRvdWNoQWxsQXRPbmNlLlxyXG4gICAgICAgIC8vIHJldHVybiBVTktOT1dOIGluc3RlYWQuXHJcbiAgICAgICAgbG9nSUQoMjAwMCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJyc7XHJcbn1cclxuXHJcbi8vIFByaW9yaXR5IGRpcnR5IGZsYWdcclxuY29uc3QgRElSVFlfTk9ORSA9IDA7XHJcbmNvbnN0IERJUlRZX0ZJWEVEX1BSSU9SSVRZID0gMSA8PCAwO1xyXG5jb25zdCBESVJUWV9TQ0VORV9HUkFQSF9QUklPUklUWSA9IDEgPDwgMTtcclxuY29uc3QgRElSVFlfQUxMID0gMztcclxuXHJcbmludGVyZmFjZSBJTGlzdGVuZXJzTWFwe1xyXG4gICAgW2tleTogc3RyaW5nXTogX0V2ZW50TGlzdGVuZXJWZWN0b3I7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJUHJpb3JpdHlGbGFne1xyXG4gICAgW2tleTogc3RyaW5nXTogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSU5vZGVMaXN0ZW5lciB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBFdmVudExpc3RlbmVyW107XHJcbn1cclxuXHJcbmNsYXNzIEV2ZW50TWFuYWdlciB7XHJcbiAgICBwcml2YXRlIF9saXN0ZW5lcnNNYXA6IElMaXN0ZW5lcnNNYXAgPSB7fTtcclxuICAgIHByaXZhdGUgX3ByaW9yaXR5RGlydHlGbGFnTWFwOiBJUHJpb3JpdHlGbGFnID0ge307XHJcbiAgICBwcml2YXRlIF9ub2RlTGlzdGVuZXJzTWFwOiBJTm9kZUxpc3RlbmVyID0ge307XHJcbiAgICBwcml2YXRlIF90b0FkZGVkTGlzdGVuZXJzOiBFdmVudExpc3RlbmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX3RvUmVtb3ZlZExpc3RlbmVyczogRXZlbnRMaXN0ZW5lcltdID0gW107XHJcbiAgICBwcml2YXRlIF9kaXJ0eUxpc3RlbmVyczogTm9kZVtdID0gW107XHJcbiAgICBwcml2YXRlIF9pbkRpc3BhdGNoID0gMDtcclxuICAgIHByaXZhdGUgX2lzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfaW50ZXJuYWxDdXN0b21MaXN0ZW5lcklEczogc3RyaW5nW10gPSBbXTtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRUb3VjaCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50VG91Y2hMaXN0ZW5lcjogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQYXVzZXMgYWxsIGxpc3RlbmVycyB3aGljaCBhcmUgYXNzb2NpYXRlZCB0aGUgc3BlY2lmaWVkIHRhcmdldC5cclxuICAgICAqIEB6aCDmmoLlgZzkvKDlhaXnmoQgbm9kZSDnm7jlhbPnmoTmiYDmnInnm5HlkKzlmajnmoTkuovku7blk43lupTjgIJcclxuICAgICAqIEBwYXJhbSBub2RlIC0g5pqC5YGc55uu5qCH6IqC54K5XHJcbiAgICAgKiBAcGFyYW0gcmVjdXJzaXZlIC0g5piv5ZCm5b6A5a2Q6IqC54K56YCS5b2S5pqC5YGc44CC6buY6K6k5Li6IGZhbHNl44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwYXVzZVRhcmdldCAobm9kZTogTm9kZSwgcmVjdXJzaXZlID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgbGVnYWN5Q0MuX0Jhc2VOb2RlKSkge1xyXG4gICAgICAgICAgICB3YXJuSUQoMzUwNik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbm9kZUxpc3RlbmVyc01hcFtub2RlLnV1aWRdO1xyXG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuX3NldFBhdXNlZCh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVjdXJzaXZlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvY0NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuICAgICAgICAgICAgaWYgKGxvY0NoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY0NoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jQ2hpbGQgPSBsb2NDaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhdXNlVGFyZ2V0KGxvY0NoaWxkLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVzdW1lcyBhbGwgbGlzdGVuZXJzIHdoaWNoIGFyZSBhc3NvY2lhdGVkIHRoZSBzcGVjaWZpZWQgdGFyZ2V0LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5oGi5aSN5Lyg5YWl55qEIG5vZGUg55u45YWz55qE5omA5pyJ55uR5ZCs5Zmo55qE5LqL5Lu25ZON5bqU44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5vZGUgLSDnm5HlkKzlmajoioLngrnjgIJcclxuICAgICAqIEBwYXJhbSByZWN1cnNpdmUgLSDmmK/lkKblvoDlrZDoioLngrnpgJLlvZLjgILpu5jorqTkuLogZmFsc2XjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc3VtZVRhcmdldCAobm9kZTogTm9kZSwgcmVjdXJzaXZlID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgbGVnYWN5Q0MuX0Jhc2VOb2RlKSkge1xyXG4gICAgICAgICAgICB3YXJuSUQoMzUwNik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbm9kZUxpc3RlbmVyc01hcFtub2RlLnV1aWRdO1xyXG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuX3NldFBhdXNlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2V0RGlydHlGb3JOb2RlKG5vZGUpO1xyXG4gICAgICAgIGlmIChyZWN1cnNpdmUgPT09IHRydWUgJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvY0NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuICAgICAgICAgICAgaWYgKGxvY0NoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY0NoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jQ2hpbGQgPSBsb2NDaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3VtZVRhcmdldChsb2NDaGlsZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZyYW1lVXBkYXRlTGlzdGVuZXJzICgpIHtcclxuICAgICAgICBjb25zdCBsb2NMaXN0ZW5lcnNNYXAgPSB0aGlzLl9saXN0ZW5lcnNNYXA7XHJcbiAgICAgICAgY29uc3QgbG9jUHJpb3JpdHlEaXJ0eUZsYWdNYXAgPSB0aGlzLl9wcmlvcml0eURpcnR5RmxhZ01hcDtcclxuICAgICAgICBmb3IgKGNvbnN0IHNlbEtleSBpbiBsb2NMaXN0ZW5lcnNNYXApIHtcclxuICAgICAgICAgICAgaWYgKGxvY0xpc3RlbmVyc01hcFtzZWxLZXldLmVtcHR5KCkpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2NQcmlvcml0eURpcnR5RmxhZ01hcFtzZWxLZXldO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGxvY0xpc3RlbmVyc01hcFtzZWxLZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBsb2NUb0FkZGVkTGlzdGVuZXJzID0gdGhpcy5fdG9BZGRlZExpc3RlbmVycztcclxuICAgICAgICBpZiAobG9jVG9BZGRlZExpc3RlbmVycy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxvY1RvQWRkZWRMaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmNlQWRkRXZlbnRMaXN0ZW5lcihsb2NUb0FkZGVkTGlzdGVuZXJzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl90b1JlbW92ZWRMaXN0ZW5lcnMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NsZWFuVG9SZW1vdmVkTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBRdWVyeSB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgZXZlbnQgbGlzdGVuZXIgaWQgaGFzIGJlZW4gYWRkZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmn6Xor6LmjIflrprnmoTkuovku7YgSUQg5piv5ZCm5a2Y5Zyo44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVySUQgLSDmn6Xmib7nm5HlkKzlmaggSUTjgIJcclxuICAgICAqIEByZXR1cm5zIOaYr+WQpuW3suafpeaJvuWIsOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGFzRXZlbnRMaXN0ZW5lciAobGlzdGVuZXJJRDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZ2V0TGlzdGVuZXJzKGxpc3RlbmVySUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiA8cD5cclxuICAgICAqIEFkZHMgYSBldmVudCBsaXN0ZW5lciBmb3IgYSBzcGVjaWZpZWQgZXZlbnQuPGJyLz5cclxuICAgICAqIGlmIHRoZSBwYXJhbWV0ZXIgXCJub2RlT3JQcmlvcml0eVwiIGlzIGEgbm9kZSxcclxuICAgICAqIGl0IG1lYW5zIHRvIGFkZCBhIGV2ZW50IGxpc3RlbmVyIGZvciBhIHNwZWNpZmllZCBldmVudCB3aXRoIHRoZSBwcmlvcml0eSBvZiBzY2VuZSBncmFwaC48YnIvPlxyXG4gICAgICogaWYgdGhlIHBhcmFtZXRlciBcIm5vZGVPclByaW9yaXR5XCIgaXMgYSBOdW1iZXIsXHJcbiAgICAgKiBpdCBtZWFucyB0byBhZGQgYSBldmVudCBsaXN0ZW5lciBmb3IgYSBzcGVjaWZpZWQgZXZlbnQgd2l0aCB0aGUgZml4ZWQgcHJpb3JpdHkuPGJyLz5cclxuICAgICAqIDwvcD5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWwhuS6i+S7tuebkeWQrOWZqOa3u+WKoOWIsOS6i+S7tueuoeeQhuWZqOS4reOAgjxici8+XHJcbiAgICAgKiDlpoLmnpzlj4LmlbAg4oCcbm9kZU9yUHJpb3JpdHnigJ0g5piv6IqC54K577yM5LyY5YWI57qn55SxIG5vZGUg55qE5riy5p+T6aG65bqP5Yaz5a6a77yM5pi+56S65Zyo5LiK5bGC55qE6IqC54K55bCG5LyY5YWI5pS25Yiw5LqL5Lu244CCPGJyLz5cclxuICAgICAqIOWmguaenOWPguaVsCDigJxub2RlT3JQcmlvcml0eeKAnSDmmK/mlbDlrZfvvIzkvJjlhYjnuqfliJnlm7rlrprkuLror6Xlj4LmlbDnmoTmlbDlgLzvvIzmlbDlrZfotorlsI/vvIzkvJjlhYjnuqfotorpq5jjgII8YnIvPlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciAtIOaMh+WumuS6i+S7tuebkeWQrOWZqOOAglxyXG4gICAgICogQHBhcmFtIG5vZGVPclByaW9yaXR5IC0g55uR5ZCs56iL5bqP55qE5LyY5YWI57qn44CCXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkTGlzdGVuZXIgKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyLCBub2RlT3JQcmlvcml0eTogYW55IHwgbnVtYmVyKTogYW55IHtcclxuICAgICAgICBhc3NlcnRJRChsaXN0ZW5lciAmJiBub2RlT3JQcmlvcml0eSwgMzUwMyk7XHJcbiAgICAgICAgaWYgKCEobGVnYWN5Q0MuanMuaXNOdW1iZXIobm9kZU9yUHJpb3JpdHkpIHx8IG5vZGVPclByaW9yaXR5IGluc3RhbmNlb2YgbGVnYWN5Q0MuX0Jhc2VOb2RlKSkge1xyXG4gICAgICAgICAgICB3YXJuSUQoMzUwNik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCEobGlzdGVuZXIgaW5zdGFuY2VvZiBsZWdhY3lDQy5FdmVudExpc3RlbmVyKSkge1xyXG4gICAgICAgICAgICBhc3NlcnRJRCghbGVnYWN5Q0MuanMuaXNOdW1iZXIobm9kZU9yUHJpb3JpdHkpLCAzNTA0KTtcclxuICAgICAgICAgICAgbGlzdGVuZXIgPSBsZWdhY3lDQy5FdmVudExpc3RlbmVyLmNyZWF0ZShsaXN0ZW5lcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGxpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nSUQoMzUwNSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghbGlzdGVuZXIuY2hlY2tBdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobGVnYWN5Q0MuanMuaXNOdW1iZXIobm9kZU9yUHJpb3JpdHkpKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlT3JQcmlvcml0eSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbG9nSUQoMzUwMCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkobnVsbCk7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRGaXhlZFByaW9yaXR5KG5vZGVPclByaW9yaXR5KTtcclxuICAgICAgICAgICAgbGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQodHJ1ZSk7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRQYXVzZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLl9hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFjaGVja1VJTm9kZShub2RlT3JQcmlvcml0eSkpIHtcclxuICAgICAgICAgICAgICAgIGxvZ0lEKDM1MTIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkobm9kZU9yUHJpb3JpdHkpO1xyXG4gICAgICAgICAgICBsaXN0ZW5lci5fc2V0Rml4ZWRQcmlvcml0eSgwKTtcclxuICAgICAgICAgICAgbGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2FkZExpc3RlbmVyKGxpc3RlbmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsaXN0ZW5lcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQWRkcyBhIEN1c3RvbSBldmVudCBsaXN0ZW5lci4gSXQgd2lsbCB1c2UgYSBmaXhlZCBwcmlvcml0eSBvZiAxLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5ZCR5LqL5Lu2566h55CG5Zmo5re75Yqg5LiA5Liq6Ieq5a6a5LmJ5LqL5Lu255uR5ZCs5Zmo44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50TmFtZSAtIOiHquWumuS5ieS6i+S7tuWQjeOAglxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIC0g5LqL5Lu25Zue6LCD44CCXHJcbiAgICAgKiBAcmV0dXJucyDov5Tlm57oh6rlrprkuYnnm5HlkKzlmajjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEN1c3RvbUxpc3RlbmVyIChldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBFdmVudExpc3RlbmVyLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgIGV2ZW50OiBsZWdhY3lDQy5FdmVudExpc3RlbmVyLkNVU1RPTSxcclxuICAgICAgICAgICAgZXZlbnROYW1lLFxyXG4gICAgICAgICAgICBjYWxsYmFjayxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKGxpc3RlbmVyLCAxKTtcclxuICAgICAgICByZXR1cm4gbGlzdGVuZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlbW92ZSBhIGxpc3RlbmVyLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog56e76Zmk5LiA5Liq5bey5re75Yqg55qE55uR5ZCs5Zmo44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIC0g6ZyA6KaB56e76Zmk55qE55uR5ZCs5Zmo44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVMaXN0ZW5lciAobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICBpZiAobGlzdGVuZXIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaXNGb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGxvY0xpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzTWFwO1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2VsS2V5IGluIGxvY0xpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IGxvY0xpc3RlbmVyW3NlbEtleV07XHJcbiAgICAgICAgICAgIGNvbnN0IGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0Rml4ZWRQcmlvcml0eUxpc3RlbmVycygpO1xyXG4gICAgICAgICAgICBjb25zdCBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKCk7XHJcblxyXG4gICAgICAgICAgICBpc0ZvdW5kID0gdGhpcy5fcmVtb3ZlTGlzdGVuZXJJblZlY3RvcihzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMsIGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgaWYgKGlzRm91bmQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGZpeGVkICM0MTYwOiBEaXJ0eSBmbGFnIG5lZWQgdG8gYmUgdXBkYXRlZCBhZnRlciBsaXN0ZW5lcnMgd2VyZSByZW1vdmVkLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGlydHkobGlzdGVuZXIuX2dldExpc3RlbmVySUQoKSwgRElSVFlfU0NFTkVfR1JBUEhfUFJJT1JJVFkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXNGb3VuZCA9IHRoaXMuX3JlbW92ZUxpc3RlbmVySW5WZWN0b3IoZml4ZWRQcmlvcml0eUxpc3RlbmVycywgbGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzRm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXREaXJ0eShsaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpLCBESVJUWV9GSVhFRF9QUklPUklUWSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuZW1wdHkoKSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3ByaW9yaXR5RGlydHlGbGFnTWFwW2xpc3RlbmVyLl9nZXRMaXN0ZW5lcklEKCldO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGxvY0xpc3RlbmVyW3NlbEtleV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpc0ZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpc0ZvdW5kKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvY1RvQWRkZWRMaXN0ZW5lcnMgPSB0aGlzLl90b0FkZGVkTGlzdGVuZXJzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gbG9jVG9BZGRlZExpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsTGlzdGVuZXIgPSBsb2NUb0FkZGVkTGlzdGVuZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyID09PSBsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZ2FjeUNDLmpzLmFycmF5LnJlbW92ZUF0KGxvY1RvQWRkZWRMaXN0ZW5lcnMsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyLl9zZXRSZWdpc3RlcmVkKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzIHdpdGggdGhlIHNhbWUgZXZlbnQgbGlzdGVuZXIgdHlwZSBvciByZW1vdmVzIGFsbCBsaXN0ZW5lcnMgb2YgYSBub2RlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog56e76Zmk5rOo5YaM5YiwIGV2ZW50TWFuYWdlciDkuK3mjIflrprnsbvlnovnmoTmiYDmnInkuovku7bnm5HlkKzlmajjgII8YnIvPlxyXG4gICAgICogMS4g5aaC5p6c5Lyg5YWl55qE56ys5LiA5Liq5Y+C5pWw57G75Z6L5pivIE5vZGXvvIzpgqPkuYjkuovku7bnrqHnkIblmajlsIbnp7vpmaTkuI7or6Xlr7nosaHnm7jlhbPnmoTmiYDmnInkuovku7bnm5HlkKzlmajjgIJcclxuICAgICAqIO+8iOWmguaenOesrOS6jOWPguaVsCByZWN1cnNpdmUg5pivIHRydWUg55qE6K+d77yM5bCx5Lya6L+e5ZCM6K+l5a+56LGh55qE5a2Q5o6n5Lu25LiK5omA5pyJ55qE5LqL5Lu255uR5ZCs5Zmo5Lmf5LiA5bm256e76Zmk77yJPGJyLz5cclxuICAgICAqIDIuIOWmguaenOS8oOWFpeeahOesrOS4gOS4quWPguaVsOexu+Wei+aYryBOdW1iZXLvvIjor6XnsbvlnosgRXZlbnRMaXN0ZW5lciDkuK3lrprkuYnnmoTkuovku7bnsbvlnovvvInvvIxcclxuICAgICAqIOmCo+S5iOS6i+S7tueuoeeQhuWZqOWwhuenu+mZpOivpeexu+Wei+eahOaJgOacieS6i+S7tuebkeWQrOWZqOOAgjxici8+XHJcbiAgICAgKlxyXG4gICAgICog5LiL5YiX5piv55uu5YmN5a2Y5Zyo55uR5ZCs5Zmo57G75Z6L77yaICAgICAgIDxici8+XHJcbiAgICAgKiBgRXZlbnRMaXN0ZW5lci5VTktOT1dOYCAgICAgICA8YnIvPlxyXG4gICAgICogYEV2ZW50TGlzdGVuZXIuS0VZQk9BUkRgICAgICAgPGJyLz5cclxuICAgICAqIGBFdmVudExpc3RlbmVyLkFDQ0VMRVJBVElPTmDvvIw8YnIvPlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lclR5cGUgLSDnm5HlkKzlmajnsbvlnovjgIJcclxuICAgICAqIEBwYXJhbSByZWN1cnNpdmUgLSDpgJLlvZLlrZDoioLngrnnmoTlkIznsbvlnovnm5HlkKzlmajkuIDlubbnp7vpmaTjgILpu5jorqTkuLogZmFsc2XjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUxpc3RlbmVycyAobGlzdGVuZXJUeXBlOiBudW1iZXIgfCBhbnksIHJlY3Vyc2l2ZSA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKCEobGVnYWN5Q0MuanMuaXNOdW1iZXIobGlzdGVuZXJUeXBlKSB8fCBsaXN0ZW5lclR5cGUgaW5zdGFuY2VvZiBsZWdhY3lDQy5fQmFzZU5vZGUpKSB7XHJcbiAgICAgICAgICAgIHdhcm5JRCgzNTA2KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGlzdGVuZXJUeXBlLl9pZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIEVuc3VyZSB0aGUgbm9kZSBpcyByZW1vdmVkIGZyb20gdGhlc2UgaW1tZWRpYXRlbHkgYWxzby5cclxuICAgICAgICAgICAgLy8gRG9uJ3Qgd2FudCBhbnkgZGFuZ2xpbmcgcG9pbnRlcnMgb3IgdGhlIHBvc3NpYmlsaXR5IG9mIGRlYWxpbmcgd2l0aCBkZWxldGVkIG9iamVjdHMuLlxyXG4gICAgICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9ub2RlTGlzdGVuZXJzTWFwW2xpc3RlbmVyVHlwZS5faWRdO1xyXG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ZW5lcnNDb3B5ID0gbGVnYWN5Q0MuanMuYXJyYXkuY29weShsaXN0ZW5lcnMpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lcnNDb3B5Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlzdGVuZXJDb3B5ID0gbGlzdGVuZXJzQ29weVtpXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyQ29weSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fbm9kZUxpc3RlbmVyc01hcFtsaXN0ZW5lclR5cGUuX2lkXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQnVnIGZpeDogZW5zdXJlIHRoZXJlIGFyZSBubyByZWZlcmVuY2VzIHRvIHRoZSBub2RlIGluIHRoZSBsaXN0IG9mIGxpc3RlbmVycyB0byBiZSBhZGRlZC5cclxuICAgICAgICAgICAgLy8gSWYgd2UgZmluZCBhbnkgbGlzdGVuZXJzIGFzc29jaWF0ZWQgd2l0aCB0aGUgZGVzdHJveWVkIG5vZGUgaW4gdGhpcyBsaXN0IHRoZW4gcmVtb3ZlIHRoZW0uXHJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdG8gY2F0Y2ggdGhlIHNjZW5hcmlvIHdoZXJlIHRoZSBub2RlIGdldHMgZGVzdHJveWVkIGJlZm9yZSBpdCdzIGxpc3RlbmVyXHJcbiAgICAgICAgICAgIC8vIGlzIGFkZGVkIGludG8gdGhlIGV2ZW50IGRpc3BhdGNoZXIgZnVsbHkuIFRoaXMgY291bGQgaGFwcGVuIGlmIGEgbm9kZSByZWdpc3RlcnMgYSBsaXN0ZW5lclxyXG4gICAgICAgICAgICAvLyBhbmQgZ2V0cyBkZXN0cm95ZWQgd2hpbGUgd2UgYXJlIGRpc3BhdGNoaW5nIGFuIGV2ZW50ICh0b3VjaCBldGMuKVxyXG4gICAgICAgICAgICBjb25zdCBsb2NUb0FkZGVkTGlzdGVuZXJzID0gdGhpcy5fdG9BZGRlZExpc3RlbmVycztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aDspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyID0gbG9jVG9BZGRlZExpc3RlbmVyc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCkgPT09IGxpc3RlbmVyVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVuc3VyZSBubyBkYW5nbGluZyBwdHIgdG8gdGhlIHRhcmdldCBub2RlLlxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY1RvQWRkZWRMaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZWN1cnNpdmUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvY0NoaWxkcmVuID0gbGlzdGVuZXJUeXBlLmdldENoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY0NoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jQ2hpbGQgPSBsb2NDaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVycyhsb2NDaGlsZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobGlzdGVuZXJUeXBlID09PSBsZWdhY3lDQy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyc0Zvckxpc3RlbmVySUQoTGlzdGVuZXJJRC5UT1VDSF9PTkVfQllfT05FKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lclR5cGUgPT09IGxlZ2FjeUNDLkV2ZW50TGlzdGVuZXIuVE9VQ0hfQUxMX0FUX09OQ0UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyc0Zvckxpc3RlbmVySUQoTGlzdGVuZXJJRC5UT1VDSF9BTExfQVRfT05DRSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXJUeXBlID09PSBsZWdhY3lDQy5FdmVudExpc3RlbmVyLk1PVVNFKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcnNGb3JMaXN0ZW5lcklEKExpc3RlbmVySUQuTU9VU0UpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxpc3RlbmVyVHlwZSA9PT0gbGVnYWN5Q0MuRXZlbnRMaXN0ZW5lci5BQ0NFTEVSQVRJT04pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyc0Zvckxpc3RlbmVySUQoTGlzdGVuZXJJRC5BQ0NFTEVSQVRJT04pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxpc3RlbmVyVHlwZSA9PT0gbGVnYWN5Q0MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRChMaXN0ZW5lcklELktFWUJPQVJEKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvZ0lEKDM1MDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBjdXN0b20gbGlzdGVuZXJzIHdpdGggdGhlIHNhbWUgZXZlbnQgbmFtZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOenu+mZpOWQjOS4gOS6i+S7tuWQjeeahOiHquWumuS5ieS6i+S7tuebkeWQrOWZqOOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjdXN0b21FdmVudE5hbWUgLSDoh6rlrprkuYnkuovku7bnm5HlkKzlmajlkI3jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUN1c3RvbUxpc3RlbmVycyAoY3VzdG9tRXZlbnROYW1lKSB7XHJcbiAgICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRChjdXN0b21FdmVudE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBsaXN0ZW5lcnMuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnp7vpmaTmiYDmnInkuovku7bnm5HlkKzlmajjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUFsbExpc3RlbmVycyAoKSB7XHJcbiAgICAgICAgY29uc3QgbG9jTGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwO1xyXG4gICAgICAgIGNvbnN0IGxvY0ludGVybmFsQ3VzdG9tRXZlbnRJRHMgPSB0aGlzLl9pbnRlcm5hbEN1c3RvbUxpc3RlbmVySURzO1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2VsS2V5IGluIGxvY0xpc3RlbmVycykge1xyXG4gICAgICAgICAgICBpZiAobG9jSW50ZXJuYWxDdXN0b21FdmVudElEcy5pbmRleE9mKHNlbEtleSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcnNGb3JMaXN0ZW5lcklEKHNlbEtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldHMgbGlzdGVuZXIncyBwcmlvcml0eSB3aXRoIGZpeGVkIHZhbHVlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572uIEZpeGVkUHJpb3JpdHkg57G75Z6L55uR5ZCs5Zmo55qE5LyY5YWI57qn44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIC0g55uR5ZCs5Zmo44CCXHJcbiAgICAgKiBAcGFyYW0gZml4ZWRQcmlvcml0eSAtIOS8mOWFiOe6p+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0UHJpb3JpdHkgKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyLCBmaXhlZFByaW9yaXR5OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAobGlzdGVuZXIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBsb2NMaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXA7XHJcbiAgICAgICAgZm9yIChjb25zdCBzZWxLZXkgaW4gbG9jTGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbExpc3RlbmVycyA9IGxvY0xpc3RlbmVyc1tzZWxLZXldO1xyXG4gICAgICAgICAgICBjb25zdCBmaXhlZFByaW9yaXR5TGlzdGVuZXJzID0gc2VsTGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgICAgaWYgKGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gZml4ZWRQcmlvcml0eUxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGlmIChmb3VuZCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nSUQoMzUwMik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5fZ2V0Rml4ZWRQcmlvcml0eSgpICE9PSBmaXhlZFByaW9yaXR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRGaXhlZFByaW9yaXR5KGZpeGVkUHJpb3JpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXREaXJ0eShsaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpLCBESVJUWV9GSVhFRF9QUklPUklUWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogV2hldGhlciB0byBlbmFibGUgZGlzcGF0Y2hpbmcgZXZlbnRzLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5ZCv55So5oiW56aB55So5LqL5Lu2566h55CG5Zmo77yM56aB55So5ZCO5LiN5Lya5YiG5Y+R5Lu75L2V5LqL5Lu244CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGVuYWJsZWQgLSDmmK/lkKblkK/nlKjkuovku7bnrqHnkIblmajjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEVuYWJsZWQgKGVuYWJsZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9pc0VuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDaGVja3Mgd2hldGhlciBkaXNwYXRjaGluZyBldmVudHMgaXMgZW5hYmxlZC5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5qOA5rWL5LqL5Lu2566h55CG5Zmo5piv5ZCm5ZCv55So44CCXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzRW5hYmxlZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRW5hYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRGlzcGF0Y2hlcyB0aGUgZXZlbnQsIGFsc28gcmVtb3ZlcyBhbGwgRXZlbnRMaXN0ZW5lcnMgbWFya2VkIGZvciBkZWxldGlvbiBmcm9tIHRoZSBldmVudCBkaXNwYXRjaGVyIGxpc3QuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDliIblj5Hkuovku7bjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgLSDliIblj5Hkuovku7bjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRpc3BhdGNoRXZlbnQgKGV2ZW50OiBFdmVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5faXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZURpcnR5RmxhZ0ZvclNjZW5lR3JhcGgoKTtcclxuICAgICAgICB0aGlzLl9pbkRpc3BhdGNoKys7XHJcbiAgICAgICAgaWYgKCFldmVudCB8fCAhZXZlbnQuZ2V0VHlwZSkge1xyXG4gICAgICAgICAgICBlcnJvcklEKDM1MTEpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChldmVudC5nZXRUeXBlKCkuc3RhcnRzV2l0aChsZWdhY3lDQy5FdmVudC5UT1VDSCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hUb3VjaEV2ZW50KGV2ZW50IGFzIEV2ZW50VG91Y2gpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbkRpc3BhdGNoLS07XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxpc3RlbmVySUQgPSBfX2dldExpc3RlbmVySUQoZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuX3NvcnRFdmVudExpc3RlbmVycyhsaXN0ZW5lcklEKTtcclxuICAgICAgICBjb25zdCBzZWxMaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXBbbGlzdGVuZXJJRF07XHJcbiAgICAgICAgaWYgKHNlbExpc3RlbmVycyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnRUb0xpc3RlbmVycyhzZWxMaXN0ZW5lcnMsIHRoaXMuX29uTGlzdGVuZXJDYWxsYmFjaywgZXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9vblVwZGF0ZUxpc3RlbmVycyhzZWxMaXN0ZW5lcnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faW5EaXNwYXRjaC0tO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfb25MaXN0ZW5lckNhbGxiYWNrIChsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciwgZXZlbnQ6IEV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldCA9IGxpc3RlbmVyLl90YXJnZXQ7XHJcbiAgICAgICAgY29uc3Qgb25FdmVudCA9IGxpc3RlbmVyLm9uRXZlbnQ7XHJcbiAgICAgICAgaWYgKG9uRXZlbnQpIHtcclxuICAgICAgICAgICAgb25FdmVudChldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBldmVudC5pc1N0b3BwZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRGlzcGF0Y2hlcyBhIEN1c3RvbSBFdmVudCB3aXRoIGEgZXZlbnQgbmFtZSBhbiBvcHRpb25hbCB1c2VyIGRhdGEuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDliIblj5Hoh6rlrprkuYnkuovku7bjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIC0g6Ieq5a6a5LmJ5LqL5Lu25ZCN44CCXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9uYWxVc2VyRGF0YVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGlzcGF0Y2hDdXN0b21FdmVudCAoZXZlbnROYW1lLCBvcHRpb25hbFVzZXJEYXRhKSB7XHJcbiAgICAgICAgY29uc3QgZXYgPSBuZXcgbGVnYWN5Q0MuRXZlbnQuRXZlbnRDdXN0b20oZXZlbnROYW1lKTtcclxuICAgICAgICBldi5zZXRVc2VyRGF0YShvcHRpb25hbFVzZXJEYXRhKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXYpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NldERpcnR5Rm9yTm9kZSAobm9kZTogTm9kZSkge1xyXG4gICAgICAgIC8vIE1hcmsgdGhlIG5vZGUgZGlydHkgb25seSB3aGVuIHRoZXJlIGlzIGFuIGV2ZW50IGxpc3RlbmVyIGFzc29jaWF0ZWQgd2l0aCBpdC5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgY29uc3Qgc2VsTGlzdGVuZXJzID0gdGhpcy5fbm9kZUxpc3RlbmVyc01hcFtub2RlLl9pZF07XHJcbiAgICAgICAgaWYgKHNlbExpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBzZWxMaXN0ZW5lcnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbExpc3RlbmVyID0gc2VsTGlzdGVuZXJzW2pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdGVuZXJJRCA9IHNlbExpc3RlbmVyLl9nZXRMaXN0ZW5lcklEKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGlydHlMaXN0ZW5lcnNbbGlzdGVuZXJJRF0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpcnR5TGlzdGVuZXJzW2xpc3RlbmVySURdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IF9jaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBfY2hpbGRyZW4gPyBfY2hpbGRyZW4ubGVuZ3RoIDogMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXREaXJ0eUZvck5vZGUoX2NoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hZGRMaXN0ZW5lciAobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5faW5EaXNwYXRjaCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9mb3JjZUFkZEV2ZW50TGlzdGVuZXIobGlzdGVuZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RvQWRkZWRMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZvcmNlQWRkRXZlbnRMaXN0ZW5lciAobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICBjb25zdCBsaXN0ZW5lcklEID0gbGlzdGVuZXIuX2dldExpc3RlbmVySUQoKTtcclxuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwW2xpc3RlbmVySURdO1xyXG4gICAgICAgIGlmICghbGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IG5ldyBfRXZlbnRMaXN0ZW5lclZlY3RvcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNNYXBbbGlzdGVuZXJJRF0gPSBsaXN0ZW5lcnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcclxuXHJcbiAgICAgICAgaWYgKGxpc3RlbmVyLl9nZXRGaXhlZFByaW9yaXR5KCkgPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fc2V0RGlydHkobGlzdGVuZXJJRCwgRElSVFlfU0NFTkVfR1JBUEhfUFJJT1JJVFkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGxpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKTtcclxuICAgICAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGxvZ0lEKDM1MDcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9hc3NvY2lhdGVOb2RlQW5kRXZlbnRMaXN0ZW5lcihub2RlLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmFjdGl2ZUluSGllcmFyY2h5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VtZVRhcmdldChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldERpcnR5KGxpc3RlbmVySUQsIERJUlRZX0ZJWEVEX1BSSU9SSVRZKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0TGlzdGVuZXJzIChsaXN0ZW5lcklEOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzTWFwW2xpc3RlbmVySURdO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZURpcnR5RmxhZ0ZvclNjZW5lR3JhcGggKCkge1xyXG4gICAgICAgIGNvbnN0IGxvY0RpcnR5TGlzdGVuZXJzID0gdGhpcy5fZGlydHlMaXN0ZW5lcnM7XHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBmb3JpblxyXG4gICAgICAgIGZvciAoY29uc3Qgc2VsS2V5IGluIGxvY0RpcnR5TGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldERpcnR5KHNlbEtleSwgRElSVFlfU0NFTkVfR1JBUEhfUFJJT1JJVFkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kaXJ0eUxpc3RlbmVycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlbW92ZUFsbExpc3RlbmVyc0luVmVjdG9yIChsaXN0ZW5lclZlY3RvcjogRXZlbnRMaXN0ZW5lcltdKSB7XHJcbiAgICAgICAgaWYgKCFsaXN0ZW5lclZlY3Rvcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBzZWxMaXN0ZW5lcjtcclxuICAgICAgICBmb3IgKGxldCBpID0gbGlzdGVuZXJWZWN0b3IubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgc2VsTGlzdGVuZXIgPSBsaXN0ZW5lclZlY3RvcltpXTtcclxuICAgICAgICAgICAgc2VsTGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3NvY2lhdGVOb2RlQW5kRXZlbnRMaXN0ZW5lcihzZWxMaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCksIHNlbExpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyLl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkobnVsbCk7ICAgLy8gTlVMTCBvdXQgdGhlIG5vZGUgcG9pbnRlciBzbyB3ZSBkb24ndCBoYXZlIGFueSBkYW5nbGluZyBwb2ludGVycyB0byBkZXN0cm95ZWQgbm9kZXMuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbkRpc3BhdGNoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy5qcy5hcnJheS5yZW1vdmVBdChsaXN0ZW5lclZlY3RvciwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRCAobGlzdGVuZXJJRDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwW2xpc3RlbmVySURdO1xyXG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcclxuICAgICAgICAgICAgY29uc3QgZml4ZWRQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRTY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUFsbExpc3RlbmVyc0luVmVjdG9yKHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUFsbExpc3RlbmVyc0luVmVjdG9yKGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBkaXJ0eSBmbGFnIGFjY29yZGluZyB0aGUgJ2xpc3RlbmVySUQnLlxyXG4gICAgICAgICAgICAvLyBObyBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgdGhlIGRpc3BhdGNoZXIgaXMgZGlzcGF0Y2hpbmcgZXZlbnQuXHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wcmlvcml0eURpcnR5RmxhZ01hcFtsaXN0ZW5lcklEXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5faW5EaXNwYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fbGlzdGVuZXJzTWFwW2xpc3RlbmVySURdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBsb2NUb0FkZGVkTGlzdGVuZXJzID0gdGhpcy5fdG9BZGRlZExpc3RlbmVycztcclxuICAgICAgICBmb3IgKGxldCBpID0gbG9jVG9BZGRlZExpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGxvY1RvQWRkZWRMaXN0ZW5lcnNbaV07XHJcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciAmJiBsaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpID09PSBsaXN0ZW5lcklEKSB7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy5qcy5hcnJheS5yZW1vdmVBdChsb2NUb0FkZGVkTGlzdGVuZXJzLCBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zb3J0RXZlbnRMaXN0ZW5lcnMgKGxpc3RlbmVySUQ6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBkaXJ0eUZsYWcgPSBESVJUWV9OT05FO1xyXG4gICAgICAgIGNvbnN0IGxvY0ZsYWdNYXAgPSB0aGlzLl9wcmlvcml0eURpcnR5RmxhZ01hcDtcclxuICAgICAgICBpZiAobG9jRmxhZ01hcFtsaXN0ZW5lcklEXSkge1xyXG4gICAgICAgICAgICBkaXJ0eUZsYWcgPSBsb2NGbGFnTWFwW2xpc3RlbmVySURdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRpcnR5RmxhZyAhPT0gRElSVFlfTk9ORSkge1xyXG4gICAgICAgICAgICAvLyBDbGVhciB0aGUgZGlydHkgZmxhZyBmaXJzdCwgaWYgYHJvb3ROb2RlYCBpcyBudWxsLCB0aGVuIHNldCBpdHMgZGlydHkgZmxhZyBvZiBzY2VuZSBncmFwaCBwcmlvcml0eVxyXG4gICAgICAgICAgICBsb2NGbGFnTWFwW2xpc3RlbmVySURdID0gRElSVFlfTk9ORTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkaXJ0eUZsYWcgJiBESVJUWV9GSVhFRF9QUklPUklUWSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc29ydExpc3RlbmVyc09mRml4ZWRQcmlvcml0eShsaXN0ZW5lcklEKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRpcnR5RmxhZyAmIERJUlRZX1NDRU5FX0dSQVBIX1BSSU9SSVRZKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb290RW50aXR5ID0gbGVnYWN5Q0MuZGlyZWN0b3IuZ2V0U2NlbmUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChyb290RW50aXR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc29ydExpc3RlbmVyc09mU2NlbmVHcmFwaFByaW9yaXR5KGxpc3RlbmVySUQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NvcnRMaXN0ZW5lcnNPZlNjZW5lR3JhcGhQcmlvcml0eSAobGlzdGVuZXJJRDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fZ2V0TGlzdGVuZXJzKGxpc3RlbmVySUQpO1xyXG4gICAgICAgIGlmICghbGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNjZW5lR3JhcGhMaXN0ZW5lciA9IGxpc3RlbmVycy5nZXRTY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMoKTtcclxuICAgICAgICBpZiAoIXNjZW5lR3JhcGhMaXN0ZW5lciB8fCBzY2VuZUdyYXBoTGlzdGVuZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFmdGVyIHNvcnQ6IHByaW9yaXR5IDwgMCwgPiAwXHJcbiAgICAgICAgbGlzdGVuZXJzLmdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycygpLnNvcnQodGhpcy5fc29ydEV2ZW50TGlzdGVuZXJzT2ZTY2VuZUdyYXBoUHJpb3JpdHlEZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NvcnRFdmVudExpc3RlbmVyc09mU2NlbmVHcmFwaFByaW9yaXR5RGVzIChsMTogRXZlbnRMaXN0ZW5lciwgbDI6IEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICBjb25zdCBub2RlMSA9IGwxLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKTtcclxuICAgICAgICBjb25zdCBub2RlMiA9IGwyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKTtcclxuICAgICAgICAvLyBFdmVudCBtYW5hZ2VyIHNob3VsZCBvbmx5IGNhcmUgYWJvdXQgdWkgbm9kZSBpbiB0aGUgY3VycmVudCBzY2VuZSBoaWVyYXJjaHlcclxuICAgICAgICBpZiAoIWwyIHx8ICFub2RlMiB8fCAhbm9kZTIuX2FjdGl2ZUluSGllcmFyY2h5IHx8ICFub2RlMi5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXApIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghbDEgfHwgIW5vZGUxIHx8ICFub2RlMS5fYWN0aXZlSW5IaWVyYXJjaHkgfHwgIW5vZGUxLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwMSA9IG5vZGUxLCBwMiA9IG5vZGUyLCBleCA9IGZhbHNlO1xyXG4gICAgICAgIGxldCB0cmFuczEgPSBub2RlMS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXA7XHJcbiAgICAgICAgbGV0IHRyYW5zMiA9IG5vZGUyLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcDtcclxuICAgICAgICBpZiAodHJhbnMxLnZpc2liaWxpdHkgIT09IHRyYW5zMi52aXNpYmlsaXR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cmFuczIudmlzaWJpbGl0eSAtIHRyYW5zMS52aXNpYmlsaXR5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2hpbGUgKHAxLnBhcmVudC5faWQgIT09IHAyLnBhcmVudC5faWQpIHtcclxuICAgICAgICAgICAgcDEgPSBwMS5wYXJlbnQucGFyZW50ID09PSBudWxsID8gKGV4ID0gdHJ1ZSkgJiYgbm9kZTIgOiBwMS5wYXJlbnQ7XHJcbiAgICAgICAgICAgIHAyID0gcDIucGFyZW50LnBhcmVudCA9PT0gbnVsbCA/IChleCA9IHRydWUpICYmIG5vZGUxIDogcDIucGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHAxLl9pZCA9PT0gcDIuX2lkKSB7XHJcbiAgICAgICAgICAgIGlmIChwMS5faWQgPT09IG5vZGUyLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwMS5faWQgPT09IG5vZGUxLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHByaW9yaXR5MSA9IHAxLmdldFNpYmxpbmdJbmRleCgpO1xyXG4gICAgICAgIGNvbnN0IHByaW9yaXR5MiA9IHAyLmdldFNpYmxpbmdJbmRleCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gZXggPyBwcmlvcml0eTEgLSBwcmlvcml0eTIgOiBwcmlvcml0eTIgLSBwcmlvcml0eTE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc29ydExpc3RlbmVyc09mRml4ZWRQcmlvcml0eSAobGlzdGVuZXJJRDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwW2xpc3RlbmVySURdO1xyXG4gICAgICAgIGlmICghbGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZpeGVkTGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKTtcclxuICAgICAgICBpZiAoIWZpeGVkTGlzdGVuZXJzIHx8IGZpeGVkTGlzdGVuZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEFmdGVyIHNvcnQ6IHByaW9yaXR5IDwgMCwgPiAwXHJcbiAgICAgICAgZml4ZWRMaXN0ZW5lcnMuc29ydCh0aGlzLl9zb3J0TGlzdGVuZXJzT2ZGaXhlZFByaW9yaXR5QXNjKTtcclxuXHJcbiAgICAgICAgLy8gRklYTUU6IFNob3VsZCB1c2UgYmluYXJ5IHNlYXJjaFxyXG4gICAgICAgIGxldCBpbmRleCA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBsZW4gPSBmaXhlZExpc3RlbmVycy5sZW5ndGg7IGluZGV4IDwgbGVuOykge1xyXG4gICAgICAgICAgICBpZiAoZml4ZWRMaXN0ZW5lcnNbaW5kZXhdLl9nZXRGaXhlZFByaW9yaXR5KCkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKytpbmRleDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGlzdGVuZXJzLmd0MEluZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc29ydExpc3RlbmVyc09mRml4ZWRQcmlvcml0eUFzYyAobDE6IEV2ZW50TGlzdGVuZXIsIGwyOiBFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIGwxLl9nZXRGaXhlZFByaW9yaXR5KCkgLSBsMi5fZ2V0Rml4ZWRQcmlvcml0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX29uVXBkYXRlTGlzdGVuZXJzIChsaXN0ZW5lcnM6IF9FdmVudExpc3RlbmVyVmVjdG9yKSB7XHJcbiAgICAgICAgY29uc3QgZml4ZWRQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgY29uc3Qgc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycygpO1xyXG4gICAgICAgIGNvbnN0IHRvUmVtb3ZlZExpc3RlbmVycyA9IHRoaXMuX3RvUmVtb3ZlZExpc3RlbmVycztcclxuXHJcbiAgICAgICAgaWYgKHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxMaXN0ZW5lciA9IHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVyc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmICghc2VsTGlzdGVuZXIuX2lzUmVnaXN0ZXJlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVnYWN5Q0MuanMuYXJyYXkucmVtb3ZlQXQoc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzLCBpKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdGVtIGluIHRvUmVtb3ZlIGxpc3QsIHJlbW92ZSBpdCBmcm9tIHRoZSBsaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gdG9SZW1vdmVkTGlzdGVuZXJzLmluZGV4T2Yoc2VsTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZHggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmVtb3ZlZExpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBmaXhlZFByaW9yaXR5TGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxMaXN0ZW5lciA9IGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNlbExpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZ2FjeUNDLmpzLmFycmF5LnJlbW92ZUF0KGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0ZW0gaW4gdG9SZW1vdmUgbGlzdCwgcmVtb3ZlIGl0IGZyb20gdGhlIGxpc3RcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZHggPSB0b1JlbW92ZWRMaXN0ZW5lcnMuaW5kZXhPZihzZWxMaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkeCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZW1vdmVkTGlzdGVuZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyAmJiBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVycy5jbGVhclNjZW5lR3JhcGhMaXN0ZW5lcnMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzICYmIGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVycy5jbGVhckZpeGVkTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZVRvdWNoTGlzdGVuZXJzIChldmVudCkge1xyXG4gICAgICAgIGNvbnN0IGxvY0luRGlzcGF0Y2ggPSB0aGlzLl9pbkRpc3BhdGNoO1xyXG4gICAgICAgIGFzc2VydElEKGxvY0luRGlzcGF0Y2ggPiAwLCAzNTA4KTtcclxuXHJcbiAgICAgICAgaWYgKGxvY0luRGlzcGF0Y2ggPiAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsaXN0ZW5lcnM7XHJcbiAgICAgICAgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwW0xpc3RlbmVySUQuVE9VQ0hfT05FX0JZX09ORV07XHJcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xyXG4gICAgICAgICAgICB0aGlzLl9vblVwZGF0ZUxpc3RlbmVycyhsaXN0ZW5lcnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXBbTGlzdGVuZXJJRC5UT1VDSF9BTExfQVRfT05DRV07XHJcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xyXG4gICAgICAgICAgICB0aGlzLl9vblVwZGF0ZUxpc3RlbmVycyhsaXN0ZW5lcnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXNzZXJ0SUQobG9jSW5EaXNwYXRjaCA9PT0gMSwgMzUwOSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvY1RvQWRkZWRMaXN0ZW5lcnMgPSB0aGlzLl90b0FkZGVkTGlzdGVuZXJzO1xyXG4gICAgICAgIGlmIChsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbG9jVG9BZGRlZExpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yY2VBZGRFdmVudExpc3RlbmVyKGxvY1RvQWRkZWRMaXN0ZW5lcnNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RvQWRkZWRMaXN0ZW5lcnMubGVuZ3RoID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl90b1JlbW92ZWRMaXN0ZW5lcnMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NsZWFuVG9SZW1vdmVkTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGluIF90b1JlbW92ZUxpc3RlbmVycyBsaXN0IGFuZCBjbGVhbnVwXHJcbiAgICBwcml2YXRlIF9jbGVhblRvUmVtb3ZlZExpc3RlbmVycyAoKSB7XHJcbiAgICAgICAgY29uc3QgdG9SZW1vdmVkTGlzdGVuZXJzID0gdGhpcy5fdG9SZW1vdmVkTGlzdGVuZXJzO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9SZW1vdmVkTGlzdGVuZXJzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbExpc3RlbmVyID0gdG9SZW1vdmVkTGlzdGVuZXJzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXBbc2VsTGlzdGVuZXIuX2dldExpc3RlbmVySUQoKV07XHJcbiAgICAgICAgICAgIGlmICghbGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZml4ZWRQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRTY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycy5pbmRleE9mKHNlbExpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGlmIChpZHggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZHggPSBmaXhlZFByaW9yaXR5TGlzdGVuZXJzLmluZGV4T2Yoc2VsTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlkeCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaXhlZFByaW9yaXR5TGlzdGVuZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRvUmVtb3ZlZExpc3RlbmVycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX29uVG91Y2hFdmVudENhbGxiYWNrIChsaXN0ZW5lcjogVG91Y2hPbmVCeU9uZSwgYXJnc09iajogYW55KSB7XHJcbiAgICAgICAgLy8gU2tpcCBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXHJcbiAgICAgICAgaWYgKCFsaXN0ZW5lci5faXNSZWdpc3RlcmVkKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBhcmdzT2JqLmV2ZW50O1xyXG4gICAgICAgIGNvbnN0IHNlbFRvdWNoID0gZXZlbnQudG91Y2g7XHJcbiAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldCA9IGxpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKTtcclxuXHJcbiAgICAgICAgbGV0IGlzQ2xhaW1lZCA9IGZhbHNlO1xyXG4gICAgICAgIGxldCByZW1vdmVkSWR4ID0gLTE7XHJcbiAgICAgICAgY29uc3QgZ2V0Q29kZSA9IGV2ZW50LmdldEV2ZW50Q29kZSgpO1xyXG4gICAgICAgIC8vIGNvbnN0IEV2ZW50VG91Y2ggPSBjYy5FdmVudC5FdmVudFRvdWNoO1xyXG4gICAgICAgIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkJFR0FOKSB7XHJcbiAgICAgICAgICAgIGlmICghbWFjcm8uRU5BQkxFX01VTFRJX1RPVUNIICYmIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gZXZlbnRNYW5hZ2VyLl9jdXJyZW50VG91Y2hMaXN0ZW5lciEuX25vZGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUgfHwgbm9kZS5hY3RpdmVJbkhpZXJhcmNoeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobGlzdGVuZXIub25Ub3VjaEJlZ2FuKSB7XHJcbiAgICAgICAgICAgICAgICBpc0NsYWltZWQgPSBsaXN0ZW5lci5vblRvdWNoQmVnYW4oc2VsVG91Y2gsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGlmIChpc0NsYWltZWQgJiYgbGlzdGVuZXIuX2lzUmVnaXN0ZXJlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuX2NsYWltZWRUb3VjaGVzLnB1c2goc2VsVG91Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYWNyby5FTkFCTEVfTVVMVElfVE9VQ0ggfHwgIWV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoID0gc2VsVG91Y2g7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuX2N1cnJlbnRUb3VjaExpc3RlbmVyID0gbGlzdGVuZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGxpc3RlbmVyLl9jbGFpbWVkVG91Y2hlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZWRJZHggPSBsaXN0ZW5lci5fY2xhaW1lZFRvdWNoZXMuaW5kZXhPZihzZWxUb3VjaCk7XHJcbiAgICAgICAgICAgIGlmIChyZW1vdmVkSWR4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaXNDbGFpbWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmICghbWFjcm8uRU5BQkxFX01VTFRJX1RPVUNIICYmIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoICYmIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoICE9PSBzZWxUb3VjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLk1PVkVEICYmIGxpc3RlbmVyLm9uVG91Y2hNb3ZlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLm9uVG91Y2hNb3ZlZChzZWxUb3VjaCwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkVOREVEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9uVG91Y2hFbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5vblRvdWNoRW5kZWQoc2VsVG91Y2gsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5fY2xhaW1lZFRvdWNoZXMuc3BsaWNlKHJlbW92ZWRJZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hY3JvLkVOQUJMRV9NVUxUSV9UT1VDSCB8fCBldmVudE1hbmFnZXIuX2N1cnJlbnRUb3VjaCA9PT0gc2VsVG91Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLl9jdXJyZW50VG91Y2ggPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLl9jdXJyZW50VG91Y2hMaXN0ZW5lciA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkNBTkNFTExFRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vblRvdWNoQ2FuY2VsbGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLm9uVG91Y2hDYW5jZWxsZWQoc2VsVG91Y2gsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5fY2xhaW1lZFRvdWNoZXMuc3BsaWNlKHJlbW92ZWRJZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hY3JvLkVOQUJMRV9NVUxUSV9UT1VDSCB8fCBldmVudE1hbmFnZXIuX2N1cnJlbnRUb3VjaCA9PT0gc2VsVG91Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLl9jdXJyZW50VG91Y2ggPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLl9jdXJyZW50VG91Y2hMaXN0ZW5lciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBldmVudCB3YXMgc3RvcHBlZCwgcmV0dXJuIGRpcmVjdGx5LlxyXG4gICAgICAgIGlmIChldmVudC5pc1N0b3BwZWQoKSkge1xyXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuX3VwZGF0ZVRvdWNoTGlzdGVuZXJzKGV2ZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNDbGFpbWVkICYmIGxpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSAmJiBsaXN0ZW5lci5zd2FsbG93VG91Y2hlcykge1xyXG4gICAgICAgICAgICBpZiAoYXJnc09iai5uZWVkc011dGFibGVTZXQpIHtcclxuICAgICAgICAgICAgICAgIGFyZ3NPYmoudG91Y2hlcy5zcGxpY2Uoc2VsVG91Y2gsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZGlzcGF0Y2hUb3VjaEV2ZW50IChldmVudDogRXZlbnRUb3VjaCkge1xyXG4gICAgICAgIHRoaXMuX3NvcnRFdmVudExpc3RlbmVycyhMaXN0ZW5lcklELlRPVUNIX09ORV9CWV9PTkUpO1xyXG4gICAgICAgIHRoaXMuX3NvcnRFdmVudExpc3RlbmVycyhMaXN0ZW5lcklELlRPVUNIX0FMTF9BVF9PTkNFKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb25lQnlPbmVMaXN0ZW5lcnMgPSB0aGlzLl9nZXRMaXN0ZW5lcnMoTGlzdGVuZXJJRC5UT1VDSF9PTkVfQllfT05FKTtcclxuICAgICAgICBjb25zdCBhbGxBdE9uY2VMaXN0ZW5lcnMgPSB0aGlzLl9nZXRMaXN0ZW5lcnMoTGlzdGVuZXJJRC5UT1VDSF9BTExfQVRfT05DRSk7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZXJlIGFyZW4ndCBhbnkgdG91Y2ggbGlzdGVuZXJzLCByZXR1cm4gZGlyZWN0bHkuXHJcbiAgICAgICAgaWYgKG51bGwgPT09IG9uZUJ5T25lTGlzdGVuZXJzICYmIG51bGwgPT09IGFsbEF0T25jZUxpc3RlbmVycykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvcmlnaW5hbFRvdWNoZXMgPSBldmVudC5nZXRUb3VjaGVzKCk7XHJcbiAgICAgICAgY29uc3QgbXV0YWJsZVRvdWNoZXMgPSBsZWdhY3lDQy5qcy5hcnJheS5jb3B5KG9yaWdpbmFsVG91Y2hlcyk7XHJcbiAgICAgICAgY29uc3Qgb25lQnlPbmVBcmdzT2JqID0geyBldmVudCwgbmVlZHNNdXRhYmxlU2V0OiAob25lQnlPbmVMaXN0ZW5lcnMgJiYgYWxsQXRPbmNlTGlzdGVuZXJzKSwgdG91Y2hlczogbXV0YWJsZVRvdWNoZXMsIHNlbFRvdWNoOiBudWxsIH07XHJcblxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gcHJvY2VzcyB0aGUgdGFyZ2V0IGhhbmRsZXJzIDFzdFxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgaWYgKG9uZUJ5T25lTGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JpZ2luYWxUb3VjaGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbFRvdWNoID0gb3JpZ2luYWxUb3VjaGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQudG91Y2ggPSBvcmlnaW5hbFRvdWNoO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gZXZlbnQucHJvcGFnYXRpb25JbW1lZGlhdGVTdG9wcGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50VG9MaXN0ZW5lcnMob25lQnlPbmVMaXN0ZW5lcnMsIHRoaXMuX29uVG91Y2hFdmVudENhbGxiYWNrLCBvbmVCeU9uZUFyZ3NPYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIHByb2Nlc3Mgc3RhbmRhcmQgaGFuZGxlcnMgMm5kXHJcbiAgICAgICAgLy9cclxuICAgICAgICBpZiAoYWxsQXRPbmNlTGlzdGVuZXJzICYmIG11dGFibGVUb3VjaGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudFRvTGlzdGVuZXJzKGFsbEF0T25jZUxpc3RlbmVycywgdGhpcy5fb25Ub3VjaGVzRXZlbnRDYWxsYmFjaywgeyBldmVudCwgdG91Y2hlczogbXV0YWJsZVRvdWNoZXMgfSk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5pc1N0b3BwZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVRvdWNoTGlzdGVuZXJzKGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9vblRvdWNoZXNFdmVudENhbGxiYWNrIChsaXN0ZW5lcjogYW55LCBjYWxsYmFja1BhcmFtczogYW55KSB7XHJcbiAgICAgICAgLy8gU2tpcCBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXHJcbiAgICAgICAgaWYgKCFsaXN0ZW5lci5faXNSZWdpc3RlcmVkKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29uc3QgRXZlbnRUb3VjaCA9IGNjLkV2ZW50LkV2ZW50VG91Y2g7XHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBjYWxsYmFja1BhcmFtcy5ldmVudDtcclxuICAgICAgICBjb25zdCB0b3VjaGVzID0gY2FsbGJhY2tQYXJhbXMudG91Y2hlcztcclxuICAgICAgICBjb25zdCBnZXRDb2RlID0gZXZlbnQuZ2V0RXZlbnRDb2RlKCk7XHJcbiAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldCA9IGxpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKTtcclxuICAgICAgICBpZiAoZ2V0Q29kZSA9PT0gRXZlbnRUb3VjaC5CRUdBTiAmJiBsaXN0ZW5lci5vblRvdWNoZXNCZWdhbikge1xyXG4gICAgICAgICAgICBsaXN0ZW5lci5vblRvdWNoZXNCZWdhbih0b3VjaGVzLCBldmVudCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLk1PVkVEICYmIGxpc3RlbmVyLm9uVG91Y2hlc01vdmVkKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uVG91Y2hlc01vdmVkKHRvdWNoZXMsIGV2ZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGdldENvZGUgPT09IEV2ZW50VG91Y2guRU5ERUQgJiYgbGlzdGVuZXIub25Ub3VjaGVzRW5kZWQpIHtcclxuICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaGVzRW5kZWQodG91Y2hlcywgZXZlbnQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZ2V0Q29kZSA9PT0gRXZlbnRUb3VjaC5DQU5DRUxMRUQgJiYgbGlzdGVuZXIub25Ub3VjaGVzQ2FuY2VsbGVkKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uVG91Y2hlc0NhbmNlbGxlZCh0b3VjaGVzLCBldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB0aGUgZXZlbnQgd2FzIHN0b3BwZWQsIHJldHVybiBkaXJlY3RseS5cclxuICAgICAgICBpZiAoZXZlbnQuaXNTdG9wcGVkKCkpIHtcclxuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLl91cGRhdGVUb3VjaExpc3RlbmVycyhldmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYXNzb2NpYXRlTm9kZUFuZEV2ZW50TGlzdGVuZXIgKG5vZGU6IE5vZGUsIGxpc3RlbmVyOiBFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX25vZGVMaXN0ZW5lcnNNYXBbbm9kZS51dWlkXTtcclxuICAgICAgICBpZiAoIWxpc3RlbmVycykge1xyXG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5fbm9kZUxpc3RlbmVyc01hcFtub2RlLnV1aWRdID0gbGlzdGVuZXJzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZGlzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyIChub2RlOiBOb2RlLCBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX25vZGVMaXN0ZW5lcnNNYXBbbm9kZS51dWlkXTtcclxuICAgICAgICBpZiAobGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmpzLmFycmF5LnJlbW92ZShsaXN0ZW5lcnMsIGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ub2RlTGlzdGVuZXJzTWFwW25vZGUudXVpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZGlzcGF0Y2hFdmVudFRvTGlzdGVuZXJzIChsaXN0ZW5lcnM6IF9FdmVudExpc3RlbmVyVmVjdG9yLCBvbkV2ZW50OiBGdW5jdGlvbiwgZXZlbnRPckFyZ3M6IGFueSkge1xyXG4gICAgICAgIGxldCBzaG91bGRTdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBmaXhlZFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKTtcclxuICAgICAgICBjb25zdCBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKCk7XHJcblxyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBpZiAoZml4ZWRQcmlvcml0eUxpc3RlbmVycykgeyAgLy8gcHJpb3JpdHkgPCAwXHJcbiAgICAgICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICg7IGkgPCBsaXN0ZW5lcnMuZ3QwSW5kZXg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbExpc3RlbmVyID0gZml4ZWRQcmlvcml0eUxpc3RlbmVyc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIuaXNFbmFibGVkKCkgJiYgIXNlbExpc3RlbmVyLl9pc1BhdXNlZCgpICYmIHNlbExpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSAmJiBvbkV2ZW50KHNlbExpc3RlbmVyLCBldmVudE9yQXJncykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzICYmICFzaG91bGRTdG9wUHJvcGFnYXRpb24pIHsgICAgLy8gcHJpb3JpdHkgPT0gMCwgc2NlbmUgZ3JhcGggcHJpb3JpdHlcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbExpc3RlbmVyID0gc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyLmlzRW5hYmxlZCgpICYmICFzZWxMaXN0ZW5lci5faXNQYXVzZWQoKSAmJiBzZWxMaXN0ZW5lci5faXNSZWdpc3RlcmVkKCkgJiYgb25FdmVudChzZWxMaXN0ZW5lciwgZXZlbnRPckFyZ3MpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMgJiYgIXNob3VsZFN0b3BQcm9wYWdhdGlvbikgeyAgICAvLyBwcmlvcml0eSA+IDBcclxuICAgICAgICAgICAgZm9yICg7IGkgPCBmaXhlZFByaW9yaXR5TGlzdGVuZXJzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxMaXN0ZW5lciA9IGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIuaXNFbmFibGVkKCkgJiYgIXNlbExpc3RlbmVyLl9pc1BhdXNlZCgpICYmIHNlbExpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSAmJiBvbkV2ZW50KHNlbExpc3RlbmVyLCBldmVudE9yQXJncykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaG91bGRTdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NldERpcnR5IChsaXN0ZW5lcklEOiBzdHJpbmcsIGZsYWcpIHtcclxuICAgICAgICBjb25zdCBsb2NEaXJ0eUZsYWdNYXAgPSB0aGlzLl9wcmlvcml0eURpcnR5RmxhZ01hcDtcclxuICAgICAgICBpZiAobG9jRGlydHlGbGFnTWFwW2xpc3RlbmVySURdID09IG51bGwpIHtcclxuICAgICAgICAgICAgbG9jRGlydHlGbGFnTWFwW2xpc3RlbmVySURdID0gZmxhZztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2NEaXJ0eUZsYWdNYXBbbGlzdGVuZXJJRF0gPSBmbGFnIHwgbG9jRGlydHlGbGFnTWFwW2xpc3RlbmVySURdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zb3J0TnVtYmVyQXNjIChhOiBudW1iZXIsIGI6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBhIC0gYjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lckluQ2FsbGJhY2sgKGxpc3RlbmVyczogRXZlbnRMaXN0ZW5lcltdLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChsaXN0ZW5lcnMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbExpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGlmIChzZWxMaXN0ZW5lci5fb25DdXN0b21FdmVudCA9PT0gY2FsbGJhY2sgfHwgc2VsTGlzdGVuZXIub25FdmVudCA9PT0gY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyLl9zZXRSZWdpc3RlcmVkKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxMaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3NvY2lhdGVOb2RlQW5kRXZlbnRMaXN0ZW5lcihzZWxMaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCksIHNlbExpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBOVUxMIG91dCB0aGUgbm9kZSBwb2ludGVyIHNvIHdlIGRvbid0IGhhdmUgYW55IGRhbmdsaW5nIHBvaW50ZXJzIHRvIGRlc3Ryb3llZCBub2Rlcy5cclxuICAgICAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lci5fc2V0U2NlbmVHcmFwaFByaW9yaXR5KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbkRpc3BhdGNoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVnYWN5Q0MuanMuYXJyYXkucmVtb3ZlQXQobGlzdGVuZXJzLCBpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9SZW1vdmVkTGlzdGVuZXJzLnB1c2goc2VsTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVySW5WZWN0b3IgKGxpc3RlbmVyczogRXZlbnRMaXN0ZW5lcltdLCBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgIGlmIChsaXN0ZW5lcnMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbExpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xyXG4gICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lci5fc2V0UmVnaXN0ZXJlZChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNzb2NpYXRlTm9kZUFuZEV2ZW50TGlzdGVuZXIoc2VsTGlzdGVuZXIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpLCBzZWxMaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTlVMTCBvdXQgdGhlIG5vZGUgcG9pbnRlciBzbyB3ZSBkb24ndCBoYXZlIGFueSBkYW5nbGluZyBwb2ludGVycyB0byBkZXN0cm95ZWQgbm9kZXMuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsTGlzdGVuZXIuX3NldFNjZW5lR3JhcGhQcmlvcml0eShudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faW5EaXNwYXRjaCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZ2FjeUNDLmpzLmFycmF5LnJlbW92ZUF0KGxpc3RlbmVycywgaSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVtb3ZlZExpc3RlbmVycy5wdXNoKHNlbExpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGlzIGNsYXNzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYHN5c3RlbUV2ZW50YCBvciBgRXZlbnRUYXJnZXRgIGluc3RlYWQuXHJcbiAqIFNlZSBbTGlzdGVuIHRvIGFuZCBsYXVuY2ggZXZlbnRzXSguLi8uLi8uLi9tYW51YWwvZW4vc2NyaXB0aW5nL2V2ZW50cy5tZCkgZm9yIGRldGFpbHMuPGJyPlxyXG4gKiA8YnI+XHJcbiAqIGBldmVudE1hbmFnZXJgIGlzIGEgc2luZ2xldG9uIG9iamVjdCB3aGljaCBtYW5hZ2VzIGV2ZW50IGxpc3RlbmVyIHN1YnNjcmlwdGlvbnMgYW5kIGV2ZW50IGRpc3BhdGNoaW5nLlxyXG4gKiBUaGUgRXZlbnRMaXN0ZW5lciBsaXN0IGlzIG1hbmFnZWQgaW4gc3VjaCB3YXkgc28gdGhhdCBldmVudCBsaXN0ZW5lcnMgY2FuIGJlIGFkZGVkIGFuZCByZW1vdmVkXHJcbiAqIHdoaWxlIGV2ZW50cyBhcmUgYmVpbmcgZGlzcGF0Y2hlZC5cclxuICpcclxuICogQHpoXHJcbiAqIOivpeexu+W3suW6n+W8g++8jOivt+S9v+eUqCBgc3lzdGVtRXZlbnRgIOaIliBgRXZlbnRUYXJnZXRgIOS7o+abv++8jOivpuingSBb55uR5ZCs5ZKM5Y+R5bCE5LqL5Lu2XSguLi8uLi8uLi9tYW51YWwvemgvc2NyaXB0aW5nL2V2ZW50cy5tZCnjgII8YnI+XHJcbiAqIDxicj5cclxuICog5LqL5Lu2566h55CG5Zmo77yM5a6D5Li76KaB566h55CG5LqL5Lu255uR5ZCs5Zmo5rOo5YaM5ZKM5rS+5Y+R57O757uf5LqL5Lu244CCXHJcbiAqXHJcbiAqIEBjbGFzcyBldmVudE1hbmFnZXJcclxuICogQHN0YXRpY1xyXG4gKiBAZXhhbXBsZSB7QGxpbmsgY29jb3MvY29yZS9ldmVudC1tYW5hZ2VyL0NDRXZlbnRNYW5hZ2VyL2FkZExpc3RlbmVyLmpzfVxyXG4gKiBAZGVwcmVjYXRlZFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGV2ZW50TWFuYWdlciA9IG5ldyBFdmVudE1hbmFnZXIoKTtcclxuXHJcbmxlZ2FjeUNDLmV2ZW50TWFuYWdlciA9IGV2ZW50TWFuYWdlcjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGV2ZW50TWFuYWdlcjtcclxuIl19