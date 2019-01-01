import { EPSILON } from './utils';

/**
 * Mathematical 2x3 matrix.
 *
 * A mat23 contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */
class mat23 {
    /**
     * Creates a matrix, with elements specified separately.
     *
     * @param m00 -  Value assigned to element a.
     * @param m01 -  Value assigned to element b.
     * @param m02 -  Value assigned to element c.
     * @param m03 -  Value assigned to element d.
     * @param m04 -  Value assigned to element tx.
     * @param m05 -  Value assigned to element ty.
     */
    constructor(m00 = 1, m01 = 0, m02 = 0, m03 = 1, m04 = 0, m05 = 0) {
        /**
         * The element a.
         * @type {number}
         * */
        this.m00 = m00;

        /**
         * The element b.
         * @type {number}
         * */
        this.m01 = m01;

        /**
         * The element c.
         * @type {number}
         * */
        this.m02 = m02;

        /**
         * The element d.
         * @type {number}
         * */
        this.m03 = m03;

        /**
         * The element tx.
         * @type {number}
         * */
        this.m04 = m04;

        /**
         * The element ty.
         * @type {number}
         * */
        this.m05 = m05;
    }

    /**
     * Creates a matrix, with elements specified separately.
     *
     * @param m00 -  Value assigned to element a.
     * @param m01 -  Value assigned to element b.
     * @param m02 -  Value assigned to element c.
     * @param m03 -  Value assigned to element d.
     * @param m04 -  Value assigned to element tx.
     * @param m05 -  Value assigned to element ty.
     * @return The newly created matrix.
     */
    static create(m00 = 1, m01 = 0, m02 = 0, m03 = 1, m04 = 0, m05 = 0) {
        return new mat23(m00, m01, m02, m03, m04, m05);
    }

    /**
     * Clone a matrix.
     *
     * @param a - Matrix to clone.
     * @return The newly created matrix.
     */
    static clone(a) {
        return new mat23(
            a.m00, a.m01,
            a.m02, a.m03,
            a.m04, a.m05
        );
    }

    /**
     * Copy content of a matrix into another.
     *
     * @param out - Matrix to modified.
     * @param a - The specified matrix.
     * @return out.
     */
    static copy(out, a) {
        out.m00 = a.m00;
        out.m01 = a.m01;
        out.m02 = a.m02;
        out.m03 = a.m03;
        out.m04 = a.m04;
        out.m05 = a.m05;
        return out;
    }

    /**
     * Sets a matrix as identity matrix.
     *
     * @param out - Matrix to modified.
     * @return out.
     */
    static identity(out) {
        out.m00 = 1;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 1;
        out.m04 = 0;
        out.m05 = 0;
        return out;
    }

    /**
     * Sets the elements of a matrix to the given values.
     *
     * @param out - The matrix to modified.
     * @param a - Value assigned to element a.
     * @param b - Value assigned to element b.
     * @param c - Value assigned to element c.
     * @param d - Value assigned to element d.
     * @param tx - Value assigned to element tx.
     * @param ty - Value assigned to element ty.
     * @return out.
     */
    static set(out, a, b, c, d, tx, ty) {
        out.m00 = a;
        out.m01 = b;
        out.m02 = c;
        out.m03 = d;
        out.m04 = tx;
        out.m05 = ty;
        return out;
    }

    /**
     * Inverts a matrix.
     *
     * @param out - Matrix to store result.
     * @param a - Matrix to invert.
     * @return out.
     */
    static invert(out, a) {
        let aa = a.m00, ab = a.m01, ac = a.m02, ad = a.m03,
            atx = a.m04, aty = a.m05;

        let det = aa * ad - ab * ac;
        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out.m00 = ad * det;
        out.m01 = -ab * det;
        out.m02 = -ac * det;
        out.m03 = aa * det;
        out.m04 = (ac * aty - ad * atx) * det;
        out.m05 = (ab * atx - aa * aty) * det;
        return out;
    }

    /**
     * Calculates the determinant of a matrix.
     *
     * @param a - Matrix to calculate.
     * @return Determinant of a.
     */
    static determinant(a) {
        return a.m00 * a.m03 - a.m01 * a.m02;
    }

    /**
     * Multiply two matrices explicitly.
     *
     * @param out - Matrix to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    static multiply(out, a, b) {
        let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
            b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03, b4 = b.m04, b5 = b.m05;
        out.m00 = a0 * b0 + a2 * b1;
        out.m01 = a1 * b0 + a3 * b1;
        out.m02 = a0 * b2 + a2 * b3;
        out.m03 = a1 * b2 + a3 * b3;
        out.m04 = a0 * b4 + a2 * b5 + a4;
        out.m05 = a1 * b4 + a3 * b5 + a5;
        return out;
    }

    /**
     * Alias of {@link mat23.multiply}.
     */
    static mul(out, a, b) {
        return mat23.multiply(out, a, b);
    }

    /**
     * Rotates a matrix by the given angle.
     *
     * @param out - Matrix to store result.
     * @param a - Matrix to rotate.
     * @param rad - The rotation angle.
     * @return out
     */
    static rotate(out, a, rad) {
        let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
            s = Math.sin(rad),
            c = Math.cos(rad);
        out.m00 = a0 * c + a2 * s;
        out.m01 = a1 * c + a3 * s;
        out.m02 = a0 * -s + a2 * c;
        out.m03 = a1 * -s + a3 * c;
        out.m04 = a4;
        out.m05 = a5;
        return out;
    }

    /**
     * Multiply a matrix with a scale matrix given by a scale vector.
     *
     * @param out - Matrix to store result.
     * @param a - Matrix to multiply.
     * @param v - The scale vector.
     * @return out
     **/
    static scale(out, a, v) {
        let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
            v0 = v.x, v1 = v.y;
        out.m00 = a0 * v0;
        out.m01 = a1 * v0;
        out.m02 = a2 * v1;
        out.m03 = a3 * v1;
        out.m04 = a4;
        out.m05 = a5;
        return out;
    }

    /**
     * Multiply a matrix with a translation matrix given by a translation offset.
     *
     * @param out - Matrix to store result.
     * @param a - Matrix to multiply.
     * @param v - The translation offset.
     * @return out.
     */
    static translate(out, a, v) {
        let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05,
            v0 = v.x, v1 = v.y;
        out.m00 = a0;
        out.m01 = a1;
        out.m02 = a2;
        out.m03 = a3;
        out.m04 = a0 * v0 + a2 * v1 + a4;
        out.m05 = a1 * v0 + a3 * v1 + a5;
        return out;
    }

    /**
     * Creates a matrix from a given angle.
     * This is equivalent to (but much faster than):
     *
     *     mat23.identity(dest);
     *     mat23.rotate(dest, dest, rad);
     *
     * @param out - Matrix to store result.
     * @param rad - The rotation angle.
     * @return out.
     */
    static fromRotation(out, rad) {
        let s = Math.sin(rad), c = Math.cos(rad);
        out.m00 = c;
        out.m01 = s;
        out.m02 = -s;
        out.m03 = c;
        out.m04 = 0;
        out.m05 = 0;
        return out;
    }

    /**
     * Creates a matrix from a scale vector.
     * This is equivalent to (but much faster than):
     *
     *     mat23.identity(dest);
     *     mat23.scale(dest, dest, vec);
     *
     * @param out - Matrix to store result.
     * @param v - Scale vector.
     * @return out.
     */
    static fromScaling(out, v) {
        out.m00 = v.m00;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = v.m01;
        out.m04 = 0;
        out.m05 = 0;
        return out;
    }

    /**
     * Creates a matrix from a translation offset.
     * This is equivalent to (but much faster than):
     *
     *     mat23.identity(dest);
     *     mat23.translate(dest, dest, vec);
     *
     * @param out - Matrix to store result.
     * @param v - The translation offset.
     * @return out.
     */
    static fromTranslation(out, v) {
        out.m00 = 1;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 1;
        out.m04 = v.x;
        out.m05 = v.y;
        return out;
    }

    /**
     * Creates a matrix from a rotation, translation offset and scale vector.
     * This is equivalent to (but faster than):
     *
     *     mat23.identity(dest);
     *     mat23.translate(dest, vec);
     *     let tmp = mat23.create();
     *     mat23.fromRotation(tmp, rot);
     *     mat23.multiply(dest, dest, tmp);
     *     mat23.fromScaling(tmp, scale);
     *     mat23.multiply(dest, dest, tmp);
     *
     * @param out - Matrix to store result.
     * @param r - Rotation radian.
     * @param t - Translation offset.
     * @param s - Scale vector.
     * @return out.
     */
    static fromRTS(out, r, t, s) {
        let sr = Math.sin(r), cr = Math.cos(r);
        out.m00 = cr * s.x;
        out.m01 = sr * s.x;
        out.m02 = -sr * s.y;
        out.m03 = cr * s.y;
        out.m04 = t.x;
        out.m05 = t.y;
        return out;
    }

    /**
     * Returns a string representation of a matrix.
     *
     * @param a - The matrix.
     * @return String representation of this matrix.
     */
    static str(a) {
        return `mat23(${a.m00}, ${a.m01}, ${a.m02}, ${a.m03}, ${a.m04}, ${a.m05})`;
    }

    /**
     * Store elements of a matrix into array.
     *
     * @param out - Array to store result.
     * @param m - The matrix.
     * @return out.
     */
    static array(out, m) {
        out[0] = m.m00;
        out[1] = m.m01;
        out[2] = m.m02;
        out[3] = m.m03;
        out[4] = m.m04;
        out[5] = m.m05;

        return out;
    }

    /**
     * Store elements of a matrix into 16 floats array.
     *
     * @param out
     * @param m
     * @return
     */
    static array4x4(out, m) {
        out[0] = m.m00;
        out[1] = m.m01;
        out[2] = 0;
        out[3] = 0;
        out[4] = m.m02;
        out[5] = m.m03;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = m.m04;
        out[13] = m.m05;
        out[14] = 0;
        out[15] = 1;

        return out;
    }

    /**
     * Returns Frobenius norm of a matrix.
     *
     * @param a - Matrix to calculate Frobenius norm of.
     * @return - The frobenius norm.
     */
    static frob(a) {
        return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2) + Math.pow(a.m04, 2) + Math.pow(a.m05, 2) + 1));
    }

    /**
     * Adds two matrices.
     *
     * @param out - Matrix to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    static add(out, a, b) {
        out.m00 = a.m00 + b.m00;
        out.m01 = a.m01 + b.m01;
        out.m02 = a.m02 + b.m02;
        out.m03 = a.m03 + b.m03;
        out.m04 = a.m04 + b.m04;
        out.m05 = a.m05 + b.m05;
        return out;
    }

    /**
     * Subtracts matrix b from matrix a.
     *
     * @param out - Matrix to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    static subtract(out, a, b) {
        out.m00 = a.m00 - b.m00;
        out.m01 = a.m01 - b.m01;
        out.m02 = a.m02 - b.m02;
        out.m03 = a.m03 - b.m03;
        out.m04 = a.m04 - b.m04;
        out.m05 = a.m05 - b.m05;
        return out;
    }

    /**
     * Alias of {@link mat23.subtract}.
     */
    static sub(out, a, b) {
        return mat23.subtract(out, a, b);
    }

    /**
     * Multiply each element of a matrix by a scalar number.
     *
     * @param out - Matrix to store result.
     * @param a - Matrix to scale
     * @param b - The scale number.
     * @return out.
     */
    static multiplyScalar(out, a, b) {
        out.m00 = a.m00 * b;
        out.m01 = a.m01 * b;
        out.m02 = a.m02 * b;
        out.m03 = a.m03 * b;
        out.m04 = a.m04 * b;
        out.m05 = a.m05 * b;
        return out;
    }

    /**
     * Adds two matrices after multiplying each element of the second operand by a scalar number.
     *
     * @param out - Matrix to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @param scale - The scale number.
     * @return out.
     */
    static multiplyScalarAndAdd(out, a, b, scale) {
        out.m00 = a.m00 + (b.m00 * scale);
        out.m01 = a.m01 + (b.m01 * scale);
        out.m02 = a.m02 + (b.m02 * scale);
        out.m03 = a.m03 + (b.m03 * scale);
        out.m04 = a.m04 + (b.m04 * scale);
        out.m05 = a.m05 + (b.m05 * scale);
        return out;
    }

    /**
     * Returns whether the specified matrices are equal. (Compared using ===)
     *
     * @param a - The first matrix.
     * @param b - The second matrix.
     * @return True if the matrices are equal, false otherwise.
     */
    static exactEquals(a, b) {
        return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03 && a.m04 === b.m04 && a.m05 === b.m05;
    }

    /**
     * Returns whether the specified matrices are approximately equal.
     *
     * @param a - The first matrix.
     * @param b - The second matrix.
     * @return True if the matrices are equal, false otherwise.
     */
    static equals(a, b) {
        let a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05;
        let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03, b4 = b.m04, b5 = b.m05;
        return (
            Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
            Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
            Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5))
        );
    }
}

export default mat23;