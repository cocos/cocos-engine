/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @module core/math
 */

import { CCClass } from '../data/class';
import { Mat4 } from './mat4';
import { IMat3Like, IMat4Like, IVec2Like, FloatArray } from './type-define';
import { clamp, EPSILON, random } from './utils';
import { Vec3 } from './vec3';
import { legacyCC } from '../global-exports';
import { MathBase } from './math-base';

/**
 * @en Representation of 2D vectors and points.
 * @zh 二维向量。
 */
export class Vec2 extends MathBase {
    public static ZERO = Object.freeze(new Vec2(0, 0));
    public static ONE = Object.freeze(new Vec2(1, 1));
    public static NEG_ONE = Object.freeze(new Vec2(-1, -1));
    public static UNIT_X = Object.freeze(new Vec2(1, 0));
    public static UNIT_Y = Object.freeze(new Vec2(0, 1));

    /**
     * @en Obtains a clone of the given vector object
     * @zh 获得指定向量的拷贝
     */
    public static clone <Out extends IVec2Like> (a: Readonly<IVec2Like>) {
        return new Vec2(a.x, a.y);
    }

    /**
     * @en Copy the target vector and save the results to out vector object
     * @zh 复制目标向量
     */
    public static copy <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>) {
        out.x = a.x;
        out.y = a.y;
        return out;
    }

    /**
     * @en Sets the out vector with the given x and y values
     * @zh 设置向量值
     */
    public static set <Out extends IVec2Like> (out: Out, x: number, y: number) {
        out.x = x;
        out.y = y;
        return out;
    }

    /**
     * @en Element-wise vector addition and save the results to out vector object
     * @zh 逐元素向量加法
     */
    public static add <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    }

    /**
     * @en Element-wise vector subtraction and save the results to out vector object
     * @zh 逐元素向量减法
     */
    public static subtract <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    }

    /**
     * @en Element-wise vector multiplication and save the results to out vector object
     * @zh 逐元素向量乘法
     */
    public static multiply <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        return out;
    }

    /**
     * @en Element-wise vector division and save the results to out vector object
     * @zh 逐元素向量除法
     */
    public static divide <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        return out;
    }

    /**
     * @en Rounds up by elements of the vector and save the results to out vector object
     * @zh 逐元素向量向上取整
     */
    public static ceil <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        return out;
    }

    /**
     * @en Element-wise rounds down of the current vector and save the results to the out vector
     * @zh 逐元素向量向下取整
     */
    public static floor <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        return out;
    }

    /**
     * @en Calculates element-wise minimum values and save to the out vector
     * @zh 逐元素向量最小值
     */
    public static min <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        return out;
    }

    /**
     * @en Calculates element-wise maximum values and save to the out vector
     * @zh 逐元素向量最大值
     */
    public static max <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        return out;
    }

    /**
     * @en Calculates element-wise round results and save to the out vector
     * @zh 逐元素向量四舍五入取整
     */
    public static round <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        return out;
    }

    /**
     * @en Vector scalar multiplication and save the results to out vector object
     * @zh 向量标量乘法
     */
    public static multiplyScalar <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        return out;
    }

    /**
     * @en Element-wise multiplication and addition with the equation: a + b * scale
     * @zh 逐元素向量乘加: A + B * scale
     */
    public static scaleAndAdd <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>, b: Readonly<IVec2Like>, scale: number) {
        out.x = a.x + (b.x * scale);
        out.y = a.y + (b.y * scale);
        return out;
    }

    /**
     * @en Calculates the euclidean distance of two vectors
     * @zh 求两向量的欧氏距离
     */
    public static distance <Out extends IVec2Like> (a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * @en Calculates the squared euclidean distance of two vectors
     * @zh 求两向量的欧氏距离平方
     */
    public static squaredDistance <Out extends IVec2Like> (a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        return x * x + y * y;
    }

    /**
     * @en Calculates the length of the vector
     * @zh 求向量长度
     */
    public static len <Out extends IVec2Like> (a: Readonly<IVec2Like>) {
        const x = a.x;
        const y = a.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * @en Calculates the squared length of the vector
     * @zh 求向量长度平方
     */
    public static lengthSqr <Out extends IVec2Like> (a: Readonly<IVec2Like>) {
        const x = a.x;
        const y = a.y;
        return x * x + y * y;
    }

    /**
     * @en Sets each element to its negative value
     * @zh 逐元素向量取负
     */
    public static negate <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>) {
        out.x = -a.x;
        out.y = -a.y;
        return out;
    }

    /**
     * @en Sets each element to its inverse value, zero value will become Infinity
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    public static inverse <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        return out;
    }

    /**
     * @en Sets each element to its inverse value, zero value will remain zero
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    public static inverseSafe <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>) {
        const x = a.x;
        const y = a.y;

        if (Math.abs(x) < EPSILON) {
            out.x = 0;
        } else {
            out.x = 1.0 / x;
        }

        if (Math.abs(y) < EPSILON) {
            out.y = 0;
        } else {
            out.y = 1.0 / y;
        }

        return out;
    }

    /**
     * @en Sets the normalized vector to the out vector
     * @zh 归一化向量
     */
    public static normalize <Out extends IVec2Like> (out: Out, a: IVec2Like) {
        const x = a.x;
        const y = a.y;
        let len = x * x + y * y;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = x * len;
            out.y = y * len;
        }
        return out;
    }

    /**
     * @en Calculates the dot product of the vector
     * @zh 向量点积（数量积）
     */
    public static dot <Out extends IVec2Like> (a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * @en Calculates the cross product of the vector
     * @zh 向量叉积（向量积），注意二维向量的叉积为与 Z 轴平行的三维向量
     */
    public static cross <Out extends IVec2Like> (out: Vec3, a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        out.x = out.y = 0;
        out.z = a.x * b.y - a.y * b.x;
        return out;
    }

    /**
     * @en Calculates the linear interpolation between two vectors with a given ratio
     * @zh 逐元素向量线性插值： A + t * (B - A)
     */
    public static lerp <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>, b: Readonly<IVec2Like>, t: number) {
        const x = a.x;
        const y = a.y;
        out.x = x + t * (b.x - x);
        out.y = y + t * (b.y - y);
        return out;
    }

    /**
     * @en Generates a uniformly distributed random vector points from center to the surface of the unit sphere
     * @zh 生成一个在单位圆上均匀分布的随机向量
     * @param scale vector length
     */
    public static random <Out extends IVec2Like> (out: Out, scale?: number) {
        scale = scale || 1.0;
        const r = random() * 2.0 * Math.PI;
        out.x = Math.cos(r) * scale;
        out.y = Math.sin(r) * scale;
        return out;
    }

    /**
     * @en Vector and third order matrix multiplication, will complete the vector with a third value as one
     * @zh 向量与三维矩阵乘法，默认向量第三位为 1。
     */
    public static transformMat3 <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>, m: Readonly<IMat3Like>) {
        const x = a.x;
        const y = a.y;
        out.x = m.m00 * x + m.m03 * y + m.m06;
        out.y = m.m01 * x + m.m04 * y + m.m07;
        return out;
    }

    /**
     * @en Vector and third order matrix multiplication, will complete the vector with a third and a fourth element as one
     * @zh 向量与四维矩阵乘法，默认向量第三位为 0，第四位为 1。
     */
    public static transformMat4 <Out extends IVec2Like> (out: Out, a: Readonly<IVec2Like>, m: Readonly<IMat4Like>) {
        const x = a.x;
        const y = a.y;
        out.x = m.m00 * x + m.m04 * y + m.m12;
        out.y = m.m01 * x + m.m05 * y + m.m13;
        return out;
    }

    /**
     * @en Gets the string representation of the given vector
     * @zh 返回向量的字符串表示
     */
    public static str <Out extends IVec2Like> (a: Readonly<IVec2Like>) {
        return `Vec2(${a.x}, ${a.y})`;
    }

    /**
     * @en Converts the given vector to an array
     * @zh 向量转数组
     * @param ofs Array Start Offset
     */
    public static toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec2Like, ofs = 0) {
        out[ofs + 0] = v.x;
        out[ofs + 1] = v.y;
        return out;
    }

    /**
     * @en Converts the given array to a vector
     * @zh 数组转向量
     * @param ofs Array Start Offset
     */
    public static fromArray <Out extends IVec2Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0) {
        out.x = arr[ofs + 0];
        out.y = arr[ofs + 1];
        return out;
    }

    /**
     * @en Check the equality of the two given vectors
     * @zh 向量等价判断
     */
    public static strictEquals <Out extends IVec2Like> (a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        return a.x === b.x && a.y === b.y;
    }

    /**
     * @en Check whether the two given vectors are approximately equivalent
     * @zh 排除浮点数误差的向量近似等价判断
     */
    public static equals <Out extends IVec2Like> (a: Readonly<IVec2Like>, b: Readonly<IVec2Like>,  epsilon = EPSILON) {
        return (
            Math.abs(a.x - b.x)
            <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x))
            && Math.abs(a.y - b.y)
            <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y))
        );
    }

    /**
     * @en Calculates the radian angle between two vectors
     * @zh 求两向量夹角弧度
     */
    public static angle <Out extends IVec2Like> (a: Readonly<IVec2Like>, b: Readonly<IVec2Like>) {
        Vec2.normalize(v2_1, a);
        Vec2.normalize(v2_2, b);
        const cosine = Vec2.dot(v2_1, v2_2);
        if (cosine > 1.0) {
            return 0;
        }
        if (cosine < -1.0) {
            return Math.PI;
        }
        return Math.acos(cosine);
    }

    /**
     * @en x component.
     * @zh x 分量。
     */
    public get x (): number {
        return this._array[0];
    }
    public set x (x: number) {
        this._array[0] = x;
    }

    /**
     * @en The y value of the vector.
     * @zh y 分量。
     */
    public get y (): number {
        return this._array[1];
    }
    public set y (y: number) {
        this._array[1] = y;
    }

    constructor (x: Vec2 | FloatArray);

    constructor (x?: number, y?: number);

    constructor (x?: number | Vec2 | FloatArray, y?: number) {
        super();
        if (x && typeof x === 'object') {
            if (ArrayBuffer.isView(x)) {
                this._array = x;
            } else {
                const v = x.array;
                this._array = MathBase.createFloatArray(2);
                this._array[0] = v[0];
                this._array[1] = v[1];
            }
        } else {
            this._array = MathBase.createFloatArray(2);
            this._array[0] = x || 0;
            this._array[1] = y || 0;
        }
    }

    /**
     * @en clone a Vec2 value
     * @zh 克隆当前向量。
     */
    public clone () {
        return new Vec2(this._array[0], this._array[1]);
    }

    /**
     * @en Set the current vector value with the given vector.
     * @zh 设置当前向量使其与指定向量相等。
     * @param other Specified vector
     * @return `this`
     */
    public set (other: Readonly<Vec2>);

    /**
     * @en Set the value of each component of the current vector.
     * @zh 设置当前向量的具体分量值。
     * @param x x value
     * @param y y value
     * @return `this`
     */
    public set (x?: number, y?: number);

    public set (x?: number | Readonly<Vec2>, y?: number) {
        if (x && typeof x === 'object') {
            const v = x.array;
            this._array[0] = v[0];
            this._array[1] = v[1];
        } else {
            this._array[0] = x || 0;
            this._array[1] = y || 0;
        }
        return this;
    }

    /**
     * @en Check whether the vector approximately equals another one.
     * @zh 判断当前向量是否在误差范围内与指定向量相等。
     * @param other Specified vector
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @return Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    public equals (other: Readonly<Vec2>, epsilon = EPSILON) {
        const v = other.array;
        return (
            Math.abs(this._array[0] - v[0])
            <= epsilon * Math.max(1.0, Math.abs(this._array[0]), Math.abs(v[0]))
            && Math.abs(this._array[1] - v[1])
            <= epsilon * Math.max(1.0, Math.abs(this._array[1]), Math.abs(v[1]))
        );
    }

    /**
     * @en Check whether the vector approximately equals another one.
     * @zh 判断当前向量是否在误差范围内与指定分量的向量相等。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @return Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    public equals2f (x: number, y: number, epsilon = EPSILON) {
        return (
            Math.abs(this._array[0] - x)
            <= epsilon * Math.max(1.0, Math.abs(this._array[0]), Math.abs(x))
            && Math.abs(this._array[1] - y)
            <= epsilon * Math.max(1.0, Math.abs(this._array[1]), Math.abs(y))
        );
    }

    /**
     * @en Check whether the current vector strictly equals another Vec2.
     * @zh 判断当前向量是否与指定向量相等。
     * @param other specified vector
     * @return Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    public strictEquals (other: Readonly<Vec2>) {
        const v = other.array;
        return other && this._array[0] === v[0] && this._array[1] === v[1];
    }

    /**
     * @en Check whether the current vector strictly equals another Vec2.
     * @zh 判断当前向量是否与指定分量的向量相等。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @return Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    public strictEquals2f (x: number, y: number) {
        return this._array[0] === x && this._array[1] === y;
    }

    /**
     * @en Transform to string with vector information.
     * @zh 返回当前向量的字符串表示。
     * @returns The string with vector information
     */
    public toString () {
        return `(${this._array[0].toFixed(2)}, ${this._array[1].toFixed(2)})`;
    }

    /**
     * @en Calculate linear interpolation result between this vector and another one with given ratio.
     * @zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param to Target vector
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    public lerp (to: Vec2, ratio: number) {
        const x = this._array[0];
        const y = this._array[1];
        const v = to.array;
        this._array[0] = x + ratio * (v[0] - x);
        this._array[1] = y + ratio * (v[1] - y);
        return this;
    }

    /**
     * @en Clamp the vector between minInclusive and maxInclusive.
     * @zh 设置当前向量的值，使其各个分量都处于指定的范围内。
     * @param minInclusive Minimum value allowed
     * @param maxInclusive Maximum value allowed
     * @return `this`
     */
    public clampf (minInclusive: Vec2, maxInclusive: Vec2) {
        const min = minInclusive.array;
        const max = maxInclusive.array;
        this._array[0] = clamp(this._array[0], min[0], max[0]);
        this._array[1] = clamp(this._array[1], min[1], max[1]);
        return this;
    }

    /**
     * @en Adds the current vector with another one and return this
     * @zh 向量加法。将当前向量与指定向量的相加
     * @param other specified vector
     */
    public add (other: Readonly<Vec2>) {
        const v = other.array;
        this._array[0] += v[0];
        this._array[1] += v[1];
        return this;
    }

    /**
     * @en Adds the current vector with another one and return this
     * @zh 向量加法。将当前向量与指定分量的向量相加
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     */
    public add2f (x: number, y: number) {
        this._array[0] += x;
        this._array[1] += y;
        return this;
    }

    /**
     * @en Subtracts one vector from this, and returns this.
     * @zh 向量减法。将当前向量减去指定向量
     * @param other specified vector
     */
    public subtract (other: Readonly<Vec2>) {
        const v = other.array;
        this._array[0] -= v[0];
        this._array[1] -= v[1];
        return this;
    }

    /**
     * @en Subtracts one vector from this, and returns this.
     * @zh 向量减法。将当前向量减去指定分量的向量
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     */
    public subtract2f (x: number, y: number) {
        this._array[0] -= x;
        this._array[1] -= y;
        return this;
    }

    /**
     * @en Multiplies the current vector with a number, and returns this.
     * @zh 向量数乘。将当前向量数乘指定标量
     * @param scalar scalar number
     */
    public multiplyScalar (scalar: number) {
        if (typeof scalar === 'object') { console.warn('should use Vec2.multiply for vector * vector operation'); }
        this._array[0] *= scalar;
        this._array[1] *= scalar;
        return this;
    }

    /**
     * @en Multiplies the current vector with another one and return this
     * @zh 向量乘法。将当前向量乘以与指定向量的结果赋值给当前向量。
     * @param other specified vector
     */
    public multiply (other: Readonly<Vec2>) {
        if (typeof other !== 'object') { console.warn('should use Vec2.scale for vector * scalar operation'); }
        const v = other.array;
        this._array[0] *= v[0];
        this._array[1] *= v[1];
        return this;
    }

    /**
     * @en Multiplies the current vector with another one and return this
     * @zh 向量乘法。将当前向量与指定分量的向量相乘的结果赋值给当前向量。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     */
    public multiply2f (x: number, y: number) {
        this._array[0] *= x;
        this._array[1] *= y;
        return this;
    }

    /**
     * @en Element-wisely divides this vector with another one, and return this.
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param other specified vector
     */
    public divide (other: Readonly<Vec2>) {
        const v = other.array;
        this._array[0] /= v[0];
        this._array[1] /= v[1];
        return this;
    }

    /**
     * @en Element-wisely divides this vector with another one, and return this.
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     */
    public divide2f (x: number, y: number) {
        this._array[0] /= x;
        this._array[1] /= y;
        return this;
    }

    /**
     * @en Sets each component of this vector with its negative value
     * @zh 将当前向量的各个分量取反
     */
    public negative () {
        this._array[0] = -this._array[0];
        this._array[1] = -this._array[1];
        return this;
    }

    /**
     * @en Calculates the dot product with another vector
     * @zh 向量点乘。
     * @param other specified vector
     * @return The result of calculates the dot product with another vector
     */
    public dot (other: Readonly<Vec2>) {
        const v = other.array;
        return this._array[0] * v[0] + this._array[1] * v[1];
    }

    /**
     * @en Calculates the cross product with another vector.
     * @zh 向量叉乘。
     * @param other specified vector
     * @return `out`
     */
    public cross (other: Readonly<Vec2>) {
        const v = other.array;
        return this._array[0] * v[1] - this._array[1] * v[0];
    }

    /**
     * @en Returns the length of this vector.
     * @zh 计算向量的长度（模）。
     * @return Length of vector
     */
    public length () {
        return Math.sqrt(this._array[0] * this._array[0] + this._array[1] * this._array[1]);
    }

    /**
     * @en Returns the squared length of this vector.
     * @zh 计算向量长度（模）的平方。
     * @return the squared length of this vector
     */
    public lengthSqr () {
        return this._array[0] * this._array[0] + this._array[1] * this._array[1];
    }

    /**
     * @en Normalize the current vector.
     * @zh 将当前向量归一化。
     */
    public normalize () {
        const x = this._array[0];
        const y = this._array[1];
        let len = x * x + y * y;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this._array[0] *= len;
            this._array[1] *= len;
        }
        return this;
    }

    /**
     * @en Calculates radian angle between two vectors
     * @zh 获取当前向量和指定向量之间的角度。
     * @param other specified vector
     * @return The angle between the current vector and the specified vector (in radians); if there are zero vectors in the current vector and the specified vector, 0 is returned.
     */
    public angle (other: Readonly<Vec2>) {
        const magSqr1 = this.lengthSqr();
        const magSqr2 = other.lengthSqr();

        if (magSqr1 === 0 || magSqr2 === 0) {
            console.warn('Can\'t get angle between zero vector');
            return 0.0;
        }

        const dot = this.dot(other);
        let theta = dot / (Math.sqrt(magSqr1 * magSqr2));
        theta = clamp(theta, -1.0, 1.0);
        return Math.acos(theta);
    }

    /**
     * @en Get angle in radian between this and vector with direction.
     * @zh 获取当前向量和指定向量之间的有符号角度。<br/>
     * 有符号角度的取值范围为 (-180, 180]，当前向量可以通过逆时针旋转有符号角度与指定向量同向。<br/>
     * @param other specified vector
     * @return The signed angle between the current vector and the specified vector (in radians); if there is a zero vector in the current vector and the specified vector, 0 is returned.
     */
    public signAngle (other: Readonly<Vec2>) {
        const angle = this.angle(other);
        return this.cross(other) < 0 ? -angle : angle;
    }

    /**
     * @en Rotates the current vector by an angle in radian value
     * @zh 将当前向量的旋转
     * @param radians radius of rotation
     */
    public rotate (radians: number) {
        const x = this._array[0];
        const y = this._array[1];

        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        this._array[0] = cos * x - sin * y;
        this._array[1] = sin * x + cos * y;
        return this;
    }

    /**
     * @en Projects the current vector on another one
     * @zh 计算当前向量在指定向量上的投影向量。
     * @param other specified vector
     */
    public project (other: Readonly<Vec2>) {
        const v = other.array;
        const scalar = this.dot(other) / other.dot(other);
        this._array[0] = v[0] * scalar;
        this._array[1] = v[1] * scalar;
        return this;
    }

    /**
     * @en Transforms the vec2 with a mat4. 3rd vector component is implicitly '0', 4th vector component is implicitly '1'
     * @zh 将当前向量视为 z 分量为 0、w 分量为 1 的四维向量，<br/>
     * 应用四维矩阵变换到当前矩阵<br/>
     * @param matrix matrix to transform with
     */
    public transformMat4 (matrix: Mat4) {
        const x = this._array[0];
        const y = this._array[1];
        const v = matrix.array;
        this._array[0] = v[0] * x + v[4] * y + v[12];
        this._array[1] = v[1] * x + v[5] * y + v[13];
        return this;
    }
}

function Enumerable (keys: string[]) {
    keys.forEach((key) => {
        Object.defineProperty(Vec2.prototype, key, { enumerable: true });
    });
}
Enumerable(['x', 'y']);

const v2_1 = new Vec2();
const v2_2 = new Vec2();

CCClass.fastDefine('cc.Vec2', Vec2, { x: 0, y: 0 });
legacyCC.Vec2 = Vec2;

export function v2 (other: Vec2): Vec2;
export function v2 (x?: number, y?: number): Vec2;

export function v2 (x?: number | Vec2, y?: number) {
    return new Vec2(x as any, y);
}

legacyCC.v2 = v2;
