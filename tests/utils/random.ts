export class PseudoRandomGenerator {
    constructor(initialSeed: number) {
        this._seed = initialSeed;
    }

    get defaultOrder() { return this._defaultOrder }
    set defaultOrder(value) { this._defaultOrder = value; }

    /** Generates number in [min, max]. */
    public range(min: number, max: number) {
        if (min > max) {
            throw new Error(`min should not be greater than max.`);
        }
        return min + (max - min) * this.range01();
    }

    /** Generates number in [0, 1]. */
    public range01() {
        return mulberry32(this._seed++);
    }

    /** Generates number in [-1, 1]. */
    public normalized() {
        return this.range(-1, 1);
    }

    /**
     * Generates a finite number.
     * @order The order(max mag).
     */
    public finite(order=this._defaultOrder) {
        return this.normalized() * order;
    }

    /**
     * Generates a positive number.
     * @order The order(max mag).
     */
    public positive(order=this._defaultOrder) {
        return this.range01() * order + order * 1e-6;
    }

    /**
     * Generates a negative number.
     * @order The order(max mag).
     */
    public negative(order=this._defaultOrder) {
        return this.range01() * -order - order * 1e-6;
    }

    private _seed = 0;
    private _defaultOrder = 1e3;
}

export { getMagicSeed } from './random-seed';

function mulberry32(a: number) {
    // https://stackoverflow.com/a/47593316
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}