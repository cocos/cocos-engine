import { DEBUG } from 'internal:constants';
import { approx, clamp, Quat, Vec3 } from '../../../../../core';
import { Transform } from '../../../../core/transform';
import { debugTwoBoneIKDraw } from './two-bone-ik-debugger';

const SANITY_CHECK_ENABLED = DEBUG;

class TwoBoneIKPositionSanityChecker {
    public reset (a: Readonly<Vec3>, b: Readonly<Vec3>, c: Readonly<Vec3>): void {
        Vec3.copy(this._a, a);
        this._dAB = Vec3.distance(a, b);
        this._dBC = Vec3.distance(b, c);
    }

    public check (_a: Readonly<Vec3>, _b: Readonly<Vec3>, _c: Readonly<Vec3>): boolean {
        const CHECK_EPSILON = 1e-3;
        const dAB = Vec3.distance(_a, _b);
        const dBC = Vec3.distance(_b, _c);
        if (!approx(Vec3.distance(_a, this._a), 0.0, CHECK_EPSILON)) {
            // eslint-disable-next-line no-debugger
            debugger;
            return false;
        }
        if (!approx(dAB, this._dAB, CHECK_EPSILON)) {
            // eslint-disable-next-line no-debugger
            debugger;
            return false;
        }
        if (!approx(dBC, this._dBC, CHECK_EPSILON)) {
            // eslint-disable-next-line no-debugger
            debugger;
            return false;
        }
        return true;
    }

    private _a = new Vec3();
    private declare _dAB: number;
    private declare _dBC: number;
}

/**
 * 解算双骨骼（三关节）的 IK 问题。
 * 三关节分别称为根关节、中间关节和末端关节。例如，分别对应于大腿、膝盖和脚关节。
 * @param root 根关节转换（世界空间）。
 * @param middle 中间关节转换（世界空间）。
 * @param end 末端关节转换（世界空间）。
 * @param target 末端关节要抵达的目标位置（世界空间）。
 * @param hint 中间关节的提示位置（世界空间），用于决定中间关节的朝向。
 */
export const solveTwoBoneIK = ((): (root: Transform, middle: Transform, end: Transform, target: Vec3, middlePositionHint?: Vec3, debugKey?: unknown | undefined) => void => {
    const cacheQuat = new Quat();
    const cacheHint = new Vec3();
    const cacheBSolved = new Vec3();
    const cacheCSolved = new Vec3();

    const calculateRotationBetweenRays = ((): (out: Quat, sourceOrigin: Readonly<Vec3>, sourceDestination: Readonly<Vec3>, targetOrigin: Readonly<Vec3>, targetDestination: Readonly<Vec3>) => Quat => {
        const cacheVec3_1 = new Vec3();
        const cacheVec3_2 = new Vec3();
        return (
            out: Quat,
            sourceOrigin: Readonly<Vec3>, sourceDestination: Readonly<Vec3>,
            targetOrigin: Readonly<Vec3>, targetDestination: Readonly<Vec3>,
        // eslint-disable-next-line arrow-body-style
        ): Quat => {
            return Quat.rotationTo(
                out,
                Vec3.subtract(cacheVec3_1, sourceDestination, sourceOrigin).normalize(),
                Vec3.subtract(cacheVec3_2, targetDestination, targetOrigin).normalize(),
            );
        };
    })();

    return (
        root: Transform,
        middle: Transform,
        end: Transform,
        target: Vec3,
        middlePositionHint?: Vec3,
        debugKey?: unknown | undefined,
    ): void => {
        const hint = Vec3.copy(cacheHint, middlePositionHint ?? middle.position);

        const pA = root.position;
        const pB = middle.position;
        const pC = end.position;
        const qC = end.rotation;

        if (DEBUG) {
            if (typeof debugKey !== undefined) {
                debugTwoBoneIKDraw(debugKey, pA, pB, pC);
            }
        }

        const bSolved = cacheBSolved;
        const cSolved = cacheCSolved;
        solveTwoBoneIKPositions(
            pA,
            pB,
            pC,
            target,
            hint,
            bSolved,
            cSolved,
        );

        const qA = calculateRotationBetweenRays(
            cacheQuat,
            pA, pB,
            pA, bSolved,
        );
        Quat.multiply(qA, qA, root.rotation);
        root.rotation = qA;

        const qB = calculateRotationBetweenRays(
            cacheQuat,
            pB, pC,
            bSolved, cSolved,
        );
        Quat.multiply(qB, qB, middle.rotation);
        middle.rotation = qB;
        middle.position = bSolved;

        end.position = cSolved;
    };
})();

export const solveTwoBoneIKPositions = ((): (a: Readonly<Vec3>, b: Readonly<Vec3>, c: Readonly<Vec3>, target: Readonly<Vec3>, middleTarget: Readonly<Vec3>, bSolved: Vec3, cSolved: Vec3) => void => {
    const cacheDirAT = new Vec3();
    const cacheDirAB = new Vec3();
    const cacheDirHeightLine = new Vec3();
    const cacheSanityChecker = SANITY_CHECK_ENABLED
        ? new TwoBoneIKPositionSanityChecker()
        : undefined;

    return (
        a: Readonly<Vec3>,
        b: Readonly<Vec3>,
        c: Readonly<Vec3>,
        target: Readonly<Vec3>,
        middleTarget: Readonly<Vec3>,
        bSolved: Vec3,
        cSolved: Vec3,
    ): void => {
        const sanityCheck = cacheSanityChecker
            ? ((): () => boolean => {
                cacheSanityChecker?.reset(a, b, c);
                return (): boolean => cacheSanityChecker.check(a, bSolved, cSolved);
            })()
            : undefined;

        const dAB = Vec3.distance(a, b);
        const dBC = Vec3.distance(b, c);
        const dAT = Vec3.distance(a, target);

        const dirAT = Vec3.subtract(cacheDirAT, target, a);
        dirAT.normalize();

        const chainLength = dAB + dBC;
        if (dAT >= chainLength) {
            // Target is too far
            Vec3.scaleAndAdd(bSolved, a, dirAT, dAB);
            Vec3.scaleAndAdd(cSolved, a, dirAT, chainLength);
            sanityCheck?.();
            return;
        }

        // Now we should have a solution with target reached.
        // And then solve the middle joint B as Ḃ.
        Vec3.copy(cSolved, target);
        // Calculate ∠BAC's cosine.
        const cosḂAT = clamp(
            (dAB * dAB + dAT * dAT - dBC * dBC) / (2 * dAB * dAT),
            -1.0,
            1.0,
        );
        // Then use basic trigonometry(instead of rotation) to solve Ḃ.
        // Let D the intersect point of the height line passing Ḃ.
        const dirAB = Vec3.subtract(cacheDirAB, middleTarget, a);
        const dirHeightLine = Vec3.projectOnPlane(cacheDirHeightLine, dirAB, dirAT);
        dirHeightLine.normalize();
        const dAD = dAB * cosḂAT;
        const hSqr = dAB * dAB - dAD * dAD;
        if (hSqr < 0) {
            // TODO: 'Shall handle this case';
            // eslint-disable-next-line no-debugger
            debugger;
        }
        const h = Math.sqrt(hSqr);
        Vec3.scaleAndAdd(bSolved, a, dirAT, dAD);
        Vec3.scaleAndAdd(bSolved, bSolved, dirHeightLine, h);
        sanityCheck?.();
    };
})();
