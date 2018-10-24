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

var js = require('../platform/js');

/**
 * !#en The base class of all value types.
 * !#zh 所有值类型的基类。
 * @class ValueType
 *
 */
function ValueType () {}
js.setClassName('cc.ValueType', ValueType);

var proto = ValueType.prototype;

if (CC_EDITOR) {
    /**
     * !#en This method returns an exact copy of current value.
     * !#zh 克隆当前值，该方法返回一个新对象，新对象的值和原对象相等。
     * @method clone
     * @return {ValueType}
     */
    proto.clone = function () {
        cc.errorID('0100', js.getClassName(this) + '.clone');
        return null;
    };

    /**
     * !#en Compares this object with the other one.
     * !#zh 当前对象是否等于指定对象。
     * @method equals
     * @param {ValueType} other
     * @return {Boolean}
     */
    proto.equals = function (other) {
        cc.errorID('0100', js.getClassName(this) + '.equals');
        return false;
    };

    /**
     * !#en
     * Linearly interpolates between this value to to value by ratio which is in the range [0, 1].
     * When ratio = 0 returns this. When ratio = 1 return to. When ratio = 0.5 returns the average of this and to.
     * !#zh
     * 线性插值。<br/>
     * 当 ratio = 0 时返回自身，ratio = 1 时返回目标，ratio = 0.5 返回自身和目标的平均值。。
     * @method lerp
     * @param {ValueType} to - the to value
     * @param {number} ratio - the interpolation coefficient
     * @return {ValueType}
     */
    proto.lerp = function (to, ratio) {
        cc.errorID('0100', js.getClassName(this) + '.lerp');
        return this.clone();
    };

    /**
     * !#en
     * Copys all the properties from another given object to this value.
     * !#zh
     * 从其它对象把所有属性复制到当前对象。
     * @method set
     * @param {ValueType} source - the source to copy
     */
    proto.set = function (source) {
        cc.errorID('0100', js.getClassName(this) + '.set');
    };
}

/**
 * !#en TODO
 * !#zh 转换为方便阅读的字符串。
 * @method toString
 * @return {string}
 */
proto.toString = function () {
    return '' + {};
};

cc.ValueType = module.exports = ValueType;
