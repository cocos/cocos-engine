/**
 * @class TupleDictionary
 * @constructor
 */
export class TupleDictionary {

    /**
     * The data storage
     */
    public data: { keys: string[] };

    constructor () {
        this.data = { keys: [] };
    }

    /**
     * @method get
     * @param  {number} i
     * @param  {number} j
     * @return {Object}
     */
    public get<T> (i: number, j: number): T {
        if (i > j) {
            // swap
            var temp = j;
            j = i;
            i = temp;
        }
        return this.data[i + '-' + j];
    };

    /**
     * @method set
     * @param  {number} i
     * @param  {number} j
     * @param {Object} value
     */
    public set<T> (i: number, j: number, value: T): T {

        if (i > j) {
            var temp = j;
            j = i;
            i = temp;
        }
        var key = i + '-' + j;

        if (value == null) {
            let idx = this.data.keys.indexOf(key);
            if (idx != -1) {
                this.data.keys.splice(idx, 1);
                delete this.data[key!];
                return value;
            }
        }

        // Check if key already exists
        if (!this.get(i, j)) {
            this.data.keys.push(key);
        }

        this.data[key] = value;
        return this.data[key];
    };

    /**
     * @method reset
     */
    public reset () {
        var data = this.data,
            keys = data.keys;
        while (keys.length > 0) {
            var key = keys.pop();
            delete data[key!];
        }
    };

    /**
     * @method getLength
     */
    public getLength () {
        return this.data.keys.length;
    };

    /**
     * @method getKeyByIndex
     * @param {number} index
     */
    public getKeyByIndex (index: number) {
        return this.data.keys[index];
    };

    /**
     * @method getDataByKey
     * @param {string} Key
     */
    public getDataByKey<T> (Key: string): T {
        return this.data[Key];
    };

}