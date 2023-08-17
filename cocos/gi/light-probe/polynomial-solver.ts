/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
     * return the unique real positive root
     */
    public static getQuadraticUniqueRoot (b: number, c: number, d: number): number {
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
     * return the unique real positive root
     */
    public static getCubicUniqueRoot (b: number, c: number, d: number): number {
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
            roots.push(2.0 * Math.sqrt(-p) * Math.cos(angle));
            roots.push(2.0 * Math.sqrt(-p) * Math.cos(angle + 2.0 * Math.PI / 3.0));
            roots.push(2.0 * Math.sqrt(-p) * Math.cos(angle + 4.0 * Math.PI / 3.0));
        } else if (q === 0.0) {
            // three real roots, at least two equal roots
            roots.push(0.0);
        } else {
            // three real roots, at least two equal roots
            const root = Math.cbrt(q);
            roots.push(root);
            roots.push(-2.0 * root);
        }

        // return the unique positive root
        for (let i = 0; i < roots.length; i++) {
            if (roots[i] + offset >= 0.0) {
                return roots[i] + offset;
            }
        }

        // never reach here
        return 0.0;
    }
}
