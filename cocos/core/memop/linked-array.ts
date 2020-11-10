/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */


/**
 * @packageDocumentation
 * @module memop
 */

import { Pool } from './pool';

// NOTE: you must have `_prev` and `_next` field in the object returns by `fn`

interface INode {
    _prev: INode;
    _next: INode;
}

type NodeAllocator = () => INode;

/**
 * @en Linked list, it can pre-allocate objects for the given size in constructor.
 * @zh 链表，在构造时可以自动预创建指定数量的对象。
 */
export default class LinkedArray<T = {}> {
    private _fn: NodeAllocator;
    private _count: number;
    private _head: INode | null;
    private _tail: INode | null;
    private _pool: Pool<INode>;

    /**
     * @param fn Allocator function
     * @param size Initial size of the linked array
     */
    constructor (fn: NodeAllocator, size: number) {
        this._fn = fn;
        this._count = 0;
        this._head = null;
        this._tail = null;

        this._pool = new Pool(fn, size);
    }

    /**
     * @en Get the head of the linked list.
     * @zh 获取链表头。
     */
    get head () {
        return this._head;
    }

    /**
     * @en Get the tail of the linked list.
     * @zh 获取链表尾。
     */
    get tail () {
        return this._tail;
    }

    /**
     * @en Number of objects in the linked list.
     * @zh 链表结点个数。
     */
    get length () {
        return this._count;
    }

    /**
     * @en Add an element to the end of the linked list.
     * @zh 在链表尾添加一个元素。
     */
    public add () {
        const node = this._pool.alloc();

        if (!this._tail) {
            this._head = node;
        } else {
            this._tail._next = node;
            node._prev = this._tail;
        }
        this._tail = node;
        this._count += 1;

        return node;
    }

    /**
     * @en Remove an element in the linked list.
     * @zh 删除链表中的一个结点。
     * @param node The element to be deleted
     */
    public remove (node) {
        if (node._prev) {
            node._prev._next = node._next;
        } else {
            this._head = node._next;
        }

        if (node._next) {
            node._next._prev = node._prev;
        } else {
            this._tail = node._prev;
        }

        node._next = null;
        node._prev = null;
        this._pool.free(node);
        this._count -= 1;
    }

    /**
     * @en
     * Execute an action on all elements of the linked list.
     * @zh
     * 遍历整个链表并执行目标函数，可以指定调用者。
     * @param fn Function to be executed for each element
     * @param binder The caller `this` to execute the function
     */
    public forEach (fn, binder) {
        let cursor = this._head;
        if (!cursor) {
            return;
        }

        if (binder) {
            fn = fn.bind(binder);
        }

        let idx = 0;
        let next = cursor;

        while (cursor) {
            next = cursor._next;
            fn(cursor, idx, this);

            cursor = next;
            ++idx;
        }
    }
}
