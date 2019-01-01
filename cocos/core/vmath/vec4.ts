import { EPSILON, random } from './utils';

/**
 * Mathematical 4-dimensional vector.
 *
 * x, y, z, w is alias of the first, second, third, fourth component of vector, respectively.
 */
class vec4 {

    /**
     * Create a vector, with components specified separately.
     *
     * @param x - Value assigned to x component.
     * @param y - Value assigned to y component.
     * @param z - Value assigned to z component.
     * @param w - Value assigned to w component.
     * @return The newly created vector.
     */
    public static create(x = 0, y = 0, z = 0, w = 1) {
        return new vec4(x, y, z, w);
    }

    /**
     * Creates a zero vector.
     *
     * @return The newly created vector.
     */
    public static zero(out) {
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
    public static clone(a) {
        return new vec4(a.x, a.y, a.z, a.w);
    }

    /**
     * Copy content of a vector into another.
     *
     * @param out - The vector to modified.
     * @param a - The specified vector.
     * @return out.
     */
    public static copy(out, a) {
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
    public static set(out, x, y, z, w) {
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
    public static add(out, a, b) {
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
    public static subtract(out, a, b) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        out.w = a.w - b.w;
        return out;
    }

    /**
     * Alias of {@link vec4.subtract}.
     */
    public static sub(out, a, b) {
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
    public static multiply(out, a, b) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        out.w = a.w * b.w;
        return out;
    }

    /**
     * Alias of {@link vec4.multiply}.
     */
    public static mul(out, a, b) {
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
    public static divide(out, a, b) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        out.z = a.z / b.z;
        out.w = a.w / b.w;
        return out;
    }

    /**
     * Alias of {@link vec4.divide}.
     */
    public static div(out, a, b) {
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
    public static ceil(out, a) {
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
    public static floor(out, a) {
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
    public static min(out, a, b) {
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
    public static max(out, a, b) {
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
    public static round(out, a) {
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
     * */
    public static scale(out, a, b) {
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
    public static scaleAndAdd(out, a, b, scale) {
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
    public static distance(a, b) {
        const x = b.x - a.x,
            y = b.y - a.y,
            z = b.z - a.z,
            w = b.w - a.w;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * Alias of {@link vec4.distance}.
     */
    public static dist(a, b) {
        return vec4.distance(a, b);
    }

    /**
     * Calculates the squared euclidian distance between two vectors.
     *
     * @param a - The first operand.
     * @param b - The second operand.
     * @return Squared distance between a and b.
     */
    public static squaredDistance(a, b) {
        const x = b.x - a.x,
            y = b.y - a.y,
            z = b.z - a.z,
            w = b.w - a.w;
        return x * x + y * y + z * z + w * w;
    }

    /**
     * Alias of {@link vec4.squaredDistance}.
     */
    public static sqrDist(a, b) {
        return vec4.squaredDistance(a, b);
    }

    /**
     * Calculates the length of a vector.
     *
     * @param a - The vector.
     * @return Length of the vector.
     */
    public static magnitude(a) {
        const x = a.x,
            y = a.y,
            z = a.z,
            w = a.w;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     *Alias of {@link vec4.magnitude}.
     */
    public static mag(a) {
        return vec4.magnitude(a);
    }

    /**
     * Calculates the squared length of a vector.
     *
     * @param a - The vector.
     * @return Squared length of the vector.
     */
    public static squaredMagnitude(a) {
        const x = a.x,
            y = a.y,
            z = a.z,
            w = a.w;
        return x * x + y * y + z * z + w * w;
    }

    /**
     *Alias of {@link vec4.squaredMagnitude}
     */
    public static sqrMag(a) {
        return vec4.squaredMagnitude(a);
    }

    /**
     * Negates each component of a vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to negate.
     * @return out.
     */
    public static negate(out, a) {
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
    public static inverse(out, a) {
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
    public static inverseSafe(out, a) {
        const x = a.x,
            y = a.y,
            z = a.z,
            w = a.w;

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
    public static normalize(out, a) {
        const x = a.x,
            y = a.y,
            z = a.z,
            w = a.w;
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
    public static dot(a, b) {
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
    public static lerp(out, a, b, t) {
        const ax = a.x,
            ay = a.y,
            az = a.z,
            aw = a.w;
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
    public static random(out, scale) {
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
    public static transformMat4(out, a, m) {
        const x = a.x, y = a.y, z = a.z, w = a.w;
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
    public static transformQuat(out, a, q) {
        const x = a.x, y = a.y, z = a.z;
        const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

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
    public static str(a) {
        return `vec4(${a.x}, ${a.y}, ${a.z}, ${a.w})`;
    }

    /**
     * Store components of a vector into array.
     *
     * @param out - Array to store result.
     * @param v - The vector.
     * @return out.
     */
    public static array(out, v) {
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
    public static exactEquals(a, b) {
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
    }

    /**
     * Returns whether the specified vectors are approximately equal.
     *
     * @param a The first vector.
     * @param b The second vector.
     * @return True if the vectors are approximately equal, false otherwise.
     */
    public static equals(a, b) {
        const a0 = a.x, a1 = a.y, a2 = a.z, a3 = a.w;
        const b0 = b.x, b1 = b.y, b2 = b.z, b3 = b.w;
        return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
    }

    /**
     * Performs some operation over an array of vec4s.
     *
     * @param a the array of vectors to iterate over.
     * @param stride Number of elements between the start of each vec4. If 0 assumes tightly packed.
     * @param offset Number of elements to skip at the beginning of the array.
     * @param count Number of vec4s to iterate over. If 0 iterates over entire array.
     * @param fn Function to call for each vector in the array.
     * @param [arg] additional argument to pass to fn.
     * @return a.
     */
    public static forEach(a, stride, offset, count, fn, arg) {
        return vec4._forEach(a, stride, offset, count, fn, arg);
    }
    /**
     * Creates a vector, with components specified separately.
     *
     * @param x - Value assigned to x component.
     * @param y - Value assigned to y component.
     * @param z - Value assigned to z component.
     * @param w - Value assigned to w component.
     */
    constructor(x = 0, y = 0, z = 0, w = 1) {
        /**
         * The x component.
         * @type {number}
         * */
        this.x = x;

        /**
         * The y component.
         * @type {number}
         * */
        this.y = y;

        /**
         * The z component.
         * @type {number}
         * */
        this.z = z;

        /**
         * The w component.
         * @type {number}
         * */
        this.w = w;
    }
}

/**
 * Perform some operation over an array of vec4s.
 *
 * @param a the array of vectors to iterate over.
 * @param stride Number of elements between the start of each vec4. If 0 assumes tightly packed.
 * @param offset Number of elements to skip at the beginning of the array.
 * @param count Number of vec4s to iterate over. If 0 iterates over entire array.
 * @param fn Function to call for each vector in the array.
 * @param [arg] additional argument to pass to fn.
 * @return a.
 * @ignore
 */
vec4._forEach = (function() {
    const vec = vec4.create(0, 0, 0, 0);

    return function(a, stride, offset, count, fn, arg) {
        let i, l;
        if (!stride) {
            stride = 4;
        }

        if (!offset) {
            offset = 0;
        }

        if (count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for (i = offset; i < l; i += stride) {
            vec.x = a[i];
            vec.y = a[i + 1];
            vec.z = a[i + 2];
            vec.w = a[i + 3];
            fn(vec, vec, arg);
            a[i] = vec.x;
            a[i + 1] = vec.y;
            a[i + 2] = vec.z;
            a[i + 3] = vec.w;
        }

        return a;
    };
})();

export default vec4;
