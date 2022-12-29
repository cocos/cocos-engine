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

// cSpell:words Cardano's irreducibilis

/**
 * Solve Cubic Equation using Cardano's formula.
 * The equation is formed from coeff0 + coeff1 * x + coeff2 * x^2 + coeff3 * x^3 = 0.
 * Modified from https://github.com/erich666/GraphicsGems/blob/master/gems/Roots3And4.c .
 */
export function solveCubic (coeff0: number, coeff1: number, coeff2: number, coeff3: number, solutions: [number, number, number]) {
    // normal form: x^3 + Ax^2 + Bx + C = 0
    const a = coeff2 / coeff3;
    const b = coeff1 / coeff3;
    const c = coeff0 / coeff3;

    // substitute x = y - A/3 to eliminate quadric term:
    // x^3 +px + q = 0
    const sqrA = a * a;
    const p = 1.0 / 3.0 * (-1.0 / 3 * sqrA + b);
    const q = 1.0 / 2.0 * (2.0 / 27.0 * a * sqrA - 1.0 / 3 * a * b + c);

    // use Cardano's formula
    const cubicP = p * p * p;
    const d = q * q + cubicP;

    let nSolutions = 0;
    if (isZero(d)) {
        if (isZero(q)) { // one triple solution
            solutions[0] = 0;
            return 1;
        } else { // one single and one double solution
            const u = Math.cbrt(-q);
            solutions[0] = 2 * u;
            solutions[1] = -u;
            return 2;
        }
    } else if (d < 0) { // Casus irreducibilis: three real solutions
        const phi = 1.0 / 3 * Math.acos(-q / Math.sqrt(-cubicP));
        const t = 2 * Math.sqrt(-p);

        solutions[0] =   t * Math.cos(phi);
        solutions[1] = -t * Math.cos(phi + Math.PI / 3);
        solutions[2] = -t * Math.cos(phi - Math.PI / 3);
        nSolutions = 3;
    } else { // one real solution
        const sqrtD = Math.sqrt(d);
        const u = Math.cbrt(sqrtD - q);
        const v = -Math.cbrt(sqrtD + q);
        solutions[0] = u + v;
        nSolutions = 1;
    }

    const sub = 1.0 / 3 * a;
    for (let i = 0; i < nSolutions; ++i) {
        solutions[i] -= sub;
    }

    return nSolutions;
}

const EQN_EPS = 1e-9;

function isZero (x: number) {
    return x > -EQN_EPS && x < EQN_EPS;
}
