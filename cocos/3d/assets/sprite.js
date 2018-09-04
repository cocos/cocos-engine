import Asset from './asset';
import { vec3, mat4 } from '../vmath';

let _t_tmp = vec3.create(0, 0, 0);
let _s_tmp = vec3.create(0, 0, 0);
let _mat4_tmp = mat4.create();
let _textureMatrix = mat4.create();

export default class Sprite extends Asset {
  constructor() {
    super();

    this._texture = null;
    this._x = 0;
    this._y = 0;
    this._width = 64;
    this._height = 64;
    this._rotated = false;

    // sliced information
    this._left = 0;
    this._right = 0;
    this._top = 0;
    this._bottom = 0;

    // cached 16 uvs
    /**
     * uv12  uv13  uv14  uv15
     * uv08  uv09  uv10  uv11
     * uv04  uv05  uv06  uv07
     * uv00  uv01  uv02  uv03
     */

    // ues vec3 for uv to make it better use mat4 texture matrix
    this._uvs = new Array(16);
    for (let i = 0; i < 16; ++i) {
      this._uvs[i] = vec3.create(0, 0, 0);
    }
  }

  get texture() {
    return this._texture;
  }
  set texture(val) {
    this._texture = val;
  }

  get x() {
    return this._x;
  }
  set x(val) {
    this._x = val;
  }

  get y() {
    return this._y;
  }
  set y(val) {
    this._y = val;
  }

  get width() {
    return this._width;
  }
  set width(val) {
    this._width = val;
  }

  get height() {
    return this._height;
  }
  set height(val) {
    this._height = val;
  }

  get rotated() {
    return this._rotated;
  }
  set rotated(val) {
    this._rotated = val;
  }

  get left() {
    return this._left;
  }
  set left(val) {
    this._left = val;
  }

  get right() {
    return this._right;
  }
  set right(val) {
    this._right = val;
  }

  get top() {
    return this._top;
  }
  set top(val) {
    this._top = val;
  }

  get bottom() {
    return this._bottom;
  }
  set bottom(val) {
    this._bottom = val;
  }

  get uvs() {
    return this._uvs;
  }

  // commit values and calculated cached values
  commit() {
    // todo: check if some value exceeds the bounds, such as x < 0, or x + width > texture.width

    let textureWidth = this._texture.width;
    let textureHeight = this._texture.height;

    // calculate texture matrix
    /**
     * if sprite is rotated
     * 3----4  is rotated to 1----3
     * |    |                |    |
     * |    |                |    |
     * 1----2                2----4
     */
    if (this._rotated) {
      vec3.set(_s_tmp, this._width, this._height, 1.0);
      mat4.fromScaling(_textureMatrix, _s_tmp);
      mat4.fromZRotation(_mat4_tmp, -Math.PI / 2);
      mat4.multiply(_textureMatrix, _mat4_tmp, _textureMatrix);

      vec3.set(_t_tmp, this._x, textureHeight - this._y, 0.0);
      mat4.fromTranslation(_mat4_tmp, _t_tmp);
      mat4.multiply(_textureMatrix, _mat4_tmp, _textureMatrix);

      vec3.set(_s_tmp, 1 / textureWidth, 1 / textureHeight, 1.0);
      mat4.fromScaling(_mat4_tmp, _s_tmp);
      mat4.multiply(_textureMatrix, _mat4_tmp, _textureMatrix);
    } else {
      vec3.set(_s_tmp, this._width, this._height, 1.0);
      mat4.fromScaling(_textureMatrix, _s_tmp);

      vec3.set(_t_tmp, this._x, textureHeight - (this._y + this._height), 0.0);
      mat4.fromTranslation(_mat4_tmp, _t_tmp);
      mat4.multiply(_textureMatrix, _mat4_tmp, _textureMatrix);

      vec3.set(_s_tmp, 1 / textureWidth, 1 / textureHeight, 1.0);
      mat4.fromScaling(_mat4_tmp, _s_tmp);
      mat4.multiply(_textureMatrix, _mat4_tmp, _textureMatrix);
    }

    // calculate uvs
    let uvs = this._uvs;
    uvs[0].x = uvs[4].x = uvs[8].x = uvs[12].x = 0.0;
    uvs[1].x = uvs[5].x = uvs[9].x = uvs[13].x = this._left / this._width;
    uvs[2].x = uvs[6].x = uvs[10].x = uvs[14].x = 1.0 - this._right / this._width;
    uvs[3].x = uvs[7].x = uvs[11].x = uvs[15].x = 1.0;

    uvs[0].y = uvs[1].y = uvs[2].y = uvs[3].y = 0.0;
    uvs[4].y = uvs[5].y = uvs[6].y = uvs[7].y = this._bottom / this._height;
    uvs[8].y = uvs[9].y = uvs[10].y = uvs[11].y = 1.0 - this._top / this._height;
    uvs[12].y = uvs[13].y = uvs[14].y = uvs[15].y = 1.0;

    // multiply uv by texture matrix
    for (let i = 0; i < this._uvs.length; ++i) {
      vec3.transformMat4(this._uvs[i], this._uvs[i], _textureMatrix);
    }
  }
}