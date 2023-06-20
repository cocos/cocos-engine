/**
 * Tells if the weight is too small so that it can be treated as 0.
 * @param weight The weight.
 * @returns True if it can be treated as 0.
 */
export function isIgnorableWeight (weight: number): boolean {
    return weight < 1e-5;
}
