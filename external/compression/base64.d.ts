
declare namespace Base64 {
    export const name: string;

    export function decode(input: string): string;

    export function decodeAsArray(input: string): number[];
}

export default Base64;
