// import { attrTypeBytes } from './enums';
let {attrTypeBytes} = require("./enums");

// ====================
// exports
// ====================

class VertexFormat {
  /**
   * @constructor
   * @param {Array} infos
   *
   * @example
   * let vertexFmt = new VertexFormat([
   *   { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
   *   { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
   *   { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 4, normalize: true },
   * ])
   */
  constructor(infos) {
    this._attr2el = {};
    this._elements = [];
    this._bytes = 0;

    let offset = 0;
    for (let i = 0, len = infos.length; i < len; ++i) {
      let info = infos[i];
      let el = {
        name: info.name,
        offset: offset,
        stride: 0,
        stream: -1,
        type: info.type,
        num: info.num,
        normalize: (info.normalize === undefined) ? false : info.normalize,
        bytes: info.num * attrTypeBytes(info.type),
      };
      log('info.num is:' + info.num + ' attrTypeBytes(info.type) is:' + attrTypeBytes(info.type));

      this._attr2el[el.name] = el;
      this._elements.push(el);

      this._bytes += el.bytes;
      offset += el.bytes;
    }

    for (let i = 0, len = this._elements.length; i < len; ++i) {
      let el = this._elements[i];
      el.stride = this._bytes;
    }
  }

  /**
   * @method element
   * @param {string} attrName
   */
  element(attrName) {
    return this._attr2el[attrName];
  }
}

module.exports = VertexFormat