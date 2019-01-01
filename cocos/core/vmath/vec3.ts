import { EPSILON, random } from './utils';

/**
 * Mathematical 3-dimensional vector.
 *
 * x, y, z is alias of the first, second, third component of vector, respectively.
 */
class vec3 {

    /**
     * Creates a vector, with components specified separately.
     *
     * @param x - Value assigned to x component.
     * @param y - Value assigned to y component.
     * @param z - Value assigned to z component.
     * @return The newly created vector.
     */
    public static create(x = 0, y = 0, z = 0) {
        return new vec3(x, y, z);
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
        return out;
    }

    /**
     * Clone a vector.
     *
     * @param a - Vector to clone.
     * @return The newly created vector.
     */
    public static clone(a) {
        return new vec3(a.x, a.y, a.z);
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
        return out;
    }

    /**
     * Sets the components of a vector to the given values.
     *
     * @param out - The vector to modified.
     * @param x - Value set to x component.
     * @param y - Value set to y component.
     * @param z - Value set to z component.
     * @return out.
     */
    public static set(out, x, y, z) {
        out.x = x;
        out.y = y;
        out.z = z;
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
        return out;
    }

    /**
     * Alias of {@link vec3.subtract}.
     */
    public static sub(out, a, b) {
        return vec3.subtract(out, a, b);
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
        return out;
    }

    /**
     * Alias of {@link vec3.multiply}.
     */
    public static mul(out, a, b) {
        return vec3.multiply(out, a, b);
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
        return out;
    }

    /**
     * Alias of {@link vec3.divide}.
     */
    public static div(out, a, b) {
        return vec3.divide(out, a, b);
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
            z = b.z - a.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * Alias of {@link vec3.distance}.
     */
    public static dist(a, b) {
        return vec3.distance(a, b);
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
            z = b.z - a.z;
        return x * x + y * y + z * z;
    }

    /**
     * Alias of {@link vec3.squaredDistance}.
     */
    public static sqrDist(a, b) {
        return vec3.squaredDistance(a, b);
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
            z = a.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     *Alias of {@link vec3.magnitude}.
     */
    public static mag(a) {
        return vec3.magnitude(a);
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
            z = a.z;
        return x * x + y * y + z * z;
    }

    /**
     *Alias of {@link vec3.squaredMagnitude}
     */
    public static sqrMag(a) {
        return vec3.squaredMagnitude(a);
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
            z = a.z;

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
     * Normalizes a vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to normalize.
     * @return out.
     */
    public static normalize(out, a) {
        const x = a.x,
            y = a.y,
            z = a.z;

        let len = x * x + y * y + z * z;
        if (len > 0) {
            // TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
            out.x = x * len;
            out.y = y * len;
            out.z = z * len;
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
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /**
     * Calculates the cross product of two vectors.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    public static cross(out, a, b) {
        const ax = a.x, ay = a.y, az = a.z,
            bx = b.x, by = b.y, bz = b.z;

        out.x = ay * bz - az * by;
        out.y = az * bx - ax * bz;
        out.z = ax * by - ay * bx;
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
    public static lerp(out, a, b, t) {
        const ax = a.x,
            ay = a.y,
            az = a.z;
        out.x = ax + t * (b.x - ax);
        out.y = ay + t * (b.y - ay);
        out.z = az + t * (b.z - az);
        return out;
    }

    /**
     * Performs a hermite interpolation with two control points.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @param c - The third operand.
     * @param d - The fourth operand.
     * @param t - The interpolation coefficient.
     * @return out.
     */
    public static hermite(out, a, b, c, d, t) {
        const factorTimes2 = t * t,
            factor1 = factorTimes2 * (2 * t - 3) + 1,
            factor2 = factorTimes2 * (t - 2) + t,
            factor3 = factorTimes2 * (t - 1),
            factor4 = factorTimes2 * (3 - 2 * t);

        out.x = a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4;
        out.y = a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4;
        out.z = a.z * factor1 + b.z * factor2 + c.z * factor3 + d.z * factor4;

        return out;
    }

    /**
     * Performs a bezier interpolation with two control points.
     *
     * @param out - Vector to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @param c - The third operand.
     * @param d - The fourth operand.
     * @param t - The interpolation coefficient.
     * @return out.
     */
    public static bezier(out, a, b, c, d, t) {
        const inverseFactor = 1 - t,
            inverseFactorTimesTwo = inverseFactor * inverseFactor,
            factorTimes2 = t * t,
            factor1 = inverseFactorTimesTwo * inverseFactor,
            factor2 = 3 * t * inverseFactorTimesTwo,
            factor3 = 3 * factorTimes2 * inverseFactor,
            factor4 = factorTimes2 * t;

        out.x = a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4;
        out.y = a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4;
        out.z = a.z * factor1 + b.z * factor2 + c.z * factor3 + d.z * factor4;

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
        return out;
    }

    /**
     * Transforms a point vector with a 4x4 matrix,
     * i.e. 4th vector component is implicitly '1'.
     *
     * @param out - Vector to store result.
     * @param a - Vector to transform.
     * @param m - The matrix.
     * @return out.
     */
    public static transformMat4(out, a, m) {
        let x = a.x, y = a.y, z = a.z,
            rhw = m.m03 * x + m.m07 * y + m.m11 * z + m.m15;
        rhw = rhw ? 1 / rhw : 1;
        out.x = (m.m00 * x + m.m04 * y + m.m08 * z + m.m12) * rhw;
        out.y = (m.m01 * x + m.m05 * y + m.m09 * z + m.m13) * rhw;
        out.z = (m.m02 * x + m.m06 * y + m.m10 * z + m.m14) * rhw;
        return out;
    }

    /**
     * Transforms a normal vector with a 4x4 matrix,
     * i.e. 4th vector component is implicitly '0'.
     *
     * @param out - Vector to store result.
     * @param a - Vector to transform.
     * @param m - The matrix.
     * @return out.
     */
    public static transformMat4Normal(out, a, m) {
        let x = a.x, y = a.y, z = a.z,
            rhw = m.m03 * x + m.m07 * y + m.m11 * z;
        rhw = rhw ? 1 / rhw : 1;
        out.x = (m.m00 * x + m.m04 * y + m.m08 * z) * rhw;
        out.y = (m.m01 * x + m.m05 * y + m.m09 * z) * rhw;
        out.z = (m.m02 * x + m.m06 * y + m.m10 * z) * rhw;
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
    public static transformMat3(out, a, m) {
        const x = a.x, y = a.y, z = a.z;
        out.x = x * m.m00 + y * m.m03 + z * m.m06;
        out.y = x * m.m01 + y * m.m04 + z * m.m07;
        out.z = x * m.m02 + y * m.m05 + z * m.m08;
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
        // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

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
        return out;
    }

    /**
     * Rotates a 3D vector around the x-axis.
     * @param out - Vector to store result.
     * @param a - The point to rotate.
     * @param b - The origin of the rotation.
     * @param c - The angle of rotation.
     * @return out.
     */
    public static rotateX(out, a, b, c) {
        // Translate point to the origin
        const px = a.x - b.x;
        const py = a.y - b.y;
        const pz = a.z - b.z;

        // perform rotation
        const rx = px;
        const ry = py * Math.cos(c) - pz * Math.sin(c);
        const rz = py * Math.sin(c) + pz * Math.cos(c);

        // translate to correct position
        out.x = rx + b.x;
        out.y = ry + b.y;
        out.z = rz + b.z;

        return out;
    }

    /**
     * Rotates a 3D vector around the y-axis.
     * @param out - Vector to store result.
     * @param a - The point to rotate.
     * @param b - The origin of the rotation.
     * @param c - The angle of rotation.
     * @return out.
     */
    public static rotateY(out, a, b, c) {
        // Translate point to the origin
        const px = a.x - b.x;
        const py = a.y - b.y;
        const pz = a.z - b.z;

        // perform rotation
        const rx = pz * Math.sin(c) + px * Math.cos(c);
        const ry = py;
        const rz = pz * Math.cos(c) - px * Math.sin(c);

        // translate to correct position
        out.x = rx + b.x;
        out.y = ry + b.y;
        out.z = rz + b.z;

        return out;
    }

    /**
     * Rotates a 3D vector around the z-axis.
     * @param out - Vector to store result.
     * @param a - The point to rotate.
     * @param b - The origin of the rotation.
     * @param c - The angle of rotation.
     * @return out.
     */
    public static rotateZ(out, a, b, c) {
        // Translate point to the origin
        const px = a.x - b.x;
        const py = a.y - b.y;
        const pz = a.z - b.z;

        // perform rotation
        const rx = px * Math.cos(c) - py * Math.sin(c);
        const ry = px * Math.sin(c) + py * Math.cos(c);
        const rz = pz;

        // translate to correct position
        out.x = rx + b.x;
        out.y = ry + b.y;
        out.z = rz + b.z;

        return out;
    }

    /**
     * Returns string representation of a vector.
     *
     * @param a - The vector.
     * @return - String representation of this vector.
     */
    public static str(a) {
        return `vec3(${a.x}, ${a.y}, ${a.z})`;
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
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }

    /**
     * Returns whether the specified vectors are approximately equal.
     *
     * @param a The first vector.
     * @param b The second vector.
     * @return True if the vectors are approximately equal, false otherwise.
     */
    public static equals(a, b) {
        const a0 = a.x, a1 = a.y, a2 = a.z;
        const b0 = b.x, b1 = b.y, b2 = b.z;
        return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
    }

    /**
     * Perform some operation over an array of vec3s.
     *
     * @param a the array of vectors to iterate over.
     * @param stride Number of elements between the start of each vec3. If 0 assumes tightly packed.
     * @param offset Number of elements to skip at the beginning of the array.
     * @param count Number of vec3s to iterate over. If 0 iterates over entire array.
     * @param fn Function to call for each vector in the array.
     * @param [arg] additional argument to pass to fn.
     * @return a.
     */
    public static forEach(a, stride, offset, count, fn, arg) {
        return vec3._forEach(a, stride, offset, count, fn, arg);
    }

    /**
     * Gets the angle between two vectors.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return - The angle in radians.
     */
    public static angle(a, b) {
        return vec3._angle(a, b);
    }

    /**
     * Projects a vector onto a plane represented by its normal.
     * @param out The result vector.
     * @param a The vector.
     * @param n The plane's normal.
     */
    public static projectOnPlane(out, a, n) {
        return vec3.sub(out, a, vec3.project(out, a, n));
    }

    /**
     * Projects a vector onto another vector.
     * @param out The result vector.
     * @param a The vector to project.
     * @param b The vector onto which the projection performs.
     */
    public static project(out, a, b) {
        const sqrLen = vec3.squaredMagnitude(b);
        if (sqrLen < 0.000001) {
            return vec3.set(out, 0, 0, 0);
        } else {
            return vec3.scale(out, b, vec3.dot(a, b) / sqrLen);
        }
    }
	/**
   * Creates a vector, with components specified separately.
   *
   * @param x - Value assigned to x component.
   * @param y - Value assigned to y component.
   * @param z - Value assigned to z component.
   */
    constructor(x = 0, y = 0, z = 0) {
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
    }
}

/**
* Perform some operation over an array of vec3s.
*
* @param a the array of vectors to iterate over.
* @param stride Number of elements between the start of each vec3. If 0 assumes tightly packed.
* @param offset Number of elements to skip at the beginning of the array.
* @param count Number of vec3s to iterate over. If 0 iterates over entire array.
* @param fn Function to call for each vector in the array.
* @param [arg] additional argument to pass to fn.
* @return a.
* @ignore.
*/
vec3._forEach = (function() {
    const vec = vec3.create(0, 0, 0);

    return function(a, stride, offset, count, fn, arg) {
        let i, l;
        if (!stride) {
            stride = 3;
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
            fn(vec, vec, arg);
            a[i] = vec.x;
            a[i + 1] = vec.y;
            a[i + 2] = vec.z;
        }

        return a;
    };
})();

/**
 * Get the angle between two 3D vectors.
 * @param a The first operand.
 * @param b The second operand.
 * @return The angle in radians.
 * @ignore
 */
vec3._angle = (function() {
    const tempA = vec3.create(0, 0, 0);
    const tempB = vec3.create(0, 0, 0);

    return function(a, b) {
        vec3.copy(tempA, a);
        vec3.copy(tempB, b);

        vec3.normalize(tempA, tempA);
        vec3.normalize(tempB, tempB);

        const cosine = vec3.dot(tempA, tempB);

        if (cosine > 1.0) {
            return 0;
        }

        if (cosine < -1.0) {
            return Math.PI;
        }

        return Math.acos(cosine);
    };
})();

export default vec3;
