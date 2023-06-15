/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

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
    private _seed1 = 0;
    private _seed2 = 0;
    private _seed3 = 0;

    public static getFloat (seed1: number, seed2: number, seed3: number) {
        this._gRand._seed1 = seed1;
        this._gRand._seed2 = seed2;
        this._gRand._seed3 = seed3;
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
