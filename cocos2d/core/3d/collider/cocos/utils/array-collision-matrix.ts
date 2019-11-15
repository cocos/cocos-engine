/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

/**
 * Collision "matrix". It's actually a triangular-shaped array of whether two bodies are touching this step, for reference next step
 */
export class ArrayCollisionMatrix {

    /**
     * !#en The matrix storage
     * @property matrix
     * @type {Array}
     */
    public matrix: number[] = [];

    /**
     * !#en Get an element
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
     * !#en Set an element
     * @method set
     * @param {Number} i
     * @param {Number} j
     * @param {boolean} value
     */
    public set (i: number, j: number, value: boolean) {
        if (j > i) {
            const temp = j;
            j = i;
            i = temp;
        }
        this.matrix[(i * (i + 1) >> 1) + j - 1] = value ? 1 : 0;
    }

    /**
     * !#en Sets all elements to zero
     * @method reset
     */
    public reset () {
        for (let i = 0, l = this.matrix.length; i !== l; i++) {
            this.matrix[i] = 0;
        }
    }

    /**
     * !#en Sets the max number of objects
     * @param {Number} n
     */
    public setNumObjects (n: number) {
        this.matrix.length = n * (n - 1) >> 1;
    }

}
