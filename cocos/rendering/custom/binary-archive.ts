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

import { OutputArchive, InputArchive } from './archive';

export class BinaryOutputArchive implements OutputArchive {
    constructor () {
        this.capacity = 4096;
        this.buffer = new Uint8Array(this.capacity);
        this.dataView = new DataView(this.buffer.buffer);
    }
    writeBool (value: boolean): void {
        const newSize = this.size + 1;
        if (newSize > this.capacity) {
            this.reserve(newSize);
        }
        this.dataView.setUint8(this.size, value ? 1 : 0);
        this.size = newSize;
    }
    writeNumber (value: number): void {
        const newSize = this.size + 8;
        if (newSize > this.capacity) {
            this.reserve(newSize);
        }
        this.dataView.setFloat64(this.size, value, true);
        this.size = newSize;
    }
    writeString (value: string): void {
        this.writeNumber(value.length);
        const newSize = this.size + value.length;
        if (newSize > this.capacity) {
            this.reserve(newSize);
        }
        for (let i = 0; i < value.length; i++) {
            this.dataView.setUint8(this.size + i, value.charCodeAt(i));
        }
        this.size = newSize;
    }
    reserve (requiredSize: number): void {
        const newCapacity = Math.max(requiredSize, this.capacity * 2);
        const prevBuffer = this.buffer;
        this.buffer = new Uint8Array(newCapacity);
        this.buffer.set(prevBuffer);
        this.dataView = new DataView(this.buffer.buffer);
        this.capacity = newCapacity;
    }
    get data (): ArrayBuffer {
        return this.buffer.buffer.slice(0, this.size);
    }
    capacity = 0;
    size = 0;
    buffer: Uint8Array;
    dataView: DataView;
}

export class BinaryInputArchive implements InputArchive {
    constructor (data: ArrayBuffer) {
        this.dataView = new DataView(data);
    }
    readBool (): boolean {
        return this.dataView.getUint8(this.offset++) !== 0;
    }
    readNumber (): number {
        const value = this.dataView.getFloat64(this.offset, true);
        this.offset += 8;
        return value;
    }
    readString (): string {
        const length = this.readNumber();
        // we only support ascii string now, so we can use String.fromCharCode
        // see https://stackoverflow.com/questions/67057689/typscript-type-uint8array-is-missing-the-following-properties-from-type-numb
        // answer on stackoverflow might be wrong.
        // [[wrong]] const str =  String.fromCharCode.apply(null, [...new Uint8Array(this.dataView.buffer, this.offset, length)]);
        const str =  String.fromCharCode.apply(null, Array.from(new Uint8Array(this.dataView.buffer, this.offset, length)));
        this.offset += length;
        return str;
    }
    offset = 0;
    dataView: DataView;
}
