/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

import ValueType from './value-type';
import CCClass from '../platform/CCClass';
import Vec3 from './vec3';
import Mat3 from './mat3';
import { EPSILON, toDegree } from './utils';

let _x: number = 0.0;
let _y: number = 0.0;
let _z: number = 0.0;
let _w: number = 0.0;

/**
 * !#en Representation of 2D vectors and points.
 * !#zh 表示 2D 向量和坐标
 *
 * @class Quat
 * @extends ValueType
 */

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
export default class Quat extends ValueType {
    static mul = Quat.multiply;
    static scale = Quat.multiplyScalar;
    static mag = Quat.len;

    /**
     * !#en Calculate the multiply result between this quaternion and another one
     * !#zh 计算四元数乘积的结果
     * @method mul
     * @param {Quat} other
     * @param {Quat} [out]
     * @returns {Quat} out
     */
    mul (other: Quat, out?: Quat): Quat {
        return Quat.multiply(out || new Quat(), this, other);
    }

    static IDENTITY = Object.freeze(new Quat());

    /**
     * !#zh 获得指定四元数的拷贝
     * !#en Obtaining copy specified quaternion
     * @method clone
     * @typescript
     * clone<Out extends IQuatLike> (a: Out): Quat
     * @static
     */
    static clone<Out extends IQuatLike> (a: Out) {
        return new Quat(a.x, a.y, a.z, a.w);
    }

    /**
     * !#zh 复制目标四元数
     * !#en Copy quaternion target
     * @method copy
     * @typescript
     * copy<Out extends IQuatLike, QuatLike extends IQuatLike> (out: Out, a: QuatLike): Out
     * @static
     */
    static copy<Out extends IQuatLike, QuatLike extends IQuatLike> (out: Out, a: QuatLike) {
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        out.w = a.w;
        return out;
    }

    /**
     * !#zh 设置四元数值
     * !#en Provided Quaternion Value
     * @method set
     * @typescript
     * set<Out extends IQuatLike> (out: Out, x: number, y: number, z: number, w: number): Out
     * @static
     */
    static set<Out extends IQuatLike> (out: Out, x: number, y: number, z: number, w: number) {
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
        return out;
    }

    /**
     * !#zh 将目标赋值为单位四元数
     * !#en The target of an assignment as a unit quaternion
     * @method identity
     * @typescript
     * identity<Out extends IQuatLike> (out: Out): Out
     * @static
     */
    static identity<Out extends IQuatLike> (out: Out) {
        out.x = 0;
        out.y = 0;
        out.z = 0;
        out.w = 1;
        return out;
    }

    /**
     * !#zh 设置四元数为两向量间的最短路径旋转，默认两向量都已归一化
     * !#en Set quaternion rotation is the shortest path between two vectors, the default two vectors are normalized
     * @method rotationTo
     * @typescript
     * rotationTo<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, a: VecLike, b: VecLike): Out
     * @static
     */
    static rotationTo<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, a: VecLike, b: VecLike) {
        const dot = Vec3.dot(a, b);
        if (dot < -0.999999) {
            Vec3.cross(v3_1, Vec3.RIGHT, a);
            if (v3_1.mag() < 0.000001) {
                Vec3.cross(v3_1, Vec3.UP, a);
            }
            Vec3.normalize(v3_1, v3_1);
            Quat.fromAxisAngle(out, v3_1, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            out.w = 1;
            return out;
        } else {
            Vec3.cross(v3_1, a, b);
            out.x = v3_1.x;
            out.y = v3_1.y;
            out.z = v3_1.z;
            out.w = 1 + dot;
            return Quat.normalize(out, out);
        }
    }

    /**
     * !#zh 获取四元数的旋转轴和旋转弧度
     * !#en Get the rotary shaft and the arc of rotation quaternion
     * @method getAxisAngle
     * @param {Vec3} outAxis - 旋转轴输出
     * @param {Quat} q - 源四元数
     * @return {Number} - 旋转弧度
     * @typescript
     * getAxisAngle<Out extends IQuatLike, VecLike extends IVec3Like> (outAxis: VecLike, q: Out): number
     * @static
     */
    static getAxisAngle<Out extends IQuatLike, VecLike extends IVec3Like> (outAxis: VecLike, q: Out) {
        const rad = Math.acos(q.w) * 2.0;
        const s = Math.sin(rad / 2.0);
        if (s !== 0.0) {
            outAxis.x = q.x / s;
            outAxis.y = q.y / s;
            outAxis.z = q.z / s;
        } else {
            // If s is zero, return any axis (no rotation - axis does not matter)
            outAxis.x = 1;
            outAxis.y = 0;
            outAxis.z = 0;
        }
        return rad;
    }

    /**
     * !#zh 四元数乘法
     * !#en Quaternion multiplication
     * @method multiply
     * @typescript
     * multiply<Out extends IQuatLike, QuatLike_1 extends IQuatLike, QuatLike_2 extends IQuatLike> (out: Out, a: QuatLike_1, b: QuatLike_2): Out
     * @static
     */
    static multiply<Out extends IQuatLike, QuatLike_1 extends IQuatLike, QuatLike_2 extends IQuatLike> (out: Out, a: QuatLike_1, b: QuatLike_2) {
        _x = a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y;
        _y = a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z;
        _z = a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x;
        _w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
        out.x = _x;
        out.y = _y;
        out.z = _z;
        out.w = _w;
        return out;
    }

    /**
     * !#zh 四元数标量乘法
     * !#en Quaternion scalar multiplication
     * @method multiplyScalar
     * @typescript
     * multiplyScalar<Out extends IQuatLike> (out: Out, a: Out, b: number): Out
     * @static
     */
    static multiplyScalar<Out extends IQuatLike> (out: Out, a: Out, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        out.w = a.w * b;
        return out;
    }

    /**
     * !#zh 四元数乘加：A + B * scale
     * !#en Quaternion multiplication and addition: A + B * scale
     * @method scaleAndAdd
     * @typescript
     * scaleAndAdd<Out extends IQuatLike> (out: Out, a: Out, b: Out, scale: number): Out
     * @static
     */
    static scaleAndAdd<Out extends IQuatLike> (out: Out, a: Out, b: Out, scale: number) {
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        out.w = a.w + b.w * scale;
        return out;
    }

    /**
     * !#zh 绕 X 轴旋转指定四元数
     * !#en About the X axis specified quaternion
     * @method rotateX
     * @typescript
     * rotateX<Out extends IQuatLike> (out: Out, a: Out, rad: number): Out
     * @param rad 旋转弧度
     * @static
     */
    static rotateX<Out extends IQuatLike> (out: Out, a: Out, rad: number) {
        rad *= 0.5;

        const bx = Math.sin(rad);
        const bw = Math.cos(rad);

        _x = a.x * bw + a.w * bx;
        _y = a.y * bw + a.z * bx;
        _z = a.z * bw - a.y * bx;
        _w = a.w * bw - a.x * bx;

        out.x = _x;
        out.y = _y;
        out.z = _z;
        out.w = _w;

        return out;
    }

    /**
     * !#zh 绕 Y 轴旋转指定四元数
     * !#en Rotation about the Y axis designated quaternion
     * @method rotateY
     * @typescript
     * rotateY<Out extends IQuatLike> (out: Out, a: Out, rad: number): Out
     * @param rad 旋转弧度
     * @static
     */
    static rotateY<Out extends IQuatLike> (out: Out, a: Out, rad: number) {
        rad *= 0.5;

        const by = Math.sin(rad);
        const bw = Math.cos(rad);

        _x = a.x * bw - a.z * by;
        _y = a.y * bw + a.w * by;
        _z = a.z * bw + a.x * by;
        _w = a.w * bw - a.y * by;

        out.x = _x;
        out.y = _y;
        out.z = _z;
        out.w = _w;

        return out;
    }

    /**
     * !#zh 绕 Z 轴旋转指定四元数
     * !#en Around the Z axis specified quaternion
     * @method rotateZ
     * @typescript
     * rotateZ<Out extends IQuatLike> (out: Out, a: Out, rad: number): Out
     * @param rad 旋转弧度
     * @static
     */
    static rotateZ<Out extends IQuatLike> (out: Out, a: Out, rad: number) {
        rad *= 0.5;

        const bz = Math.sin(rad);
        const bw = Math.cos(rad);

        _x = a.x * bw + a.y * bz;
        _y = a.y * bw - a.x * bz;
        _z = a.z * bw + a.w * bz;
        _w = a.w * bw - a.z * bz;

        out.x = _x;
        out.y = _y;
        out.z = _z;
        out.w = _w;

        return out;
    }

    /**
     * !#zh 绕世界空间下指定轴旋转四元数
     * !#en Space around the world at a given axis of rotation quaternion
     * @method rotateAround
     * @typescript
     * rotateAround<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, rot: Out, axis: VecLike, rad: number): Out
     * @param axis 旋转轴，默认已归一化
     * @param rad 旋转弧度
     * @static
     */
    static rotateAround<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, rot: Out, axis: VecLike, rad: number) {
        // get inv-axis (local to rot)
        Quat.invert(qt_1, rot);
        Vec3.transformQuat(v3_1, axis, qt_1);
        // rotate by inv-axis
        Quat.fromAxisAngle(qt_1, v3_1, rad);
        Quat.multiply(out, rot, qt_1);
        return out;
    }

    /**
     * !#zh 绕本地空间下指定轴旋转四元数
     * !#en Local space around the specified axis rotation quaternion
     * @method rotateAroundLocal
     * @typescript
     * rotateAroundLocal<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, rot: Out, axis: VecLike, rad: number): Out
     * @param axis 旋转轴
     * @param rad 旋转弧度
     * @static
     */
    static rotateAroundLocal<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, rot: Out, axis: VecLike, rad: number) {
        Quat.fromAxisAngle(qt_1, axis, rad);
        Quat.multiply(out, rot, qt_1);
        return out;
    }

    /**
     * !#zh 根据 xyz 分量计算 w 分量，默认已归一化
     * !#en The component w xyz components calculated, normalized by default
     * @method calculateW
     * @typescript
     * calculateW<Out extends IQuatLike> (out: Out, a: Out): Out
     * @static
     */
    static calculateW<Out extends IQuatLike> (out: Out, a: Out) {

        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        out.w = Math.sqrt(Math.abs(1.0 - a.x * a.x - a.y * a.y - a.z * a.z));
        return out;
    }

    /**
     * !#zh 四元数点积（数量积）
     * !#en Quaternion dot product (scalar product)
     * @method dot
     * @typescript
     * dot<Out extends IQuatLike> (a: Out, b: Out): number
     * @static
     */
    static dot<Out extends IQuatLike> (a: Out, b: Out) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    /**
     * !#zh 逐元素线性插值： A + t * (B - A)
     * !#en Element by element linear interpolation: A + t * (B - A)
     * @method lerp
     * @typescript
     * lerp<Out extends IQuatLike> (out: Out, a: Out, b: Out, t: number): Out
     * @static
     */
    static lerp<Out extends IQuatLike> (out: Out, a: Out, b: Out, t: number) {
        out.x = a.x + t * (b.x - a.x);
        out.y = a.y + t * (b.y - a.y);
        out.z = a.z + t * (b.z - a.z);
        out.w = a.w + t * (b.w - a.w);
        return out;
    }

    /**
     * !#zh 四元数球面插值
     * !#en Spherical quaternion interpolation
     * @method slerp
     * @typescript
     * slerp<Out extends IQuatLike, QuatLike_1 extends IQuatLike, QuatLike_2 extends IQuatLike>(out: Out, a: QuatLike_1, b: QuatLike_2, t: number): Out
     * @static
     */
    static slerp<Out extends IQuatLike, QuatLike_1 extends IQuatLike, QuatLike_2 extends IQuatLike>
        (out: Out, a: QuatLike_1, b: QuatLike_2, t: number) {
        // benchmarks:
        //    http://jsperf.com/quaternion-slerp-implementations

        let scale0 = 0;
        let scale1 = 0;

        // calc cosine
        let cosom = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
        // adjust signs (if necessary)
        if (cosom < 0.0) {
            cosom = -cosom;
            b.x = -b.x;
            b.y = -b.y;
            b.z = -b.z;
            b.w = -b.w;
        }
        // calculate coefficients
        if ((1.0 - cosom) > 0.000001) {
            // standard case (slerp)
            const omega = Math.acos(cosom);
            const sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        } else {
            // "from" and "to" quaternions are very close
            //  ... so we can do a linear interpolation
            scale0 = 1.0 - t;
            scale1 = t;
        }
        // calculate final values
        out.x = scale0 * a.x + scale1 * b.x;
        out.y = scale0 * a.y + scale1 * b.y;
        out.z = scale0 * a.z + scale1 * b.z;
        out.w = scale0 * a.w + scale1 * b.w;

        return out;
    }

    /**
     * !#zh 带两个控制点的四元数球面插值
     * !#en Quaternion with two spherical interpolation control points
     * @method sqlerp
     * @typescript
     * sqlerp<Out extends IQuatLike> (out: Out, a: Out, b: Out, c: Out, d: Out, t: number): Out
     * @static
     */
    static sqlerp<Out extends IQuatLike> (out: Out, a: Out, b: Out, c: Out, d: Out, t: number) {
        Quat.slerp(qt_1, a, d, t);
        Quat.slerp(qt_2, b, c, t);
        Quat.slerp(out, qt_1, qt_2, 2 * t * (1 - t));
        return out;
    }

    /**
     * !#zh 四元数求逆
     * !#en Quaternion inverse
     * @method invert
     * @typescript
     * invert<Out extends IQuatLike, QuatLike extends IQuatLike> (out: Out, a: QuatLike): Out
     * @static
     */
    static invert<Out extends IQuatLike, QuatLike extends IQuatLike> (out: Out, a: QuatLike) {
        const dot = a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;
        const invDot = dot ? 1.0 / dot : 0;

        // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

        out.x = -a.x * invDot;
        out.y = -a.y * invDot;
        out.z = -a.z * invDot;
        out.w = a.w * invDot;
        return out;
    }

    /**
     * !#zh 求共轭四元数，对单位四元数与求逆等价，但更高效
     * !#en Conjugating a quaternion, and the unit quaternion equivalent to inversion, but more efficient
     * @method conjugate
     * @typescript
     * conjugate<Out extends IQuatLike> (out: Out, a: Out): Out
     * @static
     */
    static conjugate<Out extends IQuatLike> (out: Out, a: Out) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        out.w = a.w;
        return out;
    }

    /**
     * !#zh 求四元数长度
     * !#en Seek length quaternion
     * @method len
     * @typescript
     * len<Out extends IQuatLike> (a: Out): number
     * @static
     */
    static len<Out extends IQuatLike> (a: Out) {
        return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w);
    }

    /**
     * !#zh 求四元数长度平方
     * !#en Seeking quaternion square of the length
     * @method lengthSqr
     * @typescript
     * lengthSqr<Out extends IQuatLike> (a: Out): number
     * @static
     */
    static lengthSqr<Out extends IQuatLike> (a: Out) {
        return a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;
    }

    /**
     * !#zh 归一化四元数
     * !#en Normalized quaternions
     * @method normalize
     * @typescript
     * normalize<Out extends IQuatLike> (out: Out, a: Out): Out
     * @static
     */
    static normalize<Out extends IQuatLike> (out: Out, a: Out) {
        let len = a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = a.x * len;
            out.y = a.y * len;
            out.z = a.z * len;
            out.w = a.w * len;
        }
        return out;
    }

    /**
     * !#zh 根据本地坐标轴朝向计算四元数，默认三向量都已归一化且相互垂直
     * !#en Calculated according to the local orientation quaternion coordinate axis, the default three vectors are normalized and mutually perpendicular
     * @method fromAxes
     * @typescript
     * fromAxes<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, xAxis: VecLike, yAxis: VecLike, zAxis: VecLike): Out
     * @static
     */
    static fromAxes<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, xAxis: VecLike, yAxis: VecLike, zAxis: VecLike) {
        Mat3.set(m3_1,
            xAxis.x, xAxis.y, xAxis.z,
            yAxis.x, yAxis.y, yAxis.z,
            zAxis.x, zAxis.y, zAxis.z,
        );
        return Quat.normalize(out, Quat.fromMat3(out, m3_1));
    }

    /**
     * !#zh 根据视口的前方向和上方向计算四元数
     * !#en The forward direction and the direction of the viewport computing quaternion
     * @method fromViewUp
     * @typescript
     * fromViewUp<Out extends IQuatLike> (out: Out, view: Vec3, up?: Vec3): Out
     * @param view 视口面向的前方向，必须归一化
     * @param up 视口的上方向，必须归一化，默认为 (0, 1, 0)
     * @static
     */
    static fromViewUp<Out extends IQuatLike> (out: Out, view: Vec3, up?: Vec3) {
        Mat3.fromViewUp(m3_1, view, up);
        return Quat.normalize(out, Quat.fromMat3(out, m3_1));
    }

    /**
     * !#zh 根据旋转轴和旋转弧度计算四元数
     * !#en The quaternion calculated and the arc of rotation of the rotary shaft
     * @method fromAxisAngle
     * @typescript
     * fromAxisAngle<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, axis: VecLike, rad: number): Out
     * @static
     */
    static fromAxisAngle<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, axis: VecLike, rad: number) {
        rad = rad * 0.5;
        const s = Math.sin(rad);
        out.x = s * axis.x;
        out.y = s * axis.y;
        out.z = s * axis.z;
        out.w = Math.cos(rad);
        return out;
    }

    /**
     * Set a quaternion from the given euler angle 0, 0, z.
     *
     * @param {Quat} out - Quaternion to store result.
     * @param {number} z - Angle to rotate around Z axis in degrees.
     * @returns {Quat}
     * @function
     */
    static fromAngleZ (out: Quat, z: number): Quat {
        z *= halfToRad;
        out.x = out.y = 0;
        out.z = Math.sin(z);
        out.w = Math.cos(z);
        return out;
    }

    /**
     * !#zh 根据三维矩阵信息计算四元数，默认输入矩阵不含有缩放信息
     * !#en Calculating the three-dimensional quaternion matrix information, default zoom information input matrix does not contain
     * @method fromMat3
     * @typescript
     * fromMat3<Out extends IQuatLike> (out: Out, mat: Mat3): Out
     * @static
     */
    static fromMat3<Out extends IQuatLike> (out: Out, mat: Mat3) {
        let m = mat.m;
        let m00 = m[0], m10 = m[1], m20 = m[2],
            m01 = m[3], m11 = m[4], m21 = m[5],
            m02 = m[6], m12 = m[7], m22 = m[8];

        const trace = m00 + m11 + m22;

        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);

            out.w = 0.25 / s;
            out.x = (m21 - m12) * s;
            out.y = (m02 - m20) * s;
            out.z = (m10 - m01) * s;

        } else if ((m00 > m11) && (m00 > m22)) {
            const s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

            out.w = (m21 - m12) / s;
            out.x = 0.25 * s;
            out.y = (m01 + m10) / s;
            out.z = (m02 + m20) / s;

        } else if (m11 > m22) {
            const s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

            out.w = (m02 - m20) / s;
            out.x = (m01 + m10) / s;
            out.y = 0.25 * s;
            out.z = (m12 + m21) / s;

        } else {
            const s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

            out.w = (m10 - m01) / s;
            out.x = (m02 + m20) / s;
            out.y = (m12 + m21) / s;
            out.z = 0.25 * s;
        }

        return out;
    }

    /**
     * !#zh 根据欧拉角信息计算四元数，旋转顺序为 YZX
     * !#en The quaternion calculated Euler angle information, rotation order YZX
     * @method fromEuler
     * @typescript
     * fromEuler<Out extends IQuatLike> (out: Out, x: number, y: number, z: number): Out
     * @static
     */
    static fromEuler<Out extends IQuatLike> (out: Out, x: number, y: number, z: number) {
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;

        const sx = Math.sin(x);
        const cx = Math.cos(x);
        const sy = Math.sin(y);
        const cy = Math.cos(y);
        const sz = Math.sin(z);
        const cz = Math.cos(z);

        out.x = sx * cy * cz + cx * sy * sz;
        out.y = cx * sy * cz + sx * cy * sz;
        out.z = cx * cy * sz - sx * sy * cz;
        out.w = cx * cy * cz - sx * sy * sz;

        return out;
    }

    /**
     * !#zh 返回定义此四元数的坐标系 X 轴向量
     * !#en This returns the result of the quaternion coordinate system X-axis vector
     * @method toAxisX
     * @typescript
     * toAxisX<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out): VecLike
     * @static
     */
    static toAxisX<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out) {
        const fy = 2.0 * q.y;
        const fz = 2.0 * q.z;
        out.x = 1.0 - fy * q.y - fz * q.z;
        out.y = fy * q.x + fz * q.w;
        out.z = fz * q.x + fy * q.w;

        return out;
    }

    /**
     * !#zh 返回定义此四元数的坐标系 Y 轴向量
     * !#en This returns the result of the quaternion coordinate system Y axis vector
     * @method toAxisY
     * @typescript
     * toAxisY<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out): VecLike
     * @static
     */
    static toAxisY<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out) {
        const fx = 2.0 * q.x;
        const fy = 2.0 * q.y;
        const fz = 2.0 * q.z;
        out.x = fy * q.x - fz * q.w;
        out.y = 1.0 - fx * q.x - fz * q.z;
        out.z = fz * q.y + fx * q.w;

        return out;
    }

    /**
     * !#zh 返回定义此四元数的坐标系 Z 轴向量
     * !#en This returns the result of the quaternion coordinate system the Z-axis vector
     * @method toAxisZ
     * @typescript
     * toAxisZ<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out): VecLike
     * @static
     */
    static toAxisZ<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out) {
        const fx = 2.0 * q.x;
        const fy = 2.0 * q.y;
        const fz = 2.0 * q.z;
        out.x = fz * q.x - fy * q.w;
        out.y = fz * q.y - fx * q.w;
        out.z = 1.0 - fx * q.x - fy * q.y;

        return out;
    }

    /**
     * !#zh 根据四元数计算欧拉角，返回角度 x, y 在 [-180, 180] 区间内, z 默认在 [-90, 90] 区间内，旋转顺序为 YZX
     * !#en The quaternion calculated Euler angles, return angle x, y in the [-180, 180] interval, z default the range [-90, 90] interval, the rotation order YZX
     * @method toEuler
     * @typescript
     * toEuler<Out extends IVec3Like> (out: Out, q: IQuatLike, outerZ?: boolean): Out
     * @param outerZ z 取值范围区间改为 [-180, -90] U [90, 180]
     * @static
     */
    static toEuler<Out extends IVec3Like> (out: Out, q: IQuatLike, outerZ?: boolean) {
        const { x, y, z, w } = q;
        let bank = 0;
        let heading = 0;
        let attitude = 0;
        const test = x * y + z * w;
        if (test > 0.499999) {
            bank = 0; // default to zero
            heading = toDegree(2 * Math.atan2(x, w));
            attitude = 90;
        } else if (test < -0.499999) {
            bank = 0; // default to zero
            heading = -toDegree(2 * Math.atan2(x, w));
            attitude = -90;
        } else {
            const sqx = x * x;
            const sqy = y * y;
            const sqz = z * z;
            bank = toDegree(Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz));
            heading = toDegree(Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz));
            attitude = toDegree(Math.asin(2 * test));
            if (outerZ) {
                bank = -180 * Math.sign(bank + 1e-6) + bank;
                heading = -180 * Math.sign(heading + 1e-6) + heading;
                attitude = 180 * Math.sign(attitude + 1e-6) - attitude;
            }
        }
        out.x = bank; out.y = heading; out.z = attitude;
        return out;
    }

    /**
     * !#zh 四元数等价判断
     * !#en Analyzing quaternion equivalent
     * @method strictEquals
     * @typescript
     * strictEquals<Out extends IQuatLike> (a: Out, b: Out): boolean
     * @static
     */
    static strictEquals<Out extends IQuatLike> (a: Out, b: Out) {
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
    }

    /**
     * !#zh 排除浮点数误差的四元数近似等价判断
     * !#en Negative floating point error quaternion approximately equivalent Analyzing
     * @method equals
     * @typescript
     * equals<Out extends IQuatLike> (a: Out, b: Out, epsilon?: number): boolean
     * @static
     */
    static equals<Out extends IQuatLike> (a: Out, b: Out, epsilon = EPSILON) {
        return (Math.abs(a.x - b.x) <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) &&
            Math.abs(a.y - b.y) <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y)) &&
            Math.abs(a.z - b.z) <= epsilon * Math.max(1.0, Math.abs(a.z), Math.abs(b.z)) &&
            Math.abs(a.w - b.w) <= epsilon * Math.max(1.0, Math.abs(a.w), Math.abs(b.w)));
    }


    /**
     * !#zh 四元数转数组
     * !#en Quaternion rotation array
     * @method toArray
     * @typescript
     * toArray <Out extends IWritableArrayLike<number>> (out: Out, q: IQuatLike, ofs?: number): Out
     * @param ofs 数组内的起始偏移量
     * @static
     */
    static toArray <Out extends IWritableArrayLike<number>> (out: Out, q: IQuatLike, ofs = 0) {
        out[ofs + 0] = q.x;
        out[ofs + 1] = q.y;
        out[ofs + 2] = q.z;
        out[ofs + 3] = q.w;
        return out;
    }

    /**
     * !#zh 数组转四元数
     * !#en Array to a quaternion
     * @method fromArray
     * @typescript
     * fromArray <Out extends IQuatLike> (out: Out, arr: IWritableArrayLike<number>, ofs?: number): Out
     * @param ofs 数组起始偏移量
     * @static
     */
    static fromArray <Out extends IQuatLike> (out: Out, arr: IWritableArrayLike<number>, ofs = 0) {
        out.x = arr[ofs + 0];
        out.y = arr[ofs + 1];
        out.z = arr[ofs + 2];
        out.w = arr[ofs + 3];
        return out;
    }


    /**
     * @property {Number} x
     */
    x: number;
    /**
     * @property {Number} y
     */
    y: number;
    /**
     * @property {Number} z
     */
    z: number;
    /**
     * @property {Number} w
     */
    w: number;

    constructor (x: Quat | number = 0, y: number = 0, z: number = 0, w: number = 1) {
        super();

        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        }
        else {
            this.x = x as number;
            this.y = y;
            this.z = z;
            this.w = w;
        }
    }

    /**
     * !#en clone a Quat object and return the new object
     * !#zh 克隆一个四元数并返回
     * @method clone
     * @return {Quat}
     */
    clone (): Quat {
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
    set (newValue: Quat): this {
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
    equals (other: Quat): boolean {
        return other && this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
    }

    /**
     * !#en Convert quaternion to euler
     * !#zh 转换四元数到欧拉角
     * @method toEuler
     * @param {Vec3} out
     * @return {Vec3}
     */
    toEuler (out: Vec3): Vec3 {
        return Quat.toEuler(out, this);
    }

    /**
     * !#en Convert euler to quaternion
     * !#zh 转换欧拉角到四元数
     * @method fromEuler
     * @param {Vec3} euler
     * @return {Quat}
     */
    fromEuler (euler: Vec3): this {
        return Quat.fromEuler(this, euler.x, euler.y, euler.z);
    }

    /**
     * !#en Calculate the interpolation result between this quaternion and another one with given ratio
     * !#zh 计算四元数的插值结果
     * @member lerp
     * @param {Quat} to
     * @param {Number} ratio
     * @param {Quat} [out]
     * @returns {Quat} out
     */
    lerp (to: Quat, ratio: number, out?: Quat): Quat {
        out = out || new Quat();
        Quat.slerp(out, this, to, ratio);
        return out;
    }

    /**
     * !#en Calculate the multiply result between this quaternion and another one
     * !#zh 计算四元数乘积的结果
     * @member multiply
     * @param {Quat} other
     * @returns {Quat} this
     */
    multiply (other: Quat): this {
        return Quat.multiply(this, this, other);
    }

    /**
     * !#en Rotates a quaternion by the given angle (in radians) about a world space axis.
     * !#zh 围绕世界空间轴按给定弧度旋转四元数
     * @member rotateAround
     * @param {Quat} rot - Quaternion to rotate
     * @param {Vec3} axis - The axis around which to rotate in world space
     * @param {Number} rad - Angle (in radians) to rotate
     * @param {Quat} [out] - Quaternion to store result
     * @returns {Quat} out
     */
    rotateAround (rot: Quat, axis: Vec3, rad: number, out?: Quat): Quat {
        out = out || new Quat();
        return Quat.rotateAround(out, rot, axis, rad);
    }
}

const qt_1 = new Quat();
const qt_2 = new Quat();
const v3_1 = new Vec3();
const m3_1 = new Mat3();
const halfToRad = 0.5 * Math.PI / 180.0;

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
cc.quat = function quat (x, y, z, w) {
    return new Quat(x, y, z, w);
};

cc.Quat = Quat;
