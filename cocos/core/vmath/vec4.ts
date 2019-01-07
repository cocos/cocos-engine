/// <reference path="./fwd-decls" />

import { EPSILON, random } from './utils';

/**
 * Mathematical 4-dimensional vector.
 *
 * x, y, z, w is alias of the first, second, third, fourth component of vector, respectively.
 */
export default class vec4 {

    /**
     * Create a vector, with components specified separately.
     *
     * @param x - Value assigned to x component.
     * @param y - Value assigned to y component.
     * @param z - Value assigned to z component.
     * @param w - Value assigned to w component.
     * @return The newly created vector.
     */
    public static create (x = 0, y = 0, z = 0, w = 1) {
        return new vec4(x, y, z, w);
    }

    /**
     * Creates a zero vector.
     *
     * @return The newly created vector.
     */
    public static zero (out: vec4) {
        out.x = 0;
        out.y = 0;
        out.z = 0;
        out.w = 0;
        return out;
    }

    /**
     * Clone a vector.
     *
     * @param a - Vector to clone.
     * @return The newly created vector.
     */
    public static clone (a: vec4) {
        return new vec4(a.x, a.y, a.z, a.w);
    }

    /**
     * Copy content of a vector into another.
     *
     * @param out - The vector to modified.
     * @param a - The specified vector.
     * @return out.
     */
    public static copy<Out extends IVec4Like> (out: Out, a: vec4) {
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        out.w = a.w;
        return out;
    }

    /**
     * Sets the components of a vector to the given values.
     *
     * @param out - The vector to modified.
     * @param x - Value set to x component.
     * @param y - Value set to y component.
     * @param z - Value set to z component.
     * @param w - Value set to w component.
     * @return out.
     */
    public static set<Out extends IVec4Like> (out: Out, x: number, y: number, z: number, w: number) {
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
        return out;
    }

    /**
     * Add two vectors.
     *
     * It doesn't matter that any amount of these parameters refer to same vector.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    public static add<Out extends IVec4Like> (out: Out, a: vec4, b: vec4) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
        out.w = a.w + b.w;
        return out;
    }

    /**
     * Subtract two vectors.
     *
     * It doesn't matter that any amount of these parameters refer to same vector.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    public static subtract<Out extends IVec4Like> (out: Out, a: vec4, b: vec4) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        out.w = a.w - b.w;
        return out;
    }

    /**
     * Alias of {@link vec4.subtract}.
     */
    public static sub<Out extends IVec4Like> (out: Out, a: vec4, b: vec4) {
        return vec4.subtract(out, a, b);
    }

    /**
     * Performs multiply on each component of two vectors respectively.
     *
     * It doesn't matter that any amount of these parameters refer to same vector.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    public static multiply<Out extends IVec4Like> (out: Out, a: vec4, b: vec4) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        out.w = a.w * b.w;
        return out;
    }

    /**
     * Alias of {@link vec4.multiply}.
     */
    public static mul<Out extends IVec4Like> (out: Out, a: vec4, b: vec4) {
        return vec4.multiply(out, a, b);
    }

    /**
     * Performs division on each component of two vectors respectively.
     *
     * It doesn't matter that any amount of these parameters refer to same vector.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    public static divide<Out extends IVec4Like> (out: Out, a: vec4, b: vec4) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        out.z = a.z / b.z;
        out.w = a.w / b.w;
        return out;
    }

    /**
     * Alias of {@link vec4.divide}.
     */
    public static div<Out extends IVec4Like> (out: Out, a: vec4, b: vec4) {
        return vec4.divide(out, a, b);
    }

    /**
     * Performs Math.ceil on each component of a vector.
     *
     * It doesn't matter that any amount of these parameters refer to same vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to perform operation.
     * @return out.
     */
    public static ceil<Out extends IVec4Like> (out: Out, a: vec4) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        out.z = Math.ceil(a.z);
        out.w = Math.ceil(a.w);
        return out;
    }

    /**
     * Performs Math.floor on each component of a vector.
     *
     * It doesn't matter that any amount of these parameters refer to same vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to perform operation.
     * @return out.
     */
    public static floor<Out extends IVec4Like> (out: Out, a: vec4) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        out.z = Math.floor(a.z);
        out.w = Math.floor(a.w);
        return out;
    }

    /**
     * Performs Math.min on each component of two vectors respectively.
     *
     * It doesn't matter that any amount of these parameters refer to same vector.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    public static min<Out extends IVec4Like> (out: Out, a: vec4, b: vec4) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        out.z = Math.min(a.z, b.z);
        out.w = Math.min(a.w, b.w);
        return out;
    }

    /**
     * Performs Math.min on each component of two vectors respectively.
     *
     * It doesn't matter that any amount of these parameters refer to same vector.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    public static max<Out extends IVec4Like> (out: Out, a: vec4, b: vec4) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        out.z = Math.max(a.z, b.z);
        out.w = Math.max(a.w, b.w);
        return out;
    }

    /**
     * Performs Math.round on each component of a vector.
     *
     * It doesn't matter that any amount of these parameters refer to same vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to perform operation.
     * @return out.
     */
    public static round<Out extends IVec4Like> (out: Out, a: vec4) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        out.z = Math.round(a.z);
        out.w = Math.round(a.w);
        return out;
    }

    /**
     * Scales a vector with a number.
     *
     * @param out - Vector to store result.
     * @param a - Vector to scale.
     * @param b - The scale number.
     * @return out.
     */
    public static scale<Out extends IVec4Like> (out: Out, a: vec4, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        out.w = a.w * b;
        return out;
    }

    /**
     * Add two vectors after scaling the second operand by a number.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @param scale - The scale number before adding.
     * @return out.
     */
    public static scaleAndAdd<Out extends IVec4Like> (out: Out, a: vec4, b: vec4, scale: number) {
        out.x = a.x + (b.x * scale);
        out.y = a.y + (b.y * scale);
        out.z = a.z + (b.z * scale);
        out.w = a.w + (b.w * scale);
        return out;
    }

    /**
     * Calculates the euclidian distance between two vectors.
     *
     * @param a - The first operand.
     * @param b - The second operand.
     * @return Distance between a and b.
     */
    public static distance (a: vec4, b: vec4) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        const w = b.w - a.w;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * Alias of {@link vec4.distance}.
     */
    public static dist (a: vec4, b: vec4) {
        return vec4.distance(a, b);
    }

    /**
     * Calculates the squared euclidian distance between two vectors.
     *
     * @param a - The first operand.
     * @param b - The second operand.
     * @return Squared distance between a and b.
     */
    public static squaredDistance (a: vec4, b: vec4) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        const w = b.w - a.w;
        return x * x + y * y + z * z + w * w;
    }

    /**
     * Alias of {@link vec4.squaredDistance}.
     */
    public static sqrDist (a: vec4, b: vec4) {
        return vec4.squaredDistance(a, b);
    }

    /**
     * Calculates the length of a vector.
     *
     * @param a - The vector.
     * @return Length of the vector.
     */
    public static magnitude (a: vec4) {
        const { x, y, z, w } = a;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * Alias of {@link vec4.magnitude}.
     */
    public static mag (a: vec4) {
        return vec4.magnitude(a);
    }

    /**
     * Calculates the squared length of a vector.
     *
     * @param a - The vector.
     * @return Squared length of the vector.
     */
    public static squaredMagnitude (a: vec4) {
        const { x, y, z, w } = a;
        return x * x + y * y + z * z + w * w;
    }

    /**
     * Alias of {@link vec4.squaredMagnitude}
     */
    public static sqrMag (a: vec4) {
        return vec4.squaredMagnitude(a);
    }

    /**
     * Negates each component of a vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to negate.
     * @return out.
     */
    public static negate<Out extends IVec4Like> (out: Out, a: vec4) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        out.w = -a.w;
        return out;
    }

    /**
     * Inverts the components of a vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to invert.
     * @return out.
     */
    public static inverse<Out extends IVec4Like> (out: Out, a: vec4) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        out.z = 1.0 / a.z;
        out.w = 1.0 / a.w;
        return out;
    }

    /**
     * Safely inverts the components of a vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to invert.
     * @return out.
     */
    public static inverseSafe<Out extends IVec4Like> (out: Out, a: vec4) {
        const { x, y, z, w } = a;

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

        if (Math.abs(w) < EPSILON) {
            out.w = 0;
        } else {
            out.w = 1.0 / w;
        }

        return out;
    }

    /**
     * Normalizes a vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to normalize.
     * @return out.
     */
    public static normalize<Out extends IVec4Like> (out: Out, a: vec4) {
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
     * Calculates the dot product of two vectors.
     *
     * @param a - The first operand.
     * @param b - The second operand.
     * @return Dot product of a and b.
     */
    public static dot (a: vec4, b: vec4) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    /**
     * Performs a linear interpolation between two vectors.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @param t - The interpolation coefficient.
     * @return out.
     */
    public static lerp<Out extends IVec4Like> (out: Out, a: vec4, b: vec4, t: number) {
        const { x: ax, y: ay, z: az, w: aw } = a;
        out.x = ax + t * (b.x - ax);
        out.y = ay + t * (b.y - ay);
        out.z = az + t * (b.z - az);
        out.w = aw + t * (b.w - aw);
        return out;
    }

    /**
     * Generates a random vector uniformly distributed on a sphere centered at the origin.
     *
     * @param out - Vector to store result.
     * @param [scale] Length of the resulting vector. If ommitted, a unit length vector will be returned.
     * @return out.
     */
    public static random<Out extends IVec4Like> (out: Out, scale: number) {
        scale = scale || 1.0;

        const phi = random() * 2.0 * Math.PI;
        const theta = Math.acos(random() * 2 - 1);

        out.x = Math.sin(theta) * Math.cos(phi) * scale;
        out.y = Math.sin(theta) * Math.sin(phi) * scale;
        out.z = Math.cos(theta) * scale;
        out.w = 0;
        return out;
    }

    /**
     * Transforms a vector with a 4x4 matrix.
     *
     * @param out - Vector to store result.
     * @param a - Vector to transform.
     * @param m - The matrix.
     * @return out.
     */
    public static transformMat4<Out extends IVec4Like> (out: Out, a: vec4, m: IMat4Like) {
        const { x, y, z, w } = a;
        out.x = m.m00 * x + m.m04 * y + m.m08 * z + m.m12 * w;
        out.y = m.m01 * x + m.m05 * y + m.m09 * z + m.m13 * w;
        out.z = m.m02 * x + m.m06 * y + m.m10 * z + m.m14 * w;
        out.w = m.m03 * x + m.m07 * y + m.m11 * z + m.m15 * w;
        return out;
    }

    /**
     * Transforms a vector with a quaternion.
     *
     * @param out - Vector to store result.
     * @param a - Vector to transform.
     * @param q - The quaternion.
     * @return out.
     */
    public static transformQuat<Out extends IVec4Like> (out: Out, a: vec4, q: IQuatLike) {
        const { x, y, z } = a;
        const { x: qx, y: qy, z: qz, w: qw } = q;

        // calculate quat * vec
        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        out.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        out.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        out.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        out.w = a.w;
        return out;
    }

    /**
     * Returns string representation of a vector.
     *
     * @param a - The vector.
     * @return - String representation of this vector.
     */
    public static str (a: vec4) {
        return `vec4(${a.x}, ${a.y}, ${a.z}, ${a.w})`;
    }

    /**
     * Store components of a vector into array.
     *
     * @param out - Array to store result.
     * @param v - The vector.
     * @return out.
     */
    public static array<Out extends IWritableArrayLike<number>> (out: Out, v: vec4) {
        out[0] = v.x;
        out[1] = v.y;
        out[2] = v.z;
        out[3] = v.w;

        return out;
    }

    /**
     * Returns whether the specified vectors are equal. (Compared using ===)
     *
     * @param a - The first vector.
     * @param b - The second vector.
     * @return True if the vectors are equal, false otherwise.
     */
    public static exactEquals (a: vec4, b: vec4) {
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
    }

    /**
     * Returns whether the specified vectors are approximately equal.
     *
     * @param a The first vector.
     * @param b The second vector.
     * @return True if the vectors are approximately equal, false otherwise.
     */
    public static equals (a: vec4, b: vec4) {
        const { x: a0, y: a1, z: a2, w: a3 } = a;
        const { x: b0, y: b1, z: b2, w: b3 } = a;
        return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
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
     * Creates a vector, with components specified separately.
     *
     * @param x - Value assigned to x component.
     * @param y - Value assigned to y component.
     * @param z - Value assigned to z component.
     * @param w - Value assigned to w component.
     */
    constructor (x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
