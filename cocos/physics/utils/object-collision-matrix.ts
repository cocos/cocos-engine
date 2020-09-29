/**
 * Records what objects are colliding with each other
 * @class ObjectCollisionMatrix
 * @constructor
 */
export class ObjectCollisionMatrix {

    /**
     * The matrix storage
     */
    public matrix: {};

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
            var temp = j;
            j = i;
            i = temp;
        }
        return this.matrix[i + '-' + j];
    };

    /**
     * @method set
     * @param  {number} i
     * @param  {number} j
     * @param {number} value
     */
    public set<T> (i: number, j: number, value: T) {
        if (j > i) {
            var temp = j;
            j = i;
            i = temp;
        }
        this.matrix[i + '-' + j] = value;
    };

    /**
     * Empty the matrix
     * @method reset
     */
    public reset () {
        this.matrix = {};
    };
}