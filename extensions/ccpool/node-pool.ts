/*
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { Component } from '../../cocos/scene-graph/component';
import { Node } from '../../cocos/scene-graph';
import { legacyCC } from '../../cocos/core/global-exports';

type Constructor<T = {}> = new(...args: any[]) => T;

interface IPoolHandlerComponent extends Component {
    unuse (): void;

    reuse (args: any): void;
}

/**
 * @en
 *  `NodePool` is the cache pool designed for node type.<br/>
 *  It can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
 *
 * It's recommended to create `NodePool` instances by node type, the type corresponds to node type in game design, not the class,
 * for example, a prefab is a specific node type. <br/>
 * When you create a node pool, you can pass a Component which contains `unuse`, `reuse` functions to control the content of node.<br/>
 *
 * Some common use case is :<br/>
 *      1. Bullets in game (die very soon, massive creation and recreation, no side effect on other objects)<br/>
 *      2. Blocks in candy crash (massive creation and recreation)<br/>
 *      etc...
 * @zh
 * `NodePool` 是用于管理节点对象的对象缓存池。<br/>
 * 它可以帮助您提高游戏性能，适用于优化对象的反复创建和销毁<br/>
 * 以前 cocos2d-x 中的 pool 和新的节点事件注册系统不兼容，因此请使用 `NodePool` 来代替。
 *
 * 新的 NodePool 需要实例化之后才能使用，每种不同的节点对象池需要一个不同的对象池实例，这里的种类对应于游戏中的节点设计，一个 prefab 相当于一个种类的节点。<br/>
 * 在创建缓冲池时，可以传入一个包含 unuse, reuse 函数的组件类型用于节点的回收和复用逻辑。<br/>
 *
 * 一些常见的用例是：<br/>
 *      1.在游戏中的子弹（死亡很快，频繁创建，对其他对象无副作用）<br/>
 *      2.糖果粉碎传奇中的木块（频繁创建）。
 *      等等....
 */
export class NodePool {
    /**
     * @en The pool handler component, it could be the class name or the constructor.
     * @zh 缓冲池处理组件，用于节点的回收和复用逻辑，这个属性可以是组件类名或组件的构造函数。
     */
    public poolHandlerComp?: Constructor<IPoolHandlerComponent> | string;
    private _pool: Node[];

    /**
     * @en
     * Constructor for creating a pool for a specific node template (usually a prefab).
     * You can pass a component (type or name) argument for handling event for reusing and recycling node.
     * @zh
     * 使用构造函数来创建一个节点专用的对象池，您可以传递一个组件类型或名称，用于处理节点回收和复用时的事件逻辑。
     * @param poolHandlerComp @en The constructor or the class name of the component to control the unuse/reuse logic. @zh 处理节点回收和复用事件逻辑的组件类型或名称。
     * @example
     * import { NodePool, Prefab } from 'cc';
     *  properties: {
     *      template: Prefab
     *     },
     *     onLoad () {
     *       // MyTemplateHandler is a component with 'unuse' and 'reuse' to handle events when node is reused or recycled.
     *       this.myPool = new NodePool('MyTemplateHandler');
     *     }
     *  }
     */
    constructor (poolHandlerComp?: Constructor<IPoolHandlerComponent> | string) {
        this.poolHandlerComp = poolHandlerComp;
        this._pool = [];
    }

    /**
     * @en The current available size in the pool
     * @zh 获取当前缓冲池的可用对象数量
     */
    public size (): number {
        return this._pool.length;
    }

    /**
     * @en Destroy all cached nodes in the pool
     * @zh 销毁对象池中缓存的所有节点
     */
    public clear (): void {
        const count = this._pool.length;
        for (let i = 0; i < count; ++i) {
            this._pool[i].destroy();
        }
        this._pool.length = 0;
    }

    /**
     * @en Put a new Node into the pool.
     * It will automatically remove the node from its parent without cleanup.
     * It will also invoke unuse method of the poolHandlerComp if exist.
     * @zh 向缓冲池中存入一个不再需要的节点对象。
     * 这个函数会自动将目标节点从父节点上移除，但是不会进行 cleanup 操作。
     * 这个函数会调用 poolHandlerComp 的 unuse 函数，如果组件和函数都存在的话。
     * @example
     * import { instantiate } from 'cc';
     * const myNode = instantiate(this.template);
     * this.myPool.put(myNode);
     */
    public put (obj: Node): void {
        if (obj && this._pool.indexOf(obj) === -1) {
            // Remove from parent, but don't cleanup
            obj.removeFromParent();

            // Invoke pool handler
            // @ts-ignore
            const handler = this.poolHandlerComp ? obj.getComponent(this.poolHandlerComp) : null;
            if (handler && handler.unuse) {
                handler.unuse();
            }

            this._pool.push(obj);
        }
    }

    /**
     * @en Get a obj from pool, if no available object in pool, null will be returned.
     * This function will invoke the reuse function of poolHandlerComp if exist.
     * @zh 获取对象池中的对象，如果对象池没有可用对象，则返回空。
     * 这个函数会调用 poolHandlerComp 的 reuse 函数，如果组件和函数都存在的话。
     * @param args - 向 poolHandlerComp 中的 'reuse' 函数传递的参数
     * @example
     *   let newNode = this.myPool.get();
     */
    public get (...args: any[]): Node | null {
        const last = this._pool.length - 1;
        if (last < 0) {
            return null;
        } else {
            // Pop the last object in pool
            const obj = this._pool[last];
            this._pool.length = last;

            // Invoke pool handler
            // @ts-ignore
            const handler = this.poolHandlerComp ? obj.getComponent(this.poolHandlerComp) : null;
            if (handler && handler.reuse) {
                handler.reuse(arguments);
            }
            return obj;
        }
    }
}

legacyCC.NodePool = NodePool;
