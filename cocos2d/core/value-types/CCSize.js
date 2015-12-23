var ValueType = require('./CCValueType');
var JS = require('../platform/js');

/**
 * cc.Size is the class for size object, please do not use its constructor to create sizes, use cc.size() alias function instead.
 * It will be deprecated soon, please use cc.Vec2 instead
 * @class Size
 * @param {Number} width
 * @param {Number} height
 * @see cc.size
 */
function Size (width, height) {
    if (width && typeof width === 'object') {
        height = width.height;
        width = width.width;
    }
    this.width = typeof width === 'number' ? width : 0;
    this.height = typeof height === 'number' ? height : 0;
}
JS.extend(Size, ValueType);
require('../platform/CCClass').fastDefine('cc.Size', Size, ['width', 'height']);

/**
 * return a Size object with width = 0 and height = 0.
 * @property ZERO
 * @type {Size}
 * @default new Size(0, 0)
 * @static
 */
JS.get(Size, 'ZERO', function () {
    return new Size(0.0, 0.0);
});

var proto = Size.prototype;

/**
 * @method clone
 * @return {Size}
 */
proto.clone = function () {
    return new Size(this.width, this.height);
};

/**
 * @method equals
 * @param {Size} other
 * @return {Boolean}
 */
proto.equals = function (other) {
    return other &&
           this.width === other.width &&
           this.height === other.height;
};

/**
 * @method lerp
 * @param {Rect} to
 * @param {Number} ratio - the interpolation coefficient.
 * @param {Size} [out] - optional, the receiving vector.
 * @return {Size}
 */
proto.lerp = function (to, ratio, out) {
    out = out || new Size();
    var width = this.width;
    var height = this.height;
    out.width = width + (to.width - width) * ratio;
    out.height = height + (to.height - height) * ratio;
    return out;
};

/**
 * @method toString
 * @return {String}
 */
proto.toString = function () {
    return '(' + this.width.toFixed(2) + ', ' + this.height.toFixed(2) + ')';
};

/**
 * Helper function that creates a cc.Size.
 * Please use cc.p or cc.v2 instead, it will soon replace cc.Size.
 *
 * @method size
 * @param {Number|Size} w  - width or a size object
 * @param {Number} h - height
 * @return {Size}
 * @example {@link utils/api/engine/docs/cocos2d/core/value-types/CCSize/size.js}
 */
cc.size = function (w, h) {
    return new Size(w, h);
};

/**
 * Check whether a point's value equals to another.
 * @method sizeEqualToSize
 * @param {Size} size1
 * @param {Size} size2
 * @return {Boolean}
 */
cc.sizeEqualToSize = function (size1, size2) {
    return (size1 && size2 && (size1.width === size2.width) && (size1.height === size2.height));
};

cc.Size = module.exports = Size;
