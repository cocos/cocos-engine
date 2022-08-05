// https://stackoverflow.com/questions/56714318/how-to-disable-multiple-rules-for-eslint-nextline?msclkid=5d4c2298ba7911eca34d0ab30591752e

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
