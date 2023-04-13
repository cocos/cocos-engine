/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
const mismatchArray: number[] = [];
export class SpawnFractionCollection {
    get fraction () {
        return this._fraction;
    }

    get count () {
        return this._count;
    }

    get id () {
        return this._id;
    }

    get capacity () {
        return this._capacity;
    }

    private _capacity = 16;
    private _count = 0;
    private _id = new Uint32Array(this._capacity);
    private _fraction = new Float32Array(this._capacity);

    sync (id: Uint32Array, count: number) {
        const iterationTimes = Math.min(count, this._count);
        mismatchArray.length = 0;
        for (let i = 0; i < iterationTimes; i++) {
            if (this._id[i] === id[i]) {
                continue;
            } else {
                const mismatchId = this._id[i];
                for (let j = mismatchArray.length - 1; j >= 0; j--) {
                    if (id[mismatchArray[j]] === mismatchId) {
                        this._fraction[mismatchArray[j]] = this._fraction[i];
                        mismatchArray[j] = mismatchArray[mismatchArray.length - 1];
                        mismatchArray.length--;
                    }
                }
                mismatchArray.push(i);
                this._id[i] = id[i];
                this._fraction[i] = 0;
            }
        }
        if (count < this._count) {
            for (let i = count; i < this._count; i++) {
                const mismatchId = this._id[i];
                for (let j = mismatchArray.length - 1; j >= 0; j--) {
                    const mismatchIndex = mismatchArray[j];
                    if (id[mismatchIndex] === mismatchId) {
                        this._fraction[mismatchIndex] = this._fraction[i];
                        mismatchArray[j] = mismatchArray[mismatchArray.length - 1];
                        mismatchArray.length--;
                    }
                }
            }
        } else if (count > this._count) {
            for (let i = this._count; i < count; i++) {
                this._id[i] = id[i];
                this._fraction[i] = 0;
            }
        }
        this._count = count;
    }

    reserve (capacity: number) {
        if (capacity > this._capacity) {
            const oldFraction = this._fraction;
            const oldId = this._id;
            this._fraction = new Float32Array(capacity);
            this._fraction.set(oldFraction);
            this._id = new Uint32Array(capacity);
            this._id.set(oldId);
            this._capacity = capacity;
        }
    }
}
