import { Vec3 } from '../../core/math/vec3';
import { Quat } from '../../core/math/quat';
import { EPSILON, Mat4 } from '../../core';

const CACHE_VECTOR_A = new Vec3();
const CACHE_VECTOR_B = new Vec3();
const CACHE_QUAT_A = new Quat();
const CACHE_QUAT_B = new Quat();

// Can not use `Readonly<Transform>`.
// See: https://github.com/microsoft/TypeScript/issues/50668
type ReadonlyTransform = Transform;

export class Transform {
    public static IDENTITY = Object.freeze(new Transform());

    public static ZERO = Object.freeze(((): Transform => {
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

    public static clone (src: ReadonlyTransform): Transform {
        const transform = new Transform();
        Transform.copy(transform, src);
        return transform;
    }

    public static setIdentity (out: Transform): Transform {
        Vec3.copy(out._position, Vec3.ZERO);
        Quat.copy(out._rotation, Quat.IDENTITY);
        Vec3.copy(out._scale, Vec3.ONE);
        return out;
    }

    public static copy (out: Transform, src: ReadonlyTransform): Transform {
        Vec3.copy(out._position, src._position);
        Quat.copy(out._rotation, src._rotation);
        Vec3.copy(out._scale, src._scale);
        return out;
    }

    public static equals (a: ReadonlyTransform, b: ReadonlyTransform, epsilon?: number): boolean {
        return Vec3.equals(a._position, b._position, epsilon)
            && Quat.equals(a._rotation, b._rotation, epsilon)
            && Vec3.equals(a._scale, b._scale, epsilon);
    }

    public static strictEquals (a: ReadonlyTransform, b: ReadonlyTransform):boolean {
        return Vec3.strictEquals(a._position, b._position)
            && Quat.strictEquals(a._rotation, b._rotation)
            && Vec3.strictEquals(a._scale, b._scale);
    }

    public static lerp (out: Transform, from: ReadonlyTransform, to: ReadonlyTransform, t: number): Transform {
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

    /**
     * Associate two transforms.
     * The result is as if the `first` transform is applied and then the `second` transform.
     * @param out The result transform.
     * @param first The first transform to apply.
     * @param second The second transform to apply.
     * @returns `out`.
     * @note
     * Much important things to note is that
     * currently the following prerequisites are imposed on scales of both transforms:
     * - The scale should be uniformed, ie. all components should be the same.
     * - Each component of the scale shall be non-negative.
     */
    public static multiply (out: Transform, second: ReadonlyTransform, first: ReadonlyTransform): Transform {
        // May reference to https://zhuanlan.zhihu.com/p/119066087
        // for the reason about restrictions on uniform scales.

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
     * Calculates the relative transitions.
     * The result is as if `first` transform is associated by applying the result first then the `second`.
     * @param out The result transform.
     * @param first See description.
     * @param second See description.
     * @returns `out`.
     * @note
     *
     * Note: if scale of second transform contains 0,
     * the result scale's corresponding component would be error.
     *
     * Same restriction is applied to this method like `Transform.multiply`.
     */
    public static calculateRelative = ((): (out: Transform, first: ReadonlyTransform, second: ReadonlyTransform) => Transform => {
        const cacheInvRotation = new Quat();
        const cacheInvScale = new Vec3();
        return (out: Transform, first: ReadonlyTransform, second: ReadonlyTransform): Transform => {
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

    /**
     * Inverts the transform.
     * @param out Out transform.
     * @param transform Transform to invert.
     */
    public static invert (out: Transform, transform: ReadonlyTransform): Transform {
        const {
            _rotation: invRotation,
            _scale: invScale,
            _position: invPosition,
        } = out;

        Quat.invert(invRotation, transform._rotation);
        invScaleOrZero(invScale, transform._scale, EPSILON);

        /**
         * Let $b$ be the inverse of $a$, then for the translation term $T$(Vector), rotation term $Q$(Quaternion), scale term $S$(Vector):
         *
         * ```math
         * \begin{equation}
         * \begin{split}
         * T_(a * b) & = T_b + (Q_b \times (S_b \times T_a) \times Q_b^{-1}) = 0 \\
         *      T(b) & = -(Q_b \times S_b \times T_a \times Q_b^{-1}) \\
         *           & = Q_b \times (S_b \times -T_a) \times Q_b^{-1}
         * \end{split}
         * \end{equation}
         * ```
         *
         * Which equals to:
         *   - Translate by $-T_a$
         *   - Then scale by the $S_b$(ie. $S_a^{-1}$)
         *   - Then rotate by $Q_b$(ie. $Q_a^{-1}$)

         */
        Vec3.negate(invPosition, transform._position);
        Vec3.multiply(invPosition, invPosition, invScale);
        Vec3.transformQuat(invPosition, invPosition, invRotation);

        return out;
    }

    public static fromMatrix (out: Transform, matrix: Readonly<Mat4>): Transform {
        Mat4.toSRT(
            matrix,
            out._rotation,
            out._position,
            out._scale,
        );
        return out;
    }

    public static toMatrix (out: Mat4, transform: ReadonlyTransform): Mat4 {
        return Mat4.fromSRT(
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
function invScaleOrZero (out: Vec3, scale: Readonly<Vec3>, epsilon: number): Vec3 {
    const { x, y, z } = scale;
    return Vec3.set(
        out,
        Math.abs(x) <= epsilon ? 0.0 : 1.0 / x,
        Math.abs(y) <= epsilon ? 0.0 : 1.0 / y,
        Math.abs(z) <= epsilon ? 0.0 : 1.0 / z,
    );
}

export function __calculateDeltaTransform (out: Transform, target: Readonly<Transform>, base: Readonly<Transform>): Transform {
    Vec3.subtract(out.position, target.position, base.position);
    deltaQuat(out.rotation, base.rotation, target.rotation);
    Vec3.subtract(out.scale, target.scale, base.scale);
    return out;
}

export const __applyDeltaTransform = ((): (out: Transform, base: Readonly<Transform>, delta: Readonly<Transform>, alpha: number) => Transform => {
    const cacheQuat = new Quat();
    return (out: Transform, base: Readonly<Transform>, delta: Readonly<Transform>, alpha: number): Transform => {
        Vec3.scaleAndAdd(out.position, base.position, delta.position, alpha);
        const weightedDeltaRotation = Quat.slerp(cacheQuat, Quat.IDENTITY, delta.rotation, alpha);
        Quat.multiply(out.rotation, weightedDeltaRotation, base.rotation);
        Vec3.scaleAndAdd(out.scale, base.scale, delta.scale, alpha);
        return out;
    };
})();

/**
 * Calculates the delta(relative) rotations between two rotations represented by quaternions.
 * @param out
 * @param from
 * @param to
 */
const deltaQuat = ((): (out: Quat, from: Quat, to: Quat) => Quat => {
    const quatMultiInvInverseCache = new Quat();
    return (out: Quat, from: Quat, to: Quat): Quat => {
        const fromInv = Quat.invert(quatMultiInvInverseCache, from);
        return Quat.multiply(out, to, fromInv);
    };
})();

export const ZERO_DELTA_TRANSFORM = Object.freeze(((): Transform => {
    const transform = new Transform();
    transform.position = Vec3.ZERO;
    transform.rotation = Quat.IDENTITY;
    transform.scale = Vec3.ZERO;
    return transform;
})());
