export class OptimizedArray {
  /**
   * Initialize this array with specified capacity.
   * @param {Number} [size] The size. 
   */
  constructor(size = 0) {
    this._size = size;
    this._data = new Array(size);
  }

  /**
   * Size of this array.
   * @return {Number}
   */
  get size() {
    return this._size;
  }

  /**
   * The underlying Array of this array.
   * @return {Array}
   */
  get data() {
    return this._data;
  }

  /**
   * Capacity of this array.
   */
  get capacity() {
    return this._data.length;
  }

  /**
   * Push a value to back of this array.
   * @param {any} value 
   */
  push(value) {
    if (this._size > this._data.length)
      this._extends(this._data.length);
    this._data[this._size] = value;
    ++this._size;
  }

  /**
   * Remove the last element and return it, if exists.
   */
  pop() {
    if (this._size == 0)
      return;
    --this._size;
    let ret = this._data[this._size];
    this._data[this._size] = undefined;
    return ret;
  }

  /**
   * Remove all elements.
   */
  clear() {
    for (let i = 0; i < this._data.length; ++i)
      this._data[i] = undefined;
    this._size = 0;
  }

  /**
   * @ignore
   * @param {Number} size 
   */
  _extends(size) {
    let finalSize = this._data.length + size;
    for (let i = this._data.length; i < finalSize; ++i)
      this._data[i] = undefined;
  }
}

export class OptimizedValueArray {
  /**
   * Initialize this array with specified capacity.
   * @param {any} ctor The constructor to create the value.
   * @param {Number} [size] The size. 
   */
  constructor(ctor, dtor, size = 0) {
    this._size = size;
    this._data = new Array();
    this._ctor = ctor;
    this._dtor = dtor;
    this._extends(size);
  }

  /**
   * Size of this array.
   * @return {Number}
   */
  get size() {
    return this._size;
  }

  /**
   * The underlying Array of this array.
   * @return {Array}
   */
  get data() {
    return this._data;
  }

  /**
   * Capacity of this array.
   */
  get capacity() {
    return this._data.length;
  }

  /**
   * Push a value to back of this array.
   */
  push() {
    if (this._size >= this._data.length)
      this._extends(this._data.length + 1);
    let retval = this._data[this._size];
    ++this._size;
    return retval;
  }

  /**
   * Remove the last element, if exists.
   * Since that element is not erased, so we cannot return it.
   */
  pop() {
    if (this._size == 0)
      return;
    --this._size;
    this._dtor(this._data[this._size]);
  }

  /**
   * Remove all elements.
   */
  clear() {
    this._size = 0;
    for (let i = 0; i < this._data.length; ++i)
      this._dtor(this._data[i]);
  }

  splice(from, number) {
    if (number == 0)
      return;

    if (from >= this.size)
      return; // throw

    number = Math.min(this.size - from, number);

    let originalSize = this._size;
    this._size -= number;

    for (let i = 0, moveStart = from + number, moveNumber = originalSize - moveStart; i < moveNumber; ++i) {
      let temp = this._data[from + i];
      this._data[from + i] = this._data[moveStart + i];
      this._data[moveStart + i] = temp;
    }
    for (let i = this._size; i != originalSize; ++i)
      this._dtor(this._data[i]);
  }

  forEach(fx) {
    for (let i = 0; i < this.size; ++i)
      fx(this.data[i], i, this);
  }

  map(fx) {
    let result = new Array();
    for (let i = 0; i < this.size; ++i)
      result.push(fx(this.data[i], i, this));
    return result;
  }

  /**
   * @ignore
   * @param {Number} size 
   */
  _extends(size) {
    let finalSize = this._data.length + size;
    for (let i = this._data.length; i < finalSize; ++i)
      this._data[i] = this._ctor();
  }
}