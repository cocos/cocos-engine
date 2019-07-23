/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

var ValueType = require('./value-type');
var js = require('../platform/js');

/**
 * !#en
 * cc.Size is the class for size object,<br/>
 * please do not use its constructor to create sizes,<br/>
 * use {{#crossLink "cc/size:method"}}{{/crossLink}} alias function instead.<br/>
 * It will be deprecated soon, please use cc.Vec2 instead.
 *
 * !#zh
 * cc.Size 是 size 对象的类。<br/>
 * 请不要使用它的构造函数创建的 size，<br/>
 * 使用 {{#crossLink "cc/size:method"}}{{/crossLink}} 别名函数。<br/>
 * 它不久将被取消，请使用cc.Vec2代替。
 *
 * @class Size
 */
/**
 * @method constructor
 * @param {Number|Size} width
 * @param {Number} [height]
 */
function Size (width, height) {
    if (width && typeof width === 'object') {
        height = width.height;
        width = width.width;
    }
    this.width = width || 0;
    this.height = height || 0;
}
js.extend(Size, ValueType);
require('../platform/CCClass').fastDefine('cc.Size', Size, { width: 0, height: 0});

/**
 * @property {Number} width
 */
/**
 * @property {Number} height
 */

/**
 * !#en return a Size object with width = 0 and height = 0.
 * !#zh 返回一个宽度为 0 和高度为 0 的 Size 对象。
 * @property ZERO
 * @type {Size}
 * @default new Size(0, 0)
 * @static
 */
js.get(Size, 'ZERO', function () {
    return new Size(0.0, 0.0);
});

var proto = Size.prototype;

/**
 * !#en TODO
 * !#zh 克隆 size 对象。
 * @method clone
 * @return {Size}
 * @example
 * var a = new cc.size(10, 10);
 * a.clone();// return Size {width: 0, height: 0};
 */
proto.clone = function () {
    return new Size(this.width, this.height);
};

/**
 * !#en TODO
 * !#zh 当前 Size 对象是否等于指定 Size 对象。
 * @method equals
 * @param {Size} other
 * @return {Boolean}
 * @example
 * var a = new cc.size(10, 10);
 * a.equals(new cc.size(10, 10));// return true;
 */
proto.equals = function (other) {
    return other &&
           this.width === other.width &&
           this.height === other.height;
};

/**
 * !#en TODO
 * !#zh 线性插值。
 * @method lerp
 * @param {Rect} to
 * @param {Number} ratio - the interpolation coefficient.
 * @param {Size} [out] - optional, the receiving vector.
 * @return {Size}
 * @example
 * var a = new cc.size(10, 10);
 * var b = new cc.rect(50, 50, 100, 100);
 * update (dt) {
 *    // method 1;
 *    var c = a.lerp(b, dt * 0.1);
 *    // method 2;
 *    a.lerp(b, dt * 0.1, c);
 * }
 */
proto.lerp = function (to, ratio, out) {
    out = out || new Size();
    var width = this.width;
    var height = this.height;
    out.width = width + (to.width - width) * ratio;
    out.height = height + (to.height - height) * ratio;
    return out;
};

proto.set = function (source) {
    this.width = source.width;
    this.height = source.height;
};

/**
 * !#en TODO
 * !#zh 转换为方便阅读的字符串。
 * @method toString
 * @return {String}
 * @example
 * var a = new cc.size(10, 10);
 * a.toString();// return "(10.00, 10.00)";
 */
proto.toString = function () {
    return '(' + this.width.toFixed(2) + ', ' + this.height.toFixed(2) + ')';
};

/**
 * @module cc
 */

/**
 * !#en
 * Helper function that creates a cc.Size.<br/>
 * Please use cc.p or cc.v2 instead, it will soon replace cc.Size.
 * !#zh
 * 创建一个 cc.Size 对象的帮助函数。<br/>
 * 注意：可以使用 cc.p 或者是 cc.v2 代替，它们将很快取代 cc.Size。
 * @method size
 * @param {Number|Size} w - width or a size object
 * @param {Number} [h] - height
 * @return {Size}
 * @example {@link cocos2d/core/value-types/CCSize/size.js}
 */
cc.size = function (w, h) {
    return new Size(w, h);
};

cc.Size = module.exports = Size;
