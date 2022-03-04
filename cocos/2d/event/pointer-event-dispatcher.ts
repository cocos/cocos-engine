/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

import { Node } from '../../core/scene-graph/node';
import { Input, input } from '../../input';
import { Event, EventMouse, EventTouch } from '../../input/types';
import { DispatcherEventType, NodeEventProcessor } from '../../core/scene-graph/node-event-processor';
import { js } from '../../core/utils/js';
import { InputEventType } from '../../input/types/event-enum';
import { EventDispatcherPriority, IEventDispatcher } from '../../input/input';

const mouseEvents = [
    Input.EventType.MOUSE_DOWN,
    Input.EventType.MOUSE_MOVE,
    Input.EventType.MOUSE_UP,
    Input.EventType.MOUSE_WHEEL,
];
const touchEvents = [
    Input.EventType.TOUCH_START,
    Input.EventType.TOUCH_MOVE,
    Input.EventType.TOUCH_END,
    Input.EventType.TOUCH_CANCEL,
];

class PointerEventDispatcher implements IEventDispatcher {
    public priority: EventDispatcherPriority = EventDispatcherPriority.UI;

    private _isListDirty = false;
    private _inDispatchCount = 0;
    private _pointerEventProcessorList: NodeEventProcessor[] = [];
    private _processorListToAdd: NodeEventProcessor[] = [];
    private _processorListToRemove: NodeEventProcessor[] = [];

    constructor () {
        // @ts-expect-error Property '_registerEventDispatcher' is private and only accessible within class 'Input'.
        input._registerEventDispatcher(this);

        NodeEventProcessor.callbacksInvoker.on(DispatcherEventType.ADD_POINTER_EVENT_PROCESSOR, this.addPointerEventProcessor, this);
        NodeEventProcessor.callbacksInvoker.on(DispatcherEventType.REMOVE_POINTER_EVENT_PROCESSOR, this.removePointerEventProcessor, this);
        NodeEventProcessor.callbacksInvoker.on(DispatcherEventType.MARK_LIST_DIRTY, this._markListDirty, this);
    }

    public dispatchEvent (event: Event): boolean {
        const eventType = event.type as Input.EventType;
        if (touchEvents.includes(eventType)) {
            return this.dispatchEventTouch(event as EventTouch);
        } else if (mouseEvents.includes(eventType)) {
            return this.dispatchEventMouse(event as EventMouse);
        }
        return true;
    }

    public addPointerEventProcessor (pointerEventProcessor: NodeEventProcessor) {
        if (this._inDispatchCount === 0) {
            this._pointerEventProcessorList.push(pointerEventProcessor);
            this._isListDirty = true;
        } else {
            js.array.remove(this._processorListToRemove, pointerEventProcessor);
            this._processorListToAdd.push(pointerEventProcessor);
        }
    }

    public removePointerEventProcessor (pointerEventProcessor: NodeEventProcessor) {
        if (this._inDispatchCount === 0) {
            js.array.remove(this._pointerEventProcessorList, pointerEventProcessor);
            this._isListDirty = true;
        } else {
            js.array.remove(this._processorListToAdd, pointerEventProcessor);
            this._processorListToRemove.push(pointerEventProcessor);
        }
    }

    public dispatchEventMouse (eventMouse: EventMouse) {
        this._inDispatchCount++;
        this._sortPointerEventProcessorList();
        const pointerEventProcessorList = this._pointerEventProcessorList;
        const length = pointerEventProcessorList.length;
        let dispatchToNextEventDispatcher = true;
        for (let i = 0; i < length; ++i) {
            const pointerEventProcessor = pointerEventProcessorList[i];
            if (pointerEventProcessor.isEnabled && pointerEventProcessor.shouldHandleEventMouse
                // @ts-expect-error access private method
                && pointerEventProcessor._handleEventMouse(eventMouse)) {
                dispatchToNextEventDispatcher = false;
                if (!eventMouse.preventSwallow) {
                    break;
                } else {
                    eventMouse.preventSwallow = false;  // reset swallow state
                }
            }
        }
        if (--this._inDispatchCount <= 0) {
            this._updatePointerEventProcessorList();
        }
        return dispatchToNextEventDispatcher;
    }

    public dispatchEventTouch (eventTouch: EventTouch) {
        this._inDispatchCount++;
        this._sortPointerEventProcessorList();
        const pointerEventProcessorList = this._pointerEventProcessorList;
        const length = pointerEventProcessorList.length;
        const touch = eventTouch.touch!;
        let dispatchToNextEventDispatcher = true;
        for (let i = 0; i < length; ++i) {
            const pointerEventProcessor = pointerEventProcessorList[i];
            if (pointerEventProcessor.isEnabled && pointerEventProcessor.shouldHandleEventTouch) {
                if (eventTouch.type === InputEventType.TOUCH_START) {
                    // @ts-expect-error access private method
                    if (pointerEventProcessor._handleEventTouch(eventTouch)) {
                        pointerEventProcessor.claimedTouchIdList.push(touch.getID());
                        dispatchToNextEventDispatcher = false;
                        if (!eventTouch.preventSwallow) {
                            break;
                        } else {
                            eventTouch.preventSwallow = false;  // reset swallow state
                        }
                    }
                } else if (pointerEventProcessor.claimedTouchIdList.length > 0) {
                    const index = pointerEventProcessor.claimedTouchIdList.indexOf(touch.getID());
                    if (index !== -1) {
                        // @ts-expect-error access private method
                        pointerEventProcessor._handleEventTouch(eventTouch);
                        if (eventTouch.type === InputEventType.TOUCH_END || eventTouch.type === InputEventType.TOUCH_CANCEL) {
                            js.array.removeAt(pointerEventProcessor.claimedTouchIdList, index);
                        }
                        dispatchToNextEventDispatcher = false;
                        if (!eventTouch.preventSwallow) {
                            break;
                        } else {
                            eventTouch.preventSwallow = false;  // reset swallow state
                        }
                    }
                }
            }
        }
        if (--this._inDispatchCount <= 0) {
            this._updatePointerEventProcessorList();
        }
        return dispatchToNextEventDispatcher;
    }

    private _updatePointerEventProcessorList () {
        const listToAdd = this._processorListToAdd;
        const addLength = listToAdd.length;
        for (let i = 0; i < addLength; ++i) {
            this.addPointerEventProcessor(listToAdd[i]);
        }
        listToAdd.length = 0;

        const listToRemove = this._processorListToRemove;
        const removeLength = listToRemove.length;
        for (let i = 0; i < removeLength; ++i) {
            this.removePointerEventProcessor(listToRemove[i]);
        }
        listToRemove.length = 0;
    }

    private _sortPointerEventProcessorList () {
        if (!this._isListDirty) {
            return;
        }
        const pointerEventProcessorList = this._pointerEventProcessorList;
        const length = pointerEventProcessorList.length;
        for (let i = 0; i < length; ++i) {
            const pointerEventProcessor = pointerEventProcessorList[i];
            const node = pointerEventProcessor.node;
            const trans = node._uiProps.uiTransformComp;
            pointerEventProcessor.cachedCameraPriority = trans!.cameraPriority;
        }
        pointerEventProcessorList.sort(this._sortByPriority);
        this._isListDirty = false;
    }

    private _sortByPriority (p1: NodeEventProcessor, p2: NodeEventProcessor) {
        const node1: Node = p1.node;
        const node2: Node = p2.node;
        if (!p2 || !node2 || !node2.activeInHierarchy || !node2._uiProps.uiTransformComp) {
            return -1;
        } else if (!p1 || !node1 || !node1.activeInHierarchy || !node1._uiProps.uiTransformComp) {
            return 1;
        }

        if (p1.cachedCameraPriority !== p2.cachedCameraPriority) {
            return p2.cachedCameraPriority - p1.cachedCameraPriority;
        }
        let n1: Node | null = node1; let n2: Node | null = node2; let ex = false;
        // @ts-expect-error _id is a protected property
        while (n1.parent?._id !== n2.parent?._id) {
            n1 = n1?.parent?.parent === null ? (ex = true) && node2 : n1 && n1.parent;
            n2 = n2?.parent?.parent === null ? (ex = true) && node1 : n2 && n2.parent;
        }

        // @ts-expect-error protected property _id
        if (n1._id === n2._id) {
            // @ts-expect-error protected property _id
            if (n1._id === node2._id) {
                return -1;
            }
            // @ts-expect-error protected property _id
            if (n1._id === node1._id) {
                return 1;
            }
        }

        const priority1 = n1 ? n1.getSiblingIndex() : 0;
        const priority2 = n2 ? n2.getSiblingIndex() : 0;

        return ex ? priority1 - priority2 : priority2 - priority1;
    }

    private _markListDirty () {
        this._isListDirty = true;
    }
}

export const pointerEventDispatcher = new PointerEventDispatcher();
