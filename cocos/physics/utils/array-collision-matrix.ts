/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

/**
 * Collision "matrix". It's actually a triangular-shaped array of whether two bodies are touching this step, for reference next step
 * @class ArrayCollisionMatrix
 * @constructor
 */
export class ArrayCollisionMatrix {
    /**
     * The matrix storage
     */
    public matrix: number[] = [];

    /**
     * Get an element
     * @method get
     * @param  {Number} i
     * @param  {Number} j
     * @return {Number}
     */
    public get (i: number, j: number): number {
        if (j > i) {
            const temp = j;
            j = i;
            i = temp;
        }
        return this.matrix[(i * (i + 1) >> 1) + j - 1];
    }

    /**
     * Set an element
     * @method set
     * @param {Number} i
     * @param {Number} j
     * @param {boolean} value
     */
    public set (i: number, j: number, value: boolean): void {
        if (j > i) {
            const temp = j;
            j = i;
            i = temp;
        }
        this.matrix[(i * (i + 1) >> 1) + j - 1] = value ? 1 : 0;
    }

    /**
     * Sets all elements to zero
     * @method reset
     */
    public reset (): void {
        this.matrix.length = 0;
    }

    /**
     * Sets the max number of objects
     * @param {Number} n
     */
    public setNumObjects (n: number): void {
        this.matrix.length = n * (n - 1) >> 1;
    }
}
