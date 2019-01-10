/// <reference path="./fwd-decls" />

import mat3 from './mat3';
import { toDegree } from './utils';
import vec3 from './vec3';
import vec4 from './vec4';

const halfToRad = 0.5 * Math.PI / 180.0;

/**
 * Mathematical quaternion.
 *
 * A quaternion is a hypercomplex number represented by w + xi + yj + zk, where
 * x, y, z and w are real numbers(called here its components), and i, j, and k are the fundamental quaternion units.
 */
export default class quat {
    public static IDENTITY = new quat();

    /**
     * Creates a quaternion, with components specified separately.
     *
     * @param x - Value assigned to x component.
     * @param y - Value assigned to y component.
     * @param z - Value assigned to z component.
     * @param w - Value assigned to w component.
     * @return The newly created quaternion.
     */
    public static create(x = 0, y = 0, z = 0, w = 1) {
        return new quat(x, y, z, w);
    }

    /**
     * Clone a quaternion.
     *
     * @param a - Quaternion to clone.
     * @return The newly created quaternion.
     */
    public static clone(a: quat) {
        return new quat(a.x, a.y, a.z, a.w);
    }

    /**
     * Copy content of a quaternion into another.
     *
     * @param out - Quaternion to modified.
     * @param a - The specified quaternion.
     * @return out.
     */
    public static copy<Out extends IQuatLike>(out: Out, a: quat) {
        return vec4.copy(out, a);
    }

    /**
     * Sets the components of a quaternion to the given values.
     *
     * @param out - The quaternion to modified.
     * @param x - Value set to x component.
     * @param y - Value set to y component.
     * @param z - Value set to z component.
     * @param w - Value set to w component.
     * @return out.
     */
    public static set<Out extends IQuatLike>(out: Out, x: number, y: number, z: number, w: number) {
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
        return out;
    }

    /**
     * Sets a quaternion to represent the shortest rotation from one
     * vector to another.
     *
     * Both vectors are assumed to be unit length.
     *
     * @param out - Quaternion to set.
     * @param a - The initial vector.
     * @param b - The destination vector.
     * @return out.
     */
    public static rotationTo<Out extends IQuatLike>(out: Out, a: vec3, b: vec3) {
        const dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpVec3, tmpXUnitVec3, a);
            if (vec3.magnitude(tmpVec3) < 0.000001) {
                vec3.cross(tmpVec3, tmpYUnitVec3, a);
            }
            vec3.normalize(tmpVec3, tmpVec3);
            quat.fromAxisAngle(out, tmpVec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            out.w = 1;
            return out;
        } else {
            vec3.cross(tmpVec3, a, b);
            out.x = tmpVec3.x;
            out.y = tmpVec3.y;
            out.z = tmpVec3.z;
            out.w = 1 + dot;
            return quat.normalize(out, out);
        }
    }

    /**
     * Gets the rotation axis and angle for a given
     *  quaternion. If a quaternion is created with
     *  fromAxisAngle, this method will return the same
     *  values as provided in the original parameter list
     *  OR functionally equivalent values.
     * Example: The quaternion formed by axis [0, 0, 1] and
     *  angle -90 is the same as the quaternion formed by
     *  [0, 0, 1] and 270. This method favors the latter.
     * @param  {vec3} out_axis - Vector to store the rotation axis.
     * @param  {quat} q - Quaternion to be decomposed.
     * @return - Angle, in radians, of the rotation.
     */
    public static getAxisAngle<Out extends IVec3Like>(outAxis: Out, q: quat) {
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
     * Multiply two quaternions.
     *
     * @param out - Quaternion to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    public static multiply<Out extends IQuatLike>(out: Out, a: quat, b: quat) {
        const { x: ax, y: ay, z: az, w: aw } = a;
        const { x: bx, y: by, z: bz, w: bw } = b;

        out.x = ax * bw + aw * bx + ay * bz - az * by;
        out.y = ay * bw + aw * by + az * bx - ax * bz;
        out.z = az * bw + aw * bz + ax * by - ay * bx;
        out.w = aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }

    /**
     * Alias of {@link quat.multiply}.
     */
    public static mul<Out extends IQuatLike>(out: Out, a: quat, b: quat) {
        return quat.multiply(out, a, b);
    }

    /**
     * Scales a quaternion with a number.
     *
     * @param out - Quaternion to store result.
     * @param a - Quaternion to scale.
     * @param b - The scale number.
     * @return out.
     */
    public static scale<Out extends IQuatLike>(out: Out, a: quat, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        out.w = a.w * b;
        return out;
    }

    /**
     * Rotates a quaternion by the given angle about the X axis.
     *
     * @param out - Quaternion to store result.
     * @param a - Quaternion to rotate.
     * @param rad - Angle (in radians) to rotate.
     * @return out.
     */
    public static rotateX<Out extends IQuatLike>(out: Out, a: quat, rad: number) {
        rad *= 0.5;

        const { x: ax, y: ay, z: az, w: aw } = a;
        const bx = Math.sin(rad);
        const bw = Math.cos(rad);

        out.x = ax * bw + aw * bx;
        out.y = ay * bw + az * bx;
        out.z = az * bw - ay * bx;
        out.w = aw * bw - ax * bx;
        return out;
    }

    /**
     * Rotates a quaternion by the given angle about the Y axis.
     *
     * @param out - Quaternion to store result.
     * @param a - Quaternion to rotate.
     * @param rad - Angle (in radians) to rotate.
     * @return out.
     */
    public static rotateY<Out extends IQuatLike>(out: Out, a: quat, rad: number) {
        rad *= 0.5;

        const { x: ax, y: ay, z: az, w: aw } = a;
        const by = Math.sin(rad);
        const bw = Math.cos(rad);

        out.x = ax * bw - az * by;
        out.y = ay * bw + aw * by;
        out.z = az * bw + ax * by;
        out.w = aw * bw - ay * by;
        return out;
    }

    /**
     * Rotates a quaternion by the given angle about the Z axis.
     *
     * @param out - Quaternion to store result.
     * @param a - Quaternion to rotate.
     * @param rad - Angle (in radians) to rotate.
     * @return out.
     */
    public static rotateZ<Out extends IQuatLike>(out: Out, a: quat, rad: number) {
        rad *= 0.5;

        const { x: ax, y: ay, z: az, w: aw } = a;
        const bz = Math.sin(rad);
        const bw = Math.cos(rad);

        out.x = ax * bw + ay * bz;
        out.y = ay * bw - ax * bz;
        out.z = az * bw + aw * bz;
        out.w = aw * bw - az * bz;
        return out;
    }

    /**
     * Rotates a quaternion by the given angle about a world space axis.
     *
     * @param out - Quaternion to store result.
     * @param rot - Quaternion to rotate.
     * @param axis - The axis around which to rotate in world space.
     * @param rad - Angle (in radians) to rotate.
     * @return out.
     */
    public static rotateAround<Out extends IQuatLike>(out: Out, rot: quat, axis: IVec3Like, rad: number) {
        // get inv-axis (local to rot)
        quat.invert(tmpQuat1, rot);
        vec3.transformQuat(tmpVec3, axis, tmpQuat1);
        // rotate by inv-axis
        quat.fromAxisAngle(tmpQuat1, tmpVec3, rad);
        quat.mul(out, rot, tmpQuat1);
        return out;
    }

    /**
     * Rotates a quaternion by the given angle about a local space axis.
     *
     * @param out - Quaternion to store result.
     * @param rot - Quaternion to rotate.
     * @param axis - The axis around which to rotate in local space.
     * @param rad - Angle (in radians) to rotate.
     * @return out.
     */
    public static rotateAroundLocal<Out extends IQuatLike>(out: Out, rot: quat, axis: IVec3Like, rad: number) {
        quat.fromAxisAngle(tmpQuat1, axis, rad);
        quat.mul(out, rot, tmpQuat1);
        return out;
    }

    /**
     * Calculates the W component of a quaternion from the X, Y, and Z components.
     * Assumes that quaternion is 1 unit in length.
     * Any existing W component will be ignored.
     *
     * @param out - Quaternion to store result.
     * @param a - Quaternion to calculate W.
     * @return out.
     */
    public static calculateW<Out extends IQuatLike>(out: Out, a: quat) {
        const { x, y, z } = a;

        out.x = x;
        out.y = y;
        out.z = z;
        out.w = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
        return out;
    }

    /**
     * Calculates the dot product of two quaternions.
     *
     * @param a - The first operand.
     * @param b - The second operand.
     * @return - The dot product of a and b.
     */
    public static dot(a: quat, b: quat) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    /**
     * Performs a linear interpolation between two quaternions.
     *
     * @param out - Quaternion to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @param t - The interpolation coefficient.
     * @return out.
     */
    public static lerp<Out extends IQuatLike>(out: Out, a: quat, b: quat, t: number) {
        const { x: ax, y: ay, z: az, w: aw } = a;
        out.x = ax + t * (b.x - ax);
        out.y = ay + t * (b.y - ay);
        out.z = az + t * (b.z - az);
        out.w = aw + t * (b.w - aw);
        return out;
    }

    /**
     * Performs a spherical linear interpolation between two quaternions.
     *
     * @param out - Quaternion to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @param t - The interpolation coefficient.
     * @return out.
     */
    public static slerp<Out extends IQuatLike>(out: Out, a: quat, b: quat, t: number) {
        // benchmarks:
        //    http://jsperf.com/quaternion-slerp-implementations

        const { x: ax, y: ay, z: az, w: aw } = a;
        let { x: bx, y: by, z: bz, w: bw } = b;

        let scale0 = 0;
        let scale1 = 0;

        // calc cosine
        let cosom = ax * bx + ay * by + az * bz + aw * bw;
        // adjust signs (if necessary)
        if (cosom < 0.0) {
            cosom = -cosom;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
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
        out.x = scale0 * ax + scale1 * bx;
        out.y = scale0 * ay + scale1 * by;
        out.z = scale0 * az + scale1 * bz;
        out.w = scale0 * aw + scale1 * bw;

        return out;
    }

    /**
     * Performs a spherical linear interpolation with two control points.
     *
     * @param out - Quaternion to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @param c - The third operand.
     * @param d - The fourth operand.
     * @param t - The interpolation coefficient.
     * @return out
     */
    public static sqlerp<Out extends IQuatLike>(out: Out, a: quat, b: quat, c: quat, d: quat, t: number) {
        quat.slerp(tmpQuat1, a, d, t);
        quat.slerp(tmpQuat2, b, c, t);
        quat.slerp(out, tmpQuat1, tmpQuat2, 2 * t * (1 - t));
        return out;
    }

    /**
     * Calculates the inverse of a quaternion.
     *
     * @param out - Quaternion to store result.
     * @param a - Quaternion to calculate inverse of.
     * @return out.
     */
    public static invert<Out extends IQuatLike>(out: Out, a: quat) {
        const { x: a0, y: a1, z: a2, w: a3 } = a;
        const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        const invDot = dot ? 1.0 / dot : 0;

        // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

        out.x = -a0 * invDot;
        out.y = -a1 * invDot;
        out.z = -a2 * invDot;
        out.w = a3 * invDot;
        return out;
    }

    /**
     * Calculates the conjugate of a quaternion.
     * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
     *
     * @param out - Quaternion to store result.
     * @param a - Quaternion to calculate conjugate of.
     * @return out.
     */
    public static conjugate<Out extends IQuatLike>(out: Out, a: quat) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        out.w = a.w;
        return out;
    }

    /**
     * Calculates the length of a quaternion.
     *
     * @param a - The quaternion.
     * @return Length of the quaternion.
     */
    public static magnitude(a: quat) {
        const { x, y, z, w } = a;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * Alias of {@link quat.magnitude}.
     */
    public static mag(a: quat) {
        return quat.magnitude(a);
    }

    /**
     * Calculates the squared length of a quaternion.
     *
     * @param a - The quaternion.
     * @return Squared length of the quaternion.
     */
    public static squaredMagnitude(a: quat) {
        const { x, y, z, w } = a;
        return x * x + y * y + z * z + w * w;
    }

    /**
     * Alias of {@link quat.squaredMagnitude}
     */
    public static sqrMag(a: quat) {
        return quat.squaredMagnitude(a);
    }

    /**
     * Normalizes a quaternion.
     *
     * @param out - Quaternion to store result.
     * @param a - Quaternion to normalize.
     * @return out.
     * @function
     */
    public static normalize<Out extends IQuatLike>(out: Out, a: quat) {
        const { x, y, z, w } = a;
        let len = x * x + y * y + z * z + w * w;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = x * len;
            out.y = y * len;
            out.z = z * len;
            out.w = w * len;
        }
        return out;
    }

    /**
     * Sets the specified quaternion with values corresponding to the given
     * axes. Each axis is a vec3 and is expected to be unit length and
     * perpendicular to all other specified axes.
     *
     * @param out - Quaternion to store result.
     * @param xAxis - Vector representing the local "right" direction.
     * @param yAxis - Vector representing the local "up" direction.
     * @param zAxis - Vector representing the viewing direction.
     * @return out.
     */
    public static fromAxes<Out extends IQuatLike>(out: Out, xAxis: IVec3Like, yAxis: IVec3Like, zAxis: IVec3Like) {
        mat3.set(tmpMat3,
            xAxis.x, xAxis.y, xAxis.z,
            yAxis.x, yAxis.y, yAxis.z,
            zAxis.x, zAxis.y, zAxis.z,
        );
        return quat.normalize(out, quat.fromMat3(out, tmpMat3));
    }

    /**
     * Calculates a quaternion from view direction and up direction
     *
     * @param out - Quaternion to store result.
     * @param view - View direction (must be normalized).
     * @param [up] - Up direction, default is (0,1,0) (must be normalized).
     *
     * @return out.
     */
    public static fromViewUp<Out extends IQuatLike>(out: Out, view: IVec3Like, up: IVec3Like) {
        mat3.fromViewUp(tmpMat3, view, up);
        return quat.normalize(out, quat.fromMat3(out, tmpMat3));
    }

    /**
     * Sets a quaternion from the given angle and rotation axis,
     * then returns it.
     *
     * @param out - Quaternion to store result.
     * @param axis - The axis around which to rotate.
     * @param rad - The angle in radians.
     * @return out.
     */
    public static fromAxisAngle<Out extends IQuatLike>(out: Out, axis: IVec3Like, rad: number) {
        rad = rad * 0.5;
        const s = Math.sin(rad);
        out.x = s * axis.x;
        out.y = s * axis.y;
        out.z = s * axis.z;
        out.w = Math.cos(rad);
        return out;
    }

    /**
     * Creates a quaternion from the given 3x3 rotation matrix.
     *
     * NOTE: The resultant quaternion is not normalized, so you should be sure
     * to re-normalize the quaternion yourself where necessary.
     *
     * @param out - Quaternion to store result.
     * @param m - The rotation matrix.
     * @return out.
     * @function
     */
    public static fromMat3<Out extends IQuatLike>(out: Out, m: IMat3Like) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

        const {
            m00: m00, m03: m01, m06: m02,
            m01: m10, m04: m11, m07: m12,
            m02: m20, m05: m21, m08: m22,
        } = m;

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
     * Creates a quaternion from the given euler angle x, y, z.
     *
     * @param out - Quaternion to store result.
     * @param x - Angle to rotate around X axis in degrees.
     * @param y - Angle to rotate around Y axis in degrees.
     * @param z - Angle to rotate around Z axis in degrees.
     * @return out.
     * @function
     */
    public static fromEuler<Out extends IQuatLike>(out: Out, x: number, y: number, z: number) {
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
     *  Returns the X orthonormal axis defining the quaternion.
     *
     * @param out - X axis.
     * @param q - The quaternion.
     * @function
     */
    public static toAxisX(out: vec3, q: quat) {
        let fy = 2.0 * q.y;
        let fz = 2.0 * q.z;
        out.x = 1.0 - fy * q.y - fz * q.z;
        out.y = fy * q.x + fz * q.w;
        out.z = fz * q.x + fy * q.w;
    }

    /**
     *  Returns the Y orthonormal axis defining the quaternion.
     *
     * @param out - Y axis.
     * @param q - The quaternion.
     * @function
     */
    public static toAxisY(out: vec3, q: quat) {
        let fx = 2.0 * q.x;
        let fy = 2.0 * q.y;
        let fz = 2.0 * q.z;
        out.x = fy * q.x - fz * q.w;
        out.y = 1.0 - fx * q.x - fz * q.z;
        out.z = fz * q.y + fx * q.w;
    }

    /**
     *  Returns the Z orthonormal axis defining the quaternion.
     *
     * @param out - Z axis.
     * @param q - The quaternion.
     * @function
     */
    public static toAxisZ(out: vec3, q: quat) {
        let fx = 2.0 * q.x;
        let fy = 2.0 * q.y;
        let fz = 2.0 * q.z;
        out.x = fz * q.x - fy * q.w;
        out.y = fz * q.y - fx * q.w;
        out.z = 1.0 - fx * q.x - fy * q.y;
    }

    /**
     * Convert a quaternion back to euler angle (in degrees).
     *
     * @param out - Euler angle stored as a vec3
     * @param q - the quaternion to be converted
     * @return out.
     */
    public static toEuler<Out extends IQuatLike>(out: Out, q: quat) {
        const { x, y, z, w } = q;
        let heading: number = 0;
        let attitude: number = 0;
        let bank: number = 0;
        const test = x * y + z * w;
        if (test > 0.499999) { // singularity at north pole
            heading = 2 * Math.atan2(x, w);
            attitude = Math.PI / 2;
            bank = 0;
        }
        if (test < -0.499999) { // singularity at south pole
            heading = -2 * Math.atan2(x, w);
            attitude = - Math.PI / 2;
            bank = 0;
        }
        if (isNaN(heading)) {
            const sqx = x * x;
            const sqy = y * y;
            const sqz = z * z;
            heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz); // heading
            attitude = Math.asin(2 * test); // attitude
            bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz); // bank
        }

        // Keep angles [0..360].
        out.y = toDegree(heading) + (heading < 0 ? 360 : 0);
        out.z = toDegree(attitude) + (attitude < 0 ? 360 : 0);
        out.x = toDegree(bank) + (bank < 0 ? 360 : 0);

        return out;
    }

    /**
     * Returns string representation of a quaternion.
     *
     * @param a - The quaternion.
     * @return - String representation of this quaternion.
     */
    public static str(a: quat) {
        return `quat(${a.x}, ${a.y}, ${a.z}, ${a.w})`;
    }

    /**
     * Store components of a quaternion into array.
     *
     * @param out - Array to store result.
     * @param q - The quaternion.
     * @return out.
     */
    public static array<Out extends IWritableArrayLike<number>>(out: Out, q: quat) {
        out[0] = q.x;
        out[1] = q.y;
        out[2] = q.z;
        out[3] = q.w;

        return out;
    }

    /**
     * Returns whether the specified quaternions are equal. (Compared using ===)
     *
     * @param a - The first quaternion.
     * @param b - The second quaternion.
     * @return True if the quaternions are equal, false otherwise.
     */
    public static exactEquals(a: quat, b: quat) {
        return vec4.exactEquals(a, b);
    }

    /**
     * Returns whether the specified quaternions are approximately equal.
     *
     * @param a The first quaternion.
     * @param b The second quaternion.
     * @return True if the quaternions are approximately equal, false otherwise.
     */
    public static equals(a: quat, b: quat) {
        return vec4.equals(a, b);
    }

    /**
     * The x component.
     */
    public x: number;

    /**
     * The y component.
     */
    public y: number;

    /**
     * The z component.
     */
    public z: number;

    /**
     * The w component.
     */
    public w: number;

    /**
     * Creates a quaternion, with components specified separately.
     *
     * @param x - Value assigned to x component.
     * @param y - Value assigned to y component.
     * @param z - Value assigned to z component.
     * @param w - Value assigned to w component.
     */
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

const tmpQuat1 = quat.create();
const tmpQuat2 = quat.create();
const tmpVec3 = vec3.create();
const tmpMat3 = mat3.create();
const tmpXUnitVec3 = vec3.create(1, 0, 0);
const tmpYUnitVec3 = vec3.create(0, 1, 0);
