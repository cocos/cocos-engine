/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

import { assertIsTrue } from '../data/utils/asserts';
import { clamp, Vec3 } from '../math';
import { warnID } from '../platform/debug';
import enums from './enums';

export enum SplineMode {
    /**
     * Broken line:
     * Each knot is connected with a straight line from the beginning to the end to form a curve. At least two knots.
     */
    LINEAR = 0,

    /**
     * Piecewise Bezier curve:
     * Every four knots form a curve. Total knots number must be a multiple of 4.
     * Each curve passes only the first and fourth knots, and does not pass through the middle two control knots.
     *
     * If you need a whole continuous curve:
     * (1) Suppose the four knots of the previous curve are A, B, C, D
     * (2) The four knots of the next curve must be D, E, F, G
     * (3) C and E need to be symmetrical about D
     */
    BEZIER = 1,

    /**
     * Catmull Rom curve:
     * All knots(including start & end knots) form a whole continuous curve. At least two knots.
     * The whole curve passes through all knots.
     */
    CATMULL_ROM = 2
}

const SPLINE_WHOLE_INDEX = 0xffffffff;

const _v0 = new Vec3();
const _v1 = new Vec3();
const _v2 = new Vec3();
const _v3 = new Vec3();

/**
 * @en
 * Basic Geometry: Spline.
 * @zh
 * 基础几何 Spline
 */

export class Spline {
    private readonly _type: number;
    private _mode: SplineMode = SplineMode.CATMULL_ROM;
    private _knots: Vec3[] = [];

    private constructor (mode: SplineMode = SplineMode.CATMULL_ROM, knots: Readonly<Vec3[]> = []) {
        this._type = enums.SHAPE_SPLINE;
        this._mode = mode;

        for (let i = 0; i < knots.length; i++) {
            this._knots[i] = new Vec3(knots[i]);
        }
    }

    public static create (mode: SplineMode, knots: Vec3[] = []) {
        return new Spline(mode, knots);
    }

    public static clone (s: Spline) {
        return new Spline(s.mode, s.knots);
    }

    public static copy (out: Spline, s: Spline) {
        out._mode = s.mode;
        out._knots.length = 0;

        const knots = s.knots;
        const length = knots.length;
        for (let i = 0; i < length; i++) {
            out._knots[i] = new Vec3(knots[i]);
        }

        return out;
    }

    get type () {
        return this._type;
    }

    get mode () {
        return this._mode;
    }

    get knots (): Readonly<Vec3[]> {
        return this._knots;
    }

    public setModeAndKnots (mode: SplineMode, knots: Vec3[]) {
        this._mode = mode;
        this._knots.length = 0;

        for (let i = 0; i < knots.length; i++) {
            this._knots[i] = new Vec3(knots[i]);
        }
    }

    public clearKnots () {
        this._knots.length = 0;
    }

    public getKnotCount () {
        return this._knots.length;
    }

    public addKnot (knot: Vec3) {
        this._knots.push(new Vec3(knot));
    }

    public insertKnot (index: number, knot: Vec3) {
        const item = new Vec3(knot);
        if (index >= this._knots.length) {
            this._knots.push(item);
            return;
        }

        this._knots.splice(index, 0, item);
    }

    public removeKnot (index: number) {
        assertIsTrue(index >= 0 && index < this._knots.length, 'Spline: invalid index');

        this._knots.splice(index, 1);
    }

    public setKnot (index: number, knot: Vec3) {
        assertIsTrue(index >= 0 && index < this._knots.length, 'Spline: invalid index');

        this._knots[index].set(knot);
    }

    public getKnot (index: number): Readonly<Vec3> {
        assertIsTrue(index >= 0 && index < this._knots.length, 'Spline: invalid index');

        return this._knots[index];
    }

    // get a point at t with repect to the `index` segment of curve or the whole curve.
    public getPoint (t: number, index: number = SPLINE_WHOLE_INDEX) {
        t = clamp(t, 0.0, 1.0);

        const segments = this.getSegments();
        if (segments == 0) {
            return new Vec3(0.0, 0.0, 0.0);
        }

        if (index == SPLINE_WHOLE_INDEX) {
            const deltaT = 1.0 / segments;

            index = Math.floor(t / deltaT);
            t     = (t % deltaT) / deltaT;
        }

        if (index >= segments) {
            return new Vec3(this._knots[this._knots.length - 1]);
        }

        switch (this._mode) {
        case SplineMode.LINEAR:
            return Spline.calcLinear(this._knots[index], this._knots[index + 1], t);
        case SplineMode.BEZIER:
            return Spline.calcBezier(this._knots[index * 4], this._knots[index * 4 + 1], this._knots[index * 4 + 2], this._knots[index * 4 + 3], t);
        case SplineMode.CATMULL_ROM: {
            const v0 = index > 0 ? this._knots[index - 1] : this._knots[index];
            const v3 = index + 2 < this._knots.length ? this._knots[index + 2] : this._knots[index + 1];
            return Spline.calcCatmullRom(v0, this._knots[index], this._knots[index + 1], v3, t);
        }
        default:
            return new Vec3(0.0, 0.0, 0.0);
        }
    }

    // get num points from 0 to 1 uniformly with repect to the `index` segment of curve or the whole curve
    public getPoints (num: number, index: number = SPLINE_WHOLE_INDEX): Vec3[] {
        if (num == 0) {
            return [];
        }

        if (num == 1) {
            const point = this.getPoint(0.0, index);
            return [point];
        }

        const points: Vec3[] = [];
        const deltaT = 1.0 / (num - 1.0);

        for (let i = 0; i < num; i++) {
            const t     = i * deltaT;
            const point = this.getPoint(t, index);

            points.push(point);
        }

        return points;
    }

    private getSegments () {
        const count = this._knots.length;
        switch (this._mode) {
        case SplineMode.LINEAR:
        case SplineMode.CATMULL_ROM:
            if (count < 2) {
                warnID(14300);
                return 0;
            }

            return count - 1;
        case SplineMode.BEZIER:
            if (count < 4 || count % 4 != 0) {
                warnID(14301);
                return 0;
            }

            return count / 4;
        default:
            assertIsTrue(false, 'Spline error: invalid mode');
        }
    }

    private static calcLinear (v0: Vec3, v1: Vec3, t: number) {
        const result = new Vec3();
        Vec3.multiplyScalar(_v0, v0, (1.0 - t));
        Vec3.multiplyScalar(_v1, v1, t);
        Vec3.add(result, _v0, _v1);

        return result;
    }

    private static calcBezier (v0: Vec3, v1: Vec3, v2: Vec3, v3: Vec3, t: number) {
        const result = new Vec3();
        const s = 1.0 - t;
        Vec3.multiplyScalar(_v0, v0, s * s * s);
        Vec3.multiplyScalar(_v1, v1, 3.0 * t * s * s);
        Vec3.multiplyScalar(_v2, v2, 3.0 * t * t * s);
        Vec3.multiplyScalar(_v3, v3, t * t * t);
        Vec3.add(_v0, _v0, _v1);
        Vec3.add(_v2, _v2, _v3);
        Vec3.add(result, _v0, _v2);

        return result;
    }
    private static calcCatmullRom (v0: Vec3, v1: Vec3, v2: Vec3, v3: Vec3, t: number) {
        const result = new Vec3();
        const t2 = t * t;
        const t3 = t2 * t;
        Vec3.multiplyScalar(_v0, v0, -0.5 * t3 + t2 - 0.5 * t);
        Vec3.multiplyScalar(_v1, v1, 1.5 * t3 - 2.5 * t2 + 1.0);
        Vec3.multiplyScalar(_v2, v2, -1.5 * t3 + 2.0 * t2 + 0.5 * t);
        Vec3.multiplyScalar(_v3, v3, 0.5 * t3 - 0.5 * t2);
        Vec3.add(_v0, _v0, _v1);
        Vec3.add(_v2, _v2, _v3);
        Vec3.add(result, _v0, _v2);

        return result;
    }
}
