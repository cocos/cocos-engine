export default class CircularPool {
  constructor(fn, size) {
    this._cursor = 0;
    this._data = new Array(size);

    for (let i = 0; i < size; ++i) {
      this._data[i] = fn();
    }
  }

  request() {
    let item = this._data[this._cursor];
    this._cursor = (this._cursor + 1) % this._data.length;

    return item;
  }
}