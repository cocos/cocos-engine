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

import CCClass from '../data/class';
import quat from '../vmath/quat';
import { ValueType } from './value-type';
import Vec3 from './vec3';

/**
 * !#en Representation of 2D vectors and points.
 * !#zh 表示 2D 向量和坐标
 */
export default class Quat extends ValueType {
    public x: number;

    public y: number;

    public z: number;

    public w: number;

    /**
     * !#en
     * Constructor
     * see {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
     * !#zh
     * 构造函数，可查看 {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
     *
     * @param other
     */
    constructor (other: Quat);

    /**
     * !#en
     * Constructor
     * see {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
     * !#zh
     * 构造函数，可查看 {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
     *
     * @param [x=0]
     * @param [y=0]
     * @param [z=0]
     * @param [w=1]
     */
    constructor (x?: number, y?: number, z?: number, w?: number);

    constructor (x?: number | Quat, y?: number, z?: number, w?: number) {
        super();
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 1;
        }
    }

    /**
     * !#en clone a Quat object and return the new object
     * !#zh 克隆一个四元数并返回
     *
     * @return
     */
    public clone () {
        return new Quat(this.x, this.y, this.z, this.w);
    }

    /**
     * !#en Set values with another quaternion
     * !#zh 用另一个四元数的值设置到当前对象上。
     *
     * @param newValue - !#en new value to set. !#zh 要设置的新值
     * @return returns this
     * @chainable
     */
    public set (newValue: Quat) {
        this.x = newValue.x;
        this.y = newValue.y;
        this.z = newValue.z;
        this.w = newValue.w;
        return this;
    }

    /**
     * !#en Check whether current quaternion equals another
     * !#zh 当前的四元数是否与指定的四元数相等。
     *
     * @param other
     * @return
     */
    public equals (other: Quat) {
        return other && this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
    }

    public getEulerAngles (out?: Vec3) {
        out = out || new Vec3();
        return quat.toEuler(out, this);
    }

    public lerp (to: Quat, ratio: number, out?: Quat) {
        out = out || new Quat();
        cc.vmath.quat.slerp(out, this, to, ratio);
        return out;
    }
}

CCClass.fastDefine('cc.Quat', Quat, { x: 0, y: 0, z: 0, w: 1 });

/**
 * !#en The convenience method to create a new {{#crossLink "Quat"}}cc.Quat{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Quat"}}cc.Quat{{/crossLink}} 对象。
 *
 * @param other
 * @return
 */
function q (other: Quat): Quat;

/**
 * !#en The convenience method to create a new {{#crossLink "Quat"}}cc.Quat{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Quat"}}cc.Quat{{/crossLink}} 对象。
 *
 * @param [x=0]
 * @param [y=0]
 * @param [z=0]
 * @param [w=1]
 * @return
 */
function q (x?: number, y?: number, z?: number, w?: number): Quat;

function q (x: number | Quat = 0, y: number = 0, z: number = 0, w: number = 1) {
    return new Quat(x as any, y, z, w);
}

export {q as quat};

cc.quat = q;

cc.Quat = Quat;
