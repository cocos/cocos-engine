export class DataInput {
    // zh: 当前读取位置 (基于 Uint8Array 的索引), en: current read position (based on the index of Uint8Array)
    public cursor: number; 
    public data: Uint8Array;

    constructor(binary: Uint8Array) {
        this.data = binary;
        this.cursor = 0;
    }

    // zh: 获取剩余可读字节数, en: get remaining readable bytes
    get remaining(): number {
        return this.data.length - this.cursor;
    }
}

export class SkeletonBinary {
    public static readString(input: DataInput): string | null {
        const length = this.readVarint(input, true);
        if (length === 0) return null;

        // zh: 注意: 原 C++ 代码中 length - 1 是因为末尾有 \0, 
        // en: Note: length - 1 in original C++ code is because there is a \0 at the end
        const bytes = input.data.subarray(input.cursor, input.cursor + length - 1);
        input.cursor += length - 1;

        // zh: 转换为字符串 (假设是 UTF-8 编码), en: convert to string (assume it's UTF-8 encoding)
        return new TextDecoder().decode(bytes);
    }

    // zh: 读取变长整数 (Varint), en: read variable-length integer (Varint)
    public static readVarint(input: DataInput, optimizePositive: boolean): number {
        let value = 0;
        let shift = 0;
        let b: number;

        do {
            b = this.readByte(input);
            value |= (b & 0x7F) << shift;
            shift += 7;
        } while (b & 0x80 && shift < 32); // zh: 最多 5 字节 (32 bits), en: at most 5 bytes (32 bits)

        // zh: 处理符号优化, en: handle sign optimization
        if (!optimizePositive) {
            // zh: 无符号右移, en: unsigned right shift
            value = ((value >>> 1) ^ -(value & 1));
        }

        return value;
    }

    private static readByte(input: DataInput): number {
        if (input.cursor >= input.data.length) {
            throw new Error("Buffer underflow");
        }
        return input.data[input.cursor++];
    }

    public static readInt(input: DataInput): number {
        if (input.remaining < 4) throw new Error("Buffer underflow");

        const b1 = input.data[input.cursor++];
        const b2 = input.data[input.cursor++];
        const b3 = input.data[input.cursor++];
        const b4 = input.data[input.cursor++];

        // zh: 合并为大端序有符号整数, 
        // en: merge to big-endian signed integer
        const value = (b1 << 24) | (b2 << 16) | (b3 << 8) | b4;
        
        // zh: 转换为 32 位有符号整数 (处理溢出), 
        // en: convert to 32-bit signed integer (handle overflow)
        return value | 0; // 或 return value >> 0;
    }
}