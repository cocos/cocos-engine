/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
import {clamp, vec3, vec4} from '../vmath';
import Mat4 from './mat4';
import { ValueType } from './value-type';

/**
 * !#en Representation of 3D vectors and points.
 * !#zh 表示 3D 向量和坐标
 *
 * @class Vec4
 * @extends ValueType
 */
export default class Vec4 extends ValueType {
    public x: number;

    public y: number;

    public z: number;

    public w: number;

    /**
     * !#en
     * Constructor
     * see {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
     * !#zh
     * 构造函数，可查看 {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
     *
     * @param v
     */
    constructor (v: Vec4);

    /**
     * !#en
     * Constructor
     * see {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
     * !#zh
     * 构造函数，可查看 {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
     *
     * @param [x=0]
     * @param [y=0]
     * @param [z=0]
     * @param [w=0]
     */
    constructor (x?: number, y?: number, z?: number, w?: number);

    constructor (x?: number | Vec4, y?: number, z?: number, w?: number) {
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
            this.w = w || 0;
        }
    }

    /**
     * !#en clone a Vec4 value
     * !#zh 克隆一个 Vec4 值
     *
     * @return
     */
    public clone () {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    /**
     * !#en Set the current vector value with the given vector.
     * !#zh 用另一个向量设置当前的向量对象值。
     *
     * @param newValue - !#en new value to set. !#zh 要设置的新值
     * @return returns this
     * @chainable
     */
    public set (newValue: Vec4) {
        this.x = newValue.x;
        this.y = newValue.y;
        this.z = newValue.z;
        this.w = newValue.w;
        return this;
    }

    /**
     * !#en Check whether the vector equals another one
     * !#zh 当前的向量是否与指定的向量相等。
     *
     * @param other
     * @return
     */
    public equals (other: Vec4) {
        return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
    }

    /**
     * !#en Check whether two vector equal with some degree of variance.
     * !#zh
     * 近似判断两个点是否相等。<br/>
     * 判断 2 个向量是否在指定数值的范围之内，如果在则返回 true，反之则返回 false。
     *
     * @param other
     * @param variance
     * @return
     */
    public fuzzyEquals (other: Vec4, variance: number) {
        if (this.x - variance <= other.x && other.x <= this.x + variance) {
            if (this.y - variance <= other.y && other.y <= this.y + variance) {
                if (this.z - variance <= other.z && other.z <= this.z + variance) {
                    if (this.w - variance <= other.w && other.w <= this.w + variance) {
                    return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * !#en Transform to string with vector informations
     * !#zh 转换为方便阅读的字符串。
     *
     * @return
     */
    public toString () {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}, ${this.w.toFixed(2)})`;
    }

    /**
     * !#en Calculate linear interpolation result between this vector and another one with given ratio
     * !#zh 线性插值。
     *
     * @param to
     * @param ratio - the interpolation coefficient
     * @param [out] - The receiving vector, can be `this`; if absent, a new vector would be created.
     * @return
     */
    public lerp (to: Vec4, ratio: number, out?: Vec4) {
        out = out || new Vec4();
        vec4.lerp(out, this, to, ratio);
        return out;
    }

    /**
     * !#en Clamp the vector between from float and to float.
     * !#zh
     * 返回指定限制区域后的向量。<br/>
     * 向量大于 max_inclusive 则返回 max_inclusive。<br/>
     * 向量小于 min_inclusive 则返回 min_inclusive。<br/>
     * 否则返回自身。
     *
     * @param min_inclusive
     * @param max_inclusive
     * @return
     */
    public clampf (min_inclusive: Vec4, max_inclusive: Vec4) {
        this.x = clamp(this.x, min_inclusive.x, max_inclusive.x);
        this.y = clamp(this.y, min_inclusive.y, max_inclusive.y);
        this.z = clamp(this.z, min_inclusive.z, max_inclusive.z);
        this.w = clamp(this.w, min_inclusive.w, max_inclusive.w);
        return this;
    }

    /**
     * !#en Adds this vector. If you want to save result to another vector, use add() instead.
     * !#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
     *
     * @param vector
     * @return returns this
     * @chainable
     */
    public addSelf (vector: Vec4) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        this.w += vector.w;
        return this;
    }

    /**
     * !#en Adds two vectors, and returns the new result.
     * !#zh 向量加法，并返回新结果。
     *
     * @param vector
     * @param [out] - The receiving vector, can be `this`; if absent, a new vector would be created.
     * @return the result
     */
    public add (vector: Vec4, out?: Vec4) {
        out = out || new Vec4();
        out.x = this.x + vector.x;
        out.y = this.y + vector.y;
        out.z = this.z + vector.z;
        out.w = this.w + vector.w;
        return out;
    }

    /**
     * !#en Subtracts one vector from this. If you want to save result to another vector, use sub() instead.
     * !#zh 向量减法。如果你想保存结果到另一个向量，可使用 sub() 代替。
     *
     * @param vector
     * @return returns this
     * @chainable
     */
    public subSelf (vector: Vec4) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        this.w -= vector.w;
        return this;
    }

    /**
     * !#en Subtracts one vector from this, and returns the new result.
     * !#zh 向量减法，并返回新结果。
     *
     * @param vector
     * @param [out] - The receiving vector, can be `this`; if absent, a new vector would be created.
     * @return the result
     */
    public sub (vector: Vec4, out?: Vec4) {
        out = out || new Vec4();
        out.x = this.x - vector.x;
        out.y = this.y - vector.y;
        out.z = this.z - vector.z;
        out.w = this.w - vector.w;
        return out;
    }

    /**
     * !#en Multiplies this by a number. If you want to save result to another vector, use mul() instead.
     * !#zh 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
     *
     * @param num
     * @return returns this
     * @chainable
     */
    public mulSelf (num: number) {
        this.x *= num;
        this.y *= num;
        this.z *= num;
        this.w *= num;
        return this;
    }

    /**
     * !#en Multiplies by a number, and returns the new result.
     * !#zh 缩放向量，并返回新结果。
     *
     * @param num
     * @param [out] - The receiving vector, can be `this`; if absent, a new vector would be created.
     * @return the result
     */
    public mul (num: number, out?: Vec4) {
        out = out || new Vec4();
        out.x = this.x * num;
        out.y = this.y * num;
        out.z = this.z * num;
        out.w = this.w * num;
        return out;
    }

    /**
     * !#en Multiplies two vectors.
     * !#zh 分量相乘。
     *
     * @param vector
     * @return returns this
     * @chainable
     */
    public scaleSelf (vector: Vec4) {
        this.x *= vector.x;
        this.y *= vector.y;
        this.z *= vector.z;
        this.w *= vector.w;
        return this;
    }

    /**
     * !#en Multiplies two vectors, and returns the new result.
     * !#zh 分量相乘，并返回新的结果。
     *
     * @param vector
     * @param [out] - The receiving vector, can be `this`; if absent, a new vector would be created.
     * @return the result
     */
    public scale (vector: Vec4, out?: Vec4) {
        out = out || new Vec4();
        out.x = this.x * vector.x;
        out.y = this.y * vector.y;
        out.z = this.z * vector.z;
        out.w = this.w * vector.w;
        return out;
    }

    /**
     * !#en Divides by a number. If you want to save result to another vector, use div() instead.
     * !#zh 向量除法。如果你想结果保存到另一个向量，可使用 div() 代替。
     *
     * @param vector
     * @return returns this
     * @chainable
     */
    public divSelf (num: number) {
        this.x /= num;
        this.y /= num;
        this.z /= num;
        this.w /= num;
        return this;
    }

    /**
     * !#en Divides by a number, and returns the new result.
     * !#zh 向量除法，并返回新的结果。
     *
     * @param vector
     * @param [out] - The receiving vector, can be `this`; if absent, a new vector would be created.
     * @return the result
     */
    public div (num: number, out?: Vec4) {
        out = out || new Vec4();
        out.x = this.x / num;
        out.y = this.y / num;
        out.z = this.z / num;
        out.w = this.w / num;
        return out;
    }

    /**
     * !#en Negates the components. If you want to save result to another vector, use neg() instead.
     * !#zh 向量取反。如果你想结果保存到另一个向量，可使用 neg() 代替。
     *
     * @return returns this
     * @chainable
     */
    public negSelf () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;
        return this;
    }

    /**
     * !#en Negates the components, and returns the new result.
     * !#zh 返回取反后的新向量。
     *
     * @param [out] - The receiving vector, can be `this`; if absent, a new vector would be created.
     * @return the result
     */
    public neg (out?: Vec4) {
        out = out || new Vec4();
        out.x = -this.x;
        out.y = -this.y;
        out.z = -this.z;
        out.w = -this.w;
        return out;
    }

    /**
     * !#en Dot product
     * !#zh 当前向量与指定向量进行点乘。
     *
     * @param [vector]
     * @return the result
     */
    public dot (vector: Vec4) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
    }

    /**
     * !#en Cross product
     * !#zh 当前向量与指定向量进行叉乘。
     *
     * @param vector
     * @param [out]
     * @return the result
     */
    public cross (vector: Vec4, out?: Vec4) {
        out = out || new Vec4();
        vec3.cross(out, this, vector);
        return out;
    }

    /**
     * !#en Returns the length of this vector.
     * !#zh 返回该向量的长度。
     *
     * @return the result
     * @example
     * var v = cc.v4(10, 10);
     * v.mag(); // return 14.142135623730951;
     */
    public mag () {
        const { x, y, z, w } = this;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * !#en Returns the squared length of this vector.
     * !#zh 返回该向量的长度平方。
     *
     * @return the result
     */
    public magSqr () {
        const { x, y, z, w } = this;
        return x * x + y * y + z * z + w * w;
    }

    /**
     * !#en Make the length of this vector to 1.
     * !#zh 向量归一化，让这个向量的长度为 1。
     *
     * @return returns this
     * @chainable
     */
    public normalizeSelf () {
        vec4.normalize(this, this);
        return this;
    }

    /**
     * !#en
     * Returns this vector with a magnitude of 1.<br/>
     * <br/>
     * Note that the current vector is unchanged and a new normalized vector is returned.
     * If you want to normalize the current vector, use normalizeSelf function.
     * !#zh
     * 返回归一化后的向量。<br/>
     * <br/>
     * 注意，当前向量不变，并返回一个新的归一化向量。如果你想来归一化当前向量，可使用 normalizeSelf 函数。
     *
     * @param [out] - The receiving vector, can be `this`; if absent, a new vector would be created.
     * @return result
     */
    public normalize (out?: Vec4) {
        out = out || new Vec4();
        vec4.normalize(out, this);
        return out;
    }

    /**
     * Transforms the vec4 with a mat4. 4th vector component is implicitly '1'
     *
     * @param m matrix to transform with
     * @param [out] The receiving vector, can be `this`; if absent, a new vector would be created.
     * @return out
     */
    public transformMat4 (m: Mat4, out?: Vec4) {
        out = out || new Vec4();
        vec4.transformMat4(out, this, m);
        return out;
    }
}

CCClass.fastDefine('cc.Vec4', Vec4, { x: 0, y: 0, z: 0, w: 0 });
cc.Vec4 = Vec4;

/**
 * !#en The convenience method to create a new {{#crossLink "Vec4"}}cc.Vec4{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Vec4"}}cc.Vec4{{/crossLink}} 对象。
 * @param v
 * @return
 * @example
 * var v1 = cc.v4();
 * var v2 = cc.v4(0, 0, 0);
 * var v3 = cc.v4(v2);
 * var v4 = cc.v4({x: 100, y: 100, z: 0});
 */
export function v4 (v: Vec4): Vec4;

/**
 * !#en The convenience method to create a new {{#crossLink "Vec4"}}cc.Vec4{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Vec4"}}cc.Vec4{{/crossLink}} 对象。
 * @param [x=0]
 * @param [y=0]
 * @param [z=0]
 * @param [w=0]
 * @return
 * @example
 * var v1 = cc.v4();
 * var v2 = cc.v4(0, 0, 0);
 * var v3 = cc.v4(v2);
 * var v4 = cc.v4({x: 100, y: 100, z: 0});
 */
export function v4 (x?: number, y?: number, z?: number, w?: number): Vec4;

export function v4 (x?: number | Vec4, y?: number, z?: number, w?: number) {
    return new Vec4(x as any, y, z, w);
}

cc.v4 = v4;
