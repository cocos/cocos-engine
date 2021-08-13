/*
 Copyright (c) 2016 Chukong Technologies Inc.
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
import { IVec3Like, FloatArray, IMat3, IMat4, IQuat, IVec3 } from './type-define';
import { clamp, enumerableProps, EPSILON, random } from './utils';
import { legacyCC } from '../global-exports';
import { MathBase } from './math-base';

declare interface IWritableArrayLike<T> {
    readonly length: number;
    [index: number]: T;
}

/**
 * @en Representation of 3D vectors and points.
 * @zh 三维向量。
 */
export class Vec3 extends MathBase {
    public static UNIT_X = Object.freeze(new Vec3(1, 0, 0));
    public static UNIT_Y = Object.freeze(new Vec3(0, 1, 0));
    public static UNIT_Z = Object.freeze(new Vec3(0, 0, 1));
    public static RIGHT = Object.freeze(new Vec3(1, 0, 0));
    public static UP = Object.freeze(new Vec3(0, 1, 0));
    public static FORWARD = Object.freeze(new Vec3(0, 0, -1)); // we use -z for view-dir
    public static ZERO = Object.freeze(new Vec3(0, 0, 0));
    public static ONE = Object.freeze(new Vec3(1, 1, 1));
    public static NEG_ONE = Object.freeze(new Vec3(-1, -1, -1));

    /**
     * @en return a Vec3 object with x = 0, y = 0, z = 0.
     * @zh 将目标赋值为零向量
     */
    public static zero<Out extends IVec3Like> (out: Out) {
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = 0;
            vArr[1] = 0;
            vArr[2] = 0;
        } else {
            out.x = 0;
            out.y = 0;
            out.z = 0;
        }
        return out;
    }

    /**
     * @en Obtains a clone of the given vector object
     * @zh 获得指定向量的拷贝
     */
    public static clone <Out extends IVec3Like> (a: IVec3) {
        let x, y, z;
        if(a instanceof Vec3) {
            const vArr = a._array;
            x = vArr[0];
            y = vArr[1];
            z = vArr[2];
        } else {
            x = a.x;
            y = a.y;
            z = a.z;
        }
        return new Vec3(x, y, z);
    }

    /**
     * @en Copy the target vector and save the results to out vector object
     * @zh 复制目标向量
     */
    public static copy<Out extends IVec3Like> (out: Out, a: IVec3) {
        let x, y, z;
        if(a instanceof Vec3) {
            const vArr = a._array;
            x = vArr[0];
            y = vArr[1];
            z = vArr[2];
        } else {
            x = a.x;
            y = a.y;
            z = a.z;
        }
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Sets the out vector with the given x, y and z values
     * @zh 设置向量值
     */
    public static set<Out extends IVec3Like> (out: Out, x: number, y: number, z: number) {
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Element-wise vector addition and save the results to out vector object
     * @zh 逐元素向量加法
     */
    public static add<Out extends IVec3Like> (out: Out, a: IVec3, b: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let bx, by, bz;
        if(b instanceof Vec3) {
            const vArr = b._array;
            bx = vArr[0];
            by = vArr[1];
            bz = vArr[2];
        } else {
            bx = b.x;
            by = b.y;
            bz = b.z;
        }
        let x = ax + bx;
        let y = ay + by;
        let z = az + bz;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Element-wise vector subtraction and save the results to out vector object
     * @zh 逐元素向量减法
     */
    public static subtract<Out extends IVec3Like> (out: Out, a: IVec3, b: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let bx, by, bz;
        if(b instanceof Vec3) {
            const vArr = b._array;
            bx = vArr[0];
            by = vArr[1];
            bz = vArr[2];
        } else {
            bx = b.x;
            by = b.y;
            bz = b.z;
        }
        let x = ax - bx;
        let y = ay - by;
        let z = az - bz;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Element-wise vector multiplication and save the results to out vector object
     * @zh 逐元素向量乘法 (分量积)
     */
    public static multiply<Out extends IVec3Like> (out: Out, a: IVec3, b: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let bx, by, bz;
        if(b instanceof Vec3) {
            const vArr = b._array;
            bx = vArr[0];
            by = vArr[1];
            bz = vArr[2];
        } else {
            bx = b.x;
            by = b.y;
            bz = b.z;
        }
        let x = ax * bx;
        let y = ay * by;
        let z = az * bz;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Element-wise vector division and save the results to out vector object
     * @zh 逐元素向量除法
     */
    public static divide<Out extends IVec3Like> (out: Out, a: IVec3, b: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let bx, by, bz;
        if(b instanceof Vec3) {
            const vArr = b._array;
            bx = vArr[0];
            by = vArr[1];
            bz = vArr[2];
        } else {
            bx = b.x;
            by = b.y;
            bz = b.z;
        }
        let x = ax / bx;
        let y = ay / by;
        let z = az / bz;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Rounds up by elements of the vector and save the results to out vector object
     * @zh 逐元素向量向上取整
     */
    public static ceil<Out extends IVec3Like> (out: Out, a: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let x = Math.ceil(ax);
        let y = Math.ceil(ay);
        let z = Math.ceil(az);
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Element-wise rounds down of the current vector and save the results to the out vector
     * @zh 逐元素向量向下取整
     */
    public static floor<Out extends IVec3Like> (out: Out, a: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let x = Math.floor(ax);
        let y = Math.floor(ay);
        let z = Math.floor(az);
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Calculates element-wise minimum values and save to the out vector
     * @zh 逐元素向量最小值
     */
    public static min<Out extends IVec3Like> (out: Out, a: IVec3, b: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let bx, by, bz;
        if(b instanceof Vec3) {
            const vArr = b._array;
            bx = vArr[0];
            by = vArr[1];
            bz = vArr[2];
        } else {
            bx = b.x;
            by = b.y;
            bz = b.z;
        }
        let x = Math.min(ax, bx);
        let y = Math.min(ay, by);
        let z = Math.min(az, bz);
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Calculates element-wise maximum values and save to the out vector
     * @zh 逐元素向量最大值
     */
    public static max<Out extends IVec3Like> (out: Out, a: IVec3, b: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let bx, by, bz;
        if(b instanceof Vec3) {
            const vArr = b._array;
            bx = vArr[0];
            by = vArr[1];
            bz = vArr[2];
        } else {
            bx = b.x;
            by = b.y;
            bz = b.z;
        }
        let x = Math.max(ax, bx);
        let y = Math.max(ay, by);
        let z = Math.max(az, bz);
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Calculates element-wise round results and save to the out vector
     * @zh 逐元素向量四舍五入取整
     */
    public static round<Out extends IVec3Like> (out: Out, a: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let x = Math.round(ax);
        let y = Math.round(ay);
        let z = Math.round(az);
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Vector scalar multiplication and save the results to out vector object
     * @zh 向量标量乘法
     */
    public static multiplyScalar<Out extends IVec3Like> (out: Out, a: IVec3, b: number) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let x = ax * b;
        let y = ay * b;
        let z = az * b;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Element-wise multiplication and addition with the equation: a + b * scale
     * @zh 逐元素向量乘加: A + B * scale
     */
    public static scaleAndAdd<Out extends IVec3Like> (out: Out, a: IVec3, b: IVec3, scale: number) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let bx, by, bz;
        if(b instanceof Vec3) {
            const vArr = b._array;
            bx = vArr[0];
            by = vArr[1];
            bz = vArr[2];
        } else {
            bx = b.x;
            by = b.y;
            bz = b.z;
        }
        let x = ax + bx * scale;
        let y = ay + by * scale;
        let z = az + bz * scale;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Calculates the euclidean distance of two vectors
     * @zh 求两向量的欧氏距离
     */
    public static distance (a: IVec3, b: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let bx, by, bz;
        if(b instanceof Vec3) {
            const vArr = b._array;
            bx = vArr[0];
            by = vArr[1];
            bz = vArr[2];
        } else {
            bx = b.x;
            by = b.y;
            bz = b.z;
        }
        const x = bx - ax;
        const y = by - ay;
        const z = bz - az;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * @en Calculates the squared euclidean distance of two vectors
     * @zh 求两向量的欧氏距离平方
     */
    public static squaredDistance (a: IVec3, b: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let bx, by, bz;
        if(b instanceof Vec3) {
            const vArr = b._array;
            bx = vArr[0];
            by = vArr[1];
            bz = vArr[2];
        } else {
            bx = b.x;
            by = b.y;
            bz = b.z;
        }
        const x = bx - ax;
        const y = by - ay;
        const z = bz - az;
        return x * x + y * y + z * z;
    }

    /**
     * @en Calculates the length of the vector
     * @zh 求向量长度
     */
    public static len (a: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        const x = ax;
        const y = ay;
        const z = az;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * @en Calculates the squared length of the vector
     * @zh 求向量长度平方
     */
    public static lengthSqr (a: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        const x = ax;
        const y = ay;
        const z = az;
        return x * x + y * y + z * z;
    }

    /**
     * @en Sets each element to its negative value
     * @zh 逐元素向量取负
     */
    public static negate<Out extends IVec3Like> (out: Out, a: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        const x = -ax;
        const y = -ay;
        const z = -az;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Sets each element to its inverse value, zero value will become Infinity
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    public static invert<Out extends IVec3Like> (out: Out, a: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        const x = 1.0 / ax;
        const y = 1.0 / ay;
        const z = 1.0 / az;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Sets each element to its inverse value, zero value will remain zero
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    public static invertSafe<Out extends IVec3Like> (out: Out, a: IVec3) {
        const x = a.x;
        const y = a.y;
        const z = a.z;

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

        if (Math.abs(z) < EPSILON) {
            out.z = 0;
        } else {
            out.z = 1.0 / z;
        }

        return out;
    }

    /**
     * @en Sets the normalized vector to the out vector
     * @zh 归一化向量
     */
    public static normalize<Out extends IVec3Like> (out: Out, a: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }

        let x = ax;
        let y = ay;
        let z = az;

        let len = x * x + y * y + z * z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            x = x * len;
            y = y * len;
            z = z * len;
            if(out instanceof Vec3) {
                const vArr = out._array;
                vArr[0] = x;
                vArr[1] = y;
                vArr[2] = z;
            } else {
                out.x = x;
                out.y = y;
                out.z = z;
            }
        }
        return out;
    }

    /**
     * @en Calculates the dot product of the vector
     * @zh 向量点积（数量积）
     */
    public static dot <Out extends IVec3Like> (a: IVec3, b: IVec3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let bx, by, bz;
        if(b instanceof Vec3) {
            const vArr = b._array;
            bx = vArr[0];
            by = vArr[1];
            bz = vArr[2];
        } else {
            bx = b.x;
            by = b.y;
            bz = b.z;
        }
        return ax * bx + ay * by + az * bz;
    }

    /**
     * @en Calculates the cross product of the vector
     * @zh 向量叉积（向量积）
     */
    public static cross<Out extends IVec3Like> (out: Out, a: IVec3, b: IVec3) {
        const { x: ax, y: ay, z: az } = a;
        const { x: bx, y: by, z: bz } = b;
        const x = ay * bz - az * by;
        const y = az * bx - ax * bz;
        const z = ax * by - ay * bx;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Calculates the linear interpolation between two vectors with a given ratio
     * @zh 逐元素向量线性插值： A + t * (B - A)
     */
    public static lerp<Out extends IVec3Like> (out: Out, a: IVec3, b: IVec3, t: number) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        let bx, by, bz;
        if(b instanceof Vec3) {
            const vArr = b._array;
            bx = vArr[0];
            by = vArr[1];
            bz = vArr[2];
        } else {
            bx = b.x;
            by = b.y;
            bz = b.z;
        }
        const x = ax + t * (bx - ax);
        const y = ay + t * (by - ay);
        const z = az + t * (bz - az);
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Generates a uniformly distributed random vector points from center to the surface of the unit sphere
     * @zh 生成一个在单位球体上均匀分布的随机向量
     * @param scale vector length
     */
    public static random<Out extends IVec3Like> (out: Out, scale?: number) {
        scale = scale || 1.0;

        const phi = random() * 2.0 * Math.PI;
        const cosTheta = random() * 2 - 1;
        const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
        const x = sinTheta * Math.cos(phi) * scale;
        const y = sinTheta * Math.sin(phi) * scale;
        const z = cosTheta * scale;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = x;
            vArr[1] = y;
            vArr[2] = z;
        } else {
            out.x = x;
            out.y = y;
            out.z = z;
        }
        return out;
    }

    /**
     * @en Vector and fourth order matrix multiplication, will complete the vector with a fourth value as one
     * @zh 向量与四维矩阵乘法，默认向量第四位为 1。
     */
    public static transformMat4 <Out extends IVec3Like> (out: Out, a: IVec3, m: IMat4) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        const x = ax;
        const y = ay;
        const z = az;
        let rhw = m.m03 * x + m.m07 * y + m.m11 * z + m.m15;
        rhw = rhw ? Math.abs(1 / rhw) : 1;
        const ox = (m.m00 * x + m.m04 * y + m.m08 * z + m.m12) * rhw;
        const oy = (m.m01 * x + m.m05 * y + m.m09 * z + m.m13) * rhw;
        const oz = (m.m02 * x + m.m06 * y + m.m10 * z + m.m14) * rhw;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = ox;
            vArr[1] = oy;
            vArr[2] = oz;
        } else {
            out.x = ox;
            out.y = oy;
            out.z = oz;
        }
        return out;
    }

    /**
     * @en Vector and fourth order matrix multiplication, will complete the vector with a fourth element as one
     * @zh 向量与四维矩阵乘法，默认向量第四位为 0。
     */
    public static transformMat4Normal<Out extends IVec3Like> (out: Out, a: IVec3, m: IMat4) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        const x = ax;
        const y = ay;
        const z = az;
        let rhw = m.m03 * x + m.m07 * y + m.m11 * z;
        rhw = rhw ? Math.abs(1 / rhw) : 1;

        const ox = (m.m00 * x + m.m04 * y + m.m08 * z) * rhw;
        const oy = (m.m01 * x + m.m05 * y + m.m09 * z) * rhw;
        const oz = (m.m02 * x + m.m06 * y + m.m10 * z) * rhw;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = ox;
            vArr[1] = oy;
            vArr[2] = oz;
        } else {
            out.x = ox;
            out.y = oy;
            out.z = oz;
        }
        return out;
    }

    /**
     * @en Vector and third order matrix multiplication
     * @zh 向量与三维矩阵乘法
     */
    public static transformMat3<Out extends IVec3Like> (out: Out, a: IVec3, m: IMat3) {
        let ax, ay, az;
        if(a instanceof Vec3) {
            const vArr = a._array;
            ax = vArr[0];
            ay = vArr[1];
            az = vArr[2];
        } else {
            ax = a.x;
            ay = a.y;
            az = a.z;
        }
        const x = ax;
        const y = ay;
        const z = az;
        const ox = x * m.m00 + y * m.m03 + z * m.m06;
        const oy = x * m.m01 + y * m.m04 + z * m.m07;
        const oz = x * m.m02 + y * m.m05 + z * m.m08;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = ox;
            vArr[1] = oy;
            vArr[2] = oz;
        } else {
            out.x = ox;
            out.y = oy;
            out.z = oz;
        }
        return out;
    }

    /**
     * @en Affine transformation vector
     * @zh 向量仿射变换
     */
    public static transformAffine<Out extends IVec3Like> (out: Out, v: IVec3, m: IMat4) {
        let vx, vy, vz;
        if(v instanceof Vec3) {
            const vArr = v._array;
            vx = vArr[0];
            vy = vArr[1];
            vz = vArr[2];
        } else {
            vx = v.x;
            vy = v.y;
            vz = v.z;
        }
        const x = vx;
        const y = vy;
        const z = vz;
        const ox = m.m00 * x + m.m04 * y + m.m08 * z + m.m12;
        const oy = m.m01 * x + m.m05 * y + m.m09 * z + m.m13;
        const oz = m.m02 * x + m.m06 * y + m.m10 * z + m.m14;
        if(out instanceof Vec3) {
            const vArr = out._array;
            vArr[0] = ox;
            vArr[1] = oy;
            vArr[2] = oz;
        } else {
            out.x = ox;
            out.y = oy;
            out.z = oz;
        }
        return out;
    }

    /**
     * @en Vector quaternion multiplication
     * @zh 向量四元数乘法
     */
    public static transformQuat<Out extends IVec3Like> (out: Out, a: IVec3, q: IQuat) {
        // benchmarks: http://jsperf.com/quaternion-transform-Vec3-implementations

        // calculate quat * vec
        const ix = q.w * a.x + q.y * a.z - q.z * a.y;
        const iy = q.w * a.y + q.z * a.x - q.x * a.z;
        const iz = q.w * a.z + q.x * a.y - q.y * a.x;
        const iw = -q.x * a.x - q.y * a.y - q.z * a.z;

        // calculate result * inverse quat
        out.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
        out.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
        out.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
        return out;
    }

    /**
     * @en Transforms the current vector with given scale, rotation and translation in order
     * @zh 以缩放 -> 旋转 -> 平移顺序变换向量
     */
    public static transformRTS<Out extends IVec3Like> (out: Out, a: IVec3, r: IQuat, t: IVec3, s: IVec3) {
        const x = a.x * s.x;
        const y = a.y * s.y;
        const z = a.z * s.z;
        const ix = r.w * x + r.y * z - r.z * y;
        const iy = r.w * y + r.z * x - r.x * z;
        const iz = r.w * z + r.x * y - r.y * x;
        const iw = -r.x * x - r.y * y - r.z * z;
        out.x = ix * r.w + iw * -r.x + iy * -r.z - iz * -r.y + t.x;
        out.y = iy * r.w + iw * -r.y + iz * -r.x - ix * -r.z + t.y;
        out.z = iz * r.w + iw * -r.z + ix * -r.y - iy * -r.x + t.z;
        return out;
    }

    /**
     * @en Transforms the current vector with given scale, rotation and translation in reverse order
     * @zh 以平移 -> 旋转 -> 缩放顺序逆变换向量
     */
    public static transformInverseRTS<Out extends IVec3Like> (out: Out, a: IVec3, r: IQuat, t: IVec3, s: IVec3) {
        const x = a.x - t.x;
        const y = a.y - t.y;
        const z = a.z - t.z;
        const ix = r.w * x - r.y * z + r.z * y;
        const iy = r.w * y - r.z * x + r.x * z;
        const iz = r.w * z - r.x * y + r.y * x;
        const iw = r.x * x + r.y * y + r.z * z;
        out.x = (ix * r.w + iw * r.x + iy * r.z - iz * r.y) / s.x;
        out.y = (iy * r.w + iw * r.y + iz * r.x - ix * r.z) / s.y;
        out.z = (iz * r.w + iw * r.z + ix * r.y - iy * r.x) / s.z;
        return out;
    }

    /**
     * @en Rotates the vector with specified angle around X axis
     * @zh 绕 X 轴旋转向量指定弧度
     * @param v rotation vector
     * @param o center of rotation
     * @param a radius of rotation
     */
    public static rotateX<Out extends IVec3Like> (out: Out, v: IVec3, o: IVec3, a: number) {
        // Translate point to the origin
        const x = v.x - o.x;
        const y = v.y - o.y;
        const z = v.z - o.z;

        // perform rotation
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const rx = x;
        const ry = y * cos - z * sin;
        const rz = y * sin + z * cos;

        // translate to correct position
        out.x = rx + o.x;
        out.y = ry + o.y;
        out.z = rz + o.z;

        return out;
    }

    /**
     * @en Rotates the vector with specified angle around Y axis
     * @zh 绕 Y 轴旋转向量指定弧度
     * @param v rotation vector
     * @param o center of rotation
     * @param a radius of rotation
     */
    public static rotateY<Out extends IVec3Like> (out: Out, v: IVec3, o: IVec3, a: number) {
        // Translate point to the origin
        const x = v.x - o.x;
        const y = v.y - o.y;
        const z = v.z - o.z;

        // perform rotation
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const rx = z * sin + x * cos;
        const ry = y;
        const rz = z * cos - x * sin;

        // translate to correct position
        out.x = rx + o.x;
        out.y = ry + o.y;
        out.z = rz + o.z;

        return out;
    }

    /**
     * @en Rotates the vector with specified angle around Z axis
     * @zh 绕 Z 轴旋转向量指定弧度
     * @param v rotation vector
     * @param o center of rotation
     * @param a radius of rotation
     */
    public static rotateZ<Out extends IVec3Like> (out: Out, v: IVec3, o: IVec3, a: number) {
        // Translate point to the origin
        const x = v.x - o.x;
        const y = v.y - o.y;
        const z = v.z - o.z;

        // perform rotation
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const rx = x * cos - y * sin;
        const ry = x * sin + y * cos;
        const rz = z;

        // translate to correct position
        out.x = rx + o.x;
        out.y = ry + o.y;
        out.z = rz + o.z;

        return out;
    }

    /**
     * @en Converts the given vector to an array
     * @zh 向量转数组
     * @param ofs Array Start Offset
     */
    public static toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec3, ofs = 0) {
        out[ofs + 0] = v.x;
        out[ofs + 1] = v.y;
        out[ofs + 2] = v.z;

        return out;
    }

    /**
     * @en Converts the given array to a vector
     * @zh 数组转向量
     * @param ofs Array Start Offset
     */
    public static fromArray <Out extends IVec3Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0) {
        out.x = arr[ofs + 0];
        out.y = arr[ofs + 1];
        out.z = arr[ofs + 2];
        return out;
    }

    /**
     * @en Check the equality of the two given vectors
     * @zh 向量等价判断
     */
    public static strictEquals (a: IVec3, b: IVec3) {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }

    /**
     * @en Check whether the two given vectors are approximately equivalent
     * @zh 排除浮点数误差的向量近似等价判断
     */
    public static equals (a: IVec3, b: IVec3, epsilon = EPSILON) {
        const { x: a0, y: a1, z: a2 } = a;
        const { x: b0, y: b1, z: b2 } = b;
        return (
            Math.abs(a0 - b0)
            <= epsilon * Math.max(1.0, Math.abs(a0), Math.abs(b0))
            && Math.abs(a1 - b1)
            <= epsilon * Math.max(1.0, Math.abs(a1), Math.abs(b1))
            && Math.abs(a2 - b2)
            <= epsilon * Math.max(1.0, Math.abs(a2), Math.abs(b2))
        );
    }

    /**
     * @en Calculates the radian angle between two vectors
     * @zh 求两向量夹角弧度
     */
    public static angle (a: IVec3, b: IVec3) {
        Vec3.normalize(v3_1, a);
        Vec3.normalize(v3_2, b);
        const cosine = Vec3.dot(v3_1, v3_2);
        if (cosine > 1.0) {
            return 0;
        }
        if (cosine < -1.0) {
            return Math.PI;
        }
        return Math.acos(cosine);
    }

    /**
     * @en Calculates the projection vector on the specified plane
     * @zh 计算向量在指定平面上的投影
     * @param a projection vector
     * @param n the normal line of specified plane
     */
    public static projectOnPlane<Out extends IVec3Like> (out: Out, a: IVec3, n: IVec3) {
        return Vec3.subtract(out, a, Vec3.project(out, a, n));
    }

    /**
     * @en Calculates the projection on the specified vector
     * @zh 计算向量在指定向量上的投影
     * @param a projection vector
     * @param n target vector
     */
    public static project<Out extends IVec3Like> (out: Out, a: IVec3, b: IVec3) {
        const sqrLen = Vec3.lengthSqr(b);
        if (sqrLen < 0.000001) {
            return Vec3.set(out, 0, 0, 0);
        } else {
            return Vec3.multiplyScalar(out, b, Vec3.dot(a, b) / sqrLen);
        }
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
     * @en y component.
     * @zh y 分量。
     */
    public get y (): number {
        return this._array[1];
    }
    public set y (y: number) {
        this._array[1] = y;
    }

    /**
     * @en z component.
     * @zh z 分量。
     */
    public get z (): number {
        return this._array[2];
    }
    public set z (z: number) {
        this._array[2] = z;
    }

    constructor (x: Vec3 | Readonly<Vec3> | FloatArray);

    constructor (x?: number, y?: number, z?: number);

    constructor (x?: number | Vec3 | Readonly<Vec3> | FloatArray, y?: number, z?: number) {
        super();
        if (x && typeof x === 'object') {
            if (ArrayBuffer.isView(x)) {
                this._array = x;
                this._array.fill(0);
            } else {
                const v = x.array;
                this._array = MathBase.createFloatArray(3);
                this._array[0] = v[0];
                this._array[1] = v[1];
                this._array[2] = v[2];
            }
        } else {
            this._array = MathBase.createFloatArray(3);
            this._array[0] = x as number || 0;
            this._array[1] = y || 0;
            this._array[2] = z || 0;
        }
    }

    /**
     * @en clone a Vec3 value
     * @zh 克隆当前向量。
     */
    public clone () {
        return new Vec3(this._array[0], this._array[1], this._array[2]);
    }

    /**
     * @en Set the current vector value with the given vector.
     * @zh 设置当前向量使其与指定向量相等。
     * @param other Specified vector
     * @returns `this`
     */
    public set (other: Vec3 | Readonly<Vec3>);

    /**
     * @en Set the value of each component of the current vector.
     * @zh 设置当前向量的具体分量值。
     * @param x x value
     * @param y y value
     * @param z z value
     * @returns `this`
     */
    public set (x?: number, y?: number, z?: number);

    public set (x?: number | Vec3 | Readonly<Vec3>, y?: number, z?: number) {
        if (x && typeof x === 'object') {
            this._array[0] = x.x;
            this._array[1] = x.y;
            this._array[2] = x.z;
        } else {
            this._array[0] = x as number || 0;
            this._array[1] = y || 0;
            this._array[2] = z || 0;
        }
        return this;
    }

    /**
     * @en Check whether the vector approximately equals another one.
     * @zh 判断当前向量是否在误差范围内与指定向量相等。
     * @param other Specified vector
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    public equals (other: Vec3 | Readonly<Vec3>, epsilon = EPSILON) {
        const v = other.array;
        return (
            Math.abs(this._array[0] - v[0])
            <= epsilon * Math.max(1.0, Math.abs(this._array[0]), Math.abs(v[0]))
            && Math.abs(this._array[1] - v[1])
            <= epsilon * Math.max(1.0, Math.abs(this._array[1]), Math.abs(v[1]))
            && Math.abs(this._array[2] - v[2])
            <= epsilon * Math.max(1.0, Math.abs(this._array[2]), Math.abs(v[2]))
        );
    }

    /**
     * @en Check whether the vector approximately equals another one.
     * @zh 判断当前向量是否在误差范围内与指定分量的向量相等。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    public equals3f (x: number, y: number, z: number, epsilon = EPSILON) {
        return (
            Math.abs(this._array[0] - x)
            <= epsilon * Math.max(1.0, Math.abs(this._array[0]), Math.abs(x))
            && Math.abs(this._array[1] - y)
            <= epsilon * Math.max(1.0, Math.abs(this._array[1]), Math.abs(y))
            && Math.abs(this._array[2] - z)
            <= epsilon * Math.max(1.0, Math.abs(this._array[2]), Math.abs(z))
        );
    }

    /**
     * @en Check whether the current vector strictly equals another Vec3.
     * @zh 判断当前向量是否与指定向量相等。
     * @param other specified vector
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    public strictEquals (other: Vec3 | Readonly<Vec3>) {
        const v = other.array;
        return this._array[0] === v[0] && this._array[1] === v[1] && this._array[2] === v[2];
    }

    /**
     * @en Check whether the current vector strictly equals another Vec3.
     * @zh 判断当前向量是否与指定分量的向量相等。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    public strictEquals3f (x: number, y: number, z: number) {
        return this._array[0] === x && this._array[1] === y && this._array[2] === z;
    }

    /**
     * @en Transform to string with vector information.
     * @zh 返回当前向量的字符串表示。
     * @returns The string with vector information
     */
    public toString () {
        return `(${this._array[0].toFixed(2)}, ${this._array[1].toFixed(2)}, ${this._array[2].toFixed(2)})`;
    }

    /**
     * @en Calculate linear interpolation result between this vector and another one with given ratio.
     * @zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param to Target vector
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    public lerp (to: Vec3 | Readonly<Vec3>, ratio: number) {
        this._array[0] += ratio * (to.x - this._array[0]);
        this._array[1] += ratio * (to.y - this._array[1]);
        this._array[2] += ratio * (to.z - this._array[2]);
        return this;
    }

    /**
     * @en Adds the current vector with another one and return this
     * @zh 向量加法。将当前向量与指定向量的相加
     * @param other specified vector
     */
    public add (other: Vec3 | Readonly<Vec3>) {
        const v = other.array;
        this._array[0] += v[0];
        this._array[1] += v[1];
        this._array[2] += v[2];
        return this;
    }

    /**
     * @en Adds the current vector with another one and return this
     * @zh 向量加法。将当前向量与指定分量的向量相加
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     */
    public add3f (x: number, y: number, z: number) {
        this._array[0] += x;
        this._array[1] += y;
        this._array[2] += z;
        return this;
    }

    /**
     * @en Subtracts one vector from this, and returns this.
     * @zh 向量减法。将当前向量减去指定向量的结果。
     * @param other specified vector
     */
    public subtract (other: Vec3 | Readonly<Vec3>) {
        const v = other.array;
        this._array[0] -= v[0];
        this._array[1] -= v[1];
        this._array[2] -= v[2];
        return this;
    }

    /**
     * @en Subtracts one vector from this, and returns this.
     * @zh 向量减法。将当前向量减去指定分量的向量
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     */
    public subtract3f (x: number, y: number, z: number) {
        this._array[0] -= x;
        this._array[1] -= y;
        this._array[2] -= z;
        return this;
    }

    /**
     * @en Multiplies the current vector with a number, and returns this.
     * @zh 向量数乘。将当前向量数乘指定标量
     * @param scalar scalar number
     */
    public multiplyScalar (scalar: number) {
        if (typeof scalar === 'object') { console.warn('should use Vec3.multiply for vector * vector operation'); }
        this._array[0] *= scalar;
        this._array[1] *= scalar;
        this._array[2] *= scalar;
        return this;
    }

    /**
     * @en Multiplies the current vector with another one and return this
     * @zh 向量乘法。将当前向量乘以与指定向量的结果赋值给当前向量。
     * @param other specified vector
     */
    public multiply (other: Vec3 | Readonly<Vec3>) {
        if (typeof other !== 'object') { console.warn('should use Vec3.scale for vector * scalar operation'); }
        const v = other.array;
        this._array[0] *= v[0];
        this._array[1] *= v[1];
        this._array[2] *= v[2];
        return this;
    }

    /**
     * @en Multiplies the current vector with another one and return this
     * @zh 向量乘法。将当前向量与指定分量的向量相乘的结果赋值给当前向量。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     */
    public multiply3f (x: number, y: number, z: number) {
        this._array[0] *= x;
        this._array[1] *= y;
        this._array[2] *= z;
        return this;
    }

    /**
     * @en Element-wisely divides this vector with another one, and return this.
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param other specified vector
     */
    public divide (other: Vec3 | Readonly<Vec3>) {
        const v = other.array;
        this._array[0] /= v[0];
        this._array[1] /= v[1];
        this._array[2] /= v[2];
        return this;
    }

    /**
     * @en Element-wisely divides this vector with another one, and return this.
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     */
    public divide3f (x: number, y: number, z: number) {
        this._array[0] /= x;
        this._array[1] /= y;
        this._array[2] /= z;
        return this;
    }

    /**
     * @en Sets each component of this vector with its negative value
     * @zh 将当前向量的各个分量取反
     */
    public negative () {
        this._array[0] = -this._array[0];
        this._array[1] = -this._array[1];
        this._array[2] = -this._array[2];
        return this;
    }

    /**
     * @en Clamp the vector between minInclusive and maxInclusive.
     * @zh 设置当前向量的值，使其各个分量都处于指定的范围内。
     * @param minInclusive Minimum value allowed
     * @param maxInclusive Maximum value allowed
     * @returns `this`
     */
    public clampf (minInclusive: Vec3 | Readonly<Vec3>, maxInclusive: Vec3 | Readonly<Vec3>) {
        const min = minInclusive.array;
        const max = maxInclusive.array;
        this._array[0] = clamp(this._array[0], min[0], max[0]);
        this._array[1] = clamp(this._array[1], min[1], max[1]);
        this._array[2] = clamp(this._array[2], min[2], max[2]);
        return this;
    }

    /**
     * @en Calculates the dot product with another vector
     * @zh 向量点乘。
     * @param other specified vector
     * @returns The result of calculates the dot product with another vector
     */
    public dot (other: Vec3 | Readonly<Vec3>) {
        const v = other.array;
        return this._array[0] * v[0] + this._array[1] * v[1] + this._array[2] * v[2];
    }

    /**
     * @en Calculates the cross product with another vector.
     * @zh 向量叉乘。将当前向量左叉乘指定向量
     * @param other specified vector
     */
    public cross (other: Vec3 | Readonly<Vec3>) {
        const ax = this._array[0];
        const ay = this._array[1];
        const az = this._array[2];
        const bx = other.array[0];
        const by = other.array[1];
        const bz = other.array[2];

        this._array[0] = ay * bz - az * by;
        this._array[1] = az * bx - ax * bz;
        this._array[2] = ax * by - ay * bx;
        return this;
    }

    /**
     * @en Returns the length of this vector.
     * @zh 计算向量的长度（模）。
     * @returns Length of vector
     */
    public length () {
        return Math.sqrt(this._array[0] * this._array[0] + this._array[1] * this._array[1] + this._array[2] * this._array[2]);
    }

    /**
     * @en Returns the squared length of this vector.
     * @zh 计算向量长度（模）的平方。
     * @returns the squared length of this vector
     */
    public lengthSqr () {
        return this._array[0] * this._array[0] + this._array[1] * this._array[1] + this._array[2] * this._array[2];
    }

    /**
     * @en Normalize the current vector.
     * @zh 将当前向量归一化
     */
    public normalize () {
        const x = this._array[0];
        const y = this._array[1];
        const z = this._array[2];

        let len = x * x + y * y + z * z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this._array[0] = x * len;
            this._array[1] = y * len;
            this._array[2] = z * len;
        }
        return this;
    }

    /**
     * @en Transforms the vec3 with a mat4. 4th vector component is implicitly '1'
     * @zh 将当前向量视为 w 分量为 1 的四维向量，应用四维矩阵变换到当前矩阵
     * @param matrix matrix to transform with
     */
    public transformMat4 (matrix: Mat4 | Readonly<Mat4>) {
        const x = this._array[0];
        const y = this._array[1];
        const z = this._array[2];
        const v = (matrix as any).array;
        let rhw = v[3] * x + v[7] * y + v[11] * z + v[15];
        rhw = rhw ? 1 / rhw : 1;
        this._array[0] = (v[0] * x + v[4] * y + v[8] * z + v[12]) * rhw;
        this._array[1] = (v[1] * x + v[5] * y + v[9] * z + v[13]) * rhw;
        this._array[2] = (v[2] * x + v[6] * y + v[10] * z + v[14]) * rhw;
        return this;
    }
}

const v3_1 = new Vec3();
const v3_2 = new Vec3();

enumerableProps(Vec3.prototype, ['x', 'y', 'z']);
CCClass.fastDefine('cc.Vec3', Vec3, { x: 0, y: 0, z: 0 });
legacyCC.Vec3 = Vec3;

export function v3 (other: Vec3): Vec3;
export function v3 (x?: number, y?: number, z?: number): Vec3;

export function v3 (x?: number | Vec3, y?: number, z?: number) {
    return new Vec3(x as any, y, z);
}

legacyCC.v3 = v3;