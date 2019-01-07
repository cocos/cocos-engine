/// <reference path="./fwd-decls" />

import { EPSILON, random } from './utils';

/**
 * Mathematical 2-dimensional vector.
 *
 * x, y is alias of the first, second component of vector, respectively.
 */
export default class vec2 {

    /**
     * Creates a vector, with components specified separately.
     *
     * @param x - Value assigned to x component.
     * @param y - Value assigned to y component.
     * @return The newly created vector.
     */
    public static create (x = 0, y = 0) {
        return new vec2(x, y);
    }

    /**
     * Creates a zero vector.
     *
     * @return The newly created vector.
     */
    public static zero<Out extends IVec2Like> (out: Out) {
        out.x = 0;
        out.y = 0;
        return out;
    }

    /**
     * Clone a vector.
     *
     * @param a - Vector to clone.
     * @return The newly created vector.
     */
    public static clone (a: vec2) {
        return new vec2(a.x, a.y);
    }

    /**
     * Copy content of a vector into another.
     *
     * @param out - The vector to modified.
     * @param a - The specified vector.
     * @return out.
     */
    public static copy<Out extends IVec2Like> (out: Out, a: vec2) {
        out.x = a.x;
        out.y = a.y;
        return out;
    }

    /**
     * Sets the components of a vector to the given values.
     *
     * @param out - The vector to modified.
     * @param x - Value set to x component.
     * @param y - Value set to y component.
     * @return out.
     */
    public static set<Out extends IVec2Like> (out: Out, x: number, y: number) {
        out.x = x;
        out.y = y;
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
    public static add<Out extends IVec2Like> (out: Out, a: vec2, b: vec2) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
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
    public static subtract<Out extends IVec2Like> (out: Out, a: vec2, b: vec2) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    }

    /**
     * Alias of {@link vec2.subtract}.
     */
    public static sub<Out extends IVec2Like> (out: Out, a: vec2, b: vec2) {
        return vec2.subtract(out, a, b);
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
    public static multiply<Out extends IVec2Like> (out: Out, a: vec2, b: vec2) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        return out;
    }

    /**
     * Alias of {@link vec2.multiply}.
     */
    public static mul<Out extends IVec2Like> (out: Out, a: vec2, b: vec2) {
        return vec2.multiply(out, a, b);
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
    public static divide<Out extends IVec2Like> (out: Out, a: vec2, b: vec2) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        return out;
    }

    /**
     * Alias of {@link vec2.divide}.
     */
    public static div<Out extends IVec2Like> (out: Out, a: vec2, b: vec2) {
        return vec2.divide(out, a, b);
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
    public static ceil<Out extends IVec2Like> (out: Out, a: vec2) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
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
    public static floor<Out extends IVec2Like> (out: Out, a: vec2) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
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
    public static min<Out extends IVec2Like> (out: Out, a: vec2, b: vec2) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
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
    public static max<Out extends IVec2Like> (out: Out, a: vec2, b: vec2) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
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
    public static round<Out extends IVec2Like> (out: Out, a: vec2) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
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
    public static scale<Out extends IVec2Like> (out: Out, a: vec2, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
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
    public static scaleAndAdd<Out extends IVec2Like> (out: Out, a: vec2, b: vec2, scale: number) {
        out.x = a.x + (b.x * scale);
        out.y = a.y + (b.y * scale);
        return out;
    }

    /**
     * Calculates the euclidian distance between two vectors.
     *
     * @param a - The first operand.
     * @param b - The second operand.
     * @return Distance between a and b.
     */
    public static distance (a: vec2, b: vec2) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * Alias of {@link vec2.distance}.
     */
    public static dist (a: vec2, b: vec2) {
        return vec2.distance(a, b);
    }

    /**
     * Calculates the squared euclidian distance between two vectors.
     *
     * @param a - The first operand.
     * @param b - The second operand.
     * @return Squared distance between a and b.
     */
    public static squaredDistance (a: vec2, b: vec2) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        return x * x + y * y;
    }

    /**
     * Alias of {@link vec2.squaredDistance}.
     */
    public static sqrDist (a: vec2, b: vec2) {
        return vec2.squaredDistance(a, b);
    }

    /**
     * Calculates the length of a vector.
     *
     * @param a - The vector.
     * @return Length of the vector.
     */
    public static magnitude (a: vec2) {
        const { x, y } = a;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * Alias of {@link vec2.magnitude}.
     */
    public static mag (a: vec2) {
        return vec2.magnitude(a);
    }

    /**
     * Calculates the squared length of a vector.
     *
     * @param a - The vector.
     * @return Squared length of the vector.
     */
    public static squaredMagnitude (a: vec2) {
        const { x, y } = a;
        return x * x + y * y;
    }

    /**
     * Alias of {@link vec2.squaredMagnitude}
     */
    public static sqrMag (a: vec2) {
        return vec2.squaredMagnitude(a);
    }

    /**
     * Negates each component of a vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to negate.
     * @return out.
     */
    public static negate<Out extends IVec2Like> (out: Out, a: vec2) {
        out.x = -a.x;
        out.y = -a.y;
        return out;
    }

    /**
     * Invert the components of a vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to invert.
     * @return out.
     */
    public static inverse<Out extends IVec2Like> (out: Out, a: vec2) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        return out;
    }

    /**
     * Safely invert the components of a vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to invert.
     * @return out.
     */
    public static inverseSafe<Out extends IVec2Like> (out: Out, a: vec2) {
        const { x, y } = a;

        if (Math.abs(x) < EPSILON) {
            out.x = 0;
        } else {
            out.x = 1.0 / x;
        }

        if (Math.abs(y) < EPSILON) {
            out.y = 0;
        } else {
            out.y = 1.0 / a.y;
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
    public static normalize<Out extends IVec2Like> (out: Out, a: vec2) {
        const { x, y } = a;
        let len = x * x + y * y;
        if (len > 0) {
            // TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
            out.x = a.x * len;
            out.y = a.y * len;
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
    public static dot (a: vec2, b: vec2) {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * Calculate the cross product of two vectors.
     * Note that the cross product must by definition produce a 3D vector.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    public static cross<Out extends IVec3Like> (out: Out, a: vec2, b: vec2) {
        const z = a.x * b.y - a.y * b.x;
        out.x = out.y = 0;
        out.z = z;
        return out;
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
    public static lerp<Out extends IVec2Like> (out: Out, a: vec2, b: vec2, t: number) {
        const { x: ax, y: ay } = a;
        out.x = ax + t * (b.x - ax);
        out.y = ay + t * (b.y - ay);
        return out;
    }

    /**
     * Generates a random vector uniformly distributed on a circle centered at the origin.
     *
     * @param out - Vector to store result.
     * @param [scale] Length of the resulting vector. If ommitted, a unit length vector will be returned.
     * @return out.
     */
    public static random<Out extends IVec2Like> (out: Out, scale: number) {
        scale = scale || 1.0;
        const r = random() * 2.0 * Math.PI;
        out.x = Math.cos(r) * scale;
        out.y = Math.sin(r) * scale;
        return out;
    }

    /**
     * Transforms a vector with a 2x2 matrix.
     *
     * @param out - Vector to store result.
     * @param a - Vector to transform.
     * @param m - The matrix.
     * @return out.
     */
    public static transformMat2<Out extends IVec2Like> (out: Out, a: vec2, m: IMat2Like) {
        const { x, y } = a;
        out.x = m.m00 * x + m.m02 * y;
        out.y = m.m01 * x + m.m03 * y;
        return out;
    }

    /**
     * Transforms a vector with a 2x3 matrix.
     *
     * @param out - Vector to store result.
     * @param a - Vector to transform.
     * @param m - The matrix.
     * @return out.
     */
    public static transformMat23<Out extends IVec2Like> (out: Out, a: vec2, m: IMat23Like) {
        const { x, y } = a;
        out.x = m.m00 * x + m.m02 * y + m.m04;
        out.y = m.m01 * x + m.m03 * y + m.m05;
        return out;
    }

    /**
     * Transforms a vector with a 3x3 matrix.
     *
     * @param out - Vector to store result.
     * @param a - Vector to transform.
     * @param m - The matrix.
     * @return out.
     */
    public static transformMat3<Out extends IVec2Like> (out: Out, a: vec2, m: IMat3Like) {
        const { x, y } = a;
        out.x = m.m00 * x + m.m03 * y + m.m06;
        out.y = m.m01 * x + m.m04 * y + m.m07;
        return out;
    }

    /**
     * Transforms a vector with a 4x4 matrix.
     * 3rd vector component is implicitly '0'.
     * 4th vector component is implicitly '1'.
     *
     * @param out - Vector to store result.
     * @param a - Vector to transform.
     * @param m - The matrix.
     * @return out.
     */
    public static transformMat4<Out extends IVec2Like> (out: Out, a: vec2, m: IMat4Like) {
        const { x, y } = a;
        out.x = m.m00 * x + m.m04 * y + m.m12;
        out.y = m.m01 * x + m.m05 * y + m.m13;
        return out;
    }

    /**
     * Returns string representation of a vector.
     *
     * @param a - The vector.
     * @return - String representation of this vector.
     */
    public static str (a: vec2) {
        return `vec2(${a.x}, ${a.y})`;
    }

    /**
     * Store components of a vector into array.
     *
     * @param out - Array to store result.
     * @param v - The vector.
     * @return out.
     */
    public static array<Out extends IWritableArrayLike<number>> (out: Out, v: vec2) {
        out[0] = v.x;
        out[1] = v.y;

        return out;
    }

    /**
     * Returns whether the specified vectors are equal. (Compared using ===)
     *
     * @param a - The first vector.
     * @param b - The second vector.
     * @return True if the vectors are equal, false otherwise.
     */
    public static exactEquals (a: vec2, b: vec2) {
        return a.x === b.x && a.y === b.y;
    }

    /**
     * Returns whether the specified vectors are approximately equal.
     *
     * @param a The first vector.
     * @param b The second vector.
     * @return True if the vectors are approximately equal, false otherwise.
     */
    public static equals (a: vec2, b: vec2) {
        const { x: a0, y: a1 } = a;
        const { x: b0, y: b1 } = b;
        return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)));
    }

    /**
     * Returns the angle between the two vectors.
     *
     * @param a The first vector.
     * @param b The second vector.
     * @return The angle in radians.
     */
    public static angle (a: vec2, b: vec2) {
        vec2.normalize(tmpVec2A, a);
        vec2.normalize(tmpVec2B, b);
        const cosine = vec2.dot(tmpVec2A, tmpVec2B);
        if (cosine > 1.0) {
            return 0;
        }
        if (cosine < -1.0) {
            return Math.PI;
        }
        return Math.acos(cosine);
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
     * Creates a vector, with components specified separately.
     *
     * @param x - Value assigned to x component.
     * @param y - Value assigned to y component.
     */
    constructor (x = 0, y = 0) {
        /**
         * The x component.
         */
        this.x = x;

        /**
         * The y component.
         */
        this.y = y;
    }
}

const tmpVec2A = vec2.create();
const tmpVec2B = vec2.create();
