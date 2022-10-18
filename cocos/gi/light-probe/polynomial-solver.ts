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

export class PolynomialSolver {
    /**
     * solve quadratic equation: b * t^2 + c * t + d = 0
     * return the unique real root
     */
    public static getQuadraticUniqueRoot (b: number, c: number, d: number) {
        // quadratic case
        if (b !== 0.0) {
            // the discriminant should be 0
            return -c / (2.0 * b);
        }

        // linear case
        if (c !== 0.0) {
            return -d / c;
        }

        // never reach here
        return 0.0;
    }

    /**
     * solve cubic equation: t^3 + b * t^2 + c * t + d = 0
     * return the unique real root
     */
    public static getCubicUniqueRoot (b: number, c: number, d: number) {
        const roots: number[] = [];

        // let x = y - b / 3, convert equation to: y^3 + 3 * p * y + 2 * q = 0
        // where p = c / 3 - b^2 / 9, q = d / 2 + b^3 / 27 - b * c / 6
        const offset = -b / 3.0;
        const p = c / 3.0 - (b * b) / 9.0;
        const q = d / 2.0 + (b * b * b) / 27.0 - (b * c) / 6.0;
        const delta = p * p * p + q * q; // discriminant

        if (delta > 0.0) {
            // only one real root
            const sqrtDelta = Math.sqrt(delta);
            roots.push(Math.cbrt(-q + sqrtDelta) + Math.cbrt(-q - sqrtDelta));
        } else if (delta < 0.0) {
            // three different real roots
            const angle = Math.acos(-q * Math.sqrt(-p) / (p * p)) / 3.0;
            roots.push(2.0 * Math.sqrt(-p) * Math.acos(angle));
            roots.push(2.0 * Math.sqrt(-p) * Math.acos(angle + 2.0 * Math.PI / 3.0));
            roots.push(2.0 * Math.sqrt(-p) * Math.acos(angle + 4.0 * Math.PI / 3.0));
        } else if (q === 0.0) {
            // three real roots, at least two equal roots
            roots.push(0.0);
        } else {
            // three real roots, at least two equal roots
            const root = Math.cbrt(q);
            roots.push(root);
            roots.push(-2.0 * root);
        }

        return roots.length > 0 ? roots[0] + offset : 0.0;
    }
}
