import { pseudoRandomRange } from "../../exports/base";

/**
 * Creates a function which can be called infinite times, each call instance will yield pseudo random number in [0, 1];
 * @param initialSeed The seed.
 * @returns The generator.
 */
export function createPseudoRandomGenerator01(initialSeed: number) {
    const g = (function *(): Generator<number, never, never> {
        for (let seed = initialSeed; ; ++seed) {
            yield pseudoRandomRange(seed, 0, 1);
        }
    })();

    return () => {
        return g.next().value;
    };
}