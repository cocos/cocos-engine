// https://stackoverflow.com/questions/56714318/how-to-disable-multiple-rules-for-eslint-nextline?msclkid=5d4c2298ba7911eca34d0ab30591752e

import { Type } from '../../gfx/base/define';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function replacer (key: unknown, value: unknown) {
    if (value instanceof Map) {
        return {
            meta_t: 'Map',
            value: Array.from(value.entries()).sort((a, b) => String(a[0]).localeCompare(b[0])),
        };
    } else if (value instanceof Set) {
        return {
            meta_t: 'Set',
            value: Array.from(value).sort(),
        };
    }
    return value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export function reviver (key: unknown, value: any) {
    if (typeof value === 'object' && value !== null) {
        if (value.meta_t === 'Map') {
            return new Map(value.value);
        } else if (value.meta_t === 'Set') {
            return new Set(value.value);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
}

export function stringify (data: unknown, space?: string | number | undefined) {
    return JSON.stringify(data, replacer, space);
}

export function parse (text: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(text, reviver);
}

export function getUBOTypeCount (type: Type): number {
    switch (type) {
    case Type.BOOL:
    case Type.INT:
    case Type.UINT:
    case Type.FLOAT:
        return 1;
    case Type.INT2:
    case Type.FLOAT2:
    case Type.UINT2:
    case Type.BOOL2:
        return 2;
    case Type.FLOAT3:
    case Type.BOOL3:
    case Type.UINT3:
    case Type.INT3:
        return 3;
    case Type.BOOL4:
    case Type.FLOAT4:
    case Type.UINT4:
    case Type.INT4:
        return 4;
    case Type.MAT2:
        return 4;
    case Type.MAT2X3:
    case Type.MAT3X2:
        return 6;
    case Type.MAT2X4:
    case Type.MAT4X2:
        return 8;
    case Type.MAT3:
        return 9;
    case Type.MAT3X4:
    case Type.MAT4X3:
        return 12;
    case Type.MAT4:
        return 16;
    default:
        return 0;
    }
}
