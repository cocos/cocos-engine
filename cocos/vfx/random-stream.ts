import { DEBUG } from 'internal:constants';
import { assertIsTrue, Vec2, Vec3 } from '../core';

export class RandomStream {
    public get seed () {
        return this._seed;
    }

    public set seed (val) {
        this._seed = val >>> 0;
    }
    private static _gRand = new RandomStream();
    private _seed = 0;

    public static getFloat (seed: number) {
        this._gRand.seed = seed;
        return this._gRand.getFloat();
    }

    public static get2Float (seed: number, out: Vec2) {
        const gRand = this._gRand;
        gRand._seed = seed;
        out.x = gRand.getFloat();
        out.y = gRand.getFloat();
        return out;
    }

    public static get3Float (seed: number, out: Vec3) {
        const gRand = this._gRand;
        gRand._seed = seed;
        out.x = gRand.getFloat();
        out.y = gRand.getFloat();
        out.z = gRand.getFloat();
        return out;
    }

    constructor (seed = Math.floor(Math.random() * 0xffffffff)) {
        this._seed = seed;
    }

    /**
     * @en
     * Get a random float between 0 and 1, include 0, exclude 1.
     * @zh
     * 获取一个 0 到 1 之间的随机浮点数，包含 0，不包含 1。
     *
     * @returns a random float between 0 and 1, include 0, exclude 1.
     */
    public getFloat () {
        // only need 23 bits of int. and divide by 2^23
        return (this.getUInt32() >>> 9) / 8388608.0;
    }

    /**
     * @en
     * Get a random float between -1 and 1, include -1, exclude 1.
     * @zh
     * 获取一个 -1 到 1 之间的随机浮点数，包含 -1，不包含 1。
     *
     * @returns a random float between -1 and 1, include -1, exclude 1.
     */
    public getSignedFloat () {
        return this.getFloat() * 2.0 - 1.0;
    }

    /**
     * @en
     * Get a random unsigned 32 bits integer. range is [0, 2^32).
     *
     * @zh
     * 获取一个随机的无符号 32 位整数，范围是 [0, 2^32)。
     *
     * @returns a random unsigned 32 bits integer.
     */
    public getUInt32 () {
        this._seed = ((Math.imul(this._seed, 196314165) >>> 0) + 907633515) >>> 0;
        return this._seed;
    }

    public getFloatFromRange (min: number, max: number) {
        if (DEBUG) {
            assertIsTrue(min < max, 'min should be less than max');
        }
        return min + (max - min) * this.getFloat();
    }

    public getIntFromRange (min: number, max: number) {
        if (DEBUG) {
            assertIsTrue(min < max, 'min should be less than max');
        }
        return this.getUInt32() % (max - min) + min;
    }
}
