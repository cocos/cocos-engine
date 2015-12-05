var JS = require('../platform/js');

/**
 * The base class of all value types.
 * @class ValueType
 * @constructor
 */
function ValueType () {}
JS.setClassName('cc.ValueType', ValueType);

JS.mixin(ValueType.prototype, {
    /**
     * !#en This method returns an exact copy of current value.
     * !#zh 克隆当前值，该方法返回一个新对象，新对象的值和原对象相等。
     * @method clone
     * @return {ValueType}
     */
    clone: CC_EDITOR && function () {
        cc.error("%.clone not yet implemented.", JS.getClassName(this));
        return null;
    },

    /**
     * Compares this object with the other one.
     * @method equals
     * @param {ValueType} other
     * @return {Boolean}
     */
    equals: CC_EDITOR && function (other) {
        cc.error("%.equals not yet implemented.", JS.getClassName(this));
        return false;
    },

    /**
     * @method toString
     * @return {string}
     */
    toString: function () {
        return '' + {};
    },

    /**
     * Linearly interpolates between this value to to value by ratio which is in the range [0, 1].
     * When ratio = 0 returns this. When ratio = 1 return to. When ratio = 0.5 returns the average of this and to.
     * @method lerp
     * @param {ValueType} to - the to value
     * @param {number} ratio - the interpolation coefficient
     * @return {ValueType}
     */
    lerp: CC_EDITOR && function (to, ratio) {
        cc.warn("%.lerp not yet implemented.", JS.getClassName(this));
        return this.clone();
    }
});

cc.ValueType = ValueType;
module.exports = ValueType;
