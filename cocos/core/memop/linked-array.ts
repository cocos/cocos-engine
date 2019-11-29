
/**
 * @category memop
 */

import { Pool } from './pool';

// NOTE: you must have `_prev` and `_next` field in the object returns by `fn`

interface INode {
    _prev: INode;
    _next: INode;
}

type NodeAllocator = () => INode;

/**
 * @zh 链表，可以自动分配对象。
 */
export default class LinkedArray<T = {}> {
    private _fn: NodeAllocator;
    private _count: number;
    private _head: INode | null;
    private _tail: INode | null;
    private _pool: Pool<INode>;

    /**
     * 构造函数。
     * @param fn 对象构建函数。
     * @param size 内置元素个数。
     */
    constructor (fn: NodeAllocator, size: number) {
        this._fn = fn;
        this._count = 0;
        this._head = null;
        this._tail = null;

        this._pool = new Pool(fn, size);
    }

    /**
     * @zh 获取链表头。
     */
    get head () {
        return this._head;
    }

    /**
     * @zh 获取链表尾。
     */
    get tail () {
        return this._tail;
    }

    /**
     * @zh 链表结点个数。
     */
    get length () {
        return this._count;
    }

    /**
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
     * @zh 删除链表中的一个结点。
     * @param node 要删除的结点。
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
     * @zh
     * 遍历整个链表。
     * @param fn 遍历函数。
     * @param binder 遍历函数的this对象。
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
