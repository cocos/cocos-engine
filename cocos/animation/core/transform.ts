import { Vec3 } from '../../core/math/vec3';
import { Quat } from '../../core/math/quat';
import { EPSILON, Mat4 } from '../../core';

const CACHE_VECTOR_A = new Vec3();
const CACHE_VECTOR_B = new Vec3();
const CACHE_QUAT_A = new Quat();
const CACHE_QUAT_B = new Quat();

export class Transform {
    public static IDENTITY = Object.freeze(new Transform());

    public static ZERO = Object.freeze((() => {
        const transform = new Transform();
        Vec3.copy(transform._position, Vec3.ZERO);
        Quat.set(transform._rotation, 0.0, 0.0, 0.0, 0.0);
        Vec3.copy(transform._scale, Vec3.ZERO);
        return transform;
    })());

    get position (): Readonly<Vec3> {
        return this._position;
    }

    set position (value) {
        Vec3.copy(this._position, value);
    }

    get rotation (): Readonly<Quat> {
        return this._rotation;
    }

    set rotation (value) {
        Quat.copy(this._rotation, value);
    }

    get scale (): Readonly<Vec3> {
        return this._scale;
    }

    set scale (value) {
        Vec3.copy(this._scale, value);
    }

    public static clone (src: Readonly<Transform>) {
        const transform = new Transform();
        Transform.copy(transform, src);
        return transform;
    }

    public static setIdentity (out: Transform) {
        Vec3.copy(out._position, Vec3.ZERO);
        Quat.copy(out._rotation, Quat.IDENTITY);
        Vec3.copy(out._scale, Vec3.ONE);
        return out;
    }

    public static copy (out: Transform, src: Readonly<Transform>) {
        Vec3.copy(out._position, src._position);
        Quat.copy(out._rotation, src._rotation);
        Vec3.copy(out._scale, src._scale);
        return out;
    }

    public static equals (a: Readonly<Transform>, b: Readonly<Transform>, epsilon?: number) {
        return Vec3.equals(a._position, b._position, epsilon)
            && Quat.equals(a._rotation, b._rotation, epsilon)
            && Vec3.equals(a._scale, b._scale, epsilon);
    }

    public static strictEquals (a: Readonly<Transform>, b: Readonly<Transform>) {
        return Vec3.strictEquals(a._position, b._position)
            && Quat.strictEquals(a._rotation, b._rotation)
            && Vec3.strictEquals(a._scale, b._scale);
    }

    public static lerp (out: Transform, from: Readonly<Transform>, to: Readonly<Transform>, t: number) {
        if (t === 0.0) {
            return Transform.copy(out, from);
        }
        if (t === 1.0) {
            return Transform.copy(out, to);
        }
        Vec3.lerp(out._position, from._position, to._position, t);
        Quat.slerp(out._rotation, from._rotation, to._rotation, t);
        Vec3.lerp(out._scale, from._scale, to._scale, t);
        return out;
    }

    public static multiply (out: Transform, first: Readonly<Transform>, second: Readonly<Transform>) {
        const cacheRotation = Quat.multiply(CACHE_QUAT_A, second._rotation, first._rotation);

        const cacheScale = Vec3.multiply(CACHE_VECTOR_A, first._scale, second._scale);

        // T_p + (R_p * (S_p * T_c))
        const cachePosition = Vec3.multiply(CACHE_VECTOR_B, first._position, second._scale);
        Vec3.transformQuat(cachePosition, cachePosition, second._rotation);
        Vec3.add(cachePosition, cachePosition, second._position);

        Vec3.copy(out._position, cachePosition);
        Quat.copy(out._rotation, cacheRotation);
        Vec3.copy(out._scale, cacheScale);

        return out;
    }

    /**
     * Note: if scale of second transform contains 0,
     * the result scale's corresponding component would be error.
     */
    public static calculateRelative = (() => {
        const cacheInvRotation = new Quat();
        const cacheInvScale = new Vec3();
        return (out: Transform, first: Readonly<Transform>, second: Readonly<Transform>) => {
            const invSecondRotation = Quat.invert(cacheInvRotation, second._rotation);
            const invScale = invScaleOrZero(cacheInvScale, second._scale, EPSILON);

            // The inverse process of `T_p + (R_p * (S_p * T_c))`
            const cachePosition = Vec3.subtract(CACHE_VECTOR_B, first._position, second._position);
            Vec3.transformQuat(cachePosition, cachePosition, invSecondRotation);
            Vec3.multiply(cachePosition, cachePosition, invScale);

            Vec3.copy(out._position, cachePosition);
            Quat.multiply(out._rotation, invSecondRotation, first._rotation);
            Vec3.multiply(out._scale, first._scale, invScale);

            return out;
        };
    })();

    public static fromMatrix (out: Transform, matrix: Readonly<Mat4>) {
        Mat4.toRTS(
            matrix,
            out._rotation,
            out._position,
            out._scale,
        );
        return out;
    }

    public static toMatrix (out: Mat4, transform: Readonly<Transform>) {
        return Mat4.fromRTS(
            out,
            transform._rotation,
            transform._position,
            transform._scale,
        );
    }

    private readonly _position = new Vec3();

    private readonly _rotation = new Quat();

    private readonly _scale = Vec3.clone(Vec3.ONE);
}

/**
 * Invert each component of scale if it isn't close to zero, or set it to zero otherwise.
 */
function invScaleOrZero (out: Vec3, scale: Readonly<Vec3>, epsilon: number) {
    const { x, y, z } = scale;
    return Vec3.set(
        out,
        Math.abs(x) <= epsilon ? 0.0 : 1.0 / x,
        Math.abs(y) <= epsilon ? 0.0 : 1.0 / y,
        Math.abs(z) <= epsilon ? 0.0 : 1.0 / z,
    );
}
