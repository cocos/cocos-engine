/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import { ValueType } from './value-type';
import CCClass from '../data/class';
import quat from '../vmath/quat';

/**
 * !#en Representation of 2D vectors and points.
 * !#zh 表示 2D 向量和坐标
 *
 * @class Quat
 * @extends ValueType
 */
export default class Quat extends ValueType {
    /**
     * !#en
     * Constructor
     * see {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
     * !#zh
     * 构造函数，可查看 {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
     * @method constructor
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [z=0]
     * @param {number} [w=1]
     */
    constructor (x, y, z, w) {
        super();
        if (x && typeof x === 'object') {
            z = x.z;
            y = x.y;
            x = x.x;
            w = x.w;
        }
        /**
         * @property {Number} x
         */
        this.x = x || 0;
        /**
         * @property {Number} y
         */
        this.y = y || 0;
        /**
         * @property {Number} z
         */
        this.z = z || 0;
        /**
         * @property {Number} w
         */
        this.w = w || 1;
    }

    /**
     * !#en clone a Quat object and return the new object
     * !#zh 克隆一个四元数并返回
     * @method clone
     * @return {Quat}
     */
    clone () {
        return new Quat(this.x, this.y, this.z, this.w);
    }

    /**
     * !#en Set values with another quaternion
     * !#zh 用另一个四元数的值设置到当前对象上。
     * @method set
     * @param {Quat} newValue - !#en new value to set. !#zh 要设置的新值
     * @return {Quat} returns this
     * @chainable
     */
    set (newValue) {
        this.x = newValue.x;
        this.y = newValue.y;
        this.z = newValue.z;
        this.w = newValue.w;
        return this;
    }

    /**
     * !#en Check whether current quaternion equals another
     * !#zh 当前的四元数是否与指定的四元数相等。
     * @method equals
     * @param {Quat} other
     * @return {Boolean}
     */
    equals (other) {
        return other && this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
    }

    getEulerAngles (out) {
        out = out || cc.v3();
        return quat.toEuler(out, this);
    }

    lerp (to, ratio, out) {
        out = out || new cc.Quat();
        cc.vmath.quat.slerp(out, this, to, ratio);
        return out;
    }
}

CCClass.fastDefine('cc.Quat', Quat, { x: 0, y: 0, z: 0, w: 1 });

/**
 * @module cc
 */

/**
 * !#en The convenience method to create a new {{#crossLink "Quat"}}cc.Quat{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Quat"}}cc.Quat{{/crossLink}} 对象。
 * @method quat
 * @param {Number|Object} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [z=0]
 * @param {Number} [w=1]
 * @return {Quat}
 */
cc.quat = function(x, y, z, w) {
    return new Quat(x, y, z, w);
};

cc.Quat = Quat;
