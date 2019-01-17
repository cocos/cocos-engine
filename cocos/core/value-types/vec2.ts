/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
import {clamp, vec2} from '../vmath';
import Mat4 from './mat4';
import { ValueType } from './value-type';

/**
 * !#en Representation of 2D vectors and points.
 * !#zh 表示 2D 向量和坐标
 */
export default class Vec2 extends ValueType {
    public x: number;

    public y: number;

    /**
     * !#en
     * Constructor
     * see {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} or {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
     * !#zh
     * 构造函数，可查看 {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} 或者 {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
     * @param v
     */
    constructor (v: Vec2);

    /**
     * !#en
     * Constructor
     * see {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} or {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
     * !#zh
     * 构造函数，可查看 {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} 或者 {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
     * @param [x=0]
     * @param [y=0]
     */
    constructor (x?: number, y?: number);

    /**
     * !#en
     * Constructor
     * see {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} or {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
     * !#zh
     * 构造函数，可查看 {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} 或者 {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
     * @param [x=0]
     * @param [y=0]
     */
    constructor (x?: number | Vec2, y?: number) {
        super();
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    /**
     * !#en clone a Vec2 object
     * !#zh 克隆一个 Vec2 对象
     */
    public clone () {
        return new Vec2(this.x, this.y);
    }

    /**
     * !#en Sets vector with another's value
     * !#zh 设置向量值。
     * @param newValue - !#en new value to set. !#zh 要设置的新值
     * @return returns this
     * @chainable
     */
    public set (newValue: Vec2) {
        this.x = newValue.x;
        this.y = newValue.y;
        return this;
    }

    /**
     * !#en Check whether two vector equal
     * !#zh 当前的向量是否与指定的向量相等。
     * @param other
     * @return
     */
    public equals (other: Vec2) {
        return other && this.x === other.x && this.y === other.y;
    }

    /**
     * !#en Check whether two vector equal with some degree of variance.
     * !#zh
     * 近似判断两个点是否相等。<br/>
     * 判断 2 个向量是否在指定数值的范围之内，如果在则返回 true，反之则返回 false。
     * @param other
     * @param variance
     * @return
     */
    public fuzzyEquals (other: Vec2, variance: number) {
        if (this.x - variance <= other.x && other.x <= this.x + variance) {
            if (this.y - variance <= other.y && other.y <= this.y + variance) {
                return true;
            }
        }
        return false;
    }

    /**
     * !#en Transform to string with vector informations
     * !#zh 转换为方便阅读的字符串。
     */
    public toString () {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }

    /**
     * !#en Calculate linear interpolation result between this vector and another one with given ratio
     * !#zh 线性插值。
     * @param to
     * @param ratio - the interpolation coefficient
     * @param [out] - optional, the receiving vector, you can pass the same vec2
     * to save result to itself, if not provided, a new vec2 will be created
     * @return
     */
    public lerp (to: Vec2, ratio: number, out?: Vec2) {
        out = out || new Vec2();
        const x = this.x;
        const y = this.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        return out;
    }

    /**
     * !#en Clamp the vector between from float and to float.
     * !#zh
     * 返回指定限制区域后的向量。<br/>
     * 向量大于 max_inclusive 则返回 max_inclusive。<br/>
     * 向量小于 min_inclusive 则返回 min_inclusive。<br/>
     * 否则返回自身。
     * @param min_inclusive
     * @param max_inclusive
     * @return
     * @example
     * var min_inclusive = cc.v2(0, 0);
     * var max_inclusive = cc.v2(20, 20);
     * var v1 = cc.v2(20, 20).clamp(min_inclusive, max_inclusive); // Vec2 {x: 20, y: 20};
     * var v2 = cc.v2(0, 0).clamp(min_inclusive, max_inclusive);   // Vec2 {x: 0, y: 0};
     * var v3 = cc.v2(10, 10).clamp(min_inclusive, max_inclusive); // Vec2 {x: 10, y: 10};
     */
    public clampf (min_inclusive: Vec2, max_inclusive: Vec2) {
        this.x = clamp(this.x, min_inclusive.x, max_inclusive.x);
        this.y = clamp(this.y, min_inclusive.y, max_inclusive.y);
        return this;
    }

    /**
     * !#en Adds this vector. If you want to save result to another vector, use add() instead.
     * !#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
     * @param vector
     * @return returns this
     * @chainable
     * @example
     * var v = cc.v2(10, 10);
     * v.addSelf(cc.v2(5, 5));// return Vec2 {x: 15, y: 15};
     */
    public addSelf (vector: Vec2) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * !#en Adds two vectors, and returns the new result.
     * !#zh 向量加法，并返回新结果。
     * @param vector
     * @param [out] - optional, the receiving vector, you can pass the same vec2
     * to save result to itself, if not provided, a new vec2 will be created
     * @return the result
     * @example
     * var v = cc.v2(10, 10);
     * v.add(cc.v2(5, 5));      // return Vec2 {x: 15, y: 15};
     * var v1;
     * v.add(cc.v2(5, 5), v1);  // return Vec2 {x: 15, y: 15};
     */
    public add (vector: Vec2, out?: Vec2) {
        out = out || new Vec2();
        out.x = this.x + vector.x;
        out.y = this.y + vector.y;
        return out;
    }

    /**
     * !#en Subtracts one vector from this. If you want to save result to another vector, use sub() instead.
     * !#zh 向量减法。如果你想保存结果到另一个向量，可使用 sub() 代替。
     * @param vector
     * @return returns this
     * @chainable
     * @example
     * var v = cc.v2(10, 10);
     * v.subSelf(cc.v2(5, 5));// return Vec2 {x: 5, y: 5};
     */
    public subSelf (vector: Vec2) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /**
     * !#en Subtracts one vector from this, and returns the new result.
     * !#zh 向量减法，并返回新结果。
     * @param vector
     * @param [out] - optional, the receiving vector, you can pass the same vec2
     * to save result to itself, if not provided, a new vec2 will be created
     * @return the result
     * @example
     * var v = cc.v2(10, 10);
     * v.sub(cc.v2(5, 5));      // return Vec2 {x: 5, y: 5};
     * var v1;
     * v.sub(cc.v2(5, 5), v1);  // return Vec2 {x: 5, y: 5};
     */
    public sub (vector: Vec2, out?: Vec2) {
        out = out || new Vec2();
        out.x = this.x - vector.x;
        out.y = this.y - vector.y;
        return out;
    }

    /**
     * !#en Multiplies this by a number. If you want to save result to another vector, use mul() instead.
     * !#zh 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
     * @param num
     * @return returns this
     * @chainable
     * @example
     * var v = cc.v2(10, 10);
     * v.mulSelf(5);// return Vec2 {x: 50, y: 50};
     */
    public mulSelf (num: number) {
        this.x *= num;
        this.y *= num;
        return this;
    }

    /**
     * !#en Multiplies by a number, and returns the new result.
     * !#zh 缩放向量，并返回新结果。
     * @param num
     * @param [out] - optional, the receiving vector, you can pass the same vec2
     * to save result to itself, if not provided, a new vec2 will be created
     * @return the result
     * @example
     * var v = cc.v2(10, 10);
     * v.mul(5);      // return Vec2 {x: 50, y: 50};
     * var v1;
     * v.mul(5, v1);  // return Vec2 {x: 50, y: 50};
     */
    public mul (num: number, out?: Vec2) {
        out = out || new Vec2();
        out.x = this.x * num;
        out.y = this.y * num;
        return out;
    }

    /**
     * !#en Multiplies two vectors.
     * !#zh 分量相乘。
     * @param vector
     * @return returns this
     * @chainable
     * @example
     * var v = cc.v2(10, 10);
     * v.scaleSelf(cc.v2(5, 5));// return Vec2 {x: 50, y: 50};
     */
    public scaleSelf (vector: Vec2) {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    }

    /**
     * !#en Multiplies two vectors, and returns the new result.
     * !#zh 分量相乘，并返回新的结果。
     *
     * @param vector
     * @param [out] - optional, the receiving vector, you can pass the same vec2
     * to save result to itself, if not provided, a new vec2 will be created
     * @return the result
     * @example
     * var v = cc.v2(10, 10);
     * v.scale(cc.v2(5, 5));      // return Vec2 {x: 50, y: 50};
     * var v1;
     * v.scale(cc.v2(5, 5), v1);  // return Vec2 {x: 50, y: 50};
     */
    public scale (vector: Vec2, out?: Vec2) {
        out = out || new Vec2();
        out.x = this.x * vector.x;
        out.y = this.y * vector.y;
        return out;
    }

    /**
     * !#en Divides by a number. If you want to save result to another vector, use div() instead.
     * !#zh 向量除法。如果你想结果保存到另一个向量，可使用 div() 代替。
     * @param divisor
     * @return returns this
     * @chainable
     * @example
     * var v = cc.v2(10, 10);
     * v.divSelf(5); // return Vec2 {x: 2, y: 2};
     */
    public divSelf (num: number) {
        this.x /= num;
        this.y /= num;
        return this;
    }

    /**
     * !#en Divides by a number, and returns the new result.
     * !#zh 向量除法，并返回新的结果。
     *
     * @param divisor
     * @param [out] - optional, the receiving vector, you can pass the same vec2
     * to save result to itself, if not provided, a new vec2 will be created
     * @return the result
     * @example
     * var v = cc.v2(10, 10);
     * v.div(5);      // return Vec2 {x: 2, y: 2};
     * var v1;
     * v.div(5, v1);  // return Vec2 {x: 2, y: 2};
     */
    public div (num: number, out?: Vec2) {
        out = out || new Vec2();
        out.x = this.x / num;
        out.y = this.y / num;
        return out;
    }

    /**
     * !#en Negates the components. If you want to save result to another vector, use neg() instead.
     * !#zh 向量取反。如果你想结果保存到另一个向量，可使用 neg() 代替。
     * @return returns this
     * @chainable
     * @example
     * var v = cc.v2(10, 10);
     * v.negSelf(); // return Vec2 {x: -10, y: -10};
     */
    public negSelf () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * !#en Negates the components, and returns the new result.
     * !#zh 返回取反后的新向量。
     * @param [out] - optional, the receiving vector, you can pass the same vec2 to
     * save result to itself, if not provided, a new vec2 will be created
     * @return the result
     * @example
     * var v = cc.v2(10, 10);
     * var v1;
     * v.neg(v1);  // return Vec2 {x: -10, y: -10};
     */
    public neg (out?: Vec2) {
        out = out || new Vec2();
        out.x = -this.x;
        out.y = -this.y;
        return out;
    }

    /**
     * !#en Dot product
     * !#zh 当前向量与指定向量进行点乘。
     * @param [vector]
     * @return the result
     * @example
     * var v = cc.v2(10, 10);
     * v.dot(cc.v2(5, 5)); // return 100;
     */
    public dot (vector: Vec2) {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * !#en Cross product
     * !#zh 当前向量与指定向量进行叉乘。
     * @param [vector]
     * @return the result
     * @example
     * var v = cc.v2(10, 10);
     * v.cross(cc.v2(5, 5)); // return 0;
     */
    public cross (vector: Vec2) {
        return this.x * vector.y - this.y * vector.x;
    }

    /**
     * !#en Returns the length of this vector.
     * !#zh 返回该向量的长度。
     * @return the result
     * @example
     * var v = cc.v2(10, 10);
     * v.mag(); // return 14.142135623730951;
     */
    public mag () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * !#en Returns the squared length of this vector.
     * !#zh 返回该向量的长度平方。
     * @return the result
     * @example
     * var v = cc.v2(10, 10);
     * v.magSqr(); // return 200;
     */
    public magSqr () {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * !#en Make the length of this vector to 1.
     * !#zh 向量归一化，让这个向量的长度为 1。
     * @return returns this
     * @chainable
     * @example
     * var v = cc.v2(10, 10);
     * v.normalizeSelf(); // return Vec2 {x: 0.7071067811865475, y: 0.7071067811865475};
     */
    public normalizeSelf () {
        const magSqr = this.x * this.x + this.y * this.y;
        if (magSqr === 1.0) {
            return this;
        }

        if (magSqr === 0.0) {
            return this;
        }

        const invsqrt = 1.0 / Math.sqrt(magSqr);
        this.x *= invsqrt;
        this.y *= invsqrt;

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
     * @param [out] - optional, the receiving vector, you can pass the same vec2
     * to save result to itself, if not provided, a new vec2 will be created
     * @return result
     * var v = cc.v2(10, 10);
     * v.normalize();   // return Vec2 {x: 0.7071067811865475, y: 0.7071067811865475};
     */
    public normalize (out?: Vec2) {
        out = out || new Vec2();
        out.x = this.x;
        out.y = this.y;
        out.normalizeSelf();
        return out;
    }

    /**
     * !#en Get angle in radian between this and vector.
     * !#zh 夹角的弧度。
     * @param vector
     * @return from 0 to Math.PI
     */
    public angle (vector: Vec2) {
        const magSqr1 = this.magSqr();
        const magSqr2 = vector.magSqr();

        if (magSqr1 === 0 || magSqr2 === 0) {
            console.warn('Can\'t get angle between zero vector');
            return 0.0;
        }

        const dot = this.dot(vector);
        let theta = dot / (Math.sqrt(magSqr1 * magSqr2));
        theta = clamp(theta, -1.0, 1.0);
        return Math.acos(theta);
    }

    /**
     * !#en Get angle in radian between this and vector with direction.
     * !#zh 带方向的夹角的弧度。
     * @param vector
     * @return from -MathPI to Math.PI
     */
    public signAngle (vector: Vec2) {
        const angle = this.angle(vector);
        return this.cross(vector) < 0 ? -angle : angle;
    }

    /**
     * !#en rotate
     * !#zh 返回旋转给定弧度后的新向量。
     * @param radians
     * @param [out] - optional, the receiving vector, you can pass the same vec2 to
     * save result to itself, if not provided, a new vec2 will be created
     * @return the result
     */
    public rotate (radians: number, out?: Vec2) {
        out = out || new Vec2();
        out.x = this.x;
        out.y = this.y;
        return out.rotateSelf(radians);
    }

    /**
     * !#en rotate self
     * !#zh 按指定弧度旋转向量。
     * @param radians
     * @return returns this
     * @chainable
     */
    public rotateSelf (radians: number) {
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        const x = this.x;
        this.x = cos * x - sin * this.y;
        this.y = sin * x + cos * this.y;
        return this;
    }

    /**
     * !#en Calculates the projection of the current vector over the given vector.
     * !#zh 返回当前向量在指定 vector 向量上的投影向量。
     * @param vector
     * @return
     * @example
     * var v1 = cc.v2(20, 20);
     * var v2 = cc.v2(5, 5);
     * v1.project(v2); // Vec2 {x: 20, y: 20};
     */
    public project (vector: Vec2) {
        return vector.mul(this.dot(vector) / vector.dot(vector));
    }

    /**
     * Transforms the vec2 with a mat4. 3rd vector component is implicitly '0', 4th vector component is implicitly '1'
     * @param m matrix to transform with
     * @param [out] the receiving vector, you can pass the same vec2
     * to save result to itself, if not provided, a new vec2 will be created
     * @returns out
     */
    public transformMat4 (m: Mat4, out?: Vec2) {
        out = out || new Vec2();
        vec2.transformMat4(out, this, m);
    }

    // _serialize: function () {
    //    return [this.x, this.y];
    // },
    // _deserialize: function (data) {
    //    this.x = data[0];
    //    this.y = data[1];
    // }

    // static

    /**
     * !#en return a Vec2 object with x = 1 and y = 1.
     * !#zh 新 Vec2 对象。
     */
    static get ONE () {
        return new Vec2(1.0, 1.0);
    }

    /**
     * !#en return a Vec2 object with x = 0 and y = 0.
     * !#zh 返回 x = 0 和 y = 0 的 Vec2 对象。
     */
    static get ZERO () {
        return new Vec2(0.0, 0.0);
    }

    /**
     * !#en return a Vec2 object with x = 0 and y = 1.
     * !#zh 返回 x = 0 和 y = 1 的 Vec2 对象。
     */
    static get UP () {
        return new Vec2(0.0, 1.0);
    }

    /**
     * !#en return a Vec2 object with x = 1 and y = 0.
     * !#zh 返回 x = 1 和 y = 0 的 Vec2 对象。
     */
    static get RIGHT () {
        return new Vec2(1.0, 0.0);
    }
}

CCClass.fastDefine('cc.Vec2', Vec2, { x: 0, y: 0 });

cc.Vec2 = Vec2;

/**
 * !#en The convenience method to create a new {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}} 对象。
 * @param v
 * @return
 * @example
 * var v1 = cc.v2(0, 0);
 * var v2 = cc.v2(v1);
 */
function v2 (v: Vec2): Vec2;

/**
 * !#en The convenience method to create a new {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}} 对象。
 * @param [x=0]
 * @param [y=0]
 * @return
 * @example
 * var v1 = cc.v2();
 * var v2 = cc.v2(0, 0);
 */
function v2 (x?: number, y?: number): Vec2;

function v2 (x?: number | Vec2, y?: number) {
    return new Vec2(x as any, y);
}

export { v2 };

cc.v2 = v2;
