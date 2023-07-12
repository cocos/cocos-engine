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
            const temp = j;
            j = i;
            i = temp;
        }
        return this.data[`${i}-${j}`] as T;
    }

    /**
     * @method set
     * @param  {number} i
     * @param  {number} j
     * @param {Object} value
     */
    public set<T> (i: number, j: number, value: T): T {
        if (i > j) {
            const temp = j;
            j = i;
            i = temp;
        }
        const key = `${i}-${j}`;

        if (value == null) {
            const idx = this.data.keys.indexOf(key);
            if (idx !== -1) {
                this.data.keys.splice(idx, 1);
                delete this.data[key];
                return value;
            }
        }

        // Check if key already exists
        if (!this.get(i, j)) {
            this.data.keys.push(key);
        }

        this.data[key] = value;
        return this.data[key] as T;
    }

    /**
     * @method reset
     */
    public reset (): void {
        this.data = { keys: [] };
    }

    /**
     * @method getLength
     */
    public getLength (): number {
        return this.data.keys.length;
    }

    /**
     * @method getKeyByIndex
     * @param {number} index
     */
    public getKeyByIndex (index: number): string {
        return this.data.keys[index];
    }

    /**
     * @method getDataByKey
     * @param {string} Key
     */
    public getDataByKey<T> (Key: string): T {
        return this.data[Key] as T;
    }
}
