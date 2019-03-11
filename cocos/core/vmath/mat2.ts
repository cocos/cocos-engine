import { IWritableArrayLike } from './fwd-decls';
import { EPSILON } from './utils';
import vec2 from './vec2';

/**
 * Mathematical 2x2 matrix.
 */
// tslint:disable-next-line:class-name
export default class mat2 {

    /**
     * Creates a matrix, with elements specified separately.
     *
     * @param m00 - Value assigned to element at column 0 row 0.
     * @param m01 - Value assigned to element at column 0 row 1.
     * @param m02 - Value assigned to element at column 1 row 0.
     * @param m03 - Value assigned to element at column 1 row 1.
     * @return The newly created matrix.
     */
    public static create (m00 = 1, m01 = 0, m02 = 0, m03 = 1) {
        return new mat2(m00, m01, m02, m03);
    }

    /**
     * Clone a matrix.
     *
     * @param a - Matrix to clone.
     * @return The newly created matrix.
     */
    public static clone (a: mat2) {
        return new mat2(a.m00, a.m01, a.m02, a.m03);
    }

    /**
     * Copy content of a matrix into another.
     *
     * @param out - Matrix to modified.
     * @param a - The specified matrix.
     * @return out.
     */
    public static copy<Out extends mat2> (out: Out, a: mat2) {
        out.m00 = a.m00;
        out.m01 = a.m01;
        out.m02 = a.m02;
        out.m03 = a.m03;
        return out;
    }

    /**
     * Sets a matrix as identity matrix.
     *
     * @param out - Matrix to modified.
     * @return out.
     */
    public static identity<Out extends mat2> (out: Out) {
        out.m00 = 1;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 1;
        return out;
    }

    /**
     * Sets the elements of a matrix to the given values.
     *
     * @param out - The matrix to modified.
     * @param m00 - Value assigned to element at column 0 row 0.
     * @param m01 - Value assigned to element at column 0 row 1.
     * @param m10 - Value assigned to element at column 1 row 0.
     * @param m11 - Value assigned to element at column 1 row 1.
     * @return out.
     */
    public static set<Out extends mat2> (out: Out, m00: number, m01: number, m10: number, m11: number) {
        out.m00 = m00;
        out.m01 = m01;
        out.m02 = m10;
        out.m03 = m11;
        return out;
    }

    /**
     * Transposes a matrix.
     *
     * @param out - Matrix to store result.
     * @param a - Matrix to transpose.
     * @return out.
     */
    public static transpose<Out extends mat2> (out: Out, a: mat2) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
            const a1 = a.m01;
            out.m01 = a.m02;
            out.m02 = a1;
        } else {
            out.m00 = a.m00;
            out.m01 = a.m02;
            out.m02 = a.m01;
            out.m03 = a.m03;
        }

        return out;
    }

    /**
     * Inverts a matrix.
     *
     * @param out - Matrix to store result.
     * @param a - Matrix to invert.
     * @return out.
     */
    public static invert<Out extends mat2> (out: Out, a: mat2) {
        const { m00: a0, m01: a1, m02: a2, m03: a3 } = a;

        // Calculate the determinant
        let det = a0 * a3 - a2 * a1;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out.m00 = a3 * det;
        out.m01 = -a1 * det;
        out.m02 = -a2 * det;
        out.m03 = a0 * det;

        return out;
    }

    /**
     * Calculates the adjugate of a matrix.
     *
     * @param out - Matrix to store result.
     * @param a - Matrix to calculate.
     * @return out.
     */
    public static adjoint<Out extends mat2> (out: Out, a: mat2) {
        // Caching this value is nessecary if out == a
        const a0 = a.m00;
        out.m00 = a.m03;
        out.m01 = -a.m01;
        out.m02 = -a.m02;
        out.m03 = a0;

        return out;
    }

    /**
     * Calculates the determinant of a matrix.
     *
     * @param a - Matrix to calculate.
     * @return Determinant of a.
     */
    public static determinant (a: mat2) {
        return a.m00 * a.m03 - a.m02 * a.m01;
    }

    /**
     * Multiply two matrices explicitly.
     *
     * @param out - Matrix to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    public static multiply<Out extends mat2> (out: Out, a: mat2, b: mat2) {
        const { m00: a0, m01: a1, m02: a2, m03: a3 } = a;
        const { m00: b0, m01: b1, m02: b2, m03: b3 } = b;
        out.m00 = a0 * b0 + a2 * b1;
        out.m01 = a1 * b0 + a3 * b1;
        out.m02 = a0 * b2 + a2 * b3;
        out.m03 = a1 * b2 + a3 * b3;
        return out;
    }

    /**
     * Alias of {@link mat2.multiply}.
     */
    public static mul<Out extends mat2> (out: Out, a: mat2, b: mat2) {
        return mat2.multiply(out, a, b);
    }

    /**
     * Rotates a matrix by the given angle.
     *
     * @param out - Matrix to store result.
     * @param a - Matrix to rotate.
     * @param rad - The rotation angle.
     * @return out
     */
    public static rotate<Out extends mat2> (out: Out, a: mat2, rad: number) {
        const { m00: a0, m01: a1, m02: a2, m03: a3 } = a;
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        out.m00 = a0 * c + a2 * s;
        out.m01 = a1 * c + a3 * s;
        out.m02 = a0 * -s + a2 * c;
        out.m03 = a1 * -s + a3 * c;
        return out;
    }

    /**
     * Scales the matrix given by a scale vector.
     *
     * @param out - Matrix to store result.
     * @param a - Matrix to scale.
     * @param v - The scale vector.
     * @return out
     */
    public static scale<Out extends mat2> (out: Out, a: mat2, v: vec2) {
        const { m00: a0, m01: a1, m02: a2, m03: a3 } = a;
        const v0 = v.x;
        const v1 = v.y;
        out.m00 = a0 * v0;
        out.m01 = a1 * v0;
        out.m02 = a2 * v1;
        out.m03 = a3 * v1;
        return out;
    }

    /**
     * Creates a matrix from a given angle.
     * This is equivalent to (but much faster than):
     *
     *     mat2.set(dest, 1, 0, 0, 1);
     *     mat2.rotate(dest, dest, rad);
     *
     * @param out - Matrix to store result.
     * @param rad - The rotation angle.
     * @return out.
     */
    public static fromRotation<Out extends mat2> (out: Out, rad: number) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        out.m00 = c;
        out.m01 = s;
        out.m02 = -s;
        out.m03 = c;
        return out;
    }

    /**
     * Creates a matrix from a scale vector.
     * This is equivalent to (but much faster than):
     *
     *     mat2.set(dest, 1, 0, 0, 1);
     *     mat2.scale(dest, dest, vec);
     *
     * @param out - Matrix to store result.
     * @param v - Scale vector.
     * @return out.
     */
    public static fromScaling<Out extends mat2> (out: Out, v: vec2) {
        out.m00 = v.x;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = v.y;
        return out;
    }

    /**
     * Returns a string representation of a matrix.
     *
     * @param a - The matrix.
     * @return String representation of this matrix.
     */
    public static str (a: mat2) {
        return `mat2(${a.m00}, ${a.m01}, ${a.m02}, ${a.m03})`;
    }

    /**
     * Store elements of a matrix into array.
     *
     * @param out - Array to store result.
     * @param m - The matrix.
     * @return out.
     */
    public static array<Out extends IWritableArrayLike<number>> (out: Out, m: mat2, ofs = 0) {
        out[ofs + 0] = m.m00;
        out[ofs + 1] = m.m01;
        out[ofs + 2] = m.m02;
        out[ofs + 3] = m.m03;

        return out;
    }

    /**
     * Returns Frobenius norm of a matrix.
     *
     * @param a - Matrix to calculate Frobenius norm of.
     * @return - The frobenius norm.
     */
    public static frob (a: mat2) {
        return (Math.sqrt(Math.pow(a.m00, 2) + Math.pow(a.m01, 2) + Math.pow(a.m02, 2) + Math.pow(a.m03, 2)));
    }

    /**
     * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix.
     * @param L - The lower triangular matrix.
     * @param D - The diagonal matrix.
     * @param U - The upper triangular matrix.
     * @param a - The input matrix to factorize.
     */
    public static LDU (L: mat2, D: mat2, U: mat2, a: mat2) {
        L.m02 = a.m02 / a.m00;
        U.m00 = a.m00;
        U.m01 = a.m01;
        U.m03 = a.m03 - L.m02 * U.m01;
    }

    /**
     * Adds two matrices.
     *
     * @param out - Matrix to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    public static add<Out extends mat2> (out: Out, a: mat2, b: mat2) {
        out.m00 = a.m00 + b.m00;
        out.m01 = a.m01 + b.m01;
        out.m02 = a.m02 + b.m02;
        out.m03 = a.m03 + b.m03;
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
    public static subtract<Out extends mat2> (out: Out, a: mat2, b: mat2) {
        out.m00 = a.m00 - b.m00;
        out.m01 = a.m01 - b.m01;
        out.m02 = a.m02 - b.m02;
        out.m03 = a.m03 - b.m03;
        return out;
    }

    /**
     * Alias of {@link mat2.subtract}.
     */
    public static sub<Out extends mat2> (out: Out, a: mat2, b: mat2) {
        return mat2.subtract(out, a, b);
    }

    /**
     * Returns whether the specified matrices are equal. (Compared using ===)
     *
     * @param a - The first matrix.
     * @param b - The second matrix.
     * @return True if the matrices are equal, false otherwise.
     */
    public static exactEquals (a: mat2, b: mat2) {
        return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03;
    }

    /**
     * Returns whether the specified matrices are approximately equal.
     *
     * @param a - The first matrix.
     * @param b - The second matrix.
     * @return True if the matrices are equal, false otherwise.
     */
    public static equals (a: mat2, b: mat2) {
        const { m00: a0, m01: a1, m02: a2, m03: a3 } = a;
        const { m00: b0, m01: b1, m02: b2, m03: b3 } = b;
        return (
            Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3))
        );
    }

    /**
     * Multiply each element of a matrix by a scalar number.
     *
     * @param out - Matrix to store result.
     * @param a - Matrix to scale
     * @param b - The scale number.
     * @return out.
     */
    public static multiplyScalar<Out extends mat2> (out: Out, a: mat2, b: number) {
        out.m00 = a.m00 * b;
        out.m01 = a.m01 * b;
        out.m02 = a.m02 * b;
        out.m03 = a.m03 * b;
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
    public static multiplyScalarAndAdd<Out extends mat2> (out: Out, a: mat2, b: mat2, scale: number) {
        out.m00 = a.m00 + (b.m00 * scale);
        out.m01 = a.m01 + (b.m01 * scale);
        out.m02 = a.m02 + (b.m02 * scale);
        out.m03 = a.m03 + (b.m03 * scale);
        return out;
    }

    /**
     * The element at column 0 row 0.
     */
    public m00: number;

    /**
     * The element at column 0 row 1.
     */
    public m01: number;

    /**
     * The element at column 1 row 0.
     */
    public m02: number;

    /**
     * The element at column 1 row 1.
     */
    public m03: number;

    /**
     * Creates a matrix, with elements specified separately.
     *
     * @param m00 - Value assigned to element at column 0 row 0.
     * @param m01 - Value assigned to element at column 0 row 1.
     * @param m02 - Value assigned to element at column 1 row 0.
     * @param m03 - Value assigned to element at column 1 row 1.
     */
    constructor (m00 = 1, m01 = 0, m02 = 0, m03 = 1) {
        this.m00 = m00;
        this.m01 = m01;
        this.m02 = m02;
        this.m03 = m03;
    }
}
