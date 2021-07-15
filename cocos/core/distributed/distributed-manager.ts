/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module core/distributed
 */

import { js } from '../utils/js';
import { CCObject } from '../data/object';
import { Component } from '../components/component';
import { BaseNode } from '../scene-graph/base-node';
import { Node } from '../scene-graph/node';
import { Prefab } from '../assets/prefab';
import { instantiate } from '../data/instantiate';
import { legacyCC } from '../global-exports';
import { EventTarget } from '../event/event-target';

enum EventType {
    OBJECT_CREATE,
    OBJECT_DESTROY,
    COMPONENT_ADD,
    COMPONENT_REMOVE,
    PROPERTY_CHANGE,
    PREFAB_INSTANTIATE,
    SERVER_OBJECT_CREATE,
    SERVER_COMPONENT_ADD,
    SERVER_PROPERTY_CHANGE,
    RPC,
    BROADCAST_RPC,
    END,
}

enum ValueType {
    UUID,
    OBJECT
}

export class ValueCapsule {
    public static ValueType = ValueType;
    public type = ValueType.OBJECT;
    public value: any = undefined;
}

export class DistributedManager extends EventTarget {
    public static EventType = EventType;

    /**
     * @zh 开启事件队列，开启后所有事件会被推入队列中，直到 [[flushEvents]] 被调用才会真正派发事件
     * @en Enable event queue, after enabled, all events will be pushed into an internal queue,
     * events will only be emitted until [[flushEvents]] invoked.
     */
    public get enableEventQueue () {
        return this._enableEventQueue;
    }
    public set enableEventQueue (enabled: boolean) {
        this._enableEventQueue = enabled;
        // flush previous queue messages
        if (!enabled) {
            this.flushEvents();
        }
    }

    private _objectMap = new Map<string, CCObject>();
    private _enableEventQueue = false;
    private _queue = new Array<Array<any>>();

    private _enqueue (...args) {
        const eventType = args[0];
        if (!isNaN(eventType) && eventType >= 0 && eventType < EventType.END) {
            // TODO: potential memory leak, check compiled js code
            this._queue.push(args);
        }
    }

    /**
     * @zh 派发所有事件队列中的事件
     * @en Emit all events in the event queue
     */
    public flushEvents () {
        let entry;
        for (let i = 0, l = this._queue.length; i < l; ++i) {
            entry = this._queue[i];
            // Emit support maximum 5 arguments
            this.emit(entry[0], entry[1], entry[2], entry[3], entry[4], entry[5]);
        }
        this._queue.length = 0;
    }

    /**
     * @zh 触发对象创建事件
     * @en Fire object create event
     */
    public fireObjectCreateEvent (obj: CCObject, fromServer: boolean = false) {
        if (!this._objectMap.has(obj.uuid)) {
            this._objectMap.set(obj.uuid, obj);
            const eventType = fromServer ? EventType.SERVER_OBJECT_CREATE : EventType.OBJECT_CREATE;
            if (this.enableEventQueue) {
                this._enqueue(eventType, obj);
            }
            else {
                this.emit(eventType, obj);
            }
        }
    }

    /**
     * @zh 触发预制件实例化事件
     * @en Fire prefab inst event
     */
    public firePrefabInstantiate (obj: BaseNode, prefab: Prefab) {
        if (this.enableEventQueue) {
            this._enqueue(EventType.PREFAB_INSTANTIATE, obj, prefab);
        }
        else {
            this.emit(EventType.PREFAB_INSTANTIATE, obj, prefab);
        }
    }

    /**
     * @zh 触发对象删除事件
     * @en Fire destroy object event
     */
    public fireObjectDestroyEvent (obj: CCObject) {
        if (this._objectMap.has(obj.uuid)) {
            this._objectMap.delete(obj.uuid);
            if (this.enableEventQueue) {
                this._enqueue(EventType.OBJECT_DESTROY, obj);
            }
            else {
                this.emit(EventType.OBJECT_DESTROY, obj);
            }
        }
    }

    /**
     * @zh 触发添加组件事件
     * @en Fire add component event
     */
    public fireAddComponentEvent (node: BaseNode, cp: Component, fromServer: boolean = false) {
        const eventType = fromServer ? EventType.SERVER_COMPONENT_ADD : EventType.COMPONENT_ADD;
        if (this.enableEventQueue) {
            this._enqueue(eventType, node, cp);
        }
        else {
            this.emit(eventType, node, cp);
        }
    }

    /**
     * @zh 触发移除组件事件
     * @en Fire remove component event
     */
    public fireRemoveComponentEvent (node: BaseNode, cp: Component) {
        if (this.enableEventQueue) {
            this._enqueue(EventType.COMPONENT_ADD, node, cp);
        }
        else {
            this.emit(EventType.COMPONENT_ADD, node, cp);
        }
    }

    /**
     * @zh 触发属性变更事件
     * @en Fire property change event
     */
    public firePropertyChangedEvent (obj: CCObject, name: string, value?: any, fromServer: boolean = false) {
        const eventType = fromServer ? EventType.SERVER_PROPERTY_CHANGE : EventType.PROPERTY_CHANGE;
        let capsule;
        if (value) {
            capsule = new ValueCapsule();
            // Value with uuid being set from server, need to be synced to client
            if (fromServer && value instanceof CCObject && value.replicated) {
                capsule.type = ValueType.UUID;
                capsule.value = value.uuid;
            }
            else {
                capsule.type = ValueType.OBJECT;
                capsule.value = value;
            }
        }
        if (this.enableEventQueue) {
            this._enqueue(eventType, obj, name, capsule);
        }
        else {
            this.emit(eventType, obj, name, capsule);
        }
    }

    /**
     * Remote procedure call event
     */
    public fireRPCEvent (obj: CCObject, method: string, ...params: any[]) {
        if (obj.replicated) {
            if (this.enableEventQueue) {
                this._enqueue(EventType.RPC, obj.uuid, method, ...params);
            }
            else {
                this.emit(EventType.RPC, obj.uuid, method, ...params);
            }
        }
    }

    /**
     * @zh 设置对象Id映射
     * @en Set object id mapping
     */
    public addObject (obj: CCObject) {
        this._objectMap.set(obj.uuid, obj);
    }

    /**
     * @zh 获得对象
     * @en Get object
     */
    public getObject (id: string) {
        return this._objectMap.get(id);
    }

    /**
     * @zh 获得对象Id
     * @en Get object id
     */
    public getObjectId (obj: CCObject) {
        return obj.uuid;
    }

    /**
     * @zh 创建对象
     * @en Create object
     */
    public createObject (className: string, id: string, data: string) {
        const type = js.getClassByName(className);
        if (!type) {
            console.log(`Object type not found, class: ${className}`);
            return null;
        }

        let obj: CCObject|null = null;
        if (data && data !== '') {
            const json = JSON.parse(data);
            if (!json) {
                console.log(`Deserialize object failed, id: ${id}`, `, class: ${className}`);
                return null;
            }

            // @ts-ignore
            obj = Object.assign(new type(), json);
        } else {
            // @ts-ignore
            obj = new type();
        }

        if (!obj) {
            console.log(`Create object failed, id: ${id}`, `, class: ${className}`);
            return null;
        }

        if (id) {
            // @ts-expect-error internal api usage
            obj._id = id;
            this.addObject(obj);
        }
        return obj;
    }

    /**
     * @zh 删除对象
     * @en Destroy object
     */
    public deleteObject (id: string) {
        const obj = this._objectMap.get(id);
        if (obj) {
            this._objectMap.delete(id);
        }
    }

    public updateObjectProp (id: string, key: string, value: string) {
        const target = this.getObject(id);
        if (!target) {
            console.log(`object not found id: ${id}`);
            return false;
        }
        const v = JSON.parse(value);
        let target_value;
        switch (v.type) {
        case 1: {
            const guid = v.value;
            const obj = this.getObject(guid);
            if (!obj) {
                console.log('can not find value obj ', guid);
                return false;
            }
            target_value = obj;
            break;
        }
        default: {
            target_value = v.value;
        }
        }
        console.log('============ update ======= ', key, target_value);
        const path : string[] = JSON.parse(key);
        let obj = target;
        let index = 0;
        for (; index < path.length - 1; ++index) {
            const path_key = path[index];
            obj = obj[path_key];
        }
        const path_key =  path[index];
        console.log('============ update ======= ', path_key, target_value);
        obj[path_key] = target_value;
    }
    /**
     * @zh 调用对象方法
     * @en Invoke object function
     */
    public invoke (id: string, func: string, paramsData: string) {
        const obj = this.getObject(id);
        if (!obj) {
            console.log(`Object not found, id: ${id}`);
            return false;
        }

        // @ts-ignore
        const method = obj[func];
        if (!method || typeof method !== 'function') {
            console.log(`Invalid method, id: ${id}`, `, method: ${func}`);
            return false;
        }

        const args: any[] = [];
        if (paramsData && paramsData !== '') {
            console.log('========= invoke parse =======', paramsData);
            const json = JSON.parse(paramsData);
            if (!json) {
                console.log(`Deserialize parameters failed, id: ${id}`, `, method: ${func}`);
                return false;
            }

            const nArg = Object.keys(json).length;
            for (let i = 0; i < nArg; ++i) {
                args.push(json[i]);
            }
        }

        console.log('========== ', args.length, args, js.getClassName(obj), obj.uuid);
        if (args.length === 0) {
            // @ts-ignore
            obj[func]();
        } else {
            // @ts-ignore
            obj[func](...args);
        }

        return true;
    }

    /**
     * @zh 设置属性数据
     * @en Set property data
     */
    setPropertyData (id: string, name: string, data: string) {
        const obj = this.getObject(id);
        if (!obj) {
            console.log(`Object not found, id: ${id}`);
            return false;
        }

        // @ts-ignore
        const property = obj[name];
        if (property === undefined || typeof property === 'function') {
            console.log(`Invalid property, id: ${id}`, `, property: ${name}`);
            return false;
        }

        const json = JSON.parse(data);
        if (json === undefined) {
            console.log(`Deserialize property data failed, id: ${id}`, `, method: ${name}`);
            return false;
        }

        const value = json;

        // @ts-ignore
        obj[name] = value;

        this.firePropertyChangedEvent(obj, name, value);

        return true;
    }

    /**
     * @zh 实例化预制件
     * @en Instantiate prefab
     */
    instantiatePrefab (prefab: Prefab, fireEvent = true) {
        const node = instantiate(prefab);
        if (node !== null && fireEvent) {
            this.firePrefabInstantiate(node, prefab);
        }
        return node;
    }

    /**
     * @zh 根据uuid实例化预制件
     * @en Instantiate prefab by uuid
     */
    instantiatePrefabByUUID (id: string, uuid: string, callback: (id: string, node: Node, prefab: Prefab) => void) {
        legacyCC.assetManager.loadAny(uuid, (err, asset) => {
            const prefab = asset as Prefab;
            if (prefab !== null) {
                const node = instantiate(prefab);
                callback(id, node, prefab);
            } else {
                console.log(`Load prefab failed, id: ${uuid}`);
            }
        });
    }

    broadcastRpc (guid: number, method: string, ...params: any[]) {
        this._objectMap.forEach((value, key) => {
            if (value instanceof CCObject) {
                // value.client.callObj(guid, method, ...params);
            }
        });
    }
}
