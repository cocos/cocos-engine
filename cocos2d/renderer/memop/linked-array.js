import Pool from './pool';

// NOTE: you must have `_prev` and `_next` field in the object returns by `fn`

export default class LinkedArray {
  constructor(fn, size) {
    this._fn = fn;
    this._count = 0;
    this._head = null;
    this._tail = null;

    this._pool = new Pool(fn, size);
  }

  get head() {
    return this._head;
  }

  get tail() {
    return this._tail;
  }

  get length() {
    return this._count;
  }

  add() {
    let node = this._pool.alloc();

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

  remove(node) {
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

  forEach(fn, binder) {
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