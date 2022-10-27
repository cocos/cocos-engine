import { OutputArchive, InputArchive } from './archive';

export class BinaryOutputArchive implements OutputArchive {
    constructor () {
        this.capacity = 4096;
        this.buffer = new Uint8Array(this.capacity);
        this.dataView = new DataView(this.buffer);
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
        this.dataView = new DataView(this.buffer);
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
        const value = new Uint8Array(this.dataView.buffer, this.offset, length).toString();
        this.offset += length;
        return value;
    }
    offset = 0;
    dataView: DataView;
}
