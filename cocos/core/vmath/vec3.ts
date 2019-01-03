import { EPSILON, random } from './utils';

/**
 * Mathematical 3-dimensional vector.
 *
 * x, y, z is alias of the first, second, third component of vector, respectively.
 */
export default class vec3 {
    /**
     * Creates a vector, with components specified separately.
     *
     * @param x - Value assigned to x component.
     * @param y - Value assigned to y component.
     * @param z - Value assigned to z component.
     * @return The newly created vector.
     */
    public static create (x = 0, y = 0, z = 0) {
        return new vec3(x, y, z);
    }

    /**
     * Creates a zero vector.
     *
     * @return The newly created vector.
     */
    public static zero<Out extends IVec3Like> (out: Out) {
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
    public static clone (a: vec3) {
        return new vec3(a.x, a.y, a.z);
    }

    /**
     * Copy content of a vector into another.
     *
     * @param out - The vector to modified.
     * @param a - The specified vector.
     * @return out.
     */
    public static copy<Out extends IVec3Like> (out: Out, a: vec3) {
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
    public static set<Out extends IVec3Like> (out: Out, x: number, y: number, z: number) {
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
    public static add<Out extends IVec3Like> (out: Out, a: vec3, b: vec3) {
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
    public static subtract<Out extends IVec3Like> (out: Out, a: vec3, b: vec3) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        return out;
    }

    /**
     * Alias of {@link vec3.subtract}.
     */
    public static sub<Out extends IVec3Like> (out: Out, a: vec3, b: vec3) {
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
    public static multiply<Out extends IVec3Like> (out: Out, a: vec3, b: vec3) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        return out;
    }

    /**
     * Alias of {@link vec3.multiply}.
     */
    public static mul<Out extends IVec3Like> (out: Out, a: vec3, b: vec3) {
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
    public static divide<Out extends IVec3Like> (out: Out, a: vec3, b: vec3) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        out.z = a.z / b.z;
        return out;
    }

    /**
     * Alias of {@link vec3.divide}.
     */
    public static div<Out extends IVec3Like> (out: Out, a: vec3, b: vec3) {
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
    public static ceil<Out extends IVec3Like> (out: Out, a: vec3) {
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
    public static floor<Out extends IVec3Like> (out: Out, a: vec3) {
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
    public static min<Out extends IVec3Like> (out: Out, a: vec3, b: vec3) {
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
    public static max<Out extends IVec3Like> (out: Out, a: vec3, b: vec3) {
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
    public static round<Out extends IVec3Like> (out: Out, a: vec3) {
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
     */
    public static scale<Out extends IVec3Like> (out: Out, a: vec3, b: number) {
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
    public static scaleAndAdd<Out extends IVec3Like> (out: Out, a: vec3, b: vec3, scale: number) {
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        return out;
    }

    /**
     * Calculates the euclidian distance between two vectors.
     *
     * @param a - The first operand.
     * @param b - The second operand.
     * @return Distance between a and b.
     */
    public static distance (a: vec3, b: vec3) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * Alias of {@link vec3.distance}.
     */
    public static dist (a: vec3, b: vec3) {
        return vec3.distance(a, b);
    }

    /**
     * Calculates the squared euclidian distance between two vectors.
     *
     * @param a - The first operand.
     * @param b - The second operand.
     * @return Squared distance between a and b.
     */
    public static squaredDistance (a: vec3, b: vec3) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        return x * x + y * y + z * z;
    }

    /**
     * Alias of {@link vec3.squaredDistance}.
     */
    public static sqrDist (a: vec3, b: vec3) {
        return vec3.squaredDistance(a, b);
    }

    /**
     * Calculates the length of a vector.
     *
     * @param a - The vector.
     * @return Length of the vector.
     */
    public static magnitude (a: vec3) {
        const { x, y, z } = a;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * Alias of {@link vec3.magnitude}.
     */
    public static mag (a: vec3) {
        return vec3.magnitude(a);
    }

    /**
     * Calculates the squared length of a vector.
     *
     * @param a - The vector.
     * @return Squared length of the vector.
     */
    public static squaredMagnitude (a: vec3) {
        const { x, y, z } = a;
        return x * x + y * y + z * z;
    }

    /**
     * Alias of {@link vec3.squaredMagnitude}
     */
    public static sqrMag (a: vec3) {
        return vec3.squaredMagnitude(a);
    }

    /**
     * Negates each component of a vector.
     *
     * @param out - Vector to store result.
     * @param a - Vector to negate.
     * @return out.
     */
    public static negate<Out extends IVec3Like> (out: Out, a: vec3) {
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
    public static inverse<Out extends IVec3Like> (out: Out, a: vec3) {
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
    public static inverseSafe<Out extends IVec3Like> (out: Out, a: vec3) {
        const { x, y, z } = a;

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
    public static normalize<Out extends IVec3Like> (out: Out, a: vec3) {
        const { x, y, z } = a;

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
    public static dot (a: vec3, b: vec3) {
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
    public static cross<Out extends IVec3Like> (out: Out, a: vec3, b: vec3) {
        const { x: ax, y: ay, z: az } = a;
        const { x: bx, y: by, z: bz } = b;

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
    public static lerp<Out extends IVec3Like> (out: Out, a: vec3, b: vec3, t: number) {
        const { x: ax, y: ay, z: az } = a;
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
    public static hermite<Out extends IVec3Like> (
        out: Out, a: vec3, b: vec3, c: vec3, d: vec3, t: number) {
        const factorTimes2 = t * t;
        const factor1 = factorTimes2 * (2 * t - 3) + 1;
        const factor2 = factorTimes2 * (t - 2) + t;
        const factor3 = factorTimes2 * (t - 1);
        const factor4 = factorTimes2 * (3 - 2 * t);

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
    public static bezier<Out extends IVec3Like> (
        out: Out, a: vec3, b: vec3, c: vec3, d: vec3, t: number) {
        const inverseFactor = 1 - t;
        const inverseFactorTimesTwo = inverseFactor * inverseFactor;
        const factorTimes2 = t * t;
        const factor1 = inverseFactorTimesTwo * inverseFactor;
        const factor2 = 3 * t * inverseFactorTimesTwo;
        const factor3 = 3 * factorTimes2 * inverseFactor;
        const factor4 = factorTimes2 * t;

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
    public static random<Out extends IVec3Like> (out: Out, scale: number) {
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
     * @param {mat4} m - The matrix.
     * @return out.
     */
    public static transformMat4<Out extends IVec3Like> (out: Out, a: vec3, m: IMat4Like) {
        const { x, y, z } = a;
        let rhw = m.m03 * x + m.m07 * y + m.m11 * z + m.m15;
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
     * @param {mat4} m - The matrix.
     * @return out.
     */
    public static transformMat4Normal<Out extends IVec3Like> (out: Out, a: vec3, m: IMat4Like) {
        const { x, y, z } = a;
        let rhw = m.m03 * x + m.m07 * y + m.m11 * z;
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
     * @param {mat3} m - The matrix.
     * @return out.
     */
    public static transformMat3<Out extends IVec3Like> (out: Out, a: vec3, m: IMat3Like) {
        const { x, y, z } = a;
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
     * @param {quat} q - The quaternion.
     * @return out.
     */
    public static transformQuat<Out extends IVec3Like> (out: Out, a: vec3, q: IQuatLike) {
        // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

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
    public static rotateX<Out extends IVec3Like> (out: Out, a: vec3, b: vec3, c: number) {
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
    public static rotateY<Out extends IVec3Like> (out: Out, a: vec3, b: vec3, c: number) {
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
    public static rotateZ<Out extends IVec3Like> (out: Out, a: vec3, b: vec3, c: number) {
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
    public static str (a: vec3) {
        return `vec3(${a.x}, ${a.y}, ${a.z})`;
    }

    /**
     * Store components of a vector into array.
     *
     * @param out - Array to store result.
     * @param v - The vector.
     * @return out.
     */
    public static array<Out extends IWritableArrayLike<number>> (out: Out, v: vec3) {
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
    public static exactEquals (a: vec3, b: vec3) {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }

    /**
     * Returns whether the specified vectors are approximately equal.
     *
     * @param a The first vector.
     * @param b The second vector.
     * @return True if the vectors are approximately equal, false otherwise.
     */
    public static equals (a: vec3, b: vec3) {
        const { x: a0, y: a1, z: a2 } = a;
        const { x: b0, y: b1, z: b2 } = b;
        return (
            Math.abs(a0 - b0) <=
            EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <=
            EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <=
            EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2))
        );
    }

    /**
     * Gets the angle between two vectors.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return - The angle in radians.
     */
    public static angle (a: vec3, b: vec3) {
        vec3.normalize(tmpVec3A, a);
        vec3.normalize(tmpVec3B, b);
        const cosine = vec3.dot(tmpVec3A, tmpVec3B);
        if (cosine > 1.0) {
            return 0;
        }
        if (cosine < -1.0) {
            return Math.PI;
        }
        return Math.acos(cosine);
    }

    /**
     * Projects a vector onto a plane represented by its normal.
     * @param out The result vector.
     * @param a The vector.
     * @param n The plane's normal.
     */
    public static projectOnPlane<Out extends IVec3Like> (out: Out, a: vec3, n: vec3) {
        return vec3.sub(out, a, vec3.project(out, a, n));
    }

    /**
     * Projects a vector onto another vector.
     * @param out The result vector.
     * @param a The vector to project.
     * @param b The vector onto which the projection performs.
     */
    public static project<Out extends IVec3Like> (out: Out, a: vec3, b: vec3) {
        const sqrLen = vec3.squaredMagnitude(b);
        if (sqrLen < 0.000001) {
            return vec3.set(out, 0, 0, 0);
        } else {
            return vec3.scale(out, b, vec3.dot(a, b) / sqrLen);
        }
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
     * Creates a vector, with components specified separately.
     *
     * @param x - Value assigned to x component.
     * @param y - Value assigned to y component.
     * @param z - Value assigned to z component.
     */
    constructor (x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

const tmpVec3A = vec3.create();
const tmpVec3B = vec3.create();
