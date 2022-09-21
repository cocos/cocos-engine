export function blend1D (weights: number[], thresholds: readonly number[], value: number) {
    weights.fill(0.0);
    if (thresholds.length === 0) {
        // Do nothing
    } else if (value <= thresholds[0]) {
        weights[0] = 1;
    } else if (value >= thresholds[thresholds.length - 1]) {
        weights[weights.length - 1] = 1;
    } else {
        let iUpper = 0;
        for (let iThresholds = 1; iThresholds < thresholds.length; ++iThresholds) {
            if (thresholds[iThresholds] > value) {
                iUpper = iThresholds;
                break;
            }
        }
        const lower = thresholds[iUpper - 1];
        const upper = thresholds[iUpper];
        const dVal = upper - lower;
        weights[iUpper - 1] = (upper - value) / dVal;
        weights[iUpper] = (value - lower) / dVal;
    }
}
