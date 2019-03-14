/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

// tslint:disable:max-line-length

import * as js from '../../utils/js';
import { EventListener } from './event-listener';
const ListenerID = EventListener.ListenerID;

// tslint:disable-next-line
class _EventListenerVector {
    private _fixedListeners: EventListener[] = [];
    private _sceneGraphListeners: EventListener[] = [];
    private gt0Index = 0;

    public size () {
        return this._fixedListeners.length + this._sceneGraphListeners.length;
    }

    public empty () {
        return (this._fixedListeners.length === 0) && (this._sceneGraphListeners.length === 0);
    }

    public push (listener: EventListener) {
        if (listener._getFixedPriority() === 0) {
            this._sceneGraphListeners.push(listener);
        } else {
            this._fixedListeners.push(listener);
        }
    }

    public clearSceneGraphListeners () {
        this._sceneGraphListeners.length = 0;
    }

    public clearFixedListeners () {
        this._fixedListeners.length = 0;
    }

    public clear () {
        this._sceneGraphListeners.length = 0;
        this._fixedListeners.length = 0;
    }

    public getFixedPriorityListeners () {
        return this._fixedListeners;
    }

    public getSceneGraphPriorityListeners () {
        return this._sceneGraphListeners;
    }
}

function __getListenerID (event) {
    const eventType = cc.Event;
    const type = event.type;
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
        cc.logID(2000);
    }
    return '';
}

// Priority dirty flag
const DIRTY_NONE = 0;
const DIRTY_FIXED_PRIORITY = 1 << 0;
const DIRTY_SCENE_GRAPH_PRIORITY = 1 << 1;
const DIRTY_ALL = 3;

class EventManager {
    private _listenersMap = {};
    private _priorityDirtyFlagMap = {};
    private _nodeListenersMap = {};
    private _nodePriorityMap = js.createMap(true);
    private _globalZOrderNodeMap: string[] = [];
    private _toAddedListeners: EventListener[] = [];
    private _toRemovedListeners: EventListener[] = [];
    private _dirtyNodes: any[] = [];
    private _inDispatch = 0;
    private _isEnabled = false;
    private _nodePriorityIndex = 0;
    private _internalCustomListenerIDs: string[] = [];

    /**
     * !#en Pauses all listeners which are associated the specified target.
     * !#zh 暂停传入的 node 相关的所有监听器的事件响应。
     * @param {Node} node
     * @param [recursive=false]
     */
    public pauseTarget (node: any, recursive = false) {
        if (!(node instanceof cc._BaseNode)) {
            cc.warnID(3506);
            return;
        }
        const listeners = this._nodeListenersMap[node._id];
        if (listeners) {
            for (const listener of listeners) {
                listener._setPaused(true);
            }
        }
        if (recursive === true) {
            const locChildren = node.children;
            if (locChildren) {
                for (const locChild of locChildren) {
                    this.pauseTarget(locChild, true);
                }
            }
        }
    }

    /**
     * !#en Resumes all listeners which are associated the specified target.
     * !#zh 恢复传入的 node 相关的所有监听器的事件响应。
     * @param {Node} node
     * @param [recursive=false]
     */
    public resumeTarget (node: any, recursive = false) {
        if (!(node instanceof cc._BaseNode)) {
            cc.warnID(3506);
            return;
        }
        const listeners = this._nodeListenersMap[node._id];
        if (listeners) {
            for (const listener of listeners) {
                listener._setPaused(false);
            }
        }
        this._setDirtyForNode(node);
        if (recursive === true && node.children.length > 0) {
            const locChildren = node.children;
            if (locChildren) {
                for (const locChild of locChildren) {
                    this.resumeTarget(locChild, true);
                }
            }
        }
    }

    public frameUpdateListeners () {
        const locListenersMap = this._listenersMap;
        const locPriorityDirtyFlagMap = this._priorityDirtyFlagMap;
        for (const selKey in locListenersMap) {
            if (locListenersMap[selKey].empty()) {
                delete locPriorityDirtyFlagMap[selKey];
                delete locListenersMap[selKey];
            }
        }

        const locToAddedListeners = this._toAddedListeners;
        if (locToAddedListeners.length !== 0) {
            for (let i = 0, len = locToAddedListeners.length; i < len; i++) {
                this._forceAddEventListener(locToAddedListeners[i]);
            }
            locToAddedListeners.length = 0;
        }
        if (this._toRemovedListeners.length !== 0) {
            this._cleanToRemovedListeners();
        }
    }

    /**
     * !#en Query whether the specified event listener id has been added.
     * !#zh 查询指定的事件 ID 是否存在
     * @param listenerID - The listener id.
     * @return true or false
     */
    public hasEventListener (listenerID: string | number) {
        return !!this._getListeners(listenerID);
    }

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
     * @param listener - The listener of a specified event or a object of some event parameters.
     * @param nodeOrPriority - The priority of the listener is based on the draw order of this node or fixedPriority The fixed priority of the listener.
     * @note  The priority of scene graph will be fixed value 0. So the order of listener item in the vector will be ' <0, scene graph (0 priority), >0'.
     *         A lower priority will be called before the ones that have a higher value. 0 priority is forbidden for fixed priority since it's used for scene graph based priority.
     *         The listener must be a cc.EventListener object when adding a fixed priority listener, because we can't remove a fixed priority listener without the listener handler,
     *         except calls removeAllListeners().
     * @return {EventListener} Return the listener. Needed in order to remove the event from the dispatcher.
     */
    public addListener (listener: EventListener, nodeOrPriority: any | number): any {
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

        if (!listener.checkAvailable()) {
            return;
        }

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
    }

    /**
     * !#en Adds a Custom event listener. It will use a fixed priority of 1.
     * !#zh 向事件管理器添加一个自定义事件监听器。
     * @param eventName
     * @param callback
     * @return the generated event. Needed in order to remove the event from the dispatcher
     */
    public addCustomListener (eventName: string, callback: Function) {
        const listener = EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName,
            callback,
        });
        this.addListener(listener, 1);
        return listener;
    }

    /**
     * !#en Remove a listener.
     * !#zh 移除一个已添加的监听器。
     * @param listener - an event listener or a registered node target
     * @example {@link cocos2d/core/event-manager/CCEventManager/removeListener.js}
     */
    public removeListener (listener: EventListener) {
        if (listener == null) {
            return;
        }

        let isFound = false;
        const locListener = this._listenersMap;
        for (const selKey of Object.keys(locListener)) {
            const listeners = locListener[selKey];
            const fixedPriorityListeners = listeners.getFixedPriorityListeners();
            const sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

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
            const locToAddedListeners = this._toAddedListeners;
            for (let i = 0, len = locToAddedListeners.length; i < len; i++) {
                const selListener = locToAddedListeners[i];
                if (selListener === listener) {
                    cc.js.array.remove(locToAddedListeners, selListener);
                    selListener._setRegistered(false);
                    break;
                }
            }
        }
    }

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
     * @param [recursive=false]
     */
    public removeListeners (listenerType: number | any, recursive = false) {
        if (!(cc.js.isNumber(listenerType) || listenerType instanceof cc._BaseNode)) {
            cc.warnID(3506);
            return;
        }
        if (listenerType._id !== undefined) {
            // Ensure the node is removed from these immediately also.
            // Don't want any dangling pointers or the possibility of dealing with deleted objects..
            delete this._nodePriorityMap[listenerType._id];
            cc.js.array.remove(this._dirtyNodes, listenerType);
            const listeners = this._nodeListenersMap[listenerType._id];
            if (listeners) {
                const listenersCopy = cc.js.array.copy(listeners);
                for (const listenerCopy of listenersCopy) {
                    this.removeListener(listenerCopy);
                }
                delete this._nodeListenersMap[listenerType._id];
            }

            // Bug fix: ensure there are no references to the node in the list of listeners to be added.
            // If we find any listeners associated with the destroyed node in this list then remove them.
            // This is to catch the scenario where the node gets destroyed before it's listener
            // is added into the event dispatcher fully. This could happen if a node registers a listener
            // and gets destroyed while we are dispatching an event (touch etc.)
            const locToAddedListeners = this._toAddedListeners;
            for (let i = 0; i < locToAddedListeners.length;) {
                const listener = locToAddedListeners[i];
                if (listener._getSceneGraphPriority() === listenerType) {
                    // Ensure no dangling ptr to the target node.
                    listener._setSceneGraphPriority(null);
                    listener._setRegistered(false);
                    locToAddedListeners.splice(i, 1);
                } else {
                    ++i;
                }
            }

            if (recursive === true) {
                const locChildren = listenerType.getChildren();
                for (const locChild of locChildren) {
                    this.removeListeners(locChild, true);
                }
            }
        } else {
            if (listenerType === cc.EventListener.TOUCH_ONE_BY_ONE) {
                this._removeListenersForListenerID(ListenerID.TOUCH_ONE_BY_ONE);
            } else if (listenerType === cc.EventListener.TOUCH_ALL_AT_ONCE) {
                this._removeListenersForListenerID(ListenerID.TOUCH_ALL_AT_ONCE);
                 } else if (listenerType === cc.EventListener.MOUSE) {
                this._removeListenersForListenerID(ListenerID.MOUSE);
                 } else if (listenerType === cc.EventListener.ACCELERATION) {
                this._removeListenersForListenerID(ListenerID.ACCELERATION);
                 } else if (listenerType === cc.EventListener.KEYBOARD) {
                this._removeListenersForListenerID(ListenerID.KEYBOARD);
                 } else {
                cc.logID(3501);
                 }
        }
    }

    /*
     * !#en Removes all custom listeners with the same event name.
     * !#zh 移除同一事件名的自定义事件监听器。
     * @method removeCustomListeners
     * @param {String} customEventName
     */
    public removeCustomListeners (customEventName) {
        this._removeListenersForListenerID(customEventName);
    }

    /**
     * !#en Removes all listeners
     * !#zh 移除所有事件监听器。
     * @method removeAllListeners
     */
    public removeAllListeners () {
        const locListeners = this._listenersMap;
        const locInternalCustomEventIDs = this._internalCustomListenerIDs;
        for (const selKey in locListeners) {
            if (locInternalCustomEventIDs.indexOf(selKey) === -1) {
                this._removeListenersForListenerID(selKey);
            }
        }
    }

    /**
     * !#en Sets listener's priority with fixed value.
     * !#zh 设置 FixedPriority 类型监听器的优先级。
     * @method setPriority
     * @param {EventListener} listener
     * @param {Number} fixedPriority
     */
    public setPriority (listener, fixedPriority) {
        if (listener == null) {
            return;
        }

        const locListeners = this._listenersMap;
        for (const selKey of Object.keys(locListeners)) {
            const selListeners = locListeners[selKey];
            const fixedPriorityListeners = selListeners.getFixedPriorityListeners();
            if (fixedPriorityListeners) {
                const found = fixedPriorityListeners.indexOf(listener);
                if (found !== -1) {
                    if (listener._getSceneGraphPriority() != null) {
                        cc.logID(3502);
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
     * !#en Whether to enable dispatching events
     * !#zh 启用或禁用事件管理器，禁用后不会分发任何事件。
     * @method setEnabled
     * @param {Boolean} enabled
     */
    public setEnabled (enabled) {
        this._isEnabled = enabled;
    }

    /**
     * !#en Checks whether dispatching events is enabled
     * !#zh 检测事件管理器是否启用。
     * @method isEnabled
     * @returns {Boolean}
     */
    public isEnabled () {
        return this._isEnabled;
    }

    /*
     * !#en Dispatches the event, also removes all EventListeners marked for deletion from the event dispatcher list.
     * !#zh 分发事件。
     * @method dispatchEvent
     * @param {Event} event
     */
    public dispatchEvent (event) {
        if (!this._isEnabled) {
            return;
        }

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

        const listenerID = __getListenerID(event);
        this._sortEventListeners(listenerID);
        const selListeners = this._listenersMap[listenerID];
        if (selListeners != null) {
            this._dispatchEventToListeners(selListeners, this._onListenerCallback, event);
            this._onUpdateListeners(selListeners);
        }

        this._inDispatch--;
    }

    public _onListenerCallback (listener: EventListener, event) {
        event.currentTarget = listener._target;
        const onEvent = listener.onEvent;
        if (onEvent) {
            onEvent(event);
        }
        return event.isStopped();
    }

    /*
     * !#en Dispatches a Custom Event with a event name an optional user data
     * !#zh 分发自定义事件。
     * @method dispatchCustomEvent
     * @param {String} eventName
     * @param {*} optionalUserData
     */
    public dispatchCustomEvent (eventName, optionalUserData) {
        const ev = new cc.Event.EventCustom(eventName);
        ev.setUserData(optionalUserData);
        this.dispatchEvent(ev);
    }

    private _setDirtyForNode (node) {
        // Mark the node dirty only when there is an event listener associated with it.
        if (this._nodeListenersMap[node._id] !== undefined) {
            this._dirtyNodes.push(node);
        }
        if (node.children.length > 0) {
            const _children = node.children;
            for (let i = 0, len = _children ? _children.length : 0; i < len; i++) {
                this._setDirtyForNode(_children[i]);
            }
        }
    }

    private _addListener (listener) {
        if (this._inDispatch === 0) {
            this._forceAddEventListener(listener);
        } else {
            this._toAddedListeners.push(listener);
        }
    }

    private _forceAddEventListener (listener) {
        const listenerID = listener._getListenerID();
        let listeners = this._listenersMap[listenerID];
        if (!listeners) {
            listeners = new _EventListenerVector();
            this._listenersMap[listenerID] = listeners;
        }
        listeners.push(listener);

        if (listener._getFixedPriority() === 0) {
            this._setDirty(listenerID, DIRTY_SCENE_GRAPH_PRIORITY);

            const node = listener._getSceneGraphPriority();
            if (node === null) {
                cc.logID(3507);
            }

            this._associateNodeAndEventListener(node, listener);
            if (node.activeInHierarchy) {
                this.resumeTarget(node);
            }
        } else {
            this._setDirty(listenerID, DIRTY_FIXED_PRIORITY);
        }
    }

    private _getListeners (listenerID) {
        return this._listenersMap[listenerID];
    }

    private _updateDirtyFlagForSceneGraph () {
        if (this._dirtyNodes.length === 0) {
            return;
        }

        const locDirtyNodes = this._dirtyNodes;
        const locNodeListenersMap = this._nodeListenersMap;
        for (let i = 0, len = locDirtyNodes.length; i < len; i++) {
            const selListeners = locNodeListenersMap[locDirtyNodes[i]._id];
            if (selListeners) {
                for (let j = 0, listenersLen = selListeners.length; j < listenersLen; j++) {
                    const selListener = selListeners[j];
                    if (selListener) {
                        this._setDirty(selListener._getListenerID(), DIRTY_SCENE_GRAPH_PRIORITY);
                    }
                }
            }
        }
        this._dirtyNodes.length = 0;
    }

    private _removeAllListenersInVector (listenerVector) {
        if (!listenerVector) {
            return;
        }
        let selListener;
        for (let i = 0; i < listenerVector.length;) {
            selListener = listenerVector[i];
            selListener._setRegistered(false);
            if (selListener._getSceneGraphPriority() != null) {
                this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);
                selListener._setSceneGraphPriority(null);   // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.
            }

            if (this._inDispatch === 0) {
                cc.js.array.remove(listenerVector, selListener);
            } else {
                ++i;
            }
        }
    }

    private _removeListenersForListenerID (listenerID) {
        const listeners = this._listenersMap[listenerID];
        if (listeners) {
            const fixedPriorityListeners = listeners.getFixedPriorityListeners();
            const sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

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

        const locToAddedListeners = this._toAddedListeners;
        for (let i = 0; i < locToAddedListeners.length;) {
            const listener = locToAddedListeners[i];
            if (listener && listener._getListenerID() === listenerID) {
                cc.js.array.remove(locToAddedListeners, listener);
            } else {
                ++i;
            }
        }
    }

    private _sortEventListeners (listenerID) {
        let dirtyFlag = DIRTY_NONE;
        const locFlagMap = this._priorityDirtyFlagMap;
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
                const rootEntity = cc.director.getScene();
                if (rootEntity) {
                    this._sortListenersOfSceneGraphPriority(listenerID, rootEntity);
                }
            }
        }
    }

    private _sortListenersOfSceneGraphPriority (listenerID, rootNode) {
        const listeners = this._getListeners(listenerID);
        if (!listeners) {
            return;
        }

        const sceneGraphListener = listeners.getSceneGraphPriorityListeners();
        if (!sceneGraphListener || sceneGraphListener.length === 0) {
            return;
        }

        // Reset priority index
        this._nodePriorityIndex = 0;
        this._nodePriorityMap = js.createMap(true);

        this._visitTarget(rootNode, true);

        // After sort: priority < 0, > 0
        listeners.getSceneGraphPriorityListeners().sort(this._sortEventListenersOfSceneGraphPriorityDes);
    }

    private _sortEventListenersOfSceneGraphPriorityDes (l1: EventListener, l2: EventListener) {
        const locNodePriorityMap = eventManager._nodePriorityMap;
        const node1 = l1._getSceneGraphPriority();
        const node2 = l2._getSceneGraphPriority();
        if (!l2 || !node2 || !locNodePriorityMap[node2._id]) {
            return -1;
        } else if (!l1 || !node1 || !locNodePriorityMap[node1._id]) {
            return 1;
             }
        return locNodePriorityMap[node2._id] - locNodePriorityMap[node1._id];
    }

    private _sortListenersOfFixedPriority (listenerID) {
        const listeners = this._listenersMap[listenerID];
        if (!listeners) {
            return;
        }

        const fixedListeners = listeners.getFixedPriorityListeners();
        if (!fixedListeners || fixedListeners.length === 0) {
            return;
        }
        // After sort: priority < 0, > 0
        fixedListeners.sort(this._sortListenersOfFixedPriorityAsc);

        // FIXME: Should use binary search
        let index = 0;
        for (const len = fixedListeners.length; index < len;) {
            if (fixedListeners[index]._getFixedPriority() >= 0) {
                break;
            }
            ++index;
        }
        listeners.gt0Index = index;
    }

    private _sortListenersOfFixedPriorityAsc (l1, l2) {
        return l1._getFixedPriority() - l2._getFixedPriority();
    }

    private _onUpdateListeners (listeners) {
        const fixedPriorityListeners = listeners.getFixedPriorityListeners();
        const sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
        const toRemovedListeners = this._toRemovedListeners;

        if (sceneGraphPriorityListeners) {
            for (let i = 0; i < sceneGraphPriorityListeners.length;) {
                const selListener = sceneGraphPriorityListeners[i];
                if (!selListener._isRegistered()) {
                    cc.js.array.remove(sceneGraphPriorityListeners, selListener);
                    // if item in toRemove list, remove it from the list
                    const idx = toRemovedListeners.indexOf(selListener);
                    if (idx !== -1) {
                        toRemovedListeners.splice(idx, 1);
                    }
                } else {
                    ++i;
                }
            }
        }

        if (fixedPriorityListeners) {
            for (let i = 0; i < fixedPriorityListeners.length;) {
                const selListener = fixedPriorityListeners[i];
                if (!selListener._isRegistered()) {
                    cc.js.array.remove(fixedPriorityListeners, selListener);
                    // if item in toRemove list, remove it from the list
                    const idx = toRemovedListeners.indexOf(selListener);
                    if (idx !== -1) {
                        toRemovedListeners.splice(idx, 1);
                    }
                } else {
                    ++i;
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

    private _updateTouchListeners (event) {
        const locInDispatch = this._inDispatch;
        cc.assertID(locInDispatch > 0, 3508);

        if (locInDispatch > 1) {
            return;
        }

        let listeners;
        listeners = this._listenersMap[ListenerID.TOUCH_ONE_BY_ONE];
        if (listeners) {
            this._onUpdateListeners(listeners);
        }
        listeners = this._listenersMap[ListenerID.TOUCH_ALL_AT_ONCE];
        if (listeners) {
            this._onUpdateListeners(listeners);
        }

        cc.assertID(locInDispatch === 1, 3509);

        const locToAddedListeners = this._toAddedListeners;
        if (locToAddedListeners.length !== 0) {
            for (let i = 0, len = locToAddedListeners.length; i < len; i++) {
                this._forceAddEventListener(locToAddedListeners[i]);
            }
            this._toAddedListeners.length = 0;
        }

        if (this._toRemovedListeners.length !== 0) {
            this._cleanToRemovedListeners();
        }
    }

    // Remove all listeners in _toRemoveListeners list and cleanup
    private _cleanToRemovedListeners () {
        const toRemovedListeners = this._toRemovedListeners;
        for (const selListener of toRemovedListeners) {
            const listeners = this._listenersMap[selListener._getListenerID()];
            if (!listeners) {
                continue;
            }

            const fixedPriorityListeners = listeners.getFixedPriorityListeners();
            const sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

            if (sceneGraphPriorityListeners) {
                const idx = sceneGraphPriorityListeners.indexOf(selListener);
                if (idx !== -1) {
                    sceneGraphPriorityListeners.splice(idx, 1);
                }
            }
            if (fixedPriorityListeners) {
                const idx = fixedPriorityListeners.indexOf(selListener);
                if (idx !== -1) {
                    fixedPriorityListeners.splice(idx, 1);
                }
            }
        }
        toRemovedListeners.length = 0;
    }

    private _onTouchEventCallback (listener, argsObj) {
        // Skip if the listener was removed.
        if (!listener._isRegistered) {
            return false;
        }

        const event = argsObj.event;
        const selTouch = event.currentTouch;
        event.currentTarget = listener._node;

        let isClaimed = false;
        let removedIdx;
        const getCode = event.getEventCode();
        const EventTouch = cc.Event.EventTouch;
        if (getCode === EventTouch.BEGAN) {
            if (listener.onTouchBegan) {
                isClaimed = listener.onTouchBegan(selTouch, event);
                if (isClaimed && listener._registered) {
                    listener._claimedTouches.push(selTouch);
                }
            }
        } else if (listener._claimedTouches.length > 0) {
            removedIdx = listener._claimedTouches.indexOf(selTouch);
            if (removedIdx !== -1) {
                isClaimed = true;
                if (getCode === EventTouch.MOVED && listener.onTouchMoved) {
                    listener.onTouchMoved(selTouch, event);
                } else if (getCode === EventTouch.ENDED) {
                    if (listener.onTouchEnded) {
                        listener.onTouchEnded(selTouch, event);
                    }
                    if (listener._registered) {
                        listener._claimedTouches.splice(removedIdx, 1);
                    }
                } else if (getCode === EventTouch.CANCELLED) {
                    if (listener.onTouchCancelled) {
                        listener.onTouchCancelled(selTouch, event);
                    }
                    if (listener._registered) {
                        listener._claimedTouches.splice(removedIdx, 1);
                    }
                }
            }
        }

        // If the event was stopped, return directly.
        if (event.isStopped()) {
            eventManager._updateTouchListeners(event);
            return true;
        }

        if (isClaimed && listener._registered && listener.swallowTouches) {
            if (argsObj.needsMutableSet) {
                argsObj.touches.splice(selTouch, 1);
            }
            return true;
        }
        return false;
    }

    private _dispatchTouchEvent (event) {
        this._sortEventListeners(ListenerID.TOUCH_ONE_BY_ONE);
        this._sortEventListeners(ListenerID.TOUCH_ALL_AT_ONCE);

        const oneByOneListeners = this._getListeners(ListenerID.TOUCH_ONE_BY_ONE);
        const allAtOnceListeners = this._getListeners(ListenerID.TOUCH_ALL_AT_ONCE);

        // If there aren't any touch listeners, return directly.
        if (null === oneByOneListeners && null === allAtOnceListeners) {
            return;
        }

        const originalTouches = event.getTouches();
        const mutableTouches = cc.js.array.copy(originalTouches);
        const oneByOneArgsObj = { event, needsMutableSet: (oneByOneListeners && allAtOnceListeners), touches: mutableTouches, selTouch: null };

        //
        // process the target handlers 1st
        //
        if (oneByOneListeners) {
            for (const originalTouch of originalTouches) {
                event.currentTouch = originalTouch;
                event._propagationStopped = event._propagationImmediateStopped = false;
                this._dispatchEventToListeners(oneByOneListeners, this._onTouchEventCallback, oneByOneArgsObj);
            }
        }

        //
        // process standard handlers 2nd
        //
        if (allAtOnceListeners && mutableTouches.length > 0) {
            this._dispatchEventToListeners(allAtOnceListeners, this._onTouchesEventCallback, { event, touches: mutableTouches });
            if (event.isStopped()) {
                return;
            }
        }
        this._updateTouchListeners(event);
    }

    private _onTouchesEventCallback (listener, callbackParams) {
        // Skip if the listener was removed.
        if (!listener._registered) {
            return false;
        }

        const EventTouch = cc.Event.EventTouch;
        const event = callbackParams.event;
        const touches = callbackParams.touches;
        const getCode = event.getEventCode();
        event.currentTarget = listener._node;
        if (getCode === EventTouch.BEGAN && listener.onTouchesBegan) {
            listener.onTouchesBegan(touches, event);
        } else if (getCode === EventTouch.MOVED && listener.onTouchesMoved) {
            listener.onTouchesMoved(touches, event);
             } else if (getCode === EventTouch.ENDED && listener.onTouchesEnded) {
            listener.onTouchesEnded(touches, event);
             } else if (getCode === EventTouch.CANCELLED && listener.onTouchesCancelled) {
            listener.onTouchesCancelled(touches, event);
             }

        // If the event was stopped, return directly.
        if (event.isStopped()) {
            eventManager._updateTouchListeners(event);
            return true;
        }
        return false;
    }

    private _associateNodeAndEventListener (node, listener) {
        let listeners = this._nodeListenersMap[node._id];
        if (!listeners) {
            listeners = [];
            this._nodeListenersMap[node._id] = listeners;
        }
        listeners.push(listener);
    }

    private _dissociateNodeAndEventListener (node, listener) {
        const listeners = this._nodeListenersMap[node._id];
        if (listeners) {
            cc.js.array.remove(listeners, listener);
            if (listeners.length === 0) {
                delete this._nodeListenersMap[node._id];
            }
        }
    }

    private _dispatchEventToListeners (listeners, onEvent, eventOrArgs) {
        let shouldStopPropagation = false;
        const fixedPriorityListeners = listeners.getFixedPriorityListeners();
        const sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

        let i = 0;
        if (fixedPriorityListeners) {  // priority < 0
            if (fixedPriorityListeners.length !== 0) {
                for (; i < listeners.gt0Index; ++i) {
                    const selListener = fixedPriorityListeners[i];
                    if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
                        shouldStopPropagation = true;
                        break;
                    }
                }
            }
        }

        if (sceneGraphPriorityListeners && !shouldStopPropagation) {    // priority == 0, scene graph priority
            for (const selListener of sceneGraphPriorityListeners) {
                if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
                    shouldStopPropagation = true;
                    break;
                }
            }
        }

        if (fixedPriorityListeners && !shouldStopPropagation) {    // priority > 0
            for (; i < fixedPriorityListeners.length; ++i) {
                const selListener = fixedPriorityListeners[i];
                if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
                    shouldStopPropagation = true;
                    break;
                }
            }
        }
    }

    private _setDirty (listenerID, flag) {
        const locDirtyFlagMap = this._priorityDirtyFlagMap;
        if (locDirtyFlagMap[listenerID] == null) {
            locDirtyFlagMap[listenerID] = flag;
        } else {
            locDirtyFlagMap[listenerID] = flag | locDirtyFlagMap[listenerID];
        }
    }

    private _visitTarget (node, isRootNode) {
        // sortAllChildren is performed the next frame, but the event is executed immediately.
        if (node._reorderChildDirty) {
            node.sortAllChildren();
        }
        const children = node.children;
        let i = 0;
        const  childrenCount = children.length;
        let locGlobalZOrderNodeMap = this._globalZOrderNodeMap;
        const locNodeListenersMap = this._nodeListenersMap;

        if (childrenCount > 0) {
            if (locNodeListenersMap[node._id] !== undefined) {
                if (!locGlobalZOrderNodeMap) {
                    locGlobalZOrderNodeMap = [];
                }
                locGlobalZOrderNodeMap.push(node._id);
            }

            let child;
            for (; i < childrenCount; i++) {
                child = children[i];
                if (child) {
                    this._visitTarget(child, false);
                }
            }
        } else {
            if (locNodeListenersMap[node._id] !== undefined) {
                if (!locGlobalZOrderNodeMap) {
                    locGlobalZOrderNodeMap = [];
                }
                locGlobalZOrderNodeMap.push(node._id);
            }
        }

        if (isRootNode) {
            const locNodePriorityMap = this._nodePriorityMap;
            for (const locGlobalZOrderNode of locGlobalZOrderNodeMap) {
                locNodePriorityMap[locGlobalZOrderNode] = ++this._nodePriorityIndex;
            }
            this._globalZOrderNodeMap.length = 0;
        }
    }

    private _sortNumberAsc (a, b) {
        return a - b;
    }

    private _removeListenerInCallback (listeners: EventListener[], callback) {
        if (listeners == null) {
            return false;
        }

        for (let i = 0, len = listeners.length; i < len; i++) {
            const selListener = listeners[i];
            // @ts-ignore
            if (selListener._onCustomEvent === callback || selListener.onEvent === callback) {
                selListener._setRegistered(false);
                if (selListener._getSceneGraphPriority() != null) {
                    this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);
                    // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.
                    selListener._setSceneGraphPriority(null);
                }

                if (this._inDispatch === 0) {
                    cc.js.array.remove(listeners, selListener);
                } else {
                    this._toRemovedListeners.push(selListener);
                }
                return true;
            }
        }
        return false;
    }

    private _removeListenerInVector (listeners: EventListener[], listener: EventListener) {
        if (listeners == null) {
            return false;
        }

        for (let i = 0, len = listeners.length; i < len; i++) {
            const selListener = listeners[i];
            if (selListener === listener) {
                selListener._setRegistered(false);
                if (selListener._getSceneGraphPriority() != null) {
                    this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);
                    // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.
                    selListener._setSceneGraphPriority(null);
                }

                if (this._inDispatch === 0) {
                    cc.js.array.remove(listeners, selListener);
                } else {
                    this._toRemovedListeners.push(selListener);
                }
                return true;
            }
        }
        return false;
    }
}

/**
 * !#en
 * This class has been deprecated, please use cc.systemEvent or cc.EventTarget instead.
 * See [Listen to and launch events](../../../manual/en/scripting/events.md) for details.<br>
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
export const eventManager = new EventManager();

cc.eventManager = eventManager;

export default eventManager;
