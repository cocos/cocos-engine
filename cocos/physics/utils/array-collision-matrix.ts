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
    public set (i: number, j: number, value: boolean) {
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
    public reset () {
        this.matrix.length = 0;
    }

    /**
     * Sets the max number of objects
     * @param {Number} n
     */
    public setNumObjects (n: number) {
        this.matrix.length = n * (n - 1) >> 1;
    }

}
