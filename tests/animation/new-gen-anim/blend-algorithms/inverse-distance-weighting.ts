import { Vec2 } from "../../../../cocos/core";

export function inverseDistanceWeighting2D (weights: number[], samples: readonly Vec2[], value: Readonly<Vec2>, power: number) {
    const invDistances = new Array(samples.length).fill(0.0);

    let sumInvDistance = 0.0;
    for (let iSample = 0; iSample < samples.length; ++iSample) {
        const sample = samples[iSample];
        const distanceSqr = Vec2.squaredDistance(sample, value);
        if (distanceSqr === 0.0) {
            weights.fill(0.0);
            weights[iSample] = 1.0;
            return;
        }
        // 1 / (d^p)
        const invDistance = distanceSqr ** -(0.5 * power);
        invDistances[iSample] = invDistance;
        sumInvDistance += invDistance;
    }

    for (let iSample = 0; iSample < samples.length; ++iSample) {
        weights[iSample] = invDistances[iSample] / sumInvDistance;
    }
}