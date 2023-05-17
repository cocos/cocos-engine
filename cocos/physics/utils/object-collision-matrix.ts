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
 * Records what objects are colliding with each other
 * @class ObjectCollisionMatrix
 * @constructor
 */
export class ObjectCollisionMatrix {
    /**
     * The matrix storage
     */
    public matrix: Record<string, unknown>;

    constructor () {
        this.matrix = {};
    }

    /**
     * @method get
     * @param  {number} i
     * @param  {number} j
     * @return
     */
    public get<T> (i: number, j: number): T {
        if (j > i) {
            const temp = j;
            j = i;
            i = temp;
        }
        return this.matrix[`${i}-${j}`] as T;
    }

    /**
     * @method set
     * @param  {number} i
     * @param  {number} j
     * @param {number} value
     */
    public set<T> (i: number, j: number, value: T) {
        if (j > i) {
            const temp = j;
            j = i;
            i = temp;
        }
        this.matrix[`${i}-${j}`] = value;
    }

    /**
     * Empty the matrix
     * @method reset
     */
    public reset () {
        this.matrix = {};
    }
}
