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
var js = require('../platform/js');
require('./CCEventListener');
var ListenerID = cc.EventListener.ListenerID;

var _EventListenerVector = function () {
    this._fixedListeners = [];
    this._sceneGraphListeners = [];
    this.gt0Index = 0;
};
_EventListenerVector.prototype = {
    constructor: _EventListenerVector,
    size: function () {
        return this._fixedListeners.length + this._sceneGraphListeners.length;
    },

    empty: function () {
        return (this._fixedListeners.length === 0) && (this._sceneGraphListeners.length === 0);
    },

    push: function (listener) {
        if (listener._getFixedPriority() === 0)
            this._sceneGraphListeners.push(listener);
        else
            this._fixedListeners.push(listener);
    },

    clearSceneGraphListeners: function () {
        this._sceneGraphListeners.length = 0;
    },

    clearFixedListeners: function () {
        this._fixedListeners.length = 0;
    },

    clear: function () {
        this._sceneGraphListeners.length = 0;
        this._fixedListeners.length = 0;
    },

    getFixedPriorityListeners: function () {
        return this._fixedListeners;
    },

    getSceneGraphPriorityListeners: function () {
        return this._sceneGraphListeners;
    }
};

var __getListenerID = function (event) {
    var eventType = cc.Event, type = event.type;
    if (type === eventType.ACCELERATION)
        return ListenerID.ACCELERATION;
    if (type === eventType.KEYBOARD)
        return ListenerID.KEYBOARD;
    if (type.startsWith(eventType.MOUSE))
        return ListenerID.MOUSE;
    if (type.startsWith(eventType.TOUCH)){
        // Touch listener is very special, it contains two kinds of listeners, EventListenerTouchOneByOne and EventListenerTouchAllAtOnce.
        // return UNKNOWN instead.
        cc.logID(2000);
    }
    return "";
};

/**
 * !#en
 * This class has been deprecated, please use cc.systemEvent or cc.EventTarget instead. See [Listen to and launch events](../../../manual/en/scripting/events.md) for details.<br>
 * <br>
 * cc.eventManager is a singleton object which manages event listener subscriptions and event dispatching.
 * The EventListener list is managed in such way so that event listeners can be added and removed
 * while events are being dispatched.
 *
 * !#zh
 * 该类已废弃，请使用 cc.systemEvent 或 cc.EventTarget 代替，详见 [监听和发射事件](../../../manual/zh/scripting/events.md)。<br>
 * <br>
 * 事件管理器，它主要管理事件监听器注册和派发系统事件。
 *
 * @class eventManager
 * @static
 * @example {@link cocos2d/core/event-manager/CCEventManager/addListener.js}
 * @deprecated
 */
var eventManager = {
    //Priority dirty flag
    DIRTY_NONE: 0,
    DIRTY_FIXED_PRIORITY: 1 << 0,
    DIRTY_SCENE_GRAPH_PRIORITY: 1 << 1,
    DIRTY_ALL: 3,
    
    _listenersMap: {},
    _priorityDirtyFlagMap: {},
    _nodeListenersMap: {},
    _toAddedListeners: [],
    _toRemovedListeners: [],
    _dirtyListeners: {},
    _inDispatch: 0,
    _isEnabled: false,

    _internalCustomListenerIDs:[],

    _setDirtyForNode: function (node) {
        // Mark the node dirty only when there is an event listener associated with it.
        let selListeners = this._nodeListenersMap[node._id];
        if (selListeners !== undefined) {
            for (var j = 0, len = selListeners.length; j < len; j++) {
                let selListener = selListeners[j];
                let listenerID = selListener._getListenerID();
                if (this._dirtyListeners[listenerID] == null)
                    this._dirtyListeners[listenerID] = true;
            }
        }
        if (node.getChildren) {
            var _children = node.getChildren();
            for(var i = 0, len = _children ? _children.length : 0; i < len; i++)
                this._setDirtyForNode(_children[i]);
        }
    },

    /**
     * !#en Pauses all listeners which are associated the specified target.
     * !#zh 暂停传入的 node 相关的所有监听器的事件响应。
     * @method pauseTarget
     * @param {Node} node
     * @param {Boolean} [recursive=false]
     */
    pauseTarget: function (node, recursive) {
        if (!(node instanceof cc._BaseNode)) {
            cc.warnID(3506);
            return;
        }
        var listeners = this._nodeListenersMap[node._id], i, len;
        if (listeners) {
            for (i = 0, len = listeners.length; i < len; i++)
                listeners[i]._setPaused(true);
        }
        if (recursive === true) {
            var locChildren = node.getChildren();
            for (i = 0, len = locChildren ? locChildren.length : 0; i < len; i++)
                this.pauseTarget(locChildren[i], true);
        }
    },

    /**
     * !#en Resumes all listeners which are associated the specified target.
     * !#zh 恢复传入的 node 相关的所有监听器的事件响应。
     * @method resumeTarget
     * @param {Node} node
     * @param {Boolean} [recursive=false]
     */
    resumeTarget: function (node, recursive) {
        if (!(node instanceof cc._BaseNode)) {
            cc.warnID(3506);
            return;
        }
        var listeners = this._nodeListenersMap[node._id], i, len;
        if (listeners){
            for ( i = 0, len = listeners.length; i < len; i++)
                listeners[i]._setPaused(false);
        }
        this._setDirtyForNode(node);
        if (recursive === true && node.getChildren) {
            var locChildren = node.getChildren();
            for (i = 0, len = locChildren ? locChildren.length : 0; i < len; i++)
                this.resumeTarget(locChildren[i], true);
        }
    },

    _addListener: function (listener) {
        if (this._inDispatch === 0)
            this._forceAddEventListener(listener);
        else
            this._toAddedListeners.push(listener);
    },

    _forceAddEventListener: function (listener) {
        var listenerID = listener._getListenerID();
        var listeners = this._listenersMap[listenerID];
        if (!listeners) {
            listeners = new _EventListenerVector();
            this._listenersMap[listenerID] = listeners;
        }
        listeners.push(listener);

        if (listener._getFixedPriority() === 0) {
            this._setDirty(listenerID, this.DIRTY_SCENE_GRAPH_PRIORITY);

            var node = listener._getSceneGraphPriority();
            if (node === null)
                cc.logID(3507);

            this._associateNodeAndEventListener(node, listener);
            if (node.activeInHierarchy)
                this.resumeTarget(node);
        } else
            this._setDirty(listenerID, this.DIRTY_FIXED_PRIORITY);
    },

    _getListeners: function (listenerID) {
        return this._listenersMap[listenerID];
    },

    _updateDirtyFlagForSceneGraph: function () {
        let locDirtyListeners = this._dirtyListeners
        for (var selKey in locDirtyListeners) {
            this._setDirty(selKey, this.DIRTY_SCENE_GRAPH_PRIORITY);
        }

        this._dirtyListeners = {};
    },

    _removeAllListenersInVector: function (listenerVector) {
        if (!listenerVector)
            return;
        var selListener;
        for (var i = listenerVector.length - 1; i >= 0; i--) {
            selListener = listenerVector[i];
            selListener._setRegistered(false);
            if (selListener._getSceneGraphPriority() != null) {
                this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);
                selListener._setSceneGraphPriority(null);   // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.
            }

            if (this._inDispatch === 0)
                cc.js.array.removeAt(listenerVector, i);
        }
    },

    _removeListenersForListenerID: function (listenerID) {
        var listeners = this._listenersMap[listenerID], i;
        if (listeners) {
            var fixedPriorityListeners = listeners.getFixedPriorityListeners();
            var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

            this._removeAllListenersInVector(sceneGraphPriorityListeners);
            this._removeAllListenersInVector(fixedPriorityListeners);

            // Remove the dirty flag according the 'listenerID'.
            // No need to check whether the dispatcher is dispatching event.
            delete this._priorityDirtyFlagMap[listenerID];

            if (!this._inDispatch) {
                listeners.clear();
                delete this._listenersMap[listenerID];
            }
        }

        var locToAddedListeners = this._toAddedListeners, listener;
        for (i = locToAddedListeners.length - 1; i >= 0; i--) {
            listener = locToAddedListeners[i];
            if (listener && listener._getListenerID() === listenerID)
                cc.js.array.removeAt(locToAddedListeners, i);
        }
    },

    _sortEventListeners: function (listenerID) {
        var dirtyFlag = this.DIRTY_NONE, locFlagMap = this._priorityDirtyFlagMap;
        if (locFlagMap[listenerID])
            dirtyFlag = locFlagMap[listenerID];
        
        if (dirtyFlag !== this.DIRTY_NONE) {
            // Clear the dirty flag first, if `rootNode` is null, then set its dirty flag of scene graph priority
            locFlagMap[listenerID] = this.DIRTY_NONE;

            if (dirtyFlag & this.DIRTY_FIXED_PRIORITY)
                this._sortListenersOfFixedPriority(listenerID);

            if (dirtyFlag & this.DIRTY_SCENE_GRAPH_PRIORITY){
                var rootEntity = cc.director.getScene();
                if(rootEntity)
                    this._sortListenersOfSceneGraphPriority(listenerID);
            }
        }
    },

    _sortListenersOfSceneGraphPriority: function (listenerID) {
        var listeners = this._getListeners(listenerID);
        if (!listeners)
            return;

        var sceneGraphListener = listeners.getSceneGraphPriorityListeners();
        if (!sceneGraphListener || sceneGraphListener.length === 0)
            return;

        // After sort: priority < 0, > 0
        listeners.getSceneGraphPriorityListeners().sort(this._sortEventListenersOfSceneGraphPriorityDes);
    },

    _sortEventListenersOfSceneGraphPriorityDes: function (l1, l2) {
        let node1 = l1._getSceneGraphPriority(),
            node2 = l2._getSceneGraphPriority();

        if (!l2 || !node2 || !node2._activeInHierarchy || node2._parent === null)
            return -1;
        else if (!l1 || !node1 || !node1._activeInHierarchy || node1._parent === null)
            return 1;
        
        let p1 = node1, p2 = node2, ex = false;
        while (p1._parent._id !== p2._parent._id) {
            p1 = p1._parent._parent === null ? (ex = true) && node2 : p1._parent;
            p2 = p2._parent._parent === null ? (ex = true) && node1 : p2._parent;
        }

        if (p1._id === p2._id) {
            if (p1._id === node2._id) 
                return -1;
            if (p1._id === node1._id)
                return 1;
        }

        return ex ? p1._localZOrder - p2._localZOrder : p2._localZOrder - p1._localZOrder;
    },

    _sortListenersOfFixedPriority: function (listenerID) {
        var listeners = this._listenersMap[listenerID];
        if (!listeners)
            return;

        var fixedListeners = listeners.getFixedPriorityListeners();
        if(!fixedListeners || fixedListeners.length === 0)
            return;
        // After sort: priority < 0, > 0
        fixedListeners.sort(this._sortListenersOfFixedPriorityAsc);

        // FIXME: Should use binary search
        var index = 0;
        for (var len = fixedListeners.length; index < len;) {
            if (fixedListeners[index]._getFixedPriority() >= 0)
                break;
            ++index;
        }
        listeners.gt0Index = index;
    },

    _sortListenersOfFixedPriorityAsc: function (l1, l2) {
        return l1._getFixedPriority() - l2._getFixedPriority();
    },

    _onUpdateListeners: function (listeners) {
        var fixedPriorityListeners = listeners.getFixedPriorityListeners();
        var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
        var i, selListener, idx, toRemovedListeners = this._toRemovedListeners;

        if (sceneGraphPriorityListeners) {
            for (i = sceneGraphPriorityListeners.length - 1; i >= 0; i--) {
                selListener = sceneGraphPriorityListeners[i];
                if (!selListener._isRegistered()) {
                    cc.js.array.removeAt(sceneGraphPriorityListeners, i);
                    // if item in toRemove list, remove it from the list
                    idx = toRemovedListeners.indexOf(selListener);
                    if(idx !== -1)
                        toRemovedListeners.splice(idx, 1);
                }
            }
        }

        if (fixedPriorityListeners) {
            for (i = fixedPriorityListeners.length - 1; i >= 0; i--) {
                selListener = fixedPriorityListeners[i];
                if (!selListener._isRegistered()) {
                    cc.js.array.removeAt(fixedPriorityListeners, i);
                    // if item in toRemove list, remove it from the list
                    idx = toRemovedListeners.indexOf(selListener);
                    if(idx !== -1)
                        toRemovedListeners.splice(idx, 1);
                }
            }
        }

        if (sceneGraphPriorityListeners && sceneGraphPriorityListeners.length === 0)
            listeners.clearSceneGraphListeners();

        if (fixedPriorityListeners && fixedPriorityListeners.length === 0)
            listeners.clearFixedListeners();
    },

    frameUpdateListeners: function () {
        var locListenersMap = this._listenersMap, locPriorityDirtyFlagMap = this._priorityDirtyFlagMap;
        for (var selKey in locListenersMap) {
            if (locListenersMap[selKey].empty()) {
                delete locPriorityDirtyFlagMap[selKey];
                delete locListenersMap[selKey];
            }
        }

        var locToAddedListeners = this._toAddedListeners;
        if (locToAddedListeners.length !== 0) {
            for (var i = 0, len = locToAddedListeners.length; i < len; i++)
                this._forceAddEventListener(locToAddedListeners[i]);
            locToAddedListeners.length = 0;
        }
        if (this._toRemovedListeners.length !== 0) {
            this._cleanToRemovedListeners();
        }
    },

    _updateTouchListeners: function (event) {
        var locInDispatch = this._inDispatch;
        cc.assertID(locInDispatch > 0, 3508);

        if (locInDispatch > 1)
            return;

        var listeners;
        listeners = this._listenersMap[ListenerID.TOUCH_ONE_BY_ONE];
        if (listeners) {
            this._onUpdateListeners(listeners);
        }
        listeners = this._listenersMap[ListenerID.TOUCH_ALL_AT_ONCE];
        if (listeners) {
            this._onUpdateListeners(listeners);
        }

        cc.assertID(locInDispatch === 1, 3509);

        var locToAddedListeners = this._toAddedListeners;
        if (locToAddedListeners.length !== 0) {
            for (var i = 0, len = locToAddedListeners.length; i < len; i++)
                this._forceAddEventListener(locToAddedListeners[i]);
            this._toAddedListeners.length = 0;
        }

        if (this._toRemovedListeners.length !== 0) {
            this._cleanToRemovedListeners();
        }
    },

    //Remove all listeners in _toRemoveListeners list and cleanup
    _cleanToRemovedListeners: function () {
        var toRemovedListeners = this._toRemovedListeners;
        for (var i = 0; i < toRemovedListeners.length; i++) {
            var selListener = toRemovedListeners[i];
            var listeners = this._listenersMap[selListener._getListenerID()];
            if (!listeners)
                continue;

            var idx, fixedPriorityListeners = listeners.getFixedPriorityListeners(),
                sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

            if (sceneGraphPriorityListeners) {
                idx = sceneGraphPriorityListeners.indexOf(selListener);
                if (idx !== -1) {
                    sceneGraphPriorityListeners.splice(idx, 1);
                }
            }
            if (fixedPriorityListeners) {
                idx = fixedPriorityListeners.indexOf(selListener);
                if (idx !== -1) {
                    fixedPriorityListeners.splice(idx, 1);
                }
            }
        }
        toRemovedListeners.length = 0;
    },

    _onTouchEventCallback: function (listener, argsObj) {
        // Skip if the listener was removed.
        if (!listener._isRegistered())
            return false;

        var event = argsObj.event, selTouch = event.currentTouch;
        event.currentTarget = listener._node;

        var isClaimed = false, removedIdx;
        var getCode = event.getEventCode(), EventTouch = cc.Event.EventTouch;
        if (getCode === EventTouch.BEGAN) {
            if (listener.onTouchBegan) {
                isClaimed = listener.onTouchBegan(selTouch, event);
                if (isClaimed && listener._registered)
                    listener._claimedTouches.push(selTouch);
            }
        } else if (listener._claimedTouches.length > 0
            && ((removedIdx = listener._claimedTouches.indexOf(selTouch)) !== -1)) {
            isClaimed = true;
            if (getCode === EventTouch.MOVED && listener.onTouchMoved) {
                listener.onTouchMoved(selTouch, event);
            } else if (getCode === EventTouch.ENDED) {
                if (listener.onTouchEnded)
                    listener.onTouchEnded(selTouch, event);
                if (listener._registered)
                    listener._claimedTouches.splice(removedIdx, 1);
            } else if (getCode === EventTouch.CANCELLED) {
                if (listener.onTouchCancelled)
                    listener.onTouchCancelled(selTouch, event);
                if (listener._registered)
                    listener._claimedTouches.splice(removedIdx, 1);
            }
        }

        // If the event was stopped, return directly.
        if (event.isStopped()) {
            eventManager._updateTouchListeners(event);
            return true;
        }

        if (isClaimed && listener.swallowTouches) {
            if (argsObj.needsMutableSet)
                argsObj.touches.splice(selTouch, 1);
            return true;
        }
        return false;
    },

    _dispatchTouchEvent: function (event) {
        this._sortEventListeners(ListenerID.TOUCH_ONE_BY_ONE);
        this._sortEventListeners(ListenerID.TOUCH_ALL_AT_ONCE);

        var oneByOneListeners = this._getListeners(ListenerID.TOUCH_ONE_BY_ONE);
        var allAtOnceListeners = this._getListeners(ListenerID.TOUCH_ALL_AT_ONCE);

        // If there aren't any touch listeners, return directly.
        if (null === oneByOneListeners && null === allAtOnceListeners)
            return;

        var originalTouches = event.getTouches(), mutableTouches = cc.js.array.copy(originalTouches);
        var oneByOneArgsObj = {event: event, needsMutableSet: (oneByOneListeners && allAtOnceListeners), touches: mutableTouches, selTouch: null};

        //
        // process the target handlers 1st
        //
        if (oneByOneListeners) {
            for (var i = 0; i < originalTouches.length; i++) {
                event.currentTouch = originalTouches[i];
                event._propagationStopped = event._propagationImmediateStopped = false;
                this._dispatchEventToListeners(oneByOneListeners, this._onTouchEventCallback, oneByOneArgsObj);
            }
        }

        //
        // process standard handlers 2nd
        //
        if (allAtOnceListeners && mutableTouches.length > 0) {
            this._dispatchEventToListeners(allAtOnceListeners, this._onTouchesEventCallback, {event: event, touches: mutableTouches});
            if (event.isStopped())
                return;
        }
        this._updateTouchListeners(event);
    },

    _onTouchesEventCallback: function (listener, callbackParams) {
        // Skip if the listener was removed.
        if (!listener._registered)
            return false;

        var EventTouch = cc.Event.EventTouch, event = callbackParams.event, touches = callbackParams.touches, getCode = event.getEventCode();
        event.currentTarget = listener._node;
        if (getCode === EventTouch.BEGAN && listener.onTouchesBegan)
            listener.onTouchesBegan(touches, event);
        else if (getCode === EventTouch.MOVED && listener.onTouchesMoved)
            listener.onTouchesMoved(touches, event);
        else if (getCode === EventTouch.ENDED && listener.onTouchesEnded)
            listener.onTouchesEnded(touches, event);
        else if (getCode === EventTouch.CANCELLED && listener.onTouchesCancelled)
            listener.onTouchesCancelled(touches, event);

        // If the event was stopped, return directly.
        if (event.isStopped()) {
            eventManager._updateTouchListeners(event);
            return true;
        }
        return false;
    },

    _associateNodeAndEventListener: function (node, listener) {
        var listeners = this._nodeListenersMap[node._id];
        if (!listeners) {
            listeners = [];
            this._nodeListenersMap[node._id] = listeners;
        }
        listeners.push(listener);
    },

    _dissociateNodeAndEventListener: function (node, listener) {
        var listeners = this._nodeListenersMap[node._id];
        if (listeners) {
            cc.js.array.remove(listeners, listener);
            if (listeners.length === 0)
                delete this._nodeListenersMap[node._id];
        }
    },

    _dispatchEventToListeners: function (listeners, onEvent, eventOrArgs) {
        var shouldStopPropagation = false;
        var fixedPriorityListeners = listeners.getFixedPriorityListeners();
        var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

        var i = 0, j, selListener;
        if (fixedPriorityListeners) {  // priority < 0
            if (fixedPriorityListeners.length !== 0) {
                for (; i < listeners.gt0Index; ++i) {
                    selListener = fixedPriorityListeners[i];
                    if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
                        shouldStopPropagation = true;
                        break;
                    }
                }
            }
        }

        if (sceneGraphPriorityListeners && !shouldStopPropagation) {    // priority == 0, scene graph priority
            for (j = 0; j < sceneGraphPriorityListeners.length; j++) {
                selListener = sceneGraphPriorityListeners[j];
                if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
                    shouldStopPropagation = true;
                    break;
                }
            }
        }

        if (fixedPriorityListeners && !shouldStopPropagation) {    // priority > 0
            for (; i < fixedPriorityListeners.length; ++i) {
                selListener = fixedPriorityListeners[i];
                if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
                    shouldStopPropagation = true;
                    break;
                }
            }
        }
    },

    _setDirty: function (listenerID, flag) {
        var locDirtyFlagMap = this._priorityDirtyFlagMap;
        if (locDirtyFlagMap[listenerID] == null)
            locDirtyFlagMap[listenerID] = flag;
        else
            locDirtyFlagMap[listenerID] = flag | locDirtyFlagMap[listenerID];
    },

    _sortNumberAsc: function (a, b) {
        return a - b;
    },

    /**
     * !#en Query whether the specified event listener id has been added.
     * !#zh 查询指定的事件 ID 是否存在
     * @method hasEventListener
     * @param {String|Number} listenerID - The listener id.
     * @return {Boolean} true or false
     */
    hasEventListener: function (listenerID) {
        return !!this._getListeners(listenerID);
    },

    /**
     * !#en
     * <p>
     * Adds a event listener for a specified event.<br/>
     * if the parameter "nodeOrPriority" is a node,
     * it means to add a event listener for a specified event with the priority of scene graph.<br/>
     * if the parameter "nodeOrPriority" is a Number,
     * it means to add a event listener for a specified event with the fixed priority.<br/>
     * </p>
     * !#zh
     * 将事件监听器添加到事件管理器中。<br/>
     * 如果参数 “nodeOrPriority” 是节点，优先级由 node 的渲染顺序决定，显示在上层的节点将优先收到事件。<br/>
     * 如果参数 “nodeOrPriority” 是数字，优先级则固定为该参数的数值，数字越小，优先级越高。<br/>
     *
     * @method addListener
     * @param {EventListener|Object} listener - The listener of a specified event or a object of some event parameters.
     * @param {Node|Number} nodeOrPriority - The priority of the listener is based on the draw order of this node or fixedPriority The fixed priority of the listener.
     * @note  The priority of scene graph will be fixed value 0. So the order of listener item in the vector will be ' <0, scene graph (0 priority), >0'.
     *         A lower priority will be called before the ones that have a higher value. 0 priority is forbidden for fixed priority since it's used for scene graph based priority.
     *         The listener must be a cc.EventListener object when adding a fixed priority listener, because we can't remove a fixed priority listener without the listener handler,
     *         except calls removeAllListeners().
     * @return {EventListener} Return the listener. Needed in order to remove the event from the dispatcher.
     */
    addListener: function (listener, nodeOrPriority) {
        cc.assertID(listener && nodeOrPriority, 3503);
        if (!(cc.js.isNumber(nodeOrPriority) || nodeOrPriority instanceof cc._BaseNode)) {
            cc.warnID(3506);
            return;
        }
        if (!(listener instanceof cc.EventListener)) {
            cc.assertID(!cc.js.isNumber(nodeOrPriority), 3504);
            listener = cc.EventListener.create(listener);
        } else {
            if (listener._isRegistered()) {
                cc.logID(3505);
                return;
            }
        }

        if (!listener.checkAvailable())
            return;

        if (cc.js.isNumber(nodeOrPriority)) {
            if (nodeOrPriority === 0) {
                cc.logID(3500);
                return;
            }

            listener._setSceneGraphPriority(null);
            listener._setFixedPriority(nodeOrPriority);
            listener._setRegistered(true);
            listener._setPaused(false);
            this._addListener(listener);
        } else {
            listener._setSceneGraphPriority(nodeOrPriority);
            listener._setFixedPriority(0);
            listener._setRegistered(true);
            this._addListener(listener);
        }

        return listener;
    },

    /*
     * !#en Adds a Custom event listener. It will use a fixed priority of 1.
     * !#zh 向事件管理器添加一个自定义事件监听器。
     * @method addCustomListener
     * @param {String} eventName
     * @param {Function} callback
     * @return {EventListener} the generated event. Needed in order to remove the event from the dispatcher
     */
    addCustomListener: function (eventName, callback) {
        var listener = new cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: eventName, 
            callback: callback
        });
        this.addListener(listener, 1);
        return listener;
    },

    /**
     * !#en Remove a listener.
     * !#zh 移除一个已添加的监听器。
     * @method removeListener
     * @param {EventListener} listener - an event listener or a registered node target
     * @example {@link cocos2d/core/event-manager/CCEventManager/removeListener.js}
     */
    removeListener: function (listener) {
        if (listener == null)
            return;

        var isFound, locListener = this._listenersMap;
        for (var selKey in locListener) {
            var listeners = locListener[selKey];
            var fixedPriorityListeners = listeners.getFixedPriorityListeners(), sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

            isFound = this._removeListenerInVector(sceneGraphPriorityListeners, listener);
            if (isFound){
                // fixed #4160: Dirty flag need to be updated after listeners were removed.
                this._setDirty(listener._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY);
            }else{
                isFound = this._removeListenerInVector(fixedPriorityListeners, listener);
                if (isFound)
                    this._setDirty(listener._getListenerID(), this.DIRTY_FIXED_PRIORITY);
            }

            if (listeners.empty()) {
                delete this._priorityDirtyFlagMap[listener._getListenerID()];
                delete locListener[selKey];
            }

            if (isFound)
                break;
        }

        if (!isFound) {
            var locToAddedListeners = this._toAddedListeners;
            for (var i = locToAddedListeners.length - 1; i >= 0; i--) {
                var selListener = locToAddedListeners[i];
                if (selListener === listener) {
                    cc.js.array.removeAt(locToAddedListeners, i);
                    selListener._setRegistered(false);
                    break;
                }
            }
        }
    },

    _removeListenerInCallback: function(listeners, callback){
        if (listeners == null)
            return false;

        for (var i = listeners.length - 1; i >= 0; i--) {
            var selListener = listeners[i];
            if (selListener._onCustomEvent === callback || selListener._onEvent === callback) {
                selListener._setRegistered(false);
                if (selListener._getSceneGraphPriority() != null){
                    this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);
                    selListener._setSceneGraphPriority(null);         // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.
                }

                if (this._inDispatch === 0)
                    cc.js.array.removeAt(listeners, i);
                else
                    this._toRemovedListeners.push(selListener);
                return true;
            }
        }
        return false;
    },

    _removeListenerInVector: function (listeners, listener) {
        if (listeners == null)
            return false;

        for (var i = listeners.length - 1; i >= 0; i--) {
            var selListener = listeners[i];
            if (selListener === listener) {
                selListener._setRegistered(false);
                if (selListener._getSceneGraphPriority() != null) {
                    this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);
                    selListener._setSceneGraphPriority(null);         // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.
                }

                if (this._inDispatch === 0)
                    cc.js.array.removeAt(listeners, i);
                else
                    this._toRemovedListeners.push(selListener);
                return true;
            }
        }
        return false;
    },

    /**
     * !#en Removes all listeners with the same event listener type or removes all listeners of a node.
     * !#zh
     * 移除注册到 eventManager 中指定类型的所有事件监听器。<br/>
     * 1. 如果传入的第一个参数类型是 Node，那么事件管理器将移除与该对象相关的所有事件监听器。
     * （如果第二参数 recursive 是 true 的话，就会连同该对象的子控件上所有的事件监听器也一并移除）<br/>
     * 2. 如果传入的第一个参数类型是 Number（该类型 EventListener 中定义的事件类型），
     * 那么事件管理器将移除该类型的所有事件监听器。<br/>
     *
     * 下列是目前存在监听器类型：       <br/>
     * cc.EventListener.UNKNOWN       <br/>
     * cc.EventListener.KEYBOARD      <br/>
     * cc.EventListener.ACCELERATION，<br/>
     *
     * @method removeListeners
     * @param {Number|Node} listenerType - listenerType or a node
     * @param {Boolean} [recursive=false]
     */
    removeListeners: function (listenerType, recursive) {
        var i, _t = this;
        if (!(cc.js.isNumber(listenerType) || listenerType instanceof cc._BaseNode)) {
            cc.warnID(3506);
            return;
        }
        if (listenerType._id !== undefined) {
            // Ensure the node is removed from these immediately also.
            // Don't want any dangling pointers or the possibility of dealing with deleted objects..
            var listeners = _t._nodeListenersMap[listenerType._id], i;
            if (listeners) {
                var listenersCopy = cc.js.array.copy(listeners);
                for (i = 0; i < listenersCopy.length; i++)
                    _t.removeListener(listenersCopy[i]);
                delete _t._nodeListenersMap[listenerType._id];
            }

            // Bug fix: ensure there are no references to the node in the list of listeners to be added.
            // If we find any listeners associated with the destroyed node in this list then remove them.
            // This is to catch the scenario where the node gets destroyed before it's listener
            // is added into the event dispatcher fully. This could happen if a node registers a listener
            // and gets destroyed while we are dispatching an event (touch etc.)
            var locToAddedListeners = _t._toAddedListeners;
            for (i = 0; i < locToAddedListeners.length; ) {
                var listener = locToAddedListeners[i];
                if (listener._getSceneGraphPriority() === listenerType) {
                    listener._setSceneGraphPriority(null);                      // Ensure no dangling ptr to the target node.
                    listener._setRegistered(false);
                    locToAddedListeners.splice(i, 1);
                } else
                    ++i;
            }

            if (recursive === true) {
                var locChildren = listenerType.getChildren(), len;
                for (i = 0, len = locChildren.length; i< len; i++)
                    _t.removeListeners(locChildren[i], true);
            }
        } else {
            if (listenerType === cc.EventListener.TOUCH_ONE_BY_ONE)
                _t._removeListenersForListenerID(ListenerID.TOUCH_ONE_BY_ONE);
            else if (listenerType === cc.EventListener.TOUCH_ALL_AT_ONCE)
                _t._removeListenersForListenerID(ListenerID.TOUCH_ALL_AT_ONCE);
            else if (listenerType === cc.EventListener.MOUSE)
                _t._removeListenersForListenerID(ListenerID.MOUSE);
            else if (listenerType === cc.EventListener.ACCELERATION)
                _t._removeListenersForListenerID(ListenerID.ACCELERATION);
            else if (listenerType === cc.EventListener.KEYBOARD)
                _t._removeListenersForListenerID(ListenerID.KEYBOARD);
            else
                cc.logID(3501);
        }
    },

    /*
     * !#en Removes all custom listeners with the same event name.
     * !#zh 移除同一事件名的自定义事件监听器。
     * @method removeCustomListeners
     * @param {String} customEventName
     */
    removeCustomListeners: function (customEventName) {
        this._removeListenersForListenerID(customEventName);
    },

    /**
     * !#en Removes all listeners
     * !#zh 移除所有事件监听器。
     * @method removeAllListeners
     */
    removeAllListeners: function () {
        var locListeners = this._listenersMap, locInternalCustomEventIDs = this._internalCustomListenerIDs;
        for (var selKey in locListeners){
            if(locInternalCustomEventIDs.indexOf(selKey) === -1)
                this._removeListenersForListenerID(selKey);
        }
    },

    /**
     * !#en Sets listener's priority with fixed value.
     * !#zh 设置 FixedPriority 类型监听器的优先级。
     * @method setPriority
     * @param {EventListener} listener
     * @param {Number} fixedPriority
     */
    setPriority: function (listener, fixedPriority) {
        if (listener == null)
            return;

        var locListeners = this._listenersMap;
        for (var selKey in locListeners) {
            var selListeners = locListeners[selKey];
            var fixedPriorityListeners = selListeners.getFixedPriorityListeners();
            if (fixedPriorityListeners) {
                var found = fixedPriorityListeners.indexOf(listener);
                if (found !== -1) {
                    if(listener._getSceneGraphPriority() != null)
                        cc.logID(3502);
                    if (listener._getFixedPriority() !== fixedPriority) {
                        listener._setFixedPriority(fixedPriority);
                        this._setDirty(listener._getListenerID(), this.DIRTY_FIXED_PRIORITY);
                    }
                    return;
                }
            }
        }
    },

    /**
     * !#en Whether to enable dispatching events
     * !#zh 启用或禁用事件管理器，禁用后不会分发任何事件。
     * @method setEnabled
     * @param {Boolean} enabled
     */
    setEnabled: function (enabled) {
        this._isEnabled = enabled;
    },

    /**
     * !#en Checks whether dispatching events is enabled
     * !#zh 检测事件管理器是否启用。
     * @method isEnabled
     * @returns {Boolean}
     */
    isEnabled: function () {
        return this._isEnabled;
    },

    /*
     * !#en Dispatches the event, also removes all EventListeners marked for deletion from the event dispatcher list.
     * !#zh 分发事件。
     * @method dispatchEvent
     * @param {Event} event
     */
    dispatchEvent: function (event) {
        if (!this._isEnabled)
            return;

        this._updateDirtyFlagForSceneGraph();
        this._inDispatch++;
        if (!event || !event.getType) {
            cc.errorID(3511);
            return;
        }
        if (event.getType().startsWith(cc.Event.TOUCH)) {
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
    },

    _onListenerCallback: function(listener, event){
        event.currentTarget = listener._target;
        listener._onEvent(event);
        return event.isStopped();
    },

    /*
     * !#en Dispatches a Custom Event with a event name an optional user data
     * !#zh 分发自定义事件。
     * @method dispatchCustomEvent
     * @param {String} eventName
     * @param {*} optionalUserData
     */
    dispatchCustomEvent: function (eventName, optionalUserData) {
        var ev = new cc.Event.EventCustom(eventName);
        ev.setUserData(optionalUserData);
        this.dispatchEvent(ev);
    }
};


js.get(cc, 'eventManager', function () {
    cc.warnID(1405, 'cc.eventManager', 'cc.EventTarget or cc.systemEvent');
    return eventManager;
});

module.exports = eventManager;
