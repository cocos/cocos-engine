/*
 * Copyright (c) 2014 Ion Drive Software Ltd.
 * Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

class Decoder {
    private _offset = 0;
    get offset (): number {
        return this._offset;
    }

    private _buffer: ArrayBuffer;
    private _view: DataView;
    constructor (buffer: ArrayBuffer | Uint8Array) {
        if (buffer instanceof ArrayBuffer) {
            this._buffer = buffer;
            this._view = new DataView(this._buffer);
        } else if (ArrayBuffer.isView(buffer)) {
            this._buffer = buffer.buffer;
            this._view = new DataView(this._buffer, buffer.byteOffset, buffer.byteLength);
        } else {
            throw new Error('Invalid argument');
        }
    }

    private _array (length: number): unknown[] {
        const value = new Array(length);
        for (let i = 0; i < length; i++) {
            value[i] = this.parse();
        }
        return value;
    }

    private _map (length: number): any {
        let key = ''; const value = {};
        for (let i = 0; i < length; i++) {
            key = this.parse();
            value[key] = this.parse();
        }
        return value;
    }

    private _str (length: number): string {
        const value = utf8Read(this._view, this._offset, length);
        this._offset += length;
        return value;
    }

    private _bin (length: number): ArrayBuffer {
        const value = this._buffer.slice(this._offset, this._offset + length);
        this._offset += length;
        return value;
    }

    parse (): any {
        const prefix = this._view.getUint8(this._offset++);
        let value; let length = 0; let type = 0; let hi = 0; let lo = 0;

        if (prefix < 0xc0) {
            // positive fixint
            if (prefix < 0x80) {
                return prefix;
            }
            // fixmap
            if (prefix < 0x90) {
                return this._map(prefix & 0x0f);
            }
            // fixarray
            if (prefix < 0xa0) {
                return this._array(prefix & 0x0f);
            }
            // fixstr
            return this._str(prefix & 0x1f);
        }

        // negative fixint
        if (prefix > 0xdf) {
            return (0xff - prefix + 1) * -1;
        }

        switch (prefix) {
        // nil
        case 0xc0:
            return null;
            // false
        case 0xc2:
            return false;
            // true
        case 0xc3:
            return true;

            // bin
        case 0xc4:
            length = this._view.getUint8(this._offset);
            this._offset += 1;
            return this._bin(length);
        case 0xc5:
            length = this._view.getUint16(this._offset);
            this._offset += 2;
            return this._bin(length);
        case 0xc6:
            length = this._view.getUint32(this._offset);
            this._offset += 4;
            return this._bin(length);

            // ext
        case 0xc7:
            length = this._view.getUint8(this._offset);
            type = this._view.getInt8(this._offset + 1);
            this._offset += 2;
            if (type === -1) {
                // timestamp 96
                const ns = this._view.getUint32(this._offset);
                hi = this._view.getInt32(this._offset + 4);
                lo = this._view.getUint32(this._offset + 8);
                this._offset += 12;
                return new Date((hi * 0x100000000 + lo) * 1e3 + ns / 1e6);
            }
            return [type, this._bin(length)];
        case 0xc8:
            length = this._view.getUint16(this._offset);
            type = this._view.getInt8(this._offset + 2);
            this._offset += 3;
            return [type, this._bin(length)];
        case 0xc9:
            length = this._view.getUint32(this._offset);
            type = this._view.getInt8(this._offset + 4);
            this._offset += 5;
            return [type, this._bin(length)];

            // float
        case 0xca:
            value = this._view.getFloat32(this._offset);
            this._offset += 4;
            return value;
        case 0xcb:
            value = this._view.getFloat64(this._offset);
            this._offset += 8;
            return value;

            // uint
        case 0xcc:
            value = this._view.getUint8(this._offset);
            this._offset += 1;
            return value;
        case 0xcd:
            value = this._view.getUint16(this._offset);
            this._offset += 2;
            return value;
        case 0xce:
            value = this._view.getUint32(this._offset);
            this._offset += 4;
            return value;
        case 0xcf:
            hi = this._view.getUint32(this._offset) * 2 ** 32;
            lo = this._view.getUint32(this._offset + 4);
            this._offset += 8;
            return hi + lo;

            // int
        case 0xd0:
            value = this._view.getInt8(this._offset);
            this._offset += 1;
            return value;
        case 0xd1:
            value = this._view.getInt16(this._offset);
            this._offset += 2;
            return value;
        case 0xd2:
            value = this._view.getInt32(this._offset);
            this._offset += 4;
            return value;
        case 0xd3:
            hi = this._view.getInt32(this._offset) * 2 ** 32;
            lo = this._view.getUint32(this._offset + 4);
            this._offset += 8;
            return hi + lo;

            // fixext
        case 0xd4:
            type = this._view.getInt8(this._offset);
            this._offset += 1;
            if (type === 0x00) {
                // custom encoding for 'undefined' (kept for backward-compatibility)
                this._offset += 1;
                return undefined;
            }
            return [type, this._bin(1)];
        case 0xd5:
            type = this._view.getInt8(this._offset);
            this._offset += 1;
            return [type, this._bin(2)];
        case 0xd6:
            type = this._view.getInt8(this._offset);
            this._offset += 1;
            if (type === -1) {
                // timestamp 32
                value = this._view.getUint32(this._offset);
                this._offset += 4;
                return new Date(value * 1e3);
            }
            return [type, this._bin(4)];
        case 0xd7:
            type = this._view.getInt8(this._offset);
            this._offset += 1;
            if (type === 0x00) {
                // custom date encoding (kept for backward-compatibility)
                hi = this._view.getInt32(this._offset) * 2 ** 32;
                lo = this._view.getUint32(this._offset + 4);
                this._offset += 8;
                return new Date(hi + lo);
            }
            if (type === -1) {
                // timestamp 64
                hi = this._view.getUint32(this._offset);
                lo = this._view.getUint32(this._offset + 4);
                this._offset += 8;
                const s = (hi & 0x3) * 0x100000000 + lo;
                return new Date(s * 1e3 + (hi >>> 2) / 1e6);
            }
            return [type, this._bin(8)];
        case 0xd8:
            type = this._view.getInt8(this._offset);
            this._offset += 1;
            return [type, this._bin(16)];

            // str
        case 0xd9:
            length = this._view.getUint8(this._offset);
            this._offset += 1;
            return this._str(length);
        case 0xda:
            length = this._view.getUint16(this._offset);
            this._offset += 2;
            return this._str(length);
        case 0xdb:
            length = this._view.getUint32(this._offset);
            this._offset += 4;
            return this._str(length);

            // array
        case 0xdc:
            length = this._view.getUint16(this._offset);
            this._offset += 2;
            return this._array(length);
        case 0xdd:
            length = this._view.getUint32(this._offset);
            this._offset += 4;
            return this._array(length);

            // map
        case 0xde:
            length = this._view.getUint16(this._offset);
            this._offset += 2;
            return this._map(length);
        case 0xdf:
            length = this._view.getUint32(this._offset);
            this._offset += 4;
            return this._map(length);
        default:
        }

        throw new Error('Could not parse');
    }
}

function utf8Read (view: DataView, offset: number, length: number): string {
    let string = ''; let chr = 0;
    for (let i = offset, end = offset + length; i < end; i++) {
        const byte = view.getUint8(i);
        if ((byte & 0x80) === 0x00) {
            string += String.fromCharCode(byte);
            continue;
        }
        if ((byte & 0xe0) === 0xc0) {
            string += String.fromCharCode(
                ((byte & 0x1f) << 6)
                | (view.getUint8(++i) & 0x3f),
            );
            continue;
        }
        if ((byte & 0xf0) === 0xe0) {
            string += String.fromCharCode(
                ((byte & 0x0f) << 12)
                | ((view.getUint8(++i) & 0x3f) << 6)
                | ((view.getUint8(++i) & 0x3f) << 0),
            );
            continue;
        }
        if ((byte & 0xf8) === 0xf0) {
            chr = ((byte & 0x07) << 18)
                | ((view.getUint8(++i) & 0x3f) << 12)
                | ((view.getUint8(++i) & 0x3f) << 6)
                | ((view.getUint8(++i) & 0x3f) << 0);
            if (chr >= 0x010000) { // surrogate pair
                chr -= 0x010000;
                string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
            } else {
                string += String.fromCharCode(chr);
            }
            continue;
        }
        throw new Error(`Invalid byte ${byte.toString(16)}`);
    }
    return string;
}

export function notepackDecode (buffer: ArrayBuffer): any {
    const decoder = new Decoder(buffer);
    const value = decoder.parse();
    if (decoder.offset !== buffer.byteLength) {
        throw new Error(`${buffer.byteLength - decoder.offset} trailing bytes`);
    }
    return value;
}
