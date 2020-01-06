export default class Pool {
  constructor(fn, size) {
    this._fn = fn;
    this._idx = size - 1;
    this._frees = new Array(size);

    for (let i = 0; i < size; ++i) {
      this._frees[i] = fn();
    }
  }

  _expand(size) {
    let old = this._frees;
    this._frees = new Array(size);

    let len = size - old.length;
    for (let i = 0; i < len; ++i) {
      this._frees[i] = this._fn();
    }

    for (let i = len, j = 0; i < size; ++i, ++j) {
      this._frees[i] = old[j];
    }

    this._idx += len;
  }

  alloc() {
    // create some more space (expand by 20%, minimum 1)
    if (this._idx < 0) {
      this._expand(Math.round(this._frees.length * 1.2) + 1);
    }

    let ret = this._frees[this._idx];
    this._frees[this._idx] = null;
    --this._idx;

    return ret;
  }

  free(obj) {
    ++this._idx;
    this._frees[this._idx] = obj;
  }

  /**
   * 清除对象池。
   * @param fn 清除回调，对每个释放的对象调用一次。
   */
  clear (fn) {
    for (let i = 0; i <= this._idx; i++) {
        if (fn) {
            fn(this._frees[i]);
        }
    }
    this._frees.length = 0;
    this._idx = -1;
  }
}