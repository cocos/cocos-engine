declare module 'pal/text-encoding' {
    export function encodeUtf8(text: string): Uint8Array;

    export function decodeUtf8(bytes: Uint8Array): string;
}
