
import { assertIsTrue } from '../../data/utils/asserts';
import { Quat } from '../../math/quat';
import { clamp } from '../../math/utils';
import { Vec3 } from '../../math/vec3';
import { Node } from '../../scene-graph/node';

const THETA_ERROR = 0.001;
const DUMP_BIAS = 1.0;

enum IterationResult {
    UNFINISHED,
    DONE,
    INTERRUPTED,
}

/**
 * The Cyclic Coordinate Descent algorithm.
 * @param links The links(limbs).
 * @param target Target position.
 * @param maxIterations Max iterations.
 * @param forward True if use forward iteration(base to leaf), otherwise use backward iteration(leaf to base).
 */
export function ccdIK(
    links: Node[],
    target: Vec3,
    epsilon: number,
    maxIterations: number,
    forward: boolean,
) {
    const nLinks = links.length;
    if (nLinks < 2) {
        return;
    }

    const u = new Vec3(); // Vector from end factor to current link
    const v = new Vec3(); // Vector from target to current link
    const axis = new Vec3(); // Intermediate var
    const correctiveRot = new Quat();
    const currentPos = new Vec3();
    const currentRot = new Quat();
    const endFactorPos = new Vec3();

    const iEndFactor = links.length - 1;
    const endFactor = links[iEndFactor];
    if (forward) {
        for (let iteration = 0; iteration < maxIterations; ++iteration) {
            // Won't run in infinite loop since we have `nLinks >= 2`
            for (let iLink = 0; iLink < iEndFactor; ++iLink) {
                const result = correct(iLink);
                if (result === IterationResult.INTERRUPTED) {
                    break;
                } else if (result === IterationResult.DONE) {
                    return;
                }
            }
        }
    } else {
        for (let iteration = 0; iteration < maxIterations; ++iteration) {
            // Won't run in infinite loop since we have `nLinks >= 2`
            for (let iLink = iEndFactor - 1; iLink >= 0; --iLink) {
                const result = correct(iLink);
                if (result === IterationResult.INTERRUPTED) {
                    break;
                } else if (result === IterationResult.DONE) {
                    return;
                }
            }
        }
    }

    function correct (linkIndex: number): IterationResult {
        const current = links[linkIndex];

        current.getWorldPosition(currentPos);
        endFactor.getWorldPosition(endFactorPos);

        Vec3.subtract(u, endFactorPos, currentPos);
        Vec3.normalize(u, u);
        Vec3.subtract(v, target, currentPos);
        Vec3.normalize(v, v);

        // TODO: what if axis is zero?
        Vec3.cross(axis, u, v);
        Vec3.normalize(axis, axis);

        const cosTheta = Vec3.dot(u, v);
        const theta = Math.acos(cosTheta) * DUMP_BIAS;

        // Refresh hierarchy
        Quat.fromAxisAngle(correctiveRot, axis, theta);
        current.getWorldRotation(currentRot);
        Quat.multiply(currentRot, correctiveRot, currentRot);
        current.setWorldRotation(currentRot);
        endFactor.getWorldPosition(endFactorPos);

        // Try
        const distance = Vec3.distance(endFactorPos, target);
        if (distance < epsilon) {
            return IterationResult.DONE;
        }

        // If the link’s corrective rotations exceeds the tolerance-redo other links.
        if (theta > THETA_ERROR) {
            return IterationResult.INTERRUPTED;
        }

        return IterationResult.UNFINISHED;
    }
}
